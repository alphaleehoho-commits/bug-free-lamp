import {
  loadState,
  saveState,
  tickCultivation,
  tryBreakthrough,
  tryBondPending,
  dismissPending,
  releasePets,
  previewReleaseSoul,
  releaseSoulGain,
  dissolveEgg,
  suggestRanchCullUids,
  ranchCapView,
  togglePetStarred,
  togglePetLocked,
  deployPet,
  undeployPet,
  eggsView,
  startHatch,
  claimHatch,
  claimAllReadyHatches,
  hatchSlotsView,
  activeHatchCount,
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
  BREED_BATCH_MIN,
  BREED_BATCH_MAX,
  clampBreedBatchCount,
  EGG_CAP,
  BREED_COOLDOWN_MS,
  BREED_STONE_COST,
  breedPreview,
  petLineage,
  dungeonStatus,
  dungeonTeamPreview,
  resetSave,
  realmInfo,
  nextRealm,
  ranchCap,
  hatchSlotCap,
  partySynergy,
  renamePet,
  claimOfflineBank,
  offlineBankView,
  teamBondBarView,
  persistTrainIdleCombatState,
  clearTrainIdleCombatState,
  restoreTrainIdleCombatState,
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
  activePetMaxForState,
  isSpineStageBossFloor,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  NICK_MAX_LEN,
  bestiarySpeciesSummary,
  fusionStoneCost,
  breakthroughView,
  shopView,
  buyShopOffer,
  soulShopView,
  buySoulShopOffer,
  setTactics,
  tacticsView,
  setFormation,
  formationView,
  dispatchView,
  startDispatch,
  claimDispatch,
  petMatchesDispatchMission,
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
  navTrainIdleFloor,
  trainIdleFloor,
  trainFloorNavGates,
  SPINE_ZONE_ID,
  spineTrunkView,
  dungeonDisplayName,
  materialHintsView,
  itemsView,
  useBagItem,
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
  buyAbyssFusionCore,
  buyAbyssPowerNode,
  buyAbyssTideShiftCharm,
  useTideShiftCharm,
  abyssSquadCandidates,
  rearrangeAbyssSquad,
  resolveAbyssEvent,
  exportSaveJson,
  importSaveJson,
  updateNoticeView,
} from "./engine.js";
import {
  DUNGEON_SUMMON_MIN,
  DUNGEON_SUMMON_MAX,
  clampDungeonSummonCount,
  elementExplain,
  kindExplain,
  personalityExplain,
  PERSONALITY_ROLE_SHORT,
  skillTypeLabel,
  skillPowerMult,
  SECOND_SKILL_UNLOCK,
  OFFLINE_CLAIM_MIN_SEC,
  OFFLINE_HINT_SEC,
  ABYSS_RULES_TEXT,
  APP_BUILD,
  fusionMaterialRarityFactor,
  fusionPowerMultFromParts,
  roundStat,
  ceilStat,
} from "./data.js";
import { petArtFromPet, petArtHtml } from "./pet-icons.js";
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
  tutorialLockReason,
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
  tutorialNeedsHatchSub,
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

/** 戰力／天生顯示：最多 1 位小數，唔出 IEEE 回響 */
function fmtStat(n) {
  return String(ceilStat(n));
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

let softLaunchDismissed = sessionStorage.getItem("void-tide-soft-launch-dismiss") === "1";
let updateNoticeDismissed = localStorage.getItem(`void-tide-update-seen:${APP_BUILD}`) === "1";
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
let breedCount = 1;
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
/** 離線收益預覽半屏（收集確認） */
let offlineClaimOpen = false;
/** 契隊連結／突破半屏 */
let bondSheetOpen = false;
/** 孵化領取結果半屏：{ pets: object[] } | null */
let hatchClaimModal = null;
/** 孵化庫存篩選：all | breed | shop | ready */
let hatchEggFilter = "all";
/** 背包內頁：材料 | 道具 */
let bagInner = "mats";
/** 商肆內頁：stones | soul | grit */
let shopInner = "stones";
/** @type {"power" | "gen" | "rarity" | "element" | "status" | "star" | "level"} */
let ranchSort = "status";
/** 牧場只顯示星標 */
let ranchStarOnly = false;
/**
 * 批量放生：null | { phase: "select", selected: string[] } | { phase: "confirm", selected: string[] }
 * @type {null | { phase: "select" | "confirm", selected: string[] }}
 */
let ranchRelease = null;

/** 打開牧場清弱寵（預選建議 cull） */
function openRanchCullSelect(needSlots = 1) {
  const suggested = suggestRanchCullUids(state, Math.max(1, needSlots));
  ranchRelease = { phase: "select", selected: [...suggested] };
  releaseModal = null;
  hatchClaimModal = null;
  tab = "party";
  panelSub = { ...panelSub, party: "ranch" };
  petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [], detailTab: "stats" };
  render();
  if (suggested.length) {
    setFlash(`已預選 ${suggested.length} 隻弱寵，確認後放生騰位。`);
  } else {
    setFlash("冇可清嘅弱寵（星標／上鎖／忙碌除外）。");
  }
}

/**
 * 放生確認半屏（單隻／批量）
 * @type {null | { uids: string[], fromDetail?: boolean }}
 */
let releaseModal = null;
/** 融合確認半屏（取代 browser confirm） */
let fuseConfirmModal = null;
/**
 * 潮轉符選寵半屏
 * @type {null | { source: "bag" | "abyss" }}
 */
let tideShiftModal = null;
/**
 * 潮淵開潛編隊揀寵；null＝未喺編隊流程
 * @type {null | string[]}
 */
let abyssSquadPick = null;
/**
 * 潮淵層間整理出戰；null＝未喺整理流程
 * @type {null | string[]}
 */
let abyssRearrangePick = null;
/** 今次 session 已關過每日儀表板 */
let dailyHubDismissedSession = false;

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
    JSON.stringify({ matSectionOpen, trainRatesOpen, ranchSort, ranchStarOnly, bagInner, shopInner })
  );
}

const uiPrefsBoot = loadUiPrefs();
matSectionOpen = !!uiPrefsBoot.matSectionOpen;
trainRatesOpen = !!uiPrefsBoot.trainRatesOpen;
if (uiPrefsBoot.bagInner === "items" || uiPrefsBoot.bagInner === "mats") {
  bagInner = uiPrefsBoot.bagInner;
}
if (uiPrefsBoot.shopInner === "stones" || uiPrefsBoot.shopInner === "soul" || uiPrefsBoot.shopInner === "grit") {
  shopInner = uiPrefsBoot.shopInner;
}
if (["power", "gen", "rarity", "element", "status", "star", "level"].includes(uiPrefsBoot.ranchSort)) {
  ranchSort = uiPrefsBoot.ranchSort;
}
ranchStarOnly = !!uiPrefsBoot.ranchStarOnly;

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

function isAbyssCombat(result) {
  return result?.combatKind === "abyss";
}

function isFarmCombat(result) {
  if (result?.combatKind === "train") return false;
  if (isAbyssCombat(result)) return false;
  if (!result?.won) return false;
  const fc = result.rewardBreakdown?.firstClear;
  return !(fc && (fc.stones || fc.scrap));
}

