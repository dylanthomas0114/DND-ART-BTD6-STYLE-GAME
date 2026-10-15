import { Container, Sprite, type Texture } from 'pixi.js';

export interface ParticleOpts {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  life: number;
  scale?: number;
  scaleTo?: number;
  alpha?: number;
  tint?: number;
  rot?: number;
  spin?: number;
  gravity?: number;
  drag?: number;
  add?: boolean;
  /** Stretch along velocity (sparks). */
  stretch?: number;
  sx?: number;
  sy?: number;
}

interface Particle extends Required<Omit<ParticleOpts, 'sx' | 'sy'>> {
  sprite: Sprite;
  age: number;
  sx: number;
  sy: number;
}

/** Pooled sprite particles. Cheap enough for a few hundred live particles on phones. */
export class Particles {
  readonly container = new Container();
  private readonly live: Particle[] = [];
  private readonly pool: Sprite[] = [];
  /** Global multiplier set by the quality tier (0.35 low … 1 high). */
  density = 1;
  maxLive = 900;

  spawn(tex: Texture, o: ParticleOpts): void {
    if (this.live.length >= this.maxLive) return;
    const s = this.pool.pop() ?? new Sprite();
    s.texture = tex;
    s.anchor.set(0.5);
    s.visible = true;
    s.blendMode = o.add ? 'add' : 'normal';
    s.tint = o.tint ?? 0xffffff;
    this.container.addChild(s);
    this.live.push({
      sprite: s,
      age: 0,
      x: o.x,
      y: o.y,
      vx: o.vx ?? 0,
      vy: o.vy ?? 0,
      life: o.life,
      scale: o.scale ?? 1,
      scaleTo: o.scaleTo ?? o.scale ?? 1,
      alpha: o.alpha ?? 1,
      tint: o.tint ?? 0xffffff,
      rot: o.rot ?? 0,
      spin: o.spin ?? 0,
      gravity: o.gravity ?? 0,
      drag: o.drag ?? 0,
      add: !!o.add,
      stretch: o.stretch ?? 0,
      sx: o.sx ?? 1,
      sy: o.sy ?? 1,
    });
  }

  /** Spawn `n` particles scaled by quality density. */
  burst(n: number, make: (i: number) => [Texture, ParticleOpts]): void {
    const count = Math.max(1, Math.round(n * this.density));
    for (let i = 0; i < count; i++) {
      const [t, o] = make(i);
      this.spawn(t, o);
    }
  }

  update(dt: number): void {
    const list = this.live;
    let w = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i]!;
      p.age += dt;
      if (p.age >= p.life) {
        p.sprite.visible = false;
        this.container.removeChild(p.sprite);
        this.pool.push(p.sprite);
        continue;
      }
      const k = p.age / p.life;
      if (p.drag) {
        const f = Math.max(0, 1 - p.drag * dt);
        p.vx *= f;
        p.vy *= f;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      const s = p.scale + (p.scaleTo - p.scale) * k;
      const spr = p.sprite;
      spr.position.set(p.x, p.y);
      if (p.stretch > 0) {
        spr.rotation = Math.atan2(p.vy, p.vx);
        spr.scale.set(s * (1 + p.stretch), s * 0.5);
      } else {
        spr.rotation = p.rot;
        spr.scale.set(s * p.sx, s * p.sy);
      }
      spr.alpha = p.alpha * (k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3);
      list[w++] = p;
    }
    list.length = w;
  }

  get count(): number {
    return this.live.length;
  }

  clear(): void {
    for (const p of this.live) {
      p.sprite.visible = false;
      this.container.removeChild(p.sprite);
      this.pool.push(p.sprite);
    }
    this.live.length = 0;
  }
}
