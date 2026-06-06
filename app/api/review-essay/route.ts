import { NextResponse } from "next/server";
import OpenAI from "openai";

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

type EssayReviewRequest = {
  exam?: string;
  category?: string;
  subject?: string;
  year?: string;
  questionNo?: string;
  source?: string;
  stem?: string;
  answer?: string;
};

function clampScore(value: unknown, maxScore: number) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return Math.round(maxScore * 0.6);
  }

  return Math.max(0, Math.min(maxScore, Math.round(numeric)));
}

function normalizeReviewText(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (Array.isArray(value)) {
    const text = value
      .map((item) => normalizeReviewText(item, ""))
      .filter(Boolean)
      .join("\n");

    return text || fallback;
  }

  if (value && typeof value === "object") {
    const text = Object.entries(value)
      .map(([key, item]) => {
        const normalized = normalizeReviewText(item, "");
        return normalized ? `${key}：${normalized}` : "";
      })
      .filter(Boolean)
      .join("\n");

    return text || fallback;
  }

  return fallback;
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item) => normalizeReviewText(item, ""))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : fallback;
}

function buildLocalReview(params: Required<EssayReviewRequest>): EssayReviewResult {
  const answerLength = params.answer.replace(/\s/g, "").length;
  const maxScore = 25;
  const score = answerLength >= 550 ? 17 : answerLength >= 350 ? 14 : answerLength >= 180 ? 11 : 8;

  return {
    score,
    maxScore,
    summary: "已依題目與作答內容完成初步批閱。此版本會先檢查破題、分段、關鍵概念與結論完整度。",
    structureFeedback: answerLength >= 350
      ? "作答篇幅已有基本架構，建議再明確分成爭點、分析與結論，讓閱卷者更容易抓到得分點。"
      : "作答篇幅偏短，建議至少補足破題、核心概念、案例適用與結論四個段落。",
    contentFeedback: `本題屬於 ${params.subject}，需要緊扣題目問法回應，不宜只寫抽象概念。請把題目中的關鍵事實逐一帶入分析。`,
    missingPoints: ["明確破題", "核心概念定義", "案例或制度適用", "結論與建議"],
    improvementSuggestions: [
      "開頭先用一到兩句點出本題爭點，避免直接堆概念。",
      "中段用小標或序號分層回答，讓每個得分點獨立可見。",
      "結尾補上具體判斷或政策建議，避免只停在描述。",
    ],
    referenceDirection: "建議作答方向：先說明題目涉及的制度或法理，再依題目事實分點分析，最後提出結論。若題目要求比較或評估，應分別列出判斷標準、優缺點與可行性。",
    reviewedAt: new Date().toISOString(),
    source: "local",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as EssayReviewRequest;
    const exam = body.exam?.trim();
    const category = body.category?.trim();
    const subject = body.subject?.trim();
    const year = body.year?.trim();
    const questionNo = body.questionNo?.trim();
    const source = body.source?.trim();
    const stem = body.stem?.trim();
    const answer = body.answer?.trim();

    if (!exam || !category || !subject || !year || !questionNo || !source || !stem || !answer) {
      return NextResponse.json({ error: "Missing exam, category, subject, year, question, source, stem, or answer." }, { status: 400 });
    }

    const required = { exam, category, subject, year, questionNo, source, stem, answer };
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(buildLocalReview(required));
    }

    const client = new OpenAI({ apiKey });
    const maxScore = 25;
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "你是台灣公職國考申論題批閱老師。",
            "請用繁體中文批閱，語氣具體、可操作，不要空泛鼓勵。",
            "不要捏造官方標準答案；只能依題目、科目與學生作答給出批閱建議。",
            "回傳 JSON，欄位必須包含 score, maxScore, summary, structureFeedback, contentFeedback, missingPoints, improvementSuggestions, referenceDirection。",
            "summary、structureFeedback、contentFeedback、referenceDirection 必須是純文字字串，不可回傳物件或陣列。",
            "missingPoints、improvementSuggestions 必須是純文字字串陣列。",
          ].join("\n"),
        },
        {
          role: "user",
          content: [
            `考試：${exam}`,
            `類科：${category}`,
            `科目：${subject}`,
            `年度與題號：${year} 年 ${questionNo}`,
            `來源：${source}`,
            `滿分：${maxScore}`,
            "",
            "題目：",
            stem,
            "",
            "學生作答：",
            answer,
            "",
            "請批閱：",
            "1. 預估分數請以滿分 25 分評估。",
            "2. 指出架構、內容、缺漏考點與具體加強方法。",
            "3. 參考作答方向只給答題方向，不要整篇代寫。",
          ].join("\n"),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("OpenAI 未回傳批閱結果。");
    }

    const parsed = JSON.parse(raw) as Partial<EssayReviewResult>;
    const result: EssayReviewResult = {
      score: clampScore(parsed.score, maxScore),
      maxScore,
      summary: normalizeReviewText(parsed.summary, "已完成批閱。"),
      structureFeedback: normalizeReviewText(parsed.structureFeedback, "請加強作答架構與段落安排。"),
      contentFeedback: normalizeReviewText(parsed.contentFeedback, "請補強題目核心概念與案例適用。"),
      missingPoints: normalizeStringArray(parsed.missingPoints, ["核心概念", "案例適用", "結論"]),
      improvementSuggestions: normalizeStringArray(parsed.improvementSuggestions, ["補強破題、分段與結論。"]),
      referenceDirection: normalizeReviewText(parsed.referenceDirection, "建議依題目爭點分段回答，並補上具體結論。"),
      reviewedAt: new Date().toISOString(),
      source: "openai",
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
