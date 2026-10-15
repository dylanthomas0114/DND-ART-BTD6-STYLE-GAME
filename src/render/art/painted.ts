/**
 * Painted (AI-generated, hand-cut) tower art registry. Pure data: no Pixi imports.
 * Every entry is optional; a tower without one keeps its code-drawn vector rig.
 */
export type PaintedGearKind = 'bow' | 'arrow' | 'back' | 'head' | 'body';

export interface PaintedGear {
  kind: PaintedGearKind;
  /** Target size in world units along `dim`. */
  size: number;
  dim: 'h' | 'w' | 'diag';
  /** Offset from the kind's anchor, world units. */
  dx?: number;
  dy?: number;
  /** Extra rotation (radians) to correct how the piece was painted. */
  rot?: number;
  /** Sprite pivot as a fraction of the cut item (default centre). */
  px?: number;
  py?: number;
  /** Reuse another painted piece (tinted + glowing) until dedicated art is generated. */
  base?: string;
  tint?: number;
  glow?: number;
}

export interface PaintedTowerSpec {
  /** Attack strip basename under public/assets/painted/. */
  strip: string;
  /** Gear atlas basenames. */
  gearAtlases: string[];
  /** On-screen body height in world units (1600x900 world). */
  bodyH: number;
  gear: Record<string, PaintedGear>;
}

/**
 * Mesh rig for a painted boss that is one flat image. Every position is a fraction of the image
 * (u across, v down); every amplitude is a fraction of the image height. The pose function in
 * `bossRig.ts` bends the image with these, so wings flap, the tail sways and the feet step
 * without cutting the painting into pieces.
 */
export interface BossRig {
  cols: number;
  rows: number;
  /** Wing: moves everything right of `u0` and above `rootV`, more towards the tip. */
  wing: { u0: number; u1: number; v0: number; rootV: number; amp: number; rate: number };
  /** Tail: a travelling wave that grows towards the tip (right of `u0`). */
  tail: { u0: number; amp: number; rate: number; wave: number };
  /** Head: a small counter-bob left of `u1`. */
  head: { u1: number; amp: number };
  /** Feet: lifted alternately below `v0` as the boss strides. */
  feet: { v0: number; amp: number };
}

export interface PaintedBossSpec {
  /** PNG basename under public/assets/painted/. */
  image: string;
  /** On-screen height in world units (1600x900 world). */
  height: number;
  /** +1 when the art faces right, -1 when it faces left. */
  faces: 1 | -1;
  /** Feet line as a fraction of the image height (the sprite pivot). */
  pivotY: number;
  /** Radians of stride per world unit walked. */
  stride: number;
  rig: BossRig;
}

/**
 * Painted bosses, keyed by the enemy id whose look they replace. The first boss slot (`ogre`)
 * is the drake whelp; every boss without an entry keeps its code-drawn art.
 */
export const PAINTED_BOSSES: Partial<Record<string, PaintedBossSpec>> = {
  ogre: {
    image: 'whelp',
    height: 150,
    faces: -1,
    pivotY: 0.97,
    stride: 0.09,
    rig: {
      cols: 14,
      rows: 10,
      wing: { u0: 0.52, u1: 0.97, v0: 0.18, rootV: 0.52, amp: 0.06, rate: 9 },
      tail: { u0: 0.72, amp: 0.045, rate: 4, wave: 5 },
      head: { u1: 0.4, amp: 0.012 },
      feet: { v0: 0.8, amp: 0.04 },
    },
  },
};

/** The painted walking bodies regular enemies are built from. */
export type EnemyChassis = 'skeleton_warrior' | 'skeleton_archer';

export interface PaintedChassisSpec {
  /** Walk-cycle strip basename under public/assets/painted/ (cut by scripts/cut-walk.mjs). */
  strip: string;
  /** Used until this chassis' own strip has been generated. */
  fallback?: EnemyChassis;
}

export const PAINTED_CHASSIS: Record<EnemyChassis, PaintedChassisSpec> = {
  skeleton_warrior: { strip: 'skel_warrior' },
  skeleton_archer: { strip: 'skel_archer', fallback: 'skeleton_warrior' },
};

/** Small extras drawn on a painted walker so tiers and immunities read at a glance. */
export type EnemyMark = 'shadow' | 'frost' | 'ward' | 'iron' | 'bolt' | 'prism' | 'stone';

