/**
 * Stock photography for the v3 editorial site (brief 9 Nov 2026: "industry and process photos, developer to source stock,
 * client to approve"). Every photo is from Unsplash or Pexels under its own free licence, graded into one cool, quiet family
 * by `node scripts/grade-photos.mjs` (raw originals: ../assets/photos/stock-src/<slug>.jpg, never edited).
 * Credits are repeated in THIRD_PARTY_NOTICES.md. Placement plan: ../research/v3/photos.md.
 *
 * Use with Astro's <Image> / <Picture>:
 *   import { photos } from '@/data/photos';
 *   const p = photos['refinery-01'];
 *   <Image src={p.src} alt={p.alt} widths={[640, 1024, 1600, 2400]} sizes="100vw" style={`object-position:${p.position}`} />
 *
 * STATUS: pending client approval (brief). Swap a slug's import to replace a photo; slugs are stable.
 */
import type { ImageMetadata } from 'astro';

import refinery01 from '@/assets/photos/stock/refinery-01.jpg';
import refinery02 from '@/assets/photos/stock/refinery-02.jpg';
import plant01 from '@/assets/photos/stock/plant-01.jpg';
import cold01 from '@/assets/photos/stock/cold-01.jpg';
import texture01 from '@/assets/photos/stock/texture-01.jpg';
import texture02 from '@/assets/photos/stock/texture-02.jpg';
import oils01 from '@/assets/photos/stock/oils-01.jpg';
import oils02 from '@/assets/photos/stock/oils-02.jpg';
import oilseeds01 from '@/assets/photos/stock/oilseeds-01.jpg';
import lab01 from '@/assets/photos/stock/lab-01.jpg';
import lab02 from '@/assets/photos/stock/lab-02.jpg';
import chocolate01 from '@/assets/photos/stock/chocolate-01.jpg';
import chocolate02 from '@/assets/photos/stock/chocolate-02.jpg';
import bakery01 from '@/assets/photos/stock/bakery-01.jpg';
import bakery02 from '@/assets/photos/stock/bakery-02.jpg';
import factory01 from '@/assets/photos/stock/factory-01.jpg';
import audit01 from '@/assets/photos/stock/audit-01.jpg';
import people01 from '@/assets/photos/stock/people-01.jpg';
import people02 from '@/assets/photos/stock/people-02.jpg';
import people03 from '@/assets/photos/stock/people-03.jpg';

export const PHOTO_SLUGS = [
  'refinery-01', 'refinery-02', 'plant-01', 'cold-01', 'texture-01', 'texture-02',
  'oils-01', 'oils-02', 'oilseeds-01', 'lab-01', 'lab-02',
  'chocolate-01', 'chocolate-02', 'bakery-01', 'bakery-02', 'factory-01', 'audit-01',
  'people-01', 'people-02', 'people-03',
] as const;
export type PhotoSlug = (typeof PHOTO_SLUGS)[number];

export type PhotoTag =
  | 'refinery' | 'plant' | 'steel' | 'cold' | 'texture'
  | 'oils' | 'oilseeds' | 'lab' | 'quality'
  | 'chocolate' | 'bakery' | 'factory' | 'people';

export type PhotoLicense = 'Unsplash License' | 'Pexels License';
export type PhotoFocal = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface PhotoCredit {
  name: string;              // photographer as shown on the source page
  url: string;               // the photo's page on Unsplash / Pexels
  profile: string;           // photographer profile
  license: PhotoLicense;
}

export interface Photo {
  slug: PhotoSlug;
  src: ImageMetadata;        // static import of src/assets/photos/stock/<slug>.jpg (graded)
  file: string;              // path note, relative to web/
  alt: string;               // plain, descriptive; no "image of"
  tags: PhotoTag[];
  orientation: 'landscape' | 'portrait';
  focal: PhotoFocal;         // where the subject sits, for cover crops
  position: string;          // CSS object-position, tuned (v3.1, 10 Nov 2026) so the subject survives 21:9 → 4:5 crops;
                             // <Photo> applies it automatically when no `position` is passed (photoBySrc)
  tone: 'dark' | 'mid' | 'light';   // dark = white type can sit on it (with the navy scrim); light = needs ink type
  credit: PhotoCredit;
}

