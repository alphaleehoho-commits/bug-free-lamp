/** Data tables — 靈寵修行 */

export const STAGES = [
  { id: 0, name: "初契", need: 0, rate: 1.05 },
  { id: 1, name: "通靈初期", need: 55, rate: 1.35 },
  { id: 2, name: "通靈後期", need: 200, rate: 1.75 },
  { id: 3, name: "御靈", need: 520, rate: 2.2 },
  { id: 4, name: "靈主", need: 1400, rate: 2.8 },
  { id: 5, name: "潮主", need: 3200, rate: 3.5 },
];

export const REALMS = STAGES;

/** 固定表最後一階（潮主）；之後用公式延伸 */
export const STAGE_FORMULA_BASE = 5;

/** 修行階段（0..∞）：固定表 + 指數公式 */
export function stageAt(realmId) {
  const id = Math.max(0, realmId | 0);
  if (id < STAGES.length) return { ...STAGES[id] };
  const extra = id - STAGE_FORMULA_BASE;
  const baseNeed = STAGES[STAGE_FORMULA_BASE].need;
  const baseRate = STAGES[STAGE_FORMULA_BASE].rate;
  return {
    id,
    name: `潮主·${id - STAGE_FORMULA_BASE}重`,
    need: Math.round(baseNeed * Math.pow(1.72, extra)),
    rate: Math.round((baseRate + extra * 0.28) * 10) / 10,
  };
}

export function nextStageAt(realmId) {
  return stageAt((realmId | 0) + 1);
}

/**
 * 晉升至目標階段的額外門檻（靈契仍用 STAGES[target].need）
 * costs: 突破時扣除；checks: 硬性條件
 */
export const BREAKTHROUGH_GATES = {
  1: {
    costs: { stones: 20 },
    checks: [
      { type: "owned_pets", need: 1, label: "擁有靈寵 ≥ 1" },
    ],
  },
  2: {
    costs: { stones: 60, scrap: 1 },
    checks: [
      { type: "cleared", dungeonId: "tide_1", label: "通關【潮汐廢墟·一層】" },
      { type: "owned_pets", need: 2, label: "擁有靈寵 ≥ 2" },
      { type: "bestiary", need: 3, label: "圖鑑登錄 ≥ 3 格" },
    ],
  },
  3: {
    costs: { stones: 140, scrap: 3, dust: 12 },
    checks: [
      { type: "cleared", dungeonId: "tide_2", label: "通關【二層】" },
      { type: "combats", need: 8, label: "累計秘境勝場 ≥ 8" },
      { type: "breeds", need: 1, label: "繁殖次數 ≥ 1" },
      { type: "bestiary", need: 12, label: "圖鑑登錄 ≥ 12 格" },
    ],
  },
  4: {
    costs: { stones: 280, scrap: 5, dust: 28, feed: 16 },
    checks: [
      { type: "cleared", dungeonId: "tide_3", label: "通關【心核】" },
      { type: "hybrid_owned", need: 1, label: "擁有雜交種 ≥ 1" },
      { type: "fusions", need: 1, label: "完成融合 ≥ 1" },
      { type: "bestiary", need: 40, label: "圖鑑登錄 ≥ 40 格" },
      { type: "min_gen", gen: 1, label: "擁有 ≥ 1 代寵" },
    ],
  },
  5: {
    costs: { stones: 520, scrap: 8, dust: 48, feed: 32 },
    checks: [
      { type: "cleared", dungeonId: "tide_4", label: "通關【潮汐深層】" },
      { type: "min_gen", gen: 2, label: "擁有 ≥ 2 代寵" },
      { type: "breeds", need: 5, label: "繁殖次數 ≥ 5" },
      { type: "hybrid_owned", need: 2, label: "擁有雜交種 ≥ 2" },
      { type: "bestiary", need: 100, label: "圖鑑登錄 ≥ 100 格" },
      { type: "bloodmark_owned", need: 1, label: "擁有帶血脈紋靈寵 ≥ 1" },
    ],
  },
};

/** 潮主之後的突破門檻（公式生成） */
export function breakthroughGateFor(targetRealmId) {
  if (BREAKTHROUGH_GATES[targetRealmId]) return BREAKTHROUGH_GATES[targetRealmId];
  const extra = Math.max(1, targetRealmId - STAGE_FORMULA_BASE);
  const reqTier = Math.max(4, targetRealmId - 2);
  const reqGen = Math.min(3, 2 + Math.floor((extra - 1) / 2));
  return {
    costs: {
      stones: Math.round(560 * Math.pow(1.52, extra - 1)),
      scrap: 8 + extra * 3,
      dust: 50 + extra * 14,
      feed: 36 + extra * 10,
      seal_ember: extra,
    },
    checks: [
      {
        type: "cleared",
        dungeonId: dungeonIdForTier(reqTier),
        label: `通關【${dungeonDisplayName(reqTier)}】`,
      },
      {
        type: "combats",
        need: 12 + extra * 5,
        label: `累計秘境勝場 ≥ ${12 + extra * 5}`,
      },
      {
        type: "min_gen",
        gen: reqGen,
        label: `擁有 ≥ ${reqGen} 代寵`,
      },
      {
        type: "bestiary",
        need: 80 + extra * 40,
        label: `圖鑑登錄 ≥ ${80 + extra * 40} 格`,
      },
      {
        type: "breeds",
        need: 3 + extra * 2,
        label: `繁殖次數 ≥ ${3 + extra * 2}`,
      },
    ],
  };
}

function ownedPetList(state) {
  return [...(state.pets || []), ...(state.ranch || [])];
}

function countEquippedGear(state) {
  return 0;
}

/** 評估單項突破檢查 */
export function evalBreakthroughCheck(state, check) {
  const stats = state.stats || {};
  const owned = ownedPetList(state);
  if (check.type === "combats") {
    const n = state.combatsWon || 0;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "cleared") {
    const ok = !!(state.clearedDungeons || {})[check.dungeonId];
    return { ok, progress: ok ? "已通" : "未通" };
  }
  if (check.type === "bonds") {
    const n = stats.bonds || 0;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "owned_pets") {
    const n = owned.length;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "gear_equipped") {
    /* 人物裝備已移除：舊存檔條件視為達成 */
    return { ok: true, progress: "—／已廢止" };
  }
  if (check.type === "fusions") {
    const n = stats.fusions || 0;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "breeds") {
    const n = stats.breeds || 0;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "hybrid_owned") {
    const n = owned.filter((p) => p.breedOnly || SPECIES[p.speciesId]?.breedOnly).length;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "min_gen") {
    const maxG = owned.reduce((m, p) => Math.max(m, petGeneration(p)), 0);
    return { ok: maxG >= check.gen, progress: `最高${maxG}代` };
  }
  if (check.type === "bestiary") {
    const n = Object.keys(state.bestiary || {}).length;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  if (check.type === "bloodmark_owned") {
    const n = owned.filter((p) => (p.bloodmarks || []).length > 0).length;
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
  }
  return { ok: false, progress: "?" };
}

function formatCostBits(costs) {
  if (!costs) return "";
  const bits = [];
  if (costs.stones) bits.push(`${costs.stones}石`);
  if (costs.scrap) bits.push(`${costs.scrap}碎片`);
  if (costs.dust) bits.push(`${costs.dust}靈塵`);
  if (costs.feed) bits.push(`${costs.feed}飼料`);
  if (costs.seal_ember) bits.push(`${costs.seal_ember}契火`);
  return bits.join("／");
}

/**
 * 下一階段突破檢視：分項達標狀態（供 UI 清單表）
 */
export function breakthroughView(state) {
  const cur = stageAt(state.realm);
  const next = nextStageAt(state.realm);
  const gate = breakthroughGateFor(next.id);
  const costs = gate.costs || {};
  const items = [];

  const qiOk = state.qi >= next.need;
  items.push({
    id: "qi",
    label: `靈契 ≥ ${next.need}`,
    ok: qiOk,
    progress: `${Math.floor(state.qi)}/${next.need}`,
    kind: "qi",
  });

  if (costs.stones) {
    items.push({
      id: "cost_stones",
      label: `靈石 ≥ ${costs.stones}`,
      ok: state.stones >= costs.stones,
      progress: `${Math.floor(state.stones)}/${costs.stones}`,
      kind: "cost",
    });
  }
  if (costs.scrap) {
    items.push({
      id: "cost_scrap",
      label: `碎片 ≥ ${costs.scrap}`,
      ok: (state.scrap || 0) >= costs.scrap,
      progress: `${state.scrap || 0}/${costs.scrap}`,
      kind: "cost",
    });
  }
  if (costs.dust) {
    items.push({
      id: "cost_dust",
      label: `靈塵 ≥ ${costs.dust}`,
      ok: (state.dust || 0) >= costs.dust,
      progress: `${Math.floor(state.dust || 0)}/${costs.dust}`,
      kind: "cost",
    });
  }
  if (costs.feed) {
    items.push({
      id: "cost_feed",
      label: `飼料 ≥ ${costs.feed}`,
      ok: (state.feed || 0) >= costs.feed,
      progress: `${Math.floor(state.feed || 0)}/${costs.feed}`,
      kind: "cost",
    });
  }
  if (costs.seal_ember) {
    const have = state.materials?.seal_ember || 0;
    items.push({
      id: "cost_seal_ember",
      label: `契火 ≥ ${costs.seal_ember}`,
      ok: have >= costs.seal_ember,
      progress: `${have}/${costs.seal_ember}`,
      kind: "cost",
    });
  }

  for (const ch of gate.checks || []) {
    const ev = evalBreakthroughCheck(state, ch);
    items.push({
      id: `chk_${ch.type}_${ch.dungeonId || ch.need || ch.gen || ""}`,
      label: ch.label,
      ok: ev.ok,
      progress: ev.progress,
      kind: "check",
    });
  }

  return {
    maxed: false,
    cur,
    next,
    items,
    ready: items.every((i) => i.ok),
    costs,
    costLabel: formatCostBits(costs),
  };
}

export const ELEMENTS = {
  tide: { id: "tide", name: "潮", atk: 1.05, hp: 1.0, spd: 1.05 },
  stone: { id: "stone", name: "岩", atk: 1.0, hp: 1.12, spd: 0.92 },
  flame: { id: "flame", name: "焰", atk: 1.12, hp: 0.94, spd: 1.0 },
  gale: { id: "gale", name: "嵐", atk: 1.0, hp: 0.95, spd: 1.15 },
  gloom: { id: "gloom", name: "幽", atk: 1.08, hp: 1.0, spd: 1.0 },
};

/**
 * 元素相剋（攻 → 被克方）
 * 潮克焰、焰克嵐、嵐克岩、岩克幽、幽克潮
 */
export const ELEMENT_BEATS = {
  tide: "flame",
  flame: "gale",
  gale: "stone",
  stone: "gloom",
  gloom: "tide",
};

export const ELEMENT_ADV = 1.25;
export const ELEMENT_DIS = 0.8;

/** @returns {{ mult: number, tag: '' | '克制' | '被克' }} */
export function elementMatchup(atkElementId, defElementId) {
  if (!atkElementId || !defElementId || atkElementId === defElementId) {
    return { mult: 1, tag: "" };
  }
  if (ELEMENT_BEATS[atkElementId] === defElementId) return { mult: ELEMENT_ADV, tag: "克制" };
  if (ELEMENT_BEATS[defElementId] === atkElementId) return { mult: ELEMENT_DIS, tag: "被克" };
  return { mult: 1, tag: "" };
}

/**
 * 種類（kind）＝野生種族 1:1
 * 礁狐獸／潮鯉鱗／灰翼禽／苔背甲／夜蛾蟲／熒鰭光
 */
export const KIND_SKILLS = {
  獸: "pounce",
  鱗: "tide_spray",
  禽: "gale_dive",
  甲: "shell_guard",
  蟲: "venom_bite",
  光: "glow_lance",
};

export const KINDS = ["獸", "鱗", "禽", "甲", "蟲", "光"];

export const SPECIES = {
  reefox: { id: "reefox", name: "礁狐", kind: "獸", base: { atk: 13, hp: 85, spd: 11 } },
  tidecarp: { id: "tidecarp", name: "潮鯉", kind: "鱗", base: { atk: 10, hp: 110, spd: 8 } },
  ashwing: { id: "ashwing", name: "灰翼", kind: "禽", base: { atk: 12, hp: 78, spd: 14 } },
  mossback: { id: "mossback", name: "苔背", kind: "甲", base: { atk: 9, hp: 140, spd: 5 } },
  nightmoth: { id: "nightmoth", name: "夜蛾", kind: "蟲", base: { atk: 15, hp: 70, spd: 12 } },
  glowfin: { id: "glowfin", name: "熒鰭", kind: "光", base: { atk: 11, hp: 95, spd: 10 } },
  // —— 繁殖專屬雜交種（野生秘境唔出；kind 跟主題）——
  tideling: {
    id: "tideling",
    name: "潮獸",
    kind: "獸",
    breedOnly: true,
    base: { atk: 16, hp: 100, spd: 12 },
  },
  duskfly: {
    id: "duskfly",
    name: "暮翼",
    kind: "禽",
    breedOnly: true,
    base: { atk: 15, hp: 82, spd: 16 },
  },
  ironback: {
    id: "ironback",
    name: "鐵背",
    kind: "甲",
    breedOnly: true,
    base: { atk: 12, hp: 165, spd: 6 },
  },
  mistcarp: {
    id: "mistcarp",
    name: "霧鯉",
    kind: "鱗",
    breedOnly: true,
    base: { atk: 13, hp: 120, spd: 11 },
  },
  stormmoth: {
    id: "stormmoth",
    name: "嵐蛾",
    kind: "蟲",
    breedOnly: true,
    base: { atk: 18, hp: 78, spd: 14 },
  },
  reefwing: {
    id: "reefwing",
    name: "礁翼",
    kind: "禽",
    breedOnly: true,
    base: { atk: 14, hp: 90, spd: 15 },
  },
  fangmite: {
    id: "fangmite",
    name: "牙蟎",
    kind: "蟲",
    breedOnly: true,
    base: { atk: 17, hp: 88, spd: 13 },
  },
  scalequill: {
    id: "scalequill",
    name: "鱗羽",
    kind: "鱗",
    breedOnly: true,
    base: { atk: 14, hp: 105, spd: 13 },
  },
  shellmite: {
    id: "shellmite",
    name: "甲蟎",
    kind: "甲",
    breedOnly: true,
    base: { atk: 13, hp: 150, spd: 8 },
  },
  glintfox: {
    id: "glintfox",
    name: "耀狐",
    kind: "獸",
    breedOnly: true,
    base: { atk: 17, hp: 92, spd: 13 },
  },
  prismback: {
    id: "prismback",
    name: "稜背",
    kind: "甲",
    breedOnly: true,
    base: { atk: 11, hp: 158, spd: 7 },
  },
  // —— 野生擴充（realm 分池）——
  saltpup: { id: "saltpup", name: "鹽犬", kind: "獸", minRealm: 0, base: { atk: 12, hp: 88, spd: 12 } },
  brineeel: { id: "brineeel", name: "鹵鰻", kind: "鱗", minRealm: 0, base: { atk: 11, hp: 100, spd: 10 } },
  cliffkite: { id: "cliffkite", name: "崖鳶", kind: "禽", minRealm: 1, base: { atk: 13, hp: 76, spd: 15 } },
  barnshell: { id: "barnshell", name: "藤螺", kind: "甲", minRealm: 1, base: { atk: 8, hp: 150, spd: 4 } },
  siltmite: { id: "siltmite", name: "泥蟎", kind: "蟲", minRealm: 2, base: { atk: 14, hp: 72, spd: 13 } },
  lanternray: { id: "lanternray", name: "燈鰩", kind: "光", minRealm: 2, base: { atk: 12, hp: 98, spd: 9 } },
  duskox: { id: "duskox", name: "暮牛", kind: "獸", minRealm: 3, base: { atk: 15, hp: 125, spd: 7 } },
  foamdrake: { id: "foamdrake", name: "沫蛟", kind: "鱗", minRealm: 3, base: { atk: 16, hp: 108, spd: 11 } },
  // —— 雜交擴充 ——
  tidehowl: {
    id: "tidehowl",
    name: "潮嗥",
    kind: "獸",
    breedOnly: true,
    base: { atk: 18, hp: 105, spd: 11 },
  },
  coralmane: {
    id: "coralmane",
    name: "珊鬃",
    kind: "獸",
    breedOnly: true,
    base: { atk: 15, hp: 118, spd: 10 },
  },
  mistwing: {
    id: "mistwing",
    name: "霧翼",
    kind: "禽",
    breedOnly: true,
    base: { atk: 14, hp: 86, spd: 17 },
  },
  stormshell: {
    id: "stormshell",
    name: "嵐甲",
    kind: "甲",
    breedOnly: true,
    base: { atk: 13, hp: 170, spd: 7 },
  },
  gloomfang: {
    id: "gloomfang",
    name: "幽牙",
    kind: "蟲",
    breedOnly: true,
    base: { atk: 19, hp: 80, spd: 14 },
  },
  lightscale: {
    id: "lightscale",
    name: "輝鱗",
    kind: "鱗",
    breedOnly: true,
    base: { atk: 15, hp: 112, spd: 12 },
  },
  ashspine: {
    id: "ashspine",
    name: "灰脊",
    kind: "甲",
    breedOnly: true,
    base: { atk: 14, hp: 145, spd: 9 },
  },
  deepquill: {
    id: "deepquill",
    name: "深羽",
    kind: "禽",
    breedOnly: true,
    base: { atk: 16, hp: 88, spd: 16 },
  },
  reefmite: {
    id: "reefmite",
    name: "礁蟎",
    kind: "蟲",
    breedOnly: true,
    base: { atk: 16, hp: 95, spd: 12 },
  },
  voidcarp: {
    id: "voidcarp",
    name: "虛鯉",
    kind: "鱗",
    breedOnly: true,
    base: { atk: 14, hp: 130, spd: 10 },
  },
  brightback: {
    id: "brightback",
    name: "明背",
    kind: "光",
    breedOnly: true,
    base: { atk: 13, hp: 120, spd: 11 },
  },
  galebeast: {
    id: "galebeast",
    name: "嵐獸",
    kind: "獸",
    breedOnly: true,
    base: { atk: 17, hp: 98, spd: 14 },
  },
  stonefinch: {
    id: "stonefinch",
    name: "岩雀",
    kind: "禽",
    breedOnly: true,
    base: { atk: 13, hp: 92, spd: 13 },
  },
  inkfox: {
    id: "inkfox",
    name: "墨狐",
    kind: "獸",
    breedOnly: true,
    base: { atk: 18, hp: 90, spd: 15 },
  },
  prismoth: {
    id: "prismoth",
    name: "稜蛾",
    kind: "蟲",
    breedOnly: true,
    base: { atk: 17, hp: 84, spd: 15 },
  },
  // —— 三代種（雙親皆雜交，較低機率）——
  abyssreign: {
    id: "abyssreign",
    name: "淵君",
    kind: "鱗",
    breedOnly: true,
    tertiary: true,
    base: { atk: 20, hp: 135, spd: 12 },
  },
  voidglint: {
    id: "voidglint",
    name: "虛耀",
    kind: "光",
    breedOnly: true,
    tertiary: true,
    base: { atk: 19, hp: 110, spd: 14 },
  },
  duskiron: {
    id: "duskiron",
    name: "暮鐵",
    kind: "甲",
    breedOnly: true,
    tertiary: true,
    base: { atk: 16, hp: 175, spd: 8 },
  },
  coralstorm: {
    id: "coralstorm",
    name: "珊嵐",
    kind: "禽",
    breedOnly: true,
    tertiary: true,
    base: { atk: 18, hp: 100, spd: 16 },
  },
  deepfang: {
    id: "deepfang",
    name: "深牙",
    kind: "蟲",
    breedOnly: true,
    tertiary: true,
    base: { atk: 21, hp: 92, spd: 15 },
  },
  tideprism: {
    id: "tideprism",
    name: "潮稜",
    kind: "獸",
    breedOnly: true,
    tertiary: true,
    base: { atk: 19, hp: 118, spd: 13 },
  },
  nightscale: {
    id: "nightscale",
    name: "夜鱗",
    kind: "鱗",
    breedOnly: true,
    tertiary: true,
    base: { atk: 17, hp: 128, spd: 12 },
  },
  galevoid: {
    id: "galevoid",
    name: "嵐虛",
    kind: "禽",
    breedOnly: true,
    tertiary: true,
    base: { atk: 20, hp: 96, spd: 17 },
  },
};

/** 野生／秘境可遇種族（排除繁殖專屬） */
export function wildSpeciesIds(realm = 99) {
  const r = realm == null ? 99 : realm | 0;
  return Object.values(SPECIES)
    .filter((s) => !s.breedOnly && (s.minRealm == null || s.minRealm <= r))
    .map((s) => s.id);
}

/** 商肆／早期可用野生池 */
export function shopSpeciesIds(realm = 0) {
  return wildSpeciesIds(Math.max(0, realm | 0));
}

/**
 * 性格（20）：多數打／工取捨；少數祥瑞系只加不減。
 * role: fight | work | balanced | blessed
 * atk/hp/spd = 基礎面板倍率；work* = 牧場待命／派遣場外
 */
export const PERSONALITIES = {
  // —— 原有五種 ——
  fierce: {
    id: "fierce",
    name: "烈性",
    role: "fight",
    atk: 1.15,
    hp: 0.92,
    spd: 1.05,
    workFeed: 0.55,
    workDust: 0.7,
    workToken: 0.5,
    dispatchTime: 1.08,
    breedMutate: 1.0,
    bond: 0.48,
  },
  steady: {
    id: "steady",
    name: "沉穩",
    role: "balanced",
    atk: 0.95,
    hp: 1.18,
    spd: 0.9,
    workFeed: 1.15,
    workDust: 1.1,
    workToken: 1.05,
    dispatchTime: 0.9,
    breedMutate: 1.0,
    bond: 0.68,
  },
  sly: {
    id: "sly",
    name: "狡黠",
    role: "balanced",
    atk: 1.08,
    hp: 0.95,
    spd: 1.12,
    workFeed: 0.85,
    workDust: 1.2,
    workToken: 1.25,
    dispatchTime: 0.95,
    breedMutate: 1.05,
    bond: 0.55,
  },
  gentle: {
    id: "gentle",
    name: "溫馴",
    role: "work",
    atk: 0.9,
    hp: 1.1,
    spd: 1.0,
    workFeed: 1.45,
    workDust: 1.15,
    workToken: 1.1,
    dispatchTime: 0.92,
    breedMutate: 0.95,
    bond: 0.78,
  },
  wild: {
    id: "wild",
    name: "狂放",
    role: "fight",
    atk: 1.2,
    hp: 0.88,
    spd: 1.08,
    workFeed: 0.4,
    workDust: 0.55,
    workToken: 0.45,
    dispatchTime: 1.12,
    breedMutate: 1.2,
    bond: 0.38,
  },
  // —— 戰鬥向（加打減工）——
  brutal: {
    id: "brutal",
    name: "殘暴",
    role: "fight",
    atk: 1.22,
    hp: 0.9,
    spd: 1.0,
    workFeed: 0.45,
    workDust: 0.5,
    workToken: 0.4,
    dispatchTime: 1.15,
    breedMutate: 1.0,
    bond: 0.4,
  },
  bloodthirst: {
    id: "bloodthirst",
    name: "嗜血",
    role: "fight",
    atk: 1.18,
    hp: 0.85,
    spd: 1.1,
    workFeed: 0.35,
    workDust: 0.6,
    workToken: 0.4,
    dispatchTime: 1.1,
    breedMutate: 1.05,
    bond: 0.42,
  },
  arrogant: {
    id: "arrogant",
    name: "傲慢",
    role: "fight",
    atk: 1.12,
    hp: 1.0,
    spd: 0.95,
    workFeed: 0.7,
    workDust: 0.65,
    workToken: 0.6,
    dispatchTime: 1.05,
    breedMutate: 0.9,
    bond: 0.45,
  },
  restless: {
    id: "restless",
    name: "躁動",
    role: "fight",
    atk: 1.05,
    hp: 0.92,
    spd: 1.2,
    workFeed: 0.6,
    workDust: 0.75,
    workToken: 0.55,
    dispatchTime: 1.18,
    breedMutate: 1.1,
    bond: 0.5,
  },
  vengeful: {
    id: "vengeful",
    name: "執念",
    role: "fight",
    atk: 1.14,
    hp: 0.96,
    spd: 1.02,
    workFeed: 0.65,
    workDust: 0.7,
    workToken: 0.55,
    dispatchTime: 1.06,
    breedMutate: 1.0,
    bond: 0.46,
  },
  cunning: {
    id: "cunning",
    name: "陰鷙",
    role: "fight",
    atk: 1.1,
    hp: 0.93,
    spd: 1.15,
    workFeed: 0.7,
    workDust: 0.85,
    workToken: 0.75,
    dispatchTime: 1.0,
    breedMutate: 1.08,
    bond: 0.5,
  },
  // —— 工作向（加工減打）——
  diligent: {
    id: "diligent",
    name: "勤懇",
    role: "work",
    atk: 0.88,
    hp: 1.05,
    spd: 0.95,
    workFeed: 1.5,
    workDust: 1.35,
    workToken: 1.3,
    dispatchTime: 0.85,
    breedMutate: 1.0,
    bond: 0.72,
  },
  nurturing: {
    id: "nurturing",
    name: "慈育",
    role: "work",
    atk: 0.85,
    hp: 1.12,
    spd: 0.92,
    workFeed: 1.65,
    workDust: 1.05,
    workToken: 1.0,
    dispatchTime: 0.88,
    breedMutate: 1.15,
    bond: 0.8,
  },
  patient: {
    id: "patient",
    name: "忍耐",
    role: "work",
    atk: 0.92,
    hp: 1.15,
    spd: 0.88,
    workFeed: 1.25,
    workDust: 1.2,
    workToken: 1.15,
    dispatchTime: 0.78,
    breedMutate: 0.95,
    bond: 0.7,
  },
  curious: {
    id: "curious",
    name: "好奇",
    role: "work",
    atk: 0.95,
    hp: 0.98,
    spd: 1.05,
    workFeed: 1.05,
    workDust: 1.45,
    workToken: 1.4,
    dispatchTime: 0.9,
    breedMutate: 1.2,
    bond: 0.62,
  },
  loyal: {
    id: "loyal",
    name: "忠勤",
    role: "work",
    atk: 0.94,
    hp: 1.08,
    spd: 0.98,
    workFeed: 1.3,
    workDust: 1.15,
    workToken: 1.2,
    dispatchTime: 0.86,
    breedMutate: 1.0,
    bond: 0.74,
  },
  // —— 祥瑞系（只加不減）——
  blessed: {
    id: "blessed",
    name: "祥瑞",
    role: "blessed",
    atk: 1.04,
    hp: 1.04,
    spd: 1.02,
    workFeed: 1.12,
    workDust: 1.12,
    workToken: 1.1,
    dispatchTime: 0.95,
    breedMutate: 1.08,
    bond: 0.72,
  },
  clever: {
    id: "clever",
    name: "機靈",
    role: "blessed",
    atk: 1.03,
    hp: 1.0,
    spd: 1.08,
    workFeed: 1.08,
    workDust: 1.15,
    workToken: 1.18,
    dispatchTime: 0.92,
    breedMutate: 1.1,
    bond: 0.65,
  },
  noble: {
    id: "noble",
    name: "高潔",
    role: "blessed",
    atk: 1.05,
    hp: 1.05,
    spd: 1.03,
    workFeed: 1.1,
    workDust: 1.1,
    workToken: 1.08,
    dispatchTime: 0.94,
    breedMutate: 1.05,
    bond: 0.7,
  },
  serene: {
    id: "serene",
    name: "澄明",
    role: "blessed",
    atk: 1.0,
    hp: 1.08,
    spd: 1.02,
    workFeed: 1.15,
    workDust: 1.18,
    workToken: 1.12,
    dispatchTime: 0.9,
    breedMutate: 1.05,
    bond: 0.75,
  },
};

/** 牧場待命全局倍率（避免疊練功地爆倉） */
export const RANCH_IDLE_GLOBAL_MULT = 0.35;

/** 派遣高代獎勵倍率 */
export const DISPATCH_GEN_REWARD_MULT = { 2: 1.1, 3: 1.25 };

/** 血脈紋（每寵 0–2）：圖鑑組合軸之一 */
export const BLOODLINE_MARKS = {
  tide_sigil: { id: "tide_sigil", name: "潮印", atk: 1.03, hp: 1.02, spd: 1.0 },
  reef_bone: { id: "reef_bone", name: "礁骨", atk: 1.0, hp: 1.06, spd: 0.98 },
  gale_plume: { id: "gale_plume", name: "嵐羽", atk: 1.02, hp: 0.98, spd: 1.06 },
  gloom_spark: { id: "gloom_spark", name: "幽螢", atk: 1.05, hp: 0.97, spd: 1.03 },
};

export const BLOODLINE_MARK_IDS = Object.keys(BLOODLINE_MARKS);
export const BLOODMARK_MAX = 2;

/** 正規化血脈鍵（圖鑑用） */
export function bloodlineKey(marks) {
  const ids = (Array.isArray(marks) ? marks : [])
    .filter((id) => BLOODLINE_MARKS[id])
    .slice(0, BLOODMARK_MAX)
    .sort();
  const uniq = [...new Set(ids)];
  return uniq.length ? uniq.join("+") : "none";
}

export function bloodlineLabel(marks) {
  const key = bloodlineKey(marks);
  if (key === "none") return "無紋";
  return key
    .split("+")
    .map((id) => BLOODLINE_MARKS[id]?.name || id)
    .join("·");
}

/** 所有血脈型態鍵（含無紋）：C(4,0)+C(4,1)+C(4,2)=11 */
export function allBloodlineKeys() {
  const ids = BLOODLINE_MARK_IDS;
  const out = ["none"];
  for (const a of ids) out.push(a);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      out.push([ids[i], ids[j]].sort().join("+"));
    }
  }
  return out;
}

