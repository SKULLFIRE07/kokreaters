/**
 * Site behaviour (REDESIGN-V3 §3 Layout, §1.5 motion). One module, no dependencies, loaded once by BaseLayout.
 *  - header: `.is-scrolled` past 8px (passive listener + rAF)
 *  - header disclosures ([data-nav-toggle] → panel): Expertise mega-menu + Industries dropdown. Click, hover intent
 *    (150ms, fine pointers ≥ 1024px), Esc returns focus, outside pointerdown / focus leaving closes, one open at a time
 *  - sliding nav highlight ([data-glide] bar, [data-glide-item]s inside [data-glide-list]): glides between hovered
 *    items on the header's bottom edge, rests under the current section
 *  - mobile menu ([data-menu-toggle] → #mobile-menu): scroll lock without layout jump, `inert` on the rest of the page,
 *    focus trap, Esc, label swap, accordions ([data-menu-group]), replay of a tap made before this script ran
 *  - v4 motion (./motion: data-gsap parallax / kenburns / rule / count / lift, Lenis on fine pointers; GSAP is its
 *    own lazy chunk). The v3 reveals are gone: nothing waits for scroll to appear.
 *  - footer groups ([data-ft-group] in [data-ft-col]): phone accordion rows; toggles .is-open + aria-expanded (CSS
 *    folds them only below 600px, so the state is inert on wider screens)
 *  - cookie settings (initConsent from ./consent)
 *  - floating WhatsApp button ([data-wa-float], phones): html.wa-show past the first screen, html.wa-zone while the
 *    CTA band / footer is in view
 *  - Plausible events: a click on any [data-event] sends that event (src/lib/analytics.ts; no-op without the script)
 *  - "Ask KoKreaters" launcher ([data-chat-launcher]): imports ./chat (its own chunk) on first intent, then opens it;
 *    hidden (html.chat-zone) while the CTA band / footer / any [data-chat-hide] is in view (IntersectionObserver)
 * Animation lives in CSS; JS only toggles state and waits out close transitions.
 */
import { initConsent } from './consent';
import { initMotion } from './motion';
import { track, type AnalyticsEvent } from '@/lib/analytics';

const html = document.documentElement;
const mq = (q: string) => window.matchMedia(q);
const reduced = mq('(prefers-reduced-motion: reduce)');
const desktop = mq('(min-width: 1024px)');
const fine = mq('(hover: hover) and (pointer: fine)');
const wait = (ms: number) => (reduced.matches ? 0 : ms);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s) as NodeListOf<T>);

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const shown = (el: HTMLElement) => (typeof el.checkVisibility === 'function'
  ? el.checkVisibility({ checkVisibilityCSS: true })
  : el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
const focusables = (root: Element) => $$<HTMLElement>(FOCUSABLE, root).filter(shown);

/* ── Header scroll state ─────────────────────────────────────────── */
function initHeader(header: HTMLElement) {
  let ticking = false;
  const update = () => { ticking = false; header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ── Header disclosures: mega-menu + dropdown (disclosure pattern, not ARIA menus) ── */
type Panel = { close: (focus?: boolean, instant?: boolean) => void; isOpen: () => boolean };
const panels: Panel[] = [];
let glideTo: ((el: HTMLElement | null) => void) | undefined;

function initDisclosure(btn: HTMLButtonElement, header: HTMLElement): Panel | null {
  const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
  const scope = btn.closest<HTMLElement>('[data-nav-scope]');
  if (!panel || !scope) return null;
  const scrim = panel.hasAttribute('data-scrim');
  let open = false, by: 'hover' | 'click' | 'keyboard' = 'click', at = 0;
  let tHide = 0, tOpen = 0, tLeave = 0;

  const show = (how: typeof by) => {
    clearTimeout(tHide); clearTimeout(tLeave);
    if (open) return;
    const switching = panels.some((p) => p !== api && p.isOpen());
    for (const p of panels) if (p !== api) p.close(false, true);
    open = true; by = how; at = performance.now();
    panel.hidden = false;
    panel.classList.toggle('is-instant', switching);   // moving between triggers: no second height ease
    void panel.offsetWidth;
    panel.classList.add('is-open');
    if (switching) requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('is-instant')));
    btn.setAttribute('aria-expanded', 'true');
    header.classList.add('has-panel');
    header.classList.toggle('has-scrim', scrim);
    glideTo?.(btn);
  };
  const close = (focus = false, instant = false) => {
    clearTimeout(tOpen);
    if (!open) return;
    open = false;
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (!panels.some((p) => p.isOpen())) header.classList.remove('has-panel', 'has-scrim');
    const done = () => { if (!open) panel.hidden = true; };
    if (instant) done(); else tHide = window.setTimeout(done, wait(240));
    if (focus) btn.focus();
    if (!instant) glideTo?.(null);
  };
  const api: Panel = { close, isOpen: () => open };

  btn.addEventListener('click', (e) => {
    const kb = e.detail === 0;
    if (open && by === 'hover' && !kb && performance.now() - at < 600) { by = 'click'; return; }
    if (open) close(kb); else show(kb ? 'keyboard' : 'click');
  });
  const enter = () => {
    if (!fine.matches || !desktop.matches) return;
    clearTimeout(tLeave);
    if (!open) { clearTimeout(tOpen); tOpen = window.setTimeout(() => show('hover'), panels.some((p) => p.isOpen()) ? 0 : 150); }
  };
  const leave = () => {
    clearTimeout(tOpen);
    if (open && by === 'hover') { clearTimeout(tLeave); tLeave = window.setTimeout(() => close(), 200); }
  };
  for (const el of [btn, panel]) { el.addEventListener('pointerenter', enter); el.addEventListener('pointerleave', leave); }
  scope.addEventListener('focusout', (e) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && !scope.contains(next)) close();
  });
  document.addEventListener('pointerdown', (e) => { if (open && !scope.contains(e.target as Node)) close(); });
  document.addEventListener('keydown', (e) => { if (open && e.key === 'Escape') { e.preventDefault(); close(true); } });
  panel.addEventListener('click', (e) => { if ((e.target as Element).closest('a[href]')) close(false, true); });
  desktop.addEventListener('change', () => close(false, true));
  return api;
}

