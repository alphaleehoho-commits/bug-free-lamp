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
  eggsView,
  startHatch,
  claimHatch,
  upgradePet,
  upgradePetSkill,
  fusePets,
  petDetail,
  runDungeon,
  runDungeonSweep,
  canDungeonSweep,
  dungeonSweepCost,
  startDungeonSummon,
  dungeonGateView,
  dungeonAttackBlockReason,
  isFusionUnlocked,
  forgeHint,
  tryBreed,
  claimBreed,
  breedStatus,
  breedBusyUids,
  BREED_QUEUE_MAX,
  breedPreview,
  petLineage,
  dungeonStatus,
  dungeonTeamPreview,
  resetSave,
  realmInfo,
  nextRealm,
  ranchCap,
  partySynergy,
  renamePet,
  clearOfflineHint,
  claimDaily,
  claimAllDailies,
  claimDailyAllClear,
  dailyAllClearView,
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
  trainMapView,
  trainIdleCombatView,
  createTrainIdleSession,
  stepTrainIdleSession,
  markTrainIdleClearReady,
  persistTrainIdleClearResult,
  claimTrainTierClear,
  challengeTrainWarden,
  setTrainDepth,
  trainDailySpotlightView,
  materialHintsView,
  dungeonDailyView,
  resolveDungeon,
  dungeonsForRealm,
  stageAt,
  upgradeMatCost,
  breedMatCost,
  skillMatCost,
  fusionMatCost,
  affordMaterials,
  primaryTrainSiteForMat,
  suggestTrainForShortage,
  TACTICS,
  FORMATIONS,
  FORMATION_IDS,
  FORMATION_SLOT_COUNT,
  formationAllyPlacement,
  formationFoePlacement,
  MATERIALS,
  pathQuestsView,
  claimPathQuest,
  useBreedTicket,
  useBloodCatalyst,
  useTemperOil,
  nextGoalView,
  dailyHubView,
  dismissDailyHub,
  loginStreakView,
  claimLoginStreak,
  abyssDiveView,
  startAbyssDive,
  advanceAbyssDive,
  retreatAbyssDive,
  buyAbyssInsurance,
  buyAbyssCosmetic,
  buyAbyssEgg,
} from "./engine.js";
import { DUNGEON_SUMMON_MIN, DUNGEON_SUMMON_MAX, clampDungeonSummonCount, TRAIN_DEPTH_MULT, TRAIN_TIER_COUNT } from "./data.js";
import { petIconHtml, petIconFromPet } from "./pet-icons.js";
import {
  tutorialActive,
  tutorialBannerHtml,
  syncTutorialNavigation,
  advanceTutorialIfReady,
  advanceTutorialCascade,
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
  tutorialBannerHint,
  tutorialNeedsRanchSub,
  tutorialEggReady,
} from "./tutorial.js";

const app = document.querySelector("#app");

/** 顯示用整數（除非指定保留小數） */
function fmtInt(n) {
  return String(Math.floor(Number(n) || 0));
}

function fmtMult(n) {
  return (Number(n) || 1).toFixed(2);
}

/** 材料／離線收益顯示（四捨五入到個位） */
function fmtMatQty(n) {
  return String(Math.round(Number(n) || 0));
}

function formatMatBits(mats) {
  if (!mats || !Object.keys(mats).length) return "";
  return Object.entries(mats)
    .map(([id, n]) => `${MATERIALS[id]?.name || id}×${fmtMatQty(n)}`)
    .join("／");
}

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
let summonCount = 1;
let sweepResult = null;
let shellReady = false;
/** @type {{ missionId: string, pick: string[] } | null} */
let dispatchModal = null;
/** @type {{ dungeonId: string, mode: 'single' | 'sweep' } | null} */
let attackPreview = null;
let pwaInstallEvt = null;
let pwaDismissed = localStorage.getItem("void-tide-pwa-dismiss") === "1";
let tutorialSnapCache = "";
let tutMisclickCount = 0;
let tutSpotlightEl = null;
/** Phase 2–5 UI chrome toggles */
let condSheetOpen = false;
let rewardDetailsOpen = false;
let tutorialCollapsed = false;
let matSectionOpen = false;
let trainRatesOpen = false;
let statsSheetOpen = false;
/** @type {"power" | "gen" | "rarity" | "element" | "status"} */
let ranchSort = "status";

const UI_PREFS_KEY = "void-tide-ui-prefs";

function loadUiPrefs() {
  try {
    const raw = sessionStorage.getItem(UI_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

function saveUiPrefs() {
  sessionStorage.setItem(
    UI_PREFS_KEY,
    JSON.stringify({ matSectionOpen, trainRatesOpen, ranchSort })
  );
}

const uiPrefsBoot = loadUiPrefs();
matSectionOpen = !!uiPrefsBoot.matSectionOpen;
trainRatesOpen = !!uiPrefsBoot.trainRatesOpen;
if (["power", "gen", "rarity", "element", "status"].includes(uiPrefsBoot.ranchSort)) {
  ranchSort = uiPrefsBoot.ranchSort;
}

const COMBAT_PREFS_KEY = "void-tide-combat-prefs";

function loadCombatPrefs() {
  try {
    const raw = localStorage.getItem(COMBAT_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { fastMode: true };
}

function saveCombatPrefs(prefs) {
  localStorage.setItem(COMBAT_PREFS_KEY, JSON.stringify(prefs));
}

let combatPrefs = loadCombatPrefs();

function isFarmCombat(result) {
  if (result?.combatKind === "train") return false;
  if (!result?.won) return false;
  const fc = result.rewardBreakdown?.firstClear;
  return !(fc && (fc.stones || fc.scrap));
}

function combatSpeedMult(result) {
  if (tutorialActive(state)) return 1;
  if (combatPrefs.fastMode && isFarmCombat(result)) return 0.12;
  return 1;
}
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
  const targets = findTutorialTargetElements(state, tutorialNavCtx());
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
  if (tutorialCollapsed) {
    tutorialCollapsed = false;
    render();
  }
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
  const targets = findTutorialTargetElements(state, tutorialNavCtx());
  app.querySelectorAll(".tut-glow").forEach((el) => el.classList.remove("tut-glow", "tut-flash-urgent"));
  if (!targets.length) {
    host.hidden = true;
    banner?.classList.remove("is-spotlight-active");
    return;
  }
  const el = targets[0];
  const isUrgent = urgent || tutMisclickCount >= 2;
  for (const t of targets) {
    t.classList.add("tut-glow");
    if (isUrgent) t.classList.add("tut-flash-urgent");
  }
  try {
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  } catch {
    /* ignore */
  }
  const r = el.getBoundingClientRect();
  host.hidden = false;
  host.classList.toggle("is-urgent", isUrgent);
  host.style.top = `${Math.max(4, r.top - 4)}px`;
  host.style.left = `${Math.max(4, r.left - 4)}px`;
  host.style.width = `${Math.max(8, r.width + 8)}px`;
  host.style.height = `${Math.max(8, r.height + 8)}px`;
  banner?.classList.add("is-spotlight-active");
}

function tutGlow(spec) {
  return tutorialGlowClass(state, spec, tutorialNavCtx());
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
  const html = tutorialBannerHtml(state, { collapsed: tutorialCollapsed });
  if (cur) {
    const wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    cur.replaceWith(wrap.firstElementChild);
  }
  positionTutorialSpotlight(false);
}

/** @type {{ mode: 'list' | 'detail' | 'fuse' | 'breed', uid: string | null, fuseBase: string | null, fuseMats: string[], breedParents: string[] }} */
let petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };

function tutorialNavCtx() {
  return { tab, panelSub, petDetail: petView.mode === "detail" };
}

function initTutorialNav() {
  if (!tutorialActive(state)) return;
  const step = state.tutorial.step;
  if ((step === "hatch_starter" || step === "hatch_second") && tutorialEggReady(state)) {
    tab = "party";
    panelSub = { ...panelSub, party: "ranch" };
    return;
  }
  const nav = syncTutorialNavigation(state, { tab, panelSub });
  tab = nav.tab;
  panelSub = nav.panelSub;
}

initTutorialNav();

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

/** 一次攻擊動畫各階段（ms；再乘 speedMult） */
const ATTACK_PHASE_MS = {
  windup: 130,
  lunge: 150,
  impact: 190,
  ret: 130,
  resolve: 200,
  resolveKo: 340,
};

function playbackDelayMs(event, speedMult = 1) {
  if (!event) return Math.round(LINE_MS * speedMult);
  let base = LINE_MS;
  if (event.type === "wave") base = 880;
  else if (event.type === "round") base = 680;
  else if (event.type === "heal") base = 540;
  else if (event.type === "strike") {
    // strike 用分階段動畫，呢度只作 fallback
    if (event.ko) base = 900;
    else if (event.skillName) base = 780;
    else base = 720;
  } else base = 380;
  return Math.max(40, Math.round(base * speedMult));
}

function waitAnimMs(ms, token) {
  return new Promise((resolve) => {
    const t = window.setTimeout(resolve, Math.max(0, ms));
    if (token?.timers) token.timers.push(t);
  });
}

function findCombatUnitEl(root, uid) {
  if (!root || !uid) return null;
  const esc = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(uid) : uid.replace(/"/g, '\\"');
  return (
    root.querySelector(`[data-combat-uid="${esc}"]`) ||
    root.querySelector(`[data-uid="${esc}"]`)
  );
}

function clearAttackFx(el) {
  if (!el) return;
  el.classList.remove(
    "is-attacker",
    "is-defender",
    "is-lunge-east",
    "is-lunge-west",
    "is-hit",
    "is-actor",
    "is-ko-flash"
  );
  el.style.transform = "";
  el.querySelectorAll(".cu-temp-buff, .cu-dmg, .cu-heal").forEach((n) => n.remove());
}

/** 攻方框推向守方框中心（向量輕撞） */
function lungeTowardTarget(actorEl, targetEl, distancePx = 12) {
  if (!actorEl || !targetEl) return;
  const a = actorEl.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  const tx = t.left + t.width / 2;
  const ty = t.top + t.height / 2;
  let dx = tx - ax;
  let dy = ty - ay;
  const len = Math.hypot(dx, dy) || 1;
  dx = (dx / len) * distancePx;
  dy = (dy / len) * distancePx;
  actorEl.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
}

/**
 * 完整一次攻擊動畫：
 * 1 攻方高亮+buff → 2 輕撞目標 → 3 守方淺紅+扣血 → 4 返回 → 5 清高亮／數字fade／死亡fade
 */
async function playAttackSequence(opts) {
  const {
    rosterRoot,
    actorUid,
    targetUid,
    dmg = null,
    heal = null,
    ko = false,
    buffText = null,
    targetBuff = null,
    targetHp = null,
    targetMaxHp = null,
    speedMult = 1,
    onImpact = null,
    token = null,
  } = opts;
  const cancelled = () => !!(token?.cancelled);
  const sm = Math.max(0.08, speedMult);
  const ms = (base) => Math.round(base * sm);

  const actorEl = findCombatUnitEl(rosterRoot, actorUid);
  const targetEl = findCombatUnitEl(rosterRoot, targetUid);
  if (!actorEl || !targetEl) {
    onImpact?.();
    return;
  }

  clearAttackFx(actorEl);
  clearAttackFx(targetEl);

  // 1. 攻方高亮 + 臨時 buff
  actorEl.classList.add("is-attacker");
  const nameEl = actorEl.querySelector(".cu-name");
  if (buffText && nameEl) {
    const badge = document.createElement("span");
    badge.className = "cu-temp-buff";
    badge.textContent = buffText;
    nameEl.prepend(badge);
  }
  await waitAnimMs(ms(ATTACK_PHASE_MS.windup), token);
  if (cancelled()) return;

  // 2. 向守方實際位置輕撞
  lungeTowardTarget(actorEl, targetEl, 12);
  await waitAnimMs(ms(ATTACK_PHASE_MS.lunge), token);
  if (cancelled()) return;

  // 3. 守方高亮 + 數字 + 扣血
  targetEl.classList.add("is-defender");
  if (targetBuff) {
    const tName = targetEl.querySelector(".cu-name");
    if (tName) {
      const gb = document.createElement("span");
      gb.className = "cu-temp-buff is-guard";
      gb.textContent = targetBuff;
      tName.prepend(gb);
    }
  }
  const tNameEl = targetEl.querySelector(".cu-name");
  if (dmg != null && tNameEl) {
    const pop = document.createElement("span");
    pop.className = "cu-dmg";
    pop.textContent = `-${dmg}`;
    tNameEl.appendChild(pop);
  } else if (heal != null && tNameEl) {
    const pop = document.createElement("span");
    pop.className = "cu-heal";
    pop.textContent = `+${heal}`;
    tNameEl.appendChild(pop);
  }
  if (targetHp != null && targetMaxHp != null) {
    const bar = targetEl.querySelector(".cu-bar i");
    if (bar) {
      const pct = targetMaxHp > 0 ? Math.max(0, Math.round((targetHp / targetMaxHp) * 100)) : 0;
      bar.style.width = `${pct}%`;
    }
  }
  onImpact?.();
  await waitAnimMs(ms(ATTACK_PHASE_MS.impact), token);
  if (cancelled()) return;

  // 4. 攻方返回
  actorEl.style.transform = "";
  await waitAnimMs(ms(ATTACK_PHASE_MS.ret), token);
  if (cancelled()) return;

  // 5. 清高亮、數字 fade、死亡 fade
  actorEl.classList.remove("is-attacker");
  actorEl.querySelectorAll(".cu-temp-buff").forEach((n) => n.remove());
  targetEl.classList.remove("is-defender");
  targetEl.querySelectorAll(".cu-temp-buff").forEach((n) => n.remove());
  targetEl.querySelectorAll(".cu-dmg, .cu-heal").forEach((n) => n.classList.add("is-fading"));
  const dead = ko || (targetHp != null && targetHp <= 0);
  if (dead) {
    targetEl.classList.add("is-dying", "is-down");
  }
  await waitAnimMs(ms(dead ? ATTACK_PHASE_MS.resolveKo : ATTACK_PHASE_MS.resolve), token);
  if (cancelled()) return;
  targetEl.querySelectorAll(".cu-dmg, .cu-heal").forEach((n) => n.remove());
  if (dead) {
    targetEl.classList.remove("is-dying");
    targetEl.classList.add("is-down");
  }
}

function strikeBuffLabel(event) {
  if (!event) return null;
  if (event.actorBuff) return event.actorBuff;
  if (event.skillName) return event.skillName;
  if (event.elemTag === "克制") return "克制";
  return null;
}

function buildSkipSummary(events, result) {
  const list = events || [];
  let strikes = 0;
  let heals = 0;
  let kos = 0;
  let adv = 0;
  const dmgByActor = new Map();
  for (const e of list) {
    if (e.type === "strike") {
      strikes += 1;
      if (e.ko) kos += 1;
      if (e.elemTag === "克制") adv += 1;
      if (e.actorUid && e.dmg) {
        dmgByActor.set(e.actorUid, (dmgByActor.get(e.actorUid) || 0) + e.dmg);
      }
    } else if (e.type === "heal") heals += 1;
  }
  let mvpName = null;
  let mvpDmg = 0;
  for (const [uid, dmg] of dmgByActor) {
    if (dmg > mvpDmg) {
      mvpDmg = dmg;
      const ally = result?.combatStart?.allies?.find((u) => u.uid === uid);
      mvpName = ally?.name || null;
    }
  }
  const lootBits = [];
  const bd = result?.rewardBreakdown;
  if (bd?.totalStones) lootBits.push(`+${bd.totalStones} 靈石`);
  if (bd?.base?.scrap) lootBits.push(`+${bd.base.scrap} 碎片`);
  return {
    strikes,
    heals,
    kos,
    adv,
    rounds: list.filter((e) => e.type === "round").length,
    waves: list.filter((e) => e.type === "wave").length,
    mvpName,
    mvpDmg,
    lootBits,
  };
}

function skipSummaryHtml(summary) {
  if (!summary) return "";
  const bits = [`${summary.rounds} 回合`, `${summary.strikes} 擊`];
  if (summary.heals) bits.push(`${summary.heals} 治`);
  if (summary.kos) bits.push(`${summary.kos} 破`);
  if (summary.adv) bits.push(`${summary.adv} 克`);
  const mvpLine = summary.mvpName
    ? `<p class="skip-mvp">MVP · ${escapeHtml(summary.mvpName)}（${summary.mvpDmg} 傷）</p>`
    : "";
  const lootLine =
    summary.lootBits?.length
      ? `<p class="skip-loot">${escapeHtml(summary.lootBits.join(" · "))}</p>`
      : "";
  return `<div class="skip-summary-card">
    <p class="skip-summary">跳過戰報 · ${escapeHtml(bits.join(" · "))}</p>
    ${mvpLine}
    ${lootLine}
  </div>`;
}

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
  pb.lastActorUid = null;
  pb.lastDmg = null;
  pb.lastHealAmt = null;
  pb.waveLabel = pb.waveLabel || null;
  if (event.type === "round") {
    pb.currentRound = event.round || pb.currentRound;
  } else if (event.type === "wave") {
    pb.waveLabel = event.label || event.text;
    pb.foeUnits = (event.foes || []).map((f) => ({ ...f }));
    for (const f of event.foes || []) pb.unitHp.set(f.uid, f.hp);
    pb.lastHitUid = null;
  } else if (event.type === "strike") {
    pb.unitHp.set(event.targetUid, event.targetHp);
    pb.lastHitUid = event.targetUid;
    pb.lastActorUid = event.actorUid;
    pb.lastDmg = event.dmg;
    if (event.ko) pb.lastKoUid = event.targetUid;
  } else if (event.type === "heal") {
    pb.unitHp.set(event.targetUid, event.targetHp);
    pb.lastHitUid = null;
    pb.lastActorUid = event.actorUid || null;
    pb.lastHealAmt = event.heal;
    pb.lastHealTarget = event.targetUid;
  } else {
    pb.lastHitUid = null;
  }
}

function combatLogClass(event) {
  if (!event) return "";
  if (event.type === "wave") return "log-wave";
  if (event.type === "round") return "log-round";
  if (event.type === "heal") return "log-heal";
  if (event.type === "strike") {
    if (event.ko) return "log-ko";
    if (event.elemTag === "克制") return "log-adv";
    if (event.elemTag === "被克") return "log-dis";
    if (event.skillName) return "log-skill";
  }
  return "";
}

function combatLogLineHtml(text, event) {
  const cls = combatLogClass(event);
  let badge = "";
  if (event?.type === "strike" && event.elemTag) {
    const kind = event.elemTag === "克制" ? "adv" : "dis";
    badge = `<span class="elem-badge elem-${kind}">${escapeHtml(event.elemTag)}</span>`;
  } else if (event?.type === "strike" && event.skillName) {
    badge = `<span class="skill-badge">${escapeHtml(event.skillName)}</span>`;
  } else if (event?.type === "wave") {
    badge = `<span class="wave-badge">波</span>`;
  }
  return `<li class="${cls}">${badge}${escapeHtml(text)}</li>`;
}

const FORMATION_SLOT_COUNT_UI = FORMATION_SLOT_COUNT;

function formationSlotIndex(i) {
  return Math.min(FORMATION_SLOT_COUNT_UI - 1, Math.max(0, i | 0));
}

function currentFormationId() {
  return FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
}

/** 3 企位陣型：依 formation 填 lane（前／後排）；空 slot 保留位置 */
function formationSideHtml(units, side, renderUnit, formationId = "balanced") {
  const list = units || [];
  const placement =
    side === "foe"
      ? formationFoePlacement(list.length)
      : formationAllyPlacement(formationId, list.length);
  return placement
    .map((p) => {
      const u = p.unitIndex != null ? list[p.unitIndex] : null;
      if (u) return renderUnit(u, p.slot, p.lane);
      return `<div class="combat-unit is-empty-slot" data-side="${side}" data-slot="${p.slot}" data-lane="${p.lane}" aria-hidden="true"></div>`;
    })
    .join("");
}

function combatUnitBar(u, pb, slotIndex = 0, lane = "front") {
  const hp = pb.unitHp.get(u.uid) ?? u.hp;
  const pct = u.maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hp / u.maxHp) * 100))) : 0;
  const dead = hp <= 0;
  const doubleAct = u.role === "boss" || (u.actions || 1) > 1;
  const actBadge = doubleAct ? `<span class="cu-act" title="可連續行動">雙動</span>` : "";
  const side = u.side === "foe" || u.side === "enemy" ? "foe" : "ally";
  const slot = formationSlotIndex(slotIndex);
  const laneAttr = lane === "rear" ? "rear" : "front";
  // 攻擊高亮／扣血數字由 playAttackSequence 負責，靜態條只顯示 HP
  return `<div class="combat-unit${dead ? " is-down" : ""}${
    doubleAct ? " is-boss-act" : ""
  }" data-combat-uid="${escapeHtml(u.uid)}" data-side="${side}" data-slot="${slot}" data-lane="${laneAttr}" data-element="${escapeHtml(u.elementId || "")}">
    <span class="cu-name">${actBadge}${escapeHtml(u.name)}</span>
    <div class="cu-bar"><i style="width:${pct}%"></i></div>
  </div>`;
}

