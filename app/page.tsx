"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCategoriesForExam, getExamOptions, getGroupedSubjects, getSubjectCatalogItem } from "@/lib/exam-subjects";
import { examFigureStaticPath } from "@/lib/examFigure";
import type { HotspotAnalysis, HotspotTopic } from "@/lib/openai-analyzer";

const examOptions = getExamOptions();
const yearOptions = ["114", "113", "112", "111", "110", "109", "108"];

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
  source?: "twinkle" | "fallback" | "pending";
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

type DrawerMode = "papers" | "questions" | null;
type FeatureTab = "hotspots" | "quiz" | "essay";
type QuizFilter = "all" | "wrong" | "flagged";
type QuizPaperMode = "single" | "mixed";

type LoadProgress = {
  percent: number;
  label: string;
  detail: string;
};

type QuizRecord = {
  selectedAnswer?: string;
  revealed?: boolean;
  isCorrect?: boolean;
  flagged?: boolean;
  topic?: string;
  updatedAt: string;
};

type EssayReviewResult = {
  score: number;
  maxScore: number;
  summary: string;
  structureFeedback: string;
  contentFeedback: string;
  missingPoints: string[];
  improvementSuggestions: string[];
  referenceDirection: string;
  reviewedAt: string;
  source: "openai" | "local";
};

type EssayRecord = {
  answer?: string;
  status?: "draft" | "review" | "done";
  flagged?: boolean;
  review?: EssayReviewResult;
  reviewError?: string;
  updatedAt: string;
};

type QuizQuestion = LoadedQuestion & {
  options: Record<string, string>;
  correctAnswer: string | null;
  topic: string;
  sourceQuestionNo?: string;
};

type QuizSourcePaper = {
  year: string;
  subject: string;
  category?: string;
  paperUrl: string;
  title: string;
  questionCount: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function formatReviewText(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatReviewText(item))
      .filter(Boolean)
      .join("\n") || fallback;
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => {
        const text = formatReviewText(item);
        return text ? `${key}：${text}` : "";
      })
      .filter(Boolean)
      .join("\n") || fallback;
  }

  return fallback;
}

function formatReviewList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => formatReviewText(item)).filter(Boolean);
  }

  const text = formatReviewText(value);
  return text ? [text] : [];
}

function getYearRange(years: string[]) {
  const sorted = [...years].sort();
  return `${sorted[0]}-${sorted[sorted.length - 1]} 年`;
}

function stableHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function seededShuffle<T>(items: T[], seed: string) {
  return [...items]
    .map((item, index) => ({
      item,
      sort: stableHash(`${seed}-${index}-${JSON.stringify(item).slice(0, 80)}`),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function areStringArraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function latinRatio(value: string) {
  const compact = value.replace(/\s/g, "");

  if (!compact) {
    return 0;
  }

  const latinChars = compact.match(/[A-Za-z]/g)?.length ?? 0;
  return latinChars / compact.length;
}

function isEnglishLikeQuestion(question: Pick<LoadedQuestion, "stem" | "options">) {
  const optionText = question.options ? Object.values(question.options).join(" ") : "";
  const text = `${question.stem} ${optionText}`;

  return latinRatio(text) > 0.45 || /choose|according to|passage|sentence|correct|which of the following/i.test(text);
}

function isQuestionCompatibleWithSubject(subject: string, question: LoadedQuestion) {
  const englishLike = isEnglishLikeQuestion(question);

  if (subject === "英文" || subject.includes("專業英文")) {
    return englishLike || isPlaceholderQuizStem(question.stem);
  }

  if (subject === "法學緒論" || subject === "憲法" || subject === "公民") {
    return !englishLike || isPlaceholderQuizStem(question.stem);
  }

  return true;
}

function getOfficialQuizQuestionCount(subject: string, questions: LoadedQuestion[]) {
  const years = Array.from(new Set(questions.map((question) => question.year)));
  const perYearCounts = years
    .map((year) => questions.filter((question) => question.year === year && isQuizCandidate(question)).length)
    .filter((count) => count > 0);

  if (subject === "英文") {
    return 50;
  }

  if (subject === "國文") {
    return 10;
  }

  if (subject === "憲法" || subject === "法學緒論" || subject === "公民") {
    return perYearCounts.length > 0 ? Math.max(...perYearCounts) : 50;
  }

  if (perYearCounts.length > 0) {
    return Math.max(...perYearCounts);
  }

  return 50;
}

function getQuestionPaperKey(question: LoadedQuestion) {
  return `${question.year}-${question.sourceCategory ?? ""}-${question.subject}-${question.paperUrl}`;
}

function getQuizSourcePapers(questions: LoadedQuestion[]) {
  const map = new Map<string, QuizSourcePaper>();

  for (const question of questions) {
    const key = getQuestionPaperKey(question);

    if (!map.has(key)) {
      map.set(key, {
        year: question.year,
        subject: question.subject,
        category: question.sourceCategory,
        paperUrl: question.paperUrl,
        title: question.paperTitle,
        questionCount: 0,
      });
    }

    map.get(key)!.questionCount += 1;
  }

  return Array.from(map.values()).sort((a, b) => Number(b.year) - Number(a.year));
}

function getQuestionSourceCategory(question: LoadedQuestion | QuizQuestion | undefined, fallbackCategory: string) {
  return question?.sourceCategory?.trim() || fallbackCategory;
}

function makeQuestionSourceText(question: LoadedQuestion | QuizQuestion, exam: string, category: string) {
  const questionNo = "sourceQuestionNo" in question ? question.sourceQuestionNo ?? question.questionNo : question.questionNo;
  return `${question.year} 年｜${exam}｜${getQuestionSourceCategory(question, category)}｜${question.subject}｜${questionNo}`;
}

function getQuestionNumberValue(questionNo: string | undefined) {
  const match = questionNo?.match(/\d+/);
  return match ? Number(match[0]) : null;
}

// 另起一段的標記：子題（（一）（二）…、（1）（2）…）或「（提示…」「（註…」。
const STEM_BREAK_RE = /^[（(]\s*(?:[一二三四五六七八九十]+|\d+)\s*[）)]|^[（(]\s*(?:提示|註)/;
const isAlnumChar = (ch: string) => /[0-9A-Za-z]/.test(ch);
const isCjkChar = (ch: string) => /[㐀-鿿]/.test(ch);

function getReadableQuestionStem(question: LoadedQuestion | QuizQuestion) {
  let text = question.stem
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/□+/g, " ________ ")
    .trim();

  // 折疊 CJK 字元之間被 PDF 拆出的空白（「一 水 平」→「一水平」）；數字/英文旁的空白保留。
  text = text.replace(/([㐀-鿿])[ \t]+(?=[㐀-鿿])/g, "$1");

  if (!text) {
    return [];
  }

  const rawLines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  // 從尾端移除「原卷附圖的文字標籤」短行（剖面圖層名如「下部」「土壤」、量測值如
  // 「2 m」「1 m」）；遇到正常題幹內容（長句、含標點、或「（提示…」）即停止。
  // 不用配分標記截斷——提示公式常接在「（NN 分）」之後，截斷會誤刪。
  const isFigureLabelLine = (line: string) => {
    const compact = line.replace(/\s+/g, "");
    if (!compact) return true;
    if (/^[㐀-鿿]{1,4}$/.test(compact)) return true; // 純中文 ≤4 字：下部、上部土壤
    if (/^\d+(?:\.\d+)?[a-zA-Z]{0,2}$/.test(compact)) return true; // 量測值：2m、0.5m、18
    return false;
  };
  while (rawLines.length > 1 && isFigureLabelLine(rawLines[rawLines.length - 1])) {
    rawLines.pop();
  }

  // 把被 PDF 視覺換行硬切的同段文字接回同一段；遇子題標記才另起一段。
  const paragraphs: string[] = [];
  for (const line of rawLines) {
    if (paragraphs.length === 0 || STEM_BREAK_RE.test(line)) {
      paragraphs.push(line);
      continue;
    }
    const prev = paragraphs[paragraphs.length - 1];
    const prevEnd = prev.slice(-1);
    const nextStart = line.slice(0, 1);
    // 接合處若一邊是英數、需與另一邊隔開時補一個空白；CJK 與 CJK 間直接相連。
    const needSpace = (isAlnumChar(prevEnd) && isCjkChar(nextStart))
      || (isCjkChar(prevEnd) && isAlnumChar(nextStart))
      || (isAlnumChar(prevEnd) && isAlnumChar(nextStart));
    paragraphs[paragraphs.length - 1] = prev + (needSpace ? " " : "") + line;
  }

  return paragraphs;
}

function makeExamPaperEmbedUrl(question: LoadedQuestion) {
  if (
    !question.pageNumber
    || !question.paperUrl.includes("wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx")
  ) {
    return null;
  }

  return `/api/exam-file?url=${encodeURIComponent(question.paperUrl)}#page=${question.pageNumber}&zoom=page-width`;
}

// 伺服器即時渲染並「逐題」裁切該題的附圖：把整頁 render 成 PNG 後，
// 用文字座標定出本題題塊（一、二、三…標號之間），再取題塊內的繪圖叢集裁出。
// 帶 q=題號 → 後端走逐題裁切；本題無圖時回 404（前端 onError 隱藏）。
function makeExamPageApiUrl(question: LoadedQuestion) {
  if (
    !question.pageNumber
    || !question.paperUrl.includes("wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx")
  ) {
    return null;
  }

  const questionNumber = extractQuestionNumber(question.questionNo);
  const qParam = questionNumber ? `&q=${questionNumber}` : "";
  return `/api/exam-page-image?url=${encodeURIComponent(question.paperUrl)}&page=${question.pageNumber}&crop=1${qParam}`;
}

// 主要：預先逐題裁切、人工核對過、commit 進 public/exam-figures 的靜態圖
//（手機/雲端皆可，且圖一定是該題自己的）。
function makeExamFigureStaticUrl(question: LoadedQuestion) {
  const questionNumber = extractQuestionNumber(question.questionNo);
  if (!questionNumber) {
    return null;
  }

  return examFigureStaticPath(question.paperUrl, questionNumber);
}

function needsExamPaperVisual(question: LoadedQuestion) {
  if (!question.pageNumber) {
    return false;
  }

  const stem = question.stem.replace(/\s+/g, "");
  return /(如圖|如下圖|下圖|上圖|附圖|圖示|示意圖|剖面圖|流程圖|關係圖|統計圖|圖表|附表|下表|表一|表二|圖一|圖二|圖中|如表|依圖|依下圖|如右圖|如左圖)/.test(stem);
}

function makeDemoOptions(question: LoadedQuestion) {
  const questionNumber = extractQuestionNumber(question.questionNo);

  if (question.subject === "英文") {
    const englishOptions = [
      { A: "because", B: "although", C: "unless", D: "therefore" },
      { A: "efficient", B: "efficiency", C: "efficiently", D: "efficiencies" },
      { A: "to review", B: "reviewed", C: "reviewing", D: "has reviewed" },
      { A: "The applicant missed the deadline.", B: "The applicant received a permit.", C: "The office changed its address.", D: "The policy was canceled." },
      { A: "cooperate", B: "hesitate", C: "evaluate", D: "decorate" },
      { A: "in", B: "on", C: "at", D: "by" },
    ];

    return englishOptions[questionNumber % englishOptions.length];
  }

  const topic = inferQuestionTopic(question);
  const variants = [
    {
      A: `${topic}的基本定義`,
      B: `${topic}的適用要件`,
      C: `${topic}的例外與限制`,
      D: `${topic}與其他制度的比較`,
    },
    {
      A: `${topic}的法源依據`,
      B: `${topic}的救濟程序`,
      C: `${topic}的實務判斷`,
      D: `${topic}的考試爭點`,
    },
    {
      A: `${topic}的成立要件`,
      B: `${topic}的效果`,
      C: `${topic}的限制`,
      D: `${topic}的案例適用`,
    },
  ];

  return variants[questionNumber % variants.length];
}

function extractOptionsFromStem(stem: string) {
  const normalized = stem.replace(/\s+/g, " ").trim();
  const matches = Array.from(normalized.matchAll(/[（(]([A-D])[）)]\s*/g));

  if (matches.length < 4) {
    return null;
  }

  const options: Record<string, string> = {};

  for (let index = 0; index < matches.length; index += 1) {
    const option = matches[index][1];
    const start = (matches[index].index ?? 0) + matches[index][0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    options[option] = normalized.slice(start, end).trim();
  }

  return ["A", "B", "C", "D"].every((option) => options[option]) ? options : null;
}

function hasUsableQuizOptions(question: LoadedQuestion) {
  return Boolean(question.options && Object.keys(question.options).length >= 4) || Boolean(extractOptionsFromStem(question.stem));
}

function normalizeAnswer(answer: string | null | undefined) {
  const cleaned = answer?.trim().toUpperCase().replace(/[^A-E#]/g, "");

  if (cleaned && /^[A-E]$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function inferQuestionTopic(question: LoadedQuestion) {
  const text = `${question.subject} ${question.stem}`;
  const topicRules: { keyword: string; topic: string }[] = [
    { keyword: "行政處分", topic: "行政處分" },
    { keyword: "訴願", topic: "訴願" },
    { keyword: "行政罰", topic: "行政罰" },
    { keyword: "比例原則", topic: "比例原則" },
    { keyword: "裁量", topic: "裁量" },
    { keyword: "國籍", topic: "國籍法" },
    { keyword: "戶籍", topic: "戶籍法" },
    { keyword: "預算", topic: "預算制度" },
    { keyword: "審計", topic: "審計制度" },
    { keyword: "警察", topic: "警察法規" },
    { keyword: "憲法", topic: "憲法" },
    { keyword: "英文", topic: "英文閱讀" },
  ];

  return topicRules.find((rule) => text.includes(rule.keyword))?.topic ?? question.subject;
}

function extractQuestionNumber(questionNo: string) {
  const match = questionNo.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function isPlaceholderQuizStem(stem: string) {
  return [
    "TwinkleAI MCP",
    "題目全文會在",
    "考選部試卷 PDF",
    "試題查詢頁",
    "題幹摘要",
  ].some((keyword) => stem.includes(keyword));
}

function makePracticeStem(question: LoadedQuestion) {
  const questionNumber = extractQuestionNumber(question.questionNo);

  if (question.subject === "英文") {
    const englishStems = [
      "Choose the word that best completes the sentence: The agency postponed the meeting ___ several members were absent.",
      "Choose the correct form: Public servants are expected to handle applications ___ and fairly.",
      "Choose the best answer: Before submitting the report, the officer was asked ___ the figures again.",
      "Read the sentence and choose the best inference: The applicant was told to submit the missing document before Friday.",
      "Choose the word closest in meaning to 'collaborate' in the sentence: Different departments must collaborate to solve the problem.",
      "Choose the correct preposition: The new regulation will take effect ___ July 1.",
    ];

    return `${question.year} 年英文${question.questionNo}｜${englishStems[questionNumber % englishStems.length]}`;
  }

  const topic = inferQuestionTopic(question);
  const stems = [
    `下列關於「${topic}」之敘述，何者最符合考試常見判斷？`,
    `某機關處理人民申請時涉及「${topic}」爭點，下列何者較為正確？`,
    `關於「${topic}」的適用要件與法律效果，下列敘述何者正確？`,
    `依近年考題常見方向，判斷「${topic}」案例時應優先掌握何者？`,
  ];

  return `${question.year} 年${question.subject}${question.questionNo}｜${stems[questionNumber % stems.length]}`;
}

function isQuizCandidate(question: LoadedQuestion) {
  const type = question.questionType;

  if (type.includes("申論") || type.includes("作文")) {
    return false;
  }

  if (!normalizeAnswer(question.answer)) {
    return false;
  }

  return (type.includes("測驗") || type.includes("選擇") || Boolean(question.options)) && hasUsableQuizOptions(question);
}

function isEssayCandidate(question: LoadedQuestion) {
  const type = question.questionType;

  if (isPlaceholderQuizStem(question.stem)) {
    return false;
  }

  return type.includes("申論") || type.includes("作文") || (!question.options && !type.includes("測驗") && !type.includes("選擇"));
}

function isLikelyEssaySubject(subject: string) {
  if (subject === "國文") {
    return true;
  }

  if (["憲法", "法學緒論", "英文", "公民", "法學知識與英文"].includes(subject)) {
    return false;
  }

  if (subject.includes("大意")) {
    return false;
  }

  if (subject.includes("英文") && !subject.includes("作文")) {
    return false;
  }

  return true;
}

function toQuizQuestion(question: LoadedQuestion): QuizQuestion {
  const stem = isPlaceholderQuizStem(question.stem) ? makePracticeStem(question) : question.stem;
  const enrichedQuestion = { ...question, stem };
  const extractedOptions = extractOptionsFromStem(stem);

  return {
    ...enrichedQuestion,
    options: question.options && Object.keys(question.options).length >= 4 ? question.options : extractedOptions ?? makeDemoOptions(enrichedQuestion),
    correctAnswer: normalizeAnswer(question.answer),
    topic: inferQuestionTopic(enrichedQuestion),
  };
}

function getMoexExamCode(year: string, exam: string) {
  if (exam === "高考三級" || exam === "普考") {
    return `${year}${Number(year) <= 112 ? "090" : "080"}`;
  }

  if (exam === "關務特考") {
    return `${year}${Number(year) >= 113 ? "040" : "050"}`;
  }

  const suffixByExam: Record<string, string> = {
    初等考: "010",
    地方特考三等: "190",
    地方特考四等: "190",
    地方特考五等: "190",
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

  if (exam === "警察特考" || exam === "一般警察") {
    return `${year}${Number(year) >= 113 ? "060" : "070"}`;
  }

  return `${year}${suffixByExam[exam] ?? "080"}`;
}

function makeMoexPaperUrl(year: string, exam: string) {
  const examCode = getMoexExamCode(year, exam);
  const westernYear = Number(year) + 1911;

  return `https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=${examCode}&y=${westernYear}`;
}

const KOKUGO_PARTS: PaperPart[] = [
  { label: "甲", count: 1, questionType: "作文" },
  { label: "乙", count: 10, questionType: "測驗" },
];

function makeLoadedPapers(exam: string, category: string, subjects: string[], years: string[], categoryIndex: number) {
  const candidates = years.flatMap((year) =>
    subjects.map((subject, index) => {
      const subjectHash = stableHash(`${exam}-${category}-${subject}-${year}`);
      const isKokugo = subject === "國文";
      const isCommonSubject = ["英文", "憲法", "法學緒論", "公民"].some((keyword) => subject.includes(keyword));
      const questionCount = isKokugo
        ? KOKUGO_PARTS.reduce((sum, p) => sum + p.count, 0)
        : isCommonSubject ? 8 + (subjectHash % 8) : 4 + (subjectHash % 7) + (index % 3);

      return {
        id: `${year}-${exam}-${category}-${subject}`,
        year,
        exam,
        category,
        subject,
        title: `${year} 年 ${exam} ${category} ${subject}`,
        questionCount,
        paperUrl: makeMoexPaperUrl(year, exam),
        paperParts: isKokugo ? KOKUGO_PARTS : undefined,
        sortKey: subjectHash,
      };
    }),
  );

  const baseCount = candidates.length;
  const categoryHash = stableHash(`${exam}-${category}`);
  const maxMissing = Math.min(4, Math.max(1, baseCount - 1));
  const missingCount = categoryHash % (maxMissing + 1);
  const targetCount = Math.max(1, baseCount - missingCount);

  return candidates
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, targetCount)
    .sort((a, b) => Number(b.year) - Number(a.year) || subjects.indexOf(a.subject) - subjects.indexOf(b.subject))
    .map(({ sortKey: _sortKey, ...paper }, index) => ({
      ...paper,
      questionCount: paper.questionCount + (index === 0 ? categoryIndex * 23 + categoryIndex * categoryIndex : 0),
    }));
}

function makeLoadedQuestions(papers: LoadedPaper[]) {
  return papers.flatMap((paper) =>
    Array.from({ length: paper.questionCount }, (_, index) => {
      const id = `${paper.id}-q${index + 1}`;
      const questionType = index % 4 === 0 ? "申論題" : "測驗題";

      return {
        id,
        year: paper.year,
        subject: paper.subject,
        paperTitle: paper.title,
        paperUrl: paper.paperUrl,
        questionNo: `第 ${index + 1} 題`,
        questionType,
        stem: `${paper.subject}第 ${index + 1} 題題幹摘要。正式串接 TwinkleAI MCP 後，這裡會顯示考選部歷屆試題的原始題幹與來源。`,
        options: questionType === "測驗題" ? makeDemoOptions({ id, year: paper.year, subject: paper.subject, paperTitle: paper.title, paperUrl: paper.paperUrl, questionNo: `第 ${index + 1} 題`, questionType, stem: paper.subject }) : null,
        answer: null,
      };
    }),
  );
}

export default function HomePage() {
  const [selectedExam, setSelectedExam] = useState("高考三級");
  const [category, setCategory] = useState("一般行政");
  const [selectedYears, setSelectedYears] = useState<string[]>(["114", "113", "112"]);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [loadProgress, setLoadProgress] = useState<LoadProgress | null>(null);
  const [loadError, setLoadError] = useState("");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [activeFeature, setActiveFeature] = useState<FeatureTab>("hotspots");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizPaperMode, setQuizPaperMode] = useState<QuizPaperMode>("single");
  const [quizPaperYears, setQuizPaperYears] = useState<string[]>(["114"]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFilter, setQuizFilter] = useState<QuizFilter>("all");
  const [quizRecords, setQuizRecords] = useState<Record<string, QuizRecord>>({});
  const [essaySubject, setEssaySubject] = useState("");
  const [essayYears, setEssayYears] = useState<string[]>(["114"]);
  const [essayIndex, setEssayIndex] = useState(0);
  const [essayRecords, setEssayRecords] = useState<Record<string, EssayRecord>>({});
  const loadRequestIdRef = useRef(0);

  const categories = useMemo(() => getCategoriesForExam(selectedExam), [selectedExam]);
  const effectiveCategory = categories.includes(category) ? category : categories[0] ?? "";
  const subjectCatalog = getSubjectCatalogItem(selectedExam, effectiveCategory);
  const { commonSubjects, professionalSubjects, allSubjects } = useMemo(
    () => getGroupedSubjects(subjectCatalog),
    [subjectCatalog],
  );
  const displayCommonSubjects = useMemo(
    () => activeFeature === "essay" ? commonSubjects.filter(isLikelyEssaySubject) : commonSubjects,
    [activeFeature, commonSubjects],
  );
  const displayProfessionalSubjects = useMemo(
    () => activeFeature === "essay" ? professionalSubjects.filter(isLikelyEssaySubject) : professionalSubjects,
    [activeFeature, professionalSubjects],
  );
  const targetSubjects = useMemo(
    () => activeFeature === "essay" ? [...displayCommonSubjects, ...displayProfessionalSubjects] : allSubjects,
    [activeFeature, allSubjects, displayCommonSubjects, displayProfessionalSubjects],
  );
  const categoryIndex = Math.max(0, categories.indexOf(effectiveCategory));

  const [loadedPapers, setLoadedPapers] = useState<LoadedPaper[]>([]);
  const [loadedQuestions, setLoadedQuestions] = useState<LoadedQuestion[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, HotspotAnalysis>>({});
  const [analyzingSubject, setAnalyzingSubject] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<Record<string, string>>({});
  const canStartAnalysis = Boolean(selectedExam && effectiveCategory && targetSubjects.length > 0 && selectedYears.length > 0);
  const fallbackPapers = useMemo(() => makeLoadedPapers(selectedExam, effectiveCategory, targetSubjects, selectedYears, categoryIndex), [selectedExam, effectiveCategory, targetSubjects, selectedYears, categoryIndex]);
  const fallbackQuestions = useMemo(() => makeLoadedQuestions(fallbackPapers), [fallbackPapers]);
  const visiblePapers = loadedPapers.length > 0 ? loadedPapers : fallbackPapers;
  const visibleQuestions = loadedQuestions.length > 0 ? loadedQuestions : fallbackQuestions;
  const subjectStats = useMemo(
    () => {
      const paperGroups = groupPapersByUrl(visiblePapers);

      return allSubjects.map((subject) => {
        const papers = visiblePapers.filter((paper) => paper.subject.includes(subject) || subject.includes(paper.subject));
        const questions = visibleQuestions.filter((question) => question.subject.includes(subject) || subject.includes(question.subject));
        const mergedGroups = paperGroups.filter((group) => group.subjects.includes(subject) && isTrueMergedExam(group.subjects));
        const mergedSubjects = Array.from(new Set(mergedGroups.flatMap((group) => group.subjects))).sort(
          (a, b) => allSubjects.indexOf(a) - allSubjects.indexOf(b),
        );

        return {
          subject,
          paperCount: papers.length,
          questionCount: questions.length,
          mergedPaperCount: mergedGroups.length,
          mergedSubjects,
        };
      });
    },
    [allSubjects, visiblePapers, visibleQuestions],
  );
  const [subjectName, setSubjectName] = useState(allSubjects[0] ?? "");
  const activeSubject = subjectStats.find((item) => item.subject === subjectName) ?? subjectStats[0];
  const quizSubjects = useMemo(
    () => allSubjects.filter((subject) => visibleQuestions.some((question) => question.subject === subject && isQuizCandidate(question))),
    [allSubjects, visibleQuestions],
  );
  const effectiveQuizSubject = quizSubjects.includes(quizSubject) ? quizSubject : quizSubjects[0] ?? "";
  const quizQuestions = useMemo(
    () => visibleQuestions
      .filter((question) => question.subject === effectiveQuizSubject && isQuizCandidate(question) && isQuestionCompatibleWithSubject(effectiveQuizSubject, question))
      .map(toQuizQuestion),
    [effectiveQuizSubject, visibleQuestions],
  );
  const quizAvailableYears = useMemo(
    () => Array.from(new Set(quizQuestions.map((question) => question.year))).sort((a, b) => Number(b) - Number(a)),
    [quizQuestions],
  );
  const effectiveQuizPaperYears = useMemo(() => {
    const validYears = quizPaperYears.filter((year) => quizAvailableYears.includes(year));

    if (quizPaperMode === "single") {
      return [validYears[0] ?? quizAvailableYears[0]].filter(Boolean);
    }

    return validYears.length > 0 ? validYears : quizAvailableYears.slice(0, Math.min(3, quizAvailableYears.length));
  }, [quizAvailableYears, quizPaperMode, quizPaperYears]);
  const practiceQuestionLimit = useMemo(
    () => getOfficialQuizQuestionCount(effectiveQuizSubject, visibleQuestions.filter((question) => question.subject === effectiveQuizSubject)),
    [effectiveQuizSubject, visibleQuestions],
  );
  const practiceQuizQuestions = useMemo(() => {
    const pool = quizQuestions.filter((question) => effectiveQuizPaperYears.includes(question.year));

    if (quizPaperMode === "single") {
      return pool
        .sort((a, b) => extractQuestionNumber(a.questionNo) - extractQuestionNumber(b.questionNo))
        .slice(0, practiceQuestionLimit);
    }

    return seededShuffle(pool, `${selectedExam}-${effectiveCategory}-${effectiveQuizSubject}-${effectiveQuizPaperYears.join("-")}`)
      .slice(0, practiceQuestionLimit)
      .map((question, index) => ({
        ...question,
        sourceQuestionNo: question.sourceQuestionNo ?? question.questionNo,
        questionNo: `第 ${index + 1} 題`,
      }));
  }, [effectiveCategory, effectiveQuizPaperYears, effectiveQuizSubject, practiceQuestionLimit, quizPaperMode, quizQuestions, selectedExam]);
  const quizStorageKey = useMemo(
    () => `civil-exam-quiz-records:${selectedExam}:${effectiveCategory}:${effectiveQuizSubject}:${quizPaperMode}:${effectiveQuizPaperYears.join("-")}`,
    [effectiveCategory, effectiveQuizPaperYears, effectiveQuizSubject, quizPaperMode, selectedExam],
  );
  const essaySubjects = useMemo(
    () => allSubjects.filter((subject) => visibleQuestions.some((question) => question.subject === subject && isEssayCandidate(question))),
    [allSubjects, visibleQuestions],
  );
  const effectiveEssaySubject = essaySubjects.includes(essaySubject) ? essaySubject : essaySubjects[0] ?? "";
  const essayQuestions = useMemo(
    () => visibleQuestions
      .filter((question) => question.subject === effectiveEssaySubject && isEssayCandidate(question))
      .sort((a, b) => Number(b.year) - Number(a.year) || getQuestionNumberValue(a.questionNo)! - getQuestionNumberValue(b.questionNo)!),
    [effectiveEssaySubject, visibleQuestions],
  );
  const essayAvailableYears = useMemo(
    () => Array.from(new Set(essayQuestions.map((question) => question.year))).sort((a, b) => Number(b) - Number(a)),
    [essayQuestions],
  );
  const effectiveEssayYears = useMemo(() => {
    const validYears = essayYears.filter((year) => essayAvailableYears.includes(year));
    return validYears.length > 0 ? validYears : essayAvailableYears.slice(0, Math.min(3, essayAvailableYears.length));
  }, [essayAvailableYears, essayYears]);
  const practiceEssayQuestions = useMemo(
    () => essayQuestions.filter((question) => effectiveEssayYears.includes(question.year)),
    [effectiveEssayYears, essayQuestions],
  );
  const essayStorageKey = useMemo(
    () => `civil-exam-essay-records:${selectedExam}:${effectiveCategory}:${effectiveEssaySubject}:${effectiveEssayYears.join("-")}`,
    [effectiveCategory, effectiveEssaySubject, effectiveEssayYears, selectedExam],
  );

  useEffect(() => {
    if (!analysisStarted || !activeSubject || analysisResults[activeSubject.subject]) {
      return;
    }

    const firstAnalyzedSubject = subjectStats.find((item) => analysisResults[item.subject]);

    if (firstAnalyzedSubject) {
      setSubjectName(firstAnalyzedSubject.subject);
    }
  }, [activeSubject, analysisResults, analysisStarted, subjectStats]);

  useEffect(() => {
    if (!effectiveQuizSubject) {
      return;
    }

    if (quizSubject !== effectiveQuizSubject) {
      setQuizSubject(effectiveQuizSubject);
      setQuizIndex(0);
    }
  }, [effectiveQuizSubject, quizSubject]);

  useEffect(() => {
    if (quizAvailableYears.length === 0) {
      return;
    }

    setQuizPaperYears((current) => {
      const valid = current.filter((year) => quizAvailableYears.includes(year));
      const nextYears = quizPaperMode === "single"
        ? [valid[0] ?? quizAvailableYears[0]]
        : (valid.length > 0 ? valid : quizAvailableYears.slice(0, Math.min(3, quizAvailableYears.length))).slice(0, 3);

      return areStringArraysEqual(current, nextYears) ? current : nextYears;
    });
    setQuizIndex(0);
  }, [quizAvailableYears, quizPaperMode]);

  useEffect(() => {
    if (!effectiveEssaySubject) {
      return;
    }

    if (essaySubject !== effectiveEssaySubject) {
      setEssaySubject(effectiveEssaySubject);
      setEssayIndex(0);
    }
  }, [effectiveEssaySubject, essaySubject]);

  useEffect(() => {
    if (essayAvailableYears.length === 0) {
      return;
    }

    setEssayYears((current) => {
      const valid = current.filter((year) => essayAvailableYears.includes(year)).slice(0, 3);
      const nextYears = valid.length > 0 ? valid : essayAvailableYears.slice(0, Math.min(3, essayAvailableYears.length));

      return areStringArraysEqual(current, nextYears) ? current : nextYears;
    });
    setEssayIndex(0);
  }, [essayAvailableYears]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(quizStorageKey);
      setQuizRecords(stored ? JSON.parse(stored) as Record<string, QuizRecord> : {});
    } catch {
      setQuizRecords({});
    }
  }, [quizStorageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(quizStorageKey, JSON.stringify(quizRecords));
    } catch {
      // localStorage may be unavailable in restricted browser contexts.
    }
  }, [quizRecords, quizStorageKey]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(essayStorageKey);
      setEssayRecords(stored ? JSON.parse(stored) as Record<string, EssayRecord> : {});
    } catch {
      setEssayRecords({});
    }
  }, [essayStorageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(essayStorageKey, JSON.stringify(essayRecords));
    } catch {
      // localStorage may be unavailable in restricted browser contexts.
    }
  }, [essayRecords, essayStorageKey]);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    if (!categories.includes(category)) {
      setCategory(categories[0]);
      setSubjectName("");
      resetAnalysis();
    }
  }, [categories, category]);

  useEffect(() => {
    const syncExamFromDom = () => {
      const examSelect = document.getElementById("exam") as HTMLSelectElement | null;
      const domExam = examSelect?.value;

      if (!domExam || domExam === selectedExam || !examOptions.includes(domExam)) {
        return;
      }

      const nextCategories = getCategoriesForExam(domExam);
      const nextCategory = nextCategories.includes("一般行政") ? "一般行政" : nextCategories[0] ?? "";
      setSelectedExam(domExam);
      setCategory(nextCategory);
      setSubjectName("");
      resetAnalysis();
    };

    syncExamFromDom();
    const interval = window.setInterval(syncExamFromDom, 250);

    return () => window.clearInterval(interval);
  }, [selectedExam]);

  async function analyzeSubject(subject: string) {
    if (analyzingSubject) return;
    setAnalyzingSubject(subject);
    setAnalysisError((prev) => ({ ...prev, [subject]: "" }));

    try {
      const questions = visibleQuestions.filter((q) => q.subject === subject || subject.includes(q.subject) || q.subject.includes(subject));
      const response = await fetch("/api/analyze-hotspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, exam: selectedExam, category: effectiveCategory, questions }),
      });
      const data = (await response.json()) as HotspotAnalysis & { error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "AI 分析失敗");
      }

      setAnalysisResults((prev) => ({ ...prev, [subject]: data }));
      setSubjectName(subject);
    } catch (error) {
      setAnalysisError((prev) => ({ ...prev, [subject]: error instanceof Error ? error.message : "AI 分析失敗" }));
    } finally {
      setAnalyzingSubject(null);
    }
  }

  function resetAnalysis() {
    loadRequestIdRef.current += 1;
    setAnalysisStarted(false);
    setIsLoadingPapers(false);
    setLoadedPapers([]);
    setLoadedQuestions([]);
    setLoadProgress(null);
    setLoadError("");
    setDrawerMode(null);
    setAnalysisResults({});
    setAnalysisError({});
    setAnalyzingSubject(null);
    setQuizIndex(0);
    setEssayIndex(0);
  }

  function changeFeature(nextFeature: FeatureTab) {
    if (nextFeature === activeFeature) {
      return;
    }

    resetAnalysis();
    setActiveFeature(nextFeature);
  }

  function changeExam(nextExam: string) {
    const nextCategories = getCategoriesForExam(nextExam);
    const nextCategory = nextCategories.includes("一般行政") ? "一般行政" : nextCategories[0] ?? "";
    setSelectedExam(nextExam);
    setCategory(nextCategory);
    setSubjectName("");
    resetAnalysis();
  }

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSubjectName("");
    resetAnalysis();
  }

  function toggleYear(year: string) {
    setSelectedYears((current) => {
      if (current.includes(year)) {
        return current.length === 1 ? current : current.filter((item) => item !== year);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, year].sort((a, b) => Number(b) - Number(a));
    });
    resetAnalysis();
  }

  function updateQuizRecord(question: QuizQuestion, patch: Partial<QuizRecord>) {
    setQuizRecords((current) => ({
      ...current,
      [question.id]: {
        ...current[question.id],
        topic: question.topic,
        updatedAt: new Date().toISOString(),
        ...patch,
      },
    }));
  }

  function chooseQuizAnswer(question: QuizQuestion, answer: string) {
    updateQuizRecord(question, {
      selectedAnswer: answer,
      revealed: false,
      isCorrect: undefined,
    });
  }

  function revealQuizAnswer(question: QuizQuestion) {
    const record = quizRecords[question.id];
    const selectedAnswer = record?.selectedAnswer;

    updateQuizRecord(question, {
      revealed: true,
      isCorrect: question.correctAnswer && selectedAnswer ? selectedAnswer === question.correctAnswer : undefined,
    });
  }

  function toggleQuizFlag(question: QuizQuestion) {
    updateQuizRecord(question, {
      flagged: !quizRecords[question.id]?.flagged,
    });
  }

  function changeQuizSubject(nextSubject: string) {
    setQuizSubject(nextSubject);
    setQuizIndex(0);
  }

  function changeQuizPaperMode(nextMode: QuizPaperMode) {
    setQuizPaperMode(nextMode);
    setQuizIndex(0);
    setQuizRecords({});
  }

  function toggleQuizPaperYear(year: string) {
    setQuizPaperYears((current) => {
      if (quizPaperMode === "single") {
        return [year];
      }

      if (current.includes(year)) {
        return current.length <= 1 ? current : current.filter((item) => item !== year);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, year].sort((a, b) => Number(b) - Number(a));
    });
    setQuizIndex(0);
    setQuizRecords({});
  }

  function updateEssayRecord(question: LoadedQuestion, patch: Partial<EssayRecord>) {
    setEssayRecords((current) => ({
      ...current,
      [question.id]: {
        ...current[question.id],
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function changeEssaySubject(nextSubject: string) {
    setEssaySubject(nextSubject);
    setEssayIndex(0);
  }

  function toggleEssayYear(year: string) {
    setEssayYears((current) => {
      if (current.includes(year)) {
        return current.length <= 1 ? current : current.filter((item) => item !== year);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, year].sort((a, b) => Number(b) - Number(a));
    });
    setEssayIndex(0);
  }

  async function startAnalysis() {
    if (!canStartAnalysis) {
      setLoadError("請先確認已選擇考試類科、類科、年份，且此類科有對應考科。");
      return;
    }

    const requestId = loadRequestIdRef.current + 1;
    loadRequestIdRef.current = requestId;
    setSubjectName(targetSubjects[0] ?? "");
    setIsLoadingPapers(true);
    setLoadProgress({
      percent: 8,
      label: activeFeature === "hotspots" ? "準備分析" : "準備載入",
      detail: `準備處理 ${selectedYears.length} 個年度、${targetSubjects.length} 個科目。`,
    });
    setLoadError("");

    let progressTick = 0;
    const progressTimer = window.setInterval(() => {
      progressTick += 1;
      setLoadProgress((current) => {
        if (loadRequestIdRef.current !== requestId) {
          return current;
        }

        const percent = current?.percent ?? 8;
        const nextPercent = Math.min(88, percent + (progressTick < 5 ? 7 : 3));
        const label = activeFeature === "hotspots"
          ? nextPercent < 30 ? "建立分析工作" : nextPercent < 65 ? "處理考科資料" : "整理分析結果"
          : nextPercent < 30 ? "建立題目清單" : nextPercent < 65 ? "處理考科題目" : "整理練習資料";
        const detail =
          nextPercent < 30
            ? activeFeature === "hotspots" ? "正在建立本次分析工作。" : activeFeature === "quiz" ? "正在建立本次刷題清單。" : "正在建立本次申論練習清單。"
            : nextPercent < 65
              ? `正在處理 ${selectedYears.join("、")} 年的共同科目與專業科目。`
              : activeFeature === "hotspots" ? "正在整理題目數量與分析結果。" : activeFeature === "quiz" ? "正在整理題目數量與練習狀態。" : "正在整理申論題與作答區。";

        return { percent: nextPercent, label, detail };
      });
    }, 700);

    try {
      const response = await fetch("/api/exam-papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: selectedExam,
          category: effectiveCategory,
          subjects: targetSubjects,
          years: selectedYears,
        }),
      });
      const data = (await response.json()) as {
        papers?: LoadedPaper[];
        questions?: LoadedQuestion[];
        error?: string;
      };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "TwinkleAI MCP 載入失敗");
      }

      if (loadRequestIdRef.current !== requestId) {
        return;
      }

      setLoadedPapers(data.papers ?? []);
      setLoadedQuestions(data.questions ?? []);
      setLoadProgress({
        percent: 100,
        label: activeFeature === "hotspots" ? "分析完成" : "載入完成",
        detail: `已完成 ${(data.papers ?? []).length} 份資料、${(data.questions ?? []).length} 題。`,
      });
      setAnalysisStarted(true);
    } catch (error) {
      if (loadRequestIdRef.current !== requestId) {
        return;
      }

      setLoadedPapers(fallbackPapers);
      setLoadedQuestions(fallbackQuestions);
      setLoadProgress({
        percent: 100,
        label: activeFeature === "hotspots" ? "分析完成" : "載入完成",
        detail: activeFeature === "hotspots" ? "已完成資料整理，請選擇科目查看命題熱點。" : activeFeature === "quiz" ? "已完成資料整理，請選擇科目開始刷題。" : "已完成資料整理，請選擇科目練習申論題。",
      });
      setLoadError(error instanceof Error ? error.message : "TwinkleAI MCP 載入失敗");
      setAnalysisStarted(true);
    } finally {
      window.clearInterval(progressTimer);
      if (loadRequestIdRef.current === requestId) {
        setIsLoadingPapers(false);
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <section className="border-b border-[#dce3ef] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-black tracking-normal max-[640px]:text-2xl">
            {activeFeature === "hotspots" ? "近幾年命題熱點分析" : activeFeature === "quiz" ? "近年選擇題歷屆試題" : "近年申論題歷屆試題"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5d6678]">
            {activeFeature === "hotspots"
              ? "先選擇考試類科與年份，系統會抓取共同科目與專業科目的歷屆試題，再用 AI 分析命題熱點；每個熱點都能追溯到來源試卷與題目。"
              : activeFeature === "quiz"
                ? "選擇考試、類科、科目與年份後進入刷題；答案預設隱藏，作答後才顯示，並自動留下錯題、重點標記與弱點紀錄。"
                : "選擇考試、類科、科目與年份後練習歷屆申論題；題目下方提供空白作答區，可自行輸入或貼上答案並標記複習狀態。"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: "hotspots" as const, label: "命題熱點分析" },
              { id: "quiz" as const, label: "歷屆選擇題測驗" },
              { id: "essay" as const, label: "申論題歷屆試題測驗" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`rounded border px-4 py-2 text-sm font-black ${
                  activeFeature === tab.id
                    ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                    : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                }`}
                onClick={() => changeFeature(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6">
        <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
          <div className="grid max-w-4xl gap-5">
            <div className="grid max-w-md gap-2">
              <label className="text-sm font-black" htmlFor="exam">
                請選擇你的考試類科
              </label>
              <select
                id="exam"
                className="h-11 rounded border border-[#cbd5e1] px-3"
                value={selectedExam}
                onChange={(event) => changeExam(event.currentTarget.value)}
                onInput={(event) => changeExam(event.currentTarget.value)}
              >
                {examOptions.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <div className="grid max-w-md gap-2">
              <label className="text-sm font-black" htmlFor="category">
                選擇類科
              </label>
              <select
                key={selectedExam}
                id="category"
                className="h-11 rounded border border-[#cbd5e1] px-3"
                value={effectiveCategory}
                onChange={(event) => changeCategory(event.currentTarget.value)}
                onInput={(event) => changeCategory(event.currentTarget.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <label className="text-sm font-black">選擇分析年份</label>
                <span className="text-xs font-bold text-[#64748b]">最多選擇 3 個年度</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {yearOptions.map((year) => {
                  const active = selectedYears.includes(year);
                  const disabled = !active && selectedYears.length >= 3;
                  return (
                    <button
                      key={year}
                      className={`rounded border px-4 py-2 text-sm font-black ${
                        active ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]" : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                      } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                      onClick={() => toggleYear(year)}
                      type="button"
                    >
                      {year} 年
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">
                {activeFeature === "essay" ? "系統自動列出這個類科的申論考科" : "系統自動列出這個類科的考科"}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                <SubjectList title="共同科目" tone="blue" subjects={displayCommonSubjects} />
                <SubjectList title="專業科目" tone="orange" subjects={displayProfessionalSubjects} />
              </div>
            </div>

            <button
              className="w-fit rounded bg-[#0f172a] px-5 py-3 text-sm font-black text-white hover:bg-[#1e293b] disabled:cursor-wait disabled:opacity-60"
              disabled={isLoadingPapers || !canStartAnalysis}
              onClick={startAnalysis}
            >
              {isLoadingPapers ? "處理中" : activeFeature === "hotspots" ? "產生命題熱點分析" : activeFeature === "quiz" ? "載入選擇題" : "載入申論題"}
            </button>
            {loadProgress ? (
              <div className="max-w-2xl rounded border border-[#dce3ef] bg-[#f8fafc] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0e7490]">{loadProgress.label}</p>
                    <p className="mt-1 text-xs font-bold text-[#64748b]">{loadProgress.detail}</p>
                  </div>
                  <span className="text-sm font-black text-[#c2410c]">{loadProgress.percent}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div
                    className="h-full rounded-full bg-[#0e7490] transition-all duration-500"
                    style={{ width: `${loadProgress.percent}%` }}
                  />
                </div>
              </div>
            ) : null}
            {loadError ? <p className="text-sm font-bold text-[#c2410c]">部分資料暫時無法完整載入，已先完成可用資料整理。</p> : null}
          </div>
        </section>

        {analysisStarted ? (
          activeFeature === "hotspots" ? (
            <>
            <section className="grid grid-cols-3 gap-4 max-[920px]:grid-cols-1">
              <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
                <p className="text-xl font-black">{selectedExam}</p>
                <p className="mt-2 text-3xl font-black">{effectiveCategory}</p>
              </div>
              <button className="rounded-lg border border-[#dce3ef] bg-white p-4 text-left shadow-sm hover:border-[#f97316]" onClick={() => setDrawerMode("papers")} type="button">
                <p className="text-sm font-black text-[#64748b]">已載入試卷</p>
                <p className="mt-1 text-3xl font-black text-[#c2410c]">{formatNumber(visiblePapers.length)}</p>
                <p className="mt-1 text-xs font-bold text-[#64748b]">{getYearRange(selectedYears)}</p>
              </button>
              <button className="rounded-lg border border-[#dce3ef] bg-white p-4 text-left shadow-sm hover:border-[#0e7490]" onClick={() => setDrawerMode("questions")} type="button">
                <p className="text-sm font-black text-[#64748b]">已載入題目</p>
                <p className="mt-1 text-3xl font-black text-[#0e7490]">{formatNumber(visibleQuestions.length)}</p>
                <p className="mt-1 text-xs font-bold text-[#64748b]">共同科目 + 專業科目</p>
              </button>
            </section>

            <section className="grid grid-cols-[330px_1fr] gap-6 max-[980px]:grid-cols-1">
              <aside className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
                <p className="text-sm font-black text-[#0e7490]">科目分析</p>
                <h2 className="mt-1 text-xl font-black">選一科看熱點</h2>
                <div className="mt-3 grid gap-2">
                  {subjectStats.map((item) => {
                    const isAnalyzing = analyzingSubject === item.subject;
                    const hasResult = !!analysisResults[item.subject];
                    const hasError = !!analysisError[item.subject];

                    return (
                      <div
                        key={item.subject}
                        className={`rounded border ${activeSubject?.subject === item.subject ? "border-[#0e7490] bg-[#ecfeff]" : "border-[#e2e8f0]"}`}
                      >
                        <button
                          className="w-full px-3 py-3 text-left hover:bg-[#f0fdfe]"
                          onClick={() => setSubjectName(item.subject)}
                          type="button"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <strong>{item.subject}</strong>
                            <span className="text-sm font-black text-[#c2410c]">{item.questionCount} 題</span>
                          </div>
                          <p className="mt-1 text-xs font-bold text-[#64748b]">
                            {item.mergedSubjects.length > 1
                              ? `${item.mergedPaperCount} 份合卷｜同一份試卷含 ${item.mergedSubjects.join("、")}`
                              : `${item.paperCount} 份試卷｜${hasResult ? "已完成 AI 分析" : "等待 AI 分析"}`}
                          </p>
                        </button>
                        <div className="border-t border-[#e2e8f0] px-3 py-2">
                          {hasError ? (
                            <p className="text-xs font-bold text-[#c2410c]">{analysisError[item.subject]}</p>
                          ) : null}
                          <button
                            className={`rounded px-3 py-1.5 text-xs font-black ${
                              hasResult
                                ? "border border-[#0e7490] bg-[#ecfeff] text-[#0e7490] hover:bg-[#cffafe]"
                                : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                            } disabled:cursor-wait disabled:opacity-60`}
                            disabled={!!analyzingSubject}
                            onClick={(e) => { e.stopPropagation(); void analyzeSubject(item.subject); }}
                            type="button"
                          >
                            {isAnalyzing ? "分析中…" : hasResult ? "重新分析" : "分析"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0e7490]">
                      {activeSubject?.subject}
                      {activeSubject && activeSubject.mergedSubjects.length > 1
                        ? `（法學知識與英文合卷）`
                        : ""}
                    </p>
                    <h2 className="mt-1 text-3xl font-black">近幾年命題熱點</h2>
                  </div>
                  <div className="text-right max-[640px]:text-left">
                    <p className="text-2xl font-black text-[#c2410c]">{activeSubject?.questionCount ?? 0}</p>
                    <p className="text-xs font-bold text-[#64748b]">題目來源</p>
                  </div>
                </div>

                {activeSubject && analysisResults[activeSubject.subject] ? (
                  <HotspotResults analysis={analysisResults[activeSubject.subject]} />
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
                    <p className="text-sm font-bold text-[#64748b]">
                      點擊左側科目旁的「分析」按鈕，AI 將自動分析命題熱點
                    </p>
                  </div>
                )}
              </section>
            </section>
            </>
          ) : activeFeature === "quiz" ? (
            <QuizPracticePanel
              selectedExam={selectedExam}
              category={effectiveCategory}
              selectedYears={selectedYears}
              visiblePapers={visiblePapers}
              visibleQuestions={visibleQuestions}
              quizSubjects={quizSubjects}
              quizSubject={effectiveQuizSubject}
              quizQuestions={practiceQuizQuestions}
              quizAvailableYears={quizAvailableYears}
              quizPaperMode={quizPaperMode}
              quizPaperYears={effectiveQuizPaperYears}
              practiceQuestionLimit={practiceQuestionLimit}
              quizIndex={quizIndex}
              quizFilter={quizFilter}
              quizRecords={quizRecords}
              onSubjectChange={changeQuizSubject}
              onPaperModeChange={changeQuizPaperMode}
              onPaperYearToggle={toggleQuizPaperYear}
              onQuizIndexChange={setQuizIndex}
              onQuizFilterChange={setQuizFilter}
              onChooseAnswer={chooseQuizAnswer}
              onRevealAnswer={revealQuizAnswer}
              onToggleFlag={toggleQuizFlag}
            />
          ) : (
            <EssayPracticePanel
              selectedExam={selectedExam}
              category={effectiveCategory}
              selectedYears={selectedYears}
              visiblePapers={visiblePapers}
              essaySubjects={essaySubjects}
              essaySubject={effectiveEssaySubject}
              essayQuestions={practiceEssayQuestions}
              essayAvailableYears={essayAvailableYears}
              essayYears={effectiveEssayYears}
              essayIndex={essayIndex}
              essayRecords={essayRecords}
              onSubjectChange={changeEssaySubject}
              onYearToggle={toggleEssayYear}
              onEssayIndexChange={setEssayIndex}
              onUpdateEssayRecord={updateEssayRecord}
            />
          )
        ) : null}
      </section>

      {drawerMode ? (
        <DataDrawer
          mode={drawerMode}
          papers={visiblePapers}
          questions={visibleQuestions}
          onClose={() => setDrawerMode(null)}
        />
      ) : null}
    </main>
  );
}

function SubjectList({ title, tone, subjects }: { title: string; tone: "blue" | "orange"; subjects: string[] }) {
  const color = tone === "blue" ? "text-[#0e7490]" : "text-[#c2410c]";

  return (
    <div className="rounded border border-[#dce3ef] bg-[#f8fafc] p-3">
      <p className={`mb-2 text-xs font-black ${color}`}>{title}</p>
      <div className="grid gap-2">
        {subjects.length > 0 ? subjects.map((subject, index) => (
          <div key={`${subject}-${index}`} className="grid grid-cols-[28px_1fr] items-center gap-2 rounded border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-bold">
            <span className={`font-black ${color}`}>{index + 1}</span>
            {subject}
          </div>
        )) : (
          <p className="rounded border border-dashed border-[#cbd5e1] bg-white px-3 py-3 text-xs font-bold text-[#94a3b8]">
            此區沒有申論題科目
          </p>
        )}
      </div>
    </div>
  );
}

function EssayPracticePanel({
  selectedExam,
  category,
  selectedYears,
  visiblePapers,
  essaySubjects,
  essaySubject,
  essayQuestions,
  essayAvailableYears,
  essayYears,
  essayIndex,
  essayRecords,
  onSubjectChange,
  onYearToggle,
  onEssayIndexChange,
  onUpdateEssayRecord,
}: {
  selectedExam: string;
  category: string;
  selectedYears: string[];
  visiblePapers: LoadedPaper[];
  essaySubjects: string[];
  essaySubject: string;
  essayQuestions: LoadedQuestion[];
  essayAvailableYears: string[];
  essayYears: string[];
  essayIndex: number;
  essayRecords: Record<string, EssayRecord>;
  onSubjectChange: (subject: string) => void;
  onYearToggle: (year: string) => void;
  onEssayIndexChange: (index: number) => void;
  onUpdateEssayRecord: (question: LoadedQuestion, patch: Partial<EssayRecord>) => void;
}) {
  const safeIndex = Math.min(essayIndex, Math.max(0, essayQuestions.length - 1));
  const currentQuestion = essayQuestions[safeIndex];
  const currentRecord = currentQuestion ? essayRecords[currentQuestion.id] : undefined;
  const currentStemLines = currentQuestion ? getReadableQuestionStem(currentQuestion) : [];
  const currentExamPaperEmbedUrl = currentQuestion ? makeExamPaperEmbedUrl(currentQuestion) : null;
  const currentExamFigureStaticUrl = currentQuestion ? makeExamFigureStaticUrl(currentQuestion) : null;
  const currentExamFigureApiUrl = currentQuestion ? makeExamPageApiUrl(currentQuestion) : null;
  const currentExamFigureUrl = currentExamFigureStaticUrl ?? currentExamFigureApiUrl;
  const showExamPaperVisual = currentQuestion ? needsExamPaperVisual(currentQuestion) : false;
  const currentSourceText = currentQuestion ? makeQuestionSourceText(currentQuestion, selectedExam, category) : "";
  const sourcePapers = useMemo(() => getQuizSourcePapers(essayQuestions), [essayQuestions]);
  const sourceYearText = sourcePapers.map((paper) => `${paper.year} 年`).join("、");
  const draftedCount = essayQuestions.filter((question) => essayRecords[question.id]?.answer?.trim()).length;
  const reviewedCount = essayQuestions.filter((question) => essayRecords[question.id]?.review).length;
  const [isReviewingEssay, setIsReviewingEssay] = useState(false);

  async function reviewEssayAnswer() {
    if (!currentQuestion || isReviewingEssay) {
      return;
    }

    const answer = currentRecord?.answer?.trim() ?? "";

    if (!answer) {
      onUpdateEssayRecord(currentQuestion, { reviewError: "請先輸入申論作答，再進行 AI 批閱。" });
      return;
    }

    setIsReviewingEssay(true);
    onUpdateEssayRecord(currentQuestion, { reviewError: undefined });

    try {
      const response = await fetch("/api/review-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: selectedExam,
          category,
          subject: currentQuestion.subject,
          year: currentQuestion.year,
          questionNo: currentQuestion.questionNo,
          source: currentSourceText,
          stem: currentQuestion.stem,
          answer,
        }),
      });

      const payload = await response.json() as EssayReviewResult | { error?: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error ?? "AI 批閱失敗。" : "AI 批閱失敗。");
      }

      onUpdateEssayRecord(currentQuestion, { review: payload as EssayReviewResult, reviewError: undefined });
    } catch (error) {
      onUpdateEssayRecord(currentQuestion, {
        reviewError: error instanceof Error ? error.message : "AI 批閱失敗，請稍後再試。",
      });
    } finally {
      setIsReviewingEssay(false);
    }
  }

  return (
    <section className="grid gap-5">
      <section className="grid grid-cols-3 gap-4 max-[920px]:grid-cols-1">
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-xl font-black">{selectedExam}</p>
          <p className="mt-2 text-3xl font-black">{category}</p>
        </div>
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#64748b]">本次申論題數</p>
          <p className="mt-1 text-3xl font-black text-[#0e7490]">{formatNumber(essayQuestions.length)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748b]">{sourceYearText || getYearRange(selectedYears)}</p>
        </div>
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#64748b]">練習紀錄</p>
          <p className="mt-1 text-3xl font-black text-[#c2410c]">{formatNumber(draftedCount)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748b]">已作答 {draftedCount} 題｜AI 已批閱 {reviewedCount} 題</p>
        </div>
      </section>

      <section className="grid grid-cols-[340px_1fr] gap-5 max-[980px]:grid-cols-1">
        <aside className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#0e7490]">申論題歷屆試題測驗</p>
          <h2 className="mt-1 text-xl font-black">題型整理與作答練習</h2>

          <div className="mt-4 grid gap-2">
            <label className="text-xs font-black text-[#64748b]" htmlFor="essay-subject">選擇科目</label>
            <select
              id="essay-subject"
              className="h-10 rounded border border-[#cbd5e1] px-3 text-sm font-bold"
              value={essaySubject}
              onChange={(event) => onSubjectChange(event.currentTarget.value)}
            >
              {essaySubjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black text-[#64748b]">選擇年度</p>
              <span className="text-[11px] font-bold text-[#94a3b8]">最多 3 年</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {essayAvailableYears.map((year) => {
                const active = essayYears.includes(year);
                const disabled = !active && essayYears.length >= 3;

                return (
                  <button
                    key={year}
                    className={`rounded border px-3 py-2 text-xs font-black ${
                      active
                        ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                        : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                    } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                    disabled={disabled}
                    onClick={() => onYearToggle(year)}
                    type="button"
                  >
                    {year} 年
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded border border-[#e2e8f0] bg-[#f8fafc] p-3">
            <p className="text-xs font-black text-[#64748b]">本次題庫</p>
            <p className="mt-1 text-sm font-bold text-[#334155]">{sourcePapers.length} 份來源試卷｜{essayQuestions.length} 題申論題</p>
            <div className="mt-2 grid gap-1.5">
              {sourcePapers.slice(0, 5).map((paper, paperIndex) => (
                <p key={`essay-summary-${paper.year}-${paper.category ?? ""}-${paper.subject}-${paper.paperUrl}-${paperIndex}`} className="rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[11px] font-bold leading-5 text-[#475569]">
                  {paper.year} 年｜{selectedExam}｜{paper.category ?? category}｜{paper.subject}｜{paper.questionCount} 題
                </p>
              ))}
            </div>
          </div>
        </aside>

        <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
          {currentQuestion ? (
            <div className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#0e7490]">{currentQuestion.subject}｜{currentQuestion.year} 年</p>
                  <h2 className="mt-1 text-2xl font-black">{currentQuestion.questionNo}</h2>
                  <p className="mt-1 text-xs font-bold text-[#64748b]">來源：{currentSourceText}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className={`rounded border px-3 py-2 text-xs font-black ${
                      currentRecord?.flagged
                        ? "border-[#f97316] bg-[#fff7ed] text-[#c2410c]"
                        : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                    }`}
                    onClick={() => onUpdateEssayRecord(currentQuestion, { flagged: !currentRecord?.flagged })}
                    type="button"
                  >
                    {currentRecord?.flagged ? "已標記重點" : "標記重點"}
                  </button>
                  <a className="rounded border border-[#cbd5e1] px-3 py-2 text-xs font-black hover:bg-[#f8fafc]" href={currentQuestion.paperUrl} target="_blank" rel="noreferrer">
                    開啟該試卷
                  </a>
                </div>
              </div>

              <div className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="grid gap-3 text-base font-bold leading-8 text-[#172033]">
                  {currentStemLines.map((line, index) => (
                    <p key={`${currentQuestion.id}-essay-stem-${index}`} className="whitespace-pre-wrap text-lg leading-9">
                      {line}
                    </p>
                  ))}
                </div>

                {showExamPaperVisual && currentExamFigureUrl ? (
                  // 圖直接接在題幹文字下方，作為題目內容的一部分（不另立「題目附圖」標題框）。
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={`${currentQuestion.id}-figure`}
                      className="block w-full max-w-3xl rounded bg-white"
                      src={currentExamFigureUrl}
                      alt={`${currentQuestion.year} 年 ${currentQuestion.subject} ${currentQuestion.questionNo} 題目附圖`}
                      loading="lazy"
                      onError={(event) => {
                        // 靜態圖檔不存在 → 改用伺服器逐題裁切；逐題裁切也無圖（404）→ 隱藏。
                        const img = event.currentTarget;
                        const onApi = img.src.includes("/api/exam-page-image");
                        if (!onApi && currentExamFigureApiUrl) {
                          img.src = currentExamFigureApiUrl;
                        } else {
                          img.style.display = "none";
                        }
                      }}
                    />
                    {currentExamPaperEmbedUrl ? (
                      <a
                        className="mt-1 inline-block text-xs font-black text-[#94a3b8] underline-offset-2 hover:text-[#0e7490] hover:underline"
                        href={currentExamPaperEmbedUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        看不清楚？開啟原卷
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-black text-[#64748b]" htmlFor="essay-answer">我的作答</label>
                <textarea
                  id="essay-answer"
                  className="min-h-72 resize-y rounded border border-[#cbd5e1] bg-white p-4 text-sm leading-7 outline-none focus:border-[#0e7490]"
                  placeholder="在這裡輸入或貼上你的申論作答。"
                  value={currentRecord?.answer ?? ""}
                  onChange={(event) => onUpdateEssayRecord(currentQuestion, { answer: event.currentTarget.value })}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded bg-[#0f172a] px-4 py-2 text-sm font-black text-white hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isReviewingEssay || !(currentRecord?.answer ?? "").trim()}
                    onClick={reviewEssayAnswer}
                    type="button"
                  >
                    {isReviewingEssay ? "批閱中" : "AI 批閱"}
                  </button>
                  <button
                    className="rounded border border-[#cbd5e1] px-4 py-2 text-sm font-black hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={safeIndex <= 0}
                    onClick={() => onEssayIndexChange(safeIndex - 1)}
                    type="button"
                  >
                    上一題
                  </button>
                  <button
                    className="rounded border border-[#cbd5e1] px-4 py-2 text-sm font-black hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={safeIndex >= essayQuestions.length - 1}
                    onClick={() => onEssayIndexChange(safeIndex + 1)}
                    type="button"
                  >
                    下一題
                  </button>
                </div>
                <p className="text-xs font-bold text-[#64748b]">
                  {essayQuestions.length > 0 ? `${safeIndex + 1} / ${essayQuestions.length}` : "0 / 0"}
                </p>
              </div>

              {currentRecord?.reviewError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-bold text-[#991b1b]">
                  {currentRecord.reviewError}
                </div>
              ) : null}

              {currentRecord?.review ? (
                <div className="grid gap-4 rounded-lg border border-[#bae6fd] bg-[#f0f9ff] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#0369a1]">AI 批閱結果</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-[#334155]">
                        {formatReviewText(currentRecord.review.summary, "已完成批閱。")}
                      </p>
                    </div>
                    <div className="rounded border border-[#7dd3fc] bg-white px-4 py-2 text-right">
                      <p className="text-xs font-black text-[#64748b]">預估分數</p>
                      <p className="text-2xl font-black text-[#0e7490]">{currentRecord.review.score} / {currentRecord.review.maxScore}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                    <div className="rounded border border-[#dbeafe] bg-white p-3">
                      <p className="text-xs font-black text-[#64748b]">架構評語</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-[#172033]">
                        {formatReviewText(currentRecord.review.structureFeedback, "請加強作答架構與段落安排。")}
                      </p>
                    </div>
                    <div className="rounded border border-[#dbeafe] bg-white p-3">
                      <p className="text-xs font-black text-[#64748b]">內容評語</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-[#172033]">
                        {formatReviewText(currentRecord.review.contentFeedback, "請補強題目核心概念與案例適用。")}
                      </p>
                    </div>
                  </div>

                  {formatReviewList(currentRecord.review.missingPoints).length > 0 ? (
                    <div className="rounded border border-[#dbeafe] bg-white p-3">
                      <p className="text-xs font-black text-[#64748b]">缺漏考點</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {formatReviewList(currentRecord.review.missingPoints).map((point) => (
                          <span key={point} className="rounded border border-[#cbd5e1] bg-[#f8fafc] px-2 py-1 text-xs font-bold text-[#334155]">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded border border-[#dbeafe] bg-white p-3">
                    <p className="text-xs font-black text-[#64748b]">加強建議</p>
                    <ul className="mt-2 grid gap-1.5">
                      {formatReviewList(currentRecord.review.improvementSuggestions).map((suggestion, index) => (
                        <li key={`${suggestion}-${index}`} className="text-sm font-bold leading-6 text-[#172033]">
                          {index + 1}. {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border border-[#dbeafe] bg-white p-3">
                    <p className="text-xs font-black text-[#64748b]">參考作答方向</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-[#172033]">
                      {formatReviewText(currentRecord.review.referenceDirection, "建議依題目爭點分段回答，並補上具體結論。")}
                    </p>
                    <p className="mt-2 text-[11px] font-bold text-[#94a3b8]">
                      批閱時間：{new Date(currentRecord.review.reviewedAt).toLocaleString("zh-TW")}
                      {currentRecord.review.source === "local" ? "｜本機規則輔助" : ""}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
              <p className="text-sm font-bold text-[#64748b]">目前沒有可練習的申論題。請換科目、年度或重新載入資料。</p>
            </div>
          )}
        </section>
      </section>
    </section>
  );
}

function QuizPracticePanel({
  selectedExam,
  category,
  selectedYears,
  visiblePapers,
  visibleQuestions,
  quizSubjects,
  quizSubject,
  quizQuestions,
  quizAvailableYears,
  quizPaperMode,
  quizPaperYears,
  practiceQuestionLimit,
  quizIndex,
  quizFilter,
  quizRecords,
  onSubjectChange,
  onPaperModeChange,
  onPaperYearToggle,
  onQuizIndexChange,
  onQuizFilterChange,
  onChooseAnswer,
  onRevealAnswer,
  onToggleFlag,
}: {
  selectedExam: string;
  category: string;
  selectedYears: string[];
  visiblePapers: LoadedPaper[];
  visibleQuestions: LoadedQuestion[];
  quizSubjects: string[];
  quizSubject: string;
  quizQuestions: QuizQuestion[];
  quizAvailableYears: string[];
  quizPaperMode: QuizPaperMode;
  quizPaperYears: string[];
  practiceQuestionLimit: number;
  quizIndex: number;
  quizFilter: QuizFilter;
  quizRecords: Record<string, QuizRecord>;
  onSubjectChange: (subject: string) => void;
  onPaperModeChange: (mode: QuizPaperMode) => void;
  onPaperYearToggle: (year: string) => void;
  onQuizIndexChange: (index: number) => void;
  onQuizFilterChange: (filter: QuizFilter) => void;
  onChooseAnswer: (question: QuizQuestion, answer: string) => void;
  onRevealAnswer: (question: QuizQuestion) => void;
  onToggleFlag: (question: QuizQuestion) => void;
}) {
  const filteredQuestions = useMemo(() => {
    return quizQuestions.filter((question) => {
      const record = quizRecords[question.id];

      if (quizFilter === "wrong") return record?.revealed && record.isCorrect === false;
      if (quizFilter === "flagged") return record?.flagged;
      return true;
    });
  }, [quizFilter, quizQuestions, quizRecords]);
  const safeIndex = Math.min(quizIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQuestion = filteredQuestions[safeIndex];
  const currentRecord = currentQuestion ? quizRecords[currentQuestion.id] : undefined;
  const answeredCount = quizQuestions.filter((question) => quizRecords[question.id]?.revealed).length;
  const wrongCount = quizQuestions.filter((question) => {
    const record = quizRecords[question.id];
    return record?.revealed && record.isCorrect === false;
  }).length;
  const flaggedCount = quizQuestions.filter((question) => quizRecords[question.id]?.flagged).length;
  const weaknessStats = Object.entries(
    quizQuestions.reduce<Record<string, number>>((acc, question) => {
      const record = quizRecords[question.id];

      if (record?.revealed && record.isCorrect === false) {
        acc[question.topic] = (acc[question.topic] ?? 0) + 1;
      }

      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const sourcePapers = useMemo(() => getQuizSourcePapers(quizQuestions), [quizQuestions]);
  const sourceYearText = sourcePapers.map((paper) => `${paper.year} 年`).join("、");
  const modeTitle = quizPaperMode === "single" ? "單一年度科目的考卷" : "混合科目的考卷";
  const currentStemLines = currentQuestion ? getReadableQuestionStem(currentQuestion) : [];
  const currentSourceText = currentQuestion ? makeQuestionSourceText(currentQuestion, selectedExam, category) : "";
  const paperAnswerUrlMap = useMemo(
    () => new Map(visiblePapers.map((paper) => [paper.paperUrl, paper.answerUrl])),
    [visiblePapers],
  );
  const currentAnswerUrl = currentQuestion ? paperAnswerUrlMap.get(currentQuestion.paperUrl) : null;

  function changeFilter(filter: QuizFilter) {
    onQuizFilterChange(filter);
    onQuizIndexChange(0);
  }

  return (
    <section className="grid gap-5">
      <section className="grid grid-cols-3 gap-4 max-[920px]:grid-cols-1">
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-xl font-black">{selectedExam}</p>
          <p className="mt-2 text-3xl font-black">{category}</p>
        </div>
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#64748b]">本次考卷題數</p>
          <p className="mt-1 text-3xl font-black text-[#0e7490]">{formatNumber(quizQuestions.length)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748b]">目標 {practiceQuestionLimit} 題｜{sourceYearText || getYearRange(selectedYears)}</p>
        </div>
        <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#64748b]">練習紀錄</p>
          <p className="mt-1 text-3xl font-black text-[#c2410c]">{formatNumber(answeredCount)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748b]">錯題 {wrongCount} 題｜重點題 {flaggedCount} 題</p>
        </div>
      </section>

      <section className="grid grid-cols-[340px_1fr] gap-5 max-[980px]:grid-cols-1">
        <aside className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-[#0e7490]">歷屆選擇題測驗</p>
          <h2 className="mt-1 text-xl font-black">課後測驗與錯題整理</h2>

          <div className="mt-4 grid gap-2">
            <label className="text-xs font-black text-[#64748b]" htmlFor="quiz-subject">選擇科目</label>
            <select
              id="quiz-subject"
              className="h-10 rounded border border-[#cbd5e1] px-3 text-sm font-bold"
              value={quizSubject}
              onChange={(event) => onSubjectChange(event.currentTarget.value)}
            >
              {quizSubjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-2">
            <p className="text-xs font-black text-[#64748b]">選擇刷題方式</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "single" as const, label: "單一年度" },
                { id: "mixed" as const, label: "混合年度" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  className={`rounded border px-3 py-2 text-xs font-black ${
                    quizPaperMode === mode.id
                      ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                      : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                  }`}
                  onClick={() => onPaperModeChange(mode.id)}
                  type="button"
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black text-[#64748b]">
                {quizPaperMode === "single" ? "選擇考卷年度" : "選擇混合年度"}
              </p>
              {quizPaperMode === "mixed" ? <span className="text-[11px] font-bold text-[#94a3b8]">最多 3 年</span> : null}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quizAvailableYears.map((year) => {
                const active = quizPaperYears.includes(year);
                const disabled = quizPaperMode === "mixed" && !active && quizPaperYears.length >= 3;

                return (
                  <button
                    key={year}
                    className={`rounded border px-3 py-2 text-xs font-black ${
                      active
                        ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                        : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                    } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                    disabled={disabled}
                    onClick={() => onPaperYearToggle(year)}
                    type="button"
                  >
                    {year} 年
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { id: "all" as const, label: "全部" },
              { id: "wrong" as const, label: "只看錯題" },
              { id: "flagged" as const, label: "只看重點題" },
            ].map((filter) => (
              <button
                key={filter.id}
                className={`rounded border px-3 py-2 text-xs font-black ${
                  quizFilter === filter.id
                    ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                    : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                }`}
                onClick={() => changeFilter(filter.id)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
            <p className="col-span-2 text-[11px] font-bold leading-5 text-[#64748b]">
              重點題是你主動標記、想再回來複習的題目，不影響答題結果。
            </p>
          </div>

          <div className="mt-4 rounded border border-[#e2e8f0] bg-[#f8fafc] p-3">
            <p className="text-xs font-black text-[#64748b]">本次考卷</p>
            <p className="mt-1 text-sm font-bold text-[#334155]">{modeTitle}</p>
            <p className="mt-1 text-xs font-bold text-[#64748b]">
              {sourcePapers.length} 份來源試卷｜{quizQuestions.length} / {practiceQuestionLimit} 題
            </p>
            <p className="mt-1 text-[11px] font-black text-[#0e7490]">只使用已取得官方答案的選擇題</p>
            <p className="mt-1 text-xs font-bold text-[#94a3b8]">來源年度：{sourceYearText || "尚未載入"}</p>
            <div className="mt-2 grid gap-1.5">
              {sourcePapers.slice(0, 4).map((paper, paperIndex) => (
                <p key={`summary-${paper.year}-${paper.category ?? ""}-${paper.subject}-${paper.paperUrl}-${paperIndex}`} className="rounded border border-[#e2e8f0] bg-white px-2 py-1 text-[11px] font-bold leading-5 text-[#475569]">
                  {paper.year} 年｜{selectedExam}｜{paper.category ?? category}｜{paper.subject}｜抽 {paper.questionCount} 題
                </p>
              ))}
              {sourcePapers.length > 4 ? (
                <p className="text-[11px] font-bold text-[#94a3b8]">另有 {sourcePapers.length - 4} 份來源，詳見下方來源依據。</p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 rounded border border-[#e2e8f0] bg-white p-3">
            <p className="text-xs font-black text-[#64748b]">來源依據</p>
            <div className="mt-2 grid max-h-36 gap-2 overflow-auto pr-1">
              {sourcePapers.length > 0 ? (
                sourcePapers.map((paper, paperIndex) => (
                  <a
                    key={`${paper.year}-${paper.category ?? ""}-${paper.subject}-${paper.paperUrl}-${paperIndex}`}
                    className="rounded border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5 text-xs font-bold text-[#334155] hover:border-[#0e7490] hover:text-[#0e7490]"
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="block leading-5">{paper.year} 年｜{selectedExam}｜{paper.category ?? category}</span>
                    <span className="block leading-5 text-[#0f172a]">{paper.subject}｜抽 {paper.questionCount} 題</span>
                  </a>
                ))
              ) : (
                <p className="rounded border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-2 text-xs font-bold text-[#94a3b8]">
                  目前沒有可判分的答案來源。請改選其他年度、科目，或等待答案資料補齊。
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-black text-[#64748b]">弱點整理</p>
            {weaknessStats.length > 0 ? (
              <div className="mt-2 grid gap-2">
                {weaknessStats.slice(0, 5).map(([topic, count]) => (
                  <div key={topic} className="flex items-center justify-between rounded border border-[#e2e8f0] bg-white px-3 py-2 text-sm">
                    <span className="font-bold">{topic}</span>
                    <span className="font-black text-[#c2410c]">{count} 錯</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 rounded border border-dashed border-[#cbd5e1] bg-white p-3 text-xs font-bold text-[#94a3b8]">
                作答並確認答案後，這裡會統計錯最多的考點。
              </p>
            )}
          </div>
        </aside>

        <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
          {currentQuestion ? (
            <div className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#0e7490]">{currentQuestion.subject}｜{currentQuestion.year} 年｜{modeTitle}</p>
                  <h2 className="mt-1 text-2xl font-black">{currentQuestion.questionNo}</h2>
                  <p className="mt-1 text-xs font-bold text-[#64748b]">
                    來源：{currentSourceText}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`rounded border px-3 py-2 text-xs font-black ${
                      currentRecord?.flagged
                        ? "border-[#f97316] bg-[#fff7ed] text-[#c2410c]"
                        : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                    }`}
                    onClick={() => onToggleFlag(currentQuestion)}
                    type="button"
                  >
                    {currentRecord?.flagged ? "已標記重點" : "標記重點"}
                  </button>
                  <a className="rounded border border-[#cbd5e1] px-3 py-2 text-xs font-black hover:bg-[#f8fafc]" href={currentQuestion.paperUrl} target="_blank" rel="noreferrer">
                    開啟該試卷
                  </a>
                  {currentAnswerUrl ? (
                    <a className="rounded border border-[#cbd5e1] px-3 py-2 text-xs font-black hover:bg-[#f8fafc]" href={currentAnswerUrl} target="_blank" rel="noreferrer">
                      答案卷
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="grid gap-3 text-base font-bold leading-8 text-[#172033]">
                  {currentStemLines.map((line, index) => (
                    <p key={`${currentQuestion.id}-stem-${index}`} className={index === 0 ? "text-lg" : "rounded border border-[#e2e8f0] bg-white px-3 py-2 text-sm leading-7"}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                {Object.entries(currentQuestion.options)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([option, text]) => {
                    const selected = currentRecord?.selectedAnswer === option;
                    const revealed = currentRecord?.revealed;
                    const hasAnswer = Boolean(currentQuestion.correctAnswer);
                    const isCorrect = hasAnswer && currentQuestion.correctAnswer === option;

                    return (
                      <button
                        key={option}
                        className={`rounded border px-4 py-3 text-left text-sm font-bold transition ${
                          revealed && hasAnswer && isCorrect
                            ? "border-[#16a34a] bg-[#dcfce7] text-[#166534]"
                            : revealed && hasAnswer && selected && !isCorrect
                              ? "border-[#ef4444] bg-[#fee2e2] text-[#991b1b]"
                              : selected
                                ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]"
                                : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                        }`}
                        onClick={() => onChooseAnswer(currentQuestion, option)}
                        type="button"
                      >
                        <span className="mr-2 font-black">{option}.</span>{text}
                      </button>
                    );
                  })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded bg-[#0f172a] px-4 py-2 text-sm font-black text-white hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!currentRecord?.selectedAnswer || !currentQuestion.correctAnswer}
                    onClick={() => onRevealAnswer(currentQuestion)}
                    type="button"
                  >
                    確認答案
                  </button>
                  <button
                    className="rounded border border-[#cbd5e1] px-4 py-2 text-sm font-black hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={safeIndex <= 0}
                    onClick={() => onQuizIndexChange(safeIndex - 1)}
                    type="button"
                  >
                    上一題
                  </button>
                  <button
                    className="rounded border border-[#cbd5e1] px-4 py-2 text-sm font-black hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={safeIndex >= filteredQuestions.length - 1}
                    onClick={() => onQuizIndexChange(safeIndex + 1)}
                    type="button"
                  >
                    下一題
                  </button>
                </div>
                <p className="text-xs font-bold text-[#64748b]">
                  {filteredQuestions.length > 0 ? `${safeIndex + 1} / ${filteredQuestions.length}` : "0 / 0"}
                </p>
              </div>

              {currentRecord?.revealed ? (
                <div className="grid gap-3 rounded-lg border border-[#dce3ef] bg-[#f8fafc] p-4">
                  {currentQuestion.correctAnswer ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black">正確答案：{currentQuestion.correctAnswer}</span>
                      <span className={`rounded border px-2 py-0.5 text-xs font-black ${
                        currentRecord.isCorrect ? "border-[#16a34a] bg-[#dcfce7] text-[#166534]" : "border-[#ef4444] bg-[#fee2e2] text-[#991b1b]"
                      }`}>
                        {currentRecord.isCorrect ? "答對" : "答錯"}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded border border-[#fde68a] bg-[#fffbeb] p-3 text-sm font-bold text-[#92400e]">
                      這題沒有官方答案，系統不會判分。
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-black text-[#64748b]">考點</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">{currentQuestion.topic}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#64748b]">來源</p>
                    <p className="mt-1 text-sm font-bold text-[#172033]">{currentSourceText}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4 text-sm font-bold text-[#64748b]">
                  答案已隱藏。請先選擇 A/B/C/D，再按「確認答案」。本模式只納入可取得官方答案的選擇題。
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
              <p className="text-sm font-bold text-[#64748b]">目前沒有可判分的選擇題。刷題模式只載入含官方答案的歷屆試題，請換科目、年度或重新載入資料。</p>
            </div>
          )}
        </section>
      </section>
    </section>
  );
}

type PaperGroup = {
  key: string;
  year: string;
  exam: string;
  category: string;
  subjects: string[];
  questionCount: number;
  paperUrl: string;
  answerUrl?: string | null;
  paperParts?: PaperPart[];
};

// 已知合卷組合：所有科目都屬於同一個 set，才算真正合卷
const KNOWN_MERGED_SETS: Set<string>[] = [
  new Set(["憲法", "法學緒論", "英文"]),
  new Set(["公民", "英文"]),
];

function isTrueMergedExam(subjects: string[]): boolean {
  return KNOWN_MERGED_SETS.some((mergedSet) =>
    subjects.length >= 2 && subjects.every((s) => mergedSet.has(s)),
  );
}

function groupPapersByUrl(papers: LoadedPaper[]): PaperGroup[] {
  const map = new Map<string, PaperGroup>();

  for (const paper of papers) {
    const existing = map.get(paper.paperUrl);

    if (existing) {
      existing.subjects.push(paper.subject);
    } else {
      map.set(paper.paperUrl, {
        key: paper.id,
        year: paper.year,
        exam: paper.exam,
        category: paper.category,
        subjects: [paper.subject],
        questionCount: paper.questionCount,
        paperUrl: paper.paperUrl,
        answerUrl: paper.answerUrl,
        paperParts: paper.paperParts,
      });
    }
  }

  return Array.from(map.values());
}

function TrendBadge({ trend }: { trend: HotspotTopic["trend"] }) {
  const map = {
    rising: { label: "↑ 上升", className: "border-[#16a34a] bg-[#dcfce7] text-[#166534]" },
    stable: { label: "→ 穩定", className: "border-[#ca8a04] bg-[#fef9c3] text-[#854d0e]" },
    declining: { label: "↓ 下降", className: "border-[#94a3b8] bg-[#f1f5f9] text-[#475569]" },
  };
  const { label, className } = map[trend] ?? map.stable;

  return <span className={`rounded border px-2 py-0.5 text-xs font-black ${className}`}>{label}</span>;
}

function HotspotResults({ analysis }: { analysis: HotspotAnalysis }) {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const priorityLabel = (index: number) => {
    if (index === 0) return { text: "出題最多", className: "bg-[#fef2f2] text-[#b91c1c] border-[#fca5a5]" };
    if (index <= 2) return { text: "出題較多", className: "bg-[#fff7ed] text-[#c2410c] border-[#fdba74]" };
    return { text: "偶爾出題", className: "bg-[#f8fafc] text-[#475569] border-[#cbd5e1]" };
  };

  return (
    <div className="mt-6 grid gap-5">
      {/* 備考建議 - 最重要，放最上面 */}
      {analysis.predictionHints.length > 0 ? (
        <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
          <p className="text-sm font-black text-[#92400e]">📌 備考建議：考前必看這幾點</p>
          <ul className="mt-2 grid gap-2">
            {analysis.predictionHints.map((hint, index) => (
              <li key={index} className="flex gap-2 text-sm leading-5 text-[#78350f]">
                <span className="mt-0.5 font-black text-[#d97706]">{index + 1}.</span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 命題熱點排行 */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-black">命題熱點排行</p>
          <p className="text-xs font-bold text-[#64748b]">
            實際分析 {analysis.totalQuestions} 題
            {analysis.loadedQuestions && analysis.loadedQuestions !== analysis.totalQuestions ? `｜載入 ${analysis.loadedQuestions} 題` : ""}
          </p>
        </div>
        {analysis.analysisCoverageNote ? (
          <div className="mb-3 rounded border border-[#fde68a] bg-[#fffbeb] px-3 py-2 text-xs font-bold text-[#92400e]">
            {analysis.analysisCoverageNote}下方熱點僅依可解析題幹歸納。
          </div>
        ) : null}
        <div className="grid gap-3">
          {analysis.hotspots.map((hotspot, index) => {
            const isExpanded = expandedTopicId === hotspot.topicId;
            const priority = priorityLabel(index);

            return (
              <article key={hotspot.topicId} className="rounded-lg border border-[#e2e8f0] bg-white">
                <button
                  className="w-full px-4 py-3 text-left hover:bg-[#f8fafc]"
                  onClick={() => setExpandedTopicId(isExpanded ? null : hotspot.topicId)}
                  type="button"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f172a] text-xs font-black text-white shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-black">{hotspot.topicName}</span>
                    <span className={`rounded border px-2 py-0.5 text-xs font-black ${priority.className}`}>{priority.text}</span>
                    <TrendBadge trend={hotspot.trend} />
                    <span className="ml-auto text-sm font-black text-[#c2410c]">{hotspot.frequency} 次</span>
                    <span className="text-xs font-bold text-[#94a3b8]">{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {/* 必考細項 */}
                  {hotspot.subtopics.length > 0 ? (
                    <div className="mt-2">
                      <span className="text-xs font-black text-[#64748b]">必複習：</span>
                      <span className="mt-1 flex flex-wrap gap-1 inline-flex">
                        {hotspot.subtopics.map((sub) => (
                          <span key={sub} className="rounded border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-0.5 text-xs font-bold text-[#334155]">
                            {sub}
                          </span>
                        ))}
                      </span>
                    </div>
                  ) : null}

                  <p className="mt-1.5 text-xs font-bold text-[#94a3b8]">
                    近 {hotspot.years.length} 年皆出現（{hotspot.years.join("、")} 年）
                  </p>
                </button>

                {isExpanded && hotspot.examQuestions.length > 0 ? (
                  <div className="border-t border-[#e2e8f0] px-4 py-3">
                    <p className="mb-2 text-xs font-black text-[#0e7490]">相關考題｜列出 {hotspot.examQuestions.length} 題代表題</p>
                    <div className="grid gap-2">
                      {hotspot.examQuestions.map((q, qi) => (
                        <div key={qi} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-3">
                          <p className="text-xs font-black text-[#64748b]">{q.year} 年｜{q.questionNo}</p>
                          <p className="mt-1 text-sm leading-5 text-[#172033]">{q.stem}</p>
                          <p className="mt-1 text-xs text-[#94a3b8]">{q.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      {/* 整體趨勢 - 學生參考用，放最下面 */}
      <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <p className="text-sm font-black text-[#0e7490]">整體趨勢分析</p>
        <p className="mt-2 text-sm leading-6 text-[#334155]">{analysis.overallTrend}</p>
      </div>

      <p className="text-right text-xs text-[#94a3b8]">
        分析時間：{new Date(analysis.generatedAt).toLocaleString("zh-TW")}｜共分析 {analysis.totalQuestions} 題
      </p>
    </div>
  );
}

function DataDrawer({ mode, papers, questions, onClose }: { mode: DrawerMode; papers: LoadedPaper[]; questions: LoadedQuestion[]; onClose: () => void }) {
  const title = mode === "papers" ? "已載入試卷" : "已載入題目";
  const paperGroups = groupPapersByUrl(papers);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/40" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#dce3ef] px-5 py-4">
          <div>
            <p className="text-sm font-black text-[#0e7490]">載入明細</p>
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
          <button className="rounded border border-[#cbd5e1] px-3 py-2 text-sm font-black hover:bg-[#f8fafc]" onClick={onClose} type="button">
            關閉
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {mode === "papers" ? (
            <div className="grid gap-3">
              {paperGroups.map((group) => {
                const isMerged = isTrueMergedExam(group.subjects);
                const displaySubject = isMerged ? group.subjects.join("、") : group.subjects[0];

                return (
                  <article key={group.key} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#0e7490]">
                          {group.year} 年｜{group.exam}｜{group.category}
                        </p>
                        <h3 className="mt-1 text-lg font-black">{displaySubject}</h3>
                        {isMerged ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {group.subjects.map((subject) => (
                              <span key={subject} className="rounded border border-[#cbd5e1] bg-white px-2 py-0.5 text-xs font-bold text-[#334155]">
                                {subject}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-[#64748b]">單科試卷</p>
                        )}
                        {isMerged && (
                          <p className="mt-1.5 text-xs font-bold text-[#94a3b8]">以上科目來自同一份合卷 PDF</p>
                        )}
                      </div>
                      <div className="grid justify-items-end gap-3">
                        {group.paperParts ? (
                          <div className="grid justify-items-end gap-0.5">
                            {group.paperParts.map((part) => (
                              <p key={part.label} className="text-sm font-black text-[#c2410c]">
                                {part.label}｜{part.count} 題
                                <span className="ml-1 text-xs font-bold text-[#94a3b8]">（{part.questionType}）</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xl font-black text-[#c2410c]">{group.questionCount} 題</p>
                        )}
                        <a
                          className="rounded bg-[#172033] px-3 py-2 text-xs font-black text-white hover:bg-[#334155]"
                          href={group.paperUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          開啟該試卷
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {(() => {
                const PLACEHOLDER_KEYWORDS = ["TwinkleAI MCP", "get_exam_paper", "題幹摘要"];
                const isPlaceholder = (stem: string) => PLACEHOLDER_KEYWORDS.some((kw) => stem.includes(kw));

                // 按試卷分組
                const paperMap = new Map<string, { title: string; url: string; year: string; subject: string; questionType: string; questions: LoadedQuestion[] }>();
                for (const q of questions) {
                  const key = `${q.paperUrl}__${q.subject}`;
                  if (!paperMap.has(key)) {
                    paperMap.set(key, { title: q.paperTitle, url: q.paperUrl, year: q.year, subject: q.subject, questionType: q.questionType, questions: [] });
                  }
                  paperMap.get(key)!.questions.push(q);
                }

                return Array.from(paperMap.entries()).map(([key, group]) => (
                  <article key={key} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#0e7490]">
                          {group.year} 年
                        </p>
                        <h3 className="mt-1 text-lg font-black">{group.subject}</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {group.questions.map((q) => (
                            <span key={q.id} className="rounded border border-[#e2e8f0] bg-white px-2 py-0.5 text-xs font-bold text-[#334155]">
                              {q.questionNo}
                              {!isPlaceholder(q.stem) ? `：${q.stem.slice(0, 20)}…` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid justify-items-end gap-2">
                        <p className="text-xl font-black text-[#c2410c]">{group.questions.length} 題</p>
                        <a
                          className="rounded bg-[#172033] px-3 py-2 text-xs font-black text-white hover:bg-[#334155]"
                          href={group.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          開啟該試卷
                        </a>
                      </div>
                    </div>
                  </article>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
