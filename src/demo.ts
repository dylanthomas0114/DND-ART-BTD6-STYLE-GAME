import type { MapId } from './core/data/maps';
import type { TowerId, Tiers } from './core/data/towerTypes';
import { createPixiApp } from './render/pixiApp';
import { GameSession } from './session';

/**
 * `?demo[=map]&round=N&speed=3`: auto-builds a showcase defence and plays it. Used for visual
 * checks, screenshots and performance measurement (`window.__game`).
 */
export async function startDemo(host: HTMLElement, params: URLSearchParams): Promise<void> {
  const app = await createPixiApp(host);
  const mapId = (params.get('demo') || 'glade') as MapId;
  const s = new GameSession(app, {
    mapId: ['glade', 'crypt', 'pass'].includes(mapId) ? mapId : 'glade',
    difficulty: 'easy',
    seed: 3,
  });
  const g = s.game;
  g.cash = 1e7;
  g.lives = 1e7;
  const build: [TowerId, number, number, Tiers][] = [
    ['fighter', 410, 300, [5, 2, 0]],
    ['ranger', 180, 300, [2, 0, 5]],
    ['wizard', 760, 330, [0, 2, 5]],
    ['bombardier', 470, 610, [5, 0, 2]],
    ['druid', 820, 470, [2, 5, 0]],
    ['cleric', 1140, 300, [0, 5, 2]],
    ['rogue', 1180, 600, [2, 5, 0]],
    ['ballista', 1520, 300, [5, 2, 0]],
    ['treasury', 1500, 560, [0, 5, 2]],
  ];
  for (const [id, x, y, tiers] of params.get('towers') === '0' ? [] : build) {
    let r = g.placeTower(id, x, y);
    for (let dx = 0; !r.ok && dx < 200; dx += 15) r = g.placeTower(id, x + dx, y + (dx % 30));
    if (!r.ok) continue;
    for (let p = 0; p < 3; p++) for (let i = 0; i < tiers[p]!; i++) g.upgradeTower(r.uid, p);
  }
  g.round = Math.max(0, Number(params.get('round') ?? 30) - 1);
  s.speed = (Number(params.get('speed') ?? 1) as 1 | 2 | 3) || 1;
  s.autoStart = true;
  g.startRound();
  const fit = () => s.view.setLayout(0, 0, app.screen.width, app.screen.height);
  fit();
  app.renderer.on('resize', fit);
  (window as unknown as { __game: unknown }).__game = {
    ready: true,
    session: s,
    game: g,
    stats: () => ({
      fps: s.fps,
      enemies: g.enemies.length,
      projectiles: g.projectiles.length,
      particles: s.view.particles.count,
      round: g.round,
      quality: s.view.quality,
    }),
  };
}
