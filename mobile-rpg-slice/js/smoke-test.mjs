/**
 * Smoke: kind sync + generation breeding + P3 goals / trials / recipes.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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
  TERTIARY_RECIPES,
  tertiaryRecipesForParents,
  KIND_SKILLS,
  BREED_GOALS,
  hybridRecipeSummary,
  hybridRecipeMatrix,
  DUNGEON_TRIALS,
  partyMeetsTrial,
  countHybridBestiary,
  bestiaryKey,
  bestiaryTotal,
  migrateBestiaryMap,
  PERSONALITIES,
  ranchCapForStage,
  RANCH_IDLE_GLOBAL_MULT,
  DISPATCH_GEN_REWARD_MULT,
  IDLE_BY_PERSONALITY,
  allBloodlineKeys,
  BLOODLINE_MARK_IDS,
  PATH_QUESTS,
  makeStarterPet,
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
  FORMATION_SLOT_COUNT,
  formationAllyPlacement,
  formationFoePlacement,
  DUNGEON_CHALLENGE_RULES,
  pickDailyChallenge,
  DUNGEON_DAILY_MODS,
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
  DISPATCH_SLOT_MAX,
  DISPATCH_BOARD_SIZE,
  tideSealCombatMult,
  tideSealGainForRealm,
  TIDE_SEAL_MIN_REALM,
  TRAIN_SITES,
  MATERIALS,
  upgradeMatCost,
  breedMatCost,
  skillMatCost,
  fusionMatCost,
  DUNGEON_MAT_DROPS,
  primaryTrainSiteForMat,
  suggestTrainForShortage,
  unlockedTrainSiteIds,
  materialSourceLabel,
  MATERIAL_SOURCE_INDEX,
  trainSiteUnlockHint,
  pickDailyTrainSpotlight,
  trainDropMult,
  trainSiteRatesView,
  trainSiteById,
  TRAIN_FOCUS_BONUS,
  TRAIN_DAILY_SPOT_BONUS,
  dungeonNameForClear,
  genAwakenBonus,
  breedStatInheritancePreview,
  BREED_STONE_COST,
  BREED_COOLDOWN_MS,
  BREED_QUEUE_MAX,
  FORGE_SCRAP_COST,
  BOND_COST_MAX,
  fusionStoneCost,
  upgradeStoneCost,
  makeStarterEgg,
  STARTER_EGG_HATCH_MS,
  TUTORIAL_EGG_HATCH_MS,
  makeEgg,
  hatchPetFromEgg,
  EGG_TIERS,
  eggTierInfo,
  DAILY_ALL_CLEAR_BONUS,
  DUNGEON_SWEEP_COUNTS,
  DUNGEON_SUMMON_MIN,
  DUNGEON_SUMMON_MAX,
  clampDungeonSummonCount,
  DUNGEON_ENTRY_MAT_ID,
  dungeonEntryMatCost,
  todayKey,
  TRAIN_DEPTH_MULT,
  TRAIN_TIER_COUNT,
  TRAIN_MIST_WAVE_COUNT,
  TRAIN_WARDEN_WAVE_COUNT,
  TRAIN_ZONE_CHAIN,
  rollTideKeyDrop,
  ACTIVE_PET_MAX,
  ABYSS_MUTATION_IDS,
  ABYSS_COSMETIC_IDS,
  ABYSS_WIPE_KEEP_RATE,
  emptyAbyssDive,
  emptyMaterials,
  OFFLINE_HINT_SEC,
  OFFLINE_BANK_CAP_SEC,
  elementExplain,
  kindExplain,
  personalityExplain,
  skillTypeLabel,
  ELEMENT_EXPLAIN,
  KIND_EXPLAIN,
} from "./data.js";
import {
  affordMaterials,
  runDungeon,
  runDungeonSweep,
  canDungeonSweep,
  dungeonSweepCost,
  startDungeonSummon,
  dungeonTeamPreview,
  dungeonGateView,
  claimAllDailies,
  claimDailyAllClear,
  dailyAllClearView,
  buyShopOffer,
  tryBondPending,
  ensureShop,
  breedPreview,
  petLineage,
  useTemperOil,
  deployPet,
  claimHatch,
  startHatch,
  eggsView,
  tickCultivation,
  tickRanchIdle,
  claimDispatch,
  startDispatch,
  dispatchView,
  ensureDispatchBoard,
  petMatchesDispatchMission,
  dispatchMissionReqLabel,
  upgradePet,
  isFusionUnlocked,
  dungeonAttackBlockReason,
  fusePets,
  tryBreed,
  claimBreed,
  breedStatus,
  breedBusyUids,
  useBreedTicket,
  advanceTrainTier,
  claimTrainTierClear,
  createTrainIdleSession,
  stepTrainIdleSession,
  markTrainIdleClearReady,
  persistTrainIdleClearResult,
  persistTrainIdleCombatState,
  restoreTrainIdleCombatState,
  clearTrainIdleCombatState,
  claimOfflineBank,
  offlineBankView,
  clearOfflineHint,
  runTrainLayerCombat,
  challengeTrainWarden,
  setTrainSite,
  setTrainDepth,
  trainClearEfficiency,
  trainDepthMultFor,
  partyCombatPower,
  trainIdleCombatView,
  trainSitesView,
  abyssDiveView,
  startAbyssDive,
  advanceAbyssDive,
  retreatAbyssDive,
  buyAbyssInsurance,
  buyAbyssCosmetic,
  buyAbyssEgg,
} from "./engine.js";
import {
  normalizeTutorial,
  advanceTutorialIfReady,
  advanceTutorialCascade,
  healTutorialProgress,
  tutorialActive,
  tutorialShopPrice,
  skipTutorial,
  tutorialQiReady,
  isCultivateSubLocked,
  isTabLocked,
  TUTORIAL_SHOP_COST,
  TUTORIAL_TRAIN_LEVEL,
  syncTutorialNavigation,
  tutorialHighlights,
  tutorialGlowClass,
  tutorialLiveSnapshot,
  maybeStartLateTutorial,
  tutorialWaivesDungeonChallenge,
  tutorialStepInfo,
  LATE_TUTORIAL_MIN_REALM,
  trainPetCanUpgrade,
  TUTORIAL_STARTER_TIDE_DEW,
  TUTORIAL_QI_IDLE_SEC,
  tutorialBannerHint,
  tutorialEggReady,
  tutorialNeedsRanchSub,
  tutorialTargetSelector,
  isDungeonSubLocked,
} from "./tutorial.js";

function assertNavKeepsTab(state, step, tab, panelSub = {}) {
  state.tutorial = { done: false, step, flags: state.tutorial?.flags || {} };
  const navIn = {
    tab,
    panelSub: { party: "ranch", cultivate: "train", dungeon: "field", codex: "dex", ...panelSub },
  };
  const navOut = syncTutorialNavigation(state, navIn);
  assert(navOut.tab === tab, `${step} keeps tab ${tab}`);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(KINDS.length === 6, "6 kinds");
assert(wildSpeciesIds().length >= 14, "expanded wild pool");
assert(wildSpeciesIds(0).length < wildSpeciesIds(3).length, "realm wild pool");
assert(SPECIES.glowfin.kind === "光", "glowfin light");
assert(KIND_SKILLS["光"] === "glow_lance", "light skill");
assert(Object.keys(SPECIES).length >= 40, "40+ species");
assert(bestiaryTotal() === 2640, "bestiary 48×5×11");
assert(Object.keys(PERSONALITIES).length === 20, "20 personalities");
assert(ranchCapForStage(0) === 6 && ranchCapForStage(5) === 21, "ranch cap 6+stage*3");
assert(RANCH_IDLE_GLOBAL_MULT === 0.35, "idle global mult");
assert(DISPATCH_GEN_REWARD_MULT[3] === 1.25, "gen3 dispatch mult");
assert(IDLE_BY_PERSONALITY.diligent?.feed > IDLE_BY_PERSONALITY.fierce?.feed, "work>fight feed");
assert(PERSONALITIES.blessed.workFeed >= 1 && PERSONALITIES.blessed.atk >= 1, "blessed no penalty");
assert(PERSONALITIES.brutal.atk > 1 && PERSONALITIES.brutal.workFeed < 1, "fight tradeoff");
const mig = migrateBestiaryMap({
  "reefox:tide:fierce:none": true,
  "reefox:tide:gentle:none": true,
  "reefox:tide:sly:tide_sigil": true,
  "glowfin:flame:none": true,
});
assert(mig["reefox:tide:none"] && mig["reefox:tide:tide_sigil"] && mig["glowfin:flame:none"], "bestiary migrate");
assert(Object.keys(mig).length === 3, "migrate merges personalities");
assert(allBloodlineKeys().length === 11, "11 bloodline forms");
assert(BLOODLINE_MARK_IDS.length === 4, "4 blood marks");
assert(PATH_QUESTS.length >= 10, "path quests");
assert(makeStarterPet().speciesId === "reefox", "starter reefox");

const kindsOfWild = new Set(wildSpeciesIds().map((id) => SPECIES[id].kind));
assert(kindsOfWild.size === 6, "wild covers 6 kinds");

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
assert(summary.filter((r) => r.tier === "main").length === HYBRID_RECIPES.filter((r) => r.tier === "main").length, "main recipe summary");
assert(summary.some((r) => r.tier === "tertiary" && r.species === "abyssreign"), "tertiary in summary");
assert(summary.every((r) => r.name && r.kindsLabel), "summary labels");
assert(Object.keys(SPECIES).filter((id) => SPECIES[id].tertiary).length >= 8, "8+ tertiary species");
assert(TERTIARY_RECIPES.length >= 32, "tertiary recipes expanded");
assert(tertiaryRecipesForParents("tideling", "mistcarp").length >= 1, "tideling×mistcarp tertiary");
assert(tertiaryRecipesForParents("tidehowl", "voidcarp").length >= 1, "sub hybrid tertiary path");
assert(PATH_QUESTS.some((q) => q.id === "nurture_tertiary"), "tertiary path quest");
assert(bestiaryTotal() === 2640, "bestiary 48×5×11 no personality");

const tidePet = {
  uid: "t1",
  speciesId: "tideling",
  kind: "鱗",
  name: "潮靈",
  breedOnly: true,
  generation: 2,
  elementId: "tide",
  personalityId: "sly",
  atk: 22,
  hp: 110,
  spd: 12,
  rarity: 1,
};
const mistPet = {
  uid: "m1",
  speciesId: "mistcarp",
  kind: "鱗",
  name: "霧鯉",
  breedOnly: true,
  generation: 2,
  elementId: "mist",
  personalityId: "steady",
  atk: 18,
  hp: 120,
  spd: 10,
  rarity: 1,
};
const tertPrev = breedPreview(tidePet, mistPet);
assert(tertPrev?.tier === "tertiary" && tertPrev.hybridName === "淵君", "tertiary breed preview");
assert(tertPrev.outcomes.some((o) => o.kind === "tertiary"), "tertiary outcome row");

let tertHit = false;
for (let i = 0; i < 80; i++) {
  const g = rollBreedGenes(tidePet, mistPet);
  if (g.tertiary && g.species === "abyssreign") {
    tertHit = true;
    break;
  }
}
assert(tertHit, "roll tertiary abyssreign within 80 tries");

const temperSt = {
  materials: { temper_oil: 1 },
  pets: [
    {
      uid: "wash1",
      name: "試洗",
      speciesId: "reefox",
      kind: "獸",
      elementId: "tide",
      personalityId: "fierce",
      personalityName: "烈性",
      atk: 20,
      hp: 100,
      spd: 12,
      rarity: 0,
      generation: 0,
      genes: { personality: "fierce" },
    },
  ],
  ranch: [],
  bestiary: {},
  log: [],
};
const wash = useTemperOil(temperSt, "wash1");
assert(wash.ok && temperSt.materials.temper_oil === 0, "temper oil consume");
assert(temperSt.pets[0].personalityId !== "fierce", "temper oil new personality");
assert(!useTemperOil(temperSt, "wash1").ok, "temper oil empty fails");

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
assert(STAGES[0].rate === 1.05 && STAGES[5].rate === 3.5, "qi rates mid-nerf");
assert(stageAt(6).rate < 4.0, "post-tide qi growth softened");
const shoreSite = TRAIN_SITES.find((s) => s.id === "shore");
assert(shoreSite.drops.find((d) => d.mat === "mist_token")?.perSec === 0.0035, "token AFK nerfed");
assert(shoreSite.drops.find((d) => d.mat === "tide_dew")?.perSec === 0.034, "dew AFK light nerf");
assert(TRAIN_SITES.find((s) => s.id === "abyss")?.qiMult === 1.06, "abyss qiMult compressed");
assert(TRAIN_SITES.find((s) => s.id === "mistveil")?.drops.find((d) => d.mat === "echo_resin")?.perSec === 0.017, "resin AFK nerfed");
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
fakeState.qi = 60;
fakeState.stones = 25;
fakeState.combatsWon = 1;
fakeState.ranch = [makeStarterPet()];
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
/* Advance checklist must surface every gate (incl. bestiary past the old 6-row truncate). */
const br2gates = breakthroughView({
  ...fakeState,
  realm: 2,
  qi: 99999,
  stones: 9999,
  scrap: 99,
  dust: 99,
  combatsWon: 99,
  clearedDungeons: { tide_2: true },
  pets: [makeStarterPet(), makeStarterPet()],
  ranch: [],
  stats: { breeds: 1 },
  bestiary: { only: true },
});
assert(br2gates.items.length > 6, "realm2→3 breakthrough has >6 checklist rows");
assert(br2gates.items.some((i) => i.label.includes("圖鑑") && !i.ok), "bestiary gate visible & unmet");
assert(!br2gates.ready, "not ready when bestiary unmet even if earlier rows met");
assert(
  br2gates.items.slice(0, 6).every((i) => i.ok) && br2gates.items.slice(6).some((i) => !i.ok),
  "old slice(0,6) would hide unmet gates past row 6"
);
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
assert(FORMATION_SLOT_COUNT === 3, "formation slot count");
{
  const vg = formationAllyPlacement("vanguard", 3);
  const rr = formationAllyPlacement("rear", 3);
  const bl = formationAllyPlacement("balanced", 3);
  assert(vg.every((p) => p.lane === "front"), "vanguard all front lane");
  assert(rr.every((p) => p.lane === "rear"), "rear all rear lane");
  assert(
    bl.map((p) => p.lane).join(",") === "rear,front,rear",
    "balanced stagger lanes"
  );
  assert(
    vg.map((p) => p.unitIndex).join(",") !== rr.map((p) => p.lane).join(","),
    "vanguard vs rear lane coords differ"
  );
  assert(
    JSON.stringify(vg.map((p) => p.lane)) !== JSON.stringify(bl.map((p) => p.lane)),
    "vanguard vs balanced placement differ"
  );
  const foes = formationFoePlacement(2);
  assert(foes[0].unitIndex === 0 && foes[1].unitIndex === 1 && foes[2].unitIndex === null, "foe wave order slots");
  assert(foes.every((p) => p.lane === "front"), "foes stay front lane");
  const one = formationAllyPlacement("vanguard", 1);
  assert(one[0].unitIndex === 0 && one[1].unitIndex === null && one[2].unitIndex === null, "partial party empty slots");
}
assert(FORMATIONS.vanguard.desc.includes("前排"), "vanguard desc mentions front");
assert(FORMATIONS.rear.desc.includes("後排"), "rear desc mentions rear");
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
assert(personalityCombatFor("diligent")?.atkMult < 1, "diligent combat soft");
assert(personalityCombatFor("blessed")?.atkMult >= 1, "blessed combat buff");
assert(GEAR_SETS.tide && gearSetBonus(["tide_blade", "moss_vest"]).atk === 3, "set2");
assert(gearSetBonus(["core_fang", "abyss_plate", "gloom_sigil"]).labels.some((l) => l.includes("三件")), "set3");
assert(DISPATCH_MISSIONS.length >= 3, "dispatch missions");
assert(DISPATCH_SLOT_MAX === 3, "dispatch concurrent slots 3");
assert(DISPATCH_BOARD_SIZE === 3, "dispatch board size 3");
assert(DISPATCH_MISSIONS.some((m) => m.needElement), "dispatch needElement");
assert(DISPATCH_MISSIONS.some((m) => m.needKind), "dispatch needKind");
assert(tideSealGainForRealm(5) >= 1 && tideSealGainForRealm(4) === 0, "seal gain");
assert(tideSealCombatMult(5) === 1.1, "seal mult");
assert(TIDE_SEAL_MIN_REALM === 5, "seal min realm");

