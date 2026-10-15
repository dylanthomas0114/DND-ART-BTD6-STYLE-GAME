// Measures JS time per frame (sim + render bookkeeping), excluding GPU work.
import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 915, height: 412 }, deviceScaleFactor: 1 });
await page.goto(`${process.argv[2] ?? 'http://localhost:4173/'}?demo&round=59&speed=1&towers=0`);
await page.waitForFunction(() => window.__game?.ready && window.__game.game.enemies.length > 150, null, {
  timeout: 60000,
});
const r = await page.evaluate(async () => {
  const s = window.__game.session;
  const g = window.__game.game;
  const times = [];
  const orig = s.view.update.bind(s.view);
  s.view.update = (dt) => {
    const t0 = performance.now();
    g.step();
    orig(dt);
    times.push(performance.now() - t0);
  };
  await new Promise((res) => setTimeout(res, 3000));
  s.view.update = orig;
  times.sort((a, b) => a - b);
  return {
    frames: times.length,
    median: times[times.length >> 1],
    p95: times[Math.floor(times.length * 0.95)],
    enemies: g.enemies.length,
  };
});
console.log(JSON.stringify(r));
await browser.close();
