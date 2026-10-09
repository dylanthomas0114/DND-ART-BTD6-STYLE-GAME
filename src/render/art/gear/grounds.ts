import { type Draw, shade, tint } from '../pen';
import { C } from '../palette';

/** Ground pieces: origin between the hero's feet, drawn behind the body unless marked `front`. */

export function standard(
  d: Draw,
  o: {
    cloth: number;
    trim: number;
    emblem?: 'sword' | 'dragon' | 'eagle';
    tall?: number;
    x?: number;
    fringe?: boolean;
  },
): void {
  const x = o.x ?? -30;
  const h = o.tall ?? 104;
  // base stones
  d.ellipse(x, 2, 11, 5, C.stone);
  d.bar([x, 0, x, -h], C.woodDark, 3.5);
  d.poly([x - 4, -h, x, -h - 12, x + 4, -h], C.gold, { lw: 2 });
  d.bar([x - 2, -h + 6, x + 30, -h + 6], C.woodDark, 2.5);
  const w = 28;
  d.shape(
    (p) =>
      p
        .moveTo(x, -h + 8)
        .quadraticCurveTo(x + w * 0.5, -h + 4, x + w, -h + 8)
        .lineTo(x + w + 4, -h + 48)
        .lineTo(x + w * 0.5 + 2, -h + 40)
        .lineTo(x + 2, -h + 50)
        .closePath(),
    o.cloth,
  );
  d.p
    .moveTo(x + w * 0.6, -h + 8)
    .lineTo(x + w, -h + 8)
    .lineTo(x + w + 4, -h + 48)
    .lineTo(x + w * 0.6, -h + 42)
    .fill({ color: shade(o.cloth, 0.25) });
  if (o.fringe)
    for (let i = 0; i < 5; i++)
      d.p.circle(x + 3 + i * 6, -h + 47 - (i === 2 ? 6 : 0), 1.6).fill({ color: o.trim });
  const cx = x + w * 0.5 + 1;
  const cy = -h + 26;
  if (o.emblem === 'sword') {
    d.line([cx, cy - 11, cx, cy + 9], o.trim, 2.5);
    d.line([cx - 5, cy + 3, cx + 5, cy + 3], o.trim, 2.5);
  } else if (o.emblem === 'dragon') {
    d.shape(
      (p) =>
        p
          .moveTo(cx - 9, cy + 9)
          .quadraticCurveTo(cx - 11, cy - 9, cx + 2, cy - 11)
          .quadraticCurveTo(cx + 11, cy - 6, cx + 4, cy)
          .lineTo(cx + 10, cy + 3)
          .lineTo(cx + 2, cy + 3)
          .quadraticCurveTo(cx - 2, cy + 7, cx - 9, cy + 9)
          .closePath(),
      o.trim,
      { lw: 1.5 },
    );
  } else if (o.emblem === 'eagle') {
    d.shape(
      (p) =>
        p
          .moveTo(cx, cy - 7)
          .lineTo(cx + 12, cy - 11)
          .lineTo(cx + 6, cy + 2)
          .lineTo(cx, cy + 11)
          .lineTo(cx - 6, cy + 2)
          .lineTo(cx - 12, cy - 11)
          .closePath(),
      o.trim,
      { lw: 1.5 },
    );
  }
}

export function crate(d: Draw, o: { color?: number; rune?: boolean; bombs?: boolean; x?: number }): void {
  const x = o.x ?? -30;
  const col = o.color ?? C.wood;
  d.rrect(x - 14, -24, 28, 24, 3, col);
  d.p.rect(x + 2, -22, 10, 20).fill({ color: shade(col, 0.2) });
  d.line([x - 12, -22, x + 12, -2], shade(col, 0.4), 2);
  d.line([x - 14, -12, x + 14, -12], shade(col, 0.4), 2);
  if (o.bombs) {
    d.circle(x - 6, -28, 6, C.black);
    d.circle(x + 6, -28, 6, C.black);
    d.hi(x - 8, -30, 2, 1.5);
  }
  if (o.rune) {
    d.glow(x, -12, 18, C.arcane, 0.5);
    d.p
      .moveTo(x - 5, -18)
      .lineTo(x, -6)
      .lineTo(x + 5, -18)
      .stroke({ width: 2.5, color: C.arcane, cap: 'round' });
    d.gem(x, -28, 5, C.arcane);
  }
}

export function caltropPile(d: Draw, n: number, x = 26): void {
  for (let i = 0; i < n; i++) {
    const cx = x - 10 + (i % 4) * 7;
    const cy = -2 - Math.floor(i / 4) * 5;
    d.poly([cx - 4, cy, cx, cy - 6, cx + 4, cy, cx, cy - 2], C.steelDark, { lw: 1.2 });
  }
}

