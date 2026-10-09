import type { EnemyId } from '../../core/data/enemies';
import { type Draw, OUTLINE, shade, tint } from './pen';
import { C } from './palette';

/**
 * Enemy art. Origin = enemy position on the road (shadow at y≈+r*0.55). Slimes are drawn
 * facing right. Each slime colour also has a distinct face + pattern + size (colour-blind safe).
 */

type Face =
  | 'dopey'
  | 'round'
  | 'determined'
  | 'angry'
  | 'fierce'
  | 'glow'
  | 'cold'
  | 'smug'
  | 'stern'
  | 'crazy'
  | 'grumpy';

function eyes(d: Draw, r: number, face: Face, cy: number): void {
  const ex = r * 0.18;
  const ew = r * 0.2;
  const eh = r * 0.26;
  const L = -ex - ew * 0.9 + r * 0.12;
  const R = ex + ew * 0.9 + r * 0.12;
  if (face === 'glow') {
    d.ellipse(L, cy, ew * 0.9, eh * 0.5, 0xfff6d8, { lw: 0 });
    d.ellipse(R, cy, ew * 0.9, eh * 0.5, 0xfff6d8, { lw: 0 });
    d.glow(L, cy, ew * 1.6, 0xfff6d8, 0.4);
    d.glow(R, cy, ew * 1.6, 0xfff6d8, 0.4);
    return;
  }
  d.ellipse(L, cy, ew, eh, 0xffffff, { lw: 1.6 });
  d.ellipse(R, cy, ew, eh, 0xffffff, { lw: 1.6 });
  const px = face === 'crazy' ? [-ew * 0.4, ew * 0.4] : [ew * 0.25, ew * 0.25];
  d.circle(L + px[0]!, cy + eh * 0.15, ew * 0.55, OUTLINE, { lw: 0 });
  d.circle(R + px[1]!, cy + eh * 0.15, ew * 0.55, OUTLINE, { lw: 0 });
  d.circle(L + px[0]! - ew * 0.2, cy - eh * 0.1, ew * 0.2, 0xffffff, { lw: 0 });
  d.circle(R + px[1]! - ew * 0.2, cy - eh * 0.1, ew * 0.2, 0xffffff, { lw: 0 });
  const by = cy - eh * 1.2;
  switch (face) {
    case 'determined':
      d.line([L - ew, by + 2, L + ew, by], OUTLINE, 2);
      d.line([R - ew, by, R + ew, by + 2], OUTLINE, 2);
      break;
    case 'angry':
    case 'fierce':
    case 'grumpy':
    case 'stern':
      d.line([L - ew, by - 2, L + ew, by + 3], OUTLINE, 2.4);
      d.line([R - ew, by + 3, R + ew, by - 2], OUTLINE, 2.4);
      break;
    case 'smug':
      d.p.rect(L - ew - 1, cy - eh - 1, ew * 2 + 2, eh * 0.9).fill({ color: 0x000000, alpha: 0 });
      d.line([L - ew, cy - eh * 0.3, L + ew, cy - eh * 0.3], OUTLINE, 2.2);
      d.line([R - ew, cy - eh * 0.3, R + ew, cy - eh * 0.3], OUTLINE, 2.2);
      break;
    case 'cold':
      d.line([L - ew, by + 1, L + ew, by - 1], C.frost, 2);
      d.line([R - ew, by - 1, R + ew, by + 1], C.frost, 2);
      break;
    default:
      break;
  }
}

