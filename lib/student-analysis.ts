export type ExamGoal = {
  exams: string[];
  category: string;
  subjects: string[];
  yearRange: string;
};

export type SourceQuestion = {
  id: string;
  year: string;
  exam: string;
  category: string;
  subject: string;
  paperTitle: string;
  questionNo: string;
  questionType: "選擇題" | "申論題" | "混合題";
  stem: string;
  evidence: string;
  reason: string;
  confidence: number;
  paperUrl: string;
};

export type HotspotResult = {
  id: string;
  subject: string;
  topic: string;
  total: number;
  multipleChoice: number;
  essay: number;
  mixed: number;
  heat: number;
  yearly: { year: string; total: number }[];
  commonFocuses: string[];
  suggestedAction: string;
  sources: SourceQuestion[];
};

export type SubjectResult = {
  id: string;
  name: string;
  paperCount: number;
  questionCount: number;
  topTopics: string[];
  hotspots: HotspotResult[];
};

export type AnalysisSummary = {
  goal: ExamGoal;
  totalPapers: number;
  totalQuestions: number;
  generatedAt: string;
  aiEngine: string;
  status: "已完成" | "分析中";
  subjects: SubjectResult[];
};

const paperUrl = "https://wwwq.moex.gov.tw/exam/wHandExamQandA_File.ashx?t=Q&code=114150&c=101&s=0201&q=1";

