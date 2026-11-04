/**
 * v2 new copy: insights, articles, contact, legal, 404 (P-journal). Seeded by FOUNDATION from DESIGN-SPEC v2 11.2.
 * Strict line format (scripts/notes-copy.mjs):   key: 'text', // ROUTE · where · TYPE
 */
export const journalNotes = {
  hub: {
    fluff: 'field notes, not fluff', // /insights · F1 · NOTE
    lift: 'press one to lift it', // /insights · F2 card fan · NOTE
    inside: 'What’s inside', // /insights · F1 honest label title · UI
    stamp: 'field notes · plant floor · boardroom · ', // /insights · F1 spinning stamp (decorative) · PROP
    deck: 'the rest of the deck is on its way', // /insights · F2 beside the in-preparation covers · NOTE
  },
  newsletter: {
    quiet: 'no noise, really', // /insights · F6 newsletter (brief: No noise.) · NOTE
  },
  article: {
    coffee: 'grab a coffee', // /insights/* · header, arrow to the reading time · NOTE
    short: 'the short version', // /insights/* · takeaways · NOTE
    labelTime: 'Reading time', // /insights/* · header honest label, row key · UI
    labelBy: 'Written by', // /insights/* · header honest label, row key · UI
  },
  ticket: {
    title: 'Boarding pass', // /contact · ticket title · PROP
    passenger: 'Passenger', // /contact · ticket field · PROP
    with: 'With', // /contact · ticket field · PROP
    length: 'Length', // /contact · ticket field · PROP
    minutes: '30 min', // /contact · ticket value (from “Book a 30-minute call”) · PROP
    tear: 'tear here', // /contact · along the perforation · NOTE
  },
  form: {
    detail: 'the more detail, the better', // /contact · next to the Message label · NOTE
    soon: 'talk soon', // /contact · beside the success message · NOTE
    who: 'Who', // /contact · step path above the form, step 1 (decorative) · PROP
    what: 'What', // /contact · step path above the form, step 2 (decorative) · PROP
  },
  legal: {
    print: 'the small print, in normal-size print', // /privacy /cookies /terms · next to the H1 · NOTE
  },
  notfound: {
    mess: 'go on, make a mess', // 404 · arrow into the word pit · NOTE
  },
} as const;
