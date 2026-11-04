import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { createLenis } from './lenis';
import { initReveals, revealAllNow } from './reveal';
import { initDraws } from './draw';
import { initCounts } from './countup';
import { initTextRise } from '../bencho/text-rise';
import { initSweep } from '../bencho/sweep-button';
import { initNotes, drawAllNow } from './notes';
import { initMagnetic } from './magnetic';
import { initMarquees } from './marquee';
import { initRails } from './rail';
import { initScrubWords } from './scrub-words';
import { initParallax } from './parallax';
import { initCursor } from './cursor';
import { initPause, isPaused, onPause } from './pause';
import { whenNear } from './lazy';
import type { MotionContext } from './context';
import { initConsent } from '../consent';
import { chromeNotes } from '@/data/notes/chrome';

/**
 * The one motion bundle (DESIGN-SPEC 6.2, v2 8). Boots Lenis and the shared recipes (R1–R11, R13), then the page
 * module for this page's data-page. Every effect beyond the shared recipes is a lazy chunk loaded through whenNear.
 * Reduced motion / failure: nothing that hides content runs; the server-rendered final state stays.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
const html = document.documentElement;
type PageModule = { default: (ctx: MotionContext) => void | (() => void) };
const pageModules = import.meta.glob<PageModule>('../pages/*.ts');

const isFailed = () => html.classList.contains('motion-failed');

/** Lazy FOUNDATION blocks: each is its own chunk, loaded only near the viewport. */
function initLazyBlocks(ctx: MotionContext): void {
  if (!ctx.reduced) {
    document.querySelectorAll<HTMLElement>('[data-flap-board]').forEach((el) => {
      whenNear(el, async () => (await import('../bencho/flap-board')).default(el));
    });
    document.querySelectorAll<HTMLElement>('[data-magnetic-dots]').forEach((el) => {
      const canvas = el.querySelector<HTMLCanvasElement>('canvas');
      if (canvas) whenNear(el, async () => (await import('../bencho/magnetic-dots')).default(canvas));
    });
  }
  if (ctx.fine) {
    document.querySelectorAll<HTMLElement>('[data-edge-light]').forEach((el) => {
      whenNear(el, async () => (await import('../bencho/edge-light')).default(el.parentElement ?? document));
    });
  }
}

/** R13 header hide on scroll (7.2): below the hero, scrolling down hides the bar; any upward scroll, focus inside,
 * an open panel/menu or reduced motion keeps it shown. The outer <header> keeps its height in flow (no CLS). */
function initHeaderHide(ctx: MotionContext): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header || ctx.reduced) return;
  let lastY = window.scrollY; let ticking = false;
  const threshold = () => {
    const hero = document.querySelector<HTMLElement>('main > section, main > div > section');
    const bottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 0;
    return Math.max(600, bottom + 200);
  };
  let th = threshold();
  window.addEventListener('resize', () => { th = threshold(); }, { passive: true });
  const update = () => {
    ticking = false;
    const y = window.scrollY, down = y > lastY + 2, up = y < lastY - 2;
    const keep = header.matches(':focus-within') || html.classList.contains('menu-open') || !!header.querySelector('[aria-expanded="true"]') || html.classList.contains('header-forced');
    if (keep || up || y < th) header.classList.remove('is-hidden');
    else if (down) header.classList.add('is-hidden');
    lastY = y;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

async function boot() {
  // Header, expertise panel and mobile menu boot from their own entry (scripts/chrome.ts), before this bundle.
  try { initConsent(); } catch (e) { console.warn('[consent]', e); }
  initPause();

  const page = document.body.dataset.page ?? '';
  const motionOK = html.classList.contains('motion') && !isFailed();
  // SplitText measures lines, so wait for fonts, but never longer than 600 ms.
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]);

  const mm = gsap.matchMedia();
  const ctx: MotionContext = {
    gsap, ScrollTrigger, mm, lenis: null, reduced: !motionOK, page,
    isDesktop: window.matchMedia('(min-width: 1024px)').matches,
    fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    get paused() { return isPaused(); },
    onPause, whenNear,
  };

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
    const { motion } = c.conditions as { motion: boolean };
    // The 3 s timer may have fired before boot: then nothing that hides content runs.
    ctx.reduced = !motion || isFailed() || !html.classList.contains('motion');
    if (!ctx.reduced) {
      ctx.lenis = createLenis();
      initTextRise(ctx); initReveals(ctx); initDraws(ctx); initCounts(ctx); initNotes(ctx);
      initMarquees(ctx); initScrubWords(ctx); initParallax(ctx); initMagnetic(ctx);
      initCursor(ctx, chromeNotes.cursor);
    } else {
      html.classList.remove('motion');           // un-hide anything gated
    }
    return () => { ctx.lenis?.destroy(); ctx.lenis = null; };
  });
  initRails(ctx);            // native rails work in every mode; pinning only with motion
  initSweep();
  initLazyBlocks(ctx);
  initHeaderHide(ctx);

  const loader = pageModules[`../pages/${pageFile(page)}.ts`];
  if (loader) {
    try { (await loader()).default(ctx); }       // the page module decides its own reduced branch
    catch (e) { console.warn('[motion] page module failed', e); if (!ctx.reduced) { revealAllNow(); drawAllNow(); } }
  }

  // The timer fired while we were booting: GSAP has set start states the CSS no longer
  // guards, so finish everything rather than leave content waiting on scroll.
  if (!ctx.reduced && isFailed()) { revealAllNow(); drawAllNow(); }
  html.classList.add('motion-booted');
  ScrollTrigger.refresh();
}

function pageFile(p: string) {
  return ({ home: 'home', pillar: 'expertise', expertise: 'expertise', industries: 'industries', approach: 'approach',
    impact: 'impact', insights: 'insights', article: 'article', about: 'about', contact: 'contact', notfound: 'notfound' } as Record<string, string>)[p] ?? '__none';
}

function start() {
  boot().catch((e) => {
    console.warn('[motion] boot failed', e);
    revealAllNow();
    html.classList.add('motion-booted');
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
