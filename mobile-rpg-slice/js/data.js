/** Data tables — 靈寵修行 vertical slice */

/** 御靈師自身階段（掛機升級） */
export const STAGES = [
  { id: 0, name: "初契", need: 0, rate: 2.5 },
  { id: 1, name: "通靈初期", need: 40, rate: 3.2 },
  { id: 2, name: "通靈後期", need: 120, rate: 4.2 },
  { id: 3, name: "御靈", need: 320, rate: 5.5 },
  { id: 4, name: "靈主", need: 800, rate: 7 },
  { id: 5, name: "潮主", need: 1800, rate: 9 },
];

/** @deprecated alias */
export const REALMS = STAGES;

/** 元素：影響攻／血／速微調 */
export const ELEMENTS = {
  tide: { id: "tide", name: "潮", atk: 1.05, hp: 1.0, spd: 1.05 },
  stone: { id: "stone", name: "岩", atk: 1.0, hp: 1.12, spd: 0.92 },
  flame: { id: "flame", name: "焰", atk: 1.12, hp: 0.94, spd: 1.0 },
  gale: { id: "gale", name: "嵐", atk: 1.0, hp: 0.95, spd: 1.15 },
  gloom: { id: "gloom", name: "幽", atk: 1.08, hp: 1.0, spd: 1.0 },
};

/** 種類／種族骨架（後期繁殖會繼承） */
export const SPECIES = {
  reefox: { id: "reefox", name: "礁狐", kind: "獸", base: { atk: 13, hp: 85, spd: 11 } },
  tidecarp: { id: "tidecarp", name: "潮鯉", kind: "鱗", base: { atk: 10, hp: 110, spd: 8 } },
  ashwing: { id: "ashwing", name: "灰翼", kind: "禽", base: { atk: 12, hp: 78, spd: 14 } },
  mossback: { id: "mossback", name: "苔背", kind: "甲", base: { atk: 9, hp: 140, spd: 5 } },
  nightmoth: { id: "nightmoth", name: "夜蛾", kind: "蟲", base: { atk: 15, hp: 70, spd: 12 } },
  glowfin: { id: "glowfin", name: "熒鰭", kind: "鱗", base: { atk: 11, hp: 95, spd: 10 } },
};

/** 性格：獨立數值加減成 */
export const PERSONALITIES = {
  fierce: { id: "fierce", name: "烈性", atk: 1.15, hp: 0.92, spd: 1.05 },
  steady: { id: "steady", name: "沉穩", atk: 0.95, hp: 1.18, spd: 0.9 },
  sly: { id: "sly", name: "狡黠", atk: 1.08, hp: 0.95, spd: 1.12 },
  gentle: { id: "gentle", name: "溫馴", atk: 0.9, hp: 1.1, spd: 1.0 },
  wild: { id: "wild", name: "狂放", atk: 1.2, hp: 0.88, spd: 1.08 },
};

/**
 * 野外可契約靈寵模板。
 * 每隻有獨立 species / element / personality；實例化時算出最終數值。
 */
export const WILD_PETS = [
  { id: "p_reefox_tide", species: "reefox", element: "tide", personality: "sly", cost: 40 },
  { id: "p_moss_stone", species: "mossback", element: "stone", personality: "steady", cost: 45 },
  { id: "p_ash_gale", species: "ashwing", element: "gale", personality: "fierce", cost: 42 },
  { id: "p_carp_tide", species: "tidecarp", element: "tide", personality: "gentle", cost: 48 },
  { id: "p_moth_gloom", species: "nightmoth", element: "gloom", personality: "wild", cost: 58 },
  { id: "p_fin_flame", species: "glowfin", element: "flame", personality: "fierce", cost: 52 },
];

/** @deprecated — 舊門徒池；保留空陣列以免舊 import 爆 */
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

/** 由模板算出最終戰鬥數值（種類 × 元素 × 性格） */
export function buildPetStats(template) {
  const sp = SPECIES[template.species];
  const el = ELEMENTS[template.element];
  const pe = PERSONALITIES[template.personality];
  if (!sp || !el || !pe) throw new Error("invalid pet template");
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
    // 後期繁殖用：基因位預留
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
