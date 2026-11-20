/** Shared content types (DESIGN-SPEC 4.1). The shape mirrors a later CMS schema (C-4). */
import type { ImageMetadata } from 'astro';
import type { PhotoSlug } from './photos';

export type PillarKey = 'innovation' | 'process' | 'quality' | 'strategy' | 'deals' | 'capability';
export type PillarSlug = 'product-innovation' | 'process-design' | 'food-safety-quality' | 'strategy-feasibility' | 'due-diligence' | 'technology-leadership';
export interface Pillar {
  key: PillarKey; slug: PillarSlug; n: number;            // 1..6, display "01"
  name: string; promise: string;                         // card line on home / panel
  headline: string; intro: string;                       // pillar page
  helpWith: string[]; deliverables: string[];
  colourVar: `--pillar-${PillarKey}`; hex: string;
  inkText: boolean;                                      // Saffron + Sky: labels stay Ink, dot gets --ring-ink
  impactId?: string;                                     // related founder result (CONFIRM mapping C-8)
  shortLabel: string;                                    // filter label on /insights
  /* pack 3 (brief, Expertise overview + service pages) */
  audience?: string;                                     // one sentence: who it is for
  engagement?: string;                                   // "Typical engagement" line
  offer?: { title: string; line: string };              // the one specific offer that ends the service page
}
export interface Industry {
  slug: string; n: number; name: string; copy: string; pillars: PillarKey[]; image?: ImageMetadata; imageAlt?: string;
  /* pack 3 (brief, Industries): three "questions we help answer", one linked story, and the folded "Also" industries */
  questions?: string[];
  storyId?: `story-${string}`;
  covers?: string[];                 // slugs of otherIndustries folded into this card
}
export interface FounderResult {
  id: 'india' | 'indonesia' | 'ukraine' | 'tfa';
  dateline: string;                 // home row sidenote, e.g. "India" (pack 2: no employer names)
  homeLine: string;                 // brief home card text, without the bracket
  emphasis: string[];               // substrings set as figures in Sapphire Fraunces 300
  context: string;                  // impact page context label
  outcome: string;                  // impact page h2
  challenge: string | null; done: string | null; result: string | null;   // null → <Confirm id="C-9">
  figure?: { value: string; source: string; frost?: boolean };
  pillars: PillarKey[]; sectors: string[];   // tag names
}
/**
 * Pack 2 (brief items 27–28): an unconfirmed value (brief text in ⟦brackets⟧, Part K number `confirm`, e.g. 'P-6').
 * Rendered only when `showConfirm` (staging), always with <Confirm id={confirm} note={note} />; never elsewhere.
 */
export interface Unconfirmed { confirmed: false; confirm: `P-${number}`; note: string; }
export interface StoryFigure { value: string; label: string; pending?: Unconfirmed; }
export interface StoryLink {
  label: string; href: string | null; pending?: Unconfirmed;
  /** pack 3: a proper source citation (the WHO story): the article title, its author and the publication. */
  cite?: { title: string; author: string; publication: string };
}
/** One of the nine Impact stories (brief item 28). `id` is the /impact anchor (story 4 = 'story-who'). */
export interface ImpactStory {
  id: `story-${string}`; n: number;
  tag: string;                       // "OPERATIONS · INDONESIA", as the brief writes it
  title: string;
  figures: StoryFigure[];            // a pending figure is dropped outside staging (the card then has no big figure)
  challenge: string; done: string; result: string;
  resultMore?: { text: string; pending: Unconfirmed };   // the brief's placeholder sentence after The result
  verify?: StoryLink[];              // story 4 only
  pillars: PillarKey[];              // service chips, in brief order
  industries: string[];              // industry chips: exact industries.ts names
  homeLine?: string;                 // brief item 17 home card line (stories 2, 3, 4)
  photo?: PhotoSlug;                 // pack 3: one photo per story (plant, product or team; no client logos)
}
export interface StripItem { value: string; label: string; pending?: Unconfirmed; }

export interface Engagement { id: string; text: string; consent: 'cleared' | 'pending'; pillars: PillarKey[]; }
export interface MethodStep { n: 1 | 2 | 3; name: 'Connect' | 'Collaborate' | 'Create'; copy: string; whatWeDo: string | null; whatYouGet: string | null; duration: string | null; }
export interface Principle { name: string; copy: string; }
export interface EngagementModel { model: string; shape: string; goodFor: string; }

/* Additional shapes used by the data modules (not in 4.1; additive only). */
export interface Link { label: string; href: string; }
export interface Place { readonly name: string; readonly country: string; readonly lat: number; readonly lon: number; }
export interface TimelineItem { label: string; years: string; }
export interface BioSidenote { at: number; text: string; }   // `at` = 1-based paragraph index in longBio
export type InsightFormat = 'point-of-view' | 'field-notes' | 'explainer';
export interface ContactField {
  name: 'name' | 'company' | 'role' | 'email' | 'phone' | 'country' | 'interest' | 'message' | 'source' | 'consent';
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  autocomplete?: string;
  options?: string[];   // select only
  maxLength?: number;   // also enforced by api/contact.js
  rows?: number;        // textarea only
}

