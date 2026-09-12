import {
  STAGES,
  REALMS,
  WILD_PETS,
  DUNGEONS,
  EVENTS,
  SKILLS,
  GEAR,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  ACTIVE_PET_BASE,
  ACTIVE_PET_UNLOCK_STAGE,
  activePetMaxForState,
  FUSION_RULES,
  FUSION_MAX_STAGE,
  buildPetStats,
  petLabel,
  masterSkillsForStage,
  skillInfo,
  rollWildEncounter,
  ranchCapForStage,
  upgradeStoneCost,
  upgradeFeedCost,
  fusionStoneCost,
  nextFusionStage,
  fusionMaterialNeed,
  elementMatchup,
  rollBreedGenes,
  BREED_STONE_COST,
  BREED_COOLDOWN_MS,
  BREED_QUEUE_MAX,
  BREED_BATCH_MIN,
  BREED_BATCH_MAX,
  clampBreedBatchCount,
  EGG_CAP,
  makeBreedEgg,
  genEggPrefix,
  BOND_FAIL_RATE_BONUS,
  BOND_FAIL_RATE_CAP,
  FORGE_SCRAP_COST,
  BOND_COST_MAX,
  IDLE_BY_PERSONALITY,
  IDLE_BY_ELEMENT,
  RANCH_IDLE_GLOBAL_MULT,
  DISPATCH_GEN_REWARD_MULT,
  migrateBestiaryMap,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  skillDustCost,
  skillPowerMult,
  SKILL_MAX_LEVEL,
  petSkillIds,
  KIND_SECOND_SKILLS,
  SECOND_SKILL_UNLOCK,
  rollDungeonMatDrop,
  partySynergy,
  MASTER_EQUIP_SLOTS,
  dungeonWaves,
  roleLabel,
  countDungeonRoles,
  evaluateDungeonConditions,
  dungeonElemAtkMult,
  SLOT_LABEL,
  fusionAbsorbRate,
  breedStatInheritance,
  breedStatInheritancePreview,
  petSpeciesBaseline,
  bestiaryKey,
  bestiaryKeyFromPet,
  bestiarySpeciesSummary,
  bestiaryTotal,
  bestiaryEntries,
  bestiaryCombatBonus,
  releaseSoulGain,
  eggDissolveSoul,
  releaseRefund,
  NICK_MAX_LEN,
  DAILY_QUESTS,
  PATH_QUESTS,
  evalPathQuest,
  ACHIEVEMENTS,
  todayKey,
  yesterdayKey,
  OFFLINE_HINT_SEC,
  OFFLINE_CLAIM_MIN_SEC,
  OFFLINE_BANK_CAP_SEC,
  LOGIN_STREAK_REWARDS,
  rarityInfo,
  RARITY_MAX,
  SPECIES,
  PERSONALITIES,
  MAIN_PERSONALITIES,
  SUB_PERSONALITIES,
  PERSONALITY_ROLE_LABEL,
  PERSONALITY_ROLE_SHORT,
  migratePetPersonalityFields,
  applySubGrowthToLevelGains,
  retroactiveSubGrowthBonus,
  SUB_PERSONALITY_AWAKEN_LEVEL,
  pickMainPersonalityId,
  pickSubPersonalityId,
  RANCH_IDLE_BASE,
  petGeneration,
  genLabel,
  childGenerationOdds,
  hybridRecipeForKinds,
  hybridRecipesForKinds,
  tertiaryRecipesForParents,
  genPowerMult,
  BREED_GOALS,
  hybridRecipeSummary,
  hybridRecipeMatrix,
  DUNGEON_TRIALS,
  partyMeetsTrial,
  countHybridBestiary,
  KINDS,
  breakthroughView,
  BREAKTHROUGH_GATES,
  pickDailyDungeonMod,
  stageAt,
  nextStageAt,
  generateDailyDungeon,
  buildDungeonForTier,
  parseDungeonTier,
  dungeonsForRealm,
  dungeonTrialFor,
  dungeonDisplayName,
  RECRUIT_POOL,
  SHOP_OFFER_COUNT,
  TACTICS,
  TACTIC_IDS,
  FORMATIONS,
  FORMATION_IDS,
  FORMATION_SLOT_COUNT,
  formationAllyPlacement,
  formationFoePlacement,
  HYBRID_SKILLS,
  secondSkillIdForPet,
  genCombatMult,
  genAwakenBonus,
  BREED_ELEMENT_MUTATION_RATE,
  weekKey,
  evaluateDungeonChallenge,
  personalityCombatFor,
  gearSetBonus,
  DISPATCH_MISSIONS,
  DISPATCH_SLOT_MAX,
  DISPATCH_BOARD_SIZE,
  ELEMENTS,
  TIDE_SEAL_MAX,
  TIDE_SEAL_MIN_REALM,
  tideSealCombatMult,
  tideSealGainForRealm,
  GEAR_SETS,
  emptyMaterials,
  MATERIALS,
  MATERIAL_IDS,
  emptyItems,
  emptyItemBonus,
  ITEMS,
  ITEM_IDS,
  SOUL_SHOP_OFFERS,
  soulShopOfferById,
  RANCH_CAP_BONUS_MAX,
  HATCH_SLOT_BASE,
  HATCH_SLOT_BONUS_MAX,
  upgradeMatCost,
  breedMatCost,
  skillMatCost,
  fusionMatCost,
  TRAIN_SITES,
  SPINE_ZONE_ID,
  SPINE_THEME_FLOORS,
  spineTrainProfile,
  spineFrontierTier,
  spineStageFromState,
  isSpineStageBossFloor,
  isSpinePreBossFloor,
  spineKeyMatForStage,
  spineThreatBase,
  maxClearedTideTier,
  spineTrunkView,
  dungeonIdForTier,
  isBranchDungeonId,
  resolveBranchDungeon,
  listSideBranches,
  sideBranchById,
  branchFloors,
  isSideBranchUnlocked,
  dispatchNeedStageMet,
  trainSiteById,
  makeStarterPet,
  makeStarterEgg,
  STARTER_EGG_HATCH_MS,
  TUTORIAL_EGG_HATCH_MS,
  makeEgg,
  hatchPetFromEgg,
  eggTierInfo,
  EGG_TIERS,
  normalizeBloodmarks,
  bloodlineLabel,
  bloodmarkCombatMult,
  isTrainSiteUnlocked,
  unlockedTrainSiteIds,
  personalityCombatForPet,
  materialSourceLabel,
  MATERIAL_USES,
  trainSiteUnlockHint,
  primaryTrainSiteForMat,
  suggestTrainForShortage,
  trainDropMult,
  trainDailySpotlightView,
  trainSiteRatesView,
  TRAIN_FOCUS_BONUS,
  TRAIN_DAILY_SPOT_BONUS,
  pickDailyTrainSpotlight,
  DAILY_ALL_CLEAR_BONUS,
  DUNGEON_SWEEP_COUNTS,
  DUNGEON_SUMMON_MIN,
  DUNGEON_SUMMON_MAX,
  clampDungeonSummonCount,
  DUNGEON_ENTRY_MAT_ID,
  dungeonEntryMatCost,
  dungeonEntryTokenPerRun,
  TRAIN_TIER_COUNT,
  TRAIN_MIST_WAVE_COUNT,
  TRAIN_WARDEN_WAVE_COUNT,
  TRAIN_DEPTH_MULT,
  trainDepthMultForFloor,
  TRAIN_ZONE_CHAIN,
  trainZoneMeta,
  trainTierThreat,
  trainWardenThreat,
  rollTideKeyDrop,
  DUNGEON_TIDE_KEY,
  ABYSS_GRIT_ID,
  ABYSS_ENTRY_TOKEN_COST,
  ABYSS_WIPE_KEEP_RATE,
  ABYSS_MUTATION_EVERY,
  ABYSS_MAX_ACTIVE_MUTATIONS,
  ABYSS_RULES_TEXT,
  APP_BUILD,
  ABYSS_UNLOCK_SPINE_STAGE,
  ABYSS_SQUAD_SIZE,
  ABYSS_ACTIVE_SIZE,
  ABYSS_EVENT_EVERY,
  ABYSS_CAMPFIRE_HEAL,
  ABYSS_ALTAR_REVIVE_HP,
  ABYSS_MUTATIONS,
  ABYSS_MUTATION_IDS,
  ABYSS_MERCHANT_BUFFS,
  ABYSS_COSMETICS,
  ABYSS_COSMETIC_IDS,
  ABYSS_INSURANCE_COST,
  ABYSS_EGG_COST,
  ABYSS_EGG_WEEKLY_LIMIT,
  ABYSS_TIDE_SHIFT_COST,
  ABYSS_FUSION_CORE_COST,
  ABYSS_FUSION_CORE_WEEKLY_LIMIT,
  ABYSS_WEEKLY_DEPTH_MILESTONES,
  ABYSS_BEST_DEPTH_MILESTONES,
  emptyAbyssDive,
  abyssFloorGrit,
  abyssHash,
  pickAbyssMutationId,
  rollAbyssMutationChoices,
  rollAbyssFloorEvent,
  abyssCosmeticCombatMult,
  levelStatGains,
  fusionCombatMult,
  fusionMaterialRarityFactor,
  fusionPowerMultFromParts,
  petFusionCombatMult,
  healFusionPowerMult,
  roundStat,
  ceilStat,
  rarityBreedCdMult,
  rarityBreedMutationMult,
  eggHatchMsFor,
  ABYSS_POWER_NODE_COST,
  ABYSS_POWER_NODE_MAX,
  ABYSS_POWER_NODE_ATK,
} from "./data.js";
import {
  normalizeTutorial,
  healTutorialProgress,
  advanceTutorialIfReady,
  advanceTutorialCascade,
  tutorialShopPrice,
  markTutorialFlag,
  skipTutorial,
  maybeStartLateTutorial,
  tutorialWaivesDungeonChallenge,
  tutorialActive,
  TUTORIAL_STARTER_TIDE_DEW,
  TUTORIAL_QI_IDLE_SEC,
} from "./tutorial.js";

const SAVE_KEY = "void-tide-pets-v25";

function defaultMaster() {
  return {
    name: "潮行者",
    /** 敘事殼：唔再出戰；數值僅供顯示 */
    atk: 6,
    hp: 90,
    spd: 7,
    skillIds: [],
    equip: { weapon: null, armor: null, accessory: null },
  };
}

function emptyDaily(now = Date.now()) {
  return {
    date: todayKey(now),
    progress: {
      idle: 0,
      dungeon: 0,
      bond: 0,
      breed: 0,
      win: 0,
      dispatch: 0,
      fuse: 0,
      train_tier: 0,
      train_warden: 0,
    },
    /** questId → true */
    claimed: {},
    /** 累積掛機秒數（當日） */
    idleSec: 0,
    /** 今日已關閉每日儀表板 */
    hubDismissed: false,
    /** 今日全清獎已領 */
    allClearClaimed: false,
  };
}

function emptyTrainMap() {
  return { zones: {}, wardenCleared: {} };
}

const LEGACY_TRAIN_ZONE_IDS = [
  "shore",
  "ruins",
  "deep",
  "mistveil",
  "core",
  "fusehall",
  "abyss",
];

/** 舊七域／秘境首通 → 合併入單一主脊區 */
function migrateTrainMap(parsed) {
  const base = emptyTrainMap();
  const from = parsed?.trainMap || {};
  const oldZones = from.zones || {};
  let maxTiers = 0;
  let anyWarden = false;
  let idleDepth = null;
  for (const id of [...LEGACY_TRAIN_ZONE_IDS, SPINE_ZONE_ID]) {
    const z = oldZones[id];
    if (!z) continue;
    maxTiers = Math.max(maxTiers, z.tiersCleared | 0);
    if (z.idleDepth != null) idleDepth = z.idleDepth;
    if (from.wardenCleared?.[id]) anyWarden = true;
  }
  for (const id of Object.keys(from.wardenCleared || {})) {
    if (from.wardenCleared[id]) anyWarden = true;
  }
  // 舊存檔：通關對應秘境 → 視為已推進霧階
  const clears = parsed?.clearedDungeons || {};
  if (clears.tide_1) maxTiers = Math.max(maxTiers, 1);
  if (clears.tide_2) maxTiers = Math.max(maxTiers, 2);
  if (clears.tide_3) maxTiers = Math.max(maxTiers, 3);
  if (clears.tide_4) {
    maxTiers = Math.max(maxTiers, TRAIN_TIER_COUNT);
    anyWarden = true;
  }
  const spineZ = { tiersCleared: Math.min(TRAIN_TIER_COUNT, maxTiers) };
  if (idleDepth != null) spineZ.idleDepth = idleDepth;
  if (oldZones[SPINE_ZONE_ID]?.clearReady) spineZ.clearReady = true;
  base.zones[SPINE_ZONE_ID] = spineZ;
  if (anyWarden || (spineZ.tiersCleared | 0) >= TRAIN_TIER_COUNT) {
    if (anyWarden) {
      base.wardenCleared[SPINE_ZONE_ID] = true;
      base.zones[SPINE_ZONE_ID].tiersCleared = TRAIN_TIER_COUNT;
    }
  }
  return base;
}

function ensureTrainMap(state) {
  if (!state.trainMap || typeof state.trainMap !== "object") {
    state.trainMap = migrateTrainMap(state);
  }
  if (!state.trainMap.zones) state.trainMap.zones = {};
  if (!state.trainMap.wardenCleared) state.trainMap.wardenCleared = {};
  // 強制單一主脊 id
  if (state.trainSite !== SPINE_ZONE_ID) state.trainSite = SPINE_ZONE_ID;
  if (!state.trainMap.zones[SPINE_ZONE_ID]) {
    state.trainMap.zones[SPINE_ZONE_ID] = { tiersCleared: 0 };
  }
  return state.trainMap;
}

function ensureZoneProgress(state, zoneId) {
  ensureTrainMap(state);
  const id = SPINE_ZONE_ID;
  void zoneId;
  if (!state.trainMap.zones[id]) {
    state.trainMap.zones[id] = { tiersCleared: 0 };
  }
  const z = state.trainMap.zones[id];
  if (z.tiersCleared == null) z.tiersCleared = 0;
  return z;
}

/** 出戰隊綜合戰力（掛機效率／霧階判定） */
export function partyCombatPower(pets) {
  const list = pets || [];
  if (!list.length) return 0;
  let sum = 0;
  for (const p of list) {
    const atk = p.atk || 0;
    const hp = p.hp || 0;
    const spd = p.spd || 0;
    const gen = petGeneration(p) || 0;
    const fus = p.fusionLevel || 0;
    sum += atk + hp * 0.1 + spd * 0.55 + gen * 4 + fus * 6;
  }
  return Math.round(sum);
}

/** 舊霧進度／段主通關 → 寫入 clearedDungeons，統一主脊層 */
function syncMistProgressIntoSpine(state) {
  ensureTrainMap(state);
  const z = ensureZoneProgress(state, SPINE_ZONE_ID);
  let mist = z.tiersCleared | 0;
  if (state.trainMap.wardenCleared?.[SPINE_ZONE_ID]) mist = Math.max(mist, TRAIN_TIER_COUNT);
  if (mist <= 0) return;
  if (!state.clearedDungeons) state.clearedDungeons = {};
  const cleared = maxClearedTideTier(state);
  if (cleared >= mist) return;
  for (let i = cleared + 1; i <= mist; i++) {
    state.clearedDungeons[dungeonIdForTier(i)] = true;
  }
}

/** 當前掛機主脊層（1-based）；預設＝ frontier */
export function trainIdleFloor(state) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  const z = ensureZoneProgress(state, SPINE_ZONE_ID);
  const frontier = spineFrontierTier(state);
  let floor = z.idleFloor | 0;
  if (floor < 1 || floor > frontier) {
    floor = frontier;
    z.idleFloor = floor;
  }
  return floor;
}

/** 深度倍率索引：兼容舊 API；對應主脊層 - 1 */
export function trainDepthIndex(state, zoneId) {
  void zoneId;
  return Math.max(0, trainIdleFloor(state) - 1);
}

/** @deprecated 改用 navTrainIdleFloor；兼容舊深度選擇 */
export function setTrainDepth(state, depthIdx) {
  ensureTrainMap(state);
  const zoneId = SPINE_ZONE_ID;
  state.trainSite = SPINE_ZONE_ID;
  const z = ensureZoneProgress(state, zoneId);
  const frontier = spineFrontierTier(state);
  const floor = Math.max(1, (depthIdx | 0) + 1);
  if (floor > frontier) {
    return { ok: false, msg: `只可選已解鎖層（1–${frontier}）。` };
  }
  z.idleFloor = floor;
  z.clearReady = false;
  clearTrainIdleCombatState(state);
  return {
    ok: true,
    msg: `第 ${floor} 層 · ×${trainDepthMultForFloor(floor).toFixed(2)}`,
  };
}

export function trainDepthMultFor(state, zoneId) {
  void zoneId;
  return trainDepthMultForFloor(trainIdleFloor(state));
}

/**
 * 上一層／下一層按鈕狀態：
 * - 上一層：層 > 1 永遠可返（即使 frontier 打唔贏）
 * - 下一層：喺已通範圍（floor < frontier）永遠可去；frontier 要打贏本層五波（clearReady）
 */
export function trainFloorNavGates(state) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  const floor = trainIdleFloor(state);
  const cleared = maxClearedTideTier(state);
  const frontier = spineFrontierTier(state);
  const z = ensureZoneProgress(state, SPINE_ZONE_ID);
  const wonReady = !!z.clearReady;
  return {
    floor,
    cleared,
    frontier,
    canPrev: floor > 1,
    canNext: floor < frontier || (floor === frontier && wonReady),
  };
}

/**
 * 上一層／下一層。
 * 上一層唔使清波；下一層喺已通範圍可自由行，frontier 要 clearReady（打贏五波）先推進並紀錄已通。
 */
export function navTrainIdleFloor(state, delta) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  const zoneId = SPINE_ZONE_ID;
  state.trainSite = SPINE_ZONE_ID;
  const z = ensureZoneProgress(state, zoneId);
  const floor = trainIdleFloor(state);
  const frontier = spineFrontierTier(state);
  const d = delta | 0;
  if (d < 0) {
    if (floor <= 1) return { ok: false, msg: "已係第 1 層。" };
    z.idleFloor = floor - 1;
    z.clearReady = false;
    clearTrainIdleCombatState(state);
    return { ok: true, msg: `上一層 · 第 ${z.idleFloor} 層`, floor: z.idleFloor };
  }
  if (d > 0) {
    // frontier 未打贏五波 → 唔畀衝下一層
    if (floor >= frontier && !z.clearReady) {
      return { ok: false, msg: `需先掛機打贏本層 ${TRAIN_MIST_WAVE_COUNT} 波，先可去下一層。` };
    }
    let firstClear = false;
    if (floor === frontier && z.clearReady) {
      if (!state.clearedDungeons) state.clearedDungeons = {};
      const id = dungeonIdForTier(floor);
      firstClear = !state.clearedDungeons[id];
      state.clearedDungeons[id] = true;
      z.tiersCleared = Math.max(z.tiersCleared | 0, floor);
      bumpDaily(state, "train_tier", 1);
      const profile = spineTrainProfile(state);
      const primary = profile.primaryMat;
      if (primary) {
        if (!state.materials) state.materials = emptyMaterials();
        state.materials[primary] = (state.materials[primary] || 0) + 1;
      }
      state.stones = (state.stones || 0) + 5;
      pushLog(state, `【主脊】掛機打通第 ${floor} 層！`);
    }
    const next = floor + 1;
    const newFrontier = spineFrontierTier(state);
    if (next > newFrontier) {
      return { ok: false, msg: "已到最前層。" };
    }
    z.idleFloor = next;
    z.clearReady = false;
    clearTrainIdleCombatState(state);
    return {
      ok: true,
      msg: firstClear ? `通關第 ${floor} 層 · 前往第 ${next} 層` : `下一層 · 第 ${next} 層`,
      floor: next,
      firstClear,
    };
  }
  return { ok: false, msg: "無效操作。" };
}

/** 出戰 vs 當前層威脅 → 掛機效率（0.35–1.35；無出戰保底 0.7） */
export function trainClearEfficiency(state, zoneId = null) {
  void zoneId;
  const id = SPINE_ZONE_ID;
  const power = partyCombatPower(state.pets);
  const floor = trainIdleFloor(state);
  const threat = trainTierThreat(id, floor - 1, { frontierTier: floor });
  if (threat <= 0) return 1;
  if (power <= 0) return 0.7;
  const ratio = power / threat;
  return Math.max(0.35, Math.min(1.35, Math.round(ratio * 100) / 100));
}

function emptyLoginStreak(now = Date.now()) {
  return { streakDay: 0, lastLoginDate: "", claimedDate: "" };
}

function emptyPathQuests() {
  return { claimed: {} };
}

function defaultState() {
  const now = Date.now();
  const starterEgg = makeStarterEgg(now);
  const mats = emptyMaterials();
  mats.tide_dew = TUTORIAL_STARTER_TIDE_DEW;
  return {
    realm: 0,
    qi: 0,
    stones: 120,
    scrap: 0,
    feed: 8,
    dust: 8,
    materials: mats,
    /** 消耗道具庫存（欄柵／暖巢箋等；與 materials 分開） */
    items: { ...emptyItems(), ranch_fence: 1, hatch_nest_token: 1 },
    /** 道具永久加成：ranchCap / hatchSlots（按使用次數，見 data.js 註解） */
    itemBonus: emptyItemBonus(),
    trainSite: SPINE_ZONE_ID,
    trainMap: emptyTrainMap(),
    inventory: [],
    master: defaultMaster(),
    pets: [],
    ranch: [],
    eggs: [starterEgg],
    pending: [],
    log: [
      "你沿暗潮抵達荒廢契壇，霧中擱著一枚潮霧蛋。",
      "先孵化首寵、練功升級，再踏入秘境——契壇會逐步解鎖。",
    ],
    lastTick: now,
    combatsWon: 0,
    winStreak: 0,
    breedingUnlocked: true,
    clearedDungeons: {},
    dungeonReadyAt: {},
    dungeonSummon: {},
    breedReadyAt: 0,
    breedPair: null,
    breedJobs: [],
    /** P2 */
    bestiary: {},
    daily: emptyDaily(),
    pathQuests: emptyPathQuests(),
    achievements: {},
    stats: {
      bonds: 0,
      fusions: 0,
      breeds: 0,
      releases: 0,
      bondAttempts: 0,
      hybrids: 0,
      legendBreeds: 0,
      challengeWins: 0,
      maxWinStreak: 0,
      speciesBreeds: {},
      dispatches: 0,
      seals: 0,
      eggsHatched: 0,
    },
    /** P3 繁殖目標進度 */
    breedGoals: emptyBreedGoals(),
    offlineHint: null,
    /** 離線／AFK 待領收益庫（達上限前可累積） */
    offlineBank: emptyOfflineBank(),
    /** 掛機五波戰鬥 session（跨 tab／面板還原） */
    trainIdleCombat: null,
    /** P6 */
    tactics: "balanced",
    shop: emptyShop(),
    dungeonDaily: null,
    /** P8 */
    formation: "balanced",
    /** P9 */
    dispatches: [],
    /** 固定派遣槽（missionId[]，額度 DISPATCH_BOARD_SIZE；派出後仍佔槽） */
    dispatchBoard: [],
    /** 派遣板日期（todayKey）；換日時刷新未派出槽 */
    dispatchBoardDate: null,
    tideSeals: 0,
    tutorial: { done: false, step: "hatch_starter", flags: {} },
    loginStreak: emptyLoginStreak(now),
    /** 潮淵深潛 */
    abyssDive: emptyAbyssDive(now),
  };
}

function emptyShop(now = Date.now()) {
  return { date: todayKey(now), offers: [] };
}

function emptyBreedGoals(now = Date.now()) {
  return {
    date: todayKey(now),
    week: weekKey(now),
    /** goalId → progress number */
    progress: {},
    /** goalId → true（每日／週／一次性領完） */
    claimed: {},
  };
}

function normalizePet(p) {
  if (!p || typeof p !== "object") return p;
  const next = { ...p };
  if (next.level == null) next.level = 1;
  if (next.fusionLevel == null) next.fusionLevel = 0;
  // 舊存檔融2／3 保留；新規則終身一次靠 nextFusionStage 攔截
  if (next.skillLevel == null) next.skillLevel = 1;
  if (next.skillLevel > SKILL_MAX_LEVEL) next.skillLevel = SKILL_MAX_LEVEL;
  {
    const lv = next.level ?? 1;
    const fus = next.fusionLevel ?? 0;
    const secondUnlocked =
      fus >= SECOND_SKILL_UNLOCK.fusionLevel || lv >= SECOND_SKILL_UNLOCK.level;
    if (next.secondSkillLevel == null) {
      next.secondSkillLevel = secondUnlocked ? next.skillLevel : 1;
    }
    if (next.secondSkillLevel > SKILL_MAX_LEVEL) next.secondSkillLevel = SKILL_MAX_LEVEL;
  }
  if (next.rarity == null) next.rarity = 0;
  if (next.rarity > RARITY_MAX) next.rarity = RARITY_MAX;
  if (!next.rarityName) next.rarityName = rarityInfo(next.rarity).name;
  next.generation = petGeneration(next);
  migratePetPersonalityFields(next);
  next.bloodmarks = normalizeBloodmarks(next.bloodmarks);
  next.bloodlineName = bloodlineLabel(next.bloodmarks);
  // 種族↔種類同步：舊熒鰭可能仍標鱗
  if (next.speciesId === "glowfin") {
    next.kind = "光";
    if (!next.skillId || next.skillId === "tide_spray") {
      next.skillId = "glow_lance";
      next.skillName = SKILLS.glow_lance?.name || "熒槍";
    }
  }
  // 寵物不再穿裝備
  if (next.equip) delete next.equip;
  next.starred = !!next.starred;
  next.locked = !!next.locked;
  next.atk = ceilStat(next.atk);
  next.hp = ceilStat(next.hp);
  next.spd = ceilStat(next.spd);
  healFusionPowerMult(next);
  return next;
}

function normalizePetList(list) {
  return (Array.isArray(list) ? list : []).map(normalizePet);
}

function normalizeEggs(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((e) => e && e.uid && !e.claimed)
    .map((e) => {
      const t = eggTierInfo(e.tier || "C");
      let startedAt = e.startedAt ?? null;
      let readyAt = e.readyAt ?? null;
      if ((e.source === "starter" || e.source === "tutorial_shop") && startedAt != null && readyAt != null) {
        const maxReady = startedAt + TUTORIAL_EGG_HATCH_MS;
        if (readyAt > maxReady) readyAt = maxReady;
      }
      const base = {
        uid: e.uid,
        tier: t.id,
        name: e.name || t.name,
        source: e.source || "unknown",
        desc: e.desc,
        startedAt,
        readyAt,
        claimed: false,
      };
      if (e.source === "breed" || e.genes) {
        base.kind = e.kind;
        base.generation = e.generation;
        base.genes = e.genes ? { ...e.genes } : null;
        base.bornBonus = e.bornBonus ? { ...e.bornBonus } : { atk: 0, hp: 0, spd: 0 };
        base.awakenSkillLevel = e.awakenSkillLevel || null;
        base.parentUids = Array.isArray(e.parentUids) ? [...e.parentUids] : [];
        base.parentNames = Array.isArray(e.parentNames) ? [...e.parentNames] : [];
        if (base.genes && (base.generation == null || !base.kind || !base.name)) {
          const gen = Math.max(1, base.genes.generation | 0);
          const sp = SPECIES[base.genes.species];
          const kind = sp?.kind || base.kind || "獸";
          const prefix = genEggPrefix(gen);
          base.generation = gen;
          base.kind = kind;
          base.name = base.name || `${prefix}${kind}蛋`;
          base.desc = base.desc || `可以孵化出${prefix}${kind}寵物`;
        }
      }
      return base;
    });
}

function normalizeItems(raw) {
  const items = emptyItems();
  if (!raw || typeof raw !== "object") return items;
  for (const id of ITEM_IDS) {
    const n = Math.floor(Number(raw[id]) || 0);
    items[id] = Math.max(0, n);
  }
  return items;
}

function normalizeItemBonus(raw) {
  const base = emptyItemBonus();
  if (!raw || typeof raw !== "object") return base;
  base.ranchCap = Math.max(
    0,
    Math.min(RANCH_CAP_BONUS_MAX, Math.floor(Number(raw.ranchCap) || 0))
  );
  base.hatchSlots = Math.max(
    0,
    Math.min(HATCH_SLOT_BONUS_MAX, Math.floor(Number(raw.hatchSlots) || 0))
  );
  return base;
}

export function ranchCap(state) {
  const bonus = normalizeItemBonus(state?.itemBonus).ranchCap;
  return ranchCapForStage(state.realm) + bonus;
}

/** 孵化欄上限（pack B UI）；基準 HATCH_SLOT_BASE + 暖巢箋永久加成 */
export function hatchSlotCap(state) {
  const bonus = normalizeItemBonus(state?.itemBonus).hatchSlots;
  return HATCH_SLOT_BASE + bonus;
}

export function loadState() {
  try {
    const raw =
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem("void-tide-pets-v24") ||
      localStorage.getItem("void-tide-pets-v23") ||
      localStorage.getItem("void-tide-pets-v22") ||
      localStorage.getItem("void-tide-pets-v21") ||
      localStorage.getItem("void-tide-pets-v20") ||
      localStorage.getItem("void-tide-pets-v19") ||
      localStorage.getItem("void-tide-pets-v18") ||
      localStorage.getItem("void-tide-pets-v17") ||
      localStorage.getItem("void-tide-pets-v16") ||
      localStorage.getItem("void-tide-pets-v12") ||
      localStorage.getItem("void-tide-pets-v11") ||
      localStorage.getItem("void-tide-pets-v10") ||
      localStorage.getItem("void-tide-pets-v9") ||
      localStorage.getItem("void-tide-pets-v8") ||
      localStorage.getItem("void-tide-pets-v7") ||
      localStorage.getItem("void-tide-pets-v6") ||
      localStorage.getItem("void-tide-pets-v5") ||
      localStorage.getItem("void-tide-pets-v4") ||
      localStorage.getItem("void-tide-pets-v3") ||
      localStorage.getItem("void-tide-pets-v2") ||
      localStorage.getItem("void-tide-pets-v1");
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    const master = { ...base.master, ...(parsed.master || {}) };
    master.skillIds = masterSkillsForStage(parsed.realm ?? 0);
    const oldEq = master.equip || {};
    master.equip = {
      weapon: oldEq.weapon ?? null,
      armor: oldEq.armor ?? null,
      accessory: oldEq.accessory ?? null,
    };

    let pets = normalizePetList(parsed.pets).map((p) => {
      if (p.skillId) return p;
      const rebuilt = WILD_PETS.find((t) => t.id === p.templateId);
      if (rebuilt) {
        const fresh = buildPetStats(rebuilt);
        return {
          ...fresh,
          ...p,
          skillId: fresh.skillId,
          skillName: fresh.skillName,
          level: p.level ?? fresh.level,
          fusionLevel: p.fusionLevel ?? fresh.fusionLevel,
          skillLevel: p.skillLevel ?? 1,
        };
      }
      return p;
    });

    let ranch = normalizePetList(parsed.ranch);

    // 舊存檔：出戰超過上限且無牧場 → 多餘移入牧場
    if (!Array.isArray(parsed.ranch) && pets.length > ACTIVE_PET_MAX) {
      ranch = pets.slice(ACTIVE_PET_MAX);
      pets = pets.slice(0, ACTIVE_PET_MAX);
    } else if (pets.length > ACTIVE_PET_MAX) {
      ranch = [...ranch, ...pets.slice(ACTIVE_PET_MAX)];
      pets = pets.slice(0, ACTIVE_PET_MAX);
    }

    // 人物裝備廢止：庫存折算為寵用素材
    let inventory = [];
    const oldInv = Array.isArray(parsed.inventory) ? parsed.inventory : [];
    const matBonus = emptyMaterials();
    for (const it of oldInv) {
      if (GEAR[it.gearId]) {
        matBonus.coral_shard = (matBonus.coral_shard || 0) + 1;
        matBonus.tide_dew = (matBonus.tide_dew || 0) + 1;
      }
    }
    master.equip = { weapon: null, armor: null, accessory: null };
    master.skillIds = [];

    // 圖鑑鍵遷移（舊 sp:el:pe:blood → sp:el:blood）後以現有靈寵回填
    const bestiary = migrateBestiaryMap(parsed.bestiary || {});
    for (const p of [...pets, ...ranch]) {
      const key = bestiaryKeyFromPet(p);
      if (key) bestiary[key] = true;
    }

    const mergedMats = { ...emptyMaterials(), ...(parsed.materials || {}) };
    for (const id of MATERIAL_IDS) {
      mergedMats[id] = (mergedMats[id] || 0) + (matBonus[id] || 0);
    }

    const merged = {
      ...base,
      ...parsed,
      master,
      pets,
      ranch,
      eggs: normalizeEggs(parsed.eggs),
      feed: parsed.feed ?? 0,
      dust: parsed.dust ?? 0,
      materials: mergedMats,
      items: normalizeItems(parsed.items),
      itemBonus: normalizeItemBonus(parsed.itemBonus),
      trainSite: SPINE_ZONE_ID,
      trainMap: migrateTrainMap(parsed),
      inventory,
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
      clearedDungeons: parsed.clearedDungeons || {},
      dungeonReadyAt: parsed.dungeonReadyAt || {},
      dungeonSummon: parsed.dungeonSummon || {},
      breedReadyAt: parsed.breedReadyAt || 0,
      breedPair: parsed.breedPair || null,
      breedJobs: migrateBreedJobs(parsed),
      breedingUnlocked: true,
      bestiary,
      daily: ensureDaily(parsed.daily),
      pathQuests: parsed.pathQuests?.claimed
        ? { claimed: { ...parsed.pathQuests.claimed } }
        : emptyPathQuests(),
      achievements: parsed.achievements || {},
      stats: {
        bonds: parsed.stats?.bonds || 0,
        fusions: parsed.stats?.fusions || 0,
        breeds: parsed.stats?.breeds || 0,
        releases: parsed.stats?.releases || 0,
        bondAttempts: parsed.stats?.bondAttempts || 0,
        hybrids: parsed.stats?.hybrids || 0,
        legendBreeds: parsed.stats?.legendBreeds || 0,
        challengeWins: parsed.stats?.challengeWins || 0,
        maxWinStreak: parsed.stats?.maxWinStreak || 0,
        speciesBreeds: parsed.stats?.speciesBreeds || {},
      },
      breedGoals: ensureBreedGoalsState(parsed.breedGoals),
      offlineHint: parsed.offlineHint || null,
      offlineBank: normalizeOfflineBank(parsed.offlineBank),
      trainIdleCombat: parsed.trainIdleCombat || null,
      tactics: TACTIC_IDS.includes(parsed.tactics) ? parsed.tactics : "balanced",
      formation: FORMATION_IDS.includes(parsed.formation) ? parsed.formation : "balanced",
      shop: parsed.shop || emptyShop(),
      dungeonDaily: parsed.dungeonDaily || null,
      winStreak: parsed.winStreak || 0,
      dispatches: Array.isArray(parsed.dispatches) ? parsed.dispatches : [],
      dispatchBoard: Array.isArray(parsed.dispatchBoard) ? parsed.dispatchBoard : [],
      dispatchBoardDate: parsed.dispatchBoardDate || null,
      tideSeals: parsed.tideSeals || 0,
      loginStreak: parsed.loginStreak?.lastLoginDate
        ? { ...emptyLoginStreak(), ...parsed.loginStreak }
        : emptyLoginStreak(),
      tutorial: parsed.tutorial,
      abyssDive: { ...emptyAbyssDive(), ...(parsed.abyssDive || {}) },
    };
    normalizeTutorial(merged);
    healTutorialProgress(merged);
    ensureDispatchBoardDaily(merged);
    return merged;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTick: Date.now() }));
}

/** 匯出存檔 JSON（可複製／下載；含建置號） */
export function exportSaveJson(state = loadState()) {
  const payload = {
    app: "void-tide",
    build: APP_BUILD,
    exportedAt: Date.now(),
    saveKey: SAVE_KEY,
    state: { ...state, lastTick: Date.now() },
  };
  return JSON.stringify(payload);
}

/**
 * 匯入存檔 JSON。成功會寫入 localStorage 並回傳新 state。
 * @returns {{ ok: boolean, msg: string, state?: object }}
 */
export function importSaveJson(raw) {
  try {
    const text = String(raw || "").trim();
    if (!text) return { ok: false, msg: "空白存檔。" };
    const parsed = JSON.parse(text);
    const st = parsed?.state || parsed;
    if (!st || typeof st !== "object" || !Array.isArray(st.pets)) {
      return { ok: false, msg: "存檔格式唔正確（缺少 pets）。" };
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...st, lastTick: Date.now() }));
    const state = loadState();
    pushLog(state, `已匯入存檔（建置 ${parsed.build || "未知"}）。`);
    saveState(state);
    return { ok: true, msg: "匯入成功。", state };
  } catch (err) {
    return { ok: false, msg: `匯入失敗：${err?.message || "JSON 無效"}` };
  }
}

/** 更新公告（建置變更時提示硬刷新） */
export function updateNoticeView() {
  return {
    build: APP_BUILD,
    title: "更新公告",
    body: [
      "潮淵改為主脊階段五解鎖（大後期）；突變層 2 選 1；商人花待結算淵砂。",
      "淵砂商店補回突變保險；週／歷史深度里程碑有小量獎勵。",
      "見聞錄可匯出／匯入存檔。若畫面異常請硬刷新（清 SW 快取）。",
    ].join(" "),
  };
}


export function realmInfo(state) {
  return stageAt(state.realm);
}

export function nextRealm(state) {
  return nextStageAt(state.realm);
}

/** 當日秘境完整定義（tier 公式 + 每日變體）；側枝已廢止 */
export function resolveDungeon(state, dungeonId) {
  if (isBranchDungeonId(dungeonId)) {
    return null;
  }
  ensureDungeonDaily(state);
  const key = state.dungeonDaily?.date || todayKey();
  return generateDailyDungeon(dungeonId, key) || buildDungeonForTier(parseDungeonTier(dungeonId));
}

/** 牧場待命：性格×屬性慢產（全局再 × RANCH_IDLE_GLOBAL_MULT） */
export function tickRanchIdle(state, elapsedSec) {
  const sec = Math.max(0, Number(elapsedSec) || 0);
  if (sec <= 0) return state;
  const busy = dispatchBusyUids(state);
  const ranch = state.ranch || [];
  if (!ranch.length) return state;
  let feed = 0;
  let dust = 0;
  let token = 0;
  const g = RANCH_IDLE_GLOBAL_MULT;
  for (const p of ranch) {
    if (!p || busy.has(p.uid)) continue;
    const pe = RANCH_IDLE_BASE;
    const el = IDLE_BY_ELEMENT[p.elementId] || { feed: 1, dust: 1 };
    const feedRate = pe.feed;
    const dustRate = pe.dust;
    const tokenRate = pe.token || 0;
    feed += feedRate * (el.feed || 1) * g * sec;
    dust += dustRate * (el.dust || 1) * g * sec;
    token += tokenRate * g * sec;
  }
  if (feed > 0) state.feed = (state.feed || 0) + feed;
  if (dust > 0) state.dust = (state.dust || 0) + dust;
  if (token > 0) {
    if (!state.materials) state.materials = emptyMaterials();
    state.materials.mist_token = (state.materials.mist_token || 0) + token;
  }
  return state;
}

