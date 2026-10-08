---
title: Codex Jev｜替 Codex 加上一位只提建議的 MCP 軍師
subtitle: codex-jev-integration
summary: 讓 Codex 在挑角色、挑資源、做決策之前，先問 Jev 模型的意見。只給建議：不執行、不啟動代理、不切換模型、不提升權限。85 個離線測試通過。
category: tool
tags: [mcp, codex, ai-agent, jev, python]
techStack: [Python 3.12 標準函式庫, MCP（JSON-RPC over stdio）, TypeSafe Jev API, Codex CLI／App]
cover: /covers/codex-jev-integration.webp
coverAlt: 「Jev 軍機營：codex-jev-integration 戰報」主視覺：手持羽扇的軍師指著地圖
status: beta
statusLabel: 已實作・部分整合驗證
order: 2
featured: true
featuredOrder: 2
updatedAt: 2026-10-08
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/codex-jev-integration
---

> 狀態：**已實作、部分整合驗證**。程式和 85 個離線測試都在 repo 裡；Codex App 原生呼叫驗證過一部分，Codex CLI 原生驗收還沒過，也還沒做完整的效益比較。

<figure>
  <a href="/images/projects/codex-jev-integration-infographic.webp" target="_blank" rel="noopener">
    <img src="/images/projects/codex-jev-integration-infographic.webp" alt="Jev 軍機營戰報資訊圖：主帥定位、六大兵種（六個 MCP 工具）、軍令邊界、兵器庫架構、演武成果、當前戰況與下一場戰役" width="1122" height="1402" loading="lazy" decoding="async" />
  </a>
  <figcaption>用古代軍隊風格整理的 repo 戰報圖（點圖看原尺寸）。細節以下文和 README 為準。</figcaption>
</figure>

## 為什麼做

Codex 在一個任務裡常要做選擇：派哪個角色、載入哪些 tool／MCP／skill、這一步要不要先找人審查。這些判斷有一部分是語意問題，適合交給專門做判斷的 Jev（TypeSafe System One）；但判斷不能變成執行權。這個 repo 要做的，就是讓 Codex 能問 Jev，同時把 Jev 能影響的範圍鎖死在「建議」。

它和 [Jev 決策實驗室](/projects/jev-systemone-lab/) 的分工是：實驗室研究「怎麼讓模型判斷得可靠」，這裡負責「把判斷接進 Codex 的日常工作」。

## 怎麼做

**1. 只提建議，邊界寫死。** 六個 MCP 工具：`jev_status`、`jev_route`、`jev_report_outcome`、`jev_select_resources`、`jev_decide`、`jev_report_selection_outcome`。它們不執行資源、不啟動代理、不切換模型、不改權限、不核准任何動作。使用者明確指定的資源列為必選，模型不能替換。

**2. 確定性檢查先跑，資訊不夠就退回。** 送出請求前，先在本機跑規則：必要的審查關卡（例如大型計畫、同一問題失敗兩次以上）直接回「需要審查」，不呼叫模型；缺關鍵背景就退回給 Codex 補資料，信心分數不能代替資訊充分。候選資源的新鮮度、相依與衝突、回應格式和低信心退回也都在本機處理。

**3. 只用標準函式庫，請求範圍收窄。** 執行期只用 Python 標準函式庫，不必安裝套件。端點固定、單次請求、不跟隨重新導向、限制請求和回應大小；工作區設定不能改端點或憑證來源。憑證只放在本機支援的地方，不進 repo、命令參數或聊天。Codex 回報的「已完成」會標成 `caller_reported`，不算獨立驗證。

## 我和 AI 怎麼協作

- 這個 repo 是寫給 Codex 用的，`AGENTS.md` 就是 Codex 在這裡工作的規則：用繁體中文回報、提交前跑兩組離線測試、檢查完整的 staged diff、不追蹤憑證和本機設定、全域安裝要另走審查流程、不 force-push。
- 我把「什麼算證據」分開寫進 README：原始碼測試、App 原生呼叫、CLI 原生呼叫、安裝檢查、完整任務比較是五種不同的主張，一種通過不能拿來代替另一種。
- commit 紀錄只有我的帳號，沒有逐筆標示 AI 共同作者，所以這裡不細分哪一段是 AI 寫的。

## 做到了什麼

- **2026-10-07：匯出到這個 repo。** 包含 4 個執行期模組、不含機密的設定範例、介面契約和 85 個離線回歸測試。匯出時用 Windows 上的 Python 3.12 跑：73 個執行期／回歸測試和 12 個 inventory 測試全部通過，沒有略過，也沒有呼叫 provider。
- **更早的 Codex App 原生整合**：六個工具都有出現，成功呼叫了 status、一次確定性的 `jev_decide` 閘門和結果回報（都沒經過 provider 推論）。
- **2026-10-08：整理作品集時在 Linux（Python 3.13）重跑。** 73 項中 72 項通過、1 項略過（Windows 磁碟機檢查，只在 Windows 上跑）；12 項 inventory 測試全部通過。

## 還沒做到什麼

- **CLI 原生驗收沒過**：在那台機器上，程序還沒啟動就被 Windows sandbox 設定錯誤擋下；這個 repo 沒有修這個環境問題。
- **沒有效益證明**：「只用 Codex」對「Codex 加 Jev」的完整任務比較還沒跑，所以不宣稱更快、更省或品質更好。
- **不含安裝器**：先前針對特定機器的交易式安裝器沒有放進來，全域設定要照 README 自己審查後合併。

## 技術與連結

- **技術**：Python 3.12 標準函式庫、MCP（換行分隔的 JSON-RPC over stdio）、TypeSafe Jev API（`jev-latest`）、Codex CLI／App 設定。
- **授權**：MIT。
- **相關作品**：[Jev 決策實驗室](/projects/jev-systemone-lab/)、[Jev AI 遊戲代理](/projects/jev-ai/)。
- **連結**：[GitHub](https://github.com/monkey1sai/codex-jev-integration)
