---
title: .NET LLM 回歸驗證｜替模型更新設計可比較的驗收報告
subtitle: dotnet-llm-regression-reporting
summary: 為相容 OpenAI 的 LLM API 設計回歸測試與報告系統：能力宣告、不可變基準線、政策閘門和去敏證據。目前只有規格，還沒有程式。
category: design
tags: [llm, regression-testing, dotnet, openspec]
techStack: [OpenSpec, .NET 10 LTS（規劃）, C#（規劃）, OpenTelemetry（選用）, JUnit XML]
cover: /covers/dotnet-llm-regression-reporting.webp
coverAlt: 概念插畫：藍色規格書上放著一把黃銅游標卡尺
status: design
statusLabel: 設計完成・尚未實作
order: 7
updatedAt: 2026-10-08
links:
  - type: docs
    label: 閱讀規格
    url: https://github.com/monkey1sai/dotnet-llm-regression-reporting/tree/main/openspec/changes/design-enterprise-dotnet-regression-reporting
  - type: source
    label: GitHub repo
    url: https://github.com/monkey1sai/dotnet-llm-regression-reporting
---

> 狀態：**架構設計，尚未實作**。repo 裡只有一份可直接套用的 OpenSpec 變更提案，沒有執行程式、端點設定、API 金鑰或推論結果。封面是概念插畫。

## 為什麼做

換模型、換推論伺服器或改參數之後，要怎麼知道品質有沒有退步？難的地方在於：要分得出「模型退步」和「端點掛了」，結果要能重現，要量串流延遲，還要能接 CI，又不能把憑證或正式提示詞寫進報告。而且很多「相容 OpenAI」的伺服器只支援部分 API，不能假設每個路由都存在。

## 怎麼做（規格裡的關鍵決定）

**1. 端點先宣告能力，不靠猜。** 每個端點有一份能力檔，寫明支援 Chat Completions、Responses、Embeddings、串流、結構化輸出或 tool calling 中的哪些；健康檢查通過不代表全部支援。

**2. 執行和判定分開。** 執行只產生觀測結果，另一個純函式的政策引擎拿它和相容的基準線比較。結果有六種：`Passed`、`Warning`、`Failed`、`Inconclusive`、`InfrastructureError`、`Skipped`。**沒有基準線或基準線不相容，永遠不會自動算通過**；新基準線要另外審查才能升級，不能在評估它的同一次執行裡升級。

**3. 效能量測當成受控實驗。** 量測的請求不自動重試，暖機樣本標示並排除；樣本數不夠就不算百分位數，直接標「無法判定」。不用 BenchmarkDotNet 量遠端推論，因為它是為可重複的程式碼微基準設計的。

**4. 一份正本、多種檢視。** 正式證據是 JSON，Markdown 和 HTML 報告從它產生，JUnit XML 給 CI 用；不預設輸出 SARIF，因為 LLM 回歸不是靜態分析問題。寫入前先去敏，報告裡不會出現金鑰。

## 我和 AI 怎麼協作

- 2026-07-22 我提交第一版設計。
- 2026-07-23 的兩筆 commit 標示 Claude Sonnet 5 為共同作者：一筆把共用設定從「Windows 優先」改成跨平台，另一筆加入延伸提案；commit 訊息記載延伸提案是經過多代理研究、方案比稿和對抗式審查（grill-me）產出的。
- `.codex/` 裡有 OpenSpec 的 skill，之後實作可以照 OpenSpec 的 apply 流程，按相依順序完成任務。

## 做到了什麼

- **2026-07-22：主規格完成。** 5 份能力規格（端點能力檔、回歸執行、效能量測、基準線與政策閘門、企業報告），共 31 項需求、41 個情境；另附 45 項實作任務（尚未開始）、設計文件與技術調查紀錄。
- **2026-07-23：延伸提案。** 在同一套設計上加分類路由與生命週期閘門，同樣只是設計。

## 還沒做到什麼

- **沒有任何程式**：目標平台是 .NET 10 LTS，但當時機器上是 .NET 9，規格要求實作前先安裝並固定 .NET 10 SDK，不能悄悄改目標框架。
- **還有待決問題**：先接 GitHub Actions 還是 Azure DevOps、誰能核准或撤銷基準線、提示詞與輸出的資料分級和保存期限、TTFT／吞吐量／錯誤率的最低樣本數和門檻等。
- 這次整理沒有重跑 `openspec validate`。

## 技術與連結

- **規劃技術**：.NET 10 LTS／C#、官方 OpenAI .NET SDK（包在內部 provider 介面後面）、xUnit v3、Microsoft.Extensions.Logging、OpenTelemetry（選用）、JUnit XML。
- **授權**：MIT。
- **入口**：[閱讀規格](https://github.com/monkey1sai/dotnet-llm-regression-reporting/tree/main/openspec/changes/design-enterprise-dotnet-regression-reporting)｜[GitHub repo](https://github.com/monkey1sai/dotnet-llm-regression-reporting)
