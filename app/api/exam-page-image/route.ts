import { NextRequest, NextResponse } from "next/server";
import { request as httpsRequest } from "node:https";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { getDocument, OPS, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// pdfjs 在 Node 端會自動採用內建的 NodeCanvasFactory（依賴 @napi-rs/canvas）。
// 提供 cMap 與標準字型路徑，確保考選部 PDF 的中文與特殊字型能正確渲染。
const PDFJS_ROOT = join(process.cwd(), "node_modules", "pdfjs-dist");
const CMAP_URL = `${pathToFileURL(join(PDFJS_ROOT, "cmaps")).toString()}/`;
const STANDARD_FONTS_URL = `${pathToFileURL(join(PDFJS_ROOT, "standard_fonts")).toString()}/`;
// 部分考選部試題圖檔以 JPEG2000(JPX) 儲存，需 OpenJPEG wasm 才能解碼，
// 否則圖會渲染成空白。提供 wasm 路徑給 pdfjs。
const WASM_URL = `${pathToFileURL(join(PDFJS_ROOT, "wasm")).toString()}/`;
// Turbopack dev 編譯後 chunk 路徑與 pdfjs 預期不同，明確指定 worker 檔案路徑，
// 避免「Setting up fake worker failed」錯誤。
GlobalWorkerOptions.workerSrc = pathToFileURL(
  join(PDFJS_ROOT, "legacy", "build", "pdf.worker.mjs"),
).toString();

const RENDER_SCALE = 2;
const MAX_PAGE = 50;
// 裁切相關參數（單位：已渲染的裝置像素，即 RENDER_SCALE 後）
const CROP_PADDING = 18;
const CLUSTER_GAP = 90; // 垂直群聚切割門檻
const TEXT_UNION_MARGIN = 40; // 主圖叢集向外擴張、納入鄰近文字標籤的範圍
// 考選部每頁固定有「代號／類科／科目／座號」表頭，其框線會被誤判為圖。
// 略過頁面最上方這段帶狀區域，避免裁到表頭。
const HEADER_BAND_RATIO = 0.14;
// 字型 glyph path 偽陽性過濾門檻：個別路徑 box 在「寬」和「高」都小於此值時視為字型字形，略過。
// 真實圖形（橫線、表格框線、圖表曲線）至少一個方向會超過此值；字形 glyph 兩個方向通常都 < 45px。
const MIN_GRAPHIC_DIM = 48; // device pixels (= 24 pt at RENDER_SCALE=2)

const pdfCache = new Map<string, Promise<Buffer>>();
const imageCache = new Map<string, Promise<Buffer | null>>();

type Box = { minX: number; minY: number; maxX: number; maxY: number };

function isAllowedQuestionPdfUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname === "wwwq.moex.gov.tw"
      && url.pathname === "/exam/wHandExamQandA_File.ashx"
      && url.searchParams.get("t") === "Q";
  } catch {
    return false;
  }
}

function downloadPdf(url: string) {
  if (!pdfCache.has(url)) {
    pdfCache.set(url, new Promise<Buffer>((resolve, reject) => {
      const req = httpsRequest(
        url,
        {
          method: "GET",
          headers: { "User-Agent": "Mozilla/5.0" },
          rejectUnauthorized: false,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          });
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
    }).catch((error) => {
      pdfCache.delete(url);
      throw error;
    }));
  }

  return pdfCache.get(url)!;
}

