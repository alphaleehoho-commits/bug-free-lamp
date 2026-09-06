/** 靈寵剪影 icon — 種類生物形（頭／身／耳翼尾）+ 元素配色 + 稀有框（非手繪肖像） */

import { SPECIES, ELEMENTS, rarityInfo } from "./data.js";

const ELEMENT_COLORS = {
  tide: { fill: "#4a9ead", glow: "#7ec8d8", wash: "rgba(74, 158, 173, 0.22)" },
  stone: { fill: "#8a7d6a", glow: "#b8a992", wash: "rgba(138, 125, 106, 0.22)" },
  flame: { fill: "#c45c3e", glow: "#e08a6a", wash: "rgba(196, 92, 62, 0.22)" },
  gale: { fill: "#6a9a8a", glow: "#9ec4b4", wash: "rgba(106, 154, 138, 0.22)" },
  gloom: { fill: "#5a5a8a", glow: "#8888b8", wash: "rgba(90, 90, 138, 0.24)" },
};

const RARITY_GLOW = {
  common: { stroke: "rgba(143, 163, 176, 0.35)", soft: "rgba(143, 163, 176, 0.12)" },
  rare: { stroke: "rgba(109, 179, 217, 0.7)", soft: "rgba(109, 179, 217, 0.28)" },
  epic: { stroke: "rgba(201, 160, 232, 0.75)", soft: "rgba(201, 160, 232, 0.32)" },
  legendary: { stroke: "rgba(232, 184, 109, 0.85)", soft: "rgba(232, 184, 109, 0.38)" },
};

const KIND_SLUG = {
  獸: "beast",
  鱗: "scale",
  禽: "avian",
  甲: "shell",
  蟲: "bug",
  光: "light",
};

/** Pack Y — 生物部位 class（牧場卡小尺寸仍可辨） */
export const CREATURE_PARTS = ["body", "head", "ear", "wing", "tail", "fin", "leg", "shell", "antenna", "beak"];

/**
 * 種類 → 多款生物剪影（viewBox 0 0 32 32）
 * 每款為部位 path：body/head + ear|wing|fin|shell|antenna|beak|tail|leg
 * 按 speciesId 揀變體（非抽象幾何塊）
 */
