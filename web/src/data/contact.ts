/** Contact page copy and form fields (DESIGN-SPEC 4.10; brief 6.8). */
import type { ContactField } from './types';
import { pillars } from './pillars';

export const contact = {
  overline: 'Contact',
  headline: 'Let’s create something together.',
  intro: 'Tell us a little about your challenge. Ganeaysh reads every message personally and replies within one working day.',   // CONFIRM 9
  details: { email: 'Email', whatsapp: 'WhatsApp', linkedin: 'LinkedIn' },
  booking: 'Book a 30-minute call',
  submit: 'Send',            // COMPOSED (C-16)
  visitorFallback: 'You',    // COMPOSED (connection moment)
};

export const notSureYet = 'Not sure yet';

/**
 * Fields in brief order. Labels exactly as written. Interest, message and source carry no `autocomplete` token on
 * purpose: `autocomplete="off"` also stops the browser restoring the typed value on Back, which loses the message.
 */
export const fields: ContactField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, autocomplete: 'name', maxLength: 120 },
  { name: 'company', label: 'Company', type: 'text', required: true, autocomplete: 'organization', maxLength: 160 },
  { name: 'role', label: 'Role', type: 'text', required: false, autocomplete: 'organization-title', maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 254 },
  { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: false, autocomplete: 'tel', maxLength: 40 },
  { name: 'country', label: 'Country', type: 'text', required: true, autocomplete: 'country-name', maxLength: 80 },
  { name: 'interest', label: 'Area of interest', type: 'select', required: true, options: [...pillars.map((p) => p.name), notSureYet] },
  { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 6, maxLength: 5000 },
  { name: 'source', label: 'How did you hear about us?', type: 'text', required: false, maxLength: 200 },
  { name: 'consent', label: 'I agree to KoKreaters storing my details to respond to this enquiry, as described in the privacy policy.', type: 'checkbox', required: true },
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
