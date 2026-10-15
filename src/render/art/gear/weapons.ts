import { type Draw, OUTLINE, shade, tint } from '../pen';
import { C } from '../palette';

/** Hand-held weapon generators. Grip at (0,0); blades point up (−y), `aim` items point +x. */

export interface SwordOpts {
  len: number;
  width: number;
  blade: number;
  guard: number;
  hilt: number;
  pommel: number;
  runes?: number;
  flame?: boolean;
  glow?: number;
  /** Notched/rusty edge. */
  rusty?: boolean;
  /** Wavy, flamberge-like edge. */
  wavy?: boolean;
  guardWidth?: number;
}

export function sword(d: Draw, o: SwordOpts): void {
  const L = o.len;
  const W = o.width;
  if (o.glow) d.glow(0, -L * 0.55, L * 0.55, o.glow, 0.35);
  if (o.flame) {
    // flames licking the blade
    for (let i = 0; i < 5; i++) {
      const y = -10 - (i * (L - 14)) / 5;
      const s = 9 - i * 0.6;
      d.shape(
        (p) =>
          p
            .moveTo(-W / 2 - 2, y)
            .quadraticCurveTo(-W / 2 - s, y - s, -W / 2 - 1, y - s * 2)
            .quadraticCurveTo(-W / 2 + 3, y - s, W / 2 + 1, y - s * 1.6)
            .quadraticCurveTo(W / 2 + s, y - s * 0.5, W / 2 + 2, y)
            .closePath(),
        i % 2 ? C.fire : C.ember,
        { lw: 0, alpha: 0.85 },
      );
    }
  }
  // blade
  const pts: number[] = [];
  if (o.wavy) {
    const n = 6;
    for (let i = 0; i <= n; i++) pts.push(-W / 2 + (i % 2 ? -2 : 1), -8 - (i * (L - 18)) / n);
    pts.push(0, -L);
    for (let i = n; i >= 0; i--) pts.push(W / 2 + (i % 2 ? 2 : -1), -8 - (i * (L - 18)) / n);
  } else if (o.rusty) {
    pts.push(
      -W / 2,
      -8,
      -W / 2,
      -L * 0.45,
      -W / 2 + 1.5,
      -L * 0.5,
      -W / 2,
      -L * 0.55,
      -W / 2,
      -L + 12,
      0,
      -L,
      W / 2,
      -L + 12,
      W / 2 - 1.5,
      -L * 0.7,
      W / 2,
      -L * 0.65,
      W / 2,
      -8,
    );
  } else {
    pts.push(-W / 2, -8, -W / 2, -L + 12, 0, -L, W / 2, -L + 12, W / 2, -8);
  }
  d.poly(pts, o.blade);
  // bevel: lighter left half
  d.p
    .poly([-W / 2 + 1.5, -9, -W / 2 + 1.5, -L + 12.5, 0, -L + 3, 0, -9], true)
    .fill({ color: tint(o.blade, 0.4) });
  d.line([0, -10, 0, -L + 6], shade(o.blade, 0.25), 1.4);
  if (o.rusty) {
    d.dots([-1, -L * 0.35, 2, -L * 0.6, -2, -L * 0.75], 2, 0x9a5a2a);
  }
  if (o.runes) {
    for (let i = 0; i < 4; i++) {
      const y = -16 - i * ((L - 26) / 4);
      d.p
        .moveTo(-2, y)
        .lineTo(2, y - 3)
        .lineTo(-1, y - 6)
        .stroke({ width: 1.8, color: o.runes, cap: 'round' });
    }
    d.glow(0, -L * 0.5, W * 1.2, o.runes, 0.25);
  }
  // guard
  const gw = o.guardWidth ?? W * 1.6 + 6;
  d.shape(
    (p) =>
      p
        .moveTo(-gw, -6)
        .quadraticCurveTo(0, -11, gw, -6)
        .lineTo(gw - 1, -2)
        .quadraticCurveTo(0, -5, -gw + 1, -2)
        .closePath(),
    o.guard,
  );
  // hilt + pommel
  d.rrect(-2.5, -3, 5, 13, 2, o.hilt, { lw: 2 });
  d.line([-2.5, 1, 2.5, 3], shade(o.hilt, 0.35), 1.2);
  d.line([-2.5, 5, 2.5, 7], shade(o.hilt, 0.35), 1.2);
  d.circle(0, 12, 3.6, o.pommel, { lw: 2 });
}

