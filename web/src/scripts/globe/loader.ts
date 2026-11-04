/**
 * The About globe gate and lazy loader (DESIGN-SPEC 6.8). W3-globe.
 * Called from pages/about.ts as `initGlobe(ctx)`. three.js is only downloaded when every gate holds:
 * motion allowed (and not failed), ≥ 1024px, ≥ 4 cores, WebGL2, and no Save-Data. Otherwise the
 * server-rendered static SVG simply stays. Mobile, reduced motion and no-JS never fetch three.js.
 *
 * Lifecycle:
 * - mount: an IntersectionObserver (rootMargin 150%) on [data-globe], then requestIdleCallback
 *   (200 ms timeout fallback), then `import('./scene')` and `mountGlobe()`.
 * - unmount: when the section is more than 2 viewports away (IO rootMargin 200%), on `pagehide`, and when
 *   the matchMedia condition flips (reduced motion turned on, or the window drops below 1024px).
 *   Re-entry remounts; a bfcache restore (`pageshow` persisted) re-arms the observers.
 * State hook for tests: [data-globe] gets data-globe-state = static | loading | mounted.
 */
import type { MotionContext } from '../motion/context';
import type { GlobeHandle } from './scene';

const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();   // release the probe context straight away
    return true;
  } catch {
    return false;
  }
}

function deviceGate(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if ((nav.hardwareConcurrency ?? 0) < 4) return false;
  if (nav.connection?.saveData === true) return false;
  return hasWebGL2();
}

function whenIdle(fn: () => void): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 1500 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

export function initGlobe(ctx: MotionContext): void {
  const html = document.documentElement;
  const mountEl = document.querySelector<HTMLElement>('[data-globe]');
  const section = mountEl?.closest<HTMLElement>('[data-globe-section]') ?? null;
  if (!mountEl || !section) return;
  mountEl.dataset.globeState = 'static';

  const motionOK = () => !ctx.reduced && html.classList.contains('motion') && !html.classList.contains('motion-failed');
  if (!motionOK() || !window.matchMedia(QUERY).matches) return;
  if (!deviceGate()) return;

  ctx.mm.add(QUERY, () => {
    if (!motionOK()) return;
    let handle: GlobeHandle | null = null;
    let pending = false;
    let cancelIdle: (() => void) | null = null;
    let alive = true;

    const unmount = () => {
      cancelIdle?.(); cancelIdle = null;
      pending = false;
      if (handle) { handle.destroy(); handle = null; }
      mountEl.dataset.globeState = 'static';
    };

    const mount = () => {
      if (handle || pending || !alive || !motionOK()) return;
      pending = true;
      mountEl.dataset.globeState = 'loading';
      cancelIdle = whenIdle(async () => {
        cancelIdle = null;
        try {
          const { mountGlobe } = await import('./scene');
          if (!alive || !pending) return;              // torn down while loading
          handle = mountGlobe({ section, mount: mountEl, gsap: ctx.gsap, onLost: unmount });
          mountEl.dataset.globeState = handle ? 'mounted' : 'static';
        } catch (e) {
          console.warn('[globe] static fallback', e);
          handle = null;
          mountEl.dataset.globeState = 'static';
        } finally {
          pending = false;
        }
      });
    };

    // Near: load and mount. Far (beyond two viewports): release the WebGL context.
    const near = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) mount();
    }, { rootMargin: '150% 0px' });
    const far = new IntersectionObserver((entries) => {
      if (entries.every((e) => !e.isIntersecting)) unmount();
    }, { rootMargin: '200% 0px' });
    const arm = () => { near.unobserve(mountEl); far.unobserve(section); near.observe(mountEl); far.observe(section); };
    arm();

    const onHide = () => unmount();
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) arm(); };
    window.addEventListener('pagehide', onHide);
    window.addEventListener('pageshow', onShow);

    return () => {
      alive = false;
      near.disconnect(); far.disconnect();
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('pageshow', onShow);
      unmount();
    };
  });
}
