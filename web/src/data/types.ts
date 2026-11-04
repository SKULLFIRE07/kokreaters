/** Shared content types (DESIGN-SPEC 4.1). The shape mirrors a later CMS schema (C-4). */
import type { ImageMetadata } from 'astro';

export type PillarKey = 'innovation' | 'process' | 'quality' | 'strategy' | 'deals' | 'capability';
export type PillarSlug = 'product-innovation' | 'process-design' | 'food-safety-quality' | 'strategy-feasibility' | 'due-diligence' | 'capability';
export interface Pillar {
  key: PillarKey; slug: PillarSlug; n: number;            // 1..6, display "01"
  name: string; promise: string;                         // card line on home / panel
  headline: string; intro: string;                       // pillar page
  helpWith: string[]; deliverables: string[];
  colourVar: `--pillar-${PillarKey}`; hex: string;
  inkText: boolean;                                      // Saffron + Sky: labels stay Ink, dot gets --ring-ink
  impactId?: string;                                     // related founder result (CONFIRM mapping C-8)
  shortLabel: string;                                    // filter label on /insights
}
export interface Industry { slug: string; n: number; name: string; copy: string; pillars: PillarKey[]; image?: ImageMetadata; imageAlt?: string; }
export interface FounderResult {
  id: 'india' | 'indonesia' | 'ukraine' | 'tfa';
  dateline: string;                 // home row sidenote, e.g. "India · Wilmar"
  homeLine: string;                 // brief home card text, without the bracket
  emphasis: string[];               // substrings set as figures in Sapphire Fraunces 300
  context: string;                  // impact page context label
  outcome: string;                  // impact page h2
  challenge: string | null; done: string | null; result: string | null;   // null → <Confirm id="C-9">
  figure?: { value: string; source: string; frost?: boolean };
  pillars: PillarKey[]; sectors: string[];   // tag names
}
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
  rows?: number;        // textarea only
}
