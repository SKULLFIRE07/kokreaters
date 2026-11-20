/**
 * Newsletter and playbook copy (pack 2, brief items 33 and 34). Brief copy is verbatim; labels marked COMPOSED are
 * plain UI strings the brief does not give. Read by ui/NewsletterForm.astro, ui/PlaybookCard.astro and
 * src/scripts/forms.ts (through data-* attributes); the endpoints are the same-origin functions api/subscribe.js and
 * api/playbook.js.
 */
import type { Unconfirmed } from './types';

/** "The KoKreaters Note" (item 33). */
export const newsletter = {
  heading: 'The KoKreaters Note',
  line: 'One practical idea a month, from the plant floor and the boardroom. No spam. Unsubscribe in one click.',
  emailLabel: 'Email',
  placeholder: 'Email address',                                                    // COMPOSED
  consent: 'I would like to receive The KoKreaters Note. I can unsubscribe at any time. See the privacy policy.',
  /** The substring of `consent` that links to /privacy (opens in a new tab, so a half-filled form is never lost). */
  consentLink: { text: 'privacy policy', href: '/privacy', newTab: 'opens in a new tab' },
  button: 'Subscribe',
  success: 'Thank you. Please check your inbox to confirm your subscription.',
  invalid: 'Please enter a valid email address.',                                  // COMPOSED
  consentRequired: 'Please tick the box to subscribe.',                           // COMPOSED
  error: 'Something went wrong. Please try again, or email office@KoKreaters.com.', // COMPOSED (= microcopy.formError)
  /** No-JS fallback: the form hands off to the mail app with this subject. */
  mailtoSubject: 'Subscribe to The KoKreaters Note',                               // COMPOSED
  endpoint: '/api/subscribe',
};

/** Gated playbook download (item 34). */
export const playbook = {
  title: 'The 3-MCPD and GE playbook for refiners',
  line: 'A step-by-step plant guide, from raw material to post-refining. Free download (PDF).',
  button: 'Download the playbook',
  label: 'Free download · PDF',                                                    // COMPOSED (card label row)
  /** Modal form. The dialog's heading is the card title; the lead-in is the card line. */
  fields: {
    name: 'Name',
    company: 'Company',
    email: 'Email',
    country: 'Country',
  },
  consent: 'Send me the playbook. KoKreaters may contact me about it.',
  /** The optional, separate box: item 33's consent sentence without its privacy pointer (the form already links it). */
  newsletterOptIn: 'I would like to receive The KoKreaters Note. I can unsubscribe at any time.',
  submit: 'Send me the playbook',                                                  // COMPOSED
  close: 'Close',                                                                  // COMPOSED
  requiredNote: 'Fields marked * are required.',                                   // COMPOSED (= contactPage.requiredNote)
  required: 'Please fill this in.',                                                // COMPOSED
  invalidEmail: 'Please enter a valid email address.',                             // COMPOSED
  consentRequired: 'Please tick the box so we can send the playbook.',             // COMPOSED
  thanks: 'Thank you. The playbook is on its way to your inbox.',
  error: 'Something went wrong. Please try again, or email office@KoKreaters.com.', // COMPOSED
  mailtoSubject: 'Please send me the 3-MCPD and GE playbook',                      // COMPOSED (no-JS fallback)
  endpoint: '/api/playbook',
  /** Part K 15: the PDF itself. Until PLAYBOOK_URL is set on the server, the visitor email says it follows on publication. */
  pdf: { confirmed: false, confirm: 'P-15', note: 'playbook PDF to follow: set PLAYBOOK_URL on Vercel; until then the email says it will be sent once published' } satisfies Unconfirmed,
};
