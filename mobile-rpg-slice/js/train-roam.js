/**
 * 練功掛機 roam 舞台：呈現／遭遇站位，唔改戰鬥數值。
 * Layout lock（portrait 9:16）：左友右敵、中帶走廊留空；角色帶約 38–58%。
 */

export const ROAM_WALK_MS = 880;
/** 清波後沿走廊前進（背景下移），單位仍鎖左右 */
export const ROAM_STEP_PY = 42;
/** 角色帶相對錨點的 Y 擺幅（38–58% 中段） */
export const ROAM_Y_MIN = -40;
export const ROAM_Y_MAX = 40;
/** 距畫面中心最少 px，避免單位塞死中 */
export const ROAM_CENTER_CLEAR_X = 72;
/** 友軍錨（左）／敵軍錨（右），相對舞台中心 */
export const ROAM_ALLY_ANCHOR_X = -118;
export const ROAM_FOE_ANCHOR_X = 118;

/** 走廊前進（螢幕 +y 下）。單位 facing 永遠向右打敵，唔跟路向左右掉轉。 */
export const ROAM_PATH = [
  { dx: 0, dy: 1 },
  { dx: 0.08, dy: 1 },
  { dx: -0.08, dy: 1 },
  { dx: 0.05, dy: 1 },
  { dx: -0.05, dy: 1 },
];

export function roamPathIndex(waveIndex = 0) {
  const n = ROAM_PATH.length;
  const i = waveIndex | 0;
  return ((i % n) + n) % n;
}

function clampRoamY(y) {
  return Math.max(ROAM_Y_MIN, Math.min(ROAM_Y_MAX, y));
}

/** 永遠 faceRight：友軍 scaleX(-1) 向右；敵立繪向左、唔 flip。 */
export function roamHeading(waveIndex = 0) {
  return {
    dx: 1,
    dy: 0,
    faceRight: true,
    pathIndex: roamPathIndex(waveIndex),
  };
}

/**
 * 背景沿走廊微移。walkT=0 停喺上一波鏡頭；1 為已到達。
 */
export function roamBgShift(waveIndex = 0, walkT = 1) {
  const t = Math.max(0, Math.min(1, Number(walkT)));
  const idx = Math.max(0, waveIndex | 0);
  const steps = Math.max(0, idx - 1 + t);
  return { x: 0, y: -steps * ROAM_STEP_PY };
}

/**
 * 友軍鎖左邊，前排稍向中（對敵），slot 沿角色帶垂直排。
 */
export function roamAllyOffset(slot, lane, _heading) {
  const towardFoes = lane === "front" ? 18 : -6;
  const stack = ((slot | 0) - 1) * 36;
  return {
    x: ROAM_ALLY_ANCHOR_X + towardFoes,
    y: clampRoamY(stack),
  };
}

/**
 * 敵軍鎖右邊，沿角色帶上下散開。中帶走廊保持淨空。
 */
export function roamFoeOffset(index, count, _heading, role = "normal") {
  const n = Math.max(1, count | 0);
  const i = Math.max(0, index | 0);
  const t = n <= 1 ? 0.35 : i / (n - 1);
  const stack = (t - 0.35) * 70;
  const extra = role === "boss" ? 10 : role === "elite" ? 4 : 0;
  return {
    x: ROAM_FOE_ANCHOR_X + extra + (i % 2) * 6,
    y: clampRoamY(stack),
  };
}

/**
 * @param {{ allies?: {slot:number,lane:string,unit?:object}[], foes?: {unit?:object,role?:string}[], waveIndex?: number, walkT?: number }} spec
 */
export function roamLayoutFromUnits(spec = {}) {
  const waveIndex = spec.waveIndex | 0;
  const walkT = spec.walkT == null ? 1 : spec.walkT;
  const heading = roamHeading(waveIndex);
  const bg = roamBgShift(waveIndex, walkT);
  const allies = (spec.allies || []).map((a) => {
    const pos = roamAllyOffset(a.slot, a.lane, heading);
    return { ...a, x: pos.x, y: pos.y };
  });
  const foeList = spec.foes || [];
  const foes = foeList.map((f, i) => {
    const role = f.role || f.unit?.role || "normal";
    const pos = roamFoeOffset(i, foeList.length, heading, role);
    return { ...f, x: pos.x, y: pos.y };
  });
  return { heading, bg, allies, foes };
}

export const ROAM_IDLE_SCENE_SRC = "./assets/bg/scenes/bg_idle_home_reef_1080x1920.webp";
export const ROAM_DUNGEON_SCENE_SRC = "./assets/bg/scenes/bg_dungeon_tide_path_1080x1920.webp";
export const ROAM_ALLY_PLACEHOLDER_SRC = "./assets/allies/ally_jelly_idle.png";
export const ROAM_FOE_FOAM_SRC = "./assets/enemies/enemy_foamblob_idle.png";
export const ROAM_FOE_CRAB_SRC = "./assets/enemies/enemy_reefcrab_idle.png";

/** Hang foes: foam = normal even, crab = odd / elite / boss. Dungeon roster 唔用。 */
export function roamFoePlaceholderSrc(unit, index = 0) {
  const role = unit?.role || "normal";
  if (role === "elite" || role === "boss") return ROAM_FOE_CRAB_SRC;
  return (index | 0) % 2 === 1 ? ROAM_FOE_CRAB_SRC : ROAM_FOE_FOAM_SRC;
}
