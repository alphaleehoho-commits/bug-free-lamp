import {
  loadState,
  saveState,
  tickCultivation,
  tryBreakthrough,
  recruitOptions,
  recruit,
  dismiss,
  runDungeon,
  forgeHint,
  resetSave,
  realmInfo,
  nextRealm,
  DUNGEONS,
} from "./engine.js";

const $ = (sel) => document.querySelector(sel);
const app = $("#app");

let state = loadState();
state = tickCultivation(state);
saveState(state);

let flash = "";
let combatView = null;
let tab = "cultivate";

function setFlash(msg) {
  flash = msg;
  render();
  if (msg) setTimeout(() => { flash = ""; render(); }, 2200);
}

function switchTab(id) {
  tab = id;
  combatView = null;
  render();
}

function render() {
  state = tickCultivation(state);
  const realm = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;

  app.innerHTML = `
    <header class="top">
      <p class="brand">暗潮</p>
      <p class="tag">Void Tide · 豎屏切片</p>
    </header>

    <section class="hero-strip" aria-hidden="true"></section>

    <div class="stats">
      <div><span>境界</span><strong>${realm.name}</strong></div>
      <div><span>靈石</span><strong>${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong>${state.scrap}</strong></div>
    </div>

    ${flash ? `<p class="flash">${escapeHtml(flash)}</p>` : ""}

    <nav class="tabs" role="tablist">
      ${tabBtn("cultivate", "修煉")}
      ${tabBtn("party", "隊伍")}
      ${tabBtn("dungeon", "地牢")}
      ${tabBtn("log", "見聞")}
    </nav>

    <main class="panel">
      ${tab === "cultivate" ? cultivatePanel(qiPct, next) : ""}
      ${tab === "party" ? partyPanel() : ""}
      ${tab === "dungeon" ? dungeonPanel() : ""}
      ${tab === "log" ? logPanel() : ""}
    </main>

    <footer class="foot">
      <button type="button" class="ghost" data-act="reset">重置存檔</button>
      <span>勝場 ${state.combatsWon}</span>
    </footer>
  `;

  bind();
}

function tabBtn(id, label) {
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}" data-tab="${id}">${label}</button>`;
}

function cultivatePanel(qiPct, next) {
  return `
    <h2>靜室修煉</h2>
    <p class="lead">掛機累積修為；突破時可能觸發奇遇。</p>
    <div class="bar"><i style="width:${qiPct}%"></i></div>
    <p class="meta">修為 ${Math.floor(state.qi)}${next ? ` / ${next.need}` : "（已滿）"}</p>
    <div class="row">
      <button type="button" class="primary" data-act="break">突破境界</button>
      <button type="button" data-act="forge">鍛造強化</button>
    </div>
  `;
}

function partyPanel() {
  const roster = state.party
    .map(
      (p) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(p.name)}</strong>
          <span class="muted">${p.role} · 攻${p.atk} 血${p.hp} 速${p.spd}</span>
        </div>
        <button type="button" data-dismiss="${p.id}">遣散</button>
      </li>`
    )
    .join("") || `<li class="empty">尚未招募門徒。</li>`;

  const pool = recruitOptions(state)
    .map(
      (c) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${c.role} · 攻${c.atk} 血${c.hp} 速${c.spd} · ${c.cost} 靈石</span>
        </div>
        <button type="button" class="primary" data-recruit="${c.id}">招募</button>
      </li>`
    )
    .join("") || `<li class="empty">可招募名單已空，或隊伍已滿。</li>`;

  return `
    <h2>門徒隊伍</h2>
    <p class="lead">最多三人。屬性影響地牢自動戰鬥。</p>
    <h3>現役</h3>
    <ul class="list">${roster}</ul>
    <h3>可招募</h3>
    <ul class="list">${pool}</ul>
  `;
}

function dungeonPanel() {
  if (combatView) {
    const lines = combatView.transcript.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
    return `
      <h2>戰報</h2>
      <p class="lead">${escapeHtml(combatView.msg)}（${combatView.rounds} 回合）</p>
      <ul class="combat">${lines}</ul>
      <button type="button" data-act="clear-combat">返回地牢</button>
    `;
  }

  const list = DUNGEONS.map((d) => {
    const locked = state.realm < d.needRealm;
    return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(d.name)}</strong>
          <span class="muted">${d.enemies.length} 敵 · 獎 ${d.reward.stones} 石 / ${d.reward.scrap} 碎片${locked ? " · 境界不足" : ""}</span>
        </div>
        <button type="button" class="primary" data-dungeon="${d.id}" ${locked || state.party.length === 0 ? "disabled" : ""}>進攻</button>
      </li>`;
  }).join("");

  return `
    <h2>潮汐廢墟</h2>
    <p class="lead">簡易速度軸自動戰鬥——地下城堡式進本切片。</p>
    <ul class="list">${list}</ul>
  `;
}

function logPanel() {
  const lines = state.log.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
  return `<h2>見聞錄</h2><ul class="log">${lines}</ul>`;
}

function bind() {
  app.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  app.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      if (act === "break") {
        const r = tryBreakthrough(state);
        saveState(state);
        setFlash(r.msg);
      } else if (act === "forge") {
        const r = forgeHint(state);
        saveState(state);
        setFlash(r.msg);
      } else if (act === "reset") {
        if (confirm("確定清除存檔？")) {
          state = resetSave();
          combatView = null;
          setFlash("存檔已重置。");
        }
      } else if (act === "clear-combat") {
        combatView = null;
        render();
      }
    });
  });
  app.querySelectorAll("[data-recruit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = recruit(state, btn.dataset.recruit);
      saveState(state);
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dismiss]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = dismiss(state, btn.dataset.dismiss);
      saveState(state);
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dungeon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = runDungeon(state, btn.dataset.dungeon);
      saveState(state);
      if (r.ok && r.transcript) combatView = r;
      setFlash(r.msg);
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

render();
setInterval(() => {
  state = tickCultivation(state);
  saveState(state);
  if (tab === "cultivate") render();
}, 1000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
