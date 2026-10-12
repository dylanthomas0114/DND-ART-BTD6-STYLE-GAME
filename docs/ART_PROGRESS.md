# Art overhaul progress (single source of truth)

Plan: `/root/.claude/plans/declarative-napping-pinwheel.md` (merged vertical-slice plan). Branch `claude/dnd-tower-defense`.

## Decisions

- Painted overhaul via ElevenLabs Creative `gemini-3-pro-image` (Krea has no credits). Slice first: Ranger + green whelp drake + Glade + HUD/cards.
- Excluded design: dual-sword elf (row 2, col 3 + small version). Only `art/reference/sheet_sanitized.png` (elf painted out) may be sent to generators.
- Towers are stationary: idle/attack clips only. Walk clips are for enemies.
- Barbarian/Warlock gameplay deferred until the existing roster passes the gates.

## Spend (cap $18; price is last observed, not guaranteed)

| #                                                                                                                                 | What                                                           | Model                                       | Cost               | Result                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| 1                                                                                                                                 | Knight walk strip spike (unsanitised sheet ref)                | gemini-3-pro-image                          | $0.183             | 6 consistent frames; parked in `art/spike/`, not shipped                   |
|                                                                                                                                   | 2                                                              | Ranger attack strip (empty hands, 6 frames) | gemini-3-pro-image | $0.183                                                                     | usable; identity/outline consistent |
| 3                                                                                                                                 | Ranger gear sheet A (3 bows, 3 quivers)                        | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearA`                                               |
| 4                                                                                                                                 | Ranger gear sheet B (2 headdresses, 3 arrows, mantle, harness) | gemini-3-pro-image                          | $0.183             | clean, cut to `ranger_gearB` (arrows painted diagonal, corrected in code)  |
| -                                                                                                                                 | Ranger companions sheet                                        | -                                           | $0                 | **rejected: 429 free_tier_image_limit_reached** (not charged, not retried) |
| Listed total: $0.73 of the $18 cap. The account is on ElevenLabs' free plan, so the listed price may not be an actual charge [U]. |

## Status (slice)

- Done: painted Ranger body clip + separate bow layer + painted gear (13 of 20 Ranger pieces, plus 2 tinted-variant bows); sim-driven anticipation/release timing; all 135 tiers still pixel-diff distinct (e2e).
- Missing art (blocked by quota): 4 companions (wolfpup, direwolf, owlbear, owlbear_elder) stay vector; mask_deadeye stays vector; bow_storm/bow_sun are tinted bow_long; whelp drake, Glade terrain, UI frames, portrait polish.

## Files changed

- `art/reference/sheet_sanitized.png`, `art/spike/*`, `scripts/cut-strip.mjs`, this doc.

## Checks run

- lint, typecheck, `npm test` (122 pass incl. clip timing), `npm run build`, `npm run e2e` (4 pass, Pixel 7 emulation, swiftshader): all green at commit 0154890.
- Not run yet: sim:balance (no sim change), perf stress with painted assets, phone-size crowded-wave review (G1), device test.

## Blockers / open questions

- **Image generation is blocked: ElevenLabs free-tier daily image limit reached after 4 generations.** Options: wait for the daily reset, upgrade the plan, or add another generator. Do not retry blindly.
- Account balance unknown until generations run. Commercial-use terms for generated assets are unverified [U]; see `art/PROVENANCE.md`.

## Measurements (baseline, 915×412 CSS @ DPR 2, `?demo=glade`)

- Towers ≈ 100-130 device px tall incl. gear (~50-65 CSS px); enemies far smaller. Painted bake target for tower body ≈ 128-160 px tall frames; enemy ≈ 64-80 px. Baseline screenshot: `test-results/baseline_glade.png`.
