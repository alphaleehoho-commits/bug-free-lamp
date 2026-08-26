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
 * 種類（kind）：獸／鱗／禽／甲／蟲
 * 每種綁一隻種族技能；種族另有獨立基礎數值。
 */
export const KIND_SKILLS = {
  獸: "pounce",
  鱗: "tide_spray",
  禽: "gale_dive",
  甲: "shell_guard",
  蟲: "venom_bite",
};

export const SPECIES = {
  reefox: { id: "reefox", name: "礁狐", kind: "獸", base: { atk: 13, hp: 85, spd: 11 } },
  tidecarp: { id: "tidecarp", name: "潮鯉", kind: "鱗", base: { atk: 10, hp: 110, spd: 8 } },
  ashwing: { id: "ashwing", name: "灰翼", kind: "禽", base: { atk: 12, hp: 78, spd: 14 } },
  mossback: { id: "mossback", name: "苔背", kind: "甲", base: { atk: 9, hp: 140, spd: 5 } },
  nightmoth: { id: "nightmoth", name: "夜蛾", kind: "蟲", base: { atk: 15, hp: 70, spd: 12 } },
  glowfin: { id: "glowfin", name: "熒鰭", kind: "鱗", base: { atk: 11, hp: 95, spd: 10 } },
};

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

/** 繁殖：靈石消耗、冷卻、元素變異率 */
export const BREED_STONE_COST = 55;
export const BREED_COOLDOWN_MS = 45_000;
export const BREED_MUTATION_RATE = 0.08;

/**
 * 由雙親 genes 生成子代模板（種族／元素／性格各 50% 遺傳；元素可變異）
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
  let species = Math.random() < 0.5 ? ga.species : gb.species;
  let element = Math.random() < 0.5 ? ga.element : gb.element;
  let personality = Math.random() < 0.5 ? ga.personality : gb.personality;
  let mutated = false;
  if (Math.random() < BREED_MUTATION_RATE) {
    const others = Object.keys(ELEMENTS).filter((e) => e !== element);
    element = pick(others);
    mutated = true;
  }
  return { species, element, personality, mutated };
}

/** 秘境隨機生成一隻野生靈寵；可帶分層權重 */
export function rollWildEncounter(dungeonId = "wild", dungeonDef = null) {
  const weights = dungeonDef?.encounterWeights;
  const speciesId = weights
    ? pickWeighted(weights) || pick(Object.keys(SPECIES))
    : pick(Object.keys(SPECIES));
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
    enemies: [
      { name: "潮腐鼠", hp: 40, atk: 6, spd: 7, element: "tide" },
      { name: "暗礁妖", hp: 55, atk: 8, spd: 5, element: "stone" },
    ],
    reward: { stones: 25, scrap: 1 },
    firstClearBonus: { stones: 40, scrap: 1 },
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
    enemies: [
      { name: "黑潮衛", hp: 80, atk: 12, spd: 8, element: "tide" },
      { name: "深淵蛙", hp: 70, atk: 10, spd: 10, element: "gloom" },
      { name: "暗潮使徒", hp: 110, atk: 15, spd: 7, element: "gloom" },
    ],
    reward: { stones: 55, scrap: 2 },
    firstClearBonus: { stones: 80, scrap: 2 },
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
    enemies: [
      { name: "暗潮之影", hp: 160, atk: 18, spd: 9, element: "gloom" },
      { name: "心核看守", hp: 200, atk: 22, spd: 6, element: "stone" },
    ],
    reward: { stones: 120, scrap: 4 },
    firstClearBonus: { stones: 150, scrap: 3 },
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
  const skillId = KIND_SKILLS[sp.kind];
  const atk = Math.round(sp.base.atk * el.atk * pe.atk);
  const hp = Math.round(sp.base.hp * el.hp * pe.hp);
  const spd = Math.round(sp.base.spd * el.spd * pe.spd);
  return {
    templateId: template.id,
    speciesId: sp.id,
    speciesName: sp.name,
    kind: sp.kind,
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
    genes: {
      species: sp.id,
      element: el.id,
      personality: pe.id,
    },
  };
}

export function petLabel(pet) {
  return `${pet.name}（${pet.kind}·${pet.elementName}·${pet.personalityName}）`;
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

export function rollGearDrop(dungeonId) {
  const table = DUNGEON_GEAR_DROPS[dungeonId];
  if (!table || Math.random() > table.chance) return null;
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
  if (Math.random() < BREED_MUTATION_STAT_RATE) {
    atk += 1 + Math.floor(Math.random() * 3);
    hp += 2 + Math.floor(Math.random() * 6);
    spd += Math.floor(Math.random() * 2);
  }
  // 子代自身基準已由 buildPetStats 算好；這裡只回傳額外天生加成
  void childGenes;
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
