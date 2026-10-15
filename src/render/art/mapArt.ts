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

/** Lit-from-top-left leaf clump: dark rim behind, body, light cap. */
function clump(d: Draw, x: number, y: number, r: number, body: number): void {
  d.circle(x, y, r, shade(body, 0.28));
  d.p.circle(x + r * 0.08, y - r * 0.1, r * 0.86).fill({ color: body });
  d.p.ellipse(x - r * 0.28, y - r * 0.42, r * 0.5, r * 0.3).fill({ color: tint(body, 0.35), alpha: 0.85 });
}

export function drawDecor(d: Draw, kind: Decor, s: number): void {
  switch (kind) {
    case 'tree': {
      d.p.ellipse(2 * s, 5, 30 * s, 9 * s).fill({ color: 0x0c1a0a, alpha: 0.32 });
      // trunk with flared roots and bark
      d.shape(
        (p) =>
          p
            .moveTo(-11 * s, 6)
            .quadraticCurveTo(-6 * s, 0, -5 * s, -10 * s)
            .lineTo(-4 * s, -30 * s)
            .lineTo(5 * s, -30 * s)
            .lineTo(6 * s, -10 * s)
            .quadraticCurveTo(8 * s, 0, 13 * s, 6)
            .closePath(),
        C.wood,
      );
      d.p.poly([1 * s, -30 * s, 5 * s, -30 * s, 6 * s, -10 * s, 8 * s, 2, 2 * s, 2], true).fill({
        color: C.woodDark,
        alpha: 0.7,
      });
      d.line([-2 * s, -4 * s, -2 * s, -22 * s], shade(C.wood, 0.4), 1.6, 0.8);
      d.line([2 * s, -2 * s, 1 * s, -16 * s], shade(C.wood, 0.4), 1.4, 0.7);
      // canopy: back, middle, front clumps
      clump(d, -20 * s, -40 * s, 17 * s, 0x2f7a33);
      clump(d, 20 * s, -42 * s, 16 * s, 0x2f7a33);
      clump(d, -12 * s, -58 * s, 19 * s, 0x3f9a3d);
      clump(d, 14 * s, -58 * s, 18 * s, 0x3f9a3d);
      clump(d, 0, -44 * s, 20 * s, 0x4fb046);
      clump(d, -4 * s, -70 * s, 16 * s, 0x62c452);
      d.dots([-14 * s, -48 * s, 12 * s, -52 * s, 4 * s, -36 * s, -22 * s, -38 * s], 2.4 * s, 0xe0463a);
      d.dots([-15 * s, -49 * s, 11 * s, -53 * s], 0.9 * s, 0xffb0a0);
      d.dots([-8 * s, -66 * s, 6 * s, -62 * s, 0, -54 * s], 1.4 * s, 0x9be06a);
      break;
    }
    case 'pine': {
      d.p.ellipse(1 * s, 5, 24 * s, 7 * s).fill({ color: 0x07140c, alpha: 0.34 });
      d.rrect(-4 * s, -18 * s, 8 * s, 24 * s, 2, C.woodDark);
      const tier = (y: number, w: number, h: number, body: number): void => {
        d.shape(
          (p) =>
            p
              .moveTo(-w, y)
              .quadraticCurveTo(-w * 0.55, y + 5 * s, -w * 0.35, y)
              .quadraticCurveTo(0, y + 6 * s, w * 0.35, y)
              .quadraticCurveTo(w * 0.55, y + 5 * s, w, y)
              .lineTo(0, y - h)
              .closePath(),
          body,
        );
        d.p
          .poly([-w, y, 0, y - h, -w * 0.1, y - h * 0.4], true)
          .fill({ color: tint(body, 0.22), alpha: 0.7 });
        d.p
          .poly([w, y, 0, y - h, w * 0.15, y - h * 0.5], true)
          .fill({ color: shade(body, 0.35), alpha: 0.55 });
      };
      tier(-8 * s, 24 * s, 26 * s, 0x2a5f40);
      tier(-26 * s, 19 * s, 26 * s, 0x33704a);
      tier(-42 * s, 14 * s, 24 * s, 0x3d825a);
      tier(-56 * s, 9 * s, 20 * s, 0x4a966a);
      break;
    }
    case 'rock': {
      d.p.ellipse(2 * s, 5, 24 * s, 7 * s).fill({ color: 0x0c1a0a, alpha: 0.3 });
      d.poly(
        [-20 * s, 5 * s, -16 * s, -9 * s, -5 * s, -19 * s, 10 * s, -16 * s, 19 * s, -4 * s, 21 * s, 5 * s],
        C.stone,
      );
      d.p
        .poly([-5 * s, -19 * s, 10 * s, -16 * s, 19 * s, -4 * s, 3 * s, -6 * s], true)
        .fill({ color: tint(C.stone, 0.28) });
      d.p
        .poly([3 * s, -6 * s, 19 * s, -4 * s, 21 * s, 5 * s, 2 * s, 5 * s], true)
        .fill({ color: shade(C.stone, 0.32) });
      d.line([-8 * s, -4 * s, -2 * s, 2 * s, -3 * s, 5 * s], shade(C.stone, 0.45), 1.5, 0.8);
      d.p.ellipse(-12 * s, -10 * s, 6 * s, 3 * s).fill({ color: 0x5f9a3a, alpha: 0.85 });
      d.p.ellipse(8 * s, -15 * s, 5 * s, 2.4 * s).fill({ color: 0x6faa44, alpha: 0.8 });
      d.hi(-5 * s, -14 * s, 5 * s, 2 * s, 0xffffff, 0.35);
      break;
    }
    case 'mushroom': {
      d.p.ellipse(0, 3, 17 * s, 5 * s).fill({ color: 0x0c1a0a, alpha: 0.25 });
      const cap = (x: number, y: number, r: number): void => {
        d.rrect(x - r * 0.26, y - r * 1.9, r * 0.52, r * 1.9, 2, C.cloth);
        d.shape(
          (p) =>
            p
              .moveTo(x - r, y - r * 1.5)
              .bezierCurveTo(x - r * 1.05, y - r * 3.2, x + r * 1.05, y - r * 3.2, x + r, y - r * 1.5)
              .quadraticCurveTo(x, y - r * 1.1, x - r, y - r * 1.5)
              .closePath(),
          0xd9483a,
        );
        d.p.circle(x - r * 0.45, y - r * 2.3, r * 0.2).fill({ color: 0xffffff });
        d.p.circle(x + r * 0.2, y - r * 2.7, r * 0.22).fill({ color: 0xffffff });
        d.p.circle(x + r * 0.55, y - r * 1.95, r * 0.17).fill({ color: 0xffffff });
        d.p.ellipse(x - r * 0.45, y - r * 2.85, r * 0.34, r * 0.16).fill({ color: 0xffffff, alpha: 0.3 });
      };
      cap(-10 * s, 0, 6.5 * s);
      cap(10 * s, 1, 5 * s);
      cap(0, 3, 8.5 * s);
      break;
    }
    case 'grave': {
      d.p.ellipse(0, 4, 22 * s, 6 * s).fill({ color: 0x07090f, alpha: 0.36 });
      d.p.ellipse(0, 0, 16 * s, 5 * s).fill({ color: 0x4a3f36 });
      d.shape(
        (p) =>
          p
            .moveTo(-12 * s, 2)
            .lineTo(-12 * s, -19 * s)
            .quadraticCurveTo(0, -33 * s, 12 * s, -19 * s)
            .lineTo(12 * s, 2)
            .closePath(),
        0x8e8e98,
      );
      d.p
        .poly([3 * s, -27 * s, 12 * s, -19 * s, 12 * s, 2, 3 * s, 2], true)
        .fill({ color: shade(0x8e8e98, 0.3), alpha: 0.6 });
      d.line([0, -24 * s, 0, -10 * s], shade(0x8e8e98, 0.5), 2.2);
      d.line([-5 * s, -19 * s, 5 * s, -19 * s], shade(0x8e8e98, 0.5), 2.2);
      d.p.ellipse(-7 * s, -2 * s, 6 * s, 3 * s).fill({ color: 0x4f7a3a, alpha: 0.9 });
      d.hi(-5 * s, -22 * s, 4 * s, 2 * s, 0xffffff, 0.3);
      break;
    }
    case 'pillar': {
      d.p.ellipse(0, 4, 20 * s, 6 * s).fill({ color: 0x07090f, alpha: 0.36 });
      d.rrect(-12 * s, -6 * s, 24 * s, 9 * s, 2, 0xa8a296);
      d.rrect(-9 * s, -48 * s, 18 * s, 44 * s, 2, 0xbab4a8);
      d.p.rect(2 * s, -48 * s, 7 * s, 44 * s).fill({ color: shade(0xbab4a8, 0.28), alpha: 0.6 });
      for (const x of [-4, 0]) d.line([x * s, -46 * s, x * s, -8 * s], shade(0xbab4a8, 0.3), 1.4, 0.8);
      d.rrect(-12 * s, -54 * s, 24 * s, 7 * s, 2, 0xcdc7ba);
      d.line([-6 * s, -30 * s, 0, -24 * s, -3 * s, -18 * s], shade(0xbab4a8, 0.55), 1.4, 0.9);
      d.p.ellipse(-8 * s, -8 * s, 5 * s, 3 * s).fill({ color: 0x4f7a3a, alpha: 0.85 });
      break;
    }
    case 'crystal': {
      d.glow(0, -14 * s, 26 * s, 0xff7a3a, 0.4);
      d.p.ellipse(0, 4, 18 * s, 5 * s).fill({ color: 0x0a0604, alpha: 0.32 });
      const shard = (x: number, w: number, h: number, c: number): void => {
        d.poly([x - w, 2, x - w * 0.7, -h * 0.7, x, -h, x + w * 0.8, -h * 0.65, x + w, 2], c);
        d.p
          .poly([x, -h, x + w * 0.8, -h * 0.65, x + w, 2, x + w * 0.1, 2], true)
          .fill({ color: shade(c, 0.3), alpha: 0.7 });
        d.p
          .poly([x - w * 0.7, -h * 0.7, x, -h, x - w * 0.15, -h * 0.35], true)
          .fill({ color: tint(c, 0.5), alpha: 0.8 });
      };
      shard(-9 * s, 6 * s, 26 * s, 0xff9a4a);
      shard(9 * s, 7 * s, 18 * s, 0xe9702e);
      shard(0, 8 * s, 34 * s, 0xffb060);
      break;
    }
    case 'bush': {
      d.p.ellipse(1 * s, 4, 22 * s, 6 * s).fill({ color: 0x0c1a0a, alpha: 0.28 });
      clump(d, -11 * s, -8 * s, 11 * s, 0x3f8f3a);
      clump(d, 11 * s, -9 * s, 12 * s, 0x4aa044);
      clump(d, 0, -15 * s, 11 * s, 0x5ab84c);
      d.dots([-8 * s, -12 * s, 8 * s, -18 * s, 14 * s, -6 * s, -2 * s, -6 * s], 1.9 * s, 0xf4d24a);
      d.dots([-8 * s, -12 * s, 8 * s, -18 * s], 0.8 * s, 0xffffff);
      break;
    }
    case 'bones': {
      d.p.ellipse(0, 4, 18 * s, 5 * s).fill({ color: 0x0a0806, alpha: 0.3 });
      d.line([-12 * s, 1, 10 * s, -4 * s], C.bone, 4.6 * s);
      d.line([-14 * s, 4 * s, 4 * s, 7 * s], C.bone, 3.6 * s);
      d.circle(-13 * s, 0, 3 * s, C.bone, { lw: 1.4 });
      d.circle(11 * s, -4 * s, 3 * s, C.bone, { lw: 1.4 });
      d.circle(5 * s, 5 * s, 7 * s, C.bone, { lw: 1.8 });
      d.p.ellipse(3 * s, 3 * s, 2 * s, 2.6 * s).fill({ color: OUTLINE });
      d.p.ellipse(8 * s, 3 * s, 2 * s, 2.6 * s).fill({ color: OUTLINE });
      d.p.poly([4 * s, 8 * s, 6 * s, 6 * s, 8 * s, 8 * s], true).fill({ color: OUTLINE });
      break;
    }
  }
}

