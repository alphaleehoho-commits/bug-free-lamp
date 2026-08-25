/**
 * Smoke test for pet stats + combat.
 * Run: node js/smoke-test.mjs
 */
import { WILD_PETS, DUNGEONS, buildPetStats, ELEMENTS, PERSONALITIES, SPECIES } from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(Object.keys(SPECIES).length >= 5, "species");
assert(Object.keys(ELEMENTS).length >= 5, "elements");
assert(Object.keys(PERSONALITIES).length >= 5, "personalities");

const pets = WILD_PETS.slice(0, 3).map(buildPetStats);
assert(pets.every((p) => p.atk > 0 && p.hp > 0 && p.spd > 0 && p.genes), "pet build");

// 性格應改變數值：烈性礁狐 vs 溫馴同種需不同（用 glowfin flame fierce vs gentle 比對）
const fierce = buildPetStats({
  id: "t1",
  species: "glowfin",
  element: "flame",
  personality: "fierce",
  cost: 1,
});
const gentle = buildPetStats({
  id: "t2",
  species: "glowfin",
  element: "flame",
  personality: "gentle",
  cost: 1,
});
assert(fierce.atk > gentle.atk, "personality should boost atk for fierce");

function fight(allies, enemies) {
  const a = allies.map((p) => ({ ...p, side: "ally", hp: p.hp }));
  const f = enemies.map((e) => ({ ...e, side: "foe", hp: e.hp }));
  for (let r = 0; r < 40; r++) {
    const order = [...a, ...f].filter((u) => u.hp > 0).sort((x, y) => y.spd - x.spd);
    for (const actor of order) {
      if (actor.hp <= 0) continue;
      const targets = (actor.side === "ally" ? f : a).filter((t) => t.hp > 0);
      if (!targets.length) break;
      targets[0].hp -= Math.max(1, actor.atk);
    }
    if (f.every((x) => x.hp <= 0)) return true;
    if (a.every((x) => x.hp <= 0)) return false;
  }
  return false;
}

const party = [
  { name: "潮行者", atk: 14, hp: 130, spd: 10 },
  ...pets.map((p) => ({ name: p.name, atk: p.atk + 4, hp: p.hp, spd: p.spd })),
];
assert(fight(party, DUNGEONS[0].enemies) === true, "floor1 winnable with master+3 pets");

console.log("smoke-test ok", pets.map((p) => p.name).join(", "));
