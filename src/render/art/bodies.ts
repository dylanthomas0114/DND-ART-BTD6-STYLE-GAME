import { type Draw, OUTLINE, shade, tint } from './pen';
import { C } from './palette';

/**
 * Humanoid hero bodies in chibi 3/4 front view, facing right. Origin (0, 0) is between the feet.
 * Gear attaches at the anchors returned by `humanoidAnchors`.
 */
export interface Look {
  skin: number;
  hair: number;
  hairStyle: 'short' | 'long' | 'bald' | 'ponytail' | 'wild' | 'topknot';
  beard?: { color: number; style: 'long' | 'full' | 'stubble' };
  tunic: number;
  trim: number;
  pants: number;
  boots: number;
  belt: number;
  ears?: 'elf';
  /** Robe-style lower body instead of legs. */
  robe?: boolean;
  eyes: number;
  /** Dwarves are stockier: shorter legs, wider body. */
  build: 'normal' | 'stout';
}

export const LOOKS: Record<string, Look> = {
  fighter: {
    skin: C.skin,
    hair: 0x6b3d1f,
    hairStyle: 'short',
    beard: { color: 0x6b3d1f, style: 'stubble' },
    tunic: C.red,
    trim: C.gold,
    pants: 0x5a4636,
    boots: C.leatherDark,
    belt: C.leather,
    eyes: 0x2a4a7a,
    build: 'normal',
  },
  ranger: {
    skin: 0xf7d6b5,
    hair: 0xf2d27a,
    hairStyle: 'long',
    tunic: C.forest,
    trim: 0x9ccf5a,
    pants: 0x6b5236,
    boots: C.leatherDark,
    belt: C.leather,
    ears: 'elf',
    eyes: 0x2f7a3a,
    build: 'normal',
  },
  rogue: {
    skin: C.skinTan,
    hair: 0x2a2026,
    hairStyle: 'ponytail',
    tunic: 0x3b3346,
    trim: 0x8f2d4a,
    pants: 0x2a2430,
    boots: 0x1f1a22,
    belt: 0x5e3a1b,
    eyes: 0x7a2a3a,
    build: 'normal',
  },
  wizard: {
    skin: C.skin,
    hair: 0xe9e6f0,
    hairStyle: 'bald',
    beard: { color: 0xeeeaf4, style: 'long' },
    tunic: 0x3b4fa8,
    trim: C.gold,
    pants: 0x2a2f6b,
    boots: 0x3a2a1a,
    belt: C.gold,
    robe: true,
    eyes: 0x3a3a7a,
    build: 'normal',
  },
  dwarf: {
    skin: 0xf0b48f,
    hair: 0xc4511f,
    hairStyle: 'short',
    beard: { color: 0xc4511f, style: 'full' },
    tunic: 0x6e5a3a,
    trim: 0xc98a3c,
    pants: 0x4a3b2a,
    boots: 0x3a2a1a,
    belt: C.leatherDark,
    eyes: 0x3a2a1a,
    build: 'stout',
  },
  druid: {
    skin: 0xc98d6a,
    hair: 0x4a6b3a,
    hairStyle: 'wild',
    tunic: 0x5f7f45,
    trim: 0xb9d7f0,
    pants: 0x4a3b2a,
    boots: 0x5e3a1b,
    belt: 0x6b4423,
    robe: true,
    eyes: 0x2a8fb0,
    build: 'normal',
  },
  cleric: {
    skin: 0x9a6342,
    hair: 0x2a1c14,
    hairStyle: 'topknot',
    tunic: 0xf2ecdf,
    trim: C.gold,
    pants: 0xd9cdb5,
    boots: 0x8b5a2b,
    belt: C.gold,
    robe: true,
    eyes: 0x3a2a1a,
    build: 'normal',
  },
};

