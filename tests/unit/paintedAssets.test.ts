import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PAINTED_BOSSES, PAINTED_CHASSIS, PAINTED_TOWERS } from '../../src/render/art/painted';

const DIR = 'public/assets/painted/';

/** Width and height from the PNG header (bytes 16-23), so no image library is needed. */
function pngSize(name: string): { w: number; h: number } {
  const b = readFileSync(`${DIR}${name}.png`);
  expect(b.subarray(1, 4).toString('ascii'), `${name} is a PNG`).toBe('PNG');
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const json = <T>(name: string): T => JSON.parse(readFileSync(`${DIR}${name}.json`, 'utf8')) as T;

interface StripJson {
  frames: number;
  cellW: number;
  cellH: number;
  baselineY: number;
  pivotX: number;
}

/**
 * The renderer falls back to code-drawn art silently when a painted file is missing or does not
 * fit, so a mistyped name or a half-copied swap would ship unnoticed. These checks make it loud.
 */
describe('painted assets match their registry', () => {
  const strips = [
    ...Object.values(PAINTED_TOWERS).map((t) => t.strip),
    ...Object.values(PAINTED_CHASSIS).map((c) => c.strip),
  ];

  it.each(strips)('strip %s has a JSON and a PNG that agree', (name) => {
    expect(existsSync(`${DIR}${name}.json`), `${name}.json`).toBe(true);
    expect(existsSync(`${DIR}${name}.png`), `${name}.png`).toBe(true);
    const meta = json<StripJson>(name);
    const { w, h } = pngSize(name);
    expect(meta.frames).toBeGreaterThan(0);
    expect(w, 'PNG width holds every frame').toBeGreaterThanOrEqual(meta.frames * meta.cellW);
    expect(h, 'PNG height holds a cell').toBeGreaterThanOrEqual(meta.cellH);
    expect(meta.baselineY).toBeGreaterThan(0);
    expect(meta.baselineY).toBeLessThanOrEqual(meta.cellH);
    expect(meta.pivotX).toBeGreaterThan(0);
    expect(meta.pivotX).toBeLessThan(1);
  });

  it('every gear atlas item sits inside its PNG', () => {
    for (const spec of Object.values(PAINTED_TOWERS))
      for (const atlas of spec.gearAtlases) {
        const { items } = json<{ items: Record<string, { x: number; y: number; w: number; h: number }> }>(
          atlas,
        );
        const { w, h } = pngSize(atlas);
        for (const [id, r] of Object.entries(items)) {
          expect(r.x + r.w, `${id} right edge`).toBeLessThanOrEqual(w);
          expect(r.y + r.h, `${id} bottom edge`).toBeLessThanOrEqual(h);
        }
      }
  });

  it('every boss image exists', () => {
    for (const spec of Object.values(PAINTED_BOSSES)) {
      expect(existsSync(`${DIR}${spec!.image}.png`), spec!.image).toBe(true);
    }
  });
});
