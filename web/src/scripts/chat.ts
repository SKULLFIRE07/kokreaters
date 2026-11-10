/**
 * "Ask KoKreaters" behaviour (src/components/chrome/ChatWidget.astro). NOT in the initial bundle: site.ts imports this
 * module on the first hover / focus / click of the launcher and calls boot(); then open() if it was a click.
 *  - dialog: open/close (Esc, close button), focus trap, focus returns to the launcher, scroll lock on phones
 *  - chat: POST { messages } to /api/chat, reads the NDJSON stream ({t:'d',v} … {t:'end'} | refusal | error), renders
 *    plain text with short "- " lists and internal /paths as links; typing dots until the first token; the finished
 *    answer goes to the polite live region once (no token-by-token announcements)
 *  - after the 5th answer: the owner's hand-off line + the inline form; after 8 questions the composer closes
 *    (the server enforces the same caps). "Share your details" opens the form any time.
 *  - inline form: same checks as the contact page (required, email, consent, honeypot), JSON POST to /api/contact with
 *    chat_transcript; success → thank-you state in the chat
 *  - the conversation survives page navigation in sessionStorage (this tab only)
 */
type Msg = { role: 'user' | 'assistant'; content: string };
type State = { h: Msg[]; n: number; f: boolean; s: boolean; x: boolean };

const KEY = 'kk-chat';
const HANDOFF_AT = 5;
const MAX_TURNS = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATH_RE = /(^|[\s(])(\/(?:expertise(?:\/[a-z-]+)?|industries|approach|impact|insights(?:\/[a-z0-9-]+)?|about|contact))(?=[\s).,;:!?]|$)/g;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

let root: HTMLElement;
let ready = false;
const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;

let st: State = { h: [], n: 0, f: false, s: false, x: false };
const load = () => { try { const v = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (v && Array.isArray(v.h)) st = v; } catch { /* private mode */ } };
const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch { /* ignore */ } };

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = () => matchMedia('(max-width: 599px)').matches;

