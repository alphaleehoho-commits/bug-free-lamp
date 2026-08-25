import {
  loadState,
  saveState,
  tickCultivation,
  tryBreakthrough,
  wildOptions,
  bondPet,
  releasePet,
  runDungeon,
  forgeHint,
  tryBreed,
  resetSave,
  realmInfo,
  nextRealm,
  DUNGEONS,
} from "./engine.js";

const app = document.querySelector("#app");

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
  const stage = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const m = state.master;

  app.innerHTML = `
    <header class="top">
      <p class="brand">暗潮</p>
      <p class="tag">靈寵修行 · 豎屏切片</p>
    </header>

    <section class="hero-strip" aria-hidden="true"></section>

    <div class="stats">
      <div><span>階段</span><strong>${stage.name}</strong></div>
      <div><span>靈石</span><strong>${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong>${state.scrap}</strong></div>
    </div>

    ${flash ? `<p class="flash">${escapeHtml(flash)}</p>` : ""}

    <nav class="tabs" role="tablist">
      ${tabBtn("cultivate", "修行")}
      ${tabBtn("party", "靈寵")}
      ${tabBtn("dungeon", "秘境")}
      ${tabBtn("log", "見聞")}
    </nav>

    <main class="panel">
      ${tab === "cultivate" ? cultivatePanel(qiPct, next, m) : ""}
      ${tab === "party" ? petsPanel() : ""}
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

function cultivatePanel(qiPct, next, m) {
  return `
    <h2>契壇修行</h2>
    <p class="lead">掛機累積靈契；突破階段時或有靈兆。人物：${escapeHtml(m.name)}（攻${m.atk} 血${m.hp} 速${m.spd}）</p>
    <div class="bar"><i style="width:${qiPct}%"></i></div>
    <p class="meta">靈契 ${Math.floor(state.qi)}${next ? ` / ${next.need}` : "（已滿）"}</p>
    <div class="row">
      <button type="button" class="primary" data-act="break">突破階段</button>
      <button type="button" data-act="forge">靈紋鍛造</button>
    </div>
  `;
}

function petsPanel() {
  const roster = state.pets
    .map(
      (p) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(p.name)}</strong>
          <span class="muted">${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)} · 攻${p.atk} 血${p.hp} 速${p.spd}</span>
        </div>
        <button type="button" data-release="${escapeHtml(p.uid)}">放歸</button>
      </li>`
    )
    .join("") || `<li class="empty">尚未締結靈寵。戰鬥為「你 + 最多 3 靈寵」。</li>`;

  const pool = wildOptions(state)
    .map(
      (c) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${escapeHtml(c.kind)}·${escapeHtml(c.elementName)}·${escapeHtml(c.personalityName)} · 攻${c.atk} 血${c.hp} 速${c.spd} · ${c.cost} 靈石</span>
        </div>
        <button type="button" class="primary" data-bond="${c.templateId}">契約</button>
      </li>`
    )
    .join("") || `<li class="empty">野外名單已空，或欄位已滿。</li>`;

  return `
    <h2>靈寵欄</h2>
    <p class="lead">一人物 + 三靈寵。種類／元素／性格各自影響數值。繁殖後開。</p>
    <h3>出戰（${state.pets.length}/3）</h3>
    <ul class="list">${roster}</ul>
    <h3>可契約</h3>
    <ul class="list">${pool}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-act="breed">嘗試繁殖</button>
    </div>
  `;
}

function dungeonPanel() {
  if (combatView) {
    const lines = combatView.transcript.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
    return `
      <h2>戰報</h2>
      <p class="lead">${escapeHtml(combatView.msg)}（${combatView.rounds} 回合）</p>
      <ul class="combat">${lines}</ul>
      <button type="button" data-act="clear-combat">返回秘境</button>
    `;
  }

  const list = DUNGEONS.map((d) => {
    const locked = state.realm < d.needRealm;
    return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(d.name)}</strong>
          <span class="muted">${d.enemies.length} 敵 · 獎 ${d.reward.stones} 石 / ${d.reward.scrap} 碎片${locked ? " · 階段不足" : ""}</span>
        </div>
        <button type="button" class="primary" data-dungeon="${d.id}" ${locked || state.pets.length === 0 ? "disabled" : ""}>進攻</button>
      </li>`;
  }).join("");

  return `
    <h2>潮汐秘境</h2>
    <p class="lead">你與靈寵一齊出戰；勝出得靈石與碎片強化。</p>
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
      } else if (act === "breed") {
        const r = tryBreed(state);
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
  app.querySelectorAll("[data-bond]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = bondPet(state, btn.dataset.bond);
      saveState(state);
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-release]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = releasePet(state, btn.dataset.release);
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