/** Ground-cover pieces that are scattered as small sprites and baked into the terrain. */
export type Cover =
  'tuft' | 'tuftTall' | 'flower' | 'pebble' | 'edgeStone' | 'reed' | 'lily' | 'moss' | 'crack';

/** `v` picks one of a few variants so a field of tufts or stones does not look stamped. */
export function drawCover(d: Draw, kind: Cover, map: MapDef, v = 0): void {
  const [top, bottom] = map.theme.ground;
  const dry = map.id === 'pass';
  const stoneBase = map.theme.road;
  switch (kind) {
    case 'tuft':
    case 'tuftTall': {
      const h = kind === 'tuftTall' ? 15 : 9;
      const c1 = dry ? 0xb89a54 : tint(top, 0.18 + v * 0.06);
      const c2 = dry ? 0x8a6e36 : shade(bottom, 0.18 + v * 0.05);
      d.p.ellipse(0, 1, 6, 2).fill({ color: 0x000000, alpha: 0.14 });
      d.p
        .moveTo(-5, 0)
        .quadraticCurveTo(-4, -h * 0.6, -7 + v, -h)
        .lineTo(-2, 0)
        .closePath()
        .fill({ color: c2 });
      d.p
        .moveTo(-2, 0)
        .quadraticCurveTo(0, -h * 0.7, 1, -h * 1.15)
        .lineTo(3, 0)
        .closePath()
        .fill({ color: c1 });
      d.p
        .moveTo(2, 0)
        .quadraticCurveTo(4, -h * 0.5, 7 - v, -h * 0.85)
        .lineTo(5.5, 0)
        .closePath()
        .fill({ color: c2 });
      break;
    }
    case 'flower': {
      const petal = [0xffffff, 0xfff08a, 0xffb6d8, 0xc9b6ff][v % 4]!;
      d.p
        .moveTo(0, 0)
        .lineTo(0, -7)
        .stroke({ width: 1.2, color: shade(top, 0.3), alpha: 0.9 });
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        d.p.circle(Math.cos(a) * 2.2, -8 + Math.sin(a) * 2.2, 1.7).fill({ color: petal });
      }
      d.p.circle(0, -8, 1.3).fill({ color: 0xf0a020 });
      break;
    }
    case 'pebble': {
      const c = mix(stoneBase, 0x8a8f96, 0.25 + v * 0.12);
      d.p.ellipse(0.8, 1.4, 5.4, 2.6).fill({ color: 0x000000, alpha: 0.2 });
      d.p.ellipse(0, 0, 5, 3.4).fill({ color: shade(c, 0.35) });
      d.p.ellipse(-0.3, -0.4, 4.2, 2.8).fill({ color: c });
      d.p.ellipse(-1.4, -1.3, 2, 1).fill({ color: tint(c, 0.5), alpha: 0.8 });
      break;
    }
    case 'edgeStone': {
      const c = mix(stoneBase, 0xa8a49a, 0.55 + v * 0.1);
      const w = 8 + v * 2.5;
      const h = 5.5 + v;
      d.p.ellipse(1, 2.2, w + 1, h).fill({ color: 0x000000, alpha: 0.28 });
      d.ellipse(0, 0, w, h, c, { lw: 1.8, outline: shade(map.theme.roadEdge, 0.45) });
      d.p.ellipse(-w * 0.25, -h * 0.35, w * 0.55, h * 0.35).fill({ color: tint(c, 0.5), alpha: 0.75 });
      d.p.ellipse(w * 0.3, h * 0.35, w * 0.5, h * 0.3).fill({ color: shade(c, 0.35), alpha: 0.5 });
      break;
    }
    case 'reed': {
      const g = 0x5a9a3c;
      d.p
        .moveTo(-2, 0)
        .quadraticCurveTo(-4, -14, -8, -22)
        .stroke({ width: 2, color: shade(g, 0.2) });
      d.p.moveTo(0, 0).quadraticCurveTo(0, -18, 1, -30).stroke({ width: 2.2, color: g });
      d.p
        .moveTo(2, 0)
        .quadraticCurveTo(5, -12, 9, -20)
        .stroke({ width: 2, color: tint(g, 0.15) });
      d.p.ellipse(1, -31, 2.4, 6).fill({ color: 0x6b4423 });
      d.p.ellipse(0.4, -33, 0.9, 2.6).fill({ color: 0xc08a5a, alpha: 0.8 });
      break;
    }
    case 'lily': {
      const g = map.id === 'crypt' ? 0x4f8a5a : 0x4aa044;
      d.p.ellipse(0.8, 1.6, 12, 5).fill({ color: 0x000000, alpha: 0.2 });
      d.p
        .moveTo(0, 0)
        .arc(0, 0, 11, 0.5, Math.PI * 2 - 0.35)
        .closePath()
        .fill({ color: g });
      d.p.ellipse(-3, -2, 5, 2.4).fill({ color: tint(g, 0.3), alpha: 0.7 });
      d.p
        .moveTo(0, 0)
        .lineTo(11, 0)
        .stroke({ width: 1, color: shade(g, 0.4) });
      if (v % 2 === 0) {
        d.p.circle(-2, -1, 3.4).fill({ color: 0xffd0e8 });
        d.p.circle(-2, -1, 1.5).fill({ color: 0xffe066 });
      }
      break;
    }
    case 'moss': {
      d.p.ellipse(0, 0, 18 + v * 4, 8 + v * 2).fill({ color: 0x4f8a3a, alpha: 0.2 });
      d.p.ellipse(-3, -1, 11, 5).fill({ color: 0x6aa84a, alpha: 0.16 });
      d.p.ellipse(5, 2, 6, 2.6).fill({ color: 0x7fba58, alpha: 0.14 });
      break;
    }
    case 'crack': {
      const c = shade(bottom, 0.55);
      d.p.moveTo(0, 0).lineTo(8, 3).lineTo(13, 1).lineTo(22, 6).stroke({ width: 1.6, color: c, alpha: 0.85 });
      d.p.moveTo(13, 1).lineTo(16, -6).stroke({ width: 1.2, color: c, alpha: 0.7 });
      d.p.moveTo(8, 3).lineTo(6, 10).stroke({ width: 1.1, color: c, alpha: 0.6 });
      break;
    }
  }
}