function mouth(d: Draw, r: number, face: Face, cy: number): void {
  const x = r * 0.15;
  const y = cy + r * 0.32;
  switch (face) {
    case 'dopey':
      d.p
        .moveTo(x - r * 0.18, y)
        .quadraticCurveTo(x, y + r * 0.2, x + r * 0.2, y - 1)
        .stroke({ width: 2, color: OUTLINE, cap: 'round' });
      d.ellipse(x + r * 0.05, y + r * 0.12, r * 0.07, r * 0.06, 0xff8fa0, { lw: 0 });
      break;
    case 'round':
      d.ellipse(x, y + 1, r * 0.1, r * 0.09, OUTLINE, { lw: 0 });
      break;
    case 'determined':
    case 'stern':
      d.line([x - r * 0.15, y, x + r * 0.15, y], OUTLINE, 2);
      break;
    case 'angry':
    case 'grumpy':
      d.p
        .moveTo(x - r * 0.18, y + 3)
        .quadraticCurveTo(x, y - 2, x + r * 0.18, y + 3)
        .stroke({ width: 2, color: OUTLINE, cap: 'round' });
      break;
    case 'fierce':
      d.poly([x - r * 0.22, y - 2, x + r * 0.22, y - 2, x, y + r * 0.2], OUTLINE, { lw: 0 });
      d.poly([x - r * 0.15, y - 2, x - r * 0.08, y + 3, x - r * 0.02, y - 2], 0xffffff, { lw: 0 });
      d.poly([x + r * 0.02, y - 2, x + r * 0.08, y + 3, x + r * 0.15, y - 2], 0xffffff, { lw: 0 });
      break;
    case 'smug':
      d.p
        .moveTo(x - r * 0.18, y)
        .quadraticCurveTo(x + r * 0.05, y + r * 0.12, x + r * 0.22, y - r * 0.08)
        .stroke({ width: 2, color: OUTLINE, cap: 'round' });
      break;
    case 'crazy':
      d.p
        .moveTo(x - r * 0.22, y)
        .quadraticCurveTo(x, y + r * 0.28, x + r * 0.22, y)
        .closePath()
        .fill({ color: OUTLINE });
      d.rect(x - r * 0.12, y, r * 0.24, r * 0.06, 0xffffff, { lw: 0 });
      break;
    case 'cold':
      d.p
        .moveTo(x - r * 0.15, y)
        .lineTo(x - r * 0.05, y + 2)
        .lineTo(x + r * 0.05, y)
        .lineTo(x + r * 0.15, y + 2)
        .stroke({ width: 1.8, color: OUTLINE });
      break;
    default:
      break;
  }
}

/** Generic slime blob. */
function blob(
  d: Draw,
  r: number,
  body: number,
  o: {
    face: Face;
    pattern?: (d: Draw, r: number) => void;
    top?: (d: Draw, r: number) => void;
    alpha?: number;
  },
): void {
  d.p.ellipse(0, r * 0.62, r * 0.95, r * 0.28).fill({ color: 0x000000, alpha: 0.28 });
  d.shape(
    (p) =>
      p
        .moveTo(-r, r * 0.55)
        .quadraticCurveTo(-r * 1.08, -r * 0.1, -r * 0.55, -r * 0.62)
        .quadraticCurveTo(0, -r * 1.08, r * 0.55, -r * 0.65)
        .quadraticCurveTo(r * 1.1, -r * 0.15, r, r * 0.55)
        .quadraticCurveTo(0, r * 0.75, -r, r * 0.55)
        .closePath(),
    body,
    { alpha: o.alpha },
  );
  // core shading
  d.p
    .moveTo(r * 0.2, r * 0.6)
    .quadraticCurveTo(r * 0.95, r * 0.5, r * 0.92, 0)
    .quadraticCurveTo(r * 0.75, r * 0.35, r * 0.2, r * 0.6)
    .fill({ color: shade(body, 0.3) });
  o.pattern?.(d, r);
  d.hi(-r * 0.45, -r * 0.42, r * 0.28, r * 0.16, 0xffffff, 0.6);
  d.hi(-r * 0.68, -r * 0.12, r * 0.07, r * 0.12, 0xffffff, 0.45);
  eyes(d, r, o.face, -r * 0.12);
  mouth(d, r, o.face, -r * 0.12);
  o.top?.(d, r);
}

