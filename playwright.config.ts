import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['Pixel 7'],
    viewport: { width: 915, height: 412 },
    isMobile: true,
    hasTouch: true,
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    // Containers with a preinstalled Chromium (see CLAUDE.md) set PW_CHROMIUM_PATH.
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
