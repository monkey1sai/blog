---
title: 灰燼之冠｜用 AI 協作與版本審查推進互動奇幻故事
subtitle: Ashen-Crown
summary: 把世界觀、人物選擇、分鏡與修訂紀錄一起留下來。透過 AI 協作和編輯審查，持續修整一部創作中的互動奇幻故事。
readerGuide:
  takeaway: 不只展示故事工作稿，也公開角色、分鏡與編輯意見如何互相校正。
  contribution: 我提出審查方向，讓故事、人物與分鏡接受回饋；修改仍交回創作流程決定，不把 AI 評價當成定稿。
  evidence: 公開 repo 可讀故事、設定與分鏡；2026-10-27 第二輪審查涵蓋 38 篇實演主線，審查 PR 是回饋，不是作品已完成的證明。
category: research
tags: [ai-collaboration, interactive-fiction, storytelling, version-control]
techStack: [Markdown, Git, GitHub]
cover: /covers/ashen-crown.svg
coverAlt: 灰燼之冠文字封面，以暖紙底、細線圓環與標題呈現；非遊戲畫面
status: development
statusLabel: 創作中・互動敘事工作稿
order: 16
updatedAt: 2026-10-27
links:
  - type: docs
    label: 閱讀公開故事與分鏡
    url: https://github.com/monkey1sai/Ashen-Crown
  - type: docs
    label: 第二輪審查 PR
    url: https://github.com/monkey1sai/Ashen-Crown/pull/2
---

《灰燼之冠》是一個原創奇幻遊戲故事專案，目前以互動敘事工作稿持續創作。故事從無冠者在灰燼王座廢墟醒來展開，把記憶的代價、人物的願望與選擇造成的後果放在一起。

這裡展示的是**創作與修訂的過程**，不是已完成的長篇小說，也不是可以下載遊玩的遊戲。

## 問題

長篇故事逐篇成長時，角色知道的事情、世界規則和分鏡可能各自走到不同版本。一段台詞即使動人，也需要放回整條因果裡，檢查人物是否真的有自己的選擇。

## 我的選擇

- **把設定與場景分開保存**：世界觀和角色放在 `bible.md`，每篇故事保留 Adventure、Background／Beat、Character 的工作結構。
- **故事與分鏡對照**：`daily/` 和 `storyboard/` 使用對應篇號，讓台詞、動作與呈現方式可以一起審查。
- **留下修訂理由**：摘要、創作實驗與修訂紀錄各有位置，避免只看到最新文字，卻不知道上一輪改了什麼。

## AI 協作

我把目前的故事、人物與分鏡交給 AI 審查，並要求以嚴格的文學標準提出回饋。第二輪再對照前次意見，區分已改善的問題、仍存在的矛盾，以及可以保留的風格選擇。

回饋以 PR 交回創作流程審閱。AI 可以協助找出文字與因果的落差，但評論本身不等於作者同意，也不會自動變成定稿。

## 成果與證據

以 **2026-10-27、版本 `1b8c075`** 為案例快照：公開 repo 包含 day-000 至 day-037 共 38 篇故事工作稿，以及自 day-003 起的對應文字分鏡。

可以從同一段故事看三種資料：

- [第 37 篇故事與選項](https://github.com/monkey1sai/Ashen-Crown/blob/1b8c07568babe44f1dc89cbaf74ff499434f2a99/daily/day-037.md)：主角保留自己的願望，家屬卻提出「那我們家，替你要的付」。
- [第 37 篇文字分鏡](https://github.com/monkey1sai/Ashen-Crown/blob/1b8c07568babe44f1dc89cbaf74ff499434f2a99/storyboard/day-037.md)：把同一場景拆成可討論的演出安排；這是工作稿，不代表動畫已完成。
- [第二輪審查 PR](https://github.com/monkey1sai/Ashen-Crown/pull/2)：針對母親是否真正擁有決定權、角色語聲、正文與分鏡同步，以及時間因果提出修改建議。這是待創作者審閱的回饋，不是已採納的修改對照。

## 卡關與限制

- 故事仍在創作中；38 篇是這次快照的篇數，不代表長篇已完稿。
- 工作稿同時包含場景、選項、狀態與製作註記，尚不能直接當成一般讀者的連續閱讀版。
- 第二輪審查讀完 38 篇實演主線，完整覆核前段 17 份文字分鏡，後段抽查；沒有完成所有分支組合或全部分鏡的演出驗證。
- 目前展示文字與版本紀錄，不提供虛構的遊戲截圖、完成動畫或可玩版本。

## 下一步

先由創作者審閱回饋，再決定如何同步正文、分鏡與選項。後續值得補上的證據，是一個確實採納的修改前後對照，以及能連續閱讀的場景版本。
