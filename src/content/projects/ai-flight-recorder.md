---
title: AERIS｜讓 AI 的執行過程可追查、可回放
subtitle: ai-flight-recorder
summary: AI／代理的黑盒子飛行記錄器：記下每次執行做了什麼、改了什麼、依據哪些證據，事後可以查詢和回放。目前是可在本機跑起來的 MVP。
category: tool
tags: [observability, ai-agent, fastapi, nextjs, codex]
techStack: [FastAPI, Next.js, Postgres, Redis, MinIO, OpenTelemetry, Docker Compose]
cover: /covers/ai-flight-recorder.webp
coverAlt: 概念插畫：橘色飛行記錄器被紅色緞帶串起幾張資料卡
status: prototype
statusLabel: 本地 MVP
order: 3
featured: true
featuredOrder: 3
updatedAt: 2026-10-08
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/ai-flight-recorder
---

> 狀態：**可在本機執行的 MVP**。自動化測試和本機 Docker 建置都通過；接真實 Google 帳號的驗收還沒完成，也沒有公開的線上版本。封面是概念插畫，不是產品畫面。

## 為什麼做

AI 代理跑完一個任務，人常常只看得到最後的輸出，看不到中間做了什麼。AERIS 想回答五個問題：系統做了什麼、哪些狀態變了、哪些工具和文件影響了結果、為什麼會產生這個輸出，以及解釋裡哪些是**觀察到的**、哪些是**推論**、哪些是**代理自己說的**、哪些是**驗證過的**。

## 怎麼做

**1. 證據分級，而不是一段總結。** 資料模型把執行拆成 sessions、traces、steps、observations、state deltas、artifacts，再用 evidence edges 和 claims 把「哪個主張由哪份證據支撐」連起來。Postgres migration 分成 6 個階段逐步加上治理、認知狀態、研究資料匯入、回放驗證和 Drive 活動紀錄。

**2. 寧可標「沒驗證」，也不要誇大。** 2026-04-21 的 Phase 7 後續修正：沒有回放紀錄的解釋，不再顯示成「回放已驗證」；沒有回放證據時，也不再產生假的「已完成」回放紀錄。

**3. API 不在時退回示範資料，但要說清楚。** Next.js 前端優先讀 API，API 不在時用示範資料；但在 live 模式下失敗，畫面會明確顯示 `upstream_unavailable`，不會假裝成示範資料。Google Docs API 或 Drive Activity API 沒開時，也回傳明確的「受阻原因」，而不是籠統的伺服器錯誤。

## 我和 AI 怎麼協作

- 這個 repo 是照「Codex 執行、人來掌舵」的方式建的。`AGENTS.md` 寫明「Humans steer. Agents execute.」；產品規格是一份 1,194 行的中文指南 `COMPLETE_CODEX_PROJECT_GUIDE_zh-TW.md`，Codex 動手前必須依序讀完 AGENTS.md、指南、計畫檔。
- 每個較大的階段都要先寫計畫（`plans/active/`），做完再交驗證報告（`reports/validation/`，目前 15 份），報告裡分開寫通過、受阻和風險。
- 2026-04-20 兩筆治理基線的 commit 由 GitHub Copilot coding agent 共同作者。

## 做到了什麼

- **2026-04-17 起建立，2026-04-21 合併 Phase 1–7**（PR #6–#14）：本機基線、即時寫入資料層、API 優先的網頁、認知狀態、以主張為中心的「為什麼」、研究資料匯入、經驗證的解釋閘門。
- **2026-04-22 Google Drive 連接器**（PR #15、#16）：OAuth 授權腳本、搜尋、文件匯入、增量變更追蹤、活動紀錄；用 fixture 跑的自動化測試通過。
- **2026-04-22 最後一輪驗證報告**：本機完整測試 37 項通過（unit、integration、e2e、smoke），Ruff 通過、Pyright 0 錯誤、Rust edge daemon `cargo check` 通過、網頁 lint 和 typecheck 通過，`docker-compose build api web` 成功。

## 還沒做到什麼

- **真實帳號驗收沒完成**：卡在目標 Google Cloud 專案還沒啟用 Google Docs API 和 Drive Activity API；最後一輪修完程式後，沒有再重跑真實帳號流程。
- **網頁相依套件有 1 個 high 等級的 npm audit 警示**，當時判斷不在該次範圍內，還沒處理。
- **沒有公開展示**：目前只能在本機用 `scripts/emit_demo_trace.py` 送示範資料。

## 技術與連結

- **後端**：FastAPI、Postgres（migrations）、Redis、MinIO、OpenTelemetry Collector；Drive／arXiv 同步 worker；Python edge SDK；Rust edge daemon 骨架。
- **前端**：Next.js App Router。
- **工具鏈**：uv、pytest、Ruff、Pyright、Docker Compose（一次起 API、網頁、Postgres、Redis、MinIO、OTel Collector）。
- **授權**：MIT。
- **連結**：[GitHub](https://github.com/monkey1sai/ai-flight-recorder)