function renderCombatRoster(pb) {
  const formationId = currentFormationId();
  return `<div class="combat-roster combat-formation" data-live="combat-roster" data-formation="${escapeHtml(formationId)}">
    <div class="combat-side allies combat-formation-side" data-side="ally">${formationSideHtml(
      pb.allyUnits,
      "ally",
      (u, i, lane) => combatUnitBar(u, pb, i, lane),
      formationId
    )}</div>
    <div class="combat-side foes combat-formation-side" data-side="foe">${formationSideHtml(
      pb.foeUnits,
      "foe",
      (u, i, lane) => combatUnitBar(u, pb, i, lane),
      formationId
    )}</div>
  </div>`;
}

function patchCombatRosterDom(pb) {
  const root = document.querySelector("[data-live=combat-roster]");
  if (!root) return;
  const formationId = currentFormationId();
  root.classList.add("combat-formation");
  root.dataset.formation = formationId;
  root.innerHTML = `
    <div class="combat-side allies combat-formation-side" data-side="ally">${formationSideHtml(
      pb.allyUnits,
      "ally",
      (u, i, lane) => combatUnitBar(u, pb, i, lane),
      formationId
    )}</div>
    <div class="combat-side foes combat-formation-side" data-side="foe">${formationSideHtml(
      pb.foeUnits,
      "foe",
      (u, i, lane) => combatUnitBar(u, pb, i, lane),
      formationId
    )}</div>`;
  const waveEl = document.querySelector("[data-live=combat-wave]");
  if (waveEl) {
    waveEl.textContent = pb.waveLabel && !pb.done ? pb.waveLabel : "";
    waveEl.hidden = !pb.waveLabel || pb.done;
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
    host.style.pointerEvents = "none";
    el.hidden = false;
    el.textContent = msg;
    el.className = flashTone ? `flash flash-truncate flash-${flashTone}` : "flash flash-truncate";
  } else {
    host.hidden = true;
    host.className = "flash-toast-host";
    host.style.pointerEvents = "none";
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

/** 缺料結果：可一鍵切到專精練功地 */
function flashResult(r, okTone = "") {
  if (!r) return;
  if (r.ok) {
    setFlash(r.msg, okTone);
    return;
  }
  const s = r.suggest;
  if (s?.siteId && s.unlocked && !s.alreadyThere && !s.dungeonOnly) {
    setFlashWithTrainAction(r.msg, s.siteId, `前往${s.siteName}`);
    return;
  }
  setFlash(r.msg);
}

function setFlashWithTrainAction(msg, siteId, label) {
  flash = msg;
  flashTone = "";
  const host = ensureFlashHost();
  const el = host.querySelector("[data-live=flash]");
  host.hidden = false;
  host.className = "flash-toast-host is-visible";
  host.style.pointerEvents = "auto";
  el.hidden = false;
  el.className = "flash flash-truncate flash-with-act";
  el.innerHTML = `${escapeHtml(msg)} <button type="button" class="flash-act" data-flash-train="${escapeHtml(
    siteId
  )}">${escapeHtml(label)}</button>`;
  const btn = el.querySelector("[data-flash-train]");
  if (btn) {
    btn.addEventListener("click", () => {
      const r = setTrainSite(state, siteId);
      tab = "cultivate";
      panelSub.cultivate = "train";
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      saveState(state);
      setFlash(r.msg);
      render();
    });
  }
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => setFlash(""), 5200);
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
      if (n) bits.push(`${MATERIALS[id]?.name || id}×${fmtMatQty(n)}`);
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
  if (playback?.timer) clearTimeout(playback.timer);
  if (playback?.animToken) {
    playback.animToken.cancelled = true;
    for (const t of playback.animToken.timers || []) clearTimeout(t);
  }
  playback = null;
}

function switchTab(id) {
  if (playback && !playback.done) return;
  if (isTabLocked(state, id)) return;
  tab = id;
  condSheetOpen = false;
  statsSheetOpen = false;
  tutMisclickCount = 0;
  if (tutorialActive(state)) {
    const step = state.tutorial.step;
    if (id === "party" && tutorialNeedsRanchSub(step)) {
      panelSub = { ...panelSub, party: "ranch" };
    } else if (id === "cultivate") {
      if (step === "shop_egg") panelSub = { ...panelSub, cultivate: "shop" };
      else if (step === "breakthrough") panelSub = { ...panelSub, cultivate: "advance" };
      else if (step === "cultivate_qi" || step === "train_pet" || step === "hatch_starter" || step === "hatch_second") {
        panelSub = { ...panelSub, cultivate: "train" };
      }
    } else if (id === "dungeon") {
      if (step === "dungeon_fight" || step === "dungeon_win") panelSub = { ...panelSub, dungeon: "field" };
      else if (step === "tactics") panelSub = { ...panelSub, dungeon: "setup" };
    }
  }
  if (id === "codex" && tutorialActive(state) && state.tutorial.step === "codex") {
    const adv = markTutorialFlag(state, "codexVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  }
  if (id === "party" && tutorialActive(state) && state.tutorial.step === "meet_pet") {
    // 只導航，唔自動完成認寵
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
    // 認寵需點詳情，唔因進入牧場完成
  } else if (group === "party" && id === "dispatch" && step === "dispatch") {
    const adv = markTutorialFlag(state, "dispatchVisited");
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  } else if (group === "party" && id === "breed" && step === "breed_intro") {
    const adv = markTutorialFlag(state, "breedVisited");
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
  const visible = items.filter(({ id }) => !lockFn(state, id));
  if (!visible.length) return "";
  return `<nav class="panel-subnav" aria-label="子分頁">${visible
    .map(({ id, label }) => {
      const glow = tutGlow({ type: "panel-sub", group, id });
      return `<button type="button" class="${panelSub[group] === id ? "on" : ""}${glow}" data-panel-sub="${group}:${id}">${label}</button>`;
    })
    .join("")}</nav>`;
}

function wrapStage(subnavHtml, scrollHtml, dockHtml = "") {
  return `
    <div class="panel-stage">
      <div class="stage-scroll">${scrollHtml}</div>
      ${dockHtml ? `<div class="stage-dock">${dockHtml}</div>` : ""}
    </div>
    ${subnavHtml ? `<div class="panel-subnav-dock">${subnavHtml}</div>` : ""}`;
}

function syncAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-h", `${Math.round(h)}px`);
}

function matAffordHtml(cost) {
  const a = affordMaterials(state, cost);
  if (!a.items.length) return "";
  return a.items
    .map(
      (i) =>
        `<span class="mat-need ${i.ok ? "is-ok" : "is-short"}" title="${escapeHtml(i.source)}">${escapeHtml(i.name)}×${fmtMatQty(i.need)}（${fmtMatQty(i.have)}）</span>`
    )
    .join("／");
}

function upgradeMatSummaryHtml(level) {
  const matUp = upgradeMatCost(level);
  const html = matAffordHtml(matUp);
  if (html) return html;
  const dew = matUp.tide_dew || 1;
  return `${MATERIALS.tide_dew?.name || "潮露"}×${fmtMatQty(dew)}`;
}

function upgradeCostLine(stoneCost, feedCost, level) {
  return `飼料 ${fmtMatQty(feedCost)} 或 靈石 ${fmtMatQty(stoneCost)} ＋ ${upgradeMatSummaryHtml(level)}`;
}

function matChipsHtml() {
  return materialHintsView(state)
    .map((m) => {
      const empty = m.count <= 0;
      return `<span class="chip ${empty ? "is-empty" : ""}" data-mat-chip="${escapeHtml(m.id)}" title="${escapeHtml(m.source)}"><strong>${escapeHtml(m.name)}</strong> <span data-mat-count="${escapeHtml(m.id)}">${m.count}</span><span class="chip-use">${escapeHtml(m.use)}</span></span>`;
    })
    .join("");
}

function matHintListHtml() {
  return `<ul class="mat-hint-list">${materialHintsView(state)
    .map((m) => {
      const site = primaryTrainSiteForMat(m.id);
      const unlocked = site ? trainSitesView(state).find((s) => s.id === site.id)?.unlocked : false;
      const goto =
        site && unlocked
          ? `<button type="button" class="linkish mat-goto" data-goto-train="${escapeHtml(site.id)}">去${escapeHtml(
              site.focus || site.name
            )}</button>`
          : MATERIALS[m.id]?.tier === "dungeon"
            ? `<span class="mat-goto muted">秘境</span>`
            : site
              ? `<span class="mat-goto muted">未解鎖</span>`
              : "";
      return `
    <li class="mat-hint ${m.count <= 0 ? "is-empty" : ""}">
      <span class="mat-name">${escapeHtml(m.name)}</span>
      <span class="mat-count">${m.count}</span>
      <span class="mat-src">${escapeHtml(m.source)}</span>
      ${goto}
    </li>`;
    })
    .join("")}</ul>`;
}

function matOwnedCount() {
  return materialHintsView(state).filter((m) => m.count > 0).length;
}

function materialsBlockHtml() {
  const owned = matOwnedCount();
  return `<div class="fold-section">
      <button type="button" class="section-toggle" data-act="toggle-mat-section">
        <span>材料</span>
        <strong>${owned} 種持有</strong>
        <span class="muted">${matSectionOpen ? "收起來源" : "用途／來源"}</span>
      </button>
      <div class="chip-row chip-row-scroll">${matChipsHtml()}</div>
      ${matSectionOpen ? matHintListHtml() : ""}
    </div>`;
}

function trainRatesBlockHtml(rateLines) {
  if (!rateLines) return "";
  const list = `<ul class="train-rate-list">${rateLines}</ul>`;
  return `<div class="fold-section fold-section-inline">
      <button type="button" class="section-toggle" data-act="toggle-train-rates">
        <span>產出速率</span>
        <span class="muted">${trainRatesOpen ? "收起" : "點開明細"}</span>
      </button>
      ${trainRatesOpen ? list : ""}
    </div>`;
}

function patchMatChipsLive() {
  let changed = false;
  document.querySelectorAll("[data-mat-count]").forEach((el) => {
    const id = el.dataset.matCount;
    if (!id) return;
    const next = Math.floor(state.materials?.[id] || 0);
    const prev = Number(el.textContent);
    if (prev !== next) {
      el.textContent = String(next);
      changed = true;
      const chip = el.closest("[data-mat-chip]");
      if (chip) chip.classList.toggle("is-empty", next <= 0);
    }
  });
  return changed;
}

function patchEggLive() {
  const now = Date.now();
  let becameReady = false;
  document.querySelectorAll("[data-egg-timer]").forEach((el) => {
    const readyAt = Number(el.dataset.readyAt);
    const uid = el.dataset.eggUid;
    if (!uid || !Number.isFinite(readyAt)) return;
    const left = Math.max(0, readyAt - now);
    const sec = Math.ceil(left / 1000);
    if (left <= 0) {
      becameReady = true;
      const row = el.closest(".egg-row");
      const actions = row?.querySelector(".row-actions");
      if (actions && !actions.querySelector("[data-claim-hatch]")) {
        actions.innerHTML = `<button type="button" class="primary${tutGlow({ type: "claim-hatch" })}" data-claim-hatch="${escapeHtml(uid)}">領取</button>`;
      }
    } else {
      el.textContent = `孵化中 ${sec}s`;
    }
  });
  return becameReady;
}

function patchTutorialHintLive() {
  if (!tutorialActive(state)) return;
  const hint = tutorialBannerHint(state);
  document.querySelectorAll("[data-live=tutorial-hint]").forEach((hintEl) => {
    hintEl.textContent = hint;
  });
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
  if (wins) wins.textContent = `勝 ${state.combatsWon}`;

  const eggReadyNow = patchEggLive();
  patchTutorialHintLive();
  patchMatChipsLive();

  const snap = tutorialLiveSnapshot(state);
  if (snap !== tutorialSnapCache) {
    tutorialSnapCache = snap;
    patchTutorialBanner();
  } else if (tutorialActive(state)) {
    refreshTutorialGlow();
  }

  return eggReadyNow;
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

function appendCombatLogLine(event, text) {
  const list = document.querySelector("[data-live=combat-log]");
  if (!list || !text) return;
  if (list.dataset.lastLine === text) return;
  const li = document.createElement("li");
  li.className = `log-line-in ${combatLogClass(event)}`.trim();
  if (event?.type === "strike" && event.elemTag) {
    const kind = event.elemTag === "克制" ? "adv" : "dis";
    const badge = document.createElement("span");
    badge.className = `elem-badge elem-${kind}`;
    badge.textContent = event.elemTag;
    li.appendChild(badge);
  } else if (event?.type === "strike" && event.skillName) {
    const badge = document.createElement("span");
    badge.className = "skill-badge";
    badge.textContent = event.skillName;
    li.appendChild(badge);
  } else if (event?.type === "wave") {
    const badge = document.createElement("span");
    badge.className = "wave-badge";
    badge.textContent = "波";
    li.appendChild(badge);
  }
  li.append(document.createTextNode(text));
  list.appendChild(li);
  list.dataset.lastLine = text;
  while (list.children.length > 40) list.removeChild(list.firstChild);
  const scroller = document.querySelector("[data-live=combat-scroll]");
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

function updatePlaybackDom(latestEvent = null) {
  if (!playback) return;
  const total = Math.max(1, playback.events.length);
  const pct = Math.min(100, Math.round((playback.index / total) * 100));
  const bar = document.querySelector("[data-live=combat-bar]");
  const meta = document.querySelector("[data-live=combat-meta]");
  if (bar) bar.style.width = `${pct}%`;
  if (meta) meta.textContent = combatPlaybackMeta(playback);
  // 攻擊動畫進行中唔重繪 roster，避免打斷 transform
  if (!playback.animating) {
    patchCombatRosterDom(playback);
  }
  if (latestEvent?.text && playback.shown.length) {
    appendCombatLogLine(latestEvent, playback.shown[playback.shown.length - 1]);
  }
}

async function playPhasedPlaybackEvent(event, token) {
  if (!playback || playback.done || token.cancelled) return;
  const sm = playback.speedMult || 1;
  const rosterRoot = document.querySelector("[data-live=combat-roster]");
  playback.animating = true;

  if (event.type === "strike") {
    await playAttackSequence({
      rosterRoot,
      actorUid: event.actorUid,
      targetUid: event.targetUid,
      dmg: event.dmg,
      ko: !!event.ko,
      buffText: strikeBuffLabel(event),
      targetBuff: event.targetBuff || null,
      targetHp: event.targetHp,
      targetMaxHp: event.targetMaxHp,
      speedMult: sm,
      token,
      onImpact: () => {
        if (!playback || token.cancelled) return;
        applyCombatEvent(event, playback);
        playback.shown.push(event.text);
        state.log.unshift(event.text);
        if (state.log.length > 60) state.log.length = 60;
        appendCombatLogLine(event, event.text);
        const bar = document.querySelector("[data-live=combat-bar]");
        const meta = document.querySelector("[data-live=combat-meta]");
        const total = Math.max(1, playback.events.length);
        if (bar) bar.style.width = `${Math.min(100, Math.round(((playback.index + 1) / total) * 100))}%`;
        if (meta) meta.textContent = combatPlaybackMeta({ ...playback, index: playback.index + 1 });
      },
    });
  } else if (event.type === "heal") {
    await playAttackSequence({
      rosterRoot,
      actorUid: event.actorUid || event.targetUid,
      targetUid: event.targetUid,
      heal: event.heal,
      ko: false,
      buffText: event.skillName || "治療",
      targetHp: event.targetHp,
      targetMaxHp: event.targetMaxHp,
      speedMult: sm,
      token,
      onImpact: () => {
        if (!playback || token.cancelled) return;
        applyCombatEvent(event, playback);
        playback.shown.push(event.text);
        state.log.unshift(event.text);
        if (state.log.length > 60) state.log.length = 60;
        appendCombatLogLine(event, event.text);
      },
    });
  }

  if (playback) playback.animating = false;
  // 動畫完同步一次乾淨 roster（保留死亡狀態）
  if (playback && !token.cancelled) {
    playback.lastHitUid = null;
    playback.lastActorUid = null;
    playback.lastDmg = null;
    playback.lastHealAmt = null;
    patchCombatRosterDom(playback);
  }
}

function schedulePlaybackStep() {
  if (!playback || playback.done) return;
  if (playback.index >= playback.events.length) {
    finishPlayback();
    return;
  }
  const event = playback.events[playback.index];
  const sm = playback.speedMult || 1;

  if (event.type === "strike" || event.type === "heal") {
    const token = { cancelled: false, timers: [] };
    playback.animToken = token;
    playPhasedPlaybackEvent(event, token).then(() => {
      if (!playback || playback.done || token.cancelled) return;
      playback.index += 1;
      playback.animToken = null;
      if (playback.index >= playback.events.length) finishPlayback();
      else schedulePlaybackStep();
    });
    return;
  }

  playback.timer = window.setTimeout(() => {
    playback.timer = null;
    advancePlayback();
    if (playback && !playback.done) schedulePlaybackStep();
  }, playbackDelayMs(event, sm));
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

function clearCombatPlayback(opts = {}) {
  const goSetup = !!opts.goSetup;
  stopPlayback();
  rewardDetailsOpen = false;
  if (goSetup) {
    panelSub = { ...panelSub, dungeon: "setup" };
    markTutorialSubVisit("dungeon", "setup");
  }
  render();
}

function finishPlayback() {
  if (!playback) return;
  playback.done = true;
  if (playback.timer) {
    clearTimeout(playback.timer);
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
  const tacticsStep = tutorialActive(state) && state.tutorial.step === "tactics";
  const result = playback.result;
  const unlocks = result?.unlockedSites || [];
  const resultMsg = result?.msg;
  const wasSkipped = playback.skipped;
  if (tacticsStep && wasSkipped) {
    saveState(state);
    clearCombatPlayback({ goSetup: true });
  } else {
    saveState(state);
    render();
  }
  if (adv.advanced && adv.unlockMsg) {
    setFlash(adv.unlockMsg, "unlock");
  } else if (unlocks.length) {
    setFlash(`解鎖練功地【${unlocks.join("】【")}】！ ${resultMsg}`, "unlock");
  } else if (resultMsg) {
    setFlash(resultMsg);
  }
}

function startPlayback(result) {
  stopPlayback();
  if (result?.combatKind !== "train") tab = "dungeon";
  condSheetOpen = false;
  rewardDetailsOpen = false;
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
    animToken: null,
    animating: false,
    done: false,
    skipped: false,
    skipSummary: null,
    speedMult: combatSpeedMult(result),
    isFarm: isFarmCombat(result),
    unitHp: hpState.hp,
    allyUnits: hpState.allies,
    foeUnits: hpState.foes,
    lastHitUid: null,
    lastActorUid: null,
    lastKoUid: null,
    lastDmg: null,
    lastHealAmt: null,
    lastHealTarget: null,
    waveLabel: null,
    currentRound: 0,
  };
  if (playback.isFarm && combatPrefs.fastMode && !tutorialActive(state)) {
    for (const e of events) applyCombatEvent(e, playback);
    playback.index = events.length;
    playback.skipped = true;
    playback.skipSummary = buildSkipSummary(events, result);
    render();
    finishPlayback();
    return;
  }
  render();
  schedulePlaybackStep();
}

function skipPlayback() {
  if (!playback || playback.done) return;
  playback.skipped = true;
  if (playback.timer) {
    clearTimeout(playback.timer);
    playback.timer = null;
  }
  if (playback.animToken) {
    playback.animToken.cancelled = true;
    for (const t of playback.animToken.timers || []) clearTimeout(t);
    playback.animToken = null;
  }
  playback.animating = false;
  while (playback.index < playback.events.length) {
    const event = playback.events[playback.index];
    applyCombatEvent(event, playback);
    playback.index += 1;
  }
  playback.skipSummary = buildSkipSummary(playback.events, playback.result);
  playback.shown = [];
  finishPlayback();
  render();
}

function render() {
  state = tickCultivation(state);

  const nav = syncTutorialNavigation(state, { tab, panelSub });
  tab = nav.tab;
  panelSub = nav.panelSub;
  // 戰術步：sync 會強制進入 setup，但唔會觸發 panel-sub click → 喺此補完旗標
  if (
    tutorialActive(state) &&
    state.tutorial.step === "tactics" &&
    panelSub.dungeon === "setup" &&
    !state.tutorial.flags?.tacticsVisited
  ) {
    const adv = markTutorialFlag(state, "tacticsVisited");
    if (adv.advanced && adv.unlockMsg) {
      setFlash(adv.unlockMsg, "unlock");
    }
  }

  const stage = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const m = state.master;
  const enterClass = shellReady ? "is-settled" : "is-enter";
  const busy = playback && !playback.done;
  const inTutorial = tutorialActive(state);

  app.className = `${enterClass}${inTutorial ? " is-tutorial" : ""}`;
  app.innerHTML = `
    <header class="top top-compact">
      <div class="brand-row">
        <p class="brand">暗潮</p>
        <p class="tag">靈寵修行 · <span data-live="wins">勝 ${state.combatsWon}</span></p>
      </div>
    </header>

    ${inTutorial ? tutorialStatsStrip() : statsStripHtml(stage)}

    ${nextGoalChipHtml()}

    ${inTutorial ? tutorialBannerHtml(state, { collapsed: tutorialCollapsed }) : ""}

    <main class="panel">
      <div class="panel-body">
      ${tab === "cultivate" ? cultivatePanel(qiPct, next, m) : ""}
      ${tab === "party" ? petsPanel() : ""}
      ${tab === "dungeon" ? dungeonPanel() : ""}
      ${tab === "codex" ? codexPanel() : ""}
      ${tab === "log" ? logPanel() : ""}
      </div>
    </main>

    <nav class="tabs tabs-bottom" role="tablist">
      ${tabBtn("cultivate", "修行", busy)}
      ${tabBtn("party", "靈寵", busy)}
      ${tabBtn("dungeon", "秘境", busy)}
      ${tabBtn("codex", "圖鑑", busy)}
      ${tabBtn("log", "見聞", busy)}
    </nav>
    ${playback ? combatModalHtml() : ""}
    ${sweepResult ? sweepModalHtml() : ""}
    ${dispatchModal ? dispatchModalHtml() : ""}
    ${attackPreview ? attackPreviewModalHtml() : ""}
    ${condSheetOpen ? dungeonCondSheetHtml() : ""}
    ${statsSheetOpen ? statsSheetHtml() : ""}
    ${dailyHubHtml()}
    ${offlineBanner()}
    ${inTutorial ? "" : installBanner()}
  `;

  bind();
  shellReady = true;
  if (tutorialSnapCache !== tutorialLiveSnapshot(state)) {
    tutMisclickCount = 0;
    tutorialCollapsed = false;
  }
  tutorialSnapCache = tutorialLiveSnapshot(state);
  saveState(state);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => positionTutorialSpotlight(false));
  });
  if (playback) {
    updatePlaybackDom();
    requestAnimationFrame(() => {
      const scroller = document.querySelector("[data-live=combat-scroll]");
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    });
  }
}

function dispatchMatBits(mission) {
  const hintMap = Object.fromEntries(materialHintsView(state).map((m) => [m.id, m.source]));
  const mats = mission.reward?.materials || {};
  return Object.entries(mats)
    .map(([id, n]) => {
      const name = MATERIALS[id]?.name || id;
      return `<span class="mat-need" title="${escapeHtml(hintMap[id] || "")}">${escapeHtml(name)}×${fmtMatQty(n)}</span>`;
    })
    .join(" ");
}

let dailyHubDismissedSession = false;

function statsStripHtml(stage) {
  return `<button type="button" class="stats stats-compact stats-tappable" data-act="toggle-stats-sheet" aria-label="查看資源詳情">
      <div><span>階段</span><strong data-live="stage">${stage.name}</strong></div>
      <div><span>靈石</span><strong data-live="stones">${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong data-live="scrap">${state.scrap}</strong></div>
      <div><span>飼料</span><strong data-live="feed">${Math.floor(state.feed || 0)}</strong></div>
      <div><span>靈塵</span><strong data-live="dust">${Math.floor(state.dust || 0)}</strong></div>
    </button>`;
}

function statsSheetHtml() {
  const stage = realmInfo(state);
  const next = nextRealm(state);
  const br = breakthroughView(state);
  const qiPct = next ? Math.min(100, Math.round((state.qi / next.need) * 100)) : 100;
  const ranchN = (state.ranch?.length || 0) + state.pets.length;
  const matRows = materialHintsView(state)
    .filter((m) => m.count > 0)
    .slice(0, 8)
    .map(
      (m) =>
        `<li class="stat-sheet-mat"><span>${escapeHtml(m.name)}</span><strong>${m.count}</strong><span class="muted">${escapeHtml(m.use)}</span></li>`
    )
    .join("");
  return `
    <div class="sheet-overlay" role="presentation">
      <div class="sheet-card stat-sheet-card" role="dialog" aria-label="資源詳情" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>資源詳情</h3>
        <ul class="stat-sheet-grid">
          <li><span>階段</span><strong>${escapeHtml(stage.name)}</strong></li>
          <li><span>靈石</span><strong>${Math.floor(state.stones)}</strong></li>
          <li><span>碎片</span><strong>${state.scrap}</strong></li>
          <li><span>飼料</span><strong>${Math.floor(state.feed || 0)}</strong></li>
          <li><span>靈塵</span><strong>${Math.floor(state.dust || 0)}</strong></li>
          <li><span>勝場</span><strong>${state.combatsWon}</strong></li>
          <li><span>牧場</span><strong>${ranchN}／${ranchCap(state)}</strong></li>
          <li><span>出戰</span><strong>${state.pets.length}／${ACTIVE_PET_MAX}</strong></li>
        </ul>
        <p class="meta">靈契 ${Math.floor(state.qi)} / ${next?.need || "—"} · ${qiPct}% →【${escapeHtml(br.next?.name || "")}】</p>
        ${matRows ? `<h4>持有材料</h4><ul class="stat-sheet-mats">${matRows}</ul>` : ""}
        <button type="button" class="primary sheet-close" data-act="close-stats-sheet">關閉</button>
      </div>
    </div>`;
}

function tutorialStatsStrip() {
  const stage = realmInfo(state);
  return `<div class="tutorial-stats-strip">
    <span data-live="stage">${escapeHtml(stage.name)}</span>
    <span><strong data-live="stones">${Math.floor(state.stones)}</strong> 石</span>
    <span>飼 <strong data-live="feed">${Math.floor(state.feed || 0)}</strong></span>
    <span>塵 <strong data-live="dust">${Math.floor(state.dust || 0)}</strong></span>
  </div>`;
}

function nextGoalChipHtml() {
  if (tutorialActive(state)) return "";
  const goal = nextGoalView(state);
  if (!goal) return "";
  return `<button type="button" class="next-goal-chip next-goal-compact" data-act="goto-goal" data-goal-tab="${escapeHtml(goal.tab)}" data-goal-sub="${escapeHtml(goal.sub || "")}">
    <span class="next-goal-kicker">${escapeHtml(goal.kind === "breakthrough" ? "突破" : "求道")}</span>
    <strong>${escapeHtml(goal.label)}</strong>
    <span class="muted">${escapeHtml(goal.progress)}</span>
  </button>`;
}

function dailyTasksToolbarHtml() {
  const ac = dailyAllClearView(state);
  const claimAllDisabled = ac.claimable <= 0;
  const allClearDisabled = !ac.canClaimAllClear;
  const allClearLabel = ac.allClearClaimed ? "全清獎已領" : ac.canClaimAllClear ? "領全清獎" : `全清獎（${ac.claimed}/${ac.total}）`;
  return `<div class="daily-tasks-toolbar row">
    <button type="button" class="primary" data-act="claim-all-dailies" ${claimAllDisabled ? "disabled" : ""}>一鍵領取（${ac.claimable}）</button>
    <button type="button" data-act="claim-daily-allclear" ${allClearDisabled ? "disabled" : ""}>${escapeHtml(allClearLabel)}</button>
  </div>`;
}

function dailyHubHtml() {
  if (tutorialActive(state)) return "";
  const hub = dailyHubView(state);
  if (!hub.shouldShow || dailyHubDismissedSession) return "";
  const streak = hub.streak;
  const streakRewards = streak.rewards
    .map(
      (r) =>
        `<li class="${r.day === streak.day ? "is-today" : r.day < streak.day ? "is-past" : ""}"><span>${r.day}</span><small>${escapeHtml(r.name)}</small></li>`
    )
    .join("");
  const eggLines = hub.eggTimers
    .map((e) => `<li>孵化中 · ${escapeHtml(e.tier)} · ${e.secLeft}s</li>`)
    .join("");
  const dispatchLines = hub.dispatchTimers
    .map((d) => `<li>派遣 · ${escapeHtml(d.name)} · ${d.secLeft}s</li>`)
    .join("");
  const offlineLine = hub.offline
    ? `<p class="hub-offline">離線 ${Math.round(hub.offline.sec / 60)} 分 · 靈契 +${fmtInt(hub.offline.qi)} · 飼料 +${fmtMatQty(hub.offline.feed)}${hub.offline.materials ? ` · ${escapeHtml(formatMatBits(hub.offline.materials))}` : ""}${hub.offline.dust ? ` · 靈塵 +${fmtMatQty(hub.offline.dust)}` : ""}</p>`
    : "";
  const goalLine = hub.nextGoal
    ? `<p class="hub-goal">下一目標：<strong>${escapeHtml(hub.nextGoal.label)}</strong>（${escapeHtml(hub.nextGoal.progress)}）</p>`
    : "";
  const dailyClaimLine = `<p class="hub-daily-claim">每日領取 <strong>${hub.dailyClaimed || 0}/${hub.dailyTotal}</strong>${
    hub.allClearClaimed ? " · 全清獎已領" : hub.canClaimAllClear ? " · 可領全清獎！" : ""
  }</p>`;
  const hubDailyActs =
    hub.dailyClaimable > 0 || hub.canClaimAllClear
      ? `<div class="row hub-daily-claim-row">
          <button type="button" class="primary" data-act="claim-all-dailies" ${hub.dailyClaimable <= 0 ? "disabled" : ""}>一鍵領每日（${hub.dailyClaimable || 0}）</button>
          <button type="button" data-act="claim-daily-allclear" ${!hub.canClaimAllClear ? "disabled" : ""}>${
            hub.allClearClaimed ? "全清獎已領" : hub.canClaimAllClear ? "領全清獎" : `全清獎 ${hub.dailyClaimed}/${hub.dailyTotal}`
          }</button>
        </div>`
      : "";
  return `<div class="daily-hub-overlay" data-live="daily-hub">
    <div class="daily-hub-card" role="dialog" aria-label="每日儀表板">
      <h2>今日暗潮</h2>
      ${offlineLine}
      <div class="hub-grid">
        <div class="hub-stat"><span>每日任務</span><strong>${hub.dailyDone}/${hub.dailyTotal}</strong></div>
        <div class="hub-stat"><span>掛機任務</span><strong>${hub.idleDailyDone ? "完成" : `${Math.min(hub.idleSec, hub.idleDailyCap)}s`}</strong></div>
        <div class="hub-stat"><span>可領蛋</span><strong>${hub.eggReady}</strong></div>
        <div class="hub-stat"><span>派遣完成</span><strong>${hub.dispatchReady}</strong></div>
      </div>
      ${hub.dailyModLabel ? `<p class="hub-mod">${escapeHtml(hub.dailyModLabel)}</p>` : ""}
      ${hub.spotlightName ? `<p class="hub-spot">今日練功地強化【${escapeHtml(hub.spotlightName)}】</p>` : ""}
      ${goalLine}
      ${dailyClaimLine}
      ${hubDailyActs}
      ${eggLines || dispatchLines ? `<ul class="hub-timers">${eggLines}${dispatchLines}</ul>` : ""}
      <h3>連續登入 · 第 ${streak.day} 日</h3>
      <ol class="streak-row">${streakRewards}</ol>
      <div class="row hub-actions">
        <button type="button" class="primary" data-act="claim-streak" ${streak.canClaim ? "" : "disabled"}>${streak.canClaim ? "領取登入獎" : "今日已領"}</button>
        <button type="button" data-act="goto-daily-tasks">查看任務</button>
        <button type="button" class="ghost" data-act="dismiss-hub">開始今日</button>
      </div>
    </div>
  </div>`;
}

function installBanner() {
  if (pwaDismissed || !pwaInstallEvt) return "";
  return `
    <div class="chrome-toast install-toast" data-live="install-banner">
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
  const matLine = formatMatBits(h.materials);
  const detail = `靈契 +${fmtInt(h.qi)} · 飼料 +${fmtMatQty(h.feed)} · 靈塵 +${fmtMatQty(h.dust)}${
    matLine ? ` · ${matLine}` : ""
  }${h.siteName ? `（${h.siteName}）` : ""}`;
  return `
    <div class="chrome-toast offline-toast" data-live="offline">
      <div class="offline-body">
        <strong>離線約 ${min} 分鐘</strong>
        <p class="offline-detail">${escapeHtml(detail)}</p>
      </div>
      <button type="button" data-act="clear-offline">知道了</button>
    </div>`;
}

function tabBtn(id, label, busy) {
  if (isTabLocked(state, id)) return "";
  const glow = tutGlow({ type: "tab", id });
  const disabled = busy && id !== "dungeon" ? "disabled" : "";
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}${glow}" data-tab="${id}" ${disabled}>${label}</button>`;
}

/** Live idle combat — real 5-wave session stepped each second */
let idleCombat = null;
let idleAnimBusy = false;
let idleAnimToken = null;

function idlePetSig(st) {
  return (st.pets || []).map((p) => `${p.uid}:${p.atk}:${p.hp}:${p.spd}`).join("|");
}

function ensureIdleCombat() {
  const view = trainIdleCombatView(state);
  if (!view.petCount) {
    idleCombat = null;
    return null;
  }
  const sig = idlePetSig(state);
  const formationId = currentFormationId();
  const needNew =
    !idleCombat ||
    !idleCombat.session ||
    idleCombat.zoneId !== view.zoneId ||
    idleCombat.tierIndex !== view.tierIndex ||
    idleCombat.petSig !== sig ||
    idleCombat.formationId !== formationId;
  if (needNew) {
    const session = createTrainIdleSession(state);
    if (!session) {
      idleCombat = null;
      return null;
    }
    idleCombat = {
      zoneId: view.zoneId,
      tierIndex: view.tierIndex,
      petSig: sig,
      formationId,
      clearReady: !!view.clearReady,
      canUnlockNext: !!view.canUnlockNext,
      session,
      logLine: view.logLine,
      // 只顯示本場結果；唔用上一場 lastClear 冒充未通關
      resultLine: null,
      fx: emptyIdleFx(),
    };
  } else {
    idleCombat.logLine = view.logLine;
    idleCombat.clearReady = !!view.clearReady || !!idleCombat.clearReady;
    idleCombat.session.clearReady = idleCombat.clearReady;
  }
  return idleCombat;
}

/** 掛機通關字：只喺本場已結束／暫停展示結果時顯示，進行中唔帶舊場 */
function idleCombatResultLine(wrap) {
  const s = wrap?.session;
  if (!s) return "";
  if (s.ended || s.phase === "pause") {
    return s.resultLine || wrap.resultLine || "";
  }
  return "";
}

function patchIdleRosterFromSession(wrap) {
  const roster = document.querySelector("[data-live=train-idle-roster]");
  if (!roster || !wrap?.session) return;
  const s = wrap.session;
  const formationId = wrap.formationId || currentFormationId();
  roster.classList.add("combat-formation");
  roster.dataset.formation = formationId;
  roster.innerHTML = `<div class="combat-side allies combat-formation-side" data-side="ally">${formationSideHtml(
    s.allies,
    "ally",
    idleUnitBarHtml,
    formationId
  )}</div>
    <div class="combat-side foes combat-formation-side" data-side="foe">${formationSideHtml(
      s.foes,
      "foe",
      idleUnitBarHtml,
      formationId
    )}</div>`;
}

async function playIdleCombatEvents(events) {
  const root = document.querySelector("[data-live=train-idle-roster]");
  if (!root) return;
  const token = { cancelled: false, timers: [] };
  idleAnimToken = token;
  for (const event of events || []) {
    if (token.cancelled) break;
    if (event.type === "strike") {
      await playAttackSequence({
        rosterRoot: root,
        actorUid: event.actorUid,
        targetUid: event.targetUid,
        dmg: event.dmg,
        ko: !!event.ko,
        buffText: strikeBuffLabel(event),
        targetBuff: event.targetBuff || null,
        targetHp: event.targetHp,
        targetMaxHp: event.targetMaxHp,
        speedMult: 1,
        token,
      });
    } else if (event.type === "heal") {
      await playAttackSequence({
        rosterRoot: root,
        actorUid: event.actorUid || event.targetUid,
        targetUid: event.targetUid,
        heal: event.heal,
        buffText: "治療",
        targetHp: event.targetHp,
        targetMaxHp: event.targetMaxHp,
        speedMult: 1,
        token,
      });
    }
  }
  if (idleAnimToken === token) idleAnimToken = null;
}

function tickIdleCombat() {
  if (idleAnimBusy) return;
  const wrap = ensureIdleCombat();
  if (!wrap?.session) return;

  const result = stepTrainIdleSession(wrap.session);
  if (result.status === "restart") {
    const keepReady = wrap.clearReady;
    const session = createTrainIdleSession(state);
    if (!session) {
      idleCombat = null;
      return;
    }
    session.clearReady = keepReady;
    wrap.session = session;
    wrap.petSig = idlePetSig(state);
    // 新一輪進行中唔顯示上一場通關時間
    wrap.resultLine = null;
    wrap.fx = emptyIdleFx();
    patchIdleRosterFromSession(wrap);
    return;
  }
  if (result.status === "won" || result.status === "lost") {
    if (wrap.session.resultLine) {
      wrap.resultLine = wrap.session.resultLine;
      persistTrainIdleClearResult(state, wrap.session);
      saveState(state);
    }
  }

  const combatEvents = (result.events || []).filter(
    (e) => e.type === "strike" || e.type === "heal"
  );
  if (combatEvents.length) {
    idleAnimBusy = true;
    playIdleCombatEvents(combatEvents)
      .catch(() => {})
      .finally(() => {
        idleAnimBusy = false;
        if (idleCombat?.session) patchIdleRosterFromSession(idleCombat);
      });
  } else if (result.status === "wave" || result.status === "round") {
    patchIdleRosterFromSession(wrap);
  }

  if (result.status === "won") {
    const marked = markTrainIdleClearReady(state, wrap.session);
    if (marked?.ok) {
      saveState(state);
      if (marked.autoClaimed) {
        idleCombat = null;
        setFlash(marked.claim?.msg || "霧階全破 · 可挑戰域主", "unlock");
        render();
        return;
      }
      wrap.clearReady = true;
    }
  }
}

function emptyIdleFx() {
  return {
    lastHitUid: null,
    lastActorUid: null,
    lastKoUid: null,
    lastDmg: null,
    lastHealAmt: null,
    lastHealTarget: null,
  };
}

function idleUnitBarHtml(u, slotIndex = 0, lane = "front") {
  const pct = u.maxHp > 0 ? Math.max(0, Math.round((u.hp / u.maxHp) * 100)) : 0;
  const dead = u.hp <= 0;
  const doubleAct = u.role === "boss" || (u.actions || 1) > 1;
  const actBadge = doubleAct ? `<span class="cu-act" title="可連續行動">雙動</span>` : "";
  const role =
    u.role === "boss" ? "【BOSS】" : u.role === "elite" ? "【精英】" : "";
  const side = u.side === "foe" || u.side === "enemy" ? "foe" : "ally";
  const slot = formationSlotIndex(slotIndex);
  const laneAttr = lane === "rear" ? "rear" : "front";
  return `<div class="combat-unit${dead ? " is-down" : ""}${
    doubleAct && !dead ? " is-boss-act" : ""
  }" data-uid="${escapeHtml(u.uid || "")}" data-side="${side}" data-slot="${slot}" data-lane="${laneAttr}" data-element="${escapeHtml(u.elementId || "")}">
    <span class="cu-name">${actBadge}${role}${escapeHtml(u.name)}</span>
    <div class="cu-bar"><i style="width:${pct}%"></i></div>
  </div>`;
}

function trainIdleStripHtml() {
  const wrap = ensureIdleCombat();
  if (!wrap?.session) {
    return `<div class="train-idle-strip" data-live="train-idle">
      <p class="meta train-idle-log muted">未出戰——掛機效率最低</p>
    </div>`;
  }
  const s = wrap.session;
  const formationId = wrap.formationId || currentFormationId();
  const meta =
    s.phase === "pause"
      ? s.won
        ? `清完 ${s.waveCount} 波！`
        : s.ended
          ? "全滅／逾時，重開中…"
          : `第 ${s.round || 1} 回合 · ${s.waveLabel || ""}`
      : `第 ${s.round || 1} 回合 · ${s.waveLabel || ""}`;
  const pct = Math.min(
    100,
    Math.round(((s.waveIndex + (s.ended && s.won ? 1 : 0)) / Math.max(1, s.waveCount)) * 100)
  );
  const claimBtn =
    wrap.clearReady && wrap.canUnlockNext && (s.tierIndex | 0) < TRAIN_TIER_COUNT - 1
      ? `<div class="row train-idle-claim"><button type="button" class="primary" data-claim-tier>去下一層</button></div>`
      : "";
  const resultLine = idleCombatResultLine(wrap);
  const resultCls =
    resultLine === "挑戰失敗" ? " is-fail" : resultLine ? " is-clear" : "";
  return `<div class="train-idle-strip" data-live="train-idle">
    <p class="meta train-idle-log">${escapeHtml(wrap.logLine || "")}</p>
    <p class="lead combat-round-meta train-idle-meta" data-live="train-idle-meta">${escapeHtml(meta)}</p>
    <div class="bar combat-bar train-idle-bar"><i data-live="train-idle-bar" style="width:${pct}%"></i></div>
    <div class="combat-roster train-idle-roster combat-formation" data-live="train-idle-roster" data-formation="${escapeHtml(formationId)}">
      <div class="combat-side allies combat-formation-side" data-side="ally">${formationSideHtml(
        s.allies,
        "ally",
        idleUnitBarHtml,
        formationId
      )}</div>
      <div class="combat-side foes combat-formation-side" data-side="foe">${formationSideHtml(
        s.foes,
        "foe",
        idleUnitBarHtml,
        formationId
      )}</div>
    </div>
    <p class="train-idle-hit${resultCls}" data-live="train-idle-hit"${resultLine ? "" : " hidden"}>${escapeHtml(resultLine)}</p>
    ${claimBtn}
  </div>`;
}

function cultivatePanel(qiPct, next, m) {
  const br = breakthroughView(state);
  const seal = tideSealView(state);
  const map = trainMapView(state);
  const sites = map.sites || trainSitesView(state);
  const siteBtns = sites
    .filter((s) => s.unlocked && !areTrainSitesLocked(state))
    .map((s) => {
      const focus = s.focus ? ` ·${s.focus}` : "";
      const spot = s.isDailySpot ? " ☀" : "";
      const depth = s.wardenCleared ? " ·主" : ` ·${Math.min((s.tiersCleared || 0) + 1, s.tierCount || 4)}`;
      return `<button type="button" class="${s.selected ? "primary" : "secondary"} train-site-btn${s.isDailySpot ? " is-daily-spot" : ""}" data-set-train="${s.id}" title="${escapeHtml(s.desc || "")}">${escapeHtml(s.name)}${escapeHtml(focus)}${depth}${spot}</button>`;
    })
    .join("");
  const siteCur = sites.find((s) => s.selected);
  const trainSpot = trainDailySpotlightView();
  const nextLocked = sites.find((s) => !s.unlocked);
  const trainLockNote = nextLocked
    ? `<p class="train-lock-note">🔒 ${escapeHtml(nextLocked.unlockHint || `解鎖【${nextLocked.name}】`)}</p>`
    : "";
  const spotNote = trainSpot
    ? `<p class="train-daily-spot">${escapeHtml(trainSpot.label)}${trainSpot.focus ? ` · ${escapeHtml(trainSpot.focus)}` : ""}</p>`
    : "";
  const rateLines = (siteCur?.rates?.lines || [])
    .slice(0, 4)
    .map((r) => {
      const dm = siteCur?.depthMult || 1;
      const em = siteCur?.efficiency || 1;
      const adj = (Number(r.perHr) * dm * em).toFixed(r.kind === "mat" ? 1 : 0);
      return `<li class="train-rate ${r.tag ? "is-boosted" : ""}"><span>${escapeHtml(r.name)}</span><span class="muted">≈${adj}/時${
        r.tag ? ` · ${escapeHtml(r.tag)}` : ""
      } ·深×${fmtMult(dm)}·效×${fmtMult(em)}</span></li>`;
    })
    .join("");

  const shopOffers = shopView(state);
  const ranchFull = (state.ranch?.length || 0) + state.pets.length >= ranchCap(state);
  const eggFull = (state.eggs?.length || 0) >= 6;
  const shopRows =
    shopOffers
      .filter((o) => {
        if (o.bought) return false;
        const isEgg = o.kind === "egg";
        return !(isEgg ? eggFull : ranchFull);
      })
      .map((o) => {
        const isEgg = o.kind === "egg";
        const sub = isEgg
          ? `${escapeHtml(o.label || "蛋")} · ${escapeHtml(o.desc || "")}`
          : `${escapeHtml(o.petKind || o.kind || "?")}·${escapeHtml(o.elementName || "")}`;
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(o.speciesName || o.name)}${isEgg ? " ·蛋" : ""}</strong>
            <span class="muted">${sub} · ${o.tutorialDeal ? `教學 ${o.cost} 靈石` : `${o.cost} 靈石`}</span>
          </div>
          <button type="button" class="primary${tutGlow({ type: "shop-buy" })}" data-shop-buy="${escapeHtml(o.offerId)}">購入</button>
        </li>`;
      })
      .join("") || `<li class="empty">今日商肆無可購貨。</li>`;

  const ranchN = state.ranch?.length || 0;
  const firstMiss = br.items.find((it) => !it.ok);
  const breakLabel = br.ready
    ? `突破至${br.next.name}${br.costLabel ? `（耗${br.costLabel}）` : ""}`
    : firstMiss
      ? `突破階段（未齊·${firstMiss.label}）`
      : "突破階段（條件未齊）";

  if (panelSub.cultivate === "gear") panelSub.cultivate = "train";
  const sub = panelSub.cultivate;
  const nav = panelSubNav("cultivate", [
    { id: "train", label: "練功" },
    { id: "mats", label: "材料" },
    { id: "shop", label: "商肆" },
    { id: "advance", label: "進階" },
  ]);

  if (sub === "mats") {
    return wrapStage(
      nav,
      `<h2>材料一覽</h2>
      <p class="lead">靈石 ${Math.floor(state.stones)} · 飼料 ${Math.floor(state.feed || 0)} · 靈塵 ${Math.floor(state.dust || 0)}</p>
      ${matHintListHtml()}`
    );
  }

  if (sub === "shop") {
    return wrapStage(
      nav,
      `<h2>商肆 · 今日</h2>
      <p class="lead">靈石 ${Math.floor(state.stones)} · 牧場 ${ranchN}／${ranchCap(state)}</p>
      <ul class="list">${shopRows}</ul>`
    );
  }

  if (sub === "advance") {
    /* Show every breakthrough gate (incl. bestiary) — do not slice; ready checks all items. */
    const gateRows = br.items
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
    const missN = br.items.filter((it) => !it.ok).length;
    const missNote =
      !br.ready && missN > 0
        ? `<p class="meta breakthrough-miss-note">尚欠 ${missN} 項${
            firstMiss ? ` · 先做：${escapeHtml(firstMiss.label)}（${escapeHtml(firstMiss.progress)}）` : ""
          }</p>`
        : "";
    const compactCls = br.items.length > 6 ? " is-compact" : "";
    return wrapStage(
      nav,
      `<h2>契壇修行 · 進階</h2>
      <p class="lead">→【${escapeHtml(br.next.name)}】潮印 ${seal.seals}/${seal.max} · 全隊 ×${seal.mult.toFixed(2)}</p>
      ${missNote}
      <ul class="cond-list breakthrough-gates${compactCls}">${gateRows}</ul>`,
      `<div class="row">
        <button type="button" class="primary${tutGlow({ type: "act", act: "break" })}" data-act="break" ${br.ready ? "" : "disabled"}>${escapeHtml(breakLabel)}</button>
        <button type="button" data-act="tide-seal" ${seal.canSeal ? "" : "disabled"}>鑄潮印${seal.canSeal ? `+${seal.nextGain}` : ""}</button>
      </div>`
    );
  }

  const depthMax = siteCur?.maxDepth ?? 0;
  const depthCur = siteCur?.idleDepth ?? 0;
  const depthBtns = depthMax > 0
    ? Array.from({ length: depthMax + 1 }, (_, i) => {
        const label = i >= TRAIN_TIER_COUNT ? "域主" : `霧${i + 1}`;
        const mult = (TRAIN_DEPTH_MULT[i] ?? 1).toFixed(2);
        return `<button type="button" class="${i === depthCur ? "primary" : "secondary"} train-depth-btn" data-set-depth="${i}" title="×${mult}">${label}</button>`;
      }).join("")
    : "";
  const depthRow = depthBtns
    ? `<div class="row train-depth-row"><span class="muted">掛機層：</span>${depthBtns}</div>`
    : "";

  const tierActionBtns = [];
  if (siteCur?.canClaimNext) {
    tierActionBtns.push(`<button type="button" class="primary" data-claim-tier>去下一層</button>`);
  }
  if (siteCur?.canChallengeWarden) tierActionBtns.push(`<button type="button" class="primary" data-challenge-warden>挑戰域主（${escapeHtml(siteCur.keyName)} ${siteCur.keyHave}）</button>`);
  if (siteCur?.canRematchWarden) tierActionBtns.push(`<button type="button" class="secondary" data-challenge-warden>複打域主（${escapeHtml(siteCur.keyName)} ${siteCur.keyHave}）</button>`);
  if ((state.materials?.breed_ticket || 0) >= 1) tierActionBtns.push(`<button type="button" class="secondary" data-act="use-breed-ticket">催生符</button>`);
  if ((state.materials?.blood_catalyst || 0) >= 1) tierActionBtns.push(`<button type="button" class="secondary" data-act="use-blood-catalyst">血統催化</button>`);

  return wrapStage(
    nav,
    `<h2>契壇修行 · 潮域</h2>
    <p class="lead">御靈師【${escapeHtml(m.name)}】· 牧場 ${ranchN}／${ranchCap(state)}</p>
    <div class="bar"><i data-live="qi-bar" style="width:${qiPct}%"></i></div>
    <p class="meta" data-live="qi-text">靈契 ${Math.floor(state.qi)} / ${next.need} · 【${escapeHtml(br.cur?.name || "")}】→【${escapeHtml(br.next.name)}】</p>
    ${
      tutorialQiReady(state)
        ? `<div class="row tut-cta-row"><button type="button" class="primary${tutGlow({ type: "panel-sub", group: "cultivate", id: "advance" })}" data-panel-sub="cultivate:advance">靈契已滿 → 前往突破</button></div>`
        : ""
    }
    ${trainIdleStripHtml()}
    ${depthRow}
    <div class="row train-tier-actions">${tierActionBtns.join("")}</div>
    <h3>潮域 ×${fmtMult(siteCur?.qiMult || 1)}${siteCur?.focus ? ` · 專精${escapeHtml(siteCur.focus)}` : ""}${siteCur?.isDailySpot ? " · 今日強化" : ""}</h3>
    ${spotNote}
    <div class="row tactics-row">${siteBtns}</div>
    ${trainLockNote}
    <p class="meta">${escapeHtml(siteCur?.depthLabel || "")} · 深度 ×${fmtMult(siteCur?.depthMult || 1)} · 效率 ×${fmtMult(siteCur?.efficiency || 1)} · ${escapeHtml(siteCur?.keyName || "潮鑰")} ${siteCur?.keyHave ?? 0}</p>
    ${trainRatesBlockHtml(rateLines)}
    <p class="meta muted">潮鑰由秘境高機率掉落 · 域主消耗潮鑰 · 複打掉稀有材</p>`
  );
}

function petStatusTag(kind) {
  const map = {
    fight: `<span class="pet-tag pet-tag-fight">出戰</span>`,
    dispatch: `<span class="pet-tag pet-tag-dispatch">派遣中</span>`,
    idle: `<span class="pet-tag pet-tag-idle">待命</span>`,
  };
  return map[kind] || "";
}

function petPowerScore(p) {
  return (p.atk || 0) * 2 + (p.hp || 0) + (p.spd || 0) + (p.level || 1) * 8 + (p.fusionLevel || 0) * 20;
}

function sortRanchEntries(entries, sortKey) {
  const statusRank = { fight: 0, dispatch: 1, idle: 2 };
  const elOrder = { tide: 0, flame: 1, gale: 2, stone: 3, gloom: 4 };
  const list = [...entries];
  list.sort((a, b) => {
    const pa = a.pet;
    const pb = b.pet;
    if (sortKey === "gen") {
      const d = petGeneration(pb) - petGeneration(pa);
      if (d) return d;
    } else if (sortKey === "rarity") {
      const d = (pb.rarity || 0) - (pa.rarity || 0);
      if (d) return d;
    } else if (sortKey === "element") {
      const d = (elOrder[pa.elementId] ?? 9) - (elOrder[pb.elementId] ?? 9);
      if (d) return d;
    } else if (sortKey === "power") {
      const d = petPowerScore(pb) - petPowerScore(pa);
      if (d) return d;
    } else {
      const d = (statusRank[a.kind] ?? 9) - (statusRank[b.kind] ?? 9);
      if (d) return d;
    }
    return petPowerScore(pb) - petPowerScore(pa);
  });
  return list;
}

function petGridCard(p, extraBtn = "", tagHtml = "") {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  const title = displayPetName(p);
  const r = rarityInfo(p.rarity ?? 0);
  const g = petGeneration(p);
  return `
    <li class="pet-card">
      <div class="pet-card-top">
        ${petIconFromPet(p, { size: 28 })}
        <div class="pet-card-title">
          <button type="button" class="linkish${tutGlow({ type: "pet-detail" })}" data-pet-detail="${uid}"><strong>${escapeHtml(title)}</strong></button>
          ${tagHtml}
        </div>
      </div>
      <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(g)} · Lv.${lv}${fus ? ` · 融${fus}` : ""}</span>
      <span class="muted">${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)} · 攻${fmtInt(p.atk)}</span>
      <div class="row-actions pet-card-actions">
        <button type="button" class="info${tutGlow({ type: "pet-detail" })}" data-pet-detail="${uid}">詳情</button>
        ${extraBtn}
      </div>
    </li>`;
}

function petRow(p, extraBtn = "", tagHtml = "") {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  const title = displayPetName(p);
  const r = rarityInfo(p.rarity ?? 0);
  const g = petGeneration(p);
  return `
    <li class="card-row pet-row">
      ${petIconFromPet(p, { size: 34 })}
      <div>
        <button type="button" class="linkish${tutGlow({ type: "pet-detail" })}" data-pet-detail="${uid}"><strong>${escapeHtml(title)}</strong></button>
        ${tagHtml}
        <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(g)} · Lv.${lv}${fus ? ` · 融${fus}` : ""} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}${p.personality2Name ? `/${escapeHtml(p.personality2Name)}` : ""}${p.bloodlineName && p.bloodlineName !== "無紋" ? `·${escapeHtml(p.bloodlineName)}` : ""}</span>
        <span class="muted">攻${fmtInt(p.atk)} 血${fmtInt(p.hp)} 速${fmtInt(p.spd)} · 【${escapeHtml(p.skillName || SKILLS[p.skillId]?.name || "—")}】</span>
      </div>
      <div class="row-actions">
        <button type="button" class="info${tutGlow({ type: "pet-detail" })}" data-pet-detail="${uid}">詳情</button>
        ${extraBtn}
      </div>
    </li>`;
}

function dispatchModalHtml() {
  if (!dispatchModal) return "";
  const dv = dispatchView(state);
  const mission = dv.missions.find((m) => m.id === dispatchModal.missionId);
  if (!mission || mission.locked) return "";
  const need = mission.needPets;
  const pick = new Set(dispatchModal.pick || []);
  const busy = new Set(dv.busyUids || []);
  const ranch = state.ranch || [];
  const rows =
    ranch
      .filter((p) => !busy.has(p.uid))
      .map((p) => {
        const selected = pick.has(p.uid);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(displayPetName(p))}</strong>
            <span class="muted">${escapeHtml(p.kind)}·${escapeHtml(p.elementName)} · 攻${fmtInt(p.atk)} 血${fmtInt(p.hp)}</span>
          </div>
          <button type="button" class="${selected ? "primary" : "secondary"}" data-dispatch-pick="${escapeHtml(p.uid)}">${selected ? "已選" : "選擇"}</button>
        </li>`;
      })
      .join("") || `<li class="empty">牧場無可派遣靈寵（需撤回出戰或等派遣歸來）。</li>`;
  return `
    <div class="sheet-overlay" role="presentation" data-live="dispatch-modal">
      <div class="sheet-card" role="dialog" aria-label="選擇派遣靈寵" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>${escapeHtml(mission.name)}</h3>
        <p class="meta">${escapeHtml(mission.desc)} · 需 ${need} 隻 · 已選 ${pick.size}/${need}</p>
        <ul class="list">${rows}</ul>
        <div class="row">
          <button type="button" class="secondary" data-act="close-dispatch-modal">取消</button>
          <button type="button" class="primary" data-act="confirm-dispatch" ${pick.size === need ? "" : "disabled"}>派出</button>
        </div>
      </div>
    </div>`;
}

