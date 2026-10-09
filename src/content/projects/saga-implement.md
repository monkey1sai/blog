---
title: SAGA-implement（sglangRAG）
summary: 以 SGLang 推論引擎搭配 RAG 檢索增強的 LLM 聊天系統，支援即時串流回覆。
category: tool
tags: [rag, llm, sglang, websocket]
techStack: [Python, SGLang, FastAPI, React, Docker]
status: development
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/SAGA-implement
---

sglangRAG 是一套結合高效能 LLM 推論與檢索增強（RAG）的聊天系統。

## 我的選擇

- **SGLang 推論**：利用 RadixAttention 與 continuous batching 提升推論效率。
- **混合檢索**：Dense、Sparse 檢索搭配重排序，提升回答品質。
- **即時串流**：透過 WebSocket 串流回覆。
- **模組化**：RAG 模組可獨立安裝、移植到其他專案。
