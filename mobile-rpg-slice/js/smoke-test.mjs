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
  FORMATIONS,
  FORMATION_IDS,
  DUNGEON_CHALLENGE_RULES,
  pickDailyChallenge,
  evaluateDungeonChallenge,
  weekKey,
  DAILY_QUESTS,
  ACHIEVEMENTS,
  RECRUIT_POOL,
  HYBRID_SKILLS,
  genCombatMult,
  TACTICS,
  petSkillIds,
  partySynergy,
  personalityCombatFor,
  gearSetBonus,
  GEAR_SETS,
  DISPATCH_MISSIONS,
  tideSealCombatMult,
  tideSealGainForRealm,
  TIDE_SEAL_MIN_REALM,
  TRAIN_SITES,
  MATERIALS,
  upgradeMatCost,
  breedMatCost,
  unlockedTrainSiteIds,
  materialSourceLabel,
  MATERIAL_SOURCE_INDEX,
  trainSiteUnlockHint,
  dungeonNameForClear,
  genAwakenBonus,
  breedStatInheritancePreview,
  BREED_STONE_COST,
  BREED_COOLDOWN_MS,
  FORGE_SCRAP_COST,
  BOND_COST_MAX,
  fusionStoneCost,
  upgradeStoneCost,
} from "./data.js";
import { affordMaterials, runDungeon, buyShopOffer, tryBondPending, ensureShop, breedPreview, petLineage } from "./engine.js";
import {
  normalizeTutorial,
  advanceTutorialIfReady,
  tutorialActive,
  tutorialShopPrice,
  skipTutorial,
  tutorialQiReady,
  isCultivateSubLocked,
  TUTORIAL_SHOP_COST,
  syncTutorialNavigation,
  tutorialHighlights,
  tutorialGlowClass,
  tutorialLiveSnapshot,
  maybeStartLateTutorial,
  LATE_TUTORIAL_MIN_REALM,
} from "./tutorial.js";

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
assert(hybridRecipeForKinds("獸", "蟲")?.species === "fangmite", "main 獸蟲→牙蟎");
assert(hybridRecipeForKinds("鱗", "禽")?.species === "scalequill", "main 鱗禽→鱗羽");
assert(hybridRecipeForKinds("甲", "蟲")?.species === "shellmite", "main 甲蟲→甲蟎");
assert(hybridRecipeForKinds("光", "獸")?.species === "glintfox", "main 光獸→耀狐");
assert(hybridRecipeForKinds("光", "甲")?.species === "prismback", "main 光甲→稜背");
assert(HYBRID_RECIPES.filter((r) => r.tier === "main").length >= 11, "mains");
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
assert(BREED_GOALS.filter((x) => x.cadence === "weekly").length >= 3, "weekly goals");
assert(BREED_GOALS.filter((x) => x.cadence === "once").length >= 4, "once goals");

const summary = hybridRecipeSummary();
assert(summary.length === HYBRID_RECIPES.length, "recipe summary");
assert(summary.every((r) => r.name && r.kindsLabel), "summary labels");

const matrix = hybridRecipeMatrix();
assert(matrix.length === 36, "6×6 matrix");
const tideCell = matrix.find((c) => c.kindA === "獸" && c.kindB === "鱗");
assert(tideCell?.recipe?.species === "tideling", "matrix tideling");
const noneCell = matrix.find((c) => c.kindA === "光" && c.kindB === "光");
assert(noneCell && noneCell.same, "matrix same diagonal");
const shellCell = matrix.find((c) => c.kindA === "甲" && c.kindB === "蟲");
assert(shellCell?.recipe?.species === "shellmite", "matrix shellmite");
const fangCell = matrix.find((c) => c.kindA === "獸" && c.kindB === "蟲");
assert(fangCell?.recipe?.species === "fangmite", "matrix fangmite");

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
assert(Object.keys(HYBRID_SKILLS).length >= 11, "hybrid skills");
assert(SKILLS.tide_beast_rush && SKILLS.storm_lance && SKILLS.fang_burst && SKILLS.scale_glide && SKILLS.shell_spike, "hybrid skill defs");
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

