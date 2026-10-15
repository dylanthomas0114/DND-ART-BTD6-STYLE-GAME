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

| #                                                                                                                                                                                                                                                                                               | What                                                           | Model                                       | Cost               | Result                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 1                                                                                                                                                                                                                                                                                               | Knight walk strip spike (unsanitised sheet ref)                | gemini-3-pro-image                          | $0.183             | 6 consistent frames; parked in `art/spike/`, not shipped                                                          |
|                                                                                                                                                                                                                                                                                                 | 2                                                              | Ranger attack strip (empty hands, 6 frames) | gemini-3-pro-image | $0.183                                                                                                            | usable; identity/outline consistent |
| 3                                                                                                                                                                                                                                                                                               | Ranger gear sheet A (3 bows, 3 quivers)                        | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearA`                                                                                      |
| 4                                                                                                                                                                                                                                                                                               | Ranger gear sheet B (2 headdresses, 3 arrows, mantle, harness) | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearB` (arrows painted diagonal, corrected in code)                                         |
| -                                                                                                                                                                                                                                                                                               | Ranger companions sheet                                        | -                                           | $0                 | **rejected: 429 free_tier_image_limit_reached** (not charged, not retried)                                        |
| 5                                                                                                                                                                                                                                                                                               | Skeleton warrior walk strip (text only)                        | gemini-3-pro-image                          | $0.122             | style good, layout wrong (4+2 rows, bald frame); raw kept in `art/spike/`                                         |
| 6                                                                                                                                                                                                                                                                                               | Skeleton warrior walk strip retry (frame 2 as reference)       | gemini-3-pro-image                          | $0.183             | usable; shipped as `skel_warrior`                                                                                 |
| 7                                                                                                                                                                                                                                                                                               | Skeleton archer strip (text only, 2x3 grid)                    | gemini-3-pro-image                          | $0.122             | after the daily reset; 6 consistent frames, nicer style match than Canva; **shipped** as `skel_archer` (6 frames) |
| 8                                                                                                                                                                                                                                                                                               | Skeleton archer, single pose (Canva Magic Design)              | Canva                                       | cost [U]           | one pose x4 copies; **shipped** as `skel_archer` (1 frame) and animated in code with a step bob                   |
| Listed total: about $1.16 of the $18 cap (prices are tool estimates; Canva cost is unknown [U]). The account is on ElevenLabs' free plan, so the listed price may not be an actual charge [U]. About 256 of 10,000 ElevenLabs credits remain [A: 1,474 before row 7, minus the 1,218 estimate]. |

## Status (slice)

- Done: painted Ranger body clip + separate bow layer + painted gear (13 of 20 Ranger pieces, plus 2 tinted-variant bows); sim-driven anticipation/release timing; all 135 tiers still pixel-diff distinct (e2e).
- Missing art (blocked by quota): 4 companions (wolfpup, direwolf, owlbear, owlbear_elder) stay vector; mask_deadeye stays vector; bow_storm/bow_sun are tinted bow_long; whelp drake, Glade terrain, UI frames, portrait polish.

## Whelp boss (done)

- `public/assets/painted/whelp.png` (512x343, from the clean Canva cut; facing left). `PAINTED_BOSSES` in `src/render/art/painted.ts`, rig maths in `src/render/bossRig.ts` (pure, tested), Pixi mesh in `src/render/paintedBoss.ts`, integration in `EnemyView` (`worldView.ts`) with the code-drawn boss as fallback.
- The painting is bent with a 14x10 mesh: wing flap, tail wave, head nod and alternating foot lifts driven by distance walked. Frozen enemies stop; stunned ones idle. Hit squash, status tints, ice, armor and crack overlays still apply.
- Phone-size check (915x412 @ DPR 2, swiftshader, no towers so it walks the road): `docs/shots/whelp_boss_phone.png`.

## Skeleton enemies (warrior and archer done)

