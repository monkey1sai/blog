---
title: 常山龍膽｜用 AI 協作打造趙雲題材 3D 動作遊戲
subtitle: changshan-longdan
summary: 在瀏覽器裡玩的 PS2 風格一騎當千：趙雲單騎對上三百名魏兵。程式碼由 AI 撰寫，趙雲模型由我提供，驗收由我把關。
category: game
tags: [browser-game, threejs, webgl, web-audio, voxel, ai-collaboration]
techStack: [TypeScript, Three.js, WebAudio, Vite, Vitest, Blender]
cover: /covers/changshan-longdan.webp
coverAlt: 《常山龍膽》實際遊戲畫面：趙雲在魏軍陣中連擊，畫面顯示「龍膽 就緒」與 113 HITS
status: live
statusLabel: 已公開試玩
order: 1
updatedAt: 2026-10-08
links:
  - type: demo
    label: 在 itch.io 試玩
    url: https://monkey1sai.itch.io/changshan-longdan
  - type: source
    label: GitHub 原始碼
    url: https://github.com/monkey1sai/changshan-longdan
  - type: video
    label: Jev AI 試玩影片（開發版）
    url: https://www.youtube.com/watch?v=et0EX2SsT9k
featured: true
featuredOrder: 1
---

> 狀態：**已公開試玩**（itch.io，免費，可自由贊助）。原始碼 2026-10-08 起以 MIT 授權公開。建議用電腦版 Chrome、Edge 或 Firefox，搭配鍵盤或手把；目前沒有觸控操作。

上方封面和下面兩張都是 itch.io 商店頁上的真實遊戲截圖，不是概念圖。

## 問題

這個專案要回答的問題是：一騎當千這種要同時處理大量敵兵、又很吃打擊感的動作遊戲，能不能不用安裝、直接在瀏覽器裡跑，而且程式碼主要交給 AI 寫，由我負責方向、素材和驗收。

它後來也變成兩個專案的測試場：[Jev AI 遊戲代理](/projects/jev-ai/) 拿它來練自動遊玩，[mmo-asset-pipeline](/projects/mmo-asset-pipeline/) 的第一批美術需求也來自這裡。

## 我的選擇

**1. 戰鬥規則和畫面分開。** `src/combat/`、`src/entities/` 只放純邏輯（招式判定窗、連段規則、敵兵 AI、勝敗），不碰 DOM 和 WebGL，所以能用 Vitest 測。打擊手感集中在 `presentation.ts`：它把戰鬥事件轉成音效、火花、鏡頭震動和 HUD 橫幅，調手感時不用動到規則。

**2. 三百個敵兵要跑得動，也要看得懂。** 敵兵用 SoA typed arrays 存狀態，配空間格網。同場有 300 名魏兵，但用「攻擊令牌」限制同時最多 4 人出手；要出招的敵兵腳下亮金色圈，隊長是紅色圈，玩家才看得出誰要打過來。

**3. 聲音不用音檔。** 揮擊、命中、碎裂、銅鑼、龍吟和戰鼓配樂都由 WebAudio 即時合成。畫面吃力時自動降低渲染解析度。

**4. 主角用真模型，其他維持體素。** 趙雲是我提供的 Blender 蒙皮模型（GLB，含骨架與貼圖），動作由既有招式時間和程序式姿勢驅動；敵兵、城池和青龍維持程序生成的體素外觀。模型載不到時會退回體素版本，但驗收規則寫明「回退模型不算通過」。

<figure>
  <img src="/images/projects/changshan-longdan-dragon.webp" alt="龍膽亂舞・蒼龍破陣：青龍繞著趙雲盤旋，畫面顯示 134 HITS" width="1280" height="720" loading="lazy" decoding="async" />
  <figcaption>大招「龍膽亂舞・蒼龍破陣」。itch.io 商店頁截圖。</figcaption>
</figure>

