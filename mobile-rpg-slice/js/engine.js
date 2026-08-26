import {
  STAGES,
  REALMS,
  WILD_PETS,
  DUNGEONS,
  EVENTS,
  SKILLS,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  PERSONALITIES,
  buildPetStats,
  petLabel,
  masterSkillsForStage,
  skillInfo,
  rollWildEncounter,
  ranchCapForStage,
  upgradeStoneCost,
  fusionStoneCost,
} from "./data.js";

const SAVE_KEY = "void-tide-pets-v4";

function defaultMaster() {
  return {
    name: "潮行者",
    atk: 10,
    hp: 120,
    spd: 9,
    skillIds: masterSkillsForStage(0),
  };
}

function defaultState() {
  return {
    realm: 0,
    qi: 0,
    stones: 160,
    scrap: 0,
    master: defaultMaster(),
    /** 出戰欄（最多 ACTIVE_PET_MAX） */
    pets: [],
    /** 牧場待命 */
    ranch: [],
    /** 待契約野生靈寵（秘境遇見） */
    pending: [],
    log: [
      "你沿著暗潮抵達荒廢契壇。",
      "可先獨自踏入秘境；戰勝後或會遇見願意結契的靈寵。",
      "契約成功的靈寵進入牧場；再從牧場派出戰（最多 3 隻）。",
    ],
    lastTick: Date.now(),
    combatsWon: 0,
    breedingUnlocked: false,
  };
}