export function dagger(
  d: Draw,
  blade: number,
  hilt: number,
  opts: { len?: number; curve?: boolean; drip?: number; glow?: number; serrated?: boolean } = {},
): void {
  const L = opts.len ?? 30;
  if (opts.glow) d.glow(0, -L * 0.5, L * 0.6, opts.glow, 0.4);
  if (opts.curve) {
    d.shape(
      (p) =>
        p
          .moveTo(-4, -5)
          .quadraticCurveTo(-6, -L * 0.6, 4, -L)
          .quadraticCurveTo(2, -L * 0.5, 4, -5)
          .closePath(),
      blade,
    );
  } else if (opts.serrated) {
    const pts = [-4, -5];
    for (let i = 1; i < 6; i++) pts.push(i % 2 ? -6 : -4, -5 - (i * (L - 10)) / 6);
    pts.push(0, -L, 4, -L + 10, 4, -5);
    d.poly(pts, blade);
  } else {
    d.poly([-4, -5, -4, -L + 9, 0, -L, 4, -L + 9, 4, -5], blade);
  }
  d.p.poly([-2.5, -6, -2.5, -L + 10, 0, -L + 3, 0, -6], true).fill({ color: tint(blade, 0.4) });
  if (opts.drip) {
    d.circle(-3, -L * 0.45, 2.4, opts.drip, { lw: 1.2 });
    d.circle(-4, -L * 0.25, 1.8, opts.drip, { lw: 1.2 });
    d.p.ellipse(0, -L * 0.6, 3, 8).fill({ color: opts.drip, alpha: 0.6 });
  }
  d.rrect(-7, -6, 14, 4, 2, C.gold, { lw: 2 });
  d.rrect(-2.5, -3, 5, 11, 2, hilt, { lw: 2 });
  d.circle(0, 9, 2.8, C.gold, { lw: 1.8 });
}

export function mace(
  d: Draw,
  o: {
    head: number;
    handle: number;
    len?: number;
    kind: 'plain' | 'flanged' | 'sun' | 'dawn';
    glow?: number;
  },
): void {
  const L = o.len ?? 40;
  if (o.glow) d.glow(0, -L, 22, o.glow, 0.5);
  d.rrect(-3, -L + 6, 6, L + 6, 3, o.handle);
  d.line([-3, -6, 3, -3], shade(o.handle, 0.3), 1.5);
  d.line([-3, 0, 3, 3], shade(o.handle, 0.3), 1.5);
  if (o.kind === 'plain') {
    d.circle(0, -L, 10, o.head);
    d.dots([-4, -L - 3, 3, -L + 2, -2, -L + 5], 1.6, shade(o.head, 0.35));
  } else if (o.kind === 'flanged') {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      d.poly(
        [
          Math.cos(a) * 6,
          -L + Math.sin(a) * 6,
          Math.cos(a + 0.3) * 14,
          -L + Math.sin(a + 0.3) * 14,
          Math.cos(a + 0.6) * 6,
          -L + Math.sin(a + 0.6) * 6,
        ],
        o.head,
        { lw: 2 },
      );
    }
    d.circle(0, -L, 8, o.head);
  } else {
    // sun/dawn: radiant star head
    d.star(0, -L, o.kind === 'dawn' ? 18 : 15, o.head, undefined, o.kind === 'dawn' ? 12 : 8, 0.6);
    d.circle(0, -L, o.kind === 'dawn' ? 8 : 7, tint(o.head, 0.5));
    if (o.kind === 'dawn') d.gem(0, -L, 4, C.ember);
  }
  d.hi(-4, -L - 4, 3.5, 2.5);
  d.circle(0, 7, 3.5, C.gold, { lw: 2 });
}

export type StaffHead =
  'knot' | 'crook' | 'orb' | 'crystal' | 'flame' | 'phoenix' | 'sun' | 'snowflake' | 'icicles' | 'blizzard';