const U: PhotoLicense = 'Unsplash License';
const P: PhotoLicense = 'Pexels License';
const file = (slug: string) => `src/assets/photos/stock/${slug}.jpg`;

export const photos: Record<PhotoSlug, Photo> = {
  'refinery-01': {
    slug: 'refinery-01', src: refinery01, file: file('refinery-01'),
    alt: 'Process plant with distillation columns and a horizontal vessel, lit against a deep blue dusk sky.',
    tags: ['refinery', 'plant', 'steel'], orientation: 'landscape', focal: 'bottom', position: '50% 52%', tone: 'dark',
    credit: { name: 'Igor Passchier', url: 'https://www.pexels.com/photo/industrial-facility-in-zuid-holland-at-dusk-32399139/', profile: 'https://www.pexels.com/@igor-passchier-111147847/', license: P },
  },
  'refinery-02': {
    slug: 'refinery-02', src: refinery02, file: file('refinery-02'),
    alt: 'Refinery columns, chimneys and weathered storage tanks in low evening light.',
    tags: ['refinery', 'plant', 'oils'], orientation: 'landscape', focal: 'center', position: '50% 32%', tone: 'mid',
    credit: { name: 'Red Shuheart', url: 'https://unsplash.com/photos/industrial-refinery-with-storage-tanks-Wb4vcBqyGT8', profile: 'https://unsplash.com/@mirrors_are_more_fun', license: U },
  },
  'plant-01': {
    slug: 'plant-01', src: plant01, file: file('plant-01'),
    alt: 'Stainless steel process vessels and sanitary pipework inside a processing plant.',
    tags: ['plant', 'steel'], orientation: 'landscape', focal: 'center', position: '50% 50%', tone: 'light',
    credit: { name: 'Crystal Kwok', url: 'https://unsplash.com/photos/xD5SWy7hMbw', profile: 'https://unsplash.com/@spacexuan', license: U },
  },
  'cold-01': {
    slug: 'cold-01', src: cold01, file: file('cold-01'),
    alt: 'Aerial view of storage tanks and a processing plant in deep snow at sunrise, steam rising from the stacks.',
    tags: ['cold', 'plant', 'refinery'], orientation: 'portrait', focal: 'center', position: '50% 50%', tone: 'light',
    credit: { name: 'Kay Mayer', url: 'https://unsplash.com/photos/industrial-tanks-in-a-snowy-landscape-at-sunrise-qvCvkdiHXZU', profile: 'https://unsplash.com/@kaymayer', license: U },
  },
  'texture-01': {
    slug: 'texture-01', src: texture01, file: file('texture-01'),
    alt: 'Steel roof trusses of an industrial hall, almost in darkness, with a band of skylight behind them.',
    tags: ['texture', 'steel'], orientation: 'landscape', focal: 'center', position: '50% 55%', tone: 'dark',
    credit: { name: 'Declan Sun', url: 'https://unsplash.com/photos/steel-beams-of-an-industrial-buildings-roof-Jfr7YZWcyVY', profile: 'https://unsplash.com/@declansun', license: U },
  },
  'texture-02': {
    slug: 'texture-02', src: texture02, file: file('texture-02'),
    alt: 'Insulated pipework with flow arrows and flanged joints in a dim plant room.',
    tags: ['texture', 'steel', 'plant'], orientation: 'landscape', focal: 'left', position: '28% 45%', tone: 'dark',
    credit: { name: 'iSawRed', url: 'https://unsplash.com/photos/a-large-machine-with-pipes-WB9HyqF8lKA', profile: 'https://unsplash.com/@isawred', license: U },
  },
  'oils-01': {
    slug: 'oils-01', src: oils01, file: file('oils-01'),
    alt: 'Golden oil running from a stainless steel spout.',
    tags: ['oils', 'steel'], orientation: 'landscape', focal: 'top', position: '50% 35%', tone: 'mid',
    credit: { name: 'Xavier von Erlach', url: 'https://unsplash.com/photos/golden-oil-pouring-from-a-metal-spout-into-a-container-dDWVq_XEhus', profile: 'https://unsplash.com/@xavier_von_erlach', license: U },
  },
  'oils-02': {
    slug: 'oils-02', src: oils02, file: file('oils-02'),
    alt: 'A drop of clear golden oil spreading on a pale surface.',
    tags: ['oils', 'quality'], orientation: 'portrait', focal: 'center', position: '45% 38%', tone: 'light',
    credit: { name: 'Colin Lloyd', url: 'https://unsplash.com/photos/clear-glass-bottle-with-yellow-liquid-OacW0FPpNMw', profile: 'https://unsplash.com/@onthesearchforpineapples', license: U },
  },
  'oilseeds-01': {
    slug: 'oilseeds-01', src: oilseeds01, file: file('oilseeds-01'),
    alt: 'Close-up of a heap of striped sunflower seeds.',
    tags: ['oilseeds', 'oils'], orientation: 'landscape', focal: 'center', position: '50% 50%', tone: 'mid',
    credit: { name: 'Engin Akyurt', url: 'https://www.pexels.com/photo/close-up-of-sunflower-seeds-in-bulk-34313442/', profile: 'https://www.pexels.com/@enginakyurt/', license: P },
  },
  'lab-01': {
    slug: 'lab-01', src: lab01, file: file('lab-01'),
    alt: 'Laboratory analyst in a hairnet and mask checking a rack of glass sample tubes.',
    tags: ['lab', 'quality', 'oils'], orientation: 'landscape', focal: 'center', position: '28% 35%', tone: 'mid',
    credit: { name: 'Jeetendra Vyas Fashionpfotographer', url: 'https://www.pexels.com/photo/scientist-checking-test-tubes-in-laboratory-machine-9408640/', profile: 'https://www.pexels.com/@jeetendra-vyas-fashionpfotographer-2820832/', license: P },
  },
  'lab-02': {
    slug: 'lab-02', src: lab02, file: file('lab-02'),
    alt: 'Laboratory technician in a gown, gloves and safety glasses pipetting samples into rows of vials.',
    tags: ['lab', 'quality', 'people'], orientation: 'portrait', focal: 'center', position: '50% 12%', tone: 'mid',
    credit: { name: 'CDC', url: 'https://unsplash.com/photos/scientist-using-pipette-in-laboratory-_N7I1JyPYJw', profile: 'https://unsplash.com/@cdc', license: U },
  },
  'chocolate-01': {
    slug: 'chocolate-01', src: chocolate01, file: file('chocolate-01'),
    alt: 'Dark chocolate bars lifted out of metal moulds on a steel workbench.',
    tags: ['chocolate'], orientation: 'landscape', focal: 'center', position: '50% 55%', tone: 'mid',
    credit: { name: 'Daniel Fazio', url: 'https://unsplash.com/photos/chocolate-bar-on-gray-container-JBN6FHP5VXk', profile: 'https://unsplash.com/@danielfazio', license: U },
  },
  'chocolate-02': {
    slug: 'chocolate-02', src: chocolate02, file: file('chocolate-02'),
    alt: 'Chocolate centres tumbling in a stainless steel coating pan.',
    tags: ['chocolate', 'factory', 'steel'], orientation: 'portrait', focal: 'bottom', position: '50% 65%', tone: 'mid',
    credit: { name: 'Amine Kübranur Çakıroğlu', url: 'https://www.pexels.com/photo/truffle-coating-in-industrial-chocolate-machine-38594567/', profile: 'https://www.pexels.com/@kubranurcakiroglu/', license: P },
  },
  'bakery-01': {
    slug: 'bakery-01', src: bakery01, file: file('bakery-01'),
    alt: 'Rows of shaped, unbaked croissants on a steel baking tray, the laminated layers visible.',
    tags: ['bakery'], orientation: 'portrait', focal: 'bottom', position: '50% 70%', tone: 'mid',
    credit: { name: 'Arda Kaykısız', url: 'https://www.pexels.com/photo/close-up-of-raw-croissants-lying-on-a-baking-tray-20002816/', profile: 'https://www.pexels.com/@arda-kaykisiz-672105204/', license: P },
  },
  'bakery-02': {
    slug: 'bakery-02', src: bakery02, file: file('bakery-02'),
    alt: 'Bakers shaping dough pieces along a floured production line.',
    tags: ['bakery', 'factory'], orientation: 'landscape', focal: 'center', position: '55% 40%', tone: 'light',
    credit: { name: 'Anna Shvets', url: 'https://www.pexels.com/photo/dough-on-tape-6291408/', profile: 'https://www.pexels.com/@shvetsa/', license: P },
  },
  'factory-01': {
    slug: 'factory-01', src: factory01, file: file('factory-01'),
    alt: 'Workers in hairnets and aprons at stainless steel tables in a bright, clean food production hall.',
    tags: ['factory', 'quality', 'people'], orientation: 'landscape', focal: 'center', position: '35% 35%', tone: 'light',
    credit: { name: 'Anna Shvets', url: 'https://www.pexels.com/photo/woman-working-machinery-5953714/', profile: 'https://www.pexels.com/@shvetsa/', license: P },
  },
  'audit-01': {
    slug: 'audit-01', src: audit01, file: file('audit-01'),
    alt: 'Gloved hands completing a checklist on a clipboard during a site inspection.',
    tags: ['quality', 'factory'], orientation: 'portrait', focal: 'center', position: '35% 40%', tone: 'dark',
    credit: { name: 'cottonbro studio', url: 'https://www.pexels.com/photo/man-with-black-gloves-looking-at-checklist-5532844/', profile: 'https://www.pexels.com/@cottonbro/', license: P },
  },
  'people-01': {
    slug: 'people-01', src: people01, file: file('people-01'),
    alt: 'Colleagues around a long wooden table taking notes in a working session.',
    tags: ['people'], orientation: 'landscape', focal: 'left', position: '30% 18%', tone: 'mid',
    credit: { name: 'Dylan Gillis', url: 'https://unsplash.com/photos/people-sitting-on-chair-in-front-of-table-while-holding-pens-during-daytime-KdeqA3aTnBY', profile: 'https://unsplash.com/@mainermedia', license: U },
  },
  'people-02': {
    slug: 'people-02', src: people02, file: file('people-02'),
    alt: 'Four colleagues in a meeting room reviewing figures on a wall screen.',
    tags: ['people'], orientation: 'landscape', focal: 'right', position: '50% 55%', tone: 'light',
    credit: { name: 'Beatriz Cattel', url: 'https://unsplash.com/photos/business-meeting-with-people-around-a-conference-table-3tCLyPBSQ5k', profile: 'https://unsplash.com/@bicattel', license: U },
  },
  'people-03': {
    slug: 'people-03', src: people03, file: file('people-03'),
    alt: 'Two people going through printed documents line by line at a meeting table.',
    tags: ['people'], orientation: 'landscape', focal: 'center', position: '45% 40%', tone: 'mid',
    credit: { name: 'Olena Kholina', url: 'https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw', profile: 'https://unsplash.com/@sixtynice', license: U },
  },
};

