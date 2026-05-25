import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const csvPath = join(root, "data", "raw", "moex-exam-qanda.csv");
const outputPath = join(root, "lib", "moex-admin-law-data.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, "").trim());
  return rows
    .filter((items) => items.some((item) => item.trim()))
    .map((items) => Object.fromEntries(headers.map((header, index) => [header, items[index] ?? ""])));
}

function isCivilServiceExam(row) {
  const text = `${row["考試名稱"]} ${row["等級分類"]} ${row["考試及等別"]}`;
  return /(公務人員|高等考試|普通考試|地方政府公務人員|初等考試|特種考試)/.test(text);
}

function isAdminLaw(row) {
  const subject = row["科目全名"] ?? "";
  return subject.includes("行政法");
}

function normalizePaper(row) {
  return {
    year: Number(row["考試年度"]),
    examCode: row["考試代碼"],
    examName: row["考試名稱"],
    level: row["等級分類"],
    examLevel: row["考試及等別"],
    categoryCode: row["類科代碼"],
    category: row["類科組別"],
    session: row["節次"],
    subject: row["科目全名"],
    questionType: row["試題型態"],
    questionUrl: row["試題網址"],
    answerUrl: row["測驗式試題答案網址"],
    note: row["備註"],
  };
}

const csv = await readFile(csvPath, "utf8");
const rows = parseCsv(csv);
const allAdminLaw = rows.filter((row) => isCivilServiceExam(row) && isAdminLaw(row)).map(normalizePaper);
const latestYear = Math.max(...allAdminLaw.map((row) => row.year));
const years = [latestYear - 2, latestYear - 1, latestYear];
const recent = allAdminLaw.filter((row) => years.includes(row.year));

const byYear = Object.fromEntries(
  years.map((year) => [
    String(year),
    {
      total: recent.filter((row) => row.year === year).length,
      multipleChoice: recent.filter((row) => row.year === year && row.questionType.includes("測驗")).length,
      essay: recent.filter((row) => row.year === year && row.questionType.includes("申論")).length,
    },
  ]),
);

const byType = recent.reduce(
  (acc, row) => {
    if (row.questionType.includes("測驗")) acc.multipleChoice += 1;
    else if (row.questionType.includes("申論")) acc.essay += 1;
    else acc.other += 1;
    return acc;
  },
  { multipleChoice: 0, essay: 0, other: 0 },
);

const topCategories = Object.entries(
  recent.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([category, count]) => ({ category, count }))
  .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "zh-Hant"))
  .slice(0, 12);

const payload = {
  metadata: {
    source: "考選部國家考試試題索引開放資料",
    sourceUrl: "https://wwwc.moex.gov.tw/main/Exam/wHandExamQandA_CSV.ashx",
    generatedAt: new Date().toISOString(),
    latestYear,
    years,
    totalRows: rows.length,
    adminLawRows: allAdminLaw.length,
    recentRows: recent.length,
  },
  summary: {
    byYear,
    byType,
    topCategories,
  },
  papers: recent.sort((a, b) => b.year - a.year || a.examName.localeCompare(b.examName, "zh-Hant")).slice(0, 80),
};

await mkdir(join(root, "lib"), { recursive: true });
await writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");

console.log(`行政法索引：共 ${allAdminLaw.length} 筆，近三年 ${recent.length} 筆，最新年度 ${latestYear}`);
