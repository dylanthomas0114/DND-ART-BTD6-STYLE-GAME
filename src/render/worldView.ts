import { type Application, Assets, Container, Graphics, Sprite, type Texture } from 'pixi.js';
import { ENEMIES, type EnemyId } from '../core/data/enemies';
import type { TowerId } from '../core/data/towerTypes';
import type { Enemy, Game, Projectile, Tower } from '../core/game';
import { WORLD_H, WORLD_W } from '../core/types';
import { computeGear } from '../core/upgrades';
import {
  BOSSES,
  drawArmorOverlay,
  drawCracks,
  drawEnemy,
  drawIceBlock,
  drawRegenOverlay,
} from './art/enemies';
import { drawDecor, drawMapGround, drawRoads, MAP_MARGIN_X, scatterDecor } from './art/mapArt';
import { DTYPE_COLOR } from './art/palette';
import { Draw } from './art/pen';
import { FX, PROJECTILES } from './art/projectiles';
import type { TextureBank } from './bake';
import { Particles } from './particles';
import { TowerView } from './towerView';
import { TOWERS } from '../core/data/towers';

const ENEMY_TINT: Record<EnemyId, number> = {
  green: 0x7bd63a,
  blue: 0x3a8fe0,
  amber: 0xffb02a,
  violet: 0xa35ae0,
  crimson: 0xe0304a,
  shadow: 0x4a3a6a,
  frost: 0xd6f6ff,
  warded: 0x9a5ae0,
  iron: 0x9aa4ae,
  storm: 0xf2f2f2,
  prismatic: 0xff5fa0,
  stone: 0x9a958c,
  ogre: 0xa8b86a,
  troll: 0x6b9a6a,
  giant: 0x8a8478,
  lich: 0x6fe0a0,
  dragon: 0xc4301f,
};

/** Drawn size: slimes read larger than their hitbox (as in classic tower defense); bosses slightly. */
function visualRadius(t: EnemyId): number {
  const d = ENEMIES[t];
  return Math.round(d.radius * (d.boss ? 1.15 : 1.5));
}

class EnemyView {
  readonly root = new Container();
  readonly body: Sprite;
  private overlays: Record<string, Sprite | undefined> = {};
  private crackStage = -1;
  type: EnemyId;
  seen = 0;
  hpBar: Graphics | null = null;

  constructor(
    private readonly wv: WorldView,
    e: Enemy,
  ) {
    this.type = e.type;
    this.body = new Sprite();
    this.root.addChild(this.body);
    this.setType(e.type);
  }

  setType(t: EnemyId): void {
    this.type = t;
    const r = visualRadius(t);
    const b = this.wv.bank.get(`enemy:${t}`, (d) => drawEnemy(d, t, r), BOSSES[t] ? 3 : 2.5);
    this.body.texture = b.texture;
    this.body.anchor.set(b.ax, b.ay);
    for (const k of Object.keys(this.overlays)) {
      this.overlays[k]?.destroy();
      this.overlays[k] = undefined;
    }
    this.crackStage = -1;
    if (this.hpBar) {
      this.hpBar.destroy();
      this.hpBar = null;
    }
  }

  private overlay(
    key: string,
    draw: Parameters<TextureBank['get']>[1],
    parent: Container = this.root,
  ): Sprite {
    let s = this.overlays[key];
    if (!s) {
      const b = this.wv.bank.get(key, draw);
      s = new Sprite(b.texture);
      s.anchor.set(b.ax, b.ay);
      parent.addChild(s);
      this.overlays[key] = s;
    }
    return s;
  }