// PDF 矩陣相乘，沿用 pdfjs Util.transform 的約定。
function multiplyMatrix(m1: number[], m2: number[]): number[] {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

function applyMatrix(m: number[], x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

// 把「使用者座標系」的矩形四角，經 CTM 與 viewport 轉成裝置像素 bbox。
function rectToDeviceBox(
  ctm: number[],
  rect: ArrayLike<number>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
): Box {
  const corners: Array<[number, number]> = [
    [rect[0], rect[1]],
    [rect[2], rect[1]],
    [rect[2], rect[3]],
    [rect[0], rect[3]],
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [px, py] of corners) {
    const [ux, uy] = applyMatrix(ctm, px, py);
    const [vx, vy] = viewport.convertToViewportPoint(ux, uy);
    minX = Math.min(minX, vx);
    minY = Math.min(minY, vy);
    maxX = Math.max(maxX, vx);
    maxY = Math.max(maxY, vy);
  }

  return { minX, minY, maxX, maxY };
}

function isFiniteBox(box: Box) {
  return Number.isFinite(box.minX) && Number.isFinite(box.minY)
    && Number.isFinite(box.maxX) && Number.isFinite(box.maxY)
    && box.maxX > box.minX && box.maxY > box.minY;
}

function unionBox(a: Box, b: Box): Box {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

// 蒐集頁面所有「繪圖元件」(向量路徑 + 影像) 的裝置像素 bbox。
async function collectGraphicsBoxes(
  pdfPage: Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>["promise"]>["getPage"]>>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
  headerCutoff: number,
): Promise<Box[]> {
  const opList = await pdfPage.getOperatorList();
  const boxes: Box[] = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  const stack: number[][] = [];

  const pushBox = (box: Box) => {
    // 完全落在表頭帶狀區域內的繪圖元件直接略過。
    if (box.maxY <= headerCutoff) {
      return;
    }
    // 過濾字型字形 glyph path：若寬與高都小於門檻，判定為字型輪廓路徑（非真實圖形）而略過。
    // 真實圖形（橫線、表格框線、圖表曲線）在寬或高至少一個方向會超過 MIN_GRAPHIC_DIM。
    const w = box.maxX - box.minX;
    const h = box.maxY - box.minY;
    if (w < MIN_GRAPHIC_DIM && h < MIN_GRAPHIC_DIM) {
      return;
    }
    boxes.push(box);
  };

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i] as unknown[];

    if (fn === OPS.save) {
      stack.push(ctm);
    } else if (fn === OPS.restore) {
      ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0];
    } else if (fn === OPS.transform) {
      ctm = multiplyMatrix(ctm, args as number[]);
    } else if (fn === OPS.constructPath) {
      const minMax = args[2] as ArrayLike<number> | undefined;
      if (minMax && minMax.length >= 4) {
        const box = rectToDeviceBox(ctm, minMax, viewport);
        if (isFiniteBox(box)) {
          pushBox(box);
        }
      }
    } else if (
      fn === OPS.paintImageXObject
      || fn === OPS.paintInlineImageXObject
      || fn === OPS.paintImageMaskXObject
    ) {
      // 影像繪在單位方塊 [0,0,1,1]，經 CTM 變換後即其位置。
      const box = rectToDeviceBox(ctm, [0, 0, 1, 1], viewport);
      if (isFiniteBox(box)) {
        pushBox(box);
      }
    }
  }

  return boxes;
}

function boxArea(b: Box) {
  return Math.max(0, b.maxX - b.minX) * Math.max(0, b.maxY - b.minY);
}

// 以垂直間隔把繪圖元件分群，回傳每個叢集（聯集框 + 元件數）。
function clusterBoxes(boxes: Box[]): Array<{ box: Box; count: number }> {
  if (boxes.length === 0) {
    return [];
  }

  const sorted = [...boxes].sort((a, b) => a.minY - b.minY);
  const clusters: Array<{ box: Box; count: number }> = [];
  let current: { box: Box; count: number; bottom: number } | null = null;

  for (const box of sorted) {
    if (current && box.minY - current.bottom > CLUSTER_GAP) {
      clusters.push({ box: current.box, count: current.count });
      current = null;
    }

    if (!current) {
      current = { box: { ...box }, count: 1, bottom: box.maxY };
    } else {
      current.box = unionBox(current.box, box);
      current.count += 1;
      current.bottom = Math.max(current.bottom, box.maxY);
    }
  }

  if (current) {
    clusters.push({ box: current.box, count: current.count });
  }

  return clusters;
}