/* ── Sliding highlight (Motion Primitives "AnimatedBackground", vanilla) ── */
function initGlide(header: HTMLElement) {
  const list = header.querySelector<HTMLElement>('[data-glide-list]');
  const bar = header.querySelector<HTMLElement>('[data-glide]');
  if (!list || !bar) return;
  const items = $$<HTMLElement>('[data-glide-item]', list);
  const current = items.find((i) => i.matches('[aria-current], .is-current')) ?? null;
  let hold: HTMLElement | null = null;          // trigger of an open panel keeps the bar
  let hovered: HTMLElement | null = null;
  const place = (el: HTMLElement | null, animate = true) => {
    if (!el || !el.getClientRects().length) { bar.style.opacity = '0'; return; }
    const l = ((bar.offsetParent as HTMLElement | null) ?? list).getBoundingClientRect(), r = el.getBoundingClientRect();
    bar.classList.toggle('is-still', !animate || bar.style.opacity !== '1');
    bar.style.transform = `translateX(${r.left - l.left}px)`;
    bar.style.width = `${r.width}px`;
    bar.style.opacity = '1';
  };
  glideTo = (el) => { hold = el; place(el ?? hovered ?? current); };
  for (const i of items) {
    i.addEventListener('pointerenter', () => { if (fine.matches) { hovered = i; place(i); } });
    i.addEventListener('focus', () => place(i));
    i.addEventListener('blur', () => place(hold ?? current));
  }
  list.addEventListener('pointerleave', () => { hovered = null; place(hold ?? current); });
  const settle = () => place(hold ?? current, false);
  list.classList.add('has-glide');
  settle();
  window.addEventListener('resize', settle, { passive: true });
  document.fonts?.ready.then(settle).catch(() => {});
}

/* ── Mobile menu ─────────────────────────────────────────────────── */
let lockedY = 0;
function lockScroll() {
  lockedY = window.scrollY;
  const gap = window.innerWidth - html.clientWidth;      // keep the page from shifting when the scrollbar goes
  const b = document.body.style;
  b.position = 'fixed'; b.top = `-${lockedY}px`; b.left = '0'; b.right = '0'; b.width = '100%';
  if (gap > 0) b.paddingRight = `${gap}px`;
}
function unlockScroll() {
  const b = document.body.style;
  b.position = b.top = b.left = b.right = b.width = b.paddingRight = '';
  window.scrollTo(0, lockedY);
}

function initMobileMenu(header: HTMLElement) {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  const label = btn.querySelector<HTMLElement>('[data-menu-label]');
  const outside = () => $$<HTMLElement>('main, footer, .skip-link, [data-announcement]');
  let open = false, tHide = 0;

  const trap = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key !== 'Tab') return;
    const items = [btn, ...focusables(menu)];
    const first = items[0], last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = !!active && items.includes(active);
    if (e.shiftKey && (active === first || !inside)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !inside)) { e.preventDefault(); first.focus(); }
  };
  const show = () => {
    if (open) return;
    clearTimeout(tHide);
    open = true;
    for (const p of panels) p.close(false, true);
    // pin the header where it is now (the body is about to become position:fixed), and start the sheet under it
    const top = Math.max(0, header.getBoundingClientRect().top);
    html.style.setProperty('--menu-hdr-top', `${top}px`);
    lockScroll();
    html.classList.add('menu-open');
    menu.hidden = false;
    void menu.offsetWidth;
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = btn.dataset.labelClose ?? 'Close';
    for (const el of outside()) el.inert = true;
    document.addEventListener('keydown', trap);
    focusables(menu)[0]?.focus({ preventScroll: true });
  };
  const close = (focus = false) => {
    if (!open) return;
    open = false;
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = btn.dataset.labelOpen ?? 'Menu';
    for (const el of outside()) el.inert = false;
    document.removeEventListener('keydown', trap);
    html.classList.remove('menu-open');
    unlockScroll();
    tHide = window.setTimeout(() => { if (!open) menu.hidden = true; }, wait(200));
    if (focus) btn.focus({ preventScroll: true });
  };

  btn.addEventListener('click', () => (open ? close(true) : show()));
  menu.addEventListener('click', (e) => { if ((e.target as Element).closest('a[href]')) close(); });
  desktop.addEventListener('change', (e) => { if (e.matches) close(); });

  for (const g of $$<HTMLButtonElement>('[data-menu-group]', menu)) {
    g.addEventListener('click', () => g.setAttribute('aria-expanded', String(g.getAttribute('aria-expanded') !== 'true')));
  }

  const w = window as unknown as { __kkMenuPending?: boolean };
  if (w.__kkMenuPending) { w.__kkMenuPending = false; if (!desktop.matches) show(); }
}