  update(e: Enemy, t: number): void {
    if (e.type !== this.type) this.setType(e.type);
    const def = e.def;
    const r = visualRadius(e.type);
    this.root.position.set(e.x, e.y);
    this.root.zIndex = e.y;
    const right = Math.cos(e.angle) >= -0.1;
    const moving = e.frozenT <= 0 && e.stunT <= 0;
    const boss = !!def.boss;
    // hop / waddle
    const phase = e.progress * (boss ? 0.06 : 0.12) + e.uid;
    const hop = moving ? Math.abs(Math.sin(phase)) : 0;
    const hitK = e.hitT < 0.1 ? 1 - e.hitT / 0.1 : 0;
    const sx = (boss ? 1 : 1 + (1 - hop) * 0.08) + hitK * 0.12;
    const sy = (boss ? 1 : 1 - (1 - hop) * 0.1 + hop * 0.06) - hitK * 0.1;
    this.body.scale.set(right ? sx : -sx, sy);
    this.body.y = boss ? -Math.abs(Math.sin(phase)) * 2 : -hop * r * 0.35;
    this.body.rotation = boss ? Math.sin(phase) * 0.04 : 0;
    // status tints
    let tint = 0xffffff;
    if (e.slowT > 0) tint = 0xb8ecff;
    if (e.burnT > 0) tint = 0xffc49a;
    if (hitK > 0.5) tint = 0xffffff;
    this.body.tint = tint;
    this.root.alpha = e.invisible ? 0.42 + Math.sin(t * 6 + e.uid) * 0.1 : 1;
    // overlays
    if (e.armored) {
      const o = this.overlay(`ov:armor:${boss ? 'boss' : 'slime'}:${r}`, (d) => drawArmorOverlay(d, r, boss));
      o.y = this.body.y;
      o.scale.x = right ? 1 : -1;
    }
    if (e.regen) {
      const o = this.overlay(`ov:regen:${r}`, (d) => drawRegenOverlay(d, r));
      o.y = this.body.y;
      o.rotation = Math.sin(t * 3 + e.uid) * 0.08;
    }
    const ice = this.overlays[`ov:ice:${r}`];
    if (e.frozenT > 0) this.overlay(`ov:ice:${r}`, (d) => drawIceBlock(d, r)).visible = true;
    else if (ice) ice.visible = false;
    const stun = this.overlays['ov:stun'];
    if (e.stunT > 0) {
      const s = this.overlay('ov:stun', FX.star!);
      s.visible = true;
      s.position.set(Math.cos(t * 8) * r * 0.5, -r * 1.2 + Math.sin(t * 8) * 4);
      s.scale.set(0.8);
    } else if (stun) stun.visible = false;
    // cracks on shells
    if (def.shell && def.hp > 1) {
      const frac = e.hp / e.maxHp;
      const stage = frac > 0.75 ? -1 : frac > 0.5 ? 0 : frac > 0.25 ? 1 : 2;
      if (stage !== this.crackStage) {
        this.crackStage = stage;
        for (let i = 0; i <= 2; i++) {
          const key = `ov:crack:${e.type}:${i}`;
          const s = this.overlays[key];
          if (s) s.visible = false;
        }
        if (stage >= 0) {
          const key = `ov:crack:${e.type}:${stage}`;
          const cr = boss ? r * 0.7 : r;
          this.overlay(key, (d) => drawCracks(d, cr, stage)).visible = true;
        }
      }
      for (let i = 0; i <= 2; i++) {
        const s = this.overlays[`ov:crack:${e.type}:${i}`];
        if (s) {
          s.y = this.body.y - (boss ? r * 0.4 : 0);
          s.scale.x = right ? 1 : -1;
        }
      }
    }
    if (boss) {
      if (!this.hpBar) {
        this.hpBar = new Graphics();
        this.root.addChild(this.hpBar);
      }
      const w = r * 1.4;
      const frac = Math.max(0, e.hp / e.maxHp);
      this.hpBar.clear();
      this.hpBar.roundRect(-w / 2 - 2, -r * 1.75 - 2, w + 4, 10, 4).fill({ color: 0x1d1410 });
      this.hpBar
        .roundRect(-w / 2, -r * 1.75, w * frac, 6, 3)
        .fill({ color: frac > 0.5 ? 0x7bd63a : frac > 0.25 ? 0xffb02a : 0xe0304a });
    }
  }
}

interface TowerEntry {
  view: TowerView;
  gearKey: string;
  slotT: Record<string, number>;
  anyT: number;
  bounce: number;
}

export interface Layout {
  scale: number;
  x: number;
  y: number;
}