export function staff(
  d: Draw,
  o: { wood: number; len?: number; head: StaffHead; color?: number; glow?: number },
): void {
  const L = o.len ?? 64;
  const col = o.color ?? C.arcane;
  if (o.glow) d.glow(0, -L + 4, 22, o.glow, 0.45);
  // shaft with slight bend
  d.shape(
    (p) =>
      p
        .moveTo(-3, 18)
        .quadraticCurveTo(-5, -L * 0.5, -2, -L + 8)
        .lineTo(3, -L + 8)
        .quadraticCurveTo(0, -L * 0.5, 3, 18)
        .closePath(),
    o.wood,
  );
  d.line([0, 10, -1, -L * 0.6], tint(o.wood, 0.25), 1.4);
  const hy = -L + 4;
  switch (o.head) {
    case 'knot':
      d.circle(0, hy, 8, o.wood);
      d.circle(-5, hy - 6, 4, o.wood);
      d.ellipse(4, hy + 6, 4, 2.5, C.green, { lw: 1.5 });
      break;
    case 'crook':
      d.shape(
        (p) =>
          p
            .moveTo(-2, hy + 4)
            .quadraticCurveTo(-4, hy - 18, 10, hy - 16)
            .quadraticCurveTo(18, hy - 8, 10, hy - 2)
            .lineTo(8, hy - 6)
            .quadraticCurveTo(12, hy - 10, 6, hy - 11)
            .quadraticCurveTo(2, hy - 10, 3, hy + 4)
            .closePath(),
        o.wood,
      );
      d.ellipse(10, hy - 1, 3, 2, C.green, { lw: 1.2 });
      break;
    case 'orb':
      d.shape(
        (p) =>
          p
            .moveTo(-8, hy + 4)
            .quadraticCurveTo(-12, hy - 10, 0, hy - 18)
            .quadraticCurveTo(12, hy - 10, 8, hy + 4)
            .lineTo(5, hy + 2)
            .quadraticCurveTo(7, hy - 8, 0, hy - 13)
            .quadraticCurveTo(-7, hy - 8, -5, hy + 2)
            .closePath(),
        o.wood,
      );
      d.circle(0, hy - 6, 7, col);
      d.hi(-2, -L - 4, 2.5, 2);
      break;
    case 'crystal':
      d.poly([0, hy - 22, 7, hy - 8, 0, hy + 2, -7, hy - 8], col);
      d.p.poly([0, hy - 22, -7, hy - 8, 0, hy - 4], true).fill({ color: tint(col, 0.5) });
      d.shape(
        (p) =>
          p
            .moveTo(-8, hy + 2)
            .quadraticCurveTo(0, hy - 4, 8, hy + 2)
            .lineTo(6, hy + 6)
            .lineTo(-6, hy + 6)
            .closePath(),
        o.wood,
      );
      break;
    case 'flame':
      d.shape(
        (p) =>
          p
            .moveTo(-8, hy + 2)
            .quadraticCurveTo(-14, hy - 14, 0, hy - 26)
            .quadraticCurveTo(-2, hy - 14, 8, hy - 18)
            .quadraticCurveTo(14, hy - 6, 8, hy + 2)
            .closePath(),
        C.fire,
      );
      d.shape(
        (p) =>
          p
            .moveTo(-4, hy)
            .quadraticCurveTo(-7, hy - 10, 0, hy - 17)
            .quadraticCurveTo(6, hy - 8, 4, hy)
            .closePath(),
        C.radiant,
        { lw: 0 },
      );
      d.rrect(-6, hy, 12, 6, 2, C.goldDark);
      break;
    case 'phoenix':
      // stylised bird wings around an ember
      d.shape(
        (p) =>
          p
            .moveTo(0, hy)
            .quadraticCurveTo(-22, hy - 6, -18, hy - 28)
            .quadraticCurveTo(-10, hy - 16, -4, hy - 14)
            .closePath(),
        C.ember,
      );
      d.shape(
        (p) =>
          p
            .moveTo(0, hy)
            .quadraticCurveTo(22, hy - 6, 18, hy - 28)
            .quadraticCurveTo(10, hy - 16, 4, hy - 14)
            .closePath(),
        C.ember,
      );
      d.shape(
        (p) =>
          p
            .moveTo(-6, hy - 2)
            .quadraticCurveTo(-10, hy - 16, 0, hy - 30)
            .quadraticCurveTo(10, hy - 16, 6, hy - 2)
            .closePath(),
        C.fire,
      );
      d.circle(0, hy - 12, 5, C.radiant, { lw: 1.5 });
      d.rrect(-6, hy, 12, 6, 2, C.gold);
      break;
    case 'sun':
      d.star(0, hy - 14, 16, C.gold, undefined, 10, 0.55);
      d.circle(0, hy - 14, 8, C.radiant);
      d.circle(0, hy - 14, 4, C.fire, { lw: 0 });
      d.rrect(-5, hy - 2, 10, 6, 2, C.goldDark);
      break;
    case 'snowflake':
    case 'icicles':
    case 'blizzard': {
      const s = o.head === 'blizzard' ? 18 : 13;
      if (o.head === 'icicles') {
        for (let i = -2; i <= 2; i++)
          d.poly([i * 5 - 3, hy, i * 5 + 3, hy, i * 5, hy - 14 - (2 - Math.abs(i)) * 6], C.ice, { lw: 2 });
      } else {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          d.bar([0, hy - s, Math.cos(a) * s, hy - s + Math.sin(a) * s], C.ice, 3);
        }
        d.circle(0, hy - s, 5, C.frost);
      }
      d.rrect(-6, hy, 12, 5, 2, shade(o.wood, 0.1));
      break;
    }
  }
}

