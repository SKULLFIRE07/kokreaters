# Inventory: About, Contact, Legal, 404 (v3 editorial rebuild)

Read-only map of `web/` on branch `redesign/v3-editorial`, 10 Nov 2026. All paths are relative to
`/home/aryan-budukh/Desktop/ganeshkaka-folder/web/`. `file:line` refers to the file as it stands now.
Rule for the rebuild: **import the data exports listed here, do not re-type copy.**

---

## 0. Shared plumbing these routes depend on

| Thing | Where | What it does |
|---|---|---|
| `BaseLayout` | `src/layouts/BaseLayout.astro` | Props `page`, `seo`, `breadcrumbs`, `showCrumbs`, `cta`. `<body data-page={page}>` (L61) selects the page script. `CtaField` is rendered at the end of `<main>` unless `page` is `contact`, `legal` or `notfound` (L34), so **About gets the CtaField** and the others don't. `noindex` is forced for `page="notfound"` (L35). A BreadcrumbList is added to the JSON-LD graph whenever `breadcrumbs` is non-empty (L40). The inline flags script (L49-56) is hashed into the CSP. Font preloads: Bricolage and IBM Plex Mono (L57-58). |
| Page-script registry | `src/scripts/motion/index.ts:32,117-133` | `import.meta.glob('../pages/*.ts')`. `pageFile()` maps `about→about.ts`, `contact→contact.ts`, `notfound→notfound.ts`. `legal` has no script. **The contact form logic is loaded through the motion bundle**, so if the rebuild removes or rewrites `motion/index.ts`, `scripts/pages/contact.ts` still has to be loaded (better: import it straight from the contact page). |
| SEO | `src/lib/seo.ts` `pageSeo(key)`; `src/data/seo.ts` `seo` | Gives back title, description, path, og image and noindex. `ogType` is `'profile'` for `about` and `'website'` otherwise (seo.ts:31). Lengths are checked at import (title ≤ 60, description ≤ 155). |
| SeoHead | `src/components/seo/SeoHead.astro:17` | `robots` = `noindex, nofollow` when `isStaging` or `seo.noindex`. Falls back to `/og/default.png` when the named og file is missing. |
| JSON-LD | `src/components/seo/schema.ts` | `person(image)` (L107-124), `breadcrumbs(items)` (L165), `withHome` prepends Home (L160). |
| Mode | `src/config/site.ts:10`, `src/lib/mode.ts` | See section 5. |

---

## 1. ABOUT `/about`

### 1.1 Current section order (`src/pages/about.astro:26-36`)
1. **AboutHero** (`components/about/AboutHero.astro`): visible breadcrumbs, the "About" dateline, H1 `about.headline` with "25 years" hand-underlined, `about.intro`. On the right, a lavender block holding the cut-out portrait, a saffron disc, an engraving, doodles and a margin note.
2. **Flap board band** (`about.astro:28-30`): an ink band running the split-flap `FlapBoard` over `storyNotes.about.flap` (the "letter scramble").
3. **LongBio** (`components/about/LongBio.astro`): a sticky, counting "25" with "years of making ingredients work" beside it; `longBio[0]` as the lede plus CONFIRM 13; `longBio[1..5]` inside a `<details>` whose summary reads "Read the long version +"; dated sidenotes.
4. **Timeline** (`components/about/Timeline.astro`): an h2 "CFTRI Mysore → Wilmar → Cargill → KoKreaters", a giant outlined year counter, a hand-drawn SVG path, four rotated sticker tiles and CONFIRM 13.
5. **GlobeSection** (`components/about/GlobeSection.astro`, `id="the-map"`): the "The map" dateline, an h2, the lead, an `<ol>` of the 8 places, and a static globe SVG that a Three.js canvas replaces when it mounts. At ≥ 1024 px with motion on, the section is a 160vh sticky stage.
6. **NamePanel** (`components/about/NamePanel.astro`): a sapphire band with the h2 "The name", giant "Ko" and "Kreaters" stickers carrying "= together" notes, then the two lead sentences and the full logo lockup on a white sticker.
7. **EducationLanguages** (`components/about/EducationLanguages.astro`): an h2, two tilted SpecLabel cards (Education 01-04, Languages 01-05, the last one bold), the note "and a bit of Russian", and the `workedWith` line plus CONFIRM 5.
8. **CtaField** (added by BaseLayout, `components/shared/CtaField.astro`): saffron band, the headline "Have a challenge worth solving together?" with "together" circled, the body plus CONFIRM 9, a booking button, the email address, magnetic dots, a sticker and the note "we're all ears".

### 1.2 DATA used
| Import path | Export | Fields used | Where |
|---|---|---|---|
| `@/data/founder` | `about` | `overline` ("About"), `headline` ("Built on 25 years of making ingredients work."), `intro` | about.astro:23 (crumb label); AboutHero:27-29 |
| `@/data/founder` | `portraitAlt` | `.about` ("Ganeaysh Kulkarni"), `.founder` (default alt in FounderPhoto) | AboutHero:36 |
| `@/data/founder` | `longBio` (string[6]) | [0] lede, [1..5] long version. [1] contains `${minus25}` from `@/lib/typography` (U+2212 and U+202F) | LongBio:15-16 |
| `@/data/founder` | `bioSidenotes` (`{at,text}[]`) | `at` is the 1-based paragraph index. `2001 · Wilmar`, `2012 · Cargill`, `2023–2026 · Global Product and Process Design Director` | LongBio:15,34-37 |
| `@/data/founder` | `timeline` (`TimelineItem{label,years}[]`) | CFTRI Mysore 1999–2001, Wilmar 2001–2012, Cargill 2012–2026, KoKreaters 2026 | Timeline:15-16,22,33-41 |
| `@/data/founder` | `globe` | `overline` ("The map"), `headline`, `lead` | GlobeSection:21-23 |
| `@/data/places` | `places` (8 × `{name,country,lat,lon}`, `as const`), `placeLabel(p)` gives `"Name, Country"`, type `PlaceEntry` | Mundra, Kakinada, Gurugram, Pune (India); Medan (Indonesia); Odessa (Ukraine); Balikesir (Türkiye); Amsterdam (the Netherlands). In the brief's order; "no chronology is implied (C-13)" (places.ts:1) | GlobeSection:24-26; scripts/globe/scene.ts |
| `@/data/founder` | `name` | `heading`, `ko`, `kreaters`, `quote`, `tagline`, `lockupAlt` | NamePanel:15,28-32 |
| `@/data/founder` | `educationHeading`, `educationLabel`, `languagesLabel`, `education` (4), `languages` (5), `workedWith` | | EducationLanguages:10-24 |
| `@/data/founder` | `founderName`, `founderRole`, `shortBio` | Used by `person()` JSON-LD (schema.ts:7,111-114). `shortBio` is also a ready-made **short story** paragraph | schema.ts |
| `@/data/microcopy` | `microcopy.placesLabel` ("Places in Ganeaysh's career") | aria-label of the places `<ol>` | GlobeSection:24 |
| `@/data/notes/story` | `storyNotes.about.*` | `hello`, `flap`, `years`, `yearsLabel`, `more`, `road`, `spin`, `ko`, `kreaters`, `russian` (story.ts:42-53) | see section 1.4 |
| `@/data/home` | `cta` | `headline`, `swooshPhrase`, `body`, `button` (home.ts:36-40) | CtaField |
| `@/data/notes/chrome` | `chromeNotes.cta` ("we're all ears") | | CtaField:30 |
| `@/config/site` | `site.bookingUrl`, `site.email`, `site.linkedin` | CtaField:28-29. `site.linkedin` is not used on About yet but **is the source for the new LinkedIn button** | |
| `@/lib/seo` | `pageSeo('about')` | title "About Ganeaysh Kulkarni, Founder \| KoKreaters", og `/og/about.png`, ogType profile | about.astro:24 |
| `@/components/seo/schema` | `person(image)` | about.astro:24 | |

