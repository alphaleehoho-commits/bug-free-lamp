import { REALMS, RECRUIT_POOL, DUNGEONS, EVENTS } from "./data.js";

const SAVE_KEY = "void-tide-v2";

function defaultState() {
  return {
    realm: 0,
    qi: 0,
    stones: 160,
    scrap: 0,
    party: [],
    log: ["你踏入暗潮沿岸的廢棄道觀。"],
    lastTick: Date.now(),
    combatsWon: 0,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTick: Date.now() }));
}

export function realmInfo(state) {
  return REALMS[Math.min(state.realm, REALMS.length - 1)];
}

export function nextRealm(state) {
  return REALMS[state.realm + 1] || null;
}

/** Offline + online idle qi gain */
export function tickCultivation(state, now = Date.now()) {
  const elapsed = Math.min(Math.max(0, now - state.lastTick) / 1000, 3600 * 8);
  const rate = realmInfo(state).rate * (1 + state.party.length * 0.15);
  state.qi += rate * elapsed;
  state.lastTick = now;
  return state;
}

export function tryBreakthrough(state) {
  const next = nextRealm(state);
  if (!next) return { ok: false, msg: "已至本切片最高境界（元嬰）。" };
  if (state.qi < next.need) {
    return { ok: false, msg: `修為不足：需要 ${next.need}，現有 ${Math.floor(state.qi)}。` };
  }
  state.qi -= next.need;
  state.realm = next.id;
  pushLog(state, `突破成功——踏入【${next.name}】。`);
  if (Math.random() < 0.55) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    pushLog(state, `奇遇：${ev}`);
    state.stones += 15 + state.realm * 8;
  }
  return { ok: true, msg: `境界：${next.name}` };
}

export function recruitOptions(state) {
  const owned = new Set(state.party.map((p) => p.id));
  return RECRUIT_POOL.filter((c) => !owned.has(c.id));
}

export function recruit(state, id) {
  if (state.party.length >= 3) return { ok: false, msg: "隊伍已滿（最多 3 人）。" };
  const cand = RECRUIT_POOL.find((c) => c.id === id);
  if (!cand) return { ok: false, msg: "找不到此人。" };
  if (state.party.some((p) => p.id === id)) return { ok: false, msg: "已在隊伍中。" };
  if (state.stones < cand.cost) return { ok: false, msg: "靈石不足。" };
  state.stones -= cand.cost;
  state.party.push({ ...cand, curHp: cand.hp });
  pushLog(state, `招募【${cand.name}】加入隊伍。`);
  return { ok: true, msg: `${cand.name} 入隊` };
}

export function dismiss(state, id) {
  const i = state.party.findIndex((p) => p.id === id);
  if (i < 0) return { ok: false, msg: "不在隊伍。" };
  const [gone] = state.party.splice(i, 1);
  pushLog(state, `${gone.name} 離去。`);
  return { ok: true, msg: `${gone.name} 離隊` };
}

/**
 * Simple speed-ordered auto combat (地下城堡-lite).
 * Returns { won, rounds, transcript[] }
 */
export function runDungeon(state, dungeonId) {
  const d = DUNGEONS.find((x) => x.id === dungeonId);
  if (!d) return { ok: false, msg: "地牢不存在。" };
  if (state.realm < d.needRealm) {
    return { ok: false, msg: `需要境界：${REALMS[d.needRealm].name}` };
  }
  if (state.party.length === 0) return { ok: false, msg: "請先招募至少一名門徒。" };

  const allies = state.party.map((p) => ({
    side: "ally",
    name: p.name,
    hp: p.hp,
    maxHp: p.hp,
    atk: p.atk + state.realm * 2,
    spd: p.spd,
  }));
  const foes = d.enemies.map((e) => ({
    side: "foe",
    name: e.name,
    hp: e.hp,
    maxHp: e.hp,
    atk: e.atk,
    spd: e.spd,
  }));

  const transcript = [`進入【${d.name}】。`];
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
      transcript.push(`${actor.name} → ${target.name}，造成 ${dmg} 傷害${target.hp === 0 ? "（擊破）" : ""}。`);
    }

    if (foes.every((f) => f.hp <= 0)) {
      state.stones += d.reward.stones;
      state.scrap += d.reward.scrap;
      state.combatsWon += 1;
      pushLog(
        state,
        `攻克【${d.name}】，獲靈石 ${d.reward.stones}、碎片 ${d.reward.scrap}。`
      );
      return {
        ok: true,
        won: true,
        rounds: round,
        transcript: transcript.slice(0, 24),
        msg: `勝利！+${d.reward.stones} 靈石`,
      };
    }
    if (allies.every((a) => a.hp <= 0)) {
      pushLog(state, `折戟【${d.name}】……門徒退回道觀休養。`);
      return {
        ok: true,
        won: false,
        rounds: round,
        transcript: transcript.slice(0, 24),
        msg: "戰敗。調整裝備與境界後再試。",
      };
    }
  }

  return { ok: true, won: false, rounds: round, transcript, msg: "戰鬥逾時，撤退。" };
}

export function forgeHint(state) {
  const need = 3;
  if (state.scrap < need) return { ok: false, msg: `鍛造需要 ${need} 碎片（現有 ${state.scrap}）。` };
  state.scrap -= need;
  state.stones += 20;
  const bonus = 2 + Math.floor(Math.random() * 3);
  state.party.forEach((p) => {
    p.atk += bonus;
    p.hp += bonus * 3;
  });
  pushLog(state, `鍛造完成：全隊攻擊 +${bonus}，生命 +${bonus * 3}。`);
  return { ok: true, msg: `全隊強化 +${bonus} 攻` };
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  return defaultState();
}

function pushLog(state, line) {
  state.log.unshift(line);
  if (state.log.length > 40) state.log.length = 40;
}

export { REALMS, DUNGEONS, RECRUIT_POOL };
