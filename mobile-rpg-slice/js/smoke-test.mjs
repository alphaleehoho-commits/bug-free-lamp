/**
 * Smoke: encounter roll, pending bond, ranch cap, fusion cost curve.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
  ranchCapForStage,
  upgradeStoneCost,
  fusionStoneCost,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const enc = rollWildEncounter("tide_1");
assert(enc.encounterId && enc.bondRate > 0 && enc.bondRate < 1, "encounter fields");
assert(enc.skillId && SKILLS[enc.skillId], "encounter skill");
assert(enc.level === 1 && enc.fusionLevel === 0, "encounter level/fusion defaults");
assert(PENDING_BOND_MAX === 5, "pending max");
assert(ACTIVE_PET_MAX === 3, "active pet max");
assert(Object.keys(SPECIES).length >= 5, "species");

const pet = buildPetStats({
  id: "t",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 40,
});
assert(pet.name.includes("礁狐"), "name");
assert(pet.level === 1 && pet.fusionLevel === 0, "buildPetStats level/fusion");

// ranchCap: 初契 3 → 通靈初 5 → … → 潮主 13
assert(ranchCapForStage(0) === 3, "ranch cap stage 0");
assert(ranchCapForStage(1) === 5, "ranch cap stage 1");
assert(ranchCapForStage(5) === 13, "ranch cap stage 5");

// upgrade cost curve
assert(upgradeStoneCost(1) === 10 + 12 + 2, "upgrade lv1");
assert(upgradeStoneCost(2) === 10 + 24 + 8, "upgrade lv2");
assert(upgradeStoneCost(3) > upgradeStoneCost(2), "upgrade increases");

// fusion cost: n=1→40, 2→120, 3→240…
assert(fusionStoneCost(1) === 40, "fusion n=1");
assert(fusionStoneCost(2) === 120, "fusion n=2");
assert(fusionStoneCost(3) === 240, "fusion n=3");
assert(fusionStoneCost(4) === 400, "fusion n=4");
assert(fusionStoneCost(3) > fusionStoneCost(2), "fusion increases");

console.log("encounter sample:", enc.name, `bond ${(enc.bondRate * 100) | 0}%`);
console.log("ranchCap 0/5:", ranchCapForStage(0), ranchCapForStage(5));
console.log("fusion costs:", [1, 2, 3, 4].map(fusionStoneCost).join(", "));
console.log("smoke-test ok");
