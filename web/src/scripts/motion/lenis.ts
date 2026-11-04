import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Smooth wheel scrolling (DESIGN-SPEC 6.3, v2 8.4: lerp 0.1, toys [data-toy] prevented). Never created under reduced motion.
 * Touch keeps native scroll. When the keyboard drives focus (Tab), Lenis stops so the
 * browser scrolls focused elements natively; the next pointer or wheel input restarts it.
 * Only a Tab-initiated stop is undone here, so chrome.ts can stop Lenis for the mobile menu.
 */
export function createLenis(): Lenis {
  const lenis = new Lenis({
    lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: false,
    anchors: { offset: -92 },
    prevent: (n: Element) => !!n.closest('[data-lenis-prevent], [data-toy]'),
  });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  let stoppedByKeyboard = false;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && !lenis.isStopped) { lenis.stop(); stoppedByKeyboard = true; }
  };
  const onPointer = () => {
    if (stoppedByKeyboard) { stoppedByKeyboard = false; lenis.start(); }
  };
  window.addEventListener('keydown', onKey, { capture: true });
  window.addEventListener('pointerdown', onPointer, { capture: true });
  window.addEventListener('wheel', onPointer, { capture: true, passive: true });

  window.__lenis = lenis;   // declared in src/env.d.ts; chrome.ts uses it to stop/start for the mobile menu

  // Arriving with a hash: land on the target at once, respecting the header offset.
  const hash = window.location.hash.slice(1);
  if (hash) {
    let target: HTMLElement | null = null;
    try { target = document.getElementById(decodeURIComponent(hash)); } catch { target = null; }
    if (target) lenis.scrollTo(target, { immediate: true, offset: -92 });
  }

  const destroy = lenis.destroy.bind(lenis);
  lenis.destroy = () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('keydown', onKey, { capture: true });
    window.removeEventListener('pointerdown', onPointer, { capture: true });
    window.removeEventListener('wheel', onPointer, { capture: true });
    if (window.__lenis === lenis) delete window.__lenis;
    destroy();
  };
  return lenis;
}
