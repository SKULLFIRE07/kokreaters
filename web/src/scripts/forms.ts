/**
 * Newsletter and playbook forms (pack 2, brief items 33 and 34). Imported by ui/NewsletterForm.astro and
 * ui/PlaybookCard.astro (Astro bundles it once per page); no dependencies.
 *
 * Newsletter (form[data-nl], delegated on document so every instance on a page shares one listener):
 *   honeypot (company_website filled → silent success, nothing sent) → email + consent checks with inline errors
 *   (aria-invalid + the field's own error line; focus moves to the first) → 3 s time trap (a valid form sent < 3 s
 *   after page load is a script → silent success) → POST JSON to data-endpoint (/api/subscribe) → the confirmation line
 *   in the polite status region; the fields step aside (form[data-state="done"]).
 *
 * Playbook ([data-playbook-open] → <dialog data-playbook-dialog>):
 *   The trigger is a mailto link in the HTML (works without JS); here it becomes a button that opens the native modal
 *   dialog (role="button", aria-haspopup="dialog", aria-controls). showModal() makes the page inert; Tab and Shift+Tab
 *   are also kept inside the panel (focus trap); Esc and the Close button close it, as does a click on the backdrop.
 *   While open, Lenis is paused and the page behind does not scroll; on close focus returns to the trigger.
 *   Submit: honeypot → required fields, email format and the consent box (inline errors) → time trap → POST JSON to
 *   data-endpoint (/api/playbook) → the thank-you panel replaces the form and takes focus. Reopening after a send shows
 *   a fresh form.
 */
import { track } from '@/lib/analytics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MS = 3000;
const loadedAt = Math.round(performance.timeOrigin || Date.now() - performance.now());

type Field = HTMLInputElement;

function stampStarted(root: ParentNode): void {
  root.querySelectorAll<HTMLInputElement>('input[data-started-at]').forEach((i) => { if (!i.value) i.value = String(loadedAt); });
}

function setFieldError(field: Field, errorEl: HTMLElement | null, msg: string | null): void {
  if (msg) {
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) { errorEl.textContent = msg; errorEl.hidden = false; }
  } else {
    field.removeAttribute('aria-invalid');
    if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
  }
}

function payload(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => { if (typeof v === 'string') out[k] = v; });
  out.page_url = window.location.href.split('#')[0];
  return out;
}

async function post(endpoint: string, body: Record<string, string>): Promise<Response> {
  return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
}

/* ── Newsletter ─────────────────────────────────────────────────────────── */
function initNewsletter(): void {
  const forms = document.querySelectorAll<HTMLFormElement>('form[data-nl]');
  if (!forms.length) return;
  forms.forEach((f) => { f.noValidate = true; stampStarted(f); });

  const parts = (form: HTMLFormElement) => ({
    email: form.querySelector<HTMLInputElement>('input[name="email"]')!,
    consent: form.querySelector<HTMLInputElement>('input[name="consent"]')!,
    emailErr: form.querySelector<HTMLElement>('[data-nl-error="email"]'),
    consentErr: form.querySelector<HTMLElement>('[data-nl-error="consent"]'),
    msg: form.querySelector<HTMLElement>('[data-nl-msg]'),
    btn: form.querySelector<HTMLButtonElement>('[data-nl-submit]'),
  });
  const say = (msg: HTMLElement | null, text: string, state: 'success' | 'error' | '') => {
    if (!msg) return;
    msg.textContent = text;
    if (state) msg.dataset.state = state; else delete msg.dataset.state;
  };
  const done = (form: HTMLFormElement) => {
    const p = parts(form);
    form.reset();
    stampStarted(form);
    form.dataset.state = 'done';
    say(p.msg, form.dataset.msgSuccess ?? '', 'success');
  };

  document.addEventListener('submit', async (e) => {
    const form = (e.target as Element | null)?.closest?.<HTMLFormElement>('form[data-nl]');
    if (!form) return;
    e.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;
    const d = form.dataset;
    const p = parts(form);

    const hp = form.querySelector<HTMLInputElement>('input[name="company_website"]');
    if (hp && hp.value.trim()) { done(form); return; }

    const emailBad = !EMAIL_RE.test(p.email.value.trim());
    setFieldError(p.email, p.emailErr, emailBad ? d.msgInvalid ?? '' : null);
    setFieldError(p.consent, p.consentErr, !p.consent.checked ? d.msgConsent ?? '' : null);
    if (emailBad || !p.consent.checked) { say(p.msg, '', ''); (emailBad ? p.email : p.consent).focus(); return; }

    if (Date.now() - loadedAt < MIN_MS) { done(form); return; }

    form.setAttribute('aria-busy', 'true');
    if (p.btn) { p.btn.disabled = true; p.btn.setAttribute('aria-busy', 'true'); }
    try {
      const res = await post(d.endpoint || '/api/subscribe', payload(form));
      if (!res.ok) throw new Error(String(res.status));
      done(form);
    } catch {
      say(p.msg, d.msgError ?? '', 'error');
    } finally {
      form.removeAttribute('aria-busy');
      if (p.btn) { p.btn.disabled = false; p.btn.removeAttribute('aria-busy'); }
    }
  });

  // re-check a marked field as the visitor corrects it
  document.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement | null;
    const form = el?.closest?.<HTMLFormElement>('form[data-nl]');
    if (!form || el?.getAttribute('aria-invalid') !== 'true') return;
    const p = parts(form);
    if (el === p.email && EMAIL_RE.test(p.email.value.trim())) setFieldError(p.email, p.emailErr, null);
  });
  document.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement | null;
    const form = el?.closest?.<HTMLFormElement>('form[data-nl]');
    if (!form) return;
    const p = parts(form);
    if (el === p.consent && p.consent.checked) setFieldError(p.consent, p.consentErr, null);
  });
}

