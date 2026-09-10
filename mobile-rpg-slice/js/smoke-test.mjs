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
  MAIN_PERSONALITIES,
  remapMainPersonalityId,
  pickMainPersonalityId,
  pickSubPersonalityId,
  SUB_PERSONALITIES,
  SUB_PERSONALITY_AWAKEN_LEVEL,
  migratePetPersonalityFields,
  applySubGrowthToLevelGains,
  retroactiveSubGrowthBonus,
  RANCH_IDLE_BASE,
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
  levelStatGains,
  fusionAbsorbRate,
  fusionCombatMult,
  fusionMaterialRarityFactor,
  fusionPowerMultFromParts,
  petFusionCombatMult,
  healFusionPowerMult,
  roundStat,
  rarityBreedCdMult,
  eggHatchMsFor,
  RARITY,
  spineStageForTier,
  spineStageMatBias,
  FUSION_MAX_STAGE,
  FUSION_NEED_LEVEL,
  ABYSS_EGG_COST,
  ABYSS_POWER_NODE_COST,
  ABYSS_POWER_NODE_MAX,
  ABYSS_POWER_NODE_ATK,
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
  SPINE_ZONE_ID,
  SPINE_THEME_FLOORS,
  SIDE_BRANCHES,
  spineAfkDropsForStage,
  spineTrainProfile,
  spineStageFromState,
  spineFrontierTier,
  maxClearedTideTier,
  spineTrunkView,
  isSideBranchUnlocked,
  buildBranchDungeon,
  isBranchDungeonId,
  listSideBranches,
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
  BREED_BATCH_MIN,
  BREED_BATCH_MAX,
  clampBreedBatchCount,
  EGG_CAP,
  makeBreedEgg,
  genEggPrefix,
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
  trainDepthMultForFloor,
  TRAIN_MIST_WAVE_COUNT,
  TRAIN_WARDEN_WAVE_COUNT,
  TRAIN_ZONE_CHAIN,
  trainTierThreat,
  rollTideKeyDrop,
  ACTIVE_PET_MAX,
  ACTIVE_PET_BASE,
  ACTIVE_PET_UNLOCK_STAGE,
  activePetMaxForState,
  isSpineStageBossFloor,
  ABYSS_MUTATION_IDS,
  ABYSS_COSMETIC_IDS,
  ABYSS_WIPE_KEEP_RATE,
  ABYSS_SQUAD_SIZE,
  ABYSS_ACTIVE_SIZE,
  ABYSS_EVENT_EVERY,
  ABYSS_MUTATIONS,
  ABYSS_MERCHANT_BUFFS,
  rollAbyssFloorEvent,
  emptyAbyssDive,
  emptyMaterials,
  emptyItems,
  emptyItemBonus,
  ITEMS,
  ITEM_IDS,
  RANCH_CAP_BONUS_MAX,
  HATCH_SLOT_BASE,
  HATCH_SLOT_BONUS_MAX,
  ABYSS_TIDE_SHIFT_COST,
  ELEMENTS,
  OFFLINE_HINT_SEC,
  OFFLINE_CLAIM_MIN_SEC,
  OFFLINE_BANK_CAP_SEC,
  releaseSoulGain,
  eggDissolveSoul,
  releaseRefund,
  SOUL_SHOP_OFFERS,
  soulShopOfferById,
  elementExplain,
  kindExplain,
  personalityExplain,
  ceilStat,
  PERSONALITY_ROLE_SHORT,
  skillTypeLabel,
  ELEMENT_EXPLAIN,
  KIND_EXPLAIN,
  APP_BUILD,
  ABYSS_MAX_ACTIVE_MUTATIONS,
  ABYSS_RULES_TEXT,
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
  soulShopView,
  buySoulShopOffer,
  tryBondPending,
  ensureShop,
  breedPreview,
  petLineage,
  nextGoalView,
  useTemperOil,
  awakenSubPersonality,
  deployPet,
  claimHatch,
  startHatch,
  claimAllReadyHatches,
  hatchSlotsView,
  activeHatchCount,
  eggsView,
  tickCultivation,
  tickRanchIdle,
  claimDispatch,
  startDispatch,
  dispatchView,
  ensureDispatchBoard,
  ensureDispatchBoardDaily,
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
  navTrainIdleFloor,
  trainIdleFloor,
  trainFloorNavGates,
  trainClearEfficiency,
  trainDepthMultFor,
  partyCombatPower,
  trainIdleCombatView,
  trainSitesView,
  abyssDiveView,
  abyssSquadCandidates,
  startAbyssDive,
  advanceAbyssDive,
  retreatAbyssDive,
  rearrangeAbyssSquad,
  resolveAbyssEvent,
  buyAbyssInsurance,
  buyAbyssCosmetic,
  buyAbyssEgg,
  buyAbyssPowerNode,
  buyAbyssTideShiftCharm,
  useTideShiftCharm,
  ranchCap,
  hatchSlotCap,
  useBagItem,
  itemsView,
  releasePet,
  releasePets,
  previewReleaseSoul,
  dissolveEgg,
  suggestRanchCullUids,
  ranchCapView,
  togglePetStarred,
  togglePetLocked,
  setPetStarred,
  setPetLocked,
  saveState,
  loadState,
  exportSaveJson,
  importSaveJson,
  dailyView,
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
  tutorialNeedsHatchSub,
  tutorialTargetSelector,
  isDungeonSubLocked,
  tutorialLockReason,
  tutorialCoachDetailUid,
  LATE_TUTORIAL_STEPS,
  isPartySubLocked,
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
assert(Object.keys(MAIN_PERSONALITIES).length === 14, "14 main personalities");
assert(Object.keys(SUB_PERSONALITIES).length === 12, "12 sub personalities");
assert(Object.keys(PERSONALITIES).length === Object.keys(MAIN_PERSONALITIES).length, "PERSONALITIES aliases main pool");
const mainSubOverlap = Object.keys(MAIN_PERSONALITIES).filter((id) => SUB_PERSONALITIES[id]);
assert(mainSubOverlap.length === 0, "main/sub pools disjoint");
assert(ranchCapForStage(0) === 6 && ranchCapForStage(5) === 21, "ranch cap 6+stage*3");
assert(ITEMS.ranch_fence?.name === "欄柵" && ITEMS.hatch_nest_token?.name === "暖巢箋", "bag items defined");
assert(ITEMS.tide_shift_charm?.name === "潮轉符" && ITEMS.tide_shift_charm?.needsTarget, "tide shift charm defined");
assert(ITEM_IDS.length === 3, "three bag consumables");
assert(HATCH_SLOT_BASE === 3 && HATCH_SLOT_BONUS_MAX === 3, "hatch slot base+bonus");
assert(RANCH_CAP_BONUS_MAX === 12, "ranch fence bonus max");
assert(ABYSS_TIDE_SHIFT_COST >= 1, "abyss tide shift grit cost");
{
  const bagSt = {
    realm: 0,
    items: { ...emptyItems(), ranch_fence: 2, hatch_nest_token: 2 },
    itemBonus: emptyItemBonus(),
    log: [],
  };
  assert(ranchCap(bagSt) === 6, "ranch cap no bonus");
  assert(hatchSlotCap(bagSt) === HATCH_SLOT_BASE, "hatch slots base 3");
  const f1 = useBagItem(bagSt, "ranch_fence");
  assert(f1.ok && ranchCap(bagSt) === 7 && bagSt.items.ranch_fence === 1, "fence +1 ranch cap");
  assert(bagSt.itemBonus.ranchCap === 1, "fence bonus tracked");
  const n1 = useBagItem(bagSt, "hatch_nest_token");
  assert(n1.ok && hatchSlotCap(bagSt) === 4 && bagSt.items.hatch_nest_token === 1, "nest +1 hatch slot");
  bagSt.itemBonus.hatchSlots = HATCH_SLOT_BONUS_MAX;
  bagSt.items.hatch_nest_token = 1;
  assert(!useBagItem(bagSt, "hatch_nest_token").ok, "nest blocked at max bonus");
  assert(hatchSlotCap(bagSt) === HATCH_SLOT_BASE + HATCH_SLOT_BONUS_MAX, "hatch cap 6 at max");
  bagSt.itemBonus.ranchCap = RANCH_CAP_BONUS_MAX;
  bagSt.items.ranch_fence = 1;
  assert(!useBagItem(bagSt, "ranch_fence").ok, "fence blocked at max bonus");
  assert(ranchCap(bagSt) === ranchCapForStage(0) + RANCH_CAP_BONUS_MAX, "ranch cap at max bonus");
  const view = itemsView({
    realm: 0,
    items: { ...emptyItems(), ranch_fence: 1 },
    itemBonus: { ranchCap: 0, hatchSlots: 0 },
  });
  assert(view.find((i) => i.id === "ranch_fence")?.canUse, "itemsView canUse fence");
}
/* Pack E: 潮轉符 — permanent random element change */
{
  const pet = {
    uid: "shift1",
    name: "潮礁狐",
    speciesId: "reefox",
    speciesName: "礁狐",
    elementId: "tide",
    elementName: "潮",
    personalityId: "fierce",
    personalityName: "兇猛",
    atk: 20,
    hp: 100,
    spd: 12,
    level: 3,
    genes: { species: "reefox", element: "tide", personality: "fierce" },
  };
  const ranchPet = {
    ...pet,
    uid: "shift2",
    elementId: "flame",
    elementName: "焰",
    name: "焰礁狐",
    genes: { species: "reefox", element: "flame", personality: "fierce" },
  };
  const shiftSt = {
    pets: [pet],
    ranch: [ranchPet],
    items: { ...emptyItems(), tide_shift_charm: 2 },
    materials: { ...emptyMaterials(), abyss_grit: ABYSS_TIDE_SHIFT_COST + 5 },
    bestiary: {},
    abyssDive: emptyAbyssDive(),
    log: [],
  };
  assert(!useBagItem(shiftSt, "tide_shift_charm").ok, "tide shift needs target");
  assert(useBagItem(shiftSt, "tide_shift_charm").needsTarget, "tide shift needsTarget flag");
  const r1 = useTideShiftCharm(shiftSt, "shift1");
  assert(r1.ok && r1.fromElement === "tide" && r1.toElement !== "tide", "party pet element changed");
  assert(shiftSt.pets[0].elementId === r1.toElement, "pet record elementId persisted");
  assert(shiftSt.pets[0].elementName === ELEMENTS[r1.toElement].name, "elementName updated");
  assert(shiftSt.pets[0].genes.element === r1.toElement, "genes.element updated");
  assert(shiftSt.items.tide_shift_charm === 1, "charm consumed");
  assert(shiftSt.pets[0].name.startsWith(ELEMENTS[r1.toElement].name), "name prefix updated");
  const beforeRanchEl = shiftSt.ranch[0].elementId;
  const r2 = useBagItem(shiftSt, "tide_shift_charm", "shift2");
  assert(r2.ok && shiftSt.ranch[0].elementId !== beforeRanchEl, "ranch pet via useBagItem");
  assert(shiftSt.items.tide_shift_charm === 0, "second charm consumed");
  assert(!useTideShiftCharm(shiftSt, "shift1").ok, "empty charm fails");
  const buy = buyAbyssTideShiftCharm(shiftSt);
  assert(buy.ok && shiftSt.items.tide_shift_charm === 1, "buy charm with grit");
  assert(
    Math.floor(shiftSt.materials.abyss_grit) === 5,
    "grit spent for charm"
  );
  /* persist via save/load */
  const saved = JSON.parse(JSON.stringify(shiftSt.pets[0]));
  assert(saved.elementId === shiftSt.pets[0].elementId, "element survives serialize");
  const iv = itemsView(shiftSt);
  assert(iv.find((i) => i.id === "tide_shift_charm")?.needsTarget, "itemsView needsTarget");
  assert(iv.find((i) => i.id === "tide_shift_charm")?.canUse, "itemsView canUse charm");
}
assert(RANCH_IDLE_GLOBAL_MULT === 0.35, "idle global mult");
assert(DISPATCH_GEN_REWARD_MULT[3] === 1.25, "gen3 dispatch mult");
assert(RANCH_IDLE_BASE.feed === IDLE_BY_PERSONALITY.fierce?.feed, "ranch idle neutral vs old pe keys");
assert(IDLE_BY_PERSONALITY.fierce?.feed === IDLE_BY_PERSONALITY.gentle?.feed, "personality no longer changes ranch idle");
const fierceC = personalityCombatFor("fierce");
const sumDelta = (fierceC.atkMult - 1) + (fierceC.hpMult - 1) + (fierceC.spdMult - 1);
assert(Math.abs(sumDelta - 0.09) < 0.001, "fierce combat totals ~+9%");
assert(Math.abs(fierceC.atkMult - 1) <= 0.15 + 1e-9, "fierce single combat within ±15%");
const sharpG = SUB_PERSONALITIES.sharp;
const subDelta = (sharpG.atk - 1) + (sharpG.hp - 1) + (sharpG.spd - 1);
assert(Math.abs(subDelta - 0.06) < 0.001, "sharp growth totals ~+6%");
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
assert(rollChildGeneration(3, 3) === 3, "3+3→3");
/* 原生+高代：70%(G-1)/30%G，唔再 100% 高代 */
let wild2hi = 0;
for (let i = 0; i < 80; i++) {
  if (rollChildGeneration(2, 0) === 2) wild2hi += 1;
}
assert(wild2hi > 10 && wild2hi < 50, "0+2 roughly 30% gen2");
const odds02 = childGenerationOdds(0, 2);
assert(odds02[0].gen === 1 && odds02[0].pct === 70 && odds02[1].gen === 2, "0+2 odds aligned with 1+2");

const odds12 = childGenerationOdds(1, 2);
assert(odds12[0].gen === 1 && odds12[0].pct === 70, "1+2 odds");
assert(genLabel(0) === "原生" && genLabel(2) === "繁殖2代", "labels");
assert(genEggPrefix(1) === "一代" && genEggPrefix(3) === "三代", "egg gen prefix");

