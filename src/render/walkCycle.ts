/** Pure helpers for painted walk cycles. Nothing here touches Pixi or the simulation. */

/** Walk-cycle repeats per second at the weakest layer's speed. */
const BASE_CPS = 1.5;
const MIN_CPS = 0.5;
const MAX_CPS = 3;

/**
 * Cycles per second for an enemy moving at `speed` (world units per second) when the slowest
 * ordinary layer moves at `baseSpeed`. Grows more slowly than the speed itself: an enemy that
 * is 2.8 times faster takes 1.8 times as many steps, so fast layers do not flicker.
 */
export function cyclesPerSecond(speed: number, baseSpeed: number): number {
  const ratio = Math.max(0, speed) / Math.max(1e-6, baseSpeed);
  return Math.min(MAX_CPS, Math.max(MIN_CPS, BASE_CPS * ratio ** 0.6));
}

/** Frame index for a clock measured in cycles; always inside 0..frames-1, also for negative clocks. */
export function walkFrame(cycles: number, frames: number): number {
  const phase = cycles - Math.floor(cycles);
  return Math.min(frames - 1, Math.floor(phase * frames));
}

/** A light, pastel colour for a hue given in turns (wraps, so any real number works). */
export function hueTint(turns: number): number {
  const h = (((turns % 1) + 1) % 1) * 6;
  const s = 0.4;
  const c = s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = 1 - c;
  const [r, g, b] =
    h < 1
      ? [c, x, 0]
      : h < 2
        ? [x, c, 0]
        : h < 3
          ? [0, c, x]
          : h < 4
            ? [0, x, c]
            : h < 5
              ? [x, 0, c]
              : [c, 0, x];
  const to = (v: number): number => Math.round((v + m) * 255);
  return (to(r) << 16) | (to(g) << 8) | to(b);
}