/* ── Playbook dialog ────────────────────────────────────────────────────── */
type Lenis = { stop(): void; start(): void };
const lenis = (): Lenis | undefined => (window as unknown as { __kkLenis?: Lenis }).__kkLenis;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initPlaybook(): void {
  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[data-playbook-dialog]');
  dialogs.forEach((dialog) => {
    if (dialog.dataset.ready) return;
    dialog.dataset.ready = 'true';
    const form = dialog.querySelector<HTMLFormElement>('form[data-pb-form]');
    const body = dialog.querySelector<HTMLElement>('[data-pb-body]');
    const thanks = dialog.querySelector<HTMLElement>('[data-pb-done]');
    const thanksFocus = thanks?.querySelector<HTMLElement>('[data-pb-done-focus]') ?? null;
    const status = dialog.querySelector<HTMLElement>('[data-pb-status]');
    const submit = dialog.querySelector<HTMLButtonElement>('[data-pb-submit]');
    if (!form || !body || !thanks) return;
    form.noValidate = true;
    stampStarted(form);
    const d = form.dataset;
    let opener: HTMLElement | null = null;

    const fields = () => Array.from(form.querySelectorAll<Field>('input[data-pb-field]'));
    const errEl = (f: Field) => form.querySelector<HTMLElement>(`[data-pb-error="${f.name}"]`);
    const check = (f: Field): string | null => {
      if (f.type === 'checkbox') return f.required && !f.checked ? d.msgConsent ?? '' : null;
      const v = f.value.trim();
      if (f.required && !v) return d.msgRequired ?? '';
      if (f.type === 'email' && v && !EMAIL_RE.test(v)) return d.msgEmail ?? '';
      return null;
    };
    fields().forEach((f) => f.addEventListener(f.type === 'checkbox' ? 'change' : 'input', () => {
      if (f.getAttribute('aria-invalid') === 'true') setFieldError(f, errEl(f), check(f));
    }));

    const showForm = () => {
      thanks.hidden = true; body.hidden = false;
      if (status) { status.textContent = ''; delete status.dataset.state; }
    };
    const showThanks = () => {
      form.reset(); stampStarted(form);
      fields().forEach((f) => setFieldError(f, errEl(f), null));
      body.hidden = true; thanks.hidden = false;
      (thanksFocus ?? thanks).focus();
    };

    const lock = (on: boolean) => {
      const html = document.documentElement;
      if (on) {
        const gap = window.innerWidth - html.clientWidth;
        html.style.setProperty('--pb-gap', `${gap}px`);
        html.classList.add('pb-lock');
        lenis()?.stop();
      } else {
        html.classList.remove('pb-lock');
        html.style.removeProperty('--pb-gap');
        lenis()?.start();
      }
    };

    const open = (from: HTMLElement | null) => {
      opener = from;
      if (!thanks.hidden) showForm();
      dialog.showModal();
      lock(true);
      // fine pointers: straight into the first field; touch: the heading, so the keyboard does not cover the sheet
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const target = coarse ? dialog.querySelector<HTMLElement>('[data-pb-title]') : form.querySelector<HTMLElement>('input[data-pb-field]');
      target?.focus();
    };
    dialog.addEventListener('close', () => {
      lock(false);
      opener?.focus({ preventScroll: true });
    });
    dialog.querySelectorAll<HTMLElement>('[data-pb-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
    // a click on the backdrop (the dialog box itself, outside its panel) closes
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    // focus trap: Tab and Shift+Tab cycle inside the panel (showModal already makes the page inert)
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialog.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !dialog.contains(active))) { e.preventDefault(); first.focus(); }
    });

    document.querySelectorAll<HTMLAnchorElement>(`[data-playbook-open="${dialog.id}"]`).forEach((a) => {
      a.setAttribute('role', 'button');
      a.setAttribute('aria-haspopup', 'dialog');
      a.setAttribute('aria-controls', dialog.id);
      a.addEventListener('click', (e) => { e.preventDefault(); open(a); });
      a.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); open(a); } });
    });

    let sending = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;
      const hp = form.querySelector<HTMLInputElement>('input[name="company_website"]');
      if (hp && hp.value.trim()) { showThanks(); return; }

      let first: Field | null = null;
      for (const f of fields()) {
        const msg = check(f);
        setFieldError(f, errEl(f), msg);
        if (msg && !first) first = f;
      }
      if (first) { if (status) status.textContent = ''; first.focus(); return; }
      if (Date.now() - loadedAt < MIN_MS) { showThanks(); return; }

      sending = true;
      if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
      try {
        const res = await post(d.endpoint || '/api/playbook', payload(form));
        if (res.ok) { showThanks(); track('playbook-download'); return; }
        const out = res.status === 400 ? (await res.json().catch(() => null)) as { fields?: Record<string, string> } | null : null;
        const bad = out?.fields ? fields().filter((f) => out.fields![f.name]) : [];
        bad.forEach((f) => setFieldError(f, errEl(f), out!.fields![f.name] === 'email' ? d.msgEmail ?? '' : f.type === 'checkbox' ? d.msgConsent ?? '' : d.msgRequired ?? ''));
        if (bad.length) bad[0].focus();
        else if (status) { status.textContent = d.msgError ?? ''; status.dataset.state = 'error'; }
      } catch {
        if (status) { status.textContent = d.msgError ?? ''; status.dataset.state = 'error'; }
      } finally {
        sending = false;
        if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
      }
    });
  });
}

function boot(): void {
  initNewsletter();
  initPlaybook();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();

export {};
