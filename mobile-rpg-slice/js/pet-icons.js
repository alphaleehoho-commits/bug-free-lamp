/** 靈寵剪影 icon — 種類形狀變體 + 元素配色 + 稀有框（非手繪肖像） */

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

/** 種類 → 多款 SVG path（viewBox 0 0 32 32），按 speciesId 揀變體 */
const KIND_PATH_VARIANTS = {
  獸: [
    "M8 22 L12 10 L20 8 L24 14 L22 24 L14 26 Z",
    "M7 20 L11 9 L17 7 L25 12 L23 23 L15 27 L9 24 Z",
    "M9 24 L10 14 L16 6 L22 14 L23 24 L16 28 Z",
  ],
  鱗: [
    "M6 16 Q16 6 26 16 Q16 26 6 16 M10 16 Q16 12 22 16",
    "M8 18 Q16 4 24 18 Q16 28 8 18 M12 17 Q16 13 20 17",
    "M7 15 L16 5 L25 15 L22 24 L10 24 Z M11 15 Q16 11 21 15",
  ],
  禽: [
    "M16 6 L26 18 L20 18 L24 28 L12 20 L16 18 L6 18 Z",
    "M15 5 L27 16 L21 17 L23 27 L14 19 L16 17 L5 17 Z",
    "M16 7 L24 14 L22 18 L25 26 L14 21 L16 17 L8 15 Z",
  ],
  甲: [
    "M8 20 L10 12 L22 12 L24 20 Q16 28 8 20 M12 14 L20 14",
    "M9 19 L11 10 L21 10 L23 19 Q16 27 9 19 M12 13 L20 13 M14 16 L18 16",
    "M7 18 L12 9 L20 9 L25 18 Q16 29 7 18 M11 13 L21 13",
  ],
  蟲: [
    "M16 8 L22 14 L20 24 L12 24 L10 14 Z M8 16 L24 16",
    "M16 7 L23 13 L21 22 L16 27 L11 22 L9 13 Z M7 15 L25 15 M9 20 L23 20",
    "M15 6 L24 12 L22 23 L15 28 L8 23 L6 12 Z M10 14 L22 14",
  ],
  光: [
    "M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z",
    "M16 5 L19 13 L27 14 L20 18 L22 26 L16 21 L10 26 L12 18 L5 14 L13 13 Z",
    "M16 7 L17.5 14 L25 15 L18 18 L19 25 L16 20 L13 25 L14 18 L7 15 L14.5 14 Z",
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

function kindPathForSpecies(speciesId, kind) {
  const paths = kindPaths(kind);
  return paths[hashStr(speciesId) % paths.length];
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
  const path = kindPathForSpecies(speciesId, sp.kind);
  const hybridRing = hybrid
    ? `<circle cx="16" cy="16" r="14" fill="none" stroke="${colors.glow}" stroke-width="1.2" opacity="0.55"/>`
    : "";
  const rarityRing =
    (opts.rarity | 0) >= 1
      ? `<circle cx="16" cy="16" r="15.2" fill="none" stroke="${rGlow.stroke}" stroke-width="${
          (opts.rarity | 0) >= 3 ? 1.8 : 1.25
        }" opacity="0.9"/>`
      : "";
  // 物種指紋小點：同種剪影仍可微差
  const accentX = 8 + (hashStr(speciesId + ":x") % 16);
  const accentY = 8 + (hashStr(speciesId + ":y") % 16);
  const accent = `<circle cx="${accentX}" cy="${accentY}" r="1.35" fill="${colors.glow}" opacity="0.55"/>`;
  return `<span class="${cls}" title="${escapeAttr(title)}" aria-hidden="true" style="--icon-size:${size}px;--elem-fill:${colors.fill};--elem-glow:${colors.glow}">
    <svg viewBox="0 0 32 32" width="${size}" height="${size}" role="img" aria-label="${escapeAttr(title)}">
      ${rarityRing}
      ${hybridRing}
      <path d="${path}" fill="${colors.fill}" opacity="0.92"/>
      <path d="${path}" fill="none" stroke="${colors.glow}" stroke-width="1.4" opacity="0.7"/>
      ${accent}
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
