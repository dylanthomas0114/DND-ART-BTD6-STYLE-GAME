import { type Draw, shade, tint } from '../pen';
import { C } from '../palette';

/** Shields (origin = grip, shield faces the viewer). */
export function shield(
  d: Draw,
  o: {
    shape: 'round' | 'kite' | 'tower' | 'heater' | 'aegis';
    size: number;
    face: number;
    rim: number;
    emblem?: 'boss' | 'cross' | 'lion' | 'sun' | 'chevron';
    emblemColor?: number;
    glow?: number;
  },
): void {
  const s = o.size;
  if (o.glow) d.glow(0, 0, s * 1.4, o.glow, 0.4);
  const outer = (p: Draw['p'], k: number) => {
    switch (o.shape) {
      case 'round':
        p.circle(0, 0, s * k);
        break;
      case 'kite':
        p.moveTo(-s * 0.8 * k, -s * 0.9 * k)
          .quadraticCurveTo(0, -s * 1.15 * k, s * 0.8 * k, -s * 0.9 * k)
          .quadraticCurveTo(s * 0.85 * k, 0, 0, s * 1.35 * k)
          .quadraticCurveTo(-s * 0.85 * k, 0, -s * 0.8 * k, -s * 0.9 * k)
          .closePath();
        break;
      case 'heater':
        p.moveTo(-s * 0.85 * k, -s * 0.85 * k)
          .lineTo(s * 0.85 * k, -s * 0.85 * k)
          .quadraticCurveTo(s * 0.9 * k, s * 0.5 * k, 0, s * 1.1 * k)
          .quadraticCurveTo(-s * 0.9 * k, s * 0.5 * k, -s * 0.85 * k, -s * 0.85 * k)
          .closePath();
        break;
      case 'tower':
        p.roundRect(-s * 0.75 * k, -s * 1.15 * k, s * 1.5 * k, s * 2.3 * k, 6 * k);
        break;
      case 'aegis':
        p.moveTo(0, -s * 1.25 * k)
          .lineTo(s * 0.95 * k, -s * 0.75 * k)
          .quadraticCurveTo(s * 1.0 * k, s * 0.55 * k, 0, s * 1.3 * k)
          .quadraticCurveTo(-s * 1.0 * k, s * 0.55 * k, -s * 0.95 * k, -s * 0.75 * k)
          .closePath();
        break;
    }
  };
  d.shape((p) => outer(p, 1), o.rim);
  d.shape((p) => outer(p, 0.82), o.face, { lw: 2 });
  // shading: darker lower-right
  d.p.ellipse(s * 0.3, s * 0.35, s * 0.45, s * 0.5).fill({ color: shade(o.face, 0.25), alpha: 0.45 });
  d.hi(-s * 0.35, -s * 0.45, s * 0.25, s * 0.15, 0xffffff, 0.45);
  const ec = o.emblemColor ?? C.gold;
  switch (o.emblem) {
    case 'boss':
      d.circle(0, 0, s * 0.3, ec);
      d.hi(-s * 0.08, -s * 0.1, s * 0.1, s * 0.07);
      break;
    case 'cross':
      d.rrect(-s * 0.1, -s * 0.6, s * 0.2, s * 1.2, 2, ec, { lw: 2 });
      d.rrect(-s * 0.45, -s * 0.15, s * 0.9, s * 0.25, 2, ec, { lw: 2 });
      break;
    case 'chevron':
      d.poly(
        [
          -s * 0.6,
          -s * 0.1,
          0,
          -s * 0.55,
          s * 0.6,
          -s * 0.1,
          s * 0.6,
          s * 0.2,
          0,
          -s * 0.25,
          -s * 0.6,
          s * 0.2,
        ],
        ec,
        { lw: 2 },
      );
      break;
    case 'lion': {
      // lion head: mane star + face
      d.star(0, -s * 0.05, s * 0.55, C.goldDark, { lw: 2 }, 12, 0.72);
      d.circle(0, -s * 0.05, s * 0.32, ec, { lw: 2 });
      d.dots([-s * 0.12, -s * 0.1, s * 0.12, -s * 0.1], 1.8, 0x1d1410);
      d.poly([-s * 0.08, s * 0.08, s * 0.08, s * 0.08, 0, s * 0.16], 0x1d1410, { lw: 0 });
      break;
    }
    case 'sun':
      d.star(0, 0, s * 0.6, ec, { lw: 2 }, 12, 0.55);
      d.circle(0, 0, s * 0.25, C.radiant, { lw: 2 });
      break;
  }
  // rivets on rim
  if (o.shape !== 'round') d.dots([-s * 0.6, -s * 0.75, s * 0.6, -s * 0.75], 1.8, tint(o.rim, 0.5));
}