/* P10: train sites, materials, dual personality, shellmite */
assert(TRAIN_SITES.length >= 7 && MATERIALS.tide_dew, "train+mats");
assert(TRAIN_SITES.every((s) => s.focus), "each site has focus");
assert(
  !TRAIN_SITES.some((s) => (s.drops || []).some((d) => MATERIALS[d.mat]?.tier === "dungeon")),
  "no dungeon mats on AFK sites"
);
assert(MATERIALS.echo_resin && MATERIALS.fuse_sand, "new bulk mats");
assert(skillMatCost(1) && Object.keys(skillMatCost(1)).length === 0, "skill lv1 no resin");
assert(skillMatCost(2).echo_resin >= 1, "skill lv2 needs resin");
assert(fusionMatCost(1).fuse_sand === 1 && fusionMatCost(3).fuse_sand === 3, "fuse sand cost");
assert(materialSourceLabel("temper_oil") === "秘境專屬", "temper dungeon-only label");
assert(materialSourceLabel("echo_resin").includes("霧帷"), "resin from mistveil");
assert(unlockedTrainSiteIds({ clearedDungeons: {} }).includes("shore"), "shore free");
assert(!unlockedTrainSiteIds({ clearedDungeons: {} }).includes("ruins"), "ruins locked");
assert(unlockedTrainSiteIds({ clearedDungeons: { tide_1: true } }).includes("ruins"), "ruins unlock");
assert(
  unlockedTrainSiteIds({ clearedDungeons: { tide_2: true } }).includes("mistveil"),
  "mistveil unlock t2"
);
assert(
  unlockedTrainSiteIds({ clearedDungeons: { tide_3: true } }).includes("fusehall"),
  "fusehall unlock t3"
);
assert(upgradeMatCost(1).tide_dew >= 1, "upgrade mats");
assert(breedMatCost(0, 0).coral_shard >= 1, "breed mats");
assert(DISPATCH_MISSIONS.length >= 11, "more dispatch");
assert(DISPATCH_MISSIONS.some((m) => m.eggChance), "dispatch egg chance");
assert(DISPATCH_MISSIONS.some((m) => m.id === "egg_shore"), "shore egg mission");
assert(DISPATCH_MISSIONS.some((m) => m.needSite === "mistveil"), "resin dispatch");
assert(DISPATCH_MISSIONS.some((m) => m.needSite === "fusehall"), "sand dispatch");
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
assert(MATERIAL_SOURCE_INDEX.tide_dew?.sites?.includes("潮岸域"), "tide_dew shore");
assert(MATERIAL_SOURCE_INDEX.coral_shard?.sites?.includes("廢墟域"), "coral ruins only");
assert(!MATERIAL_SOURCE_INDEX.coral_shard?.sites?.includes("潮岸域"), "coral not on shore");
assert(MATERIAL_SOURCE_INDEX.seal_ember?.sites?.length === 1, "ember single site");
assert(materialSourceLabel("seal_ember").includes("暗潮域"), "ember source");
assert(!materialSourceLabel("seal_ember").includes("霧絲"), "ember not mixed");
assert(trainSiteUnlockHint(TRAIN_SITES.find((s) => s.id === "ruins"))?.includes("域主"), "ruins hint");
assert(dungeonNameForClear("tide_1").includes("一層"), "dungeon name");
const fakeMats = { materials: { tide_dew: 0, mist_silk: 2 } };
const aff = affordMaterials(fakeMats, { tide_dew: 2, mist_silk: 1 });
assert(!aff.ok && aff.items.find((i) => i.id === "tide_dew")?.short === 2, "afford short");

/* P18: specialize — ruins primary is coral; mist_token is shared gate mat */
const ruins = TRAIN_SITES.find((s) => s.id === "ruins");
assert(
  ruins.focus === "繁殖" &&
    ruins.primaryMat === "coral_shard" &&
    ruins.drops.every((d) => !d.mat || d.mat === "coral_shard" || d.mat === "mist_token"),
  "ruins coral focus"
);
const abyssSite = TRAIN_SITES.find((s) => s.id === "abyss");
assert(
  abyssSite.focus === "突破" &&
    abyssSite.primaryMat === "seal_ember" &&
    abyssSite.drops.every((d) => !d.mat || d.mat === "seal_ember" || d.mat === "mist_token"),
  "abyss ember focus"
);
assert(DUNGEON_MAT_DROPS.tide_4.weights.breed_ticket >= 2, "dungeon exclusive weight");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.echo_resin, "no resin in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.fuse_sand, "no fuse sand in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.tide_dew, "no bulk tide_dew in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_4.weights.seal_ember, "no bulk seal_ember in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.mist_token, "entry token never dungeon drop");
assert(MATERIALS.mist_token?.tier === "gate", "mist_token is gate tier");
assert(materialSourceLabel("mist_token").includes("秘境不掉"), "token source label");
assert(TRAIN_SITES.every((s) => (s.drops || []).some((d) => d.mat === "mist_token")), "all sites drip tokens");

