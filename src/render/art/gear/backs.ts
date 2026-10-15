import { type Draw, shade } from '../pen';
import { C } from '../palette';

/** Back pieces: origin at upper back (≈ chest level); drawn behind the body. */

export function cape(
  d: Draw,
  o: {
    color: number;
    lining?: number;
    trim?: number;
    stars?: number;
    len?: number;
    tattered?: boolean;
    glow?: number;
  },
): void {
  const L = o.len ?? 44;
  if (o.glow) d.glow(0, L * 0.4, 34, o.glow, 0.35);
  d.shape((p) => {
    p.moveTo(-14, -8).quadraticCurveTo(-26, L * 0.5, -22, L);
    if (o.tattered) {
      for (let i = 0; i < 6; i++) p.lineTo(-22 + (i + 0.5) * 7.5, L - (i % 2 ? 7 : -2));
      p.lineTo(22, L);
    } else p.quadraticCurveTo(0, L + 6, 22, L);
    p.quadraticCurveTo(26, L * 0.5, 14, -8).closePath();
  }, o.color);
  d.p
    .moveTo(6, -6)
    .quadraticCurveTo(22, L * 0.5, 20, L - 2)
    .lineTo(10, L)
    .quadraticCurveTo(12, L * 0.5, 2, -6)
    .fill({ color: shade(o.color, 0.3) });
  if (o.lining)
    d.p
      .moveTo(-14, -8)
      .quadraticCurveTo(-24, L * 0.5, -21, L - 1)
      .lineTo(-16, L)
      .quadraticCurveTo(-19, L * 0.5, -10, -8)
      .fill({ color: o.lining });
  if (o.trim)
    d.p
      .moveTo(-22, L)
      .quadraticCurveTo(0, L + 6, 22, L)
      .stroke({ width: 3, color: o.trim });
  if (o.stars) {
    d.star(-8, L * 0.45, 3.5, o.stars, { lw: 1 });
    d.star(8, L * 0.7, 3, o.stars, { lw: 1 });
    d.star(-4, L * 0.85, 2.5, o.stars, { lw: 1 });
    d.p.circle(10, L * 0.3, 1.5).fill({ color: o.stars });
    d.p.circle(-12, L * 0.7, 1.2).fill({ color: o.stars });
  }
  d.ellipse(-13, -8, 5, 4, C.gold, { lw: 1.6 });
  d.ellipse(13, -8, 5, 4, C.gold, { lw: 1.6 });
}

export function quiver(
  d: Draw,
  o: { color: number; arrows: number; fletch: number; glow?: number; trim?: number },
): void {
  if (o.glow) d.glow(-10, -18, 22, o.glow, 0.4);
  // tilted over the shoulder
  for (let i = 0; i < o.arrows; i++) {
    const x = -16 + i * 4;
    d.line([x + 6, -8, x - 2, -30], C.wood, 2);
    d.poly([x - 5, -31, x - 2, -38, x + 1, -31, x - 2, -29], o.fletch, { lw: 1.2 });
  }
  d.shape((p) => p.moveTo(-14, -14).lineTo(2, -18).lineTo(16, 22).lineTo(4, 26).closePath(), o.color);
  d.p
    .moveTo(-2, -15)
    .lineTo(4, -17)
    .lineTo(14, 20)
    .lineTo(10, 22)
    .closePath()
    .fill({ color: shade(o.color, 0.3) });
  if (o.trim) {
    d.line([-12, -10, 3, -14], o.trim, 3);
    d.line([4, 18, 14, 15], o.trim, 3);
  }
}

