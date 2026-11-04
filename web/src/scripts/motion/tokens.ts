/** GSAP mirror of the CSS motion tokens in src/styles/tokens.css (seconds). DESIGN-SPEC v2 8.2.
 * The v1 keys (uiIn, uiOut, reveal, lines, rule, swoosh, connector, dock) are kept below so v1 page modules keep
 * compiling until Wave B moves them to the v2 names. */
export const D = {
  fast: .16, ui: .24, panel: .32, rise: .9, draw: .7, head: .16, note: .45, sticker: .7,
  count: 1.4, marquee: 60 /* px/s */, magnetIn: .4, magnetOut: .9, scrub: 1,
  // v1 (legacy)
  uiIn: .18, uiOut: .14, reveal: .8, lines: .9, rule: .5, swoosh: .9, connector: 1.2, dock: .64,
};
export const E = {
  rise: 'expo.out', draw: 'power2.inOut', note: 'back.out(2)', sticker: 'back.out(1.7)',
  magnet: 'power3.out', release: 'elastic.out(1, 0.35)', count: 'expo.out', ui: 'power3.out',
  // v1 (legacy)
  uiIn: 'power1.out', reveal: 'expo.out', dock: 'power3.inOut',
};
export const START = 'top 80%';
export const NOTE_START = 'top 75%';