export function trapCart(d: Draw): void {
  const x = -34;
  d.circle(x - 10, -4, 7, C.woodDark);
  d.circle(x + 12, -4, 7, C.woodDark);
  d.rrect(x - 20, -24, 40, 16, 3, C.wood);
  caltropPile(d, 8, x + 4);
  d.rrect(x - 4, -34, 12, 10, 2, C.black, { lw: 2 });
  d.line([x + 4, -34, x + 8, -40], C.wood, 1.5);
  d.line([x + 20, -14, x + 34, -20], C.woodDark, 3);
}

export function runeCircle(d: Draw, color: number, r = 34, glacier = false): void {
  if (glacier) {
    d.ellipse(0, 0, r + 8, (r + 8) * 0.38, C.ice, { lw: 2.5 });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const x = Math.cos(a) * (r + 2);
      const y = Math.sin(a) * (r + 2) * 0.38;
      if (y < -2) continue;
      d.poly([x - 6, y, x, y - 14 - (i % 3) * 6, x + 6, y], C.frost, { lw: 1.8 });
    }
    d.glow(0, -4, r, C.frost, 0.3);
    return;
  }
  d.p.ellipse(0, 0, r, r * 0.36).fill({ color, alpha: 0.35 });
  d.p.ellipse(0, 0, r, r * 0.36).stroke({ width: 2.5, color: tint(color, 0.3) });
  d.p.ellipse(0, 0, r * 0.7, r * 0.25).stroke({ width: 1.5, color: tint(color, 0.3) });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    d.p.circle(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.31, 2).fill({ color: C.white });
  }
}

export function shrine(d: Draw, o: { temple?: boolean }): void {
  const x = -36;
  if (o.temple) {
    d.rrect(x - 26, -46, 52, 46, 2, C.white);
    for (let i = 0; i < 4; i++) d.rrect(x - 22 + i * 14, -42, 6, 40, 2, C.cloth, { lw: 1.6 });
    d.poly([x - 30, -46, x, -66, x + 30, -46], C.gold);
    d.circle(x, -54, 4, C.radiant, { lw: 1.5 });
    d.rrect(x - 30, -4, 60, 6, 2, C.stone, { lw: 2 });
    d.glow(x, -54, 16, C.radiant, 0.5);
    return;
  }
  d.rrect(x - 10, -30, 20, 30, 3, C.stone);
  d.poly([x - 13, -30, x, -40, x + 13, -30], shade(C.stone, 0.2));
  d.rrect(x - 5, -24, 10, 12, 4, 0x3a3030, { lw: 1.5 });
  d.circle(x, -18, 3, C.radiant, { lw: 0 });
  d.glow(x, -18, 9, C.radiant, 0.5);
  d.ellipse(x - 12, -1, 4, 2.5, C.red, { lw: 1.2 });
  d.ellipse(x + 13, -1, 4, 2.5, C.gold, { lw: 1.2 });
}

export function tent(d: Draw, o: { color: number; x?: number }): void {
  const x = o.x ?? -40;
  d.poly([x - 22, 0, x, -36, x + 22, 0], o.color);
  d.poly([x, -36, x + 22, 0, x + 6, 0], shade(o.color, 0.25), { lw: 0 });
  d.poly([x - 6, 0, x, -18, x + 6, 0], 0x2a2018, { lw: 2 });
  d.line([x, -36, x, -44], C.woodDark, 2);
  d.poly([x, -44, x + 10, -41, x, -38], C.red, { lw: 1.5 });
  // spyglass on a stand
  d.line([x + 26, 0, x + 30, -18], C.woodDark, 2);
  d.rrect(x + 22, -26, 18, 6, 3, C.bronze, { lw: 2 });
}

export function wagon(d: Draw, o: { x?: number; color?: number }): void {
  const x = o.x ?? -42;
  const col = o.color ?? C.wood;
  d.shape(
    (p) =>
      p
        .moveTo(x - 24, -26)
        .quadraticCurveTo(x, -48, x + 24, -26)
        .closePath(),
    C.cloth,
  );
  d.rrect(x - 26, -28, 52, 16, 3, col);
  d.circle(x - 14, -6, 8, C.woodDark);
  d.circle(x + 14, -6, 8, C.woodDark);
  d.dots([x - 14, -6, x + 14, -6], 2.5, C.bronze);
  d.rrect(x - 8, -40, 14, 10, 2, C.wood, { lw: 2 });
  d.line([x + 26, -18, x + 40, -24], C.woodDark, 3);
}

