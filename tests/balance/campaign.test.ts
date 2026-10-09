import { describe, expect, it } from 'vitest';
import { playBot } from '../bot';
import { STANDARD, STRONG, WEAK } from '../plans';
import type { MapId } from '../../src/core/data/maps';

const MAPS: MapId[] = ['glade', 'crypt', 'pass'];

describe('campaign balance (bots play full games)', () => {
  for (const map of MAPS) {
    it(`${map}: a sensible build wins Easy`, () => {
      const r = playBot(map, 'easy', STANDARD);
      expect(r.won, r.log.join('\n')).toBe(true);
    });

    it(`${map}: an optimised build wins Medium`, () => {
      const r = playBot(map, 'medium', STRONG);
      expect(r.won, r.log.join('\n')).toBe(true);
    });

    it(`${map}: an optimised, adaptive build can win Hard`, () => {
      const r = playBot(map, 'hard', STRONG);
      expect(r.won, r.log.join('\n')).toBe(true);
    });

    it(`${map}: a lazy build loses on Medium before round 35`, () => {
      const r = playBot(map, 'medium', WEAK, { filler: false });
      expect(r.won).toBe(false);
      expect(r.round).toBeLessThan(35);
    });
  }

  it('glade: a fixed plan that never spends spare gold falls short on Hard', () => {
    const r = playBot('glade', 'hard', STANDARD, { filler: false });
    expect(r.won).toBe(false);
    expect(r.round).toBeGreaterThan(45);
  });
});
