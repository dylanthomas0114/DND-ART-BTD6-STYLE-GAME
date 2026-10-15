import { describe, expect, it } from 'vitest';
import { MAPS } from '../../src/core/data/maps';
import { type Ambient, drawAmbient } from '../../src/render/art/ambientArt';
import {
  type Cover,
  drawCover,
  drawDecor,
  drawFlagstones,
  drawGroundBase,
  drawStrata,
  drawWaterBase,
} from '../../src/render/art/mapArt';
import { Draw, type Pen } from '../../src/render/art/pen';
import { unit, wind } from '../../src/render/wind';

/** A pen that records what is drawn, so art functions can run in Node without Pixi. */
function recorder(): { pen: Pen; calls: string[] } {
  const calls: string[] = [];
  const pen = new Proxy({} as Pen, {
    get: (_t, name: string) => {
      return (...args: unknown[]) => {
        for (const a of args)
          if (typeof a === 'number') expect(Number.isFinite(a), `${name} got ${a}`).toBe(true);
        calls.push(name);
        return pen;
      };
    },
  });
  return { pen, calls };
}

describe('wind', () => {
  it('stays within -1..1 and is deterministic', () => {
    for (let i = 0; i < 400; i++) {
      const t = i * 0.37;
      const v = wind(t, (i * 53) % 2100, (i * 29) % 900);
      expect(Math.abs(v)).toBeLessThanOrEqual(1);
      expect(wind(t, (i * 53) % 2100, (i * 29) % 900)).toBe(v);
    }
  });

  it('varies over time and across the map, so gusts roll through', () => {
    const over = new Set<number>();
    for (let i = 0; i < 20; i++) over.add(Math.round(wind(i * 0.5, 800, 400) * 1000));
    expect(over.size).toBeGreaterThan(10);
    const across = new Set<number>();
    for (let i = 0; i < 20; i++) across.add(Math.round(wind(3, i * 90, 400) * 1000));
    expect(across.size).toBeGreaterThan(10);
  });

  it('gives per-item phases in 0..1', () => {
    for (let i = 0; i < 200; i++) {
      const u = unit(i);
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThan(1);
    }
  });
});

describe('map art', () => {
  it('draws every decor kind used by any map, with finite coordinates', () => {
    const kinds = new Set(Object.values(MAPS).flatMap((m) => m.theme.decor));
    for (const kind of kinds)
      for (const s of [0.7, 1, 1.5]) {
        const { pen, calls } = recorder();
        drawDecor(new Draw(pen, 3), kind, s);
        expect(calls.length, `${kind} x${s}`).toBeGreaterThan(3);
      }
  });

  it('draws every ground cover, ambient and terrain piece for every map', () => {
    const covers: Cover[] = [
      'tuft',
      'tuftTall',
      'flower',
      'pebble',
      'edgeStone',
      'reed',
      'lily',
      'moss',
      'crack',
    ];
    const ambients: Ambient[] = [
      'leaf',
      'butterfly',
      'mote',
      'wisp',
      'ember',
      'ash',
      'mist',
      'cloud',
      'ring',
      'glint',
    ];
    for (const map of Object.values(MAPS)) {
      for (const c of covers)
        for (const v of [0, 1, 2]) {
          const { pen, calls } = recorder();
          drawCover(new Draw(pen, 0), c, map, v);
          expect(calls.length, `${map.id} ${c}`).toBeGreaterThan(0);
        }
      for (const a of ambients) {
        const { pen, calls } = recorder();
        drawAmbient(new Draw(pen, 0), a, map, 1);
        expect(calls.length, `${map.id} ${a}`).toBeGreaterThan(0);
      }
      for (const fn of [drawGroundBase, drawWaterBase, drawFlagstones, drawStrata]) {
        const { pen, calls } = recorder();
        fn(new Draw(pen, 3), map);
        if (fn !== drawWaterBase || map.water.length > 0)
          expect(calls.length, `${map.id} ${fn.name}`).toBeGreaterThan(0);
      }
    }
  });
});
