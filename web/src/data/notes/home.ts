/**
 * v2 new copy: home (P-home). Seeded by FOUNDATION from DESIGN-SPEC v2 11.2; owned by P-home.
 * Strict line format (scripts/notes-copy.mjs):   key: 'text', // ROUTE · where · TYPE
 */
export const homeNotes = {
  hero: {
    shared: 'that’s you + us', // / · F1 hero, arrow to “shared” · NOTE
    pull: 'pull a node, it’s all connected', // / · F1 hero network · NOTE
  },
  proof: {
    who: 'yes, that WHO', // / · F3 proof band, arrow to WHO · NOTE
    flap: ['INDIA · WILMAR', 'INDONESIA · WILMAR', 'UKRAINE · −25 °C', 'TÜRKIYE', 'THE NETHERLANDS'], // / · F3 flap board · DERIVED
  },
  positioning: {
    venn: ['plant floor', 'lab', 'boardroom', 'the same person'], // / · F4 Venn labels + centre (brief words) · NOTE
    circle: 'most consultants pick one circle', // / · F4, arrow into the Venn · NOTE
    more: 'Read the whole truth', // / · F4 + F6 <details> summary · UI
  },
  pipeline: {
    title: 'From crude oil on the plant floor to a decision in the boardroom', // / · F4b diagram <title> · DERIVED
    tank: 'Crude comes in', // / · F4b station 1 label · PROP
    refine: 'Refine it right', // / · F4b station 2 label · PROP
    fraction: 'Split the fractions', // / · F4b station 3 label · PROP
    blend: 'Blend to spec', // / · F4b station 4 label · PROP
    product: 'Product that ships', // / · F4b station 5 label · PROP
    board: 'Go or No-Go', // / · F4b station 6 label · PROP
    sign: 'GO', // / · F4b boardroom sign · PROP
    same: 'one pipe, one person', // / · F4b note over the pipe · NOTE
    up: 'and up it goes', // / · F4b note at the rising arrow · NOTE
    scroll: 'scroll, it flows', // / · F4b hint under the diagram · NOTE
  },
  whatWeDo: {
    sideways: 'keep scrolling, it moves sideways', // / · F5 rail ≥ 1024 · NOTE
    swipe: 'swipe for all six', // / · F5 rail < 1024 · NOTE
  },
  method: {
    connect: 'listening comes first', // / · F6 under step 1 · NOTE
    create: 'with proof that it works', // / · F6 under step 3 · NOTE
  },
  impact: {
    cold: 'yes, minus twenty-five', // / · F7, arrow to −25 °C · NOTE
    indiaFigure: '1st', // / · F7 ImpactCard figure (brief: India’s first) · DERIVED
    mapTitle: 'Where the founder’s results happened', // / · F7 route map <title> · DERIVED
    base: 'home base', // / · F7 route map, the Netherlands · NOTE
  },
  industries: {
    toss: 'go on, toss one', // / · F8 gravity box · NOTE
  },
  insights: {
    fresh: 'fresh from the notebook', // / · F9, arrow to the first card · NOTE
  },
  newsletter: {
    quiet: 'no noise, really', // / · F9 newsletter strip (brief: No noise.) · NOTE
  },
  founder: {
    him: 'that’s Ganeaysh', // / · F10, arrow to the face · NOTE
  },
} as const;
