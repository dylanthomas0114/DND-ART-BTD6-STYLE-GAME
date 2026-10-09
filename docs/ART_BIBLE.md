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
- Each slime color also has its own **face, pattern and size**, so colorblind players can tell them apart.

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

## UI

Parchment panels, dark wood frames and brass accents. Display font: Cinzel. Body font: Alegreya Sans.

## AI-painted assets (Krea)

- Map backgrounds: a code-rendered layout guide is repainted image-to-image in a painterly style. The road is always drawn in code on top.
- Tower portraits, logo and splash use transparent backgrounds.
- Every AI asset is recorded in `art/prompts.json` and has a code-drawn fallback.
