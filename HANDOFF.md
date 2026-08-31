# 暗潮 · Void Tide — Agent Handoff

> 最後更新：2026-08-31  
> **上線路線：** 兩週計劃 · 本文件俾 **Week A agent** · Week B 由**另一個 agent** 負責

---

## 俾下一位 agent 嘅一句話

**你只負責 Week A（3 個 gameplay 功能）。唔好做 Week B。**  
做完 merge `main`、更新本文件「Week A 完成狀態」、再開 PR。

---

## 分工是否合理？

**合理。** 建議咁拆：

| Agent | 範圍 | 原因 |
|-------|------|------|
| **Agent 1 → Week A** | 掃蕩 + 每日全清獎 + 任務 UI | 同一條「daily/combat loop」，改 `engine.js` + `ui.js`，可一個 PR 驗收 |
| **Agent 2 → Week B** | 隊伍預設、圖鑑 tier、本週 pity、遠征、上線 polish | 依賴 Week A 已 merge；系統較散，適合第二個 context |

**交接規則**
1. Week A agent **必須 merge 入 `main`** 先至開 Week B agent  
2. Week B agent 開工前：`git pull origin main`，讀本文件「Week A 完成狀態」  
3. 唔好兩個 agent 同時改同一 branch  

---

## Project 基礎

| 項目 | 值 |
|------|-----|
| 路徑 | `mobile-rpg-slice/` |
| Stack | Vanilla HTML/CSS/JS PWA（直向手機） |
| Live | https://alphaleehoho-commits.github.io/bug-free-lamp/ |
| SW cache | `void-tide-pets-v52`（任何改動後 bump `sw.js`） |
| Smoke test | `node mobile-rpg-slice/js/smoke-test.mjs` |
| 用戶測試環境 | iPhone **Safari 瀏覽器**（非 PWA standalone 為主） |

### 已完成（唔使重做）

- Mobile shell P1–P5（底部 tab、scroll/dock、結算 modal、教學 focus…）— PR #18 已 merge  
- 留存：daily hub、7 日 streak、next-goal、快速戰鬥（**單次** skip 動畫）、離線、push 權限  
- 教學 12 步 + 戰術 14/14 修復  

### 架構

```
ui.js      → render / bind / playback
engine.js  → runDungeon, dailyView, claimDaily, tickCultivation…
data.js    → DAILY_QUESTS, dungeons, species…
tutorial.js
```

---

# Week A — 本 agent 嘅全部工作

**目標：** 令 idle 玩家唔使每層手動撳進攻；每日任務有「全清獎」同完整列表。  
**預期產出：** 1 個 PR merge 入 `main` · SW bump · smoke test 過 · Safari 可試

---

## A1. 秘境掃蕩（Sweep / 連刷）

### 問題
已通關層而家仍要：撳進攻 → 睇/跳過戰報 → 再撳。Fast mode 只加速**單次**動畫，唔係 batch。

### 要做
- 對**已通關**且無 CD 嘅層，允許選擇 **連刷 N 次**（例如 1 / 5 / 10 / 20，或 stamina 式上限）
- 重用現有 `runDungeon()` + `isFarmCombat` / fast 邏輯；**唔好重寫戰鬥**
- **Batch 結算 UI**：一次 modal 顯示合計靈石／材料／勝負次數；可摺單次明细（可選）
- 教學期間：可禁用或限制 N（避免 tutorial step 混亂）
- Bond encounter：定好規則（例如掃蕩只觸發 1 次 encounter，或累積到待契 — 寫進 PR description）

### 建議改動位置
- `engine.js`：`runDungeon` 或新 `runDungeonSweep(state, id, count)`  
- `ui.js`：秘境 `stage-dock` 加 sweep 控制；batch 結算可延伸 `combatModalHtml` 或新 overlay  
- `css/style.css`：sweep 控件  
- `smoke-test.mjs`：至少断言 sweep 函數存在 / 已通關層可 sweep  

### 驗收
- [ ] 已通關層：選 10 次 → 一次結算，唔使睇 10 次戰報  
- [ ] 未通關 / CD 中 / 教學鎖定：sweep 不可用  
- [ ] Smoke test pass  

---

## A2. 每日全清獎 + 一鍵領取

### 問題
`DAILY_QUESTS` 有 7 個（`data.js`），但 hub／任務 UI 無「全清 bonus」；領獎要逐個撳。