/**
 * Renders a Game: baked map background, depth-sorted towers + enemies, projectiles and pooled
 * particles. It only reads simulation state and reacts to `game.events`.
 */
export class WorldView {
  readonly root = new Container();
  readonly bgLayer = new Container();
  readonly underlay = new Graphics();
  readonly actors = new Container();
  readonly projLayer = new Container();
  readonly particles = new Particles();
  readonly overlay = new Container();
  readonly flash = new Graphics();
  private towers = new Map<number, TowerEntry>();
  private enemies = new Map<number, EnemyView>();
  private projs = new Map<number, Sprite>();
  private projPool: Sprite[] = [];
  private frame = 0;
  private time = 0;
  private shakeT = 0;
  private shakeMag = 0;
  private flashT = 0;
  private flashColor = 0xffffff;
  private lastLeakFlash = -1;
  private readonly unsubs: (() => void)[] = [];
  layout: Layout = { scale: 1, x: 0, y: 0 };
  private base = { x: 0, y: 0 };
  quality: 'low' | 'medium' | 'high' = 'high';

  constructor(
    readonly app: Application,
    readonly game: Game,
    readonly bank: TextureBank,
  ) {
    this.actors.sortableChildren = true;
    this.root.addChild(
      this.bgLayer,
      this.underlay,
      this.actors,
      this.projLayer,
      this.particles.container,
      this.overlay,
    );
    this.flash.rect(-MAP_MARGIN_X, 0, WORLD_W + MAP_MARGIN_X * 2, WORLD_H).fill({ color: 0xffffff });
    this.flash.alpha = 0;
    this.root.addChild(this.flash);
    this.buildBackground();
    this.bindEvents();
  }

  private tex(key: string, draw: Parameters<TextureBank['get']>[1], lw = 3): Texture {
    return this.bank.get(key, draw, lw).texture;
  }

  fx(name: keyof typeof FX & string): Texture {
    return this.tex(`fx:${name}`, FX[name]!, 2);
  }

  private buildBackground(): void {
    const map = this.game.map;
    // Try AI-painted art first (public/assets/maps/<id>.webp); fall back to code-drawn terrain.
    const ground = new Graphics();
    drawMapGround(new Draw(ground, 3), map, false);
    const roads = new Graphics();
    drawRoads(new Draw(roads, 3), map);
    const res = Math.min(this.bank.resolution, 1.5);
    const groundTex = this.app.renderer.generateTexture({
      target: ground,
      resolution: Math.min(res, 4096 / (WORLD_W + MAP_MARGIN_X * 2)),
    });
    const roadTex = this.app.renderer.generateTexture({
      target: roads,
      resolution: Math.min(2, 4096 / WORLD_W),
    });
    const gb = ground.getLocalBounds();
    const rb = roads.getLocalBounds();
    const gs = new Sprite(groundTex);
    gs.position.set(gb.x, gb.y);
    const rs = new Sprite(roadTex);
    rs.position.set(rb.x, rb.y);
    this.bgLayer.addChild(gs, rs);
    ground.destroy();
    roads.destroy();
    void this.tryPaintedBackground(gs);
    // decor (depth-sorted with actors)
    for (const it of scatterDecor(map)) {
      const b = this.bank.get(`decor:${it.kind}:${it.s.toFixed(2)}`, (d) => drawDecor(d, it.kind, it.s));
      const s = new Sprite(b.texture);
      s.anchor.set(b.ax, b.ay);
      s.position.set(it.x, it.y);
      s.zIndex = it.y;
      this.actors.addChild(s);
    }
  }

  private async tryPaintedBackground(fallback: Sprite): Promise<void> {
    const url = `./assets/maps/${this.game.map.id}.webp`;
    try {
      const head = await fetch(url, { method: 'HEAD' });
      if (!head.ok || !(head.headers.get('content-type') ?? '').includes('image')) return;
      const tex = await Assets.load<Texture>(url);
      const s = new Sprite(tex);
      // painted art covers the full 21:9 area
      s.position.set(-MAP_MARGIN_X, 0);
      s.width = WORLD_W + MAP_MARGIN_X * 2;
      s.height = WORLD_H;
      this.bgLayer.addChildAt(s, this.bgLayer.getChildIndex(fallback) + 1);
      fallback.visible = false;
    } catch {
      /* keep the code-drawn fallback */
    }
  }