function addMaterials(state, mats) {
  if (!mats) return;
  if (!state.materials) state.materials = emptyMaterials();
  for (const [id, n] of Object.entries(mats)) {
    if (!n) continue;
    state.materials[id] = (state.materials[id] || 0) + n;
  }
}

function spendMaterials(state, mats) {
  if (!mats) return true;
  if (!state.materials) state.materials = emptyMaterials();
  for (const [id, n] of Object.entries(mats)) {
    if (!n) continue;
    if (Math.floor(state.materials[id] || 0) < n) return false;
  }
  for (const [id, n] of Object.entries(mats)) {
    if (!n) continue;
    state.materials[id] = (state.materials[id] || 0) - n;
  }
  return true;
}

function formatMats(mats) {
  if (!mats) return "";
  return Object.entries(mats)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => `${MATERIALS[id]?.name || id}×${n}`)
    .join("／");
}

/** P11：材料是否足夠（含缺口） */
export function affordMaterials(state, cost) {
  if (!state.materials) state.materials = emptyMaterials();
  const items = Object.entries(cost || {})
    .filter(([, n]) => n > 0)
    .map(([id, need]) => {
      const have = Math.floor(state.materials[id] || 0);
      return {
        id,
        name: MATERIALS[id]?.name || id,
        need,
        have,
        ok: have >= need,
        short: Math.max(0, need - have),
        source: materialSourceLabel(id),
        use: MATERIAL_USES[id] || "",
      };
    });
  return { ok: items.every((i) => i.ok), items };
}

/** 缺料提示：建議練功地或標明秘境專屬 */
export function shortageHint(state, cost) {
  const suggest = suggestTrainForShortage(state, cost);
  if (!suggest) return { suggest: null, hint: "" };
  if (suggest.dungeonOnly) {
    return { suggest, hint: `【${suggest.matName}】僅秘境掉落` };
  }
  if (suggest.alreadyThere) {
    return { suggest, hint: `缺${suggest.matName} · 已在【${suggest.siteName}】掛機` };
  }
  if (!suggest.unlocked) {
    return {
      suggest,
      hint: `缺${suggest.matName} · ${suggest.unlockHint || `未解鎖【${suggest.siteName}】`}`,
    };
  }
  return {
    suggest,
    hint: `缺${suggest.matName} · 建議【${suggest.siteName}·${suggest.focus}】`,
  };
}

export function materialHintsView(state) {
  return materialsView(state).map((m) => ({
    ...m,
    source: materialSourceLabel(m.id),
    use: MATERIAL_USES[m.id] || "",
  }));
}

/** 主脊掛機產材料（跟通關階段；產量 × 深度 × 出戰效率） */
export function tickTrainSite(state, elapsedSec) {
  if (elapsedSec <= 0) return { mats: {}, feed: 0, dust: 0 };
  ensureTrainMap(state);
  state.trainSite = SPINE_ZONE_ID;
  const active = spineTrainProfile(state);
  if (!state.materials) state.materials = emptyMaterials();
  const depthMult = trainDepthMultFor(state, SPINE_ZONE_ID);
  const eff = trainClearEfficiency(state, SPINE_ZONE_ID);
  const gained = {};
  let feed = 0;
  let dust = 0;
  for (const drop of active.drops || []) {
    const mult = trainDropMult(active, drop, todayKey()) * depthMult * eff;
    if (drop.mat) {
      const expected = (drop.perSec || 0) * mult * elapsedSec;
      const before = state.materials[drop.mat] || 0;
      const after = before + expected;
      state.materials[drop.mat] = after;
      const gainedN = Math.floor(after) - Math.floor(before);
      if (gainedN > 0) gained[drop.mat] = (gained[drop.mat] || 0) + gainedN;
    }
    if (drop.feed) {
      const f = (drop.feed || 0) * mult * elapsedSec;
      state.feed = (state.feed || 0) + f;
      feed += f;
    }
    if (drop.dust) {
      const d = (drop.dust || 0) * mult * elapsedSec;
      state.dust = (state.dust || 0) + d;
      dust += d;
    }
  }
  return {
    mats: gained,
    feed,
    dust,
    site: active,
    depthMult,
    efficiency: eff,
  };
}

/** @deprecated 主脊單一區；保留 API 相容 */
export function setTrainSite(state, siteId) {
  void siteId;
  ensureTrainMap(state);
  state.trainSite = SPINE_ZONE_ID;
  ensureZoneProgress(state, SPINE_ZONE_ID);
  return { ok: true, msg: "主脊潮脈" };
}

export function trainSitesView(state) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  state.trainSite = SPINE_ZONE_ID;
  const spot = trainDailySpotlightView();
  const profile = spineTrainProfile(state);
  const z = ensureZoneProgress(state, SPINE_ZONE_ID);
  const floor = trainIdleFloor(state);
  const frontier = spineFrontierTier(state);
  const depthMult = trainDepthMultForFloor(floor);
  const eff = trainClearEfficiency(state, SPINE_ZONE_ID);
  const stage = profile.spineStage;
  const keyMatId = spineKeyMatForStage(stage);
  return [
    {
      ...profile,
      unlocked: true,
      selected: true,
      unlockHint: null,
      isDailySpot: spot?.siteId === SPINE_ZONE_ID,
      rates: trainSiteRatesView(profile),
      floor,
      frontier,
      tiersCleared: maxClearedTideTier(state),
      tierCount: SPINE_THEME_FLOORS,
      wardenCleared: false,
      depthMult,
      depthLabel: `第 ${floor} 層`,
      efficiency: eff,
      keyMatId,
      keyName: MATERIALS[keyMatId]?.name || "潮鑰",
      keyHave: Math.floor(state.materials?.[keyMatId] || 0),
      canAdvance: trainFloorNavGates(state).canNext,
      clearReady: !!z.clearReady,
      canClaimNext: trainFloorNavGates(state).canNext,
      canChallengeWarden: false,
      canRematchWarden: false,
      idleDepth: floor - 1,
      idleFloor: floor,
      maxDepth: frontier - 1,
      lastClearLine: z.lastClear?.line || null,
      lastClear: z.lastClear || null,
      branches: listSideBranches(state),
    },
  ];
}

/**
 * 領取層推進：需掛機戰鬥先清完一輪五波（z.clearReady）。
 * 而家等同「下一層」（寫入主脊 clearedDungeons）。
 */
export function claimTrainTierClear(state) {
  return navTrainIdleFloor(state, 1);
}

/** @deprecated 改用 claimTrainTierClear；掛機五波循環後再領取 */
export function advanceTrainTier(state) {
  return claimTrainTierClear(state);
}

/** 挑戰／複打段主（扣潮鑰；複打掉稀有材） */
export function challengeTrainWarden(state) {
  ensureTrainMap(state);
  const zoneId = SPINE_ZONE_ID;
  state.trainSite = SPINE_ZONE_ID;
  const z = ensureZoneProgress(state, zoneId);
  const profile = spineTrainProfile(state);
  const rematch = !!state.trainMap.wardenCleared?.[zoneId];
  if (!rematch && (z.tiersCleared | 0) < TRAIN_TIER_COUNT) {
    return { ok: false, msg: "請先攻破全部霧階。" };
  }
  if (!(state.pets || []).length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }
  const keyId = spineKeyMatForStage(profile.spineStage);
  if (!state.materials) state.materials = emptyMaterials();
  if (Math.floor(state.materials[keyId] || 0) < 1) {
    return {
      ok: false,
      msg: `潮鑰不足（需【${MATERIALS[keyId]?.name || keyId}】· 秘境高機率掉落）。`,
    };
  }
  state.materials[keyId] -= 1;
  bumpDaily(state, "train_warden", 1);
  const combat = runTrainLayerCombat(state, { zoneId, tierIndex: TRAIN_TIER_COUNT, mode: "warden" });
  if (!combat.ok) {
    return combat;
  }
  if (!combat.won) {
    pushLog(state, `【主脊】段主未破——出戰隊未能清完 ${TRAIN_WARDEN_WAVE_COUNT} 波，潮鑰已耗。`);
    return {
      ok: false,
      msg: `段主未破 · 已扣潮鑰 · ${TRAIN_WARDEN_WAVE_COUNT} 波未清或全滅`,
      combatKind: "train",
      keySpent: true,
      rematch,
      ...combat,
    };
  }

  if (!rematch) {
    state.trainMap.wardenCleared[zoneId] = true;
    pushLog(state, `打通【主脊】段主！本段掛機深度拉滿。`);
    return {
      ok: true,
      msg: `段主已破 · 深度 ×${trainDepthMultFor(state, zoneId).toFixed(2)}`,
      combatKind: "train",
      firstClear: true,
      unlockedZoneId: null,
      keySpent: true,
      ...combat,
    };
  }

  const remBase = trainZoneMeta(zoneId).rematch || {};
  const rem = {
    stones: remBase.stones || 14,
    materials: {
      ...(remBase.materials || {}),
      [profile.primaryMat]: Math.max(2, remBase.materials?.[profile.primaryMat] || 2),
    },
  };
  if (rem.stones) state.stones = (state.stones || 0) + rem.stones;
  if (rem.materials) addMaterials(state, rem.materials);
  const bits = [];
  if (rem.stones) bits.push(`${rem.stones}石`);
  for (const [id, n] of Object.entries(rem.materials || {})) {
    bits.push(`${MATERIALS[id]?.name || id}×${n}`);
  }
  pushLog(state, `複打【主脊】段主成功，獲 ${bits.join("／")}。`);
  return {
    ok: true,
    msg: `複打成功 · ${bits.join("／")}`,
    combatKind: "train",
    rematch: true,
    reward: rem,
    keySpent: true,
    ...combat,
  };
}

const TRAIN_FOE_PREFIX = {
  spine: "主脊",
  shore: "主脊",
  ruins: "主脊",
  deep: "主脊",
  mistveil: "主脊",
  core: "主脊",
  fusehall: "主脊",
  abyss: "主脊",
};

const TRAIN_FOE_ELEMENT = {
  spine: "tide",
  shore: "tide",
  ruins: "stone",
  deep: "gloom",
  mistveil: "gale",
  core: "tide",
  fusehall: "flame",
  abyss: "gloom",
};

/** 依主脊／霧階組成多波敵陣（一層霧階 = TRAIN_MIST_WAVE_COUNT 波） */
function buildTrainCombatWaves(zoneId, tierIndex, { warden = false, frontierTier = 1 } = {}) {
  const threat = warden
    ? trainWardenThreat(SPINE_ZONE_ID, { frontierTier })
    : trainTierThreat(SPINE_ZONE_ID, tierIndex, { frontierTier });
  const prefix = TRAIN_FOE_PREFIX[zoneId] || TRAIN_FOE_PREFIX.spine;
  const elem = TRAIN_FOE_ELEMENT[zoneId] || "tide";
  const tier = tierIndex | 0;
  const floor = tier + 1;
  // 威脅已按預期等級錨定；唔再疊階段 tierScale（否則同 ratio 下後期頭目會無解）
  const tierScale = 1;
  const preBoss = isSpinePreBossFloor(floor);
  const stageBoss = isSpineStageBossFloor(floor);
  const lateMult = stageBoss ? 1.04 : preBoss ? 1.04 : 1;

  const mkNormal = (name, scale = 1) => ({
    name,
    hp: Math.max(24, Math.round(threat * 1.12 * scale * tierScale)),
    atk: Math.max(4, Math.round(threat * 0.16 * scale * tierScale)),
    spd: Math.max(5, Math.round(5 + threat * 0.055 * scale)),
    element: elem,
    role: "normal",
  });

  const mkElite = (name, scale = 1.35) => ({
    name,
    hp: Math.max(40, Math.round(threat * 1.62 * scale * tierScale * lateMult)),
    atk: Math.max(5, Math.round(threat * 0.2 * scale * tierScale * (preBoss || stageBoss ? 1.06 : 1))),
    spd: Math.max(6, Math.round(6 + threat * 0.065 * scale)),
    element: elem,
    role: "elite",
    skills: ["tide_crush", "coral_spike"].filter((id) => SKILLS[id]),
  });

  const mkBoss = (name) => ({
    name,
    hp: Math.max(80, Math.round(threat * 2.05 * lateMult)),
    atk: Math.max(8, Math.round(threat * 0.2)),
    spd: Math.max(7, Math.round(7 + threat * 0.06)),
    element: "gloom",
    role: "boss",
    actions: 2,
    skills: ["tide_crush", "mist_veil", "coral_spike"].filter((id) => SKILLS[id]),
  });

  if (!warden) {
    const waves = [
      {
        label: `${prefix}散霧`,
        enemies: [mkNormal(`${prefix}游魂`, 0.88), mkNormal(`${prefix}鼠`, 0.84)],
      },
      {
        label: `${prefix}暗流`,
        enemies: [mkNormal(`${prefix}妖`, 0.96), mkNormal(`${prefix}刺`, 0.92)],
      },
      {
        label: `${prefix}潮獸`,
        enemies: [mkNormal(`${prefix}獸`, 1.02), mkNormal(`${prefix}衛`, 0.98)],
      },
      {
        label: stageBoss ? `第${floor}層·先鋒` : preBoss ? `第${floor}層·試煉精英` : `第${floor}層·精英`,
        enemies: [mkElite(`${prefix}精英`, stageBoss ? 1.05 : preBoss ? 1.14 + (tier % 20) * 0.008 : 1.08 + (tier % 20) * 0.008)],
      },
    ];
    if (stageBoss) {
      waves.push({
        label: `第${floor}層·階段頭目`,
        enemies: [mkBoss(`${prefix}階段主`)],
        stageBoss: true,
      });
    } else {
      waves.push({
        label: preBoss ? `第${floor}層·升階試煉` : `第${floor}層·守門`,
        enemies: [mkElite(`${prefix}守門`, (preBoss ? 1.3 : 1.2) + (tier % 20) * 0.006)],
      });
    }
    return waves;
  }

  const waves = [];
  for (let w = 0; w < TRAIN_WARDEN_WAVE_COUNT - 1; w += 1) {
    const scale = 0.88 + w * 0.07;
    if (w === TRAIN_WARDEN_WAVE_COUNT - 2) {
      waves.push({
        label: `主脊精英`,
        enemies: [mkElite(`${prefix}段衛`, scale + 0.18)],
      });
    } else if (w % 2 === 0) {
      waves.push({
        label: `${prefix}第${w + 1}陣`,
        enemies: [mkNormal(`${prefix}影`, scale), mkNormal(`${prefix}靈`, scale * 0.96)],
      });
    } else {
      waves.push({
        label: `${prefix}第${w + 1}陣`,
        enemies: [mkNormal(`${prefix}潮衛`, scale + 0.04)],
      });
    }
  }
  waves.push({ label: `主脊段主`, enemies: [mkBoss(`主脊段主`)] });
  return waves;
}

/** 組出戰方（潮域實戰；與秘境共用加成公式） */
function buildTrainCombatAllies(state) {
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;
  const stageBonus = (state.realm || 0) * 2;
  const synergy = partySynergy(state.pets);
  const dex = bestiaryStatus(state);
  const sealMult = tideSealCombatMult(state.tideSeals || 0);
  const cos = abyssCosmeticCombatMult(state.abyssDive?.cosmetics || {});
  const nodeMult = abyssPowerNodeAtkMult(state);
  const atkMult = synergy.atkMult * dex.atkMult * sealMult * cos.atkMult * nodeMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult * cos.hpMult;
  const allies = [];
  for (const p of state.pets) {
    const skills = petSkillIds(p);
    const gen = petGeneration(p);
    const gMult = genCombatMult(gen);
    const fMult = petFusionCombatMult(p);
    const fAtk = formation.petAtkMult || 1;
    const fHp = formation.petHpMult || 1;
    const fSpd = formation.petSpdMult || 1;
    const pe = personalityCombatForPet(p);
    const pAtk = pe?.atkMult || 1;
    const pHp = pe?.hpMult || 1;
    const pSpd = pe?.spdMult || 1;
    const bm = bloodmarkCombatMult(p.bloodmarks);
    allies.push({
      side: "ally",
      name: displayPetName(p),
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * gMult * fMult * fAtk * pAtk * bm.atk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd * bm.spd),
      elementId: p.elementId,
      skillLevel: p.skillLevel ?? 1,
      secondSkillId: (() => {
        const sid = secondSkillIdForPet(p);
        const unlocked =
          (p.fusionLevel ?? 0) >= SECOND_SKILL_UNLOCK.fusionLevel ||
          (p.level ?? 1) >= SECOND_SKILL_UNLOCK.level;
        return unlocked && sid ? sid : null;
      })(),
      secondSkillLevel: p.secondSkillLevel ?? 1,
      skills,
      skillCd: Object.fromEntries(skills.map((id) => [id, 0])),
      guardTurns: 0,
      atkBuffTurns: 0,
      atkBuffPct: 0,
      generation: gen,
      sustainBias: !!pe?.sustainBias,
    });
  }
  return { allies, synergy, formation, tactics };
}

/**
 * 潮域一層實戰（多波自動戰鬥；至少一隻友方存活且清完所有波才算贏）
 * @returns {{ ok: boolean, won?: boolean, combatEvents?: object[], combatStart?: object, transcript?: string[], waves?: number, rounds?: number, msg?: string, label?: string, mode?: string }}
 */
export function runTrainLayerCombat(state, { zoneId, tierIndex = 0, mode = "tier" } = {}) {
  if (!(state.pets || []).length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }
  const warden = mode === "warden";
  const site = spineTrainProfile(state);
  const tier = tierIndex | 0;
  const frontier = spineFrontierTier(state);
  const waves = buildTrainCombatWaves(SPINE_ZONE_ID, tier, { warden, frontierTier: frontier });
  void zoneId;
  const ctx = buildTrainCombatAllies(state);
  const { allies, synergy, formation, tactics } = ctx;
  if (!allies.length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }

  let waveIndex = 0;
  let foes = spawnWaveFoes(waves[0]);
  _combatUid = 0;
  tagCombatUnits(allies, "a");
  tagCombatUnits(foes, "f");

  const transcript = [];
  const combatEvents = [];
  const say = (text) => {
    transcript.push(text);
    pushCombatText(combatEvents, text);
  };
  const pushWave = (waveIdx, label, foeList) => {
    const waveLine =
      waveIdx === 1
        ? `—— 第 1 波・${label} ——`
        : `—— 第 ${waveIdx} 波・${label} 湧出！——`;
    transcript.push(waveLine);
    combatEvents.push({
      type: "wave",
      text: waveLine,
      waveIndex: waveIdx,
      label,
      foes: foeList.map(unitRosterEntry),
    });
  };
  const pushRound = (r) => {
    const roundLine = `—— 第 ${r} 回合 ——`;
    transcript.push(roundLine);
    combatEvents.push({ type: "round", text: roundLine, round: r });
  };

  const layerLabel = warden ? `段主關` : `霧階${tier + 1}`;
  transcript.push(`御靈師進入【主脊潮脈】${layerLabel}（${waves.length} 波）。`);
  transcript.push(
    `戰術【${TACTICS[tactics]?.name || tactics}】· 陣型【${formation.name}】· 自動戰鬥。`
  );
  if (synergy.labels.length) {
    transcript.push(`陣容羈絆：${synergy.labels.join("、")}。`);
  }

  pushWave(1, waves[0].label, foes);
  const combatStart = {
    allies: allies.map(unitRosterEntry),
    foes: foes.map(unitRosterEntry),
  };

  let round = 0;
  const maxRounds = warden ? 75 : 60;
  let won = false;
  let ended = false;

  const checkSideDown = () => {
    if (allies.every((a) => a.hp <= 0)) return "lose";
    if (foes.every((f) => f.hp <= 0)) return "wave";
    return null;
  };

  const advanceOrWin = () => {
    if (waveIndex + 1 < waves.length) {
      waveIndex += 1;
      foes = tagCombatUnits(spawnWaveFoes(waves[waveIndex]), "f");
      pushWave(waveIndex + 1, waves[waveIndex].label, foes);
      return false;
    }
    return true;
  };

  while (round < maxRounds && !ended) {
    round += 1;
    pushRound(round);
    const order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));

    for (const actor of order) {
      if (actor.hp <= 0) continue;
      const actions = Math.max(1, actor.actions || 1);
      for (let a = 0; a < actions; a += 1) {
        if (actor.hp <= 0) break;
        const down = checkSideDown();
        if (down) break;
        if (actor.side === "ally") act(actor, allies, foes, transcript, combatEvents, tactics);
        else act(actor, foes, allies, transcript, combatEvents, "balanced");
      }
      tickCooldowns(actor);

      const down = checkSideDown();
      if (down === "lose") {
        ended = true;
        say(`折戟【主脊潮脈】${layerLabel}……出戰隊全滅。`);
        break;
      }
      if (down === "wave") {
        if (advanceOrWin()) {
          won = true;
          ended = true;
          say(`清完 ${waves.length} 波，攻破【主脊潮脈】${layerLabel}！`);
          break;
        }
      }
    }
  }

  if (!ended) {
    say("戰鬥逾時，未能通關。");
  }

  const msg = won
    ? `通關 ${layerLabel}（${waves.length} 波）`
    : ended
      ? `${layerLabel} 未破`
      : `${layerLabel} 逾時`;

  return {
    ok: true,
    won,
    mode,
    label: layerLabel,
    waves: waves.length,
    rounds: round,
    transcript: transcript.slice(0, 80),
    combatEvents: combatEvents.slice(0, 120),
    combatStart,
    msg,
  };
}

/** 掛機五波戰場：建立一輪實戰 session（逐步 tick） */
export function createTrainIdleSession(state) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  if (!(state.pets || []).length) return null;
  const zoneId = SPINE_ZONE_ID;
  state.trainSite = SPINE_ZONE_ID;
  const z = ensureZoneProgress(state, zoneId);
  const floor = trainIdleFloor(state);
  const tierIndex = Math.max(0, floor - 1);
  const frontier = spineFrontierTier(state);
  const canUnlockNext = floor === frontier;
  const waves = buildTrainCombatWaves(zoneId, tierIndex, { warden: false, frontierTier: floor });
  const stageBoss = isSpineStageBossFloor(floor);
  const { allies, tactics } = buildTrainCombatAllies(state);
  if (!allies.length) return null;
  _combatUid = 0;
  tagCombatUnits(allies, "a");
  const foes = tagCombatUnits(spawnWaveFoes(waves[0]), "f");
  const site = spineTrainProfile(state);
  const petSig = (state.pets || []).map((p) => `${p.uid}:${p.atk}:${p.hp}:${p.spd}`).join("|");
  return {
    zoneId,
    floor,
    tierIndex,
    canUnlockNext,
    /** 本輪是否首次挑戰當前未通層（首通文案用） */
    isFirstClear: canUnlockNext && !z.clearReady,
    clearReady: !!z.clearReady,
    stageBoss,
    petSig,
    waves,
    waveCount: waves.length,
    waveIndex: 0,
    allies,
    foes,
    tactics,
    round: 0,
    maxRounds: stageBoss ? 70 : 60,
    order: [],
    orderIdx: 0,
    phase: "fight",
    pauseLeft: 0,
    ended: false,
    won: false,
    /** 出手步數（內部）；通關秒數改用牆鐘 startedAt */
    fightTicks: 0,
    startedAt: Date.now(),
    clearSec: null,
    resultLine: null,
    lastText: `—— 第 1 波・${waves[0].label} ——`,
    waveLabel: `第 1／${waves.length} 波・${waves[0].label}`,
    layerLabel: stageBoss ? `第${floor}層·階段頭目` : `第${floor}層`,
    siteName: site.name,
    efficiency: trainClearEfficiency(state, zoneId),
    depthMult: trainDepthMultForFloor(floor),
  };
}

/**
 * 掛機戰鬥一步（約 1 次出手／開新回合／轉場）。
 * @returns {{ status: string, session: object, events?: object[] }}
 */
export function stepTrainIdleSession(session) {
  if (!session) return { status: "empty", session: null };

  if (session.phase === "pause") {
    session.pauseLeft -= 1;
    if (session.pauseLeft <= 0) {
      return { status: "restart", session };
    }
    return { status: "pause", session };
  }

  if (session.ended) {
    return { status: session.won ? "won" : "lost", session };
  }

  const allies = session.allies;
  const foes = session.foes;

  const finishIdleResult = (won, now = Date.now()) => {
    // 牆鐘秒數（含攻擊動畫等待）；唔再用出手步數冒充秒
    const started = session.startedAt || now;
    const sec = Math.max(1, Math.round((now - started) / 1000));
    session.clearSec = sec;
    session.won = !!won;
    if (won) {
      session.resultLine = session.isFirstClear ? `首次通關：${sec}s` : `通關時間：${sec}s`;
    } else {
      session.resultLine = "挑戰失敗";
    }
  };

  if (session.orderIdx >= session.order.length) {
    session.round += 1;
    if (session.round > session.maxRounds) {
      session.ended = true;
      session.won = false;
      session.lastText = "戰鬥逾時，重新開始…";
      finishIdleResult(false);
      session.phase = "pause";
      session.pauseLeft = 2;
      return { status: "lost", session };
    }
    session.order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));
    session.orderIdx = 0;
    session.lastText = `—— 第 ${session.round} 回合 ——`;
    return { status: "round", session };
  }

  // 跳過已死單位（同一 tick 內連跳，避免死怪高亮／空轉）
  let actor = null;
  while (session.orderIdx < session.order.length) {
    const cand = session.order[session.orderIdx];
    session.orderIdx += 1;
    if (cand && cand.hp > 0) {
      actor = cand;
      break;
    }
  }
  if (!actor) {
    // 本輪剩餘皆死——下一 tick 開新回合
    return { status: "skip", session };
  }

  session.fightTicks = (session.fightTicks || 0) + 1;

  const transcript = [];
  const events = [];
  const actions = Math.max(1, actor.actions || 1);
  for (let a = 0; a < actions; a += 1) {
    if (actor.hp <= 0) break;
    if (allies.every((x) => x.hp <= 0) || foes.every((x) => x.hp <= 0)) break;
    if (actor.side === "ally") act(actor, allies, foes, transcript, events, session.tactics);
    else act(actor, foes, allies, transcript, events, "balanced");
  }
  tickCooldowns(actor);

  if (events.length) {
    const last = events[events.length - 1];
    session.lastText = last.text || session.lastText;
  }

  if (allies.every((x) => x.hp <= 0)) {
    session.ended = true;
    session.won = false;
    session.lastText = `折戟【${session.siteName}】${session.layerLabel}……全滅，重新開始`;
    finishIdleResult(false);
    session.phase = "pause";
    session.pauseLeft = 2;
    return { status: "lost", session, events };
  }

  if (foes.every((x) => x.hp <= 0)) {
    if (session.waveIndex + 1 < session.waves.length) {
      session.waveIndex += 1;
      session.foes = tagCombatUnits(spawnWaveFoes(session.waves[session.waveIndex]), "f");
      session.order = [];
      session.orderIdx = 0;
      const w = session.waves[session.waveIndex];
      session.waveLabel = `第 ${session.waveIndex + 1}／${session.waves.length} 波・${w.label}`;
      session.lastText = `—— 第 ${session.waveIndex + 1} 波・${w.label} 湧出！——`;
      return { status: "wave", session, events };
    }
    session.ended = true;
    session.won = true;
    session.lastText = `清完 ${session.waves.length} 波！可換層`;
    finishIdleResult(true);
    session.phase = "pause";
    session.pauseLeft = 2;
    return { status: "won", session, events };
  }

  return { status: "fight", session, events };
}

/**
 * 將掛機一輪結果寫入當前潮域（通關時間跟地點）
 */
export function persistTrainIdleClearResult(state, session) {
  if (!session?.resultLine || !session.zoneId) return false;
  const z = ensureZoneProgress(state, session.zoneId);
  z.lastClear = {
    line: session.resultLine,
    sec: session.clearSec ?? null,
    at: Date.now(),
    first: !!(session.won && session.isFirstClear),
    tierIndex: session.tierIndex | 0,
    won: !!session.won,
  };
  return true;
}

/**
 * 掛機清完一輪後標記 clearReady（frontier 先解鎖「下一層」）。
 */
export function markTrainIdleClearReady(state, session) {
  if (!session?.won) {
    return { ok: false, autoClaimed: false };
  }
  const z = ensureZoneProgress(state, session.zoneId || SPINE_ZONE_ID);
  z.clearReady = true;
  session.clearReady = true;
  return { ok: true, autoClaimed: false };
}

/** UI：閒置掛機戰場摘要（建立 session 用） */
export function trainIdleCombatView(state) {
  ensureTrainMap(state);
  syncMistProgressIntoSpine(state);
  const zoneId = SPINE_ZONE_ID;
  const site = spineTrainProfile(state);
  const z = ensureZoneProgress(state, zoneId);
  const floor = trainIdleFloor(state);
  const frontier = spineFrontierTier(state);
  const eff = trainClearEfficiency(state, zoneId);
  const depthMult = trainDepthMultForFloor(floor);
  const canUnlockNext = floor === frontier;
  return {
    zoneId,
    zoneName: site.name,
    spineStage: site.spineStage,
    frontierTier: frontier,
    floor,
    tierIndex: floor - 1,
    canUnlockNext,
    clearReady: !!z.clearReady,
    lastClearLine: z.lastClear?.line || null,
    lastClear: z.lastClear || null,
    depthLabel: `第 ${floor} 層`,
    depthMult,
    efficiency: eff,
    power: partyCombatPower(state.pets),
    petCount: (state.pets || []).length,
    waveCount: TRAIN_MIST_WAVE_COUNT,
    logLine:
      !(state.pets || []).length
        ? "未出戰——掛機效率最低（請編成出戰隊）"
        : `掛機清場 · ${TRAIN_MIST_WAVE_COUNT} 波 · 第 ${floor} 層`,
  };
}

export function trainMapView(state) {
  ensureTrainMap(state);
  const sites = trainSitesView(state);
  const cur = sites.find((s) => s.selected) || sites[0];
  return {
    sites,
    current: cur,
    idle: trainIdleCombatView(state),
  };
}

export function materialsView(state) {
  if (!state.materials) state.materials = emptyMaterials();
  return MATERIAL_IDS.map((id) => ({
    ...MATERIALS[id],
    count: Math.floor(state.materials[id] || 0),
  }));
}

export function itemsView(state) {
  if (!state.items) state.items = emptyItems();
  if (!state.itemBonus) state.itemBonus = emptyItemBonus();
  const bonus = normalizeItemBonus(state.itemBonus);
  return ITEM_IDS.map((id) => {
    const def = ITEMS[id];
    const count = Math.floor(state.items[id] || 0);
    let bonusNote = "";
    let atCap = false;
    if (id === "ranch_fence") {
      atCap = bonus.ranchCap >= RANCH_CAP_BONUS_MAX;
      bonusNote = `已擴 +${bonus.ranchCap}/${RANCH_CAP_BONUS_MAX}`;
    } else if (id === "hatch_nest_token") {
      atCap = bonus.hatchSlots >= HATCH_SLOT_BONUS_MAX;
      bonusNote = `已擴 +${bonus.hatchSlots}/${HATCH_SLOT_BONUS_MAX}（欄 ${hatchSlotCap(state)}）`;
    } else if (id === "tide_shift_charm") {
      bonusNote = "指定靈寵永久轉屬";
    }
    return {
      ...def,
      count,
      bonusNote,
      atCap,
      needsTarget: !!def.needsTarget,
      canUse: count > 0 && !atCap,
    };
  });
}

function ensureItems(state) {
  if (!state.items) state.items = emptyItems();
  else state.items = normalizeItems(state.items);
  if (!state.itemBonus) state.itemBonus = emptyItemBonus();
  else state.itemBonus = normalizeItemBonus(state.itemBonus);
}

/** 使用背包道具（欄柵／暖巢箋／潮轉符）；永久加成按使用次數計 */
export function useBagItem(state, itemId, petUid = null) {
  ensureItems(state);
  const def = ITEMS[itemId];
  if (!def) return { ok: false, msg: "未知道具。" };
  const have = Math.floor(state.items[itemId] || 0);
  if (have < 1) return { ok: false, msg: `沒有${def.name}。` };

  if (itemId === "ranch_fence") {
    if (state.itemBonus.ranchCap >= RANCH_CAP_BONUS_MAX) {
      return { ok: false, msg: `牧場擴容已達上限（+${RANCH_CAP_BONUS_MAX}）。` };
    }
    state.items[itemId] = have - 1;
    state.itemBonus.ranchCap += 1;
    const cap = ranchCap(state);
    pushLog(state, `用咗欄柵，牧場容量變 ${cap}（永久 +${state.itemBonus.ranchCap}）。`);
    return {
      ok: true,
      msg: `牧場容量 → ${cap}（永久 +${state.itemBonus.ranchCap}/${RANCH_CAP_BONUS_MAX}）`,
      ranchCap: cap,
    };
  }

  if (itemId === "hatch_nest_token") {
    if (state.itemBonus.hatchSlots >= HATCH_SLOT_BONUS_MAX) {
      return { ok: false, msg: `孵化欄已達上限（${HATCH_SLOT_BASE + HATCH_SLOT_BONUS_MAX}）。` };
    }
    state.items[itemId] = have - 1;
    state.itemBonus.hatchSlots += 1;
    const slots = hatchSlotCap(state);
    pushLog(state, `用咗暖巢箋，孵化欄變 ${slots}（永久 +${state.itemBonus.hatchSlots}）。`);
    return {
      ok: true,
      msg: `孵化欄 → ${slots}（永久 +${state.itemBonus.hatchSlots}/${HATCH_SLOT_BONUS_MAX}）`,
      hatchSlotCap: slots,
    };
  }

  if (itemId === "tide_shift_charm") {
    if (!petUid) return { ok: false, msg: "請先揀一隻靈寵使用潮轉符。", needsTarget: true };
    return useTideShiftCharm(state, petUid);
  }

  return { ok: false, msg: "呢件道具暫時唔用得。" };
}

/**
 * 潮轉符：永久隨機轉換靈寵元素（唔可轉成同一屬）
 * 白板按元素倍率比例重算；寫入 pet 記錄並登錄新屬性圖鑑。
 */
export function useTideShiftCharm(state, uid) {
  ensureItems(state);
  const have = Math.floor(state.items.tide_shift_charm || 0);
  if (have < 1) return { ok: false, msg: "沒有潮轉符。" };
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const oldId = pet.elementId;
  const oldEl = ELEMENTS[oldId];
  const others = Object.keys(ELEMENTS).filter((id) => id !== oldId);
  if (!others.length) return { ok: false, msg: "無可替換屬性。" };
  let newId = others[Math.floor(Math.random() * others.length)];
  let guard = 0;
  while (newId === oldId && guard < 8) {
    newId = others[Math.floor(Math.random() * others.length)];
    guard += 1;
  }
  if (newId === oldId) return { ok: false, msg: "轉屬失敗，請再試。" };
  const newEl = ELEMENTS[newId];
  if (!newEl) return { ok: false, msg: "屬性資料異常。" };

  state.items.tide_shift_charm = have - 1;
  if (oldEl && newEl) {
    pet.atk = Math.max(1, Math.round((pet.atk / (oldEl.atk || 1)) * newEl.atk));
    pet.hp = Math.max(1, Math.round((pet.hp / (oldEl.hp || 1)) * newEl.hp));
    pet.spd = Math.max(1, Math.round((pet.spd / (oldEl.spd || 1)) * newEl.spd));
  }
  pet.elementId = newId;
  pet.elementName = newEl.name;
  const spName = pet.speciesName || SPECIES[pet.speciesId]?.name || "";
  if (spName) pet.name = `${newEl.name}${spName}`;
  else if (pet.name && oldEl?.name && pet.name.startsWith(oldEl.name)) {
    pet.name = `${newEl.name}${pet.name.slice(oldEl.name.length)}`;
  }
  if (pet.genes) {
    pet.genes = { ...pet.genes, element: newId };
  }
  registerBestiary(state, pet);
  pushLog(
    state,
    `【${displayPetName(pet)}】使用潮轉符：${oldEl?.name || oldId} → ${newEl.name}（永久）。`
  );
  return {
    ok: true,
    msg: `${displayPetName(pet)} 屬性 → ${newEl.name}`,
    fromElement: oldId,
    toElement: newId,
    petUid: pet.uid,
  };
}

function emptyOfflineBank() {
  return {
    qi: 0,
    feed: 0,
    dust: 0,
    materials: {},
    sec: 0,
    siteName: null,
    capped: false,
  };
}

function normalizeOfflineBank(raw) {
  const base = emptyOfflineBank();
  if (!raw || typeof raw !== "object") return base;
  const materials = {};
  for (const id of MATERIAL_IDS) {
    const n = Math.floor(raw.materials?.[id] || 0);
    if (n > 0) materials[id] = n;
  }
  return {
    qi: Math.max(0, Math.round(raw.qi || 0)),
    feed: Math.max(0, Math.round(raw.feed || 0)),
    dust: Math.max(0, Math.round(raw.dust || 0)),
    materials,
    sec: Math.max(0, Math.floor(raw.sec || 0)),
    siteName: raw.siteName || null,
    capped: !!(raw.capped || (raw.sec || 0) >= OFFLINE_BANK_CAP_SEC),
  };
}

export function ensureOfflineBank(state) {
  state.offlineBank = normalizeOfflineBank(state.offlineBank);
  return state.offlineBank;
}

function snapshotIdleResources(state) {
  return {
    qi: state.qi || 0,
    feed: state.feed || 0,
    dust: state.dust || 0,
    materials: { ...(state.materials || emptyMaterials()) },
  };
}

function restoreIdleResources(state, snap) {
  state.qi = snap.qi;
  state.feed = snap.feed;
  state.dust = snap.dust;
  state.materials = { ...snap.materials };
}

function diffIdleResources(before, after) {
  const materials = {};
  for (const id of MATERIAL_IDS) {
    const d = Math.floor(after.materials[id] || 0) - Math.floor(before.materials[id] || 0);
    if (d > 0) materials[id] = d;
  }
  return {
    qi: Math.round((after.qi || 0) - (before.qi || 0)),
    feed: Math.round((after.feed || 0) - (before.feed || 0)),
    dust: Math.round((after.dust || 0) - (before.dust || 0)),
    materials,
  };
}

/** 將一段掛機收益併入離線庫（受 OFFLINE_BANK_CAP_SEC 限制） */
function mergeOfflineBank(state, delta, sec, siteName) {
  const bank = ensureOfflineBank(state);
  const room = Math.max(0, OFFLINE_BANK_CAP_SEC - (bank.sec || 0));
  if (room <= 0) {
    bank.capped = true;
    return bank;
  }
  const use = Math.min(Math.max(0, sec), room);
  const scale = sec > 0 ? use / sec : 0;
  bank.qi = (bank.qi || 0) + Math.max(0, Math.round((delta.qi || 0) * scale));
  bank.feed = (bank.feed || 0) + Math.max(0, Math.round((delta.feed || 0) * scale));
  bank.dust = (bank.dust || 0) + Math.max(0, Math.round((delta.dust || 0) * scale));
  if (!bank.materials) bank.materials = {};
  for (const [id, n] of Object.entries(delta.materials || {})) {
    const add = Math.max(0, Math.round((n || 0) * scale));
    if (add > 0) bank.materials[id] = (bank.materials[id] || 0) + add;
  }
  bank.sec = (bank.sec || 0) + use;
  bank.capped = bank.sec >= OFFLINE_BANK_CAP_SEC;
  if (siteName) bank.siteName = siteName;
  return bank;
}

