/**
 * P13：新手引導 — 寵物蛋 → 練功 Lv3 → 秘境 → 商肆蛋
 * 目標節奏約 10–15 分鐘；不在 render 自動連跳
 */
import { nextStageAt, upgradeMatCost, canAffordPetUpgrade, petUpgradeShortageLines, FUSION_MAX_STAGE } from "./data.js";

export const TUTORIAL_STEPS = [
  {
    id: "hatch_starter",
    title: "孵化首隻",
    hint: "霧傘蛋孵化中。可先「育成 → 練功」掛機；完成後打開「水母 → 孵化」領取。",
  },
  {
    id: "meet_pet",
    title: "認識水母",
    hint: "點開首隻水母的「詳情」，認識牠的屬性與升級入口。",
  },
  {
    id: "train_pet",
    title: "練功升級",
    hint: "育成掛機攞露珠（副材）；基本用小餌或泡泡晶。夠料後到「水母 → 水母池 → 詳情」點升級，升至 Lv.3。",
  },
  {
    id: "deploy",
    title: "派出戰",
    hint: "在水母池點「出戰」，讓水母加入秘境隊伍。",
  },
  {
    id: "dungeon_fight",
    title: "踏入秘境",
    hint: "進入「秘境」，挑戰【1-1】（教學豁免今日挑戰限制）。",
  },
  {
    id: "dungeon_win",
    title: "攻克 1-1",
    hint: "帶水母戰勝秘境 1-1；教學中不檢查今日禁屬／試煉條件。",
  },
  {
    id: "shop_egg",
    title: "商肆購蛋",
    hint: "在商肆購入一枚水母蛋（教學優惠），開始孵化擴隊。",
  },
  {
    id: "hatch_second",
    title: "孵化擴隊",
    hint: "第二枚蛋孵化中。等待期間可先「育成 → 練功」，完成後回「孵化」領取。",
  },
  {
    id: "cultivate_qi",
    title: "共鳴漂漂",
    hint: "在育成掛機累積共鳴（滿後可到「進階」成長；教學需稍作等候）。",
  },
  {
    id: "breakthrough",
    title: "成長初階",
    hint: "打開「育成 → 進階」，成長至【浮游初期】。",
  },
  {
    id: "breed_intro",
    title: "血脈催生",
    hint: "打開「水母 → 繁殖」分頁，了解雜交與血脈。",
  },
  {
    id: "codex",
    title: "圖鑑出發",
    hint: "打開「圖鑑」查看收藏與出發目標。",
  },
  {
    id: "dispatch",
    title: "水母池派遣",
    hint: "「水母 → 派遣」可派水母池水母外派取資，亦可能帶回水母蛋。",
  },
  {
    id: "tactics",
    title: "戰術陣型",
    hint: "「秘境 → 戰術」可調整自動戰鬥策略與陣型。",
  },
  {
    id: "fuse_intro",
    title: "融合覺醒",
    hint: "通關【1-3】後解鎖融合。打開水母詳情，進入融合頁了解流程（唔使即刻融合）。",
  },
  {
    id: "fuse_once",
    title: "完成融合",
    hint: "用同種素材完成一次融合。自由探索，唔會再鎖功能或強行標示。",
  },
  {
    id: "complete",
    title: "初階解鎖",
    hint: "教學完成，自由探索暗潮！",
  },
];

const STEP_IDS = TUTORIAL_STEPS.map((s) => s.id);

export const CORE_TUTORIAL_STEPS = [
  "hatch_starter",
  "meet_pet",
  "train_pet",
  "deploy",
  "dungeon_fight",
  "dungeon_win",
  "shop_egg",
  "hatch_second",
  "cultivate_qi",
  "breakthrough",
  "breed_intro",
  "codex",
];

export const LATE_TUTORIAL_STEPS = ["dispatch", "tactics", "fuse_intro", "fuse_once"];
export const LATE_TUTORIAL_MIN_REALM = 2;

/** 教學：首寵升級門檻 */
export const TUTORIAL_TRAIN_LEVEL = 3;
/** 教學：共鳴步最少掛機秒數（節奏） */
export const TUTORIAL_QI_IDLE_SEC = 45;

function isLateStep(stepId) {
  return LATE_TUTORIAL_STEPS.includes(stepId);
}

export function defaultTutorial() {
  return { done: false, step: "hatch_starter", flags: {} };
}

export function isVeteranPlayer(state) {
  const owned = (state.pets?.length || 0) + (state.ranch?.length || 0);
  return (state.realm || 0) > 0 || owned > 1 || (state.combatsWon || 0) > 0;
}

function highestOwnedLevel(state) {
  let max = 0;
  for (const p of [...(state.pets || []), ...(state.ranch || [])]) {
    max = Math.max(max, p.level ?? 1);
  }
  return max;
}

/** 教學練功步：找出未達標嘅首寵 */
function tutorialTrainTargetPet(state) {
  const owned = [...(state.pets || []), ...(state.ranch || [])];
  return (
    owned.find((p) => (p.level ?? 1) < TUTORIAL_TRAIN_LEVEL) || owned[0] || null
  );
}