const SLIMES: Partial<Record<EnemyId, (d: Draw, r: number) => void>> = {
  green: (d, r) => blob(d, r, 0x7bd63a, { face: 'dopey' }),
  blue: (d, r) =>
    blob(d, r, 0x3a8fe0, {
      face: 'round',
      pattern: (d, r) => d.ellipse(r * 0.75, r * 0.45, r * 0.12, r * 0.2, 0x3a8fe0),
    }),
  amber: (d, r) =>
    blob(d, r, 0xffb02a, {
      face: 'determined',
      pattern: (d, r) =>
        d.dots([-r * 0.5, r * 0.25, -r * 0.2, r * 0.38, r * 0.45, r * 0.2], r * 0.08, shade(0xffb02a, 0.25)),
    }),
  violet: (d, r) =>
    blob(d, r, 0xa35ae0, {
      face: 'angry',
      pattern: (d, r) => {
        d.line([-r * 1.5, -r * 0.2, -r * 1.05, -r * 0.2], 0xffffff, 2.5, 0.7);
        d.line([-r * 1.6, r * 0.2, -r * 1.1, r * 0.2], 0xffffff, 2.5, 0.7);
      },
    }),
  crimson: (d, r) =>
    blob(d, r, 0xe0304a, {
      face: 'fierce',
      top: (d, r) => {
        d.poly([-r * 0.4, -r * 0.7, -r * 0.3, -r * 1.15, -r * 0.1, -r * 0.82], 0xffe0e0, { lw: 1.6 });
        d.poly([r * 0.3, -r * 0.82, r * 0.5, -r * 1.15, r * 0.6, -r * 0.7], 0xffe0e0, { lw: 1.6 });
      },
      pattern: (d, r) => {
        d.line([-r * 1.6, -r * 0.3, -r * 1.05, -r * 0.3], 0xffffff, 2.5, 0.7);
        d.line([-r * 1.7, 0, -r * 1.1, 0], 0xffffff, 2.5, 0.7);
        d.line([-r * 1.6, r * 0.3, -r * 1.05, r * 0.3], 0xffffff, 2.5, 0.7);
      },
    }),
  shadow: (d, r) => {
    d.glow(0, 0, r * 1.5, 0x5a2a8a, 0.35);
    for (let i = 0; i < 4; i++)
      d.p
        .circle(-r * 0.8 + i * r * 0.5, -r * 0.9 - (i % 2) * r * 0.25, r * 0.18)
        .fill({ color: 0x3a2a4a, alpha: 0.6 });
    blob(d, r, 0x2a2238, { face: 'glow' });
  },
  frost: (d, r) =>
    blob(d, r, 0xe8f8ff, {
      face: 'cold',
      top: (d, r) => {
        for (let i = -2; i <= 2; i++)
          d.poly(
            [
              i * r * 0.28 - r * 0.12,
              -r * 0.7 + Math.abs(i) * r * 0.08,
              i * r * 0.28,
              -r * 1.25 + Math.abs(i) * r * 0.18,
              i * r * 0.28 + r * 0.12,
              -r * 0.7 + Math.abs(i) * r * 0.08,
            ],
            C.frost,
            { lw: 1.5 },
          );
      },
      pattern: (d, r) => d.star(-r * 0.3, r * 0.3, r * 0.16, C.frost, { lw: 1 }, 6, 0.4),
    }),
  warded: (d, r) =>
    blob(d, r, 0x7a3ad0, {
      face: 'smug',
      pattern: (d, r) => {
        d.glow(0, 0, r * 1.3, 0xd9b8ff, 0.3);
        d.p.circle(0, r * 0.05, r * 0.72).stroke({ width: 2, color: C.gold, alpha: 0.9 });
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          d.p
            .circle(Math.cos(a) * r * 0.72, r * 0.05 + Math.sin(a) * r * 0.72, r * 0.08)
            .fill({ color: C.radiant });
        }
      },
    }),
  iron: (d, r) =>
    blob(d, r, 0x9aa4ae, {
      face: 'stern',
      pattern: (d, r) => {
        d.p
          .moveTo(-r * 0.9, r * 0.1)
          .quadraticCurveTo(0, -r * 0.05, r * 0.95, r * 0.1)
          .stroke({ width: 3, color: shade(0x9aa4ae, 0.35) });
        d.dots(
          [-r * 0.7, r * 0.1, -r * 0.25, r * 0.03, r * 0.25, r * 0.03, r * 0.7, r * 0.1],
          r * 0.07,
          tint(0x9aa4ae, 0.5),
        );
      },
      top: (d, r) => d.rrect(-r * 0.15, -r * 1.05, r * 0.3, r * 0.3, 2, C.steelDark, { lw: 1.5 }),
    }),
  storm: (d, r) =>
    blob(d, r, 0xf2f2f2, {
      face: 'crazy',
      pattern: (d, r) => {
        for (let i = -2; i <= 2; i++)
          d.p
            .moveTo(i * r * 0.4 - r * 0.1, -r * 0.8)
            .quadraticCurveTo(i * r * 0.4 + r * 0.15, 0, i * r * 0.4 - r * 0.05, r * 0.6)
            .stroke({ width: r * 0.16, color: 0x2a2430 });
        d.p
          .moveTo(r * 0.5, -r * 0.9)
          .lineTo(r * 0.75, -r * 1.3)
          .lineTo(r * 0.62, -r * 1.25)
          .lineTo(r * 0.85, -r * 1.6)
          .stroke({ width: 2.5, color: C.radiant, cap: 'round' });
      },
    }),
  prismatic: (d, r) =>
    blob(d, r, 0xff5fa0, {
      face: 'crazy',
      pattern: (d, r) => {
        const bands = [0xff5f5f, 0xffa23a, 0xffe44a, 0x6fe05a, 0x4ab0ff, 0xa35ae0];
        bands.forEach((c, i) =>
          d.p
            .ellipse(0, -r * 0.55 + i * r * 0.22, r * (0.95 - Math.abs(i - 2.5) * 0.08), r * 0.13)
            .fill({ color: c, alpha: 0.85 }),
        );
      },
    }),
  stone: (d, r) => {
    d.p.ellipse(0, r * 0.62, r * 0.95, r * 0.28).fill({ color: 0x000000, alpha: 0.3 });
    d.poly(
      [
        -r,
        r * 0.5,
        -r * 0.95,
        -r * 0.3,
        -r * 0.5,
        -r * 0.85,
        r * 0.2,
        -r * 0.95,
        r * 0.85,
        -r * 0.5,
        r * 1.02,
        r * 0.2,
        r * 0.75,
        r * 0.6,
        -r * 0.4,
        r * 0.7,
      ],
      0x9a958c,
    );
    d.p
      .poly(
        [r * 0.3, -r * 0.9, r * 0.85, -r * 0.5, r * 1.0, r * 0.2, r * 0.75, r * 0.58, r * 0.35, r * 0.62],
        true,
      )
      .fill({ color: shade(0x9a958c, 0.25) });
    d.hi(-r * 0.4, -r * 0.5, r * 0.25, r * 0.12, 0xffffff, 0.35);
    d.dots([-r * 0.6, r * 0.2, r * 0.1, r * 0.4, r * 0.6, -r * 0.2], r * 0.06, shade(0x9a958c, 0.35));
    eyes(d, r, 'grumpy', -r * 0.1);
    mouth(d, r, 'grumpy', -r * 0.1);
    // moss
    d.ellipse(-r * 0.35, -r * 0.82, r * 0.3, r * 0.12, 0x6f9a4a, { lw: 1.4 });
  },
};