function syncOfflineHintFromBank(state, now = Date.now()) {
  const bank = ensureOfflineBank(state);
  const has =
    (bank.qi | 0) > 0 ||
    (bank.feed | 0) > 0 ||
    (bank.dust | 0) > 0 ||
    Object.values(bank.materials || {}).some((n) => (n | 0) > 0);
  if (!has) {
    state.offlineHint = null;
    return null;
  }
  state.offlineHint = {
    sec: Math.floor(bank.sec || 0),
    qi: bank.qi || 0,
    feed: bank.feed || 0,
    dust: bank.dust || 0,
    materials: { ...(bank.materials || {}) },
    siteName: bank.siteName || null,
    capped: !!bank.capped,
    at: now,
    pending: true,
  };
  return state.offlineHint;
}

export function offlineBankView(state) {
  const bank = ensureOfflineBank(state);
  const has =
    (bank.qi | 0) > 0 ||
    (bank.feed | 0) > 0 ||
    (bank.dust | 0) > 0 ||
    Object.values(bank.materials || {}).some((n) => (n | 0) > 0);
  const sec = bank.sec || 0;
  return {
    qi: bank.qi || 0,
    feed: bank.feed || 0,
    dust: bank.dust || 0,
    materials: { ...(bank.materials || {}) },
    sec,
    siteName: bank.siteName || null,
    capped: !!bank.capped,
    hasPending: has,
    canClaim: has && sec >= OFFLINE_CLAIM_MIN_SEC,
    claimNeedSec: OFFLINE_CLAIM_MIN_SEC,
    claimLeftSec: Math.max(0, OFFLINE_CLAIM_MIN_SEC - sec),
    capSec: OFFLINE_BANK_CAP_SEC,
    remainingSec: Math.max(0, OFFLINE_BANK_CAP_SEC - sec),
  };
}

/** 領取離線庫收益入帳（需滿 OFFLINE_CLAIM_MIN_SEC） */
export function claimOfflineBank(state) {
  const view = offlineBankView(state);
  if (!view.hasPending && !(view.sec | 0)) {
    state.offlineHint = null;
    return { ok: false, msg: "沒有可領取的離線收益。" };
  }
  if ((view.sec || 0) < OFFLINE_CLAIM_MIN_SEC) {
    const left = Math.max(0, OFFLINE_CLAIM_MIN_SEC - (view.sec || 0));
    const leftMin = Math.ceil(left / 60);
    return {
      ok: false,
      msg: `離線未滿 30 分鐘（仲差約 ${leftMin} 分），暫不可領。`,
    };
  }
  if (!view.hasPending) {
    state.offlineHint = null;
    return { ok: false, msg: "沒有可領取的離線收益。" };
  }
  const bank = ensureOfflineBank(state);
  state.qi = (state.qi || 0) + (bank.qi || 0);
  state.feed = (state.feed || 0) + (bank.feed || 0);
  state.dust = (state.dust || 0) + (bank.dust || 0);
  if (!state.materials) state.materials = emptyMaterials();
  for (const [id, n] of Object.entries(bank.materials || {})) {
    if ((n | 0) > 0) state.materials[id] = (state.materials[id] || 0) + n;
  }
  const claimed = {
    qi: bank.qi || 0,
    feed: bank.feed || 0,
    dust: bank.dust || 0,
    materials: { ...(bank.materials || {}) },
    sec: bank.sec || 0,
    siteName: bank.siteName || null,
  };
  state.offlineBank = emptyOfflineBank();
  state.offlineHint = null;
  const sec = claimed.sec || 0;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  const dur = rem ? `${min} 分 ${rem} 秒` : `${Math.max(1, min)} 分鐘`;
  pushLog(state, `領取離線約 ${dur} 收益。`);
  return { ok: true, msg: `已領取約 ${dur} 離線收益`, claimed };
}

/** 頂欄契隊連結：出戰隊進度 + 突破捷徑（甲＋丙） */
export function teamBondBarView(state) {
  const br = breakthroughView(state);
  const pets = state.pets || [];
  const ranch = state.ranch || [];
  const power = partyCombatPower(pets);
  const avgLv = pets.length
    ? Math.round(pets.reduce((s, p) => s + (p.level || 1), 0) / pets.length)
    : 0;
  const starred = [...pets, ...ranch].filter((p) => p.starred).length;
  const items = br.items || [];
  const met = items.filter((i) => i.ok).length;
  const total = Math.max(1, items.length);
  const nextNeed = br.next?.need || 1;
  const qiPct = Math.min(100, ((state.qi || 0) / nextNeed) * 100);
  const gatePct = Math.round((met / total) * 100);
  const pct = br.ready ? 100 : Math.round(qiPct * 0.55 + gatePct * 0.45);
  return {
    pct: Math.max(0, Math.min(100, pct)),
    power,
    petCount: pets.length,
    petMax: activePetMaxForState(state),
    avgLv,
    starred,
    stageName: br.cur?.name || "",
    nextName: br.next?.name || "",
    ready: !!br.ready,
    items,
    br,
  };
}

function applyOnlineIdleTick(state, elapsed) {
  const ranchBonus = (state.ranch?.length || 0) * 0.02;
  const bondBonus = 1 + state.pets.length * 0.18 + ranchBonus;
  const site = spineTrainProfile(state);
  const siteMult = site.qiMult || 1;
  const rate = realmInfo(state).rate * bondBonus * siteMult;
  state.qi += rate * elapsed;
  tickRanchIdle(state, elapsed);
  return tickTrainSite(state, elapsed);
}

export function tickCultivation(state, now = Date.now()) {
  ensureDaily(state);
  ensureLoginStreak(state, now);
  ensureOfflineBank(state);
  const elapsed = Math.min(Math.max(0, now - state.lastTick) / 1000, 3600 * 8);
  const site = spineTrainProfile(state);

  if (elapsed >= OFFLINE_HINT_SEC) {
    // 離線時段：收益進庫，待「領取」才入帳；未領可繼續累積至上限
    const room = Math.max(0, OFFLINE_BANK_CAP_SEC - (state.offlineBank.sec || 0));
    const use = Math.min(elapsed, room);
    if (use > 0) {
      const snap = snapshotIdleResources(state);
      const trainGain = applyOnlineIdleTick(state, use);
      const after = snapshotIdleResources(state);
      const delta = diffIdleResources(snap, after);
      restoreIdleResources(state, snap);
      mergeOfflineBank(state, delta, use, trainGain.site?.name || site.name);
    } else {
      state.offlineBank.capped = true;
    }
    syncOfflineHintFromBank(state, now);
  } else if (elapsed > 0) {
    applyOnlineIdleTick(state, elapsed);
    // 線上短 tick 唔清庫；若仍有待領則保持提示
    if (offlineBankView(state).hasPending) syncOfflineHintFromBank(state, now);
  }

  // 每日：掛機累積（離線／線上皆計）
  if (elapsed > 0) {
    state.daily.idleSec = (state.daily.idleSec || 0) + elapsed;
    if (state.daily.idleSec >= 180) {
      bumpDaily(state, "idle", 1);
    }
    if (
      state.tutorial &&
      !state.tutorial.done &&
      state.tutorial.step === "cultivate_qi" &&
      (state.daily.idleSec || 0) >= TUTORIAL_QI_IDLE_SEC
    ) {
      state.tutorial.flags = state.tutorial.flags || {};
      state.tutorial.flags.qiIdleDone = true;
      advanceTutorialIfReady(state);
    }
  }

  state.lastTick = now;
  checkAchievements(state);
  return state;
}

/** 僅關閉提示條；唔清離線庫（未領取繼續累積） */
export function clearOfflineHint(state) {
  state.offlineHint = null;
  return state;
}

/** 序列化掛機戰鬥（跨面板／重新整理還原牆鐘 startedAt） */
export function persistTrainIdleCombatState(state, wrap) {
  if (!wrap?.session) {
    state.trainIdleCombat = null;
    return null;
  }
  state.trainIdleCombat = {
    zoneId: wrap.zoneId,
    tierIndex: wrap.tierIndex,
    petSig: wrap.petSig,
    formationId: wrap.formationId,
    clearReady: !!wrap.clearReady,
    canUnlockNext: !!wrap.canUnlockNext,
    resultLine: wrap.resultLine || null,
    logLine: wrap.logLine || null,
    session: wrap.session,
  };
  return state.trainIdleCombat;
}

export function clearTrainIdleCombatState(state) {
  state.trainIdleCombat = null;
  return state;
}

export function restoreTrainIdleCombatState(state) {
  const saved = state.trainIdleCombat;
  if (!saved?.session || typeof saved.session.startedAt !== "number") return null;
  return {
    zoneId: saved.zoneId,
    tierIndex: saved.tierIndex,
    petSig: saved.petSig,
    formationId: saved.formationId,
    clearReady: !!saved.clearReady,
    canUnlockNext: !!saved.canUnlockNext,
    resultLine: saved.resultLine || null,
    logLine: saved.logLine || null,
    session: saved.session,
  };
}

function ensureDaily(dailyOrState, now = Date.now()) {
  // overload: ensureDaily(state) mutates state.daily; ensureDaily(parsed.daily) returns normalized
  if (dailyOrState && dailyOrState.pets !== undefined) {
    const state = dailyOrState;
    const key = todayKey(now);
    if (!state.daily || state.daily.date !== key) {
      state.daily = emptyDaily(now);
    }
    if (!state.daily.progress) {
      state.daily.progress = {
        idle: 0,
        dungeon: 0,
        bond: 0,
        breed: 0,
        win: 0,
        dispatch: 0,
        fuse: 0,
        train_tier: 0,
        train_warden: 0,
      };
    }
    if (!state.daily.claimed) state.daily.claimed = {};
    if (state.daily.hubDismissed == null) state.daily.hubDismissed = false;
    if (state.daily.allClearClaimed == null) state.daily.allClearClaimed = false;
    return state.daily;
  }
  const daily = dailyOrState;
  const key = todayKey(now);
  if (!daily || daily.date !== key) return emptyDaily(now);
  return {
    date: daily.date,
    progress: {
      idle: 0,
      dungeon: 0,
      bond: 0,
      breed: 0,
      win: 0,
      dispatch: 0,
      fuse: 0,
      ...(daily.progress || {}),
    },
    claimed: { ...(daily.claimed || {}) },
    allClearClaimed: !!daily.allClearClaimed,
    idleSec: daily.idleSec || 0,
  };
}

function bumpDaily(state, questId, amount = 1) {
  ensureDaily(state);
  const q = DAILY_QUESTS.find((x) => x.id === questId);
  if (!q) return;
  const cur = state.daily.progress[questId] || 0;
  if (cur >= q.need) return;
  state.daily.progress[questId] = Math.min(q.need, cur + amount);
}

function applyReward(state, reward) {
  if (!reward) return;
  if (reward.stones) state.stones += reward.stones;
  if (reward.scrap) state.scrap += reward.scrap;
  if (reward.feed) state.feed = (state.feed || 0) + reward.feed;
  if (reward.dust) state.dust = (state.dust || 0) + reward.dust;
  if (reward.materials) addMaterials(state, reward.materials);
}

/** 按倍率縮放獎勵（派遣高代加成等）；整數向上取整保底 */
function scaleReward(reward, mult) {
  if (!reward || !mult || mult === 1) return reward;
  const out = { ...reward };
  for (const k of ["stones", "scrap", "feed", "dust"]) {
    if (out[k]) out[k] = Math.max(1, Math.round(out[k] * mult));
  }
  if (out.materials) {
    out.materials = { ...out.materials };
    for (const [id, n] of Object.entries(out.materials)) {
      if (n) out.materials[id] = Math.max(1, Math.round(n * mult));
    }
  }
  return out;
}

export function claimDaily(state, questId) {
  ensureDaily(state);
  const q = DAILY_QUESTS.find((x) => x.id === questId);
  if (!q) return { ok: false, msg: "任務不存在。" };
  if (state.daily.claimed[questId]) return { ok: false, msg: "今日已領取。" };
  const prog = state.daily.progress[questId] || 0;
  if (prog < q.need) return { ok: false, msg: "尚未完成。" };
  state.daily.claimed[questId] = true;
  applyReward(state, q.reward);
  const bits = [];
  if (q.reward.stones) bits.push(`${q.reward.stones} 石`);
  if (q.reward.feed) bits.push(`${q.reward.feed} 飼料`);
  if (q.reward.dust) bits.push(`${q.reward.dust} 靈塵`);
  if (q.reward.scrap) bits.push(`${q.reward.scrap} 碎片`);
  pushLog(state, `每日任務【${q.name}】領獎：${bits.join("／")}。`);
  checkAchievements(state);
  return { ok: true, msg: `領取 ${bits.join("／")}` };
}

export function dailyAllClearView(state) {
  ensureDaily(state);
  const dailies = dailyView(state);
  const claimed = dailies.filter((q) => q.claimed).length;
  const claimable = dailies.filter((q) => q.done && !q.claimed).length;
  const allClaimed = dailies.length > 0 && dailies.every((q) => q.claimed);
  return {
    total: dailies.length,
    claimed,
    done: dailies.filter((q) => q.done).length,
    claimable,
    allClaimed,
    allClearClaimed: !!state.daily.allClearClaimed,
    canClaimAllClear: allClaimed && !state.daily.allClearClaimed,
  };
}

export function claimAllDailies(state) {
  ensureDaily(state);
  const claimable = dailyView(state).filter((q) => q.done && !q.claimed);
  if (!claimable.length) return { ok: false, msg: "沒有可領取的每日任務。" };
  let n = 0;
  const msgs = [];
  for (const q of claimable) {
    const r = claimDaily(state, q.id);
    if (r.ok) {
      n += 1;
      msgs.push(r.msg);
    }
  }
  return { ok: n > 0, msg: `一鍵領取 ${n} 項每日任務`, claimed: n };
}

export function claimDailyAllClear(state) {
  const view = dailyAllClearView(state);
  if (!view.allClaimed) return { ok: false, msg: "需先領完今日全部每日任務。" };
  if (view.allClearClaimed) return { ok: false, msg: "今日全清獎已領取。" };
  state.daily.allClearClaimed = true;
  applyReward(state, DAILY_ALL_CLEAR_BONUS);
  if (!state.eggs) state.eggs = [];
  const eggAdded = state.eggs.length < EGG_CAP;
  if (eggAdded) {
    state.eggs.push(makeEgg("C", "daily_all_clear"));
  }
  const bits = [];
  if (DAILY_ALL_CLEAR_BONUS.stones) bits.push(`${DAILY_ALL_CLEAR_BONUS.stones}石`);
  if (DAILY_ALL_CLEAR_BONUS.materials?.breed_ticket) {
    bits.push(`催生符×${DAILY_ALL_CLEAR_BONUS.materials.breed_ticket}`);
  }
  if (eggAdded) bits.push("潮霧蛋×1");
  pushLog(state, `每日全清獎：${bits.join("／")}。`);
  checkAchievements(state);
  return { ok: true, msg: `全清獎：${bits.join("／")}` };
}

export function registerBestiary(state, pet) {
  const key = bestiaryKeyFromPet(pet);
  if (!key) return false;
  if (!state.bestiary) state.bestiary = {};
  if (state.bestiary[key]) return false;
  state.bestiary[key] = true;
  const blood = pet.bloodlineName && pet.bloodlineName !== "無紋" ? `·${pet.bloodlineName}` : "";
  pushLog(
    state,
    `圖鑑登錄：${pet.elementName || ""}${pet.speciesName || pet.name}${blood}。`
  );
  checkAchievements(state);
  return true;
}

export function bestiaryStatus(state) {
  const discovered = Object.keys(state.bestiary || {}).length;
  return bestiaryCombatBonus(discovered);
}

export function checkAchievements(state) {
  if (!state.achievements) state.achievements = {};
  if (!state.stats) {
    state.stats = {
      bonds: 0,
      fusions: 0,
      breeds: 0,
      releases: 0,
      bondAttempts: 0,
      hybrids: 0,
      legendBreeds: 0,
      challengeWins: 0,
      maxWinStreak: 0,
      speciesBreeds: {},
    };
  }
  const unlocked = [];
  const dexN = Object.keys(state.bestiary || {}).length;
  const cleared = state.clearedDungeons || {};
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    let ok = false;
    if (a.id === "first_win") ok = (state.combatsWon || 0) >= 1;
    else if (a.id === "bonds_3") ok = (state.stats.bonds || 0) >= 3;
    else if (a.id === "bestiary_10") ok = dexN >= 10;
    else if (a.id === "bestiary_30") ok = dexN >= 30;
    else if (a.id === "bestiary_full") ok = dexN >= bestiaryTotal();
    else if (a.id === "fuse_once") ok = (state.stats.fusions || 0) >= 1;
    else if (a.id === "breed_once") ok = (state.stats.breeds || 0) >= 1;
    else if (a.id === "stage_2") ok = (state.realm || 0) >= 2;
    else if (a.id === "stage_5") ok = (state.realm || 0) >= 5;
    else if (a.id === "stage_8") ok = (state.realm || 0) >= 8;
    else if (a.id === "hybrid_once") ok = (state.stats.hybrids || 0) >= 1;
    else if (a.id === "legend_breed") ok = (state.stats.legendBreeds || 0) >= 1;
    else if (a.id === "clear_tide_4") ok = !!cleared.tide_4;
    else if (a.id === "clear_tide_8") ok = !!cleared.tide_8;
    else if (a.id === "wins_25") ok = (state.combatsWon || 0) >= 25;
    else if (a.id === "wins_50") ok = (state.combatsWon || 0) >= 50;
    else if (a.id === "hybrids_3") ok = (state.stats.hybrids || 0) >= 3;
    else if (a.id === "challenge_win") ok = (state.stats.challengeWins || 0) >= 1;
    else if (a.id === "streak_5") ok = (state.stats.maxWinStreak || 0) >= 5;
    else if (a.id === "fangmite_once") ok = (state.stats.speciesBreeds?.fangmite || 0) >= 1;
    else if (a.id === "tide_seal_1") ok = (state.tideSeals || 0) >= 1;
    else if (a.id === "dispatch_once") ok = (state.stats.dispatches || 0) >= 1;
    else if (a.id === "dispatch_5") ok = (state.stats.dispatches || 0) >= 5;
    else if (a.id === "gen3_born") ok = (state.stats.gen3Breeds || 0) >= 1;
    else if (a.id === "glintfox_once") ok = (state.stats.speciesBreeds?.glintfox || 0) >= 1;
    if (!ok) continue;
    state.achievements[a.id] = true;
    applyReward(state, a.reward);
    unlocked.push(a);
    const bits = [];
    if (a.reward.stones) bits.push(`${a.reward.stones}石`);
    if (a.reward.feed) bits.push(`${a.reward.feed}飼料`);
    if (a.reward.dust) bits.push(`${a.reward.dust}靈塵`);
    if (a.reward.scrap) bits.push(`${a.reward.scrap}碎片`);
    pushLog(state, `成就【${a.name}】達成！獎勵 ${bits.join("／")}。`);
  }
  return unlocked;
}

export function achievementsView(state) {
  checkAchievements(state);
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    done: !!(state.achievements || {})[a.id],
  }));
}

export function dailyView(state) {
  ensureDaily(state);
  const fuseOn = isFusionUnlocked(state);
  return DAILY_QUESTS.filter((q) => q.id !== "fuse" || fuseOn).map((q) => {
    const prog = state.daily.progress[q.id] || 0;
    return {
      ...q,
      progress: prog,
      done: prog >= q.need,
      claimed: !!state.daily.claimed[q.id],
    };
  });
}

function ensureBreedGoalsState(rawOrState, now = Date.now()) {
  if (rawOrState && rawOrState.pets !== undefined) {
    const state = rawOrState;
    const key = todayKey(now);
    const week = weekKey(now);
    if (!state.breedGoals) state.breedGoals = emptyBreedGoals(now);
    if (state.breedGoals.date !== key || state.breedGoals.week !== week) {
      const claimed = { ...(state.breedGoals.claimed || {}) };
      const progress = { ...(state.breedGoals.progress || {}) };
      for (const g of BREED_GOALS) {
        if (g.cadence === "daily" && state.breedGoals.date !== key) {
          delete claimed[g.id];
          delete progress[g.id];
        }
        if (g.cadence === "weekly" && state.breedGoals.week !== week) {
          delete claimed[g.id];
          delete progress[g.id];
        }
      }
      state.breedGoals = { date: key, week, progress, claimed };
    }
    if (!state.breedGoals.progress) state.breedGoals.progress = {};
    if (!state.breedGoals.claimed) state.breedGoals.claimed = {};
    if (!state.breedGoals.week) state.breedGoals.week = week;
    return state.breedGoals;
  }
  const raw = rawOrState;
  const key = todayKey(now);
  const week = weekKey(now);
  if (!raw) return emptyBreedGoals(now);
  if (raw.date !== key || raw.week !== week) {
    const claimed = { ...(raw.claimed || {}) };
    const progress = { ...(raw.progress || {}) };
    for (const g of BREED_GOALS) {
      if (g.cadence === "daily" && raw.date !== key) {
        delete claimed[g.id];
        delete progress[g.id];
      }
      if (g.cadence === "weekly" && raw.week !== week) {
        delete claimed[g.id];
        delete progress[g.id];
      }
    }
    return { date: key, week, progress, claimed };
  }
  return {
    date: raw.date,
    week: raw.week || week,
    progress: { ...(raw.progress || {}) },
    claimed: { ...(raw.claimed || {}) },
  };
}

function bumpBreedGoalProgress(state, goalId, amount = 1) {
  ensureBreedGoalsState(state);
  const g = BREED_GOALS.find((x) => x.id === goalId);
  if (!g) return;
  if (state.breedGoals.claimed[goalId]) return;
  const cur = state.breedGoals.progress[goalId] || 0;
  if (cur >= g.need) return;
  state.breedGoals.progress[goalId] = Math.min(g.need, cur + amount);
}

/** 繁殖結果推進目標 */
export function progressBreedGoalsFromChild(state, child, genes) {
  ensureBreedGoalsState(state);
  bumpBreedGoalProgress(state, "daily_breed", 1);
  if (genes?.hybrid) {
    bumpBreedGoalProgress(state, "weekly_hybrid", 1);
    for (const g of BREED_GOALS) {
      if (g.type === "hybrid_species" && g.species === child.speciesId) {
        bumpBreedGoalProgress(state, g.id, 1);
      }
    }
  }
  const gen = child.generation ?? genes?.generation ?? 0;
  for (const g of BREED_GOALS) {
    if (g.type === "reach_gen" && gen >= g.gen) bumpBreedGoalProgress(state, g.id, 1);
    if (g.type === "reach_rarity" && (child.rarity ?? 0) >= g.rarity) {
      bumpBreedGoalProgress(state, g.id, 1);
    }
  }
  const hybridDex = countHybridBestiary(state.bestiary);
  for (const g of BREED_GOALS) {
    if (g.type === "hybrid_bestiary") {
      const cur = state.breedGoals.progress[g.id] || 0;
      if (!state.breedGoals.claimed[g.id] && hybridDex > cur) {
        state.breedGoals.progress[g.id] = Math.min(g.need, hybridDex);
      }
    }
  }
}

/** 秘境勝利推進週課 */
export function progressDungeonWinGoals(state) {
  ensureBreedGoalsState(state);
  for (const g of BREED_GOALS) {
    if (g.type === "dungeon_wins") bumpBreedGoalProgress(state, g.id, 1);
  }
}

export function claimBreedGoal(state, goalId) {
  ensureBreedGoalsState(state);
  const g = BREED_GOALS.find((x) => x.id === goalId);
  if (!g) return { ok: false, msg: "目標不存在。" };
  if (state.breedGoals.claimed[goalId]) return { ok: false, msg: "已領取。" };
  const prog = state.breedGoals.progress[goalId] || 0;
  if (prog < g.need) return { ok: false, msg: "尚未完成。" };
  state.breedGoals.claimed[goalId] = true;
  applyReward(state, g.reward);
  const bits = [];
  if (g.reward.stones) bits.push(`${g.reward.stones} 石`);
  if (g.reward.feed) bits.push(`${g.reward.feed} 飼料`);
  if (g.reward.dust) bits.push(`${g.reward.dust} 靈塵`);
  if (g.reward.scrap) bits.push(`${g.reward.scrap} 碎片`);
  pushLog(state, `繁殖目標【${g.name}】領獎：${bits.join("／")}。`);
  return { ok: true, msg: `領取 ${bits.join("／")}` };
}

export function breedGoalsView(state) {
  ensureBreedGoalsState(state);
  // 同步圖鑑類目標
  const hybridDex = countHybridBestiary(state.bestiary);
  for (const g of BREED_GOALS) {
    if (g.type === "hybrid_bestiary" && !state.breedGoals.claimed[g.id]) {
      state.breedGoals.progress[g.id] = Math.min(g.need, hybridDex);
    }
  }
  return BREED_GOALS.map((g) => {
    const prog = state.breedGoals.progress[g.id] || 0;
    return {
      ...g,
      progress: prog,
      done: prog >= g.need,
      claimed: !!state.breedGoals.claimed[g.id],
      speciesName: g.species ? SPECIES[g.species]?.name : null,
    };
  });
}

function resolveInvGear(state, itemUid) {
  if (!itemUid || !state.inventory) return null;
  const item = state.inventory.find((x) => x.uid === itemUid);
  if (!item) return null;
  const def = GEAR[item.gearId];
  if (!def) return null;
  return { item, def };
}

/** 人物裝備加成（含鍛造強化＋套裝） */
export function masterGearBonus(state) {
  const eq = state.master?.equip || {};
  let atk = 0;
  let hp = 0;
  let spd = 0;
  const gearIds = [];
  for (const slot of MASTER_EQUIP_SLOTS) {
    const r = resolveInvGear(state, eq[slot]);
    if (!r) continue;
    gearIds.push(r.def.id);
    atk += (r.def.atk || 0) + (r.item.forgeAtk || 0);
    hp += (r.def.hp || 0) + (r.item.forgeHp || 0);
    spd += r.def.spd || 0;
  }
  const setBonus = gearSetBonus(gearIds);
  atk += setBonus.atk;
  hp += setBonus.hp;
  spd += setBonus.spd;
  return { atk, hp, spd, setLabels: setBonus.labels };
}

export function tryBreakthrough(state) {
  const view = breakthroughView(state);
  if (!view.ready) {
    const miss = view.items.filter((i) => !i.ok).slice(0, 3).map((i) => i.label);
    return { ok: false, msg: `突破條件未齊：${miss.join("；")}` };
  }
  const next = view.next;
  const costs = view.costs || {};
  state.qi -= next.need;
  if (costs.stones) state.stones -= costs.stones;
  if (costs.scrap) state.scrap -= costs.scrap;
  if (costs.dust) state.dust = (state.dust || 0) - costs.dust;
  if (costs.feed) state.feed = (state.feed || 0) - costs.feed;
  if (costs.seal_ember) {
    if (!state.materials) state.materials = emptyMaterials();
    state.materials.seal_ember = (state.materials.seal_ember || 0) - costs.seal_ember;
  }

  state.realm = next.id;
  state.master.atk += 1 + Math.floor(next.id / 2);
  state.master.hp += 4 + next.id * 2;
  state.master.spd += next.id >= 3 ? 2 : 1;
  state.master.skillIds = masterSkillsForStage(state.realm);
  const costNote = view.costLabel ? `（耗 ${view.costLabel}）` : "";
  pushLog(state, `階段突破——晉升【${next.name}】${costNote}。御靈之力加深。`);
  pushLog(state, `牧場容量擴展至 ${ranchCap(state)}。`);
  const tokenGain = 3 + Math.floor(next.id * 1.5);
  addMaterials(state, { [DUNGEON_ENTRY_MAT_ID]: tokenGain });
  pushLog(state, `升階賜潮霧令×${tokenGain}（秘境入場憑證）。`);
  bumpDaily(state, "idle", 1);
  const unlocked = MASTER_UNLOCK_MSG(state.realm);
  if (unlocked) pushLog(state, unlocked);
  if (Math.random() < 0.55) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    pushLog(state, `靈兆：${ev}`);
    state.stones += 15 + state.realm * 8;
  }
  checkAchievements(state);
  advanceTutorialIfReady(state);
  const late = maybeStartLateTutorial(state);
  return {
    ok: true,
    msg: `階段：${next.name}${costNote}${late.started ? ` · ${late.msg}` : ""}`,
    lateTutorial: late,
  };
}

function MASTER_UNLOCK_MSG(stage) {
  if (stage === 1) return "學會人物技能【潮霧庇護】。";
  if (stage === 3) return "學會人物技能【暗潮令旗】。";
  return null;
}

/* ─── P6：每日修飾／商肆／戰術 ─── */

export function ensureDungeonDaily(state, now = Date.now()) {
  const key = todayKey(now);
  if (!state.dungeonDaily || state.dungeonDaily.date !== key) {
    const mod = pickDailyDungeonMod(key);
    state.dungeonDaily = { date: key, modId: mod?.id || null, mod };
  } else if (state.dungeonDaily.modId && !state.dungeonDaily.mod) {
    state.dungeonDaily.mod =
      pickDailyDungeonMod(state.dungeonDaily.date) ||
      null;
  }
  return state.dungeonDaily;
}

export function dungeonDailyView(state) {
  const d = ensureDungeonDaily(state);
  return d?.mod || null;
}

function rollShopEggOffer(tier, seedSalt = 0) {
  const t = eggTierInfo(tier);
  return {
    offerId: `shop-egg-${t.id}-${Date.now()}-${seedSalt}-${Math.floor(Math.random() * 999)}`,
    kind: "egg",
    eggTier: t.id,
    name: t.name,
    cost: t.shopCost,
    label: t.label,
    desc: t.desc,
  };
}

function rollShopOffer(seedSalt = 0) {
  // ~40% 蛋、其餘靈寵；預留 kind:mat / kind:trade 之後再做
  if (Math.random() < 0.4) {
    const roll = Math.random();
    const tier = roll < 0.55 ? "C" : roll < 0.9 ? "B" : "A";
    return rollShopEggOffer(tier, seedSalt);
  }
  const pool = RECRUIT_POOL;
  if (!pool.length) return rollShopEggOffer("C", seedSalt);
  let total = 0;
  for (const p of pool) total += p.weight || 1;
  let r = Math.random() * total;
  let pick = pool[0];
  for (const p of pool) {
    r -= p.weight || 1;
    if (r <= 0) {
      pick = p;
      break;
    }
  }
  const peKeys = Object.keys({ fierce: 1, steady: 1, sly: 1, gentle: 1, wild: 1 });
  const personality = pick.personality || peKeys[Math.floor(Math.random() * peKeys.length)];
  return {
    offerId: `shop-${Date.now()}-${seedSalt}-${Math.floor(Math.random() * 999)}`,
    kind: "pet",
    species: pick.species,
    element: pick.element,
    personality,
    cost: pick.cost || 60,
    name: SPECIES[pick.species]?.name || pick.species,
    petKind: SPECIES[pick.species]?.kind || "?",
    elementName: { tide: "潮", stone: "岩", flame: "焰", gale: "嵐", gloom: "幽" }[pick.element] || pick.element,
  };
}

export function ensureShop(state, now = Date.now()) {
  const key = todayKey(now);
  if (!state.shop) state.shop = emptyShop(now);
  if (state.shop.date !== key || !Array.isArray(state.shop.offers) || state.shop.offers.length === 0) {
    const offers = [];
    // 每日至少一顆蛋
    offers.push(rollShopEggOffer(Math.random() < 0.7 ? "C" : "B", 0));
    for (let i = 1; i < SHOP_OFFER_COUNT; i++) {
      const o = rollShopOffer(i);
      if (o) offers.push(o);
    }
    state.shop = { date: key, offers };
  }
  // 教學：確保有未售蛋可買
  if (
    state.tutorial &&
    !state.tutorial.done &&
    state.tutorial.step === "shop_egg" &&
    !state.tutorial.flags?.shopBought
  ) {
    const hasEgg = state.shop.offers.some((o) => o.kind === "egg" && !o.bought);
    if (!hasEgg) {
      state.shop.offers.unshift(rollShopEggOffer("C", 99));
    }
  }
  return state.shop;
}

export function shopView(state) {
  ensureShop(state);
  const tutDeal =
    state.tutorial &&
    !state.tutorial.done &&
    state.tutorial.step === "shop_egg" &&
    !state.tutorial.flags?.shopBought;
  return state.shop.offers.map((o) => {
    const isEgg = o.kind === "egg";
    return {
      ...o,
      kind: o.kind || "pet",
      speciesName: isEgg ? o.name : SPECIES[o.species]?.name || o.name,
      bought: !!o.bought,
      cost: tutorialShopPrice(state, o.cost),
      tutorialDeal: tutDeal && isEgg && !o.bought,
    };
  });
}

/** 精魂商人目錄（固定佔位貨） */
export function soulShopView(state) {
  if (!state.materials) state.materials = emptyMaterials();
  const soul = Math.floor(state.materials.soul_essence || 0);
  const bonus = state.itemBonus || emptyItemBonus();
  return SOUL_SHOP_OFFERS.map((o) => {
    const grantBits = [];
    if (o.grant?.feed) grantBits.push(`飼料×${o.grant.feed}`);
    if (o.grant?.materials) {
      for (const [id, n] of Object.entries(o.grant.materials)) {
        if (!n) continue;
        grantBits.push(`${MATERIALS[id]?.name || id}×${n}`);
      }
    }
    if (o.grant?.items) {
      for (const [id, n] of Object.entries(o.grant.items)) {
        if (!n) continue;
        grantBits.push(`${ITEMS[id]?.name || id}×${n}`);
      }
    }
    let capped = false;
    let capReason = "";
    if (o.grant?.items?.ranch_fence && (bonus.ranchCap | 0) >= RANCH_CAP_BONUS_MAX) {
      capped = true;
      capReason = `牧場加成已達上限（+${RANCH_CAP_BONUS_MAX}）`;
    } else if (o.grant?.items?.hatch_nest_token && (bonus.hatchSlots | 0) >= HATCH_SLOT_BONUS_MAX) {
      capped = true;
      capReason = `孵化欄加成已達上限（+${HATCH_SLOT_BONUS_MAX}）`;
    }
    const canAfford = soul >= o.cost;
    return {
      ...o,
      grantLabel: grantBits.join("／") || "—",
      canAfford,
      capped,
      capReason,
      canBuy: canAfford && !capped,
      soul,
    };
  });
}

/** 精魂商人購入（afford 精魂後發放飼料／材料／道具） */
export function buySoulShopOffer(state, offerId) {
  const offer = soulShopOfferById(offerId);
  if (!offer) return { ok: false, msg: "商品不存在。" };
  if (!state.materials) state.materials = emptyMaterials();
  const bonus = state.itemBonus || emptyItemBonus();
  if (offer.grant?.items?.ranch_fence && (bonus.ranchCap | 0) >= RANCH_CAP_BONUS_MAX) {
    return { ok: false, msg: `牧場加成已達上限（+${RANCH_CAP_BONUS_MAX}），無需再換欄柵。` };
  }
  if (offer.grant?.items?.hatch_nest_token && (bonus.hatchSlots | 0) >= HATCH_SLOT_BONUS_MAX) {
    return { ok: false, msg: `孵化欄加成已達上限（+${HATCH_SLOT_BONUS_MAX}），無需再換暖巢箋。` };
  }
  const have = Math.floor(state.materials.soul_essence || 0);
  if (have < offer.cost) {
    return { ok: false, msg: `精魂不足（需 ${offer.cost}，現有 ${have}）。` };
  }
  state.materials.soul_essence = have - offer.cost;
  const granted = [];
  if (offer.grant?.feed) {
    state.feed = (state.feed || 0) + offer.grant.feed;
    granted.push(`飼料×${offer.grant.feed}`);
  }
  if (offer.grant?.materials) {
    addMaterials(state, offer.grant.materials);
    for (const [id, n] of Object.entries(offer.grant.materials)) {
      if (!n) continue;
      granted.push(`${MATERIALS[id]?.name || id}×${n}`);
    }
  }
  if (offer.grant?.items) {
    if (!state.items) state.items = emptyItems();
    for (const [id, n] of Object.entries(offer.grant.items)) {
      if (!n) continue;
      state.items[id] = (state.items[id] || 0) + n;
      granted.push(`${ITEMS[id]?.name || id}×${n}`);
    }
  }
  const grantTxt = granted.join("／") || "貨物";
  pushLog(state, `精魂商人購入【${offer.name}】，耗精魂 ${offer.cost}，獲 ${grantTxt}。`);
  return {
    ok: true,
    msg: `購入 ${offer.name}（耗精魂 ${offer.cost}）· ${grantTxt}`,
    offerId: offer.id,
    cost: offer.cost,
    grant: offer.grant,
  };
}

