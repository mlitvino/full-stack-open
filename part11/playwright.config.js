import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e-tests',
  webServer: {
    command: 'npm run start-prod',
    url: 'http://localhost:5001',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5001/',
  },
})
