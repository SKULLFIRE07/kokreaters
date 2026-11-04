/**
 * Pause motion (DESIGN-SPEC v2 7.1, WCAG 2.2.2). The MotionToggle button sets html.motion-paused, persists
 * localStorage['kk-motion']='paused' (try/catch) and calls every registered onPause handler (marquee, stamp spin,
 * emulsion, hub packets, magnetic dots, flap board). Scroll- and user-driven motion is never disabled.
 * `isPaused()` also folds in document.hidden so loops stop in background tabs.
 */
const html = document.documentElement;
const KEY = 'kk-motion';
const handlers = new Set<(paused: boolean) => void>();

function read(): boolean { try { return localStorage.getItem(KEY) === 'paused'; } catch { return false; } }
function write(p: boolean) { try { if (p) localStorage.setItem(KEY, 'paused'); else localStorage.removeItem(KEY); } catch { /* private mode */ } }

let userPaused = read();
if (userPaused) html.classList.add('motion-paused');

export const isUserPaused = () => userPaused;
export const isPaused = () => userPaused || document.hidden;

function emit() { const p = isPaused(); handlers.forEach((cb) => { try { cb(p); } catch (e) { console.warn('[pause]', e); } }); }

export function onPause(cb: (paused: boolean) => void): () => void {
  handlers.add(cb);
  return () => handlers.delete(cb);
}

export function setPaused(p: boolean): void {
  userPaused = p;
  html.classList.toggle('motion-paused', p);
  write(p);
  syncButtons();
  emit();
}

function syncButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(userPaused));
    const label = b.querySelector<HTMLElement>('[data-motion-label]');
    if (label) label.textContent = userPaused ? (b.dataset.labelPlay ?? 'Play motion') : (b.dataset.labelPause ?? 'Pause motion');
  });
}

let wired = false;
export function initPause(): void {
  if (wired) return;
  wired = true;
  syncButtons();
  document.addEventListener('click', (e) => {
    const b = (e.target as Element | null)?.closest?.('[data-motion-toggle]');
    if (b) setPaused(!userPaused);
  });
  document.addEventListener('visibilitychange', emit);
}
