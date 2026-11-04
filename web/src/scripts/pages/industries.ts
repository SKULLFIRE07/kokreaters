/**
 * /industries (DESIGN-SPEC 6.6). An IntersectionObserver marks the sector in view with
 * aria-current="true" in the sector index and moves the 2px Sapphire bar (CSS transitions `top`
 * over 200ms). Runs in every motion mode: it is navigation state, not decoration.
 */
import type { MotionContext } from '../motion/context';

export default function initIndustries(_ctx: MotionContext): () => void {
  const nav = document.querySelector<HTMLElement>('[data-sector-index]');
  const bar = nav?.querySelector<HTMLElement>('[data-sector-bar]');
  const links = new Map<string, HTMLAnchorElement>();
  nav?.querySelectorAll<HTMLAnchorElement>('[data-sector-link]').forEach((a) => links.set(a.dataset.sectorLink ?? '', a));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sector]'));
  if (!nav || !sections.length || !('IntersectionObserver' in window)) return () => {};

  let currentId = '';
  const setCurrent = (id: string) => {
    if (id === currentId) return;
    currentId = id;
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    const a = links.get(id);
    if (!a) { nav.classList.remove('has-current'); return; }
    if (bar) {
      bar.style.top = `${a.offsetTop}px`;
      bar.style.height = `${a.offsetHeight}px`;
      nav.classList.add('has-current');
    }
  };

  // The observer (band 40–45% down the viewport) says when a sector crosses the reading line; the
  // current sector is then the last one whose top is above that line, so short sectors still register.
  const pick = () => {
    const line = window.innerHeight * 0.45;
    let id = '';
    for (const s of sections) { if (s.getBoundingClientRect().top <= line) id = s.dataset.sector ?? ''; else break; }
    // Above the first sector (back at the top of the page) nothing is current.
    setCurrent(id);
  };
  const io = new IntersectionObserver(pick, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach((s) => io.observe(s));

  // Re-place the bar if the layout changes (font swap, resize).
  const onResize = () => { const id = currentId; currentId = ''; if (id) setCurrent(id); pick(); };
  window.addEventListener('resize', onResize, { passive: true });

  return () => { io.disconnect(); window.removeEventListener('resize', onResize); };
}
