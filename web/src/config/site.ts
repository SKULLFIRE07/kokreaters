/**
 * Site-wide configuration (DESIGN-SPEC 4.2).
 * Env vars are read at build time; every one is optional and has a safe default.
 */
const env = import.meta.env;

export const site = {
  name: 'KoKreaters',
  url: 'https://kokreaters.com',
  /** staging (default, local dev) | preview (the Vercel review link) | production (kokreaters.com). See src/lib/mode.ts. */
  mode: (env.PUBLIC_SITE_MODE === 'production' || env.PUBLIC_SITE_MODE === 'preview' ? env.PUBLIC_SITE_MODE : 'staging') as
    'staging' | 'preview' | 'production',
  /** Opt-in: only a production build with PUBLIC_INDEXABLE=1 is indexable (forgetting it gives noindex, never an indexed preview). */
  indexable: env.PUBLIC_SITE_MODE === 'production' && env.PUBLIC_INDEXABLE === '1',
  email: 'office@kokreaters.com',                              // CONFIRM 9
  whatsapp: { display: '+31 6 2215 7910', href: 'https://wa.me/31622157910' },
  linkedin: { display: 'linkedin.com/in/ganeayshkulkarni', href: 'https://www.linkedin.com/in/ganeayshkulkarni' },
  /** The KoKreaters LinkedIn company page (brief items 37, 38, 40; Part K 14). null until Ganeaysh sends the URL:
   *  footer link and JSON-LD Organization.sameAs are omitted while it is null. */
  linkedinCompany: null as string | null,
  base: 'Based in the Netherlands, working worldwide',
  /** Pack 3 lead decision 2: Calendly / Microsoft Bookings URL (env PUBLIC_BOOKING_URL), null until Ganeaysh sends it.
   *  Never read directly for a button: use bookingHref() from '@/lib/booking' (falls back to /contact#start). */
  bookingUrl: ((env.PUBLIC_BOOKING_URL as string | undefined) || null) as string | null,      // CONFIRM 9
  /**
   * Contact form endpoint. Default: the same-origin Vercel Function /api/contact (Resend, or FormSubmit until a Resend
   * key is set; see ../CHATBOT-AND-EMAIL-SETUP.md). 'none' = no endpoint (mailto only). An absolute URL posts there.
   */
  formEndpoint: env.PUBLIC_FORM_ENDPOINT === 'none' ? '' : (env.PUBLIC_FORM_ENDPOINT as string | undefined) || '/api/contact',
  newsletterEndpoint: (env.PUBLIC_NEWSLETTER_ENDPOINT as string | undefined) || '',
  turnstileSiteKey: (env.PUBLIC_TURNSTILE_SITEKEY as string | undefined) || '',
  analytics: env.PUBLIC_ANALYTICS === '1',
  /** Pack 3: cookie-free Plausible analytics, off by default. Set PUBLIC_PLAUSIBLE_DOMAIN (e.g. kokreaters.com) to load it.
   *  Events: book-call, form-send, playbook-download (src/lib/analytics.ts). */
  plausibleDomain: ((env.PUBLIC_PLAUSIBLE_DOMAIN as string | undefined) || null) as string | null,
  /** V5 combined brief: no assistant is rendered or shipped in the browser. */
  chat: false,
  legal: { registration: null as string | null },             // CONFIRM 11 e.g. "KvK 00000000 · VAT NL000000000B00"
  trademark: '™',                                             // CONFIRM 12
} as const;

export type Site = typeof site;
