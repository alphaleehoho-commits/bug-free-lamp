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
  rollGearDrop,
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
  releaseRefund,
  NICK_MAX_LEN,
  DAILY_QUESTS,
  PATH_QUESTS,
  evalPathQuest,
  ACHIEVEMENTS,
  todayKey,
  yesterdayKey,
  OFFLINE_HINT_SEC,
  LOGIN_STREAK_REWARDS,
  rarityInfo,
  RARITY_MAX,
  SPECIES,
  PERSONALITIES,
  petGeneration,
  genLabel,
  childGenerationOdds,
  hybridRecipeForKinds,
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
  genCombatMult,
  genAwakenBonus,
  BREED_ELEMENT_MUTATION_RATE,
  weekKey,
  evaluateDungeonChallenge,
  personalityCombatFor,
  gearSetBonus,
  DISPATCH_MISSIONS,
  DISPATCH_SLOT_MAX,
  TIDE_SEAL_MAX,
  TIDE_SEAL_MIN_REALM,
  tideSealCombatMult,
  tideSealGainForRealm,
  GEAR_SETS,
  emptyMaterials,
  MATERIALS,
  MATERIAL_IDS,
  upgradeMatCost,
  breedMatCost,
  skillMatCost,
  fusionMatCost,
  TRAIN_SITES,
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
  TRAIN_ZONE_CHAIN,
  trainZoneMeta,
  trainTierThreat,
  trainWardenThreat,
  rollTideKeyDrop,
  DUNGEON_TIDE_KEY,
  ABYSS_GRIT_ID,
  ABYSS_ENTRY_MAT_ID,
  ABYSS_ENTRY_TOKEN_COST,
  ABYSS_WIPE_KEEP_RATE,
  ABYSS_MUTATION_EVERY,
  ABYSS_MAX_ACTIVE_MUTATIONS,
  ABYSS_MUTATIONS,
  ABYSS_MUTATION_IDS,
  ABYSS_COSMETICS,
  ABYSS_COSMETIC_IDS,
  ABYSS_INSURANCE_COST,
  ABYSS_EGG_COST,
  ABYSS_EGG_WEEKLY_LIMIT,
  emptyAbyssDive,
  abyssFloorGrit,
  abyssHash,
  pickAbyssMutationId,
  abyssCosmeticCombatMult,
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

/** 舊存檔：用秘境首通補域主標記，避免已解鎖潮域被鎖返 */
function migrateTrainMap(parsed) {
  const base = emptyTrainMap();
  const from = parsed?.trainMap || {};
  base.wardenCleared = { ...(from.wardenCleared || {}) };
  base.zones = { ...(from.zones || {}) };
  const clears = parsed?.clearedDungeons || {};
  // 依鏈推：通關對應秘境 → 視為已打通「開該域所需」之前的域主
  for (const z of TRAIN_ZONE_CHAIN) {
    if (!z.prevZone) continue;
    const site = trainSiteById(z.id);
    if (site?.needClear && clears[site.needClear]) {
      base.wardenCleared[z.prevZone] = true;
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
  return state.trainMap;
}

function ensureZoneProgress(state, zoneId) {
  ensureTrainMap(state);
  const id = zoneId || state.trainSite || "shore";
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

/** 深度倍率索引：0–3 霧階；4＝已通域主。可手選已通霧階掛機 */
export function trainDepthIndex(state, zoneId) {
  ensureTrainMap(state);
  const id = zoneId || state.trainSite || "shore";
  const z = ensureZoneProgress(state, id);
  const maxIdx = state.trainMap.wardenCleared?.[id] ? 4 : Math.min(TRAIN_TIER_COUNT - 1, Math.max(0, z.tiersCleared | 0));
  const chosen = z.idleDepth;
  if (chosen != null && chosen >= 0 && chosen <= maxIdx) return chosen;
  return maxIdx;
}

/** 手動選擇掛機深度（只能選已通關霧階或域主） */
export function setTrainDepth(state, depthIdx) {
  ensureTrainMap(state);
  const zoneId = state.trainSite || "shore";
  const z = ensureZoneProgress(state, zoneId);
  const maxIdx = state.trainMap.wardenCleared?.[zoneId] ? 4 : Math.min(TRAIN_TIER_COUNT - 1, Math.max(0, z.tiersCleared | 0));
  const idx = depthIdx | 0;
  if (idx < 0 || idx > maxIdx) {
    return { ok: false, msg: `只可選已通關霧階（0–${maxIdx}）。` };
  }
  z.idleDepth = idx;
  const label = idx >= TRAIN_TIER_COUNT ? "域主" : `霧階${idx + 1}`;
  return { ok: true, msg: `掛機深度：${label} · ×${(TRAIN_DEPTH_MULT[idx] ?? 1).toFixed(2)}` };
}

export function trainDepthMultFor(state, zoneId) {
  const idx = trainDepthIndex(state, zoneId);
  return TRAIN_DEPTH_MULT[idx] ?? 1;
}

/** 出戰 vs 當前霧階威脅 → 掛機效率（0.35–1.35；無出戰保底 0.7） */
export function trainClearEfficiency(state, zoneId = null) {
  const id = zoneId || state.trainSite || "shore";
  const power = partyCombatPower(state.pets);
  const depthIdx = trainDepthIndex(state, id);
  const threat = trainTierThreat(id, depthIdx);
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
    trainSite: "shore",
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
    /** P6 */
    tactics: "balanced",
    shop: emptyShop(),
    dungeonDaily: null,
    /** P8 */
    formation: "balanced",
    /** P9 */
    dispatches: [],
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
  if (next.fusionLevel > FUSION_MAX_STAGE) next.fusionLevel = FUSION_MAX_STAGE;
  if (next.skillLevel == null) next.skillLevel = 1;
  if (next.skillLevel > SKILL_MAX_LEVEL) next.skillLevel = SKILL_MAX_LEVEL;
  if (next.rarity == null) next.rarity = 0;
  if (next.rarity > RARITY_MAX) next.rarity = RARITY_MAX;
  if (!next.rarityName) next.rarityName = rarityInfo(next.rarity).name;
  next.generation = petGeneration(next);
  if (next.personality2Id && PERSONALITIES[next.personality2Id]) {
    next.personality2Name = PERSONALITIES[next.personality2Id].name;
  } else {
    next.personality2Id = next.personality2Id || null;
    next.personality2Name = next.personality2Name || null;
  }
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
      return {
        uid: e.uid,
        tier: t.id,
        name: e.name || t.name,
        source: e.source || "unknown",
        desc: e.desc,
        startedAt,
        readyAt,
        claimed: false,
      };
    });
}

export function ranchCap(state) {
  return ranchCapForStage(state.realm);
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
      trainSite: TRAIN_SITES.some((s) => s.id === parsed.trainSite) ? parsed.trainSite : "shore",
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
      tactics: TACTIC_IDS.includes(parsed.tactics) ? parsed.tactics : "balanced",
      formation: FORMATION_IDS.includes(parsed.formation) ? parsed.formation : "balanced",
      shop: parsed.shop || emptyShop(),
      dungeonDaily: parsed.dungeonDaily || null,
      winStreak: parsed.winStreak || 0,
      dispatches: Array.isArray(parsed.dispatches) ? parsed.dispatches : [],
      tideSeals: parsed.tideSeals || 0,
      loginStreak: parsed.loginStreak?.lastLoginDate
        ? { ...emptyLoginStreak(), ...parsed.loginStreak }
        : emptyLoginStreak(),
      tutorial: parsed.tutorial,
      abyssDive: { ...emptyAbyssDive(), ...(parsed.abyssDive || {}) },
    };
    normalizeTutorial(merged);
    healTutorialProgress(merged);
    return merged;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTick: Date.now() }));
}

export function realmInfo(state) {
  return stageAt(state.realm);
}

export function nextRealm(state) {
  return nextStageAt(state.realm);
}

