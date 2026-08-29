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
  upgradePetSkill,
  fusePets,
  petDetail,
  runDungeon,
  forgeHint,
  tryBreed,
  breedStatus,
  breedPreview,
  petLineage,
  dungeonStatus,
  resetSave,
  realmInfo,
  nextRealm,
  ranchCap,
  partySynergy,
  renamePet,
  clearOfflineHint,
  claimDaily,
  dailyView,
  achievementsView,
  bestiaryStatus,
  displayPetName,
  rarityInfo,
  genLabel,
  petGeneration,
  breedGoalsView,
  claimBreedGoal,
  hybridRecipeSummary,
  hybridRecipeMatrix,
  KINDS,
  dungeonWaves,
  SKILLS,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  FUSION_MAX_STAGE,
  BREED_STONE_COST,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  NICK_MAX_LEN,
  bestiarySpeciesSummary,
  fusionStoneCost,
  breakthroughView,
  shopView,
  buyShopOffer,
  setTactics,
  tacticsView,
  setFormation,
  formationView,
  dispatchView,
  startDispatch,
  claimDispatch,
  tryTideSeal,
  tideSealView,
  setTrainSite,
  trainSitesView,
  materialHintsView,
  dungeonDailyView,
  resolveDungeon,
  dungeonsForRealm,
  stageAt,
  upgradeMatCost,
  breedMatCost,
  affordMaterials,
  TACTICS,
  FORMATIONS,
  MATERIALS,
  pathQuestsView,
  claimPathQuest,
  useBreedTicket,
  useBloodCatalyst,
  useTemperOil,
} from "./engine.js";
import {
  tutorialActive,
  tutorialBannerHtml,
  syncTutorialNavigation,
  advanceTutorialIfReady,
  markTutorialFlag,
  isTabLocked,
  isCultivateSubLocked,
  isPartySubLocked,
  isDungeonSubLocked,
  areTrainSitesLocked,
  skipTutorial,
  tutorialQiReady,
  tutorialGlowClass,
  tutorialLiveSnapshot,
  tutorialHighlights,
  findTutorialTargetElements,
  maybeStartLateTutorial,
  tutorialStepInfo,
  tutorialWaivesDungeonChallenge,
} from "./tutorial.js";

const app = document.querySelector("#app");

let state = loadState();
state = tickCultivation(state);
saveState(state);

let flash = "";
/** @type {'' | 'celebrate' | 'hybrid' | 'legend' | 'unlock'} */
let flashTone = "";
let flashTimer = 0;
let tab = "cultivate";
/** @type {{ cultivate: string, party: string, dungeon: string, codex: string }} */
let panelSub = { cultivate: "train", party: "fight", dungeon: "field", codex: "dex" };
let dungeonIdx = 0;
let shellReady = false;
/** @type {string[]} 牧場派遣選中 uid */
let dispatchPick = [];
let pwaInstallEvt = null;
let pwaDismissed = localStorage.getItem("void-tide-pwa-dismiss") === "1";
let tutorialSnapCache = "";
let tutMisclickCount = 0;
let tutSpotlightEl = null;
let flashHostEl = null;

function ensureFlashHost() {
  if (flashHostEl?.isConnected) return flashHostEl;
  flashHostEl = document.getElementById("flash-toast");
  if (!flashHostEl) {
    flashHostEl = document.createElement("div");
    flashHostEl.id = "flash-toast";
    flashHostEl.className = "flash-toast-host";
    flashHostEl.hidden = true;
    flashHostEl.setAttribute("aria-live", "polite");
    const p = document.createElement("p");
    p.className = "flash flash-truncate";
    p.dataset.live = "flash";
    p.hidden = true;
    flashHostEl.appendChild(p);
    document.body.appendChild(flashHostEl);
  }
  return flashHostEl;
}

function ensureSpotlight() {
  if (tutSpotlightEl?.isConnected) return tutSpotlightEl;
  tutSpotlightEl = document.getElementById("tut-spotlight");
  if (!tutSpotlightEl) {
    tutSpotlightEl = document.createElement("div");
    tutSpotlightEl.id = "tut-spotlight";
    tutSpotlightEl.hidden = true;
    tutSpotlightEl.innerHTML = '<span class="tut-spotlight-ring"></span>';
    document.body.appendChild(tutSpotlightEl);
  }
  return tutSpotlightEl;
}

function isTutorialTargetClick(target) {
  const targets = findTutorialTargetElements(state, { tab, panelSub });
  return targets.some((el) => el === target || el.contains(target));
}

function onTutorialMisclick(ev) {
  if (!tutorialActive(state)) return;
  if (ev.target.closest?.(".tutorial-skip")) return;
  if (isTutorialTargetClick(ev.target)) {
    tutMisclickCount = 0;
    return;
  }
  tutMisclickCount += 1;
  if (tutMisclickCount >= 2) positionTutorialSpotlight(true);
}

function positionTutorialSpotlight(urgent = false) {
  const host = ensureSpotlight();
  const banner = document.querySelector("[data-live=tutorial]");
  if (!tutorialActive(state)) {
    host.hidden = true;
    banner?.classList.remove("is-spotlight-active");
    return;
  }
  const targets = findTutorialTargetElements(state, { tab, panelSub });
  app.querySelectorAll(".tut-glow").forEach((el) => el.classList.remove("tut-glow", "tut-flash-urgent"));
  if (!targets.length) {
    host.hidden = true;
    banner?.classList.remove("is-spotlight-active");
    return;
  }
  const el = targets[0];
  const isUrgent = urgent || tutMisclickCount >= 2;
  if (isUrgent) {
    el.classList.add("tut-glow", "tut-flash-urgent");
  }
  const r = el.getBoundingClientRect();
  host.hidden = false;
  host.classList.toggle("is-urgent", isUrgent);
  host.style.top = `${Math.max(4, r.top - 4)}px`;
  host.style.left = `${Math.max(4, r.left - 4)}px`;
  host.style.width = `${r.width + 8}px`;
  host.style.height = `${r.height + 8}px`;
  banner?.classList.add("is-spotlight-active");
}

function tutGlow(spec) {
  return tutorialGlowClass(state, spec, { tab, panelSub });
}

function refreshTutorialGlow() {
  positionTutorialSpotlight(false);
}

function patchTutorialBanner() {
  const cur = document.querySelector("[data-live=tutorial]");
  if (!tutorialActive(state)) {
    cur?.remove();
    ensureSpotlight().hidden = true;
    return;
  }
  const html = tutorialBannerHtml(state);
  if (cur) {
    const wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    cur.replaceWith(wrap.firstElementChild);
  }
  positionTutorialSpotlight(false);
}

/** @type {{ mode: 'list' | 'detail' | 'fuse' | 'breed', uid: string | null, fuseBase: string | null, fuseMats: string[], breedParents: string[] }} */
let petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };

/** @type {null | {
 *  events: object[],
 *  lines: string[],
 *  shown: string[],
 *  index: number,
 *  result: object,
 *  timer: number | null,
 *  done: boolean,
 *  skipped: boolean,
 *  unitHp: Map<string, number>,
 *  allyUnits: object[],
 *  foeUnits: object[],
 * }} */
let playback = null;

const LINE_MS = 520;

function initCombatHp(result) {
  const hp = new Map();
  const allies = [];
  const foes = [];
  for (const u of result.combatStart?.allies || []) {
    hp.set(u.uid, u.hp);
    allies.push({ ...u });
  }
  for (const u of result.combatStart?.foes || []) {
    hp.set(u.uid, u.hp);
    foes.push({ ...u });
  }
  return { hp, allies, foes };
}

function applyCombatEvent(event, pb) {
  if (!event || !pb) return;
  if (event.type === "round") {
    pb.currentRound = event.round || pb.currentRound;
  } else if (event.type === "strike" || event.type === "heal") {
    pb.unitHp.set(event.targetUid, event.targetHp);
    pb.lastHitUid = event.type === "strike" ? event.targetUid : null;
  } else if (event.type === "wave" && event.foes) {
    pb.foeUnits = event.foes.map((f) => ({ ...f }));
    for (const f of event.foes) pb.unitHp.set(f.uid, f.hp);
    pb.lastHitUid = null;
  } else {
    pb.lastHitUid = null;
  }
}

function combatLogClass(event) {
  if (!event) return "";
  if (event.type === "round") return "log-round";
  if (event.type === "heal") return "log-heal";
  if (event.type === "strike") {
    if (event.elemTag === "克制") return "log-adv";
    if (event.elemTag === "被克") return "log-dis";
    if (event.ko) return "log-ko";
  }
  return "";
}

function combatLogLineHtml(text, event) {
  const cls = combatLogClass(event);
  let badge = "";
  if (event?.type === "strike" && event.elemTag) {
    const kind = event.elemTag === "克制" ? "adv" : "dis";
    badge = `<span class="elem-badge elem-${kind}">${escapeHtml(event.elemTag)}</span>`;
  }
  return `<li class="${cls}">${badge}${escapeHtml(text)}</li>`;
}

function combatUnitBar(u, pb) {
  const hp = pb.unitHp.get(u.uid) ?? u.hp;
  const pct = u.maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hp / u.maxHp) * 100))) : 0;
  const dead = hp <= 0;
  const doubleAct = u.role === "boss" || (u.actions || 1) > 1;
  const actBadge = doubleAct ? `<span class="cu-act" title="可連續行動">雙動</span>` : "";
  return `<div class="combat-unit ${dead ? "is-down" : ""}${doubleAct ? " is-boss-act" : ""}" data-combat-uid="${escapeHtml(u.uid)}" data-element="${escapeHtml(
    u.elementId || ""
  )}">
    <span class="cu-name">${actBadge}${escapeHtml(u.name)}</span>
    <div class="cu-bar"><i style="width:${pct}%"></i></div>
  </div>`;
}

