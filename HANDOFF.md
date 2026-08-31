# 暗潮 · Void Tide — Agent Handoff

> 最後更新：2026-08-31 · `main` 已含 PR #18（mobile UX P1–P5 + retention）

## Project

| 項目 | 值 |
|------|-----|
| 路徑 | `mobile-rpg-slice/` |
| 技術 | Vanilla HTML/CSS/JS PWA（直向手機） |
| Live | https://alphaleehoho-commits.github.io/bug-free-lamp/ |
| SW cache | `void-tide-pets-v52`（改動後記得 bump `sw.js`） |
| Smoke test | `node mobile-rpg-slice/js/smoke-test.mjs` |

## 剛合併入 main 嘅內容（PR #18）

### 留存／體驗功能（#17 基礎 + 本 PR）
- 已通關秘境快速戰鬥（farm 跳過動畫）
- 下一目標 chip、每日 hub、7 日登入 streak
- 靈寵 SVG icon、`pet-icons.js`
- Push 離線通知（見聞 tab 開啟）
- 重置存檔移至見聞 tab

### Mobile layout Phases 1–5
| Phase | 重點 |
|-------|------|
| **P1** | `wrapStage()` 內 scroll + dock；結算全屏 modal；`visualViewport` → `--app-h` |
| **P2** | 底部 tab bar；精簡 stats／next-goal；秘境條件 bottom sheet；結算獎勵可摺疊 |
| **P3** | 教學 focus（隱藏 stats、可摺 tutorial banner）；sub-nav 橫向 scroll |
| **P4** | 修行材料／產出速率可摺；離線／PWA toast 浮層；PR preview workflow |
| **P5** | 點 stats 開資源 sheet；fold 狀態 sessionStorage；layout smoke 断言 |

### 教學／秘境修復
- 結算期間保留 秘境／戰術 sub-nav
- 戰術步（14/14）鎖 field、強制 setup、`clear-combat-setup` CTA
- `smoke-test.mjs` 含 tactics 導航断言

## 架構速查

```
index.html → js/ui.js (render/bind)
           → js/engine.js (game logic)
           → js/tutorial.js
           → js/data.js, pet-icons.js
css/style.css
sw.js (cache bust)
```

**UI 模式**
- `#app` 固定高度、唔整頁 scroll
- 各 tab 用 `wrapStage(subnav, scroll, dock?)`
- Overlay：`combat-modal-overlay`、`sheet-overlay`、`daily-hub-overlay`、`chrome-toast`

**主要 ui.js 狀態（session）**
- `condSheetOpen`, `rewardDetailsOpen`, `statsSheetOpen`
- `tutorialCollapsed`, `matSectionOpen`, `trainRatesOpen`（後兩個存 `sessionStorage` `void-tide-ui-prefs`）

## 新手教學（12 步核心）

1. 孵化首寵 → 2. 認寵 → 3. 練功 Lv3 → 4. 出戰 → 5–6. 秘境 → 7. 商肆購蛋 → 8. 孵化擴隊 → 9. 靈契（≥45s 掛機）→ 10. 突破 → 11. 繁殖 → 12. 圖鑑

教學相關：`js/tutorial.js` · `syncTutorialNavigation` · `tutorialBannerHtml(state, { collapsed })`

## 部署

- **Production**：push `main` → `.github/workflows/pages.yml` 部署 GitHub Pages
- **PR Preview**：`.github/workflows/pr-preview.yml` 喺 PR 留言貼 preview URL（merge 前試玩）
- Live 可能 lag 1–2 分鐘；Safari 試玩要強刷／清 SW cache

## 開新 agent 建議流程

1. `git fetch origin main && git checkout main && git pull origin main`
2. 開 branch：`cursor/<topic>-50b5`（cloud agent 規則）
3. 改完 bump `sw.js` CACHE 版本
4. 跑 `node mobile-rpg-slice/js/smoke-test.mjs`
5. 手機 Safari 驗：底部 tab、教學 banner 摺疊、秘境進攻 dock、結算 modal CTA

## 建議下一步（未做）

### Gameplay / 留存
- 商肆隨機素材／交換道具
- 每日／長線任務深度
- 離線 cap 與通知節奏調優

### Mobile polish（可選）
- Stats sheet 加圖表／趨勢
- 靈寵列表 compact row
- PWA standalone 模式專用 safe-area 微調
- PR preview 若 CI 失敗：檢查 repo Settings → Pages → preview deployments

### 教學
- 大改教學步數結構（Deferred）
- Late tutorial 進階引導擴充

## 已知注意

- 用戶多數用 **Safari 瀏覽器模式**（非 PWA standalone）測試——以 `visualViewport` + 底部 tab safe-area 為準
- `HANDOFF.md` 舊版寫 v45／PR #14，已過時；以本文件為準

## 相關 PR

- **#18** merged：`cursor/player-experience-improvements-50b5` → `main`
