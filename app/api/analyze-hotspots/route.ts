import { NextResponse } from "next/server";
import { analyzeHotspots } from "@/lib/openai-analyzer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      subject?: string;
      exam?: string;
      category?: string;
      questions?: {
        year: string;
        questionNo: string;
        questionType: string;
        stem: string;
        answer?: string | null;
      }[];
    };

    const { subject, exam, category, questions } = body;

    if (!subject || !exam || !category || !questions || questions.length === 0) {
      return NextResponse.json({ error: "Missing subject, exam, category, or questions." }, { status: 400 });
    }

    const analysis = await analyzeHotspots({ subject, exam, category, questions });
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