/* ── Rendering ── */
function inline(parent: HTMLElement, text: string) {
  let last = 0;
  for (const m of text.matchAll(PATH_RE)) {
    const at = (m.index ?? 0) + m[1].length;
    parent.append(text.slice(last, at));
    const a = document.createElement('a');
    a.href = m[2]; a.textContent = m[2];
    parent.append(a);
    last = at + m[2].length;
  }
  parent.append(text.slice(last));
}
function renderText(el: HTMLElement, text: string) {
  el.textContent = '';
  const clean = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');
  let ul: HTMLUListElement | null = null;
  for (const raw of clean.split('\n')) {
    const lineText = raw.trim();
    if (!lineText) { ul = null; continue; }
    const item = lineText.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (item) {
      if (!ul) { ul = document.createElement('ul'); el.append(ul); }
      const li = document.createElement('li'); inline(li, item[1]); ul.append(li);
    } else {
      ul = null;
      const p = document.createElement('p'); inline(p, lineText); el.append(p);
    }
  }
}
function add(kind: 'user' | 'bot' | 'note' | 'error', text = ''): HTMLLIElement {
  const li = document.createElement('li');
  li.className = `kc-msg kc-msg--${kind}`;
  const d = root.dataset;
  const who = document.createElement('span');
  who.className = 'visually-hidden';
  who.textContent = `${kind === 'user' ? d.msgYou : d.msgBot}: `;
  if (kind === 'error') li.insertAdjacentHTML('afterbegin', root.querySelector('template[data-icon="error"]')?.innerHTML ?? '');
  const body = document.createElement('div');
  li.append(who, body);
  if (kind === 'user') body.textContent = text; else renderText(body, text);
  $('[data-chat-log]').append(li);
  return li;
}
function scrollEnd() {
  const s = $('[data-chat-scroll]');
  s.scrollTo({ top: s.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' });
}
const announce = (t: string) => { const l = $('[data-chat-live]'); l.textContent = ''; setTimeout(() => { l.textContent = t; }, 60); };

/* ── Composer ── */
function setComposer(on: boolean) {
  const i = $<HTMLTextAreaElement>('[data-chat-input]');
  i.disabled = !on; $<HTMLButtonElement>('[data-chat-send]').disabled = !on;
}
function grow() { const i = $<HTMLTextAreaElement>('[data-chat-input]'); i.style.height = 'auto'; i.style.height = `${Math.min(i.scrollHeight, 132)}px`; }

/* ── Form ── */
function showForm(focus: boolean) {
  const wrap = $('[data-chat-form-wrap]');
  wrap.hidden = false;
  $('[data-chat-scroll]').append(wrap);       // always after the latest message
  if (!st.f) { st.f = true; save(); }
  if (st.s) { $('[data-chat-form-body]').hidden = true; $('[data-chat-done]').hidden = false; }
  if (focus) {
    const s = $('[data-chat-scroll]');
    s.scrollTo({ top: s.scrollTop + wrap.getBoundingClientRect().top - s.getBoundingClientRect().top - 16, behavior: reduced() ? 'auto' : 'smooth' });
    (st.s ? $('[data-chat-done-title]') : $('#kc-f-title')).focus({ preventScroll: true });
  }
}
function transcript(): string {
  const d = root.dataset;
  return `${d.msgTranscript}:\n\n${st.h.map((m) => `${m.role === 'user' ? d.msgYou : d.msgBot}: ${m.content}`).join('\n\n')}`.slice(0, 7900);
}
function initForm() {
  const form = $<HTMLFormElement>('[data-chat-form]');
  const d = root.dataset;
  const status = $('[data-chat-form-status]');
  const submit = $<HTMLButtonElement>('[data-chat-form-submit]');
  const loadedAt = Math.round(performance.timeOrigin || Date.now() - performance.now());
  type Ctl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const ctls = () => Array.from(form.querySelectorAll<Ctl>('.kc-f__field input, .kc-f__field select, .kc-f__field textarea'));
  const check = (f: Ctl): string | null => {
    if (f instanceof HTMLInputElement && f.type === 'checkbox') return f.required && !f.checked ? d.msgConsent! : null;
    const v = f.value.trim();
    if (f.required && !v) return d.msgRequired!;
    if (f.name === 'email' && v && !EMAIL_RE.test(v)) return d.msgEmail!;
    return null;
  };
  const mark = (f: Ctl, msg: string | null) => {
    const e = form.querySelector<HTMLElement>(`#kc-${f.name}-error`);
    if (msg) { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', `kc-${f.name}-error`); }
    else { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); }
    if (e) { e.hidden = !msg; e.querySelector('[data-error-text]')!.textContent = msg ?? ''; }
  };
  ctls().forEach((f) => f.addEventListener(f.tagName === 'SELECT' || (f as HTMLInputElement).type === 'checkbox' ? 'change' : 'input',
    () => { if (f.getAttribute('aria-invalid') === 'true') mark(f, check(f)); }));
  const done = () => {
    st.s = true; save();
    $('[data-chat-form-body]').hidden = true;
    $('[data-chat-done]').hidden = false;
    $('[data-chat-done-title]').focus({ preventScroll: true });
    announce($('[data-chat-done]').textContent?.trim() ?? '');
  };
  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    status.textContent = '';
    if ((form.elements.namedItem('company_website') as HTMLInputElement).value.trim()) { done(); return; }
    let first: Ctl | null = null;
    for (const f of ctls()) { const m = check(f); mark(f, m); if (m && !first) first = f; }
    if (first) { first.focus(); return; }
    const body: Record<string, string> = {};
    for (const f of ctls()) body[f.name] = f instanceof HTMLInputElement && f.type === 'checkbox' ? (f.checked ? 'yes' : '') : f.value;
    Object.assign(body, { company_website: '', started_at: String(loadedAt), chat_transcript: transcript(), via: 'chat', page_url: location.href });
    sending = true; submit.disabled = true; submit.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(d.contact!, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { form.reset(); done(); }
      else {
        const out = res.status === 400 ? await res.json().catch(() => null) as { fields?: Record<string, string> } | null : null;
        const bad = Object.entries(out?.fields ?? {}).map(([n, why]) => [form.elements.namedItem(n) as Ctl | null, why] as const).filter(([f]) => f);
        bad.forEach(([f, why]) => mark(f!, why === 'email' ? d.msgEmail! : why === 'required' ? d.msgRequired! : d.msgFormError!));
        if (bad.length) bad[0][0]!.focus(); else status.textContent = d.msgFormError!;
      }
    } catch { status.textContent = d.msgFormError!; }
    finally { sending = false; submit.disabled = false; submit.removeAttribute('aria-busy'); }
  });
}

