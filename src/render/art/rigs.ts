import { type Draw, shade } from './pen';
import { C } from './palette';

/** Base art for non-humanoid towers. Origin at ground centre. */

export const BALLISTA_ANCHORS = {
  ground: { x: 0, y: 0 },
  flag: { x: -40, y: -4 },
  ammo: { x: 34, y: 6 },
  frame: { x: 0, y: -24 },
  crew: { x: -32, y: 10 },
  /** Pivot of the rotating prod (bow arms) that carries the bolt. */
  prod: { x: 2, y: -34 },
};

export function drawBallistaBase(d: Draw): void {
  d.p.ellipse(0, 2, 34, 10).fill({ color: 0x000000, alpha: 0.28 });
  // trestle legs
  d.bar([-22, 2, -6, -26], C.woodDark, 6);
  d.bar([22, 2, 6, -26], C.woodDark, 6);
  d.bar([-4, 6, 0, -26], C.wood, 6);
  // turntable
  d.ellipse(0, -26, 22, 8, C.wood);
  d.p.ellipse(0, -24, 20, 5).fill({ color: shade(C.wood, 0.25) });
  d.dots([-14, -26, 14, -26, 0, -32], 2, C.iron);
}

/** The prod: horizontal bow arms + string, drawn pointing +x (rotates to aim). */
export function drawBallistaProd(d: Draw): void {
  d.rrect(-18, -6, 40, 12, 3, C.wood);
  d.p.rect(-16, 0, 36, 5).fill({ color: shade(C.wood, 0.25) });
  // bow arms (drawn foreshortened, sweeping up/down)
  d.bar([14, -4, 6, -26, -6, -32], C.woodDark, 5);
  d.bar([14, 4, 6, 26, -6, 32], C.woodDark, 5);
  d.line([-6, -32, -16, 0, -6, 32], C.white, 1.6);
  d.rrect(10, -8, 8, 16, 2, C.iron, { lw: 2 });
}

export const TREASURY_ANCHORS = {
  ground: { x: 0, y: 0 },
  vault: { x: 0, y: -4 },
  roof: { x: 0, y: -50 },
  sign: { x: -36, y: -42 },
  guard: { x: 26, y: 16 },
  stall: { x: -58, y: 8 },
  cart: { x: 60, y: 8 },
};

export function drawTreasuryBase(d: Draw): void {
  d.p.ellipse(0, 4, 70, 16).fill({ color: 0x000000, alpha: 0.25 });
  d.rrect(-40, -8, 80, 14, 4, C.stone);
  d.p.rect(-38, 0, 76, 4).fill({ color: shade(C.stone, 0.2) });
  for (let i = 0; i < 6; i++) d.line([-34 + i * 14, -6, -34 + i * 14, 4], shade(C.stone, 0.35), 1.2);
}
