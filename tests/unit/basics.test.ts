import { describe, expect, it } from 'vitest';
import { Rng, hash32 } from '../../src/core/rng';
import { Path } from '../../src/core/path';
import { rbe, ENEMIES } from '../../src/core/data/enemies';
import { SpatialHash } from '../../src/core/spatialHash';

describe('Rng', () => {
  it('is deterministic for a seed', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });
  it('stays in [0, 1)', () => {
    const r = new Rng(7);
    for (let i = 0; i < 10000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('hash32 is stable and order-sensitive', () => {
    expect(hash32('round', 41)).toBe(hash32('round', 41));
    expect(hash32('a', 'b')).not.toBe(hash32('b', 'a'));
  });
});

describe('Path', () => {
  const p = new Path([
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 200, y: 0 },
  ]);
  it('measures arc length', () => {
    expect(p.length).toBeGreaterThan(195);
    expect(p.length).toBeLessThan(205);
  });
  it('clamps pointAt and interpolates', () => {
    const out = { x: 0, y: 0 };
    p.pointAt(-10, out);
    expect(out.x).toBeCloseTo(0, 3);
    p.pointAt(1e9, out);
    expect(out.x).toBeCloseTo(200, 0);
    p.pointAt(50, out);
    expect(out.x).toBeCloseTo(50, 0);
    expect(out.y).toBeCloseTo(0, 3);
  });
  it('finds the closest point', () => {
    const c = p.closest(120, 30);
    expect(c.dist).toBeCloseTo(30, 0);
    expect(c.at).toBeCloseTo(120, -1);
  });
});

describe('enemies', () => {
  it('computes red-equivalent totals', () => {
    expect(rbe('green')).toBe(1);
    expect(rbe('blue')).toBe(2);
    expect(rbe('crimson')).toBe(5);
    expect(rbe('shadow')).toBe(11);
    expect(rbe('iron')).toBe(23);
    expect(rbe('prismatic')).toBe(47);
    expect(rbe('stone')).toBe(104);
    expect(rbe('stone', true)).toBe(114);
    expect(rbe('ogre')).toBe(616);
  });
  it('children always reference known enemies', () => {
    for (const def of Object.values(ENEMIES))
      for (const c of def.children) expect(ENEMIES[c.id]).toBeDefined();
  });
});

describe('SpatialHash', () => {
  it('returns items near the query point', () => {
    const h = new SpatialHash(1000, 1000, 50);
    h.insert(1, 100, 100);
    h.insert(2, 900, 900);
    const found: number[] = [];
    h.query(110, 110, 30, (i) => found.push(i));
    expect(found).toContain(1);
    expect(found).not.toContain(2);
    h.clear();
    const after: number[] = [];
    h.query(110, 110, 30, (i) => after.push(i));
    expect(after).toHaveLength(0);
  });
});
