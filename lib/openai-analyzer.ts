import OpenAI from "openai";
import { request } from "node:https";
import { getTaxonomy } from "./subject-taxonomy";

export type HotspotTopic = {
  topicId: string;
  topicName: string;
  frequency: number;
  years: string[];
  subtopics: string[];
  trend: "rising" | "stable" | "declining";
  examQuestions: {
    year: string;
    questionNo: string;
    stem: string;
    reasoning: string;
  }[];
};

export type HotspotAnalysis = {
  subject: string;
  exam: string;
  category: string;
  analyzedYears: string[];
  totalQuestions: number;
  loadedQuestions: number;
  analysisCoverageNote?: string;
  hotspots: HotspotTopic[];
  overallTrend: string;
  predictionHints: string[];
  generatedAt: string;
};

type InputQuestion = {
  year: string;
  questionNo: string;
  questionType: string;
  stem: string;
  answer?: string | null;
};

function openaiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  const headers = new Headers(init?.headers ?? (typeof input !== "string" && !(input instanceof URL) ? input.headers : undefined));
  const method = init?.method ?? (typeof input !== "string" && !(input instanceof URL) ? input.method : "GET");
  const body = init?.body;

  return new Promise<Response>((resolve, reject) => {
    const req = request(
      url,
      {
        method,
        headers: Object.fromEntries(headers.entries()),
        rejectUnauthorized: false,
      },
      (res) => {
        const chunks: Buffer[] = [];

        res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on("end", () => {
          const responseHeaders = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (Array.isArray(value)) {
              value.forEach((item) => responseHeaders.append(key, item));
            } else if (value !== undefined) {
              responseHeaders.set(key, value);
            }
          }

          resolve(
            new Response(Buffer.concat(chunks), {
              status: res.statusCode ?? 500,
              statusText: res.statusMessage,
              headers: responseHeaders,
            }),
          );
        });
      },
    );

    req.on("error", reject);

    if (body) {
      if (typeof body === "string" || body instanceof Buffer) {
        req.write(body);
      } else {
        reject(new Error("Unsupported OpenAI request body type."));
        return;
      }
    }

    req.end();
  });
}

// 已知佔位字串關鍵字，凡含這些字的題幹都視為無效內容
const PLACEHOLDER_KEYWORDS = [
  "TwinkleAI MCP",
  "get_exam_paper",
  "題幹摘要",
  "考選部該年度試題查詢頁",
];

function isPlaceholderStem(stem: string): boolean {
  return PLACEHOLDER_KEYWORDS.some((kw) => stem.includes(kw));
}

function getTargetHotspotCount(questionCount: number) {
  if (questionCount >= 100) return { min: 6, max: 8 };
  if (questionCount >= 50) return { min: 5, max: 7 };
  if (questionCount >= 20) return { min: 4, max: 6 };
  return { min: 3, max: 5 };
}