const KIND_PATH_VARIANTS = {
  /* 獸：狐／獸 — 耳＋頭＋身＋尾＋腿 */
  獸: [
    {
      body: "M7 17 C7 12 12 10 17 11 C22 12 24 15 23 20 C22 25 15 27 10 24 C7 22 7 19 7 17Z",
      head: "M17 11 C17 7 21 5 25 7 C28 9 28 13 25 15 C22 17 18 15 17 11Z",
      ear: "M19 6 L18 1.5 L22 5 M24 5 L27.5 1.5 L26 7",
      tail: "M8 17 C2 13 1 22 6 24 C9 25 10 20 8 17Z",
      leg: "M11 24 L10 29.5 M16 25 L16 30 M20 24 L21.5 29",
    },
    {
      body: "M8 18 C8 13 13 11 18 12 C23 13 25 17 23 21 C21 26 13 27 9 24 C7 22 8 20 8 18Z",
      head: "M16 10 C15 6 19 3.5 23 5 C26 6.5 27 11 24 13 C21 15 17 14 16 10Z",
      ear: "M18 4.5 L17 0.8 L21 4 M23 4 L26.5 0.8 L25 6",
      tail: "M9 19 C3 16 2 24 7 25 C10 26 11 21 9 19Z",
      leg: "M12 24 L11 29.5 M17 25 L17.5 30 M21 23.5 L23 28.5",
    },
    {
      body: "M6 16 C7 11 13 9 18 11 C23 13 25 17 23 21 C21 26 12 27 8 23 C5 20 5 18 6 16Z",
      head: "M17 9 C17 5 22 3 26 6 C28.5 8 28 13 24 14 C20 15 17 13 17 9Z",
      ear: "M20 4 L19.5 0.5 L23 3.5 M24.5 3.5 L28 0.8 L26.5 5.5",
      tail: "M7 18 C1.5 15 2 23 6.5 24 C9 24.5 9.5 20 7 18Z",
      leg: "M10 23 L8.5 29 M15 24.5 L14.5 30 M19.5 23.5 L21 29",
    },
  ],
  /* 鱗：魚 — 身＋頭＋背鰭／尾鰭／胸鰭 */
  鱗: [
    {
      body: "M5 16 C9 8 20 8 24 16 C20 24 9 24 5 16Z",
      head: "M20 12 C23 12 26 14 26 16 C26 18 23 20 20 20 C22 16 22 16 20 12Z",
      fin: "M13 9 L16 3.5 L19 9 M12 18 L7 23 L14 20",
      tail: "M24 16 L30.5 9.5 L28 16 L30.5 22.5Z",
    },
    {
      body: "M4 17 C8 9 19 7 25 15 C26 17 25 19 23 21 C18 26 8 25 4 17Z",
      head: "M21 11 C24 11 27.5 13.5 27.5 16.5 C27.5 19 24.5 21 21 20.5Z",
      fin: "M14 8 L17 2.5 L20 8.5 M11 19 L6 24.5 L13 21",
      tail: "M24.5 15.5 L31 10 L28.5 16.5 L30.5 23Z",
    },
    {
      body: "M6 16 C10 9 21 9 25 16 C21 23 10 23 6 16Z",
      head: "M21 12.5 C24 12.5 26.5 14.5 26.5 16 C26.5 17.5 24 19.5 21 19.5Z",
      fin: "M14 9.5 L15.5 4 L18.5 9.5 M12 17.5 L8 22 L14 19",
      tail: "M25 16 L30 11 L28.2 16 L30 21Z",
    },
  ],
  /* 禽：鳥 — 身＋頭＋喙＋翼＋尾羽 */
  禽: [
    {
      body: "M9 15 C9 10 15 8 20 11 C23 14 21 21 14 22 C9 23 8 18 9 15Z",
      head: "M18 9 C18 5.5 22 4 25 6.5 C27 8.5 25.5 12 22 12.5 C19.5 13 18 11.5 18 9Z",
      beak: "M25 7.5 L31 9.2 L25 11",
      wing: "M11 13 C5 10 4 18 10 19 C12.5 19.5 14 16 11 13Z",
      tail: "M10 18 L3.5 15.5 L4.5 20 L10 20.5Z",
    },
    {
      body: "M10 14 C11 9 17 7 21 11 C24 14 22 21 15 22 C10 23 9 17 10 14Z",
      head: "M19 8 C19 4.5 23.5 3.5 26.5 6 C28 7.5 27 11.5 24 12 C21 12.5 19 10.5 19 8Z",
      beak: "M26.5 6.5 L31.5 8.5 L26.2 10.5",
      wing: "M12 12 C6 8.5 4.5 17 11 18.5 C13.5 19 15 15 12 12Z",
      tail: "M11 19 L4 17 L5.5 21.5 L11 21Z",
    },
    {
      body: "M8 16 C9 11 15 9 20 12 C23 15 21 22 13 23 C8 24 7 19 8 16Z",
      head: "M17 10 C17 6 21.5 4.5 25 7 C26.5 8.5 25.5 12.5 22 13 C19 13.5 17 12 17 10Z",
      beak: "M25 7.2 L30.5 9 L24.8 10.8",
      wing: "M10 14 C4.5 11 4 19.5 10.5 20 C13 20.2 14 16.5 10 14Z",
      tail: "M9 19.5 L2.5 18 L4 22.5 L9.5 21.5Z",
    },
  ],
  /* 甲：龜甲 — 殼＋頭＋腿＋短尾 */
  甲: [
    {
      shell: "M6 16 C6 10 12 7 16 7 C22 7 26 12 26 17 C26 23 20 27 16 27 C10 27 6 22 6 16Z",
      body: "M11 18 C11 15 14 14 16 14 C19 14 21 16 21 18 C21 21 18 23 16 23 C13 23 11 21 11 18Z",
      head: "M15 8 C15 4.5 18 3 20.5 5 C22 6.5 21 9.5 18.5 10 C16.5 10.5 15 9.5 15 8Z",
      leg: "M9 22 L5.5 28 M13 25 L11.5 30.5 M19 25 L20.5 30.5 M23 22 L26.5 28",
      tail: "M8 17.5 L2.5 16 L4.5 19.5Z",
    },
    {
      shell: "M7 15 C7 10 12 6.5 17 7 C23 7.5 26 13 25.5 18 C25 24 19 27.5 14 27 C9 26.5 7 21 7 15Z",
      body: "M12 17 C12 15 14.5 14 17 14 C19.5 14 21.5 15.5 21.5 18 C21.5 20.5 19 22.5 16.5 22.5 C14 22.5 12 20.5 12 17Z",
      head: "M16 7.5 C16 4 19.5 2.5 22 5 C23.5 6.5 22.5 9.5 20 10 C17.5 10.5 16 9 16 7.5Z",
      leg: "M10 21.5 L7 28 M14 24.5 L13 30.5 M19.5 24.5 L21 30.5 M23.5 21 L27 27.5",
      tail: "M8.5 16.5 L3 14.5 L4.5 18.5Z",
    },
    {
      shell: "M5.5 16.5 C6 10.5 12 6.5 17 7 C23 7.5 27 13 26 18.5 C25 24.5 18 28 13 27 C8 26 5 22 5.5 16.5Z",
      body: "M11.5 18 C11.5 15.5 14 14 16.5 14 C19 14 21 15.8 21 18.2 C21 20.8 18.5 22.8 16 22.8 C13.5 22.8 11.5 20.8 11.5 18Z",
      head: "M14.5 8 C14.5 4.2 18 2.8 20.5 5.2 C22 6.8 21.2 10 18.5 10.5 C16.2 11 14.5 9.8 14.5 8Z",
      leg: "M8.5 22 L5 28.5 M12.5 25 L11 30.5 M18.5 25 L20 30.5 M23 22 L26.5 28",
      tail: "M7.5 18 L2 17 L3.8 20.5Z",
    },
  ],
  /* 蟲：蛾 — 頭＋身＋雙翼＋觸角 */
  蟲: [
    {
      body: "M14 11 L18 11 L19.5 25 L12.5 25Z",
      head: "M14 7.5 C14 4.5 18 4.5 18 7.5 C18 10 14 10 14 7.5Z",
      wing: "M14 12 C4 7 3.5 20 13 18.5Z M18 12 C28 7 28.5 20 19 18.5Z",
      antenna: "M15 5 L11.5 1 M17 5 L20.5 1",
      leg: "M13.5 22 L10 27 M16 23 L16 28 M18.5 22 L22 27",
    },
    {
      body: "M13.5 10.5 L18.5 10.5 L20 24.5 L12 24.5Z",
      head: "M13.5 6.5 C13.5 3.5 18.5 3.5 18.5 6.5 C18.5 9.2 13.5 9.2 13.5 6.5Z",
      wing: "M13.5 11.5 C3.5 6 2.5 19.5 12.5 18Z M18.5 11.5 C28.5 6 29.5 19.5 19.5 18Z",
      antenna: "M14.5 4 L10.5 0.5 M17.5 4 L21.5 0.5",
      leg: "M13 21.5 L9.5 27 M16 22.5 L16.2 28.5 M19 21.5 L22.5 27",
    },
    {
      body: "M14.2 12 L17.8 12 L19 26 L13 26Z",
      head: "M14 8 C14 5 18 5 18 8 C18 10.5 14 10.5 14 8Z",
      wing: "M14 13 C5 9 5 21 13.2 19Z M18 13 C27 9 27 21 18.8 19Z",
      antenna: "M15.2 5.5 L12 1.2 M16.8 5.5 L20 1.2",
      leg: "M13.8 23 L11 28 M16 24 L16 29.5 M18.2 23 L21 28",
    },
  ],
  /* 光：熒鰭靈魚 — 身＋頭＋鰭＋尾（帶柔光翼感） */
  光: [
    {
      body: "M7 16 C10 9 20 8 24 15 C25 17 24 19 22 21 C17 26 9 24 7 16Z",
      head: "M20 11 C23 11 26.5 13.5 26.5 16 C26.5 18.5 23.5 20.5 20 20Z",
      fin: "M14 9 L16.5 3 L19 9 M12 18 L7.5 23 L14 20",
      wing: "M11 12 C6 8 5 16 10 17Z M18 11 C24 7 26 15 20 16Z",
      tail: "M24 16 L30.5 10.5 L28 16 L30.5 21.5Z",
    },
    {
      body: "M6 17 C10 9.5 21 8 25 16 C26 18 24.5 20.5 22 22 C16 27 7 25 6 17Z",
      head: "M21 12 C24 12 27 14 27 16.5 C27 19 24 21 21 20.5Z",
      fin: "M15 8.5 L17 2.5 L19.5 8.5 M11.5 19 L6.5 24.5 L13.5 21",
      wing: "M10 13 C4.5 9.5 4 17.5 9.5 18Z M19 12 C25.5 8 27 16 21 17Z",
      tail: "M24.5 16 L31 11 L28.5 16.5 L30.5 22.5Z",
    },
    {
      body: "M8 16 C11 10 20 9 24 15.5 C25 17.5 23.5 20 21 21.5 C16 25.5 9 23.5 8 16Z",
      head: "M20.5 12 C23.5 12 26 14 26 16 C26 18 23.5 20 20.5 19.5Z",
      fin: "M14.5 9.5 L16 4 L18.5 9.5 M12.5 17.5 L8 22 L14 19",
      wing: "M11.5 12.5 C7 9 6.5 16.5 11 17Z M18.5 11.5 C23.5 8 25 15.5 20 16.5Z",
      tail: "M24 16 L29.5 11.5 L27.5 16 L29.5 20.5Z",
    },
  ],
};

