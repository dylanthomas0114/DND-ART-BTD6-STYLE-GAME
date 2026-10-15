import { Container, Sprite } from 'pixi.js';
import { inEllipse, type MapDef } from '../core/data/maps';
import { Path } from '../core/path';
import { Rng } from '../core/rng';
import { WORLD_H, WORLD_W } from '../core/types';
import { type Ambient, drawAmbient } from './art/ambientArt';
import { drawCover, MAP_MARGIN_X } from './art/mapArt';
import type { TextureBank } from './bake';
import { unit, wind } from './wind';

export type Quality = 'low' | 'medium' | 'high';

/** A decor sprite the world view placed, so the wind can sway it from its base. */
export interface DecorRef {
  sprite: Sprite;
  kind: string;
  x: number;
  y: number;
}

/** How far each kind leans in the wind (radians of skew at full gust). */
const SWAY: Record<string, number> = { tree: 0.085, pine: 0.05, bush: 0.11, mushroom: 0.06, crystal: 0 };

interface Drifter {
  s: Sprite;
  kind: Ambient;
  seed: number;
  x: number;
  y: number;
  /** Anchor for butterflies, which flutter around a point. */
  ax: number;
  ay: number;
  life: number;
  /** Which quality tier this one belongs to: it hides below that tier. */
  tier: 1 | 2;
}

const X0 = -MAP_MARGIN_X;
const X1 = WORLD_W + MAP_MARGIN_X;
const Y0 = -60;
const Y1 = WORLD_H + 60;

/**
 * Everything on the map that moves but is not a unit: water ripples and glints, grass and canopies
 * swaying in a travelling wind, cloud shadows, and drifting leaves, butterflies, wisps or embers
 * per map. Purely visual: it reads no game state and never touches the simulation. It runs on
 * real time (so water keeps moving on the pause screen) and sheds work on lower quality tiers.
 */
export class MapLife {
  /** Above the terrain, below units. */
  readonly under = new Container();
  /** Above units: cloud shadows and drifting particles. */
  readonly over = new Container();
  private t = 4;
  private quality: Quality | null = null;
  private readonly reduced: boolean;
  private readonly tufts: { s: Sprite; x: number; y: number; seed: number; tier: 1 | 2 }[] = [];
  private readonly rings: { s: Sprite; cx: number; cy: number; rx: number; ry: number; phase: number }[] = [];
  private readonly glints: { s: Sprite; seed: number }[] = [];
  private readonly reeds: { s: Sprite; x: number; seed: number }[] = [];
  private readonly lilies: { s: Sprite; y: number; rot: number; seed: number }[] = [];
  private readonly clouds: { s: Sprite; vx: number; tier: 1 | 2 }[] = [];
  private readonly drifters: Drifter[] = [];
  private readonly mists: { s: Sprite; vx: number; seed: number }[] = [];

  constructor(
    private readonly bank: TextureBank,
    private readonly map: MapDef,
    private readonly decor: DecorRef[],
  ) {
    this.reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.under.eventMode = 'none';
    this.over.eventMode = 'none';
    this.buildTufts();
    this.buildWater();
    this.buildClouds();
    this.buildDrifters();
    this.update(0, 'high');
  }

  private ambient(kind: Ambient, v = 0): Sprite {
    const b = this.bank.get(`amb:${this.map.id}:${kind}:${v}`, (d) => drawAmbient(d, kind, this.map, v), 0);
    const s = new Sprite(b.texture);
    s.anchor.set(b.ax, b.ay);
    return s;
  }

