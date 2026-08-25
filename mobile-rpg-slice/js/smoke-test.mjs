/**
 * Smoke test: pet kinds, skills, combat.
 * Run: node js/smoke-test.mjs
 */
import {
  WILD_PETS,
  DUNGEONS,
  buildPetStats,
  KIND_SKILLS,
  SKILLS,
  masterSkillsForStage,
  SPECIES,
} from "./data.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const kinds = new Set(Object.values(SPECIES).map((s) => s.kind));
for (const k of ["獸", "鱗", "禽", "甲", "蟲"]) assert(kinds.has(k), `missing kind ${k}`);
assert(kinds.size === 5, "exactly 5 kinds");
assert(KIND_SKILLS["獸"] === "pounce", "beast skill");
assert(SKILLS.seal_strike && SKILLS.pounce, "skills table");
assert(masterSkillsForStage(0).includes("seal_strike"), "master unlock 0");
assert(masterSkillsForStage(3).includes("tide_banner"), "master unlock 3");

const pets = WILD_PETS.slice(0, 3).map(buildPetStats);
assert(pets.every((p) => p.skillId && SKILLS[p.skillId]), "pet skills");

console.log("kinds:", [...kinds].join("／"));
console.log(
  "pets:",
  pets.map((p) => `${p.name}[${p.kind}:${p.skillName}]`).join(", ")
);
console.log("smoke-test ok");