export function banner(
  d: Draw,
  o: {
    cloth: number;
    trim: number;
    emblem: 'none' | 'sword' | 'dragon' | 'eagle';
    pole?: number;
    big?: boolean;
  },
): void {
  const h = o.big ? 92 : 78;
  const w = o.big ? 30 : 24;
  d.bar([-10, 30, -10, -h], o.pole ?? C.woodDark, 3);
  d.circle(-10, -h - 3, 4, C.gold, { lw: 2 });
  d.bar([-10, -h + 6, -10 + w + 4, -h + 6], o.pole ?? C.woodDark, 2.5);
  d.shape(
    (p) =>
      p
        .moveTo(-8, -h + 8)
        .lineTo(-8 + w, -h + 8)
        .lineTo(-8 + w, -h + 8 + w * 1.6)
        .lineTo(-8 + w / 2, -h + 8 + w * 1.3)
        .lineTo(-8, -h + 8 + w * 1.6)
        .closePath(),
    o.cloth,
  );
  d.p
    .moveTo(-8 + w * 0.6, -h + 9)
    .lineTo(-8 + w, -h + 9)
    .lineTo(-8 + w, -h + 8 + w * 1.55)
    .lineTo(-8 + w * 0.6, -h + 8 + w * 1.4)
    .fill({ color: shade(o.cloth, 0.25) });
  d.p
    .moveTo(-8, -h + 10)
    .lineTo(-8 + w, -h + 10)
    .stroke({ width: 3, color: o.trim });
  const cx = -8 + w / 2;
  const cy = -h + 8 + w * 0.65;
  if (o.emblem === 'sword') {
    d.line([cx, cy - 10, cx, cy + 10], o.trim, 2.5);
    d.line([cx - 5, cy + 4, cx + 5, cy + 4], o.trim, 2.5);
  } else if (o.emblem === 'dragon') {
    d.shape(
      (p) =>
        p
          .moveTo(cx - 8, cy + 8)
          .quadraticCurveTo(cx - 10, cy - 8, cx + 2, cy - 10)
          .quadraticCurveTo(cx + 10, cy - 6, cx + 4, cy)
          .lineTo(cx + 9, cy + 2)
          .lineTo(cx + 2, cy + 3)
          .quadraticCurveTo(cx - 2, cy + 6, cx - 8, cy + 8)
          .closePath(),
      o.trim,
      { lw: 1.5 },
    );
  } else if (o.emblem === 'eagle') {
    d.shape(
      (p) =>
        p
          .moveTo(cx, cy - 6)
          .lineTo(cx + 11, cy - 10)
          .lineTo(cx + 6, cy + 2)
          .lineTo(cx, cy + 10)
          .lineTo(cx - 6, cy + 2)
          .lineTo(cx - 11, cy - 10)
          .closePath(),
      o.trim,
      { lw: 1.5 },
    );
  }
}

export function wings(d: Draw, o: { color: number; tip: number; pairs: 1 | 3; glow?: number }): void {
  if (o.glow) d.glow(0, -6, 52, o.glow, 0.35);
  const wing = (sx: number, dy: number, scale: number) => {
    d.shape(
      (p) =>
        p
          .moveTo(0, dy)
          .quadraticCurveTo(sx * 30 * scale, dy - 34 * scale, sx * 52 * scale, dy - 20 * scale)
          .quadraticCurveTo(sx * 44 * scale, dy - 6 * scale, sx * 48 * scale, dy + 2 * scale)
          .quadraticCurveTo(sx * 36 * scale, dy + 2 * scale, sx * 40 * scale, dy + 12 * scale)
          .quadraticCurveTo(sx * 26 * scale, dy + 10 * scale, sx * 26 * scale, dy + 20 * scale)
          .quadraticCurveTo(sx * 12 * scale, dy + 12 * scale, 0, dy + 8)
          .closePath(),
      o.color,
    );
    d.p
      .moveTo(sx * 30 * scale, dy - 12 * scale)
      .quadraticCurveTo(sx * 44 * scale, dy - 16 * scale, sx * 50 * scale, dy - 18 * scale)
      .stroke({ width: 3, color: o.tip, cap: 'round' });
    d.p
      .moveTo(sx * 10, dy + 2)
      .quadraticCurveTo(sx * 30 * scale, dy - 14 * scale, sx * 44 * scale, dy - 14 * scale)
      .stroke({ width: 1.5, color: shade(o.color, 0.2) });
  };
  if (o.pairs === 3) {
    wing(-1, -26, 0.75);
    wing(1, -26, 0.75);
    wing(-1, 14, 0.7);
    wing(1, 14, 0.7);
  }
  wing(-1, -6, 1);
  wing(1, -6, 1);
}