/* ── Footer groups: phone accordion rows (folded by CSS < 600px only) ── */
function initFooterGroups() {
  for (const btn of $$<HTMLButtonElement>('[data-ft-group]')) {
    const col = btn.closest<HTMLElement>('[data-ft-col]');
    if (!col) continue;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      col.classList.toggle('is-open', open);
    });
  }
}

/* ── Ask KoKreaters: chat.ts is a separate chunk, imported on the first hover / focus / click of the launcher ── */
function initChatLauncher() {
  const btn = document.querySelector<HTMLButtonElement>('[data-chat-launcher]');
  if (!btn) return;
  let mod: Promise<typeof import('./chat')> | null = null;
  const get = () => (mod ??= import('./chat').then((m) => { m.boot(); return m; }));
  btn.addEventListener('pointerenter', () => { void get(); }, { once: true });
  btn.addEventListener('focus', () => { void get(); }, { once: true });
  // until chat.ts has booted (it then owns the click), a click loads it and opens the panel
  btn.addEventListener('click', () => { if (!btn.dataset.chatReady) void get().then((m) => m.open()); });
  // Brief item 1: hide the launcher while the closing CTA band or the footer is in view (html.chat-zone), so it never
  // covers the saffron "Start a conversation" button or the last cards. Without IntersectionObserver it simply stays.
  // Phones (< 600px) also: while a hero's buttons pass through the bottom strip of the screen where the launcher sits
  // (bottom 64px), so it never covers "Explore our expertise" or a page hero's second button on first view.
  if (!('IntersectionObserver' in window)) return;
  const inView = new Set<Element>();
  const sync = () => html.classList.toggle('chat-zone', inView.size > 0);
  const track = (entries: IntersectionObserverEntry[]) => {
    for (const e of entries) { if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target); }
    sync();
  };
  const zones = $$<HTMLElement>('.cta-band, #site-footer, [data-chat-hide]');
  // 96px early at the bottom, so it is gone before the band reaches the strip where it sits
  const io = new IntersectionObserver(track, { threshold: 0, rootMargin: '0px 0px 96px 0px' });
  zones.forEach((z) => io.observe(z));

  const phone = mq('(max-width: 599px)');
  const phoneZones = $$<HTMLElement>('.hh__actions, .hero__actions, [data-chat-hide-phone]');
  let strip: IntersectionObserver | null = null;
  const watchStrip = () => {
    strip?.disconnect();
    phoneZones.forEach((z) => inView.delete(z));
    strip = null;
    if (phone.matches && phoneZones.length) {
      strip = new IntersectionObserver(track, { threshold: 0, rootMargin: `-${Math.max(0, window.innerHeight - 64)}px 0px 0px 0px` });
      phoneZones.forEach((z) => strip!.observe(z));
    }
    sync();
  };
  watchStrip();
  phone.addEventListener('change', watchStrip);
  let t = 0;
  window.addEventListener('resize', () => { window.clearTimeout(t); t = window.setTimeout(watchStrip, 200); }, { passive: true });
}

/* ── Floating WhatsApp button (phones) ───────────────────────────── */
function initWhatsApp() {
  if (!document.querySelector('[data-wa-float]')) return;
  let ticking = false;
  const update = () => { ticking = false; html.classList.toggle('wa-show', window.scrollY > window.innerHeight * .6); };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  if (!('IntersectionObserver' in window)) return;
  const inView = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target); }
    html.classList.toggle('wa-zone', inView.size > 0);
  }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
  $$<HTMLElement>('.cta-band, #site-footer, [data-wa-hide]').forEach((z) => io.observe(z));
}

/* ── Plausible events (cookie-free; no-op unless PUBLIC_PLAUSIBLE_DOMAIN loaded the script) ── */
function initEvents() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-event]');
    if (el?.dataset.event) track(el.dataset.event as AnalyticsEvent);
  }, { capture: true });
}

/* ── Boot ────────────────────────────────────────────────────────── */
function boot() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header) {
    initHeader(header);
    for (const b of $$<HTMLButtonElement>('[data-nav-toggle]', header)) { const p = initDisclosure(b, header); if (p) panels.push(p); }
    initGlide(header);
    initMobileMenu(header);
  }
  initMotion();
  initFooterGroups();
  initConsent();
  initChatLauncher();
  initWhatsApp();
  initEvents();
  html.classList.add('chrome-ready', 'motion-booted');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