  /** Fits the 1600×900 world into the given screen rect (CSS px). */
  setLayout(x: number, y: number, w: number, h: number): void {
    const scale = Math.min(w / WORLD_W, h / WORLD_H);
    const ox = x + (w - WORLD_W * scale) / 2;
    const oy = y + (h - WORLD_H * scale) / 2;
    this.layout = { scale, x: ox, y: oy };
    this.base = { x: ox, y: oy };
    this.root.scale.set(scale);
    this.root.position.set(ox, oy);
  }

  toWorld(sx: number, sy: number): { x: number; y: number } {
    return { x: (sx - this.layout.x) / this.layout.scale, y: (sy - this.layout.y) / this.layout.scale };
  }

  shake(mag: number, dur = 0.25): void {
    this.shakeMag = Math.max(this.shakeMag, mag);
    this.shakeT = Math.max(this.shakeT, dur);
  }

  screenFlash(color: number, strength = 0.35): void {
    this.flashColor = color;
    this.flashT = strength;
  }

  // ---------------------------------------------------------------------------------- events
  private bindEvents(): void {
    const ev = this.game.events;
    const P = this.particles;
    this.unsubs.push(
      ev.on('pop', (e) => {
        const col = ENEMY_TINT[e.enemy];
        const big = e.boss;
        const n = big ? 26 : 7;
        P.burst(n, () => {
          const a = Math.random() * Math.PI * 2;
          const sp = (big ? 160 : 90) + Math.random() * (big ? 260 : 120);
          return [
            this.fx('drop'),
            {
              x: e.x,
              y: e.y - 6,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp - 60,
              gravity: 520,
              life: 0.45 + Math.random() * 0.25,
              scale: big ? 1.3 : 0.8,
              scaleTo: 0.3,
              tint: col,
              rot: a + Math.PI / 2,
            },
          ];
        });
        P.spawn(this.fx('ring'), {
          x: e.x,
          y: e.y - 4,
          life: 0.22,
          scale: big ? 0.6 : 0.15,
          scaleTo: big ? 2.4 : 0.75,
          tint: col,
          alpha: 0.8,
        });
        if (big) {
          this.shake(9, 0.35);
          P.burst(10, () => {
            const a = Math.random() * Math.PI * 2;
            return [
              this.fx('smoke'),
              {
                x: e.x + Math.cos(a) * 20,
                y: e.y + Math.sin(a) * 10,
                vx: Math.cos(a) * 40,
                vy: -30,
                life: 0.9,
                scale: 1.4,
                scaleTo: 2.6,
                tint: 0xd8d0c0,
                alpha: 0.6,
              },
            ];
          });
        }
      }),
      ev.on('immune', (e) => {
        if (Math.random() > 0.35) return;
        P.spawn(this.fx('shield'), { x: e.x, y: e.y - 24, vy: -40, life: 0.5, scale: 1.4, scaleTo: 1.1 });
        P.spawn(this.fx('spark'), {
          x: e.x,
          y: e.y - 6,
          life: 0.15,
          scale: 1,
          scaleTo: 1.6,
          tint: 0xcfd6dc,
          add: true,
        });
      }),
      ev.on('explode', (e) => {
        const col = DTYPE_COLOR[e.dtype] ?? 0xffb347;
        const k = e.radius / 50;
        P.spawn(this.fx('soft'), {
          x: e.x,
          y: e.y,
          life: 0.22,
          scale: k * 1.6,
          scaleTo: k * 3.2,
          tint: col,
          add: true,
          alpha: 0.9,
        });
        P.spawn(this.fx('ring'), { x: e.x, y: e.y, life: 0.25, scale: k * 0.3, scaleTo: k * 1.7, tint: col });
        P.burst(Math.round(8 * Math.min(2, k)), () => {
          const a = Math.random() * Math.PI * 2;
          const sp = 160 + Math.random() * 260 * k;
          return [
            this.fx('spark'),
            {
              x: e.x,
              y: e.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              drag: 4,
              life: 0.35,
              scale: 0.7,
              scaleTo: 0.2,
              tint: col,
              add: true,
              stretch: 1.5,
            },
          ];
        });
        P.burst(4, () => [
          this.fx('smoke'),
          {
            x: e.x + (Math.random() - 0.5) * e.radius,
            y: e.y + (Math.random() - 0.5) * e.radius * 0.6,
            vy: -40,
            life: 0.7,
            scale: k,
            scaleTo: k * 2,
            tint: 0x8a8070,
            alpha: 0.45,
          },
        ]);
        if (e.radius > 70) this.shake(4 + k * 2, 0.2);
      }),
      ev.on('beam', (e) => {
        const col = DTYPE_COLOR[e.dtype] ?? 0xffffff;
        const dx = e.x2 - e.x1;
        const dy = e.y2 - e.y1;
        const len = Math.hypot(dx, dy);
        P.spawn(this.fx('beam'), {
          x: (e.x1 + e.x2) / 2,
          y: (e.y1 + e.y2) / 2 - 8,
          life: 0.16,
          rot: Math.atan2(dy, dx),
          sx: len / 64,
          sy: e.dtype === 'piercing' ? 0.5 : 1,
          scale: 1,
          scaleTo: 1,
          tint: col,
          add: true,
        });
        P.spawn(this.fx('spark'), {
          x: e.x2,
          y: e.y2 - 6,
          life: 0.18,
          scale: 1.2,
          scaleTo: 0.4,
          tint: col,
          add: true,
        });
      }),
      ev.on('attack', (e) => {
        const entry = this.towers.get(e.towerUid);
        const tower = this.game.towerByUid(e.towerUid);
        if (!entry || !tower) return;
        const atk = tower.stats.attacks.find((a) => a.id === e.attackId);
        const slot = atk?.anim ?? 'mainHand';
        entry.slotT[slot] = 0;
        entry.anyT = 0;
        if (e.kind === 'melee') {
          const right = Math.cos(e.angle) >= 0;
          P.spawn(this.fx('slash'), {
            x: tower.x + (right ? 30 : -30),
            y: tower.y - 34,
            life: 0.18,
            scale: 1,
            scaleTo: 1.25,
            sx: right ? 1 : -1,
            sy: 1,
            rot: right ? 0.2 : -0.2,
            tint: atk?.effects.burnDps ? 0xffa060 : 0xffffff,
            add: true,
            alpha: 0.9,
          });
        } else if (e.kind === 'aura') {
          const col = DTYPE_COLOR[atk?.dtype ?? 'cold'] ?? 0x9ee8ff;
          const r = this.game.rangeOf(tower) * (atk?.rangeMult ?? 1);
          if ((atk?.damage ?? 0) > 0 || Math.random() < 0.15) {
            P.spawn(this.fx('ring'), {
              x: tower.x,
              y: tower.y,
              life: 0.35,
              scale: 0.2,
              scaleTo: r / 30,
              sy: 0.55,
              tint: col,
              alpha: 0.85,
            });
            P.burst(6, () => {
              const a = Math.random() * Math.PI * 2;
              return [
                this.fx('snow'),
                {
                  x: tower.x + Math.cos(a) * r * 0.6,
                  y: tower.y + Math.sin(a) * r * 0.35,
                  vy: 20,
                  spin: 2,
                  life: 0.8,
                  scale: 0.9,
                  scaleTo: 0.4,
                  tint: col,
                },
              ];
            });
          }
        }
      }),
      ev.on('ability', (e) => {
        this.screenFlash(0xfff1a8, 0.25);
        this.shake(6, 0.3);
        this.particles.spawn(this.fx('ring'), {
          x: e.x,
          y: e.y,
          life: 0.5,
          scale: 0.4,
          scaleTo: 6,
          tint: 0xfff1a8,
          alpha: 0.9,
        });
        this.particles.spawn(this.fx('soft'), {
          x: e.x,
          y: e.y,
          life: 0.4,
          scale: 3,
          scaleTo: 6,
          tint: 0xfff1a8,
          add: true,
        });
      }),
      ev.on('cash', (e) => {
        if (e.x === undefined || e.y === undefined) return;
        P.burst(12, () => [
          this.fx('coin'),
          {
            x: e.x!,
            y: e.y! - 30,
            vx: (Math.random() - 0.5) * 200,
            vy: -200 - Math.random() * 160,
            gravity: 600,
            life: 0.9,
            scale: 1.2,
            spin: 6,
          },
        ]);
      }),
      ev.on('towerPlaced', (e) => this.puff(e.uid, 0xd8c8a8)),
      ev.on('towerUpgraded', (e) => {
        const t = this.game.towerByUid(e.uid);
        if (!t) return;
        P.burst(18, () => {
          const a = Math.random() * Math.PI * 2;
          return [
            this.fx('spark'),
            {
              x: t.x + Math.cos(a) * 26,
              y: t.y - 40 + Math.sin(a) * 34,
              vy: -60,
              life: 0.7,
              scale: 0.9,
              scaleTo: 0.2,
              tint: 0xffe48a,
              add: true,
              spin: 4,
            },
          ];
        });
        P.spawn(this.fx('ring'), {
          x: t.x,
          y: t.y,
          life: 0.4,
          scale: 0.3,
          scaleTo: 2.2,
          sy: 0.5,
          tint: 0xffe48a,
        });
        const entry = this.towers.get(e.uid);
        if (entry) entry.bounce = 0.3;
      }),
      ev.on('towerSold', (e) => {
        const entry = this.towers.get(e.uid);
        if (!entry) return;
        const { x, y } = entry.view.root;
        P.burst(8, () => [
          this.fx('smoke'),
          {
            x: x + (Math.random() - 0.5) * 40,
            y: y - Math.random() * 40,
            vy: -40,
            life: 0.6,
            scale: 1.2,
            scaleTo: 2,
            tint: 0xd8d0c0,
            alpha: 0.7,
          },
        ]);
        P.burst(8, () => [
          this.fx('coin'),
          {
            x,
            y: y - 30,
            vx: (Math.random() - 0.5) * 160,
            vy: -220,
            gravity: 600,
            life: 0.8,
            scale: 1,
            spin: 6,
          },
        ]);
      }),
      ev.on('leak', () => {
        if (this.time - this.lastLeakFlash < 0.6) return;
        this.lastLeakFlash = this.time;
        this.screenFlash(0xff3030, 0.12);
      }),
    );
  }

