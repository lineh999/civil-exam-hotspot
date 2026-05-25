import { NextResponse } from "next/server";
import { callTwinkleTool } from "@/lib/twinkle-mcp";

type SearchExamResponse = {
  hits?: SearchExamHit[];
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
  paperTitle: string;
  paperUrl: string;
  questionNo: string;
  questionType: string;
  stem: string;
  answer?: string | null;
};

type SubjectQuery = {
  displaySubject: string;
  querySubject: string;
  mustInclude?: string[];
  mustIncludeAny?: string[][];
  mustNotInclude?: string[];
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

function normalizeSubjectForSearch(exam: string, subject: string): SubjectQuery {
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

  const suffixByExam: Record<string, string> = {
    初等考: "010",
    司法特考: "120",
    關務特考: "040",
    身心特考: "040",
    退除役特考: "040",
    原住民特考: "140",
    民航特考: "140",
    移民特考: "140",
    海巡特考: "120",
    調查局特考: "120",
    一般警察: "130",
    警察特考: "130",
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

  return [getMoexExamCode(year, exam)];
}

function extractMoexCode(url: string) {
  return new URL(url).searchParams.get("code") ?? "";
}

function makeMoexSearchUrl(year: string, exam: string) {
  return `https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=${getMoexExamCode(year, exam)}&y=${normalizeYear(year)}`;
}

function isLikelyCorrectLevel(exam: string, year: string, hit: SearchExamHit, query: SubjectQuery) {
  const hitCode = extractMoexCode(hit.question_pdf_url);
  const allowedCodes = getMoexExamCodes(year, exam);

  if (!allowedCodes.includes(hitCode)) {
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

function pickBestHit(exam: string, year: string, hits: SearchExamHit[], query: SubjectQuery) {
  return hits.find((hit) => isLikelyCorrectLevel(exam, year, hit, query)) ?? null;
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
    const search = await callTwinkleTool<SearchExamResponse>("opendata-search_exam", args);
    const hit = pickBestHit(exam, year, search.hits ?? [], subjectQuery);

    if (hit) {
      return hit;
    }
  }

  return null;
}

async function fetchPaper(exam: string, category: string, subject: string, year: string) {
  const hit = await searchExamPaper(exam, category, subject, year);

  if (!hit) {
    const title = `${year} 年 ${exam} ${category} ${subject}`;
    const paperUrl = makeMoexSearchUrl(year, exam);
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
      answerUrl: null,
      source: "pending",
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
    }));

    return { paper, questions };
  }

  let paper: ExamPaperResponse | null = null;

  try {
    paper = await callTwinkleTool<ExamPaperResponse>("opendata-get_exam_paper", {
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
    answerUrl: paper?.answer_pdf_url ?? hit.answer_pdf_url,
    source: "twinkle",
    paperParts,
  };

  let questions: LoadedQuestion[];

  if (isKokugo) {
    questions = buildKokugoQuestions(loadedPaper.id, paperYear, subjectName, title, paperUrl, paper?.questions);
  } else {
    questions = (paper?.questions ?? []).map((question, index) => ({
      id: `${loadedPaper.id}-${question.no}`,
      year: paperYear,
      subject: subjectName,
      paperTitle: title,
      paperUrl: loadedPaper.paperUrl,
      questionNo: isMixed ? `甲-${index + 1}` : `第 ${question.no} 題`,
      questionType: isMixed ? "申論" : questionType,
      stem: question.stem,
      answer: question.answer,
    }));

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
        };
      }));
    }
  }

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
