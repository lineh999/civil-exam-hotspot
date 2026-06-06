export type ExamSubjectCatalogItem = {
  exam: string;
  category: string;
  subjects: string[];
  commonSubjects?: string[];
  professionalSubjects?: string[];
  sourceName: string;
  sourceUrl: string;
  sourcePriority?: "moex" | "superbox" | "gotop" | "manual";
};

const commonSeniorSubjects = ["國文", "憲法", "法學緒論", "英文"];
const commonJuniorSubjects = ["國文", "憲法", "法學緒論", "英文"];
const commonElementarySubjects = ["國文", "公民", "英文"];
const knownCommonSubjects = new Set([...commonSeniorSubjects, ...commonJuniorSubjects, ...commonElementarySubjects, "作文", "兩岸關係", "原住民族行政及法規", "法學知識", "法學知識與英文", "綜合法政知識與英文"]);

export const examSubjectCatalog: ExamSubjectCatalogItem[] = [
  {
    exam: "高考三級",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "行政學",
      "政治學",
      "地方政府與政治"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "行政學",
      "政治學",
      "地方政府與政治"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13032&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "行政學",
      "政治學",
      "公共政策"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "行政學",
      "政治學",
      "公共政策"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13030&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "人事行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "公共人力資源管理",
      "現行考銓制度"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "公共人力資源管理",
      "現行考銓制度"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13034&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "靜力學",
      "土木專業數學",
      "材料力學",
      "土木施工學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "靜力學",
      "土木專業數學",
      "材料力學",
      "土木施工學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4035&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "公職社會工作師",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "社會工作實務",
      "行政法",
      "社會福利政策與法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "社會工作實務",
      "行政法",
      "社會福利政策與法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13054&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "戶政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "國籍與戶政法規",
      "民法總則、親屬與繼承編",
      "人口政策與人口統計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "國籍與戶政法規",
      "民法總則、親屬與繼承編",
      "人口政策與人口統計"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "文化行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "文化行政與文化法規",
      "本國文學概論",
      "文化人類學",
      "藝術概論"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "文化行政與文化法規",
      "本國文學概論",
      "文化人類學",
      "藝術概論"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4027&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "法律廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "刑法",
      "刑事訴訟法",
      "公務員法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "刑法",
      "刑事訴訟法",
      "公務員法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13042&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "社會學",
      "社會福利政策與法規",
      "行政法",
      "社會工作"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "社會學",
      "社會福利政策與法規",
      "行政法",
      "社會工作"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13048&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "金融保險",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學",
      "經濟學與貨幣銀行學",
      "保險學",
      "財務管理與投資學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學",
      "經濟學與貨幣銀行學",
      "保險學",
      "財務管理與投資學"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "客家事務行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "客家歷史與文化",
      "客家政治與經濟"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "客家歷史與文化",
      "客家政治與經濟"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13046&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "航運行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "航業經營管理",
      "港埠經營管理",
      "航運與港埠政策",
      "海運學",
      "行政法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "航業經營管理",
      "港埠經營管理",
      "航運與港埠政策",
      "海運學",
      "行政法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4042&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "民法",
      "會計學",
      "稅務法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "民法",
      "會計學",
      "稅務法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4015&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "財經廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "經濟學",
      "財政學",
      "公務員法",
      "心理學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "經濟學",
      "財政學",
      "公務員法",
      "心理學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13056&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "商業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "經濟學",
      "證券交易法",
      "公司法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "經濟學",
      "證券交易法",
      "公司法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13040&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "教育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "教育行政學",
      "比較教育",
      "行政法",
      "教育心理學",
      "教育哲學",
      "教育測驗與統計",
      "教育概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "教育行政學",
      "比較教育",
      "行政法",
      "教育心理學",
      "教育哲學",
      "教育測驗與統計",
      "教育概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13044&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "勞工行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "勞工行政與勞工立法",
      "勞資關係",
      "行政法",
      "就業安全制度"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "勞工行政與勞工立法",
      "勞資關係",
      "行政法",
      "就業安全制度"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13036&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "統計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "統計學",
      "經濟學",
      "資料處理",
      "抽樣方法與迴歸分析"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "統計學",
      "經濟學",
      "資料處理",
      "抽樣方法與迴歸分析"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "會計審計法規",
      "中級會計學",
      "政府會計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "會計審計法規",
      "中級會計學",
      "政府會計"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "經建行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "貨幣銀行學",
      "公共經濟學",
      "經濟學",
      "統計學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "貨幣銀行學",
      "公共經濟學",
      "經濟學",
      "統計學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4021&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "資料結構",
      "資通網路與安全",
      "資料庫應用",
      "資訊管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "資料結構",
      "資通網路與安全",
      "資料庫應用",
      "資訊管理"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "農業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "統計學",
      "農業發展與政策",
      "農業經濟學",
      "農產運銷",
      "農業概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "統計學",
      "農業發展與政策",
      "農業經濟學",
      "農產運銷",
      "農業概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13050&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "作物學",
      "作物生理學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "作物學",
      "作物生理學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4046&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "電力工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電機機械",
      "電力系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電機機械",
      "電力系統"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "電子工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "半導體工程"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "半導體工程"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "電信工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "通信與系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "通信與系統"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "高考三級",
    category: "機械工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "機械設計",
      "機械製造學",
      "熱力學",
      "流體力學",
      "工程力學",
      "機械力學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "機械設計",
      "機械製造學",
      "熱力學",
      "流體力學",
      "工程力學",
      "機械力學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4047&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "體育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "世界體育史",
      "運動社會學",
      "運動自然科學",
      "體育行政與管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "世界體育史",
      "運動社會學",
      "運動自然科學",
      "體育行政與管理"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13052&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "觀光行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "旅運經營學",
      "觀光資源規劃",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "旅運經營學",
      "觀光資源規劃",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4019&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "高考三級",
    category: "觀光行政(選試英語)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "旅運經營學",
      "觀光資源規劃",
      "觀光英語",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "旅運經營學",
      "觀光資源規劃",
      "觀光英語",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4624&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "行政學概要",
      "地方自治概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "行政學概要",
      "地方自治概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "行政學概要",
      "政治學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "行政學概要",
      "政治學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "人事行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學概要",
      "行政法概要",
      "公共人力資源管理概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學概要",
      "行政法概要",
      "公共人力資源管理概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13724&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "材料力學與結構學概要",
      "測量學與土木施工學概要",
      "鋼筋混凝土學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "材料力學與結構學概要",
      "測量學與土木施工學概要",
      "鋼筋混凝土學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "戶政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "國籍與戶政法規概要",
      "民法總則、親屬與繼承編概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "國籍與戶政法規概要",
      "民法總則、親屬與繼承編概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13732&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "文化行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "本國文學概要",
      "文化行政概要",
      "藝術概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "本國文學概要",
      "文化行政概要",
      "藝術概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4066&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "法律廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "公務員法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "公務員法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13726&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "社會政策與社會立法概要",
      "社會工作概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "社會政策與社會立法概要",
      "社會工作概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13738&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "金融保險",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學概要",
      "經濟學與貨幣銀行學概要",
      "保險學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學概要",
      "經濟學與貨幣銀行學概要",
      "保險學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "客家事務行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學概要",
      "行政法概要",
      "客家歷史與文化概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學概要",
      "行政法概要",
      "客家歷史與文化概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13736&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "航運行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "海運學概要",
      "航港經營管理概要",
      "航港法規概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "海運學概要",
      "航港經營管理概要",
      "航港法規概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "稅務法規概要",
      "會計學概要",
      "民法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "稅務法規概要",
      "會計學概要",
      "民法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4053&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "財經廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "財政學概要",
      "行政法概要",
      "公務員法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "財政學概要",
      "行政法概要",
      "公務員法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13728&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "教育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "教育概要",
      "行政法概要",
      "教育行政學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "教育概要",
      "行政法概要",
      "教育行政學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13734&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "勞工行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "勞工行政與勞工立法概要",
      "勞資關係概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "勞工行政與勞工立法概要",
      "勞資關係概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=13730&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "統計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "統計學概要",
      "資料處理概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "統計學概要",
      "資料處理概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4073&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學概要",
      "會計法規概要",
      "政府會計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學概要",
      "會計法規概要",
      "政府會計概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "經建行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "統計學概要",
      "貨幣銀行學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "統計學概要",
      "貨幣銀行學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4060&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "資通網路與安全概要",
      "程式設計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "資通網路與安全概要",
      "程式設計概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4074&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "農業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "農業行政概要",
      "農業經濟學概要",
      "農業概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "農業行政概要",
      "農業經濟學概要",
      "農業概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4660&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "作物概要",
      "植物保護概要",
      "土壤與肥料概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "作物概要",
      "植物保護概要",
      "土壤與肥料概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4661&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "電力工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "電工機械概要",
      "輸配電學概要",
      "電子學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "電工機械概要",
      "輸配電學概要",
      "電子學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4062&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "電子工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "電子學概要",
      "電子儀表概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "電子學概要",
      "電子儀表概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85969&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "電信工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "電子學概要",
      "通信系統概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "電子學概要",
      "通信系統概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85969&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "普考",
    category: "機械工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "機械力學概要",
      "機械製造學概要",
      "機械設計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "機械力學概要",
      "機械製造學概要",
      "機械設計概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4063&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "普考",
    category: "觀光行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "觀光學概要",
      "旅運經營學概要",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "觀光學概要",
      "旅運經營學概要",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "初等考",
    category: "一般民政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "地方自治大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "地方自治大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=1567&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "一般行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "行政學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "行政學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=30&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "人事行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "人事行政大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "人事行政大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=86&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "戶政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "戶籍法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "戶籍法規大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=1568&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "社會行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "社會工作大意",
      "社政法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "社會工作大意",
      "社政法規大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=87&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "財稅行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "財政學大意",
      "稅務法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "財政學大意",
      "稅務法規大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=35&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "勞工行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "勞工行政與勞工法規大意",
      "勞資關係"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "勞工行政與勞工法規大意",
      "勞資關係"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=37&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "統計",
    subjects: [
      "國文",
      "公民",
      "英文",
      "統計學大意",
      "資料處理大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "統計學大意",
      "資料處理大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=38&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "廉政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "公務員法大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "公務員法大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=33&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "會計",
    subjects: [
      "國文",
      "公民",
      "英文",
      "會計學大意",
      "會計審計法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "會計學大意",
      "會計審計法規大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=34&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "經建行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "經濟學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "經濟學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=89&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "電子工程",
    subjects: [
      "國文",
      "公民",
      "英文",
      "基本電學大意",
      "電子學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "基本電學大意",
      "電子學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=39&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "初等考",
    category: "圖書資訊管理",
    subjects: [
      "國文",
      "公民",
      "英文",
      "圖書館學大意",
      "中文圖書分類編目大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "圖書館學大意",
      "中文圖書分類編目大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=1565&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "地方特考三等",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "行政學",
      "政治學",
      "地方政府與政治"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "行政學",
      "政治學",
      "地方政府與政治"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "行政學",
      "政治學",
      "公共政策"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "行政學",
      "政治學",
      "公共政策"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "人事行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "公共人力資源管理",
      "現行考銓制度"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "公共人力資源管理",
      "現行考銓制度"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "靜力學",
      "土木專業數學",
      "材料力學",
      "土木施工學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "靜力學",
      "土木專業數學",
      "材料力學",
      "土木施工學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "公職社會工作師",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "社會工作實務",
      "行政法",
      "社會福利政策與法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "社會工作實務",
      "行政法",
      "社會福利政策與法規"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "戶政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "國籍與戶政法規",
      "民法總則、親屬與繼承編",
      "人口政策與人口統計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "國籍與戶政法規",
      "民法總則、親屬與繼承編",
      "人口政策與人口統計"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "文化行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "文化行政與文化法規",
      "本國文學概論",
      "文化人類學",
      "藝術概論"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "文化行政與文化法規",
      "本國文學概論",
      "文化人類學",
      "藝術概論"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "法律廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "刑法",
      "刑事訴訟法",
      "公務員法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "刑法",
      "刑事訴訟法",
      "公務員法"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "社會學",
      "社會福利政策與法規",
      "行政法",
      "社會工作"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "社會學",
      "社會福利政策與法規",
      "行政法",
      "社會工作"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "金融保險",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學",
      "經濟學與貨幣銀行學",
      "保險學",
      "財務管理與投資學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學",
      "經濟學與貨幣銀行學",
      "保險學",
      "財務管理與投資學"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "客家事務行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "客家歷史與文化",
      "客家政治與經濟"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "客家歷史與文化",
      "客家政治與經濟"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "航運行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "航業經營管理",
      "港埠經營管理",
      "航運與港埠政策",
      "海運學",
      "行政法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "航業經營管理",
      "港埠經營管理",
      "航運與港埠政策",
      "海運學",
      "行政法"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "民法",
      "會計學",
      "稅務法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "民法",
      "會計學",
      "稅務法規"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "財經廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "經濟學",
      "財政學",
      "公務員法",
      "心理學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "經濟學",
      "財政學",
      "公務員法",
      "心理學"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "商業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "經濟學",
      "證券交易法",
      "公司法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "經濟學",
      "證券交易法",
      "公司法"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "教育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "教育行政學",
      "比較教育",
      "行政法",
      "教育心理學",
      "教育哲學",
      "教育測驗與統計",
      "教育概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "教育行政學",
      "比較教育",
      "行政法",
      "教育心理學",
      "教育哲學",
      "教育測驗與統計",
      "教育概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "勞工行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "勞工行政與勞工立法",
      "勞資關係",
      "行政法",
      "就業安全制度"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "勞工行政與勞工立法",
      "勞資關係",
      "行政法",
      "就業安全制度"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "統計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "統計學",
      "經濟學",
      "資料處理",
      "抽樣方法與迴歸分析"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "統計學",
      "經濟學",
      "資料處理",
      "抽樣方法與迴歸分析"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "會計審計法規",
      "中級會計學",
      "政府會計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "會計審計法規",
      "中級會計學",
      "政府會計"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/Download.ashx?FileID=85968&id=GL000009&type=LAW",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "經建行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "貨幣銀行學",
      "公共經濟學",
      "經濟學",
      "統計學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "貨幣銀行學",
      "公共經濟學",
      "經濟學",
      "統計學"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "資料結構",
      "資通網路與安全",
      "資料庫應用",
      "資訊管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "資料結構",
      "資通網路與安全",
      "資料庫應用",
      "資訊管理"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "農業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "統計學",
      "農業發展與政策",
      "農業經濟學",
      "農產運銷",
      "農業概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "統計學",
      "農業發展與政策",
      "農業經濟學",
      "農產運銷",
      "農業概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "作物學",
      "作物生理學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "作物學",
      "作物生理學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "電力工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電機機械",
      "電力系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電機機械",
      "電力系統"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "電子工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "半導體工程"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "半導體工程"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "電信工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "通信與系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概論",
      "電路學與電子學",
      "電磁學",
      "通信與系統"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "機械工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "機械設計",
      "機械製造學",
      "熱力學",
      "流體力學",
      "工程力學",
      "機械力學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "機械設計",
      "機械製造學",
      "熱力學",
      "流體力學",
      "工程力學",
      "機械力學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "體育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "世界體育史",
      "運動社會學",
      "運動自然科學",
      "體育行政與管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "世界體育史",
      "運動社會學",
      "運動自然科學",
      "體育行政與管理"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "觀光行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "旅運經營學",
      "觀光資源規劃",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "旅運經營學",
      "觀光資源規劃",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考三等",
    category: "觀光行政(選試英語)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "旅運經營學",
      "觀光資源規劃",
      "觀光英語",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "旅運經營學",
      "觀光資源規劃",
      "觀光英語",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "行政學概要",
      "地方自治概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "行政學概要",
      "地方自治概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "行政學概要",
      "政治學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "行政學概要",
      "政治學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "人事行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學概要",
      "行政法概要",
      "公共人力資源管理概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學概要",
      "行政法概要",
      "公共人力資源管理概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "材料力學與結構學概要",
      "測量學與土木施工學概要",
      "鋼筋混凝土學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "材料力學與結構學概要",
      "測量學與土木施工學概要",
      "鋼筋混凝土學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "戶政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "國籍與戶政法規概要",
      "民法總則、親屬與繼承編概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "國籍與戶政法規概要",
      "民法總則、親屬與繼承編概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "文化行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "本國文學概要",
      "文化行政概要",
      "藝術概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "本國文學概要",
      "文化行政概要",
      "藝術概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "法律廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "公務員法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "公務員法概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "社會政策與社會立法概要",
      "社會工作概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "社會政策與社會立法概要",
      "社會工作概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "金融保險",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學概要",
      "經濟學與貨幣銀行學概要",
      "保險學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學概要",
      "經濟學與貨幣銀行學概要",
      "保險學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "客家事務行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學概要",
      "行政法概要",
      "客家歷史與文化概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學概要",
      "行政法概要",
      "客家歷史與文化概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "航運行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "海運學概要",
      "航港經營管理概要",
      "航港法規概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "海運學概要",
      "航港經營管理概要",
      "航港法規概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "稅務法規概要",
      "會計學概要",
      "民法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "稅務法規概要",
      "會計學概要",
      "民法概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "財經廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "財政學概要",
      "行政法概要",
      "公務員法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "財政學概要",
      "行政法概要",
      "公務員法概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "教育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "教育概要",
      "行政法概要",
      "教育行政學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "教育概要",
      "行政法概要",
      "教育行政學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "勞工行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法概要",
      "勞工行政與勞工立法概要",
      "勞資關係概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "勞工行政與勞工立法概要",
      "勞資關係概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "統計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "統計學概要",
      "資料處理概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "統計學概要",
      "資料處理概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "會計學概要",
      "會計法規概要",
      "政府會計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "會計學概要",
      "會計法規概要",
      "政府會計概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "經建行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "經濟學概要",
      "統計學概要",
      "貨幣銀行學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "經濟學概要",
      "統計學概要",
      "貨幣銀行學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "資通網路與安全概要",
      "程式設計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "資通網路與安全概要",
      "程式設計概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "農業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "農業行政概要",
      "農業經濟學概要",
      "農業概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "農業行政概要",
      "農業經濟學概要",
      "農業概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "作物概要",
      "植物保護概要",
      "土壤與肥料概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "作物概要",
      "植物保護概要",
      "土壤與肥料概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "電力工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "電工機械概要",
      "輸配電學概要",
      "電子學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "電工機械概要",
      "輸配電學概要",
      "電子學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "電子工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "電子學概要",
      "電子儀表概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "電子學概要",
      "電子儀表概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "電信工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "計算機概要",
      "電子學概要",
      "通信系統概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "計算機概要",
      "電子學概要",
      "通信系統概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "機械工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "機械力學概要",
      "機械製造學概要",
      "機械設計概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "機械力學概要",
      "機械製造學概要",
      "機械設計概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考四等",
    category: "觀光行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "觀光學概要",
      "旅運經營學概要",
      "觀光行銷學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "觀光學概要",
      "旅運經營學概要",
      "觀光行銷學概要"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/controls/wHandEditorExtend_File.ashx?Fun=Laws&file_id=15154&item_id=322&menu_id=319",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "一般民政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "地方自治大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "地方自治大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "一般行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "行政學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "行政學大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "人事行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "人事行政大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "人事行政大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "戶政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "戶籍法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "戶籍法規大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "社會行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "社會工作大意",
      "社政法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "社會工作大意",
      "社政法規大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "財稅行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "財政學大意",
      "稅務法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "財政學大意",
      "稅務法規大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "勞工行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "勞工行政與勞工法規大意",
      "勞資關係"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "勞工行政與勞工法規大意",
      "勞資關係"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "統計",
    subjects: [
      "國文",
      "公民",
      "英文",
      "統計學大意",
      "資料處理大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "統計學大意",
      "資料處理大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "廉政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "公務員法大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "公務員法大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "會計",
    subjects: [
      "國文",
      "公民",
      "英文",
      "會計學大意",
      "會計審計法規大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "會計學大意",
      "會計審計法規大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "經建行政",
    subjects: [
      "國文",
      "公民",
      "英文",
      "法學大意",
      "經濟學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "法學大意",
      "經濟學大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "電子工程",
    subjects: [
      "國文",
      "公民",
      "英文",
      "基本電學大意",
      "電子學大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "基本電學大意",
      "電子學大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "地方特考五等",
    category: "圖書資訊管理",
    subjects: [
      "國文",
      "公民",
      "英文",
      "圖書館學大意",
      "中文圖書分類編目大意"
    ],
    commonSubjects: [
      "國文",
      "公民",
      "英文"
    ],
    professionalSubjects: [
      "圖書館學大意",
      "中文圖書分類編目大意"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://law.exam.gov.tw/LawContentSource.aspx?id=GL000009",
    sourcePriority: "moex"
  },
  {
    exam: "司法特考",
    category: "法院書記官",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "民法概要",
      "刑法概要(法院書記官)",
      "行政法概要(法院書記官)",
      "刑事訴訟法概要",
      "民事訴訟法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "民法概要",
      "刑法概要(法院書記官)",
      "行政法概要(法院書記官)",
      "刑事訴訟法概要",
      "民事訴訟法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=6094&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "法警",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "法院組織法",
      "刑事訴訟法概要",
      "行政法概要",
      "刑法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "法院組織法",
      "刑事訴訟法概要",
      "行政法概要",
      "刑法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4353&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "執行員",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "監獄學概要",
      "監獄行刑法概要",
      "刑法概要",
      "犯罪學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "監獄學概要",
      "監獄行刑法概要",
      "刑法概要",
      "犯罪學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4352&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "監獄官",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "監獄學",
      "刑事政策",
      "犯罪學",
      "再犯預測",
      "羈押法",
      "諮商與矯正輔導",
      "少年事件處理法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "監獄學",
      "刑事政策",
      "犯罪學",
      "再犯預測",
      "羈押法",
      "諮商與矯正輔導",
      "少年事件處理法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4342&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "錄事",
    subjects: [
      "國文",
      "民事訴訟法大意",
      "刑事訴訟法大意",
      "法學大意"
    ],
    commonSubjects: [
      "國文"
    ],
    professionalSubjects: [
      "民事訴訟法大意",
      "刑事訴訟法大意",
      "法學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4360&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "檢察事務官(財經實務組)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "銀行實務",
      "審計學(含會審法規)",
      "證券交易法",
      "商業會計法",
      "中級會計學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "銀行實務",
      "審計學(含會審法規)",
      "證券交易法",
      "商業會計法",
      "中級會計學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4340&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "司法特考",
    category: "檢察事務官(電子資訊組)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "電子學",
      "電路學",
      "程式語言",
      "系統分析"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "電子學",
      "電路學",
      "程式語言",
      "系統分析"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4343&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "經濟學概要",
      "行政法概要",
      "英文"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "經濟學概要",
      "行政法概要",
      "英文"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4300&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "行政法",
      "英文(專業)",
      "財政學",
      "國際貿易實務"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "行政法",
      "英文(專業)",
      "財政學",
      "國際貿易實務"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4290&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "資料庫應用",
      "英文(專業)",
      "資料結構",
      "資通網路"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "資料庫應用",
      "英文(專業)",
      "資料結構",
      "資通網路"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4293&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "電機工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "電機機械",
      "英文(專業)",
      "電子學",
      "電路學",
      "電力系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "電機機械",
      "英文(專業)",
      "電子學",
      "電路學",
      "電力系統"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4292&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "機械工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "工程力學(包括靜力學、動力學與材料力學)",
      "英文(專業)",
      "機械製造學(包括機械材料)",
      "自動控制"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "工程力學(包括靜力學、動力學與材料力學)",
      "英文(專業)",
      "機械製造學(包括機械材料)",
      "自動控制"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4296&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "關務特考",
    category: "關稅會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "中級會計學",
      "審計學",
      "英文(專業)",
      "政府會計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "中級會計學",
      "審計學",
      "英文(專業)",
      "政府會計"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4291&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "公共安全人員-申論強化班",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "警察情境實務",
      "警察法規",
      "情報學",
      "國家安全情報法制",
      "國土安全與非傳統安全",
      "警察法規(寫作班)"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "警察情境實務",
      "警察法規",
      "情報學",
      "國家安全情報法制",
      "國土安全與非傳統安全",
      "警察法規(寫作班)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=6378&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "犯罪防治預防組-申論強化班",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "諮商輔導",
      "犯罪學",
      "警察法規",
      "警察情境實務",
      "犯罪預防",
      "犯罪分析",
      "警察法規(寫作班)"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "諮商輔導",
      "犯罪學",
      "警察法規",
      "警察情境實務",
      "犯罪預防",
      "犯罪分析",
      "警察法規(寫作班)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=15255&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "犯罪預防組-申論強化班",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "警察情境實務",
      "警察法規",
      "犯罪偵查學",
      "偵查法學",
      "刑案現場處理與刑事鑑識"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "警察情境實務",
      "警察法規",
      "犯罪偵查學",
      "偵查法學",
      "刑案現場處理與刑事鑑識"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=6376&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "行政類(警特三等+警研所+警二技)",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "警察法規概要",
      "警察情境實務概要",
      "警察勤務概要",
      "犯罪偵查概要",
      "警察法規(寫作班)"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "警察法規概要",
      "警察情境實務概要",
      "警察勤務概要",
      "犯罪偵查概要",
      "警察法規(寫作班)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4394&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "行政警察-申論強化班",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "警察學",
      "警察情境實務",
      "警察法規",
      "警察勤務",
      "警察政策與犯罪預防",
      "偵查法學與犯罪偵查",
      "警察法規(寫作班)"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "警察學",
      "警察情境實務",
      "警察法規",
      "警察勤務",
      "警察政策與犯罪預防",
      "偵查法學與犯罪偵查",
      "警察法規(寫作班)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=6374&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "消防警察",
    subjects: [
      "國文",
      "消防警察專業英文",
      "憲法",
      "消防警察情境實務",
      "消防與災害防救法規",
      "火災學與消防化學",
      "消防安全設備"
    ],
    commonSubjects: [
      "國文",
      "消防警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "消防警察情境實務",
      "消防與災害防救法規",
      "火災學與消防化學",
      "消防安全設備"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4382&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "警察特考",
    category: "國境警察-申論強化班",
    subjects: [
      "國文",
      "警察專業英文",
      "憲法",
      "警察情境實務",
      "警察法規",
      "國土安全與國境安全管理",
      "移民情勢與政策分析",
      "警察法規(寫作班)"
    ],
    commonSubjects: [
      "國文",
      "警察專業英文",
      "憲法"
    ],
    professionalSubjects: [
      "警察情境實務",
      "警察法規",
      "國土安全與國境安全管理",
      "移民情勢與政策分析",
      "警察法規(寫作班)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=6377&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "一般警察",
    category: "犯罪防治人員預防組",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "心理學",
      "諮商與輔導",
      "社會科學研究法",
      "社會學",
      "社會工作",
      "解惑王點數"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "心理學",
      "諮商與輔導",
      "社會科學研究法",
      "社會學",
      "社會工作",
      "解惑王點數"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4411&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "一般警察",
    category: "行政管理人員",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "行政法",
      "人力資源管理",
      "公共政策",
      "安全管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "行政法",
      "人力資源管理",
      "公共政策",
      "安全管理"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=182&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "一般警察",
    category: "行政警察",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "行政法",
      "行政學",
      "心理學",
      "公共政策"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "行政法",
      "行政學",
      "心理學",
      "公共政策"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4410&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "一般警察",
    category: "消防警察",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "消防與災害防救法規概要",
      "火災學概要",
      "普通物理學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "消防與災害防救法規概要",
      "火災學概要",
      "普通物理學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4421&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "一般警察",
    category: "警察資訊管理人員",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "物件導向程式設計",
      "資訊管理",
      "資料庫應用",
      "網路安全與資訊倫理",
      "刑法",
      "刑事訴訟法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "物件導向程式設計",
      "資訊管理",
      "資料庫應用",
      "網路安全與資訊倫理",
      "刑法",
      "刑事訴訟法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4414&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "移民特考",
    category: "三等移民行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "行政法",
      "入出國及移民法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "行政法",
      "入出國及移民法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11250&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "移民特考",
    category: "三等移民行政-資訊組",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "資料庫應用",
      "資通訊及網路安全",
      "資訊管理與應用",
      "入出國及移民法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "資料庫應用",
      "資通訊及網路安全",
      "資訊管理與應用",
      "入出國及移民法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11252&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "移民特考",
    category: "三等移民行政(選試英文)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "刑法",
      "刑事訴訟法",
      "行政法",
      "入出國及移民法規",
      "移民執法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "行政法",
      "入出國及移民法規",
      "移民執法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11251&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "移民特考",
    category: "四等移民行政",
    subjects: [
      "國文",
      "法學知識與英文",
      "行政法概要",
      "國土安全與國境執法概要",
      "入出國及移民法規概要"
    ],
    commonSubjects: [
      "國文",
      "法學知識與英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "國土安全與國境執法概要",
      "入出國及移民法規概要"
    ],
    sourceName: "考選部公告考科 / 移民特考四等考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/news/wfrmNews.aspx?kind=3&menu_id=42&news_id=7665",
    sourcePriority: "moex"
  },
  {
    exam: "調查局特考",
    category: "財經實務組",
    subjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係",
      "財務管理",
      "證券交易法",
      "商業會計法",
      "中級會計學",
      "經濟學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係"
    ],
    professionalSubjects: [
      "財務管理",
      "證券交易法",
      "商業會計法",
      "中級會計學",
      "經濟學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11402&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "調查局特考",
    category: "資訊科學組",
    subjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係",
      "資通網路",
      "作業系統及系統程式",
      "資料庫應用"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係"
    ],
    professionalSubjects: [
      "資通網路",
      "作業系統及系統程式",
      "資料庫應用"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11405&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "調查局特考",
    category: "電子科學組",
    subjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係",
      "計算機概論",
      "電子學",
      "通信與系統",
      "電路學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係"
    ],
    professionalSubjects: [
      "計算機概論",
      "電子學",
      "通信與系統",
      "電路學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11404&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "調查局特考",
    category: "調查工作組",
    subjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係",
      "刑法",
      "刑事訴訟法",
      "外國文",
      "社會學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "外國文",
      "社會學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11400&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "調查局特考",
    category: "調查工作組(選試英文)",
    subjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係",
      "刑法",
      "刑事訴訟法",
      "外國文(英文)",
      "政治學",
      "社會學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "英文",
      "法學緒論",
      "兩岸關係"
    ],
    professionalSubjects: [
      "刑法",
      "刑事訴訟法",
      "外國文(英文)",
      "政治學",
      "社會學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11401&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "一般行政",
    subjects: [
      "作文",
      "憲法",
      "法學緒論",
      "行政法",
      "政治學",
      "行政學",
      "公共政策"
    ],
    commonSubjects: [
      "作文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "行政法",
      "政治學",
      "行政學",
      "公共政策"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4310&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "戶政",
    subjects: [
      "國文",
      "戶籍法規大意",
      "法學大意"
    ],
    commonSubjects: [
      "國文"
    ],
    professionalSubjects: [
      "戶籍法規大意",
      "法學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4331&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "社會行政",
    subjects: [
      "作文",
      "憲法",
      "法學緒論",
      "行政法概要",
      "社會工作概要",
      "社會政策與社會立法概要"
    ],
    commonSubjects: [
      "作文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "行政法概要",
      "社會工作概要",
      "社會政策與社會立法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4324&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "財稅行政",
    subjects: [
      "作文",
      "憲法",
      "法學緒論",
      "民法",
      "會計學",
      "財政學",
      "稅務法規"
    ],
    commonSubjects: [
      "作文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "民法",
      "會計學",
      "財政學",
      "稅務法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4311&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "教育行政",
    subjects: [
      "作文",
      "憲法",
      "法學緒論",
      "行政法",
      "教育哲學",
      "教育心理學",
      "教育行政學"
    ],
    commonSubjects: [
      "作文",
      "憲法",
      "法學緒論"
    ],
    professionalSubjects: [
      "行政法",
      "教育哲學",
      "教育心理學",
      "教育行政學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4312&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "身心特考",
    category: "錄事",
    subjects: [
      "國文",
      "刑事訴訟法大意",
      "民事訴訟法大意",
      "法學大意"
    ],
    commonSubjects: [
      "國文"
    ],
    professionalSubjects: [
      "刑事訴訟法大意",
      "民事訴訟法大意",
      "法學大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4332&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "行政學概要",
      "行政法概要",
      "地方自治概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "行政學概要",
      "行政法概要",
      "地方自治概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4191&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "行政學",
      "政治學",
      "行政法",
      "公共政策"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "政治學",
      "行政法",
      "公共政策"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4180&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "土木專業數學",
      "土木施工學概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "測量學",
      "鋼筋混凝土學與設計",
      "土壤力學",
      "結構學",
      "營建管理",
      "工程材料",
      "土木專業數學",
      "土木施工學概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=8205&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "法警",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "法院組織法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "行政法概要",
      "刑法概要",
      "刑事訴訟法概要",
      "法院組織法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4193&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "社會工作概要",
      "社會政策與社會立法概要",
      "行政法概要"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "社會工作概要",
      "社會政策與社會立法概要",
      "行政法概要"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4196&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "原住民族行政",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "行政學",
      "行政法",
      "臺灣原住民族史"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "臺灣原住民族史"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=5620&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "會計學",
      "民法",
      "財政學",
      "稅務法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "會計學",
      "民法",
      "財政學",
      "稅務法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4183&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文",
      "作物學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "原住民族行政及法規",
      "英文"
    ],
    professionalSubjects: [
      "作物學",
      "作物育種學",
      "土壤學",
      "試驗設計"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=8204&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "原住民特考",
    category: "錄事",
    subjects: [
      "國文",
      "法學大意",
      "刑事訴訟法大意"
    ],
    commonSubjects: [
      "國文"
    ],
    professionalSubjects: [
      "法學大意",
      "刑事訴訟法大意"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4202&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "海巡特考",
    category: "海巡行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "犯罪偵查",
      "海巡勤務",
      "刑法",
      "刑事訴訟法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "犯罪偵查",
      "海巡勤務",
      "刑法",
      "刑事訴訟法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4280&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "退除役特考",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政學",
      "行政法",
      "政治學",
      "公共政策"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政學",
      "行政法",
      "政治學",
      "公共政策"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4760&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "退除役特考",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "社會政策與社會立法",
      "行政法",
      "社會研究法",
      "社會工作"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "社會政策與社會立法",
      "行政法",
      "社會研究法",
      "社會工作"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4763&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "國安局特考",
    category: "政經組",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係",
      "政治學",
      "經濟學",
      "中國大陸研究",
      "外國文"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係"
    ],
    professionalSubjects: [
      "政治學",
      "經濟學",
      "中國大陸研究",
      "外國文"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11360&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "國安局特考",
    category: "政經組(選試英文)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係",
      "外國文(英文)",
      "政治學",
      "經濟學",
      "中國大陸研究"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係"
    ],
    professionalSubjects: [
      "外國文(英文)",
      "政治學",
      "經濟學",
      "中國大陸研究"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11363&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "國安局特考",
    category: "資訊組",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係",
      "計算機概論",
      "外國文",
      "網路應用與安全"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係"
    ],
    professionalSubjects: [
      "計算機概論",
      "外國文",
      "網路應用與安全"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11361&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "國安局特考",
    category: "資訊組(選試英文)",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係",
      "外國文(英文)",
      "計算機概論",
      "資料庫應用",
      "網路應用與安全"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "兩岸關係"
    ],
    professionalSubjects: [
      "外國文(英文)",
      "計算機概論",
      "資料庫應用",
      "網路應用與安全"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=11364&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "一般民政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "民法總則",
      "刑法總則",
      "行政學",
      "地方政府與政治"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "民法總則",
      "刑法總則",
      "行政學",
      "地方政府與政治"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4731&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "一般行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "民法總則",
      "刑法總則",
      "行政學",
      "公共管理"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "民法總則",
      "刑法總則",
      "行政學",
      "公共管理"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4730&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "人事行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "各國人事制度",
      "現行考銓制度"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "各國人事制度",
      "現行考銓制度"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4733&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "土木工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "結構學",
      "土壤力學",
      "流體力學",
      "材料力學",
      "營建管理",
      "工程材料"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "結構學",
      "土壤力學",
      "流體力學",
      "材料力學",
      "營建管理",
      "工程材料"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=321&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "戶政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "民法總則與親屬編",
      "移民政策與法規",
      "戶政法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "民法總則與親屬編",
      "移民政策與法規",
      "戶政法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4737&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "文化行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "文化行政",
      "藝術概論"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "文化行政",
      "藝術概論"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4739&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "社會工作",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "社會工作研究方法",
      "社會工作實務",
      "社會福利政策與法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "社會工作研究方法",
      "社會工作實務",
      "社會福利政策與法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4751&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "社會行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "社會學",
      "社會政策立法(含社會福利)"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "社會學",
      "社會政策立法(含社會福利)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4732&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "金融保險",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "金融保險法規",
      "貨幣銀行學",
      "財務管理與投資學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "金融保險法規",
      "貨幣銀行學",
      "財務管理與投資學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4740&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "海巡行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "海巡法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "海巡法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4758&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "財稅行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "會計學",
      "經濟學",
      "稅務法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "會計學",
      "經濟學",
      "稅務法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4734&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "商業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "民法",
      "經濟學",
      "公司法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "民法",
      "經濟學",
      "公司法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4746&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "教育行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "比較教育",
      "教育行政學",
      "教育測驗與統計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "比較教育",
      "教育行政學",
      "教育測驗與統計"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4736&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "勞工行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "就業安全制度",
      "勞工行政與勞工立法",
      "勞資關係"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "就業安全制度",
      "勞工行政與勞工立法",
      "勞資關係"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4744&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "結構工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "結構學",
      "鋼筋混凝土學與設計",
      "流體力學",
      "材料力學",
      "結構動力分析與耐震設計"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "結構學",
      "鋼筋混凝土學與設計",
      "流體力學",
      "材料力學",
      "結構動力分析與耐震設計"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=322&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "統計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "統計學",
      "統計實務",
      "抽樣方法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "統計學",
      "統計實務",
      "抽樣方法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4745&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "廉政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "公務員法",
      "刑法",
      "刑事訴訟法",
      "行政學",
      "政府採購法"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "公務員法",
      "刑法",
      "刑事訴訟法",
      "行政學",
      "政府採購法"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4747&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "會計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "財政學",
      "政府會計",
      "中級會計學",
      "會計審計法規"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "財政學",
      "政府會計",
      "中級會計學",
      "會計審計法規"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4735&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "資訊處理",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "資料結構",
      "資訊系統與分析",
      "資料庫應用"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "資料結構",
      "資訊系統與分析",
      "資料庫應用"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4750&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "農業行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "農業發展與政策",
      "農業經濟學",
      "農業概論"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "農業發展與政策",
      "農業經濟學",
      "農業概論"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4911&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "農業技術",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "試驗設計",
      "土壤學",
      "作物學"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "試驗設計",
      "土壤學",
      "作物學"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4912&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "電力工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "電路學",
      "電機機械",
      "電子學",
      "電力系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "電路學",
      "電機機械",
      "電子學",
      "電力系統"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4748&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "電子工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "電路學",
      "電磁學",
      "電子學",
      "計算機概論"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "電路學",
      "電磁學",
      "電子學",
      "計算機概論"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4749&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "電信工程",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "電路學",
      "電子學",
      "電磁學",
      "通信與系統"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "電路學",
      "電子學",
      "電磁學",
      "通信與系統"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4752&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "審計",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "審計學",
      "內部控制之理論與實務",
      "審計應用法規(會計審計法規)",
      "審計應用法規(政府採購法)"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "審計學",
      "內部控制之理論與實務",
      "審計應用法規(會計審計法規)",
      "審計應用法規(政府採購法)"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4742&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "薦任升等",
    category: "警察行政",
    subjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文",
      "行政法",
      "刑法",
      "刑事訴訟法",
      "警察學",
      "警察行政"
    ],
    commonSubjects: [
      "國文",
      "憲法",
      "法學緒論",
      "英文"
    ],
    professionalSubjects: [
      "行政法",
      "刑法",
      "刑事訴訟法",
      "警察學",
      "警察行政"
    ],
    sourceName: "考選部公告考科 / 超級函授課程表補充",
    sourceUrl: "https://www.superbox.com.tw/category.aspx?id=4755&CL=%E5%B9%B4%E5%BA%A6%E7%8F%AD&Yr=116&chksum=Super168947640Box",
    sourcePriority: "superbox"
  },
  {
    exam: "民航特考",
    category: "飛航管制",
    subjects: [
      "國文",
      "法學知識",
      "英文",
      "英語會話",
      "民用航空法",
      "航空氣象",
      "航空運輸"
    ],
    commonSubjects: [
      "國文",
      "法學知識"
    ],
    professionalSubjects: [
      "英文",
      "英語會話",
      "民用航空法",
      "航空氣象",
      "航空運輸"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/content/wHandMenuFile.ashx?file_id=4861",
    sourcePriority: "moex"
  },
  {
    exam: "民航特考",
    category: "航務管理",
    subjects: [
      "國文",
      "法學知識",
      "英文",
      "英語會話",
      "民用航空法",
      "航空運輸與安全管理"
    ],
    commonSubjects: [
      "國文",
      "法學知識"
    ],
    professionalSubjects: [
      "英文",
      "英語會話",
      "民用航空法",
      "航空運輸與安全管理"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/content/wHandMenuFile.ashx?file_id=4861",
    sourcePriority: "moex"
  },
  {
    exam: "民航特考",
    category: "情報通信",
    subjects: [
      "國文",
      "法學知識",
      "英文",
      "英語會話",
      "民用航空法",
      "航空氣象",
      "資料處理"
    ],
    commonSubjects: [
      "國文",
      "法學知識"
    ],
    professionalSubjects: [
      "英文",
      "英語會話",
      "民用航空法",
      "航空氣象",
      "資料處理"
    ],
    sourceName: "考選部公告考科",
    sourceUrl: "https://wwwc.moex.gov.tw/main/content/wHandMenuFile.ashx?file_id=4861",
    sourcePriority: "moex"
  }
];;

export function getExamOptions() {
  const preferredOrder = ["高考三級","普考","初等考","地方特考三等","地方特考四等","地方特考五等","司法特考","關務特考","警察特考","一般警察","移民特考","調查局特考","身心特考","原住民特考","海巡特考","退除役特考","國安局特考","薦任升等","民航特考"];
  const options = [...new Set(examSubjectCatalog.map((item) => item.exam))];
  return [...preferredOrder.filter((exam) => options.includes(exam)), ...options.filter((exam) => !preferredOrder.includes(exam))];
}

export function getCategoriesForExam(exam: string) {
  return examSubjectCatalog.filter((item) => item.exam === exam).map((item) => item.category);
}

export function getSubjectCatalogItem(exam: string, category: string) {
  return examSubjectCatalog.find((item) => item.exam === exam && item.category === category) ?? examSubjectCatalog[0];
}

export function getGroupedSubjects(item: ExamSubjectCatalogItem) {
  const commonSubjects = item.commonSubjects ?? item.subjects.filter((subject) => knownCommonSubjects.has(subject));
  const professionalSubjects = item.professionalSubjects ?? item.subjects.filter((subject) => !commonSubjects.includes(subject));

  return {
    commonSubjects,
    professionalSubjects,
    allSubjects: [...commonSubjects, ...professionalSubjects],
  };
}
