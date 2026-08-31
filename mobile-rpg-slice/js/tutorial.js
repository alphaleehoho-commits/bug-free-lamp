/**
 * P13：新手引導 — 寵物蛋 → 練功 Lv3 → 秘境 → 商肆蛋
 * 目標節奏約 10–15 分鐘；不在 render 自動連跳
 */
import { nextStageAt } from "./data.js";

export const TUTORIAL_STEPS = [
  {
    id: "hatch_starter",
    title: "孵化首寵",
    hint: "潮霧蛋孵化中。等待期間可先「修行 → 練功」掛機，完成後回牧場領取。",
  },
  {
    id: "meet_pet",
    title: "認寵",
    hint: "點開首隻靈寵的「詳情」，認識牠的屬性與升級入口。",
  },
  {
    id: "train_pet",
    title: "練功升級",
    hint: "在潮岸掛機攞潮露，把首寵升至 Lv.3（才夠穩打秘境一層）。",
  },
  {
    id: "deploy",
    title: "派出戰",
    hint: "在牧場點「出戰」，讓靈寵加入秘境隊伍。",
  },
  {
    id: "dungeon_fight",
    title: "踏入秘境",
    hint: "進入「秘境」，挑戰【潮汐廢墟 · 一層】（教學豁免今日挑戰限制）。",
  },
  {
    id: "dungeon_win",
    title: "攻克一層",
    hint: "帶靈寵戰勝秘境一層；教學中不檢查今日禁屬／試煉條件。",
  },
  {
    id: "shop_egg",
    title: "商肆購蛋",
    hint: "在商肆購入一枚寵物蛋（教學優惠），開始孵化擴隊。",
  },
  {
    id: "hatch_second",
    title: "孵化擴隊",
    hint: "等待第二枚蛋孵化完成並領取，擴充牧場。",
  },
  {
    id: "cultivate_qi",
    title: "靈契修行",
    hint: "在契壇掛機累積靈契（教學需稍作等候，感受修行節奏）。",
  },
  {
    id: "breakthrough",
    title: "突破初階",
    hint: "打開「進階」分頁，突破至【通靈初期】。",
  },
  {
    id: "breed_intro",
    title: "血脈催生",
    hint: "打開「靈寵 → 出戰／牧場」的繁殖入口，了解雜交與血脈。",
  },
  {
    id: "codex",
    title: "圖鑑求道",
    hint: "打開「圖鑑」查看收藏與求道目標。",
  },
  {
    id: "dispatch",
    title: "牧場派遣",
    hint: "「靈寵 → 派遣」可派牧場靈寵外派取資，亦可能帶回寵物蛋。",
  },
  {
    id: "tactics",
    title: "戰術陣型",
    hint: "「秘境 → 戰術」可調整自動戰鬥策略與陣型。",
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

export const LATE_TUTORIAL_STEPS = ["dispatch", "tactics"];
export const LATE_TUTORIAL_MIN_REALM = 2;

/** 教學：首寵升級門檻 */
export const TUTORIAL_TRAIN_LEVEL = 3;
/** 教學：靈契步最少掛機秒數（節奏） */
export const TUTORIAL_QI_IDLE_SEC = 90;

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
  const allParty = { fight: true, ranch: true, dispatch: true, bond: true };
  const allDung = { setup: true };

  switch (stepId) {
    case "hatch_starter":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: true },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "meet_pet":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "train_pet":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { advance: true, shop: true },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "deploy":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "dungeon_fight":
    case "dungeon_win":
      return {
        tabs: { cultivate: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { dispatch: true, bond: true },
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
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "cultivate_qi":
      return {
        tabs: { party: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult, advance: true },
        partySub: { dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "breakthrough":
      return {
        tabs: { party: true, dungeon: true, codex: true, log: true },
        cultivateSub: { shop: true, advance: false },
        partySub: { dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "breed_intro":
      return {
        tabs: { cultivate: true, dungeon: true, codex: true, log: true },
        cultivateSub: { ...allCult },
        partySub: { dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "codex":
      return {
        tabs: { log: true },
        cultivateSub: { ...allCult },
        partySub: { dispatch: true },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "dispatch":
      return {
        tabs: { log: true },
        cultivateSub: { ...allCult },
        partySub: { fight: false, ranch: false, bond: false, dispatch: false },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "tactics":
      return {
        tabs: { log: true },
        cultivateSub: { advance: true },
        partySub: {},
        dungeonSub: { field: false, setup: false },
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
  return nextId;
}

export function maybeStartLateTutorial(state) {
  normalizeTutorial(state);
  if ((state.realm | 0) < LATE_TUTORIAL_MIN_REALM) return { started: false };
  if (state.tutorial.lateCompleted) return { started: false };
  const flags = state.tutorial.flags || {};
  const pending = LATE_TUTORIAL_STEPS.filter((id) => {
    if (id === "dispatch") return !flags.dispatchVisited;
    if (id === "tactics") return !flags.tacticsVisited;
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

export function syncTutorialNavigation(state, nav) {
  if (!tutorialActive(state)) return nav;
  const step = state.tutorial.step;
  const next = { ...nav };

  if (step === "meet_pet" || step === "deploy" || step === "breed_intro") {
    next.tab = "party";
    next.panelSub = { ...next.panelSub, party: "ranch" };
  } else if (step === "hatch_starter" || step === "hatch_second") {
    if (next.tab !== "cultivate" && next.tab !== "party") {
      next.tab = "party";
      next.panelSub = { ...next.panelSub, party: "ranch" };
    }
  } else if (step === "train_pet") {
    next.tab = "cultivate";
    next.panelSub = { ...next.panelSub, cultivate: "train" };
  } else if (step === "dungeon_fight" || step === "dungeon_win") {
    next.tab = "dungeon";
    next.panelSub = { ...next.panelSub, dungeon: "field" };
  } else if (step === "shop_egg") {
    next.tab = "cultivate";
    next.panelSub = { ...next.panelSub, cultivate: "shop" };
  } else if (step === "cultivate_qi") {
    next.tab = "cultivate";
    next.panelSub = { ...next.panelSub, cultivate: "train" };
  } else if (step === "breakthrough") {
    next.tab = "cultivate";
    next.panelSub = { ...next.panelSub, cultivate: "advance" };
  } else if (step === "codex") {
    next.tab = "codex";
  }

  return next;
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
      if (tab === "party" && ps.party === "ranch") {
        if (eggReady) return [{ type: "claim-hatch" }];
        if (eggIdle) return [{ type: "start-hatch" }];
        return [{ type: "tab", id: "cultivate" }];
      }
      if (tab === "cultivate" && ps.cultivate === "train") return [];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    }
    case "meet_pet":
      if (tab === "party" && ps.party === "ranch") return [{ type: "pet-detail" }];
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    case "train_pet":
      if (tab === "party") return [{ type: "act", act: "upgrade" }, { type: "pet-detail" }];
      if (tab === "cultivate" && ps.cultivate === "train") return [{ type: "tab", id: "party" }];
      if (tab === "cultivate") return [{ type: "panel-sub", group: "cultivate", id: "train" }];
      return [{ type: "tab", id: "cultivate" }];
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
    case "hatch_second":
      if (tab === "party" && ps.party === "ranch") {
        if (eggReady) return [{ type: "claim-hatch" }];
        if (eggIdle) return [{ type: "start-hatch" }];
        return [];
      }
      if (tab === "party") return [{ type: "panel-sub", group: "party", id: "ranch" }];
      return [{ type: "tab", id: "party" }];
    case "cultivate_qi":
      if (tutorialQiReady(state)) {
        if (tab === "cultivate" && ps.cultivate === "advance") return [];
        return [{ type: "panel-sub", group: "cultivate", id: "advance" }];
      }
      return [];
    case "breakthrough":
      if (tab === "cultivate" && ps.cultivate === "advance") {
        return [{ type: "act", act: "break" }];
      }
      return [{ type: "panel-sub", group: "cultivate", id: "advance" }];
    case "breed_intro":
      if (tab === "party") return [{ type: "act", act: "open-breed" }];
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
    case "pet-detail":
    case "start-hatch":
    case "claim-hatch":
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
      return "[data-pet-detail]";
    case "start-hatch":
      return "[data-start-hatch]:not([disabled])";
    case "claim-hatch":
      return "[data-claim-hatch]:not([disabled])";
    case "dungeon":
      return spec.dungeonId
        ? `[data-dungeon="${spec.dungeonId}"]:not([disabled])`
        : "[data-dungeon]:not([disabled])";
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
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.disabled && !el.hidden) els.push(el);
    });
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
  ].join("|");
}

export function tutorialBannerHint(state) {
  const info = tutorialStepInfo(state);
  if (info.stepId === "cultivate_qi" && tutorialQiReady(state)) {
    return "靈契已足，打開「進階」突破！";
  }
  if (info.stepId === "train_pet") {
    const lv = highestOwnedLevel(state);
    return `首寵目前 Lv.${lv}／需 Lv.${TUTORIAL_TRAIN_LEVEL}。潮岸掛機攞潮露後，到詳情點「升級」。`;
  }
  if (info.stepId === "hatch_starter" || info.stepId === "hatch_second") {
    const eggs = state.eggs || [];
    const ready = eggs.find((e) => e.startedAt != null && (e.readyAt || 0) <= Date.now());
    if (ready) return `【${ready.name || "蛋"}】已就緒，點「領取」！`;
    const hatching = eggs.find((e) => e.startedAt != null);
    if (hatching) {
      const sec = Math.max(0, Math.ceil(((hatching.readyAt || 0) - Date.now()) / 1000));
      return `孵化中… 約 ${sec}s 後可領取。`;
    }
  }
  return info.hint;
}

export function tutorialBannerHtml(state) {
  if (!tutorialActive(state)) return "";
  const info = tutorialStepInfo(state);
  let hint = tutorialBannerHint(state);
  const phaseNote = info.inLate
    ? `<p class="tutorial-phase">進階引導 · 達【通靈後期】解鎖</p>`
    : "";
  return `
    <div class="tutorial-banner" data-live="tutorial">
      ${phaseNote}
      <div class="tutorial-head">
        <span class="tutorial-step">${info.index}/${info.total}</span>
        <strong>${info.title}</strong>
        <button type="button" class="ghost tutorial-skip" data-act="skip-tutorial">跳過教學</button>
      </div>
      <p class="tutorial-hint" data-live="tutorial-hint">${hint}</p>
    </div>`;
}
