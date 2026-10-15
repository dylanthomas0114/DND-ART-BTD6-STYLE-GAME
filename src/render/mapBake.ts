import { type Application, Container, Graphics, Rectangle, Sprite, type Texture } from 'pixi.js';
import { inEllipse, type MapDef } from '../core/data/maps';
import { Path } from '../core/path';
import { Rng } from '../core/rng';
import { WORLD_H, WORLD_W } from '../core/types';
import { bakeFlat, type TextureBank } from './bake';
import {
  type Cover,
  drawCover,
  drawFlagstones,
  drawGroundBase,
  drawStrata,
  drawWaterBase,
  MAP_MARGIN_X,
  MAP_MARGIN_Y,
} from './art/mapArt';
import { Draw, mix, shade, tint } from './art/pen';

export interface BakedLayer {
  texture: Texture;
  x: number;
  y: number;
}

/** A cover sprite factory: one baked texture per kind and variant, shared by every instance. */
function coverSprite(bank: TextureBank, map: MapDef, kind: Cover, v = 0): Sprite {
  const b = bank.get(`cover:${map.id}:${kind}:${v}`, (d) => drawCover(d, kind, map, v), 0);
  const s = new Sprite(b.texture);
  s.anchor.set(b.ax, b.ay);
  return s;
}

/** Fine speckle that gives flat colour a painted, grainy surface (drawn straight into the terrain). */
function drawGrain(g: Graphics, map: MapDef, x0: number, y0: number, w: number, h: number): void {
  const rng = new Rng(map.id.length * 3571 + 41);
  const [top, bottom] = map.theme.ground;
  const light = tint(top, 0.5);
  const dark = shade(bottom, 0.5);
  const n = Math.round((w * h) / 1500);
  for (let i = 0; i < n; i++) {
    const isLight = rng.next() < 0.5;
    g.circle(x0 + rng.range(0, w), y0 + rng.range(0, h), rng.range(0.6, 1.7)).fill({
      color: isLight ? light : dark,
      alpha: isLight ? 0.12 : 0.15,
    });
  }
}

interface Scatter {
  rng: Rng;
  paths: Path[];
  roadClear: number;
  keepOut: (x: number, y: number, pad: number) => boolean;
}

function scatter(map: MapDef): Scatter {
  const paths = map.paths.map((p) => new Path(p));
  return {
    rng: new Rng(map.id.length * 9973 + 7),
    paths,
    roadClear: map.roadWidth / 2 + 8,
    keepOut: (x, y, pad) =>
      map.water.some((w) => inEllipse(w, x, y, pad)) ||
      paths.some((p) => p.closest(x, y).dist < map.roadWidth / 2 + pad),
  };
}

/**
 * Bakes the terrain (ground, water, ground cover, grain) into one texture. Everything here is
 * static; moving things (water ripples, swaying grass, clouds, drifting leaves) live in `MapLife`.
 */
export function bakeGround(app: Application, bank: TextureBank, map: MapDef, resolution: number): BakedLayer {
  const x0 = -MAP_MARGIN_X;
  const y0 = -MAP_MARGIN_Y;
  const w = WORLD_W + MAP_MARGIN_X * 2;
  const h = WORLD_H + MAP_MARGIN_Y * 2;
  const root = new Container();
  const g = new Graphics();
  const d = new Draw(g, 3);
  drawGroundBase(d, map, true);
  if (map.id === 'crypt') drawFlagstones(d, map);
  if (map.id === 'pass') drawStrata(d, map);
  drawWaterBase(d, map, true);
  root.addChild(g);

  drawGrain(g, map, x0, y0, w, h);

  const sc = scatter(map);
  const cover = new Container();
  root.addChild(cover);
  const put = (kind: Cover, count: number, variants: number, pad: number, tries = 3): void => {
    for (let i = 0; i < count; i++) {
      for (let t = 0; t < tries; t++) {
        const x = sc.rng.range(x0 + 6, x0 + w - 6);
        const y = sc.rng.range(y0 + 8, y0 + h - 4);
        if (sc.keepOut(x, y, pad)) continue;
        const s = coverSprite(bank, map, kind, sc.rng.int(0, variants));
        s.position.set(x, y);
        const k = sc.rng.range(0.8, 1.25);
        s.scale.set(sc.rng.next() < 0.5 ? k : -k, k);
        cover.addChild(s);
        break;
      }
    }
  };
  // depth-sort the little props by y so overlaps read correctly
  if (map.id === 'glade') {
    put('tuft', 900, 3, 16);
    put('tuftTall', 140, 3, 18);
    put('flower', 170, 4, 14);
    put('pebble', 90, 3, 14);
    put('moss', 26, 3, 24);
  } else if (map.id === 'crypt') {
    put('moss', 70, 3, 20);
    put('pebble', 140, 3, 14);
    put('tuft', 18, 3, 16);
    put('crack', 90, 1, 14);
  } else {
    put('crack', 160, 1, 14);
    put('pebble', 340, 3, 12);
    put('tuft', 240, 3, 16);
    put('moss', 0, 1, 0);
  }
  cover.children.sort((a, b) => a.y - b.y);

  const tex = bakeFlat(app, root, new Rectangle(x0, y0, w, h), resolution);
  root.destroy({ children: true });
  return { texture: tex, x: x0, y: y0 };
}