export function wand(d: Draw, o: { color: number; tip: number }): void {
  // aim item: points +x
  d.rrect(-4, -3, 30, 6, 3, o.color);
  d.line([0, -1, 22, -1], tint(o.color, 0.3), 1.3);
  d.circle(28, 0, 4.5, o.tip);
  d.glow(28, 0, 9, o.tip, 0.5);
}

export function bow(
  d: Draw,
  o: {
    color: number;
    len?: number;
    string?: number;
    tips?: number;
    twin?: boolean;
    glow?: number;
    recurve?: boolean;
  },
): void {
  // aim item: grip at (0,0), bow arc on the +x side, string behind, arrow nocked along +x
  const L = o.len ?? 34;
  if (o.glow) d.glow(8, 0, L * 0.8, o.glow, 0.35);
  const limb = (dy: number, scale = 1) => {
    const curve = o.recurve ? 6 : 0;
    d.shape(
      (p) =>
        p
          .moveTo(0, dy - 4)
          .quadraticCurveTo(14 * scale, dy - L * 0.55 * scale, 2 - curve, dy - L * scale)
          .lineTo(-1 - curve, dy - L * scale + 3)
          .quadraticCurveTo(9 * scale, dy - L * 0.55 * scale, -4, dy - 4)
          .closePath(),
      o.color,
    );
    d.shape(
      (p) =>
        p
          .moveTo(0, dy + 4)
          .quadraticCurveTo(14 * scale, dy + L * 0.55 * scale, 2 - curve, dy + L * scale)
          .lineTo(-1 - curve, dy + L * scale - 3)
          .quadraticCurveTo(9 * scale, dy + L * 0.55 * scale, -4, dy + 4)
          .closePath(),
      shade(o.color, 0.12),
    );
    d.line([1 - curve, dy - L * scale + 1, -10, dy, 1 - curve, dy + L * scale - 1], o.string ?? C.white, 1.4);
    if (o.tips) {
      d.circle(1 - curve, dy - L * scale + 1, 3, o.tips, { lw: 1.5 });
      d.circle(1 - curve, dy + L * scale - 1, 3, o.tips, { lw: 1.5 });
    }
  };
  if (o.twin) {
    limb(-7, 0.8);
    limb(7, 0.8);
  } else limb(0);
  // grip wrap
  d.rrect(-4, -6, 7, 12, 2, C.leatherDark, { lw: 2 });
  // nocked arrow
  d.line([-10, 0, 26, 0], C.wood, 2.2);
  d.poly([26, -3.5, 33, 0, 26, 3.5], C.steel, { lw: 1.5 });
}

