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

/** Fields in brief order. Labels exactly as written. */
export const fields: ContactField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, autocomplete: 'name' },
  { name: 'company', label: 'Company', type: 'text', required: true, autocomplete: 'organization' },
  { name: 'role', label: 'Role', type: 'text', required: false, autocomplete: 'organization-title' },
  { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
  { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: false, autocomplete: 'tel' },
  { name: 'country', label: 'Country', type: 'text', required: true, autocomplete: 'country-name' },
  { name: 'interest', label: 'Area of interest', type: 'select', required: true, autocomplete: 'off', options: [...pillars.map((p) => p.name), notSureYet] },
  { name: 'message', label: 'Message', type: 'textarea', required: true, autocomplete: 'off', rows: 6 },
  { name: 'source', label: 'How did you hear about us?', type: 'text', required: false, autocomplete: 'off' },
  { name: 'consent', label: 'I agree to KoKreaters storing my details to respond to this enquiry, as described in the Privacy Policy.', type: 'checkbox', required: true },
];

/** The consent label's link: the substring "Privacy Policy" links to /privacy. */
export const consentLink = { text: 'Privacy Policy', href: '/privacy' };