/* P19: shortage → train site nav */
assert(primaryTrainSiteForMat("coral_shard")?.id === "ruins", "coral → ruins");
assert(primaryTrainSiteForMat("echo_resin")?.id === "mistveil", "resin → mistveil");
assert(primaryTrainSiteForMat("temper_oil") == null, "temper no AFK site");
const shortSt = {
  materials: { tide_dew: 0, coral_shard: 0 },
  trainSite: "shore",
  clearedDungeons: { tide_1: true, tide_2: true },
};
const sug = suggestTrainForShortage(shortSt, { coral_shard: 2 });
assert(sug?.siteId === "ruins" && sug.unlocked && !sug.alreadyThere, "suggest ruins");
const dungSug = suggestTrainForShortage(shortSt, { temper_oil: 1 });
assert(dungSug?.dungeonOnly, "temper dungeon suggest");
const there = suggestTrainForShortage({ ...shortSt, trainSite: "ruins" }, { coral_shard: 1 });
assert(there?.alreadyThere, "already at ruins");

/* P20: deepen train sites + daily spotlight */
const spot = pickDailyTrainSpotlight("2026-08-30");
assert(spot?.id && pickDailyTrainSpotlight("2026-08-30").id === spot.id, "train spot stable");
const ruinsSite = trainSiteById("ruins");
const dewMult = trainDropMult(ruinsSite, { mat: "coral_shard", perSec: 0.031 }, "2026-08-30");
assert(dewMult >= TRAIN_FOCUS_BONUS, "focus mult on primary mat");
const rates = trainSiteRatesView(ruinsSite, "2026-08-30");
assert(rates.lines.some((l) => l.name === "珊瑚屑"), "rates include primary");
assert(DUNGEON_DAILY_MODS.length >= 10, "expanded daily mods");
assert(DUNGEON_CHALLENGE_RULES.some((r) => r.minGeneration === 2), "gen2 challenge");
const gen1Pet = makeStarterPet();
const gen2Rule = DUNGEON_CHALLENGE_RULES.find((r) => r.id === "min_gen2");
assert(!evaluateDungeonChallenge([gen1Pet], gen2Rule).ok, "gen2 challenge rejects gen1");

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
assert(combatSt.pets.length >= 1, "combat needs pets");
const combatRes = runDungeon(combatSt, "tide_1");
assert(combatRes.ok && combatRes.combatEvents?.length > 5, "combat events");
assert(!combatRes.combatStart?.allies?.some((a) => a.isMaster), "no master in combat");
assert(combatRes.combatStart?.allies?.length >= 1, "combat roster allies");
assert(combatRes.combatEvents.some((e) => e.type === "strike" || e.type === "text"), "strike or text");
const strikeEv = combatRes.combatEvents.find((e) => e.type === "strike");
if (strikeEv) {
  assert(strikeEv.targetUid && strikeEv.actorUid && strikeEv.elemTag !== undefined, "strike fields");
  assert(strikeEv.actorElementId != null, "strike element ids");
}
assert(combatRes.combatEvents.some((e) => e.type === "wave" && e.foes?.length), "wave event");
const firstEv = combatRes.combatEvents[0];
assert(
  firstEv?.type === "wave" || firstEv?.type === "round",
  "combat log starts at wave/round"
);
assert(
  !combatRes.combatEvents.some((e) => /關卡條件|雜交試煉|挑戰.*條件/.test(e.text || "")),
  "no condition checks in combat events"
);
const roundTexts = combatRes.combatEvents.filter((e) => e.type === "round").map((e) => e.text);
assert(
  roundTexts.length === new Set(roundTexts).size,
  "no duplicate round lines"
);
assert(
  (combatRes.transcript || []).some((t) => /關卡條件|戰術|本關/.test(t)),
  "preamble stays in transcript"
);

/* P12b: shop egg/pet + newbie bond pity */
const shopSt = {
  realm: 0,
  qi: 0,
  stones: 200,
  scrap: 0,
  feed: 0,
  dust: 0,
  pets: [],
  ranch: [],
  eggs: [],
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
  tutorial: { done: true, step: "complete", flags: {} },
};
ensureShop(shopSt);
const eggOffer = shopSt.shop.offers.find((o) => o.kind === "egg") || shopSt.shop.offers[0];
assert(eggOffer, "shop offer");
const buy = buyShopOffer(shopSt, eggOffer.offerId);
assert(buy.ok, "shop buy ok");
if (eggOffer.kind === "egg") {
  assert(shopSt.eggs.length >= 1 && shopSt.ranch.length === 0, "shop egg to eggs");
} else {
  assert(shopSt.ranch.length === 1 && shopSt.pending.length === 0, "shop to ranch");
}
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

/* P21: eggs */
assert(EGG_TIERS.C.hatchMs === 120_000 && EGG_TIERS.A.hatchMs >= 1_800_000, "egg tiers");
assert(STARTER_EGG_HATCH_MS === 20_000, "starter hatch ms");
const freshEgg = makeStarterEgg();
assert(freshEgg.readyAt - freshEgg.startedAt === STARTER_EGG_HATCH_MS, "starter egg duration");
const egg0 = makeStarterEgg(Date.now() - 200_000);
assert(egg0.readyAt <= Date.now(), "starter egg ready past");
const hatchSt = {
  realm: 0,
  pets: [],
  ranch: [],
  eggs: [egg0],
  materials: {},
  bestiary: {},
  stats: {},
  log: [],
  tutorial: { done: false, step: "hatch_starter", flags: {} },
};
const hatched = claimHatch(hatchSt, egg0.uid);
assert(hatched.ok && hatchSt.ranch.length === 1 && hatchSt.eggs.length === 0, "claim hatch starter");
assert(hatchSt.tutorial.step === "meet_pet" || hatchSt.tutorial.flags.starterHatched, "hatch advances");

const hatchLockSt = { tutorial: { done: false, step: "hatch_starter", flags: {} } };
assert(!isTabLocked(hatchLockSt, "cultivate"), "hatch_starter unlocks cultivate tab");
assert(!isCultivateSubLocked(hatchLockSt, "train"), "hatch_starter unlocks train");
assert(isCultivateSubLocked(hatchLockSt, "shop"), "hatch_starter locks shop");

assert(TUTORIAL_STARTER_TIDE_DEW >= 3, "starter dew for lv3");
const trainNavSt = {
  tutorial: { done: false, step: "train_pet", flags: {} },
  materials: { tide_dew: 3 },
  stones: 120,
  pets: [],
  ranch: [{ uid: "p1", level: 1, name: "x" }],
};
const navParty = syncTutorialNavigation(trainNavSt, {
  tab: "party",
  panelSub: { party: "ranch", cultivate: "train" },
});
assert(navParty.tab === "party", "train_pet allows party tab");
assert(trainPetCanUpgrade(trainNavSt), "train can upgrade with dew");
const trainHi = tutorialHighlights(trainNavSt, {
  tab: "cultivate",
  panelSub: { cultivate: "train" },
});
assert(trainHi.some((h) => h.type === "tab" && h.id === "party"), "train highlights party when mats ready");
const trainHiWait = tutorialHighlights(
  { ...trainNavSt, materials: { tide_dew: 0 } },
  { tab: "cultivate", panelSub: { cultivate: "train" } }
);
assert(trainHiWait.length === 0, "train no party push while waiting mats");

assertNavKeepsTab({ ranch: [makeStarterPet()] }, "meet_pet", "party", { party: "ranch" });
assertNavKeepsTab({ ranch: [makeStarterPet()] }, "deploy", "party", { party: "ranch" });
assertNavKeepsTab(trainNavSt, "train_pet", "party", { party: "ranch" });
assertNavKeepsTab(trainNavSt, "train_pet", "cultivate", { cultivate: "train" });
assertNavKeepsTab(
  { tutorial: { done: false, step: "hatch_second", flags: {} }, eggs: [] },
  "hatch_second",
  "cultivate",
  { cultivate: "train" }
);

const hatch2LockSt = { tutorial: { done: false, step: "hatch_second", flags: {} } };
assert(!isTabLocked(hatch2LockSt, "cultivate"), "hatch_second unlocks cultivate tab");

assert(TUTORIAL_EGG_HATCH_MS === STARTER_EGG_HATCH_MS, "tutorial egg hatch ms");
assert(TUTORIAL_EGG_HATCH_MS < EGG_TIERS.C.hatchMs, "tutorial egg faster than C tier");
const tutShopEgg = makeEgg("C", "tutorial_shop");
const hatch2St = {
  realm: 0,
  pets: [],
  ranch: [makeStarterPet()],
  eggs: [tutShopEgg],
  materials: {},
  stones: 120,
  log: [],
  tutorial: { done: false, step: "hatch_second", flags: { shopBought: true } },
};
const hatch2Start = startHatch(hatch2St, tutShopEgg.uid);
assert(hatch2Start.ok, "tutorial second egg start");
assert(
  tutShopEgg.readyAt - tutShopEgg.startedAt === TUTORIAL_EGG_HATCH_MS,
  "tutorial second egg short hatch"
);

assert(TUTORIAL_QI_IDLE_SEC === 45, "qi idle sec shortened");
const qiBannerSt = {
  realm: 0,
  qi: 0,
  daily: { idleSec: 10 },
  tutorial: { done: false, step: "cultivate_qi", flags: {} },
};
assert(tutorialBannerHint(qiBannerSt).includes("35s"), "qi banner shows idle countdown");

assert(tutorialNeedsRanchSub("train_pet"), "train_pet needs ranch");
assert(tutorialTargetSelector({ type: "upgrade" }).includes("data-upgrade-feed"), "upgrade selector");
assert(tutorialTargetSelector({ type: "start-fuse" }) === "[data-start-fuse]:not([disabled])", "fuse selector");

const eggReadySt = {
  eggs: [{ uid: "e1", startedAt: Date.now() - 30_000, readyAt: Date.now() - 1000, tier: "C", name: "潮霧蛋" }],
  tutorial: { done: false, step: "hatch_starter", flags: {} },
};
assert(tutorialEggReady(eggReadySt), "egg ready detect");
const eggReadyHi = tutorialHighlights(eggReadySt, { tab: "cultivate", panelSub: { cultivate: "train" } });
assert(eggReadyHi.some((h) => h.type === "tab" && h.id === "party"), "egg ready highlights party from cultivate");
const eggReadyNav = syncTutorialNavigation(eggReadySt, { tab: "cultivate", panelSub: { cultivate: "train" } });
assert(eggReadyNav.tab === "party" && eggReadyNav.panelSub.party === "ranch", "egg ready nav to ranch");

