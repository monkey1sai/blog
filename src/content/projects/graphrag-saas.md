---
title: graphrag_saas
summary: 可部署的 GraphRAG 後端：文件與圖片 OCR 匯入、階層式檢索、評測與訓練流程。
category: tool
tags: [rag, llm, fastapi, ocr]
techStack: [Python, FastAPI, Docker, OCR]
status: development
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/graphrag_saas
---

graphrag_saas 是一個以 FastAPI 建構的 GraphRAG 後端實驗專案。

## 作品重點

- **資料匯入**：從資料夾匯入 DOCX、PDF、XLSX 與圖片（OCR），切塊後建立索引。
- **查詢 API**：以階層式檢索搭配整合器組合回答。
- **評測**：自動產生題目並輸出評估報告。
- **訓練**：提供最小可跑的 SFT／RL 與 rejection sampling 流程。
