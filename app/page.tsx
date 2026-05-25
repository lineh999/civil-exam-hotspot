"use client";

import { useMemo, useState } from "react";
import { getCategoriesForExam, getExamOptions, getGroupedSubjects, getSubjectCatalogItem } from "@/lib/exam-subjects";
import type { HotspotAnalysis, HotspotTopic } from "@/lib/openai-analyzer";

const examOptions = getExamOptions();
const yearOptions = ["114", "113", "112", "111", "110", "109", "108"];

type PaperPart = { label: string; count: number; questionType: string };

type LoadedPaper = {
  id: string;
  year: string;
  exam: string;
  category: string;
  subject: string;
  title: string;
  questionCount: number;
  paperUrl: string;
  answerUrl?: string | null;
  source?: "twinkle" | "fallback" | "pending";
  paperParts?: PaperPart[];
};

type LoadedQuestion = {
  id: string;
  year: string;
  subject: string;
  paperTitle: string;
  paperUrl: string;
  questionNo: string;
  questionType: string;
  stem: string;
  answer?: string | null;
};

type DrawerMode = "papers" | "questions" | null;

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function getYearRange(years: string[]) {
  const sorted = [...years].sort();
  return `${sorted[0]}-${sorted[sorted.length - 1]} 年`;
}

function stableHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getMoexExamCode(year: string, exam: string) {
  if (exam === "高考三級" || exam === "普考") {
    return `${year}${Number(year) <= 112 ? "090" : "080"}`;
  }

  const suffixByExam: Record<string, string> = {
    初等考: "010",
    地方特考三等: "190",
    地方特考四等: "190",
    地方特考五等: "190",
    司法特考: "120",
    關務特考: "040",
    身心特考: "040",
    退除役特考: "040",
    原住民特考: "140",
    民航特考: "140",
    移民特考: "140",
    海巡特考: "120",
    調查局特考: "120",
    一般警察: "130",
    警察特考: "130",
    國安局特考: "170",
  };

  return `${year}${suffixByExam[exam] ?? "080"}`;
}

function makeMoexPaperUrl(year: string, exam: string) {
  const examCode = getMoexExamCode(year, exam);
  const westernYear = Number(year) + 1911;

  return `https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?e=${examCode}&y=${westernYear}`;
}

const KOKUGO_PARTS: PaperPart[] = [
  { label: "甲", count: 1, questionType: "作文" },
  { label: "乙", count: 10, questionType: "測驗" },
];

function makeLoadedPapers(exam: string, category: string, subjects: string[], years: string[], categoryIndex: number) {
  const candidates = years.flatMap((year) =>
    subjects.map((subject, index) => {
      const subjectHash = stableHash(`${exam}-${category}-${subject}-${year}`);
      const isKokugo = subject === "國文";
      const isCommonSubject = ["英文", "憲法", "法學緒論", "公民"].some((keyword) => subject.includes(keyword));
      const questionCount = isKokugo
        ? KOKUGO_PARTS.reduce((sum, p) => sum + p.count, 0)
        : isCommonSubject ? 8 + (subjectHash % 8) : 4 + (subjectHash % 7) + (index % 3);

      return {
        id: `${year}-${exam}-${category}-${subject}`,
        year,
        exam,
        category,
        subject,
        title: `${year} 年 ${exam} ${category} ${subject}`,
        questionCount,
        paperUrl: makeMoexPaperUrl(year, exam),
        paperParts: isKokugo ? KOKUGO_PARTS : undefined,
        sortKey: subjectHash,
      };
    }),
  );

  const baseCount = candidates.length;
  const categoryHash = stableHash(`${exam}-${category}`);
  const maxMissing = Math.min(4, Math.max(1, baseCount - 1));
  const missingCount = categoryHash % (maxMissing + 1);
  const targetCount = Math.max(1, baseCount - missingCount);

  return candidates
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, targetCount)
    .sort((a, b) => Number(b.year) - Number(a.year) || subjects.indexOf(a.subject) - subjects.indexOf(b.subject))
    .map(({ sortKey: _sortKey, ...paper }, index) => ({
      ...paper,
      questionCount: paper.questionCount + (index === 0 ? categoryIndex * 23 + categoryIndex * categoryIndex : 0),
    }));
}

