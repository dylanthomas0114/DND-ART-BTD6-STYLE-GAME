import { describe, expect, it } from 'vitest';
import { Game } from '../../src/core/game';
import type { TowerId } from '../../src/core/data/towerTypes';
import { DT } from '../../src/core/types';
import { bestSpot } from '../helpers';

describe('simulation performance', () => {
  it('a dense late round stays well under the 16 ms frame budget per sim step', () => {
    const g = new Game({ mapId: 'glade', difficulty: 'hard', seed: 3 });
    g.cash = 1e9;
    g.lives = 1e9;
    const ids: TowerId[] = [
      'ranger',
      'wizard',
      'bombardier',
      'rogue',
      'druid',
      'cleric',
      'ballista',
      'fighter',
    ];
    for (let i = 0; i < 24; i++) {
      const id = ids[i % ids.length]!;
      const s = bestSpot(g, id, 160);
      if (!s) break;
      const r = g.placeTower(id, s.x, s.y);
      if (r.ok) for (const p of [0, 0, 0, 1, 1]) g.upgradeTower(r.uid, p);
    }
    g.round = 58; // round 59: ~350 oozes, dense and regenerating
    g.startRound();
    let steps = 0;
    let peakEnemies = 0;
    let peakProj = 0;
    const t0 = performance.now();
    while (g.roundActive && steps < 60 / DT) {
      g.step();
      steps++;
      peakEnemies = Math.max(peakEnemies, g.enemies.length);
      peakProj = Math.max(peakProj, g.projectiles.length);
    }
    const ms = (performance.now() - t0) / steps;
    console.log(
      `avg step ${ms.toFixed(3)} ms over ${steps} steps; peak enemies ${peakEnemies}, projectiles ${peakProj}`,
    );
    expect(peakEnemies).toBeGreaterThan(100);
    // 3x game speed runs 3 steps per frame; keep the sim under ~1/4 of a 60 fps frame at 3x
    expect(ms).toBeLessThan(1.5);
  });
});
