import type { Vec2 } from './types';

const SAMPLE_STEP = 2; // world units between resampled points

/**
 * A track enemies follow, built from Catmull-Rom control points and resampled at uniform
 * arc-length spacing so `pointAt(distance)` is O(1).
 */
export class Path {
  readonly length: number;
  private readonly xs: Float32Array;
  private readonly ys: Float32Array;
  private readonly count: number;

  constructor(readonly controlPoints: readonly Vec2[]) {
    if (controlPoints.length < 2) throw new Error('Path needs at least 2 control points');
    const dense = catmullRom(controlPoints, 24);
    // cumulative length over dense polyline
    const cum = new Float64Array(dense.length);
    for (let i = 1; i < dense.length; i++) {
      const a = dense[i - 1]!;
      const b = dense[i]!;
      cum[i] = cum[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y);
    }
    const total = cum[dense.length - 1]!;
    this.length = total;
    this.count = Math.floor(total / SAMPLE_STEP) + 2;
    this.xs = new Float32Array(this.count);
    this.ys = new Float32Array(this.count);
    let seg = 1;
    for (let i = 0; i < this.count; i++) {
      const d = Math.min(i * SAMPLE_STEP, total);
      while (seg < dense.length - 1 && cum[seg]! < d) seg++;
      const a = dense[seg - 1]!;
      const b = dense[seg]!;
      const segLen = cum[seg]! - cum[seg - 1]!;
      const t = segLen > 0 ? (d - cum[seg - 1]!) / segLen : 0;
      this.xs[i] = a.x + (b.x - a.x) * t;
      this.ys[i] = a.y + (b.y - a.y) * t;
    }
  }

  /** Writes the point at arc distance `d` into `out` (clamped to the path). */
  pointAt(d: number, out: Vec2): Vec2 {
    const f = Math.max(0, Math.min(d, this.length)) / SAMPLE_STEP;
    const i = Math.min(Math.floor(f), this.count - 2);
    const t = f - i;
    out.x = this.xs[i]! + (this.xs[i + 1]! - this.xs[i]!) * t;
    out.y = this.ys[i]! + (this.ys[i + 1]! - this.ys[i]!) * t;
    return out;
  }

  /** Direction angle (radians) of travel at distance `d`. */
  angleAt(d: number): number {
    const i = Math.min(Math.max(0, Math.floor(d / SAMPLE_STEP)), this.count - 4);
    return Math.atan2(this.ys[i + 3]! - this.ys[i]!, this.xs[i + 3]! - this.xs[i]!);
  }

  /** Minimum distance from (x, y) to the path, plus the arc distance of the closest point. */
  closest(x: number, y: number): { dist: number; at: number } {
    let best = Infinity;
    let bestI = 0;
    for (let i = 0; i < this.count; i += 2) {
      const dx = this.xs[i]! - x;
      const dy = this.ys[i]! - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < best) {
        best = d2;
        bestI = i;
      }
    }
    return { dist: Math.sqrt(best), at: Math.min(bestI * SAMPLE_STEP, this.length) };
  }

  /** Polyline for rendering (every `stride` samples). */
  polyline(stride = 4): Vec2[] {
    const pts: Vec2[] = [];
    for (let i = 0; i < this.count; i += stride) pts.push({ x: this.xs[i]!, y: this.ys[i]! });
    pts.push({ x: this.xs[this.count - 1]!, y: this.ys[this.count - 1]! });
    return pts;
  }
}

/** Centripetal-ish uniform Catmull-Rom through all control points (endpoints duplicated). */
export function catmullRom(points: readonly Vec2[], segments: number): Vec2[] {
  const p = [points[0]!, ...points, points[points.length - 1]!];
  const out: Vec2[] = [];
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1]!;
    const p1 = p[i]!;
    const p2 = p[i + 1]!;
    const p3 = p[i + 2]!;
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push({ ...points[points.length - 1]! });
  return out;
}
