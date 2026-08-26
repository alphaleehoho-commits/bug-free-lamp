import {
  loadState,
  saveState,
  tickCultivation,
  tryBreakthrough,
  tryBondPending,
  dismissPending,
  releasePet,
  deployPet,
  undeployPet,
  upgradePet,
  upgradePetSkill,
  fusePets,
  petDetail,
  runDungeon,
  forgeHint,
  tryBreed,
  breedStatus,
  dungeonStatus,
  resetSave,
  realmInfo,
  nextRealm,
  ranchCap,
  inventoryView,
  equipMaster,
  unequipMaster,
  masterGearBonus,
  partySynergy,
  renamePet,
  clearOfflineHint,
  claimDaily,
  dailyView,
  achievementsView,
  bestiaryStatus,
  displayPetName,
  breedPairHint,
  rarityInfo,
  genLabel,
  petGeneration,
  DUNGEONS,
  SKILLS,
  MASTER_EQUIP_SLOTS,
  SLOT_LABEL,
  PENDING_BOND_MAX,
  ACTIVE_PET_MAX,
  FUSION_MAX_STAGE,
  BREED_STONE_COST,
  BOND_FEED_COST,
  BOND_FEED_BONUS,
  NICK_MAX_LEN,
  bestiaryEntries,
  masterSkillsForStage,
  fusionStoneCost,
} from "./engine.js";

const app = document.querySelector("#app");

let state = loadState();
state = tickCultivation(state);
saveState(state);

let flash = "";
let flashTimer = 0;
let tab = "cultivate";
let shellReady = false;

/** @type {{ mode: 'list' | 'detail' | 'fuse' | 'breed', uid: string | null, fuseBase: string | null, fuseMats: string[], breedParents: string[] }} */
let petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };

/** @type {null | {
 *  lines: string[],
 *  shown: string[],
 *  index: number,
 *  result: object,
 *  timer: number | null,
 *  done: boolean
 * }} */
let playback = null;

const LINE_MS = 520;

function setFlash(msg) {
  flash = msg;
  const el = document.querySelector("[data-live=flash]");
  if (el) {
    if (msg) {
      el.hidden = false;
      el.textContent = msg;
    } else {
      el.hidden = true;
      el.textContent = "";
    }
  } else {
    render();
  }
  clearTimeout(flashTimer);
  if (msg) {
    flashTimer = setTimeout(() => {
      flash = "";
      const f = document.querySelector("[data-live=flash]");
      if (f) {
        f.hidden = true;
        f.textContent = "";
      }
    }, 2200);
  }
}

function stopPlayback() {
  if (playback?.timer) clearInterval(playback.timer);
  playback = null;
}

function switchTab(id) {
  if (playback && !playback.done) return; // 戰鬥播放中唔切頁
  tab = id;
  if (id !== "party") {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
  }
  render();
}

