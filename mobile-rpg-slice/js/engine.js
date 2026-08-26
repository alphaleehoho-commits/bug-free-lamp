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
  HYBRID_RECIPES,
  SPECIES,
} from "./data.js";

const SAVE_KEY = "void-tide-pets-v9";

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
    progress: { idle: 0, dungeon: 0, bond: 0 },
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
    ],
    lastTick: Date.now(),
    combatsWon: 0,
    breedingUnlocked: true,
    clearedDungeons: {},
    dungeonReadyAt: {},
    breedReadyAt: 0,
    /** P2 */
    bestiary: {},
    daily: emptyDaily(),
    achievements: {},
    stats: { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0, hybrids: 0, legendBreeds: 0 },
    /** 最近一次離線結算摘要（UI 顯示後可清） */
    offlineHint: null,
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
      },
      offlineHint: parsed.offlineHint || null,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTick: Date.now() }));
}

export function realmInfo(state) {
  return STAGES[Math.min(state.realm, STAGES.length - 1)];
}

export function nextRealm(state) {
  return STAGES[state.realm + 1] || null;
}

/** 牧場待命：按性格／元素慢產飼料／靈塵 */
export function tickRanchIdle(state, elapsedSec) {
  if (!state.ranch?.length || elapsedSec <= 0) return state;
  if (state.feed == null) state.feed = 0;
  if (state.dust == null) state.dust = 0;
  let feedGain = 0;
  let dustGain = 0;
  for (const p of state.ranch) {
    const pe = IDLE_BY_PERSONALITY[p.personalityId] || { feed: 0.04, dust: 0.04 };
    const el = IDLE_BY_ELEMENT[p.elementId] || { feed: 1, dust: 1 };
    const fus = 1 + (p.fusionLevel ?? 0) * 0.08;
    feedGain += pe.feed * el.feed * fus * elapsedSec;
    dustGain += pe.dust * el.dust * fus * elapsedSec;
  }
  state.feed += feedGain;
  state.dust += dustGain;
  return state;
}