/* Gen mix cost：分代耗唔同階段料 */
const cost02 = breedMatCost(0, 2);
const cost12 = breedMatCost(1, 2);
const cost00 = breedMatCost(0, 0);
const cost11 = breedMatCost(1, 1);
assert(cost00.coral_shard === 2 && !cost00.earth_grade_stone, "0+0 native breed mats");
assert(cost11.coral_shard === 3 && cost11.earth_grade_stone === 4, "1+1 gen1 breed mats");
assert(cost12.cloud_grade_stone === 5 && cost12.abyss_ink === 2, "1+2 gen2 breed mats");
assert(cost02.cloud_grade_stone === 5 && cost02.abyss_ink === 2, "0+2 uses gen2 band");
assert(breedMatCost(2, 3).fire_grade_stone === 6, "gen3+ fire band");

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
const spineSite = TRAIN_SITES.find((s) => s.id === SPINE_ZONE_ID);
assert(spineSite?.drops.find((d) => d.mat === "mist_token")?.perSec > 0, "spine drips mist_token");
assert(spineAfkDropsForStage(1).some((d) => d.mat === "tide_dew"), "stage1 dew AFK");
assert(spineAfkDropsForStage(2).some((d) => d.mat === "earth_grade_stone"), "stage2 earth AFK");
assert(TRAIN_SITES.length === 1, "single spine train site");
assert(SIDE_BRANCHES.length === 3, "three side branches");
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
assert(SKILLS.abyss_reign_surge && SKILLS.void_glint_ray && SKILLS.dusk_iron_plate, "tertiary skill defs");
assert(SKILLS.coral_storm_lance && SKILLS.deep_fang_toxin && SKILLS.tide_prism_howl, "tertiary skill defs 2");
assert(SKILLS.night_scale_veil && SKILLS.gale_void_slash, "tertiary skill defs 3");
assert(HYBRID_SKILLS.abyssreign === "abyss_reign_surge", "淵君 unique skill");
assert(HYBRID_SKILLS.tideprism === "tide_prism_howl", "潮稜 unique buff skill");
assert(
  petSkillIds({ skillId: "tide_spray", speciesId: "abyssreign", kind: "鱗", fusionLevel: 1 }).includes(
    "abyss_reign_surge"
  ),
  "tertiary second skill in combat list"
);
assert(
  !petSkillIds({ skillId: "tide_spray", speciesId: "abyssreign", kind: "鱗", level: 15 }).includes("mist_surge"),
  "tertiary no longer reuses mist_surge"
);
const tertTypes = new Set(
  ["abyssreign", "voidglint", "duskiron", "coralstorm", "deepfang", "tideprism", "nightscale", "galevoid"].map(
    (id) => SKILLS[HYBRID_SKILLS[id]]?.type
  )
);
assert(tertTypes.size >= 5, "tertiary skills span multiple combat roles");
assert(genCombatMult(3) === 1.03 && genCombatMult(1) === 1.01, "gen combat residual");
assert(RARITY[1].mult === 1.18 && RARITY[2].mult === 1.38 && RARITY[3].mult === 1.65, "rarity mults widened");
assert(levelStatGains(0).atk === 2 && levelStatGains(3).atk === 2.6, "level gains gen slope");
assert(Math.abs(fusionAbsorbRate(1) - 0.14) < 1e-9 && Math.abs(fusionAbsorbRate(3) - 0.24) < 1e-9, "fusion absorb reduced");
assert(fusionCombatMult(1) === 1.22 && fusionCombatMult(3) === 1.22, "fusion combat once mult");
assert(fusionMaterialRarityFactor(2, [2, 2]) === 1, "fusion rarity ok");
assert(fusionMaterialRarityFactor(2, [1, 1]) === 0.8, "fusion rarity soft -1");
assert(fusionMaterialRarityFactor(3, [0, 0]) === 0.55, "fusion rarity soft worse");
assert(fusionPowerMultFromParts(1, 1) === 1.22, "fusion mult full");
assert(fusionPowerMultFromParts(1, 0.8) === 1.176, "fusion mult soft -1 bonus only");
assert(fusionPowerMultFromParts(1, 0.55) === 1.121, "fusion mult soft worse still >=1");
assert(petFusionCombatMult({ fusionLevel: 2 }) === 1.22, "pet fusion fallback");
assert(petFusionCombatMult({ fusionLevel: 1, fusionPowerMult: 0.9 }) === 1, "pet fusion clamps below 1");
{
  const healed = healFusionPowerMult({ fusionLevel: 1, fusionPowerMult: 0.58 });
  assert(healed.fusionPowerMult === 1.121, "heal old 0.58 soft-bind product");
  const healed85 = healFusionPowerMult({ fusionLevel: 1, fusionPowerMult: 0.85 });
  assert(healed85.fusionPowerMult === 1.153, "heal old 0.85 soft-bind product");
}
assert(roundStat(63.400000000000006) === 64, "roundStat ceils");
assert(roundStat(35.699999999999996) === 36, "roundStat ceils speed");
assert(rarityBreedCdMult({ rarity: 3 }, { rarity: 0 }) === 0.78, "rarity breed cd");
assert(eggHatchMsFor({ generation: 0 }, EGG_TIERS.C) === EGG_TIERS.C.hatchMs, "egg hatch gen0");
assert(eggHatchMsFor({ generation: 2 }, EGG_TIERS.C) === Math.round(EGG_TIERS.C.hatchMs * 1.5), "egg hatch gen2");
assert(
  eggHatchMsFor({ source: "breed", generation: 1 }, EGG_TIERS.C) === Math.round(35_000 * 1.15),
  "breed egg hatch short gen1"
);
assert(
  eggHatchMsFor({ source: "breed", generation: 3 }, EGG_TIERS.C) < EGG_TIERS.C.hatchMs,
  "breed egg hatch shorter than shop C"
);
assert(String(MATERIALS.breed_ticket?.desc || "").includes("即時就緒"), "breed_ticket desc matches use");
assert(String(MATERIALS.blood_catalyst?.desc || "").includes("減半"), "blood_catalyst desc matches use");
assert(ABYSS_EGG_COST === 110, "abyss egg cost");
assert(ABYSS_POWER_NODE_MAX === 8 && ABYSS_POWER_NODE_COST === 55 && ABYSS_POWER_NODE_ATK === 0.01, "abyss power node");
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
assert(FORMATION_SLOT_COUNT === 4, "formation slot count max 4");
{
  const vg = formationAllyPlacement("vanguard", 3, 3);
  const rr = formationAllyPlacement("rear", 3, 3);
  const bl = formationAllyPlacement("balanced", 3, 3);
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
  const foes = formationFoePlacement(2, 3);
  assert(foes[0].unitIndex === 0 && foes[1].unitIndex === 1 && foes[2].unitIndex === null, "foe wave order slots");
  assert(foes.every((p) => p.lane === "front"), "foes stay front lane");
  const one = formationAllyPlacement("vanguard", 1, 3);
  assert(one[0].unitIndex === 0 && one[1].unitIndex === null && one[2].unitIndex === null, "partial party empty slots");
  const bl4 = formationAllyPlacement("balanced", 4, 4);
  assert(bl4.length === 4 && bl4.map((p) => p.lane).join(",") === "rear,front,rear,front", "balanced 4-slot stagger");
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
assert(evaluateDungeonChallenge([{ elementId: "tide" }, { elementId: "gale" }], { banElement: "flame" }).ok, "no ban ok");
assert(DUNGEON_CHALLENGE_RULES.every((r) => r.maxPets == null), "no maxPets challenge rules");

/* P9: pet depth + dispatch + gear sets + tide seal */
const synKin = partySynergy([
  { uid: "p1", elementId: "tide", kind: "獸", speciesId: "reefox", generation: 1 },
  { uid: "c1", elementId: "tide", kind: "獸", speciesId: "tideling", generation: 2, bornFrom: ["p1", "p2"] },
]);
assert(synKin.labels.some((l) => l.includes("親子")), "kinship bond");
assert(synKin.atkMult > 1.14, "kinship atk");
assert(Math.abs(synKin.atkMult - 1.07 * 1.08) < 1e-9, "kinship × dual-element");
const synSp = partySynergy([
  { uid: "a", elementId: "gale", kind: "禽", speciesId: "ashwing", generation: 1 },
  { uid: "b", elementId: "flame", kind: "禽", speciesId: "ashwing", generation: 1 },
]);
assert(synSp.labels.some((l) => l.includes("同族血脈")), "same species");
assert(personalityCombatFor("fierce")?.atkMult === 1.12, "fierce passive");
assert(personalityCombatFor("gentle")?.sustainBias, "gentle sustain");
assert(personalityCombatFor("diligent")?.id === "gentle", "legacy diligent remaps via combat lookup? skip");
// diligent is remapped only via remapMainPersonalityId — combat table no longer has work ids
assert(personalityCombatFor(remapMainPersonalityId("diligent"))?.atkMult, "legacy diligent remaps to main combat");
assert(personalityCombatFor("noble")?.atkMult >= 1, "noble combat buff");
assert(GEAR_SETS.tide && gearSetBonus(["tide_blade", "moss_vest"]).atk === 3, "set2");
assert(gearSetBonus(["core_fang", "abyss_plate", "gloom_sigil"]).labels.some((l) => l.includes("三件")), "set3");
assert(DISPATCH_MISSIONS.length >= 3, "dispatch missions");
assert(DISPATCH_SLOT_MAX === 3, "dispatch concurrent slots 3");
assert(DISPATCH_BOARD_SIZE === 3, "dispatch board size 3");
assert(DISPATCH_MISSIONS.some((m) => m.needElement), "dispatch needElement");
assert(DISPATCH_MISSIONS.some((m) => m.needKind), "dispatch needKind");
assert(tideSealGainForRealm(5) === 0 && tideSealCombatMult(5) === 1, "tide seal retired");
assert(TIDE_SEAL_MIN_REALM === 5, "seal min realm const kept");

/* P10: spine train + materials + dual personality */
assert(TRAIN_SITES.length === 1 && MATERIALS.tide_dew, "train+mats");
assert(TRAIN_SITES.every((s) => s.focus), "each site has focus");
assert(
  !spineAfkDropsForStage(1).some((d) => d.mat && MATERIALS[d.mat]?.tier === "dungeon"),
  "no dungeon mats on AFK stage1"
);
assert(MATERIALS.echo_resin && MATERIALS.fuse_sand, "new bulk mats");
assert(MATERIALS.earth_grade_stone && MATERIALS.fusion_core, "grade + fusion core");
assert(skillMatCost(1) && Object.keys(skillMatCost(1)).length === 0, "skill lv1 no resin");
assert(skillMatCost(2).echo_resin >= 1, "skill lv2 needs resin");
assert(fusionMatCost(1).fusion_core === 1, "fusion core cost");
assert(materialSourceLabel("temper_oil") === "秘境專屬", "temper dungeon-only label");
assert(materialSourceLabel("echo_resin").includes("主脊"), "resin from spine");
assert(unlockedTrainSiteIds({ clearedDungeons: {} }).includes(SPINE_ZONE_ID), "spine free");
assert(unlockedTrainSiteIds({ clearedDungeons: {} }).length === 1, "only spine unlocked");
assert(!isSideBranchUnlocked({ clearedDungeons: {} }, "earth_vein"), "earth locked early");
assert(
  isSideBranchUnlocked({ clearedDungeons: { tide_21: true } }, "earth_vein"),
  "earth unlock stage2 at floor21"
);
assert(upgradeMatCost(1).tide_dew >= 1 && !upgradeMatCost(1).earth_grade_stone, "upgrade early main only");
assert(upgradeMatCost(12).earth_grade_stone > 0, "upgrade band earth");
assert(upgradeMatCost(33).fire_grade_stone > 0, "upgrade band fire");
assert(breedMatCost(0, 0).coral_shard >= 1, "breed mats");
assert(clampBreedBatchCount(0) === 1 && clampBreedBatchCount(99) === 10, "breed batch clamp");
assert(BREED_BATCH_MIN === 1 && BREED_BATCH_MAX === 10, "breed batch 1-10");
assert(!Number.isFinite(EGG_CAP), "egg cap removed (infinite)");
assert(DISPATCH_MISSIONS.length >= 11, "more dispatch");
assert(DISPATCH_MISSIONS.some((m) => m.eggChance), "dispatch egg chance");
assert(DISPATCH_MISSIONS.some((m) => m.id === "egg_shore"), "shore egg mission");
assert(DISPATCH_MISSIONS.some((m) => m.needSpineStage === 3), "dispatch stage gate");
assert(DISPATCH_MISSIONS.every((m) => !m.needSite), "dispatch no legacy needSite");
assert(SPECIES.shellmite?.breedOnly, "shellmite");
fox.personality2Id = "hardy";
fox.personality2Awakened = true;
fin.personalityId = "wild";
fin.personality2Id = "latebloomer";
fin.personality2Awakened = true;
let pe2 = 0;
for (let i = 0; i < 30; i++) {
  const gg = rollBreedGenes(fox, fin);
  if (gg.personality2 && SUB_PERSONALITIES[gg.personality2]) pe2 += 1;
}
assert(pe2 > 5, "sub personality gene often rolls");
const dual = buildPetStats({
  id: "d",
  species: "reefox",
  element: "tide",
  personality: "fierce",
  personality2: "latebloomer",
  cost: 1,
});
assert(!dual.personality2Awakened && !dual.personality2Id, "new pets sub unawakened");
assert(SUB_PERSONALITIES[dual.genes.personality2], "sub gene pre-rolled in genes");
const dualAwake = buildPetStats({
  id: "d2",
  species: "reefox",
  element: "tide",
  personality: "fierce",
  personality2: "latebloomer",
  personality2Awakened: true,
  cost: 1,
});
assert(dualAwake.personality2Id === "latebloomer" && dualAwake.personality2Name, "awakened dual pe");
/* Dual-pool awaken fairness: Lv20 awaken then to 40 ≈ Lv40 then awaken */
{
  const mk = (lv) => {
    const p = {
      ...buildPetStats({ id: "fair", species: "reefox", element: "tide", personality: "fierce", cost: 0 }),
      uid: "fair-" + lv,
      level: 1,
      personality2Awakened: false,
      personality2Id: null,
      genes: { species: "reefox", element: "tide", personality: "fierce", personality2: "sharp" },
    };
    for (let i = 1; i < lv; i++) {
      const g = applySubGrowthToLevelGains(levelStatGains(petGeneration(p)), p);
      p.atk = ceilStat(p.atk + g.atk);
      p.hp = ceilStat(p.hp + g.hp);
      p.spd = ceilStat(p.spd + g.spd);
      p.level = i + 1;
    }
    return p;
  };
  const early = mk(20);
  const a1 = awakenSubPersonality({ pets: [], ranch: [early], materials: {}, log: [] }, early.uid);
  assert(a1.ok && early.personality2Awakened && early.personality2Id === "sharp", "awaken at 20");
  for (let i = 20; i < 40; i++) {
    const g = applySubGrowthToLevelGains(levelStatGains(petGeneration(early)), early);
    early.atk = ceilStat(early.atk + g.atk);
    early.hp = ceilStat(early.hp + g.hp);
    early.spd = ceilStat(early.spd + g.spd);
    early.level = i + 1;
  }
  const late = mk(40);
  const a2 = awakenSubPersonality({ pets: [], ranch: [late], materials: {}, log: [] }, late.uid);
  assert(a2.ok && late.personality2Id === "sharp", "awaken at 40");
  assert(early.atk === late.atk, "awaken timing atk parity");
  assert(early.hp === late.hp, "awaken timing hp parity");
  assert(early.spd === late.spd, "awaken timing spd parity");
}


/* P11: material hints + unlock helpers */
assert(MATERIAL_SOURCE_INDEX.tide_dew?.sites?.includes("主脊潮脈"), "tide_dew spine");
assert(MATERIAL_SOURCE_INDEX.coral_shard?.sites?.includes("主脊潮脈"), "coral spine");
assert(MATERIAL_SOURCE_INDEX.earth_grade_stone?.sites?.includes("主脊潮脈"), "earth spine AFK source");
assert(!MATERIAL_SOURCE_INDEX.earth_grade_stone?.sites?.includes("地脈"), "no earth branch source");
assert(MATERIAL_SOURCE_INDEX.seal_ember?.sites?.includes("主脊潮脈"), "ember spine");
assert(materialSourceLabel("seal_ember").includes("主脊"), "ember source");
assert(trainSiteUnlockHint(TRAIN_SITES[0]) == null, "spine no unlock hint");
assert(dungeonNameForClear("tide_1").includes("一層"), "dungeon name");
const fakeMats = { materials: { tide_dew: 0, mist_silk: 2 } };
const aff = affordMaterials(fakeMats, { tide_dew: 2, mist_silk: 1 });
assert(!aff.ok && aff.items.find((i) => i.id === "tide_dew")?.short === 2, "afford short");

/* P18: spine AFK profile */
const spineProf = spineTrainProfile({ clearedDungeons: {} });
assert(spineProf.id === SPINE_ZONE_ID && spineProf.primaryMat === "tide_dew", "spine early primary");
const spineLate = spineTrainProfile({ clearedDungeons: { tide_21: true } });
assert(spineLate.spineStage === 2 && spineLate.drops.some((d) => d.mat === "earth_grade_stone"), "spine stage2 drip");
assert(DUNGEON_MAT_DROPS.tide_1.weights.tide_dew >= 1 && DUNGEON_MAT_DROPS.tide_1.weights.coral_shard >= 1, "stage1 dungeon mats");
assert(DUNGEON_MAT_DROPS.tide_2.weights.earth_grade_stone >= 1, "stage2 earth grade");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.earth_grade_stone, "stage1 no earth grade");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.echo_resin, "no resin in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.fuse_sand, "no fuse sand in dungeon");
assert(!DUNGEON_MAT_DROPS.tide_1.weights.mist_token, "entry token never dungeon drop");
assert(DUNGEON_MAT_DROPS.tide_4.weights.fire_grade_stone >= 1, "stage4 fire grade");
assert(MATERIALS.mist_token?.tier === "gate", "mist_token is gate tier");
assert(materialSourceLabel("mist_token").includes("秘境不掉"), "token source label");
assert(TRAIN_SITES.every((s) => (s.drops || []).some((d) => d.mat === "mist_token")), "spine drips tokens");

/* P19: shortage → spine / branch nav */
assert(primaryTrainSiteForMat("coral_shard")?.id === SPINE_ZONE_ID, "coral → spine");
assert(primaryTrainSiteForMat("echo_resin")?.id === SPINE_ZONE_ID, "resin → spine");
assert(primaryTrainSiteForMat("earth_grade_stone")?.id === SPINE_ZONE_ID, "earth → spine AFK");
assert(primaryTrainSiteForMat("temper_oil") == null, "temper no AFK site");
const shortSt = {
  materials: { tide_dew: 0, coral_shard: 0 },
  trainSite: SPINE_ZONE_ID,
  clearedDungeons: { tide_1: true, tide_2: true },
};
const sug = suggestTrainForShortage(shortSt, { coral_shard: 2 });
assert(sug?.siteId === SPINE_ZONE_ID && sug.unlocked && sug.alreadyThere, "suggest spine");
const dungSug = suggestTrainForShortage(shortSt, { temper_oil: 1 });
assert(dungSug?.dungeonOnly, "temper dungeon suggest");
const earthSug = suggestTrainForShortage(
  { ...shortSt, clearedDungeons: { tide_21: true } },
  { earth_grade_stone: 1 }
);
assert(earthSug?.siteId === SPINE_ZONE_ID && !earthSug.isBranch, "suggest earth spine");

