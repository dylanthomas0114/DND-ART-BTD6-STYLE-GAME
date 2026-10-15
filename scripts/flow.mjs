// Clicks through the main flow at phone size and saves screenshots to the given folder.
import { chromium } from '@playwright/test';

const [base = 'http://localhost:5173/', outDir = '/tmp/claude-0/shots'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({
  viewport: { width: 915, height: 412 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForFunction(() => window.__app?.ready);
await page.getByText('Play', { exact: true }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/maps.png` });
await page.locator('.map-card').first().getByText('Apprentice').click();
await page.waitForFunction(() => window.__game?.ready);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/game0.png` });
// drag a ranger onto the map
const card = page.locator('[data-tower="ranger"]');
const box = await card.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
const target = await page.evaluate(() => {
  const g = window.__game.game;
  const v = window.__game.session.view;
  // find a legal spot near 12% of the path
  const p = g.paths[0].pointAt(g.paths[0].length * 0.1, { x: 0, y: 0 });
  for (let r = 40; r < 200; r += 8)
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (g.canPlace('ranger', x, y).ok)
        return { x: x * v.layout.scale + v.layout.x, y: y * v.layout.scale + v.layout.y };
    }
  return null;
});
await page.mouse.move(target.x, target.y, { steps: 8 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/game-drag.png` });
await page.mouse.up();
await page.waitForTimeout(400);
// start round
await page.locator('[data-testid="go-btn"]').click();
await page.waitForTimeout(4000);
await page.screenshot({ path: `${outDir}/game-round.png` });
// select the tower
await page.mouse.click(target.x, target.y - 10);
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/game-upgrade.png` });
console.log(JSON.stringify({ errors, towers: await page.evaluate(() => window.__game.game.towers.length) }));
await browser.close();