// 以垂直間隔把繪圖元件分群，回傳「面積最大」的主叢集聯集框。
function pickDominantCluster(boxes: Box[]): Box | null {
  const clusters = clusterBoxes(boxes);

  // 以「叢集所佔面積」挑主圖：向量圖（多條線段）與點陣圖（單一影像、count=1）
  // 都能正確勝出，避免被表頭那種「元件多但面積小」的框線干擾。
  clusters.sort((a, b) => boxArea(b.box) - boxArea(a.box));
  const best = clusters[0];

  // 單一元件且面積極小者多半是雜訊；但只要有一定面積就接受（涵蓋點陣圖）。
  if (!best) {
    return null;
  }
  if (best.count < 4 && boxArea(best.box) < 1) {
    return null;
  }

  return best.box;
}

// 申論題在原卷以「中文數字 + 頓號」標號（一、二、三…）。把標號轉成題號數字。
const CN_DIGITS: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};
function parseCnNumeral(label: string): number | null {
  const s = label.trim();
  if (s.length === 1) {
    return CN_DIGITS[s] ?? null;
  }
  if (s[0] === "十") {
    return 10 + (CN_DIGITS[s[1]] ?? 0);
  }
  if (s[1] === "十") {
    return (CN_DIGITS[s[0]] ?? 0) * 10 + (s[2] ? CN_DIGITS[s[2]] ?? 0 : 0);
  }
  return null;
}

// 取頁面上每個「題號標號」的 device-Y（top 為原點）。
// 判準：文字項目位於左邊界、且以「中文數字 + 頓號/句點」開頭。
async function findQuestionLabelYs(
  pdfPage: Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>["promise"]>["getPage"]>>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
): Promise<Map<number, number>> {
  const labels = new Map<number, number>();
  try {
    const textContent = await pdfPage.getTextContent();
    const items: Array<{ str: string; x: number; y: number }> = [];
    for (const item of textContent.items) {
      if (!("transform" in item) || !Array.isArray(item.transform)) {
        continue;
      }
      const [, , , , e, f] = item.transform as number[];
      const [x, y] = viewport.convertToViewportPoint(e, f);
      items.push({ str: typeof item.str === "string" ? item.str : "", x, y });
    }
    if (items.length === 0) {
      return labels;
    }
    const leftEdge = Math.min(...items.map((i) => i.x));
    for (const it of items) {
      if (it.x > leftEdge + 40) {
        continue; // 非行首左邊界，略過（排除內文中的「一定」等）
      }
      const m = it.str.match(/^\s*([一二三四五六七八九十]{1,3})[、.]/);
      if (!m) {
        continue;
      }
      const n = parseCnNumeral(m[1]);
      if (n != null && !labels.has(n)) {
        labels.set(n, it.y);
      }
    }
  } catch {
    // 取文字失敗就回空 Map，呼叫端會退回整頁邏輯。
  }
  return labels;
}

