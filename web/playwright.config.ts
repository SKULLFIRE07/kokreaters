/**
 * Playwright config (v3, research/v3/infra.md §1.11).
 *
 * Tests a BUILT site. Build first, in the mode you want to test (the Vercel review link is preview):
 *   npm run build:preview && node scripts/csp-hash.mjs --dist-only && npx playwright test
 * The webServer serves that dist with `astro preview` on 127.0.0.1:4330, away from the shared dev server (4321).
 * Routes come from dist/**.html and the mode from dist/build-info.json, so nothing here lists pages.
 *   KK_DIST=<dir>       test another build directory (default ./dist)
 *   KK_PORT=<port>      preview port (default 4330)
 *   KK_BASE_URL=<url>   test an already-running server (no webServer), e.g. the deployed preview link:
 *                       KK_BASE_URL=https://kokreaters-vercel.vercel.app npx playwright test tests/smoke.spec.ts tests/review-marks.spec.ts
 *   KK_SHOTS=1          write reduced-motion screenshots to research/v3/shots/tests/
 * Projects: `chromium` (Desktop Chrome; viewports set per spec) runs everything except iphone.spec.ts; `iphone`
 * (WebKit, iPhone 13) runs iphone.spec.ts. Browser: bundled Chromium, else /usr/bin/google-chrome.
 */
import { defineConfig, devices, chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

const PORT = Number(process.env.KK_PORT ?? 4330);
const BASE = process.env.KK_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const DIST = process.env.KK_DIST ?? 'dist';

let bundled = false;
try { bundled = existsSync(chromium.executablePath()); } catch { bundled = false; }
const chrome = bundled ? {} : { channel: 'chrome' as const };

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
  },
  projects: [
    { name: 'chromium', testIgnore: /iphone\.spec\.ts$/, use: { ...devices['Desktop Chrome'], ...chrome } },
    { name: 'iphone', testMatch: /iphone\.spec\.ts$/, use: { ...devices['iPhone 13'] } },
  ],
  webServer: process.env.KK_BASE_URL ? undefined : {
    command: `node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port ${PORT} --ignore-lock --outDir ${DIST}`,
    url: `${BASE}/robots.txt`,
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