/** 目前是否有足夠材料＋小餌或泡泡晶升一級（與 upgradePet 一致） */
export function trainPetCanUpgrade(state) {
  const pet = tutorialTrainTargetPet(state);
  if (!pet) return false;
  const lv = pet.level ?? 1;
  if (lv >= TUTORIAL_TRAIN_LEVEL) return true;
  return canAffordPetUpgrade(state, lv);
}

/** 教學開局露珠：夠連升兩級至 Lv.3（+1 備用） */
export const TUTORIAL_STARTER_TIDE_DEW = 3;

export function tutorialEggReady(state) {
  return (state.eggs || []).some((e) => e.startedAt != null && (e.readyAt || 0) <= Date.now());
}

/** 教學步驟需要水母池 sub 時（認寵／升級／出戰等） */
export function tutorialNeedsRanchSub(step) {
  return (
    step === "meet_pet" ||
    step === "deploy" ||
    step === "train_pet" ||
    step === "fuse_intro"
  );
}

/** 教學步驟需要孵化 sub 時 */
export function tutorialNeedsHatchSub(step) {
  return step === "hatch_starter" || step === "hatch_second";
}

/** 教學標示用：只挑一隻目標水母（唔好成欄發光） */
export function tutorialCoachDetailUid(state) {
  const owned = [...(state.pets || []), ...(state.ranch || [])];
  if (!owned.length) return null;
  const step = state.tutorial?.step;
  if (step === "train_pet") {
    return tutorialTrainTargetPet(state)?.uid || owned[0].uid;
  }
  if (step === "fuse_intro") {
    const eligible = owned.find((p) => (p.fusionLevel ?? 0) < FUSION_MAX_STAGE);
    return (eligible || owned[0]).uid;
  }
  return owned[0].uid;
}

/** 載入／舊存檔正規化 */
export function normalizeTutorial(state) {
  if (!state.tutorial) {
    state.tutorial = isVeteranPlayer(state)
      ? { done: true, step: "complete", flags: {} }
      : defaultTutorial();
  }
  if (!state.tutorial.flags) state.tutorial.flags = {};
  const legacyMap = {
    bond: "codex",
    gear: "tactics",
    shop_pet: "shop_egg",
  };
  if (legacyMap[state.tutorial.step]) {
    state.tutorial.step = legacyMap[state.tutorial.step];
  }
  if (!STEP_IDS.includes(state.tutorial.step)) {
    state.tutorial.step = state.tutorial.done ? "complete" : "hatch_starter";
  }
  if (state.tutorial.done) state.tutorial.step = "complete";
  if (state.tutorial.latePending == null) state.tutorial.latePending = false;
  if (state.tutorial.lateCompleted == null) state.tutorial.lateCompleted = false;
  return state.tutorial;
}

export function tutorialActive(state) {
  const t = normalizeTutorial(state);
  return !t.done && t.step !== "complete";
}

export function tutorialStepInfo(state) {
  const t = normalizeTutorial(state);
  const idx = STEP_IDS.indexOf(t.step);
  const cur = TUTORIAL_STEPS[idx] || TUTORIAL_STEPS[0];
  const inLate = isLateStep(t.step) || t.latePending;
  const total = inLate
    ? CORE_TUTORIAL_STEPS.length + LATE_TUTORIAL_STEPS.length
    : CORE_TUTORIAL_STEPS.length;
  let index = 1;
  if (inLate && idx >= STEP_IDS.indexOf("dispatch")) {
    index = CORE_TUTORIAL_STEPS.length + (idx - STEP_IDS.indexOf("dispatch") + 1);
  } else if (idx >= 0 && CORE_TUTORIAL_STEPS.includes(cur.id)) {
    index = CORE_TUTORIAL_STEPS.indexOf(cur.id) + 1;
  } else if (idx >= 0) {
    index = Math.min(idx + 1, total);
  }
  return {
    ...cur,
    index,
    total,
    stepId: cur.id,
    inLate,
  };
}