/** Cracks drawn over shelled enemies as they take damage (stage 1..3). */
export function drawCracks(d: Draw, r: number, stage: number): void {
  const lines: number[][] = [
    [-0.2, -0.8, 0, -0.4, -0.15, -0.1],
    [0.5, -0.5, 0.3, -0.1, 0.55, 0.2],
    [-0.7, 0, -0.4, 0.15, -0.5, 0.45],
    [0.1, 0.1, 0.25, 0.4, 0, 0.55],
  ];
  for (let i = 0; i < Math.min(lines.length, stage + 1); i++) {
    const l = lines[i]!.map((v) => v * r);
    d.line(l, OUTLINE, 2.4);
  }
}

// ------------------------------------------------------------------------------------ bosses
function ogre(d: Draw, r: number): void {
  const s = r / 38;
  d.p.ellipse(0, 30 * s, 40 * s, 10 * s).fill({ color: 0x000000, alpha: 0.3 });
  // cauldron on the back
  d.ellipse(-26 * s, -14 * s, 22 * s, 18 * s, C.darkIron);
  d.ellipse(-26 * s, -30 * s, 20 * s, 6 * s, 0x2a2a2a);
  d.p.ellipse(-26 * s, -30 * s, 16 * s, 4 * s).fill({ color: 0x9a958c });
  d.circle(-34 * s, -34 * s, 6 * s, 0x9a958c, { lw: 2 });
  d.circle(-20 * s, -36 * s, 5 * s, 0x9a958c, { lw: 2 });
  // legs
  d.rrect(-12 * s, 6 * s, 12 * s, 24 * s, 5, 0x6b5a3a);
  d.rrect(6 * s, 6 * s, 12 * s, 24 * s, 5, shade(0x6b5a3a, 0.15));
  // belly body
  d.ellipse(2 * s, -6 * s, 26 * s, 24 * s, 0xa8b86a);
  d.p.ellipse(6 * s, 2 * s, 16 * s, 14 * s).fill({ color: tint(0xa8b86a, 0.3) });
  d.rrect(-22 * s, 2 * s, 48 * s, 9 * s, 3, C.leather, { lw: 2 });
  // head
  d.circle(16 * s, -30 * s, 14 * s, 0xa8b86a);
  d.poly([10 * s, -18 * s, 12 * s, -12 * s, 14 * s, -18 * s], C.bone, { lw: 1.2 });
  d.poly([20 * s, -18 * s, 22 * s, -12 * s, 24 * s, -18 * s], C.bone, { lw: 1.2 });
  d.circle(14 * s, -33 * s, 3 * s, 0xffffff, { lw: 1.4 });
  d.circle(23 * s, -33 * s, 3 * s, 0xffffff, { lw: 1.4 });
  d.dots([15 * s, -32 * s, 24 * s, -32 * s], 1.5 * s, OUTLINE);
  d.line([10 * s, -38 * s, 18 * s, -36 * s], OUTLINE, 2.5);
  // club arm
  d.bar([24 * s, -10 * s, 40 * s, 6 * s], 0xa8b86a, 8 * s);
  d.shape(
    (p) =>
      p
        .moveTo(36 * s, 2 * s)
        .lineTo(48 * s, -26 * s)
        .quadraticCurveTo(56 * s, -30 * s, 56 * s, -18 * s)
        .lineTo(42 * s, 8 * s)
        .closePath(),
    C.wood,
  );
}

