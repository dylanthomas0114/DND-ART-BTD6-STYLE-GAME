import { hash32, Rng } from '../rng';
import { type EnemyId, rbe } from './enemies';

export interface SpawnGroup {
  enemy: EnemyId;
  count: number;
  /** Seconds between spawns. */
  spacing: number;
  /** Seconds after round start that the first spawn happens. */
  delay: number;
  invisible?: boolean;
  regen?: boolean;
  armored?: boolean;
  /** Freeplay: HP and speed multipliers. */
  hpMult?: number;
  speedMult?: number;
}

export type RoundDef = SpawnGroup[];

type Mods = Pick<SpawnGroup, 'invisible' | 'regen' | 'armored'>;

/** Group helper: `g('green', 20, 0.9, 0)`. */
function g(enemy: EnemyId, count: number, spacing: number, delay = 0, mods: Mods = {}): SpawnGroup {
  return { enemy, count, spacing, delay, ...mods };
}

const C: Mods = { invisible: true };
const R: Mods = { regen: true };
const A: Mods = { armored: true };
const CR: Mods = { invisible: true, regen: true };

/** Hand-authored rounds 1–40 (classic difficulty ramp). */
const AUTHORED: Record<number, RoundDef> = {
  1: [g('green', 20, 0.85)],
  2: [g('green', 35, 0.55)],
  3: [g('green', 25, 0.6), g('blue', 5, 0.9, 6)],
  4: [g('green', 35, 0.45), g('blue', 18, 0.6, 4)],
  5: [g('green', 5, 0.6), g('blue', 27, 0.5, 2)],
  6: [g('green', 15, 0.5), g('blue', 15, 0.5, 4), g('amber', 4, 1, 9)],
  7: [g('green', 20, 0.4), g('blue', 25, 0.45, 3), g('amber', 5, 0.9, 10)],
  8: [g('green', 10, 0.5), g('blue', 20, 0.45, 2), g('amber', 14, 0.6, 8)],
  9: [g('amber', 30, 0.5)],
  10: [g('blue', 102, 0.18)],
  11: [g('green', 10, 0.4), g('blue', 10, 0.4, 2), g('amber', 12, 0.5, 5), g('violet', 2, 1.5, 10)],
  12: [g('blue', 15, 0.4), g('amber', 10, 0.5, 4), g('violet', 5, 0.9, 9)],
  13: [g('blue', 50, 0.25), g('amber', 23, 0.4, 6)],
  14: [g('green', 49, 0.2), g('blue', 15, 0.35, 4), g('amber', 10, 0.5, 8), g('violet', 9, 0.8, 12)],
  15: [g('green', 20, 0.3), g('amber', 15, 0.4, 4), g('violet', 12, 0.6, 9), g('crimson', 5, 1, 14)],
  16: [g('amber', 20, 0.35), g('violet', 8, 0.7, 6)],
  17: [g('violet', 12, 0.7, 0, R)],
  18: [g('amber', 80, 0.18)],
  19: [g('amber', 10, 0.4), g('violet', 4, 0.8, 3), g('violet', 5, 0.8, 7, R), g('crimson', 7, 0.8, 11)],
  20: [g('shadow', 6, 1.2)],
  21: [g('violet', 14, 0.5), g('crimson', 40, 0.3, 4)],
  22: [g('frost', 16, 0.7)],
  23: [g('shadow', 7, 0.9), g('frost', 7, 0.9, 4)],
  24: [g('amber', 1, 1, 0, C), g('blue', 20, 0.35, 2)],
  25: [g('violet', 25, 0.4, 0, R), g('warded', 10, 0.8, 6)],
  26: [g('crimson', 23, 0.4), g('storm', 4, 1.2, 6)],
  27: [g('green', 100, 0.08), g('blue', 60, 0.1, 3), g('amber', 45, 0.15, 6), g('violet', 45, 0.18, 10)],
  28: [g('iron', 6, 1.3)],
  29: [g('violet', 50, 0.25)],
  30: [g('iron', 9, 1.1), g('crimson', 20, 0.3, 4)],
  31: [g('shadow', 8, 0.6), g('frost', 8, 0.6, 3), g('storm', 8, 0.8, 6), g('storm', 2, 1, 12, R)],
  32: [g('shadow', 25, 0.35), g('frost', 28, 0.35, 5), g('warded', 8, 0.6, 12)],
  33: [g('violet', 20, 0.35, 0, C), g('crimson', 13, 0.5, 6)],
  34: [g('violet', 140, 0.1), g('storm', 6, 1, 6)],
  35: [g('crimson', 35, 0.3), g('shadow', 30, 0.3, 5), g('frost', 25, 0.35, 10), g('prismatic', 5, 1.2, 16)],
  36: [g('crimson', 81, 0.15)],
  37: [
    g('shadow', 20, 0.4),
    g('frost', 20, 0.4, 4),
    g('frost', 7, 0.6, 8, C),
    g('iron', 15, 0.7, 12),
    g('storm', 10, 0.8, 18),
  ],
  38: [
    g('crimson', 42, 0.25),
    g('frost', 17, 0.4, 5),
    g('iron', 14, 0.6, 9),
    g('storm', 10, 0.7, 14),
    g('stone', 4, 1.5, 20),
  ],
  39: [g('shadow', 10, 0.4), g('frost', 10, 0.4, 3), g('storm', 20, 0.5, 6), g('prismatic', 18, 0.6, 13)],
  40: [g('prismatic', 6, 0.8), g('ogre', 1, 1, 6)],
  60: [g('stone', 12, 0.9), g('ogre', 2, 3, 6), g('troll', 1, 1, 14)],
  80: [g('stone', 20, 0.5, 0, A), g('ogre', 4, 2.5, 6, A), g('troll', 2, 6, 14), g('giant', 1, 1, 26)],
  90: [g('stone', 30, 0.4, 0, CR), g('lich', 1, 1, 10), g('troll', 3, 4, 14)],
  100: [g('giant', 2, 8), g('dragon', 1, 1, 20)],
};