const trainDetailHi = tutorialHighlights(
  { ...trainNavSt, ranch: [makeStarterPet()] },
  { tab: "party", panelSub: { party: "ranch" }, petDetail: true }
);
assert(trainDetailHi.some((h) => h.type === "upgrade"), "train detail highlights upgrade");

const tickMatSt = {
  realm: 0,
  qi: 0,
  stones: 0,
  feed: 0,
  dust: 0,
  materials: { tide_dew: 0 },
  trainSite: "shore",
  pets: [],
  ranch: [],
  lastTick: Date.now() - 40_000,
  daily: { date: "x", idleSec: 0, progress: {}, claimed: {} },
  achievements: {},
  stats: {},
  clearedDungeons: {},
  master: { name: "t", equip: {}, skillIds: [] },
  log: [],
};
tickCultivation(tickMatSt);
assert(Math.floor(tickMatSt.materials.tide_dew) >= 1, "deterministic train mats over 40s");

/* Offline bank: accrue without wallet credit until claim; accumulate up to cap */
const offSt = {
  realm: 0,
  qi: 100,
  stones: 0,
  feed: 0,
  dust: 0,
  materials: { ...emptyMaterials(), tide_dew: 0 },
  trainSite: "shore",
  pets: [makeStarterPet()],
  ranch: [],
  lastTick: Date.now() - (OFFLINE_HINT_SEC + 120) * 1000,
  daily: { date: todayKey(), idleSec: 0, progress: {}, claimed: {} },
  achievements: {},
  stats: {},
  clearedDungeons: {},
  master: { name: "t", equip: {}, skillIds: [] },
  log: [],
  offlineBank: null,
  offlineHint: null,
  tutorial: { done: true, step: null, flags: {} },
};
const qiBeforeOff = offSt.qi;
const dewBeforeOff = Math.floor(offSt.materials.tide_dew || 0);
tickCultivation(offSt);
assert((offSt.qi | 0) === (qiBeforeOff | 0), "offline tick does not credit qi until claim");
assert(Math.floor(offSt.materials.tide_dew || 0) === dewBeforeOff, "offline tick does not credit mats until claim");
const bank1 = offlineBankView(offSt);
assert(bank1.hasPending && bank1.sec >= OFFLINE_HINT_SEC, "offline bank has pending after gap");
assert((bank1.qi | 0) > 0 || (bank1.feed | 0) > 0 || Object.keys(bank1.materials || {}).length > 0, "offline bank accrued gains");
assert(offSt.offlineHint?.pending, "offline hint marks pending collect");
const sec1 = bank1.sec;
// second offline session accumulates
offSt.lastTick = Date.now() - (OFFLINE_HINT_SEC + 60) * 1000;
tickCultivation(offSt);
const bank2 = offlineBankView(offSt);
assert(bank2.sec > sec1, "uncollected offline bank keeps accumulating");
clearOfflineHint(offSt);
assert(offlineBankView(offSt).hasPending, "dismiss hint keeps bank");
const claimOff = claimOfflineBank(offSt);
assert(claimOff.ok, "claim offline bank ok");
assert((offSt.qi | 0) > (qiBeforeOff | 0), "claim credits qi");
assert(!offlineBankView(offSt).hasPending, "bank empty after claim");
// cap: fill bank to cap then refuse more
offSt.offlineBank = {
  qi: 1,
  feed: 0,
  dust: 0,
  materials: {},
  sec: OFFLINE_BANK_CAP_SEC,
  siteName: "潮岸",
  capped: true,
};
offSt.lastTick = Date.now() - (OFFLINE_HINT_SEC + 300) * 1000;
const qiAtCap = offSt.qi;
tickCultivation(offSt);
assert((offSt.offlineBank.sec | 0) === OFFLINE_BANK_CAP_SEC, "offline bank respects cap sec");
assert((offSt.qi | 0) === (qiAtCap | 0), "capped offline does not leak to wallet");
assert(offSt.offlineBank.capped, "offline bank marked capped");

/* Persist / restore idle combat session startedAt across save */
const persistWrap = {
  zoneId: "shore",
  tierIndex: 0,
  petSig: "p",
  formationId: "balanced",
  clearReady: false,
  canUnlockNext: true,
  resultLine: null,
  logLine: "test",
  session: { startedAt: 1_700_000_000_000, waveIndex: 2, waveCount: 5, ended: false },
};
const persistSt = { trainIdleCombat: null };
persistTrainIdleCombatState(persistSt, persistWrap);
const restored = restoreTrainIdleCombatState(persistSt);
assert(restored?.session?.startedAt === 1_700_000_000_000, "restore idle startedAt wall clock");
assert(restored.session.waveIndex === 2, "restore idle wave progress");
clearTrainIdleCombatState(persistSt);
assert(!restoreTrainIdleCombatState(persistSt), "clear idle combat state");

/* P13: egg-first tutorial flow */
const tut = { done: false, step: "hatch_starter", flags: { starterHatched: true } };
const tutPet = makeStarterPet();
tutPet.level = TUTORIAL_TRAIN_LEVEL;
const tutSt = {
  realm: 0,
  qi: 0,
  pets: [],
  ranch: [tutPet],
  eggs: [],
  combatsWon: 0,
  stones: 200,
  log: [],
  daily: { date: "x", idleSec: 0, progress: {}, claimed: {} },
  tutorial: tut,
};
normalizeTutorial(tutSt);
assert(tutorialActive(tutSt), "tutorial on for new");
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "meet_pet", "hatch_starter done");
tutSt.tutorial.flags.petDetailVisited = true;
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "train_pet", "meet_pet step");
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "deploy", "train_pet lv3");
tutSt.pets = [tutSt.ranch[0]];
tutSt.ranch = [];
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "dungeon_fight", "deploy step");
tutSt.tutorial.flags.dungeonStarted = true;
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "dungeon_win", "dung start");
tutSt.tutorial.flags.dungeonWonTutorial = true;
assert(advanceTutorialIfReady(tutSt).advanced && tutSt.tutorial.step === "shop_egg", "dung win");
assert(tutorialShopPrice(tutSt, 60) === TUTORIAL_SHOP_COST, "tutorial shop price");
ensureShop(tutSt);
const eggOfferTut = tutSt.shop.offers.find((o) => o.kind === "egg" && !o.bought);
assert(eggOfferTut, "tutorial egg offer");
const buyTut = buyShopOffer(tutSt, eggOfferTut.offerId);
assert(buyTut.ok && tutSt.eggs.length >= 1, "tutorial shop egg");
assert(tutSt.tutorial.step === "hatch_second", "shop egg step done");
const readyEgg = tutSt.eggs[0];
readyEgg.startedAt = Date.now() - 1;
readyEgg.readyAt = Date.now() - 1;
const claim2 = claimHatch(tutSt, readyEgg.uid);
assert(claim2.ok && tutSt.tutorial.step === "cultivate_qi", "second hatch to qi");

const skipSt = {
  realm: 0,
  qi: 0,
  pets: [],
  ranch: [],
  combatsWon: 0,
  stones: 200,
  log: [],
  tutorial: { done: false, step: "hatch_starter", flags: {} },
};
normalizeTutorial(skipSt);
assert(tutorialActive(skipSt), "skip pre active");
const skipR = skipTutorial(skipSt);
assert(skipR.ok && !tutorialActive(skipSt), "skip tutorial unlocks");
assert(skipSt.tutorial.done && skipSt.tutorial.step === "complete", "skip marks complete");

const meetHi = tutorialHighlights(
  {
    tutorial: { done: false, step: "meet_pet", flags: {} },
    ranch: [makeStarterPet()],
    pets: [],
    eggs: [],
  },
  { tab: "party", panelSub: { party: "ranch" } }
);
assert(meetHi.some((h) => h.type === "pet-detail"), "meet_pet highlights detail");

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
assert(BREED_COOLDOWN_MS === 45_000, "breed cd");
assert(FORGE_SCRAP_COST === 2, "forge scrap");
assert(fusionStoneCost(2) === 192, "fuse stage2 cost");
assert(upgradeStoneCost(1) === 19, "upgrade lv1");
assert(BOND_COST_MAX === 42, "bond cap");
const t1 = DUNGEONS.find((d) => d.id === "tide_1");
assert(t1?.reward?.stones === 32, "t1 stones");
const bg3 = BREAKTHROUGH_GATES[3];
assert(bg3.costs.dust === 12 && bg3.checks.find((c) => c.type === "breeds")?.need === 1, "bt gate 3");
assert(bg3.checks.find((c) => c.type === "bestiary")?.need === 12, "bt gate 3 bestiary");
assert(!(BREAKTHROUGH_GATES[5].checks || []).some((c) => c.type === "gear_equipped"), "no gear at r5");
assert(DUNGEON_CHALLENGE_RULES.every((r) => !r.banMaster), "no banMaster challenge");
assert(DUNGEON_CHALLENGE_RULES.some((r) => r.maxPets === 1), "solo pet challenge");
const dailyHybrid = BREED_GOALS.find((g) => g.id === "daily_hybrid");
assert(dailyHybrid?.type === "breed_cross_kind", "daily hybrid cross kind");

const qiSt = {
  realm: 0,
  qi: 60,
  pets: [],
  ranch: [makeStarterPet()],
  daily: { date: "x", idleSec: 120, progress: {}, claimed: {} },
  tutorial: { done: false, step: "cultivate_qi", flags: { qiIdleDone: true } },
};
normalizeTutorial(qiSt);
assert(tutorialQiReady(qiSt), "tutorial qi ready");
assert(!isCultivateSubLocked(qiSt, "advance"), "advance unlocked when qi ready");

assert((BREAKTHROUGH_GATES[1].checks || []).some((c) => c.type === "owned_pets"), "realm1 needs pet");
const brGate1 = breakthroughView({ realm: 0, qi: 60, stones: 30, combatsWon: 0, pets: [], ranch: [makeStarterPet()] });
assert(brGate1.items.every((i) => i.ok), "realm1 breakthrough ready with starter");
assert(!(BREAKTHROUGH_GATES[3].checks || []).some((c) => c.type === "gear_equipped"), "no gear gates");

const navIn = { tab: "cultivate", panelSub: { cultivate: "train", party: "fight", dungeon: "field", codex: "dex" } };
const codexSt = { tutorial: { done: false, step: "codex", flags: {} } };
const navOut = syncTutorialNavigation(codexSt, navIn);
assert(navOut.tab === "codex", "codex step navigates to codex");
const codexHi = tutorialHighlights(codexSt, navIn);
assert(codexHi.length === 1 && codexHi[0].type === "tab" && codexHi[0].id === "codex", "codex highlight tab");
assert(tutorialGlowClass(codexSt, { type: "tab", id: "codex" }, navIn) === " tut-glow", "codex glow");

