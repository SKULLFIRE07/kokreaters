/** Contact page copy and form fields (DESIGN-SPEC 4.10; brief 6.8). */
import type { ContactField } from './types';
import { pillars } from './pillars';

export const contact = {
  overline: 'Contact',
  headline: 'Let’s create something together.',
  /** Item 36; V6 brief Table 10: "We typically reply within two working days." */
  intro: 'Tell us a little about your challenge. We typically reply within two working days.',
  details: { email: 'Email', whatsapp: 'WhatsApp', linkedin: 'LinkedIn', linkedinFounder: 'LinkedIn, Ganeaysh', linkedinCompany: 'LinkedIn, KoKreaters' },
  /** Pack 3: the booking block's heading (= bookingLabel in @/lib/booking). */
  booking: 'Book a 30-minute call',
  submit: 'Send',            // COMPOSED (C-16)
  visitorFallback: 'You',    // COMPOSED (connection moment)
};

export const notSureYet = 'Not sure yet';

/** Part K 1: the city. Until it is confirmed the line reads "Based in the Netherlands" (items 20, 36). */
const city: string | null = null;
export const location = {
  city,
  line: city ? `Based in ${city}, the Netherlands` : 'Based in the Netherlands',
};

/**
 * Part K 14: the KoKreaters LinkedIn company page (item 37), shown next to the founder's profile once it exists.
 * `null` = hidden outside staging. (If src/config/site.ts gains a single `linkedinCompany`, read it from there.)
 */
export const linkedinCompany: { href: string; display: string } | null = null;

/** Item 36: "What happens next", under the form. */
export const nextSteps = {
  heading: 'What happens next',
  steps: [
    'You share your context, by form, email or a booked call.',
    'We speak for 30 minutes, at no cost.',
    'You receive a short proposal with scope and stages.',
    'We start, under NDA.',
  ],
};

/**
 * Pack 3 (brief, Contact): required fields only Name, Email, Company and Message; Country and Area of interest are
 * optional (as are Role, Phone and Source). Order: the four the visitor must give first in the grid's reading order
 * (Name · Email, Company · Role), the optional details next, the message last. Interest, message and source carry no
 * `autocomplete` token on purpose: `autocomplete="off"` also stops the browser restoring the typed value on Back.
 * The consent entry stays in this list, optional, for the chat widget's inline form (ChatWidget.astro, CHROME-HOME,
 * which still renders its own tick box). The contact page shows no tick box: replying to an enquiry needs no consent
 * (GDPR Art. 6(1)(b)/(f)), so it shows `contactPage.privacyNote` above Send instead, and api/contact.js no longer
 * requires it (generated into api/_lib/knowledge.js CONTACT_FIELDS by scripts/build-knowledge.mjs).
 */
export const fields: ContactField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, autocomplete: 'name', maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 254 },
  { name: 'company', label: 'Company', type: 'text', required: true, autocomplete: 'organization', maxLength: 160 },
  { name: 'role', label: 'Role', type: 'text', required: false, autocomplete: 'organization-title', maxLength: 120 },
  { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: false, autocomplete: 'tel', maxLength: 40 },
  { name: 'country', label: 'Country', type: 'text', required: false, autocomplete: 'country-name', maxLength: 80 },
  { name: 'interest', label: 'Area of interest', type: 'select', required: false, options: [...pillars.map((p) => p.name), notSureYet] },
  { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 6, maxLength: 5000 },
  { name: 'source', label: 'How did you hear about us?', type: 'text', required: false, maxLength: 200 },
  { name: 'consent', label: 'I agree to KoKreaters storing my details to respond to this enquiry, as described in the privacy policy.', type: 'checkbox', required: false },
];

/**
 * The consent label's link: the substring "privacy policy" links to /privacy (sentence case, like the page's H1).
 * It opens in a new tab: it sits in the last line before Send, and leaving the page mid-form must never cost the
 * visitor what they typed (Chrome on Android does not restore every field on Back).
 */
export const consentLink = { text: 'privacy policy', href: '/privacy', newTab: 'opens in a new tab' };   // newTab COMPOSED (screen-reader note)

/**
 * v3 contact page labels (REDESIGN-V3 §4 Contact). Plain UI labels, all COMPOSED; the facts they sit next to
 * (email, WhatsApp, LinkedIn, base, reply time) come from @/config/site, @/data/nav and `contact` above.
 */
export const contactPage = {
  detailsHeading: 'Contact details',                 // COMPOSED
  formHeading: 'Send a message',                     // COMPOSED
  requiredNote: 'Fields marked * are required.',     // COMPOSED
  /** Pack 3: the contact page's privacy line above Send (no tick box). "privacy policy" links to /privacy. COMPOSED. */
  privacyNote: 'We use your details only to reply to your enquiry, as described in the privacy policy.',
  /** Pack 3 (brief, Contact): the time zone, shown with the contact details. */
  timezoneLabel: 'Time zone',
  timezone: 'CET, the Netherlands',
  /** Booking block, first on the page once PUBLIC_BOOKING_URL exists (lead decision 2). COMPOSED. */
  bookingLine: 'Pick a time that suits you. Thirty minutes, at no cost.',
  formHeadingAfterBooking: 'Or send a message',      // COMPOSED
  selectPlaceholder: 'Choose an area',               // COMPOSED (blank first option of "Area of interest")
  consentRequired: 'Please tick the box so we can reply.',   // COMPOSED (consent checkbox error; "fill this in" does not fit a tick box)
  /** Thank-you panel that replaces the form once it is sent (endpoint) or handed to the mail app (mailto). */
  done: {
    sentHeading: 'Message sent',                     // COMPOSED; body = microcopy.formSuccess
    mailtoHeading: 'One more step',                  // COMPOSED; body = microcopy.mailtoSent
    again: 'Send another message',                   // COMPOSED (endpoint: the form is cleared)
    back: 'Back to the form',                        // COMPOSED (mailto: the form keeps what was typed)
    reopen: 'Open the email again',                  // COMPOSED (mailto)
  },
};