export function buyShopOffer(state, offerId) {
  ensureShop(state);
  const offer = state.shop.offers.find((o) => o.offerId === offerId);
  if (!offer) return { ok: false, msg: "商品不存在。" };
  if (offer.bought) return { ok: false, msg: "已售出。" };
  const payCost = tutorialShopPrice(state, offer.cost);
  if (state.stones < payCost) return { ok: false, msg: `靈石不足（需 ${payCost}）。` };

  if (offer.kind === "egg") {
    if (!state.eggs) state.eggs = [];
    if (state.eggs.length >= EGG_CAP) return { ok: false, msg: `蛋欄已滿（最多 ${EGG_CAP}）。` };
    state.stones -= payCost;
    offer.bought = true;
    const egg = makeEgg(
      offer.eggTier || "C",
      state.tutorial && !state.tutorial.done && state.tutorial.step === "shop_egg"
        ? "tutorial_shop"
        : "shop"
    );
    state.eggs.push(egg);
    if (state.tutorial && !state.tutorial.done) {
      state.tutorial.flags.shopBought = true;
    }
    pushLog(state, `商肆購入【${egg.name}】，耗 ${payCost} 靈石。可開始孵化。`);
    advanceTutorialCascade(state);
    return { ok: true, msg: `購入 ${egg.name}（請開始孵化）`, egg };
  }

  if (!state.ranch) state.ranch = [];
  const owned = state.pets.length + state.ranch.length;
  const cap = ranchCap(state);
  if (owned >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}）。可先放歸或升階擴容。` };
  }

  const template = {
    id: `shop-${offer.species}-${offer.element}`,
    species: offer.species,
    element: offer.element,
    personality: offer.personality,
    cost: Math.max(20, Math.floor(offer.cost * 0.35)),
  };
  const built = buildPetStats(template);
  const pet = normalizePet({
    ...built,
    uid: `shop-${offer.offerId}`,
    fromShop: true,
  });
  state.stones -= payCost;
  offer.bought = true;
  state.ranch.push(pet);
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.bonds += 1;
  if (state.tutorial && !state.tutorial.done) {
    state.tutorial.flags.shopBought = true;
  }
  registerBestiary(state, pet);
  pushLog(
    state,
    `商肆購入【${pet.name}】（${pet.kind}·${pet.elementName}）直入牧場，耗 ${payCost} 靈石。`
  );
  checkAchievements(state);
  advanceTutorialCascade(state);
  return { ok: true, msg: `購入 ${pet.name}（已入牧場，可派出戰）` };
}

export function setTactics(state, tacticId) {
  if (!TACTIC_IDS.includes(tacticId)) {
    return { ok: false, msg: "未知戰術。" };
  }
  state.tactics = tacticId;
  const t = TACTICS[tacticId];
  return { ok: true, msg: `戰術：${t.name}` };
}

export function tacticsView(state) {
  const cur = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  return TACTIC_IDS.map((id) => ({
    ...TACTICS[id],
    selected: id === cur,
  }));
}

export function setFormation(state, formationId) {
  if (!FORMATION_IDS.includes(formationId)) {
    return { ok: false, msg: "未知陣型。" };
  }
  state.formation = formationId;
  const f = FORMATIONS[formationId];
  return { ok: true, msg: `陣型：${f.name}` };
}

export function formationView(state) {
  const cur = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  return FORMATION_IDS.map((id) => ({
    ...FORMATIONS[id],
    selected: id === cur,
  }));
}

/** 派遣中（未領獎）的寵物 uid */
export function dispatchBusyUids(state) {
  const set = new Set();
  for (const d of state.dispatches || []) {
    if (d.claimed) continue;
    for (const uid of d.petUids || []) set.add(uid);
  }
  return set;
}

/** 任務限制文案（屬性／種類） */
export function dispatchMissionReqLabel(mission) {
  if (!mission) return "";
  const bits = [];
  if (mission.needElement) {
    bits.push(`${ELEMENTS[mission.needElement]?.name || mission.needElement}屬`);
  }
  if (mission.needKind) bits.push(`${mission.needKind}類`);
  return bits.length ? `需${bits.join("・")}` : "";
}

/** 寵物是否符合派遣任務限制 */
export function petMatchesDispatchMission(pet, mission) {
  if (!pet || !mission) return false;
  if (mission.needElement && pet.elementId !== mission.needElement) return false;
  if (mission.needKind && pet.kind !== mission.needKind) return false;
  return true;
}

function dispatchMissionUnlocked(state, mission) {
  if (!mission) return false;
  if (!dispatchNeedStageMet(state, mission)) return false;
  return true;
}

/** 進行中（未領）任務 id 集合 */
function dispatchActiveMissionIds(state) {
  const set = new Set();
  for (const d of state.dispatches || []) {
    if (d.claimed) continue;
    if (d.missionId) set.add(d.missionId);
  }
  return set;
}

/**
 * 從「已解鎖但未上板、且非進行中」池隨機抽一則任務。
 * @returns {string | null} missionId
 */
export function pickDispatchBoardCandidate(state, rng = Math.random) {
  ensureDispatchBoardShape(state);
  const listed = new Set(state.dispatchBoard);
  const active = dispatchActiveMissionIds(state);
  const pool = DISPATCH_MISSIONS.filter(
    (m) => dispatchMissionUnlocked(state, m) && !listed.has(m.id) && !active.has(m.id)
  );
  if (!pool.length) return null;
  const idx = Math.floor(rng() * pool.length);
  return pool[Math.max(0, Math.min(pool.length - 1, idx))].id;
}

function ensureDispatchBoardShape(state) {
  if (!Array.isArray(state.dispatchBoard)) state.dispatchBoard = [];
  if (!state.dispatches) state.dispatches = [];
}

/**
 * 補滿固定派遣槽：額度 DISPATCH_BOARD_SIZE。
 * 進行中／待收集任務仍佔槽；只清無效 id，唔會踢走探險中任務。
 */
export function ensureDispatchBoard(state, rng = Math.random) {
  ensureDispatchBoardShape(state);
  const active = dispatchActiveMissionIds(state);
  state.dispatchBoard = state.dispatchBoard.filter((id) => {
    const m = DISPATCH_MISSIONS.find((x) => x.id === id);
    if (!m) return false;
    if (active.has(id)) return true;
    return dispatchMissionUnlocked(state, m);
  });
  const seen = new Set();
  state.dispatchBoard = state.dispatchBoard.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  while (state.dispatchBoard.length < DISPATCH_BOARD_SIZE) {
    const next = pickDispatchBoardCandidate(state, rng);
    if (!next) break;
    state.dispatchBoard.push(next);
  }
  return state.dispatchBoard;
}

/**
 * 每日刷新：換日後只重抽「可接」槽；探險中／待收集槽保留。
 */
export function ensureDispatchBoardDaily(state, now = Date.now(), rng = Math.random) {
  ensureDispatchBoardShape(state);
  const key = todayKey(now);
  if (state.dispatchBoardDate === key) {
    ensureDispatchBoard(state, rng);
    return state.dispatchBoard;
  }
  const active = dispatchActiveMissionIds(state);
  // 換日：保留進行中／待收集槽，其餘清走再補
  state.dispatchBoard = (state.dispatchBoard || []).filter((id) => active.has(id));
  state.dispatchBoardDate = key;
  ensureDispatchBoard(state, rng);
  return state.dispatchBoard;
}

/** 收集後：喺指定槽位補一則新任務 */
export function refillDispatchBoardAfterClaim(state, slotIndex = -1, rng = Math.random) {
  ensureDispatchBoardShape(state);
  const next = pickDispatchBoardCandidate(state, rng);
  if (!next) {
    ensureDispatchBoard(state, rng);
    return null;
  }
  if (slotIndex >= 0 && slotIndex <= state.dispatchBoard.length) {
    state.dispatchBoard.splice(slotIndex, 0, next);
  } else {
    state.dispatchBoard.push(next);
  }
  return next;
}

function formatDispatchActive(state, d, now = Date.now()) {
  const mission = DISPATCH_MISSIONS.find((m) => m.id === d.missionId);
  const left = Math.max(0, (d.readyAt || 0) - now);
  return {
    ...d,
    missionName: mission?.name || d.missionId,
    reward: mission?.reward || {},
    ready: left <= 0,
    leftMs: left,
    petNames: (d.petUids || [])
      .map((uid) => {
        const hit = findOwnedPet(state, uid);
        return hit ? displayPetName(hit.pet) : uid;
      })
      .join("、"),
  };
}

export function dispatchView(state, now = Date.now()) {
  ensureDispatchBoardDaily(state, now);
  const busy = dispatchBusyUids(state);
  const activeRaw = (state.dispatches || []).filter((d) => !d.claimed);
  const activeByMission = new Map(activeRaw.map((d) => [d.missionId, d]));
  const active = activeRaw.map((d) => formatDispatchActive(state, d, now));
  const slots = [];
  for (let i = 0; i < DISPATCH_BOARD_SIZE; i++) {
    const missionId = state.dispatchBoard[i];
    if (!missionId) {
      slots.push({
        slotIndex: i,
        status: "empty",
        missionId: null,
        mission: null,
        dispatchId: null,
        ready: false,
        leftMs: 0,
        petNames: "",
        reqLabel: "",
      });
      continue;
    }
    const mission = DISPATCH_MISSIONS.find((m) => m.id === missionId) || null;
    const d = activeByMission.get(missionId);
    let status = "available";
    let leftMs = 0;
    let petNames = "";
    let dispatchId = null;
    if (d) {
      leftMs = Math.max(0, (d.readyAt || 0) - now);
      status = leftMs <= 0 ? "ready" : "busy";
      dispatchId = d.dispatchId;
      petNames = (d.petUids || [])
        .map((uid) => {
          const hit = findOwnedPet(state, uid);
          return hit ? displayPetName(hit.pet) : uid;
        })
        .join("、");
    }
    slots.push({
      slotIndex: i,
      status,
      missionId,
      mission,
      name: mission?.name || missionId,
      desc: mission?.desc || "",
      needPets: mission?.needPets || 1,
      reward: mission?.reward || {},
      eggChance: mission?.eggChance || null,
      reqLabel: dispatchMissionReqLabel(mission),
      dispatchId,
      ready: status === "ready",
      leftMs,
      petNames,
    });
  }
  // 兼容舊 UI／測試：可接任務 = available 槽
  const missions = slots
    .filter((s) => s.status === "available" && s.mission)
    .map((s) => ({
      ...s.mission,
      locked: false,
      lockLabel: null,
      reqLabel: s.reqLabel,
      slotsUsed: active.length,
      slotsMax: DISPATCH_SLOT_MAX,
    }));
  return {
    slots,
    active,
    missions,
    board: [...state.dispatchBoard],
    boardDate: state.dispatchBoardDate || null,
    busyUids: [...busy],
    slotsUsed: active.length,
    slotsMax: DISPATCH_SLOT_MAX,
    boardSize: DISPATCH_BOARD_SIZE,
  };
}

export function startDispatch(state, missionId, petUids) {
  ensureDispatchBoardDaily(state);
  const mission = DISPATCH_MISSIONS.find((m) => m.id === missionId);
  if (!mission) return { ok: false, msg: "任務不存在。" };
  const active = state.dispatches.filter((d) => !d.claimed);
  if (active.length >= DISPATCH_SLOT_MAX) {
    return { ok: false, msg: `派遣欄已滿（${DISPATCH_SLOT_MAX}）。` };
  }
  if (!state.dispatchBoard.includes(missionId)) {
    return { ok: false, msg: "此任務唔喺可接列表。" };
  }
  if (!dispatchNeedStageMet(state, mission)) {
    const need = mission.needSpineStage || 1;
    return { ok: false, msg: `需主脊階段≥${need}（通關更多秘境）。` };
  }
  if (active.some((d) => d.missionId === missionId)) {
    return { ok: false, msg: "此任務已在進行中。" };
  }
  const uids = Array.isArray(petUids) ? [...new Set(petUids)] : [];
  if (uids.length !== mission.needPets) {
    return { ok: false, msg: `需要派出 ${mission.needPets} 隻牧場靈寵。` };
  }
  const busy = dispatchBusyUids(state);
  const reqLabel = dispatchMissionReqLabel(mission);
  const matingBusy = breedBusyUids(state);
  for (const uid of uids) {
    if (busy.has(uid)) return { ok: false, msg: "有靈寵已在派遣中。" };
    if (matingBusy.has(uid)) return { ok: false, msg: "交配孕育中的靈寵不能派遣。" };
    if (state.pets.some((p) => p.uid === uid)) {
      return { ok: false, msg: "請先將靈寵撤回牧場再派遣。" };
    }
    const hit = findOwnedPet(state, uid);
    if (!hit || hit.list !== "ranch") return { ok: false, msg: "只能派遣牧場待命靈寵。" };
    if (!petMatchesDispatchMission(hit.pet, mission)) {
      return { ok: false, msg: reqLabel ? `派出靈寵唔符合限制（${reqLabel}）。` : "派出靈寵唔符合限制。" };
    }
  }
  const now = Date.now();
  let durationMs = mission.durationMs;
  state.dispatches.push({
    dispatchId: `disp-${now}-${Math.floor(Math.random() * 999)}`,
    missionId: mission.id,
    petUids: uids,
    readyAt: now + Math.max(5000, durationMs),
    claimed: false,
  });
  // 派出後槽位保留，狀態變探險中；收集後先換該槽任務
  const names = uids
    .map((uid) => displayPetName(findOwnedPet(state, uid).pet))
    .join("、");
  pushLog(state, `派遣【${mission.name}】：${names} 出發。`);
  return { ok: true, msg: `已派出：${mission.name}` };
}

export function claimDispatch(state, dispatchId, rng = Math.random) {
  if (!state.dispatches) state.dispatches = [];
  const d = state.dispatches.find((x) => x.dispatchId === dispatchId);
  if (!d) return { ok: false, msg: "派遣不存在。" };
  if (d.claimed) return { ok: false, msg: "已領取。" };
  if ((d.readyAt || 0) > Date.now()) {
    const sec = Math.ceil((d.readyAt - Date.now()) / 1000);
    return { ok: false, msg: `尚未歸來（${sec}s）。` };
  }
  const mission = DISPATCH_MISSIONS.find((m) => m.id === d.missionId);
  const slotIndex = (state.dispatchBoard || []).indexOf(d.missionId);
  d.claimed = true;
  let maxGen = 0;
  for (const uid of d.petUids || []) {
    const hit = findOwnedPet(state, uid);
    if (hit?.pet) maxGen = Math.max(maxGen, petGeneration(hit.pet));
  }
  const genMult =
    maxGen >= 3
      ? DISPATCH_GEN_REWARD_MULT[3] || 1.25
      : maxGen >= 2
        ? DISPATCH_GEN_REWARD_MULT[2] || 1.1
        : 1;
  const scaled = scaleReward(mission?.reward, genMult);
  applyReward(state, scaled);
  let eggGot = null;
  const chance = mission?.eggChance;
  if (chance?.tier && Math.random() < (chance.rate || 0)) {
    if (!state.eggs) state.eggs = [];
    if (state.eggs.length < EGG_CAP) {
      eggGot = makeEgg(chance.tier, `dispatch:${mission.id}`);
      state.eggs.push(eggGot);
    }
  }
  if (!state.stats) state.stats = {};
  state.stats.dispatches = (state.stats.dispatches || 0) + 1;
  state.dispatches = state.dispatches.filter((x) => !x.claimed);
  // 收集後先換走該槽舊任務，再補新任務入同一槽
  let filledId = null;
  if (slotIndex >= 0) {
    state.dispatchBoard.splice(slotIndex, 1);
    filledId = refillDispatchBoardAfterClaim(state, slotIndex, rng);
  } else {
    ensureDispatchBoard(state, rng);
    filledId = (state.dispatchBoard || []).find((id) => id !== d.missionId) || null;
  }
  const bits = [];
  if (scaled?.stones) bits.push(`${scaled.stones}石`);
  if (scaled?.feed) bits.push(`${scaled.feed}飼料`);
  if (scaled?.dust) bits.push(`${scaled.dust}靈塵`);
  if (scaled?.scrap) bits.push(`${scaled.scrap}碎片`);
  if (scaled?.materials) {
    for (const [id, n] of Object.entries(scaled.materials)) {
      if (n) bits.push(`${MATERIALS[id]?.name || id}×${n}`);
    }
  }
  if (eggGot) bits.push(eggGot.name);
  const genNote = genMult > 1 ? `（${maxGen}代×${genMult}）` : "";
  pushLog(state, `派遣【${mission?.name || d.missionId}】歸來${genNote}：${bits.join("／") || "無"}。`);
  bumpDaily(state, "dispatch", 1);
  checkAchievements(state);
  const filled = filledId ? DISPATCH_MISSIONS.find((m) => m.id === filledId) : null;
  return {
    ok: true,
    msg: eggGot ? `收集 ${bits.join("／")}` : `收集 ${bits.join("／")}`,
    egg: eggGot,
    boardFilled: filledId,
    boardFilledName: filled?.name || null,
    slotIndex: slotIndex >= 0 ? slotIndex : null,
  };
}

/**
 * 融合解鎖：通關秘境三（心核）後才有融砂練功地／融合入口
 */
export function isFusionUnlocked(state) {
  return !!(state.clearedDungeons || {}).tide_3;
}

/**
 * 秘境進攻阻擋原因（階段／出戰／召喚／今日硬限制）；null = 可進預覽
 */
export function dungeonAttackBlockReason(state, dungeonId, now = Date.now()) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return "秘境不存在。";
  const realmMsg = dungeonRealmGateMsg(state, d);
  if (realmMsg) return realmMsg;
  if (!state.pets?.length) return "請先派出至少一隻靈寵再進秘境。";
  const gate = dungeonGateView(state, dungeonId, now);
  const summonMsg = dungeonSummonGateMsg(gate);
  if (summonMsg) return summonMsg;
  const tutWaiveChallenge = tutorialWaivesDungeonChallenge(state, dungeonId);
  const challenge = tutWaiveChallenge ? null : d.challenge || null;
  if (!tutWaiveChallenge && challenge?.banElement) {
    const banned = state.pets.filter((p) => p.elementId === challenge.banElement);
    if (banned.length) {
      const elName = { flame: "焰", gloom: "幽", tide: "潮", stone: "岩", gale: "嵐" }[
        challenge.banElement
      ];
      return `今日挑戰禁${elName || challenge.banElement}屬出戰。`;
    }
  }
  return null;
}

/** 統一：階段／realm 閘門文案 */
export function dungeonRealmGateMsg(state, d) {
  if (!d) return "秘境不存在。";
  if ((state.realm | 0) < (d.needRealm | 0)) {
    return `需要階段【${stageAt(d.needRealm).name}】（現【${stageAt(state.realm).name}】）`;
  }
  return null;
}

/** 統一：已通關召喚閘門文案 */
export function dungeonSummonGateMsg(gate) {
  if (!gate?.needsSummon || gate.phase === "ready") return null;
  if (gate.phase === "summoning") {
    return `潮霧凝聚中（${Math.ceil(gate.summonLeftMs / 1000)}s）……就緒後才可挑戰`;
  }
  return "已通關層需先召喚凝聚，再開始挑戰";
}

/**
 * Soft prestige：潮主後鑄潮印，重置階段／靈契，保留寵／裝／圖鑑／通關
 */
export function tryTideSeal(state) {
  void state;
  return { ok: false, msg: "鑄潮印已廢除——潮主階段本身即無限指標。" };
}

export function tideSealView(state) {
  void state;
  return {
    seals: 0,
    max: 0,
    mult: 1,
    canSeal: false,
    nextGain: 0,
    minRealm: TIDE_SEAL_MIN_REALM,
    retired: true,
  };
}

/** 在出戰／牧場中查找靈寵；回傳 { pet, list, index } */
export function findOwnedPet(state, uid) {
  if (!state.pets) state.pets = [];
  if (!state.ranch) state.ranch = [];
  let i = state.pets.findIndex((p) => p.uid === uid || p.templateId === uid);
  if (i >= 0) return { pet: state.pets[i], list: "pets", index: i };
  i = state.ranch.findIndex((p) => p.uid === uid || p.templateId === uid);
  if (i >= 0) return { pet: state.ranch[i], list: "ranch", index: i };
  return null;
}

/** 打本後嘗試遇見野生靈寵（用秘境遇寵權重；含 formula 高層） */
export function maybeEncounterAfterDungeon(state, dungeonId, won) {
  if (state.pending.length >= PENDING_BOND_MAX) {
    return { blocked: true, encounter: null };
  }
  let rate = won ? 0.62 : 0.22;
  if (state.pets.length === 0 && (state.ranch?.length || 0) === 0) rate = won ? 0.92 : 0.4;
  if (Math.random() > rate) return { blocked: false, encounter: null };

  const dungeonDef = resolveDungeon(state, dungeonId) || null;
  const enc = rollWildEncounter(dungeonId, dungeonDef, state.realm || 0);
  state.pending.push(enc);
  return { blocked: false, encounter: enc };
}

/** 嘗試契約待契約寵物（成功進入牧場）；useFeed 耗飼料提升成功率 */
export function tryBondPending(state, encounterId, useFeed = false) {
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}）。可先放歸或升階擴容。` };
  }
  const i = state.pending.findIndex((p) => p.encounterId === encounterId);
  if (i < 0) return { ok: false, msg: "找不到這隻待契約靈寵。" };
  const cand = state.pending[i];
  if (state.stones < cand.cost) return { ok: false, msg: "靈石不足。" };

  let rateBonus = 0;
  if (useFeed) {
    if ((state.feed || 0) < BOND_FEED_COST) {
      return { ok: false, msg: `飼料不足（需 ${BOND_FEED_COST}）。` };
    }
    state.feed -= BOND_FEED_COST;
    rateBonus = BOND_FEED_BONUS;
  }

  state.stones -= cand.cost;
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.bondAttempts += 1;
  bumpDaily(state, "bond", 1);

  const roll = Math.random();
  const baseRate = cand.bondRate != null ? cand.bondRate : 0.5;
  const failBonus = Math.min(BOND_FAIL_RATE_CAP, (cand.bondFails || 0) * BOND_FAIL_RATE_BONUS);
  const chance = Math.min(0.95, baseRate + rateBonus + failBonus);
  if (roll <= chance) {
    state.pending.splice(i, 1);
    const pet = normalizePet({
      ...cand,
      uid: `${cand.encounterId}-bonded`,
      status: "bonded",
    });
    delete pet.bondRate;
    delete pet.status;
    state.ranch.push(pet);
    state.stats.bonds += 1;
    registerBestiary(state, pet);
    const feedNote = useFeed ? `（飼料加成）` : "";
    pushLog(state, `契約成功${feedNote}：${petLabel(pet)} 進入牧場｜技能【${pet.skillName}】。`);
    checkAchievements(state);
    return { ok: true, success: true, msg: `契約成功！${pet.name} 已入牧場` };
  }

  const ownedBeforeFail = state.pets.length + (state.ranch?.length || 0);
  if (ownedBeforeFail <= 1) {
    state.stones += cand.cost;
    cand.bondFails = (cand.bondFails || 0) + 1;
    const bonusPct = Math.round(Math.min(BOND_FAIL_RATE_CAP, cand.bondFails * BOND_FAIL_RATE_BONUS) * 100);
    pushLog(
      state,
      `契約未穩——${cand.name} 仍在潮霧邊緣（靈寵不足：退還契約費${bonusPct ? `，下次成功率 +${bonusPct}%` : ""}）。`
    );
    return {
      ok: true,
      success: false,
      msg: `${cand.name} 未結契，可再試${bonusPct ? `（+${bonusPct}%）` : ""}`,
    };
  }

  state.pending.splice(i, 1);
  pushLog(state, `契約失敗——${cand.name} 掙脫契印逃入潮霧。`);
  return { ok: true, success: false, msg: `${cand.name} 逃脫了` };
}

/** 放棄待契約（不花靈石） */
export function dismissPending(state, encounterId) {
  const i = state.pending.findIndex((p) => p.encounterId === encounterId);
  if (i < 0) return { ok: false, msg: "找不到。" };
  const [gone] = state.pending.splice(i, 1);
  pushLog(state, `你放過了 ${gone.name}。`);
  return { ok: true, msg: `已放過 ${gone.name}` };
}

/** 牧場 → 出戰 */
export function deployPet(state, uid) {
  if (!state.ranch) state.ranch = [];
  const petMax = activePetMaxForState(state);
  if (state.pets.length >= petMax) {
    const unlockHint =
      petMax < ACTIVE_PET_MAX
        ? `（主脊階段${ACTIVE_PET_UNLOCK_STAGE}解鎖第 ${ACTIVE_PET_MAX} 位）`
        : "";
    return { ok: false, msg: `出戰欄已滿（最多 ${petMax} 隻）${unlockHint}。` };
  }
  if (breedBusyUids(state).has(uid)) {
    return { ok: false, msg: "該靈寵交配孕育中，無法出戰。" };
  }
  if (dispatchBusyUids(state).has(uid)) {
    return { ok: false, msg: "該靈寵派遣中，無法出戰。" };
  }
  const i = state.ranch.findIndex((p) => p.uid === uid || p.templateId === uid);
  if (i < 0) return { ok: false, msg: "牧場中找不到這隻靈寵。" };
  const [pet] = state.ranch.splice(i, 1);
  state.pets.push(pet);
  pushLog(state, `派出 ${pet.name} 出戰。`);
  const tut = advanceTutorialCascade(state);
  return {
    ok: true,
    msg: `${pet.name} 已出戰`,
    tutorialUnlock: tut.advanced ? tut.unlockMsg : null,
  };
}

/** 蛋列表視圖 */
export function eggsView(state, now = Date.now()) {
  if (!state.eggs) state.eggs = [];
  return state.eggs.map((e) => {
    const t = eggTierInfo(e.tier);
    const hatching = e.startedAt != null;
    const left = hatching ? Math.max(0, (e.readyAt || 0) - now) : eggHatchMsFor(e, t);
    const breedDesc =
      e.source === "breed"
        ? e.desc ||
          (e.generation && e.kind
            ? `可以孵化出${genEggPrefix(e.generation)}${e.kind}寵物`
            : "")
        : "";
    return {
      ...e,
      name: e.name || t.name,
      label: e.source === "breed" ? genLabel(e.generation || 1) : t.label,
      desc: breedDesc || e.desc || t.desc,
      hatchMs: eggHatchMsFor(e, t),
      hatching,
      ready: hatching && left <= 0,
      leftMs: left,
      leftSec: Math.ceil(left / 1000),
      dissolveSoul: eggDissolveSoul(e),
    };
  });
}

/** 進行中孵化（已開始、未領取；領取後會移出 eggs） */
export function activeHatchCount(state) {
  return (state.eggs || []).filter((e) => e.startedAt != null).length;
}

/** 孵化欄位視圖：容量 hatchSlotCap，佔用＝進行中蛋 */
export function hatchSlotsView(state, now = Date.now()) {
  const cap = hatchSlotCap(state);
  const hatching = eggsView(state, now)
    .filter((e) => e.hatching)
    .sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0));
  const slots = [];
  for (let i = 0; i < cap; i++) {
    const egg = hatching[i] || null;
    slots.push({
      index: i,
      empty: !egg,
      egg,
      ready: !!(egg && egg.ready),
      hatching: !!(egg && egg.hatching && !egg.ready),
    });
  }
  return { cap, used: hatching.length, slots, readyCount: hatching.filter((e) => e.ready).length };
}

/** 開始孵化 */
export function startHatch(state, eggUid, now = Date.now()) {
  if (!state.eggs) state.eggs = [];
  const egg = state.eggs.find((e) => e.uid === eggUid);
  if (!egg) return { ok: false, msg: "找不到這枚蛋。" };
  if (egg.startedAt != null) return { ok: false, msg: "已在孵化中。" };
  const cap = hatchSlotCap(state);
  const used = activeHatchCount(state);
  if (used >= cap) {
    return { ok: false, msg: `孵化欄已滿（${used}/${cap}）。可用暖巢箋擴欄，或等完成後領取。` };
  }
  const t = eggTierInfo(egg.tier);
  const tutShort =
    egg.source === "starter" ||
    egg.source === "tutorial_shop" ||
    (tutorialActive(state) && state.tutorial?.step === "hatch_second");
  const hatchMs = tutShort ? TUTORIAL_EGG_HATCH_MS : eggHatchMsFor(egg, t);
  egg.startedAt = now;
  egg.readyAt = now + hatchMs;
  const hatchSec = Math.round(hatchMs / 1000);
  const hatchLabel =
    tutShort || egg.source === "breed" || hatchMs < 90_000
      ? `${hatchSec} 秒`
      : `約 ${Math.round(hatchMs / 60000)} 分`;
  pushLog(state, `開始孵化【${egg.name || t.name}】（${hatchLabel}）。`);
  if (state.tutorial && !state.tutorial.done) {
    state.tutorial.flags.hatchStarted = true;
  }
  advanceTutorialCascade(state);
  return { ok: true, msg: `孵化開始：${egg.name || t.name}` };
}

/** 領取孵化完成的靈寵 */
export function claimHatch(state, eggUid) {
  if (!state.eggs) state.eggs = [];
  if (!state.ranch) state.ranch = [];
  const i = state.eggs.findIndex((e) => e.uid === eggUid);
  if (i < 0) return { ok: false, msg: "找不到這枚蛋。" };
  const egg = state.eggs[i];
  if (egg.startedAt == null) return { ok: false, msg: "尚未開始孵化。" };
  if ((egg.readyAt || 0) > Date.now()) {
    const sec = Math.ceil((egg.readyAt - Date.now()) / 1000);
    return { ok: false, msg: `尚未孵出（${sec}s）。` };
  }
  // 蛋入牧場欄；出戰欄唔佔牧場容量（同契約／繁殖／撤回一致）
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return {
      ok: false,
      msg: `牧場已滿（${state.ranch.length}/${cap}），無法領取。可先清倉放生或出戰。`,
      ranchFull: true,
    };
  }
  const pet = normalizePet(hatchPetFromEgg(egg, { realm: state.realm, starter: egg.source === "starter" }));
  state.eggs.splice(i, 1);
  state.ranch.push(pet);
  registerBestiary(state, pet);
  if (!state.stats) state.stats = {};
  state.stats.eggsHatched = (state.stats.eggsHatched || 0) + 1;
  state.stats.bonds = (state.stats.bonds || 0) + 1;
  if (egg.source === "breed" && egg.genes) {
    /* 繁殖達標已在領蛋時計；孵出時補圖鑑／統計 */
    const genes = egg.genes;
    if (genes.hybrid) state.stats.hybrids = (state.stats.hybrids || 0) + 1;
    if (genes.tertiary) state.stats.tertiaryBreeds = (state.stats.tertiaryBreeds || 0) + 1;
    if (genes.rarity >= 3) state.stats.legendBreeds = (state.stats.legendBreeds || 0) + 1;
    if (genes.hybrid && pet.speciesId) {
      if (!state.stats.speciesBreeds) state.stats.speciesBreeds = {};
      state.stats.speciesBreeds[pet.speciesId] =
        (state.stats.speciesBreeds[pet.speciesId] || 0) + 1;
    }
    if (genes.generation >= 3) {
      state.stats.gen3Breeds = (state.stats.gen3Breeds || 0) + 1;
    }
    /* 雜交圖鑑目標：孵出後刷新進度 */
    ensureBreedGoalsState(state);
    for (const g of BREED_GOALS) {
      if (g.type === "hybrid_dex") {
        const hybridDex = countHybridBestiary(state);
        const cur = state.breedGoals.progress[g.id] || 0;
        if (!state.breedGoals.claimed[g.id] && hybridDex > cur) {
          state.breedGoals.progress[g.id] = Math.min(g.need, hybridDex);
        }
      }
    }
  }
  if (state.tutorial && !state.tutorial.done) {
    state.tutorial.flags.hatchClaimed = true;
    if (egg.source === "starter") state.tutorial.flags.starterHatched = true;
    if (egg.source === "shop" || state.tutorial.flags.shopBought) {
      state.tutorial.flags.secondEggHatched = true;
    }
  }
  pushLog(state, `【${egg.name || eggTierInfo(egg.tier).name}】孵出 ${pet.name}！`);
  const tut = advanceTutorialCascade(state);
  checkAchievements(state);
  const genes = egg.source === "breed" ? egg.genes : null;
  const reveal = hatchRevealFromPet(pet, egg);
  const celebrate = !!(
    (egg.source === "breed" &&
      (genes?.hybrid ||
        genes?.tertiary ||
        genes?.rarityUp ||
        (genes?.rarity ?? 0) >= 2 ||
        (genes?.generation ?? 0) >= 2 ||
        egg.awakenSkillLevel ||
        (pet.bloodmarks && pet.bloodmarks.length))) ||
    (egg.source !== "breed" && (pet.rarity ?? 0) >= 2)
  );
  return {
    ok: true,
    msg: `孵出 ${pet.name}`,
    pet,
    eggSource: egg.source || null,
    celebrate,
    reveal,
    hybrid: !!(genes?.hybrid || SPECIES[pet.speciesId]?.breedOnly),
    tertiary: !!genes?.tertiary,
    rarity: pet.rarity ?? genes?.rarity ?? 0,
    rarityUp: !!genes?.rarityUp,
    generation: petGeneration(pet),
    tutorialUnlock: tut.advanced ? tut.unlockMsg : null,
  };
}

/** 破殼揭示摘要（孵化儀式用） */
function hatchRevealFromPet(pet, egg) {
  const r = rarityInfo(pet.rarity ?? 0);
  const bloodName =
    pet.bloodlineName && pet.bloodlineName !== "無紋" ? pet.bloodlineName : null;
  const tags = [];
  if (egg?.source === "breed") tags.push("血脈破殼");
  if (egg?.genes?.tertiary) tags.push("三代種");
  else if (SPECIES[pet.speciesId]?.breedOnly || egg?.genes?.hybrid) tags.push("雜交種");
  if ((pet.rarity ?? 0) >= 3) tags.push("傳說");
  else if ((pet.rarity ?? 0) >= 2) tags.push("史詩");
  else if (egg?.genes?.rarityUp) tags.push("稀有上升");
  if (petGeneration(pet) >= 2) tags.push(genLabel(petGeneration(pet)));
  if (egg?.awakenSkillLevel) tags.push(`覺醒技 Lv.${egg.awakenSkillLevel}`);
  if (bloodName) tags.push(bloodName);
  return {
    tags,
    rarityName: r.name,
    rarityColor: r.color,
    genLabel: genLabel(petGeneration(pet)),
    bloodline: bloodName,
    parents: egg?.parentNames || [],
  };
}

/** 一鍵領取所有已完成孵化（牧場滿則停） */
export function claimAllReadyHatches(state, now = Date.now()) {
  if (!state.eggs) state.eggs = [];
  const readyUids = state.eggs
    .filter((e) => e.startedAt != null && (e.readyAt || 0) <= now)
    .map((e) => e.uid);
  if (!readyUids.length) return { ok: false, msg: "沒有可領取的孵化。", pets: [] };
  const pets = [];
  const reveals = [];
  let celebrate = false;
  let hybrid = false;
  let maxRarity = 0;
  let tutorialUnlock = null;
  let stopMsg = null;
  let ranchFull = false;
  for (const uid of readyUids) {
    const r = claimHatch(state, uid);
    if (r.ok && r.pet) {
      pets.push(r.pet);
      if (r.reveal) reveals.push(r.reveal);
      if (r.celebrate) celebrate = true;
      if (r.hybrid) hybrid = true;
      maxRarity = Math.max(maxRarity, r.rarity ?? 0);
      if (r.tutorialUnlock) tutorialUnlock = r.tutorialUnlock;
    } else {
      stopMsg = r.msg || "領取中斷。";
      if (r.ranchFull) ranchFull = true;
      break;
    }
  }
  if (!pets.length) {
    return { ok: false, msg: stopMsg || "無法領取。", pets: [], ranchFull };
  }
  const msg =
    pets.length === 1
      ? `孵出 ${pets[0].name}`
      : `一鍵收取 ${pets.length} 隻：${pets.map((p) => p.name).join("、")}`;
  const payload = {
    ok: true,
    msg,
    pets,
    reveals,
    celebrate,
    hybrid,
    rarity: maxRarity,
    tutorialUnlock,
    ranchFull,
  };
  if (stopMsg) {
    return { ...payload, msg: `${msg}（其後：${stopMsg}）`, partial: true };
  }
  return payload;
}

