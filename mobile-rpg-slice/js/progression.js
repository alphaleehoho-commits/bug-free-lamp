/**
 * 進度解鎖 — 取代教學鎖；由玩法里程碑開放功能
 */
import { stageAt } from "./data.js";

/** 建議首通秘境前練到呢個等級 */
export const PROGRESSION_DUNGEON_LEVEL = 3;

const MILESTONES = [
  { id: "first_pet", msg: "解鎖「靈寵 → 出戰」" },
  { id: "dungeon", msg: "解鎖「秘境」" },
  { id: "shop", msg: "解鎖「修行 → 商肆」" },
  { id: "breed", msg: "解鎖「繁殖」" },
  { id: "advance", msg: "解鎖「修行 → 進階」突破" },
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

export function canEnterDungeon(state) {
  return highestPetLevel(state) >= PROGRESSION_DUNGEON_LEVEL || (state.pets?.length || 0) >= 1;
}

export function hasClearedTide1(state) {
  return !!(state.clearedDungeons || {}).tide_1;
}

export function hasClearedTide2(state) {
  return !!(state.clearedDungeons || {}).tide_2;
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
      return realm >= 1;
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
  return state.progression;
}

/** 新達成里程碑 → 解鎖提示（每項只報一次） */
export function pollProgressionUnlocks(state) {
  const prog = ensureProgressionState(state);
  const msgs = [];
  for (const m of MILESTONES) {
    if (prog.announced[m.id]) continue;
    if (!isMilestoneMet(state, m.id)) continue;
    prog.announced[m.id] = true;
    msgs.push(m.msg);
  }
  if (!msgs.length) return null;
  return msgs.join(" · ");
}

export function progressionLocks(state) {
  const owned = ownedPetCount(state);
  const realm = state.realm | 0;
  const tabs = {};
  const cultivateSub = {};
  const partySub = {};
  const dungeonSub = {};

  if (!hasFirstPet(state)) {
    partySub.fight = true;
  }
  if (!canEnterDungeon(state)) {
    tabs.dungeon = true;
  }
  if (!hasClearedTide1(state)) {
    cultivateSub.shop = true;
  }
  if (realm < 1) {
    cultivateSub.advance = true;
  }
  if (!hasClearedTide2(state) && realm < 2) {
    partySub.dispatch = true;
  }
  if (realm < 2) {
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
    return `首寵升至 Lv.${PROGRESSION_DUNGEON_LEVEL} 或派出戰後解鎖`;
  }
  if (!hasClearedTide1(state) && kind === "cultivateSub" && id === "shop") {
    return "通關【潮汐廢墟 · 一層】後解鎖";
  }
  if ((state.realm | 0) < 1 && kind === "cultivateSub" && id === "advance") {
    return `突破至【${stageAt(1).name}】後解鎖`;
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
}
