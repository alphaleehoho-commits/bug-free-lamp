import {
  STAGES,
  REALMS,
  WILD_PETS,
  DUNGEONS,
  EVENTS,
  buildPetStats,
  petLabel,
} from "./data.js";

const SAVE_KEY = "void-tide-pets-v1";

function defaultMaster() {
  return {
    name: "潮行者",
    // 人物基礎；隨階段成長
    atk: 10,
    hp: 120,
    spd: 9,
  };
}

function defaultState() {
  return {
    realm: 0,
    qi: 0,
    stones: 160,
    scrap: 0,
    master: defaultMaster(),
    /** 出戰靈寵，最多 3 */
    pets: [],
    log: ["你沿著暗潮抵達荒廢契壇，準備締結第一隻靈寵。"],
    lastTick: Date.now(),
    combatsWon: 0,
    // 後期：繁殖解鎖標記
    breedingUnlocked: false,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      master: { ...base.master, ...(parsed.master || {}) },
      pets: Array.isArray(parsed.pets) ? parsed.pets : [],
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
  // 人物隨階段成長
  state.master.atk += 2;
  state.master.hp += 8;
  state.master.spd += 1;
  pushLog(state, `階段突破——晉升【${next.name}】。御靈之力加深。`);
  if (Math.random() < 0.55) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    pushLog(state, `靈兆：${ev}`);
    state.stones += 15 + state.realm * 8;
  }
  return { ok: true, msg: `階段：${next.name}` };
}

export function wildOptions(state) {
  const owned = new Set(state.pets.map((p) => p.templateId));
  return WILD_PETS.filter((t) => !owned.has(t.id)).map(buildPetStats);
}

/** @deprecated alias */
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
  pushLog(state, `締結契約：${petLabel(pet)}。`);
  return { ok: true, msg: `${pet.name} 入欄` };
}

/** @deprecated alias */
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

/** @deprecated alias */
export function dismiss(state, id) {
  return releasePet(state, id);
}

/**
 * 戰鬥：御靈師 + 最多 3 靈寵 vs 敵群（速度軸自動）
 */
export function runDungeon(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return { ok: false, msg: "秘境不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要階段：${STAGES[d.needRealm].name}` };
  }
  if (state.pets.length === 0) return { ok: false, msg: "請先締結至少一隻靈寵。" };

  const stageBonus = state.realm * 2;
  const allies = [
    {
      side: "ally",
      name: state.master.name,
      hp: state.master.hp + state.realm * 10,
      maxHp: state.master.hp + state.realm * 10,
      atk: state.master.atk + stageBonus,
      spd: state.master.spd + Math.floor(state.realm / 2),
      isMaster: true,
    },
    ...state.pets.map((p) => ({
      side: "ally",
      name: p.name,
      hp: p.hp + stageBonus * 2,
      maxHp: p.hp + stageBonus * 2,
      atk: p.atk + stageBonus,
      spd: p.spd,
      isMaster: false,
    })),
  ];

  const foes = d.enemies.map((e) => ({
    side: "foe",
    name: e.name,
    hp: e.hp,
    maxHp: e.hp,
    atk: e.atk,
    spd: e.spd,
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
      const targets = (actor.side === "ally" ? foes : allies).filter((t) => t.hp > 0);
      if (!targets.length) break;
      const target = targets.reduce((a, b) => (a.hp <= b.hp ? a : b));
      const dmg = Math.max(1, actor.atk + Math.floor(Math.random() * 4) - 1);
      target.hp = Math.max(0, target.hp - dmg);
      transcript.push(
        `${actor.name} → ${target.name}，造成 ${dmg} 傷害${target.hp === 0 ? "（擊破）" : ""}。`
      );
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
        transcript: transcript.slice(0, 28),
        msg: `勝利！+${d.reward.stones} 靈石`,
      };
    }
    if (allies.every((a) => a.hp <= 0)) {
      pushLog(state, `折戟【${d.name}】……靈寵退回契壇休養。`);
      return {
        ok: true,
        won: false,
        rounds: round,
        transcript: transcript.slice(0, 28),
        msg: "戰敗。強化靈寵或提升階段後再試。",
      };
    }
  }

  return { ok: true, won: false, rounds: round, transcript, msg: "戰鬥逾時，撤退。" };
}

/** 用碎片強化出戰靈寵（人物不吃碎片） */
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

/**
 * 後期繁殖接口（本週不做玩法，只預留）。
 * genes 已掛在每隻靈寵上，之後可交配產生新 species/element/personality 組合。
 */
export function tryBreed(_state, _uidA, _uidB) {
  return {
    ok: false,
    msg: "繁殖／交配系統尚未開放——基因位已預留，下階段再做。",
  };
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  // 清舊門徒存檔鍵，避免混淆
  localStorage.removeItem("void-tide-v1");
  localStorage.removeItem("void-tide-v2");
  return defaultState();
}

function pushLog(state, line) {
  state.log.unshift(line);
  if (state.log.length > 40) state.log.length = 40;
}

export { STAGES, REALMS, DUNGEONS, WILD_PETS, petLabel };
