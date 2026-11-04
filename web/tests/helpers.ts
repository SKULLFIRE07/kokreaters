/**
 * Shared helpers for the W3-tests suites. Routes are discovered from the build output, so a new page is tested
 * without editing a list. The build directory is KK_DIST (default ./dist), the same one playwright.config.ts serves.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

export const WEB = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const DIST = resolve(WEB, process.env.KK_DIST ?? 'dist');
export const SHOTS = resolve(WEB, '..', 'research', 'shots', 'build');
export const SITE = 'https://kokreaters.com';
export const shotsOn = process.env.KK_SHOTS !== '0';

export interface Route { path: string; file: string; name: string }

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (n !== '_astro') walk(p, out); } else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Every built page except 404.html, as clean URLs (build.format 'file', trailingSlash 'never'). */
export const routes: Route[] = walk(DIST)
  .map((abs) => relative(DIST, abs).split(sep).join('/'))
  .filter((rel) => rel !== '404.html')
  .sort()
  .map((rel) => {
    const path = rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '');
    return { path, file: rel, name: path === '/' ? 'home' : path.slice(1).replace(/\//g, '-') };
  });

if (!routes.length) throw new Error(`No built pages in ${DIST}. Run "npm run build" first (or set KK_DIST).`);

export const mode: 'staging' | 'production' =
  /Disallow:\s*\/\s*$/m.test(existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '') ? 'staging' : 'production';

export const readHtml = (file: string) => readFileSync(join(DIST, file), 'utf8');

export function shotPath(name: string) { mkdirSync(SHOTS, { recursive: true }); return join(SHOTS, name); }

/** The site's own CSP, from the generated dist/_headers (null when csp-hash.mjs has not run). */
export function builtCsp(): string | null {
  const f = join(DIST, '_headers');
  if (!existsSync(f)) return null;
  return (readFileSync(f, 'utf8').match(/^\s*Content-Security-Policy:\s*(.+)$/m) ?? [])[1]?.trim() ?? null;
}

/** Waits until motion/index.ts has booted (or motion is off), then lets the hero timeline finish (≈2.1 s). */
export async function settle(page: Page, extraMs = 400) {
  await page.waitForFunction(() => {
    const h = document.documentElement;
    return h.classList.contains('motion-booted') || !h.classList.contains('js') || h.classList.contains('motion-failed');
  }, undefined, { timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(extraMs);
}

/** Scrolls the whole page in steps (through Lenis when it exists) so every once-only reveal fires, then returns to the top. */
export async function scrollThrough(page: Page, stepMs = 70) {
  await page.evaluate(async (ms) => {
    const w = window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean; force?: boolean }) => void } };
    const go = (y: number) => { if (w.__lenis) w.__lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); };
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { go(y); await new Promise((r) => setTimeout(r, ms)); }
    go(document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 1200));
    go(0);
    await new Promise((r) => setTimeout(r, 300));
  }, stepMs);
}

/** Elements inside <main> that are rendered but invisible through opacity 0 or visibility hidden. */
export async function hiddenInMain(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    const main = document.querySelector('main');
    if (!main) return ['<main> missing'];
    const describe = (el: Element) => {
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const data = [...el.attributes].filter((a) => a.name.startsWith('data-')).map((a) => `[${a.name}${a.value ? `=${a.value.slice(0, 20)}` : ''}]`).slice(0, 2).join('');
      return `${el.tagName.toLowerCase()}${id}${cls}${data}`;
    };
    for (const el of main.querySelectorAll('*')) {
      if (el.closest('[hidden], template, dialog:not([open]), noscript')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      // honeypot-style fields that are deliberately removed for people (aria-hidden + off-screen) are not "content"
      if (el.closest('[aria-hidden="true"]') && (r.right < 0 || r.left > innerWidth)) continue;
      // empty decorative marks (an indicator bar with no current item) carry no content
      const media = 'img, svg, canvas, picture, video, input, select, textarea, button';
      if (!(el.textContent ?? '').trim() && !el.matches(media) && !el.querySelector(media)) continue;
      if (cs.opacity === '0') out.push(`${describe(el)} opacity:0`);
      else if (cs.visibility === 'hidden' && el.parentElement && getComputedStyle(el.parentElement).visibility !== 'hidden') out.push(`${describe(el)} visibility:hidden`);
    }
    return out;
  });
}
