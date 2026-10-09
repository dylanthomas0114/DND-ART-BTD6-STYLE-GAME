import { expect, test } from '@playwright/test';

test('boots without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await expect(page.locator('#app')).not.toBeEmpty();
  expect(errors).toEqual([]);
});
