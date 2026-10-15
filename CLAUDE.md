# Arcane Ramparts: agent guide

A tower defense game for phones that pops enemies layer by layer, with a fantasy tabletop-RPG look. TypeScript + PixiJS v8 + Preact, wrapped for Android/iOS with Capacitor.

## Commands

- `npm run dev`: dev server (open `/?gallery` for the gear gallery)
- `npm run lint && npm run typecheck && npm test`: run all three before every commit
- `npm run sim:balance`: headless balance runs (bots play every difficulty)
- `npm run e2e`: Playwright on a Pixel 7 landscape screen (run `npm run build` first; in the cloud container set `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`)
- `npm run build`: production web build into `dist/`
- `npm run android:debug`: debug APK (see docs/AGENT_BUILD.md for SDK setup)

## Architecture rules

- `src/core/` is the deterministic simulation. It must never import Pixi, Preact, or anything from `render/` or `ui/` (ESLint enforces this). It uses a fixed 60 Hz `Game.step()` and a seeded RNG.
- `src/core/data/` holds all content. Towers live in `towers/*.ts`, built with the helpers in `towerKit.ts`.
- `src/render/` is Pixi. It reads simulation state each frame and reacts to `game.events` for one-shot effects.
- `src/ui/` is Preact/DOM layered over the canvas.
- The gear rule is a user requirement: every upgrade must add or replace at least one real piece of gear (`gear` in `up(...)`). Each path owns disjoint slots. Every gear `art` id must be registered in `src/render/art/gear/`. Tests enforce all three.

## IP rules

Use only generic fantasy and SRD 5.1 monsters. Never use "Dungeons & Dragons", Wizards of the Coast monsters (beholder, mind flayer…), or Ninja Kiwi names (Bloons, MOAB, Monkey).

## Git

Work on `claude/dnd-tower-defense`. Commits must pass lint, typecheck and tests.
