import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __gallery?: any;
  }
}

test('every upgrade visibly changes the hero (pixel diff per tier)', async ({ page }) => {
  await page.goto('/?gallery');
  await page.waitForFunction(() => window.__gallery?.ready);
  await page.screenshot({ path: 'test-results/gallery-showcase.png' });
  const diffs: { id: string; path: number; tier: number; diff: number }[] = await page.evaluate(() =>
    window.__gallery.tierDiff(),
  );
  expect(diffs).toHaveLength(9 * 3 * 5);
  const tooSubtle = diffs.filter((d) => d.diff < 0.02);
  expect(tooSubtle, JSON.stringify(tooSubtle)).toEqual([]);
});

test('combined paths show both paths gear (5-2-0, 2-0-5, 0-5-2 screenshots)', async ({ page }) => {
  for (const id of ['fighter', 'ranger', 'wizard']) {
    await page.goto(`/?gallery=${id}`);
    await page.waitForFunction(() => window.__gallery?.ready);
    await page.screenshot({ path: `test-results/gallery-${id}-all-combos.png` });
  }
});
