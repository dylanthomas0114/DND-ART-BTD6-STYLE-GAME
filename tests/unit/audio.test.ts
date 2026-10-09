import { describe, expect, it } from 'vitest';
import { RECIPES } from '../../src/audio/sfx';
import { render } from '../../src/audio/synth';

describe('synthesised sound effects', () => {
  for (const [name, recipe] of Object.entries(RECIPES)) {
    it(`${name} renders audible, unclipped, short audio`, () => {
      const pcm = render(recipe(0), 44100);
      let peak = 0;
      let energy = 0;
      for (const s of pcm) {
        expect(Number.isFinite(s)).toBe(true);
        peak = Math.max(peak, Math.abs(s));
        energy += s * s;
      }
      expect(peak).toBeGreaterThan(0.05);
      expect(peak).toBeLessThanOrEqual(1);
      expect(energy).toBeGreaterThan(1);
      expect(pcm.length / 44100).toBeLessThan(2);
    });
  }
});
