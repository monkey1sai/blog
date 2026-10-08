# 許竣傑 · AI Craft Lab

> 讓 AI 不只會回答，還能創作、執行與交付。

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
title: 作品名稱
summary: 一句話說明（140 字內）
category: game          # game | ai-agent | audio | tool | product
tags: [threejs, web-audio]   # kebab-case
techStack: [Three.js, Web Audio API]
status: live            # live | beta | development | archived
featured: true          # 要上首頁精選才填
featuredOrder: 7        # 首頁精選排序（數字越小越前面，首頁最多 6 件）
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
| `/` | 首頁：Hero、精選作品、三個方向、最新文章、能力、聯絡 CTA |
| `/projects/`、`/projects/[slug]/` | 作品集（含類型篩選）與作品頁 |
| `/blog/`、`/blog/[slug]/`、`/blog/category/[c]/` | 文章列表、文章頁、分類 |
| `/tags/[tag]/` | 標籤頁（作品與文章） |
| `/about/`、`/contact/` | 關於、聯絡 |
| `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` | RSS、sitemap、robots |

- 樣式：`src/styles/global.css`（原生 CSS 與 design tokens；深色預設，可切換淺色，文章內頁採 720px 閱讀寬度）
- 社群連結與分類名稱：`src/consts.ts`
- 內容 schema：`src/content.config.ts`
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