  private buildTufts(): void {
    const map = this.map;
    const count = map.id === 'glade' ? 170 : map.id === 'pass' ? 80 : 0;
    const paths = map.paths.map((p) => new Path(p));
    const rng = new Rng(map.id.length * 6007 + 13);
    for (let i = 0; i < count * 4 && this.tufts.length < count; i++) {
      const x = rng.range(X0 + 10, X1 - 10);
      const y = rng.range(Y0, Y1);
      if (map.water.some((w) => inEllipse(w, x, y, 14))) continue;
      if (paths.some((p) => p.closest(x, y).dist < map.roadWidth / 2 + 14)) continue;
      const tall = rng.next() < 0.45;
      const v = rng.int(0, 3);
      const b = this.bank.get(
        `cover:${map.id}:${tall ? 'tuftTall' : 'tuft'}:${v}`,
        (d) => drawCover(d, tall ? 'tuftTall' : 'tuft', map, v),
        0,
      );
      const s = new Sprite(b.texture);
      s.anchor.set(b.ax, b.ay);
      s.position.set(x, y);
      s.scale.set(rng.range(1.05, 1.6));
      this.under.addChild(s);
      this.tufts.push({ s, x, y, seed: rng.next() * 6.28, tier: this.tufts.length % 5 < 3 ? 1 : 2 });
    }
  }

  private buildWater(): void {
    const map = this.map;
    const rng = new Rng(map.id.length * 4513 + 3);
    for (const w of map.water) {
      for (let i = 0; i < 3; i++) {
        const s = this.ambient('ring');
        s.position.set(w.x, w.y);
        this.under.addChild(s);
        this.rings.push({ s, cx: w.x, cy: w.y, rx: w.rx, ry: w.ry, phase: i / 3 });
      }
      const n = Math.max(5, Math.round((w.rx + w.ry) / 20));
      for (let i = 0; i < n; i++) {
        const a = rng.range(0, Math.PI * 2);
        const r = Math.sqrt(rng.next()) * 0.82;
        const s = this.ambient('glint');
        s.position.set(w.x + Math.cos(a) * w.rx * r, w.y + Math.sin(a) * w.ry * r);
        s.scale.set(rng.range(0.7, 1.4));
        this.under.addChild(s);
        this.glints.push({ s, seed: rng.next() * 6.28 });
      }
      this.buildShore(w, rng);
    }
  }

