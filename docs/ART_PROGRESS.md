# Art overhaul progress (single source of truth)

Plan: `/root/.claude/plans/declarative-napping-pinwheel.md` (merged vertical-slice plan). Branch `claude/dnd-tower-defense`.

## Decisions

- Painted overhaul via ElevenLabs Creative `gemini-3-pro-image` (Krea has no credits). Slice first: Ranger + green whelp drake + Glade + HUD/cards.
- Excluded design: dual-sword elf (row 2, col 3 + small version). Only `art/reference/sheet_sanitized.png` (elf painted out) may be sent to generators.
- Towers are stationary: idle/attack clips only. Walk clips are for enemies.
- Barbarian/Warlock gameplay deferred until the existing roster passes the gates.
- Image route in use: Canva single hero images (no reference image, so no consistent frame strips). Animation is done in code. ElevenLabs (reference images, strips) is only usable when its free-tier daily image limit has reset; Hugging Face needs an `HF_TOKEN` env secret.
- Enemy direction (user, 2026-10-14): the drake whelp is a **boss** (there will be several boss types). The regular enemies become **skeletons**: a sword-and-shield skeleton (the main enemy) and a skeleton archer. Whelp sits on the first boss slot (id `ogre`, now named Drake Whelp); ids, stats and rounds are unchanged.

## Spend (cap $18; price is last observed, not guaranteed)

| #                                                                                                                                                                                                                                                                                               | What                                                           | Model                                       | Cost               | Result                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 1                                                                                                                                                                                                                                                                                               | Knight walk strip spike (unsanitised sheet ref)                | gemini-3-pro-image                          | $0.183             | 6 consistent frames; parked in `art/spike/`, not shipped                                                                      |
|                                                                                                                                                                                                                                                                                                 | 2                                                              | Ranger attack strip (empty hands, 6 frames) | gemini-3-pro-image | $0.183                                                                                                                        | usable; identity/outline consistent |
| 3                                                                                                                                                                                                                                                                                               | Ranger gear sheet A (3 bows, 3 quivers)                        | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearA`                                                                                                  |
| 4                                                                                                                                                                                                                                                                                               | Ranger gear sheet B (2 headdresses, 3 arrows, mantle, harness) | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearB` (arrows painted diagonal, corrected in code)                                                     |
| -                                                                                                                                                                                                                                                                                               | Ranger companions sheet                                        | -                                           | $0                 | **rejected: 429 free_tier_image_limit_reached** (not charged, not retried)                                                    |
| 5                                                                                                                                                                                                                                                                                               | Skeleton warrior walk strip (text only)                        | gemini-3-pro-image                          | $0.122             | style good, layout wrong (4+2 rows, bald frame); raw kept in `art/spike/`                                                     |
| 6                                                                                                                                                                                                                                                                                               | Skeleton warrior walk strip retry (frame 2 as reference)       | gemini-3-pro-image                          | $0.183             | usable; shipped as `skel_warrior`                                                                                             |
| 7                                                                                                                                                                                                                                                                                               | Skeleton archer strip (text only, 2x3 grid)                    | gemini-3-pro-image                          | $0.122             | after the daily reset; 6 consistent frames, nicer style match than Canva; kept as a **spare** (`art/spike/skel_archer_alt.*`) |
| 8                                                                                                                                                                                                                                                                                               | Skeleton archer, single pose (Canva Magic Design)              | Canva                                       | cost [U]           | one pose x4 copies; **shipped** as `skel_archer` (1 frame) and animated in code with a step bob                               |
| Listed total: about $1.16 of the $18 cap (prices are tool estimates; Canva cost is unknown [U]). The account is on ElevenLabs' free plan, so the listed price may not be an actual charge [U]. About 256 of 10,000 ElevenLabs credits remain [A: 1,474 before row 7, minus the 1,218 estimate]. |

## Status (slice)

- Done: painted Ranger body clip + separate bow layer + painted gear (13 of 20 Ranger pieces, plus 2 tinted-variant bows); sim-driven anticipation/release timing; all 135 tiers still pixel-diff distinct (e2e).
- Missing art (blocked by quota): 4 companions (wolfpup, direwolf, owlbear, owlbear_elder) stay vector; mask_deadeye stays vector; bow_storm/bow_sun are tinted bow_long; whelp drake, Glade terrain, UI frames, portrait polish.

## Whelp boss (done)

- `public/assets/painted/whelp.png` (512x343, from the clean Canva cut; facing left). `PAINTED_BOSSES` in `src/render/art/painted.ts`, rig maths in `src/render/bossRig.ts` (pure, tested), Pixi mesh in `src/render/paintedBoss.ts`, integration in `EnemyView` (`worldView.ts`) with the code-drawn boss as fallback.
- The painting is bent with a 14x10 mesh: wing flap, tail wave, head nod and alternating foot lifts driven by distance walked. Frozen enemies stop; stunned ones idle. Hit squash, status tints, ice, armor and crack overlays still apply.
- Phone-size check (915x412 @ DPR 2, swiftshader, no towers so it walks the road): `docs/shots/whelp_boss_phone.png`.

## Skeleton enemies (warrior and archer done)