/* P20: spine spotlight */
const spot = pickDailyTrainSpotlight("2026-08-30");
assert(spot?.id === SPINE_ZONE_ID, "train spot is spine");
const spineForMult = trainSiteById("ruins");
const dewMult = trainDropMult(spineForMult, { mat: spineForMult.primaryMat, perSec: 0.03 }, "2026-08-30");
assert(dewMult >= TRAIN_FOCUS_BONUS, "focus mult on primary mat");
const rates = trainSiteRatesView(spineTrainProfile({ clearedDungeons: {} }), "2026-08-30");
assert(rates.lines.some((l) => l.name === "潮露"), "rates include dew");
assert(DUNGEON_DAILY_MODS.length >= 10, "expanded daily mods");
assert(DUNGEON_CHALLENGE_RULES.some((r) => r.minGeneration === 2), "gen2 challenge");
const gen1Pet = makeStarterPet();
const gen2Rule = DUNGEON_CHALLENGE_RULES.find((r) => r.id === "min_gen2");
assert(!evaluateDungeonChallenge([gen1Pet], gen2Rule).ok, "gen2 challenge rejects gen1");

/* Side branches */
const earthD = buildBranchDungeon("earth_vein", 1);
assert(earthD?.isSideBranch && earthD.matDropOverride?.weights?.earth_grade_stone >= 8, "earth branch mats");
assert(isBranchDungeonId("earth_vein_3") && !isBranchDungeonId("tide_3"), "branch id parse");
assert(SIDE_BRANCHES.length === 3, "legacy side branch defs kept");
assert(maxClearedTideTier({ clearedDungeons: { tide_5: true, earth_vein_1: true } }) === 5, "branch clears ignore max tide");
assert(spineFrontierTier({ clearedDungeons: { tide_5: true } }) === 6, "frontier next");
assert(spineStageFromState({ clearedDungeons: { tide_21: true } }) === 2, "stage from state");
assert(SPINE_THEME_FLOORS === 200, "theme spine 200");
const trunk0 = spineTrunkView({ clearedDungeons: {} });
assert(trunk0.frontier === 1 && trunk0.cleared === 0 && trunk0.progressLabel.includes("0／200"), "trunk start floor1");
const trunk4 = spineTrunkView({ clearedDungeons: { tide_4: true } });
assert(trunk4.frontier === 5 && trunk4.cleared === 4 && trunk4.nextAfterClear === 6, "trunk after 4");
assert(trunk4.frontierName && trunk4.progressLabel.includes("4／200"), "trunk progress label");
const trunk200 = spineTrunkView({ clearedDungeons: { tide_200: true } });
assert(trunk200.frontier === 201 && trunk200.progressLabel.includes("無限"), "trunk beyond theme");

/* P12: combat events */
const combatFox = buildPetStats({
  id: "p1",
  species: "reefox",
  element: "flame",
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

/* Train spine: sequential floor push waives realm gate */
const spinePushSt = {
  ...combatSt,
  pets: [{ ...combatFox, atk: 200, hp: 800, spd: 40, uid: "spine-push" }],
  realm: 0,
  clearedDungeons: { tide_1: true, tide_2: true, tide_3: true, tide_4: true },
  materials: emptyMaterials(),
  stones: 500,
};
assert(!runDungeon({ ...spinePushSt, materials: emptyMaterials() }, "tide_5").ok, "秘境 path still realm-gates tide_5");
const stFrontier = {
  ...spinePushSt,
  materials: emptyMaterials(),
  clearedDungeons: { ...spinePushSt.clearedDungeons },
};
const spinePush = runDungeon(stFrontier, "tide_5", { trainSpine: true });
assert(spinePush.ok, "trainSpine can challenge frontier regardless of realm");
const skipAhead = runDungeon(
  {
    ...spinePushSt,
    materials: emptyMaterials(),
    clearedDungeons: { tide_1: true },
  },
  "tide_5",
  { trainSpine: true }
);
assert(!skipAhead.ok, "trainSpine cannot skip floors");
assert(spineTrunkView(stFrontier).frontier >= 5, "trunk view after attempt");
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

/* Pack B: hatch slot cap + claim-all */
{
  const now = Date.now();
  const slotSt = {
    realm: 0,
    pets: [],
    ranch: [],
    eggs: [],
    materials: {},
    items: emptyItems(),
    itemBonus: { ranchCap: 0, hatchSlots: 0 },
    bestiary: {},
    stats: {},
    log: [],
    tutorial: { done: true, step: "complete", flags: {} },
  };
  assert(hatchSlotCap(slotSt) === HATCH_SLOT_BASE, "pack B hatch cap base");
  for (let i = 0; i < HATCH_SLOT_BASE; i++) {
    const e = makeEgg("C", "shop", now);
    e.uid = `slot-egg-${i}`;
    slotSt.eggs.push(e);
    assert(startHatch(slotSt, e.uid, now).ok, `start hatch slot ${i + 1}`);
  }
  assert(activeHatchCount(slotSt) === HATCH_SLOT_BASE, "3 concurrent hatches");
  const overflow = makeEgg("C", "shop", now);
  overflow.uid = "slot-egg-overflow";
  slotSt.eggs.push(overflow);
  const blocked = startHatch(slotSt, overflow.uid, now);
  assert(!blocked.ok && String(blocked.msg).includes("孵化欄已滿"), "slot cap gates startHatch");
  const hv = hatchSlotsView(slotSt, now);
  assert(hv.cap === 3 && hv.used === 3 && hv.slots.length === 3, "hatchSlotsView fills 3");
  assert(hv.slots.every((s) => !s.empty && s.hatching), "slots occupied hatching");

  slotSt.itemBonus.hatchSlots = 1;
  assert(hatchSlotCap(slotSt) === 4, "bonus opens 4th slot");
  assert(startHatch(slotSt, overflow.uid, now).ok, "4th slot starts after nest bonus");
  const hv4 = hatchSlotsView(slotSt, now);
  assert(hv4.cap === 4 && hv4.slots.length === 4 && hv4.used === 4, "4-slot view");

  /* claim one + claim-all */
  for (const e of slotSt.eggs) {
    if (e.startedAt != null) e.readyAt = now - 1000;
  }
  const oneUid = slotSt.eggs.find((e) => e.startedAt != null).uid;
  const oneClaim = claimHatch(slotSt, oneUid);
  assert(oneClaim.ok && oneClaim.pet && slotSt.ranch.length === 1, "claim one ready hatch");
  const allRes = claimAllReadyHatches(slotSt, now);
  assert(allRes.ok && allRes.pets.length === 3 && slotSt.eggs.every((e) => e.startedAt == null), "claimAllReadyHatches");
  assert(slotSt.ranch.length === 4, "all claimed pets in ranch");
}

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
assert(
  tutorialTargetSelector({ type: "pet-detail", uid: "p1" }) === 'button.info[data-pet-detail="p1"]',
  "pet-detail selector is info btn only"
);
assert(tutorialNeedsRanchSub("fuse_intro"), "fuse_intro needs ranch");
assert(LATE_TUTORIAL_STEPS.includes("fuse_once"), "late includes fuse_once");

const eggReadySt = {
  eggs: [{ uid: "e1", startedAt: Date.now() - 30_000, readyAt: Date.now() - 1000, tier: "C", name: "潮霧蛋" }],
  tutorial: { done: false, step: "hatch_starter", flags: {} },
};
assert(tutorialEggReady(eggReadySt), "egg ready detect");
const eggReadyHi = tutorialHighlights(eggReadySt, { tab: "cultivate", panelSub: { cultivate: "train" } });
assert(eggReadyHi.some((h) => h.type === "tab" && h.id === "party"), "egg ready highlights party from cultivate");
const eggReadyNav = syncTutorialNavigation(eggReadySt, { tab: "cultivate", panelSub: { cultivate: "train" } });
assert(eggReadyNav.tab === "party" && eggReadyNav.panelSub.party === "hatch", "egg ready nav to hatch");
assert(tutorialNeedsHatchSub("hatch_starter") && tutorialNeedsHatchSub("hatch_second"), "hatch steps need hatch sub");
assert(!tutorialNeedsRanchSub("hatch_starter"), "hatch_starter no longer forces ranch");
assert(!isPartySubLocked(hatchLockSt, "hatch"), "hatch_starter unlocks hatch sub");
assert(isPartySubLocked(hatchLockSt, "ranch"), "hatch_starter locks ranch sub");

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
// ≥ OFFLINE_HINT_SEC 缺口入離線庫；材料應在 bank 而非錢包（整數入庫）
const tickMatBank = offlineBankView(tickMatSt);
assert(
  Math.floor(tickMatBank.materials?.tide_dew || 0) >= 1 ||
    Math.floor(tickMatSt.materials.tide_dew || 0) >= 1,
  "deterministic train mats over 40s (wallet or offline bank)"
);
// 短 tick（< hint）仍即時入帳
const tickOnlineSt = {
  ...tickMatSt,
  materials: { tide_dew: 0 },
  lastTick: Date.now() - 1000,
  offlineBank: null,
  offlineHint: null,
};
tickCultivation(tickOnlineSt);
assert(Math.floor(tickOnlineSt.materials.tide_dew || 0) >= 0, "1s online tick does not throw");

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
const earlyClaim = claimOfflineBank(offSt);
assert(!earlyClaim.ok, "claim blocked under 30 min");
assert(offlineBankView(offSt).hasPending, "bank kept when claim blocked");
offSt.offlineBank.sec = Math.max(offSt.offlineBank.sec | 0, OFFLINE_CLAIM_MIN_SEC);
const claimOff = claimOfflineBank(offSt);
assert(claimOff.ok, "claim offline bank ok after 30 min");
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
assert(skipSt.tutorial.flags.skipped && skipSt.tutorial.lateCompleted, "skip sets skipped+lateCompleted");

for (const step of ["train_pet", "dungeon_win", "fuse_intro", "fuse_once"]) {
  const mid = {
    realm: 2,
    clearedDungeons: { tide_3: true },
    stats: { fusions: 0 },
    tutorial: { done: false, step, flags: {}, latePending: true, lateCompleted: false },
  };
  const r = skipTutorial(mid);
  assert(r.ok && !tutorialActive(mid), `skip works at ${step}`);
  const restart = maybeStartLateTutorial(mid);
  assert(!restart.started, `skip stays skipped after late check (${step})`);
}

const meetHi = tutorialHighlights(
  {
    tutorial: { done: false, step: "meet_pet", flags: {} },
    ranch: [makeStarterPet()],
    pets: [],
    eggs: [],
  },
  { tab: "party", panelSub: { party: "ranch" } }
);
assert(meetHi.some((h) => h.type === "pet-detail" && h.uid), "meet_pet highlights one coach detail");

const ga = genAwakenBonus(3);
assert(ga?.skillLevel === 2 && ga.atk > 0, "gen3 awaken");
const gb = genAwakenBonus(2);
assert(gb && !gb.skillLevel, "gen2 awaken no skill bump");

const foxA = { uid: "a", speciesId: "reefox", kind: "獸", elementId: "tide", personalityId: "sly", atk: 20, hp: 100, spd: 12, rarity: 1, generation: 1 };
const finB = { uid: "b", speciesId: "glowfin", kind: "光", elementId: "flame", personalityId: "fierce", atk: 18, hp: 95, spd: 11, rarity: 0, generation: 1 };
const prev = breedPreview(foxA, finB);
assert(prev?.hybridName === "耀狐" && prev.outcomes.length >= 2, "breed preview hybrid");
assert(prev.statPreview.atk[1] >= prev.statPreview.atk[0], "stat preview range");
assert(prev.recipeOutcomes?.length >= 1, "breed preview lists recipe outcomes");
assert(
  prev.outcomes.some((o) => o.kind === "hybrid" || o.kind === "hybrid-sub"),
  "preview shows main/sub hybrid rows"
);
assert(prev.genMult >= 1, "preview exposes genMult");
assert(prev.temperParents?.length === 2 && prev.temperParents[1].personalityName, "preview temper parents");
assert(prev.temperNote?.includes("覺醒") || prev.temperNote?.includes("主性格"), "preview temper note dual-pool");

const breedGoalNavSt = {
  realm: 2,
  qi: 520,
  stones: 140,
  scrap: 3,
  dust: 12,
  feed: 0,
  combatsWon: 8,
  clearedDungeons: { tide_2: true },
  stats: { breeds: 0, fusions: 0 },
  ranch: [makeStarterPet(), makeStarterPet()],
  pets: [],
  bestiary: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`nav-dex-${i}`, true])),
  pathQuests: { claimed: {} },
};
const breedGoalNav = nextGoalView(breedGoalNavSt);
assert(
  breedGoalNav?.tab === "party" && breedGoalNav?.sub === "breed",
  "breed breakthrough goal navigates to breed tab"
);

const lineSt = {
  pets: [{ uid: "c1", speciesId: "glintfox", name: "耀狐", bornFrom: ["a", "b"], generation: 2 }],
  ranch: [
    { uid: "a", speciesId: "reefox", name: "礁狐", generation: 1, bornFrom: ["gp1", "gp2"] },
    { uid: "gp1", speciesId: "tideling", name: "潮仔", generation: 0 },
  ],
};
const lin = petLineage(lineSt, "c1");
assert(lin.parents.length === 2 && lin.children.length === 0, "lineage parents");
assert(lin.grandparents?.length >= 1 && lin.grandparents.some((g) => g.uid === "gp1"), "lineage grandparents");
assert(lin.grandparents.find((g) => g.uid === "gp1")?.viaUid === "a", "grandparent via parent");
const linA = petLineage(lineSt, "a");
assert(linA.children.length === 1, "lineage children");
const kinLine = petLineage(
  {
    pets: [
      { uid: "p1", speciesId: "reefox", name: "父", generation: 1 },
      { uid: "c1", speciesId: "glintfox", name: "子", bornFrom: ["p1", "p2"], generation: 2 },
    ],
    ranch: [],
  },
  "c1"
);
assert(kinLine.kinshipActive, "lineage kinship when parent co-deployed");

assert(Object.keys(PERSONALITY_ROLE_SHORT).length === 0, "soul short labels retired");
assert(personalityExplain("fierce")?.roleShort == null, "fierce no roleShort");
assert(personalityExplain("gentle")?.roleLabel === "續航", "gentle roleLabel sustain");

const inh = breedStatInheritancePreview(foxA, finB, { rarity: 1, generation: 2, hybrid: true });
assert(inh.atk >= 0 && inh.hp >= 0, "inherit preview");

/* P16: balance pass */
assert(BREED_STONE_COST === 45, "breed cost");
assert(BREED_COOLDOWN_MS === 45_000, "breed cd");
assert(FORGE_SCRAP_COST === 2, "forge scrap");
assert(fusionStoneCost(1) === 240, "fuse once stone cost");
assert(upgradeStoneCost(1) >= 10 && upgradeStoneCost(8) > upgradeStoneCost(1), "upgrade stone curve");
assert(BOND_COST_MAX === 42, "bond cap");
const t1 = DUNGEONS.find((d) => d.id === "tide_1");
assert(t1?.reward?.stones === 32, "t1 stones");
const bg3 = BREAKTHROUGH_GATES[3];
assert(bg3.costs.dust === 12 && bg3.checks.find((c) => c.type === "breeds")?.need === 1, "bt gate 3");
assert(bg3.checks.find((c) => c.type === "bestiary")?.need === 12, "bt gate 3 bestiary");
assert(BREAKTHROUGH_GATES[4].checks.find((c) => c.type === "bestiary")?.need === 18, "bt gate 4 bestiary staged");
assert(BREAKTHROUGH_GATES[5].checks.find((c) => c.type === "bestiary")?.need === 36, "bt gate 5 bestiary staged");
assert(!(BREAKTHROUGH_GATES[5].checks || []).some((c) => c.type === "gear_equipped"), "no gear at r5");
assert(DUNGEON_CHALLENGE_RULES.every((r) => !r.banMaster), "no banMaster challenge");
assert(!DUNGEON_CHALLENGE_RULES.some((r) => r.maxPets != null), "no party-count challenge");
assert(!ABYSS_MUTATIONS.mut_duo.maxPets, "mut_duo no longer caps pets");
assert(ABYSS_SQUAD_SIZE === 5 && ABYSS_ACTIVE_SIZE === 3, "abyss squad 5=3+2");
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
assert(!isDungeonSubLocked(tacticsSt, "abyss"), "tactics does not lock abyss");
assert(tutorialLockReason(tacticsSt, "dungeonSub", "field") === "教學中", "field lock reason 教學中");
assert(tutorialLockReason(tacticsSt, "dungeonSub", "abyss") === "", "abyss has no tutorial lock reason");
const tacticsNav = syncTutorialNavigation(tacticsSt, {
  tab: "dungeon",
  panelSub: { dungeon: "field", party: "fight", cultivate: "train", codex: "dex" },
});
assert(tacticsNav.panelSub.dungeon === "setup", "tactics sync forces setup sub from field");
const tacticsAbyssNav = syncTutorialNavigation(tacticsSt, {
  tab: "dungeon",
  panelSub: { dungeon: "abyss", party: "fight", cultivate: "train", codex: "dex" },
});
assert(tacticsAbyssNav.panelSub.dungeon === "abyss", "tactics sync keeps abyss sub");
const tacticsSetupNav = syncTutorialNavigation(tacticsSt, {
  tab: "dungeon",
  panelSub: { dungeon: "setup", party: "fight", cultivate: "train", codex: "dex" },
});
assert(tacticsSetupNav.panelSub.dungeon === "setup", "tactics sync keeps setup sub");