export interface Anchors {
  ground: { x: number; y: number };
  back: { x: number; y: number };
  body: { x: number; y: number };
  head: { x: number; y: number };
  mainShoulder: { x: number; y: number };
  offShoulder: { x: number; y: number };
  /** Arm length (shoulder to hand) along the arm's local +x. */
  armLen: number;
  companion: { x: number; y: number };
  headR: number;
}

export function humanoidAnchors(look: Look): Anchors {
  const stout = look.build === 'stout';
  const hip = stout ? -16 : -22;
  const chest = hip - (stout ? 30 : 32);
  const headR = stout ? 20 : 21;
  return {
    ground: { x: 0, y: 0 },
    back: { x: -3, y: chest + 14 },
    body: { x: 0, y: (hip + chest) / 2 },
    head: { x: 2, y: chest - headR + 4 },
    mainShoulder: { x: stout ? 15 : 12, y: chest + 7 },
    offShoulder: { x: stout ? -15 : -12, y: chest + 7 },
    armLen: stout ? 15 : 16,
    companion: { x: 38, y: 4 },
    headR,
  };
}

export function drawShadow(d: Draw, rx = 26, ry = 8): void {
  d.p.ellipse(0, 0, rx, ry).fill({ color: 0x000000, alpha: 0.28 });
}

/** Legs + boots (or robe skirt) + torso, without arms or head. */
export function drawTorso(d: Draw, look: Look): void {
  const a = humanoidAnchors(look);
  const stout = look.build === 'stout';
  const hip = a.body.y + (stout ? 15 : 16);
  const chest = a.mainShoulder.y - 7;
  const w = stout ? 21 : 16;
  if (look.robe) {
    // flowing robe to the ground
    d.shape(
      (p) =>
        p
          .moveTo(-w + 1, chest + 8)
          .lineTo(w - 1, chest + 8)
          .quadraticCurveTo(w + 8, -6, w + 4, -2)
          .quadraticCurveTo(0, 4, -w - 4, -2)
          .quadraticCurveTo(-w - 8, -6, -w + 1, chest + 8)
          .closePath(),
      look.tunic,
    );
    d.p
      .moveTo(w - 2, chest + 14)
      .quadraticCurveTo(w + 5, -8, w + 2, -4)
      .lineTo(w - 6, -3)
      .quadraticCurveTo(w - 2, -10, w - 6, chest + 14)
      .fill({ color: shade(look.tunic, 0.3) });
    d.line([-w - 3, -3, w + 3, -3], look.trim, 3);
    d.ellipse(-7, -1, 6, 3.5, look.boots);
    d.ellipse(8, -1, 6, 3.5, look.boots);
  } else {
    // legs
    const legH = -hip;
    d.rrect(-w + 3, hip - 2, 10, legH, 4, look.pants);
    d.rrect(w - 13, hip - 2, 10, legH, 4, shade(look.pants, 0.15));
    // boots
    d.shape((p) => p.roundRect(-w + 1, -9, 14, 10, 4), look.boots);
    d.shape((p) => p.roundRect(w - 13, -9, 15, 10, 4), shade(look.boots, 0.1));
    d.hi(-w + 6, -7, 3, 1.5, 0xffffff, 0.25);
    d.hi(w - 7, -7, 3, 1.5, 0xffffff, 0.25);
  }
  // torso
  d.shape(
    (p) =>
      p
        .moveTo(-w, chest + 4)
        .quadraticCurveTo(-w - 1, chest - 2, -w + 6, chest - 3)
        .lineTo(w - 6, chest - 3)
        .quadraticCurveTo(w + 1, chest - 2, w, chest + 4)
        .lineTo(w + 1, hip + 2)
        .quadraticCurveTo(0, hip + 6, -w - 1, hip + 2)
        .closePath(),
    look.tunic,
  );
  // shading on the right side, highlight on left
  d.p
    .moveTo(w - 5, chest)
    .quadraticCurveTo(w + 1, chest, w, chest + 6)
    .lineTo(w + 1, hip + 1)
    .lineTo(w - 6, hip + 3)
    .closePath()
    .fill({ color: shade(look.tunic, 0.28) });
  d.hi(-w + 6, chest + 6, 3, 6, 0xffffff, 0.18);
  // collar trim
  d.p
    .moveTo(-6, chest - 2)
    .lineTo(0, chest + 6)
    .lineTo(6, chest - 2)
    .stroke({ width: 3, color: look.trim, cap: 'round', join: 'round' });
  // belt
  d.rrect(-w - 1, hip - 6, w * 2 + 2, 6, 2, look.belt, { lw: 2 });
  d.rrect(-3, hip - 7, 7, 8, 2, C.gold, { lw: 2 });
}

