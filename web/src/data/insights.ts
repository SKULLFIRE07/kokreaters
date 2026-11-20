/**
 * Insights hub and article UI labels (REDESIGN-V3 §4 Insights). Plain, sentence case. Content (titles, standfirsts,
 * bodies) lives in src/content/insights/*.mdx; shared labels stay in microcopy.ts (keyTakeaways, relatedInsights,
 * readingTime, filterPillar/filterFormat/filterAll/filterGroup, insightsCount, exhibit, source, featuredInsight).
 * Every string here is COMPOSED for v3 (no facts).
 */
export const insightsHub = {
  libraryTitle: 'All insights',
  /** v4 hub: the label over the published cards. COMPOSED. */
  libraryEyebrow: 'Published',
  /** v4 card tag on the newest insight only (Signal Red). */
  newTag: 'New',
  inPreparation: 'In preparation',
  /** v4 "In preparation" card foot line. */
  comingSoonShort: 'Coming soon',
  /** Singular of microcopy.insightsCount ("{n} insights"). */
  countOne: '{n} insight',
  empty: 'No insights match this combination yet.',
  emptyReset: 'Show all insights',
  comingSoon: 'Coming soon',
  comingSoonLead: 'In preparation now. Subscribe to the newsletter to hear when they are published.',
  /** Tag at the end of every unlinked coming-soon / in-preparation row (hub, Home 4, expertise related insights). */
  soonTag: 'Soon',
} as const;

export const articleCopy = {
  share: 'Share',
  shareLinkedIn: 'LinkedIn',
  shareLinkedInLabel: 'Share on LinkedIn',
  shareEmail: 'Email',
  shareEmailLabel: 'Share by email',
  downloadPdf: 'Download PDF',
  expertise: 'Expertise',
  aboutAuthor: 'About the author',
  draft: 'Draft',
  note: 'Note',
  /** Heading of the sticky contents rail beside the article body (≥ 1360px). */
  contents: 'In this article',
  /** Prefix of the hero photo credit line: "Photo: {name}, {source}". */
  photo: 'Photo',
} as const;