function locksForStep(stepId) {
  const allCult = { advance: true, shop: true };
  const allParty = { fight: true, ranch: true, hatch: true, breed: true, dispatch: true, bond: true };
  const allDung = { setup: true };

  switch (stepId) {
    case "hatch_starter":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: true },
        partySub: { fight: true, ranch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "meet_pet":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, hatch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "train_pet":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: true },
        partySub: { fight: true, hatch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "deploy":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, hatch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "dungeon_fight":
    case "dungeon_win":
      return {
        tabs: { cultivate: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { hatch: true, dispatch: true, bond: true },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "shop_egg":
      return {
        tabs: { party: true, dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: false },
        partySub: { ...allParty },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "hatch_second":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: true },
        partySub: { fight: true, ranch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "cultivate_qi":
      return {
        tabs: { party: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult, advance: true },
        partySub: { hatch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "breakthrough":
      return {
        tabs: { party: true, dungeon: true, codex: true, log: true },
        cultivateSub: { shop: true, advance: false },
        partySub: { hatch: true, breed: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "breed_intro":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, ranch: true, hatch: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "codex":
      return {
        tabs: { log: true },
        cultivateSub: { ...allCult },
        partySub: { hatch: true, breed: true, dispatch: true },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "dispatch":
      return {
        tabs: { log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: false, ranch: false, hatch: false, breed: false, bond: false, dispatch: false },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "tactics":
      return {
        tabs: { log: true },
        cultivateSub: { advance: true },
        partySub: {},
        dungeonSub: { field: true, setup: false },
        trainSites: false,
      };
    case "fuse_intro":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { hatch: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "fuse_once":
      return {
        tabs: {},
        cultivateSub: {},
        partySub: {},
        dungeonSub: {},
        trainSites: false,
      };
    default:
      return {
        tabs: {},
        cultivateSub: {},
        partySub: {},
        dungeonSub: {},
        trainSites: false,
      };
  }
}

export function tutorialLocks(state) {
  if (!tutorialActive(state)) {
    return {
      tabs: {},
      cultivateSub: {},
      partySub: {},
      dungeonSub: {},
      trainSites: false,
    };
  }
  return locksForStep(state.tutorial.step);
}

export function isTabLocked(state, tabId) {
  return !!tutorialLocks(state).tabs[tabId];
}

export function isCultivateSubLocked(state, subId) {
  if (subId === "advance" && tutorialQiReady(state)) return false;
  if (subId === "gear") return true;
  return !!tutorialLocks(state).cultivateSub[subId];
}

export function tutorialQiReady(state) {
  if (!tutorialActive(state)) return false;
  const step = state.tutorial.step;
  if (step !== "cultivate_qi" && step !== "breakthrough") return false;
  const next = nextStageAt(state.realm);
  const idleOk = (state.daily?.idleSec || 0) >= TUTORIAL_QI_IDLE_SEC || !!state.tutorial.flags?.qiIdleDone;
  return state.qi >= next.need && idleOk;
}

export function isPartySubLocked(state, subId) {
  return !!tutorialLocks(state).partySub[subId];
}

export function isDungeonSubLocked(state, subId) {
  return !!tutorialLocks(state).dungeonSub[subId];
}

/** 教學鎖定原因（供 UI flash／title）；空字串＝未鎖 */
export function tutorialLockReason(state, kind, id) {
  if (!tutorialActive(state) || !id) return "";
  const locks = tutorialLocks(state);
  if (kind === "tab" && locks.tabs[id]) return "教學中";
  if (kind === "cultivateSub" && locks.cultivateSub[id]) return "教學中";
  if (kind === "partySub" && locks.partySub[id]) return "教學中";
  if (kind === "dungeonSub" && locks.dungeonSub[id]) return "教學中";
  return "";
}

export function areTrainSitesLocked(state) {
  return !!tutorialLocks(state).trainSites;
}

export const TUTORIAL_SHOP_COST = 35;

export function tutorialShopPrice(state, offerCost) {
  if (!tutorialActive(state)) return offerCost;
  if (state.tutorial.step !== "shop_egg") return offerCost;
  if (state.tutorial.flags?.shopBought) return offerCost;
  return Math.min(TUTORIAL_SHOP_COST, offerCost);
}

function meetsAdvance(state, stepId) {
  const flags = state.tutorial?.flags || {};
  const next = nextStageAt(state.realm);
  const owned = (state.pets?.length || 0) + (state.ranch?.length || 0);

  switch (stepId) {
    case "hatch_starter":
      return !!flags.starterHatched || owned >= 1;
    case "meet_pet":
      return !!flags.petDetailVisited;
    case "train_pet":
      return highestOwnedLevel(state) >= TUTORIAL_TRAIN_LEVEL;
    case "deploy":
      return (state.pets?.length || 0) >= 1;
    case "dungeon_fight":
      return !!flags.dungeonStarted;
    case "dungeon_win":
      return !!flags.dungeonWonTutorial;
    case "shop_egg":
      return !!flags.shopBought;
    case "hatch_second":
      return !!flags.secondEggHatched || owned >= 2;
    case "cultivate_qi": {
      const idleOk =
        (state.daily?.idleSec || 0) >= TUTORIAL_QI_IDLE_SEC || !!flags.qiIdleDone;
      return state.qi >= next.need && idleOk;
    }
    case "breakthrough":
      return state.realm >= 1;
    case "breed_intro":
      return !!flags.breedVisited;
    case "codex":
      return !!flags.codexVisited;
    case "dispatch":
      return !!flags.dispatchVisited;
    case "tactics":
      return !!flags.tacticsVisited;
    case "fuse_intro":
      return !!flags.fusePageVisited;
    case "fuse_once":
      return !!flags.fuseDone || (state.stats?.fusions || 0) >= 1;
    case "complete":
      return true;
    default:
      return false;
  }
}

function resolveNextStepId(state, cur) {
  const idx = STEP_IDS.indexOf(cur);
  if (idx < 0) return "complete";
  let nextId = STEP_IDS[Math.min(idx + 1, STEP_IDS.length - 1)];
  if (nextId === cur) return cur;
  if (cur === "codex" && (state.realm | 0) < LATE_TUTORIAL_MIN_REALM) {
    return "complete";
  }
  if (isLateStep(nextId) && (state.realm | 0) < LATE_TUTORIAL_MIN_REALM) {
    return "complete";
  }
  if (
    (nextId === "fuse_intro" || nextId === "fuse_once") &&
    !(state.clearedDungeons || {}).tide_3
  ) {
    return "complete";
  }
  return nextId;
}

function fuseTutorialPending(state, flags) {
  return (
    !!(state.clearedDungeons || {}).tide_3 &&
    !flags.fuseDone &&
    (state.stats?.fusions || 0) < 1
  );
}

function fuseTutorialStartStep(flags) {
  return flags.fusePageVisited ? "fuse_once" : "fuse_intro";
}

export function maybeStartLateTutorial(state) {
  normalizeTutorial(state);
  const flags = state.tutorial.flags || {};
  // 跳過教學後唔好再自動拉起任何進階引導
  if (flags.skipped || state.tutorial.lateCompleted) return { started: false };

  const fusePending = fuseTutorialPending(state, flags);

  // 通關心核後：即使其他進階教學已完，仍可拉起融合引導
  if (fusePending) {
    if (
      tutorialActive(state) &&
      (state.tutorial.step === "fuse_intro" || state.tutorial.step === "fuse_once")
    ) {
      return { started: false };
    }
    if (!tutorialActive(state) || state.tutorial.done) {
      const stepId = fuseTutorialStartStep(flags);
      state.tutorial.done = false;
      state.tutorial.lateCompleted = false;
      state.tutorial.step = stepId;
      state.tutorial.latePending = true;
      if (!state.materials) state.materials = {};
      if ((state.materials.fuse_sand || 0) < 1) state.materials.fuse_sand = 1;
      const info = TUTORIAL_STEPS.find((s) => s.id === stepId);
      return {
        started: true,
        msg: `進階教學：${info?.title || stepId}（通關心核解鎖）`,
        stepId,
      };
    }
  }

  if ((state.realm | 0) < LATE_TUTORIAL_MIN_REALM) return { started: false };
  const pending = LATE_TUTORIAL_STEPS.filter((id) => {
    if (id === "dispatch") return !flags.dispatchVisited;
    if (id === "tactics") return !flags.tacticsVisited;
    if (id === "fuse_intro") return fusePending && !flags.fusePageVisited;
    if (id === "fuse_once") return fusePending && !!flags.fusePageVisited;
    return false;
  });
  if (!pending.length) {
    state.tutorial.lateCompleted = true;
    state.tutorial.latePending = false;
    return { started: false };
  }
  if (tutorialActive(state) && isLateStep(state.tutorial.step)) {
    return { started: false };
  }
  state.tutorial.done = false;
  state.tutorial.step = pending[0];
  state.tutorial.latePending = true;
  const info = TUTORIAL_STEPS.find((s) => s.id === pending[0]);
  return {
    started: true,
    msg: `進階教學：${info?.title || pending[0]}`,
    stepId: pending[0],
  };
}

/** 只修復明顯卡住；唔會喺 render 狂 cascade */
export function healTutorialProgress(state) {
  if (!state.tutorial || state.tutorial.done) return { advanced: false, unlockMsg: null, steps: 0 };
  const owned = (state.pets?.length || 0) + (state.ranch?.length || 0);
  if (owned >= 1 && state.tutorial.step === "hatch_starter") {
    state.tutorial.flags.starterHatched = true;
  }
  if ((state.daily?.idleSec || 0) >= TUTORIAL_QI_IDLE_SEC) {
    state.tutorial.flags.qiIdleDone = true;
  }
  // 練功步：確保至少有足夠副材升一級，避免卡喺「有 highlight 但升唔到」
  if (state.tutorial.step === "train_pet" && !state.tutorial.flags.trainMatsGranted) {
    if (!state.materials) state.materials = {};
    const pet = tutorialTrainTargetPet(state);
    const mats = pet ? upgradeMatCost(pet.level ?? 1) : { tide_dew: 1 };
    const [id, need] = Object.entries(mats).find(([, n]) => n > 0) || ["tide_dew", 1];
    const have = Math.floor(state.materials[id] || 0);
    if (have < need) state.materials[id] = need;
    state.tutorial.flags.trainMatsGranted = true;
  }
  // 單步推進一次即可，避免一次跳多步
  return advanceTutorialIfReady(state);
}

export function advanceTutorialCascade(state, maxSteps = 4) {
  let last = { advanced: false, unlockMsg: null, nextId: null };
  let steps = 0;
  for (let i = 0; i < maxSteps; i++) {
    const r = advanceTutorialIfReady(state);
    if (!r.advanced) break;
    last = r;
    steps += 1;
  }
  return { ...last, advanced: steps > 0, steps };
}

export function advanceTutorialIfReady(state) {
  if (!tutorialActive(state)) return { advanced: false, unlockMsg: null };
  const cur = state.tutorial.step;
  if (!meetsAdvance(state, cur)) return { advanced: false, unlockMsg: null };

  const nextId = resolveNextStepId(state, cur);
  if (nextId === cur) return { advanced: false, unlockMsg: null };

  state.tutorial.step = nextId;
  const nextInfo = TUTORIAL_STEPS.find((s) => s.id === nextId);
  let unlockMsg = `教學進度：${nextInfo?.title || nextId}`;

  if (nextId === "complete") {
    state.tutorial.done = true;
    if (isLateStep(cur) || state.tutorial.latePending) {
      state.tutorial.lateCompleted = true;
      state.tutorial.latePending = false;
      unlockMsg = "進階教學完成！";
    } else if ((state.realm | 0) < LATE_TUTORIAL_MIN_REALM) {
      state.tutorial.latePending = true;
      unlockMsg = "初階教學完成！升階後將解鎖進階功能引導。";
    } else {
      unlockMsg = "初階教學完成！所有功能已解鎖。";
    }
  }

  return { advanced: true, unlockMsg, nextId };
}

function cloneNav(nav) {
  return { ...nav, panelSub: { ...(nav.panelSub || {}) } };
}

/** 只喺離開允許 tab 時拉回；已喺允許 tab 內唔強改 sub */
function clampTutorialTabs(nav, allowedTabs, fallback) {
  const next = cloneNav(nav);
  if (!allowedTabs.includes(next.tab)) {
    next.tab = fallback || allowedTabs[0];
  }
  return next;
}

function ensurePartyRanchSub(nav, step) {
  const next = cloneNav(nav);
  if (next.tab === "party" && tutorialNeedsRanchSub(step)) {
    next.panelSub = { ...next.panelSub, party: "ranch" };
  }
  if (next.tab === "party" && tutorialNeedsHatchSub(step)) {
    next.panelSub = { ...next.panelSub, party: "hatch" };
  }
  return next;
}

export function syncTutorialNavigation(state, nav) {
  if (!tutorialActive(state)) return nav;
  const step = state.tutorial.step;
  let next;

  switch (step) {
    case "meet_pet":
    case "deploy":
    case "breed_intro":
      next = clampTutorialTabs(nav, ["party"]);
      break;
    case "hatch_starter":
    case "hatch_second": {
      next = clampTutorialTabs(nav, ["party", "cultivate"], tutorialEggReady(state) ? "party" : "party");
      if (tutorialEggReady(state)) {
        next.tab = "party";
        next.panelSub = { ...next.panelSub, party: "hatch" };
      }
      break;
    }
    case "train_pet":
      if (nav.tab === "cultivate" || nav.tab === "party") {
        next = cloneNav(nav);
      } else {
        next = clampTutorialTabs(
          {
            ...nav,
            tab: trainPetCanUpgrade(state) ? "party" : "cultivate",
            panelSub: {
              ...nav.panelSub,
              ...(trainPetCanUpgrade(state) ? { party: "ranch" } : { cultivate: "train" }),
            },
          },
          ["cultivate", "party"]
        );
      }
      if (trainPetCanUpgrade(state) && next.tab === "party") {
        next.panelSub = { ...next.panelSub, party: "ranch" };
      }
      break;
    case "dungeon_fight":
    case "dungeon_win":
      next = clampTutorialTabs(nav, ["dungeon"]);
      break;
    case "shop_egg":
      next = clampTutorialTabs(nav, ["cultivate"]);
      break;
    case "cultivate_qi":
    case "breakthrough":
      next = clampTutorialTabs(nav, ["cultivate"]);
      break;
    case "codex":
      next = clampTutorialTabs(nav, ["codex"]);
      break;
    case "dispatch":
      next = clampTutorialTabs(nav, ["party"]);
      break;
    case "tactics":
      next = clampTutorialTabs(nav, ["dungeon"]);
      // 只趕走已鎖嘅 field；深潛／戰術可停留（唔好每 frame 強制 setup 令深潛無反應）
      {
        const dungSub = next.panelSub?.dungeon || "field";
        if (dungSub === "field" || isDungeonSubLocked(state, dungSub)) {
          next.panelSub = { ...next.panelSub, dungeon: "setup" };
        }
      }
      break;
    case "fuse_intro":
      next = clampTutorialTabs(nav, ["party"]);
      break;
    default:
      next = cloneNav(nav);
  }

  return ensurePartyRanchSub(next, step);
}

export function tutorialHighlights(state, nav = {}) {
  if (!tutorialActive(state)) return [];
  const step = state.tutorial.step;
  const tab = nav.tab || "";
  const ps = nav.panelSub || {};
  const eggReady = (state.eggs || []).some((e) => e.startedAt != null && (e.readyAt || 0) <= Date.now());
  const eggIdle = (state.eggs || []).some((e) => e.startedAt == null);

  switch (step) {
    case "hatch_starter": {
      if (eggReady) {
        if (tab === "party" && ps.party === "hatch") return [{ type: "claim-hatch" }];
        if (tab === "party") return [{ type: "panel-sub", group: "party", id: "hatch" }];
        return [{ type: "tab", id: "party" }];
      }
      if (tab === "party" && ps.party === "hatch") {
        if (eggIdle) return [{ type: "start-hatch" }];
        return [{ type: "tab", id: "cultivate" }];
      }
      if (tab === "cultivate" && ps.cultivate === "train") return [];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "hatch" }];
      return [{ type: "tab", id: "party" }];
    }
    case "meet_pet": {
      const uid = tutorialCoachDetailUid(state);
      if (tab === "party" && ps.party === "ranch") {
        return uid ? [{ type: "pet-detail", uid }] : [{ type: "pet-detail" }];
      }
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    }
    case "train_pet": {
      const canUp = trainPetCanUpgrade(state);
      const inDetail = !!nav.petDetail;
      const uid = tutorialCoachDetailUid(state);
      if (tab === "party" && ps.party === "ranch") {
        if (canUp && inDetail) return [{ type: "upgrade" }];
        if (canUp) return uid ? [{ type: "pet-detail", uid }] : [{ type: "pet-detail" }];
        return [{ type: "tab", id: "cultivate" }];
      }
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      if (!canUp) {
        if (tab === "cultivate" && ps.cultivate === "train") return [];
        if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
        return [{ type: "tab", id: "cultivate" }];
      }
      return [{ type: "tab", id: "party" }];
    }
    case "deploy":
      if (tab === "party" && ps.party === "ranch") return [{ type: "deploy" }];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    case "dungeon_fight":
    case "dungeon_win":
      if (tab === "dungeon" && ps.dungeon === "field") {
        return [{ type: "dungeon", dungeonId: "tide_1" }];
      }
      if (tab === "dungeon") return [{ type: "panel-sub", group: "dungeon", id: "field" }];
      return [{ type: "tab", id: "dungeon" }];
    case "shop_egg":
      if (tab === "cultivate" && ps.cultivate === "shop") return [{ type: "shop-buy" }];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "shop" }];
      return [{ type: "tab", id: "cultivate" }];
    case "hatch_second": {
      if (eggReady) {
        if (tab === "party" && ps.party === "hatch") return [{ type: "claim-hatch" }];
        if (tab === "party") return [{ type: "panel-sub", group: "party", id: "hatch" }];
        return [{ type: "tab", id: "party" }];
      }
      if (tab === "party" && ps.party === "hatch") {
        if (eggIdle) return [{ type: "start-hatch" }];
        return [{ type: "tab", id: "cultivate" }];
      }
      if (tab === "cultivate" && ps.cultivate === "train") return [];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "hatch" }];
      return [{ type: "tab", id: "party" }];
    }
    case "cultivate_qi":
      if (tutorialQiReady(state)) {
        if (tab === "cultivate" && ps.cultivate === "advance") return [];
        return [{ type: "panel-sub", group: "cultivate", id: "advance" }];
      }
      if (tab === "cultivate" && ps.cultivate === "train") return [];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
      return [{ type: "tab", id: "cultivate" }];
    case "breakthrough":
      if (tab === "cultivate" && ps.cultivate === "advance") {
        return [{ type: "act", act: "break" }];
      }
      return [{ type: "panel-sub", group: "cultivate", id: "advance" }];
    case "breed_intro":
      if (tab === "party" && ps.party === "breed") return [];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "breed" }];
      return [{ type: "tab", id: "party" }];
    case "codex":
      return [{ type: "tab", id: "codex" }];
    case "dispatch":
      if (tab === "party" && ps.party === "dispatch") return [];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "dispatch" }];
      return [{ type: "tab", id: "party" }];
    case "tactics":
      if (tab === "dungeon" && ps.dungeon === "setup") return [];
      if (tab === "dungeon") return [{ type: "panel-sub", group: "dungeon", id: "setup" }];
      return [{ type: "tab", id: "dungeon" }];
    case "fuse_intro": {
      // 到達融合頁即完成此步；唔標示血統連結
      if (nav.petFuse) return [];
      const uid = tutorialCoachDetailUid(state);
      if (tab === "party" && ps.party === "ranch") {
        if (nav.petDetail) return [{ type: "start-fuse" }];
        return uid ? [{ type: "pet-detail", uid }] : [{ type: "pet-detail" }];
      }
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    }
    case "fuse_once":
      // 完成一次融合；唔發光、唔鎖功能
      return [];
    default:
      return [];
  }
}

