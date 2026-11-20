/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** 'staging' (default when unset) | 'preview' (Vercel review link) | 'production'. Read through src/lib/mode.ts. */
  readonly PUBLIC_SITE_MODE?: 'staging' | 'preview' | 'production' | string;
  /** '1' = indexable. Honoured only when PUBLIC_SITE_MODE=production (launch checklist item). */
  readonly PUBLIC_INDEXABLE?: string;
  /** Form POST endpoint. Empty = mailto fallback. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Newsletter endpoint. Empty = mailto:office@kokreaters.com?subject=Subscribe. */
  readonly PUBLIC_NEWSLETTER_ENDPOINT?: string;
  /** Booking URL (Calendly / Microsoft Bookings). Empty = every "Book a call" goes to /contact#start. CONFIRM 9 */
  readonly PUBLIC_BOOKING_URL?: string;
  /** Cloudflare Turnstile site key. Empty = honeypot + time trap only. */
  readonly PUBLIC_TURNSTILE_SITEKEY?: string;
  /** Empty/0 = no analytics and no consent banner. 1 = banner shown. */
  readonly PUBLIC_ANALYTICS?: string;
  /** "on" = "Ask KoKreaters" chat widget; unset or anything else = off (pack 3). */
  readonly PUBLIC_CHAT?: string;
  /** Plausible domain (e.g. kokreaters.com). Empty = no analytics script. */
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
