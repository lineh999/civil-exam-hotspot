# 學生版命題熱點分析流程

## 使用者流程

1. 學生第一次登入。
2. 設定我的考試目標：
   - 目標考試，可複選
   - 類科
   - 分析科目，可複選
3. 後台建立分析任務。
4. Twinkle Hub 取得近三年試卷與逐題題幹。
5. OpenAI Batch API 對每題進行章節與考法標記。
6. 系統統計科目熱點。
7. 前台顯示：
   - 已載入幾份試卷
   - 已載入幾題
   - 各科熱點
   - 每個熱點的來源題目與原始試卷連結

## 後台分析流程

```text
create analysis job
→ opendata-search_exam 搜尋目標考試 / 類科 / 科目 / 年度
→ opendata-get_exam_paper 取得逐題題幹
→ normalize questions
→ OpenAI Batch API 分類
→ validate JSON
→ low-confidence auto retry
→ aggregate hotspot summaries
→ store source question links
→ frontend reads result
```

## AI 分類輸出

每一題需要回傳固定 JSON：

```json
{
  "question_id": "114_114150_101_01_Q1",
  "subject": "行政法",
  "primary_topic": "行政處分",
  "secondary_topics": ["行政行為", "行政指導"],
  "exam_focus": "行政處分與非法律行為之區分",
  "question_style": "申論題",
  "answer_skill": "概念區分",
  "difficulty": "中",
  "confidence": 0.92,
  "evidence_text": "行政處分乃「法律行為」之一種",
  "reason": "題幹要求說明行政處分作為法律行為的特色，並與行政指導等非法律行為區分。"
}
```

## 來源追溯

命題熱點必須能追溯來源。

每個熱點要能展開：

- 年度
- 考試
- 類科
- 科目
- 試卷名稱
- 題號
- 題型
- 題幹
- AI 判斷依據
- AI 判斷理由
- 信心分數
- 原始試卷 PDF 連結

## 前台原則

學生不看 AI 工作細節，只看：

- 我的目標考試
- 系統帶入多少試卷與題目
- 哪些科目最需要先準備
- 每科近三年熱點
- 每個熱點從哪些考古題統計而來

## 第一版狀態

目前頁面使用 `lib/student-analysis.ts` 的原型資料。

下一步要把資料來源換成：

- Twinkle Hub `opendata-search_exam`
- Twinkle Hub `opendata-get_exam_paper`
- OpenAI Batch API 分析結果