/** Terrain gradient plus soft light and dark patches. `soft` stacks rings so patch edges feather out. */
export function drawGroundBase(d: Draw, map: MapDef, soft = false): void {
  const [top, bottom] = map.theme.ground;
  const x0 = -MAP_MARGIN_X;
  const x1 = WORLD_W + MAP_MARGIN_X;
  const y0 = -MAP_MARGIN_Y;
  const y1 = WORLD_H + MAP_MARGIN_Y;
  const bands = soft ? 64 : 32;
  for (let i = 0; i < bands; i++) {
    const k = Math.max(0, Math.min(1, (y0 + ((i + 0.5) * (y1 - y0)) / bands) / WORLD_H));
    d.p
      .rect(x0, y0 + (i * (y1 - y0)) / bands - 1, x1 - x0, (y1 - y0) / bands + 2)
      .fill({ color: mix(top, bottom, k) });
  }
  const rng = new Rng(map.id.length * 7919 + 17);
  for (let i = 0; i < 130; i++) {
    const x = rng.range(x0, x1);
    const y = rng.range(y0, y1);
    const r = rng.range(30, 110);
    const c = rng.next() < 0.5 ? tint(top, 0.12) : shade(bottom, 0.12);
    if (soft) {
      for (let k = 3; k >= 1; k--)
        d.p.ellipse(x, y, (r * k) / 3, (r * k * 0.55) / 3).fill({ color: c, alpha: 0.16 });
    } else {
      d.p.ellipse(x, y, r, r * 0.55).fill({ color: c, alpha: 0.35 });
    }
  }
}