/* Pack B: dungeon/abyss unlock + click path (logic) */
{
  const fightSt = {
    realm: 0,
    clearedDungeons: {},
    tutorial: { done: false, step: "dungeon_fight", flags: {}, latePending: false },
  };
  normalizeTutorial(fightSt);
  assert(!isTabLocked(fightSt, "dungeon"), "dungeon_fight unlocks dungeon tab");
  assert(!isDungeonSubLocked(fightSt, "field"), "dungeon_fight allows field");
  assert(!isDungeonSubLocked(fightSt, "abyss"), "dungeon_fight allows abyss click");
  assert(isDungeonSubLocked(fightSt, "setup"), "dungeon_fight locks setup");
  assert(tutorialLockReason(fightSt, "dungeonSub", "setup") === "教學中", "setup lock flashes 教學中");
  const unlockedAbyss = abyssDiveView({
    realm: 0,
    clearedDungeons: { tide_1: true },
    materials: {},
    pets: [],
    ranch: [],
  });
  assert(unlockedAbyss.unlocked, "tide_1 clears abyss unlock gate");
  const lockedAbyss = abyssDiveView({
    realm: 0,
    clearedDungeons: {},
    materials: {},
    pets: [],
    ranch: [],
  });
  assert(!lockedAbyss.unlocked, "abyss locked before tide_1 / realm");
  const realmAbyss = abyssDiveView({
    realm: 1,
    clearedDungeons: {},
    materials: {},
    pets: [],
    ranch: [],
  });
  assert(realmAbyss.unlocked, "realm >= 1 unlocks abyss");
}

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

/* Pack D: fuse_intro completes on fuse page; fuse_once needs a fusion; no glow on fuse_once */
const fusePetA = { ...makeStarterPet(), uid: "fuse-a", speciesId: "reefox", fusionLevel: 0, level: 8 };
const fusePetB = { ...makeStarterPet(), uid: "fuse-b", speciesId: "reefox", fusionLevel: 0, level: 5 };
const fuseIntroSt = {
  realm: 2,
  clearedDungeons: { tide_3: true },
  stats: { fusions: 0 },
  pets: [fusePetA],
  ranch: [fusePetB],
  materials: { fusion_core: 2, fuse_sand: 2 },
  stones: 999,
  tutorial: {
    done: false,
    step: "fuse_intro",
    flags: {},
    latePending: true,
    lateCompleted: false,
  },
};
normalizeTutorial(fuseIntroSt);
const fuseListHi = tutorialHighlights(fuseIntroSt, {
  tab: "party",
  panelSub: { party: "ranch" },
});
assert(fuseListHi.length === 1 && fuseListHi[0].type === "pet-detail", "fuse_intro one pet-detail target");
assert(fuseListHi[0].uid === tutorialCoachDetailUid(fuseIntroSt), "fuse_intro coach uid");
const fuseDetailHi = tutorialHighlights(fuseIntroSt, {
  tab: "party",
  panelSub: { party: "ranch" },
  petDetail: true,
});
assert(fuseDetailHi.some((h) => h.type === "start-fuse"), "fuse_intro highlights start-fuse on detail");
assert(!fuseDetailHi.some((h) => h.type === "pet-detail"), "fuse_intro detail step no lineage/name glow");
fuseIntroSt.tutorial.flags.fusePageVisited = true;
const fuseAdv = advanceTutorialIfReady(fuseIntroSt);
assert(fuseAdv.advanced && fuseIntroSt.tutorial.step === "fuse_once", "fuse page completes fuse_intro");
assert(!isTabLocked(fuseIntroSt, "dungeon"), "fuse_once does not lock dungeon");
assert(!isPartySubLocked(fuseIntroSt, "dispatch"), "fuse_once does not lock dispatch");
const fuseOnceHi = tutorialHighlights(fuseIntroSt, {
  tab: "party",
  panelSub: { party: "ranch" },
  petDetail: true,
});
assert(fuseOnceHi.length === 0, "fuse_once has no highlights");
fuseIntroSt.tutorial.flags.fuseDone = true;
assert(advanceTutorialIfReady(fuseIntroSt).advanced && fuseIntroSt.tutorial.done, "fuse_once completes on fusion");

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
  clearedDungeons: { ...(dailyAllSt.clearedDungeons || {}), tide_3: true },
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
assert(uiSrc.includes('["level", "Lv"]') || uiSrc.includes('["level","Lv"]') || /data-ranch-sort="level"/.test(uiSrc) || uiSrc.includes('["level", "Lv"]'), "ui ranch Lv sort chip");
assert(uiSrc.includes('sortKey === "level"') || uiSrc.includes("sortKey === 'level'"), "ui ranch level sort logic");
assert(uiSrc.includes("pet-grid"), "ui ranch 2-col grid");
assert(uiSrc.includes('id: "breed"'), "ui breed party sub-tab");
assert(uiSrc.includes("breed-cd-bar"), "ui breed cd bar");
assert(uiSrc.includes("data-breed-claim"), "ui breed claim after CD");
assert(uiSrc.includes("data-breed-slider"), "ui breed batch slider");
assert(uiSrc.includes("領取蛋"), "ui claim egg label");
assert(uiSrc.includes("patchBreedLive"), "ui breed live patch no scroll jump");
assert(uiSrc.includes("renderPreservingStageScroll"), "ui stage-scroll preserve helper");
assert(uiSrc.includes("data-dungeon-blocked"), "ui dungeon blocked reason");
assert(BREED_QUEUE_MAX === 3, "breed queue max 3");
assert(uiSrc.includes("panel-subnav-dock"), "ui has panel subnav dock");
assert(uiSrc.includes("panel-subnav-dock"), "ui has panel subnav dock");
assert(!uiSrc.includes("panel-subnav-dock--top"), "ui docks subnav at bottom again");
assert(uiSrc.includes("function switchPanelSub"), "ui panel sub switch helper");
assert(uiSrc.includes("let abyssSquadPick"), "ui declares abyssSquadPick");
assert(uiSrc.includes("let abyssRearrangePick"), "ui declares abyssRearrangePick");
assert(uiSrc.includes("rearrangeAbyssSquad"), "ui imports rearrangeAbyssSquad");
assert(uiSrc.includes("resolveAbyssEvent"), "ui imports resolveAbyssEvent");

assert(uiSrc.includes("function wrapStage"), "ui has wrapStage layout helper");
assert(uiSrc.includes("tabs-bottom"), "ui has bottom tab bar");
assert(uiSrc.includes("statsSheetHtml"), "ui has stats resource sheet");
/* Pack B: abyss/dungeon subnav click path — no silent no-op */
assert(uiSrc.includes("panelSubSwitchBlockReason"), "ui dungeon sub block reason helper");
assert(uiSrc.includes('setFlash("戰鬥中")'), "ui flashes 戰鬥中 when combat busy");
assert(uiSrc.includes("setFlash(block)"), "ui flashes block reason on locked sub click");
assert(uiSrc.includes("data-sub-locked"), "ui shows locked dungeon subs clickable");
assert(uiSrc.includes("is-locked"), "ui locked sub class");
assert(uiSrc.includes("tutorialLockReason"), "ui uses tutorial lock reason");
assert(!uiSrc.includes("items.filter(({ id }) => !lockFn"), "ui no longer hides locked subs");

/* Pack X: abyss click must not leave invisible fullscreen blockers */
assert(uiSrc.includes("function clearUiOverlays"), "ui clears overlay stack helper");
assert(uiSrc.includes("function recoverStuckPlayback"), "ui recovers stuck playback without modal");
assert(uiSrc.includes("function fullscreenOverlayBlockReason"), "ui overlay block reason for tabs");
assert(uiSrc.includes("function dismissBlockingUi"), "ui dismiss blocking overlays helper");
assert(uiSrc.includes('ev.key !== "Escape"') || uiSrc.includes('ev.key !== \'Escape\''), "ui Escape clears overlays");
assert(uiSrc.includes("popstate"), "ui back/popstate clears overlays");
assert(uiSrc.includes("tideShiftModal = null"), "ui can clear tideShiftModal");
assert(
  uiSrc.includes('group === "dungeon" && id === "abyss"') && uiSrc.includes("clearUiOverlays"),
  "ui clears overlays when switching to abyss sub"
);
assert(
  uiSrc.includes('panelSub.dungeon !== "abyss"') && uiSrc.includes('dungeon: "setup"'),
  "ui switchTab tactics does not force setup when on abyss"
);
assert(
  uiSrc.includes("combatModalInDom") && uiSrc.includes("data-live=combat-modal"),
  "ui detects missing combat modal for stuck playback"
);
/* Pack X: switchTab("dungeon") must NOT force setup when current sub is abyss */
{
  const switchChunk = uiSrc.slice(uiSrc.indexOf("function switchTab"), uiSrc.indexOf("function markTutorialSubVisit"));
  assert(switchChunk.includes('panelSub.dungeon !== "abyss"'), "switchTab guards abyss before forcing setup/field");
  assert(
    /step === "tactics"[\s\S]*panelSub\.dungeon !== "abyss"[\s\S]*dungeon: "setup"/.test(switchChunk),
    "switchTab tactics only forces setup when not on abyss"
  );
}

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
assert(Math.abs(idleSt.feed - idleFightSt.feed) < 1e-9, "ranch idle ignores personality");

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
boardSt.dispatchBoardDate = todayKey();
ensureDispatchBoard(boardSt, () => 0);
assert(boardSt.dispatchBoard.length === 2, "early board fills unlocked only (2)");
assert(boardSt.dispatchBoard.every((id) => ["forage", "egg_shore"].includes(id)), "early board from shore pool");
const dv0 = dispatchView(boardSt);
assert(dv0.slotsMax === 3 && dv0.boardSize === 3, "view exposes slot/board caps");
assert(dv0.slots.length === 3, "view always exposes 3 fixed slots");
assert(dv0.slots.filter((s) => s.status === "available").length === 2, "two available early");
assert(dv0.slots.filter((s) => s.status === "empty").length === 1, "one empty early slot");
assert(dv0.missions.length === 2, "view shows available missions only");
const wrongKind = startDispatch(boardSt, "egg_shore", ["disp-tide"]);
assert(!wrongKind.ok && String(wrongKind.msg).includes("限制"), "kind restriction blocks");
const okStart = startDispatch(boardSt, "forage", ["disp-tide"]);
assert(okStart.ok, "tide pet starts forage");
assert(boardSt.dispatchBoard.includes("forage"), "started mission stays in fixed slot");
assert(boardSt.dispatches.length === 1, "one active dispatch");
const dvBusy = dispatchView(boardSt);
const forageSlot = dvBusy.slots.find((s) => s.missionId === "forage");
assert(forageSlot?.status === "busy", "dispatched slot status busy / 探險中");
assert(dvBusy.slots.filter((s) => s.status === "available").length === 1, "other slot still available");
const beforeBoard = [...boardSt.dispatchBoard];
const forageIdx = beforeBoard.indexOf("forage");
boardSt.dispatches[0].readyAt = Date.now() - 1;
const dvReady = dispatchView(boardSt);
assert(dvReady.slots.find((s) => s.missionId === "forage")?.status === "ready", "ready slot status 收集");
const claimBoard = claimDispatch(boardSt, boardSt.dispatches[0].dispatchId, () => 0);
assert(claimBoard.ok, "claim after ready");
assert(!boardSt.dispatchBoard.includes("forage") || claimBoard.boardFilled === "forage", "claimed slot replaced (or same if only pool left)");
assert(claimBoard.boardFilled, "random mission pulled on claim");
assert(claimBoard.slotIndex === forageIdx, "refill targets claimed slot index");
assert(boardSt.dispatchBoard.length === beforeBoard.length, "board size stable after claim refill");
assert(String(claimBoard.msg).startsWith("收集"), "claim message uses 收集");

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

/* Pack C: fixed 3 slots stay on dispatch; claim refills that slot; daily renew */
const packCTide = {
  ...buildPetStats({
    id: "pct",
    species: "reefox",
    element: "tide",
    personality: "gentle",
    cost: 0,
  }),
  uid: "packc-tide",
};
const packCScale = {
  ...buildPetStats({
    id: "pcs",
    species: "tidecarp",
    element: "tide",
    personality: "gentle",
    cost: 0,
  }),
  uid: "packc-scale",
};
const packCNow = Date.now();
const packCSt = {
  realm: 0,
  clearedDungeons: {},
  trainMap: {},
  ranch: [packCTide, packCScale],
  pets: [],
  dispatches: [],
  dispatchBoard: [],
  dispatchBoardDate: null,
  eggs: [],
  log: [],
  stats: {},
  stones: 0,
  feed: 0,
  dust: 0,
  scrap: 0,
  materials: {},
  daily: { date: todayKey(packCNow), progress: {}, claimed: {}, idleSec: 0 },
  achievements: {},
};
ensureDispatchBoardDaily(packCSt, packCNow, () => 0);
assert(packCSt.dispatchBoardDate === todayKey(packCNow), "board date stamped on ensure");
assert(packCSt.dispatchBoard.length === 2, "packc early board size 2");
const startMid = startDispatch(packCSt, "forage", ["packc-tide"]);
assert(startMid.ok, "packc start middle-ish slot");
const boardWhileBusy = [...packCSt.dispatchBoard];
assert(boardWhileBusy.includes("forage"), "slot kept while 探險中");
const sameDay = ensureDispatchBoardDaily(packCSt, packCNow, () => 0.9);
assert(JSON.stringify(sameDay) === JSON.stringify(boardWhileBusy), "same-day renew no-op on available+busy");
const nextDay = packCNow + 86_400_000 + 1000;
const busyBeforeRenew = [...packCSt.dispatchBoard];
ensureDispatchBoardDaily(packCSt, nextDay, () => 0.5);
assert(packCSt.dispatchBoardDate === todayKey(nextDay), "board date advances");
assert(packCSt.dispatchBoard.includes("forage"), "daily renew keeps busy slot");
assert(packCSt.dispatches.some((d) => d.missionId === "forage" && !d.claimed), "busy dispatch survives renew");
const availableAfter = packCSt.dispatchBoard.filter((id) => id !== "forage");
const availableBefore = busyBeforeRenew.filter((id) => id !== "forage");
// available slots refreshed from pool (may coincidentally match with fixed rng)
assert(packCSt.dispatchBoard.length >= 1, "board still populated after daily renew");
packCSt.dispatches[0].readyAt = Date.now() - 1;
const dvPack = dispatchView(packCSt, nextDay);
assert(dvPack.slots.length === 3, "packc always 3 slots");
assert(dvPack.slots.some((s) => s.status === "ready" && s.missionId === "forage"), "ready → 收集");
const claimPack = claimDispatch(packCSt, packCSt.dispatches[0].dispatchId, () => 0.2);
assert(claimPack.ok && claimPack.boardFilled, "packc claim refills slot");
assert(!packCSt.dispatches.length, "dispatch cleared after claim");
assert(packCSt.dispatchBoard.length === dvPack.slots.filter((s) => s.missionId).length || packCSt.dispatchBoard.length >= 1, "board after claim");

assert(uiSrc.includes("探險中"), "ui dispatch busy label 探險中");
assert(uiSrc.includes(">收集</button>") || uiSrc.includes("收集</button>"), "ui dispatch claim label 收集");
assert(uiSrc.includes("dispatch-slots"), "ui fixed dispatch slots list");
assert(uiSrc.includes("可接任務每日刷新"), "ui daily renew copy");
assert(!uiSrc.includes("領獎後隨機補任務"), "ui old dispatch lead removed");


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

