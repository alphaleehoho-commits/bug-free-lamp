/**
 * 練功掛機 roam 舞台：只負責呈現／遭遇站位，唔改戰鬥數值。
 * 鏡頭跟隊伍；隊伍大致置中；清波後沿路徑行去下一方向再遇下一波。
 */

export const ROAM_WALK_MS = 880;
/** 每步鏡頭平移（背景反向） */
export const ROAM_STEP_PX = 86;
export const ROAM_STEP_PY = 38;
/** 單位相對隊伍中心的 Y 上限，留低段 HUD */
export const ROAM_Y_MIN = -64;
export const ROAM_Y_MAX = 28;

/**
 * 循環路向（螢幕座標：+x 右、+y 下）。
 * 有左有右，方便友軍按敵群方向翻面。
 */
export const ROAM_PATH = [
  { dx: 1, dy: 0.1 },
  { dx: 0.32, dy: 0.92 },
  { dx: -1, dy: 0.18 },
  { dx: -0.42, dy: -0.86 },
  { dx: 0.78, dy: -0.38 },
];

export function roamPathIndex(waveIndex = 0) {
  const n = ROAM_PATH.length;
  const i = waveIndex | 0;
  return ((i % n) + n) % n;
}

function normalize(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return { dx: dx / len, dy: dy / len };
}

function clampRoamY(y) {
  return Math.max(ROAM_Y_MIN, Math.min(ROAM_Y_MAX, y));
}

/** 本波行進／遇敵方向。dx≥0 → 敵在右，友軍要 flip 面向右。 */
export function roamHeading(waveIndex = 0) {
  const step = ROAM_PATH[roamPathIndex(waveIndex)] || ROAM_PATH[0];
  const n = normalize(step.dx, step.dy);
  return {
    dx: n.dx,
    dy: n.dy,
    faceRight: n.dx >= 0,
    pathIndex: roamPathIndex(waveIndex),
  };
}

/**
 * 背景位移：已到達波次 walkT=1；清波起步 walkT=0（仍停喺上一波鏡頭）。
 * 鏡頭跟隊：背景反向移，隊伍視覺上維持置中。
 */
export function roamBgShift(waveIndex = 0, walkT = 1) {
  const t = Math.max(0, Math.min(1, Number(walkT)));
  const idx = Math.max(0, waveIndex | 0);
  const steps = Math.max(0, idx - 1 + t);
  let x = 0;
  let y = 0;
  const whole = Math.floor(steps);
  const frac = steps - whole;
  for (let i = 0; i < whole; i += 1) {
    const h = roamHeading(i + 1);
    x -= h.dx * ROAM_STEP_PX;
    y -= h.dy * ROAM_STEP_PY;
  }
  if (frac > 0) {
    const h = roamHeading(whole + 1);
    x -= h.dx * ROAM_STEP_PX * frac;
    y -= h.dy * ROAM_STEP_PY * frac;
  }
  return { x, y };
}

/**
 * 友軍簇：前排沿行進方向靠近敵群，後排在後；slot 沿垂直方向排。
 */
export function roamAllyOffset(slot, lane, heading) {
  const h = heading || roamHeading(0);
  const along = lane === "front" ? 26 : -24;
  const perp = ((slot | 0) - 1.15) * 48;
  const px = -h.dy;
  const py = h.dx;
  return {
    x: h.dx * along + px * perp,
    y: clampRoamY(h.dy * along * 0.4 + py * perp * 0.28),
  };
}

/**
 * 敵群喺隊伍前方展開成弧（「圍住」但唔跌入低段 HUD）。
 * 敵立繪永遠向左，此函式只算座標。
 */
export function roamFoeOffset(index, count, heading, role = "normal") {
  const h = heading || roamHeading(0);
  const n = Math.max(1, count | 0);
  const i = Math.max(0, index | 0);
  const t = n <= 1 ? 0.5 : i / (n - 1);
  const spread = (t - 0.5) * 1.28;
  const base = role === "boss" ? 112 : role === "elite" ? 100 : 92;
  const dist = base + (i % 2) * 18;
  const ang = Math.atan2(h.dy, h.dx) + spread;
  return {
    x: Math.cos(ang) * dist,
    y: clampRoamY(Math.sin(ang) * dist * 0.34),
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
