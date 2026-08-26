/**
 * Smoke: master gear focus, pet innate via fuse/breed.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
  GEAR,
  MASTER_EQUIP_SLOTS,
  ranchCapForStage,
  fusionStoneCost,
  FUSION_RULES,
  elementMatchup,
  rollBreedGenes,
  BREED_STONE_COST,
  DUNGEONS,
  ELEMENT_ADV,
  ELEMENT_DIS,
  partySynergy,
  petSkillIds,
  skillPowerMult,
  upgradeFeedCost,
  skillDustCost,
  BOND_FEED_COST,
  rollGearDrop,
  gearBonuses,
  KIND_SECOND_SKILLS,
  IDLE_BY_PERSONALITY,
  fusionAbsorbRate,
  breedStatInheritance,
  petSpeciesBaseline,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(elementMatchup("tide", "flame").mult === ELEMENT_ADV, "adv");
assert(elementMatchup("flame", "tide").mult === ELEMENT_DIS, "dis");

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
a.atk += 20;
a.hp += 40;
b.atk += 10;
b.hp += 20;
const born = breedStatInheritance(a, b, { species: "reefox", element: "tide", personality: "gentle" });
assert(born.atk > 0 || born.hp > 0, "breed inherit excess");

assert(MASTER_EQUIP_SLOTS.length === 3, "3 master slots");
assert(GEAR.tide_blade && GEAR.moss_vest && GEAR.mist_charm, "master gear set");
assert(!GEAR.ash_feather && !GEAR.core_crown, "pet gear removed");
assert(gearBonuses(["tide_blade", "moss_vest"]).atk === 8, "blade atk");
assert(gearBonuses(["tide_blade", "moss_vest"]).hp === 35, "vest hp");
assert(fusionAbsorbRate(1) > 0.2, "fuse absorb");
assert(fusionAbsorbRate(3) > fusionAbsorbRate(1), "fuse absorb scales");

const base = petSpeciesBaseline("reefox", "tide", "gentle");
assert(base.atk === a.atk - 20, "baseline");

for (const d of DUNGEONS) {
  assert(d.encounterWeights && d.firstClearBonus, `dungeon ${d.id}`);
  const enc = rollWildEncounter(d.id, d);
  assert(enc.speciesId, `enc ${d.id}`);
}

assert(PENDING_BOND_MAX === 5, "pending");
assert(ranchCapForStage(0) === 3, "ranch");
assert(FUSION_RULES[1].totalPets === 2, "fuse");
assert(fusionStoneCost(1) === 40, "fuse cost");
assert(SKILLS.pack_howl, "second skills");
assert(IDLE_BY_PERSONALITY.gentle.feed > 0, "idle");
assert(BOND_FEED_COST > 0 && upgradeFeedCost(1) > 0 && skillDustCost(1) > 0, "costs");
assert(skillPowerMult(3) > 1, "skill power");
assert(BREED_STONE_COST > 0 && SPECIES[rollBreedGenes(a, b).species], "breed");

const fused = { ...a, fusionLevel: 1, level: 5, kind: "獸", skillId: "pounce" };
assert(petSkillIds(fused).includes(KIND_SECOND_SKILLS["獸"]), "2nd skill");

const syn = partySynergy([
  { elementId: "tide", kind: "獸" },
  { elementId: "tide", kind: "鱗" },
  { elementId: "tide", kind: "禽" },
]);
assert(syn.atkMult > 1, "synergy");

let drops = 0;
for (let i = 0; i < 60; i++) if (rollGearDrop("tide_3")) drops += 1;
assert(drops > 0, "gear drops");

console.log("inherit sample", born);
console.log("smoke-test ok");
