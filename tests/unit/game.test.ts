import { describe, expect, it } from 'vitest';
import { Game } from '../../src/core/game';
import { DT } from '../../src/core/types';
import { rbe } from '../../src/core/data/enemies';
import { place } from '../helpers';
import { BALANCE } from '../../src/core/data/balance';

function run(g: Game, seconds: number) {
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n && !g.over; i++) g.step();
}

function runRound(g: Game, maxSeconds = 300) {
  g.startRound();
  const n = Math.round(maxSeconds / DT);
  for (let i = 0; i < n && g.roundActive && !g.over; i++) g.step();
}

/** A spot near the start of the glade road that's legal for most towers. */
const SPOT = { x: 180, y: 260 };

describe('placement', () => {
  it('rejects towers on the road and deducts cost on success', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    const road = g.paths[0]!.pointAt(400, { x: 0, y: 0 });
    expect(g.placeTower('ranger', road.x, road.y).ok).toBe(false);
    const before = g.cash;
    const r = g.placeTower('ranger', SPOT.x, SPOT.y);
    expect(r.ok).toBe(true);
    expect(g.cash).toBe(before - g.towerCost('ranger'));
    expect(g.placeTower('ranger', SPOT.x + 5, SPOT.y).ok).toBe(false);
  });

  it('only lets the druid stand on water', () => {
    const g = new Game({ mapId: 'crypt', difficulty: 'easy' });
    g.cash = 99999;
    const w = g.map.water[0]!;
    expect(g.placeTower('ranger', w.x, w.y).ok).toBe(false);
    expect(g.placeTower('druid', w.x, w.y).ok).toBe(true);
  });

  it('applies difficulty cost scaling', () => {
    expect(new Game({ mapId: 'glade', difficulty: 'easy' }).towerCost('ranger')).toBe(170);
    expect(new Game({ mapId: 'glade', difficulty: 'hard' }).towerCost('ranger')).toBe(215);
  });
});

describe('combat', () => {
  it('pops layers, carries overflow, and pays per layer', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    g.round = 1;
    // Spawn an amber directly via a 1-enemy round and hit it with 2 damage → blue skipped → green
    g.startRound();
    g.round = 1;
    // fast-forward to first spawn
    while (g.enemies.length === 0) g.step();
    const e = g.enemies[0]!;
    // turn it into amber for the test
    const cashBefore = g.cash;
    (e as { type: string }).type = 'amber';
    e.def = { ...e.def, ...require_enemy('amber') };
    g.damage(e, 2, 'piercing', 1, 1, null, -1);
    expect(e.alive).toBe(false);
    const child = g.enemies.find((x) => x.alive && x.uid !== e.uid);
    expect(child?.type).toBe('green');
    expect(g.cash - cashBefore).toBeCloseTo(2 * BALANCE.popCashScale, 5);
  });

  it('immune enemies take no damage', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    g.startRound();
    while (g.enemies.length === 0) g.step();
    const e = g.enemies[0]!;
    (e as { type: string }).type = 'iron';
    e.def = require_enemy('iron');
    e.hp = 1;
    expect(g.damage(e, 5, 'piercing', 1, 1, null, -1)).toBe(false);
    expect(e.alive).toBe(true);
    expect(g.damage(e, 1, 'blast', 1, 1, null, -1)).toBe(true);
    expect(e.alive).toBe(false);
  });

  it('leaks cost lives equal to remaining layers', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    const lives = g.lives;
    runRound(g); // round 1: 20 greens, no towers
    expect(g.lives).toBe(lives - 20 * rbe('green'));
  });

  it('a ranger defends round 1 and earns the round bonus', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    place(g, 'ranger', 0.12);
    place(g, 'ranger', 0.25);
    const cash = g.cash;
    const lives = g.lives;
    runRound(g);
    expect(g.lives).toBe(lives);
    expect(g.round).toBe(1);
    expect(g.roundActive).toBe(false);
    expect(g.cash).toBeCloseTo(
      cash + 20 * BALANCE.popCashScale + BALANCE.roundBonusBase + BALANCE.roundBonusPerRound,
      5,
    );
  });
});

