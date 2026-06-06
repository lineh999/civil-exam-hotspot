import { NextResponse } from "next/server";
import { request as httpsRequest } from "node:https";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
import { callTwinkleTool } from "@/lib/twinkle-mcp";

PDFParse.setWorker(pathToFileURL(join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs")).toString());

type SearchExamResponse = {
  hits?: SearchExamHit[];
};

type SearchExamQuestionsResponse = {
  hits?: SearchExamQuestionHit[];
  questions?: SearchExamQuestionHit[];
  results?: SearchExamQuestionHit[];
};

type SearchExamHit = {
  paper_id: string;
  exam_year: string;
  exam_year_西元: number;
  exam_name: string;
  subject_name: string;
  question_type: string;
  question_count: number;
  question_pdf_url: string;
  answer_pdf_url?: string | null;
};

type SearchExamQuestionHit = {
  question_id?: string;
  paper_id?: string;
  paper_title?: string;
  exam_year?: string | number;
  year?: string | number;
  exam_name?: string;
  exam_type?: string;
  category?: string;
  subject_name?: string;
  subject?: string;
  question_type?: string;
  question_no?: string | number;
  no?: string | number;
  stem?: string;
  options?: Record<string, string> | null;
  question_pdf_url?: string;
  paper_url?: string;
  answer?: string | null;
};

type ExamPaperResponse = {
  paper_id: string;
  exam_year: string;
  exam_year_西元: number;
  exam_name: string;
  subject_name: string;
  question_type: string;
  question_count: number;
  question_pdf_url: string;
  answer_pdf_url?: string | null;
  questions?: {
    no: string | number;
    stem: string;
    options?: Record<string, string> | null;
    answer?: string | null;
  }[];
};

type PaperPart = { label: string; count: number; questionType: string };

type LoadedPaper = {
  id: string;
  year: string;
  exam: string;
  category: string;
  subject: string;
  title: string;
  questionCount: number;
  paperUrl: string;
  answerUrl?: string | null;
  source: "twinkle" | "pending";
  paperParts?: PaperPart[];
};

type LoadedQuestion = {
  id: string;
  year: string;
  subject: string;
  sourceCategory?: string;
  paperTitle: string;
  paperUrl: string;
  pageNumber?: number;
  questionNo: string;
  questionType: string;
  stem: string;
  options?: Record<string, string> | null;
  answer?: string | null;
};

type SubjectQuery = {
  displaySubject: string;
  querySubject: string;
  mustInclude?: string[];
  mustIncludeAny?: string[][];
  mustNotInclude?: string[];
};

type AnswerBlock = {
  subject: string;
  category: string;
  answers: string[];
};

const examNameFilter: Record<string, string> = {
  高考三級: "高等考試三級考試暨普通考試",
  普考: "高等考試三級考試暨普通考試",
  初等考: "初等考試",
  地方特考三等: "地方政府公務人員考試",
  地方特考四等: "地方政府公務人員考試",
  地方特考五等: "地方政府公務人員考試",
  司法特考: "司法人員考試",
  關務特考: "關務人員考試",
  警察特考: "警察人員考試",
  一般警察: "一般警察人員考試",
  移民特考: "移民行政人員考試",
  調查局特考: "調查人員考試",
  身心特考: "身心障礙人員考試",
  原住民特考: "原住民族考試",
  海巡特考: "海岸巡防人員考試",
  退除役特考: "退除役軍人轉任公務人員考試",
  國安局特考: "國家安全局國家安全情報人員考試",
  民航特考: "民航人員考試",
};

const levelKeywords: Record<string, string[]> = {
  高考三級: ["高等考試三級", "三等考試"],
  普考: ["普通考試"],
  初等考: ["初等考試"],
};

function normalizeYear(year: string) {
  return Number(year) + 1911;
}

function normalizeRocYear(value: string | number | undefined, fallback: string) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    const match = String(value).match(/\d{3,4}/);

    if (!match) {
      return fallback;
    }

    const matchedYear = Number(match[0]);
    return String(matchedYear > 1911 ? matchedYear - 1911 : matchedYear);
  }

  return String(numeric > 1911 ? numeric - 1911 : numeric);
}

function normalizeSubjectForSearch(exam: string, subject: string): SubjectQuery {
  if (subject.includes("寫作班")) {
    return {
      displaySubject: subject,
      querySubject: subject.replace(/[（(]寫作班[）)]/g, "").trim(),
    };
  }

  if (subject === "入出國及移民法規概要") {
    return {
      displaySubject: subject,
      querySubject: "入出國及移民法規",
      mustInclude: ["入出國", "移民法規"],
    };
  }

  if (subject === "行政法概要") {
    return {
      displaySubject: subject,
      querySubject: "行政法",
      mustInclude: ["行政法"],
    };
  }

  if (subject === "國文") {
    return {
      displaySubject: subject,
      querySubject: "國文",
      mustInclude: ["國文", "作文"],
      mustNotInclude: ["本國文學概論", "外國文", "選試英文", "英文", "翻譯與應用文"],
    };
  }

  if ((exam === "初等考" || exam === "地方特考五等") && (subject === "公民" || subject === "英文")) {
    return {
      displaySubject: subject,
      querySubject: "公民與英文",
      mustIncludeAny: [
        ["公民", "英文"],
        ["法學知識", "英文"],
      ],
      mustNotInclude: ["外國文", "選試英文", "包括作文", "翻譯與應用文"],
    };
  }

  if (subject === "憲法" || subject === "法學緒論" || subject === "英文") {
    return {
      displaySubject: subject,
      querySubject: "法學知識與英文",
      mustInclude: ["法學知識", "英文"],
      mustNotInclude: ["外國文", "選試英文", "包括作文", "翻譯與應用文"],
    };
  }

  return {
    displaySubject: subject,
    querySubject: subject,
  };
}

