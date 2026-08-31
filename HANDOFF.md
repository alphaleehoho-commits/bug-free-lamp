# 暗潮 · Void Tide — Agent Handoff

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Live: `https://alphaleehoho-commits.github.io/bug-free-lamp/`
- SW cache: `void-tide-pets-v46`

## 最新：暫停教學 · 進度解鎖（`cursor/pause-tutorial-progression-d7bb`）

### Phase 0 — 教學軟關閉
- `TUTORIAL_ENABLED = false`：無 banner／spotlight／tab 教學鎖
- `normalizeTutorial()` 將所有存檔標記 `done: true`
- `tutorial.js` 全檔保留；`tutorial-v2.js` 預留 read→nav→act 狀態機（`TUTORIAL_V2_ENABLED=false`）

### Phase 1 — `progression.js` 里程碑解鎖
| 里程碑 | 解鎖 |
|--------|------|
| 開局 | 修行·練功、靈寵·牧場 |
| 領取首寵 | 靈寵·出戰 |
| 首寵 Lv≥3 或已派出 | 秘境 |
| 通關 tide_1 | 商肆、廢墟練功地 |
| 擁有 2 寵 | 繁殖 |
| realm ≥ 1 | 修行·進階 |
| tide_2 或 realm ≥ 2 | 派遣 |
| realm ≥ 2 | 圖鑑、秘境·戰術 |

- `pollProgressionUnlocks` + unlock toast；鎖定 tab 顯示 🔒 + tooltip
- `healProgressionAnnouncements` 避免舊存檔連彈提示

### Phase 2–3 — 平衡與內容
- C 蛋 90s；潮岸潮露略升
- 商肆隨機素材（`kind: mat`）+ 產地 hint
- 派遣蛋線機率微調

詳見 `mobile-rpg-slice/balance-notes.md`

## 先前已合併

- PR #13–#15：開局蛋 20s、教學穩定化、牧場預設 sub 等

## Deferred

- Phase 4：接回 `tutorial-v2.js` UI（自動轉 tab + 單一 spotlight）
- 大改教學步數結構（舊 12 步僅作參考）
