import { Container, Sprite } from 'pixi.js';
import type { GearDef, TowerDef } from '../core/data/towerTypes';
import { drawArm, drawHead, drawShadow, drawTorso, humanoidAnchors, LOOKS, type Look } from './art/bodies';
import { GEAR, type GearArt, type Hold } from './art/gear';
import {
  BALLISTA_ANCHORS,
  drawBallistaBase,
  drawBallistaProd,
  drawTreasuryBase,
  TREASURY_ANCHORS,
} from './art/rigs';
import type { TextureBank } from './bake';

const HALF_PI = Math.PI / 2;

interface Pose {
  /** Arm direction (radians, local space, 0 = facing direction). */
  a: number;
  /** Gear pointing direction (radians, local). */
  dir: number;
  /** Forward push of the arm (units). */
  push: number;
  scale: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Keyframe sampler: frames are [time, pose]. */
function sample(frames: [number, Pose][], t: number): Pose {
  if (t <= frames[0]![0]) return frames[0]![1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, p1] = frames[i]!;
    const [t0, p0] = frames[i - 1]!;
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      const e = k * k * (3 - 2 * k);
      return {
        a: lerp(p0.a, p1.a, e),
        dir: lerp(p0.dir, p1.dir, e),
        push: lerp(p0.push, p1.push, e),
        scale: lerp(p0.scale, p1.scale, e),
      };
    }
  }
  return frames[frames.length - 1]![1];
}

const P = (a: number, dir: number, push = 0, scale = 1): Pose => ({ a, dir, push, scale });

/** Rest pose + attack keyframes per hold type (main hand). */
function mainPose(hold: Hold | undefined, t: number, aim: number): Pose {
  switch (hold) {
    case 'aim':
      return t < 0.15
        ? { a: aim, dir: aim, push: lerp(-7, 0, t / 0.15), scale: 1 }
        : { a: aim, dir: aim, push: 0, scale: 1 };
    case 'staff':
      return sample(
        [
          [0, P(-0.2, -HALF_PI + 0.5, 4, 1.08)],
          [0.12, P(-0.1, -HALF_PI + 0.6, 6, 1.05)],
          [0.4, P(1.15, -HALF_PI + 0.08)],
        ],
        t,
      );
    case 'thrown':
      return sample(
        [
          [0, P(-1.5, -2.6)],
          [0.07, P(0.5, -0.4, 4)],
          [0.3, P(1.0, -1.25)],
        ],
        t,
      );
    case 'blade':
    default:
      return sample(
        [
          [0, P(-1.5, -2.9)],
          [0.08, P(1.45, 0.25, 4)],
          [0.34, P(0.9, -1.0)],
        ],
        t,
      );
  }
}

function offPose(hold: Hold | undefined, t: number): Pose {
  switch (hold) {
    case 'shield':
      return sample(
        [
          [0, P(0.55, 0, 12)],
          [0.1, P(0.6, 0, 14)],
          [0.35, P(1.25, 0, 0)],
        ],
        t,
      );
    case 'held':
      // raised out to the side, away from the face
      return sample(
        [
          [0, P(-2.0, -HALF_PI, -3, 1.25)],
          [0.35, P(-2.35, -HALF_PI, 0, 1)],
        ],
        t,
      );
    case 'thrown':
      return sample(
        [
          [0, P(-1.2, -2.6)],
          [0.08, P(0.4, -0.5, 3)],
          [0.32, P(1.2, -1.3)],
        ],
        t,
      );
    default:
      return P(1.3, -HALF_PI);
  }
}

interface Slot {
  layer: Container;
  sprite: Sprite | null;
  art: string | null;
  gear: GearArt | null;
}

export interface TowerAnimState {
  facing: number;
  /** Seconds since the last attack per animated slot. */
  slotT: Record<string, number>;
  /** Seconds since the last attack of any kind. */
  anyT: number;
}

/**
 * A tower's visual: a stack of sprites (base body + one per gear slot). Gear is swapped by
 * `setGear`; two upgraded paths simply fill different slots, so their gear always combines.
 */
export class TowerView {
  readonly root = new Container();
  private readonly flip = new Container();
  private readonly body = new Container();
  private readonly slots = new Map<string, Slot>();
  private mainArm: Container | null = null;
  private offArm: Container | null = null;
  private prod: Container | null = null;
  private headC: Container | null = null;
  private torsoC: Container | null = null;
  private readonly look: Look | null;
  private time = Math.random() * 10;
  private squash = 0;
  private flipX = 1;

