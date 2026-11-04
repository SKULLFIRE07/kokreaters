/**
 * Site-wide configuration (DESIGN-SPEC 4.2).
 * Env vars are read at build time; every one is optional and has a safe default.
 */
const env = import.meta.env;

export const site = {
  name: 'KoKreaters',
  url: 'https://kokreaters.com',
  mode: (env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'staging') as 'staging' | 'production',
  email: 'office@kokreaters.com',                              // CONFIRM 9
  whatsapp: { display: '+31 6 2215 7910', href: 'https://wa.me/31622157910' },
  linkedin: { display: 'linkedin.com/in/ganeayshkulkarni', href: 'https://www.linkedin.com/in/ganeayshkulkarni' },
  base: 'Based in the Netherlands, working worldwide',
  bookingUrl: (env.PUBLIC_BOOKING_URL as string | undefined) || '/contact#form',      // CONFIRM 9
  formEndpoint: (env.PUBLIC_FORM_ENDPOINT as string | undefined) || '',
  newsletterEndpoint: (env.PUBLIC_NEWSLETTER_ENDPOINT as string | undefined) || '',
  turnstileSiteKey: (env.PUBLIC_TURNSTILE_SITEKEY as string | undefined) || '',
  analytics: env.PUBLIC_ANALYTICS === '1',
  legal: { registration: null as string | null },             // CONFIRM 11 e.g. "KvK 00000000 · VAT NL000000000B00"
  trademark: '™',                                             // CONFIRM 12
  motion: { proofCountUp: true },                             // 600 ms count on 25/5/3 (brief 3.7). false = rules draw only
} as const;

export type Site = typeof site;