function patchLive() {
  if (playback && !playback.done) return;
  state = tickCultivation(state);
  const next = nextRealm(state);
  const stage = realmInfo(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;

  const qiText = document.querySelector("[data-live=qi-text]");
  const qiBar = document.querySelector("[data-live=qi-bar]");
  const stones = document.querySelector("[data-live=stones]");
  const scrap = document.querySelector("[data-live=scrap]");
  const feed = document.querySelector("[data-live=feed]");
  const dust = document.querySelector("[data-live=dust]");
  const stageEl = document.querySelector("[data-live=stage]");
  const wins = document.querySelector("[data-live=wins]");

  if (qiText) {
    qiText.textContent = next
      ? `靈契 ${Math.floor(state.qi)} / ${next.need}`
      : `靈契 ${Math.floor(state.qi)}（已滿）`;
  }
  if (qiBar) qiBar.style.width = `${qiPct}%`;
  if (stones) stones.textContent = String(Math.floor(state.stones));
  if (scrap) scrap.textContent = String(state.scrap);
  if (feed) feed.textContent = String(Math.floor(state.feed || 0));
  if (dust) dust.textContent = String(Math.floor(state.dust || 0));
  if (stageEl) stageEl.textContent = stage.name;
  if (wins) wins.textContent = `勝場 ${state.combatsWon}`;
}

function updatePlaybackDom() {
  if (!playback) return;
  const total = Math.max(1, playback.lines.length);
  const pct = Math.min(100, Math.round((playback.index / total) * 100));
  const bar = document.querySelector("[data-live=combat-bar]");
  const meta = document.querySelector("[data-live=combat-meta]");
  const list = document.querySelector("[data-live=combat-log]");
  if (bar) bar.style.width = `${pct}%`;
  if (meta) {
    meta.textContent = playback.done
      ? `${playback.result.msg}（${playback.result.rounds} 回合）`
      : `戰鬥進行中… ${playback.index}/${total}`;
  }
  if (list && playback.shown.length) {
    const last = playback.shown[playback.shown.length - 1];
    // 只 append 最新一條，避免整表重繪閃爍
    if (!list.dataset.lastLine || list.dataset.lastLine !== last) {
      const li = document.createElement("li");
      li.className = "log-line-in";
      li.textContent = last;
      list.prepend(li);
      list.dataset.lastLine = last;
      while (list.children.length > 24) list.removeChild(list.lastChild);
    }
  }
}

function finishPlayback() {
  if (!playback) return;
  playback.done = true;
  if (playback.timer) {
    clearInterval(playback.timer);
    playback.timer = null;
  }
  updatePlaybackDom();
  saveState(state);
  setFlash(playback.result.msg);
  // 解鎖返回按鈕
  const back = document.querySelector("[data-act=clear-combat]");
  if (back) back.disabled = false;
  const skip = document.querySelector("[data-act=skip-combat]");
  if (skip) skip.hidden = true;
}

function advancePlayback() {
  if (!playback || playback.done) return;
  if (playback.index >= playback.lines.length) {
    finishPlayback();
    return;
  }
  const line = playback.lines[playback.index];
  playback.shown.push(line);
  playback.index += 1;
  // 見聞逐條記入
  state.log.unshift(line);
  if (state.log.length > 60) state.log.length = 60;
  updatePlaybackDom();
  if (playback.index >= playback.lines.length) finishPlayback();
}

function startPlayback(result) {
  stopPlayback();
  tab = "dungeon";
  playback = {
    lines: result.transcript || [],
    shown: [],
    index: 0,
    result,
    timer: null,
    done: false,
  };
  render();
  // 立即出第一條，其餘定時
  advancePlayback();
  playback.timer = setInterval(advancePlayback, LINE_MS);
}

function skipPlayback() {
  if (!playback || playback.done) return;
  while (playback.index < playback.lines.length) {
    const line = playback.lines[playback.index];
    playback.shown.push(line);
    state.log.unshift(line);
    playback.index += 1;
  }
  if (state.log.length > 60) state.log.length = 60;
  finishPlayback();
  // 補齊 DOM 列表
  const list = document.querySelector("[data-live=combat-log]");
  if (list) {
    list.innerHTML = playback.shown
      .slice()
      .reverse()
      .slice(0, 24)
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join("");
  }
  updatePlaybackDom();
}

function render() {
  state = tickCultivation(state);
  const stage = realmInfo(state);
  const next = nextRealm(state);
  const qiPct = next ? Math.min(100, (state.qi / next.need) * 100) : 100;
  const m = state.master;
  const enterClass = shellReady ? "is-settled" : "is-enter";
  const busy = playback && !playback.done;

  app.className = enterClass;
  app.innerHTML = `
    <header class="top">
      <p class="brand">暗潮</p>
      <p class="tag">靈寵修行 · 豎屏切片</p>
    </header>

    <section class="hero-strip" aria-hidden="true"></section>

    <div class="stats">
      <div><span>階段</span><strong data-live="stage">${stage.name}</strong></div>
      <div><span>靈石</span><strong data-live="stones">${Math.floor(state.stones)}</strong></div>
      <div><span>碎片</span><strong data-live="scrap">${state.scrap}</strong></div>
      <div><span>飼料</span><strong data-live="feed">${Math.floor(state.feed || 0)}</strong></div>
      <div><span>靈塵</span><strong data-live="dust">${Math.floor(state.dust || 0)}</strong></div>
    </div>

    <p class="flash" data-live="flash" ${flash ? "" : "hidden"}>${escapeHtml(flash)}</p>
    ${offlineBanner()}

    <nav class="tabs" role="tablist">
      ${tabBtn("cultivate", "修行", busy)}
      ${tabBtn("party", "靈寵", busy)}
      ${tabBtn("dungeon", "秘境", busy)}
      ${tabBtn("codex", "圖鑑", busy)}
      ${tabBtn("log", "見聞", busy)}
    </nav>

    <main class="panel">
      ${tab === "cultivate" ? cultivatePanel(qiPct, next, m) : ""}
      ${tab === "party" ? petsPanel() : ""}
      ${tab === "dungeon" ? dungeonPanel() : ""}
      ${tab === "codex" ? codexPanel() : ""}
      ${tab === "log" ? logPanel() : ""}
    </main>

    <footer class="foot">
      <button type="button" class="ghost" data-act="reset" ${busy ? "disabled" : ""}>重置存檔</button>
      <span data-live="wins">勝場 ${state.combatsWon}</span>
    </footer>
  `;

  bind();
  shellReady = true;
  saveState(state);
  if (playback) updatePlaybackDom();
}

function offlineBanner() {
  const h = state.offlineHint;
  if (!h) return "";
  const min = Math.max(1, Math.round(h.sec / 60));
  return `
    <div class="offline-banner" data-live="offline">
      <p>離線約 ${min} 分鐘：靈契 +${Math.floor(h.qi)} · 飼料 +${h.feed.toFixed(1)} · 靈塵 +${h.dust.toFixed(1)}</p>
      <button type="button" data-act="clear-offline">知道了</button>
    </div>`;
}

function tabBtn(id, label, busy) {
  return `<button type="button" role="tab" class="${tab === id ? "on" : ""}" data-tab="${id}" ${busy && id !== "dungeon" ? "disabled" : ""}>${label}</button>`;
}

function cultivatePanel(qiPct, next, m) {
  const skills = masterSkillsForStage(state.realm)
    .map((id) => SKILLS[id])
    .filter(Boolean)
    .map((s) => `<li><strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.desc)}（CD${s.cd}）</li>`)
    .join("");

  const gBonus = masterGearBonus(state);
  const eq = m.equip || {};
  const inv = inventoryView(state);
  const totalAtk = m.atk + gBonus.atk;
  const totalHp = m.hp + gBonus.hp;
  const totalSpd = m.spd + gBonus.spd;

  const slotSelects = MASTER_EQUIP_SLOTS.map((slot) => {
    const cur = eq[slot];
    const opts = inv
      .filter((x) => x.slot === slot && (!x.worn || x.uid === cur))
      .map(
        (x) =>
          `<option value="${escapeHtml(x.uid)}" ${x.uid === cur ? "selected" : ""}>${escapeHtml(x.name)} 攻${x.atk} 血${x.hp} 速${x.spd}</option>`
      )
      .join("");
    return `
      <label>${SLOT_LABEL[slot]}
        <select data-master-equip-slot="${slot}">
          <option value="">（空）</option>
          ${opts}
        </select>
      </label>`;
  }).join("");

  const invList =
    inv
      .map((x) => {
        const wornNote = x.worn ? `（已裝·${SLOT_LABEL[x.worn.slot] || ""}）` : "";
        const forgeNote = x.forgeAtk || x.forgeHp ? ` 鍛+${x.forgeAtk}/${x.forgeHp}` : "";
        return `<li><strong>${escapeHtml(x.name)}</strong> · ${SLOT_LABEL[x.slot] || x.slot} · 攻${x.atk} 血${x.hp} 速${x.spd}${forgeNote}${wornNote}</li>`;
      })
      .join("") || `<li class="empty">尚無裝備。秘境勝利或靈紋鍛造可取得。</li>`;

  const ranchN = state.ranch?.length || 0;
  return `
    <h2>契壇修行</h2>
    <p class="lead">人物 ${escapeHtml(m.name)} 戰力主要靠裝備。白板 攻${m.atk}/血${m.hp}/速${m.spd} → 裝備後 <strong>攻${totalAtk} 血${totalHp} 速${totalSpd}</strong></p>
    <div class="bar"><i data-live="qi-bar" style="width:${qiPct}%"></i></div>
    <p class="meta" data-live="qi-text">靈契 ${Math.floor(state.qi)}${next ? ` / ${next.need}` : "（已滿）"}</p>
    <p class="meta">牧場待命 ${ranchN} 隻慢產飼料／靈塵 · 飼料 ${Math.floor(state.feed || 0)}／靈塵 ${Math.floor(state.dust || 0)}</p>
    <div class="row">
      <button type="button" class="primary" data-act="break">突破階段</button>
      <button type="button" data-act="forge">靈紋鍛造</button>
    </div>
    <h3>人物技能</h3>
    <ul class="skill-list">${skills || "<li class='empty'>尚未解鎖</li>"}</ul>
    <h3>人物裝備（三槽）</h3>
    <div class="row gear-row">${slotSelects}</div>
    <h3>裝備庫存（${inv.length}）</h3>
    <ul class="skill-list">${invList}</ul>
  `;
}

function petRow(p, extraBtn = "") {
  const uid = escapeHtml(p.uid || p.templateId);
  const lv = p.level ?? 1;
  const fus = p.fusionLevel ?? 0;
  const title = displayPetName(p);
  const r = rarityInfo(p.rarity ?? 0);
  const g = petGeneration(p);
  return `
    <li class="card-row">
      <div>
        <button type="button" class="linkish" data-pet-detail="${uid}"><strong>${escapeHtml(title)}</strong></button>
        <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${escapeHtml(genLabel(g))} · Lv.${lv}${fus ? ` · 融${fus}` : ""} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)}·${escapeHtml(p.personalityName)}</span>
        <span class="muted">攻${p.atk} 血${p.hp} 速${p.spd} · 【${escapeHtml(p.skillName || SKILLS[p.skillId]?.name || "—")}】</span>
      </div>
      <div class="row-actions">
        <button type="button" data-pet-detail="${uid}">詳情</button>
        ${extraBtn}
      </div>
    </li>`;
}

function petsListView() {
  const cap = ranchCap(state);
  const ranch = state.ranch || [];

  const roster =
    state.pets
      .map((p) =>
        petRow(
          p,
          `<button type="button" data-undeploy="${escapeHtml(p.uid)}">撤回</button>`
        )
      )
      .join("") ||
    `<li class="empty">出戰欄空。從牧場派出靈寵（最多 ${ACTIVE_PET_MAX}）。</li>`;

  const ranchList =
    ranch
      .map((p) =>
        petRow(
          p,
          `<button type="button" class="primary" data-deploy="${escapeHtml(p.uid)}">出戰</button>`
        )
      )
      .join("") ||
    `<li class="empty">牧場空。契約成功的靈寵會進入牧場（容量 ${cap}）。</li>`;

  const pending = (state.pending || [])
    .map(
      (c) => `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${escapeHtml(c.kind)}·${escapeHtml(c.elementName)}·${escapeHtml(c.personalityName)} · 攻${c.atk} 血${c.hp} 速${c.spd}</span>
          <span class="muted">技能【${escapeHtml(c.skillName)}】· 成功率 ${Math.round(c.bondRate * 100)}%${Math.round(Math.min(0.95, c.bondRate + BOND_FEED_BONUS) * 100) !== Math.round(c.bondRate * 100) ? `（飼料→${Math.round(Math.min(0.95, c.bondRate + BOND_FEED_BONUS) * 100)}%）` : ""} · ${c.cost} 靈石</span>
        </div>
        <div class="row-actions">
          <button type="button" class="primary" data-try-bond="${escapeHtml(c.encounterId)}">契約</button>
          <button type="button" data-try-bond-feed="${escapeHtml(c.encounterId)}">飼料契約（${BOND_FEED_COST}）</button>
          <button type="button" data-dismiss-pending="${escapeHtml(c.encounterId)}">放過</button>
        </div>
      </li>`
    )
    .join("") ||
    `<li class="empty">尚無待契約靈寵。去秘境打本，隨機遇見後會出現喺呢度（最多 ${PENDING_BOND_MAX} 隻）。</li>`;

  const syn = partySynergy(state.pets);
  const synNote = syn.labels.length ? `羈絆：${syn.labels.join("、")}` : "出戰 2+ 同元素／同種類可觸發羈絆";

  return `
    <h2>靈寵</h2>
    <p class="lead">契約入牧場，再派出戰。牧場 ${ranch.length}/${cap} · 待契約 ${(state.pending || []).length}/${PENDING_BOND_MAX}</p>
    <p class="meta">${escapeHtml(synNote)}</p>
    <h3>出戰（${state.pets.length}/${ACTIVE_PET_MAX}）</h3>
    <ul class="list">${roster}</ul>
    <h3>牧場（${ranch.length}/${cap}）</h3>
    <p class="meta">待命寵按性格／元素慢產飼料與靈塵。</p>
    <ul class="list">${ranchList}</ul>
    <h3>待契約</h3>
    <ul class="list">${pending}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-act="start-breed">繁殖</button>
    </div>
  `;
}

function petsBreedView() {
  const bs = breedStatus(state);
  const ranch = state.ranch || [];
  const selected = new Set(petView.breedParents || []);
  const cdSec = Math.ceil(bs.cooldownLeftMs / 1000);
  const list =
    ranch
      .map((p) => {
        const on = selected.has(p.uid);
        const r = rarityInfo(p.rarity ?? 0);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(displayPetName(p))}</strong>
            <span class="muted"><span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${escapeHtml(genLabel(petGeneration(p)))} · ${escapeHtml(p.kind)}·${escapeHtml(p.elementName)} · Lv.${p.level ?? 1}</span>
          </div>
          <button type="button" class="${on ? "primary" : ""}" data-breed-toggle="${escapeHtml(p.uid)}">${on ? "已選" : "選擇"}</button>
        </li>`;
      })
      .join("") || `<li class="empty">牧場需要至少兩隻靈寵才能繁殖。</li>`;

  const [ua, ub] = petView.breedParents || [];
  const pa = ranch.find((p) => p.uid === ua);
  const pb = ranch.find((p) => p.uid === ub);
  const hint = pa && pb ? breedPairHint(pa, pb) : null;

  const ready = selected.size === 2 && bs.ready && ranch.length < ranchCap(state);
  return `
    <h2>繁殖 · 突變合配</h2>
    <p class="lead">6 種族＝6 種類（熒鰭＝光）。主／次配方雜交；原生／1–3 代影響升代機率同能力。耗 ${BREED_STONE_COST} 靈石${bs.ready ? "" : ` · 冷卻 ${cdSec}s`}。</p>
    ${hint ? `<p class="meta breed-hint">${escapeHtml(hint.note)}</p>` : ""}
    <ul class="list">${list}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" class="primary" data-breed-confirm ${ready ? "" : "disabled"}>確認繁殖（${selected.size}/2）</button>
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsDetailView() {
  const detail = petDetail(state, petView.uid);
  if (!detail) {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
    return petsListView();
  }
  const {
    pet,
    deployed,
    upgradeCost,
    upgradeFeedCost: feedCost,
    fuseCostHint,
    skill,
    fuseMaxed,
    fuseNeedLevel,
    fuseTotalPets,
    fuseMatNeed,
    nextFusionStage,
    skillLevel,
    skillDustCost: dustCost,
    skillMaxed,
    secondSkill,
    secondUnlocked,
    baseline,
    innateBonus,
  } = detail;
  const lv = pet.level ?? 1;
  const fus = pet.fusionLevel ?? 0;
  const r = rarityInfo(pet.rarity ?? 0);
  const g = petGeneration(pet);
  const loc = deployed ? "出戰中" : "牧場待命";
  const fuseHint = fuseMaxed
    ? `已達融階上限（${FUSION_MAX_STAGE}）`
    : `下一融階 ${nextFusionStage}：主體≥Lv.${fuseNeedLevel}、共 ${fuseTotalPets} 隻（${fuseMatNeed} 素材）· ${fuseCostHint} 石`;

  const secondLine = secondUnlocked
    ? `【${escapeHtml(secondSkill?.name || "—")}】${secondSkill ? ` ${escapeHtml(secondSkill.desc)}（CD${secondSkill.cd}）` : ""}`
    : `未解鎖（融階≥1 或 Lv≥15）`;

  return `
    <h2>${escapeHtml(displayPetName(pet))}</h2>
    <p class="lead">${escapeHtml(loc)} · <span class="rarity rarity-${r.color}">${escapeHtml(r.name)}</span> · ${escapeHtml(genLabel(g))} · Lv.${lv} · 融階 ${fus}/${FUSION_MAX_STAGE} · 技能 Lv.${skillLevel}</p>
    <ul class="skill-list">
      <li><strong>種類</strong> — ${escapeHtml(pet.kind)} · ${escapeHtml(pet.speciesName)}${pet.breedOnly ? "（繁殖專屬）" : ""}</li>
      <li><strong>元素</strong> — ${escapeHtml(pet.elementName)}</li>
      <li><strong>性格</strong> — ${escapeHtml(pet.personalityName)}</li>
      <li><strong>天生數值</strong> — 攻${pet.atk} 血${pet.hp} 速${pet.spd}（基準 ${baseline.atk}/${baseline.hp}/${baseline.spd}，成長 +${innateBonus.atk}/${innateBonus.hp}/${innateBonus.spd}）</li>
      <li><strong>主技能</strong> — 【${escapeHtml(pet.skillName || skill?.name || "—")}】${skill ? ` ${escapeHtml(skill.desc)}（CD${skill.cd}）` : ""}</li>
      <li><strong>第二技能</strong> — ${secondLine}</li>
      <li><strong>養成</strong> — 不穿裝備；融合吸收素材天生、繁殖遺傳溢出基礎</li>
      <li><strong>升級</strong> — 靈石或飼料；技能用靈塵</li>
      <li><strong>融合</strong> — ${escapeHtml(fuseHint)}</li>
    </ul>
    <div class="row gear-row">
      <label>暱稱（最多 ${NICK_MAX_LEN} 字）
        <input type="text" maxlength="${NICK_MAX_LEN}" data-nick-input value="${escapeHtml(pet.nick || "")}" placeholder="${escapeHtml(pet.name)}" />
      </label>
      <button type="button" data-rename="${escapeHtml(pet.uid)}">命名</button>
    </div>
    <div class="row">
      <button type="button" class="primary" data-upgrade="${escapeHtml(pet.uid)}">升級（${upgradeCost} 石）</button>
      <button type="button" data-upgrade-feed="${escapeHtml(pet.uid)}">飼料升級（${feedCost}）</button>
    </div>
    <div class="row" style="margin-top:0.5rem">
      <button type="button" data-upgrade-skill="${escapeHtml(pet.uid)}" ${skillMaxed ? "disabled" : ""}>${skillMaxed ? "技能已滿" : `技能升級（${dustCost} 靈塵）`}</button>
      ${
        deployed
          ? `<button type="button" data-undeploy="${escapeHtml(pet.uid)}">撤回牧場</button>`
          : `<button type="button" data-deploy="${escapeHtml(pet.uid)}">派出戰</button>`
      }
    </div>
    <div class="row" style="margin-top:0.5rem">
      <button type="button" data-start-fuse="${escapeHtml(pet.uid)}" ${fuseMaxed ? "disabled" : ""}>融合</button>
      <button type="button" data-release="${escapeHtml(pet.uid)}">放歸（返還資源）</button>
    </div>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsFuseView() {
  const baseDetail = petDetail(state, petView.fuseBase);
  if (!baseDetail || baseDetail.fuseMaxed) {
    petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [] };
    return petsListView();
  }
  const base = baseDetail.pet;
  const target = baseDetail.nextFusionStage;
  const needMats = baseDetail.fuseMatNeed;
  const needLv = baseDetail.fuseNeedLevel;
  const cost = baseDetail.fuseCostHint;
  const selected = new Set(petView.fuseMats || []);
  const baseLv = base.level ?? 1;
  const lvOk = baseLv >= needLv;

  const owned = [...state.pets, ...(state.ranch || [])].filter(
    (p) => p.uid !== base.uid && p.speciesId === base.speciesId
  );

  const mats =
    owned
      .map((p) => {
        const on = selected.has(p.uid);
        return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(p.name)}</strong>
            <span class="muted">素材（等級不計）· 融${p.fusionLevel ?? 0} · 攻${p.atk} 血${p.hp} 速${p.spd}</span>
          </div>
          <button type="button" class="${on ? "primary" : ""}" data-fuse-toggle="${escapeHtml(p.uid)}">${on ? "已選" : "選擇"}</button>
        </li>`;
      })
      .join("") ||
    `<li class="empty">沒有同種族（${escapeHtml(base.speciesName)}）可作素材。</li>`;

  const ready = lvOk && selected.size === needMats;
  return `
    <h2>融合 · 融階 ${target}</h2>
    <p class="lead">主體 ${escapeHtml(base.name)} Lv.${baseLv}${lvOk ? "" : `（需 ≥${needLv}）`} · 已選素材 ${selected.size}/${needMats} · 耗 ${cost} 靈石 · 結果繼承主體等級</p>
    <ul class="list">${mats}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" class="primary" data-fuse-confirm ${ready ? "" : "disabled"}>確認融合</button>
      <button type="button" data-pet-detail="${escapeHtml(base.uid)}">返回詳情</button>
      <button type="button" data-pet-back>返回列表</button>
    </div>
  `;
}

function petsPanel() {
  if (petView.mode === "detail") return petsDetailView();
  if (petView.mode === "fuse") return petsFuseView();
  if (petView.mode === "breed") return petsBreedView();
  return petsListView();
}

function codexPanel() {
  const dex = bestiaryStatus(state);
  const known = state.bestiary || {};
  const cells = bestiaryEntries()
    .map((e) => {
      const on = !!known[e.key];
      return `<li class="codex-cell ${on ? "on" : ""}" title="${escapeHtml(e.label)}">${
        on ? escapeHtml(e.label) : "？？"
      }</li>`;
    })
    .join("");

  const dailies = dailyView(state)
    .map((q) => {
      const status = q.claimed ? "已領" : q.done ? "可領" : `${q.progress}/${q.need}`;
      return `
        <li class="card-row">
          <div>
            <strong>${escapeHtml(q.name)}</strong>
            <span class="muted">${escapeHtml(q.desc)} · ${status}</span>
          </div>
          <button type="button" class="primary" data-claim-daily="${q.id}" ${q.done && !q.claimed ? "" : "disabled"}>領獎</button>
        </li>`;
    })
    .join("");

  const ach = achievementsView(state)
    .map(
      (a) => `
      <li class="card-row">
        <div>
          <strong>${a.done ? "✓ " : ""}${escapeHtml(a.name)}</strong>
          <span class="muted">${escapeHtml(a.desc)}</span>
        </div>
        <span class="muted">${a.done ? "已達成" : "未完成"}</span>
      </li>`
    )
    .join("");

  return `
    <h2>靈寵圖鑑</h2>
    <p class="lead">種族×元素共 ${dex.total} 格（含繁殖專屬種）· 已錄 ${dex.discovered}${dex.label ? ` · ${escapeHtml(dex.label)}` : " · 每 5 格全隊攻／血 +2%"}</p>
    <ul class="codex-grid">${cells}</ul>
    <h3>每日任務</h3>
    <ul class="list">${dailies}</ul>
    <h3>成就</h3>
    <ul class="list">${ach}</ul>
    <div class="row" style="margin-top:0.85rem">
      <button type="button" data-act="notify-perm">開啟離線通知（可選）</button>
    </div>
  `;
}

function dungeonPanel() {
  if (playback) {
    const pct = Math.min(
      100,
      Math.round((playback.index / Math.max(1, playback.lines.length)) * 100)
    );
    const lines = playback.shown
      .slice()
      .reverse()
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join("");
    return `
      <h2>戰報</h2>
      <p class="lead" data-live="combat-meta">${
        playback.done
          ? `${escapeHtml(playback.result.msg)}（${playback.result.rounds} 回合）`
          : `戰鬥進行中… ${playback.index}/${playback.lines.length}`
      }</p>
      <div class="bar combat-bar"><i data-live="combat-bar" style="width:${pct}%"></i></div>
      <ul class="combat" data-live="combat-log">${lines}</ul>
      <div class="row">
        <button type="button" data-act="skip-combat" ${playback.done ? "hidden" : ""}>跳過動畫</button>
        <button type="button" data-act="clear-combat" ${playback.done ? "" : "disabled"}>返回秘境</button>
      </div>
    `;
  }

  const list = DUNGEONS.map((d) => {
    const locked = state.realm < d.needRealm;
    const st = dungeonStatus(state, d.id);
    const cdSec = st ? Math.ceil(st.cooldownLeftMs / 1000) : 0;
    const onCd = cdSec > 0;
    const clearNote = st?.cleared ? "已通" : `首通+${d.firstClearBonus?.stones || 0}石`;
    return `
      <li class="card-row">
        <div>
          <strong>${escapeHtml(d.name)}</strong>
          <span class="muted">${d.enemies.length} 敵 · 獎 ${d.reward.stones} 石 / ${d.reward.scrap} 碎片 · ${clearNote}${locked ? " · 階段不足" : ""}${onCd ? ` · 冷卻 ${cdSec}s` : ""}</span>
        </div>
        <button type="button" class="primary" data-dungeon="${d.id}" ${locked || onCd ? "disabled" : ""}>進攻</button>
      </li>`;
  }).join("");

  return `
    <h2>潮汐秘境</h2>
    <p class="lead">元素克制：潮克焰→嵐→岩→幽→潮。人物靠裝備掉落；靈寵靠天生／融合／繁殖。同元素／同種出戰觸發羈絆。</p>
    <ul class="list">${list}</ul>
  `;
}

function logPanel() {
  const lines = state.log.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
  return `<h2>見聞錄</h2><ul class="log">${lines}</ul>`;
}

function bind() {
  app.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      switchTab(btn.dataset.tab);
    });
  });
  app.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const act = btn.dataset.act;
      if (act === "break") {
        const r = tryBreakthrough(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "forge") {
        const r = forgeHint(state);
        saveState(state);
        render();
        setFlash(r.msg);
      } else if (act === "start-breed") {
        petView = { mode: "breed", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
        render();
      } else if (act === "clear-offline") {
        clearOfflineHint(state);
        saveState(state);
        render();
      } else if (act === "notify-perm") {
        if (typeof Notification === "undefined") {
          setFlash("此環境不支援通知。");
          return;
        }
        Notification.requestPermission().then((p) => {
          setFlash(p === "granted" ? "已開啟離線通知" : "未授權通知");
          if (p === "granted" && state.offlineHint) maybeNotifyOffline(state.offlineHint);
        });
      } else if (act === "reset") {
        if (confirm("確定清除存檔？")) {
          stopPlayback();
          state = resetSave();
          petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
          shellReady = false;
          render();
          setFlash("存檔已重置。");
        }
      } else if (act === "clear-combat") {
        stopPlayback();
        render();
      } else if (act === "skip-combat") {
        skipPlayback();
      }
    });
  });
  app.querySelectorAll("[data-breed-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.breedToggle;
      const set = new Set(petView.breedParents || []);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= 2) {
          setFlash("最多選兩隻雙親。");
          return;
        }
        set.add(uid);
      }
      petView = { ...petView, breedParents: [...set] };
      render();
    });
  });
  app.querySelectorAll("[data-breed-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const [a, b] = petView.breedParents || [];
      const r = tryBreed(state, a, b);
      saveState(state);
      if (r.ok) {
        petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      }
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-try-bond]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = tryBondPending(state, btn.dataset.tryBond, false);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-try-bond-feed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = tryBondPending(state, btn.dataset.tryBondFeed, true);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-master-equip-slot]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const slot = sel.dataset.masterEquipSlot;
      const uid = sel.value;
      let r;
      if (!uid) r = unequipMaster(state, slot);
      else r = equipMaster(state, uid, slot);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade-feed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = upgradePet(state, btn.dataset.upgradeFeed, "feed");
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = upgradePetSkill(state, btn.dataset.upgradeSkill);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-dismiss-pending]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = dismissPending(state, btn.dataset.dismissPending);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-release]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("確定放歸？將返還部分靈石／飼料／靈塵。")) return;
      const r = releasePet(state, btn.dataset.release);
      saveState(state);
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-rename]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = app.querySelector("[data-nick-input]");
      const r = renamePet(state, btn.dataset.rename, input?.value || "");
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-claim-daily]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const r = claimDaily(state, btn.dataset.claimDaily);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-deploy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = deployPet(state, btn.dataset.deploy);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-undeploy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = undeployPet(state, btn.dataset.undeploy);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-upgrade]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = upgradePet(state, btn.dataset.upgrade);
      saveState(state);
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "detail", uid: btn.dataset.petDetail, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
    });
  });
  app.querySelectorAll("[data-start-fuse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = {
        mode: "fuse",
        uid: null,
        fuseBase: btn.dataset.startFuse,
        fuseMats: [],
        breedParents: [],
      };
      render();
    });
  });
  app.querySelectorAll("[data-fuse-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.fuseToggle;
      const detail = petDetail(state, petView.fuseBase);
      const need = detail?.fuseMatNeed ?? 0;
      const set = new Set(petView.fuseMats || []);
      if (set.has(uid)) set.delete(uid);
      else {
        if (set.size >= need) {
          setFlash(`最多選 ${need} 隻素材。`);
          return;
        }
        set.add(uid);
      }
      petView = { ...petView, fuseMats: [...set] };
      render();
    });
  });
  app.querySelectorAll("[data-fuse-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const baseUid = petView.fuseBase;
      const mats = petView.fuseMats || [];
      const d = petDetail(state, baseUid);
      if (!d || d.fuseMaxed) {
        setFlash("無法融合。");
        return;
      }
      if (
        !confirm(
          `將 ${mats.length} 隻素材融入 ${d.pet.name}？\n目標融階 ${d.nextFusionStage}｜繼承 Lv.${d.level}｜耗 ${d.fuseCostHint} 靈石`
        )
      ) {
        return;
      }
      const r = fusePets(state, baseUid, mats);
      saveState(state);
      if (r.ok) {
        petView = { mode: "detail", uid: baseUid, fuseBase: null, fuseMats: [], breedParents: [] };
      }
      render();
      setFlash(r.msg);
    });
  });
  app.querySelectorAll("[data-pet-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      petView = { mode: "list", uid: null, fuseBase: null, fuseMats: [], breedParents: [] };
      render();
    });
  });
  app.querySelectorAll("[data-dungeon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (playback && !playback.done) return;
      const r = runDungeon(state, btn.dataset.dungeon);
      saveState(state);
      if (!r.ok) {
        setFlash(r.msg);
        return;
      }
      startPlayback(r);
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

render();
maybeNotifyOffline(state.offlineHint);
setInterval(() => {
  patchLive();
  saveState(state);
}, 1000);

function maybeNotifyOffline(hint) {
  if (!hint || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (maybeNotifyOffline._sent === hint.at) return;
  maybeNotifyOffline._sent = hint.at;
  try {
    new Notification("暗潮 · 離線結算", {
      body: `約 ${Math.round(hint.sec / 60)} 分鐘：靈契 +${Math.floor(hint.qi)}，飼料 +${hint.feed.toFixed(1)}，靈塵 +${hint.dust.toFixed(1)}`,
      icon: "./icons/icon.svg",
    });
  } catch {
    /* ignore */
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