/** Headwear: origin at head centre, head radius ≈ 21. Eyes are around y ∈ [−6, 7]. */
export function helm(
  d: Draw,
  o: { kind: 'steel' | 'horned' | 'crown' | 'tinker'; color: number; trim?: number; plume?: number },
): void {
  const r = 22;
  const col = o.color;
  // dome
  d.shape(
    (p) =>
      p
        .moveTo(-r - 2, -2)
        .quadraticCurveTo(-r - 2, -r - 6, 0, -r - 7)
        .quadraticCurveTo(r + 2, -r - 6, r + 2, -2)
        .lineTo(r + 2, 4)
        .lineTo(r - 4, 4)
        .lineTo(r - 4, -6)
        .lineTo(-r + 4, -6)
        .lineTo(-r + 4, 8)
        .lineTo(-r - 2, 8)
        .closePath(),
    col,
  );
  d.p
    .moveTo(r - 2, -6)
    .quadraticCurveTo(r + 1, -r, 4, -r - 5)
    .quadraticCurveTo(r - 6, -r + 2, r - 6, -6)
    .closePath()
    .fill({ color: shade(col, 0.25) });
  d.hi(-8, -r - 1, 7, 3, 0xffffff, 0.55);
  // brow band
  d.rrect(-r - 2, -10, 2 * r + 4, 6, 2, o.trim ?? shade(col, 0.15), { lw: 2 });
  // nasal guard
  if (o.kind !== 'tinker') d.rrect(2, -8, 5, 12, 2, o.trim ?? col, { lw: 2 });
  if (o.kind === 'horned') {
    d.shape(
      (p) =>
        p
          .moveTo(-r, -12)
          .quadraticCurveTo(-r - 18, -16, -r - 14, -r - 14)
          .quadraticCurveTo(-r - 8, -20, -r + 4, -18)
          .closePath(),
      C.bone,
    );
    d.shape(
      (p) =>
        p
          .moveTo(r, -12)
          .quadraticCurveTo(r + 18, -16, r + 14, -r - 14)
          .quadraticCurveTo(r + 8, -20, r - 4, -18)
          .closePath(),
      C.bone,
    );
  }
  if (o.kind === 'crown') {
    // crown circlet atop the helm
    d.poly([-16, -r - 2, -16, -r - 14, -9, -r - 7, -2, -r - 18, 5, -r - 7, 12, -r - 14, 14, -r - 2], C.gold);
    d.gem(-2, -r - 6, 3.5, C.crimson);
    d.dots([-16, -r - 14, 12, -r - 14, -2, -r - 18], 2.2, C.radiant);
  }
  if (o.kind === 'tinker') {
    d.circle(-r + 2, -14, 6, C.bronze, { lw: 2 });
    d.circle(-r + 2, -14, 2.5, C.darkIron, { lw: 0 });
    d.circle(r - 2, -14, 6, C.bronze, { lw: 2 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      d.p.circle(Math.cos(a) * 9, -r - 6 + Math.sin(a) * 9, 2.2).fill({ color: C.bronze });
    }
    d.circle(0, -r - 6, 7, C.bronze, { lw: 2 });
    d.circle(0, -r - 6, 2.5, C.darkIron, { lw: 0 });
  }
  if (o.plume) {
    d.shape(
      (p) =>
        p
          .moveTo(-2, -r - 6)
          .quadraticCurveTo(-24, -r - 22, -30, -r + 2)
          .quadraticCurveTo(-18, -r - 10, -2, -r - 2)
          .closePath(),
      o.plume,
    );
  }
}

export function hood(
  d: Draw,
  color: number,
  o: { feather?: number; trim?: number; deep?: boolean; eye?: number } = {},
): void {
  const r = 23;
  d.shape(
    (p) =>
      p
        .moveTo(-r - 4, 14)
        .quadraticCurveTo(-r - 6, -r - 2, -4, -r - 8)
        .quadraticCurveTo(r + 2, -r - 6, r + 4, 2)
        .quadraticCurveTo(r + 2, 12, r - 2, 16)
        .lineTo(r - 6, 4)
        .quadraticCurveTo(r - 4, -r + 6, 0, -r + 5)
        .quadraticCurveTo(-r + 4, -r + 8, -r + 4, 16)
        .closePath(),
    color,
  );
  d.hi(-10, -r - 2, 7, 3, 0xffffff, 0.25);
  if (o.trim)
    d.p
      .moveTo(-r + 4, 14)
      .quadraticCurveTo(-r + 4, -r + 8, 0, -r + 5)
      .quadraticCurveTo(r - 4, -r + 6, r - 6, 4)
      .stroke({ width: 2.5, color: o.trim });
  if (o.deep)
    d.p
      .moveTo(-r + 5, -4)
      .quadraticCurveTo(0, -18, r - 6, -4)
      .lineTo(r - 6, -8)
      .quadraticCurveTo(0, -24, -r + 5, -8)
      .closePath()
      .fill({ color: shade(color, 0.5), alpha: 0.8 });
  if (o.feather)
    d.shape(
      (p) =>
        p
          .moveTo(r - 2, -6)
          .quadraticCurveTo(r + 18, -20, r + 10, -r - 12)
          .quadraticCurveTo(r + 4, -16, r - 4, -10)
          .closePath(),
      o.feather,
    );
  if (o.eye) {
    // spyglass monocle / hawk eye
    d.circle(9, 1, 8, o.eye, { lw: 2.5 });
    d.p.circle(9, 1, 6).fill({ color: 0xbfe8ff, alpha: 0.5 });
  }
}

export function hat(
  d: Draw,
  color: number,
  o: { band?: number; stars?: number; tall?: number; storm?: boolean } = {},
): void {
  const h = o.tall ?? 46;
  // brim
  d.ellipse(0, -12, 34, 8, color);
  d.p.ellipse(0, -10, 30, 5).fill({ color: shade(color, 0.35) });
  // cone with a bent tip
  d.shape(
    (p) =>
      p
        .moveTo(-20, -14)
        .quadraticCurveTo(-10, -h * 0.6, 6, -h)
        .quadraticCurveTo(16, -h - 4, 22, -h + 6)
        .quadraticCurveTo(12, -h + 2, 8, -h * 0.7)
        .quadraticCurveTo(14, -30, 20, -14)
        .closePath(),
    color,
  );
  d.p
    .moveTo(6, -h * 0.75)
    .quadraticCurveTo(12, -32, 18, -15)
    .lineTo(10, -15)
    .quadraticCurveTo(8, -30, 6, -h * 0.75)
    .fill({ color: shade(color, 0.25) });
  if (o.band)
    d.shape(
      (p) =>
        p
          .moveTo(-19, -16)
          .quadraticCurveTo(0, -12, 19, -16)
          .lineTo(17, -22)
          .quadraticCurveTo(0, -18, -17, -22)
          .closePath(),
      o.band,
      { lw: 2 },
    );
  if (o.stars) {
    d.star(-6, -30, 4, o.stars, { lw: 1.2 });
    d.star(6, -40, 3, o.stars, { lw: 1.2 });
  }
  if (o.storm) {
    d.p
      .moveTo(-4, -26)
      .lineTo(2, -34)
      .lineTo(-1, -34)
      .lineTo(4, -42)
      .stroke({ width: 2.5, color: C.radiant, cap: 'round', join: 'round' });
  }
}

export function crown(
  d: Draw,
  o: {
    color: number;
    gems?: number;
    spikes?: number;
    kind?: 'circlet' | 'antler' | 'icicle' | 'storm' | 'tempest';
  },
): void {
  const k = o.kind ?? 'circlet';
  if (k === 'antler') {
    for (const sx of [-1, 1]) {
      d.bar([sx * 10, -16, sx * 18, -34, sx * 28, -42], o.color, 4);
      d.bar([sx * 16, -30, sx * 28, -30], o.color, 3);
      d.bar([sx * 20, -38, sx * 16, -48], o.color, 3);
    }
    d.rrect(-19, -20, 38, 7, 3, shade(o.color, 0.2), { lw: 2 });
    d.circle(0, -17, 3.5, C.frost, { lw: 1.5 });
    return;
  }
  if (k === 'icicle') {
    d.rrect(-20, -20, 40, 7, 3, C.ice, { lw: 2 });
    for (let i = -3; i <= 3; i++)
      d.poly([i * 6 - 3, -19, i * 6 + 3, -19, i * 6, -32 - (3 - Math.abs(i)) * 5], C.frost, { lw: 1.6 });
    d.glow(0, -28, 22, C.frost, 0.3);
    return;
  }
  if (k === 'storm' || k === 'tempest') {
    if (k === 'tempest') d.glow(0, -28, 30, C.arcane, 0.4);
    d.rrect(-20, -21, 40, 7, 3, C.darkIron, { lw: 2 });
    const n = k === 'tempest' ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const x = -14 + (i * 28) / (n - 1);
      d.p
        .moveTo(x, -21)
        .lineTo(x + 4, -30)
        .lineTo(x, -30)
        .lineTo(x + 5, -40)
        .stroke({ width: 3.5, color: 0x1d1410, cap: 'round', join: 'round' });
      d.p
        .moveTo(x, -21)
        .lineTo(x + 4, -30)
        .lineTo(x, -30)
        .lineTo(x + 5, -40)
        .stroke({ width: 2, color: C.radiant, cap: 'round', join: 'round' });
    }
    d.gem(0, -18, 4, C.arcane);
    return;
  }
  const spikes = o.spikes ?? 3;
  const pts: number[] = [-20, -16];
  for (let i = 0; i <= spikes * 2; i++) pts.push(-20 + (i * 40) / (spikes * 2), i % 2 === 0 ? -30 : -21);
  pts.push(20, -16);
  d.poly(pts, o.color);
  if (o.gems) d.gem(0, -21, 3.5, o.gems);
}