// 針對「指定題號」算出該題的附圖裁切框：
// 1) 以題號標號定出題塊上下界（本題標號 Y → 下一題標號 Y，或頁底）。
// 2) 取落在題塊內的繪圖叢集中面積最大者為圖。
// 3) 併入鄰近文字（座標軸標籤等）、加邊距、做尺寸保底。
async function computeQuestionFigureBox(
  pdfPage: Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>["promise"]>["getPage"]>>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
  fullWidth: number,
  fullHeight: number,
  questionNumber: number,
): Promise<Box | null> {
  const labels = await findQuestionLabelYs(pdfPage, viewport);
  const topY = labels.get(questionNumber);
  if (topY == null) {
    return null; // 該頁找不到此題標號 → 交回呼叫端退回（可能不在這頁）。
  }

  // 下一題（Y 比本題大且最接近者）的標號 Y；沒有則到頁底。
  let bottomY = fullHeight;
  for (const y of labels.values()) {
    if (y > topY + 5 && y < bottomY) {
      bottomY = y;
    }
  }

  // 先在題塊內搜尋「【參考資料】」或「【提示】」文字標記。
  // 若找到，直接以該行的 Y 座標為裁切上緣（整個參考資料區從那裡到題塊底）；
  // 這樣就不依賴圖形叢集偵測，對含公式/表格的參考資料區最可靠。
  let refSectionTopY: number | null = null;
  try {
    const refTc = await pdfPage.getTextContent();
    for (const item of refTc.items) {
      if (!("transform" in item) || !Array.isArray(item.transform)) {
        continue;
      }
      const str = typeof item.str === "string" ? item.str : "";
      if (!str.includes("參考資料") && !str.includes("【提示】")) {
        continue;
      }
      const [, , , , e, f] = item.transform as number[];
      const [, vy] = viewport.convertToViewportPoint(e, f);
      if (vy > topY && vy < bottomY) {
        refSectionTopY = vy;
        break;
      }
    }
  } catch {
    // 取文字失敗就繼續用叢集偵測
  }

  if (refSectionTopY != null) {
    // 直接裁「參考資料」區到題塊底
    const padded: Box = {
      minX: Math.max(0, CROP_PADDING),
      minY: Math.max(topY, refSectionTopY - CROP_PADDING * 2),
      maxX: Math.min(fullWidth, fullWidth - CROP_PADDING),
      maxY: Math.min(bottomY, bottomY),
    };
    const cropW = padded.maxX - padded.minX;
    const cropH = padded.maxY - padded.minY;
    if (cropW > 0 && cropH > fullHeight * 0.03) {
      return padded;
    }
  }

  const headerCutoff = fullHeight * HEADER_BAND_RATIO;
  const boxes = await collectGraphicsBoxes(pdfPage, viewport, headerCutoff);
  const clusters = clusterBoxes(boxes);

  // 取「起點在題塊內」的叢集（minY >= topY-5），挑面積最大者。
  // 用 minY 而非中心：避免橫跨題號標號上下的大叢集（如頁首+題幹文字）被誤選。
  const inBand = clusters
    .filter((cl) => cl.box.minY >= topY - 5 && cl.box.minY < bottomY)
    .sort((a, b) => boxArea(b.box) - boxArea(a.box));
  const figure = inBand[0]?.box;
  if (!figure) {
    return null; // 此題塊內沒有圖。
  }

  // 圖需有二維尺寸，否則多半是底線/雜訊。
  // 表格（h 可能僅數十 px）放寬高度門檻至 0.03；寬度保持 0.10。
  const fw = figure.maxX - figure.minX;
  const fh = figure.maxY - figure.minY;
  if (fh < fullHeight * 0.03 || fw < fullWidth * 0.10) {
    return null;
  }

  const withText = await unionNearbyText(pdfPage, viewport, figure);
  // 座標軸標籤都在圖的左/下/內，不會在圖的正上方；因此「上緣」鎖在繪圖叢集頂端，
  // 不向上併入文字，避免把圖正上方的題幹文字也裁進來。左/右/下緣才採文字聯集框。
  const padded: Box = {
    minX: Math.max(0, withText.minX - CROP_PADDING),
    minY: Math.max(topY, figure.minY - CROP_PADDING),
    maxX: Math.min(fullWidth, withText.maxX + CROP_PADDING),
    maxY: Math.min(bottomY, withText.maxY + CROP_PADDING),
  };

  const cropW = padded.maxX - padded.minX;
  const cropH = padded.maxY - padded.minY;
  if (cropW <= 0 || cropH <= 0) {
    return null;
  }
  return padded;
}