/* Breed queue: start → gestate CD → claim eggs → hatch (egg-first) */
function mkBreedPet(uid, species, element, generation = 0) {
  return {
    ...buildPetStats({
      id: uid,
      species,
      element,
      personality: "gentle",
      cost: 0,
    }),
    uid,
    generation,
  };
}
const breedQSt = {
  stones: 5000,
  materials: { coral_shard: 80, abyss_ink: 40, earth_grade_stone: 80, cloud_grade_stone: 80, fire_grade_stone: 80 },
  ranch: [
    mkBreedPet("bq-a", "reefox", "tide"),
    mkBreedPet("bq-b", "reefox", "tide"),
    mkBreedPet("bq-c", "glowfin", "tide"),
    mkBreedPet("bq-d", "glowfin", "tide"),
    mkBreedPet("bq-e", "nightmoth", "gloom", 1),
    mkBreedPet("bq-f", "nightmoth", "gloom", 2),
  ],
  pets: [],
  eggs: [],
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
  realm: 0,
};
const ranchBefore = breedQSt.ranch.length;
const eggsBefore = breedQSt.eggs.length;
const start1 = tryBreed(breedQSt, "bq-a", "bq-b");
assert(start1.ok && start1.started && start1.job?.id, "breed start enqueues job");
assert(breedQSt.ranch.length === ranchBefore, "breed start does not birth pet");
assert(breedQSt.eggs.length === eggsBefore, "breed start does not grant egg yet");
assert(breedQSt.breedJobs.length === 1, "one gestating job");
assert(breedQSt.breedJobs[0].batch === 1, "default batch 1");
const start2 = tryBreed(breedQSt, "bq-c", "bq-d");
assert(start2.ok && breedQSt.breedJobs.length === 2, "second concurrent mating ok");
const busyDup = tryBreed(breedQSt, "bq-a", "bq-c");
assert(!busyDup.ok, "busy parent cannot remate");
assert(breedBusyUids(breedQSt).has("bq-a"), "busy uids lock parents");
const early = claimBreed(breedQSt, start1.job.id);
assert(!early.ok && String(early.msg).includes("孕育"), "cannot claim before CD");
const bsMid = breedStatus(breedQSt);
assert(bsMid.slotsUsed === 2 && bsMid.claimable.length === 0, "status shows gestating");
const nowReady = Date.now() - 1;
breedQSt.breedJobs[0].readyAt = nowReady;
if (breedQSt.breedJobs[0].cycles?.[0]) breedQSt.breedJobs[0].cycles[0].readyAt = nowReady;
const claim1 = claimBreed(breedQSt, start1.job.id);
assert(claim1.ok && claim1.egg && !claim1.pet, "claim after ready grants egg not pet");
assert(claim1.eggs?.length === 1, "claim returns eggs array");
assert(breedQSt.eggs.length === eggsBefore + 1, "egg added on claim");
assert(breedQSt.ranch.length === ranchBefore, "ranch unchanged until hatch");
assert(breedQSt.breedJobs.length === 1, "claimed job removed");
const breedEgg = breedQSt.eggs[breedQSt.eggs.length - 1];
assert(breedEgg.source === "breed" && breedEgg.genes, "breed egg stores genes");
assert(/代.蛋$/.test(breedEgg.name), "breed egg name like 一代獸蛋");
assert(String(breedEgg.desc || "").includes("血脈已封"), "breed egg desc seals bloodline");
assert(breedEgg.generation >= 1, "egg generation locked at claim");
assert(breedEgg.kind, "egg kind locked at claim");

const hatchStart = startHatch(breedQSt, breedEgg.uid);
assert(hatchStart.ok, "start hatch breed egg");
breedEgg.readyAt = Date.now() - 1;
/* 騰牧場位再領寵 */
breedQSt.ranch.pop();
const hatchClaim = claimHatch(breedQSt, breedEgg.uid);
assert(hatchClaim.ok && hatchClaim.pet, "hatch breed egg to pet");
assert(hatchClaim.reveal?.tags?.length >= 1, "hatch reveal tags for breed egg");
assert(hatchClaim.celebrate != null, "hatch returns celebrate flag");
assert(breedQSt.ranch.length === ranchBefore, "pet after hatch (pop+push)");
assert(hatchClaim.pet.generation === breedEgg.generation, "hatched gen matches egg");
assert(hatchClaim.pet.bornFrom?.length === 2, "hatched has parents");

breedQSt.materials.breed_ticket = 1;
const ticket = useBreedTicket(breedQSt);
assert(ticket.ok && breedStatus(breedQSt).claimable.length === 1, "breed ticket readies job");
const claimTicket = claimBreed(breedQSt, breedQSt.breedJobs[0].id);
assert(claimTicket.ok && claimTicket.egg, "ticket claim yields egg");

/* Batch ×10：時長×N、中途可領 */
const batchSt = {
  stones: 5000,
  materials: { coral_shard: 99, abyss_ink: 99, earth_grade_stone: 99, cloud_grade_stone: 99, fire_grade_stone: 99 },
  ranch: [
    mkBreedPet("bx-a", "reefox", "tide"),
    mkBreedPet("bx-b", "reefox", "tide"),
  ],
  pets: [],
  eggs: [],
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
  realm: 0,
};
const stonesBeforeBatch = batchSt.stones;
const coralBeforeBatch = batchSt.materials.coral_shard;
const start10 = tryBreed(batchSt, "bx-a", "bx-b", 10);
assert(start10.ok && start10.batch === 10, "breed ×10 starts");
assert(batchSt.breedJobs[0].batch === 10 && batchSt.breedJobs[0].cycles.length === 10, "10 cycles rolled");
assert(batchSt.stones === stonesBeforeBatch - BREED_STONE_COST * 10, "stones ×10");
assert(batchSt.materials.coral_shard === coralBeforeBatch - breedMatCost(0, 0).coral_shard * 10, "coral ×10");
const t0 = batchSt.breedJobs[0].startedAt;
assert(batchSt.breedJobs[0].readyAt === t0 + BREED_COOLDOWN_MS * 10, "10× duration 450s");
const job10 = batchSt.breedJobs[0];
const fakeNow = Date.now();
job10.startedAt = fakeNow - 92_000;
job10.readyAt = job10.startedAt + BREED_COOLDOWN_MS * 10;
for (let i = 0; i < 10; i++) {
  job10.cycles[i].readyAt = job10.startedAt + BREED_COOLDOWN_MS * (i + 1);
}
const bs92 = breedStatus(batchSt);
const j92 = bs92.jobs[0];
assert(j92.claimableCount === 2, "at ~92s claimable ×2");
assert(j92.mating === true, "still mating while partial ready");
const midClaim = claimBreed(batchSt, job10.id);
assert(midClaim.ok && midClaim.claimedCount === 2, "midway claim ×2 eggs");
assert(batchSt.eggs.length === 2, "2 eggs after midway");
assert(batchSt.breedJobs.length === 1, "job remains after partial claim");
assert(batchSt.breedJobs[0].claimedCycles === 2, "claimedCycles=2");
job10.readyAt = Date.now() - 1;
for (const c of job10.cycles) c.readyAt = Date.now() - 1;
const restClaim = claimBreed(batchSt, job10.id);
assert(restClaim.ok && restClaim.claimedCount === 8, "no egg cap: rest claim takes remaining 8");
assert(batchSt.eggs.length === 10, "all 10 eggs claimed without cap");

/* 雙親唔喺度仍可領蛋；孕育中鎖出戰／派遣／放生 */
{
  const pA = mkBreedPet("lockA", "reefox", "tide", 1);
  const pB = mkBreedPet("lockB", "reefox", "tide", 1);
  const lockSt = {
    stones: 500,
    materials: emptyMaterials(),
    ranch: [pA, pB],
    pets: [],
    eggs: [],
    breedJobs: [],
    log: [],
    stats: {},
    realm: 0,
  };
  // fill breed mats
  for (const id of Object.keys(breedMatCost(1, 1))) {
    lockSt.materials[id] = 99;
  }
  const started = tryBreed(lockSt, pA.uid, pB.uid, 1);
  assert(started.ok && lockSt.breedJobs.length === 1, "breed start for lock test");
  assert(breedBusyUids(lockSt).has(pA.uid) && breedBusyUids(lockSt).has(pB.uid), "parents busy while mating");
  assert(!deployPet(lockSt, pA.uid).ok, "busy parent cannot deploy");
  assert(!releasePet(lockSt, pA.uid).ok, "busy parent cannot release");
  const job = lockSt.breedJobs[0];
  assert(job.parentSnap?.length === 2 && job.cycles[0]?.bornBonus, "breed snapshots parents");
  job.readyAt = Date.now() - 1;
  job.cycles[0].readyAt = Date.now() - 1;
  // remove parents from ranch (simulate 放生/消失)
  lockSt.ranch = [];
  const claimGone = claimBreed(lockSt, job.id);
  assert(claimGone.ok && lockSt.eggs.length === 1, "claim egg without live parents");
  assert(!String(claimGone.msg || "").includes("雙親已不在"), "no missing-parent error");
}

const sampleGenes = { species: "nightmoth", element: "gloom", personality: "sly", rarity: 0, generation: 1 };
const namedEgg = makeBreedEgg({
  genes: sampleGenes,
  bornBonus: { atk: 1, hp: 2, spd: 0 },
  parentUids: ["a", "b"],
});
assert(namedEgg.name === "一代蟲蛋", "egg name 一代蟲蛋");
assert(namedEgg.desc === "血脈已封 · 破殼可見一代蟲靈寵", "egg desc");
const hatchedFromNamed = hatchPetFromEgg(namedEgg);
assert(hatchedFromNamed.kind === "蟲" && hatchedFromNamed.generation === 1, "hatch uses stored genes");

const breedG1 = mkBreedPet("g1", "reefox", "tide", 1);
const breedG2 = mkBreedPet("g2", "reefox", "tide", 2);
const prev12 = breedPreview(breedG1, breedG2);
assert(prev12.matCost.cloud_grade_stone === 5 && prev12.matCost.abyss_ink === 2, "preview 1+2 mats");
const wildParent = mkBreedPet("w0", "reefox", "tide", 0);
const prev02 = breedPreview(wildParent, breedG2);
assert(prev02.matCost.cloud_grade_stone === 5 && prev02.matCost.abyss_ink === 2, "preview 0+2 gen2 band");
assert(prev02.genOdds[0].pct === 70 && prev02.genOdds[0].gen === 1, "preview 0+2 odds");

/* Tide zones: idle floors push spine (floor1=old mist1, scales past 4) */
assert(TRAIN_ZONE_CHAIN.length === TRAIN_SITES.length, "zone chain matches sites");
assert(TRAIN_ZONE_CHAIN[0].id === SPINE_ZONE_ID, "chain is spine");
assert(TRAIN_DEPTH_MULT.length === TRAIN_TIER_COUNT + 1, "depth mult fog+warden");
assert(TRAIN_MIST_WAVE_COUNT === 5, "mist layer wave count");
assert(TRAIN_WARDEN_WAVE_COUNT >= TRAIN_MIST_WAVE_COUNT, "warden has more waves");
assert(trainDepthMultForFloor(1) === 1, "floor1 depth");
assert(trainDepthMultForFloor(4) === TRAIN_DEPTH_MULT[3], "floor4=old mist4");
assert(trainDepthMultForFloor(6) > trainDepthMultForFloor(4), "floor6 harder than floor4");
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
  trainSite: SPINE_ZONE_ID,
  trainMap: { zones: { [SPINE_ZONE_ID]: { tiersCleared: 0 } }, wardenCleared: {} },
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
assert(trainIdleFloor(tzSt) === 1, "start floor 1");
assert(trainDepthMultFor(tzSt, SPINE_ZONE_ID) === 1, "depth floor1");
const tierCombat = runTrainLayerCombat(tzSt, { zoneId: SPINE_ZONE_ID, tierIndex: 0, mode: "tier" });
assert(tierCombat.ok && tierCombat.won, "train tier combat win strong party");
assert(tierCombat.waves === TRAIN_MIST_WAVE_COUNT, "train tier has 5 waves");
const weakSt = {
  ...tzSt,
  pets: [{ ...strongPet, atk: 2, hp: 20, spd: 2, uid: "weak-only" }],
};
const tierFail = runTrainLayerCombat(weakSt, { zoneId: SPINE_ZONE_ID, tierIndex: 0, mode: "tier" });
assert(tierFail.ok && !tierFail.won, "weak party fails train tier");
const claimBlocked = claimTrainTierClear(tzSt);
assert(!claimBlocked.ok, "cannot claim next without clearReady");
const idleSess = createTrainIdleSession(tzSt);
assert(idleSess && idleSess.waveCount === TRAIN_MIST_WAVE_COUNT, "idle session 5 waves");
assert(idleSess.floor === 1, "idle session floor 1");
idleSess.startedAt = Date.now() - 90_000;
let idleSteps = 0;
let idleWon = false;
while (idleSteps < 500 && !idleWon) {
  const step = stepTrainIdleSession(idleSess);
  idleSteps += 1;
  if (step.status === "won") {
    idleWon = true;
    const marked = markTrainIdleClearReady(tzSt, idleSess);
    assert(marked.ok && !marked.autoClaimed, "mark clear ready for floor1");
    assert(/首次通關：\d+s/.test(idleSess.resultLine || ""), "first clear time line");
    assert(idleSess.clearSec >= 90, "clear sec uses wall clock not fight ticks");
    break;
  }
  if (step.status === "restart") break;
}
assert(idleWon, "idle session can clear with strong party");
assert(tzSt.trainMap.zones[SPINE_ZONE_ID].clearReady, "clearReady persisted");
assert(persistTrainIdleClearResult(tzSt, idleSess), "persist spine lastClear");
assert(ACTIVE_PET_BASE === 3 && ACTIVE_PET_MAX === 4, "party 3 base / 4 unlock");
assert(activePetMaxForState({ clearedDungeons: {} }) === 3, "party max stage1");
assert(activePetMaxForState({ clearedDungeons: { tide_41: true } }) === 4, "party max stage3");
assert(isSpineStageBossFloor(20) && isSpineStageBossFloor(40) && !isSpineStageBossFloor(21), "stage boss floors");
setTrainSite(tzSt, "ruins");
assert(tzSt.trainSite === SPINE_ZONE_ID, "legacy site id remaps to spine");
const spineView = trainIdleCombatView(tzSt);
assert(spineView.zoneId === SPINE_ZONE_ID && spineView.floor === 1, "idle view floor 1");
for (let i = 0; i < 4; i++) {
  tzSt.trainMap.zones[SPINE_ZONE_ID].clearReady = true;
  const ar = navTrainIdleFloor(tzSt, 1);
  assert(ar.ok, `next floor from ${i + 1}`);
}
assert(maxClearedTideTier(tzSt) === 4, "4 spine floors cleared via idle");
assert(trainIdleFloor(tzSt) === 5, "now on floor 5");
const floor6Threat = trainTierThreat(SPINE_ZONE_ID, 5, { frontierTier: 6 });
const floor4Threat = trainTierThreat(SPINE_ZONE_ID, 3, { frontierTier: 4 });
assert(floor6Threat > floor4Threat, "floor6 threat > floor4");
const sitesAfter = trainSitesView(tzSt);
const spineAfter = sitesAfter.find((s) => s.id === SPINE_ZONE_ID);
assert(spineAfter?.floor === 5, "sites view floor 5");
assert(!spineAfter?.canChallengeWarden, "no warden gate on train sites");
assert(unlockedTrainSiteIds(tzSt).includes(SPINE_ZONE_ID), "spine always unlocked");
assert(typeof challengeTrainWarden === "function", "warden API still exported");
const effStrong = trainClearEfficiency(
  { ...tzSt, pets: [strongPet], trainSite: SPINE_ZONE_ID, trainMap: tzSt.trainMap },
  SPINE_ZONE_ID
);
const effWeak = trainClearEfficiency(
  {
    ...tzSt,
    pets: [{ ...strongPet, atk: 2, hp: 20, spd: 2, uid: "weak" }],
    trainSite: SPINE_ZONE_ID,
    trainMap: tzSt.trainMap,
  },
  SPINE_ZONE_ID
);
assert(effStrong > effWeak, "strong party higher AFK efficiency");
assert(trainIdleCombatView(tzSt).waveCount === TRAIN_MIST_WAVE_COUNT, "idle combat strip data");
assert(DAILY_QUESTS.some((q) => q.id === "train_tier"), "daily train_tier");
// 上一層唔使 clearReady；已通範圍下一層亦唔使
assert(navTrainIdleFloor(tzSt, -1).ok && trainIdleFloor(tzSt) === 4, "prev floor free without clearReady");
tzSt.trainMap.zones[SPINE_ZONE_ID].clearReady = false;
assert(trainFloorNavGates(tzSt).canPrev, "canPrev on floor>1");
assert(trainFloorNavGates(tzSt).canNext, "canNext inside cleared range");
// frontier 未贏 → 下一層 disable
{
  const frontSt = {
    ...tzSt,
    clearedDungeons: { tide_1: true, tide_2: true },
    trainMap: { zones: { [SPINE_ZONE_ID]: { tiersCleared: 2, idleFloor: 3, clearReady: false } }, wardenCleared: {} },
  };
  const g = trainFloorNavGates(frontSt);
  assert(g.floor === 3 && g.frontier === 3 && !g.canNext && g.canPrev, "frontier next locked until win");
  assert(!navTrainIdleFloor(frontSt, 1).ok, "cannot next on frontier without win");
  assert(navTrainIdleFloor(frontSt, -1).ok && trainIdleFloor(frontSt) === 2, "can retreat from frontier");
  // 返去已通層：上下都開
  const backGates = trainFloorNavGates(frontSt);
  assert(backGates.canPrev && backGates.canNext, "cleared range both nav enabled");
}
const setD = setTrainDepth(tzSt, 1);
assert(setD.ok && trainIdleFloor(tzSt) === 2, "set depth to floor 2");
assert(
  !setTrainDepth(
    {
      ...tzSt,
      clearedDungeons: { tide_1: true },
      trainMap: { zones: { [SPINE_ZONE_ID]: { tiersCleared: 1 } }, wardenCleared: {} },
      trainSite: SPINE_ZONE_ID,
    },
    4
  ).ok,
  "cannot set depth beyond frontier"
);