/* ── Asking ── */
let busy = false;
async function ask(q: string) {
  const text = q.trim();
  const d = root.dataset;
  if (!text || busy || st.x) return;
  if (text.length > 1000) { add('error', d.msgTooLong); scrollEnd(); return; }
  busy = true; setComposer(false);
  $('[data-chat-suggest]').hidden = true;
  add('user', text);
  st.h.push({ role: 'user', content: text });
  const typing = (root.querySelector<HTMLTemplateElement>('template[data-tpl="typing"]')!.content.firstElementChild!.cloneNode(true)) as HTMLElement;
  $('[data-chat-log]').append(typing);
  scrollEnd();
  announce(d.msgWriting!);

  let answer = '';
  let li: HTMLLIElement | null = null;
  let fail: string | null = null;
  let frame = 0;
  const paint = () => { frame = 0; if (li) renderText(li.lastElementChild as HTMLElement, answer); scrollEnd(); };
  try {
    const res = await fetch(d.endpoint!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: st.h }) });
    if (!res.ok || !res.body) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      fail = res.status === 503 ? 'unavailable' : err.error === 'turn_limit' ? 'limit' : res.status === 429 ? 'busy' : 'error';
    } else {
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const raw = buf.slice(0, i); buf = buf.slice(i + 1);
          if (!raw.trim()) continue;
          const ev = JSON.parse(raw) as { t: string; v?: string; code?: string };
          if (ev.t === 'd' && ev.v) {
            if (!li) { typing.remove(); li = add('bot'); li.classList.add('is-streaming'); }
            answer += ev.v;
            if (!frame) frame = requestAnimationFrame(paint);
          } else if (ev.t === 'refusal') fail = 'refusal';
          else if (ev.t === 'error') fail = ev.code === 'unavailable' ? 'unavailable' : ev.code === 'busy' ? 'busy' : 'error';
        }
      }
    }
  } catch { fail = 'error'; }
  if (frame) cancelAnimationFrame(frame);
  typing.remove();
  busy = false;

  if (fail || !answer.trim()) {
    li?.remove();
    st.h.pop();                                   // the question goes again next time
    const key = fail ?? 'error';
    const msg = { unavailable: d.msgUnavailable, busy: d.msgBusy, limit: d.msgLimit, refusal: d.msgRefusal }[key] ?? d.msgError!;
    add(key === 'refusal' ? 'note' : 'error', msg);
    announce(msg!);
    if (key === 'unavailable' || key === 'limit') { st.x = true; showForm(false); }
    else setComposer(true);
    save(); scrollEnd();
    if (!st.x && !phone()) $<HTMLTextAreaElement>('[data-chat-input]').focus();
    return;
  }
  paint();
  li?.classList.remove('is-streaming');
  st.h.push({ role: 'assistant', content: answer.trim() });
  st.n += 1;
  announce(`${d.msgBot}: ${answer.trim()}`);
  if (st.n === HANDOFF_AT) { add('note', d.msgHandoff); showForm(false); }
  if (st.h.filter((m) => m.role === 'user').length >= MAX_TURNS) { st.x = true; add('note', d.msgLimit); showForm(false); }
  save();
  setComposer(!st.x);
  scrollEnd();
  if (!st.x && !phone()) $<HTMLTextAreaElement>('[data-chat-input]').focus();
}

/* ── Dialog ── */
let lastFocus: HTMLElement | null = null;
let closeTimer = 0;
export function open() {
  const panel = $('[data-chat-panel]');
  const launcher = $('[data-chat-launcher]');
  if (!panel.hidden && panel.classList.contains('is-open')) return;
  clearTimeout(closeTimer);
  lastFocus = (document.activeElement as HTMLElement) ?? launcher;
  panel.hidden = false;
  document.documentElement.classList.add('chat-open');
  launcher.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-open')));
  const s = $('[data-chat-scroll]');
  s.scrollTop = st.h.length ? s.scrollHeight : 0;
  if (phone() || st.x) $('#kc-title').focus({ preventScroll: true });
  else $<HTMLTextAreaElement>('[data-chat-input]').focus({ preventScroll: true });
}
export function close() {
  const panel = $('[data-chat-panel]');
  if (panel.hidden) return;
  panel.classList.remove('is-open');
  document.documentElement.classList.remove('chat-open');
  const launcher = $('[data-chat-launcher]');
  launcher.setAttribute('aria-expanded', 'false');
  closeTimer = window.setTimeout(() => { panel.hidden = true; }, reduced() ? 0 : 420);
  (lastFocus && lastFocus.isConnected && lastFocus !== document.body ? lastFocus : launcher).focus({ preventScroll: true });
}

export function boot(): void {
  if (ready) return;
  const el = document.querySelector<HTMLElement>('[data-chat]');
  if (!el) return;
  root = el; ready = true;
  load();
  const launcher = $<HTMLButtonElement>('[data-chat-launcher]');
  launcher.dataset.chatReady = 'true';
  launcher.addEventListener('click', () => ($('[data-chat-panel]').hidden ? open() : close()));
  $('[data-chat-close]').addEventListener('click', close);
  $('[data-chat-share]').addEventListener('click', () => showForm(true));
  root.querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => ask(b.dataset.q!)));

  const input = $<HTMLTextAreaElement>('[data-chat-input]');
  const compose = $<HTMLFormElement>('[data-chat-compose]');
  compose.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value; if (!q.trim() || busy) return; input.value = ''; grow(); ask(q); });
  input.addEventListener('input', grow);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); compose.requestSubmit(); }
  });

  const panel = $('[data-chat-panel]');
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && (active === first || !panel.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !panel.contains(active))) { e.preventDefault(); first.focus(); }
  });

  initForm();
  // restore this tab's conversation
  if (st.h.length) {
    $('[data-chat-suggest]').hidden = true;
    let answers = 0;
    for (const m of st.h) {
      add(m.role === 'user' ? 'user' : 'bot', m.content);
      if (m.role === 'assistant' && ++answers === HANDOFF_AT) add('note', root.dataset.msgHandoff);
    }
    if (st.x && st.h.filter((m) => m.role === 'user').length >= MAX_TURNS) add('note', root.dataset.msgLimit);
  }
  if (st.f) showForm(false);
  setComposer(!st.x);
}
