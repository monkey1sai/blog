---
title: AURORA MCP · 極光創作室
summary: 為 AURORA 加上 MCP server，讓 AI 用戶端可以作曲、設計音效並匯出 WAV。
category: tool
tags: [mcp, ai-agent, web-audio, music-generation]
techStack: [MCP, Node.js, Web Audio API, Cloudflare Workers]
status: development
order: 10
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/aurora-mcp
---

AURORA MCP 以 [AURORA 極光](/projects/aurora/) 合成器為基礎，加上標準的 Model Context Protocol（MCP）server，讓支援 MCP 的 AI 用戶端能直接「動手」做音樂。

## 我的選擇

- **MCP server**：支援 stdio 與本機 HTTP 兩種接法。
- **創作模型**：用五個面向描述音樂與音效，方便 AI 依需求調整。
- **編輯與輸出**：可編修樂曲與音效，並匯出 WAV 音檔。

## 卡關與限制

- **Cloudflare Workers 版本**：仍在實驗，雲端渲染目前需要人工按下渲染按鈕，還不是全自動流程。

本專案 fork 自上游 AURORA 合成器並加上 MCP 功能；使用方式與目前狀態請以 repo 的 README 為準。
