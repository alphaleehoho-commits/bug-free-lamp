# Service Worker 快取 bump 儀式

每次熱修／UI 部署後 **必做**：

1. 改 `sw.js` 第一行 cache 名：`void-tide-pets-vN` → `vN+1`
2. （可選）升 `js/data.js` 的 `APP_BUILD`
3. Commit + 部署 GitHub Pages
4. 驗證：開站後頂欄出現「有新版本」或硬刷新後見新文案／行為

## 玩家提示
- 更新公告 banner 會提示硬刷新
- iOS Safari：分享 → 加入主畫面後若仲係舊版，刪網站資料再開
- 唔好淨係普通下拉刷新（可能仲用舊 cache）

## 點解
PWA cache-first 會令「修咗但玩家仲係舊版」——呢個係信任殺手。
