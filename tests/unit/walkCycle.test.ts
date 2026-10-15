import { describe, expect, it } from 'vitest';
import { ENEMIES } from '../../src/core/data/enemies';
import { ENEMY_LOOKS, PAINTED_CHASSIS, SHOW_LAYER_STYLE } from '../../src/render/art/painted';
import { cyclesPerSecond, hueTint, mulTint, stepBob, walkFrame } from '../../src/render/walkCycle';

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

  it('keeps layer colours distinct when layer styling is on, and plain when it is off', () => {
    const looks = Object.values(ENEMY_LOOKS) as NonNullable<(typeof ENEMY_LOOKS)[string]>[];
    if (SHOW_LAYER_STYLE) {
      const tints = looks.map((l) => l.tint);
      expect(new Set(tints).size).toBe(tints.length);
    } else {
      for (const l of looks) {
        expect(l.tint).toBe(0xffffff);
        expect(l.mark).toBeUndefined();
      }
    }
  });

  it('still grows with the layer so size is the remaining tier cue', () => {
    const h = (id: string): number => ENEMY_LOOKS[id]!.height;
    expect(h('green')).toBeLessThan(h('blue'));
    expect(h('blue')).toBeLessThan(h('amber'));
    expect(h('amber')).toBeLessThan(h('violet'));
    expect(h('violet')).toBeLessThan(h('crimson'));
    expect(h('crimson')).toBeLessThan(h('stone'));
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

describe('status tint', () => {
  it('multiplies channels, so white is neutral and layer colours survive a status', () => {
    expect(mulTint(0xffe1a0, 0xffffff)).toBe(0xffe1a0);
    expect(mulTint(0xffffff, 0xb8ecff)).toBe(0xb8ecff);
    expect(mulTint(0x000000, 0xb8ecff)).toBe(0x000000);
    // a slowed crimson stays redder than a slowed green
    const crimson = mulTint(0xffb0b0, 0xb8ecff);
    const green = mulTint(0xdbf7c6, 0xb8ecff);
    expect((crimson >> 16) & 255).toBeGreaterThan((green >> 16) & 255);
    expect(crimson).not.toBe(green);
  });
});

describe('single-pose step bob', () => {
  it('stays inside its bounds, lifts twice per cycle and is periodic', () => {
    let lifts = 0;
    let prev = stepBob(0).lift;
    let rising = true;
    for (let i = 1; i <= 400; i++) {
      const c = i / 200; // two full cycles
      const b = stepBob(c);
      expect(b.lift).toBeGreaterThanOrEqual(0);
      expect(b.lift).toBeLessThanOrEqual(1);
      expect(Math.abs(b.rock)).toBeLessThanOrEqual(1);
      expect(Math.abs(b.squash)).toBeLessThanOrEqual(1);
      if (b.lift < prev && rising) lifts++;
      rising = b.lift >= prev;
      prev = b.lift;
    }
    expect(lifts).toBe(4); // two lifts per cycle, two cycles
    expect(stepBob(0.3).lift).toBeCloseTo(stepBob(1.3).lift, 9);
    expect(stepBob(-0.7).lift).toBeCloseTo(stepBob(0.3).lift, 9);
  });
});
