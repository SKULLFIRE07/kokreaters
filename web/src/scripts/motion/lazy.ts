/** whenNear (DESIGN-SPEC v2 8.2): run `load` once when `el` comes within `margin` of the viewport. Every bencho/FX
 * module is loaded through this, so its chunk never joins the initial graph. Returns a disposer. */
export function whenNear(el: Element, load: () => Promise<unknown> | unknown, margin = '50% 0px'): () => void {
  let done = false;
  const run = () => {
    if (done) return; done = true;
    try { const r = load(); if (r && typeof (r as Promise<unknown>).catch === 'function') (r as Promise<unknown>).catch((e) => console.warn('[whenNear]', e)); }
    catch (e) { console.warn('[whenNear]', e); }
  };
  if (!('IntersectionObserver' in window)) { run(); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((x) => x.isIntersecting)) { io.disconnect(); run(); }
  }, { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}

/** Observe on/off-screen state (loops stop off-screen). Returns a disposer. */
export function onScreen(el: Element, cb: (visible: boolean) => void, margin = '0px'): () => void {
  if (!('IntersectionObserver' in window)) { cb(true); return () => {}; }
  const io = new IntersectionObserver((entries) => entries.forEach((x) => cb(x.isIntersecting)), { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}
