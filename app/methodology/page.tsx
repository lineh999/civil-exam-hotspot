export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#1d252b]">
      <section className="border-b border-[#dfd8cc] bg-[#fffdf8]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <a className="text-sm font-black text-[#a94a2a] hover:underline" href="/">
            回到熱點分析
          </a>
          <h1 className="mt-3 text-4xl font-black tracking-normal max-[640px]:text-3xl">命題熱點分析邏輯</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#5d665f]">
            這頁用來說明目前資料狀態，以及正式版行政法熱點應該怎麼從官方試題資料一路分析出來。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 py-6">
        <div className="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-sm">
          <p className="text-sm font-black text-[#a94a2a]">目前狀態</p>
          <h2 className="mt-1 text-2xl font-black">畫面上的排行是原型資料</h2>
          <p className="mt-3 leading-7 text-[#4f5a53]">
            首頁「熱點排行原型」目前是展示用資料，來源是 <code className="rounded bg-[#f4efe8] px-1">lib/hotspots.ts</code> 的手動資料。它用來確認產品呈現方式，尚未代表真實命題統計。
          </p>
          <p className="mt-3 leading-7 text-[#4f5a53]">
            目前真正已串接的是考選部行政法試題索引，內容包含年度、考試、類科、科目、題型、試題連結與答案連結。這份資料只有試卷索引，還沒有逐題文字與章節標籤。
          </p>
        </div>

        <div className="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-sm">
          <p className="text-sm font-black text-[#a94a2a]">正式流程</p>
          <h2 className="mt-1 text-2xl font-black">熱點應該先抓資料，再離線分析</h2>
          <div className="mt-4 grid gap-3">
            {[
              "抓取官方索引：從 MCP 或考選部開放資料取得試題索引，保留原始快照。",
              "正規化資料：整理年度、考試、類科、科目、題型與試題網址。",
              "下載試題 PDF：依索引下載行政法試題與答案。",
              "解析題目文字：PDF 轉文字；掃描圖則加 OCR。",
              "題目切分：拆成第 1 題、第 2 題等題目單位。",
              "考點標記：用規則加 AI 判斷章節、子題型與常見考法。",
              "人工抽查：校正高頻考點與低信心標記。",
              "產生統計表：彙整排行、趨勢、常見考法與建議練習。",
              "前端讀取結果：網站只讀整理好的 JSON 或資料庫結果，不即時計算。",
            ].map((item, index) => (
              <div key={item} className="grid grid-cols-[32px_1fr] gap-3 rounded border border-[#eee6dc] bg-[#fffdf8] p-3">
                <span className="font-black text-[#b7482a]">{index + 1}</span>
                <p className="text-sm font-bold leading-6 text-[#455047]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-5 max-[820px]:grid-cols-1">
          <div className="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-[#a94a2a]">分數建議</p>
            <h2 className="mt-1 text-2xl font-black">先用可解釋公式</h2>
            <pre className="mt-4 overflow-auto rounded bg-[#1f2b32] p-4 text-sm leading-7 text-white">
{`熱點分數 =
近三年出題次數
+ 最近一年出題次數 x 0.5
+ 申論題次數 x 0.4
+ 跨考試類科出現次數 x 0.3`}
            </pre>
            <p className="mt-3 text-sm leading-6 text-[#5d665f]">
              分數只用來排序；畫面仍要顯示原始出題次數，讓學生知道熱點是從哪些題目累積出來的。
            </p>
          </div>

          <div className="rounded-lg border border-[#ded6ca] bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-[#a94a2a]">行政法章節</p>
            <h2 className="mt-1 text-2xl font-black">第一版分類</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["行政法基本原則", "行政處分", "行政契約", "行政命令", "行政程序", "行政罰", "行政執行", "訴願", "行政訴訟", "國家賠償", "公務員法"].map((topic) => (
                <span key={topic} className="rounded border border-[#ead8c8] bg-[#fff7f1] px-3 py-2 text-sm font-black text-[#4f5a53]">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
