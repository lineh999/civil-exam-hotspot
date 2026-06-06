# 雲端發布流程

## 建議架構

| 環境 | Git 分支 | 用途 |
|---|---|---|
| 本機 | 任意功能分支 | 開發與除錯 |
| 測試站 | `staging` | 公司內部驗收 |
| 正式站 | `main` | 提供學生使用 |

本機程式碼不會自動改動雲端。只有推送至雲端平台綁定的 Git 分支，網站才會重新部署。

## 第一次上雲

### Railway

1. 在 Railway 建立 Project，選擇 Deploy from GitHub repo。
2. 選擇 `lineh999/civil-exam-hotspot`。
3. 建立 `staging` 與 `production` 兩個 Environment。
4. 測試環境綁定 `staging`，正式環境綁定 `main`。
5. 在兩個環境分別設定：

   ```text
   OPENAI_API_KEY
   TWINKLE_HUB_TOKEN
   APP_VERSION
   ```

6. Health check 使用 `/api/health`。
7. 部署完成後，先用測試網址驗收，再設定正式網域。

### Render

1. 在 Render 選擇 New > Blueprint。
2. 連接 GitHub repository。
3. Render 會讀取根目錄的 `render.yaml`。
4. 輸入 `OPENAI_API_KEY` 與 `TWINKLE_HUB_TOKEN`。
5. 若要測試站與正式站分離，複製 Web Service：
   - 測試站 Branch 設為 `staging`
   - 正式站 Branch 設為 `main`

## 日常修改

### 1. 本機開發

```powershell
git switch -c fix/功能名稱
npm.cmd run dev -- -p 3010
```

完成後執行：

```powershell
npm.cmd run build
```

### 2. 發布到測試站

```powershell
git add .
git commit -m "fix(civil-exam-platform): 修正內容"
git push origin HEAD:staging
```

雲端測試站會自動更新，正式站保持原版本。

### 3. 發布到正式站

在測試站驗收完成後：

```powershell
git switch main
git pull --ff-only
git merge --no-ff staging
git push origin main
```

正式站會自動重新部署。

## 部署後檢查

1. 開啟 `/api/health`，確認 `status` 為 `ok`。
2. 測試 Twinkle Hub 載入一份試卷。
3. 測試 OpenAI 命題熱點分析。
4. 測試申論 AI 批閱。
5. 開啟官方試卷 PDF。

## 學習紀錄限制

目前錯題、重點題與申論作答尚未儲存在共用雲端資料庫。部署網站後：

- 不同學生不會共用紀錄。
- 更換瀏覽器或裝置後，紀錄不會自動同步。
- 後續應加入帳號系統與 PostgreSQL，將紀錄依使用者保存。

## 金鑰安全

- `.env.local` 不可提交至 Git。
- 金鑰只設定在本機 `.env.local` 或雲端 Secret/Variables。
- 不要把金鑰寫入程式碼、README、截圖或聊天內容。
- 金鑰若曾公開，必須撤銷並重新產生。