export function tickCultivation(state, now = Date.now()) {
  ensureDaily(state);
  const elapsed = Math.min(Math.max(0, now - state.lastTick) / 1000, 3600 * 8);
  const qiBefore = state.qi;
  const feedBefore = state.feed || 0;
  const dustBefore = state.dust || 0;

  const ranchBonus = (state.ranch?.length || 0) * 0.04;
  const bondBonus = 1 + state.pets.length * 0.18 + ranchBonus;
  const rate = realmInfo(state).rate * bondBonus;
  state.qi += rate * elapsed;
  tickRanchIdle(state, elapsed);

  // 每日：掛機累積
  state.daily.idleSec = (state.daily.idleSec || 0) + elapsed;
  if (state.daily.idleSec >= 180) {
    bumpDaily(state, "idle", 1);
  }

  if (elapsed >= OFFLINE_HINT_SEC) {
    const qiGain = state.qi - qiBefore;
    const feedGain = (state.feed || 0) - feedBefore;
    const dustGain = (state.dust || 0) - dustBefore;
    state.offlineHint = {
      sec: Math.floor(elapsed),
      qi: qiGain,
      feed: feedGain,
      dust: dustGain,
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
    if (!state.daily.progress) state.daily.progress = { idle: 0, dungeon: 0, bond: 0 };
    if (!state.daily.claimed) state.daily.claimed = {};
    return state.daily;
  }
  const daily = dailyOrState;
  const key = todayKey(now);
  if (!daily || daily.date !== key) return emptyDaily(now);
  return {
    date: daily.date,
    progress: { idle: 0, dungeon: 0, bond: 0, ...(daily.progress || {}) },
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
  if (!state.stats) state.stats = { bonds: 0, fusions: 0, breeds: 0, releases: 0, bondAttempts: 0 };
  const unlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    let ok = false;
    if (a.id === "first_win") ok = (state.combatsWon || 0) >= 1;
    else if (a.id === "bonds_3") ok = (state.stats.bonds || 0) >= 3;
    else if (a.id === "bestiary_10") ok = Object.keys(state.bestiary || {}).length >= 10;
    else if (a.id === "fuse_once") ok = (state.stats.fusions || 0) >= 1;
    else if (a.id === "breed_once") ok = (state.stats.breeds || 0) >= 1;
    else if (a.id === "stage_2") ok = (state.realm || 0) >= 2;
    else if (a.id === "hybrid_once") ok = (state.stats.hybrids || 0) >= 1;
    else if (a.id === "legend_breed") ok = (state.stats.legendBreeds || 0) >= 1;
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

function resolveInvGear(state, itemUid) {
  if (!itemUid || !state.inventory) return null;
  const item = state.inventory.find((x) => x.uid === itemUid);
  if (!item) return null;
  const def = GEAR[item.gearId];
  if (!def) return null;
  return { item, def };
}

/** 人物裝備加成（含鍛造強化） */
export function masterGearBonus(state) {
  const eq = state.master?.equip || {};
  let atk = 0;
  let hp = 0;
  let spd = 0;
  for (const slot of MASTER_EQUIP_SLOTS) {
    const r = resolveInvGear(state, eq[slot]);
    if (!r) continue;
    atk += (r.def.atk || 0) + (r.item.forgeAtk || 0);
    hp += (r.def.hp || 0) + (r.item.forgeHp || 0);
    spd += r.def.spd || 0;
  }
  return { atk, hp, spd };
}

export function tryBreakthrough(state) {
  const next = nextRealm(state);
  if (!next) return { ok: false, msg: "已至本切片最高階段（潮主）。" };
  if (state.qi < next.need) {
    return { ok: false, msg: `靈契不足：需要 ${next.need}，現有 ${Math.floor(state.qi)}。` };
  }
  state.qi -= next.need;
  state.realm = next.id;
  state.master.atk += 1;
  state.master.hp += 4;
  state.master.spd += 1;
  state.master.skillIds = masterSkillsForStage(state.realm);
  pushLog(state, `階段突破——晉升【${next.name}】。御靈之力加深。`);
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
  return { ok: true, msg: `階段：${next.name}` };
}

function MASTER_UNLOCK_MSG(stage) {
  if (stage === 1) return "學會人物技能【潮霧庇護】。";
  if (stage === 3) return "學會人物技能【暗潮令旗】。";
  return null;
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
  if (payWith === "feed") {
    const cost = upgradeFeedCost(level);
    if ((state.feed || 0) < cost) return { ok: false, msg: `飼料不足（需 ${cost}）。` };
    state.feed -= cost;
    pet.atk += 2;
    pet.hp += 6;
    pet.spd += 1;
    pet.level = level + 1;
    pushLog(state, `${pet.name} 以飼料升級至 Lv.${pet.level}（攻+2 血+6 速+1）。`);
    maybeAnnounceSecondSkill(state, pet, level);
    return { ok: true, msg: `${pet.name} → Lv.${pet.level}（飼料）` };
  }
  const cost = upgradeStoneCost(level);
  if (state.stones < cost) return { ok: false, msg: `靈石不足（需 ${cost}）。` };
  state.stones -= cost;
  pet.atk += 2;
  pet.hp += 6;
  pet.spd += 1;
  pet.level = level + 1;
  pushLog(state, `${pet.name} 升級至 Lv.${pet.level}（攻+2 血+6 速+1）。`);
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
  const secondId = KIND_SECOND_SKILLS[pet.kind];
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

function pickFoe(foes) {
  const live = foes.filter((t) => t.hp > 0);
  if (!live.length) return null;
  return live.reduce((a, b) => (a.hp <= b.hp ? a : b));
}

function dealStrike(actor, target, power, transcript, skillName) {
  if (!target) return;
  const pMult = skillPowerMult(actor.skillLevel || 1);
  let dmg = Math.max(1, Math.floor(actor.atk * power * pMult) + Math.floor(Math.random() * 4) - 1);
  if (skillName === "嵐擊" || skillName === "穿空") dmg += Math.floor(actor.spd / 4);
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
  transcript.push(
    `${actor.name} ${verb} → ${target.name}，造成 ${mitigated} 傷害${elemNote}${target.hp === 0 ? "（擊破）" : ""}${guardNote}。`
  );
}

function useSkill(actor, skill, allies, foes, transcript) {
  const cdMap = actor.skillCd;
  if ((cdMap[skill.id] || 0) > 0) return false;
  const pMult = skillPowerMult(actor.skillLevel || 1);
  const power = skill.power * pMult;

  if (skill.type === "strike") {
    const t = pickFoe(foes);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, skill.name);
  } else if (skill.type === "cleave") {
    const live = foes.filter((f) => f.hp > 0);
    if (!live.length) return false;
    const targets = skill.id === "tide_spray" ? live.slice(0, 2) : live;
    transcript.push(`${actor.name} 施展【${skill.name}】！`);
    for (const t of targets) dealStrike(actor, t, skill.power, transcript, null);
  } else if (skill.type === "heal") {
    const t = lowestHp(allies);
    if (!t) return false;
    const heal = Math.max(8, Math.floor(t.maxHp * power) + actor.atk);
    t.hp = Math.min(t.maxHp, t.hp + heal);
    transcript.push(`${actor.name} 施展【${skill.name}】，為 ${t.name} 回復 ${heal} 生命。`);
  } else if (skill.type === "guard") {
    actor.guardTurns = 2;
    const heal = Math.max(5, Math.floor(actor.maxHp * power));
    actor.hp = Math.min(actor.maxHp, actor.hp + heal);
    transcript.push(`${actor.name} 施展【${skill.name}】，減傷並回復 ${heal}。`);
  } else if (skill.type === "debuff") {
    const t = pickFoe(foes);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, skill.name);
    t.atk = Math.max(1, Math.floor(t.atk * 0.85));
    transcript.push(`${t.name} 的攻擊因蝕咬而下降。`);
  } else if (skill.type === "buff") {
    const pct = power;
    for (const a of allies.filter((x) => x.hp > 0)) {
      a.atkBuffTurns = 3;
      a.atkBuffPct = pct;
    }
    transcript.push(
      `${actor.name} 施展【${skill.name}】，友方攻擊提升 ${Math.round(pct * 100)}%（3 回合）！`
    );
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

function act(actor, allies, foes, transcript) {
  const skills = (actor.skills || [])
    .map((id) => SKILLS[id])
    .filter(Boolean)
    .sort((a, b) => a.cd - b.cd);

  const ready = skills.filter((s) => (actor.skillCd[s.id] || 0) <= 0);
  if (ready.length && Math.random() < 0.72) {
    const skill = ready[Math.floor(Math.random() * ready.length)];
    if (useSkill(actor, skill, allies, foes, transcript)) return;
  }
  const targetSide = actor.side === "ally" ? foes : allies;
  dealStrike(actor, pickFoe(targetSide), 1, transcript, null);
}

/**
 * 戰鬥結算（同步計算）；UI 負責逐條播放戰報。
 * 可獨自進本（0 靈寵）。含元素克制、首通、冷卻。
 */
export function runDungeon(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${STAGES[d.needRealm].name}` };
  }
  if (!state.dungeonReadyAt) state.dungeonReadyAt = {};
  if (!state.clearedDungeons) state.clearedDungeons = {};
  const now = Date.now();
  const readyAt = state.dungeonReadyAt[dungeonId] || 0;
  if (readyAt > now) {
    const sec = Math.ceil((readyAt - now) / 1000);
    return { ok: false, msg: `秘境冷卻中（${sec}s）。` };
  }

  const stageBonus = state.realm * 2;
  const masterSkills = masterSkillsForStage(state.realm);
  const mGear = masterGearBonus(state);
  const synergy = partySynergy(state.pets);
  const dex = bestiaryStatus(state);
  const atkMult = synergy.atkMult * dex.atkMult;
  const hpMult = synergy.hpMult * dex.hpMult;
  const allies = [
    {
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
    },
    ...state.pets.map((p) => {
      const skills = petSkillIds(p);
      return {
        side: "ally",
        name: displayPetName(p),
        hp: Math.round((p.hp + stageBonus * 2) * hpMult),
        maxHp: Math.round((p.hp + stageBonus * 2) * hpMult),
        atk: Math.round((p.atk + stageBonus) * atkMult),
        spd: Math.round(p.spd * synergy.spdMult),
        isMaster: false,
        elementId: p.elementId,
        skillLevel: p.skillLevel ?? 1,
        skills,
        skillCd: Object.fromEntries(skills.map((id) => [id, 0])),
        guardTurns: 0,
        atkBuffTurns: 0,
        atkBuffPct: 0,
      };
    }),
  ];

  const foes = d.enemies.map((e) => ({
    side: "foe",
    name: e.name,
    hp: e.hp,
    maxHp: e.hp,
    atk: e.atk,
    spd: e.spd,
    elementId: e.element,
    skillLevel: 1,
    skills: [],
    skillCd: {},
    guardTurns: 0,
    atkBuffTurns: 0,
    atkBuffPct: 0,
  }));

  const lead =
    state.pets.length > 0
      ? `御靈師率靈寵進入【${d.name}】。（潮克焰→嵐→岩→幽→潮）`
      : `你獨自踏入【${d.name}】，潮霧裡似有靈息。`;
  const transcript = [lead];
  if (synergy.labels.length) {
    transcript.push(`陣容羈絆發動：${synergy.labels.join("、")}。`);
  }
  if (dex.label) {
    transcript.push(dex.label);
  }
  bumpDaily(state, "dungeon", 1);
  let round = 0;
  const maxRounds = 40;
  let won = false;
  let ended = false;
  let bonusStones = 0;
  let bonusScrap = 0;

  while (round < maxRounds && !ended) {
    round += 1;
    const order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));

    for (const actor of order) {
      if (actor.hp <= 0) continue;
      if (actor.side === "ally") act(actor, allies, foes, transcript);
      else {
        const target = pickFoe(allies);
        if (target) dealStrike(actor, target, 1, transcript, null);
      }
      tickCooldowns(actor);
      if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
    }

    if (foes.every((f) => f.hp <= 0)) {
      won = true;
      ended = true;
      state.stones += d.reward.stones;
      state.scrap += d.reward.scrap;
      state.combatsWon += 1;
      const first = !state.clearedDungeons[dungeonId];
      if (first && d.firstClearBonus) {
        bonusStones = d.firstClearBonus.stones || 0;
        bonusScrap = d.firstClearBonus.scrap || 0;
        state.stones += bonusStones;
        state.scrap += bonusScrap;
        state.clearedDungeons[dungeonId] = true;
        transcript.push(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、碎片 ${d.reward.scrap}。首通額外 +${bonusStones} 石／+${bonusScrap} 碎片！`
        );
      } else {
        transcript.push(
          `攻克【${d.name}】，獲靈石 ${d.reward.stones}、靈晶碎片 ${d.reward.scrap}。`
        );
      }
      const drop = rollGearDrop(dungeonId);
      if (drop) {
        if (!state.inventory) state.inventory = [];
        state.inventory.push(drop);
        const gname = GEAR[drop.gearId]?.name || drop.gearId;
        transcript.push(`拾獲裝備【${gname}】！可至修行頁穿戴。`);
      }
    } else if (allies.every((a) => a.hp <= 0)) {
      ended = true;
      transcript.push(`折戟【${d.name}】……退回契壇休養。`);
    }
  }

  if (!ended) {
    transcript.push("戰鬥逾時，撤退。");
  }

  // 冷卻：無論勝負都進入（防無限刷）
  const cd = d.cooldownMs || 0;
  if (cd > 0) state.dungeonReadyAt[dungeonId] = Date.now() + cd;

  const encResult = maybeEncounterAfterDungeon(state, dungeonId, won);
  const encounter = encResult.encounter;
  if (encounter) {
    transcript.push(
      `潮霧中浮現野生${encounter.name}（${encounter.kind}·${encounter.elementName}·${encounter.personalityName}），成功率約 ${Math.round(encounter.bondRate * 100)}%——可至靈寵頁嘗試契約。`
    );
  } else if (encResult.blocked) {
    transcript.push(`待契約欄已滿（${PENDING_BOND_MAX}），未再遇見新靈。`);
  }

  const lines = transcript.slice(0, 48);
  const totalStones = won ? d.reward.stones + bonusStones : 0;

  return {
    ok: true,
    won,
    rounds: round,
    transcript: lines,
    encounter,
    msg: won
      ? `勝利！+${totalStones} 靈石${bonusStones ? "（含首通）" : ""}`
      : ended
        ? "戰敗。"
        : "撤退。",
  };
}

