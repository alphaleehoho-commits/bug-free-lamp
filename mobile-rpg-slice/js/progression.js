/**
 * 進度解鎖 — 取代教學鎖；由玩法里程碑開放功能
 */
import { stageAt, nextStageAt, upgradeMatCost, upgradeStoneCost } from "./data.js";

/** 建議首通秘境前練到呢個等級 */
export const PROGRESSION_DUNGEON_LEVEL = 3;

const MILESTONES = [
  { id: "first_pet", msg: "解鎖「靈寵 → 出戰」" },
  { id: "dungeon", msg: "解鎖「秘境」" },
  { id: "shop", msg: "解鎖「修行 → 商肆」· 素材用於升級／繁殖" },
  { id: "breed", msg: "解鎖「繁殖」" },
  { id: "advance", msg: "解鎖「修行 → 進階」· 靈契已足可突破" },
  { id: "dispatch", msg: "解鎖「靈寵 → 派遣」" },
  { id: "codex", msg: "解鎖「圖鑑」" },
  { id: "tactics", msg: "解鎖「秘境 → 戰術」" },
];

export function ownedPetCount(state) {
  return (state.pets?.length || 0) + (state.ranch?.length || 0);
}

export function highestPetLevel(state) {
  let max = 0;
  for (const p of [...(state.pets || []), ...(state.ranch || [])]) {
    max = Math.max(max, p.level ?? 1);
  }
  return max;
}

export function hasFirstPet(state) {
  return ownedPetCount(state) >= 1;
}

/** 秘境：只認首寵 Lv≥3（唔再用「出戰就開」捷徑） */
export function canEnterDungeon(state) {
  return highestPetLevel(state) >= PROGRESSION_DUNGEON_LEVEL;
}

export function hasClearedTide1(state) {
  return !!(state.clearedDungeons || {}).tide_1;
}

export function hasClearedTide2(state) {
  return !!(state.clearedDungeons || {}).tide_2;
}

/** 靈契達下一階門檻 → 可進「進階」分頁突破 */
export function canAccessAdvanceSub(state) {
  const next = nextStageAt(state.realm | 0);
  return (state.qi || 0) >= next.need;
}

export function progressionQiBreakReady(state) {
  return canAccessAdvanceSub(state);
}

export function isFreshOnboarding(state) {
  return !hasFirstPet(state) && (state.combatsWon || 0) === 0 && (state.realm | 0) === 0;
}

export function petCanUpgrade(state, pet) {
  if (!pet) return false;
  const lv = pet.level ?? 1;
  const mats = upgradeMatCost(lv);
  for (const [id, n] of Object.entries(mats)) {
    if (n > 0 && Math.floor(state.materials?.[id] || 0) < n) return false;
  }
  return (state.stones || 0) >= upgradeStoneCost(lv);
}

export function isMilestoneMet(state, id) {
  const owned = ownedPetCount(state);
  const realm = state.realm | 0;
  switch (id) {
    case "first_pet":
      return owned >= 1;
    case "dungeon":
      return canEnterDungeon(state);
    case "shop":
      return hasClearedTide1(state);
    case "breed":
      return owned >= 2;
    case "advance":
      return canAccessAdvanceSub(state);
    case "dispatch":
      return hasClearedTide2(state) || realm >= 2;
    case "codex":
      return realm >= 2;
    case "tactics":
      return realm >= 2;
    default:
      return false;
  }
}

function ensureProgressionState(state) {
  if (!state.progression) state.progression = { announced: {} };
  if (!state.progression.announced) state.progression.announced = {};
  if (!state.progression.eggReady) state.progression.eggReady = {};
  return state.progression;
}

/** 新達成里程碑 → 解鎖提示（每項只報一次），回傳陣列供 queue */
export function pollProgressionUnlocks(state) {
  const prog = ensureProgressionState(state);
  const msgs = [];
  for (const m of MILESTONES) {
    if (prog.announced[m.id]) continue;
    if (!isMilestoneMet(state, m.id)) continue;
    prog.announced[m.id] = true;
    msgs.push(m.msg);
    if (m.id === "shop") {
      msgs.push("第二隻靈寵：秘境契約靈寵，或商肆購蛋");
    }
  }
  return msgs;
}

/** 蛋孵化完成 → 提示去牧場領取（每顆蛋一次） */
export function pollEggReadyNotices(state) {
  const prog = ensureProgressionState(state);
  const msgs = [];
  const now = Date.now();
  for (const e of state.eggs || []) {
    if (!e?.uid || e.claimed) continue;
    if (e.startedAt == null || (e.readyAt || 0) > now) continue;
    if (prog.eggReady[e.uid]) continue;
    prog.eggReady[e.uid] = true;
    msgs.push(`【${e.name || "潮霧蛋"}】已孵化完成！靈寵 → 牧場 → 領取`);
  }
  return msgs;
}