function troll(d: Draw, r: number): void {
  const s = r / 46;
  d.p.ellipse(0, 38 * s, 46 * s, 12 * s).fill({ color: 0x000000, alpha: 0.3 });
  d.rrect(-16 * s, 8 * s, 14 * s, 30 * s, 6, 0x4f7a5a);
  d.rrect(8 * s, 8 * s, 14 * s, 30 * s, 6, 0x456e50);
  d.shape(
    (p) =>
      p
        .moveTo(-30 * s, 14 * s)
        .quadraticCurveTo(-36 * s, -40 * s, 0, -44 * s)
        .quadraticCurveTo(34 * s, -44 * s, 30 * s, 14 * s)
        .quadraticCurveTo(0, 22 * s, -30 * s, 14 * s)
        .closePath(),
    0x6b9a6a,
  );
  d.p.ellipse(10 * s, -4 * s, 16 * s, 18 * s).fill({ color: tint(0x6b9a6a, 0.25) });
  d.rrect(-30 * s, 6 * s, 60 * s, 10 * s, 3, 0x6b4a2a, { lw: 2 });
  // hair tuft & head
  d.circle(18 * s, -40 * s, 16 * s, 0x6b9a6a);
  d.star(14 * s, -54 * s, 10 * s, 0x2a4a3a, { lw: 2 }, 7, 0.6);
  d.ellipse(30 * s, -38 * s, 8 * s, 6 * s, 0x5f8a5a, { lw: 2 });
  d.circle(16 * s, -43 * s, 3.4 * s, 0xffe44a, { lw: 1.4 });
  d.circle(25 * s, -43 * s, 3.2 * s, 0xffe44a, { lw: 1.4 });
  d.dots([17 * s, -42 * s, 26 * s, -42 * s], 1.6 * s, OUTLINE);
  d.poly([12 * s, -30 * s, 14 * s, -36 * s, 16 * s, -30 * s], C.bone, { lw: 1.2 });
  // crown of bones
  d.poly(
    [
      6 * s,
      -54 * s,
      10 * s,
      -64 * s,
      14 * s,
      -56 * s,
      18 * s,
      -66 * s,
      22 * s,
      -56 * s,
      26 * s,
      -64 * s,
      28 * s,
      -54 * s,
    ],
    C.bone,
  );
  // giant club
  d.bar([26 * s, -14 * s, 46 * s, 6 * s], 0x6b9a6a, 10 * s);
  d.shape(
    (p) =>
      p
        .moveTo(40 * s, 4 * s)
        .lineTo(56 * s, -40 * s)
        .quadraticCurveTo(68 * s, -46 * s, 68 * s, -30 * s)
        .lineTo(48 * s, 12 * s)
        .closePath(),
    C.woodDark,
  );
  d.dots([58 * s, -34 * s, 62 * s, -24 * s, 54 * s, -18 * s], 2.4 * s, C.steel);
}

