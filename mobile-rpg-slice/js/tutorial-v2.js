/**
 * 教學 v2（預留）— read → nav_tab → nav_sub → act 狀態機
 * TUTORIAL_V2_ENABLED 關閉時唔運行；待核心體驗穩定後再接回
 */
import { TUTORIAL_ENABLED } from "./tutorial.js";

export const TUTORIAL_V2_ENABLED = false;

/** @typedef {"read" | "nav_tab" | "nav_sub" | "act"} GuidePhase */

export const GUIDE_STEPS = [
  {
    id: "hatch_claim",
    title: "孵化首寵",
    hint: "打開「靈寵 → 牧場」，領取孵化完成的靈寵。",
    tab: "party",
    panelSub: { party: "ranch" },
    act: "claim-hatch",
    autoNavigate: true,
  },
];

/**
 * @param {object} state
 * @returns {boolean}
 */
export function tutorialV2Active(state) {
  if (!TUTORIAL_V2_ENABLED || !TUTORIAL_ENABLED) return false;
  return !!(state.tutorialV2 && !state.tutorialV2.done);
}

/**
 * @param {object} state
 * @returns {{ phase: GuidePhase, step: object | null, target: object | null }}
 */
export function tutorialV2Guide(state) {
  if (!tutorialV2Active(state)) {
    return { phase: "read", step: null, target: null };
  }
  const cur = GUIDE_STEPS.find((s) => s.id === state.tutorialV2?.stepId) || GUIDE_STEPS[0];
  const phase = state.tutorialV2?.phase || "read";
  return { phase, step: cur, target: resolveV2Target(cur, phase) };
}

function resolveV2Target(step, phase) {
  if (!step) return null;
  switch (phase) {
    case "read":
      return { type: "tutorial-hint" };
    case "nav_tab":
      return { type: "tab", id: step.tab };
    case "nav_sub": {
      const ps = step.panelSub || {};
      const [group, id] = Object.entries(ps)[0] || [];
      return group ? { type: "panel-sub", group, id } : null;
    }
    case "act":
      return { type: step.act };
    default:
      return null;
  }
}

/** 完成當前 phase，推進狀態機 */
export function advanceTutorialV2Phase(state) {
  if (!tutorialV2Active(state)) return { advanced: false };
  const order = ["read", "nav_tab", "nav_sub", "act"];
  const phase = state.tutorialV2.phase || "read";
  const i = order.indexOf(phase);
  if (i < order.length - 1) {
    state.tutorialV2.phase = order[i + 1];
    return { advanced: true, phase: state.tutorialV2.phase };
  }
  state.tutorialV2.done = true;
  return { advanced: true, done: true };
}