function buildSystemPrompt(subject: string, exam: string, category: string, knowledgeMode: boolean, questionCount: number): string {
  const taxonomy = getTaxonomy(subject);
  const target = getTargetHotspotCount(questionCount);

  const taxonomySection = taxonomy
    ? `
## 知識分類樹（請嚴格使用以下 topic ID 進行標記）

${taxonomy.topics.map((t) => `- ${t.id}｜${t.name}：${t.subtopics.join("、")}`).join("\n")}

## 常見命題模式
${taxonomy.questionPatterns.join("、")}
`
    : `（本科目無預設分類樹，請自行歸納主題，topicId 用 "CUSTOM-01" 等格式）`;

  const modeInstruction = knowledgeMode
    ? `
## 重要提醒：本次無題目原文
由於試題 PDF 尚未完整解析，本次沒有提供實際題幹。
請完全根據你對「${exam} ${category} ${subject}」這個考科的專業知識，
依據歷年台灣公職考試的出題規律，預測命題熱點與趨勢。
- hotspots 中的 frequency 請填入你預估的年均出題頻率（整數）
- examQuestions 陣列請填空陣列 []
- overallTrend 與 predictionHints 請給出具體、有參考價值的預測，絕對不可提及「題目未提供」等廢話
`
    : ``;

  return `你是一位專精台灣公職考試的命題熱點分析師，熟悉${exam}${category}${subject}的命題趨勢。

你的任務：分析歷年考題，找出命題熱點、趨勢與規律，協助考生精準準備。

## 熱點數量要求
- 本次有效題目數：${questionCount} 題
- 請產出 ${target.min} 到 ${target.max} 個命題熱點
- 除非有效題目少於 10 題，否則不可只產出 1 到 2 個熱點
- 如果題目屬於法規型科目，請依「法規制度、主管機關、程序、權利義務、許可/居留/裁罰、實務案例」等方向拆分，不要只歸成一兩個大類

${taxonomySection}
${modeInstruction}
## 輸出格式
請輸出 JSON 格式，結構如下：
{
  "hotspots": [
    {
      "topicId": "分類樹中的 topic ID",
      "topicName": "主題名稱",
      "frequency": 出題次數（整數）,
      "years": ["出現的年份列表"],
      "subtopics": ["實際考到的細項概念"],
      "trend": "rising | stable | declining",
      "examQuestions": [
        {
          "year": "民國年份，例如 114",
          "questionNo": "題號，例如 第 1 題、甲-1、乙-3",
          "stem": "請直接摘錄或精簡該題題幹，必須讓考生看得出考了什麼",
          "reasoning": "說明這題為什麼歸入此命題熱點"
        }
      ]
    }
  ],
  "overallTrend": "整體命題趨勢的一段話分析（繁體中文，100-200字）",
  "predictionHints": ["預測未來可能命題方向，列3-5點，每點一句話"]
}

## 注意事項
- frequency 計算：同一題只計一次，不論合卷還是獨立試卷
- trend 判斷：以最近2年與前幾年相比
- 排序：hotspots 依 frequency 由高到低
- frequency 是歸入該熱點的實際題數；若填 5，examQuestions 至少要列出 5 題或盡量列出 5 題代表題
- examQuestions 必須列出相關考題；如果該熱點橫跨多個年份，請每個出現年份至少列 1 題
- examQuestions 不可只填年份，也不可留空字串；stem 必須有具體題幹內容
- 只回傳 JSON，不要任何額外說明文字`;
}

function buildUserPrompt(years: string[], questions: InputQuestion[], knowledgeMode: boolean): string {
  if (knowledgeMode) {
    return `分析年份：${years.join("、")} 年。請根據你的專業知識進行預測分析。`;
  }

  const questionsByYear = years.map((year) => {
    const qs = questions.filter((q) => q.year === year);
    return `### ${year} 年（${qs.length} 題）\n${qs.map((q) => `${q.questionNo}：${q.stem}`).join("\n")}`;
  });

  return `以下是歷年考題，請進行命題熱點分析：

${questionsByYear.join("\n\n")}`;
}

function normalizeKeyword(value: string) {
  return value
    .replace(/[，。、；：！？「」『』（）()【】\[\]\s]/g, "")
    .slice(0, 18);
}

function normalizeForMatch(value: string) {
  return value.replace(/[，。、；：！？「」『』（）()【】\[\]\s]/g, "").toLowerCase();
}

function topicKeywords(topic: HotspotTopic) {
  return [topic.topicName, ...topic.subtopics]
    .flatMap((value) => value.split(/[、,，／/]/))
    .map((value) => normalizeForMatch(value))
    .filter((value) => value.length >= 2);
}

function scoreQuestionForTopic(question: InputQuestion, topic: HotspotTopic) {
  const stem = normalizeForMatch(question.stem);
  const keywords = topicKeywords(topic);
  let score = 0;

  for (const keyword of keywords) {
    if (stem.includes(keyword)) {
      score += keyword.length;
    }
  }

  return score;
}

function inferQuestionTopicName(subject: string, stem: string) {
  const legalMatch = stem.match(/([\u4e00-\u9fa5]{2,18}(?:法|條例|規則|辦法|準則|規程))/);

  if (legalMatch?.[1]) {
    return legalMatch[1];
  }

  const quotedMatch = stem.match(/[「『]([^」』]{2,14})[」』]/);

  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  return inferFallbackTopicName(subject, stem);
}

function isUsableExamQuestion(question: HotspotTopic["examQuestions"][number] | undefined) {
  return Boolean(question?.year && question.questionNo && question.stem && question.stem.trim().length > 8);
}

function buildExamQuestion(question: InputQuestion, topic: HotspotTopic): HotspotTopic["examQuestions"][number] {
  return {
    year: question.year,
    questionNo: question.questionNo,
    stem: question.stem.slice(0, 220),
    reasoning: `此題題幹與「${topic.topicName}」相關，可作為該熱點的代表題。`,
  };
}

