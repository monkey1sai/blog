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
| `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` | RSS、sitemap、robots |

- 樣式：`src/styles/global.css`（原生 CSS 與 design tokens；暖紙淺色預設，可切換深色，文章內頁採 720px 閱讀寬度）
- 社群連結與分類名稱：`src/consts.ts`
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
