import { Game } from '../src/core/game';
import type { MapId } from '../src/core/data/maps';
import type { TowerId } from '../src/core/data/towerTypes';
import { DT, type DifficultyId } from '../src/core/types';
import { bestSpot } from './helpers';
import { TOWERS } from '../src/core/data/towers';

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

/** Plays a whole game following `plan`, buying the next step whenever it can afford it. */
export function playBot(
  mapId: MapId,
  difficulty: DifficultyId,
  plan: Step[],
  opts: { seed?: number; untilRound?: number; abilities?: boolean; filler?: boolean } = {},
): BotResult {
  const g = new Game({ mapId, difficulty, seed: opts.seed ?? 7 });
  const tags = new Map<string, number>();
  const steps: Step[] = plan.flatMap((s) =>
    'up' in s && s.times ? Array.from({ length: s.times }, () => ({ up: s.up, path: s.path })) : [s],
  );
  const done = new Array<boolean>(steps.length).fill(false);
  let idx = 0; // first undone step
  const log: string[] = [];
  const startLives = g.lives;
  const until = opts.untilRound ?? g.finalRound;
  const LOOKAHEAD = 10;

  const tagOf = (s: Step) => ('place' in s ? s.as : s.up);

  /** Tries one step; returns 'done' (bought or impossible → skip), or 'wait'. */
  const attempt = (i: number): 'done' | 'wait' => {
    const s = steps[i]!;
    if ('place' in s) {
      if (g.cash < g.towerCost(s.place)) return 'wait';
      const spot = bestSpot(
        g,
        s.place,
        s.place === 'ballista' || s.place === 'treasury' ? 120 : TOWERS[s.place].base.range,
        s,
      );
      if (!spot) {
        log.push(`r${g.round}: no spot for ${s.as}`);
        return 'done';
      }
      const r = g.placeTower(s.place, spot.x, spot.y);
      if (!r.ok) return 'wait';
      tags.set(s.as, r.uid);
      return 'done';
    }
    const uid = tags.get(s.up);
    const t = uid !== undefined ? g.towerByUid(uid) : undefined;
    if (!t) return 'done';
    const price = g.upgradePrice(t, s.path);
    if (price === null) return 'done';
    if (g.cash < price) return 'wait';
    g.upgradeTower(t.uid, s.path);
    return 'done';
  };

  // When every planned purchase is out of reach, a real player spends spare gold on more
  // towers of varied damage types. Fillers get cheap upgrades: tiers [3,2,0]-ish.
  const FILLERS: { id: TowerId; paths: [number, number] }[] = [
    { id: 'wizard', paths: [1, 0] },
    { id: 'rogue', paths: [0, 1] },
    { id: 'ranger', paths: [0, 1] },
    { id: 'cleric', paths: [0, 1] },
    { id: 'ballista', paths: [0, 1] },
    { id: 'bombardier', paths: [0, 2] },
  ];
  let fillerIdx = 0;
  const fillers: number[] = [];
  const filler = () => {
    for (let guard = 0; guard < 50 && g.cash >= 2500; guard++) {
      // first finish upgrading existing fillers to [3,2]
      let did = false;
      for (const uid of fillers) {
        const t = g.towerByUid(uid);
        if (!t) continue;
        const f = FILLERS.find((x) => x.id === t.def.id)!;
        for (const [path, cap] of [
          [f.paths[0], 3],
          [f.paths[1], 2],
        ] as const) {
          if (t.tiers[path]! >= cap) continue;
          const price = g.upgradePrice(t, path);
          if (price !== null && g.cash - price >= 500) {
            g.upgradeTower(t.uid, path);
            did = true;
            break;
          }
        }
        if (did) break;
      }
      if (did) continue;
      const f = FILLERS[fillerIdx % FILLERS.length]!;
      if (g.cash < g.towerCost(f.id) + 1500) return;
      const spot = bestSpot(g, f.id, f.id === 'ballista' ? 120 : TOWERS[f.id].base.range);
      if (!spot) return;
      const r = g.placeTower(f.id, spot.x, spot.y);
      if (!r.ok) return;
      fillers.push(r.uid);
      fillerIdx++;
    }
  };

  /** Buys the first affordable step among the next few (keeping per-tower order). */
  const tryBuy = () => {
    for (let guard = 0; guard < 200; guard++) {
      while (idx < steps.length && done[idx]) idx++;
      if (idx >= steps.length) return;
      let bought = false;
      const blocked = new Set<string>();
      for (let i = idx, seen = 0; i < steps.length && seen < LOOKAHEAD; i++) {
        if (done[i]) continue;
        seen++;
        const s = steps[i]!;
        const tag = tagOf(s);
        if (
          blocked.has(tag) ||
          ('up' in s &&
            !tags.has(s.up) &&
            steps.slice(0, i).some((p) => 'place' in p && p.as === s.up && !done[steps.indexOf(p)]))
        ) {
          blocked.add(tag);
          continue;
        }
        if (attempt(i) === 'done') {
          done[i] = true;
          bought = true;
          break;
        }
        blocked.add(tag);
      }
      if (!bought) {
        if (opts.filler !== false) filler();
        return;
      }
    }
  };
  const leaks: Record<string, number> = {};
  g.events.on('leak', (e) => (leaks[e.enemy] = (leaks[e.enemy] ?? 0) + e.livesLost));

  while (!g.over && g.round < until) {
    for (const k of Object.keys(leaks)) delete leaks[k];
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
    if (g.lives < before)
      log.push(
        `r${g.round}: -${before - g.lives} lives (cash ${Math.floor(g.cash)}) ${JSON.stringify(leaks)}`,
      );
    if (ticks >= 900 / DT) {
      log.push(`r${g.round}: round timed out`);
      break;
    }
  }
  log.push(`plan step ${idx}/${steps.length}`);
  log.push(
    `final build: ${g.towers.map((t) => `${t.def.id}[${t.tiers.join('')}] pops=${t.pops}`).join(', ')}; spent=${g.towers.reduce((s, t) => s + t.spent, 0)}`,
  );
  return {
    won: !!g.over?.won || (!g.over && g.round >= until),
    round: g.round,
    lives: g.lives,
    livesLost: startLives - g.lives,
    log,
  };
}
