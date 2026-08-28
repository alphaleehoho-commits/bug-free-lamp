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
  IDLE_BY_PERSONALITY,
  IDLE_BY_ELEMENT,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  skillDustCost,
  skillPowerMult,
  SKILL_MAX_LEVEL,
  petSkillIds,
  KIND_SECOND_SKILLS,
  SECOND_SKILL_UNLOCK,
  rollGearDrop,
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
  petSpeciesBaseline,
  bestiaryKey,
  bestiaryTotal,
  bestiaryEntries,
  bestiaryCombatBonus,
  releaseRefund,
  NICK_MAX_LEN,
  DAILY_QUESTS,
  ACHIEVEMENTS,
  todayKey,
  OFFLINE_HINT_SEC,
  rarityInfo,
  RARITY_MAX,
  SPECIES,
  PERSONALITIES,
  petGeneration,
  genLabel,
  childGenerationOdds,
  hybridRecipeForKinds,
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
  HYBRID_SKILLS,
  genCombatMult,
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
  TRAIN_SITES,
  trainSiteById,
  isTrainSiteUnlocked,
  unlockedTrainSiteIds,
  personalityCombatForPet,
  materialSourceLabel,
  MATERIAL_USES,
  trainSiteUnlockHint,
} from "./data.js";

const SAVE_KEY = "void-tide-pets-v20";

function defaultMaster() {
  return {
    name: "潮行者",
    /** 人物白板偏弱，主要靠裝備拉高戰力 */
    atk: 6,
    hp: 90,
    spd: 7,
    skillIds: masterSkillsForStage(0),
    equip: { weapon: null, armor: null, accessory: null },
  };
}

function emptyDaily(now = Date.now()) {
  return {
    date: todayKey(now),
    progress: { idle: 0, dungeon: 0, bond: 0, breed: 0, win: 0 },
    /** questId → true */
    claimed: {},
    /** 累積掛機秒數（當日） */
    idleSec: 0,
  };
}