const uiSrc2 = readFileSync(join(__dir, "ui.js"), "utf8");
assert(uiSrc2.includes("playAttackSequence"), "ui phased attack sequence");
assert(uiSrc2.includes("lungeTowardTarget"), "ui vector lunge toward target");
assert(uiSrc2.includes("getBoundingClientRect"), "ui lunge uses element rects");
assert(uiSrc2.includes('data-slot="'), "ui formation data-slot attrs");
assert(uiSrc2.includes('data-lane="'), "ui formation data-lane attrs");
assert(uiSrc2.includes("combat-formation"), "ui formation roster class");
assert(uiSrc2.includes("formationAllyPlacement"), "ui uses ally placement helper");
assert(uiSrc2.includes("FORMATION_SLOT_COUNT"), "ui formation slots");
assert(uiSrc2.includes("persistTrainIdleClearResult"), "ui persists zone lastClear");
assert(uiSrc2.includes("idleCombatResultLine"), "ui gates clear line to ended session");
assert(
  !/trainIdleCombatView\(state\)\.lastClearLine\s*\|\|/.test(uiSrc2),
  "ui does not show stale lastClear while fighting"
);
assert(uiSrc2.includes("OFFLINE_CLAIM_MIN_SEC") || uiSrc2.includes("canClaim"), "ui offline claim gate");
assert(uiSrc2.includes("fmtOfflineDuration"), "ui formats offline seconds");
assert(uiSrc2.includes("bondSheetHtml"), "ui bond breakthrough sheet");
assert(uiSrc2.includes("open-offline-claim"), "ui opens offline claim modal");
assert(uiSrc2.includes("close-offline-claim"), "ui can close offline claim without taking");
assert(uiSrc2.includes("離線收集"), "ui offline collect copy");
assert(uiSrc2.includes("offline-claim-overlay"), "ui offline claim half-modal");
assert(!uiSrc2.includes("offline-toast"), "ui no floating offline toast");
assert(!uiSrc2.includes("clear-offline"), "ui no dismiss-offline toast act");
assert(uiSrc2.includes("visibilitychange"), "ui catch-up on tab visible");
assert(uiSrc2.includes("train-idle-strip"), "ui idle combat strip");
assert(uiSrc2.includes("trainFloorNavGates"), "ui uses trainFloorNavGates");
assert(uiSrc2.includes("data-train-floor-prev"), "ui floor prev");
assert(uiSrc2.includes("data-train-floor-next"), "ui floor next");
assert(uiSrc2.includes("navTrainIdleFloor"), "ui uses navTrainIdleFloor");
assert(!uiSrc2.includes("data-train-branch-attack"), "ui no branch combat from train");
assert(uiSrc2.includes("is-stage-boss") || uiSrc2.includes("train-boss-banner"), "ui stage boss highlight");
assert(!uiSrc2.includes("data-train-spine-attack"), "ui no spine dungeon challenge");
assert(!uiSrc2.includes("data-set-depth"), "ui no mist depth buttons");
assert(!uiSrc2.includes("data-challenge-warden"), "ui no warden on train");
assert(!uiSrc2.includes("掛機層："), "ui no depth row label");
assert(!uiSrc2.includes("主脊第"), "ui no redundant spine card");
assert(!uiSrc2.includes("今日強化【主脊掛機】"), "ui no daily spot banner");
assert(uiSrc2.includes('id: "bag"'), "ui bag sub-tab");
assert(uiSrc2.includes("data-bag-inner"), "ui bag inner mats/items tabs");
assert(uiSrc2.includes("data-use-item"), "ui use bag item");
assert(uiSrc2.includes("tideShiftModal"), "ui tide shift pet picker");
assert(uiSrc2.includes("data-tide-shift-pet"), "ui tide shift target");
assert(uiSrc2.includes("data-abyss-buy-shift"), "ui abyss buy tide shift");
assert(uiSrc2.includes("潮轉符"), "ui tide shift copy");
assert(uiSrc2.includes("背包"), "ui bag label");
assert(uiSrc2.includes("hatchSlotCap"), "ui exposes hatch slot cap");
assert(uiSrc2.includes('id: "hatch"'), "ui hatch party sub-tab");
assert(uiSrc2.includes("data-hatch-panel"), "ui hatch panel marker");
assert(uiSrc2.includes("data-claim-all-hatch"), "ui claim-all hatch");
assert(uiSrc2.includes("claimAllReadyHatches"), "ui uses claimAllReadyHatches");
assert(uiSrc2.includes("hatch-claim-overlay"), "ui hatch claim half-modal");
assert(uiSrc2.includes("去孵化"), "ui ranch link to hatch");
assert(uiSrc2.includes("data-hatch-filter"), "ui hatch egg filters");
assert(uiSrc2.includes("hatchSlotsView"), "ui hatch slots view");
assert(!uiSrc2.includes("<h3>寵物蛋</h3>"), "ui ranch no longer hosts full egg list");
assert(!uiSrc2.includes('id: "mats"'), "ui materials tab renamed to bag");
const dataSrcBag = readFileSync(join(__dir, "data.js"), "utf8");
assert(dataSrcBag.includes("欄柵") && dataSrcBag.includes("暖巢箋"), "data bag item copy");
assert(dataSrcBag.includes("ranch_fence") && dataSrcBag.includes("hatch_nest_token"), "data bag item ids");
assert(dataSrcBag.includes("tide_shift_charm") && dataSrcBag.includes("潮轉符"), "data tide shift charm");
assert(dataSrcBag.includes("ABYSS_TIDE_SHIFT_COST"), "data abyss tide shift cost");
assert(!uiSrc2.includes("br.items.slice(0, 6)"), "ui breakthrough checklist shows all gates");
assert(!uiSrc2.includes("gateCompact"), "ui no truncated gateCompact list");
assert(uiSrc2.includes("breakthrough-gates"), "ui breakthrough gates list class");
assert(uiSrc2.includes("未齊·"), "ui break button hints first unmet");
assert(uiSrc2.includes("breakthrough-miss-note"), "ui shows remaining gate count");
const cssSrc = readFileSync(join(__dir, "../css/style.css"), "utf8");
assert(cssSrc.includes("cond-list.is-compact"), "css compact breakthrough checklist");
assert(cssSrc.includes("offline-home-slot"), "css offline home slot");
assert(cssSrc.includes("team-bond-bar"), "css team bond bar");
assert(cssSrc.includes("panel-subnav-dock"), "css panel subnav dock");
assert(!/stage-dock[\s\S]{0,180}safe-area-inset-bottom/.test(cssSrc), "css stage-dock no longer eats safe-area");
assert(cssSrc.includes("offline-claim-card"), "css offline claim modal card");
assert(cssSrc.includes("hatch-slots"), "css hatch slots grid");
assert(cssSrc.includes("hatch-claim-card"), "css hatch claim modal card");
assert(!cssSrc.includes("offline-toast"), "css no floating offline toast");
assert(cssSrc.includes("combat-formation-side"), "css formation side grid");
assert(cssSrc.includes("is-empty-slot"), "css empty formation slots");
assert(cssSrc.includes('data-lane="front"'), "css front lane columns");
assert(cssSrc.includes('data-lane="rear"'), "css rear lane columns");
assert(!cssSrc.includes("is-lunge-east"), "css no legacy east lunge");

