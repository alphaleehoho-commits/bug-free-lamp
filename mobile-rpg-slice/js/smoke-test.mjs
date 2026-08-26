/**
 * Smoke: kind sync + generation breeding rules.
 */
import {
  buildPetStats,
  SPECIES,
  KINDS,
  wildSpeciesIds,
  rollBreedGenes,
  rollChildGeneration,
  childGenerationOdds,
  petGeneration,
  genLabel,
  hybridRecipeForKinds,
  HYBRID_RECIPES,
  KIND_SKILLS,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(KINDS.length === 6, "6 kinds");
assert(wildSpeciesIds().length === 6, "6 wild");
assert(SPECIES.glowfin.kind === "光", "glowfin light");
assert(KIND_SKILLS["光"] === "glow_lance", "light skill");

const kindsOfWild = new Set(wildSpeciesIds().map((id) => SPECIES[id].kind));
assert(kindsOfWild.size === 6, "1:1 wild kind");

assert(hybridRecipeForKinds("獸", "鱗").species === "tideling", "main 獸鱗");
assert(hybridRecipeForKinds("光", "蟲").species === "stormmoth", "main 光蟲→嵐蛾");
assert(hybridRecipeForKinds("獸", "蟲") == null, "no 獸蟲");
assert(hybridRecipeForKinds("鱗", "禽") == null, "no 鱗禽");
assert(HYBRID_RECIPES.filter((r) => r.tier === "main").length >= 5, "mains");
assert(HYBRID_RECIPES.filter((r) => r.tier === "sub").length >= 4, "subs");

assert(rollChildGeneration(0, 0) === 1, "0+0→1");
assert(rollChildGeneration(1, 0) === 1, "1+0→1");
assert(rollChildGeneration(2, 0) === 2, "2+0→2");
assert(rollChildGeneration(3, 3) === 3, "3+3→3");

const odds12 = childGenerationOdds(1, 2);
assert(odds12[0].gen === 1 && odds12[0].pct === 70, "1+2 odds");
assert(genLabel(0) === "原生" && genLabel(2) === "繁殖2代", "labels");

const fox = buildPetStats({
  id: "a",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 1,
});
const fin = buildPetStats({
  id: "b",
  species: "glowfin",
  element: "flame",
  personality: "fierce",
  cost: 1,
});
assert(fin.kind === "光" && fin.skillId === "glow_lance", "fin build");
assert(petGeneration(fox) === 0, "native");

fox.generation = 1;
fin.generation = 1;
let g2 = 0;
for (let i = 0; i < 40; i++) {
  if (rollChildGeneration(1, 1) === 2) g2 += 1;
}
assert(g2 > 5 && g2 < 35, "1+1 roughly 50%");

const g = rollBreedGenes(fox, fin);
assert(g.generation >= 1 && g.generation <= 2, "genes gen");
assert(typeof g.hybridChance === "number", "hybrid chance field");

console.log("odds 1+2", odds12, "sample genes", g.generation, g.hybrid);
console.log("smoke-test ok");
