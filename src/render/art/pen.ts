/**
 * Minimal drawing surface: a structural subset of PIXI.Graphics (v8). Art modules depend only on
 * this type so they stay importable in Node (tests) without loading Pixi.
 */
export interface FillStyle {
  color: number;
  alpha?: number;
}

export interface StrokeStyle {
  width: number;
  color: number;
  alpha?: number;
  join?: 'round' | 'miter' | 'bevel';
  cap?: 'round' | 'butt' | 'square';
  alignment?: number;
}

export interface Pen {
  moveTo(x: number, y: number): this;
  lineTo(x: number, y: number): this;
  bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): this;
  quadraticCurveTo(cx: number, cy: number, x: number, y: number): this;
  arc(cx: number, cy: number, r: number, start: number, end: number, ccw?: boolean): this;
  closePath(): this;
  circle(x: number, y: number, r: number): this;
  ellipse(x: number, y: number, rx: number, ry: number): this;
  rect(x: number, y: number, w: number, h: number): this;
  roundRect(x: number, y: number, w: number, h: number, r: number): this;
  poly(points: number[], close?: boolean): this;
  fill(style: FillStyle): this;
  stroke(style: StrokeStyle): this;
}

export const OUTLINE = 0x1d1410;

export function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

export const shade = (c: number, t = 0.3) => mix(c, 0x1a1020, t);
export const tint = (c: number, t = 0.35) => mix(c, 0xffffff, t);

export interface ShapeOpts {
  /** Outline width; 0 disables. Defaults to the kit's line width. */
  lw?: number;
  alpha?: number;
  outline?: number;
}

/**
 * Cartoon drawing kit: every filled shape gets a thick dark outline by default. Coordinates are
 * in world units; (0, 0) is the part's attachment point.
 */
export class Draw {
  constructor(
    readonly p: Pen,
    readonly lw = 3,
  ) {}

  private finish(color: number, o: ShapeOpts = {}): this {
    this.p.fill({ color, alpha: o.alpha ?? 1 });
    const lw = o.lw ?? this.lw;
    if (lw > 0)
      this.p.stroke({
        width: lw,
        color: o.outline ?? OUTLINE,
        alpha: o.alpha ?? 1,
        join: 'round',
        cap: 'round',
      });
    return this;
  }

  poly(pts: number[], color: number, o?: ShapeOpts): this {
    this.p.poly(pts, true);
    return this.finish(color, o);
  }

  circle(x: number, y: number, r: number, color: number, o?: ShapeOpts): this {
    this.p.circle(x, y, r);
    return this.finish(color, o);
  }

  ellipse(x: number, y: number, rx: number, ry: number, color: number, o?: ShapeOpts): this {
    this.p.ellipse(x, y, rx, ry);
    return this.finish(color, o);
  }

  rect(x: number, y: number, w: number, h: number, color: number, o?: ShapeOpts): this {
    this.p.rect(x, y, w, h);
    return this.finish(color, o);
  }

  rrect(x: number, y: number, w: number, h: number, r: number, color: number, o?: ShapeOpts): this {
    this.p.roundRect(x, y, w, h, r);
    return this.finish(color, o);
  }

  /** Arbitrary path built by `build`, then filled + outlined. */
  shape(build: (p: Pen) => void, color: number, o?: ShapeOpts): this {
    build(this.p);
    return this.finish(color, o);
  }

  /** Stroke-only polyline. */
  line(pts: number[], color: number, width: number, alpha = 1): this {
    this.p.moveTo(pts[0]!, pts[1]!);
    for (let i = 2; i < pts.length; i += 2) this.p.lineTo(pts[i]!, pts[i + 1]!);
    this.p.stroke({ width, color, alpha, cap: 'round', join: 'round' });
    return this;
  }

  /** Thick line with a dark outline (draws outline first, then colour). */
  bar(pts: number[], color: number, width: number): this {
    this.line(pts, OUTLINE, width + this.lw * 2);
    return this.line(pts, color, width);
  }

  curve(
    x0: number,
    y0: number,
    cx: number,
    cy: number,
    x1: number,
    y1: number,
    color: number,
    width: number,
    alpha = 1,
  ): this {
    this.p.moveTo(x0, y0).quadraticCurveTo(cx, cy, x1, y1).stroke({ width, color, alpha, cap: 'round' });
    return this;
  }

  /** Soft glow made of stacked translucent circles (no outline). */
  glow(x: number, y: number, r: number, color: number, alpha = 0.35): this {
    for (let i = 4; i >= 1; i--) {
      this.p.circle(x, y, (r * i) / 4).fill({ color, alpha: alpha / 3 });
    }
    return this;
  }

  /** Highlight blob without outline. */
  hi(x: number, y: number, rx: number, ry: number, color = 0xffffff, alpha = 0.45): this {
    this.p.ellipse(x, y, rx, ry).fill({ color, alpha });
    return this;
  }

  /** Faceted gem. */
  gem(x: number, y: number, r: number, color: number): this {
    this.poly([x, y - r, x + r * 0.8, y, x, y + r, x - r * 0.8, y], color, {
      lw: Math.max(1.5, this.lw * 0.7),
    });
    this.p.poly([x, y - r, x - r * 0.8, y, x, y], true).fill({ color: tint(color, 0.45) });
    return this;
  }

  /** Five-point star. */
  star(x: number, y: number, r: number, color: number, o?: ShapeOpts, points = 5, inner = 0.45): this {
    const pts: number[] = [];
    for (let i = 0; i < points * 2; i++) {
      const rr = i % 2 === 0 ? r : r * inner;
      const a = -Math.PI / 2 + (i * Math.PI) / points;
      pts.push(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    return this.poly(pts, color, o);
  }

  /** Rivets / dots without outline. */
  dots(pts: number[], r: number, color: number): this {
    for (let i = 0; i < pts.length; i += 2) this.p.circle(pts[i]!, pts[i + 1]!, r).fill({ color });
    return this;
  }
}