- Regular enemies are now skeletons. `ENEMY_LOOKS` in `src/render/art/painted.ts` maps every regular id to a chassis, layer colour (light tint multiplied over the painting), size and an immunity mark (shadow/ward aura, frost spikes, iron pauldrons, storm bolt, prismatic hue cycle, stone moss). Ids, stats and rounds are unchanged; only display names and blurbs now say Skeleton.
- Warrior (sword and shield) is the main line: green to crimson, iron, stone. Archer (bow and arrows) is assigned to shadow, frost, warded, storm and prismatic. This table is one line per enemy and easy to change.
- Warrior walk strip: `public/assets/painted/skel_warrior.png/json` (6 frames, 82x120 cells), cut by the new `scripts/cut-walk.mjs` (erases the generator's ground line, splits at the emptiest columns, aligns by opaque-pixel centre, shared scale). Playback is paced by speed (`cyclesPerSecond`), frozen when frozen, and hit squash and status tints still apply.
- **Archer** (`public/assets/painted/skel_archer.png/json`, 1 frame, 91x120): built from a Canva image as chosen. Canva only returns one hero pose (four copies of the same pose this time), so the walk is faked in code: `stepBob` in `src/render/walkCycle.ts` hops, rocks and squashes the single frame twice per cycle, paced by the same speed curve as the warrior. Strips with 2+ frames skip it. Cut with `node scripts/cut-walk.mjs art/spike/canva_archer_try1.png public/assets/painted/skel_archer 4 112 --key=magenta --take=1`.
- **Style caveat:** the Canva archer is pixel-art-like (grainy edges, blue-grey hood), the ElevenLabs warrior and whelp are clean cartoon. At phone size it reads as a skeleton archer, but it is not the same hand as the warrior.
- **Spare:** the ElevenLabs archer strip (6-frame real walk, brown hood, glowing eyes, much closer to the warrior) is cut to `art/spike/skel_archer_alt.png/json`. To switch: copy both files over `public/assets/painted/skel_archer.*`. No code change; `walkFrame` handles 6 frames and `stepBob` only runs for 1-frame strips. Raw: `art/spike/skeleton_archer_strip_raw.png`.
- Fixed while wiring: the bestiary indexed frame 1 of a 1-frame strip (blank body); it now clamps to the last frame. Verified in `?bestiary` and in a live game with all archer layers spawned (`docs/shots/bestiary_skeleton_tiers.png`).
- `scripts/cut-walk.mjs` options: `--key=green|magenta`, `--rows=N` (grid sheets), `--take=N` (keep the first N frames), `--ground=Y`.
- Independent review of the whelp and skeleton code (3 lenses): one confirmed defect, fixed (painted bodies kept animating under the Defeat dialog; they now animate only while the simulation actually moves them, verified in the browser). Also fixed from the unverified list: status tints now multiply the layer colour instead of replacing it, the bestiary whelp faces right like in the game, preloading can no longer hold the loading screen longer than 10 s, README and ART_BIBLE text no longer say slimes or "all art is code". The verifier agents were cut off by an org spend limit, so the other findings (draw-call batching of mesh/shadow sprites, per-walker sprite count, asset requests) are **unverified, not refuted**: gate G2 (performance with painted assets) is still not run.
- Review pages: `?bestiary` (all 12 layers with modifiers), `docs/shots/bestiary_skeleton_tiers.png`, `docs/shots/skeletons_and_whelp_phone.png`.

## Files changed

- `art/reference/sheet_sanitized.png`, `art/spike/*`, `scripts/cut-strip.mjs`, this doc.
- Skeletons: `src/render/walkCycle.ts`, `scripts/cut-walk.mjs`, `tests/unit/walkCycle.test.ts`, `public/assets/painted/skel_{warrior,archer}.*`, enemy names in `src/core/data/enemies.ts`, `docs/GDD.md`, tutorial text in `src/ui/GameScreen.tsx`.
- Whelp boss: `src/render/{bossRig,paintedBoss,spriteAtlas,bestiary,worldView}.ts`, `src/render/art/painted.ts`, `tests/unit/bossRig.test.ts`, display names in `src/core/data/{enemies,difficulty}.ts` and `docs/GDD.md`.

## Checks run

- Whelp boss commit: lint (only the untracked plugin file is flagged by prettier), typecheck, `npm test` 127 pass, `npm run build`, `npm run e2e` 4 pass (Pixel 7 emulation). `sim:balance` not re-run: no simulation change, only display text.
- Earlier: lint, typecheck, `npm test` (122 pass incl. clip timing), `npm run build`, `npm run e2e` (4 pass, Pixel 7 emulation, swiftshader): all green at commit 0154890.
- Not run yet: sim:balance (no sim change), perf stress with painted assets, phone-size crowded-wave review (G1), device test.

## Blockers / open questions

- **Image generation is blocked: ElevenLabs free-tier daily image limit reached after 4 generations.** Options: wait for the daily reset, upgrade the plan, or add another generator. Do not retry blindly.
- Account balance unknown until generations run. Commercial-use terms for generated assets are unverified [U]; see `art/PROVENANCE.md`.

## Measurements (baseline, 915×412 CSS @ DPR 2, `?demo=glade`)

- Towers ≈ 100-130 device px tall incl. gear (~50-65 CSS px); enemies far smaller. Painted bake target for tower body ≈ 128-160 px tall frames; enemy ≈ 64-80 px. Baseline screenshot: `test-results/baseline_glade.png`.
