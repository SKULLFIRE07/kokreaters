/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** 'staging' (default when unset) | 'production'. Read through src/lib/mode.ts. */
  readonly PUBLIC_SITE_MODE?: 'staging' | 'production' | string;
  /** Form POST endpoint. Empty = mailto fallback. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Newsletter endpoint. Empty = mailto:office@kokreaters.com?subject=Subscribe. */
  readonly PUBLIC_NEWSLETTER_ENDPOINT?: string;
  /** Booking URL. Empty = /contact#form. CONFIRM 9 */
  readonly PUBLIC_BOOKING_URL?: string;
  /** Cloudflare Turnstile site key. Empty = honeypot + time trap only. */
  readonly PUBLIC_TURNSTILE_SITEKEY?: string;
  /** Empty/0 = no analytics and no consent banner. 1 = banner shown. */
  readonly PUBLIC_ANALYTICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Set by src/scripts/motion/lenis.ts when smooth scroll is active; undefined under reduced motion. */
  __lenis?: unknown;
}
