/**
 * Playwright config (W3-tests, DESIGN-SPEC 9 + 10).
 *
 * By default it serves the built site with `astro preview` on 127.0.0.1:4413 (4400 + unit index 13, so it never
 * collides with the 4321 dev server or the 4322 preview the orchestrator leaves running).
 *   KK_DIST=<dir>       test another build directory (default ./dist); `npm run build` must have run
 *   KK_PORT=<port>      preview port (default 4413)
 *   KK_BASE_URL=<url>   test an already-running server instead (no webServer is started)
 *   KK_SHOTS=0          skip writing screenshots to research/shots/build/
 * Browser: Playwright's bundled Chromium when it is downloaded, otherwise /usr/bin/google-chrome (channel 'chrome').
 */
import { defineConfig, devices, chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

const PORT = Number(process.env.KK_PORT ?? 4413);
const BASE = process.env.KK_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const DIST = process.env.KK_DIST ?? 'dist';

let bundled = false;
try { bundled = existsSync(chromium.executablePath()); } catch { bundled = false; }

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL: BASE,
    locale: 'en-GB',
    timezoneId: 'Europe/Amsterdam',
    trace: 'retain-on-failure',
    ...(bundled ? {} : { channel: 'chrome' }),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], ...(bundled ? {} : { channel: 'chrome' }) } }],
  webServer: process.env.KK_BASE_URL ? undefined : {
    command: `node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port ${PORT} --ignore-lock --outDir ${DIST}`,
    url: `${BASE}/robots.txt`,
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