### 要做
- **一鍵領取**：daily hub 或 圖鑑→任務 加「領取全部可領」  
- **全清獎**：7 個 daily 今日全部 `claimed` → 可開 **bonus 箱**（建議：潮霧蛋 / 催生符 / 靈石，寫入 `data.js` 常數）  
- 每日只可領一次全清獎；存 `state.dailyMeta` 或類似欄位  
- Hub 顯示進度：`5/7` + 全清獎狀態  

### 建議改動位置
- `data.js`：`DAILY_ALL_CLEAR_BONUS` 或放 `engine.js`  
- `engine.js`：`claimAllDailies(state)`、`claimDailyAllClear(state)`、`dailyAllClearView(state)`  
- `ui.js`：`dailyHubHtml()`、`codexPanel` tasks 區  
- `smoke-test.mjs`：全清邏輯单元测试  

### 驗收
- [ ] 7/7 領完 → 出現全清獎按鈕 → 領取後 state 正確  
- [ ] 一鍵領只領 `done && !claimed`  
- [ ] Smoke test pass  

---

## A3. 任務 UI 做全（唔再 truncate）

### 問題
`codexPanel` → 任務 sub：`dailyView` / `achievementsView` 用 `.slice(0, 3)`，玩家睇唔晒任務。

### 要做
- 顯示**全部** daily（7）、achievement（`ACHIEVEMENTS` 全表或分「進行中／已完成」）  
- `breedGoalsBoardHtml` 已存在 — 保持  
- 用現有 `stage-scroll` 滾動，唔使新 tab  
- 可選：進行中任務排前  

### 建議改動位置
- `ui.js`：`codexPanel()` tasks 分支 — 搜 `slice(0, 3)` 移除  

### 驗收
- [ ] 圖鑑→任務 見到 7 個每日 + 完整成就列表（scroll）  
- [ ] 與 A2 一鍵領 / 全清獎 UI 一致  

---

## Week A — Git / PR 流程

```bash
git fetch origin main && git checkout main && git pull origin main
git checkout -b cursor/week-a-gameplay-sweep-daily-50b5
# … implement A1 A2 A3 …
node mobile-rpg-slice/js/smoke-test.mjs
# bump sw.js CACHE
git push -u origin cursor/week-a-gameplay-sweep-daily-50b5
# 開 PR → main，body 寫清 A1/A2/A3 驗收
# merge 後更新下方「Week A 完成狀態」
```

---

## Week A 完成狀態（Week A agent merge 後填寫）

| 項目 | 狀態 | PR | 備註 |
|------|------|-----|------|
| A1 掃蕩 | ⬜ 未做 | | |
| A2 每日全清 + 一鍵領 | ⬜ 未做 | | |
| A3 任務 UI 全量 | ⬜ 未做 | | |
| SW 版本 | v52 | | merge 後更新 |

---

# Week B — 唔係本 agent 嘅範圍

**開 Week B agent 前：** Week A 必須已 merge，`git pull origin main`。

| 項目 | 內容 |
|------|------|
| B1 | 隊伍預設 2–3 套（應對秘境 daily 條件） |
| B2 | 圖鑑 tier 徽章 + 里程碑慶祝（20/80/200） |
| B3 | 本週焦點雜交 + soft pity |
| B4 | 戰鬥遠征（dispatch v2，離線刷已通關層） |
| B5 | SW 背景通知強化 |
| B6 | 平衡 pass + 上線 checklist（manifest、分享、首屏） |

Week B agent 應另開 branch：`cursor/week-b-gameplay-polish-50b5`

---

## 產品目標（兩週上線）

- **Week A 後：** 核心 loop 順（掃蕩 + 每日習慣）→ 可俾小範圍試玩  
- **Week B 後：** 中期目標 + polish → **對外 soft launch**  

真實玩家驗收（Week A 後即可測）：
1. 新號 45 分鐘內過教學 + 首通秘境  
2. 第 2 日：streak + daily 全清或接近全清 ≤3 分鐘操作  
3. 已通關層 farm：≤3 次 tap 完成 10 連刷  

---

## 已知注意

- 裝備／鍛造已廢止（`engine.js`），Week A/B 都唔好復活除非用戶指定  
- `combatPrefs.fastMode` 在 `localStorage`；sweep 係新 flow，唔好同 fast 混淆 UX  
- PR preview：`.github/workflows/pr-preview.yml` 會喺 PR 留言 preview URL  

## 歷史 PR

- **#18** merged — mobile UX P1–P5 + retention baseline  
