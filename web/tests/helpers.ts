/**
 * Shared helpers for the v3 suites (research/v3/infra.md §1). Routes are discovered from the build output, so a new
 * page is tested without editing a list. The build directory is KK_DIST (default ./dist), the same one
 * playwright.config.ts serves; the build mode comes from dist/build-info.json (src/pages/build-info.json.ts).
 *
 * Global DOM contracts every spec relies on (REDESIGN-V3 §8.7):
 *   <html lang="en-GB" class="no-js"> → head script swaps to `js`; site.ts adds `motion-booted` (3 s fallback:
 *   `motion-failed`) · body[data-page] · one header.site-header · main#main[tabindex=-1] · one h1 (PageHero) ·
 *   a.skip-link first in <body> · footer#site-footer · [data-header-cta] · [data-menu-toggle] → #mobile-menu
 *   (.m-menu__link) · [data-nav-toggle] → #mega-expertise / #menu-industries.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

export const WEB = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const DIST = resolve(WEB, process.env.KK_DIST ?? 'dist');
export const SHOTS = resolve(WEB, '..', 'research', 'v3', 'shots', 'tests');
export const SITE = 'https://kokreaters.com';
export const shotsOn = process.env.KK_SHOTS === '1';

export interface Route { path: string; file: string; name: string }

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (n !== '_astro') walk(p, out); } else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Every built page except 404.html and the staging-only styleguide, as clean URLs (build.format 'file'). */
export const routes: Route[] = walk(DIST)
  .map((abs) => relative(DIST, abs).split(sep).join('/'))
  .filter((rel) => rel !== '404.html' && rel !== 'styleguide.html')
  .sort()
  .map((rel) => {
    const path = rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '');
    return { path, file: rel, name: path === '/' ? 'home' : path.slice(1).replace(/\//g, '-') };
  });

if (!routes.length) throw new Error(`No built pages in ${DIST}. Run "npm run build:preview" first (or set KK_DIST).`);

export interface BuildInfo { mode: 'staging' | 'preview' | 'production'; indexable: boolean; includeDrafts: boolean; showConfirm: boolean; showPendingConsent: boolean }
const infoFile = join(DIST, 'build-info.json');
if (!existsSync(infoFile)) throw new Error(`${infoFile} is missing: rebuild (src/pages/build-info.json.ts writes it).`);
export const build: BuildInfo = JSON.parse(readFileSync(infoFile, 'utf8'));
export const mode = build.mode;
export const indexable = build.indexable;

export const readHtml = (file: string) => readFileSync(join(DIST, file), 'utf8');

/** Visible text of a built HTML file (scripts, styles, inline SVG and comments removed, entities decoded). */
export function htmlText(html: string): string {
  return decode(html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ');
}
export function decode(s: string): string {
  return s.replace(/&nbsp;|&#160;|&#xa0;/gi, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

export function shotPath(name: string) { mkdirSync(SHOTS, { recursive: true }); return join(SHOTS, name); }

/** The site's own CSP, from the generated dist/_headers (null when csp-hash.mjs has not run). */
export function builtCsp(): string | null {
  const f = join(DIST, '_headers');
  if (!existsSync(f)) return null;
  return (readFileSync(f, 'utf8').match(/^\s*Content-Security-Policy:\s*(.+)$/m) ?? [])[1]?.trim() ?? null;
}

/** Waits until site.ts has booted (html.motion-booted), JS is off, or the 3 s fallback fired; then `extraMs`. */
export async function settle(page: Page, extraMs = 400) {
  await page.waitForFunction(() => {
    const h = document.documentElement;
    return h.classList.contains('motion-booted') || !h.classList.contains('js') || h.classList.contains('motion-failed');
  }, undefined, { timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(extraMs);
}

/** Scrolls the whole page in steps so every once-only reveal fires (and lazy images load), then returns to the top. */
export async function scrollThrough(page: Page, stepMs = 70) {
  await page.evaluate(async (ms) => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, ms)); }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 1000));   // reveals: 800 ms blur-fade
    window.scrollTo(0, 0);
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
      // honeypot fields that are deliberately removed for people (aria-hidden + off-screen) are not "content"
      if (el.closest('[aria-hidden="true"]') && (r.right < 0 || r.left > innerWidth)) continue;
      // empty decorative marks carry no content
      const media = 'img, svg, canvas, picture, video, input, select, textarea, button';
      if (!(el.textContent ?? '').trim() && !el.matches(media) && !el.querySelector(media)) continue;
      if (cs.opacity === '0') out.push(`${describe(el)} opacity:0`);
      else if (cs.visibility === 'hidden' && el.parentElement && getComputedStyle(el.parentElement).visibility !== 'hidden') out.push(`${describe(el)} visibility:hidden`);
    }
    return out;
  });
}

/** Description of the focused element: is it visible, does it show a focus indicator, where does it live. */
export async function focusInfo(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1) || cs.boxShadow !== 'none';
    return {
      tag: el.tagName.toLowerCase(), href: el.getAttribute('href'), text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40),
      inHeader: !!el.closest('header'), inMenu: !!el.closest('#mobile-menu'), isToggle: el.hasAttribute('data-menu-toggle'),
      isCta: el.hasAttribute('data-header-cta'), ring,
    };
  });
}