/** RBE budget per round for composed rounds (piecewise linear, then exponential). */
const BUDGET: [number, number][] = [
  [40, 1000],
  [45, 2200],
  [50, 3300],
  [55, 4500],
  [60, 6000],
  [65, 7600],
  [70, 9600],
  [75, 12500],
  [80, 20000],
  [90, 45000],
  [100, 90000],
];

export function roundBudget(r: number): number {
  if (r <= BUDGET[0]![0]) return BUDGET[0]![1];
  for (let i = 1; i < BUDGET.length; i++) {
    const [r1, b1] = BUDGET[i]!;
    const [r0, b0] = BUDGET[i - 1]!;
    if (r <= r1) return b0 + ((b1 - b0) * (r - r0)) / (r1 - r0);
  }
  const [rl, bl] = BUDGET[BUDGET.length - 1]!;
  return bl * Math.pow(1.08, r - rl);
}

interface PoolEntry {
  enemy: EnemyId;
  weight: number;
  minR: number;
  maxR?: number;
}

const POOL: PoolEntry[] = [
  { enemy: 'crimson', weight: 2, minR: 41, maxR: 55 },
  { enemy: 'shadow', weight: 2, minR: 41, maxR: 60 },
  { enemy: 'frost', weight: 2, minR: 41, maxR: 60 },
  { enemy: 'warded', weight: 2, minR: 41, maxR: 70 },
  { enemy: 'iron', weight: 3, minR: 41, maxR: 75 },
  { enemy: 'storm', weight: 3, minR: 41, maxR: 75 },
  { enemy: 'prismatic', weight: 4, minR: 41 },
  { enemy: 'stone', weight: 5, minR: 41 },
  { enemy: 'ogre', weight: 3, minR: 44 },
  { enemy: 'troll', weight: 2, minR: 63 },
  { enemy: 'giant', weight: 1, minR: 84 },
  { enemy: 'lich', weight: 1, minR: 91 },
];

/** Spawn duration target (seconds) for composed rounds. */
const ROUND_SECONDS = 22;

function composeRound(r: number): RoundDef {
  const rng = new Rng(hash32('round', r));
  const budget = roundBudget(r);
  const pool = POOL.filter((p) => r >= p.minR && (p.maxR === undefined || r <= p.maxR));
  const totalW = pool.reduce((s, p) => s + p.weight, 0);
  const groups: SpawnGroup[] = [];
  let spent = 0;
  let delay = 0;
  const modChance = Math.min(0.55, 0.15 + (r - 40) * 0.01);
  const freeplay = r > 80;
  const hpMult = freeplay ? 1 + (r - 80) * 0.05 : 1;
  const speedMult = freeplay ? Math.min(1.6, 1 + (r - 80) * 0.01) : 1;

  for (let guard = 0; guard < 12 && spent < budget * 0.95; guard++) {
    let roll = rng.next() * totalW;
    let pick = pool[0]!;
    for (const p of pool) {
      roll -= p.weight;
      if (roll <= 0) {
        pick = p;
        break;
      }
    }
    const mods: Mods = {};
    if (rng.next() < modChance) mods.invisible = true;
    if (rng.next() < modChance) mods.regen = true;
    if (rng.next() < modChance * 0.8) mods.armored = true;
    const unit = rbe(pick.enemy, mods.armored) * hpMult;
    const remaining = budget - spent;
    if (unit > remaining * 1.15) continue;
    const share = rng.range(0.2, 0.5);
    const count = Math.max(1, Math.min(120, Math.floor((remaining * share) / unit) || 1));
    const spacing = Math.max(0.08, Math.min(3, (ROUND_SECONDS * rng.range(0.4, 0.8)) / count));
    groups.push({
      enemy: pick.enemy,
      count,
      spacing,
      delay,
      ...mods,
      ...(freeplay ? { hpMult, speedMult } : {}),
    });
    spent += unit * count;
    delay += rng.range(2, 5);
  }
  if (groups.length === 0)
    groups.push({
      enemy: 'stone',
      count: Math.max(1, Math.floor(budget / rbe('stone'))),
      spacing: 0.3,
      delay: 0,
    });
  return groups;
}

const cache = new Map<number, RoundDef>();

export function getRound(r: number): RoundDef {
  const hit = cache.get(r);
  if (hit) return hit;
  let def = AUTHORED[r];
  if (def && r > 80) {
    const hpMult = 1 + (r - 80) * 0.05;
    def = def.map((gr) => ({ ...gr, hpMult }));
  }
  const out = def ?? composeRound(r);
  cache.set(r, out);
  return out;
}

/** Total RBE of a round (for tests/balance tooling). */
export function roundRbe(r: number): number {
  return getRound(r).reduce((s, gr) => s + gr.count * rbe(gr.enemy, gr.armored) * (gr.hpMult ?? 1), 0);
}

export function roundSpawnDuration(def: RoundDef): number {
  return def.reduce((m, gr) => Math.max(m, gr.delay + gr.spacing * (gr.count - 1)), 0);
}