export function normalizeBloodmarks(marks) {
  const key = bloodlineKey(marks);
  return key === "none" ? [] : key.split("+");
}

export function bloodmarkCombatMult(marks) {
  let atk = 1;
  let hp = 1;
  let spd = 1;
  for (const id of normalizeBloodmarks(marks)) {
    const m = BLOODLINE_MARKS[id];
    if (!m) continue;
    atk *= m.atk;
    hp *= m.hp;
    spd *= m.spd;
  }
  return { atk, hp, spd };
}

/**
 * 技能定義
 * type: strike | cleave | heal | guard | debuff
 */
export const SKILLS = {
  // —— 人物 ——
  seal_strike: {
    id: "seal_strike",
    name: "契印斬",
    owner: "master",
    type: "strike",
    cd: 2,
    power: 1.55,
    desc: "單體高傷害",
  },
  mist_ward: {
    id: "mist_ward",
    name: "潮霧庇護",
    owner: "master",
    type: "heal",
    cd: 3,
    power: 0.35,
    desc: "治療生命最低的友方",
  },
  tide_banner: {
    id: "tide_banner",
    name: "暗潮令旗",
    owner: "master",
    type: "cleave",
    cd: 4,
    power: 0.85,
    desc: "攻擊全體敵人（較低倍率）",
  },
  // —— 靈寵（按種類）——
  pounce: {
    id: "pounce",
    name: "撲襲",
    owner: "pet",
    kind: "獸",
    type: "strike",
    cd: 2,
    power: 1.7,
    desc: "獸類：猛撲單體",
  },
  tide_spray: {
    id: "tide_spray",
    name: "潮濺",
    owner: "pet",
    kind: "鱗",
    type: "cleave",
    cd: 3,
    power: 0.75,
    desc: "鱗類：濺射最多兩名敵人",
  },
  gale_dive: {
    id: "gale_dive",
    name: "嵐擊",
    owner: "pet",
    kind: "禽",
    type: "strike",
    cd: 2,
    power: 1.45,
    desc: "禽類：高速俯衝（額外＋速判定）",
  },
  shell_guard: {
    id: "shell_guard",
    name: "甲盾",
    owner: "pet",
    kind: "甲",
    type: "guard",
    cd: 3,
    power: 0.4,
    desc: "甲類：自身減傷並小幅回血",
  },
  venom_bite: {
    id: "venom_bite",
    name: "蝕咬",
    owner: "pet",
    kind: "蟲",
    type: "debuff",
    cd: 2,
    power: 1.2,
    desc: "蟲類：傷害並使目標攻擊降低",
  },
  glow_lance: {
    id: "glow_lance",
    name: "熒槍",
    owner: "pet",
    kind: "光",
    type: "strike",
    cd: 2,
    power: 1.6,
    desc: "光類：熒芒穿刺單體",
  },
  // —— 第二技能（融階／等級解鎖）——
  pack_howl: {
    id: "pack_howl",
    name: "群嚎",
    owner: "pet",
    kind: "獸",
    type: "buff",
    cd: 4,
    power: 0.12,
    desc: "獸類二技：短時提升全體友方攻擊",
  },
  tidal_veil: {
    id: "tidal_veil",
    name: "潮帷",
    owner: "pet",
    kind: "鱗",
    type: "heal",
    cd: 3,
    power: 0.22,
    desc: "鱗類二技：為生命最低友方回復",
  },
  sky_pierce: {
    id: "sky_pierce",
    name: "穿空",
    owner: "pet",
    kind: "禽",
    type: "strike",
    cd: 3,
    power: 2.0,
    desc: "禽類二技：高倍率單體俯衝",
  },
  bulwark_pulse: {
    id: "bulwark_pulse",
    name: "甲脈",
    owner: "pet",
    kind: "甲",
    type: "guard",
    cd: 4,
    power: 0.28,
    desc: "甲類二技：強減傷並回血",
  },
  swarm_haze: {
    id: "swarm_haze",
    name: "蟲霾",
    owner: "pet",
    kind: "蟲",
    type: "cleave",
    cd: 3,
    power: 0.65,
    desc: "蟲類二技：濺射全體敵人",
  },
  prism_burst: {
    id: "prism_burst",
    name: "棱爆",
    owner: "pet",
    kind: "光",
    type: "cleave",
    cd: 3,
    power: 0.7,
    desc: "光類二技：棱光濺射全體",
  },
  // —— 敵方專屬 ——
  abyss_slam: {
    id: "abyss_slam",
    name: "深淵錘",
    owner: "foe",
    type: "strike",
    cd: 2,
    power: 1.75,
    desc: "精英／BOSS：重錘單體",
  },
  shadow_cleave: {
    id: "shadow_cleave",
    name: "影裂",
    owner: "foe",
    type: "cleave",
    cd: 3,
    power: 0.72,
    desc: "精英／BOSS：暗影濺射",
  },
  coral_spike: {
    id: "coral_spike",
    name: "珊瑚刺",
    owner: "foe",
    type: "strike",
    cd: 2,
    power: 1.5,
    desc: "精英：珊瑚穿刺",
  },
  core_roar: {
    id: "core_roar",
    name: "心核咆哮",
    owner: "foe",
    type: "buff",
    cd: 4,
    power: 0.14,
    desc: "BOSS：鼓舞敵方攻擊",
  },
  tide_crush: {
    id: "tide_crush",
    name: "潮壓",
    owner: "foe",
    type: "strike",
    cd: 2,
    power: 1.65,
    desc: "精英：潮壓重擊",
  },
  // —— 雜交專屬 ——
  tide_beast_rush: {
    id: "tide_beast_rush",
    name: "潮獸奔襲",
    owner: "pet",
    type: "strike",
    cd: 2,
    power: 1.85,
    desc: "潮獸專屬：高倍率單體",
  },
  dusk_veil: {
    id: "dusk_veil",
    name: "暮紗",
    owner: "pet",
    type: "debuff",
    cd: 2,
    power: 1.35,
    desc: "暮翼專屬：傷害並削攻",
  },
  iron_bulwark: {
    id: "iron_bulwark",
    name: "鐵壁",
    owner: "pet",
    type: "guard",
    cd: 3,
    power: 0.45,
    desc: "鐵背專屬：強減傷回血",
  },
  mist_surge: {
    id: "mist_surge",
    name: "霧湧",
    owner: "pet",
    type: "cleave",
    cd: 3,
    power: 0.8,
    desc: "霧鯉專屬：霧浪濺射",
  },
  storm_lance: {
    id: "storm_lance",
    name: "嵐槍",
    owner: "pet",
    type: "strike",
    cd: 2,
    power: 1.9,
    desc: "嵐蛾專屬：嵐刺單體",
  },
  reef_dive: {
    id: "reef_dive",
    name: "礁襲",
    owner: "pet",
    type: "strike",
    cd: 2,
    power: 1.7,
    desc: "礁翼專屬：俯衝（＋速）",
  },
  fang_burst: {
    id: "fang_burst",
    name: "牙爆",
    owner: "pet",
    type: "cleave",
    cd: 3,
    power: 1.55,
    desc: "牙蟎專屬：毒牙濺射",
  },
  scale_glide: {
    id: "scale_glide",
    name: "鱗翔",
    owner: "pet",
    type: "strike",
    cd: 2,
    power: 1.75,
    desc: "鱗羽專屬：鱗刃俯衝",
  },
  shell_spike: {
    id: "shell_spike",
    name: "甲刺",
    owner: "pet",
    type: "guard",
    cd: 3,
    power: 0.5,
    desc: "甲蟎專屬：甲刺反震",
  },
  glint_beam: {
    id: "glint_beam",
    name: "耀光穿",
    owner: "pet",
    type: "strike",
    cd: 2,
    power: 1.88,
    desc: "耀狐專屬：光焰貫穿",
  },
  prism_shell: {
    id: "prism_shell",
    name: "稜殼",
    owner: "pet",
    type: "guard",
    cd: 3,
    power: 0.48,
    desc: "稜背專屬：稜光護盾",
  },
};

/** 人物依階段解鎖技能 */
export const MASTER_SKILL_UNLOCKS = [
  { stage: 0, skillId: "seal_strike" },
  { stage: 1, skillId: "mist_ward" },
  { stage: 3, skillId: "tide_banner" },
];

export const WILD_PETS = [
  { id: "p_reefox_tide", species: "reefox", element: "tide", personality: "sly", cost: 40 },
  { id: "p_moss_stone", species: "mossback", element: "stone", personality: "steady", cost: 45 },
  { id: "p_ash_gale", species: "ashwing", element: "gale", personality: "fierce", cost: 42 },
  { id: "p_carp_tide", species: "tidecarp", element: "tide", personality: "gentle", cost: 48 },
  { id: "p_moth_gloom", species: "nightmoth", element: "gloom", personality: "wild", cost: 58 },
  { id: "p_fin_flame", species: "glowfin", element: "flame", personality: "fierce", cost: 52 },
];

/** 待契約佇列上限；滿咗打本唔會再新遇 */
export const PENDING_BOND_MAX = 5;

/** 出戰欄上限 */
export const ACTIVE_PET_MAX = 3;

/**
 * 牧場待命上限：隨人物階段提升
 * 初契 6 → 通靈初 9 → … → 潮主 21
 */
export function ranchCapForStage(stageId) {
  return 6 + Math.max(0, stageId) * 3;
}

/** 升級耗靈石（獨立於融合，只跟寵物自身等級） */
export function upgradeStoneCost(level) {
  const lv = Math.max(1, level | 0);
  return 8 + lv * 10 + Math.floor(lv * lv * 1.8);
}

/** 融合最高階 */
export const FUSION_MAX_STAGE = 3;

/**
 * 融階規則（目標融階 → 主體最低等級、同種族總隻數含主體）
 * 階1: Lv≥10、2隻｜階2: Lv≥20、4隻｜階3: Lv≥30、8隻
 * 素材不計等級；數量倍增 2→4→8
 */
export const FUSION_RULES = {
  1: { needLevel: 10, totalPets: 2 },
  2: { needLevel: 20, totalPets: 4 },
  3: { needLevel: 30, totalPets: 8 },
};

export function nextFusionStage(currentFusionLevel) {
  const cur = currentFusionLevel ?? 0;
  if (cur >= FUSION_MAX_STAGE) return null;
  return cur + 1;
}

export function fusionMaterialNeed(targetStage) {
  const rule = FUSION_RULES[targetStage];
  if (!rule) return 0;
  return rule.totalPets - 1;
}

/**
 * 融合耗靈石（隨目標融階＋所需隻數遞增）
 * 階1→32, 階2→192, 階3→768
 */
export function fusionStoneCost(targetStage) {
  const n = Math.max(1, Math.min(FUSION_MAX_STAGE, targetStage | 0));
  const rule = FUSION_RULES[n];
  return 8 * n * (n + 1) * rule.totalPets;
}

/** 性格 → 契約成功率（由 PERSONALITIES.bond 匯出） */
export const BOND_RATE_BY_PERSONALITY = Object.fromEntries(
  Object.values(PERSONALITIES).map((p) => [p.id, p.bond ?? 0.5])
);

/** 契約靈石上限（秘境遇寵） */
export const BOND_COST_MAX = 42;
/** 每次同隻失敗契約累加成功率 */
export const BOND_FAIL_RATE_BONUS = 0.1;
export const BOND_FAIL_RATE_CAP = 0.3;

/** 靈紋鍛造耗碎片 */
export const FORGE_SCRAP_COST = 2;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(weightMap) {
  const entries = Object.entries(weightMap).filter(([, w]) => w > 0);
  if (!entries.length) return null;
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [id, w] of entries) {
    r -= w;
    if (r <= 0) return id;
  }
  return entries[entries.length - 1][0];
}

/** 繁殖：靈石消耗、冷卻 */
export const BREED_STONE_COST = 45;
/** 單次交配孕育時長（似秘境召喚凝聚） */
export const BREED_COOLDOWN_MS = 45_000;
/** 同時進行中的交配欄位上限 */
export const BREED_QUEUE_MAX = 3;
export const BREED_ELEMENT_MUTATION_RATE = 0.1;

/**
 * 稀有度（變異階）
 * 0 普通 · 1 稀有 · 2 史詩 · 3 傳說
 */
export const RARITY = {
  0: { id: 0, name: "普通", mult: 1, color: "common" },
  1: { id: 1, name: "稀有", mult: 1.12, color: "rare" },
  2: { id: 2, name: "史詩", mult: 1.28, color: "epic" },
  3: { id: 3, name: "傳說", mult: 1.5, color: "legendary" },
};

export const RARITY_MAX = 3;

export function rarityInfo(r) {
  const id = Math.max(0, Math.min(RARITY_MAX, r | 0));
  return RARITY[id];
}

/**
 * 雜交配方（主／次）：雙親 kind（無序）→ 新品種
 * 同一格只取最高 chance（主配方覆蓋次配方唔會撞名時分開寫不同產物）
 * × 無配方：（已補齊主要缺口）
 */
export const HYBRID_RECIPES = [
  // —— 主配方 ——
  { kinds: ["獸", "鱗"], species: "tideling", chance: 0.28, tier: "main" },
  { kinds: ["禽", "蟲"], species: "duskfly", chance: 0.26, tier: "main" },
  { kinds: ["獸", "甲"], species: "ironback", chance: 0.26, tier: "main" },
  { kinds: ["鱗", "甲"], species: "mistcarp", chance: 0.26, tier: "main" },
  { kinds: ["獸", "禽"], species: "reefwing", chance: 0.26, tier: "main" },
  { kinds: ["光", "蟲"], species: "stormmoth", chance: 0.26, tier: "main" },
  { kinds: ["獸", "蟲"], species: "fangmite", chance: 0.25, tier: "main" },
  { kinds: ["鱗", "禽"], species: "scalequill", chance: 0.25, tier: "main" },
  { kinds: ["甲", "蟲"], species: "shellmite", chance: 0.24, tier: "main" },
  { kinds: ["光", "獸"], species: "glintfox", chance: 0.24, tier: "main" },
  { kinds: ["光", "甲"], species: "prismback", chance: 0.24, tier: "main" },
  { kinds: ["光", "鱗"], species: "lightscale", chance: 0.24, tier: "main" },
  { kinds: ["光", "禽"], species: "mistwing", chance: 0.23, tier: "main" },
  { kinds: ["鱗", "蟲"], species: "voidcarp", chance: 0.22, tier: "main" },
  { kinds: ["甲", "禽"], species: "stormshell", chance: 0.22, tier: "main" },
  // —— 次配方（交替產物）——
  { kinds: ["獸", "鱗"], species: "tidehowl", chance: 0.14, tier: "sub" },
  { kinds: ["獸", "甲"], species: "coralmane", chance: 0.13, tier: "sub" },
  { kinds: ["禽", "蟲"], species: "gloomfang", chance: 0.13, tier: "sub" },
  { kinds: ["光", "蟲"], species: "prismoth", chance: 0.12, tier: "sub" },
  { kinds: ["獸", "禽"], species: "galebeast", chance: 0.12, tier: "sub" },
  { kinds: ["鱗", "禽"], species: "deepquill", chance: 0.12, tier: "sub" },
  { kinds: ["甲", "蟲"], species: "reefmite", chance: 0.12, tier: "sub" },
  { kinds: ["光", "甲"], species: "brightback", chance: 0.12, tier: "sub" },
  { kinds: ["獸", "蟲"], species: "inkfox", chance: 0.11, tier: "sub" },
  { kinds: ["光", "獸"], species: "ashspine", chance: 0.1, tier: "sub" },
  { kinds: ["甲", "禽"], species: "stonefinch", chance: 0.1, tier: "sub" },
];

/**
 * 三代種配方：雙親皆為雜交種時觸發（species 對 或 kind 對）
 * parents: 無序物種對；bothHybrid 已隱含
 */
export const TERTIARY_RECIPES = [
  { parents: ["tideling", "mistcarp"], species: "abyssreign", chance: 0.2 },
  { parents: ["tideling", "voidcarp"], species: "abyssreign", chance: 0.16 },
  { parents: ["glintfox", "stormmoth"], species: "voidglint", chance: 0.18 },
  { parents: ["glintfox", "prismoth"], species: "voidglint", chance: 0.15 },
  { parents: ["duskfly", "ironback"], species: "duskiron", chance: 0.18 },
  { parents: ["ironback", "stormshell"], species: "duskiron", chance: 0.14 },
  { parents: ["coralmane", "stormshell"], species: "coralstorm", chance: 0.17 },
  { parents: ["reefwing", "mistwing"], species: "coralstorm", chance: 0.14 },
  { parents: ["gloomfang", "deepquill"], species: "deepfang", chance: 0.17 },
  { parents: ["fangmite", "prismoth"], species: "deepfang", chance: 0.14 },
  { parents: ["tideling", "prismback"], species: "tideprism", chance: 0.16 },
  { parents: ["glintfox", "ironback"], species: "tideprism", chance: 0.13 },
  { parents: ["scalequill", "shellmite"], species: "nightscale", chance: 0.16 },
  { parents: ["voidcarp", "shellmite"], species: "nightscale", chance: 0.13 },
  { parents: ["galebeast", "mistwing"], species: "galevoid", chance: 0.16 },
  { parents: ["reefwing", "voidcarp"], species: "galevoid", chance: 0.12 },
  /* 次配方父母對 → 提高三代入手路徑 */
  { parents: ["tidehowl", "voidcarp"], species: "abyssreign", chance: 0.14 },
  { parents: ["lightscale", "mistcarp"], species: "abyssreign", chance: 0.12 },
  { parents: ["lightscale", "prismoth"], species: "voidglint", chance: 0.13 },
  { parents: ["ashspine", "stormmoth"], species: "voidglint", chance: 0.11 },
  { parents: ["coralmane", "duskfly"], species: "duskiron", chance: 0.13 },
  { parents: ["stonefinch", "ironback"], species: "duskiron", chance: 0.11 },
  { parents: ["reefmite", "stormshell"], species: "coralstorm", chance: 0.12 },
  { parents: ["galebeast", "coralmane"], species: "coralstorm", chance: 0.11 },
  { parents: ["inkfox", "gloomfang"], species: "deepfang", chance: 0.12 },
  { parents: ["reefmite", "deepquill"], species: "deepfang", chance: 0.1 },
  { parents: ["tidehowl", "prismback"], species: "tideprism", chance: 0.12 },
  { parents: ["lightscale", "ironback"], species: "tideprism", chance: 0.1 },
  { parents: ["reefmite", "voidcarp"], species: "nightscale", chance: 0.12 },
  { parents: ["tidehowl", "shellmite"], species: "nightscale", chance: 0.1 },
  { parents: ["ashspine", "mistwing"], species: "galevoid", chance: 0.12 },
  { parents: ["stonefinch", "reefwing"], species: "galevoid", chance: 0.1 },
];