export function camp(d: Draw): void {
  // palisade wall with a gate tower behind the crew
  for (let i = 0; i < 9; i++) {
    const x = -48 + i * 12;
    d.poly(
      [x - 5, 0, x - 5, -32 - (i % 2) * 4, x, -40 - (i % 2) * 4, x + 5, -32 - (i % 2) * 4, x + 5, 0],
      i % 2 ? C.wood : shade(C.wood, 0.1),
      { lw: 2 },
    );
  }
  d.rrect(-62, -58, 22, 58, 2, C.woodDark);
  d.poly([-66, -58, -51, -74, -36, -58], C.red);
  d.circle(-51, -44, 5, 0x2a2018, { lw: 1.5 });
}

/** Companion creatures: origin at the creature's feet; they face right. */
export function wolf(
  d: Draw,
  o: { color: number; belly: number; size: number; eyes?: number; frost?: boolean },
): void {
  const s = o.size;
  d.p.ellipse(0, 0, 18 * s, 5 * s).fill({ color: 0x000000, alpha: 0.25 });
  // tail
  d.shape(
    (p) =>
      p
        .moveTo(-14 * s, -14 * s)
        .quadraticCurveTo(-30 * s, -20 * s, -28 * s, -34 * s)
        .quadraticCurveTo(-20 * s, -20 * s, -10 * s, -18 * s)
        .closePath(),
    o.color,
  );
  // legs
  for (const lx of [-10, -4, 6, 12])
    d.rrect(lx * s - 2.5 * s, -10 * s, 5 * s, 10 * s, 2, lx > 0 ? o.color : shade(o.color, 0.2), { lw: 2 });
  // body
  d.ellipse(0, -16 * s, 17 * s, 10 * s, o.color);
  d.p.ellipse(2 * s, -11 * s, 11 * s, 4.5 * s).fill({ color: o.belly });
  // head
  d.shape(
    (p) =>
      p
        .moveTo(8 * s, -22 * s)
        .quadraticCurveTo(14 * s, -36 * s, 24 * s, -30 * s)
        .lineTo(34 * s, -24 * s)
        .quadraticCurveTo(32 * s, -18 * s, 22 * s, -18 * s)
        .quadraticCurveTo(14 * s, -14 * s, 8 * s, -22 * s)
        .closePath(),
    o.color,
  );
  d.poly([12 * s, -30 * s, 14 * s, -44 * s, 20 * s, -32 * s], o.color);
  d.poly([18 * s, -31 * s, 22 * s, -43 * s, 25 * s, -30 * s], shade(o.color, 0.15));
  d.circle(34 * s, -24 * s, 2.6 * s, 0x1d1410, { lw: 0 });
  d.circle(23 * s, -28 * s, 2.2 * s, o.eyes ?? 0xffd36b, { lw: 1.2 });
  if (o.frost) {
    d.glow(0, -18 * s, 26 * s, C.frost, 0.3);
    for (let i = 0; i < 4; i++)
      d.poly([-8 * s + i * 6 * s, -25 * s, -5 * s + i * 6 * s, -33 * s, -2 * s + i * 6 * s, -25 * s], C.ice, {
        lw: 1.4,
      });
  }
}

