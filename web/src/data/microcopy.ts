/**
 * Microcopy (DESIGN-SPEC 4.10). Brief section 7 bank verbatim; every label the brief does not supply
 * carries a `// COMPOSED` comment and is listed in DESIGN-SPEC 8.3 for Ganeaysh’s approval.
 * "→" from the brief is dropped from link labels; the arrow is always <Arrow/> (0.2.9).
 */
export const microcopy = {
  /* ── Brief 7 ── */
  primaryCta: 'Start a conversation',
  bookingCta: 'Book a 30-minute call',
  pillarLink: 'Learn more',
  insightsLink: 'Read the insight',
  impactLink: 'See the impact',
  newsletter: 'Field notes from the plant floor and the boardroom, once a month.', // v3 tone: "No noise." aside dropped
  newsletterButton: 'Subscribe',
  /** Pack 2 item 2: the one reply-time sentence, verbatim everywhere (home CTA band, contact page, chat form). */
  replyTime: 'Ganeaysh reads every message personally and replies within two working days.',
  formSuccess: 'Thank you. Your message is with us. Ganeaysh reads every message personally and replies within two working days.',
  formError: 'Something went wrong. Please try again, or email office@KoKreaters.com.',
  required: 'Please fill this in so we can reply.',
  cookieBanner: 'We use essential cookies to run this site and, with your consent, analytics cookies to improve it.',
  cookieAccept: 'Accept all',
  cookieReject: 'Reject non-essential',
  cookieSettingsButton: 'Settings',
  notFound: 'This page hasn’t been created yet. Let’s connect you back.',
  notFoundHeadline: 'This page hasn’t been created yet.',
  notFoundLine: 'Let’s connect you back.',
  takeHome: 'Take me home',
  notSureWhereYouFit: 'Not sure where you fit?',

  /* ── COMPOSED (8.3) ── */
  skip: 'Skip to content', // COMPOSED
  menu: 'Menu', // COMPOSED
  close: 'Close', // COMPOSED
  invalidEmail: 'Please enter an email address we can reply to.', // COMPOSED
  mailtoSent: 'Your email app should now open with your message ready to send. If it does not, write to office@KoKreaters.com.', // COMPOSED
  featuredInsight: 'Featured insight', // COMPOSED
  allExpertise: 'All expertise', // COMPOSED
  inPreparation: 'In preparation', // COMPOSED
  draftRibbon: 'DRAFT for Ganeaysh’s review', // COMPOSED
  pendingConsent: 'Pending client consent', // COMPOSED
  readingTime: '{n} min read', // COMPOSED
  minutesLeft: '{n} min left', // COMPOSED
  insightsCount: '{n} insights', // COMPOSED
  reconnect: 'Return to the home page', // COMPOSED (v3: was a 404 toy instruction; currently unused)
  cookieSettings: 'Cookie settings', // COMPOSED
  analyticsNotInUse: 'Analytics: not in use on this site', // COMPOSED
  essentialOn: 'Essential: always on', // COMPOSED
  emailLabel: 'Email address', // COMPOSED (newsletter)
  newsletterConsent: 'I agree to KoKreaters storing my email address to send the newsletter, as described in the Privacy Policy.', // COMPOSED
  filterAll: 'All', // COMPOSED
  filterPillar: 'Pillar', // COMPOSED
  filterFormat: 'Format', // COMPOSED
  filterGroup: 'Filter insights', // COMPOSED
  keyTakeaways: 'Key takeaways', // COMPOSED
  relatedInsights: 'Related insights', // COMPOSED
  relevantExpertise: 'Relevant expertise', // COMPOSED
  onThisPage: 'On this page', // COMPOSED
  exhibit: 'Exhibit', // COMPOSED
  source: 'Source', // COMPOSED
  placesLabel: 'Places in Ganeaysh’s career', // COMPOSED
  send: 'Send', // COMPOSED (C-16)
  visitorFallback: 'You', // COMPOSED
  legalBanner: 'Placeholder text for review by a lawyer before launch. Not legal advice.', // COMPOSED
  legalDateline: 'Legal', // COMPOSED
  lastUpdated: 'Last updated {date}', // COMPOSED
  homeCrumb: 'Home', // COMPOSED
  opensLinkedIn: 'opens LinkedIn', // COMPOSED
  insightsRunningHead: 'KoKreaters Insights', // COMPOSED
  newsletterMailtoSubject: 'Subscribe to field notes', // COMPOSED

  /* ── v3 (research/v3/copy-edits.md): plain UI labels moved out of data/notes/*, which is deleted in v3 ── */
  announcement: 'Field notes from the plant floor and the boardroom.', // was chromeNotes.ann.lead
  announcementLink: 'Read the insights', // was chromeNotes.ann.link
  backToTop: 'Back to top', // was chromeNotes.top
  readMore: 'Read more', // replaces "Read the whole truth", "Read the full note", "Read the long version"
  expertiseAreas: 'The six areas of expertise', // was expertiseNotes.hub.label
  otherExpertise: 'Other areas of expertise', // replaces "the other five" (expertiseNotes.pillar.others)
  readingTimeLabel: 'Reading time', // was journalNotes.article.labelTime
  writtenByLabel: 'Written by', // was journalNotes.article.labelBy
} as const;

export type MicrocopyKey = keyof typeof microcopy;

/** Insight format labels (brief 6.6). */
export const formatLabels = {
  'point-of-view': 'Point of view',
  'field-notes': 'Field notes',
  explainer: 'Explainer',
} as const;
