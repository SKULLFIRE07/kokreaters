/**
 * v2 new copy: expertise, pillars, industries (P-expertise). Seeded by FOUNDATION from DESIGN-SPEC v2 11.2.
 * Strict line format (scripts/notes-copy.mjs):   key: 'text', // ROUTE · where · TYPE
 */
export const expertiseNotes = {
  overview: {
    together: 'they’re designed to work together', // /expertise · F1, arrow down to the hub · NOTE
  },
  hub: {
    hover: 'hover a pillar', // /expertise · F2 hub · NOTE
  },
  prompt: {
    anywhere: 'start anywhere', // /expertise + pillar pages · prompt row, arrow to the pill · NOTE
  },
  pillar: {
    here: 'you are here', // /expertise/* · F1 constellation · NOTE
  },
  label: {
    title: 'What’s inside', // /expertise/* · F2 SpecLabel title · UI
    sub: 'Nothing hidden', // /expertise/* · F2 SpecLabel sub · UI
    foot: 'Contents may vary with your plant.', // /expertise/* · F2 SpecLabel foot · UI
  },
  inspector: {
    open: 'Inspect the label', // /expertise/* · F2 spec inspector toggle · UI
    close: 'Close the inspector', // /expertise/* · F2 spec inspector toggle · UI
    hint: 'drag the frame over the label', // /expertise/* · F2 · NOTE
    items: '{n} items', // /expertise/* · F2 blueprint caption · PROP
    fig: 'fig. {n}', // /expertise/* · F2 blueprint caption · PROP
  },
  deliverables: {
    desk: 'what lands on your desk', // /expertise/* · F3 · NOTE
  },
  card: {
    more: '+{n} more', // /expertise · PillarCard grid row · UI
  },
  record: {
    indiaFigure: '1st', // /expertise/* · F4 ImpactCard figure (brief: India’s first) · DERIVED
  },
  industries: {
    pick: 'pick yours', // /industries · F1, arrow down to the index · NOTE
  },
} as const;