/** Water bodies: the flat fallback look, or a shoreline with depth tones when `rich`. */
export function drawWaterBase(d: Draw, map: MapDef, rich = false): void {
  const rng = new Rng(map.id.length * 5003 + 11);
  for (const w of map.water) {
    if (!rich) {
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
      continue;
    }
    const water = map.theme.water;
    const mud = mix(map.theme.ground[1], 0x5a4630, 0.55);
    // drop shadow, wet bank, bank rim
    d.p.ellipse(w.x + 2, w.y + 10, w.rx + 22, w.ry + 20).fill({ color: 0x000000, alpha: 0.18 });
    d.ellipse(w.x, w.y + 3, w.rx + 16, w.ry + 14, mud, { lw: 3, outline: shade(mud, 0.5) });
    d.p.ellipse(w.x, w.y + 2, w.rx + 9, w.ry + 8).fill({ color: shade(mud, 0.22) });
    // water body: dark rim, deep, mid, shallow
    d.ellipse(w.x, w.y, w.rx + 3, w.ry + 3, shade(water, 0.5), { lw: 3.5, outline: OUTLINE });
    d.p.ellipse(w.x, w.y, w.rx, w.ry).fill({ color: shade(water, 0.18) });
    d.p.ellipse(w.x - 3, w.y - 2, w.rx * 0.86, w.ry * 0.82).fill({ color: water });
    d.p
      .ellipse(w.x - w.rx * 0.1, w.y - w.ry * 0.12, w.rx * 0.66, w.ry * 0.6)
      .fill({ color: tint(water, 0.16) });
    d.p
      .ellipse(w.x - w.rx * 0.22, w.y - w.ry * 0.28, w.rx * 0.34, w.ry * 0.22)
      .fill({ color: tint(water, 0.4), alpha: 0.55 });
    // shore foam
    d.p.ellipse(w.x, w.y, w.rx - 1, w.ry - 1).stroke({ width: 2.5, color: 0xffffff, alpha: 0.3 });
    for (let i = 0; i < 9; i++) {
      const rx = rng.range(-w.rx * 0.6, w.rx * 0.6);
      const ry = rng.range(-w.ry * 0.5, w.ry * 0.5);
      d.p
        .moveTo(w.x + rx - 12, w.y + ry)
        .quadraticCurveTo(w.x + rx, w.y + ry - 4, w.x + rx + 12, w.y + ry)
        .stroke({ width: 2, color: 0xffffff, alpha: 0.28 });
    }
  }
}