function renderCombatRoster(pb) {
  return `<div class="combat-roster" data-live="combat-roster">
    <div class="combat-side allies">${pb.allyUnits.map((u) => combatUnitBar(u, pb)).join("")}</div>
    <div class="combat-side foes">${pb.foeUnits.map((u) => combatUnitBar(u, pb)).join("")}</div>
  </div>`;
}

function patchCombatRosterDom(pb) {
  const root = document.querySelector("[data-live=combat-roster]");
  if (!root) return;
  root.innerHTML = `
    <div class="combat-side allies">${pb.allyUnits.map((u) => combatUnitBar(u, pb)).join("")}</div>
    <div class="combat-side foes">${pb.foeUnits.map((u) => combatUnitBar(u, pb)).join("")}</div>`;
  if (pb.lastHitUid) {
    const hit = root.querySelector(`[data-combat-uid="${pb.lastHitUid}"]`);
    if (hit) {
      hit.classList.add("is-hit");
      setTimeout(() => hit.classList.remove("is-hit"), 420);
    }
  }
}

function setFlash(msg, tone = "") {
  flash = msg;
  flashTone = tone || "";
  const host = ensureFlashHost();
  const el = host.querySelector("[data-live=flash]");
  if (msg) {
    host.hidden = false;
    host.className = `flash-toast-host is-visible${flashTone ? ` flash-tone-${flashTone}` : ""}`;
    el.hidden = false;
    el.textContent = msg;
    el.className = flashTone ? `flash flash-truncate flash-${flashTone}` : "flash flash-truncate";
  } else {
    host.hidden = true;
    host.className = "flash-toast-host";
    el.hidden = true;
    el.textContent = "";
    el.className = "flash flash-truncate";
    flashTone = "";
  }
  clearTimeout(flashTimer);
  if (msg) {
    flashTimer = setTimeout(() => setFlash(""), 2800);
  }
}

function genTagHtml(g) {
  const n = g ?? 0;
  const cls = n >= 3 ? "gen-3" : n >= 2 ? "gen-2" : n >= 1 ? "gen-1" : "gen-0";
  return `<span class="gen-tag ${cls}">${escapeHtml(genLabel(n))}</span>`;
}

function rewardBitsHtml(reward) {
  if (!reward) return "";
  const bits = [];
  if (reward.stones) bits.push(`${reward.stones}石`);
  if (reward.feed) bits.push(`${reward.feed}飼料`);
  if (reward.dust) bits.push(`${reward.dust}靈塵`);
  if (reward.scrap) bits.push(`${reward.scrap}碎片`);
  if (reward.materials) {
    for (const [id, n] of Object.entries(reward.materials)) {
      if (n) bits.push(`${MATERIALS[id]?.name || id}×${n}`);
    }
  }
  return bits.join("／");
}

function condStatusRow(label, ok, rewardText = "", reason = "") {
  return `
    <li class="cond-item ${ok ? "is-met" : "is-miss"}">
      <span class="cond-badge">${ok ? "達成" : "未達成"}</span>
      <div class="cond-body">
        <strong>${escapeHtml(label)}</strong>
        <span class="muted">${
          ok
            ? rewardText
              ? `分開結算 ${escapeHtml(rewardText)}`
              : "已滿足"
            : reason
              ? escapeHtml(reason)
              : "出戰陣容未滿足"
        }</span>
      </div>
    </li>`;
}

