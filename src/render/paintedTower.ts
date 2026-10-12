import { Container, Sprite } from 'pixi.js';
import type { GearDef, TowerDef } from '../core/data/towerTypes';
import { GEAR } from './art/gear';
import { drawShadow } from './art/bodies';
import { PAINTED_TOWERS, type PaintedGear, type PaintedTowerSpec } from './art/painted';
import type { TextureBank } from './bake';
import { sampleAttackClip } from './clip';
import { painted, type Strip } from './spriteAtlas';
import type { TowerAnimState, TowerViewLike } from './towerView';

const HALF_PI = Math.PI / 2;

/**
 * A tower drawn from painted frames: a 6-frame body clip plus painted gear pieces anchored to
 * the clip's measured anchors (head top, leading hand). The bow is a separate layer, so the
 * character is never rotated like a pointer: only the bow turns toward the target.
 * Gear pieces without painted art fall back to the code-drawn version so nothing goes missing.
 */
export class PaintedTowerView implements TowerViewLike {
  readonly root = new Container();
  private readonly flip = new Container();
  private readonly behind = new Container();
  private readonly bodySprite: Sprite;
  private readonly front = new Container();
  private readonly strip: Strip;
  private readonly spec: PaintedTowerSpec;
  private readonly s: number;
  private readonly layers = new Map<string, Container>();
  private readonly arts = new Map<string, string | null>();
  private bow: Container | null = null;
  private arrow: Container | null = null;
  private fallbackAim: Container | null = null;
  private fallbackHead: Container | null = null;
  private bowCfg: PaintedGear | null = null;
  private arrowCfg: PaintedGear | null = null;
  private time = Math.random() * 10;
  private flipX = 1;

  constructor(
    readonly def: TowerDef,
    private readonly bank: TextureBank,
  ) {
    this.spec = PAINTED_TOWERS[def.id]!;
    this.strip = painted.strips.get(this.spec.strip)!;
    this.s = this.spec.bodyH / this.strip.meta.cellH;
    this.root.addChild(this.flip);
    const shadow = bank.get('shadow:hero', (d) => drawShadow(d, 26, 8));
    const sh = new Sprite(shadow.texture);
    sh.anchor.set(shadow.ax, shadow.ay);
    this.flip.addChild(sh, this.behind);
    this.bodySprite = new Sprite(this.strip.frames[0]);
    this.bodySprite.anchor.set(this.strip.meta.pivotX, this.strip.meta.baselineY / this.strip.meta.cellH);
    this.bodySprite.scale.set(this.s);
    this.flip.addChild(this.bodySprite, this.front);
    for (const slot of def.slots) {
      const layer = new Container();
      this.layers.set(slot, layer);
      this.arts.set(slot, null);
      // pieces worn on the back / ground sit behind the body, everything else in front
      (slot === 'back' || slot === 'ground' ? this.behind : this.front).addChild(layer);
    }
  }

  private px(
    frame: number,
    a: [number, number] | undefined,
    fallback: [number, number],
  ): { x: number; y: number } {
    const m = this.strip.meta;
    const [ax, ay] = a ?? fallback;
    void frame;
    return { x: (ax - m.cellW * m.pivotX) * this.s, y: (ay - m.baselineY) * this.s };
  }

  private fit(sprite: Sprite, g: PaintedGear, w: number, h: number): void {
    const dim = g.dim === 'h' ? h : g.dim === 'w' ? w : Math.hypot(w, h);
    sprite.scale.set(g.size / dim);
    sprite.anchor.set(g.px ?? 0.5, g.py ?? 0.5);
  }