function combatSpeedMult(result) {
  if (tutorialActive(state)) return 1;
  if (isAbyssCombat(result)) return 1;
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
  if (ev.target.closest?.(".tutorial-skip, [data-live=tutorial] [data-act=skip-tutorial]")) return;
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

function handleTutorialBannerAct(act) {
  if (act === "skip-tutorial") {
    const r = skipTutorial(state);
    saveState(state);
    render();
    setFlash(r.msg, "unlock");
    return true;
  }
  if (act === "collapse-tutorial") {
    tutorialCollapsed = true;
    render();
    return true;
  }
  if (act === "expand-tutorial") {
    tutorialCollapsed = false;
    render();
    return true;
  }
  return false;
}

/** live patch 會換掉 banner DOM，用委派避免「跳過」掣失聯 */
function onTutorialBannerClick(ev) {
  const btn = ev.target.closest?.("[data-live=tutorial] [data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === "skip-tutorial" || act === "collapse-tutorial" || act === "expand-tutorial") {
    ev.preventDefault();
    handleTutorialBannerAct(act);
  }
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
let petView = {
  mode: "list",
  uid: null,
  fuseBase: null,
  fuseMats: [],
  breedParents: [],
  detailTab: "stats",
};

function tutorialNavCtx() {
  return {
    tab,
    panelSub,
    petDetail: petView.mode === "detail",
    petFuse: petView.mode === "fuse",
  };
}

function initTutorialNav() {
  if (!tutorialActive(state)) return;
  const step = state.tutorial.step;
  if ((step === "hatch_starter" || step === "hatch_second") && tutorialEggReady(state)) {
    tab = "party";
    panelSub = { ...panelSub, party: "hatch" };
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

/** 陣型企位：依 formation 填 lane；列數跟出戰上限／敵方數量 */
function formationSideHtml(units, side, renderUnit, formationId = "balanced") {
  const list = units || [];
  const allySlots = activePetMaxForState(state);
  const foeSlots = Math.max(list.length, Math.min(FORMATION_SLOT_COUNT, Math.max(allySlots, 2)));
  const placement =
    side === "foe"
      ? formationFoePlacement(list.length, foeSlots)
      : formationAllyPlacement(formationId, list.length, allySlots);
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
    <p class="meta">只讀參考；實際機率＝表列×雙親代數加成（預覽頁會顯示合計％同主／次拆分）。三代種見下方求道／繁殖預覽。</p>
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

/** DOM 上是否有戰報／結算全屏遮罩 */
function combatModalInDom() {
  return !!document.querySelector("[data-live=combat-modal]");
}

/** 目前會擋 pointer 嘅全屏／半屏狀態（唔計教學 spotlight） */
function fullscreenOverlayBlockReason() {
  if (playback && !playback.done) {
    return combatModalInDom() ? "戰鬥中" : "戰鬥卡住";
  }
  if (playback?.done) {
    return combatModalInDom() ? "戰報未關閉" : "戰報卡住";
  }
  if (tideShiftModal) return "潮轉符視窗";
  if (dispatchModal) return "派遣視窗";
  if (attackPreview) return "進攻預覽";
  if (sweepResult) return "掃蕩結算";
  if (offlineClaimOpen) return "離線收益";
  if (hatchClaimModal) return "孵化領取";
  if (releaseModal) return "放生確認";
  if (condSheetOpen) return "敵情條件";
  if (bondSheetOpen) return "契隊連結";
  if (statsSheetOpen) return "資源詳情";
  if (!tutorialActive(state) && !dailyHubDismissedSession) {
    try {
      if (dailyHubView(state)?.shouldShow) return "每日儀表板";
    } catch {
      /* ignore */
    }
  }
  return "";
}

/** 清晒會擋 UI 嘅 sheet／modal（可選清 playback） */
function clearUiOverlays(opts = {}) {
  const clearPlayback = !!opts.clearPlayback;
  const includeDonePlayback = opts.includeDonePlayback !== false;
  tideShiftModal = null;
  dispatchModal = null;
  attackPreview = null;
  sweepResult = null;
  offlineClaimOpen = false;
  bondSheetOpen = false;
  hatchClaimModal = null;
  releaseModal = null;
  condSheetOpen = false;
  statsSheetOpen = false;
  rewardDetailsOpen = false;
  if (!tutorialActive(state)) {
    try {
      if (dailyHubView(state)?.shouldShow) {
        dismissDailyHub(state);
        dailyHubDismissedSession = true;
      }
    } catch {
      /* ignore */
    }
  }
  if (clearPlayback && playback) {
    if (!playback.done || includeDonePlayback) stopPlayback();
  }
}

/** playback 有狀態但戰報 DOM 唔見 → 視為卡住，清走並 flash */
function recoverStuckPlayback(flashMsg = "已解除卡住戰報") {
  if (!playback) return false;
  if (combatModalInDom()) return false;
  stopPlayback();
  rewardDetailsOpen = false;
  setFlash(flashMsg);
  return true;
}

/** Escape／返回／點底欄時：有遮罩則清；卡住 playback 亦清 */
function dismissBlockingUi(opts = {}) {
  const fromUser = opts.fromUser !== false;
  const reason = fullscreenOverlayBlockReason();
  if (!reason) return false;
  const stuck = reason.includes("卡住") || (playback && !combatModalInDom());
  if (stuck || opts.force) {
    clearUiOverlays({ clearPlayback: true, includeDonePlayback: true });
    if (fromUser) setFlash(stuck ? "已解除卡住介面" : "已關閉視窗");
    render();
    return true;
  }
  if (fromUser) setFlash(reason);
  return false;
}

function switchTab(id) {
  if (playback && !playback.done) {
    if (recoverStuckPlayback("已解除卡住戰鬥")) {
      render();
    } else {
      setFlash("戰鬥中");
      return;
    }
  } else if (playback?.done && !combatModalInDom()) {
    recoverStuckPlayback();
  }
  const overlayReason = fullscreenOverlayBlockReason();
  if (overlayReason && overlayReason !== "戰報未關閉") {
    // 戰報未關閉時允許喺秘境內操作；其他全屏遮罩擋底欄並 flash 原因
    if (overlayReason.includes("卡住")) {
      dismissBlockingUi({ force: true });
    } else {
      setFlash(overlayReason);
      return;
    }
  }
  if (isTabLocked(state, id)) {
    setFlash(tutorialLockReason(state, "tab", id) || "教學中");
    return;
  }
  tab = id;
  condSheetOpen = false;
  statsSheetOpen = false;
  tutMisclickCount = 0;
  if (tutorialActive(state)) {
    const step = state.tutorial.step;
    if (id === "party" && tutorialNeedsHatchSub(step)) {
      panelSub = { ...panelSub, party: "hatch" };
    } else if (id === "party" && tutorialNeedsRanchSub(step)) {
      panelSub = { ...panelSub, party: "ranch" };
    } else if (id === "cultivate") {
      if (step === "shop_egg") panelSub = { ...panelSub, cultivate: "shop" };
      else if (step === "breakthrough") panelSub = { ...panelSub, cultivate: "advance" };
      else if (step === "cultivate_qi" || step === "train_pet" || step === "hatch_starter" || step === "hatch_second") {
        panelSub = { ...panelSub, cultivate: "train" };
      }
    } else if (id === "dungeon") {
      if (step === "dungeon_fight" || step === "dungeon_win") {
        // 潮淵停留唔被教學強制踢去秘境 field
        if (panelSub.dungeon !== "abyss") panelSub = { ...panelSub, dungeon: "field" };
      } else if (step === "tactics") {
        // Pack B mirror：潮淵 sub 唔好被 switchTab 強制 setup
        if (panelSub.dungeon !== "abyss") panelSub = { ...panelSub, dungeon: "setup" };
      }
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

function panelSubLockKind(group) {
  if (group === "cultivate") return "cultivateSub";
  if (group === "party") return "partySub";
  if (group === "dungeon") return "dungeonSub";
  return "";
}

function panelSubIsLocked(group, id) {
  if (group === "cultivate") return isCultivateSubLocked(state, id);
  if (group === "party") return isPartySubLocked(state, id);
  if (group === "dungeon") return isDungeonSubLocked(state, id);
  return false;
}

/** 子分頁切換阻擋原因；空＝可切 */
function panelSubSwitchBlockReason(group, id) {
  if (playback && !playback.done) {
    if (!combatModalInDom()) return "戰鬥卡住";
    return "戰鬥中";
  }
  if (panelSubIsLocked(group, id)) {
    return tutorialLockReason(state, panelSubLockKind(group), id) || "教學中";
  }
  return "";
}

function panelSubNav(group, items) {
  if (!items.length) return "";
  return `<nav class="panel-subnav" aria-label="子分頁">${items
    .map(({ id, label }) => {
      const locked = panelSubIsLocked(group, id);
      const glow = tutGlow({ type: "panel-sub", group, id });
      const hint = locked
        ? tutorialLockReason(state, panelSubLockKind(group), id) || "教學中"
        : "";
      const title = hint ? ` title="${escapeHtml(hint)}"` : "";
      return `<button type="button" class="${panelSub[group] === id ? "on" : ""}${
        locked ? " is-locked" : ""
      }${glow}" data-panel-sub="${group}:${id}" data-sub-locked="${locked ? "1" : "0"}"${title}>${label}</button>`;
    })
    .join("")}</nav>`;
}

function wrapStage(subnavHtml, scrollHtml, dockHtml = "") {
  // 子分頁放返內容下方（貼近底欄之上）
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
      const goto = site
        ? `<button type="button" class="linkish mat-goto" data-goto-train="${SPINE_ZONE_ID}">去主脊</button>`
        : MATERIALS[m.id]?.tier === "dungeon"
          ? `<span class="mat-goto muted">秘境</span>`
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

function bagItemsHtml() {
  const rows = itemsView(state)
    .map((it) => {
      const empty = it.count <= 0;
      const useLabel = it.needsTarget ? "揀寵使用" : "使用";
      const useBtn = it.canUse
        ? `<button type="button" class="primary" data-use-item="${escapeHtml(it.id)}">${useLabel}</button>`
        : `<button type="button" disabled>${it.atCap ? "已滿" : "使用"}</button>`;
      return `
    <li class="bag-item ${empty ? "is-empty" : ""}">
      <div class="bag-item-body">
        <strong>${escapeHtml(it.name)}</strong>
        <span class="muted">${escapeHtml(it.desc)}</span>
        <span class="meta">持有 ${it.count}${it.bonusNote ? ` · ${escapeHtml(it.bonusNote)}` : ""}</span>
      </div>
      <div class="row-actions">${useBtn}</div>
    </li>`;
    })
    .join("");
  return `<ul class="list bag-item-list">${rows || `<li class="empty">暫無道具。</li>`}</ul>`;
}

function tideShiftModalHtml() {
  if (!tideShiftModal) return "";
  const have = Math.floor(state.items?.tide_shift_charm || 0);
  const party = (state.pets || []).map((p) => ({ pet: p, where: "出戰" }));
  const ranch = (state.ranch || []).map((p) => ({ pet: p, where: "牧場" }));
  const rows =
    [...party, ...ranch]
      .map(({ pet: p, where }) => {
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(displayPetName(p))}</strong>
            <span class="muted">${escapeHtml(where)} · ${escapeHtml(p.elementName || "")}屬 · Lv.${p.level | 0}</span>
          </div>
          <button type="button" class="primary" data-tide-shift-pet="${escapeHtml(p.uid)}" ${have < 1 ? "disabled" : ""}>轉屬</button>
        </li>`;
      })
      .join("") || `<li class="empty">冇可用靈寵。</li>`;
  return `
    <div class="sheet-overlay" role="presentation" data-live="tide-shift-modal">
      <div class="sheet-card" role="dialog" aria-label="潮轉符選寵" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>潮轉符 · 揀寵轉屬</h3>
        <p class="meta">永久隨機轉換元素（唔會轉成同一屬）· 持有 ${have}</p>
        <ul class="list">${rows}</ul>
        <div class="row">
          <button type="button" class="secondary" data-act="close-tide-shift-modal">取消</button>
        </div>
      </div>
    </div>`;
}

function bagInnerNavHtml() {
  return `<nav class="bag-inner-nav" aria-label="背包分類">
    <button type="button" class="${bagInner === "mats" ? "on" : ""}" data-bag-inner="mats">材料</button>
    <button type="button" class="${bagInner === "items" ? "on" : ""}" data-bag-inner="items">道具</button>
  </nav>`;
}

function shopInnerNavHtml() {
  return `<nav class="bag-inner-nav" aria-label="商肆分類">
    <button type="button" class="${shopInner === "stones" ? "on" : ""}" data-shop-inner="stones">靈石</button>
    <button type="button" class="${shopInner === "soul" ? "on" : ""}" data-shop-inner="soul">精魂</button>
    <button type="button" class="${shopInner === "grit" ? "on" : ""}" data-shop-inner="grit">淵砂</button>
  </nav>`;
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

function trainRatesBlockHtml(rateLines, summary = "") {
  if (!rateLines && !summary) return "";
  const list = rateLines ? `<ul class="train-rate-list">${rateLines}</ul>` : "";
  return `<div class="fold-section fold-section-inline train-rates-block">
      <button type="button" class="section-toggle" data-act="toggle-train-rates">
        <span>產出速率</span>
        <span class="muted">${trainRatesOpen ? "收起" : "點開明細"}</span>
      </button>
      ${summary ? `<p class="train-rate-summary">${summary}</p>` : ""}
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
    const slot = el.closest(".hatch-slot");
    if (left <= 0) {
      becameReady = true;
      if (slot) {
        slot.classList.add("is-ready");
        slot.classList.remove("is-hatching");
        const actions = slot.querySelector(".hatch-slot-actions");
        if (actions && !actions.querySelector("[data-claim-hatch]")) {
          actions.innerHTML = `<button type="button" class="primary${tutGlow({ type: "claim-hatch" })}" data-claim-hatch="${escapeHtml(uid)}">領取</button>`;
        }
        const meta = slot.querySelector("[data-hatch-slot-meta]");
        if (meta) meta.textContent = "已就緒";
      } else {
        const row = el.closest(".egg-row");
        const actions = row?.querySelector(".row-actions");
        if (actions && !actions.querySelector("[data-claim-hatch]")) {
          actions.innerHTML = `<button type="button" class="primary${tutGlow({ type: "claim-hatch" })}" data-claim-hatch="${escapeHtml(uid)}">領取</button>`;
        }
      }
    } else if (slot) {
      el.textContent = `${sec}s`;
      const meta = slot.querySelector("[data-hatch-slot-meta]");
      if (meta) meta.textContent = `孵化中 ${sec}s`;
    } else {
      el.textContent = `孵化中 ${sec}s`;
    }
  });
  const claimAllBtn = document.querySelector("[data-claim-all-hatch]");
  if (claimAllBtn) {
    const readyN = hatchSlotsView(state, now).readyCount;
    claimAllBtn.disabled = readyN <= 0;
    const label = claimAllBtn.querySelector("[data-claim-all-label]");
    if (label) label.textContent = readyN > 0 ? `一鍵收取（${readyN}）` : "一鍵收取";
  }
  return becameReady;
}

/** 繁殖頁倒數／中途領蛋：只 patch DOM，避免整頁重繪導致待命列表 scroll 跳頂 */
function patchBreedLive() {
  if (!(tab === "party" && panelSub.party === "breed" && petView.mode === "list")) {
    return { needRender: false, flipped: false };
  }
  const bs = breedStatus(state);
  let flipped = false;
  const rows = document.querySelectorAll("[data-breed-job]");
  if (!rows.length && (bs.jobs || []).length) {
    return { needRender: true, flipped: false };
  }
  rows.forEach((row) => {
    const id = row.dataset.breedJob;
    const job = (bs.jobs || []).find((j) => j.id === id);
    if (!job) {
      flipped = true;
      return;
    }
    const bar = row.querySelector("[data-breed-job-bar]");
    const meta = row.querySelector("[data-breed-job-meta]");
    const actions = row.querySelector("[data-breed-job-actions]");
    const sec = Math.ceil((job.leftMs || 0) / 1000);
    const claimN = job.claimableCount || 0;
    const batchN = job.batch || 1;
    const wasReady = row.classList.contains("is-ready");
    const nowReady = claimN > 0 && !job.mating;
    if (bar) bar.style.width = `${job.pct || 0}%`;
    if (meta) {
      if (nowReady) {
        meta.textContent = `孕育完成 · 可領蛋×${claimN}${batchN > 1 ? `／${batchN}` : ""}`;
      } else if (claimN > 0) {
        meta.innerHTML = `交配中 · 剩餘 <strong data-breed-job-sec>${sec}</strong>s · 已可領×${claimN}`;
      } else {
        meta.innerHTML = `孕育中 · 剩餘 <strong data-breed-job-sec>${sec}</strong>s${
          batchN > 1 ? ` · ×${batchN}` : ""
        }`;
      }
    }
    const wantBtn = claimN > 0;
    const hasBtn = !!actions?.querySelector("[data-breed-claim]");
    if (wantBtn && !hasBtn && actions) {
      actions.innerHTML = `<button type="button" class="primary success" data-breed-claim="${escapeHtml(id)}">領取蛋×${claimN}</button>`;
      actions.querySelector("[data-breed-claim]")?.addEventListener("click", () => {
        const r = claimBreed(state, id);
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
      flipped = true;
    } else if (wantBtn && hasBtn) {
      const btn = actions.querySelector("[data-breed-claim]");
      const label = `領取蛋×${claimN}`;
      if (btn && btn.textContent !== label) btn.textContent = label;
    }
    if (nowReady !== wasReady) {
      row.classList.toggle("is-ready", nowReady);
      flipped = true;
    }
  });
  const domCount = rows.length;
  const jobCount = (bs.jobs || []).length;
  if (domCount !== jobCount) return { needRender: true, flipped: true };
  return { needRender: false, flipped };
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

  if (qiText) {
    qiText.textContent = next
      ? `靈契 ${Math.floor(state.qi)} / ${next.need}`
      : `靈契 ${Math.floor(state.qi)} · 已滿`;
  }
  if (qiBar) qiBar.style.width = `${qiPct}%`;
  if (stones) stones.textContent = String(Math.floor(state.stones));
  if (scrap) scrap.textContent = String(state.scrap);
  if (feed) feed.textContent = String(Math.floor(state.feed || 0));
  if (dust) dust.textContent = String(Math.floor(state.dust || 0));
  if (stageEl) stageEl.textContent = stage.name;

  const offSlot = document.querySelector("[data-live=offline-home]");
  const offLabel = document.querySelector("[data-live=offline-home-label]");
  const bank = offlineBankView(state);
  const sec = bank.sec || 0;
  if (offLabel && sec > 0) {
    const capped = bank.capped ? " · 上限" : "";
    offLabel.textContent = `離線 · ${fmtOfflineDuration(sec)}${capped}`;
  }
  if (offSlot) {
    offSlot.classList.toggle("is-claimable", !!bank.canClaim);
    const offBtn = offSlot.querySelector("[data-act=open-offline-claim]");
    if (offBtn) offBtn.textContent = bank.canClaim ? "收集" : "詳情";
  }

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
  const wasAbyss = isAbyssCombat(playback?.result);
  stopPlayback();
  rewardDetailsOpen = false;
  if (goSetup) {
    panelSub = { ...panelSub, dungeon: "setup" };
    markTutorialSubVisit("dungeon", "setup");
  } else if (wasAbyss) {
    panelSub = { ...panelSub, dungeon: "abyss" };
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
  } else if (resultMsg && !isAbyssCombat(result)) {
    setFlash(resultMsg);
  }
}

function startPlayback(result) {
  stopPlayback();
  if (result?.combatKind !== "train") tab = "dungeon";
  if (isAbyssCombat(result)) {
    panelSub = { ...panelSub, dungeon: "abyss" };
  }
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
  // 融合引導：到達融合頁即完成 fuse_intro
  if (
    tutorialActive(state) &&
    state.tutorial.step === "fuse_intro" &&
    petView.mode === "fuse" &&
    !state.tutorial.flags?.fusePageVisited
  ) {
    const adv = markTutorialFlag(state, "fusePageVisited");
    if (adv.advanced && adv.unlockMsg) {
      setFlash(adv.unlockMsg, "unlock");
    }
  }

  const stage = realmInfo(state);
  const enterClass = shellReady ? "is-settled" : "is-enter";
  const busy = playback && !playback.done;
  const inTutorial = tutorialActive(state);

  app.className = `${enterClass}${inTutorial ? " is-tutorial" : ""}`;
  app.innerHTML = `
    <header class="top top-compact">
      <div class="brand-row">
        <p class="brand" data-brand="void-tide">暗潮</p>
        <p class="tag">Void Tide · 靈寵修行</p>
      </div>
    </header>

    ${inTutorial ? tutorialStatsStrip() : statsStripHtml(stage)}

    ${nextGoalChipHtml()}
    ${tab === "cultivate" ? offlineHomeSlotHtml() : ""}

    ${inTutorial ? tutorialBannerHtml(state, { collapsed: tutorialCollapsed }) : ""}

    <main class="panel">
      <div class="panel-body">
      ${tab === "cultivate" ? cultivatePanel() : ""}
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
    ${bondSheetOpen ? bondSheetHtml() : ""}
    ${offlineClaimOpen ? offlineClaimModalHtml() : ""}
    ${hatchClaimModal ? hatchClaimModalHtml() : ""}
    ${releaseModal ? releaseModalHtml() : ""}
    ${fuseConfirmModal ? fuseConfirmModalHtml() : ""}
    ${tideShiftModal ? tideShiftModalHtml() : ""}
    ${dailyHubHtml()}
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
    // 有 playback 狀態但全屏戰報唔見 → 唔好留住隱形擋掣
    if (!combatModalInDom()) {
      stopPlayback();
      rewardDetailsOpen = false;
    } else {
      updatePlaybackDom();
      requestAnimationFrame(() => {
        const scroller = document.querySelector("[data-live=combat-scroll]");
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
      });
    }
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
          <li><span>精魂</span><strong>${Math.floor(state.materials?.soul_essence || 0)}</strong></li>
          <li><span>勝場</span><strong>${state.combatsWon}</strong></li>
          <li><span>牧場</span><strong>${ranchN}／${ranchCap(state)}</strong></li>
          <li><span>出戰</span><strong>${state.pets.length}／${activePetMaxForState(state)}</strong></li>
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
    ? `<p class="hub-offline">待領離線 ${Math.round(hub.offline.sec / 60)} 分 · 靈契 +${fmtInt(hub.offline.qi)} · 飼料 +${fmtMatQty(hub.offline.feed)}${hub.offline.materials ? ` · ${escapeHtml(formatMatBits(hub.offline.materials))}` : ""}${hub.offline.dust ? ` · 靈塵 +${fmtMatQty(hub.offline.dust)}` : ""}${hub.offline.capped ? " · 已達上限" : ""}</p>`
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


function fmtOfflineDuration(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  if (s < 60) return `${s}秒`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return r ? `${m}分${r}秒` : `${m}分`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}時${rm}分` : `${h}時`;
}

function bondSheetHtml() {
  if (!bondSheetOpen) return "";
  const bar = teamBondBarView(state);
  const br = bar.br || breakthroughView(state);
  const rows = (br.items || [])
    .map(
      (it) => `
      <li class="cond-item ${it.ok ? "is-met" : "is-miss"}">
        <span class="cond-badge">${it.ok ? "達成" : "未達"}</span>
        <div class="cond-body">
          <strong>${escapeHtml(it.label)}</strong>
          <span class="muted">${escapeHtml(it.progress || "")}</span>
        </div>
      </li>`
    )
    .join("");
  return `
    <div class="sheet-overlay" role="presentation" data-act="close-bond-sheet">
      <div class="sheet-card bond-sheet-card" role="dialog" aria-label="契隊連結" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>契隊連結</h3>
        <p class="lead">出戰 ${bar.petCount}/${bar.petMax} · 戰力 ${bar.power} · 星標 ${bar.starred} · 均Lv ${bar.avgLv}</p>
        <div class="bar team-bond-track"><i style="width:${bar.pct}%"></i></div>
        <p class="meta">${escapeHtml(bar.stageName || "")} →【${escapeHtml(bar.nextName || "")}】· ${bar.pct}%</p>
        <h4>下一階突破</h4>
        <ul class="cond-list">${rows || '<li class="empty">已無下一階。</li>'}</ul>
        <div class="row">
          <button type="button" class="primary" data-act="goto-breakthrough">前往突破</button>
          <button type="button" class="ghost sheet-close" data-act="close-bond-sheet">關閉</button>
        </div>
      </div>
    </div>`;
}

function offlinePendingView() {
  const bank = offlineBankView(state);
  if (bank.hasPending) return bank;
  const h = state.offlineHint;
  if (!h) return null;
  if (
    !(h.qi | 0) &&
    !(h.feed | 0) &&
    !(h.dust | 0) &&
    !formatMatBits(h.materials) &&
    !(h.sec | 0)
  ) {
    return null;
  }
  return h;
}

/** 修行主頁：有離線累積先顯示；點開睇總結，滿 30 分先可領 */
function offlineHomeSlotHtml() {
  const bank = offlineBankView(state);
  const sec = bank.sec || 0;
  if (sec <= 0) return "";
  const capped = bank.capped ? " · 上限" : "";
  const canClaim = !!bank.canClaim;
  const label = `離線 · ${fmtOfflineDuration(sec)}${capped}`;
  return `
    <div class="offline-home-slot${canClaim ? " is-claimable" : ""}" data-live="offline-home">
      <p class="offline-home-label" data-live="offline-home-label">${escapeHtml(label)}</p>
      <button type="button" class="primary" data-act="open-offline-claim">${canClaim ? "收集" : "詳情"}</button>
    </div>`;
}

function offlineGainRowsHtml(pending) {
  const rows = [];
  if ((pending.qi | 0) > 0) {
    rows.push(`<li class="card-row offline-gain-row"><div><strong>靈契</strong></div><span>+${fmtInt(pending.qi)}</span></li>`);
  }
  if ((pending.feed | 0) > 0) {
    rows.push(`<li class="card-row offline-gain-row"><div><strong>飼料</strong></div><span>+${fmtMatQty(pending.feed)}</span></li>`);
  }
  if ((pending.dust | 0) > 0) {
    rows.push(`<li class="card-row offline-gain-row"><div><strong>靈塵</strong></div><span>+${fmtMatQty(pending.dust)}</span></li>`);
  }
  for (const [id, n] of Object.entries(pending.materials || {})) {
    if ((n | 0) <= 0) continue;
    const name = MATERIALS[id]?.name || id;
    rows.push(
      `<li class="card-row offline-gain-row"><div><strong>${escapeHtml(name)}</strong></div><span>+${fmtMatQty(n)}</span></li>`
    );
  }
  if (!rows.length) {
    return `<li class="empty">暫無明細收益。</li>`;
  }
  return rows.join("");
}

function offlineClaimModalHtml() {
  const bank = offlineBankView(state);
  const sec = bank.sec || 0;
  const site = bank.siteName ? ` · ${escapeHtml(bank.siteName)}` : "";
  const canClaim = !!bank.canClaim;
  const left = bank.claimLeftSec || Math.max(0, OFFLINE_CLAIM_MIN_SEC - sec);
  const capNote = bank.capped
    ? `<p class="meta muted">已達累積上限，請先收集。</p>`
    : "";
  const gateNote = canClaim
    ? `<p class="meta">滿 30 分 · 可領取</p>`
    : `<p class="meta muted">滿 30 分可領 · 仲差 ${fmtOfflineDuration(left)}</p>`;
  return `
    <div class="combat-modal-overlay offline-claim-overlay" data-live="offline-claim" role="dialog" aria-label="離線收益">
      <div class="combat-modal-card offline-claim-card">
        <div class="combat-modal-scroll">
          <h2>離線收益</h2>
          <p class="lead">離線 ${fmtOfflineDuration(sec)}${site}</p>
          ${gateNote}
          ${capNote}
          <h3>待領物資</h3>
          <ul class="list offline-gain-list">${offlineGainRowsHtml(bank)}</ul>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="primary" data-act="claim-offline" ${canClaim ? "" : "disabled"}>收集</button>
          <button type="button" class="ghost" data-act="close-offline-claim">返回</button>
        </div>
      </div>
    </div>`;
}

function releaseModalHtml() {
  if (!releaseModal?.uids?.length) return "";
  const prev = previewReleaseSoul(state, releaseModal.uids);
  if (!prev.ok) {
    return `
    <div class="combat-modal-overlay release-modal-overlay" data-live="release-modal" role="dialog" aria-label="放生確認">
      <div class="combat-modal-card release-modal-card">
        <div class="combat-modal-scroll">
          <h2>無法放生</h2>
          <p class="lead">${escapeHtml(prev.msg || "請返回重試。")}</p>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="primary" data-act="close-release-modal">返回</button>
        </div>
      </div>
    </div>`;
  }
  const multi = prev.pets.length > 1;
  const rows = prev.pets
    .map(
      (row) =>
        `<li class="card-row release-pet-row"><div><strong>${escapeHtml(row.name)}</strong><span class="muted">精魂 +${row.soul}</span></div></li>`
    )
    .join("");
  return `
    <div class="combat-modal-overlay release-modal-overlay" data-live="release-modal" role="dialog" aria-label="放生確認">
      <div class="combat-modal-card release-modal-card">
        <div class="combat-modal-scroll">
          <h2>${multi ? "確認批量放生" : "確認放生"}</h2>
          <p class="lead">${multi ? `共 ${prev.pets.length} 隻` : escapeHtml(prev.pets[0]?.name || "")} · 精魂 +${prev.soul}</p>
          <p class="meta muted">放生只獲<strong>精魂</strong>，唔再退靈石／飼料／靈塵。此操作不可復原。</p>
          <ul class="list">${rows}</ul>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="ghost" data-act="close-release-modal">返回</button>
          <button type="button" class="primary" data-act="confirm-release">確認放生</button>
        </div>
      </div>
    </div>`;
}

function fuseConfirmModalHtml() {
  if (!fuseConfirmModal) return "";
  const d = petDetail(state, fuseConfirmModal.baseUid);
  if (!d || d.fuseMaxed) {
    return `
    <div class="combat-modal-overlay release-modal-overlay" data-live="fuse-confirm-modal" role="dialog" aria-label="融合確認">
      <div class="combat-modal-card release-modal-card">
        <div class="combat-modal-scroll">
          <h2>無法融合</h2>
          <p class="lead">請返回重試。</p>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="primary" data-act="close-fuse-confirm">返回</button>
        </div>
      </div>
    </div>`;
  }
  const mats = fuseConfirmModal.matUids || [];
  const matCost =
    d.fuseMatCost && Object.keys(d.fuseMatCost).length
      ? `＋${Object.entries(d.fuseMatCost)
          .map(([id, n]) => `${MATERIALS[id]?.name || id}×${n}`)
          .join("、")}`
      : "";
  const matPets = mats
    .map((uid) => [...(state.pets || []), ...(state.ranch || [])].find((p) => p.uid === uid))
    .filter(Boolean);
  const rarityFactor = fusionMaterialRarityFactor(
    d.pet.rarity ?? 0,
    matPets.map((p) => p.rarity ?? 0)
  );
  const nextMult = Number(fusionPowerMultFromParts(d.nextFusionStage, rarityFactor).toFixed(2));
  const rarityHint =
    rarityFactor < 1
      ? ` · 素材稀有偏低（獎勵×${rarityFactor}，出戰唔低過 ×1）`
      : " · 素材稀有達標";
  return `
    <div class="combat-modal-overlay release-modal-overlay" data-live="fuse-confirm-modal" role="dialog" aria-label="融合確認">
      <div class="combat-modal-card release-modal-card">
        <div class="combat-modal-scroll">
          <h2>確認融合（終身一次）</h2>
          <p class="lead">將 ${mats.length} 隻素材融入 <strong>${escapeHtml(d.pet.name)}</strong></p>
          <p class="meta warn">每隻寵物只有一次融合機會；素材能力愈高，融合結果愈好；請謹慎選擇。</p>
          <p class="meta">需主體＋素材皆 ≥ Lv.${d.fuseNeedLevel || 50} · 出戰預計×${nextMult}${rarityHint}</p>
          <p class="meta">耗 ${escapeHtml(String(d.fuseCostHint))} 靈石${escapeHtml(matCost)}</p>
          <p class="meta muted">素材與融合核會被消耗，此操作不可復原。</p>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="ghost" data-act="close-fuse-confirm">取消</button>
          <button type="button" class="primary" data-act="confirm-fuse">確認融合</button>
        </div>
      </div>
    </div>`;
}


function tabBtn(id, label, busy) {
  if (isTabLocked(state, id)) return "";
  const glow = tutGlow({ type: "tab", id });
  const disabled = busy && id !== "dungeon" ? "disabled" : "";
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}${glow}" data-tab="${id}" ${disabled}>${label}</button>`;
}

/** Live idle combat — real 5-wave session stepped each second (also in background) */
let idleCombat = null;
let idleAnimBusy = false;
let idleAnimToken = null;
let lastIdleStepAt = Date.now();
let idleCombatBootstrapped = false;

function idlePetSig(st) {
  return (st.pets || []).map((p) => `${p.uid}:${p.atk}:${p.hp}:${p.spd}`).join("|");
}

function cancelIdleAnim() {
  if (idleAnimToken) {
    idleAnimToken.cancelled = true;
    for (const t of idleAnimToken.timers || []) clearTimeout(t);
    idleAnimToken = null;
  }
  idleAnimBusy = false;
}

function ensureIdleCombat() {
  const view = trainIdleCombatView(state);
  if (!view.petCount) {
    idleCombat = null;
    clearTrainIdleCombatState(state);
    return null;
  }
  const sig = idlePetSig(state);
  const formationId = currentFormationId();

  // 首次：由存檔還原 session（保留 startedAt 牆鐘）
  if (!idleCombatBootstrapped) {
    idleCombatBootstrapped = true;
    const saved = restoreTrainIdleCombatState(state);
    if (
      saved?.session &&
      saved.zoneId === view.zoneId &&
      saved.tierIndex === view.tierIndex &&
      saved.petSig === sig &&
      saved.formationId === formationId
    ) {
      idleCombat = { ...saved, fx: emptyIdleFx() };
      idleCombat.logLine = view.logLine;
      idleCombat.clearReady = !!view.clearReady || !!idleCombat.clearReady;
      idleCombat.session.clearReady = idleCombat.clearReady;
      return idleCombat;
    }
  }

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
      clearTrainIdleCombatState(state);
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
  persistTrainIdleCombatState(state, idleCombat);
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
        speedMult: 0.42,
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
        speedMult: 0.42,
        token,
      });
    }
  }
  if (idleAnimToken === token) idleAnimToken = null;
}