function breedGoalsBoardHtml(compact = false) {
  const goals = breedGoalsView(state);
  const daily = goals.filter((g) => g.cadence === "daily");
  const weekly = goals.filter((g) => g.cadence === "weekly");
  const once = goals.filter((g) => g.cadence === "once");
  const renderGoal = (g) => {
    const status = g.claimed ? "已領" : g.done ? "可領" : `${g.progress}/${g.need}`;
    const cadence =
      g.cadence === "daily" ? "每日" : g.cadence === "weekly" ? "每週" : "常駐";
    return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(g.name)}</strong>
          <span class="muted">${escapeHtml(cadence)} · ${escapeHtml(g.desc)} · ${status}${
            compact ? "" : ` · 獎 ${escapeHtml(rewardBitsHtml(g.reward))}`
          }</span>
        </div>
        <button type="button" class="primary" data-claim-breed-goal="${g.id}" ${
          g.done && !g.claimed ? "" : "disabled"
        }>領獎</button>
      </li>`;
  };
  if (compact) {
    const open = goals.filter((g) => !g.claimed).slice(0, 2);
    const rows = open.map(renderGoal).join("") || `<li class="empty">繁殖目標已全部領完。</li>`;
    return `
      <h3>繁殖目標</h3>
      <p class="meta">完成雜交／升代／週課可領獎——圖鑑頁有完整列表。</p>
      <ul class="list">${rows}</ul>`;
  }
  return `
    <h3>繁殖目標 · 每日</h3>
    <ul class="list">${daily.map(renderGoal).join("")}</ul>
    <h3>歷練目標 · 每週</h3>
    <ul class="list">${weekly.map(renderGoal).join("")}</ul>
    <h3>繁殖目標 · 常駐</h3>
    <ul class="list">${once.map(renderGoal).join("")}</ul>`;
}

function recipeBoardHtml() {
  const summary = hybridRecipeSummary();
  const mains = summary
    .filter((r) => r.tier === "main")
    .map(
      (r) =>
        `<li><strong>${escapeHtml(r.kindsLabel)}</strong> → ${escapeHtml(r.name)} <span class="muted">${Math.round(
          r.chance * 100
        )}%</span></li>`
    )
    .join("");
  const subs = summary
    .filter((r) => r.tier === "sub")
    .map(
      (r) =>
        `<li><strong>${escapeHtml(r.kindsLabel)}</strong> → ${escapeHtml(r.name)} <span class="muted">${Math.round(
          r.chance * 100
        )}% · 次</span></li>`
    )
    .join("");

  const cells = hybridRecipeMatrix();
  const head = KINDS.map((k) => `<th>${escapeHtml(k)}</th>`).join("");
  const rows = KINDS.map((rowKind) => {
    const tds = KINDS.map((colKind) => {
      const cell = cells.find((c) => c.kindA === rowKind && c.kindB === colKind);
      if (!cell || cell.same) return `<td class="recipe-same">—</td>`;
      if (!cell.recipe) return `<td class="recipe-none">×</td>`;
      const pct = Math.round(cell.recipe.chance * 100);
      const tier = cell.recipe.tier === "main" ? "main" : "sub";
      return `<td class="recipe-${tier}" title="${escapeHtml(cell.recipe.name)} ${pct}%">${escapeHtml(
        cell.recipe.name.slice(0, 2)
      )}<span>${pct}</span></td>`;
    }).join("");
    return `<tr><th>${escapeHtml(rowKind)}</th>${tds}</tr>`;
  }).join("");

  return `
    <h3>主／次配方一覽</h3>
    <p class="meta">只讀參考；實際機率受雙親代數加成。</p>
    <ul class="recipe-sum">${mains}${subs}</ul>
    <div class="recipe-matrix-wrap">
      <table class="recipe-matrix" aria-label="種類雜交矩陣">
        <thead><tr><th></th>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function stopPlayback() {
  if (playback?.timer) clearInterval(playback.timer);
  playback = null;
}

function switchTab(id) {
  if (playback && !playback.done) return;
  if (isTabLocked(state, id)) return;
  tab = id;
  tutMisclickCount = 0;
  if (id === "codex" && tutorialActive(state) && state.tutorial.step === "codex") {
    const adv = markTutorialFlag(state, "codexVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  }
  if (id === "party" && tutorialActive(state) && state.tutorial.step === "meet_pet") {
    const adv = markTutorialFlag(state, "meetPetVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  }
  if (id !== "party") {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
  }
  render();
}

function markTutorialSubVisit(group, id) {
  tutMisclickCount = 0;
  const step = state.tutorial?.step;
  if (group === "party" && id === "ranch" && step === "meet_pet") {
    const adv = markTutorialFlag(state, "meetPetVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  } else if (group === "party" && id === "dispatch" && step === "dispatch") {
    const adv = markTutorialFlag(state, "dispatchVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  } else if (group === "dungeon" && id === "setup" && step === "tactics") {
    const adv = markTutorialFlag(state, "tacticsVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  }
}

function panelSubNav(group, items) {
  const lockFn =
    group === "cultivate"
      ? isCultivateSubLocked
      : group === "party"
        ? isPartySubLocked
        : group === "dungeon"
          ? isDungeonSubLocked
          : () => false;
  return `<nav class="panel-subnav" aria-label="子分頁">${items
    .map(({ id, label }) => {
      const locked = lockFn(state, id);
      const glow = tutGlow({ type: "panel-sub", group, id });
      return `<button type="button" class="${panelSub[group] === id ? "on" : ""}${locked ? " is-locked" : ""}${glow}" data-panel-sub="${group}:${id}" ${locked ? "disabled" : ""}>${label}${locked ? "🔒" : ""}</button>`;
    })
    .join("")}</nav>`;
}

function matAffordHtml(cost) {
  const a = affordMaterials(state, cost);
  if (!a.items.length) return "";
  return a.items
    .map(
      (i) =>
        `<span class="mat-need ${i.ok ? "is-ok" : "is-short"}" title="${escapeHtml(i.source)}">${escapeHtml(i.name)}×${i.need}（${i.have}）</span>`
    )
    .join("／");
}

function matChipsHtml() {
  return materialHintsView(state)
    .map((m) => {
      const empty = m.count <= 0;
      return `<span class="chip ${empty ? "is-empty" : ""}" title="${escapeHtml(m.source)}"><strong>${escapeHtml(m.name)}</strong> ${m.count}<span class="chip-use">${escapeHtml(m.use)}</span></span>`;
    })
    .join("");
}

function matHintListHtml() {
  return `<ul class="mat-hint-list">${materialHintsView(state)
    .map(
      (m) => `
    <li class="mat-hint ${m.count <= 0 ? "is-empty" : ""}">
      <span class="mat-name">${escapeHtml(m.name)}</span>
      <span class="mat-count">${m.count}</span>
      <span class="mat-src">${escapeHtml(m.source)}</span>
    </li>`
    )
    .join("")}</ul>`;
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
  const feed = document.querySelector("[data-live=feed]");
  const dust = document.querySelector("[data-live=dust]");
  const stageEl = document.querySelector("[data-live=stage]");
  const wins = document.querySelector("[data-live=wins]");

  if (qiText) {
    qiText.textContent = `靈契 ${Math.floor(state.qi)} / ${next.need}`;
  }
  if (qiBar) qiBar.style.width = `${qiPct}%`;
  if (stones) stones.textContent = String(Math.floor(state.stones));
  if (scrap) scrap.textContent = String(state.scrap);
  if (feed) feed.textContent = String(Math.floor(state.feed || 0));
  if (dust) dust.textContent = String(Math.floor(state.dust || 0));
  if (stageEl) stageEl.textContent = stage.name;
  if (wins) wins.textContent = `勝場 ${state.combatsWon}`;

  const snap = tutorialLiveSnapshot(state);
  if (snap !== tutorialSnapCache) {
    tutorialSnapCache = snap;
    patchTutorialBanner();
  } else if (tutorialActive(state)) {
    refreshTutorialGlow();
  }
}

function combatPlaybackMeta(pb) {
  const total = Math.max(1, pb.events.length);
  const roundNote = pb.currentRound ? `第 ${pb.currentRound} 回合 · ` : "";
  if (pb.done) {
    const rounds = pb.result?.rounds ?? 0;
    if (pb.result?.won) return `勝利（${rounds} 回合）`;
    if (pb.result?.msg?.includes("撤退")) return `撤退（${rounds} 回合）`;
    return `戰敗（${rounds} 回合）`;
  }
  return `${roundNote}戰鬥進行中… ${pb.index}/${total}`;
}

function updatePlaybackDom(latestEvent = null) {
  if (!playback) return;
  const total = Math.max(1, playback.events.length);
  const pct = Math.min(100, Math.round((playback.index / total) * 100));
  const bar = document.querySelector("[data-live=combat-bar]");
  const meta = document.querySelector("[data-live=combat-meta]");
  const list = document.querySelector("[data-live=combat-log]");
  if (bar) bar.style.width = `${pct}%`;
  if (meta) meta.textContent = combatPlaybackMeta(playback);
  patchCombatRosterDom(playback);
  if (list && playback.shown.length) {
    const idx = playback.shown.length - 1;
    const event = playback.events[idx] || latestEvent;
    const last = playback.shown[idx];
    if (!list.dataset.lastLine || list.dataset.lastLine !== last) {
      const li = document.createElement("li");
      li.className = `log-line-in ${combatLogClass(event)}`.trim();
      if (event?.type === "strike" && event.elemTag) {
        const kind = event.elemTag === "克制" ? "adv" : "dis";
        const badge = document.createElement("span");
        badge.className = `elem-badge elem-${kind}`;
        badge.textContent = event.elemTag;
        li.appendChild(badge);
      }
      li.append(document.createTextNode(last));
      list.prepend(li);
      list.dataset.lastLine = last;
      while (list.children.length > 40) list.removeChild(list.lastChild);
      const scroller = document.querySelector("[data-live=combat-scroll]");
      if (scroller) scroller.scrollTop = 0;
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
  let adv = { advanced: false, unlockMsg: null };
  if (playback.result?.won && tutorialActive(state)) {
    if (!state.tutorial.flags) state.tutorial.flags = {};
    state.tutorial.flags.dungeonWonTutorial = true;
    if (state.tutorial.step === "dungeon_win") {
      adv = advanceTutorialIfReady(state);
    }
  }
  saveState(state);
  render();
  const unlocks = playback.result.unlockedSites || [];
  if (adv.advanced && adv.unlockMsg) {
    setFlash(adv.unlockMsg, "unlock");
  } else if (unlocks.length) {
    setFlash(`解鎖練功地【${unlocks.join("】【")}】！ ${playback.result.msg}`, "unlock");
  } else {
    setFlash(playback.result.msg);
  }
}

function advancePlayback() {
  if (!playback || playback.done) return;
  if (playback.index >= playback.events.length) {
    finishPlayback();
    return;
  }
  const event = playback.events[playback.index];
  applyCombatEvent(event, playback);
  playback.shown.push(event.text);
  playback.index += 1;
  state.log.unshift(event.text);
  if (state.log.length > 60) state.log.length = 60;
  updatePlaybackDom(event);
  if (playback.index >= playback.events.length) finishPlayback();
}

function startPlayback(result) {
  stopPlayback();
  tab = "dungeon";
  const events =
    result.combatEvents ||
    (result.transcript || []).map((text) => ({ type: "text", text }));
  const hpState = initCombatHp(result);
  playback = {
    events,
    lines: events.map((e) => e.text),
    shown: [],
    index: 0,
    result,
    timer: null,
    done: false,
    skipped: false,
    unitHp: hpState.hp,
    allyUnits: hpState.allies,
    foeUnits: hpState.foes,
    lastHitUid: null,
    currentRound: 0,
  };
  render();
  advancePlayback();
  playback.timer = setInterval(advancePlayback, LINE_MS);
}

function skipPlayback() {
  if (!playback || playback.done) return;
  playback.skipped = true;
  while (playback.index < playback.events.length) {
    const event = playback.events[playback.index];
    applyCombatEvent(event, playback);
    playback.index += 1;
  }
  /* 跳過後不列出戰報，直接顯示最終結算 */
  playback.shown = [];
  finishPlayback();
  render();
}

function render() {
  state = tickCultivation(state);

  const nav = syncTutorialNavigation(state, { tab, panelSub });
  tab = nav.tab;
  panelSub = nav.panelSub;

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
      <p class="tag">靈寵修行</p>
    </header>

    <div class="stats">
      <div><span>階段</span><strong data-live="stage">${stage.name}</strong></div>
      <div><span>靈石</span><strong data-live="stones">${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong data-live="scrap">${state.scrap}</strong></div>
      <div><span>飼料</span><strong data-live="feed">${Math.floor(state.feed || 0)}</strong></div>
      <div><span>靈塵</span><strong data-live="dust">${Math.floor(state.dust || 0)}</strong></div>
    </div>

    ${offlineBanner()}
    ${installBanner()}

    <nav class="tabs" role="tablist">
      ${tabBtn("cultivate", "修行", busy)}
      ${tabBtn("party", "靈寵", busy)}
      ${tabBtn("dungeon", "秘境", busy)}
      ${tabBtn("codex", "圖鑑", busy)}
      ${tabBtn("log", "見聞", busy)}
    </nav>

    <main class="panel">
      <div class="panel-body">
      ${tutorialBannerHtml(state)}
      ${tab === "cultivate" ? cultivatePanel(qiPct, next, m) : ""}
      ${tab === "party" ? petsPanel() : ""}
      ${tab === "dungeon" ? dungeonPanel() : ""}
      ${tab === "codex" ? codexPanel() : ""}
      ${tab === "log" ? logPanel() : ""}
      </div>
    </main>

    <footer class="foot">
      <button type="button" class="ghost" data-act="reset" ${busy ? "disabled" : ""}>重置存檔</button>
      <span data-live="wins">勝場 ${state.combatsWon}</span>
    </footer>
  `;

  bind();
  shellReady = true;
  if (tutorialSnapCache !== tutorialLiveSnapshot(state)) tutMisclickCount = 0;
  tutorialSnapCache = tutorialLiveSnapshot(state);
  saveState(state);
  positionTutorialSpotlight(false);
  if (playback) updatePlaybackDom();
}

function dispatchMatBits(mission) {
  const hintMap = Object.fromEntries(materialHintsView(state).map((m) => [m.id, m.source]));
  const mats = mission.reward?.materials || {};
  return Object.entries(mats)
    .map(([id, n]) => {
      const name = MATERIALS[id]?.name || id;
      return `<span class="mat-need" title="${escapeHtml(hintMap[id] || "")}">${escapeHtml(name)}×${n}</span>`;
    })
    .join(" ");
}

function installBanner() {
  if (pwaDismissed || !pwaInstallEvt) return "";
  return `
    <div class="install-banner" data-live="install-banner">
      <p>可將暗潮加入主畫面，離線也能掛機修行。</p>
      <div class="row">
        <button type="button" class="primary" data-act="pwa-install">安裝</button>
        <button type="button" class="ghost" data-act="pwa-dismiss">稍後</button>
      </div>
    </div>`;
}

function offlineBanner() {
  const h = state.offlineHint;
  if (!h) return "";
  const min = Math.max(1, Math.round(h.sec / 60));
  const matLine =
    h.materials && Object.keys(h.materials).length
      ? Object.entries(h.materials)
          .map(([id, n]) => `${MATERIALS[id]?.name || id}×${n}`)
          .join("／")
      : "";
  const detail = `靈契 +${Math.floor(h.qi)} · 飼料 +${h.feed.toFixed(1)} · 靈塵 +${h.dust.toFixed(1)}${
    matLine ? ` · ${matLine}` : ""
  }${h.siteName ? `（${h.siteName}）` : ""}`;
  return `
    <div class="offline-banner" data-live="offline">
      <div class="offline-body">
        <strong>離線約 ${min} 分鐘</strong>
        <p class="offline-detail">${escapeHtml(detail)}</p>
      </div>
      <button type="button" data-act="clear-offline">知道了</button>
    </div>`;
}

function tabBtn(id, label, busy) {
  const locked = isTabLocked(state, id);
  const glow = tutGlow({ type: "tab", id });
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}${locked ? " locked" : ""}${glow}" data-tab="${id}" ${busy && id !== "dungeon" ? "disabled" : ""} ${locked ? "disabled" : ""}>${label}${locked ? "🔒" : ""}</button>`;
}

function cultivatePanel(qiPct, next, m) {
  const br = breakthroughView(state);
  const seal = tideSealView(state);
  const sites = trainSitesView(state);
  const siteBtns = sites
    .map((s) => {
      const locked = !s.unlocked || areTrainSitesLocked(state);
      return `<button type="button" class="${s.selected ? "primary" : ""} train-site-btn${locked ? " is-locked" : ""}" data-set-train="${s.id}" ${
        locked ? `disabled title="${escapeHtml(s.unlockHint || "未解鎖")}"` : ""
      }>${escapeHtml(s.name)}${locked ? "🔒" : ""}</button>`;
    })
    .join("");
  const siteCur = sites.find((s) => s.selected);
  const nextLocked = sites.find((s) => !s.unlocked);
  const trainLockNote = nextLocked
    ? `<p class="train-lock-note">🔒 ${escapeHtml(nextLocked.unlockHint || `解鎖【${nextLocked.name}】`)}</p>`
    : "";

  const shopOffers = shopView(state);
  const ranchFull = (state.ranch?.length || 0) + state.pets.length >= ranchCap(state);
  const shopRows =
    shopOffers
      .map((o) => {
        const sold = o.bought;
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(o.speciesName || o.name)}</strong>
            <span class="muted">${escapeHtml(o.kind)}·${escapeHtml(o.elementName)} · ${
              sold ? "已售" : o.tutorialDeal ? `教學 ${o.cost} 靈石` : `${o.cost} 靈石`
            }</span>
          </div>
          <button type="button" class="primary${tutGlow({ type: "shop-buy" })}" data-shop-buy="${escapeHtml(o.offerId)}" ${
            sold || ranchFull ? "disabled" : ""
          }>${sold ? "已售" : ranchFull ? "牧場滿" : "購入"}</button>
        </li>`;
      })
      .join("") || `<li class="empty">今日商肆無貨。</li>`;

  const ranchN = state.ranch?.length || 0;
  const breakLabel = br.ready
    ? `突破至${br.next.name}${br.costLabel ? `（耗${br.costLabel}）` : ""}`
    : "突破階段（條件未齊）";

  if (panelSub.cultivate === "gear") panelSub.cultivate = "train";
  const sub = panelSub.cultivate;
  const nav = panelSubNav("cultivate", [
    { id: "train", label: "練功" },
    { id: "shop", label: "商肆" },
    { id: "advance", label: "進階" },
  ]);

  if (sub === "shop") {
    return `
      ${nav}
      <h2>商肆 · 今日</h2>
      <p class="lead">靈石 ${Math.floor(state.stones)} · 牧場 ${ranchN}／${ranchCap(state)}</p>
      <ul class="list">${shopRows}</ul>`;
  }

  if (sub === "advance") {
    const gateCompact = br.items.slice(0, 6);
    const gateRowsCompact = gateCompact
      .map(
        (it) => `
      <li class="cond-item ${it.ok ? "is-met" : "is-miss"}">
        <span class="cond-badge">${it.ok ? "達成" : "未達"}</span>
        <div class="cond-body">
          <strong>${escapeHtml(it.label)}</strong>
          <span class="muted">${escapeHtml(it.progress)}</span>
        </div>
      </li>`
      )
      .join("");
    return `
      ${nav}
      <h2>契壇修行 · 進階</h2>
      <p class="lead">→【${escapeHtml(br.next.name)}】潮印 ${seal.seals}/${seal.max} · 全隊 ×${seal.mult.toFixed(2)}</p>
      <ul class="cond-list">${gateRowsCompact}</ul>
      <div class="row">
        <button type="button" class="primary${tutGlow({ type: "act", act: "break" })}" data-act="break" ${br.ready ? "" : "disabled"}>${escapeHtml(breakLabel)}</button>
        <button type="button" data-act="tide-seal" ${seal.canSeal ? "" : "disabled"}>鑄潮印${seal.canSeal ? `+${seal.nextGain}` : ""}</button>
      </div>`;
  }

  return `
    ${nav}
    <h2>契壇修行</h2>
    <p class="lead">御靈師【${escapeHtml(m.name)}】· 牧場 ${ranchN}／${ranchCap(state)} · 重心在靈寵</p>
    <div class="bar"><i data-live="qi-bar" style="width:${qiPct}%"></i></div>
    <p class="meta" data-live="qi-text">靈契 ${Math.floor(state.qi)} / ${next.need} · 【${escapeHtml(br.cur?.name || "")}】→【${escapeHtml(br.next.name)}】</p>
    ${
      tutorialQiReady(state)
        ? `<div class="row tut-cta-row"><button type="button" class="primary${tutGlow({ type: "panel-sub", group: "cultivate", id: "advance" })}" data-panel-sub="cultivate:advance">靈契已滿 → 前往突破</button></div>`
        : ""
    }
    <h3>練功地點 ×${(siteCur?.qiMult || 1).toFixed(2)}</h3>
    <div class="row tactics-row">${siteBtns}</div>
    ${trainLockNote}
    <p class="meta">${escapeHtml(siteCur?.desc || "")} · 飼料 ${Math.floor(state.feed || 0)}／靈塵 ${Math.floor(state.dust || 0)}</p>
    <h3>材料 <span class="meta-inline">用途／來源</span></h3>
    <div class="chip-row">${matChipsHtml()}</div>
    ${matHintListHtml()}
    <div class="row">
      <button type="button" data-act="use-breed-ticket" ${(state.materials?.breed_ticket || 0) < 1 ? "disabled" : ""}>催生符</button>
      <button type="button" data-act="use-blood-catalyst" ${(state.materials?.blood_catalyst || 0) < 1 ? "disabled" : ""}>血統催化</button>
    </div>
  `;
}

function petRow(p, extraBtn = "") {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  const title = displayPetName(p);
  const r = rarityInfo(p.rarity ?? 0);
  const g = petGeneration(p);
  return `
    <li class="card-row">
      <div>
        <button type="button" class="linkish" data-pet-detail="${uid}"><strong>${escapeHtml(title)}</strong></button>
        <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(g)} · Lv.${lv}${fus ? ` · 融${fus}` : ""} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}${p.personality2Name ? `/${escapeHtml(p.personality2Name)}` : ""}${p.bloodlineName && p.bloodlineName !== "無紋" ? `·${escapeHtml(p.bloodlineName)}` : ""}</span>
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
  const dv = dispatchView(state);
  const busy = new Set(dv.busyUids || []);
  const pick = new Set(dispatchPick);

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
      .slice(0, 4)
      .map((p) => {
        const onDisp = busy.has(p.uid);
        const selected = pick.has(p.uid);
        const extra = onDisp
          ? `<span class="muted">派遣中</span>`
          : `<button type="button" class="primary${tutGlow({ type: "deploy" })}" data-deploy="${escapeHtml(p.uid)}">出戰</button>
             <button type="button" class="${selected ? "primary" : ""}" data-dispatch-toggle="${escapeHtml(
               p.uid
             )}">${selected ? "已選派" : "選派"}</button>`;
        return petRow(p, extra);
      })
      .join("") ||
    `<li class="empty">牧場空。契約成功的靈寵會進入牧場（容量 ${cap}）。</li>`;

  const pending = (state.pending || [])
    .map(
      (c) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${escapeHtml(c.kind)}·${escapeHtml(c.elementName)}·${escapeHtml(c.personalityName)} · 攻${c.atk} 血${c.hp} 速${c.spd}</span>
          <span class="muted">技能【${escapeHtml(c.skillName)}】· 成功率 ${Math.round(c.bondRate * 100)}%${Math.round(Math.min(0.95, c.bondRate + BOND_FEED_BONUS) * 100) !== Math.round(c.bondRate * 100) ? `（飼料→${Math.round(Math.min(0.95, c.bondRate + BOND_FEED_BONUS) * 100)}%）` : ""} · ${c.cost} 靈石</span>
        </div>
        <div class="row-actions">
          <button type="button" class="primary" data-try-bond="${escapeHtml(c.encounterId)}">契約</button>
          <button type="button" data-try-bond-feed="${escapeHtml(c.encounterId)}">飼料契約（${BOND_FEED_COST}）</button>
          <button type="button" data-dismiss-pending="${escapeHtml(c.encounterId)}">放過</button>
        </div>
      </li>`
    )
    .join("") ||
    `<li class="empty">尚無待契約靈寵。去秘境打本，隨機遇見後會出現喺呢度（最多 ${PENDING_BOND_MAX} 隻）。</li>`;

  const activeDisp =
    dv.active
      .map((d) => {
        const left = Math.ceil((d.leftMs || 0) / 1000);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(d.missionName)}</strong>
            <span class="muted">${escapeHtml(d.petNames)} · ${d.ready ? "已歸來" : `剩餘 ${left}s`}</span>
          </div>
          <button type="button" class="primary" data-claim-dispatch="${escapeHtml(d.dispatchId)}" ${
            d.ready ? "" : "disabled"
          }>領獎</button>
        </li>`;
      })
      .join("") || `<li class="empty">尚無進行中派遣。</li>`;

  const missionRows = dv.missions
    .slice(0, 3)
    .map((m) => {
      const can = !m.locked && dispatchPick.length === m.needPets && dv.slotsUsed < dv.slotsMax;
      const matBits = dispatchMatBits(m);
      return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(m.name)}</strong>
          <span class="muted">${escapeHtml(m.desc)} · ${escapeHtml(rewardBitsHtml(m.reward))}${
            matBits ? ` · ${matBits}` : ""
          }${m.locked ? ` · 需${escapeHtml(m.lockLabel)}` : ""}</span>
        </div>
        <button type="button" class="primary" data-start-dispatch="${m.id}" ${can ? "" : "disabled"}>${
          m.locked ? "未解鎖" : "派出"
        }</button>
      </li>`;
    })
    .join("");

  const syn = partySynergy(state.pets);
  const synNote = syn.labels.length ? syn.labels.join("、") : "同元素／種類／親子可羈絆";

  const nav = panelSubNav("party", [
    { id: "fight", label: "出戰" },
    { id: "ranch", label: "牧場" },
    { id: "dispatch", label: "派遣" },
    { id: "bond", label: "待契" },
  ]);
  const sub = panelSub.party;

  if (sub === "ranch") {
    return `
      ${nav}
      <h2>靈寵 · 牧場</h2>
      <p class="lead">牧場 ${ranch.length}/${cap}</p>
      <div class="row"><button type="button" class="primary${tutGlow({ type: "act", act: "open-breed" })}" data-act="open-breed">繁殖</button></div>
      <ul class="list">${ranchList}</ul>`;
  }
  if (sub === "dispatch") {
    return `
      ${nav}
      <h2>靈寵 · 派遣</h2>
      <p class="lead">槽位 ${dv.slotsUsed}/${dv.slotsMax} · 已選 ${dispatchPick.length} 隻</p>
      <ul class="list">${missionRows}</ul>
      <ul class="list">${activeDisp}</ul>`;
  }
  if (sub === "bond") {
    return `
      ${nav}
      <h2>靈寵 · 待契約</h2>
      <p class="lead">待契約 ${(state.pending || []).length}/${PENDING_BOND_MAX}</p>
      <ul class="list">${pending}</ul>`;
  }

  return `
    ${nav}
    <h2>靈寵 · 出戰</h2>
    <p class="lead">${state.pets.length}/${ACTIVE_PET_MAX} · ${escapeHtml(synNote)}</p>
    <ul class="list">${roster}</ul>
  `;
}

function statRangeHtml(range) {
  if (!range) return "—";
  const [lo, hi] = range;
  return lo === hi ? `+${lo}` : `+${lo}～${hi}`;
}

function breedPreviewHtml(preview, matAfford) {
  if (!preview) return "";
  const outcomeRows = preview.outcomes
    .map(
      (o) =>
        `<li class="breed-outcome breed-outcome-${o.kind}"><span>${escapeHtml(o.label)}</span>${
          o.pct != null ? `<strong>${o.pct}%</strong>` : ""
        }</li>`
    )
    .join("");
  const genChips = preview.genOdds
    .map((o) => `<span class="breed-chip">${escapeHtml(genLabel(o.gen))} ${o.pct}%</span>`)
    .join("");
  const sp = preview.statPreview;
  return `
    <div class="breed-preview">
      <h3>繁殖預覽</h3>
      <p class="meta">${escapeHtml(preview.parentNames[0])} × ${escapeHtml(preview.parentNames[1])}</p>
      <ul class="breed-outcomes">${outcomeRows}</ul>
      <div class="breed-chip-row">${genChips}</div>
      <p class="meta">物種池：${escapeHtml(preview.speciesHint)} · 屬性突變 ~${Math.round(
        preview.elemRate * 100
      )}%</p>
      <p class="meta">天生溢出（估）：攻${statRangeHtml(sp.atk)}／血${statRangeHtml(sp.hp)}／速${statRangeHtml(
        sp.spd
      )}</p>
      ${preview.awakenNote ? `<p class="breed-awaken">${escapeHtml(preview.awakenNote)}</p>` : ""}
      <p class="meta">消耗：${preview.stoneCost} 靈石${matAfford ? ` · ${matAfford}` : ""}</p>
    </div>`;
}

function lineageHtml(lineage) {
  if (!lineage?.hasLineage) {
    return `<h3>血統</h3><p class="meta">原生靈寵，無繁殖紀錄。</p>`;
  }
  const parentRows =
    lineage.parents.length > 0
      ? lineage.parents
          .map((p) => {
            if (p.exists) {
              return `<li><button type="button" class="linkish" data-pet-detail="${escapeHtml(p.uid)}">${escapeHtml(
                p.name
              )}</button> <span class="muted">${escapeHtml(p.speciesName)} · ${escapeHtml(genLabel(p.generation))}</span></li>`;
            }
            return `<li><span class="muted">${escapeHtml(p.name)}</span></li>`;
          })
          .join("")
      : `<li class="muted">無父母紀錄</li>`;
  const childRows =
    lineage.children.length > 0
      ? lineage.children
          .map(
            (c) =>
              `<li><button type="button" class="linkish" data-pet-detail="${escapeHtml(c.uid)}">${escapeHtml(
                c.name
              )}</button> <span class="muted">${escapeHtml(c.speciesName)} · ${escapeHtml(genLabel(c.generation))}${
                c.deployed ? " · 出戰" : ""
              }</span></li>`
          )
          .join("")
      : `<li class="muted">尚無子代</li>`;
  return `
    <h3>血統</h3>
    <p class="meta">本體 ${escapeHtml(genLabel(lineage.generation))}</p>
    <p class="meta"><strong>父母</strong></p>
    <ul class="lineage-list">${parentRows}</ul>
    <p class="meta"><strong>子代</strong>（${lineage.children.length}）</p>
    <ul class="lineage-list">${childRows}</ul>`;
}

function petsBreedView() {
  const bs = breedStatus(state);
  const ranch = state.ranch || [];
  const selected = new Set(petView.breedParents || []);
  const cdSec = Math.ceil(bs.cooldownLeftMs / 1000);
  const list =
    ranch
      .map((p) => {
        const on = selected.has(p.uid);
        const r = rarityInfo(p.rarity ?? 0);
        const lineBadge = p.bornFrom?.length
          ? `<span class="lineage-tag" title="有繁殖血統">血</span>`
          : "";
        return `
        <li class="card-row">
          <div>
            <strong>${lineBadge}${escapeHtml(displayPetName(p))}</strong>
            <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(
              petGeneration(p)
            )} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)} · Lv.${p.level ?? 1}</span>
          </div>
          <button type="button" class="${on ? "primary" : ""}" data-breed-toggle="${escapeHtml(p.uid)}">${on ? "已選" : "選擇"}</button>
        </li>`;
      })
      .join("") || `<li class="empty">牧場需要至少兩隻靈寵才能繁殖。</li>`;

  const [ua, ub] = petView.breedParents || [];
  const pa = ranch.find((p) => p.uid === ua);
  const pb = ranch.find((p) => p.uid === ub);
  const preview = pa && pb ? breedPreview(pa, pb) : null;
  const bMat =
    pa && pb
      ? breedMatCost(petGeneration(pa), petGeneration(pb))
      : { coral_shard: 1 };
  const bMatHtml = matAffordHtml(bMat);

  const ready = selected.size === 2 && bs.ready && ranch.length < ranchCap(state);
  return `
    <h2>繁殖</h2>
    ${preview ? breedPreviewHtml(preview, bMatHtml) : `<p class="lead">${BREED_STONE_COST} 石＋材料 · 選擇雙親預覽結果</p>`}
    ${!bs.ready ? `<p class="meta">冷卻 ${cdSec}s</p>` : ""}
    <ul class="list">${list}</ul>
    <div class="row">
      <button type="button" class="primary" data-breed-confirm ${ready ? "" : "disabled"}>確認（${selected.size}/2）</button>
      <button type="button" data-pet-back>返回</button>
    </div>`;
}

function petsDetailView() {
  const detail = petDetail(state, petView.uid);
  if (!detail) {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
    return petsListView();
  }
  const {
    pet,
    deployed,
    upgradeCost,
    upgradeFeedCost: feedCost,
    fuseCostHint,
    skill,
    fuseMaxed,
    fuseNeedLevel,
    fuseTotalPets,
    fuseMatNeed,
    nextFusionStage,
    skillLevel,
    skillDustCost: dustCost,
    skillMaxed,
    secondSkill,
    secondUnlocked,
    baseline,
    innateBonus,
  } = detail;
  const lv = pet.level ?? 1;
  const fus = pet.fusionLevel ?? 0;
  const r = rarityInfo(pet.rarity ?? 0);
  const g = petGeneration(pet);
  const loc = deployed ? "出戰中" : "牧場待命";
  const fuseHint = fuseMaxed
    ? `已達融階上限（${FUSION_MAX_STAGE}）`
    : `下一融階 ${nextFusionStage}：主體≥Lv.${fuseNeedLevel}、共 ${fuseTotalPets} 隻（${fuseMatNeed} 素材）· ${fuseCostHint} 石`;

  const secondLine = secondUnlocked
    ? `【${escapeHtml(secondSkill?.name || "—")}】${secondSkill ? ` ${escapeHtml(secondSkill.desc)}（CD${secondSkill.cd}）` : ""}`
    : `未解鎖（融階≥1 或 Lv≥15）`;

  const matUp = upgradeMatCost(lv);
  const matUpHtml = matAffordHtml(matUp);
  const lineage = petLineage(state, pet.uid);
  return `
    <h2>${escapeHtml(displayPetName(pet))}</h2>
    <p class="lead">${escapeHtml(loc)} · ${genTagHtml(g)} · Lv.${lv} 融${fus}</p>
    <ul class="skill-list">
      <li><strong>屬性</strong> — ${escapeHtml(pet.kind)}·${escapeHtml(pet.elementName)} · <span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span></li>
      <li><strong>性格</strong> — ${escapeHtml(pet.personalityName)}${pet.personality2Name ? `／${escapeHtml(pet.personality2Name)}` : ""}${pet.bloodlineName && pet.bloodlineName !== "無紋" ? ` · 血脈${escapeHtml(pet.bloodlineName)}` : ""}</li>
      <li><strong>戰力</strong> — 攻${pet.atk} 血${pet.hp} 速${pet.spd}</li>
      <li><strong>技能</strong> — 【${escapeHtml(pet.skillName || skill?.name || "—")}】Lv.${skillLevel}</li>
      <li><strong>升級</strong> — ${upgradeCost}石／${feedCost}料＋${matUpHtml || "潮露×1"}</li>
    </ul>
    ${lineageHtml(lineage)}
    <div class="row gear-row">
      <label>暱稱<input type="text" maxlength="${NICK_MAX_LEN}" data-nick-input value="${escapeHtml(pet.nick || "")}" placeholder="${escapeHtml(pet.name)}" /></label>
      <button type="button" data-rename="${escapeHtml(pet.uid)}">命名</button>
    </div>
    <div class="row">
      <button type="button" class="primary" data-upgrade="${escapeHtml(pet.uid)}">升級</button>
      <button type="button" data-upgrade-feed="${escapeHtml(pet.uid)}">飼料升</button>
      <button type="button" data-upgrade-skill="${escapeHtml(pet.uid)}" ${skillMaxed ? "disabled" : ""}>技能</button>
      <button type="button" data-temper-oil="${escapeHtml(pet.uid)}" ${(state.materials?.temper_oil || 0) < 1 ? "disabled" : ""}>洗性格${(state.materials?.temper_oil || 0) > 0 ? `（${state.materials.temper_oil}）` : ""}</button>
    </div>
    <div class="row">
      <button type="button" data-start-fuse="${escapeHtml(pet.uid)}" ${fuseMaxed ? "disabled" : ""}>融合</button>
      ${
        deployed
          ? `<button type="button" data-undeploy="${escapeHtml(pet.uid)}">撤回</button>`
          : `<button type="button" data-deploy="${escapeHtml(pet.uid)}">出戰</button>`
      }
      <button type="button" data-release="${escapeHtml(pet.uid)}">放歸</button>
      <button type="button" data-pet-back>返回</button>
    </div>`;
}

function petsFuseView() {
  const baseDetail = petDetail(state, petView.fuseBase);
  if (!baseDetail || baseDetail.fuseMaxed) {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [] };
    return petsListView();
  }
  const base = baseDetail.pet;
  const target = baseDetail.nextFusionStage;
  const needMats = baseDetail.fuseMatNeed;
  const needLv = baseDetail.fuseNeedLevel;
  const cost = baseDetail.fuseCostHint;
  const selected = new Set(petView.fuseMats || []);
  const baseLv = base.level ?? 1;
  const lvOk = baseLv >= needLv;

  const owned = [...state.pets, ...(state.ranch || [])].filter(
    (p) => p.uid !== base.uid && p.speciesId === base.speciesId
  );

  const mats =
    owned
      .map((p) => {
        const on = selected.has(p.uid);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="muted">素材（等級不計）· 融${p.fusionLevel ?? 0} · 攻${p.atk} 血${p.hp} 速${p.spd}</span>
          </div>
          <button type="button" class="${on ? "primary" : ""}" data-fuse-toggle="${escapeHtml(p.uid)}">${on ? "已選" : "選擇"}</button>
        </li>`;
      })
      .join("") ||
    `<li class="empty">沒有同種族（${escapeHtml(base.speciesName)}）可作素材。</li>`;

  const ready = lvOk && selected.size === needMats;
  return `
    <h2>融合 · 融階 ${target}</h2>
    <p class="lead">主體 ${escapeHtml(base.name)} Lv.${baseLv}${lvOk ? "" : `（需 ≥${needLv}）`} · 已選素材 ${selected.size}/${needMats} · 耗 ${cost} 靈石 · 結果繼承主體等級</p>
    <ul class="list">${mats}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" class="primary" data-fuse-confirm ${ready ? "" : "disabled"}>確認融合</button>
      <button type="button" data-pet-detail="${escapeHtml(base.uid)}">返回詳情</button>
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsPanel() {
  if (petView.mode === "detail") return petsDetailView();
  if (petView.mode === "fuse") return petsFuseView();
  if (petView.mode === "breed") return petsBreedView();
  return petsListView();
}

function codexPanel() {
  const dex = bestiaryStatus(state);
  const speciesRows = bestiarySpeciesSummary(state)
    .filter((s) => s.found > 0 || !s.breedOnly)
    .slice(0, 48)
    .map((s) => {
      const pct = Math.min(100, Math.round((s.found / Math.max(1, s.total)) * 100));
      return `<li class="card-row">
        <div>
          <strong>${escapeHtml(s.speciesName)}</strong>
          <span class="muted">${escapeHtml(s.kind)}${s.breedOnly ? "·雜交" : ""} · ${s.found}/${s.total}</span>
          <div class="bar thin"><i style="width:${pct}%"></i></div>
        </div>
      </li>`;
    })
    .join("");

  const pathTracks = pathQuestsView(state)
    .map((tr) => {
      const rows = tr.items
        .map((q) => {
          const status = q.claimed ? "已領" : q.ok ? "可領" : q.progress;
          return `<li class="card-row">
            <div>
              <strong>${escapeHtml(q.name)}</strong>
              <span class="muted">${escapeHtml(q.desc)} · ${escapeHtml(String(status))}</span>
            </div>
            <button type="button" class="primary" data-claim-path="${q.id}" ${q.canClaim ? "" : "disabled"}>${q.claimed ? "已領" : "領獎"}</button>
          </li>`;
        })
        .join("");
      return `<h3>求道 · ${escapeHtml(tr.trackName)}</h3><ul class="list">${rows}</ul>`;
    })
    .join("");

  const dailies = dailyView(state)
    .slice(0, 3)
    .map((q) => {
      const status = q.claimed ? "已領" : q.done ? "可領" : `${q.progress}/${q.need}`;
      return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(q.name)}</strong>
            <span class="muted">${escapeHtml(q.desc)} · ${status}</span>
          </div>
          <button type="button" class="primary" data-claim-daily="${q.id}" ${q.done && !q.claimed ? "" : "disabled"}>領獎</button>
        </li>`;
    })
    .join("");

  const ach = achievementsView(state)
    .slice(0, 3)
    .map(
      (a) => `
      <li class="card-row">
        <div>
          <strong>${a.done ? "✓ " : ""}${escapeHtml(a.name)}</strong>
          <span class="muted">${escapeHtml(a.desc)}</span>
        </div>
        <span class="muted">${a.done ? "已達成" : "未完成"}</span>
      </li>`
    )
    .join("");

  return `
    ${panelSubNav("codex", [
      { id: "dex", label: "圖鑑" },
      { id: "path", label: "求道" },
      { id: "tasks", label: "任務" },
      { id: "recipe", label: "配方" },
    ])}
    ${
      panelSub.codex === "dex"
        ? `<h2>靈寵圖鑑</h2>
    <p class="lead">已錄 ${dex.discovered}/${dex.total}${dex.label ? ` · ${escapeHtml(dex.label)}` : ""} · 種×屬×性格×血脈</p>
    <ul class="list">${speciesRows || '<li class="empty">尚未登錄</li>'}</ul>`
        : panelSub.codex === "path"
          ? `<h2>求道</h2>
    <p class="lead">長線目標：收集／育成／挑戰</p>
    ${pathTracks}`
        : panelSub.codex === "tasks"
          ? `<h2>任務</h2>
    ${breedGoalsBoardHtml(true)}
    <h3>每日</h3>
    <ul class="list">${dailies}</ul>
    <h3>成就</h3>
    <ul class="list">${ach}</ul>`
          : `<h2>繁殖配方</h2>
    <h3>雜交（種類對）</h3>
    <ul class="recipe-sum">${hybridRecipeSummary()
      .filter((r) => r.tier === "main")
      .map(
        (r) =>
          `<li><strong>${escapeHtml(r.kindsLabel)}</strong> → ${escapeHtml(r.name)} <span class="muted">${Math.round(
            r.chance * 100
          )}%</span></li>`
      )
      .join("")}</ul>
    <h3>三代種（雜交×雜交）</h3>
    <ul class="recipe-sum">${hybridRecipeSummary()
      .filter((r) => r.tier === "tertiary")
      .map(
        (r) =>
          `<li><strong>${escapeHtml(r.kindsLabel)}</strong> → ${escapeHtml(r.name)} <span class="muted">約${Math.round(
            (r.chance || 0.15) * 100
          )}%</span></li>`
      )
      .join("")}</ul>`
    }
  `;
}

function dungeonPanel() {
  if (playback) {
    const pct = Math.min(
      100,
      Math.round((playback.index / Math.max(1, playback.events.length)) * 100)
    );
    const lines = playback.shown
      .slice()
      .reverse()
      .map((t, i) => {
        const revIdx = playback.shown.length - 1 - i;
        const ev = playback.events[revIdx];
        return combatLogLineHtml(t, ev);
      })
      .join("");
    const bd = playback.result?.rewardBreakdown;
    const breakdownHtml =
      playback.done && bd && playback.result.won
        ? `<ul class="cond-list reward-breakdown">
            <li class="cond-item is-met"><span class="cond-badge">基礎</span><div class="cond-body"><strong>通關獎勵</strong><span class="muted">+${bd.base.stones}石／${bd.base.scrap}碎片</span></div></li>
            ${
              bd.firstClear?.stones
                ? `<li class="cond-item is-met"><span class="cond-badge">首通</span><div class="cond-body"><strong>首通加成</strong><span class="muted">+${bd.firstClear.stones}石</span></div></li>`
                : ""
            }
            ${
              bd.daily
                ? `<li class="cond-item is-met"><span class="cond-badge">今日</span><div class="cond-body"><strong>${escapeHtml(
                    bd.daily.label || "今日修飾"
                  )}</strong><span class="muted">+${bd.daily.stones || 0}石／${bd.daily.scrap || 0}碎片</span></div></li>`
                : ""
            }
            ${
              bd.challenge
                ? condStatusRow(
                    bd.challenge.label.replace(/^挑戰[:：]?\s*/, "挑戰："),
                    bd.challenge.ok,
                    bd.challenge.ok
                      ? `+${bd.challenge.stones || 0}石${
                          bd.challenge.scrap ? `／${bd.challenge.scrap}碎片` : ""
                        }`
                      : "",
                    "未滿足·本場無挑戰獎"
                  )
                : ""
            }
            ${
              bd.elite
                ? `<li class="cond-item is-met"><span class="cond-badge">精英</span><div class="cond-body"><strong>擊破精英</strong><span class="muted">+${bd.elite.stones || 0}石</span></div></li>`
                : ""
            }
            ${
              bd.boss
                ? `<li class="cond-item is-met"><span class="cond-badge">BOSS</span><div class="cond-body"><strong>擊破 BOSS</strong><span class="muted">+${bd.boss.stones || 0}石</span></div></li>`
                : ""
            }
            ${(bd.conditions || [])
              .map((c) =>
                condStatusRow(
                  c.label.replace(/^條件[:：]?\s*/, ""),
                  c.ok,
                  c.ok ? c.bits : "",
                  "未滿足·本場無此獎"
                )
              )
              .join("")}
            ${
              bd.trial
                ? condStatusRow(
                    bd.trial.label.replace(/^試煉[:：]?\s*/, "試煉："),
                    bd.trial.ok,
                    bd.trial.ok ? `+${bd.trial.stones}石` : "",
                    "未滿足·本場無此獎"
                  )
                : ""
            }
            <li class="cond-item is-met"><span class="cond-badge">合計</span><div class="cond-body"><strong>+${bd.totalStones} 靈石</strong><span class="muted">各項分開累加</span></div></li>
          </ul>`
        : "";
    /* 結束後只顯示結算，不保留戰報流水 */
    const logBlock = playback.done
      ? ""
      : `<div class="combat-scroll" data-live="combat-scroll">
        <ul class="combat" data-live="combat-log">${lines}</ul>
      </div>`;
    return `
      <h2>${playback.done ? "結算" : "戰報"}</h2>
      ${renderCombatRoster(playback)}
      <p class="lead" data-live="combat-meta">${escapeHtml(combatPlaybackMeta(playback))}</p>
      <div class="bar combat-bar"><i data-live="combat-bar" style="width:${pct}%"></i></div>
      ${logBlock}
      ${breakdownHtml}
      <div class="row">
        <button type="button" data-act="skip-combat" ${playback.done ? "hidden" : ""}>跳過動畫</button>
        <button type="button" data-act="clear-combat" ${playback.done ? "" : "disabled"}>返回秘境</button>
      </div>
    `;
  }

  const dailyMod = dungeonDailyView(state);
  const tactics = tacticsView(state);
  const tacticBtns = tactics
    .map(
      (t) =>
        `<button type="button" class="${t.selected ? "primary" : ""}" data-set-tactics="${t.id}">${escapeHtml(
          t.name
        )}</button>`
    )
    .join("");
  const tacticCur = tactics.find((t) => t.selected);
  const formations = formationView(state);
  const formBtns = formations
    .map(
      (f) =>
        `<button type="button" class="${f.selected ? "primary" : ""}" data-set-formation="${f.id}">${escapeHtml(
          f.name
        )}</button>`
    )
    .join("");
  const formCur = formations.find((f) => f.selected);

  const dungeonIds = dungeonsForRealm(state.realm).filter((id) => resolveDungeon(state, id));
  if (dungeonIdx >= dungeonIds.length) dungeonIdx = 0;
  const curId = dungeonIds[dungeonIdx];
  const dCur = curId ? resolveDungeon(state, curId) : null;
  const stCur = dCur ? dungeonStatus(state, dCur.id) : null;
  const tutWaiveDungeon = dCur ? tutorialWaivesDungeonChallenge(state, dCur.id) : false;
  const locked = dCur ? state.realm < dCur.needRealm : true;
  const cdSec = stCur ? Math.ceil(stCur.cooldownLeftMs / 1000) : 0;
  const onCd = cdSec > 0;
  const clearNote = stCur?.cleared ? "已通" : `首通+${dCur?.firstClearBonus?.stones || 0}石`;
  const roles = stCur?.roles;
  const waveN = roles?.waves || (dCur ? dungeonWaves(dCur).length : 0);
  const roleBits = roles ? `${waveN}波 普${roles.normal}/精${roles.elite}/王${roles.boss}` : `${waveN}波`;
  const trial = stCur?.trial;
  const conds = (stCur?.conditions || []).filter((c) => !c.passive);
  const passives = (stCur?.conditions || []).filter((c) => c.passive);
  const condList = tutWaiveDungeon
    ? `<li class="cond-item is-met is-tut-waive"><span class="cond-badge">教學</span><div class="cond-body"><strong>教學模式</strong><span class="muted">今日挑戰／試煉條件已豁免，可直接進攻</span></div></li>`
    : conds
        .slice(0, 2)
        .map((c) => condStatusRow(c.label.replace(/^條件[:：]?\s*/, ""), c.ok, rewardBitsHtml(c.bonus), c.reason))
        .join("");
  const trialRow =
    tutWaiveDungeon || !trial
      ? ""
      : condStatusRow(
          trial.label.replace(/^試煉[:：]?\s*/, "試煉："),
          stCur.trialMet,
          `+${trial.bonus?.stones || 0}石`,
          stCur.trialReason || "未滿足"
        );
  const challengeRow =
    tutWaiveDungeon || !stCur?.challenge
      ? ""
      : condStatusRow(
          stCur.challenge.label.replace(/^挑戰[:：]?\s*/, "挑戰："),
          stCur.challengeMet,
          rewardBitsHtml(stCur.challenge.bonus),
          stCur.challengeReason || "未滿足"
        );
  const passiveLine = passives.map((p) => p.label).join(" · ");
  const variantLine = dCur?.dailyVariantLabel
    ? `<span class="muted daily-variant">今日：${escapeHtml(dCur.dailyVariantLabel)}</span>`
    : "";
  const dungeonCard = dCur
    ? `<li class="dungeon-card">
        <div class="dungeon-head">
          <div>
            <strong>${escapeHtml(dCur.name)}</strong>
            ${variantLine}
            <span class="muted">${escapeHtml(roleBits)} · ${dCur.reward.stones}石 · ${clearNote}${
              locked ? ` · 需${escapeHtml(stageAt(dCur.needRealm).name)}` : ""
            }${onCd ? ` · CD ${cdSec}s` : ""}</span>
            ${passiveLine ? `<span class="muted">${escapeHtml(passiveLine)}</span>` : ""}
          </div>
          <button type="button" class="primary${tutGlow({ type: "dungeon", dungeonId: dCur.id })}" data-dungeon="${dCur.id}" ${locked || onCd ? "disabled" : ""}>進攻</button>
        </div>
        <ul class="cond-list">${tutWaiveDungeon ? condList : `${challengeRow}${condList}${trialRow}`}</ul>
      </li>`
    : `<li class="empty">尚無可挑戰秘境。</li>`;
  const pager =
    dungeonIds.length > 1
      ? `<div class="dungeon-pager">
          <button type="button" data-dungeon-prev ${dungeonIdx <= 0 ? "disabled" : ""}>上一層</button>
          <span>${dungeonIdx + 1} / ${dungeonIds.length}</span>
          <button type="button" data-dungeon-next ${dungeonIdx >= dungeonIds.length - 1 ? "disabled" : ""}>下一層</button>
        </div>`
      : "";

  return `
    ${panelSubNav("dungeon", [
      { id: "field", label: "秘境" },
      { id: "setup", label: "戰術" },
    ])}
    ${
      panelSub.dungeon === "setup"
        ? `<h2>戰術／陣型</h2>
    <p class="meta">${escapeHtml(tacticCur?.desc || "")}</p>
    <div class="row tactics-row">${tacticBtns}</div>
    <p class="meta">${escapeHtml(formCur?.desc || "")}</p>
    <div class="row tactics-row">${formBtns}</div>
    ${
      dailyMod
        ? `<ul class="cond-list"><li class="cond-item is-met"><span class="cond-badge">今日</span><div class="cond-body"><strong>${escapeHtml(
            dailyMod.label
          )}</strong></div></li></ul>`
        : ""
    }`
        : `<h2>潮汐秘境</h2>
    <p class="lead">波次自動戰鬥 · 逐層翻頁</p>
    <ul class="list dungeon-list">${dungeonCard}</ul>
    ${pager}`
    }
  `;
}

function logPanel() {
  const lines = state.log.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
  return `<h2>見聞錄</h2><div class="log-scroll"><ul class="log">${lines || "<li class='empty'>尚無見聞。</li>"}</ul></div>`;
}

function bind() {
  app.querySelectorAll("[data-panel-sub]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const [group, id] = (btn.dataset.panelSub || "").split(":");
      if (!group || !id || panelSub[group] === id) return;
      if (group === "cultivate" && isCultivateSubLocked(state, id)) return;
      if (group === "party" && isPartySubLocked(state, id)) return;
      if (group === "dungeon" && isDungeonSubLocked(state, id)) return;
      panelSub = { ...panelSub, [group]: id };
      markTutorialSubVisit(group, id);
      render();
    });
  });
  app.querySelectorAll("[data-dungeon-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || dungeonIdx <= 0) return;
      dungeonIdx -= 1;
      render();
    });
  });
  app.querySelectorAll("[data-dungeon-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      dungeonIdx += 1;
      render();
    });
  });
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
        if (r.lateTutorial?.started && r.lateTutorial.msg) {
          setFlash(r.msg, "unlock");
        } else {
          setFlash(r.msg);
        }
      } else if (act === "forge") {
        setFlash("人物裝備與鍛造已廢止。");
      } else if (act === "tide-seal") {
        const r = tryTideSeal(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "start-breed" || act === "open-breed") {
        if (tutorialActive(state) && state.tutorial.step === "breed_intro") {
          const adv = markTutorialFlag(state, "breedVisited");
          if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
        }
        petView = { mode: "breed", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
        render();
      } else if (act === "use-breed-ticket") {
        const r = useBreedTicket(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "use-blood-catalyst") {
        const r = useBloodCatalyst(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "clear-offline") {
        clearOfflineHint(state);
        saveState(state);
        render();
      } else if (act === "skip-tutorial") {
        const r = skipTutorial(state);
        saveState(state);
        render();
        setFlash(r.msg, "unlock");
      } else if (act === "pwa-install") {
        if (!pwaInstallEvt) {
          setFlash("此裝置暫不支援安裝。");
          return;
        }
        pwaInstallEvt.prompt();
        pwaInstallEvt.userChoice.finally(() => {
          pwaInstallEvt = null;
          render();
        });
      } else if (act === "pwa-dismiss") {
        pwaDismissed = true;
        localStorage.setItem("void-tide-pwa-dismiss", "1");
        render();
      } else if (act === "notify-perm") {
        if (typeof Notification === "undefined") {
          setFlash("此環境不支援通知。");
          return;
        }
        Notification.requestPermission().then((p) => {
          setFlash(p === "granted" ? "已開啟離線通知" : "未授權通知");
          if (p === "granted" && state.offlineHint) maybeNotifyOffline(state.offlineHint);
        });
      } else if (act === "reset") {
        if (confirm("確定清除存檔？")) {
          stopPlayback();
          state = resetSave();
          petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
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
  app.querySelectorAll("[data-breed-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.breedToggle;
      const set = new Set(petView.breedParents || []);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= 2) {
          setFlash("最多選兩隻雙親。");
          return;
        }
        set.add(uid);
      }
      petView = { ...petView, breedParents: [...set] };
      render();
    });
  });
  app.querySelectorAll("[data-breed-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const [a, b] = petView.breedParents || [];
      const r = tryBreed(state, a, b);
      saveState(state);
      if (r.ok) {
        petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      }
      render();
      let tone = "";
      if (r.ok && r.celebrate) {
        if (r.hybrid) tone = "hybrid";
        else if ((r.rarity ?? 0) >= 3) tone = "legend";
        else tone = "celebrate";
      }
      setFlash(r.msg, tone);
    });
  });
  app.querySelectorAll("[data-claim-breed-goal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = claimBreedGoal(state, btn.dataset.claimBreedGoal);
      saveState(state);
      render();
      setFlash(r.msg, r.ok ? "celebrate" : "");
    });
  });
  app.querySelectorAll("[data-try-bond]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = tryBondPending(state, btn.dataset.tryBond, false);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-try-bond-feed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = tryBondPending(state, btn.dataset.tryBondFeed, true);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-path]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = claimPathQuest(state, btn.dataset.claimPath);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade-feed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = upgradePet(state, btn.dataset.upgradeFeed, "feed");
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = upgradePetSkill(state, btn.dataset.upgradeSkill);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-temper-oil]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = useTemperOil(state, btn.dataset.temperOil);
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
      if (!confirm("確定放歸？將返還部分靈石／飼料／靈塵。")) return;
      const r = releasePet(state, btn.dataset.release);
      saveState(state);
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-rename]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = app.querySelector("[data-nick-input]");
      const r = renamePet(state, btn.dataset.rename, input?.value || "");
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-daily]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = claimDaily(state, btn.dataset.claimDaily);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-shop-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyShopOffer(state, btn.dataset.shopBuy);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-set-tactics]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = setTactics(state, btn.dataset.setTactics);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-set-formation]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = setFormation(state, btn.dataset.setFormation);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-set-train]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = setTrainSite(state, btn.dataset.setTrain);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dispatch-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.dispatchToggle;
      const set = new Set(dispatchPick);
      if (set.has(uid)) set.delete(uid);
      else set.add(uid);
      dispatchPick = [...set].slice(0, 3);
      render();
    });
  });
  app.querySelectorAll("[data-start-dispatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = startDispatch(state, btn.dataset.startDispatch, dispatchPick);
      if (r.ok) dispatchPick = [];
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-dispatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = claimDispatch(state, btn.dataset.claimDispatch);
      saveState(state);
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
      petView = { mode: "detail", uid: btn.dataset.petDetail, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
    });
  });
  app.querySelectorAll("[data-start-fuse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = {
        mode: "fuse",
        uid: null,
        fuseBase: btn.dataset.startFuse,
        fuseMats: [],
        breedParents: [],
      };
      render();
    });
  });
  app.querySelectorAll("[data-fuse-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.fuseToggle;
      const detail = petDetail(state, petView.fuseBase);
      const need = detail?.fuseMatNeed ?? 0;
      const set = new Set(petView.fuseMats || []);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= need) {
          setFlash(`最多選 ${need} 隻素材。`);
          return;
        }
        set.add(uid);
      }
      petView = { ...petView, fuseMats: [...set] };
      render();
    });
  });
  app.querySelectorAll("[data-fuse-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const baseUid = petView.fuseBase;
      const mats = petView.fuseMats || [];
      const d = petDetail(state, baseUid);
      if (!d || d.fuseMaxed) {
        setFlash("無法融合。");
        return;
      }
      if (
        !confirm(
          `將 ${mats.length} 隻素材融入 ${d.pet.name}？\n目標融階 ${d.nextFusionStage}｜繼承 Lv.${d.level}｜耗 ${d.fuseCostHint} 靈石`
        )
      ) {
        return;
      }
      const r = fusePets(state, baseUid, mats);
      saveState(state);
      if (r.ok) {
        petView = { mode: "detail", uid: baseUid, fuseBase: null, fuseMats: [], breedParents: [] };
      }
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
    });
  });
  app.querySelectorAll("[data-dungeon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (playback && !playback.done) return;
      tutMisclickCount = 0;
      const wasFight = tutorialActive(state) && state.tutorial.step === "dungeon_fight";
      if (wasFight) {
        if (!state.tutorial.flags) state.tutorial.flags = {};
        state.tutorial.flags.dungeonStarted = true;
      }
      const r = runDungeon(state, btn.dataset.dungeon);
      saveState(state);
      if (!r.ok) {
        setFlash(r.msg);
        return;
      }
      let adv = { advanced: false, unlockMsg: null };
      if (wasFight) {
        adv = advanceTutorialIfReady(state);
      }
      if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
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
ensureFlashHost();
ensureSpotlight();
if (flash) setFlash(flash, flashTone);
const lateBoot = maybeStartLateTutorial(state);
if (lateBoot.started) {
  saveState(state);
  render();
  setFlash(lateBoot.msg, "unlock");
}
maybeNotifyOffline(state.offlineHint);

document.addEventListener("click", onTutorialMisclick, true);
document.addEventListener("touchend", onTutorialMisclick, true);
window.addEventListener("resize", () => positionTutorialSpotlight(false));

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pwaInstallEvt = e;
  if (!pwaDismissed) render();
});

setInterval(() => {
  if (playback && !playback.done) return;
  patchLive();
  const adv = advanceTutorialIfReady(state);
  const snap = tutorialLiveSnapshot(state);
  if (adv.advanced || snap !== tutorialSnapCache) {
    tutorialSnapCache = snap;
    saveState(state);
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
    render();
    return;
  }
  saveState(state);
}, 1000);

function maybeNotifyOffline(hint) {
  if (!hint || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (maybeNotifyOffline._sent === hint.at) return;
  maybeNotifyOffline._sent = hint.at;
  try {
    new Notification("暗潮 · 離線結算", {
      body: `約 ${Math.round(hint.sec / 60)} 分鐘：靈契 +${Math.floor(hint.qi)}，飼料 +${hint.feed.toFixed(1)}，靈塵 +${hint.dust.toFixed(1)}`,
      icon: "./icons/icon.svg",
    });
  } catch {
    /* ignore */
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