  setGear(gear: GearDef[]): void {
    const want = new Map(gear.map((g) => [g.slot, g.art]));
    for (const [slot, layer] of this.layers) {
      const art = want.get(slot) ?? null;
      if (art === this.arts.get(slot)) continue;
      this.arts.set(slot, art);
      layer.removeChildren().forEach((c) => c.destroy());
      if (slot === 'mainHand') {
        this.bow = null;
        this.bowCfg = null;
        this.fallbackAim = null;
      }
      if (slot === 'head') this.fallbackHead = null;
      if (slot === 'offHand') {
        this.arrow = null;
        this.arrowCfg = null;
      }
      if (!art) continue;
      const cfg = this.spec.gear[art];
      const item = cfg ? painted.gear.get(cfg.base ?? art) : undefined;
      if (cfg && item) {
        const holder = new Container();
        if (cfg.glow !== undefined) {
          const glow = new Sprite(item.tex);
          this.fit(glow, cfg, item.w, item.h);
          glow.scale.set(glow.scale.x * 1.4, glow.scale.y * 1.12);
          glow.tint = cfg.glow;
          glow.alpha = 0.6;
          glow.blendMode = 'add';
          holder.addChild(glow);
        }
        const sp = new Sprite(item.tex);
        this.fit(sp, cfg, item.w, item.h);
        if (cfg.tint !== undefined) sp.tint = cfg.tint;
        holder.addChild(sp);
        layer.addChild(holder);
        if (cfg.kind === 'bow') {
          this.bow = holder;
          this.bowCfg = cfg;
        } else if (cfg.kind === 'arrow') {
          this.arrow = holder;
          this.arrowCfg = cfg;
          sp.rotation = cfg.rot ?? 0;
        } else {
          holder.position.set(cfg.dx ?? 0, cfg.dy ?? 0);
          holder.rotation = cfg.rot ?? 0;
        }
      } else {
        // no painted art for this piece yet: keep the vector version at a sensible anchor
        const g = GEAR[art];
        if (g) {
          const b = this.bank.get(`gear:${art}`, (d) => g.draw(d));
          const sp = new Sprite(b.texture);
          sp.anchor.set(b.ax, b.ay);
          sp.scale.set(1.1);
          const holder = new Container();
          holder.addChild(sp);
          layer.addChild(holder);
          if (slot === 'mainHand') this.fallbackAim = holder;
          else if (slot === 'head') this.fallbackHead = holder;
          else if (slot === 'companion') holder.position.set(38, 4);
          else if (slot === 'back') holder.position.set(-15, -62);
          else if (slot !== 'offHand') holder.position.set(0, -44);
          else holder.visible = false;
        }
      }
    }
    this.update(0, { facing: 0, slotT: {}, anyT: 99 });
  }

  hasGear(slot: string): string | null {
    return this.arts.get(slot) ?? null;
  }

  update(dt: number, s: TowerAnimState): void {
    this.time += dt;
    const c = Math.cos(s.facing);
    const want = c < -0.15 ? -1 : c > 0.15 ? 1 : this.flipX;
    this.flipX = want;
    this.flip.scale.x = want;
    const aim = Math.max(-1.25, Math.min(1.25, Math.atan2(Math.sin(s.facing), Math.abs(c))));
    const clip = sampleAttackClip(s.readyIn ?? 0, s.since ?? s.slotT.mainHand ?? 99);
    this.bodySprite.texture = this.strip.frames[clip.frame]!;
    const breathe = clip.phase === 'idle' ? Math.sin(this.time * 2.4) * 0.012 : 0;
    this.bodySprite.scale.set(this.s * (1 - breathe * 0.5), this.s * (1 + breathe));
    const a = this.strip.meta.anchors;
    const grip = this.px(clip.frame, a?.grip?.[clip.frame], [82, 90]);
    // string recoils slightly on release
    const pull = -clip.draw * 5;
    if (this.bow && this.bowCfg) {
      this.bow.position.set(grip.x + (this.bowCfg.dx ?? 0), grip.y + (this.bowCfg.dy ?? 0));
      this.bow.rotation = aim;
      this.bow.position.x += Math.cos(aim) * 2;
    }
    if (this.arrow && this.arrowCfg) {
      const back = pull - 4;
      this.arrow.position.set(grip.x + Math.cos(aim) * back, grip.y + Math.sin(aim) * back);
      this.arrow.rotation = aim + (this.arrowCfg.rot ?? 0);
      this.arrow.visible = clip.phase !== 'release' && clip.phase !== 'follow';
    }
    if (this.fallbackAim) {
      this.fallbackAim.position.set(grip.x, grip.y);
      this.fallbackAim.rotation = aim;
    }
    const head = this.px(clip.frame, a?.headTop?.[clip.frame], [40, 8]);
    this.fallbackHead?.position.set(head.x, head.y + 10);
    for (const [slot, layer] of this.layers) {
      const cfg = this.spec.gear[this.arts.get(slot) ?? ''];
      if (cfg?.kind === 'head') layer.position.set(head.x + (cfg.dx ?? 0), head.y + (cfg.dy ?? 0));
    }
    const pet = this.layers.get('companion');
    if (pet) pet.y = Math.sin(this.time * 3 + 1) * 0.6;
    const back = this.layers.get('back');
    if (back) back.rotation = Math.sin(this.time * 1.6) * 0.03 + (clip.phase === 'release' ? -0.05 : 0);
    void HALF_PI;
  }
}
