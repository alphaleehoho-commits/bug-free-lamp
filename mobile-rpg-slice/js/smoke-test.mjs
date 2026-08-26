/**
 * Smoke: hybrid breed + rarity mutation system.
 */
import {
  buildPetStats,
  SPECIES,
  ELEMENTS,
  bestiaryTotal,
  wildSpeciesIds,
  rollBreedGenes,
  rollBreedRarity,
  rarityInfo,
  HYBRID_RECIPES,
  RARITY_MAX,
  breedStatInheritance,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(wildSpeciesIds().length === 6, "wild 6");
assert(Object.values(SPECIES).filter((s) => s.breedOnly).length === 6, "6 hybrids");
assert(bestiaryTotal() === 12 * Object.keys(ELEMENTS).length, "dex 60");
assert(HYBRID_RECIPES.some((r) => r.species === "tideling"), "recipe");
assert(rarityInfo(3).mult === 1.5, "legend mult");

const fox = buildPetStats({
  id: "a",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 1,
  rarity: 0,
});
const carp = buildPetStats({
  id: "b",
  species: "tidecarp",
  element: "flame",
  personality: "fierce",
  cost: 1,
  rarity: 1,
});
assert(fox.rarity === 0 && carp.rarityName === "稀有", "rarity fields");

let hybridHits = 0;
let rarityHits = 0;
for (let i = 0; i < 80; i++) {
  const g = rollBreedGenes(fox, carp);
  if (g.hybrid && g.species === "tideling") hybridHits += 1;
  if (g.rarity > 0) rarityHits += 1;
}
assert(hybridHits > 0, "hybrid sometimes (獸+鱗→潮獸)");
assert(rarityHits > 0, "rarity sometimes");

const same = rollBreedGenes(fox, { ...fox, uid: "x" });
assert(typeof same.rarity === "number" && same.rarity <= RARITY_MAX, "same species rarity");

const rareFox = { ...fox, rarity: 2, atk: fox.atk + 30, hp: fox.hp + 50 };
const born = breedStatInheritance(rareFox, carp, { rarity: 2, hybrid: true });
assert(born.atk >= 2, "inherit boosted");

const r = rollBreedRarity(rareFox, carp, { sameSpecies: false, hybrid: true });
assert(r >= 0 && r <= 3, "roll rarity");

console.log("hybrid hits/80", hybridHits, "rarity hits", rarityHits);
console.log("smoke-test ok");
