# Art overhaul progress (single source of truth)

Plan: `/root/.claude/plans/declarative-napping-pinwheel.md` (merged vertical-slice plan). Branch `claude/dnd-tower-defense`.

## Decisions

- Painted overhaul via ElevenLabs Creative `gemini-3-pro-image` (Krea has no credits). Slice first: Ranger + green whelp drake + Glade + HUD/cards.
- Excluded design: dual-sword elf (row 2, col 3 + small version). Only `art/reference/sheet_sanitized.png` (elf painted out) may be sent to generators.
- Towers are stationary: idle/attack clips only. Walk clips are for enemies.
- Barbarian/Warlock gameplay deferred until the existing roster passes the gates.

## Spend (cap $18; price is last observed, not guaranteed)

| #             | What                                            | Model              | Cost   | Result                                                   |
| ------------- | ----------------------------------------------- | ------------------ | ------ | -------------------------------------------------------- |
| 1             | Knight walk strip spike (unsanitised sheet ref) | gemini-3-pro-image | $0.183 | 6 consistent frames; parked in `art/spike/`, not shipped |
| Total: $0.183 |

## Files changed

- `art/reference/sheet_sanitized.png`, `art/spike/*`, `scripts/cut-strip.mjs`, this doc.

## Checks run

- none yet this phase.

## Blockers / open questions

- Account balance unknown until generations run. Commercial-use terms for generated assets are unverified [U]; see `art/PROVENANCE.md`.

## Measurements (baseline, 915×412 CSS @ DPR 2, `?demo=glade`)

- Towers ≈ 100-130 device px tall incl. gear (~50-65 CSS px); enemies far smaller. Painted bake target for tower body ≈ 128-160 px tall frames; enemy ≈ 64-80 px. Baseline screenshot: `test-results/baseline_glade.png`.
