import type { Draw } from '../pen';

/**
 * How a hand-held piece is posed/animated:
 * - blade: held upright, swung on melee attacks
 * - aim: points at the target (bows, cannons, wands)
 * - staff: held upright, raised and pulsed when casting
 * - thrown: held upright, flicked forward on throws
 * - shield: off-hand, bashes forward
 * - held: off-hand trinket held up (orbs, crystals)
 */
export type Hold = 'blade' | 'aim' | 'staff' | 'thrown' | 'shield' | 'held';

export interface GearArt {
  /** Draws the piece around its attach point (0, 0). Hand items: grip at origin, pointing up (or +x for `aim`). */
  draw(d: Draw): void;
  hold?: Hold;
  /** Glow colour pulsed on attack (staffs, orbs). */
  glow?: number;
  /** For `ground`/`companion` pieces: draw in front of the body instead of behind. */
  front?: boolean;
}

export type GearSet = Record<string, GearArt>;