/** 當日秘境完整定義（tier 公式 + 每日變體） */
export function resolveDungeon(state, dungeonId) {
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
    const pe = IDLE_BY_PERSONALITY[p.personalityId] || { feed: 0.06, dust: 0.025, token: 0.004 };
    const pe2 = p.personality2Id ? IDLE_BY_PERSONALITY[p.personality2Id] : null;
    const el = IDLE_BY_ELEMENT[p.elementId] || { feed: 1, dust: 1 };
    const feedRate = pe2 ? pe.feed * 0.7 + pe2.feed * 0.3 : pe.feed;
    const dustRate = pe2 ? pe.dust * 0.7 + pe2.dust * 0.3 : pe.dust;
    const tokenRate = pe2 ? pe.token * 0.7 + (pe2.token || 0) * 0.3 : pe.token || 0;
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

/** 練功潮域掛機產材料（產物表不變；產量 × 深度 × 出戰效率） */
export function tickTrainSite(state, elapsedSec) {
  if (elapsedSec <= 0) return { mats: {}, feed: 0, dust: 0 };
  ensureTrainMap(state);
  const site = trainSiteById(state.trainSite);
  if (!isTrainSiteUnlocked(state, site.id)) {
    state.trainSite = "shore";
  }
  const active = trainSiteById(state.trainSite);
  if (!state.materials) state.materials = emptyMaterials();
  const depthMult = trainDepthMultFor(state, active.id);
  const eff = trainClearEfficiency(state, active.id);
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

export function setTrainSite(state, siteId) {
  if (!TRAIN_SITES.some((s) => s.id === siteId)) {
    return { ok: false, msg: "未知潮域。" };
  }
  if (!isTrainSiteUnlocked(state, siteId)) {
    const site = trainSiteById(siteId);
    return { ok: false, msg: `尚未解鎖【${site.name}】（${trainSiteUnlockHint(site) || "需打通上一域主"}）。` };
  }
  state.trainSite = siteId;
  ensureZoneProgress(state, siteId);
  return { ok: true, msg: `潮域：${trainSiteById(siteId).name}` };
}

export function trainSitesView(state) {
  ensureTrainMap(state);
  const cur = state.trainSite || "shore";
  const spot = trainDailySpotlightView();
  return TRAIN_SITES.map((s) => {
    const z = ensureZoneProgress(state, s.id);
    const wardenDone = !!state.trainMap.wardenCleared?.[s.id];
    const depthIdx = trainDepthIndex(state, s.id);
    const depthMult = TRAIN_DEPTH_MULT[depthIdx] ?? 1;
    const eff = s.id === cur ? trainClearEfficiency(state, s.id) : null;
    const meta = trainZoneMeta(s.id);
    return {
      ...s,
      unlocked: isTrainSiteUnlocked(state, s.id),
      selected: s.id === cur,
      unlockHint: trainSiteUnlockHint(s),
      isDailySpot: spot?.siteId === s.id,
      rates: trainSiteRatesView(s),
      tiersCleared: z.tiersCleared | 0,
      tierCount: TRAIN_TIER_COUNT,
      wardenCleared: wardenDone,
      depthMult,
      depthLabel: wardenDone
        ? "域主已通"
        : `霧階 ${Math.min((z.tiersCleared | 0) + 1, TRAIN_TIER_COUNT)}/${TRAIN_TIER_COUNT}`,
      efficiency: eff,
      keyMatId: meta.keyMatId,
      keyName: MATERIALS[meta.keyMatId]?.name || "潮鑰",
      keyHave: Math.floor(state.materials?.[meta.keyMatId] || 0),
      canAdvance: !wardenDone && (z.tiersCleared | 0) < TRAIN_TIER_COUNT,
      clearReady: !!z.clearReady,
      canClaimNext:
        !wardenDone &&
        !!z.clearReady &&
        (z.tiersCleared | 0) < TRAIN_TIER_COUNT - 1,
      canChallengeWarden: !wardenDone && (z.tiersCleared | 0) >= TRAIN_TIER_COUNT,
      canRematchWarden: wardenDone,
      idleDepth: trainDepthIndex(state, s.id),
      maxDepth: wardenDone ? 4 : Math.min(TRAIN_TIER_COUNT - 1, Math.max(0, z.tiersCleared | 0)),
      lastClearLine: z.lastClear?.line || null,
      lastClear: z.lastClear || null,
    };
  });
}

/**
 * 領取霧階推進：需掛機戰鬥先清完一輪五波（z.clearReady）。
 * 唔再開即時戰鬥／彈窗。
 */
export function claimTrainTierClear(state) {
  ensureTrainMap(state);
  const zoneId = state.trainSite || "shore";
  if (!isTrainSiteUnlocked(state, zoneId)) {
    return { ok: false, msg: "潮域未解鎖。" };
  }
  const z = ensureZoneProgress(state, zoneId);
  if (state.trainMap.wardenCleared?.[zoneId]) {
    return { ok: false, msg: "域主已通——可複打域主刷稀有材，或切換其他潮域。" };
  }
  if ((z.tiersCleared | 0) >= TRAIN_TIER_COUNT) {
    return { ok: false, msg: "霧階已清——請挑戰域主關。" };
  }
  if (!z.clearReady) {
    return { ok: false, msg: `需先掛機清完一輪 ${TRAIN_MIST_WAVE_COUNT} 波，先可去下一層。` };
  }
  const tier = z.tiersCleared | 0;
  const site = trainSiteById(zoneId);
  z.clearReady = false;
  z.tiersCleared = tier + 1;
  bumpDaily(state, "train_tier", 1);
  const primary = site.primaryMat;
  const reward = {};
  if (primary) {
    if (!state.materials) state.materials = emptyMaterials();
    state.materials[primary] = (state.materials[primary] || 0) + 1;
    reward[primary] = 1;
  }
  state.stones = (state.stones || 0) + 5;
  pushLog(
    state,
    `【${site.name}】推進至霧階${tier + 1}通關！產量上限升至 ×${trainDepthMultFor(state, zoneId).toFixed(2)}。`
  );
  const msg =
    z.tiersCleared >= TRAIN_TIER_COUNT
      ? `霧階全破 · 可挑戰域主（需${MATERIALS[trainZoneMeta(zoneId).keyMatId]?.name || "潮鑰"}）`
      : `已進霧階${tier + 1} · 深度 ×${trainDepthMultFor(state, zoneId).toFixed(2)}`;
  return {
    ok: true,
    msg,
    tiersCleared: z.tiersCleared,
    reward,
  };
}

/** @deprecated 改用 claimTrainTierClear；掛機五波循環後再領取 */
export function advanceTrainTier(state) {
  return claimTrainTierClear(state);
}

/** 挑戰／複打域主（扣潮鑰；首次開下一潮域；複打掉稀有材） */
export function challengeTrainWarden(state) {
  ensureTrainMap(state);
  const zoneId = state.trainSite || "shore";
  if (!isTrainSiteUnlocked(state, zoneId)) {
    return { ok: false, msg: "潮域未解鎖。" };
  }
  const z = ensureZoneProgress(state, zoneId);
  const meta = trainZoneMeta(zoneId);
  const site = trainSiteById(zoneId);
  const rematch = !!state.trainMap.wardenCleared?.[zoneId];
  if (!rematch && (z.tiersCleared | 0) < TRAIN_TIER_COUNT) {
    return { ok: false, msg: "請先攻破全部霧階。" };
  }
  if (!(state.pets || []).length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }
  const keyId = meta.keyMatId;
  if (!state.materials) state.materials = emptyMaterials();
  if (Math.floor(state.materials[keyId] || 0) < 1) {
    return {
      ok: false,
      msg: `潮鑰不足（需【${MATERIALS[keyId]?.name || keyId}】· 秘境高機率掉落）。`,
    };
  }
  // 勝負都扣
  state.materials[keyId] -= 1;
  bumpDaily(state, "train_warden", 1);
  const combat = runTrainLayerCombat(state, { zoneId, tierIndex: TRAIN_TIER_COUNT, mode: "warden" });
  if (!combat.ok) {
    // 已扣鑰但戰鬥無法開打（理論上僅無出戰）
    return combat;
  }
  if (!combat.won) {
    pushLog(state, `【${site.name}】域主未破——出戰隊未能清完 ${TRAIN_WARDEN_WAVE_COUNT} 波，潮鑰已耗。`);
    return {
      ok: false,
      msg: `域主未破 · 已扣潮鑰 · ${TRAIN_WARDEN_WAVE_COUNT} 波未清或全滅`,
      combatKind: "train",
      keySpent: true,
      rematch,
      ...combat,
    };
  }

  if (!rematch) {
    state.trainMap.wardenCleared[zoneId] = true;
    const nextMeta = TRAIN_ZONE_CHAIN.find((x) => x.prevZone === zoneId);
    let unlockMsg = "";
    if (nextMeta) {
      unlockMsg = ` · 解鎖【${trainSiteById(nextMeta.id).name}】`;
      // 自動切入下一潮域
      if (isTrainSiteUnlocked(state, nextMeta.id)) {
        state.trainSite = nextMeta.id;
        ensureZoneProgress(state, nextMeta.id);
      }
    }
    pushLog(state, `打通【${site.name}】域主！本域掛機深度拉滿${unlockMsg}。`);
    return {
      ok: true,
      msg: `域主已破 · 深度 ×${trainDepthMultFor(state, zoneId).toFixed(2)}${unlockMsg}`,
      combatKind: "train",
      firstClear: true,
      unlockedZoneId: nextMeta?.id || null,
      keySpent: true,
      ...combat,
    };
  }

  // 複打獎勵
  const rem = meta.rematch || {};
  if (rem.stones) state.stones = (state.stones || 0) + rem.stones;
  if (rem.materials) addMaterials(state, rem.materials);
  const bits = [];
  if (rem.stones) bits.push(`${rem.stones}石`);
  for (const [id, n] of Object.entries(rem.materials || {})) {
    bits.push(`${MATERIALS[id]?.name || id}×${n}`);
  }
  pushLog(state, `複打【${site.name}】域主成功，獲 ${bits.join("／")}。`);
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
  shore: "潮霧",
  ruins: "廢墟",
  deep: "深層",
  mistveil: "霧帷",
  core: "心核",
  fusehall: "融砂",
  abyss: "暗潮",
};

const TRAIN_FOE_ELEMENT = {
  shore: "tide",
  ruins: "stone",
  deep: "gloom",
  mistveil: "gale",
  core: "tide",
  fusehall: "flame",
  abyss: "gloom",
};

/** 依潮域／霧階組成多波敵陣（一層霧階 = TRAIN_MIST_WAVE_COUNT 波） */
function buildTrainCombatWaves(zoneId, tierIndex, { warden = false } = {}) {
  const threat = warden ? trainWardenThreat(zoneId) : trainTierThreat(zoneId, tierIndex);
  const site = trainSiteById(zoneId);
  const prefix = TRAIN_FOE_PREFIX[zoneId] || "潮域";
  const elem = TRAIN_FOE_ELEMENT[zoneId] || "gloom";
  const tier = tierIndex | 0;
  const tierScale = 1 + tier * 0.06;

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
    hp: Math.max(40, Math.round(threat * 1.62 * scale * tierScale)),
    atk: Math.max(5, Math.round(threat * 0.2 * scale * tierScale)),
    spd: Math.max(6, Math.round(6 + threat * 0.065 * scale)),
    element: elem,
    role: "elite",
    skills: ["tide_crush", "coral_spike"].filter((id) => SKILLS[id]),
  });

  const mkBoss = (name) => ({
    name,
    hp: Math.max(80, Math.round(threat * 2.55 * tierScale)),
    atk: Math.max(8, Math.round(threat * 0.24 * tierScale)),
    spd: Math.max(7, Math.round(7 + threat * 0.075)),
    element: "gloom",
    role: "boss",
    actions: 2,
    skills: ["tide_crush", "mist_veil", "coral_spike"].filter((id) => SKILLS[id]),
  });

  if (!warden) {
    return [
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
        label: `霧階${tier + 1}·精英`,
        enemies: [mkElite(`${prefix}精英`, 1.08 + tier * 0.04)],
      },
      {
        label: `霧階${tier + 1}·守門`,
        enemies: [mkElite(`${prefix}守門`, 1.22 + tier * 0.06)],
      },
    ];
  }

  const waves = [];
  for (let w = 0; w < TRAIN_WARDEN_WAVE_COUNT - 1; w += 1) {
    const scale = 0.88 + w * 0.07;
    if (w === TRAIN_WARDEN_WAVE_COUNT - 2) {
      waves.push({
        label: `${site.name}精英`,
        enemies: [mkElite(`${prefix}域衛`, scale + 0.18)],
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
  waves.push({ label: `${site.name}域主`, enemies: [mkBoss(`${site.name}域主`)] });
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
  const atkMult = synergy.atkMult * dex.atkMult * sealMult * cos.atkMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult * cos.hpMult;
  const allies = [];
  for (const p of state.pets) {
    const skills = petSkillIds(p);
    const gen = petGeneration(p);
    const gMult = genCombatMult(gen);
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
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * gMult * fAtk * pAtk * bm.atk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd * bm.spd),
      elementId: p.elementId,
      skillLevel: p.skillLevel ?? 1,
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
  const site = trainSiteById(zoneId);
  const tier = tierIndex | 0;
  const waves = buildTrainCombatWaves(zoneId, tier, { warden });
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

  const layerLabel = warden ? `${site.name}域主關` : `霧階${tier + 1}`;
  transcript.push(`御靈師進入【${site.name}】${layerLabel}（${waves.length} 波）。`);
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
        say(`折戟【${site.name}】${layerLabel}……出戰隊全滅。`);
        break;
      }
      if (down === "wave") {
        if (advanceOrWin()) {
          won = true;
          ended = true;
          say(`清完 ${waves.length} 波，攻破【${site.name}】${layerLabel}！`);
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
  if (!(state.pets || []).length) return null;
  const zoneId = state.trainSite || "shore";
  if (!isTrainSiteUnlocked(state, zoneId)) return null;
  const z = ensureZoneProgress(state, zoneId);
  const wardenDone = !!state.trainMap.wardenCleared?.[zoneId];
  const canUnlockNext = !wardenDone && (z.tiersCleared | 0) < TRAIN_TIER_COUNT;
  const tierIndex = canUnlockNext
    ? z.tiersCleared | 0
    : Math.min(TRAIN_TIER_COUNT - 1, Math.max(0, trainDepthIndex(state, zoneId)));
  const waves = buildTrainCombatWaves(zoneId, tierIndex, { warden: false });
  const { allies, tactics } = buildTrainCombatAllies(state);
  if (!allies.length) return null;
  _combatUid = 0;
  tagCombatUnits(allies, "a");
  const foes = tagCombatUnits(spawnWaveFoes(waves[0]), "f");
  const site = trainSiteById(zoneId);
  const petSig = (state.pets || []).map((p) => `${p.uid}:${p.atk}:${p.hp}:${p.spd}`).join("|");
  return {
    zoneId,
    tierIndex,
    canUnlockNext,
    /** 本輪是否首次挑戰當前未通霧階（首通文案用） */
    isFirstClear: canUnlockNext && !z.clearReady,
    clearReady: !!z.clearReady,
    petSig,
    waves,
    waveCount: waves.length,
    waveIndex: 0,
    allies,
    foes,
    tactics,
    round: 0,
    maxRounds: 60,
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
    layerLabel: `霧階${tierIndex + 1}`,
    siteName: site.name,
    efficiency: trainClearEfficiency(state, zoneId),
    depthMult: trainDepthMultFor(state, zoneId),
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
    const isLastMist = (session.tierIndex | 0) >= TRAIN_TIER_COUNT - 1;
    session.lastText = isLastMist
      ? `清完 ${session.waves.length} 波！霧階全破`
      : `清完 ${session.waves.length} 波！可去下一層`;
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
 * 掛機清完一輪後：
 * - 仲有下一霧階 → 標記 clearReady，顯示「去下一層」
 * - 已係最後霧階（下一關係域主）→ 自動領取，唔顯示「去下一層」
 */
export function markTrainIdleClearReady(state, session) {
  if (!session?.canUnlockNext || !session.won) {
    return { ok: false, autoClaimed: false };
  }
  const isLastMist = (session.tierIndex | 0) >= TRAIN_TIER_COUNT - 1;
  if (isLastMist) {
    const z = ensureZoneProgress(state, session.zoneId);
    z.clearReady = true;
    const claim = claimTrainTierClear(state);
    session.clearReady = false;
    session.canUnlockNext = false;
    return { ok: !!claim.ok, autoClaimed: true, claim };
  }
  const z = ensureZoneProgress(state, session.zoneId);
  z.clearReady = true;
  session.clearReady = true;
  return { ok: true, autoClaimed: false };
}

/** UI：閒置掛機戰場摘要（建立 session 用） */
export function trainIdleCombatView(state) {
  ensureTrainMap(state);
  const zoneId = state.trainSite || "shore";
  const site = trainSiteById(zoneId);
  const z = ensureZoneProgress(state, zoneId);
  const depthIdx = trainDepthIndex(state, zoneId);
  const eff = trainClearEfficiency(state, zoneId);
  const depthMult = trainDepthMultFor(state, zoneId);
  const wardenDone = !!state.trainMap.wardenCleared?.[zoneId];
  const canUnlockNext = !wardenDone && (z.tiersCleared | 0) < TRAIN_TIER_COUNT;
  const tierIndex = canUnlockNext
    ? z.tiersCleared | 0
    : Math.min(TRAIN_TIER_COUNT - 1, Math.max(0, depthIdx));
  return {
    zoneId,
    zoneName: site.name,
    tierIndex,
    canUnlockNext,
    clearReady: !!z.clearReady,
    lastClearLine: z.lastClear?.line || null,
    lastClear: z.lastClear || null,
    depthLabel: wardenDone
      ? "域主已通"
      : `霧階 ${Math.min((z.tiersCleared | 0) + 1, TRAIN_TIER_COUNT)}/${TRAIN_TIER_COUNT}`,
    depthMult,
    efficiency: eff,
    power: partyCombatPower(state.pets),
    petCount: (state.pets || []).length,
    waveCount: TRAIN_MIST_WAVE_COUNT,
    logLine:
      !(state.pets || []).length
        ? "未出戰——掛機效率最低（請編成出戰隊）"
        : canUnlockNext
          ? `掛機清場 · ${TRAIN_MIST_WAVE_COUNT} 波循環 · 效率 ×${eff.toFixed(2)}`
          : `掛機清場中 · 效率 ×${eff.toFixed(2)} · 深度 ×${depthMult.toFixed(2)}`,
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

export function tickCultivation(state, now = Date.now()) {
  ensureDaily(state);
  ensureLoginStreak(state, now);
  const elapsed = Math.min(Math.max(0, now - state.lastTick) / 1000, 3600 * 8);
  const qiBefore = state.qi;
  const feedBefore = state.feed || 0;
  const dustBefore = state.dust || 0;
  const matsBefore = { ...(state.materials || emptyMaterials()) };

  const ranchBonus = (state.ranch?.length || 0) * 0.02;
  const bondBonus = 1 + state.pets.length * 0.18 + ranchBonus;
  const site = trainSiteById(state.trainSite);
  const siteMult = isTrainSiteUnlocked(state, site.id) ? site.qiMult || 1 : 1;
  const rate = realmInfo(state).rate * bondBonus * siteMult;
  state.qi += rate * elapsed;
  tickRanchIdle(state, elapsed);
  const trainGain = tickTrainSite(state, elapsed);

  // 每日：掛機累積
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

  if (elapsed >= OFFLINE_HINT_SEC) {
    const qiGain = state.qi - qiBefore;
    const feedGain = (state.feed || 0) - feedBefore;
    const dustGain = (state.dust || 0) - dustBefore;
    const matBits = {};
    for (const id of MATERIAL_IDS) {
      const d = (state.materials?.[id] || 0) - (matsBefore[id] || 0);
      const n = Math.round(d);
      if (n > 0) matBits[id] = n;
    }
    state.offlineHint = {
      sec: Math.floor(elapsed),
      qi: Math.round(qiGain),
      feed: Math.round(feedGain),
      dust: Math.round(dustGain),
      materials: matBits,
      siteName: trainGain.site?.name || site.name,
      at: now,
    };
  }

  state.lastTick = now;
  checkAchievements(state);
  return state;
}

export function clearOfflineHint(state) {
  state.offlineHint = null;
  return state;
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
  const eggAdded = state.eggs.length < 6;
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
  return DAILY_QUESTS.map((q) => {
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

export function buyShopOffer(state, offerId) {
  ensureShop(state);
  const offer = state.shop.offers.find((o) => o.offerId === offerId);
  if (!offer) return { ok: false, msg: "商品不存在。" };
  if (offer.bought) return { ok: false, msg: "已售出。" };
  const payCost = tutorialShopPrice(state, offer.cost);
  if (state.stones < payCost) return { ok: false, msg: `靈石不足（需 ${payCost}）。` };

  if (offer.kind === "egg") {
    if (!state.eggs) state.eggs = [];
    if (state.eggs.length >= 6) return { ok: false, msg: "蛋欄已滿（最多 6）。" };
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

export function dispatchView(state) {
  if (!state.dispatches) state.dispatches = [];
  const now = Date.now();
  const busy = dispatchBusyUids(state);
  const active = state.dispatches
    .filter((d) => !d.claimed)
    .map((d) => {
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
    });
  const missions = DISPATCH_MISSIONS.map((m) => ({
    ...m,
    locked: !!(m.needSite && !isTrainSiteUnlocked(state, m.needSite)),
    lockLabel: m.needSite ? trainSiteById(m.needSite).name : null,
    slotsUsed: active.length,
    slotsMax: DISPATCH_SLOT_MAX,
  }));
  return { active, missions, busyUids: [...busy], slotsUsed: active.length, slotsMax: DISPATCH_SLOT_MAX };
}

export function startDispatch(state, missionId, petUids) {
  if (!state.dispatches) state.dispatches = [];
  const mission = DISPATCH_MISSIONS.find((m) => m.id === missionId);
  if (!mission) return { ok: false, msg: "任務不存在。" };
  if (mission.needSite && !isTrainSiteUnlocked(state, mission.needSite)) {
    const site = trainSiteById(mission.needSite);
    return { ok: false, msg: `需解鎖練功地【${site.name}】。` };
  }
  const active = state.dispatches.filter((d) => !d.claimed);
  if (active.length >= DISPATCH_SLOT_MAX) {
    return { ok: false, msg: `派遣欄已滿（${DISPATCH_SLOT_MAX}）。` };
  }
  const uids = Array.isArray(petUids) ? [...new Set(petUids)] : [];
  if (uids.length !== mission.needPets) {
    return { ok: false, msg: `需要派出 ${mission.needPets} 隻牧場靈寵。` };
  }
  const busy = dispatchBusyUids(state);
  for (const uid of uids) {
    if (busy.has(uid)) return { ok: false, msg: "有靈寵已在派遣中。" };
    if (state.pets.some((p) => p.uid === uid)) {
      return { ok: false, msg: "請先將靈寵撤回牧場再派遣。" };
    }
    const hit = findOwnedPet(state, uid);
    if (!hit || hit.list !== "ranch") return { ok: false, msg: "只能派遣牧場待命靈寵。" };
  }
  const now = Date.now();
  let durationMs = mission.durationMs;
  const timeMults = uids.map((uid) => {
    const hit = findOwnedPet(state, uid);
    const pe = PERSONALITIES[hit?.pet?.personalityId];
    const pe2 = PERSONALITIES[hit?.pet?.personality2Id];
    if (!pe && !pe2) return 1;
    if (!pe2) return pe.dispatchTime ?? 1;
    if (!pe) return pe2.dispatchTime ?? 1;
    return ((pe.dispatchTime ?? 1) * 0.7 + (pe2.dispatchTime ?? 1) * 0.3);
  });
  if (timeMults.length) {
    durationMs = Math.round(
      durationMs * (timeMults.reduce((a, b) => a + b, 0) / timeMults.length)
    );
  }
  state.dispatches.push({
    dispatchId: `disp-${now}-${Math.floor(Math.random() * 999)}`,
    missionId: mission.id,
    petUids: uids,
    readyAt: now + Math.max(5000, durationMs),
    claimed: false,
  });
  const names = uids
    .map((uid) => displayPetName(findOwnedPet(state, uid).pet))
    .join("、");
  pushLog(state, `派遣【${mission.name}】：${names} 出發。`);
  return { ok: true, msg: `已派出：${mission.name}` };
}

export function claimDispatch(state, dispatchId) {
  if (!state.dispatches) state.dispatches = [];
  const d = state.dispatches.find((x) => x.dispatchId === dispatchId);
  if (!d) return { ok: false, msg: "派遣不存在。" };
  if (d.claimed) return { ok: false, msg: "已領取。" };
  if ((d.readyAt || 0) > Date.now()) {
    const sec = Math.ceil((d.readyAt - Date.now()) / 1000);
    return { ok: false, msg: `尚未歸來（${sec}s）。` };
  }
  const mission = DISPATCH_MISSIONS.find((m) => m.id === d.missionId);
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
    if (state.eggs.length < 6) {
      eggGot = makeEgg(chance.tier, `dispatch:${mission.id}`);
      state.eggs.push(eggGot);
    }
  }
  if (!state.stats) state.stats = {};
  state.stats.dispatches = (state.stats.dispatches || 0) + 1;
  // 清走已領，避免列表膨脹
  state.dispatches = state.dispatches.filter((x) => !x.claimed);
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
  return {
    ok: true,
    msg: eggGot ? `領取 ${bits.join("／")}` : `領取 ${bits.join("／")}`,
    egg: eggGot,
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
  if ((state.realm | 0) < (d.needRealm | 0)) {
    return `需要階段【${stageAt(d.needRealm).name}】才能進攻（現【${stageAt(state.realm).name}】）。敵情條件達標仍要先突破。`;
  }
  if (!state.pets?.length) return "請先派出至少一隻靈寵再進秘境。";
  const gate = dungeonGateView(state, dungeonId, now);
  if (gate.needsSummon && gate.phase !== "ready") {
    if (gate.phase === "summoning") {
      return `潮霧凝聚中（${Math.ceil(gate.summonLeftMs / 1000)}s）……就緒後才可挑戰。`;
    }
    return "已通關層需先「召喚」凝聚秘境，再開始挑戰。";
  }
  const tutWaiveChallenge = tutorialWaivesDungeonChallenge(state, dungeonId);
  const challenge = tutWaiveChallenge ? null : d.challenge || null;
  if (!tutWaiveChallenge && challenge?.maxPets != null && state.pets.length > challenge.maxPets) {
    return `今日挑戰要求出戰≤${challenge.maxPets}寵（現 ${state.pets.length}）。`;
  }
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

/**
 * Soft prestige：潮主後鑄潮印，重置階段／靈契，保留寵／裝／圖鑑／通關
 */
export function tryTideSeal(state) {
  const seals = state.tideSeals || 0;
  if (seals >= TIDE_SEAL_MAX) return { ok: false, msg: `潮印已達上限（${TIDE_SEAL_MAX}）。` };
  if ((state.realm || 0) < TIDE_SEAL_MIN_REALM) {
    return { ok: false, msg: `需達潮主（階段 ${TIDE_SEAL_MIN_REALM}）方可鑄印。` };
  }
  const gain = tideSealGainForRealm(state.realm);
  if (gain <= 0) return { ok: false, msg: "無法鑄印。" };
  const from = realmInfo(state).name;
  state.tideSeals = Math.min(TIDE_SEAL_MAX, seals + gain);
  state.realm = 0;
  state.qi = 0;
  state.master.skillIds = masterSkillsForStage(0);
  if (!state.stats) state.stats = {};
  state.stats.seals = (state.stats.seals || 0) + gain;
  pushLog(
    state,
    `潮印鑄成 +${gain}（現 ${state.tideSeals}）。自【${from}】重歸初契；靈寵／裝備／圖鑑保留。`
  );
  checkAchievements(state);
  return {
    ok: true,
    msg: `鑄潮印 +${gain}（共 ${state.tideSeals}）· 階段已重置`,
  };
}

export function tideSealView(state) {
  const seals = state.tideSeals || 0;
  const gain = tideSealGainForRealm(state.realm);
  return {
    seals,
    max: TIDE_SEAL_MAX,
    mult: tideSealCombatMult(seals),
    canSeal: (state.realm || 0) >= TIDE_SEAL_MIN_REALM && seals < TIDE_SEAL_MAX,
    nextGain: gain,
    minRealm: TIDE_SEAL_MIN_REALM,
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

/** 打本後嘗試遇見野生靈寵（用秘境遇寵權重） */
export function maybeEncounterAfterDungeon(state, dungeonId, won) {
  if (state.pending.length >= PENDING_BOND_MAX) {
    return { blocked: true, encounter: null };
  }
  let rate = won ? 0.62 : 0.22;
  if (state.pets.length === 0 && (state.ranch?.length || 0) === 0) rate = won ? 0.92 : 0.4;
  if (Math.random() > rate) return { blocked: false, encounter: null };

  const dungeonDef = DUNGEONS.find((x) => x.id === dungeonId) || null;
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
  if (state.pets.length >= ACTIVE_PET_MAX) {
    return { ok: false, msg: `出戰欄已滿（最多 ${ACTIVE_PET_MAX} 隻）。` };
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
    const left = hatching ? Math.max(0, (e.readyAt || 0) - now) : t.hatchMs;
    return {
      ...e,
      name: e.name || t.name,
      label: t.label,
      desc: t.desc,
      hatchMs: t.hatchMs,
      hatching,
      ready: hatching && left <= 0,
      leftMs: left,
      leftSec: Math.ceil(left / 1000),
    };
  });
}

/** 開始孵化 */
export function startHatch(state, eggUid, now = Date.now()) {
  if (!state.eggs) state.eggs = [];
  const egg = state.eggs.find((e) => e.uid === eggUid);
  if (!egg) return { ok: false, msg: "找不到這枚蛋。" };
  if (egg.startedAt != null) return { ok: false, msg: "已在孵化中。" };
  const t = eggTierInfo(egg.tier);
  const tutShort =
    egg.source === "starter" ||
    egg.source === "tutorial_shop" ||
    (state.tutorial && !state.tutorial.done && state.tutorial.step === "hatch_second");
  const hatchMs = tutShort ? TUTORIAL_EGG_HATCH_MS : t.hatchMs;
  egg.startedAt = now;
  egg.readyAt = now + hatchMs;
  const hatchLabel = tutShort ? `${Math.round(hatchMs / 1000)} 秒` : `約 ${Math.round(hatchMs / 60000)} 分`;
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
    return { ok: false, msg: `牧場已滿（${state.ranch.length}/${cap}），無法領取。可先出戰或放歸。` };
  }
  const pet = normalizePet(hatchPetFromEgg(egg, { realm: state.realm, starter: egg.source === "starter" }));
  state.eggs.splice(i, 1);
  state.ranch.push(pet);
  registerBestiary(state, pet);
  if (!state.stats) state.stats = {};
  state.stats.eggsHatched = (state.stats.eggsHatched || 0) + 1;
  state.stats.bonds = (state.stats.bonds || 0) + 1;
  if (state.tutorial && !state.tutorial.done) {
    state.tutorial.flags.hatchClaimed = true;
    if (egg.source === "starter") state.tutorial.flags.starterHatched = true;
    if (egg.source === "shop" || state.tutorial.flags.shopBought) {
      state.tutorial.flags.secondEggHatched = true;
    }
  }
  pushLog(state, `【${egg.name || eggTierInfo(egg.tier).name}】孵出 ${pet.name}！`);
  const tut = advanceTutorialCascade(state);
  return {
    ok: true,
    msg: `孵出 ${pet.name}`,
    pet,
    tutorialUnlock: tut.advanced ? tut.unlockMsg : null,
  };
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
  const list = found.list === "pets" ? state.pets : state.ranch;
  const [gone] = list.splice(found.index, 1);
  const refund = releaseRefund(gone);
  state.stones += refund.stones;
  state.feed = (state.feed || 0) + refund.feed;
  state.dust = (state.dust || 0) + refund.dust;
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.releases += 1;
  pushLog(
    state,
    `放歸 ${gone.nick || gone.name}，返還 ${refund.stones} 石／${refund.feed} 飼料／${refund.dust} 靈塵。`
  );
  return {
    ok: true,
    msg: `放歸返還 ${refund.stones}石 ${refund.feed}飼料 ${refund.dust}塵`,
    refund,
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
    pet.atk += 2;
    pet.hp += 6;
    pet.spd += 1;
    pet.level = level + 1;
    const matNote = formatMats(matCost);
    pushLog(
      state,
      `${pet.name} 以飼料×${cost} 升級至 Lv.${pet.level}（攻+2 血+6 速+1）${matNote ? `｜耗 ${matNote}` : ""}。`
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
  pet.atk += 2;
  pet.hp += 6;
  pet.spd += 1;
  pet.level = level + 1;
  const matNote = formatMats(matCost);
  pushLog(
    state,
    `${pet.name} 升級至 Lv.${pet.level}（攻+2 血+6 速+1）${matNote ? `｜耗 ${matNote}` : ""}。`
  );
  maybeAnnounceSecondSkill(state, pet, level);
  return { ok: true, msg: `${pet.name} → Lv.${pet.level}` };
}

function maybeAnnounceSecondSkill(state, pet, prevLevel) {
  if (prevLevel < SECOND_SKILL_UNLOCK.level && (pet.level ?? 1) >= SECOND_SKILL_UNLOCK.level) {
    if ((pet.fusionLevel ?? 0) < SECOND_SKILL_UNLOCK.fusionLevel) {
      const secondId = KIND_SECOND_SKILLS[pet.kind];
      const sn = SKILLS[secondId]?.name;
      if (sn) pushLog(state, `${pet.name} 因等級覺醒第二技能【${sn}】！`);
    }
  }
}

/** 靈塵＋靈響脂升級寵物技能等級（含第二技能威力） */
export function upgradePetSkill(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const lv = pet.skillLevel ?? 1;
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
  pet.skillLevel = lv + 1;
  const matNote = formatMats(mats);
  pushLog(
    state,
    `${pet.name} 技能升至 Lv.${pet.skillLevel}（威力↑）${matNote ? `｜耗 ${matNote}` : ""}。`
  );
  return { ok: true, msg: `${pet.name} 技能 Lv.${pet.skillLevel}` };
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
  if (targetStage == null) return { ok: false, msg: "已達融合上限（融階 3）。" };

  const rule = FUSION_RULES[targetStage];
  const baseLevel = base.level ?? 1;
  if (baseLevel < rule.needLevel) {
    return {
      ok: false,
      msg: `融階 ${targetStage} 需要主體至少 Lv.${rule.needLevel}（現 Lv.${baseLevel}）。`,
    };
  }

  const needMats = fusionMaterialNeed(targetStage);
  if (mats.length !== needMats) {
    return {
      ok: false,
      msg: `融階 ${targetStage} 需要 ${rule.totalPets} 隻同種族（主體+${needMats} 素材），目前選了 ${mats.length} 隻素材。`,
    };
  }

  const matFounds = [];
  for (const uid of mats) {
    const f = findOwnedPet(state, uid);
    if (!f) return { ok: false, msg: "找不到素材靈寵。" };
    if (f.pet.speciesId !== base.speciesId) {
      return { ok: false, msg: "只能融合同種族靈寵。" };
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

  // 融合主要吸收素材天生數值，寫入主體基礎
  const keepLevel = base.level ?? 1;
  const rate = fusionAbsorbRate(targetStage);
  for (const { pet: mat } of matFounds) {
    base.atk += Math.max(2, Math.floor(mat.atk * rate)) + targetStage;
    base.hp += Math.max(4, Math.floor(mat.hp * rate)) + targetStage * 3;
    base.spd += Math.max(1, Math.floor(mat.spd * rate * 0.85));
  }
  base.atk += 1 + targetStage;
  base.hp += 4 + targetStage * 2;
  base.spd += targetStage;
  base.fusionLevel = targetStage;
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
    `融合完成：${base.name} → 融階 ${targetStage}（繼承 Lv.${keepLevel}，耗 ${needMats} 素材／${cost} 靈石${
      formatMats(fuseMats) ? `／${formatMats(fuseMats)}` : ""
    }）。`
  );
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.fusions += 1;
  bumpDaily(state, "fuse", 1);
  if (state.tutorial && !state.tutorial.flags) state.tutorial.flags = {};
  if (state.tutorial?.flags) state.tutorial.flags.fuseDone = true;
  if (targetStage === SECOND_SKILL_UNLOCK.fusionLevel) {
    const secondId = KIND_SECOND_SKILLS[base.kind];
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
  const secondId =
    HYBRID_SKILLS[pet.speciesId] || KIND_SECOND_SKILLS[pet.kind];
  const secondUnlocked =
    fusion >= SECOND_SKILL_UNLOCK.fusionLevel || level >= SECOND_SKILL_UNLOCK.level;
  const baseline = petSpeciesBaseline(pet.speciesId, pet.elementId, pet.personalityId);
  const innateBonus = {
    atk: Math.max(0, (pet.atk || 0) - baseline.atk),
    hp: Math.max(0, (pet.hp || 0) - baseline.hp),
    spd: Math.max(0, (pet.spd || 0) - baseline.spd),
  };
  return {
    pet,
    location: found.list,
    deployed: found.list === "pets",
    level,
    fusionLevel: fusion,
    skillLevel: skillLv,
    upgradeCost: upgradeStoneCost(level),
    upgradeFeedCost: upgradeFeedCost(level),
    skillDustCost: skillLv < SKILL_MAX_LEVEL ? skillDustCost(skillLv) : null,
    skillMatCost: skillLv < SKILL_MAX_LEVEL ? skillMatCost(skillLv) : null,
    skillMaxed: skillLv >= SKILL_MAX_LEVEL,
    nextFusionStage: target,
    fuseNeedLevel: rule?.needLevel ?? null,
    fuseTotalPets: rule?.totalPets ?? null,
    fuseMatNeed: target != null ? fusionMaterialNeed(target) : 0,
    fuseCostHint: target != null ? fusionStoneCost(target) : null,
    fuseMatCost: target != null ? fusionMatCost(target) : null,
    fuseMaxed: target == null,
    skill: skillInfo(pet.skillId),
    skillIds,
    secondSkill: secondId ? skillInfo(secondId) : null,
    secondUnlocked,
    baseline,
    innateBonus,
    ranchFull: (state.ranch?.length || 0) >= ranchCap(state),
    partyFull: state.pets.length >= ACTIVE_PET_MAX,
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

function dealStrike(actor, target, power, transcript, events, skillName) {
  if (!target || target.hp <= 0) return;
  const pMult = skillPowerMult(actor.skillLevel || 1);
  let dmg = Math.max(1, Math.floor(actor.atk * power * pMult) + Math.floor(Math.random() * 4) - 1);
  if (skillName === "嵐擊" || skillName === "穿空" || skillName === "礁襲") {
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

function useSkill(actor, skill, allies, foes, transcript, events, tactics = "balanced") {
  const cdMap = actor.skillCd;
  if ((cdMap[skill.id] || 0) > 0) return false;
  const pMult = skillPowerMult(actor.skillLevel || 1);
  const power = skill.power * pMult;

  if (skill.type === "strike") {
    const t = pickFoe(foes, tactics);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, events, skill.name);
  } else if (skill.type === "cleave") {
    const live = foes.filter((f) => f.hp > 0);
    if (!live.length) return false;
    const targets = skill.id === "tide_spray" ? live.slice(0, 2) : live;
    const line = `${actor.name} 施展【${skill.name}】！`;
    transcript.push(line);
    pushCombatText(events, line);
    for (const t of targets) dealStrike(actor, t, skill.power, transcript, events, null);
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
  const cos = abyssCosmeticCombatMult(state.abyssDive?.cosmetics || {});
  const atkMult = synergy.atkMult * dex.atkMult * sealMult * cos.atkMult;
  const hpMult = synergy.hpMult * dex.hpMult * sealMult * cos.hpMult;
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
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * elemMult * gMult * fAtk * pAtk * bm.atk),
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
  const { sweepInternal = false, deferEncounter = false } = opts;
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${stageAt(d.needRealm).name}` };
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
    if (gate.phase === "summoning") {
      return { ok: false, msg: `潮霧凝聚中（${Math.ceil(gate.summonLeftMs / 1000)}s）……` };
    }
    return { ok: false, msg: "請先召喚秘境。" };
  }

  const dailyPack = ensureDungeonDaily(state);
  const dailyMod = dailyPack?.mod || null;
  const tutWaiveChallenge = tutorialWaivesDungeonChallenge(state, dungeonId);
  const challenge = tutWaiveChallenge ? null : d.challenge || null;
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;

  const chalEval = evaluateDungeonChallenge(state.pets, challenge, {});
  // 強制入口限制：出戰人數／禁屬不符則拒進（教學秘境豁免）
  if (!tutWaiveChallenge && challenge?.maxPets != null && state.pets.length > challenge.maxPets) {
    return {
      ok: false,
      msg: `今日挑戰要求出戰≤${challenge.maxPets}寵（現 ${state.pets.length}）。`,
    };
  }
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
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp * bm.hp),
      atk: Math.round((p.atk + stageBonus) * atkMult * elemMult * gMult * fAtk * pAtk * bm.atk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd * bm.spd),
      isMaster: false,
      elementId: p.elementId,
      skillLevel: p.skillLevel ?? 1,
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
  let eliteCleared = roles.elite > 0;
  let bossCleared = roles.boss > 0;
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
        // 主線：首通仍提示舊練功解鎖（潮域主路徑改走域主）
        for (const site of TRAIN_SITES) {
          if (site.needClear === dungeonId) {
            unlockedSites.push(site.name);
            pushLog(state, `秘境回響：【${site.name}】相關潮鑰機率提升。`);
          }
        }
        note(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、碎片 ${d.reward.scrap}。首通額外 +${bonusStones} 石／+${bonusScrap} 碎片！`
        );
        // 首通保底潮鑰 1
        {
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
      // 潮鑰：高機率、非必然（首通已另給保底）
      if (!first) {
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
    label: `${name}×${total}`,
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
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${stageAt(d.needRealm).name}` };
  }
  if (!state.pets?.length) return { ok: false, msg: "請先派出靈寵。" };
  if (!state.clearedDungeons?.[dungeonId]) {
    return { ok: false, msg: "首通無需召喚，直接進攻即可。" };
  }
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase === "summoning") {
    return { ok: false, msg: `潮霧凝聚中（${Math.ceil(gate.summonLeftMs / 1000)}s）……` };
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
  if (state.realm < d.needRealm) {
    return { ok: false, reason: `需${stageAt(d.needRealm).name}` };
  }
  if (!state.pets?.length) return { ok: false, reason: "請先派出靈寵。" };
  if (!state.clearedDungeons?.[dungeonId]) return { ok: false, reason: "需先通關本層。" };
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase === "summoning") {
    return { ok: false, reason: `潮霧凝聚中（${Math.ceil(gate.summonLeftMs / 1000)}s）` };
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
 */
export function runDungeonSweep(state, dungeonId, count) {
  const n = clampDungeonSummonCount(count);
  const gate = dungeonGateView(state, dungeonId);
  if (gate.phase !== "ready" || gate.batch !== n) {
    return { ok: false, msg: "請先召喚對應場數並等待潮霧凝聚完成。" };
  }
  const check = canDungeonSweep(state, dungeonId, n);
  if (!check.ok) return { ok: false, msg: check.reason };
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
  const msg = `掃蕩 ${agg.runs} 次：勝 ${agg.wins}／敗 ${agg.losses} · 合計 +${agg.totalStones} 石 · 秘境已散去`;
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
    tokenCost: 0,
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

export function forgeHint(_state) {
  return { ok: false, msg: "靈紋鍛造已廢止——秘境改掉落寵用素材。" };
}

/** 催生符：將最早孕育中的交配立即就緒（可領） */
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
  gestating[0].readyAt = now;
  pushLog(state, `使用催生符，【${gestating[0].names?.join("×") || "交配"}】提前就緒。`);
  return { ok: true, msg: "交配已就緒，可領取子代" };
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
  job.readyAt = now + Math.floor(left / 2);
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
  const others = Object.keys(PERSONALITIES).filter((id) => id !== oldId);
  if (!others.length) return { ok: false, msg: "無可替換性格。" };
  const newId = others[Math.floor(Math.random() * others.length)];
  const oldPe = PERSONALITIES[oldId];
  const newPe = PERSONALITIES[newId];
  state.materials.temper_oil -= 1;
  /* 按性格倍率差調整白板 */
  if (oldPe && newPe) {
    pet.atk = Math.max(1, Math.round((pet.atk / (oldPe.atk || 1)) * newPe.atk));
    pet.hp = Math.max(1, Math.round((pet.hp / (oldPe.hp || 1)) * newPe.hp));
    pet.spd = Math.max(1, Math.round((pet.spd / (oldPe.spd || 1)) * newPe.spd));
  }
  pet.personalityId = newId;
  pet.personalityName = newPe.name;
  if (pet.personality2Id === newId) {
    pet.personality2Id = null;
    pet.personality2Name = null;
  }
  if (pet.genes) {
    pet.genes = { ...pet.genes, personality: newId };
  }
  registerBestiary(state, pet);
  pushLog(state, `【${displayPetName(pet)}】使用性格洗劑：${oldPe?.name || oldId} → ${newPe.name}。`);
  return { ok: true, msg: `${pet.name} 性格 → ${newPe.name}` };
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
    if (state.eggs.length < 6) {
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
  if (label.includes("繁殖") || label.includes("融合") || label.includes("代寵") || label.includes("雜交")) {
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
    return { tab: "party", sub: "ranch" };
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
  const offline = state.offlineHint;
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

function materializeBreedChild(state, job) {
  const [uidA, uidB] = job.uids || [];
  const a = findOwnedPet(state, uidA)?.pet;
  const b = findOwnedPet(state, uidB)?.pet;
  if (!a || !b) return { ok: false, msg: "雙親已不在，無法領取子代。" };
  const genes = job.genes || rollBreedGenes(a, b);
  const child = normalizePet(
    buildPetStats({
      id: `breed-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      species: genes.species,
      element: genes.element,
      personality: genes.personality,
      personality2: genes.personality2,
      bloodmarks: genes.bloodmarks || [],
      rarity: genes.rarity,
      cost: 0,
    })
  );
  const born = breedStatInheritance(a, b, genes);
  child.atk += born.atk;
  child.hp += born.hp;
  child.spd += born.spd;
  const awaken = genAwakenBonus(genes.generation);
  if (awaken) {
    child.atk += awaken.atk;
    child.hp += awaken.hp;
    child.spd += awaken.spd;
    if (awaken.skillLevel && (child.skillLevel ?? 1) < awaken.skillLevel) {
      child.skillLevel = awaken.skillLevel;
    }
  }
  child.uid = `${child.templateId}-born-${Math.floor(Math.random() * 99999)}`;
  child.bornFrom = [a.uid, b.uid];
  child.generation = genes.generation;
  if (!state.ranch) state.ranch = [];
  state.ranch.push(child);

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
  if (genes.hybrid) state.stats.hybrids = (state.stats.hybrids || 0) + 1;
  if (genes.tertiary) state.stats.tertiaryBreeds = (state.stats.tertiaryBreeds || 0) + 1;
  if (genes.rarity >= 3) state.stats.legendBreeds = (state.stats.legendBreeds || 0) + 1;
  if (genes.hybrid && child.speciesId) {
    if (!state.stats.speciesBreeds) state.stats.speciesBreeds = {};
    state.stats.speciesBreeds[child.speciesId] =
      (state.stats.speciesBreeds[child.speciesId] || 0) + 1;
  }
  if (genes.generation >= 3) {
    state.stats.gen3Breeds = (state.stats.gen3Breeds || 0) + 1;
  }
  registerBestiary(state, child);
  if (a.kind !== b.kind) bumpBreedGoalProgress(state, "daily_hybrid", 1);
  progressBreedGoalsFromChild(state, child, genes);
  bumpDaily(state, "breed", 1);

  const tags = [];
  tags.push(genLabel(genes.generation));
  if (genes.hybrid) tags.push("雜交新種！");
  if (genes.tertiary) tags.push("三代種！");
  if (genes.rarityUp) tags.push(`${child.rarityName}升階！`);
  else if (genes.rarity > 0) tags.push(child.rarityName);
  if (genes.mutated && !genes.hybrid) tags.push("元素變異");
  if (genes.personality2) tags.push(`副性${PERSONALITIES[genes.personality2]?.name || ""}`);
  if (awaken?.label) tags.push(awaken.label);
  const tagNote = tags.length ? `（${tags.join("·")}）` : "";
  const innNote =
    born.atk || born.hp || born.spd
      ? `｜天生 +${born.atk}攻/${born.hp}血/${born.spd}速`
      : "";
  pushLog(
    state,
    `交配誕生：${displayPetName(a)} × ${displayPetName(b)} → ${petLabel(child)}${tagNote}${innNote}。`
  );
  checkAchievements(state);
  return {
    ok: true,
    pet: child,
    genes,
    awaken,
    born,
    tagNote,
    innNote,
    celebrate: !!(
      genes.hybrid ||
      genes.rarityUp ||
      genes.rarity >= 2 ||
      genes.generation >= 2 ||
      awaken?.label
    ),
  };
}

/**
 * 開始交配（似秘境召喚）：扣費進佇列，孕育完才可領子代。
 * 可同時進行最多 BREED_QUEUE_MAX 欄。
 */
export function tryBreed(state, uidA, uidB) {
  if (!uidA || !uidB || uidA === uidB) {
    return { ok: false, msg: "請選擇兩隻不同的牧場靈寵。" };
  }
  ensureBreedJobs(state);
  const active = state.breedJobs.filter((j) => !j.claimed && !j.legacy);
  if (active.length >= BREED_QUEUE_MAX) {
    return { ok: false, msg: `交配欄已滿（${BREED_QUEUE_MAX}）。先領取就緒子代或等孕育完成。` };
  }
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  const pendingBirths = active.length;
  if (state.ranch.length + pendingBirths >= cap) {
    return { ok: false, msg: `牧場將滿（${cap}），請先騰位再交配。` };
  }
  if (state.stones < BREED_STONE_COST) {
    return { ok: false, msg: `靈石不足（需 ${BREED_STONE_COST}）。` };
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
  const matCost = breedMatCost(petGeneration(a), petGeneration(b));
  if (!spendMaterials(state, matCost)) {
    const sh = shortageHint(state, matCost);
    return {
      ok: false,
      msg: `材料不足（需 ${formatMats(matCost)}）${sh.hint ? `｜${sh.hint}` : ""}。`,
      suggest: sh.suggest,
    };
  }

  const now = Date.now();
  const genes = rollBreedGenes(a, b);
  state.stones -= BREED_STONE_COST;
  const readyAt = now + BREED_COOLDOWN_MS;
  const job = {
    id: `breed-${now}-${Math.floor(Math.random() * 9999)}`,
    uids: [a.uid, b.uid],
    names: [displayPetName(a), displayPetName(b)],
    startedAt: now,
    readyAt,
    genes,
    claimed: false,
  };
  state.breedJobs.push(job);
  // 相容舊欄位：顯示「最近一次」孕育
  state.breedReadyAt = readyAt;
  state.breedPair = { uids: job.uids, names: job.names, readyAt };

  const matNote = formatMats(matCost);
  const sec = Math.ceil(BREED_COOLDOWN_MS / 1000);
  pushLog(
    state,
    `開始交配：${job.names[0]} × ${job.names[1]}（孕育約 ${sec}s｜耗 ${BREED_STONE_COST} 石${matNote ? `／${matNote}` : ""}）。`
  );
  return {
    ok: true,
    msg: `交配開始 · ${sec}s 後可領子代（${active.length + 1}/${BREED_QUEUE_MAX}）`,
    job,
    started: true,
  };
}

/** 領取就緒交配子代（似秘境凝聚完再開戰） */
export function claimBreed(state, jobId) {
  ensureBreedJobs(state);
  const job = state.breedJobs.find((j) => j.id === jobId);
  if (!job) return { ok: false, msg: "找不到這次交配。" };
  if (job.claimed || job.legacy) return { ok: false, msg: "已領取過。" };
  const now = Date.now();
  if ((job.readyAt || 0) > now) {
    const sec = Math.ceil((job.readyAt - now) / 1000);
    return { ok: false, msg: `仍在孕育（${sec}s）。` };
  }
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}），先騰位再領取。` };
  }
  const born = materializeBreedChild(state, job);
  if (!born.ok) return born;
  job.claimed = true;
  // 清走已領，避免列表膨脹
  state.breedJobs = state.breedJobs.filter((j) => !j.claimed && !j.legacy);
  const open = state.breedJobs.filter((j) => !j.claimed);
  if (!open.length) {
    state.breedReadyAt = 0;
    state.breedPair = null;
  } else {
    const next = open.reduce((a, b) => ((a.readyAt || 0) <= (b.readyAt || 0) ? a : b));
    state.breedReadyAt = next.readyAt || 0;
    state.breedPair = { uids: next.uids, names: next.names, readyAt: next.readyAt };
  }
  return {
    ok: true,
    msg: `誕生 ${born.pet.name}${born.tagNote || ""}${born.innNote || ""}`,
    pet: born.pet,
    celebrate: born.celebrate,
    mutated: born.genes?.mutated,
    hybrid: born.genes?.hybrid,
    rarity: born.genes?.rarity,
    rarityUp: born.genes?.rarityUp,
    generation: born.genes?.generation,
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
    statPreview: {
      atk: [statLo.atk + (loAwaken?.atk || 0), statHi.atk + (hiAwaken?.atk || 0)],
      hp: [statLo.hp + (loAwaken?.hp || 0), statHi.hp + (hiAwaken?.hp || 0)],
      spd: [statLo.spd + (loAwaken?.spd || 0), statHi.spd + (hiAwaken?.spd || 0)],
    },
    awakenNote,
    stoneCost: BREED_STONE_COST,
  };
}

/** UI：血統（父母／子代） */
export function petLineage(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return null;
  const pet = found.pet;
  const parents = (pet.bornFrom || []).map((id) => {
    const hit = findOwnedPet(state, id);
    if (hit) {
      return {
        uid: id,
        name: displayPetName(hit.pet),
        generation: petGeneration(hit.pet),
        speciesName: SPECIES[hit.pet.speciesId]?.name || hit.pet.name,
        exists: true,
      };
    }
    return { uid: id, name: "已放歸", exists: false };
  });
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
  return {
    generation: petGeneration(pet),
    parents,
    children,
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
  const bothHybrid = !!(SPECIES[petA.speciesId]?.breedOnly && SPECIES[petB.speciesId]?.breedOnly);
  if (!same && bothHybrid) {
    const tertList = tertiaryRecipesForParents(petA.speciesId, petB.speciesId);
    if (tertList.length) {
      const best = tertList.reduce((a, b) => (a.chance >= b.chance ? a : b));
      if (SPECIES[best.species]) {
        hybridName = SPECIES[best.species].name;
        hybridChance = Math.min(
          0.7,
          tertList.reduce((s, r) => s + Math.min(0.55, r.chance * genMult), 0)
        );
        tier = "tertiary";
      }
    }
  }
  if (!hybridName && !same && kindA !== kindB) {
    const recipe = hybridRecipeForKinds(kindA, kindB);
    if (recipe && SPECIES[recipe.species]) {
      hybridName = SPECIES[recipe.species].name;
      hybridChance = Math.min(0.85, recipe.chance * genMult);
      tier = recipe.tier;
    }
  }

  let note;
  if (same) {
    note = `同種：較易升稀有 · 子代 ${genOddsText}`;
  } else if (hybridName && tier === "tertiary") {
    note = `三代種：約 ${Math.round(hybridChance * 100)}% 【${hybridName}】· 子代 ${genOddsText}`;
  } else if (hybridName) {
    const tierTag = tier === "main" ? "主配方" : "次配方";
    note = `異種${tierTag}：約 ${Math.round(hybridChance * 100)}% 雜交【${hybridName}】· 子代 ${genOddsText}`;
  } else {
    note = `異種無雜交配方（×）· 只遺傳父母 · 子代 ${genOddsText}`;
  }

  return {
    sameSpecies: same,
    hybridName,
    hybridChance,
    tier,
    genA,
    genB,
    genOddsText,
    note,
  };
}

export function breedStatus(state) {
  ensureBreedJobs(state);
  const now = Date.now();
  const totalMs = BREED_COOLDOWN_MS;
  const jobs = state.breedJobs
    .filter((j) => !j.claimed && !j.legacy)
    .map((j) => {
      const left = Math.max(0, (j.readyAt || 0) - now);
      const elapsed = Math.max(0, totalMs - left);
      const pct = Math.min(100, Math.round((elapsed / Math.max(1, totalMs)) * 100));
      return {
        id: j.id,
        uids: j.uids || [],
        names: j.names || [],
        readyAt: j.readyAt || 0,
        leftMs: left,
        pct,
        ready: left <= 0,
      };
    })
    .sort((a, b) => a.readyAt - b.readyAt);
  const next = jobs.find((j) => !j.ready) || null;
  const claimable = jobs.filter((j) => j.ready);
  return {
    cost: BREED_STONE_COST,
    queueMax: BREED_QUEUE_MAX,
    slotsUsed: jobs.length,
    cooldownLeftMs: next?.leftMs || 0,
    cooldownTotalMs: totalMs,
    cooldownPct: next ? next.pct : 100,
    ready: jobs.length < BREED_QUEUE_MAX,
    pair: next ? { uids: next.uids, names: next.names, readyAt: next.readyAt } : null,
    jobs,
    claimable,
    busyUids: [...breedBusyUids(state)],
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
  const wk = weekKey(now);
  if (ad.weekKey !== wk) {
    ad.weekKey = wk;
    ad.weekBestDepth = 0;
  }
  if (ad.eggsWeekKey !== wk) {
    ad.eggsWeekKey = wk;
    ad.eggsBoughtWeek = 0;
  }
  return ad;
}

function abyssUnlocked(state) {
  return !!(state.clearedDungeons || {}).tide_1 || (state.realm | 0) >= 1;
}

function buildAbyssFloorWaves(depth, seed) {
  const d = Math.max(1, depth | 0);
  const h = abyssHash(`${seed}:w${d}`);
  const elems = ["tide", "flame", "gale", "stone", "gloom"];
  const scale = 1 + (d - 1) * 0.12;
  const mk = (name, role, baseHp, baseAtk, baseSpd, ei) => ({
    name,
    role,
    hp: Math.round(baseHp * scale),
    atk: Math.round(baseAtk * scale),
    spd: Math.round(baseSpd * (1 + (d - 1) * 0.03)),
    element: elems[ei % elems.length],
    skills: role === "boss" ? ["tide_crush", "mist_veil"].filter((id) => SKILLS[id]) : role === "elite" ? ["coral_spike"].filter((id) => SKILLS[id]) : [],
    actions: role === "boss" ? 2 : 1,
  });
  const waves = [
    {
      label: `淵層${d}·潮霧`,
      enemies: [
        mk("淵霧卒", "normal", 42, 9, 10, h),
        mk("淵霧卒", "normal", 40, 8, 11, h + 1),
      ],
    },
  ];
  if (d % 3 === 0) {
    waves.push({
      label: `淵層${d}·護影`,
      enemies: [mk("淵影護衛", "elite", 70, 12, 12, h + 2)],
    });
  } else {
    waves.push({
      label: `淵層${d}·暗潮`,
      enemies: [mk("暗潮潛客", "normal", 48, 10, 12, h + 3)],
    });
  }
  if (d % 5 === 0) {
    waves.push({
      label: `淵層${d}·主影`,
      enemies: [mk("潮淵殘主", "boss", 120, 16, 13, h + 4)],
    });
  }
  return waves;
}

function applyAbyssMutationsToAllies(allies, mutationIds, formationId) {
  const placement = formationAllyPlacement(formationId, allies.length);
  for (let i = 0; i < allies.length; i += 1) {
    const slot = placement.find((p) => p.unitIndex === i);
    allies[i].lane = slot?.lane || "front";
    allies[i].dmgTakenMult = 1;
    allies[i].healOutMult = 1;
  }
  let healMult = 1;
  let frontTax = 1;
  for (const id of mutationIds || []) {
    const m = ABYSS_MUTATIONS[id];
    if (!m) continue;
    if (m.healMult != null) healMult = Math.min(healMult, m.healMult);
    if (m.frontDmgTakenMult != null) frontTax = Math.max(frontTax, m.frontDmgTakenMult);
  }
  for (const a of allies) {
    a.healOutMult = healMult;
    if (a.lane === "front") a.dmgTakenMult = frontTax;
  }
}

function runAbyssFloorCombat(state, { depth, seed, mutationIds }) {
  if (!(state.pets || []).length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }
  let maxPets = ACTIVE_PET_MAX;
  for (const id of mutationIds || []) {
    const m = ABYSS_MUTATIONS[id];
    if (m?.maxPets != null) maxPets = Math.min(maxPets, m.maxPets);
  }
  const savedPets = state.pets;
  if (savedPets.length > maxPets) {
    state.pets = savedPets.slice(0, maxPets);
  }
  const ctx = buildTrainCombatAllies(state);
  state.pets = savedPets;
  const { allies, synergy, formation, tactics } = ctx;
  applyAbyssMutationsToAllies(allies, mutationIds, state.formation || "balanced");
  if (!allies.length) return { ok: false, msg: "請先派出至少一隻靈寵。" };

  const waves = buildAbyssFloorWaves(depth, seed);
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
    mutationIds: [...(mutationIds || [])],
  };
}

/** 秘境旁路：潮淵深潛狀態摘要 */
export function abyssDiveView(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  const today = todayKey(now);
  const freeLeft = ad.freeUsedDate !== today;
  const run = ad.run;
  const gritHave = Math.floor(state.materials?.[ABYSS_GRIT_ID] || 0);
  const tokenHave = Math.floor(state.materials?.[ABYSS_ENTRY_MAT_ID] || 0);
  const unlocked = abyssUnlocked(state);
  return {
    unlocked,
    gritHave,
    tokenHave,
    entryMatId: ABYSS_ENTRY_MAT_ID,
    entryMatName: MATERIALS[ABYSS_ENTRY_MAT_ID]?.name || "淵潮令",
    freeLeft,
    entryCost: freeLeft ? 0 : ABYSS_ENTRY_TOKEN_COST,
    bestDepth: ad.bestDepth | 0,
    weekBestDepth: ad.weekBestDepth | 0,
    insuranceCharges: ad.insuranceCharges | 0,
    cosmetics: { ...ad.cosmetics },
    eggsBoughtWeek: ad.eggsBoughtWeek | 0,
    eggsWeeklyLimit: ABYSS_EGG_WEEKLY_LIMIT,
    insuranceCost: ABYSS_INSURANCE_COST,
    eggCost: ABYSS_EGG_COST,
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
        }
      : null,
  };
}

/** 開潛／續潛下一層（戰鬥） */
export function startAbyssDive(state, now = Date.now()) {
  if (!abyssUnlocked(state)) {
    return { ok: false, msg: "先通關潮汐秘境一層，再開潮淵。" };
  }
  if (!(state.pets || []).length) {
    return { ok: false, msg: "請先派出至少一隻靈寵。" };
  }
  const ad = ensureAbyssDive(state, now);
  if (ad.run) {
    return { ok: false, msg: "已在深潛中——請先挑戰本層或撤退。" };
  }
  const today = todayKey(now);
  let spentToken = 0;
  if (ad.freeUsedDate === today) {
    if (!spendMaterials(state, { [ABYSS_ENTRY_MAT_ID]: ABYSS_ENTRY_TOKEN_COST })) {
      const name = MATERIALS[ABYSS_ENTRY_MAT_ID]?.name || "淵潮令";
      return { ok: false, msg: `需要${name} ×${ABYSS_ENTRY_TOKEN_COST}（同秘境潮霧令分開）。` };
    }
    spentToken = ABYSS_ENTRY_TOKEN_COST;
  } else {
    ad.freeUsedDate = today;
  }
  const seed = `${today}:${now}:${abyssHash(String(now))}`;
  ad.run = {
    seed,
    depth: 0,
    pendingGrit: 0,
    mutationIds: [],
    startedAt: now,
  };
  const entryName = MATERIALS[ABYSS_ENTRY_MAT_ID]?.name || "淵潮令";
  pushLog(state, spentToken ? `踏入潮淵（耗${entryName}×${spentToken}）。` : "今日首潛潮淵（免費）。");
  return advanceAbyssDive(state, now);
}

/** 打目前下一層 */
export function advanceAbyssDive(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run) return { ok: false, msg: "尚未開潛。" };
  const nextDepth = (ad.run.depth | 0) + 1;
  const mutationFloor = nextDepth % ABYSS_MUTATION_EVERY === 0;
  if (mutationFloor && (ad.run.mutationIds || []).length < ABYSS_MAX_ACTIVE_MUTATIONS) {
    if ((ad.insuranceCharges | 0) > 0) {
      ad.insuranceCharges -= 1;
      pushLog(state, "突變保險發動——本層略過新突變。");
    } else {
      const mid = pickAbyssMutationId(`${ad.run.seed}:mut${nextDepth}`, ad.run.mutationIds || []);
      ad.run.mutationIds = [...(ad.run.mutationIds || []), mid];
    }
  }
  const combat = runAbyssFloorCombat(state, {
    depth: nextDepth,
    seed: ad.run.seed,
    mutationIds: ad.run.mutationIds || [],
  });
  if (!combat.ok) return combat;

  if (combat.won) {
    ad.run.depth = nextDepth;
    const gain = abyssFloorGrit(nextDepth, mutationFloor);
    ad.run.pendingGrit = (ad.run.pendingGrit | 0) + gain;
    if (nextDepth > (ad.bestDepth | 0)) ad.bestDepth = nextDepth;
    if (nextDepth > (ad.weekBestDepth | 0)) ad.weekBestDepth = nextDepth;
    return {
      ...combat,
      ok: true,
      gritGained: gain,
      pendingGrit: ad.run.pendingGrit,
      depth: nextDepth,
      canContinue: true,
      msg: `第 ${nextDepth} 層突破 · 累計淵砂 ${ad.run.pendingGrit}`,
    };
  }

  // 全滅保底
  const pending = ad.run.pendingGrit | 0;
  const keep = Math.floor(pending * ABYSS_WIPE_KEEP_RATE);
  if (keep > 0) addMaterials(state, { [ABYSS_GRIT_ID]: keep });
  ad.run = null;
  pushLog(state, `潮淵全滅——帶回淵砂×${keep}（保底）。`);
  return {
    ...combat,
    ok: true,
    wiped: true,
    gritGained: keep,
    pendingGrit: 0,
    canContinue: false,
    msg: keep ? `全滅 · 保底淵砂×${keep}` : "全滅 · 未帶出淵砂",
  };
}

/** 撤退結算 */
export function retreatAbyssDive(state, now = Date.now()) {
  const ad = ensureAbyssDive(state, now);
  if (!ad.run) return { ok: false, msg: "沒有進行中的深潛。" };
  const grit = ad.run.pendingGrit | 0;
  const depth = ad.run.depth | 0;
  const tokenBonus = Math.floor(depth / 5);
  if (grit > 0) addMaterials(state, { [ABYSS_GRIT_ID]: grit });
  if (tokenBonus > 0) addMaterials(state, { [ABYSS_ENTRY_MAT_ID]: tokenBonus });
  ad.run = null;
  const entryName = MATERIALS[ABYSS_ENTRY_MAT_ID]?.name || "淵潮令";
  const bonusBit = tokenBonus ? ` · ${entryName}×${tokenBonus}` : "";
  pushLog(state, `撤出潮淵（最深 ${depth}）· 淵砂×${grit}${bonusBit}。`);
  return {
    ok: true,
    grit,
    depth,
    tokenBonus,
    msg: `撤退成功 · 淵砂×${grit}${bonusBit}`,
  };
}

export function buyAbyssInsurance(state, now = Date.now()) {
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
  const ad = ensureAbyssDive(state, now);
  if ((ad.eggsBoughtWeek | 0) >= ABYSS_EGG_WEEKLY_LIMIT) {
    return { ok: false, msg: `本週高階蛋已達上限（${ABYSS_EGG_WEEKLY_LIMIT}）。` };
  }
  if (!state.eggs) state.eggs = [];
  if (state.eggs.length >= 6) return { ok: false, msg: "蛋庫已滿。" };
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
  FUSION_MAX_STAGE,
  FUSION_RULES,
  BREED_STONE_COST,
  BREED_COOLDOWN_MS,
  BREED_QUEUE_MAX,
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
  TRAIN_SITES,
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