function giant(d: Draw, r: number): void {
  const s = r / 56;
  const st = 0x8a8478;
  d.p.ellipse(0, 46 * s, 56 * s, 14 * s).fill({ color: 0x000000, alpha: 0.32 });
  d.poly([-22 * s, 10 * s, -8 * s, 10 * s, -6 * s, 46 * s, -24 * s, 46 * s], shade(st, 0.1));
  d.poly([8 * s, 10 * s, 22 * s, 10 * s, 24 * s, 46 * s, 6 * s, 46 * s], st);
  d.poly(
    [
      -36 * s,
      14 * s,
      -42 * s,
      -36 * s,
      -18 * s,
      -56 * s,
      22 * s,
      -56 * s,
      40 * s,
      -30 * s,
      36 * s,
      14 * s,
      0,
      22 * s,
    ],
    st,
  );
  d.p
    .poly([10 * s, -54 * s, 40 * s, -30 * s, 36 * s, 14 * s, 6 * s, 20 * s], true)
    .fill({ color: shade(st, 0.22) });
  d.hi(-20 * s, -30 * s, 10 * s, 5 * s, 0xffffff, 0.25);
  // glowing rune heart
  d.glow(0, -16 * s, 18 * s, 0x6fd3ff, 0.4);
  d.star(0, -16 * s, 8 * s, 0x6fd3ff, { lw: 1.6 }, 4, 0.4);
  // head
  d.poly([4 * s, -56 * s, 6 * s, -82 * s, 30 * s, -84 * s, 34 * s, -60 * s], tint(st, 0.08));
  d.rrect(12 * s, -74 * s, 16 * s, 4 * s, 1, 0x6fd3ff, { lw: 0 });
  d.glow(20 * s, -72 * s, 10 * s, 0x6fd3ff, 0.5);
  // moss + boulder fist
  d.ellipse(-22 * s, -54 * s, 14 * s, 5 * s, 0x6f9a4a, { lw: 1.6 });
  d.bar([34 * s, -24 * s, 52 * s, 4 * s], st, 14 * s);
  d.circle(54 * s, 8 * s, 12 * s, shade(st, 0.1));
}

function lich(d: Draw, r: number): void {
  const s = r / 36;
  d.glow(0, -8 * s, 46 * s, 0x6fe0a0, 0.25);
  d.p.ellipse(0, 34 * s, 24 * s, 7 * s).fill({ color: 0x000000, alpha: 0.2 });
  // tattered robe (floating)
  d.shape((p) => {
    p.moveTo(-18 * s, -22 * s).quadraticCurveTo(-30 * s, 10 * s, -24 * s, 26 * s);
    for (let i = 0; i < 6; i++) p.lineTo(-24 * s + (i + 0.5) * 8 * s, 26 * s + (i % 2 ? -6 : 4) * s);
    p.lineTo(24 * s, 24 * s)
      .quadraticCurveTo(28 * s, 0, 18 * s, -22 * s)
      .closePath();
  }, 0x3a2a4a);
  d.p
    .moveTo(6 * s, -20 * s)
    .quadraticCurveTo(24 * s, 0, 22 * s, 22 * s)
    .lineTo(12 * s, 24 * s)
    .quadraticCurveTo(12 * s, 0, 2 * s, -20 * s)
    .fill({ color: 0x2a1f38 });
  d.rrect(-10 * s, -22 * s, 20 * s, 40 * s, 3, 0x5a2a3a, { lw: 1.6 });
  // skull
  d.circle(2 * s, -34 * s, 13 * s, C.bone);
  d.ellipse(-3 * s, -35 * s, 3.5 * s, 4 * s, 0x1d1410, { lw: 0 });
  d.ellipse(8 * s, -35 * s, 3.5 * s, 4 * s, 0x1d1410, { lw: 0 });
  d.circle(-3 * s, -35 * s, 1.6 * s, 0x6fe0a0, { lw: 0 });
  d.circle(8 * s, -35 * s, 1.6 * s, 0x6fe0a0, { lw: 0 });
  d.line([-2 * s, -26 * s, 6 * s, -26 * s], OUTLINE, 1.6);
  d.poly(
    [
      -10 * s,
      -44 * s,
      -8 * s,
      -56 * s,
      -2 * s,
      -46 * s,
      2 * s,
      -58 * s,
      6 * s,
      -46 * s,
      12 * s,
      -56 * s,
      14 * s,
      -44 * s,
    ],
    C.gold,
  );
  d.gem(2 * s, -48 * s, 3 * s, 0x6fe0a0);
  // staff
  d.bar([22 * s, 24 * s, 26 * s, -50 * s], 0x2a2a2a, 3.5 * s);
  d.circle(26 * s, -54 * s, 6 * s, 0x6fe0a0);
  d.glow(26 * s, -54 * s, 14 * s, 0x6fe0a0, 0.5);
}

