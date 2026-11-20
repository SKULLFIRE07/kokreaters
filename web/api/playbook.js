/**
 * POST /api/playbook — the gated "3-MCPD and GE playbook for refiners" download (src/components/ui/PlaybookCard.astro,
 * brief item 34). Vercel Function, Node runtime, Web-standard handler.
 *
 * Accepts JSON, multipart or urlencoded:
 *   name (≤ 120), company (≤ 160), email (≤ 254, format), country (≤ 80)   all required
 *   consent          required tick box: "Send me the playbook. KoKreaters may contact me about it."
 *   newsletter       optional tick box: The KoKreaters Note
 *   company_website  honeypot · started_at time trap (as /api/contact) · page_url optional
 * Same-origin guard; per-IP rate limit (5 per 10 minutes, in memory, best effort).
 *
 * Delivery (Resend → FormSubmit, as /api/contact):
 *   the lead → office@ (CONTACT_TO), reply-to the visitor;
 *   the visitor → PLAYBOOK_URL set (an https URL): an email with the PDF link; unset: an email saying the playbook will
 *     be sent as soon as it is published (Part K 15). The site shows "Thank you. The playbook is on its way to your
 *     inbox." either way.
 *   newsletter ticked → Brevo double opt-in as /api/subscribe when Brevo is configured (best effort: a Brevo error never
 *     fails the download); the lead email says whether it was ticked either way.
 *   FORMS_DRY_RUN=1 (or CONTACT_DRY_RUN=1) → validate and log only; nothing is sent.
 * Responses: 200 { ok: true } · 400 { ok: false, error: 'invalid', fields } · 403 · 413 · 429 · 502.
 */
import { json, methodNotAllowed, clientIp, originAllowed, rateLimiter, readBody, parseFields } from './_lib/http.js';
import { deliver, dryRun, visitorEmail, oneLine, EMAIL_RE, ticked } from './_lib/mail.js';
import { brevoConfigured, brevoDoubleOptIn } from './subscribe.js';

const MAX_BODY = 16 * 1024;
const MIN_MS = 3000;
const limit = rateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export const TITLE = 'The 3-MCPD and GE playbook for refiners';
export const CONSENT_TEXT = 'Send me the playbook. KoKreaters may contact me about it.';
const REPLY_LINE = 'If you would like to talk about your own plant, reply to this email. Ganeaysh reads every message personally and replies within two working days.';

export const FIELDS = [
  { name: 'name', label: 'Name', max: 120 },
  { name: 'company', label: 'Company', max: 160 },
  { name: 'email', label: 'Email', max: 254, email: true },
  { name: 'country', label: 'Country', max: 80 },
];

export function validate(input) {
  const values = {};
  const errors = {};
  for (const f of FIELDS) {
    const v = f.email ? oneLine(input[f.name]).toLowerCase() : oneLine(input[f.name]);
    values[f.name] = v;
    if (!v) errors[f.name] = 'required';
    else if (v.length > f.max) errors[f.name] = 'length';
    else if (f.email && !EMAIL_RE.test(v)) errors[f.name] = 'email';
  }
  values.consent = ticked(input.consent);
  values.newsletter = ticked(input.newsletter);
  if (!values.consent) errors.consent = 'required';
  return { values, errors };
}

/** The PDF link, only when PLAYBOOK_URL is a valid https URL. */
export function playbookUrl() {
  const raw = (process.env.PLAYBOOK_URL || '').trim();
  if (!raw) return null;
  try { const u = new URL(raw); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}

const NOTE_LINE = 'You also asked for The KoKreaters Note. To confirm that subscription, please reply to this email.';

/** `confirmNote`: the newsletter box was ticked and Brevo is not connected, so the visitor confirms it by replying. */
export function visitorMessage(url = playbookUrl(), { confirmNote = false } = {}) {
  const extra = confirmNote ? [NOTE_LINE] : [];
  if (url) {
    return {
      subject: `Your copy of ${TITLE}`,
      ...visitorEmail([
        `Thank you for your interest in ${TITLE}: a step-by-step plant guide, from raw material to post-refining.`,
        'You can download the PDF with the link below.',
        REPLY_LINE,
        ...extra,
      ], { label: 'Download the playbook (PDF)', href: url }),
    };
  }
  return {
    subject: TITLE,
    ...visitorEmail([
      `Thank you for requesting ${TITLE}: a step-by-step plant guide, from raw material to post-refining.`,
      'We are putting the finishing touches to it now, and we will send it to this address as soon as it is published.',
      REPLY_LINE,
      ...extra,
    ]),
  };
}

export function leadMessage(v, page, { url = playbookUrl(), newsletter = 'not ticked', confirmNote = false } = {}) {
  return {
    tag: 'playbook',
    subject: `Playbook download: ${v.name}, ${v.company}`.replace(/[\r\n]+/g, ' ').slice(0, 200),
    heading: `Playbook request: ${TITLE}`,
    rows: [
      ...FIELDS.map((f) => [f.label, v[f.name]]),
      ['Consent', `Yes: “${CONSENT_TEXT}”`],
      ['The KoKreaters Note', newsletter],
      ['PDF sent', url ? `Yes: ${url}` : 'Not yet: PLAYBOOK_URL is not set, so the visitor was told it follows on publication'],
      ['Sent from', page || ''],
    ],
    footer: `Reply to this email to answer ${v.name} directly.`,
    visitor: visitorMessage(url, { confirmNote }),
    replyTo: v.email,
    page,
  };
}

export async function POST(request) {
  if (!originAllowed(request)) return json(403, { ok: false, error: 'origin' });
  const rl = limit(clientIp(request));
  if (!rl.ok) return json(429, { ok: false, error: 'rate_limited' }, { 'Retry-After': String(rl.retryAfter) });

  const text = await readBody(request, MAX_BODY);
  if (text === null) return json(413, { ok: false, error: 'too_large' });
  let input;
  try { input = await parseFields(request, text); } catch { return json(400, { ok: false, error: 'bad_body' }); }

  if (String(input.company_website ?? '').trim() !== '') return json(200, { ok: true });
  const started = Number(input.started_at);
  const elapsed = Date.now() - started;
  if (!Number.isFinite(started) || started <= 0 || (elapsed >= 0 && elapsed < MIN_MS)) return json(200, { ok: true });

  const { values, errors } = validate(input);
  if (Object.keys(errors).length) return json(400, { ok: false, error: 'invalid', fields: errors });
  const page = oneLine(input.page_url || request.headers.get('referer') || '').slice(0, 300);

  if (dryRun()) {
    console.log('playbook: dry run', JSON.stringify({ ...values, pdf: Boolean(playbookUrl()), page }));
    return json(200, { ok: true });
  }

  let newsletter = 'not ticked';
  let confirmNote = false;
  if (values.newsletter) {
    newsletter = 'Ticked: the visitor was asked to confirm by replying; add them to the list once they have';
    confirmNote = true;
    if (brevoConfigured()) {
      try {
        await brevoDoubleOptIn(values.email);
        newsletter = 'Ticked: Brevo double opt-in email sent';
        confirmNote = false;
      } catch (e) { console.error('playbook: brevo failed', e.message); }
    }
  }
  try {
    await deliver(leadMessage(values, page, { newsletter, confirmNote }), request);
  } catch (e) {
    console.error('playbook: delivery failed', e.message);
    return json(502, { ok: false, error: 'delivery' });
  }
  return json(200, { ok: true });
}

export const GET = methodNotAllowed;
