// 離線批次：把考選部原卷裡「每一題自己的圖」裁出來，存成靜態 PNG 到 public/exam-figures/。
//
// 為什麼這樣做：一頁 PDF 常同時印多題、多圖，檔案沒有「圖屬於哪題」的資訊，
// 程式自動裁切在多圖頁會挑錯。既然題庫有限、又是離線一次性作業，最可靠的方式是
// 逐題用「人工核對過的裁切框」把該題的圖切出來。手機/雲端直接吃靜態檔，圖一定對。
//
// 裁切框 box = [x0, y0, x1, y1]，皆為「頁面比例」(0~1)，左上為原點。
// 我（開發時）會先 render 整頁、看圖在哪，再把該圖的範圍填進 box，render 後核對微調。
//
// 用法：
//   node scripts/prerender-exam-figures.mjs                      # 用內建 MANIFEST
//   node scripts/prerender-exam-figures.mjs my-manifest.json     # 用外部清單
//   node scripts/prerender-exam-figures.mjs --force              # 已存在也重產
//   node scripts/prerender-exam-figures.mjs --full s=1706 q=1    # 額外輸出整頁，方便定框

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { request as httpsRequest } from "node:https";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = process.cwd();
const PDFJS_ROOT = join(root, "node_modules", "pdfjs-dist");
const CMAP_URL = `${pathToFileURL(join(PDFJS_ROOT, "cmaps")).toString()}/`;
const STANDARD_FONTS_URL = `${pathToFileURL(join(PDFJS_ROOT, "standard_fonts")).toString()}/`;
const WASM_URL = `${pathToFileURL(join(PDFJS_ROOT, "wasm")).toString()}/`;
const OUT_DIR = join(root, "public", "exam-figures");
const TMP_DIR = join(root, ".tmp-figures");
const RENDER_SCALE = 2;

// 內建清單：114 年高考三級 土木工程（c=255）。box 為頁面比例 [x0,y0,x1,y1]，
// 由開發時 render 整頁核對而得。沒有 box 的題目代表該題無圖、不需附圖。
const MANIFEST = [
  // 土壤力學（s=1706）第 1 題：土壤粒徑分布曲線（頁面下半）
  { code: "114080", c: "255", s: "1706", q: 1, page: 1, box: [0.05, 0.565, 0.95, 0.915] },
];

function moexUrl({ code, c, s }) {
  return `https://wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx?t=Q&code=${code}&c=${c}&s=${s}&q=1`;
}

// ⚠️ 與 lib/examFigure.ts 的 examFigureSlug 保持一致（逐題）。
function examFigureSlug({ code, c, s, q }) {
  return `moex-${code}-${c}-${s}-q${Math.floor(q)}`;
}

function downloadPdf(url) {
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      url,
      { method: "GET", headers: { "User-Agent": "Mozilla/5.0" }, rejectUnauthorized: false },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on("end", () => {
          if ((res.statusCode ?? 500) >= 400) {
            reject(new Error(`MOEX HTTP ${res.statusCode}`));
            return;
          }
          resolve(Buffer.concat(chunks));
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error("MOEX PDF request timed out."));
    });
    req.end();
  });
}

const pdfCache = new Map();
function getPdf(url) {
  if (!pdfCache.has(url)) {
    pdfCache.set(url, downloadPdf(url));
  }
  return pdfCache.get(url);
}

// 渲染整頁，回傳 { canvasFactory, canvasAndContext, width, height }，呼叫端負責 destroy。
async function renderPage(pdfBuffer, page) {
  const doc = await getDocument({
    data: new Uint8Array(pdfBuffer),
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONTS_URL,
    wasmUrl: WASM_URL,
    isEvalSupported: false,
  }).promise;

  if (page > doc.numPages) {
    await doc.destroy();
    return null;
  }

  const pdfPage = await doc.getPage(page);
  const viewport = pdfPage.getViewport({ scale: RENDER_SCALE });
  const canvasFactory = doc.canvasFactory;
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  await pdfPage.render({
    canvasContext: canvasAndContext.context,
    canvas: canvasAndContext.canvas,
    viewport,
  }).promise;

  return {
    doc,
    canvasFactory,
    canvasAndContext,
    width: canvasAndContext.canvas.width,
    height: canvasAndContext.canvas.height,
  };
}

function cropToPng(rendered, box) {
  const { canvasFactory, canvasAndContext, width, height } = rendered;
  const [x0, y0, x1, y1] = box;
  const sx = Math.max(0, Math.floor(x0 * width));
  const sy = Math.max(0, Math.floor(y0 * height));
  const sw = Math.min(width - sx, Math.ceil((x1 - x0) * width));
  const sh = Math.min(height - sy, Math.ceil((y1 - y0) * height));

  const target = canvasFactory.create(sw, sh);
  target.context.fillStyle = "#ffffff";
  target.context.fillRect(0, 0, sw, sh);
  target.context.drawImage(canvasAndContext.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  const png = target.canvas.toBuffer("image/png");
  canvasFactory.destroy(target);
  return png;
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const fullMode = argv.includes("--full");
  const manifestPath = argv.find((a) => a.endsWith(".json"));

  await mkdir(OUT_DIR, { recursive: true });

  let manifest = MANIFEST;
  if (manifestPath) {
    manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  }

  // --full：另存整頁到 .tmp-figures/，方便我看圖定 box（不進 git）。
  if (fullMode) {
    await mkdir(TMP_DIR, { recursive: true });
    const sFilter = argv.find((a) => a.startsWith("s="))?.slice(2);
    for (const entry of manifest) {
      if (sFilter && entry.s !== sFilter) continue;
      const rendered = await renderPage(await getPdf(moexUrl(entry)), entry.page);
      if (!rendered) continue;
      const png = rendered.canvasAndContext.canvas.toBuffer("image/png");
      rendered.canvasFactory.destroy(rendered.canvasAndContext);
      await rendered.doc.destroy();
      const out = join(TMP_DIR, `full-${entry.s}-p${entry.page}.png`);
      await writeFile(out, png);
      console.log(`▣ 整頁 ${out}（${rendered.width}x${rendered.height}）`);
    }
    return;
  }

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of manifest) {
    if (!entry.box) {
      continue; // 無圖題目
    }
    const slug = examFigureSlug(entry);
    const outPath = join(OUT_DIR, `${slug}.png`);

    if (!force && (await fileExists(outPath))) {
      console.log(`· 已存在，略過 ${slug}.png`);
      skipped += 1;
      continue;
    }

    try {
      const rendered = await renderPage(await getPdf(moexUrl(entry)), entry.page);
      if (!rendered) {
        console.warn(`✗ 第 ${entry.page} 頁不存在：${slug}`);
        failed += 1;
        continue;
      }
      const png = cropToPng(rendered, entry.box);
      rendered.canvasFactory.destroy(rendered.canvasAndContext);
      await rendered.doc.destroy();
      await writeFile(outPath, png);
      console.log(`✓ ${slug}.png（${(png.length / 1024).toFixed(0)} KB）`);
      ok += 1;
    } catch (error) {
      console.warn(`✗ 產生失敗 ${slug}：${error?.message ?? error}`);
      failed += 1;
    }
  }

  console.log(`\n完成：成功 ${ok}、略過 ${skipped}、失敗 ${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