function enrichHotspotQuestions(hotspots: HotspotTopic[], questions: InputQuestion[]) {
  return hotspots.map((topic) => {
    const existingQuestions = (topic.examQuestions ?? []).filter(isUsableExamQuestion);
    const usedKeys = new Set(existingQuestions.map((q) => `${q.year}-${q.questionNo}-${q.stem.slice(0, 20)}`));
    const enrichedQuestions = [...existingQuestions];
    const years = topic.years.length > 0 ? topic.years : Array.from(new Set(questions.map((q) => q.year))).sort();
    const representativeTarget = Math.min(Math.max(topic.years.length, Math.min(topic.frequency || 0, 5), 2), 5);

    for (const year of years) {
      if (enrichedQuestions.some((q) => q.year === year)) {
        continue;
      }

      const candidates = questions
        .filter((q) => q.year === year && q.stem && q.stem.length > 10 && !isPlaceholderStem(q.stem))
        .map((question) => ({ question, score: scoreQuestionForTopic(question, topic) }))
        .sort((a, b) => b.score - a.score || a.question.questionNo.localeCompare(b.question.questionNo, "zh-TW"));
      const best = candidates[0]?.question;

      if (!best) {
        continue;
      }

      const built = buildExamQuestion(best, topic);
      const key = `${built.year}-${built.questionNo}-${built.stem.slice(0, 20)}`;

      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        enrichedQuestions.push(built);
      }
    }

    const extraCandidates = questions
      .filter((q) => q.stem && q.stem.length > 10 && !isPlaceholderStem(q.stem))
      .map((question) => ({ question, score: scoreQuestionForTopic(question, topic) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.question.year.localeCompare(b.question.year, "zh-TW"));

    for (const { question } of extraCandidates) {
      if (enrichedQuestions.length >= representativeTarget) {
        break;
      }

      const built = buildExamQuestion(question, topic);
      const key = `${built.year}-${built.questionNo}-${built.stem.slice(0, 20)}`;

      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        enrichedQuestions.push(built);
      }
    }

    return {
      ...topic,
      examQuestions: enrichedQuestions.sort((a, b) => a.year.localeCompare(b.year, "zh-TW") || a.questionNo.localeCompare(b.questionNo, "zh-TW")),
    };
  });
}

function ensureHotspotCoverage(hotspots: HotspotTopic[], questions: InputQuestion[], subject: string) {
  const validQuestions = questions.filter((q) => q.stem && q.stem.length > 10 && !isPlaceholderStem(q.stem));
  const target = getTargetHotspotCount(validQuestions.length);

  if (hotspots.length >= target.min || validQuestions.length === 0) {
    return hotspots.slice(0, target.max);
  }

  const existingNames = new Set(hotspots.map((topic) => normalizeForMatch(topic.topicName)));
  const topicMap = new Map<string, HotspotTopic>();

  for (const question of validQuestions) {
    const topicName = inferQuestionTopicName(subject, question.stem);
    const normalized = normalizeForMatch(topicName);

    if (!normalized || existingNames.has(normalized)) {
      continue;
    }

    const existing = topicMap.get(normalized);

    if (existing) {
      existing.frequency += 1;
      existing.years = Array.from(new Set([...existing.years, question.year])).sort();
      if (existing.examQuestions.length < 5) {
        existing.examQuestions.push(buildExamQuestion(question, existing));
      }
    } else {
      const topic: HotspotTopic = {
        topicId: `SUP-${String(topicMap.size + 1).padStart(2, "0")}`,
        topicName,
        frequency: 1,
        years: [question.year],
        subtopics: [topicName],
        trend: "stable",
        examQuestions: [],
      };
      topic.examQuestions.push(buildExamQuestion(question, topic));
      topicMap.set(normalized, topic);
    }
  }

  const supplemental = Array.from(topicMap.values())
    .sort((a, b) => b.frequency - a.frequency || b.years.length - a.years.length)
    .slice(0, Math.max(0, target.min - hotspots.length));

  return [...hotspots, ...supplemental].sort((a, b) => b.frequency - a.frequency).slice(0, target.max);
}

const FALLBACK_TOPIC_KEYWORDS: Record<string, string[]> = {
  政府會計: [
    "普通公務單位會計制度",
    "會計制度",
    "會計科目",
    "分錄",
    "預算",
    "決算",
    "材料",
    "非貨幣性資產交換",
    "資本資產",
    "基金",
    "財務報表",
  ],
  審計學: [
    "風險評估",
    "內部控制",
    "查核證據",
    "不實表達",
    "舞弊",
    "查核意見",
    "重要性",
    "抽樣",
    "財務報表",
    "審計準則",
  ],
  中級會計學: [
    "金融資產",
    "攤銷後成本",
    "租賃",
    "收入認列",
    "所得稅",
    "公司債",
    "轉換公司債",
    "不動產廠房及設備",
    "減損",
    "現金流量表",
  ],
};

