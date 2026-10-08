---
title: ADK Agents｜讓本地模型串接工具與知識庫
subtitle: adk-agents
summary: 讓本機 Ollama 上的 Qwen 2.5 7B 透過 LiteLLM Proxy 呼叫工具、查詢知識庫，並記下小模型做 Tool Calling 時踩到的坑和解法。
category: ai-agent
tags: [ai-agent, ollama, litellm, tool-calling, rag]
techStack: [Python, Google ADK, OpenAI Agents SDK, LiteLLM Proxy, Ollama, ChromaDB, Docker Compose]
cover: /covers/adk-agents.webp
coverAlt: 概念插畫：工具箱和書架以管線接到中間的黃銅機器
status: prototype
statusLabel: 整合原型
order: 4
updatedAt: 2026-10-08
links:
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/adk-agents
---

> 狀態：**整合原型**。流程在我的開發環境跑通過，repo 裡沒有記錄測試數字或穩定度統計。封面是概念插畫。

## 為什麼做

本機的小模型（這裡是 Qwen 2.5 7B）做 Tool Calling 時，常常吐出格式不對的 JSON，代理框架就接不下去。我想知道：不靠雲端大模型，能不能讓本地模型穩定地「提問 → 呼叫工具 → 拿到資料 → 回答」。

## 怎麼做

**1. 讓小模型好答題。** 工具參數攤平，不用 Pydantic 巢狀結構；`temperature` 設 0。

**2. 繞開轉換層的格式問題。** LiteLLM 設定用 `openai/` 前綴加 `/v1` 路徑，強制走 OpenAI 協定，避開 LiteLLM 原生 Ollama 轉換層；再給一個假的 `OPENAI_API_KEY` 通過 LiteLLM 的內部檢查。

**3. 模型答錯格式時，程式接手救援。** 2025-11-28 加了一道手動救援：模型沒有正常發出工具呼叫、而是直接輸出原始 JSON 時，程式攔下來，代為執行 `search_knowledge_base`，再把結果餵回模型。

**4. 框架可替換。** `AgentFactory` 後面有兩個 provider：Google ADK（`google-adk`），以及 `agents` SDK（requirements 裡是 `openai-agents` 套件，repo 內稱為 Microsoft provider）。工具用依賴注入放進代理；RAG 用 ports／adapters 分層，目前接 ChromaDB。

## 我和 AI 怎麼協作

- repo 裡留下的 AI 紀錄是 `.github/copilot-instructions.md`：我把踩坑得到的規則寫成 Copilot 要遵守的開發模式，例如「工具定義必須用扁平參數」「LitellmModel 一定要加 `openai/` 前綴」。
- commit 沒有逐筆標示 AI 共同作者，所以這裡不細分哪一段是 AI 寫的。commit 紀錄本身是一份逐步的實驗日誌：先直連 Ollama，再改 OpenAI 協定直連，再經 LiteLLM Proxy，再 Docker 化，最後加上 Google ADK 和 RAG。

## 做到了什麼

- **2025-11-25**：代理透過 LiteLLM Proxy 呼叫本機模型，完成工具呼叫。
- **2025-11-27**：兩種 SDK 都能透過 LiteLLM Proxy 呼叫 function tools；RAG 知識庫查詢跑通。
- **2025-12-02**：修正因模型幻覺和提示詞限制造成的檢索失敗，加上 RAG 的單元與端對端測試（ChromaDB repository、retriever、e2e）。

## 還沒做到什麼

- **沒有量化結果**：repo 沒記錄測試通過數、工具呼叫成功率或延遲，所以不能說「穩定」到什麼程度。這次整理也沒有重跑（需要本機 Ollama 和 Docker）。
- **只試過一個模型**：Qwen 2.5 7B。
- **還沒有展示錄影**：之後想補一段「提問 → 工具呼叫 → 取得資料 → 回答」的短片。

## 技術與連結

- **技術**：Python、Google ADK、OpenAI Agents SDK（`openai-agents`）、LangChain（Ollama 範例）、LiteLLM Proxy（Docker）、Ollama、Qwen 2.5:7b、ChromaDB、pydantic-settings；Windows 和 Linux 各一份 Docker Compose。
- **授權**：MIT。
- **連結**：[GitHub](https://github.com/monkey1sai/adk-agents)
