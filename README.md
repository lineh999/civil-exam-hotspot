# 公職考試學習平台

以考選部歷屆試題、Twinkle Hub 與 OpenAI 為基礎的 Next.js 學習平台。

## 目前功能

- 近年命題熱點分析
- 歷屆選擇題測驗、答案卷、錯題與重點題
- 歷屆申論題練習
- OpenAI 申論批閱
- 官方試卷 PDF 與題目來源追溯

## 本機開發

1. 複製環境變數：

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. 在 `.env.local` 設定：

   ```text
   OPENAI_API_KEY=...
   TWINKLE_HUB_TOKEN=...
   ```

3. 安裝並啟動：

   ```powershell
   npm.cmd ci
   npm.cmd run dev -- -p 3010
   ```

4. 開啟 [http://127.0.0.1:3010](http://127.0.0.1:3010)。

## 發布原則

- 本機修改不會直接影響雲端。
- `staging` 分支用於測試環境。
- `main` 分支用於正式環境。
- GitHub 每次收到推送或 Pull Request 都會執行正式建置檢查。
- 雲端平台連接 GitHub 後，指定分支更新即可自動重新部署。

完整操作請見 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 部署方式

專案已包含：

- `Dockerfile`：可部署至 Render、Railway 或其他 Docker 平台。
- `render.yaml`：Render Blueprint。
- `railway.json`：Railway 部署設定。
- `/api/health`：雲端健康檢查端點。
- `.github/workflows/ci.yml`：GitHub Actions 建置檢查。

正式建置：

```powershell
npm.cmd run build
```

健康檢查：

```text
GET /api/health
```