- **網頁版本體**：Vite、TypeScript、Three.js（HDR 後製：景深、bloom、ACES 色調映射）、WebAudio、Vitest；兩節骨骼 IK；支援鍵盤、滑鼠與 Xbox／PlayStation 手把；介面可即時切換繁體中文／English。
- **美術**：趙雲為使用者提供的 Blender 蒙皮模型，其餘為程序生成體素。

## AI 協作

- **程式碼由 AI 撰寫。** repo 的 191 筆 commit 中，有 52 筆標示 Claude Fable 5.1、54 筆標示 Claude Opus 5.5 為共同作者；趙雲整合、上架紀錄等工作則在 `codex/` 分支開 PR 合併。itch.io 頁面也照實勾選「AI Generated Code」。
- **素材由我提供。** 趙雲的 Blender 蒙皮模型是我給的，來源和雜湊記在 `public/models/zhaoyun.manifest.json`。
- **驗收由我把關。** repo 規則寫明「測試通過不等於視覺驗收」：手感和畫面必須在看得見的瀏覽器裡確認，背景分頁的腳本結果只能當輔助。2026-10-02 那一輪，我的指示是「由我人工審查，你先做驗證再給我審查」，所以 AI 交的是證據和交接文件，不是自己宣布通過。
- **整理出可重用的流程。** `scripts/verify-player-animation.mjs` 用真實鍵盤、滑鼠在可見 Chrome 裡錄影，輸出 WebM、截圖和 console 紀錄；`npm run package:itch` 打包前會先檢查 itch.io 的 HTML5 限制。這兩支腳本之後可以沿用到別的瀏覽器遊戲。

## 成果與證據

- **2026-09-29：首次公開上架 itch.io。** 用可見 Chrome 在公開頁實際按 Run game、切換英文、出陣，用鍵盤普攻、蓄力、暫停；console error 為 0。伺服器上的 ZIP 下載回來比對 SHA-256，和本機成品一致。
- **2026-10-02：趙雲模型版本上架。** 在公開站實際出陣、放龍膽、自然死亡後重試，console warn／error 為 0；那一局結算是 37 KOs、Max Combo 173（單局紀錄，不是平衡數據）。上傳後同樣重新下載核對雜湊。
- **2026-10-08：整理作品集時重跑 `npm test`。** 35 個測試檔、308 項全部通過。這只代表純邏輯的單元測試，不代表手感或畫面驗收。

<figure>
  <img src="/images/projects/changshan-longdan-title.webp" alt="《常山龍膽》標題畫面：出陣按鈕與鍵盤、手把操作表" width="1280" height="720" loading="lazy" decoding="async" />
  <figcaption>標題畫面與操作說明。itch.io 商店頁截圖。</figcaption>
</figure>

- **授權**：原始碼 MIT；隨附 Three.js 的 MIT 授權全文（`THIRD_PARTY_LICENSES.txt`）。
- **連結**：[itch.io 試玩](https://monkey1sai.itch.io/changshan-longdan)｜[GitHub](https://github.com/monkey1sai/changshan-longdan)｜[Jev AI 試玩影片](https://www.youtube.com/watch?v=et0EX2SsT9k)

## 卡關與限制

- **手機不能玩。** 沒有觸控操作，itch.io 也沒勾 Mobile friendly。
- **有幾項還不能算通過。** 2026-10-02 上架時依我的指示跳過了剩下的 P0 缺口：近牆時鏡頭遮擋、音效聽感、實體手把、低階硬體和長時間穩定性都還沒驗收。依當時紀錄，四種難度的公平性、隊長 HUD、自然勝敗與重試等合併門檻也還在待驗清單上。
- **Unity 移植只是實驗。** `unity/` 從 2026-10-03 開始分階段驗證，還沒有可玩的發布版本。
- **這次整理沒有重新試玩。** 上面的遊玩紀錄來自當時的上架驗證。
