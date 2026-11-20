/**
 * Contact form behaviour (REDESIGN-V3 §4 Contact, §8.6). Loaded by src/pages/contact.astro itself
 * (`<script>import '@/scripts/pages/contact.ts'</script>`); no motion bundle, no dependencies.
 *
 * Order on submit:
 *   1. honeypot — a filled company_website "succeeds" silently and sends nothing (form.dataset.trapped = 'true');
 *   2. required + email checks — inline errors (aria-invalid, aria-describedby → #<name>-error), focus the first one;
 *      these run before the time trap, so an early or empty submit is never shown a false success;
 *   2b. time trap — a form that passes every check yet is sent < 3 s after navigation start "succeeds" silently like
 *      the honeypot (no person picks an area and writes a message that fast; autofill fills neither);
 *   3. endpoint (site.formEndpoint, default the same-origin function /api/contact) → fetch(POST FormData, Accept:
 *      application/json); ok → clear the form; a 400 with { fields } marks those fields inline;
 *   4. no endpoint → open the visitor's mail app with every field filled in (mailto to office@, test hook
 *      form.dataset.mailtoUrl); the form keeps what was typed.
 * Success replaces the heading + form with the thank-you panel ([data-form-done]) and moves focus to its heading;
 * errors stay inline in the polite status region under the Send button.
 * Turnstile: its script is injected on the first focus inside the form, never on load (no third-party request at load).
 * Booking links that point at the form (a[data-booking="form"]) scroll to it and focus the first field.
 * Pack 3: required fields are Name, Email, Company and Message (the markup's `required`); no consent tick box on this
 * page; a successful send records the cookie-free "form-send" event (no-op without PUBLIC_PLAUSIBLE_DOMAIN).
 */
import { track } from '@/lib/analytics';

const MIN_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER = ['name', 'email', 'company', 'role', 'phone', 'country', 'interest', 'message', 'source'] as const;

