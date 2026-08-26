import {
  loadState,
  saveState,
  tickCultivation,
  tryBreakthrough,
  tryBondPending,
  dismissPending,
  releasePet,
  deployPet,
  undeployPet,
  upgradePet,
  fusePets,
  petDetail,
  runDungeon,
  forgeHint,
  tryBreed,
  resetSave,
  realmInfo,
  nextRealm,
  ranchCap,
  DUNGEONS,
  SKILLS,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  masterSkillsForStage,
  fusionStoneCost,
} from "./engine.js";

const app = document.querySelector("#app");

let state = loadState();
state = tickCultivation(state);
saveState(state);

let flash = "";
let flashTimer = 0;
let tab = "cultivate";
let shellReady = false;

/** @type {{ mode: 'list' | 'detail' | 'fuse', uid: string | null, fuseBase: string | null }} */
let petView = { mode: "list", uid: null, fuseBase: null };

/** @type {null | {
 *  lines: string[],
 *  shown: string[],
 *  index: number,
 *  result: object,
 *  timer: number | null,
 *  done: boolean
 * }} */
let playback = null;

const LINE_MS = 520;

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

function stopPlayback() {
  if (playback?.timer) clearInterval(playback.timer);
  playback = null;
}

function switchTab(id) {
  if (playback && !playback.done) return; // 戰鬥播放中唔切頁
  tab = id;
  if (id !== "party") petView = { mode: "list", uid: null, fuseBase: null };
  render();
}

