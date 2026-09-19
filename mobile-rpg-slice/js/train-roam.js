/**
 * 練功掛機 roam v2：Stone Age idle 呈現層（唔改戰鬥數值）。
 * 鏡頭跟隊伍（偏畫面中）；波間行圖；敵喺前／側刷新；雙方走向會合點對峙；清完再行。
 * 視差 far < mid < near 跟步行一齊郁；地面格只係輔助。
 */

export const ROAM_WALK_MS = 1120;

/** 每波世界行程（鏡頭沿路前進） */
export const ROAM_WAVE_SPAN = 168;
/** 遭遇前步行距離 */
export const ROAM_WALK_SPAN = 120;
/** 會合點相對本波原點 */
export const ROAM_MEET_SPAN = 148;

/** 步行時隊伍略偏中（唔鎖左牆） */
export const ROAM_PARTY_BIAS_X = -22;
/** 會合對峙：近中場左右，唔係永久柱牆 */
export const ROAM_ALLY_MEET_X = -38;
export const ROAM_FOE_MEET_X = 46;
/** @deprecated v1 錨點；v2 會合位 */
export const ROAM_ALLY_ANCHOR_X = ROAM_ALLY_MEET_X;
export const ROAM_FOE_ANCHOR_X = ROAM_FOE_MEET_X;

/** 敵刷新：會合點再前方（側向有隨機） */
export const ROAM_SPAWN_AHEAD = 214;
export const ROAM_SPAWN_JITTER = 48;
export const ROAM_SPAWN_SIDE = 40;
/** 世界單位／ms：同行圖步行速。敵入場用呢個速走近，唔好 dash。 */
export const ROAM_WALK_SPEED = ROAM_WALK_SPAN / ROAM_WALK_MS;
/** 雙方走向會合點：距離 ÷ 步行速（典型 spawn）。實際播放用 roamApproachDurationMs。 */
export const ROAM_APPROACH_MS = Math.round((ROAM_SPAWN_AHEAD - ROAM_FOE_MEET_X) / ROAM_WALK_SPEED);
/** @deprecated 用 ROAM_APPROACH_MS — 雙方走向會合點 */
export const ROAM_ENTER_MS = ROAM_APPROACH_MS;
export const ROAM_ENTER_STAGGER_MS = 90;

/** 鏡頭行程視差比例：遠最慢，近跟隊伍 */
export const ROAM_FAR_FACTOR = 0.22;
export const ROAM_MID_FACTOR = 0.55;
export const ROAM_NEAR_FACTOR = 1;
/** 地面格輔助，必須細過近景位移 */
export const ROAM_GROUND_ASSIST = 0.28;
export const ROAM_PARALLAX_LOOP = 480;

/** 步行時各層輕微上下擺（輔助，主位移係 X） */
export const ROAM_FAR_PY = 7;
export const ROAM_MID_PY = 12;
export const ROAM_NEAR_PY = 5;
export const ROAM_GROUND_PY = ROAM_NEAR_PY;
export const ROAM_GROUND_SLIDE_PY = 16;

/** @deprecated v1 短行擺幅 */
export const ROAM_ALLY_TRAVEL_X = 8;
export const ROAM_ALLY_TRAVEL_Y = 10;

export const ROAM_FOE_ENTER_DX = ROAM_SPAWN_AHEAD;
export const ROAM_FOE_ENTER_DY = ROAM_SPAWN_SIDE;

export const ROAM_Y_MIN = -40;
export const ROAM_Y_MAX = 40;
/** 會合對峙最少間距（唔再係走廊牆） */
export const ROAM_CENTER_CLEAR_X = 20;

/** 沿圖向右行；每波輕微上下擺路徑 */
export const ROAM_PATH = [
  { dx: 1, dy: 0 },
  { dx: 1, dy: 0.08 },
  { dx: 1, dy: -0.08 },
  { dx: 1, dy: 0.05 },
  { dx: 1, dy: -0.05 },
];

export function roamPathIndex(waveIndex = 0) {
  const n = ROAM_PATH.length;
  const i = waveIndex | 0;
  return ((i % n) + n) % n;
}

