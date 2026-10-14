import { describe, expect, it } from 'vitest';
import { ENEMIES } from '../../src/core/data/enemies';
import { ENEMY_LOOKS, PAINTED_CHASSIS } from '../../src/render/art/painted';
import { cyclesPerSecond, hueTint, walkFrame } from '../../src/render/walkCycle';

describe('walk cycle', () => {
  it('visits every frame once per cycle, in order', () => {
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) seen.push(walkFrame((i + 0.5) / 6, 6));
    expect(seen).toEqual([0, 1, 2, 3, 4, 5]);
    expect(walkFrame(2.999999, 6)).toBe(5);
    expect(walkFrame(3, 6)).toBe(0);
  });

  it('stays inside the strip for negative and huge clocks', () => {
    for (const c of [-0.01, -3.7, 1e6 + 0.3, 0]) {
      const f = walkFrame(c, 6);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(5);
    }
  });

  it('steps faster for faster layers but never flickers or stalls', () => {
    const base = ENEMIES.green.speed;
    const slow = cyclesPerSecond(base * 0.25, base);
    const mid = cyclesPerSecond(base, base);
    const fast = cyclesPerSecond(base * 2.8, base);
    expect(slow).toBeLessThan(mid);
    expect(mid).toBeLessThan(fast);
    expect(fast).toBeLessThanOrEqual(3);
    expect(fast / mid).toBeLessThan(2.8);
    expect(cyclesPerSecond(0, base)).toBeGreaterThan(0);
  });
});

describe('painted enemy looks', () => {
  it('gives every regular enemy a skeleton look and no boss one', () => {
    for (const def of Object.values(ENEMIES)) {
      const look = ENEMY_LOOKS[def.id];
      if (def.boss) expect(look, def.id).toBeUndefined();
      else expect(look, def.id).toBeDefined();
    }
  });

  it('points every look at a known chassis whose fallback chain ends', () => {
    for (const look of Object.values(ENEMY_LOOKS)) {
      let chassis = look!.chassis;
      for (let i = 0; i < 4 && PAINTED_CHASSIS[chassis].fallback; i++)
        chassis = PAINTED_CHASSIS[chassis].fallback!;
      expect(PAINTED_CHASSIS[chassis].fallback).toBeUndefined();
    }
  });

  it('keeps layer colours distinct so tiers stay readable', () => {
    const tints = Object.values(ENEMY_LOOKS).map((l) => l!.tint);
    expect(new Set(tints).size).toBe(tints.length);
  });
});

describe('hue tint', () => {
  it('returns valid, light colours that wrap around', () => {
    for (let i = -20; i < 40; i++) {
      const c = hueTint(i * 0.097);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(0xffffff);
      const [r, g, b] = [(c >> 16) & 255, (c >> 8) & 255, c & 255];
      expect(Math.min(r, g, b)).toBeGreaterThanOrEqual(150);
      expect(Math.max(r, g, b)).toBe(255);
    }
    expect(hueTint(0.25)).toBe(hueTint(1.25));
  });
});
