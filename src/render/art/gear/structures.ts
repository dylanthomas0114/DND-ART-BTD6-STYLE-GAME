import { type Draw, shade, tint } from '../pen';
import { C } from '../palette';

// ---------------------------------------------------------------------------------- Ballista
/** Bolt loaded in the ballista (aim item, points +x, origin at the prod centre). */
export function bolt(
  d: Draw,
  o: { shaft: number; head: number; fletch: number; len?: number; glow?: number; barbs?: boolean },
): void {
  const L = o.len ?? 46;
  if (o.glow) d.glow(L - 10, 0, 18, o.glow, 0.5);
  d.bar([-14, 0, L - 8, 0], o.shaft, 3.5);
  d.poly([-16, -5, -8, 0, -16, 5, -12, 0], o.fletch, { lw: 1.5 });
  d.poly([L - 10, -6, L + 6, 0, L - 10, 6, L - 7, 0], o.head);
  if (o.barbs) {
    d.poly([L - 10, -6, L - 14, -9, L - 8, -3], o.head, { lw: 1.4 });
    d.poly([L - 10, 6, L - 14, 9, L - 8, 3], o.head, { lw: 1.4 });
  }
  d.hi(L - 4, -2, 3, 1.4);
}

/** Overlay plating on the ballista frame (origin = frame centre). */
export function frame(d: Draw, o: { color: number; studs?: number; spikes?: boolean; rune?: number }): void {
  d.rrect(-24, -8, 48, 12, 3, o.color);
  d.rrect(-6, -16, 12, 26, 3, shade(o.color, 0.1));
  if (o.studs) d.dots([-18, -2, -10, -2, 10, -2, 18, -2], 2, o.studs);
  if (o.spikes)
    for (const x of [-26, 26]) d.poly([x, -6, x + Math.sign(x) * 10, -2, x, 2], C.steel, { lw: 1.6 });
  if (o.rune) {
    d.glow(0, -2, 20, o.rune, 0.45);
    d.circle(0, -3, 4.5, o.rune, { lw: 1.6 });
  }
}

/** Crew member (small dwarf) standing beside the ballista. */
export function crewman(
  d: Draw,
  o: { tunic: number; hat: 'cap' | 'helm' | 'plumed'; beard: number; tool?: 'crank' | 'bolt' | 'spyglass' },
): void {
  d.p.ellipse(0, 0, 12, 4).fill({ color: 0x000000, alpha: 0.25 });
  d.rrect(-7, -10, 6, 10, 2, 0x4a3b2a, { lw: 1.8 });
  d.rrect(1, -10, 6, 10, 2, 0x3a2b1a, { lw: 1.8 });
  d.rrect(-10, -26, 20, 18, 5, o.tunic);
  d.circle(0, -34, 9, C.skin);
  d.shape(
    (p) => p.moveTo(-8, -32).quadraticCurveTo(0, -16, 8, -32).quadraticCurveTo(0, -27, -8, -32).closePath(),
    o.beard,
  );
  d.dots([-3, -36, 3, -36], 1.4, 0x1d1410);
  if (o.hat === 'cap')
    d.shape(
      (p) => p.moveTo(-9, -38).quadraticCurveTo(0, -48, 9, -38).lineTo(12, -37).lineTo(-9, -37).closePath(),
      C.leather,
    );
  else if (o.hat === 'helm') {
    d.shape((p) => p.moveTo(-10, -37).quadraticCurveTo(0, -50, 10, -37).closePath(), C.steel);
    d.rrect(-11, -39, 22, 3, 1, C.steelDark, { lw: 1.4 });
  } else {
    d.shape((p) => p.moveTo(-10, -37).quadraticCurveTo(0, -50, 10, -37).closePath(), C.gold);
    d.shape(
      (p) =>
        p.moveTo(0, -47).quadraticCurveTo(-14, -60, -18, -44).quadraticCurveTo(-8, -50, 0, -44).closePath(),
      C.red,
      { lw: 1.6 },
    );
  }
  if (o.tool === 'crank') d.bar([8, -20, 16, -26, 20, -22], C.darkIron, 2.5);
  if (o.tool === 'bolt') d.bar([-14, -30, 12, -18], C.wood, 2.5);
  if (o.tool === 'spyglass') d.rrect(6, -38, 14, 5, 2, C.bronze, { lw: 1.5 });
}

