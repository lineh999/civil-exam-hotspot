import OpenAI from "openai";
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

function buildSystemPrompt(subject: string, exam: string, category: string): string {
  const taxonomy = getTaxonomy(subject);

  const taxonomySection = taxonomy
    ? `
## 知識分類樹（請嚴格使用以下 topic ID 進行標記）

${taxonomy.topics.map((t) => `- ${t.id}｜${t.name}：${t.subtopics.join("、")}`).join("\n")}

## 常見命題模式
${taxonomy.questionPatterns.join("、")}
`
    : `（本科目無預設分類樹，請自行歸納主題，topicId 用 "CUSTOM-01" 等格式）`;

  return `你是一位專精台灣公職考試的命題熱點分析師，熟悉${exam}${category}${subject}的命題趨勢。

你的任務：分析歷年考題，找出命題熱點、趨勢與規律，協助考生精準準備。

${taxonomySection}

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
          "year": "年份",
          "questionNo": "題號",
          "stem": "題目摘要（前80字）",
          "reasoning": "為何歸類於此主題的簡短說明"
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
- 只回傳 JSON，不要任何額外說明文字`;
}

function buildUserPrompt(years: string[], questions: InputQuestion[]): string {
  const questionsByYear = years.map((year) => {
    const qs = questions.filter((q) => q.year === year && q.stem && q.stem.length > 10);
    return `### ${year} 年（${qs.length} 題）\n${qs.map((q) => `${q.questionNo}：${q.stem}`).join("\n")}`;
  });

  return `以下是歷年考題，請進行命題熱點分析：

${questionsByYear.join("\n\n")}`;
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

  const client = new OpenAI({ apiKey });

  const years = [...new Set(questions.map((q) => q.year))].sort();
  const meaningfulQuestions = questions.filter((q) => q.stem && q.stem.length > 10 && q.questionType !== "待補");

  if (meaningfulQuestions.length === 0) {
    throw new Error("沒有足夠的題目資料可供分析。請先載入考題再進行分析。");
  }

  const systemPrompt = buildSystemPrompt(subject, exam, category);
  const userPrompt = buildUserPrompt(years, meaningfulQuestions);

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

  const parsed = JSON.parse(raw) as {
    hotspots: HotspotTopic[];
    overallTrend: string;
    predictionHints: string[];
  };

  return {
    subject,
    exam,
    category,
    analyzedYears: years,
    totalQuestions: meaningfulQuestions.length,
    hotspots: parsed.hotspots ?? [],
    overallTrend: parsed.overallTrend ?? "",
    predictionHints: parsed.predictionHints ?? [],
    generatedAt: new Date().toISOString(),
  };
}