function normalizePet(p) {
  if (!p || typeof p !== "object") return p;
  const next = { ...p };
  if (next.level == null) next.level = 1;
  if (next.fusionLevel == null) next.fusionLevel = 0;
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
      localStorage.getItem("void-tide-pets-v3") ||
      localStorage.getItem("void-tide-pets-v2") ||
      localStorage.getItem("void-tide-pets-v1");
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    const master = { ...base.master, ...(parsed.master || {}) };
    master.skillIds = masterSkillsForStage(parsed.realm ?? 0);

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

    return {
      ...base,
      ...parsed,
      master,
      pets,
      ranch,
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
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

export function tickCultivation(state, now = Date.now()) {
  const elapsed = Math.min(Math.max(0, now - state.lastTick) / 1000, 3600 * 8);
  const ranchBonus = (state.ranch?.length || 0) * 0.04;
  const bondBonus = 1 + state.pets.length * 0.18 + ranchBonus;
  const rate = realmInfo(state).rate * bondBonus;
  state.qi += rate * elapsed;
  state.lastTick = now;
  return state;
}

export function tryBreakthrough(state) {
  const next = nextRealm(state);
  if (!next) return { ok: false, msg: "已至本切片最高階段（潮主）。" };
  if (state.qi < next.need) {
    return { ok: false, msg: `靈契不足：需要 ${next.need}，現有 ${Math.floor(state.qi)}。` };
  }
  state.qi -= next.need;
  state.realm = next.id;
  state.master.atk += 2;
  state.master.hp += 8;
  state.master.spd += 1;
  state.master.skillIds = masterSkillsForStage(state.realm);
  pushLog(state, `階段突破——晉升【${next.name}】。御靈之力加深。`);
  pushLog(state, `牧場容量擴展至 ${ranchCap(state)}。`);
  const unlocked = MASTER_UNLOCK_MSG(state.realm);
  if (unlocked) pushLog(state, unlocked);
  if (Math.random() < 0.55) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    pushLog(state, `靈兆：${ev}`);
    state.stones += 15 + state.realm * 8;
  }
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

/** 打本後嘗試遇見野生靈寵 */
export function maybeEncounterAfterDungeon(state, dungeonId, won) {
  if (state.pending.length >= PENDING_BOND_MAX) {
    return { blocked: true, encounter: null };
  }
  let rate = won ? 0.62 : 0.22;
  if (state.pets.length === 0 && (state.ranch?.length || 0) === 0) rate = won ? 0.92 : 0.4;
  if (Math.random() > rate) return { blocked: false, encounter: null };

  const enc = rollWildEncounter(dungeonId);
  state.pending.push(enc);
  return { blocked: false, encounter: enc };
}

/** 嘗試契約待契約寵物（成功進入牧場） */
export function tryBondPending(state, encounterId) {
  if (!state.ranch) state.ranch = [];
  const cap = ranchCap(state);
  if (state.ranch.length >= cap) {
    return { ok: false, msg: `牧場已滿（${cap}）。可先放歸或升階擴容。` };
  }
  const i = state.pending.findIndex((p) => p.encounterId === encounterId);
  if (i < 0) return { ok: false, msg: "找不到這隻待契約靈寵。" };
  const cand = state.pending[i];
  if (state.stones < cand.cost) return { ok: false, msg: "靈石不足。" };

  state.stones -= cand.cost;
  const roll = Math.random();
  if (roll <= cand.bondRate) {
    state.pending.splice(i, 1);
    const pet = normalizePet({
      ...cand,
      uid: `${cand.encounterId}-bonded`,
      status: "bonded",
    });
    delete pet.bondRate;
    delete pet.status;
    state.ranch.push(pet);
    pushLog(state, `契約成功：${petLabel(pet)} 進入牧場｜技能【${pet.skillName}】。`);
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
  pushLog(state, `放歸 ${gone.name}。`);
  return { ok: true, msg: `${gone.name} 已放歸` };
}

/** 升級靈寵（出戰或牧場） */
export function upgradePet(state, uid) {
  const found = findOwnedPet(state, uid);
  if (!found) return { ok: false, msg: "找不到靈寵。" };
  const pet = found.pet;
  const level = pet.level ?? 1;
  const cost = upgradeStoneCost(level);
  if (state.stones < cost) return { ok: false, msg: `靈石不足（需 ${cost}）。` };
  state.stones -= cost;
  pet.atk += 2;
  pet.hp += 6;
  pet.spd += 1;
  pet.level = level + 1;
  pushLog(state, `${pet.name} 升級至 Lv.${pet.level}（攻+2 血+6 速+1）。`);
  return { ok: true, msg: `${pet.name} → Lv.${pet.level}` };
}

/**
 * 融合：同種族；結果 fusionLevel = max+1；保留本體，消耗素材。
 * 性格：預設保留本體；若素材 fusion 更高，35% 繼承素材性格。
 */
export function fusePets(state, baseUid, matUid) {
  if (baseUid === matUid) return { ok: false, msg: "不能與自己融合。" };
  const baseFound = findOwnedPet(state, baseUid);
  const matFound = findOwnedPet(state, matUid);
  if (!baseFound || !matFound) return { ok: false, msg: "找不到靈寵。" };
  const base = baseFound.pet;
  const mat = matFound.pet;
  if (base.speciesId !== mat.speciesId) {
    return { ok: false, msg: "只能融合同種族靈寵。" };
  }

  const baseFusion = base.fusionLevel ?? 0;
  const matFusion = mat.fusionLevel ?? 0;
  const resultFusion = Math.max(baseFusion, matFusion) + 1;
  const cost = fusionStoneCost(resultFusion);
  if (state.stones < cost) return { ok: false, msg: `靈石不足（需 ${cost}）。` };

  state.stones -= cost;

  // 吸收素材數值
  base.atk += Math.max(1, Math.floor(mat.atk * 0.2)) + resultFusion;
  base.hp += Math.max(2, Math.floor(mat.hp * 0.15)) + resultFusion * 3;
  base.spd += Math.max(0, Math.floor(mat.spd * 0.1));
  if (resultFusion >= 2) base.spd += 1;
  base.fusionLevel = resultFusion;

  if (matFusion > baseFusion && Math.random() < 0.35) {
    const pe = PERSONALITIES[mat.personalityId];
    if (pe) {
      base.personalityId = pe.id;
      base.personalityName = pe.name;
      if (base.genes) base.genes.personality = pe.id;
      pushLog(state, `${base.name} 融合後性格傾向【${pe.name}】。`);
    }
  }

  // 移除素材
  const matList = matFound.list === "pets" ? state.pets : state.ranch;
  matList.splice(matFound.index, 1);

  // 若 base 與 mat 同 list 且 mat index < base index，base 索引可能錯位——已用物件引用改 stats，無需再找

  pushLog(
    state,
    `融合完成：${base.name} 融階 ${resultFusion}（耗 ${cost} 靈石）。`
  );
  return {
    ok: true,
    msg: `${base.name} 融階 ${resultFusion}`,
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
  const nextFusion = fusion + 1;
  return {
    pet,
    location: found.list,
    deployed: found.list === "pets",
    level,
    fusionLevel: fusion,
    upgradeCost: upgradeStoneCost(level),
    /** 與同階素材融合時的預估最低花費（結果 = fusion+1） */
    fuseCostHint: fusionStoneCost(nextFusion),
    skill: skillInfo(pet.skillId),
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
  let dmg = Math.max(1, Math.floor(actor.atk * power) + Math.floor(Math.random() * 4) - 1);
  if (skillName === "嵐擊") dmg += Math.floor(actor.spd / 4);
  const mitigated = target.guardTurns > 0 ? Math.max(1, Math.floor(dmg * 0.55)) : dmg;
  target.hp = Math.max(0, target.hp - mitigated);
  const guardNote = target.guardTurns > 0 ? "（甲盾減傷）" : "";
  let verb = "普通攻擊";
  if (skillName) verb = `施展【${skillName}】`;
  else if (power !== 1) verb = "餘波擊中";
  transcript.push(
    `${actor.name} ${verb} → ${target.name}，造成 ${mitigated} 傷害${target.hp === 0 ? "（擊破）" : ""}${guardNote}。`
  );
}

function useSkill(actor, skill, allies, foes, transcript) {
  const cdMap = actor.skillCd;
  if ((cdMap[skill.id] || 0) > 0) return false;

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
    const heal = Math.max(8, Math.floor(t.maxHp * skill.power) + actor.atk);
    t.hp = Math.min(t.maxHp, t.hp + heal);
    transcript.push(`${actor.name} 施展【${skill.name}】，為 ${t.name} 回復 ${heal} 生命。`);
  } else if (skill.type === "guard") {
    actor.guardTurns = 2;
    const heal = Math.max(5, Math.floor(actor.maxHp * skill.power));
    actor.hp = Math.min(actor.maxHp, actor.hp + heal);
    transcript.push(`${actor.name} 施展【${skill.name}】，減傷並回復 ${heal}。`);
  } else if (skill.type === "debuff") {
    const t = pickFoe(foes);
    if (!t) return false;
    dealStrike(actor, t, skill.power, transcript, skill.name);
    t.atk = Math.max(1, Math.floor(t.atk * 0.85));
    transcript.push(`${t.name} 的攻擊因蝕咬而下降。`);
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
 * 可獨自進本（0 靈寵）。
 */
export function runDungeon(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${STAGES[d.needRealm].name}` };
  }

  const stageBonus = state.realm * 2;
  const masterSkills = masterSkillsForStage(state.realm);
  const allies = [
    {
      side: "ally",
      name: state.master.name,
      hp: state.master.hp + state.realm * 10,
      maxHp: state.master.hp + state.realm * 10,
      atk: state.master.atk + stageBonus,
      spd: state.master.spd + Math.floor(state.realm / 2),
      isMaster: true,
      skills: masterSkills,
      skillCd: Object.fromEntries(masterSkills.map((id) => [id, 0])),
      guardTurns: 0,
    },
    ...state.pets.map((p) => ({
      side: "ally",
      name: p.name,
      hp: p.hp + stageBonus * 2,
      maxHp: p.hp + stageBonus * 2,
      atk: p.atk + stageBonus,
      spd: p.spd,
      isMaster: false,
      skills: p.skillId ? [p.skillId] : [],
      skillCd: p.skillId ? { [p.skillId]: 0 } : {},
      guardTurns: 0,
    })),
  ];

  const foes = d.enemies.map((e) => ({
    side: "foe",
    name: e.name,
    hp: e.hp,
    maxHp: e.hp,
    atk: e.atk,
    spd: e.spd,
    skills: [],
    skillCd: {},
    guardTurns: 0,
  }));

  const lead =
    state.pets.length > 0
      ? `御靈師率靈寵進入【${d.name}】。`
      : `你獨自踏入【${d.name}】，潮霧裡似有靈息。`;
  const transcript = [lead];
  let round = 0;
  const maxRounds = 40;
  let won = false;
  let ended = false;

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
      transcript.push(
        `攻克【${d.name}】，獲靈石 ${d.reward.stones}、靈晶碎片 ${d.reward.scrap}。`
      );
    } else if (allies.every((a) => a.hp <= 0)) {
      ended = true;
      transcript.push(`折戟【${d.name}】……退回契壇休養。`);
    }
  }

  if (!ended) {
    transcript.push("戰鬥逾時，撤退。");
  }

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
  // 見聞由 UI 戰報播放時逐條寫入

  return {
    ok: true,
    won,
    rounds: round,
    transcript: lines,
    encounter,
    msg: won
      ? `勝利！+${d.reward.stones} 靈石`
      : ended
        ? "戰敗。"
        : "撤退。",
  };
}

export function forgeHint(state) {
  const need = 3;
  if (state.scrap < need) {
    return { ok: false, msg: `靈紋鍛造需要 ${need} 碎片（現有 ${state.scrap}）。` };
  }
  if (state.pets.length === 0) return { ok: false, msg: "沒有可強化的靈寵。" };
  state.scrap -= need;
  state.stones += 20;
  const bonus = 2 + Math.floor(Math.random() * 3);
  state.pets.forEach((p) => {
    p.atk += bonus;
    p.hp += bonus * 3;
  });
  pushLog(state, `靈紋鍛造：出戰靈寵攻擊 +${bonus}，生命 +${bonus * 3}。`);
  return { ok: true, msg: `靈寵強化 +${bonus} 攻` };
}

export function tryBreed(_state, _uidA, _uidB) {
  return {
    ok: false,
    msg: "繁殖／交配系統尚未開放——基因位已預留，下階段再做。",
  };
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
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
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  petLabel,
  skillInfo,
  masterSkillsForStage,
  ranchCapForStage,
  upgradeStoneCost,
  fusionStoneCost,
};