function highlightMatches(h, spec) {
  if (!h || !spec || h.type !== spec.type) return false;
  switch (h.type) {
    case "tab":
      return h.id === spec.id;
    case "panel-sub":
      return h.group === spec.group && h.id === spec.id;
    case "act":
      return h.act === spec.act;
    case "shop-buy":
    case "deploy":
    case "upgrade":
    case "start-hatch":
    case "claim-hatch":
    case "start-fuse":
      return true;
    case "pet-detail":
      if (h.uid && spec.uid) return h.uid === spec.uid;
      if (h.uid || spec.uid) return !h.uid || !spec.uid || h.uid === spec.uid;
      return true;
    case "dungeon":
      return !spec.dungeonId || h.dungeonId === spec.dungeonId;
    default:
      return false;
  }
}

export function tutorialGlowClass(state, spec, nav = {}) {
  if (!tutorialActive(state)) return "";
  return tutorialHighlights(state, nav).some((h) => highlightMatches(h, spec)) ? " tut-glow" : "";
}

export function tutorialTargetSelector(spec) {
  switch (spec.type) {
    case "tab":
      return `[data-tab="${spec.id}"]`;
    case "panel-sub":
      return `[data-panel-sub="${spec.group}:${spec.id}"]`;
    case "act":
      return `[data-act="${spec.act}"]`;
    case "shop-buy":
      return "[data-shop-buy]:not([disabled])";
    case "deploy":
      return "[data-deploy]:not([disabled])";
    case "pet-detail":
      // 只標「詳情」掣，唔標名稱／血統連結（linkish）
      return spec.uid
        ? `button.info[data-pet-detail="${spec.uid}"]`
        : "button.info[data-pet-detail]";
    case "upgrade":
      return "[data-upgrade-feed]:not([disabled]), [data-upgrade]:not([disabled])";
    case "start-fuse":
      return "[data-start-fuse]:not([disabled])";
    case "start-hatch":
      return "[data-start-hatch]:not([disabled])";
    case "claim-hatch":
      return "[data-claim-hatch]:not([disabled])";
    case "dungeon":
      return spec.dungeonId
        ? `[data-dungeon="${spec.dungeonId}"]:not([disabled]), [data-attack-preview="${spec.dungeonId}"]`
        : "[data-dungeon]:not([disabled]), [data-attack-preview]";
    default:
      return null;
  }
}

