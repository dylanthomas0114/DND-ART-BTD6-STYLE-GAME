/** Shared simulation types. The core layer is renderer-free and fully deterministic. */

export type DamageType = 'piercing' | 'slashing' | 'blast' | 'fire' | 'cold' | 'arcane' | 'radiant' | 'true';

export const DAMAGE_TYPES: readonly DamageType[] = [
  'piercing',
  'slashing',
  'blast',
  'fire',
  'cold',
  'arcane',
  'radiant',
  'true',
];

export type TargetPriority = 'first' | 'last' | 'close' | 'strong';
export const TARGET_PRIORITIES: readonly TargetPriority[] = ['first', 'last', 'close', 'strong'];

export type DifficultyId = 'easy' | 'medium' | 'hard';

export interface Vec2 {
  x: number;
  y: number;
}

/** World is a fixed logical 16:9 play area. Everything in the sim uses these units. */
export const WORLD_W = 1600;
export const WORLD_H = 900;

/** Fixed simulation timestep (seconds). */
export const DT = 1 / 60;
