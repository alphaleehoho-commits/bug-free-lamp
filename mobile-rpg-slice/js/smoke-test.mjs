/**
 * Node smoke test for combat/cultivation math (no DOM).
 * Run: node --input-type=module js/smoke-test.mjs
 */
import { REALMS, DUNGEONS, RECRUIT_POOL } from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(REALMS.length >= 4, "realms");
assert(DUNGEONS.every((d) => d.enemies.length > 0), "dungeons");
assert(RECRUIT_POOL.length >= 3, "recruit pool");

// Mini combat simulation mirroring engine.js
function fight(party, enemies) {
  const allies = party.map((p) => ({ ...p, side: "ally", hp: p.hp }));
  const foes = enemies.map((e) => ({ ...e, side: "foe", hp: e.hp }));
  for (let r = 0; r < 40; r++) {
    const order = [...allies, ...foes].filter((u) => u.hp > 0).sort((a, b) => b.spd - a.spd);
    for (const actor of order) {
      if (actor.hp <= 0) continue;
      const targets = (actor.side === "ally" ? foes : allies).filter((t) => t.hp > 0);
      if (!targets.length) break;
      const target = targets[0];
      target.hp -= Math.max(1, actor.atk);
    }
    if (foes.every((f) => f.hp <= 0)) return true;
    if (allies.every((a) => a.hp <= 0)) return false;
  }
  return false;
}

const party = RECRUIT_POOL.slice(0, 3).map((p) => ({ ...p, atk: p.atk + 6 }));
const won = fight(party, DUNGEONS[0].enemies);
assert(won === true, "tier-1 dungeon should be winnable with 3 boosted recruits");

console.log("smoke-test ok");
