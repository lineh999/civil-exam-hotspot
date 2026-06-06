import { NextRequest, NextResponse } from "next/server";
import { request as httpsRequest } from "node:https";

const pdfCache = new Map<string, Promise<Buffer>>();

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
    }));
  }

  return pdfCache.get(url)!;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";

  if (!isAllowedQuestionPdfUrl(url)) {
    return NextResponse.json({ error: "Invalid MOEX question paper request." }, { status: 400 });
  }

  try {
    const pdf = await downloadPdf(url);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="moex-exam-paper.pdf"',
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load exam paper." },
      { status: 502 },
    );
  }
}