function patchLive() {
  if (playback && !playback.done) return;
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

function updatePlaybackDom() {
  if (!playback) return;
  const total = Math.max(1, playback.lines.length);
  const pct = Math.min(100, Math.round((playback.index / total) * 100));
  const bar = document.querySelector("[data-live=combat-bar]");
  const meta = document.querySelector("[data-live=combat-meta]");
  const list = document.querySelector("[data-live=combat-log]");
  if (bar) bar.style.width = `${pct}%`;
  if (meta) {
    meta.textContent = playback.done
      ? `${playback.result.msg}（${playback.result.rounds} 回合）`
      : `戰鬥進行中… ${playback.index}/${total}`;
  }
  if (list && playback.shown.length) {
    const last = playback.shown[playback.shown.length - 1];
    // 只 append 最新一條，避免整表重繪閃爍
    if (!list.dataset.lastLine || list.dataset.lastLine !== last) {
      const li = document.createElement("li");
      li.className = "log-line-in";
      li.textContent = last;
      list.prepend(li);
      list.dataset.lastLine = last;
      while (list.children.length > 24) list.removeChild(list.lastChild);
    }
  }
}

function finishPlayback() {
  if (!playback) return;
  playback.done = true;
  if (playback.timer) {
    clearInterval(playback.timer);
    playback.timer = null;
  }
  updatePlaybackDom();
  saveState(state);
  setFlash(playback.result.msg);
  // 解鎖返回按鈕
  const back = document.querySelector("[data-act=clear-combat]");
  if (back) back.disabled = false;
  const skip = document.querySelector("[data-act=skip-combat]");
  if (skip) skip.hidden = true;
}

function advancePlayback() {
  if (!playback || playback.done) return;
  if (playback.index >= playback.lines.length) {
    finishPlayback();
    return;
  }
  const line = playback.lines[playback.index];
  playback.shown.push(line);
  playback.index += 1;
  // 見聞逐條記入
  state.log.unshift(line);
  if (state.log.length > 60) state.log.length = 60;
  updatePlaybackDom();
  if (playback.index >= playback.lines.length) finishPlayback();
}

function startPlayback(result) {
  stopPlayback();
  tab = "dungeon";
  playback = {
    lines: result.transcript || [],
    shown: [],
    index: 0,
    result,
    timer: null,
    done: false,
  };
  render();
  // 立即出第一條，其餘定時
  advancePlayback();
  playback.timer = setInterval(advancePlayback, LINE_MS);
}

function skipPlayback() {
  if (!playback || playback.done) return;
  while (playback.index < playback.lines.length) {
    const line = playback.lines[playback.index];
    playback.shown.push(line);
    state.log.unshift(line);
    playback.index += 1;
  }
  if (state.log.length > 60) state.log.length = 60;
  finishPlayback();
  // 補齊 DOM 列表
  const list = document.querySelector("[data-live=combat-log]");
  if (list) {
    list.innerHTML = playback.shown
      .slice()
      .reverse()
      .slice(0, 24)
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join("");
  }
  updatePlaybackDom();
}

function render() {
  state = tickCultivation(state);
  const stage = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const m = state.master;
  const enterClass = shellReady ? "is-settled" : "is-enter";
  const busy = playback && !playback.done;

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
      ${tabBtn("cultivate", "修行", busy)}
      ${tabBtn("party", "靈寵", busy)}
      ${tabBtn("dungeon", "秘境", busy)}
      ${tabBtn("log", "見聞", busy)}
    </nav>

    <main class="panel">
      ${tab === "cultivate" ? cultivatePanel(qiPct, next, m) : ""}
      ${tab === "party" ? petsPanel() : ""}
      ${tab === "dungeon" ? dungeonPanel() : ""}
      ${tab === "log" ? logPanel() : ""}
    </main>

    <footer class="foot">
      <button type="button" class="ghost" data-act="reset" ${busy ? "disabled" : ""}>重置存檔</button>
      <span data-live="wins">勝場 ${state.combatsWon}</span>
    </footer>
  `;

  bind();
  shellReady = true;
  saveState(state);
  if (playback) updatePlaybackDom();
}

function tabBtn(id, label, busy) {
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}" data-tab="${id}" ${busy && id !== "dungeon" ? "disabled" : ""}>${label}</button>`;
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

function petRow(p, extraBtn = "") {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  return `
    <li class="card-row">
      <div>
        <button type="button" class="linkish" data-pet-detail="${uid}"><strong>${escapeHtml(p.name)}</strong></button>
        <span class="muted">Lv.${lv}${fus ? ` · 融${fus}` : ""} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}</span>
        <span class="muted">攻${p.atk} 血${p.hp} 速${p.spd} · 【${escapeHtml(p.skillName || SKILLS[p.skillId]?.name || "—")}】</span>
      </div>
      <div class="row-actions">
        <button type="button" data-pet-detail="${uid}">詳情</button>
        ${extraBtn}
      </div>
    </li>`;
}

function petsListView() {
  const cap = ranchCap(state);
  const ranch = state.ranch || [];

  const roster =
    state.pets
      .map((p) =>
        petRow(
          p,
          `<button type="button" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`
        )
      )
      .join("") ||
    `<li class="empty">出戰欄空。從牧場派出靈寵（最多 ${ACTIVE_PET_MAX}）。</li>`;

  const ranchList =
    ranch
      .map((p) =>
        petRow(
          p,
          `<button type="button" class="primary" data-deploy="${escapeHtml(p.uid)}">出戰</button>`
        )
      )
      .join("") ||
    `<li class="empty">牧場空。契約成功的靈寵會進入牧場（容量 ${cap}）。</li>`;

  const pending = (state.pending || [])
    .map(
      (c) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${escapeHtml(c.kind)}·${escapeHtml(c.elementName)}·${escapeHtml(c.personalityName)} · 攻${c.atk} 血${c.hp} 速${c.spd}</span>
          <span class="muted">技能【${escapeHtml(c.skillName)}】· 成功率 ${Math.round(c.bondRate * 100)}% · ${c.cost} 靈石</span>
        </div>
        <div class="row-actions">
          <button type="button" class="primary" data-try-bond="${escapeHtml(c.encounterId)}">契約</button>
          <button type="button" data-dismiss-pending="${escapeHtml(c.encounterId)}">放過</button>
        </div>
      </li>`
    )
    .join("") ||
    `<li class="empty">尚無待契約靈寵。去秘境打本，隨機遇見後會出現喺呢度（最多 ${PENDING_BOND_MAX} 隻）。</li>`;

  return `
    <h2>靈寵</h2>
    <p class="lead">契約入牧場，再派出戰。牧場 ${ranch.length}/${cap} · 待契約 ${(state.pending || []).length}/${PENDING_BOND_MAX}</p>
    <h3>出戰（${state.pets.length}/${ACTIVE_PET_MAX}）</h3>
    <ul class="list">${roster}</ul>
    <h3>牧場（${ranch.length}/${cap}）</h3>
    <ul class="list">${ranchList}</ul>
    <h3>待契約</h3>
    <ul class="list">${pending}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-act="breed">嘗試繁殖</button>
    </div>
  `;
}

function petsDetailView() {
  const detail = petDetail(state, petView.uid);
  if (!detail) {
    petView = { mode: "list", uid: null, fuseBase: null };
    return petsListView();
  }
  const { pet, deployed, upgradeCost, fuseCostHint, skill } = detail;
  const lv = pet.level ?? 1;
  const fus = pet.fusionLevel ?? 0;
  const loc = deployed ? "出戰中" : "牧場待命";

  return `
    <h2>${escapeHtml(pet.name)}</h2>
    <p class="lead">${escapeHtml(loc)} · Lv.${lv} · 融階 ${fus}</p>
    <ul class="skill-list">
      <li><strong>種類</strong> — ${escapeHtml(pet.kind)} · ${escapeHtml(pet.speciesName)}</li>
      <li><strong>元素</strong> — ${escapeHtml(pet.elementName)}</li>
      <li><strong>性格</strong> — ${escapeHtml(pet.personalityName)}</li>
      <li><strong>數值</strong> — 攻${pet.atk} 血${pet.hp} 速${pet.spd}</li>
      <li><strong>技能</strong> — 【${escapeHtml(pet.skillName || skill?.name || "—")}】${skill ? ` ${escapeHtml(skill.desc)}（CD${skill.cd}）` : ""}</li>
    </ul>
    <div class="row">
      <button type="button" class="primary" data-upgrade="${escapeHtml(pet.uid)}">升級（${upgradeCost} 石）</button>
      ${
        deployed
          ? `<button type="button" data-undeploy="${escapeHtml(pet.uid)}">撤回牧場</button>`
          : `<button type="button" data-deploy="${escapeHtml(pet.uid)}">派出戰</button>`
      }
    </div>
    <div class="row" style="margin-top:0.5rem">
      <button type="button" data-start-fuse="${escapeHtml(pet.uid)}">融合（約 ${fuseCostHint}+ 石）</button>
      <button type="button" data-release="${escapeHtml(pet.uid)}">放歸</button>
    </div>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsFuseView() {
  const baseDetail = petDetail(state, petView.fuseBase);
  if (!baseDetail) {
    petView = { mode: "list", uid: null, fuseBase: null };
    return petsListView();
  }
  const base = baseDetail.pet;
  const owned = [...state.pets, ...(state.ranch || [])].filter(
    (p) => p.uid !== base.uid && p.speciesId === base.speciesId
  );

  const mats =
    owned
      .map((p) => {
        const resultFusion = Math.max(base.fusionLevel ?? 0, p.fusionLevel ?? 0) + 1;
        const cost = fusionStoneCost(resultFusion);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="muted">Lv.${p.level ?? 1} · 融${p.fusionLevel ?? 0} · 攻${p.atk} 血${p.hp} 速${p.spd}</span>
            <span class="muted">融合後融階 ${resultFusion} · 耗 ${cost} 靈石</span>
          </div>
          <button type="button" class="primary" data-fuse-with="${escapeHtml(p.uid)}">確認融合</button>
        </li>`;
      })
      .join("") ||
    `<li class="empty">沒有同種族（${escapeHtml(base.speciesName)}）可作素材的靈寵。</li>`;

  return `
    <h2>融合</h2>
    <p class="lead">本體：${escapeHtml(base.name)}（融${base.fusionLevel ?? 0}）。選同種族素材；素材會消失。</p>
    <ul class="list">${mats}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-pet-detail="${escapeHtml(base.uid)}">返回詳情</button>
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsPanel() {
  if (petView.mode === "detail") return petsDetailView();
  if (petView.mode === "fuse") return petsFuseView();
  return petsListView();
}

function dungeonPanel() {
  if (playback) {
    const pct = Math.min(
      100,
      Math.round((playback.index / Math.max(1, playback.lines.length)) * 100)
    );
    const lines = playback.shown
      .slice()
      .reverse()
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join("");
    return `
      <h2>戰報</h2>
      <p class="lead" data-live="combat-meta">${
        playback.done
          ? `${escapeHtml(playback.result.msg)}（${playback.result.rounds} 回合）`
          : `戰鬥進行中… ${playback.index}/${playback.lines.length}`
      }</p>
      <div class="bar combat-bar"><i data-live="combat-bar" style="width:${pct}%"></i></div>
      <ul class="combat" data-live="combat-log">${lines}</ul>
      <div class="row">
        <button type="button" data-act="skip-combat" ${playback.done ? "hidden" : ""}>跳過動畫</button>
        <button type="button" data-act="clear-combat" ${playback.done ? "" : "disabled"}>返回秘境</button>
      </div>
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
        <button type="button" class="primary" data-dungeon="${d.id}" ${locked ? "disabled" : ""}>進攻</button>
      </li>`;
  }).join("");

  return `
    <h2>潮汐秘境</h2>
    <p class="lead">可獨自進本。戰勝後有機會遇見野生靈寵；戰報會逐條播出。</p>
    <ul class="list">${list}</ul>
  `;
}

function logPanel() {
  const lines = state.log.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
  return `<h2>見聞錄</h2><ul class="log">${lines}</ul>`;
}

function bind() {
  app.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      switchTab(btn.dataset.tab);
    });
  });
  app.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
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
          stopPlayback();
          state = resetSave();
          petView = { mode: "list", uid: null, fuseBase: null };
          shellReady = false;
          render();
          setFlash("存檔已重置。");
        }
      } else if (act === "clear-combat") {
        stopPlayback();
        render();
      } else if (act === "skip-combat") {
        skipPlayback();
      }
    });
  });
  app.querySelectorAll("[data-try-bond]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = tryBondPending(state, btn.dataset.tryBond);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dismiss-pending]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = dismissPending(state, btn.dataset.dismissPending);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-release]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("確定放歸這隻靈寵？")) return;
      const r = releasePet(state, btn.dataset.release);
      saveState(state);
      petView = { mode: "list", uid: null, fuseBase: null };
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-deploy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = deployPet(state, btn.dataset.deploy);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-undeploy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = undeployPet(state, btn.dataset.undeploy);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = upgradePet(state, btn.dataset.upgrade);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "detail", uid: btn.dataset.petDetail, fuseBase: null };
      render();
    });
  });
  app.querySelectorAll("[data-start-fuse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "fuse", uid: null, fuseBase: btn.dataset.startFuse };
      render();
    });
  });
  app.querySelectorAll("[data-fuse-with]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const matUid = btn.dataset.fuseWith;
      const baseUid = petView.fuseBase;
      const baseDetail = petDetail(state, baseUid);
      const matDetail = petDetail(state, matUid);
      if (!baseDetail || !matDetail) {
        setFlash("找不到靈寵。");
        return;
      }
      const resultFusion =
        Math.max(baseDetail.fusionLevel, matDetail.fusionLevel) + 1;
      const cost = fusionStoneCost(resultFusion);
      if (
        !confirm(
          `以 ${matDetail.pet.name} 融合進 ${baseDetail.pet.name}？\n耗 ${cost} 靈石，素材消失，融階 → ${resultFusion}`
        )
      ) {
        return;
      }
      const r = fusePets(state, baseUid, matUid);
      saveState(state);
      if (r.ok) {
        petView = { mode: "detail", uid: baseUid, fuseBase: null };
      }
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "list", uid: null, fuseBase: null };
      render();
    });
  });
  app.querySelectorAll("[data-dungeon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (playback && !playback.done) return;
      const r = runDungeon(state, btn.dataset.dungeon);
      saveState(state);
      if (!r.ok) {
        setFlash(r.msg);
        return;
      }
      startPlayback(r);
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
  saveState(state);
}, 1000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