- Regular enemies are now skeletons. `ENEMY_LOOKS` in `src/render/art/painted.ts` maps every regular id to a chassis and a size. **Layer colours and immunity marks are switched off** (user request, 2026-10-15): every skeleton looks like its chassis and layers differ only by size. `SHOW_LAYER_STYLE` in `painted.ts` is the single switch; the old colour ladder (green, blue, amber, violet, crimson) and marks (shadow/ward aura, frost spikes, iron pauldrons, storm bolt, prismatic hue cycle, stone moss) are kept in the table and come back with `true`. Trade-off: players can no longer read a layer's immunity or colour at a glance; status tints (slow, burn) are unchanged. Ids, stats and rounds are unchanged; only display names and blurbs now say Skeleton.
- Warrior (sword and shield) is the main line: green to crimson, iron, stone. Archer (bow and arrows) is assigned to shadow, frost, warded, storm and prismatic. This table is one line per enemy and easy to change.
- Warrior walk strip: `public/assets/painted/skel_warrior.png/json` (6 frames, 82x120 cells), cut by the new `scripts/cut-walk.mjs` (erases the generator's ground line, splits at the emptiest columns, aligns by opaque-pixel centre, shared scale). Playback is paced by speed (`cyclesPerSecond`), frozen when frozen, and hit squash and status tints still apply.
- **Archer** (`public/assets/painted/skel_archer.png/json`, 6 frames, 108x120): the ElevenLabs hooded skeleton archer (real 6-frame walk, brown hood, glowing eyes), swapped in at the user's request. Same clean cartoon finish as the warrior and whelp. Cut with `node scripts/cut-walk.mjs art/spike/skeleton_archer_strip_raw.png art/spike/skel_archer_alt 6 112 --rows=2`.
- **Spare:** the Canva archer (one pose, pixel-art-like finish) is `art/spike/canva_archer_try1.png`. A single-frame strip is animated in code by `stepBob` (hop, rock, squash), which only runs for 1-frame strips: cut it with `node scripts/cut-walk.mjs art/spike/canva_archer_try1.png public/assets/painted/skel_archer 4 112 --key=magenta --take=1`.
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
- Archer commit and G2 review fixes: lint, typecheck, `npm test` 141 pass (5 new painted-asset checks), `npm run build`, `npm run e2e` 4 pass; CI `check` and `apk` green on `e3fda0f`.
- Not run yet: sim:balance (no sim change), G1 crowded-wave review against the old look, device test.

## G2 performance (painted enemies), desktop emulation only

Chromium on swiftshader (software GL), 915x412 @ DPR 2, 150 skeleton walkers (all 12 layers) + 5 whelp bosses on the road, enemies nearly still. Frame times (about 145-170 ms) are the software rasteriser, **not** a phone result; the draw-call, GL-call and CPU columns are the useful ones. Harness: scratchpad `perf.mjs` (counts GL calls by wrapping the context, times `view.update` and `renderer.render`).

| Scene                                        | Draws/frame | GL calls | Tex binds | `view.update` | `render()` |
| -------------------------------------------- | ----------- | -------- | --------- | ------------- | ---------- |
| All vector fallback (150 walkers + 5 bosses) | 3           | 175      | 82        | 0.42 ms       | 0.99 ms    |
| Painted walkers only                         | 3           | 173      | 81        | 0.44 ms       | 1.17 ms    |
| Painted walkers + 5 painted whelps           | 13          | 349      | 145       | 0.52 ms       | 1.26 ms    |
| Same, shadow/aura/mark sprites removed (229) | 11          | 206      | 75        | 0.46 ms       | 1.08 ms    |
| Same, mesh forced to batch mode              | 3           | 175      | 82        | 0.61 ms       | 1.48 ms    |

- Painted walkers cost about the same as the vector ones. Each non-batched whelp mesh costs about +2 draws and +35 GL calls (Pixi does not batch a 140-vertex mesh by default). Forcing batch mode drops draws to 3 but frame time did not change here (software GL is fill-bound), so it is **not applied**; worth re-testing on a device.
- Decoded texture memory for every painted PNG: 2.48 MB total (whelp 0.67, ranger strip and gear 1.5, skeletons 0.27); 736 KB on disk.
- Not measured: real phone, moving enemies, towers/projectiles/particles on screen, thermal throttling. So "G2 passes" is **not** claimed; only "no draw-call or CPU regression found in this emulation".

### Independent review (4 lenses, read-only) and what came of it

- Lifecycle, frame cost, loading: no defect in the painted enemy path (no leaked sprites, meshes or textures on pop/death/restart; fallback chain and Capacitor URLs correct). The fourth lens (validity of the measurement) and most skeptic verifiers were cut off by an account session limit, so those results are **unverified, not refuted**; I checked each remaining finding in the code myself.
- **Fixed, confirmed by measurement:** `WorldView` baked two multisampled textures (ground, road) per view and never destroyed them. The menu backdrop is itself a world view, so every Play/menu cycle leaked four textures (managed textures 136, 140, 144, 148 over four cycles; flat at 134 after the fix). Pre-existing, not caused by the painted art. `WorldView.destroy()` now frees them.
- **Fixed:** the service worker served painted art and map paintings cache-first forever under a fixed cache name, so swapping `skel_archer.*` would never reach installed web players. Cache name bumped to v2 and art/map files are now stale-while-revalidate. `loadStrip` also refuses a strip whose PNG is smaller than its JSON says (half-cached pair) and falls back to vector art.
- **Fixed:** new `tests/unit/paintedAssets.test.ts` checks every registry entry has its JSON and PNG, that they agree, and that gear atlas items sit inside their PNG, so a mistyped name or half-copied art swap no longer falls back silently.
- **Left as is (minor, unmeasured on a phone):** the quality tier (auto-low and the Low setting) only reduces particles and cannot shed enemy cost (shadow sprites could be hidden at Low); boot waits up to 10 s for optional art on a stalled first load (art keeps loading afterwards and later sessions use it); the render loop is uncapped on 90/120 Hz phones (pre-existing); per-frame small allocations (hpBar redraw, a temporary object per tint) are far below a GC problem.

## Blockers / open questions

- **Image generation is blocked: ElevenLabs free-tier daily image limit reached after 4 generations.** Options: wait for the daily reset, upgrade the plan, or add another generator. Do not retry blindly.
- Account balance unknown until generations run. Commercial-use terms for generated assets are unverified [U]; see `art/PROVENANCE.md`.

## Measurements (baseline, 915×412 CSS @ DPR 2, `?demo=glade`)

- Towers ≈ 100-130 device px tall incl. gear (~50-65 CSS px); enemies far smaller. Painted bake target for tower body ≈ 128-160 px tall frames; enemy ≈ 64-80 px. Baseline screenshot: `test-results/baseline_glade.png`.
