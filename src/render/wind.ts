/**
 * A gentle travelling wind for ambient motion (grass, leaves, canopies). Pure and deterministic:
 * the same time and place always give the same value, so screenshots and tests are repeatable.
 * Returns -1..1; gusts roll across the map from left to right.
 */
export function wind(t: number, x: number, y: number): number {
  const a = Math.sin(t * 0.9 + x * 0.006 + y * 0.003);
  const b = Math.sin(t * 1.7 + x * 0.011 - y * 0.004);
  const gust = 0.65 + 0.35 * Math.sin(t * 0.25 + x * 0.002);
  return (0.62 * a + 0.38 * b) * gust;
}

/** Stable pseudo-random 0..1 from an integer index (for per-item phases). */
export function unit(i: number): number {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}
