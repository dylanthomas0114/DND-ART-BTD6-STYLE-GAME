# Gemini prompt pack: enemies, characters and their animations

Prompts to paste into Gemini to generate the rest of the art in the **same style as your original character sheet**. Every prompt is self-contained (copy the whole fenced block). Generated 2026-10-15 from your sheet (`art/reference/sheet_sanitized.png`), `docs/ART_BIBLE.md` and the game code. Nothing here changes the simulation.

## Contents

1. [The method](#the-method)
2. [Master style block](#master-style-block)
3. [Enemies](#enemies) (4 new bosses, the whelp and both skeletons regenerated)
4. [Characters](#characters) (11 characters from the sheet: master pose, attack animation, idle and special)
5. [Companions](#companions) (11 pets and familiars)
6. [How the current art compares to your sheet](#how-the-current-art-compares-to-your-sheet)
7. [Optional: gear sheets](#optional-gear-sheets)

## The method

### The method (use it for every character and enemy)

1. **Attach the sheet.** Attach your original character sheet (`art/reference/sheet_sanitized.png` in the repo is the copy with the unused dual-sword elf painted out) to **every** request. It is the style anchor.
2. **Make the master pose first** (Prompt M). One image, one character. Regenerate until the face, outfit, proportions and outline match the sheet. This is the approved identity.
3. **Then make the animation grid** (Prompt A, B, W...). Attach the sheet **and** the approved master pose, then paste the prompt. Identity drift is the main failure; attaching the approved master fixed it every time so far (a text-only strip came back with a bald frame and a 4+2 layout).
4. **One image per request.** If the grid is wrong (frame count, cropped feet, a ground line, text), reply "Redo: exactly N frames in C columns by R rows, same scale and baseline, flat background, no ground, no text" instead of re-pasting everything.
5. **Pick a good grid** and save it as a PNG. Drop it in `art/spike/<name>.png` in the repo (names are given with each prompt) and tell me; I cut and align it with `scripts/cut-walk.mjs` or `scripts/cut-strip.mjs`, wire it, and check it at phone size.
6. **Do not paint what the game draws.** Cracks, frost, tint, armour bands, status effects, coin fountains, spell glows and projectiles are drawn in code. Gear (helmets, weapons, hoods, capes) is generated as separate pieces, so the **base body** prompts below have empty hands and no gear on purpose.

### Things I could not verify

- Your Gemini model, plan, output resolution and per-day image limit [U]. Ask for the largest output offered. A 6-frame grid needs each frame roughly 250 px tall or more to hold the detail the sheet has; if frames come back smaller, generate fewer frames per image (the prompts say how).
- Whether generated art may be used commercially under your terms [U]. Check Google's current terms before release.
- I have not run these prompts in Gemini. They are written from your sheet and the game's code.

## Master style block

Every master-pose prompt below already contains this. Keep it handy: if Gemini drifts, paste it again with "Match the attached sheet more closely".

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.
```

## Enemies

Bosses are **one flat image bent by a mesh in code** (wing flap, tail wave, head nod, foot lifts), so the master pose must keep wings, tail and legs clear of the body. A walk strip is optional polish. Regular skeletons need a 6-frame walk cycle. All enemies face the viewer's RIGHT; the game mirrors them. Damage, frost, tint, armour bands and cracks are drawn in code: do not paint them in.

**Gameplay facts that shape each design** are listed under each enemy (from `src/core/data/enemies.ts`).

### Troll Chieftain

_id `troll`: 700 hp, very slow (about 21 units/s), the second link of the boss chain; pops into 4 Drake Whelps. Currently code-drawn._ Save as `art/spike/troll_master.png` and `art/spike/troll_walk.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature described below, in the exact style of the attached character sheet (it must look like it belongs on that sheet, drawn at the size of its large characters).
CREATURE: A hulking SRD-style troll chieftain, about 3 heads tall with a thick neck, huge fists and big feet, heavy-set and slouched forward. Mossy grey-green skin (#6B7F56 base, #8FA36E highlights, #3F4D38 shadows) with warts, scars and tusk-scratches, a heavy brow shelf with small beady amber-glinting eyes, a crooked underbite with two thick yellow-white tusks, a flat wide nose, a scowl. A crown of jagged bone spikes on a tangle of black hair. A ragged shaggy fur-and-hide wrap over one shoulder and across the chest (tawny fur, cream tufts, dark shadow, jagged edge), a wide brown leather belt with a white bone skull buckle, wrapped leather wrist guards with brass studs, bare grey-green feet with thick toenails. A huge spiked wooden club (dark grain, iron studs) held in the front hand and dragging low. Accent: the orange-red war-paint on the chest and face.
POSE AND RIG RULES: a slow heavy lumbering walk: full body, side view to the right with the face turned a little toward the viewer, club in the near hand, feet apart with a CLEAR GAP between the legs. This image will be bent by a mesh animation, so keep the wings, tail, head and legs clearly separated from the torso with visible gaps. The creature fills about 85% of the width of a 16:9 landscape image, fully inside the frame, feet near the bottom edge. Facing the viewer's RIGHT.
DO NOT PAINT: cracks, frost, tint, armour bands, status effects, ground, shadow, props floating apart from the creature.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt W: walk cycle (optional)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the creature in the attached master pose, side view to the viewer's RIGHT.
CREATURE (identical to the master pose): A hulking SRD-style troll chieftain, about 3 heads tall with a thick neck, huge fists and big feet, heavy-set and slouched forward. Mossy grey-green skin (#6B7F56 base, #8FA36E highlights, #3F4D38 shadows) with warts, scars and tusk-scratches, a heavy brow shelf with small beady amber-glinting eyes, a crooked underbite with two thick yellow-white tusks, a flat wide nose, a scowl. A crown of jagged bone spikes on a tangle of black hair. A ragged shaggy fur-and-hide wrap over one shoulder and across the chest (tawny fur, cream tufts, dark shadow, jagged edge), a wide brown leather belt with a white bone skull buckle, wrapped leather wrist guards with brass studs, bare grey-green feet with thick toenails. A huge spiked wooden club (dark grain, iron studs) held in the front hand and dragging low. Accent: the orange-red war-paint on the chest and face.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. CONTACT: front foot planted, club dragging behind, torso leaning forward
2. DOWN: weight dropping onto the front leg, shoulders sagging, club scraping
3. PASS: back leg swinging through, torso at its highest, head lifting
4. CONTACT 2: the other foot planted, club swinging forward a little
5. DOWN 2: weight dropping on the other leg, shoulders swaying to the other side
6. PASS 2: back leg swinging through, club dragging, head dipping again
Keep the head, face and body size identical in every frame. If six frames will not stay consistent, draw frames 1 to 3 in a 3 by 1 row and ask me for frames 4 to 6 separately.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Stone Giant

_id `giant`: 4,000 hp, very slow (about 15 units/s), pops into 4 Troll Chieftains. Currently code-drawn._ Save as `art/spike/giant_master.png` and `art/spike/giant_walk.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature described below, in the exact style of the attached character sheet (it must look like it belongs on that sheet, drawn at the size of its large characters).
CREATURE: An SRD-style stone giant built from chunky layered boulders and slabs, about 3 heads tall with massive shoulders, thick stubby legs, huge boulder fists. Muted grey-brown stone (#8A8478 base, lit left faces #B5AE9E, dark right faces #4F4A42) with chiselled cracks, chips, and lichen and moss in the seams (moss green #5F7A3A, small patches only). A heavy brow ridge carved into a stern craggy face, a flat nose, a wide stone mouth, two glowing cyan eyes (#6FD3FF with a white core and a thin darker rim). A glowing cyan rune carved into the chest (the ONLY saturated colour), a few small boulders hanging at the belt like a harness of rope. Both arms hang forward with fists dragging a little. Accent: cyan rune and eyes.
POSE AND RIG RULES: a ponderous stomp: full body, side view to the right with the face turned a little toward the viewer, arms hanging, feet apart with a CLEAR GAP between the legs. This image will be bent by a mesh animation, so keep the wings, tail, head and legs clearly separated from the torso with visible gaps. The creature fills about 85% of the width of a 16:9 landscape image, fully inside the frame, feet near the bottom edge. Facing the viewer's RIGHT.
DO NOT PAINT: cracks, frost, tint, armour bands, status effects, ground, shadow, props floating apart from the creature.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt W: walk cycle (optional)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the creature in the attached master pose, side view to the viewer's RIGHT.
CREATURE (identical to the master pose): An SRD-style stone giant built from chunky layered boulders and slabs, about 3 heads tall with massive shoulders, thick stubby legs, huge boulder fists. Muted grey-brown stone (#8A8478 base, lit left faces #B5AE9E, dark right faces #4F4A42) with chiselled cracks, chips, and lichen and moss in the seams (moss green #5F7A3A, small patches only). A heavy brow ridge carved into a stern craggy face, a flat nose, a wide stone mouth, two glowing cyan eyes (#6FD3FF with a white core and a thin darker rim). A glowing cyan rune carved into the chest (the ONLY saturated colour), a few small boulders hanging at the belt like a harness of rope. Both arms hang forward with fists dragging a little. Accent: cyan rune and eyes.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. CONTACT: front foot planted, shoulders rocking forward, rune glowing
2. DOWN: the whole body sinking onto the front leg, shoulders sagging
3. LIFT: back foot lifting, torso rising, chin up
4. CONTACT 2: the other foot slamming down, stone chips falling
5. DOWN 2: sinking onto the other leg, shoulders rocking the other way
6. LIFT 2: back foot lifting, torso rising
Keep the head, face and body size identical in every frame. If six frames will not stay consistent, draw frames 1 to 3 in a 3 by 1 row and ask me for frames 4 to 6 separately.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Lich Wraith

_id `lich`: 400 hp, FAST (about 234 units/s), always invisible (drawn at about 45% opacity in the game, so the silhouette, bright eyes and orb must still read), immune to piercing, slashing and blast; pops into 6 Stone Skeletons. Currently code-drawn._ Save as `art/spike/lich_master.png` and `art/spike/lich_walk.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature described below, in the exact style of the attached character sheet (it must look like it belongs on that sheet, drawn at the size of its large characters).
CREATURE: An SRD-style lich wraith, a floating caster with NO feet, about 3.3 heads tall with a ragged hem fading into wisps. A gaunt skull face (cream bone #E9E2CF, dark sockets) with narrowed glowing green eyes (#6FE0A0 with a white core and a dark rim) and a furrowed brow ridge, a thin grim mouth. A spined crown of tarnished gold with a green gem. Tattered layered robes in deep purple (#3A2A4A with #5A4672 highlights) and black, with gold-ochre embroidered trim, bone-and-metal pauldrons, a wine-red sash panel. One skeletal hand held out in front casting, with a small green flame (#7DFF3C with a white-yellow core) hovering above the palm. The other hand holds a black staff topped with a claw cradling a floating green soul-orb and a few wisps. Accent: green fire, orb and eyes.
POSE AND RIG RULES: a hovering float: full body, three-quarter view toward the right, robes trailing back, casting hand forward, staff in the other hand, a strong readable silhouette. This image will be bent by a mesh animation, so keep the wings, tail, head and legs clearly separated from the torso with visible gaps. The creature fills about 85% of the width of a 16:9 landscape image, fully inside the frame, feet near the bottom edge. Facing the viewer's RIGHT.
DO NOT PAINT: cracks, frost, tint, armour bands, status effects, ground, shadow, props floating apart from the creature.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt W: walk cycle (optional)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the creature in the attached master pose, side view to the viewer's RIGHT.
CREATURE (identical to the master pose): An SRD-style lich wraith, a floating caster with NO feet, about 3.3 heads tall with a ragged hem fading into wisps. A gaunt skull face (cream bone #E9E2CF, dark sockets) with narrowed glowing green eyes (#6FE0A0 with a white core and a dark rim) and a furrowed brow ridge, a thin grim mouth. A spined crown of tarnished gold with a green gem. Tattered layered robes in deep purple (#3A2A4A with #5A4672 highlights) and black, with gold-ochre embroidered trim, bone-and-metal pauldrons, a wine-red sash panel. One skeletal hand held out in front casting, with a small green flame (#7DFF3C with a white-yellow core) hovering above the palm. The other hand holds a black staff topped with a claw cradling a floating green soul-orb and a few wisps. Accent: green fire, orb and eyes.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. FLOAT A: low in its bob, hem trailing right, orb dim
2. FLOAT B: rising, hem lifting, orb brightening
3. FLOAT C: at the top of the bob, robes billowing back, eyes bright
4. FLOAT D: sinking, hem swirling, a wisp curling off the robe
5. FLOAT E: low again, the casting hand opening, the flame pulsing
6. FLOAT F: rising again, the hem and wisps trailing, ready to loop back to frame 1
Keep the head, face and body size identical in every frame. If six frames will not stay consistent, draw frames 1 to 3 in a 3 by 1 row and ask me for frames 4 to 6 separately.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Ancient Dragon

_id `dragon`: the final boss, 20,000 hp, the largest enemy (radius 66), very slow; pops into 2 Stone Giants and 3 Lich Wraiths. It must read as a bigger, older, horned species than the Drake Whelp, not a recoloured whelp. Currently code-drawn._ Save as `art/spike/dragon_master.png` and `art/spike/dragon_walk.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature described below, in the exact style of the attached character sheet (it must look like it belongs on that sheet, drawn at the size of its large characters).
CREATURE: A colossal ancient dragon, the adult of the Drake Whelp: the same head shape family and amber slit eye, but far larger and heavier, about 3 heads tall in chibi proportions with a massive head and thick limbs. Deep crimson and ember-brown scales (#8F2A22 base, #B8402F highlights, #3D1410 shadows; muted, NOT bright red) with visible overlapping scale rows on the back and flanks, armoured belly plates in dull gold-ochre (#C9963A), broken and scarred horns, a heavy scowling brow ridge, a scarred snout with smoke curling from the nostrils and a faint ember-orange glow in the throat, torn veined wings with dark-crimson membrane and bone-coloured ribs and a thin warm rim light, a long spiked tail with a bone spade tip, thick clawed feet with scuffed claws. Accent: the ember-orange glow in the throat and wing veins.
POSE AND RIG RULES: a heavy stomp: full body, side view to the right, head held up and a little forward, BOTH WINGS SPREAD WIDE AND CLEAR of the torso, tail extended behind and away from the legs, feet apart with a CLEAR GAP between the legs. This image will be bent by a mesh animation, so keep the wings, tail, head and legs clearly separated from the torso with visible gaps. The creature fills about 85% of the width of a 16:9 landscape image, fully inside the frame, feet near the bottom edge. Facing the viewer's RIGHT.
DO NOT PAINT: cracks, frost, tint, armour bands, status effects, ground, shadow, props floating apart from the creature.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt W: walk cycle (optional)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the creature in the attached master pose, side view to the viewer's RIGHT.
CREATURE (identical to the master pose): A colossal ancient dragon, the adult of the Drake Whelp: the same head shape family and amber slit eye, but far larger and heavier, about 3 heads tall in chibi proportions with a massive head and thick limbs. Deep crimson and ember-brown scales (#8F2A22 base, #B8402F highlights, #3D1410 shadows; muted, NOT bright red) with visible overlapping scale rows on the back and flanks, armoured belly plates in dull gold-ochre (#C9963A), broken and scarred horns, a heavy scowling brow ridge, a scarred snout with smoke curling from the nostrils and a faint ember-orange glow in the throat, torn veined wings with dark-crimson membrane and bone-coloured ribs and a thin warm rim light, a long spiked tail with a bone spade tip, thick clawed feet with scuffed claws. Accent: the ember-orange glow in the throat and wing veins.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. CONTACT: front foot planted, wings lifting, head forward
2. DOWN: weight dropping onto the front leg, wings at their top
3. PASS: back leg swinging through, wings beginning to beat down
4. CONTACT 2: the other foot slamming down, wings fully down
5. DOWN 2: sinking, wings starting up again, tail swaying
6. PASS 2: back leg swinging through, wings rising, smoke from the nostrils
Keep the head, face and body size identical in every frame. If six frames will not stay consistent, draw frames 1 to 3 in a 3 by 1 row and ask me for frames 4 to 6 separately.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Drake Whelp (regenerate to match the sheet)

_id `ogre`, shown as Drake Whelp: the first boss, 200 hp, pops into 4 Stone Skeletons. Already in the game from a Canva image; this regenerates it to match the sheet. Keep the same pose, eye and expression as the style anchor._ Save as `art/spike/whelp_master.png`. Also attach the current `public/assets/painted/whelp.png` as an extra reference.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature described below, in the exact style of the attached character sheet (it must look like it belongs on that sheet, drawn at the size of its large characters).
CREATURE: A young drake whelp in the same pose and expression as the attached current whelp, but regenerated in the sheet's painted style: a snarling young dragon, quadruped, about 3 heads tall. Palette shifted to olive, moss and bronze (#6B7F3A, #8FA05A highlights, #3D4A22 shadows), about 30% less saturated than a candy green, with rust-orange (#C9692A) only on the horns, back spikes and wing membrane. Visible overlapping scale rows on the back and flanks, a ridged cream-bronze belly plate, veined translucent wings with a thin warm rim light and a bone-coloured frame, scuffed horns, rim-lit claws, a heavy scowling brow, a slit amber eye with a white highlight, small bared fangs. Accent: the amber eye and the rust-orange horns.
POSE AND RIG RULES: a snarling walk: full body, side view to the right, head forward, wings half-spread and CLEAR of the torso, tail extended, feet apart with a CLEAR GAP between the legs. This image will be bent by a mesh animation, so keep the wings, tail, head and legs clearly separated from the torso with visible gaps. The creature fills about 85% of the width of a 16:9 landscape image, fully inside the frame, feet near the bottom edge. Facing the viewer's RIGHT.
DO NOT PAINT: cracks, frost, tint, armour bands, status effects, ground, shadow, props floating apart from the creature.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Skeletons (regular enemies)

#### Skeleton Warrior (regenerate at higher detail)

_The main regular enemy (sword and shield). Today 82x120 px per frame; regenerate so the figure is about 250 px tall._ Attach the current `public/assets/painted/skel_warrior.png` as an extra reference for design continuity. Save as `art/spike/skel_warrior_master.png` and `art/spike/skel_warrior_walk.png`. Layer colours are off in the game, so draw ONE bone-and-leather look (no colour variants).

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature below in the exact style of the attached character sheet, as a mini-chibi.
CREATURE: A chibi skeleton warrior in the sheet's mini-chibi proportions: about 2.5 heads, an oversized cream-bone skull (#E9E2CF with core shadow #BDB197 and dark eye sockets) with narrowed glowing amber eyes, heavy angled brows carved into the bone and a toothy grim jaw. A dented riveted steel helmet (steel with white specular dashes, scratches and a leather chin strap), a shaded cracked rib cage, thin jointed bone limbs with big round joints, bony hands and feet. A round wooden shield (grain lines, an iron boss, iron studs, a dented rim) on the near arm, held forward, and a rusty short sword held low in the other hand. A tattered leather belt and a ragged cloth loin wrap. Accent: the amber eyes. The face (eye shape, brow angle, jaw) must be LOCKED identical in every frame.
POSE: a mid-stride walking pose, full body, side view to the viewer's RIGHT with the face turned slightly toward the viewer, feet apart on the same baseline. The figure fills about 85% of the height of a 4:3 image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt W: walk cycle**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the skeleton in the attached master pose.
CREATURE (identical to the master pose): A chibi skeleton warrior in the sheet's mini-chibi proportions: about 2.5 heads, an oversized cream-bone skull (#E9E2CF with core shadow #BDB197 and dark eye sockets) with narrowed glowing amber eyes, heavy angled brows carved into the bone and a toothy grim jaw. A dented riveted steel helmet (steel with white specular dashes, scratches and a leather chin strap), a shaded cracked rib cage, thin jointed bone limbs with big round joints, bony hands and feet. A round wooden shield (grain lines, an iron boss, iron studs, a dented rim) on the near arm, held forward, and a rusty short sword held low in the other hand. A tattered leather belt and a ragged cloth loin wrap. Accent: the amber eyes. The face (eye shape, brow angle, jaw) must be LOCKED identical in every frame.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. CONTACT: front foot planted, sword low and back, shield forward
2. DOWN: weight dropping onto the front leg, skull dipping
3. PASS: back leg swinging through, body at its highest
4. CONTACT 2: the other foot planted, sword swinging forward a little
5. DOWN 2: weight dropping, shield bobbing
6. PASS 2: back leg swinging through, ready to loop to frame 1
Head size, skull, eyes and gear must be identical in every frame (no frame taller or larger than the others).
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

#### Skeleton Archer (regenerate at higher detail)

_The second regular enemy (bow and arrows). Today 108x120 px per frame; regenerate so the figure is about 250 px tall._ Attach the current `public/assets/painted/skel_archer.png` as an extra reference for design continuity. Save as `art/spike/skel_archer_master.png` and `art/spike/skel_archer_walk.png`. Layer colours are off in the game, so draw ONE bone-and-leather look (no colour variants).

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: draw ONE master pose of the creature below in the exact style of the attached character sheet, as a mini-chibi.
CREATURE: A chibi hooded skeleton archer in the sheet's mini-chibi proportions: about 2.5 heads, an oversized cream-bone skull under a deep brown leather hood (#7B4A2A, highlight #A8693A, shadowed interior #1A1410) with a pointed peak and a stitched hood rim, narrowed glowing amber eyes under heavy angled brow ridges, a toothy grim jaw. A tattered layered brown cloak with a darker lining and ragged hems, a shaded cracked rib cage, thin jointed bone limbs, a leather bracer, a leather quiver with stitching stuffed with arrows fletched in cream and teal, and a tall wooden bow with a wrapped grip and a taut string held out in the near hand, no arrow nocked. Accent: the amber eyes. The face must be LOCKED identical in every frame.
POSE: a mid-stride walking pose, full body, side view to the viewer's RIGHT with the face turned slightly toward the viewer, feet apart on the same baseline. The figure fills about 85% of the height of a 4:3 image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt W: walk cycle**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame walk cycle of the skeleton in the attached master pose.
CREATURE (identical to the master pose): A chibi hooded skeleton archer in the sheet's mini-chibi proportions: about 2.5 heads, an oversized cream-bone skull under a deep brown leather hood (#7B4A2A, highlight #A8693A, shadowed interior #1A1410) with a pointed peak and a stitched hood rim, narrowed glowing amber eyes under heavy angled brow ridges, a toothy grim jaw. A tattered layered brown cloak with a darker lining and ragged hems, a shaded cracked rib cage, thin jointed bone limbs, a leather bracer, a leather quiver with stitching stuffed with arrows fletched in cream and teal, and a tall wooden bow with a wrapped grip and a taut string held out in the near hand, no arrow nocked. Accent: the amber eyes. The face must be LOCKED identical in every frame.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). A looping walk cycle. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in side view, face turned slightly toward the viewer.
FRAMES:
1. CONTACT: front foot planted, bow held low and forward
2. DOWN: weight dropping onto the front leg, hood dipping
3. PASS: back leg swinging through, body at its highest
4. CONTACT 2: the other foot planted, bow swinging a little
5. DOWN 2: weight dropping, quiver bobbing
6. PASS 2: back leg swinging through, ready to loop to frame 1
Head size, skull, eyes and gear must be identical in every frame (no frame taller or larger than the others).
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

## Characters

The game builds each tower from a **base body** plus **gear layers** (every upgrade adds or replaces a piece: hood, weapon, armour, cape). So these prompts draw the character **without** gear, with empty hands, and the iconic items from your sheet are generated later as separate pieces (see [gear sheets](#optional-gear-sheets)). Pose is a three-quarter front view facing the viewer's right; the game flips it to face targets. Each character has three prompts:

- **Prompt M**: master pose (do this first and approve it).
- **Prompt A**: attack animation, 6 frames (3 by 2 grid). The frame order matches the game's clip timing: the **release/impact frame is frame 4**.
- **Prompt B**: idle loop (4 frames) plus the special-ability pose (4 frames), 8 frames in a 4 by 2 grid.

Clip rules the cutter relies on: the leading hand is the right-most part and the head is the highest part in every frame, and the torso stays steady so gear layers do not drift.

### Knight (Fighter tower)

_The sheet Knight is the fully armoured top tier (helm, plate, lion shield, warhammer). Those are gear pieces. The base body is the man inside the armour. His face is hidden by the helm at higher tiers._ Save as `art/spike/fighter_master.png`, `art/spike/fighter_attack.png`, `art/spike/fighter_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the Knight from the sheet, before any armour: a stocky, blocky human fighter, about 3.5 heads tall, bare-headed, short dark-brown hair, strong square jaw, light tan skin, narrowed steel-blue eyes under heavy furrowed brows, stern scowl. Plain forest-green (#3F6A3A) tunic to the knees with a brown leather belt and a square brass buckle, brown leather straps crossing the chest, brown leather bracers, grey mail-textured sleeves, plain brown boots. Accent colour: forest green with a brass buckle. Both hands are EMPTY (loose open fists). NO helmet, NO armour plates, NO shield, NO sword, NO hammer, NO cape.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Knight from the sheet, before any armour: a stocky, blocky human fighter, about 3.5 heads tall, bare-headed, short dark-brown hair, strong square jaw, light tan skin, narrowed steel-blue eyes under heavy furrowed brows, stern scowl. Plain forest-green (#3F6A3A) tunic to the knees with a brown leather belt and a square brass buckle, brown leather straps crossing the chest, brown leather bracers, grey mail-textured sleeves, plain brown boots. Accent colour: forest green with a brass buckle. Both hands are EMPTY (loose open fists). NO helmet, NO armour plates, NO shield, NO sword, NO hammer, NO cape.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. GUARD: weight even, empty right hand low and forward as if gripping a sword, left arm braced forward at chest height as if holding a shield
2. COIL: right hand drawn back over the right shoulder, torso twisting back, left arm still braced
3. WIND-UP: right hand behind the head, weight on the back foot, chest open
4. IMPACT: right arm fully extended forward at chest height in a horizontal sweep, front foot planted, shoulders rotated into the swing
5. FOLLOW-THROUGH: arm swept across the body low, torso leaning over the front knee
6. RECOVER: back to the guard stance of frame 1, right hand low and forward
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Knight from the sheet, before any armour: a stocky, blocky human fighter, about 3.5 heads tall, bare-headed, short dark-brown hair, strong square jaw, light tan skin, narrowed steel-blue eyes under heavy furrowed brows, stern scowl. Plain forest-green (#3F6A3A) tunic to the knees with a brown leather belt and a square brass buckle, brown leather straps crossing the chest, brown leather bracers, grey mail-textured sleeves, plain brown boots. Accent colour: forest green with a brass buckle. Both hands are EMPTY (loose open fists). NO helmet, NO armour plates, NO shield, NO sword, NO hammer, NO cape.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: SHIELD WALL / RALLY. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. GATHER: crouch slightly, both fists drawn in to the chest
6. RAISE: stand tall, left arm lifting high overhead
7. PEAK: left arm fully raised, chest out, mouth open in a shout (or a stomp, foot slamming down)
8. SETTLE: arms lowering, weight settling back to a ready stance
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Hooded elf Ranger (Ranger tower)

_Already shipped as a painted strip. Regenerate only if you want it at the new, higher resolution so it matches the rest._ Save as `art/spike/ranger_master.png`, `art/spike/ranger_attack.png`, `art/spike/ranger_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the hooded elf Ranger from the sheet, hood DOWN: a female-presenting wood elf, about 3.2 heads tall, slim with chunky boots and hands, warm tan skin, long thin pointed ears, narrowed hazel-brown eyes with a thick lash line, heavily furrowed hostile brows, small downturned mouth, dark-brown hair in a short ponytail. Teal-green (#3F6B5A) fine scale-mail sleeves and torso under an olive tunic with tattered skirt panels and ragged hems, a brown leather chest harness with crossing straps and brass buckles, a wide dark-brown belt with a square brass buckle, brown fingerless leather gloves and bracers, knee-high brown leather boots with fold-over tops and round riveted knee plates. Accent: leaf green and teal. Both hands are EMPTY. NO hood, NO leaf mantle, NO quiver, NO bow, NO arrow.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded elf Ranger from the sheet, hood DOWN: a female-presenting wood elf, about 3.2 heads tall, slim with chunky boots and hands, warm tan skin, long thin pointed ears, narrowed hazel-brown eyes with a thick lash line, heavily furrowed hostile brows, small downturned mouth, dark-brown hair in a short ponytail. Teal-green (#3F6B5A) fine scale-mail sleeves and torso under an olive tunic with tattered skirt panels and ragged hems, a brown leather chest harness with crossing straps and brass buckles, a wide dark-brown belt with a square brass buckle, brown fingerless leather gloves and bracers, knee-high brown leather boots with fold-over tops and round riveted knee plates. Accent: leaf green and teal. Both hands are EMPTY. NO hood, NO leaf mantle, NO quiver, NO bow, NO arrow.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: standing ready, left arm extended forward gripping nothing (a bow grip), right hand relaxed at the hip
2. ANTICIPATE: right hand reaching back toward the right shoulder, left arm extended
3. FULL DRAW: left arm straight and steady, right hand pulled back to the cheek as if holding a drawn string, eyes narrowed and aimed
4. RELEASE: right hand snapped open and back past the cheek, fingers spread, left arm steady
5. FOLLOW-THROUGH: right arm swinging forward and down, head still aimed
6. RECOVER: returning to the ready pose of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded elf Ranger from the sheet, hood DOWN: a female-presenting wood elf, about 3.2 heads tall, slim with chunky boots and hands, warm tan skin, long thin pointed ears, narrowed hazel-brown eyes with a thick lash line, heavily furrowed hostile brows, small downturned mouth, dark-brown hair in a short ponytail. Teal-green (#3F6B5A) fine scale-mail sleeves and torso under an olive tunic with tattered skirt panels and ragged hems, a brown leather chest harness with crossing straps and brass buckles, a wide dark-brown belt with a square brass buckle, brown fingerless leather gloves and bracers, knee-high brown leather boots with fold-over tops and round riveted knee plates. Accent: leaf green and teal. Both hands are EMPTY. NO hood, NO leaf mantle, NO quiver, NO bow, NO arrow.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: ARROW STORM. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. CROUCH: knees bent, both hands tucked at the hips
6. ARMS WIDE: both arms thrown out wide, head up
7. PEAK: arms spread, chest out, a fierce shout
8. SETTLE: lowering back to the ready stance
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Hooded Mage (Wizard tower)

_Hood, staff and flame are gear. The base body has the hood down and empty hands. (Base colour is crimson and dusty purple, so a green key is safe; the pink flame is gear.)_ Save as `art/spike/wizard_master.png`, `art/spike/wizard_attack.png`, `art/spike/wizard_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the hooded Mage from the sheet, hood DOWN: a human mage, about 3.4 heads tall, pale skin, stern dark eyes under thick furrowed brows, a small tight mouth, a small circular pale-pink rune mark on the forehead, short dark-auburn hair swept back. Inner robe in dusty purple (#5A4F6E) with a vertical gold-embroidered centre band, wide crimson (#7A1F33) sleeves with gold-embroidered cuffs, a brown leather belt with a gold-silver buckle and a small pouch, dark boots peeking out at the hem. Accent: crimson with gold trim. Both hands are EMPTY (open, a loose grip). NO hood up, NO hat, NO cape, NO staff, NO flame, NO familiar.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded Mage from the sheet, hood DOWN: a human mage, about 3.4 heads tall, pale skin, stern dark eyes under thick furrowed brows, a small tight mouth, a small circular pale-pink rune mark on the forehead, short dark-auburn hair swept back. Inner robe in dusty purple (#5A4F6E) with a vertical gold-embroidered centre band, wide crimson (#7A1F33) sleeves with gold-embroidered cuffs, a brown leather belt with a gold-silver buckle and a small pouch, dark boots peeking out at the hem. Accent: crimson with gold trim. Both hands are EMPTY (open, a loose grip). NO hood up, NO hat, NO cape, NO staff, NO flame, NO familiar.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: right hand forward at chest height with a loose grip, left hand open at the hip
2. LIFT: right arm lifting, head tilting, robe hem stirring
3. GATHER: right hand pulled back and up, left palm raised open (do not paint any light or magic)
4. RELEASE: right arm snapped toward the target, a wrist flick, the robe flaring back
5. HOLD: the pose held, cloth settling
6. RECOVER: returning to the ready pose of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded Mage from the sheet, hood DOWN: a human mage, about 3.4 heads tall, pale skin, stern dark eyes under thick furrowed brows, a small tight mouth, a small circular pale-pink rune mark on the forehead, short dark-auburn hair swept back. Inner robe in dusty purple (#5A4F6E) with a vertical gold-embroidered centre band, wide crimson (#7A1F33) sleeves with gold-embroidered cuffs, a brown leather belt with a gold-silver buckle and a small pouch, dark boots peeking out at the hem. Accent: crimson with gold trim. Both hands are EMPTY (open, a loose grip). NO hood up, NO hat, NO cape, NO staff, NO flame, NO familiar.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: METEOR / TEMPEST. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. GATHER: both hands drawn in, head bowed
6. RAISE: both arms rising overhead, head tilting back
7. PEAK: both arms thrown up and wide, head back, robe flaring
8. SETTLE: arms lowering, robe falling back
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Paladin (Cleric tower)

_The sheet Paladin is gold plate with a sword and sun shield; the Cleric tower is a robed priest. The base body is a lighter priest-paladin; plate, mace, halo and wings are gear. The mapping is a design compromise [flagged]._ Save as `art/spike/cleric_master.png`, `art/spike/cleric_attack.png`, `art/spike/cleric_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the Paladin from the sheet, before the plate armour: a young human man, about 3.3 heads tall, bare-headed, short swept-up brown hair, bright blue eyes, a friendly confident closed smile, softly arched brows, light peach skin. A plain ivory-cream (#ECE3C8) tabard trimmed in gold with a small gold sunburst emblem on the chest, over steel mail sleeves and leggings, a brown leather belt, gold-trimmed leather bracers, gold-brown boots. Accent: gold. Both hands are EMPTY. NO plate armour, NO sword, NO mace, NO shield, NO halo, NO wings.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Paladin from the sheet, before the plate armour: a young human man, about 3.3 heads tall, bare-headed, short swept-up brown hair, bright blue eyes, a friendly confident closed smile, softly arched brows, light peach skin. A plain ivory-cream (#ECE3C8) tabard trimmed in gold with a small gold sunburst emblem on the chest, over steel mail sleeves and leggings, a brown leather belt, gold-trimmed leather bracers, gold-brown boots. Accent: gold. Both hands are EMPTY. NO plate armour, NO sword, NO mace, NO shield, NO halo, NO wings.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: right hand low at the hip, left hand open palm-up beside the shoulder
2. LIFT: right arm lifting, chin starting to rise
3. PRAY: right hand raised high overhead, chin up, eyes closed as if praying
4. RELEASE: right arm thrust straight toward the target, chest out, eyes open and fierce
5. HOLD: arm held out, the tabard flaring back
6. RECOVER: returning to the ready pose of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Paladin from the sheet, before the plate armour: a young human man, about 3.3 heads tall, bare-headed, short swept-up brown hair, bright blue eyes, a friendly confident closed smile, softly arched brows, light peach skin. A plain ivory-cream (#ECE3C8) tabard trimmed in gold with a small gold sunburst emblem on the chest, over steel mail sleeves and leggings, a brown leather belt, gold-trimmed leather bracers, gold-brown boots. Accent: gold. Both hands are EMPTY. NO plate armour, NO sword, NO mace, NO shield, NO halo, NO wings.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: DIVINE SMITE / SANCTUARY. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. HANDS TOGETHER: both hands pressed together at the chest, head bowed
6. RAISE: both arms lifting overhead
7. PEAK: both arms raised wide, head thrown back, tabard flaring
8. SETTLE: arms lowering, head bowing again
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Dwarf alchemist (Bombardier tower)

_Goggles, torch, flasks, cog and cannon are gear. The base body is the dwarf in a plain leather vest._ Save as `art/spike/bombardier_master.png`, `art/spike/bombardier_attack.png`, `art/spike/bombardier_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the Dwarf alchemist from the sheet, before gear: a short, stocky, barrel-chested dwarf, about 3 heads tall, ruddy skin with pink cheeks, blue eyes, friendly arched brows, a wide open toothy grin. A big voluminous auburn-ginger beard (#A8542A base, #D9822F highlights) in thick curls reaching the chest, a big moustache, tousled auburn hair. A brown leather vest (#6B3F22) over cream-tan shirtsleeves, a wide belt with a big square brass buckle, big brown leather boots with brass buckles. Accent: brass. Both hands are EMPTY. NO goggles, NO torch, NO potion flasks, NO cog, NO cannon, NO apron.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Dwarf alchemist from the sheet, before gear: a short, stocky, barrel-chested dwarf, about 3 heads tall, ruddy skin with pink cheeks, blue eyes, friendly arched brows, a wide open toothy grin. A big voluminous auburn-ginger beard (#A8542A base, #D9822F highlights) in thick curls reaching the chest, a big moustache, tousled auburn hair. A brown leather vest (#6B3F22) over cream-tan shirtsleeves, a wide belt with a big square brass buckle, big brown leather boots with brass buckles. Accent: brass. Both hands are EMPTY. NO goggles, NO torch, NO potion flasks, NO cog, NO cannon, NO apron.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: right arm extended forward as if aiming a hand cannon, left hand resting on an imaginary barrel
2. LEAN IN: leaning forward and squinting, left hand reaching out to light a fuse
3. BRACE: feet planted wide, shoulders hunched, left hand covering the left ear, eyes shut
4. RECOIL: torso kicked back, right arm recoiling, left arm flung up, mouth wide
5. STAGGER: stumbling back a step, left hand waving smoke away from the face
6. RECOVER: straightening up and puffing out a breath, returning to the ready pose
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Dwarf alchemist from the sheet, before gear: a short, stocky, barrel-chested dwarf, about 3 heads tall, ruddy skin with pink cheeks, blue eyes, friendly arched brows, a wide open toothy grin. A big voluminous auburn-ginger beard (#A8542A base, #D9822F highlights) in thick curls reaching the chest, a big moustache, tousled auburn hair. A brown leather vest (#6B3F22) over cream-tan shirtsleeves, a wide belt with a big square brass buckle, big brown leather boots with brass buckles. Accent: brass. Both hands are EMPTY. NO goggles, NO torch, NO potion flasks, NO cog, NO cannon, NO apron.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: KABOOM / EARTHSHAKER. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. HEAVE: crouching, both arms hugging a heavy invisible barrel
6. LIFT: standing, both arms pressing the barrel overhead
7. PEAK: arms fully overhead (or one boot lifted high ready to stomp), face red, teeth bared
8. SLAM: boot slamming down (or arms throwing forward), knees bent, shoulders jolting
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Dryad (Frost Druid tower)

_Antlers, staff, orb and the two spirit cats are gear and companions. The sheet Dryad is nature-green; the tower is the FROST Druid, so the glow here is pale ice-blue. The two blue spirit cats on the sheet are the Snow Fox companion (see the companion prompts)._ Save as `art/spike/druid_master.png`, `art/spike/druid_attack.png`, `art/spike/druid_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the Dryad from the sheet, without antlers: a tall forest spirit, female, about 3.4 heads tall, pointed ears, pale olive-green skin, glowing pale ice-blue eyes, a stern serene face, long moss-green hair. A bark-plate bodice in brown with crossing vine straps, a long layered robe of moss and leaves in olive green fading to a brown bark-textured hem, an overlapping leaf mantle on the shoulders in olive and yellow-green, and a few frost-white edge highlights on the leaves. Accent: pale ice blue (eyes). Both hands are EMPTY. NO antlers, NO circlet, NO staff, NO orb, NO cats.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Dryad from the sheet, without antlers: a tall forest spirit, female, about 3.4 heads tall, pointed ears, pale olive-green skin, glowing pale ice-blue eyes, a stern serene face, long moss-green hair. A bark-plate bodice in brown with crossing vine straps, a long layered robe of moss and leaves in olive green fading to a brown bark-textured hem, an overlapping leaf mantle on the shoulders in olive and yellow-green, and a few frost-white edge highlights on the leaves. Accent: pale ice blue (eyes). Both hands are EMPTY. NO antlers, NO circlet, NO staff, NO orb, NO cats.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: right hand low at the side, left hand open
2. BREATHE IN: shoulders rising, right hand lifting, leaves stirring
3. GATHER: right hand overhead, left hand sweeping a circle, cloak pulled inward
4. PULSE: both arms thrown wide, the cloak flaring outward, eyes wide (every frame must read when mirrored, so keep the pose balanced)
5. HOLD: leaves and hair drifting, arms slowly lowering
6. RECOVER: returning to the ready pose of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Dryad from the sheet, without antlers: a tall forest spirit, female, about 3.4 heads tall, pointed ears, pale olive-green skin, glowing pale ice-blue eyes, a stern serene face, long moss-green hair. A bark-plate bodice in brown with crossing vine straps, a long layered robe of moss and leaves in olive green fading to a brown bark-textured hem, an overlapping leaf mantle on the shoulders in olive and yellow-green, and a few frost-white edge highlights on the leaves. Accent: pale ice blue (eyes). Both hands are EMPTY. NO antlers, NO circlet, NO staff, NO orb, NO cats.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: ABSOLUTE ZERO. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. ARMS SWEEPING: both arms sweeping wide and low, head bowed
6. RISING: arms lifting in a wide arc, cloak lifting
7. PEAK: both arms thrown wide overhead, head back, leaves flaring outward
8. SETTLE: arms lowering slowly, leaves falling
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Hooded Rogue (Rogue tower)

_Hood, face mask, cloak, satchel and daggers are gear. The base body is the bare-headed rogue in dark leathers._ Save as `art/spike/rogue_master.png`, `art/spike/rogue_attack.png`, `art/spike/rogue_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the hooded Rogue from the sheet, hood and mask OFF: a lean, agile human rogue in a low crouched stance, about 3.5 heads tall, bare head with short black-brown hair, narrowed intense brown-hazel eyes with white specular dots, thin angled dark brows, a determined smirk, pale skin. A layered black leather jerkin with straps, belts with silver buckles and pouches, dark shoulder plates, dark fingerless gloves, dark bracers, dark leggings, black boots with buckle straps. Colours: charcoal blue-black (#2B2E3A) with silver buckles as the accent. Both hands are EMPTY. NO hood, NO mask, NO cloak, NO satchel, NO daggers.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded Rogue from the sheet, hood and mask OFF: a lean, agile human rogue in a low crouched stance, about 3.5 heads tall, bare head with short black-brown hair, narrowed intense brown-hazel eyes with white specular dots, thin angled dark brows, a determined smirk, pale skin. A layered black leather jerkin with straps, belts with silver buckles and pouches, dark shoulder plates, dark fingerless gloves, dark bracers, dark leggings, black boots with buckle straps. Colours: charcoal blue-black (#2B2E3A) with silver buckles as the accent. Both hands are EMPTY. NO hood, NO mask, NO cloak, NO satchel, NO daggers.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: low crouch, both hands near the belt
2. CROSS: right arm crossing the body, weight shifting back
3. COIL: right arm cocked far back, torso twisted, left arm pointing at the target
4. THROW: right arm whipped forward with a wrist flick, torso unwinding
5. FOLLOW: right arm across the body, the back foot stepping forward
6. SNAP BACK: returning to the low crouch of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the hooded Rogue from the sheet, hood and mask OFF: a lean, agile human rogue in a low crouched stance, about 3.5 heads tall, bare head with short black-brown hair, narrowed intense brown-hazel eyes with white specular dots, thin angled dark brows, a determined smirk, pale skin. A layered black leather jerkin with straps, belts with silver buckles and pouches, dark shoulder plates, dark fingerless gloves, dark bracers, dark leggings, black boots with buckle straps. Colours: charcoal blue-black (#2B2E3A) with silver buckles as the accent. Both hands are EMPTY. NO hood, NO mask, NO cloak, NO satchel, NO daggers.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: SMOKE BOMB / ASSASSINATE. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. SLAM: right arm slamming down at the ground, crouching very low
6. CROUCH: tucked low, head down, one hand on the ground
7. LUNGE: launching forward, right arm thrust out, body stretched long
8. SETTLE: landing in a crouch, arms spread for balance
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Clockwork golem (Ballista Crew)

_The Ballista Crew tower is a siege machine, not a humanoid, so the golem is a crew member standing beside it, and the clockwork spider has no tower slot yet. This mapping is a design compromise [flagged]. The animation is the load action._ Save as `art/spike/ballista_crew_master.png`, `art/spike/ballista_crew_attack.png`, `art/spike/ballista_crew_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: BASE BODY of the Clockwork golem from the sheet: a brass automaton, about 3 heads tall, a spherical head with a notched gear-tooth ring around the top edge, rivets and two round glowing amber (#FFC13A with a #FFF6C0 core) lens eyes in dark rings, a small round vent mouth. A barrel-shaped riveted torso in brass plates (#B8812A, highlight #F0C25A, shadow #5E3C12) with exposed pistons and cog details, ball-joint shoulders with small gears, segmented tubular arms with ring joints and pipes, slim tubular legs with knee pistons and flat brass boot feet. Instead of the forked wrenches, simple three-fingered brass gripper hands, EMPTY. Accent: amber glow in the eyes. NO wrenches, NO spider.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: action animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame action animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Clockwork golem from the sheet: a brass automaton, about 3 heads tall, a spherical head with a notched gear-tooth ring around the top edge, rivets and two round glowing amber (#FFC13A with a #FFF6C0 core) lens eyes in dark rings, a small round vent mouth. A barrel-shaped riveted torso in brass plates (#B8812A, highlight #F0C25A, shadow #5E3C12) with exposed pistons and cog details, ball-joint shoulders with small gears, segmented tubular arms with ring joints and pipes, slim tubular legs with knee pistons and flat brass boot feet. Instead of the forked wrenches, simple three-fingered brass gripper hands, EMPTY. Accent: amber glow in the eyes. NO wrenches, NO spider.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE A: standing, arms hanging at the sides, head level, eyes glowing
2. IDLE B: a tiny shoulder rise, head tilted slightly, the gear ring turning
3. REACH: right arm reaching down and back for a heavy bolt, torso leaning
4. LIFT: lifting the bolt up, both gripper hands holding a long invisible heavy bolt at waist height, knees bent
5. SHOVE: both arms thrusting the bolt forward, torso leaning into it, a puff of steam at the knee piston
6. STEP BACK: stepping back and straightening up, arms returning to the sides
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): BASE BODY of the Clockwork golem from the sheet: a brass automaton, about 3 heads tall, a spherical head with a notched gear-tooth ring around the top edge, rivets and two round glowing amber (#FFC13A with a #FFF6C0 core) lens eyes in dark rings, a small round vent mouth. A barrel-shaped riveted torso in brass plates (#B8812A, highlight #F0C25A, shadow #5E3C12) with exposed pistons and cog details, ball-joint shoulders with small gears, segmented tubular arms with ring joints and pipes, slim tubular legs with knee pistons and flat brass boot feet. Instead of the forked wrenches, simple three-fingered brass gripper hands, EMPTY. Accent: amber glow in the eyes. NO wrenches, NO spider.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: OVERDRIVE (Barrage). One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. WIND UP: arms drawn in, head tilted down, eyes brightening
6. FRANTIC A: arms blurring forward at chest height, torso leaning
7. FRANTIC B: arms blurring the other way, steam at both knee pistons
8. SETTLE: slowing to a stop, arms lowering, a puff of steam
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Jester (Guild Treasury mascot)

_The Guild Treasury is a 28-unit building with no attack, not a character, so the Jester is an idle mascot standing on the plinth beside the vault. He is drawn complete (cap, doublet, lute); there is no gear split. This mapping is a design compromise [flagged]._ Save as `art/spike/jester_master.png`, `art/spike/jester_attack.png`, `art/spike/jester_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: The Jester from the sheet, drawn complete: a cheerful elf-eared bard-jester, about 3 heads tall with a large head. A floppy three-pronged jester cap, one prong red (#D6382C), one blue (#2D5FB8), one yellow (#F0B830), each ending in a small gold bell, with a seamed band. Pointed ears, light peach skin, pink cheeks, big blue eyes, a huge toothy grin, a small brown hair tuft at the brow. A split-colour doublet: red half on the viewer's left with gold trim, blue half on the viewer's right with yellow trim, golden-yellow sleeves (#E6A93A) with cuffs, a brown leather belt, tan-brown tights, brown pointed leather boots. Holds a round-bodied golden-brown wooden lute with a dark sound hole, several strings and a neck angled up toward the viewer's right, left hand on the neck, right hand strumming. Accent: the red-blue-yellow cap.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt A: action animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame action animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The Jester from the sheet, drawn complete: a cheerful elf-eared bard-jester, about 3 heads tall with a large head. A floppy three-pronged jester cap, one prong red (#D6382C), one blue (#2D5FB8), one yellow (#F0B830), each ending in a small gold bell, with a seamed band. Pointed ears, light peach skin, pink cheeks, big blue eyes, a huge toothy grin, a small brown hair tuft at the brow. A split-colour doublet: red half on the viewer's left with gold trim, blue half on the viewer's right with yellow trim, golden-yellow sleeves (#E6A93A) with cuffs, a brown leather belt, tan-brown tights, brown pointed leather boots. Holds a round-bodied golden-brown wooden lute with a dark sound hole, several strings and a neck angled up toward the viewer's right, left hand on the neck, right hand strumming. Accent: the red-blue-yellow cap.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. STRUM A: lute held, right hand strumming down, hat bells swinging left
2. STRUM B: right hand strumming up, hat bells swinging right, a happy sway
3. STRUM C: right hand strumming down, shoulders bobbing, head tilted
4. STRUM D: right hand strumming up, the cap prongs bouncing
5. BLINK: eyes closed in a big grin, head thrown back slightly
6. BEAT: a foot tap, the lute lifted a little, grin widening
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The Jester from the sheet, drawn complete: a cheerful elf-eared bard-jester, about 3 heads tall with a large head. A floppy three-pronged jester cap, one prong red (#D6382C), one blue (#2D5FB8), one yellow (#F0B830), each ending in a small gold bell, with a seamed band. Pointed ears, light peach skin, pink cheeks, big blue eyes, a huge toothy grin, a small brown hair tuft at the brow. A split-colour doublet: red half on the viewer's left with gold trim, blue half on the viewer's right with yellow trim, golden-yellow sleeves (#E6A93A) with cuffs, a brown leather belt, tan-brown tights, brown pointed leather boots. Holds a round-bodied golden-brown wooden lute with a dark sound hole, several strings and a neck angled up toward the viewer's right, left hand on the neck, right hand strumming. Accent: the red-blue-yellow cap.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: CHEER (round-end bonus). One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. TOSS: one hand flicking a gold coin up (draw the coin small), grin wide
6. CATCH: other hand reaching up to catch it, body leaning
7. BOW: a deep theatrical bow, cap sweeping forward, lute held to the side
8. RECOVER: standing tall again with a wink
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Orc berserker (reserve: Barbarian tower, not in the game yet)

_Reserve art for a deferred Barbarian tower. Gear split is not decided yet, so only the axe is left out._ Save as `art/spike/orc_master.png`, `art/spike/orc_attack.png`, `art/spike/orc_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: The Orc berserker from the sheet, without the axe: a hulking grey-green orc (#6B7F56, highlight #8FA36E, shadow #3F4D38), about 3.3 heads tall with shoulders about 2.6 times the head width and thick limbs. A heavy brow shelf, small beady dark eyes with an amber glint, a flat wide nose, a broad jaw, a scowling mouth with two small yellow-white tusks pointing up from the lower lip. Black hair slicked back into a topknot. A huge shaggy fur mantle over the shoulders and chest (tawny #A8845A, cream tufts, dark shadow, jagged clumped edge) falling like a vest, exposed chest and arms with red tribal war-paint swirls (#B8332E) and scars, a wide brown leather belt with a white bone skull buckle, leather harness straps, wrapped leather bracers with brass studs, fur-cuffed brown boots with bare grey-green toes. Accent: red war-paint. Both hands are EMPTY big fists. NO axe.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The Orc berserker from the sheet, without the axe: a hulking grey-green orc (#6B7F56, highlight #8FA36E, shadow #3F4D38), about 3.3 heads tall with shoulders about 2.6 times the head width and thick limbs. A heavy brow shelf, small beady dark eyes with an amber glint, a flat wide nose, a broad jaw, a scowling mouth with two small yellow-white tusks pointing up from the lower lip. Black hair slicked back into a topknot. A huge shaggy fur mantle over the shoulders and chest (tawny #A8845A, cream tufts, dark shadow, jagged clumped edge) falling like a vest, exposed chest and arms with red tribal war-paint swirls (#B8332E) and scars, a wide brown leather belt with a white bone skull buckle, leather harness straps, wrapped leather bracers with brass studs, fur-cuffed brown boots with bare grey-green toes. Accent: red war-paint. Both hands are EMPTY big fists. NO axe.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: both fists at the sides, shoulders hunched, glaring forward
2. ANTICIPATE: right arm drawn back over the shoulder as if lifting a huge axe, torso twisting
3. WIND-UP: right arm high overhead, back arched, mouth roaring
4. IMPACT: right arm slamming down and forward in a heavy chop, front foot stamped, fur mantle flying
5. FOLLOW-THROUGH: arm low, bent over the front knee, shoulders rolling forward
6. RECOVER: heaving back upright, fists at the sides
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The Orc berserker from the sheet, without the axe: a hulking grey-green orc (#6B7F56, highlight #8FA36E, shadow #3F4D38), about 3.3 heads tall with shoulders about 2.6 times the head width and thick limbs. A heavy brow shelf, small beady dark eyes with an amber glint, a flat wide nose, a broad jaw, a scowling mouth with two small yellow-white tusks pointing up from the lower lip. Black hair slicked back into a topknot. A huge shaggy fur mantle over the shoulders and chest (tawny #A8845A, cream tufts, dark shadow, jagged clumped edge) falling like a vest, exposed chest and arms with red tribal war-paint swirls (#B8332E) and scars, a wide brown leather belt with a white bone skull buckle, leather harness straps, wrapped leather bracers with brass studs, fur-cuffed brown boots with bare grey-green toes. Accent: red war-paint. Both hands are EMPTY big fists. NO axe.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: WAR CRY. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. INHALE: chest swelling, both fists drawn in
6. ROAR A: head back, mouth wide, both fists raised
7. ROAR B: both fists pounding the chest, mantle shaking
8. SETTLE: lowering, panting
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Horned Warlock (reserve: not in the game yet)

_Reserve art for a deferred Warlock tower. Gear split is not decided yet, so only the staff is left out; the horns stay on the character._ Save as `art/spike/warlock_master.png`, `art/spike/warlock_attack.png`, `art/spike/warlock_idle_special.png`.

**Prompt M: master pose**

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: redraw the character below as ONE master pose, in the exact style of the attached character sheet (same outline, shading, proportions and finish as the sheet's large characters).
CHARACTER: The horned Warlock from the sheet, without the staff: a slender dark-armoured caster, about 3.5 heads tall. An angular pale lavender-white face (#D8D4E8), sharp black brows slanted inward, dark slit eyes with pale highlights, small dark-purple lips, a cold haughty expression, long black hair behind. Two large curved black-purple horns (#2A2033 with #5A4672 highlights) sweeping up and outward. Black charcoal plate armour (#2B2D38 with #5E6272 highlights) with silver filigree trim, a high flared collar, spiked angular flared pauldrons, a small violet-pink gem brooch on the chest, segmented tassets, dark gauntlets, black greaves and pointed boots, a long dark-purple cape (#4A2A5A) with a lighter lining. Accent: a violet gem. Both hands are EMPTY. NO staff, NO crystal.
POSE: a neutral ready stance, full body, three-quarter front view facing the viewer's RIGHT, feet shoulder-width apart on the same baseline, arms relaxed with the hands empty. The figure fills about 85% of the height of a 3:4 portrait image.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt A: attack animation (6 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame attack animation of the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The horned Warlock from the sheet, without the staff: a slender dark-armoured caster, about 3.5 heads tall. An angular pale lavender-white face (#D8D4E8), sharp black brows slanted inward, dark slit eyes with pale highlights, small dark-purple lips, a cold haughty expression, long black hair behind. Two large curved black-purple horns (#2A2033 with #5A4672 highlights) sweeping up and outward. Black charcoal plate armour (#2B2D38 with #5E6272 highlights) with silver filigree trim, a high flared collar, spiked angular flared pauldrons, a small violet-pink gem brooch on the chest, segmented tassets, dark gauntlets, black greaves and pointed boots, a long dark-purple cape (#4A2A5A) with a lighter lining. Accent: a violet gem. Both hands are EMPTY. NO staff, NO crystal.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. READY: right hand held out at chest height, left hand at the side, cold stare
2. LIFT: right arm lifting, the cape stirring
3. GATHER: right hand drawn back, left hand raised open, head tilting
4. RELEASE: right arm thrust toward the target, fingers spread, the cape snapping back
5. HOLD: arm held out, the cape settling
6. RECOVER: returning to the ready pose of frame 1
Draw only the body and its empty hands; do not paint weapons, spell light, projectiles, impact effects or motion lines (the game adds those). Keep the leading hand the right-most part of the figure and the head the highest part in every frame.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

**Prompt B: idle + special (8 frames)**

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: an idle loop and a special-ability pose for the character in the attached master pose (base body only, hands empty, no gear).
CHARACTER (identical to the master pose): The horned Warlock from the sheet, without the staff: a slender dark-armoured caster, about 3.5 heads tall. An angular pale lavender-white face (#D8D4E8), sharp black brows slanted inward, dark slit eyes with pale highlights, small dark-purple lips, a cold haughty expression, long black hair behind. Two large curved black-purple horns (#2A2033 with #5A4672 highlights) sweeping up and outward. Black charcoal plate armour (#2B2D38 with #5E6272 highlights) with silver filigree trim, a high flared collar, spiked angular flared pauldrons, a small violet-pink gem brooch on the chest, segmented tassets, dark gauntlets, black greaves and pointed boots, a long dark-purple cape (#4A2A5A) with a lighter lining. Accent: a violet gem. Both hands are EMPTY. NO staff, NO crystal.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 8 frames of the SAME single character in a grid of 4 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 8). Row 1 (frames 1 to 4) is a looping IDLE. Row 2 (frames 5 to 8) is the SPECIAL ABILITY: DARK RITUAL. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: to the viewer's RIGHT in a three-quarter front view.
FRAMES:
1. IDLE 1: standing ready and relaxed, weight even
2. IDLE 2: breathing in, shoulders and chest rising slightly, cloth or hair lifting a touch
3. IDLE 3: holding the breath, a blink with eyes closed, cloth or hair shifting slightly
4. IDLE 4: breathing out, shoulders settling, ready to loop back to frame 1
5. BOW: head bowed, both hands crossed at the chest
6. RAISE: both arms lifting, head rising
7. PEAK: both arms thrown wide, head back, cape flaring
8. SETTLE: arms lowering, head bowing again
Idle frames must be very close to each other (a subtle breathing loop). Draw only the body; no weapons, spell light or effects.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

## Companions

Pets and familiars for the Ranger, Wizard and Frost Druid. Each is a 6-frame grid: 2 idle, 3 attack (crouch, strike where damage lands, recover) and 1 alert. Right-facing, same rules as above. Save as `art/spike/<id>.png`. If a pet's identity drifts between frames, generate frame 1 alone first and attach it as a reference.

### Wolf pup (Ranger)

Save as `art/spike/pet_wolfpup.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a small wolf pup, about 2 heads long, big paws, big ears, a fluffy grey-brown coat with cream muzzle and chest, bright amber eyes, a cute but fierce snarl. Accent: amber eyes. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Dire wolf (Ranger)

Save as `art/spike/pet_direwolf.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a large dire wolf, shaggy dark grey and black coat with silver tufts, scarred muzzle, glowing amber eyes, heavy paws, a thick ruff. Accent: amber eyes. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Owlbear (Ranger; SRD monster)

Save as `art/spike/pet_owlbear.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a chibi owlbear, a bear body with an owl's head: brown fur, tan feathered face disc, a hooked cream beak, huge round amber eyes with heavy brows, big clawed paws. Accent: amber eyes. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Elder owlbear (Ranger; SRD monster)

Save as `art/spike/pet_owlbear_elder.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a huge elder owlbear, grizzled grey-brown fur and rough feathers, scarred beak, a broken tuft, one cloudy scar over an amber eye, enormous claws, a battle-worn look. Accent: amber eyes. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Owl familiar (Wizard)

Save as `art/spike/pet_owl.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a small round chibi owl, warm brown and cream feathers, big round golden eyes with heavy brows, ear tufts, wings that can open. Accent: golden eyes. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Raven familiar (Wizard)

Save as `art/spike/pet_raven.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a chibi raven, glossy blue-black feathers with a purple sheen, a sharp grey beak, a small bright violet eye, ragged wing tips. Accent: violet eye. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Astral spirit (Wizard)

Save as `art/spike/pet_astral.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a small floating spirit wisp with a vaguely owl-like shape, translucent pale-violet body with a cream core, two bright eyes, a trailing curl of tail, tiny star specks. Accent: violet glow (a soft inner glow, with a thin darker outline). Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```

### Snow fox (Frost Druid; the sheet's blue spirit cat)

Save as `art/spike/pet_snowfox.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a small translucent glowing pale-blue spirit fox-cat as on the sheet's Dryad: seated-ready, pointed ears, a long curled tail, large round eyes, deep-blue outline (#16407A), a body of pale ice blue (#5FD4FF with #B8F0FF highlights). Accent: ice blue. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Frost wolf (Frost Druid)

Save as `art/spike/pet_frostwolf.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a lean frost wolf, pale blue-white coat with icy blue shadows and frosty tufts, sharp pale-blue eyes, a long muzzle, tiny ice crystals on the shoulders. Accent: ice blue. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Frost bear (Frost Druid)

Save as `art/spike/pet_frostbear.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a big chibi frost bear, thick off-white fur with blue-grey shadows, icicle-like claws, ice crystals on the back, calm pale-blue eyes under heavy brows. Accent: ice blue. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

### Frost wyrm (Frost Druid)

Save as `art/spike/pet_frostwyrm.png`.

```text
STYLE: identical to the attached character sheet and master pose: hand-inked and painted chibi fantasy, near-black warm-brown outline (about 1.5% of figure height, thicker on the shadow side, thinner inside), 4-step painted shading lit from the viewer's upper left, hairline detail, heroic chibi proportions (about 3.3 heads), big hands and boots, earthy palette with one saturated accent. Not pixel art, not flat vector, no ground shadow, no text.

TASK: a 6-frame animation sheet of the creature below, in the exact style of the attached character sheet (same outline, shading and finish; it is a companion for the sheet's heroes).
CREATURE: a small serpentine frost wyrm with two front legs, pale blue-white scales with darker blue ridges, a crest of ice spikes, bright pale-blue eyes, a wide mouth that can open to breathe a cone of cold (draw the breath as a short plain cold mist, no heavy effects). Accent: ice blue. Chibi proportions, big expressive eyes with heavy brows, oversized paws or wings, thick outline.
LAYOUT (strict): ONE image, 16:9 landscape. Exactly 6 frames of the SAME single character in a grid of 3 columns by 2 rows (equal-size cells, reading left to right then top to bottom = frame 1 to 6). One animation, frame 1 to frame 6. One full-body figure per cell, complete and uncropped, at least 8% empty margin around each figure, nothing touching a cell edge. Every figure has the SAME scale (same head size, same body height) and stands on the SAME baseline row inside its cell (feet level). Face, hair, outfit, colours and proportions are IDENTICAL in every frame; use the attached master pose as the identity reference. Facing: the viewer's RIGHT in a side or three-quarter view.
FRAMES:
1. IDLE A: standing alert, breathing in, tail or ears settled
2. IDLE B: breathing out, a small ear or tail flick
3. CROUCH: lowering and coiling to strike
4. STRIKE: lunging forward with the bite or maul at full extension (the frame where damage lands)
5. RECOVER: pulling back, settling after the strike
6. ALERT: head up, scanning, ready to loop back to the idle
Do not paint bite effects, motion lines or impact marks.
BACKGROUND: flat pure magenta #FF00FF filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use magenta, pink or purple-pink anywhere in the character.
```

## How the current art compares to your sheet

Judged by independent readers looking at your sheet and the shipped files (see the audit in `docs/ART_PROGRESS.md`):

| Asset                                           | Match             | Main gaps                                                                                               | Fix                                                 |
| ----------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Drake Whelp                                     | partial (closest) | palette too candy-saturated; scales and wing veins missing; outline thin and greenish; uniform weight   | regenerate with the whelp prompt above              |
| Skeleton Archer                                 | partial           | flat cloth, thin bow and arrows, face drifts between frames, about a third of the sheet's pixel density | regenerate at about 250 px with the archer prompts  |
| Skeleton Warrior                                | partial           | flat two-tone shading, no rivets or stitching, plain shield disc, frame 4 slightly larger than the rest | regenerate at about 250 px with the warrior prompts |
| Troll, Stone Giant, Lich Wraith, Ancient Dragon | far               | code-drawn flat vector shapes with fixed 2 px strokes and dot eyes; the dragon is weaker than the whelp | replace with painted images from the boss prompts   |

The map is now richer and animated but still brighter and more saturated than your sheet's earthy palette; say if you want it toned toward the sheet.

## Optional: gear sheets

Upgrades add gear as separate pieces (weapons, headgear, capes, armour). Once a base body is approved, generate each tower's gear as a sheet of props on the same flat key colour. Template (fill in the item list from `src/core/data/towers/<id>.ts`; I can generate the exact lists per tower for you):

```text
STYLE (match the attached character sheet exactly): premium mobile-game character illustration, hand-inked and digitally painted "chibi fantasy" look. Not pixel art, not flat vector, not a 3D render, not anime.
OUTLINE: a closed, continuous near-black warm-brown ink contour (#1C1411; never pure black, never coloured or white), about 1.5% of the figure's height on the outer silhouette, slightly heavier on the shadow side (viewer's right and underneath) and tapering to points at corners. Thinner interior contour lines (about half weight) for plates, folds, fingers and hood rims. Hairline engraving (about 1 px) for stitches, rivets, scratches, fur strands and leaf veins.
SHADING: painted cel and gradient hybrid, 4 value steps per material: base colour, one hue-shifted cooler core shadow (not grey), a deep occlusion shadow in recesses (inside hoods, under chins and pauldrons, between plates and fingers) and a highlight step. Crisp near-white specular dashes on metal edges, gems and eyes. Light comes from the viewer's upper left at about 45 degrees: highlights on the viewer's-left sides, shadow on the right and undersides. No coloured rim light, no bloom, no cast shadow, no ground shadow.
PROPORTIONS: heroic chibi, about 3.2 to 3.5 heads tall (head about 30% of the height), wide rounded head, big mitten-like hands with readable fingers, chunky boots, short thick legs, props drawn oversized.
FACES: big expressive almond eyes with a thick dark upper lash line, white sclera, one white highlight dot, no lower lashes, no anime sparkle. Thick wedge brows (hard inward-down for hostile characters, softly arched for friendly ones), a tiny nose tick, a small mouth.
MATERIALS: steel is blue-grey with hard facets, rivets, scratches and white specular dashes; leather is warm brown with stitching and brass buckles; fur is tawny clumps with a jagged silhouette; cloth has smooth large folds in 3 tones with gold-ochre trim; wood and bark show grain lines and knots; brass shows rivets and cog teeth. High detail at hairline weight but LOW-contrast detail, so the silhouette and big colour blocks read first when the figure is shrunk to phone size.
PALETTE: earthy, mid-saturation base colours (steel greys, leather browns, forest and moss greens, burgundy, bronze) with exactly ONE saturated accent per character. Darkest values are warm dark brown or blue-black; whites are cream (#ECE3C8), pure white only in tiny specular dots. Glows: white-hot core, then the saturated hue, then a thin darker outer rim, small halo, never washing over the figure.
ORIGINALITY: original generic fantasy design only; no copyrighted characters, creatures, logos or trademarks.
AVOID: pixel art, flat shapes with no shading, thin or sketchy or coloured outlines, realistic proportions, tiny hands, anime eyes, ground or drop shadows, backgrounds, scenery, text, labels, watermarks, UI frames, photoreal textures, watercolour washes, neon bloom.

TASK: a prop sheet of fantasy equipment for the character in the attached master pose, drawn in the exact style of the attached character sheet. Draw EACH item separately, large, isolated, upright or pointing up-right, in a clean grid with clear space between items, no item touching another, no character, no hands holding them.
ITEMS (one per cell, in this order): <list the items, e.g. 3 bows, 3 quivers, 2 hoods, 3 arrows>
Each item has the sheet's outline, 4-step shading, materials and one accent colour; later tiers look richer (more metal, gems, trim).
BACKGROUND: flat pure chroma-key green #00FF00 filling the entire image, with no gradient, no vignette, no floor line, no ground, no cast shadow, no grid lines, no frame numbers, no text. Do not use bright green anywhere in the character.
```
