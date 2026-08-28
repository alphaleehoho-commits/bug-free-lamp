# 暗潮 · Void Tide — Agent Handoff

## Project

- Path: `mobile-rpg-slice/`
- Stack: vanilla HTML/CSS/JS PWA (portrait mobile)
- Save key / SW cache: `void-tide-pets-v20`
- Repo: private GitHub `bug-free-lamp` (branch `main` + feature branches)

**Breed (dino-style):** hybrid species from cross-kind mates + rarity tiers (普通→傳說); fusion stays same-species stages. Bestiary grows with hybrids (incl. 甲蟎 shellmite). Species↔kind 1:1; generations 0–3; dual personality on breed.
- Run: `cd mobile-rpg-slice && python3 -m http.server 8765`
- Smoke: `cd mobile-rpg-slice && node js/smoke-test.mjs`
- Pages: `https://alphaleehoho-commits.github.io/bug-free-lamp/` (needs GitHub Pages workflow if not yet enabled)

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

**P11:** material source hints (train sites + dispatch) · afford/short indicators on upgrade & breed · cultivate material guide list · train-site unlock hint on locked buttons · celebrate flash on first-clear site unlock after dungeon win.

**P12:** combat playback HP bars (ally/foe) · element-colored bars · log tint for 克制/被克/heal/KO · hit shake animation · skip summary banner.

**Balance:** Master from gear; pets from innate (fuse/breed). Materials from train sites + dispatch. UI polish deferred further. Skip: pet ornaments, stamina/energy.

## Prompt for the next agent

Continue 暗潮 PWA in `mobile-rpg-slice/`: idle, dungeon with streamed combat, element matchups, pending bonds, ranch dispatch, train sites + materials, upgrade/fuse/breed (dual personality). Save `void-tide-pets-v20`. Pages via GitHub Actions (Settings → Pages → GitHub Actions). Next: further UI polish or new content.
