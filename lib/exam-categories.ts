import { adminLawHotspots, publicAdministrationHotspots, type Hotspot } from "./hotspots";

export type ExamSubject = {
  id: string;
  name: string;
  description: string;
  total: number;
  priority: string;
  hotspots: Hotspot[];
};

export type ExamCategory = {
  id: string;
  name: string;
  subtitle: string;
  exams: string[];
  analyzedQuestions: number;
  recommendation: string;
  subjects: ExamSubject[];
};

const trafficHotspots: Hotspot[] = [
  {
    id: "public-transport",
    topic: "大眾運輸",
    subtitle: "路線規劃、服務水準、票價補貼與 TOD",
    total: 12,
    multipleChoice: 5,
    essay: 7,
    priority: "第一優先",
    heat: 96,
    years: [
      { year: "112", total: 3, multipleChoice: 1, essay: 2 },
      { year: "113", total: 4, multipleChoice: 2, essay: 2 },
      { year: "114", total: 5, multipleChoice: 2, essay: 3 },
    ],
    patterns: ["公車路線規劃", "公共運輸補貼", "服務水準指標", "TOD 與轉乘整合"],
    nextAction: "先讀大眾運輸政策目的與服務水準，再整理票價補貼、路線規劃、TOD，最後練申論題。",
  },
  {
    id: "transport-demand",
    topic: "運輸需求",
    subtitle: "旅次產生、分布、運具選擇與需求管理",
    total: 9,
    multipleChoice: 4,
    essay: 5,
    priority: "高頻必讀",
    heat: 86,
    years: [
      { year: "112", total: 3, multipleChoice: 1, essay: 2 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 3, multipleChoice: 1, essay: 2 },
    ],
    patterns: ["四階段需求模式", "旅次產生與吸引", "運具選擇", "需求管理策略"],
    nextAction: "把四階段運輸需求模型背熟，申論題用流程圖寫，選擇題注意名詞定義。",
  },
  {
    id: "traffic-safety",
    topic: "運輸安全",
    subtitle: "事故分析、風險管理、道安政策與執法",
    total: 7,
    multipleChoice: 3,
    essay: 4,
    priority: "高頻必讀",
    heat: 78,
    years: [
      { year: "112", total: 2, multipleChoice: 1, essay: 1 },
      { year: "113", total: 2, multipleChoice: 1, essay: 1 },
      { year: "114", total: 3, multipleChoice: 1, essay: 2 },
    ],
    patterns: ["事故原因分析", "道路安全改善", "風險管理", "交通執法與教育"],
    nextAction: "準備時用人、車、路、環境四構面整理，申論題很適合用架構式回答。",
  },
  {
    id: "parking-management",
    topic: "停車管理",
    subtitle: "路邊停車、停車供需、費率與違停管理",
    total: 5,
    multipleChoice: 3,
    essay: 2,
    priority: "穩定常考",
    heat: 63,
    years: [
      { year: "112", total: 1, multipleChoice: 1, essay: 0 },
      { year: "113", total: 2, multipleChoice: 1, essay: 1 },
      { year: "114", total: 2, multipleChoice: 1, essay: 1 },
    ],
    patterns: ["停車供需調查", "差別費率", "路邊停車管理", "違停治理"],
    nextAction: "用供給、需求、價格、執法四個角度準備，常能應付政策型題目。",
  },
];

const trafficPolicyHotspots: Hotspot[] = [
  {
    id: "sustainable-transport",
    topic: "永續運輸",
    subtitle: "低碳運輸、淨零、公共運輸與私人運具管理",
    total: 10,
    multipleChoice: 3,
    essay: 7,
    priority: "第一優先",
    heat: 94,
    years: [
      { year: "112", total: 3, multipleChoice: 1, essay: 2 },
      { year: "113", total: 3, multipleChoice: 1, essay: 2 },
      { year: "114", total: 4, multipleChoice: 1, essay: 3 },
    ],
    patterns: ["淨零運輸", "公共運輸優先", "私人運具管理", "綠色運輸政策"],
    nextAction: "先整理永續運輸的政策工具，再準備公共運輸、步行、自行車與私人運具管理案例。",
  },
  {
    id: "traffic-management",
    topic: "交通管理",
    subtitle: "壅塞管理、號誌控制、需求管理與 ITS",
    total: 8,
    multipleChoice: 4,
    essay: 4,
    priority: "高頻必讀",
    heat: 82,
    years: [
      { year: "112", total: 2, multipleChoice: 1, essay: 1 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 3, multipleChoice: 1, essay: 2 },
    ],
    patterns: ["壅塞收費", "號誌時制", "智慧運輸系統", "交通需求管理"],
    nextAction: "用問題、工具、限制、成效四段寫法準備，特別注意 ITS 與交通需求管理。",
  },
  {
    id: "road-safety-policy",
    topic: "道路安全政策",
    subtitle: "事故防制、行人安全、道安改善與執法教育",
    total: 6,
    multipleChoice: 2,
    essay: 4,
    priority: "穩定常考",
    heat: 68,
    years: [
      { year: "112", total: 1, multipleChoice: 0, essay: 1 },
      { year: "113", total: 2, multipleChoice: 1, essay: 1 },
      { year: "114", total: 3, multipleChoice: 1, essay: 2 },
    ],
    patterns: ["行人安全", "易肇事路口", "工程教育執法", "道安績效指標"],
    nextAction: "把 3E 或 5E 道安策略背熟，政策題可直接套用。",
  },
];