function getMoexExamCode(year: string, exam: string) {
  if (exam === "高考三級" || exam === "普考") {
    return `${year}${Number(year) <= 112 ? "090" : "080"}`;
  }

  if (exam === "地方特考三等" || exam === "地方特考四等" || exam === "地方特考五等") {
    return `${year}${Number(year) >= 114 ? "190" : "200"}`;
  }

  if (exam === "關務特考") {
    return `${year}${Number(year) >= 113 ? "040" : "050"}`;
  }

  if (exam === "警察特考" || exam === "一般警察") {
    return `${year}${Number(year) >= 113 ? "060" : "070"}`;
  }

  const suffixByExam: Record<string, string> = {
    初等考: "010",
    司法特考: "120",
    身心特考: "040",
    退除役特考: "040",
    原住民特考: "140",
    民航特考: "140",
    移民特考: "140",
    海巡特考: "120",
    調查局特考: "120",
    國安局特考: "170",
  };

  return `${year}${suffixByExam[exam] ?? "080"}`;
}

function getMoexExamCodes(year: string, exam: string) {
  if (exam === "高考三級" || exam === "普考") {
    return [`${year}080`, `${year}090`];
  }

  if (exam === "地方特考三等" || exam === "地方特考四等" || exam === "地方特考五等") {
    return [`${year}190`, `${year}200`];
  }

  if (exam === "關務特考") {
    return [`${year}040`, `${year}050`];
  }

  if (exam === "警察特考" || exam === "一般警察") {
    return [`${year}060`, `${year}070`, `${year}130`];
  }

  return [getMoexExamCode(year, exam)];
}

function extractMoexCode(url: string) {
  return new URL(url).searchParams.get("code") ?? "";
}

function isSameExamYear(year: string, hit: SearchExamHit) {
  const hitCode = extractMoexCode(hit.question_pdf_url);
  return hitCode.startsWith(year);
}

function isKnownMoexCode(year: string, exam: string, hit: SearchExamHit) {
  const hitCode = extractMoexCode(hit.question_pdf_url);
  return getMoexExamCodes(year, exam).includes(hitCode);
}

function makeMoexSearchUrl(year: string, exam: string) {
  return `https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=${getMoexExamCode(year, exam)}&y=${normalizeYear(year)}`;
}

function makeMoexSubjectAnswerPdfUrl(questionPdfUrl: string) {
  try {
    const url = new URL(questionPdfUrl);
    url.searchParams.set("t", "S");
    return url.toString();
  } catch {
    return null;
  }
}

function makeMoexAnswerPdfUrl(questionPdfUrl: string) {
  try {
    const url = new URL(questionPdfUrl);
    const code = url.searchParams.get("code");

    if (!code) {
      return null;
    }

    return `https://wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx?t=A&code=${code}`;
  } catch {
    return null;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, "")).trim();
}

function getMoexFileHrefByType(row: string, type: "Q" | "S" | "M") {
  const hrefMatches = row.matchAll(/href="([^"]*wHandExamQandA_File\.ashx\?[^"]*)"/g);

  for (const hrefMatch of hrefMatches) {
    const href = decodeHtml(hrefMatch[1]);

    try {
      const url = new URL(href, "https://wwwq.moex.gov.tw/exam/");

      if (url.searchParams.get("t") === type) {
        return url.toString();
      }
    } catch {
      continue;
    }
  }

  return null;
}

function normalizeForLooseMatch(value: string) {
  return value
    .replace(/[（(].*?[）)]/g, "")
    .replace(/概要|大意|普通|進階/g, "")
    .replace(/\s+/g, "")
    .trim();
}

async function findMoexPdfUrls(year: string, exam: string, subject: string) {
  const subjectQuery = normalizeSubjectForSearch(exam, subject);
  const target = normalizeForLooseMatch(subjectQuery.querySubject);
  const wantsOutline = subjectQuery.querySubject.includes("概要") || subject.includes("概要");

  if (!target) {
    return null;
  }

  try {
    const html = await getTextWithNodeHttps(makeMoexSearchUrl(year, exam));
    const rowMatches = html.matchAll(/<tr[\s\S]*?<\/tr>/g);
    const candidates: { questionUrl: string; answerUrl: string | null; score: number }[] = [];

    for (const rowMatch of rowMatches) {
      const row = rowMatch[0];
      const titleMatch = row.match(/class="exam-title"[^>]*>([\s\S]*?)<\/label>/);

      if (!titleMatch) {
        continue;
      }

      const title = stripTags(titleMatch[1]);
      const normalizedTitle = normalizeForLooseMatch(title);

      if (!normalizedTitle.includes(target) && !target.includes(normalizedTitle)) {
        continue;
      }

      const questionUrl = getMoexFileHrefByType(row, "Q");

      if (questionUrl) {
        const answerUrl = getMoexFileHrefByType(row, "S");
        let score = normalizedTitle === target ? 100 : 50;

        if (title.includes(subjectQuery.querySubject)) {
          score += 30;
        }

        if (title.includes("概要") && !wantsOutline) {
          score -= 40;
        }

        if (!title.includes("概要") && !wantsOutline) {
          score += 20;
        }

        candidates.push({
          questionUrl,
          answerUrl,
          score,
        });
      }
    }

    return candidates.sort((a, b) => b.score - a.score)[0] ?? null;
  } catch {
    return null;
  }

  return null;
}

async function findMoexQuestionPdfUrl(year: string, exam: string, subject: string) {
  return (await findMoexPdfUrls(year, exam, subject))?.questionUrl ?? null;
}

function getTextWithNodeHttps(url: string) {
  return new Promise<string>((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        rejectUnauthorized: false,
      },
      (res) => {
        let response = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          response += chunk;
        });
        res.on("end", () => {
          if ((res.statusCode ?? 500) >= 400) {
            reject(new Error(`MOEX HTTP ${res.statusCode}`));
            return;
          }

          resolve(response);
        });
      },
    );

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("MOEX request timed out."));
    });
    req.end();
  });
}

function getBufferWithNodeHttps(url: string) {
  return new Promise<Buffer>((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
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
  });
}

type PdfTextPage = {
  num: number;
  text: string;
};

type PdfTextDocument = {
  text: string;
  pages: PdfTextPage[];
};

const pdfTextCache = new Map<string, Promise<PdfTextDocument>>();

async function getPdfTextDocument(url: string) {
  if (!pdfTextCache.has(url)) {
    pdfTextCache.set(url, (async () => {
      const buffer = await getBufferWithNodeHttps(url);
      const parser = new PDFParse({ data: buffer });

      try {
        const result = await parser.getText();
        return {
          text: result.text,
          pages: result.pages.map((page) => ({
            num: page.num,
            text: page.text,
          })),
        };
      } finally {
        await parser.destroy();
      }
    })());
  }

  return pdfTextCache.get(url)!;
}

