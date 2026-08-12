import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  // Playwright starts the backend itself and waits until `url` responds,
  // instead of relying on a backgrounded `npm start &` surviving between
  // CI steps (it often doesn't) plus a fixed `sleep`.
  webServer: {
    command: 'npm start',
    cwd: '../patientor/backend',
    url: 'http://localhost:3001/api/ping',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
