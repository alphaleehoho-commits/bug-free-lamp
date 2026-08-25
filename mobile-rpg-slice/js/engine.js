import {
  STAGES,
  REALMS,
  WILD_PETS,
  DUNGEONS,
  EVENTS,
  SKILLS,
  buildPetStats,
  petLabel,
  masterSkillsForStage,
  skillInfo,
} from "./data.js";

const SAVE_KEY = "void-tide-pets-v2";

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
    pets: [],
    log: ["你沿著暗潮抵達荒廢契壇，準備締結第一隻靈寵。"],
    lastTick: Date.now(),
    combatsWon: 0,
    breedingUnlocked: false,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem("void-tide-pets-v1");
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    const master = { ...base.master, ...(parsed.master || {}) };
    master.skillIds = masterSkillsForStage(parsed.realm ?? 0);
    const pets = (Array.isArray(parsed.pets) ? parsed.pets : []).map((p) => {
      if (p.skillId) return p;
      // 舊存檔補技能
      const rebuilt = WILD_PETS.find((t) => t.id === p.templateId);
      if (rebuilt) {
        const fresh = buildPetStats(rebuilt);
        return { ...fresh, ...p, skillId: fresh.skillId, skillName: fresh.skillName };
      }
      return p;
    });
    return {
      ...base,
      ...parsed,
      master,
      pets,
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
  const bondBonus = 1 + state.pets.length * 0.18;
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

export function wildOptions(state) {
  const owned = new Set(state.pets.map((p) => p.templateId));
  return WILD_PETS.filter((t) => !owned.has(t.id)).map(buildPetStats);
}

export function recruitOptions(state) {
  return wildOptions(state);
}

export function bondPet(state, templateId) {
  if (state.pets.length >= 3) return { ok: false, msg: "靈寵欄已滿（最多 3 隻）。" };
  const tmpl = WILD_PETS.find((t) => t.id === templateId);
  if (!tmpl) return { ok: false, msg: "找不到這隻靈寵。" };
  if (state.pets.some((p) => p.templateId === templateId)) {
    return { ok: false, msg: "已締結此靈。" };
  }
  if (state.stones < tmpl.cost) return { ok: false, msg: "靈石不足。" };
  const pet = buildPetStats(tmpl);
  state.stones -= tmpl.cost;
  state.pets.push({ ...pet, uid: `${pet.templateId}-${Date.now()}` });
  pushLog(state, `締結契約：${petLabel(pet)}｜技能【${pet.skillName}】。`);
  return { ok: true, msg: `${pet.name}｜${pet.skillName}` };
}

export function recruit(state, id) {
  return bondPet(state, id);
}

export function releasePet(state, uid) {
  const i = state.pets.findIndex((p) => p.uid === uid || p.templateId === uid);
  if (i < 0) return { ok: false, msg: "不在靈寵欄。" };
  const [gone] = state.pets.splice(i, 1);
  pushLog(state, `放歸 ${gone.name}。`);
  return { ok: true, msg: `${gone.name} 已放歸` };
}

export function dismiss(state, id) {
  return releasePet(state, id);
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
    for (const t of targets) {
      dealStrike(actor, t, skill.power, transcript, null);
    }
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

  // 冷卻好就優先放技能（約 70%），否則普攻
  const ready = skills.filter((s) => (actor.skillCd[s.id] || 0) <= 0);
  if (ready.length && Math.random() < 0.72) {
    const skill = ready[Math.floor(Math.random() * ready.length)];
    if (useSkill(actor, skill, allies, foes, transcript)) return;
  }
  const targetSide = actor.side === "ally" ? foes : allies;
  const target = pickFoe(targetSide);
  dealStrike(actor, target, 1, transcript, null);
}

/**
 * 戰鬥：御靈師 + 靈寵，帶技能冷卻
 */
export function runDungeon(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${STAGES[d.needRealm].name}` };
  }
  if (state.pets.length === 0) return { ok: false, msg: "請先締結至少一隻靈寵。" };

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

  const transcript = [`御靈師率靈寵進入【${d.name}】。`];
  let round = 0;
  const maxRounds = 40;

  while (round < maxRounds) {
    round += 1;
    const order = [...allies, ...foes]
      .filter((u) => u.hp > 0)
      .sort((a, b) => b.spd - a.spd || a.name.localeCompare(b.name));

    for (const actor of order) {
      if (actor.hp <= 0) continue;
      if (actor.side === "ally") act(actor, allies, foes, transcript);
      else {
        const target = pickFoe(allies);
        if (target) {
          target._lastAttacker = actor.name;
          dealStrike(actor, target, 1, transcript, null);
        }
      }
      tickCooldowns(actor);
      if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
    }

    if (foes.every((f) => f.hp <= 0)) {
      state.stones += d.reward.stones;
      state.scrap += d.reward.scrap;
      state.combatsWon += 1;
      pushLog(
        state,
        `攻克【${d.name}】，獲靈石 ${d.reward.stones}、靈晶碎片 ${d.reward.scrap}。`
      );
      return {
        ok: true,
        won: true,
        rounds: round,
        transcript: transcript.slice(0, 36),
        msg: `勝利！+${d.reward.stones} 靈石`,
      };
    }
    if (allies.every((a) => a.hp <= 0)) {
      pushLog(state, `折戟【${d.name}】……靈寵退回契壇休養。`);
      return {
        ok: true,
        won: false,
        rounds: round,
        transcript: transcript.slice(0, 36),
        msg: "戰敗。強化靈寵或提升階段後再試。",
      };
    }
  }

  return { ok: true, won: false, rounds: round, transcript, msg: "戰鬥逾時，撤退。" };
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
  pushLog(state, `靈紋鍛造：全靈寵攻擊 +${bonus}，生命 +${bonus * 3}。`);
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
  localStorage.removeItem("void-tide-pets-v1");
  localStorage.removeItem("void-tide-v1");
  localStorage.removeItem("void-tide-v2");
  return defaultState();
}

function pushLog(state, line) {
  state.log.unshift(line);
  if (state.log.length > 40) state.log.length = 40;
}

export { STAGES, REALMS, DUNGEONS, WILD_PETS, SKILLS, petLabel, skillInfo, masterSkillsForStage };