export function boltRack(d: Draw, o: { gatling?: boolean }): void {
  if (o.gatling) {
    d.circle(0, -18, 16, C.darkIron);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      d.circle(Math.cos(a) * 10, -18 + Math.sin(a) * 10, 3.6, C.wood, { lw: 1.4 });
      d.p.circle(Math.cos(a) * 10, -18 + Math.sin(a) * 10, 1.4).fill({ color: C.steel });
    }
    d.circle(0, -18, 4, C.bronze, { lw: 1.5 });
    d.rrect(-3, -4, 6, 6, 1, C.darkIron, { lw: 1.6 });
    return;
  }
  d.rrect(-12, -26, 24, 26, 2, C.wood);
  for (let i = 0; i < 4; i++) {
    d.line([-9 + i * 6, -30, -9 + i * 6, -2], C.woodDark, 2.2);
    d.poly([-11 + i * 6, -30, -9 + i * 6, -36, -7 + i * 6, -30], C.steel, { lw: 1 });
  }
}

export function flag(
  d: Draw,
  o: { color: number; trim: number; tall?: number; fortress?: boolean; signal?: boolean },
): void {
  const h = o.tall ?? 70;
  d.bar([0, 0, 0, -h], C.woodDark, 2.5);
  if (o.signal) {
    // semaphore flags
    d.bar([0, -h + 10, -16, -h - 6], C.woodDark, 2);
    d.rect(-24, -h - 14, 10, 10, o.color, { lw: 2 });
    d.bar([0, -h + 10, 16, -h - 4], C.woodDark, 2);
    d.rect(14, -h - 12, 10, 10, o.trim, { lw: 2 });
    return;
  }
  d.shape(
    (p) =>
      p
        .moveTo(0, -h)
        .quadraticCurveTo(14, -h - 4, 26, -h + 2)
        .quadraticCurveTo(18, -h + 9, 26, -h + 16)
        .quadraticCurveTo(12, -h + 12, 0, -h + 18)
        .closePath(),
    o.color,
  );
  if (o.fortress) {
    d.p
      .moveTo(4, -h + 2)
      .lineTo(4, -h + 15)
      .stroke({ width: 3, color: o.trim });
    d.circle(0, -h - 3, 3, C.gold, { lw: 1.4 });
  } else
    d.p
      .moveTo(3, -h + 4)
      .lineTo(20, -h + 4)
      .stroke({ width: 2, color: o.trim });
}