function dragon(d: Draw, r: number): void {
  const s = r / 66;
  const red = 0xc4301f;
  d.p.ellipse(0, 40 * s, 70 * s, 16 * s).fill({ color: 0x000000, alpha: 0.32 });
  // wings
  d.shape(
    (p) =>
      p
        .moveTo(-6 * s, -18 * s)
        .quadraticCurveTo(-30 * s, -90 * s, -86 * s, -72 * s)
        .lineTo(-70 * s, -54 * s)
        .lineTo(-80 * s, -40 * s)
        .lineTo(-58 * s, -34 * s)
        .lineTo(-60 * s, -16 * s)
        .quadraticCurveTo(-30 * s, -24 * s, -6 * s, -6 * s)
        .closePath(),
    0x8f1d2c,
  );
  d.p
    .moveTo(-6 * s, -18 * s)
    .lineTo(-70 * s, -54 * s)
    .moveTo(-6 * s, -12 * s)
    .lineTo(-58 * s, -34 * s)
    .stroke({ width: 2, color: shade(0x8f1d2c, 0.4) });
  // tail
  d.shape(
    (p) =>
      p
        .moveTo(-36 * s, 10 * s)
        .quadraticCurveTo(-80 * s, 20 * s, -96 * s, -6 * s)
        .lineTo(-88 * s, 4 * s)
        .quadraticCurveTo(-72 * s, 24 * s, -30 * s, 22 * s)
        .closePath(),
    red,
  );
  d.poly([-96 * s, -6 * s, -106 * s, -14 * s, -98 * s, 4 * s], C.gold, { lw: 1.6 });
  // legs + body
  d.rrect(-26 * s, 10 * s, 16 * s, 30 * s, 6, shade(red, 0.15));
  d.rrect(10 * s, 10 * s, 16 * s, 30 * s, 6, red);
  d.ellipse(0, 0, 44 * s, 26 * s, red);
  d.p.ellipse(8 * s, 10 * s, 28 * s, 12 * s).fill({ color: 0xf2b45a });
  for (let i = 0; i < 4; i++)
    d.line([-6 * s + i * 8 * s, 2 * s, -4 * s + i * 8 * s, 18 * s], shade(0xf2b45a, 0.3), 1.6);
  // spines
  for (let i = 0; i < 5; i++)
    d.poly(
      [-28 * s + i * 12 * s, -22 * s, -22 * s + i * 12 * s, -34 * s, -16 * s + i * 12 * s, -22 * s],
      C.gold,
      { lw: 1.4 },
    );
  // neck + head
  d.shape(
    (p) =>
      p
        .moveTo(22 * s, -16 * s)
        .quadraticCurveTo(34 * s, -50 * s, 50 * s, -56 * s)
        .lineTo(58 * s, -44 * s)
        .quadraticCurveTo(44 * s, -36 * s, 40 * s, -4 * s)
        .closePath(),
    red,
  );
  d.shape(
    (p) =>
      p
        .moveTo(44 * s, -62 * s)
        .quadraticCurveTo(62 * s, -72 * s, 84 * s, -58 * s)
        .lineTo(86 * s, -48 * s)
        .quadraticCurveTo(66 * s, -44 * s, 50 * s, -42 * s)
        .closePath(),
    red,
  );
  d.poly([50 * s, -64 * s, 44 * s, -84 * s, 58 * s, -66 * s], C.bone);
  d.poly([58 * s, -66 * s, 58 * s, -86 * s, 66 * s, -66 * s], C.bone);
  d.circle(66 * s, -58 * s, 3.5 * s, 0xffe44a, { lw: 1.4 });
  d.line([66 * s, -60 * s, 66 * s, -56 * s], OUTLINE, 1.6);
  d.glow(90 * s, -50 * s, 16 * s, C.fire, 0.5);
  d.dots([80 * s, -54 * s], 1.8 * s, OUTLINE);
}

