/**
 * Smoke: P2 bestiary, daily, release, offline constants.
 */
import {
  buildPetStats,
  SPECIES,
  ELEMENTS,
  GEAR,
  MASTER_EQUIP_SLOTS,
  bestiaryKey,
  bestiaryTotal,
  bestiaryEntries,
  bestiaryCombatBonus,
  releaseRefund,
  DAILY_QUESTS,
  ACHIEVEMENTS,
  todayKey,
  OFFLINE_HINT_SEC,
  NICK_MAX_LEN,
  partySynergy,
  fusionAbsorbRate,
  breedStatInheritance,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(bestiaryTotal() === Object.keys(SPECIES).length * Object.keys(ELEMENTS).length, "total");
assert(bestiaryEntries().length === bestiaryTotal(), "entries");
assert(bestiaryKey("reefox", "tide") === "reefox:tide", "key");
const b10 = bestiaryCombatBonus(10);
assert(b10.tiers === 2 && b10.atkMult === 1.04, "dex bonus");
assert(DAILY_QUESTS.length === 3, "daily");
assert(ACHIEVEMENTS.length >= 5, "ach");
assert(todayKey().length === 10, "date");
assert(OFFLINE_HINT_SEC >= 60, "offline");
assert(NICK_MAX_LEN >= 4, "nick");
assert(MASTER_EQUIP_SLOTS.length === 3 && GEAR.tide_blade, "gear");

const pet = buildPetStats({
  id: "t",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 1,
});
pet.level = 5;
pet.fusionLevel = 1;
const ref = releaseRefund(pet);
assert(ref.stones > 0 && ref.feed > 0, "refund");

const grown = { ...pet, atk: pet.atk + 20, hp: pet.hp + 40 };
const born = breedStatInheritance(grown, grown, {});
assert(born.atk > 0 || born.hp > 0, "inherit");
assert(fusionAbsorbRate(2) > fusionAbsorbRate(1), "absorb");
assert(partySynergy([{ elementId: "tide", kind: "獸" }, { elementId: "tide", kind: "鱗" }]).atkMult > 1, "syn");

console.log("bestiary", bestiaryTotal(), "refund", ref);
console.log("smoke-test ok");
