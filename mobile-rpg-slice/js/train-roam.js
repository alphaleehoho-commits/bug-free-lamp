/**
 * 練功掛機 roam 舞台：呈現／遭遇站位，唔改戰鬥數值。
 * Layout lock（portrait 9:16）：左友右敵、中帶走廊留空；角色帶約 38–58%。
 */

export const ROAM_WALK_MS = 960;
/** 遠景層：波間極慢微移（px）。唔累積、唔全圖狂捲。 */
export const ROAM_FAR_PY = 6;
/** 近景／地面：跟隊伍短行一齊漂（比遠景明顯） */
export const ROAM_NEAR_PY = 16;
/** 友軍短行：沿走廊前進，仍鎖左邊 */
export const ROAM_ALLY_TRAVEL_X = 14;
export const ROAM_ALLY_TRAVEL_Y = 30;
/** @deprecated 地面跟近景 */
export const ROAM_GROUND_PY = ROAM_NEAR_PY;
/** @deprecated 舊全圖捲 */
export const ROAM_STEP_PY = ROAM_NEAR_PY;
/** 敵從右緣／霧外跑入（ms） */
export const ROAM_ENTER_MS = 680;
export const ROAM_ENTER_STAGGER_MS = 90;
/** 入場起點：相對休息位再偏右，出畫面（唔喺中央 pop） */
export const ROAM_FOE_ENTER_DX = 176;
/** 上／下霧入場擺幅 */
export const ROAM_FOE_ENTER_DY = 38;
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
 * 雙層視差：遠景極慢，近景／地面跟短行漂。休息位永遠 0（唔累積）。
 */
export function roamBgShift(_waveIndex = 0, walkT = 1) {
  const t = Math.max(0, Math.min(1, Number(walkT)));
  if (t <= 0 || t >= 1) return { x: 0, y: 0, farY: 0, nearY: 0 };
  const pulse = Math.sin(t * Math.PI);
  const farY = -pulse * ROAM_FAR_PY;
  const nearY = -pulse * ROAM_NEAR_PY;
  return { x: 0, y: farY, farY, nearY };
}

/** 敵入場由休息位再偏右（出畫面／側霧），跑向隊伍正面。永不由中央出現。 */
export function roamFoeEnterDx(_index = 0) {
  return ROAM_FOE_ENTER_DX;
}

/** 0＝右側霧，1＝上霧，2＝下霧（循環）。 */
export function roamFoeEnterDy(index = 0) {
  const lane = ((index | 0) % 3 + 3) % 3;
  if (lane === 1) return -ROAM_FOE_ENTER_DY;
  if (lane === 2) return ROAM_FOE_ENTER_DY;
  return 8;
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

function walkPulse(walkT = 1) {
  const t = Math.max(0, Math.min(1, Number(walkT)));
  if (t <= 0 || t >= 1) return 0;
  return Math.sin(t * Math.PI);
}

/**
 * 波間短行：沿走廊走出一步再回休息位。x 永遠清中帶。
 */
export function roamAllyWalkOffset(slot, lane, heading, walkT = 1) {
  const rest = roamAllyOffset(slot, lane, heading);
  const pulse = walkPulse(walkT);
  if (!pulse) return rest;
  const x = Math.min(-ROAM_CENTER_CLEAR_X - 8, rest.x + pulse * ROAM_ALLY_TRAVEL_X);
  const y = clampRoamY(rest.y + pulse * ROAM_ALLY_TRAVEL_Y);
  return { x, y };
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
    const pos = roamAllyWalkOffset(a.slot, a.lane, heading, walkT);
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
