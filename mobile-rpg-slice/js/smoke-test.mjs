/**
 * Smoke: encounter, ranch cap, fusion rules 2/4/8 + level gates.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
  ranchCapForStage,
  fusionStoneCost,
  fusionMaterialNeed,
  nextFusionStage,
  FUSION_RULES,
  FUSION_MAX_STAGE,
  upgradeStoneCost,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const enc = rollWildEncounter("tide_1");
assert(enc.encounterId && enc.bondRate > 0 && enc.bondRate < 1, "encounter fields");
assert(enc.skillId && SKILLS[enc.skillId], "encounter skill");
assert(enc.level === 1 && enc.fusionLevel === 0, "encounter level/fusion defaults");
assert(PENDING_BOND_MAX === 5, "pending max");
assert(Object.keys(SPECIES).length >= 5, "species");

assert(ranchCapForStage(0) === 3, "ranch cap stage0");
assert(ranchCapForStage(5) === 13, "ranch cap stage5");

assert(FUSION_MAX_STAGE === 3, "max fusion 3");
assert(FUSION_RULES[1].needLevel === 10 && FUSION_RULES[1].totalPets === 2, "fuse1");
assert(FUSION_RULES[2].needLevel === 20 && FUSION_RULES[2].totalPets === 4, "fuse2");
assert(FUSION_RULES[3].needLevel === 30 && FUSION_RULES[3].totalPets === 8, "fuse3");
assert(fusionMaterialNeed(1) === 1, "mats1");
assert(fusionMaterialNeed(2) === 3, "mats2");
assert(fusionMaterialNeed(3) === 7, "mats3");
assert(nextFusionStage(0) === 1 && nextFusionStage(3) == null, "next stage");
assert(fusionStoneCost(1) === 40, "cost1");
assert(fusionStoneCost(2) === 240, "cost2");
assert(fusionStoneCost(3) === 960, "cost3");
assert(fusionStoneCost(2) > fusionStoneCost(1), "cost increases");

// 升級成本獨立遞增
assert(upgradeStoneCost(1) < upgradeStoneCost(10), "upgrade independent curve");

const pet = buildPetStats({
  id: "t",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 40,
});
assert(pet.name.includes("礁狐"), "name");
assert(pet.level === 1 && pet.fusionLevel === 0, "buildPetStats level/fusion");

console.log("encounter sample:", enc.name, `bond ${(enc.bondRate * 100) | 0}%`);
console.log("fusion:", "2/4/8 pets, Lv gate 10/20/30, costs", [1, 2, 3].map(fusionStoneCost).join("/"));
console.log("smoke-test ok");
