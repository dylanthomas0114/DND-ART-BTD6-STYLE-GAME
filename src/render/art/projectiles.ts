import { type Draw, OUTLINE, tint } from './pen';
import { C } from './palette';

/** Projectile sprites, drawn pointing +x around their centre. */
export const PROJECTILES: Record<string, (d: Draw) => void> = {
  arrow: (d) => {
    d.line([-16, 0, 10, 0], OUTLINE, 4.5);
    d.line([-16, 0, 10, 0], C.wood, 2.4);
    d.poly([8, -4, 18, 0, 8, 4], C.steel, { lw: 1.5 });
    d.poly([-18, -4, -12, 0, -18, 4, -14, 0], C.white, { lw: 1.2 });
  },
  arrow_storm: (d) => {
    d.glow(0, 0, 16, C.arcane, 0.5);
    d.line([-16, 0, 10, 0], C.radiant, 3);
    d.poly([8, -5, 20, 0, 8, 5], C.radiant, { lw: 1.5 });
    d.p.moveTo(-14, -4).lineTo(-8, 3).lineTo(-2, -4).lineTo(4, 3).stroke({ width: 1.6, color: C.arcane });
  },
  arrow_sun: (d) => {
    d.glow(4, 0, 18, C.fire, 0.55);
    d.line([-18, 0, 10, 0], C.gold, 3.5);
    d.poly([8, -6, 22, 0, 8, 6], C.radiant, { lw: 1.6 });
  },
  arrow_heart: (d) => {
    d.glow(10, 0, 12, C.crimson, 0.5);
    d.line([-16, 0, 8, 0], C.wood, 3);
    d.shape(
      (p) =>
        p
          .moveTo(18, 0)
          .quadraticCurveTo(10, -9, 6, -5)
          .quadraticCurveTo(4, -2, 8, 0)
          .quadraticCurveTo(4, 2, 6, 5)
          .quadraticCurveTo(10, 9, 18, 0)
          .closePath(),
      C.crimson,
      { lw: 1.5 },
    );
  },
  arrow_star: (d) => {
    d.glow(8, 0, 18, C.radiant, 0.6);
    d.line([-18, 0, 6, 0], C.gold, 3);
    d.star(12, 0, 8, C.radiant, { lw: 1.5 });
  },
  dagger: (d) => {
    d.poly([-6, -3, 12, -2, 18, 0, 12, 2, -6, 3], C.steel, { lw: 1.6 });
    d.rrect(-9, -5, 3, 10, 1, C.gold, { lw: 1.2 });
    d.rrect(-15, -2, 6, 4, 1, C.leatherDark, { lw: 1.2 });
  },
  dagger_venom: (d) => {
    d.glow(4, 0, 12, C.poison, 0.45);
    d.poly([-6, -3, 12, -2, 18, 0, 12, 2, -6, 3], 0xb6e88a, { lw: 1.6 });
    d.rrect(-12, -2, 6, 4, 1, C.black, { lw: 1.2 });
    d.circle(-2, 4, 2, C.poison, { lw: 1 });
  },
  dagger_shadow: (d) => {
    d.glow(4, 0, 14, C.purple, 0.5);
    d.poly([-6, -3, 14, -2, 20, 0, 14, 2, -6, 3], 0x5a4a7a, { lw: 1.6 });
    d.rrect(-12, -2, 6, 4, 1, C.black, { lw: 1.2 });
  },
  dagger_night: (d) => {
    d.glow(4, 0, 16, C.arcane, 0.55);
    d.poly([-6, -4, 16, -2, 24, 0, 16, 2, -6, 4], 0x2a2440, { lw: 1.6 });
    d.line([-2, 0, 18, 0], C.arcane, 1.2);
    d.rrect(-12, -2, 6, 4, 1, C.crimson, { lw: 1.2 });
  },
  caltrops: (d) => {
    for (const [x, y] of [
      [-6, -3],
      [5, -5],
      [0, 5],
      [8, 4],
    ] as const)
      d.poly([x - 4, y + 2, x, y - 5, x + 4, y + 2, x, y], C.steelDark, { lw: 1.1 });
  },
  blasttrap: (d) => {
    d.circle(0, 0, 8, C.black);
    d.dots([-4, -3, 3, -4, 5, 3, -3, 4], 1.4, C.steel);
    d.circle(0, 0, 2.6, C.ember, { lw: 0 });
    d.glow(0, 0, 10, C.ember, 0.3);
  },
  missile: (d) => {
    d.glow(0, 0, 16, C.arcane, 0.55);
    d.p
      .moveTo(-18, 0)
      .quadraticCurveTo(-6, -7, 6, 0)
      .quadraticCurveTo(-6, 7, -18, 0)
      .fill({ color: C.arcane, alpha: 0.6 });
    d.circle(4, 0, 6, 0xd9c2ff, { lw: 2, outline: 0x5a2aa0 });
  },
  missile_astral: (d) => {
    d.glow(0, 0, 18, 0x7fa8ff, 0.6);
    d.p
      .moveTo(-20, 0)
      .quadraticCurveTo(-6, -8, 6, 0)
      .quadraticCurveTo(-6, 8, -20, 0)
      .fill({ color: 0x7fa8ff, alpha: 0.6 });
    d.star(4, 0, 8, C.radiant, { lw: 1.4 });
  },
  fireball: (d) => {
    d.glow(0, 0, 20, C.fire, 0.6);
    d.p
      .moveTo(-22, 0)
      .quadraticCurveTo(-8, -12, 6, -8)
      .quadraticCurveTo(14, 0, 6, 8)
      .quadraticCurveTo(-8, 12, -22, 0)
      .fill({ color: C.ember });
    d.circle(3, 0, 8, C.fire, { lw: 2, outline: 0x8f2a10 });
    d.circle(5, -1, 4, C.radiant, { lw: 0 });
  },
  sunball: (d) => {
    d.glow(0, 0, 26, C.radiant, 0.7);
    d.star(2, 0, 14, C.gold, { lw: 1.6 }, 10, 0.6);
    d.circle(2, 0, 8, C.radiant, { lw: 1.6 });
  },
  bomb: (d) => {
    d.circle(0, 0, 9, C.black);
    d.hi(-3, -3, 3, 2, 0xffffff, 0.5);
    d.line([5, -6, 9, -11], C.wood, 2);
    d.circle(9, -11, 2.4, C.fire, { lw: 0 });
  },
  bomb_big: (d) => {
    d.circle(0, 0, 12, 0x3a3a3a);
    d.rrect(-12, -2, 24, 4, 1, C.bronze, { lw: 1.2 });
    d.hi(-4, -5, 3.5, 2.5, 0xffffff, 0.45);
    d.line([7, -8, 11, -14], C.wood, 2);
    d.circle(11, -14, 3, C.fire, { lw: 0 });
  },
  bomb_rune: (d) => {
    d.glow(0, 0, 18, C.arcane, 0.5);
    d.circle(0, 0, 12, 0x2a2440);
    d.star(0, 0, 6, C.arcane, { lw: 0 }, 4, 0.35);
    d.line([7, -8, 11, -14], C.wood, 2);
    d.circle(11, -14, 3, C.arcane, { lw: 0 });
  },
  grenade: (d) => {
    d.circle(0, 0, 6.5, C.darkIron);
    d.line([-6, 0, 6, 0], tint(C.darkIron, 0.3), 1.2);
    d.circle(4, -5, 1.8, C.fire, { lw: 0 });
  },
  icicle: (d) => {
    d.glow(0, 0, 12, C.frost, 0.4);
    d.poly([-14, -4, 18, 0, -14, 4], C.ice, { lw: 1.6 });
    d.line([-10, -1, 12, 0], 0xffffff, 1.2);
  },
  frostbreath: (d) => {
    d.glow(0, 0, 16, C.frost, 0.6);
    d.p.circle(0, 0, 9).fill({ color: C.ice, alpha: 0.8 });
    d.star(0, 0, 7, 0xffffff, { lw: 0 }, 6, 0.35);
  },
};

