# Game Design Document: Arcane Ramparts

## Pitch

A classic layered-pop tower defense with a heroic fantasy party. Slimes split into smaller slimes, bosses spill their cargo, and every tower upgrade visibly re-equips the hero.

## Core loop

Place towers → start a round → enemies follow the road → popping layers earns gold → buy upgrades between and during rounds → survive to the final round (Easy 40, Medium 60, Hard 80), then continue in freeplay.

## Enemies (`src/core/data/enemies.ts`)

| Enemy                                         | Plays the role of     | Notes                                  |
| --------------------------------------------- | --------------------- | -------------------------------------- |
| Green → Blue → Amber → Violet → Crimson Slime | basic layers          | speed rises with each layer            |
| Shadow Ooze                                   | black                 | immune to blast and fire               |
| Frost Ooze                                    | white                 | immune to cold                         |
| Warded Ooze                                   | purple                | immune to arcane, fire and radiant     |
| Iron Ooze                                     | lead                  | immune to piercing and slashing        |
| Storm Ooze                                    | zebra                 | immune to blast and cold               |
| Prismatic Ooze                                | rainbow               |                                        |
| Stone Ooze                                    | ceramic               | 10 HP shell                            |
| Ogre Brute                                    | boss tier 1           | spills 4 Stone                         |
| Troll Chieftain                               | boss tier 2           | releases 4 Ogres                       |
| Stone Giant                                   | boss tier 3           | releases 4 Trolls                      |
| Lich Wraith                                   | fast invisible boss   | immune to piercing, slashing and blast |
| Ancient Dragon                                | final boss (freeplay) | releases 2 Giants and 3 Liches         |

Modifiers: **Invisible** (needs True Sight), **Regenerating** (regrows layers after 2.5 s without damage), **Armored** (shells have double HP).

## Towers (`src/core/data/towers/`)

There are 9 towers, each with 3 paths × 5 tiers. Crosspath rule: at most two paths may be upgraded, and only one of them past tier 2. Tier 4/5 upgrades often unlock a tap-to-use ability.

| Tower            | Role                            | Paths                                             |
| ---------------- | ------------------------------- | ------------------------------------------------- |
| Fighter          | melee sweep                     | Blade / Shield / Warbanner (support)              |
| Ranger           | arrows                          | Volley / Marksman / Beastmaster                   |
| Rogue            | daggers, True Sight             | Blades / Assassin / Guild (traps, income)         |
| Wizard           | homing missiles                 | Evocation (fire) / Storm (lightning) / Divination |
| Dwarf Bombardier | blast                           | Big Bombs / Cluster / Concussion                  |
| Frost Druid      | freeze aura, can stand on water | Permafrost / Blizzard / Wild                      |
| Ballista Crew    | unlimited range                 | Heavy Bolts / Repeater / Supply                   |
| Cleric           | radiant beam, support           | Light / Blessing / Sanctuary                      |
| Guild Treasury   | income                          | Vault / Bank / Market                             |

## Gear system

Every upgrade equips new gear on the character. Paths own disjoint slots (e.g. Fighter: Blade → `mainHand`+`head`, Shield → `offHand`+`body`, Warbanner → `back`+`ground`). Any two paths therefore combine visually. A higher tier replaces the lower tier's piece in the same slot.

## Economy

- Start with $650.
- Each popped layer pays $1, tapering after round 50.
- End-of-round bonus is 100 + round number, plus income from towers.
- Selling refunds 70% of what was spent.

## Maps

- Goblin Glade (beginner)
- Sunken Crypt (intermediate, water)
- Dragon's Pass (advanced, two roads)
