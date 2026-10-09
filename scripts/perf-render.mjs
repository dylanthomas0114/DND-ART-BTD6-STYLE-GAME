// Rough render stress: demo map with many enemies; prints FPS (software GL in CI ≠ phone GPU).
import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 915, height: 412 }, deviceScaleFactor: 2 });
await page.goto(`${process.argv[2] ?? 'http://localhost:4173/'}?demo&round=59&speed=1&towers=0`);
await page.waitForFunction(() => window.__game?.ready && window.__game.game.enemies.length > 150, null, {
  timeout: 60000,
});
await page.waitForTimeout(3000);
const stats = await page.evaluate(() => window.__game.stats());
console.log(JSON.stringify(stats));
await page.screenshot({ path: 'test-results/perf-stress.png' });
await browser.close();