export function halo(d: Draw, o: { radiant?: boolean }): void {
  d.glow(0, -30, o.radiant ? 30 : 20, C.radiant, o.radiant ? 0.55 : 0.4);
  d.p.ellipse(0, -30, o.radiant ? 22 : 18, o.radiant ? 7 : 5.5).stroke({ width: 7, color: 0x1d1410 });
  d.p.ellipse(0, -30, o.radiant ? 22 : 18, o.radiant ? 7 : 5.5).stroke({ width: 4, color: C.gold });
  if (o.radiant) {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      d.line(
        [Math.cos(a) * 25, -30 + Math.sin(a) * 9, Math.cos(a) * 33, -30 + Math.sin(a) * 12],
        C.radiant,
        2.5,
      );
    }
  }
}

export function mask(d: Draw, o: { kind: 'domino' | 'deadeye' | 'grandmaster'; color: number }): void {
  if (o.kind === 'domino') {
    d.shape(
      (p) =>
        p
          .moveTo(-20, -4)
          .quadraticCurveTo(-10, -12, 4, -5)
          .quadraticCurveTo(12, -12, 20, -4)
          .quadraticCurveTo(14, 8, 4, 3)
          .quadraticCurveTo(-8, 10, -20, -4)
          .closePath(),
      o.color,
    );
    d.ellipse(-4, 0, 4, 3.5, 0x1d1410, { lw: 0 });
    d.ellipse(10, 0, 3.6, 3.2, 0x1d1410, { lw: 0 });
    d.circle(-3, 0.5, 1.3, 0xffffff, { lw: 0 });
    d.circle(11, 0.5, 1.2, 0xffffff, { lw: 0 });
    d.line([-20, -2, -26, 2], o.color, 2);
  } else if (o.kind === 'deadeye') {
    // half-mask with a glowing targeting lens
    d.shape(
      (p) =>
        p
          .moveTo(-20, -8)
          .lineTo(20, -8)
          .lineTo(20, 4)
          .quadraticCurveTo(10, 10, 0, 4)
          .quadraticCurveTo(-10, 10, -20, 4)
          .closePath(),
      o.color,
    );
    d.circle(10, -1, 7, C.crimson, { lw: 2.5 });
    d.glow(10, -1, 12, C.ember, 0.5);
    d.circle(10, -1, 2.5, C.radiant, { lw: 0 });
    d.circle(-4, -1, 3.5, 0x1d1410, { lw: 0 });
  } else {
    // grandmaster: full porcelain mask with crimson tears and a crown of blades
    d.shape(
      (p) =>
        p
          .moveTo(-19, -14)
          .quadraticCurveTo(0, -22, 19, -14)
          .quadraticCurveTo(22, 10, 0, 20)
          .quadraticCurveTo(-22, 10, -19, -14)
          .closePath(),
      o.color,
    );
    d.ellipse(-5, 0, 4, 3, 0x1d1410, { lw: 0 });
    d.ellipse(10, 0, 3.6, 2.8, 0x1d1410, { lw: 0 });
    d.line([-5, 4, -6, 12], C.crimson, 2);
    d.line([10, 4, 11, 12], C.crimson, 2);
    for (let i = -2; i <= 2; i++)
      d.poly([i * 7 - 2, -18, i * 7 + 2, -18, i * 7, -32 + Math.abs(i) * 4], C.steel, { lw: 1.6 });
  }
}

