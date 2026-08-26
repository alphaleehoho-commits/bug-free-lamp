# 暗潮 · Void Tide — Agent Handoff

## Why another agent cannot load this

This Cloud Agent run was started **without a linked GitHub repository** (`repoUrl: null`).
All work lives only in the VM at `/agent` (local git branch `cursor/mobile-rpg-void-tide-49a4`).
Other agents cannot see those files until the project is on a **private GitHub repo** and a new agent is started **from that repo**.

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Save key / SW cache: `void-tide-pets-v5`
- Run: `cd mobile-rpg-slice && python3 -m http.server 8765`
- Smoke: `cd mobile-rpg-slice && node js/smoke-test.mjs`

## Features in tree

Idle cultivation → dungeon combat (streamed log) → encounter pets → bond → ranch → deploy/upgrade/fusion/breeding → element matchups → dungeon tables (weights, first-clear, cooldown).

## Publish checklist (owner)

1. Create a **private** GitHub repo (suggested: `void-tide` or `an-chao-pets`). Prefer empty (no README) if pushing this history.
2. Add `GITHUB_TOKEN` (repo create + push) as an environment secret, **or** push from your machine after downloading the tree.
3. Push branch `cursor/mobile-rpg-void-tide-49a4` (or `main` after merge).
4. Start the **next** Cloud Agent **attached to that private repo**.

## Prompt for the next agent

Continue 暗潮 PWA in `mobile-rpg-slice/`: idle, dungeon with streamed combat, element matchups, pending bonds, ranch, upgrade, fusion (2/4/8 + Lv gates), breeding. Save `void-tide-pets-v5`. Previously developed on a no-remote cloud VM; now on this private GitHub repo. Next: [your goal here].
