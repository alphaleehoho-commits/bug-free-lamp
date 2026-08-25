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
  SKILLS,
  masterSkillsForStage,
} from "./engine.js";

const app = document.querySelector("#app");

let state = loadState();
state = tickCultivation(state);
saveState(state);

let flash = "";
let flashTimer = 0;
let combatView = null;
let tab = "cultivate";
let shellReady = false;

function setFlash(msg) {
  flash = msg;
  const el = document.querySelector("[data-live=flash]");
  if (el) {
    if (msg) {
      el.hidden = false;
      el.textContent = msg;
    } else {
      el.hidden = true;
      el.textContent = "";
    }
  } else {
    render();
  }
  clearTimeout(flashTimer);
  if (msg) {
    flashTimer = setTimeout(() => {
      flash = "";
      const f = document.querySelector("[data-live=flash]");
      if (f) {
        f.hidden = true;
        f.textContent = "";
      }
    }, 2200);
  }
}

function switchTab(id) {
  tab = id;
  combatView = null;
  render();
}

/** 只改數字／進度，唔重砌 DOM（避免背景同標題每秒閃） */
function patchLive() {
  state = tickCultivation(state);
  const next = nextRealm(state);
  const stage = realmInfo(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;

  const qiText = document.querySelector("[data-live=qi-text]");
  const qiBar = document.querySelector("[data-live=qi-bar]");
  const stones = document.querySelector("[data-live=stones]");
  const scrap = document.querySelector("[data-live=scrap]");
  const stageEl = document.querySelector("[data-live=stage]");
  const wins = document.querySelector("[data-live=wins]");

  if (qiText) {
    qiText.textContent = next
      ? `靈契 ${Math.floor(state.qi)} / ${next.need}`
      : `靈契 ${Math.floor(state.qi)}（已滿）`;
  }
  if (qiBar) qiBar.style.width = `${qiPct}%`;
  if (stones) stones.textContent = String(Math.floor(state.stones));
  if (scrap) scrap.textContent = String(state.scrap);
  if (stageEl) stageEl.textContent = stage.name;
  if (wins) wins.textContent = `勝場 ${state.combatsWon}`;
}

function render() {
  state = tickCultivation(state);
  const stage = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const m = state.master;
  const enterClass = shellReady ? "is-settled" : "is-enter";

  app.className = enterClass;
  app.innerHTML = `
    <header class="top">
      <p class="brand">暗潮</p>
      <p class="tag">靈寵修行 · 豎屏切片</p>
    </header>

    <section class="hero-strip" aria-hidden="true"></section>

    <div class="stats">
      <div><span>階段</span><strong data-live="stage">${stage.name}</strong></div>
      <div><span>靈石</span><strong data-live="stones">${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong data-live="scrap">${state.scrap}</strong></div>
    </div>

    <p class="flash" data-live="flash" ${flash ? "" : "hidden"}>${escapeHtml(flash)}</p>

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
      <span data-live="wins">勝場 ${state.combatsWon}</span>
    </footer>
  `;

  bind();
  shellReady = true;
  saveState(state);
}

function tabBtn(id, label) {
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}" data-tab="${id}">${label}</button>`;
}

function cultivatePanel(qiPct, next, m) {
  const skills = masterSkillsForStage(state.realm)
    .map((id) => SKILLS[id])
    .filter(Boolean)
    .map((s) => `<li><strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.desc)}（CD${s.cd}）</li>`)
    .join("");

  return `
    <h2>契壇修行</h2>
    <p class="lead">掛機累積靈契。人物 ${escapeHtml(m.name)}：攻${m.atk} 血${m.hp} 速${m.spd}</p>
    <div class="bar"><i data-live="qi-bar" style="width:${qiPct}%"></i></div>
    <p class="meta" data-live="qi-text">靈契 ${Math.floor(state.qi)}${next ? ` / ${next.need}` : "（已滿）"}</p>
    <div class="row">
      <button type="button" class="primary" data-act="break">突破階段</button>
      <button type="button" data-act="forge">靈紋鍛造</button>
    </div>
    <h3>人物技能</h3>
    <ul class="skill-list">${skills || "<li class='empty'>尚未解鎖</li>"}</ul>
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
          <span class="muted">技能【${escapeHtml(p.skillName || SKILLS[p.skillId]?.name || "—")}】${p.skillId && SKILLS[p.skillId] ? " — " + SKILLS[p.skillId].desc : ""}</span>
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
          <span class="muted">${escapeHtml(c.kind)}·${escapeHtml(c.elementName)}·${escapeHtml(c.personalityName)} · 攻${c.atk} 血${c.hp} 速${c.spd} · ${c.cost} 石</span>
          <span class="muted">技能【${escapeHtml(c.skillName)}】</span>
        </div>
        <button type="button" class="primary" data-bond="${c.templateId}">契約</button>
      </li>`
    )
    .join("") || `<li class="empty">野外名單已空，或欄位已滿。</li>`;

  return `
    <h2>靈寵欄</h2>
    <p class="lead">種類：獸／鱗／禽／甲／蟲（各有種族技能）。另有元素與性格改數值。</p>
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
    <p class="lead">人物與靈寵會自動施放技能（有冷卻）。</p>
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
        render();
        setFlash(r.msg);
      } else if (act === "forge") {
        const r = forgeHint(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "breed") {
        setFlash(tryBreed(state).msg);
      } else if (act === "reset") {
        if (confirm("確定清除存檔？")) {
          state = resetSave();
          combatView = null;
          shellReady = false;
          render();
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
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-release]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = releasePet(state, btn.dataset.release);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dungeon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = runDungeon(state, btn.dataset.dungeon);
      saveState(state);
      if (r.ok && r.transcript) combatView = r;
      render();
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
  patchLive();
  // 靜默存檔，唔重繪
  saveState(state);
}, 1000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