async function getPdfText(url: string) {
  return (await getPdfTextDocument(url)).text;
}

function getCategoryLevel(category: string) {
  if (category.includes("四等")) return "四等";
  if (category.includes("三等")) return "三等";
  if (category.includes("五等")) return "五等";
  return "";
}

function isCommonSubject(subject: string) {
  return ["國文", "憲法", "法學緒論", "英文", "法學知識與英文", "公民"].includes(subject);
}

function isLikelyCorrectQuestionType(category: string, hit: { question_type?: string }, query: SubjectQuery) {
  const level = getCategoryLevel(category);
  const questionType = hit.question_type ?? "";

  if (level === "四等") {
    return !questionType || questionType.includes("測驗");
  }

  if (level === "三等" && !isCommonSubject(query.displaySubject)) {
    return !questionType || !questionType.includes("測驗");
  }

  return true;
}

function isLikelyCorrectLevel(exam: string, category: string, year: string, hit: SearchExamHit, query: SubjectQuery) {
  if (!isSameExamYear(year, hit)) {
    return false;
  }

  const examKeyword = examNameFilter[exam];

  if (examKeyword && !hit.exam_name.includes(examKeyword)) {
    return false;
  }

  const keywords = levelKeywords[exam];

  if (keywords && !keywords.some((keyword) => hit.exam_name.includes(keyword))) {
    return false;
  }

  if (!isLikelyCorrectQuestionType(category, hit, query)) {
    return false;
  }

  if (query.mustInclude?.some((keyword) => !hit.subject_name.includes(keyword))) {
    return false;
  }

  if (query.mustIncludeAny && !query.mustIncludeAny.some((keywords) => keywords.every((keyword) => hit.subject_name.includes(keyword)))) {
    return false;
  }

  if (query.mustNotInclude?.some((keyword) => hit.subject_name.includes(keyword))) {
    return false;
  }

  return true;
}

function pickBestHit(exam: string, category: string, year: string, hits: SearchExamHit[], query: SubjectQuery) {
  const matchedHits = hits.filter((hit) => isLikelyCorrectLevel(exam, category, year, hit, query));

  return matchedHits.find((hit) => isKnownMoexCode(year, exam, hit)) ?? matchedHits[0] ?? null;
}

async function runWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results: PromiseSettledResult<R>[] = [];
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      try {
        results[currentIndex] = { status: "fulfilled", value: await worker(items[currentIndex]) };
      } catch (error) {
        results[currentIndex] = { status: "rejected", reason: error };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));

  return results;
}

function broadenSubject(subject: string) {
  return subject
    .replace(/（.*?）/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/概要|大意/g, "")
    .trim();
}

const KOKUGO_PARTS: PaperPart[] = [
  { label: "甲", count: 1, questionType: "作文" },
  { label: "乙", count: 10, questionType: "測驗" },
];

const MIXED_PARTS: PaperPart[] = [
  { label: "甲", count: 2, questionType: "申論" },
  { label: "乙", count: 25, questionType: "測驗" },
];