/** 出戰 → 牧場 */
export function undeployPet(state, uid) {
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}），無法撤回。` };
  }
  const i = state.pets.findIndex((p) => p.uid === uid || p.templateId === uid);
  if (i < 0) return { ok: false, msg: "出戰欄找不到這隻靈寵。" };
  const [pet] = state.pets.splice(i, 1);
  state.ranch.push(pet);
  pushLog(state, `${pet.name} 撤回牧場。`);
  return { ok: true, msg: `${pet.name} 已回牧場` };
}

export function releasePet(state, uid) {
  if (!state.ranch) state.ranch = [];
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "不在靈寵欄／牧場。" };
  if (breedBusyUids(state).has(uid)) {
    return { ok: false, msg: "交配孕育中，唔可以放生。領蛋後先得。" };
  }
  if (found.pet.locked) {
    return { ok: false, msg: "已上鎖，唔可以放生。請先解鎖。" };
  }
  const list = found.list === "pets" ? state.pets : state.ranch;
  const [gone] = list.splice(found.index, 1);
  const soul = releaseSoulGain(gone);
  if (!state.materials) state.materials = emptyMaterials();
  state.materials.soul_essence = (state.materials.soul_essence || 0) + soul;
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.releases += 1;
  const label = gone.nick || gone.name;
  pushLog(state, `放生 ${label}，獲精魂 ${soul}。`);
  return {
    ok: true,
    msg: `放生 ${label}，獲精魂 ${soul}`,
    soul,
    refund: { soul, stones: 0, feed: 0, dust: 0 },
  };
}

/** 批量放生（遇鎖／缺失即中止，已成功嘅會保留） */
export function releasePets(state, uids) {
  const ids = Array.isArray(uids) ? uids.filter(Boolean) : [];
  if (!ids.length) return { ok: false, msg: "未揀靈寵。", soul: 0, count: 0 };
  let totalSoul = 0;
  let count = 0;
  const names = [];
  for (const uid of ids) {
    const r = releasePet(state, uid);
    if (!r.ok) {
      return {
        ok: false,
        msg: count ? `${r.msg}（已放生 ${count} 隻，精魂 +${totalSoul}）` : r.msg,
        soul: totalSoul,
        count,
        partial: count > 0,
      };
    }
    totalSoul += r.soul || 0;
    count += 1;
    names.push(r.msg);
  }
  return {
    ok: true,
    msg: count === 1 ? names[0] : `放生 ${count} 隻，共獲精魂 ${totalSoul}`,
    soul: totalSoul,
    count,
  };
}

export function setPetStarred(state, uid, starred) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  found.pet.starred = !!starred;
  const on = found.pet.starred;
  pushLog(state, `${displayPetName(found.pet)} ${on ? "已星標" : "取消星標"}。`);
  return { ok: true, msg: on ? "已星標" : "已取消星標", starred: on };
}

export function togglePetStarred(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  return setPetStarred(state, uid, !found.pet.starred);
}

export function setPetLocked(state, uid, locked) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  found.pet.locked = !!locked;
  const on = found.pet.locked;
  pushLog(state, `${displayPetName(found.pet)} ${on ? "已上鎖" : "已解鎖"}。`);
  return { ok: true, msg: on ? "已上鎖" : "已解鎖", locked: on };
}

export function togglePetLocked(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  return setPetLocked(state, uid, !found.pet.locked);
}

/** 預覽放生精魂總額（唔改狀態） */
export function previewReleaseSoul(state, uids) {
  const ids = Array.isArray(uids) ? uids : [uids];
  let soul = 0;
  const pets = [];
  for (const uid of ids) {
    const found = findOwnedPet(state, uid);
    if (!found) continue;
    if (found.pet.locked) {
      return { ok: false, msg: `${displayPetName(found.pet)} 已上鎖`, soul: 0, pets: [] };
    }
    const gain = releaseSoulGain(found.pet);
    soul += gain;
    pets.push({ uid: found.pet.uid, name: displayPetName(found.pet), soul: gain, pet: found.pet });
  }
  if (!pets.length) return { ok: false, msg: "找不到靈寵。", soul: 0, pets: [] };
  return { ok: true, soul, pets };
}

/**
 * 建議清倉對象：牧場內未上鎖、非星標、非交配／派遣中，優先低等級／低稀有。
 * limit 預設騰出 1 格（牧場滿時領孵用）。
 */
export function suggestRanchCullUids(state, limit = 1) {
  const need = Math.max(1, Math.min(12, limit | 0));
  const mating = breedBusyUids(state);
  const dispatchBusy = dispatchBusyUids(state);
  const rows = (state.ranch || [])
    .filter((p) => p && !p.locked && !p.starred && !mating.has(p.uid) && !dispatchBusy.has(p.uid))
    .map((p) => ({
      uid: p.uid,
      score:
        (p.level ?? 1) * 10 +
        (p.rarity ?? 0) * 40 +
        (p.fusionLevel ?? 0) * 60 +
        petGeneration(p) * 5,
    }))
    .sort((a, b) => a.score - b.score);
  return rows.slice(0, need).map((r) => r.uid);
}

/** 牧場容量視圖（UI 滿倉提示） */
export function ranchCapView(state) {
  const cap = ranchCap(state);
  const used = state.ranch?.length || 0;
  const free = Math.max(0, cap - used);
  return {
    used,
    cap,
    free,
    full: free <= 0,
    nearlyFull: free > 0 && free <= 2,
  };
}

/**
 * 未孵蛋化精（潮還）：只接受庫存蛋（未開始孵化）。
 */
export function dissolveEgg(state, eggUid) {
  if (!state.eggs) state.eggs = [];
  const i = state.eggs.findIndex((e) => e.uid === eggUid);
  if (i < 0) return { ok: false, msg: "找不到這枚蛋。" };
  const egg = state.eggs[i];
  if (egg.startedAt != null) {
    return { ok: false, msg: "孵化中唔可以化精。先等完成或領取。" };
  }
  const soul = eggDissolveSoul(egg);
  state.eggs.splice(i, 1);
  if (!state.materials) state.materials = emptyMaterials();
  state.materials.soul_essence = (state.materials.soul_essence || 0) + soul;
  if (!state.stats) state.stats = {};
  state.stats.eggDissolves = (state.stats.eggDissolves || 0) + 1;
  const label = egg.name || eggTierInfo(egg.tier).name;
  pushLog(state, `潮還【${label}】，獲精魂 ${soul}。`);
  return { ok: true, msg: `潮還 ${label}，精魂 +${soul}`, soul, egg };
}

/** 批量潮還庫存蛋 */
export function dissolveEggs(state, eggUids) {
  const ids = Array.isArray(eggUids) ? eggUids.filter(Boolean) : [];
  if (!ids.length) return { ok: false, msg: "未揀蛋。", soul: 0, count: 0 };
  let total = 0;
  let count = 0;
  for (const uid of ids) {
    const r = dissolveEgg(state, uid);
    if (!r.ok) {
      return {
        ok: false,
        msg: count ? `${r.msg}（已潮還 ${count} 枚，精魂 +${total}）` : r.msg,
        soul: total,
        count,
        partial: count > 0,
      };
    }
    total += r.soul || 0;
    count += 1;
  }
  return {
    ok: true,
    msg: count === 1 ? `潮還 1 枚，精魂 +${total}` : `潮還 ${count} 枚，精魂 +${total}`,
    soul: total,
    count,
  };
}

/** 為靈寵命名（最多 NICK_MAX_LEN 字） */
export function renamePet(state, uid, nick) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const cleaned = String(nick || "")
    .trim()
    .replace(/\s+/g, "")
    .slice(0, NICK_MAX_LEN);
  if (!cleaned) {
    delete found.pet.nick;
    pushLog(state, `${found.pet.name} 恢復本名。`);
    return { ok: true, msg: "已清除暱稱" };
  }
  found.pet.nick = cleaned;
  pushLog(state, `${found.pet.name} 命名為「${cleaned}」。`);
  return { ok: true, msg: `命名「${cleaned}」` };
}

export function displayPetName(pet) {
  if (!pet) return "";
  return pet.nick ? `${pet.nick}（${pet.name}）` : pet.name;
}

/**
 * 升級靈寵（出戰或牧場）
 * @param {'stones' | 'feed'} payWith
 */
export function upgradePet(state, uid, payWith = "stones") {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const level = pet.level ?? 1;
  const matCost = upgradeMatCost(level);
  if (!spendMaterials(state, matCost)) {
    const sh = shortageHint(state, matCost);
    return {
      ok: false,
      msg: `材料不足（需 ${formatMats(matCost)}）${sh.hint ? `｜${sh.hint}` : ""}。`,
      suggest: sh.suggest,
    };
  }
  if (payWith === "feed") {
    const cost = upgradeFeedCost(level);
    if ((state.feed || 0) < cost) {
      addMaterials(state, matCost); // refund mats
      return { ok: false, msg: `飼料不足（需 ${cost}）。` };
    }
    state.feed = Math.max(0, (state.feed || 0) - cost);
    const gains = applySubGrowthToLevelGains(levelStatGains(petGeneration(pet)), pet);
    pet.atk = ceilStat(pet.atk + gains.atk);
    pet.hp = ceilStat(pet.hp + gains.hp);
    pet.spd = ceilStat(pet.spd + gains.spd);
    pet.level = level + 1;
    const matNote = formatMats(matCost);
    pushLog(
      state,
      `${pet.name} 以飼料×${cost} 升級至 Lv.${pet.level}（攻+${ceilStat(gains.atk)} 血+${ceilStat(gains.hp)} 速+${ceilStat(gains.spd)}）${matNote ? `｜耗 ${matNote}` : ""}。`
    );
    maybeAnnounceSecondSkill(state, pet, level);
    return { ok: true, msg: `${pet.name} → Lv.${pet.level}（耗飼料×${cost}）` };
  }
  const cost = upgradeStoneCost(level);
  if (state.stones < cost) {
    addMaterials(state, matCost);
    return { ok: false, msg: `靈石不足（需 ${cost}）。` };
  }
  state.stones -= cost;
  const gains = applySubGrowthToLevelGains(levelStatGains(petGeneration(pet)), pet);
  pet.atk = ceilStat(pet.atk + gains.atk);
  pet.hp = ceilStat(pet.hp + gains.hp);
  pet.spd = ceilStat(pet.spd + gains.spd);
  pet.level = level + 1;
  const matNote = formatMats(matCost);
  pushLog(
    state,
    `${pet.name} 升級至 Lv.${pet.level}（攻+${ceilStat(gains.atk)} 血+${ceilStat(gains.hp)} 速+${ceilStat(gains.spd)}）${matNote ? `｜耗 ${matNote}` : ""}。`
  );
  maybeAnnounceSecondSkill(state, pet, level);
  return { ok: true, msg: `${pet.name} → Lv.${pet.level}` };
}

function maybeAnnounceSecondSkill(state, pet, prevLevel) {
  if (prevLevel < SECOND_SKILL_UNLOCK.level && (pet.level ?? 1) >= SECOND_SKILL_UNLOCK.level) {
    if ((pet.fusionLevel ?? 0) < SECOND_SKILL_UNLOCK.fusionLevel) {
      const secondId = secondSkillIdForPet(pet);
      const sn = SKILLS[secondId]?.name;
      if (sn) pushLog(state, `${pet.name} 因等級覺醒第二技能【${sn}】！`);
    }
  }
}

/** 靈塵＋靈響脂升級寵物技能（主技／二技分開） */
export function upgradePetSkill(state, uid, which = "primary") {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const slot = which === "second" ? "second" : "primary";
  if (slot === "second") {
    const fusion = pet.fusionLevel ?? 0;
    const level = pet.level ?? 1;
    const unlocked =
      fusion >= SECOND_SKILL_UNLOCK.fusionLevel || level >= SECOND_SKILL_UNLOCK.level;
    if (!unlocked) {
      return {
        ok: false,
        msg: `第二技能未解鎖（融階≥${SECOND_SKILL_UNLOCK.fusionLevel} 或 Lv≥${SECOND_SKILL_UNLOCK.level}）。`,
      };
    }
  }
  const lv = slot === "second" ? pet.secondSkillLevel ?? 1 : pet.skillLevel ?? 1;
  if (lv >= SKILL_MAX_LEVEL) return { ok: false, msg: `技能已滿級（${SKILL_MAX_LEVEL}）。` };
  const cost = skillDustCost(lv);
  if ((state.dust || 0) < cost) return { ok: false, msg: `靈塵不足（需 ${cost}）。` };
  const mats = skillMatCost(lv);
  if (!spendMaterials(state, mats)) {
    const sh = shortageHint(state, mats);
    return {
      ok: false,
      msg: `材料不足（需 ${formatMats(mats)}）${sh.hint ? `｜${sh.hint}` : ""}。`,
      suggest: sh.suggest,
    };
  }
  state.dust -= cost;
  if (slot === "second") pet.secondSkillLevel = lv + 1;
  else pet.skillLevel = lv + 1;
  const newLv = slot === "second" ? pet.secondSkillLevel : pet.skillLevel;
  const label = slot === "second" ? "第二技能" : "主技能";
  const matNote = formatMats(mats);
  pushLog(
    state,
    `${pet.name} ${label}升至 Lv.${newLv}（威力↑）${matNote ? `｜耗 ${matNote}` : ""}。`
  );
  return { ok: true, msg: `${pet.name} ${label} Lv.${newLv}` };
}

function isItemEquipped(state, itemUid) {
  const me = state.master?.equip || {};
  for (const slot of MASTER_EQUIP_SLOTS) {
    if (me[slot] === itemUid) return { who: "master", slot };
  }
  return null;
}

/** 人物裝備已廢止 */
export function equipMaster(_state, _itemUid, _slot) {
  return { ok: false, msg: "人物裝備已廢止——重心在靈寵。" };
}

export function unequipMaster(_state, _slot) {
  return { ok: false, msg: "人物裝備已廢止。" };
}

export function inventoryView(state) {
  const items = state.inventory || [];
  return items.map((it) => {
    const def = GEAR[it.gearId];
    const worn = isItemEquipped(state, it.uid);
    return {
      uid: it.uid,
      gearId: it.gearId,
      name: def?.name || it.gearId,
      slot: def?.slot,
      rarity: def?.rarity || 1,
      atk: (def?.atk || 0) + (it.forgeAtk || 0),
      hp: (def?.hp || 0) + (it.forgeHp || 0),
      spd: def?.spd || 0,
      forgeAtk: it.forgeAtk || 0,
      forgeHp: it.forgeHp || 0,
      worn,
    };
  });
}

/**
 * 融合：同種族；目標融階 = 主體融階+1（最高 3）。
 * 主體須達等級門檻；素材隻數 = 總需求-1（2/4/8 含主體 → 1/3/7 素材）；素材不計等級。
 * 融合後繼承主體等級（唔吸收素材等級）。
 * @param {string[]} matUids
 */
export function fusePets(state, baseUid, matUids) {
  if (!isFusionUnlocked(state)) {
    return { ok: false, msg: "通關秘境三【潮汐廢墟 · 心核】後解鎖融合。" };
  }
  const mats = Array.isArray(matUids) ? [...new Set(matUids)] : [matUids].filter(Boolean);
  if (mats.includes(baseUid)) return { ok: false, msg: "素材不能包含主體。" };

  const baseFound = findOwnedPet(state, baseUid);
  if (!baseFound) return { ok: false, msg: "找不到主體靈寵。" };
  const base = baseFound.pet;
  const curFusion = base.fusionLevel ?? 0;
  const targetStage = nextFusionStage(curFusion);
  if (targetStage == null) return { ok: false, msg: "此寵已融合過（終身一次）。" };

  const rule = FUSION_RULES[targetStage];
  const baseLevel = base.level ?? 1;
  if (baseLevel < rule.needLevel) {
    return {
      ok: false,
      msg: `融合需要主體至少 Lv.${rule.needLevel}（現 Lv.${baseLevel}）。`,
    };
  }

  const needMats = fusionMaterialNeed(targetStage);
  if (mats.length !== needMats) {
    return {
      ok: false,
      msg: `融合需要主體 + ${needMats} 隻同種族滿級素材（現選 ${mats.length}）。`,
    };
  }

  const matFounds = [];
  for (const uid of mats) {
    const f = findOwnedPet(state, uid);
    if (!f) return { ok: false, msg: "找不到素材靈寵。" };
    if (f.pet.speciesId !== base.speciesId) {
      return { ok: false, msg: "只能融合同種族靈寵。" };
    }
    if ((f.pet.level ?? 1) < rule.needLevel) {
      return {
        ok: false,
        msg: `素材「${f.pet.name}」需達 Lv.${rule.needLevel}（現 Lv.${f.pet.level ?? 1}）。`,
      };
    }
    matFounds.push(f);
  }

  const cost = fusionStoneCost(targetStage);
  if (state.stones < cost) return { ok: false, msg: `靈石不足（需 ${cost}）。` };
  const fuseMats = fusionMatCost(targetStage);
  if (!spendMaterials(state, fuseMats)) {
    const sh = shortageHint(state, fuseMats);
    return {
      ok: false,
      msg: `材料不足（需 ${formatMats(fuseMats)}）${sh.hint ? `｜${sh.hint}` : ""}。`,
      suggest: sh.suggest,
    };
  }
  state.stones -= cost;

  // 融合：吸收改細；出戰乘區為主；素材稀有軟綁
  const keepLevel = base.level ?? 1;
  const rarityFactor = fusionMaterialRarityFactor(
    base.rarity ?? 0,
    matFounds.map((f) => f.pet.rarity ?? 0)
  );
  const rate = fusionAbsorbRate(targetStage) * rarityFactor;
  for (const { pet: mat } of matFounds) {
    base.atk += Math.max(1, Math.floor(mat.atk * rate)) + Math.max(1, Math.floor(targetStage * rarityFactor));
    base.hp += Math.max(2, Math.floor(mat.hp * rate)) + Math.max(1, Math.floor(targetStage * 2 * rarityFactor));
    base.spd += Math.max(1, Math.floor(mat.spd * rate * 0.85));
  }
  base.atk += Math.max(1, Math.floor((1 + targetStage) * rarityFactor));
  base.hp += Math.max(2, Math.floor((4 + targetStage * 2) * rarityFactor));
  base.spd += Math.max(0, Math.floor(targetStage * rarityFactor));
  base.atk = ceilStat(base.atk);
  base.hp = ceilStat(base.hp);
  base.spd = ceilStat(base.spd);
  base.fusionLevel = targetStage;
  base.fusionPowerMult = fusionPowerMultFromParts(targetStage, rarityFactor);
  base.level = keepLevel;

  // 由高 index 開始刪，避免同 list 錯位
  const removals = matFounds
    .map((f) => ({ listName: f.list, index: f.index, uid: f.pet.uid }))
    .sort((a, b) => {
      if (a.listName !== b.listName) return a.listName < b.listName ? -1 : 1;
      return b.index - a.index;
    });
  for (const r of removals) {
    const list = r.listName === "pets" ? state.pets : state.ranch;
    const idx = list.findIndex((p) => p.uid === r.uid);
    if (idx >= 0) list.splice(idx, 1);
  }

  pushLog(
    state,
    `融合完成：${base.name} → 融階 ${targetStage}（繼承 Lv.${keepLevel}，出戰×${Number(base.fusionPowerMult || 1).toFixed(2)}，耗 ${needMats} 素材／${cost} 靈石${
      formatMats(fuseMats) ? `／${formatMats(fuseMats)}` : ""
    }${rarityFactor < 1 ? `｜素材稀有不足×${rarityFactor}` : ""}）。`
  );
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.fusions += 1;
  bumpDaily(state, "fuse", 1);
  if (state.tutorial && !state.tutorial.flags) state.tutorial.flags = {};
  if (state.tutorial?.flags) state.tutorial.flags.fuseDone = true;
  if (targetStage === SECOND_SKILL_UNLOCK.fusionLevel) {
    const secondId = secondSkillIdForPet(base);
    const sn = SKILLS[secondId]?.name;
    if (sn) pushLog(state, `${base.name} 覺醒第二技能【${sn}】！`);
  }
  checkAchievements(state);
  return {
    ok: true,
    msg: `${base.name} 融階 ${targetStage}｜Lv.${keepLevel}`,
    pet: base,
    cost,
  };
}

/** UI 用詳情彙總 */
export function petDetail(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return null;
  const pet = found.pet;
  const level = pet.level ?? 1;
  const fusion = pet.fusionLevel ?? 0;
  const target = nextFusionStage(fusion);
  const rule = target != null ? FUSION_RULES[target] : null;
  const skillIds = petSkillIds(pet);
  const skillLv = pet.skillLevel ?? 1;
  const secondId = secondSkillIdForPet(pet);
  const secondUnlocked =
    fusion >= SECOND_SKILL_UNLOCK.fusionLevel || level >= SECOND_SKILL_UNLOCK.level;
  const secondLv = pet.secondSkillLevel ?? 1;
  const baseline = petSpeciesBaseline(pet.speciesId, pet.elementId, pet.personalityId);
  const innateBonus = {
    atk: roundStat(Math.max(0, (pet.atk || 0) - baseline.atk)),
    hp: roundStat(Math.max(0, (pet.hp || 0) - baseline.hp)),
    spd: roundStat(Math.max(0, (pet.spd || 0) - baseline.spd)),
  };
  return {
    pet,
    location: found.list,
    deployed: found.list === "pets",
    level,
    fusionLevel: fusion,
    skillLevel: skillLv,
    secondSkillLevel: secondLv,
    upgradeCost: upgradeStoneCost(level),
    upgradeFeedCost: upgradeFeedCost(level),
    skillDustCost: skillLv < SKILL_MAX_LEVEL ? skillDustCost(skillLv) : null,
    skillMatCost: skillLv < SKILL_MAX_LEVEL ? skillMatCost(skillLv) : null,
    skillMaxed: skillLv >= SKILL_MAX_LEVEL,
    secondSkillDustCost:
      secondUnlocked && secondLv < SKILL_MAX_LEVEL ? skillDustCost(secondLv) : null,
    secondSkillMatCost:
      secondUnlocked && secondLv < SKILL_MAX_LEVEL ? skillMatCost(secondLv) : null,
    secondSkillMaxed: secondLv >= SKILL_MAX_LEVEL,
    nextFusionStage: target,
    fuseNeedLevel: rule?.needLevel ?? null,
    fuseTotalPets: rule?.totalPets ?? null,
    fuseMatNeed: target != null ? fusionMaterialNeed(target) : 0,
    fuseCostHint: target != null ? fusionStoneCost(target) : null,
    fuseMatCost: target != null ? fusionMatCost(target) : null,
    fuseMaxed: target == null,
    fusionPowerMult: petFusionCombatMult(pet),
    skill: skillInfo(pet.skillId),
    skillIds,
    secondSkill: secondId ? skillInfo(secondId) : null,
    secondUnlocked,
    baseline,
    innateBonus,
    ranchFull: (state.ranch?.length || 0) >= ranchCap(state),
    partyFull: state.pets.length >= activePetMaxForState(state),
  };
}

function lowestHp(units) {
  return units.filter((u) => u.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
}

function rolePriority(role) {
  if (role === "boss") return 0;
  if (role === "elite") return 1;
  return 2;
}

function pickFoe(foes, tactics = "balanced") {
  const live = foes.filter((t) => t.hp > 0);
  if (!live.length) return null;
  if (tactics === "focus_boss") {
    live.sort((a, b) => {
      const rp = rolePriority(a.role) - rolePriority(b.role);
      if (rp !== 0) return rp;
      return a.hp - b.hp;
    });
    return live[0];
  }
  return live.reduce((a, b) => (a.hp <= b.hp ? a : b));
}

let _combatUid = 0;

function tagCombatUnits(units, prefix) {
  for (const u of units) {
    if (!u.uid) u.uid = `${prefix}${++_combatUid}`;
  }
  return units;
}

function unitRosterEntry(u) {
  return {
    uid: u.uid,
    name: u.name,
    side: u.side,
    elementId: u.elementId,
    hp: u.hp,
    maxHp: u.maxHp,
    role: u.role || null,
    actions: u.actions || 1,
  };
}

function pushCombatText(events, text) {
  events.push({ type: "text", text });
}

function dealStrike(actor, target, power, transcript, events, skillName, skillId = null) {
  if (!target || target.hp <= 0) return;
  const pMult = skillPowerMult(actorSkillLevel(actor, skillId));
  let dmg = Math.max(1, Math.floor(actor.atk * power * pMult) + Math.floor(Math.random() * 4) - 1);
  if (skillName === "嵐擊" || skillName === "穿空" || skillName === "礁襲" || skillName === "珊嵐槍" || skillName === "嵐虛斬") {
    dmg += Math.floor(actor.spd / 4);
  }
  const { mult, tag } = elementMatchup(actor.elementId, target.elementId);
  dmg = Math.max(1, Math.floor(dmg * mult));
  if (actor.atkBuffTurns > 0) dmg = Math.max(1, Math.floor(dmg * (1 + (actor.atkBuffPct || 0))));
  const mitigated0 = target.guardTurns > 0 ? Math.max(1, Math.floor(dmg * 0.55)) : dmg;
  const mitigated = Math.max(
    1,
    Math.floor(mitigated0 * (target.dmgTakenMult != null ? target.dmgTakenMult : 1))
  );
  target.hp = Math.max(0, target.hp - mitigated);
  const guardNote = target.guardTurns > 0 ? "（甲盾減傷）" : "";
  const elemNote = tag ? `（${tag}）` : "";
  let verb = "普通攻擊";
  if (skillName) verb = `施展【${skillName}】`;
  else if (power !== 1) verb = "餘波擊中";
  const line = `${actor.name} ${verb} → ${target.name}，造成 ${mitigated} 傷害${elemNote}${target.hp === 0 ? "（擊破）" : ""}${guardNote}。`;
  transcript.push(line);
  if (events) {
    events.push({
      type: "strike",
      text: line,
      actorUid: actor.uid,
      targetUid: target.uid,
      skillName: skillName || null,
      dmg: mitigated,
      elemTag: tag,
      actorElementId: actor.elementId,
      targetElementId: target.elementId,
      targetHp: target.hp,
      targetMaxHp: target.maxHp,
      ko: target.hp === 0,
      actorBuff:
        actor.atkBuffTurns > 0
          ? `攻↑${Math.round((actor.atkBuffPct || 0) * 100)}%`
          : null,
      targetBuff: target.guardTurns > 0 ? "甲盾" : null,
    });
  }
}

function actorSkillLevel(actor, skillId) {
  if (skillId && actor?.secondSkillId && skillId === actor.secondSkillId) {
    return Math.max(1, actor.secondSkillLevel ?? 1);
  }
  return Math.max(1, actor?.skillLevel ?? 1);
}

function useSkill(actor, skill, allies, foes, transcript, events, tactics = "balanced") {
  const cdMap = actor.skillCd;
  if ((cdMap[skill.id] || 0) > 0) return false;
  const pMult = skillPowerMult(actorSkillLevel(actor, skill.id));
  const power = skill.power * pMult;

  if (skill.type === "strike") {
    const t = pickFoe(foes, tactics);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, events, skill.name, skill.id);
  } else if (skill.type === "cleave") {
    const live = foes.filter((f) => f.hp > 0);
    if (!live.length) return false;
    const targets = skill.id === "tide_spray" ? live.slice(0, 2) : live;
    const line = `${actor.name} 施展【${skill.name}】！`;
    transcript.push(line);
    pushCombatText(events, line);
    for (const t of targets) dealStrike(actor, t, skill.power, transcript, events, null, skill.id);
  } else if (skill.type === "heal") {
    const t = lowestHp(allies);
    if (!t) return false;
    const healMult = actor.healOutMult != null ? actor.healOutMult : 1;
    const heal = Math.max(1, Math.floor((Math.max(8, Math.floor(t.maxHp * power) + actor.atk)) * healMult));
    t.hp = Math.min(t.maxHp, t.hp + heal);
    const line = `${actor.name} 施展【${skill.name}】，為 ${t.name} 回復 ${heal} 生命。`;
    transcript.push(line);
    if (events) {
      events.push({
        type: "heal",
        text: line,
        actorUid: actor.uid,
        targetUid: t.uid,
        heal,
        targetHp: t.hp,
        targetMaxHp: t.maxHp,
      });
    }
  } else if (skill.type === "guard") {
    actor.guardTurns = 2;
    const healMult = actor.healOutMult != null ? actor.healOutMult : 1;
    const heal = Math.max(1, Math.floor(Math.max(5, Math.floor(actor.maxHp * power)) * healMult));
    actor.hp = Math.min(actor.maxHp, actor.hp + heal);
    const line = `${actor.name} 施展【${skill.name}】，減傷並回復 ${heal}。`;
    transcript.push(line);
    if (events) {
      events.push({
        type: "heal",
        text: line,
        targetUid: actor.uid,
        heal,
        targetHp: actor.hp,
        targetMaxHp: actor.maxHp,
      });
    }
  } else if (skill.type === "debuff") {
    const t = pickFoe(foes, tactics);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, events, skill.name);
    t.atk = Math.max(1, Math.floor(t.atk * 0.85));
    const line = `${t.name} 的攻擊因蝕咬而下降。`;
    transcript.push(line);
    pushCombatText(events, line);
  } else if (skill.type === "buff") {
    const pct = power;
    for (const a of allies.filter((x) => x.hp > 0)) {
      a.atkBuffTurns = 3;
      a.atkBuffPct = pct;
    }
    const line = `${actor.name} 施展【${skill.name}】，友方攻擊提升 ${Math.round(pct * 100)}%（3 回合）！`;
    transcript.push(line);
    pushCombatText(events, line);
  } else {
    return false;
  }

  cdMap[skill.id] = skill.cd;
  return true;
}

function tickCooldowns(unit) {
  Object.keys(unit.skillCd).forEach((k) => {
    if (unit.skillCd[k] > 0) unit.skillCd[k] -= 1;
  });
  if (unit.guardTurns > 0) unit.guardTurns -= 1;
  if (unit.atkBuffTurns > 0) unit.atkBuffTurns -= 1;
}

function act(actor, allies, foes, transcript, events, tactics = "balanced") {
  const skills = (actor.skills || [])
    .map((id) => SKILLS[id])
    .filter(Boolean)
    .sort((a, b) => a.cd - b.cd);

  const ready = skills.filter((s) => (actor.skillCd[s.id] || 0) <= 0);
  const skillChance = actor.role === "boss" ? 0.85 : actor.role === "elite" ? 0.78 : 0.72;
  if (ready.length && Math.random() < skillChance) {
    let skill;
    const preferSustain =
      (tactics === "sustain" && actor.side === "ally") || (actor.side === "ally" && actor.sustainBias);
    if (preferSustain) {
      const sustain = ready.filter((s) => s.type === "heal" || s.type === "guard");
      skill = sustain.length
        ? sustain[Math.floor(Math.random() * sustain.length)]
        : ready[Math.floor(Math.random() * ready.length)];
    } else {
      skill = ready[Math.floor(Math.random() * ready.length)];
    }
    if (useSkill(actor, skill, allies, foes, transcript, events, tactics)) return;
  }
  dealStrike(actor, pickFoe(foes, tactics), 1, transcript, events, null);
}

function spawnCombatFoe(e, dailyMod = null, challenge = null) {
  let role = e.role || "normal";
  let hp = e.hp;
  let atk = e.atk;
  let spd = e.spd;
  let skills = Array.isArray(e.skills) ? e.skills.filter((id) => SKILLS[id]) : [];
  if (challenge?.eliteTrash && role === "normal") {
    role = "elite";
    hp = Math.round(hp * 1.35);
    atk = Math.round(atk * 1.2);
    if (!skills.length) skills = ["tide_crush", "coral_spike"].filter((id) => SKILLS[id]);
  }
  const tag = role === "boss" ? "【BOSS】" : role === "elite" ? "【精英】" : "";
  const actions = e.actions != null ? e.actions : role === "boss" ? 2 : 1;
  if (dailyMod) {
    if (role === "elite" && dailyMod.eliteHpMult) hp = Math.round(hp * dailyMod.eliteHpMult);
    if (role === "boss" && dailyMod.bossAtkMult) atk = Math.round(atk * dailyMod.bossAtkMult);
  }
  if (challenge && role === "boss") {
    if (challenge.bossHpMult) hp = Math.round(hp * challenge.bossHpMult);
    if (challenge.bossAtkMult) atk = Math.round(atk * challenge.bossAtkMult);
  }
  return {
    side: "foe",
    name: `${tag}${e.name}`,
    rawName: e.name,
    hp,
    maxHp: hp,
    atk,
    spd,
    elementId: e.element,
    role,
    actions: Math.max(1, actions),
    skillLevel: role === "boss" ? 2 : 1,
    skills,
    skillCd: Object.fromEntries(skills.map((id) => [id, 0])),
    guardTurns: 0,
    atkBuffTurns: 0,
    atkBuffPct: 0,
  };
}

function spawnWaveFoes(wave, dailyMod = null, challenge = null) {
  return (wave?.enemies || []).map((e) => spawnCombatFoe(e, dailyMod, challenge));
}

/** 組出戰方戰鬥單位（runDungeon / 預覽共用） */
function buildDungeonAllyUnits(state, d, { dailyMod = null, challenge = null } = {}) {
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;
  const stageBonus = state.realm * 2;
  const synergy = partySynergy(state.pets);
  const dex = bestiaryStatus(state);
  const sealMult = tideSealCombatMult(state.tideSeals || 0);
  // 秘境唔食潮淵 cosmetic／power node 乘區
  const atkMult = synergy.atkMult * dex.atkMult * sealMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult;
  const condEval = evaluateDungeonConditions(state.pets, d);
  const passives = condEval.filter((c) => c.passive);
  const combatPassives = [...passives];
  if (dailyMod?.allyElemAtk) {
    combatPassives.push({
      type: "elem_atk",
      element: dailyMod.allyElemAtk.element,
      mult: dailyMod.allyElemAtk.mult,
      passive: true,
      label: dailyMod.label,
    });
  }
  const allies = [];
  for (const p of state.pets) {
    const skills = petSkillIds(p);
    const elemMult = dungeonElemAtkMult(combatPassives, p.elementId);
    const gen = petGeneration(p);
    const gMult = genCombatMult(gen);
    const fMult = petFusionCombatMult(p);
    const fAtk = formation.petAtkMult || 1;
    const fHp = formation.petHpMult || 1;
    const fSpd = formation.petSpdMult || 1;
    const pe = personalityCombatForPet(p);
    const pAtk = pe?.atkMult || 1;
    const pHp = pe?.hpMult || 1;
    const pSpd = pe?.spdMult || 1;
    const bm = bloodmarkCombatMult(p.bloodmarks);
    allies.push({
      side: "ally",
      name: displayPetName(p),
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * elemMult * gMult * fMult * fAtk * pAtk * bm.atk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd * bm.spd),
      elementId: p.elementId,
      elementName: p.elementName,
      skillName: p.skillName || SKILLS[p.skillId]?.name || "—",
    });
  }
  return {
    allies,
    synergy,
    formation,
    tactics,
    tacticsName: TACTICS[tactics]?.name || tactics,
  };
}

/** 進攻前隊伍 vs 敵方預覽 */
export function dungeonTeamPreview(state, dungeonId) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return null;
  if (!state.pets?.length) return { ok: false, msg: "請先派出靈寵。" };
  const dailyPack = ensureDungeonDaily(state);
  const dailyMod = dailyPack?.mod || null;
  const tutWaiveChallenge = tutorialWaivesDungeonChallenge(state, dungeonId);
  const challenge = tutWaiveChallenge ? null : d.challenge || null;
  const waves = dungeonWaves(d);
  if (!waves.length) return null;
  const ctx = buildDungeonAllyUnits(state, d, { dailyMod, challenge });
  const foes = spawnWaveFoes(waves[0], dailyMod, challenge);
  const roles = countDungeonRoles(waves);
  const st = dungeonStatus(state, dungeonId);
  return {
    ok: true,
    dungeonName: d.name,
    allies: ctx.allies,
    foes: foes.map((f) => ({
      name: f.name,
      atk: f.atk,
      hp: f.hp,
      spd: f.spd,
      role: f.role || "normal",
    })),
    waveCount: waves.length,
    roles,
    synergyLabels: ctx.synergy.labels,
    tacticsName: ctx.tacticsName,
    formationName: ctx.formation.name,
    conditionsMet: (st?.conditions || []).filter((c) => !c.passive && c.ok).length,
    conditionsTotal: (st?.conditions || []).filter((c) => !c.passive).length,
    challengeMet: st?.challengeMet ?? true,
  };
}

/**
 * 戰鬥結算（同步計算）；UI 負責逐條播放戰報。
 * 波次：雜兵 → 精英 → BOSS；敵人可施技能；BOSS 可雙動。
 * 含關卡條件獎、雜交試煉、首通、冷卻。
 */
export function runDungeon(state, dungeonId, opts = {}) {
  const { sweepInternal = false, deferEncounter = false, trainSpine = false } = opts;
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (trainSpine) {
    const tier = parseDungeonTier(dungeonId);
    if (!tier || isBranchDungeonId(dungeonId)) {
      return { ok: false, msg: "非主脊關卡。" };
    }
    const frontier = spineFrontierTier(state);
    const already = !!(state.clearedDungeons || {})[dungeonId];
    if (!already && tier !== frontier) {
      return { ok: false, msg: `請先打通主脊第 ${frontier} 關。` };
    }
  } else {
    const realmMsg = dungeonRealmGateMsg(state, d);
    if (realmMsg) return { ok: false, msg: realmMsg };
  }
  if (!state.dungeonReadyAt) state.dungeonReadyAt = {};
  if (!state.clearedDungeons) state.clearedDungeons = {};
  const now = Date.now();
  // 舊 CD 欄位僅相容；新流程用 summon gate
  syncDungeonSummon(state, dungeonId, now);

  const waves = dungeonWaves(d);
  if (!waves.length) return { ok: false, msg: "此秘境無敵人。" };

  if (state.tutorial && !state.tutorial.done) {
    state.tutorial.flags.dungeonStarted = true;
  }

  if (!state.pets.length) {
    return { ok: false, msg: "請先派出至少一隻靈寵再進秘境。" };
  }

  const gate = dungeonGateView(state, dungeonId, now);
  // 已通關：必須先召喚就緒；教學／首通可直打
  if (!sweepInternal && gate.needsSummon && gate.phase !== "ready") {
    return { ok: false, msg: dungeonSummonGateMsg(gate) };
  }

  const dailyPack = ensureDungeonDaily(state);
  const dailyMod = dailyPack?.mod || null;
  const tutWaiveChallenge = tutorialWaivesDungeonChallenge(state, dungeonId);
  const challenge = tutWaiveChallenge ? null : d.challenge || null;
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;

  const chalEval = evaluateDungeonChallenge(state.pets, challenge, {});
  // 強制入口限制：禁屬不符則拒進（教學秘境豁免）；唔再限制出戰隻數
  if (!tutWaiveChallenge && challenge?.banElement) {
    const banned = state.pets.filter((p) => p.elementId === challenge.banElement);
    if (banned.length) {
      const elName = { flame: "焰", gloom: "幽", tide: "潮", stone: "岩", gale: "嵐" }[
        challenge.banElement
      ];
      return { ok: false, msg: `今日挑戰禁${elName || challenge.banElement}屬出戰。` };
    }
  }

  const stageBonus = state.realm * 2;
  const synergy = partySynergy(state.pets);
  const dex = bestiaryStatus(state);
  const sealMult = tideSealCombatMult(state.tideSeals || 0);
  // 秘境唔食潮淵 cosmetic／power node 乘區（潮淵戰鬥自留）
  const atkMult = synergy.atkMult * dex.atkMult * sealMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult;
  const condEval = evaluateDungeonConditions(state.pets, d);
  const passives = condEval.filter((c) => c.passive);
  const challenges = condEval.filter((c) => !c.passive);

  // merge daily elem atk into passives list for mult helper
  const combatPassives = [...passives];
  if (dailyMod?.allyElemAtk) {
    combatPassives.push({
      type: "elem_atk",
      element: dailyMod.allyElemAtk.element,
      mult: dailyMod.allyElemAtk.mult,
      passive: true,
      label: dailyMod.label,
    });
  }

  const allies = [];
  const peNotes = [];
  for (const p of state.pets) {
    const skills = petSkillIds(p);
    const elemMult = dungeonElemAtkMult(combatPassives, p.elementId);
    const gen = petGeneration(p);
    const gMult = genCombatMult(gen);
    const fMult = petFusionCombatMult(p);
    const fAtk = formation.petAtkMult || 1;
    const fHp = formation.petHpMult || 1;
    const fSpd = formation.petSpdMult || 1;
    const pe = personalityCombatForPet(p);
    const pAtk = pe?.atkMult || 1;
    const pHp = pe?.hpMult || 1;
    const pSpd = pe?.spdMult || 1;
    const bm = bloodmarkCombatMult(p.bloodmarks);
    if (pe?.label) peNotes.push(`${displayPetName(p)}：${pe.label}`);
    allies.push({
      side: "ally",
      name: displayPetName(p),
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * elemMult * gMult * fMult * fAtk * pAtk * bm.atk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd * bm.spd),
      isMaster: false,
      elementId: p.elementId,
      skillLevel: p.skillLevel ?? 1,
      secondSkillId: (() => {
        const sid = secondSkillIdForPet(p);
        const unlocked =
          (p.fusionLevel ?? 0) >= SECOND_SKILL_UNLOCK.fusionLevel ||
          (p.level ?? 1) >= SECOND_SKILL_UNLOCK.level;
        return unlocked && sid ? sid : null;
      })(),
      secondSkillLevel: p.secondSkillLevel ?? 1,
      skills,
      skillCd: Object.fromEntries(skills.map((id) => [id, 0])),
      guardTurns: 0,
      atkBuffTurns: 0,
      atkBuffPct: 0,
      generation: gen,
      sustainBias: !!pe?.sustainBias,
    });
  }

  if (!allies.length) {
    return { ok: false, msg: "請先派出至少一隻靈寵再進秘境。" };
  }

  let waveIndex = 0;
  let foes = spawnWaveFoes(waves[0], dailyMod, challenge);
  const roles = countDungeonRoles(waves);

  _combatUid = 0;
  tagCombatUnits(allies, "a");
  tagCombatUnits(foes, "f");
  const transcript = [];
  const combatEvents = [];
  /** 見聞紀錄；不進戰報播放（開戰前條件判定等） */
  const note = (text) => {
    transcript.push(text);
  };
  /** 見聞 + 戰報播放 */
  const say = (text) => {
    transcript.push(text);
    pushCombatText(combatEvents, text);
  };
  const pushWave = (waveIdx, label, foeList) => {
    const waveLine =
      waveIdx === 1
        ? `—— 第 1 波・${label} ——`
        : `—— 第 ${waveIdx} 波・${label} 湧出！——`;
    transcript.push(waveLine);
    combatEvents.push({
      type: "wave",
      text: waveLine,
      waveIndex: waveIdx,
      label,
      foes: foeList.map(unitRosterEntry),
    });
  };
  const pushRound = (r) => {
    const roundLine = `—— 第 ${r} 回合 ——`;
    transcript.push(roundLine);
    combatEvents.push({ type: "round", text: roundLine, round: r });
  };

  const lead =
    state.pets.length > 0
      ? `御靈師率靈寵進入【${d.name}】。（潮克焰→嵐→岩→幽→潮）`
      : `你獨自踏入【${d.name}】，潮霧裡似有靈息。`;
  note(lead);
  note(
    `本關 ${waves.length} 波 · ${roles.total} 敵（普通${roles.normal}／精英${roles.elite}／BOSS${roles.boss}）。`
  );
  note(
    `戰術【${TACTICS[tactics]?.name || tactics}】· 陣型【${formation.name}】· 自動戰鬥。`
  );
  if (challenge?.label) {
    note(
      `${challenge.label}${chalEval.ok ? "（條件已滿足，勝利可領挑戰獎）" : `（${chalEval.reason || "未滿足"}）`}`
    );
  }
  if (dailyMod?.label) note(dailyMod.label);
  const genNotes = state.pets
    .map((p) => {
      const g = petGeneration(p);
      const m = genCombatMult(g);
      return m > 1 ? `${displayPetName(p)}${genLabel(g)}攻血×${m.toFixed(2)}` : null;
    })
    .filter(Boolean);
  if (genNotes.length) note(`血脈代數加成：${genNotes.join("、")}。`);
  if (synergy.labels.length) {
    note(`陣容羈絆發動：${synergy.labels.join("、")}。`);
  }
  if (peNotes.length) {
    note(`性格被動：${peNotes.join("；")}`);
  }
  if ((state.tideSeals || 0) > 0) {
    note(
      `潮印 ×${state.tideSeals}（全隊攻血 ×${tideSealCombatMult(state.tideSeals).toFixed(2)}）。`
    );
  }
  if (dex.label) {
    note(dex.label);
  }
  for (const p of passives) {
    note(p.label);
  }
  for (const c of challenges) {
    note(
      c.ok ? `關卡條件已滿足：${c.label}` : `關卡條件未啟：${c.label}。${c.reason}`
    );
  }
  const trial = dungeonTrialFor(dungeonId);
  const trialCheck = trial ? partyMeetsTrial(state.pets, trial) : null;
  if (trial) {
    note(
      trialCheck.ok
        ? `雜交試煉條件已滿足（${trial.label}）——勝利可領額外獎。`
        : `雜交試煉未啟：${trial.label}。${trialCheck.reason}`
    );
  }
  /* 戰報從第 1 波開始，略過開戰前條件判定 */
  pushWave(1, waves[0].label, foes);
  const combatStart = {
    allies: allies.map(unitRosterEntry),
    foes: foes.map(unitRosterEntry),
  };
  bumpDaily(state, "dungeon", 1);
  let round = 0;
  const maxRounds = 55;
  let won = false;
  let ended = false;
  let bonusStones = 0;
  let bonusScrap = 0;
  let trialStones = 0;
  let trialScrap = 0;
  let condStones = 0;
  let condScrap = 0;
  let condFeed = 0;
  let condDust = 0;
  let roleStones = 0;
  let roleScrap = 0;
  // 僅全勝清關時計；唔喺開戰前預設（敗戰唔應顯示精英／BOSS 獎）
  let eliteCleared = false;
  let bossCleared = false;
  let dailyStoneBonus = 0;
  let dailyScrapBonus = 0;
  let challengeStones = 0;
  let challengeScrap = 0;
  let challengeDust = 0;
  let challengeMet = false;
  /** @type {{ id: string, label: string, ok: boolean, reward: object, bits: string }[]} */
  let conditionResults = [];
  /** @type {string[]} */
  const unlockedSites = [];

  const checkSideDown = () => {
    if (allies.every((a) => a.hp <= 0)) return "lose";
    if (foes.every((f) => f.hp <= 0)) return "wave";
    return null;
  };

  const advanceOrWin = () => {
    if (waveIndex + 1 < waves.length) {
      waveIndex += 1;
      foes = tagCombatUnits(spawnWaveFoes(waves[waveIndex], dailyMod, challenge), "f");
      pushWave(waveIndex + 1, waves[waveIndex].label, foes);
      return false;
    }
    return true;
  };

  while (round < maxRounds && !ended) {
    round += 1;
    pushRound(round);
    const order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));

    for (const actor of order) {
      if (actor.hp <= 0) continue;
      const actions = Math.max(1, actor.actions || 1);
      for (let a = 0; a < actions; a += 1) {
        if (actor.hp <= 0) break;
        const down = checkSideDown();
        if (down) break;
        if (actor.side === "ally") act(actor, allies, foes, transcript, combatEvents, tactics);
        else act(actor, foes, allies, transcript, combatEvents, "balanced");
      }
      tickCooldowns(actor);

      const down = checkSideDown();
      if (down === "lose") {
        ended = true;
        state.winStreak = 0;
        say(`折戟【${d.name}】……退回契壇休養。`);
        break;
      }
      if (down === "wave") {
        if (advanceOrWin()) {
          won = true;
          ended = true;
          break;
        }
        // 新波已進場：本回合剩餘友方可繼續出手（舊敵已死會被跳過）
      }
    }

    if (won && ended) {
      eliteCleared = roles.elite > 0;
      bossCleared = roles.boss > 0;
      state.stones += d.reward.stones;
      state.scrap += d.reward.scrap;
      state.combatsWon += 1;
      state.winStreak = (state.winStreak || 0) + 1;
      if (!state.stats) state.stats = {};
      state.stats.maxWinStreak = Math.max(state.stats.maxWinStreak || 0, state.winStreak);
      const streakBonus = state.winStreak >= 2 ? Math.min(12, (state.winStreak - 1) * 3) : 0;
      if (streakBonus > 0) {
        state.stones += streakBonus;
      }
      bumpDaily(state, "win", 1);
      progressDungeonWinGoals(state);
      dailyStoneBonus = 0;
      dailyScrapBonus = 0;
      let dailyDustBonus = 0;
      let dailyFeedBonus = 0;
      if (dailyMod?.clearStoneBonus) {
        dailyStoneBonus = dailyMod.clearStoneBonus;
        state.stones += dailyStoneBonus;
      }
      if (dailyMod?.clearScrapBonus) {
        dailyScrapBonus = dailyMod.clearScrapBonus;
        state.scrap += dailyScrapBonus;
      }
      if (dailyMod?.clearDustBonus) {
        dailyDustBonus = dailyMod.clearDustBonus;
        state.dust = (state.dust || 0) + dailyDustBonus;
      }
      if (dailyMod?.clearFeedBonus) {
        dailyFeedBonus = dailyMod.clearFeedBonus;
        state.feed = (state.feed || 0) + dailyFeedBonus;
      }
      if (dailyStoneBonus || dailyScrapBonus || dailyDustBonus || dailyFeedBonus) {
        const bits = [];
        if (dailyStoneBonus) bits.push(`+${dailyStoneBonus}石`);
        if (dailyScrapBonus) bits.push(`+${dailyScrapBonus}碎片`);
        if (dailyDustBonus) bits.push(`+${dailyDustBonus}塵`);
        if (dailyFeedBonus) bits.push(`+${dailyFeedBonus}飼`);
        note(`今日修飾結算：${bits.join("／")}。`);
      }
      const first = !state.clearedDungeons[dungeonId];
      if (first && d.firstClearBonus) {
        bonusStones = d.firstClearBonus.stones || 0;
        bonusScrap = d.firstClearBonus.scrap || 0;
        state.stones += bonusStones;
        state.scrap += bonusScrap;
        state.clearedDungeons[dungeonId] = true;
        // 主脊掛機跟 cleared tide；側枝唔提示解鎖潮域
        if (!d.isSideBranch && !isBranchDungeonId(dungeonId)) {
          const stage = spineStageFromState(state);
          pushLog(state, `主脊回響：掛機產出已對齊階段${stage}。`);
        }
        note(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、碎片 ${d.reward.scrap}。首通額外 +${bonusStones} 石／+${bonusScrap} 碎片！`
        );
        // 首通保底潮鑰 1（側枝唔掉潮鑰）
        if (!d.isSideBranch && !isBranchDungeonId(dungeonId)) {
          const keyDrop = rollTideKeyDrop(dungeonId, { guaranteed: true, bossCleared });
          if (keyDrop) {
            addMaterials(state, { [keyDrop.matId]: keyDrop.amount || 1 });
            say(`首通獲【${MATERIALS[keyDrop.matId]?.name || keyDrop.matId}】×1！`);
          }
        }
        if (dungeonId === "tide_3") {
          if (!state.materials) state.materials = emptyMaterials();
          state.materials.fuse_sand = (state.materials.fuse_sand || 0) + 2;
          pushLog(state, "心核已破——融合解鎖；融砂＋2。");
          const lateFuse = maybeStartLateTutorial(state);
          if (lateFuse.started) pushLog(state, lateFuse.msg);
        }
      } else {
        const streakNote = streakBonus > 0 ? ` · 連勝 +${streakBonus} 石` : "";
        note(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、靈晶碎片 ${d.reward.scrap}${streakNote}。`
        );
      }

      // 挑戰獎：banMaster 已強制生效；其餘以出戰評估
      challengeMet = !!(challenge && evaluateDungeonChallenge(state.pets, challenge, {}).ok);
      if (challengeMet && challenge?.bonus) {
        challengeStones = challenge.bonus.stones || 0;
        challengeScrap = challenge.bonus.scrap || 0;
        challengeDust = challenge.bonus.dust || 0;
        applyReward(state, challenge.bonus);
        state.stats.challengeWins = (state.stats.challengeWins || 0) + 1;
        const bits = [];
        if (challengeStones) bits.push(`${challengeStones}石`);
        if (challengeScrap) bits.push(`${challengeScrap}碎片`);
        if (challengeDust) bits.push(`${challengeDust}靈塵`);
        note(`挑戰達成【${challenge.label}】→ +${bits.join("／")}`);
      } else if (challenge) {
        note(`挑戰未達成【${challenge.label}】→ 無挑戰獎`);
      }

      checkAchievements(state);

      if (eliteCleared && d.eliteBonus) {
        roleStones += d.eliteBonus.stones || 0;
        roleScrap += d.eliteBonus.scrap || 0;
        note(
          `擊破精英！額外 +${d.eliteBonus.stones || 0} 石${d.eliteBonus.scrap ? `／+${d.eliteBonus.scrap} 碎片` : ""}。`
        );
      }
      if (bossCleared && d.bossBonus) {
        roleStones += d.bossBonus.stones || 0;
        roleScrap += d.bossBonus.scrap || 0;
        note(
          `擊破 BOSS！額外 +${d.bossBonus.stones || 0} 石${d.bossBonus.scrap ? `／+${d.bossBonus.scrap} 碎片` : ""}。`
        );
      }
      if (roleStones || roleScrap) {
        state.stones += roleStones;
        state.scrap += roleScrap;
      }

      let condHits = 0;
      conditionResults = [];
      for (const c of challenges) {
        const bits = [];
        if (c.bonus?.stones) bits.push(`${c.bonus.stones}石`);
        if (c.bonus?.scrap) bits.push(`${c.bonus.scrap}碎片`);
        if (c.bonus?.feed) bits.push(`${c.bonus.feed}飼料`);
        if (c.bonus?.dust) bits.push(`${c.bonus.dust}靈塵`);
        if (c.ok && c.bonus) {
          condHits += 1;
          condStones += c.bonus.stones || 0;
          condScrap += c.bonus.scrap || 0;
          condFeed += c.bonus.feed || 0;
          condDust += c.bonus.dust || 0;
          applyReward(state, c.bonus);
          note(`條件達成【${c.label}】→ 分開結算 +${bits.join("／")}`);
        } else {
          note(`條件未達成【${c.label}】→ 無額外獎${c.reason ? `（${c.reason}）` : ""}`);
        }
        conditionResults.push({
          id: c.id,
          label: c.label,
          ok: !!c.ok,
          reward: c.bonus || {},
          bits: bits.join("／"),
        });
      }

      if (trial) {
        if (trialCheck?.ok && trial.bonus) {
          trialStones = trial.bonus.stones || 0;
          trialScrap = trial.bonus.scrap || 0;
          state.stones += trialStones;
          state.scrap += trialScrap;
          note(
            `試煉達成【${trial.label}】→ 分開結算 +${trialStones}石${trialScrap ? `／+${trialScrap}碎片` : ""}`
          );
        } else {
          note(
            `試煉未達成【${trial.label}】→ 無額外獎${trialCheck?.reason ? `（${trialCheck.reason}）` : ""}`
          );
        }
      }
      const drop = rollDungeonMatDrop(dungeonId, {
        eliteCleared,
        bossCleared,
        conditionHits: condHits,
      });
      if (drop) {
        addMaterials(state, { [drop.matId]: drop.amount || 1 });
        const mname = MATERIALS[drop.matId]?.name || drop.matId;
        const why = bossCleared ? "（BOSS 掉落加成）" : eliteCleared ? "（精英掉落加成）" : "";
        say(`拾獲【${mname}】×${drop.amount || 1}${why}！`);
      }
      // 潮鑰：高機率、非必然（首通已另給保底；側枝唔掉）
      if (!first && !d.isSideBranch && !isBranchDungeonId(dungeonId)) {
        const keyDrop = rollTideKeyDrop(dungeonId, { bossCleared });
        if (keyDrop) {
          addMaterials(state, { [keyDrop.matId]: keyDrop.amount || 1 });
          say(`獲得【${MATERIALS[keyDrop.matId]?.name || keyDrop.matId}】×1！`);
        } else {
          say("潮霧散去——未掉落潮鑰。");
        }
      }
    }
  }

  if (!ended) {
    say("戰鬥逾時，撤退。");
  }

  // 打完散去：回到待召喚（掃蕩批次內唔清，由 sweep 統一清）
  if (!sweepInternal) {
    clearDungeonSummon(state, dungeonId);
  }

  let encounter = null;
  if (!deferEncounter) {
    const encResult = maybeEncounterAfterDungeon(state, dungeonId, won);
    encounter = encResult.encounter;
    if (encounter) {
      say(
        `潮霧中浮現野生${encounter.name}（${encounter.kind}·${encounter.elementName}·${encounter.personalityName}），成功率約 ${Math.round(encounter.bondRate * 100)}%——可至靈寵頁嘗試契約。`
      );
    } else if (encResult.blocked) {
      say(`待契約欄已滿（${PENDING_BOND_MAX}），未再遇見新靈。`);
    }
  }

  const lines = transcript.slice(0, 80);
  const eventsOut = combatEvents.slice(0, 80);
  const baseStones = won ? d.reward.stones : 0;
  const totalStones = won
    ? baseStones +
      bonusStones +
      trialStones +
      condStones +
      roleStones +
      dailyStoneBonus +
      challengeStones
    : 0;

  const rewardBreakdown = {
    base: { stones: baseStones, scrap: won ? d.reward.scrap : 0 },
    firstClear: { stones: bonusStones, scrap: bonusScrap },
    daily: dailyStoneBonus || dailyScrapBonus
      ? { stones: dailyStoneBonus, scrap: dailyScrapBonus, label: dailyMod?.label || "今日修飾" }
      : null,
    challenge:
      challenge && won
        ? {
            label: challenge.label,
            ok: challengeMet,
            stones: challengeStones,
            scrap: challengeScrap,
            dust: challengeDust,
          }
        : null,
    elite: eliteCleared && d.eliteBonus ? { ...d.eliteBonus } : null,
    boss: bossCleared && d.bossBonus ? { ...d.bossBonus } : null,
    conditions: conditionResults,
    trial: trial
      ? {
          label: trial.label,
          ok: !!(trialCheck && trialCheck.ok),
          stones: trialStones,
          scrap: trialScrap,
        }
      : null,
    totalStones,
  };

  let msg;
  if (won) {
    const parts = [`基礎+${baseStones}石`];
    if (bonusStones) parts.push(`首通+${bonusStones}`);
    if (dailyStoneBonus || dailyScrapBonus) {
      parts.push(`今日+${dailyStoneBonus}石/${dailyScrapBonus}碎`);
    }
    if (challengeMet && challengeStones) parts.push(`挑戰+${challengeStones}`);
    if (roleStones) parts.push(`精／Boss+${roleStones}`);
    for (const c of conditionResults) {
      const short = c.label.replace(/^條件[:：]?\s*/, "");
      parts.push(c.ok ? `${short}✓+${c.bits || "獎"}` : `${short}✗`);
    }
    if (rewardBreakdown.trial) {
      parts.push(rewardBreakdown.trial.ok ? `試煉✓+${rewardBreakdown.trial.stones}石` : "試煉✗");
    }
    msg = `勝利！合計 +${totalStones} 石｜${parts.join(" · ")}`;
  } else if (ended) {
    msg = "戰敗。";
  } else {
    msg = "撤退。";
  }

  return {
    ok: true,
    won,
    rounds: round,
    transcript: lines,
    combatEvents: eventsOut,
    combatStart,
    encounter,
    trialMet: !!(trial && trialCheck?.ok),
    challengeMet,
    waves: waves.length,
    conditionsMet: conditionResults.filter((c) => c.ok).map((c) => c.id),
    rewardBreakdown,
    unlockedSites,
    msg,
  };
}

/** 已通關秘境入場／掃蕩耗潮霧令 */
export function dungeonSweepCost(state, dungeonId, count) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { perRun: 0, total: 0, mats: {}, canAfford: false, label: "" };
  const n = Math.max(1, count | 0);
  const perRun = dungeonEntryTokenPerRun(dungeonId);
  const mats = dungeonEntryMatCost(dungeonId, n);
  const total = mats[DUNGEON_ENTRY_MAT_ID] || 0;
  const have = Math.floor(state.materials?.[DUNGEON_ENTRY_MAT_ID] || 0);
  const name = MATERIALS[DUNGEON_ENTRY_MAT_ID]?.name || "潮霧令";
  return {
    perRun,
    total,
    mats,
    canAfford: have >= total,
    have,
    label: n > 1 ? `${name}×${total}（每場×${perRun}）` : `${name}×${total}`,
  };
}

function emptySummonSlot() {
  return { phase: "idle", readyAt: 0, batch: 1 };
}

function ensureDungeonSummonMap(state) {
  if (!state.dungeonSummon) state.dungeonSummon = {};
  return state.dungeonSummon;
}

/** 同步召喚狀態（凝聚完 → ready） */
export function syncDungeonSummon(state, dungeonId, now = Date.now()) {
  const map = ensureDungeonSummonMap(state);
  let slot = map[dungeonId];
  if (!slot) {
    // 舊存檔：若仍在舊 CD 倒數，轉成凝聚中
    const legacy = (state.dungeonReadyAt || {})[dungeonId] || 0;
    if (legacy > now) {
      slot = { phase: "summoning", readyAt: legacy, batch: 1 };
    } else {
      slot = emptySummonSlot();
    }
    map[dungeonId] = slot;
  }
  if (slot.phase === "summoning" && (slot.readyAt || 0) <= now) {
    slot.phase = "ready";
    slot.readyAt = 0;
  }
  return slot;
}

export function clearDungeonSummon(state, dungeonId) {
  const map = ensureDungeonSummonMap(state);
  map[dungeonId] = emptySummonSlot();
  if (state.dungeonReadyAt) state.dungeonReadyAt[dungeonId] = 0;
}

/**
 * 秘境閘門檢視：idle → summoning → ready →（開戰後）idle
 * 首通／教學：needsSummon=false，可直打
 */
export function dungeonGateView(state, dungeonId, now = Date.now()) {
  const d = resolveDungeon(state, dungeonId);
  const cleared = !!(state.clearedDungeons || {})[dungeonId];
  const tut = tutorialActive(state);
  const needsSummon = cleared && !tut;
  const slot = syncDungeonSummon(state, dungeonId, now);
  const baseCd = d?.cooldownMs || 20_000;
  let phase = needsSummon ? slot.phase || "idle" : "ready";
  if (!needsSummon) phase = "ready";
  const summonLeftMs =
    phase === "summoning" ? Math.max(0, (slot.readyAt || 0) - now) : 0;
  const batch = Math.max(1, slot.batch || 1);
  return {
    needsSummon,
    phase,
    batch,
    summonLeftMs,
    baseCdMs: baseCd,
    canSummon: needsSummon && phase === "idle",
    canChallenge: phase === "ready",
    summoning: phase === "summoning",
  };
}

/** 開始召喚／凝聚秘境（可選連刷場數；令在召喚時扣） */
export function startDungeonSummon(state, dungeonId, count = 1) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (tutorialActive(state)) return { ok: false, msg: "教學期間請直接進攻。" };
  const realmMsg = dungeonRealmGateMsg(state, d);
  if (realmMsg) return { ok: false, msg: realmMsg };
  if (!state.pets?.length) return { ok: false, msg: "請先派出靈寵。" };
  if (!state.clearedDungeons?.[dungeonId]) {
    return { ok: false, msg: "首通無需召喚，直接進攻即可。" };
  }
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase === "summoning") {
    return { ok: false, msg: dungeonSummonGateMsg(gate) };
  }
  if (gate.phase === "ready") {
    return { ok: false, msg: "秘境已就緒，請開始挑戰。" };
  }
  const n = clampDungeonSummonCount(count);
  const cost = dungeonSweepCost(state, dungeonId, n);
  if (!cost.canAfford) {
    return {
      ok: false,
      msg: `潮霧令不足（需 ${cost.total}，現 ${cost.have}）。練功／每日／升階可獲。`,
    };
  }
  if (!spendMaterials(state, cost.mats)) {
    return { ok: false, msg: "潮霧令不足。" };
  }
  const baseCd = d.cooldownMs || 20_000;
  const readyAt = Date.now() + baseCd * n;
  const map = ensureDungeonSummonMap(state);
  map[dungeonId] = { phase: "summoning", readyAt, batch: n };
  if (!state.dungeonReadyAt) state.dungeonReadyAt = {};
  state.dungeonReadyAt[dungeonId] = readyAt;
  const sec = Math.ceil((baseCd * n) / 1000);
  const tokenName = MATERIALS[DUNGEON_ENTRY_MAT_ID]?.name || "潮霧令";
  const msg =
    n > 1
      ? `開始凝聚【${d.name}】×${n}（耗${tokenName}×${cost.total} · 約 ${sec}s）`
      : `開始凝聚【${d.name}】（耗${tokenName}×${cost.total} · 約 ${sec}s）`;
  pushLog(state, msg);
  return { ok: true, msg, readyAt, batch: n, tokenCost: cost.total };
}

export function canDungeonSweep(state, dungeonId, count = null) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { ok: false, reason: "秘境不存在。" };
  if (tutorialActive(state)) return { ok: false, reason: "教學期間請單次進攻。" };
  const realmMsg = dungeonRealmGateMsg(state, d);
  if (realmMsg) return { ok: false, reason: realmMsg };
  if (!state.pets?.length) return { ok: false, reason: "請先派出靈寵。" };
  if (!state.clearedDungeons?.[dungeonId]) return { ok: false, reason: "需先通關本層。" };
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase === "summoning") {
    return { ok: false, reason: dungeonSummonGateMsg(gate) };
  }
  // idle：可發起召喚連刷；ready：batch 須吻合
  if (gate.phase === "ready") {
    if (count != null && gate.batch !== count) {
      return { ok: false, reason: `已就緒批次為 ×${gate.batch}` };
    }
    return { ok: true, cost: { total: 0, mats: {}, canAfford: true, label: "已就緒" }, ready: true };
  }
  if (count != null) {
    const cost = dungeonSweepCost(state, dungeonId, count);
    if (!cost.canAfford) {
      return {
        ok: false,
        reason: `潮霧令不足（需 ${cost.total}，現 ${cost.have}）`,
        cost,
      };
    }
    return { ok: true, cost, ready: false };
  }
  return { ok: true, ready: false };
}

function aggregateSweepRewards(results) {
  let totalStones = 0;
  let totalScrap = 0;
  let wins = 0;
  let losses = 0;
  const perRun = [];
  for (const r of results) {
    if (r.won) wins += 1;
    else losses += 1;
    const bd = r.rewardBreakdown;
    const stones = bd?.totalStones || 0;
    const scrap = bd?.base?.scrap || 0;
    totalStones += stones;
    totalScrap += scrap;
    perRun.push({ won: r.won, stones, scrap });
  }
  return { totalStones, totalScrap, wins, losses, runs: results.length, perRun };
}

/**
 * 已通關層連刷：須先召喚就緒（batch=N）；開戰時唔再扣令。
 * tokenCost 回報本批召喚已耗令（召喚時已扣），俾結算 UI 誠實顯示。
 */
export function runDungeonSweep(state, dungeonId, count) {
  const n = clampDungeonSummonCount(count);
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase !== "ready" || gate.batch !== n) {
    return { ok: false, msg: "請先召喚對應場數並等待潮霧凝聚完成。" };
  }
  const check = canDungeonSweep(state, dungeonId, n);
  if (!check.ok) return { ok: false, msg: check.reason };
  const tokenCost = dungeonEntryTokenPerRun(dungeonId) * n;
  const results = [];
  for (let i = 0; i < n; i += 1) {
    const r = runDungeon(state, dungeonId, { sweepInternal: true, deferEncounter: true });
    if (!r.ok) {
      if (results.length === 0) return r;
      break;
    }
    results.push(r);
  }
  if (!results.length) return { ok: false, msg: "掃蕩失敗。" };
  clearDungeonSummon(state, dungeonId);
  const d = resolveDungeon(state, dungeonId);
  const agg = aggregateSweepRewards(results);
  let encounter = null;
  let encounterBlocked = false;
  if (agg.wins > 0) {
    const encResult = maybeEncounterAfterDungeon(state, dungeonId, true);
    encounter = encResult.encounter;
    encounterBlocked = encResult.blocked;
    if (encounter) {
      pushLog(
        state,
        `掃蕩後潮霧遇見【${encounter.name}】（${encounter.kind}·${encounter.elementName}）— 可至待契嘗試結契。`
      );
    }
  }
  const tokenName = MATERIALS[DUNGEON_ENTRY_MAT_ID]?.name || "潮霧令";
  const msg = `掃蕩 ${agg.runs} 次：勝 ${agg.wins}／敗 ${agg.losses} · 合計 +${agg.totalStones} 石 · 本批召喚已耗${tokenName}×${tokenCost} · 秘境已散去`;
  pushLog(state, msg);
  return {
    ok: true,
    won: agg.wins > 0,
    sweep: true,
    count: agg.runs,
    wins: agg.wins,
    losses: agg.losses,
    totalStones: agg.totalStones,
    totalScrap: agg.totalScrap,
    stoneCost: 0,
    tokenCost,
    cooldownMs: 0,
    perRun: agg.perRun,
    encounter,
    encounterBlocked,
    dungeonId,
    dungeonName: d?.name || dungeonId,
    msg,
  };
}

export function dungeonStatus(state, dungeonId) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return null;
  const now = Date.now();
  const gate = dungeonGateView(state, dungeonId, now);
  const trial = dungeonTrialFor(dungeonId) || null;
  const trialCheck = trial ? partyMeetsTrial(state.pets, trial) : null;
  const waves = dungeonWaves(d);
  const roles = countDungeonRoles(waves);
  const condEval = evaluateDungeonConditions(state.pets, d);
  const daily = dungeonDailyView(state);
  const tutWaive = tutorialWaivesDungeonChallenge(state, dungeonId);
  const chalEval = evaluateDungeonChallenge(state.pets, d.challenge, {});
  return {
    cleared: !!(state.clearedDungeons || {})[dungeonId],
    cooldownLeftMs: gate.summonLeftMs,
    gate,
    firstClearBonus: d.firstClearBonus || null,
    trial,
    trialMet: trialCheck ? trialCheck.ok : false,
    trialReason: trialCheck?.reason || "",
    waves,
    roles,
    conditions: condEval,
    eliteBonus: d.eliteBonus || null,
    bossBonus: d.bossBonus || null,
    dailyMod: daily,
    challenge: d.challenge || null,
    challengeMet: tutWaive ? true : chalEval.ok,
    challengeReason: tutWaive ? "教學豁免" : chalEval.reason || "",
    challengeWaived: tutWaive,
    dailyVariantLabel: d.dailyVariantLabel || null,
  };
}

/** 催生符：將最早孕育中的交配立即就緒（可領全部剩餘蛋） */
export function useBreedTicket(state) {
  if ((state.materials?.breed_ticket || 0) < 1) {
    return { ok: false, msg: "沒有催生符。" };
  }
  ensureBreedJobs(state);
  const now = Date.now();
  const gestating = state.breedJobs
    .filter((j) => !j.claimed && (j.readyAt || 0) > now)
    .sort((a, b) => (a.readyAt || 0) - (b.readyAt || 0));
  if (!gestating.length) {
    return { ok: false, msg: "目前沒有孕育中的交配。" };
  }
  state.materials.breed_ticket -= 1;
  const job = gestating[0];
  job.readyAt = now;
  if (Array.isArray(job.cycles)) {
    for (const c of job.cycles) {
      if ((c.readyAt || 0) > now) c.readyAt = now;
    }
  }
  pushLog(state, `使用催生符，【${job.names?.join("×") || "交配"}】提前就緒。`);
  return { ok: true, msg: "交配已就緒，可領取蛋" };
}

/** 血統催化：縮短最早孕育中交配剩餘時間一半 */
export function useBloodCatalyst(state) {
  if ((state.materials?.blood_catalyst || 0) < 1) {
    return { ok: false, msg: "沒有血統催化。" };
  }
  ensureBreedJobs(state);
  const now = Date.now();
  const gestating = state.breedJobs
    .filter((j) => !j.claimed && (j.readyAt || 0) > now)
    .sort((a, b) => (a.readyAt || 0) - (b.readyAt || 0));
  if (!gestating.length) {
    return { ok: false, msg: "目前沒有孕育中的交配。" };
  }
  const job = gestating[0];
  const left = Math.max(0, (job.readyAt || 0) - now);
  state.materials.blood_catalyst -= 1;
  const newReady = now + Math.floor(left / 2);
  job.readyAt = newReady;
  if (Array.isArray(job.cycles)) {
    for (const c of job.cycles) {
      if ((c.readyAt || 0) > now) {
        c.readyAt = now + Math.floor(Math.max(0, (c.readyAt || 0) - now) / 2);
      }
    }
  }
  pushLog(state, `使用血統催化，【${job.names?.join("×") || "交配"}】孕育時間減半。`);
  return { ok: true, msg: "孕育時間減半" };
}

/** 性格洗劑：重抽主性格（耗 1） */
export function useTemperOil(state, uid) {
  if ((state.materials?.temper_oil || 0) < 1) {
    return { ok: false, msg: "沒有性格洗劑。" };
  }
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const oldId = pet.personalityId;
  const newId = pickMainPersonalityId(oldId);
  const oldPe = MAIN_PERSONALITIES[oldId] || MAIN_PERSONALITIES[remapSafe(oldId)];
  const newPe = MAIN_PERSONALITIES[newId];
  if (!newPe) return { ok: false, msg: "無可替換性格。" };
  state.materials.temper_oil -= 1;
  /* 主性格只影響戰鬥；唔再重算白板 */
  pet.personalityId = newId;
  pet.personalityName = newPe.name;
  if (pet.genes) {
    pet.genes = { ...pet.genes, personality: newId };
  }
  registerBestiary(state, pet);
  pushLog(state, `【${displayPetName(pet)}】使用性格洗劑：${oldPe?.name || oldId} → ${newPe.name}。`);
  return { ok: true, msg: `${pet.name} 主性格 → ${newPe.name}` };
}

function remapSafe(id) {
  return MAIN_PERSONALITIES[id] ? id : pickMainPersonalityId();
}

/** 副性格覺醒（Lv≥20）；回溯補算成長差額 */
export function awakenSubPersonality(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  if (pet.personality2Awakened) return { ok: false, msg: "副性格已覺醒。" };
  const lv = pet.level ?? 1;
  if (lv < SUB_PERSONALITY_AWAKEN_LEVEL) {
    return { ok: false, msg: `需達到 Lv.${SUB_PERSONALITY_AWAKEN_LEVEL} 方可覺醒副性格。` };
  }
  const subId =
    (pet.genes?.personality2 && SUB_PERSONALITIES[pet.genes.personality2]
      ? pet.genes.personality2
      : null) || pickSubPersonalityId();
  const sub = SUB_PERSONALITIES[subId];
  if (!sub) return { ok: false, msg: "副性格池異常。" };
  const bonus = retroactiveSubGrowthBonus({ ...pet, personality2Id: subId }, subId);
  pet.personality2Id = subId;
  pet.personality2Name = sub.name;
  pet.personality2Awakened = true;
  if (!pet.genes) pet.genes = {};
  pet.genes = { ...pet.genes, personality2: subId };
  pet.atk = ceilStat((pet.atk || 0) + bonus.atk);
  pet.hp = ceilStat((pet.hp || 0) + bonus.hp);
  pet.spd = ceilStat((pet.spd || 0) + bonus.spd);
  pushLog(
    state,
    `【${displayPetName(pet)}】副性格覺醒為「${sub.name}」（回溯成長 攻${bonus.atk >= 0 ? "+" : ""}${ceilStat(bonus.atk)} 血${bonus.hp >= 0 ? "+" : ""}${ceilStat(bonus.hp)} 速${bonus.spd >= 0 ? "+" : ""}${ceilStat(bonus.spd)}）。`
  );
  return {
    ok: true,
    msg: `${pet.name} 覺醒副性格「${sub.name}」`,
    pet,
    bonus,
  };
}

function ensureLoginStreak(state, now = Date.now()) {
  if (!state.loginStreak) state.loginStreak = emptyLoginStreak(now);
  const ls = state.loginStreak;
  const today = todayKey(now);
  if (ls.lastLoginDate === today) return ls;
  const yesterday = yesterdayKey(now);
  if (ls.lastLoginDate === yesterday) {
    ls.streakDay = Math.min(7, (ls.streakDay || 0) + 1);
  } else {
    ls.streakDay = 1;
  }
  ls.lastLoginDate = today;
  return ls;
}

export function loginStreakView(state, now = Date.now()) {
  ensureLoginStreak(state, now);
  const ls = state.loginStreak;
  const today = todayKey(now);
  const day = Math.max(1, ls.streakDay || 1);
  const reward = LOGIN_STREAK_REWARDS[(day - 1) % LOGIN_STREAK_REWARDS.length];
  return {
    day,
    reward,
    canClaim: ls.claimedDate !== today,
    claimedToday: ls.claimedDate === today,
    rewards: LOGIN_STREAK_REWARDS,
  };
}

export function claimLoginStreak(state, now = Date.now()) {
  ensureLoginStreak(state, now);
  const ls = state.loginStreak;
  const today = todayKey(now);
  if (ls.claimedDate === today) return { ok: false, msg: "今日登入獎已領取。" };
  const view = loginStreakView(state, now);
  const entry = view.reward;
  applyReward(state, entry.reward);
  if (entry.reward.eggTier) {
    if (!state.eggs) state.eggs = [];
    if (state.eggs.length < EGG_CAP) {
      state.eggs.push(makeEgg(entry.reward.eggTier, "login_streak"));
    } else {
      state.stones = (state.stones || 0) + 50;
    }
  }
  ls.claimedDate = today;
  pushLog(state, `連續登入第 ${view.day} 日【${entry.name}】獎勵已領取。`);
  return { ok: true, msg: `第 ${view.day} 日登入獎【${entry.name}】已領！` };
}

function goalNavForBreakthroughItem(item) {
  if (item.kind === "qi" || item.id?.startsWith("cost_")) {
    return { tab: "cultivate", sub: item.kind === "qi" ? "train" : "advance" };
  }
  const label = item.label || "";
  if (label.includes("秘境") || label.includes("勝場") || label.includes("通關")) {
    return { tab: "dungeon", sub: "field" };
  }
  if (label.includes("繁殖") || label.includes("代寵") || label.includes("雜交")) {
    return { tab: "party", sub: "breed" };
  }
  if (label.includes("融合")) {
    return { tab: "party", sub: "ranch" };
  }
  if (label.includes("圖鑑")) {
    return { tab: "codex", sub: "dex" };
  }
  if (label.includes("契約")) {
    return { tab: "party", sub: "bond" };
  }
  return { tab: "cultivate", sub: "advance" };
}

function goalNavForPathQuest(q) {
  if (q.type === "combats" || q.type === "cleared") return { tab: "dungeon", sub: "field" };
  if (q.type === "bestiary") return { tab: "codex", sub: "dex" };
  if (q.type === "breeds" || q.type === "hybrid_owned" || q.type === "min_gen" || q.type === "tertiary_owned") {
    return { tab: "party", sub: "breed" };
  }
  return { tab: "codex", sub: "path" };
}

/** 下一個短期目標（突破門檻或求道） */
export function nextGoalView(state) {
  const bt = breakthroughView(state);
  if (!bt.ready) {
    const pending = bt.items.filter((i) => !i.ok);
    if (pending.length) {
      const first = pending[0];
      const nav = goalNavForBreakthroughItem(first);
      return {
        kind: "breakthrough",
        title: `突破【${bt.next.name}】`,
        label: first.label,
        progress: first.progress,
        targetName: bt.next.name,
        ...nav,
      };
    }
  }
  for (const q of PATH_QUESTS) {
    if (state.pathQuests?.claimed?.[q.id]) continue;
    const ev = evalPathQuest(state, q);
    if (!ev.ok) {
      const nav = goalNavForPathQuest(q);
      return {
        kind: "path",
        title: `求道 · ${q.trackName}`,
        label: q.name,
        progress: ev.progress,
        desc: q.desc,
        questId: q.id,
        ...nav,
      };
    }
  }
  return null;
}

export function dismissDailyHub(state) {
  ensureDaily(state);
  state.daily.hubDismissed = true;
  return state;
}

/** 每日登入儀表板資料 */
export function dailyHubView(state, now = Date.now()) {
  ensureDaily(state, now);
  ensureLoginStreak(state, now);
  const dailies = dailyView(state);
  const dailyDone = dailies.filter((q) => q.done).length;
  const eggs = eggsView(state, now);
  const eggTimers = eggs
    .filter((e) => e.hatching && !e.ready)
    .map((e) => ({
      tier: e.name || e.label,
      secLeft: e.leftSec,
    }));
  const eggReady = eggs.filter((e) => e.ready).length;
  const dispatchData = dispatchView(state);
  const dispatchActive = dispatchData.active || [];
  const dispatchReady = dispatchActive.filter((d) => d.ready).length;
  const dispatchTimers = dispatchActive
    .filter((d) => !d.ready)
    .map((d) => ({
      name: d.missionName,
      secLeft: Math.ceil(d.leftMs / 1000),
    }));
  const dailyMod = dungeonDailyView(state);
  const spotlight = trainDailySpotlightView(todayKey(now));
  const streak = loginStreakView(state, now);
  const nextGoal = nextGoalView(state);
  const offline = offlineBankView(state).hasPending
    ? {
        sec: state.offlineBank.sec || 0,
        qi: state.offlineBank.qi || 0,
        feed: state.offlineBank.feed || 0,
        dust: state.offlineBank.dust || 0,
        materials: { ...(state.offlineBank.materials || {}) },
        siteName: state.offlineBank.siteName || null,
        capped: !!state.offlineBank.capped,
        pending: true,
      }
    : state.offlineHint;
  const idleSec = state.daily?.idleSec || 0;
  const idleDailyCap = 180;
  const allClear = dailyAllClearView(state);
  return {
    shouldShow: !state.daily.hubDismissed,
    dailyDone,
    dailyTotal: dailies.length,
    dailyClaimed: allClear.claimed,
    dailyClaimable: allClear.claimable,
    allClearClaimed: allClear.allClearClaimed,
    canClaimAllClear: allClear.canClaimAllClear,
    eggTimers,
    eggReady,
    dispatchReady,
    dispatchTimers,
    dailyModLabel: dailyMod?.label || null,
    spotlightName: spotlight?.siteName || null,
    streak,
    nextGoal,
    offline,
    idleSec,
    idleDailyCap,
    idleDailyDone: idleSec >= idleDailyCap,
  };
}

export function pathQuestsView(state) {
  if (!state.pathQuests) state.pathQuests = emptyPathQuests();
  const claimed = state.pathQuests.claimed || {};
  const tracks = {};
  for (const q of PATH_QUESTS) {
    if (!tracks[q.track]) {
      tracks[q.track] = { track: q.track, trackName: q.trackName, items: [] };
    }
    const ev = evalPathQuest(state, q);
    tracks[q.track].items.push({
      ...q,
      ...ev,
      claimed: !!claimed[q.id],
      canClaim: ev.ok && !claimed[q.id],
    });
  }
  return Object.values(tracks);
}

export function claimPathQuest(state, questId) {
  if (!state.pathQuests) state.pathQuests = emptyPathQuests();
  const q = PATH_QUESTS.find((x) => x.id === questId);
  if (!q) return { ok: false, msg: "目標不存在。" };
  if (state.pathQuests.claimed[questId]) return { ok: false, msg: "已領取。" };
  const ev = evalPathQuest(state, q);
  if (!ev.ok) return { ok: false, msg: `未達標（${ev.progress}）。` };
  state.pathQuests.claimed[questId] = true;
  applyReward(state, q.reward);
  const bits = [];
  if (q.reward.stones) bits.push(`${q.reward.stones}石`);
  if (q.reward.scrap) bits.push(`${q.reward.scrap}碎片`);
  if (q.reward.materials) {
    for (const [id, n] of Object.entries(q.reward.materials)) {
      bits.push(`${MATERIALS[id]?.name || id}×${n}`);
    }
  }
  pushLog(state, `求道【${q.name}】達成，獲 ${bits.join("／")}。`);
  return { ok: true, msg: `領取 ${bits.join("／")}` };
}

/**
 * 舊存檔：breedReadyAt／breedPair → breedJobs 佇列
 * （舊邏輯即出子代＋冷卻；遷移後只保留冷卻展示，唔再補產）
 */
function migrateBreedJobs(parsed) {
  if (Array.isArray(parsed.breedJobs) && parsed.breedJobs.length) {
    return parsed.breedJobs.map((j) => ({ ...j }));
  }
  const readyAt = parsed.breedReadyAt || 0;
  const pair = parsed.breedPair;
  if (pair && readyAt > Date.now()) {
    return [
      {
        id: `legacy-breed-${readyAt}`,
        uids: pair.uids || [],
        names: pair.names || [],
        readyAt,
        startedAt: readyAt - BREED_COOLDOWN_MS,
        genes: null,
        claimed: true,
        legacy: true,
      },
    ];
  }
  return [];
}

function ensureBreedJobs(state) {
  if (!Array.isArray(state.breedJobs)) state.breedJobs = migrateBreedJobs(state);
  return state.breedJobs;
}

/** 正在交配／待領的雙親 uid */
export function breedBusyUids(state) {
  ensureBreedJobs(state);
  const set = new Set();
  for (const j of state.breedJobs) {
    if (j.claimed || j.legacy) continue;
    for (const uid of j.uids || []) if (uid) set.add(uid);
  }
  return set;
}

function scaleMatCost(mats, n) {
  const out = {};
  for (const [id, v] of Object.entries(mats || {})) {
    if (!v) continue;
    out[id] = (v | 0) * n;
  }
  return out;
}

/** 進行中交配尚待領取的蛋數（未領週期） */
function breedPendingEggCount(state) {
  ensureBreedJobs(state);
  let n = 0;
  for (const j of state.breedJobs) {
    if (j.claimed || j.legacy) continue;
    const batch = Math.max(1, j.batch || 1);
    const claimed = Math.max(0, j.claimedCycles || 0);
    n += Math.max(0, batch - claimed);
  }
  return n;
}

/** 交配開始時快照雙親（領蛋唔再依賴雙親仍在場） */
function snapshotBreedParent(p) {
  return {
    uid: p.uid,
    name: displayPetName(p),
    kind: p.kind,
    speciesId: p.speciesId,
    elementId: p.elementId,
    personalityId: p.personalityId,
    atk: p.atk,
    hp: p.hp,
    spd: p.spd,
  };
}

/** 用雙親（或快照）＋genes 結算天生／覺醒 */
function computeBreedEggOutcomeFromParents(a, b, genes, job) {
  const g = genes || job?.genes;
  if (!a || !b || !g) return { ok: false, msg: "交配資料缺失，無法領取蛋。" };
  const born = breedStatInheritance(a, b, g);
  const awaken = genAwakenBonus(g.generation);
  const bornBonus = {
    atk: (born.atk || 0) + (awaken?.atk || 0),
    hp: (born.hp || 0) + (awaken?.hp || 0),
    spd: (born.spd || 0) + (awaken?.spd || 0),
  };
  return {
    ok: true,
    genes: g,
    bornBonus,
    awakenSkillLevel: awaken?.skillLevel || null,
    awaken,
    born,
    parentUids: [a.uid || job?.uids?.[0], b.uid || job?.uids?.[1]].filter(Boolean),
    parentNames: [
      a.name || displayPetName(a) || job?.names?.[0] || "？",
      b.name || displayPetName(b) || job?.names?.[1] || "？",
    ],
    kind: SPECIES[g.species]?.kind || a.kind,
  };
}

/**
 * 單次交配結果：優先用開始交配時預存嘅天生；否則用快照／在場雙親。
 * （genes 於開始交配時已 roll；舊 job 兼容現場結算）
 */
function prepareBreedEggOutcome(state, job, genes, cycle = null) {
  const g = genes || cycle?.genes || job.genes;
  if (cycle?.bornBonus && g) {
    return {
      ok: true,
      genes: g,
      bornBonus: cycle.bornBonus,
      awakenSkillLevel: cycle.awakenSkillLevel || null,
      awaken: cycle.awaken || null,
      born: cycle.born || null,
      parentUids: job.uids || [],
      parentNames: job.names || [],
      kind: cycle.kind || SPECIES[g.species]?.kind || "獸",
    };
  }
  const [uidA, uidB] = job.uids || [];
  const liveA = findOwnedPet(state, uidA)?.pet;
  const liveB = findOwnedPet(state, uidB)?.pet;
  const a = liveA || job.parentSnap?.[0] || null;
  const b = liveB || job.parentSnap?.[1] || null;
  return computeBreedEggOutcomeFromParents(a, b, g, job);
}

function applyBreedEggClaimStats(state, egg, genes, parents) {
  if (!state.stats) {
    state.stats = {
      bonds: 0,
      fusions: 0,
      breeds: 0,
      releases: 0,
      bondAttempts: 0,
      hybrids: 0,
      legendBreeds: 0,
    };
  }
  state.stats.breeds += 1;
  const [a, b] = parents || [];
  if (a && b && a.kind !== b.kind) bumpBreedGoalProgress(state, "daily_hybrid", 1);
  const synthetic = {
    speciesId: genes.species,
    generation: genes.generation,
    name: egg.name,
  };
  progressBreedGoalsFromChild(state, synthetic, genes);
  bumpDaily(state, "breed", 1);
}

/**
 * 開始交配（似秘境召喚）：扣費進佇列，孕育完領蛋（再孵化出寵）。
 * count＝1–10 倍率：同對連產，時長×N、費用×N；可中途領已完成週期的蛋。
 */
export function tryBreed(state, uidA, uidB, count = 1) {
  if (!uidA || !uidB || uidA === uidB) {
    return { ok: false, msg: "請選擇兩隻不同的牧場靈寵。" };
  }
  const batch = clampBreedBatchCount(count);
  ensureBreedJobs(state);
  const active = state.breedJobs.filter((j) => !j.claimed && !j.legacy);
  if (active.length >= BREED_QUEUE_MAX) {
    return { ok: false, msg: `交配欄已滿（${BREED_QUEUE_MAX}）。先領取就緒蛋或等孕育完成。` };
  }
  if (!state.ranch) state.ranch = [];
  if (!state.eggs) state.eggs = [];
  const stoneCost = BREED_STONE_COST * batch;
  if (state.stones < stoneCost) {
    return { ok: false, msg: `靈石不足（需 ${stoneCost}）。` };
  }

  const a = state.ranch.find((p) => p.uid === uidA);
  const b = state.ranch.find((p) => p.uid === uidB);
  if (!a || !b) return { ok: false, msg: "雙親必須都在牧場待命。" };
  const dispatchBusy = dispatchBusyUids(state);
  if (dispatchBusy.has(uidA) || dispatchBusy.has(uidB)) {
    return { ok: false, msg: "派遣中的靈寵不能交配。" };
  }
  const matingBusy = breedBusyUids(state);
  if (matingBusy.has(uidA) || matingBusy.has(uidB)) {
    return { ok: false, msg: "雙親已在其他交配中。" };
  }
  const unitMat = breedMatCost(petGeneration(a), petGeneration(b));
  const matCost = scaleMatCost(unitMat, batch);
  if (!spendMaterials(state, matCost)) {
    const sh = shortageHint(state, matCost);
    return {
      ok: false,
      msg: `材料不足（需 ${formatMats(matCost)}）${sh.hint ? `｜${sh.hint}` : ""}。`,
      suggest: sh.suggest,
    };
  }

  const now = Date.now();
  const cdMult = rarityBreedCdMult(a, b);
  const cycleMs = Math.round(BREED_COOLDOWN_MS * cdMult);
  const parentSnap = [snapshotBreedParent(a), snapshotBreedParent(b)];
  /** 每週期預 roll genes，並即時結算天生（領蛋唔依賴雙親仍在） */
  const cycles = [];
  for (let i = 0; i < batch; i++) {
    const genes = rollBreedGenes(a, b);
    const prep = computeBreedEggOutcomeFromParents(a, b, genes, {
      uids: [a.uid, b.uid],
      names: [displayPetName(a), displayPetName(b)],
    });
    cycles.push({
      genes,
      readyAt: now + cycleMs * (i + 1),
      bornBonus: prep.bornBonus,
      awakenSkillLevel: prep.awakenSkillLevel,
      awaken: prep.awaken,
      born: prep.born,
      kind: prep.kind,
    });
  }
  state.stones -= stoneCost;
  const readyAt = now + cycleMs * batch;
  const job = {
    id: `breed-${now}-${Math.floor(Math.random() * 9999)}`,
    uids: [a.uid, b.uid],
    names: [displayPetName(a), displayPetName(b)],
    parentSnap,
    startedAt: now,
    readyAt,
    batch,
    cycleMs,
    claimedCycles: 0,
    cycles,
    genes: cycles[0]?.genes || null,
    claimed: false,
  };
  state.breedJobs.push(job);
  state.breedReadyAt = readyAt;
  state.breedPair = { uids: job.uids, names: job.names, readyAt };

  const matNote = formatMats(matCost);
  const sec = Math.ceil((cycleMs * batch) / 1000);
  pushLog(
    state,
    `開始交配×${batch}：${job.names[0]} × ${job.names[1]}（孕育約 ${sec}s｜耗 ${stoneCost} 石${matNote ? `／${matNote}` : ""}）。`
  );
  return {
    ok: true,
    msg:
      batch > 1
        ? `交配×${batch} 開始 · 約 ${sec}s 全數就緒（可中途領蛋）（${active.length + 1}/${BREED_QUEUE_MAX}）`
        : `交配開始 · ${sec}s 後可領蛋（${active.length + 1}/${BREED_QUEUE_MAX}）`,
    job,
    started: true,
    batch,
  };
}

/** 領取已完成週期的交配蛋（可中途領；剩餘繼續孕育） */
export function claimBreed(state, jobId) {
  ensureBreedJobs(state);
  if (!state.eggs) state.eggs = [];
  const job = state.breedJobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, msg: "找不到這次交配。" };
  if (job.claimed || job.legacy) return { ok: false, msg: "已領取過。" };
  const now = Date.now();
  const batch = Math.max(1, job.batch || 1);
  let claimedCycles = Math.max(0, job.claimedCycles || 0);
  if (!Array.isArray(job.cycles) || job.cycles.length < batch) {
    /* 舊存檔：單 genes → 補成一週期 */
    const g = job.genes || null;
    job.cycles = Array.from({ length: batch }, (_, i) => ({
      genes: g,
      readyAt: (job.startedAt || job.readyAt - BREED_COOLDOWN_MS) + BREED_COOLDOWN_MS * (i + 1),
    }));
  }
  let completed = 0;
  for (let i = claimedCycles; i < batch; i++) {
    const c = job.cycles[i];
    if ((c?.readyAt || job.readyAt || 0) <= now) completed += 1;
    else break;
  }
  if (completed <= 0) {
    const nextAt = job.cycles[claimedCycles]?.readyAt || job.readyAt || now;
    const sec = Math.ceil((nextAt - now) / 1000);
    return { ok: false, msg: `仍在孕育（${sec}s）。` };
  }
  const freeSlots = Math.max(0, EGG_CAP - state.eggs.length);
  if (freeSlots <= 0) {
    return { ok: false, msg: `蛋欄已滿（${EGG_CAP}），先孵化或清理再領。` };
  }
  const take = Math.min(completed, freeSlots);
  const [uidA, uidB] = job.uids || [];
  const parentA = findOwnedPet(state, uidA)?.pet;
  const parentB = findOwnedPet(state, uidB)?.pet;
  const eggs = [];
  let celebrate = false;
  let lastGenes = null;
  for (let i = 0; i < take; i++) {
    const cycle = job.cycles[claimedCycles + i];
    const prep = prepareBreedEggOutcome(state, job, cycle?.genes, cycle);
    if (!prep.ok) return prep;
    const egg = makeBreedEgg(prep, now + i);
    state.eggs.push(egg);
    eggs.push(egg);
    const snapA = job.parentSnap?.[0] || parentA;
    const snapB = job.parentSnap?.[1] || parentB;
    applyBreedEggClaimStats(state, egg, prep.genes, [parentA || snapA, parentB || snapB]);
    lastGenes = prep.genes;
    if (
      prep.genes.hybrid ||
      prep.genes.rarityUp ||
      prep.genes.rarity >= 2 ||
      prep.genes.generation >= 2 ||
      prep.awaken?.label
    ) {
      celebrate = true;
    }
  }
  claimedCycles += take;
  job.claimedCycles = claimedCycles;
  if (claimedCycles >= batch) {
    job.claimed = true;
    state.breedJobs = state.breedJobs.filter((j) => !j.claimed && !j.legacy);
  }
  const open = state.breedJobs.filter((j) => !j.claimed);
  if (!open.length) {
    state.breedReadyAt = 0;
    state.breedPair = null;
  } else {
    const next = open.reduce((a, b) => ((a.readyAt || 0) <= (b.readyAt || 0) ? a : b));
    state.breedReadyAt = next.readyAt || 0;
    state.breedPair = { uids: next.uids, names: next.names, readyAt: next.readyAt };
  }
  checkAchievements(state);
  const names = eggs.map((e) => e.name).join("、");
  const partialNote =
    take < completed ? `（蛋欄僅餘 ${freeSlots}，尚有 ${completed - take} 枚可領）` : "";
  const remain = batch - claimedCycles;
  pushLog(
    state,
    `領取交配蛋×${take}：${job.names?.[0] || "？"} × ${job.names?.[1] || "？"} → ${names}${
      remain > 0 ? `（尚餘 ${remain} 週期）` : ""
    }。`
  );
  return {
    ok: true,
    msg: `領取蛋×${take}：${names}${partialNote}`,
    eggs,
    egg: eggs[0],
    claimedCount: take,
    remainCycles: remain,
    celebrate,
    mutated: lastGenes?.mutated,
    hybrid: lastGenes?.hybrid,
    rarity: lastGenes?.rarity,
    rarityUp: lastGenes?.rarityUp,
    generation: lastGenes?.generation,
  };
}

/** UI：繁殖預覽（不 roll，只估算） */
export function breedPreview(petA, petB) {
  const base = breedPairHint(petA, petB);
  if (!base) return null;
  const genMult = genPowerMult(base.genA, base.genB);
  const elemRate = Math.min(0.35, BREED_ELEMENT_MUTATION_RATE * genMult);
  const matCost = breedMatCost(base.genA, base.genB);
  const odds = childGenerationOdds(base.genA, base.genB);
  const loGen = Math.min(...odds.map((o) => o.gen));
  const hiGen = Math.max(...odds.map((o) => o.gen));
  const parentMaxRarity = Math.max(petA.rarity ?? 0, petB.rarity ?? 0);
  const statLo = breedStatInheritancePreview(petA, petB, {
    rarity: parentMaxRarity,
    generation: loGen,
    hybrid: !!base.hybridName,
  });
  const statHi = breedStatInheritancePreview(petA, petB, {
    rarity: parentMaxRarity,
    generation: hiGen,
    hybrid: !!base.hybridName,
  });
  const loAwaken = genAwakenBonus(loGen);
  const hiAwaken = genAwakenBonus(hiGen);

  const outcomes = [];
  if (base.sameSpecies) {
    outcomes.push({
      label: `同種【${SPECIES[petA.speciesId]?.name || petA.name}】`,
      pct: null,
      kind: "same",
    });
  } else if (base.recipeOutcomes?.length) {
    for (const o of base.recipeOutcomes) {
      const tag =
        o.tier === "tertiary" ? "三代" : o.tier === "sub" ? "次配方" : "主配方";
      outcomes.push({
        label: `${tag}【${o.name}】`,
        pct: o.pct,
        kind: o.tier === "tertiary" ? "tertiary" : o.tier === "sub" ? "hybrid-sub" : "hybrid",
      });
    }
    const inheritPct = Math.max(0, 100 - Math.round(base.hybridChance * 100));
    outcomes.push({
      label: "遺傳父母物種",
      pct: inheritPct,
      kind: "inherit",
    });
  } else if (base.hybridName) {
    const outcomeKind = base.tier === "tertiary" ? "tertiary" : "hybrid";
    const outcomeLabel =
      base.tier === "tertiary" ? `三代種【${base.hybridName}】` : `雜交【${base.hybridName}】`;
    outcomes.push({
      label: outcomeLabel,
      pct: Math.round(base.hybridChance * 100),
      kind: outcomeKind,
    });
    outcomes.push({
      label: "遺傳父母物種",
      pct: Math.round((1 - base.hybridChance) * 100),
      kind: "inherit",
    });
  } else {
    outcomes.push({ label: "遺傳父母物種", pct: 100, kind: "inherit" });
  }

  const spA = SPECIES[petA.speciesId]?.name || petA.name;
  const spB = SPECIES[petB.speciesId]?.name || petB.name;
  let awakenNote = null;
  if (hiGen >= 3) awakenNote = "若出三代：血脈覺醒（額外天生＋技能 Lv.2 起點）";
  else if (hiGen >= 2) awakenNote = "若出二代：額外天生強化";

  return {
    ...base,
    parentNames: [displayPetName(petA), displayPetName(petB)],
    speciesHint: base.sameSpecies ? spA : `${spA}／${spB}`,
    elemRate,
    matCost,
    genOdds: odds,
    outcomes,
    temperParents: [
      (() => {
        const pe = PERSONALITIES[petA.personalityId];
        return {
          name: displayPetName(petA),
          personalityName: petA.personalityName || pe?.name || "—",
          role: pe?.role || null,
          roleShort: PERSONALITY_ROLE_SHORT[pe?.role] || null,
          roleLabel: PERSONALITY_ROLE_LABEL[pe?.role] || null,
        };
      })(),
      (() => {
        const pe = PERSONALITIES[petB.personalityId];
        return {
          name: displayPetName(petB),
          personalityName: petB.personalityName || pe?.name || "—",
          role: pe?.role || null,
          roleShort: PERSONALITY_ROLE_SHORT[pe?.role] || null,
          roleLabel: PERSONALITY_ROLE_LABEL[pe?.role] || null,
        };
      })(),
    ],
    temperNote: "子代主性格從雙親主池遺傳；副性格基因入副池，孵出後未覺醒，達 Lv.20 可於性格頁覺醒",
    statPreview: {
      atk: [statLo.atk + (loAwaken?.atk || 0), statHi.atk + (hiAwaken?.atk || 0)],
      hp: [statLo.hp + (loAwaken?.hp || 0), statHi.hp + (hiAwaken?.hp || 0)],
      spd: [statLo.spd + (loAwaken?.spd || 0), statHi.spd + (hiAwaken?.spd || 0)],
    },
    awakenNote,
    stoneCost: BREED_STONE_COST,
  };
}

function lineageMember(state, id) {
  const hit = findOwnedPet(state, id);
  if (hit) {
    return {
      uid: id,
      name: displayPetName(hit.pet),
      generation: petGeneration(hit.pet),
      speciesName: SPECIES[hit.pet.speciesId]?.name || hit.pet.name,
      exists: true,
      deployed: (state.pets || []).some((x) => x.uid === id),
    };
  }
  return { uid: id, name: "已放歸", exists: false, deployed: false };
}

/** UI：血統（父母／祖父母／子代） */
export function petLineage(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return null;
  const pet = found.pet;
  const parents = (pet.bornFrom || []).map((id) => lineageMember(state, id));
  const seenGp = new Set();
  const grandparents = [];
  for (const parent of parents) {
    if (!parent.exists) continue;
    const parentPet = findOwnedPet(state, parent.uid)?.pet;
    for (const gpId of parentPet?.bornFrom || []) {
      if (!gpId || seenGp.has(gpId) || gpId === uid) continue;
      seenGp.add(gpId);
      const gp = lineageMember(state, gpId);
      gp.viaUid = parent.uid;
      gp.viaName = parent.name;
      grandparents.push(gp);
    }
  }
  const children = [];
  for (const p of [...(state.pets || []), ...(state.ranch || [])]) {
    if ((p.bornFrom || []).includes(uid)) {
      children.push({
        uid: p.uid,
        name: displayPetName(p),
        generation: petGeneration(p),
        speciesName: SPECIES[p.speciesId]?.name || p.name,
        deployed: (state.pets || []).some((x) => x.uid === p.uid),
      });
    }
  }
  const selfDeployed = (state.pets || []).some((x) => x.uid === uid);
  const kinshipActive =
    selfDeployed &&
    (parents.some((p) => p.deployed) || children.some((c) => c.deployed));
  return {
    generation: petGeneration(pet),
    parents,
    grandparents,
    children,
    kinshipActive,
    hasLineage: parents.length > 0 || children.length > 0,
  };
}

/** UI：雙親雜交／代數提示 */
export function breedPairHint(petA, petB) {
  if (!petA || !petB) return null;
  const same = petA.speciesId === petB.speciesId;
  const kindA = petA.kind;
  const kindB = petB.kind;
  const genA = petGeneration(petA);
  const genB = petGeneration(petB);
  const genMult = genPowerMult(genA, genB);
  const odds = childGenerationOdds(genA, genB);
  const genOddsText = odds.map((o) => `${genLabel(o.gen)} ${o.pct}%`).join("／");

  let hybridName = null;
  let hybridChance = 0;
  let tier = null;
  /** @type {{ name: string, species: string, chance: number, pct: number, tier: string }[]} */
  const recipeOutcomes = [];
  const bothHybrid = !!(SPECIES[petA.speciesId]?.breedOnly && SPECIES[petB.speciesId]?.breedOnly);
  if (!same && bothHybrid) {
    const tertList = tertiaryRecipesForParents(petA.speciesId, petB.speciesId);
    if (tertList.length) {
      let total = 0;
      for (const r of tertList) {
        if (!SPECIES[r.species]) continue;
        const w = Math.min(0.55, r.chance * genMult);
        total += w;
        recipeOutcomes.push({
          name: SPECIES[r.species].name,
          species: r.species,
          chance: w,
          pct: 0,
          tier: "tertiary",
        });
      }
      hybridChance = Math.min(0.7, total);
      const scale = total > 0 ? hybridChance / total : 0;
      for (const o of recipeOutcomes) o.pct = Math.round(o.chance * scale * 100);
      const best = recipeOutcomes.reduce((a, b) => (a.chance >= b.chance ? a : b), recipeOutcomes[0]);
      if (best) {
        hybridName = best.name;
        tier = "tertiary";
      }
    }
  }
  if (!hybridName && !same && kindA !== kindB) {
    const list = hybridRecipesForKinds(kindA, kindB);
    if (list.length) {
      let total = 0;
      for (const r of list) {
        if (!SPECIES[r.species]) continue;
        const w = Math.min(0.85, r.chance * genMult);
        total += w;
        recipeOutcomes.push({
          name: SPECIES[r.species].name,
          species: r.species,
          chance: w,
          pct: 0,
          tier: r.tier || "main",
        });
      }
      hybridChance = Math.min(0.9, total);
      const scale = total > 0 ? hybridChance / total : 0;
      for (const o of recipeOutcomes) o.pct = Math.round(o.chance * scale * 100);
      const best = recipeOutcomes.reduce((a, b) => (a.chance >= b.chance ? a : b), recipeOutcomes[0]);
      if (best) {
        hybridName = best.name;
        tier = best.tier;
      }
    }
  }

  let note;
  if (same) {
    note = `同種：較易升稀有 · 子代 ${genOddsText}`;
  } else if (hybridName && tier === "tertiary") {
    note = `三代種：合計約 ${Math.round(hybridChance * 100)}% · 子代 ${genOddsText}`;
  } else if (hybridName) {
    note = `異種配方：合計約 ${Math.round(hybridChance * 100)}%（含主／次 · 代數加成×${genMult.toFixed(2)}）· 子代 ${genOddsText}`;
  } else {
    note = `異種無雜交配方（×）· 只遺傳父母 · 子代 ${genOddsText}`;
  }

  return {
    sameSpecies: same,
    hybridName,
    hybridChance,
    tier,
    recipeOutcomes,
    genMult,
    genA,
    genB,
    genOddsText,
    note,
  };
}

export function breedStatus(state) {
  ensureBreedJobs(state);
  const now = Date.now();
  const jobs = state.breedJobs
    .filter((j) => !j.claimed && !j.legacy)
    .map((j) => {
      const batch = Math.max(1, j.batch || 1);
      const claimedCycles = Math.max(0, j.claimedCycles || 0);
      const cycleMs = Math.max(1, j.cycleMs || BREED_COOLDOWN_MS);
      const totalMs = cycleMs * batch;
      const startedAt = j.startedAt || (j.readyAt || now) - totalMs;
      const left = Math.max(0, (j.readyAt || 0) - now);
      const elapsed = Math.max(0, now - startedAt);
      const pct = Math.min(100, Math.round((elapsed / Math.max(1, totalMs)) * 100));
      let completed = 0;
      if (Array.isArray(j.cycles) && j.cycles.length) {
        for (let i = claimedCycles; i < batch; i++) {
          if ((j.cycles[i]?.readyAt || 0) <= now) completed += 1;
          else break;
        }
      } else if ((j.readyAt || 0) <= now) {
        completed = batch - claimedCycles;
      } else {
        completed = Math.max(
          0,
          Math.min(batch, Math.floor(elapsed / cycleMs)) - claimedCycles
        );
      }
      const claimableCount = Math.max(0, completed);
      const remainCycles = Math.max(0, batch - claimedCycles);
      const fullyReady = claimedCycles + claimableCount >= batch && claimableCount > 0;
      const mating = remainCycles > claimableCount;
      return {
        id: j.id,
        uids: j.uids || [],
        names: j.names || [],
        readyAt: j.readyAt || 0,
        startedAt,
        leftMs: left,
        pct,
        ready: claimableCount > 0 && !mating,
        mating,
        batch,
        claimedCycles,
        claimableCount,
        remainCycles,
        fullyReady,
        cycleMs,
      };
    })
    .sort((a, b) => a.readyAt - b.readyAt);
  const next = jobs.find((j) => j.leftMs > 0) || null;
  const claimable = jobs.filter((j) => j.claimableCount > 0);
  return {
    cost: BREED_STONE_COST,
    queueMax: BREED_QUEUE_MAX,
    batchMin: BREED_BATCH_MIN,
    batchMax: BREED_BATCH_MAX,
    slotsUsed: jobs.length,
    cooldownLeftMs: next?.leftMs || 0,
    cooldownTotalMs: next?.cycleMs || BREED_COOLDOWN_MS,
    cooldownPct: next ? next.pct : 100,
    ready: jobs.length < BREED_QUEUE_MAX,
    pair: next ? { uids: next.uids, names: next.names, readyAt: next.readyAt } : null,
    jobs,
    claimable,
    busyUids: [...breedBusyUids(state)],
    eggCap: EGG_CAP,
    eggCount: state.eggs?.length || 0,
    pendingEggs: breedPendingEggCount(state),
  };
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem("void-tide-pets-v24");
  localStorage.removeItem("void-tide-pets-v23");
  localStorage.removeItem("void-tide-pets-v22");
  localStorage.removeItem("void-tide-pets-v21");
  localStorage.removeItem("void-tide-pets-v20");
  localStorage.removeItem("void-tide-pets-v19");
  localStorage.removeItem("void-tide-pets-v18");
  localStorage.removeItem("void-tide-pets-v17");
  localStorage.removeItem("void-tide-pets-v16");
  localStorage.removeItem("void-tide-pets-v15");
  localStorage.removeItem("void-tide-pets-v14");
  localStorage.removeItem("void-tide-pets-v12");
  localStorage.removeItem("void-tide-pets-v11");
  localStorage.removeItem("void-tide-pets-v10");
  localStorage.removeItem("void-tide-pets-v9");
  localStorage.removeItem("void-tide-pets-v8");
  localStorage.removeItem("void-tide-pets-v7");
  localStorage.removeItem("void-tide-pets-v6");
  localStorage.removeItem("void-tide-pets-v5");
  localStorage.removeItem("void-tide-pets-v4");
  localStorage.removeItem("void-tide-pets-v3");
  localStorage.removeItem("void-tide-pets-v2");
  localStorage.removeItem("void-tide-pets-v1");
  localStorage.removeItem("void-tide-v1");
  localStorage.removeItem("void-tide-v2");
  return defaultState();
}


function ensureAbyssDive(state, now = Date.now()) {
  if (!state.abyssDive || typeof state.abyssDive !== "object") {
    state.abyssDive = emptyAbyssDive(now);
  }
  const ad = state.abyssDive;
  if (!ad.cosmetics) ad.cosmetics = {};
  if (!ad.weekMilestonesClaimed || typeof ad.weekMilestonesClaimed !== "object") {
    ad.weekMilestonesClaimed = {};
  }
  if (!ad.bestMilestonesClaimed || typeof ad.bestMilestonesClaimed !== "object") {
    ad.bestMilestonesClaimed = {};
  }
  if (typeof ad.powerNodes !== "number" || ad.powerNodes < 0) ad.powerNodes = 0;
  ad.powerNodes = Math.min(ABYSS_POWER_NODE_MAX, Math.floor(ad.powerNodes || 0));
  const wk = weekKey(now);
  if (ad.weekKey !== wk) {
    ad.weekKey = wk;
    ad.weekBestDepth = 0;
    ad.weekMilestonesClaimed = {};
  }
  if (ad.eggsWeekKey !== wk) {
    ad.eggsWeekKey = wk;
    ad.eggsBoughtWeek = 0;
  }
  if (ad.fusionCoreWeekKey !== wk) {
    ad.fusionCoreWeekKey = wk;
    ad.fusionCoresBoughtWeek = 0;
  }
  return ad;
}

function abyssPowerNodeAtkMult(state) {
  const n = Math.max(0, Math.min(ABYSS_POWER_NODE_MAX, state.abyssDive?.powerNodes | 0));
  return 1 + n * ABYSS_POWER_NODE_ATK;
}

/** 主脊階段五（已通 ≥81）先開潮淵 */
function abyssUnlocked(state) {
  return spineStageFromState(state) >= ABYSS_UNLOCK_SPINE_STAGE;
}

function spendAbyssPendingGrit(run, cost) {
  const need = Math.max(0, cost | 0);
  if ((run.pendingGrit | 0) < need) return false;
  run.pendingGrit = (run.pendingGrit | 0) - need;
  return true;
}

/** 通關深度達標時發週／歷史里程碑（自動入帳） */
function grantAbyssDepthMilestones(state, ad, depth) {
  const d = depth | 0;
  const granted = [];
  const grantOne = (m, claimedMap, kind) => {
    const key = String(m.depth);
    if (d < (m.depth | 0) || claimedMap[key]) return;
    claimedMap[key] = true;
    if ((m.grit | 0) > 0) addMaterials(state, { [ABYSS_GRIT_ID]: m.grit | 0 });
    if (m.materials && typeof m.materials === "object") addMaterials(state, m.materials);
    const bits = [];
    if ((m.grit | 0) > 0) bits.push(`淵砂×${m.grit}`);
    for (const [mat, n] of Object.entries(m.materials || {})) {
      if ((n | 0) > 0) bits.push(`${MATERIALS[mat]?.name || mat}×${n}`);
    }
    const line = `${m.label || `${kind}${m.depth}`}：${bits.join(" · ") || "獎勵已入帳"}`;
    granted.push({ kind, depth: m.depth, label: m.label, grit: m.grit | 0, materials: { ...(m.materials || {}) }, line });
    pushLog(state, `潮淵里程碑·${line}`);
  };
  for (const m of ABYSS_WEEKLY_DEPTH_MILESTONES) {
    grantOne(m, ad.weekMilestonesClaimed, "week");
  }
  for (const m of ABYSS_BEST_DEPTH_MILESTONES) {
    grantOne(m, ad.bestMilestonesClaimed, "best");
  }
  return granted;
}

function applyAbyssMutationId(run, mutationId) {
  let next = [...(run.mutationIds || []), mutationId];
  let dropped = [];
  if (next.length > ABYSS_MAX_ACTIVE_MUTATIONS) {
    dropped = next.slice(0, next.length - ABYSS_MAX_ACTIVE_MUTATIONS);
    next = next.slice(next.length - ABYSS_MAX_ACTIVE_MUTATIONS);
  }
  run.mutationIds = next;
  return { dropped, mutationIds: next };
}

function buildAbyssFloorWaves(depth, seed) {
  const d = Math.max(1, depth | 0);
  const h = abyssHash(`${seed}:w${d}`);
  const elems = ["tide", "flame", "gale", "stone", "gloom"];
  const milestone =
    d === 10 || d === 25 || d === 50 || d === 75 || d === 100 || (d >= 50 && d % 25 === 0);
  const scale = 1 + (d - 1) * 0.12 + (milestone ? 0.08 : 0);
  const mk = (name, role, baseHp, baseAtk, baseSpd, ei, tag) => ({
    name,
    role,
    hp: Math.round(baseHp * scale),
    atk: Math.round(baseAtk * scale),
    spd: Math.round(baseSpd * (1 + (d - 1) * 0.03)),
    element: elems[ei % elems.length],
    skills:
      role === "boss"
        ? ["tide_crush", "mist_veil"].filter((id) => SKILLS[id])
        : role === "elite"
          ? ["coral_spike"].filter((id) => SKILLS[id])
          : [],
    actions: role === "boss" ? 2 : 1,
    threatTag: tag || "",
  });
  const band =
    d >= 50 ? "深淵" : d >= 25 ? "中淵" : d >= 10 ? "淵廊" : "潮霧";
  const waves = [
    {
      label: `淵層${d}·${band}`,
      enemies: [
        mk(`${band}卒`, "normal", 42, 9, 10, h, band),
        mk(`${band}影`, "normal", 40, 8, 11, h + 1, band),
      ],
    },
  ];
  if (d % 3 === 0) {
    waves.push({
      label: `淵層${d}·護影`,
      enemies: [mk(`${band}護衛`, "elite", 70, 12, 12, h + 2, "精英")],
    });
  } else {
    waves.push({
      label: `淵層${d}·暗潮`,
      enemies: [mk("暗潮潛客", "normal", 48, 10, 12, h + 3, "")],
    });
  }
  if (d % 5 === 0) {
    const bossName = milestone
      ? d >= 50
        ? "潮淵殘主·深影"
        : d >= 25
          ? "潮淵殘主·中印"
          : "潮淵殘主·淵口"
      : "潮淵殘主";
    waves.push({
      label: `淵層${d}·主影${milestone ? "·里程碑" : ""}`,
      enemies: [mk(bossName, "boss", milestone ? 140 : 120, milestone ? 18 : 16, 13, h + 4, milestone ? "里程碑BOSS" : "BOSS")],
    });
  }
  return waves;
}

function applyAbyssMutationsToAllies(allies, mutationIds, formationId) {
  const placement = formationAllyPlacement(formationId, allies.length);
  for (let i = 0; i < allies.length; i += 1) {
    const slot = placement.find((p) => p.unitIndex === i);
    allies[i].lane = slot?.lane || "front";
    allies[i].dmgTakenMult = allies[i].dmgTakenMult || 1;
    allies[i].healOutMult = 1;
  }
  let healMult = 1;
  let frontTax = 1;
  let allySpd = 1;
  for (const id of mutationIds || []) {
    const m = ABYSS_MUTATIONS[id];
    if (!m) continue;
    if (m.healMult != null) healMult = Math.min(healMult, m.healMult);
    if (m.frontDmgTakenMult != null) frontTax = Math.max(frontTax, m.frontDmgTakenMult);
    if (m.allySpdMult != null) allySpd *= m.allySpdMult;
  }
  for (const a of allies) {
    a.healOutMult = healMult;
    if (a.lane === "front") a.dmgTakenMult = (a.dmgTakenMult || 1) * frontTax;
    if (allySpd !== 1) a.spd = Math.max(1, Math.round(a.spd * allySpd));
  }
}

function abyssMutationFoeMult(mutationIds) {
  let atk = 1;
  let hp = 1;
  for (const id of mutationIds || []) {
    const m = ABYSS_MUTATIONS[id];
    if (!m) continue;
    if (m.foeAtkMult != null) atk *= m.foeAtkMult;
    if (m.foeHpMult != null) hp *= m.foeHpMult;
  }
  return { atkMult: atk, hpMult: hp };
}

function mapAbyssMutations(ids) {
  return (ids || []).map((id) => ABYSS_MUTATIONS[id]).filter(Boolean);
}

function abyssDiveBuffMult(diveBuffs) {
  let atk = 1;
  let hp = 1;
  let dmgTaken = 1;
  for (const id of diveBuffs || []) {
    const b = ABYSS_MERCHANT_BUFFS[id];
    if (!b) continue;
    if (b.atkMult) atk *= b.atkMult;
    if (b.hpMult) hp *= b.hpMult;
    if (b.dmgTakenMult) dmgTaken *= b.dmgTakenMult;
  }
  return { atkMult: atk, hpMult: hp, dmgTakenMult: dmgTaken };
}

function abyssOwnedPets(state) {
  return [...(state.pets || []), ...(state.ranch || [])];
}

function normalizeAbyssRunSquad(run) {
  if (!run) return run;
  if (!run.hpByUid || typeof run.hpByUid !== "object") run.hpByUid = {};
  if (!Array.isArray(run.diveBuffs)) run.diveBuffs = [];
  if (!Array.isArray(run.squadUids)) run.squadUids = [];
  if (!Array.isArray(run.activeUids)) {
    run.activeUids = run.squadUids.slice(0, ABYSS_ACTIVE_SIZE);
  }
  if (!Array.isArray(run.benchUids)) {
    const active = new Set(run.activeUids);
    run.benchUids = run.squadUids.filter((uid) => !active.has(uid));
  }
  return run;
}
function abyssPetCombatStats(state, pet, diveBuffs) {
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;
  const stageBonus = (state.realm || 0) * 2;
  const activePets = (state.abyssDive?.run?.activeUids || [])
    .map((uid) => findOwnedPet(state, uid)?.pet)
    .filter(Boolean);
  const synergy = partySynergy(activePets.length ? activePets : [pet]);
  const dex = bestiaryStatus(state);
  const sealMult = tideSealCombatMult(state.tideSeals || 0);
  const cos = abyssCosmeticCombatMult(state.abyssDive?.cosmetics || {});
  const buff = abyssDiveBuffMult(diveBuffs);
  const nodeMult = abyssPowerNodeAtkMult(state);
  const atkMult = synergy.atkMult * dex.atkMult * sealMult * cos.atkMult * buff.atkMult * nodeMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult * cos.hpMult * buff.hpMult;
  const skills = petSkillIds(pet);
  const gen = petGeneration(pet);
  const gMult = genCombatMult(gen);
  const fMult = petFusionCombatMult(pet);
  const fAtk = formation.petAtkMult || 1;
  const fHp = formation.petHpMult || 1;
  const fSpd = formation.petSpdMult || 1;
  const pe = personalityCombatForPet(pet);
  const pAtk = pe?.atkMult || 1;
  const pHp = pe?.hpMult || 1;
  const pSpd = pe?.spdMult || 1;
  const bm = bloodmarkCombatMult(pet.bloodmarks);
  const maxHp = Math.round((pet.hp + stageBonus * 2) * hpMult * gMult * fMult * fHp * pHp * bm.hp);
  const atk = Math.round((pet.atk + stageBonus) * atkMult * gMult * fMult * fAtk * pAtk * bm.atk);
  const spd = Math.round(pet.spd * synergy.spdMult * fSpd * pSpd * bm.spd);
  return {
    maxHp,
    atk,
    spd,
    skills,
    gen,
    pe,
    formation,
    synergy,
    dmgTakenMult: buff.dmgTakenMult,
  };
}

/** 由深潛編隊組出戰方；血量沿用 hpByUid（層間唔回滿） */
function buildAbyssCombatAllies(state, run) {
  normalizeAbyssRunSquad(run);
  const activePets = [];
  for (const uid of run.activeUids || []) {
    const hit = findOwnedPet(state, uid);
    if (hit?.pet) activePets.push(hit.pet);
  }
  if (!activePets.length) {
    return { allies: [], synergy: partySynergy([]), formation: FORMATIONS.balanced, tactics: "balanced" };
  }
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;
  const synergy = partySynergy(activePets);
  const allies = [];
  for (const p of activePets) {
    const st = abyssPetCombatStats(state, p, run.diveBuffs);
    const saved = run.hpByUid?.[p.uid];
    let hp = st.maxHp;
    if (saved && saved.maxHp > 0) {
      if ((saved.hp | 0) <= 0) hp = 0;
      else hp = Math.max(1, Math.round((saved.hp / saved.maxHp) * st.maxHp));
      hp = Math.min(st.maxHp, hp);
    }
    allies.push({
      side: "ally",
      petUid: p.uid,
      name: displayPetName(p),
      hp,
      maxHp: st.maxHp,
      atk: st.atk,
      spd: st.spd,
      elementId: p.elementId,
      skillLevel: p.skillLevel ?? 1,
      secondSkillId: (() => {
        const sid = secondSkillIdForPet(p);
        const unlocked =
          (p.fusionLevel ?? 0) >= SECOND_SKILL_UNLOCK.fusionLevel ||
          (p.level ?? 1) >= SECOND_SKILL_UNLOCK.level;
        return unlocked && sid ? sid : null;
      })(),
      secondSkillLevel: p.secondSkillLevel ?? 1,
      skills: st.skills,
      skillCd: Object.fromEntries(st.skills.map((id) => [id, 0])),
      guardTurns: 0,
      atkBuffTurns: 0,
      atkBuffPct: 0,
      generation: st.gen,
      sustainBias: !!st.pe?.sustainBias,
      dmgTakenMult: st.dmgTakenMult || 1,
    });
  }
  return { allies, synergy, formation, tactics };
}

function snapshotAbyssAllyHp(run, allies) {
  if (!run.hpByUid) run.hpByUid = {};
  for (const a of allies || []) {
    if (!a.petUid) continue;
    run.hpByUid[a.petUid] = {
      hp: Math.max(0, a.hp | 0),
      maxHp: Math.max(1, a.maxHp | 0),
    };
  }
}

function ensureAbyssSquadHp(state, run) {
  normalizeAbyssRunSquad(run);
  for (const uid of run.squadUids || []) {
    if (run.hpByUid[uid]) continue;
    const hit = findOwnedPet(state, uid);
    if (!hit?.pet) continue;
    const st = abyssPetCombatStats(state, hit.pet, run.diveBuffs);
    run.hpByUid[uid] = { hp: st.maxHp, maxHp: st.maxHp };
  }
}

function abyssSquadRosterView(state, run) {
  if (!run) return { active: [], bench: [], squad: [] };
  normalizeAbyssRunSquad(run);
  ensureAbyssSquadHp(state, run);
  const mapOne = (uid) => {
    const hit = findOwnedPet(state, uid);
    const hp = run.hpByUid[uid] || { hp: 0, maxHp: 1 };
    return {
      uid,
      name: hit?.pet ? displayPetName(hit.pet) : uid,
      elementId: hit?.pet?.elementId || "",
      hp: hp.hp | 0,
      maxHp: Math.max(1, hp.maxHp | 0),
      dead: (hp.hp | 0) <= 0,
      missing: !hit?.pet,
    };
  };
  return {
    active: (run.activeUids || []).map(mapOne),
    bench: (run.benchUids || []).map(mapOne),
    squad: (run.squadUids || []).map(mapOne),
  };
}

/** 已通關 depth 之後，下一層預覽（突變／保險）；活躍突變上限 FIFO */
function previewAbyssNextFloor(clearedDepth, mutationIds, insuranceCharges) {
  const depth = (clearedDepth | 0) + 1;
  const mutationFloor = depth % ABYSS_MUTATION_EVERY === 0;
  const active = Array.isArray(mutationIds) ? mutationIds.length : 0;
  const atMutationCap = active >= ABYSS_MAX_ACTIVE_MUTATIONS;
  const wouldRoll = mutationFloor;
  const insuranceSkips = wouldRoll && (insuranceCharges | 0) > 0;
  // 達上限仍會 roll，但會頂替最舊一條
  return {
    depth,
    mutationFloor,
    willAddMutation: wouldRoll && !insuranceSkips,
    insuranceSkips,
    atMutationCap,
    activeMutations: active,
    maxActiveMutations: ABYSS_MAX_ACTIVE_MUTATIONS,
  };
}
function runAbyssFloorCombat(state, { depth, seed, mutationIds, run }) {
  const ctx = buildAbyssCombatAllies(state, run);
  const { allies, synergy, formation, tactics } = ctx;
  if (!allies.length) return { ok: false, msg: "潮淵編隊無可用出戰靈寵。" };
  if (allies.every((a) => a.hp <= 0)) {
    return { ok: false, msg: "出戰靈寵全數陣亡——請先整理隊伍或用祭壇復活。" };
  }

  applyAbyssMutationsToAllies(allies, mutationIds, state.formation || "balanced");
  const foeMult = abyssMutationFoeMult(mutationIds);

  const waves = buildAbyssFloorWaves(depth, seed);
  for (const w of waves) {
    for (const e of w.enemies || []) {
      e.hp = Math.round((e.hp || 1) * foeMult.hpMult);
      e.atk = Math.round((e.atk || 1) * foeMult.atkMult);
    }
  }
  let waveIndex = 0;
  let foes = spawnWaveFoes(waves[0]);
  _combatUid = 0;
  tagCombatUnits(allies, "a");
  tagCombatUnits(foes, "f");

  const transcript = [];
  const combatEvents = [];
  const say = (text) => {
    transcript.push(text);
    pushCombatText(combatEvents, text);
  };
  const pushWave = (waveIdx, label, foeList) => {
    const waveLine =
      waveIdx === 1 ? `—— 第 1 波・${label} ——` : `—— 第 ${waveIdx} 波・${label} 湧出！——`;
    transcript.push(waveLine);
    combatEvents.push({
      type: "wave",
      text: waveLine,
      waveIndex: waveIdx,
      label,
      foes: foeList.map(unitRosterEntry),
    });
  };
  const pushRound = (r) => {
    const roundLine = `—— 第 ${r} 回合 ——`;
    transcript.push(roundLine);
    combatEvents.push({ type: "round", text: roundLine, round: r });
  };

  const mutNames = (mutationIds || []).map((id) => ABYSS_MUTATIONS[id]?.name || id);
  transcript.push(`潮淵深潛・第 ${depth} 層（${waves.length} 波）。`);
  if (mutNames.length) transcript.push(`活躍突變：${mutNames.join("、")}。`);
  transcript.push(`戰術【${TACTICS[tactics]?.name || tactics}】· 陣型【${formation.name}】。`);
  if (synergy.labels?.length) transcript.push(`陣容羈絆：${synergy.labels.join("、")}。`);
  transcript.push("層間唔回滿血——血量會帶到下一層。");

  pushWave(1, waves[0].label, foes);
  const combatStart = {
    allies: allies.map(unitRosterEntry),
    foes: foes.map(unitRosterEntry),
  };

  let round = 0;
  const maxRounds = 55;
  let won = false;
  let ended = false;
  const checkSideDown = () => {
    if (allies.every((a) => a.hp <= 0)) return "lose";
    if (foes.every((f) => f.hp <= 0)) return "wave";
    return null;
  };
  const advanceOrWin = () => {
    if (waveIndex + 1 < waves.length) {
      waveIndex += 1;
      foes = tagCombatUnits(spawnWaveFoes(waves[waveIndex]), "f");
      pushWave(waveIndex + 1, waves[waveIndex].label, foes);
      return false;
    }
    return true;
  };

  while (round < maxRounds && !ended) {
    round += 1;
    pushRound(round);
    const order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));
    for (const actor of order) {
      if (actor.hp <= 0) continue;
      const actions = Math.max(1, actor.actions || 1);
      for (let a = 0; a < actions; a += 1) {
        if (actor.hp <= 0) break;
        const down = checkSideDown();
        if (down) break;
        if (actor.side === "ally") act(actor, allies, foes, transcript, combatEvents, tactics);
        else act(actor, foes, allies, transcript, combatEvents, "balanced");
      }
      tickCooldowns(actor);
      const down = checkSideDown();
      if (down === "lose") {
        ended = true;
        say(`折戟潮淵第 ${depth} 層……出戰隊全滅。`);
        break;
      }
      if (down === "wave") {
        if (advanceOrWin()) {
          won = true;
          ended = true;
          say(`突破潮淵第 ${depth} 層！`);
          break;
        }
      }
    }
  }
  if (!ended) {
    say(`潮淵第 ${depth} 層膠著過久，視為失敗。`);
  }
  return {
    ok: true,
    won,
    combatKind: "abyss",
    label: `潮淵·第${depth}層`,
    depth,
    waves: waves.length,
    rounds: round,
    transcript,
    combatEvents: combatEvents.slice(0, 120),
    combatStart,
    allies,
    mutationIds: [...(mutationIds || [])],
    mutations: mapAbyssMutations(mutationIds),
  };
}
/** 秘境旁路：潮淵深潛狀態摘要 */
export function abyssDiveView(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  const today = todayKey(now);
  const freeLeft = ad.freeUsedDate !== today;
  const run = ad.run ? normalizeAbyssRunSquad(ad.run) : null;
  const gritHave = Math.floor(state.materials?.[ABYSS_GRIT_ID] || 0);
  const tokenHave = Math.floor(state.materials?.mist_token || 0);
  const unlocked = abyssUnlocked(state);
  const ownedCount = abyssOwnedPets(state).length;
  const spineStage = spineStageFromState(state);
  const weekMs = ABYSS_WEEKLY_DEPTH_MILESTONES.map((m) => ({
    ...m,
    claimed: !!(ad.weekMilestonesClaimed || {})[String(m.depth)],
    reached: (ad.weekBestDepth | 0) >= (m.depth | 0),
  }));
  const bestMs = ABYSS_BEST_DEPTH_MILESTONES.map((m) => ({
    ...m,
    claimed: !!(ad.bestMilestonesClaimed || {})[String(m.depth)],
    reached: (ad.bestDepth | 0) >= (m.depth | 0),
  }));
  return {
    unlocked,
    unlockSpineStage: ABYSS_UNLOCK_SPINE_STAGE,
    spineStage,
    gritHave,
    tokenHave,
    freeLeft,
    entryCost: freeLeft ? 0 : ABYSS_ENTRY_TOKEN_COST,
    bestDepth: ad.bestDepth | 0,
    weekBestDepth: ad.weekBestDepth | 0,
    weeklyMilestones: weekMs,
    bestMilestones: bestMs,
    insuranceCharges: ad.insuranceCharges | 0,
    cosmetics: { ...ad.cosmetics },
    eggsBoughtWeek: ad.eggsBoughtWeek | 0,
    eggsWeeklyLimit: ABYSS_EGG_WEEKLY_LIMIT,
    insuranceCost: ABYSS_INSURANCE_COST,
    eggCost: ABYSS_EGG_COST,
    tideShiftCost: ABYSS_TIDE_SHIFT_COST,
    tideShiftHave: Math.floor(state.items?.tide_shift_charm || 0),
    powerNodes: ad.powerNodes | 0,
    powerNodeMax: ABYSS_POWER_NODE_MAX,
    powerNodeCost: ABYSS_POWER_NODE_COST,
    powerNodeAtkPct: Math.round(ABYSS_POWER_NODE_ATK * 100),
    powerNodeAtkMult: abyssPowerNodeAtkMult(state),
    fusionCoreCost: ABYSS_FUSION_CORE_COST,
    fusionCoresBoughtWeek: ad.fusionCoresBoughtWeek | 0,
    fusionCoreWeeklyLimit: ABYSS_FUSION_CORE_WEEKLY_LIMIT,
    squadSize: ABYSS_SQUAD_SIZE,
    activeSize: ABYSS_ACTIVE_SIZE,
    ownedCount,
    canFormSquad: ownedCount >= ABYSS_SQUAD_SIZE,
    cosmeticList: ABYSS_COSMETIC_IDS.map((id) => ({
      ...ABYSS_COSMETICS[id],
      owned: !!ad.cosmetics[id],
    })),
    run: run
      ? {
          depth: run.depth | 0,
          pendingGrit: run.pendingGrit | 0,
          mutationIds: [...(run.mutationIds || [])],
          mutations: (run.mutationIds || []).map((id) => ABYSS_MUTATIONS[id]).filter(Boolean),
          seed: run.seed,
          diveBuffs: [...(run.diveBuffs || [])],
          diveBuffList: (run.diveBuffs || []).map((id) => ABYSS_MERCHANT_BUFFS[id]).filter(Boolean),
          pendingEvent: run.pendingEvent || null,
          pendingMutationChoice: run.pendingMutationChoice || null,
          roster: abyssSquadRosterView(state, run),
        }
      : null,
  };
}

/** 開潛候選靈寵（出戰＋牧場） */
export function abyssSquadCandidates(state) {
  return abyssOwnedPets(state).map((p) => ({
    uid: p.uid,
    name: displayPetName(p),
    speciesId: p.speciesId,
    elementId: p.elementId,
    elementName: p.elementName,
    rarity: p.rarity ?? 0,
    starred: !!p.starred,
    locked: !!p.locked,
    atk: p.atk | 0,
    hp: p.hp | 0,
    level: p.level | 0,
    generation: petGeneration(p),
  }));
}

/**
 * 開潛（戰鬥）
 * @param {string[]} squadUids 開潛時必填 5 個 uid
 */
export function startAbyssDive(state, squadUids, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return {
      ok: false,
      msg: `潮淵封印中——主脊達階段${ABYSS_UNLOCK_SPINE_STAGE}（已通≥${(ABYSS_UNLOCK_SPINE_STAGE - 1) * 20 + 1}）後解鎖。`,
    };
  }
  const ad = ensureAbyssDive(state, now);
  if (ad.run) {
    return { ok: false, msg: "已在深潛中——請先挑戰本層或撤退。" };
  }
  if (typeof squadUids === "number") {
    now = squadUids;
    squadUids = null;
  }
  const uids = [...new Set((squadUids || []).filter(Boolean))];
  if (uids.length !== ABYSS_SQUAD_SIZE) {
    return { ok: false, msg: `請揀齊 ${ABYSS_SQUAD_SIZE} 隻靈寵組成潮淵編隊。` };
  }
  for (const uid of uids) {
    if (!findOwnedPet(state, uid)) {
      return { ok: false, msg: "編隊含有唔屬於你嘅靈寵。" };
    }
  }
  const today = todayKey(now);
  let spentToken = 0;
  if (ad.freeUsedDate === today) {
    if (!spendMaterials(state, { mist_token: ABYSS_ENTRY_TOKEN_COST })) {
      return { ok: false, msg: `需要潮霧令 ×${ABYSS_ENTRY_TOKEN_COST}。` };
    }
    spentToken = ABYSS_ENTRY_TOKEN_COST;
  } else {
    ad.freeUsedDate = today;
  }
  const seed = `${today}:${now}:${abyssHash(String(now))}`;
  const activeUids = uids.slice(0, ABYSS_ACTIVE_SIZE);
  const benchUids = uids.slice(ABYSS_ACTIVE_SIZE);
  ad.run = {
    seed,
    depth: 0,
    pendingGrit: 0,
    mutationIds: [],
    startedAt: now,
    squadUids: uids,
    activeUids,
    benchUids,
    hpByUid: {},
    diveBuffs: [],
    pendingEvent: null,
  };
  ensureAbyssSquadHp(state, ad.run);
  pushLog(state, spentToken ? `踏入潮淵（耗潮霧令×${spentToken}）。` : "今日首潛潮淵（免費）。");
  return advanceAbyssDive(state, now);
}

/** 打目前下一層 */
export function advanceAbyssDive(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run) return { ok: false, msg: "尚未開潛。" };
  normalizeAbyssRunSquad(ad.run);
  if (ad.run.pendingEvent) {
    return { ok: false, msg: "請先揀潮淵事件（2 選 1）。" };
  }
  if (ad.run.pendingMutationChoice) {
    return {
      ok: false,
      msg: "請先揀本層突變（2 選 1）。",
      needMutationPick: true,
      pendingMutationChoice: ad.run.pendingMutationChoice,
    };
  }
  const livingActive = (ad.run.activeUids || []).filter((uid) => (ad.run.hpByUid?.[uid]?.hp | 0) > 0);
  if (!livingActive.length) {
    return { ok: false, msg: "出戰位全數陣亡——請整理隊伍或等祭壇復活。" };
  }

  const nextDepth = (ad.run.depth | 0) + 1;
  const mutationFloor = nextDepth % ABYSS_MUTATION_EVERY === 0;
  if (mutationFloor) {
    const committed = (ad.run.mutationCommittedForDepth | 0) === nextDepth;
    if (!committed) {
      if ((ad.insuranceCharges | 0) > 0) {
        ad.insuranceCharges -= 1;
        ad.run.mutationCommittedForDepth = nextDepth;
        pushLog(state, "突變保險發動——本層略過新突變。");
      } else {
        ad.run.pendingMutationChoice = rollAbyssMutationChoices(
          ad.run.seed,
          nextDepth,
          ad.run.mutationIds || []
        );
        return {
          ok: false,
          msg: "請先揀本層突變（2 選 1）。",
          needMutationPick: true,
          pendingMutationChoice: ad.run.pendingMutationChoice,
          depth: nextDepth,
        };
      }
    }
  }
  const combat = runAbyssFloorCombat(state, {
    depth: nextDepth,
    seed: ad.run.seed,
    mutationIds: ad.run.mutationIds || [],
    run: ad.run,
  });
  if (!combat.ok) return combat;

  snapshotAbyssAllyHp(ad.run, combat.allies);

  if (combat.won) {
    ad.run.depth = nextDepth;
    const gain = abyssFloorGrit(nextDepth, mutationFloor);
    ad.run.pendingGrit = (ad.run.pendingGrit | 0) + gain;
    if (nextDepth > (ad.bestDepth | 0)) ad.bestDepth = nextDepth;
    if (nextDepth > (ad.weekBestDepth | 0)) ad.weekBestDepth = nextDepth;
    const milestones = grantAbyssDepthMilestones(state, ad, nextDepth);
    const mutIds = [...(ad.run.mutationIds || [])];
    let pendingEvent = null;
    if (nextDepth % ABYSS_EVENT_EVERY === 0) {
      pendingEvent = rollAbyssFloorEvent(ad.run.seed, nextDepth);
      ad.run.pendingEvent = pendingEvent;
    }
    return {
      ...combat,
      ok: true,
      gritGained: gain,
      pendingGrit: ad.run.pendingGrit,
      depth: nextDepth,
      clearedDepth: nextDepth,
      canContinue: true,
      wiped: false,
      mutationIds: mutIds,
      mutations: mapAbyssMutations(mutIds),
      diveBuffs: [...(ad.run.diveBuffs || [])],
      diveBuffList: (ad.run.diveBuffs || []).map((id) => ABYSS_MERCHANT_BUFFS[id]).filter(Boolean),
      nextFloor: previewAbyssNextFloor(nextDepth, mutIds, ad.insuranceCharges | 0),
      pendingEvent,
      milestones,
      roster: abyssSquadRosterView(state, ad.run),
      msg: `已通關第 ${nextDepth} 層 · 淵砂 +${gain}（待結算 ${ad.run.pendingGrit}）`,
    };
  }

  const pending = ad.run.pendingGrit | 0;
  const clearedBefore = ad.run.depth | 0;
  const mutIds = [...(ad.run.mutationIds || [])];
  const keep = Math.floor(pending * ABYSS_WIPE_KEEP_RATE);
  if (keep > 0) addMaterials(state, { [ABYSS_GRIT_ID]: keep });
  ad.run = null;
  pushLog(state, `潮淵第 ${nextDepth} 層挑戰失敗——帶回淵砂×${keep}（保底）。`);
  return {
    ...combat,
    ok: true,
    wiped: true,
    gritGained: keep,
    gritKept: keep,
    pendingGrit: 0,
    pendingBefore: pending,
    depth: nextDepth,
    failedDepth: nextDepth,
    clearedDepth: clearedBefore,
    canContinue: false,
    mutationIds: mutIds,
    mutations: mapAbyssMutations(mutIds),
    diveBuffs: [],
    diveBuffList: [],
    msg: keep
      ? `第 ${nextDepth} 層挑戰失敗 · 保底淵砂×${keep}`
      : `第 ${nextDepth} 層挑戰失敗 · 未帶出淵砂`,
  };
}
/** 層間整理：由編隊 5 寵重設 3 出戰 + 2 替補 */
export function rearrangeAbyssSquad(state, activeUids, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run) return { ok: false, msg: "沒有進行中的深潛。" };
  normalizeAbyssRunSquad(ad.run);
  const squad = new Set(ad.run.squadUids || []);
  const next = [...new Set((activeUids || []).filter((uid) => squad.has(uid)))];
  if (!next.length) return { ok: false, msg: "至少揀 1 隻出戰。" };
  if (next.length > ABYSS_ACTIVE_SIZE) {
    return { ok: false, msg: `出戰最多 ${ABYSS_ACTIVE_SIZE} 隻。` };
  }
  const living = next.filter((uid) => (ad.run.hpByUid?.[uid]?.hp | 0) > 0);
  if (!living.length) return { ok: false, msg: "出戰位唔可以全係陣亡靈寵。" };
  ad.run.activeUids = next;
  ad.run.benchUids = (ad.run.squadUids || []).filter((uid) => !next.includes(uid));
  return {
    ok: true,
    msg: "已整理潮淵編隊。",
    roster: abyssSquadRosterView(state, ad.run),
  };
}

/** 解決每 5 層 2 選 1 事件 */
export function resolveAbyssEvent(state, optionType, opts = {}, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run?.pendingEvent) return { ok: false, msg: "沒有待選事件。" };
  normalizeAbyssRunSquad(ad.run);
  ensureAbyssSquadHp(state, ad.run);
  const evt = ad.run.pendingEvent;
  const opt = (evt.options || []).find((o) => o.type === optionType);
  if (!opt) return { ok: false, msg: "無效選項。" };

  if (optionType === "campfire") {
    for (const uid of ad.run.squadUids || []) {
      const slot = ad.run.hpByUid[uid];
      if (!slot || (slot.hp | 0) <= 0) continue;
      const maxHp = Math.max(1, slot.maxHp | 0);
      const heal = Math.round(maxHp * ABYSS_CAMPFIRE_HEAL);
      slot.hp = Math.min(maxHp, (slot.hp | 0) + heal);
    }
    ad.run.pendingEvent = null;
    pushLog(state, "潮篝餘溫——編隊回復約三成血。");
    return {
      ok: true,
      msg: "潮篝：編隊回復約 30% 血量。",
      roster: abyssSquadRosterView(state, ad.run),
    };
  }

  if (optionType === "merchant") {
    const buffId = opt.buffId || opts.buffId;
    const buff = ABYSS_MERCHANT_BUFFS[buffId];
    if (!buff) return { ok: false, msg: "行商貨物唔識。" };
    if ((ad.run.diveBuffs || []).includes(buffId)) {
      return { ok: false, msg: "本潛已有此增益。" };
    }
    if (!spendAbyssPendingGrit(ad.run, buff.cost)) {
      return { ok: false, msg: `待結算淵砂不足（需×${buff.cost}）。` };
    }
    ad.run.diveBuffs = [...(ad.run.diveBuffs || []), buffId];
    if (buff.hpMult && buff.hpMult !== 1) {
      for (const uid of ad.run.squadUids || []) {
        const hit = findOwnedPet(state, uid);
        if (!hit?.pet) continue;
        const st = abyssPetCombatStats(state, hit.pet, ad.run.diveBuffs);
        const prev = ad.run.hpByUid[uid] || { hp: st.maxHp, maxHp: st.maxHp };
        const ratio = prev.maxHp > 0 ? prev.hp / prev.maxHp : 1;
        ad.run.hpByUid[uid] = {
          maxHp: st.maxHp,
          hp: prev.hp <= 0 ? 0 : Math.max(1, Math.round(ratio * st.maxHp)),
        };
      }
    }
    ad.run.pendingEvent = null;
    pushLog(state, `行商成交——【${buff.name}】（本潛 · 待結算淵砂 −${buff.cost}）。`);
    return {
      ok: true,
      msg: `行商：獲得【${buff.name}】（本潛有效）。`,
      roster: abyssSquadRosterView(state, ad.run),
      diveBuffs: [...ad.run.diveBuffs],
      pendingGrit: ad.run.pendingGrit | 0,
    };
  }

  if (optionType === "merchant_purge") {
    const mutIds = [...(ad.run.mutationIds || [])];
    if (!mutIds.length) {
      return { ok: false, msg: "目前冇突變可移除。" };
    }
    if (!spendAbyssPendingGrit(ad.run, ABYSS_INSURANCE_COST)) {
      return { ok: false, msg: `待結算淵砂不足（需×${ABYSS_INSURANCE_COST}）。` };
    }
    const seed = `${ad.run.seed}:purge${ad.run.depth}:${mutIds.length}`;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = (h >>> 0) % mutIds.length;
    const removed = mutIds.splice(idx, 1)[0];
    ad.run.mutationIds = mutIds;
    ad.run.pendingEvent = null;
    const mut = (typeof ABYSS_MUTATIONS !== "undefined" ? ABYSS_MUTATIONS[removed] : null)
      || { name: removed };
    pushLog(state, `行商淨潮——移除【${mut.name || removed}】（待結算淵砂 −${ABYSS_INSURANCE_COST}）。`);
    return {
      ok: true,
      msg: `行商：移除突變【${mut.name || removed}】。`,
      roster: abyssSquadRosterView(state, ad.run),
      mutationIds: [...mutIds],
      removedMutationId: removed,
      pendingGrit: ad.run.pendingGrit | 0,
    };
  }



  if (optionType === "altar") {
    const dead = (ad.run.squadUids || []).filter((uid) => (ad.run.hpByUid?.[uid]?.hp | 0) <= 0);
    if (!dead.length) {
      ad.run.pendingEvent = null;
      return { ok: true, msg: "祭壇無回應——冇陣亡靈寵可復活。", roster: abyssSquadRosterView(state, ad.run) };
    }
    const pick = opts.uid && dead.includes(opts.uid) ? opts.uid : dead[0];
    const slot = ad.run.hpByUid[pick];
    const maxHp = Math.max(1, slot?.maxHp | 0);
    ad.run.hpByUid[pick] = {
      maxHp,
      hp: Math.max(1, Math.round(maxHp * ABYSS_ALTAR_REVIVE_HP)),
    };
    ad.run.pendingEvent = null;
    const hit = findOwnedPet(state, pick);
    const name = hit?.pet ? displayPetName(hit.pet) : pick;
    pushLog(state, `祭壇靈光——【${name}】復活。`);
    return {
      ok: true,
      msg: `祭壇：【${name}】以 ${Math.round(ABYSS_ALTAR_REVIVE_HP * 100)}% 血復活。`,
      roster: abyssSquadRosterView(state, ad.run),
      revivedUid: pick,
    };
  }

  return { ok: false, msg: "未知事件。" };
}

/** 撤退結算 */
export function retreatAbyssDive(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run) return { ok: false, msg: "沒有進行中的深潛。" };
  const grit = ad.run.pendingGrit | 0;
  const depth = ad.run.depth | 0;
  if (grit > 0) addMaterials(state, { [ABYSS_GRIT_ID]: grit });
  ad.run = null;
  pushLog(state, `撤出潮淵（已通第 ${depth} 層）· 淵砂×${grit}。`);
  return {
    ok: true,
    grit,
    depth,
    clearedDepth: depth,
    msg: depth
      ? `撤退結算 · 已通第 ${depth} 層 · 淵砂×${grit}`
      : `撤退結算 · 淵砂×${grit}`,
  };
}


/** 突變層 2 選 1 */
export function resolveAbyssMutationChoice(state, mutationId, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run?.pendingMutationChoice) {
    return { ok: false, msg: "沒有待選突變。" };
  }
  normalizeAbyssRunSquad(ad.run);
  const choice = ad.run.pendingMutationChoice;
  const opt = (choice.options || []).find((o) => o.mutationId === mutationId);
  if (!opt) return { ok: false, msg: "無效突變選項。" };
  const depth = choice.depth | 0;
  const { dropped } = applyAbyssMutationId(ad.run, mutationId);
  ad.run.mutationCommittedForDepth = depth;
  ad.run.pendingMutationChoice = null;
  const mut = ABYSS_MUTATIONS[mutationId] || { name: mutationId };
  if (dropped.length) {
    pushLog(
      state,
      `突變已達上限 ${ABYSS_MAX_ACTIVE_MUTATIONS}：接受【${mut.name}】並頂替最舊（移除 ${dropped.length} 條）。`
    );
  } else {
    pushLog(state, `接受潮淵突變【${mut.name}】。`);
  }
  return {
    ok: true,
    msg: `接受突變【${mut.name}】——可挑戰第 ${depth} 層。`,
    mutationId,
    mutations: mapAbyssMutations(ad.run.mutationIds),
    mutationIds: [...(ad.run.mutationIds || [])],
    depth,
    roster: abyssSquadRosterView(state, ad.run),
  };
}

export function buyAbyssInsurance(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  const ad = ensureAbyssDive(state, now);
  if ((ad.insuranceCharges | 0) >= 1) {
    return { ok: false, msg: "已持有突變保險（每趟限 1）。" };
  }
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: ABYSS_INSURANCE_COST })) {
    return { ok: false, msg: `需要淵砂×${ABYSS_INSURANCE_COST}。` };
  }
  ad.insuranceCharges = 1;
  return { ok: true, msg: "已備突變保險——下場新突變可略過一次。" };
}

export function buyAbyssCosmetic(state, cosmeticId, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  const c = ABYSS_COSMETICS[cosmeticId];
  if (!c) return { ok: false, msg: "未知外觀。" };
  const ad = ensureAbyssDive(state, now);
  if (ad.cosmetics[cosmeticId]) return { ok: false, msg: "已擁有此外觀。" };
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: c.cost })) {
    return { ok: false, msg: `需要淵砂×${c.cost}。` };
  }
  ad.cosmetics[cosmeticId] = true;
  pushLog(state, `解鎖深潛外觀【${c.name}】。`);
  return { ok: true, msg: `解鎖【${c.name}】· ${c.desc}` };
}

export function buyAbyssEgg(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  const ad = ensureAbyssDive(state, now);
  if ((ad.eggsBoughtWeek | 0) >= ABYSS_EGG_WEEKLY_LIMIT) {
    return { ok: false, msg: `本週高階蛋已達上限（${ABYSS_EGG_WEEKLY_LIMIT}）。` };
  }
  if (!state.eggs) state.eggs = [];
  if (state.eggs.length >= EGG_CAP) return { ok: false, msg: "蛋庫已滿。" };
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: ABYSS_EGG_COST })) {
    return { ok: false, msg: `需要淵砂×${ABYSS_EGG_COST}。` };
  }
  const egg = makeEgg("A", "abyss_dive", now);
  egg.desc = "潮淵高階蛋 · 較易出稀有／血紋";
  state.eggs.push(egg);
  ad.eggsBoughtWeek = (ad.eggsBoughtWeek | 0) + 1;
  pushLog(state, "兌得潮淵高階蛋。");
  return { ok: true, egg, msg: "獲得潮淵高階蛋（A）。" };
}

/** 潮淵每週限兌融合核 */
export function buyAbyssFusionCore(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  const ad = ensureAbyssDive(state, now);
  if ((ad.fusionCoresBoughtWeek | 0) >= ABYSS_FUSION_CORE_WEEKLY_LIMIT) {
    return { ok: false, msg: `本週融合核已達上限（${ABYSS_FUSION_CORE_WEEKLY_LIMIT}）。` };
  }
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: ABYSS_FUSION_CORE_COST })) {
    return { ok: false, msg: `需要淵砂×${ABYSS_FUSION_CORE_COST}。` };
  }
  if (!state.materials) state.materials = emptyMaterials();
  state.materials.fusion_core = Math.floor(state.materials.fusion_core || 0) + 1;
  ad.fusionCoresBoughtWeek = (ad.fusionCoresBoughtWeek | 0) + 1;
  pushLog(state, `淵砂兌換融合核×1（本週 ${ad.fusionCoresBoughtWeek}/${ABYSS_FUSION_CORE_WEEKLY_LIMIT}）。`);
  return {
    ok: true,
    msg: `獲得融合核×1（持有 ${state.materials.fusion_core}）`,
    have: state.materials.fusion_core,
  };
}

/** 淵核：永久小幅攻擊加成（有 cap；淵砂長期 sink） */
export function buyAbyssPowerNode(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  const ad = ensureAbyssDive(state, now);
  const have = ad.powerNodes | 0;
  if (have >= ABYSS_POWER_NODE_MAX) {
    return { ok: false, msg: `淵核已達上限（${ABYSS_POWER_NODE_MAX}）。` };
  }
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: ABYSS_POWER_NODE_COST })) {
    return { ok: false, msg: `需要淵砂×${ABYSS_POWER_NODE_COST}。` };
  }
  ad.powerNodes = have + 1;
  const pct = Math.round(ad.powerNodes * ABYSS_POWER_NODE_ATK * 100);
  pushLog(state, `點亮淵核 ${ad.powerNodes}/${ABYSS_POWER_NODE_MAX}（全隊攻擊 +${pct}%）。`);
  return {
    ok: true,
    msg: `淵核 ${ad.powerNodes}/${ABYSS_POWER_NODE_MAX} · 攻擊 +${pct}%`,
    powerNodes: ad.powerNodes,
  };
}

/** 淵砂兌換潮轉符（入背包道具；永久轉屬） */
export function buyAbyssTideShiftCharm(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: `潮淵未解鎖（需主脊階段${ABYSS_UNLOCK_SPINE_STAGE}）。` };
  }
  ensureAbyssDive(state, now);
  ensureItems(state);
  if (!spendMaterials(state, { [ABYSS_GRIT_ID]: ABYSS_TIDE_SHIFT_COST })) {
    return { ok: false, msg: `需要淵砂×${ABYSS_TIDE_SHIFT_COST}。` };
  }
  state.items.tide_shift_charm = Math.floor(state.items.tide_shift_charm || 0) + 1;
  pushLog(state, `淵砂兌換潮轉符×1（持有 ${state.items.tide_shift_charm}）。`);
  return {
    ok: true,
    msg: `兌換潮轉符×1（持有 ${state.items.tide_shift_charm}）`,
    have: state.items.tide_shift_charm,
  };
}

function pushLog(state, line) {
  if (!state.log) state.log = [];
  state.log.unshift(line);
  if (state.log.length > 60) state.log.length = 60;
}

export { skipTutorial } from "./tutorial.js";

export {
  STAGES,
  REALMS,
  DUNGEONS,
  WILD_PETS,
  SKILLS,
  GEAR,
  MASTER_EQUIP_SLOTS,
  SLOT_LABEL,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  ACTIVE_PET_BASE,
  ACTIVE_PET_UNLOCK_STAGE,
  activePetMaxForState,
  isSpineStageBossFloor,
  FUSION_MAX_STAGE,
  FUSION_RULES,
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
  BOND_FAIL_RATE_BONUS,
  BOND_FAIL_RATE_CAP,
  BOND_COST_MAX,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  SKILL_MAX_LEVEL,
  SECOND_SKILL_UNLOCK,
  petLabel,
  skillInfo,
  masterSkillsForStage,
  ranchCapForStage,
  upgradeStoneCost,
  upgradeFeedCost,
  skillDustCost,
  fusionStoneCost,
  nextFusionStage,
  fusionMaterialNeed,
  elementMatchup,
  partySynergy,
  petSkillIds,
  petSpeciesBaseline,
  fusionAbsorbRate,
  bestiaryEntries,
  bestiarySpeciesSummary,
  bestiaryTotal,
  bestiaryCombatBonus,
  DAILY_QUESTS,
  PATH_QUESTS,
  ACHIEVEMENTS,
  BREED_GOALS,
  NICK_MAX_LEN,
  rarityInfo,
  RARITY_MAX,
  genLabel,
  petGeneration,
  hybridRecipeSummary,
  hybridRecipeMatrix,
  releaseSoulGain,
  eggDissolveSoul,
  releaseRefund,
  DUNGEON_TRIALS,
  KINDS,
  dungeonWaves,
  roleLabel,
  countDungeonRoles,
  evaluateDungeonConditions,
  breakthroughView,
  TACTICS,
  TACTIC_IDS,
  FORMATIONS,
  FORMATION_IDS,
  FORMATION_SLOT_COUNT,
  formationAllyPlacement,
  formationFoePlacement,
  GEAR_SETS,
  MATERIALS,
  ITEMS,
  ITEM_IDS,
  emptyItems,
  emptyItemBonus,
  RANCH_CAP_BONUS_MAX,
  HATCH_SLOT_BASE,
  HATCH_SLOT_BONUS_MAX,
  TRAIN_SITES,
  SPINE_ZONE_ID,
  SPINE_THEME_FLOORS,
  TRAIN_TIER_COUNT,
  TRAIN_DEPTH_MULT,
  TRAIN_ZONE_CHAIN,
  trainZoneMeta,
  upgradeMatCost,
  breedMatCost,
  skillMatCost,
  fusionMatCost,
  primaryTrainSiteForMat,
  suggestTrainForShortage,
  trainDailySpotlightView,
  trainSiteRatesView,
  trainDropMult,
  TRAIN_FOCUS_BONUS,
  TRAIN_DAILY_SPOT_BONUS,
  pickDailyTrainSpotlight,
  spineTrainProfile,
  spineFrontierTier,
  spineStageFromState,
  maxClearedTideTier,
  spineTrunkView,
  listSideBranches,
  isBranchDungeonId,
  resolveBranchDungeon,
  branchFloors,
  isSideBranchUnlocked,
  sideBranchById,
  EGG_TIERS,
  stageAt,
  nextStageAt,
  dungeonsForRealm,
  generateDailyDungeon,
  buildDungeonForTier,
  dungeonTrialFor,
  dungeonDisplayName,
  rollTideKeyDrop,
  DUNGEON_TIDE_KEY,
};