/** Head with face, hair and (optional) beard. Origin at head centre. */
export function drawHead(d: Draw, look: Look): void {
  const r = humanoidAnchors(look).headR;
  // hair behind head
  if (look.hairStyle === 'long') {
    d.shape(
      (p) =>
        p
          .moveTo(-r + 1, -4)
          .quadraticCurveTo(-r - 6, r + 10, -6, r + 14)
          .lineTo(10, r + 8)
          .quadraticCurveTo(r, 4, r - 2, -6)
          .closePath(),
      look.hair,
    );
  } else if (look.hairStyle === 'ponytail') {
    d.shape(
      (p) =>
        p
          .moveTo(-r + 2, -6)
          .quadraticCurveTo(-r - 14, 4, -r - 8, r + 8)
          .quadraticCurveTo(-r - 2, 6, -r + 6, 2)
          .closePath(),
      look.hair,
    );
  } else if (look.hairStyle === 'wild') {
    d.star(0, -2, r + 9, look.hair, undefined, 9, 0.75);
  }
  // elf ears
  if (look.ears === 'elf') {
    d.poly([-r + 3, -2, -r - 11, -12, -r + 2, 6], look.skin);
    d.poly([r - 3, -2, r + 9, -13, r - 1, 6], look.skin);
  } else {
    d.ellipse(-r + 1, 2, 4.5, 6, look.skin);
    d.ellipse(r - 1, 2, 4, 5.5, shade(look.skin, 0.08));
  }
  // face
  d.circle(0, 0, r, look.skin);
  d.p
    .moveTo(r - 6, -r + 8)
    .quadraticCurveTo(r + 1, 0, r - 5, r - 6)
    .quadraticCurveTo(r - 1, 0, r - 6, -r + 8)
    .fill({ color: shade(look.skin, 0.15) });
  d.hi(-r * 0.45, -r * 0.45, r * 0.3, r * 0.2, 0xffffff, 0.3);
  // eyes (looking slightly right)
  const ex = 5;
  d.ellipse(-3 + ex - 6, 1, 4, 5.5, 0xffffff, { lw: 1.5 });
  d.ellipse(9 + ex - 6, 1, 3.6, 5.2, 0xffffff, { lw: 1.5 });
  d.circle(-1 + ex - 6, 2, 2.4, look.eyes, { lw: 0 });
  d.circle(10.5 + ex - 6, 2, 2.2, look.eyes, { lw: 0 });
  d.circle(-1.6 + ex - 6, 1, 0.9, 0xffffff, { lw: 0 });
  d.circle(10 + ex - 6, 1, 0.8, 0xffffff, { lw: 0 });
  // brows
  d.line([-7 + ex - 6, -6, -1 + ex - 6, -7], OUTLINE, 2);
  d.line([6 + ex - 6, -7, 12 + ex - 6, -6], OUTLINE, 2);
  // nose + mouth
  d.p
    .moveTo(5, 4)
    .quadraticCurveTo(8, 7, 5, 8)
    .stroke({ width: 1.6, color: shade(look.skin, 0.4), cap: 'round' });
  d.p.moveTo(1, 12).quadraticCurveTo(5, 14.5, 9, 11.5).stroke({ width: 2, color: OUTLINE, cap: 'round' });
  // beard
  if (look.beard) {
    const b = look.beard;
    if (b.style === 'stubble') {
      d.p
        .moveTo(-r + 5, 6)
        .quadraticCurveTo(0, r + 6, r - 4, 6)
        .quadraticCurveTo(4, r - 2, -r + 5, 6)
        .fill({ color: b.color, alpha: 0.35 });
    } else {
      const len = b.style === 'long' ? 26 : 14;
      d.shape(
        (p) =>
          p
            .moveTo(-r + 3, 4)
            .quadraticCurveTo(-r + 2, r + len * 0.6, 2, r + len)
            .quadraticCurveTo(r - 2, r + len * 0.6, r - 3, 4)
            .quadraticCurveTo(r - 6, 10, 9, 10)
            .quadraticCurveTo(4, 8, 0, 10)
            .quadraticCurveTo(-6, 10, -r + 3, 4)
            .closePath(),
        b.color,
      );
      d.p
        .moveTo(-2, 14)
        .quadraticCurveTo(0, r + len * 0.7, 3, r + len - 4)
        .stroke({ width: 1.5, color: shade(b.color, 0.25) });
      d.p
        .moveTo(6, 13)
        .quadraticCurveTo(8, r + len * 0.6, 8, r + len - 8)
        .stroke({ width: 1.5, color: shade(b.color, 0.25) });
      // moustache
      d.shape(
        (p) => p.moveTo(-4, 9).quadraticCurveTo(4, 5, 13, 9).quadraticCurveTo(4, 12, -4, 9).closePath(),
        tint(b.color, 0.1),
        { lw: 1.5 },
      );
    }
  }
  // hair on top
  switch (look.hairStyle) {
    case 'short':
    case 'ponytail':
    case 'long':
      d.shape(
        (p) =>
          p
            .moveTo(-r - 1, 0)
            .quadraticCurveTo(-r - 2, -r - 4, 2, -r - 3)
            .quadraticCurveTo(r + 3, -r - 2, r + 1, -2)
            .quadraticCurveTo(r - 4, -10, 6, -11)
            .quadraticCurveTo(-2, -6, -8, -12)
            .quadraticCurveTo(-14, -6, -r - 1, 0)
            .closePath(),
        look.hair,
      );
      d.hi(-6, -r + 2, 7, 2.5, 0xffffff, 0.3);
      break;
    case 'wild':
      d.shape(
        (p) =>
          p
            .moveTo(-r - 2, -2)
            .quadraticCurveTo(-r, -r - 6, 2, -r - 4)
            .quadraticCurveTo(r + 4, -r - 2, r + 2, -4)
            .quadraticCurveTo(4, -8, -r - 2, -2)
            .closePath(),
        look.hair,
      );
      break;
    case 'topknot':
      d.circle(-2, -r - 4, 7, look.hair);
      d.shape(
        (p) =>
          p
            .moveTo(-r, -2)
            .quadraticCurveTo(-r, -r - 1, 2, -r - 1)
            .quadraticCurveTo(r + 1, -r, r, -4)
            .quadraticCurveTo(0, -12, -r, -2)
            .closePath(),
        look.hair,
      );
      break;
    case 'bald':
      d.hi(-4, -r + 5, 6, 3, 0xffffff, 0.4);
      break;
  }
}

/** Arm drawn from shoulder (0,0) along +x to the hand at (armLen, 0). */
export function drawArm(d: Draw, look: Look, near: boolean): void {
  const a = humanoidAnchors(look);
  const L = a.armLen;
  const sleeve = near ? look.tunic : shade(look.tunic, 0.15);
  d.bar([0, 0, L - 2, 0], sleeve, 9);
  d.circle(L, 0, 5.5, near ? look.skin : shade(look.skin, 0.12));
}