export function cannon(
  d: Draw,
  o: {
    len: number;
    bore: number;
    color: number;
    bands: number;
    runes?: number;
    mortar?: boolean;
    thunder?: boolean;
  },
): void {
  // aim item: points +x. Stock below the grip.
  const L = o.len;
  const R = o.bore;
  d.rrect(-12, -5, 14, 14, 4, C.wood);
  if (o.mortar) {
    d.shape(
      (p) =>
        p
          .moveTo(-6, -R)
          .lineTo(L - 6, -R - 5)
          .lineTo(L, -R - 6)
          .lineTo(L, R + 6)
          .lineTo(L - 6, R + 5)
          .lineTo(-6, R)
          .closePath(),
      o.color,
    );
  } else {
    d.shape(
      (p) =>
        p
          .moveTo(-8, -R + 1)
          .lineTo(L - 6, -R)
          .lineTo(L, -R - 3)
          .lineTo(L, R + 3)
          .lineTo(L - 6, R)
          .lineTo(-8, R - 1)
          .closePath(),
      o.color,
    );
  }
  d.p
    .poly([-6, -R + 2, L - 6, -R + 1, L - 6, -R * 0.2, -6, -R * 0.2], true)
    .fill({ color: tint(o.color, 0.3) });
  for (let i = 0; i < o.bands; i++) {
    const x = 2 + (i * (L - 12)) / Math.max(1, o.bands - 1);
    d.rrect(x - 2, -R - 2, 4, R * 2 + 4, 1.5, C.bronze, { lw: 1.5 });
  }
  d.ellipse(L, 0, 3, R + 3, shade(o.color, 0.4));
  d.ellipse(L + 0.5, 0, 1.5, R - 1, 0x110c0a, { lw: 0 });
  if (o.runes) {
    for (let i = 0; i < 3; i++) d.p.circle(8 + i * ((L - 16) / 2), 0, 2.2).fill({ color: o.runes });
    d.glow(L * 0.5, 0, R * 2.4, o.runes, 0.3);
  }
  if (o.thunder) {
    d.p
      .moveTo(6, -R - 6)
      .lineTo(12, -R - 13)
      .lineTo(10, -R - 8)
      .lineTo(17, -R - 15)
      .stroke({ width: 2.5, color: C.radiant, cap: 'round' });
  }
}

/** Off-hand trinkets (held): origin at the grip, item above it. */
export function orb(d: Draw, color: number, r = 9, sun = false): void {
  d.glow(0, -r - 2, r * 2.2, color, 0.45);
  if (sun) d.star(0, -r - 2, r + 6, C.gold, undefined, 10, 0.6);
  d.circle(0, -r - 2, r, color);
  d.circle(0, -r - 2, r * 0.55, tint(color, 0.5), { lw: 0 });
  d.hi(-r * 0.35, -r * 1.35, r * 0.3, r * 0.22, 0xffffff, 0.7);
}

export function crystal(d: Draw, color: number, size = 12, cluster = false): void {
  d.glow(0, -size, size * 1.8, color, 0.4);
  if (cluster) {
    d.poly([-8, -2, -12, -size * 1.1, -4, -4], shade(color, 0.1), { lw: 2 });
    d.poly([8, -2, 12, -size * 1.2, 4, -4], shade(color, 0.1), { lw: 2 });
  }
  d.poly([0, -size * 2, size * 0.55, -size, 0, 0, -size * 0.55, -size], color);
  d.p.poly([0, -size * 2, -size * 0.55, -size, 0, -size * 0.5], true).fill({ color: tint(color, 0.55) });
}

export function heartOfWinter(d: Draw): void {
  d.glow(0, -14, 26, C.frost, 0.5);
  d.shape(
    (p) =>
      p
        .moveTo(0, 0)
        .quadraticCurveTo(-18, -12, -10, -22)
        .quadraticCurveTo(-4, -26, 0, -18)
        .quadraticCurveTo(4, -26, 10, -22)
        .quadraticCurveTo(18, -12, 0, 0)
        .closePath(),
    C.ice,
  );
  d.p.moveTo(-4, -18).lineTo(0, -10).lineTo(5, -19).stroke({ width: 1.5, color: C.frost });
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + (i - 1.5) * 0.6;
    d.poly(
      [
        Math.cos(a) * 14,
        -12 + Math.sin(a) * 14,
        Math.cos(a) * 22,
        -12 + Math.sin(a) * 22,
        Math.cos(a + 0.12) * 14,
        -12 + Math.sin(a + 0.12) * 14,
      ],
      C.frost,
      { lw: 1.5 },
    );
  }
}