export function satchel(
  d: Draw,
  color: number,
  o: { bombs?: boolean; big?: boolean; scroll?: boolean; coins?: boolean } = {},
): void {
  const s = o.big ? 1.3 : 1;
  d.line([-12, -14, 12, 18], C.leatherDark, 3);
  d.rrect(-16 * s, 0, 24 * s, 20 * s, 5, color);
  d.rrect(-16 * s, 0, 24 * s, 8 * s, 4, shade(color, 0.2), { lw: 2 });
  d.circle(-4 * s, 8 * s, 2.5, C.gold, { lw: 1.4 });
  if (o.bombs) {
    d.circle(-12 * s, -2, 6, C.black);
    d.circle(-2 * s, -4, 6, C.black);
    d.line([-9 * s, -7, -6 * s, -12], C.wood, 1.5);
    d.circle(-6 * s, -12, 1.8, C.fire, { lw: 0 });
  }
  if (o.scroll) d.rrect(2 * s, -10, 6, 18, 3, C.cloth, { lw: 1.6 });
  if (o.coins) {
    d.circle(-12 * s, -3, 4, C.gold, { lw: 1.4 });
    d.circle(-5 * s, -5, 4, C.gold, { lw: 1.4 });
  }
}

export function keg(d: Draw, o: { rune?: boolean }): void {
  d.rrect(-14, -12, 26, 32, 8, C.wood);
  d.p.roundRect(2, -10, 9, 28, 6).fill({ color: shade(C.wood, 0.25) });
  d.rrect(-15, -6, 28, 4, 2, C.darkIron, { lw: 1.8 });
  d.rrect(-15, 12, 28, 4, 2, C.darkIron, { lw: 1.8 });
  if (o.rune) {
    d.glow(-1, 4, 16, C.arcane, 0.45);
    d.p
      .moveTo(-6, 0)
      .lineTo(-1, 9)
      .lineTo(4, 0)
      .moveTo(-1, 9)
      .lineTo(-1, -4)
      .stroke({ width: 2.5, color: C.arcane, cap: 'round' });
  } else {
    d.p.moveTo(-6, 4).lineTo(4, 4).stroke({ width: 2, color: 0x1d1410 });
    d.circle(-1, 4, 3, 0x1d1410, { lw: 0 });
  }
  d.line([8, -14, 12, -22], C.wood, 1.8);
  d.circle(12, -22, 2.2, C.fire, { lw: 0 });
}

export function pack(d: Draw): void {
  // Guildmaster's pack: overstuffed backpack with tools, caltrops and coin pouch
  d.rrect(-18, -14, 30, 34, 7, C.leatherDark);
  d.rrect(-18, -14, 30, 12, 6, C.leather, { lw: 2 });
  d.line([-24, -4, -16, 22], C.steel, 2.5);
  d.poly([-26, -8, -22, -4, -26, 0], C.steel, { lw: 1.5 });
  d.circle(10, 14, 7, C.gold);
  d.star(10, 14, 3, C.goldDark, { lw: 0 });
  d.rrect(-8, -22, 14, 10, 3, C.crimson, { lw: 2 });
  for (let i = 0; i < 3; i++) d.poly([-14 + i * 6, 18, -12 + i * 6, 14, -10 + i * 6, 18], C.steel, { lw: 1 });
}

export function powderSatchel(d: Draw): void {
  satchel(d, 0x6e5a3a, { bombs: true });
}
