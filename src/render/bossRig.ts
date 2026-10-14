import type { BossRig } from './art/painted';

/** What the rig needs to pose one frame. Pure numbers: nothing here touches Pixi. */
export interface BossPose {
  /** Seconds of animation time (frozen enemies stop advancing it). */
  t: number;
  /** Stride phase in radians, driven by distance walked so feet match the ground speed. */
  stride: number;
  /** Walking, not frozen or stunned. Idle poses breathe instead of flapping hard. */
  moving: boolean;
}

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number): number => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};

/** Idle wings still move a little so a stopped boss never looks frozen in time. */
export const IDLE_FLAP = 0.35;

/** Number of floats needed for a rig's position buffer (x, y per vertex). */
export function gridSize(rig: BossRig): number {
  return rig.cols * rig.rows * 2;
}

/**
 * Writes the posed vertex positions into `out`, in image pixels relative to the pivot
 * (x across from the image centre, y down from the feet line). A rest pose of all zero
 * amplitudes reproduces the flat image exactly.
 */
export function poseGrid(
  out: Float32Array,
  rig: BossRig,
  w: number,
  h: number,
  pivotY: number,
  pose: BossPose,
): void {
  const { cols, rows, wing, tail, head, feet } = rig;
  const flap = Math.sin(pose.t * wing.rate) * wing.amp * (pose.moving ? 1 : IDLE_FLAP);
  const nod = Math.sin(pose.stride * 2) * head.amp;
  let k = 0;
  for (let r = 0; r < rows; r++) {
    const v = r / (rows - 1);
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      let dy = 0;
      if (u >= wing.u0 && v < wing.rootV) {
        const up = clamp01((wing.rootV - v) / (wing.rootV - wing.v0));
        const reach = smooth((u - wing.u0) / (wing.u1 - wing.u0));
        dy -= flap * up * (0.35 + 0.65 * reach);
      }
      if (u > tail.u0) {
        const s = (u - tail.u0) / (1 - tail.u0);
        dy += Math.sin(pose.t * tail.rate - s * tail.wave) * tail.amp * s * s * (pose.moving ? 1 : 0.5);
      }
      if (u < head.u1) dy += nod * (1 - u / head.u1);
      if (pose.moving && v > feet.v0) {
        const s = (v - feet.v0) / (1 - feet.v0);
        dy -= Math.max(0, Math.sin(pose.stride + u * Math.PI * 2)) * feet.amp * s;
      }
      out[k++] = (u - 0.5) * w;
      out[k++] = (v - pivotY + dy) * h;
    }
  }
}

/** Largest vertical move any vertex can make, as a fraction of image height. */
export function maxDisplacement(rig: BossRig): number {
  return rig.wing.amp + rig.tail.amp + rig.head.amp + rig.feet.amp;
}
