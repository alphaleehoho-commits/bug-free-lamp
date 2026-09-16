# Pet sprites

Flat idle portraits, keyed by **race id** (not in-game display name).

## Path

```
mobile-rpg-slice/assets/pets/{NN}_{元素}_{動作}.png
```

- `{NN}` — zero-padded race id `01`–`48`
- Keep the given filenames (including `水` and `Idle`)

Current pack: **Idle + 水 only** (48 RGBA files, transparent backgrounds). Do not invent other elements or actions until those PNGs land.

## Race ids

| IDs | Group | Count |
|-----|--------|-------|
| 1–14 | wild / base (`SPECIES` without `breedOnly`) | 14 |
| 15–40 | breed-only | 26 |
| 41–48 | tertiary | 8 |

`speciesId` in `water-idle-map.json` is the live `SPECIES` table id. `Name_ZH` on the sheet is the art label; it does **not** rename in-game species.

## Loading

`js/pet-sprites.js` maps `raceId` / `speciesId` → `./assets/pets/{NN}_水_Idle.png`.

UI (`pet-icons.js`) uses that URL for pet portraits. Combat balance is unchanged. Other elements fall back to this water Idle until their packs exist.

## Files

- `NN_水_Idle.png` — portraits
- `water-idle-map.csv` — source id / name / filename table
- `water-idle-map.json` — same table plus `speciesId`
