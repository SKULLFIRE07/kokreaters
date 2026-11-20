/**
 * POST /api/subscribe — "The KoKreaters Note" sign-up (src/components/ui/NewsletterForm.astro, brief item 33).
 * Vercel Function, Node runtime, Web-standard handler.
 *
 * Accepts JSON, multipart or urlencoded:
 *   email            required, ≤ 254, email format
 *   consent          required tick box ("yes")
 *   company_website  honeypot: filled → { ok: true } and nothing is sent
 *   started_at       time trap: ms timestamp of page load; missing, or sent < 3 s after it → { ok: true }, nothing sent
 *   page_url         optional, the page it was sent from (logged in the forward)
 * Same-origin guard; per-IP rate limit (5 per 10 minutes, in memory, best effort).
 *
 * Delivery:
 *   BREVO_API_KEY + BREVO_LIST_ID + BREVO_DOI_TEMPLATE_ID set → Brevo double opt-in
 *     (POST https://api.brevo.com/v3/contacts/doubleOptinConfirmation): Brevo emails the confirmation link from the DOI
 *     template; the address joins list BREVO_LIST_ID only once it is clicked, then the browser lands on
 *     BREVO_REDIRECT_URL (default https://kokreaters.com/insights). An address that is already a contact counts as ok.
 *   otherwise, or when Brevo fails → the sign-up is forwarded to office@ through the same Resend → FormSubmit path as
 *     /api/contact, and the visitor gets a fixed-copy email asking them to confirm by replying (a manual double opt-in
 *     until Brevo is connected).
 *   FORMS_DRY_RUN=1 (or CONTACT_DRY_RUN=1) → validate and log only; nothing is sent.
 * Responses: 200 { ok: true } · 400 { ok: false, error: 'invalid', fields: { email: 'required' | 'email' | 'length',
 *   consent: 'required' } } · 403 origin · 413 too large · 429 rate limited · 502 delivery failed.
 */
import { json, methodNotAllowed, clientIp, originAllowed, rateLimiter, readBody, parseFields } from './_lib/http.js';
import { deliver, dryRun, visitorEmail, oneLine, EMAIL_RE, ticked } from './_lib/mail.js';

const MAX_BODY = 8 * 1024;
const MIN_MS = 3000;
const limit = rateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/** The consent sentence the visitor ticked (brief item 33), recorded with the sign-up. */
export const CONSENT_TEXT = 'I would like to receive The KoKreaters Note. I can unsubscribe at any time. See the privacy policy.';

export function validate(input) {
  const values = { email: oneLine(input.email).toLowerCase(), consent: ticked(input.consent) };
  const errors = {};
  if (!values.email) errors.email = 'required';
  else if (values.email.length > 254) errors.email = 'length';
  else if (!EMAIL_RE.test(values.email)) errors.email = 'email';
  if (!values.consent) errors.consent = 'required';
  return { values, errors };
}

export const brevoConfigured = () => Boolean(process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID && process.env.BREVO_DOI_TEMPLATE_ID);

/** Brevo double opt-in. Resolves on 2xx (and on "already a contact"); throws otherwise. */
export async function brevoDoubleOptIn(email, attributes = {}) {
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!Number.isInteger(listId) || !Number.isInteger(templateId)) throw new Error('brevo: BREVO_LIST_ID and BREVO_DOI_TEMPLATE_ID must be numbers');
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: process.env.BREVO_REDIRECT_URL || 'https://kokreaters.com/insights',
      ...(Object.keys(attributes).length ? { attributes } : {}),
    }),
  });
  if (res.ok) return;
  const text = await res.text();
  if (res.status === 400 && /duplicate/i.test(text)) return;   // already a contact: nothing to add, no error for the visitor
  throw new Error(`brevo ${res.status}: ${text.slice(0, 300)}`);
}

/** Fixed-copy email for the fallback path: the visitor confirms by replying (COMPOSED). */
export function confirmByReplyEmail() {
  const mail = visitorEmail([
    'Thank you for signing up for The KoKreaters Note: one practical idea a month, from the plant floor and the boardroom.',
    'To confirm your subscription, please reply to this email. If you did not sign up, ignore this message and you will not hear from us.',
  ]);
  return { subject: 'Please confirm your subscription to The KoKreaters Note', ...mail };
}

export function forwardMessage(v, page) {
  return {
    tag: 'subscribe',
    subject: `Newsletter sign-up: ${v.email}`.slice(0, 200),
    heading: 'New sign-up for The KoKreaters Note',
    rows: [['Email', v.email], ['Consent', `Yes: “${CONSENT_TEXT}”`], ['Sent from', page || '']],
    footer: 'Brevo is not connected yet, so the visitor was asked to confirm by replying. Add the address to the newsletter list once they have.',
    visitor: confirmByReplyEmail(),
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

  if (String(input.company_website ?? input.website ?? '').trim() !== '') return json(200, { ok: true });
  const started = Number(input.started_at);
  const elapsed = Date.now() - started;
  if (!Number.isFinite(started) || started <= 0 || (elapsed >= 0 && elapsed < MIN_MS)) return json(200, { ok: true });

  const { values, errors } = validate(input);
  if (Object.keys(errors).length) return json(400, { ok: false, error: 'invalid', fields: errors });
  const page = oneLine(input.page_url || request.headers.get('referer') || '').slice(0, 300);

  if (dryRun()) {
    console.log('subscribe: dry run', JSON.stringify({ email: values.email, via: brevoConfigured() ? 'brevo' : 'forward', page }));
    return json(200, { ok: true });
  }
  try {
    if (brevoConfigured()) {
      try { await brevoDoubleOptIn(values.email); return json(200, { ok: true }); }
      catch (e) { console.error('subscribe: brevo failed, forwarding to office@', e.message); }
    }
    await deliver(forwardMessage(values, page), request);
  } catch (e) {
    console.error('subscribe: delivery failed', e.message);
    return json(502, { ok: false, error: 'delivery' });
  }
  return json(200, { ok: true });
}

export const GET = methodNotAllowed;
