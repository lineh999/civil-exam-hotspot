// 申論題原卷附圖：把（考選部 PDF 連結 + 頁碼）轉成穩定、檔名安全的 slug。
//
// 用途：離線批次預先把原卷頁面 render 成靜態 PNG，存在
//       public/exam-figures/<slug>.png；前端直接以靜態檔顯示（手機/雲端皆可），
//       找不到才退回 /api/exam-page-image 即時渲染。
//
// ⚠️ scripts/prerender-exam-figures.mjs 內有一份相同邏輯的 examFigureSlug，
//    修改時請兩邊一起改，確保前端算出的 slug 與產圖檔名一致。

// slug 以「題」為單位（而非「頁」）：同一頁可能有多題、多張圖，唯有逐題才能
// 對應到正確的那張圖。questionNumber 取自題號（「第 1 題」→ 1）。
export function examFigureSlug(paperUrl: string, questionNumber: number): string | null {
  if (!paperUrl || !Number.isFinite(questionNumber) || questionNumber < 1) {
    return null;
  }

  try {
    const url = new URL(paperUrl);

    if (
      url.hostname !== "wwwq.moex.gov.tw"
      || url.pathname !== "/exam/wHandExamQandA_File.ashx"
    ) {
      return null;
    }

    const code = url.searchParams.get("code");
    const c = url.searchParams.get("c");
    const s = url.searchParams.get("s");

    if (!code || !c || !s) {
      return null;
    }

    return `moex-${code}-${c}-${s}-q${Math.floor(questionNumber)}`;
  } catch {
    return null;
  }
}

// 靜態附圖檔的對外路徑（public/ 底下，部署後可直接以此路徑取用）。
export function examFigureStaticPath(paperUrl: string, questionNumber: number): string | null {
  const slug = examFigureSlug(paperUrl, questionNumber);
  return slug ? `/exam-figures/${slug}.png` : null;
}
