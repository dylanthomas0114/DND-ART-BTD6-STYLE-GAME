# Arcane Ramparts

A fantasy tower defense game for phones. It plays like a classic pop-the-layers tower defense, with a tabletop-fantasy party of heroes. Every upgrade gives your hero new gear, and gear from two upgrade paths shows up together on the character.

- **Content:** 9 towers × 3 paths × 5 tiers (135 upgrades, each one adding visible gear), 17 enemy types (12 slimes, 5 bosses), 3 maps, Easy 40 / Medium 60 / Hard 80 rounds plus freeplay.
- **Tech:** TypeScript, PixiJS 8 renderer, Preact UI and Capacitor 8 for Android/iOS. All art and audio are generated in code. AI-painted maps are optional (`art/prompts.json`).
- **Quality gates:** unit tests, bot-played balance campaigns, a sim performance budget, and Playwright e2e plus per-tier gear pixel diffs.

```bash
npm ci
npm run dev                      # http://localhost:5173  (?gallery, ?bestiary, ?demo debug pages)
npm run lint && npm run typecheck && npm test && npm run sim:balance
npm run build && npm run e2e
npm run android:debug            # debug APK (see docs/AGENT_BUILD.md)
```

Docs: `docs/GDD.md` (design and balance), `docs/ART_BIBLE.md`, `docs/AGENT_BUILD.md` (every build step, including the human-only ones).