const dungSt = {
  tutorial: { done: false, step: "dungeon_win", flags: { dungeonStarted: true } },
  combatsWon: 1,
};
assert(!advanceTutorialIfReady(dungSt).advanced, "dungeon win waits for tutorial flag");
dungSt.tutorial.flags.dungeonWonTutorial = true;
assert(advanceTutorialIfReady(dungSt).advanced && dungSt.tutorial.step === "shop_egg", "dungeon win to shop egg");

const codexDone = {
  realm: 0,
  tutorial: { done: false, step: "codex", flags: { codexVisited: false }, latePending: false, lateCompleted: false },
};
codexDone.tutorial.flags.codexVisited = true;
const codexAdv = advanceTutorialIfReady(codexDone);
assert(codexAdv.nextId === "complete" && codexDone.tutorial.done && codexDone.tutorial.latePending, "codex skips late until realm 2");

const lateStart = {
  realm: 2,
  tutorial: { done: true, step: "complete", flags: {}, latePending: true, lateCompleted: false },
};
const late = maybeStartLateTutorial(lateStart);
assert(late.started && lateStart.tutorial.step === "dispatch", "late tutorial at realm 2");
assert(LATE_TUTORIAL_MIN_REALM === 2, "late realm gate");

const tutDung = {
  realm: 1,
  pets: [{ uid: "p1", elementId: "gloom", speciesId: "x", atk: 1, hp: 1, spd: 1 }],
  tutorial: { done: false, step: "dungeon_fight", flags: {} },
};
normalizeTutorial(tutDung);
assert(tutorialWaivesDungeonChallenge(tutDung, "tide_1"), "tutorial waives tide_1 challenge");
assert(!tutorialWaivesDungeonChallenge(tutDung, "tide_2"), "no waive on t2");

const stepCodex = { tutorial: { done: false, step: "codex", flags: {}, latePending: false } };
normalizeTutorial(stepCodex);
const codexInfo = tutorialStepInfo(stepCodex);
assert(codexInfo.index === 12 && codexInfo.total === 12, "core tutorial 12/12 at codex");

const tacticsSt = {
  realm: 2,
  tutorial: { done: false, step: "tactics", flags: {}, latePending: true, lateCompleted: false },
};
normalizeTutorial(tacticsSt);
assert(isDungeonSubLocked(tacticsSt, "field"), "tactics locks dungeon field");
assert(!isDungeonSubLocked(tacticsSt, "setup"), "tactics allows setup");
const tacticsNav = syncTutorialNavigation(tacticsSt, {
  tab: "dungeon",
  panelSub: { dungeon: "field", party: "fight", cultivate: "train", codex: "dex" },
});
assert(tacticsNav.panelSub.dungeon === "setup", "tactics sync forces setup sub");

/* Week A: dungeon sweep + daily all-clear */
assert(DUNGEON_SUMMON_MIN === 1 && DUNGEON_SUMMON_MAX === 10, "summon range 1-10");
assert(clampDungeonSummonCount(0) === 1 && clampDungeonSummonCount(99) === 10, "clamp summon count");
assert(DUNGEON_SWEEP_COUNTS.includes(5), "legacy sweep counts");
assert(DUNGEON_ENTRY_MAT_ID === "mist_token", "entry mat is mist_token");
assert(DAILY_ALL_CLEAR_BONUS.stones >= 1, "all clear bonus defined");
assert(!canDungeonSweep(combatSt, "tide_1").ok, "no sweep before clear");
const sweepSt = {
  realm: 5,
  qi: 99999,
  stones: 9999,
  scrap: 99,
  dust: 99,
  feed: 99,
  materials: { mist_token: 50 },
  pets: [combatFox],
  ranch: [],
  pending: [],
  clearedDungeons: { tide_1: true },
  dungeonReadyAt: {},
  dungeonDaily: null,
  master: combatSt.master,
  tactics: "balanced",
  formation: "balanced",
  stats: {},
  bestiary: {},
  tideSeals: 0,
  log: [],
  combatsWon: 0,
  winStreak: 0,
  tutorial: { done: true, step: "complete", flags: {} },
};
assert(canDungeonSweep(sweepSt, "tide_1").ok, "sweep after clear");
const tokensBefore = sweepSt.materials.mist_token;
const summon = startDungeonSummon(sweepSt, "tide_1", 5);
assert(summon.ok && summon.batch === 5, "summon ×5 starts");
assert(sweepSt.materials.mist_token === tokensBefore - summon.tokenCost, "tokens spent on summon");
assert(dungeonGateView(sweepSt, "tide_1").phase === "summoning", "summoning phase");
// 快轉就緒
sweepSt.dungeonSummon.tide_1.readyAt = Date.now() - 1;
assert(dungeonGateView(sweepSt, "tide_1").phase === "ready", "summon ready");
const sweepRes = runDungeonSweep(sweepSt, "tide_1", 5);
assert(sweepRes.ok && sweepRes.sweep && sweepRes.count === 5, "sweep 5 runs");
assert(sweepRes.wins >= 1 && sweepRes.totalStones > 0, "sweep aggregate stones");
assert(dungeonGateView(sweepSt, "tide_1").phase === "idle", "gate idle after sweep");
const cost5 = dungeonSweepCost({ ...sweepSt, materials: { mist_token: 999 }, dungeonReadyAt: {}, dungeonSummon: {} }, "tide_1", 5);
const cost10 = dungeonSweepCost({ ...sweepSt, materials: { mist_token: 999 }, dungeonReadyAt: {}, dungeonSummon: {} }, "tide_1", 10);
assert(cost10.total > cost5.total, "10-sweep costs more than 5");
assert(clampDungeonSummonCount(7) === 7, "summon count 7 ok");
const teamPrev = dungeonTeamPreview(sweepSt, "tide_1");
assert(teamPrev?.ok && teamPrev.allies?.length >= 1 && teamPrev.foes?.length >= 1, "team preview");
assert(dungeonEntryMatCost("tide_1", 1).mist_token >= 1, "entry cost defined");
assert(!Object.values(DUNGEON_MAT_DROPS).some((t) => t.weights?.mist_token), "token absent from all dungeon tables");

/* ranch claim: only ranch slots count (deployed pets don't block) */
const ranchClaimSt = {
  realm: 1,
  stones: 100,
  scrap: 0,
  feed: 0,
  dust: 0,
  pets: [combatFox],
  ranch: [
    { ...combatFox, uid: "r1" },
    { ...combatFox, uid: "r2" },
    { ...combatFox, uid: "r3" },
    { ...combatFox, uid: "r4" },
  ],
  eggs: [],
  pending: [],
  bestiary: {},
  stats: {},
  log: [],
  tutorial: { done: true, step: "complete", flags: {} },
};
const claimEggReady = makeEgg("C", "test");
claimEggReady.startedAt = Date.now() - 1000;
claimEggReady.readyAt = Date.now() - 500;
ranchClaimSt.eggs = [claimEggReady];
assert(ranchClaimSt.ranch.length === 4 && ranchClaimSt.pets.length === 1, "4 ranch + 1 fight");
const hatchOk = claimHatch(ranchClaimSt, claimEggReady.uid);
assert(hatchOk.ok && ranchClaimSt.ranch.length === 5, "claim egg when ranch has space");

/* late tutorial tactics: visiting setup completes step */
const lateTac = {
  realm: 2,
  tutorial: { done: false, step: "tactics", flags: {}, latePending: true },
};
normalizeTutorial(lateTac);
const lateNav = syncTutorialNavigation(lateTac, {
  tab: "dungeon",
  panelSub: { dungeon: "field", party: "fight", cultivate: "train", codex: "dex" },
});
assert(lateNav.panelSub.dungeon === "setup", "late tactics forces setup");
lateTac.tutorial.flags.tacticsVisited = true;
assert(advanceTutorialIfReady(lateTac).advanced && lateTac.tutorial.done, "tactics visit completes late tutorial");

const dayKey = todayKey();
const dailyAllSt = {
  realm: 2,
  qi: 0,
  stones: 100,
  scrap: 0,
  feed: 0,
  dust: 0,
  pets: [combatFox],
  ranch: [],
  eggs: [],
  pending: [],
  clearedDungeons: {},
  daily: {
    date: dayKey,
    idleSec: 0,
    progress: {},
    claimed: {},
    allClearClaimed: false,
    hubDismissed: false,
  },
  stats: {},
  log: [],
};
for (const q of DAILY_QUESTS) {
  dailyAllSt.daily.progress[q.id] = q.need;
  dailyAllSt.daily.claimed[q.id] = true;
}
const acView = dailyAllClearView(dailyAllSt);
assert(acView.allClaimed && acView.canClaimAllClear, "all clear ready");
const acRes = claimDailyAllClear(dailyAllSt);
assert(acRes.ok && dailyAllSt.daily.allClearClaimed, "claimed all clear");
const claimSt = {
  ...dailyAllSt,
  daily: {
    date: dayKey,
    idleSec: 0,
    progress: Object.fromEntries(DAILY_QUESTS.map((q) => [q.id, q.need])),
    claimed: {},
    allClearClaimed: false,
    hubDismissed: false,
  },
};
const allRes = claimAllDailies(claimSt);
assert(allRes.ok && allRes.claimed === DAILY_QUESTS.length, "claim all dailies");

const __dir = dirname(fileURLToPath(import.meta.url));
const uiSrc = readFileSync(join(__dir, "ui.js"), "utf8");
assert(uiSrc.includes("data-summon"), "ui summon bind");
assert(uiSrc.includes("data-attack-preview"), "ui attack preview");
assert(uiSrc.includes("data-open-dispatch"), "ui dispatch picker modal");
assert(uiSrc.includes('party: "dispatch"'), "ui stay on dispatch after start");
assert(!/confirm-dispatch[\s\S]{0,400}party:\s*"ranch"/.test(uiSrc), "ui not redirect ranch after dispatch");
assert(uiSrc.includes("petMatchesDispatchMission"), "ui filters dispatch req pets");
assert(uiSrc.includes("data-summon-slider"), "ui summon slider");
assert(uiSrc.includes("data-ranch-sort"), "ui ranch sort");
assert(uiSrc.includes("pet-grid"), "ui ranch 2-col grid");
assert(uiSrc.includes('id: "breed"'), "ui breed party sub-tab");
assert(uiSrc.includes("breed-cd-bar"), "ui breed cd bar");
assert(uiSrc.includes("data-breed-claim"), "ui breed claim after CD");
assert(uiSrc.includes("data-dungeon-blocked"), "ui dungeon blocked reason");
assert(BREED_QUEUE_MAX === 3, "breed queue max 3");
assert(uiSrc.includes("panel-subnav-dock"), "ui subnav near bottom tabs");
assert(uiSrc.includes("function wrapStage"), "ui has wrapStage layout helper");
assert(uiSrc.includes("tabs-bottom"), "ui has bottom tab bar");
assert(uiSrc.includes("statsSheetHtml"), "ui has stats resource sheet");