/** 主線下一步（單行 HUD） */
export function nextGoalHint(state) {
  const eggs = state.eggs || [];
  const now = Date.now();
  const eggHatching = eggs.some((e) => e.startedAt != null && (e.readyAt || 0) > now);
  const eggReady = eggs.some((e) => e.startedAt != null && (e.readyAt || 0) <= now);

  if (!hasFirstPet(state)) {
    if (eggReady) return "下一步：靈寵 → 牧場 → 領取首寵";
    if (eggHatching) return "潮霧蛋孵化中 · 可先修行練功 · 完成後去牧場領取";
    return "下一步：靈寵 → 牧場 → 開始孵化／領取";
  }

  const lv = highestPetLevel(state);
  if (lv < PROGRESSION_DUNGEON_LEVEL) {
    const target = [...(state.pets || []), ...(state.ranch || [])].find(
      (p) => (p.level ?? 1) < PROGRESSION_DUNGEON_LEVEL
    );
    if (target && petCanUpgrade(state, target)) {
      return `下一步：靈寵 → 牧場 → 詳情 → 升級（目標 Lv.${PROGRESSION_DUNGEON_LEVEL}）`;
    }
    return `下一步：潮岸練功攞潮露，將首寵升至 Lv.${PROGRESSION_DUNGEON_LEVEL}`;
  }

  if (!canEnterDungeon(state)) {
    return `下一步：首寵升至 Lv.${PROGRESSION_DUNGEON_LEVEL}`;
  }

  if ((state.pets?.length || 0) < 1) {
    return "下一步：靈寵 → 牧場 → 出戰，再挑戰秘境";
  }

  if (!hasClearedTide1(state)) {
    return "下一步：秘境 → 挑戰【潮汐廢墟 · 一層】";
  }

  if (ownedPetCount(state) < 2) {
    return "下一步：商肆購蛋，或秘境契約第二隻靈寵";
  }

  if (!canAccessAdvanceSub(state)) {
    const next = nextStageAt(state.realm | 0);
    return `下一步：契壇掛機累積靈契（${Math.floor(state.qi || 0)} / ${next.need}）`;
  }

  if ((state.realm | 0) < 1) {
    return "下一步：修行 → 進階 → 突破至【通靈初期】";
  }

  return "";
}

export function progressionLocks(state) {
  const partySub = {};
  const dungeonSub = {};
  const cultivateSub = {};

  if (!hasFirstPet(state)) {
    partySub.fight = true;
  }
  if (!canEnterDungeon(state)) {
    /* tabs.dungeon set below */
  }
  if (!hasClearedTide1(state)) {
    cultivateSub.shop = true;
  }
  if (!canAccessAdvanceSub(state)) {
    cultivateSub.advance = true;
  }
  if (!hasClearedTide2(state) && (state.realm | 0) < 2) {
    partySub.dispatch = true;
  }

  const tabs = {};
  if (!canEnterDungeon(state)) {
    tabs.dungeon = true;
  }
  if ((state.realm | 0) < 2) {
    tabs.codex = true;
    dungeonSub.setup = true;
  }

  return {
    tabs,
    cultivateSub,
    partySub,
    dungeonSub,
    trainSites: false,
  };
}

export function lockReason(state, kind, id) {
  if (!isMilestoneMet(state, "first_pet") && kind === "partySub" && id === "fight") {
    return "領取首隻靈寵後解鎖";
  }
  if (!canEnterDungeon(state) && kind === "tab" && id === "dungeon") {
    return `首寵升至 Lv.${PROGRESSION_DUNGEON_LEVEL} 後解鎖秘境`;
  }
  if (!hasClearedTide1(state) && kind === "cultivateSub" && id === "shop") {
    return "通關【潮汐廢墟 · 一層】後解鎖";
  }
  if (!canAccessAdvanceSub(state) && kind === "cultivateSub" && id === "advance") {
    const next = nextStageAt(state.realm | 0);
    return `靈契達 ${next.need} 後解鎖（目前 ${Math.floor(state.qi || 0)}）`;
  }
  if (!isMilestoneMet(state, "dispatch") && kind === "partySub" && id === "dispatch") {
    return "通關二層或達通靈後期後解鎖";
  }
  if ((state.realm | 0) < 2 && kind === "tab" && id === "codex") {
    return `達【${stageAt(2).name}】後解鎖`;
  }
  if ((state.realm | 0) < 2 && kind === "dungeonSub" && id === "setup") {
    return `達【${stageAt(2).name}】後解鎖戰術`;
  }
  return "";
}

export function isTabLocked(state, tabId) {
  return !!progressionLocks(state).tabs[tabId];
}

export function isCultivateSubLocked(state, subId) {
  if (subId === "gear") return true;
  return !!progressionLocks(state).cultivateSub[subId];
}

export function isPartySubLocked(state, subId) {
  return !!progressionLocks(state).partySub[subId];
}

export function isDungeonSubLocked(state, subId) {
  return !!progressionLocks(state).dungeonSub[subId];
}

export function areTrainSitesLocked(state) {
  return !!progressionLocks(state).trainSites;
}

export function isBreedLocked(state) {
  return ownedPetCount(state) < 2;
}

export function breedLockReason(state) {
  return isBreedLocked(state) ? "擁有 2 隻靈寵後解鎖繁殖" : "";
}

/** 載入時標記已達成里程碑，避免舊存檔首次啟動連彈解鎖提示 */
export function healProgressionAnnouncements(state) {
  const prog = ensureProgressionState(state);
  for (const m of MILESTONES) {
    if (isMilestoneMet(state, m.id)) prog.announced[m.id] = true;
  }
  for (const e of state.eggs || []) {
    if (e?.uid && e.startedAt != null && (e.readyAt || 0) <= Date.now()) {
      prog.eggReady[e.uid] = true;
    }
  }
}