export function findTutorialTargetElements(state, nav = {}) {
  if (typeof document === "undefined") return [];
  const specs = tutorialHighlights(state, nav);
  const els = [];
  for (const spec of specs) {
    const sel = tutorialTargetSelector(spec);
    if (!sel) continue;
    const matched = [...document.querySelectorAll(sel)].filter((el) => !el.disabled && !el.hidden);
    // pet-detail：永遠只取第一個清楚目標
    if (spec.type === "pet-detail") {
      if (matched[0]) els.push(matched[0]);
      continue;
    }
    matched.forEach((el) => els.push(el));
  }
  return els;
}

export function primaryTutorialTarget(state, nav) {
  const specs = tutorialHighlights(state, nav);
  return specs[0] || null;
}

export function markTutorialFlag(state, flag) {
  if (!state.tutorial) normalizeTutorial(state);
  if (!state.tutorial.flags) state.tutorial.flags = {};
  state.tutorial.flags[flag] = true;
  return advanceTutorialIfReady(state);
}

export function skipTutorial(state) {
  normalizeTutorial(state);
  state.tutorial.done = true;
  state.tutorial.step = "complete";
  state.tutorial.lateCompleted = true;
  state.tutorial.latePending = false;
  if (!state.tutorial.flags) state.tutorial.flags = {};
  state.tutorial.flags.skipped = true;
  return { ok: true, msg: "已跳過新手教學，所有功能已解鎖。" };
}

