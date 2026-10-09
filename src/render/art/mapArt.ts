import type { MapDef } from '../../core/data/maps';
import { inEllipse } from '../../core/data/maps';
import { Path } from '../../core/path';
import { Rng } from '../../core/rng';
import { WORLD_H, WORLD_W } from '../../core/types';
import { type Draw, mix, OUTLINE, shade, tint } from './pen';
import { C } from './palette';

/** Extra painted margin on each side so 20:9 screens show art instead of bars (21:9 total). */
export const MAP_MARGIN_X = Math.round((WORLD_H * 21) / 9 - WORLD_W) / 2;
/** Vertical margin so 4:3 tablets show terrain above/below the play area instead of bars. */
export const MAP_MARGIN_Y = 320;

type Decor = MapDef['theme']['decor'][number];

export function drawDecor(d: Draw, kind: Decor, s: number): void {
  switch (kind) {
    case 'tree':
      d.p.ellipse(0, 4, 22 * s, 7 * s).fill({ color: 0x000000, alpha: 0.25 });
      d.rrect(-4 * s, -20 * s, 8 * s, 24 * s, 3, C.woodDark);
      d.circle(-10 * s, -30 * s, 16 * s, 0x3f8f3a);
      d.circle(10 * s, -32 * s, 15 * s, 0x358032);
      d.circle(0, -46 * s, 17 * s, 0x4fa044);
      d.hi(-6 * s, -52 * s, 7 * s, 4 * s, 0xffffff, 0.25);
      d.dots([-12 * s, -32 * s, 8 * s, -40 * s, 2 * s, -26 * s], 2.2 * s, 0xd9483a);
      break;
    case 'pine':
      d.p.ellipse(0, 4, 18 * s, 6 * s).fill({ color: 0x000000, alpha: 0.25 });
      d.rrect(-3 * s, -14 * s, 6 * s, 18 * s, 2, C.woodDark);
      d.poly([-18 * s, -10 * s, 0, -36 * s, 18 * s, -10 * s], 0x2c5e3e);
      d.poly([-14 * s, -26 * s, 0, -50 * s, 14 * s, -26 * s], 0x356e48);
      d.poly([-10 * s, -40 * s, 0, -62 * s, 10 * s, -40 * s], 0x3f7f52);
      break;
    case 'rock':
      d.p.ellipse(0, 4, 18 * s, 6 * s).fill({ color: 0x000000, alpha: 0.25 });
      d.poly([-16 * s, 4 * s, -12 * s, -10 * s, -2 * s, -16 * s, 12 * s, -12 * s, 17 * s, 2 * s], C.stone);
      d.p
        .poly([2 * s, -15 * s, 12 * s, -12 * s, 17 * s, 2 * s, 4 * s, 4 * s], true)
        .fill({ color: shade(C.stone, 0.25) });
      d.hi(-6 * s, -10 * s, 5 * s, 2.5 * s, 0xffffff, 0.3);
      break;
    case 'mushroom':
      d.rrect(-3 * s, -10 * s, 6 * s, 10 * s, 2, C.cloth);
      d.shape(
        (p) =>
          p
            .moveTo(-12 * s, -8 * s)
            .quadraticCurveTo(0, -24 * s, 12 * s, -8 * s)
            .closePath(),
        0xd9483a,
      );
      d.dots([-5 * s, -12 * s, 4 * s, -14 * s, 0, -10 * s], 1.8 * s, 0xffffff);
      break;
    case 'grave':
      d.p.ellipse(0, 3, 14 * s, 5 * s).fill({ color: 0x000000, alpha: 0.25 });
      d.shape(
        (p) =>
          p
            .moveTo(-10 * s, 2)
            .lineTo(-10 * s, -16 * s)
            .quadraticCurveTo(0, -28 * s, 10 * s, -16 * s)
            .lineTo(10 * s, 2)
            .closePath(),
        0x8a8a92,
      );
      d.line([0, -18 * s, 0, -8 * s], shade(0x8a8a92, 0.4), 2);
      d.line([-4 * s, -14 * s, 4 * s, -14 * s], shade(0x8a8a92, 0.4), 2);
      break;
    case 'pillar':
      d.p.ellipse(0, 3, 14 * s, 5 * s).fill({ color: 0x000000, alpha: 0.25 });
      d.rrect(-8 * s, -40 * s, 16 * s, 40 * s, 2, 0xb8b2a6);
      d.rrect(-11 * s, -44 * s, 22 * s, 6 * s, 2, 0xc8c2b6);
      d.line([-3 * s, -38 * s, -3 * s, -4 * s], shade(0xb8b2a6, 0.25), 1.5);
      d.poly([2 * s, -44 * s, 11 * s, -44 * s, 6 * s, -50 * s], 0xc8c2b6, { lw: 1.5 });
      break;
    case 'crystal':
      d.glow(0, -12 * s, 18 * s, 0xff7a3a, 0.3);
      d.poly([-6 * s, 0, -3 * s, -24 * s, 3 * s, -26 * s, 6 * s, 0], 0xff9a4a);
      d.poly([4 * s, 0, 10 * s, -14 * s, 14 * s, 0], 0xd9602a);
      break;
    case 'bush':
      d.p.ellipse(0, 3, 16 * s, 5 * s).fill({ color: 0x000000, alpha: 0.2 });
      d.circle(-8 * s, -6 * s, 9 * s, 0x4f9a3a);
      d.circle(6 * s, -7 * s, 10 * s, 0x5aa844);
      d.circle(-1 * s, -13 * s, 8 * s, 0x64b44c);
      break;
    case 'bones':
      d.line([-10 * s, 0, 8 * s, -4 * s], C.bone, 4 * s);
      d.circle(-11 * s, 0, 2.6 * s, C.bone, { lw: 1.2 });
      d.circle(9 * s, -4 * s, 2.6 * s, C.bone, { lw: 1.2 });
      d.circle(4 * s, 6 * s, 6 * s, C.bone, { lw: 1.6 });
      d.dots([2 * s, 5 * s, 6 * s, 5 * s], 1.2 * s, OUTLINE);
      break;
  }
}