type Ctl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function initContact(): void {
  const found = document.querySelector<HTMLFormElement>('form[data-form]');
  if (!found) return;
  const form: HTMLFormElement = found;
  form.noValidate = true;

  const loadedAt = Math.round(performance.timeOrigin || Date.now() - performance.now());
  const started = form.querySelector<HTMLInputElement>('[data-started-at]');
  if (started) started.value = String(loadedAt);

  const d = form.dataset;
  const endpoint = d.endpoint || '';
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const wrap = form.closest<HTMLElement>('[data-form-wrap]') ?? form;
  const body = wrap.querySelector<HTMLElement>('[data-form-body]');
  const done = wrap.querySelector<HTMLElement>('[data-form-done]');
  const doneHeading = done?.querySelector<HTMLElement>('[data-done-heading]') ?? null;
  const doneText = done?.querySelector<HTMLElement>('[data-done-text]') ?? null;
  const doneAgain = done?.querySelector<HTMLElement>('[data-done-again]') ?? null;
  const doneBack = done?.querySelector<HTMLElement>('[data-done-back]') ?? null;
  const doneReopen = done?.querySelector<HTMLAnchorElement>('[data-done-reopen]') ?? null;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Labels for the mailto body: the label's own text, without the "*" / "(required)" decoration. */
  const LABELS: Record<string, string> = {};
  form.querySelectorAll<HTMLLabelElement>('.cf__label').forEach((l) => {
    const f = l.htmlFor.replace(/^f-/, '');
    LABELS[f] = (l.dataset.label ?? l.childNodes[0]?.textContent ?? f).trim();
  });

  const ctl = (name: string) => form.elements.namedItem(name) as Ctl | null;
  const icon = (tone: 'success' | 'error') => form.querySelector<HTMLTemplateElement>(`template[data-icon="${tone}"]`)?.innerHTML ?? '';
  const firstField = () => ctl('name') as HTMLElement | null;

  /* ── Scroll a block into view (instant under reduced motion), only when its top is not already visible ── */
  function bringIntoView(el: HTMLElement) {
    const top = el.getBoundingClientRect().top;
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')) || 80;
    if (top < offset || top > window.innerHeight * 0.6) {
      el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ── Booking card / links that fall back to the form: scroll to it and focus the first field ── */
  document.querySelectorAll<HTMLAnchorElement>('a[data-booking="form"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (done && !done.hidden) showForm(false);
      wrap.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      firstField()?.focus({ preventScroll: true });
      history.replaceState(null, '', '#form');
    });
  });

  /* ── Turnstile: script injected on the first focus inside the form, never on load ── */
  if (d.turnstile) {
    form.addEventListener('focusin', () => {
      if (document.querySelector('script[data-turnstile-script]')) return;
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true; s.dataset.turnstileScript = '';
      document.head.appendChild(s);
    });
  }

  /* ── Errors ── */
  const errorEl = (n: string) => form.querySelector<HTMLElement>(`#${n}-error`);
  function setError(field: Ctl, msg: string | null) {
    const el = errorEl(field.name);
    if (msg) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${field.name}-error`);
      if (el) { const t = el.querySelector('[data-error-text]'); if (t) t.textContent = msg; el.hidden = false; }
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      if (el) el.hidden = true;
    }
  }
  function check(field: Ctl): string | null {
    const required = field.hasAttribute('required');
    if (field instanceof HTMLInputElement && field.type === 'checkbox') return required && !field.checked ? (d.msgConsent || d.msgRequired!) : null;
    const v = field.value.trim();
    if (required && !v) return d.msgRequired!;
    if (field.name === 'email' && v && !EMAIL_RE.test(v)) return d.msgEmail!;
    return null;
  }
  const allFields = () => Array.from(form.querySelectorAll<Ctl>('.cf__field input, .cf__field select, .cf__field textarea'));
  // once a field has been marked, re-check it as the visitor corrects it
  allFields().forEach((f) => f.addEventListener(
    f.tagName === 'SELECT' || (f as HTMLInputElement).type === 'checkbox' ? 'change' : 'input',
    () => { if (f.getAttribute('aria-invalid') === 'true') setError(f, check(f)); },
  ));

  function say(tone: 'success' | 'error' | 'info', msg: string) {
    if (!status) return;
    status.dataset.tone = tone;
    status.innerHTML = '';
    if (tone !== 'info') status.insertAdjacentHTML('afterbegin', icon(tone));
    if (msg) { const span = document.createElement('span'); span.textContent = msg; status.append(span); }
  }
  function clearStatus() {
    if (!status) return;
    status.innerHTML = '';
    delete status.dataset.tone;
  }

  /* ── Thank-you panel ── */
  function showDone(kind: 'sent' | 'mailto', mailto?: string) {
    if (!done || !body) { say('success', kind === 'sent' ? d.msgSuccess! : d.msgMailto!); return; }
    if (doneHeading) doneHeading.textContent = (kind === 'sent' ? done.dataset.sentHeading : done.dataset.mailtoHeading) ?? '';
    if (doneText) doneText.textContent = (kind === 'sent' ? d.msgSuccess : d.msgMailto) ?? '';
    if (doneAgain) doneAgain.hidden = kind !== 'sent';
    if (doneBack) doneBack.hidden = kind !== 'mailto';
    if (doneReopen) { doneReopen.hidden = kind !== 'mailto' || !mailto; if (mailto) doneReopen.href = mailto; }
    clearStatus();
    body.hidden = true;
    done.hidden = false;
    bringIntoView(done);
    doneHeading?.focus({ preventScroll: true });
  }
  function showForm(focus: boolean) {
    if (!done || !body) return;
    done.hidden = true;
    body.hidden = false;
    if (focus) { bringIntoView(wrap); firstField()?.focus({ preventScroll: true }); }
  }
  doneAgain?.addEventListener('click', () => showForm(true));
  doneBack?.addEventListener('click', () => showForm(true));

  function resetAll() {
    form.reset();
    allFields().forEach((f) => setError(f, null));
    if (started) started.value = String(loadedAt);
  }
  function busy(on: boolean) {
    if (!submit) return;
    if (on) { submit.setAttribute('aria-busy', 'true'); submit.disabled = true; }
    else { submit.removeAttribute('aria-busy'); submit.disabled = false; }
  }

  function mailtoUrl(): string {
    const v = (n: string) => (ctl(n)?.value ?? '').trim();
    const subject = `Enquiry from ${v('name')}, ${v('company')}`;
    const text = ORDER.map((n) => `${LABELS[n] ?? n}: ${v(n)}`).join('\n');
    return `mailto:${d.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }

  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;

    const trap = () => { form.dataset.trapped = 'true'; showDone(endpoint ? 'sent' : 'mailto'); };

    // 1. honeypot: filled → "succeeds" silently and sends nothing
    const hp = form.querySelector<HTMLInputElement>('input[name="company_website"]');
    if (hp && hp.value.trim() !== '') { trap(); return; }

    // 2. required and email-format checks (before the time trap: an invalid form always gets its errors)
    let first: Ctl | null = null;
    for (const f of allFields()) {
      const msg = check(f);
      setError(f, msg);
      if (msg && !first) first = f;
    }
    if (first) { clearStatus(); first.focus(); return; }

    // 2b. time trap: a valid form sent < 3 s after navigation start is a script → silent success, nothing sent
    if (Date.now() - loadedAt < MIN_MS) { trap(); return; }

    // 3. endpoint: fetch with a JSON Accept header
    if (endpoint) {
      sending = true; busy(true); say('info', '');
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (res.ok) { resetAll(); showDone('sent'); track('form-send'); }
        else {
          // /api/contact re-validates: show its field errors inline (rare: the same checks already ran here)
          const out = res.status === 400 ? await res.json().catch(() => null) as { fields?: Record<string, string> } | null : null;
          const bad = out?.fields ? Object.entries(out.fields).map(([n, why]) => [ctl(n), why] as const).filter(([f]) => f) : [];
          for (const [f, why] of bad) setError(f!, why === 'email' ? d.msgEmail! : why === 'required' ? d.msgRequired! : d.msgError!);
          if (bad.length) { clearStatus(); bad[0][0]!.focus(); } else say('error', d.msgError!);
        }
      } catch {
        say('error', d.msgError!);
      } finally {
        sending = false; busy(false);
      }
      return;
    }

    // 4. no endpoint: open the visitor's email app with every field filled in
    const url = mailtoUrl();
    form.dataset.mailtoUrl = url;          // inspectable hook for tests
    window.location.href = url;
    showDone('mailto', url);
  });
}

initContact();