/** Unit normal and tangent of a polyline at index i. */
function frameAt(poly: { x: number; y: number }[], i: number): { tx: number; ty: number } {
  const a = poly[Math.max(0, i - 1)]!;
  const b = poly[Math.min(poly.length - 1, i + 1)]!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { tx: dx / len, ty: dy / len };
}

/**
 * Bakes the roads: layered ribbon (shadow, bank, surface, worn centre) with edge stones, pebbles
 * and per-map surface detail. Drawn from the authoritative path geometry so it always lines up.
 */
export function bakeRoads(app: Application, bank: TextureBank, map: MapDef, resolution: number): BakedLayer {
  const root = new Container();
  const g = new Graphics();
  const d = new Draw(g, 3);
  const rw = map.roadWidth;
  const rng = new Rng(map.paths.length * 131 + map.id.length * 17 + 3);
  const props = new Container();
  const roadPaths = map.paths.map((pts) => new Path(pts));
  const polys = roadPaths.map((rp) => rp.polyline(3));
  for (const [pi, poly] of polys.entries()) {
    const onOtherRoad = (x: number, y: number): boolean =>
      roadPaths.some((rp, j) => j !== pi && rp.closest(x, y).dist < rw / 2 - 5);
    const flat = poly.flatMap((p) => [p.x, p.y]);
    const stroke = (width: number, color: number, alpha = 1): void => {
      d.p.moveTo(flat[0]!, flat[1]!);
      for (let i = 2; i < flat.length; i += 2) d.p.lineTo(flat[i]!, flat[i + 1]!);
      d.p.stroke({ width, color, alpha, cap: 'round', join: 'round' });
    };
    stroke(rw + 26, 0x000000, 0.1);
    stroke(rw + 18, 0x000000, 0.14);
    stroke(rw + 10, shade(map.theme.roadEdge, 0.3));
    stroke(rw + 5, map.theme.roadEdge);
    stroke(rw, mix(map.theme.road, map.theme.roadEdge, 0.18));
    stroke(rw * 0.82, map.theme.road);
    stroke(rw * 0.5, tint(map.theme.road, 0.14), 0.8);
    stroke(rw * 0.2, shade(map.theme.road, 0.16), 0.22);
    // joints across the road in the crypt, like paving
    if (map.id === 'crypt') {
      for (let i = 4; i < poly.length - 4; i += 9) {
        const p = poly[i]!;
        const { tx, ty } = frameAt(poly, i);
        const nx = -ty;
        const ny = tx;
        d.p
          .moveTo(p.x + nx * rw * 0.5, p.y + ny * rw * 0.5)
          .lineTo(p.x - nx * rw * 0.5, p.y - ny * rw * 0.5)
          .stroke({ width: 1.6, color: shade(map.theme.road, 0.45), alpha: 0.55 });
      }
    }
    // edge stones and interior pebbles
    for (let i = 2; i < poly.length - 2; i += 4) {
      const p = poly[i]!;
      const { tx, ty } = frameAt(poly, i);
      const nx = -ty;
      const ny = tx;
      for (const side of [-1, 1]) {
        const off = side * (rw / 2 + 1 + rng.range(-1.5, 1.5));
        const sx = p.x + nx * off + tx * rng.range(-2, 2);
        const sy = p.y + ny * off + ty * rng.range(-2, 2);
        const v = rng.int(0, 3);
        if (onOtherRoad(sx, sy)) continue;
        const s = coverSprite(bank, map, 'edgeStone', v);
        s.position.set(sx, sy);
        s.rotation = Math.atan2(ty, tx) + rng.range(-0.2, 0.2);
        const k = rng.range(0.8, 1.15);
        s.scale.set(k);
        props.addChild(s);
      }
      if (rng.next() < 0.55) {
        const off = rng.range(-rw * 0.36, rw * 0.36);
        const v = rng.int(0, 3);
        if (onOtherRoad(p.x + nx * off, p.y + ny * off)) continue;
        const s = coverSprite(bank, map, 'pebble', v);
        s.position.set(p.x + nx * off, p.y + ny * off);
        s.scale.set(rng.range(0.6, 1));
        props.addChild(s);
      }
    }
  }
  root.addChild(g, props);
  const b = root.getLocalBounds();
  const frame = new Rectangle(
    Math.floor(b.x) - 2,
    Math.floor(b.y) - 2,
    Math.ceil(b.width) + 4,
    Math.ceil(b.height) + 4,
  );
  const tex = bakeFlat(app, root, frame, resolution);
  root.destroy({ children: true });
  return { texture: tex, x: frame.x, y: frame.y };
}
