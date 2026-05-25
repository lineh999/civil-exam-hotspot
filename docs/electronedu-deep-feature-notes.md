# ElectronEdu 深層功能觀察與公職版優化

## 觀察方式

目前內嵌瀏覽器無法直接讀到使用者登入後分頁，因此先用公開頁、sitemap、llms.txt 與前端功能訊號整理產品架構。這份文件只整理功能模式，不搬題庫內容或專有資料。

## 觀察到的功能訊號

前端功能訊號包含：

- dashboard
- practice
- practice session
- question answered
- explanation viewed
- wrong count
- weakness pack
- knowledge map
- parent weekly report
- achievements
- energy / points
- paywall / pro upgrade
- tutor booking
- teacher assigned sections

## 產品架構判讀

ElectronEdu 不是單純題庫，而是「診斷型題庫平台」：

1. 使用者進入題庫練習。
2. 每題記錄對錯、耗時、章節與題型。
3. 系統把資料轉成弱點分析。
4. 弱點再導向錯題本、弱點包、章節補強。
5. 透過成就、點數、連續練習提高留存。
6. 用家長報告或老師指定章節把學習結果交付給第三方。

## 公職版對應

### 1. 行政法練題工作台

對應 ElectronEdu 的 practice session。

公職版應記錄：

- question_id
- subject
- topic
- question_type
- is_correct
- time_spent
- selected_answer
- reviewed_explanation

### 2. 錯題本

對應 wrong mode 與 consecutive wrong count。

公職版應提供：

- 行政處分錯題
- 行政罰錯題
- 訴願錯題
- 申論低分題
- 連續答錯提醒

### 3. 知識地圖

對應 knowledge map。

公職版可做：

- 章節掌握度
- 已練題數
- 正確率
- 最近一次練習日期
- 官方命題熱度

### 4. 弱點包

對應 weakness pack。

公職版可做：

- 7 天行政法補強任務
- 每天 10 題選擇 + 1 題申論
- 每包集中在一個弱章節
- 完成後重新計算掌握度

### 5. 學習報告

對應 parent weekly report。

公職版可提供給學生、顧問或補習班主管：

- 本週練題數
- 正確率變化
- 最弱三章
- 下週建議任務
- 是否適合轉真人輔導

### 6. 留存系統

對應 achievements、energy、streak。

公職版可以比較沉穩：

- 連續 7 天練習
- 完成 100 題行政法
- 完成一輪訴願專題
- 錯題回補 30 題
- 申論批改 10 題

## 下一步建議

優先開發順序：

1. 行政法官方索引與 PDF 解析。
2. 題目章節標記。
3. 行政法練題工作台。
4. 錯題本與弱點排序。
5. 七天補強任務。
6. 學習報告。

這樣會比只做「命題熱點排行榜」更有商業價值，因為學生每天會回來練、顧問也能追蹤學生狀態。