/* Ranch idle + dispatch gen mult */
const idlePet = {
  ...buildPetStats({
    id: "idle1",
    species: "reefox",
    element: "tide",
    personality: "diligent",
    cost: 0,
  }),
  uid: "idle-ranch-1",
};
const idleSt = {
  feed: 0,
  dust: 0,
  materials: { mist_token: 0 },
  ranch: [idlePet],
  pets: [],
  dispatches: [],
  log: [],
};
tickRanchIdle(idleSt, 100);
assert(idleSt.feed > 0 && idleSt.dust > 0, "ranch idle produces feed/dust");
assert((idleSt.materials.mist_token || 0) > 0, "ranch idle produces mist_token");

const fightIdle = {
  ...buildPetStats({
    id: "idle2",
    species: "reefox",
    element: "tide",
    personality: "fierce",
    cost: 0,
  }),
  uid: "idle-ranch-2",
};
const idleFightSt = {
  feed: 0,
  dust: 0,
  materials: { mist_token: 0 },
  ranch: [fightIdle],
  pets: [],
  dispatches: [],
  log: [],
};
tickRanchIdle(idleFightSt, 100);
assert(idleSt.feed > idleFightSt.feed, "diligent idle > fierce idle");

const mission = DISPATCH_MISSIONS.find((m) => m.id === "forage") || DISPATCH_MISSIONS.find((m) => !m.needSite);
assert(mission?.needElement === "tide", "forage needs tide");
assert(petMatchesDispatchMission({ elementId: "tide", kind: "獸" }, mission), "tide beast matches forage");
assert(!petMatchesDispatchMission({ elementId: "flame", kind: "獸" }, mission), "flame fails forage");
assert(dispatchMissionReqLabel(mission).includes("潮"), "req label tide");
const kindMission = DISPATCH_MISSIONS.find((m) => m.needKind && !m.needElement);
assert(kindMission && !petMatchesDispatchMission({ elementId: "tide", kind: "獸" }, kindMission), "kind gate rejects");
assert(petMatchesDispatchMission({ elementId: "tide", kind: kindMission.needKind }, kindMission), "kind gate accepts");
const gen3Pet = {
  ...buildPetStats({
    id: "d3",
    species: "reefox",
    element: "tide",
    personality: "patient",
    cost: 0,
  }),
  uid: "disp-gen3",
  generation: 3,
};
const dispSt = {
  stones: 0,
  scrap: 0,
  feed: 0,
  dust: 0,
  materials: {},
  ranch: [gen3Pet],
  pets: [],
  dispatches: [
    {
      dispatchId: "d-test",
      missionId: mission.id,
      petUids: ["disp-gen3"],
      readyAt: Date.now() - 1000,
      claimed: false,
    },
  ],
  dispatchBoard: [],
  stats: {},
  daily: { date: todayKey(), progress: {}, claimed: {}, idleSec: 0 },
  log: [],
  achievements: {},
};
const beforeStones = mission.reward?.stones || 0;
const claimR = claimDispatch(dispSt, "d-test");
assert(claimR.ok, "claim dispatch ok");
if (beforeStones) {
  assert(dispSt.stones >= Math.round(beforeStones * 1.25), "gen3 dispatch reward mult");
}
assert(dispSt.dispatchBoard.length >= 1, "claim refills dispatch board");
assert(claimR.boardFilled, "claim returns boardFilled id");

/* Dispatch board rotate + slot cap + restrictions */
const dispTidePet = {
  ...buildPetStats({
    id: "dt",
    species: "reefox",
    element: "tide",
    personality: "gentle",
    cost: 0,
  }),
  uid: "disp-tide",
};
const dispScalePet = {
  ...buildPetStats({
    id: "ds",
    species: "tidecarp",
    element: "tide",
    personality: "gentle",
    cost: 0,
  }),
  uid: "disp-scale",
};
const boardSt = {
  realm: 0,
  clearedDungeons: {},
  trainMap: {},
  ranch: [dispTidePet, dispScalePet],
  pets: [],
  dispatches: [],
  dispatchBoard: [],
  eggs: [],
  log: [],
  stats: {},
  daily: { date: todayKey(), progress: {}, claimed: {}, idleSec: 0 },
  achievements: {},
};
ensureDispatchBoard(boardSt, () => 0);
assert(boardSt.dispatchBoard.length === 2, "early board fills unlocked only (2)");
assert(boardSt.dispatchBoard.every((id) => ["forage", "egg_shore"].includes(id)), "early board from shore pool");
const dv0 = dispatchView(boardSt);
assert(dv0.slotsMax === 3 && dv0.boardSize === 3, "view exposes slot/board caps");
assert(dv0.missions.length === 2, "view shows board missions only");
const wrongKind = startDispatch(boardSt, "egg_shore", ["disp-tide"]);
assert(!wrongKind.ok && String(wrongKind.msg).includes("限制"), "kind restriction blocks");
const okStart = startDispatch(boardSt, "forage", ["disp-tide"]);
assert(okStart.ok, "tide pet starts forage");
assert(!boardSt.dispatchBoard.includes("forage"), "started mission leaves board");
assert(boardSt.dispatches.length === 1, "one active dispatch");
const beforeBoard = [...boardSt.dispatchBoard];
boardSt.dispatches[0].readyAt = Date.now() - 1;
const claimBoard = claimDispatch(boardSt, boardSt.dispatches[0].dispatchId);
assert(claimBoard.ok, "claim after ready");
assert(boardSt.dispatchBoard.length === beforeBoard.length + 1, "board grew after claim");
assert(claimBoard.boardFilled, "random mission pulled on claim");

const nowCap = Date.now();
const capSt = {
  realm: 0,
  ranch: [
    { ...dispTidePet, uid: "c1" },
    { ...dispScalePet, uid: "c2" },
    { ...dispTidePet, uid: "c3" },
    { ...dispScalePet, uid: "c4" },
  ],
  pets: [],
  dispatches: [
    {
      dispatchId: "cap-a",
      missionId: "forage",
      petUids: ["c1"],
      readyAt: nowCap + 60_000,
      claimed: false,
    },
    {
      dispatchId: "cap-b",
      missionId: "egg_shore",
      petUids: ["c2"],
      readyAt: nowCap + 60_000,
      claimed: false,
    },
    {
      dispatchId: "cap-c",
      missionId: "dust_hunt",
      petUids: ["c3"],
      readyAt: nowCap + 60_000,
      claimed: false,
    },
  ],
  dispatchBoard: ["forage"],
  log: [],
  stats: {},
  daily: { date: todayKey(), progress: {}, claimed: {}, idleSec: 0 },
  achievements: {},
};
const over = startDispatch(capSt, "forage", ["c4"]);
assert(!over.ok && String(over.msg).includes("滿"), "4th concurrent blocked at 3");

/* Feed upgrade deducts; fusion gated; dungeon realm block msg */
const feedUpSt = {
  feed: 100,
  stones: 100,
  materials: { tide_dew: 10 },
  ranch: [
    {
      ...buildPetStats({
        id: "up1",
        species: "reefox",
        element: "tide",
        personality: "gentle",
        cost: 0,
      }),
      uid: "up-pet",
      level: 1,
    },
  ],
  pets: [],
  log: [],
};
const feedBefore = feedUpSt.feed;
const upR = upgradePet(feedUpSt, "up-pet", "feed");
assert(upR.ok && feedUpSt.feed < feedBefore, "feed upgrade deducts feed");
assert(feedUpSt.ranch[0].level === 2, "feed upgrade levels pet");

assert(!isFusionUnlocked({ clearedDungeons: {} }), "fusion locked pre t3");
assert(isFusionUnlocked({ clearedDungeons: { tide_3: true } }), "fusion unlock t3");
const fuseLock = fusePets({ clearedDungeons: {}, pets: [], ranch: [], stones: 999, materials: {} }, "x", ["y"]);
assert(!fuseLock.ok && fuseLock.msg.includes("心核"), "fuse blocked msg");

const blockRealm = dungeonAttackBlockReason(
  { realm: 2, pets: [{ uid: "a" }], clearedDungeons: {} },
  "tide_3"
);
assert(blockRealm && blockRealm.includes("御靈"), "tide3 needs 御靈");

/* Breed queue: start → gestate CD → claim (like dungeon summon) */
function mkBreedPet(uid, species, element) {
  return {
    ...buildPetStats({
      id: uid,
      species,
      element,
      personality: "gentle",
      cost: 0,
    }),
    uid,
    generation: 0,
  };
}
const breedQSt = {
  stones: 500,
  materials: { coral_shard: 20 },
  ranch: [
    mkBreedPet("bq-a", "reefox", "tide"),
    mkBreedPet("bq-b", "reefox", "tide"),
    mkBreedPet("bq-c", "glowfin", "tide"),
    mkBreedPet("bq-d", "glowfin", "tide"),
  ],
  pets: [],
  breedJobs: [],
  breedReadyAt: 0,
  breedPair: null,
  dispatches: [],
  log: [],
  stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
  bestiary: {},
  daily: { date: todayKey(), progress: {}, claimed: {} },
  breedGoals: { date: todayKey(), week: "w", progress: {}, claimed: {} },
  achievements: {},
};
const ranchBefore = breedQSt.ranch.length;
const start1 = tryBreed(breedQSt, "bq-a", "bq-b");
assert(start1.ok && start1.started && start1.job?.id, "breed start enqueues job");
assert(breedQSt.ranch.length === ranchBefore, "breed start does not birth yet");
assert(breedQSt.breedJobs.length === 1, "one gestating job");
const start2 = tryBreed(breedQSt, "bq-c", "bq-d");
assert(start2.ok && breedQSt.breedJobs.length === 2, "second concurrent mating ok");
const busyDup = tryBreed(breedQSt, "bq-a", "bq-c");
assert(!busyDup.ok, "busy parent cannot remate");
assert(breedBusyUids(breedQSt).has("bq-a"), "busy uids lock parents");
const early = claimBreed(breedQSt, start1.job.id);
assert(!early.ok && String(early.msg).includes("孕育"), "cannot claim before CD");
const bsMid = breedStatus(breedQSt);
assert(bsMid.slotsUsed === 2 && bsMid.claimable.length === 0, "status shows gestating");
breedQSt.breedJobs[0].readyAt = Date.now() - 1;
const claim1 = claimBreed(breedQSt, start1.job.id);
assert(claim1.ok && claim1.pet, "claim after ready births child");
assert(breedQSt.ranch.length === ranchBefore + 1, "child added on claim");
assert(breedQSt.breedJobs.length === 1, "claimed job removed");
breedQSt.materials.breed_ticket = 1;
const ticket = useBreedTicket(breedQSt);
assert(ticket.ok && breedStatus(breedQSt).claimable.length === 1, "breed ticket readies job");

