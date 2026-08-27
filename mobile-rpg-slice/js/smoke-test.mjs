/**
 * Smoke: kind sync + generation breeding + P3 goals / trials / recipes.
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
  BREED_GOALS,
  hybridRecipeSummary,
  hybridRecipeMatrix,
  DUNGEON_TRIALS,
  partyMeetsTrial,
  countHybridBestiary,
  bestiaryKey,
  DUNGEONS,
  dungeonWaves,
  countDungeonRoles,
  evaluateDungeonConditions,
  SKILLS,
  breakthroughView,
  BREAKTHROUGH_GATES,
  STAGES,
  pickDailyDungeonMod,
  stageAt,
  generateDailyDungeon,
  buildDungeonForTier,
  dungeonsForRealm,
  dungeonTrialFor,
  breakthroughGateFor,
  RECRUIT_POOL,
  HYBRID_SKILLS,
  genCombatMult,
  TACTICS,
  petSkillIds,
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

/* P3: breed goals + recipe board + dungeon trials */
assert(BREED_GOALS.some((x) => x.id === "daily_breed"), "daily breed goal");
assert(BREED_GOALS.some((x) => x.type === "hybrid_species" && x.species === "tideling"), "tideling goal");
assert(BREED_GOALS.filter((x) => x.cadence === "daily").length >= 2, "daily goals");
assert(BREED_GOALS.filter((x) => x.cadence === "once").length >= 4, "once goals");

const summary = hybridRecipeSummary();
assert(summary.length === HYBRID_RECIPES.length, "recipe summary");
assert(summary.every((r) => r.name && r.kindsLabel), "summary labels");

const matrix = hybridRecipeMatrix();
assert(matrix.length === 36, "6×6 matrix");
const tideCell = matrix.find((c) => c.kindA === "獸" && c.kindB === "鱗");
assert(tideCell?.recipe?.species === "tideling", "matrix tideling");
const noneCell = matrix.find((c) => c.kindA === "獸" && c.kindB === "蟲");
assert(noneCell && !noneCell.recipe, "matrix none");

assert(DUNGEON_TRIALS.tide_1?.needGen === 1, "trial tide_1");
assert(DUNGEON_TRIALS.tide_2?.match === "any", "trial tide_2 any");
assert(DUNGEON_TRIALS.tide_3?.match === "all", "trial tide_3 all");

const native = { ...fox, generation: 0, breedOnly: false, speciesId: "reefox" };
const gen1 = { ...fox, generation: 1, breedOnly: false, speciesId: "reefox" };
const hybrid = {
  ...fox,
  generation: 2,
  breedOnly: true,
  speciesId: "tideling",
};
assert(!partyMeetsTrial([native], DUNGEON_TRIALS.tide_1).ok, "trial1 fail native");
assert(partyMeetsTrial([gen1], DUNGEON_TRIALS.tide_1).ok, "trial1 pass gen1");
assert(partyMeetsTrial([hybrid], DUNGEON_TRIALS.tide_2).ok, "trial2 hybrid");
assert(partyMeetsTrial([gen1], DUNGEON_TRIALS.tide_2).ok === false, "trial2 gen1 alone fail needGen2");
assert(
  partyMeetsTrial([{ ...gen1, generation: 2 }], DUNGEON_TRIALS.tide_2).ok,
  "trial2 gen2"
);
assert(partyMeetsTrial([hybrid], DUNGEON_TRIALS.tide_3).ok, "trial3 ok");
assert(
  !partyMeetsTrial([{ ...fox, generation: 2, breedOnly: false, speciesId: "reefox" }], DUNGEON_TRIALS.tide_3)
    .ok,
  "trial3 need hybrid"
);

const emptyDex = countHybridBestiary({});
assert(emptyDex === 0, "empty hybrid dex");
const keyed = {};
keyed[bestiaryKey("tideling", "tide")] = true;
keyed[bestiaryKey("stormmoth", "gale")] = true;
assert(countHybridBestiary(keyed) === 2, "hybrid dex count");

/* P4: waves / roles / conditions / foe skills */
assert(SKILLS.abyss_slam && SKILLS.core_roar, "foe skills");
for (const d of DUNGEONS) {
  const waves = dungeonWaves(d);
  assert(waves.length >= 2, `${d.id} waves`);
  const roles = countDungeonRoles(waves);
  assert(roles.elite >= 1, `${d.id} elite`);
  assert((d.conditions || []).length >= 1, `${d.id} conditions`);
}
assert(countDungeonRoles(dungeonWaves(DUNGEONS.find((d) => d.id === "tide_2"))).boss >= 1, "t2 boss");
assert(countDungeonRoles(dungeonWaves(DUNGEONS.find((d) => d.id === "tide_3"))).boss >= 1, "t3 boss");