export function owlbear(d: Draw, o: { size: number; elder?: boolean }): void {
  const s = o.size;
  const fur = o.elder ? 0x6b5a4a : 0x8a5f3a;
  d.p.ellipse(0, 0, 22 * s, 6 * s).fill({ color: 0x000000, alpha: 0.25 });
  d.ellipse(-8 * s, -6 * s, 7 * s, 6 * s, shade(fur, 0.2));
  d.ellipse(10 * s, -6 * s, 7 * s, 6 * s, fur);
  d.ellipse(0, -24 * s, 20 * s, 20 * s, fur);
  d.p.ellipse(4 * s, -18 * s, 12 * s, 12 * s).fill({ color: 0xd9b48a });
  for (let i = 0; i < 3; i++)
    d.p
      .moveTo(-2 * s + i * 5 * s, -20 * s)
      .lineTo(i * 5 * s, -14 * s)
      .stroke({ width: 1.4, color: shade(0xd9b48a, 0.3) });
  // owl head
  d.circle(4 * s, -46 * s, 15 * s, o.elder ? 0xe9e1d0 : 0xc89a6a);
  d.poly([-8 * s, -56 * s, -12 * s, -68 * s, -2 * s, -58 * s], o.elder ? 0xe9e1d0 : 0xc89a6a);
  d.poly([14 * s, -56 * s, 18 * s, -68 * s, 8 * s, -58 * s], o.elder ? 0xd9d1c0 : 0xb88a5a);
  d.circle(-1 * s, -47 * s, 5 * s, 0xffffff, { lw: 1.5 });
  d.circle(11 * s, -47 * s, 5 * s, 0xffffff, { lw: 1.5 });
  d.circle(0, -47 * s, 2.6 * s, o.elder ? C.arcane : 0xffa21f, { lw: 0 });
  d.circle(12 * s, -47 * s, 2.6 * s, o.elder ? C.arcane : 0xffa21f, { lw: 0 });
  d.poly([3 * s, -42 * s, 9 * s, -42 * s, 6 * s, -34 * s], C.gold, { lw: 1.5 });
  // claws raised
  d.ellipse(22 * s, -30 * s, 6 * s, 8 * s, fur);
  for (let i = 0; i < 3; i++)
    d.poly([20 * s + i * 3 * s, -38 * s, 22 * s + i * 3 * s, -44 * s, 24 * s + i * 3 * s, -38 * s], C.bone, {
      lw: 1,
    });
  if (o.elder) {
    d.glow(4 * s, -40 * s, 28 * s, C.arcane, 0.2);
    d.poly(
      [-4 * s, -60 * s, 4 * s, -74 * s, 12 * s, -60 * s, 6 * s, -64 * s, 4 * s, -60 * s, 2 * s, -64 * s],
      C.gold,
      { lw: 1.5 },
    );
  }
}

export function bird(d: Draw, o: { kind: 'owl' | 'raven' | 'astral'; size?: number; perchY?: number }): void {
  const s = o.size ?? 1;
  const y0 = o.perchY ?? -64;
  const col = o.kind === 'owl' ? 0xa07a54 : o.kind === 'raven' ? 0x2a2440 : 0x7fa8ff;
  if (o.kind === 'astral') d.glow(0, y0 - 10 * s, 24 * s, C.arcane, 0.5);
  if (o.kind === 'raven') d.glow(0, y0 - 10 * s, 16 * s, C.arcane, 0.3);
  d.ellipse(0, y0 - 10 * s, 10 * s, 13 * s, col, { alpha: o.kind === 'astral' ? 0.9 : 1 });
  d.shape(
    (p) =>
      p
        .moveTo(-8 * s, y0 - 12 * s)
        .quadraticCurveTo(-22 * s, y0 - 18 * s, -20 * s, y0 - 2 * s)
        .quadraticCurveTo(-12 * s, y0 - 6 * s, -6 * s, y0 - 2 * s)
        .closePath(),
    shade(col, 0.2),
  );
  if (o.kind === 'owl') {
    d.circle(-3 * s, y0 - 14 * s, 4 * s, 0xffffff, { lw: 1.2 });
    d.circle(5 * s, y0 - 14 * s, 4 * s, 0xffffff, { lw: 1.2 });
    d.circle(-2.5 * s, y0 - 14 * s, 2 * s, 0x1d1410, { lw: 0 });
    d.circle(5.5 * s, y0 - 14 * s, 2 * s, 0x1d1410, { lw: 0 });
    d.poly([0, y0 - 11 * s, 3 * s, y0 - 11 * s, 1.5 * s, y0 - 7 * s], C.gold, { lw: 1 });
    d.poly([-7 * s, y0 - 20 * s, -5 * s, y0 - 26 * s, -2 * s, y0 - 21 * s], col, { lw: 1.4 });
    d.poly([6 * s, y0 - 21 * s, 8 * s, y0 - 26 * s, 9 * s, y0 - 20 * s], col, { lw: 1.4 });
  } else {
    d.circle(4 * s, y0 - 16 * s, 2.4 * s, o.kind === 'astral' ? C.radiant : C.arcane, { lw: 0 });
    d.poly(
      [8 * s, y0 - 16 * s, 16 * s, y0 - 13 * s, 8 * s, y0 - 11 * s],
      o.kind === 'astral' ? C.radiant : 0x3a3440,
      { lw: 1.4 },
    );
    if (o.kind === 'astral') {
      d.star(-12 * s, y0 - 26 * s, 3.5 * s, C.radiant, { lw: 1 });
      d.star(12 * s, y0 - 30 * s, 2.5 * s, C.radiant, { lw: 1 });
    }
  }
  d.line([-3 * s, y0 + 2 * s, -3 * s, y0 + 5 * s], C.gold, 1.5);
  d.line([3 * s, y0 + 2 * s, 3 * s, y0 + 5 * s], C.gold, 1.5);
}

