/** Game content tables — data-driven like OpenIdle / Nine Heavens */
export const REALMS = [
  { id: 0, name: "凡人", need: 0, rate: 2.5 },
  { id: 1, name: "煉氣初期", need: 40, rate: 3.2 },
  { id: 2, name: "煉氣後期", need: 120, rate: 4.2 },
  { id: 3, name: "築基", need: 320, rate: 5.5 },
  { id: 4, name: "金丹", need: 800, rate: 7 },
  { id: 5, name: "元嬰", need: 1800, rate: 9 },
];

export const RECRUIT_POOL = [
  { id: "blade", name: "斷刃", role: "攻", atk: 14, hp: 90, spd: 8, cost: 40 },
  { id: "ward", name: "玄盾", role: "防", atk: 8, hp: 140, spd: 5, cost: 45 },
  { id: "swift", name: "流光", role: "速", atk: 11, hp: 75, spd: 14, cost: 42 },
  { id: "alchem", name: "丹煙", role: "輔", atk: 9, hp: 100, spd: 9, cost: 50 },
  { id: "shadow", name: "夜煞", role: "攻", atk: 16, hp: 70, spd: 11, cost: 60 },
];

export const DUNGEONS = [
  {
    id: "tide_1",
    name: "潮汐廢墟 · 一層",
    needRealm: 0,
    enemies: [
      { name: "潮腐鼠", hp: 40, atk: 6, spd: 7 },
      { name: "暗礁妖", hp: 55, atk: 8, spd: 5 },
    ],
    reward: { stones: 25, scrap: 1 },
  },
  {
    id: "tide_2",
    name: "潮汐廢墟 · 二層",
    needRealm: 2,
    enemies: [
      { name: "黑潮衛", hp: 80, atk: 12, spd: 8 },
      { name: "深淵蛙", hp: 70, atk: 10, spd: 10 },
      { name: "暗潮使徒", hp: 110, atk: 15, spd: 7 },
    ],
    reward: { stones: 55, scrap: 2 },
  },
  {
    id: "tide_3",
    name: "潮汐廢墟 · 心核",
    needRealm: 3,
    enemies: [
      { name: "暗潮之影", hp: 160, atk: 18, spd: 9 },
      { name: "心核看守", hp: 200, atk: 22, spd: 6 },
    ],
    reward: { stones: 120, scrap: 4 },
  },
];

export const EVENTS = [
  "夜雨叩門，一枚無名玉簡落在案上。",
  "丹爐輕鳴，爐中靈氣凝成一縷金煙。",
  "遠處潮聲忽然停歇——像有什麼在聽你。",
  "門徒帶回半枚斷劍，劍身刻著「勿渡」。",
  "你於靜室中見自己倒影眨眼，然後消失。",
];