export function dungeonStatus(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return null;
  const now = Date.now();
  const readyAt = (state.dungeonReadyAt || {})[dungeonId] || 0;
  return {
    cleared: !!(state.clearedDungeons || {})[dungeonId],
    cooldownLeftMs: Math.max(0, readyAt - now),
    firstClearBonus: d.firstClearBonus || null,
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

  const genes = rollBreedGenes(a, b);
  state.stones -= BREED_STONE_COST;
  state.breedReadyAt = now + BREED_COOLDOWN_MS;

  const child = normalizePet(
    buildPetStats({
      id: `breed-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      species: genes.species,
      element: genes.element,
      personality: genes.personality,
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
  child.generation = Math.max(a.generation ?? 1, b.generation ?? 1) + 1;
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
  registerBestiary(state, child);

  const tags = [];
  if (genes.hybrid) tags.push("雜交新種！");
  if (genes.rarityUp) tags.push(`${child.rarityName}升階！`);
  else if (genes.rarity > 0) tags.push(child.rarityName);
  if (genes.mutated && !genes.hybrid) tags.push("元素變異");
  const tagNote = tags.length ? `（${tags.join("·")}）` : "";
  const innNote =
    born.atk || born.hp || born.spd
      ? `｜天生 +${born.atk}攻/${born.hp}血/${born.spd}速`
      : "";
  pushLog(
    state,
    `繁殖成功：${displayPetName(a)} × ${displayPetName(b)} → ${petLabel(child)}${tagNote}${innNote}｜耗 ${BREED_STONE_COST} 靈石。`
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
  };
}

/** UI：雙親雜交提示 */
export function breedPairHint(petA, petB) {
  if (!petA || !petB) return null;
  const same = petA.speciesId === petB.speciesId;
  const kindA = petA.kind;
  const kindB = petB.kind;
  let hybridName = null;
  let hybridChance = 0;
  if (!same && kindA !== kindB) {
    const key = [kindA, kindB].sort().join("|");
    const recipe = HYBRID_RECIPES.find(
      (r) => r.chance > 0 && [r.kinds[0], r.kinds[1]].sort().join("|") === key
    );
    if (recipe && SPECIES[recipe.species]) {
      hybridName = SPECIES[recipe.species].name;
      hybridChance = recipe.chance;
    }
  }
  return {
    sameSpecies: same,
    hybridName,
    hybridChance,
    note: same
      ? "同種繁殖：較易提升稀有度"
      : hybridName
        ? `異種：約 ${Math.round(hybridChance * 100)}% 機率雜交出【${hybridName}】`
        : "異種：遺傳父母種族，並可升稀有度／元素變異",
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
  NICK_MAX_LEN,
  rarityInfo,
  RARITY_MAX,
};
