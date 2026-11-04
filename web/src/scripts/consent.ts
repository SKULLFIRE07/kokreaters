/**
 * Cookie consent (DESIGN-SPEC 3.6, C-6). The site sets no non-essential cookies.
 * - Analytics off (default): no banner, nothing stored on load; the footer's
 *   "Cookie settings" opens an informational dialog.
 * - PUBLIC_ANALYTICS=1: a non-modal bar asks once; the choice is stored in
 *   localStorage['kk-consent']. No analytics script exists yet: onConsent() is the hook.
 */

export interface Consent { v: 1; analytics: boolean; ts: string }
const KEY = 'kk-consent';
type Listener = (c: Consent) => void;
const listeners: Listener[] = [];

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    return parsed && parsed.v === 1 && typeof parsed.analytics === 'boolean' ? (parsed as Consent) : null;
  } catch { return null; }
}

function saveConsent(analytics: boolean): Consent {
  const c: Consent = { v: 1, analytics, ts: new Date().toISOString() };
  try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage blocked: choice lasts this page only */ }
  for (const cb of listeners) { try { cb(c); } catch { /* listener errors never break the page */ } }
  return c;
}

/** Future analytics loader registers here. Fires now if a choice exists, then on each change. */
export function onConsent(cb: Listener): void {
  listeners.push(cb);
  const existing = readConsent();
  if (existing) cb(existing);
}

let booted = false;
export function initConsent(): void {
  if (booted) return;
  booted = true;
  const dialog = document.getElementById('cookie-settings') as HTMLDialogElement | null;
  const bar = document.querySelector<HTMLElement>('[data-cookie-bar]');
  const toggle = dialog?.querySelector<HTMLInputElement>('[data-consent-analytics]') ?? null;
  const analyticsMode = !!bar;
  let returnTo: HTMLElement | null = null;

  const openDialog = (from?: HTMLElement | null) => {
    if (!dialog) return;
    returnTo = from ?? (document.activeElement as HTMLElement | null);
    if (toggle && analyticsMode) toggle.checked = readConsent()?.analytics ?? false;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  };
  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  };

  document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]').forEach((b) =>
    b.addEventListener('click', () => openDialog(b)),
  );
  dialog?.querySelectorAll<HTMLButtonElement>('[data-dialog-close]').forEach((b) =>
    b.addEventListener('click', closeDialog),
  );
  dialog?.addEventListener('close', () => { returnTo?.focus?.(); returnTo = null; });
  // A click on the backdrop closes it.
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });

  if (!analyticsMode) return;

  const hideBar = () => { if (bar) bar.hidden = true; };
  if (bar && !readConsent()) bar.hidden = false;

  bar?.querySelector('[data-consent-accept]')?.addEventListener('click', () => { saveConsent(true); hideBar(); });
  bar?.querySelector('[data-consent-reject]')?.addEventListener('click', () => { saveConsent(false); hideBar(); });
  bar?.querySelector<HTMLButtonElement>('[data-consent-settings]')?.addEventListener('click', (e) =>
    openDialog(e.currentTarget as HTMLButtonElement),
  );
  toggle?.addEventListener('change', () => { saveConsent(toggle.checked); hideBar(); });
}
