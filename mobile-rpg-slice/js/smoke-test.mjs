/**
 * Smoke: encounter roll, pending bond, dungeon without pets.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const enc = rollWildEncounter("tide_1");
assert(enc.encounterId && enc.bondRate > 0 && enc.bondRate < 1, "encounter fields");
assert(enc.skillId && SKILLS[enc.skillId], "encounter skill");
assert(PENDING_BOND_MAX === 5, "pending max");
assert(Object.keys(SPECIES).length >= 5, "species");

const pet = buildPetStats({
  id: "t",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 40,
});
assert(pet.name.includes("礁狐"), "name");

console.log("encounter sample:", enc.name, `bond ${(enc.bondRate * 100) | 0}%`);
console.log("smoke-test ok");