export function fox(d: Draw): void {
  d.p.ellipse(0, 0, 14, 4).fill({ color: 0x000000, alpha: 0.25 });
  d.shape(
    (p) =>
      p.moveTo(-10, -10).quadraticCurveTo(-28, -14, -24, -28).quadraticCurveTo(-16, -16, -6, -14).closePath(),
    C.white,
  );
  d.circle(-25, -27, 3, C.white, { lw: 1.5 });
  for (const lx of [-6, -1, 5, 9]) d.rrect(lx - 2, -8, 4, 8, 2, C.white, { lw: 1.6 });
  d.ellipse(0, -12, 12, 7, C.white);
  d.shape(
    (p) =>
      p
        .moveTo(6, -16)
        .quadraticCurveTo(10, -28, 18, -24)
        .lineTo(26, -18)
        .quadraticCurveTo(22, -12, 14, -13)
        .closePath(),
    C.white,
  );
  d.poly([9, -24, 10, -34, 15, -25], C.white);
  d.poly([14, -24, 17, -33, 19, -23], 0xe0e8f0);
  d.circle(26, -18, 2, 0x1d1410, { lw: 0 });
  d.circle(17, -21, 1.8, 0x3a7ac4, { lw: 1 });
}

export function bear(d: Draw, o: { frost?: boolean }): void {
  const col = o.frost ? 0xf2f6fa : 0x6b4a33;
  d.p.ellipse(0, 0, 26, 7).fill({ color: 0x000000, alpha: 0.25 });
  for (const lx of [-16, -6, 8, 18])
    d.rrect(lx - 5, -14, 10, 14, 4, lx > 0 ? col : shade(col, 0.1), { lw: 2 });
  d.ellipse(0, -24, 26, 16, col);
  d.ellipse(22, -36, 12, 11, col);
  d.circle(18, -46, 4.5, col, { lw: 2 });
  d.ellipse(31, -33, 6, 4.5, tint(col, 0.2), { lw: 2 });
  d.circle(35, -34, 2.2, 0x1d1410, { lw: 0 });
  d.circle(24, -39, 2, 0x1d1410, { lw: 0 });
  if (o.frost) {
    d.glow(0, -26, 34, C.frost, 0.25);
    for (let i = 0; i < 5; i++)
      d.poly([-18 + i * 8, -36, -15 + i * 8, -46, -12 + i * 8, -36], C.ice, { lw: 1.5 });
  }
}

export function wyrm(d: Draw): void {
  d.glow(0, -40, 46, C.frost, 0.3);
  d.p.ellipse(0, 0, 24, 6).fill({ color: 0x000000, alpha: 0.25 });
  // coiled serpentine body
  d.shape(
    (p) =>
      p
        .moveTo(-26, -4)
        .quadraticCurveTo(-30, -26, -8, -28)
        .quadraticCurveTo(14, -30, 10, -48)
        .quadraticCurveTo(8, -62, 20, -66)
        .lineTo(26, -60)
        .quadraticCurveTo(18, -56, 20, -46)
        .quadraticCurveTo(24, -20, -2, -18)
        .quadraticCurveTo(-18, -16, -14, -4)
        .closePath(),
    0x9fd8f0,
  );
  d.p.moveTo(-20, -8).quadraticCurveTo(-22, -22, -6, -23).stroke({ width: 3, color: C.ice });
  // wings
  d.shape(
    (p) =>
      p
        .moveTo(-4, -36)
        .quadraticCurveTo(-30, -60, -40, -44)
        .quadraticCurveTo(-28, -44, -24, -36)
        .quadraticCurveTo(-16, -38, -4, -30)
        .closePath(),
    0x6fb8e0,
  );
  // head
  d.shape(
    (p) =>
      p
        .moveTo(18, -66)
        .quadraticCurveTo(30, -78, 42, -70)
        .lineTo(46, -64)
        .quadraticCurveTo(34, -60, 24, -58)
        .closePath(),
    0xbfeaff,
  );
  d.poly([22, -72, 20, -84, 28, -74], C.ice, { lw: 1.5 });
  d.poly([28, -74, 30, -86, 34, -74], C.ice, { lw: 1.5 });
  d.circle(34, -68, 2.2, C.arcane, { lw: 0 });
}

export function astralSpirit(d: Draw): void {
  bird(d, { kind: 'astral', size: 1.4, perchY: -70 });
  d.p.ellipse(0, -40, 20, 32).fill({ color: C.arcane, alpha: 0.08 });
}