// ---------------------------------------------------------------------------------- Treasury
/** Main building ("vault" slot): origin at the bottom centre of the building. */
export function vault(d: Draw, o: { kind: 'wood' | 'iron' | 'gold' | 'hoard' }): void {
  const wall =
    o.kind === 'wood' ? 0xc9a06b : o.kind === 'iron' ? 0x9aa0a8 : o.kind === 'gold' ? 0xe9c46a : 0xd9a441;
  d.rrect(-32, -46, 64, 46, 3, wall);
  d.p.rect(10, -44, 20, 42).fill({ color: shade(wall, 0.2) });
  if (o.kind === 'wood') {
    for (let i = 0; i < 4; i++) d.line([-30, -36 + i * 10, 30, -36 + i * 10], shade(wall, 0.3), 1.5);
  } else {
    d.dots([-26, -40, -10, -40, 10, -40, 26, -40, -26, -6, 26, -6], 2, tint(wall, 0.5));
  }
  // vault door
  const door = o.kind === 'wood' ? C.woodDark : o.kind === 'iron' ? C.darkIron : C.goldDark;
  d.shape(
    (p) => p.moveTo(-12, 0).lineTo(-12, -24).quadraticCurveTo(0, -36, 12, -24).lineTo(12, 0).closePath(),
    door,
  );
  if (o.kind === 'wood') d.circle(7, -12, 2, C.gold, { lw: 1 });
  else {
    d.circle(0, -16, 7, tint(door, 0.25), { lw: 2 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      d.line([0, -16, Math.cos(a) * 6, -16 + Math.sin(a) * 6], shade(door, 0.4), 1.5);
    }
  }
  if (o.kind === 'gold' || o.kind === 'hoard') {
    d.glow(0, -20, 30, C.gold, 0.25);
    for (const [x, y] of [
      [-24, -2],
      [-18, -3],
      [22, -2],
      [26, -4],
    ] as const)
      d.circle(x, y, 4, C.gold, { lw: 1.4 });
  }
  if (o.kind === 'hoard') {
    // treasure spilling out
    d.shape(
      (p) =>
        p
          .moveTo(-40, 2)
          .quadraticCurveTo(-30, -14, -16, -2)
          .quadraticCurveTo(0, -10, 16, -2)
          .quadraticCurveTo(30, -14, 40, 2)
          .closePath(),
      C.gold,
    );
    d.gem(-22, -6, 4, C.crimson);
    d.gem(20, -6, 4, 0x3aa0ff);
    d.gem(0, -4, 4, 0x3ad06b);
  }
  // windows
  d.rrect(-26, -36, 9, 9, 2, 0x3a3040, { lw: 1.6 });
  d.p.rect(-25, -35, 3.5, 3.5).fill({ color: C.radiant, alpha: 0.8 });
}

export function roof(d: Draw, o: { kind: 'thatch' | 'tiled' | 'gilded' | 'dragon' }): void {
  const col =
    o.kind === 'thatch' ? 0xc8a24a : o.kind === 'tiled' ? 0xb34a2a : o.kind === 'gilded' ? C.gold : 0x8f1d2c;
  d.shape((p) => p.moveTo(-40, 6).lineTo(0, -26).lineTo(40, 6).closePath(), col);
  d.p
    .moveTo(0, -24)
    .lineTo(38, 5)
    .lineTo(14, 5)
    .closePath()
    .fill({ color: shade(col, 0.25) });
  if (o.kind === 'tiled' || o.kind === 'gilded')
    for (let i = 1; i < 4; i++)
      d.line([-40 + i * 8, 6 - i * 6.4, 40 - i * 8, 6 - i * 6.4], shade(col, 0.3), 1.5);
  if (o.kind === 'thatch')
    for (let i = -3; i <= 3; i++) d.line([i * 10, 4, i * 6, -8], shade(col, 0.25), 1.5);
  d.rrect(16, -26, 8, 16, 1, 0x7a5a4a, { lw: 1.8 });
  if (o.kind === 'gilded') {
    d.glow(0, -14, 30, C.radiant, 0.2);
    d.circle(0, -26, 4, C.radiant, { lw: 1.6 });
  }
  if (o.kind === 'dragon') {
    // dragon perched on the roof ridge
    d.shape(
      (p) =>
        p
          .moveTo(-18, -18)
          .quadraticCurveTo(-6, -40, 10, -34)
          .quadraticCurveTo(20, -42, 28, -36)
          .lineTo(24, -30)
          .quadraticCurveTo(14, -30, 10, -24)
          .quadraticCurveTo(-4, -26, -18, -18)
          .closePath(),
      C.ember,
    );
    d.shape(
      (p) =>
        p
          .moveTo(-2, -32)
          .quadraticCurveTo(-16, -56, -28, -42)
          .quadraticCurveTo(-18, -40, -10, -30)
          .closePath(),
      C.crimson,
    );
    d.circle(24, -36, 1.8, C.radiant, { lw: 0 });
    d.poly([22, -40, 22, -48, 26, -40], C.bone, { lw: 1.2 });
  }
}

export function sign(d: Draw, o: { kind: 'ledger' | 'bank' | 'crown' }): void {
  d.line([-6, -10, -6, -2], C.darkIron, 1.6);
  d.line([12, -10, 12, -2], C.darkIron, 1.6);
  const col = o.kind === 'ledger' ? C.wood : o.kind === 'bank' ? C.navy : C.crimson;
  d.rrect(-12, -2, 30, 18, 3, col);
  if (o.kind === 'ledger') {
    d.rrect(-6, 2, 16, 10, 1, C.cloth, { lw: 1.4 });
    d.line([2, 2, 2, 12], C.leather, 1.2);
  } else if (o.kind === 'bank') {
    d.circle(3, 7, 6, C.gold, { lw: 1.6 });
    d.p.moveTo(3, 3).lineTo(3, 11).stroke({ width: 1.6, color: C.goldDark });
  } else {
    d.poly([-5, 12, -5, 2, -1, 6, 3, 0, 7, 6, 11, 2, 11, 12], C.gold, { lw: 1.5 });
    d.glow(3, 7, 14, C.gold, 0.35);
  }
}

export function guard(d: Draw, o: { kind: 'strongbox' | 'golem' | 'royal' }): void {
  if (o.kind === 'golem') {
    d.p.ellipse(0, 0, 16, 5).fill({ color: 0x000000, alpha: 0.25 });
    d.rrect(-10, -12, 8, 12, 2, C.stone, { lw: 2 });
    d.rrect(2, -12, 8, 12, 2, C.stone, { lw: 2 });
    d.rrect(-14, -38, 28, 28, 5, C.stone);
    d.rrect(-9, -52, 18, 16, 4, shade(C.stone, 0.1));
    d.glow(0, -44, 10, C.arcane, 0.5);
    d.rrect(-6, -46, 12, 3, 1, C.arcane, { lw: 0 });
    d.rrect(-22, -34, 9, 20, 3, C.stone, { lw: 2 });
    d.rrect(13, -34, 9, 20, 3, C.stone, { lw: 2 });
    d.p.moveTo(-6, -30).lineTo(0, -22).lineTo(6, -30).stroke({ width: 2, color: C.arcane });
    return;
  }
  // human guard with a strongbox / royal halberd
  d.p.ellipse(0, 0, 12, 4).fill({ color: 0x000000, alpha: 0.25 });
  d.rrect(-6, -12, 5, 12, 2, 0x3a3a4a, { lw: 1.6 });
  d.rrect(1, -12, 5, 12, 2, 0x2a2a3a, { lw: 1.6 });
  d.rrect(-9, -30, 18, 20, 4, o.kind === 'royal' ? C.crimson : C.navy);
  d.circle(0, -37, 8, C.skin);
  d.dots([-2, -38, 3, -38], 1.3, 0x1d1410);
  if (o.kind === 'royal') {
    d.shape((p) => p.moveTo(-9, -40).quadraticCurveTo(0, -54, 9, -40).closePath(), C.gold);
    d.bar([14, 2, 14, -56], C.woodDark, 2);
    d.shape(
      (p) => p.moveTo(14, -56).quadraticCurveTo(26, -52, 24, -40).lineTo(14, -44).closePath(),
      C.steel,
      { lw: 2 },
    );
    d.poly([12, -56, 14, -64, 16, -56], C.steel, { lw: 1.4 });
  } else {
    d.shape((p) => p.moveTo(-9, -40).quadraticCurveTo(0, -52, 9, -40).closePath(), C.steel);
    d.rrect(8, -22, 16, 12, 2, C.woodDark);
    d.rrect(8, -22, 16, 4, 1, C.darkIron, { lw: 1.5 });
    d.circle(16, -15, 1.8, C.gold, { lw: 1 });
  }
}

export function stall(d: Draw, o: { kind: 'fruit' | 'spice' | 'bazaar' }): void {
  const awning = o.kind === 'fruit' ? C.red : o.kind === 'spice' ? 0x2a8f7a : C.purple;
  d.bar([-18, 0, -18, -34], C.woodDark, 2.2);
  d.bar([18, 0, 18, -34], C.woodDark, 2.2);
  d.rrect(-22, -16, 44, 14, 2, C.wood);
  // awning stripes
  d.shape((p) => p.moveTo(-24, -34).lineTo(24, -34).lineTo(28, -24).lineTo(-28, -24).closePath(), awning);
  for (let i = 0; i < 4; i++)
    d.p
      .poly([-24 + i * 14, -34, -17 + i * 14, -34, -14 + i * 14, -24, -21 + i * 14, -24], true)
      .fill({ color: C.white, alpha: 0.85 });
  const goods =
    o.kind === 'fruit'
      ? [C.red, 0x7bd63a, 0xffa21f]
      : o.kind === 'spice'
        ? [0xd94f1f, 0xe9c46a, 0x8f4a2a]
        : [C.gold, 0x3aa0ff, C.crimson];
  for (let i = 0; i < 6; i++) d.circle(-16 + i * 6.4, -19, 3.4, goods[i % 3]!, { lw: 1.3 });
  if (o.kind === 'bazaar') {
    d.glow(0, -28, 26, C.gold, 0.25);
    d.poly([-6, -34, 0, -46, 6, -34], C.gold, { lw: 1.6 });
    d.rrect(-26, -4, 14, 10, 2, 0x8f1d2c, { lw: 1.6 });
  }
}

export function cart(d: Draw, o: { kind: 'trade' | 'caravan' | 'royal' }): void {
  const col = o.kind === 'royal' ? C.crimson : C.wood;
  if (o.kind !== 'trade')
    d.shape(
      (p) => p.moveTo(-22, -22).quadraticCurveTo(0, -44, 22, -22).closePath(),
      o.kind === 'royal' ? C.gold : C.cloth,
    );
  d.rrect(-22, -24, 44, 14, 3, col);
  d.circle(-12, -6, 7, C.woodDark);
  d.circle(12, -6, 7, C.woodDark);
  d.dots([-12, -6, 12, -6], 2, C.bronze);
  if (o.kind === 'trade') {
    d.rrect(-16, -34, 12, 10, 2, C.wood, { lw: 1.6 });
    d.rrect(-2, -32, 10, 8, 2, C.cloth, { lw: 1.6 });
    d.circle(14, -28, 4, C.gold, { lw: 1.4 });
  }
  if (o.kind === 'royal') d.gem(0, -30, 4, C.radiant);
  d.line([22, -14, 36, -20], C.woodDark, 3);
  if (o.kind !== 'trade') {
    // pack mule head
    d.ellipse(42, -22, 7, 6, 0x8a7a6a);
    d.poly([38, -28, 40, -36, 43, -28], 0x8a7a6a, { lw: 1.4 });
    d.circle(46, -23, 1.4, 0x1d1410, { lw: 0 });
  }
}
