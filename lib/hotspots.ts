export type Hotspot = {
  id: string;
  topic: string;
  subtitle: string;
  total: number;
  multipleChoice: number;
  essay: number;
  priority: "第一優先" | "高頻必讀" | "穩定常考" | "補強觀念";
  heat: number;
  years: {
    year: string;
    total: number;
    multipleChoice: number;
    essay: number;
  }[];
  patterns: string[];
  nextAction: string;
};

export type SubjectAnalysis = {
  id: string;
  name: string;
  description: string;
  sourceStatus: string;
  examScope: string[];
  hotspots: Hotspot[];
};

export const examFilters = {
  exams: ["高考三級", "普通考試", "地方特考三等", "地方特考四等"],
  categories: ["一般行政", "人事行政", "財稅行政", "法律廉政"],
  subjects: ["行政法", "行政學"],
};

export const adminLawHotspots: Hotspot[] = [
  {
    id: "administrative-act",
    topic: "行政處分",
    subtitle: "定義、效力、撤銷廢止與救濟",
    total: 12,
    multipleChoice: 8,
    essay: 4,
    priority: "第一優先",
    heat: 96,
    years: [
      { year: "112", total: 3, multipleChoice: 2, essay: 1 },
      { year: "113", total: 4, multipleChoice: 3, essay: 1 },
      { year: "114", total: 5, multipleChoice: 3, essay: 2 },
    ],
    patterns: ["行政處分定義與判斷", "撤銷、廢止與信賴保護", "附款與效力", "救濟途徑選擇"],
    nextAction: "先練行政處分近三年選擇題，再看申論題答題架構。",
  },
  {
    id: "administrative-penalty",
    topic: "行政罰",
    subtitle: "責任條件、裁罰競合與一行為不二罰",
    total: 9,
    multipleChoice: 7,
    essay: 2,
    priority: "高頻必讀",
    heat: 84,
    years: [
      { year: "112", total: 2, multipleChoice: 2, essay: 0 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 4, multipleChoice: 3, essay: 1 },
    ],
    patterns: ["責任能力與故意過失", "裁處權時效", "一行為不二罰", "行政罰與刑罰競合"],
    nextAction: "把裁罰競合和時效整理成比較表，練題時注意題幹關鍵字。",
  },
  {
    id: "appeal",
    topic: "訴願",
    subtitle: "訴願要件、期間、管轄與決定",
    total: 7,
    multipleChoice: 5,
    essay: 2,
    priority: "高頻必讀",
    heat: 76,
    years: [
      { year: "112", total: 2, multipleChoice: 1, essay: 1 },
      { year: "113", total: 2, multipleChoice: 2, essay: 0 },
      { year: "114", total: 3, multipleChoice: 2, essay: 1 },
    ],
    patterns: ["訴願期間起算", "訴願管轄", "不服行政處分之救濟", "訴願決定類型"],
    nextAction: "優先背熟期間與管轄，申論題則練救濟流程圖。",
  },
  {
    id: "administrative-execution",
    topic: "行政執行",
    subtitle: "公法上金錢給付、行為不行為義務",
    total: 5,
    multipleChoice: 4,
    essay: 1,
    priority: "穩定常考",
    heat: 62,
    years: [
      { year: "112", total: 1, multipleChoice: 1, essay: 0 },
      { year: "113", total: 2, multipleChoice: 2, essay: 0 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["代履行", "怠金", "即時強制", "行政執行救濟"],
    nextAction: "用表格比較各種執行手段，熟悉適用條件與救濟。",
  },
  {
    id: "administrative-litigation",
    topic: "行政訴訟",
    subtitle: "訴訟類型、暫時權利保護與判決效力",
    total: 4,
    multipleChoice: 2,
    essay: 2,
    priority: "穩定常考",
    heat: 55,
    years: [
      { year: "112", total: 1, multipleChoice: 0, essay: 1 },
      { year: "113", total: 1, multipleChoice: 1, essay: 0 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["撤銷訴訟", "課予義務訴訟", "確認訴訟", "停止執行"],
    nextAction: "申論題要先判斷訴訟類型，再寫合法性與實體理由。",
  },
  {
    id: "state-compensation",
    topic: "國家賠償",
    subtitle: "公務員違法、公有公共設施與求償",
    total: 3,
    multipleChoice: 2,
    essay: 1,
    priority: "補強觀念",
    heat: 44,
    years: [
      { year: "112", total: 1, multipleChoice: 1, essay: 0 },
      { year: "113", total: 1, multipleChoice: 0, essay: 1 },
      { year: "114", total: 1, multipleChoice: 1, essay: 0 },
    ],
    patterns: ["公務員違法責任", "公共設施設置管理欠缺", "賠償義務機關", "求償權"],
    nextAction: "先分清國賠法第 2 條與第 3 條，申論用構成要件逐項檢查。",
  },
];

export const totalQuestionCount = adminLawHotspots.reduce((sum, item) => sum + item.total, 0);

export const publicAdministrationHotspots: Hotspot[] = [
  {
    id: "organization-theory",
    topic: "組織理論",
    subtitle: "官僚制、組織結構、組織文化與組織變革",
    total: 11,
    multipleChoice: 7,
    essay: 4,
    priority: "第一優先",
    heat: 94,
    years: [
      { year: "112", total: 3, multipleChoice: 2, essay: 1 },
      { year: "113", total: 4, multipleChoice: 3, essay: 1 },
      { year: "114", total: 4, multipleChoice: 2, essay: 2 },
    ],
    patterns: ["韋伯官僚制優缺點", "組織結構類型比較", "組織文化與變革阻力", "正式與非正式組織"],
    nextAction: "先整理官僚制、矩陣組織與組織文化三張比較表，申論題最容易從這裡出。",
  },
  {
    id: "policy-analysis",
    topic: "公共政策",
    subtitle: "政策形成、執行、評估與政策工具",
    total: 10,
    multipleChoice: 6,
    essay: 4,
    priority: "第一優先",
    heat: 90,
    years: [
      { year: "112", total: 3, multipleChoice: 2, essay: 1 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 4, multipleChoice: 2, essay: 2 },
    ],
    patterns: ["政策過程模型", "政策工具選擇", "政策執行落差", "政策評估指標"],
    nextAction: "用政策形成、合法化、執行、評估四階段建立答題骨架，再補政策工具例子。",
  },
  {
    id: "public-management",
    topic: "新公共管理與治理",
    subtitle: "績效管理、顧客導向、治理網絡與公私協力",
    total: 8,
    multipleChoice: 5,
    essay: 3,
    priority: "高頻必讀",
    heat: 82,
    years: [
      { year: "112", total: 2, multipleChoice: 1, essay: 1 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 3, multipleChoice: 2, essay: 1 },
    ],
    patterns: ["新公共管理特徵", "治理與政府統治差異", "公私協力風險", "績效指標設計"],
    nextAction: "先分清新公共管理、治理、新公共服務三者差異，這是選擇與申論都會考的基本題。",
  },
  {
    id: "motivation-leadership",
    topic: "激勵與領導",
    subtitle: "動機理論、領導型態、團隊管理",
    total: 6,
    multipleChoice: 5,
    essay: 1,
    priority: "穩定常考",
    heat: 68,
    years: [
      { year: "112", total: 2, multipleChoice: 2, essay: 0 },
      { year: "113", total: 2, multipleChoice: 2, essay: 0 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["Maslow 與 Herzberg", "X/Y 理論", "轉換型領導", "情境領導"],
    nextAction: "把激勵理論整理成『主張、關鍵字、管理意涵』三欄表，選擇題會很快提升。",
  },
  {
    id: "personnel-administration",
    topic: "人事行政",
    subtitle: "考選、任用、考績、訓練與倫理",
    total: 5,
    multipleChoice: 3,
    essay: 2,
    priority: "穩定常考",
    heat: 60,
    years: [
      { year: "112", total: 1, multipleChoice: 1, essay: 0 },
      { year: "113", total: 2, multipleChoice: 1, essay: 1 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["功績制", "考績制度", "訓練發展", "行政倫理與利益衝突"],
    nextAction: "先讀功績制、人事制度與行政倫理，申論題可用制度目的與問題改善來寫。",
  },
  {
    id: "budget-accountability",
    topic: "預算與課責",
    subtitle: "預算制度、績效課責、透明治理",
    total: 4,
    multipleChoice: 3,
    essay: 1,
    priority: "補強觀念",
    heat: 48,
    years: [
      { year: "112", total: 1, multipleChoice: 1, essay: 0 },
      { year: "113", total: 1, multipleChoice: 1, essay: 0 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["預算功能", "績效預算", "行政課責", "透明與參與"],
    nextAction: "這章不用一開始讀太深，但要會把預算、績效、課責連成一套治理語言。",
  },
];

export const subjectAnalyses: SubjectAnalysis[] = [
  {
    id: "administrative-law",
    name: "行政法",
    description: "適合優先抓行政處分、行政罰、訴願與行政訴訟等高頻章節。",
    sourceStatus: "已接 Twinkle Hub 國考題庫，可進一步改成真實逐題統計。",
    examScope: ["高考三級", "普通考試", "地方特考", "司法與警察特考"],
    hotspots: adminLawHotspots,
  },
  {
    id: "public-administration",
    name: "行政學",
    description: "適合優先抓組織理論、公共政策、新公共管理與治理等核心主題。",
    sourceStatus: "目前為學生端原型資料，下一步可用 Hub 搜尋行政學題幹校正。",
    examScope: ["高考三級", "普通考試", "地方特考", "一般行政與人事行政"],
    hotspots: publicAdministrationHotspots,
  },
];