const financeHotspots: Hotspot[] = [
  {
    id: "income-tax",
    topic: "所得稅",
    subtitle: "綜所稅、營所稅、扣繳與稅額計算",
    total: 10,
    multipleChoice: 7,
    essay: 3,
    priority: "第一優先",
    heat: 90,
    years: [
      { year: "112", total: 3, multipleChoice: 2, essay: 1 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 4, multipleChoice: 3, essay: 1 },
    ],
    patterns: ["課稅所得", "免稅額與扣除額", "營所稅申報", "扣繳義務"],
    nextAction: "先把基本計算題型做熟，再整理申報與扣繳責任。",
  },
  {
    id: "tax-procedure",
    topic: "稅捐稽徵程序",
    subtitle: "核課、徵收、救濟、罰鍰與時效",
    total: 8,
    multipleChoice: 5,
    essay: 3,
    priority: "高頻必讀",
    heat: 78,
    years: [
      { year: "112", total: 2, multipleChoice: 1, essay: 1 },
      { year: "113", total: 3, multipleChoice: 2, essay: 1 },
      { year: "114", total: 3, multipleChoice: 2, essay: 1 },
    ],
    patterns: ["核課期間", "稅捐保全", "復查訴願", "裁罰與時效"],
    nextAction: "用流程圖整理稽徵、復查、訴願與行政訴訟，期間題要特別熟。",
  },
];

function makeSubject(id: string, name: string, description: string, priority: string, hotspots: Hotspot[]): ExamSubject {
  return {
    id,
    name,
    description,
    total: hotspots.reduce((sum, item) => sum + item.total, 0),
    priority,
    hotspots,
  };
}

export const examCategories: ExamCategory[] = [
  {
    id: "traffic-administration",
    name: "交通行政",
    subtitle: "適合準備高考、普考與地方特考交通行政類科的考生。",
    exams: ["高考三級", "普通考試", "地方特考三等", "地方特考四等"],
    analyzedQuestions: 118,
    recommendation: "先看運輸學與交通政策，再補行政法、行政學。申論題比重高，讀書時要練架構式回答。",
    subjects: [
      makeSubject("transportation", "運輸學", "大眾運輸、需求分析、運輸安全是最優先主戰場。", "最優先", trafficHotspots),
      makeSubject("traffic-policy", "交通政策", "永續運輸、交通管理與道路安全政策近年很常出現。", "最優先", trafficPolicyHotspots),
      makeSubject("administrative-law", "行政法", "行政處分、行政罰與訴願仍是共同科核心。", "共同高頻", adminLawHotspots.slice(0, 4)),
      makeSubject("public-administration", "行政學", "組織、公共政策與治理可作為共同科穩定得分來源。", "共同高頻", publicAdministrationHotspots.slice(0, 4)),
    ],
  },
  {
    id: "general-administration",
    name: "一般行政",
    subtitle: "行政法、行政學、公共管理與政治學都需要平均準備。",
    exams: ["高考三級", "普通考試", "地方特考"],
    analyzedQuestions: 96,
    recommendation: "先看行政法與行政學，這兩科最能影響整體準備方向。",
    subjects: [
      makeSubject("administrative-law", "行政法", "行政處分、行政罰、訴願與行政訴訟。", "最優先", adminLawHotspots),
      makeSubject("public-administration", "行政學", "組織理論、公共政策、新公共管理與治理。", "最優先", publicAdministrationHotspots),
    ],
  },
  {
    id: "personnel-administration",
    name: "人事行政",
    subtitle: "人事制度搭配行政法、行政學，是準備的主軸。",
    exams: ["高考三級", "普通考試", "地方特考"],
    analyzedQuestions: 82,
    recommendation: "行政法先打底，人事行政再集中整理制度與考績訓練。",
    subjects: [
      makeSubject("administrative-law", "行政法", "行政處分與救濟是人事行政也會用到的基礎。", "最優先", adminLawHotspots.slice(0, 5)),
      makeSubject("public-administration", "行政學", "組織、人事行政與行政倫理要先準備。", "共同高頻", publicAdministrationHotspots),
    ],
  },
  {
    id: "finance-tax",
    name: "財稅行政",
    subtitle: "稅法與財政學是核心，行政法作為程序與救濟基礎。",
    exams: ["高考三級", "普通考試", "地方特考"],
    analyzedQuestions: 74,
    recommendation: "先抓所得稅與稽徵程序，再回頭補行政法救濟架構。",
    subjects: [
      makeSubject("tax-law", "稅法", "所得稅與稅捐稽徵程序是第一輪優先。", "最優先", financeHotspots),
      makeSubject("administrative-law", "行政法", "行政程序、行政罰與訴願可支援稅務救濟題。", "共同高頻", adminLawHotspots.slice(0, 4)),
    ],
  },
];
