/**
 * Node test harness for the Vercel Functions in /api (no network, no email sent): `npm run test:api`.
 * Calls the Web-standard handlers with real Request objects and a mocked global fetch that stands in for
 * api.resend.com, formsubmit.co and api.anthropic.com (SSE), then checks validation, traps, limits, the delivery
 * payloads and the Claude request shape (model, caching, thinking, fallbacks, workspace header).
 */
import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const calls = [];
let anthropicReply = 'Hello from the mock.';
let override = null;   // per-test fetch replacement (the SDK keeps the fetch it was constructed with)

function sse(events) {
  return events.map(([event, data]) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`).join('');
}
function anthropicStream(text) {
  const parts = text.match(/.{1,6}/gs) ?? [];
  const msg = { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-sonnet-5-5', content: [], stop_reason: null, stop_sequence: null,
    usage: { input_tokens: 12, output_tokens: 1, cache_read_input_tokens: 8000, cache_creation_input_tokens: 0 } };
  return sse([
    ['message_start', { type: 'message_start', message: msg }],
    ['content_block_start', { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }],
    ...parts.map((p) => ['content_block_delta', { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: p } }]),
    ['content_block_stop', { type: 'content_block_stop', index: 0 }],
    ['message_delta', { type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 20 } }],
    ['message_stop', { type: 'message_stop' }],
  ]);
}

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  const headers = new Headers(init.headers ?? (typeof input === 'string' ? {} : input.headers));
  const body = init.body ?? null;
  if (override) return override(url, init);
  calls.push({ url, headers, body: typeof body === 'string' ? body : body ? await new Response(body).text() : '' });
  if (url.startsWith('https://api.resend.com/')) return new Response(JSON.stringify({ id: 'r_1' }), { status: 200 });
  if (url.startsWith('https://formsubmit.co/')) return new Response(JSON.stringify({ success: 'true' }), { status: 200 });
  if (url.startsWith('https://openrouter.ai/')) {
    const chunks = (anthropicReply.match(/.{1,5}/gs) ?? []).map((t) => `data: ${JSON.stringify({ choices: [{ delta: { content: t }, finish_reason: null }] })}\n\n`);
    const tail = `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`;
    return new Response(`: OPENROUTER PROCESSING\n\n${chunks.join('')}${tail}`, { status: 200, headers: { 'content-type': 'text/event-stream' } });
  }
  if (url.startsWith('https://api.anthropic.com/')) {
    return new Response(anthropicStream(anthropicReply), { status: 200, headers: { 'content-type': 'text/event-stream' } });
  }
  throw new Error(`unexpected fetch ${url}`);
};

const ORIGIN = 'https://kokreaters.com';
const req = (path, body, { headers = {}, ip = '203.0.113.1' } = {}) => new Request(`${ORIGIN}${path}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin: ORIGIN, host: 'kokreaters.com', 'x-forwarded-for': ip, ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const valid = (over = {}) => ({
  name: 'Ada Lovelace', company: 'Analytical Oils', role: 'COO', email: 'ada@example.com', phone: '', country: 'United Kingdom',
  interest: 'Process development and plant performance', message: 'We need help with a refinery.\nSecond line.', source: '',
  consent: 'yes', company_website: '', started_at: String(Date.now() - 60_000), ...over,
});
/** Pack 3: the /contact page sends only these four required fields (plus the traps); no consent tick box. */
const minimal = (over = {}) => ({
  name: 'Ada Lovelace', email: 'ada@example.com', company: 'Analytical Oils', message: 'We need help with a refinery.',
  company_website: '', started_at: String(Date.now() - 60_000), ...over,
});
async function readNdjson(res) {
  const text = await res.text();
  return text.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

let contact, chat;
before(async () => {
  delete process.env.RESEND_API_KEY;
  contact = await import('../api/contact.js');
  chat = await import('../api/chat.js');
});
beforeEach(() => { calls.length = 0; for (const k of ['RESEND_API_KEY', 'CONTACT_DRY_RUN', 'CHAT_MOCK', 'ANTHROPIC_API_KEY', 'CHAT_MODEL', 'OPENROUTER_API_KEY']) delete process.env[k]; });

/* ── contact ── */
test('contact: no RESEND_API_KEY → FormSubmit JSON with reply-to, subject and autoresponse', async () => {
  const res = await contact.POST(req('/api/contact', valid(), { ip: '10.0.0.1' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://formsubmit.co/ajax/office%40kokreaters.com');
  const b = JSON.parse(calls[0].body);
  assert.equal(b._replyto, 'ada@example.com');
  assert.equal(b._subject, 'New enquiry: Ada Lovelace, Analytical Oils');
  assert.match(b._autoresponse, /^Thank you for getting in touch with KoKreaters\. We have received your message and will reply by email\.$/);
  assert.equal(b.Name, 'Ada Lovelace');
  assert.equal(b['Consent to store details'], 'Yes');
  assert.equal(calls[0].headers.get('referer') !== null, true);
});

test('contact: RESEND_API_KEY → enquiry to office@ (reply_to visitor) + confirmation to visitor', async () => {
  process.env.RESEND_API_KEY = 're_test';
  const res = await contact.POST(req('/api/contact', valid({ chat_transcript: 'Q: What does KoKreaters do?\nA: …', via: 'chat' }), { ip: '10.0.0.2' }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 2);
  const [a, b] = calls.map((c) => JSON.parse(c.body));
  assert.equal(calls[0].headers.get('authorization'), 'Bearer re_test');
  assert.equal(a.from, 'KoKreaters website <website@kokreaters.com>');
  assert.deepEqual(a.to, ['office@kokreaters.com']);
  assert.equal(a.reply_to, 'ada@example.com');
  assert.equal(a.subject, 'New enquiry: Ada Lovelace, Analytical Oils');
  assert.match(a.text, /Chat transcript:\nQ: What does KoKreaters do\?/);
  assert.match(a.html, /<table/);
  assert.doesNotMatch(a.html, /<script/);
  assert.deepEqual(b.to, ['ada@example.com']);
  assert.match(b.text, /Thank you for getting in touch with KoKreaters\. We have received your message and will reply by email\./);
});

test('contact: env overrides for sender and recipients', async () => {
  process.env.RESEND_API_KEY = 're_test';
  process.env.RESEND_FROM = 'KoKreaters <hello@mail.kokreaters.com>';
  process.env.CONTACT_TO = 'a@example.com, b@example.com';
  try {
    await contact.POST(req('/api/contact', valid(), { ip: '10.0.0.3' }));
    const a = JSON.parse(calls[0].body);
    assert.equal(a.from, 'KoKreaters <hello@mail.kokreaters.com>');
    assert.deepEqual(a.to, ['a@example.com', 'b@example.com']);
  } finally { delete process.env.RESEND_FROM; delete process.env.CONTACT_TO; }
});

test('contact: multipart FormData (the /contact page) is accepted', async () => {
  process.env.CONTACT_DRY_RUN = '1';
  const fd = new FormData();
  for (const [k, v] of Object.entries(valid())) fd.append(k, v);
  const r = new Request(`${ORIGIN}/api/contact`, { method: 'POST', body: fd, headers: { origin: ORIGIN, host: 'kokreaters.com', 'x-forwarded-for': '10.0.0.4' } });
  const res = await contact.POST(r);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('contact: validation errors per field', async () => {
  const res = await contact.POST(req('/api/contact', valid({ name: '', email: 'not-an-email', interest: 'Astrology', consent: '', message: 'x'.repeat(5001) }), { ip: '10.0.0.5' }));
  assert.equal(res.status, 400);
  const b = await res.json();
  assert.deepEqual(b.fields, { name: 'required', email: 'email', interest: 'option', message: 'length' });
  assert.equal(calls.length, 0);
});

test('contact: required fields are only name, email, company and message (pack 3)', async () => {
  const res = await contact.POST(req('/api/contact', { company_website: '', started_at: String(Date.now() - 60_000) }, { ip: '10.0.0.6' }));
  assert.equal(res.status, 400);
  const b = await res.json();
  assert.deepEqual(b.fields, { name: 'required', email: 'required', company: 'required', message: 'required' });
  assert.equal(calls.length, 0);
});

test('contact: the four required fields alone are accepted; country, interest and consent are optional', async () => {
  const res = await contact.POST(req('/api/contact', minimal(), { ip: '10.0.0.7' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  const b = JSON.parse(calls[0].body);
  assert.equal(b.Company, 'Analytical Oils');
  assert.equal(b.Country, '');
  assert.equal(b['Area of interest'], '');
  assert.equal('Consent to store details' in b, false);   // no tick box on the page: no consent row in the email
});

test('contact: honeypot and time trap look successful and send nothing', async () => {
  for (const [i, over] of [{ company_website: 'http://spam' }, { started_at: String(Date.now() - 500) }, { started_at: '' }].entries()) {
    const res = await contact.POST(req('/api/contact', valid(over), { ip: `10.0.1.${i}` }));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
  }
  assert.equal(calls.length, 0);
});

test('contact: rate limit (5 per 10 minutes per IP), cross-origin and size guards', async () => {
  process.env.CONTACT_DRY_RUN = '1';
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await contact.POST(req('/api/contact', valid(), { ip: '10.0.2.1' }))).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
  assert.equal((await contact.POST(req('/api/contact', valid(), { ip: '10.0.2.2', headers: { origin: 'https://evil.example' } }))).status, 403);
  assert.equal((await contact.POST(req('/api/contact', JSON.stringify(valid({ message: 'x'.repeat(40_000) })), { ip: '10.0.2.3' }))).status, 413);
});

test('contact: Resend error → FormSubmit fallback', async () => {
  process.env.RESEND_API_KEY = 're_test';
  override = async (url) => (url.startsWith('https://api.resend.com/')
    ? new Response('{"message":"The kokreaters.com domain is not verified"}', { status: 403 })
    : new Response('{"success":"true"}', { status: 200 }));
  try {
    const res = await contact.POST(req('/api/contact', valid(), { ip: '10.0.3.2' }));
    assert.equal(res.status, 200);
  } finally { override = null; }
});

test('contact: delivery failure → 502', async () => {
  process.env.RESEND_API_KEY = 're_test';
  override = async () => new Response('{"message":"domain not verified"}', { status: 403 });
  try {
    const res = await contact.POST(req('/api/contact', valid(), { ip: '10.0.3.1' }));
    assert.equal(res.status, 502);
  } finally { override = null; }
});

/* ── chat ── */
const convo = (q = 'What does KoKreaters do?') => ({ messages: [{ role: 'user', content: q }] });

test('chat: no ANTHROPIC_API_KEY → 503 unavailable', async () => {
  const res = await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.1' }));
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { ok: false, error: 'unavailable' });
});

test('chat: CHAT_MOCK=1 streams NDJSON deltas then end, without calling the API', async () => {
  process.env.CHAT_MOCK = '1';
  const res = await chat.POST(req('/api/chat', convo('Which industries do you work with?'), { ip: '10.1.0.2' }));
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/x-ndjson/);
  const ev = await readNdjson(res);
  assert.equal(ev.at(-1).t, 'end');
  assert.match(ev.filter((e) => e.t === 'd').map((e) => e.v).join(''), /nine industries/);
  assert.equal(calls.length, 0);
});

test('chat: Claude request shape (Sonnet 5.5 default, cached system prompt, effort low, between_tools, fallbacks, workspace header)', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  process.env.ANTHROPIC_WORKSPACE_ID = 'wrkspc_test';
  anthropicReply = 'We work from the plant floor to the boardroom.';
  const res = await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.3' }));
  const ev = await readNdjson(res);
  assert.equal(ev.map((e) => e.v ?? '').join(''), anthropicReply);
  assert.equal(ev.at(-1).t, 'end');
  const call = calls.find((c) => c.url.startsWith('https://api.anthropic.com/'));
  assert.ok(call, 'Anthropic API called');
  assert.match(call.url, /^https:\/\/api\.anthropic\.com\/v1\/messages/);
  assert.equal(call.headers.get('authorization'), 'Bearer sk-ant-test');   // SDK 1.x sends the key as a bearer token
  assert.equal(call.headers.get('anthropic-workspace-id'), 'wrkspc_test');
  assert.match(call.headers.get('anthropic-beta') ?? '', /server-side-fallback-2026-07-01/);
  const b = JSON.parse(call.body);
  assert.equal(b.model, 'claude-sonnet-5-5');
  assert.equal(b.max_tokens, 400);
  assert.equal(b.stream, true);
  assert.deepEqual(b.thinking, { type: 'between_tools' });
  assert.deepEqual(b.output_config, { effort: 'low' });
  assert.equal(b.fallbacks, 'default');
  assert.equal(b.system.length, 1);
  assert.deepEqual(b.system[0].cache_control, { type: 'ephemeral' });
  assert.match(b.system[0].text, /<knowledge_base>[\s\S]*Process development and plant performance[\s\S]*<\/knowledge_base>/);
  assert.ok(b.system[0].text.length > 20_000, 'knowledge base is large enough to cache');
  assert.ok(!('temperature' in b) && !('top_p' in b) && !('betas' in b));
});

test('chat: OPENROUTER_API_KEY → OpenRouter chat/completions (system + history, 400 tokens, temp 0.3, SSE parsed)', async () => {
  process.env.OPENROUTER_API_KEY = 'sk-or-test';
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';   // OpenRouter wins when both are set
  anthropicReply = 'We start where the problem lives.';
  const res = await chat.POST(req('/api/chat', { messages: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello.' }, { role: 'user', content: 'How does an engagement start?' }] }, { ip: '10.1.0.9' }));
  const ev = await readNdjson(res);
  assert.equal(ev.filter((e) => e.t === 'd').map((e) => e.v).join(''), anthropicReply);
  assert.equal(ev.at(-1).t, 'end');
  assert.equal(calls.length, 1);
  const c = calls[0];
  assert.equal(c.url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.equal(c.headers.get('authorization'), 'Bearer sk-or-test');
  assert.equal(c.headers.get('http-referer'), 'https://kokreaters.com');
  assert.equal(c.headers.get('x-title'), 'KoKreaters website');
  const b = JSON.parse(c.body);
  assert.equal(b.model, 'google/gemini-2.5-flash-lite');
  assert.equal(b.max_tokens, 400);
  assert.equal(b.temperature, 0.3);
  assert.equal(b.stream, true);
  assert.equal(b.messages[0].role, 'system');
  assert.match(b.messages[0].content, /<knowledge_base>/);
  assert.deepEqual(b.messages.slice(1).map((m) => m.role), ['user', 'assistant', 'user']);
});

test('chat: OpenRouter honours CHAT_MODEL; HTTP error → error event', async () => {
  process.env.OPENROUTER_API_KEY = 'sk-or-test';
  process.env.CHAT_MODEL = 'openai/gpt-4o-mini';
  const res = await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.10' }));
  await res.text();
  assert.equal(JSON.parse(calls[0].body).model, 'openai/gpt-4o-mini');
  override = async () => new Response('{"error":{"message":"Insufficient credits"}}', { status: 402 });
  try {
    const ev = await readNdjson(await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.11' })));
    assert.deepEqual(ev.at(-1), { t: 'error', code: 'unavailable' });
  } finally { override = null; }
});

test('chat: Anthropic fallback ignores a non-Claude CHAT_MODEL', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  process.env.CHAT_MODEL = 'google/gemini-2.5-flash-lite';
  await (await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.12' }))).text();
  assert.equal(JSON.parse(calls.find((c) => c.url.startsWith('https://api.anthropic.com/')).body).model, 'claude-sonnet-5-5');
});

test('chat: CHAT_MODEL override (Haiku 5.5 → thinking disabled, no fallbacks)', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  process.env.CHAT_MODEL = 'claude-haiku-5-5';
  const res = await chat.POST(req('/api/chat', convo(), { ip: '10.1.0.4' }));
  await res.text();
  const b = JSON.parse(calls.find((c) => c.url.startsWith('https://api.anthropic.com/')).body);
  assert.equal(b.model, 'claude-haiku-5-5');
  assert.deepEqual(b.thinking, { type: 'disabled' });
  assert.ok(!('fallbacks' in b));
});

test('chat: caps (1,000 chars, 8 user turns, last 12 messages to the model, alternating roles)', async () => {
  process.env.CHAT_MOCK = '1';
  assert.equal((await chat.POST(req('/api/chat', convo('x'.repeat(1001)), { ip: '10.1.1.1' }))).status, 413);
  const many = [];
  for (let i = 0; i < 9; i++) many.push({ role: 'user', content: `q${i}` }, { role: 'assistant', content: `a${i}` });
  many.pop();
  const r9 = await chat.POST(req('/api/chat', { messages: many }, { ip: '10.1.1.2' }));
  assert.equal(r9.status, 429);
  assert.equal((await r9.json()).error, 'turn_limit');
  const eight = many.slice(0, 15);
  const n = chat.normalise({ messages: eight });
  assert.equal(n.messages.length, 11);   // last 12, trimmed to start with a user turn
  assert.equal(n.messages[0].role, 'user');
  assert.equal(n.messages.at(-1).content, 'q7');
  assert.equal(chat.normalise({ messages: [{ role: 'assistant', content: 'hi' }] }).error, 'invalid');
  assert.equal(chat.normalise({ messages: [{ role: 'system', content: 'hi' }] }).error, 'invalid');
  assert.equal(chat.normalise({ messages: [{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }] }).messages[0].content, 'a\n\nb');
});

test('chat: per-IP rate limit (20 per 10 minutes)', async () => {
  process.env.CHAT_MOCK = '1';
  const codes = [];
  for (let i = 0; i < 21; i++) { const r = await chat.POST(req('/api/chat', convo(), { ip: '10.1.2.1' })); codes.push(r.status); await r.body?.cancel(); }
  assert.equal(codes.filter((c) => c === 200).length, 20);
  assert.equal(codes.at(-1), 429);
});

test('chat: API error mid-request → error event, not a crash', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  override = async () => new Response(JSON.stringify({ type: 'error', error: { type: 'rate_limit_error', message: 'slow down' } }), { status: 429, headers: { 'content-type': 'application/json' } });
  try {
    const res = await chat.POST(req('/api/chat', convo(), { ip: '10.1.3.1' }));
    const ev = await readNdjson(res);
    assert.deepEqual(ev.at(-1), { t: 'error', code: 'busy' });
  } finally { override = null; }
});

test('GET → 405', async () => {
  assert.equal(contact.GET().status, 405);
  assert.equal(chat.GET().status, 405);
});
