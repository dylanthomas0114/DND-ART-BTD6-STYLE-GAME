import type { DifficultyId } from '../types';

export interface DifficultyDef {
  id: DifficultyId;
  name: string;
  lives: number;
  costMult: number;
  finalRound: number;
  startCash: number;
  /** Boss of the final round, shown on the difficulty card. */
  finale: string;
}

export const DIFFICULTIES: Record<DifficultyId, DifficultyDef> = {
  easy: {
    id: 'easy',
    name: 'Apprentice',
    lives: 200,
    costMult: 0.85,
    finalRound: 40,
    startCash: 650,
    finale: 'Ogre Brute',
  },
  medium: {
    id: 'medium',
    name: 'Adventurer',
    lives: 150,
    costMult: 1,
    finalRound: 60,
    startCash: 650,
    finale: 'Troll Chieftain',
  },
  hard: {
    id: 'hard',
    name: 'Legend',
    lives: 100,
    costMult: 1.08,
    finalRound: 80,
    startCash: 650,
    finale: 'Stone Giant',
  },
};

/** BTD-style rounding: costs snap to the nearest 5. */
export function scaledCost(base: number, mult: number): number {
  return Math.max(5, Math.round((base * mult) / 5) * 5);
}
