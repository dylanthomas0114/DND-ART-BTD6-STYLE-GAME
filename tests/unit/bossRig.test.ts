import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ENEMIES } from '../../src/core/data/enemies';
import { PAINTED_BOSSES } from '../../src/render/art/painted';
import { gridSize, maxDisplacement, poseGrid } from '../../src/render/bossRig';

const spec = PAINTED_BOSSES.ogre!;
const W = 512;
const H = 343;

function pose(t: number, stride: number, moving: boolean): Float32Array {
  const out = new Float32Array(gridSize(spec.rig));
  poseGrid(out, spec.rig, W, H, spec.pivotY, { t, stride, moving });
  return out;
}

const flat = (): Float32Array => {
  const rest = { ...spec.rig, wing: { ...spec.rig.wing, amp: 0 }, tail: { ...spec.rig.tail, amp: 0 } };
  const out = new Float32Array(gridSize(rest));
  poseGrid(
    out,
    { ...rest, head: { ...rest.head, amp: 0 }, feet: { ...rest.feet, amp: 0 } },
    W,
    H,
    spec.pivotY,
    {
      t: 1.3,
      stride: 2.1,
      moving: true,
    },
  );
  return out;
};

describe('painted boss rig', () => {
  it('only registers painted art for enemies that exist, are bosses, and have an image on disk', () => {
    for (const [id, s] of Object.entries(PAINTED_BOSSES)) {
      expect(ENEMIES[id as keyof typeof ENEMIES]?.boss, id).toBe(true);
      expect(existsSync(`public/assets/painted/${s!.image}.png`), `${id} image`).toBe(true);
    }
  });

  it('reproduces the flat image when every amplitude is zero', () => {
    const out = flat();
    const { cols, rows } = spec.rig;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 2;
        expect(out[i]).toBeCloseTo((c / (cols - 1) - 0.5) * W, 3);
        expect(out[i + 1]).toBeCloseTo((r / (rows - 1) - spec.pivotY) * H, 3);
      }
  });

  it('never moves a vertex further than the rig allows, and never sideways', () => {
    const rest = flat();
    const bound = maxDisplacement(spec.rig) * H + 1e-3;
    for (let k = 0; k < 200; k++) {
      const out = pose(k * 0.137, k * 0.61, k % 3 !== 0);
      for (let i = 0; i < out.length; i += 2) {
        expect(out[i]).toBeCloseTo(rest[i]!, 4);
        expect(Math.abs(out[i + 1]! - rest[i + 1]!)).toBeLessThanOrEqual(bound);
      }
    }
  });

  it('is deterministic and finite', () => {
    const a = pose(3.3, 1.7, true);
    const b = pose(3.3, 1.7, true);
    expect(Array.from(a)).toEqual(Array.from(b));
    expect(a.every(Number.isFinite)).toBe(true);
  });

  it('flaps less when idle and lifts feet only while walking', () => {
    const span = (o: Float32Array, rest: Float32Array): number => {
      let m = 0;
      for (let i = 1; i < o.length; i += 2) m = Math.max(m, Math.abs(o[i]! - rest[i]!));
      return m;
    };
    const rest = flat();
    // t chosen so sin(t * rate) is at its peak for the wing
    const t = Math.PI / 2 / spec.rig.wing.rate;
    expect(span(pose(t, 0, false), rest)).toBeLessThan(span(pose(t, 0, true), rest));
    const feetRow = (spec.rig.rows - 1) * spec.rig.cols * 2 + 1;
    const walking = pose(0, Math.PI / 2, true);
    const idle = pose(0, Math.PI / 2, false);
    expect(walking[feetRow]!).toBeLessThan(idle[feetRow]!);
  });
});
