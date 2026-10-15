import type { Game } from '../src/core/game';
import type { TowerId } from '../src/core/data/towerTypes';

/**
 * Finds a legal placement close to the road at the given fraction of path `pathIndex`,
 * spiralling outward. Deterministic.
 */
export function spotNear(
  g: Game,
  id: TowerId,
  frac: number,
  pathIndex = 0,
  minDist = 0,
): { x: number; y: number } | null {
  const path = g.paths[pathIndex]!;
  const p = path.pointAt(path.length * frac, { x: 0, y: 0 });
  for (let r = 30; r < 400; r += 6) {
    const steps = Math.ceil((2 * Math.PI * r) / 12);
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const x = Math.round(p.x + Math.cos(a) * r);
      const y = Math.round(p.y + Math.sin(a) * r);
      if (minDist > 0 && g.paths.some((q) => q.closest(x, y).dist < minDist)) continue;
      if (g.canPlace(id, x, y).ok) return { x, y };
    }
  }
  return null;
}

export function place(g: Game, id: TowerId, frac: number, pathIndex = 0): number {
  const s = spotNear(g, id, frac, pathIndex);
  if (!s) throw new Error(`no spot for ${id} at ${frac}`);
  const r = g.placeTower(id, s.x, s.y);
  if (!r.ok) throw new Error(r.reason);
  return r.uid;
}

/**
 * Legal spot that covers the most road within `range`, preferring road that existing towers don't
 * already cover (how a decent player spreads a defence).
 */
export function bestSpot(
  g: Game,
  id: TowerId,
  range: number,
  opts: { maxFrac?: number; minFrac?: number } = {},
): { x: number; y: number } | null {
  const samples: { x: number; y: number; w: number }[] = [];
  for (const path of g.paths) {
    const from = path.length * (opts.minFrac ?? 0);
    const to = path.length * (opts.maxFrac ?? 1);
    for (let d = from; d < to; d += 20) {
      const p = path.pointAt(d, { x: 0, y: 0 });
      if (p.x < 0 || p.x > 1600) continue;
      const covered = g.towers.some(
        (t) => t.stats.attacks.length > 0 && (t.x - p.x) ** 2 + (t.y - p.y) ** 2 <= g.rangeOf(t) ** 2,
      );
      samples.push({ x: p.x, y: p.y, w: covered ? 0.45 : 1 });
    }
  }
  let best: { x: number; y: number } | null = null;
  let bestScore = 0;
  for (let x = 30; x < 1600; x += 20) {
    for (let y = 30; y < 900; y += 20) {
      let score = 0;
      for (const s of samples) if ((s.x - x) ** 2 + (s.y - y) ** 2 <= range * range) score += s.w;
      if (score <= bestScore) continue;
      if (!g.canPlace(id, x, y).ok) continue;
      bestScore = score;
      best = { x, y };
    }
  }
  return best;
}

export function placeBest(
  g: Game,
  id: TowerId,
  opts: { maxFrac?: number; minFrac?: number } = {},
): number | null {
  const range = g.towerCost(id) >= 0 ? (id === 'ballista' ? 120 : 160) : 160;
  const s = bestSpot(g, id, range, opts);
  if (!s) return null;
  const r = g.placeTower(id, s.x, s.y);
  return r.ok ? r.uid : null;
}