/** Particle/FX textures (white so they can be tinted). */
export const FX: Record<string, (d: Draw) => void> = {
  soft: (d) => d.glow(0, 0, 16, 0xffffff, 1.4),
  dot: (d) => d.circle(0, 0, 6, 0xffffff, { lw: 0 }),
  ring: (d) => {
    d.p.circle(0, 0, 30).stroke({ width: 5, color: 0xffffff });
  },
  spark: (d) => d.star(0, 0, 10, 0xffffff, { lw: 0 }, 4, 0.25),
  slash: (d) => {
    d.p
      .moveTo(-30, 10)
      .quadraticCurveTo(0, -36, 34, 4)
      .quadraticCurveTo(2, -20, -30, 10)
      .fill({ color: 0xffffff });
  },
  drop: (d) => {
    d.p.moveTo(0, -8).quadraticCurveTo(7, 2, 0, 6).quadraticCurveTo(-7, 2, 0, -8).fill({ color: 0xffffff });
  },
  star: (d) => d.star(0, 0, 8, 0xffe44a, { lw: 1.5 }),
  snow: (d) => {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      d.line([0, 0, Math.cos(a) * 7, Math.sin(a) * 7], 0xffffff, 2);
    }
  },
  flame: (d) => {
    d.p.moveTo(0, 8).quadraticCurveTo(-7, 0, 0, -10).quadraticCurveTo(7, 0, 0, 8).fill({ color: 0xffffff });
  },
  coin: (d) => {
    d.circle(0, 0, 7, C.gold, { lw: 2 });
    d.p.rect(-1.2, -4, 2.4, 8).fill({ color: C.goldDark });
  },
  smoke: (d) => {
    d.p.circle(0, 0, 10).fill({ color: 0xffffff, alpha: 0.5 });
    d.p.circle(6, -4, 7).fill({ color: 0xffffff, alpha: 0.5 });
    d.p.circle(-6, -3, 6).fill({ color: 0xffffff, alpha: 0.5 });
  },
  shard: (d) => d.poly([0, -6, 3, 0, 0, 6, -3, 0], 0xffffff, { lw: 0 }),
  shield: (d) => {
    d.shape(
      (p) =>
        p
          .moveTo(-6, -7)
          .lineTo(6, -7)
          .lineTo(6, 0)
          .quadraticCurveTo(6, 6, 0, 9)
          .quadraticCurveTo(-6, 6, -6, 0)
          .closePath(),
      0xdfe6ec,
      { lw: 1.6 },
    );
    d.line([-3, -3, 3, 3], C.red, 2);
    d.line([3, -3, -3, 3], C.red, 2);
  },
  beam: (d) => {
    d.p.rect(0, -6, 64, 12).fill({ color: 0xffffff, alpha: 0.35 });
    d.p.rect(0, -2.5, 64, 5).fill({ color: 0xffffff });
  },
};
