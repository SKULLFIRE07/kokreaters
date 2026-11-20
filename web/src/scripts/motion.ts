/**
 * v4 "Delft" motion (BUILD-BRIEF, motion policy). Depth and polish, never reveals: nothing is hidden waiting for scroll.
 * Loaded on every page by site.ts. GSAP + ScrollTrigger + Lenis are imported dynamically (their own chunk) once the
 * page is idle, so the first paint never waits. `prefers-reduced-motion: reduce` → this module does nothing at all.
 *
 * Page markup only adds hooks (motion.css holds the CSS half of each):
 *   data-gsap="parallax"    photo frame (overflow hidden): its img/picture sits at scale 1.12 (CSS) and drifts ±5 %
 *                           yPercent with the scroll (scrubbed; GSAP tweens --kk-py, CSS maps it to `translate`)
 *   data-gsap="kenburns"    hero photo frame: the image settles 1.08 → 1 over 1.6 s on load (CSS, from first paint),
 *                           then drifts down gently while the hero scrolls away (always covered, no edge shows)
 *   data-gsap="rule"        decorative line: scaleX 0 → 1 from the left when it enters (GSAP sets the start; no CSS hold)
 *   data-gsap="count"       no-op since pack 3 (lead decision 1: no counting animation on any figure; the brief's bug 2
 *                           was counters running through wrong grammar). Figures render in their final form.
 *   data-gsap="lift"        card / tile: a small scrubbed translateY (0 → −14 px) while it crosses the viewport (--kk-lift)
 *   data-gsap="hero-title"  home H1: lines (.ln > span) rise inside their mask once on load. Pure CSS (motion.css),
 *                           so it starts at 0 ms, not when this chunk arrives.
 * Lenis smooth scroll: fine pointers only. It is never stopped for the mobile menu (that would clip <html> and lose
 * the scroll position); while html.menu-open it simply ignores input, and site.ts keeps its body-fixed scroll lock.
 * Transforms are applied through CSS custom properties / individual transform properties (`translate`, `scale`) so
 * they compose with the CSS hover zooms (`transform`) instead of overwriting them.
 */

const html = document.documentElement;
const mq = (q: string) => window.matchMedia(q);

type Gsap = typeof import('gsap').gsap;
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger;

const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(s) as NodeListOf<T>);

async function load() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

async function initLenis(gsap: Gsap, ScrollTrigger: ST) {
  if (!mq('(hover: hover) and (pointer: fine)').matches) return;
  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    autoRaf: false,
    anchors: { offset: -88 },
    // the menu, chat, mega-menu panels and anything marked data-lenis-prevent scroll natively
    prevent: (node: HTMLElement) => !!node.closest?.('#mobile-menu, [data-chat-panel], .kc-body, [role="dialog"], [data-lenis-prevent]'),
    // while the mobile menu holds its body-fixed lock, Lenis ignores input (it is never stopped: see header comment)
    virtualScroll: () => !html.classList.contains('menu-open'),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __kkLenis?: unknown }).__kkLenis = lenis;
}

function initParallax(gsap: Gsap) {
  for (const frame of $$('[data-gsap="parallax"]')) {
    gsap.fromTo(frame, { '--kk-py': '-5%' }, {
      '--kk-py': '5%', ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  }
  // hero: drift down at a quarter of the scroll speed while it leaves (the gap stays above the viewport)
  for (const frame of $$('[data-gsap="kenburns"]')) {
    gsap.fromTo(frame, { '--kk-py': '0%' }, {
      '--kk-py': '18%', ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: 0.4 },
    });
  }
}

function initLift(gsap: Gsap) {
  if (!mq('(min-width: 600px)').matches) return;   // phones: cards stack; a drift there just feels loose
  for (const el of $$('[data-gsap="lift"]')) {
    gsap.fromTo(el, { '--kk-lift': '0px' }, {
      '--kk-lift': '-14px', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  }
}

function initRules(gsap: Gsap) {
  const rules = $$('[data-gsap="rule"]');
  if (!rules.length) return;
  gsap.set(rules, { scaleX: 0, transformOrigin: '0% 50%' });
  for (const el of rules) {
    gsap.to(el, {
      scaleX: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  }
}

let started = false;
export function initMotion() {
  if (started) return;
  started = true;
  if (mq('(prefers-reduced-motion: reduce)').matches) return;
  const hasHooks = !!document.querySelector('[data-gsap]:not([data-gsap="count"])');
  const fine = mq('(hover: hover) and (pointer: fine)').matches;
  if (!hasHooks && !fine) return;

  const go = async () => {
    try {
      const { gsap, ScrollTrigger } = await load();
      await initLenis(gsap, ScrollTrigger);
      initParallax(gsap);
      initLift(gsap);
      initRules(gsap);
      html.classList.add('kk-gsap');
      // images and fonts change heights after load: re-measure once things settle
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    } catch {
      html.classList.add('kk-gsap-failed');   // nothing was hidden, so nothing needs releasing
    }
  };
  // after first paint and the browser's own work; never later than 1.2 s
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (idle) idle(() => { void go(); }, { timeout: 1200 });
  else window.setTimeout(() => { void go(); }, 200);
}