  private puff(uid: number, color: number): void {
    const t = this.game.towerByUid(uid);
    if (!t) return;
    this.particles.burst(10, (i) => {
      const a = (i / 10) * Math.PI * 2;
      return [
        this.fx('smoke'),
        {
          x: t.x + Math.cos(a) * 18,
          y: t.y + Math.sin(a) * 6,
          vx: Math.cos(a) * 70,
          vy: Math.sin(a) * 20 - 10,
          drag: 3,
          life: 0.5,
          scale: 0.9,
          scaleTo: 1.6,
          tint: color,
          alpha: 0.7,
        },
      ];
    });
  }

  // ---------------------------------------------------------------------------------- frame
  update(dt: number): void {
    this.time += dt;
    this.frame++;
    const g = this.game;
    const f = this.frame;

    // towers
    for (const t of g.towers) this.syncTower(t, dt);
    for (const [uid, entry] of this.towers) {
      if (!g.towerByUid(uid)) {
        entry.view.root.destroy({ children: true });
        this.towers.delete(uid);
      }
    }

    // enemies
    for (const e of g.enemies) {
      let v = this.enemies.get(e.uid);
      if (!v) {
        v = new EnemyView(this, e);
        this.enemies.set(e.uid, v);
        this.actors.addChild(v.root);
      }
      v.seen = f;
      v.update(e, this.time);
      if (e.burnT > 0 && Math.random() < 0.25 * this.particles.density) {
        this.particles.spawn(this.fx('flame'), {
          x: e.x + (Math.random() - 0.5) * e.def.radius,
          y: e.y - e.def.radius * 0.6,
          vy: -50,
          life: 0.4,
          scale: 0.8,
          scaleTo: 0.2,
          tint: 0xff8a2a,
          add: true,
        });
      }
    }
    for (const [uid, v] of this.enemies) {
      if (v.seen !== f) {
        v.root.destroy({ children: true });
        this.enemies.delete(uid);
      }
    }

    // projectiles
    for (const p of g.projectiles) {
      let s = this.projs.get(p.uid);
      if (!s) {
        s = this.projPool.pop() ?? new Sprite();
        const b = this.bank.get(`proj:${p.sprite}`, PROJECTILES[p.sprite] ?? PROJECTILES.arrow!, 2);
        s.texture = b.texture;
        s.anchor.set(b.ax, b.ay);
        s.visible = true;
        this.projLayer.addChild(s);
        this.projs.set(p.uid, s);
      }
      this.syncProjectile(s, p);
      (s as Sprite & { seen?: number }).seen = f;
    }
    for (const [uid, s] of this.projs) {
      if ((s as Sprite & { seen?: number }).seen !== f) {
        s.visible = false;
        this.projLayer.removeChild(s);
        this.projPool.push(s);
        this.projs.delete(uid);
      }
    }

    this.particles.update(dt);

    // camera shake & flash
    if (this.shakeT > 0) {
      this.shakeT -= dt;
      const m = this.shakeMag * Math.max(0, this.shakeT / 0.3);
      this.root.position.set(
        this.base.x + (Math.random() - 0.5) * m * this.layout.scale * 2,
        this.base.y + (Math.random() - 0.5) * m * this.layout.scale * 2,
      );
      if (this.shakeT <= 0) {
        this.shakeMag = 0;
        this.root.position.set(this.base.x, this.base.y);
      }
    }
    if (this.flashT > 0) {
      this.flash.tint = this.flashColor;
      this.flash.alpha = this.flashT;
      this.flashT = Math.max(0, this.flashT - dt * 1.4);
    } else this.flash.alpha = 0;
  }

