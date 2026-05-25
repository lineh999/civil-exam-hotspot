export type TaxonomyTopic = {
  id: string;
  name: string;
  subtopics: string[];
};

export type SubjectTaxonomy = {
  subject: string;
  version: string;
  topics: TaxonomyTopic[];
  questionPatterns: string[];
};

const TAXONOMIES: Record<string, SubjectTaxonomy> = {
  行政法: {
    subject: "行政法",
    version: "v1.0",
    topics: [
      { id: "AL01", name: "行政法總論", subtopics: ["法律保留原則", "比例原則", "信賴保護原則", "平等原則", "明確性原則"] },
      { id: "AL02", name: "行政作用法-行政處分", subtopics: ["行政處分成立", "附款", "撤銷", "廢止", "無效", "第三人效力"] },
      { id: "AL03", name: "行政作用法-行政程序法", subtopics: ["陳述意見", "聽證", "資訊公開", "送達", "管轄", "教示"] },
      { id: "AL04", name: "行政作用法-行政罰法", subtopics: ["一行為不二罰", "裁處權時效", "責任條件", "罰鍰裁量"] },
      { id: "AL05", name: "行政作用法-行政執行法", subtopics: ["代履行", "怠金", "直接強制", "即時強制"] },
      { id: "AL06", name: "行政救濟法-訴願法", subtopics: ["訴願要件", "訴願期間", "教示錯誤", "訴願決定"] },
      { id: "AL07", name: "行政救濟法-行政訴訟法", subtopics: ["撤銷訴訟", "課予義務訴訟", "確認訴訟", "給付訴訟"] },
      { id: "AL08", name: "國家賠償法", subtopics: ["公務員責任", "公共設施責任", "賠償程序"] },
      { id: "AL09", name: "行政契約", subtopics: ["雙階理論", "契約類型", "行政契約爭訟"] },
      { id: "AL10", name: "地方自治法", subtopics: ["自治條例", "自治規則", "地方制度法"] },
    ],
    questionPatterns: ["法條記憶型", "概念辨析型", "實例判斷型", "實務見解型", "修法新制型", "跨章整合型"],
  },

  行政學: {
    subject: "行政學",
    version: "v1.0",
    topics: [
      { id: "PA01", name: "行政學理論發展", subtopics: ["傳統理論", "行為科學", "系統理論", "新公共行政", "新公共管理", "新公共服務", "治理理論"] },
      { id: "PA02", name: "行政組織", subtopics: ["組織結構", "科層體制", "非正式組織", "組織文化", "組織變革"] },
      { id: "PA03", name: "公共政策", subtopics: ["政策形成", "政策執行", "政策評估", "政策工具"] },
      { id: "PA04", name: "人力資源管理", subtopics: ["考試制度", "任用", "考績", "訓練發展"] },
      { id: "PA05", name: "行政倫理與課責", subtopics: ["行政中立", "倫理決策", "廉政制度", "課責機制"] },
      { id: "PA06", name: "數位治理", subtopics: ["電子化政府", "開放政府", "資料治理", "智慧城市"] },
    ],
    questionPatterns: ["理論記憶型", "學者比較型", "概念辨析型", "時事應用型", "跨章整合型"],
  },

  政治學: {
    subject: "政治學",
    version: "v1.0",
    topics: [
      { id: "PO01", name: "政治學基礎理論", subtopics: ["政治權力", "國家理論", "政治文化", "政治社會化"] },
      { id: "PO02", name: "民主政治", subtopics: ["民主理論", "選舉制度", "政黨政治", "公民社會"] },
      { id: "PO03", name: "政府體制", subtopics: ["總統制", "議會制", "半總統制", "聯邦制"] },
      { id: "PO04", name: "國際關係", subtopics: ["國際政治理論", "國際組織", "外交政策", "全球化"] },
    ],
    questionPatterns: ["理論記憶型", "制度比較型", "時事分析型", "概念辨析型"],
  },

  教育行政學: {
    subject: "教育行政學",
    version: "v1.0",
    topics: [
      { id: "EA01", name: "教育行政理論", subtopics: ["古典理論", "行為科學", "系統理論", "後現代理論"] },
      { id: "EA02", name: "教育組織", subtopics: ["學校組織", "科層體制", "學習型組織", "組織文化"] },
      { id: "EA03", name: "教育領導", subtopics: ["轉型領導", "分布式領導", "道德領導", "服務領導", "課程領導"] },
      { id: "EA04", name: "教育政策", subtopics: ["政策制定", "政策評估", "108課綱", "雙語政策"] },
      { id: "EA05", name: "績效責任", subtopics: ["學校效能", "課責制度", "PISA", "教師評鑑"] },
      { id: "EA06", name: "教育財政", subtopics: ["教育經費", "補助制度", "成本效益分析"] },
    ],
    questionPatterns: ["理論記憶型", "學者比較型", "實例應用型", "政策分析型"],
  },

  教育心理學: {
    subject: "教育心理學",
    version: "v1.0",
    topics: [
      { id: "EP01", name: "發展理論", subtopics: ["Piaget認知發展", "Vygotsky社會文化論", "Erikson人格發展", "道德發展理論"] },
      { id: "EP02", name: "學習理論", subtopics: ["行為主義", "認知主義", "建構主義", "社會學習論", "人本主義"] },
      { id: "EP03", name: "動機理論", subtopics: ["Maslow需求層次", "成就動機", "自我決定理論", "歸因理論", "自我效能"] },
      { id: "EP04", name: "記憶與認知", subtopics: ["訊息處理模式", "工作記憶", "長期記憶", "後設認知"] },
      { id: "EP05", name: "個別差異", subtopics: ["智力理論", "多元智能", "學習風格", "特殊教育"] },
      { id: "EP06", name: "教學評量", subtopics: ["形成性評量", "總結性評量", "真實評量", "檔案評量"] },
    ],
    questionPatterns: ["理論記憶型", "學者比較型", "情境應用型", "實務判斷型"],
  },

  比較教育: {
    subject: "比較教育",
    version: "v1.0",
    topics: [
      { id: "CE01", name: "比較教育方法論", subtopics: ["比較研究法", "歷史研究法", "量化比較", "質化比較"] },
      { id: "CE02", name: "各國教育制度", subtopics: ["美國教育", "英國教育", "德國教育", "芬蘭教育", "日本教育"] },
      { id: "CE03", name: "國際教育趨勢", subtopics: ["全球化與教育", "PISA", "聯合國SDGs", "終身學習"] },
      { id: "CE04", name: "高等教育", subtopics: ["大學自主", "高等教育市場化", "國際化"] },
    ],
    questionPatterns: ["制度比較型", "趨勢分析型", "政策評析型", "理論應用型"],
  },

  教育哲學: {
    subject: "教育哲學",
    version: "v1.0",
    topics: [
      { id: "PH01", name: "哲學流派與教育", subtopics: ["理想主義", "實在主義", "實用主義", "存在主義", "批判理論"] },
      { id: "PH02", name: "教育目的論", subtopics: ["教育本質", "教育目的", "人的圖像"] },
      { id: "PH03", name: "知識論與課程", subtopics: ["知識論", "課程哲學", "學科知識"] },
      { id: "PH04", name: "重要教育哲學家", subtopics: ["Dewey", "Freire", "Peters", "Rousseau", "Pestalozzi"] },
    ],
    questionPatterns: ["哲學家比較型", "理論辨析型", "實例應用型", "概念分析型"],
  },

  資訊管理: {
    subject: "資訊管理",
    version: "v1.0",
    topics: [
      { id: "IM01", name: "系統開發", subtopics: ["SDLC", "需求分析", "系統設計", "軟體工程", "敏捷開發"] },
      { id: "IM02", name: "資料庫管理", subtopics: ["關聯式資料庫", "SQL", "正規化", "交易管理", "資料倉儲"] },
      { id: "IM03", name: "網路與資訊安全", subtopics: ["OSI模型", "TCP/IP", "資訊安全", "加密", "存取控制"] },
      { id: "IM04", name: "組織與策略", subtopics: ["IS策略規劃", "ERP", "決策支援系統", "知識管理"] },
      { id: "IM05", name: "專案管理", subtopics: ["PMI", "WBS", "風險管理", "甘特圖"] },
      { id: "IM06", name: "新興技術", subtopics: ["雲端運算", "AI與機器學習", "大數據", "IoT", "區塊鏈"] },
    ],
    questionPatterns: ["概念定義型", "比較分析型", "案例情境型", "新興技術型", "計算應用型"],
  },
};

export function getTaxonomy(subject: string): SubjectTaxonomy | null {
  const exact = TAXONOMIES[subject];
  if (exact) return exact;

  const key = Object.keys(TAXONOMIES).find((k) => subject.includes(k) || k.includes(subject));
  return key ? TAXONOMIES[key] : null;
}
