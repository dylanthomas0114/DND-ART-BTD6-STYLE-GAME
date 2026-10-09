import { describe, expect, it } from 'vitest';
import { TOWER_LIST, TOWERS } from '../../src/core/data/towers';
import { allValidTiers, canUpgrade, computeGear, computeStats, isValidTiers } from '../../src/core/upgrades';
import { ENEMIES } from '../../src/core/data/enemies';
import type { Tiers } from '../../src/core/data/towerTypes';
import type { DamageType } from '../../src/core/types';

describe('crosspath rules', () => {
  it('accepts classic combinations', () => {
    for (const t of [
      [5, 2, 0],
      [2, 0, 5],
      [0, 5, 2],
      [2, 2, 0],
      [0, 0, 0],
      [3, 0, 0],
    ] as Tiers[])
      expect(isValidTiers(t)).toBe(true);
  });
  it('rejects illegal combinations', () => {
    for (const t of [
      [3, 3, 0],
      [1, 1, 1],
      [5, 1, 1],
      [6, 0, 0],
      [5, 3, 0],
    ] as Tiers[])
      expect(isValidTiers(t)).toBe(false);
  });
  it('canUpgrade respects the rule', () => {
    expect(canUpgrade([2, 2, 0], 0)).toBe(true);
    expect(canUpgrade([3, 2, 0], 1)).toBe(false);
    expect(canUpgrade([1, 1, 0], 2)).toBe(false);
    expect(canUpgrade([5, 0, 0], 0)).toBe(false);
  });
  it('enumerates 64 valid combos', () => {
    // 1 (none) + 3*5 (single) + pairs: 3 pairs * (2*2 + 2*3*2) = 3*16 = 48 → 64
    expect(allValidTiers()).toHaveLength(64);
  });
});

describe('tower content', () => {
  it('has 9 towers with 135 upgrades', () => {
    expect(TOWER_LIST).toHaveLength(9);
    const n = TOWER_LIST.reduce((s, t) => s + t.paths.reduce((q, p) => q + p.upgrades.length, 0), 0);
    expect(n).toBe(135);
  });

  for (const def of TOWER_LIST) {
    describe(def.name, () => {
      it('computes stats for every valid tier combination', () => {
        for (const t of allValidTiers()) {
          const s = computeStats(def, t);
          expect(s.range).toBeGreaterThan(0);
          for (const a of s.attacks) {
            expect(a.rate).toBeGreaterThan(0);
            expect(Number.isFinite(a.damage)).toBe(true);
            expect(a.pierce).toBeGreaterThan(0);
          }
        }
      });

      it('every upgrade adds or replaces at least one real piece of gear', () => {
        def.paths.forEach((p, pi) =>
          p.upgrades.forEach((u, ti) => {
            const real = u.gear.filter((g) => !g.aura);
            expect(real.length, `${def.id} ${pi + 1}-${ti + 1} ${u.name}`).toBeGreaterThan(0);
          }),
        );
      });

      it('paths own disjoint slots and gear stays in its path slots', () => {
        const seen = new Set<string>();
        for (const p of def.paths) {
          for (const s of p.slots) {
            expect(seen.has(s), `${def.id}: slot ${s} shared`).toBe(false);
            seen.add(s);
            expect(def.slots).toContain(s);
          }
          for (const u of p.upgrades)
            for (const g of u.gear) expect(p.slots, `${def.id} ${u.name}`).toContain(g.slot);
        }
        for (const g of def.baseGear) expect(def.slots).toContain(g.slot);
      });

      it('each tier visibly changes the gear set', () => {
        for (let p = 0; p < 3; p++) {
          for (let tier = 1; tier <= 5; tier++) {
            const prev: Tiers = [0, 0, 0];
            prev[p] = tier - 1;
            const next: Tiers = [0, 0, 0];
            next[p] = tier;
            const a = computeGear(def, prev)
              .map((g) => `${g.slot}:${g.art}`)
              .join(',');
            const b = computeGear(def, next)
              .map((g) => `${g.slot}:${g.art}`)
              .join(',');
            expect(b, `${def.id} path ${p + 1} tier ${tier}`).not.toBe(a);
          }
        }
      });

      it('has unique gear art ids', () => {
        const ids = [...def.baseGear, ...def.paths.flatMap((p) => p.upgrades.flatMap((u) => u.gear))].map(
          (g) => g.art,
        );
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});

describe('gear combination', () => {
  it('Fighter blade 5 + shield 2 wears the legendary blade AND the kite shield with mail', () => {
    const gear = computeGear(TOWERS.fighter, [5, 2, 0]);
    const arts = gear.map((g) => g.art);
    expect(arts).toContain('sword_dawn');
    expect(arts).toContain('helm_crown');
    expect(arts).toContain('shield_kite');
    expect(arts).toContain('armor_chain');
    expect(arts).not.toContain('sword_rusty');
    expect(arts).not.toContain('shield_buckler');
  });
  it('earlier gear in another slot of the same path stays on', () => {
    const arts = computeGear(TOWERS.fighter, [2, 0, 0]).map((g) => g.art);
    expect(arts).toEqual(expect.arrayContaining(['sword_long', 'helm_steel']));
  });
  it('gear is returned in draw order', () => {
    const def = TOWERS.fighter;
    const order = computeGear(def, [0, 5, 2]).map((g) => def.slots.indexOf(g.slot));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
});

describe('immunity coverage', () => {
  /** Damage types available from base or tier ≤2 upgrades (the early game). */
  function earlyTypes(defId: keyof typeof TOWERS): Set<DamageType> {
    const out = new Set<DamageType>();
    for (const t of [
      [0, 0, 0],
      [2, 2, 0],
      [2, 0, 2],
      [0, 2, 2],
    ] as Tiers[]) {
      for (const a of computeStats(TOWERS[defId], t).attacks) if (a.damage > 0) out.add(a.dtype);
    }
    return out;
  }
  for (const e of Object.values(ENEMIES)) {
    it(`${e.name} can be damaged early by at least two towers`, () => {
      const able = TOWER_LIST.filter((t) =>
        [...earlyTypes(t.id)].some((d) => d === 'true' || !e.immune.includes(d)),
      );
      expect(able.length).toBeGreaterThanOrEqual(2);
    });
  }
});
