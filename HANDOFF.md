# 暗潮 · Void Tide — Agent Handoff

## Why another agent cannot load this

This Cloud Agent run was started **without a linked GitHub repository** (`repoUrl: null`).
All work lives only in the VM at `/agent` (local git branch `cursor/mobile-rpg-void-tide-49a4`).
Other agents cannot see those files until the project is on a **private GitHub repo** and a new agent is started **from that repo**.

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Save key / SW cache: `void-tide-pets-v18`
- Branch (latest): `cursor/train-sites-breed-depth-49a4`

**Breed (dino-style):** hybrid species from cross-kind mates + rarity tiers (普通→傳說); fusion stays same-species stages. Bestiary grows with hybrids (incl. 甲蟎 shellmite). Species↔kind 1:1; generations 0–3; dual personality on breed.
- Run: `cd mobile-rpg-slice && python3 -m http.server 8765`
- Smoke: `cd mobile-rpg-slice && node js/smoke-test.mjs`

## Features in tree

Idle → dungeon → bond → ranch → fuse/breed → element → P1 idle/gear/skills/synergy.

**P2:** bestiary (species×element) combat bonus · rename · release refund · daily quests · achievements · offline settlement banner.

**P3:** breed goals (daily/once + claim) · recipe matrix on breed page · hybrid/gen celebrate flash · dungeon hybrid/gen trials.

**P4:** dungeon waves (trash→elite→boss) · foe skills / boss double-act · stage conditions + passives · elite/boss clear & drop bonuses.

**P5:** condition met/miss UI + separate reward accounting · combat log scroll box · breakthrough multi-gate checklist (qi/costs/clears/bonds/gear/…).

**P6:** tide_4 deep floor · daily dungeon mod · ranch shop (3 daily offers) · hybrid exclusive skills · gen combat mult · auto tactics (balanced/focus_boss/sustain).

**P7:** infinite stage formula post-潮主 (潮主·N重) · formula breakthrough gates · dungeon tier scaling (tide_5+) · per-layer daily boss/condition/passive variants (seeded).

**P8:** expanded achievements + 5 daily quests · weekly breed/dungeon goals · daily dungeon challenge rules · party formations (vanguard/balanced/rear) · hybrid recipes 獸×蟲→牙蟎、鱗×禽→鱗羽.

**P9:** pet depth (kinship/species/gen bonds + personality combat passives) · ranch dispatch missions · master gear sets (潮紋／暗礁／深淵) · soft prestige 潮印 (reset stage, keep pets/gear/dex).

**P10:** ranch idle drip **off** (ranch = dispatch only, 5 missions) · master **train sites** (潮岸→廢墟→深層→心核→暗潮心壇, unlock by dungeon first clear) · materials (潮露／珊瑚屑／霧絲／深淵墨／契火) gate upgrade/breed · hybrid 甲×蟲→甲蟎 · **second personality** on pets for breed diversity · combat passives blend primary/secondary.

**Balance:** Master from gear; pets from innate (fuse/breed). Materials from train sites + dispatch. UI polish / combat animation deferred. Skip: pet ornaments, stamina/energy.

## Publish checklist (owner)

1. Create a **private** GitHub repo (suggested: `void-tide` or `an-chao-pets`). Prefer empty (no README) if pushing this history.
2. Add `GITHUB_TOKEN` (repo create + push) as an environment secret, **or** push from your machine after downloading the tree.
3. Push branch `cursor/mobile-rpg-void-tide-49a4` (or `main` after merge).
4. Start the **next** Cloud Agent **attached to that private repo**.

## Prompt for the next agent

Continue 暗潮 PWA in `mobile-rpg-slice/`: idle, dungeon with streamed combat, element matchups, pending bonds, ranch dispatch, train sites + materials, upgrade/fuse/breed (dual personality). Save `void-tide-pets-v18`. Previously developed on a no-remote cloud VM; now on this private GitHub repo. Next: [your goal here].