function attackPreviewModalHtml() {
  if (!attackPreview) return "";
  const prev = dungeonTeamPreview(state, attackPreview.dungeonId);
  if (!prev?.ok) {
    return `
    <div class="sheet-overlay" role="presentation">
      <div class="sheet-card" role="dialog" aria-label="出戰預覽" data-sheet-card>
        <p class="meta">${escapeHtml(prev?.msg || "無法預覽。")}</p>
        <button type="button" class="secondary" data-act="close-attack-preview">關閉</button>
      </div>
    </div>`;
  }
  const allyRows = prev.allies
    .map(
      (a) =>
        `<li class="preview-unit ally"><strong>${escapeHtml(a.name)}</strong><span class="muted">${escapeHtml(a.elementName || "")} · 攻${fmtInt(a.atk)} 血${fmtInt(a.hp)} 速${fmtInt(a.spd)} · 【${escapeHtml(a.skillName)}】</span></li>`
    )
    .join("");
  const foeRows = prev.foes
    .map(
      (f) =>
        `<li class="preview-unit foe"><strong>${escapeHtml(f.name)}</strong><span class="muted">${f.role === "boss" ? "BOSS" : f.role === "elite" ? "精英" : "普通"} · 攻${fmtInt(f.atk)} 血${fmtInt(f.hp)} 速${fmtInt(f.spd)}</span></li>`
    )
    .join("");
  const synLine = prev.synergyLabels?.length ? prev.synergyLabels.join("、") : "無";
  const modeLabel = attackPreview.mode === "sweep" ? `掃蕩 ×${dungeonGateView(state, attackPreview.dungeonId).batch || summonCount}` : "單次挑戰";
  return `
    <div class="sheet-overlay" role="presentation" data-live="attack-preview">
      <div class="sheet-card" role="dialog" aria-label="出戰預覽" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>出戰預覽 · ${escapeHtml(prev.dungeonName)}</h3>
        <p class="meta">${modeLabel} · ${prev.waveCount} 波（普${prev.roles.normal}/精${prev.roles.elite}/王${prev.roles.boss}） · 戰術【${escapeHtml(prev.tacticsName)}】· 陣型【${escapeHtml(prev.formationName)}】</p>
        <p class="meta">羈絆：${escapeHtml(synLine)} · 條件 ${prev.conditionsMet}/${prev.conditionsTotal}${prev.challengeMet ? "" : " · 挑戰未達"}</p>
        <h4>我方</h4>
        <ul class="preview-roster">${allyRows}</ul>
        <h4>第 1 波敵方</h4>
        <ul class="preview-roster">${foeRows}</ul>
        <div class="row">
          <button type="button" class="secondary" data-act="close-attack-preview">取消</button>
          <button type="button" class="primary" data-act="confirm-attack">${attackPreview.mode === "sweep" ? "開始掃蕩" : "開始挑戰"}</button>
        </div>
      </div>
    </div>`;
}

