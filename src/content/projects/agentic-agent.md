---
title: Agentic Agent｜把教師模型軌跡變成小模型訓練流程
subtitle: agentic-agent
summary: 把教師模型的輸出轉成 JSONL 訓練資料，在 Gemma 4 E4B 上做壓在 8GB VRAM 內的 QLoRA 微調，再比較 base／teacher／student。目前驗證到 smoke 訓練。
category: research
tags: [llm-training, qlora, gemma, python]
techStack: [Python, QLoRA, Gemma 4 E4B, JSONL, WSL2, Docker]
cover: /covers/agentic-agent.webp
coverAlt: 概念插畫：大燈籠的光流向一盞小燈籠
status: prototype
statusLabel: 訓練流程原型
order: 6
updatedAt: 2026-10-08
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/agentic-agent
---

> 狀態：**訓練流程原型**。smoke 訓練已跑通；正式訓練和 teacher／student 比較報告還沒有產出，所以**不代表小模型能力已經提升**。封面是概念插畫。

## 問題

想用大模型（teacher）的解題軌跡，訓練一個在個人顯示卡上就跑得動的小模型（student），先從寫程式的任務開始。這個 repo 先把整條流程搭起來：資料怎麼來、怎麼切、怎麼訓練、怎麼比。

## 我的選擇

**1. 資料先有格式約束。** 教師輸出和訓練樣本各有一份 JSON Schema（`teacher_response.schema.json`、`agentic_sample.schema.json`），轉出來的 SFT 資料統一是 `sample_id／messages／metadata`，再切成 train／valid／test。

**2. 訓練設定保守，先求跑得起來。** 目標模型 `google/gemma-4-E4B-it`，4-bit QLoRA，設定刻意壓在 8GB VRAM 內。smoke 設定和正式設定分開；訓練前可以 `--dry-run` 先檢查設定和相依套件。

**3. 用同一套評測比三方。** `eval_runner.py` 和 `student_inference.py` 用同一批 benchmark 比較 base、teacher、student 的輸出。

- **技術**：Python、QLoRA、Gemma 4 E4B（`google/gemma-4-E4B-it`）、JSONL SFT 資料管線、WSL2／Docker。

## AI 協作

- repo 的 `AGENTS.md` 是寫給 coding agent 的 GitNexus 規則：改任何函式前先做影響分析、提交前確認只動到預期的符號和流程；也列出 Claude Code 對應的 skill。
- 3 筆 commit 都沒有逐筆標示 AI 共同作者，所以這裡不細分哪一段是 AI 寫的。

## 成果與證據

- **2026-04-10 建立流程**：8 個寫程式任務 → 8 筆 SFT 樣本（由 mock teacher 產生）；切分 train／valid／test；benchmark 腳本在 2 筆範例預測上跑通；訓練入口 dry-run 通過。
- **smoke 訓練已成功驗證**（README 紀錄），正式訓練設定已針對 8GB VRAM 收斂。
- 附 WSL2、Windows、Docker 三種環境的安裝文件。

- **授權**：MIT。
- **連結**：[GitHub](https://github.com/monkey1sai/agentic-agent)

## 卡關與限制

- **資料大多是 mock teacher**，還沒大量接真實 teacher API。
- **沒有正式訓練結果，也沒有比較報告**：`reports/comparison_results.json` 還沒產生。
- **benchmark 太依賴字串比對**，下一版要改成可執行的測試。

## 下一步

- 下一版（v0.1.1）的計畫寫在 `tasks/v0.1.1-plan.md`：穩定正式訓練、強化 benchmark、降低 mock 資料比例、固定輸出比較報告。
