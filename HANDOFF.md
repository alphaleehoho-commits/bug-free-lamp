# 暗潮 · Void Tide — Agent Handoff

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Save key / SW cache: `void-tide-pets-v24`
- Repo: private GitHub `bug-free-lamp` (branch `main` + feature branches)

**Breed (dino-style):** hybrid species from cross-kind mates + rarity tiers (普通→傳說); fusion stays same-species stages. Bestiary grows with hybrids (incl. 耀狐 glintfox、稜背 prismback). Species↔kind 1:1; generations 0–3; dual personality on breed.
- Run: `cd mobile-rpg-slice && python3 -m http.server 8765`
- Smoke: `cd mobile-rpg-slice && node js/smoke-test.mjs`
- Pages: `https://alphaleehoho-commits.github.io/bug-free-lamp/`

## Features in tree

Idle → dungeon → bond → ranch → fuse/breed → element → P1 idle/gear/skills/synergy.

**P2–P14:** (see prior handoffs) bestiary · waves · train sites · tutorial skip · combat polish · etc.

**P15A:** breeding preview panel (hybrid %, gen odds, stat range, material cost) · pet lineage UI (parents/children links in detail) · bloodline badge on ranch list.

**P15B:** new hybrids 耀狐（光+獸）、稜背（光+甲）with exclusive skills · gen 2/3 birth awaken bonuses (extra innate; gen3 skill Lv.2 start) · achievements 三代血脈／耀狐初現.

**Balance:** deferred — next pass after P15.

## Prompt for the next agent

Continue 暗潮 PWA in `mobile-rpg-slice/`. Save `void-tide-pets-v24`. Next: **balance pass** (stones/materials/dungeon curve), or more dungeon/hybrid content.
