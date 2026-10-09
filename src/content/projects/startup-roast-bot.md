---
title: Startup Roast Bot
summary: 毒舌點評新創點子的 Telegram AI bot：拆解想法、分析市場，還會建議轉型方向。
category: ai-agent
tags: [telegram-bot, llm, python]
techStack: [Python, Telegram Bot API, LLM]
status: development
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/startup-roast-bot
---

Startup Roast Bot 是一個小品 Telegram bot：丟一個新創點子給它，它會用毒舌但有結構的方式點評。

## 我的選擇

只用 Python 標準函式庫，透過 Telegram Bot API 長輪詢運作，LLM 後端可替換。

## 成果與證據

- `/roast`：拆解你的新創點子。
- `/roastmore`：更深入的市場分析。
- `/pivotme`：提出三個更容易募資的相鄰點子。
- `/comparps`：列出三家做類似事情的真實公司。