/** Crypt floor: irregular flagstones with joints, wear and the odd crack. */
export function drawFlagstones(d: Draw, map: MapDef): void {
  const [top, bottom] = map.theme.ground;
  const rng = new Rng(map.id.length * 6151 + 29);
  const x0 = -MAP_MARGIN_X;
  const y0 = -MAP_MARGIN_Y;
  const sw = 84;
  const sh = 64;
  const cols = Math.ceil((WORLD_W + MAP_MARGIN_X * 2) / sw) + 1;
  const rows = Math.ceil((WORLD_H + MAP_MARGIN_Y * 2) / sh) + 1;
  const jit = (): number => rng.range(-5, 5);
  for (let r = 0; r < rows; r++) {
    const off = (r % 2) * (sw / 2);
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * sw - off;
      const y = y0 + r * sh;
      const k = rng.range(0.15, 0.85);
      const base = mix(top, bottom, k);
      const gap = 2.5;
      const pts = [
        x + gap + jit(),
        y + gap + jit(),
        x + sw - gap + jit(),
        y + gap + jit(),
        x + sw - gap + jit(),
        y + sh - gap + jit(),
        x + gap + jit(),
        y + sh - gap + jit(),
      ];
      d.p.poly(pts, true).fill({ color: base });
      d.p.poly(pts, true).stroke({ width: 1.8, color: shade(bottom, 0.55), alpha: 0.75, join: 'round' });
      d.p
        .moveTo(pts[0]!, pts[1]!)
        .lineTo(pts[2]!, pts[3]!)
        .stroke({ width: 1.6, color: tint(top, 0.3), alpha: 0.35, cap: 'round' });
      d.p
        .moveTo(pts[2]!, pts[3]!)
        .lineTo(pts[4]!, pts[5]!)
        .lineTo(pts[6]!, pts[7]!)
        .stroke({ width: 1.6, color: shade(bottom, 0.5), alpha: 0.35, cap: 'round' });
      if (rng.next() < 0.13) {
        const cx = x + sw * rng.range(0.25, 0.75);
        const cy = y + sh * rng.range(0.25, 0.75);
        d.p
          .moveTo(cx, cy)
          .lineTo(cx + rng.range(-16, 16), cy + rng.range(6, 22))
          .lineTo(cx + rng.range(-22, 22), cy + rng.range(18, 34))
          .stroke({ width: 1.4, color: shade(bottom, 0.6), alpha: 0.7, join: 'round' });
      }
    }
  }
}

/** Dry-land strata and dust for the pass. */
export function drawStrata(d: Draw, map: MapDef): void {
  const [top, bottom] = map.theme.ground;
  const rng = new Rng(map.id.length * 7211 + 5);
  for (let i = 0; i < 26; i++) {
    const y = rng.range(-MAP_MARGIN_Y, WORLD_H + MAP_MARGIN_Y);
    const amp = rng.range(6, 22);
    const ph = rng.range(0, 6);
    const c = rng.next() < 0.5 ? shade(bottom, 0.3) : tint(top, 0.12);
    d.p.moveTo(-MAP_MARGIN_X, y);
    for (let x = -MAP_MARGIN_X; x <= WORLD_W + MAP_MARGIN_X; x += 40)
      d.p.lineTo(x, y + Math.sin(x * 0.006 + ph) * amp + Math.sin(x * 0.017 + ph) * amp * 0.35);
    d.p.stroke({ width: rng.range(4, 12), color: c, alpha: 0.13 });
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
  drawGroundBase(d, map);
  const rng = new Rng(map.id.length * 7919 + 99);
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
  drawWaterBase(d, map);
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