export function arrowHeld(
  d: Draw,
  head: number,
  shaft: number,
  fletch: number,
  opts: { glow?: number; barbed?: boolean; heart?: boolean; star?: boolean } = {},
): void {
  if (opts.glow) d.glow(0, -30, 14, opts.glow, 0.5);
  d.line([0, 8, 0, -26], OUTLINE, 5);
  d.line([0, 8, 0, -26], shaft, 2.6);
  d.poly([-3, 10, 0, 4, 3, 10, 3, 15, 0, 11, -3, 15], fletch, { lw: 1.5 });
  if (opts.heart) {
    d.shape(
      (p) =>
        p
          .moveTo(0, -24)
          .quadraticCurveTo(-10, -32, -6, -38)
          .quadraticCurveTo(-2, -41, 0, -36)
          .quadraticCurveTo(2, -41, 6, -38)
          .quadraticCurveTo(10, -32, 0, -24)
          .closePath(),
      head,
    );
  } else if (opts.star) {
    d.star(0, -32, 9, head);
  } else {
    d.poly([-5, -24, 0, -38, 5, -24], head, { lw: 2 });
    if (opts.barbed) {
      d.poly([-5, -24, -8, -20, -3, -24], head, { lw: 1.5 });
      d.poly([5, -24, 8, -20, 3, -24], head, { lw: 1.5 });
    }
  }
}

export function holySymbol(d: Draw, color: number): void {
  d.glow(0, -14, 16, C.radiant, 0.4);
  d.line([0, 2, 0, -6], C.gold, 2);
  d.circle(0, -14, 9, color);
  d.star(0, -14, 7, C.radiant, { lw: 1.4 }, 8, 0.5);
}

export function reliquary(d: Draw): void {
  d.glow(0, -14, 20, C.radiant, 0.35);
  d.rrect(-10, -24, 20, 18, 3, C.gold);
  d.shape((p) => p.moveTo(-12, -24).lineTo(0, -34).lineTo(12, -24).closePath(), C.goldDark);
  d.rrect(-6, -20, 12, 10, 2, 0x8fd3ff, { lw: 1.5 });
  d.line([0, -36, 0, -42], C.gold, 2);
  d.line([-3, -39, 3, -39], C.gold, 2);
  d.line([0, -6, 0, 2], C.gold, 2.5);
}

export function grail(d: Draw): void {
  d.glow(0, -18, 26, C.radiant, 0.6);
  d.shape(
    (p) =>
      p.moveTo(-12, -30).quadraticCurveTo(-12, -14, 0, -12).quadraticCurveTo(12, -14, 12, -30).closePath(),
    C.gold,
  );
  d.ellipse(0, -30, 12, 3.5, C.radiant, { lw: 2 });
  d.rrect(-2, -13, 4, 9, 1, C.goldDark, { lw: 2 });
  d.ellipse(0, -3, 8, 3, C.gold, { lw: 2 });
  d.gem(0, -22, 3.5, C.crimson);
}

export function pouch(d: Draw, color: number, opts: { grenades?: number; spikes?: boolean } = {}): void {
  d.shape(
    (p) =>
      p
        .moveTo(-10, -4)
        .quadraticCurveTo(-12, -20, 0, -22)
        .quadraticCurveTo(12, -20, 10, -4)
        .quadraticCurveTo(0, 2, -10, -4)
        .closePath(),
    color,
  );
  d.line([-7, -18, 7, -18], shade(color, 0.35), 2);
  for (let i = 0; i < (opts.grenades ?? 0); i++)
    d.circle(-6 + i * 6, -24 - (i % 2) * 3, 4, C.darkIron, { lw: 1.8 });
  if (opts.spikes)
    for (let i = 0; i < 4; i++)
      d.poly([-6 + i * 4, -22, -4 + i * 4, -28, -2 + i * 4, -22], C.steel, { lw: 1.2 });
}

export function grenade(d: Draw, color: number, n: number, glow?: number): void {
  if (glow) d.glow(0, -12, 18, glow, 0.4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = n > 1 ? Math.cos(a) * 6 : 0;
    const y = -12 + (n > 1 ? Math.sin(a) * 5 : 0);
    d.circle(x, y, 6, color, { lw: 2 });
    d.hi(x - 2, y - 2, 1.8, 1.4);
    d.line([x + 3, y - 5, x + 6, y - 9], C.wood, 1.5);
    d.circle(x + 6, y - 9, 1.6, C.fire, { lw: 0 });
  }
}