export interface EnemyLook {
  chassis: EnemyChassis;
  /** On-screen height in world units. */
  height: number;
  /** Colour multiplied over the painting: the layer colour, kept light so the bones still read. */
  tint: number;
  mark?: EnemyMark;
}

/**
 * Whether layers get their own colour and immunity mark. Off by request: every skeleton looks like
 * its chassis (sword-and-shield or archer) and the layers differ only by size. Flip to `true` to
 * bring back the colour ladder and the shadow/frost/ward/iron/storm/prism/stone marks below.
 */
export const SHOW_LAYER_STYLE = false;

const look = (chassis: EnemyChassis, height: number, tint: number, mark?: EnemyMark): EnemyLook => ({
  chassis,
  height,
  tint: SHOW_LAYER_STYLE ? tint : 0xffffff,
  ...(SHOW_LAYER_STYLE && mark ? { mark } : {}),
});

/**
 * Regular enemies as skeletons. Warriors (sword and shield) are the main line; archers carry the
 * magical and immune layers. When `SHOW_LAYER_STYLE` is on, layer colour follows the old slime
 * ladder so players keep their muscle memory; size grows with the layer either way.
 */
export const ENEMY_LOOKS: Partial<Record<string, EnemyLook>> = {
  green: look('skeleton_warrior', 56, 0xdbf7c6),
  blue: look('skeleton_warrior', 58, 0xb8deff),
  amber: look('skeleton_warrior', 60, 0xffe1a0),
  violet: look('skeleton_warrior', 63, 0xdec1ff),
  crimson: look('skeleton_warrior', 65, 0xffb0b0),
  shadow: look('skeleton_archer', 60, 0xc4b7de, 'shadow'),
  frost: look('skeleton_archer', 60, 0xe7f7ff, 'frost'),
  warded: look('skeleton_archer', 63, 0xe7cfff, 'ward'),
  iron: look('skeleton_warrior', 65, 0xd6dae0, 'iron'),
  storm: look('skeleton_archer', 63, 0xf4f4f4, 'bolt'),
  prismatic: look('skeleton_archer', 65, 0xffa0d0, 'prism'),
  stone: look('skeleton_warrior', 72, 0xd9d6cf, 'stone'),
};

/** Arrows were painted pointing up-right at ~44 degrees; this turns them to point along +x. */
const ARROW_FIX = 0.77;

export const PAINTED_TOWERS: Record<string, PaintedTowerSpec> = {
  ranger: {
    strip: 'ranger_attack',
    gearAtlases: ['ranger_gearA', 'ranger_gearB'],
    bodyH: 104,
    gear: {
      bow_short: { kind: 'bow', size: 66, dim: 'h' },
      bow_long: { kind: 'bow', size: 84, dim: 'h' },
      bow_twin: { kind: 'bow', size: 78, dim: 'h' },
      arrow_barbed: { kind: 'arrow', size: 46, dim: 'diag', rot: ARROW_FIX },
      arrow_heart: { kind: 'arrow', size: 46, dim: 'diag', rot: ARROW_FIX },
      arrow_star: { kind: 'arrow', size: 46, dim: 'diag', rot: ARROW_FIX },
      // Dedicated art for these is pending (generation quota); tinted painted variants stand in.
      bow_storm: { kind: 'bow', size: 84, dim: 'h', base: 'bow_long', tint: 0x9fc4ff, glow: 0x4aa8ff },
      bow_sun: { kind: 'bow', size: 84, dim: 'h', base: 'bow_long', tint: 0xffe08a, glow: 0xffb81c },
      quiver_full: { kind: 'back', size: 52, dim: 'h', dx: -15, dy: -62, rot: -0.35 },
      quiver_storm: { kind: 'back', size: 52, dim: 'h', dx: -15, dy: -62, rot: -0.35 },
      quiver_sun: { kind: 'back', size: 52, dim: 'h', dx: -15, dy: -62, rot: -0.35 },
      hood_green: { kind: 'head', size: 44, dim: 'w', dy: 6 },
      hood_hawk: { kind: 'head', size: 44, dim: 'w', dy: 8, py: 0.85 },
      mantle_fur: { kind: 'body', size: 38, dim: 'w', dx: 1, dy: -41 },
      armor_beastlord: { kind: 'body', size: 40, dim: 'w', dx: 1, dy: -38 },
    },
  },
};
