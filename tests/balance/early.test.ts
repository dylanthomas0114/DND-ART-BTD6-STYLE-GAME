import { describe, expect, it } from 'vitest';
import { playBot } from '../bot';

describe('early game', () => {
  it('a modest ranger build holds the first 15 rounds of Goblin Glade on Medium', () => {
    const r = playBot(
      'glade',
      'medium',
      [
        { place: 'ranger', as: 'r1' },
        { place: 'ranger', as: 'r2' },
        { up: 'r1', path: 0, times: 2 },
        { up: 'r2', path: 0, times: 2 },
        { place: 'ranger', as: 'r3' },
        { up: 'r3', path: 0, times: 2 },
        { up: 'r1', path: 0 },
        { place: 'bombardier', as: 'b1' },
        { up: 'r2', path: 0 },
        { up: 'b1', path: 0, times: 2 },
        { place: 'ranger', as: 'r4' },
        { up: 'r4', path: 0, times: 3 },
        { up: 'r1', path: 1, times: 2 },
      ],
      { untilRound: 15 },
    );
    expect(r.round).toBe(15);
    expect(r.livesLost, r.log.join('\n')).toBeLessThan(40);
  });

  it('doing nothing loses quickly', () => {
    const r = playBot('glade', 'medium', [], { untilRound: 20 });
    expect(r.won).toBe(false);
    expect(r.round).toBeLessThan(12);
  });
});