  constructor(
    readonly def: TowerDef,
    private readonly bank: TextureBank,
  ) {
    this.root.addChild(this.flip);
    this.flip.addChild(this.body);
    this.look = def.rig === 'humanoid' ? (LOOKS[def.look] ?? LOOKS.fighter!) : null;
    if (def.rig === 'humanoid') this.buildHumanoid();
    else if (def.rig === 'ballista') this.buildBallista();
    else this.buildTreasury();
  }

  private sprite(key: string, draw: Parameters<TextureBank['get']>[1]): Sprite {
    const b = this.bank.get(key, draw);
    const s = new Sprite(b.texture);
    s.anchor.set(b.ax, b.ay);
    return s;
  }

  private addSlot(name: string, parent: Container, x = 0, y = 0): Slot {
    const layer = new Container();
    layer.position.set(x, y);
    parent.addChild(layer);
    const slot: Slot = { layer, sprite: null, art: null, gear: null };
    this.slots.set(name, slot);
    return slot;
  }

  private buildHumanoid(): void {
    const look = this.look!;
    const a = humanoidAnchors(look);
    const key = this.def.look;
    this.body.addChild(this.sprite('shadow:hero', (d) => drawShadow(d, 26, 8)));
    this.addSlot('ground', this.body, a.ground.x, a.ground.y);
    this.addSlot('back', this.body, a.back.x, a.back.y);
    this.torsoC = new Container();
    this.body.addChild(this.torsoC);
    this.torsoC.addChild(this.sprite(`torso:${key}`, (d) => drawTorso(d, look)));
    this.addSlot('body', this.torsoC, a.body.x, a.body.y);
    this.addSlot('companion', this.body, a.companion.x, a.companion.y);
    this.headC = new Container();
    this.headC.position.set(a.head.x, a.head.y);
    this.torsoC.addChild(this.headC);
    this.headC.addChild(this.sprite(`head:${key}`, (d) => drawHead(d, look)));
    this.addSlot('head', this.headC);
    // arms: off arm then main arm (both in front of the torso)
    this.offArm = new Container();
    this.offArm.position.set(a.offShoulder.x, a.offShoulder.y);
    this.torsoC.addChild(this.offArm);
    this.offArm.addChild(this.sprite(`arm:${key}:far`, (d) => drawArm(d, look, false)));
    this.addSlot('offHand', this.offArm, a.armLen, 0);
    this.mainArm = new Container();
    this.mainArm.position.set(a.mainShoulder.x, a.mainShoulder.y);
    this.torsoC.addChild(this.mainArm);
    this.mainArm.addChild(this.sprite(`arm:${key}:near`, (d) => drawArm(d, look, true)));
    this.addSlot('mainHand', this.mainArm, a.armLen, 0);
    // the hand stays on top of the held item
    this.mainArm.addChild(this.sprite(`hand:${key}`, (d) => d.circle(a.armLen, 0, 5.5, look.skin)));
  }

  private buildBallista(): void {
    const A = BALLISTA_ANCHORS;
    this.addSlot('ground', this.body, A.ground.x, A.ground.y);
    this.addSlot('flag', this.body, A.flag.x, A.flag.y);
    this.body.addChild(this.sprite('ballista:base', drawBallistaBase));
    this.addSlot('ammo', this.body, A.ammo.x, A.ammo.y);
    this.addSlot('frame', this.body, A.frame.x, A.frame.y);
    this.prod = new Container();
    this.prod.position.set(A.prod.x, A.prod.y);
    this.body.addChild(this.prod);
    this.prod.addChild(this.sprite('ballista:prod', drawBallistaProd));
    this.addSlot('bolt', this.prod, 0, 0);
    this.addSlot('crew', this.body, A.crew.x, A.crew.y);
  }

  private buildTreasury(): void {
    const A = TREASURY_ANCHORS;
    this.addSlot('ground', this.body, A.ground.x, A.ground.y);
    this.body.addChild(this.sprite('treasury:base', drawTreasuryBase));
    this.addSlot('stall', this.body, A.stall.x, A.stall.y);
    this.addSlot('vault', this.body, A.vault.x, A.vault.y);
    this.addSlot('roof', this.body, A.roof.x, A.roof.y);
    this.addSlot('sign', this.body, A.sign.x, A.sign.y);
    this.addSlot('cart', this.body, A.cart.x, A.cart.y);
    this.addSlot('guard', this.body, A.guard.x, A.guard.y);
  }