function speciesPairKey(a, b) {
  return [a, b].sort().join("|");
}

const TERTIARY_BY_PARENTS = (() => {
  const map = {};
  for (const r of TERTIARY_RECIPES) {
    if (!r.chance || !SPECIES[r.species]) continue;
    const key = speciesPairKey(r.parents[0], r.parents[1]);
    if (!map[key]) map[key] = [];
    map[key].push(r);
  }
  return map;
})();

export function tertiaryRecipesForParents(spA, spB) {
  if (!spA || !spB || spA === spB) return [];
  return TERTIARY_BY_PARENTS[speciesPairKey(spA, spB)] || [];
}

function pickTertiaryRecipe(spA, spB, genMult = 1) {
  const list = tertiaryRecipesForParents(spA, spB);
  if (!list.length) return null;
  const weighted = {};
  for (const r of list) {
    weighted[r.species] = Math.min(0.55, r.chance * genMult);
  }
  const total = Object.values(weighted).reduce((a, b) => a + b, 0);
  if (Math.random() > Math.min(0.7, total)) return null;
  const species = pickWeighted(weighted);
  return list.find((r) => r.species === species) || list[0];
}

function kindPairKey(k1, k2) {
  return [k1, k2].sort().join("|");
}

/** 同 kind 對可有多條配方；繁殖時按 chance 加權抽 */
const HYBRID_LIST_BY_KINDS = (() => {
  const map = {};
  for (const r of HYBRID_RECIPES) {
    if (!r.chance || !SPECIES[r.species]) continue;
    const key = kindPairKey(r.kinds[0], r.kinds[1]);
    if (!map[key]) map[key] = [];
    map[key].push(r);
  }
  return map;
})();

const HYBRID_BY_KINDS = (() => {
  const map = {};
  for (const [key, list] of Object.entries(HYBRID_LIST_BY_KINDS)) {
    map[key] = list.reduce((best, r) => (!best || r.chance > best.chance ? r : best), null);
  }
  return map;
})();

export function hybridRecipeForKinds(kindA, kindB) {
  if (!kindA || !kindB || kindA === kindB) return null;
  return HYBRID_BY_KINDS[kindPairKey(kindA, kindB)] || null;
}

export function hybridRecipesForKinds(kindA, kindB) {
  if (!kindA || !kindB || kindA === kindB) return [];
  return HYBRID_LIST_BY_KINDS[kindPairKey(kindA, kindB)] || [];
}

function pickHybridRecipe(kindA, kindB, genMult = 1) {
  const list = hybridRecipesForKinds(kindA, kindB);
  if (!list.length) return null;
  const weighted = {};
  for (const r of list) {
    weighted[r.species] = Math.min(0.85, r.chance * genMult);
  }
  /* 以加權機率嘗試；全敗則無雜交 */
  const total = Object.values(weighted).reduce((a, b) => a + b, 0);
  if (Math.random() > Math.min(0.9, total)) return null;
  const species = pickWeighted(weighted);
  return list.find((r) => r.species === species) || list[0];
}

/** 繁殖代數：0＝原生（未繁殖），最高 3 */
export const GEN_MAX = 3;

export function petGeneration(pet) {
  if (!pet) return 0;
  if (pet.generation != null && pet.generation !== "") {
    return Math.max(0, Math.min(GEN_MAX, pet.generation | 0));
  }
  // 舊存檔：有 bornFrom 當 1 代，否則原生
  if (pet.bornFrom) return 1;
  return 0;
}

/**
 * 子代代數（按你嘅規則）
 * 0+0→1；0+G→G；G+G→G50%/G+1 50%；G<H→G70%/H30%
 */
export function rollChildGeneration(genA, genB) {
  const a = Math.max(0, Math.min(GEN_MAX, genA | 0));
  const b = Math.max(0, Math.min(GEN_MAX, genB | 0));
  if (a === 0 && b === 0) return 1;
  if (a === 0) return b;
  if (b === 0) return a;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo === hi) {
    if (lo >= GEN_MAX) return GEN_MAX;
    return Math.random() < 0.5 ? lo : lo + 1;
  }
  return Math.random() < 0.7 ? lo : hi;
}

/** UI／提示用：唔 roll，只描述機率 */
export function childGenerationOdds(genA, genB) {
  const a = Math.max(0, Math.min(GEN_MAX, genA | 0));
  const b = Math.max(0, Math.min(GEN_MAX, genB | 0));
  if (a === 0 && b === 0) return [{ gen: 1, pct: 100 }];
  if (a === 0) return [{ gen: b, pct: 100 }];
  if (b === 0) return [{ gen: a, pct: 100 }];
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo === hi) {
    if (lo >= GEN_MAX) return [{ gen: GEN_MAX, pct: 100 }];
    return [
      { gen: lo, pct: 50 },
      { gen: lo + 1, pct: 50 },
    ];
  }
  return [
    { gen: lo, pct: 70 },
    { gen: hi, pct: 30 },
  ];
}

export function genLabel(gen) {
  const g = Math.max(0, gen | 0);
  return g <= 0 ? "原生" : `繁殖${g}代`;
}

/** 後代愈高：雜交機率／稀有／繼承愈強（用雙親平均代） */
export function genPowerMult(genA, genB) {
  const avg = (petGeneration({ generation: genA }) + petGeneration({ generation: genB })) / 2;
  return 1 + avg * 0.12;
}

/** 依雙親稀有度 roll 子代稀有度（可升階；受代數加成） */
export function rollBreedRarity(parentA, parentB, opts = {}) {
  const ra = parentA.rarity ?? 0;
  const rb = parentB.rarity ?? 0;
  const floor = Math.min(ra, rb);
  const ceil = Math.max(ra, rb);
  const genBoost = Math.round(((opts.genMult || 1) - 1) * 20);
  let weights = { 0: 0, 1: 0, 2: 0, 3: 0 };
  weights[floor] += 55;
  weights[ceil] += 30;
  const up1 = Math.min(RARITY_MAX, ceil + 1);
  weights[up1] += (opts.sameSpecies ? 18 : 12) + genBoost;
  const up2 = Math.min(RARITY_MAX, ceil + 2);
  if (up2 > up1) weights[up2] += (opts.sameSpecies ? 6 : 3) + Math.floor(genBoost / 2);
  if (opts.hybrid) {
    weights[Math.min(RARITY_MAX, ceil + 1)] += 8;
  }
  if (ra + rb >= 4) weights[Math.min(RARITY_MAX, ceil + 1)] += 10;
  const id = Number(pickWeighted(weights) ?? floor);
  return Math.max(0, Math.min(RARITY_MAX, id));
}

/**
 * 恐龍突變式繁殖 + 代際 + 第二性格
 */
export function rollBreedGenes(parentA, parentB) {
  const ga = parentA.genes || {
    species: parentA.speciesId,
    element: parentA.elementId,
    personality: parentA.personalityId,
    personality2: parentA.personality2Id || null,
  };
  const gb = parentB.genes || {
    species: parentB.speciesId,
    element: parentB.elementId,
    personality: parentB.personalityId,
    personality2: parentB.personality2Id || null,
  };
  const spA = SPECIES[ga.species] || SPECIES[parentA.speciesId];
  const spB = SPECIES[gb.species] || SPECIES[parentB.speciesId];
  const kindA = spA?.kind || parentA.kind;
  const kindB = spB?.kind || parentB.kind;
  const sameSpecies = ga.species === gb.species;
  const genA = petGeneration(parentA);
  const genB = petGeneration(parentB);
  const generation = rollChildGeneration(genA, genB);
  const genMult = genPowerMult(genA, genB);

  let species = Math.random() < 0.5 ? ga.species : gb.species;
  let element = Math.random() < 0.5 ? ga.element : gb.element;
  let mutated = false;
  let hybrid = false;
  let newSpecies = false;
  let tertiary = false;
  let recipeUsed = null;

  const bothHybrid = !!(spA?.breedOnly && spB?.breedOnly);
  if (bothHybrid && !sameSpecies) {
    const tRecipe = pickTertiaryRecipe(ga.species, gb.species, genMult);
    if (tRecipe && SPECIES[tRecipe.species]) {
      species = tRecipe.species;
      hybrid = true;
      tertiary = true;
      newSpecies = true;
      mutated = true;
      recipeUsed = { ...tRecipe, tier: "tertiary" };
    }
  }
  if (!tertiary) {
    const recipe = !sameSpecies && kindA !== kindB ? pickHybridRecipe(kindA, kindB, genMult) : null;
    if (recipe && SPECIES[recipe.species]) {
      species = recipe.species;
      hybrid = true;
      newSpecies = true;
      mutated = true;
      recipeUsed = recipe;
    }
  }

  const elemRate = Math.min(0.35, BREED_ELEMENT_MUTATION_RATE * genMult);
  if (Math.random() < elemRate) {
    const others = Object.keys(ELEMENTS).filter((e) => e !== element);
    element = pick(others);
    mutated = true;
  }

  // 性格池：雙親主／副性格
  const pePool = [
    ga.personality,
    gb.personality,
    ga.personality2,
    gb.personality2,
  ].filter((id) => id && PERSONALITIES[id]);
  let personality = pePool.length
    ? pePool[Math.floor(Math.random() * pePool.length)]
    : Math.random() < 0.5
      ? ga.personality
      : gb.personality;
  // 主性格突變
  if (Math.random() < 0.12 * genMult) {
    const others = Object.keys(PERSONALITIES).filter((p) => p !== personality);
    personality = pick(others);
    mutated = true;
  }
  // 第二性格：從池中另抽，可突變
  let personality2 = null;
  const pe2Pool = pePool.filter((p) => p !== personality);
  if (pe2Pool.length && Math.random() < 0.72) {
    personality2 = pe2Pool[Math.floor(Math.random() * pe2Pool.length)];
  } else if (Math.random() < 0.45) {
    const others = Object.keys(PERSONALITIES).filter((p) => p !== personality);
    personality2 = pick(others);
    mutated = true;
  }
  if (personality2 === personality) personality2 = null;

  /* 血脈紋：繼承雙親池，約 28% 突變加紋，最高 2 */
  const markPool = [
    ...normalizeBloodmarks(parentA.bloodmarks),
    ...normalizeBloodmarks(parentB.bloodmarks),
  ];
  let bloodmarks = [];
  if (markPool.length && Math.random() < 0.7) {
    bloodmarks.push(markPool[Math.floor(Math.random() * markPool.length)]);
  }
  if (markPool.length > 1 && Math.random() < 0.35) {
    const other = markPool.find((m) => m !== bloodmarks[0]);
    if (other) bloodmarks.push(other);
  }
  const peBreedMut =
    ((PERSONALITIES[ga.personality]?.breedMutate || 1) +
      (PERSONALITIES[gb.personality]?.breedMutate || 1)) /
    2;
  if (Math.random() < 0.28 * genMult * peBreedMut) {
    const candidates = BLOODLINE_MARK_IDS.filter((id) => !bloodmarks.includes(id));
    if (candidates.length) {
      bloodmarks.push(pick(candidates));
      mutated = true;
    }
  }
  bloodmarks = normalizeBloodmarks(bloodmarks);

  const rarity = rollBreedRarity(parentA, parentB, { sameSpecies, hybrid, genMult });
  const parentMax = Math.max(parentA.rarity ?? 0, parentB.rarity ?? 0);
  const rarityUp = rarity > parentMax;

  return {
    species,
    element,
    personality,
    personality2,
    bloodmarks,
    rarity,
    generation,
    genA,
    genB,
    mutated,
    hybrid,
    tertiary,
    newSpecies,
    rarityUp,
    sameSpecies,
    recipeTier: recipeUsed?.tier || null,
    hybridChance: recipeUsed ? Math.min(0.85, recipeUsed.chance * genMult) : 0,
  };
}

