# 許竣傑 · AI Craft Lab

> 把想法做出來，把過程留下來。

許竣傑（monkey1sai）的個人作品集與開發筆記。使用 [Astro](https://astro.build) 產生純靜態網站，部署到 Cloudflare Pages。

## 本機開發

需要 Node.js 22.12 以上（見 `.nvmrc`）。

```bash
npm install
npm run dev      # http://localhost:4321（開發模式會顯示 draft 草稿）
npm run build    # 產生 dist/（正式 build 不含 draft）
npm run preview  # 預覽 dist/
npm run check    # 型別與內容檢查
```

## 新增作品

在 `src/content/projects/` 新增一個 Markdown 檔，檔名就是網址（例如 `my-game.md` → `/projects/my-game/`）：

```md
---
title: 用途標題｜一句話說明作品做什麼
subtitle: my-repo       # 副標，通常放 repo 名稱
summary: 一句話說明（140 字內）
category: game          # game | ai-agent | audio | tool | product | research | design
tags: [threejs, web-audio]   # kebab-case
techStack: [Three.js, Web Audio API]
cover: /covers/my-game.webp   # 檔案不存在時自動顯示預設圖樣
coverAlt: 封面說明
status: live            # live | beta | development | prototype | design | archived（固定階段標籤）
statusLabel: 已公開試玩   # 階段之外的具體範圍說明（可省略）
order: 3                # 作品集頁排序（數字越小越前面）
featured: true          # 要上首頁精選才填
featuredOrder: 7        # 首頁精選排序（數字越小越前面，首頁最多 3 件）
draft: false
# publishedAt: 2026-10-08   # 有確切日期才填
links:
  - type: demo          # demo | source | video | store | docs
    label: 線上體驗
    url: https://example.com
---

作品內文（Markdown）。
```

## 新增文章

在 `src/content/blog/` 新增 Markdown 檔：

```md
---
title: 文章標題
description: 摘要（160 字內，會用在 SEO 與 RSS）
publishedAt: 2026-10-08
category: building-in-public   # ai-agents | game-dev | creative-coding | engineering | research | building-in-public
tags: [astro, cloudflare-pages]
relatedProjects: [changshan-longdan]   # 對應 src/content/projects 的檔名
draft: true                     # 改成 false 才會發布
---
```

`draft: true` 的文章與作品不會出現在正式網站、RSS 或 sitemap。`src/content/blog/hello-ai-craft-lab.md` 是排版範例草稿。

## 網站結構

| 路由 | 內容 |
|---|---|
| `/` | 首頁：作品首圖、三件精選、實作方式、自介、聯絡 CTA；有文章才顯示筆記 |
| `/projects/`、`/projects/[slug]/` | 作品集（含類型及階段篩選）與作品頁 |
| `/blog/`、`/blog/[slug]/`、`/blog/category/[c]/` | 文章列表、文章頁、分類 |
| `/tags/[tag]/` | 標籤頁（作品與文章） |
| `/about/`、`/contact/` | 關於、聯絡 |
| `/support/` | 自願贊助說明與既有商店贊助區入口 |
| `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` | RSS、sitemap、robots |

- 樣式：`src/styles/global.css`（原生 CSS 與 design tokens；暖紙淺色預設，可切換深色，文章內頁採 720px 閱讀寬度）
- 社群連結與分類名稱：`src/consts.ts`
- 贊助入口：首頁、主導覽與頁尾連到 `/support/`；`SPONSORSHIP_URL` 指向商店的 `#sponsorship`。收款平台、幣種、網路、UUID、地址、QR code 與必填 Memo 由商店統一提供，部落格不另外儲存收款資料。閱讀與已開放的下載維持免費。
- 內容 schema：`src/content.config.ts`
- 作品封面：原始圖放在 `/workspace/blog-assets/`，執行 `COVERS_SRC=/workspace/blog-assets node scripts/optimize-covers.mjs` 轉成 `public/covers/<slug>.webp`（1280×720）與 `public/images/projects/*.webp`；對照表寫在腳本開頭
- OG 圖：`public/og-default.svg`，用 `node scripts/build-og.mjs` 轉成 `public/og-default.png`

## 部署（Cloudflare Pages）

```bash
npm run build
npx wrangler pages deploy dist --project-name ai-craft-lab
```

網站網址預設為 `https://ai-craft-lab.pages.dev`；若實際網址不同（例如綁自訂網域），build 前設定 `SITE_URL`：

```bash
SITE_URL=https://blog.example.com npm run build
```

也可以在 Cloudflare Pages 後台連接這個 GitHub repo：build command `npm run build`、output `dist`、branch `main`，並設定環境變數 `NODE_VERSION=22`。

## 改版內容維護

- 首頁精選固定三件：常山龍膽、Codex Jev、AERIS；用 `featuredOrder` 排序。
- 作品使用固定 `status` 標籤；`statusLabel` 補充本機 MVP、已公開試玩等具體範圍，不代表全功能驗收。
- 案例依既有證據整理為問題、我的選擇、AI 協作、成果與證據、卡關與限制、下一步；缺乏素材的小節省略。
- 正式文章為零時，首頁文章區、全站文章導航與 RSS 入口隱藏。既有 `/blog/` 與 `/rss.xml` 路徑仍保留，避免既有連結失效。開發模式仍可預覽草稿。
- 所有作品媒體沿用現有檔案；未加入人像、生成圖片、影片嵌入或修改前後比較。
- 建置後可執行 `node scripts/verify-redesign.mjs` 檢查精選、隱藏文章與素材路徑。

## 閱讀導覽與內容待辦

- `readerGuide`：選填的三段導讀（`takeaway`、`contribution`、`evidence`），只整理案例既有事實。精選卡片會顯示 `takeaway`，案例開頭顯示完整導讀與資料日期。
- `relatedProjects`：選填的 `{ id, reason }` 陣列（最多三件），使用已公開作品的檔名，寫清楚為什麼值得接著讀。沒有設定時保留回作品集的路徑。不要把議題相近寫成已整合。
- 所有案例的段落連結移到正文之前，在手機上也能先挑想讀的內容；不依賴 JavaScript。
- [內容待辦](docs/content-backlog.md) 列出最值得由作者補充的真實畫面、操作例子與判斷紀錄，不會發布為網站內容。
- 驗證：`npm run check && npm run build && node scripts/verify-redesign.mjs && node scripts/verify-reader-journey.mjs`。此命令不部署。

## 音樂入口與文章延伸閱讀驗證

- 首頁的最新音樂卡讀取 `src/data/songs.ts`，按日期降冪取一首，不建立播放器。歌曲資料與排程不由這次閱讀動線調整修改。
- 文章結尾只選實際標籤有交集的公開作品／文章，排除自己及重複項目，最多三筆；沒有交集便省略。開發模式仍可看草稿。
- 音樂頁維持一次只載入一個點擊啟動的播放器。停用 JavaScript 時顯示全部歌曲的 YouTube 直連；選曲後焦點移到具名稱的播放區。
- `node --experimental-strip-types scripts/test-music-journey.mjs`：實際標籤交集及記憶體中的 0／1／4／12／13／25 首測試資料，涵蓋篩選、分頁、單一播放器與焦點。
- `node scripts/test-related-render.mjs`：在暫存 app 內建立測試文章並執行 Astro build，驗證 1／3／0 筆延伸閱讀、自身／重複排除及目標路徑；完成後清理暫存 app，不寫入正式內容。
- `npm run check && npm run build && node scripts/verify-redesign.mjs && node scripts/verify-reader-journey.mjs && node --experimental-strip-types scripts/verify-music-journey.mjs`：驗證正式輸出與站內連結。
- DOM 合約測試與靜態輸出不能代替瀏覽器視覺／鍵盤驗收；正式發布前仍應用可存取的預覽檢查 375px 與桌面排版、無 JavaScript、篩選後選曲和顯示更多。
