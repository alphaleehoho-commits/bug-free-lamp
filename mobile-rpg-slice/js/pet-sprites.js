/** Water Idle pet sprites — race id → asset URL (Idle + 水 only). */

export const PET_SPRITE_DIR = "./assets/pets";
export const WATER_IDLE_ELEMENT = "水";
export const WATER_IDLE_ACTION = "Idle";
export const WATER_IDLE_RACE_MIN = 1;
export const WATER_IDLE_RACE_MAX = 48;

/** Game element ids that mean 水. */
export const WATER_ELEMENT_IDS = new Set(["tide", "水", "water"]);

/**
 * Race id 1–48 → live SPECIES id.
 * 1–14 wild/base, 15–40 breed-only, 41–48 tertiary (definition order within each group).
 */
export const RACE_SPECIES_IDS = [
  "reefox",
  "tidecarp",
  "ashwing",
  "mossback",
  "nightmoth",
  "glowfin",
  "saltpup",
  "brineeel",
  "cliffkite",
  "barnshell",
  "siltmite",
  "lanternray",
  "duskox",
  "foamdrake",
  "tideling",
  "duskfly",
  "ironback",
  "mistcarp",
  "stormmoth",
  "reefwing",
  "fangmite",
  "scalequill",
  "shellmite",
  "glintfox",
  "prismback",
  "tidehowl",
  "coralmane",
  "mistwing",
  "stormshell",
  "gloomfang",
  "lightscale",
  "ashspine",
  "deepquill",
  "reefmite",
  "voidcarp",
  "brightback",
  "galebeast",
  "stonefinch",
  "inkfox",
  "prismoth",
  "abyssreign",
  "voidglint",
  "duskiron",
  "coralstorm",
  "deepfang",
  "tideprism",
  "nightscale",
  "galevoid",
];

export const SPECIES_RACE_IDS = Object.fromEntries(RACE_SPECIES_IDS.map((id, i) => [id, i + 1]));

export function raceIdForSpecies(speciesId) {
  return SPECIES_RACE_IDS[speciesId] || 0;
}

export function waterIdleFileName(raceId) {
  const n = raceId | 0;
  if (n < WATER_IDLE_RACE_MIN || n > WATER_IDLE_RACE_MAX) return null;
  return `${String(n).padStart(2, "0")}_水_Idle.png`;
}

export function waterIdleSpriteUrl(raceId, cacheBust) {
  const file = waterIdleFileName(raceId);
  if (!file) return null;
  const path = `${PET_SPRITE_DIR}/${encodeURIComponent(file)}`;
  return cacheBust ? `${path}?v=${encodeURIComponent(String(cacheBust))}` : path;
}

/**
 * Resolve an idle portrait URL by race id.
 * Only Idle+水 files exist — other elements/actions are not invented.
 * When the requested action is Idle (or omitted), missing element packs fall back to water Idle
 * so ranch / codex / detail can show art now.
 *
 * @param {{ raceId?: number, speciesId?: string, elementId?: string, action?: string, cacheBust?: string }} [opts]
 * @returns {string|null}
 */
export function resolvePetIdleSprite(opts = {}) {
  const action = opts.action || WATER_IDLE_ACTION;
  if (action !== WATER_IDLE_ACTION && String(action).toLowerCase() !== "idle") return null;
  const rid = (opts.raceId | 0) || raceIdForSpecies(opts.speciesId);
  return waterIdleSpriteUrl(rid, opts.cacheBust);
}