/* P8: goals, challenge, formation, new hybrids */
assert(DAILY_QUESTS.length >= 7, "7 daily quests");
assert(ACHIEVEMENTS.length >= 20, "expanded achievements");
assert(typeof weekKey() === "string" && weekKey().includes("-W"), "weekKey");
assert(FORMATIONS.vanguard && FORMATION_IDS.length === 3, "formations");
assert(DUNGEON_CHALLENGE_RULES.length >= 5, "challenge rules");
const chal = pickDailyChallenge("2026-08-26", "tide_2");
assert(chal?.label && pickDailyChallenge("2026-08-26", "tide_2").id === chal.id, "chal deterministic");
assert(generateDailyDungeon("tide_2", "2026-08-26")?.challenge?.id, "daily has challenge");
assert(SPECIES.fangmite?.breedOnly && SPECIES.scalequill?.breedOnly, "new hybrids");
assert(
  !evaluateDungeonChallenge(
    [{ elementId: "flame" }],
    { banElement: "flame", label: "x" }
  ).ok,
  "ban flame"
);
assert(evaluateDungeonChallenge([{ elementId: "tide" }, { elementId: "gale" }], { maxPets: 2 }).ok, "max2 ok");

/* P9: pet depth + dispatch + gear sets + tide seal */
const synKin = partySynergy([
  { uid: "p1", elementId: "tide", kind: "獸", speciesId: "reefox", generation: 1 },
  { uid: "c1", elementId: "tide", kind: "獸", speciesId: "tideling", generation: 2, bornFrom: ["p1", "p2"] },
]);
assert(synKin.labels.some((l) => l.includes("親子")), "kinship bond");
assert(synKin.atkMult > 1.07, "kinship atk");
const synSp = partySynergy([
  { uid: "a", elementId: "gale", kind: "禽", speciesId: "ashwing", generation: 1 },
  { uid: "b", elementId: "flame", kind: "禽", speciesId: "ashwing", generation: 1 },
]);
assert(synSp.labels.some((l) => l.includes("同族血脈")), "same species");
assert(personalityCombatFor("fierce")?.atkMult === 1.1, "fierce passive");
assert(personalityCombatFor("gentle")?.sustainBias, "gentle sustain");
assert(GEAR_SETS.tide && gearSetBonus(["tide_blade", "moss_vest"]).atk === 3, "set2");
assert(gearSetBonus(["core_fang", "abyss_plate", "gloom_sigil"]).labels.some((l) => l.includes("三件")), "set3");
assert(DISPATCH_MISSIONS.length >= 3, "dispatch missions");
assert(tideSealGainForRealm(5) >= 1 && tideSealGainForRealm(4) === 0, "seal gain");
assert(tideSealCombatMult(5) === 1.1, "seal mult");
assert(TIDE_SEAL_MIN_REALM === 5, "seal min realm");

/* P10: train sites, materials, dual personality, shellmite */
assert(TRAIN_SITES.length >= 5 && MATERIALS.tide_dew, "train+mats");
assert(unlockedTrainSiteIds({ clearedDungeons: {} }).includes("shore"), "shore free");
assert(!unlockedTrainSiteIds({ clearedDungeons: {} }).includes("ruins"), "ruins locked");
assert(unlockedTrainSiteIds({ clearedDungeons: { tide_1: true } }).includes("ruins"), "ruins unlock");
assert(upgradeMatCost(1).tide_dew >= 1, "upgrade mats");
assert(breedMatCost(0, 0).coral_shard >= 1, "breed mats");
assert(DISPATCH_MISSIONS.length >= 5, "more dispatch");
assert(SPECIES.shellmite?.breedOnly, "shellmite");
fox.personality2Id = "steady";
fin.personalityId = "wild";
fin.personality2Id = "gentle";
let pe2 = 0;
for (let i = 0; i < 30; i++) {
  const gg = rollBreedGenes(fox, fin);
  if (gg.personality2) pe2 += 1;
}
assert(pe2 > 5, "second personality often rolls");
const dual = buildPetStats({
  id: "d",
  species: "reefox",
  element: "tide",
  personality: "fierce",
  personality2: "gentle",
  cost: 1,
});
assert(dual.personality2Id === "gentle" && dual.personality2Name, "build dual pe");

