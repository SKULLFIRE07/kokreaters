/**
 * Build marker for tooling (infra.md §1.1, §4.4): which site mode this dist was built in. Read by tests/helpers.ts and
 * `node scripts/og.mjs check`, so robots/draft expectations follow the build, not a guess from robots.txt.
 * Endpoints are not pages: not in the sitemap, not in llms.txt. Contains no secrets (mode flags only).
 */
import type { APIRoute } from 'astro';
import { mode, indexable, includeDrafts, showConfirm, showPendingConsent } from '@/lib/mode';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ version: 'v5', mode, indexable, includeDrafts, showConfirm, showPendingConsent }) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
