/** Data tables — 靈寵修行 */

export const STAGES = [
  { id: 0, name: "初契", need: 0, rate: 2.5 },
  { id: 1, name: "通靈初期", need: 40, rate: 3.2 },
  { id: 2, name: "通靈後期", need: 120, rate: 4.2 },
  { id: 3, name: "御靈", need: 320, rate: 5.5 },
  { id: 4, name: "靈主", need: 800, rate: 7 },
  { id: 5, name: "潮主", need: 1800, rate: 9 },
];

export const REALMS = STAGES;

/**
 * 晉升至目標階段的額外門檻（靈契仍用 STAGES[target].need）
 * costs: 突破時扣除；checks: 硬性條件
 */
export const BREAKTHROUGH_GATES = {
  1: {
    costs: { stones: 25 },
    checks: [{ type: "combats", need: 1, label: "秘境勝場 ≥ 1" }],
  },
  2: {
    costs: { stones: 50, scrap: 1 },
    checks: [
      { type: "cleared", dungeonId: "tide_1", label: "通關【潮汐廢墟·一層】" },
      { type: "bonds", need: 1, label: "成功契約 ≥ 1" },
      { type: "owned_pets", need: 2, label: "擁有靈寵 ≥ 2" },
    ],
  },
  3: {
    costs: { stones: 100, scrap: 2, dust: 10 },
    checks: [
      { type: "cleared", dungeonId: "tide_1", label: "通關【一層】" },
      { type: "combats", need: 5, label: "累計秘境勝場 ≥ 5" },
      { type: "bonds", need: 3, label: "成功契約 ≥ 3" },
      { type: "gear_equipped", need: 1, label: "人物穿戴 ≥ 1 件裝備" },
    ],
  },
  4: {
    costs: { stones: 200, scrap: 3, dust: 20, feed: 15 },
    checks: [
      { type: "cleared", dungeonId: "tide_2", label: "通關【二層】" },
      { type: "fusions", need: 1, label: "完成融合 ≥ 1" },
      { type: "hybrid_owned", need: 1, label: "擁有雜交種 ≥ 1" },
      { type: "gear_equipped", need: 2, label: "人物穿戴 ≥ 2 件裝備" },
    ],
  },
  5: {
    costs: { stones: 400, scrap: 5, dust: 40, feed: 30 },
    checks: [
      { type: "cleared", dungeonId: "tide_3", label: "通關【心核】" },
      { type: "min_gen", gen: 2, label: "擁有 ≥ 2 代寵" },
      { type: "breeds", need: 3, label: "繁殖次數 ≥ 3" },
      { type: "bestiary", need: 10, label: "圖鑑登錄 ≥ 10 格" },
      { type: "gear_equipped", need: 3, label: "三槽滿裝" },
    ],
  },
};

function ownedPetList(state) {
  return [...(state.pets || []), ...(state.ranch || [])];
}

function countEquippedGear(state) {
  const eq = state.master?.equip || {};
  return ["weapon", "armor", "accessory"].filter((s) => eq[s]).length;
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
    const n = countEquippedGear(state);
    return { ok: n >= check.need, progress: `${n}/${check.need}` };
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
  return { ok: false, progress: "?" };
}

function formatCostBits(costs) {
  if (!costs) return "";
  const bits = [];
  if (costs.stones) bits.push(`${costs.stones}石`);
  if (costs.scrap) bits.push(`${costs.scrap}碎片`);
  if (costs.dust) bits.push(`${costs.dust}靈塵`);
  if (costs.feed) bits.push(`${costs.feed}飼料`);
  return bits.join("／");
}

/**
 * 下一階段突破檢視：分項達標狀態（供 UI 清單表）
 */
export function breakthroughView(state) {
  const cur = STAGES[Math.min(state.realm, STAGES.length - 1)];
  const next = STAGES[state.realm + 1] || null;
  if (!next) {
    return { maxed: true, cur, next: null, items: [], ready: false, costs: null, costLabel: "" };
  }
  const gate = BREAKTHROUGH_GATES[next.id] || { costs: {}, checks: [] };
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
};