export const sampleAnalysis: AnalysisSummary = {
  goal: {
    exams: ["高考三級", "普考", "地方特考三等"],
    category: "一般行政",
    subjects: ["行政法", "行政學", "政治學", "公共政策", "民法總則與刑法總則"],
    yearRange: "112-114 年",
  },
  totalPapers: 42,
  totalQuestions: 486,
  generatedAt: "2026-05-24 10:30",
  aiEngine: "Twinkle Hub + OpenAI Batch API",
  status: "已完成",
  subjects: [
    {
      id: "administrative-law",
      name: "行政法",
      paperCount: 12,
      questionCount: 126,
      topTopics: ["行政處分", "行政罰", "訴願"],
      hotspots: [
        {
          id: "administrative-act",
          subject: "行政法",
          topic: "行政處分",
          total: 18,
          multipleChoice: 10,
          essay: 6,
          mixed: 2,
          heat: 96,
          yearly: [
            { year: "112", total: 5 },
            { year: "113", total: 6 },
            { year: "114", total: 7 },
          ],
          commonFocuses: ["行政處分與事實行為區分", "撤銷與廢止", "信賴保護", "附款與效力"],
          suggestedAction: "先讀行政處分定義、效力、瑕疵與撤銷廢止，再練近三年申論題。",
          sources: [
            {
              id: "114_114150_101_01_Q1",
              year: "114",
              exam: "公務人員高等考試一級暨二級考試",
              category: "一般行政",
              subject: "行政法研究",
              paperTitle: "114 年高考一級暨二級行政法研究",
              questionNo: "第 1 題",
              questionType: "申論題",
              stem: "通說認為行政處分乃「法律行為」之一種。準此，其所表現出之特色為何，而能與非法律行為，如行政機關知之表示或行政指導等明確區分？",
              evidence: "行政處分乃「法律行為」之一種",
              reason: "題目直接要求區分行政處分與非法律行為，核心考點是行政處分的性質與判斷標準。",
              confidence: 0.94,
              paperUrl,
            },
            {
              id: "114_114150_101_01_Q2",
              year: "114",
              exam: "公務人員高等考試一級暨二級考試",
              category: "一般行政",
              subject: "行政法研究",
              paperTitle: "114 年高考一級暨二級行政法研究",
              questionNo: "第 2 題",
              questionType: "申論題",
              stem: "行政處分作為行政行為之一種，配合其可撤銷或廢止之特性，如何分別在秩序行政及福利行政中發揮作用？",
              evidence: "可撤銷或廢止之特性",
              reason: "題目聚焦行政處分的撤銷、廢止及其在不同行政任務中的功能。",
              confidence: 0.91,
              paperUrl,
            },
          ],
        },
        {
          id: "administrative-penalty",
          subject: "行政法",
          topic: "行政罰",
          total: 12,
          multipleChoice: 8,
          essay: 3,
          mixed: 1,
          heat: 84,
          yearly: [
            { year: "112", total: 3 },
            { year: "113", total: 4 },
            { year: "114", total: 5 },
          ],
          commonFocuses: ["一行為不二罰", "裁處權時效", "責任條件", "行政罰與刑罰競合"],
          suggestedAction: "先整理行政罰構成要件與裁罰競合，再練選擇題關鍵字判斷。",
          sources: [
            {
              id: "113_admin_penalty_Q12",
              year: "113",
              exam: "地方政府公務人員考試",
              category: "一般行政",
              subject: "行政法概要",
              paperTitle: "113 年地方特考行政法概要",
              questionNo: "第 12 題",
              questionType: "選擇題",
              stem: "關於行政罰上一行為不二罰原則之敘述，下列何者正確？",
              evidence: "一行為不二罰原則",
              reason: "題幹明確測驗行政罰核心原則，應歸入行政罰熱點。",
              confidence: 0.9,
              paperUrl,
            },
          ],
        },
        {
          id: "appeal",
          subject: "行政法",
          topic: "訴願",
          total: 9,
          multipleChoice: 6,
          essay: 2,
          mixed: 1,
          heat: 76,
          yearly: [
            { year: "112", total: 2 },
            { year: "113", total: 3 },
            { year: "114", total: 4 },
          ],
          commonFocuses: ["訴願期間", "管轄機關", "不服行政處分之救濟", "訴願決定"],
          suggestedAction: "先背訴願期間、管轄與決定類型，再用流程圖整理救濟順序。",
          sources: [
            {
              id: "112_appeal_Q8",
              year: "112",
              exam: "普通考試",
              category: "一般行政",
              subject: "行政法概要",
              paperTitle: "112 年普考行政法概要",
              questionNo: "第 8 題",
              questionType: "選擇題",
              stem: "人民不服行政處分提起訴願時，關於訴願期間之起算，下列敘述何者正確？",
              evidence: "訴願期間之起算",
              reason: "題目直接考訴願期間與救濟程序，是訴願章節典型考法。",
              confidence: 0.88,
              paperUrl,
            },
          ],
        },
      ],
    },
    {
      id: "public-administration",
      name: "行政學",
      paperCount: 9,
      questionCount: 98,
      topTopics: ["組織理論", "公共政策", "新公共管理"],
      hotspots: [
        {
          id: "organization-theory",
          subject: "行政學",
          topic: "組織理論",
          total: 15,
          multipleChoice: 9,
          essay: 5,
          mixed: 1,
          heat: 92,
          yearly: [
            { year: "112", total: 4 },
            { year: "113", total: 5 },
            { year: "114", total: 6 },
          ],
          commonFocuses: ["官僚制", "組織結構", "組織文化", "組織變革"],
          suggestedAction: "先整理官僚制與組織結構比較，再準備組織文化與變革題型。",
          sources: [
            {
              id: "114_pa_org_Q3",
              year: "114",
              exam: "高考三級",
              category: "一般行政",
              subject: "行政學",
              paperTitle: "114 年高考三級行政學",
              questionNo: "第 3 題",
              questionType: "申論題",
              stem: "試說明韋伯官僚制之主要特徵，並評析其在現代公共組織中的限制。",
              evidence: "韋伯官僚制之主要特徵",
              reason: "題目核心為官僚制與公共組織限制，屬組織理論。",
              confidence: 0.93,
              paperUrl,
            },
          ],
        },
      ],
    },
    {
      id: "politics",
      name: "政治學",
      paperCount: 8,
      questionCount: 84,
      topTopics: ["民主理論", "選舉制度", "憲政體制"],
      hotspots: [],
    },
    {
      id: "public-policy",
      name: "公共政策",
      paperCount: 7,
      questionCount: 72,
      topTopics: ["政策執行", "政策評估", "政策工具"],
      hotspots: [],
    },
    {
      id: "civil-criminal-general",
      name: "民法總則與刑法總則",
      paperCount: 6,
      questionCount: 106,
      topTopics: ["意思表示", "法律行為", "故意過失"],
      hotspots: [],
    },
  ],
};
