/**
 * Contact page behaviour (DESIGN-SPEC 5.10, 6.9). Loaded by the motion bootstrap's page registry.
 * Order on submit: honeypot → time trap (< 3 s: silently "succeed", send nothing) → required and
 * email checks → fetch to the endpoint, or a mailto to office@ when no endpoint is set.
 * Nothing on the form animates; only the connection line draws, and only on success.
 */
import type { MotionContext } from '../motion/context';

const MIN_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER = ['name', 'company', 'role', 'email', 'phone', 'country', 'interest', 'message', 'source'] as const;
const LABELS: Record<string, string> = {};

type Ctl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default function initContact(ctx: MotionContext): () => void {
  const found = document.querySelector<HTMLFormElement>('form[data-form]');
  if (!found) return () => {};
  const form: HTMLFormElement = found;
  const ac = new AbortController();
  const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, type: K | string, fn: (e: any) => void) =>
    el.addEventListener(type, fn, { signal: ac.signal });

  form.noValidate = true;
  const loadedAt = Math.round(performance.timeOrigin || Date.now() - performance.now());
  const started = form.querySelector<HTMLInputElement>('[data-started-at]');
  if (started) started.value = String(loadedAt);

  const d = form.dataset;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const endpoint = d.endpoint || '';
  const moment = document.querySelector<HTMLElement>('.cm');
  const line = document.querySelector<HTMLElement>('[data-connection-line]');
  const label = document.querySelector<HTMLElement>('[data-visitor-label]');
  const passengers = Array.from(document.querySelectorAll<HTMLElement>('[data-ticket-passenger]'));
  const soon = form.querySelector<HTMLElement>('[data-soon]');

  /* ── Bencho ports: the ticket (lazy) and confetti (loaded on the first successful submit) ── */
  const ticket = document.querySelector<HTMLElement>('[data-ticket]');
  if (ticket) ctx.whenNear(ticket, async () => { (await import('../bencho/ticket')).default(ticket, ctx); });
  const confettiCanvas = document.querySelector<HTMLCanvasElement>('[data-confetti]');
  async function celebrate() {
    if (soon) {
      soon.hidden = false;
      if (!ctx.reduced) ctx.gsap.fromTo(soon, { opacity: 0, scale: 0.6, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2.2)' });
    }
    if (ctx.reduced || !confettiCanvas) return;
    const r = (submit ?? form).getBoundingClientRect();
    try { (await import('../bencho/confetti')).default(confettiCanvas, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); } catch { /* decorative */ }
  }
  form.querySelectorAll<HTMLLabelElement>('.cf__label').forEach((l) => {
    const f = l.htmlFor.replace(/^f-/, '');
    LABELS[f] = (l.childNodes[0]?.textContent ?? f).trim();
  });

  const ctl = (name: string) => form.elements.namedItem(name) as Ctl | null;
  const icon = (tone: 'success' | 'error') => form.querySelector<HTMLTemplateElement>(`template[data-icon="${tone}"]`)?.innerHTML ?? '';

  /* ── Visitor label in the connection path and on the boarding pass (throttled) ── */
  const name = ctl('name');
  let raf = 0;
  const setVisitor = (v: string) => {
    const short = v ? (v.length > 18 ? `${v.slice(0, 17)}…` : v) : '';
    if (label) label.textContent = short || (label.dataset.fallback ?? 'You');
    passengers.forEach((p) => { p.textContent = short || (p.dataset.fallback ?? 'You'); });
  };
  if (name) {
    on(name, 'input', () => {
      if (raf) return;
      raf = window.setTimeout(() => { raf = 0; setVisitor(name.value.trim().split(/\s+/)[0] ?? ''); }, 120);
    });
  }

  /* ── The step path: who → what → send fills as the required fields of each step become valid ── */
  const GROUPS: [string, string[]][] = [['who', ['name', 'company', 'role', 'email', 'phone', 'country']], ['what', ['interest', 'message', 'source']], ['send', ['consent']]];
  const segs = Array.from(document.querySelectorAll<HTMLElement>('[data-seg]'));
  const stopsEl = (k: string) => document.querySelector<HTMLElement>(`[data-stop="${k}"]`);
  function progressPath() {
    GROUPS.forEach(([k, names], i) => {
      const req = names.map((n) => ctl(n)).filter((f): f is Ctl => !!f && f.hasAttribute('required'));
      const ok = req.filter((f) => check(f) === null).length;
      const frac = req.length ? ok / req.length : 1;
      segs[i]?.style.setProperty('--f', frac.toFixed(3));
      stopsEl(k)?.classList.toggle('is-done', frac >= 1);
    });
  }
  on(form, 'input', progressPath);
  on(form, 'change', progressPath);

  /* ── Booking pill: when it points at the form, focus the first field ── */
  document.querySelectorAll<HTMLAnchorElement>('a[data-booking="form"]').forEach((a) => {
    on(a, 'click', (e: MouseEvent) => {
      e.preventDefault();
      const first = ctl('name') as HTMLElement | null;
      form.scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth', block: 'start' });
      first?.focus({ preventScroll: true });
      history.replaceState(null, '', '#form');
    });
  });

  /* ── Turnstile: script injected on the first focus inside the form, never on load ── */
  if (d.turnstile) {
    on(form, 'focusin', () => {
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
      if (el) { el.querySelector('[data-error-text]')!.textContent = msg; el.hidden = false; }
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      if (el) el.hidden = true;
    }
  }
  function check(field: Ctl): string | null {
    const required = field.hasAttribute('required');
    if (field instanceof HTMLInputElement && field.type === 'checkbox') return required && !field.checked ? d.msgRequired! : null;
    const v = field.value.trim();
    if (required && !v) return d.msgRequired!;
    if (field.name === 'email' && v && !EMAIL_RE.test(v)) return d.msgEmail!;
    return null;
  }
  const allFields = () => Array.from(form.querySelectorAll<Ctl>('.cf__field input, .cf__field select, .cf__field textarea'));
  // once a field has been marked, re-check it as the visitor corrects it
  allFields().forEach((f) => on(f, f.tagName === 'SELECT' || (f as HTMLInputElement).type === 'checkbox' ? 'change' : 'input', () => {
    if (f.getAttribute('aria-invalid') === 'true') setError(f, check(f));
  }));

  function say(tone: 'success' | 'error' | 'info', msg: string) {
    status.dataset.tone = tone;
    status.innerHTML = '';
    if (tone !== 'info') status.insertAdjacentHTML('afterbegin', icon(tone));
    status.append(document.createTextNode(msg));
  }

  function connect() {
    moment?.classList.add('is-connected');
    line?.style.setProperty('--f', '1');
  }
  function resetAll() {
    form.reset();
    allFields().forEach((f) => setError(f, null));
    setVisitor('');
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
    const body = ORDER.map((n) => `${LABELS[n] ?? n}: ${v(n)}`).join('\n')
      + `\n${(ctl('consent') as HTMLInputElement | null)?.checked ? 'Consent: yes' : ''}`;
    return `mailto:${d.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  let sending = false;
  on(form, 'submit', async (e: SubmitEvent) => {
    e.preventDefault();
    if (sending) return;

    // 1. traps: a filled honeypot or a sub-3 s submit "succeeds" silently and sends nothing
    const hp = form.querySelector<HTMLInputElement>('input[name="company_website"]');
    if ((hp && hp.value.trim() !== '') || Date.now() - loadedAt < MIN_MS) {
      form.dataset.trapped = 'true';
      say('success', endpoint ? d.msgSuccess! : d.msgMailto!);
      return;
    }

    // 2. required and email-format checks
    let first: Ctl | null = null;
    for (const f of allFields()) {
      const msg = check(f);
      setError(f, msg);
      if (msg && !first) first = f;
    }
    if (first) { status.innerHTML = ''; delete status.dataset.tone; first.focus(); return; }

    // 3. endpoint: fetch with a JSON Accept header
    if (endpoint) {
      sending = true; busy(true); say('info', '');
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (res.ok) { resetAll(); progressPath(); say('success', d.msgSuccess!); connect(); celebrate(); }
        else say('error', d.msgError!);
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
    say('success', d.msgMailto!);
    connect(); celebrate();
  });

  return () => { ac.abort(); if (raf) clearTimeout(raf); };
}
