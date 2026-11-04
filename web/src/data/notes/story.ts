/**
 * v2 new copy: approach, impact, about (P-story). Seeded by FOUNDATION from DESIGN-SPEC v2 11.2.
 * Strict line format (scripts/notes-copy.mjs):   key: 'text', // ROUTE · where · TYPE
 */
export const storyNotes = {
  approach: {
    idea: 'the whole idea, really', // /approach · F1, arrow to the circled “with you” · NOTE
  },
  steps: {
    connect: 'we listen first', // /approach · F2 Connect slab (brief step copy) · NOTE
    collaborate: 'your people own it', // /approach · F2 Collaborate slab (brief step copy) · NOTE
    create: 'then we prove it works', // /approach · F2 Create slab (brief step copy) · NOTE
  },
  crumple: {
    file: 'FINAL_report_v7.pdf', // /approach · F3 paper card header · PROP
    button: 'Crumple it', // /approach · F3 toy button · UI
    reset: 'Smooth it out', // /approach · F3 toy button · UI
    after: 'much better', // /approach · F3 after the crumple · NOTE
  },
  principles: {
    rules: 'the house rules', // /approach · F4, arrow to card 1 · NOTE
  },
  models: {
    shape: 'pick a shape', // /approach · F5 · NOTE
  },
  stack: {
    fling: 'fling one', // /impact · F2 card stack · NOTE
    next: 'Next card', // /impact · F2 card stack button · UI
  },
  cold: {
    wipe: 'wipe the glass', // /impact · F3 Ukraine frost (pointer) · NOTE
    yes: 'yes, minus twenty-five', // /impact · F3 Ukraine frost (touch) · NOTE
  },
  engagements: {
    withheld: 'names withheld, on purpose', // /impact · F4 (brief: Anonymised) · NOTE
  },
  impact: {
    indiaFigure: '1st', // /impact · ImpactCard figure (brief: India’s first) · DERIVED
  },
  about: {
    hello: 'hello from the Netherlands', // /about · F1, arrow to the face (brief: based in the Netherlands) · NOTE
    flap: ['INDIA · WILMAR', 'INDONESIA · WILMAR', 'UKRAINE · −25 °C', 'TÜRKIYE', 'THE NETHERLANDS'], // /about · F2 flap board · DERIVED
    spin: 'scroll to spin it', // /about · F5, arrow to the globe · NOTE
    ko: '= together', // /about · F6 “Ko” sticker (brief name copy) · NOTE
    kreaters: '= the people who make things happen', // /about · F6 “Kreaters” sticker (brief name copy) · NOTE
    russian: 'and a bit of Russian', // /about · F7, arrow to Russian (basic) · NOTE
  },
} as const;
