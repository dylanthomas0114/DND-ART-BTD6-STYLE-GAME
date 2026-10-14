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