function petsListView() {
  const cap = ranchCap(state);
  const ranch = state.ranch || [];
  const dv = dispatchView(state);
  const busy = new Set(dv.busyUids || []);

  const roster =
    state.pets
      .map((p) =>
        petRow(
          p,
          `<button type="button" class="secondary" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`,
          petStatusTag("fight")
        )
      )
      .join("") ||
    `<li class="empty">出戰欄空。從牧場派出靈寵（最多 ${ACTIVE_PET_MAX}）。</li>`;

  const deployedIds = new Set((state.pets || []).map((p) => p.uid));
  const ranchIdle = (ranch || []).filter((p) => !deployedIds.has(p.uid));
  const ranchEntries = sortRanchEntries(
    [
      ...ranchIdle.filter((p) => busy.has(p.uid)).map((p) => ({ pet: p, kind: "dispatch" })),
      ...(state.pets || []).map((p) => ({ pet: p, kind: "fight" })),
      ...ranchIdle.filter((p) => !busy.has(p.uid)).map((p) => ({ pet: p, kind: "idle" })),
    ],
    ranchSort
  );
  const ranchList =
    ranchEntries
      .map(({ pet: p, kind }) => {
        const tag =
          kind === "fight"
            ? petStatusTag("fight")
            : kind === "dispatch"
              ? petStatusTag("dispatch")
              : petStatusTag("idle");
        const extra =
          kind === "fight"
            ? `<button type="button" class="secondary" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`
            : kind === "dispatch"
              ? ""
              : `<button type="button" class="primary${tutGlow({ type: "deploy" })}" data-deploy="${escapeHtml(p.uid)}">出戰</button>`;
        return petGridCard(p, extra, tag);
      })
      .join("") ||
    `<li class="empty pet-grid-empty">牧場空。孵化／契約成功的靈寵會進入牧場（容量 ${cap}）。</li>`;

  const sortOpts = [
    ["status", "狀態"],
    ["power", "戰力"],
    ["gen", "代數"],
    ["rarity", "稀有"],
    ["element", "屬性"],
  ]
    .map(
      ([id, label]) =>
        `<button type="button" class="sort-chip${ranchSort === id ? " on" : ""}" data-ranch-sort="${id}">${label}</button>`
    )
    .join("");

  const eggRows =
    eggsView(state)
      .map((e) => {
        const action = !e.hatching
          ? `<button type="button" class="primary${tutGlow({ type: "start-hatch" })}" data-start-hatch="${escapeHtml(e.uid)}">開始孵化</button>`
          : e.ready
            ? `<button type="button" class="primary${tutGlow({ type: "claim-hatch" })}" data-claim-hatch="${escapeHtml(e.uid)}">領取</button>`
            : `<span class="muted" data-egg-timer data-egg-uid="${escapeHtml(e.uid)}" data-ready-at="${e.readyAt || 0}">孵化中 ${e.leftSec}s</span>`;
        return `
        <li class="card-row egg-row">
          <div>
            <strong>${escapeHtml(e.name)}</strong>
            <span class="muted">${escapeHtml(e.label)} · ${escapeHtml(e.desc || "")}</span>
          </div>
          <div class="row-actions">${action}</div>
        </li>`;
      })
      .join("") || `<li class="empty muted">尚無寵物蛋。商肆／派遣可獲得。</li>`;

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
        if (!d.ready) {
          const left = Math.ceil((d.leftMs || 0) / 1000);
          return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(d.missionName)}</strong>
            <span class="muted">${escapeHtml(d.petNames)} · 剩餘 ${left}s</span>
          </div>
        </li>`;
        }
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(d.missionName)}</strong>
            <span class="muted">${escapeHtml(d.petNames)} · 已歸來</span>
          </div>
          <button type="button" class="success" data-claim-dispatch="${escapeHtml(d.dispatchId)}">領獎</button>
        </li>`;
      })
      .join("") || `<li class="empty">尚無進行中派遣。</li>`;

  const missionRows = dv.missions
    .filter((m) => !m.locked)
    .slice(0, 6)
    .map((m) => {
      const slotsOk = dv.slotsUsed < dv.slotsMax;
      const matBits = dispatchMatBits(m);
      const eggNote = m.eggChance
        ? ` · 蛋${Math.round((m.eggChance.rate || 0) * 100)}%`
        : "";
      return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(m.name)}</strong>
          <span class="muted">${escapeHtml(m.desc)} · 需 ${m.needPets} 隻 · ${escapeHtml(rewardBitsHtml(m.reward))}${
            matBits ? ` · ${matBits}` : ""
          }${eggNote}</span>
        </div>
        <button type="button" class="primary" data-open-dispatch="${m.id}" ${slotsOk ? "" : "disabled"}>派出</button>
      </li>`;
    })
    .join("");

  const syn = partySynergy(state.pets);
  const synNote = syn.labels.length ? syn.labels.join("、") : "同元素／種類／親子可羈絆";

  const nav = partyNavHtml();
  const sub = panelSub.party;

  if (sub === "ranch") {
    return wrapStage(
      nav,
      `<h2>靈寵 · 牧場</h2>
      <p class="lead">牧場 ${ranch.length}/${cap} · 出戰 ${state.pets.length} · 蛋 ${(state.eggs || []).length}/6 · 待命微產飼料／靈塵／潮霧令</p>
      <h3>寵物蛋</h3>
      <ul class="list">${eggRows}</ul>
      <div class="ranch-sort" role="group" aria-label="牧場排序">${sortOpts}</div>
      <ul class="pet-grid">${ranchList}</ul>`
    );
  }
  if (sub === "breed") {
    const breed = petsBreedView();
    return wrapStage(nav, breed.body, breed.dock);
  }
  if (sub === "dispatch") {
    return wrapStage(
      nav,
      `<h2>靈寵 · 派遣</h2>
      <p class="lead">槽位 ${dv.slotsUsed}/${dv.slotsMax} · 撳「派出」選擇靈寵</p>
      <ul class="list">${missionRows || `<li class="empty muted">尚無可接派遣（解鎖更多練功地後開放）。</li>`}</ul>
      <ul class="list">${activeDisp}</ul>`
    );
  }
  if (sub === "bond") {
    return wrapStage(
      nav,
      `<h2>靈寵 · 待契約</h2>
      <p class="lead">待契約 ${(state.pending || []).length}/${PENDING_BOND_MAX}</p>
      <ul class="list">${pending}</ul>`
    );
  }

  return wrapStage(
    nav,
    `<h2>靈寵 · 出戰</h2>
    <p class="lead">${state.pets.length}/${ACTIVE_PET_MAX} · ${escapeHtml(synNote)}</p>
    <ul class="list">${roster}</ul>`
  );
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
  const dispatchBusy = new Set(dispatchView(state).busyUids || []);
  const matingBusy = new Set(bs.busyUids || []);
  const selected = new Set(petView.breedParents || []);
  const [ua, ub] = petView.breedParents || [];
  const pa = ranch.find((p) => p.uid === ua);
  const pb = ranch.find((p) => p.uid === ub);

  const jobRows =
    (bs.jobs || [])
      .map((j) => {
        const sec = Math.ceil((j.leftMs || 0) / 1000);
        if (j.ready) {
          return `<li class="card-row breed-job is-ready">
            <div>
              <strong>${escapeHtml(j.names?.[0] || "？")} × ${escapeHtml(j.names?.[1] || "？")}</strong>
              <span class="muted">孕育完成 · 可領子代</span>
              <div class="bar breed-cd-bar"><i style="width:100%"></i></div>
            </div>
            <button type="button" class="primary success" data-breed-claim="${escapeHtml(j.id)}">領取子代</button>
          </li>`;
        }
        return `<li class="card-row breed-job">
          <div>
            <strong>${escapeHtml(j.names?.[0] || "？")} × ${escapeHtml(j.names?.[1] || "？")}</strong>
            <span class="muted">孕育中 · 剩餘 <strong>${sec}s</strong></span>
            <div class="bar breed-cd-bar"><i style="width:${j.pct || 0}%"></i></div>
          </div>
          <span class="pet-tag pet-tag-dispatch">交配中</span>
        </li>`;
      })
      .join("") ||
    `<li class="empty muted">尚無交配中——下方選雙親開始（最多 ${bs.queueMax || BREED_QUEUE_MAX} 欄，似秘境召喚）。</li>`;

  const slotHtml = (pet, idx) => {
    if (!pet) {
      return `<div class="breed-slot is-empty"><span class="muted">空位 ${idx + 1} · 下方加入</span></div>`;
    }
    return `<div class="breed-slot">
      ${petIconFromPet(pet, { size: 36 })}
      <div>
        <strong>${escapeHtml(displayPetName(pet))}</strong>
        <span class="muted">${genTagHtml(petGeneration(pet))} · ${escapeHtml(pet.elementName)}·${escapeHtml(pet.personalityName)}</span>
      </div>
      <button type="button" class="secondary" data-breed-toggle="${escapeHtml(pet.uid)}">移除</button>
    </div>`;
  };

  const idlePets = ranch.filter((p) => !dispatchBusy.has(p.uid));
  const list =
    idlePets
      .map((p) => {
        const on = selected.has(p.uid);
        const mating = matingBusy.has(p.uid);
        const r = rarityInfo(p.rarity ?? 0);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(displayPetName(p))}</strong>
            <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(
              petGeneration(p)
            )} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)} · Lv.${p.level ?? 1}${
              mating ? " · 交配中" : ""
            }</span>
          </div>
          <button type="button" class="${on ? "primary" : "secondary"}" data-breed-toggle="${escapeHtml(p.uid)}" ${
            mating && !on ? "disabled" : ""
          }>${mating ? "交配中" : on ? "已選" : "加入交配"}</button>
        </li>`;
      })
      .join("") || `<li class="empty">牧場需要待命靈寵才能交配（派遣中不可用）。</li>`;

  const preview = pa && pb ? breedPreview(pa, pb) : null;
  const bMat =
    pa && pb
      ? breedMatCost(petGeneration(pa), petGeneration(pb))
      : { coral_shard: 1 };
  const bMatHtml = matAffordHtml(bMat);
  const canStart =
    selected.size === 2 &&
    bs.ready &&
    !!pa &&
    !!pb &&
    !matingBusy.has(pa.uid) &&
    !matingBusy.has(pb.uid);

  const body = `<h2>靈寵 · 繁殖</h2>
    <p class="lead">開始交配後進入孕育（約 ${Math.ceil((bs.cooldownTotalMs || 45000) / 1000)}s），就緒再領子代 · 欄位 ${bs.slotsUsed || 0}/${bs.queueMax || BREED_QUEUE_MAX} · ${BREED_STONE_COST} 石＋材料</p>
    <h3>孕育中／可領</h3>
    <ul class="list breed-job-list">${jobRows}</ul>
    <h3>新一輪交配</h3>
    <div class="breed-slots">${slotHtml(pa, 0)}${slotHtml(pb, 1)}</div>
    ${preview ? breedPreviewHtml(preview, bMatHtml) : `<p class="meta">選擇雙親後顯示預覽</p>`}
    <h3>待命靈寵</h3>
    <ul class="list">${list}</ul>`;
  const dock = `<div class="row">
      <button type="button" class="primary${tutGlow({ type: "act", act: "start-breed" })}" data-breed-confirm ${canStart ? "" : "disabled"}>開始交配（${selected.size}/2）</button>
    </div>`;
  return { body, dock };
}