  /** Swaps gear sprites to match the tower's current tiers. */
  setGear(gear: GearDef[]): void {
    const want = new Map(gear.map((g) => [g.slot, g.art]));
    for (const [name, slot] of this.slots) {
      const art = want.get(name) ?? null;
      if (art === slot.art) continue;
      if (slot.sprite) {
        slot.sprite.destroy();
        slot.sprite = null;
      }
      slot.art = art;
      slot.gear = art ? (GEAR[art] ?? null) : null;
      if (art && slot.gear) {
        const g = slot.gear;
        slot.sprite = this.sprite(`gear:${art}`, (d) => g.draw(d));
        slot.layer.addChild(slot.sprite);
      }
    }
    this.applyPose(0, 99, 99, 99);
  }

  hasGear(slot: string): string | null {
    return this.slots.get(slot)?.art ?? null;
  }

  /** Per-frame animation. */
  update(dt: number, s: TowerAnimState): void {
    this.time += dt;
    const c = Math.cos(s.facing);
    if (this.def.rig !== 'treasury') {
      const want = c < -0.15 ? -1 : c > 0.15 ? 1 : this.flipX;
      this.flipX = want;
      this.flip.scale.x = want;
    }
    const aim = Math.max(-1.25, Math.min(1.25, Math.atan2(Math.sin(s.facing), Math.abs(c))));
    this.squash = s.anyT < 0.12 ? 1 - s.anyT / 0.12 : 0;
    this.applyPose(
      aim,
      s.slotT.mainHand ?? 99,
      s.slotT.offHand ?? 99,
      s.slotT.companion ?? 99,
      s.slotT.bolt ?? 99,
      s.slotT.head ?? 99,
      s.slotT.back ?? 99,
    );
  }

  private applyPose(
    aim: number,
    tMain: number,
    tOff: number,
    tPet: number,
    tBolt = 99,
    tHead = 99,
    tBack = 99,
  ): void {
    const bob = Math.sin(this.time * 2.4) * 1.1;
    const sq = this.squash;
    this.body.scale.set(1 + sq * 0.06, 1 - sq * 0.08);
    if (this.torsoC) this.torsoC.y = bob * 0.6;
    if (this.headC) {
      const look = this.look!;
      const a = humanoidAnchors(look);
      this.headC.y = a.head.y + bob * 0.4 - (tHead < 0.2 ? (1 - tHead / 0.2) * 3 : 0);
      this.headC.rotation = Math.sin(this.time * 1.3) * 0.03;
    }
    const main = this.slots.get('mainHand');
    if (this.mainArm && main) {
      const pose = mainPose(main.gear?.hold, tMain, aim);
      this.mainArm.rotation = pose.a;
      const look = this.look!;
      const a = humanoidAnchors(look);
      this.mainArm.x = a.mainShoulder.x + pose.push * Math.cos(pose.a) * 0.2;
      if (main.sprite) {
        const up = main.gear?.hold !== 'aim';
        main.sprite.rotation = up ? pose.dir + HALF_PI - pose.a : pose.dir - pose.a;
        main.sprite.x = main.gear?.hold === 'aim' ? pose.push : 0;
        main.sprite.scale.set(pose.scale);
      }
    }
    const off = this.slots.get('offHand');
    if (this.offArm && off) {
      const pose = offPose(off.gear?.hold, tOff);
      this.offArm.rotation = pose.a;
      const a = humanoidAnchors(this.look!);
      this.offArm.x = a.offShoulder.x + pose.push;
      if (off.sprite) {
        off.sprite.rotation = off.gear?.hold === 'shield' ? -pose.a : pose.dir + HALF_PI - pose.a;
        off.sprite.scale.set(pose.scale);
      }
    }
    const pet = this.slots.get('companion');
    if (pet) {
      const k = tPet < 0.3 ? Math.sin((tPet / 0.3) * Math.PI) : 0;
      pet.layer.scale.set(1 + k * 0.08, 1 - k * 0.05);
      const base = humanoidAnchors(this.look ?? LOOKS.fighter!).companion;
      pet.layer.x = base.x + k * 10;
      pet.layer.y =
        base.y +
        Math.sin(this.time * 3 + 1) * 0.6 -
        (pet.art?.includes('owl') || pet.art?.includes('raven') || pet.art?.includes('astral')
          ? Math.sin(this.time * 4) * 3
          : 0);
    }
    const back = this.slots.get('back');
    if (back && this.look) back.layer.rotation = Math.sin(this.time * 1.6) * 0.035 - (tBack < 0.2 ? 0.08 : 0);
    if (this.prod) {
      this.prod.rotation = aim;
      const boltSlot = this.slots.get('bolt');
      if (boltSlot?.sprite) boltSlot.sprite.x = tBolt < 0.5 ? lerp(-18, 0, (tBolt - 0.1) / 0.4) : 0;
    }
  }
}