// 把落在主圖叢集附近的文字（座標軸標籤、(i)~(v) 等）一起納入。
async function unionNearbyText(
  pdfPage: Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>["promise"]>["getPage"]>>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
  figureBox: Box,
): Promise<Box> {
  const expanded: Box = {
    minX: figureBox.minX - TEXT_UNION_MARGIN,
    minY: figureBox.minY - TEXT_UNION_MARGIN,
    maxX: figureBox.maxX + TEXT_UNION_MARGIN,
    maxY: figureBox.maxY + TEXT_UNION_MARGIN,
  };

  let result = { ...figureBox };

  try {
    const textContent = await pdfPage.getTextContent();

    for (const item of textContent.items) {
      if (!("transform" in item) || !Array.isArray(item.transform)) {
        continue;
      }

      const [, , , , e, f] = item.transform as number[];
      const width = typeof item.width === "number" ? item.width : 0;
      const height = typeof item.height === "number" ? item.height : 0;
      const [x0, y0] = viewport.convertToViewportPoint(e, f);
      const [x1, y1] = viewport.convertToViewportPoint(e + width, f + height);
      const textBox: Box = {
        minX: Math.min(x0, x1),
        minY: Math.min(y0, y1),
        maxX: Math.max(x0, x1),
        maxY: Math.max(y0, y1),
      };

      const intersects = textBox.minX <= expanded.maxX && textBox.maxX >= expanded.minX
        && textBox.minY <= expanded.maxY && textBox.maxY >= expanded.minY;

      if (intersects) {
        result = unionBox(result, textBox);
      }
    }
  } catch {
    // 取文字失敗就只用繪圖框，不影響裁切。
  }

  return result;
}

async function renderPageToPng(url: string, page: number, crop: boolean, questionNumber: number | null) {
  const data = new Uint8Array(await downloadPdf(url));
  const doc = await getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONTS_URL,
    wasmUrl: WASM_URL,
    isEvalSupported: false,
  }).promise;

  try {
    const safePage = Math.min(Math.max(1, page), doc.numPages);
    const pdfPage = await doc.getPage(safePage);
    const viewport = pdfPage.getViewport({ scale: RENDER_SCALE });
    type CanvasContext2D = {
      fillStyle: string;
      fillRect: (x: number, y: number, w: number, h: number) => void;
      drawImage: (
        source: unknown,
        sx: number, sy: number, sw: number, sh: number,
        dx: number, dy: number, dw: number, dh: number,
      ) => void;
    };
    type FactoryCanvas = {
      canvas: {
        toBuffer: (mime: "image/png") => Buffer;
        width: number;
        height: number;
      };
      context: CanvasContext2D;
    };
    const canvasFactory = doc.canvasFactory as {
      create: (width: number, height: number) => FactoryCanvas;
      destroy: (canvasAndContext: unknown) => void;
    };
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

    await pdfPage.render({
      canvasContext: canvasAndContext.context as Parameters<typeof pdfPage.render>[0]["canvasContext"],
      canvas: canvasAndContext.canvas as unknown as Parameters<typeof pdfPage.render>[0]["canvas"],
      viewport,
    }).promise;

    const fullWidth = canvasAndContext.canvas.width;
    const fullHeight = canvasAndContext.canvas.height;

    if (crop) {
      // 指定題號時，用「題塊定位 → 帶內取圖」逐題裁切；否則用整頁主圖偵測。
      const cropBox = questionNumber != null
        ? await computeQuestionFigureBox(pdfPage, viewport, fullWidth, fullHeight, questionNumber)
        : await computeCropBox(pdfPage, viewport, fullWidth, fullHeight);

      // 逐題模式找不到圖：回傳 null 讓呼叫端以 404 表示「本題無圖」（前端據此隱藏）。
      if (questionNumber != null && !cropBox) {
        canvasFactory.destroy(canvasAndContext);
        return null;
      }

      if (cropBox) {
        const sx = Math.max(0, Math.floor(cropBox.minX));
        const sy = Math.max(0, Math.floor(cropBox.minY));
        const sw = Math.min(fullWidth - sx, Math.ceil(cropBox.maxX - cropBox.minX));
        const sh = Math.min(fullHeight - sy, Math.ceil(cropBox.maxY - cropBox.minY));

        if (sw > 0 && sh > 0) {
          // 用同一個 canvasFactory 建立裁切目標畫布（避免直接 import @napi-rs/canvas
          // 在 Next dev runtime 載入原生繫結失敗）。
          const target = canvasFactory.create(sw, sh);
          target.context.fillStyle = "#ffffff";
          target.context.fillRect(0, 0, sw, sh);
          target.context.drawImage(
            canvasAndContext.canvas,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            sw,
            sh,
          );
          const cropped = target.canvas.toBuffer("image/png");
          canvasFactory.destroy(target);
          canvasFactory.destroy(canvasAndContext);
          return cropped;
        }
      }
      // cropBox 為 null 或無效 → 退回整頁。
    }

    const png = canvasAndContext.canvas.toBuffer("image/png");
    canvasFactory.destroy(canvasAndContext);
    return png;
  } finally {
    await doc.destroy();
  }
}