export function tutorialWaivesDungeonChallenge(state, dungeonId) {
  if (!tutorialActive(state)) return false;
  if (dungeonId !== "tide_1") return false;
  const step = state.tutorial.step;
  return step === "dungeon_fight" || step === "dungeon_win";
}

export function tutorialLiveSnapshot(state) {
  const t = state.tutorial || {};
  const f = t.flags || {};
  const dew = Math.floor(state.materials?.tide_dew || 0);
  const idleSec = Math.floor(state.daily?.idleSec || 0);
  const qiIdleLeft = Math.max(0, TUTORIAL_QI_IDLE_SEC - idleSec);
  return [
    t.step,
    t.done,
    tutorialQiReady(state),
    f.dungeonStarted,
    f.dungeonWonTutorial,
    f.codexVisited,
    f.petDetailVisited,
    f.starterHatched,
    f.shopBought,
    f.secondEggHatched,
    f.breedVisited,
    highestOwnedLevel(state),
    (state.eggs || []).length,
    dew,
    trainPetCanUpgrade(state) ? 1 : 0,
    idleSec,
    qiIdleLeft,
    Math.floor(state.qi || 0),
  ].join("|");
}

export function tutorialBannerHint(state) {
  const info = tutorialStepInfo(state);
  if (info.stepId === "cultivate_qi") {
    if (tutorialQiReady(state)) {
      return "共鳴已足，打開「進階」成長！";
    }
    const idle = Math.floor(state.daily?.idleSec || 0);
    const left = Math.max(0, TUTORIAL_QI_IDLE_SEC - idle);
    const next = nextStageAt(state.realm);
    if (left > 0) {
      return `育成掛機中… 還需約 ${left}s（共鳴 ${Math.floor(state.qi)}/${next.need}）。`;
    }
    if (state.qi < next.need) {
      return `掛機時間已足，繼續累積共鳴（${Math.floor(state.qi)}/${next.need}）。`;
    }
  }
  if (info.stepId === "train_pet") {
    const lv = highestOwnedLevel(state);
    if (lv >= TUTORIAL_TRAIN_LEVEL) return "已達 Lv.3！準備派出戰。";
    const pet = tutorialTrainTargetPet(state);
    const needLv = pet?.level ?? lv;
    if (!trainPetCanUpgrade(state)) {
      const short = petUpgradeShortageLines(state, needLv);
      const gap = short.length ? short.join(" · ") : "材料未齊";
      return `首隻 Lv.${lv}／需 Lv.${TUTORIAL_TRAIN_LEVEL}。仲欠：${gap} — 育成掛機中，夠料再去水母升級。`;
    }
    return `材料已齊！打開「水母 → 水母池 → 詳情」點「升級」（Lv.${lv}→${lv + 1}）。`;
  }
  if (info.stepId === "hatch_starter" || info.stepId === "hatch_second") {
    const eggs = state.eggs || [];
    const ready = eggs.find((e) => e.startedAt != null && (e.readyAt || 0) <= Date.now());
    if (ready) return `【${ready.name || "蛋"}】已就緒！打開「水母 → 孵化」點「領取」。`;
    const hatching = eggs.find((e) => e.startedAt != null);
    if (hatching) {
      const sec = Math.max(0, Math.ceil(((hatching.readyAt || 0) - Date.now()) / 1000));
      return `孵化中… 約 ${sec}s 後可領取。`;
    }
  }
  return info.hint;
}