/** 野生／秘境可遇種族（排除繁殖專屬） */
export function wildSpeciesIds() {
  return Object.values(SPECIES)
    .filter((s) => !s.breedOnly)
    .map((s) => s.id);
}

export const PERSONALITIES = {
  fierce: { id: "fierce", name: "烈性", atk: 1.15, hp: 0.92, spd: 1.05 },
  steady: { id: "steady", name: "沉穩", atk: 0.95, hp: 1.18, spd: 0.9 },
  sly: { id: "sly", name: "狡黠", atk: 1.08, hp: 0.95, spd: 1.12 },
  gentle: { id: "gentle", name: "溫馴", atk: 0.9, hp: 1.1, spd: 1.0 },
  wild: { id: "wild", name: "狂放", atk: 1.2, hp: 0.88, spd: 1.08 },
};

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
 * 初契 3 → 通靈初 5 → … → 潮主 13
 */
export function ranchCapForStage(stageId) {
  return 3 + Math.max(0, stageId) * 2;
}

/** 升級耗靈石（獨立於融合，只跟寵物自身等級） */
export function upgradeStoneCost(level) {
  const lv = Math.max(1, level | 0);
  return 10 + lv * 12 + lv * lv * 2;
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
 * 階1→40, 階2→240, 階3→960
 */
export function fusionStoneCost(targetStage) {
  const n = Math.max(1, Math.min(FUSION_MAX_STAGE, targetStage | 0));
  const rule = FUSION_RULES[n];
  return 10 * n * (n + 1) * rule.totalPets;
}

/** 性格 → 契約成功率 */
export const BOND_RATE_BY_PERSONALITY = {
  gentle: 0.78,
  steady: 0.68,
  sly: 0.55,
  fierce: 0.45,
  wild: 0.32,
};

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
export const BREED_STONE_COST = 55;
export const BREED_COOLDOWN_MS = 40_000;
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
 * × 無配方：獸×蟲、鱗×禽、甲×蟲
 */
export const HYBRID_RECIPES = [
  // —— 主配方 ——
  { kinds: ["獸", "鱗"], species: "tideling", chance: 0.28, tier: "main" },
  { kinds: ["禽", "蟲"], species: "duskfly", chance: 0.26, tier: "main" },
  { kinds: ["獸", "甲"], species: "ironback", chance: 0.26, tier: "main" },
  { kinds: ["鱗", "甲"], species: "mistcarp", chance: 0.26, tier: "main" },
  { kinds: ["獸", "禽"], species: "reefwing", chance: 0.26, tier: "main" },
  { kinds: ["光", "蟲"], species: "stormmoth", chance: 0.26, tier: "main" },
  // —— 次配方（較低機率／後門）——
  { kinds: ["鱗", "蟲"], species: "mistcarp", chance: 0.18, tier: "sub" },
  { kinds: ["甲", "禽"], species: "ironback", chance: 0.16, tier: "sub" },
  { kinds: ["光", "獸"], species: "tideling", chance: 0.16, tier: "sub" },
  { kinds: ["光", "禽"], species: "reefwing", chance: 0.18, tier: "sub" },
  { kinds: ["光", "鱗"], species: "mistcarp", chance: 0.15, tier: "sub" },
  { kinds: ["光", "甲"], species: "ironback", chance: 0.14, tier: "sub" },
];

function kindPairKey(k1, k2) {
  return [k1, k2].sort().join("|");
}

const HYBRID_BY_KINDS = (() => {
  const map = {};
  for (const r of HYBRID_RECIPES) {
    if (!r.chance) continue;
    const key = kindPairKey(r.kinds[0], r.kinds[1]);
    if (!map[key] || r.chance > map[key].chance) map[key] = r;
  }
  return map;
})();

export function hybridRecipeForKinds(kindA, kindB) {
  if (!kindA || !kindB || kindA === kindB) return null;
  return HYBRID_BY_KINDS[kindPairKey(kindA, kindB)] || null;
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
 * 恐龍突變式繁殖 + 代際
 */
export function rollBreedGenes(parentA, parentB) {
  const ga = parentA.genes || {
    species: parentA.speciesId,
    element: parentA.elementId,
    personality: parentA.personalityId,
  };
  const gb = parentB.genes || {
    species: parentB.speciesId,
    element: parentB.elementId,
    personality: parentB.personalityId,
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
  let personality = Math.random() < 0.5 ? ga.personality : gb.personality;
  let mutated = false;
  let hybrid = false;
  let newSpecies = false;

  const recipe = !sameSpecies && kindA !== kindB ? hybridRecipeForKinds(kindA, kindB) : null;
  if (recipe && SPECIES[recipe.species]) {
    const chance = Math.min(0.85, recipe.chance * genMult);
    if (Math.random() < chance) {
      species = recipe.species;
      hybrid = true;
      newSpecies = true;
      mutated = true;
    }
  }

  const elemRate = Math.min(0.35, BREED_ELEMENT_MUTATION_RATE * genMult);
  if (Math.random() < elemRate) {
    const others = Object.keys(ELEMENTS).filter((e) => e !== element);
    element = pick(others);
    mutated = true;
  }

  const rarity = rollBreedRarity(parentA, parentB, { sameSpecies, hybrid, genMult });
  const parentMax = Math.max(parentA.rarity ?? 0, parentB.rarity ?? 0);
  const rarityUp = rarity > parentMax;

  return {
    species,
    element,
    personality,
    rarity,
    generation,
    genA,
    genB,
    mutated,
    hybrid,
    newSpecies,
    rarityUp,
    sameSpecies,
    recipeTier: recipe?.tier || null,
    hybridChance: recipe ? Math.min(0.85, recipe.chance * genMult) : 0,
  };
}

/** 秘境隨機生成一隻野生靈寵；可帶分層權重（僅野生種） */
export function rollWildEncounter(dungeonId = "wild", dungeonDef = null) {
  const wildIds = wildSpeciesIds();
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
  const baseCost = 28 + Math.floor(Math.random() * 30);
  const pet = buildPetStats({
    id: `enc-${dungeonId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    species: speciesId,
    element: elementId,
    personality: personalityId,
    cost: baseCost,
    rarity: 0,
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

export const RECRUIT_POOL = [];

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
    reward: { stones: 28, scrap: 1 },
    firstClearBonus: { stones: 40, scrap: 1 },
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
    reward: { stones: 55, scrap: 2 },
    firstClearBonus: { stones: 80, scrap: 2 },
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
    reward: { stones: 120, scrap: 4 },
    firstClearBonus: { stones: 150, scrap: 3 },
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
];

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
  const rarity = Math.max(0, Math.min(RARITY_MAX, template.rarity ?? 0));
  const rMult = rarityInfo(rarity).mult;
  const skillId = KIND_SKILLS[sp.kind];
  const atk = Math.round(sp.base.atk * el.atk * pe.atk * rMult);
  const hp = Math.round(sp.base.hp * el.hp * pe.hp * rMult);
  const spd = Math.round(sp.base.spd * el.spd * pe.spd * rMult);
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
    },
  };
}

export function petLabel(pet) {
  const r = rarityInfo(pet.rarity ?? 0).name;
  return `${pet.name}（${r}·${pet.kind}·${pet.elementName}·${pet.personalityName}）`;
}

/* ─── P1：牧場掛機產物 ─── */

/** 性格 → 每秒飼料／靈塵產量（牧場待命） */
export const IDLE_BY_PERSONALITY = {
  gentle: { feed: 0.09, dust: 0.02 },
  steady: { feed: 0.07, dust: 0.035 },
  sly: { feed: 0.045, dust: 0.055 },
  fierce: { feed: 0.03, dust: 0.07 },
  wild: { feed: 0.02, dust: 0.08 },
};

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
  const second = KIND_SECOND_SKILLS[pet.kind];
  if (unlocked && second) ids.push(second);
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
  },
};

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
};

export function rollGearDrop(dungeonId, opts = {}) {
  const table = DUNGEON_GEAR_DROPS[dungeonId];
  if (!table) return null;
  let chance = table.chance || 0;
  if (opts.bossCleared) chance = Math.min(0.95, chance + 0.22);
  else if (opts.eliteCleared) chance = Math.min(0.9, chance + 0.12);
  if (opts.conditionHits > 0) {
    chance = Math.min(0.95, chance + 0.04 * opts.conditionHits);
  }
  if (Math.random() > chance) return null;
  const gearId = pickWeighted(table.weights);
  if (!gearId || !GEAR[gearId]) return null;
  return {
    uid: `gear-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    gearId,
  };
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

/** 融合吸收素材天生數值比例（隨融階升高） */
export function fusionAbsorbRate(targetStage) {
  const n = Math.max(1, Math.min(3, targetStage | 0));
  return 0.18 + n * 0.1; // 階1 28%、階2 38%、階3 48%
}

/* ─── P1：羈絆／陣容加成 ─── */

/**
 * 出戰靈寵同元素／同 kind 觸發 buff
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
  for (const p of list) {
    byEl[p.elementId] = (byEl[p.elementId] || 0) + 1;
    byKind[p.kind] = (byKind[p.kind] || 0) + 1;
  }
  const maxEl = Math.max(...Object.values(byEl));
  const maxKind = Math.max(...Object.values(byKind));

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

  if (list.length >= 3 && maxEl < 2 && maxKind < 2) {
    spdMult *= 1.04;
    labels.push("雜陣靈動（速↑）");
  }

  return { atkMult, hpMult, spdMult, labels };
}

/* ─── P2：圖鑑／放生／每日／成就 ─── */

export function bestiaryKey(speciesId, elementId) {
  return `${speciesId}:${elementId}`;
}

export function bestiaryTotal() {
  return Object.keys(SPECIES).length * Object.keys(ELEMENTS).length;
}

export function bestiaryEntries() {
  const out = [];
  for (const sp of Object.values(SPECIES)) {
    for (const el of Object.values(ELEMENTS)) {
      out.push({
        key: bestiaryKey(sp.id, el.id),
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

/** 每收集 5 格：全隊攻／血 +2%（戰鬥） */
export function bestiaryCombatBonus(discoveredCount) {
  const n = Math.max(0, discoveredCount | 0);
  const tiers = Math.floor(n / 5);
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
    reward: { stones: 30, scrap: 1 },
  },
  {
    id: "bond",
    name: "結契之緣",
    desc: "嘗試契約 1 次（成功或失敗皆可）",
    need: 1,
    reward: { stones: 25, dust: 5 },
  },
];

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
];

export function todayKey(now = Date.now()) {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 離線結算提示門檻（秒） */
export const OFFLINE_HINT_SEC = 90;

/* ─── P3：繁殖目標／配方一覽／秘境試煉 ─── */

/**
 * 繁殖目標
 * cadence: daily | once
 * type: hybrid_species | reach_gen | reach_rarity | hybrid_bestiary | breed_count
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
    type: "hybrid_any",
    need: 1,
    name: "今日雜交",
    desc: "雜交出任意新種族 1 隻",
    reward: { stones: 40, dust: 6 },
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

/** 主配方列表（繁殖頁摘要） */
export function hybridRecipeSummary() {
  return HYBRID_RECIPES.map((r) => ({
    ...r,
    name: SPECIES[r.species]?.name || r.species,
    kindsLabel: `${r.kinds[0]}×${r.kinds[1]}`,
  }));
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
      if (known[bestiaryKey(sp.id, el)]) n += 1;
    }
  }
  return n;
}