function defaultState() {
  return {
    realm: 0,
    qi: 0,
    stones: 160,
    scrap: 0,
    feed: 0,
    dust: 0,
    materials: emptyMaterials(),
    trainSite: "shore",
    inventory: [],
    master: defaultMaster(),
    pets: [],
    ranch: [],
    pending: [],
    log: [
      "你沿著暗潮抵達荒廢契壇。",
      "可先獨自踏入秘境；戰勝後或會遇見願意結契的靈寵。",
      "契約成功的靈寵進入牧場；再從牧場派出戰（最多 3 隻）。",
      "牧場待命會慢產飼料／靈塵；秘境掉落人物裝備。",
      "人物靠裝備；靈寵靠天生基礎（融合／繁殖成長）。",
      "圖鑑、每日任務與成就已開啟——見「圖鑑」頁。",
      "繁殖目標：雜交出潮獸／嵐蛾、升代與稀有——圖鑑或繁殖頁可領獎。",
      "秘境改為波次戰：雜兵→精英→BOSS；滿足關卡條件有額外獎。",
      "契壇商肆可購待契約靈寵；秘境可選戰術與陣型；深層考驗血脈。",
      "每日挑戰規則輪換；週課與成就提供長期目標。",
      "牧場改為派遣取資；人物可選練功地點產材料。",
      "通關秘境 BOSS 解鎖新練功地圖；材料用於升級／繁殖。",
    ],
    lastTick: Date.now(),
    combatsWon: 0,
    winStreak: 0,
    breedingUnlocked: true,
    clearedDungeons: {},
    dungeonReadyAt: {},
    breedReadyAt: 0,
    /** P2 */
    bestiary: {},
    daily: emptyDaily(),
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

export function ranchCap(state) {
  return ranchCapForStage(state.realm);
}

export function loadState() {
  try {
    const raw =
      localStorage.getItem(SAVE_KEY) ||
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

    // 清掉已刪除／寵物專用舊裝備；無效槽位卸下
    let inventory = Array.isArray(parsed.inventory) ? parsed.inventory.filter((it) => GEAR[it.gearId]) : [];
    const validUids = new Set(inventory.map((x) => x.uid));
    for (const slot of MASTER_EQUIP_SLOTS) {
      if (master.equip[slot] && !validUids.has(master.equip[slot])) master.equip[slot] = null;
      else if (master.equip[slot]) {
        const it = inventory.find((x) => x.uid === master.equip[slot]);
        if (it && GEAR[it.gearId]?.slot !== slot) master.equip[slot] = null;
      }
    }

    // 以現有靈寵回填圖鑑（舊存檔）
    const bestiary = { ...(parsed.bestiary || {}) };
    for (const p of [...pets, ...ranch]) {
      if (p?.speciesId && p?.elementId) {
        bestiary[bestiaryKey(p.speciesId, p.elementId)] = true;
      }
    }

    return {
      ...base,
      ...parsed,
      master,
      pets,
      ranch,
      feed: parsed.feed ?? 0,
      dust: parsed.dust ?? 0,
      materials: { ...emptyMaterials(), ...(parsed.materials || {}) },
      trainSite: TRAIN_SITES.some((s) => s.id === parsed.trainSite) ? parsed.trainSite : "shore",
      inventory,
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
      clearedDungeons: parsed.clearedDungeons || {},
      dungeonReadyAt: parsed.dungeonReadyAt || {},
      breedReadyAt: parsed.breedReadyAt || 0,
      breedingUnlocked: true,
      bestiary,
      daily: ensureDaily(parsed.daily),
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
    };
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

/** 牧場待命：已停用慢產，改走派遣 */
export function tickRanchIdle(state, _elapsedSec) {
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
    if ((state.materials[id] || 0) < n) return false;
  }
  for (const [id, n] of Object.entries(mats)) {
    if (!n) continue;
    state.materials[id] -= n;
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
      const have = state.materials[id] || 0;
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

export function materialHintsView(state) {
  return materialsView(state).map((m) => ({
    ...m,
    source: materialSourceLabel(m.id),
    use: MATERIAL_USES[m.id] || "",
  }));
}

/** 練功地點掛機產材料 */
export function tickTrainSite(state, elapsedSec) {
  if (elapsedSec <= 0) return { mats: {}, feed: 0, dust: 0 };
  const site = trainSiteById(state.trainSite);
  if (!isTrainSiteUnlocked(state, site.id)) {
    state.trainSite = "shore";
  }
  const active = trainSiteById(state.trainSite);
  if (!state.materials) state.materials = emptyMaterials();
  const gained = {};
  let feed = 0;
  let dust = 0;
  for (const drop of active.drops || []) {
    if (drop.mat) {
      const expected = (drop.perSec || 0) * elapsedSec;
      let n = Math.floor(expected);
      if (Math.random() < expected - n) n += 1;
      if (n > 0) {
        state.materials[drop.mat] = (state.materials[drop.mat] || 0) + n;
        gained[drop.mat] = (gained[drop.mat] || 0) + n;
      }
    }
    if (drop.feed) {
      const f = drop.feed * elapsedSec;
      state.feed = (state.feed || 0) + f;
      feed += f;
    }
    if (drop.dust) {
      const d = drop.dust * elapsedSec;
      state.dust = (state.dust || 0) + d;
      dust += d;
    }
  }
  return { mats: gained, feed, dust, site: active };
}

export function setTrainSite(state, siteId) {
  if (!TRAIN_SITES.some((s) => s.id === siteId)) {
    return { ok: false, msg: "未知練功地點。" };
  }
  if (!isTrainSiteUnlocked(state, siteId)) {
    const site = trainSiteById(siteId);
    return { ok: false, msg: `尚未解鎖【${site.name}】（需通關對應秘境）。` };
  }
  state.trainSite = siteId;
  return { ok: true, msg: `練功地：${trainSiteById(siteId).name}` };
}

export function trainSitesView(state) {
  const cur = state.trainSite || "shore";
  return TRAIN_SITES.map((s) => ({
    ...s,
    unlocked: isTrainSiteUnlocked(state, s.id),
    selected: s.id === cur,
    unlockHint: trainSiteUnlockHint(s),
  }));
}

export function materialsView(state) {
  if (!state.materials) state.materials = emptyMaterials();
  return MATERIAL_IDS.map((id) => ({
    ...MATERIALS[id],
    count: state.materials[id] || 0,
  }));
}

export function tickCultivation(state, now = Date.now()) {
  ensureDaily(state);
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

  if (elapsed >= OFFLINE_HINT_SEC) {
    const qiGain = state.qi - qiBefore;
    const feedGain = (state.feed || 0) - feedBefore;
    const dustGain = (state.dust || 0) - dustBefore;
    const matBits = {};
    for (const id of MATERIAL_IDS) {
      const d = (state.materials?.[id] || 0) - (matsBefore[id] || 0);
      if (d > 0) matBits[id] = d;
    }
    state.offlineHint = {
      sec: Math.floor(elapsed),
      qi: qiGain,
      feed: feedGain,
      dust: dustGain,
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
    if (!state.daily.progress) state.daily.progress = { idle: 0, dungeon: 0, bond: 0, breed: 0, win: 0 };
    if (!state.daily.claimed) state.daily.claimed = {};
    return state.daily;
  }
  const daily = dailyOrState;
  const key = todayKey(now);
  if (!daily || daily.date !== key) return emptyDaily(now);
  return {
    date: daily.date,
    progress: { idle: 0, dungeon: 0, bond: 0, breed: 0, win: 0, ...(daily.progress || {}) },
    claimed: { ...(daily.claimed || {}) },
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

export function registerBestiary(state, pet) {
  if (!pet?.speciesId || !pet?.elementId) return false;
  if (!state.bestiary) state.bestiary = {};
  const key = bestiaryKey(pet.speciesId, pet.elementId);
  if (state.bestiary[key]) return false;
  state.bestiary[key] = true;
  pushLog(state, `圖鑑登錄：${pet.elementName || ""}${pet.speciesName || pet.name}。`);
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
    bumpBreedGoalProgress(state, "daily_hybrid", 1);
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
  bumpDaily(state, "idle", 1);
  const unlocked = MASTER_UNLOCK_MSG(state.realm);
  if (unlocked) pushLog(state, unlocked);
  if (Math.random() < 0.55) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    pushLog(state, `靈兆：${ev}`);
    state.stones += 15 + state.realm * 8;
  }
  checkAchievements(state);
  return { ok: true, msg: `階段：${next.name}${costNote}` };
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

function rollShopOffer(seedSalt = 0) {
  const pool = RECRUIT_POOL;
  if (!pool.length) return null;
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
  const peKeys = Object.keys(
    // personalities via template
    { fierce: 1, steady: 1, sly: 1, gentle: 1, wild: 1 }
  );
  const personality = pick.personality || peKeys[Math.floor(Math.random() * peKeys.length)];
  return {
    offerId: `shop-${Date.now()}-${seedSalt}-${Math.floor(Math.random() * 999)}`,
    species: pick.species,
    element: pick.element,
    personality,
    cost: pick.cost || 60,
    name: SPECIES[pick.species]?.name || pick.species,
    kind: SPECIES[pick.species]?.kind || "?",
    elementName: { tide: "潮", stone: "岩", flame: "焰", gale: "嵐", gloom: "幽" }[pick.element] || pick.element,
  };
}

export function ensureShop(state, now = Date.now()) {
  const key = todayKey(now);
  if (!state.shop) state.shop = emptyShop(now);
  if (state.shop.date !== key || !Array.isArray(state.shop.offers) || state.shop.offers.length === 0) {
    const offers = [];
    for (let i = 0; i < SHOP_OFFER_COUNT; i++) {
      const o = rollShopOffer(i);
      if (o) offers.push(o);
    }
    state.shop = { date: key, offers };
  }
  return state.shop;
}

export function shopView(state) {
  ensureShop(state);
  return state.shop.offers.map((o) => ({
    ...o,
    speciesName: SPECIES[o.species]?.name || o.name,
    bought: !!o.bought,
  }));
}

export function buyShopOffer(state, offerId) {
  ensureShop(state);
  if ((state.pending || []).length >= PENDING_BOND_MAX) {
    return { ok: false, msg: `待契約已滿（${PENDING_BOND_MAX}），無法購入。` };
  }
  const offer = state.shop.offers.find((o) => o.offerId === offerId);
  if (!offer) return { ok: false, msg: "商品不存在。" };
  if (offer.bought) return { ok: false, msg: "已售出。" };
  if (state.stones < offer.cost) return { ok: false, msg: `靈石不足（需 ${offer.cost}）。` };

  const template = {
    id: `shop-${offer.species}-${offer.element}`,
    species: offer.species,
    element: offer.element,
    personality: offer.personality,
    cost: Math.max(20, Math.floor(offer.cost * 0.35)),
  };
  const pet = buildPetStats(template);
  const enc = {
    ...pet,
    encounterId: `shop-enc-${offer.offerId}`,
    bondRate: 0.72,
    metDungeon: "shop",
    status: "pending",
    fromShop: true,
  };
  state.stones -= offer.cost;
  offer.bought = true;
  if (!state.pending) state.pending = [];
  state.pending.push(enc);
  pushLog(
    state,
    `商肆購入【${enc.name}】（${enc.kind}·${enc.elementName}）入待契約，耗 ${offer.cost} 靈石。`
  );
  return { ok: true, msg: `購入 ${enc.name}（待契約）` };
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
  state.dispatches.push({
    dispatchId: `disp-${now}-${Math.floor(Math.random() * 999)}`,
    missionId: mission.id,
    petUids: uids,
    readyAt: now + mission.durationMs,
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
  applyReward(state, mission?.reward);
  if (!state.stats) state.stats = {};
  state.stats.dispatches = (state.stats.dispatches || 0) + 1;
  // 清走已領，避免列表膨脹
  state.dispatches = state.dispatches.filter((x) => !x.claimed);
  const bits = [];
  if (mission?.reward?.stones) bits.push(`${mission.reward.stones}石`);
  if (mission?.reward?.feed) bits.push(`${mission.reward.feed}飼料`);
  if (mission?.reward?.dust) bits.push(`${mission.reward.dust}靈塵`);
  if (mission?.reward?.scrap) bits.push(`${mission.reward.scrap}碎片`);
  pushLog(state, `派遣【${mission?.name || d.missionId}】歸來：${bits.join("／")}。`);
  return { ok: true, msg: `領取 ${bits.join("／")}` };
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
  const enc = rollWildEncounter(dungeonId, dungeonDef);
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
  const chance = Math.min(0.95, (cand.bondRate || 0.5) + rateBonus);
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
  return { ok: true, msg: `${pet.name} 已出戰` };
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
    return { ok: false, msg: `材料不足（需 ${formatMats(matCost)}）。` };
  }
  if (payWith === "feed") {
    const cost = upgradeFeedCost(level);
    if ((state.feed || 0) < cost) {
      addMaterials(state, matCost); // refund mats
      return { ok: false, msg: `飼料不足（需 ${cost}）。` };
    }
    state.feed -= cost;
    pet.atk += 2;
    pet.hp += 6;
    pet.spd += 1;
    pet.level = level + 1;
    const matNote = formatMats(matCost);
    pushLog(
      state,
      `${pet.name} 以飼料升級至 Lv.${pet.level}（攻+2 血+6 速+1）${matNote ? `｜耗 ${matNote}` : ""}。`
    );
    maybeAnnounceSecondSkill(state, pet, level);
    return { ok: true, msg: `${pet.name} → Lv.${pet.level}（飼料）` };
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

/** 靈塵升級寵物技能等級（含第二技能威力） */
export function upgradePetSkill(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const lv = pet.skillLevel ?? 1;
  if (lv >= SKILL_MAX_LEVEL) return { ok: false, msg: `技能已滿級（${SKILL_MAX_LEVEL}）。` };
  const cost = skillDustCost(lv);
  if ((state.dust || 0) < cost) return { ok: false, msg: `靈塵不足（需 ${cost}）。` };
  state.dust -= cost;
  pet.skillLevel = lv + 1;
  pushLog(state, `${pet.name} 技能升至 Lv.${pet.skillLevel}（威力↑）。`);
  return { ok: true, msg: `${pet.name} 技能 Lv.${pet.skillLevel}` };
}

function isItemEquipped(state, itemUid) {
  const me = state.master?.equip || {};
  for (const slot of MASTER_EQUIP_SLOTS) {
    if (me[slot] === itemUid) return { who: "master", slot };
  }
  return null;
}

/** 人物裝備／卸下 */
export function equipMaster(state, itemUid, slot) {
  if (!state.inventory) state.inventory = [];
  if (!state.master.equip) state.master.equip = { weapon: null, armor: null, accessory: null };
  if (!MASTER_EQUIP_SLOTS.includes(slot)) return { ok: false, msg: "無效槽位。" };
  const resolved = resolveInvGear(state, itemUid);
  if (!resolved) return { ok: false, msg: "庫存中找不到這件裝備。" };
  const { def } = resolved;
  if (def.slot !== slot) {
    return { ok: false, msg: `這件應裝在${SLOT_LABEL[def.slot] || def.slot}槽。` };
  }

  const worn = isItemEquipped(state, itemUid);
  if (worn && worn.slot !== slot) {
    return { ok: false, msg: "這件已被穿戴。" };
  }

  state.master.equip[slot] = itemUid;
  pushLog(state, `裝備【${def.name}】於人物${SLOT_LABEL[slot]}槽。`);
  return { ok: true, msg: `已裝備 ${def.name}` };
}

export function unequipMaster(state, slot) {
  if (!state.master.equip) return { ok: false, msg: "無裝備。" };
  if (!MASTER_EQUIP_SLOTS.includes(slot)) return { ok: false, msg: "無效槽位。" };
  const uid = state.master.equip[slot];
  if (!uid) return { ok: false, msg: "該槽為空。" };
  const r = resolveInvGear(state, uid);
  state.master.equip[slot] = null;
  pushLog(state, `卸下人物${SLOT_LABEL[slot]}${r ? `【${r.def.name}】` : ""}。`);
  return { ok: true, msg: "已卸下" };
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
    `融合完成：${base.name} → 融階 ${targetStage}（繼承 Lv.${keepLevel}，耗 ${needMats} 素材／${cost} 靈石）。`
  );
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  state.stats.fusions += 1;
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
    skillMaxed: skillLv >= SKILL_MAX_LEVEL,
    nextFusionStage: target,
    fuseNeedLevel: rule?.needLevel ?? null,
    fuseTotalPets: rule?.totalPets ?? null,
    fuseMatNeed: target != null ? fusionMaterialNeed(target) : 0,
    fuseCostHint: target != null ? fusionStoneCost(target) : null,
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
  };
}

function pushCombatText(events, text) {
  events.push({ type: "text", text });
}

function dealStrike(actor, target, power, transcript, events, skillName) {
  if (!target) return;
  const pMult = skillPowerMult(actor.skillLevel || 1);
  let dmg = Math.max(1, Math.floor(actor.atk * power * pMult) + Math.floor(Math.random() * 4) - 1);
  if (skillName === "嵐擊" || skillName === "穿空" || skillName === "礁襲") {
    dmg += Math.floor(actor.spd / 4);
  }
  const { mult, tag } = elementMatchup(actor.elementId, target.elementId);
  dmg = Math.max(1, Math.floor(dmg * mult));
  if (actor.atkBuffTurns > 0) dmg = Math.max(1, Math.floor(dmg * (1 + (actor.atkBuffPct || 0))));
  const mitigated = target.guardTurns > 0 ? Math.max(1, Math.floor(dmg * 0.55)) : dmg;
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
      dmg: mitigated,
      elemTag: tag,
      targetHp: target.hp,
      targetMaxHp: target.maxHp,
      ko: target.hp === 0,
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
    const heal = Math.max(8, Math.floor(t.maxHp * power) + actor.atk);
    t.hp = Math.min(t.maxHp, t.hp + heal);
    const line = `${actor.name} 施展【${skill.name}】，為 ${t.name} 回復 ${heal} 生命。`;
    transcript.push(line);
    if (events) {
      events.push({
        type: "heal",
        text: line,
        targetUid: t.uid,
        heal,
        targetHp: t.hp,
        targetMaxHp: t.maxHp,
      });
    }
  } else if (skill.type === "guard") {
    actor.guardTurns = 2;
    const heal = Math.max(5, Math.floor(actor.maxHp * power));
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

/**
 * 戰鬥結算（同步計算）；UI 負責逐條播放戰報。
 * 波次：雜兵 → 精英 → BOSS；敵人可施技能；BOSS 可雙動。
 * 含關卡條件獎、雜交試煉、首通、冷卻。
 */
export function runDungeon(state, dungeonId) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${stageAt(d.needRealm).name}` };
  }
  if (!state.dungeonReadyAt) state.dungeonReadyAt = {};
  if (!state.clearedDungeons) state.clearedDungeons = {};
  const now = Date.now();
  const readyAt = state.dungeonReadyAt[dungeonId] || 0;
  if (readyAt > now) {
    const sec = Math.ceil((readyAt - now) / 1000);
    return { ok: false, msg: `秘境冷卻中（${sec}s）。` };
  }

  const waves = dungeonWaves(d);
  if (!waves.length) return { ok: false, msg: "此秘境無敵人。" };

  const dailyPack = ensureDungeonDaily(state);
  const dailyMod = dailyPack?.mod || null;
  const challenge = d.challenge || null;
  const tactics = TACTIC_IDS.includes(state.tactics) ? state.tactics : "balanced";
  const formationId = FORMATION_IDS.includes(state.formation) ? state.formation : "balanced";
  const formation = FORMATIONS[formationId] || FORMATIONS.balanced;

  const chalEval = evaluateDungeonChallenge(state.pets, challenge, {
    hasMaster: !challenge?.banMaster,
  });
  // 強制入口限制：出戰人數／禁屬不符則拒進
  if (challenge?.maxPets != null && state.pets.length > challenge.maxPets) {
    return {
      ok: false,
      msg: `今日挑戰要求出戰≤${challenge.maxPets}寵（現 ${state.pets.length}）。`,
    };
  }
  if (challenge?.banElement) {
    const banned = state.pets.filter((p) => p.elementId === challenge.banElement);
    if (banned.length) {
      const elName = { flame: "焰", gloom: "幽", tide: "潮", stone: "岩", gale: "嵐" }[
        challenge.banElement
      ];
      return { ok: false, msg: `今日挑戰禁${elName || challenge.banElement}屬出戰。` };
    }
  }

  const stageBonus = state.realm * 2;
  const masterSkills = masterSkillsForStage(state.realm);
  const mGear = masterGearBonus(state);
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

  const includeMaster = !challenge?.banMaster;
  const allies = [];
  if (includeMaster) {
    allies.push({
      side: "ally",
      name: state.master.name,
      hp: Math.round((state.master.hp + state.realm * 10 + mGear.hp) * hpMult),
      maxHp: Math.round((state.master.hp + state.realm * 10 + mGear.hp) * hpMult),
      atk: Math.round((state.master.atk + stageBonus + mGear.atk) * atkMult),
      spd: Math.round((state.master.spd + Math.floor(state.realm / 2) + mGear.spd) * synergy.spdMult),
      isMaster: true,
      elementId: "tide",
      skillLevel: 1,
      skills: masterSkills,
      skillCd: Object.fromEntries(masterSkills.map((id) => [id, 0])),
      guardTurns: 0,
      atkBuffTurns: 0,
      atkBuffPct: 0,
    });
  }
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
    if (pe?.label) peNotes.push(`${displayPetName(p)}：${pe.label}`);
    allies.push({
      side: "ally",
      name: displayPetName(p),
      hp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp),
      maxHp: Math.round((p.hp + stageBonus * 2) * hpMult * gMult * fHp * pHp),
      atk: Math.round((p.atk + stageBonus) * atkMult * elemMult * gMult * fAtk * pAtk),
      spd: Math.round(p.spd * synergy.spdMult * fSpd * pSpd),
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
    return { ok: false, msg: "無出戰單位（挑戰禁人物且未派出靈寵）。" };
  }

  // Also apply passive to master if matching
  const masterAlly = allies.find((a) => a.isMaster);
  if (masterAlly) {
    const masterElemMult = dungeonElemAtkMult(combatPassives, "tide");
    if (masterElemMult !== 1) {
      masterAlly.atk = Math.round(masterAlly.atk * masterElemMult);
    }
  }

  let waveIndex = 0;
  let foes = spawnWaveFoes(waves[0], dailyMod, challenge);
  const roles = countDungeonRoles(waves);

  _combatUid = 0;
  tagCombatUnits(allies, "a");
  tagCombatUnits(foes, "f");
  const combatEvents = [];
  const say = (text) => {
    transcript.push(text);
    pushCombatText(combatEvents, text);
  };

  const lead =
    state.pets.length > 0
      ? `御靈師率靈寵進入【${d.name}】。（潮克焰→嵐→岩→幽→潮）`
      : `你獨自踏入【${d.name}】，潮霧裡似有靈息。`;
  const transcript = [lead];
  pushCombatText(combatEvents, lead);
  say(
    `本關 ${waves.length} 波 · ${roles.total} 敵（普通${roles.normal}／精英${roles.elite}／BOSS${roles.boss}）。`
  );
  say(
    `戰術【${TACTICS[tactics]?.name || tactics}】· 陣型【${formation.name}】· 自動戰鬥。`
  );
  if (challenge?.label) {
    say(
      `${challenge.label}${chalEval.ok ? "（條件已滿足，勝利可領挑戰獎）" : `（${chalEval.reason || "未滿足"}）`}`
    );
    if (challenge.banMaster) say("挑戰生效：人物未出戰。");
  }
  if (dailyMod?.label) say(dailyMod.label);
  const genNotes = state.pets
    .map((p) => {
      const g = petGeneration(p);
      const m = genCombatMult(g);
      return m > 1 ? `${displayPetName(p)}${genLabel(g)}攻血×${m.toFixed(2)}` : null;
    })
    .filter(Boolean);
  if (genNotes.length) say(`血脈代數加成：${genNotes.join("、")}。`);
  say(`—— 第 1 波・${waves[0].label} ——`);
  combatEvents.push({
    type: "wave",
    text: `—— 第 1 波・${waves[0].label} ——`,
    waveIndex: 1,
    label: waves[0].label,
    foes: foes.map(unitRosterEntry),
  });
  if (synergy.labels.length) {
    say(`陣容羈絆發動：${synergy.labels.join("、")}。`);
  }
  if (peNotes.length) {
    say(`性格被動：${peNotes.join("；")}`);
  }
  if (mGear.setLabels?.length) {
    say(`裝備套裝：${mGear.setLabels.join("、")}。`);
  }
  if ((state.tideSeals || 0) > 0) {
    say(
      `潮印 ×${state.tideSeals}（全隊攻血 ×${tideSealCombatMult(state.tideSeals).toFixed(2)}）。`
    );
  }
  if (dex.label) {
    say(dex.label);
  }
  for (const p of passives) {
    say(p.label);
  }
  for (const c of challenges) {
    say(
      c.ok ? `關卡條件已滿足：${c.label}` : `關卡條件未啟：${c.label}。${c.reason}`
    );
  }
  const trial = dungeonTrialFor(dungeonId);
  const trialCheck = trial ? partyMeetsTrial(state.pets, trial) : null;
  if (trial) {
    say(
      trialCheck.ok
        ? `雜交試煉條件已滿足（${trial.label}）——勝利可領額外獎。`
        : `雜交試煉未啟：${trial.label}。${trialCheck.reason}`
    );
  }
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
      const waveLine = `—— 第 ${waveIndex + 1} 波・${waves[waveIndex].label} 湧出！——`;
      say(waveLine);
      combatEvents.push({
        type: "wave",
        text: waveLine,
        waveIndex: waveIndex + 1,
        label: waves[waveIndex].label,
        foes: foes.map(unitRosterEntry),
      });
      return false;
    }
    return true;
  };

  while (round < maxRounds && !ended) {
    round += 1;
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
      bumpDaily(state, "win", 1);
      progressDungeonWinGoals(state);
      dailyStoneBonus = 0;
      dailyScrapBonus = 0;
      if (dailyMod?.clearStoneBonus) {
        dailyStoneBonus = dailyMod.clearStoneBonus;
        state.stones += dailyStoneBonus;
      }
      if (dailyMod?.clearScrapBonus) {
        dailyScrapBonus = dailyMod.clearScrapBonus;
        state.scrap += dailyScrapBonus;
      }
      if (dailyStoneBonus || dailyScrapBonus) {
        say(
          `今日修飾結算：+${dailyStoneBonus}石／+${dailyScrapBonus}碎片。`
        );
      }
      const first = !state.clearedDungeons[dungeonId];
      if (first && d.firstClearBonus) {
        bonusStones = d.firstClearBonus.stones || 0;
        bonusScrap = d.firstClearBonus.scrap || 0;
        state.stones += bonusStones;
        state.scrap += bonusScrap;
        state.clearedDungeons[dungeonId] = true;
        // 主線：首通解鎖對應練功地圖
        for (const site of TRAIN_SITES) {
          if (site.needClear === dungeonId) {
            unlockedSites.push(site.name);
            pushLog(state, `主線推進：解鎖練功地【${site.name}】！`);
          }
        }
        say(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、碎片 ${d.reward.scrap}。首通額外 +${bonusStones} 石／+${bonusScrap} 碎片！`
        );
      } else {
        say(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、靈晶碎片 ${d.reward.scrap}。`
        );
      }

      // 挑戰獎：banMaster 已強制生效；其餘以出戰評估
      challengeMet = !!(
        challenge &&
        evaluateDungeonChallenge(state.pets, challenge, { hasMaster: includeMaster }).ok
      );
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
        say(`挑戰達成【${challenge.label}】→ +${bits.join("／")}`);
      } else if (challenge) {
        say(`挑戰未達成【${challenge.label}】→ 無挑戰獎`);
      }

      checkAchievements(state);

      if (eliteCleared && d.eliteBonus) {
        roleStones += d.eliteBonus.stones || 0;
        roleScrap += d.eliteBonus.scrap || 0;
        say(
          `擊破精英！額外 +${d.eliteBonus.stones || 0} 石${d.eliteBonus.scrap ? `／+${d.eliteBonus.scrap} 碎片` : ""}。`
        );
      }
      if (bossCleared && d.bossBonus) {
        roleStones += d.bossBonus.stones || 0;
        roleScrap += d.bossBonus.scrap || 0;
        say(
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
          say(`條件達成【${c.label}】→ 分開結算 +${bits.join("／")}`);
        } else {
          say(`條件未達成【${c.label}】→ 無額外獎${c.reason ? `（${c.reason}）` : ""}`);
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
          say(
            `試煉達成【${trial.label}】→ 分開結算 +${trialStones}石${trialScrap ? `／+${trialScrap}碎片` : ""}`
          );
        } else {
          say(
            `試煉未達成【${trial.label}】→ 無額外獎${trialCheck?.reason ? `（${trialCheck.reason}）` : ""}`
          );
        }
      }
      const drop = rollGearDrop(dungeonId, {
        eliteCleared,
        bossCleared,
        conditionHits: condHits,
      });
      if (drop) {
        if (!state.inventory) state.inventory = [];
        state.inventory.push(drop);
        const gname = GEAR[drop.gearId]?.name || drop.gearId;
        const why = bossCleared ? "（BOSS 掉落加成）" : eliteCleared ? "（精英掉落加成）" : "";
        say(`拾獲裝備【${gname}】${why}！可至修行頁穿戴。`);
      }
    }
  }

  if (!ended) {
    say("戰鬥逾時，撤退。");
  }

  // 冷卻：無論勝負都進入（防無限刷）
  const cd = d.cooldownMs || 0;
  if (cd > 0) state.dungeonReadyAt[dungeonId] = Date.now() + cd;

  const encResult = maybeEncounterAfterDungeon(state, dungeonId, won);
  const encounter = encResult.encounter;
  if (encounter) {
    say(
      `潮霧中浮現野生${encounter.name}（${encounter.kind}·${encounter.elementName}·${encounter.personalityName}），成功率約 ${Math.round(encounter.bondRate * 100)}%——可至靈寵頁嘗試契約。`
    );
  } else if (encResult.blocked) {
    say(`待契約欄已滿（${PENDING_BOND_MAX}），未再遇見新靈。`);
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

export function dungeonStatus(state, dungeonId) {
  const d = resolveDungeon(state, dungeonId);
  if (!d) return null;
  const now = Date.now();
  const readyAt = (state.dungeonReadyAt || {})[dungeonId] || 0;
  const trial = dungeonTrialFor(dungeonId) || null;
  const trialCheck = trial ? partyMeetsTrial(state.pets, trial) : null;
  const waves = dungeonWaves(d);
  const roles = countDungeonRoles(waves);
  const condEval = evaluateDungeonConditions(state.pets, d);
  const daily = dungeonDailyView(state);
  const chalEval = evaluateDungeonChallenge(state.pets, d.challenge, {
    hasMaster: !d.challenge?.banMaster,
  });
  return {
    cleared: !!(state.clearedDungeons || {})[dungeonId],
    cooldownLeftMs: Math.max(0, readyAt - now),
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
    challengeMet: chalEval.ok,
    challengeReason: chalEval.reason || "",
    dailyVariantLabel: d.dailyVariantLabel || null,
  };
}

export function forgeHint(state) {
  const need = 3;
  if (state.scrap < need) {
    return { ok: false, msg: `靈紋鍛造需要 ${need} 碎片（現有 ${state.scrap}）。` };
  }
  if (!state.inventory) state.inventory = [];
  state.scrap -= need;

  // 優先強化已裝備的一件人物裝；否則鍛出低階裝
  const eq = state.master?.equip || {};
  const equipped = MASTER_EQUIP_SLOTS.map((s) => eq[s]).filter(Boolean);
  if (equipped.length) {
    const uid = equipped[Math.floor(Math.random() * equipped.length)];
    const r = resolveInvGear(state, uid);
    if (r) {
      const bonusAtk = 1 + Math.floor(Math.random() * 2);
      const bonusHp = 3 + Math.floor(Math.random() * 5);
      r.item.forgeAtk = (r.item.forgeAtk || 0) + bonusAtk;
      r.item.forgeHp = (r.item.forgeHp || 0) + bonusHp;
      pushLog(
        state,
        `靈紋鍛造：【${r.def.name}】強化 +${bonusAtk} 攻／+${bonusHp} 血。`
      );
      return { ok: true, msg: `${r.def.name} 強化 +${bonusAtk}攻` };
    }
  }

  const pool = Object.values(GEAR).filter((g) => g.rarity <= 2);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const item = {
    uid: `gear-forge-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    gearId: pick.id,
  };
  state.inventory.push(item);
  pushLog(state, `靈紋鍛造：獲得人物裝備【${pick.name}】。`);
  return { ok: true, msg: `鍛出 ${pick.name}` };
}

/**
 * 牧場雙親繁殖（恐龍突變式）：
 * 雜交新種族 + 稀有度升階 + 元素變異 + 天生繼承；融合仍負責同種升階。
 */
export function tryBreed(state, uidA, uidB) {
  if (!uidA || !uidB || uidA === uidB) {
    return { ok: false, msg: "請選擇兩隻不同的牧場靈寵。" };
  }
  const now = Date.now();
  if ((state.breedReadyAt || 0) > now) {
    const sec = Math.ceil((state.breedReadyAt - now) / 1000);
    return { ok: false, msg: `繁殖冷卻中（${sec}s）。` };
  }
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}），無法容納子代。` };
  }
  if (state.stones < BREED_STONE_COST) {
    return { ok: false, msg: `靈石不足（需 ${BREED_STONE_COST}）。` };
  }

  const a = state.ranch.find((p) => p.uid === uidA);
  const b = state.ranch.find((p) => p.uid === uidB);
  if (!a || !b) return { ok: false, msg: "雙親必須都在牧場待命。" };
  const busy = dispatchBusyUids(state);
  if (busy.has(uidA) || busy.has(uidB)) {
    return { ok: false, msg: "派遣中的靈寵不能繁殖。" };
  }
  const matCost = breedMatCost(petGeneration(a), petGeneration(b));
  if (!spendMaterials(state, matCost)) {
    return { ok: false, msg: `材料不足（需 ${formatMats(matCost)}）。` };
  }

  const genes = rollBreedGenes(a, b);
  state.stones -= BREED_STONE_COST;
  state.breedReadyAt = now + BREED_COOLDOWN_MS;

  const child = normalizePet(
    buildPetStats({
      id: `breed-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      species: genes.species,
      element: genes.element,
      personality: genes.personality,
      personality2: genes.personality2,
      rarity: genes.rarity,
      cost: 0,
    })
  );
  const born = breedStatInheritance(a, b, genes);
  child.atk += born.atk;
  child.hp += born.hp;
  child.spd += born.spd;
  child.uid = `${child.templateId}-born`;
  child.bornFrom = [a.uid, b.uid];
  child.generation = genes.generation;
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
  if (genes.rarity >= 3) state.stats.legendBreeds = (state.stats.legendBreeds || 0) + 1;
  if (genes.hybrid && child.speciesId) {
    if (!state.stats.speciesBreeds) state.stats.speciesBreeds = {};
    state.stats.speciesBreeds[child.speciesId] =
      (state.stats.speciesBreeds[child.speciesId] || 0) + 1;
  }
  registerBestiary(state, child);
  progressBreedGoalsFromChild(state, child, genes);
  bumpDaily(state, "breed", 1);

  const tags = [];
  tags.push(genLabel(genes.generation));
  if (genes.hybrid) tags.push("雜交新種！");
  if (genes.rarityUp) tags.push(`${child.rarityName}升階！`);
  else if (genes.rarity > 0) tags.push(child.rarityName);
  if (genes.mutated && !genes.hybrid) tags.push("元素變異");
  if (genes.personality2) tags.push(`副性${PERSONALITIES[genes.personality2]?.name || ""}`);
  const tagNote = tags.length ? `（${tags.join("·")}）` : "";
  const innNote =
    born.atk || born.hp || born.spd
      ? `｜天生 +${born.atk}攻/${born.hp}血/${born.spd}速`
      : "";
  const matNote = formatMats(matCost);
  pushLog(
    state,
    `繁殖成功：${displayPetName(a)} × ${displayPetName(b)} → ${petLabel(child)}${tagNote}${innNote}｜耗 ${BREED_STONE_COST} 石${matNote ? `／${matNote}` : ""}。`
  );
  checkAchievements(state);
  return {
    ok: true,
    msg: `誕生 ${child.name}${tagNote}${innNote}`,
    pet: child,
    mutated: genes.mutated,
    hybrid: genes.hybrid,
    rarity: genes.rarity,
    rarityUp: genes.rarityUp,
    generation: genes.generation,
    celebrate: !!(genes.hybrid || genes.rarityUp || genes.rarity >= 2 || genes.generation >= 2),
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
  if (!same && kindA !== kindB) {
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
  const now = Date.now();
  const readyAt = state.breedReadyAt || 0;
  return {
    cost: BREED_STONE_COST,
    cooldownLeftMs: Math.max(0, readyAt - now),
    ready: readyAt <= now,
  };
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
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

function pushLog(state, line) {
  state.log.unshift(line);
  if (state.log.length > 60) state.log.length = 60;
}

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
  bestiaryTotal,
  bestiaryCombatBonus,
  DAILY_QUESTS,
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
  GEAR_SETS,
  MATERIALS,
  TRAIN_SITES,
  upgradeMatCost,
  breedMatCost,
  stageAt,
  nextStageAt,
  dungeonsForRealm,
  generateDailyDungeon,
  buildDungeonForTier,
  dungeonTrialFor,
  dungeonDisplayName,
};
