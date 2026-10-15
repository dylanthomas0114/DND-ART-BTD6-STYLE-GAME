# Art Bible

## Look

Bold cartoon fantasy:

- thick dark outlines (3–4 px at 1×)
- 2–3 tone cel shading
- warm rim light from the top-left
- soft elliptical ground shadows

Saturated but harmonious palettes. Characters use a **3/4 front view** and flip horizontally to face targets. The weapon arm aims at the target.

## Readability at phone size

- Towers are 48–64 px on screen. Weapons and shields are drawn about **1.5× life size**.
- Every tier must change the silhouette. A Playwright pixel-diff check (`?gallery`) enforces this.
- Gear contrasts against the body: light metal against dark cloth, or the reverse.
- Each skeleton layer also has its own **size and a small mark** (aura, spikes, plates, bolt, moss), and the prismatic layer cycles hue, so colorblind players can tell layers apart without relying on colour alone.

## Palette anchors

| Use       | Hex                   |
| --------- | --------------------- |
| Outline   | `#1d1410`             |
| Steel     | `#c9d3dc` → `#7d8a96` |
| Gold      | `#ffd36b` → `#b9822a` |
| Leather   | `#8b5a2b`             |
| Cloth red | `#b8322f`             |
| Arcane    | `#8f5cff`             |
| Frost     | `#8fe3ff`             |
| Fire      | `#ff8a2a`             |
| Radiant   | `#fff1a8`             |

## Maps

Maps are code-drawn from the authoritative path data and baked once per session (`src/render/mapBake.ts`), so the road always lines up with where enemies walk.

- Terrain: gradient, soft light and dark patches, fine grain, then ground cover (grass tufts, flowers, pebbles, moss, cracks) placed away from roads and water. Per map: the Glade is meadow with wildflowers, the Crypt a flagstone floor with moss and cracks, the Pass dry earth with strata, cracks and dry grass.
- Road: layered ribbon (shadow, bank, surface, worn centre) with outlined edge stones and pebbles. Stones are skipped where two roads cross.
- Water: wet bank, deep/mid/shallow tones, foam line; reeds and lily pads sit on top as live sprites.
- Decor keeps the thick outline and three-tone clumps of the characters: canopies in back, middle and front clumps with a light cap, trunks with roots and bark.
- Baked without multisampling (`bakeFlat`): the map is baked above its on-screen size, so the plain target looks the same and avoids hundreds of MB of multisample buffers.

### Ambient animation (`src/render/mapLife.ts`)

Purely visual, reads no game state, runs on real time so water keeps moving on the pause screen. One travelling wind (`src/render/wind.ts`) drives grass, canopies, bushes and reeds. Water gets expanding ripples and glints; lily pads bob. Cloud shadows drift over the ground. Per map: leaves and butterflies and pollen (Glade), wisps and mist (Crypt), embers, ash and dust (Pass).

- Quality tiers: low keeps only the water, sway and wind; medium drops two fifths of the drifting things and one cloud; high shows everything.
- `prefers-reduced-motion` freezes all ambient motion.

## UI

Parchment panels, dark wood frames and brass accents. Display font: Cinzel. Body font: Alegreya Sans.

## AI-painted assets (Krea)

- Map backgrounds: a code-rendered layout guide is repainted image-to-image in a painterly style. The road is always drawn in code on top.
- Tower portraits, logo and splash use transparent backgrounds.
- Every AI asset is recorded in `art/prompts.json` and has a code-drawn fallback.
