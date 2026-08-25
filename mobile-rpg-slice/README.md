# 暗潮 · Void Tide

豎屏可玩垂直切片：文字修仙掛機 + 地下城堡式組隊地牢。

## 已鎖定選型

| 項 | 決定 | 原因 |
|----|------|------|
| 玩法 | **混合**：修煉掛機 → 突破奇遇 + 三人隊伍進本掉落 | 同時覆蓋「文字修仙」與「地下城堡2」核心循環 |
| 技術棧 | **Web PWA**（純 HTML/CSS/JS） | 手機瀏覽器即玩、可加主畫面；唔使 3D 引擎 |
| 主參考 | [Milec/The-Nine-Heavens](https://github.com/Milec/The-Nine-Heavens) | mobile-first PWA + 修仙數值骨架 |
| 輔助參考 | [OpenIdle-Engine](https://github.com/simonfruehauf/OpenIdle-Engine)、[godot-open-rpg](https://github.com/GDquest/godot-open-rpg) | data-driven 掛機；回合戰鬥概念 |

之後若要原生包 App：同一套前端用 Capacitor；若要加像素地圖探索，可遷移戰鬥層到 Godot 4。

## 垂直切片內容

1. **修煉**：自動累積修為，一鍵突破境界  
2. **隊伍**：招募最多 3 名門徒（攻／防／速）  
3. **地牢**：簡易回合自動戰鬥，勝出得靈石與裝備碎片  
4. **存檔**：`localStorage` 自動保存  

## 本地運行

```bash
cd mobile-rpg-slice
python3 -m http.server 8765
# 瀏覽器開 http://localhost:8765 （手機用同網 IP）
```

或直接開 `index.html`（部分瀏覽器對 service worker 需 http 源）。

## 開源項目地圖（精簡）

### 文字修仙／掛機

- [The-Nine-Heavens](https://github.com/Milec/The-Nine-Heavens) — 首選參考  
- [xiuxian](https://github.com/Martinqi826/xiuxian) — 單檔 HTML 掛機  
- [Daoyou](https://github.com/tianxinfox/Daoyou) — AIGC 文字修仙  
- [XianTu](https://github.com/qianye60/xiantu) — Vue + AI 敘事  
- [OpenIdle-Engine](https://github.com/simonfruehauf/OpenIdle-Engine) / [clicker-engine](https://github.com/blixxurd/clicker-engine)

### 地牢／回合戰鬥

- [shattered-pixel-dungeon](https://github.com/00-Evan/shattered-pixel-dungeon) — 學結構，GPLv3 商用慎用  
- [godot-open-rpg](https://github.com/GDquest/godot-open-rpg) — 隊伍回合  
- [snap-dungeon-v2](https://github.com/RyosukeMondo/snap-dungeon-v2) — Godot 手機直向  
- [bonfire](https://github.com/RafaelBarbosatec/bonfire) — Flutter 2D RPG

## 授權

本切片程式碼以 MIT 授權，方便你之後改成自己 IP。參考項目請各自遵守其 LICENSE。
