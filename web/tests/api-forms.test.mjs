/**
 * Node tests for /api/subscribe and /api/playbook (pack 2, brief items 33–34): `node --test tests/api-forms.test.mjs`.
 * No network and no email: global fetch is mocked (api.resend.com, formsubmit.co, api.brevo.com) and every call is
 * recorded, so the payloads can be checked. The dry-run path (FORMS_DRY_RUN=1) must make no call at all.
 */
import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const calls = [];
let brevoStatus = 201;
let brevoBody = '';
let resendFails = false;

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  const headers = new Headers(init.headers ?? {});
  calls.push({ url, headers, body: typeof init.body === 'string' ? init.body : '' });
  if (url.startsWith('https://api.resend.com/')) {
    return resendFails ? new Response('domain not verified', { status: 403 }) : new Response(JSON.stringify({ id: 'r_1' }), { status: 200 });
  }
  if (url.startsWith('https://formsubmit.co/')) return new Response(JSON.stringify({ success: 'true' }), { status: 200 });
  if (url.startsWith('https://api.brevo.com/')) return new Response(brevoBody, { status: brevoStatus });
  throw new Error(`unexpected fetch ${url}`);
};

const ORIGIN = 'https://kokreaters.com';
let ipN = 0;
const req = (path, body, { headers = {} } = {}) => new Request(`${ORIGIN}${path}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin: ORIGIN, host: 'kokreaters.com', 'x-forwarded-for': `198.51.100.${++ipN}`, ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const started = () => String(Date.now() - 60_000);
const sub = (over = {}) => ({ email: 'Ada@Example.com', consent: 'yes', company_website: '', started_at: started(), page_url: 'https://kokreaters.com/insights', ...over });
const lead = (over = {}) => ({ name: 'Ada Lovelace', company: 'Analytical Oils', email: 'ada@example.com', country: 'United Kingdom', consent: 'yes', company_website: '', started_at: started(), ...over });

const ENV = ['RESEND_API_KEY', 'FORMS_DRY_RUN', 'CONTACT_DRY_RUN', 'BREVO_API_KEY', 'BREVO_LIST_ID', 'BREVO_DOI_TEMPLATE_ID', 'BREVO_REDIRECT_URL', 'PLAYBOOK_URL', 'CONTACT_TO'];
let subscribe, playbook;
before(async () => {
  subscribe = await import('../api/subscribe.js');
  playbook = await import('../api/playbook.js');
});
beforeEach(() => { calls.length = 0; brevoStatus = 201; brevoBody = ''; resendFails = false; for (const k of ENV) delete process.env[k]; });
const brevoOn = () => Object.assign(process.env, { BREVO_API_KEY: 'xkeysib-test', BREVO_LIST_ID: '7', BREVO_DOI_TEMPLATE_ID: '3' });

/* ── subscribe ── */
test('subscribe: dry run validates and sends nothing', async () => {
  process.env.FORMS_DRY_RUN = '1';
  const res = await subscribe.POST(req('/api/subscribe', sub()));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 0);
});

test('subscribe: CONTACT_DRY_RUN=1 is honoured too', async () => {
  process.env.CONTACT_DRY_RUN = '1';
  brevoOn();
  assert.equal((await subscribe.POST(req('/api/subscribe', sub()))).status, 200);
  assert.equal(calls.length, 0);
});

test('subscribe: Brevo configured → one DOI call with list, template and redirect', async () => {
  brevoOn();
  process.env.BREVO_REDIRECT_URL = 'https://kokreaters.com/insights?subscribed=1';
  const res = await subscribe.POST(req('/api/subscribe', sub()));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  assert.equal(calls[0].headers.get('api-key'), 'xkeysib-test');
  assert.deepEqual(JSON.parse(calls[0].body), { email: 'ada@example.com', includeListIds: [7], templateId: 3, redirectionUrl: 'https://kokreaters.com/insights?subscribed=1' });
});

test('subscribe: Brevo "already a contact" counts as ok, no forward', async () => {
  brevoOn();
  brevoStatus = 400; brevoBody = JSON.stringify({ code: 'duplicate_parameter', message: 'Contact already exist' });
  assert.equal((await subscribe.POST(req('/api/subscribe', sub()))).status, 200);
  assert.equal(calls.length, 1);
});

test('subscribe: Brevo error → forwarded to office@ instead (FormSubmit without a Resend key)', async () => {
  brevoOn();
  brevoStatus = 401; brevoBody = '{"code":"unauthorized"}';
  assert.equal((await subscribe.POST(req('/api/subscribe', sub()))).status, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, 'https://formsubmit.co/ajax/office%40kokreaters.com');
});

test('subscribe: no Brevo, no Resend → FormSubmit forward with reply-to and a confirm-by-reply autoresponse', async () => {
  const res = await subscribe.POST(req('/api/subscribe', sub()));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  const b = JSON.parse(calls[0].body);
  assert.equal(b._subject, 'Newsletter sign-up: ada@example.com');
  assert.equal(b._replyto, 'ada@example.com');
  assert.equal(b.email, 'ada@example.com');
  assert.match(b.Consent, /I would like to receive The KoKreaters Note/);
  assert.match(b._autoresponse, /please reply to this email/);
});

test('subscribe: no Brevo, Resend key → forward to office@ and confirm-by-reply email to the visitor', async () => {
  process.env.RESEND_API_KEY = 're_test';
  assert.equal((await subscribe.POST(req('/api/subscribe', sub()))).status, 200);
  assert.equal(calls.length, 2);
  const [a, b] = calls.map((c) => JSON.parse(c.body));
  assert.deepEqual(a.to, ['office@kokreaters.com']);
  assert.equal(a.reply_to, 'ada@example.com');
  assert.deepEqual(b.to, ['ada@example.com']);
  assert.equal(b.subject, 'Please confirm your subscription to The KoKreaters Note');
  assert.doesNotMatch(b.html, /<script/);
});

test('subscribe: Resend error → FormSubmit fallback', async () => {
  process.env.RESEND_API_KEY = 're_test';
  resendFails = true;
  assert.equal((await subscribe.POST(req('/api/subscribe', sub()))).status, 200);
  assert.equal(calls.at(-1).url, 'https://formsubmit.co/ajax/office%40kokreaters.com');
});

test('subscribe: validation (email, consent)', async () => {
  let res = await subscribe.POST(req('/api/subscribe', sub({ email: 'not-an-email', consent: '' })));
  assert.equal(res.status, 400);
  assert.deepEqual((await res.json()).fields, { email: 'email', consent: 'required' });
  res = await subscribe.POST(req('/api/subscribe', sub({ email: '' })));
  assert.deepEqual((await res.json()).fields, { email: 'required' });
  assert.equal(calls.length, 0);
});

test('subscribe: honeypot and time trap look successful and send nothing', async () => {
  assert.equal((await subscribe.POST(req('/api/subscribe', sub({ company_website: 'spam.example' })))).status, 200);
  assert.equal((await subscribe.POST(req('/api/subscribe', sub({ started_at: String(Date.now()) })))).status, 200);
  assert.equal((await subscribe.POST(req('/api/subscribe', sub({ started_at: '' })))).status, 200);
  assert.equal(calls.length, 0);
});

test('subscribe: foreign origin is refused; urlencoded bodies work', async () => {
  process.env.FORMS_DRY_RUN = '1';
  assert.equal((await subscribe.POST(req('/api/subscribe', sub(), { headers: { origin: 'https://evil.example' } }))).status, 403);
  const body = new URLSearchParams(sub()).toString();
  assert.equal((await subscribe.POST(req('/api/subscribe', body, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }))).status, 200);
});

test('subscribe: rate limit after 5 requests from one IP', async () => {
  process.env.FORMS_DRY_RUN = '1';
  const r = () => subscribe.POST(req('/api/subscribe', sub(), { headers: { 'x-forwarded-for': '192.0.2.200' } }));
  for (let i = 0; i < 5; i++) assert.equal((await r()).status, 200);
  assert.equal((await r()).status, 429);
});

/* ── playbook ── */
test('playbook: dry run sends nothing', async () => {
  process.env.FORMS_DRY_RUN = '1';
  assert.equal((await playbook.POST(req('/api/playbook', lead({ newsletter: 'yes' })))).status, 200);
  assert.equal(calls.length, 0);
});

test('playbook: required fields and consent', async () => {
  const res = await playbook.POST(req('/api/playbook', lead({ name: '', company: ' ', email: 'x@', country: '', consent: '' })));
  assert.equal(res.status, 400);
  assert.deepEqual((await res.json()).fields, { name: 'required', company: 'required', email: 'email', country: 'required', consent: 'required' });
  assert.equal(calls.length, 0);
});

test('playbook: no PLAYBOOK_URL → lead to office@ and a "sent as soon as it is published" visitor email (Resend)', async () => {
  process.env.RESEND_API_KEY = 're_test';
  assert.equal((await playbook.POST(req('/api/playbook', lead()))).status, 200);
  assert.equal(calls.length, 2);
  const [a, b] = calls.map((c) => JSON.parse(c.body));
  assert.deepEqual(a.to, ['office@kokreaters.com']);
  assert.equal(a.subject, 'Playbook download: Ada Lovelace, Analytical Oils');
  assert.equal(a.reply_to, 'ada@example.com');
  assert.match(a.text, /Country: United Kingdom/);
  assert.match(a.text, /PDF sent: Not yet/);
  assert.deepEqual(b.to, ['ada@example.com']);
  assert.match(b.text, /as soon as it is published/);
  assert.doesNotMatch(b.text, /https:\/\/files/);
});

test('playbook: PLAYBOOK_URL → the visitor email carries the link', async () => {
  process.env.RESEND_API_KEY = 're_test';
  process.env.PLAYBOOK_URL = 'https://files.kokreaters.com/3-mcpd-ge-playbook.pdf';
  assert.equal((await playbook.POST(req('/api/playbook', lead()))).status, 200);
  const b = JSON.parse(calls[1].body);
  assert.equal(b.subject, 'Your copy of The 3-MCPD and GE playbook for refiners');
  assert.match(b.text, /Download the playbook \(PDF\): https:\/\/files\.kokreaters\.com\/3-mcpd-ge-playbook\.pdf/);
  assert.match(b.html, /href="https:\/\/files\.kokreaters\.com\/3-mcpd-ge-playbook\.pdf"/);
});

test('playbook: a non-https PLAYBOOK_URL is ignored', () => {
  process.env.PLAYBOOK_URL = 'javascript:alert(1)';
  assert.equal(playbook.playbookUrl(), null);
  process.env.PLAYBOOK_URL = 'http://example.com/a.pdf';
  assert.equal(playbook.playbookUrl(), null);
});

test('playbook: no Resend key → FormSubmit with the visitor email as autoresponse; newsletter tick asks to confirm', async () => {
  assert.equal((await playbook.POST(req('/api/playbook', lead({ newsletter: 'yes' })))).status, 200);
  assert.equal(calls.length, 1);
  const b = JSON.parse(calls[0].body);
  assert.equal(b._replyto, 'ada@example.com');
  assert.match(b['The KoKreaters Note'], /^Ticked/);
  assert.match(b._autoresponse, /as soon as it is published/);
  assert.match(b._autoresponse, /To confirm that subscription, please reply/);
});

test('playbook: newsletter tick with Brevo configured → DOI call, then the lead', async () => {
  brevoOn();
  process.env.RESEND_API_KEY = 're_test';
  assert.equal((await playbook.POST(req('/api/playbook', lead({ newsletter: 'on' })))).status, 200);
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  const a = JSON.parse(calls[1].body);
  assert.match(a.text, /The KoKreaters Note: Ticked: Brevo double opt-in email sent/);
  assert.doesNotMatch(JSON.parse(calls[2].body).text, /To confirm that subscription/);
});

test('playbook: honeypot and time trap send nothing', async () => {
  assert.equal((await playbook.POST(req('/api/playbook', lead({ company_website: 'x' })))).status, 200);
  assert.equal((await playbook.POST(req('/api/playbook', lead({ started_at: String(Date.now() - 500) })))).status, 200);
  assert.equal(calls.length, 0);
});

test('playbook: visitor-supplied text never lands in the visitor email, and is escaped in the lead', async () => {
  process.env.RESEND_API_KEY = 're_test';
  await playbook.POST(req('/api/playbook', lead({ name: '<script>x</script> Ada', company: 'Oils & Fats <b>' })));
  const [a, b] = calls.map((c) => JSON.parse(c.body));
  assert.doesNotMatch(a.html, /<script>/);
  assert.match(a.html, /&lt;script&gt;/);
  assert.doesNotMatch(b.text + b.html, /Ada|Oils/);
});