const BASE_SPECIES = new Set([
  "reefox",
  "tidecarp",
  "ashwing",
  "mossback",
  "nightmoth",
  "glowfin",
]);

const FEATURED_HYBRIDS = new Set([
  "tideling",
  "stormmoth",
  "fangmite",
  "glintfox",
  "tidehowl",
  "inkfox",
  "galebeast",
  "abyssreign",
  "voidglint",
  "tideprism",
]);

function hashStr(s) {
  let h = 0;
  const str = String(s || "");
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function speciesElementId(speciesId, fallback = "tide") {
  const sp = SPECIES[speciesId];
  if (!sp) return fallback;
  if (sp.defaultElement) return sp.defaultElement;
  const kindMap = { 獸: "tide", 鱗: "tide", 禽: "gale", 甲: "stone", 蟲: "gloom", 光: "tide" };
  return kindMap[sp.kind] || fallback;
}

function kindPaths(kind) {
  return KIND_PATH_VARIANTS[kind] || KIND_PATH_VARIANTS.獸;
}

/** @returns {Record<string, string>} 部位 → path d */
function kindPartsForSpecies(speciesId, kind) {
  const variants = kindPaths(kind);
  return variants[hashStr(speciesId) % variants.length];
}

function isHybridSpecies(sp, speciesId) {
  return !!(sp?.breedOnly || FEATURED_HYBRIDS.has(speciesId));
}

function rarityKey(rarity) {
  return rarityInfo(rarity ?? 0).color || "common";
}

function genMarkLabel(gen) {
  const g = Math.max(0, gen | 0);
  return g <= 0 ? "原" : String(g);
}

/** 部位渲染順序：身／殼在下，頭與附肢在上 */
const PART_DRAW_ORDER = ["shell", "body", "leg", "tail", "fin", "wing", "ear", "antenna", "head", "beak"];

function renderCreaturePaths(parts, colors) {
  const keys = PART_DRAW_ORDER.filter((k) => parts[k]);
  for (const k of Object.keys(parts)) {
    if (!keys.includes(k)) keys.push(k);
  }
  const fills = keys
    .map(
      (part) =>
        `<path class="pet-icon-part pet-icon-part--${part}" d="${parts[part]}" fill="${colors.fill}" opacity="0.94"/>`
    )
    .join("");
  const strokes = keys
    .map(
      (part) =>
        `<path class="pet-icon-part pet-icon-part--${part} pet-icon-part--stroke" d="${parts[part]}" fill="none" stroke="${colors.glow}" stroke-width="1.15" stroke-linejoin="round" opacity="0.72"/>`
    )
    .join("");
  return `${fills}${strokes}`;
}

/**
 * @param {string} speciesId
 * @param {{ elementId?: string, size?: number, className?: string, title?: string, rarity?: number }} [opts]
 */
export function petIconHtml(speciesId, opts = {}) {
  const sp = SPECIES[speciesId];
  if (!sp) return `<span class="pet-icon pet-icon-unknown" aria-hidden="true">?</span>`;
  const elementId = opts.elementId || speciesElementId(speciesId);
  const colors = ELEMENT_COLORS[elementId] || ELEMENT_COLORS.tide;
  const size = opts.size || 32;
  const hybrid = isHybridSpecies(sp, speciesId);
  const rKey = rarityKey(opts.rarity);
  const rGlow = RARITY_GLOW[rKey] || RARITY_GLOW.common;
  const kindSlug = KIND_SLUG[sp.kind] || "beast";
  const cls = [
    "pet-icon",
    "pet-icon--creature",
    `pet-icon--kind-${kindSlug}`,
    `pet-icon--elem-${elementId}`,
    `pet-icon--rarity-${rKey}`,
    BASE_SPECIES.has(speciesId) ? "is-base" : "",
    hybrid ? "is-hybrid" : "",
    opts.className || "",
  ]
    .filter(Boolean)
    .join(" ");
  const title = opts.title || sp.name;
  const parts = kindPartsForSpecies(speciesId, sp.kind);
  const hybridRing = hybrid
    ? `<circle cx="16" cy="16" r="14" fill="none" stroke="${colors.glow}" stroke-width="1.2" opacity="0.55"/>`
    : "";
  const rarityRing =
    (opts.rarity | 0) >= 1
      ? `<circle cx="16" cy="16" r="15.2" fill="none" stroke="${rGlow.stroke}" stroke-width="${
          (opts.rarity | 0) >= 3 ? 1.8 : 1.25
        }" opacity="0.9"/>`
      : "";
  // 眼點：固定在頭區附近，按物種微偏（可讀小臉）
  const eyeX = 21 + (hashStr(speciesId + ":eye") % 4);
  const eyeY = 10 + (hashStr(speciesId + ":ey") % 3);
  const eye = `<circle class="pet-icon-part pet-icon-part--eye" cx="${eyeX}" cy="${eyeY}" r="1.2" fill="${colors.glow}" opacity="0.85"/>`;
  return `<span class="${cls}" title="${escapeAttr(title)}" aria-hidden="true" style="--icon-size:${size}px;--elem-fill:${colors.fill};--elem-glow:${colors.glow}">
    <svg class="pet-icon-svg" viewBox="0 0 32 32" width="${size}" height="${size}" role="img" aria-label="${escapeAttr(title)}">
      ${rarityRing}
      ${hybridRing}
      <g class="pet-icon-creature" data-kind="${kindSlug}">
        ${renderCreaturePaths(parts, colors)}
        ${eye}
      </g>
    </svg>
  </span>`;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** 從寵物物件渲染 icon */
export function petIconFromPet(pet, opts = {}) {
  if (!pet) return "";
  return petIconHtml(pet.speciesId, {
    ...opts,
    elementId: opts.elementId || pet.elementId,
    rarity: opts.rarity ?? pet.rarity ?? 0,
    title: opts.title || pet.name || SPECIES[pet.speciesId]?.name,
  });
}

/**
 * 牧場／揀寵／詳情用視覺框：元素底色 + 稀有光暈 + 代數角標（保留外層 ★／鎖）
 * @param {object} pet
 * @param {{ size?: number, className?: string, showGen?: boolean, title?: string }} [opts]
 */
export function petArtFromPet(pet, opts = {}) {
  if (!pet) return "";
  const sp = SPECIES[pet.speciesId];
  const elementId = opts.elementId || pet.elementId || speciesElementId(pet.speciesId);
  const colors = ELEMENT_COLORS[elementId] || ELEMENT_COLORS.tide;
  const rarity = opts.rarity ?? pet.rarity ?? 0;
  const rKey = rarityKey(rarity);
  const rGlow = RARITY_GLOW[rKey] || RARITY_GLOW.common;
  const gen = Math.max(0, (opts.generation ?? pet.generation ?? 0) | 0);
  const size = opts.size || 32;
  const kindSlug = KIND_SLUG[sp?.kind] || "beast";
  const hybrid = isHybridSpecies(sp, pet.speciesId);
  const showGen = opts.showGen !== false;
  const title = opts.title || pet.name || sp?.name || "";
  const cls = [
    "pet-art",
    `pet-art--elem-${elementId}`,
    `pet-art--rarity-${rKey}`,
    `pet-art--kind-${kindSlug}`,
    `pet-art--gen-${gen}`,
    hybrid ? "is-hybrid" : "",
    BASE_SPECIES.has(pet.speciesId) ? "is-base" : "",
    opts.className || "",
  ]
    .filter(Boolean)
    .join(" ");
  const genHtml = showGen
    ? `<span class="pet-art-gen pet-art-gen--${gen <= 0 ? "0" : gen}" title="${escapeAttr(
        gen <= 0 ? "原生" : `繁殖${gen}代`
      )}">${genMarkLabel(gen)}</span>`
    : "";
  const elemName = ELEMENTS[elementId]?.name || elementId;
  return `<span class="${cls}" title="${escapeAttr(title)}" style="--art-size:${size}px;--elem-fill:${
    colors.fill
  };--elem-glow:${colors.glow};--elem-wash:${colors.wash};--rarity-stroke:${rGlow.stroke};--rarity-soft:${
    rGlow.soft
  }" data-elem="${escapeAttr(elementId)}" data-rarity="${rKey}" data-kind="${kindSlug}">
    ${petIconFromPet(pet, { size, elementId, rarity, title })}
    ${genHtml}
    <span class="pet-art-elem-dot" aria-hidden="true" title="${escapeAttr(elemName)}"></span>
  </span>`;
}

/** 物種圖鑑用（無實體寵物） */
export function petArtHtml(speciesId, opts = {}) {
  const sp = SPECIES[speciesId];
  if (!sp) return `<span class="pet-art pet-art-unknown"><span class="pet-icon pet-icon-unknown">?</span></span>`;
  return petArtFromPet(
    {
      speciesId,
      elementId: opts.elementId || speciesElementId(speciesId),
      rarity: opts.rarity ?? 0,
      generation: opts.generation ?? 0,
      name: opts.title || sp.name,
    },
    opts
  );
}
