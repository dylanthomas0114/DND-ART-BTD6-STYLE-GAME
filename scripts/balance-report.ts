// Usage: npx tsx scripts/balance-report.ts <map> <difficulty> [plan=STANDARD]
import { playBot, type Step } from '../tests/bot';
import * as plans from '../tests/plans';
import type { MapId } from '../src/core/data/maps';
import type { DifficultyId } from '../src/core/types';

const [map = 'glade', diff = 'medium', planName = 'STANDARD'] = process.argv.slice(2);
const t0 = Date.now();
const r = playBot(
  map as MapId,
  diff as DifficultyId,
  (plans as unknown as Record<string, Step[]>)[planName]!,
);
console.log(r.log.join('\n'));
console.log(
  JSON.stringify({
    map,
    diff,
    planName,
    won: r.won,
    round: r.round,
    lives: r.lives,
    livesLost: r.livesLost,
    secs: (Date.now() - t0) / 1000,
  }),
);