export const BOSSES: Partial<Record<EnemyId, (d: Draw, r: number) => void>> = {
  ogre,
  troll,
  giant,
  lich,
  dragon,
};

export function drawEnemy(d: Draw, id: EnemyId, r: number): void {
  const f = SLIMES[id] ?? BOSSES[id];
  if (!f) throw new Error(`No art for enemy ${id}`);
  f(d, r);
}

/** Armored overlay: an iron helmet + plate band scaled to radius. */
export function drawArmorOverlay(d: Draw, r: number, boss: boolean): void {
  if (boss) {
    d.rrect(-r * 0.7, -r * 0.2, r * 1.4, r * 0.35, 4, C.steelDark);
    d.dots([-r * 0.5, -r * 0.03, 0, -r * 0.03, r * 0.5, -r * 0.03], r * 0.05, C.steel);
    return;
  }
  d.shape(
    (p) =>
      p
        .moveTo(-r * 0.75, -r * 0.45)
        .quadraticCurveTo(0, -r * 1.25, r * 0.75, -r * 0.45)
        .lineTo(r * 0.55, -r * 0.35)
        .quadraticCurveTo(0, -r * 0.6, -r * 0.55, -r * 0.35)
        .closePath(),
    C.steel,
  );
  d.dots([-r * 0.4, -r * 0.6, r * 0.4, -r * 0.6, 0, -r * 0.8], r * 0.06, C.steelDark);
}

/** Regrowth sprout. */
export function drawRegenOverlay(d: Draw, r: number): void {
  d.line([r * 0.1, -r * 0.8, r * 0.15, -r * 1.25], 0x3f8f3a, 2.5);
  d.shape(
    (p) =>
      p
        .moveTo(r * 0.15, -r * 1.1)
        .quadraticCurveTo(r * 0.55, -r * 1.45, r * 0.6, -r * 1.05)
        .quadraticCurveTo(r * 0.35, -r * 1.0, r * 0.15, -r * 1.1)
        .closePath(),
    0x7bd63a,
    { lw: 1.6 },
  );
  d.shape(
    (p) =>
      p
        .moveTo(r * 0.12, -r * 1.2)
        .quadraticCurveTo(-r * 0.25, -r * 1.5, -r * 0.3, -r * 1.15)
        .quadraticCurveTo(-r * 0.05, -r * 1.1, r * 0.12, -r * 1.2)
        .closePath(),
    0x5fbf3a,
    { lw: 1.6 },
  );
  d.shape(
    (p) =>
      p
        .moveTo(-r * 0.75, -r * 0.6)
        .quadraticCurveTo(-r * 0.95, -r * 0.85, -r * 0.75, -r * 0.9)
        .quadraticCurveTo(-r * 0.65, -r * 0.95, -r * 0.6, -r * 0.82)
        .quadraticCurveTo(-r * 0.55, -r * 0.95, -r * 0.45, -r * 0.9)
        .quadraticCurveTo(-r * 0.3, -r * 0.82, -r * 0.6, -r * 0.55)
        .closePath(),
    0xff4f6f,
    { lw: 1.4 },
  );
}

export function drawIceBlock(d: Draw, r: number): void {
  d.rrect(-r * 1.15, -r * 1.05, r * 2.3, r * 1.9, r * 0.25, C.ice, {
    alpha: 0.55,
    lw: 2.5,
    outline: 0x5fb8d8,
  });
  d.line([-r * 0.8, -r * 0.7, -r * 0.4, -r * 0.85], 0xffffff, 3, 0.8);
  d.line([r * 0.5, r * 0.4, r * 0.85, r * 0.2], 0xffffff, 2, 0.6);
}
