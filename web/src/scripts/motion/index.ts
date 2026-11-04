import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { createLenis } from './lenis';
import { initReveals, revealAllNow } from './reveal';
import { initDraws } from './draw';
import { initCounts } from './countup';
import { initSplits } from './split';
import type { MotionContext } from './context';
import { initConsent } from '../consent';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
const html = document.documentElement;
type PageModule = { default: (ctx: MotionContext) => void | (() => void) };
const pageModules = import.meta.glob<PageModule>('../pages/*.ts');

const isFailed = () => html.classList.contains('motion-failed');

async function boot() {
  // Header, expertise panel and mobile menu boot from their own entry (scripts/chrome.ts), before this bundle.
  try { initConsent(); } catch (e) { console.warn('[consent]', e); }

  const page = document.body.dataset.page ?? '';
  const motionOK = html.classList.contains('motion') && !isFailed();
  // SplitText measures lines, so wait for fonts, but never longer than 600 ms.
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]);

  const mm = gsap.matchMedia();
  const ctx: MotionContext = {
    gsap, ScrollTrigger, mm, lenis: null, reduced: !motionOK, page,
    isDesktop: window.matchMedia('(min-width: 1024px)').matches,
  };

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
    const { motion } = c.conditions as { motion: boolean };
    // The 3 s timer may have fired before boot: then nothing that hides content runs.
    ctx.reduced = !motion || isFailed() || !html.classList.contains('motion');
    if (!ctx.reduced) {
      ctx.lenis = createLenis();
      initSplits(ctx); initReveals(ctx); initDraws(ctx); initCounts(ctx);
    } else {
      html.classList.remove('motion');           // un-hide anything gated
    }
    return () => { ctx.lenis?.destroy(); ctx.lenis = null; };
  });

  const loader = pageModules[`../pages/${pageFile(page)}.ts`];
  if (loader) {
    try { (await loader()).default(ctx); }       // the page module decides its own reduced branch
    catch (e) { console.warn('[motion] page module failed', e); if (!ctx.reduced) revealAllNow(); }
  }

  // The timer fired while we were booting: GSAP has set start states the CSS no longer
  // guards, so finish everything rather than leave content waiting on scroll.
  if (!ctx.reduced && isFailed()) revealAllNow();
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
