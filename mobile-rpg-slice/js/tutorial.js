/**
 * P13：新手引導 — 入局鎖功能，逐步解鎖
 */
import { nextStageAt } from "./data.js";

export const TUTORIAL_STEPS = [
  {
    id: "cultivate_qi",
    title: "靈契修行",
    hint: "在契壇等候靈契累積至突破所需（掛機即可）。",
  },
  {
    id: "breakthrough",
    title: "突破初階",
    hint: "打開「進階」分頁，突破至【通靈初期】（教學豁免秘境勝場條件）。",
  },
  {
    id: "shop_pet",
    title: "商肆結伴",
    hint: "在商肆購入第一隻靈寵（教學價 35 靈石，必得入牧場）。",
  },
  {
    id: "deploy",
    title: "派出戰",
    hint: "到「靈寵 → 牧場」，點「出戰」派出靈寵。",
  },
  {
    id: "dungeon_fight",
    title: "踏入秘境",
    hint: "進入「秘境」，挑戰【潮汐廢墟 · 一層】。",
  },
  {
    id: "dungeon_win",
    title: "攻克一層",
    hint: "帶靈寵戰勝秘境一層，取得首通獎勵。",
  },
  {
    id: "codex",
    title: "圖鑑見聞",
    hint: "打開「圖鑑」查看收藏與每日目標。",
  },
  {
    id: "bond",
    title: "待契約",
    hint: "戰後遇見的野生靈寵會在「靈寵 → 待契」出現。",
  },
  {
    id: "dispatch",
    title: "牧場派遣",
    hint: "「靈寵 → 派遣」可派牧場靈寵外派取資。",
  },
  {
    id: "gear",
    title: "人物裝備",
    hint: "「修行 → 裝備」可穿戴秘境掉落的裝備。",
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

export function defaultTutorial() {
  return { done: false, step: "cultivate_qi", flags: {} };
}

export function isVeteranPlayer(state) {
  const owned = (state.pets?.length || 0) + (state.ranch?.length || 0);
  return (state.realm || 0) > 0 || owned > 0 || (state.combatsWon || 0) > 0;
}

/** 載入／舊存檔正規化 */
export function normalizeTutorial(state) {
  if (!state.tutorial) {
    state.tutorial = isVeteranPlayer(state)
      ? { done: true, step: "complete", flags: {} }
      : defaultTutorial();
  }
  if (!state.tutorial.flags) state.tutorial.flags = {};
  if (!STEP_IDS.includes(state.tutorial.step)) {
    state.tutorial.step = state.tutorial.done ? "complete" : "cultivate_qi";
  }
  if (state.tutorial.done) state.tutorial.step = "complete";
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
  const total = TUTORIAL_STEPS.length - 1;
  return {
    ...cur,
    index: Math.max(1, idx + 1),
    total,
    stepId: t.step,
    done: t.done,
  };
}

function locksForStep(stepId) {
  const allTabs = { party: true, dungeon: true, codex: true, log: true };
  const allCult = { gear: true, advance: true };
  const allParty = { fight: true, ranch: true, dispatch: true, bond: true };
  const allDung = { setup: true };

  switch (stepId) {
    case "cultivate_qi":
      return {
        tabs: { ...allTabs },
        cultivateSub: { ...allCult },
        partySub: { ...allParty },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "breakthrough":
      return {
        tabs: { ...allTabs },
        cultivateSub: { gear: true, advance: false },
        partySub: { ...allParty },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "shop_pet":
      return {
        tabs: { ...allTabs },
        cultivateSub: { gear: true, advance: false },
        partySub: { ...allParty },
        dungeonSub: { ...allDung },
        trainSites: true,
      };
    case "deploy":
      return {
        tabs: { dungeon: true, codex: true, log: true },
        cultivateSub: { gear: true, advance: true },
        partySub: { fight: true, dispatch: true, bond: true },
        dungeonSub: { ...allDung },
        trainSites: false,
      };
    case "dungeon_fight":
    case "dungeon_win":
      return {
        tabs: { codex: true, log: true },
        cultivateSub: { gear: true, advance: true },
        partySub: { dispatch: true, bond: true },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "codex":
      return {
        tabs: { log: true },
        cultivateSub: { gear: true, advance: true },
        partySub: { dispatch: true, bond: true },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "bond":
      return {
        tabs: { log: true },
        cultivateSub: { gear: true, advance: true },
        partySub: { fight: false, ranch: false, dispatch: true, bond: false },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "dispatch":
      return {
        tabs: { log: true },
        cultivateSub: { gear: true, advance: true },
        partySub: { fight: false, ranch: false, bond: false, dispatch: false },
        dungeonSub: { setup: true },
        trainSites: false,
      };
    case "gear":
      return {
        tabs: { log: true },
        cultivateSub: { train: false, advance: true, gear: false },
        partySub: {},
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
  return !!tutorialLocks(state).cultivateSub[subId];
}

/** 教學第一步：靈契已達突破所需 */
export function tutorialQiReady(state) {
  if (!tutorialActive(state)) return false;
  const step = state.tutorial.step;
  if (step !== "cultivate_qi" && step !== "breakthrough") return false;
  const next = nextStageAt(state.realm);
  return state.qi >= next.need;
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

/** 教學中首次突破豁免秘境勝場 */
export function tutorialWaivesBreakthroughCheck(state, targetRealmId, check) {
  if (!tutorialActive(state)) return false;
  if (state.tutorial.step !== "breakthrough" && state.realm < 1) return false;
  return targetRealmId === 1 && check.type === "combats";
}

export const TUTORIAL_SHOP_COST = 35;

export function tutorialShopPrice(state, offerCost) {
  if (!tutorialActive(state)) return offerCost;
  if (state.tutorial.step !== "shop_pet") return offerCost;
  if (state.tutorial.flags?.shopBought) return offerCost;
  return Math.min(TUTORIAL_SHOP_COST, offerCost);
}

function meetsAdvance(state, stepId) {
  const flags = state.tutorial?.flags || {};
  const next = nextStageAt(state.realm);
  const owned = (state.pets?.length || 0) + (state.ranch?.length || 0);

  switch (stepId) {
    case "cultivate_qi":
      return state.qi >= next.need;
    case "breakthrough":
      return state.realm >= 1;
    case "shop_pet":
      return (state.ranch?.length || 0) >= 1;
    case "deploy":
      return (state.pets?.length || 0) >= 1;
    case "dungeon_fight":
      return !!flags.dungeonStarted;
    case "dungeon_win":
      return (state.combatsWon || 0) >= 1;
    case "codex":
      return !!flags.codexVisited;
    case "bond":
      return !!flags.bondVisited;
    case "dispatch":
      return !!flags.dispatchVisited;
    case "gear":
      return !!flags.gearVisited;
    case "tactics":
      return !!flags.tacticsVisited;
    case "complete":
      return true;
    default:
      return false;
  }
}

/**
 * 自動推進教學步驟；回傳 { advanced, unlockMsg }
 */
export function advanceTutorialIfReady(state) {
  if (!tutorialActive(state)) return { advanced: false, unlockMsg: null };
  const cur = state.tutorial.step;
  if (!meetsAdvance(state, cur)) return { advanced: false, unlockMsg: null };

  const idx = STEP_IDS.indexOf(cur);
  const nextId = STEP_IDS[Math.min(idx + 1, STEP_IDS.length - 1)];
  if (nextId === cur) return { advanced: false, unlockMsg: null };

  state.tutorial.step = nextId;
  const nextInfo = TUTORIAL_STEPS.find((s) => s.id === nextId);
  let unlockMsg = `教學進度：${nextInfo?.title || nextId}`;

  if (nextId === "complete") {
    state.tutorial.done = true;
    unlockMsg = "初階教學完成！所有功能已解鎖。";
  }

  return { advanced: true, unlockMsg, nextId };
}

/** 引導 UI 預設分頁（僅在教學中強制） */
export function syncTutorialNavigation(state, nav) {
  if (!tutorialActive(state)) return nav;
  const step = state.tutorial.step;
  const next = { ...nav };

  if (["cultivate_qi", "breakthrough", "shop_pet", "gear"].includes(step)) {
    next.tab = "cultivate";
    if (step === "breakthrough" || step === "shop_pet") {
      next.panelSub = { ...next.panelSub, cultivate: "advance" };
    } else if (step === "gear") {
      next.panelSub = { ...next.panelSub, cultivate: "gear" };
    } else if (step === "cultivate_qi" && tutorialQiReady(state)) {
      next.panelSub = { ...next.panelSub, cultivate: "advance" };
    } else {
      next.panelSub = { ...next.panelSub, cultivate: "train" };
    }
  } else if (step === "deploy" || step === "bond" || step === "dispatch") {
    next.tab = "party";
    if (step === "deploy") next.panelSub = { ...next.panelSub, party: "ranch" };
    if (step === "bond") next.panelSub = { ...next.panelSub, party: "bond" };
    if (step === "dispatch") next.panelSub = { ...next.panelSub, party: "dispatch" };
  } else if (step === "dungeon_fight" || step === "dungeon_win" || step === "tactics") {
    next.tab = "dungeon";
    next.panelSub = { ...next.panelSub, dungeon: step === "tactics" ? "setup" : "field" };
  } else if (step === "codex") {
    next.tab = "codex";
  }

  return next;
}

export function markTutorialFlag(state, flag) {
  if (!state.tutorial) normalizeTutorial(state);
  state.tutorial.flags[flag] = true;
  return advanceTutorialIfReady(state);
}

/** 跳過教學，解鎖全部功能 */
export function skipTutorial(state) {
  normalizeTutorial(state);
  state.tutorial.done = true;
  state.tutorial.step = "complete";
  return { ok: true, msg: "已跳過新手教學，所有功能已解鎖。" };
}

export function tutorialBannerHtml(state) {
  if (!tutorialActive(state)) return "";
  const info = tutorialStepInfo(state);
  let hint = info.hint;
  if (info.stepId === "cultivate_qi" && tutorialQiReady(state)) {
    hint = "靈契已滿！點上方「進階」分頁，突破至【通靈初期】。";
  }
  return `
    <div class="tutorial-banner" data-live="tutorial">
      <div class="tutorial-head">
        <span class="tutorial-step">${info.index}/${info.total}</span>
        <strong>${info.title}</strong>
        <button type="button" class="ghost tutorial-skip" data-act="skip-tutorial">跳過教學</button>
      </div>
      <p class="tutorial-hint">${hint}</p>
    </div>`;
}