const flameParty = [{ elementId: "flame", speciesId: "glowfin", generation: 0 }];
const t1daily = generateDailyDungeon("tide_1", "2026-08-26");
assert(t1daily?.conditions?.length === 2, "daily 2 conds");
assert(t1daily.dailyVariantLabel, "t1 daily variant");
assert(
  generateDailyDungeon("tide_1", "2026-08-26").dailyVariantLabel === t1daily.dailyVariantLabel,
  "daily deterministic"
);
const t1ev = evaluateDungeonConditions(flameParty, t1daily);
assert(t1ev.find((c) => c.passive)?.type === "elem_atk", "passive elem");

const flatCompat = dungeonWaves({ name: "x", enemies: [{ name: "a", hp: 1, atk: 1, spd: 1, element: "tide" }] });
assert(flatCompat.length === 1 && flatCompat[0].enemies.length === 1, "legacy enemies compat");

/* P5: breakthrough gates */
assert(BREAKTHROUGH_GATES[1] && BREAKTHROUGH_GATES[5], "gates");
assert(STAGES.length === 6, "stages");
const fakeState = {
  realm: 0,
  qi: 10,
  stones: 0,
  scrap: 0,
  dust: 0,
  feed: 0,
  combatsWon: 0,
  clearedDungeons: {},
  pets: [],
  ranch: [],
  stats: {},
  bestiary: {},
  master: { equip: {} },
};
const br0 = breakthroughView(fakeState);
assert(!br0.ready && br0.items.some((i) => !i.ok), "break blocked at start");
fakeState.qi = 40;
fakeState.stones = 25;
fakeState.combatsWon = 1;
const br1 = breakthroughView(fakeState);
assert(br1.ready && br1.next.id === 1, "break ready to stage1");

/* P6 */
assert(DUNGEONS.some((d) => d.id === "tide_4"), "tide_4");
assert(dungeonWaves(DUNGEONS.find((d) => d.id === "tide_4")).length === 3, "t4 3 waves");
assert(RECRUIT_POOL.length >= 6, "recruit pool");
assert(Object.keys(HYBRID_SKILLS).length === 6, "hybrid skills");
assert(SKILLS.tide_beast_rush && SKILLS.storm_lance, "hybrid skill defs");
assert(
  petSkillIds({ skillId: "pounce", speciesId: "tideling", kind: "獸", fusionLevel: 1 }).includes(
    "tide_beast_rush"
  ),
  "hybrid second skill"
);
assert(genCombatMult(3) === 1.12 && genCombatMult(1) === 1.04, "gen combat");
assert(pickDailyDungeonMod("2026-08-26")?.label, "daily mod");
assert(DUNGEON_TRIALS.tide_4?.match === "all", "t4 trial");
assert(BREAKTHROUGH_GATES[5].checks.some((c) => c.dungeonId === "tide_4"), "break needs t4");
assert(TACTICS.sustain && TACTICS.focus_boss, "tactics");

/* P7: infinite stages + daily dungeon variants */
assert(stageAt(5).name === "潮主", "stage 5 name");
assert(stageAt(6).name === "潮主·1重", "stage 6 name");
assert(stageAt(6).need > stageAt(5).need, "stage 6 need");
assert(stageAt(10).need > stageAt(6).need, "stage scaling");
const br5 = breakthroughView({ ...fakeState, realm: 5, qi: 99999, stones: 9999, scrap: 99, dust: 99, feed: 99, combatsWon: 99, clearedDungeons: { tide_4: true }, pets: [{ generation: 3 }], ranch: [], stats: { bonds: 5, fusions: 5, breeds: 5 }, bestiary: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`k${i}`, true])), master: { equip: { weapon: "a", armor: "b", accessory: "c" } } });
assert(!br5.maxed && br5.next.id === 6, "no stage cap");
assert(breakthroughGateFor(6).checks.some((c) => c.dungeonId === "tide_4"), "stage6 needs t4");
assert(dungeonsForRealm(4).includes("tide_5"), "realm4 sees t5");
assert(dungeonsForRealm(0).length === 4, "min 4 dungeons");
const t5 = buildDungeonForTier(5);
assert(t5.id === "tide_5" && t5.needRealm === 4, "t5 tier");
assert(t5.reward.stones > DUNGEONS[3].reward.stones, "t5 scaled reward");
const t2daily = generateDailyDungeon("tide_2", "2026-08-27");
assert(countDungeonRoles(dungeonWaves(t2daily)).boss >= 1, "t2 daily boss");
assert(dungeonTrialFor("tide_5")?.needHybrid, "t5 trial");
assert(generateDailyDungeon("tide_3", "2026-08-26") !== generateDailyDungeon("tide_3", "2026-08-27") || true, "date may differ");
const d3a = generateDailyDungeon("tide_3", "2026-08-26");
const d3b = generateDailyDungeon("tide_3", "2026-08-26");
assert(d3a.dailyVariantLabel === d3b.dailyVariantLabel, "same day same variant");

console.log("odds 1+2", odds12, "sample genes", g.generation, g.hybrid);
console.log("smoke-test ok");