function partyNavHtml() {
  return panelSubNav("party", [
    { id: "fight", label: "出戰" },
    { id: "ranch", label: "牧場" },
    { id: "breed", label: "繁殖" },
    { id: "dispatch", label: "派遣" },
    { id: "bond", label: "待契" },
  ]);
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
    fuseMatCost: fuseMatsNeed,
    skill,
    fuseMaxed,
    fuseNeedLevel,
    fuseTotalPets,
    fuseMatNeed,
    nextFusionStage,
    skillLevel,
    skillDustCost: dustCost,
    skillMatCost: skillMatsNeed,
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
  const busySet = new Set(dispatchView(state).busyUids || []);
  const onDispatch = !deployed && busySet.has(pet.uid);
  const loc = deployed ? "出戰中" : onDispatch ? "派遣中" : "牧場待命";
  const fuseHint = fuseMaxed
    ? `已達融階上限（${FUSION_MAX_STAGE}）`
    : `下一融階 ${nextFusionStage}：主體≥Lv.${fuseNeedLevel}、共 ${fuseTotalPets} 隻（${fuseMatNeed} 素材）· ${fuseCostHint} 靈石${
        fuseMatsNeed && Object.keys(fuseMatsNeed).length
          ? `＋${matAffordHtml(fuseMatsNeed) || "融砂"}`
          : ""
      }`;

  const secondLine = secondUnlocked
    ? `【${escapeHtml(secondSkill?.name || "—")}】${secondSkill ? ` ${escapeHtml(secondSkill.desc)}（CD${secondSkill.cd}）` : ""}`
    : `未解鎖（融階≥1 或 Lv≥15）`;

  const matUp = upgradeMatCost(lv);
  const matUpHtml = matAffordHtml(matUp);
  const skillMatHtml =
    skillMatsNeed && Object.keys(skillMatsNeed).length ? matAffordHtml(skillMatsNeed) : "";
  const lineage = petLineage(state, pet.uid);
  return wrapStage(
    "",
    `<h2>${escapeHtml(displayPetName(pet))}</h2>
    <p class="lead">${escapeHtml(loc)} · ${genTagHtml(g)} · Lv.${lv} 融${fus}</p>
    <ul class="skill-list">
      <li><strong>屬性</strong> — ${escapeHtml(pet.kind)}·${escapeHtml(pet.elementName)} · <span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span></li>
      <li><strong>性格</strong> — ${escapeHtml(pet.personalityName)}${pet.personality2Name ? `／${escapeHtml(pet.personality2Name)}` : ""}${pet.bloodlineName && pet.bloodlineName !== "無紋" ? ` · 血脈${escapeHtml(pet.bloodlineName)}` : ""}</li>
      <li><strong>戰力</strong> — 攻${pet.atk} 血${pet.hp} 速${pet.spd}</li>
      <li><strong>技能</strong> — 【${escapeHtml(pet.skillName || skill?.name || "—")}】Lv.${skillLevel}${
        skillMaxed
          ? "（滿）"
          : dustCost != null
            ? ` · 升需靈塵${dustCost}${skillMatHtml ? `＋${skillMatHtml}` : ""}`
            : ""
      }</li>
      <li><strong>升級</strong> — ${upgradeCostLine(upgradeCost, feedCost, lv)}</li>
    </ul>
    ${lineageHtml(lineage)}
    <div class="row gear-row">
      <label>暱稱<input type="text" maxlength="${NICK_MAX_LEN}" data-nick-input value="${escapeHtml(pet.nick || "")}" placeholder="${escapeHtml(pet.name)}" /></label>
      <button type="button" data-rename="${escapeHtml(pet.uid)}">命名</button>
    </div>`,
    `<div class="row">
      <button type="button" class="primary${tutGlow({ type: "upgrade" })}" data-upgrade-feed="${escapeHtml(pet.uid)}">飼料升級</button>
      <button type="button" class="secondary" data-upgrade="${escapeHtml(pet.uid)}">靈石升級</button>
      <button type="button" data-upgrade-skill="${escapeHtml(pet.uid)}" ${skillMaxed ? "disabled" : ""}>技能</button>
      <button type="button" data-temper-oil="${escapeHtml(pet.uid)}" ${(state.materials?.temper_oil || 0) < 1 ? "disabled" : ""}>洗性格${(state.materials?.temper_oil || 0) > 0 ? `（${state.materials.temper_oil}）` : ""}</button>
    </div>
    <div class="row">
      ${
        isFusionUnlocked(state)
          ? `<button type="button" class="primary${tutGlow({ type: "start-fuse" })}" data-start-fuse="${escapeHtml(pet.uid)}" ${fuseMaxed ? "disabled" : ""}>融合</button>`
          : ""
      }
      ${
        deployed
          ? `<button type="button" data-undeploy="${escapeHtml(pet.uid)}">撤回</button>`
          : `<button type="button" data-deploy="${escapeHtml(pet.uid)}">出戰</button>`
      }
      <button type="button" data-release="${escapeHtml(pet.uid)}">放歸</button>
      <button type="button" data-pet-back>返回</button>
    </div>`
  );
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
  return wrapStage(
    "",
    `<h2>融合 · 融階 ${target}</h2>
    <p class="lead">主體 ${escapeHtml(base.name)} Lv.${baseLv}${lvOk ? "" : `（需 ≥${needLv}）`} · 已選素材 ${selected.size}/${needMats} · 耗 ${cost} 靈石 · 結果繼承主體等級</p>
    <ul class="list">${mats}</ul>`,
    `<div class="row">
      <button type="button" class="primary" data-fuse-confirm ${ready ? "" : "disabled"}>確認融合</button>
      <button type="button" data-pet-detail="${escapeHtml(base.uid)}">返回詳情</button>
      <button type="button" data-pet-back>返回列表</button>
    </div>`
  );
}