const TUTORIAL_NEXT_WHERE = {
  hatch_starter: "底部「水母」→「孵化」領取",
  meet_pet: "「水母 → 水母池」點開首隻詳情",
  train_pet: "先「育成 → 練功」掛機，夠副材同小餌（或泡泡晶）再回「水母」升級",
  deploy: "「水母 → 水母池」點「出戰」",
  dungeon_fight: "底部「秘境」→ 進攻 1-1",
  dungeon_win: "繼續在「秘境」戰勝 1-1",
  shop_egg: "「育成 → 商肆」購入一枚蛋",
  hatch_second: "「水母 → 孵化」等候並領取",
  cultivate_qi: "留在「育成 → 練功」累積共鳴",
  breakthrough: "「育成 → 進階」成長",
  breed_intro: "「水母 → 繁殖」看一眼即可",
  codex: "底部「圖鑑」查看收藏",
  dispatch: "「水母 → 派遣」",
  tactics: "「秘境 → 戰術」",
  fuse_intro: "打開水母詳情 → 融合頁",
  fuse_once: "用同種素材完成一次融合",
};

export function tutorialNextWhere(state) {
  const info = tutorialStepInfo(state);
  if (info.stepId === "train_pet" && trainPetCanUpgrade(state)) {
    return "「水母 → 水母池 → 詳情」點「升級」";
  }
  return TUTORIAL_NEXT_WHERE[info.stepId] || "";
}