function parseMoexAnswerBlocks(text: string): AnswerBlock[] {
  const normalized = text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ");
  const blocks = normalized.split(/(?=等級名稱：)/g);

  return blocks.flatMap((block) => {
    const subjectMatch = block.match(/科目名稱：\s*([^\n]+)/);
    const categoryMatch = block.match(/類科名稱：\s*([^\n]+)/);
    const tablePart = (block.match(/第1題[\s\S]*?(?:複選題數|標準答案|備\s*註|--|$)/)?.[0] ?? block)
      .replace(/第\d+題/g, " ")
      .replace(/題號|答案|單選題數|單選每題配分|複選題數|標準答案|備\s*註/g, " ");
    const answerRuns = tablePart.match(/[ABCD#]{5,}/g) ?? [];
    const answers = answerRuns.join("").length >= 10
      ? answerRuns.join("").split("")
      : (tablePart.match(/(?<![A-Za-z])[ABCD#](?![A-Za-z])/g) ?? []);

    if (!subjectMatch || answers.length === 0) {
      return [];
    }

    return [{
      subject: subjectMatch[1].trim(),
      category: categoryMatch?.[1]?.trim() ?? "",
      answers,
    }];
  });
}

function answerSubjectScore(block: AnswerBlock, subject: string, category: string) {
  const normalizedBlockSubject = normalizeForLooseMatch(block.subject);
  const normalizedSubject = normalizeForLooseMatch(normalizeSubjectForSearch("", subject).querySubject);
  const normalizedCategory = normalizeForLooseMatch(category);
  let score = 0;

  if (normalizedBlockSubject === normalizedSubject) {
    score += 100;
  } else if (normalizedBlockSubject.includes(normalizedSubject) || normalizedSubject.includes(normalizedBlockSubject)) {
    score += 70;
  } else if (subject === "英文" && block.subject.includes("英文")) {
    score += 70;
  } else if ((subject === "法學緒論" || subject === "憲法") && (block.subject.includes("法學知識") || block.subject.includes("法學緒論") || block.subject.includes("憲法"))) {
    score += 60;
  }

  if (block.category && (block.category.includes(category) || normalizedCategory.includes(normalizeForLooseMatch(block.category)))) {
    score += 30;
  }

  return score;
}

async function getMoexAnswerMap(answerUrl: string | null | undefined, subject: string, category: string) {
  if (!answerUrl) {
    return new Map<number, string>();
  }

  try {
    const text = await getPdfText(answerUrl);
    const blocks = parseMoexAnswerBlocks(text);
    const best = blocks
      .map((block) => ({ block, score: answerSubjectScore(block, subject, category) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.block;

    if (!best) {
      return new Map<number, string>();
    }

    return new Map(best.answers.map((answer, index) => [index + 1, answer]));
  } catch {
    return new Map<number, string>();
  }
}

function getAnswerQuestionNumber(questionNo: string) {
  const match = questionNo.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function applyOfficialAnswers(questions: LoadedQuestion[], answers: Map<number, string>) {
  if (answers.size === 0) {
    return questions;
  }

  return questions.map((question) => {
    if (question.answer) {
      return question;
    }

    const number = getAnswerQuestionNumber(question.questionNo);
    const answer = number ? answers.get(number) : null;

    return answer ? { ...question, answer } : question;
  });
}

const MOEX_OPTION_MARKERS: Record<string, string> = {
  "\ue18c": "A",
  "\ue18d": "B",
  "\ue18e": "C",
  "\ue18f": "D",
  "\ue190": "E",
};

function normalizeMoexQuestionText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "\n")
    .replace(/代號：\d+[\s\S]*?頁次：\d+－\d+/g, "\n")
    .replace(//g, "（一）")
    .replace(//g, "（二）")
    .replace(//g, "（三）")
    .replace(//g, "（四）")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findQuestionPageNumber(
  pages: PdfTextPage[],
  questionLabel: string,
  questionType: "choice" | "essay" | "kokugo",
) {
  const escapedLabel = questionLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = questionType === "choice"
    ? new RegExp(`(?:^|\\n)\\s*${escapedLabel}[.、]?\\s+`)
    : questionType === "kokugo"
      ? /(?:^|\n)\s*(?:甲|一)[、.]\s*(?:作文(?:部分)?|作文題)/
      : new RegExp(`(?:^|\\n)\\s*${escapedLabel}[、.]\\s*`);

  return pages.find((page) => pattern.test(normalizeMoexQuestionText(page.text)))?.num;
}

function getMoexChoiceQuestionRanges(text: string) {
  const singleMatch = text.match(/單選題（第\s*(\d+)\s*題至第\s*(\d+)\s*題/);
  const multipleMatch = text.match(/複選題（第\s*(\d+)\s*題至第\s*(\d+)\s*題/);

  return {
    singleStart: singleMatch ? Number(singleMatch[1]) : 1,
    singleEnd: singleMatch ? Number(singleMatch[2]) : null,
    multipleStart: multipleMatch ? Number(multipleMatch[1]) : null,
    multipleEnd: multipleMatch ? Number(multipleMatch[2]) : null,
  };
}

function isMalformedParsedChoiceStem(stem: string, questionNumber: number) {
  const normalized = stem.replace(/\s+/g, " ").trim();

  if (!normalized || /^[年月日]\s*(?:的|之|，|。)/.test(normalized)) {
    return true;
  }

  const embeddedQuestionNumbers = Array.from(
    normalized.matchAll(/(?:^|\s)(\d{1,3})[.、]\s*(?=\S)/g),
    (match) => Number(match[1]),
  );

  return embeddedQuestionNumbers.some((number) => number !== questionNumber);
}

function restoreEnglishClozeBlank(stem: string, options: Record<string, string>) {
  const optionValues = Object.values(options);
  const isEnglishQuestion = /[A-Za-z]/.test(stem)
    && optionValues.length >= 4
    && optionValues.every((option) => /[A-Za-z]/.test(option));

  if (!isEnglishQuestion || /_{3,}|□{2,}/.test(stem)) {
    return stem;
  }

  return stem.replace(/([A-Za-z])\s+([,;:])(?=\s|$)/, "$1 ________ $2");
}

function parseMoexOptions(raw: string) {
  const markerPattern = /[\ue18c-\ue190]|[（(]([A-E])[）)]/g;
  const matches = Array.from(raw.matchAll(markerPattern));

  if (matches.length < 4) {
    return null;
  }

  const firstMarkerIndex = matches[0].index ?? 0;
  const rawStem = raw.slice(0, firstMarkerIndex).trim();
  const options: Record<string, string> = {};

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const token = match[0];
    const key = MOEX_OPTION_MARKERS[token] ?? match[1];

    if (!key) {
      continue;
    }

    const start = (match.index ?? 0) + token.length;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? raw.length : raw.length;
    const value = raw.slice(start, end).replace(/\s+/g, " ").trim();

    if (value) {
      options[key] = value;
    }
  }

  if (Object.keys(options).length < 4) {
    return null;
  }

  return {
    stem: restoreEnglishClozeBlank(rawStem, options),
    options,
  };
}

function parseQuestionNumberLabel(value: string) {
  const numeric = Number(value);

  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  const digits: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  if (value === "十") return 10;
  if (value.startsWith("十")) return 10 + (digits[value.slice(1)] ?? 0);
  if (value.endsWith("十")) return (digits[value.slice(0, -1)] ?? 0) * 10;
  if (value.includes("十")) {
    const [tens, ones] = value.split("十");
    return (digits[tens] ?? 1) * 10 + (digits[ones] ?? 0);
  }

  return digits[value] ?? null;
}

type KokugoWrittenPart = {
  label: string;
  questionType: "作文" | "公文";
  stem: string;
};

function extractKokugoWrittenParts(text: string): KokugoWrittenPart[] {
  const normalized = normalizeMoexQuestionText(text);
  const choiceSectionMatch = normalized.match(
    /(?:^|\n)\s*(?:乙|二)[、.]\s*(?:測驗(?:題|部分)?|選擇題)(?:部分)?/,
  );
  const writtenSection = normalized.slice(0, choiceSectionMatch?.index ?? normalized.length);
  const partMatches = Array.from(
    writtenSection.matchAll(
      /(?:^|\n)\s*([甲乙一二三四])[、.]\s*(作文|公文)(?:部分|題)?\s*[：:]?\s*(?:[（(]\s*\d+\s*分\s*[）)])?/g,
    ),
  );

  return partMatches.flatMap((match, index) => {
    const questionType = match[2] as KokugoWrittenPart["questionType"];
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < partMatches.length
      ? partMatches[index + 1].index ?? writtenSection.length
      : writtenSection.length;
    const body = writtenSection
      .slice(start, end)
      .replace(
        /^[\s\S]*?(?:不|不)得於試卷上書寫姓名或座號[。．]?\s*/u,
        "",
      )
      .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "\n")
      .replace(/(?:^|\n)\s*代號：?[^\n]*\n\s*頁次：?[^\n]*/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (body.length < 20) {
      return [];
    }

    return [{
      label: match[1],
      questionType,
      stem: `${questionType}${match[0].match(/[（(]\s*\d+\s*分\s*[）)]/)?.[0] ?? ""}\n${body}`.trim(),
    }];
  });
}

function findKokugoWrittenPartPageNumber(pages: PdfTextPage[], questionType: KokugoWrittenPart["questionType"]) {
  const pattern = new RegExp(`(?:^|\\n)\\s*(?:甲|乙|一|二|三|四)[、.]\\s*${questionType}(?:部分|題)?\\s*[：:]?`);
  return pages.find((page) => pattern.test(normalizeMoexQuestionText(page.text)))?.num;
}

function parseMoexQuestionPdf(
  text: string,
  paperId: string,
  year: string,
  subject: string,
  paperTitle: string,
  paperUrl: string,
  pages: PdfTextPage[] = [],
) {
  const normalized = normalizeMoexQuestionText(text);
  const sourceCategory = normalized.match(/類\s*科：\s*([^\n]+)/)?.[1]?.replace(/\s+/g, "").trim();
  const ranges = getMoexChoiceQuestionRanges(normalized);
  const matches = Array.from(normalized.matchAll(/(?:^|\n)\s*(\d{1,3})[.、]?\s+/g));
  const questions: LoadedQuestion[] = [];
  const seenNumbers = new Set<number>();

  if (subject === "國文") {
    const writtenParts = extractKokugoWrittenParts(text);

    for (const part of writtenParts) {
      questions.push({
        id: `${paperId}-pdf-written-${part.questionType}`,
        year,
        subject,
        sourceCategory,
        paperTitle,
        paperUrl,
        pageNumber: findKokugoWrittenPartPageNumber(pages, part.questionType),
        questionNo: part.questionType,
        questionType: part.questionType,
        stem: part.stem,
        options: null,
        answer: null,
      });
    }
  }

  for (let index = 0; index < matches.length; index += 1) {
    const questionNumber = parseQuestionNumberLabel(matches[index][1]);

    if (!questionNumber) {
      continue;
    }

    const start = (matches[index].index ?? 0) + matches[index][0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    const raw = normalized.slice(start, end).trim();
    const parsed = parseMoexOptions(raw);

    if (!parsed || parsed.stem.length < 4 || isMalformedParsedChoiceStem(parsed.stem, questionNumber)) {
      continue;
    }

    const isMultiple = Boolean(
      ranges.multipleStart
      && ranges.multipleEnd
      && questionNumber >= ranges.multipleStart
      && questionNumber <= ranges.multipleEnd,
    );

    questions.push({
      id: `${paperId}-pdf-q${questionNumber}`,
      year,
      subject,
      sourceCategory,
      paperTitle,
      paperUrl,
      pageNumber: findQuestionPageNumber(pages, String(questionNumber), "choice"),
      questionNo: `第 ${questionNumber} 題`,
      questionType: isMultiple ? "複選題" : "測驗",
      stem: parsed.stem,
      options: parsed.options,
      answer: null,
    });
    seenNumbers.add(questionNumber);
  }

  const essayPart = normalized
    .split(/(?:^|\n)\s*(?:乙|二)[、.]\s*測驗題/)[0]
    .split(/(?:^|\n)\s*(?:甲|一)[、.]\s*申論題[^：:]*[：:]?/).at(-1) ?? "";
  const essayMatches = Array.from(essayPart.matchAll(/(?:^|\n)\s*([一二三四五六七八九十]{1,3})[、.]\s*/g));
  const essayQuestions = subject === "國文" ? [] : essayMatches.flatMap((match, index) => {
    const questionNumber = parseQuestionNumberLabel(match[1]);

    if (!questionNumber) {
      return [];
    }

    if (seenNumbers.has(questionNumber)) {
      return [];
    }

    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < essayMatches.length ? essayMatches[index + 1].index ?? essayPart.length : essayPart.length;
    const raw = essayPart
      .slice(start, end)
      .replace(/[ \t]+/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (raw.length < 20 || parseMoexOptions(raw)) {
      return [];
    }

    return [{
      id: `${paperId}-pdf-essay-${questionNumber}`,
      year,
      subject,
      sourceCategory,
      paperTitle,
      paperUrl,
      pageNumber: findQuestionPageNumber(pages, match[1], "essay"),
      questionNo: `第 ${questionNumber} 題`,
      questionType: "申論",
      stem: raw,
      options: null,
      answer: null,
    }];
  });

  questions.push(...essayQuestions);

  return questions;
}

async function getMoexQuestionPdfQuestions(
  paperUrl: string,
  paperId: string,
  year: string,
  subject: string,
  paperTitle: string,
) {
  if (!paperUrl.includes("wHandExamQandA_File.ashx") || !paperUrl.includes("t=Q")) {
    return [];
  }

  try {
    const document = await getPdfTextDocument(paperUrl);
    return parseMoexQuestionPdf(
      document.text,
      paperId,
      year,
      subject,
      paperTitle,
      paperUrl,
      document.pages,
    )
      .filter((question) => isQuestionCompatibleWithDisplaySubject(subject, question));
  } catch {
    return [];
  }
}

function countQuestionsWithOptions(questions: LoadedQuestion[]) {
  return questions.filter((question) => question.options && Object.keys(question.options).length >= 4).length;
}

function preferMoexParsedQuestions(current: LoadedQuestion[], parsed: LoadedQuestion[]) {
  if (parsed.length === 0) {
    return current;
  }

  const currentWithOptions = countQuestionsWithOptions(current);
  const parsedWithOptions = countQuestionsWithOptions(parsed);

  if (parsedWithOptions >= currentWithOptions && parsedWithOptions > 0) {
    return parsed;
  }

  const officialWrittenQuestions = parsed.filter(
    (question) =>
      !question.options
      && (
        question.questionType.includes("作文")
        || question.questionType.includes("公文")
        || question.questionType.includes("申論")
      )
      && isUsableQuestionStem(question.stem),
  );

  if (officialWrittenQuestions.length === 0) {
    return current;
  }

  const merged = [...current];

  for (const officialQuestion of officialWrittenQuestions) {
    const matchingIndex = merged.findIndex(
      (question) =>
        question.questionNo === officialQuestion.questionNo
        || (
          question.questionType.includes("作文")
          && officialQuestion.questionType.includes("作文")
        )
        || (
          question.questionType.includes("公文")
          && officialQuestion.questionType.includes("公文")
        ),
    );

    if (matchingIndex >= 0) {
      merged[matchingIndex] = officialQuestion;
    } else {
      merged.push(officialQuestion);
    }
  }

  return merged;
}

function buildKokugoQuestions(
  paperId: string,
  year: string,
  subject: string,
  paperTitle: string,
  paperUrl: string,
  mcpQuestions: { no: string | number; stem: string; answer?: string | null }[] | undefined,
): LoadedQuestion[] {
  const result: LoadedQuestion[] = [];

  const giaStem = mcpQuestions?.find((q) => String(q.no).startsWith("甲"))?.stem ?? "";
  result.push({
    id: `${paperId}-甲`,
    year,
    subject,
    paperTitle,
    paperUrl,
    questionNo: "甲",
    questionType: "作文",
    stem: giaStem || "（甲部分：作文）",
    options: null,
    answer: null,
  });

  for (let i = 1; i <= 10; i++) {
    const yiStem =
      mcpQuestions?.find((q) => {
        const no = String(q.no);
        return no === `乙${i}` || no === `乙-${i}` || no === `乙 ${i}`;
      })?.stem ?? "";
    result.push({
      id: `${paperId}-乙${i}`,
      year,
      subject,
      paperTitle,
      paperUrl,
      questionNo: `乙-${i}`,
      questionType: "測驗",
      stem: yiStem || `（乙部分第 ${i} 小題）`,
      options: null,
      answer: null,
    });
  }

  return result;
}

function estimateQuestionCount(questionType: string, subject: string) {
  if (subject.includes("國文")) {
    return KOKUGO_PARTS.reduce((sum, p) => sum + p.count, 0);
  }

  if (questionType.includes("混合")) {
    return MIXED_PARTS.reduce((sum, p) => sum + p.count, 0);
  }

  if (questionType.includes("測驗")) {
    return 50;
  }

  if (questionType.includes("申論")) {
    return 4;
  }

  return 25;
}

async function callTwinkleToolCandidates<T>(names: string[], args: Record<string, unknown>) {
  const errors: string[] = [];

  for (const name of names) {
    try {
      const result = await callTwinkleTool<T>(name, args);
      const payloadError = (result as { error?: { message?: string } } | null)?.error;

      if (payloadError) {
        throw new Error(payloadError.message ?? "Twinkle tool returned an error payload.");
      }

      return result;
    } catch (error) {
      errors.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(errors.join(" | "));
}

function questionHitsFrom(response: SearchExamQuestionsResponse) {
  return response.hits ?? response.questions ?? response.results ?? [];
}

function getQuestionSubject(hit: SearchExamQuestionHit) {
  return hit.subject_name ?? hit.subject ?? "";
}

function getQuestionExamName(hit: SearchExamQuestionHit) {
  return hit.exam_name ?? hit.exam_type ?? "";
}

function isPlaceholderStem(stem: string) {
  return [
    "TwinkleAI MCP",
    "題目全文會在",
    "考選部試卷 PDF",
    "試題查詢頁",
    "（乙部分第",
    "（甲部分：作文）",
  ].some((keyword) => stem.includes(keyword));
}

function isUsableQuestionStem(stem: string | undefined) {
  return Boolean(stem && stem.trim().length > 10 && !isPlaceholderStem(stem));
}

function latinRatio(value: string) {
  const compact = value.replace(/\s/g, "");

  if (!compact) {
    return 0;
  }

  const latinChars = compact.match(/[A-Za-z]/g)?.length ?? 0;
  return latinChars / compact.length;
}

function isEnglishLikeQuestion(stem: string, options?: Record<string, string> | null) {
  const optionText = options ? Object.values(options).join(" ") : "";
  const text = `${stem} ${optionText}`;

  return latinRatio(text) > 0.45 || /choose|according to|passage|sentence|correct|which of the following/i.test(text);
}

function isQuestionCompatibleWithDisplaySubject(subject: string, question: Pick<LoadedQuestion, "stem" | "options">) {
  const englishLike = isEnglishLikeQuestion(question.stem, question.options);

  if (subject === "英文" || subject.includes("專業英文")) {
    return englishLike || isPlaceholderStem(question.stem);
  }

  if (subject === "法學緒論" || subject === "憲法" || subject === "公民") {
    return !englishLike || isPlaceholderStem(question.stem);
  }

  return true;
}

function normalizeDisplayQuestionNo(value: string | number | undefined, fallbackIndex: number) {
  const raw = value === undefined || value === null || value === "" ? fallbackIndex + 1 : value;
  const numeric = Number(String(raw).match(/\d+/)?.[0] ?? raw);

  if (!Number.isNaN(numeric) && numeric > 0 && numeric <= 100) {
    return `第 ${numeric} 題`;
  }

  return `第 ${fallbackIndex + 1} 題`;
}

function isLikelyCorrectQuestionHit(exam: string, category: string, subjectQuery: SubjectQuery, year: string, hit: SearchExamQuestionHit) {
  const hitYear = normalizeRocYear(hit.exam_year ?? hit.year, year);

  if (hitYear !== year) {
    return false;
  }

  const examName = getQuestionExamName(hit);
  const examKeyword = examNameFilter[exam];

  if (examName && examKeyword && !examName.includes(examKeyword)) {
    return false;
  }

  const subjectName = getQuestionSubject(hit);

  if (subjectName) {
    if (subjectQuery.mustInclude?.some((keyword) => !subjectName.includes(keyword))) {
      return false;
    }

    if (subjectQuery.mustIncludeAny && !subjectQuery.mustIncludeAny.some((keywords) => keywords.every((keyword) => subjectName.includes(keyword)))) {
      return false;
    }

    if (subjectQuery.mustNotInclude?.some((keyword) => subjectName.includes(keyword))) {
      return false;
    }

    if (!subjectQuery.mustInclude && !subjectQuery.mustIncludeAny && !subjectName.includes(broadenSubject(subjectQuery.querySubject))) {
      return false;
    }
  }

  return isLikelyCorrectQuestionType(category, hit, subjectQuery);
}

function normalizeQuestionHit(
  hit: SearchExamQuestionHit,
  index: number,
  year: string,
  subject: string,
  paperTitle: string,
  paperUrl: string,
): LoadedQuestion | null {
  const stem = hit.stem?.trim() ?? "";

  if (!isUsableQuestionStem(stem)) {
    return null;
  }

  const questionNo = hit.question_no ?? hit.no ?? index + 1;
  const normalized: LoadedQuestion = {
    id: hit.question_id ?? `${hit.paper_id ?? paperTitle}-skill-${index + 1}`,
    year: normalizeRocYear(hit.exam_year ?? hit.year, year),
    subject,
    paperTitle,
    paperUrl: hit.question_pdf_url ?? hit.paper_url ?? paperUrl,
    questionNo: normalizeDisplayQuestionNo(questionNo, index),
    questionType: hit.question_type ?? "題目",
    stem,
    options: hit.options ?? null,
    answer: hit.answer,
  };

  return isQuestionCompatibleWithDisplaySubject(subject, normalized) ? normalized : null;
}

async function searchExamQuestions(exam: string, category: string, subject: string, year: string, paperTitle: string, paperUrl: string) {
  const subjectQuery = normalizeSubjectForSearch(exam, subject);
  const subjectForSearch = broadenSubject(subjectQuery.querySubject);
  const yearNumber = normalizeYear(year);
  const attempts: Record<string, unknown>[] = [
    {
      query: `${exam} ${category} ${subjectQuery.querySubject}`,
      exam_type: exam,
      subject: subjectForSearch,
      year_from: yearNumber,
      year_to: yearNumber,
      limit: 100,
    },
    {
      query: `${category} ${subjectQuery.querySubject}`,
      stem_contains: undefined,
      subject: subjectForSearch,
      year_from: yearNumber,
      year_to: yearNumber,
      limit: 100,
    },
    {
      query: subjectQuery.querySubject,
      exam_name_contains: examNameFilter[exam] ?? exam,
      subject_contains: subjectForSearch,
      year_from: yearNumber,
      year_to: yearNumber,
      limit: 100,
    },
  ];
  const seen = new Set<string>();
  const questions: LoadedQuestion[] = [];

  for (const args of attempts) {
    let response: SearchExamQuestionsResponse;

    try {
      response = await callTwinkleToolCandidates<SearchExamQuestionsResponse>(["opendata-search_exam_questions", "search_exam_questions"], args);
    } catch {
      continue;
    }

    questionHitsFrom(response)
      .filter((hit) => isLikelyCorrectQuestionHit(exam, category, subjectQuery, year, hit))
      .map((hit, index) => normalizeQuestionHit(hit, index, year, subject, paperTitle, paperUrl))
      .forEach((question) => {
        if (!question) {
          return;
        }

        const key = `${question.year}-${question.questionNo}-${question.stem.slice(0, 80)}`;

        if (seen.has(key)) {
          return;
        }

        seen.add(key);
        questions.push(question);
      });

    if (questions.length > 0) {
      break;
    }
  }

  return questions;
}

async function mergeQuestionLevelSkillData(
  questions: LoadedQuestion[],
  exam: string,
  category: string,
  subject: string,
  year: string,
  paperTitle: string,
  paperUrl: string,
) {
  const usableCount = questions.filter((question) => isUsableQuestionStem(question.stem)).length;
  const shouldSupplement = usableCount === 0 || usableCount < Math.min(questions.length, 10) || usableCount / Math.max(questions.length, 1) < 0.5;

  if (!shouldSupplement) {
    return questions;
  }

  const skillQuestions = await searchExamQuestions(exam, category, subject, year, paperTitle, paperUrl);

  if (skillQuestions.length === 0) {
    return questions;
  }

  const realQuestions = questions.filter((question) => isUsableQuestionStem(question.stem));

  if (skillQuestions.length >= realQuestions.length) {
    return skillQuestions;
  }

  const merged = [...realQuestions];
  const seen = new Set(merged.map((question) => `${question.year}-${question.questionNo}-${question.stem.slice(0, 80)}`));

  for (const question of skillQuestions) {
    const key = `${question.year}-${question.questionNo}-${question.stem.slice(0, 80)}`;

    if (!seen.has(key)) {
      seen.add(key);
      merged.push(question);
    }
  }

  return merged.length > 0 ? merged : questions;
}

async function searchExamPaper(exam: string, category: string, subject: string, year: string) {
  const subjectQuery = normalizeSubjectForSearch(exam, subject);
  const commonArgs = {
    exam_name_contains: examNameFilter[exam] ?? exam,
    year_from: normalizeYear(year),
    year_to: normalizeYear(year),
    limit: 10,
  };
  const attempts = [
    {
      ...commonArgs,
      query: `${exam} ${category} ${subjectQuery.querySubject}`,
      subject_contains: subjectQuery.querySubject,
    },
    {
      ...commonArgs,
      query: subjectQuery.querySubject,
      subject_contains: broadenSubject(subjectQuery.querySubject),
    },
    {
      ...commonArgs,
      query: `${category} ${subjectQuery.querySubject}`,
      subject_contains: null,
    },
    {
      ...commonArgs,
      query: subjectQuery.querySubject,
      exam_name_contains: null,
      subject_contains: subjectQuery.querySubject,
    },
  ];

  for (const args of attempts) {
    const search = await callTwinkleToolCandidates<SearchExamResponse>(["opendata-search_exam", "search_exam"], args);
    const hit = pickBestHit(exam, category, year, search.hits ?? [], subjectQuery);

    if (hit) {
      return hit;
    }
  }

  return null;
}

async function fetchPaper(exam: string, category: string, subject: string, year: string) {
  let hit: SearchExamHit | null = null;

  try {
    hit = await searchExamPaper(exam, category, subject, year);
  } catch {
    hit = null;
  }

  if (!hit) {
    const title = `${year} 年 ${exam} ${category} ${subject}`;
    const moexUrls = await findMoexPdfUrls(year, exam, subject);
    const paperUrl = moexUrls?.questionUrl ?? makeMoexSearchUrl(year, exam);
    const answerUrl = moexUrls?.answerUrl ?? makeMoexSubjectAnswerPdfUrl(paperUrl) ?? makeMoexAnswerPdfUrl(paperUrl);
    const questionCount = estimateQuestionCount("", subject);
    const paper: LoadedPaper = {
      id: `${year}-${exam}-${category}-${subject}-pending`,
      year,
      exam,
      category,
      subject,
      title,
      questionCount,
      paperUrl,
      answerUrl,
      source: "pending",
      paperParts: subject === "國文" ? KOKUGO_PARTS : undefined,
    };
    const questions: LoadedQuestion[] = Array.from({ length: questionCount }, (_, index) => ({
      id: `${paper.id}-q${index + 1}`,
      year,
      subject,
      paperTitle: title,
      paperUrl,
      questionNo: `第 ${index + 1} 題`,
      questionType: "待補",
      stem: "TwinkleAI MCP 尚未命中這一科的精準 PDF，已保留考科列並連到考選部該年度試題查詢頁。",
      options: null,
    }));

    const parsedQuestions = await getMoexQuestionPdfQuestions(paperUrl, paper.id, year, subject, title);
    const answers = await getMoexAnswerMap(answerUrl, subject, category);
    const finalQuestions = applyOfficialAnswers(preferMoexParsedQuestions(questions, parsedQuestions), answers);
    paper.category = finalQuestions.find((question) => question.sourceCategory)?.sourceCategory ?? paper.category;
    paper.questionCount = Math.max(paper.questionCount, finalQuestions.length);

    return { paper, questions: finalQuestions };
  }

  let paper: ExamPaperResponse | null = null;

  try {
    paper = await callTwinkleToolCandidates<ExamPaperResponse>(["opendata-get_exam_paper", "get_exam_paper"], {
      paper_id: hit.paper_id,
      include_options: true,
    });
  } catch {
    paper = null;
  }

  const paperYear = paper?.exam_year ?? hit.exam_year;
  const subjectName = subject;
  const questionType = paper?.question_type ?? hit.question_type;
  const paperUrl = paper?.question_pdf_url || hit.question_pdf_url;
  const answerUrl = makeMoexSubjectAnswerPdfUrl(paperUrl) ?? paper?.answer_pdf_url ?? hit.answer_pdf_url ?? makeMoexAnswerPdfUrl(paperUrl);
  const isKokugo = subjectName === "國文";
  const isMixed = questionType.includes("混合");
  const paperParts: PaperPart[] | undefined = isKokugo ? KOKUGO_PARTS : isMixed ? MIXED_PARTS : undefined;
  const inferredQuestionCount = estimateQuestionCount(questionType, subjectName);
  const questionCount = isKokugo
    ? KOKUGO_PARTS.reduce((sum, p) => sum + p.count, 0)
    : Math.max(paper?.questions?.length ?? 0, paper?.question_count ?? 0, hit.question_count ?? 0, inferredQuestionCount);
  const title = `${paperYear} 年 ${exam} ${category} ${subjectName}`;
  const loadedPaper: LoadedPaper = {
    id: `${paper?.paper_id ?? hit.paper_id}-${subject}`,
    year: paperYear,
    exam,
    category,
    subject: subjectName,
    title,
    questionCount,
    paperUrl,
    answerUrl,
    source: "twinkle",
    paperParts,
  };

  let questions: LoadedQuestion[];

  if (isKokugo) {
    questions = buildKokugoQuestions(loadedPaper.id, paperYear, subjectName, title, paperUrl, paper?.questions);
  } else {
    questions = (paper?.questions ?? [])
      .map((question, index) => ({
        id: `${loadedPaper.id}-${question.no}`,
        year: paperYear,
        subject: subjectName,
        paperTitle: title,
        paperUrl: loadedPaper.paperUrl,
        questionNo: isMixed ? `甲-${index + 1}` : normalizeDisplayQuestionNo(question.no, index),
        questionType: isMixed ? "申論" : questionType,
        stem: question.stem,
        options: question.options ?? null,
        answer: question.answer,
      }))
      .filter((question) => isQuestionCompatibleWithDisplaySubject(subjectName, question));

    if (questions.length < questionCount) {
      questions.push(...Array.from({ length: questionCount - questions.length }, (_, index) => {
        const questionNumber = questions.length + index + 1;
        const isMixedChoice = isMixed && questionNumber > MIXED_PARTS[0].count;

        return {
          id: `${loadedPaper.id}-q${questionNumber}`,
          year: paperYear,
          subject: subjectName,
          paperTitle: title,
          paperUrl,
          questionNo: isMixedChoice ? `乙-${questionNumber - MIXED_PARTS[0].count}` : `第 ${questionNumber} 題`,
          questionType: isMixedChoice ? "測驗" : questionType,
          stem: "已透過 TwinkleAI MCP 找到考選部試卷 PDF。題目全文會在 get_exam_paper 成功回傳後顯示。",
          options: null,
        };
      }));
    }
  }

  questions = await mergeQuestionLevelSkillData(questions, exam, category, subjectName, paperYear, title, paperUrl);
  questions = preferMoexParsedQuestions(
    questions,
    await getMoexQuestionPdfQuestions(paperUrl, loadedPaper.id, paperYear, subjectName, title),
  );
  questions = applyOfficialAnswers(questions, await getMoexAnswerMap(answerUrl, subjectName, category));
  loadedPaper.category = questions.find((question) => question.sourceCategory)?.sourceCategory ?? loadedPaper.category;
  loadedPaper.questionCount = Math.max(loadedPaper.questionCount, questions.length);

  return { paper: loadedPaper, questions };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      exam?: string;
      category?: string;
      subjects?: string[];
      years?: string[];
    };
    const exam = body.exam;
    const category = body.category;
    const subjects = body.subjects ?? [];
    const years = body.years ?? [];

    if (!exam || !category || subjects.length === 0 || years.length === 0) {
      return NextResponse.json({ error: "Missing exam, category, subjects, or years." }, { status: 400 });
    }

    const tasks = years.flatMap((year) => subjects.map((subject) => ({ year, subject })));
    const settled = await runWithConcurrency(tasks, 4, (task) => fetchPaper(exam, category, task.subject, task.year));
    const papers: LoadedPaper[] = [];
    const questions: LoadedQuestion[] = [];
    const errors: string[] = [];

    for (const result of settled) {
      if (result.status === "rejected") {
        errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
        continue;
      }

      const value = result.value;

      if (!value) {
        continue;
      }

      papers.push(value.paper);
      questions.push(...value.questions);
    }

    return NextResponse.json({
      papers,
      questions,
      errors,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