/* Tide zones: mist tiers, depth yield, warden keys */
assert(TRAIN_ZONE_CHAIN.length === TRAIN_SITES.length, "zone chain matches sites");
assert(TRAIN_DEPTH_MULT.length === TRAIN_TIER_COUNT + 1, "depth mult fog+warden");
assert(TRAIN_MIST_WAVE_COUNT === 5, "mist layer wave count");
assert(TRAIN_WARDEN_WAVE_COUNT >= TRAIN_MIST_WAVE_COUNT, "warden has more waves");
assert(MATERIALS.tide_key_1?.tier === "key" && MATERIALS.warden_echo?.tier === "key", "key mats");
assert(
  !TRAIN_SITES.some((s) => (s.drops || []).some((d) => MATERIALS[d.mat]?.tier === "key")),
  "no keys on AFK drops"
);
const gKey = rollTideKeyDrop("tide_1", { guaranteed: true });
assert(gKey?.matId === "tide_key_1", "guaranteed tide key");
let keyHits = 0;
for (let i = 0; i < 40; i++) {
  if (rollTideKeyDrop("tide_1", { bossCleared: true })) keyHits += 1;
}
assert(keyHits >= 15 && keyHits < 40, "tide key high chance not always");

const strongPet = {
  ...buildPetStats({
    id: "tz1",
    species: "reefox",
    element: "tide",
    personality: "fierce",
    cost: 0,
  }),
  uid: "tz-pet",
  atk: 80,
  hp: 400,
  spd: 40,
  generation: 2,
};
const tzSt = {
  stones: 100,
  materials: { tide_key_1: 3, tide_dew: 0, coral_shard: 0, warden_echo: 0 },
  trainSite: "shore",
  trainMap: { zones: { shore: { tiersCleared: 0 } }, wardenCleared: {} },
  pets: [strongPet],
  ranch: [],
  realm: 0,
  tactics: "balanced",
  formation: "balanced",
  clearedDungeons: {},
  log: [],
  daily: { date: todayKey(), progress: {}, claimed: {} },
  stats: {},
  achievements: {},
};
assert(trainDepthMultFor(tzSt, "shore") === 1, "depth mist1");
const d0 = Math.floor(tzSt.materials.tide_dew);
const tierCombat = runTrainLayerCombat(tzSt, { zoneId: "shore", tierIndex: 0, mode: "tier" });
assert(tierCombat.ok && tierCombat.won, "train tier combat win strong party");
assert(tierCombat.waves === TRAIN_MIST_WAVE_COUNT, "train tier has 5 waves");
assert(tierCombat.combatEvents?.some((e) => e.type === "wave"), "train tier wave events");
assert(tierCombat.combatEvents?.some((e) => e.type === "strike"), "train tier strike events");
const weakSt = {
  ...tzSt,
  pets: [{ ...strongPet, atk: 2, hp: 20, spd: 2, uid: "weak-only" }],
};
const tierFail = runTrainLayerCombat(weakSt, { zoneId: "shore", tierIndex: 0, mode: "tier" });
assert(tierFail.ok && !tierFail.won, "weak party fails train tier");
const claimBlocked = claimTrainTierClear(tzSt);
assert(!claimBlocked.ok, "cannot claim next without clearReady");
const idleSess = createTrainIdleSession(tzSt);
assert(idleSess && idleSess.waveCount === TRAIN_MIST_WAVE_COUNT, "idle session 5 waves");
assert(idleSess.foes?.length >= 1 && idleSess.allies?.length >= 1, "idle session units");
assert(typeof idleSess.startedAt === "number", "idle session startedAt wall clock");
// 回撥開始時間，驗證通關秒數用牆鐘而非出手步數
idleSess.startedAt = Date.now() - 90_000;
let idleSteps = 0;
let idleWon = false;
while (idleSteps < 500 && !idleWon) {
  const step = stepTrainIdleSession(idleSess);
  idleSteps += 1;
  if (step.status === "won") {
    idleWon = true;
    const marked = markTrainIdleClearReady(tzSt, idleSess);
    assert(marked.ok && !marked.autoClaimed, "mark clear ready for mist1");
    assert(/首次通關：\d+s/.test(idleSess.resultLine || ""), "first clear time line");
    assert(idleSess.clearSec >= 90, "clear sec uses wall clock not fight ticks");
    assert(
      idleSess.clearSec !== (idleSess.fightTicks | 0) || (idleSess.fightTicks | 0) >= 90,
      "clear sec not equal to fight-tick count alone"
    );
    break;
  }
  if (step.status === "restart") break;
}
assert(idleWon, "idle session can clear with strong party");
assert(tzSt.trainMap.zones.shore.clearReady, "clearReady persisted");
assert(persistTrainIdleClearResult(tzSt, idleSess), "persist shore lastClear");
assert(
  /首次通關：\d+s/.test(tzSt.trainMap.zones.shore.lastClear?.line || ""),
  "shore zone stores clear line"
);
assert(tzSt.trainMap.zones.shore.lastClear?.sec >= 90, "persisted clear sec wall clock");
assert(ACTIVE_PET_MAX === 3, "party size stays 3 for formation slots");
// per-zone clear line: ruins empty until cleared; shore keeps its own
tzSt.trainMap.zones.ruins = tzSt.trainMap.zones.ruins || { tiersCleared: 0 };
assert(!tzSt.trainMap.zones.ruins.lastClear, "ruins has no clear yet");
tzSt.trainSite = "ruins";
const ruinsView = trainIdleCombatView(tzSt);
assert(ruinsView.zoneId === "ruins", "train site switched to ruins");
assert(!ruinsView.lastClearLine, "ruins view has no clear line after switch");
tzSt.trainSite = "shore";
const shoreView = trainIdleCombatView(tzSt);
assert(
  shoreView.lastClearLine === tzSt.trainMap.zones.shore.lastClear.line,
  "shore clear line returns after switch back"
);
assert(typeof setTrainSite === "function", "setTrainSite exported for site switch");
// claim mist 1–3 manually; mist 4 auto-claims to warden gate
for (let i = 0; i < 3; i++) {
  tzSt.trainMap.zones.shore.clearReady = true;
  const ar = claimTrainTierClear(tzSt);
  assert(ar.ok, `claim tier ${i + 1}`);
  assert(!tzSt.trainMap.zones.shore.clearReady, `clearReady spent ${i + 1}`);
}
assert(tzSt.trainMap.zones.shore.tiersCleared === 3, "3 mist tiers claimed");
const lastSess = createTrainIdleSession(tzSt);
assert(lastSess && lastSess.tierIndex === 3, "last mist session at tier 4");
let lastSteps = 0;
let lastWon = false;
while (lastSteps < 500 && !lastWon) {
  const step = stepTrainIdleSession(lastSess);
  lastSteps += 1;
  if (step.status === "won") {
    lastWon = true;
    const marked = markTrainIdleClearReady(tzSt, lastSess);
    assert(marked.ok && marked.autoClaimed, "last mist auto-claims (next is warden)");
    break;
  }
  if (step.status === "restart") break;
}
assert(lastWon, "last mist idle clear");
assert(tzSt.trainMap.zones.shore.tiersCleared === 4, "4 mist tiers cleared");
assert(!tzSt.trainMap.zones.shore.clearReady, "no clearReady after last mist");
const sitesAfter = trainSitesView(tzSt);
const shoreAfter = sitesAfter.find((s) => s.id === "shore");
assert(shoreAfter?.canChallengeWarden, "warden challenge available after mist4");
assert(!shoreAfter?.canClaimNext, "no go-next after mist4");
assert(trainDepthMultFor(tzSt, "shore") === 1.35, "depth at mist4");
assert(!unlockedTrainSiteIds(tzSt).includes("ruins"), "ruins locked until warden");
const wFailKey = { ...tzSt, materials: { ...tzSt.materials, tide_key_1: 0 } };
assert(!challengeTrainWarden(wFailKey).ok, "warden needs key");
const w1 = challengeTrainWarden(tzSt);
assert(w1.ok && w1.firstClear, "warden first clear");
assert(tzSt.trainMap.wardenCleared.shore, "shore warden flagged");
assert(trainDepthMultFor(tzSt, "shore") === 1.5, "depth after warden");
assert(unlockedTrainSiteIds(tzSt).includes("ruins"), "ruins unlock via warden");
assert(tzSt.materials.tide_key_1 === 2, "key spent on warden");
// rematch rare
tzSt.trainSite = "shore";
const rem = challengeTrainWarden(tzSt);
assert(rem.ok && rem.rematch, "warden rematch");
assert((tzSt.materials.warden_echo || 0) >= 1, "rematch drops echo");
assert(tzSt.materials.tide_key_1 === 1, "rematch spends key");
const effStrong = trainClearEfficiency(
  { ...tzSt, pets: [strongPet], trainSite: "shore", trainMap: tzSt.trainMap },
  "shore"
);
const effWeak = trainClearEfficiency(
  {
    ...tzSt,
    pets: [{ ...strongPet, atk: 2, hp: 20, spd: 2, uid: "weak" }],
    trainSite: "shore",
    trainMap: tzSt.trainMap,
  },
  "shore"
);
assert(effStrong > effWeak, "strong party higher AFK efficiency");
const idle = trainIdleCombatView(tzSt);
assert(idle.petCount >= 1 && idle.waveCount === TRAIN_MIST_WAVE_COUNT, "idle combat strip data");
assert(DAILY_QUESTS.some((q) => q.id === "train_tier"), "daily train_tier");
assert(DAILY_QUESTS.some((q) => q.id === "train_warden"), "daily train_warden");

const setD = setTrainDepth(tzSt, 1);
assert(setD.ok && trainDepthMultFor(tzSt, "shore") === TRAIN_DEPTH_MULT[1], "set depth to tier 2");
const setDFail = setTrainDepth({ ...tzSt, trainMap: { ...tzSt.trainMap, wardenCleared: {} }, trainSite: "shore" }, 4);
assert(!setDFail.ok, "cannot set depth beyond cleared");