function petsPanel() {
  if (petView.mode === "detail") return petsDetailView();
  if (petView.mode === "fuse") return petsFuseView();
  return petsListView();
}

function codexPanel() {
  const dex = bestiaryStatus(state);
  const speciesRows = bestiarySpeciesSummary(state)
    .filter((s) => s.found > 0 || !s.breedOnly)
    .slice(0, 48)
    .map((s) => {
      const pct = Math.min(100, Math.round((s.found / Math.max(1, s.total)) * 100));
      const unlocked = s.found > 0;
      return `<li class="card-row codex-row${unlocked ? " is-unlocked" : ""}">
        <div class="codex-icon">${unlocked ? petIconHtml(s.speciesId, { size: 36 }) : `<span class="pet-icon pet-icon-unknown">?</span>`}</div>
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
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
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

  return wrapStage(
    panelSubNav("codex", [
      { id: "dex", label: "圖鑑" },
      { id: "path", label: "求道" },
      { id: "tasks", label: "任務" },
      { id: "recipe", label: "配方" },
    ]),
    panelSub.codex === "dex"
      ? `<h2>靈寵圖鑑</h2>
    <p class="lead">已錄 ${dex.discovered}/${dex.total}${dex.label ? ` · ${escapeHtml(dex.label)}` : ""} · 種×屬×血脈（${dex.total}）</p>
    <ul class="list">${speciesRows || '<li class="empty">尚未登錄</li>'}</ul>`
      : panelSub.codex === "path"
        ? `<h2>求道</h2>
    <p class="lead">長線目標：收集／育成／挑戰</p>
    ${pathTracks}`
        : panelSub.codex === "tasks"
          ? `<h2>任務</h2>
    ${dailyTasksToolbarHtml()}
    ${breedGoalsBoardHtml(true)}
    <h3>每日 · ${dailyAllClearView(state).claimed}/${dailyAllClearView(state).total}</h3>
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
  );
}

function combatRewardBreakdownHtml(bd) {
  if (!bd) return "";
  return `<ul class="cond-list reward-breakdown">
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
          </ul>`;
}

function sweepModalHtml() {
  const r = sweepResult;
  if (!r) return "";
  const encounterLine = r.encounter
    ? `<p class="hub-mod">潮霧遇見【${escapeHtml(r.encounter.name)}】— 可至待契結契</p>`
    : r.encounterBlocked
      ? `<p class="muted">待契欄已滿，未再遇見新靈</p>`
      : "";
  const detailRows = (r.perRun || [])
    .map(
      (run, i) =>
        `<li class="card-row"><div><strong>第 ${i + 1} 次</strong><span class="muted">${run.won ? "勝" : "敗"} · +${run.stones}石${run.scrap ? `／+${run.scrap}碎` : ""}</span></div></li>`
    )
    .join("");
  return `
    <div class="combat-modal-overlay sweep-modal-overlay" data-live="sweep-modal" role="dialog" aria-label="掃蕩結算">
      <div class="combat-modal-card">
        <div class="combat-modal-scroll">
          <h2>掃蕩結算 · ${escapeHtml(r.dungeonName || "")}</h2>
          <p class="lead">${escapeHtml(r.msg || "")}</p>
          <div class="settle-summary-row">
            <div>
              <strong class="settle-total">+${r.totalStones} 靈石</strong>
              <span class="muted">勝 ${r.wins}／敗 ${r.losses} · 耗潮霧令×${r.tokenCost || 0} · 碎片 +${r.totalScrap || 0}</span>
            </div>
          </div>
          ${encounterLine}
          <h3>各次明细</h3>
          <ul class="list">${detailRows}</ul>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="primary" data-act="close-sweep-modal">返回秘境</button>
        </div>
      </div>
    </div>`;
}

function combatModalHtml() {
  if (!playback) return "";
  const pct = Math.min(
    100,
    Math.round((playback.index / Math.max(1, playback.events.length)) * 100)
  );
  const lines = playback.shown
    .map((t, i) => {
      const ev = playback.events[i];
      return combatLogLineHtml(t, ev);
    })
    .join("");
  const bd = playback.result?.rewardBreakdown;
  const wonSettle = playback.done && bd && playback.result.won;
  const settleHead = wonSettle
    ? `<div class="settle-summary-row">
        <div>
          <strong class="settle-total">+${bd.totalStones} 靈石</strong>
          <span class="muted">${bd.base?.scrap ? `基礎通碎片 +${bd.base.scrap}` : "通關結算"}</span>
        </div>
        <button type="button" class="ghost" data-act="toggle-reward-details">${rewardDetailsOpen ? "收起明細" : "獎勵明細"}</button>
      </div>
      ${rewardDetailsOpen ? combatRewardBreakdownHtml(bd) : ""}`
    : "";
  const logBlock = playback.done
    ? ""
    : `<div class="combat-scroll combat-log-fixed" data-live="combat-scroll">
        <ul class="combat" data-live="combat-log">${lines}</ul>
      </div>`;
  const tacticsStep = tutorialActive(state) && state.tutorial.step === "tactics";
  const isTrain = playback.result?.combatKind === "train";
  const clearLabel = tacticsStep ? "前往戰術設定" : isTrain ? "返回練功" : "返回秘境";
  const clearAct = tacticsStep ? "clear-combat-setup" : "clear-combat";
  return `
    <div class="combat-modal-overlay" data-live="combat-modal" role="dialog" aria-label="${playback.done ? "結算" : "戰報"}">
      <div class="combat-modal-card combat-report-card">
        <div class="combat-modal-scroll">
          <h2>${playback.done ? "結算" : "戰報"}${playback.isFarm && combatPrefs.fastMode ? `<span class="combat-fast-badge">快速</span>` : ""}</h2>
          ${playback.waveLabel && !playback.done ? `<p class="combat-wave-banner" data-live="combat-wave">${escapeHtml(playback.waveLabel)}</p>` : `<p class="combat-wave-banner" data-live="combat-wave" hidden></p>`}
          ${logBlock}
          <p class="lead combat-round-meta" data-live="combat-meta">${escapeHtml(combatPlaybackMeta(playback))}</p>
          <div class="bar combat-bar"><i data-live="combat-bar" style="width:${pct}%"></i></div>
          ${renderCombatRoster(playback)}
          ${playback.skipped && playback.skipSummary ? skipSummaryHtml(playback.skipSummary) : ""}
          ${settleHead}
        </div>
        <div class="combat-modal-actions row">
          <button type="button" data-act="skip-combat" ${playback.done ? "hidden" : ""}>跳過動畫</button>
          <button type="button" class="primary" data-act="${clearAct}" ${playback.done ? "" : "disabled"}>${escapeHtml(clearLabel)}</button>
        </div>
      </div>
    </div>`;
}

function dungeonCondSheetHtml() {
  const dungeonIds = dungeonsForRealm(state.realm).filter((id) => resolveDungeon(state, id));
  const curId = dungeonIds[dungeonIdx];
  const dCur = curId ? resolveDungeon(state, curId) : null;
  if (!dCur) return "";
  const stCur = dungeonStatus(state, dCur.id);
  const tutWaiveDungeon = tutorialWaivesDungeonChallenge(state, dCur.id);
  const conds = (stCur?.conditions || []).filter((c) => !c.passive);
  const passives = (stCur?.conditions || []).filter((c) => c.passive);
  const condList = tutWaiveDungeon
    ? `<li class="cond-item is-met is-tut-waive"><span class="cond-badge">教學</span><div class="cond-body"><strong>教學模式</strong><span class="muted">今日挑戰／試煉條件已豁免，可直接進攻</span></div></li>`
    : conds
        .map((c) => condStatusRow(c.label.replace(/^條件[:：]?\s*/, ""), c.ok, rewardBitsHtml(c.bonus), c.reason))
        .join("");
  const trial = stCur?.trial;
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
  return `
    <div class="sheet-overlay" role="presentation">
      <div class="sheet-card" role="dialog" aria-label="本層條件" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>本層條件 · ${escapeHtml(dCur.name)}</h3>
        ${passiveLine ? `<p class="meta">${escapeHtml(passiveLine)}</p>` : ""}
        <ul class="cond-list">${tutWaiveDungeon ? condList : `${challengeRow}${condList}${trialRow}`}</ul>
        <button type="button" class="primary sheet-close" data-act="close-cond-sheet">關閉</button>
      </div>
    </div>`;
}


function abyssPanelHtml() {
  const v = abyssDiveView(state);
  if (!v.unlocked) {
    return `<h2>潮淵深潛</h2>
      <p class="lead">無盡程序層 · 突變規則 · 專屬淵砂</p>
      <p class="meta">先通關秘境【潮汐一層】或達到通靈初期後解鎖。</p>`;
  }
  const run = v.run;
  const mutLine = run?.mutations?.length
    ? run.mutations.map((m) => `【${escapeHtml(m.name)}】${escapeHtml(m.desc)}`).join("<br/>")
    : "尚無突變";
  const runBlock = run
    ? `<div class="abyss-run card-block">
        <p class="lead">進行中 · 第 <strong>${run.depth}</strong> 層 · 待結算淵砂 <strong>${run.pendingGrit}</strong></p>
        <p class="meta">突變：${mutLine}</p>
        <div class="row">
          <button type="button" class="primary" data-abyss-advance>再潛一層</button>
          <button type="button" class="secondary" data-abyss-retreat>撤退結算</button>
        </div>
      </div>`
    : `<div class="abyss-run card-block">
        <p class="lead">未開潛</p>
        <p class="meta">今日首趟免費 · 其後耗潮霧令 ×${v.entryCost || 1}（現有 ${v.tokenHave}）</p>
        <button type="button" class="primary" data-abyss-start>開始深潛</button>
      </div>`;
  const cosRows = (v.cosmeticList || [])
    .map((c) => {
      const owned = c.owned ? "已擁有" : `淵砂×${c.cost}`;
      return `<li class="card-row">
        <div><strong>${escapeHtml(c.name)}</strong><span class="muted"> · ${escapeHtml(c.desc)}</span></div>
        <button type="button" class="secondary" data-abyss-cosmetic="${c.id}" ${c.owned ? "disabled" : ""}>${owned}</button>
      </li>`;
    })
    .join("");
  return `<h2>潮淵深潛</h2>
    <p class="lead">無限層 · 突變 · 淵砂兌換</p>
    <p class="meta">淵砂 <strong>${v.gritHave}</strong> · 最深 ${v.bestDepth} · 本週 ${v.weekBestDepth} · 保險 ${v.insuranceCharges}</p>
    ${runBlock}
    <h3>淵砂兌換</h3>
    <ul class="list">
      <li class="card-row">
        <div><strong>突變保險</strong><span class="muted"> · 下場略過 1 條新突變</span></div>
        <button type="button" class="secondary" data-abyss-insurance ${v.insuranceCharges >= 1 ? "disabled" : ""}>淵砂×${v.insuranceCost}</button>
      </li>
      <li class="card-row">
        <div><strong>潮淵高階蛋</strong><span class="muted"> · 本週 ${v.eggsBoughtWeek}/${v.eggsWeeklyLimit} · 較易出稀有</span></div>
        <button type="button" class="secondary" data-abyss-egg ${v.eggsBoughtWeek >= v.eggsWeeklyLimit ? "disabled" : ""}>淵砂×${v.eggCost}</button>
      </li>
      ${cosRows}
    </ul>`;
}

function dungeonPanel() {
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
  const gate = stCur?.gate || (dCur ? dungeonGateView(state, dCur.id) : null);
  const summonSec = gate ? Math.ceil((gate.summonLeftMs || 0) / 1000) : 0;
  const clearNote = stCur?.cleared ? "已通" : `首通+${dCur?.firstClearBonus?.stones || 0}石`;
  const roles = stCur?.roles;
  const waveN = roles?.waves || (dCur ? dungeonWaves(dCur).length : 0);
  const roleBits = roles ? `${waveN}波 普${roles.normal}/精${roles.elite}/王${roles.boss}` : `${waveN}波`;
  const trial = stCur?.trial;
  const conds = (stCur?.conditions || []).filter((c) => !c.passive);
  const passives = (stCur?.conditions || []).filter((c) => c.passive);
  const passiveLine = passives.map((p) => p.label).join(" · ");
  const variantLine = dCur?.dailyVariantLabel
    ? `<span class="muted daily-variant">今日：${escapeHtml(dCur.dailyVariantLabel)}</span>`
    : "";
  const gateNote = !gate
    ? ""
    : gate.summoning
      ? ` · 凝聚中 ${summonSec}s`
      : gate.needsSummon && gate.phase === "ready"
        ? gate.batch > 1
          ? ` · 就緒 · 掃蕩×${gate.batch}`
          : " · 就緒可挑戰"
        : gate.needsSummon
          ? " · 待召喚"
          : "";

  let metN = 0;
  let missN = 0;
  if (tutWaiveDungeon) {
    metN = 1;
  } else {
    for (const c of conds.slice(0, 2)) {
      if (c.ok) metN += 1;
      else missN += 1;
    }
    if (stCur?.challenge) {
      if (stCur.challengeMet) metN += 1;
      else missN += 1;
    }
    if (trial) {
      if (stCur.trialMet) metN += 1;
      else missN += 1;
    }
  }
  const condTrigger =
    dCur && (tutWaiveDungeon || metN + missN > 0)
      ? `<button type="button" class="cond-sheet-trigger" data-act="toggle-cond-sheet">
          <span>敵情條件</span>
          <strong>${tutWaiveDungeon ? "教學豁免" : `達成 ${metN}`}${!tutWaiveDungeon && missN ? ` · 未達 ${missN}` : ""}</strong>
          <span class="muted">查看</span>
        </button>`
      : "";

  const dungeonCard = dCur
    ? `<li class="dungeon-card">
        <div class="dungeon-head">
          <div>
            <strong>${escapeHtml(dCur.name)}</strong>
            ${variantLine}
            <span class="muted">${escapeHtml(roleBits)} · ${dCur.reward.stones}石 · ${clearNote}${
              locked ? ` · 需${escapeHtml(stageAt(dCur.needRealm).name)}` : ""
            }${gateNote}</span>
            ${passiveLine ? `<span class="muted">${escapeHtml(passiveLine)}</span>` : ""}
          </div>
        </div>
        ${condTrigger}
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
  const fieldDock =
    panelSub.dungeon === "field"
      ? (() => {
          if (!dCur) return `<div class="row dungeon-dock-row">${pager}</div>`;
          const tokenHave = Math.floor(state.materials?.mist_token || 0);
          const baseCdMs = dCur.cooldownMs || gate?.baseCdMs || 20_000;

          // 首通／教學：直接進攻（鎖階段仍可撳，彈原因）
          if (!gate?.needsSummon) {
            const block = locked ? dungeonAttackBlockReason(state, dCur.id) : null;
            return `<div class="dungeon-dock-stack">
          <div class="row dungeon-dock-row">
            ${pager}
            <button type="button" class="primary dungeon-attack-btn${tutGlow({ type: "dungeon", dungeonId: dCur.id })}" ${
              locked
                ? `data-dungeon-blocked="${escapeHtml(dCur.id)}"`
                : `data-attack-preview="${escapeHtml(dCur.id)}" data-attack-mode="single" data-dungeon="${escapeHtml(dCur.id)}"`
            }>${locked ? `無法進攻 · ${escapeHtml(stageAt(dCur.needRealm).name)}` : `進攻 · ${escapeHtml(dCur.name)}`}</button>
          </div>
          ${
            locked && block
              ? `<p class="dungeon-lock-reason">${escapeHtml(block)}</p>`
              : ""
          }
        </div>`;
          }

          // 凝聚中
          if (gate.summoning) {
            const batch = gate.batch || 1;
            const totalMs = Math.max(1, baseCdMs * batch);
            const summonPct = Math.min(100, Math.round(((totalMs - (gate.summonLeftMs || 0)) / totalMs) * 100));
            return `<div class="dungeon-dock-stack">
          <div class="row dungeon-dock-row">${pager}</div>
          <div class="summon-progress-wrap">
            <p class="sweep-label">潮霧凝聚中 · ${summonSec}s${batch > 1 ? ` · ×${batch}` : ""}</p>
            <div class="bar summon-bar"><i data-live="summon-bar" style="width:${summonPct}%"></i></div>
          </div>
        </div>`;
          }

          // 就緒：開始挑戰／掃蕩
          if (gate.phase === "ready") {
            const batch = gate.batch || 1;
            const challengeBtn =
              batch > 1
                ? `<button type="button" class="primary dungeon-attack-btn sweep-run-btn" data-attack-preview="${escapeHtml(dCur.id)}" data-attack-mode="sweep" data-dungeon="${escapeHtml(dCur.id)}">開始掃蕩 ×${batch}</button>`
                : `<button type="button" class="primary dungeon-attack-btn${tutGlow({ type: "dungeon", dungeonId: dCur.id })}" data-attack-preview="${escapeHtml(dCur.id)}" data-attack-mode="single" data-dungeon="${escapeHtml(dCur.id)}">開始挑戰 · ${escapeHtml(dCur.name)}</button>`;
            return `<div class="dungeon-dock-stack">
          <div class="row dungeon-dock-row">
            ${pager}
            ${challengeBtn}
          </div>
          <p class="sweep-label">秘境已現形 — 開戰後將散去，需再召喚</p>
        </div>`;
          }

          // 待召喚：slider + 召喚
          const costInfo = dungeonSweepCost(state, dCur.id, summonCount);
          const affordOk = !!costInfo?.canAfford;
          const summonSecEst = Math.ceil((baseCdMs * summonCount) / 1000);
          return `<div class="dungeon-dock-stack">
          <div class="row dungeon-dock-row">${pager}</div>
          <div class="summon-controls">
            <div class="summon-slider-row">
              <span class="sweep-label">召喚場數 <strong>${summonCount}</strong></span>
              <input type="range" class="summon-slider" min="${DUNGEON_SUMMON_MIN}" max="${DUNGEON_SUMMON_MAX}" value="${summonCount}" data-summon-slider aria-label="召喚場數" />
              <span class="muted">${DUNGEON_SUMMON_MIN}–${DUNGEON_SUMMON_MAX}</span>
            </div>
            <p class="sweep-label">潮霧令 ${fmtInt(tokenHave)}（秘境不掉令）· ${costInfo.label} · 約 ${summonSecEst}s</p>
            <button type="button" class="primary sweep-run-btn" data-summon="${escapeHtml(dCur.id)}" data-summon-count="${summonCount}" ${
              locked || !affordOk ? "disabled" : ""
            }>召喚 ×${summonCount}</button>
          </div>
        </div>`;
        })()
      : "";
  const nav = panelSubNav("dungeon", [
    { id: "field", label: "秘境" },
    { id: "abyss", label: "潮淵" },
    { id: "setup", label: "戰術" },
  ]);

  if (panelSub.dungeon === "setup") {
    return wrapStage(
      nav,
      `<h2>戰術／陣型</h2>
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
    );
  }

  if (panelSub.dungeon === "abyss") {
    return wrapStage(nav, abyssPanelHtml());
  }

  return wrapStage(
    nav,
    `<h2>潮汐秘境</h2>
    <p class="lead">已通關層需先召喚凝聚 · 就緒後挑戰 · 戰後散去</p>
    <label class="combat-pref-toggle"><input type="checkbox" data-act="toggle-combat-fast" ${combatPrefs.fastMode ? "checked" : ""}/> 已通關秘境快速戰鬥</label>
    ${
      dailyMod
        ? `<p class="dungeon-daily-mod">${escapeHtml(dailyMod.label)}</p>`
        : ""
    }
    <ul class="list dungeon-list">${dungeonCard}</ul>`,
    fieldDock
  );
}