export function goggles(d: Draw): void {
  d.rrect(-24, -16, 48, 5, 2, C.leatherDark, { lw: 2 });
  for (const x of [-7, 9]) {
    d.circle(x, -13, 8, C.bronze);
    d.circle(x, -13, 5.5, 0x8fd3ff, { lw: 1.5 });
    d.hi(x - 2, -15, 2, 1.5, 0xffffff, 0.8);
  }
}

/**
 * Torso overlays. Origin at torso centre; torso spans x ±16 (stout ±21), y ≈ −18 … +18. Shoulders
 * at y ≈ −9.
 */
export function armor(
  d: Draw,
  o: {
    kind:
      | 'chain'
      | 'plate'
      | 'gilded'
      | 'aegis'
      | 'robe'
      | 'apron'
      | 'vestments'
      | 'mantle'
      | 'cloak'
      | 'bark'
      | 'spirit'
      | 'beastlord'
      | 'leather';
    color: number;
    trim?: number;
    wide?: boolean;
    glow?: number;
  },
): void {
  const w = o.wide ? 22 : 17;
  const col = o.color;
  if (o.glow) d.glow(0, 0, 30, o.glow, 0.3);
  const torso = (p: Draw['p'], k = 1) =>
    p
      .moveTo(-w * k, -12)
      .quadraticCurveTo(0, -16, w * k, -12)
      .lineTo(w * k + 1, 16)
      .quadraticCurveTo(0, 20, -w * k - 1, 16)
      .closePath();
  switch (o.kind) {
    case 'chain': {
      d.shape((p) => torso(p), col);
      for (let y = -9; y < 16; y += 4) {
        for (let x = -w + 3; x < w - 1; x += 4)
          d.p
            .arc(x + ((y / 4) % 2 ? 2 : 0), y, 1.8, 0, Math.PI)
            .stroke({ width: 1, color: shade(col, 0.35) });
      }
      d.rrect(-w - 1, 12, 2 * w + 2, 6, 2, o.trim ?? C.leather, { lw: 2 });
      break;
    }
    case 'plate':
    case 'gilded':
    case 'aegis': {
      d.shape((p) => torso(p), col);
      d.p
        .moveTo(2, -12)
        .lineTo(w, -12)
        .lineTo(w + 1, 16)
        .lineTo(4, 18)
        .closePath()
        .fill({ color: shade(col, 0.22) });
      d.hi(-w + 6, -4, 3.5, 8, 0xffffff, 0.45);
      d.line([0, -12, 0, 16], shade(col, 0.4), 1.5);
      // pauldrons
      d.ellipse(-w - 2, -11, 9, 7, col);
      d.ellipse(w + 2, -11, 9, 7, shade(col, 0.15));
      d.hi(-w - 4, -13, 3.5, 2);
      if (o.trim) {
        d.p.moveTo(-w, -12).quadraticCurveTo(0, -16, w, -12).stroke({ width: 3, color: o.trim });
        d.rrect(-w - 1, 11, 2 * w + 2, 5, 2, o.trim, { lw: 2 });
      }
      if (o.kind === 'gilded') d.star(0, 1, 6, C.gold, { lw: 1.5 });
      if (o.kind === 'aegis') {
        d.glow(0, 0, 18, C.radiant, 0.35);
        d.star(0, 0, 8, C.radiant, { lw: 1.5 }, 8, 0.5);
      }
      break;
    }
    case 'robe':
    case 'vestments': {
      d.shape((p) => torso(p, 1.05), col);
      d.rrect(-4, -12, 8, 30, 2, o.trim ?? C.gold, { lw: 2 });
      if (o.kind === 'vestments') {
        d.shape(
          (p) =>
            p
              .moveTo(-w, -12)
              .lineTo(-6, -12)
              .lineTo(-8, 18)
              .lineTo(-w - 1, 16)
              .closePath(),
          o.trim ?? C.gold,
          { lw: 2 },
        );
        d.shape(
          (p) =>
            p
              .moveTo(w, -12)
              .lineTo(6, -12)
              .lineTo(8, 18)
              .lineTo(w + 1, 16)
              .closePath(),
          o.trim ?? C.gold,
          { lw: 2 },
        );
        d.star(0, 0, 4, C.crimson, { lw: 1.2 });
      } else {
        // storm robe: lightning trim
        d.p
          .moveTo(-w + 2, 12)
          .lineTo(-w + 7, 4)
          .lineTo(-w + 4, 4)
          .lineTo(-w + 9, -6)
          .stroke({ width: 2, color: C.radiant, cap: 'round' });
        d.p
          .moveTo(w - 2, 12)
          .lineTo(w - 7, 4)
          .lineTo(w - 4, 4)
          .lineTo(w - 9, -6)
          .stroke({ width: 2, color: C.radiant, cap: 'round' });
      }
      break;
    }
    case 'apron': {
      d.shape(
        (p) =>
          p
            .moveTo(-w + 3, -12)
            .lineTo(w - 3, -12)
            .lineTo(w + 2, 20)
            .quadraticCurveTo(0, 24, -w - 2, 20)
            .closePath(),
        col,
      );
      d.rrect(-7, 0, 14, 8, 2, shade(col, 0.2), { lw: 2 });
      d.line([-w + 3, -12, -w - 4, -16], o.trim ?? C.leatherDark, 2.5);
      d.line([w - 3, -12, w + 4, -16], o.trim ?? C.leatherDark, 2.5);
      if (o.trim) d.dots([-w + 1, -8, w - 1, -8, -w + 0, 8, w, 8], 1.6, o.trim);
      break;
    }
    case 'mantle': {
      d.shape(
        (p) =>
          p
            .moveTo(-w - 6, -6)
            .quadraticCurveTo(-w, -18, 0, -16)
            .quadraticCurveTo(w, -18, w + 6, -6)
            .quadraticCurveTo(w + 2, 4, w - 2, 2)
            .quadraticCurveTo(0, 8, -w + 2, 2)
            .quadraticCurveTo(-w - 2, 4, -w - 6, -6)
            .closePath(),
        col,
      );
      for (let i = -3; i <= 3; i++) d.line([i * 5, -12, i * 5 + 1, -4], shade(col, 0.3), 1.5);
      d.circle(0, -10, 3.5, C.bone, { lw: 1.5 });
      break;
    }
    case 'cloak': {
      d.shape(
        (p) =>
          p
            .moveTo(-w - 4, -14)
            .quadraticCurveTo(0, -20, w + 4, -14)
            .lineTo(w + 6, 20)
            .lineTo(w - 4, 18)
            .lineTo(w - 6, -6)
            .lineTo(-w + 6, -6)
            .lineTo(-w + 4, 18)
            .lineTo(-w - 6, 20)
            .closePath(),
        col,
      );
      d.circle(0, -12, 3.5, o.trim ?? C.gold, { lw: 1.5 });
      break;
    }
    case 'bark': {
      d.shape((p) => torso(p), col);
      for (let i = 0; i < 4; i++)
        d.p
          .moveTo(-w + 3 + i * 9, -10)
          .quadraticCurveTo(-w + 6 + i * 9, 2, -w + 2 + i * 9, 14)
          .stroke({ width: 2, color: shade(col, 0.35) });
      d.ellipse(-w, -12, 7, 6, 0x5f8f3a);
      d.ellipse(w, -12, 7, 6, 0x4f7f32);
      d.ellipse(w + 3, -16, 4, 3, 0x7fbf4a, { lw: 1.5 });
      break;
    }
    case 'spirit': {
      d.glow(0, 0, 32, C.frost, 0.45);
      d.shape((p) => torso(p), col, { alpha: 0.85 });
      d.star(0, 0, 9, C.ice, { lw: 1.5 }, 6, 0.4);
      d.ellipse(-w - 2, -11, 9, 7, C.ice);
      d.ellipse(w + 2, -11, 9, 7, C.frost);
      break;
    }
    case 'beastlord': {
      d.shape((p) => torso(p), col);
      // fur collar and claw trophies
      d.shape(
        (p) =>
          p
            .moveTo(-w - 7, -8)
            .quadraticCurveTo(0, -24, w + 7, -8)
            .quadraticCurveTo(0, -4, -w - 7, -8)
            .closePath(),
        0x8a6a4a,
      );
      for (let i = -2; i <= 2; i++) d.poly([i * 6 - 2, -2, i * 6 + 2, -2, i * 6, 6], C.bone, { lw: 1.4 });
      d.rrect(-w - 1, 11, 2 * w + 2, 6, 2, C.leatherDark, { lw: 2 });
      break;
    }
    case 'leather': {
      d.shape((p) => torso(p), col);
      d.dots([-6, -6, 6, -6, -6, 4, 6, 4], 1.6, C.bronze);
      break;
    }
  }
}