function makeLoadedQuestions(papers: LoadedPaper[]) {
  return papers.flatMap((paper) =>
    Array.from({ length: paper.questionCount }, (_, index) => ({
      id: `${paper.id}-q${index + 1}`,
      year: paper.year,
      subject: paper.subject,
      paperTitle: paper.title,
      paperUrl: paper.paperUrl,
      questionNo: `第 ${index + 1} 題`,
      questionType: index % 4 === 0 ? "申論題" : "測驗題",
      stem: `${paper.subject}第 ${index + 1} 題題幹摘要。正式串接 TwinkleAI MCP 後，這裡會顯示考選部歷屆試題的原始題幹與來源。`,
    })),
  );
}

export default function HomePage() {
  const [selectedExam, setSelectedExam] = useState("高考三級");
  const [category, setCategory] = useState("一般行政");
  const [selectedYears, setSelectedYears] = useState<string[]>(["114", "113", "112"]);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);

  const categories = getCategoriesForExam(selectedExam);
  const effectiveCategory = categories.includes(category) ? category : categories[0] ?? "";
  const subjectCatalog = getSubjectCatalogItem(selectedExam, effectiveCategory);
  const { commonSubjects, professionalSubjects, allSubjects } = getGroupedSubjects(subjectCatalog);
  const categoryIndex = Math.max(0, categories.indexOf(effectiveCategory));

  const [loadedPapers, setLoadedPapers] = useState<LoadedPaper[]>([]);
  const [loadedQuestions, setLoadedQuestions] = useState<LoadedQuestion[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, HotspotAnalysis>>({});
  const [analyzingSubject, setAnalyzingSubject] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<Record<string, string>>({});
  const canStartAnalysis = Boolean(selectedExam && effectiveCategory && allSubjects.length > 0 && selectedYears.length > 0);
  const fallbackPapers = useMemo(() => makeLoadedPapers(selectedExam, effectiveCategory, allSubjects, selectedYears, categoryIndex), [selectedExam, effectiveCategory, allSubjects, selectedYears, categoryIndex]);
  const fallbackQuestions = useMemo(() => makeLoadedQuestions(fallbackPapers), [fallbackPapers]);
  const visiblePapers = loadedPapers.length > 0 ? loadedPapers : fallbackPapers;
  const visibleQuestions = loadedQuestions.length > 0 ? loadedQuestions : fallbackQuestions;
  const subjectStats = useMemo(
    () => {
      const paperGroups = groupPapersByUrl(visiblePapers);

      return allSubjects.map((subject) => {
        const papers = visiblePapers.filter((paper) => paper.subject.includes(subject) || subject.includes(paper.subject));
        const questions = visibleQuestions.filter((question) => question.subject.includes(subject) || subject.includes(question.subject));
        const mergedGroups = paperGroups.filter((group) => group.subjects.includes(subject) && isTrueMergedExam(group.subjects));
        const mergedSubjects = Array.from(new Set(mergedGroups.flatMap((group) => group.subjects))).sort(
          (a, b) => allSubjects.indexOf(a) - allSubjects.indexOf(b),
        );

        return {
          subject,
          paperCount: papers.length,
          questionCount: questions.length,
          mergedPaperCount: mergedGroups.length,
          mergedSubjects,
        };
      });
    },
    [allSubjects, visiblePapers, visibleQuestions],
  );
  const [subjectName, setSubjectName] = useState(allSubjects[0] ?? "");
  const activeSubject = subjectStats.find((item) => item.subject === subjectName) ?? subjectStats[0];

  async function analyzeSubject(subject: string) {
    if (analyzingSubject) return;
    setAnalyzingSubject(subject);
    setAnalysisError((prev) => ({ ...prev, [subject]: "" }));

    try {
      const questions = visibleQuestions.filter((q) => q.subject === subject || subject.includes(q.subject) || q.subject.includes(subject));
      const response = await fetch("/api/analyze-hotspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, exam: selectedExam, category: effectiveCategory, questions }),
      });
      const data = (await response.json()) as HotspotAnalysis & { error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "AI 分析失敗");
      }

      setAnalysisResults((prev) => ({ ...prev, [subject]: data }));
    } catch (error) {
      setAnalysisError((prev) => ({ ...prev, [subject]: error instanceof Error ? error.message : "AI 分析失敗" }));
    } finally {
      setAnalyzingSubject(null);
    }
  }

  function resetAnalysis() {
    setAnalysisStarted(false);
    setLoadedPapers([]);
    setLoadedQuestions([]);
    setLoadError("");
    setAnalysisResults({});
    setAnalysisError({});
  }

  function changeExam(nextExam: string) {
    const nextCategories = getCategoriesForExam(nextExam);
    const nextCategory = nextCategories.includes("一般行政") ? "一般行政" : nextCategories[0] ?? "";
    setSelectedExam(nextExam);
    setCategory(nextCategory);
    setSubjectName("");
    resetAnalysis();
  }

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSubjectName("");
    resetAnalysis();
  }

  function toggleYear(year: string) {
    setSelectedYears((current) => {
      if (current.includes(year)) {
        return current.length === 1 ? current : current.filter((item) => item !== year);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, year].sort((a, b) => Number(b) - Number(a));
    });
    resetAnalysis();
  }

  async function startAnalysis() {
    if (!canStartAnalysis) {
      setLoadError("請先確認已選擇考試類科、類科、年份，且此類科有對應考科。");
      return;
    }

    setSubjectName(allSubjects[0] ?? "");
    setIsLoadingPapers(true);
    setLoadError("");

    try {
      const response = await fetch("/api/exam-papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: selectedExam,
          category: effectiveCategory,
          subjects: allSubjects,
          years: selectedYears,
        }),
      });
      const data = (await response.json()) as {
        papers?: LoadedPaper[];
        questions?: LoadedQuestion[];
        error?: string;
      };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "TwinkleAI MCP 載入失敗");
      }

      setLoadedPapers(data.papers ?? []);
      setLoadedQuestions(data.questions ?? []);
      setAnalysisStarted(true);
    } catch (error) {
      setLoadedPapers(fallbackPapers);
      setLoadedQuestions(fallbackQuestions);
      setLoadError(error instanceof Error ? error.message : "TwinkleAI MCP 載入失敗");
      setAnalysisStarted(true);
    } finally {
      setIsLoadingPapers(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <section className="border-b border-[#dce3ef] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-black tracking-normal max-[640px]:text-2xl">近幾年命題熱點分析</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5d6678]">
            先選擇考試類科與年份，系統會抓取共同科目與專業科目的歷屆試題，再用 AI 分析命題熱點；每個熱點都能追溯到來源試卷與題目。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6">
        <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
          <div className="grid max-w-4xl gap-5">
            <div className="grid max-w-md gap-2">
              <label className="text-sm font-black" htmlFor="exam">
                請選擇你的考試類科
              </label>
              <select id="exam" className="h-11 rounded border border-[#cbd5e1] px-3" value={selectedExam} onChange={(event) => changeExam(event.target.value)}>
                {examOptions.map((exam) => (
                  <option key={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <div className="grid max-w-md gap-2">
              <label className="text-sm font-black" htmlFor="category">
                選擇類科
              </label>
              <select id="category" className="h-11 rounded border border-[#cbd5e1] px-3" value={effectiveCategory} onChange={(event) => changeCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <label className="text-sm font-black">選擇分析年份</label>
                <span className="text-xs font-bold text-[#64748b]">最多選擇 3 個年度</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {yearOptions.map((year) => {
                  const active = selectedYears.includes(year);
                  const disabled = !active && selectedYears.length >= 3;
                  return (
                    <button
                      key={year}
                      className={`rounded border px-4 py-2 text-sm font-black ${
                        active ? "border-[#0e7490] bg-[#ecfeff] text-[#0e7490]" : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                      } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                      onClick={() => toggleYear(year)}
                      type="button"
                    >
                      {year} 年
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">系統自動列出這個類科的考科</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                <SubjectList title="共同科目" tone="blue" subjects={commonSubjects} />
                <SubjectList title="專業科目" tone="orange" subjects={professionalSubjects} />
              </div>
            </div>

            <button
              className="w-fit rounded bg-[#0f172a] px-5 py-3 text-sm font-black text-white hover:bg-[#1e293b] disabled:cursor-wait disabled:opacity-60"
              disabled={isLoadingPapers || !canStartAnalysis}
              onClick={startAnalysis}
            >
              {isLoadingPapers ? "分析中" : "產生命題熱點分析"}
            </button>
            {loadError ? <p className="text-sm font-bold text-[#c2410c]">TwinkleAI MCP 載入失敗，暫以本機流程資料顯示：{loadError}</p> : null}
          </div>
        </section>

        {analysisStarted ? (
          <>
            <section className="grid grid-cols-3 gap-4 max-[920px]:grid-cols-1">
              <div className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
                <p className="text-xl font-black">{selectedExam}</p>
                <p className="mt-2 text-3xl font-black">{effectiveCategory}</p>
              </div>
              <button className="rounded-lg border border-[#dce3ef] bg-white p-4 text-left shadow-sm hover:border-[#f97316]" onClick={() => setDrawerMode("papers")} type="button">
                <p className="text-sm font-black text-[#64748b]">已載入試卷</p>
                <p className="mt-1 text-3xl font-black text-[#c2410c]">{formatNumber(visiblePapers.length)}</p>
                <p className="mt-1 text-xs font-bold text-[#64748b]">{getYearRange(selectedYears)}</p>
              </button>
              <button className="rounded-lg border border-[#dce3ef] bg-white p-4 text-left shadow-sm hover:border-[#0e7490]" onClick={() => setDrawerMode("questions")} type="button">
                <p className="text-sm font-black text-[#64748b]">已載入題目</p>
                <p className="mt-1 text-3xl font-black text-[#0e7490]">{formatNumber(visibleQuestions.length)}</p>
                <p className="mt-1 text-xs font-bold text-[#64748b]">共同科目 + 專業科目</p>
              </button>
            </section>

            <section className="grid grid-cols-[330px_1fr] gap-6 max-[980px]:grid-cols-1">
              <aside className="rounded-lg border border-[#dce3ef] bg-white p-4 shadow-sm">
                <p className="text-sm font-black text-[#0e7490]">科目分析</p>
                <h2 className="mt-1 text-xl font-black">選一科看熱點</h2>
                <div className="mt-3 grid gap-2">
                  {subjectStats.map((item) => {
                    const isAnalyzing = analyzingSubject === item.subject;
                    const hasResult = !!analysisResults[item.subject];
                    const hasError = !!analysisError[item.subject];

                    return (
                      <div
                        key={item.subject}
                        className={`rounded border ${activeSubject?.subject === item.subject ? "border-[#0e7490] bg-[#ecfeff]" : "border-[#e2e8f0]"}`}
                      >
                        <button
                          className="w-full px-3 py-3 text-left hover:bg-[#f0fdfe]"
                          onClick={() => setSubjectName(item.subject)}
                          type="button"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <strong>{item.subject}</strong>
                            <span className="text-sm font-black text-[#c2410c]">{item.questionCount} 題</span>
                          </div>
                          <p className="mt-1 text-xs font-bold text-[#64748b]">
                            {item.mergedSubjects.length > 1
                              ? `${item.mergedPaperCount} 份合卷｜同一份試卷含 ${item.mergedSubjects.join("、")}`
                              : `${item.paperCount} 份試卷｜${hasResult ? "已完成 AI 分析" : "等待 AI 分析"}`}
                          </p>
                        </button>
                        <div className="border-t border-[#e2e8f0] px-3 py-2">
                          {hasError ? (
                            <p className="text-xs font-bold text-[#c2410c]">{analysisError[item.subject]}</p>
                          ) : null}
                          <button
                            className={`rounded px-3 py-1.5 text-xs font-black ${
                              hasResult
                                ? "border border-[#0e7490] bg-[#ecfeff] text-[#0e7490] hover:bg-[#cffafe]"
                                : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                            } disabled:cursor-wait disabled:opacity-60`}
                            disabled={!!analyzingSubject}
                            onClick={(e) => { e.stopPropagation(); void analyzeSubject(item.subject); }}
                            type="button"
                          >
                            {isAnalyzing ? "分析中…" : hasResult ? "重新分析" : "分析"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <section className="rounded-lg border border-[#dce3ef] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0e7490]">{activeSubject?.subject}</p>
                    <h2 className="mt-1 text-3xl font-black">近幾年命題熱點</h2>
                    {activeSubject && activeSubject.mergedSubjects.length > 1 ? (
                      <p className="mt-2 text-sm font-bold text-[#64748b]">
                        這一科與 {activeSubject.mergedSubjects.filter((subject) => subject !== activeSubject.subject).join("、")} 共用同一份合卷 PDF。
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right max-[640px]:text-left">
                    <p className="text-2xl font-black text-[#c2410c]">{activeSubject?.questionCount ?? 0}</p>
                    <p className="text-xs font-bold text-[#64748b]">題目來源</p>
                  </div>
                </div>

                {activeSubject && analysisResults[activeSubject.subject] ? (
                  <HotspotResults analysis={analysisResults[activeSubject.subject]} />
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
                    <p className="text-sm font-bold text-[#64748b]">
                      點擊左側科目旁的「分析」按鈕，AI 將自動分析命題熱點
                    </p>
                  </div>
                )}
              </section>
            </section>
          </>
        ) : null}
      </section>

      {drawerMode ? (
        <DataDrawer
          mode={drawerMode}
          papers={visiblePapers}
          questions={visibleQuestions}
          onClose={() => setDrawerMode(null)}
        />
      ) : null}
    </main>
  );
}

function SubjectList({ title, tone, subjects }: { title: string; tone: "blue" | "orange"; subjects: string[] }) {
  const color = tone === "blue" ? "text-[#0e7490]" : "text-[#c2410c]";

  return (
    <div className="rounded border border-[#dce3ef] bg-[#f8fafc] p-3">
      <p className={`mb-2 text-xs font-black ${color}`}>{title}</p>
      <div className="grid gap-2">
        {subjects.map((subject, index) => (
          <div key={`${subject}-${index}`} className="grid grid-cols-[28px_1fr] items-center gap-2 rounded border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-bold">
            <span className={`font-black ${color}`}>{index + 1}</span>
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
}

type PaperGroup = {
  key: string;
  year: string;
  exam: string;
  category: string;
  subjects: string[];
  questionCount: number;
  paperUrl: string;
  answerUrl?: string | null;
  paperParts?: PaperPart[];
};

// 已知合卷組合：所有科目都屬於同一個 set，才算真正合卷
const KNOWN_MERGED_SETS: Set<string>[] = [
  new Set(["憲法", "法學緒論", "英文"]),
  new Set(["公民", "英文"]),
];

function isTrueMergedExam(subjects: string[]): boolean {
  return KNOWN_MERGED_SETS.some((mergedSet) =>
    subjects.length >= 2 && subjects.every((s) => mergedSet.has(s)),
  );
}

function groupPapersByUrl(papers: LoadedPaper[]): PaperGroup[] {
  const map = new Map<string, PaperGroup>();

  for (const paper of papers) {
    const existing = map.get(paper.paperUrl);

    if (existing) {
      existing.subjects.push(paper.subject);
    } else {
      map.set(paper.paperUrl, {
        key: paper.id,
        year: paper.year,
        exam: paper.exam,
        category: paper.category,
        subjects: [paper.subject],
        questionCount: paper.questionCount,
        paperUrl: paper.paperUrl,
        answerUrl: paper.answerUrl,
        paperParts: paper.paperParts,
      });
    }
  }

  return Array.from(map.values());
}

function TrendBadge({ trend }: { trend: HotspotTopic["trend"] }) {
  const map = {
    rising: { label: "↑ 上升", className: "border-[#16a34a] bg-[#dcfce7] text-[#166534]" },
    stable: { label: "→ 穩定", className: "border-[#ca8a04] bg-[#fef9c3] text-[#854d0e]" },
    declining: { label: "↓ 下降", className: "border-[#94a3b8] bg-[#f1f5f9] text-[#475569]" },
  };
  const { label, className } = map[trend] ?? map.stable;

  return <span className={`rounded border px-2 py-0.5 text-xs font-black ${className}`}>{label}</span>;
}

function HotspotResults({ analysis }: { analysis: HotspotAnalysis }) {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  return (
    <div className="mt-6 grid gap-5">
      <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <p className="text-sm font-black text-[#0e7490]">整體趨勢分析</p>
        <p className="mt-2 text-sm leading-6 text-[#334155]">{analysis.overallTrend}</p>
      </div>

      {analysis.predictionHints.length > 0 ? (
        <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
          <p className="text-sm font-black text-[#92400e]">預測命題方向</p>
          <ul className="mt-2 grid gap-1.5">
            {analysis.predictionHints.map((hint, index) => (
              <li key={index} className="flex gap-2 text-sm text-[#78350f]">
                <span className="font-black">·</span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="mb-3 text-sm font-black">命題熱點排行</p>
        <div className="grid gap-3">
          {analysis.hotspots.map((hotspot, index) => {
            const isExpanded = expandedTopicId === hotspot.topicId;

            return (
              <article key={hotspot.topicId} className="rounded-lg border border-[#e2e8f0] bg-white">
                <button
                  className="w-full px-4 py-3 text-left hover:bg-[#f8fafc]"
                  onClick={() => setExpandedTopicId(isExpanded ? null : hotspot.topicId)}
                  type="button"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f172a] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <span className="font-black">{hotspot.topicName}</span>
                    <TrendBadge trend={hotspot.trend} />
                    <span className="ml-auto text-sm font-black text-[#c2410c]">{hotspot.frequency} 次</span>
                    <span className="text-xs font-bold text-[#94a3b8]">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  {hotspot.subtopics.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hotspot.subtopics.map((sub) => (
                        <span key={sub} className="rounded border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-0.5 text-xs font-bold text-[#334155]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-1 text-xs font-bold text-[#94a3b8]">
                    出現年份：{hotspot.years.join("、")} 年
                  </p>
                </button>

                {isExpanded ? (
                  <div className="border-t border-[#e2e8f0] px-4 py-3">
                    <p className="mb-2 text-xs font-black text-[#0e7490]">相關考題</p>
                    <div className="grid gap-2">
                      {hotspot.examQuestions.map((q, qi) => (
                        <div key={qi} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-3">
                          <p className="text-xs font-black text-[#64748b]">{q.year} 年｜{q.questionNo}</p>
                          <p className="mt-1 text-sm leading-5 text-[#172033]">{q.stem}</p>
                          <p className="mt-1 text-xs text-[#94a3b8]">{q.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <p className="text-right text-xs text-[#94a3b8]">
        分析時間：{new Date(analysis.generatedAt).toLocaleString("zh-TW")}｜共分析 {analysis.totalQuestions} 題
      </p>
    </div>
  );
}

function DataDrawer({ mode, papers, questions, onClose }: { mode: DrawerMode; papers: LoadedPaper[]; questions: LoadedQuestion[]; onClose: () => void }) {
  const title = mode === "papers" ? "已載入試卷" : "已載入題目";
  const paperGroups = groupPapersByUrl(papers);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/40" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#dce3ef] px-5 py-4">
          <div>
            <p className="text-sm font-black text-[#0e7490]">載入明細</p>
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
          <button className="rounded border border-[#cbd5e1] px-3 py-2 text-sm font-black hover:bg-[#f8fafc]" onClick={onClose} type="button">
            關閉
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {mode === "papers" ? (
            <div className="grid gap-3">
              {paperGroups.map((group) => {
                const isMerged = isTrueMergedExam(group.subjects);
                const baseTitle = `${group.year} 年 ${group.exam} ${group.category}`;
                const displaySubject = isMerged ? null : group.subjects[0];

                return (
                  <article key={group.key} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#0e7490]">
                          {group.year} 年｜{group.exam}｜{group.category}
                        </p>
                        <h3 className="mt-1 text-lg font-black">{isMerged ? baseTitle : `${baseTitle} ${displaySubject}`}</h3>
                        {isMerged ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {group.subjects.map((subject) => (
                              <span key={subject} className="rounded border border-[#cbd5e1] bg-white px-2 py-0.5 text-xs font-bold text-[#334155]">
                                {subject}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-[#64748b]">{displaySubject}</p>
                        )}
                        {isMerged && (
                          <p className="mt-1.5 text-xs font-bold text-[#94a3b8]">以上科目來自同一份合卷 PDF</p>
                        )}
                      </div>
                      <div className="grid justify-items-end gap-3">
                        {group.paperParts ? (
                          <div className="grid justify-items-end gap-0.5">
                            {group.paperParts.map((part) => (
                              <p key={part.label} className="text-sm font-black text-[#c2410c]">
                                {part.label}｜{part.count} 題
                                <span className="ml-1 text-xs font-bold text-[#94a3b8]">（{part.questionType}）</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xl font-black text-[#c2410c]">{group.questionCount} 題</p>
                        )}
                        <a
                          className="rounded bg-[#172033] px-3 py-2 text-xs font-black text-white hover:bg-[#334155]"
                          href={group.paperUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          開啟 PDF
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {questions.map((question) => (
                <article key={question.id} className="rounded border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <p className="text-sm font-black text-[#0e7490]">
                    {question.year} 年｜{question.subject}｜{question.questionNo}｜{question.questionType}
                  </p>
                  <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-base font-black">{question.paperTitle}</h3>
                    <a
                      className="rounded border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-black text-[#172033] hover:bg-[#f8fafc]"
                      href={question.paperUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      查看 PDF
                    </a>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#334155]">{question.stem}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