Not on About today but available and relevant: `@/data/impact` `founderResults` entry `id:'tfa'` (impact.ts:35-41: `outcome` "Trans-fat elimination work recognised by the WHO Director-General", `result` "Publicly recognised by the Director-General of the World Health Organization."); `@/data/home` `proof[3]` `{ value: 'WHO', label: 'Director-General recognition for trans-fat elimination work' }` (home.ts:16).

### 1.3 Hard-coded copy inside About .astro files
- `components/about/AboutHero.astro:21`: `const phrase = '25 years';`. A split token for the underline. The H1 has to render the full `about.headline` unbroken once the Scribble goes.
- `components/about/NamePanel.astro:18`: `<span class="name-panel__ko">Ko</span>` (aria-hidden display word).
- `components/about/NamePanel.astro:22`: `<span class="name-panel__kr">Kreaters</span>` (aria-hidden display word). The brief wants "the name Ko + Kreaters", so keep these two words. They are the only hard-coded About copy.
- `components/about/Timeline.astro:22`: the h2 is built as `timeline.map((t) => t.label).join(' → ')`, giving "CFTRI Mysore → Wilmar → Cargill → KoKreaters" (derived, not typed).
- `components/about/EducationLanguages.astro:12`: the `k()` numbering 01, 02, … (display only).
- `components/about/LongBio.astro:13-14`: `withFigures()` wraps every `\d+%` in `<span class="nowrap tnum">`. Keep this, so "21%" and "15%" never break across lines.
- `components/about/LongBio.astro:25`: the visually hidden `<h2 id="bio-title">` built from `storyNotes.about.years` + `yearsLabel`, giving "25 years of making ingredients work" (the section's accessible name).

### 1.4 Asides, toys and notes to DELETE (About)
| Verbatim | Source | Rendered at |
|---|---|---|
| "hello from the Netherlands" | data/notes/story.ts:43 | AboutHero.astro:37-38 (MarginNote) |
| `['INDIA · WILMAR','INDONESIA · WILMAR','UKRAINE · −25 °C','TÜRKIYE','THE NETHERLANDS']` (the split-flap "letter scramble"). There is no other "scramble" in `src`; this is it | story.ts:44 | about.astro:28-30 |
| "the long way round" (listed by name in the brief) | story.ts:48 | Timeline.astro:31 |
| "scroll to spin it" (listed by name in the brief) | story.ts:49 | GlobeSection.astro:29 |
| "= together" | story.ts:50 | NamePanel.astro:19 |
| "= the people who make things happen" | story.ts:51 | NamePanel.astro:23 |
| "and a bit of Russian" | story.ts:52 | EducationLanguages.astro:21 |
| "we're all ears" (listed by name in the brief) | data/notes/chrome.ts:17 | CtaField.astro:30 (on About through BaseLayout) |
| The decorative doodles (node, spark), saffron disc, engraving and EdgeLight | — | AboutHero.astro:31-35 |
| Hand-drawn underline on "25 years" (keep the words) | — | AboutHero.astro:28 |
| Hand-drawn circle on "together" (keep the words) | — | CtaField.astro:25 |

**Borderline, flag for decision:**
- "Read the long version +" (story.ts:47, LongBio:29). **KEEP the label**, because the brief asks for "Read the long version". Drop the "+" glyph and move the string out of `data/notes/` (for example into `founder.ts` or `microcopy.ts`), since `notes/` is the module being retired.
- "25" and "years of making ingredients work" (story.ts:45-46, DERIVED). The counting numeral now repeats the H1. Either drop it or keep it as one quiet static stat, but keep a real h2 for the bio section.
- "= together" and "= the people who make things happen": the meaning is already carried by `name.ko` and `name.kreaters`, so nothing is lost if they go.
- `name.quote` ("…'co-creation and creativity at its soul, at a global level'."): keep it. It may fall under CONFIRM 4 ("Approve founder quote wording") even though no marker is rendered.

### 1.5 CONFIRM markers on About
- `<Confirm id={13} note="founded in 2026 and career dates" />`: LongBio.astro:26 (after the lede)
- `<Confirm id={13} note="career dates" />`: Timeline.astro:44
- `<Confirm id={5} note="sectors only, no company names" />`: EducationLanguages.astro:24
- `<Confirm id={9} note="free first call" />`: CtaField.astro:26 (via BaseLayout)
- Code comments only, not rendered: founder.ts:1 and founder.ts:33 `// CONFIRM 13`.
- Relevant but never rendered: CONFIRM 3, "Professional portrait session" (mode.ts:18), which is the gap for the new portrait.

### 1.6 Behaviour that must survive (About)
- **JSON-LD**: `person(portraitWebp.src)` (about.astro:22,24). The image comes from `getImage({ src: portrait, format: 'webp', width: 960 })`, where `portrait` is `@/assets/photos/ganeaysh-cutout.png`. BaseLayout adds a BreadcrumbList (Home > About). `tests/seo.spec.ts:71` expects `['Person','BreadcrumbList']` in one JSON-LD block. **When the portrait changes, switch the `getImage` source to the new photo.**
- **Breadcrumbs**: `crumbs = [{ label: about.overline, href: '/about' }]` (about.astro:23). Visible inside the hero (AboutHero:26) because `showCrumbs={false}` on BaseLayout.
- **One h1** (`#about-title`), `section aria-labelledby` ids: `about-title`, `bio-title`, `journey-title`, `globe-title`, `name-title`, `edu-title`. `tests/smoke.spec.ts` requires exactly one visible h1.
- **Bio progressive disclosure**: a native `<details>`/`<summary>`. The paragraphs stay in the DOM (good for SEO and AEO). Keep it native.
- **Places list**: the `<ol aria-label={microcopy.placesLabel}>` is the accessible carrier of the eight names. Keep it beside the new static map, with the map itself `aria-hidden` or carrying alt text.
- **LinkedIn link pattern** (copy from ContactDetails:37): `rel="noopener me"` plus a visually hidden "(opens LinkedIn)" (`microcopy.opensLinkedIn`).
- SEO strings come from `pageSeo('about')` (title, description, `/og/about.png`, ogType `profile`).
- **Tests that assume the globe**: `tests/budget.spec.ts:52-82` (three.js only on /about; `[data-globe] svg` visible at 390 px and under reduced motion). **Rewrite or delete these when the globe goes.**

### 1.7 Dead after the redesign (About)
- `components/bencho/FlapBoard.astro` and `scripts/bencho/flap-board.ts`, plus the lazy branch in `scripts/motion/index.ts:39-41`. Home `ProofBand.astro` also uses FlapBoard, and the brief removes split-flap site-wide, so it ends up fully dead.
- `components/about/GlobeSection.astro`, `scripts/globe/loader.ts`, `scripts/globe/scene.ts`, `assets/globe/globe-static.svg`, the `three` dependency (package.json:40), and `scripts/pages/about.ts` `watchGlobe()` and `globeLoader` (L11-12, L50-65). `data/globe/coast.json` and `scripts/build-globe.mjs` can be **repurposed** to render the flat static map at build time.
- `scripts/pages/about.ts` `initJourney()` (L14-48: DrawSVG scrub, tiles dropping, year count-up). After this the whole `about.ts` is dead.
- `components/brand/Engraving.astro`: used only by AboutHero.
- In About only, these leave: MarginNote, Scribble, Doodle, Sticker, SpecLabel, `data-edge-light`, `data-parallax`, `data-count`, `data-rise`, and the `.grain`, `.paper-grid`, `.has-notes` and `g-*` ground classes. Most are still used on other routes, so delete them with the matching home and inner-page work.
- `storyNotes.about` (story.ts:42-53) once `more` has been moved.

---

## 2. CONTACT `/contact`

### 2.1 Current section order (`src/pages/contact.astro:12-27`)
One `<section class="band contact g-white paper-grid has-notes" aria-labelledby="contact-title">` on a 5/7 grid. Below 1024 px it collapses to a single column.
1. **Left, ContactDetails** (`components/contact/ContactDetails.astro`): the "Contact" dateline, H1 `#contact-title` "Let's create something together." with "together" highlighted, the intro plus CONFIRM 9, an `<address><dl>` holding Email, WhatsApp and LinkedIn, `site.base`, then the boarding-pass **Ticket** (Book a 30-minute call) plus CONFIRM 9.
2. **Right, ConnectionMoment** (`components/contact/ConnectionMoment.astro`): a decorative step path You → 1 Who → 2 What → 3 Send → Ganeaysh avatar. It fills as fields become valid (aria-hidden).
3. **Right, ContactForm** (`components/contact/ContactForm.astro`): 9 fields, the consent checkbox, a honeypot, the time-trap field, an optional Turnstile widget, the Send button, a live status region and the "talk soon" note.
4. **Confetti** canvas (`components/bencho/Confetti.astro`), fired once on success.
- No CtaField. No visible breadcrumbs (JSON-LD only).

### 2.2 DATA used
| Import path | Export | Fields | Where |
|---|---|---|---|
| `@/data/contact` | `contact` | `overline` "Contact", `headline` "Let's create something together.", `intro` (CONFIRM 9 reply-time), `details.{email,whatsapp,linkedin}` labels, `booking` "Book a 30-minute call", `submit` "Send", `visitorFallback` "You" | ContactDetails:20-35; ContactForm:94; ConnectionMoment:15,22; Ticket:39,52 |
| `@/data/contact` | `fields: ContactField[]` | `{name,label,type,required,autocomplete,options?,rows?}`. In order: name* (text), company* (text), role (text), email* (email), phone "Phone or WhatsApp" (tel), country* (text), interest* "Area of interest" (select, options = `pillars.map(p => p.name)` + `notSureYet`), message* (textarea, 6 rows), source "How did you hear about us?" (text), consent* (checkbox, label below) | ContactForm:20-27,47-86 |
| `@/data/contact` | `consentLink` | `{ text: 'Privacy Policy', href: '/privacy' }`. The substring in the consent label is turned into a link | ContactForm:20-24,81 |
| `@/data/contact` | `notSureYet` | "Not sure yet" (last select option) | contact.ts:15,25 |
| `@/data/pillars` | `pillars[].name` | select options (through `fields`) | contact.ts:3 |
| `@/config/site` | `site.email` ("office@kokreaters.com", CONFIRM 9), `site.whatsapp.{display,href}` ("+31 6 2215 7910", `https://wa.me/31622157910`), `site.linkedin.{display,href}`, `site.base` ("Based in the Netherlands, working worldwide"), `site.formEndpoint`, `site.turnstileSiteKey`, `site.bookingUrl` | | ContactDetails:28-41; ContactForm:18-19,36-43,91; Ticket:27-29 |
| `@/data/microcopy` | `opensLinkedIn`, `required` ("Please fill this in so we can reply."), `invalidEmail` ("Please enter an email address we can reply to."), `formSuccess` ("Thank you. Your message is with us and Ganeaysh will reply within one working day."), `formError` ("Something went wrong. Please try again, or email office@kokreaters.com."), `mailtoSent` ("Your email app should now open with your message ready to send. If it does not, write to office@kokreaters.com."), `bookingCta` (same string as `contact.booking`) | | ContactDetails:37; ContactForm:38-42 |
| `@/data/notes/journal` | `journalNotes.form.{detail,soon,who,what}`, `journalNotes.ticket.*` | see section 2.4 | |
| `@/data/founder` | `founderName` | Ticket "With" field | Ticket:45 |
| `@/lib/seo` | `pageSeo('contact')` | "Contact KoKreaters \| Start a Conversation", `/og/contact.png` | contact.astro:12 |

The consent label, verbatim (contact.ts:28): "I agree to KoKreaters storing my details to respond to this enquiry, as described in the Privacy Policy."

### 2.3 Hard-coded copy inside Contact components
- `pages/contact.astro:10`: `const crumbs = [{ label: 'Contact', href: '/contact' }];` (could use `contact.overline`).
- `components/contact/ContactDetails.astro:15`: `const W = 'together';` (split token for the highlight). The H1 must render `contact.headline` whole.
- `components/contact/ContactForm.astro:52` and `:82`: the visually hidden `" (required)"` after each required label, plus a visible `*` (aria-hidden). **Keep.**
- `components/contact/ContactForm.astro:59`: `<option value="" selected disabled></option>` (blank first option). Keep, or give it a placeholder label.
- `components/contact/ContactForm.astro:89`: the honeypot label `Website`, input `name="company_website"`.
- `scripts/pages/contact.ts:166`: the mailto subject `` `Enquiry from ${v('name')}, ${v('company')}` ``.
- `scripts/pages/contact.ts:167-168`: the mailto body, one `${LABEL}: ${value}` line per field in `ORDER`, then `Consent: yes`.
- `scripts/pages/contact.ts:107`: `https://challenges.cloudflare.com/turnstile/v0/api.js`.
- `components/bencho/Ticket.astro:41`: `GK` (toy, dead).

### 2.4 Asides, toys and notes to DELETE (Contact)
| Verbatim | Source | Rendered at |
|---|---|---|
| "Boarding pass", "Passenger", "With", "Length", "30 min" | journal.ts:23-27 | Ticket.astro:35,44-46 |
| "tear here" (listed by name in the brief) | journal.ts:28 | Ticket.astro:55 |
| "the more detail, the better" | journal.ts:31 | ContactForm.astro:49 |
| "talk soon" (listed by name in the brief) | journal.ts:32 | ContactForm.astro:98 (shown on success) |
| "Who", "What" (step path) | journal.ts:33-34 | ConnectionMoment.astro:13-14 |
| "You" visitor node (`contact.visitorFallback`, also `microcopy.visitorFallback`) | data/contact.ts:12; microcopy.ts:60 | ConnectionMoment:22; Ticket:39,44 |
| Confetti burst | — | contact.astro:26 |
| The "together" highlighter scribble (keep the words) | — | ContactDetails:21 |

**Borderline:** "the more detail, the better". If the designer wants a field hint, rewrite it as plain help text under Message, for example "Share as much detail as you can." This would be new COMPOSED copy. The H1 "Let's create something together." is brief copy: keep.

### 2.5 CONFIRM markers on Contact
- `<Confirm id={9} />`: ContactDetails.astro:22 (after `contact.intro`, covering the reply-time promise and public email)
- `<Confirm id={9} />`: Ticket.astro:57 (booking tool; dies with the Ticket)
- Code comments only: data/contact.ts:8 `// CONFIRM 9`, site.ts:11,15 `// CONFIRM 9`.
- CONFIRM 9 means "Public email address, reply-time promise, booking tool, free first call" (mode.ts:24).

### 2.6 Form submission logic (exact). Must survive.
**Files:** `components/contact/ContactForm.astro` (markup), `scripts/pages/contact.ts` (behaviour), `config/site.ts` (env), `.env.example`.

**Env vars** (build time, `config/site.ts:15-18`; `.env.example`):
- `PUBLIC_FORM_ENDPOINT` becomes `site.formEndpoint` (default `''`). Empty means the mailto fallback. Example targets: Formspree, Web3Forms, a Cloudflare Worker.
- `PUBLIC_TURNSTILE_SITEKEY` becomes `site.turnstileSiteKey` (default `''`). Empty means honeypot plus time trap only.
- `PUBLIC_BOOKING_URL` becomes `site.bookingUrl` (default `'/contact#form'`).
- `PUBLIC_SITE_MODE` is `staging` or `production` (section 5). `PUBLIC_NEWSLETTER_ENDPOINT` belongs to the newsletter, not this form.

**No-JS baseline** (ContactForm.astro:18-19,29-45):
- `method="post"`.
- `action = site.formEndpoint || 'mailto:office@kokreaters.com'`.
- `enctype = 'multipart/form-data'` with an endpoint, `'text/plain'` without one.
- The native `required` and `type="email"` attributes guard the submit. JS later sets `form.noValidate = true` (contact.ts:24).
- `id="form"` is the anchor target for `/contact#form`.
- `aria-labelledby="contact-title"` points at the page H1. **Keep that id on the H1.**
- Data attributes the script reads: `data-form`, `data-endpoint`, `data-mailto`, `data-msg-required`, `data-msg-email`, `data-msg-success`, `data-msg-error`, `data-msg-mailto`, `data-turnstile`.

**Markup hooks the script depends on** (keep the selectors, or update contact.ts with them):
- `form[data-form]` (L17).
- `[data-form-status]`, which uses a **non-null assertion** (L30). It is `role="status" aria-live="polite"`.
- `[data-submit]` (L31).
- `[data-started-at]` (L26).
- `input[name="company_website"]` (L178).
- `.cf__label` (L52; the first text node gives the mailto labels).
- `.cf__field input/select/textarea` (L135).
- `#${name}-error` containing `[data-error-text]` (L114-120).
- `template[data-icon="success|error"]` (L58).
- `a[data-booking="form"]` (L92).
- Null-safe optional hooks (die with the toys): `.cm`, `[data-connection-line]`, `[data-visitor-label]`, `[data-ticket-passenger]`, `[data-ticket]`, `[data-confetti]`, `[data-soon]`, `[data-seg]`, `[data-stop]`.

**Sequence** (contact.ts):
1. Set-up. `loadedAt = performance.timeOrigin`, which is navigation start, not first interaction (L25). It is written to the hidden `started_at` (L26-27).
2. Turnstile. When `data-turnstile` is set, the api.js script is injected **on the first `focusin` inside the form**, never on load. The guard is `script[data-turnstile-script]` (L103-111). The widget div is `<div class="cf-turnstile" data-sitekey=…>` (ContactForm:91), rendered only when the key is set. Implicit rendering adds the `cf-turnstile-response` input, which is sent with the FormData.
3. Live re-validation. Once a field has `aria-invalid="true"`, it is re-checked on `input` (or `change` for select and checkbox) (L137-139).
4. Submit (L173-215):
   1. `e.preventDefault()`. A `sending` guard blocks double submits.
   2. **Traps** (L178-183): if the honeypot `company_website` is non-empty, or `Date.now() - loadedAt < 3000` (`MIN_MS`), the script sets `form.dataset.trapped='true'`, shows a **fake success** (`msgSuccess` with an endpoint, `msgMailto` without) and **sends nothing**.
   3. **Validation** (L186-192, `check()` at L127-134): a required checkbox must be checked; required text, select and textarea values must be non-empty after `trim()`; email must match `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` (L10). On each error it sets `aria-invalid="true"` and `aria-describedby="${name}-error"`, fills `[data-error-text]` and unhides the `<p class="field-error">` with its error icon. It focuses the **first** invalid field and clears the status.
   4. **Endpoint** (L195-207): `fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })`. While it runs, `busy()` sets `aria-busy="true"` and `disabled` on the button (L158-162). If `res.ok`: `resetAll()` (form.reset, clear errors, restore `started_at`), then `say('success', formSuccess)`, plus `connect()` and `celebrate()` (decorative). Otherwise, or on an exception, `say('error', formError)`.
   5. **Mailto fallback** (L210-214): `mailtoUrl()` gives `mailto:office@kokreaters.com?subject=Enquiry from {name}, {company}&body=…`, a `Label: value` line for each of `ORDER = ['name','company','role','email','phone','country','interest','message','source']`, then `Consent: yes`. That URL is stored in `form.dataset.mailtoUrl` (a test hook) and `window.location.href` is set to it. Then `say('success', mailtoSent)`.
5. `say(tone, msg)` (L141-146) sets `data-tone` on the status element, prepends the icon template's HTML (unless the tone is `info`) and appends a text node.

**What the endpoint receives:** `name, company, role, email, phone, country, interest, message, source, consent=yes, company_website, started_at` (+ `cf-turnstile-response`).

**Consent checkbox**: `id="f-consent" name="consent" value="yes" required`. Its label has the Privacy Policy link, `*` and " (required)". The error goes in `#consent-error`. The 44×44 hit box is `.cf__box`.

**Field ids** are `f-${name}`. Error ids are `${name}-error`. The `autocomplete` values come from data (name, organization, organization-title, email, tel, country-name, off). Email gets `inputmode="email" spellcheck="false"`; tel gets `inputmode="tel"`.

**Honeypot CSS**: `.hp { position:absolute !important; left:-10000px !important; width:1px; height:1px; overflow:hidden }` (ContactForm:146), with `aria-hidden="true"` and `tabindex="-1"`. `tests/helpers.ts:94` deliberately skips "aria-hidden + off-screen" nodes, so keep that pattern.

**Spam-protection gaps:**
- The honeypot and time trap are **client-only**. Nothing server-side checks `started_at` or `company_website`.
- The honeypot name is custom: Formspree expects `_gotcha` and Web3Forms expects `botcheck`, so neither provider filters it on its own.
- **Turnstile siteverify is not implemented anywhere.** The site is static, so it depends entirely on the form provider or a Worker.

**CSP coupling:**
- `vercel.json` and `public/_headers` are **generated by `scripts/csp-hash.mjs`** (run through `npm run verify`, not by `npm run build`). It adds the `PUBLIC_FORM_ENDPOINT` origin to `connect-src` and `form-action`, and `challenges.cloudflare.com` to `script-src`, `connect-src` and `frame-src` when `PUBLIC_TURNSTILE_SITEKEY` is set.
- The current policy is `connect-src 'self'`, `form-action 'self' mailto:`, and **no `frame-src`**. Any endpoint, Turnstile key or booking embed therefore means running csp-hash with those env vars and committing `vercel.json` again.
- csp-hash has **no support for a Cal.com or Calendly origin**.
- `tests/smoke.spec.ts` fails a route on **any third-party request at load** and on any CSP violation. So the booking feature has to be a plain external link, or an embed that only loads on click, with csp-hash extended for its origin.

**Booking pill:**
- When `site.bookingUrl === '/contact#form'`, Ticket links to `#form` with `data-booking="form"`. contact.ts (L92-100) then smooth-scrolls to the form (instant under reduced motion), focuses `#f-name` and runs `history.replaceState(null,'','#form')`.
- Otherwise it is an external link with `rel="noopener"`.
- CtaField (other pages) links to `site.bookingUrl` directly.

### 2.7 Dead after the redesign (Contact)
- `components/contact/ConnectionMoment.astro` (only here).
- `components/bencho/Ticket.astro` and `scripts/bencho/ticket.ts` (only here).
- `components/bencho/Confetti.astro` and `scripts/bencho/confetti.ts` (only here).
- In `scripts/pages/contact.ts`: L36 (`passengers`), L37 and L43-51 (`soon`, `celebrate`), L39-42 (ticket and confetti loaders), L60-73 (visitor label), L75-89 (`progressPath` and `GROUPS`), L148-151 (`connect`).
- `journalNotes.ticket` and `journalNotes.form`; `contact.visitorFallback` and `microcopy.visitorFallback`.
- The FounderPhoto `avatar` use here (still used in articles).

---

## 3. LEGAL `/privacy`, `/cookies`, `/terms`

### 3.1 Structure (`src/layouts/LegalLayout.astro`, used as the MDX `layout:`)
1. A `<header>` with a paper grid (L39-56): Breadcrumbs (L41), the dateline `microcopy.legalDateline` ("Legal", L42), the H1 `fm.title` (L44), a MarginNote (L45), the "Last updated" pill with `<time datetime={isoDate}>{formatDate}</time>` (L47-51), and a spinning Stamp with the logo cluster (L52-54).
2. A hazard-stripe banner `microcopy.legalBanner`, shown when `!fm.reviewed` (L57).
3. A grid (L58-71): `<div class="prose prose--legal legal__body"><slot/></div>` (MDX body). When there are more than 2 h2s, a TOC `<nav aria-labelledby="legal-toc-t">` titled `microcopy.onThisPage`, with a numbered 01.. list linking `#${h.slug}`. The TOC is sticky at ≥ 1024 px, hidden below 1024 px, and styled as a rotated butter card.
- `BaseLayout page="legal" showCrumbs={false}`: no CtaField, BreadcrumbList JSON-LD (Home > Title).

### 3.2 DATA and props
- **Frontmatter** (L19): `title` (required), `description?`, `updated?` (string or Date), `reviewed?`, `seoKey?`. Non-MDX use passes the same as props (L22-27).
- **SEO** (L28-32): `key = fm.seoKey ?? path.slice(1)`, then `pageSeo(key)` inside a try. The fallback is `{ title: `${fm.title} | KoKreaters`, description, path }`. The seo.ts keys `privacy`, `cookies` and `terms` exist (no og key, so the og image falls back to `/og/default.png`).
- **Microcopy**: `legalDateline` "Legal", `lastUpdated` "Last updated {date}" (rendered as `fill(…,{date:''}).trim()` and then a `<time>`), `legalBanner` "Placeholder text for review by a lawyer before launch. Not legal advice.", `onThisPage` "On this page".
- **Libs**: `@/lib/format` `fill`, `formatDate` (en-GB "4 Nov 2026"), `isoDate`.
- `journalNotes.legal.print` (delete).
- Prose styles live in `src/styles/prose.css:121-141` (`.prose--legal`: 17/28 body, h2 28/32).

### 3.3 The copy lives in the MDX files themselves (keep the files and change only the layout)
- `pages/privacy.mdx` (updated 2026-11-04). h2s: Who we are · What we collect · Why we use it, and the legal basis · Who processes it · How long we keep it · Your rights · Fonts and embeds · Changes. That is 8 h2s, so the TOC shows.
- `pages/cookies.mdx` (2026-11-04). h2s: No analytics or advertising cookies · What the site stores · Spam protection · How to control cookies · Contact (5).
- `pages/terms.mdx` (2026-11-04). h2s: Use of this site · General information, not advice · Results described on this site · Intellectual property · Links to other sites · Limitation of liability · Governing law · Contact (8).
- Each file has `{/* LAWYER REVIEW REQUIRED. Placeholder text (DESIGN-SPEC 4.14); every sentence is COMPOSED. */}` at L9. It is a JSX comment and is not rendered.

### 3.4 Delete
- "the small print, in normal-size print" (journal.ts:37, LegalLayout:45).
- The spinning Stamp with the text `Legal · {title} · ` (LegalLayout:52-54).
- The hazard-stripe banner styling (L84-90) and the rotated butter TOC (`g-butter`, `rotate:1deg`, hard shadow, L63,93).
- `.paper-grid`.

### 3.5 CONFIRM and draft markers on Legal
- privacy.mdx:13 `<Confirm id={11} note="legal entity, KvK, registered address" />`
- privacy.mdx:28 `<Confirm id={9} note="form provider" />`
- privacy.mdx:32 `<Confirm id="legal" note="retention period" />`. **This is the whole body of "How long we keep it", so in production that section renders an empty h2.** This is a content gap.
- cookies.mdx:21 `<Confirm id="legal" note="Turnstile in use and its terms" />`
- terms.mdx:25 `<Confirm id={12} />` (trademark)
- terms.mdx:37 `<Confirm id="legal" note="governing law and courts" />`
- **`microcopy.legalBanner` is NOT gated by mode** (LegalLayout:57). It shows in production until each file sets `reviewed: true`. This conflicts with the brief's "remove all visible DRAFT/CONFIRM labels". Either gate it with `isStaging` or set `reviewed: true` after legal review.

### 3.6 Content statements that a v3 feature would make false (flag for legal copy)
- privacy.mdx:40 says "The site has no third-party embeds and no analytics." That stops being true with a Cal.com or Calendly embed, and arguably with Turnstile.
- privacy.mdx:28 "Who processes it" names only the form service and Google Workspace. It would need the booking provider and Cloudflare (Turnstile).
- privacy.mdx:19-20 "What we collect" lists exactly the 9 contact fields and the newsletter email. Keep it in sync if any field changes.
- cookies.mdx:17 mentions only the Cookie-settings choice. It leaves out `localStorage['kk-motion']` from the pause-motion bar (`scripts/motion/pause.ts:8`); that key goes away if the pause bar is removed. The consent key is `kk-consent` (`scripts/consent.ts:10`).

---

## 4. 404 (`src/pages/404.astro`)

### 4.1 Current order
One section `.nf`, `aria-labelledby="nf-title"`:
- An aria-hidden outlined "404" numeral (L21).
- The H1 `#nf-title` `microcopy.notFoundHeadline` with "yet" hand-underlined (L22).
- The line `microcopy.notFoundLine` (L23).
- A primary Button to `/` labelled `microcopy.takeHome` (L25).
- On the right, the note "go on, make a mess" (L29) and the **FallingText** physics pit, where the H1 words fall as tiles you can throw (L30).

### 4.2 DATA
`@/data/microcopy`:
- `notFoundHeadline` "This page hasn't been created yet." (brief 7, keep)
- `notFoundLine` "Let's connect you back." (brief 7, keep)
- `takeHome` "Take me home" (brief 7, keep)
- Unused but available: `notFound` (both lines combined) and `reconnect` "Reconnect the node and go home" (COMPOSED).

`pageSeo('notfound')`: "Page not found | KoKreaters", `noindex: true`, path `/404`.

### 4.3 Hard-coded
- 404.astro:13 `const W = 'yet';` (split token).
- 404.astro:21 `404` (aria-hidden display numeral; fine to keep as a quiet brand numeral).

### 4.4 Delete
- "go on, make a mess" (journal.ts:40, 404.astro:29).
- FallingText (L30).
- The "yet" Scribble (L22). Keep the words.
- The lavender outlined numeral style (L40).

### 4.5 Behaviour to keep
- `BaseLayout page="notfound"` forces `noindex` (BaseLayout:35) and leaves out the CtaField.
- The sitemap filter excludes `/404` (astro.config.mjs).
- `tests/smoke.spec.ts:60-64` expects status 404, `body[data-page="notfound"]`, one h1 and noindex.
- No breadcrumbs and no JSON-LD.

### 4.6 Dead
- `components/bencho/FallingText.astro`, `scripts/bencho/falling-text.ts`, `scripts/pages/notfound.ts`.
- `scripts/bencho/physics.ts` also goes if `gravity-tags.ts` (Industries) is also removed.

---

## 5. CONFIRM / DRAFT mode handling

- **Mode source**: `src/config/site.ts:10` sets `mode = env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'staging'`. **Staging is the default when the variable is unset.**
- `src/lib/mode.ts:7-9` exports `mode`, `isStaging` and `isProduction`.
- `src/lib/mode.ts:15-30` exports `confirmItems` (ids 1-14 mapped to the brief titles). It is **imported nowhere** (dead reference table).
- **`<Confirm id note?>`** (`components/ui/Confirm.astro:8`): `{isStaging && <span class="confirm" data-confirm-id={id}><span class="confirm__txt">CONFIRM {id}{note && `: ${note}`}</span></span>}`. In production it renders **nothing**. ids in scope: `5`, `9`, `11`, `12`, `13`, `"legal"`.
- **`<DraftRibbon>`** (`components/ui/DraftRibbon.astro`) is also gated by `isStaging`. It is not used in this scope.
- **Staging also**:
  - forces `<meta name="robots" content="noindex, nofollow">` (SeoHead:17);
  - makes `robots.txt` `Disallow: /` (`pages/robots.txt.ts:9-11`).
- **Not mode-gated**: the LegalLayout review banner (section 3.5).
- **Builds**:
  - `npm run build` gives staging.
  - `npm run build:prod` gives `PUBLIC_SITE_MODE=production`.
  - The GitHub Pages workflow (`.github/workflows/pages.yml:18`) builds **staging**.
  - Vercel's env is not in the repo (`vercel.json` holds only headers).
  - **For a client-facing live link with no CONFIRM pills, deploy with `PUBLIC_SITE_MODE=production`**. That also makes the site indexable, so decide this on purpose.

---

## 6. Behaviour checklist (all four areas)

| Behaviour | Mechanism | File |
|---|---|---|
| One h1 per page, `lang="en-GB"`, `main#main` | Test-enforced | tests/smoke.spec.ts |
| Breadcrumb JSON-LD | `breadcrumbs` prop, then BaseLayout:40, then `schema.ts breadcrumbs()` with `withHome` | BaseLayout, schema.ts |
| Visible breadcrumbs | About: inside the hero (AboutHero:26). Legal: inside the header (LegalLayout:41). Contact: **none**. 404: none | |
| Person JSON-LD | `person(getImage(cutout).src)` | about.astro:22-24 |
| SEO strings and og | `pageSeo(key)` | lib/seo.ts, data/seo.ts |
| noindex | 404 always; everything in staging | BaseLayout:35, SeoHead:17 |
| Bio disclosure | native `<details>` | LongBio:28 |
| Accessible places list | `<ol aria-label={microcopy.placesLabel}>` | GlobeSection:24 |
| Contact form | section 2.6 | ContactForm.astro, scripts/pages/contact.ts |
| Booking link to the form | `a[data-booking="form"]` focuses `#f-name` | contact.ts:92-100 |
| Live status region | `[data-form-status] role=status aria-live=polite` | ContactForm:97 |
| Field errors | `aria-invalid`, `aria-describedby=<name>-error`, focus on the first invalid field | contact.ts:115-126,192 |
| LinkedIn external link a11y | `rel="noopener me"` + visually hidden "(opens LinkedIn)" + external icon | ContactDetails:37 |
| Legal TOC | MDX `headings` with depth 2, TOC when count > 2, `#slug` anchors | LegalLayout:34,62-70 |
| Last-updated date | `<time datetime=YYYY-MM-DD>` with en-GB display | LegalLayout:47-51 |
| Percent nowrap, minus sign | `withFigures()`; `minus25` in `longBio[1]` | LongBio:13-14; lib/typography.ts:35 |
| CSP and inline-script hash | `scripts/csp-hash.mjs` writes `public/_headers` + `vercel.json`. **Re-run it after any change to the BaseLayout inline script or to the endpoint, Turnstile or booking env** | scripts/csp-hash.mjs |
| No third-party requests on load | Test-enforced, so Turnstile loads lazily on focusin; booking must not embed on load | tests/smoke.spec.ts |
| three.js only on /about | Test-enforced. **Rewrite when the globe goes** | tests/budget.spec.ts:52-82 |

---

## 7. Components and scripts that become dead (consolidated)

- **About only**: `components/about/GlobeSection.astro`, `components/brand/Engraving.astro`, `scripts/pages/about.ts` (whole file), `scripts/globe/loader.ts`, `scripts/globe/scene.ts`, `assets/globe/globe-static.svg`, the `three` dependency, the Timeline SVG path and tiles (rewrite Timeline.astro).
- **Contact only**: `components/contact/ConnectionMoment.astro`, `components/bencho/Ticket.astro`, `scripts/bencho/ticket.ts`, `components/bencho/Confetti.astro`, `scripts/bencho/confetti.ts`, and the decorative half of `scripts/pages/contact.ts` (section 2.7).
- **404 only**: `components/bencho/FallingText.astro`, `scripts/bencho/falling-text.ts`, `scripts/pages/notfound.ts`.
- **Shared, and dead once the other routes are also redone**:
  - `components/bencho/FlapBoard.astro` + `scripts/bencho/flap-board.ts` (also home ProofBand).
  - `components/notes/*`: MarginNote, Scribble, Doodle, Sticker, Stamp, SpecLabel, Tape, Venn, `notes.css`, `paths.ts`.
  - `scripts/motion/notes.ts`, `parallax.ts`, `cursor.ts`, `magnetic.ts`, `pause.ts`, `rail.ts`, `marquee.ts`, `scrub-words.ts`, `countup.ts`.
  - `scripts/bencho/edge-light.ts` + `EdgeLight.astro`, `MagneticDots` (CtaField), `scripts/bencho/physics.ts`.
  - `data/notes/*.ts` + `scripts/notes-copy.mjs`.
  - The Bricolage, IBM Plex Mono, Caveat and Instrument Sans font preloads (BaseLayout:57-58). `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4` are **already in package.json:32-33**.
- **Already dead**: `confirmItems` (mode.ts), `microcopy.reconnect`, `microcopy.notFound`.

---

## 8. Mapping: brief target to data source to gap

### About
| Brief target | Data available | Gap / CONFIRM |
|---|---|---|
| Hero: professional portrait + "Built on 25 years of making ingredients work." | `about.headline`, `about.intro`, `about.overline`, `portraitAlt.about`; photo `assets/photos/ganeaysh-cutout.png` (background-removed cut-out, 1665×2048 RGBA) | **Portrait**: no professional photo exists (CONFIRM 3, not rendered anywhere today). The current asset is a transparent cut-out, so the brief's "real photography, desaturated cool grade" needs a new photo or a graded cut-out on a neutral ground. Update the `getImage` source for the Person JSON-LD too |
| Short story, then "Read the long version" | `longBio[0]` (lede) or `shortBio`; `longBio[1..5]`; label `storyNotes.about.more` | Move the label out of `notes/` and drop the "+". CONFIRM 13 on the lede ("founded in 2026") |
| Horizontal timeline CFTRI 1999-2001 → Wilmar 2001-2012 → Cargill 2012-2026 → KoKreaters 2026 | `timeline` (exact match), `bioSidenotes` | CONFIRM 13 (career dates). **No per-step description in data.** One line per stop would be new COMPOSED copy drawn from `longBio[1]`/`[2]` (for example "Technical Head Specialties to Technical Director") |
| Static map of the eight places (no globe) | `places` (lat, lon), `placeLabel`, `globe.overline/headline/lead`, `microcopy.placesLabel`, `data/globe/coast.json` (land-110m `[[lon,lat],…][]`) | **No flat map asset.** Generate an equirectangular SVG at build time from `coast.json` (adapt `scripts/build-globe.mjs`). Keep the `<ol>`. `globe.overline` "The map" is fine as a label |
| The name: Ko + Kreaters; Connect · Collaborate · Create | `name.heading/ko/kreaters/quote/tagline/lockupAlt`; Logo `variant="full"` | "Ko" and "Kreaters" are hard-coded at NamePanel:18,22. The quote may need CONFIRM 4 |
| Education, languages | `educationHeading`, `educationLabel`, `languagesLabel`, `education`, `languages` | none |
| Recognition (WHO) | Nothing About-specific. Sources: the last sentence of `longBio[2]`; `founderResults.find(r => r.id==='tfa')` `.outcome` / `.result` (impact.ts:35-41); `proof[3]` (home.ts:16) | **No `recognition` export.** Reuse impact.ts `tfa` rather than re-typing it |
| Worked-with sectors | `workedWith` | CONFIRM 5 |
| NEW: LinkedIn button | `site.linkedin.href/display`, `microcopy.opensLinkedIn` | **No button label in data** (needs COMPOSED microcopy, for example "View LinkedIn profile") |
| NEW: one-page profile PDF | none | **No PDF in `public/`, no label, no CONFIRM id.** Needs a new asset (for example `public/kokreaters-ganeaysh-kulkarni-profile.pdf`), a label, and client sign-off |
| CTA at the end | `@/data/home` `cta` (+ CONFIRM 9 "free first call") | Delete `chromeNotes.cta` |

### Contact
| Brief target | Data available | Gap / CONFIRM |
|---|---|---|
| Left column: email, WhatsApp, LinkedIn | `site.email`, `site.whatsapp`, `site.linkedin`, `contact.details.*` | CONFIRM 9 (public email) |
| "Based in the Netherlands (CET), working worldwide" | `site.base` = "Based in the Netherlands, working worldwide" (site.ts:14). Also used by `nav.ts:38` (footer `footer.contact.base`, Footer.astro:50). The same string is duplicated in `home.ts` `hero.footLeft` | **"(CET)" is missing.** Change `site.base` (this also changes the footer) or add `site.baseWithZone` |
| H1, intro | `contact.overline`, `contact.headline`, `contact.intro` | CONFIRM 9 (reply within one working day) |
| Right column: form, current fields + consent | `fields`, `consentLink`, `notSureYet`, `pillars` | none; keep the markup hooks (section 2.6) |
| NEW: book a 30-minute call (Cal.com/Calendly) | `site.bookingUrl` (`PUBLIC_BOOKING_URL`), `contact.booking` / `microcopy.bookingCta` "Book a 30-minute call" | **No booking URL configured** (CONFIRM 9, "booking tool"). The CSP has no frame or script origin for it, and the smoke test bans third-party requests on load, so use an external link or a click-to-load embed and extend `csp-hash.mjs`. The privacy and cookies copy must then name the provider |
| Proper thank-you message | `microcopy.formSuccess`, `microcopy.mailtoSent`, `microcopy.formError` | Strings exist. Shown today as an inline status; a replacing thank-you panel can reuse them. **`PUBLIC_FORM_ENDPOINT` is empty, so the live behaviour today is the mailto hand-off**; the form provider is CONFIRM 9 (privacy.mdx:28) |
| Spam protection | Honeypot `company_website`, 3 s time trap, optional Turnstile | Client-side only, no siteverify. Pick a provider that does server-side Turnstile and honeypot checks, and rename the honeypot to the provider's field if needed |
| Remove boarding pass / "tear here" | Ticket | The booking action survives as a plain button |

### Legal
| Brief target | Data | Gap |
|---|---|---|
| Plain text pages in the same type style | MDX bodies + LegalLayout + `prose--legal` | CONFIRM 11, 9, 12 and "legal" ×3. The "How long we keep it" section is empty in production. The review banner shows in production. Some statements conflict with a booking embed or Turnstile (section 3.6) |

### 404
| Brief target | Data | Gap |
|---|---|---|
| Branded 404 | `notFoundHeadline`, `notFoundLine`, `takeHome`; Logo or NodeCluster for the quiet signature | none (copy is brief §7) |

---

## 9. Images and media currently used

| Asset | Used by | Notes |
|---|---|---|
| `src/assets/photos/ganeaysh-cutout.png` (1665×2048 RGBA) | AboutHero via `FounderPhoto variant="cutout"` (`<Picture>` avif/webp + png fallback, widths 480/720/960/1280, q70, lazy); about.astro:16,22 `getImage` webp 960 for the Person JSON-LD | Also used by home FounderFold and CoverStory |
| `src/assets/photos/ganeaysh-cutout-square.png` (1200×1200) | ConnectionMoment `FounderPhoto variant="avatar" size=52` | Also the article author avatar |
| `src/assets/globe/globe-static.svg` | GlobeSection (inline SVG import) | dead |
| `src/data/globe/coast.json` | scripts/globe/scene.ts | Reusable for the flat map |
| `src/assets/brand/svg/kokreaters-logo-full.svg` | NamePanel `Logo variant="full" width=320` | Keep as the name lockup |
| `src/assets/brand/svg/kokreaters-node-cluster.svg` | `Logo variant="cluster"` in Ticket (34px), LegalLayout Stamp (58px), CtaField sticker | The node-network signature |
| `components/brand/NodeCluster.astro` (inline SVG) | Timeline last tile (size 40, `discs={false}`) | |
| `components/brand/Engraving.astro` (inline SVG, `variant="cluster"`) | AboutHero | dead |
| `src/assets/fx/grain.png` | the `.grain` class (styles/grounds.css:56-62) on the AboutHero block, NamePanel, Ticket, CtaField | dead with grounds |
| `public/og/about.png`, `public/og/contact.png` | og:image | Legal and 404 fall back to `public/og/default.png` (no `og` key in seo.ts) |
| Icons (inline paths, `components/ui/Icon.astro`) | `external` (LinkedIn), `chevron` (select), `error`, `success` (form) | keep |