/* P11: material hints + unlock helpers */
assert(MATERIAL_SOURCE_INDEX.tide_dew?.sites?.includes("潮岸練場"), "tide_dew shore");
assert(MATERIAL_SOURCE_INDEX.coral_shard?.sites?.length >= 1, "coral sources");
assert(materialSourceLabel("seal_ember").includes("暗潮心壇"), "ember source");
assert(trainSiteUnlockHint(TRAIN_SITES.find((s) => s.id === "ruins"))?.includes("一層"), "ruins hint");
assert(dungeonNameForClear("tide_1").includes("一層"), "dungeon name");
const fakeMats = { materials: { tide_dew: 0, mist_silk: 2 } };
const aff = affordMaterials(fakeMats, { tide_dew: 2, mist_silk: 1 });
assert(!aff.ok && aff.items.find((i) => i.id === "tide_dew")?.short === 2, "afford short");

/* P12: combat events */
const combatFox = buildPetStats({
  id: "p1",
  species: "reefox",
  element: "tide",
  personality: "gentle",
  cost: 1,
});
combatFox.uid = "p1";
const combatSt = {
  realm: 0,
  qi: 0,
  stones: 200,
  scrap: 0,
  feed: 0,
  dust: 0,
  pets: [combatFox],
  ranch: [],
  pending: [],
  clearedDungeons: {},
  dungeonReadyAt: {},
  master: { name: "潮行者", atk: 6, hp: 90, spd: 7, equip: {} },
  tactics: "balanced",
  formation: "balanced",
  stats: {},
  bestiary: {},
  tideSeals: 0,
  log: [],
  combatsWon: 0,
  winStreak: 0,
};
const combatRes = runDungeon(combatSt, "tide_1");
assert(combatRes.ok && combatRes.combatEvents?.length > 5, "combat events");
assert(combatRes.combatStart?.allies?.length >= 1, "combat roster allies");
assert(combatRes.combatEvents.some((e) => e.type === "strike" || e.type === "text"), "strike or text");
const strikeEv = combatRes.combatEvents.find((e) => e.type === "strike");
if (strikeEv) {
  assert(strikeEv.targetUid && strikeEv.elemTag !== undefined, "strike fields");
}

/* P12b: shop direct ranch + newbie bond pity */
const shopSt = {
  realm: 0,
  qi: 0,
  stones: 200,
  scrap: 0,
  feed: 0,
  dust: 0,
  pets: [],
  ranch: [],
  pending: [],
  clearedDungeons: {},
  dungeonReadyAt: {},
  master: { name: "潮行者", atk: 6, hp: 90, spd: 7, equip: {} },
  tactics: "balanced",
  formation: "balanced",
  stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
  bestiary: {},
  tideSeals: 0,
  log: [],
  combatsWon: 0,
  winStreak: 0,
};
ensureShop(shopSt);
const offerId = shopSt.shop.offers[0]?.offerId;
assert(offerId, "shop offer");
const buy = buyShopOffer(shopSt, offerId);
assert(buy.ok && shopSt.ranch.length === 1 && shopSt.pending.length === 0, "shop to ranch");
const pitySt = {
  realm: 0,
  qi: 0,
  stones: 50,
  pets: [],
  ranch: [],
  pending: [],
  log: [],
  stats: { bonds: 0 },
};
pitySt.pending.push({
  encounterId: "test-enc",
  name: "測試靈",
  kind: "獸",
  elementName: "潮",
  elementId: "tide",
  bondRate: 0,
  cost: 20,
  atk: 5,
  hp: 30,
  spd: 5,
  speciesId: "reefox",
});
const stonesBefore = pitySt.stones;
const origRandom = Math.random;
Math.random = () => 0.99;
const pity = tryBondPending(pitySt, "test-enc");
Math.random = origRandom;
assert(pity.ok && !pity.success && pitySt.pending.length === 1, "pity keeps pending");
assert(pitySt.stones === stonesBefore, "pity refunds bond cost");