function inferFallbackTopicName(subject: string, stem: string) {
  const keywordSet = FALLBACK_TOPIC_KEYWORDS[subject] ?? [];
  const matched = keywordSet.find((keyword) => stem.includes(keyword));

  if (matched) {
    return matched;
  }

  return normalizeKeyword(stem) || subject;
}

function buildFallbackAnalysis(params: {
  subject: string;
  exam: string;
  category: string;
  years: string[];
  questions: InputQuestion[];
}): HotspotAnalysis {
  const { subject, exam, category, years, questions } = params;
  const taxonomy = getTaxonomy(subject);
  const validQuestions = questions.filter((q) => q.stem && q.stem.length > 10 && !isPlaceholderStem(q.stem));
  const topicMap = new Map<string, HotspotTopic>();

  for (const question of validQuestions) {
    const matchedTopic = taxonomy?.topics.find((topic) =>
      [topic.name, ...topic.subtopics].some((keyword) => question.stem.includes(keyword)),
    );
    const fallbackName = inferFallbackTopicName(subject, question.stem);
    const topicId = matchedTopic?.id ?? `AUTO-${fallbackName}`;
    const topicName = matchedTopic?.name ?? fallbackName;
    const existing = topicMap.get(topicId);

    if (existing) {
      existing.frequency += 1;
      existing.years = Array.from(new Set([...existing.years, question.year])).sort();
      existing.examQuestions.push({
        year: question.year,
        questionNo: question.questionNo,
        stem: question.stem.slice(0, 160),
        reasoning: "依題幹關鍵詞歸入此主題。",
      });
    } else {
      topicMap.set(topicId, {
        topicId,
        topicName,
        frequency: 1,
        years: [question.year],
        subtopics: matchedTopic?.subtopics.slice(0, 4) ?? [topicName],
        trend: "stable",
        examQuestions: [
          {
            year: question.year,
            questionNo: question.questionNo,
            stem: question.stem.slice(0, 160),
            reasoning: "依題幹關鍵詞歸入此主題。",
          },
        ],
      });
    }
  }

  const hotspots = Array.from(topicMap.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 6);

  if (hotspots.length === 0) {
    const baseTopics = taxonomy?.topics.slice(0, 5) ?? [];
    hotspots.push(
      ...baseTopics.map((topic, index) => ({
        topicId: topic.id,
        topicName: topic.name,
        frequency: Math.max(1, baseTopics.length - index),
        years,
        subtopics: topic.subtopics.slice(0, 4),
        trend: "stable" as const,
        examQuestions: [],
      })),
    );
  }

  return {
    subject,
    exam,
    category,
    analyzedYears: years,
    totalQuestions: validQuestions.length,
    loadedQuestions: questions.length,
    analysisCoverageNote:
      validQuestions.length < questions.length
        ? `本次載入 ${questions.length} 題，其中 ${validQuestions.length} 題有可分析題幹。`
        : undefined,
    hotspots,
    overallTrend: "已完成本次題目整理與命題熱點歸納。建議先從高頻主題開始複習，再搭配相關考題檢查常見問法與答題重點。",
    predictionHints: [
      "優先複習出現頻率最高的主題。",
      "搭配近三年題型，整理常見問法與關鍵概念。",
      "將錯題與標記題回填到弱點清單，安排第二輪複習。",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export type AnalysisStreamEvent =
  | { type: "progress"; value: number; label: string }
  | { type: "result"; data: HotspotAnalysis }
  | { type: "error"; message: string };

export async function* analyzeHotspotsStream(params: {
  subject: string;
  exam: string;
  category: string;
  questions: InputQuestion[];
}): AsyncGenerator<AnalysisStreamEvent> {
  const { subject, exam, category, questions } = params;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    yield { type: "error", message: "OPENAI_API_KEY is not set." };
    return;
  }

  yield { type: "progress", value: 8, label: "篩選題目…" };

  const client = new OpenAI({ apiKey, fetch: openaiFetch });
  const years = [...new Set(questions.map((q) => q.year))].sort();
  const realQuestions = questions.filter(
    (q) => q.stem && q.stem.length > 10 && q.questionType !== "待補" && !isPlaceholderStem(q.stem),
  );
  const knowledgeMode = realQuestions.length === 0;
  const questionsToAnalyze = knowledgeMode ? [] : realQuestions;

  const systemPrompt = buildSystemPrompt(subject, exam, category, knowledgeMode, questionsToAnalyze.length);
  const userPrompt = buildUserPrompt(years, questionsToAnalyze, knowledgeMode);

  yield { type: "progress", value: 18, label: "傳送至 AI…" };

  let rawJson = "";
  // gpt-4o-mini 典型回覆約 1200-2000 tokens；進度從 20% 爬升到 88%
  const ESTIMATED_CHUNKS = 100;
  let chunkCount = 0;

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      rawJson += delta;

      if (delta) {
        chunkCount++;
        const ratio = Math.min(chunkCount / ESTIMATED_CHUNKS, 1);
        // easeOut: 快速起跳，後段放緩
        const progress = Math.round(20 + (1 - Math.pow(1 - ratio, 2)) * 68);
        yield { type: "progress", value: Math.min(progress, 88), label: "AI 分析中…" };
      }
    }
  } catch (error) {
    yield { type: "error", message: `OpenAI API 分析失敗：${error instanceof Error ? error.message : "Unknown error"}` };
    return;
  }

  yield { type: "progress", value: 93, label: "整理結果…" };

  let parsed: { hotspots: HotspotTopic[]; overallTrend: string; predictionHints: string[] };
  try {
    parsed = JSON.parse(rawJson) as typeof parsed;
  } catch {
    yield { type: "error", message: "AI 回應格式解析失敗，請重試。" };
    return;
  }

  const result: HotspotAnalysis = {
    subject,
    exam,
    category,
    analyzedYears: years,
    totalQuestions: questionsToAnalyze.length,
    loadedQuestions: questions.length,
    analysisCoverageNote:
      questionsToAnalyze.length < questions.length
        ? `本次載入 ${questions.length} 題，其中 ${questionsToAnalyze.length} 題有可分析題幹。`
        : undefined,
    hotspots: enrichHotspotQuestions(ensureHotspotCoverage(parsed.hotspots ?? [], questionsToAnalyze, subject), questionsToAnalyze),
    overallTrend: parsed.overallTrend ?? "",
    predictionHints: parsed.predictionHints ?? [],
    generatedAt: new Date().toISOString(),
  };

  yield { type: "progress", value: 100, label: "完成！" };
  yield { type: "result", data: result };
}