/**
 * Code-drawn map background (fallback when no AI-painted art is present): terrain, water and
 * road. Decor is returned separately so the renderer can depth-sort it with units.
 */
export function drawMapGround(d: Draw, map: MapDef, includeRoad = true): void {
  const [top, bottom] = map.theme.ground;
  const x0 = -MAP_MARGIN_X;
  const x1 = WORLD_W + MAP_MARGIN_X;
  const y0 = -MAP_MARGIN_Y;
  const y1 = WORLD_H + MAP_MARGIN_Y;
  const bands = 32;
  for (let i = 0; i < bands; i++) {
    const k = Math.max(0, Math.min(1, (y0 + ((i + 0.5) * (y1 - y0)) / bands) / WORLD_H));
    d.p
      .rect(x0, y0 + (i * (y1 - y0)) / bands - 1, x1 - x0, (y1 - y0) / bands + 2)
      .fill({ color: mix(top, bottom, k) });
  }
  const rng = new Rng(map.id.length * 7919 + 17);
  // soft terrain blotches
  for (let i = 0; i < 130; i++) {
    const x = rng.range(x0, x1);
    const y = rng.range(y0, y1);
    const r = rng.range(30, 110);
    d.p
      .ellipse(x, y, r, r * 0.55)
      .fill({ color: rng.next() < 0.5 ? tint(top, 0.12) : shade(bottom, 0.12), alpha: 0.35 });
  }
  // grass tufts / pebbles
  for (let i = 0; i < 600; i++) {
    const x = rng.range(x0, x1);
    const y = rng.range(y0, y1);
    const c = rng.next() < 0.5 ? tint(top, 0.25) : shade(bottom, 0.25);
    d.p
      .moveTo(x - 3, y)
      .lineTo(x - 1, y - 6)
      .lineTo(x + 1, y)
      .lineTo(x + 3, y - 5)
      .lineTo(x + 4, y)
      .stroke({ width: 1.4, color: c, alpha: 0.7 });
  }
  // water
  for (const w of map.water) {
    d.p.ellipse(w.x, w.y + 6, w.rx + 8, w.ry + 8).fill({ color: shade(map.theme.ground[1], 0.35) });
    d.ellipse(w.x, w.y, w.rx, w.ry, map.theme.water, { lw: 4, outline: shade(map.theme.water, 0.5) });
    d.p
      .ellipse(w.x - w.rx * 0.1, w.y - w.ry * 0.1, w.rx * 0.82, w.ry * 0.75)
      .fill({ color: tint(map.theme.water, 0.15) });
    for (let i = 0; i < 6; i++) {
      const rx = rng.range(-w.rx * 0.6, w.rx * 0.6);
      const ry = rng.range(-w.ry * 0.5, w.ry * 0.5);
      d.p
        .moveTo(w.x + rx - 10, w.y + ry)
        .quadraticCurveTo(w.x + rx, w.y + ry - 4, w.x + rx + 10, w.y + ry)
        .stroke({ width: 2, color: 0xffffff, alpha: 0.35 });
    }
  }
  if (includeRoad) drawRoads(d, map);
}

