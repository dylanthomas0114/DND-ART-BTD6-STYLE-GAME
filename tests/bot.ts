import { Game } from '../src/core/game';
import type { MapId } from '../src/core/data/maps';
import type { TowerId } from '../src/core/data/towerTypes';
import { DT, type DifficultyId } from '../src/core/types';
import { bestSpot } from './helpers';

/** A build-order step: place a tower (tagged with a name) or upgrade a tagged tower's path. */
export type Step =
  | { place: TowerId; as: string; minFrac?: number; maxFrac?: number }
  | { up: string; path: 0 | 1 | 2; times?: number };

export interface BotResult {
  won: boolean;
  round: number;
  lives: number;
  livesLost: number;
  log: string[];
}

const RANGE_GUESS: Partial<Record<TowerId, number>> = {
  fighter: 95,
  druid: 105,
  ballista: 140,
  treasury: 60,
  bombardier: 150,
  wizard: 160,
  rogue: 145,
  cleric: 145,
};

/** Plays a whole game following `plan`, buying the next step whenever it can afford it. */
export function playBot(
  mapId: MapId,
  difficulty: DifficultyId,
  plan: Step[],
  opts: { seed?: number; untilRound?: number; abilities?: boolean } = {},
): BotResult {
  const g = new Game({ mapId, difficulty, seed: opts.seed ?? 7 });
  const tags = new Map<string, number>();
  const steps: Step[] = plan.flatMap((s) =>
    'up' in s && s.times ? Array.from({ length: s.times }, () => ({ up: s.up, path: s.path })) : [s],
  );
  let idx = 0;
  const log: string[] = [];
  const startLives = g.lives;
  const until = opts.untilRound ?? g.finalRound;

  const tryBuy = () => {
    while (idx < steps.length) {
      const s = steps[idx]!;
      if ('place' in s) {
        if (g.cash < g.towerCost(s.place)) return;
        const spot = bestSpot(g, s.place, RANGE_GUESS[s.place] ?? 160, s);
        if (!spot) {
          log.push(`r${g.round}: no spot for ${s.as}`);
          idx++;
          continue;
        }
        const r = g.placeTower(s.place, spot.x, spot.y);
        if (!r.ok) return;
        tags.set(s.as, r.uid);
      } else {
        const uid = tags.get(s.up);
        const t = uid !== undefined ? g.towerByUid(uid) : undefined;
        if (!t) {
          idx++;
          continue;
        }
        const price = g.upgradePrice(t, s.path);
        if (price === null) {
          idx++;
          continue;
        }
        if (g.cash < price) return;
        g.upgradeTower(t.uid, s.path);
      }
      idx++;
    }
  };

  while (!g.over && g.round < until) {
    tryBuy();
    const before = g.lives;
    g.startRound();
    let ticks = 0;
    while (g.roundActive && !g.over && ticks < 900 / DT) {
      g.step();
      ticks++;
      if (ticks % 30 === 0) {
        tryBuy();
        if (opts.abilities !== false)
          for (const t of g.towers) if (g.abilityReady(t) && g.enemies.length > 0) g.activateAbility(t.uid);
      }
    }
    if (g.lives < before) log.push(`r${g.round}: -${before - g.lives} lives (cash ${Math.floor(g.cash)})`);
    if (ticks >= 900 / DT) {
      log.push(`r${g.round}: round timed out`);
      break;
    }
  }
  return {
    won: !!g.over?.won || (!g.over && g.round >= until),
    round: g.round,
    lives: g.lives,
    livesLost: startLives - g.lives,
    log,
  };
}
