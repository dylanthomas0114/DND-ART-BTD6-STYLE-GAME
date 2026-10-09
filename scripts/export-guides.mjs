// Exports map layout guides to art/guides/<id>.png (needs the dev server on :5173).
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('art/guides', { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 800, height: 400 } });
for (const id of ['glade', 'crypt', 'pass']) {
  await page.goto(`http://localhost:5173/?mapguide=${id}`);
  const url = await page
    .waitForFunction(() => window.__mapguide?.url, null, { timeout: 30000 })
    .then((h) => h.jsonValue());
  writeFileSync(`art/guides/${id}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', id);
}
await browser.close();
