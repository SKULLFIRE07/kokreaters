/**
 * v2 new copy: chrome (FOUNDATION). DESIGN-SPEC v2 11. Dependency-free. Strict line format, parsed by
 * scripts/notes-copy.mjs → research/v2-new-copy.md:   key: 'text', // ROUTE · where · TYPE
 * TYPE: NOTE (decorative Caveat) · UI (a real control label) · PROP (text inside a decorative toy) · DERIVED (display form of a brief fact).
 * None of these strings adds a factual claim.
 */
export const chromeNotes = {
  ann: {
    lead: 'Field notes from the plant floor and the boardroom.', // ALL · announcement bar · UI
    link: 'Read the insights', // ALL · announcement bar · UI
  },
  motion: {
    pause: 'Pause motion', // ALL · announcement bar · UI
    play: 'Play motion', // ALL · announcement bar · UI
  },
  menu: 'or just say hello', // ALL · mobile menu, arrow to the email · NOTE
  cta: 'we’re all ears', // ALL · CTA field, arrow to the button · NOTE
  footer: 'thanks for reading all the way down', // ALL · footer, next to Back to top · NOTE
  top: 'Back to top', // ALL · footer · UI
  rail: {
    prev: 'Previous', // ALL · rails · UI
    next: 'Next', // ALL · rails · UI
    count: '{i} / {n}', // ALL · rails · UI
  },
  cursor: {
    drag: 'drag', // ALL · cursor follower · PROP
    throw: 'throw', // ALL · cursor follower · PROP
    wipe: 'wipe', // ALL · cursor follower · PROP
    press: 'press', // ALL · cursor follower · PROP
    open: 'open', // ALL · cursor follower · PROP
    pull: 'pull', // ALL · cursor follower · PROP
  },
} as const;
