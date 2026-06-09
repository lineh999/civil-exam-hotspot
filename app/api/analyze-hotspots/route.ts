import { analyzeHotspotsStream } from "@/lib/openai-analyzer";

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
      return new Response(
        `data: ${JSON.stringify({ type: "error", message: "Missing subject, exam, category, or questions." })}\n\n`,
        { status: 400, headers: { "Content-Type": "text/event-stream" } },
      );
    }

    const generator = analyzeHotspotsStream({ subject, exam, category, questions });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const event of generator) {
            controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "error", message: msg })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      `data: ${JSON.stringify({ type: "error", message })}\n\n`,
      { status: 500, headers: { "Content-Type": "text/event-stream" } },
    );
  }
}
