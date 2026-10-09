import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    __app?: { ready: boolean };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __game?: any;
  }
}

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

test('boots to the main menu without errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await page.waitForFunction(() => window.__app?.ready);
  await expect(page.getByText('Play', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/01-menu.png' });
  expect(errors).toEqual([]);
});

test('place a tower, start a round, upgrade, see pops', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__app?.ready);
  await page.getByText('Play', { exact: true }).click();
  await page.locator('.map-card').first().getByText('Apprentice').click();
  await page.waitForFunction(() => window.__game?.ready);
  await page.screenshot({ path: 'test-results/02-game.png' });

  // drag a Ranger from the shop to a legal spot near the road
  const card = page.locator('[data-tower="ranger"]');
  const box = (await card.boundingBox())!;
  const target = await page.evaluate(() => {
    const g = window.__game.game;
    const v = window.__game.session.view;
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
  expect(target).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(target!.x, target!.y, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.__game.game.towers.length)).toBe(1);

  await page.locator('[data-testid="go-btn"]').click();
  await expect
    .poll(() => page.evaluate(() => window.__game.game.popCount), { timeout: 30_000 })
    .toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/03-round.png' });

  // select the tower and buy the first upgrade
  await page.mouse.click(target!.x, target!.y - 10);
  await expect(page.locator('.upg')).toBeVisible();
  await page.evaluate(() => (window.__game.game.cash += 1000));
  await page.locator('.path[data-path="0"] .buy').click();
  await expect.poll(() => page.evaluate(() => window.__game.game.towers[0].tiers[0])).toBe(1);
  await page.screenshot({ path: 'test-results/04-upgrade.png' });
  expect(errors).toEqual([]);
});