// 算出裁切框；若信心不足回傳 null（呼叫端會退回整頁）。
async function computeCropBox(
  pdfPage: Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>["promise"]>["getPage"]>>,
  viewport: { convertToViewportPoint: (x: number, y: number) => number[] },
  fullWidth: number,
  fullHeight: number,
): Promise<Box | null> {
  const headerCutoff = fullHeight * HEADER_BAND_RATIO;
  const boxes = await collectGraphicsBoxes(pdfPage, viewport, headerCutoff);
  const dominant = pickDominantCluster(boxes);

  if (!dominant) {
    return null;
  }

  // 圖形是二維的：要求主圖框本身有一定的「高度」與「寬度」，
  // 才不會把表頭那種又寬又扁的座號底線、或極小的頁次方框誤判成圖。
  const dominantW = dominant.maxX - dominant.minX;
  const dominantH = dominant.maxY - dominant.minY;
  if (dominantH < fullHeight * 0.08 || dominantW < fullWidth * 0.12) {
    return null;
  }

  const withText = await unionNearbyText(pdfPage, viewport, dominant);
  const padded: Box = {
    minX: Math.max(0, withText.minX - CROP_PADDING),
    minY: Math.max(0, withText.minY - CROP_PADDING),
    maxX: Math.min(fullWidth, withText.maxX + CROP_PADDING),
    maxY: Math.min(fullHeight, withText.maxY + CROP_PADDING),
  };

  const cropW = padded.maxX - padded.minX;
  const cropH = padded.maxY - padded.minY;
  const pageArea = fullWidth * fullHeight;
  const cropArea = cropW * cropH;

  // 保底：太大（幾乎整頁，可能是表格框線）、太小（誤判）都退回整頁。
  if (cropArea > pageArea * 0.9) {
    return null;
  }
  if (cropH < fullHeight * 0.06 || cropW < fullWidth * 0.1) {
    return null;
  }

  return padded;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";
  const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const crop = request.nextUrl.searchParams.get("crop") === "1";
  const qParam = request.nextUrl.searchParams.get("q");
  const questionNumber = qParam != null && Number.isFinite(Number(qParam)) && Number(qParam) >= 1
    ? Math.floor(Number(qParam))
    : null;

  if (!isAllowedQuestionPdfUrl(url)) {
    return NextResponse.json({ error: "Invalid MOEX question paper request." }, { status: 400 });
  }

  if (!Number.isFinite(pageParam) || pageParam < 1 || pageParam > MAX_PAGE) {
    return NextResponse.json({ error: "Invalid page number." }, { status: 400 });
  }

  const page = Math.floor(pageParam);
  const cacheKey = `${url}::${page}::${crop ? "crop" : "full"}::q${questionNumber ?? "-"}`;

  if (!imageCache.has(cacheKey)) {
    imageCache.set(cacheKey, renderPageToPng(url, page, crop, questionNumber).catch((error) => {
      imageCache.delete(cacheKey);
      throw error;
    }));
  }

  try {
    const png = await imageCache.get(cacheKey)!;
    if (!png) {
      // 逐題模式：本題無圖。回 404，前端 onError 會隱藏圖片元素。
      return NextResponse.json({ error: "No figure for this question." }, { status: 404 });
    }
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to render exam page." },
      { status: 502 },
    );
  }
}