function executeDungeonAttack(dungeonId, mode) {
  attackPreview = null;
  if (playback && !playback.done) return;
  tutMisclickCount = 0;
  const wasFight = tutorialActive(state) && state.tutorial.step === "dungeon_fight";
  if (wasFight) {
    if (!state.tutorial.flags) state.tutorial.flags = {};
    state.tutorial.flags.dungeonStarted = true;
  }
  if (mode === "sweep") {
    const gate = dungeonGateView(state, dungeonId);
    const n = gate.batch > 1 ? gate.batch : summonCount;
    const r = runDungeonSweep(state, dungeonId, n);
    saveState(state);
    if (!r.ok) {
      setFlash(r.msg);
      render();
      return;
    }
    sweepResult = r;
    render();
    return;
  }
  const r = runDungeon(state, dungeonId);
  saveState(state);
  if (!r.ok) {
    setFlash(r.msg);
    render();
    return;
  }
  let adv = { advanced: false, unlockMsg: null };
  if (wasFight) {
    adv = advanceTutorialIfReady(state);
  }
  if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
  startPlayback(r);
}

function logPanel() {
  const lines = state.log.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
  const busy = playback && !playback.done;
  return wrapStage(
    "",
    `<h2>見聞錄</h2><ul class="log">${lines || "<li class='empty'>尚無見聞。</li>"}</ul>`,
    `<div class="row log-tools">
      <button type="button" class="ghost" data-act="notify-perm">開啟通知</button>
      <button type="button" class="ghost" data-act="reset" ${busy ? "disabled" : ""}>重置存檔</button>
    </div>`
  );
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
      if (playback) {
        if (!playback.done) return;
        stopPlayback();
      }
      panelSub = { ...panelSub, [group]: id };
      if (group === "dungeon") condSheetOpen = false;
      markTutorialSubVisit(group, id);
      render();
    });
  });
  app.querySelectorAll("[data-ranch-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.ranchSort;
      if (!["power", "gen", "rarity", "element", "status"].includes(id)) return;
      if (ranchSort === id) return;
      ranchSort = id;
      saveUiPrefs();
      render();
    });
  });
  app.querySelectorAll("[data-dungeon-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || dungeonIdx <= 0) return;
      dungeonIdx -= 1;
      condSheetOpen = false;
      render();
    });
  });
  app.querySelectorAll("[data-dungeon-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      dungeonIdx += 1;
      condSheetOpen = false;
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
        tab = "party";
        panelSub = { ...panelSub, party: "breed" };
        petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
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
      } else if (act === "dismiss-hub") {
        dismissDailyHub(state);
        dailyHubDismissedSession = true;
        saveState(state);
        render();
      } else if (act === "claim-streak") {
        const r = claimLoginStreak(state);
        saveState(state);
        render();
        setFlash(r.msg, r.ok ? "celebrate" : "");
      } else if (act === "goto-daily-tasks") {
        tab = "codex";
        panelSub = { ...panelSub, codex: "tasks" };
        dismissDailyHub(state);
        dailyHubDismissedSession = true;
        saveState(state);
        render();
      } else if (act === "goto-goal") {
        const gTab = btn.dataset.goalTab;
        const gSub = btn.dataset.goalSub;
        if (gTab) tab = gTab;
        if (gSub && gTab && panelSub[gTab] !== undefined) {
          panelSub = { ...panelSub, [gTab]: gSub };
        }
        render();
      } else if (act === "reset") {
        if (confirm("確定清除存檔？")) {
          stopPlayback();
          state = resetSave();
          petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
          shellReady = false;
          render();
          setFlash("存檔已重置。");
        }
      } else if (act === "claim-all-dailies") {
        const r = claimAllDailies(state);
        saveState(state);
        render();
        setFlash(r.msg, r.ok ? "celebrate" : "");
      } else if (act === "claim-daily-allclear") {
        const r = claimDailyAllClear(state);
        saveState(state);
        render();
        setFlash(r.msg, r.ok ? "celebrate" : "");
      } else if (act === "close-dispatch-modal") {
        dispatchModal = null;
        render();
      } else if (act === "confirm-dispatch") {
        if (!dispatchModal) return;
        const mission = dispatchView(state).missions.find((m) => m.id === dispatchModal.missionId);
        const need = mission?.needPets || 0;
        if ((dispatchModal.pick || []).length !== need) {
          setFlash(`請選擇 ${need} 隻靈寵。`);
          return;
        }
        const r = startDispatch(state, dispatchModal.missionId, dispatchModal.pick || []);
        dispatchModal = null;
        if (r.ok) panelSub = { ...panelSub, party: "ranch" };
        saveState(state);
        render();
        setFlash(r.msg, r.ok ? "unlock" : "");
      } else if (act === "close-attack-preview") {
        attackPreview = null;
        render();
      } else if (act === "confirm-attack") {
        if (!attackPreview) return;
        executeDungeonAttack(attackPreview.dungeonId, attackPreview.mode);
      } else if (act === "close-sweep-modal") {
        sweepResult = null;
        render();
      } else if (act === "clear-combat") {
        clearCombatPlayback();
      } else if (act === "clear-combat-setup") {
        clearCombatPlayback({ goSetup: true });
      } else if (act === "skip-combat") {
        skipPlayback();
      } else if (act === "toggle-cond-sheet") {
        condSheetOpen = !condSheetOpen;
        render();
      } else if (act === "close-cond-sheet") {
        condSheetOpen = false;
        render();
      } else if (act === "toggle-reward-details") {
        rewardDetailsOpen = !rewardDetailsOpen;
        render();
      } else if (act === "collapse-tutorial") {
        tutorialCollapsed = true;
        render();
      } else if (act === "expand-tutorial") {
        tutorialCollapsed = false;
        render();
      } else if (act === "toggle-mat-section") {
        matSectionOpen = !matSectionOpen;
        saveUiPrefs();
        render();
      } else if (act === "toggle-train-rates") {
        trainRatesOpen = !trainRatesOpen;
        saveUiPrefs();
        render();
      } else if (act === "toggle-stats-sheet") {
        statsSheetOpen = !statsSheetOpen;
        render();
      } else if (act === "close-stats-sheet") {
        statsSheetOpen = false;
        render();
      }
    });
  });
  app.querySelectorAll("[data-sheet-card]").forEach((el) => {
    el.addEventListener("click", (e) => e.stopPropagation());
  });
  app.querySelectorAll(".sheet-overlay").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target !== el) return;
      condSheetOpen = false;
      statsSheetOpen = false;
      dispatchModal = null;
      attackPreview = null;
      render();
    });
  });
  app.querySelectorAll("[data-act=toggle-combat-fast]").forEach((input) => {
    input.addEventListener("change", () => {
      combatPrefs = { ...combatPrefs, fastMode: input.checked };
      saveCombatPrefs(combatPrefs);
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
        // 開始交配＝進孕育欄（似秘境召喚），唔即出子代
        petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
        panelSub = { ...panelSub, party: "breed" };
      }
      render();
      if (r.ok) setFlash(r.msg, "unlock");
      else flashResult(r);
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
      flashResult(r);
    });
  });
  app.querySelectorAll("[data-upgrade-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = upgradePetSkill(state, btn.dataset.upgradeSkill);
      saveState(state);
      render();
      flashResult(r);
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
      // 轉地即時換通關時間／重建掛機戰場
      idleCombat = null;
      idleAnimBusy = false;
      if (idleAnimToken) {
        idleAnimToken.cancelled = true;
        idleAnimToken = null;
      }
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-set-depth]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = setTrainDepth(state, Number(btn.dataset.setDepth));
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-tier]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = claimTrainTierClear(state);
      if (r.ok) {
        idleCombat = null;
      }
      saveState(state);
      panelSub = { ...panelSub, cultivate: "train" };
      render();
      setFlash(r.msg, r.ok ? "unlock" : "");
    });
  });
  const playAbyssResult = (r) => {
    saveState(state);
    if (!r.ok) {
      setFlash(r.msg);
      render();
      return;
    }
    if (r.combatEvents?.length) {
      setFlash(r.msg || "");
      startPlayback(r);
      return;
    }
    render();
    setFlash(r.msg || "");
  };
  app.querySelectorAll("[data-abyss-start]").forEach((btn) => {
    btn.addEventListener("click", () => playAbyssResult(startAbyssDive(state)));
  });
  app.querySelectorAll("[data-abyss-advance]").forEach((btn) => {
    btn.addEventListener("click", () => playAbyssResult(advanceAbyssDive(state)));
  });
  app.querySelectorAll("[data-abyss-retreat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = retreatAbyssDive(state);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-abyss-insurance]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssInsurance(state);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-abyss-cosmetic]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssCosmetic(state, btn.dataset.abyssCosmetic);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-abyss-egg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssEgg(state);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-challenge-warden]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = challengeTrainWarden(state);
      saveState(state);
      panelSub = { ...panelSub, cultivate: "train" };
      if (r.combatEvents?.length) {
        startPlayback(r);
        return;
      }
      render();
      setFlash(r.msg, r.ok ? (r.firstClear ? "unlock" : "celebrate") : "");
    });
  });
  app.querySelectorAll("[data-open-dispatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) {
        const dv = dispatchView(state);
        if (dv.slotsUsed >= dv.slotsMax) setFlash("派遣槽位已滿。");
        return;
      }
      dispatchModal = { missionId: btn.dataset.openDispatch, pick: [] };
      render();
    });
  });
  app.querySelectorAll("[data-dispatch-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!dispatchModal) return;
      const mission = dispatchView(state).missions.find((m) => m.id === dispatchModal.missionId);
      if (!mission) return;
      const need = mission.needPets;
      const uid = btn.dataset.dispatchPick;
      const set = new Set(dispatchModal.pick || []);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= need) setFlash(`此任務只需 ${need} 隻靈寵。`);
        else set.add(uid);
      }
      dispatchModal = { ...dispatchModal, pick: [...set] };
      render();
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
      if (r.tutorialUnlock) setFlash(r.tutorialUnlock, "unlock");
      else setFlash(r.msg);
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
      const tut = advanceTutorialIfReady(state);
      saveState(state);
      render();
      if (tut.advanced && tut.unlockMsg) setFlash(tut.unlockMsg, "unlock");
      else flashResult(r);
    });
  });
  app.querySelectorAll("[data-start-hatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = startHatch(state, btn.dataset.startHatch);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-hatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = claimHatch(state, btn.dataset.claimHatch);
      saveState(state);
      render();
      if (r.tutorialUnlock) setFlash(r.tutorialUnlock, "unlock");
      else setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-goto-train]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = setTrainSite(state, btn.dataset.gotoTrain);
      tab = "cultivate";
      panelSub.cultivate = "train";
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "detail", uid: btn.dataset.petDetail, fuseBase: null, fuseMats: [], breedParents: [] };
      if (tutorialActive(state) && state.tutorial.step === "meet_pet") {
        const adv = markTutorialFlag(state, "petDetailVisited");
        if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
      }
      render();
    });
  });
  app.querySelectorAll("[data-start-fuse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!isFusionUnlocked(state)) {
        setFlash("通關秘境三【潮汐廢墟 · 心核】後解鎖融合。");
        window.alert("通關秘境三【潮汐廢墟 · 心核】後解鎖融合。融砂練功地亦同時開放。");
        return;
      }
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
          `將 ${mats.length} 隻素材融入 ${d.pet.name}？\n目標融階 ${d.nextFusionStage}｜繼承 Lv.${d.level}｜耗 ${d.fuseCostHint} 靈石${
            d.fuseMatCost && Object.keys(d.fuseMatCost).length
              ? `＋${Object.entries(d.fuseMatCost)
                  .map(([id, n]) => `${MATERIALS[id]?.name || id}×${n}`)
                  .join("、")}`
              : ""
          }`
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
      flashResult(r);
    });
  });
  
  app.querySelectorAll("[data-breed-claim]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = claimBreed(state, btn.dataset.breedClaim);
      saveState(state);
      panelSub = { ...panelSub, party: "breed" };
      render();
      let tone = "";
      if (r.ok && r.celebrate) {
        if (r.hybrid) tone = "hybrid";
        else if ((r.rarity ?? 0) >= 3) tone = "legend";
        else tone = "celebrate";
      }
      if (r.ok) setFlash(r.msg, tone);
      else flashResult(r);
    });
  });
  app.querySelectorAll("[data-pet-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
    });
  });
  app.querySelectorAll("[data-summon-slider]").forEach((input) => {
    input.addEventListener("input", () => {
      summonCount = clampDungeonSummonCount(input.value);
      render();
    });
  });
  app.querySelectorAll("[data-summon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) {
        setFlash("潮霧令不足或尚未解鎖。");
        return;
      }
      const n = clampDungeonSummonCount(btn.dataset.summonCount || summonCount);
      const r = startDungeonSummon(state, btn.dataset.summon, n);
      saveState(state);
      render();
      setFlash(r.msg, r.ok ? "unlock" : "");
    });
  });
  app.querySelectorAll("[data-attack-preview]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (playback && !playback.done) return;
      const dungeonId = btn.dataset.attackPreview;
      const block = dungeonAttackBlockReason(state, dungeonId);
      if (block) {
        setFlash(block);
        return;
      }
      attackPreview = {
        dungeonId,
        mode: btn.dataset.attackMode === "sweep" ? "sweep" : "single",
      };
      render();
    });
  });
  app.querySelectorAll("[data-dungeon-blocked]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.dungeonBlocked;
      const msg = dungeonAttackBlockReason(state, id) || "目前無法進攻此秘境。";
      setFlash(msg);
      window.alert(msg);
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
syncAppHeight();
window.visualViewport?.addEventListener("resize", syncAppHeight);
window.visualViewport?.addEventListener("scroll", syncAppHeight);
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
window.addEventListener("resize", () => {
  syncAppHeight();
  positionTutorialSpotlight(false);
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pwaInstallEvt = e;
  if (!pwaDismissed) render();
});

setInterval(() => {
  if (playback && !playback.done) return;
  const eggReadyNow = patchLive();
  const adv = advanceTutorialIfReady(state);
  const snap = tutorialLiveSnapshot(state);
  let summonFlip = false;
  if (tab === "dungeon" && panelSub.dungeon === "field") {
    const ids = dungeonsForRealm(state.realm).filter((id) => resolveDungeon(state, id));
    const id = ids[dungeonIdx];
    if (id) {
      const before = state.dungeonSummon?.[id]?.phase;
      const gate = dungeonGateView(state, id);
      summonFlip = before === "summoning" && gate.phase === "ready";
      if (gate.summoning || summonFlip) {
        // 凝聚倒數／就緒：刷新 dock
        saveState(state);
        render();
        if (summonFlip) setFlash("潮霧已凝成秘境——可以開始挑戰！", "unlock");
        return;
      }
    }
  }
  if (tab === "party" && panelSub.party === "breed" && petView.mode === "list") {
    const bs = breedStatus(state);
    const gestating = (bs.jobs || []).some((j) => !j.ready);
    if (gestating || (bs.claimable || []).length) {
      saveState(state);
      render();
      return;
    }
  }
  if (tab === "cultivate" && panelSub.cultivate === "train") {
    tickIdleCombat();
    const strip = document.querySelector("[data-live=train-idle]");
    if (strip) {
      const wrap = idleCombat;
      const s = wrap?.session;
      if (s) {
        const log = strip.querySelector(".train-idle-log");
        if (log) log.textContent = wrap.logLine || "";
        const meta = strip.querySelector("[data-live=train-idle-meta]");
        if (meta) {
          meta.textContent =
            s.phase === "pause"
              ? s.won
                ? `清完 ${s.waveCount} 波！`
                : s.ended
                  ? "全滅／逾時，重開中…"
                  : `第 ${s.round || 1} 回合 · ${s.waveLabel || ""}`
              : `第 ${s.round || 1} 回合 · ${s.waveLabel || ""}`;
        }
        const bar = strip.querySelector("[data-live=train-idle-bar]");
        if (bar) {
          const pct = Math.min(
            100,
            Math.round(
              ((s.waveIndex + (s.ended && s.won ? 1 : 0)) / Math.max(1, s.waveCount)) * 100
            )
          );
          bar.style.width = `${pct}%`;
        }
        // 攻擊動畫進行中唔重繪 roster
        if (!idleAnimBusy) {
          patchIdleRosterFromSession(wrap);
        }
        const hitEl = strip.querySelector("[data-live=train-idle-hit]");
        if (hitEl) {
          const resultLine = idleCombatResultLine(wrap);
          hitEl.textContent = resultLine;
          hitEl.hidden = !resultLine;
          hitEl.classList.toggle("is-fail", resultLine === "挑戰失敗");
          hitEl.classList.toggle("is-clear", !!resultLine && resultLine !== "挑戰失敗");
        }
        // 通關後動態補「去下一層」
        let claimRow = strip.querySelector(".train-idle-claim");
        if (wrap.clearReady && wrap.canUnlockNext && (s.tierIndex | 0) < TRAIN_TIER_COUNT - 1) {
          if (!claimRow) {
            claimRow = document.createElement("div");
            claimRow.className = "row train-idle-claim";
            claimRow.innerHTML = `<button type="button" class="primary" data-claim-tier>去下一層</button>`;
            strip.appendChild(claimRow);
            claimRow.querySelector("[data-claim-tier]")?.addEventListener("click", () => {
              const r = claimTrainTierClear(state);
              if (r.ok) idleCombat = null;
              saveState(state);
              panelSub = { ...panelSub, cultivate: "train" };
              render();
              setFlash(r.msg, r.ok ? "unlock" : "");
            });
          }
        } else if (claimRow) {
          claimRow.remove();
        }
      }
    }
  }
  if (eggReadyNow || adv.advanced || snap !== tutorialSnapCache) {
    tutorialSnapCache = snap;
    saveState(state);
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
    render();
    return;
  }
  saveState(state);
  checkPushReminders();
}, 1000);

function maybeNotifyOffline(hint) {
  if (!hint || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (maybeNotifyOffline._sent === hint.at) return;
  maybeNotifyOffline._sent = hint.at;
  try {
    new Notification("暗潮 · 離線結算", {
      body: `約 ${Math.round(hint.sec / 60)} 分鐘：靈契 +${fmtInt(hint.qi)}，飼料 +${fmtMatQty(hint.feed)}，靈塵 +${fmtMatQty(hint.dust)}${formatMatBits(hint.materials) ? `，${formatMatBits(hint.materials)}` : ""}`,
      icon: "./icons/icon.svg",
    });
  } catch {
    /* ignore */
  }
}

const pushNotifySent = new Set();

function pushNotifyOnce(key, title, body) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (pushNotifySent.has(key)) return;
  pushNotifySent.add(key);
  try {
    new Notification(title, { body, icon: "./icons/icon.svg" });
  } catch {
    /* ignore */
  }
}

function checkPushReminders() {
  const now = Date.now();
  if (state.offlineHint && state.offlineHint.sec >= 3600 * 8 - 120) {
    pushNotifyOnce(
      `offline-cap-${state.offlineHint.at}`,
      "暗潮 · 離線上限",
      "掛機收益即將達 8 小時上限，記得回來領取！"
    );
  }
  for (const e of eggsView(state, now)) {
    if (e.hatching && !e.ready && e.leftSec > 0 && e.leftSec <= 30) {
      pushNotifyOnce(`egg-soon-${e.uid}-${e.readyAt}`, "暗潮 · 蛋快好了", `${e.name} 約 ${e.leftSec} 秒後可領取`);
    }
    if (e.ready) {
      pushNotifyOnce(`egg-ready-${e.uid}`, "暗潮 · 孵化完成", `${e.name} 可以領取了！`);
    }
  }
  const disp = dispatchView(state);
  for (const d of disp.active || []) {
    if (d.ready) {
      pushNotifyOnce(`dispatch-ready-${d.dispatchId}`, "暗潮 · 派遣完成", `${d.missionName} 可以領獎了！`);
    } else if (d.leftMs > 0 && d.leftMs <= 30000) {
      pushNotifyOnce(
        `dispatch-soon-${d.dispatchId}`,
        "暗潮 · 派遣將完成",
        `${d.missionName} 約 ${Math.ceil(d.leftMs / 1000)} 秒後完成`
      );
    }
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