export async function analyzeHotspots(params: {
  subject: string;
  exam: string;
  category: string;
  questions: InputQuestion[];
}): Promise<HotspotAnalysis> {
  const { subject, exam, category, questions } = params;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const client = new OpenAI({ apiKey, fetch: openaiFetch });

  const years = [...new Set(questions.map((q) => q.year))].sort();

  // 過濾掉佔位字串，只保留真實題幹
  const realQuestions = questions.filter(
    (q) => q.stem && q.stem.length > 10 && q.questionType !== "待補" && !isPlaceholderStem(q.stem),
  );

  // 若沒有真實題幹，切換為知識庫預測模式（不報錯）
  const knowledgeMode = realQuestions.length === 0;
  const questionsToAnalyze = knowledgeMode ? [] : realQuestions;

  const systemPrompt = buildSystemPrompt(subject, exam, category, knowledgeMode, questionsToAnalyze.length);
  const userPrompt = buildUserPrompt(years, questionsToAnalyze, knowledgeMode);

  let parsed: {
    hotspots: HotspotTopic[];
    overallTrend: string;
    predictionHints: string[];
  };

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("OpenAI 未回傳分析結果。");
    }

    parsed = JSON.parse(raw) as {
      hotspots: HotspotTopic[];
      overallTrend: string;
      predictionHints: string[];
    };
  } catch (error) {
    console.warn("AI hotspot analysis fallback:", error instanceof Error ? error.message : error);
    throw new Error(`OpenAI API 分析失敗：${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return {
    subject,
    exam,
    category,
    analyzedYears: years,
    totalQuestions: questionsToAnalyze.length,
    loadedQuestions: questions.length,
    analysisCoverageNote:
      questionsToAnalyze.length < questions.length
        ? `本次載入 ${questions.length} 題，其中 ${questionsToAnalyze.length} 題有可分析題幹。`
        : undefined,
    hotspots: enrichHotspotQuestions(ensureHotspotCoverage(parsed.hotspots ?? [], questionsToAnalyze, subject), questionsToAnalyze),
    overallTrend: parsed.overallTrend ?? "",
    predictionHints: parsed.predictionHints ?? [],
    generatedAt: new Date().toISOString(),
  };
}
