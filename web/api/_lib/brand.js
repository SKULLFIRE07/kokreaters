import { escapeHtml } from './http.js';

/** The full-colour network logo, wordmark, gold arrow and tagline used on V5. */
export function emailSignature() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || 'kokreaters-v5.vercel.app';
  const origin = `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  return `<p style="margin:24px 0 12px;"><a href="https://kokreaters.com"><img src="${escapeHtml(origin)}/brand/kokreaters-logo-A-navy-600.png" width="240" alt="KoKreaters: Connect, Collaborate, Create" style="display:block;max-width:100%;height:auto;border:0;"></a></p>`;
}