export const photoList: Photo[] = PHOTO_SLUGS.map((s) => photos[s]);

/**
 * Photos whose subject survives a full-bleed, very wide crop (≥ 2.2:1 at 1440–1920, with the tuned `position`), checked
 * visually on 10 Nov 2026 (§9.2). Use ONLY these for PageHero background photos and PhotoInterlude. Not on the list:
 * every portrait photo, people-01 (heads sit at the very top edge of the source and are cut by any wide crop), lab-01
 * and factory-01 (a face / head near the top), oils-02, audit-01.
 */
export const BLEED_SAFE = [
  'refinery-01', 'refinery-02', 'plant-01', 'texture-01', 'texture-02', 'oilseeds-01', 'chocolate-01', 'bakery-02',
  'oils-01', 'people-02', 'people-03',
] as const satisfies readonly PhotoSlug[];
export type BleedSafeSlug = (typeof BLEED_SAFE)[number];
export const isBleedSafe = (slug: PhotoSlug): slug is BleedSafeSlug => (BLEED_SAFE as readonly string[]).includes(slug);

export function photosByTag(tag: PhotoTag): Photo[] {
  return photoList.filter((p) => p.tags.includes(tag));
}

/** The photo record whose graded file is `src` (used by <Photo> to apply the focal point automatically). */
const bySrc = new Map<string, Photo>(photoList.map((p) => [p.src.src, p]));
export function photoBySrc(src: ImageMetadata | undefined): Photo | undefined {
  return src ? bySrc.get(src.src) : undefined;
}