  private syncTower(t: Tower, dt: number): void {
    let entry = this.towers.get(t.uid);
    if (!entry) {
      const view = new TowerView(t.def, this.bank);
      view.root.position.set(t.x, t.y);
      this.actors.addChild(view.root);
      entry = { view, gearKey: '', slotT: {}, anyT: 99, bounce: 0.35 };
      this.towers.set(t.uid, entry);
    }
    const key = t.tiers.join('');
    if (key !== entry.gearKey) {
      entry.gearKey = key;
      entry.view.setGear(computeGear(t.def, t.tiers));
    }
    for (const k of Object.keys(entry.slotT)) entry.slotT[k]! += dt;
    entry.anyT += dt;
    if (entry.bounce > 0) entry.bounce = Math.max(0, entry.bounce - dt);
    const b = entry.bounce > 0 ? Math.sin((1 - entry.bounce / 0.35) * Math.PI) * 0.18 : 0;
    entry.view.root.scale.set(1 - b * 0.4, 1 + b);
    entry.view.root.zIndex = t.y;
    entry.view.update(dt, { facing: t.facing, slotT: entry.slotT, anyT: entry.anyT });
  }

  private syncProjectile(s: Sprite, p: Projectile): void {
    s.position.set(p.x, p.y);
    if (p.trap) {
      s.rotation = 0;
      s.alpha = Math.min(1, p.life * 2);
    } else {
      s.rotation = Math.atan2(p.vy, p.vx);
      s.alpha = 1;
    }
  }

  /** A preview TowerView for the placement ghost (caller owns it). */
  makeGhost(id: TowerId): TowerView {
    const v = new TowerView(TOWERS[id], this.bank);
    v.setGear(computeGear(TOWERS[id], [0, 0, 0]));
    return v;
  }

  destroy(): void {
    for (const u of this.unsubs) u();
    this.particles.clear();
    this.root.destroy({ children: true });
  }
}
