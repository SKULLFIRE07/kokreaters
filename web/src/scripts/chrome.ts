/**
 * Global chrome behaviour (DESIGN-SPEC 3.2–3.4): header scroll state,
 * expertise disclosure panel and mobile menu. Runs in every motion mode.
 * Animation is CSS only (class toggles); JS only waits out the close duration.
 */

type LenisLike = { stop: () => void; start: () => void };

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const reducedQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const closeMs = () => (reducedQuery() ? 0 : 140);
const desktopQuery = window.matchMedia('(min-width: 1024px)');
const lenis = (): LenisLike | undefined => (window as unknown as { __lenis?: LenisLike }).__lenis;

function visibleFocusables(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && !el.closest('[hidden]') && el.getClientRects().length > 0,
  );
}

/* ── Header: .is-scrolled once scrollY > 8 ─────────────────────────── */
function initHeaderScroll(header: HTMLElement) {
  let ticking = false;
  const update = () => {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ── Expertise panel: a disclosure, not an ARIA menu ───────────────── */
function initExpertisePanel(onOpen: () => void): { close: (focus?: boolean) => void } | null {
  const btn = document.querySelector<HTMLButtonElement>('[data-xp-toggle]');
  const panel = document.getElementById('expertise-panel');
  const scope = btn?.closest<HTMLElement>('[data-xp-scope]') ?? null;
  if (!btn || !panel || !scope) return null;

  let isOpen = false;
  let openedBy: 'hover' | 'click' | 'keyboard' = 'click';
  let openedAt = 0;
  let hideTimer = 0, openTimer = 0, leaveTimer = 0;

  const open = (by: typeof openedBy) => {
    window.clearTimeout(hideTimer);
    if (isOpen) return;
    isOpen = true; openedBy = by; openedAt = performance.now();
    onOpen();
    panel.hidden = false;
    void panel.offsetWidth;            // commit the start state so the transition runs
    panel.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  };
  const close = (returnFocus = false) => {
    window.clearTimeout(openTimer);
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    hideTimer = window.setTimeout(() => { if (!isOpen) panel.hidden = true; }, closeMs());
    if (returnFocus) btn.focus();
  };

  btn.addEventListener('click', (e) => {
    const keyboard = e.detail === 0;
    if (isOpen && openedBy === 'hover' && !keyboard && performance.now() - openedAt < 600) {
      openedBy = 'click';              // a click right after hover-intent keeps it open
      return;
    }
    if (isOpen) close(false); else open(keyboard ? 'keyboard' : 'click');
  });

  // Hover intent on fine pointers only.
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const enter = () => {
    if (!fine.matches || !desktopQuery.matches) return;
    window.clearTimeout(leaveTimer);
    if (!isOpen) { window.clearTimeout(openTimer); openTimer = window.setTimeout(() => open('hover'), 120); }
  };
  const leave = () => {
    if (!fine.matches) return;
    window.clearTimeout(openTimer);
    if (isOpen && openedBy !== 'keyboard') {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => close(false), 200);
    }
  };
  for (const el of [btn, panel]) {
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
  }

  // Esc closes and returns focus.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(true); }
  });
  // Tab past the last link (or any focus move out) closes.
  scope.addEventListener('focusout', (e) => {
    const next = e.relatedTarget as Node | null;
    if (isOpen && next && !scope.contains(next)) close(false);
  });
  // Click outside closes.
  document.addEventListener('pointerdown', (e) => {
    if (isOpen && !scope.contains(e.target as Node)) close(false);
  });
  desktopQuery.addEventListener('change', (e) => { if (!e.matches) close(false); });

  // A tap that landed before this script ran (recorded by the inline head snippet) opens the menu now.
  const w = window as unknown as { __kkMenuPending?: boolean };
  if (w.__kkMenuPending) { w.__kkMenuPending = false; if (!desktopQuery.matches) open(); }

  return { close };
}

/* ── Mobile menu: full-screen Cloud panel, focus trapped, rest inert ─ */
function initMobileMenu(onOpen: () => void) {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  const label = btn.querySelector<HTMLElement>('[data-menu-label]');
  const labelOpen = btn.dataset.labelOpen ?? 'Menu';
  const labelClose = btn.dataset.labelClose ?? 'Close';
  const outside = () => Array.from(document.querySelectorAll<HTMLElement>('main, footer.site-footer, .skip-link'));

  let isOpen = false;
  let hideTimer = 0;

  const trap = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key !== 'Tab') return;
    const items = [btn, ...visibleFocusables(menu)];
    const first = items[0], last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = !!active && items.includes(active);
    if (e.shiftKey && (active === first || !inside)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !inside)) { e.preventDefault(); first.focus(); }
  };

  const open = () => {
    if (isOpen) return;
    window.clearTimeout(hideTimer);
    isOpen = true;
    onOpen();
    menu.hidden = false;
    void menu.offsetWidth;
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = labelClose;
    document.documentElement.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    lenis()?.stop();
    for (const el of outside()) el.inert = true;
    document.addEventListener('keydown', trap);
    const firstLink = menu.querySelector<HTMLElement>('a[href], button');
    firstLink?.focus();
  };
  const close = (returnFocus = false) => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = labelOpen;
    document.documentElement.classList.remove('menu-open');
    document.body.style.overflow = '';
    lenis()?.start();
    for (const el of outside()) el.inert = false;
    document.removeEventListener('keydown', trap);
    hideTimer = window.setTimeout(() => { if (!isOpen) menu.hidden = true; }, closeMs());
    if (returnFocus) btn.focus();
  };

  btn.addEventListener('click', () => (isOpen ? close(true) : open()));
  // In-page links (and any link) close the menu before navigating.
  menu.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a[href]');
    if (a) close(false);
  });
  desktopQuery.addEventListener('change', (e) => { if (e.matches) close(false); });

  // The "Expertise" disclosure group inside the menu.
  menu.querySelectorAll<HTMLButtonElement>('[data-menu-group]').forEach((g) => {
    const target = document.getElementById(g.getAttribute('aria-controls') ?? '');
    if (!target) return;
    g.addEventListener('click', () => {
      const expanded = g.getAttribute('aria-expanded') === 'true';
      g.setAttribute('aria-expanded', String(!expanded));
      target.hidden = expanded;
    });
  });

  return { close };
}

let booted = false;
export function initChrome(): void {
  if (booted) return;
  booted = true;
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  initHeaderScroll(header);
  let menuApi: { close: (f?: boolean) => void } | undefined;
  const xp = initExpertisePanel(() => menuApi?.close(false));
  menuApi = initMobileMenu(() => xp?.close(false)) ?? undefined;
  document.documentElement.classList.add('chrome-ready');
}

// Own entry (loaded before the motion bundle) so the menu never waits on GSAP/Lenis.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChrome, { once: true }); else initChrome();