describe('upgrades & selling', () => {
  it('enforces crosspath limits and refunds 70%', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    g.cash = 1e6;
    const r = g.placeTower('fighter', SPOT.x, SPOT.y);
    if (!r.ok) throw new Error(r.reason);
    for (let i = 0; i < 5; i++) expect(g.upgradeTower(r.uid, 0).ok).toBe(true);
    expect(g.upgradeTower(r.uid, 0).ok).toBe(false);
    expect(g.upgradeTower(r.uid, 1).ok).toBe(true);
    expect(g.upgradeTower(r.uid, 1).ok).toBe(true);
    expect(g.upgradeTower(r.uid, 1).ok).toBe(false);
    expect(g.upgradeTower(r.uid, 2).ok).toBe(false);
    const t = g.towerByUid(r.uid)!;
    expect(t.tiers).toEqual([5, 2, 0]);
    expect(t.stats.ability?.id).toBe('whirlwind');
    const cash = g.cash;
    const value = g.sellValue(t);
    expect(value).toBe(Math.floor(t.spent * 0.7));
    g.sellTower(r.uid);
    expect(g.cash).toBe(cash + value);
    expect(g.towers).toHaveLength(0);
  });

  it('support towers buff neighbours and grant sight', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    g.cash = 1e6;
    const a = g.placeTower('ranger', 180, 260);
    const c = g.placeTower('cleric', 150, 330);
    if (!a.ok || !c.ok) throw new Error('placement failed');
    g.upgradeTower(c.uid, 1);
    g.upgradeTower(c.uid, 1);
    const ranger = g.towerByUid(a.uid)!;
    expect(g.seesInvisible(ranger)).toBe(true);
    expect(ranger.buff.rateMult).toBeCloseTo(0.85);
  });
});

describe('determinism & saves', () => {
  function scripted(seed: number) {
    const g = new Game({ mapId: 'pass', difficulty: 'hard', seed });
    g.cash = 50000;
    g.lives = 100000;
    const placements: [string, number, number][] = [
      ['ranger', 420, 450],
      ['bombardier', 860, 460],
      ['rogue', 420, 120],
      ['wizard', 1000, 450],
    ];
    for (const [id, x, y] of placements) {
      const r = g.placeTower(id as never, x, y);
      if (r.ok) g.upgradeTower(r.uid, 0);
    }
    g.round = 29;
    for (let i = 0; i < 3; i++) runRound(g);
    return g;
  }

  it('identical seeds and inputs produce identical outcomes', () => {
    const a = scripted(99);
    const b = scripted(99);
    expect(a.lives).toBe(b.lives);
    expect(a.cash).toBe(b.cash);
    expect(a.popCount).toBe(b.popCount);
    expect(a.towers.map((t) => t.pops)).toEqual(b.towers.map((t) => t.pops));
  });

  it('save/load round-trips between rounds', () => {
    const g = scripted(5);
    expect(g.over).toBeNull();
    expect(g.canSave()).toBe(true);
    const s = g.serialize();
    const json = JSON.parse(JSON.stringify(s));
    const h = Game.deserialize(json);
    expect(h.serialize()).toEqual(s);
    runRound(g);
    runRound(h);
    expect(h.lives).toBe(g.lives);
    expect(h.cash).toBe(g.cash);
  });
});

describe('abilities', () => {
  it('cash abilities pay out and go on cooldown', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'medium' });
    g.cash = 1e6;
    const r = g.placeTower('treasury', 1200, 560);
    if (!r.ok) throw new Error(r.reason);
    for (let i = 0; i < 4; i++) g.upgradeTower(r.uid, 2);
    const t = g.towerByUid(r.uid)!;
    expect(t.stats.ability?.kind).toBe('cash');
    t.abilityCd = 0;
    const cash = g.cash;
    expect(g.activateAbility(r.uid)).toBe(true);
    expect(g.cash).toBe(cash + 900);
    expect(g.activateAbility(r.uid)).toBe(false);
  });

  it('round-end income includes towers', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'easy' });
    g.cash = 5000;
    const r = g.placeTower('treasury', 1200, 560);
    if (!r.ok) throw new Error(r.reason);
    place(g, 'ranger', 0.12);
    place(g, 'ranger', 0.25);
    const cash = g.cash;
    run(g, 0);
    runRound(g);
    expect(g.cash).toBeGreaterThanOrEqual(cash + BALANCE.roundBonusBase + 80);
  });
});

import { ENEMIES } from '../../src/core/data/enemies';
function require_enemy(id: keyof typeof ENEMIES) {
  return ENEMIES[id];
}