export function drawRoads(d: Draw, map: MapDef): void {
  const rw = map.roadWidth;
  for (const pts of map.paths) {
    const path = new Path(pts);
    const poly = path.polyline(3);
    const flat: number[] = poly.flatMap((p) => [p.x, p.y]);
    const stroke = (w: number, color: number, alpha = 1) => {
      d.p.moveTo(flat[0]!, flat[1]!);
      for (let i = 2; i < flat.length; i += 2) d.p.lineTo(flat[i]!, flat[i + 1]!);
      d.p.stroke({ width: w, color, alpha, cap: 'round', join: 'round' });
    };
    stroke(rw + 16, 0x000000, 0.18);
    stroke(rw + 8, map.theme.roadEdge);
    stroke(rw, map.theme.road);
    stroke(rw * 0.55, tint(map.theme.road, 0.12), 0.8);
    // cobbles / ruts
    const rng = new Rng(pts.length * 31 + map.id.length);
    for (let i = 0; i < poly.length; i += 3) {
      const p = poly[i]!;
      const ox = rng.range(-rw * 0.35, rw * 0.35);
      const oy = rng.range(-rw * 0.35, rw * 0.35);
      d.p
        .ellipse(p.x + ox, p.y + oy, rng.range(3, 6), rng.range(2, 4))
        .fill({ color: shade(map.theme.road, 0.18), alpha: 0.6 });
    }
  }
}

export interface DecorItem {
  kind: Decor;
  x: number;
  y: number;
  s: number;
}

/** Deterministic decor placement: blockers get large decor; filler avoids roads and water. */
export function scatterDecor(map: MapDef): DecorItem[] {
  const rng = new Rng(map.id.length * 104729 + 3);
  const paths = map.paths.map((p) => new Path(p));
  const items: DecorItem[] = [];
  for (const b of map.blockers)
    items.push({ kind: rng.pick(map.theme.decor), x: b.x, y: b.y + b.r * 0.4, s: b.r / 22 });
  for (let i = 0; i < 600 && items.length < 64; i++) {
    const x = rng.range(-MAP_MARGIN_X + 20, WORLD_W + MAP_MARGIN_X - 20);
    const y = rng.range(-MAP_MARGIN_Y + 40, WORLD_H + MAP_MARGIN_Y - 10);
    const inPlay = x > 0 && x < WORLD_W;
    if (paths.some((p) => p.closest(x, y).dist < map.roadWidth / 2 + 30)) continue;
    if (map.water.some((w) => inEllipse(w, x, y, 20))) continue;
    // keep the playfield mostly clear: only small decor near the edges inside the play area
    if (inPlay && rng.next() < 0.75 && x > 80 && x < WORLD_W - 80 && y > 80 && y < WORLD_H - 60) continue;
    if (items.some((it) => Math.hypot(it.x - x, it.y - y) < 50)) continue;
    items.push({ kind: rng.pick(map.theme.decor), x, y, s: rng.range(0.7, 1.1) });
  }
  return items;
}
