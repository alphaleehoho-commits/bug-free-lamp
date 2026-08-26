/**
 * Smoke: P1 ranch idle, gear, skills, synergy.
 */
import {
  rollWildEncounter,
  PENDING_BOND_MAX,
  SPECIES,
  buildPetStats,
  SKILLS,
  GEAR,
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
assert(SKILLS.pack_howl && SKILLS.swarm_haze, "second skills");
assert(GEAR.tide_blade && GEAR.mist_charm, "gear");
assert(IDLE_BY_PERSONALITY.gentle.feed > 0, "idle feed");
assert(BOND_FEED_COST > 0, "bond feed");
assert(upgradeFeedCost(1) > 0, "feed upgrade");
assert(skillDustCost(1) > 0, "dust skill");
assert(skillPowerMult(3) > skillPowerMult(1), "skill power");
assert(gearBonuses(["tide_blade"]).atk === 4, "gear bonus");

const sameEl = [
  { ...a, elementId: "tide", kind: "獸" },
  { ...a, elementId: "tide", kind: "鱗", name: "b" },
  { ...a, elementId: "tide", kind: "禽", name: "c" },
];
const syn = partySynergy(sameEl);
assert(syn.atkMult > 1 && syn.labels.some((l) => l.includes("三元")), "3-element synergy");

const fused = { ...a, fusionLevel: 1, level: 5, kind: "獸", skillId: "pounce" };
assert(petSkillIds(fused).includes(KIND_SECOND_SKILLS["獸"]), "second skill unlock fuse");
const leveled = { ...a, fusionLevel: 0, level: 15, kind: "蟲", skillId: "venom_bite" };
assert(petSkillIds(leveled).includes("swarm_haze"), "second skill unlock lv");

let drops = 0;
for (let i = 0; i < 80; i++) {
  if (rollGearDrop("tide_3")) drops += 1;
}
assert(drops > 0, "gear drops sometimes");

console.log("synergy", syn);
console.log("smoke-test ok");
