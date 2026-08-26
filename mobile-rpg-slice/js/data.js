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

/** 升級耗靈石（遞增） */
export function upgradeStoneCost(level) {
  const lv = Math.max(1, level | 0);
  return 10 + lv * 12 + lv * lv * 2;
}

/**
 * 融合結果等級 n 所需靈石（三角遞增）：n=1→40, 2→120, 3→240…
 * 「所需合成」體感：越融越貴
 */
export function fusionStoneCost(resultFusionLevel) {
  const n = Math.max(1, resultFusionLevel | 0);
  return 20 * n * (n + 1);
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

/** 秘境隨機生成一隻野生靈寵（種類×元素×性格） */
export function rollWildEncounter(dungeonId = "wild") {
  const speciesId = pick(Object.keys(SPECIES));
  const elementId = pick(Object.keys(ELEMENTS));
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

export const DUNGEONS = [
  {
    id: "tide_1",
    name: "潮汐廢墟 · 一層",
    needRealm: 0,
    enemies: [
      { name: "潮腐鼠", hp: 40, atk: 6, spd: 7, element: "tide" },
      { name: "暗礁妖", hp: 55, atk: 8, spd: 5, element: "stone" },
    ],
    reward: { stones: 25, scrap: 1 },
  },
  {
    id: "tide_2",
    name: "潮汐廢墟 · 二層",
    needRealm: 2,
    enemies: [
      { name: "黑潮衛", hp: 80, atk: 12, spd: 8, element: "tide" },
      { name: "深淵蛙", hp: 70, atk: 10, spd: 10, element: "gloom" },
      { name: "暗潮使徒", hp: 110, atk: 15, spd: 7, element: "gloom" },
    ],
    reward: { stones: 55, scrap: 2 },
  },
  {
    id: "tide_3",
    name: "潮汐廢墟 · 心核",
    needRealm: 3,
    enemies: [
      { name: "暗潮之影", hp: 160, atk: 18, spd: 9, element: "gloom" },
      { name: "心核看守", hp: 200, atk: 22, spd: 6, element: "stone" },
    ],
    reward: { stones: 120, scrap: 4 },
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