const uiSrc2 = readFileSync(join(__dir, "ui.js"), "utf8");
assert(uiSrc2.includes("playAttackSequence"), "ui phased attack sequence");
assert(uiSrc2.includes("lungeTowardTarget"), "ui vector lunge toward target");
assert(uiSrc2.includes("getBoundingClientRect"), "ui lunge uses element rects");
assert(uiSrc2.includes('data-slot="'), "ui formation data-slot attrs");
assert(uiSrc2.includes('data-lane="'), "ui formation data-lane attrs");
assert(uiSrc2.includes("combat-formation"), "ui formation roster class");
assert(uiSrc2.includes("formationAllyPlacement"), "ui uses ally placement helper");
assert(uiSrc2.includes("FORMATION_SLOT_COUNT"), "ui 3-slot formation");
assert(uiSrc2.includes("persistTrainIdleClearResult"), "ui persists zone lastClear");
assert(uiSrc2.includes("idleCombatResultLine"), "ui gates clear line to ended session");
assert(
  !/trainIdleCombatView\(state\)\.lastClearLine\s*\|\|/.test(uiSrc2),
  "ui no longer prefers lastClearLine for live hit footer"
);
assert(uiSrc2.includes("is-defender"), "ui defender highlight");
assert(uiSrc2.includes("data-claim-tier"), "ui claim next mist tier");
assert(uiSrc2.includes("去下一層"), "ui claim next label");
assert(!uiSrc2.includes("data-advance-tier"), "ui no manual advance fight button");
assert(!uiSrc2.includes("advanceCooldownAt"), "ui no advance cooldown");
assert(uiSrc2.includes("createTrainIdleSession"), "ui idle wave session");
assert(uiSrc2.includes("tickIdleCombat({ background"), "ui idle combat ticks in background");
assert(uiSrc2.includes("persistTrainIdleCombatState"), "ui persists idle combat session");
assert(uiSrc2.includes("restoreTrainIdleCombatState"), "ui restores idle combat session");
assert(uiSrc2.includes("claim-offline"), "ui offline collect button");
assert(uiSrc2.includes("claimOfflineBank"), "ui claims offline bank");
assert(uiSrc2.includes("visibilitychange"), "ui catch-up on tab visible");
assert(uiSrc2.includes("data-challenge-warden"), "ui challenge warden");
assert(uiSrc2.includes("train-idle-strip"), "ui idle combat strip");
assert(uiSrc2.includes("data-set-depth"), "ui depth selector");
assert(uiSrc2.includes('id: "mats"'), "ui materials sub-tab");
assert(!uiSrc2.includes("br.items.slice(0, 6)"), "ui breakthrough checklist shows all gates");
assert(!uiSrc2.includes("gateCompact"), "ui no truncated gateCompact list");
assert(uiSrc2.includes("breakthrough-gates"), "ui breakthrough gates list class");
assert(uiSrc2.includes("未齊·"), "ui break button hints first unmet");
assert(uiSrc2.includes("breakthrough-miss-note"), "ui shows remaining gate count");
const cssSrc = readFileSync(join(__dir, "../css/style.css"), "utf8");
assert(cssSrc.includes("cond-list.is-compact"), "css compact breakthrough checklist");
assert(cssSrc.includes("combat-formation-side"), "css formation side grid");
assert(cssSrc.includes("is-empty-slot"), "css empty formation slots");
assert(cssSrc.includes('data-lane="front"'), "css front lane columns");
assert(cssSrc.includes('data-lane="rear"'), "css rear lane columns");
assert(!cssSrc.includes("is-lunge-east"), "css no legacy east lunge");

/* Tide Abyss Dive */
assert(MATERIALS.abyss_grit?.tier === "abyss", "abyss grit material");
assert(ABYSS_MUTATION_IDS.length === 3, "three abyss mutations");
assert(ABYSS_COSMETIC_IDS.length >= 3, "abyss cosmetics");
{
  const abyssSt = {
    realm: 1,
    pets: [
      {
        uid: "ap1",
        name: "淵測",
        speciesId: "reefox",
        elementId: "tide",
        personalityId: "fierce",
        kind: "獸",
        atk: 60,
        hp: 280,
        spd: 28,
        level: 8,
        skillLevel: 1,
        generation: 1,
        bloodmarks: [],
      },
    ],
    materials: { ...emptyMaterials(), mist_token: 5, abyss_grit: 200 },
    clearedDungeons: { tide_1: true },
    formation: "balanced",
    tactics: "balanced",
    eggs: [],
    log: [],
    abyssDive: emptyAbyssDive(),
  };
  const av = abyssDiveView(abyssSt);
  assert(av.unlocked && av.freeLeft, "abyss unlocked free first");
  const s1 = startAbyssDive(abyssSt);
  assert(s1.ok && s1.won && s1.depth === 1 && s1.combatEvents?.length, "abyss floor 1 clear");
  assert(s1.clearedDepth === 1 && s1.nextFloor?.depth === 2, "abyss settle cleared + next preview");
  assert(String(s1.msg || "").includes("已通關第 1 層"), "abyss win copy means cleared");
  assert(s1.combatKind === "abyss" && s1.gritGained > 0, "abyss grit on clear");
  assert(abyssSt.abyssDive.run?.pendingGrit > 0, "pending grit after floor");
  const s3 = advanceAbyssDive(abyssSt);
  assert(s3.ok, "abyss floor 2");
  const s4 = advanceAbyssDive(abyssSt);
  assert(s4.ok && (abyssSt.abyssDive.run?.mutationIds || []).length >= 1, "mutation by floor 3");
  if (s4.won) {
    assert(s4.nextFloor?.depth === 4, "next floor after clear 3");
    assert(s4.mutations?.length >= 1, "settlement lists mutations");
  }
  const before = Math.floor(abyssSt.materials.abyss_grit || 0);
  const ret = retreatAbyssDive(abyssSt);
  assert(ret.ok && ret.grit > 0, "retreat grants grit");
  assert(String(ret.msg || "").includes("已通第"), "retreat copy cleared depth");
  assert(Math.floor(abyssSt.materials.abyss_grit) === before + ret.grit, "grit banked");
  assert(!abyssSt.abyssDive.run, "run cleared on retreat");
  // wipe settlement fields
  {
    const wipeSt = {
      realm: 1,
      pets: [
        {
          uid: "aw1",
          name: "弱測",
          speciesId: "reefox",
          elementId: "tide",
          personalityId: "fierce",
          kind: "獸",
          atk: 1,
          hp: 8,
          spd: 1,
          level: 1,
          skillLevel: 1,
          generation: 1,
          bloodmarks: [],
        },
      ],
      materials: { ...emptyMaterials(), mist_token: 5, abyss_grit: 0 },
      clearedDungeons: { tide_1: true },
      formation: "balanced",
      tactics: "balanced",
      eggs: [],
      log: [],
      abyssDive: {
        ...emptyAbyssDive(),
        run: {
          seed: "wipe-test",
          depth: 2,
          pendingGrit: 20,
          mutationIds: ["mut_no_heal"],
          startedAt: Date.now(),
        },
      },
    };
    const wipe = advanceAbyssDive(wipeSt);
    assert(wipe.ok && wipe.wiped && !wipe.won, "abyss wipe result");
    assert(wipe.failedDepth === 3 && wipe.clearedDepth === 2, "wipe depth copy");
    assert(wipe.gritKept === Math.floor(20 * ABYSS_WIPE_KEEP_RATE), "wipe keep rate");
    assert(wipe.combatKind === "abyss" && wipe.combatEvents?.length, "wipe still has playback");
    assert(!wipeSt.abyssDive.run, "wipe clears run");
  }
  assert(buyAbyssInsurance(abyssSt).ok, "buy insurance");
  assert(buyAbyssCosmetic(abyssSt, "veil_mark").ok, "buy cosmetic");
  assert(abyssSt.abyssDive.cosmetics.veil_mark, "cosmetic owned");
  const eggR = buyAbyssEgg(abyssSt);
  assert(eggR.ok && eggR.egg?.source === "abyss_dive", "buy abyss egg");
  assert(TRAIN_SITES.every((s) => !(s.drops || []).some((d) => d.mat === "abyss_grit")), "train drops no grit");
}
assert(uiSrc2.includes("abyssDiveView"), "ui abyss view");
assert(uiSrc2.includes("data-abyss-start"), "ui abyss start");
assert(uiSrc2.includes("潮淵"), "ui abyss tab label");
assert(uiSrc2.includes("isAbyssCombat"), "ui excludes abyss from farm skip");
assert(uiSrc2.includes("abyssSettlementHtml"), "ui abyss settlement block");
assert(uiSrc2.includes("abyss-continue-floor"), "ui continue next floor");
assert(uiSrc2.includes("abyss-retreat-settle"), "ui retreat from combat settle");
assert(uiSrc2.includes("已通關第"), "ui cleared-floor copy");
assert(uiSrc2.includes("下一層預覽"), "ui next floor preview");
assert(cssSrc.includes("combat-report-card--abyss-settle"), "css abyss settle enlarge");

/* Pet detail explain tabs */
{
  const el = elementExplain("tide");
  assert(el?.name === "潮" && el.beats === "焰" && el.beatenBy === "幽", "tide element explain");
  assert(el.blurb.includes("潮"), "tide blurb");
  const kd = kindExplain("獸");
  assert(kd?.focus && kd.skillName === "撲襲", "kind 獸 explain");
  const pe = personalityExplain("fierce");
  assert(pe?.combatLabel.includes("攻擊") && pe.roleLabel === "戰鬥向", "fierce personality explain");
  assert(skillTypeLabel("cleave") === "群體攻擊", "skill type label");
  assert(Object.keys(ELEMENT_EXPLAIN).length === 5, "five element explains");
  assert(Object.keys(KIND_EXPLAIN).length === KINDS.length, "kind explain covers KINDS");
  for (const id of Object.keys(PERSONALITIES)) {
    assert(personalityExplain(id)?.combatLabel, `personality explain ${id}`);
  }
}
assert(uiSrc2.includes("data-pet-detail-tab"), "ui pet detail tabs");
assert(uiSrc2.includes("petDetailStatsHtml"), "ui stats tab helper");
assert(uiSrc2.includes("petDetailTemperHtml"), "ui temper tab helper");
assert(uiSrc2.includes("petDetailSkillsHtml"), "ui skills tab helper");
assert(uiSrc2.includes("戰鬥被動"), "ui personality combat copy");
assert(uiSrc2.includes("相剋"), "ui element matchup copy");
assert(uiSrc2.includes("data-upgrade-skill") && uiSrc2.includes("data-temper-oil"), "ui keep upgrade/temper");
assert(cssSrc.includes("pet-detail-tabs"), "css pet detail tabs");
assert(cssSrc.includes("pet-explain"), "css pet explain blocks");

console.log("odds 1+2", odds12, "sample genes", g.generation, g.hybrid);
console.log("smoke-test ok");
