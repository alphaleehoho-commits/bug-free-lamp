/**
 * Smoke: breed genes, element matchup, dungeon tables.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
  ranchCapForStage,
  fusionStoneCost,
  FUSION_RULES,
  elementMatchup,
  rollBreedGenes,
  BREED_STONE_COST,
  DUNGEONS,
  ELEMENT_ADV,
  ELEMENT_DIS,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(elementMatchup("tide", "flame").tag === "克制", "tide > flame");
assert(elementMatchup("tide", "flame").mult === ELEMENT_ADV, "adv mult");
assert(elementMatchup("flame", "tide").tag === "被克", "flame < tide");
assert(elementMatchup("flame", "tide").mult === ELEMENT_DIS, "dis mult");
assert(elementMatchup("tide", "tide").mult === 1, "same elem");

const a = buildPetStats({
  id: "a",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 1,
});
const b = buildPetStats({
  id: "b",
  species: "ashwing",
  element: "gale",
  personality: "fierce",
  cost: 1,
});
const g = rollBreedGenes(a, b);
assert(SPECIES[g.species], "breed species");
assert(g.element && g.personality, "breed genes");
assert(BREED_STONE_COST > 0, "breed cost");

for (const d of DUNGEONS) {
  assert(d.encounterWeights && d.firstClearBonus && d.cooldownMs > 0, `dungeon ${d.id} tables`);
  const enc = rollWildEncounter(d.id, d);
  assert(enc.speciesId && enc.elementId, `weighted enc ${d.id}`);
}

assert(PENDING_BOND_MAX === 5, "pending");
assert(ranchCapForStage(0) === 3, "ranch");
assert(FUSION_RULES[1].totalPets === 2, "fuse");
assert(fusionStoneCost(1) === 40, "fuse cost");
assert(SKILLS.pounce, "skills");

console.log("element tide→flame", elementMatchup("tide", "flame"));
console.log("breed sample", g);
console.log("smoke-test ok");