function tickIdleCombat({ background = false } = {}) {
  // 離開練功頁／背景分頁：取消動畫鎖，繼續推進五波
  if (background || (typeof document !== "undefined" && document.hidden)) {
    cancelIdleAnim();
  }
  if (idleAnimBusy) return;
  const wrap = ensureIdleCombat();
  if (!wrap?.session) return;

  const now = Date.now();
  const gapSec = Math.max(0, (now - lastIdleStepAt) / 1000);
  lastIdleStepAt = now;
  // 約 2.5 步／秒；背景用牆鐘追趕
  const IDLE_STEPS_PER_SEC = 2.5;
  let steps = 1;
  if (background || (typeof document !== "undefined" && document.hidden) || gapSec > 0.7) {
    steps = Math.min(160, Math.max(1, Math.floor((gapSec || 0.4) * IDLE_STEPS_PER_SEC)));
  } else if (gapSec >= 0.35) {
    steps = Math.min(3, Math.max(1, Math.round(gapSec * IDLE_STEPS_PER_SEC)));
  }

  let lastResult = null;
  let playEvents = null;
  let needRosterPatch = false;

  for (let i = 0; i < steps; i++) {
    if (!wrap.session) break;
    const result = stepTrainIdleSession(wrap.session);
    lastResult = result;

    if (result.status === "restart") {
      const keepReady = wrap.clearReady;
      const session = createTrainIdleSession(state);
      if (!session) {
        idleCombat = null;
        clearTrainIdleCombatState(state);
        return;
      }
      session.clearReady = keepReady;
      wrap.session = session;
      wrap.petSig = idlePetSig(state);
      wrap.resultLine = null;
      wrap.fx = emptyIdleFx();
      needRosterPatch = true;
      continue;
    }

    if (result.status === "won" || result.status === "lost") {
      if (wrap.session.resultLine) {
        wrap.resultLine = wrap.session.resultLine;
        persistTrainIdleClearResult(state, wrap.session);
      }
    }

    if (result.status === "wave" || result.status === "round") {
      needRosterPatch = true;
    }

    if (result.status === "won") {
      const marked = markTrainIdleClearReady(state, wrap.session);
      if (marked?.ok) {
        wrap.clearReady = true;
      }
    }

    // 前景且單步：播攻擊動畫；追趕／背景則跳過
    if (!background && steps === 1) {
      const combatEvents = (result.events || []).filter(
        (e) => e.type === "strike" || e.type === "heal"
      );
      if (combatEvents.length) playEvents = combatEvents;
    }
  }

  persistTrainIdleCombatState(state, idleCombat);
  saveState(state);

  if (playEvents) {
    idleAnimBusy = true;
    playIdleCombatEvents(playEvents)
      .catch(() => {})
      .finally(() => {
        idleAnimBusy = false;
        if (idleCombat?.session) patchIdleRosterFromSession(idleCombat);
      });
  } else if (!background && (needRosterPatch || lastResult)) {
    patchIdleRosterFromSession(wrap);
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
  const gates = trainFloorNavGates(state);
  const floor = gates.floor || trainIdleFloor(state);
  const floorName = dungeonDisplayName(floor);
  const trunk = spineTrunkView(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const qiLabel = next
    ? `靈契 ${Math.floor(state.qi)} / ${next.need}`
    : `靈契 ${Math.floor(state.qi)} · 已滿`;
  const stageBoss = isSpineStageBossFloor(floor) || !!wrap?.session?.stageBoss;
  const bossCls = stageBoss ? " is-stage-boss" : "";
  const bossBanner = stageBoss
    ? `<p class="train-boss-banner">階段頭目 · 通關進新階段</p>`
    : "";
  const head = `<div class="train-idle-head">
    <div class="train-idle-title">
      <strong>第${floor}關 · ${escapeHtml(floorName)}</strong>
      <span class="muted train-idle-progress">${escapeHtml(trunk.progressLabel)}</span>
    </div>
  </div>`;
  const qiChip = `<button type="button" class="train-qi-chip" data-act="toggle-stats-sheet" aria-label="靈契進度">
    <span class="train-qi-label" data-live="qi-text">${escapeHtml(qiLabel)}</span>
    <div class="bar train-qi-bar"><i data-live="qi-bar" style="width:${qiPct}%"></i></div>
  </button>`;
  const floorNav = `<div class="row train-floor-nav">
    <button type="button" class="secondary" data-train-floor-prev ${
      gates.canPrev ? "" : "disabled"
    }>上一層</button>
    <button type="button" class="secondary" data-train-floor-next ${
      gates.canNext ? "" : "disabled"
    }>下一層</button>
  </div>`;
  if (!wrap?.session) {
    return `<div class="train-idle-strip${bossCls}" data-live="train-idle">
      ${head}
      ${qiChip}
      ${floorNav}
      ${bossBanner}
      <p class="meta train-idle-log">請先出戰靈寵</p>
      <div class="row train-idle-empty-cta">
        <button type="button" class="primary" data-act="goto-party-fight">去出戰</button>
      </div>
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
  const resultLine = idleCombatResultLine(wrap);
  const resultCls = resultLine
    ? resultLine === "挑戰失敗"
      ? " is-fail"
      : " is-clear"
    : "";
  return `<div class="train-idle-strip${bossCls}" data-live="train-idle">
    ${head}
    ${qiChip}
    ${floorNav}
    ${bossBanner}
    <p class="lead combat-round-meta train-idle-meta" data-live="train-idle-meta">${escapeHtml(meta)}</p>
    <div class="bar combat-bar train-idle-bar"><i data-live="train-idle-bar" style="width:${pct}%"></i></div>
    <div class="combat-roster train-idle-roster combat-formation" data-live="train-idle-roster" data-formation="${escapeHtml(formationId)}" style="--formation-rows:${activePetMaxForState(state)}">
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
  </div>`;
}

function cultivatePanel() {
  const br = breakthroughView(state);
  const map = trainMapView(state);
  const sites = map.sites || trainSitesView(state);
  const siteCur = sites.find((s) => s.selected) || sites[0];
  const dm = siteCur?.depthMult || 1;
  const em = siteCur?.efficiency || 1;
  const rateLines = (siteCur?.rates?.lines || [])
    .slice(0, 6)
    .map((r) => {
      const adj = (Number(r.perHr) * dm * em).toFixed(r.kind === "mat" ? 1 : 0);
      return `<li class="train-rate ${r.tag ? "is-boosted" : ""}"><span>${escapeHtml(r.name)}</span><span class="muted">≈${adj}/時${
        r.tag ? ` · ${escapeHtml(r.tag)}` : ""
      }</span></li>`;
    })
    .join("");
  const topRate = (siteCur?.rates?.lines || [])[0];
  const topAdj = topRate
    ? (Number(topRate.perHr) * dm * em).toFixed(topRate.kind === "mat" ? 1 : 0)
    : "";
  const rateSummary = topRate
    ? `效率 ×${Number(em).toFixed(2)} · 主產 ${escapeHtml(topRate.name)} ≈${topAdj}/時`
    : `效率 ×${Number(em).toFixed(2)}`;

  const shopOffers = shopView(state);
  const ranchFull = (state.ranch?.length || 0) + state.pets.length >= ranchCap(state);
  const eggFull = (state.eggs?.length || 0) >= EGG_CAP;
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
  if (panelSub.cultivate === "mats") panelSub.cultivate = "bag";
  if (panelSub.cultivate === "soul") {
    panelSub.cultivate = "shop";
    shopInner = "soul";
  }
  const sub = panelSub.cultivate;
  const nav = panelSubNav("cultivate", [
    { id: "train", label: "練功" },
    { id: "bag", label: "背包" },
    { id: "shop", label: "商肆" },
    { id: "advance", label: "進階" },
  ]);

  if (sub === "bag") {
    const inner =
      bagInner === "items"
        ? `<h2>背包 · 道具</h2>
      <p class="lead">牧場 ${ranchCap(state)} 欄 · 孵化 ${hatchSlotCap(state)} 欄</p>
      ${bagItemsHtml()}`
        : `<h2>背包 · 材料</h2>
      <p class="lead">靈石 ${Math.floor(state.stones)} · 飼料 ${Math.floor(state.feed || 0)} · 靈塵 ${Math.floor(state.dust || 0)}</p>
      ${matHintListHtml()}`;
    return wrapStage(nav, `${bagInnerNavHtml()}${inner}`);
  }

  if (sub === "shop") {
    const gritV = abyssDiveView(state);
    const soulN = Math.floor(state.materials?.soul_essence || 0);
    const gritHave = Math.floor(state.materials?.abyss_grit || gritV.gritHave || 0);
    let shopBody;
    if (shopInner === "soul") {
      const soulRows =
        soulShopView(state)
          .map((o) => {
            const note = o.capped
              ? o.capReason || "已達上限"
              : `獲 ${escapeHtml(o.grantLabel)} · ${o.cost} 精魂`;
            const label = o.capped ? "已滿" : "兌換";
            return `
        <li class="card-row${o.capped ? " is-capped" : ""}">
          <div>
            <strong>${escapeHtml(o.name)}</strong>
            <span class="muted">${escapeHtml(o.desc || "")} · ${note}</span>
          </div>
          <button type="button" class="primary" data-soul-shop-buy="${escapeHtml(o.id)}" ${
            o.canBuy ? "" : "disabled"
          }>${label}</button>
        </li>`;
          })
          .join("") || `<li class="empty">暫無精魂貨物。</li>`;
      shopBody = `<h2>商肆 · 精魂</h2>
      <p class="lead">精魂 ${soulN} · 放生／潮還所得（養成／稀有／融合越高越賺）兌換飼料／材料／道具</p>
      <ul class="list">${soulRows}</ul>`;
    } else if (shopInner === "grit") {
      const cosRows = (gritV.cosmeticList || gritV.cosmeticsList || [])
        .map((c) => {
          const owned = c.owned ? "已擁有" : `淵砂×${c.cost}`;
          return `<li class="card-row">
        <div><strong>${escapeHtml(c.name)}</strong><span class="muted"> · ${escapeHtml(c.desc)}</span></div>
        <button type="button" class="secondary" data-abyss-cosmetic="${c.id}" ${c.owned ? "disabled" : ""}>${owned}</button>
      </li>`;
        })
        .join("");
      const nodeMaxed = (gritV.powerNodes || 0) >= (gritV.powerNodeMax || 0);
      shopBody = `<h2>商肆 · 淵砂</h2>
      <p class="lead">淵砂 ${gritHave} · 潮淵深潛結算兌換</p>
      <ul class="list">
      <li class="card-row">
        <div><strong>淵核</strong><span class="muted"> · 永久全隊攻擊 +${gritV.powerNodeAtkPct || 1}%／級 · ${gritV.powerNodes || 0}/${gritV.powerNodeMax || 0}</span></div>
        <button type="button" class="secondary" data-abyss-power-node ${nodeMaxed ? "disabled" : ""}>${
          nodeMaxed ? "已滿" : `淵砂×${gritV.powerNodeCost}`
        }</button>
      </li>
      <li class="card-row">
        <div><strong>融合核</strong><span class="muted"> · 終身融合一次必需 · 本週 ${gritV.fusionCoresBoughtWeek || 0}/${gritV.fusionCoreWeeklyLimit || 1}</span></div>
        <button type="button" class="secondary" data-abyss-fusion-core ${(gritV.fusionCoresBoughtWeek || 0) >= (gritV.fusionCoreWeeklyLimit || 1) ? "disabled" : ""}>淵砂×${gritV.fusionCoreCost || 180}</button>
      </li>
      <li class="card-row">
        <div><strong>潮淵高階蛋</strong><span class="muted"> · 本週 ${gritV.eggsBoughtWeek}/${gritV.eggsWeeklyLimit} · 較易出稀有</span></div>
        <button type="button" class="secondary" data-abyss-egg ${gritV.eggsBoughtWeek >= gritV.eggsWeeklyLimit ? "disabled" : ""}>淵砂×${gritV.eggCost}</button>
      </li>
      <li class="card-row">
        <div><strong>潮轉符</strong><span class="muted"> · 永久隨機轉屬 · 持有 ${gritV.tideShiftHave || 0}</span></div>
        <div class="row-actions">
          <button type="button" class="secondary" data-abyss-buy-shift>淵砂×${gritV.tideShiftCost}</button>
          <button type="button" class="primary" data-act="open-tide-shift" ${(gritV.tideShiftHave || 0) < 1 ? "disabled" : ""}>使用</button>
        </div>
      </li>
      ${cosRows}
    </ul>`;
    } else {
      shopBody = `<h2>商肆 · 靈石</h2>
      <p class="lead">靈石 ${Math.floor(state.stones)} · 牧場 ${ranchN}／${ranchCap(state)}</p>
      <ul class="list">${shopRows}</ul>`;
    }
    return wrapStage(nav, `${shopInnerNavHtml()}${shopBody}`);
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
      <p class="lead">→【${escapeHtml(br.next.name)}】</p>
      ${missNote}
      <ul class="cond-list breakthrough-gates${compactCls}">${gateRows}</ul>`,
      `<div class="row">
        <button type="button" class="primary${tutGlow({ type: "act", act: "break" })}" data-act="break" ${br.ready ? "" : "disabled"}>${escapeHtml(breakLabel)}</button>
      </div>`
    );
  }

  const tutCta = tutorialQiReady(state)
    ? `<div class="row tut-cta-row"><button type="button" class="primary${tutGlow({ type: "panel-sub", group: "cultivate", id: "advance" })}" data-panel-sub="cultivate:advance">靈契已滿 → 前往突破</button></div>`
    : "";

  return wrapStage(
    nav,
    `<div class="cultivate-panel panel-train">
    ${tutCta}
    ${trainIdleStripHtml()}
    ${trainRatesBlockHtml(rateLines, rateSummary)}
    </div>`
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

function petFlagTags(p) {
  const bits = [];
  if (p.starred) bits.push(`<span class="pet-tag pet-tag-star" title="星標">★</span>`);
  if (p.locked) bits.push(`<span class="pet-tag pet-tag-lock" title="上鎖">鎖</span>`);
  return bits.join("");
}

/** 戰魂／職魂短標（主性格） */
function personalitySoulTagHtml(personalityId) {
  const ex = personalityExplain(personalityId);
  if (!ex?.role) return "";
  const short = ex.roleShort || PERSONALITY_ROLE_SHORT[ex.role] || ex.roleLabel;
  return `<span class="pet-tag pet-tag-soul pet-tag-soul-${escapeHtml(ex.role)}" title="${escapeHtml(
    ex.roleLabel
  )}">${escapeHtml(short)}</span>`;
}

/** 出戰陣中有親子關係的 uid */
function partyKinshipUidSet(pets) {
  const list = Array.isArray(pets) ? pets : [];
  const uids = new Set(list.map((p) => p.uid).filter(Boolean));
  const out = new Set();
  for (const p of list) {
    for (const id of p.bornFrom || []) {
      if (uids.has(id) && id !== p.uid) {
        out.add(p.uid);
        out.add(id);
      }
    }
  }
  return out;
}

/** 卡面右上角星標／上鎖徽章（牧場可撳；揀寵卡只顯示） */
function petCornerBadges(p, opts = {}) {
  const uid = escapeHtml(p.uid || p.templateId);
  const star = p.starred ? "★" : "☆";
  if (opts.interactive) {
    return `<div class="pet-card-badges" aria-label="星標與上鎖">
      <button type="button" class="pet-badge pet-badge-star${p.starred ? " on" : ""}" data-toggle-star="${uid}" aria-label="星標">${star}</button>
      <button type="button" class="pet-badge pet-badge-lock${p.locked ? " on" : ""}" data-toggle-lock="${uid}" aria-label="上鎖">${
        p.locked ? "🔒" : "🔓"
      }</button>
    </div>`;
  }
  const bits = [`<span class="pet-badge pet-badge-star${p.starred ? " on" : ""}" title="星標">${star}</span>`];
  if (p.locked) bits.push(`<span class="pet-badge pet-badge-lock on" title="上鎖">🔒</span>`);
  return `<div class="pet-card-badges">${bits.join("")}</div>`;
}

/** 全頁重繪時保留 .stage-scroll 位置（批量放生揀寵／繁殖·孵化 live patch） */
function renderPreservingStageScroll() {
  const scroller = document.querySelector(".stage-scroll");
  const scrollTop = scroller?.scrollTop ?? 0;
  render();
  requestAnimationFrame(() => {
    const again = document.querySelector(".stage-scroll");
    if (again) again.scrollTop = scrollTop;
  });
}

function petPowerScore(p) {
  return (p.atk || 0) * 2 + (p.hp || 0) + (p.spd || 0) + (p.level || 1) * 8 + (p.fusionLevel || 0) * 20;
}

function sortRanchEntries(entries, sortKey) {
  const statusRank = { fight: 0, dispatch: 1, mating: 2, idle: 3 };
  const elOrder = { tide: 0, flame: 1, gale: 2, stone: 3, gloom: 4 };
  const list = [...entries];
  list.sort((a, b) => {
    const pa = a.pet;
    const pb = b.pet;
    // 星標永遠浮頂（除非專排星標時仍用星標優先）
    const starDiff = (pb.starred ? 1 : 0) - (pa.starred ? 1 : 0);
    if (starDiff) return starDiff;
    if (sortKey === "star") {
      return petPowerScore(pb) - petPowerScore(pa);
    }
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
    } else if (sortKey === "level") {
      const d = (pb.level || 1) - (pa.level || 1);
      if (d) return d;
    } else {
      const d = (statusRank[a.kind] ?? 9) - (statusRank[b.kind] ?? 9);
      if (d) return d;
    }
    return petPowerScore(pb) - petPowerScore(pa);
  });
  return list;
}

function petGridCard(p, extraBtn = "", tagHtml = "", opts = {}) {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  const title = displayPetName(p);
  const r = rarityInfo(p.rarity ?? 0);
  const g = petGeneration(p);
  const detailGlow = tutGlow({ type: "pet-detail", uid: p.uid || p.templateId });
  const managing = !!opts.managing;
  const selected = !!opts.selected;
  const selectable = !!opts.selectable;
  const lockedBlock = !!p.locked && managing;
  const selectCls = managing
    ? ` is-manage${selected ? " is-selected" : ""}${lockedBlock ? " is-locked-pet" : ""}${
        selectable ? " is-selectable" : ""
      }`
    : p.starred
      ? " is-starred"
      : "";
  const selectBtn = managing
    ? lockedBlock
      ? `<button type="button" disabled>已上鎖</button>`
      : selectable
        ? `<button type="button" class="${selected ? "primary" : "secondary"}" data-ranch-pick="${uid}">${
            selected ? "已選" : "選擇"
          }</button>`
        : `<button type="button" disabled>不可選</button>`
    : "";
  const badges = managing || opts.hideQuick ? petCornerBadges(p) : petCornerBadges(p, { interactive: true });
  return `
    <li class="pet-card${selectCls}">
      ${badges}
      <div class="pet-card-top">
        ${petArtFromPet(p, { size: 28, generation: g })}
        <div class="pet-card-title">
          <button type="button" class="linkish" data-pet-detail="${uid}" ${managing ? "disabled" : ""}><strong>${escapeHtml(title)}</strong></button>
          ${tagHtml}
        </div>
      </div>
      <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(g)} · Lv.${lv}${fus ? ` · 融${fus}` : ""}</span>
      <span class="muted">${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}${personalitySoulTagHtml(
        p.personalityId
      )} · 攻${fmtInt(p.atk)}</span>
      <div class="row-actions pet-card-actions">
        ${
          managing
            ? selectBtn
            : `<button type="button" class="info${detailGlow}" data-pet-detail="${uid}">詳情</button>${extraBtn}`
        }
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
  const detailGlow = tutGlow({ type: "pet-detail", uid: p.uid || p.templateId });
  return `
    <li class="card-row pet-row">
      ${petArtFromPet(p, { size: 34, generation: g })}
      <div>
        <button type="button" class="linkish" data-pet-detail="${uid}"><strong>${escapeHtml(title)}</strong></button>
        ${tagHtml}${petFlagTags(p)}
        <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(g)} · Lv.${lv}${fus ? ` · 融${fus}` : ""} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}${personalitySoulTagHtml(
          p.personalityId
        )}${p.personality2Name ? `/${escapeHtml(p.personality2Name)}` : ""}${p.bloodlineName && p.bloodlineName !== "無紋" ? `·${escapeHtml(p.bloodlineName)}` : ""}</span>
        <span class="muted">攻${fmtInt(p.atk)} 血${fmtInt(p.hp)} 速${fmtInt(p.spd)} · 【${escapeHtml(p.skillName || SKILLS[p.skillId]?.name || "—")}】</span>
      </div>
      <div class="row-actions">
        <button type="button" class="info${detailGlow}" data-pet-detail="${uid}">詳情</button>
        ${extraBtn}
      </div>
    </li>`;
}

/** 密集揀寵卡（繁殖／派遣／融合）：兩欄緊湊＋星標／上鎖 */
function petPickCard(p, opts = {}) {
  const selected = !!opts.selected;
  const disabled = !!opts.disabled;
  const btnLabel = opts.btnLabel || (selected ? "已選" : "選擇");
  const btnAttr = opts.btnAttr || "";
  const meta = opts.meta || "";
  const btnClass = opts.btnClass || (selected ? "primary" : "secondary");
  const starCls = p.starred ? " is-starred" : "";
  const lockCls = p.locked ? " is-locked-pet" : "";
  return `
    <li class="pet-pick-card${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${starCls}${lockCls}">
      ${petCornerBadges(p)}
      <div class="pet-pick-top">
        ${petArtFromPet(p, { size: 24, generation: petGeneration(p) })}
        <div class="pet-pick-title">
          <strong>${escapeHtml(displayPetName(p))}</strong>
        </div>
      </div>
      <span class="muted">${meta}</span>
      <button type="button" class="${btnClass}" ${btnAttr} ${disabled ? "disabled" : ""}>${btnLabel}</button>
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
  const mating = breedBusyUids(state);
  const ranch = state.ranch || [];
  const reqLabel = mission.reqLabel || "";
  const rows =
    ranch
      .filter((p) => !busy.has(p.uid) && !mating.has(p.uid))
      .map((p) => {
        const selected = pick.has(p.uid);
        const match = petMatchesDispatchMission(p, mission);
        const r = rarityInfo(p.rarity ?? 0);
        return petPickCard(p, {
          selected,
          disabled: !match,
          btnLabel: selected ? "已選" : match ? "選擇" : "不符",
          btnAttr: `data-dispatch-pick="${escapeHtml(p.uid)}"`,
          meta: `<span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${escapeHtml(p.elementName)} · 攻${fmtInt(p.atk)}${match ? "" : " · 唔符合"}`,
        });
      })
      .join("") || `<li class="empty pet-pick-empty">牧場無可派遣靈寵（需撤回出戰或等派遣歸來）。</li>`;
  return `
    <div class="sheet-overlay" role="presentation" data-live="dispatch-modal">
      <div class="sheet-card pet-pick-sheet" role="dialog" aria-label="選擇派遣靈寵" data-sheet-card>
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>${escapeHtml(mission.name)}</h3>
        <p class="meta">${escapeHtml(mission.desc)}${reqLabel ? ` · ${escapeHtml(reqLabel)}` : ""} · 需 ${need} 隻 · 已選 ${pick.size}/${need}</p>
        <ul class="pet-pick-grid">${rows}</ul>
        <div class="row pet-pick-actions">
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
  const mating = breedBusyUids(state);

  const syn = partySynergy(state.pets);
  const kinSet = partyKinshipUidSet(state.pets);
  const synNote = syn.labels.length
    ? syn.labels
        .map((l) =>
          l.includes("親子")
            ? `<span class="pet-tag pet-tag-kin" title="親子同出戰：攻血↑">${escapeHtml(l)}</span>`
            : escapeHtml(l)
        )
        .join("、")
    : "同元素／種類／親子可羈絆";

  const roster =
    state.pets
      .map((p) =>
        petRow(
          p,
          `<button type="button" class="secondary" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`,
          `${petStatusTag("fight")}${
            kinSet.has(p.uid) ? `<span class="pet-tag pet-tag-kin" title="親子羈絆">親子</span>` : ""
          }`
        )
      )
      .join("") ||
    `<li class="empty">出戰欄空。從牧場派出靈寵（最多 ${activePetMaxForState(state)}）。</li>`;

  const deployedIds = new Set((state.pets || []).map((p) => p.uid));
  const ranchIdle = (ranch || []).filter((p) => !deployedIds.has(p.uid));
  let ranchEntries = sortRanchEntries(
    [
      ...ranchIdle.filter((p) => busy.has(p.uid)).map((p) => ({ pet: p, kind: "dispatch" })),
      ...ranchIdle.filter((p) => mating.has(p.uid) && !busy.has(p.uid)).map((p) => ({ pet: p, kind: "mating" })),
      ...(state.pets || []).map((p) => ({ pet: p, kind: "fight" })),
      ...ranchIdle.filter((p) => !busy.has(p.uid) && !mating.has(p.uid)).map((p) => ({ pet: p, kind: "idle" })),
    ],
    ranchSort
  );
  if (ranchStarOnly) {
    ranchEntries = ranchEntries.filter((e) => e.pet.starred);
  }
  const manageSelect = ranchRelease?.phase === "select" ? new Set(ranchRelease.selected || []) : null;
  const ranchList =
    ranchEntries
      .map(({ pet: p, kind }) => {
        const tag =
          kind === "fight"
            ? petStatusTag("fight")
            : kind === "dispatch"
              ? petStatusTag("dispatch")
              : kind === "mating"
                ? `<span class="pet-tag pet-tag-dispatch">交配中</span>`
                : petStatusTag("idle");
        const extra =
          kind === "fight"
            ? `<button type="button" class="secondary" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`
            : kind === "dispatch" || kind === "mating"
              ? ""
              : `<button type="button" class="primary${tutGlow({ type: "deploy" })}" data-deploy="${escapeHtml(p.uid)}">出戰</button>`;
        const selectable = kind === "idle" && !p.locked;
        return petGridCard(p, extra, tag, {
          managing: !!manageSelect,
          selected: manageSelect ? manageSelect.has(p.uid) : false,
          selectable,
        });
      })
      .join("") ||
    `<li class="empty pet-grid-empty">${
      ranchStarOnly ? "冇星標靈寵。" : `牧場空。孵化／契約成功的靈寵會進入牧場（容量 ${cap}）。`
    }</li>`;

  const sortOpts = [
    ["status", "狀態"],
    ["star", "星標"],
    ["power", "戰力"],
    ["level", "Lv"],
    ["gen", "代數"],
    ["rarity", "稀有"],
    ["element", "屬性"],
  ]
    .map(
      ([id, label]) =>
        `<button type="button" class="sort-chip${ranchSort === id ? " on" : ""}" data-ranch-sort="${id}">${label}</button>`
    )
    .join("");
  const starFilterChip = `<button type="button" class="sort-chip${ranchStarOnly ? " on" : ""}" data-ranch-star-filter aria-pressed="${
    ranchStarOnly ? "true" : "false"
  }">只睇星標</button>`;

  const idleEggs = eggsView(state).filter((e) => !e.hatching);
  const hatchBusy = activeHatchCount(state);
  const hatchCap = hatchSlotCap(state);
  const eggBrief =
    idleEggs.length || hatchBusy
      ? `<p class="meta hatch-ranch-brief" data-hatch-ranch-brief>
          寵物蛋 ${idleEggs.length + hatchBusy} 枚 · 孵化中 ${hatchBusy}/${hatchCap}
          <button type="button" class="linkish${tutGlow({ type: "panel-sub", group: "party", id: "hatch" })}" data-panel-sub="party:hatch">去孵化</button>
        </p>`
      : `<p class="meta hatch-ranch-brief muted" data-hatch-ranch-brief>尚無寵物蛋 · <button type="button" class="linkish" data-panel-sub="party:hatch">去孵化</button></p>`;

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

  const slotRows = (dv.slots || [])
    .map((s) => {
      if (s.status === "empty" || !s.mission) {
        return `
      <li class="card-row dispatch-slot">
        <div>
          <strong class="muted">空槽</strong>
          <span class="muted">解鎖更多練功地後開放新任務</span>
        </div>
        <button type="button" class="secondary" disabled>未開放</button>
      </li>`;
      }
      const matBits = dispatchMatBits(s.mission);
      const eggNote = s.eggChance
        ? ` · 蛋${Math.round((s.eggChance.rate || 0) * 100)}%`
        : "";
      const reqNote = s.reqLabel ? ` · ${escapeHtml(s.reqLabel)}` : "";
      const rewardNote = `${escapeHtml(rewardBitsHtml(s.reward))}${matBits ? ` · ${matBits}` : ""}${eggNote}`;
      if (s.status === "busy") {
        const left = Math.ceil((s.leftMs || 0) / 1000);
        return `
      <li class="card-row dispatch-slot">
        <div>
          <strong>${escapeHtml(s.name)}</strong>
          <span class="muted">${escapeHtml(s.petNames)} · 剩餘 ${left}s${reqNote}</span>
        </div>
        <button type="button" class="secondary" disabled>探險中</button>
      </li>`;
      }
      if (s.status === "ready") {
        return `
      <li class="card-row dispatch-slot">
        <div>
          <strong>${escapeHtml(s.name)}</strong>
          <span class="muted">${escapeHtml(s.petNames)} · 已歸來 · ${rewardNote}</span>
        </div>
        <button type="button" class="success" data-claim-dispatch="${escapeHtml(s.dispatchId)}">收集</button>
      </li>`;
      }
      return `
      <li class="card-row dispatch-slot">
        <div>
          <strong>${escapeHtml(s.name)}</strong>
          <span class="muted">${escapeHtml(s.desc)}${reqNote} · 需 ${s.needPets} 隻 · ${rewardNote}</span>
        </div>
        <button type="button" class="primary" data-open-dispatch="${s.missionId}">派出</button>
      </li>`;
    })
    .join("");

  const nav = partyNavHtml();
  const sub = panelSub.party;

  if (sub === "ranch") {
    if (ranchRelease?.phase === "confirm") {
      const prev = previewReleaseSoul(state, ranchRelease.selected || []);
      const rows =
        (prev.pets || [])
          .map(
            (row) =>
              `<li class="card-row"><div><strong>${escapeHtml(row.name)}</strong><span class="muted">精魂 +${row.soul}</span></div></li>`
          )
          .join("") || `<li class="empty">未揀靈寵。</li>`;
      return wrapStage(
        nav,
        `<h2>確認放生</h2>
        <p class="lead">將放生 ${prev.pets?.length || 0} 隻 · 預計精魂 +${prev.soul || 0}</p>
        <p class="meta muted">放生只獲精魂，唔再退靈石／飼料／靈塵。</p>
        <ul class="list">${rows}</ul>`,
        `<div class="row">
          <button type="button" class="secondary" data-act="ranch-release-back">返回</button>
          <button type="button" class="primary" data-act="ranch-release-confirm" ${
            prev.ok && prev.pets?.length ? "" : "disabled"
          }>確認放生</button>
        </div>`
      );
    }
    const selCount = ranchRelease?.phase === "select" ? (ranchRelease.selected || []).length : 0;
    const selSoul =
      ranchRelease?.phase === "select" && selCount
        ? previewReleaseSoul(state, ranchRelease.selected).soul || 0
        : 0;
    const manageBar = ranchRelease?.phase === "select"
      ? `<div class="ranch-manage-bar">
          <p class="meta">已選 ${selCount} · 預計精魂 +${selSoul} · 上鎖／出戰／派遣不可選 · 幼寵精魂較低</p>
          <div class="row">
            <button type="button" class="secondary" data-act="ranch-release-cancel">取消</button>
            <button type="button" class="ghost" data-act="ranch-cull-suggest">加選弱寵</button>
            <button type="button" class="primary" data-act="ranch-release-next" ${selCount ? "" : "disabled"}>下一步</button>
          </div>
        </div>`
      : `<div class="row ranch-manage-entry">
          <button type="button" class="secondary" data-act="ranch-release-start">批量放生</button>
          ${
            ranch.length >= cap
              ? `<button type="button" class="primary" data-act="ranch-cull-open">清弱寵騰位</button>`
              : ""
          }
        </div>`;
    const capNote =
      ranch.length >= cap
        ? `<p class="meta hatch-ranch-warn">牧場已滿——孵化領取／契約會卡住。建議清弱寵或出戰。</p>`
        : ranch.length >= cap - 2
          ? `<p class="meta muted">牧場將滿（餘 ${cap - ranch.length}）。出殼即賣精魂偏低，寧願潮還多餘蛋。</p>`
          : "";
    return wrapStage(
      nav,
      `<h2>靈寵 · 牧場</h2>
      <p class="lead">牧場 ${ranch.length}/${cap} · 出戰 ${state.pets.length} · 精魂 ${Math.floor(
        state.materials?.soul_essence || 0
      )} · 待命微產飼料／靈塵／潮霧令</p>
      ${capNote}
      ${eggBrief}
      <div class="ranch-sort" role="group" aria-label="牧場排序">${sortOpts}${starFilterChip}</div>
      ${manageBar}
      <ul class="pet-grid">${ranchList}</ul>`
    );
  }
  if (sub === "hatch") {
    return wrapStage(nav, petsHatchView());
  }
  if (sub === "breed") {
    const breed = petsBreedView();
    return wrapStage(nav, breed.body, breed.dock);
  }
  if (sub === "dispatch") {
    return wrapStage(
      nav,
      `<h2>靈寵 · 派遣</h2>
      <p class="lead">固定 ${dv.boardSize} 槽 · 進行 ${dv.slotsUsed}/${dv.slotsMax} · 派出後槽位變「探險中」· 完成撳「收集」先換新任務 · 可接任務每日刷新</p>
      <ul class="list dispatch-slots">${slotRows}</ul>`
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
    <p class="lead">${state.pets.length}/${activePetMaxForState(state)} · ${synNote}</p>
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
  const temperRow = (preview.temperParents || [])
    .map((t) => {
      const soul = t.roleShort
        ? `<span class="pet-tag pet-tag-soul pet-tag-soul-${escapeHtml(t.role || "")}" title="${escapeHtml(
            t.roleLabel || ""
          )}">${escapeHtml(t.roleShort)}</span>`
        : "";
      return `<span class="breed-temper-parent">${escapeHtml(t.name)} · ${escapeHtml(
        t.personalityName
      )}${soul}</span>`;
    })
    .join("<span class=\"muted\"> × </span>");
  const sp = preview.statPreview;
  const genMultNote =
    preview.genMult != null && preview.genMult > 1
      ? `<p class="meta">代數加成 ×${preview.genMult.toFixed(2)}（提高雜交／突變）</p>`
      : "";
  return `
    <div class="breed-preview">
      <h3>繁殖預覽</h3>
      <p class="meta">${escapeHtml(preview.parentNames[0])} × ${escapeHtml(preview.parentNames[1])}</p>
      <ul class="breed-outcomes">${outcomeRows}</ul>
      <div class="breed-chip-row">${genChips}</div>
      ${genMultNote}
      <p class="meta">物種池：${escapeHtml(preview.speciesHint)} · 屬性突變 ~${Math.round(
        preview.elemRate * 100
      )}%</p>
      <p class="meta">雙親性格：${temperRow}</p>
      ${
        preview.temperNote
          ? `<p class="meta muted">${escapeHtml(preview.temperNote)}</p>`
          : ""
      }
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
  const memberRow = (p, extraMuted = "") => {
    if (p.exists) {
      return `<li><button type="button" class="linkish" data-pet-detail="${escapeHtml(p.uid)}">${escapeHtml(
        p.name
      )}</button> <span class="muted">${escapeHtml(p.speciesName)} · ${escapeHtml(genLabel(p.generation))}${
        p.deployed ? " · 出戰" : ""
      }${extraMuted}</span></li>`;
    }
    return `<li><span class="muted">${escapeHtml(p.name)}</span></li>`;
  };
  const parentRows =
    lineage.parents.length > 0
      ? lineage.parents.map((p) => memberRow(p)).join("")
      : `<li class="muted">無父母紀錄</li>`;
  const gpRows =
    (lineage.grandparents || []).length > 0
      ? lineage.grandparents
          .map((g) => memberRow(g, g.viaName ? ` · 經${escapeHtml(g.viaName)}` : ""))
          .join("")
      : "";
  const childRows =
    lineage.children.length > 0
      ? lineage.children.map((c) => memberRow(c)).join("")
      : `<li class="muted">尚無子代</li>`;
  const kinBanner = lineage.kinshipActive
    ? `<p class="meta lineage-kin"><span class="pet-tag pet-tag-kin">親子羈絆</span> 與此寵有血緣的靈寵正同隊出戰（攻血↑）。</p>`
    : lineage.parents.some((p) => p.exists) || lineage.children.length
      ? `<p class="meta muted">親子同出戰可觸發「親子羈絆」攻血加成。</p>`
      : "";
  return `
    <h3>血統</h3>
    <p class="meta">本體 ${escapeHtml(genLabel(lineage.generation))}</p>
    ${kinBanner}
    <p class="meta"><strong>父母</strong></p>
    <ul class="lineage-list">${parentRows}</ul>
    ${
      gpRows
        ? `<p class="meta"><strong>祖父母</strong>（${lineage.grandparents.length}）</p>
    <ul class="lineage-list">${gpRows}</ul>`
        : ""
    }
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
  const batch = clampBreedBatchCount(breedCount);
  const cycleSec = Math.ceil((bs.cooldownTotalMs || BREED_COOLDOWN_MS || 45000) / 1000);

  const jobRows =
    (bs.jobs || [])
      .map((j) => {
        const sec = Math.ceil((j.leftMs || 0) / 1000);
        const claimN = j.claimableCount || 0;
        const batchN = j.batch || 1;
        const claimBtn =
          claimN > 0
            ? `<button type="button" class="primary success" data-breed-claim="${escapeHtml(j.id)}">領取蛋×${claimN}</button>`
            : "";
        if (claimN > 0 && !j.mating) {
          return `<li class="card-row breed-job is-ready" data-breed-job="${escapeHtml(j.id)}">
            <div>
              <strong>${escapeHtml(j.names?.[0] || "？")} × ${escapeHtml(j.names?.[1] || "？")}</strong>
              <span class="muted" data-breed-job-meta>孕育完成 · 可領蛋×${claimN}${batchN > 1 ? `／${batchN}` : ""}</span>
              <div class="bar breed-cd-bar"><i data-breed-job-bar style="width:100%"></i></div>
            </div>
            <div class="row-actions" data-breed-job-actions>${claimBtn}</div>
          </li>`;
        }
        return `<li class="card-row breed-job" data-breed-job="${escapeHtml(j.id)}" data-ready-at="${j.readyAt || 0}" data-started-at="${j.startedAt || 0}" data-batch="${batchN}" data-claimed-cycles="${j.claimedCycles || 0}" data-cycle-ms="${j.cycleMs || 45000}">
          <div>
            <strong>${escapeHtml(j.names?.[0] || "？")} × ${escapeHtml(j.names?.[1] || "？")}</strong>
            <span class="muted" data-breed-job-meta>${
              claimN > 0
                ? `交配中 · 剩餘 <strong data-breed-job-sec>${sec}</strong>s · 已可領×${claimN}`
                : `孕育中 · 剩餘 <strong data-breed-job-sec>${sec}</strong>s${batchN > 1 ? ` · ×${batchN}` : ""}`
            }</span>
            <div class="bar breed-cd-bar"><i data-breed-job-bar style="width:${j.pct || 0}%"></i></div>
          </div>
          <div class="row-actions" data-breed-job-actions>${
            claimBtn || `<span class="pet-tag pet-tag-dispatch">交配中</span>`
          }</div>
        </li>`;
      })
      .join("") ||
    `<li class="empty muted">尚無交配中——下方選雙親開始（最多 ${bs.queueMax || BREED_QUEUE_MAX} 欄，似秘境召喚）。</li>`;

  const slotHtml = (pet, idx) => {
    if (!pet) {
      return `<div class="breed-slot is-empty"><span class="muted">空位 ${idx + 1} · 下方加入</span></div>`;
    }
    return `<div class="breed-slot">
      ${petArtFromPet(pet, { size: 36, generation: petGeneration(pet) })}
      <div>
        <strong>${escapeHtml(displayPetName(pet))}</strong>
        <span class="muted">${genTagHtml(petGeneration(pet))} · ${escapeHtml(pet.elementName)}·${escapeHtml(pet.personalityName)}${personalitySoulTagHtml(
          pet.personalityId
        )}</span>
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
        return petPickCard(p, {
          selected: on,
          disabled: mating && !on,
          btnLabel: mating ? "交配中" : on ? "已選" : "加入交配",
          btnAttr: `data-breed-toggle="${escapeHtml(p.uid)}"`,
          meta: `<span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(
            petGeneration(p)
          )} · ${escapeHtml(p.elementName)} · Lv.${p.level ?? 1}${personalitySoulTagHtml(p.personalityId)}${
            mating ? " · 交配中" : ""
          }`,
        });
      })
      .join("") || `<li class="empty pet-pick-empty">牧場需要待命靈寵才能交配（派遣中不可用）。</li>`;

  const preview = pa && pb ? breedPreview(pa, pb) : null;
  const unitMat =
    pa && pb
      ? breedMatCost(petGeneration(pa), petGeneration(pb))
      : { coral_shard: 1 };
  const bMat = {};
  for (const [id, n] of Object.entries(unitMat)) {
    if (!n) continue;
    bMat[id] = n * batch;
  }
  const bMatHtml = matAffordHtml(bMat);
  const stoneNeed = BREED_STONE_COST * batch;
  const canStart =
    selected.size === 2 &&
    bs.ready &&
    !!pa &&
    !!pb &&
    !matingBusy.has(pa.uid) &&
    !matingBusy.has(pb.uid);

  const body = `<h2>靈寵 · 繁殖</h2>
    <p class="lead">交配產出<strong>蛋</strong>（再孵化）· 單次 ${cycleSec}s · 欄位 ${bs.slotsUsed || 0}/${bs.queueMax || BREED_QUEUE_MAX} · 蛋 ${ (state.eggs || []).length }</p>
    <h3>孕育中／可領</h3>
    <ul class="list breed-job-list">${jobRows}</ul>
    <h3>新一輪交配</h3>
    <div class="breed-slots">${slotHtml(pa, 0)}${slotHtml(pb, 1)}</div>
    ${preview ? breedPreviewHtml(preview, bMatHtml) : `<p class="meta">選擇雙親後顯示預覽</p>`}
    <div class="summon-controls breed-batch-controls">
      <div class="summon-slider-row">
        <span class="sweep-label">交配次數 <strong data-breed-count-label>${batch}</strong></span>
        <input type="range" class="summon-slider" min="${BREED_BATCH_MIN}" max="${BREED_BATCH_MAX}" value="${batch}" data-breed-slider aria-label="交配次數" />
        <span class="muted">${BREED_BATCH_MIN}–${BREED_BATCH_MAX}</span>
      </div>
      <p class="sweep-label">約 ${cycleSec * batch}s · ${stoneNeed} 石${batch > 1 ? ` · 可中途領蛋` : ""}</p>
    </div>
    <h3>待命靈寵</h3>
    <ul class="pet-pick-grid breed-pet-list">${list}</ul>`;
  const dock = `<div class="row">
      <button type="button" class="primary${tutGlow({ type: "act", act: "start-breed" })}" data-breed-confirm data-breed-count="${batch}" ${canStart ? "" : "disabled"}>開始交配×${batch}（${selected.size}/2）</button>
    </div>`;
  return { body, dock };
}

function hatchInventoryFilter(egg) {
  if (hatchEggFilter === "breed") return egg.source === "breed";
  if (hatchEggFilter === "shop") {
    return (
      egg.source === "shop" ||
      egg.source === "tutorial_shop" ||
      egg.source === "abyss_dive" ||
      (egg.source !== "breed" && egg.source !== "starter")
    );
  }
  if (hatchEggFilter === "ready") return !egg.hatching;
  return true;
}

function petsHatchView() {
  const hv = hatchSlotsView(state);
  const free = Math.max(0, hv.cap - hv.used);
  const slotCards = hv.slots
    .map((s) => {
      if (s.empty) {
        return `<div class="hatch-slot is-empty" data-hatch-slot="${s.index}">
          <span class="muted">空欄 ${s.index + 1}</span>
        </div>`;
      }
      const e = s.egg;
      const uid = escapeHtml(e.uid);
      if (s.ready) {
        return `<div class="hatch-slot is-ready" data-hatch-slot="${s.index}" data-egg-uid="${uid}">
          <div class="hatch-slot-body">
            <strong>${escapeHtml(e.name)}</strong>
            <span class="muted" data-hatch-slot-meta>已就緒</span>
          </div>
          <div class="hatch-slot-actions">
            <button type="button" class="primary${tutGlow({ type: "claim-hatch" })}" data-claim-hatch="${uid}">領取</button>
          </div>
        </div>`;
      }
      return `<div class="hatch-slot is-hatching" data-hatch-slot="${s.index}" data-egg-uid="${uid}">
        <div class="hatch-slot-body">
          <strong>${escapeHtml(e.name)}</strong>
          <span class="muted" data-hatch-slot-meta>孵化中 ${e.leftSec}s</span>
        </div>
        <div class="hatch-slot-actions">
          <span class="hatch-timer" data-egg-timer data-egg-uid="${uid}" data-ready-at="${e.readyAt || 0}">${e.leftSec}s</span>
        </div>
      </div>`;
    })
    .join("");

  const invEggs = eggsView(state)
    .filter((e) => !e.hatching)
    .filter(hatchInventoryFilter);
  const canStart = free > 0;
  const ranchCv = ranchCapView(state);
  const ranchWarn = ranchCv.full
    ? `<p class="meta hatch-ranch-warn">牧場已滿（${ranchCv.used}/${ranchCv.cap}）——領取會失敗。<button type="button" class="linkish" data-act="hatch-open-cull">清弱寵騰位</button></p>`
    : ranchCv.nearlyFull
      ? `<p class="meta hatch-ranch-warn">牧場將滿（餘 ${ranchCv.free}）· 可先潮還多餘蛋或清倉。</p>`
      : "";
  const invRows =
    invEggs
      .map((e) => {
        const uid = escapeHtml(e.uid);
        const dissolveN = e.dissolveSoul ?? 1;
        return `<li class="card-row egg-row hatch-inv-row">
          <div>
            <strong>${escapeHtml(e.name)}</strong>
            <span class="muted">${escapeHtml(e.label)} · ${escapeHtml(e.desc || "")}</span>
          </div>
          <div class="row-actions">
            <button type="button" class="ghost" data-dissolve-egg="${uid}" title="未孵化精，精魂少於放生">潮還＋${dissolveN}</button>
            <button type="button" class="primary${tutGlow({ type: "start-hatch" })}" data-start-hatch="${uid}" ${
              canStart ? "" : "disabled"
            }>放入孵化</button>
          </div>
        </li>`;
      })
      .join("") || `<li class="empty muted">庫存無蛋。商肆／繁殖／派遣可獲得。</li>`;

  const filters = [
    ["all", "全部"],
    ["breed", "繁殖"],
    ["shop", "商肆／品階"],
    ["ready", "可開孵"],
  ]
    .map(
      ([id, label]) =>
        `<button type="button" class="sort-chip${hatchEggFilter === id ? " on" : ""}" data-hatch-filter="${id}">${label}</button>`
    )
    .join("");

  const claimAllDisabled = hv.readyCount <= 0;
  return `<div class="hatch-panel" data-hatch-panel>
    <h2>靈寵 · 孵化</h2>
    <p class="lead">孵化欄 ${hv.used}/${hv.cap} · 庫存 ${(state.eggs || []).filter((e) => e.startedAt == null).length} 枚</p>
    ${ranchWarn}
    <p class="meta muted">唔想養嘅蛋可「潮還」化精（少於孵出再放生）——省雙重等待。</p>
    <h3>孵化欄</h3>
    <div class="hatch-slots" data-hatch-slots>${slotCards}</div>
    <div class="row hatch-claim-all-row">
      <button type="button" class="primary" data-claim-all-hatch ${claimAllDisabled ? "disabled" : ""}>
        <span data-claim-all-label>${hv.readyCount > 0 ? `一鍵收取（${hv.readyCount}）` : "一鍵收取"}</span>
      </button>
    </div>
    <h3>蛋庫存</h3>
    <div class="ranch-sort hatch-egg-filters" role="group" aria-label="蛋篩選">${filters}</div>
    <ul class="list hatch-inv-list">${invRows}</ul>
  </div>`;
}

function hatchClaimPetRowsHtml(pets, reveals = []) {
  if (!pets?.length) return `<li class="empty">沒有孵出靈寵。</li>`;
  return pets
    .map((p, i) => {
      const r = rarityInfo(p.rarity ?? 0);
      const reveal = reveals[i] || null;
      const tags = (reveal?.tags || [])
        .map((t) => `<span class="hatch-reveal-tag">${escapeHtml(t)}</span>`)
        .join("");
      const parentLine =
        reveal?.parents?.length === 2
          ? `<span class="muted">血脈：${escapeHtml(reveal.parents[0])} × ${escapeHtml(reveal.parents[1])}</span>`
          : "";
      return `<li class="card-row hatch-claim-row${reveal?.tags?.length ? " is-reveal" : ""}">
        <div>
          <strong>${escapeHtml(displayPetName(p))}</strong>
          ${tags ? `<div class="hatch-reveal-tags">${tags}</div>` : ""}
          <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${genTagHtml(
            petGeneration(p)
          )} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)} · Lv.${p.level ?? 1}</span>
          <span class="muted">攻${fmtInt(p.atk)} 血${fmtInt(p.hp)} 速${fmtInt(p.spd)}</span>
          ${parentLine}
        </div>
      </li>`;
    })
    .join("");
}

function hatchClaimModalHtml() {
  if (!hatchClaimModal?.pets?.length) return "";
  const pets = hatchClaimModal.pets;
  const reveals = hatchClaimModal.reveals || [];
  const celebrate = !!hatchClaimModal.celebrate;
  const title = pets.length === 1 ? (celebrate ? "血脈破殼" : "孵化完成") : `一鍵收取 · ${pets.length} 隻`;
  const lead = celebrate
    ? "潮象顯現——血脈已寫入牧場"
    : "靈寵已進入牧場";
  return `
    <div class="combat-modal-overlay hatch-claim-overlay${celebrate ? " is-celebrate" : ""}" data-live="hatch-claim" role="dialog" aria-label="孵化領取">
      <div class="combat-modal-card hatch-claim-card">
        <div class="combat-modal-scroll">
          <h2>${escapeHtml(title)}</h2>
          <p class="lead">${escapeHtml(lead)}</p>
          <ul class="list hatch-claim-list">${hatchClaimPetRowsHtml(pets, reveals)}</ul>
        </div>
        <div class="combat-modal-actions row">
          <button type="button" class="primary" data-act="close-hatch-claim">返回</button>
        </div>
      </div>
    </div>`;
}

function partyNavHtml() {
  return panelSubNav("party", [
    { id: "fight", label: "出戰" },
    { id: "ranch", label: "牧場" },
    { id: "hatch", label: "孵化" },
    { id: "breed", label: "繁殖" },
    { id: "dispatch", label: "派遣" },
    { id: "bond", label: "待契" },
  ]);
}

function fmtGrowthMult(v) {
  if (v == null || Number.isNaN(+v)) return "—";
  const pct = Math.round((+v - 1) * 100);
  if (pct === 0) return "±0%";
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

function petDetailTabNav(active) {
  const tabs = [
    ["stats", "屬性"],
    ["temper", "性格"],
    ["skills", "技能"],
  ];
  return `<nav class="pet-detail-tabs" aria-label="靈寵詳情分頁">${tabs
    .map(
      ([id, label]) =>
        `<button type="button" class="${active === id ? "on" : ""}" data-pet-detail-tab="${id}">${label}</button>`
    )
    .join("")}</nav>`;
}

function petDetailStatsHtml(pet, detail, rarity) {
  const kindEx = kindExplain(pet.kind);
  const elEx = elementExplain(pet.elementId);
  const base = detail.baseline;
  const bonus = detail.innateBonus || { atk: 0, hp: 0, spd: 0 };
  const bonusLine = (n) => (n > 0 ? ` <span class="muted">（天生＋${fmtStat(n)}）</span>` : "");
  return `
    <ul class="skill-list pet-detail-block">
      <li><strong>戰力</strong> — 攻${fmtStat(pet.atk)}${bonusLine(bonus.atk)} · 血${fmtStat(pet.hp)}${bonusLine(bonus.hp)} · 速${fmtStat(pet.spd)}${bonusLine(bonus.spd)}</li>
      ${
        base
          ? `<li><strong>種族基準</strong> — 攻${base.atk} 血${base.hp} 速${base.spd}（未計等級／融階）</li>`
          : ""
      }
      <li><strong>稀有</strong> — <span class="rarity rarity-${rarity.color}">${escapeHtml(rarity.name)}</span></li>
      <li><strong>融合出戰</strong> — ×${fmtMult(detail.fusionPowerMult || 1)}（融階 ${detail.fusionLevel || 0}）</li>
    </ul>
    <div class="pet-explain">
      <h3>種類 · ${escapeHtml(pet.kind)}</h3>
      <p class="meta">${escapeHtml(kindEx?.blurb || "種類決定主技能流派。")}${
        kindEx?.focus ? ` <span class="muted">偏向：${escapeHtml(kindEx.focus)}</span>` : ""
      }</p>
      ${
        kindEx?.skillName
          ? `<p class="meta">種類主技【${escapeHtml(kindEx.skillName)}】</p>`
          : ""
      }
    </div>
    <div class="pet-explain">
      <h3>元素 · ${escapeHtml(pet.elementName || elEx?.name || "—")}</h3>
      <p class="meta">${escapeHtml(elEx?.blurb || "元素影響白板同相剋。")}${
        elEx?.focus ? ` <span class="muted">偏向：${escapeHtml(elEx.focus)}</span>` : ""
      }</p>
      ${
        elEx
          ? `<p class="meta">白板倍率 攻${fmtGrowthMult(elEx.atk)} · 血${fmtGrowthMult(elEx.hp)} · 速${fmtGrowthMult(elEx.spd)}</p>
      <p class="meta">相剋：克${escapeHtml(elEx.beats)}（×${elEx.advMult}）· 被${escapeHtml(elEx.beatenBy)}克（×${elEx.disMult}）</p>
      <p class="meta muted">${escapeHtml(elEx.cycle)}</p>`
          : ""
      }
    </div>`;
}

function petDetailTemperHtml(pet) {
  const main = personalityExplain(pet.personalityId);
  const sub = pet.personality2Id ? personalityExplain(pet.personality2Id) : null;
  const blood =
    pet.bloodlineName && pet.bloodlineName !== "無紋"
      ? `<li><strong>血脈</strong> — ${escapeHtml(pet.bloodlineName)}</li>`
      : "";
  const block = (ex, tag) => {
    if (!ex) return "";
    return `
      <div class="pet-explain">
        <h3>${escapeHtml(tag)} · ${escapeHtml(ex.name)} ${
          ex.roleShort
            ? `<span class="pet-tag pet-tag-soul pet-tag-soul-${escapeHtml(ex.role)}" title="${escapeHtml(
                ex.roleLabel
              )}">${escapeHtml(ex.roleShort)}</span>`
            : `<span class="muted">（${escapeHtml(ex.roleLabel)}）</span>`
        }</h3>
        <p class="meta"><strong>戰鬥被動</strong> — ${escapeHtml(ex.combatLabel)}</p>
        <p class="meta">成長偏向 攻${fmtGrowthMult(ex.growthAtk)} · 血${fmtGrowthMult(ex.growthHp)} · 速${fmtGrowthMult(ex.growthSpd)}</p>
        ${ex.sustainBias ? `<p class="meta muted">續航親和：治療／減傷技較易惠及此寵</p>` : ""}
        <p class="meta muted">牧場產出 飼料×${(+ex.workFeed).toFixed(2)} · 靈塵×${(+ex.workDust).toFixed(2)} · 潮霧令×${(+ex.workToken).toFixed(2)}</p>
      </div>`;
  };
  return `
    <ul class="skill-list pet-detail-block">
      <li><strong>主性格</strong> — ${escapeHtml(pet.personalityName || main?.name || "—")}</li>
      ${
        pet.personality2Name
          ? `<li><strong>副性格</strong> — ${escapeHtml(pet.personality2Name)} <span class="muted">（戰鬥被動約三成比重）</span></li>`
          : `<li><strong>副性格</strong> — <span class="muted">未覺醒</span></li>`
      }
      ${blood}
    </ul>
    ${block(main, "主性格")}
    ${sub ? block(sub, "副性格") : ""}
    <p class="meta">可用性格洗劑重抽主性格（唔改種族／元素）。</p>`;
}

function petSkillCardHtml(skill, { level, maxed, dustCost, skillMatHtml, title }) {
  if (!skill) {
    return `<div class="pet-explain"><h3>${escapeHtml(title)}</h3><p class="meta muted">暫無技能資料。</p></div>`;
  }
  const pow = skill.power != null ? (skill.power * skillPowerMult(level || 1)).toFixed(2) : null;
  const lvBit =
    level != null
      ? `Lv.${level}${maxed ? "（滿）" : dustCost != null ? ` · 升需靈塵${dustCost}${skillMatHtml ? `＋${skillMatHtml}` : ""}` : ""}`
      : "";
  return `
    <div class="pet-explain">
      <h3>${escapeHtml(title)} · 【${escapeHtml(skill.name)}】</h3>
      ${lvBit ? `<p class="meta">${lvBit}</p>` : ""}
      <p class="meta">${escapeHtml(skill.desc || "效果未註明。")}</p>
      <p class="meta muted">${escapeHtml(skillTypeLabel(skill.type))} · CD${skill.cd ?? "—"}${
        pow != null ? ` · 威力約×${pow}` : ""
      }</p>
    </div>`;
}

function petDetailSkillsHtml(pet, detail) {
  const {
    skill,
    skillLevel,
    skillDustCost: dustCost,
    skillMatCost: skillMatsNeed,
    skillMaxed,
    secondSkill,
    secondUnlocked,
  } = detail;
  const skillMatHtml =
    skillMatsNeed && Object.keys(skillMatsNeed).length ? matAffordHtml(skillMatsNeed) : "";
  const unlockNeed = `融階≥${SECOND_SKILL_UNLOCK.fusionLevel} 或 Lv≥${SECOND_SKILL_UNLOCK.level}`;
  const secondBlock = secondUnlocked
    ? petSkillCardHtml(secondSkill, {
        level: skillLevel,
        maxed: skillMaxed,
        dustCost: null,
        skillMatHtml: "",
        title: "第二技能",
      })
    : `<div class="pet-explain">
        <h3>第二技能</h3>
        <p class="meta muted">未解鎖（${escapeHtml(unlockNeed)}）</p>
        ${
          secondSkill
            ? `<p class="meta">預覽【${escapeHtml(secondSkill.name)}】— ${escapeHtml(secondSkill.desc || "")}</p>`
            : ""
        }
      </div>`;
  return `
    ${petSkillCardHtml(skill || { name: pet.skillName || "—", desc: "", type: "", cd: null, power: null }, {
      level: skillLevel,
      maxed: skillMaxed,
      dustCost,
      skillMatHtml,
      title: "主技能",
    })}
    ${secondBlock}`;
}

function petsDetailView() {
  const detail = petDetail(state, petView.uid);
  if (!detail) {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [], detailTab: "stats" };
    return petsListView();
  }
  const {
    pet,
    deployed,
    upgradeCost,
    upgradeFeedCost: feedCost,
    fuseMaxed,
    skillMaxed,
  } = detail;
  const lv = pet.level ?? 1;
  const fus = pet.fusionLevel ?? 0;
  const r = rarityInfo(pet.rarity ?? 0);
  const g = petGeneration(pet);
  const busySet = new Set(dispatchView(state).busyUids || []);
  const onDispatch = !deployed && busySet.has(pet.uid);
  const loc = deployed ? "出戰中" : onDispatch ? "派遣中" : "牧場待命";
  const detailTab = petView.detailTab || "stats";
  const tabBody =
    detailTab === "temper"
      ? petDetailTemperHtml(pet)
      : detailTab === "skills"
        ? petDetailSkillsHtml(pet, detail)
        : petDetailStatsHtml(pet, detail, r);
  const lineage = petLineage(state, pet.uid);
  const soulGain = releaseSoulGain(pet);
  const starOn = !!pet.starred;
  const lockOn = !!pet.locked;
  const matingBusy = breedBusyUids(state).has(pet.uid);
  return wrapStage(
    "",
    `<div class="pet-detail-hero">
      ${petArtFromPet(pet, { size: 52, generation: g, className: "pet-art--detail" })}
      <div class="pet-detail-hero-text">
        <h2>${escapeHtml(displayPetName(pet))}${petFlagTags(pet)}${personalitySoulTagHtml(pet.personalityId)}</h2>
        <p class="lead">${escapeHtml(loc)} · ${genTagHtml(g)} · Lv.${lv} 融${fus}</p>
      </div>
    </div>
    ${petDetailTabNav(detailTab)}
    ${tabBody}
    <p class="meta pet-detail-upgrade"><strong>升級</strong> — ${upgradeCostLine(upgradeCost, feedCost, lv)}</p>
    ${lineageHtml(lineage)}
    <div class="row gear-row">
      <label>暱稱<input type="text" maxlength="${NICK_MAX_LEN}" data-nick-input value="${escapeHtml(pet.nick || "")}" placeholder="${escapeHtml(pet.name)}" /></label>
      <button type="button" data-rename="${escapeHtml(pet.uid)}">命名</button>
    </div>
    <div class="row pet-flag-row">
      <button type="button" class="secondary${starOn ? " on" : ""}" data-toggle-star="${escapeHtml(pet.uid)}">${
        starOn ? "★ 已星標" : "☆ 星標"
      }</button>
      <button type="button" class="secondary${lockOn ? " on" : ""}" data-toggle-lock="${escapeHtml(pet.uid)}">${
        lockOn ? "已上鎖" : "上鎖"
      }</button>
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
          : `<button type="button" data-deploy="${escapeHtml(pet.uid)}" ${matingBusy ? "disabled" : ""} title="${
              matingBusy ? "交配孕育中" : ""
            }">出戰</button>`
      }
      <button type="button" data-release="${escapeHtml(pet.uid)}" ${lockOn || matingBusy ? "disabled" : ""} title="${
        matingBusy ? "交配孕育中，唔可以放生" : lockOn ? "已上鎖，唔可以放生" : `放生獲精魂 ${soulGain}`
      }">${matingBusy ? "交配中" : lockOn ? "已上鎖" : `放生（精魂${soulGain}）`}</button>
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
        const r = rarityInfo(p.rarity ?? 0);
        return petPickCard(p, {
          selected: on,
          btnLabel: on ? "已選" : "選擇",
          btnClass: on ? "primary" : "secondary",
          btnAttr: `data-fuse-toggle="${escapeHtml(p.uid)}"`,
          meta: `<span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · 素材 · 融${p.fusionLevel ?? 0} · 攻${fmtInt(p.atk)}`,
        });
      })
      .join("") ||
    `<li class="empty pet-pick-empty">沒有同種族（${escapeHtml(base.speciesName)}）可作素材。</li>`;

  const ready = lvOk && selected.size === needMats;
  return wrapStage(
    "",
    `<h2>融合（終身一次）</h2>
    <p class="lead">主體 ${escapeHtml(base.name)} Lv.${baseLv}${lvOk ? "" : `（需 ≥${needLv}）`} · 素材 ${selected.size}/${needMats}（皆需 Lv≥${needLv}）· 耗融合核×1</p>
    <p class="meta muted">每隻寵物只有一次融合機會；素材能力愈高結果愈好。</p>
    <ul class="pet-pick-grid fuse-mat-list">${mats}</ul>`,
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
        <div class="codex-icon">${unlocked ? petArtHtml(s.speciesId, { size: 36 }) : `<span class="pet-art pet-art-unknown"><span class="pet-icon pet-icon-unknown">?</span></span>`}</div>
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

function abyssNextFloorNote(next) {
  if (!next) return "";
  if (next.willAddMutation) return "將加入 1 條新突變";
  if (next.insuranceSkips) return "突變保險將略過新突變";
  if (next.mutationFloor) return "突變層（無新增）";
  return "本層無新突變";
}

function abyssRosterMiniHtml(roster) {
  if (!roster) return "";
  const row = (list, label) => {
    const bits = (list || [])
      .map((p) => {
        const hp = `${p.hp}/${p.maxHp}`;
        const dead = p.dead ? " · 陣亡" : "";
        return `<li><strong>${escapeHtml(p.name)}</strong><span class="muted"> ${hp}${dead}</span></li>`;
      })
      .join("");
    return `<div class="abyss-roster-col"><span class="muted">${label}</span><ul class="abyss-roster-list">${bits || "<li class='empty'>—</li>"}</ul></div>`;
  };
  return `<div class="abyss-roster-mini">${row(roster.active, "出戰")} ${row(roster.bench, "替補")}</div>`;
}

function abyssEventHtml(pendingEvent) {
  if (!pendingEvent?.options?.length) return "";
  const opts = pendingEvent.options
    .map(
      (o) => `<button type="button" class="secondary abyss-event-opt" data-abyss-event="${escapeHtml(o.type)}">
        <strong>${escapeHtml(o.name)}</strong>
        <span class="muted">${escapeHtml(o.desc || "")}</span>
      </button>`
    )
    .join("");
  return `<div class="abyss-event-block">
      <p class="lead">潮淵事件 · 2 選 1</p>
      <p class="meta muted">第 ${pendingEvent.depth | 0} 層通關獎勵——揀一項先至可以續潛。</p>
      <div class="abyss-event-opts">${opts}</div>
    </div>`;
}

function abyssRearrangeHtml(roster) {
  if (!roster?.squad?.length) return "";
  const pick = new Set(abyssRearrangePick || (roster.active || []).map((p) => p.uid));
  const rows = (roster.squad || [])
    .map((p) => {
      const on = pick.has(p.uid);
      const dead = p.dead ? "disabled" : "";
      return `<li class="card-row">
        <div><strong>${escapeHtml(p.name)}</strong><span class="muted"> ${p.hp}/${p.maxHp}${p.dead ? " · 陣亡" : ""}</span></div>
        <button type="button" class="${on ? "primary" : "secondary"}" data-abyss-rearrange-toggle="${escapeHtml(p.uid)}" ${dead}>${
          on ? "出戰" : "替補"
        }</button>
      </li>`;
    })
    .join("");
  return `<div class="abyss-rearrange-block">
      <p class="lead">整理隊伍 · 揀最多 3 隻出戰</p>
      <ul class="list">${rows}</ul>
      <div class="row">
        <button type="button" class="primary" data-act="abyss-rearrange-confirm">確認編隊</button>
        <button type="button" data-act="abyss-rearrange-cancel">取消</button>
      </div>
    </div>`;
}

function abyssSettlementHtml(result) {
  if (!isAbyssCombat(result)) return "";
  const muts = result.mutations || [];
  const mutLine = muts.length
    ? muts.map((m) => `【${escapeHtml(m.name)}】${escapeHtml(m.desc || "")}`).join("<br/>")
    : "尚無突變";
  const buffs = result.diveBuffList || result.diveBuffs?.map?.((id) => null) || [];
  const buffList = result.diveBuffList
    || (Array.isArray(result.diveBuffs) ? result.diveBuffs.map((id) => (typeof id === "object" ? id : null)).filter(Boolean) : [])
    || [];
  const liveBuffs = abyssDiveView(state).run?.diveBuffList || buffList;
  const buffLine = (liveBuffs || []).length
    ? liveBuffs.map((b) => `【${escapeHtml(b.name)}】${escapeHtml(b.desc || "")}`).join("<br/>")
    : "尚無本潛增益";
  if (result.wiped || !result.won) {
    const failed = result.failedDepth || result.depth || 0;
    const cleared = result.clearedDepth | 0;
    const kept = result.gritKept ?? result.gritGained ?? 0;
    const pendingBefore = result.pendingBefore | 0;
    return `
      <div class="abyss-settle abyss-settle--wipe">
        <p class="lead">第 <strong>${failed}</strong> 層挑戰失敗</p>
        <p class="meta">此前已通第 ${cleared} 層 · 保底帶回淵砂 <strong>${kept}</strong>${
          pendingBefore ? `（原待結算 ${pendingBefore}）` : ""
        }</p>
        <p class="meta">本趟突變：</p>
        <p class="meta abyss-mut-list">${mutLine}</p>
        <p class="meta">本潛增益：</p>
        <p class="meta abyss-mut-list">${buffLine}</p>
        <p class="meta muted">深潛已結束——請確認結算後返回。</p>
      </div>`;
  }
  const next = result.nextFloor;
  const nextNote = abyssNextFloorNote(next);
  const liveRun = abyssDiveView(state).run;
  const pendingEvent = liveRun?.pendingEvent || result.pendingEvent || null;
  const roster = liveRun?.roster || result.roster || null;
  const eventBlock = pendingEvent ? abyssEventHtml(pendingEvent) : "";
  const rearrangeBlock = abyssRearrangePick ? abyssRearrangeHtml(roster) : "";
  const rosterMini = !abyssRearrangePick && roster ? abyssRosterMiniHtml(roster) : "";
  return `
    <div class="abyss-settle">
      <p class="lead">已通關第 <strong>${result.clearedDepth || result.depth}</strong> 層</p>
      <div class="settle-summary-row abyss-grit-row">
        <div>
          <strong class="settle-total">淵砂 +${result.gritGained || 0}</strong>
          <span class="muted">待結算累計 ${result.pendingGrit || 0} · 層間唔回滿血</span>
        </div>
      </div>
      <p class="meta">活躍突變：</p>
      <p class="meta abyss-mut-list">${mutLine}</p>
      <p class="meta">本潛增益：</p>
      <p class="meta abyss-mut-list">${buffLine}</p>
      ${rosterMini}
      ${eventBlock}
      ${rearrangeBlock}
      <div class="abyss-next-preview">
        <strong>下一層預覽 · 第 ${next?.depth ?? (result.depth | 0) + 1} 層</strong>
        <span class="muted">${escapeHtml(nextNote)}</span>
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
  const result = playback.result;
  const isAbyss = isAbyssCombat(result);
  const bd = result?.rewardBreakdown;
  const wonSettle = playback.done && bd && result.won && !isAbyss;
  const settleHead = wonSettle
    ? `<div class="settle-summary-row">
        <div>
          <strong class="settle-total">+${bd.totalStones} 靈石</strong>
          <span class="muted">${bd.base?.scrap ? `普通碎片 +${bd.base.scrap}` : "通關結算"}</span>
        </div>
        <button type="button" class="ghost" data-act="toggle-reward-details">${rewardDetailsOpen ? "收起明細" : "獎勵明細"}</button>
      </div>
      ${rewardDetailsOpen ? combatRewardBreakdownHtml(bd) : ""}`
    : "";
  const abyssSettle = playback.done && isAbyss ? abyssSettlementHtml(result) : "";
  const logBlock = playback.done
    ? ""
    : `<div class="combat-scroll combat-log-fixed" data-live="combat-scroll">
        <ul class="combat" data-live="combat-log">${lines}</ul>
      </div>`;
  const tacticsStep = tutorialActive(state) && state.tutorial.step === "tactics";
  const isTrain = result?.combatKind === "train";
  const clearLabel = tacticsStep
    ? "前往戰術設定"
    : isTrain
      ? "返回練功"
      : isAbyss
        ? "返回潮淵"
        : "返回秘境";
  const clearAct = tacticsStep ? "clear-combat-setup" : "clear-combat";
  const title = playback.done
    ? isAbyss
      ? result?.wiped || !result?.won
        ? "潮淵結算 · 挑戰失敗"
        : "潮淵結算 · 層通關"
      : "結算"
    : isAbyss
      ? `戰報 · 第 ${result?.depth || "?"} 層`
      : "戰報";
  const cardClass = `combat-modal-card combat-report-card${
    isAbyss ? " combat-report-card--abyss" : ""
  }${playback.done && isAbyss ? " combat-report-card--abyss-settle" : ""}`;
  let actions = "";
  if (!playback.done) {
    actions = `
          <button type="button" data-act="skip-combat">跳過動畫</button>
          <button type="button" class="primary" data-act="${clearAct}" disabled>${escapeHtml(clearLabel)}</button>`;
  } else if (isAbyss && result?.won && !result?.wiped && result?.canContinue) {
    const liveRun = abyssDiveView(state).run;
    const needEvent = !!liveRun?.pendingEvent;
    const contDisabled = needEvent || !!abyssRearrangePick ? "disabled" : "";
    actions = `
          <button type="button" class="primary" data-act="abyss-continue-floor" ${contDisabled}>${
            needEvent ? "先揀事件" : "繼續下一層"
          }</button>
          <button type="button" class="secondary" data-act="abyss-open-rearrange" ${
            abyssRearrangePick || needEvent ? "disabled" : ""
          }>整理隊伍</button>
          <button type="button" class="secondary" data-act="abyss-retreat-settle">撤退結算</button>
          <button type="button" data-act="${clearAct}">${escapeHtml(clearLabel)}</button>`;
  } else if (isAbyss) {
    actions = `
          <button type="button" class="primary" data-act="${clearAct}">${escapeHtml(clearLabel)}</button>`;
  } else {
    actions = `
          <button type="button" data-act="skip-combat" hidden>跳過動畫</button>
          <button type="button" class="primary" data-act="${clearAct}">${escapeHtml(clearLabel)}</button>`;
  }
  return `
    <div class="combat-modal-overlay" data-live="combat-modal" role="dialog" aria-label="${escapeHtml(title)}">
      <div class="${cardClass}">
        <div class="combat-modal-scroll">
          <h2>${escapeHtml(title)}${playback.isFarm && combatPrefs.fastMode ? `<span class="combat-fast-badge">快速</span>` : ""}</h2>
          ${playback.waveLabel && !playback.done ? `<p class="combat-wave-banner" data-live="combat-wave">${escapeHtml(playback.waveLabel)}</p>` : `<p class="combat-wave-banner" data-live="combat-wave" hidden></p>`}
          ${logBlock}
          <p class="lead combat-round-meta" data-live="combat-meta">${escapeHtml(combatPlaybackMeta(playback))}</p>
          <div class="bar combat-bar"><i data-live="combat-bar" style="width:${pct}%"></i></div>
          ${renderCombatRoster(playback)}
          ${playback.skipped && playback.skipSummary ? skipSummaryHtml(playback.skipSummary) : ""}
          ${settleHead}
          ${abyssSettle}
        </div>
        <div class="combat-modal-actions row">${actions}
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



function softLaunchBannerHtml() {
  if (softLaunchDismissed) return "";
  return `<div class="sys-banner soft-launch-banner" data-live="soft-launch">
    <div>
      <strong>軟啟動測試版</strong>
      <p class="meta">10–30 人邀請制 · 請回報死掣／卡教學／舊快取。建置 ${escapeHtml(APP_BUILD)}</p>
    </div>
    <button type="button" class="ghost" data-act="dismiss-soft-launch">知道了</button>
  </div>`;
}

function updateNoticeBannerHtml() {
  if (updateNoticeDismissed) return "";
  const n = updateNoticeView();
  return `<div class="sys-banner update-notice-banner" data-live="update-notice">
    <div>
      <strong>${escapeHtml(n.title)} · ${escapeHtml(n.build)}</strong>
      <p class="meta">${escapeHtml(n.body)}</p>
      <p class="meta">若見舊版：iOS Safari 用「重新載入唔用快取」／Chrome 硬刷新。</p>
    </div>
    <button type="button" class="ghost" data-act="dismiss-update-notice">已更新</button>
  </div>`;
}

function swRefreshBannerHtml() {
  return `<div class="sys-banner sw-refresh-banner" data-live="sw-refresh" hidden>
    <div>
      <strong>有新版本</strong>
      <p class="meta">已下載更新。請硬刷新以載入最新（否則可能仲係舊快取）。</p>
    </div>
    <button type="button" class="primary" data-act="hard-refresh">硬刷新</button>
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
  const buffLine = run?.diveBuffList?.length
    ? run.diveBuffList.map((b) => `【${escapeHtml(b.name)}】`).join("")
    : "無";
  let runBlock;
  if (run) {
    const needEvent = !!run.pendingEvent;
    const roster = abyssRosterMiniHtml(run.roster);
    const eventBlock = needEvent ? abyssEventHtml(run.pendingEvent) : "";
    const rearrangeBlock = abyssRearrangePick ? abyssRearrangeHtml(run.roster) : "";
    runBlock = `<div class="abyss-run card-block">
        <p class="lead">進行中 · 已通第 <strong>${run.depth}</strong> 層 · 待結算淵砂 <strong>${run.pendingGrit}</strong></p>
        <p class="meta">下一挑戰：第 <strong>${(run.depth | 0) + 1}</strong> 層 · 本潛增益：${buffLine}</p>
        <p class="meta">突變：${mutLine}</p>
        ${roster}
        ${eventBlock}
        ${rearrangeBlock}
        <div class="row">
          <button type="button" class="primary" data-abyss-advance ${needEvent || abyssRearrangePick ? "disabled" : ""}>${
            needEvent ? "先揀事件" : `挑戰第 ${(run.depth | 0) + 1} 層`
          }</button>
          <button type="button" class="secondary" data-act="abyss-open-rearrange" ${
            abyssRearrangePick || needEvent ? "disabled" : ""
          }>整理隊伍</button>
          <button type="button" class="secondary" data-abyss-retreat>撤退結算</button>
        </div>
      </div>`;
  } else if (abyssSquadPick) {
    const pick = new Set(abyssSquadPick);
    const cands = abyssSquadCandidates(state);
    const rows = cands
      .map((p) => {
        const on = pick.has(p.uid);
        const r = rarityInfo(p.rarity ?? 0);
        return petPickCard(p, {
          selected: on,
          btnLabel: on ? "已選" : "選擇",
          btnAttr: `data-abyss-squad-toggle="${escapeHtml(p.uid)}"`,
          meta: `<span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${escapeHtml(p.elementName || "")} · Lv.${p.level ?? 1} · 攻${p.atk} 血${p.hp}`,
        });
      })
      .join("") || `<li class="empty pet-pick-empty">冇可用靈寵。</li>`;
    runBlock = `<div class="abyss-run card-block">
        <p class="lead">編組潮淵隊 · ${pick.size}/${v.squadSize}</p>
        <p class="meta">揀 ${v.squadSize} 隻（前 ${v.activeSize} 出戰，其餘替補）。層間唔回滿血。</p>
        <ul class="pet-pick-grid">${rows}</ul>
        <div class="row">
          <button type="button" class="primary" data-abyss-start ${pick.size === v.squadSize ? "" : "disabled"}>確認開潛</button>
          <button type="button" data-act="abyss-squad-cancel">取消</button>
        </div>
      </div>`;
  } else {
    runBlock = `<div class="abyss-run card-block">
        <p class="lead">未開潛</p>
        <p class="meta">今日首趟免費 · 其後耗潮霧令 ×${v.entryCost || 1}（現有 ${v.tokenHave}）</p>
        <p class="meta">需獨立編隊 ${v.squadSize} 寵（3 出戰 + 2 替補）· 現有 ${v.ownedCount} 隻</p>
        <button type="button" class="primary" data-act="abyss-open-squad" ${
          v.canFormSquad ? "" : "disabled"
        }>${v.canFormSquad ? "開始深潛（編隊）" : `靈寵不足（需 ${v.squadSize}）`}</button>
      </div>`;
  }
  return `<h2>潮淵深潛</h2>
    <p class="lead">無限層 · 突變規則</p>
    <p class="meta">淵砂 <strong>${v.gritHave}</strong> · 最深 ${v.bestDepth} · 本週 ${v.weekBestDepth}</p>
    <details class="abyss-rules">
      <summary>潮淵規則（必讀）</summary>
      <pre class="abyss-rules-body">${escapeHtml(ABYSS_RULES_TEXT)}</pre>
    </details>
    ${runBlock}`;
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

function executeDungeonAttack(dungeonId, mode, opts = {}) {
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
  const r = runDungeon(state, dungeonId, opts);
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
  // 練功主脊打完後留喺練功，睇到下一關
  if (opts.trainSpine) {
    tab = "cultivate";
    panelSub = { ...panelSub, cultivate: "train" };
  }
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
    </div>
    <div class="save-tools card-block">
      <h3>存檔備份</h3>
      <p class="meta">本機 localStorage · 換機／清瀏覽器前請匯出。建置 ${escapeHtml(APP_BUILD)}</p>
      <div class="row log-tools">
        <button type="button" class="secondary" data-act="export-save">匯出存檔</button>
        <button type="button" class="ghost" data-act="import-save">匯入存檔</button>
      </div>
      <textarea class="save-io" data-save-io hidden rows="4" placeholder="貼上匯出嘅 JSON 存檔…"></textarea>
    </div>`
  );
}

function playAbyssResult(r) {
  saveState(state);
  panelSub = { ...panelSub, dungeon: "abyss" };
  if (!r.ok) {
    setFlash(r.msg);
    render();
    return;
  }
  // 潮淵勝負都要進戰報／結算窗，唔好淨係 flash 返秘境
  if (r.combatEvents?.length || r.combatKind === "abyss") {
    if (!r.combatEvents?.length) {
      r = {
        ...r,
        combatEvents: [{ type: "text", text: r.msg || "潮淵結算" }],
      };
    }
    startPlayback(r);
    return;
  }
  render();
  setFlash(r.msg || "");
}

function switchPanelSub(group, id) {
  if (!group || !id) return false;
  if (panelSub[group] === id) return false;
  const block = panelSubSwitchBlockReason(group, id);
  if (block) {
    if (block.includes("卡住") && recoverStuckPlayback()) {
      render();
    } else {
      setFlash(block);
      return false;
    }
  }
  const block2 = panelSubSwitchBlockReason(group, id);
  if (block2) {
    setFlash(block2);
    return false;
  }
  if (playback?.done) stopPlayback();
  // 切去潮淵：先清全屏遮罩，再改 sub（避免隱形層吞掉第一次點擊）
  if (group === "dungeon" && id === "abyss") {
    clearUiOverlays({ clearPlayback: false });
  } else if (group === "dungeon") {
    condSheetOpen = false;
  }
  panelSub = { ...panelSub, [group]: id };
  if (group === "party" && id !== "ranch") ranchRelease = null;
  markTutorialSubVisit(group, id);
  try {
    render();
  } catch (err) {
    console.error("switchPanelSub render failed", group, id, err);
    setFlash(`切換失敗：${err?.message || err}`);
    return false;
  }
  if (group === "dungeon" && id === "abyss") {
    if (recoverStuckPlayback()) render();
  }
  return true;
}

function bind() {
  app.querySelectorAll("[data-panel-sub]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (btn.disabled) return;
      const [group, id] = (btn.dataset.panelSub || "").split(":");
      switchPanelSub(group, id);
    });
  });
  app.querySelectorAll("[data-bag-inner]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.bagInner;
      if (id !== "mats" && id !== "items") return;
      if (bagInner === id) return;
      bagInner = id;
      saveUiPrefs();
      render();
    });
  });
  app.querySelectorAll("[data-shop-inner]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.shopInner;
      if (id !== "stones" && id !== "soul" && id !== "grit") return;
      if (shopInner === id) return;
      shopInner = id;
      saveUiPrefs();
      render();
    });
  });
  app.querySelectorAll("[data-use-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const id = btn.dataset.useItem;
      if (!id) return;
      if (id === "tide_shift_charm") {
        tideShiftModal = { source: "bag" };
        render();
        return;
      }
      const r = useBagItem(state, id);
      saveState(state);
      render();
      setFlash(r.msg || "");
    });
  });
  app.querySelectorAll("[data-tide-shift-pet]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const uid = btn.dataset.tideShiftPet;
      if (!uid) return;
      const r = useTideShiftCharm(state, uid);
      if (r.ok) tideShiftModal = null;
      saveState(state);
      render();
      setFlash(r.msg || "");
    });
  });
  app.querySelectorAll("[data-abyss-buy-shift]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssTideShiftCharm(state);
      saveState(state);
      render();
      setFlash(r.msg || "");
    });
  });
  app.querySelectorAll("[data-ranch-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.ranchSort;
      if (!["power", "gen", "rarity", "element", "status", "star", "level"].includes(id)) return;
      if (ranchSort === id) return;
      ranchSort = id;
      saveUiPrefs();
      render();
    });
  });
  app.querySelectorAll("[data-ranch-star-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ranchStarOnly = !ranchStarOnly;
      saveUiPrefs();
      render();
    });
  });
  app.querySelectorAll("[data-ranch-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || ranchRelease?.phase !== "select") return;
      const uid = btn.dataset.ranchPick;
      if (!uid) return;
      const found = (state.ranch || []).find((p) => p.uid === uid);
      if (!found || found.locked) {
        setFlash(found?.locked ? "已上鎖，唔可以揀。" : "找不到靈寵。");
        return;
      }
      const selected = new Set(ranchRelease.selected || []);
      if (selected.has(uid)) selected.delete(uid);
      else selected.add(uid);
      ranchRelease = { phase: "select", selected: [...selected] };
      renderPreservingStageScroll();
    });
  });
  app.querySelectorAll("[data-toggle-star]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = togglePetStarred(state, btn.dataset.toggleStar);
      saveState(state);
      if (tab === "party" && panelSub.party === "ranch") renderPreservingStageScroll();
      else render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-toggle-lock]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = togglePetLocked(state, btn.dataset.toggleLock);
      saveState(state);
      if (tab === "party" && panelSub.party === "ranch") renderPreservingStageScroll();
      else render();
      setFlash(r.msg);
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
      } else if (act === "open-offline-claim") {
        offlineClaimOpen = true;
        render();
      } else if (act === "close-offline-claim") {
        offlineClaimOpen = false;
        render();
      } else if (act === "goto-party-fight") {
        tab = "party";
        panelSub = { ...panelSub, party: "fight" };
        render();
      } else if (act === "open-bond-sheet") {
        bondSheetOpen = true;
        render();
      } else if (act === "close-bond-sheet") {
        bondSheetOpen = false;
        render();
      } else if (act === "goto-breakthrough") {
        bondSheetOpen = false;
        tab = "cultivate";
        panelSub = { ...panelSub, cultivate: "advance" };
        render();
      } else if (act === "close-hatch-claim") {
        hatchClaimModal = null;
        render();
      } else if (act === "close-release-modal") {
        releaseModal = null;
        render();
      } else if (act === "close-fuse-confirm") {
        fuseConfirmModal = null;
        render();
      } else if (act === "confirm-fuse") {
        if (!fuseConfirmModal?.baseUid) return;
        const baseUid = fuseConfirmModal.baseUid;
        const mats = fuseConfirmModal.matUids || [];
        const r = fusePets(state, baseUid, mats);
        saveState(state);
        fuseConfirmModal = null;
        if (r.ok) {
          petView = { mode: "detail", uid: baseUid, fuseBase: null, fuseMats: [], breedParents: [], detailTab: "stats" };
          if (tutorialActive(state)) {
            const adv = advanceTutorialIfReady(state);
            if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
          }
        }
        render();
        flashResult(r);
      } else if (act === "close-tide-shift-modal") {
        tideShiftModal = null;
        render();
      } else if (act === "open-tide-shift") {
        if (Math.floor(state.items?.tide_shift_charm || 0) < 1) {
          setFlash("沒有潮轉符。");
          return;
        }
        tideShiftModal = { source: "abyss" };
        render();
      } else if (act === "confirm-release") {
        if (!releaseModal?.uids?.length) return;
        const fromDetail = !!releaseModal.fromDetail;
        const r = releasePets(state, releaseModal.uids);
        saveState(state);
        releaseModal = null;
        ranchRelease = null;
        if (fromDetail || r.ok) {
          petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [], detailTab: "stats" };
        }
        render();
        setFlash(r.msg);
      } else if (act === "ranch-release-start") {
        ranchRelease = { phase: "select", selected: [] };
        releaseModal = null;
        render();
      } else if (act === "ranch-cull-open" || act === "hatch-open-cull") {
        openRanchCullSelect(act === "hatch-open-cull" ? 2 : 1);
      } else if (act === "ranch-cull-suggest") {
        if (ranchRelease?.phase !== "select") return;
        const more = suggestRanchCullUids(state, 3);
        const selected = new Set(ranchRelease.selected || []);
        for (const uid of more) selected.add(uid);
        ranchRelease = { phase: "select", selected: [...selected] };
        render();
      } else if (act === "ranch-release-cancel") {
        ranchRelease = null;
        render();
      } else if (act === "ranch-release-next") {
        if (ranchRelease?.phase !== "select" || !(ranchRelease.selected || []).length) return;
        const prev = previewReleaseSoul(state, ranchRelease.selected);
        if (!prev.ok) {
          setFlash(prev.msg);
          return;
        }
        ranchRelease = { phase: "confirm", selected: [...ranchRelease.selected] };
        render();
      } else if (act === "ranch-release-back") {
        if (ranchRelease?.phase === "confirm") {
          ranchRelease = { phase: "select", selected: [...(ranchRelease.selected || [])] };
        } else {
          ranchRelease = null;
        }
        render();
      } else if (act === "ranch-release-confirm") {
        if (ranchRelease?.phase !== "confirm" || !(ranchRelease.selected || []).length) return;
        const r = releasePets(state, ranchRelease.selected);
        saveState(state);
        ranchRelease = null;
        releaseModal = null;
        render();
        setFlash(r.msg);
      } else if (act === "claim-offline") {
        const r = claimOfflineBank(state);
        if (r.ok) offlineClaimOpen = false;
        saveState(state);
        render();
        setFlash(r.msg, r.ok ? "unlock" : "");
      } else if (act === "skip-tutorial" || act === "collapse-tutorial" || act === "expand-tutorial") {
        // 交由 document 委派 onTutorialBannerClick（live patch 換 DOM 後仍可用）
        return;
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
          if (p === "granted" && (state.offlineHint || offlineBankView(state).hasPending)) {
            maybeNotifyOffline(state.offlineHint || offlineBankView(state));
          }
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

      } else if (act === "dismiss-soft-launch") {
        softLaunchDismissed = true;
        sessionStorage.setItem("void-tide-soft-launch-dismiss", "1");
        render();
      } else if (act === "dismiss-update-notice") {
        updateNoticeDismissed = true;
        localStorage.setItem(`void-tide-update-seen:${APP_BUILD}`, "1");
        render();
      } else if (act === "hard-refresh") {
        if (navigator.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
        }
        const url = new URL(location.href);
        url.searchParams.set("v", APP_BUILD);
        location.href = url.toString();
      } else if (act === "export-save") {
        const json = exportSaveJson(state);
        const ta = document.querySelector("[data-save-io]");
        if (ta) {
          ta.hidden = false;
          ta.value = json;
          ta.focus();
          ta.select();
        }
        try {
          const blob = new Blob([json], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `void-tide-save-${APP_BUILD}.json`;
          a.click();
          URL.revokeObjectURL(a.href);
        } catch (_) {}
        setFlash("已匯出存檔（可複製文字或下載檔）。");
      } else if (act === "import-save") {
        const ta = document.querySelector("[data-save-io]");
        if (ta && ta.hidden) {
          ta.hidden = false;
          ta.focus();
          setFlash("請貼上匯出嘅 JSON，再撳一次「匯入存檔」。");
        } else {
          const raw = ta?.value || "";
          const r = importSaveJson(raw);
          if (!r.ok) {
            setFlash(r.msg);
          } else {
            state = r.state;
            setFlash(r.msg);
            render();
          }
        }

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
        if (r.ok) panelSub = { ...panelSub, party: "dispatch" };
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
      } else if (act === "abyss-continue-floor") {
        if (!playback?.done || !isAbyssCombat(playback.result)) return;
        if (abyssDiveView(state).run?.pendingEvent) {
          setFlash("請先揀潮淵事件（2 選 1）。");
          return;
        }
        if (abyssRearrangePick) {
          setFlash("請先確認或取消整理隊伍。");
          return;
        }
        stopPlayback();
        rewardDetailsOpen = false;
        abyssRearrangePick = null;
        panelSub = { ...panelSub, dungeon: "abyss" };
        playAbyssResult(advanceAbyssDive(state));
      } else if (act === "abyss-retreat-settle") {
        if (!playback?.done || !isAbyssCombat(playback.result)) return;
        stopPlayback();
        rewardDetailsOpen = false;
        abyssRearrangePick = null;
        const r = retreatAbyssDive(state);
        saveState(state);
        panelSub = { ...panelSub, dungeon: "abyss" };
        render();
        setFlash(r.msg || "已撤退結算");
      } else if (act === "abyss-open-squad") {
        if (!abyssDiveView(state).canFormSquad) {
          setFlash("靈寵不足，無法組成潮淵編隊。");
          return;
        }
        abyssSquadPick = [];
        render();
      } else if (act === "abyss-squad-cancel") {
        abyssSquadPick = null;
        render();
      } else if (act === "abyss-open-rearrange") {
        const roster = abyssDiveView(state).run?.roster;
        if (!roster?.squad?.length) {
          setFlash("冇可整理嘅編隊。");
          return;
        }
        abyssRearrangePick = (roster.active || []).map((p) => p.uid);
        render();
      } else if (act === "abyss-rearrange-cancel") {
        abyssRearrangePick = null;
        render();
      } else if (act === "abyss-rearrange-confirm") {
        const r = rearrangeAbyssSquad(state, abyssRearrangePick || []);
        if (r.ok) {
          abyssRearrangePick = null;
          if (playback?.result && isAbyssCombat(playback.result)) {
            playback.result = { ...playback.result, roster: r.roster };
          }
        }
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "toggle-cond-sheet") {
        condSheetOpen = !condSheetOpen;
        render();
      } else if (act === "close-cond-sheet") {
        condSheetOpen = false;
        render();
      } else if (act === "toggle-reward-details") {
        rewardDetailsOpen = !rewardDetailsOpen;
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
      bondSheetOpen = false;
      dispatchModal = null;
      attackPreview = null;
      tideShiftModal = null;
      render();
    });
  });
  // 戰報遮罩：點暗位 → 已結算可關閉；卡住時由 Escape／底欄救回
  app.querySelectorAll("[data-live=combat-modal]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target !== el) return;
      if (!playback) return;
      if (!playback.done) {
        setFlash("戰鬥中");
        return;
      }
      clearCombatPlayback();
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
      const n = clampBreedBatchCount(btn.dataset.breedCount || breedCount);
      const r = tryBreed(state, a, b, n);
      saveState(state);
      if (r.ok) {
        // 開始交配＝進孕育欄（似秘境召喚），唔即出蛋
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
      if (r.ok) petView = { ...petView, detailTab: "skills" };
      saveState(state);
      render();
      flashResult(r);
    });
  });
  app.querySelectorAll("[data-temper-oil]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = useTemperOil(state, btn.dataset.temperOil);
      if (r.ok) petView = { ...petView, detailTab: "temper" };
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
      if (btn.disabled) return;
      const uid = btn.dataset.release;
      const prev = previewReleaseSoul(state, [uid]);
      if (!prev.ok) {
        setFlash(prev.msg);
        return;
      }
      releaseModal = { uids: [uid], fromDetail: true };
      render();
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
  app.querySelectorAll("[data-soul-shop-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buySoulShopOffer(state, btn.dataset.soulShopBuy);
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
      idleCombat = null;
      clearTrainIdleCombatState(state);
      cancelIdleAnim();
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  // 側枝戰鬥入口已移除；材料提示用 data-goto-train 指主脊
  app.querySelectorAll("[data-train-floor-prev]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = navTrainIdleFloor(state, -1);
      if (r.ok) {
        idleCombat = null;
        clearTrainIdleCombatState(state);
      }
      saveState(state);
      panelSub = { ...panelSub, cultivate: "train" };
      render();
      setFlash(r.msg, r.ok ? "unlock" : "");
    });
  });
  app.querySelectorAll("[data-train-floor-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = navTrainIdleFloor(state, 1);
      if (r.ok) {
        idleCombat = null;
        clearTrainIdleCombatState(state);
      }
      saveState(state);
      panelSub = { ...panelSub, cultivate: "train" };
      render();
      setFlash(r.msg, r.ok ? "unlock" : "");
    });
  });
  app.querySelectorAll("[data-abyss-start]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const pick = abyssSquadPick || [];
      const r = startAbyssDive(state, pick);
      if (!r.ok) {
        setFlash(r.msg);
        render();
        return;
      }
      abyssSquadPick = null;
      playAbyssResult(r);
    });
  });
  app.querySelectorAll("[data-abyss-squad-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!Array.isArray(abyssSquadPick)) abyssSquadPick = [];
      const uid = btn.dataset.abyssSquadToggle;
      const set = new Set(abyssSquadPick);
      const need = abyssDiveView(state).squadSize || 5;
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= need) {
          setFlash(`最多揀 ${need} 隻。`);
          return;
        }
        set.add(uid);
      }
      abyssSquadPick = [...set];
      render();
    });
  });
  app.querySelectorAll("[data-abyss-rearrange-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (!Array.isArray(abyssRearrangePick)) abyssRearrangePick = [];
      const uid = btn.dataset.abyssRearrangeToggle;
      const set = new Set(abyssRearrangePick);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= 3) {
          setFlash("出戰最多 3 隻。");
          return;
        }
        set.add(uid);
      }
      abyssRearrangePick = [...set];
      render();
    });
  });
  app.querySelectorAll("[data-abyss-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.abyssEvent;
      const r = resolveAbyssEvent(state, type);
      if (r.ok && playback?.result && isAbyssCombat(playback.result)) {
        playback.result = {
          ...playback.result,
          pendingEvent: null,
          roster: r.roster || playback.result.roster,
        };
      }
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-abyss-advance]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      playAbyssResult(advanceAbyssDive(state));
    });
  });
  app.querySelectorAll("[data-abyss-retreat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = retreatAbyssDive(state);
      abyssRearrangePick = null;
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
  app.querySelectorAll("[data-abyss-fusion-core]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssFusionCore(state);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-abyss-power-node]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = buyAbyssPowerNode(state);
      saveState(state);
      render();
      setFlash(r.msg);
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
      if (!dispatchModal || btn.disabled) return;
      const mission = dispatchView(state).missions.find((m) => m.id === dispatchModal.missionId);
      if (!mission) return;
      const need = mission.needPets;
      const uid = btn.dataset.dispatchPick;
      const pet = (state.ranch || []).find((p) => p.uid === uid);
      if (pet && !petMatchesDispatchMission(pet, mission)) {
        setFlash(mission.reqLabel ? `要揀${mission.reqLabel.replace(/^需/, "")}嘅靈寵。` : "呢隻唔符合任務限制。");
        return;
      }
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
      if (r.ok && r.boardFilledName) setFlash(`${r.msg} · 新任務【${r.boardFilledName}】上板`);
      else setFlash(r.msg);
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
      if (r.ok && r.pet) {
        hatchClaimModal = {
          pets: [r.pet],
          reveals: r.reveal ? [r.reveal] : [],
          celebrate: !!r.celebrate,
        };
      }
      saveState(state);
      render();
      if (r.tutorialUnlock) setFlash(r.tutorialUnlock, "unlock");
      else if (!r.ok) {
        setFlash(r.msg);
        if (r.ranchFull) openRanchCullSelect(1);
      } else if (r.celebrate) {
        let tone = "celebrate";
        if (r.hybrid) tone = "hybrid";
        else if ((r.rarity ?? 0) >= 3) tone = "legend";
        setFlash(r.msg, tone);
      }
    });
  });
  app.querySelectorAll("[data-claim-all-hatch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = claimAllReadyHatches(state);
      if (r.ok && r.pets?.length) {
        hatchClaimModal = {
          pets: r.pets,
          reveals: r.reveals || [],
          celebrate: !!r.celebrate,
        };
      }
      saveState(state);
      render();
      if (r.tutorialUnlock) setFlash(r.tutorialUnlock, "unlock");
      else if (!r.ok) {
        setFlash(r.msg);
        if (r.ranchFull) openRanchCullSelect(1);
      } else if (r.celebrate) {
        let tone = "celebrate";
        if (r.hybrid) tone = "hybrid";
        else if ((r.rarity ?? 0) >= 3) tone = "legend";
        setFlash(r.msg, tone);
      }
      if (r.ok && r.ranchFull) openRanchCullSelect(1);
    });
  });
  app.querySelectorAll("[data-dissolve-egg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = dissolveEgg(state, btn.dataset.dissolveEgg);
      saveState(state);
      render();
      flashResult(r);
    });
  });
  app.querySelectorAll("[data-hatch-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.hatchFilter;
      if (!id || hatchEggFilter === id) return;
      hatchEggFilter = id;
      render();
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
      petView = {
        mode: "detail",
        uid: btn.dataset.petDetail,
        fuseBase: null,
        fuseMats: [],
        breedParents: [],
        detailTab: "stats",
      };
      if (tutorialActive(state) && state.tutorial.step === "meet_pet") {
        const adv = markTutorialFlag(state, "petDetailVisited");
        if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
      }
      render();
    });
  });
  app.querySelectorAll("[data-pet-detail-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.petDetailTab;
      if (!id || petView.detailTab === id) return;
      petView = { ...petView, detailTab: id };
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
      if (tutorialActive(state) && state.tutorial.step === "fuse_intro") {
        const adv = markTutorialFlag(state, "fusePageVisited");
        if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
      }
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
      fuseConfirmModal = { baseUid, matUids: [...mats] };
      render();
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
  app.querySelectorAll("[data-breed-slider]").forEach((input) => {
    input.addEventListener("input", () => {
      breedCount = clampBreedBatchCount(input.value);
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
maybeNotifyOffline(state.offlineHint || (offlineBankView(state).hasPending ? offlineBankView(state) : null));

document.addEventListener("click", onTutorialBannerClick);
document.addEventListener("click", onTutorialMisclick, true);
document.addEventListener("touchend", onTutorialMisclick, true);
window.addEventListener("resize", () => {
  syncAppHeight();
  positionTutorialSpotlight(false);
});

/** Escape／瀏覽器返回：清遮罩；卡住 playback 一律清 */
document.addEventListener("keydown", (ev) => {
  if (ev.key !== "Escape") return;
  if (!fullscreenOverlayBlockReason() && !playback) return;
  ev.preventDefault();
  dismissBlockingUi({ force: true });
});
window.addEventListener("popstate", () => {
  if (fullscreenOverlayBlockReason() || playback) {
    dismissBlockingUi({ force: true });
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelIdleAnim();
    return;
  }
  // 回到前景：用牆鐘追趕掛機戰鬥步數
  const onTrainPanel = tab === "cultivate" && panelSub.cultivate === "train";
  tickIdleCombat({ background: !onTrainPanel });
  if (onTrainPanel) render();
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pwaInstallEvt = e;
  if (!pwaDismissed) render();
});

setInterval(() => {
  if (playback && !playback.done) return;
  const onTrainPanel = tab === "cultivate" && panelSub.cultivate === "train";
  tickIdleCombat({ background: !onTrainPanel });
}, 380);

setInterval(() => {
  if (playback && !playback.done) return;
  const eggReadyNow = patchLive();
  const adv = advanceTutorialIfReady(state);
  const snap = tutorialLiveSnapshot(state);
  const onTrainPanel = tab === "cultivate" && panelSub.cultivate === "train";
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
    const breedPatch = patchBreedLive();
    if (breedPatch.needRender) {
      saveState(state);
      renderPreservingStageScroll();
      return;
    }
    saveState(state);
    return;
  }
  if (tab === "party" && panelSub.party === "hatch" && eggReadyNow) {
    saveState(state);
    if (adv.advanced && adv.unlockMsg) setFlash(adv.unlockMsg, "unlock");
    renderPreservingStageScroll();
    tutorialSnapCache = snap;
    return;
  }
  if (onTrainPanel) {
    const bank = offlineBankView(state);
    const wantOffline = (bank.sec || 0) > 0;
    const hasOffline = !!document.querySelector("[data-live=offline-home]");
    if (wantOffline !== hasOffline) {
      saveState(state);
      render();
      return;
    }
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
        // 上一層永遠可返；下一層喺已通範圍常開，frontier 要打贏五波
        const gates = trainFloorNavGates(state);
        const prevBtn = strip.querySelector("[data-train-floor-prev]");
        const nextBtn = strip.querySelector("[data-train-floor-next]");
        if (prevBtn) prevBtn.disabled = !gates.canPrev;
        if (nextBtn) nextBtn.disabled = !gates.canNext;
        strip.querySelector(".train-idle-claim")?.remove();
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
  const bank = offlineBankView(state);
  if (bank.hasPending && bank.sec >= 3600 * 8 - 120) {
    pushNotifyOnce(
      `offline-cap-${bank.sec}`,
      "暗潮 · 離線上限",
      "掛機收益即將達 8 小時上限，記得回來領取！"
    );
  } else if (state.offlineHint && state.offlineHint.sec >= 3600 * 8 - 120) {
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
      pushNotifyOnce(`dispatch-ready-${d.dispatchId}`, "暗潮 · 派遣完成", `${d.missionName} 可以收集了！`);
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
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    const showRefresh = () => {
      const el = document.querySelector("[data-live=sw-refresh]");
      if (el) el.hidden = false;
    };
    if (reg.waiting) showRefresh();
    reg.addEventListener("updatefound", () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener("statechange", () => {
        if (nw.state === "installed" && navigator.serviceWorker.controller) showRefresh();
      });
    });
    // 主動檢查更新（熱修後）
    setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // 新 SW 接管後提醒硬刷新一次
    const el = document.querySelector("[data-live=sw-refresh]");
    if (el) el.hidden = false;
  });
}
