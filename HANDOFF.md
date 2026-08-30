# 暗潮 · Void Tide — Agent Handoff

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Live: `https://alphaleehoho-commits.github.io/bug-free-lamp/`
- SW cache: `void-tide-pets-v41` (pending merge)

## In PR (cursor/eggs-tutorial-dispatch-d7bb)

### 寵物蛋（常駐）
- Tiers C/B/A：潮霧蛋 2 分／暗潮蛋 8 分／心核蛋 30 分
- `state.eggs`、開始孵化／領取；牧場 UI 顯示蛋欄
- 開局改為**潮霧蛋**（非直接送寵）；開局潮露×1

### 新手引導重設（約 10–15 分／12 步）
1. 孵化首寵 → 2. 認寵（點詳情）→ 3. 練功升 **Lv3** → 4. 出戰 → 5–6. 秘境 → 7. 商肆購蛋 → 8. 孵化擴隊 → 9. 靈契（需掛機 ≥90s）→ 10. 突破 → 11. 繁殖 → 12. 圖鑑
- 修：唔再 render 自動跳步；高亮對準詳情／升級／出戰／孵化；spotlight scroll+rAF

### 商肆
- 每日至少 1 蛋；教學賣 C 蛋（35 石）
- **留後**：隨機素材、交換道具（kind 預留）

### 派遣
- 新任務：潮岸拾蛋、廢墟巢穴、深層孵巢、心核拾遺（練功地解鎖）
- 多數任務加 `eggChance`

## On main

- Tutorial highlight/deploy fix + train site deepen + daily dungeon variety (v40)