  /** Lily pads that bob and reeds that sway around one pond. */
  private buildShore(w: MapDef['water'][number], rng: Rng): void {
    const map = this.map;
    const paths = map.paths.map((p) => new Path(p));
    const cover = (kind: 'lily' | 'reed', v: number): Sprite => {
      const b = this.bank.get(`cover:${map.id}:${kind}:${v}`, (d) => drawCover(d, kind, map, v), 0);
      const s = new Sprite(b.texture);
      s.anchor.set(b.ax, b.ay);
      return s;
    };
    const pads = Math.max(2, Math.round((w.rx + w.ry) / 45));
    for (let i = 0; i < pads; i++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(0.2, 0.78);
      const s = cover('lily', i % 2);
      const y = w.y + Math.sin(a) * w.ry * r;
      s.position.set(w.x + Math.cos(a) * w.rx * r, y);
      s.scale.set(rng.range(0.7, 1.2));
      const rot = rng.range(-0.6, 0.6);
      s.rotation = rot;
      this.under.addChild(s);
      this.lilies.push({ s, y, rot, seed: rng.next() * 6.28 });
    }
    const n = Math.round((w.rx + w.ry) / 11);
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(1.02, 1.16);
      const x = w.x + Math.cos(a) * (w.rx + 6) * r;
      const y = w.y + Math.sin(a) * (w.ry + 6) * r;
      if (paths.some((p) => p.closest(x, y).dist < map.roadWidth / 2 + 10)) continue;
      const s = cover('reed', 0);
      s.position.set(x, y);
      s.scale.set(rng.range(0.7, 1.15));
      this.under.addChild(s);
      this.reeds.push({ s, x, seed: rng.next() * 6.28 });
    }
  }

  private buildClouds(): void {
    const rng = new Rng(this.map.id.length * 3331 + 1);
    const n = this.map.id === 'crypt' ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const s = this.ambient('cloud');
      s.position.set(rng.range(X0, X1), rng.range(120, WORLD_H - 120));
      s.scale.set(rng.range(0.9, 1.5), rng.range(0.9, 1.3));
      this.over.addChild(s);
      this.clouds.push({ s, vx: rng.range(6, 11), tier: i === 0 ? 1 : 2 });
    }
  }

  private buildDrifters(): void {
    const map = this.map;
    const rng = new Rng(map.id.length * 2377 + 19);
    const add = (kind: Ambient, count: number, variants: number, add = false): void => {
      for (let i = 0; i < count; i++) {
        const s = this.ambient(kind, i % variants);
        if (add) s.blendMode = 'add';
        const x = rng.range(X0, X1);
        const y = rng.range(Y0, Y1);
        s.position.set(x, y);
        this.over.addChild(s);
        this.drifters.push({
          s,
          kind,
          seed: rng.next() * 100,
          x,
          y,
          ax: x,
          ay: y,
          life: rng.next(),
          tier: i % 5 < 3 ? 1 : 2,
        });
      }
    };
    if (map.id === 'glade') {
      add('leaf', 12, 4);
      add('butterfly', 5, 4);
      add('mote', 16, 1, true);
    } else if (map.id === 'crypt') {
      add('wisp', 16, 1, true);
      for (let i = 0; i < 4; i++) {
        const s = this.ambient('mist');
        s.position.set(rng.range(X0, X1), rng.range(100, WORLD_H - 100));
        s.scale.set(rng.range(1.1, 1.8));
        this.over.addChild(s);
        this.mists.push({ s, vx: rng.range(3, 6), seed: rng.next() * 6 });
      }
    } else {
      add('ember', 18, 1, true);
      add('ash', 14, 1);
      for (let i = 0; i < 2; i++) {
        const s = this.ambient('mist');
        s.tint = 0xe0c090;
        s.position.set(rng.range(X0, X1), rng.range(160, WORLD_H - 100));
        s.scale.set(rng.range(1.2, 1.8));
        this.over.addChild(s);
        this.mists.push({ s, vx: rng.range(5, 9), seed: rng.next() * 6 });
      }
    }
  }

  private applyQuality(q: Quality): void {
    this.quality = q;
    const keep = (tier: 1 | 2): boolean => q === 'high' || (q === 'medium' && tier === 1);
    for (const t of this.tufts) t.s.visible = keep(t.tier);
    for (const c of this.clouds) c.s.visible = keep(c.tier);
    for (const d of this.drifters) d.s.visible = keep(d.tier);
    for (const m of this.mists) m.s.visible = q !== 'low';
  }

  update(dt: number, quality: Quality): void {
    if (quality !== this.quality) this.applyQuality(quality);
    if (!this.reduced) this.t += dt;
    const t = this.t;

    for (const d of this.decor) {
      const a = SWAY[d.kind] ?? 0;
      if (a) d.sprite.skew.x = wind(t, d.x, d.y) * a + Math.sin(t * 1.3 + d.x * 0.05) * a * 0.18;
    }
    for (const g of this.tufts) {
      if (!g.s.visible) continue;
      g.s.skew.x = wind(t, g.x, g.y) * 0.42 + Math.sin(t * 2.1 + g.seed) * 0.05;
    }
    for (const r of this.rings) {
      const p = (t * 0.2 + r.phase) % 1;
      const k = 0.12 + 0.88 * p;
      r.s.scale.set((r.rx / 100) * k * 0.9, (r.ry / 100) * k * 0.9);
      r.s.alpha = 0.8 * (1 - p) * Math.min(1, p * 6);
    }
    for (const e of this.reeds) e.s.skew.x = wind(t, e.x, e.s.y) * 0.3 + Math.sin(t * 1.7 + e.seed) * 0.06;
    for (const l of this.lilies) {
      l.s.rotation = l.rot + Math.sin(t * 0.7 + l.seed) * 0.1;
      l.s.y = l.y + Math.sin(t * 1.1 + l.seed) * 0.8;
    }
    for (const g of this.glints) {
      const v = Math.max(0, Math.sin(t * 1.7 + g.seed * 5));
      g.s.alpha = v * v;
      g.s.rotation = Math.sin(t * 0.5 + g.seed) * 0.4;
    }
    if (this.quality !== 'low') this.moveWeather(dt, t);
  }

  private moveWeather(dt: number, t: number): void {
    const span = X1 - X0;
    for (const c of this.clouds) {
      if (!c.s.visible) continue;
      if (!this.reduced) c.s.x += c.vx * dt;
      if (c.s.x > X1 + 420) c.s.x -= span + 840;
    }
    for (const m of this.mists) {
      if (!m.s.visible) continue;
      if (!this.reduced) m.s.x += m.vx * dt;
      if (m.s.x > X1 + 260) m.s.x -= span + 520;
      m.s.alpha = 0.7 + Math.sin(t * 0.3 + m.seed) * 0.3;
    }
    for (const d of this.drifters) {
      if (!d.s.visible) continue;
      const w = wind(t, d.x, d.y);
      const s = d.s;
      switch (d.kind) {
        case 'leaf': {
          if (!this.reduced) {
            d.x += (16 + 14 * unit(d.seed) + w * 12) * dt;
            d.y += (7 + 5 * unit(d.seed + 3)) * dt + Math.sin(t * 1.4 + d.seed) * 14 * dt;
          }
          if (d.x > X1 + 20 || d.y > Y1 + 20) {
            d.x = X0 - 20;
            d.y = Y0 + unit(d.seed + t) * (Y1 - Y0) * 0.7;
          }
          s.position.set(d.x, d.y);
          s.rotation = t * (0.8 + unit(d.seed)) + d.seed;
          s.scale.set(0.9 + Math.sin(t * 2 + d.seed) * 0.35, 1);
          break;
        }
        case 'butterfly': {
          const px = d.ax + Math.cos(t * 0.31 + d.seed) * 150 + Math.sin(t * 0.7 + d.seed * 2) * 40;
          const py = d.ay + Math.sin(t * 0.43 + d.seed) * 70 + Math.sin(t * 1.9 + d.seed) * 8;
          s.rotation = Math.atan2(py - s.y, px - s.x) + Math.PI / 2;
          s.position.set(px, py);
          s.scale.set(
            0.85 + Math.abs(Math.sin(t * 13 + d.seed)) * 0.2,
            0.55 + Math.abs(Math.sin(t * 13 + d.seed)) * 0.45,
          );
          break;
        }
        case 'mote': {
          if (!this.reduced) {
            d.y -= (4 + 3 * unit(d.seed)) * dt;
            d.x += w * 8 * dt;
          }
          if (d.y < Y0) d.y = Y1;
          s.position.set(d.x + Math.sin(t * 0.6 + d.seed) * 10, d.y);
          s.alpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.9 + d.seed));
          break;
        }
        case 'wisp': {
          if (!this.reduced) d.y -= (6 + 5 * unit(d.seed)) * dt;
          if (d.y < Y0) {
            d.y = Y1;
            d.x = X0 + unit(d.seed + t) * (X1 - X0);
          }
          s.position.set(d.x + Math.sin(t * 0.5 + d.seed) * 28 + w * 12, d.y);
          s.alpha = 0.5 + 0.5 * Math.sin(t * 1.1 + d.seed);
          s.scale.set(0.8 + 0.4 * Math.sin(t * 0.8 + d.seed * 2));
          break;
        }
        case 'ember': {
          if (!this.reduced) d.y -= (16 + 12 * unit(d.seed)) * dt;
          if (d.y < Y0) {
            d.y = Y1;
            d.x = X0 + unit(d.seed + t) * (X1 - X0);
          }
          const k = (d.y - Y0) / (Y1 - Y0);
          s.position.set(d.x + Math.sin(t * 1.3 + d.seed) * 12 + w * 18, d.y);
          s.alpha = Math.min(1, k * 1.4) * (0.55 + 0.45 * Math.sin(t * 9 + d.seed));
          break;
        }
        case 'ash': {
          if (!this.reduced) {
            d.x += (20 + 10 * unit(d.seed) + w * 14) * dt;
            d.y += (6 + Math.sin(t * 1.1 + d.seed) * 6) * dt;
          }
          if (d.x > X1 + 20) d.x = X0 - 20;
          if (d.y > Y1) d.y = Y0;
          s.position.set(d.x, d.y);
          s.rotation = t * 0.9 + d.seed;
          break;
        }
        default:
          break;
      }
    }
  }

  destroy(): void {
    this.under.destroy({ children: true });
    this.over.destroy({ children: true });
  }
}
