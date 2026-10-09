import type { DamageType } from '../types';

export type EnemyId =
  | 'green'
  | 'blue'
  | 'amber'
  | 'violet'
  | 'crimson'
  | 'shadow'
  | 'frost'
  | 'warded'
  | 'iron'
  | 'storm'
  | 'prismatic'
  | 'stone'
  | 'ogre'
  | 'troll'
  | 'giant'
  | 'lich'
  | 'dragon';

export interface EnemyDef {
  id: EnemyId;
  name: string;
  /** Hits needed to break this layer. */
  hp: number;
  /** Speed in world units per second. */
  speed: number;
  /** World-unit collision radius. */
  radius: number;
  immune: readonly DamageType[];
  children: readonly { id: EnemyId; count: number }[];
  /** Boss-class: cannot be frozen, uses boss damage multipliers. */
  boss?: boolean;
  /** Shell-class (stone, iron and bosses): doubled HP when Armored. */
  shell?: boolean;
  /** Always invisible regardless of modifiers. */
  invisible?: boolean;
  /** Short description for the in-game bestiary / tooltips. */
  blurb: string;
}

const BASE = 100; // speed of the weakest slime (world units / s)

export const ENEMIES: Record<EnemyId, EnemyDef> = {
  green: {
    id: 'green',
    name: 'Green Slime',
    hp: 1,
    speed: BASE,
    radius: 13,
    immune: [],
    children: [],
    blurb: 'A wobbling blob of goo. One hit pops it.',
  },
  blue: {
    id: 'blue',
    name: 'Blue Slime',
    hp: 1,
    speed: BASE * 1.4,
    radius: 14,
    immune: [],
    children: [{ id: 'green', count: 1 }],
    blurb: 'Pops into a Green Slime.',
  },
  amber: {
    id: 'amber',
    name: 'Amber Slime',
    hp: 1,
    speed: BASE * 1.8,
    radius: 15,
    immune: [],
    children: [{ id: 'blue', count: 1 }],
    blurb: 'Pops into a Blue Slime.',
  },
  violet: {
    id: 'violet',
    name: 'Violet Slime',
    hp: 1,
    speed: BASE * 3.2,
    radius: 15,
    immune: [],
    children: [{ id: 'amber', count: 1 }],
    blurb: 'Fast. Pops into an Amber Slime.',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Slime',
    hp: 1,
    speed: BASE * 3.5,
    radius: 15,
    immune: [],
    children: [{ id: 'violet', count: 1 }],
    blurb: 'Very fast. Pops into a Violet Slime.',
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow Ooze',
    hp: 1,
    speed: BASE * 1.8,
    radius: 11,
    immune: ['blast', 'fire'],
    children: [{ id: 'crimson', count: 2 }],
    blurb: 'Immune to blasts and fire. Splits into 2 Crimson.',
  },
  frost: {
    id: 'frost',
    name: 'Frost Ooze',
    hp: 1,
    speed: BASE * 2.0,
    radius: 11,
    immune: ['cold'],
    children: [{ id: 'crimson', count: 2 }],
    blurb: 'Immune to cold. Splits into 2 Crimson.',
  },
  warded: {
    id: 'warded',
    name: 'Warded Ooze',
    hp: 1,
    speed: BASE * 3.0,
    radius: 12,
    immune: ['arcane', 'fire', 'radiant'],
    children: [{ id: 'crimson', count: 2 }],
    blurb: 'Immune to arcane, fire and radiant magic.',
  },
  iron: {
    id: 'iron',
    name: 'Iron Ooze',
    hp: 1,
    speed: BASE,
    radius: 15,
    immune: ['piercing', 'slashing'],
    children: [{ id: 'shadow', count: 2 }],
    shell: true,
    blurb: 'Blades and arrows bounce off. Splits into 2 Shadow.',
  },
  storm: {
    id: 'storm',
    name: 'Storm Ooze',
    hp: 1,
    speed: BASE * 1.8,
    radius: 15,
    immune: ['blast', 'cold'],
    children: [
      { id: 'shadow', count: 1 },
      { id: 'frost', count: 1 },
    ],
    blurb: 'Immune to blasts and cold.',
  },
  prismatic: {
    id: 'prismatic',
    name: 'Prismatic Ooze',
    hp: 1,
    speed: BASE * 2.2,
    radius: 16,
    immune: [],
    children: [{ id: 'storm', count: 2 }],
    blurb: 'Shimmering. Splits into 2 Storm.',
  },
  stone: {
    id: 'stone',
    name: 'Stone Ooze',
    hp: 10,
    speed: BASE * 2.5,
    radius: 17,
    immune: [],
    children: [{ id: 'prismatic', count: 2 }],
    shell: true,
    blurb: 'A rocky shell that takes 10 hits.',
  },
  ogre: {
    id: 'ogre',
    name: 'Ogre Brute',
    hp: 200,
    speed: BASE,
    radius: 38,
    immune: [],
    children: [{ id: 'stone', count: 4 }],
    boss: true,
    shell: true,
    blurb: 'Hauls a cauldron of 4 Stone Oozes.',
  },
  troll: {
    id: 'troll',
    name: 'Troll Chieftain',
    hp: 700,
    speed: BASE * 0.25,
    radius: 46,
    immune: [],
    children: [{ id: 'ogre', count: 4 }],
    boss: true,
    shell: true,
    blurb: 'Slow and huge. Releases 4 Ogres.',
  },
  giant: {
    id: 'giant',
    name: 'Stone Giant',
    hp: 4000,
    speed: BASE * 0.18,
    radius: 56,
    immune: [],
    children: [{ id: 'troll', count: 4 }],
    boss: true,
    shell: true,
    blurb: 'A walking mountain. Releases 4 Trolls.',
  },
  lich: {
    id: 'lich',
    name: 'Lich Wraith',
    hp: 400,
    speed: BASE * 2.75,
    radius: 36,
    immune: ['piercing', 'slashing', 'blast'],
    children: [{ id: 'stone', count: 6 }],
    boss: true,
    shell: true,
    invisible: true,
    blurb: 'Fast, invisible, and shrugs off steel and blasts.',
  },
  dragon: {
    id: 'dragon',
    name: 'Ancient Dragon',
    hp: 20000,
    speed: BASE * 0.18,
    radius: 66,
    immune: [],
    children: [
      { id: 'giant', count: 2 },
      { id: 'lich', count: 3 },
    ],
    boss: true,
    shell: true,
    blurb: 'The end of all things.',
  },
};

export const ENEMY_IDS = Object.keys(ENEMIES) as EnemyId[];

const rbeCache = new Map<string, number>();

/** Total hits needed to fully destroy an enemy and all of its children ("red-equivalent"). */
export function rbe(id: EnemyId, armored = false): number {
  const key = `${id}:${armored}`;
  const hit = rbeCache.get(key);
  if (hit !== undefined) return hit;
  const def = ENEMIES[id];
  let total = def.hp * (armored && def.shell ? 2 : 1);
  for (const c of def.children) total += c.count * rbe(c.id, false);
  rbeCache.set(key, total);
  return total;
}

/** Ordering used by the "strong" target priority. */
export const ENEMY_STRENGTH: Record<EnemyId, number> = Object.fromEntries(
  ENEMY_IDS.map((id) => [id, rbe(id)]),
) as Record<EnemyId, number>;
