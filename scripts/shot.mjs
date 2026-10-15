// Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [waitExpr] [dpr]
import { chromium } from '@playwright/test';

const [
  url,
  out,
  w = '1600',
  h = '1400',
  waitExpr = 'window.__gallery?.ready || window.__game?.ready || window.__app?.ready',
  dpr = '1',
] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: +dpr,
  isMobile: +dpr > 1,
  hasTouch: +dpr > 1,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url);
try {
  await page.waitForFunction(waitExpr, null, { timeout: 30000 });
} catch {
  console.log('TIMEOUT', errors);
  await page.screenshot({ path: out });
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(800);
await page.screenshot({ path: out });
if (errors.length) console.log('ERRORS', errors);
await browser.close();
