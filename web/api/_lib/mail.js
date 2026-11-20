/**
 * Shared mail delivery for /api/subscribe and /api/playbook (the same Resend → FormSubmit path as /api/contact, which
 * keeps its own copy so its behaviour is unchanged). Web-standard fetch only, no dependencies.
 *
 *   RESEND_API_KEY set → Resend REST API; on a Resend error (e.g. the domain is not verified yet) the internal email
 *     goes through FormSubmit instead (CONTACT_FORMSUBMIT_FALLBACK=0 turns that off).
 *   no RESEND_API_KEY → FormSubmit (https://formsubmit.co/ajax/<CONTACT_TO>) as JSON; its `_autoresponse` carries the
 *     visitor's plain-text email.
 *   FORMS_DRY_RUN=1 (or CONTACT_DRY_RUN=1) → nothing is sent; the caller logs instead.
 */
import { CONTACT_EMAIL } from './knowledge.js';
import { escapeHtml } from './http.js';

export const dryRun = () => process.env.FORMS_DRY_RUN === '1' || process.env.CONTACT_DRY_RUN === '1';
export const recipients = () => (process.env.CONTACT_TO || CONTACT_EMAIL || 'office@kokreaters.com').split(',').map((s) => s.trim()).filter(Boolean);
export const sender = () => process.env.RESEND_FROM || 'KoKreaters website <website@kokreaters.com>';

export const clean = (v) => String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
export const oneLine = (v) => clean(v).replace(/\s+/g, ' ');
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ticked = (v) => v === true || ['yes', 'on', 'true', '1'].includes(String(v ?? '').toLowerCase());

/** Internal notification: a heading and label/value rows, as text and as a simple table. */
export function tableEmail(heading, rows, footer = '') {
  const text = [heading, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', footer].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n').trim();
  const cell = 'padding:10px 14px;border-bottom:1px solid #D9E0EC;vertical-align:top;font:15px/1.5 Arial,Helvetica,sans-serif;';
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#EEF2F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#FFFFFF;border-collapse:collapse;">
<tr><td colspan="2" style="padding:20px 14px;background:#0E1F4D;color:#FFFFFF;font:600 18px/1.3 Georgia,'Times New Roman',serif;">${escapeHtml(heading)}</td></tr>
${rows.map(([k, v]) => `<tr><th align="left" style="${cell}width:30%;color:#4A5878;font-weight:600;">${escapeHtml(k)}</th><td style="${cell}color:#0E1F4D;white-space:pre-wrap;">${escapeHtml(v) || '<span style="color:#8A8A85;">(not given)</span>'}</td></tr>`).join('\n')}
${footer ? `<tr><td colspan="2" style="padding:14px;font:13px/1.5 Arial,sans-serif;color:#4A5878;">${escapeHtml(footer)}</td></tr>` : ''}
</table></body></html>`;
  return { text, html };
}

/** Visitor email: fixed copy only (paragraphs; an optional link button). No visitor-supplied text goes into it. */
export function visitorEmail(paragraphs, link) {
  const sign = 'KoKreaters\nConnect · Collaborate · Create\nhttps://kokreaters.com';
  const text = [...paragraphs, ...(link ? [`${link.label}: ${link.href}`] : []), '', sign].join('\n\n').replace(/\n{3,}/g, '\n\n');
  const p = (s) => `<tr><td style="padding:0 28px 16px;font:17px/1.6 Arial,Helvetica,sans-serif;color:#0E1F4D;">${escapeHtml(s)}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#EEF2F8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-collapse:collapse;">
<tr><td style="padding:22px 28px;background:#0E1F4D;color:#FFFFFF;font:600 20px/1.2 Georgia,'Times New Roman',serif;">KoKreaters</td></tr>
<tr><td style="height:28px;"></td></tr>
${paragraphs.map(p).join('\n')}
${link ? `<tr><td style="padding:4px 28px 24px;"><a href="${escapeHtml(link.href)}" style="display:inline-block;padding:14px 24px;background:#1C3F94;color:#FFFFFF;font:700 15px/1.2 Arial,Helvetica,sans-serif;text-decoration:none;">${escapeHtml(link.label)}</a></td></tr>` : ''}
<tr><td style="padding:16px 28px 28px;font:14px/1.5 Arial,Helvetica,sans-serif;color:#4A5878;">KoKreaters · Connect · Collaborate · Create<br><a href="https://kokreaters.com" style="color:#1C3F94;">kokreaters.com</a></td></tr>
</table></body></html>`;
  return { text, html };
}

export async function resendSend(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json().catch(() => ({}));
}

/** FormSubmit JSON post to the first recipient. `fields` = label → value; `opts` = subject, replyTo, autoresponse, page. */
export async function formSubmitSend(fields, { subject, replyTo, autoresponse, page }, request) {
  const to = recipients()[0];
  const body = { ...fields, _subject: subject, _template: 'table', _captcha: 'false' };
  if (replyTo) { body._replyto = replyTo; body.email = replyTo; }
  if (autoresponse) body._autoresponse = autoresponse;
  const origin = request.headers.get('origin') || 'https://kokreaters.com';
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin, Referer: page || `${origin}/` },
    body: JSON.stringify(body),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || String(out.success) !== 'true') throw new Error(`formsubmit ${res.status}: ${JSON.stringify(out).slice(0, 300)}`);
}

/**
 * Deliver one internal notification to office@ (reply-to the visitor) and one fixed-copy email to the visitor.
 * Resend: two emails (a visitor-email failure is logged, the lead still counts as delivered). Resend error or no key:
 * FormSubmit, with the visitor email as its plain-text autoresponse.
 */
export async function deliver({ subject, heading, rows, footer, visitor, replyTo, page, tag }, request) {
  const internal = tableEmail(heading, rows, footer);
  const viaFormSubmit = () => formSubmitSend(
    Object.fromEntries(rows),
    { subject, replyTo, autoresponse: visitor ? visitor.text : undefined, page },
    request,
  );
  if (process.env.RESEND_API_KEY) {
    try {
      await resendSend({ from: sender(), to: recipients(), reply_to: replyTo, subject, text: internal.text, html: internal.html });
    } catch (e) {
      console.error(`${tag}: resend failed, falling back to FormSubmit`, e.message);
      if (process.env.CONTACT_FORMSUBMIT_FALLBACK === '0') throw e;
      await viaFormSubmit();
      return;
    }
    if (visitor) {
      try {
        await resendSend({ from: sender(), to: [replyTo], reply_to: recipients()[0], subject: visitor.subject, text: visitor.text, html: visitor.html });
      } catch (e) {
        console.error(`${tag}: visitor email failed`, e.message);   // the lead itself went through
      }
    }
    return;
  }
  await viaFormSubmit();
}