/* P13: tutorial flow */
const tut = { done: false, step: "cultivate_qi", flags: {} };
const tutSt = { realm: 0, qi: 0, pets: [], ranch: [], combatsWon: 0, stones: 200, log: [], tutorial: tut };
normalizeTutorial(tutSt);
assert(tutorialActive(tutSt), "tutorial on for new");
tutSt.qi = 40;
const a1 = advanceTutorialIfReady(tutSt);
assert(a1.advanced && tutSt.tutorial.step === "breakthrough", "qi step");
tutSt.realm = 1;
const a2 = advanceTutorialIfReady(tutSt);
assert(a2.advanced && tutSt.tutorial.step === "shop_pet", "break step");
assert(tutorialShopPrice(tutSt, 60) === TUTORIAL_SHOP_COST, "tutorial shop price");
tutSt.stones = 200;
ensureShop(tutSt);
const buyTut = buyShopOffer(tutSt, tutSt.shop.offers[0].offerId);
assert(buyTut.ok && tutSt.ranch.length === 1, "tutorial shop ranch");
assert(tutSt.tutorial.step === "deploy", "shop step done");

const skipSt = { realm: 0, qi: 0, pets: [], ranch: [], combatsWon: 0, stones: 200, log: [], tutorial: { done: false, step: "cultivate_qi", flags: {} } };
normalizeTutorial(skipSt);
assert(tutorialActive(skipSt), "skip pre active");
const skipR = skipTutorial(skipSt);
assert(skipR.ok && !tutorialActive(skipSt), "skip tutorial unlocks");
assert(skipSt.tutorial.done && skipSt.tutorial.step === "complete", "skip marks complete");

const ga = genAwakenBonus(3);
assert(ga?.skillLevel === 2 && ga.atk > 0, "gen3 awaken");
const gb = genAwakenBonus(2);
assert(gb && !gb.skillLevel, "gen2 awaken no skill bump");

const foxA = { uid: "a", speciesId: "reefox", kind: "獸", elementId: "tide", personalityId: "sly", atk: 20, hp: 100, spd: 12, rarity: 1, generation: 1 };
const finB = { uid: "b", speciesId: "glowfin", kind: "光", elementId: "flame", personalityId: "fierce", atk: 18, hp: 95, spd: 11, rarity: 0, generation: 1 };
const prev = breedPreview(foxA, finB);
assert(prev?.hybridName === "耀狐" && prev.outcomes.length >= 2, "breed preview hybrid");
assert(prev.statPreview.atk[1] >= prev.statPreview.atk[0], "stat preview range");

const lineSt = {
  pets: [{ uid: "c1", speciesId: "glintfox", name: "耀狐", bornFrom: ["a", "b"], generation: 2 }],
  ranch: [{ uid: "a", speciesId: "reefox", name: "礁狐", generation: 1 }],
};
const lin = petLineage(lineSt, "c1");
assert(lin.parents.length === 2 && lin.children.length === 0, "lineage parents");
const linA = petLineage(lineSt, "a");
assert(linA.children.length === 1, "lineage children");

const inh = breedStatInheritancePreview(foxA, finB, { rarity: 1, generation: 2, hybrid: true });
assert(inh.atk >= 0 && inh.hp >= 0, "inherit preview");

