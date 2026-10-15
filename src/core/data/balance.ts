/**
 * Global balance knobs, tuned with `npm run sim:balance` / `scripts/balance-report.ts`.
 * Prefer changing these over editing every tower when the whole game is too hard or too easy.
 */
export const BALANCE = {
  /** Multiplier on every attack's seconds-between-attacks (lower = faster). */
  rateScale: 0.8,
  /** Multiplier on every attack's damage. */
  damageScale: 1,
  /** End-of-round bonus = roundBonusBase + roundBonusPerRound × round. */
  roundBonusBase: 120,
  roundBonusPerRound: 2,
  /** Multiplier on gold earned per popped layer. */
  popCashScale: 1.25,
  /** Pierce (and splash pierce) multiplier by the tower's highest tier: late tiers handle crowds. */
  tierPierceScale: [1, 1, 1, 1, 1.3, 1.6] as readonly number[],
};