function clamp01(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function clampRoamY(y) {
  return Math.max(ROAM_Y_MIN, Math.min(ROAM_Y_MAX, y));
}

/** 步行插值：直線，同隊伍行圖。唔用 easeInOut，避免中段衝滑。 */
function walkLerp(t) {
  return clamp01(t);
}

function walkPulse(walkT = 1) {
  const t = clamp01(walkT);
  if (t <= 0 || t >= 1) return 0;
  return Math.sin(t * Math.PI);
}

function roamHash(waveIndex, index) {
  let n = (((waveIndex | 0) * 374761 + (index | 0) * 16807 + 11) >>> 0);
  n = (n ^ (n << 13)) >>> 0;
  n = (n ^ (n >> 17)) >>> 0;
  n = (n ^ (n << 5)) >>> 0;
  return n >>> 0;
}

export function roamPhaseOf(spec = {}) {
  const named = spec.phase;
  if (named === "walk" || named === "approach" || named === "fight") return named;
  if (spec.hideFoes) return "walk";
  if (spec.approachT != null && Number(spec.approachT) < 1) return "approach";
  const walkT = spec.walkT == null ? 1 : Number(spec.walkT);
  if (walkT < 1) return "walk";
  return "fight";
}

export function roamWaveOrigin(waveIndex = 0) {
  return (waveIndex | 0) * ROAM_WAVE_SPAN;
}

export function roamMeetWorldX(waveIndex = 0) {
  return roamWaveOrigin(waveIndex) + ROAM_MEET_SPAN;
}

export function roamHeading(waveIndex = 0, spec = {}) {
  const pathIndex = roamPathIndex(waveIndex);
  const path = ROAM_PATH[pathIndex] || ROAM_PATH[0];
  const phase = roamPhaseOf({ waveIndex, ...spec });
  return {
    dx: 1,
    dy: path.dy || 0,
    faceRight: true,
    pathIndex,
    phase,
  };
}

/**
 * 鏡頭跟隊伍世界 X。步行時隊伍落喺偏中；對峙時鎖會合點。
 */
export function roamCamera(spec = {}) {
  const waveIndex = spec.waveIndex | 0;
  const phase = roamPhaseOf(spec);
  const origin = roamWaveOrigin(waveIndex);
  const walkT = clamp01(spec.walkT == null ? (phase === "walk" ? 0 : 1) : spec.walkT);
  const approachT = clamp01(spec.approachT == null ? (phase === "approach" ? 0 : 1) : spec.approachT);
  const heading = roamHeading(waveIndex, spec);
  const pathY = heading.dy * 14;
  if (phase === "walk") {
    const partyWorld = origin + walkT * ROAM_WALK_SPAN;
    return { x: partyWorld - ROAM_PARTY_BIAS_X, y: pathY, phase };
  }
  if (phase === "approach") {
    const start = origin + ROAM_WALK_SPAN - ROAM_PARTY_BIAS_X;
    const end = roamMeetWorldX(waveIndex);
    return { x: start + (end - start) * walkLerp(approachT), y: pathY * (1 - approachT * 0.35), phase };
  }
  return { x: roamMeetWorldX(waveIndex), y: pathY * 0.35, phase };
}

export function roamWorldToScreen(worldX, worldY, cam) {
  return {
    x: worldX - (cam?.x || 0),
    y: (worldY || 0) - (cam?.y || 0),
  };
}

function wrapParallax(v) {
  const loop = ROAM_PARALLAX_LOOP;
  let x = v % loop;
  if (x > loop / 2) x -= loop;
  if (x < -loop / 2) x += loop;
  return x;
}

/**
 * 三層視差跟鏡頭行圖。休息／對峙唔歸零——鏡頭停喺會合點。
 * groundSlide 只係格線輔助，幅度細過 near。
 */
export function roamBgShift(waveIndex = 0, walkT = 1, spec = {}) {
  const phase = roamPhaseOf({ waveIndex, walkT, ...spec });
  const cam = roamCamera({ waveIndex, walkT, phase, ...spec });
  const farX = wrapParallax(-cam.x * ROAM_FAR_FACTOR);
  const midX = wrapParallax(-cam.x * ROAM_MID_FACTOR);
  const nearX = wrapParallax(-cam.x * ROAM_NEAR_FACTOR);
  const groundSlide = wrapParallax(cam.x * ROAM_GROUND_ASSIST);
  const t = phase === "walk" ? clamp01(walkT) : 0;
  const pulse = walkPulse(t);
  return {
    x: midX,
    y: 0,
    farX,
    midX,
    nearX,
    farY: -pulse * ROAM_FAR_PY,
    midY: -pulse * ROAM_MID_PY,
    nearY: -pulse * ROAM_NEAR_PY,
    groundSlide,
    camX: cam.x,
    camY: cam.y,
    phase,
  };
}

function allyFormation(slot, lane) {
  const toward = lane === "front" ? 10 : -8;
  const stack = ((slot | 0) - 1) * 26;
  return { x: toward, y: clampRoamY(stack) };
}

/**
 * 會合對峙：隊伍偏中場左側。
 */
export function roamAllyOffset(slot, lane, _heading) {
  const form = allyFormation(slot, lane);
  return {
    x: ROAM_ALLY_MEET_X + form.x,
    y: form.y,
  };
}

/**
 * 步行：隊伍留喺畫面偏中，步態輕微擺（真正行程喺鏡頭／視差）。
 */
export function roamAllyWalkOffset(slot, lane, heading, walkT = 1) {
  const form = allyFormation(slot, lane);
  const pulse = walkPulse(walkT);
  const pathY = (heading?.dy || 0) * 10;
  return {
    x: ROAM_PARTY_BIAS_X + form.x + pulse * ROAM_ALLY_TRAVEL_X,
    y: clampRoamY(form.y + pathY + pulse * ROAM_ALLY_TRAVEL_Y),
  };
}

/**
 * 會合對峙：敵群偏中場右側，沿角色帶散開。
 */
export function roamFoeOffset(index, count, _heading, role = "normal") {
  const n = Math.max(1, count | 0);
  const i = Math.max(0, index | 0);
  const t = n <= 1 ? 0.35 : i / (n - 1);
  const stack = (t - 0.35) * 70;
  const extra = role === "boss" ? 8 : role === "elite" ? 4 : 0;
  return {
    x: ROAM_FOE_MEET_X + extra + (i % 2) * 5,
    y: clampRoamY(stack),
  };
}

/**
 * 敵喺路徑前方／側面刷新（wave+index 決定，可重現）。
 */
export function roamFoeSpawn(index = 0, count = 1, waveIndex = 0, role = "normal") {
  const h = roamHash(waveIndex, index);
  const lane = h % 5;
  const ahead = ROAM_SPAWN_AHEAD + (h % (ROAM_SPAWN_JITTER + 1)) + (lane >= 3 ? 16 + (h % 20) : h % 10);
  let sideY = 6;
  if (lane === 1) sideY = -ROAM_SPAWN_SIDE;
  else if (lane === 2) sideY = ROAM_SPAWN_SIDE;
  else if (lane === 3) sideY = -Math.round(ROAM_SPAWN_SIDE * 0.48);
  else if (lane === 4) sideY = Math.round(ROAM_SPAWN_SIDE * 0.58);
  const fight = roamFoeOffset(index, count, null, role);
  return {
    ahead,
    y: clampRoamY(sideY + ((index % 2) ? 4 : -2)),
    lane,
    fightX: fight.x,
    fightY: fight.y,
  };
}

/** 敵走近會合點嘅世界距離（spawn ahead → meet slot）。 */
export function roamFoeApproachDist(index = 0, count = 1, waveIndex = 0, role = "normal") {
  const spawn = roamFoeSpawn(index, count, waveIndex, role);
  const fight = roamFoeOffset(index, count, null, role);
  return Math.max(0, spawn.ahead - fight.x);
}

/**
 * 入場時長：最遠嗰隻敵用隊伍步行速行完。直線走進，唔好短過一行圖。
 */
export function roamApproachDurationMs(foeCount = 1, waveIndex = 0, roles = []) {
  const n = Math.max(1, foeCount | 0);
  let dist = ROAM_SPAWN_AHEAD - ROAM_FOE_MEET_X;
  for (let i = 0; i < n; i += 1) {
    const role = roles[i] || "normal";
    dist = Math.max(dist, roamFoeApproachDist(i, n, waveIndex, role));
  }
  return Math.round(Math.max(ROAM_WALK_MS, dist / ROAM_WALK_SPEED));
}

/** 刷新點相對會合點再偏前（出畫面／霧外）。 */
export function roamFoeEnterDx(index = 0, waveIndex = 0) {
  return roamFoeSpawn(index, 1, waveIndex).ahead;
}

export function roamFoeEnterDy(index = 0, waveIndex = 0) {
  return roamFoeSpawn(index, 1, waveIndex).y;
}

function allyWorldX(waveIndex, phase, walkT, approachT, formX) {
  const origin = roamWaveOrigin(waveIndex);
  const walkWorld = origin + clamp01(walkT) * ROAM_WALK_SPAN + formX;
  const fightWorld = roamMeetWorldX(waveIndex) + ROAM_ALLY_MEET_X + formX;
  if (phase === "walk") return walkWorld;
  if (phase === "approach") return walkWorld + (fightWorld - walkWorld) * walkLerp(approachT);
  return fightWorld;
}

function foeWorldX(waveIndex, phase, approachT, spawn, formX) {
  const meet = roamMeetWorldX(waveIndex);
  const spawnWorld = meet + spawn.ahead;
  const fightWorld = meet + formX;
  if (phase === "walk") return spawnWorld;
  if (phase === "approach") return spawnWorld + (fightWorld - spawnWorld) * walkLerp(approachT);
  return fightWorld;
}

function foeWorldY(phase, approachT, spawn, fightY) {
  if (phase === "walk") return spawn.y;
  if (phase === "approach") return spawn.y + (fightY - spawn.y) * walkLerp(approachT);
  return fightY;
}

/**
 * @param {{ allies?: {slot:number,lane:string,unit?:object}[], foes?: {unit?:object,role?:string}[], waveIndex?: number, walkT?: number, approachT?: number, phase?: string, hideFoes?: boolean }} spec
 */
export function roamLayoutFromUnits(spec = {}) {
  const waveIndex = spec.waveIndex | 0;
  const walkT = spec.walkT == null ? 1 : spec.walkT;
  const approachT = spec.approachT == null ? 1 : spec.approachT;
  const phase = roamPhaseOf(spec);
  const heading = roamHeading(waveIndex, { ...spec, phase, walkT, approachT });
  const cam = roamCamera({ waveIndex, walkT, approachT, phase });
  const bg = roamBgShift(waveIndex, walkT, { approachT, phase });
  const allies = (spec.allies || []).map((a) => {
    const form = allyFormation(a.slot, a.lane);
    const pulse = phase === "walk" ? walkPulse(walkT) : 0;
    const worldX = allyWorldX(waveIndex, phase, walkT, approachT, form.x);
    const worldY = form.y + heading.dy * 10 + pulse * ROAM_ALLY_TRAVEL_Y;
    const pos = roamWorldToScreen(worldX, worldY, cam);
    return { ...a, x: pos.x, y: clampRoamY(pos.y), faceRight: true, phase };
  });
  const foeList = spec.hideFoes ? [] : spec.foes || [];
  const foes = foeList.map((f, i) => {
    const role = f.role || f.unit?.role || "normal";
    const spawn = roamFoeSpawn(i, foeList.length, waveIndex, role);
    const fight = roamFoeOffset(i, foeList.length, heading, role);
    const worldX = foeWorldX(waveIndex, phase, approachT, spawn, fight.x);
    const worldY = foeWorldY(phase, approachT, spawn, fight.y);
    const pos = roamWorldToScreen(worldX, worldY, cam);
    return { ...f, x: pos.x, y: clampRoamY(pos.y), faceRight: false, phase, spawnLane: spawn.lane };
  });
  const allyCx = allies.length ? allies.reduce((s, a) => s + a.x, 0) / allies.length : ROAM_PARTY_BIAS_X;
  const foeCx = foes.length ? foes.reduce((s, f) => s + f.x, 0) / foes.length : 80;
  for (const a of allies) {
    a.faceRight = foes.length ? a.x < foeCx : true;
  }
  for (const f of foes) {
    f.faceRight = f.x < allyCx;
  }
  heading.faceRight = allies.some((a) => a.faceRight);
  heading.foeFaceRight = foes.some((f) => f.faceRight);
  return { heading, bg, cam, phase, allies, foes };
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