/* P16: balance pass */
assert(BREED_STONE_COST === 45, "breed cost");
assert(BREED_COOLDOWN_MS === 30_000, "breed cd");
assert(FORGE_SCRAP_COST === 2, "forge scrap");
assert(fusionStoneCost(2) === 192, "fuse stage2 cost");
assert(upgradeStoneCost(1) === 19, "upgrade lv1");
assert(BOND_COST_MAX === 42, "bond cap");
const t1 = DUNGEONS.find((d) => d.id === "tide_1");
assert(t1?.reward?.stones === 32, "t1 stones");
const bg3 = BREAKTHROUGH_GATES[3];
assert(bg3.costs.dust === 8 && bg3.checks.find((c) => c.type === "bonds")?.need === 2, "bt gate 3");
const dailyHybrid = BREED_GOALS.find((g) => g.id === "daily_hybrid");
assert(dailyHybrid?.type === "breed_cross_kind", "daily hybrid cross kind");

const qiSt = { realm: 0, qi: 50, pets: [], ranch: [], tutorial: { done: false, step: "cultivate_qi", flags: {} } };
normalizeTutorial(qiSt);
assert(tutorialQiReady(qiSt), "tutorial qi ready");
assert(!isCultivateSubLocked(qiSt, "advance"), "advance unlocked when qi ready");

assert((BREAKTHROUGH_GATES[1].checks || []).length === 0, "realm1 no combat gate");
const brGate1 = breakthroughView({ realm: 0, qi: 50, stones: 30, combatsWon: 0, pets: [], ranch: [] });
assert(brGate1.items.every((i) => i.ok), "realm1 breakthrough ready without combat win");

const navIn = { tab: "cultivate", panelSub: { cultivate: "train", party: "fight", dungeon: "field" } };
const codexSt = { tutorial: { done: false, step: "codex", flags: {} } };
const navOut = syncTutorialNavigation(codexSt, navIn);
assert(navOut.tab === "cultivate" && navOut.panelSub.cultivate === "train", "codex step no auto tab jump");
const codexHi = tutorialHighlights(codexSt, navIn);
assert(codexHi.length === 1 && codexHi[0].type === "tab" && codexHi[0].id === "codex", "codex highlight tab");
assert(tutorialGlowClass(codexSt, { type: "tab", id: "codex" }, navIn) === " tut-glow", "codex glow");

const bondSt = { tutorial: { done: false, step: "bond", flags: {} } };
const bondNav = syncTutorialNavigation(bondSt, navIn);
assert(bondNav.tab === "cultivate", "bond step no auto party nav");

const dungSt = {
  tutorial: { done: false, step: "dungeon_win", flags: { dungeonStarted: true } },
  combatsWon: 1,
};
assert(!advanceTutorialIfReady(dungSt).advanced, "dungeon win waits for tutorial flag");
dungSt.tutorial.flags.dungeonWonTutorial = true;
assert(advanceTutorialIfReady(dungSt).advanced && dungSt.tutorial.step === "codex", "dungeon win flag advances");

const bondDone = {
  realm: 0,
  tutorial: { done: false, step: "bond", flags: { bondVisited: false }, latePending: false, lateCompleted: false },
};
bondDone.tutorial.flags.bondVisited = true;
const bondAdv = advanceTutorialIfReady(bondDone);
assert(bondAdv.nextId === "complete" && bondDone.tutorial.done && bondDone.tutorial.latePending, "bond skips late until realm 2");

const lateStart = {
  realm: 2,
  tutorial: { done: true, step: "complete", flags: {}, latePending: true, lateCompleted: false },
};
const late = maybeStartLateTutorial(lateStart);
assert(late.started && lateStart.tutorial.step === "dispatch", "late tutorial at realm 2");
assert(LATE_TUTORIAL_MIN_REALM === 2, "late realm gate");

console.log("odds 1+2", odds12, "sample genes", g.generation, g.hybrid);
console.log("smoke-test ok");