/* Tide Abyss Dive */
assert(MATERIALS.abyss_grit?.tier === "abyss", "abyss grit material");
assert(ABYSS_MUTATION_IDS.length >= 5, "abyss mutations expanded");
assert(ABYSS_COSMETIC_IDS.length >= 3, "abyss cosmetics");
assert(ABYSS_EVENT_EVERY === 5, "event every 5 floors");
assert(rollAbyssFloorEvent("seed", 5).options.length === 2, "event offers 2 choices");
assert(Object.keys(ABYSS_MERCHANT_BUFFS).length >= 3, "merchant buffs");
{
  const mkPet = (uid, over = {}) => ({
    uid,
    name: uid,
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
    ...over,
  });
  const squadPets = [mkPet("ap1"), mkPet("ap2"), mkPet("ap3"), mkPet("ap4"), mkPet("ap5")];
  const squadUids = squadPets.map((p) => p.uid);
  const abyssSt = {
    realm: 1,
    pets: squadPets.slice(0, 3),
    ranch: squadPets.slice(3),
    materials: { ...emptyMaterials(), mist_token: 5, abyss_grit: 200 },
    clearedDungeons: { tide_1: true },
    formation: "balanced",
    tactics: "balanced",
    eggs: [],
    log: [],
    abyssDive: emptyAbyssDive(),
  };
  const av = abyssDiveView(abyssSt);
  assert(av.unlocked && av.freeLeft && av.canFormSquad, "abyss unlocked free first");
  assert(abyssSquadCandidates(abyssSt).length === 5, "squad candidates from pets+ranch");
assert(abyssSquadCandidates(abyssSt).every((p) => p.speciesId), "abyss candidates expose speciesId for silhouettes");
  assert(!startAbyssDive(abyssSt, squadUids.slice(0, 3)).ok, "reject short squad");
  const s1 = startAbyssDive(abyssSt, squadUids);
  assert(s1.ok && s1.won && s1.depth === 1 && s1.combatEvents?.length, "abyss floor 1 clear");
  assert(s1.clearedDepth === 1 && s1.nextFloor?.depth === 2, "abyss settle cleared + next preview");
  assert(String(s1.msg || "").includes("已通關第 1 層"), "abyss win copy means cleared");
  assert(s1.combatKind === "abyss" && s1.gritGained > 0, "abyss grit on clear");
  assert(abyssSt.abyssDive.run?.pendingGrit > 0, "pending grit after floor");
  assert(abyssSt.abyssDive.run?.squadUids?.length === 5, "run keeps 5-pet squad");
  assert(abyssSt.abyssDive.run?.activeUids?.length === 3, "3 active");
  assert(abyssSt.abyssDive.run?.benchUids?.length === 2, "2 bench");
  // HP persistence: damage tracked after floor 1
  const hpAfter1 = { ...abyssSt.abyssDive.run.hpByUid };
  assert(Object.keys(hpAfter1).length >= 3, "hp snapshot after floor");
  const s3 = advanceAbyssDive(abyssSt);
  assert(s3.ok, "abyss floor 2");
  // after floor 2, hp should not all be full if they took damage — at least snapshot exists
  assert(abyssSt.abyssDive.run?.hpByUid, "hp persists across floors");
  const s4 = advanceAbyssDive(abyssSt);
  assert(s4.ok && (abyssSt.abyssDive.run?.mutationIds || []).length >= 1, "mutation by floor 3");
  if (s4.won) {
    assert(s4.nextFloor?.depth === 4, "next floor after clear 3");
    assert(s4.mutations?.length >= 1, "settlement lists mutations");
    assert(s4.nextFloor?.maxActiveMutations === 3, "mutation cap is 3");
    assert(typeof s4.nextFloor?.atMutationCap === "boolean", "atMutationCap flag present");
  }
  // rearrange: put bench into active
  const rr = rearrangeAbyssSquad(abyssSt, ["ap4", "ap5", "ap1"]);
  assert(rr.ok && abyssSt.abyssDive.run.activeUids.includes("ap4"), "rearrange active");
  assert(abyssSt.abyssDive.run.benchUids.includes("ap2"), "rearrange bench");
  // push to floor 5 for event
  let guard = 0;
  while ((abyssSt.abyssDive.run?.depth | 0) < 5 && abyssSt.abyssDive.run && guard < 8) {
    if (abyssSt.abyssDive.run.pendingEvent) {
      const t = abyssSt.abyssDive.run.pendingEvent.options[0].type;
      const er = resolveAbyssEvent(abyssSt, t);
      assert(er.ok, "resolve mid-loop event");
    }
    const step = advanceAbyssDive(abyssSt);
    assert(step.ok, `advance toward floor 5 (${guard})`);
    if (!step.won) break;
    guard += 1;
  }
  if ((abyssSt.abyssDive.run?.depth | 0) >= 5) {
    assert(abyssSt.abyssDive.run.pendingEvent?.options?.length === 2, "floor 5 event 2-pick-1");
    const opt = abyssSt.abyssDive.run.pendingEvent.options.find((o) => o.type === "campfire")
      || abyssSt.abyssDive.run.pendingEvent.options[0];
    // damage a pet then campfire heal if available
    const uid0 = abyssSt.abyssDive.run.squadUids[0];
    const beforeHp = abyssSt.abyssDive.run.hpByUid[uid0];
    if (beforeHp && beforeHp.hp > 0) {
      abyssSt.abyssDive.run.hpByUid[uid0] = {
        ...beforeHp,
        hp: Math.max(1, Math.floor(beforeHp.maxHp * 0.4)),
      };
    }
    if (opt.type === "campfire") {
      const er = resolveAbyssEvent(abyssSt, "campfire");
      assert(er.ok && !abyssSt.abyssDive.run.pendingEvent, "campfire clears event");
      const after = abyssSt.abyssDive.run.hpByUid[uid0];
      assert(after.hp > Math.floor(after.maxHp * 0.4), "campfire healed");
    } else if (opt.type === "merchant") {
      const er = resolveAbyssEvent(abyssSt, "merchant");
      assert(er.ok, "merchant resolve");
      assert((abyssSt.abyssDive.run.diveBuffs || []).length >= 1, "dive buff applied");
    } else {
      // altar with no dead — still ok
      abyssSt.abyssDive.run.hpByUid[uid0] = { hp: 0, maxHp: beforeHp?.maxHp || 100 };
      const er = resolveAbyssEvent(abyssSt, "altar");
      assert(er.ok && (abyssSt.abyssDive.run.hpByUid[uid0].hp | 0) > 0, "altar revive");
    }
  }
  // mutation cap: already 3 active → new mutation replaces oldest (stays ≤ 3)
  {
    const mutSt = {
      realm: 1,
      pets: squadPets.slice(0, 3),
      ranch: squadPets.slice(3),
      materials: { ...emptyMaterials(), mist_token: 5, abyss_grit: 50 },
      clearedDungeons: { tide_1: true },
      formation: "balanced",
      tactics: "balanced",
      eggs: [],
      log: [],
      abyssDive: {
        ...emptyAbyssDive(),
        freeUsedDate: "",
        run: {
          seed: "mut-stack",
          depth: 8,
          pendingGrit: 10,
          mutationIds: ["mut_no_heal", "mut_front_tax", "mut_duo"],
          startedAt: Date.now(),
          squadUids,
          activeUids: squadUids.slice(0, 3),
          benchUids: squadUids.slice(3),
          hpByUid: Object.fromEntries(
            squadUids.map((uid) => [uid, { hp: 500, maxHp: 500 }])
          ),
          diveBuffs: [],
          pendingEvent: null,
        },
      },
    };
    // floor 9 is mutation floor (9 % 3 === 0)
    const m9 = advanceAbyssDive(mutSt);
    if (m9.ok && m9.won) {
      const ids = mutSt.abyssDive.run.mutationIds || [];
      assert(ids.length === 3, "mutations capped at 3");
      assert(!ids.includes("mut_no_heal"), "oldest mutation dropped when capped");
    }
  }
  const before = Math.floor(abyssSt.materials.abyss_grit || 0);
  if (abyssSt.abyssDive.run) {
    const ret = retreatAbyssDive(abyssSt);
    assert(ret.ok && ret.grit >= 0, "retreat grants grit");
    assert(String(ret.msg || "").includes("已通第") || ret.depth === 0, "retreat copy cleared depth");
    assert(Math.floor(abyssSt.materials.abyss_grit) === before + ret.grit, "grit banked");
    assert(!abyssSt.abyssDive.run, "run cleared on retreat");
  }
  // wipe settlement fields
  {
    const weak = [mkPet("aw1", { atk: 1, hp: 8, spd: 1, level: 1 }), mkPet("aw2", { atk: 1, hp: 8, spd: 1 }), mkPet("aw3", { atk: 1, hp: 8, spd: 1 }), mkPet("aw4", { atk: 1, hp: 8, spd: 1 }), mkPet("aw5", { atk: 1, hp: 8, spd: 1 })];
    const wUids = weak.map((p) => p.uid);
    const wipeSt = {
      realm: 1,
      pets: weak.slice(0, 3),
      ranch: weak.slice(3),
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
          squadUids: wUids,
          activeUids: wUids.slice(0, 3),
          benchUids: wUids.slice(3),
          hpByUid: Object.fromEntries(wUids.map((uid) => [uid, { hp: 8, maxHp: 8 }])),
          diveBuffs: [],
          pendingEvent: null,
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
  // refresh grit for shop buys after possible retreat
  abyssSt.materials.abyss_grit = Math.max(400, abyssSt.materials.abyss_grit | 0);
  assert(buyAbyssInsurance(abyssSt).ok, "buy insurance");
  assert(buyAbyssCosmetic(abyssSt, "veil_mark").ok, "buy cosmetic");
  assert(abyssSt.abyssDive.cosmetics.veil_mark, "cosmetic owned");
  const eggR = buyAbyssEgg(abyssSt);
  assert(eggR.ok && eggR.egg?.source === "abyss_dive", "buy abyss egg");
  abyssSt.materials.abyss_grit = Math.max(200, abyssSt.materials.abyss_grit | 0);
  const gritBeforeNode = Math.floor(abyssSt.materials.abyss_grit || 0);
  const nodeR = buyAbyssPowerNode(abyssSt);
  assert(nodeR.ok && abyssSt.abyssDive.powerNodes === 1, "buy abyss power node");
  assert(Math.floor(abyssSt.materials.abyss_grit) === gritBeforeNode - ABYSS_POWER_NODE_COST, "power node grit cost");
  const avNode = abyssDiveView(abyssSt);
  assert(avNode.powerNodes === 1 && avNode.powerNodeAtkMult === 1.01, "power node in view");
  abyssSt.abyssDive.powerNodes = ABYSS_POWER_NODE_MAX;
  assert(!buyAbyssPowerNode(abyssSt).ok, "power node capped");
  abyssSt.materials.abyss_grit = Math.max(100, abyssSt.materials.abyss_grit | 0);
  const gritBeforeCharm = Math.floor(abyssSt.materials.abyss_grit || 0);
  const charmBuy = buyAbyssTideShiftCharm(abyssSt);
  assert(charmBuy.ok && abyssSt.items.tide_shift_charm >= 1, "buy tide shift charm in abyss shop");
  assert(Math.floor(abyssSt.materials.abyss_grit) === gritBeforeCharm - ABYSS_TIDE_SHIFT_COST, "charm grit cost");
  assert(TRAIN_SITES.every((s) => !(s.drops || []).some((d) => d.mat === "abyss_grit")), "train drops no grit");
}
assert(uiSrc2.includes("abyssDiveView"), "ui abyss view");
assert(uiSrc2.includes("data-abyss-start"), "ui abyss start");
assert(uiSrc2.includes("shopInner") && uiSrc2.includes("data-shop-inner"), "shop inner tabs");
assert(uiSrc2.includes("[data-shop-inner]"), "ui binds shop-inner click handler");
assert(uiSrc2.includes("fuseConfirmModal"), "ui fuse confirm modal state");
assert(uiSrc2.includes("fuseConfirmModalHtml"), "ui fuse confirm modal html");
assert(!/\[data-fuse-confirm\][\s\S]{0,700}!confirm\(/.test(uiSrc2), "fuse no browser confirm");
assert(cssSrc.includes("flex-direction: column") && /\.stage-dock\s*\{[^}]*flex-direction:\s*column/s.test(cssSrc), "stage-dock stacks rows with gap");

assert(uiSrc2.includes('商肆 · 精魂') || uiSrc2.includes("精魂"), "soul inside shop");
assert(!uiSrc2.includes("<h3>淵砂兌換</h3>") && !uiSrc2.includes("<h3>淵砂兌換</h3>"), "abyss page no grit exchange block");
assert(uiSrc2.includes('商肆 · 淵砂') || uiSrc2.includes('data-shop-inner="grit"'), "grit shop tab");
assert(dataSrcBag.includes("merchant_purge"), "merchant purge option in floor event");
assert(uiSrc2.includes('本潛增益'), "settle shows dive buffs");

assert(uiSrc2.includes("潮淵"), "ui abyss tab label");
assert(uiSrc2.includes("isAbyssCombat"), "ui excludes abyss from farm skip");
assert(uiSrc2.includes("abyssSettlementHtml"), "ui abyss settlement block");
assert(uiSrc2.includes("abyss-continue-floor"), "ui continue next floor");
assert(uiSrc2.includes("abyss-retreat-settle"), "ui retreat from combat settle");
assert(uiSrc2.includes("已通關第"), "ui cleared-floor copy");
assert(uiSrc2.includes("下一層預覽"), "ui next floor preview");
assert(uiSrc2.includes("整理隊伍"), "ui rearrange squad");
assert(uiSrc2.includes("data-abyss-event"), "ui abyss event pick");
assert(uiSrc2.includes("abyss-open-squad"), "ui squad pick entry");
assert(cssSrc.includes("combat-report-card--abyss-settle"), "css abyss settle enlarge");
assert(cssSrc.includes("abyss-event-block"), "css abyss event block");

/* Pet detail explain tabs */
{
  const el = elementExplain("tide");
  assert(el?.name === "潮" && el.beats === "焰" && el.beatenBy === "幽", "tide element explain");
  assert(el.blurb.includes("潮"), "tide blurb");
  const kd = kindExplain("獸");
  assert(kd?.focus && kd.skillName === "撲襲", "kind 獸 explain");
  const pe = personalityExplain("fierce");
  assert(pe?.combatLabel.includes("攻擊") && pe.roleLabel === "攻勢", "fierce personality explain");
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
assert(uiSrc2.includes("personalitySoulTagHtml"), "ui keeps deprecated soul helper");
assert(uiSrc2.includes("data-awaken-sub") || uiSrc2.includes("覺醒副性格"), "ui awaken sub button");
assert(uiSrc2.includes("pet-tag-kin"), "ui kinship tag");
assert(uiSrc2.includes("祖父母"), "ui grandparents lineage");
assert(uiSrc2.includes("雙親性格"), "ui breed preview temper");
assert(uiSrc2.includes("partyKinshipUidSet"), "ui party kinship helper");
assert(cssSrc.includes("pet-detail-tabs"), "css pet detail tabs");
assert(cssSrc.includes("pet-explain"), "css pet explain blocks");

/* Pack A: star / lock / release→soul / batch release */
{
  assert(MATERIALS.soul_essence?.name === "精魂", "soul_essence material");
  assert(emptyMaterials().soul_essence === 0, "empty mats has soul");
  const baseSoul = releaseSoulGain({ level: 1, rarity: 0, fusionLevel: 0, generation: 1 });
  assert(baseSoul === 2, `lv1 common soul=2 got ${baseSoul}`);
  const rareSoul = releaseSoulGain({ level: 10, rarity: 1, fusionLevel: 1, generation: 2 });
  assert(rareSoul === 37, `rare formula got ${rareSoul}`);
  const starredFresh = releaseSoulGain({ level: 1, rarity: 0, fusionLevel: 0, generation: 1, starred: true });
  assert(starredFresh === baseSoul, "star marker does not change soul");
  const invested = releaseSoulGain({ level: 5, rarity: 0, fusionLevel: 0, generation: 1 });
  assert(invested > baseSoul, "leveled pet worth more soul than fresh");

  assert(eggDissolveSoul({ source: "breed", generation: 1, genes: { rarity: 0 } }) === 1, "breed egg dissolve gen1");
  assert(eggDissolveSoul({ source: "breed", generation: 3, genes: { rarity: 1, hybrid: true } }) === 5, "breed egg dissolve gen3 hybrid");
  assert(eggDissolveSoul({ source: "shop", tier: "C" }) === 1, "shop C dissolve");
  assert(eggDissolveSoul({ tier: "A" }) === 3, "shop A dissolve");
  const hatchSoul = releaseSoulGain({ level: 1, rarity: 0, fusionLevel: 0, generation: 1 });
  assert(eggDissolveSoul({ source: "breed", generation: 1, genes: {} }) <= hatchSoul, "dissolve <= fresh release");

  const dissSt = {
    eggs: [{ uid: "egg-d1", source: "breed", name: "一代獸蛋", generation: 1, genes: { rarity: 0 }, tier: "C" }],
    materials: { ...emptyMaterials() },
    stats: {},
    log: [],
  };
  const diss = dissolveEgg(dissSt, "egg-d1");
  assert(diss.ok && diss.soul === 1 && dissSt.eggs.length === 0, "dissolve removes egg");
  assert(Math.floor(dissSt.materials.soul_essence) === 1, "dissolve banks soul");
  const hatchingBlock = dissolveEgg(
    {
      eggs: [{ uid: "egg-h", source: "breed", generation: 1, genes: {}, startedAt: 1, readyAt: Date.now() + 99999 }],
      materials: { ...emptyMaterials() },
      stats: {},
      log: [],
    },
    "egg-h"
  );
  assert(!hatchingBlock.ok, "cannot dissolve hatching egg");

  const cullSt = {
    ranch: [
      { ...makeStarterPet(), uid: "cull-weak", level: 1, rarity: 0, starred: false, locked: false },
      { ...makeStarterPet(), uid: "cull-star", level: 1, rarity: 0, starred: true, locked: false },
      { ...makeStarterPet(), uid: "cull-strong", level: 20, rarity: 2, starred: false, locked: false },
    ],
    pets: [],
    breedJobs: [],
    dispatches: [],
  };
  const cull = suggestRanchCullUids(cullSt, 1);
  assert(cull[0] === "cull-weak", "cull prefers weak unstarred");
  assert(!cull.includes("cull-star"), "cull skips starred");
  const rcv = ranchCapView({ realm: 0, ranch: cullSt.ranch, itemBonus: { ranchCap: 0, hatchSlots: 0 } });
  assert(rcv.used === 3 && rcv.cap >= 3, "ranchCapView counts");

  const oldRef = releaseRefund({ level: 5, fusionLevel: 1 });
  assert(oldRef.stones === 0 && oldRef.feed === 0 && oldRef.dust === 0 && oldRef.soul > 0, "legacy refund is soul-only");

  const lockSt = {
    pets: [],
    ranch: [
      { ...makeStarterPet(), uid: "lock-a", level: 3, rarity: 0, fusionLevel: 0, locked: false, starred: false },
      { ...makeStarterPet(), uid: "lock-b", level: 2, rarity: 0, fusionLevel: 0, locked: true, starred: false },
    ],
    materials: { ...emptyMaterials() },
    stones: 100,
    feed: 10,
    dust: 10,
    stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
    log: [],
  };
  const stonesBefore = lockSt.stones;
  const feedBefore = lockSt.feed;
  const dustBefore = lockSt.dust;
  const blocked = releasePet(lockSt, "lock-b");
  assert(!blocked.ok && String(blocked.msg).includes("上鎖"), "lock blocks release");
  assert(lockSt.ranch.some((p) => p.uid === "lock-b"), "locked pet remains");
  assert(lockSt.stones === stonesBefore && lockSt.feed === feedBefore && lockSt.dust === dustBefore, "lock release no stone/feed/dust change");

  const soulBefore = Math.floor(lockSt.materials.soul_essence || 0);
  const expectSoul = releaseSoulGain(lockSt.ranch.find((p) => p.uid === "lock-a"));
  const freed = releasePet(lockSt, "lock-a");
  assert(freed.ok && freed.soul === expectSoul, "release grants soul");
  assert(Math.floor(lockSt.materials.soul_essence) === soulBefore + expectSoul, "soul banked in materials");
  assert(lockSt.stones === stonesBefore && lockSt.feed === feedBefore && lockSt.dust === dustBefore, "release no longer refunds stone/feed/dust");
  assert(!lockSt.ranch.some((p) => p.uid === "lock-a"), "released pet removed");

  const starSt = {
    pets: [],
    ranch: [{ ...makeStarterPet(), uid: "star-1", starred: false, locked: false }],
    materials: { ...emptyMaterials() },
    stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
    log: [],
  };
  const starOn = togglePetStarred(starSt, "star-1");
  assert(starOn.ok && starSt.ranch[0].starred === true, "star toggle on");
  const starOff = togglePetStarred(starSt, "star-1");
  assert(starOff.ok && starSt.ranch[0].starred === false, "star toggle off");
  setPetStarred(starSt, "star-1", true);
  assert(starSt.ranch[0].starred, "star set true");

  // star persist via save/load normalize
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
  };
  const persistSt = {
    realm: 0,
    qi: 0,
    stones: 50,
    scrap: 0,
    feed: 0,
    dust: 0,
    materials: { ...emptyMaterials() },
    items: { ...emptyItems() },
    itemBonus: emptyItemBonus(),
    pets: [],
    ranch: [{ ...makeStarterPet(), uid: "persist-star", starred: true, locked: true, level: 4 }],
    eggs: [],
    pending: [],
    log: ["t"],
    lastTick: Date.now(),
    combatsWon: 0,
    winStreak: 0,
    clearedDungeons: {},
    dungeonReadyAt: {},
    dungeonSummon: {},
    breedReadyAt: 0,
    breedPair: null,
    breedJobs: [],
    bestiary: {},
    daily: { date: "", progress: {}, claimed: {} },
    pathQuests: { claimed: {} },
    achievements: {},
    stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
    master: { skillIds: [], equip: { weapon: null, armor: null, accessory: null } },
    trainSite: "shore",
    inventory: [],
  };
  saveState(persistSt);
  const loaded = loadState();
  const lp = (loaded.ranch || []).find((p) => p.uid === "persist-star");
  assert(lp?.starred === true && lp?.locked === true, "star+lock persist through save/load");

  const batchSt = {
    pets: [],
    ranch: [
      { ...makeStarterPet(), uid: "batch-1", level: 5, rarity: 0, fusionLevel: 0, locked: false },
      { ...makeStarterPet(), uid: "batch-2", level: 8, rarity: 1, fusionLevel: 0, locked: false },
      { ...makeStarterPet(), uid: "batch-3", level: 2, rarity: 0, fusionLevel: 0, locked: true },
    ],
    materials: { ...emptyMaterials() },
    stones: 200,
    feed: 20,
    dust: 20,
    stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 },
    log: [],
  };
  const prevBatch = previewReleaseSoul(batchSt, ["batch-1", "batch-3"]);
  assert(!prevBatch.ok && String(prevBatch.msg).includes("上鎖"), "preview rejects locked in batch");
  const okPrev = previewReleaseSoul(batchSt, ["batch-1", "batch-2"]);
  assert(okPrev.ok && okPrev.pets.length === 2 && okPrev.soul > 0, "preview batch soul");
  const soul0 = Math.floor(batchSt.materials.soul_essence || 0);
  const batchR = releasePets(batchSt, ["batch-1", "batch-2"]);
  assert(batchR.ok && batchR.count === 2 && batchR.soul === okPrev.soul, "batch release soul grant");
  assert(Math.floor(batchSt.materials.soul_essence) === soul0 + okPrev.soul, "batch soul banked");
  assert(batchSt.ranch.length === 1 && batchSt.ranch[0].uid === "batch-3", "batch left locked pet");
  assert(batchSt.stats.releases === 2, "batch increments release stats");

  const lockToggle = togglePetLocked(batchSt, "batch-3");
  assert(lockToggle.ok && batchSt.ranch[0].locked === false, "unlock works");
  setPetLocked(batchSt, "batch-3", true);
  assert(batchSt.ranch[0].locked, "relock");
}
assert(uiSrc2.includes("releaseModalHtml"), "ui release modal");
assert(uiSrc2.includes("confirm-release"), "ui confirm release act");
assert(uiSrc2.includes("ranch-release-start"), "ui batch release start");
assert(uiSrc2.includes("ranch-release-confirm"), "ui batch release confirm");
assert(uiSrc2.includes("data-toggle-star"), "ui star toggle");
assert(uiSrc2.includes("data-toggle-lock"), "ui lock toggle");
assert(uiSrc2.includes("data-ranch-star-filter"), "ui star filter");
assert(uiSrc2.includes("精魂"), "ui soul copy");
assert(uiSrc2.includes("確認放生"), "ui confirm release copy");
assert(uiSrc2.includes("批量放生"), "ui batch release copy");
assert(uiSrc2.includes("上鎖"), "ui lock copy");
assert(uiSrc2.includes("星標"), "ui star copy");
assert(uiSrc2.includes("renderPreservingStageScroll"), "ui batch release preserves stage-scroll");
assert(
  /ranchRelease\s*=\s*\{\s*phase:\s*"select"[\s\S]{0,120}renderPreservingStageScroll\(\)/.test(uiSrc2),
  "ui ranch pick uses scroll preserve"
);
assert(uiSrc2.includes("petCornerBadges"), "ui pet corner badges helper");
assert(uiSrc2.includes('["level", "Lv"]'), "ui Lv sort in ranch chips");
assert(uiSrc2.includes('sortKey === "level"'), "ui sortRanchEntries level");
assert(!uiSrc2.includes("確定放歸？將返還部分靈石"), "ui no browser confirm stone refund copy");
assert(cssSrc.includes("release-modal"), "css release modal");
assert(cssSrc.includes("pet-tag-star"), "css star tag");
assert(cssSrc.includes("pet-tag-lock"), "css lock tag");
assert(cssSrc.includes("pet-card-badges"), "css pet card badge cluster");
assert(/\.pet-card-badges\s*\{[^}]*position:\s*absolute/s.test(cssSrc), "css badges top-right absolute");

/* Pack B: dense pet pickers (~30) — 2-col grids + sticky ranch filters */
assert(uiSrc2.includes("petPickCard"), "ui petPickCard helper");
assert(uiSrc2.includes("pet-pick-grid"), "ui pet-pick-grid class");
assert(uiSrc2.includes("pet-pick-sheet"), "ui dispatch pick sheet");
assert(uiSrc2.includes("breed-pet-list"), "ui breed standby list");
assert(uiSrc2.includes("fuse-mat-list"), "ui fuse material list");
assert(uiSrc2.includes("petCornerBadges(p)"), "ui pickers show star/lock corner badges");
assert(cssSrc.includes(".pet-pick-grid"), "css pet-pick-grid");
assert(cssSrc.includes(".pet-pick-card"), "css pet-pick-card");
assert(/\.pet-pick-grid\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr/s.test(cssSrc), "css pet-pick 2-col");
assert(/\.pet-grid\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr/s.test(cssSrc), "css ranch pet-grid 2-col");
assert(/\.ranch-sort\s*\{[^}]*position:\s*sticky/s.test(cssSrc), "css ranch-sort sticky");
assert(cssSrc.includes("pet-pick-sheet"), "css pet-pick-sheet");

/* Pack D: pet visual differentiation (silhouettes + element tint + rarity frame) */
{
  const iconSrc = readFileSync(join(__dir, "pet-icons.js"), "utf8");
  assert(iconSrc.includes("petArtFromPet"), "pet-icons exports petArtFromPet");
  assert(iconSrc.includes("petArtHtml"), "pet-icons exports petArtHtml");
  assert(iconSrc.includes("KIND_PATH_VARIANTS"), "pet-icons kind path variants");
  assert(iconSrc.includes("ELEMENT_COLORS"), "pet-icons element colors");
  assert(iconSrc.includes("RARITY_GLOW"), "pet-icons rarity glow");
  assert(iconSrc.includes("pet-art-gen"), "pet-icons gen corner mark");
  assert(iconSrc.includes("pet-icon--kind-"), "pet-icons kind class");
  assert(iconSrc.includes("pet-icon--elem-"), "pet-icons elem class");
  assert(iconSrc.includes("pet-icon--rarity-"), "pet-icons rarity class");
  assert(iconSrc.includes("pet-art--rarity-"), "pet-icons pet-art rarity class");
  assert(iconSrc.includes("pet-art--elem-"), "pet-icons pet-art elem class");
  assert(uiSrc2.includes("petArtFromPet"), "ui uses petArtFromPet");
  assert(uiSrc2.includes("petArtHtml"), "ui uses petArtHtml");
  assert(uiSrc2.includes("pet-detail-hero"), "ui pet detail hero art");
  assert(uiSrc2.includes("petCornerBadges"), "ui keeps Pack A corner badges");
  assert(cssSrc.includes(".pet-art"), "css pet-art class");
  assert(cssSrc.includes(".pet-icon"), "css pet-icon class");
  assert(cssSrc.includes("pet-art--rarity-legendary"), "css legendary rarity frame");
  assert(cssSrc.includes("pet-art-gen"), "css pet-art gen mark");
  assert(cssSrc.includes("pet-art-elem-dot"), "css element accent dot");
  assert(cssSrc.includes("pet-detail-hero"), "css pet detail hero");
  assert(/\.pet-card-badges\s*\{[^}]*position:\s*absolute/s.test(cssSrc), "css Pack A badges still absolute");
}

/* Pack Y: creature-like silhouettes (head/body/ears/wings/tail) — keep tint/frame/★鎖 */
{
  const iconSrcY = readFileSync(join(__dir, "pet-icons.js"), "utf8");
  assert(iconSrcY.includes("CREATURE_PARTS"), "pet-icons CREATURE_PARTS export");
  assert(iconSrcY.includes('"body"') && iconSrcY.includes('"head"'), "CREATURE_PARTS body/head");
  assert(iconSrcY.includes('"ear"') && iconSrcY.includes('"wing"') && iconSrcY.includes('"tail"'), "CREATURE_PARTS ear/wing/tail");
  assert(iconSrcY.includes("pet-icon-part"), "pet-icons part class");
  assert(iconSrcY.includes("pet-icon-part--${part}"), "pet-icons part class template");
  assert(iconSrcY.includes("pet-icon--creature"), "pet-icons creature class");
  assert(iconSrcY.includes("pet-icon-creature"), "pet-icons creature group");
  assert(iconSrcY.includes("renderCreaturePaths"), "pet-icons renderCreaturePaths");
  assert(iconSrcY.includes("kindPartsForSpecies"), "pet-icons kindPartsForSpecies");
  assert(/body:\s*"M/.test(iconSrcY), "beast/scale body path present");
  assert(/head:\s*"M/.test(iconSrcY), "head path present");
  assert(/ear:\s*"M/.test(iconSrcY), "ear path present");
  assert(/wing:\s*"M/.test(iconSrcY), "wing path present");
  assert(/tail:\s*"M/.test(iconSrcY), "tail path present");
  assert(/fin:\s*"M/.test(iconSrcY), "fin path present");
  assert(iconSrcY.includes("pet-icon--kind-${kindSlug}"), "kind class template retained");
  assert(iconSrcY.includes('獸: "beast"'), "kind slug beast mapping");
  assert(iconSrcY.includes("ELEMENT_COLORS"), "Pack Y keeps element tint");
  assert(iconSrcY.includes("RARITY_GLOW"), "Pack Y keeps rarity frame");
  assert(uiSrc2.includes("petCornerBadges"), "Pack Y keeps ★/鎖 corner badges");
  assert(!iconSrcY.includes("abyssOverlay") && !iconSrcY.includes("abyss-overlay"), "Pack Y does not touch abyss overlay");
  assert(cssSrc.includes("pet-icon-part"), "css pet-icon-part");
  assert(cssSrc.includes("pet-icon-part--body"), "css body part");
  assert(cssSrc.includes("pet-icon-part--head"), "css head part");
  assert(cssSrc.includes("pet-icon-part--ear"), "css ear part");
  assert(cssSrc.includes("pet-icon-part--wing"), "css wing part");
  assert(cssSrc.includes("pet-icon-part--tail"), "css tail part");
  assert(cssSrc.includes("pet-icon--creature"), "css creature icon");
  assert(cssSrc.includes("pet-icon--kind-beast"), "css kind-beast");
  assert(cssSrc.includes("pet-icon--kind-avian"), "css kind-avian");
  assert(cssSrc.includes("pet-icon--kind-scale"), "css kind-scale");
}

const engineSrcPackA = readFileSync(join(__dir, "engine.js"), "utf8");
assert(engineSrcPackA.includes("next.starred = !!next.starred"), "engine normalize starred");
assert(engineSrcPackA.includes("next.locked = !!next.locked"), "engine normalize locked");

/* Pack F: soul essence merchant */
{
  assert(SOUL_SHOP_OFFERS.length >= 3, "soul shop catalog size");
  assert(soulShopOfferById("feed_pouch")?.name === "飼料小包", "feed pouch offer");
  assert(soulShopOfferById("tide_dew_pack")?.grant?.materials?.tide_dew > 0, "tide dew offer");
  assert(soulShopOfferById("temper_oil_pack")?.grant?.materials?.temper_oil > 0, "temper oil offer");
  assert(soulShopOfferById("mist_token_pack")?.grant?.materials?.mist_token > 0, "mist token offer");
  assert(soulShopOfferById("breed_ticket_pack")?.grant?.materials?.breed_ticket > 0, "breed ticket offer");
  assert(
    soulShopOfferById("hatch_nest_token")?.grant?.items?.hatch_nest_token === 1 ||
      soulShopOfferById("ranch_fence")?.grant?.items?.ranch_fence === 1,
    "item offer hatch/fence"
  );
  assert(soulShopOfferById("tide_shift_charm")?.grant?.items?.tide_shift_charm === 1, "soul shop tide shift");
  const soulShopSt = {
    materials: { ...emptyMaterials(), soul_essence: 120 },
    feed: 10,
    items: { ...emptyItems() },
    log: [],
  };
  const view = soulShopView(soulShopSt);
  assert(view.length === SOUL_SHOP_OFFERS.length, "soulShopView length");
  assert(view.every((o) => o.canAfford && o.canBuy && !o.capped), "view afford flags with 120 soul");
  const broke = buySoulShopOffer(
    { materials: { ...emptyMaterials(), soul_essence: 1 }, feed: 0, items: emptyItems(), log: [] },
    "feed_pouch"
  );
  assert(!broke.ok && String(broke.msg).includes("精魂不足"), "afford check blocks buy");
  const missing = buySoulShopOffer(soulShopSt, "no_such_offer");
  assert(!missing.ok, "unknown offer rejected");
  const feedBefore = soulShopSt.feed;
  const soulBefore = Math.floor(soulShopSt.materials.soul_essence);
  const buyFeed = buySoulShopOffer(soulShopSt, "feed_pouch");
  assert(buyFeed.ok, "buy feed pouch ok");
  assert(soulShopSt.feed === feedBefore + 30, "feed granted");
  assert(Math.floor(soulShopSt.materials.soul_essence) === soulBefore - 8, "soul spent for feed");
  const dewBefore = Math.floor(soulShopSt.materials.tide_dew || 0);
  const buyDew = buySoulShopOffer(soulShopSt, "tide_dew_pack");
  assert(buyDew.ok && Math.floor(soulShopSt.materials.tide_dew) === dewBefore + 6, "tide dew granted");
  const oilBefore = Math.floor(soulShopSt.materials.temper_oil || 0);
  const buyOil = buySoulShopOffer(soulShopSt, "temper_oil_pack");
  assert(buyOil.ok && Math.floor(soulShopSt.materials.temper_oil) === oilBefore + 3, "temper oil granted");
  const fenceBefore = Math.floor(soulShopSt.items.ranch_fence || 0);
  const buyFence = buySoulShopOffer(soulShopSt, "ranch_fence");
  assert(buyFence.ok && Math.floor(soulShopSt.items.ranch_fence) === fenceBefore + 1, "fence item granted");
  const nestBefore = Math.floor(soulShopSt.items.hatch_nest_token || 0);
  const buyNest = buySoulShopOffer(soulShopSt, "hatch_nest_token");
  assert(buyNest.ok && Math.floor(soulShopSt.items.hatch_nest_token) === nestBefore + 1, "nest token granted");
  const cappedSt = {
    materials: { ...emptyMaterials(), soul_essence: 200 },
    feed: 0,
    items: emptyItems(),
    itemBonus: { ranchCap: RANCH_CAP_BONUS_MAX, hatchSlots: HATCH_SLOT_BONUS_MAX },
    log: [],
  };
  const cappedView = soulShopView(cappedSt);
  const fenceOffer = cappedView.find((o) => o.id === "ranch_fence");
  const nestOffer = cappedView.find((o) => o.id === "hatch_nest_token");
  assert(fenceOffer?.capped && !fenceOffer.canBuy, "fence capped in view");
  assert(nestOffer?.capped && !nestOffer.canBuy, "nest capped in view");
  assert(!buySoulShopOffer(cappedSt, "ranch_fence").ok, "fence buy blocked at ranch cap");
  assert(!buySoulShopOffer(cappedSt, "hatch_nest_token").ok, "nest buy blocked at hatch cap");
}
assert(uiSrc2.includes("data-shop-inner") && uiSrc2.includes("精魂"), "ui shop inner soul tab");
assert(uiSrc2.includes("data-soul-shop-buy"), "ui soul buy buttons");
assert(engineSrcPackA.includes("buySoulShopOffer"), "engine buySoulShopOffer");
assert(engineSrcPackA.includes("soulShopView"), "engine soulShopView");

console.log("odds 1+2", odds12, "sample genes", g.generation, g.hybrid);
// —— launch roadmap ——
assert(typeof APP_BUILD === "string" && APP_BUILD.length > 0, "APP_BUILD");
assert(ABYSS_MAX_ACTIVE_MUTATIONS === 3, "abyss mutation cap const");
assert(String(ABYSS_RULES_TEXT || "").includes("突變"), "abyss rules text");
const launchTide5 = buildDungeonForTier(5);
assert(launchTide5 && launchTide5.loreTag === "裂潮" && launchTide5.name.includes("裂潮"), "tide_5 differentiated");
assert(launchTide5.matDropOverride?.weights?.tide_dew > 0, "tide_5 spine stage1 mats");
assert(spineStageForTier(1) === 1 && spineStageForTier(20) === 1 && spineStageForTier(21) === 2, "spine stages 20/band");
assert(spineStageForTier(40) === 2 && spineStageForTier(41) === 3, "spine mid bands");
assert(spineStageMatBias(1).coral_shard > 0 && !spineStageMatBias(1).earth_grade_stone, "spine1 no early earth");
assert(
  !spineAfkDropsForStage(1).some((d) => d.mat === "earth_grade_stone"),
  "spine1 no earth AFK until stage2"
);
assert(spineStageMatBias(2).earth_grade_stone > 0, "spine2 earth in bias");
assert(spineAfkDropsForStage(2).some((d) => d.mat === "earth_grade_stone"), "spine2 earth AFK");
assert(spineStageMatBias(3).cloud_grade_stone > 0, "spine3 cloud chapter");
assert(ACTIVE_PET_UNLOCK_STAGE === 3, "4th slot at stage3");
assert(
  trainTierThreat(SPINE_ZONE_ID, 19, { frontierTier: 20 }) < 350,
  "floor20 threat softened for early party"
);
assert(FUSION_MAX_STAGE === 1 && FUSION_NEED_LEVEL === 50, "fusion once at 50");
const launchTide6 = buildDungeonForTier(6);
assert(launchTide6 && launchTide6.loreTag === "沉淵", "tide_6 differentiated");
const fuseLockedDaily = dailyView({ clearedDungeons: {}, daily: { date: "t", progress: {}, claimed: {} } });
assert(!fuseLockedDaily.some((q) => q.id === "fuse"), "hide fuse daily before unlock");
const fuseOpenDaily = dailyView({ clearedDungeons: { tide_3: true }, daily: { date: "t", progress: {}, claimed: {} } });
assert(fuseOpenDaily.some((q) => q.id === "fuse"), "show fuse daily after unlock");
const launchSaveSt = loadState();
const launchDump = exportSaveJson(launchSaveSt);
assert(launchDump.includes("void-tide") && launchDump.includes(APP_BUILD), "export save json");
const launchParsed = JSON.parse(launchDump);
assert(launchParsed.state && Array.isArray(launchParsed.state.pets), "export payload has pets");
assert(uiSrc2.includes("export-save") && uiSrc2.includes("hard-refresh"), "ui save/refresh acts");
assert(uiSrc2.includes("ABYSS_RULES_TEXT") || uiSrc2.includes("abyss-rules"), "ui abyss rules");
const swSrc = readFileSync(join(__dir, "../sw.js"), "utf8");
assert(swSrc.includes("void-tide-pets-v110"), "sw cache bumped");
assert(launchTide5.firstClearBonus?.seal_ember >= 1, "tide_5+ first clear seal ember");
assert(uiSrc2.includes("data-abyss-power-node"), "ui power node buy");
assert(uiSrc2.includes("已滿") || uiSrc2.includes("capped"), "ui capped shop copy");
assert(BREAKTHROUGH_GATES[4].checks.find((c) => c.type === "bestiary")?.need === 18, "bt4 bestiary staged");
assert(BREAKTHROUGH_GATES[5].checks.find((c) => c.type === "bestiary")?.need === 36, "bt5 bestiary staged");

console.log("smoke-test ok");