/** 秘境隨機生成一隻野生靈寵；可帶分層權重（僅野生種，受 realm 分池） */
export function rollWildEncounter(dungeonId = "wild", dungeonDef = null, realm = 0) {
  const wildIds = wildSpeciesIds(realm);
  const weights = dungeonDef?.encounterWeights;
  let speciesId;
  if (weights) {
    const filtered = Object.fromEntries(
      Object.entries(weights).filter(([id]) => wildIds.includes(id))
    );
    speciesId = pickWeighted(filtered) || pick(wildIds);
  } else {
    speciesId = pick(wildIds);
  }
  const elWeights = dungeonDef?.elementWeights;
  const elementId = elWeights
    ? pickWeighted(elWeights) || pick(Object.keys(ELEMENTS))
    : pick(Object.keys(ELEMENTS));
  const personalityId = pick(Object.keys(PERSONALITIES));
  const baseCost = Math.min(BOND_COST_MAX, 24 + Math.floor(Math.random() * 19));
  let bloodmarks = [];
  if ((realm | 0) >= 2 && Math.random() < 0.18) {
    bloodmarks = [pick(BLOODLINE_MARK_IDS)];
  }
  if ((realm | 0) >= 4 && Math.random() < 0.08) {
    const extra = pick(BLOODLINE_MARK_IDS.filter((id) => id !== bloodmarks[0]));
    if (extra) bloodmarks.push(extra);
  }
  bloodmarks = normalizeBloodmarks(bloodmarks);
  const pet = buildPetStats({
    id: `enc-${dungeonId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    species: speciesId,
    element: elementId,
    personality: personalityId,
    cost: baseCost,
    rarity: 0,
    bloodmarks,
  });
  const bondRate = BOND_RATE_BY_PERSONALITY[personalityId] ?? 0.5;
  return {
    ...pet,
    encounterId: pet.templateId,
    bondRate,
    metDungeon: dungeonId,
    status: "pending",
  };
}

export const RECRUIT_POOL = [
  { species: "reefox", element: "tide", personality: "sly", weight: 4, cost: 48 },
  { species: "reefox", element: "flame", personality: "fierce", weight: 2, cost: 52 },
  { species: "tidecarp", element: "tide", personality: "gentle", weight: 4, cost: 50 },
  { species: "tidecarp", element: "stone", personality: "steady", weight: 2, cost: 54 },
  { species: "ashwing", element: "gale", personality: "fierce", weight: 3, cost: 52 },
  { species: "ashwing", element: "flame", personality: "sly", weight: 2, cost: 56 },
  { species: "mossback", element: "stone", personality: "steady", weight: 3, cost: 50 },
  { species: "mossback", element: "tide", personality: "gentle", weight: 2, cost: 52 },
  { species: "nightmoth", element: "gloom", personality: "wild", weight: 3, cost: 62 },
  { species: "nightmoth", element: "gale", personality: "sly", weight: 2, cost: 65 },
  { species: "glowfin", element: "flame", personality: "fierce", weight: 3, cost: 58 },
  { species: "glowfin", element: "tide", personality: "gentle", weight: 2, cost: 60 },
  { species: "saltpup", element: "tide", personality: "fierce", weight: 3, cost: 48 },
  { species: "brineeel", element: "stone", personality: "steady", weight: 3, cost: 50 },
  { species: "cliffkite", element: "gale", personality: "sly", weight: 2, cost: 58 },
  { species: "barnshell", element: "stone", personality: "gentle", weight: 2, cost: 56 },
];

export const SHOP_OFFER_COUNT = 3;

/** 戰術偏好（自動戰鬥） */
export const TACTICS = {
  balanced: { id: "balanced", name: "均衡", desc: "預設自動：就緒技隨機，打最低血" },
  focus_boss: { id: "focus_boss", name: "集火", desc: "優先攻擊 BOSS／精英" },
  sustain: { id: "sustain", name: "續航", desc: "優先治療／減傷技" },
};

export const TACTIC_IDS = ["balanced", "focus_boss", "sustain"];

/** 出戰陣型（影響寵物攻／血／速＋友方企位；人物不受影響） */
export const FORMATIONS = {
  vanguard: {
    id: "vanguard",
    name: "前衛",
    desc: "寵物壓前排 · 血量 +12%，攻擊 −5%",
    petHpMult: 1.12,
    petAtkMult: 0.95,
    petSpdMult: 1,
  },
  balanced: {
    id: "balanced",
    name: "均衡",
    desc: "前後交錯站位 · 無額外修正",
    petHpMult: 1,
    petAtkMult: 1,
    petSpdMult: 1,
  },
  rear: {
    id: "rear",
    name: "後場",
    desc: "寵物靠後排 · 攻擊 +12%，血量 −6%，速度 +5%",
    petHpMult: 0.94,
    petAtkMult: 1.12,
    petSpdMult: 1.05,
  },
};

export const FORMATION_IDS = ["vanguard", "balanced", "rear"];

/** 每側固定 3 企位（列）；前／後排用 lane 分欄 */
export const FORMATION_SLOT_COUNT = 3;

/**
 * 友方陣型企位：slot=列(0上…2下)，lane=front|rear（對敵遠近）
 * @returns {{ slot: number, lane: "front"|"rear", unitIndex: number|null }[]}
 */
export function formationAllyPlacement(formationId, unitCount = 0) {
  const id = FORMATION_IDS.includes(formationId) ? formationId : "balanced";
  const n = Math.max(0, Math.min(FORMATION_SLOT_COUNT, unitCount | 0));
  const lanes =
    id === "vanguard"
      ? ["front", "front", "front"]
      : id === "rear"
        ? ["rear", "rear", "rear"]
        : ["rear", "front", "rear"];
  const out = [];
  for (let slot = 0; slot < FORMATION_SLOT_COUNT; slot += 1) {
    out.push({
      slot,
      lane: lanes[slot],
      unitIndex: slot < n ? slot : null,
    });
  }
  return out;
}

/**
 * 敵方企位：波次順序填 slot，一律前排（對準友軍）
 * @returns {{ slot: number, lane: "front"|"rear", unitIndex: number|null }[]}
 */
export function formationFoePlacement(unitCount = 0) {
  const n = Math.max(0, Math.min(FORMATION_SLOT_COUNT, unitCount | 0));
  const out = [];
  for (let slot = 0; slot < FORMATION_SLOT_COUNT; slot += 1) {
    out.push({
      slot,
      lane: "front",
      unitIndex: slot < n ? slot : null,
    });
  }
  return out;
}

/**
 * 每日秘境挑戰規則（每層 seed 抽 1；過關另獎）
 */
export const DUNGEON_CHALLENGE_RULES = [
  {
    id: "max_1_pet",
    label: "挑戰：孤寵出戰（僅 1 寵）",
    maxPets: 1,
    bonus: { stones: 24, scrap: 1 },
  },
  {
    id: "max_2_pets",
    label: "挑戰：出戰≤2寵",
    maxPets: 2,
    bonus: { stones: 18, dust: 4 },
  },
  {
    id: "ban_flame",
    label: "挑戰：禁焰屬出戰",
    banElement: "flame",
    bonus: { stones: 16, dust: 4 },
  },
  {
    id: "ban_gloom",
    label: "挑戰：禁幽屬出戰",
    banElement: "gloom",
    bonus: { stones: 16, dust: 4 },
  },
  {
    id: "elite_trash",
    label: "挑戰：雜兵精英化",
    eliteTrash: true,
    bonus: { stones: 24, scrap: 1 },
  },
  {
    id: "boss_bulk",
    label: "挑戰：BOSS 強化",
    bossHpMult: 1.25,
    bossAtkMult: 1.12,
    bonus: { stones: 28, scrap: 1 },
  },
  {
    id: "ban_tide",
    label: "挑戰：禁潮屬出戰",
    banElement: "tide",
    bonus: { stones: 16, dust: 4 },
  },
  {
    id: "ban_stone",
    label: "挑戰：禁岩屬出戰",
    banElement: "stone",
    bonus: { stones: 16, dust: 4 },
  },
  {
    id: "min_gen2",
    label: "挑戰：僅 ≥2 代靈寵",
    minGeneration: 2,
    bonus: { stones: 22, dust: 5 },
  },
];

export function pickDailyChallenge(dateKey, dungeonId) {
  const list = DUNGEON_CHALLENGE_RULES;
  if (!list.length) return null;
  const idx = hashDayKey(`${dateKey || ""}:chal:${dungeonId || ""}`) % list.length;
  return { ...list[idx] };
}

/** 評估出戰是否滿足挑戰規則（可拿挑戰獎） */
export function evaluateDungeonChallenge(pets, challenge, opts = {}) {
  if (!challenge) return { ok: true, reason: "" };
  const list = Array.isArray(pets) ? pets : [];
  if (challenge.maxPets != null && list.length > challenge.maxPets) {
    return { ok: false, reason: `出戰 ${list.length}／上限 ${challenge.maxPets}` };
  }
  if (challenge.banElement) {
    const hit = list.filter((p) => p.elementId === challenge.banElement);
    if (hit.length) {
      const elName = ELEMENTS[challenge.banElement]?.name || challenge.banElement;
      return { ok: false, reason: `含禁屬${elName}` };
    }
  }
  if (challenge.minGeneration != null) {
    const low = list.filter((p) => petGeneration(p) < challenge.minGeneration);
    if (low.length) {
      return { ok: false, reason: `需 ≥${challenge.minGeneration} 代` };
    }
  }
  return { ok: true, reason: "" };
}

/**
 * 每日秘境修飾（全關共用；用 todayKey 穩定抽一條）
 */
export const DUNGEON_DAILY_MODS = [
  {
    id: "elite_bulk",
    label: "今日：精英血量 +20%",
    eliteHpMult: 1.2,
  },
  {
    id: "flame_favor",
    label: "今日：焰屬友方攻擊 +15%",
    allyElemAtk: { element: "flame", mult: 1.15 },
  },
  {
    id: "scrap_bonus",
    label: "今日：通關額外 +1 碎片",
    clearScrapBonus: 1,
  },
  {
    id: "boss_rage",
    label: "今日：BOSS 攻擊 +12%",
    bossAtkMult: 1.12,
  },
  {
    id: "gale_favor",
    label: "今日：嵐屬友方攻擊 +15%",
    allyElemAtk: { element: "gale", mult: 1.15 },
  },
  {
    id: "stone_bonus",
    label: "今日：通關額外 +15 靈石",
    clearStoneBonus: 15,
  },
  {
    id: "tide_favor",
    label: "今日：潮屬友方攻擊 +15%",
    allyElemAtk: { element: "tide", mult: 1.15 },
  },
  {
    id: "gloom_favor",
    label: "今日：幽屬友方攻擊 +15%",
    allyElemAtk: { element: "gloom", mult: 1.15 },
  },
  {
    id: "dust_bonus",
    label: "今日：通關額外 +6 靈塵",
    clearDustBonus: 6,
  },
  {
    id: "feed_bonus",
    label: "今日：通關額外 +8 飼料",
    clearFeedBonus: 8,
  },
];

function hashDayKey(key) {
  let h = 0;
  const s = String(key || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function pickDailyDungeonMod(dateKey) {
  const list = DUNGEON_DAILY_MODS;
  if (!list.length) return null;
  const idx = hashDayKey(dateKey) % list.length;
  return list[idx];
}

/**
 * 雜交種專屬第二技（優先於 kind 二技）
 */
export const HYBRID_SKILLS = {
  tideling: "tide_beast_rush",
  duskfly: "dusk_veil",
  ironback: "iron_bulwark",
  mistcarp: "mist_surge",
  stormmoth: "storm_lance",
  reefwing: "reef_dive",
  fangmite: "fang_burst",
  scalequill: "scale_glide",
  shellmite: "shell_spike",
  glintfox: "glint_beam",
  prismback: "prism_shell",
  /* 三代種沿用相近技能 */
  abyssreign: "mist_surge",
  voidglint: "glint_beam",
  duskiron: "iron_bulwark",
  coralstorm: "storm_lance",
  deepfang: "fang_burst",
  tideprism: "tide_beast_rush",
  nightscale: "scale_glide",
  galevoid: "reef_dive",
};

/** 高代子代出生加成（P15B） */
export function genAwakenBonus(generation) {
  const g = Math.max(0, generation | 0);
  if (g >= 3) {
    return { atk: 4, hp: 10, spd: 2, skillLevel: 2, label: "三代血脈覺醒" };
  }
  if (g >= 2) {
    return { atk: 2, hp: 5, spd: 1, skillLevel: null, label: "二代強化" };
  }
  return null;
}

/** 代數出戰攻／血倍率 */
export function genCombatMult(generation) {
  const g = Math.max(0, Math.min(3, generation | 0));
  if (g >= 3) return 1.12;
  if (g >= 2) return 1.08;
  if (g >= 1) return 1.04;
  return 1;
}

/**
 * 秘境表：掉落、首通、遇寵權重、冷卻（毫秒）
 */
export const DUNGEONS = [
  {
    id: "tide_1",
    name: "潮汐廢墟 · 一層",
    needRealm: 0,
    cooldownMs: 20_000,
    waves: [
      {
        label: "潮腐前哨",
        enemies: [
          { name: "潮腐鼠", hp: 38, atk: 6, spd: 7, element: "tide", role: "normal" },
          { name: "暗礁妖", hp: 50, atk: 8, spd: 5, element: "stone", role: "normal" },
        ],
      },
      {
        label: "廢墟精英",
        enemies: [
          {
            name: "潮蝕爪衛",
            hp: 95,
            atk: 11,
            spd: 8,
            element: "tide",
            role: "elite",
            skills: ["tide_crush", "coral_spike"],
          },
        ],
      },
    ],
    conditions: [
      {
        id: "tide_1_flame",
        type: "min_element",
        element: "flame",
        count: 1,
        label: "條件：出戰含焰屬",
        bonus: { stones: 12, scrap: 0 },
      },
      {
        id: "tide_1_lean",
        type: "max_pets",
        max: 2,
        label: "條件：出戰≤2寵",
        bonus: { stones: 10, feed: 2 },
      },
    ],
    passives: [
      {
        id: "tide_1_favored",
        type: "elem_atk",
        element: "flame",
        mult: 1.12,
        label: "關卡：焰屬友方攻擊 +12%",
      },
    ],
    reward: { stones: 32, scrap: 1 },
    firstClearBonus: { stones: 45, scrap: 1 },
    eliteBonus: { stones: 8, scrap: 1 },
    bossBonus: null,
    encounterWeights: {
      reefox: 4,
      tidecarp: 3,
      mossback: 2,
      ashwing: 1,
      nightmoth: 1,
      glowfin: 1,
    },
    elementWeights: { tide: 4, stone: 2, flame: 1, gale: 1, gloom: 1 },
  },
  {
    id: "tide_2",
    name: "潮汐廢墟 · 二層",
    needRealm: 2,
    cooldownMs: 35_000,
    waves: [
      {
        label: "黑潮巡邏",
        enemies: [
          { name: "黑潮衛", hp: 70, atk: 11, spd: 8, element: "tide", role: "normal" },
          { name: "深淵蛙", hp: 65, atk: 10, spd: 10, element: "gloom", role: "normal" },
        ],
      },
      {
        label: "使徒精英",
        enemies: [
          {
            name: "暗潮使徒",
            hp: 130,
            atk: 15,
            spd: 7,
            element: "gloom",
            role: "elite",
            skills: ["shadow_cleave", "venom_bite"],
          },
        ],
      },
      {
        label: "二層看守",
        enemies: [
          {
            name: "沉淵監守",
            hp: 200,
            atk: 17,
            spd: 9,
            element: "gloom",
            role: "boss",
            skills: ["abyss_slam", "shadow_cleave", "core_roar"],
            actions: 2,
          },
        ],
      },
    ],
    conditions: [
      {
        id: "tide_2_unique",
        type: "unique_species",
        label: "條件：出戰無重複種族",
        bonus: { stones: 18, scrap: 1 },
      },
      {
        id: "tide_2_gale",
        type: "min_element",
        element: "gale",
        count: 1,
        label: "條件：出戰含嵐屬",
        bonus: { stones: 14, dust: 4 },
      },
    ],
    passives: [
      {
        id: "tide_2_favored",
        type: "elem_atk",
        element: "gale",
        mult: 1.1,
        label: "關卡：嵐屬友方攻擊 +10%",
      },
    ],
    reward: { stones: 64, scrap: 2 },
    firstClearBonus: { stones: 92, scrap: 2 },
    eliteBonus: { stones: 12, scrap: 1 },
    bossBonus: { stones: 22, scrap: 1 },
    encounterWeights: {
      nightmoth: 4,
      glowfin: 3,
      ashwing: 2,
      tidecarp: 2,
      reefox: 1,
      mossback: 1,
    },
    elementWeights: { gloom: 4, tide: 2, flame: 2, gale: 1, stone: 1 },
  },
  {
    id: "tide_3",
    name: "潮汐廢墟 · 心核",
    needRealm: 3,
    cooldownMs: 50_000,
    waves: [
      {
        label: "心核外衛",
        enemies: [
          { name: "暗潮之影", hp: 110, atk: 14, spd: 9, element: "gloom", role: "normal" },
          { name: "岩殼衛", hp: 120, atk: 13, spd: 5, element: "stone", role: "normal" },
        ],
      },
      {
        label: "雙生精英",
        enemies: [
          {
            name: "裂潮刃侍",
            hp: 150,
            atk: 18,
            spd: 10,
            element: "tide",
            role: "elite",
            skills: ["tide_crush", "abyss_slam"],
          },
          {
            name: "幽甲祭司",
            hp: 140,
            atk: 15,
            spd: 7,
            element: "gloom",
            role: "elite",
            skills: ["shadow_cleave", "mist_ward"],
          },
        ],
      },
      {
        label: "心核 BOSS",
        enemies: [
          {
            name: "心核看守",
            hp: 320,
            atk: 22,
            spd: 8,
            element: "stone",
            role: "boss",
            skills: ["abyss_slam", "shadow_cleave", "core_roar", "shell_guard"],
            actions: 2,
          },
        ],
      },
    ],
    conditions: [
      {
        id: "tide_3_hybrid",
        type: "min_hybrid",
        count: 1,
        label: "條件：出戰含雜交種",
        bonus: { stones: 28, scrap: 1 },
      },
      {
        id: "tide_3_gen",
        type: "min_gen",
        gen: 2,
        label: "條件：出戰含≥2代寵",
        bonus: { stones: 24, dust: 6 },
      },
      {
        id: "tide_3_lean",
        type: "max_pets",
        max: 2,
        label: "條件：出戰≤2寵",
        bonus: { stones: 30, scrap: 1 },
      },
    ],
    passives: [
      {
        id: "tide_3_stone_pen",
        type: "elem_atk",
        element: "gale",
        mult: 1.15,
        label: "關卡：嵐屬友方攻擊 +15%（剋岩）",
      },
    ],
    reward: { stones: 138, scrap: 4 },
    firstClearBonus: { stones: 172, scrap: 3 },
    eliteBonus: { stones: 18, scrap: 1 },
    bossBonus: { stones: 40, scrap: 2 },
    encounterWeights: {
      mossback: 3,
      nightmoth: 3,
      ashwing: 2,
      glowfin: 2,
      reefox: 2,
      tidecarp: 1,
    },
    elementWeights: { stone: 3, gloom: 3, gale: 2, flame: 1, tide: 1 },
  },
  {
    id: "tide_4",
    name: "潮汐廢墟 · 深層",
    needRealm: 4,
    cooldownMs: 70_000,
    waves: [
      {
        label: "深層前衛",
        enemies: [
          { name: "深潮骸兵", hp: 140, atk: 18, spd: 10, element: "tide", role: "normal" },
          { name: "裂岩影", hp: 150, atk: 16, spd: 7, element: "stone", role: "normal" },
          { name: "幽霧刺", hp: 120, atk: 20, spd: 12, element: "gloom", role: "normal" },
        ],
      },
      {
        label: "雙生深衛",
        enemies: [
          {
            name: "血紋潮衛",
            hp: 200,
            atk: 22,
            spd: 11,
            element: "tide",
            role: "elite",
            skills: ["tide_crush", "abyss_slam"],
          },
          {
            name: "心核祭司",
            hp: 190,
            atk: 20,
            spd: 8,
            element: "gloom",
            role: "elite",
            skills: ["shadow_cleave", "core_roar", "mist_ward"],
          },
        ],
      },
      {
        label: "深層 BOSS",
        enemies: [
          {
            name: "暗潮心核·真影",
            hp: 480,
            atk: 28,
            spd: 10,
            element: "gloom",
            role: "boss",
            skills: ["abyss_slam", "shadow_cleave", "core_roar", "shell_guard", "tide_crush"],
            actions: 2,
          },
        ],
      },
    ],
    conditions: [
      {
        id: "tide_4_blood",
        type: "min_hybrid",
        count: 1,
        label: "條件：出戰含雜交種",
        bonus: { stones: 45, scrap: 2 },
      },
      {
        id: "tide_4_gen",
        type: "min_gen",
        gen: 2,
        label: "條件：出戰含≥2代寵",
        bonus: { stones: 40, dust: 10 },
      },
      {
        id: "tide_4_lean",
        type: "max_pets",
        max: 2,
        label: "條件：出戰≤2寵",
        bonus: { stones: 50, scrap: 1 },
      },
    ],
    passives: [
      {
        id: "tide_4_light",
        type: "elem_atk",
        element: "flame",
        mult: 1.12,
        label: "關卡：焰屬友方攻擊 +12%",
      },
    ],
    reward: { stones: 200, scrap: 6 },
    firstClearBonus: { stones: 280, scrap: 4 },
    eliteBonus: { stones: 30, scrap: 2 },
    bossBonus: { stones: 70, scrap: 3 },
    encounterWeights: {
      nightmoth: 3,
      glowfin: 3,
      ashwing: 2,
      mossback: 2,
      reefox: 2,
      tidecarp: 2,
    },
    elementWeights: { gloom: 3, tide: 2, stone: 2, flame: 2, gale: 2 },
  },
];

/** 秘境 tier → id */
export function dungeonIdForTier(tier) {
  return `tide_${Math.max(1, tier | 0)}`;
}

export function parseDungeonTier(dungeonId) {
  const m = /^tide_(\d+)$/.exec(String(dungeonId || ""));
  return m ? parseInt(m[1], 10) : 0;
}

export function dungeonDisplayName(tier) {
  if (tier <= 1) return "潮汐廢墟 · 一層";
  if (tier === 2) return "潮汐廢墟 · 二層";
  if (tier === 3) return "潮汐廢墟 · 心核";
  if (tier === 4) return "潮汐廢墟 · 深層";
  return `潮汐廢墟 · ${tier}層`;
}

function cloneDungeon(d) {
  return JSON.parse(JSON.stringify(d));
}

function scaleReward(obj, mult) {
  if (!obj) return obj;
  const out = { ...obj };
  for (const k of Object.keys(out)) {
    if (typeof out[k] === "number") out[k] = Math.max(0, Math.round(out[k] * mult));
  }
  return out;
}

/** 5 層以上：以第 4 層為基準按 tier 公式放大 */
export function scaleDungeonForTier(base, tier) {
  const d = cloneDungeon(base);
  d.id = dungeonIdForTier(tier);
  d.name = dungeonDisplayName(tier);
  d.needRealm = Math.max(0, tier - 1);
  const extra = tier - 4;
  const statMult = Math.pow(1.22, extra);
  const rewardMult = Math.pow(1.18, extra);
  d.cooldownMs = Math.round(d.cooldownMs * (1 + extra * 0.12));
  for (const w of d.waves || []) {
    for (const e of w.enemies || []) {
      e.hp = Math.round(e.hp * statMult);
      e.atk = Math.round(e.atk * statMult);
      if (extra > 0) e.spd = Math.min(15, Math.round(e.spd * (1 + extra * 0.02)));
    }
  }
  d.reward = scaleReward(d.reward, rewardMult);
  d.firstClearBonus = scaleReward(d.firstClearBonus, rewardMult);
  d.eliteBonus = scaleReward(d.eliteBonus, rewardMult);
  d.bossBonus = scaleReward(d.bossBonus, rewardMult);
  for (const c of d.conditions || []) {
    if (c.bonus) c.bonus = scaleReward(c.bonus, rewardMult);
  }
  return d;
}

export function buildDungeonForTier(tier) {
  const t = Math.max(1, tier | 0);
  const base = DUNGEONS[Math.min(t, 4) - 1];
  if (!base) return null;
  if (t <= 4) return cloneDungeon(base);
  return scaleDungeonForTier(DUNGEONS[3], t);
}

/** 可見秘境 tier 列表：至少 4 層，隨階段 +1 層預覽 */
export function dungeonsForRealm(realm) {
  const count = Math.max(4, (realm | 0) + 1);
  const out = [];
  for (let t = 1; t <= count; t++) out.push(dungeonIdForTier(t));
  return out;
}

function seededRand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pickSeeded(list, rand, count = 1) {
  if (!list?.length) return [];
  const pool = list.map((x, i) => ({ x, i }));
  const out = [];
  for (let n = 0; n < count && pool.length; n++) {
    const idx = Math.floor(rand() * pool.length);
    out.push(pool[idx].x);
    pool.splice(idx, 1);
  }
  return out;
}

/** 每日 Boss 變體池（同 tier 相近 powerScore） */
const BOSS_VARIANTS = {
  1: [],
  2: [
    {
      name: "沉淵監守",
      hp: 200,
      atk: 17,
      spd: 9,
      element: "gloom",
      skills: ["abyss_slam", "shadow_cleave", "core_roar"],
      waveLabel: "二層看守",
    },
    {
      name: "黑潮督軍",
      hp: 210,
      atk: 16,
      spd: 10,
      element: "tide",
      skills: ["tide_crush", "abyss_slam", "core_roar"],
      waveLabel: "督軍前線",
    },
    {
      name: "裂岩守將",
      hp: 195,
      atk: 18,
      spd: 8,
      element: "stone",
      skills: ["shell_guard", "abyss_slam", "coral_spike"],
      waveLabel: "岩殼防線",
    },
  ],
  3: [
    {
      name: "心核看守",
      hp: 320,
      atk: 22,
      spd: 8,
      element: "stone",
      skills: ["abyss_slam", "shadow_cleave", "core_roar", "shell_guard"],
      waveLabel: "心核 BOSS",
    },
    {
      name: "幽潮巫首",
      hp: 300,
      atk: 23,
      spd: 9,
      element: "gloom",
      skills: ["shadow_cleave", "mist_ward", "core_roar", "venom_bite"],
      waveLabel: "巫首祭壇",
    },
    {
      name: "裂潮雙刃",
      hp: 310,
      atk: 24,
      spd: 10,
      element: "tide",
      skills: ["tide_crush", "abyss_slam", "storm_lance"],
      waveLabel: "雙刃決戰",
    },
  ],
  4: [
    {
      name: "暗潮心核·真影",
      hp: 480,
      atk: 28,
      spd: 10,
      element: "gloom",
      skills: ["abyss_slam", "shadow_cleave", "core_roar", "shell_guard", "tide_crush"],
      waveLabel: "深層 BOSS",
    },
    {
      name: "萬潮噬主",
      hp: 460,
      atk: 30,
      spd: 11,
      element: "tide",
      skills: ["tide_crush", "abyss_slam", "core_roar", "storm_lance"],
      waveLabel: "噬潮王座",
    },
    {
      name: "寂滅岩靈",
      hp: 500,
      atk: 27,
      spd: 9,
      element: "stone",
      skills: ["shell_guard", "abyss_slam", "core_roar", "coral_spike"],
      waveLabel: "岩靈核心",
    },
  ],
};

const ELITE_VARIANTS = {
  1: [
    {
      name: "潮蝕爪衛",
      hp: 95,
      atk: 11,
      spd: 8,
      element: "tide",
      skills: ["tide_crush", "coral_spike"],
      waveLabel: "廢墟精英",
    },
    {
      name: "暗礁刃客",
      hp: 90,
      atk: 12,
      spd: 9,
      element: "gloom",
      skills: ["shadow_cleave", "venom_bite"],
      waveLabel: "暗礁精英",
    },
  ],
  2: [
    {
      name: "暗潮使徒",
      hp: 130,
      atk: 15,
      spd: 7,
      element: "gloom",
      skills: ["shadow_cleave", "venom_bite"],
      waveLabel: "使徒精英",
    },
    {
      name: "深淵獵手",
      hp: 125,
      atk: 16,
      spd: 9,
      element: "tide",
      skills: ["tide_crush", "abyss_slam"],
      waveLabel: "獵手精英",
    },
  ],
};

const CONDITION_TEMPLATES = {
  1: [
    {
      type: "min_element",
      element: "flame",
      count: 1,
      label: "條件：出戰含焰屬",
      bonus: { stones: 12, scrap: 0 },
    },
    {
      type: "min_element",
      element: "tide",
      count: 1,
      label: "條件：出戰含潮屬",
      bonus: { stones: 10, scrap: 0 },
    },
    {
      type: "max_pets",
      max: 2,
      label: "條件：出戰≤2寵",
      bonus: { stones: 10, feed: 2 },
    },
    {
      type: "max_pets",
      max: 1,
      label: "條件：單騎出戰",
      bonus: { stones: 14, dust: 3 },
    },
  ],
  2: [
    {
      type: "unique_species",
      label: "條件：出戰無重複種族",
      bonus: { stones: 18, scrap: 1 },
    },
    {
      type: "min_element",
      element: "gale",
      count: 1,
      label: "條件：出戰含嵐屬",
      bonus: { stones: 14, dust: 4 },
    },
    {
      type: "min_element",
      element: "stone",
      count: 1,
      label: "條件：出戰含岩屬",
      bonus: { stones: 16, scrap: 1 },
    },
    {
      type: "max_pets",
      max: 2,
      label: "條件：出戰≤2寵",
      bonus: { stones: 15, feed: 3 },
    },
  ],
  3: [
    {
      type: "min_hybrid",
      count: 1,
      label: "條件：出戰含雜交種",
      bonus: { stones: 28, scrap: 1 },
    },
    {
      type: "min_gen",
      gen: 2,
      label: "條件：出戰含≥2代寵",
      bonus: { stones: 24, dust: 6 },
    },
    {
      type: "max_pets",
      max: 2,
      label: "條件：出戰≤2寵",
      bonus: { stones: 30, scrap: 1 },
    },
    {
      type: "unique_species",
      label: "條件：出戰無重複種族",
      bonus: { stones: 22, dust: 5 },
    },
  ],
  4: [
    {
      type: "min_hybrid",
      count: 1,
      label: "條件：出戰含雜交種",
      bonus: { stones: 45, scrap: 2 },
    },
    {
      type: "min_gen",
      gen: 2,
      label: "條件：出戰含≥2代寵",
      bonus: { stones: 40, dust: 10 },
    },
    {
      type: "min_gen",
      gen: 3,
      label: "條件：出戰含≥3代寵",
      bonus: { stones: 55, scrap: 2 },
    },
    {
      type: "max_pets",
      max: 2,
      label: "條件：出戰≤2寵",
      bonus: { stones: 50, scrap: 1 },
    },
  ],
};

const PASSIVE_TEMPLATES = {
  1: [
    { type: "elem_atk", element: "flame", mult: 1.12, label: "關卡：焰屬友方攻擊 +12%" },
    { type: "elem_atk", element: "tide", mult: 1.1, label: "關卡：潮屬友方攻擊 +10%" },
  ],
  2: [
    { type: "elem_atk", element: "gale", mult: 1.1, label: "關卡：嵐屬友方攻擊 +10%" },
    { type: "elem_atk", element: "gloom", mult: 1.08, label: "關卡：幽屬友方攻擊 +8%" },
  ],
  3: [
    { type: "elem_atk", element: "gale", mult: 1.15, label: "關卡：嵐屬友方攻擊 +15%（剋岩）" },
    { type: "elem_atk", element: "flame", mult: 1.12, label: "關卡：焰屬友方攻擊 +12%" },
  ],
  4: [
    { type: "elem_atk", element: "flame", mult: 1.12, label: "關卡：焰屬友方攻擊 +12%" },
    { type: "elem_atk", element: "stone", mult: 1.1, label: "關卡：岩屬友方攻擊 +10%" },
  ],
};

function tierBand(tier) {
  return Math.min(4, Math.max(1, tier | 0));
}

function applyStatVariance(val, rand, spread = 0.08) {
  const mult = 1 + (rand() * 2 - 1) * spread;
  return Math.max(1, Math.round(val * mult));
}

/**
 * 每日秘境變體：同 tier 相近難度，輪換 Boss／精英／條件／被動
 * dateKey 通常為 YYYY-MM-DD；同 seed 必須 deterministic
 */
export function generateDailyDungeon(dungeonId, dateKey) {
  const tier = parseDungeonTier(dungeonId);
  if (!tier) return null;
  const d = buildDungeonForTier(tier);
  if (!d) return null;

  const seed = hashDayKey(`${dateKey || ""}:${dungeonId}`);
  const rand = seededRand(seed);
  const band = tierBand(tier);

  const condPool = CONDITION_TEMPLATES[band] || CONDITION_TEMPLATES[4];
  const pickedConds = pickSeeded(condPool, rand, Math.min(2, condPool.length)).map((c, i) => ({
    ...c,
    id: `${dungeonId}_dc_${i}_${seed % 997}`,
  }));
  d.conditions = pickedConds;

  const passivePool = PASSIVE_TEMPLATES[band] || PASSIVE_TEMPLATES[4];
  const pickedPassive = pickSeeded(passivePool, rand, 1)[0];
  d.passives = pickedPassive
    ? [{ ...pickedPassive, id: `${dungeonId}_dp_${seed % 991}` }]
    : [];

  const bossPool = BOSS_VARIANTS[band] || BOSS_VARIANTS[4];
  if (bossPool.length) {
    const bossTpl = pickSeeded(bossPool, rand, 1)[0];
    const statMult = tier > 4 ? Math.pow(1.22, tier - 4) : 1;
    const bossEnemy = {
      name: bossTpl.name,
      hp: applyStatVariance(Math.round(bossTpl.hp * statMult), rand),
      atk: applyStatVariance(Math.round(bossTpl.atk * statMult), rand),
      spd: bossTpl.spd,
      element: bossTpl.element,
      role: "boss",
      skills: [...bossTpl.skills],
      actions: 2,
    };
    const waves = dungeonWaves(d);
    const bossWaveIdx = waves.findIndex((w) => (w.enemies || []).some((e) => e.role === "boss"));
    if (bossWaveIdx >= 0) {
      waves[bossWaveIdx] = {
        label: bossTpl.waveLabel,
        enemies: [bossEnemy],
      };
    } else {
      waves.push({ label: bossTpl.waveLabel, enemies: [bossEnemy] });
    }
    d.waves = waves;
    d.dailyVariantLabel = bossTpl.name;
  } else {
    const elitePool = ELITE_VARIANTS[band];
    if (elitePool?.length) {
      const eliteTpl = pickSeeded(elitePool, rand, 1)[0];
      const statMult = tier > 4 ? Math.pow(1.22, tier - 4) : 1;
      const eliteEnemy = {
        name: eliteTpl.name,
        hp: applyStatVariance(Math.round(eliteTpl.hp * statMult), rand),
        atk: applyStatVariance(Math.round(eliteTpl.atk * statMult), rand),
        spd: eliteTpl.spd,
        element: eliteTpl.element,
        role: "elite",
        skills: [...eliteTpl.skills],
      };
      const waves = dungeonWaves(d);
      const eliteIdx = waves.findIndex((w) => (w.enemies || []).some((e) => e.role === "elite"));
      if (eliteIdx >= 0) {
        waves[eliteIdx] = { label: eliteTpl.waveLabel, enemies: [eliteEnemy] };
        d.waves = waves;
      }
      d.dailyVariantLabel = eliteTpl.name;
    }
  }

  d.dailySeed = seed;
  const challenge = pickDailyChallenge(dateKey, dungeonId);
  d.challenge = challenge;
  return d;
}

/** 試煉：5 層以上公式延伸 */
export function dungeonTrialFor(dungeonId) {
  if (DUNGEON_TRIALS[dungeonId]) return DUNGEON_TRIALS[dungeonId];
  const tier = parseDungeonTier(dungeonId);
  if (tier <= 4) return null;
  const extra = tier - 4;
  const needGen = Math.min(3, 2 + Math.floor((extra + 1) / 2));
  return {
    id: `trial_${dungeonId}`,
    label: `試煉：雜交種且 ≥${needGen} 代`,
    needHybrid: true,
    needGen,
    match: "all",
    bonus: { stones: 70 + extra * 25, scrap: 2 + Math.floor(extra / 2) },
  };
}

/** 兼容：扁平敵人列表（舊資料／測試）→ 單波 */
export function dungeonWaves(dungeon) {
  if (!dungeon) return [];
  if (Array.isArray(dungeon.waves) && dungeon.waves.length) return dungeon.waves;
  if (Array.isArray(dungeon.enemies) && dungeon.enemies.length) {
    return [{ label: dungeon.name || "交戰", enemies: dungeon.enemies }];
  }
  return [];
}

export function roleLabel(role) {
  if (role === "boss") return "BOSS";
  if (role === "elite") return "精英";
  return "普通";
}

export function countDungeonRoles(waves) {
  let normal = 0;
  let elite = 0;
  let boss = 0;
  let total = 0;
  for (const w of waves || []) {
    for (const e of w.enemies || []) {
      total += 1;
      const r = e.role || "normal";
      if (r === "boss") boss += 1;
      else if (r === "elite") elite += 1;
      else normal += 1;
    }
  }
  return { total, normal, elite, boss, waves: (waves || []).length };
}

/**
 * 評估關卡條件（挑戰獎）與被動說明
 * pets = 出戰靈寵
 */
export function evaluateDungeonConditions(pets, dungeon) {
  const list = Array.isArray(pets) ? pets : [];
  const out = [];
  for (const c of dungeon?.conditions || []) {
    let ok = false;
    let reason = "";
    if (c.type === "max_pets") {
      ok = list.length <= c.max;
      reason = ok ? "" : `出戰 ${list.length}／上限 ${c.max}`;
    } else if (c.type === "min_element") {
      const n = list.filter((p) => p.elementId === c.element).length;
      ok = n >= (c.count || 1);
      const elName = ELEMENTS[c.element]?.name || c.element;
      reason = ok ? "" : `需要${elName}屬≥${c.count || 1}（現 ${n}）`;
    } else if (c.type === "unique_species") {
      const ids = list.map((p) => p.speciesId);
      ok = ids.length === 0 || new Set(ids).size === ids.length;
      reason = ok ? "" : "出戰有重複種族";
    } else if (c.type === "min_hybrid") {
      const n = list.filter((p) => p.breedOnly || SPECIES[p.speciesId]?.breedOnly).length;
      ok = n >= (c.count || 1);
      reason = ok ? "" : `需要雜交種≥${c.count || 1}（現 ${n}）`;
    } else if (c.type === "min_gen") {
      const maxG = list.reduce((m, p) => Math.max(m, petGeneration(p)), 0);
      ok = maxG >= (c.gen || 1);
      reason = ok ? "" : `需要≥${c.gen}代（最高 ${maxG}）`;
    } else {
      ok = false;
      reason = "未知條件";
    }
    out.push({
      id: c.id,
      label: c.label,
      type: c.type,
      bonus: c.bonus || {},
      ok,
      reason,
      passive: false,
    });
  }
  for (const p of dungeon?.passives || []) {
    out.push({
      id: p.id,
      label: p.label,
      type: p.type,
      ok: true,
      reason: "",
      passive: true,
      element: p.element,
      mult: p.mult,
    });
  }
  return out;
}

/** 關卡被動：元素攻擊倍率（乘在友方對應元素上） */
export function dungeonElemAtkMult(passives, elementId) {
  let m = 1;
  for (const p of passives || []) {
    if (p.type === "elem_atk" && p.element === elementId) m *= p.mult || 1;
  }
  return m;
}

export const EVENTS = [
  "潮霧散開，一枚靈紋貝落在腳邊。",
  "靈寵低鳴，像在教你一段無人記得的咒。",
  "遠處潮聲忽然停歇——有靈在聽你。",
  "廢墟縫隙飄出螢光鱗粉，沾上袖口不散。",
  "你於靜室中見靈寵倒影多出一雙眼睛，然後消失。",
];

export function skillInfo(id) {
  return SKILLS[id] || null;
}

export function masterSkillsForStage(stageId) {
  return MASTER_SKILL_UNLOCKS.filter((u) => u.stage <= stageId).map((u) => u.skillId);
}

export function buildPetStats(template) {
  const sp = SPECIES[template.species];
  const el = ELEMENTS[template.element];
  const pe = PERSONALITIES[template.personality];
  if (!sp || !el || !pe) throw new Error("invalid pet template");
  const pe2 =
    template.personality2 && template.personality2 !== template.personality
      ? PERSONALITIES[template.personality2]
      : null;
  const rarity = Math.max(0, Math.min(RARITY_MAX, template.rarity ?? 0));
  const rMult = rarityInfo(rarity).mult;
  const skillId = KIND_SKILLS[sp.kind];
  const bloodmarks = normalizeBloodmarks(template.bloodmarks);
  const bm = bloodmarkCombatMult(bloodmarks);
  // 主性格 75% + 副性格 25% 影響白板
  const peAtk = pe2 ? pe.atk * 0.75 + pe2.atk * 0.25 : pe.atk;
  const peHp = pe2 ? pe.hp * 0.75 + pe2.hp * 0.25 : pe.hp;
  const peSpd = pe2 ? pe.spd * 0.75 + pe2.spd * 0.25 : pe.spd;
  const atk = Math.round(sp.base.atk * el.atk * peAtk * rMult * bm.atk);
  const hp = Math.round(sp.base.hp * el.hp * peHp * rMult * bm.hp);
  const spd = Math.round(sp.base.spd * el.spd * peSpd * rMult * bm.spd);
  return {
    templateId: template.id,
    speciesId: sp.id,
    speciesName: sp.name,
    kind: sp.kind,
    breedOnly: !!sp.breedOnly,
    elementId: el.id,
    elementName: el.name,
    personalityId: pe.id,
    personalityName: pe.name,
    personality2Id: pe2?.id || null,
    personality2Name: pe2?.name || null,
    bloodmarks,
    bloodlineName: bloodlineLabel(bloodmarks),
    name: `${el.name}${sp.name}`,
    atk,
    hp,
    spd,
    cost: template.cost,
    skillId,
    skillName: SKILLS[skillId]?.name || skillId,
    level: 1,
    fusionLevel: 0,
    rarity,
    rarityName: rarityInfo(rarity).name,
    genes: {
      species: sp.id,
      element: el.id,
      personality: pe.id,
      personality2: pe2?.id || null,
    },
  };
}

/** 開局贈送首寵（潮屬礁狐）— 亦可由蛋孵化產出 */
export function makeStarterPet() {
  const built = buildPetStats({
    id: "starter-reefox-tide",
    species: "reefox",
    element: "tide",
    personality: "sly",
    cost: 0,
    rarity: 0,
    bloodmarks: [],
  });
  return {
    ...built,
    uid: "starter-reefox",
    fromStarter: true,
  };
}

/* ─── 寵物蛋：多 tier 孵化 ─── */

/**
 * C 常見／教學｜B 日常｜A 稀有
 * hatchMs：實時毫秒（離線照計）
 */
export const EGG_TIERS = {
  C: {
    id: "C",
    name: "潮霧蛋",
    hatchMs: 120_000,
    shopCost: 40,
    label: "常見",
    desc: "約 2 分鐘孵化 · 野生種",
  },
  B: {
    id: "B",
    name: "暗潮蛋",
    hatchMs: 480_000,
    shopCost: 90,
    label: "優秀",
    desc: "約 8 分鐘孵化 · 較佳成長",
  },
  A: {
    id: "A",
    name: "心核蛋",
    hatchMs: 1_800_000,
    shopCost: 180,
    label: "稀有",
    desc: "約 30 分鐘孵化 · 高潛力",
  },
};

export function eggTierInfo(tier) {
  return EGG_TIERS[tier] || EGG_TIERS.C;
}

/** 生成一顆蛋（未開始孵化） */
export function makeEgg(tier = "C", source = "unknown", now = Date.now()) {
  const t = eggTierInfo(tier);
  const uid = `egg-${t.id}-${now}-${Math.floor(Math.random() * 9999)}`;
  return {
    uid,
    tier: t.id,
    name: t.name,
    source,
    startedAt: null,
    readyAt: null,
    claimed: false,
  };
}

/** 開局／教學蛋孵化時間（短於一般 C 蛋，避免空等） */
export const STARTER_EGG_HATCH_MS = 20_000;
export const TUTORIAL_EGG_HATCH_MS = STARTER_EGG_HATCH_MS;

/** 開局教學蛋（已開始倒數，方便立即看到進度） */
export function makeStarterEgg(now = Date.now()) {
  const egg = makeEgg("C", "starter", now);
  egg.startedAt = now;
  egg.readyAt = now + STARTER_EGG_HATCH_MS;
  egg.uid = "egg-starter-c";
  egg.desc = "約 20 秒孵化 · 教學用";
  return egg;
}

/** 孵化產出寵物（C 普通／B 略強／A 再強） */
export function hatchPetFromEgg(egg, opts = {}) {
  const tier = egg?.tier || "C";
  const isStarter = egg?.source === "starter" || opts.starter;
  if (isStarter) {
    const pet = makeStarterPet();
    pet.fromEgg = egg?.uid || true;
    return pet;
  }
  const wildIds = wildSpeciesIds(opts.realm || 0);
  const species = opts.species || wildIds[Math.floor(Math.random() * wildIds.length)] || "reefox";
  const elements = Object.keys(ELEMENTS);
  const element = opts.element || elements[Math.floor(Math.random() * elements.length)] || "tide";
  const personalities = Object.keys(PERSONALITIES);
  const personality =
    opts.personality || personalities[Math.floor(Math.random() * personalities.length)] || "sly";
  let rarity = 0;
  const fromAbyss = egg?.source === "abyss_dive" || opts.abyssEgg;
  if (fromAbyss) {
    // 高階蛋：權重偏向稀有／血紋
    rarity = Math.random() < 0.5 ? 2 : Math.random() < 0.7 ? 1 : 0;
  } else if (tier === "B" && Math.random() < 0.35) rarity = 1;
  else if (tier === "A") rarity = Math.random() < 0.55 ? 1 : Math.random() < 0.25 ? 2 : 0;
  const built = buildPetStats({
    id: `hatch-${egg?.uid || Date.now()}`,
    species,
    element,
    personality,
    cost: 0,
    rarity,
    bloodmarks:
      (fromAbyss && Math.random() < 0.55) || (tier === "A" && Math.random() < 0.4)
        ? [BLOODLINE_MARK_IDS[0]]
        : [],
  });
  const bonus = fromAbyss
    ? { atk: 4, hp: 10, spd: 1 }
    : tier === "A"
      ? { atk: 3, hp: 8, spd: 1 }
      : tier === "B"
        ? { atk: 1, hp: 4, spd: 0 }
        : { atk: 0, hp: 0, spd: 0 };
  return {
    ...built,
    uid: `hatch-${egg?.uid || Date.now()}`,
    atk: built.atk + bonus.atk,
    hp: built.hp + bonus.hp,
    spd: built.spd + bonus.spd,
    fromEgg: egg?.uid || true,
    eggTier: tier,
  };
}

export function petLabel(pet) {
  const r = rarityInfo(pet.rarity ?? 0).name;
  const pe2 = pet.personality2Name ? `/${pet.personality2Name}` : "";
  const blood = pet.bloodlineName && pet.bloodlineName !== "無紋" ? `·${pet.bloodlineName}` : "";
  return `${pet.name}（${r}·${pet.kind}·${pet.elementName}·${pet.personalityName}${pe2}${blood}）`;
}

/* ─── P1：牧場掛機產物 ─── */

/** 性格 → 每秒飼料／靈塵／潮霧令產量（牧場待命；再乘 RANCH_IDLE_GLOBAL_MULT） */
export const IDLE_BY_PERSONALITY = Object.fromEntries(
  Object.values(PERSONALITIES).map((p) => [
    p.id,
    {
      feed: 0.06 * (p.workFeed ?? 1),
      dust: 0.025 * (p.workDust ?? 1),
      token: 0.004 * (p.workToken ?? 1),
    },
  ])
);

/** 元素對掛機倍率 */
export const IDLE_BY_ELEMENT = {
  tide: { feed: 1.1, dust: 1.0 },
  stone: { feed: 1.15, dust: 0.95 },
  flame: { feed: 0.9, dust: 1.15 },
  gale: { feed: 1.0, dust: 1.1 },
  gloom: { feed: 0.95, dust: 1.12 },
};

/** 飼料契約：消耗飼料換取成功率加成 */
export const BOND_FEED_COST = 8;
export const BOND_FEED_BONUS = 0.18;

/** 用飼料升級（可替代靈石） */
export function upgradeFeedCost(level) {
  const lv = Math.max(1, level | 0);
  return 6 + lv * 5 + Math.floor(lv * lv * 0.5);
}

/* ─── P1：技能升級／第二技能 ─── */

export const SKILL_MAX_LEVEL = 5;

/** 靈塵升級技能消耗 */
export function skillDustCost(skillLevel) {
  const lv = Math.max(1, skillLevel | 0);
  return 4 + lv * 6;
}

/** 技能威力隨等級：每級 +8% */
export function skillPowerMult(skillLevel) {
  const lv = Math.max(1, Math.min(SKILL_MAX_LEVEL, skillLevel | 0));
  return 1 + (lv - 1) * 0.08;
}

/**
 * 第二技能（融階≥1 或 Lv≥15 解鎖）
 * 豐富自動戰報
 */
export const KIND_SECOND_SKILLS = {
  獸: "pack_howl",
  鱗: "tidal_veil",
  禽: "sky_pierce",
  甲: "bulwark_pulse",
  蟲: "swarm_haze",
  光: "prism_burst",
};

export const SECOND_SKILL_UNLOCK = { fusionLevel: 1, level: 15 };

export function petSkillIds(pet) {
  const ids = [];
  if (pet.skillId) ids.push(pet.skillId);
  const unlocked =
    (pet.fusionLevel ?? 0) >= SECOND_SKILL_UNLOCK.fusionLevel ||
    (pet.level ?? 1) >= SECOND_SKILL_UNLOCK.level;
  if (unlocked) {
    const hybridId = HYBRID_SKILLS[pet.speciesId];
    const second = hybridId || KIND_SECOND_SKILLS[pet.kind];
    if (second) ids.push(second);
  }
  return ids;
}

/* ─── 裝備：僅人物；寵物不穿戴 ─── */

/** 人物裝備槽 */
export const MASTER_EQUIP_SLOTS = ["weapon", "armor", "accessory"];

export const SLOT_LABEL = {
  weapon: "武器",
  armor: "防具",
  accessory: "飾品",
};

/**
 * 人物裝備表（寵物不可穿）
 * slot: weapon | armor | accessory
 */
export const GEAR = {
  tide_blade: {
    id: "tide_blade",
    name: "潮紋短刃",
    slot: "weapon",
    atk: 8,
    hp: 0,
    spd: 2,
    rarity: 1,
  },
  reef_cleaver: {
    id: "reef_cleaver",
    name: "暗礁劈斧",
    slot: "weapon",
    atk: 14,
    hp: 6,
    spd: 0,
    rarity: 2,
  },
  core_fang: {
    id: "core_fang",
    name: "心核牙刃",
    slot: "weapon",
    atk: 22,
    hp: 10,
    spd: 3,
    rarity: 3,
  },
  moss_vest: {
    id: "moss_vest",
    name: "苔紋背心",
    slot: "armor",
    atk: 0,
    hp: 35,
    spd: 0,
    rarity: 1,
  },
  tide_mail: {
    id: "tide_mail",
    name: "潮鱗甲",
    slot: "armor",
    atk: 2,
    hp: 55,
    spd: 1,
    rarity: 2,
  },
  abyss_plate: {
    id: "abyss_plate",
    name: "深淵板甲",
    slot: "armor",
    atk: 4,
    hp: 85,
    spd: 0,
    rarity: 3,
  },
  mist_charm: {
    id: "mist_charm",
    name: "潮霧墜",
    slot: "accessory",
    atk: 3,
    hp: 12,
    spd: 2,
    rarity: 1,
  },
  reef_ring: {
    id: "reef_ring",
    name: "暗礁戒",
    slot: "accessory",
    atk: 5,
    hp: 18,
    spd: 3,
    rarity: 2,
  },
  gloom_sigil: {
    id: "gloom_sigil",
    name: "幽印符",
    slot: "accessory",
    atk: 8,
    hp: 22,
    spd: 4,
    rarity: 3,
    setId: "abyss",
  },
};

/** 為舊裝補 setId（潮／礁／淵三套） */
GEAR.tide_blade.setId = "tide";
GEAR.moss_vest.setId = "tide";
GEAR.mist_charm.setId = "tide";
GEAR.reef_cleaver.setId = "reef";
GEAR.tide_mail.setId = "reef";
GEAR.reef_ring.setId = "reef";
GEAR.core_fang.setId = "abyss";
GEAR.abyss_plate.setId = "abyss";

/**
 * 人物裝備套裝：同 set 穿 2／3 件觸發
 */
export const GEAR_SETS = {
  tide: {
    id: "tide",
    name: "潮紋",
    pieces: ["tide_blade", "moss_vest", "mist_charm"],
    bonus2: { atk: 3, hp: 12, label: "潮紋·雙件（攻+3 血+12）" },
    bonus3: { atk: 6, hp: 28, spd: 2, label: "潮紋·三件（攻血速↑）" },
  },
  reef: {
    id: "reef",
    name: "暗礁",
    pieces: ["reef_cleaver", "tide_mail", "reef_ring"],
    bonus2: { atk: 5, hp: 18, label: "暗礁·雙件（攻+5 血+18）" },
    bonus3: { atk: 10, hp: 40, spd: 3, label: "暗礁·三件（攻血速↑）" },
  },
  abyss: {
    id: "abyss",
    name: "深淵",
    pieces: ["core_fang", "abyss_plate", "gloom_sigil"],
    bonus2: { atk: 8, hp: 25, label: "深淵·雙件（攻+8 血+25）" },
    bonus3: { atk: 14, hp: 55, spd: 4, label: "深淵·三件（攻血速↑）" },
  },
};

/** 依已裝備 gearId 列表計算套裝加成 */
export function gearSetBonus(gearIds) {
  const ids = (gearIds || []).filter(Boolean);
  const bySet = {};
  for (const id of ids) {
    const g = GEAR[id];
    if (!g?.setId) continue;
    bySet[g.setId] = (bySet[g.setId] || 0) + 1;
  }
  let atk = 0;
  let hp = 0;
  let spd = 0;
  const labels = [];
  for (const [setId, n] of Object.entries(bySet)) {
    const set = GEAR_SETS[setId];
    if (!set) continue;
    if (n >= 3 && set.bonus3) {
      atk += set.bonus3.atk || 0;
      hp += set.bonus3.hp || 0;
      spd += set.bonus3.spd || 0;
      labels.push(set.bonus3.label);
    } else if (n >= 2 && set.bonus2) {
      atk += set.bonus2.atk || 0;
      hp += set.bonus2.hp || 0;
      spd += set.bonus2.spd || 0;
      labels.push(set.bonus2.label);
    }
  }
  return { atk, hp, spd, labels };
}

/* ─── P9：牧場派遣 ─── */

export const DISPATCH_MISSIONS = [
  {
    id: "forage",
    name: "潮灘覓食",
    durationMs: 90_000,
    needPets: 1,
    needSite: null,
    reward: { feed: 10, stones: 12, materials: { tide_dew: 2 } },
    eggChance: { tier: "C", rate: 0.12 },
    desc: "1 寵 · 約 1.5 分 → 飼料／潮露 · 低機率潮霧蛋",
  },
  {
    id: "egg_shore",
    name: "潮岸拾蛋",
    durationMs: 180_000,
    needPets: 1,
    needSite: null,
    reward: { stones: 8, feed: 4, materials: { tide_dew: 1 } },
    eggChance: { tier: "C", rate: 0.55 },
    desc: "1 寵 · 約 3 分 → 高機率潮霧蛋",
  },
  {
    id: "dust_hunt",
    name: "靈塵拾遺",
    durationMs: 150_000,
    needPets: 1,
    needSite: "ruins",
    reward: { dust: 12, stones: 10, materials: { coral_shard: 3 } },
    eggChance: { tier: "C", rate: 0.18 },
    desc: "1 寵 · 需廢墟影堂 · 靈塵／珊瑚屑 · 偶得蛋",
  },
  {
    id: "egg_ruins",
    name: "廢墟巢穴",
    durationMs: 240_000,
    needPets: 1,
    needSite: "ruins",
    reward: { stones: 14, dust: 4, materials: { coral_shard: 2 } },
    eggChance: { tier: "B", rate: 0.35 },
    desc: "1 寵 · 需廢墟影堂 · 機率暗潮蛋",
  },
  {
    id: "scrap_dive",
    name: "廢墟打撈",
    durationMs: 240_000,
    needPets: 2,
    needSite: "deep",
    reward: { scrap: 2, stones: 25, feed: 4, materials: { mist_silk: 2 } },
    eggChance: { tier: "B", rate: 0.15 },
    desc: "2 寵 · 需深層祭壇 · 霧絲",
  },
  {
    id: "egg_deep",
    name: "深層孵巢",
    durationMs: 300_000,
    needPets: 2,
    needSite: "deep",
    reward: { stones: 20, materials: { mist_silk: 1 } },
    eggChance: { tier: "B", rate: 0.45 },
    desc: "2 寵 · 需深層祭壇 · 高機率暗潮蛋",
  },
  {
    id: "resin_gather",
    name: "霧帷採脂",
    durationMs: 210_000,
    needPets: 1,
    needSite: "mistveil",
    reward: { dust: 6, stones: 18, materials: { echo_resin: 3 } },
    eggChance: { tier: "B", rate: 0.12 },
    desc: "1 寵 · 需霧帷練台 · 靈響脂",
  },
  {
    id: "ink_scout",
    name: "墨潮探查",
    durationMs: 300_000,
    needPets: 2,
    needSite: "core",
    reward: { dust: 8, stones: 30, materials: { abyss_ink: 3 } },
    eggChance: { tier: "B", rate: 0.2 },
    desc: "2 寵 · 需心核道場 · 深淵墨",
  },
  {
    id: "sand_haul",
    name: "融砂搬運",
    durationMs: 270_000,
    needPets: 2,
    needSite: "fusehall",
    reward: { stones: 28, feed: 3, materials: { fuse_sand: 3 } },
    eggChance: { tier: "B", rate: 0.14 },
    desc: "2 寵 · 需融砂坊 · 融砂",
  },
  {
    id: "ember_rite",
    name: "契火祭巡",
    durationMs: 360_000,
    needPets: 2,
    needSite: "abyss",
    reward: { stones: 40, materials: { seal_ember: 3 } },
    eggChance: { tier: "A", rate: 0.1 },
    desc: "2 寵 · 需暗潮心壇 · 契火 · 低機率心核蛋",
  },
  {
    id: "egg_abyss",
    name: "心核拾遺",
    durationMs: 420_000,
    needPets: 2,
    needSite: "abyss",
    reward: { stones: 35, dust: 6, materials: { seal_ember: 1 } },
    eggChance: { tier: "A", rate: 0.28 },
    desc: "2 寵 · 需暗潮心壇 · 機率心核蛋",
  },
];

export const DISPATCH_SLOT_MAX = 3;

/* ─── P9：潮印 soft prestige ─── */

/** 潮印永久加成：每枚全隊攻／血 +2%，上限 12 */
export const TIDE_SEAL_MAX = 12;
export const TIDE_SEAL_MIN_REALM = 5;

export function tideSealCombatMult(seals) {
  const n = Math.max(0, Math.min(TIDE_SEAL_MAX, seals | 0));
  return 1 + n * 0.02;
}

export function tideSealGainForRealm(realm) {
  const r = realm | 0;
  if (r < TIDE_SEAL_MIN_REALM) return 0;
  return 1 + Math.floor((r - TIDE_SEAL_MIN_REALM) / 2);
}

/** 秘境掉落（僅人物裝） */
export const DUNGEON_GEAR_DROPS = {
  tide_1: {
    chance: 0.38,
    weights: { tide_blade: 3, moss_vest: 3, mist_charm: 3, reef_cleaver: 1 },
  },
  tide_2: {
    chance: 0.48,
    weights: {
      reef_cleaver: 3,
      tide_mail: 3,
      reef_ring: 3,
      mist_charm: 2,
      moss_vest: 1,
    },
  },
  tide_3: {
    chance: 0.58,
    weights: {
      core_fang: 2,
      abyss_plate: 2,
      gloom_sigil: 3,
      reef_cleaver: 2,
      tide_mail: 2,
      reef_ring: 2,
    },
  },
  tide_4: {
    chance: 0.72,
    weights: {
      core_fang: 4,
      abyss_plate: 4,
      gloom_sigil: 4,
      reef_cleaver: 2,
      tide_mail: 2,
      reef_ring: 2,
    },
  },
};

export function rollGearDrop(dungeonId, opts = {}) {
  /* 人物裝備已移除：改掉落寵用素材 */
  return null;
}

/** 秘境勝利掉落：只出專屬催化（bulk／入場令永不進秘境池） */
export const DUNGEON_MAT_DROPS = {
  tide_1: {
    chance: 0.36,
    weights: { temper_oil: 5 },
  },
  tide_2: {
    chance: 0.4,
    weights: { temper_oil: 2, blood_catalyst: 4 },
  },
  tide_3: {
    chance: 0.44,
    weights: { blood_catalyst: 3, breed_ticket: 3 },
  },
  tide_4: {
    chance: 0.48,
    weights: { breed_ticket: 3, temper_oil: 2, blood_catalyst: 3 },
  },
};

export function rollDungeonMatDrop(dungeonId, opts = {}) {
  const table = DUNGEON_MAT_DROPS[dungeonId] || DUNGEON_MAT_DROPS.tide_1;
  if (!table) return null;
  let chance = table.chance || 0;
  if (opts.bossCleared) chance = Math.min(0.95, chance + 0.18);
  else if (opts.eliteCleared) chance = Math.min(0.9, chance + 0.1);
  if (opts.conditionHits > 0) {
    chance = Math.min(0.95, chance + 0.03 * opts.conditionHits);
  }
  if (Math.random() > chance) return null;
  const matId = pickWeighted(table.weights);
  if (!matId || !MATERIALS[matId]) return null;
  return { matId, amount: 1 };
}

export function gearBonuses(gearIds) {
  let atk = 0;
  let hp = 0;
  let spd = 0;
  for (const id of gearIds || []) {
    const g = GEAR[id];
    if (!g) continue;
    atk += g.atk || 0;
    hp += g.hp || 0;
    spd += g.spd || 0;
  }
  return { atk, hp, spd };
}

/**
 * 種族×元素×性格的天生基準（寵物成長以此為根）
 */
export function petSpeciesBaseline(speciesId, elementId, personalityId) {
  const sp = SPECIES[speciesId];
  const el = ELEMENTS[elementId];
  const pe = PERSONALITIES[personalityId];
  if (!sp || !el || !pe) return { atk: 0, hp: 0, spd: 0 };
  return {
    atk: Math.round(sp.base.atk * el.atk * pe.atk),
    hp: Math.round(sp.base.hp * el.hp * pe.hp),
    spd: Math.round(sp.base.spd * el.spd * pe.spd),
  };
}

/**
 * 繁殖：子代繼承雙親「超出基準」的天生成長（攻／血／速）
 * 約 40% 平均溢出；再加小幅變異
 */
export const BREED_INHERIT_RATE = 0.4;
export const BREED_MUTATION_STAT_RATE = 0.12;

export function breedStatInheritance(parentA, parentB, childGenes) {
  const baseA = petSpeciesBaseline(parentA.speciesId, parentA.elementId, parentA.personalityId);
  const baseB = petSpeciesBaseline(parentB.speciesId, parentB.elementId, parentB.personalityId);
  const excess = (p, base) => ({
    atk: Math.max(0, (p.atk || 0) - base.atk),
    hp: Math.max(0, (p.hp || 0) - base.hp),
    spd: Math.max(0, (p.spd || 0) - base.spd),
  });
  const ea = excess(parentA, baseA);
  const eb = excess(parentB, baseB);
  const avg = {
    atk: (ea.atk + eb.atk) / 2,
    hp: (ea.hp + eb.hp) / 2,
    spd: (ea.spd + eb.spd) / 2,
  };
  let atk = Math.floor(avg.atk * BREED_INHERIT_RATE);
  let hp = Math.floor(avg.hp * BREED_INHERIT_RATE);
  let spd = Math.floor(avg.spd * BREED_INHERIT_RATE);
  // 稀有度額外天生強化
  const r = childGenes?.rarity ?? 0;
  const gen = childGenes?.generation ?? 1;
  const genMul = 1 + Math.max(0, gen) * 0.08;
  atk = Math.floor(atk * genMul);
  hp = Math.floor(hp * genMul);
  spd = Math.floor(spd * genMul);
  if (r >= 1) {
    atk += r * 2;
    hp += r * 5;
    spd += Math.floor(r * 0.8);
  }
  if (childGenes?.hybrid) {
    atk += 2;
    hp += 4;
    spd += 1;
  }
  if (Math.random() < BREED_MUTATION_STAT_RATE + r * 0.04 + gen * 0.03) {
    atk += 1 + Math.floor(Math.random() * (2 + r + Math.floor(gen / 2)));
    hp += 2 + Math.floor(Math.random() * (5 + r * 2 + gen));
    spd += Math.floor(Math.random() * (2 + r));
  }
  return { atk, hp, spd };
}

/** UI 預覽：天生繼承（不含隨機突變 roll） */
export function breedStatInheritancePreview(parentA, parentB, childGenes) {
  const baseA = petSpeciesBaseline(parentA.speciesId, parentA.elementId, parentA.personalityId);
  const baseB = petSpeciesBaseline(parentB.speciesId, parentB.elementId, parentB.personalityId);
  const excess = (p, base) => ({
    atk: Math.max(0, (p.atk || 0) - base.atk),
    hp: Math.max(0, (p.hp || 0) - base.hp),
    spd: Math.max(0, (p.spd || 0) - base.spd),
  });
  const ea = excess(parentA, baseA);
  const eb = excess(parentB, baseB);
  const avg = {
    atk: (ea.atk + eb.atk) / 2,
    hp: (ea.hp + eb.hp) / 2,
    spd: (ea.spd + eb.spd) / 2,
  };
  let atk = Math.floor(avg.atk * BREED_INHERIT_RATE);
  let hp = Math.floor(avg.hp * BREED_INHERIT_RATE);
  let spd = Math.floor(avg.spd * BREED_INHERIT_RATE);
  const r = childGenes?.rarity ?? 0;
  const gen = childGenes?.generation ?? 1;
  const genMul = 1 + Math.max(0, gen) * 0.08;
  atk = Math.floor(atk * genMul);
  hp = Math.floor(hp * genMul);
  spd = Math.floor(spd * genMul);
  if (r >= 1) {
    atk += r * 2;
    hp += r * 5;
    spd += Math.floor(r * 0.8);
  }
  if (childGenes?.hybrid) {
    atk += 2;
    hp += 4;
    spd += 1;
  }
  return { atk, hp, spd };
}

/** 融合吸收素材天生數值比例（隨融階升高） */
export function fusionAbsorbRate(targetStage) {
  const n = Math.max(1, Math.min(3, targetStage | 0));
  return 0.18 + n * 0.1; // 階1 28%、階2 38%、階3 48%
}

/**
 * 性格戰鬥被動（每寵獨立套用；唔改白板成長公式）
 * 戰鬥向加打減續航；工作向加工減打；祥瑞只加不減
 */
export const PERSONALITY_COMBAT = {
  fierce: { id: "fierce", label: "烈性：攻擊 +10%，血量 −4%", atkMult: 1.1, hpMult: 0.96, spdMult: 1 },
  steady: { id: "steady", label: "沉穩：血量 +12%，速度 −5%", atkMult: 1, hpMult: 1.12, spdMult: 0.95 },
  sly: { id: "sly", label: "狡黠：速度 +10%，攻擊 +4%", atkMult: 1.04, hpMult: 1, spdMult: 1.1 },
  gentle: {
    id: "gentle",
    label: "溫馴：血量 +6%，受治療／減傷技優先感（續航親和）",
    atkMult: 0.97,
    hpMult: 1.06,
    spdMult: 1,
    sustainBias: true,
  },
  wild: { id: "wild", label: "狂放：攻擊 +12%，血量 −8%", atkMult: 1.12, hpMult: 0.92, spdMult: 1.04 },
  brutal: { id: "brutal", label: "殘暴：攻擊 +14%，血量 −6%", atkMult: 1.14, hpMult: 0.94, spdMult: 1 },
  bloodthirst: {
    id: "bloodthirst",
    label: "嗜血：攻擊 +12%，血量 −10%，速度 +6%",
    atkMult: 1.12,
    hpMult: 0.9,
    spdMult: 1.06,
  },
  arrogant: { id: "arrogant", label: "傲慢：攻擊 +8%，速度 −4%", atkMult: 1.08, hpMult: 1, spdMult: 0.96 },
  restless: {
    id: "restless",
    label: "躁動：速度 +14%，血量 −5%",
    atkMult: 1.03,
    hpMult: 0.95,
    spdMult: 1.14,
  },
  vengeful: { id: "vengeful", label: "執念：攻擊 +9%，血量 −3%", atkMult: 1.09, hpMult: 0.97, spdMult: 1.01 },
  cunning: {
    id: "cunning",
    label: "陰鷙：攻擊 +7%，速度 +10%，血量 −5%",
    atkMult: 1.07,
    hpMult: 0.95,
    spdMult: 1.1,
  },
  diligent: { id: "diligent", label: "勤懇：攻擊 −6%，血量 +4%", atkMult: 0.94, hpMult: 1.04, spdMult: 0.98 },
  nurturing: {
    id: "nurturing",
    label: "慈育：攻擊 −8%，血量 +8%（續航親和）",
    atkMult: 0.92,
    hpMult: 1.08,
    spdMult: 0.96,
    sustainBias: true,
  },
  patient: {
    id: "patient",
    label: "忍耐：血量 +10%，速度 −8%（續航親和）",
    atkMult: 0.96,
    hpMult: 1.1,
    spdMult: 0.92,
    sustainBias: true,
  },
  curious: { id: "curious", label: "好奇：速度 +4%，攻擊 −3%", atkMult: 0.97, hpMult: 0.99, spdMult: 1.04 },
  loyal: { id: "loyal", label: "忠勤：攻擊 −4%，血量 +6%", atkMult: 0.96, hpMult: 1.06, spdMult: 0.99 },
  blessed: { id: "blessed", label: "祥瑞：攻血速微升", atkMult: 1.03, hpMult: 1.03, spdMult: 1.02 },
  clever: { id: "clever", label: "機靈：速度 +6%，攻擊 +2%", atkMult: 1.02, hpMult: 1, spdMult: 1.06 },
  noble: { id: "noble", label: "高潔：攻血速微升", atkMult: 1.03, hpMult: 1.03, spdMult: 1.02 },
  serene: {
    id: "serene",
    label: "澄明：血量 +5%，速度 +2%（續航親和）",
    atkMult: 1,
    hpMult: 1.05,
    spdMult: 1.02,
    sustainBias: true,
  },
};

export function personalityCombatFor(personalityId) {
  return PERSONALITY_COMBAT[personalityId] || null;
}

/** 主 70% + 副 30% 混合性格戰鬥倍率 */
export function personalityCombatForPet(pet) {
  const a = personalityCombatFor(pet?.personalityId);
  const b = personalityCombatFor(pet?.personality2Id);
  if (!a && !b) return null;
  if (!b) return a;
  if (!a) return b;
  const blend = (x, y) => 1 + ((x || 1) - 1) * 0.7 + ((y || 1) - 1) * 0.3;
  return {
    id: `${a.id}+${b.id}`,
    label: `${a.label.split("：")[0]}/${b.label.split("：")[0]}`,
    atkMult: blend(a.atkMult, b.atkMult),
    hpMult: blend(a.hpMult, b.hpMult),
    spdMult: blend(a.spdMult, b.spdMult),
    sustainBias: !!(a.sustainBias || b.sustainBias),
  };
}

/* ─── P10：材料／練功地點／主線解鎖 ─── */

export const MATERIALS = {
  tide_dew: { id: "tide_dew", name: "潮露", desc: "寵物升級催化", tier: "bulk" },
  coral_shard: { id: "coral_shard", name: "珊瑚屑", desc: "繁殖必需", tier: "bulk" },
  mist_silk: { id: "mist_silk", name: "霧絲", desc: "高階升級", tier: "bulk" },
  abyss_ink: { id: "abyss_ink", name: "深淵墨", desc: "雜交／高代繁殖", tier: "bulk" },
  seal_ember: { id: "seal_ember", name: "契火", desc: "突破與進化", tier: "bulk" },
  echo_resin: { id: "echo_resin", name: "靈響脂", desc: "技能升級（練功專精）", tier: "bulk" },
  fuse_sand: { id: "fuse_sand", name: "融砂", desc: "融合催化（練功專精）", tier: "bulk" },
  temper_oil: {
    id: "temper_oil",
    name: "性格洗劑",
    desc: "秘境專屬：洗主性格",
    tier: "dungeon",
  },
  blood_catalyst: {
    id: "blood_catalyst",
    name: "血統催化",
    desc: "秘境專屬：繁殖冷卻縮短／加紋機率",
    tier: "dungeon",
  },
  breed_ticket: {
    id: "breed_ticket",
    name: "催生符",
    desc: "秘境專屬：立即重置繁殖冷卻",
    tier: "dungeon",
  },
  /** 入場憑證：練功／每日／升階產出；秘境永不掉落 */
  mist_token: {
    id: "mist_token",
    name: "潮霧令",
    desc: "已通關秘境入場／掃蕩消耗（唔用於潮淵）· 練功、每日、升階產出",
    tier: "gate",
  },
  /** 潮淵入場憑證：同潮霧令分開；練功／每日／撤退產出 */
  abyss_token: {
    id: "abyss_token",
    name: "淵潮令",
    desc: "潮淵深潛入場消耗（同秘境潮霧令分開）· 練功、每日、深潛撤退產出",
    tier: "abyss",
  },
  /** 潮鑰：秘境高機率掉落；挑戰／複打域主消耗（唔進 AFK） */
  tide_key_1: {
    id: "tide_key_1",
    name: "一層潮鑰",
    desc: "開啟／挑戰潮岸·廢墟域主 · 秘境一層高機率掉落",
    tier: "key",
  },
  tide_key_2: {
    id: "tide_key_2",
    name: "二層潮鑰",
    desc: "開啟／挑戰深層·霧帷域主 · 秘境二層高機率掉落",
    tier: "key",
  },
  tide_key_3: {
    id: "tide_key_3",
    name: "三層潮鑰",
    desc: "開啟／挑戰心核·融砂域主 · 秘境三層高機率掉落",
    tier: "key",
  },
  tide_key_4: {
    id: "tide_key_4",
    name: "四層潮鑰",
    desc: "開啟／挑戰暗潮域主 · 秘境四層高機率掉落",
    tier: "key",
  },
  warden_echo: {
    id: "warden_echo",
    name: "域主殘響",
    desc: "複打域主所得 · 可當進階催化碎片",
    tier: "key",
  },
  /** 潮淵深潛專屬：突變保險／外觀小加成／高階蛋 */
  abyss_grit: {
    id: "abyss_grit",
    name: "淵砂",
    desc: "潮淵深潛結算所得 · 喺「秘境→潮淵」頁下方兌換突變保險／外觀／高階蛋",
    tier: "abyss",
  },
};

export const MATERIAL_IDS = Object.keys(MATERIALS);

export function emptyMaterials() {
  return Object.fromEntries(MATERIAL_IDS.map((id) => [id, 0]));
}

/** 升級耗材料（隨等級） */
export function upgradeMatCost(level) {
  const lv = Math.max(1, level | 0);
  return {
    tide_dew: 1 + Math.floor(lv / 4),
    mist_silk: lv >= 10 ? 1 + Math.floor((lv - 10) / 8) : 0,
  };
}

/** 繁殖耗材料（代數愈高愈貴） */
export function breedMatCost(genA, genB) {
  const avg = (Math.max(0, genA | 0) + Math.max(0, genB | 0)) / 2;
  return {
    coral_shard: 1 + Math.floor(avg),
    abyss_ink: avg >= 1.5 ? 1 : 0,
  };
}

/** 技能升級額外材料（Lv≥2 起；練功專精） */
export function skillMatCost(skillLevel) {
  const lv = Math.max(1, skillLevel | 0);
  if (lv < 2) return {};
  return { echo_resin: 1 + Math.floor((lv - 2) / 2) };
}

/** 融合額外材料（練功專精） */
export function fusionMatCost(targetStage) {
  const st = Math.max(1, targetStage | 0);
  return { fuse_sand: st };
}

/**
 * 練功地點：首通秘境解鎖；每地專精一種 bulk（唔再愈深愈全能）
 * focus: UI 短標；primaryMat: 專精主產物；drops: perSec 期望產出／秒
 * 秘境專屬料（洗劑／催化／催生符）永不進 AFK
 * 入場令（潮霧令）只走練功／每日／升階，永不進秘境掉落
 */
export const TRAIN_FOCUS_BONUS = 1.35;
export const TRAIN_DAILY_SPOT_BONUS = 1.25;

export const TRAIN_SITES = [
  {
    id: "shore",
    name: "潮岸域",
    needClear: null,
    qiMult: 1,
    focus: "升級",
    primaryMat: "tide_dew",
    desc: "專精升級 · 潮露／飼料／潮霧令",
    drops: [
      { mat: "tide_dew", perSec: 0.034 },
      { mat: "mist_token", perSec: 0.0035 },
      { mat: "abyss_token", perSec: 0.0019 },
      { feed: 0.038 },
      { dust: 0.0085 },
    ],
  },
  {
    id: "ruins",
    name: "廢墟域",
    needClear: "tide_1",
    qiMult: 1.02,
    focus: "繁殖",
    primaryMat: "coral_shard",
    desc: "專精繁殖 · 珊瑚屑／潮霧令",
    drops: [
      { mat: "coral_shard", perSec: 0.031 },
      { mat: "mist_token", perSec: 0.0028 },
      { mat: "abyss_token", perSec: 0.0015 },
      { feed: 0.017 },
      { dust: 0.013 },
    ],
  },
  {
    id: "deep",
    name: "深層域",
    needClear: "tide_2",
    qiMult: 1.03,
    focus: "高階升級",
    primaryMat: "mist_silk",
    desc: "專精高階升級 · 霧絲／潮霧令",
    drops: [
      { mat: "mist_silk", perSec: 0.026 },
      { mat: "mist_token", perSec: 0.0032 },
      { mat: "abyss_token", perSec: 0.0018 },
      { feed: 0.019 },
      { dust: 0.01 },
    ],
  },
  {
    id: "mistveil",
    name: "霧帷域",
    needClear: "tide_2",
    qiMult: 1.025,
    focus: "技能",
    primaryMat: "echo_resin",
    desc: "專精技能 · 靈響脂／靈塵／潮霧令",
    drops: [
      { mat: "echo_resin", perSec: 0.017 },
      { mat: "mist_token", perSec: 0.0032 },
      { mat: "abyss_token", perSec: 0.0018 },
      { dust: 0.03 },
      { feed: 0.01 },
    ],
  },
  {
    id: "core",
    name: "心核域",
    needClear: "tide_3",
    qiMult: 1.04,
    focus: "雜交",
    primaryMat: "abyss_ink",
    desc: "專精雜交繁殖 · 深淵墨／潮霧令",
    drops: [
      { mat: "abyss_ink", perSec: 0.025 },
      { mat: "mist_token", perSec: 0.0035 },
      { mat: "abyss_token", perSec: 0.0019 },
      { dust: 0.015 },
    ],
  },
  {
    id: "fusehall",
    name: "融砂域",
    needClear: "tide_3",
    qiMult: 1.035,
    focus: "融合",
    primaryMat: "fuse_sand",
    desc: "專精融合 · 融砂／潮霧令",
    drops: [
      { mat: "fuse_sand", perSec: 0.016 },
      { mat: "mist_token", perSec: 0.0035 },
      { mat: "abyss_token", perSec: 0.0019 },
      { feed: 0.013 },
      { dust: 0.012 },
    ],
  },
  {
    id: "abyss",
    name: "暗潮域",
    needClear: "tide_4",
    qiMult: 1.06,
    focus: "突破",
    primaryMat: "seal_ember",
    desc: "專精突破 · 契火／潮霧令",
    drops: [
      { mat: "seal_ember", perSec: 0.015 },
      { mat: "mist_token", perSec: 0.0042 },
      { mat: "abyss_token", perSec: 0.0023 },
      { dust: 0.017 },
    ],
  },
];

/** 霧階數；深度倍率：霧階一～四／已通域主 */
export const TRAIN_TIER_COUNT = 4;
/** 一層霧階＝多波敵人；域主關波數更多 */
export const TRAIN_MIST_WAVE_COUNT = 5;
export const TRAIN_WARDEN_WAVE_COUNT = 7;
export const TRAIN_DEPTH_MULT = [1.0, 1.1, 1.2, 1.35, 1.5];

/**
 * 潮域鏈：prevZone 域主首通 → 解鎖本域
 * keyMatId／keyDungeonId：挑戰域主所需潮鑰（秘境高機率掉）
 * threatBase：霧階一掛機／推進基準威脅（隨階遞增）
 */
export const TRAIN_ZONE_CHAIN = [
  {
    id: "shore",
    prevZone: null,
    keyMatId: "tide_key_1",
    keyDungeonId: "tide_1",
    threatBase: 28,
    rematch: { stones: 10, materials: { tide_dew: 4, warden_echo: 1 } },
  },
  {
    id: "ruins",
    prevZone: "shore",
    keyMatId: "tide_key_1",
    keyDungeonId: "tide_1",
    threatBase: 42,
    rematch: { stones: 12, materials: { coral_shard: 4, warden_echo: 1 } },
  },
  {
    id: "deep",
    prevZone: "ruins",
    keyMatId: "tide_key_2",
    keyDungeonId: "tide_2",
    threatBase: 58,
    rematch: { stones: 14, materials: { mist_silk: 3, warden_echo: 1 } },
  },
  {
    id: "mistveil",
    prevZone: "deep",
    keyMatId: "tide_key_2",
    keyDungeonId: "tide_2",
    threatBase: 64,
    rematch: { stones: 14, materials: { echo_resin: 3, warden_echo: 1 } },
  },
  {
    id: "core",
    prevZone: "mistveil",
    keyMatId: "tide_key_3",
    keyDungeonId: "tide_3",
    threatBase: 82,
    rematch: { stones: 18, materials: { abyss_ink: 3, warden_echo: 1 } },
  },
  {
    id: "fusehall",
    prevZone: "core",
    keyMatId: "tide_key_3",
    keyDungeonId: "tide_3",
    threatBase: 88,
    rematch: { stones: 18, materials: { fuse_sand: 3, warden_echo: 1 } },
  },
  {
    id: "abyss",
    prevZone: "fusehall",
    keyMatId: "tide_key_4",
    keyDungeonId: "tide_4",
    threatBase: 110,
    rematch: { stones: 22, materials: { seal_ember: 3, warden_echo: 2 } },
  },
];

export function trainZoneMeta(zoneId) {
  return TRAIN_ZONE_CHAIN.find((z) => z.id === zoneId) || TRAIN_ZONE_CHAIN[0];
}

export function trainZoneOrderIndex(zoneId) {
  const i = TRAIN_ZONE_CHAIN.findIndex((z) => z.id === zoneId);
  return i < 0 ? 0 : i;
}

/** 霧階／域主威脅值 */
export function trainTierThreat(zoneId, tierIndex) {
  const meta = trainZoneMeta(zoneId);
  const base = meta.threatBase || 30;
  const t = Math.max(0, Math.min(TRAIN_TIER_COUNT, tierIndex | 0));
  return Math.round(base * (1 + t * 0.22));
}

export function trainWardenThreat(zoneId) {
  return trainTierThreat(zoneId, TRAIN_TIER_COUNT);
}

/** 秘境→潮鑰對照 */
export const DUNGEON_TIDE_KEY = {
  tide_1: "tide_key_1",
  tide_2: "tide_key_2",
  tide_3: "tide_key_3",
  tide_4: "tide_key_4",
};

/** 秘境勝利掉潮鑰基礎機率（非必然；首通另保底） */
export const TIDE_KEY_DROP_CHANCE = {
  tide_1: 0.72,
  tide_2: 0.68,
  tide_3: 0.64,
  tide_4: 0.6,
};

export function rollTideKeyDrop(dungeonId, opts = {}) {
  let keyId = DUNGEON_TIDE_KEY[dungeonId];
  if (!keyId) {
    const tier = Number(String(dungeonId || "").replace(/^tide_/, "")) || 0;
    if (tier >= 4) keyId = "tide_key_4";
    else if (tier === 3) keyId = "tide_key_3";
    else if (tier === 2) keyId = "tide_key_2";
    else if (tier === 1) keyId = "tide_key_1";
  }
  if (!keyId || !MATERIALS[keyId]) return null;
  if (opts.guaranteed) return { matId: keyId, amount: 1, guaranteed: true };
  const chanceBase =
    TIDE_KEY_DROP_CHANCE[dungeonId] ??
    TIDE_KEY_DROP_CHANCE[
      keyId === "tide_key_4"
        ? "tide_4"
        : keyId === "tide_key_3"
          ? "tide_3"
          : keyId === "tide_key_2"
            ? "tide_2"
            : "tide_1"
    ] ??
    0.65;
  let chance = chanceBase;
  if (opts.bossCleared) chance = Math.min(0.92, chance + 0.08);
  if (Math.random() > chance) return null;
  return { matId: keyId, amount: 1, guaranteed: false };
}

export function trainSiteById(id) {
  return TRAIN_SITES.find((s) => s.id === id) || TRAIN_SITES[0];
}

/** 練功地主產物（專精加成對象） */
export function trainSitePrimaryMat(site) {
  if (!site) return null;
  if (site.primaryMat) return site.primaryMat;
  return (site.drops || []).find((d) => d.mat)?.mat || null;
}

/** 每日輪換一個練功地全產出強化（穩定 seed） */
export function pickDailyTrainSpotlight(dateKey) {
  if (!TRAIN_SITES.length) return null;
  const idx = hashDayKey(`${dateKey || ""}:train-spot`) % TRAIN_SITES.length;
  return TRAIN_SITES[idx];
}

/** 單項 drop 的有效倍率（專精主產物 + 今日強化地） */
export function trainDropMult(site, drop, dateKey) {
  if (!site || !drop) return 1;
  let mult = 1;
  const primary = trainSitePrimaryMat(site);
  if (drop.mat && drop.mat === primary) mult *= TRAIN_FOCUS_BONUS;
  const spot = pickDailyTrainSpotlight(dateKey);
  if (spot?.id === site.id) mult *= TRAIN_DAILY_SPOT_BONUS;
  return mult;
}

/** UI：今日強化練功地 */
export function trainDailySpotlightView(dateKey = todayKey()) {
  const site = pickDailyTrainSpotlight(dateKey);
  if (!site) return null;
  return {
    siteId: site.id,
    siteName: site.name,
    focus: site.focus || "",
    bonusPct: Math.round((TRAIN_DAILY_SPOT_BONUS - 1) * 100),
    label: `今日強化【${site.name}】全產出 +${Math.round((TRAIN_DAILY_SPOT_BONUS - 1) * 100)}%`,
  };
}

/** UI：每地有效產率（含加成） */
export function trainSiteRatesView(site, dateKey = todayKey()) {
  const primary = trainSitePrimaryMat(site);
  const spot = pickDailyTrainSpotlight(dateKey);
  const isSpot = spot?.id === site.id;
  const lines = [];
  for (const drop of site.drops || []) {
    const mult = trainDropMult(site, drop, dateKey);
    if (drop.mat) {
      const name = MATERIALS[drop.mat]?.name || drop.mat;
      const perHr = ((drop.perSec || 0) * mult * 3600).toFixed(1);
      const tags = [];
      if (drop.mat === primary) tags.push(`專精+${Math.round((TRAIN_FOCUS_BONUS - 1) * 100)}%`);
      if (isSpot) tags.push(`今日+${Math.round((TRAIN_DAILY_SPOT_BONUS - 1) * 100)}%`);
      lines.push({
        kind: "mat",
        id: drop.mat,
        name,
        perHr,
        tag: tags.join(" · "),
      });
    } else if (drop.feed) {
      const perHr = ((drop.feed || 0) * mult * 3600).toFixed(0);
      lines.push({ kind: "feed", name: "飼料", perHr, tag: isSpot ? `今日+${Math.round((TRAIN_DAILY_SPOT_BONUS - 1) * 100)}%` : "" });
    } else if (drop.dust) {
      const perHr = ((drop.dust || 0) * mult * 3600).toFixed(0);
      lines.push({ kind: "dust", name: "靈塵", perHr, tag: isSpot ? `今日+${Math.round((TRAIN_DAILY_SPOT_BONUS - 1) * 100)}%` : "" });
    }
  }
  return { primaryMat: primary, isDailySpot: isSpot, lines };
}

export function isTrainSiteUnlocked(state, siteId) {
  const site = trainSiteById(siteId);
  const meta = trainZoneMeta(siteId);
  // 主路徑：上一潮域域主首通
  if (!meta?.prevZone) return true;
  if (state.trainMap?.wardenCleared?.[meta.prevZone]) return true;
  // 舊存檔相容：仍認秘境首通
  if (site.needClear && (state.clearedDungeons || {})[site.needClear]) return true;
  return false;
}

/** 由通關狀態推算已解鎖地點 */
export function unlockedTrainSiteIds(state) {
  return TRAIN_SITES.filter((s) => isTrainSiteUnlocked(state, s.id)).map((s) => s.id);
}

/* ─── P11：材料提示／解鎖回饋 ─── */

export const MATERIAL_USES = {
  tide_dew: "升級",
  coral_shard: "繁殖",
  mist_silk: "高階升級",
  abyss_ink: "繁殖／雜交",
  seal_ember: "突破",
  echo_resin: "技能升級",
  fuse_sand: "融合",
  temper_oil: "洗性格",
  blood_catalyst: "縮短繁殖冷卻",
  breed_ticket: "重置繁殖冷卻",
  mist_token: "秘境入場／掃蕩",
  abyss_token: "潮淵入場",
  tide_key_1: "潮岸／廢墟域主",
  tide_key_2: "深層／霧帷域主",
  tide_key_3: "心核／融砂域主",
  tide_key_4: "暗潮域主",
  warden_echo: "域主複打殘響",
  abyss_grit: "秘境→潮淵頁兌換",
};

/* ─── 潮淵深潛（秘境旁路；唔改潮域產物表）─── */

export const ABYSS_GRIT_ID = "abyss_grit";
/** 潮淵入場令（同秘境 mist_token 分開） */
export const ABYSS_ENTRY_MAT_ID = "abyss_token";
/** 每日首趟免費，其後每趟耗淵潮令 */
export const ABYSS_ENTRY_TOKEN_COST = 1;
export const ABYSS_WIPE_KEEP_RATE = 0.4;
export const ABYSS_MUTATION_EVERY = 3;
export const ABYSS_MAX_ACTIVE_MUTATIONS = 2;

/** @type {Record<string, { id: string, name: string, desc: string, healMult?: number, frontDmgTakenMult?: number, maxPets?: number }>} */
export const ABYSS_MUTATIONS = {
  mut_no_heal: {
    id: "mut_no_heal",
    name: "枯潮",
    desc: "友方治療效果大幅削弱",
    healMult: 0.15,
  },
  mut_front_tax: {
    id: "mut_front_tax",
    name: "浪壓",
    desc: "前排承傷 +35%",
    frontDmgTakenMult: 1.35,
  },
  mut_duo: {
    id: "mut_duo",
    name: "雙影",
    desc: "本場出戰最多 2 寵",
    maxPets: 2,
  },
};

export const ABYSS_MUTATION_IDS = Object.keys(ABYSS_MUTATIONS);

/** 深潛限定外觀（小幅 %，有帳號 cap） */
export const ABYSS_COSMETICS = {
  veil_mark: {
    id: "veil_mark",
    name: "霧帷紋",
    desc: "深潛外觀 · 全隊攻擊 +1.5%",
    cost: 40,
    atkMult: 1.015,
    hpMult: 1,
  },
  abyss_crown: {
    id: "abyss_crown",
    name: "淵冠影",
    desc: "深潛外觀 · 全隊血量 +1.5%",
    cost: 40,
    atkMult: 1,
    hpMult: 1.015,
  },
  tide_sigil: {
    id: "tide_sigil",
    name: "潮印華",
    desc: "深潛外觀 · 攻血各 +1%",
    cost: 70,
    atkMult: 1.01,
    hpMult: 1.01,
  },
};

export const ABYSS_COSMETIC_IDS = Object.keys(ABYSS_COSMETICS);
/** 外觀疊加攻／血倍率上限（相對 1） */
export const ABYSS_COSMETIC_BONUS_CAP = 0.05;

export const ABYSS_INSURANCE_COST = 25;
export const ABYSS_EGG_COST = 90;
export const ABYSS_EGG_WEEKLY_LIMIT = 2;

export function emptyAbyssDive(now = Date.now()) {
  return {
    bestDepth: 0,
    weekBestDepth: 0,
    weekKey: "",
    lastDate: "",
    freeUsedDate: "",
    insuranceCharges: 0,
    cosmetics: {},
    eggsBoughtWeek: 0,
    eggsWeekKey: "",
    run: null,
  };
}

export function abyssFloorGrit(depth, mutationFloor = false) {
  const d = Math.max(1, depth | 0);
  return 2 + Math.floor(d * 1.2) + (mutationFloor ? 2 : 0);
}

/** 簡單 seed 雜湊（深潛波次／突變） */
export function abyssHash(seed) {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickAbyssMutationId(seed, excludeIds = []) {
  const pool = ABYSS_MUTATION_IDS.filter((id) => !excludeIds.includes(id));
  if (!pool.length) return ABYSS_MUTATION_IDS[0];
  const h = abyssHash(seed);
  return pool[h % pool.length];
}

/** 已解鎖外觀疊加嘅攻血倍率（受 cap） */
export function abyssCosmeticCombatMult(unlockedMap = {}) {
  let atk = 1;
  let hp = 1;
  for (const id of ABYSS_COSMETIC_IDS) {
    if (!unlockedMap?.[id]) continue;
    const c = ABYSS_COSMETICS[id];
    atk *= c.atkMult || 1;
    hp *= c.hpMult || 1;
  }
  const capAtk = 1 + ABYSS_COSMETIC_BONUS_CAP;
  const capHp = 1 + ABYSS_COSMETIC_BONUS_CAP;
  return {
    atkMult: Math.min(capAtk, atk),
    hpMult: Math.min(capHp, hp),
  };
}

/** 材料來源索引（練功地／派遣） */
export function buildMaterialSourceIndex() {
  /** @type {Record<string, { sites: string[], missions: string[] }>} */
  const idx = {};
  const ensure = (id) => {
    if (!idx[id]) idx[id] = { sites: [], missions: [] };
    return idx[id];
  };
  for (const site of TRAIN_SITES) {
    for (const drop of site.drops || []) {
      if (drop.mat) {
        const e = ensure(drop.mat);
        if (!e.sites.includes(site.name)) e.sites.push(site.name);
      }
    }
  }
  for (const m of DISPATCH_MISSIONS) {
    for (const id of Object.keys(m.reward?.materials || {})) {
      const e = ensure(id);
      if (!e.missions.includes(m.name)) e.missions.push(m.name);
    }
  }
  return idx;
}

export const MATERIAL_SOURCE_INDEX = buildMaterialSourceIndex();

export function materialSourceLabel(matId) {
  const mat = MATERIALS[matId];
  if (!mat) return "";
  if (mat.tier === "dungeon") return "秘境專屬";
  if (mat.tier === "key") {
    if (matId === "warden_echo") return "域主複打";
    return "秘境潮鑰／域主";
  }
  if (mat.tier === "gate") return "練功／每日／升階（秘境不掉）";
  if (matId === "abyss_token") return "練功／每日／潮淵撤退（僅潮淵入場）";
  if (mat.tier === "abyss") return "潮淵結算 · 秘境→潮淵頁兌換";
  const e = MATERIAL_SOURCE_INDEX[matId];
  if (!e) return mat.desc || "";
  const parts = [];
  if (e.sites.length) parts.push(`練功：${e.sites.join("／")}`);
  if (e.missions.length) {
    const ms = e.missions.slice(0, 2).join("／");
    parts.push(`派遣：${ms}${e.missions.length > 2 ? "…" : ""}`);
  }
  return parts.join(" · ") || mat.desc || "";
}

export function dungeonNameForClear(clearId) {
  const d = DUNGEONS.find((x) => x.id === clearId);
  return d?.name || clearId || "";
}

export function trainSiteUnlockHint(site) {
  if (!site) return null;
  const meta = trainZoneMeta(site.id);
  if (!meta?.prevZone) return null;
  const prev = trainSiteById(meta.prevZone);
  return `打通【${prev.name}】域主`;
}

/** 某 bulk 材料的主要練功地（第一個產出該料的專精地） */
export function primaryTrainSiteForMat(matId) {
  if (!matId || !MATERIALS[matId] || MATERIALS[matId].tier === "dungeon") return null;
  return TRAIN_SITES.find((s) => (s.drops || []).some((d) => d.mat === matId)) || null;
}

/** 缺料時建議去邊個練功地（或標明秘境專屬） */
export function suggestTrainForShortage(state, cost) {
  const items = Object.entries(cost || {})
    .filter(([, n]) => n > 0)
    .map(([id, need]) => {
      const have = state?.materials?.[id] || 0;
      return { id, need, have, short: Math.max(0, need - have) };
    })
    .filter((x) => x.short > 0);
  if (!items.length) return null;
  for (const it of items) {
    if (MATERIALS[it.id]?.tier === "dungeon") {
      return {
        matId: it.id,
        matName: MATERIALS[it.id].name,
        dungeonOnly: true,
        short: it.short,
      };
    }
    const site = primaryTrainSiteForMat(it.id);
    if (!site) continue;
    const unlocked = isTrainSiteUnlocked(state, site.id);
    return {
      matId: it.id,
      matName: MATERIALS[it.id]?.name || it.id,
      short: it.short,
      siteId: site.id,
      siteName: site.name,
      focus: site.focus || "",
      unlocked,
      unlockHint: trainSiteUnlockHint(site),
      alreadyThere: (state.trainSite || "shore") === site.id,
    };
  }
  return null;
}

/* ─── P1：羈絆／陣容加成 ─── */

/**
 * 出戰靈寵羈絆：同元素／同 kind／同種族／同代／親子
 * @returns {{ atkMult: number, hpMult: number, spdMult: number, labels: string[] }}
 */
export function partySynergy(pets) {
  const list = Array.isArray(pets) ? pets : [];
  const labels = [];
  let atkMult = 1;
  let hpMult = 1;
  let spdMult = 1;
  if (list.length < 2) return { atkMult, hpMult, spdMult, labels };

  const byEl = {};
  const byKind = {};
  const bySpecies = {};
  const byGen = {};
  const uids = new Set(list.map((p) => p.uid).filter(Boolean));

  for (const p of list) {
    byEl[p.elementId] = (byEl[p.elementId] || 0) + 1;
    byKind[p.kind] = (byKind[p.kind] || 0) + 1;
    if (p.speciesId) bySpecies[p.speciesId] = (bySpecies[p.speciesId] || 0) + 1;
    const g = petGeneration(p);
    byGen[g] = (byGen[g] || 0) + 1;
  }
  const maxEl = Math.max(...Object.values(byEl));
  const maxKind = Math.max(...Object.values(byKind));
  const maxSp = Math.max(0, ...Object.values(bySpecies));
  const maxGen = Math.max(0, ...Object.values(byGen));

  if (maxEl >= 3) {
    atkMult *= 1.14;
    labels.push("三元共鳴（攻↑）");
  } else if (maxEl >= 2) {
    atkMult *= 1.07;
    labels.push("雙元呼應（攻↑）");
  }

  if (maxKind >= 3) {
    hpMult *= 1.12;
    labels.push("同族鐵壁（血↑）");
  } else if (maxKind >= 2) {
    hpMult *= 1.06;
    labels.push("同種援護（血↑）");
  }

  if (maxSp >= 2) {
    atkMult *= 1.05;
    hpMult *= 1.04;
    labels.push("同族血脈（攻血↑）");
  }

  if (maxGen >= 2) {
    spdMult *= 1.05;
    labels.push("同代共鳴（速↑）");
  }

  // 親子：bornFrom 含出戰同伴 uid
  let kinship = false;
  for (const p of list) {
    const parents = Array.isArray(p.bornFrom) ? p.bornFrom : [];
    if (parents.some((id) => uids.has(id) && id !== p.uid)) {
      kinship = true;
      break;
    }
  }
  if (kinship) {
    atkMult *= 1.06;
    hpMult *= 1.06;
    labels.push("親子羈絆（攻血↑）");
  }

  if (list.length >= 3 && maxEl < 2 && maxKind < 2 && maxSp < 2 && !kinship) {
    spdMult *= 1.04;
    labels.push("雜陣靈動（速↑）");
  }

  return { atkMult, hpMult, spdMult, labels };
}

/* ─── P2：圖鑑／放生／每日／成就 ─── */

/** 圖鑑鍵：物種 × 屬性 × 血統（性格唔再佔格） */
export function bestiaryKey(speciesId, elementId, bloodKey = "none") {
  const bk = bloodKey && bloodKey !== "none" ? bloodKey : "none";
  return `${speciesId}:${elementId}:${bk}`;
}

/** 舊版種×屬鍵（遷移相容） */
export function bestiaryKeyLegacy(speciesId, elementId) {
  return `${speciesId}:${elementId}`;
}

export function bestiaryKeyFromPet(pet) {
  if (!pet?.speciesId || !pet?.elementId) return null;
  return bestiaryKey(pet.speciesId, pet.elementId, bloodlineKey(pet.bloodmarks));
}

/** 舊存檔圖鑑鍵遷移 → 物種:屬性:血統 */
export function migrateBestiaryMap(raw) {
  const out = {};
  for (const [key, val] of Object.entries(raw || {})) {
    if (!val) continue;
    const parts = String(key).split(":");
    let next = null;
    if (parts.length >= 4) {
      // sp:el:personality:blood...
      next = bestiaryKey(parts[0], parts[1], parts.slice(3).join("+") || "none");
    } else if (parts.length === 3) {
      // 新格式 sp:el:blood，或舊誤用 sp:el:personality
      if (PERSONALITIES[parts[2]]) next = bestiaryKey(parts[0], parts[1], "none");
      else next = bestiaryKey(parts[0], parts[1], parts[2]);
    } else if (parts.length === 2) {
      next = bestiaryKey(parts[0], parts[1], "none");
    }
    if (next) out[next] = true;
  }
  return out;
}

export function bestiaryTotal() {
  return (
    Object.keys(SPECIES).length *
    Object.keys(ELEMENTS).length *
    allBloodlineKeys().length
  );
}

/** 圖鑑物種摘要（UI 用，避免渲染上萬格） */
export function bestiarySpeciesSummary(state) {
  const known = state?.bestiary || {};
  const bloodKeys = allBloodlineKeys();
  const perSpecies = Object.keys(ELEMENTS).length * bloodKeys.length;
  return Object.values(SPECIES).map((sp) => {
    let found = 0;
    const prefix = `${sp.id}:`;
    for (const key of Object.keys(known)) {
      if (key.startsWith(prefix)) found += 1;
    }
    return {
      speciesId: sp.id,
      speciesName: sp.name,
      kind: sp.kind,
      breedOnly: !!sp.breedOnly,
      found,
      total: perSpecies,
    };
  });
}

export function bestiaryEntries() {
  const out = [];
  for (const sp of Object.values(SPECIES)) {
    for (const el of Object.values(ELEMENTS)) {
      out.push({
        key: bestiaryKeyLegacy(sp.id, el.id),
        speciesId: sp.id,
        speciesName: sp.name,
        kind: sp.kind,
        elementId: el.id,
        elementName: el.name,
        label: `${el.name}${sp.name}`,
      });
    }
  }
  return out;
}

/** 每收集 25 格：全隊攻／血 +2%（戰鬥） */
export function bestiaryCombatBonus(discoveredCount) {
  const n = Math.max(0, discoveredCount | 0);
  const tiers = Math.floor(n / 25);
  const rate = tiers * 0.02;
  return {
    tiers,
    discovered: n,
    total: bestiaryTotal(),
    atkMult: 1 + rate,
    hpMult: 1 + rate,
    label: tiers > 0 ? `圖鑑共鳴 ×${tiers}（攻／血 +${tiers * 2}%）` : "",
  };
}

/** 放生返還 */
export function releaseRefund(pet) {
  const lv = pet.level ?? 1;
  const fus = pet.fusionLevel ?? 0;
  const stones = 8 + lv * 4 + fus * 12;
  const feed = 2 + Math.floor(lv / 2) + fus;
  const dust = fus > 0 ? fus * 3 : Math.floor(lv / 3);
  return { stones, feed, dust };
}

export const NICK_MAX_LEN = 8;

/** 每日任務定義 */
export const DAILY_QUESTS = [
  {
    id: "idle",
    name: "靜心修行",
    desc: "完成 1 次階段突破，或累積掛機滿 3 分鐘",
    need: 1,
    reward: { stones: 20, feed: 6 },
  },
  {
    id: "dungeon",
    name: "潮汐試煉",
    desc: "挑戰秘境 1 次（不論勝負）",
    need: 1,
    reward: { stones: 30, scrap: 1, materials: { mist_token: 2 } },
  },
  {
    id: "bond",
    name: "結契之緣",
    desc: "嘗試契約 1 次（成功或失敗皆可）",
    need: 1,
    reward: { stones: 25, dust: 5 },
  },
  {
    id: "breed",
    name: "血脈催生",
    desc: "完成 1 次繁殖",
    need: 1,
    reward: { stones: 28, feed: 5 },
  },
  {
    id: "win",
    name: "秘境取勝",
    desc: "秘境勝利 1 場",
    need: 1,
    reward: { stones: 35, dust: 4, materials: { mist_token: 2 } },
  },
  {
    id: "dispatch",
    name: "外派歸來",
    desc: "領取 1 次牧場派遣獎勵",
    need: 1,
    reward: { stones: 22, materials: { tide_dew: 1, mist_token: 1 } },
  },
  {
    id: "fuse",
    name: "融靈一試",
    desc: "完成 1 次融合",
    need: 1,
    reward: { stones: 26, scrap: 1 },
  },
  {
    id: "train_tier",
    name: "霧階推進",
    desc: "在潮域推進 1 次霧階",
    need: 1,
    reward: { stones: 22, feed: 4, materials: { mist_token: 1 } },
  },
  {
    id: "train_warden",
    name: "域主試煉",
    desc: "挑戰潮域域主 1 次（不論勝負）",
    need: 1,
    reward: { stones: 32, dust: 6 },
  },
];

/** 每日任務全領後的全清獎（每日一次） */
export const DAILY_ALL_CLEAR_BONUS = {
  stones: 60,
  materials: { mist_token: 5, breed_ticket: 1 },
};

/** 已通關秘境召喚／掃蕩場數範圍 */
export const DUNGEON_SUMMON_MIN = 1;
export const DUNGEON_SUMMON_MAX = 10;

/** 舊固定按鈕列表（測試／相容） */
export const DUNGEON_SWEEP_COUNTS = [1, 5, 10];

export function clampDungeonSummonCount(count) {
  const n = Math.floor(Number(count) || DUNGEON_SUMMON_MIN);
  return Math.max(DUNGEON_SUMMON_MIN, Math.min(DUNGEON_SUMMON_MAX, n));
}

/** 入場令 id（秘境永不掉落） */
export const DUNGEON_ENTRY_MAT_ID = "mist_token";

/**
 * 已通關秘境入場／掃蕩耗潮霧令（每場）；首通／教學免費。
 * 高階層略貴。
 */
export function dungeonEntryTokenPerRun(dungeonId) {
  const tier = parseDungeonTier(dungeonId) || 1;
  if (tier <= 2) return 1;
  if (tier <= 4) return 2;
  return 2 + Math.floor((tier - 4) / 2);
}

export function dungeonEntryMatCost(dungeonId, count = 1) {
  const n = Math.max(1, count | 0);
  const per = dungeonEntryTokenPerRun(dungeonId);
  return { [DUNGEON_ENTRY_MAT_ID]: per * n };
}

/**
 * 求道目標板：三條長線（收集／育成／挑戰）
 * need 為累積門檻；領獎後進度保留，可領下一檔
 */
export const PATH_QUESTS = [
  {
    track: "collect",
    trackName: "收集",
    id: "collect_20",
    name: "潮錄二十",
    desc: "圖鑑登錄 ≥ 20 格",
    type: "bestiary",
    need: 20,
    reward: { stones: 40, materials: { coral_shard: 2 } },
  },
  {
    track: "collect",
    trackName: "收集",
    id: "collect_80",
    name: "潮錄八十",
    desc: "圖鑑登錄 ≥ 80 格",
    type: "bestiary",
    need: 80,
    reward: { stones: 80, materials: { blood_catalyst: 1, mist_silk: 2 } },
  },
  {
    track: "collect",
    trackName: "收集",
    id: "collect_200",
    name: "潮錄二百",
    desc: "圖鑑登錄 ≥ 200 格",
    type: "bestiary",
    need: 200,
    reward: { stones: 150, materials: { blood_catalyst: 2, seal_ember: 1 } },
  },
  {
    track: "collect",
    trackName: "收集",
    id: "collect_500",
    name: "潮錄五百",
    desc: "圖鑑登錄 ≥ 500 格",
    type: "bestiary",
    need: 500,
    reward: { stones: 280, materials: { breed_ticket: 2, abyss_ink: 3 } },
  },
  {
    track: "nurture",
    trackName: "育成",
    id: "nurture_breed3",
    name: "血脈三結",
    desc: "繁殖 ≥ 3 次",
    type: "breeds",
    need: 3,
    reward: { stones: 50, materials: { coral_shard: 3 } },
  },
  {
    track: "nurture",
    trackName: "育成",
    id: "nurture_hybrid",
    name: "雜交初成",
    desc: "擁有雜交種 ≥ 1",
    type: "hybrid_owned",
    need: 1,
    reward: { stones: 70, materials: { abyss_ink: 1 } },
  },
  {
    track: "nurture",
    trackName: "育成",
    id: "nurture_gen2",
    name: "二代血脈",
    desc: "擁有 ≥ 2 代寵",
    type: "min_gen",
    need: 2,
    reward: { stones: 90, materials: { blood_catalyst: 1 } },
  },
  {
    track: "nurture",
    trackName: "育成",
    id: "nurture_gen3",
    name: "三代覺醒",
    desc: "擁有 ≥ 3 代寵",
    type: "min_gen",
    need: 3,
    reward: { stones: 160, materials: { seal_ember: 2, breed_ticket: 1 } },
  },
  {
    track: "nurture",
    trackName: "育成",
    id: "nurture_tertiary",
    name: "三代新種",
    desc: "擁有三代種（雜交×雜交）≥ 1",
    type: "tertiary_owned",
    need: 1,
    reward: { stones: 200, materials: { blood_catalyst: 2, temper_oil: 2 } },
  },
  {
    track: "challenge",
    trackName: "挑戰",
    id: "chal_wins8",
    name: "秘境八勝",
    desc: "累計秘境勝場 ≥ 8",
    type: "combats",
    need: 8,
    reward: { stones: 55, scrap: 2 },
  },
  {
    track: "challenge",
    trackName: "挑戰",
    id: "chal_tide2",
    name: "踏破二層",
    desc: "通關【潮汐廢墟·二層】",
    type: "cleared",
    dungeonId: "tide_2",
    need: 1,
    reward: { stones: 80, materials: { mist_silk: 2 } },
  },
  {
    track: "challenge",
    trackName: "挑戰",
    id: "chal_tide4",
    name: "深層回音",
    desc: "通關【潮汐深層】",
    type: "cleared",
    dungeonId: "tide_4",
    need: 1,
    reward: { stones: 140, materials: { blood_catalyst: 2, temper_oil: 1 } },
  },
  {
    track: "challenge",
    trackName: "挑戰",
    id: "chal_wins30",
    name: "百潮之師",
    desc: "累計秘境勝場 ≥ 30",
    type: "combats",
    need: 30,
    reward: { stones: 220, materials: { seal_ember: 2 } },
  },
];

export function evalPathQuest(state, quest) {
  if (!quest) return { ok: false, progress: "?", current: 0 };
  if (quest.type === "bestiary") {
    const n = Object.keys(state.bestiary || {}).length;
    return { ok: n >= quest.need, progress: `${n}/${quest.need}`, current: n };
  }
  if (quest.type === "breeds") {
    const n = state.stats?.breeds || 0;
    return { ok: n >= quest.need, progress: `${n}/${quest.need}`, current: n };
  }
  if (quest.type === "hybrid_owned") {
    const owned = [...(state.pets || []), ...(state.ranch || [])];
    const n = owned.filter((p) => p.breedOnly || SPECIES[p.speciesId]?.breedOnly).length;
    return { ok: n >= quest.need, progress: `${n}/${quest.need}`, current: n };
  }
  if (quest.type === "min_gen") {
    const owned = [...(state.pets || []), ...(state.ranch || [])];
    const maxG = owned.reduce((m, p) => Math.max(m, petGeneration(p)), 0);
    return { ok: maxG >= quest.need, progress: `最高${maxG}代`, current: maxG };
  }
  if (quest.type === "tertiary_owned") {
    const owned = [...(state.pets || []), ...(state.ranch || [])];
    const n = owned.filter((p) => SPECIES[p.speciesId]?.tertiary).length;
    return { ok: n >= quest.need, progress: `${n}/${quest.need}`, current: n };
  }
  if (quest.type === "combats") {
    const n = state.combatsWon || 0;
    return { ok: n >= quest.need, progress: `${n}/${quest.need}`, current: n };
  }
  if (quest.type === "cleared") {
    const ok = !!(state.clearedDungeons || {})[quest.dungeonId];
    return { ok, progress: ok ? "已通" : "未通", current: ok ? 1 : 0 };
  }
  return { ok: false, progress: "?", current: 0 };
}

/** 成就（一次性） */
export const ACHIEVEMENTS = [
  {
    id: "first_win",
    name: "初戰告捷",
    desc: "秘境勝利 1 場",
    reward: { stones: 40 },
  },
  {
    id: "bonds_3",
    name: "三契已成",
    desc: "成功契約 3 次",
    reward: { stones: 50, feed: 10 },
  },
  {
    id: "bestiary_10",
    name: "潮錄十影",
    desc: "圖鑑收集滿 10 格",
    reward: { stones: 60, dust: 10 },
  },
  {
    id: "fuse_once",
    name: "融靈初成",
    desc: "完成 1 次融合",
    reward: { stones: 45, scrap: 1 },
  },
  {
    id: "breed_once",
    name: "血脈相傳",
    desc: "完成 1 次繁殖",
    reward: { stones: 45, feed: 8 },
  },
  {
    id: "stage_2",
    name: "通靈有成",
    desc: "達到通靈後期（階段 2）",
    reward: { stones: 80 },
  },
  {
    id: "hybrid_once",
    name: "雜交覺醒",
    desc: "繁殖出 1 隻雜交新種族",
    reward: { stones: 70, dust: 12 },
  },
  {
    id: "legend_breed",
    name: "傳說血脈",
    desc: "繁殖出傳說稀有度靈寵",
    reward: { stones: 100, scrap: 2 },
  },
  {
    id: "bestiary_30",
    name: "潮錄三十",
    desc: "圖鑑收集滿 30 格",
    reward: { stones: 90, dust: 15 },
  },
  {
    id: "bestiary_full",
    name: "全潮錄成",
    desc: "圖鑑全部登錄",
    reward: { stones: 200, scrap: 3, dust: 20 },
  },
  {
    id: "stage_5",
    name: "潮主臨世",
    desc: "達到潮主（階段 5）",
    reward: { stones: 120, scrap: 2 },
  },
  {
    id: "stage_8",
    name: "三重潮主",
    desc: "達到潮主·3重（階段 8）",
    reward: { stones: 180, scrap: 3 },
  },
  {
    id: "clear_tide_4",
    name: "深層踏破",
    desc: "通關潮汐深層（四層）",
    reward: { stones: 100, scrap: 2 },
  },
  {
    id: "clear_tide_8",
    name: "八層潮痕",
    desc: "通關潮汐廢墟 · 8層",
    reward: { stones: 160, scrap: 3 },
  },
  {
    id: "wins_25",
    name: "百戰初成",
    desc: "累計秘境勝場 ≥ 25",
    reward: { stones: 80, feed: 12 },
  },
  {
    id: "wins_50",
    name: "潮戰不息",
    desc: "累計秘境勝場 ≥ 50",
    reward: { stones: 140, scrap: 2 },
  },
  {
    id: "hybrids_3",
    name: "三雜交成",
    desc: "累計雜交誕生 ≥ 3",
    reward: { stones: 90, dust: 15 },
  },
  {
    id: "challenge_win",
    name: "挑戰破關",
    desc: "帶挑戰規則通關 1 次",
    reward: { stones: 70, scrap: 1 },
  },
  {
    id: "streak_5",
    name: "連勝五潮",
    desc: "秘境連勝達 5 場",
    reward: { stones: 85, dust: 10 },
  },
  {
    id: "fangmite_once",
    name: "牙蟎初現",
    desc: "雜交出【牙蟎】",
    reward: { stones: 75, dust: 10 },
  },
  {
    id: "tide_seal_1",
    name: "潮印初鑄",
    desc: "鑄成潮印 1 枚",
    reward: { stones: 100, scrap: 2 },
  },
  {
    id: "dispatch_once",
    name: "初派有成",
    desc: "完成 1 次派遣領獎",
    reward: { stones: 35, feed: 6 },
  },
  {
    id: "dispatch_5",
    name: "五度外派",
    desc: "累計派遣領獎 5 次",
    reward: { stones: 55, dust: 8 },
  },
  {
    id: "gen3_born",
    name: "三代血脈",
    desc: "繁殖出 1 隻三代靈寵",
    reward: { stones: 70, materials: { abyss_ink: 2 } },
  },
  {
    id: "glintfox_once",
    name: "耀狐初現",
    desc: "雜交出【耀狐】",
    reward: { stones: 65, dust: 10 },
  },
];

/** 7 日登入連續獎勵（cycle） */
export const LOGIN_STREAK_REWARDS = [
  { day: 1, name: "初潮", reward: { stones: 30, feed: 5, materials: { mist_token: 2, abyss_token: 1 } } },
  { day: 2, name: "雙契", reward: { stones: 35, feed: 8, materials: { mist_token: 2 } } },
  { day: 3, name: "三潮", reward: { stones: 40, dust: 6, materials: { tide_dew: 2, mist_token: 3, abyss_token: 2 } } },
  { day: 4, name: "暗潮蛋", reward: { stones: 45, eggTier: "B", materials: { mist_token: 3 } } },
  { day: 5, name: "五潮", reward: { stones: 50, scrap: 1, materials: { coral_shard: 2, mist_token: 3, abyss_token: 2 } } },
  { day: 6, name: "血脈", reward: { stones: 55, materials: { breed_ticket: 1, blood_catalyst: 1, mist_token: 4 } } },
  { day: 7, name: "心核", reward: { stones: 80, eggTier: "A", materials: { mist_silk: 2, mist_token: 5, abyss_token: 3 } } },
];

export function yesterdayKey(now = Date.now()) {
  return todayKey(now - 86400000);
}

export function todayKey(now = Date.now()) {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** ISO 週鍵（YYYY-Www），用於週循環目標 */
export function weekKey(now = Date.now()) {
  const d = new Date(now);
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** 離線結算提示門檻（秒） */
export const OFFLINE_HINT_SEC = 90;

/* ─── P3：繁殖目標／配方一覽／秘境試煉 ─── */

/**
 * 繁殖／歷練目標
 * cadence: daily | weekly | once
 * type: hybrid_species | reach_gen | reach_rarity | hybrid_bestiary | breed_count | hybrid_any | dungeon_wins
 */
export const BREED_GOALS = [
  {
    id: "daily_breed",
    cadence: "daily",
    type: "breed_count",
    need: 1,
    name: "血脈試合",
    desc: "完成 1 次繁殖",
    reward: { stones: 25, feed: 4 },
  },
  {
    id: "daily_hybrid",
    cadence: "daily",
    type: "breed_cross_kind",
    need: 1,
    name: "今日雜配",
    desc: "完成 1 次異種繁殖（不論是否雜交成功）",
    reward: { stones: 32, dust: 5 },
  },
  {
    id: "weekly_hybrid",
    cadence: "weekly",
    type: "hybrid_any",
    need: 2,
    name: "週課：雜交",
    desc: "本週雜交誕生 2 隻",
    reward: { stones: 70, dust: 12 },
  },
  {
    id: "weekly_gen2",
    cadence: "weekly",
    type: "reach_gen",
    gen: 2,
    need: 1,
    name: "週課：二代",
    desc: "本週誕生 ≥2 代寵 1 隻",
    reward: { stones: 55, feed: 10 },
  },
  {
    id: "weekly_dungeon",
    cadence: "weekly",
    type: "dungeon_wins",
    need: 5,
    name: "週課：秘境",
    desc: "本週秘境勝場 ≥ 5",
    reward: { stones: 90, scrap: 2 },
  },
  {
    id: "goal_tideling",
    cadence: "once",
    type: "hybrid_species",
    species: "tideling",
    need: 1,
    name: "潮獸覺醒",
    desc: "雜交出【潮獸】",
    reward: { stones: 80, dust: 10 },
  },
  {
    id: "goal_stormmoth",
    cadence: "once",
    type: "hybrid_species",
    species: "stormmoth",
    need: 1,
    name: "嵐蛾降臨",
    desc: "雜交出【嵐蛾】",
    reward: { stones: 80, dust: 10 },
  },
  {
    id: "goal_fangmite",
    cadence: "once",
    type: "hybrid_species",
    species: "fangmite",
    need: 1,
    name: "牙蟎覺醒",
    desc: "雜交出【牙蟎】",
    reward: { stones: 80, dust: 10 },
  },
  {
    id: "goal_scalequill",
    cadence: "once",
    type: "hybrid_species",
    species: "scalequill",
    need: 1,
    name: "鱗羽降臨",
    desc: "雜交出【鱗羽】",
    reward: { stones: 80, dust: 10 },
  },
  {
    id: "goal_gen2",
    cadence: "once",
    type: "reach_gen",
    gen: 2,
    need: 1,
    name: "二代血脈",
    desc: "誕生 1 隻繁殖 2 代靈寵",
    reward: { stones: 60, feed: 10 },
  },
  {
    id: "goal_gen3",
    cadence: "once",
    type: "reach_gen",
    gen: 3,
    need: 1,
    name: "三代血脈",
    desc: "誕生 1 隻繁殖 3 代靈寵",
    reward: { stones: 100, scrap: 1 },
  },
  {
    id: "goal_rare",
    cadence: "once",
    type: "reach_rarity",
    rarity: 1,
    need: 1,
    name: "稀有突變",
    desc: "繁殖出稀有或以上靈寵",
    reward: { stones: 50, dust: 8 },
  },
  {
    id: "goal_epic",
    cadence: "once",
    type: "reach_rarity",
    rarity: 2,
    need: 1,
    name: "史詩血紋",
    desc: "繁殖出史詩或以上靈寵",
    reward: { stones: 90, dust: 12 },
  },
  {
    id: "goal_hybrid_dex",
    cadence: "once",
    type: "hybrid_bestiary",
    need: 3,
    name: "雜交圖錄",
    desc: "圖鑑登錄 3 格繁殖專屬種（種族×元素）",
    reward: { stones: 70, feed: 8 },
  },
];

/** 配方矩陣（UI）：6 kind × 6，主配方優先 */
export function hybridRecipeMatrix() {
  const cells = [];
  for (const a of KINDS) {
    for (const b of KINDS) {
      if (a === b) {
        cells.push({ kindA: a, kindB: b, same: true, recipe: null });
        continue;
      }
      const recipe = hybridRecipeForKinds(a, b);
      cells.push({
        kindA: a,
        kindB: b,
        same: false,
        recipe: recipe
          ? {
              species: recipe.species,
              name: SPECIES[recipe.species]?.name || recipe.species,
              chance: recipe.chance,
              tier: recipe.tier,
            }
          : null,
      });
    }
  }
  return cells;
}

/** 主配方＋三代種列表（繁殖頁摘要） */
export function hybridRecipeSummary() {
  const mains = HYBRID_RECIPES.map((r) => ({
    ...r,
    name: SPECIES[r.species]?.name || r.species,
    kindsLabel: `${r.kinds[0]}×${r.kinds[1]}`,
  }));
  const tert = TERTIARY_RECIPES.map((r) => ({
    ...r,
    tier: "tertiary",
    name: SPECIES[r.species]?.name || r.species,
    kindsLabel: `${SPECIES[r.parents[0]]?.name || r.parents[0]}×${SPECIES[r.parents[1]]?.name || r.parents[1]}`,
  }));
  /* 去重三代種顯示 */
  const seen = new Set();
  const tertUnique = [];
  for (const r of tert) {
    if (seen.has(r.species)) continue;
    seen.add(r.species);
    tertUnique.push(r);
  }
  return [...mains, ...tertUnique];
}

/**
 * 秘境雜交試煉：出戰滿足條件勝利額外獎
 * needHybrid: 需要出戰含 breedOnly 寵
 * needGen: 需要至少一隻 ≥ 該代
 */
export const DUNGEON_TRIALS = {
  tide_1: {
    id: "trial_tide_1",
    label: "試煉：帶 ≥1 代寵",
    needGen: 1,
    bonus: { stones: 12, scrap: 0 },
  },
  tide_2: {
    id: "trial_tide_2",
    label: "試煉：帶雜交種或 ≥2 代",
    needHybrid: true,
    needGen: 2,
    match: "any",
    bonus: { stones: 22, scrap: 1 },
  },
  tide_3: {
    id: "trial_tide_3",
    label: "試煉：帶雜交種且 ≥2 代",
    needHybrid: true,
    needGen: 2,
    match: "all",
    bonus: { stones: 40, scrap: 1 },
  },
  tide_4: {
    id: "trial_tide_4",
    label: "試煉：雜交種且 ≥3 代",
    needHybrid: true,
    needGen: 3,
    match: "all",
    bonus: { stones: 70, scrap: 2 },
  },
};

export function partyMeetsTrial(pets, trial) {
  if (!trial) return { ok: false, reason: "" };
  const list = Array.isArray(pets) ? pets : [];
  const hasHybrid = list.some((p) => p.breedOnly || SPECIES[p.speciesId]?.breedOnly);
  const maxGen = list.reduce((m, p) => Math.max(m, petGeneration(p)), 0);
  const genOk = !trial.needGen || maxGen >= trial.needGen;
  const hybridOk = !trial.needHybrid || hasHybrid;

  if (trial.match === "all") {
    const ok = hybridOk && genOk;
    return {
      ok,
      reason: ok
        ? ""
        : `需要雜交種且至少 ${trial.needGen} 代（現${hasHybrid ? "有" : "無"}雜交／最高${maxGen}代）`,
    };
  }
  if (trial.needHybrid && trial.needGen) {
    // any: hybrid OR gen
    const ok = hasHybrid || genOk;
    return {
      ok,
      reason: ok ? "" : `需要雜交種或 ≥${trial.needGen} 代（最高${maxGen}代）`,
    };
  }
  if (trial.needHybrid) {
    return { ok: hybridOk, reason: hybridOk ? "" : "需要出戰含雜交種" };
  }
  if (trial.needGen) {
    return {
      ok: genOk,
      reason: genOk ? "" : `需要出戰含 ≥${trial.needGen} 代寵（最高${maxGen}代）`,
    };
  }
  return { ok: true, reason: "" };
}

export function countHybridBestiary(bestiary) {
  const known = bestiary || {};
  let n = 0;
  for (const sp of Object.values(SPECIES)) {
    if (!sp.breedOnly) continue;
    for (const el of Object.keys(ELEMENTS)) {
      const prefix = `${sp.id}:${el}:`;
      if (Object.keys(known).some((k) => k.startsWith(prefix))) n += 1;
    }
  }
  return n;
}
