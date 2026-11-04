/**
 * v2 new copy: expertise, pillars, industries (P-expertise). Seeded by FOUNDATION from DESIGN-SPEC v2 11.2.
 * Strict line format (scripts/notes-copy.mjs):   key: 'text', // ROUTE · where · TYPE
 * Diagram words are restatements of the pillar's own brief copy (intro / help-with), never new claims.
 */
export const expertiseNotes = {
  overview: {
    together: 'they’re designed to work together', // /expertise · F1, arrow down to the hub · NOTE
    venn: ['science', 'plants', 'strategy'], // /expertise · F1 Venn lobes (the H1’s own words) · PROP
    vennCentre: 'that’s us', // /expertise · F1 Venn centre · NOTE
    more: 'Read the full note', // /expertise + pillar pages · collapsed intro toggle · UI
  },
  hub: {
    hover: 'hover a pillar', // /expertise · F2 hub · NOTE
    label: 'The six areas of expertise', // /expertise · F2 hub list accessible name · UI
    tap: 'tap one to dive in', // /expertise · F2 hub, touch only · NOTE
  },
  grid: {
    stick: 'six blocks, one team', // /expertise · F3 grid aside · NOTE
  },
  prompt: {
    anywhere: 'start anywhere', // /expertise + pillar pages · prompt row, arrow to the pill · NOTE
  },
  pillar: {
    here: 'you are here', // /expertise/* · F1 constellation · NOTE
    others: 'the other five', // /expertise/* · F1 constellation, mobile tag row label · UI
  },
  diagram: {
    fig: 'fig. {n}', // /expertise/* · F1b diagram caption number · PROP
    scroll: 'scroll, it draws itself', // /expertise/* · F1b diagram · NOTE
    innovationTitle: 'From unmet need to a product that scales', // /expertise/product-innovation · F1b funnel title (the pillar promise) · DERIVED
    innovation: ['Unmet need', 'Technical brief', 'Prototype', 'Scale-up', 'Launch'], // /expertise/product-innovation · F1b funnel stages (intro + deliverables) · DERIVED
    processTitle: 'Crude oil in, customer specification out', // /expertise/process-design · F1b process line title (industries copy) · DERIVED
    process: ['Degumming', 'Bleaching', 'Deodorisation', 'Fractionation', 'Interesterification'], // /expertise/process-design · F1b process line stations · PROP
    processEnds: ['Crude', 'Spec'], // /expertise/process-design · F1b process line ends · PROP
    qualityTitle: 'Process contaminants, stopped layer by layer', // /expertise/food-safety-quality · F1b barrier title (help-with) · DERIVED
    quality: ['3-MCPD and GE', 'Trans fats', 'Mineral oil hydrocarbons'], // /expertise/food-safety-quality · F1b barrier layers (help-with) · DERIVED
    qualityEnds: ['Risk', 'Your brand'], // /expertise/food-safety-quality · F1b barrier ends · PROP
    strategyTitle: 'Three questions before you commit capital', // /expertise/strategy-feasibility · F1b tree title (intro) · DERIVED
    strategy: ['Is the market real?', 'Does the technology work?', 'Do the numbers hold?'], // /expertise/strategy-feasibility · F1b tree branches (intro) · DERIVED
    strategyEnds: ['Your idea', 'Go', 'No-Go'], // /expertise/strategy-feasibility · F1b tree root and leaves · PROP
    dealsTitle: 'What the spreadsheet shows, and what it does not', // /expertise/due-diligence · F1b iceberg title (intro) · DERIVED
    dealsTop: 'What the spreadsheet shows', // /expertise/due-diligence · F1b iceberg tip (intro) · DERIVED
    deals: ['A tired refinery', 'A fragile quality system', 'A technology that will not transfer'], // /expertise/due-diligence · F1b iceberg depths (intro) · DERIVED
    capabilityTitle: 'Train, transfer, coach: stronger teams', // /expertise/capability · F1b growth tree title (intro) · DERIVED
    capability: ['Train', 'Transfer', 'Coach'], // /expertise/capability · F1b growth tree rings (intro) · DERIVED
    capabilityEnd: 'Stronger teams', // /expertise/capability · F1b growth tree crown (the pillar promise) · DERIVED
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
  record: {
    indiaFigure: '1st', // /expertise/* · F4 ImpactCard figure (brief: India’s first) · DERIVED
    proof: 'one for the record', // /expertise/* · F4 impact card aside · NOTE
  },
  industries: {
    pick: 'pick yours', // /industries · F1, arrow down to the index · NOTE
    wheel: 'Industries wheel', // /industries · F1b wheel list accessible name · UI
    turn: 'scroll to turn the wheel', // /industries · F1b wheel · NOTE
    sector: 'Sector', // /industries · F1b panel label · UI
  },
} as const;
