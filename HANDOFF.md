# 暗潮 · Void Tide — Agent Handoff

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Live: `https://alphaleehoho-commits.github.io/bug-free-lamp/`
- SW cache: `void-tide-pets-v44` (PR #14 pending merge)

## In PR #14 (`cursor/fix-train-pet-tutorial-d7bb`)

### 教學穩定化（合併前補完）
- **train_pet soft-lock**：唔再每 render 強鎖修行；可自由切 修行 ↔ 靈寵 升級
- **syncTutorialNavigation 統一**：只喺離開允許 tab 時拉回；已喺正確 tab 唔強改 sub
- **開局蛋**：20s 倒數 live update + 等蛋期可練功
- **第二枚蛋**：商肆教學蛋 `tutorial_shop`、孵化 20s；`hatch_second` 等蛋期可練功
- **練功步**：開局潮露×3、掛機出料確定性累積、材料 chip live update
- **靈契步**：掛機門檻 90s → **45s**，banner 顯示剩餘秒數
- **heal**：卡住存檔補潮露／縮短教學蛋

### 新手 12 步（核心）
1. 孵化首寵 → 2. 認寵 → 3. 練功 Lv3 → 4. 出戰 → 5–6. 秘境 → 7. 商肆購蛋 → 8. 孵化擴隊 → 9. 靈契（≥45s 掛機）→ 10. 突破 → 11. 繁殖 → 12. 圖鑑

### 寵物蛋（常駐）
- Tiers C/B/A：潮霧蛋 2 分／暗潮蛋 8 分／心核蛋 30 分（教學蛋 20s）
- 商肆每日蛋；派遣 `eggChance`

## On main (pre-#14)

- PR #13: starter egg timer fix (v42)
- PR #12: eggs + tutorial rewrite + shop/dispatch eggs (v41)

## Deferred

- 商肆隨機素材／交換道具
- 大改教學步數結構
