/** 靈寵剪影 icon — 依種類形狀 + 元素配色 */

import { SPECIES, ELEMENTS } from "./data.js";

const ELEMENT_COLORS = {
  tide: { fill: "#4a9ead", glow: "#7ec8d8" },
  stone: { fill: "#8a7d6a", glow: "#b8a992" },
  flame: { fill: "#c45c3e", glow: "#e08a6a" },
  gale: { fill: "#6a9a8a", glow: "#9ec4b4" },
  gloom: { fill: "#5a5a8a", glow: "#8888b8" },
};

/** 種類 → SVG path（viewBox 0 0 32 32） */
const KIND_PATHS = {
  獸: "M8 22 L12 10 L20 8 L24 14 L22 24 L14 26 Z",
  鱗: "M6 16 Q16 6 26 16 Q16 26 6 16 M10 16 Q16 12 22 16",
  禽: "M16 6 L26 18 L20 18 L24 28 L12 20 L16 18 L6 18 Z",
  甲: "M8 20 L10 12 L22 12 L24 20 Q16 28 8 20 M12 14 L20 14",
  蟲: "M16 8 L22 14 L20 24 L12 24 L10 14 Z M8 16 L24 16",
  光: "M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z",
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

export function speciesElementId(speciesId, fallback = "tide") {
  const sp = SPECIES[speciesId];
  if (!sp) return fallback;
  if (sp.defaultElement) return sp.defaultElement;
  const kindMap = { 獸: "tide", 鱗: "tide", 禽: "gale", 甲: "stone", 蟲: "gloom", 光: "tide" };
  return kindMap[sp.kind] || fallback;
}

function kindPath(kind) {
  return KIND_PATHS[kind] || KIND_PATHS.獸;
}

/**
 * @param {string} speciesId
 * @param {{ elementId?: string, size?: number, className?: string, title?: string }} [opts]
 */
export function petIconHtml(speciesId, opts = {}) {
  const sp = SPECIES[speciesId];
  if (!sp) return `<span class="pet-icon pet-icon-unknown" aria-hidden="true">?</span>`;
  const elementId = opts.elementId || speciesElementId(speciesId);
  const colors = ELEMENT_COLORS[elementId] || ELEMENT_COLORS.tide;
  const size = opts.size || 32;
  const cls = [
    "pet-icon",
    BASE_SPECIES.has(speciesId) ? "is-base" : "",
    sp.breedOnly || FEATURED_HYBRIDS.has(speciesId) ? "is-hybrid" : "",
    opts.className || "",
  ]
    .filter(Boolean)
    .join(" ");
  const title = opts.title || sp.name;
  const path = kindPath(sp.kind);
  const ring = sp.breedOnly || FEATURED_HYBRIDS.has(speciesId)
    ? `<circle cx="16" cy="16" r="14" fill="none" stroke="${colors.glow}" stroke-width="1.2" opacity="0.55"/>`
    : "";
  return `<span class="${cls}" title="${escapeAttr(title)}" aria-hidden="true" style="--icon-size:${size}px">
    <svg viewBox="0 0 32 32" width="${size}" height="${size}" role="img" aria-label="${escapeAttr(title)}">
      ${ring}
      <path d="${path}" fill="${colors.fill}" opacity="0.92"/>
      <path d="${path}" fill="none" stroke="${colors.glow}" stroke-width="1.4" opacity="0.7"/>
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
  return petIconHtml(pet.speciesId, { ...opts, elementId: pet.elementId, title: pet.name || SPECIES[pet.speciesId]?.name });
}