export function tutorialBannerHtml(state, opts = {}) {
  if (!tutorialActive(state)) return "";
  const collapsed = !!opts.collapsed;
  const info = tutorialStepInfo(state);
  const hint = tutorialBannerHint(state);
  const nextWhere = tutorialNextWhere(state);
  const phaseNote = info.inLate
    ? `<p class="tutorial-phase">進階引導 · 達【浮游後期】解鎖</p>`
    : "";
  if (collapsed) {
    return `
    <div class="tutorial-banner tutorial-banner-compact is-collapsed" data-live="tutorial">
      <button type="button" class="tutorial-compact-main" data-act="expand-tutorial">
        <span class="tutorial-step">${info.index}/${info.total}</span>
        <strong>${info.title}</strong>
        <span class="tutorial-hint-oneline" data-live="tutorial-hint">${hint}</span>
      </button>
      <button type="button" class="ghost tutorial-skip" data-act="skip-tutorial">跳過</button>
    </div>`;
  }
  return `
    <div class="tutorial-banner" data-live="tutorial">
      ${phaseNote}
      <div class="tutorial-head">
        <span class="tutorial-step">${info.index}/${info.total}</span>
        <strong>${info.title}</strong>
        <button type="button" class="ghost tutorial-collapse" data-act="collapse-tutorial">收起</button>
        <button type="button" class="ghost tutorial-skip" data-act="skip-tutorial">跳過教學</button>
      </div>
      <p class="tutorial-hint" data-live="tutorial-hint">${hint}</p>
      ${nextWhere ? `<p class="tutorial-next" data-live="tutorial-next">下一步：${nextWhere}</p>` : ""}
    </div>`;
}
