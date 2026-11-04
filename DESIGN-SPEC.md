# KoKreaters.com: build specification (DESIGN-SPEC v1.0, 4 Nov 2026)

This is the one document build agents follow. If it disagrees with an earlier research file, this document wins. If it disagrees with `research/BRIEF.txt` on a **fact or a piece of copy**, the brief wins and the agent flags the clash.

Inputs it consolidates:
- `research/BRIEF.txt`: the source of truth for every word, fact, colour and SEO string.
- `research/VERDICT.md`: THE EDITORIAL wins, with grafts 1–13.
- `research/direction-editorial.md` (the base), `research/direction-network.md` (grafts 1–6), `research/direction-material.md` (grafts 7–13).
- `research/DNA.md`: the anti-pattern list, contrast facts and motion grammar.
- `DESIGN-DIRECTION.md`: the stack.
- `assets/`: logo rasters, the node-cluster SVG, the founder portrait and the brief wireframe.

Contents
0. Ground rules
1. Tokens and fonts
2. Project structure
3. Global chrome, SEO and machine files
4. Content layer (all copy)
5. Pages, fold by fold
6. Motion system
7. Assets mapping
8. Open-items log
9. Parallel build order
10. Running it, and the global acceptance gates

---

## 0. Ground rules (every unit reads this first)

### 0.1 The idea
**KoKreaters is published, not marketed.** Each page is set like an issue of a serious ideas journal written from the plant floor.
- The type does the work. Paper is white, ink is Imperial, and Sapphire line-work is drawn from the logo's own geometry.
- The logo opens once into its six pillar nodes, then docks into the header.
- After about two seconds the page is still. Motion is so quiet that you notice it only when it finishes.

### 0.2 Non-negotiables
1. **Copy and facts.** Use only text from `BRIEF.txt`, copied verbatim through `src/data/*` and `src/content/*`. Never invent claims, numbers, client names, testimonials or dates. When a label has to be written that the brief does not supply, put it in `src/data/microcopy.ts` with a `// COMPOSED` comment. Section 8 lists every such label.
2. **Past results** are always "From our founder’s career", never KoKreaters projects. Former employers (Wilmar, Cargill) appear as plain words only. Never show their logos.
3. **British English**: optimise, colour, programme, specialised, organisation. Use real typography: ’ “ ” · –. Write the minus as `−` (U+2212). Keep figures and units together with U+202F NARROW NO-BREAK SPACE: `−25 °C` is written `−25 °C`. Keep "21%" and "15%" on one line with `white-space: nowrap` via `.nowrap`.
4. **Spelling**: always "KoKreaters". Add ™ after the name in the footer only.
5. **One H1 per page.** Headings run in order. Headlines are sentence case; overlines and datelines are the only uppercase text, done with CSS `text-transform`. The source text stays in sentence case.
6. **The H1 and the LCP element are never hidden or animated.** Content is visible with no JS. Motion can only hide things while `html.motion` is set and `html.motion-failed` is not (6.2).
7. **Banned.** Gradient blobs or meshes. Generic card grids: there is one boxed element per page at most, and none on home. Emoji or clip-art icons. Stock people. Carousels. Hero video. Pins and scroll-jacking (the About globe uses CSS sticky, not a pin). Count-ups on anything except the three proof integers. Magnetic buttons, custom cursors, marquees, text scramble, tilt cards, parallax type, bounce, back or elastic eases. Icon fonts. Third-party CDNs at runtime. Analytics.
8. **Colour rules from the brief.** Body text is only Midnight Ink or Graphite. Saffron, Sky and the tints are never used as text on light grounds. Any Saffron or Sky dot on a light ground gets a 1px Ink ring (`--ring-ink`, VERDICT graft 10). Colour never carries meaning alone: pillar names are always written out.
9. **Arrows are SVG.** The `→` glyph (U+2192) is **not** in the Latin subset of either font: both unicode ranges stop at U+2191/U+2193. Every visible arrow is `<Arrow/>`, an inline SVG. The text "→" from the brief is dropped from link labels, so `Learn more →` renders as the text `Learn more` followed by `<Arrow aria-hidden/>`.

### 0.3 Site modes: staging by default
`PUBLIC_SITE_MODE` takes `staging` (the default when unset) or `production`. Read it via `src/lib/mode.ts`, which exports `isStaging: boolean`.

| Behaviour | staging | production |
|---|---|---|
| `<Confirm id="…">` markers (yellow tag, e.g. "CONFIRM 4") | visible | not rendered |
| Insights with `review: 'pending'` (the two DRAFT articles) | listed and routed, with a "DRAFT for Ganeaysh’s review" ribbon | excluded from lists, routes, sitemap, llms.txt and RSS |
| Impact engagements with `consent: 'pending'` | shown with the label "Pending client consent" | not rendered |
| Approach step fields that have no brief copy | shown as `[CONFIRM 10]` placeholders | the definition list is omitted |
| `robots.txt` | `Disallow: /` | allow, plus the sitemap |
| `<meta name="robots">` | `noindex, nofollow` | `index, follow` (except 404) |

### 0.4 The `[CONFIRM]` mechanism
`src/components/ui/Confirm.astro` takes the props `{ id: number | string; note?: string }`.
- In staging it renders `<span class="confirm" data-confirm-id={id}>CONFIRM {id}{note && `: ${note}`}</span>`, styled as a small Butter pill with Ink text at 12px.
- In production it renders nothing.
- The ids are the brief section 11 numbers (1–14). Extra ids this spec adds are `C-…`, listed in section 8.

---

## 1. Tokens and fonts

### 1.1 Font decision
**Fraunces Variable (display and article body) + Instrument Sans Variable (UI and marketing body).** This is the tournament's decision (DNA 3.1, VERDICT), and it stands.

Why Instrument Sans and not the brief's Plus Jakarta Sans:
- Plus Jakarta's wide, round geometry is the default texture of current SaaS and Framer templates, which is the "AI-made" look the owner bans.
- Instrument Sans is a narrow, quiet neo-grotesk. It disappears beside Fraunces' soft serifs, has tabular figures for datelines and the engagement table, and is about 10% narrower, so it fits more words per measure.
- It is OFL and on fontsource-variable.
- Its Latin file is smaller: 30.1KB, against 27.3KB plus the extra weights Plus Jakarta would need.
- The logo already carries the roundness, so the text face does not need to echo it.

Alternatives considered and rejected:
- **Newsreader + Inter.** Inter is over-used.
- **Source Serif 4.** A second serif file for no visible gain.
- **Instrument Serif.** It has one weight and no optical sizes.

If Ganeaysh refuses Instrument Sans (open item C-1), swap in `@fontsource-variable/plus-jakarta-sans`. Change only `--font-sans` and add `letter-spacing: 0.005em` to body. Nothing else changes.

Packages (these exact files were verified in the 5.3.0 tarballs today):

| Package | File used | Bytes | Loading |
|---|---|---|---|
| `@fontsource-variable/fraunces@^5.3.0` | `files/fraunces-latin-opsz-normal.woff2` (axes wght 100–900 and opsz) | 67,304 | **preloaded** on every page |
| same | `files/fraunces-latin-opsz-italic.woff2` | 81,520 | swap, not preloaded (quotes, standfirsts) |
| `@fontsource-variable/instrument-sans@^5.3.0` | `files/instrument-sans-latin-wght-normal.woff2` (wght 400–700) | 30,092 | **preloaded** on every page |

Fonts are self-hosted:
- **Do not** import fontsource's CSS (it pulls in Vietnamese and latin-ext faces).
- `scripts/copy-fonts.mjs` copies the three woff2 files from `node_modules/@fontsource-variable/*/files/` to `public/fonts/`. It runs as `predev` and `prebuild`, is idempotent, and `public/fonts` is git-ignored.
- `src/styles/fonts.css` declares the faces itself.

```css
/* src/styles/fonts.css */
@font-face {
  font-family: "Fraunces";
  src: url("/fonts/fraunces-latin-opsz-normal.woff2") format("woff2-variations");
  font-weight: 100 900; font-style: normal; font-display: swap;
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
@font-face {
  font-family: "Fraunces";
  src: url("/fonts/fraunces-latin-opsz-italic.woff2") format("woff2-variations");
  font-weight: 100 900; font-style: italic; font-display: swap;
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
@font-face {
  font-family: "Instrument Sans";
  src: url("/fonts/instrument-sans-latin-wght-normal.woff2") format("woff2-variations");
  font-weight: 400 700; font-style: normal; font-display: swap;
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
/* Metric-matched fallbacks so the swap does not shift layout (CLS < 0.05). Tune size-adjust by measuring the H1 box at 1440 and 390 with and without webfonts; ±1% is acceptable. */
@font-face { font-family: "Fraunces Fallback"; src: local("Georgia"); size-adjust: 104%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%; }
@font-face { font-family: "Instrument Sans Fallback"; src: local("Arial"); size-adjust: 96%; ascent-override: 98%; descent-override: 25%; line-gap-override: 0%; }
```

The head preloads (in `SeoHead.astro`):
`<link rel="preload" href="/fonts/fraunces-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>` plus the same for Instrument Sans.

Fraunces rules:
- Set `font-optical-sizing: auto`. SOFT and WONK are not in the opsz file, so they stay at 0.
- Display weight is **330**, never 300 at large sizes.
- Never set Fraunces below 22px, except the article body at opsz 14.
- Numerals in proof and impact use `font-variant-numeric: lining-nums tabular-nums`. Article body uses `oldstyle-nums`.

### 1.2 `src/styles/tokens.css` (final; brief Appendix A values kept, names shortened, additions marked)
```css
:root {
  /* ── Colour: brief 3.2 / Appendix A (values unchanged) ── */
  --kk-sapphire: #2C509E; --kk-cobalt: #306FE0; --kk-sky: #4C9BE8; --kk-saffron: #F4C841; --kk-coral: #E5494D;
  --kk-imperial: #3A1C5C; --kk-violet: #5B2A86; --kk-amethyst: #7B4BC4; --kk-mauve: #8C5B88; --kk-orchid: #C8457E;
  --kk-lavender: #EADCFF; --kk-ice: #D6E2FA; --kk-butter: #FFEEB0; --kk-blush: #F6DCE8;
  --kk-ink: #121833; --kk-graphite: #4A5068; --kk-cloud: #F8F6FC; --kk-white: #FFFFFF; --kk-hairline: #E4E0EE;
  /* added (DNA 5.2): input border that passes 1.4.11 (3.86:1 on white) */
  --kk-field-border: #7C8197;
  /* added: Sky at 30% for rules on Imperial; Hairline at 20% on Imperial */
  --kk-sky-30: rgba(76, 155, 232, 0.30);
  --kk-white-20: rgba(255, 255, 255, 0.20);

  /* ── Roles ── */
  --c-ground: var(--kk-white);
  --c-ground-alt: var(--kk-cloud);
  --c-heading: var(--kk-imperial);
  --c-text: var(--kk-ink);
  --c-meta: var(--kk-graphite);
  --c-dateline: var(--kk-mauve);          /* overlines: Mauve, never Orchid (Orchid on Cloud = 4.25:1 fails) */
  --c-line: var(--kk-sapphire);           /* meaningful line-work on light */
  --c-line-dark: var(--kk-sky);           /* line-work on Imperial (Sapphire on Imperial = 1.83:1) */
  --c-rule: var(--kk-hairline);           /* dividing rules */
  --c-action: var(--kk-sapphire);
  --c-action-hover: var(--kk-imperial);
  --c-link: var(--kk-sapphire);           /* Cobalt fails as text on Cloud (4.37:1) */
  --c-focus: var(--kk-cobalt);
  --c-focus-dark: var(--kk-saffron);
  --c-dark: var(--kk-imperial);
  --c-on-dark: var(--kk-white);
  --c-on-dark-muted: var(--kk-lavender);  /* 10.8:1 on Imperial */
  --c-highlight-dark: var(--kk-saffron);  /* 8.79:1 on Imperial */
  --c-error: var(--kk-coral);             /* always with icon + text */
  --c-success: var(--kk-sapphire);
  --ring-ink: 0 0 0 1px var(--kk-ink);    /* graft 10, for Saffron/Sky dots on light */

  /* Pillars (brief 3.2). *-on = colour of a label set ON a tint of that pillar */
  --pillar-innovation: var(--kk-sapphire);  --pillar-innovation-tint: var(--kk-ice);
  --pillar-process: var(--kk-violet);       --pillar-process-tint: var(--kk-lavender);
  --pillar-quality: var(--kk-orchid);       --pillar-quality-tint: var(--kk-blush);
  --pillar-strategy: var(--kk-saffron);     --pillar-strategy-tint: var(--kk-butter);
  --pillar-deals: var(--kk-mauve);          --pillar-deals-tint: var(--kk-blush);
  --pillar-capability: var(--kk-sky);       --pillar-capability-tint: var(--kk-ice);
  /* chip text: darker pillar colour, except Saffron/Sky which take Ink (brief 3.2) */
  --pillar-innovation-text: var(--kk-sapphire); --pillar-process-text: var(--kk-violet);
  --pillar-quality-text: #A2335F;  /* Orchid darkened to pass 4.5:1 on Blush (Orchid on Blush = 3.54 fails). C-2 */
  --pillar-strategy-text: var(--kk-ink); --pillar-deals-text: #6F4470; /* Mauve darkened for 4.5:1 on Blush */
  --pillar-capability-text: var(--kk-ink);

  /* Gradients: kept as tokens, used ONLY off-site (OG images), 404 dot, photo duotone. Never on UI surfaces. */
  --kk-aurora: linear-gradient(100deg, #2C509E 0%, #5B2A86 50%, #C8457E 100%);
  --kk-twilight: linear-gradient(180deg, #3A1C5C 0%, #2C509E 100%);
  --kk-sunrise: linear-gradient(135deg, #7B4BC4 0%, #C8457E 55%, #F4C841 100%);

  /* ── Type families ── */
  --font-serif: "Fraunces", "Fraunces Fallback", Georgia, serif;
  --font-sans: "Instrument Sans", "Instrument Sans Fallback", system-ui, "Segoe UI", Arial, sans-serif;

  /* ── Fluid type scale: clamp() between 390px and 1440px viewports ── */
  --fs-display:    clamp(2.75rem, 1.914rem + 3.429vw, 5rem);      /* 44→80  Fraunces 330, lh 1.09→1.05, -0.025em  (home H1 only) */
  --fs-h1:         clamp(2.375rem, 1.864rem + 2.095vw, 3.75rem);  /* 38→60  Fraunces 360, lh 1.1→1.067, -0.02em */
  --fs-h2:         clamp(1.875rem, 1.643rem + 0.9524vw, 2.5rem);  /* 30→40  Fraunces 380, lh 1.2→1.15, -0.015em */
  --fs-index:      clamp(1.75rem, 1.379rem + 1.524vw, 2.75rem);   /* 28→44  Fraunces 360, lh 1.21→1.14, -0.015em (index rows, impact outcomes) */
  --fs-h3:         clamp(1.375rem, 1.282rem + 0.381vw, 1.625rem); /* 22→26  Fraunces 420, lh 1.27→1.23, -0.01em */
  --fs-h4:         clamp(1.0625rem, 1.039rem + 0.0952vw, 1.125rem); /* 17→18 Instrument 600, lh 1.41→1.44 */
  --fs-standfirst: clamp(1.3125rem, 1.196rem + 0.4762vw, 1.625rem); /* 21→26 Fraunces italic 360, lh 1.43→1.38 */
  --fs-quote:      clamp(1.625rem, 1.3rem + 1.333vw, 2.5rem);     /* 26→40  Fraunces italic 360, lh 1.31→1.25, -0.012em */
  --fs-pull:       clamp(1.5rem, 1.268rem + 0.9524vw, 2.125rem);  /* 24→34  Fraunces italic 360, lh 1.33→1.29 */
  --fs-cta:        clamp(2.125rem, 1.8rem + 1.333vw, 3rem);       /* 34→48  Fraunces 360, lh 1.18→1.17 */
  --fs-stat:       clamp(3.5rem, 2.571rem + 3.81vw, 6rem);        /* 56→96  Fraunces 300, lh 1, -0.035em, lnum tnum */
  --fs-figure:     clamp(3rem, 2.443rem + 2.286vw, 4.5rem);       /* 48→72  Fraunces 300, impact figures, Sapphire */
  --fs-lead:       clamp(1.125rem, 1.055rem + 0.2857vw, 1.3125rem); /* 18→21 Instrument 400, lh 1.556→1.571, -0.005em, max 34em */
  --fs-body:       clamp(1rem, 0.9768rem + 0.0952vw, 1.0625rem);  /* 16→17  Instrument 400, lh 1.625→1.647 */
  --fs-article:    clamp(1.125rem, 1.102rem + 0.0952vw, 1.1875rem); /* 18→19 Fraunces 380 opsz 14, lh 1.61→1.63, 64ch */
  --fs-meta: 0.875rem;      /* 14/22 Instrument 500, +0.005em */
  --fs-dateline: 0.75rem;   /* 12/16 Instrument 600 caps, +0.14em */
  --fs-button: 1rem;        /* Instrument 600, +0.005em */
  --fs-nav: 0.9375rem;      /* 15 Instrument 500 */
  --lh-display: 1.05; --lh-h1: 1.07; --lh-h2: 1.15; --lh-index: 1.14; --lh-h3: 1.23; --lh-h4: 1.44;
  --lh-standfirst: 1.38; --lh-quote: 1.25; --lh-pull: 1.29; --lh-lead: 1.57; --lh-body: 1.64; --lh-article: 1.63;
  --lh-meta: 1.571; --lh-dateline: 1.333;
  --wght-display: 330; --wght-h1: 360; --wght-h2: 380; --wght-index: 360; --wght-h3: 420; --wght-article: 380; --wght-stat: 300;
  --track-display: -0.025em; --track-h1: -0.02em; --track-h2: -0.015em; --track-h3: -0.01em; --track-dateline: 0.14em;
  --measure: 66ch; --measure-lead: 34em; --measure-article: 64ch;

  /* ── Space (8-pt, brief 4) + 192 for hero headroom ── */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px; --s-11: 192px;
  --section: clamp(4rem, 2.514rem + 6.095vw, 8rem);      /* 64 → 128 vertical padding per band */
  --gutter: clamp(1rem, 0.8143rem + 0.7619vw, 1.5rem);   /* 16 → 24 */
  --side: clamp(1rem, -0.3rem + 5.333vw, 4.5rem);        /* 16 → 72 page side margin */
  --hero-top: clamp(7rem, 4.957rem + 8.381vw, 12.5rem);  /* 112 → 200 top of viewport to hero overline */
  --content-max: 1240px;
  --header-h: 72px; --header-h-compact: 60px;
  --scroll-offset: 84px;

  /* ── Shape ── */
  --r-card: 16px; --r-image: 16px; --r-input: 10px; --r-pill: 999px; --r-signature: 56px;

  /* ── Elevation: flat at rest. Only the expertise panel + mobile menu cast a shadow (DNA 4). ── */
  --shadow-none: none;
  --shadow-panel: 0 12px 32px rgba(58, 28, 92, 0.10);
  --shadow: 0 8px 24px rgba(58, 28, 92, 0.08);          /* brief token, reserved; not used on cards */
  --shadow-hover: 0 12px 32px rgba(58, 28, 92, 0.14);   /* brief token, reserved */

  /* ── Lines ── */
  --line-hair: 1px; --line-work: 1.5px; --line-rule-hover: 2px; --pillar-bar: 4px;

  /* ── Motion (CSS side; GSAP mirrors these in src/scripts/motion/tokens.ts) ── */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);          /* ui-in */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);           /* ui-out */
  --ease-reveal: cubic-bezier(0.22, 0.61, 0.36, 1);/* power3.out */
  --ease-draw: cubic-bezier(0.45, 0, 0.55, 1);     /* power2.inOut */
  --ease-brief: cubic-bezier(0.2, 0.7, 0.2, 1);    /* brief --kk-motion */
  --d-ui-in: 180ms; --d-ui-out: 140ms; --d-colour: 200ms; --d-brief: 220ms;
  --d-reveal: 480ms; --d-lines: 720ms; --d-rule: 500ms; --d-swoosh: 900ms; --d-connector: 1200ms; --d-dock: 640ms;
  --kk-motion: 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  :root { --d-ui-in: 0ms; --d-ui-out: 0ms; --d-reveal: 200ms; --d-lines: 200ms; --d-rule: 0ms; --d-swoosh: 0ms; --d-connector: 0ms; --d-dock: 0ms; }
}
```

### 1.3 Type classes (`src/styles/base.css`)
- `.t-display`, `.t-h1`, `.t-h2`, `.t-index`, `.t-h3` set the serif with the matching size, line-height, weight and tracking tokens, `color: var(--c-heading)` and `text-wrap: balance`. Visual class and semantic level are independent: an `<h2 class="t-index">` is allowed.
- `.t-h4`, `.t-lead`, `.t-body` and `.t-meta` are sans. `.t-lead` also sets `max-width: var(--measure-lead)`.
- `.t-dateline` is sans 600, 12/16, uppercase, tracking 0.14em, `color: var(--c-dateline)`. On dark (`.on-dark .t-dateline`) the colour is Lavender.
- `.t-stat` and `.t-figure` use serif 300 with `font-variant-numeric: lining-nums tabular-nums`.
- `.t-quote`, `.t-pull` and `.t-standfirst` are serif italic.
- Paragraphs get `text-wrap: pretty`. Use `hanging-punctuation: first` where supported, plus `.hang` (`text-indent: -0.42em`) for an opening quote mark.
- Headings live in `h1, h2, h3` defaults: an h1 with no class gets `.t-h1`, and so on.
- `body` uses the sans at `--fs-body`/`--lh-body` in `--c-text` on `--c-ground`, with `-webkit-font-smoothing: antialiased` and `font-kerning: normal`.
- `::selection` is a Lavender background with Imperial text.
- Links: `a` is `--c-link`, with `text-decoration-thickness: 1px` and `text-underline-offset: 0.2em`. Body-copy links are underlined. Hover moves to `--c-action-hover`.
- Focus: `:focus-visible { outline: 3px solid var(--c-focus); outline-offset: 2px; border-radius: 4px; }` and `.on-dark :focus-visible { outline-color: var(--c-focus-dark); }`. Focus is never removed.

### 1.4 Layout primitives (`src/styles/layout.css`)
- `.container { width: 100%; max-width: calc(var(--content-max) + 2 * var(--side)); padding-inline: var(--side); margin-inline: auto; }`
- `.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); }`. Below 768px it collapses to `repeat(4, 1fr)`, and column spans are restated with `--span-sm`.
- Span helpers: `.c-1-5`, `.c-6-12`, `.c-1-7`, `.c-8-12`, `.c-4-12`, `.c-1-3`, `.c-2-11` and so on. They are generated from one rule, `[data-cols="a/b"]`, through a small CSS list. Units may add helpers to `layout.css` in wave 1 only.
- `.band { padding-block: var(--section); }`, `.band--alt { background: var(--c-ground-alt); }` and `.band--dark { background: var(--c-dark); color: var(--c-on-dark); }`. `.band--dark` also gets the class `on-dark`.
- `.rule { height: 1px; background: var(--c-rule); }`. On dark it is `--kk-white-20`.
- Breakpoints, from the brief: `360 / 768 / 1024 / 1280 / 1440`. Use the custom media names in comments (`--bp-md: 768px`, `--bp-lg: 1024px`, `--bp-xl: 1280px`). Plain `@media (min-width: 768px)` is the house style.
- The page must not scroll horizontally at any width: `html, body { overflow-x: clip; }`. Bleeding SVGs are clipped by their band.
- Anchors: `[id] { scroll-margin-top: var(--scroll-offset); }`.

### 1.5 Utilities (`src/styles/utilities.css`)
- `.visually-hidden` uses the standard clip pattern.
- `.nowrap { white-space: nowrap; }`
- `.measure { max-width: var(--measure); }`
- `.flow > * + * { margin-top: var(--flow, 1em); }`
- `.skip-link` is visually hidden until focused, then pinned top-left at z-index 1000 as a Sapphire pill with white text.
- `[hidden] { display: none !important; }`

### 1.6 `src/styles/global.css`
It imports, in this order: `fonts.css`, `tokens.css`, `reset.css` (a modern minimal reset: box-sizing, margin 0, media block with max-width 100%, inherited font on form controls), `base.css`, `layout.css`, `utilities.css`, `prose.css` and `motion.css`. Import `global.css` once, from `BaseLayout.astro`.

`prose.css` holds the article typography (5.10) and the legal page typography. It is owned by the scaffold unit; the insights unit may append to it in wave 2.

---

## 2. Project structure (`/home/aryan-budukh/Desktop/ganeshkaka-folder/web`)

These versions were verified on npm on 4 Nov 2026:

| Package | Version |
|---|---|
| astro | 7.4.5 |
| gsap | 3.15.1 |
| lenis | 1.3.27 |
| three | 0.187.0 |
| @fontsource-variable/fraunces | 5.3.0 |
| @fontsource-variable/instrument-sans | 5.3.0 |
| @astrojs/mdx | 8.1.2 |
| @astrojs/sitemap | 3.7.4 |
| @astrojs/markdown-remark | 7.3.5 |
| sharp | 0.35.5 |

Notes on the toolchain:
- Astro 7 needs Node ≥ 22.23.4. This machine has Node 24.19.
- `@astrojs/check` 0.9.12 accepts TypeScript ^5 || ^6, so we pin **TypeScript 6**, not 7.
- There is no React and no UI framework. Every component is `.astro`, and client code is plain TS modules.

### 2.1 `package.json`
```json
{
  "name": "kokreaters-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.23.4" },
  "scripts": {
    "fonts": "node scripts/copy-fonts.mjs",
    "assets": "node scripts/copy-fonts.mjs && node scripts/prepare-brand.mjs && node scripts/build-globe.mjs",
    "predev": "node scripts/copy-fonts.mjs",
    "dev": "astro dev --host 127.0.0.1 --port 4321",
    "prebuild": "node scripts/copy-fonts.mjs",
    "build": "astro build",
    "build:prod": "PUBLIC_SITE_MODE=production astro build",
    "preview": "astro preview --host 127.0.0.1 --port 4322",
    "check": "astro check",
    "og": "node scripts/og.mjs",
    "verify": "node scripts/csp-hash.mjs && node scripts/check-budget.mjs",
    "test": "playwright test",
    "lhci": "lhci autorun"
  },
  "dependencies": {
    "astro": "^7.4.4",
    "@astrojs/mdx": "^8.1.2",
    "@astrojs/sitemap": "^3.7.4",
    "@astrojs/markdown-remark": "^7.3.5",
    "@fontsource-variable/fraunces": "^5.3.0",
    "@fontsource-variable/instrument-sans": "^5.3.0",
    "gsap": "^3.15.0",
    "lenis": "^1.3.27",
    "three": "^0.187.0",
    "sharp": "^0.35.5"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.12",
    "typescript": "^6.0.3",
    "@types/three": "^0.187.0",
    "world-atlas": "^2.0.2",
    "topojson-client": "^3.1.0",
    "d3-geo": "^3.1.2",
    "@playwright/test": "^1.64.1",
    "@axe-core/playwright": "^4.14.0",
    "@lhci/cli": "^0.16.0"
  }
}
```
Install with `npm install`; the lockfile is committed. Run `npx playwright install chromium` only in the wave-3 test unit, or point Playwright at `/usr/bin/google-chrome` with `channel: 'chrome'` and skip the download.

### 2.2 `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const MODE = process.env.PUBLIC_SITE_MODE ?? 'staging';

export default defineConfig({
  site: 'https://kokreaters.com',          // bare domain canonical; www → bare at the host. C-3
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      // drafts are not built in production, so they never reach the sitemap
    }),
  ],
  vite: { build: { assetsInlineLimit: 2048 } },
});
```
No view transitions: plain multi-page navigation keeps bfcache and keeps teardown simple.

### 2.3 `tsconfig.json`
```json
{ "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "scripts/**/*", "tests/**/*"],
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] }, "verbatimModuleSyntax": true } }
```

### 2.4 Env (`.env.example`)
```
PUBLIC_SITE_MODE=staging            # staging | production
PUBLIC_FORM_ENDPOINT=               # e.g. Formspree / Web3Forms / a Cloudflare Worker URL. Empty = mailto fallback
PUBLIC_NEWSLETTER_ENDPOINT=         # empty = "Subscribe" opens mailto:office@kokreaters.com?subject=Subscribe
PUBLIC_BOOKING_URL=                 # Google appointment schedule or Calendly. Empty = /contact#form. CONFIRM 9
PUBLIC_TURNSTILE_SITEKEY=           # empty = honeypot + time-trap only
PUBLIC_ANALYTICS=                   # empty/0 = no analytics, no consent banner. 1 = banner shown (nothing wired yet)
```

### 2.5 File tree (every file; the owner unit is in brackets, see section 9)
```
web/
├─ package.json  package-lock.json  astro.config.mjs  tsconfig.json  .gitignore  .env.example  README.md      [W1-scaffold]
├─ playwright.config.ts  lighthouserc.json                                                                  [W3-tests]
├─ scripts/
│  ├─ copy-fonts.mjs                                                                                        [W1-scaffold]
│  ├─ prepare-brand.mjs        sharp: logo crops, reversed wordmark, favicons, portrait crops               [W1-brand]
│  ├─ build-globe.mjs          world-atlas → coast.json + globe-static.svg                                   [W1-brand]
│  ├─ og.mjs  og/template.html headless Chrome → public/og/*.png                                            [W3-og-seo]
│  ├─ csp-hash.mjs             post-build: hashes inline scripts → dist/_headers CSP                         [W3-tests]
│  └─ check-budget.mjs         post-build: gzip budget gates                                                 [W3-tests]
├─ public/
│  ├─ fonts/  (generated, git-ignored)                                                                      [W1-scaffold]
│  ├─ favicon.svg  favicon-32.png  apple-touch-icon.png  icon-512.png  site.webmanifest                    [W1-brand] (manifest: W1-scaffold)
│  ├─ brand/kokreaters-logo-512.png   (square cluster PNG for JSON-LD logo)                                 [W1-brand]
│  ├─ og/*.png  (generated)                                                                                  [W3-og-seo]
│  └─ _headers  (template; csp-hash.mjs writes the final one into dist/)                                     [W3-tests]
├─ src/
│  ├─ env.d.ts                                                                                               [W1-scaffold]
│  ├─ content.config.ts                                                                                      [W1-content]
│  ├─ config/site.ts                                                                                         [W1-content]
│  ├─ lib/ mode.ts  format.ts  reading-time.ts  pillars.ts  insights.ts  seo.ts  typography.ts               [W1-content]
│  ├─ data/ types.ts  home.ts  pillars.ts  industries.ts  impact.ts  approach.ts  founder.ts  contact.ts
│  │        microcopy.ts  seo.ts  nav.ts  places.ts                                                          [W1-content]
│  ├─ data/globe/coast.json  (generated)                                                                     [W1-brand]
│  ├─ content/insights/ 3-mcpd-glycidyl-esters-playbook.mdx  trans-fat-elimination-inside-a-plant.mdx
│  │        cocoa-butter-equivalents-india.mdx  refining-palm-oil-minus-25.mdx
│  │        passing-pre-approval-audit.mdx  bleaching-earth.mdx                                              [W1-content]
│  ├─ assets/brand/ wordmark.png  wordmark-white.png  lockup-tagline.png  lockup-tagline-white.png  logo-full.png   (generated) [W1-brand]
│  ├─ assets/photos/ ganeaysh-portrait.png (4:5 crop, pin excluded)  ganeaysh-square.png (1:1)               [W1-brand]
│  ├─ assets/globe/globe-static.svg  (generated)                                                             [W1-brand]
│  ├─ styles/ global.css fonts.css tokens.css reset.css base.css layout.css utilities.css prose.css          [W1-scaffold]
│  ├─ styles/motion.css                                                                                      [W1-motion]
│  ├─ layouts/ BaseLayout.astro  LegalLayout.astro                                                           [W1-chrome]
│  ├─ layouts/ ArticleLayout.astro                                                                           [W2-insights]
│  ├─ components/
│  │  ├─ seo/ SeoHead.astro  JsonLd.astro  schema.ts                                                         [W1-chrome]
│  │  ├─ chrome/ SkipLink.astro Header.astro ExpertisePanel.astro MobileMenu.astro Footer.astro
│  │  │          CookieConsent.astro Breadcrumbs.astro                                                       [W1-chrome]
│  │  ├─ brand/ Logo.astro NodeCluster.astro RisingArrow.astro RingedNode.astro Discs.astro Engraving.astro  [W1-brand]
│  │  ├─ ui/ Button.astro TextLink.astro Arrow.astro Icon.astro Folio.astro Dateline.astro Sidenote.astro
│  │  │      PillarTag.astro PillarDot.astro Confirm.astro Section.astro DraftRibbon.astro                   [W1-brand]
│  │  ├─ shared/ ExpertiseIndex.astro ImpactRow.astro InsightRow.astro CoverStory.astro CtaField.astro
│  │  │          MethodLine.astro Newsletter.astro RunIn.astro                                               [W1-brand]
│  │  ├─ home/ Hero.astro HeroNetwork.astro ProofBand.astro Positioning.astro MethodFold.astro
│  │  │        ImpactFold.astro WhereWeWork.astro InsightsFold.astro FounderFold.astro                       [W2-home]
│  │  ├─ expertise/ PillarHero.astro PillarMap.astro HelpList.astro Deliverables.astro RelatedInsights.astro [W2-expertise]
│  │  ├─ industries/ SectorIndex.astro SectorSection.astro                                                   [W2-expertise]
│  │  ├─ approach/ MethodSteps.astro Principles.astro EngagementTable.astro                                  [W2-approach-impact]
│  │  ├─ impact/ CaseEntry.astro EngagementRow.astro Testimonials.astro                                      [W2-approach-impact]
│  │  ├─ insights/ Filters.astro InsightList.astro ComingSoon.astro                                          [W2-insights]
│  │  ├─ article/ ArticleHeader.astro RouteRail.astro ProgressRule.astro Exhibit.astro PullQuote.astro
│  │  │          Takeaways.astro AuthorBox.astro Note.astro ProcessChain.astro                               [W2-insights]
│  │  ├─ about/ AboutHero.astro LongBio.astro Timeline.astro NamePanel.astro EducationLanguages.astro        [W2-about]
│  │  ├─ about/ GlobeSection.astro                                                                           [W2-about → W3-globe]
│  │  ├─ contact/ ContactDetails.astro ContactForm.astro ConnectionMoment.astro                              [W2-contact]
│  │  └─ notfound/ Reconnect.astro                                                                           [W2-contact]
│  ├─ scripts/
│  │  ├─ motion/ index.ts tokens.ts lenis.ts reveal.ts draw.ts countup.ts split.ts context.ts                [W1-motion]
│  │  ├─ chrome.ts  consent.ts                                                                               [W1-chrome]
│  │  ├─ pages/ home.ts  hero.ts  dock.ts                                                                    [W2-home]
│  │  ├─ pages/ expertise.ts  industries.ts                                                                  [W2-expertise]
│  │  ├─ pages/ approach.ts  impact.ts                                                                       [W2-approach-impact]
│  │  ├─ pages/ insights.ts  article.ts                                                                      [W2-insights]
│  │  ├─ pages/ about.ts                                                                                     [W2-about]
│  │  ├─ pages/ contact.ts  notfound.ts                                                                      [W2-contact]
│  │  └─ globe/ scene.ts  loader.ts                                                                          [W3-globe]
│  └─ pages/
│     ├─ index.astro                                   [W1-scaffold writes a stub → W2-home replaces]
│     ├─ expertise/index.astro  expertise/[slug].astro  industries.astro                                    [W2-expertise]
│     ├─ approach.astro  impact.astro                                                                        [W2-approach-impact]
│     ├─ insights/index.astro  insights/[slug].astro  rss.xml.ts (optional, skip)                            [W2-insights]
│     ├─ about.astro                                                                                         [W2-about]
│     ├─ contact.astro  404.astro  privacy.mdx cookies.mdx terms.mdx                                         [W2-contact]
│     └─ robots.txt.ts  llms.txt.ts                                                                          [W1-chrome]
└─ tests/ smoke.spec.ts  a11y.spec.ts  reduced-motion.spec.ts  responsive.spec.ts  seo.spec.ts              [W3-tests]
```
`.gitignore` covers `node_modules`, `dist`, `.astro`, `public/fonts`, `.env`, `test-results` and `playwright-report`.

`README.md` covers four things: how to run, the site modes, the env vars, and how Ganeaysh edits an insight (copy an `.mdx` file, then change the frontmatter). That last part meets the brief's self-edit requirement until a Git-based CMS (Keystatic or Decap) or Sanity is added. That addition is open item C-4.

---

## 3. Global chrome, SEO and machine files

### 3.1 `BaseLayout.astro`
Props:
```ts
interface Props {
  page: 'home' | 'expertise' | 'pillar' | 'industries' | 'approach' | 'impact' | 'insights' | 'article' | 'about' | 'contact' | 'legal' | 'notfound';
  seo: SeoProps;                 // see 3.7
  pillar?: PillarKey;            // sets --pillar / --pillar-tint / --pillar-text on <body>
  breadcrumbs?: { label: string; href: string }[];
  ground?: 'white' | 'cloud';    // body background; default white
}
```
Markup order inside `<body data-page={page} style={pillar vars}>`:
1. `SkipLink`, which targets `#main` with the text "Skip to content" (C-label).
2. `Header`.
3. `<main id="main" tabindex="-1">` containing the `<slot/>`.
4. `Footer`.
5. `CookieConsent`.
6. `<script>import '@/scripts/motion/index.ts'</script>`. Astro bundles this as one module.

Head:
- `<html lang="en-GB" class="no-js">`.
- `SeoHead`.
- The inline flags script below must be **the first child of `<head>`** after the charset and viewport metas:
```html
<script is:inline>
(function(d,w){var h=d.documentElement;h.classList.remove('no-js');h.classList.add('js');
var r=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!r){h.classList.add('motion');w.setTimeout(function(){if(!h.classList.contains('motion-booted'))h.classList.add('motion-failed');},3000);}
})(document,window);
</script>
```

### 3.2 `Header.astro` (sticky, about.google-calm)
- `<header class="site-header" data-header>`:
  - `position: sticky; top: 0; z-index: 50; height: var(--header-h)`, background `rgb(255 255 255 / 0.85)` with `backdrop-filter: blur(12px) saturate(1.2)`.
  - Add `.is-scrolled` once `scrollY > 8`. It brings a 1px Hairline bottom border, and the height becomes `--header-h-compact` over 180ms `--ease-out`. That class toggle is the header's only motion.
- **Left: `<Logo variant="horizontal">`**, linking to `/` with `aria-label="KoKreaters home"`.
  - It is the node-cluster SVG at 32px square (`<NodeCluster size={32} id="header-cluster" />`) with an 8px gap, then the raster wordmark at 120px wide (rendered from `wordmark.png` at 240px wide, so 2x, as AVIF, WebP and PNG; `alt=""`, because the link label carries the name).
  - Total width is about 160px, above the brief's 140px minimum.
  - The cluster sits in `<span class="header-cluster" data-dock-slot>`. On home, with motion and at ≥ 1024px, it starts `visibility:hidden` via `html.motion:not(.motion-failed) body[data-page=home] [data-dock-slot] { visibility: hidden }` until the dock (6.5) runs. Its space is always reserved, so there is no CLS.
- **Centre-right: `<nav aria-label="Main">`**, at ≥ 1024px:
  - **Expertise** is a `<button aria-expanded="false" aria-controls="expertise-panel">` that opens `ExpertisePanel`. It is a disclosure, not an ARIA menu.
  - Then links to Industries, Approach, Impact, Insights and About. They are 15px/500 Ink with 28px gaps, which drop to 20px at 1024–1279.
  - The current page gets `aria-current="page"` and a 2px Sapphire bar under the label, as wide as the label, 6px below the baseline.
  - Hover is a colour change to Sapphire over 200ms.
- **Far right:** `<Button href="/contact" variant="primary" size="sm">Start a conversation</Button>`, 44px tall in the header and 48px elsewhere.
- **Below 1024px:** the logo, the CTA hidden below 480px, and a 44×44 menu button (`aria-expanded`, `aria-controls="mobile-menu"`, label "Menu", 2-line icon, becoming "Close" with an X icon when open).

### 3.3 `ExpertisePanel.astro` (the expertise mega-panel; small by design)
- `<div id="expertise-panel" class="xp-panel" hidden>`. It is full container width under the header: White, a 1px Hairline top border, 16px bottom radius, `--shadow-panel`, and 40px padding.
- Layout `grid` 8/4:
  - **Left (8 columns):** six rows in two columns of three. Each row is an `<a href="/expertise/{slug}">` with a `PillarDot` (10px, with an Ink ring for Saffron and Sky), the pillar name in Fraunces 420 at 20/26 Imperial, and the promise below in 14/22 Graphite. Hover and focus give the row a Cloud background with a 10px radius. Under the rows, an "All expertise" TextLink to `/expertise`.
  - **Right (4 columns):** "Featured insight" as a dateline, then the newest *visible* insight (in staging this includes drafts) set as format dateline, title in Fraunces h3, reading time in meta, and a link. If none exists, this column shows the Newsletter line only.
- Behaviour, in `chrome.ts`:
  - Click toggles it. On `(hover: hover) and (pointer: fine)`, hover intent opens it after 120ms and closes it 200ms after the pointer leaves both the button and the panel.
  - Esc closes it and returns focus to the button. Tab past the last link closes it. A click outside closes it.
  - Opening fades and slides `y: -8 → 0` over 180ms `--ease-out`. Closing takes 140ms. Under reduced motion it is instant.

### 3.4 `MobileMenu.astro`
- `<div id="mobile-menu" class="m-menu" hidden>` is a full-screen fixed Cloud panel starting below the header. It is `data-lenis-prevent` and scrolls internally.
- Content, in order:
  - The six pillars as a disclosure group "Expertise": the button shows six rows (dot, name), and an "All expertise" link.
  - Links to Industries, Approach, Impact, Insights, About and Contact, in Fraunces 360 at 32/38 Imperial with 12px vertical padding and Hairline rules between.
  - "Start a conversation" as a full-width primary pill.
  - The direct details (email, WhatsApp, LinkedIn) in meta.
- While it is open:
  - `document.body.style.overflow = 'hidden'`, `lenis.stop()`, and `inert` on `main` and `footer`.
  - Focus moves to the first link. Esc closes it, and the menu button gets focus back.
- Open and close are an opacity fade of 180ms and 140ms. There is no slide-in drawer.

### 3.5 `Footer.astro` (an Imperial field merged with the CTA band)
- The `CtaField` (shared, 5.0.7) sits **directly above** the footer on every page except contact, legal and 404. The two share the same Imperial background, divided by a 1px `--kk-white-20` rule.
- Markup: `<footer class="site-footer band--dark on-dark">`.
- **Row 1:** `<Logo variant="full-reversed">`, 220px wide. It is the cluster SVG with its discs at 0.9 opacity in normal blend, plus `lockup-tagline-white.png`. The ™ notice is not part of the logo.
- **Row 2:** a 4-column grid that becomes 2×2 at 768px and 1 column at 390px:
  - **Expertise:** links to the six pillars.
  - **Company:** Approach, Impact, About, Insights (brief), and Industries. Industries is added because the brief footer omits it, so C-5.
  - **Contact:**
    - `office@kokreaters.com` as a mailto link.
    - `WhatsApp: +31 6 2215 7910`, linking to `https://wa.me/31622157910`.
    - `LinkedIn`, linking to `https://www.linkedin.com/in/ganeayshkulkarni` with `rel="me noopener"` (external icon, aria "opens LinkedIn").
    - "Based in the Netherlands, working worldwide".
  - **Newsletter:** `<Newsletter variant="footer">`.
- Column heads are datelines in Lavender. Links are 15px White at 0.9 opacity, going to Saffron on hover.
- **Bottom row** (meta, Lavender): `© 2026 KoKreaters™ · Privacy · Cookies · Terms · Cookie settings`. "Cookie settings" is a button that opens the consent dialog. Then `{site.legal.registration ?? <Confirm id={11} note="KvK / VAT / registered address" />}`.
- Typography: on dark, all text is White or Lavender. Saffron is used only for hover and focus.

### 3.6 `CookieConsent.astro` + `consent.ts`
The site sets **no non-essential cookies and no analytics**. With `PUBLIC_ANALYTICS` unset:
- There is **no banner**. Consent for essential-only storage is not required, and asking for consent to nothing would mislead.
- The component still renders a `<dialog id="cookie-settings">` that opens from the footer's "Cookie settings". It shows two toggles:
  - "Essential: always on". A disabled checkbox, checked.
  - "Analytics: not in use on this site". A disabled checkbox, unchecked. The label is COMPOSED.
- There is one "Close" button.

With `PUBLIC_ANALYTICS=1`, used for staging review of the future flow:
- A non-modal `<section role="region" aria-label="Cookie consent" class="cookie-bar">` is fixed bottom-left. It is max 420px wide, White, with a Hairline border, 16px radius, `--shadow-panel`, and 24px padding.
- The copy is the brief's, verbatim: "We use essential cookies to run this site and, with your consent, analytics cookies to improve it."
- It has three buttons with **equal visual weight**, all secondary outline pills: `Accept all`, `Reject non-essential`, `Settings`. Settings opens the dialog with a live Analytics toggle.
- The choice is saved to `localStorage['kk-consent'] = {"v":1,"analytics":bool,"ts":ISO}`, wrapped in try/catch, and the banner then hides. No analytics script exists to load: `consent.ts` exports `onConsent(cb)` for the future. This is C-6.

The cookie bar never covers the H1 or the primary CTA at 390px: it sits above the bottom 16px gutter and is at most 40% of viewport height.

### 3.7 SEO head (`SeoHead.astro`, `JsonLd.astro`, `schema.ts`)
```ts
export interface SeoProps {
  title: string;               // full title, exactly as in src/data/seo.ts
  description: string;         // ≤155 chars, from src/data/seo.ts
  path: string;                // '/about'; canonical = site + path ('/' for home)
  ogImage?: string;            // '/og/about.png'; default '/og/default.png'
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;           // 404 always true; staging forces true
  jsonLd?: Record<string, unknown>[];  // already-built graph nodes (schema.ts builders)
  article?: { published?: string; modified?: string; section?: string };
}
```
It renders the following, in order:
1. `<meta charset>` and viewport.
2. The flags script (3.1), injected by BaseLayout before SeoHead.
3. `<title>`, the meta description and the canonical link.
4. `<meta name="robots">` per mode.
5. The two font preloads.
6. Favicons: `favicon.svg` (`type="image/svg+xml"`), `favicon-32.png`, `apple-touch-icon.png`, plus the manifest and `theme-color` #FFFFFF.
7. Open Graph: `og:site_name` KoKreaters, `og:locale` en_GB, type, title, description, url, and `og:image` (absolute, 1200×627, alt = title).
8. Twitter: `summary_large_image`.
9. `<link rel="alternate" hreflang="en" href=canonical>` and `x-default`. This makes the site hreflang-ready (brief 8).
10. JSON-LD: one `<script type="application/ld+json">` holding `{"@context":"https://schema.org","@graph":[…]}`.

`schema.ts` builders. Every one uses only brief facts:
- `organization()` returns:
  - `@type` Organization, `@id` `https://kokreaters.com/#org`, name "KoKreaters", url, and `logo` `https://kokreaters.com/brand/kokreaters-logo-512.png`.
  - `email` "office@kokreaters.com", `foundingDate` "2026" (CONFIRM 13), and `founder` `{@id: https://kokreaters.com/about#ganeaysh}`.
  - `sameAs: []`, until the LinkedIn company page exists (C-7).
- `professionalService()` returns:
  - `@type` ProfessionalService, `@id` `/#service`, name, url, and `description` set to the brief's positioning statement.
  - `areaServed` "Worldwide", and `address` `{@type: PostalAddress, addressCountry: "NL"}`.
  - `email`, and `telephone` "+31622157910".
  - `knowsAbout`: the six pillar names plus the brief's 8 target-term phrases (section 8, first line of each group).
  - `hasOfferCatalog`: an OfferCatalog "Expertise" with six `Offer → Service {name, url}` entries.
  - `parentOrganization {@id:#org}`.
- `website()` returns WebSite `/#website` with `inLanguage` "en-GB" and `publisher #org`.
- `person()` returns:
  - Person `/about#ganeaysh`: name "Ganeaysh Kulkarni" and `jobTitle` "Founder".
  - `worksFor #org`, and `description` set to the brief's short bio.
  - `image`: the absolute URL of the 4:5 portrait WebP.
  - `knowsLanguage`: `["en","hi","mr","id","ru"]`.
  - `alumniOf`: CollegeOrUniversity "CFTRI Mysore" and "University of Pune". The IIM Ahmedabad and UC Berkeley programmes are **not** degrees, so they are not listed as alumniOf.
  - `address` NL, and `sameAs` `["https://www.linkedin.com/in/ganeayshkulkarni"]`.
- `article(entry)` returns Article with headline, description = standfirst, `datePublished`, `dateModified`, `author #ganeaysh`, `publisher #org`, `image` og, `mainEntityOfPage`, `articleSection` = pillar name, and `inLanguage` en-GB.
- `breadcrumbs(items)` returns a BreadcrumbList.

Which page carries which graph:

| Page | JSON-LD |
|---|---|
| Home | organization, professionalService, website (brief) |
| About | person, breadcrumbs |
| Insights hub | breadcrumbs |
| Article | article, breadcrumbs (brief) |
| Every other inner page | breadcrumbs |

### 3.8 Titles and descriptions (`src/data/seo.ts`)
Brief section 8 strings are verbatim. Rows marked COMPOSED are written here from brief copy, because the brief gives none for those pages. A test checks the 60 and 155 character limits.

| key | title | description |
|---|---|---|
| home | KoKreaters \| Oils, Fats and Food Ingredients Consulting | Independent technical and strategy consulting for food, nutrition and specialty-ingredient businesses. 25 years of plant-to-boardroom leadership. |
| expertise | Expertise \| Product, Process, Quality, Strategy \| KoKreaters | Six connected areas of expertise: innovation, process design, food safety and contaminants, feasibility, due diligence and capability building. |
| approach | Our Approach: Connect, Collaborate, Create \| KoKreaters | We create with you, not for you. See how KoKreaters works and the ways you can engage us, from audits to advisory retainers. |
| impact | Impact and Track Record \| KoKreaters | From India’s first integrated specialty fats facility to a refinery at −25 °C: the results behind KoKreaters. |
| insights | Insights on Oils, Fats and Food Ingredients \| KoKreaters | Points of view and field notes on specialty fats, refining, contaminants, audits and growth in food and ingredients. |
| about | About Ganeaysh Kulkarni, Founder \| KoKreaters | Food technologist and former Cargill and Wilmar technical leader. Founder of KoKreaters, based in the Netherlands, working worldwide. |
| contact | Contact KoKreaters \| Start a Conversation | Tell us about your product, plant or decision. Ganeaysh replies personally within one working day. |
| industries (COMPOSED) | Industries We Work In \| KoKreaters | Confectionery, bakery, dairy and specialised nutrition, plant-based, snacks, edible oils and specialty fats, oleochemicals, pet food and minerals. |
| product-innovation (COMPOSED) | Product and Category Innovation \| KoKreaters | From unmet need to a product that scales: specialty fats, reformulation, plant-based and nutrition applications, and lab-to-plant scale-up. |
| process-design (COMPOSED) | Process Design and Plant Performance \| KoKreaters | Plants that run better, cost less and grow with you: refining, fractionation, interesterification, commissioning and debottlenecking. |
| food-safety-quality (COMPOSED) | Food Safety, Quality and Contaminants \| KoKreaters | Pass the audit. Protect the brand. 3-MCPD and glycidyl esters, trans fats, mineral oil hydrocarbons, supplier audits and FSQR systems. |
| strategy-feasibility (COMPOSED) | Strategy, Feasibility and Market Entry \| KoKreaters | Clear answers for Go/No-Go decisions: market analysis, feasibility studies, business plans and market entry, including India and Asia. |
| due-diligence (COMPOSED) | M&A, Due Diligence and Partnerships \| KoKreaters | See what is really behind the deal: technical due diligence of plants, products, R&D and quality systems, and post-acquisition integration. |
| capability (COMPOSED) | Capability, Leadership and Transformation \| KoKreaters | Leave stronger teams behind: technical training, technology transfer, leadership development and interim technical leadership. |
| privacy / cookies / terms (COMPOSED) | Privacy Policy \| KoKreaters · Cookie Policy \| KoKreaters · Terms of Use \| KoKreaters | Short factual one-liners, e.g. "How KoKreaters collects, uses and protects personal data." |
| notfound | Page not found \| KoKreaters | This page hasn’t been created yet. Let’s connect you back. (noindex) |
| article | `{title} \| KoKreaters Insights` (≤60, else `{title}`) | the article `description` frontmatter field (≤155) |

### 3.9 Machine files
- **Sitemap**: `@astrojs/sitemap` writes `sitemap-index.xml`. Drafts are absent in production because they are not built.
- **`src/pages/robots.txt.ts`** (GET, `prerender = true`):
  - Staging: `User-agent: *\nDisallow: /\n`.
  - Production: `User-agent: *\nAllow: /\n\nSitemap: https://kokreaters.com/sitemap-index.xml\n`.
- **`src/pages/llms.txt.ts`** builds plain text from the data modules, with no claims beyond them:
```
# KoKreaters
> {positioning statement, brief 1}

KoKreaters is an independent technical and strategy consultancy for food, feed, non-food and specialty-ingredient businesses, founded and led by Ganeaysh Kulkarni. Based in the Netherlands, working worldwide. Contact: office@kokreaters.com
Results listed on this site come from the founder's career at Wilmar and Cargill, not from KoKreaters engagements.

## Expertise
- [Product and Category Innovation](https://kokreaters.com/expertise/product-innovation): From unmet need to a product that scales.
… (six)
## Pages
- [Industries](…), [Approach](…), [Impact](…), [Insights](…), [About](…), [Contact](…)
## Insights
- [title](url): description      (only visible entries for the current mode; coming-soon titles listed under "In preparation" without links)
```
- **Security headers**: `public/_headers` is the template. `scripts/csp-hash.mjs` writes `dist/_headers` after the build, and is owned by W3-tests. It sets:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - A CSP of `default-src 'self'; script-src 'self' 'sha256-…' (every inline script found in dist/**/*.html); style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' {form/newsletter endpoint origins}; form-action 'self' mailto: {endpoint origins}; frame-src https://challenges.cloudflare.com (only if Turnstile key set); frame-ancestors 'none'; base-uri 'self'`
  - `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*` and `/fonts/*`.

---

## 4. Content layer

Structured content lives in typed TypeScript modules in `src/data/`. Insights live in an Astro content collection of MDX files.
- **Why TS for structured data:** it gives type safety with zero runtime cost, and its shape is identical to a later CMS schema (C-4).
- **API facts verified in astro@7.4.5:**
  - config file `src/content.config.ts`
  - `defineCollection` and `reference` from `astro:content`
  - `glob` and `file` from `astro/loaders`
  - `z` from `astro/zod` (Zod 4)
- **All copy below is verbatim from BRIEF.txt**, with three permitted changes:
  - typographic quotes and apostrophes
  - "→" removed from link labels (0.2.9)
  - `−` with a narrow no-break space in "−25 °C"
- Agents paste it as written.

### 4.1 `src/data/types.ts`
```ts
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
```
`ImageMetadata` is imported from `astro`.

### 4.2 `src/config/site.ts`
```ts
const env = import.meta.env;
export const site = {
  name: 'KoKreaters',
  url: 'https://kokreaters.com',
  mode: (env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'staging') as 'staging' | 'production',
  email: 'office@kokreaters.com',                              // CONFIRM 9
  whatsapp: { display: '+31 6 2215 7910', href: 'https://wa.me/31622157910' },
  linkedin: { display: 'linkedin.com/in/ganeayshkulkarni', href: 'https://www.linkedin.com/in/ganeayshkulkarni' },
  base: 'Based in the Netherlands, working worldwide',
  bookingUrl: env.PUBLIC_BOOKING_URL || '/contact#form',      // CONFIRM 9
  formEndpoint: env.PUBLIC_FORM_ENDPOINT || '',
  newsletterEndpoint: env.PUBLIC_NEWSLETTER_ENDPOINT || '',
  turnstileSiteKey: env.PUBLIC_TURNSTILE_SITEKEY || '',
  analytics: env.PUBLIC_ANALYTICS === '1',
  legal: { registration: null as string | null },             // CONFIRM 11 e.g. "KvK 00000000 · VAT NL000000000B00"
  trademark: '™',                                             // CONFIRM 12
  motion: { proofCountUp: true },                             // 600 ms count on 25/5/3 (brief 3.7). false = rules draw only
} as const;
```

### 4.3 `src/data/home.ts`
```ts
export const hero = {
  overline: 'Independent technical and strategy consulting · Food, feed and specialty ingredients',
  headline: 'Where deep expertise meets shared ambition.',   // option A, CONFIRM 2
  swooshPhrase: 'shared ambition',
  sub: 'KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation.',
  primary: { label: 'Start a conversation', href: '/contact' },
  secondary: { label: 'Explore our expertise', href: '/expertise' },
  footLeft: 'Based in the Netherlands, working worldwide',
  footRight: ['India', 'Indonesia', 'Ukraine', 'Türkiye', 'the Netherlands'],
};
export const proof = [
  { value: '25', count: 25, label: 'years in oils, fats and food ingredients' },
  { value: '5', count: 5, label: 'countries of plant and operational leadership' },
  { value: '3', count: 3, label: 'regions of teams led: Americas, EMEA, Asia-Pacific' },
  { value: 'WHO', label: 'Director-General recognition for trans-fat elimination work' },
];
export const proofSource = 'From our founder’s career';
export const positioning = {                                  // graft 9, brief 1
  headline: 'Deep expertise, shared ownership, measurable results.',
  promise: 'We do not hand over a report and leave. We build the answer with your people, so it still works after we have gone.',
  range: 'What makes KoKreaters different is range. Most consultants are either plant engineers or strategists. KoKreaters works from the plant floor to the boardroom: designing a product, fixing a process, passing a customer audit, valuing an acquisition and writing the business plan, all with the same person who has done it inside global companies.',
};
export const whatWeDo = { overline: 'What we do', headline: 'Six ways we create value, together.', intro: 'From the first idea to the last audit, we work wherever technology and business meet.' };
export const method = { overline: 'The KoKreaters way', headline: 'Connect. Collaborate. Create.', link: { label: 'How we work', href: '/approach' } };
export const impact = { overline: 'Impact · From our founder’s career', headline: 'Results that started on the plant floor.', link: { label: 'See the impact', href: '/impact' } };
export const industries = { headline: 'Where we work' };
export const insights = { overline: 'Insights', headline: 'Ideas from the plant floor and the boardroom.' };
export const founderQuote = {
  quote: 'Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you.',  // CONFIRM 4
  attribution: 'Ganeaysh Kulkarni, Founder',
  link: { label: 'Meet Ganeaysh', href: '/about' },
};
export const cta = {
  headline: 'Have a challenge worth solving together?', swooshPhrase: 'together',
  body: 'Tell us about your product, your plant or your decision. The first conversation is on us.',   // CONFIRM 9 (free first call)
  button: 'Book a 30-minute call',
};
```

### 4.4 `src/data/pillars.ts` (six; order and slugs from brief 5)
Each entry is `{ key, slug, n, name, promise, headline, intro, helpWith[], deliverables[], hex, inkText, impactId, shortLabel }`. The promise and the headline are the same brief line.

1. **innovation** · `product-innovation` · `#2C509E` · inkText false · impact `india` · short "Product"
   - name: Product and Category Innovation
   - promise/headline: From unmet need to a product that scales.
   - intro: We turn consumer and customer needs into clear technical briefs, then into products your plants can make profitably. Our roots are in oils and fats, so we are at our best where fat functionality decides whether a product succeeds: texture, bloom, shelf life, mouthfeel and cost.
   - helpWith:
     - "Specialty fats: cocoa butter equivalents (CBE), confectionery and filling fats, bakery shortenings, margarines and laminating fats" (CONFIRM 7)
     - "Plant-based, dairy and specialised nutrition applications"
     - "Reformulation and renovation: trans-fat elimination, saturated fat reduction, cleaner labels, cost-in-use"
     - "Sensory evaluation, consumer insight and foresight"
     - "Technical road-mapping and innovation pipelines"
   - deliverables: Innovation roadmaps · technical briefs · formulation and prototype plans · lab-to-plant scale-up plans · launch support
2. **process** · `process-design` · `#5B2A86` · false · impact `ukraine` · "Process"
   - name: Process Design and Plant Performance
   - headline: Plants that run better, cost less and grow with you.
   - intro: We have designed, commissioned and run oils and fats plants in four very different countries, from tropical Indonesia to a refinery operating at −25 °C in Ukraine. We bring that experience to your process, whether you are building new, expanding or fixing what you have.
   - helpWith:
     - "Refining, fractionation, interesterification and blending process design"
     - "Greenfield and brownfield projects, commissioning and start-up"
     - "Debottlenecking: throughput, yield, utilities and cost"
     - "Technology scouting and transfer, including enzymatic processing"
     - "Asset-light and tolling models for faster, lower-capital growth"
   - deliverables: Process design basis · plant assessments · debottlenecking plans · commissioning support · technology transfer packages
3. **quality** · `food-safety-quality` · `#C8457E` · false · impact `tfa` · "Food safety"
   - name: Food Safety, Quality and Contaminants
   - headline: Pass the audit. Protect the brand. Stay ahead of the regulation.
   - intro: Certification covers the generic food safety system. Multinational customers look further, at the product- and process-specific risks. With eight years leading FSQR teams at Cargill, we help suppliers see their plant through the auditor’s eyes, and help brand owners understand their suppliers.
   - helpWith:
     - "Process contaminant mitigation: 3-MCPD and glycidyl esters, trans fats, mineral oil hydrocarbons"
     - "Plant and supplier audits; readiness for multinational customer pre-approval audits"
     - "Building FSQR systems, teams and culture"
     - "Packaging-related contaminants, product integrity and shelf life"
     - "Regulatory horizon scanning for India and Europe"
   - deliverables: Audit reports with photographic evidence · gap analyses · corrective action plans · mitigation programmes · training
   - Acronym note: on first use per page, render FSQR as `<abbr title="Food Safety, Quality and Regulatory">FSQR</abbr>` and add a sidenote "FSQR: Food Safety, Quality and Regulatory". The expansion is taken from the brief bio.
4. **strategy** · `strategy-feasibility` · `#F4C841` · **true** · impact none (C-8) · "Strategy"
   - name: Strategy, Feasibility and Market Entry
   - headline: Clear answers for Go/No-Go decisions.
   - intro: Before you commit capital, you need to know whether the market is real, whether the technology works and whether the numbers hold. We combine market analysis with technical judgement to give boards and investors a decision they can defend.
   - helpWith:
     - "Market analysis, product-market fit and competitive landscapes"
     - "Feasibility studies and business plans for new plants and product lines"
     - "Market entry and go-to-market strategy, including India and Asia"
     - "Business–technology alignment plans and technical roadmaps"
     - "Investor-grade reports and presentations"
   - deliverables: Feasibility reports · business plans with scenarios · market entry strategies · investor decks
5. **deals** · `due-diligence` · `#8C5B88` · false · impact none · "Deals"
   - name: M&A, Due Diligence and Partnerships
   - headline: See what is really behind the deal.
   - intro: Spreadsheets do not show a tired refinery, a fragile quality system or a technology that will not transfer. We give buyers, investors and partners an independent technical view, then help make the integration work.
   - helpWith:
     - "Technical due diligence of plants, products, R&D and quality systems"
     - "Post-acquisition integration planning"
     - "Joint ventures, partner and channel selection"
     - "Technology licensing and transfer assessments"
   - deliverables: Due diligence reports · red-flag summaries · integration plans · partner assessments
6. **capability** · `capability` · `#4C9BE8` · **true** · impact `indonesia` (C-8) · "Capability"
   - name: Capability, Leadership and Transformation
   - headline: Leave stronger teams behind.
   - intro: Lasting change comes from people. We train technical teams, transfer know-how between sites and coach leaders through growth and change, drawing on experience leading teams across the Americas, EMEA and Asia-Pacific.
   - helpWith:
     - "Technical training: oils and fats, specialty fats, applications, FSQR"
     - "Technology transfer and site start-up coaching"
     - "Leadership development for technical leaders"
     - "Organisation design for R&D, technical services and quality"
     - "Interim technical leadership"
   - deliverables: Training programmes · academies · transfer playbooks · organisation designs · interim roles

Overview page copy (`expertiseOverview`):
- headline: "Expertise that connects science, plants and strategy."
- intro: "Most problems in food and ingredients do not respect departmental lines. A texture defect may start in the refinery; an audit failure may start in the business model. Our six areas of expertise are designed to work together."
- prompt: "Not sure where you fit? Start a conversation" ("Start a conversation" is the link to /contact).

### 4.5 `src/data/industries.ts` (nine, brief 6.3)
The pillar links are a COMPOSED mapping, C-10.

| n | slug | name | copy | pillars |
|---|---|---|---|---|
| 1 | confectionery | Confectionery | Cocoa butter equivalents, filling and coating fats, bloom resistance and cost-in-use for chocolate and sugar confectionery. | innovation, process |
| 2 | bakery | Bakery | Shortenings, margarines and laminating fats that perform on the line and in the bite, with lower trans and saturated fat. | innovation, process |
| 3 | dairy-nutrition | Dairy and specialised nutrition | Fat systems and contaminant control for infant, medical and adult nutrition, where quality has no margin. | innovation, quality |
| 4 | plant-based | Plant-based | Fat functionality that delivers the melt, bite and juiciness consumers expect. | innovation |
| 5 | snacks-food-service | Snacks and food service | Frying oils, stability and cost for high-volume operations. | innovation, process |
| 6 | edible-oils-specialty-fats | Edible oils and specialty fats | Refining, fractionation and specialty fats, from crude oil to customer specification. | process, quality |
| 7 | personal-care-oleochemicals | Personal care and oleochemicals | Ingredient functionality and manufacturing processes for beauty and oleochemical products. | innovation, process |
| 8 | pet-food-animal-nutrition | Pet food and animal nutrition | Product development and process improvement tailored to species-specific needs and regulations. | innovation, process |
| 9 | industrial-minerals | Industrial minerals and process inputs | Market entry, feasibility and application know-how for the inputs the oils industry depends on, such as bleaching earths. | strategy |

There is no image in any entry until licensed material photography exists (graft 13).

### 4.6 `src/data/impact.ts`
**Founder results** come from brief 6.1 cards, 6.5 and the bio. Fields the brief does not supply are `null`, and they render `<Confirm id="C-9" note="case detail">` in staging. Nothing is written into them.

```ts
export const founderResults: FounderResult[] = [
  { id: 'india', dateline: 'India · Wilmar',
    homeLine: 'India’s first world-class integrated specialty fats facility, built and activated.',
    emphasis: [],
    context: 'Product and category innovation · India · From our founder’s career (Wilmar)',
    outcome: 'India’s first world-class integrated specialty fats facility',
    challenge: null, done: 'Built and activated the facility.', result: 'India’s first world-class integrated specialty fats facility.',
    pillars: ['innovation', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'indonesia', dateline: 'Indonesia · Wilmar',
    homeLine: '21% growth in Indonesia by reshaping manufacturing operations.',
    emphasis: ['21%'],
    context: 'Capability and transformation · Indonesia · From our founder’s career (Wilmar)',
    outcome: '21% growth in Indonesia',
    challenge: null, done: 'Reshaped manufacturing operations.', result: '21% growth.',
    figure: { value: '21%', source: 'From our founder’s career, Wilmar, Indonesia' },
    pillars: ['capability', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'ukraine', dateline: 'Ukraine · Wilmar',
    homeLine: 'Ukraine’s first cold-climate crude palm oil refinery, commissioned at −25 °C, cost structure improved by 15%.',
    emphasis: ['−25 °C', '15%'],
    context: 'Process design · Ukraine · From our founder’s career (Wilmar)',
    outcome: 'Ukraine’s first cold-climate crude palm oil refinery',
    challenge: 'Design and build a continuous refinery able to operate in extreme winter conditions, down to −25 °C.',
    done: 'Full design-to-execution leadership of the facility, from process design to commissioning.',
    result: 'The first refinery of its kind in Ukraine; overall cost structure improved by 15%.',
    figure: { value: '−25 °C', source: 'From our founder’s career, Wilmar, Ukraine', frost: true },
    pillars: ['process'], sectors: ['Edible oils'] },
  { id: 'tfa', dateline: 'Cargill',
    homeLine: 'Trans-fat (iTFA) elimination work publicly recognised by the WHO Director-General.',
    emphasis: ['WHO'],
    context: 'Food safety and reformulation · From our founder’s career (Cargill)',
    outcome: 'Trans-fat elimination work recognised by the WHO Director-General',
    challenge: null, done: 'Trans-fat (iTFA) elimination work.', result: 'Publicly recognised by the Director-General of the World Health Organization.',
    pillars: ['quality', 'innovation'], sectors: [] },
];
```
- The Ukraine case also shows a second figure, "15%", under its result (C-9 allows only brief numbers).
- **iTFA:** on first use per page, render `<abbr title="industrially produced trans-fatty acids">iTFA</abbr>` with the sidenote "iTFA: industrially produced trans-fatty acids". The expansion is COMPOSED, a standard definition, C-11.

**KoKreaters engagements** are anonymised, brief 6.5. All three are marked `pending` (C-12):
- The brief flags items 2 and 3 for consent.
- Item 1 is set to pending too, as the conservative choice, because "even anonymised stories can identify a client" (brief 11.6).
- Ganeaysh can clear one by flipping its `consent` field.

```ts
export const engagements: Engagement[] = [
  { id: 'eu-minerals', text: 'Feasibility study and business plan for a European industrial-minerals company entering a new market.', consent: 'pending', pillars: ['strategy'] },
  { id: 'in-specialty-audit', text: 'Multinational-customer pre-approval readiness audit for an Indian specialty fats manufacturer.', consent: 'pending', pillars: ['quality'] },
  { id: 'n-india-contaminants', text: 'Contaminant mitigation and portfolio development programme for a North Indian edible oils company.', consent: 'pending', pillars: ['quality', 'innovation'] },
];
export const testimonials: { quote: string; name: string; role: string; permission: true }[] = [];   // CONFIRM 8: render nothing while empty
```

### 4.7 `src/data/approach.ts`
```ts
export const approach = {
  headline: 'We create with you, not for you.', swooshPhrase: 'with you',
  intro: 'The best answers come from people who know the plant, the product and the market. Our role is to connect that knowledge, add 25 years of global experience, and help your teams create something that lasts.',
};
export const steps: MethodStep[] = [
  { n: 1, name: 'Connect', copy: 'We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose.', whatWeDo: null, whatYouGet: null, duration: null },
  { n: 2, name: 'Collaborate', copy: 'We design the answer with your teams, not around them, so the people who will run it own it.', whatWeDo: null, whatYouGet: null, duration: null },
  { n: 3, name: 'Create', copy: 'We build, test and scale the solution, then hand it over with the measures to prove it works.', whatWeDo: null, whatYouGet: null, duration: null },
];   // null fields → CONFIRM 10 in staging; omitted in production
export const principles: Principle[] = [
  { name: 'Plant floor to boardroom', copy: 'We are as comfortable in a control room as in a board meeting, and we connect the two.' },
  { name: 'Your team owns the result', copy: 'We build capability as we go, so you do not depend on us afterwards.' },
  { name: 'Global playbook, local execution', copy: 'Lessons from Asia, Europe and the Americas, adapted to your market, your raw materials and your people.' },
  { name: 'Evidence before opinion', copy: 'Data, trials and plant observation first; recommendations second.' },
  { name: 'Confidential by default', copy: 'Your formulations, processes and plans stay yours. We sign NDAs as standard.' },
];
export const models: EngagementModel[] = [   // CONFIRM 10
  { model: 'Diagnostic or audit', shape: '2–5 days on site, report within two weeks', goodFor: 'Plant audits, customer pre-approval readiness, contaminant risk reviews' },
  { model: 'Project', shape: 'Fixed scope, 4–16 weeks', goodFor: 'New products or processes, feasibility studies, business plans, due diligence' },
  { model: 'Advisory retainer', shape: 'A set number of days each month', goodFor: 'Ongoing technical and strategic counsel, R&D steering, board advisory' },
  { model: 'Interim leadership', shape: 'Part-time or full-time for a defined period', goodFor: 'Covering a technical director or R&D lead role' },
  { model: 'Workshops and training', shape: 'Half a day to two days', goodFor: 'Oils and fats academies, innovation sprints, technology transfer' },
];
```

### 4.8 `src/data/founder.ts`
- `about.headline`: "Built on 25 years of making ingredients work."
- `about.intro`: "KoKreaters is the consultancy Ganeaysh Kulkarni wished he could call when he was running plants and R&D teams: someone who has done the work, understands the business and builds the answer with you."
- `longBio`: six paragraphs, verbatim from brief 6.7. CONFIRM 13 covers the dates and "founded in 2026".
  1. "Ganeaysh Kulkarni founded KoKreaters in 2026 after 25 years building and leading technical organisations in edible oils, specialty fats and food ingredients."
  2. "He began his career at Wilmar in 2001, rising from Technical Head Specialties to Technical Director. There he built and activated India’s first world-class integrated specialty fats facility, reshaped manufacturing operations in Indonesia to deliver 21% growth, and commissioned Ukraine’s first cold-climate crude palm oil refinery, operating at −25 °C and improving the cost structure by 15%."
  3. "In 2012 he joined Cargill. Over the next fourteen years he led Technical Services, Applications, R&D and Food Safety, Quality and Regulatory (FSQR) teams; served as Regional Technical Lead and Bakery Technology Transfer Leader, supporting technical due diligence for acquisitions; led Category R&D for Confectionery and Plant-Based; and was Global Product and Process Design Director from 2023 to 2026. His trans-fat elimination work at Cargill was publicly recognised by the Director-General of the World Health Organization."
  4. "His career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands, leading teams in the Americas, EMEA and Asia-Pacific and working with global leaders in nutrition, food, personal care and pet food."
  5. "Ganeaysh holds a postgraduate degree in Food Technology from CFTRI Mysore and a degree in Chemistry from the University of Pune, and has completed programmes in Creativity and Innovation at IIM Ahmedabad and the EDGE Founder’s Bootcamp at UC Berkeley. He works in English, Hindi and Marathi, with conversational Bahasa Indonesia and basic Russian."
  6. "He is based in the Netherlands and works with clients worldwide."
  - The brief has 5 and 6 as one paragraph. Splitting it is allowed, because it changes no words.
- `bioSidenotes`: `[{ at: 2, text: '2001 · Wilmar' }, { at: 3, text: '2012 · Cargill' }, { at: 3, text: '2023–2026 · Global Product and Process Design Director' }]`. These are dates the bio already contains.
- `shortBio`: "Ganeaysh Kulkarni is the founder of KoKreaters. A food technologist with 25 years at Wilmar and Cargill, he has built specialty fats facilities, commissioned refineries, led global R&D and FSQR teams and supported acquisitions across Asia, Europe and the Americas. He now helps food and ingredient companies co-create better products, plants and decisions."
- `timeline`: `[{ label: 'CFTRI Mysore', years: '1999–2001' }, { label: 'Wilmar', years: '2001–2012' }, { label: 'Cargill', years: '2012–2026' }, { label: 'KoKreaters', years: '2026' }]`. CONFIRM 13.
- `name`:
  - `ko`: "Ko stands for together: co-creation, collaboration, community."
  - `kreaters`: "Kreaters are the people who make things happen."
  - `quote`: "In Ganeaysh’s words, the work has “co-creation and creativity at its soul, at a global level”."
  - `tagline`: "The tagline in the logo spells out the method: Connect · Collaborate · Create."
- `education`: `['Postgraduate degree in Food Technology, CFTRI Mysore', 'Degree in Chemistry, University of Pune', 'Creativity and Innovation programme, IIM Ahmedabad', 'EDGE Founder’s Bootcamp, UC Berkeley']`
- `languages`: `['English', 'Hindi', 'Marathi', 'Bahasa Indonesia (conversational)', 'Russian (basic)']`
- `clientNote`: by default, sectors are shown and never company names (CONFIRM 5). In the About "worked with" line, use the bio's own phrase: "working with global leaders in nutrition, food, personal care and pet food".

### 4.9 `src/data/places.ts` (About globe; places from brief 6.7)
```ts
export const places = [            // brief order; arcs join consecutive places. No chronology is implied (C-13)
  { name: 'Mundra', country: 'India', lat: 22.84, lon: 69.72 },
  { name: 'Kakinada', country: 'India', lat: 16.99, lon: 82.25 },
  { name: 'Gurugram', country: 'India', lat: 28.46, lon: 77.03 },
  { name: 'Pune', country: 'India', lat: 18.52, lon: 73.86 },
  { name: 'Medan', country: 'Indonesia', lat: 3.59, lon: 98.67 },
  { name: 'Odessa', country: 'Ukraine', lat: 46.48, lon: 30.72 },
  { name: 'Balikesir', country: 'Türkiye', lat: 39.65, lon: 27.88 },
  { name: 'Amsterdam', country: 'the Netherlands', lat: 52.37, lon: 4.90 },
] as const;
```

### 4.10 `src/data/contact.ts` + `microcopy.ts`
- `contact.headline`: "Let’s create something together."
- `contact.intro`: "Tell us a little about your challenge. Ganeaysh reads every message personally and replies within one working day." (CONFIRM 9)
- Fields, in brief order. Labels are exactly as written; `*` means required.

| name | label | type | required | autocomplete |
|---|---|---|---|---|
| name | Name | text | yes | name |
| company | Company | text | yes | organization |
| role | Role | text | no | organization-title |
| email | Email | email | yes | email |
| phone | Phone or WhatsApp | tel | no | tel |
| country | Country | text | yes | country-name |
| interest | Area of interest | select: the six pillar names + "Not sure yet" | yes | off |
| message | Message | textarea (rows 6) | yes | off |
| source | How did you hear about us? | text | no | off |
| consent | I agree to KoKreaters storing my details to respond to this enquiry, as described in the Privacy Policy. | checkbox ("Privacy Policy" links to /privacy) | yes | — |

- Required marker: an `*` with `aria-hidden`, plus "(required)" as visually hidden text.

**`microcopy.ts`** holds the brief 7 bank verbatim:
- primaryCta "Start a conversation", bookingCta "Book a 30-minute call", pillarLink "Learn more", insightsLink "Read the insight", impactLink "See the impact"
- newsletter "Field notes from the plant floor and the boardroom. Once a month. No noise.", newsletterButton "Subscribe"
- formSuccess "Thank you. Your message is with us and Ganeaysh will reply within one working day."
- formError "Something went wrong. Please try again, or email office@kokreaters.com."
- required "Please fill this in so we can reply."
- cookieBanner (text above)
- notFound "This page hasn’t been created yet. Let’s connect you back."

COMPOSED entries, each with a `// COMPOSED` comment and listed in 8.3:
- skip "Skip to content"
- menu "Menu" / "Close"
- invalidEmail "Please enter an email address we can reply to."
- mailtoSent "Your email app should now open with your message ready to send. If it does not, write to office@kokreaters.com."
- featuredInsight "Featured insight"
- allExpertise "All expertise"
- inPreparation "In preparation"
- draftRibbon "DRAFT for Ganeaysh’s review"
- pendingConsent "Pending client consent"
- readingTime "{n} min read"
- minutesLeft "{n} min left"
- takeHome "Take me home" (this one is brief)
- reconnect "Reconnect the node and go home"
- cookieSettings "Cookie settings"
- analyticsNotInUse "Analytics: not in use on this site"
- essentialOn "Essential: always on"
- emailLabel "Email address" (newsletter)
- filterAll "All"
- filterPillar "Pillar"
- filterFormat "Format"
- keyTakeaways "Key takeaways"
- relatedInsights "Related insights"
- exhibit "Exhibit"
- source "Source"
- placesLabel "Places in Ganeaysh’s career"

### 4.11 `src/data/nav.ts`
- `main`: Expertise (panel), Industries `/industries`, Approach `/approach`, Impact `/impact`, Insights `/insights`, About `/about`.
- `footer`: the columns from 3.5.
- `legal`: Privacy `/privacy`, Cookies `/cookies`, Terms `/terms`.

### 4.12 `src/content.config.ts` (insights)
```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const insights = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/insights' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    standfirst: z.string(),
    description: z.string().max(155),
    pillar: z.enum(['innovation', 'process', 'quality', 'strategy', 'deals', 'capability']),
    format: z.enum(['point-of-view', 'field-notes', 'explainer']),
    status: z.enum(['published', 'draft', 'coming-soon']),
    review: z.enum(['pending', 'approved']).default('pending'),
    date: z.coerce.date().optional(),          // CONFIRM publication date
    updated: z.coerce.date().optional(),
    author: z.literal('ganeaysh').default('ganeaysh'),
    image: image().optional(), imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});
export const collections = { insights };
```
`src/lib/insights.ts` defines the following:
- `visibleInsights()`. In staging it returns `status !== 'coming-soon'`. In production it returns `status === 'published' && review === 'approved'`. It sorts by date, newest first.
- `comingSoon()` returns the entries with `status === 'coming-soon'`.
- `byPillar(key)`.
- `readingTime(body)`, which uses 220 words per minute and rounds up.

`[slug].astro` builds static paths from `visibleInsights()` only. **Coming-soon stubs have no route.** They appear only as unlinked titles under "In preparation", so the site never shows a thin page.

### 4.13 The six insights (files in `src/content/insights/`)

| file | title | pillar | format | status | review |
|---|---|---|---|---|---|
| 3-mcpd-glycidyl-esters-playbook.mdx | 3-MCPD and glycidyl esters: a practical playbook for refiners | quality | point-of-view | draft | pending |
| trans-fat-elimination-inside-a-plant.mdx | Trans-fat elimination: what it really takes inside a plant | innovation | point-of-view | draft | pending |
| cocoa-butter-equivalents-india.mdx | Cocoa butter equivalents in India: the opportunity and the traps | innovation | point-of-view | coming-soon | pending |
| refining-palm-oil-minus-25.mdx | Refining palm oil at −25 °C: lessons from a cold-climate refinery | process | field-notes | coming-soon | pending |
| passing-pre-approval-audit.mdx | Passing a multinational customer’s pre-approval audit: what auditors actually look for | quality | field-notes | coming-soon | pending |
| bleaching-earth.mdx | Bleaching earth: a small input with a big effect on oil quality and cost | process | explainer | coming-soon | pending |

Stub frontmatter needs only `title`, `standfirst: ''`, `description: ''` (the schema allows empty), pillar, format and `status: coming-soon`, with an empty body. The stub `description` may be an empty string.

**About the two drafts** (DRAFT for Ganeaysh’s review):
- They are written in the brief's voice. They use only general technical knowledge plus brief facts.
- They name **no clients, no figures and no project anecdotes**.
- Every place where a figure or citation belongs is marked `[AUTHOR CHECK: …]`, which renders through `<Confirm id="C-14">` in staging.
- The Point of view format targets 1,200–2,000 words. These drafts run about 900 words each, so Ganeaysh can extend them with his own plant examples.
- The exhibits are qualitative diagrams and tables with no invented data. The Exhibit rule (5.10) stands: there are no numeric charts until the author supplies data.
- The MDX components available are `Note`, `Exhibit`, `ProcessChain`, `PullQuote`, `Takeaways` and `Confirm`. Each article imports them at the top of the MDX file.

#### Draft 1: `3-mcpd-glycidyl-esters-playbook.mdx`
```mdx
---
title: "3-MCPD and glycidyl esters: a practical playbook for refiners"
standfirst: "Process contaminants are not a laboratory problem. They are made in the refinery, step by step, and they can be unmade the same way."
description: "Where 3-MCPD esters and glycidyl esters form in refining, how to measure them, and the order in which to act: raw material, bleaching, deodorisation."
pillar: quality
format: point-of-view
status: draft
review: pending
date: 2026-11-04
---
import Note from '@/components/article/Note.astro';
import Exhibit from '@/components/article/Exhibit.astro';
import ProcessChain from '@/components/article/ProcessChain.astro';
import PullQuote from '@/components/article/PullQuote.astro';
import Takeaways from '@/components/article/Takeaways.astro';
import Confirm from '@/components/ui/Confirm.astro';

Most refiners first meet 3-MCPD as a number on a customer’s specification sheet. A buyer asks for lower values. The laboratory reports a result. Someone in the plant is asked to fix it. Six months later the number has hardly moved, and everyone is frustrated.

The problem is rarely effort. It is where the effort goes. 3-MCPD esters and glycidyl esters are process contaminants. They form inside the refinery, from things that arrive with the crude oil and from the conditions we create to refine it. That means they can be managed like any other process outcome: by understanding where they form, measuring the right things, and changing the process in the right order.

Regulators in Europe have set maximum levels, and multinational customers often specify their own, tighter limits. <Confirm id="C-14" note="AUTHOR CHECK: cite the current EU regulation and any India requirement" />

This is the playbook we use.

## First, name the two problems

The two families are usually discussed together, but they behave differently.<Note n={1}>3-MCPD: 3-monochloropropane-1,2-diol. GE: glycidyl esters. DAG: diacylglycerols. FFA: free fatty acids.</Note>

3-MCPD esters need three things: a source of chlorine, the glycerides of the oil, and heat. The chlorine-containing precursors arrive with the crude oil. They come from the fruit, the mill and the water used along the way.

Glycidyl esters form mainly from diacylglycerols at the high temperatures used in deodorisation. How much forms depends heavily on temperature and time.

The difference matters. A refiner who treats them as one problem often fixes one and makes the other worse. Each needs its own levers and its own measures.

## Agree how you measure before you argue about results

Before changing the process, agree the analytical method with your customer. Several official methods exist, and they do not always give the same answer on the same sample. Plants and customers can spend months debating results when the real disagreement is about the method.

So the first step is simple. Write down which method, which laboratory and which sampling points count. Then build a baseline: crude oil, after bleaching, after deodorisation and finished product, over enough batches to see the spread, not only the average.

## The four places to act

<Exhibit n={1} title="Each lever acts at a different point in the refining chain" subtitle="Where 3-MCPD esters and glycidyl esters can be reduced, in the order we act" source="KoKreaters">
  <ProcessChain steps={[
    { name: 'Raw material and crude oil', note: 'Chlorine precursors, FFA and DAG' },
    { name: 'Degumming and neutralisation', note: 'Washing, acid choice, precursor removal' },
    { name: 'Bleaching', note: 'Earth type, dose and acidity' },
    { name: 'Deodorisation', note: 'Temperature and time; most GE forms here', highlight: true },
    { name: 'Post-refining', note: 'Adsorbents or a second, milder step' },
  ]} />
</Exhibit>

**1. Raw material and crude oil.** The cheapest contaminant is the one that never enters the plant. Fresh fruit handling, mill practice and the water used upstream all affect the chlorine precursors and the diacylglycerol content of the crude. Crude oil with high free fatty acids usually carries more diacylglycerols, and more diacylglycerols mean more potential for glycidyl esters. Where you can influence supply, specify it. Where you cannot, measure it and segregate it.

**2. Degumming and neutralisation.** Washing the crude oil can remove part of the water-soluble chlorine precursors. Chemical neutralisation also lowers precursors, but it changes yield and effluent, so judge it on the whole cost, not only on contaminant values. Acid dosing in degumming deserves attention too: the choice and amount of acid can affect what forms later.

**3. Bleaching.** Bleaching earth is not only there for colour. Its type, dose and acidity influence what forms downstream. A more acidic earth may give a beautiful colour and a worse 3-MCPD result. Change one variable at a time, and follow the oil all the way through deodorisation, because the effect of bleaching often shows only at the end.

**4. Deodorisation.** This is where most glycidyl esters form, and where the temperature–time profile is the main lever. Lower temperatures and shorter residence times reduce them, but they also change free fatty acid stripping, colour and flavour. Some plants use two temperature zones: a short, hotter step, then a longer, cooler one for stripping. The right answer depends on the equipment you have, the oil you refine and the specification you must meet.

Where the numbers still miss a demanding specification, there are post-refining options, such as treatment with specific adsorbents or a second, milder deodorisation. They work, but they add cost. They belong at the end of the playbook, not the beginning.

<PullQuote>A contaminant that forms in the process can be managed like any other process outcome.</PullQuote>

## Where to start

If you are starting from a customer complaint, resist the urge to change everything at once. Begin with two weeks of disciplined measurement at every step. Rank the batches from best to worst and compare what was different about them: the crude oil, the bleaching earth, the deodoriser temperature, the time in each vessel. The best batches usually show you the first lever to pull. Trial that one change, measure it the same way, and only then move to the next.

## Treat it as a system, not a task

The levers sit in different departments. Procurement owns the crude. Production owns bleaching and deodorisation. Quality owns the laboratory. Sales owns the customer conversation. When the target belongs to only one of them, progress stalls.

What works is one programme with one owner, one baseline and one set of measures, reviewed at the same rhythm as yield and cost. Each change is trialled, measured at every step and then written into the operating procedures, so the result survives a change of shift or a change of manager.

## What a good programme leaves behind

A good mitigation programme does not end with a report. It leaves behind a baseline that everyone trusts, a short list of process changes proven in plant trials, updated specifications for incoming crude oil, and people on every shift who understand why the changes matter.

That is how we work on contaminant mitigation: on the plant floor, with your team, until the improvement is part of how the plant runs.

<Takeaways items={[
  '3-MCPD esters and glycidyl esters form in different ways. Manage them separately.',
  'Agree the analytical method and sampling points with your customer first.',
  'Act in order: raw material, degumming and neutralisation, bleaching, deodorisation, then post-refining.',
  'Trial one change at a time and follow the oil through to finished product.',
  'Give the programme one owner, and write every proven change into the procedures.',
]} />
```

#### Draft 2: `trans-fat-elimination-inside-a-plant.mdx`
```mdx
---
title: "Trans-fat elimination: what it really takes inside a plant"
standfirst: "Removing partially hydrogenated oils is a formulation change, a process change and a people change. Plants that treat it as only the first one struggle."
description: "What industrial trans-fat elimination involves in a fats plant: the functions to replace, the replacement routes, the saturated-fat trap and the line trials."
pillar: innovation
format: point-of-view
status: draft
review: pending
date: 2026-11-04
---
import Note from '@/components/article/Note.astro';
import Exhibit from '@/components/article/Exhibit.astro';
import PullQuote from '@/components/article/PullQuote.astro';
import Takeaways from '@/components/article/Takeaways.astro';
import Confirm from '@/components/ui/Confirm.astro';

Taking industrial trans fat out of a product sounds like a single decision. Stop buying partially hydrogenated oil, buy something else, update the label. In practice it is one of the most demanding changes a fats plant and its customers can make. Partially hydrogenated oils did several jobs at once, and every one of those jobs still has to be done.

Our founder’s trans-fat elimination work at Cargill was publicly recognised by the Director-General of the World Health Organization. This article sets out what that kind of work involves inside a plant.<Note n={1}>iTFA: industrially produced trans-fatty acids, formed mainly when vegetable oils are partially hydrogenated.</Note>

## Start with what the old fat was doing

Partial hydrogenation was popular for good reasons. It turned liquid oils into solid fats with a wide plastic range. It gave stability against oxidation. It crystallised in a way that gave margarines and shortenings a smooth texture, and bakery products their volume and bite. It was available, consistent and relatively cheap.

So the first question is not “what replaces it?”. It is “what was it doing in this product?”. A laminating fat for puff pastry, a frying oil for a snack line and a filling fat for biscuits need different answers. We start every reformulation by writing down the functions the fat must deliver, how each is measured and what the customer will accept.

## Bring procurement and sales in early

A new fat system often means new raw materials. Palm fractions, fully hydrogenated hard stocks and different liquid oils have their own supply chains, price movements and certification needs. If procurement learns about the change last, the plant may end up with a formulation it cannot buy reliably.

Sales teams need to know too. Customers will ask what changed, why, and what it means for their own products and labels. A short, technical and honest explanation, ready before the first trial delivery, protects the relationship.

## The replacement toolbox

There is no single substitute. There is a toolbox, and most solutions combine several tools.

<Exhibit n={1} title="Every replacement route trades something" subtitle="Common routes to solid fat functionality without partially hydrogenated oils" source="KoKreaters">
| Route | What it does well | What to watch |
|---|---|---|
| Fractionation, for example palm stearin and mid-fractions | Natural hard fractions, no chemical change to the oil | Dependence on one raw material; crystallisation behaviour |
| Interesterification, chemical or enzymatic | Tailors the melting profile from hard stock and liquid oils | Capacity, processing cost and process control |
| Full hydrogenation, then interesterification | Hard stock with no trans fat | Extra process steps; how the ingredient must be declared <Confirm id="C-14" note="AUTHOR CHECK" /> |
| Blending | Simple and flexible | A limited range of textures on its own |
| Structuring and emulsifier systems | Can reduce the solid fat needed | Formulation complexity and cost |
</Exhibit>

Each route has a cost. Fractionation depends on the raw material. Interesterification needs capacity and control. And almost every route that delivers solid fat without trans fat brings saturated fat with it.

## Do not swap one problem for another

This is the trap. The quickest way to rebuild solid fat functionality is to add saturated fat. Regulators and customers increasingly watch saturated fat as well, so a reformulation that removes trans fat but adds a large amount of saturated fat may not survive the next review.

The better target is the lowest saturated fat that still delivers the function. That needs a precise understanding of crystallisation: which crystal form the fat settles in, how fast, and how that changes with processing and storage. It is technical work, and it is where most of the value lies.

## What changes on the plant floor

A new fat system rarely runs well on settings designed for the old one.

On margarine and shortening lines, cooling, working and resting conditions often need to change, because the new fat crystallises differently. Tempering and storage temperatures may need adjusting. Fractionation or interesterification capacity may need to be added or rescheduled. Raw material storage and handling change with the new blend.

None of this can be settled in the laboratory alone. The formulation has to be proven at line speed, on the real equipment, with the real operators, and then followed through shelf life.

<PullQuote>A formulation is only finished when it runs on the line and lasts on the shelf.</PullQuote>

## What changes for the customer

The customer’s plant changes too. A bakery’s laminating line, a confectioner’s enrober and a snack fryer will each respond to the new fat in their own way. Application trials with the customer, on their equipment, turn a good formulation into an accepted one. Technical service teams need to be ready before the switch, not after the first complaint.

## Prove it, then keep proving it

Elimination has to be verified. That means fatty acid analysis of finished products, specifications that limit trans fat in every incoming oil, and supplier checks, so that partially hydrogenated material does not return through a minor ingredient. Shelf-life testing deserves the same discipline. A fat that performs on day one may change its texture after weeks in a warm warehouse, as its crystals slowly change form. Test at the temperatures your products really see, not only in the laboratory.

Check the current legal limit in every market you sell into, because the limits differ. <Confirm id="C-14" note="AUTHOR CHECK: add the limits for India and the European Union" />

## Judge it on cost-in-use, not price per tonne

A replacement fat may cost more per tonne and still cost less in use, if it runs faster, wastes less or allows a lower dose. Judge the change on the whole cost, across your plant and your customer’s.

<Takeaways items={[
  'List the functions the old fat delivered before choosing a replacement.',
  'Combine fractionation, interesterification, blending and structuring as the product needs.',
  'Aim for the lowest saturated fat that still delivers the function.',
  'Prove the formulation at line speed and through shelf life, with the customer.',
  'Verify elimination with analysis, specifications and supplier control.',
]} />
```
MDX supports GFM tables by default in Astro's markdown pipeline. Inside `<Exhibit>`, the table needs a blank line after the opening tag and another before the closing tag.

### 4.14 Legal pages (placeholder text; LAWYER REVIEW REQUIRED)
- The files are `src/pages/privacy.mdx`, `cookies.mdx` and `terms.mdx`, each with `layout: ../layouts/LegalLayout.astro`. Frontmatter: `title`, `description`, `updated: 2026-11-04`.
- `LegalLayout` renders a Butter banner: "Placeholder text for review by a lawyer before launch. Not legal advice." This text is COMPOSED and shows in **both** modes until `reviewed: true` is set in frontmatter.
- Content is short and factual, and shows only what the site actually does.

**privacy.mdx** has these sections:
1. **Who we are.** KoKreaters `<Confirm 11: legal entity, KvK, registered address>`, based in the Netherlands. Contact: office@kokreaters.com.
2. **What we collect.** Only what you enter in the contact form (name, company, role, email, phone or WhatsApp, country, area of interest, message, how you heard about us) or the newsletter field (email address).
3. **Why, and the legal basis.** To reply to your enquiry or send the newsletter, on the basis of your consent (GDPR Article 6(1)(a)), which you can withdraw at any time.
4. **Who processes it.** The form service `<Confirm 9: provider>` and our email provider (Google Workspace). No other third parties, and no sale of data.
5. **How long we keep it.** `<Confirm: retention period>`.
6. **Your rights.** Access, correction, deletion, restriction, portability and objection. You also have the right to complain to the Autoriteit Persoonsgegevens.
7. **Fonts and embeds.** Fonts are self-hosted. There are no third-party embeds and no analytics.
8. **Changes**, with the "updated" date.

**cookies.mdx** covers:
- This site sets no cookies for analytics or advertising.
- It uses no cookies at all by default. If you open cookie settings, your choice may be stored in your browser's local storage.
- If Cloudflare Turnstile is enabled on the contact form, Cloudflare may process technical data to tell people from bots `<Confirm>`.
- How to control cookies in your browser, and the contact address.

**terms.mdx** covers:
- Use of the site.
- Content is general information, not professional advice for your situation.
- Results described are from the founder’s career at previous employers and are not KoKreaters projects.
- Intellectual property: the KoKreaters name and logo, with the trademark application pending (CONFIRM 12).
- Links to other sites.
- Limitation of liability.
- Governing law: the Netherlands `<Confirm>`.
- Contact.

---

## 5. Pages, fold by fold

**Shared fold anatomy.**
- Each fold is a `<Section>` (`ui/Section.astro`, props `{ id?, ground?: 'white'|'cloud'|'dark', folio?: { n?: string; label: string; right?: string }, labelledby? }`). It renders `<section class="band">` and, when `folio` is set, a `Folio` row.
- The Folio row is a full-width 1px rule. Under it sit the left dateline (`{n} · {label}`) and a right running head in meta Graphite. On mobile the running head is hidden.
- **Reveal grammar:**
  - A fold h2 gets `data-reveal="lines"`.
  - The body block after it gets `data-reveal`.
  - Rules get `data-rule`.
  - Line-work gets `data-draw`.

Section 6 defines these. Nothing else animates unless the fold says so.

### 5.0 Shared components (W1-brand builds them; pages compose them)
1. **`Button.astro`**: `{ href?, variant: 'primary'|'secondary'|'on-dark'|'ghost-on-dark', size?: 'sm'|'md', type?, arrow?: boolean }`.
   - All variants are pills: 48px tall (44px for `sm`), padding `0 24px`, sans 600 16px, and an inline `<Arrow/>` 16px when `arrow`.
   - Primary: a Sapphire fill with White text. Hover and focus turn it Imperial and slide the arrow `translateX(4px)`, both over 180ms `--ease-out`.
   - Secondary: a 2px Sapphire inset border with Sapphire text. Hover fills it with Cloud.
   - On-dark: a Saffron fill with Imperial text. Hover adds `filter: brightness(0.95)` and moves the arrow.
   - Disabled: 40% opacity with `cursor: not-allowed`.
   - Loading: `aria-busy="true"`, the label kept, and a 16px spinner ring of 1.5px Sapphire (White on primary) in place of the arrow, rotating at 800ms linear. Under reduced motion the spinner is static.
   - There is no scale and no magnetic effect.
2. **`TextLink.astro`**: a Sapphire label plus `<Arrow/>`. Its underline is the rising-arrow swoosh drawn as an SVG under the label. The underline is hidden at rest and shown on hover or focus: a `clip-path inset(0 100% 0 0) → inset(0 0 0 0)` over 300ms `--ease-out`, with the arrow moving 4px. Under reduced motion the underline appears instantly. The default `display` is `inline-flex`, with a ≥ 44px hit area via padding-block.
3. **`Arrow.astro`**: an inline SVG on a 24 grid, 1.75px stroke with round caps. The path is `M5 12h14M13 6l6 6-6 6`. It carries `aria-hidden="true"` and `focusable="false"`.
4. **`Icon.astro`**: `name: 'external'|'error'|'success'|'menu'|'close'|'chevron'`, drawn to the same rules. No icon font is used.
5. **`PillarDot.astro`**: `{ pillar, size?: 8|10|12 }`.
   - It is a span with the pillar fill, a 2px White ring (`box-shadow: 0 0 0 2px #fff`) and, when `inkText`, the 1px Ink outer ring (`0 0 0 2px #fff, 0 0 0 3px var(--kk-ink)`).
   - Its `aria-hidden` is always set, because the name is written beside it.
6. **`PillarTag.astro`**: a chip, `{ pillar, href? }`.
   - It is a pill 28px tall with 13px semibold text, the `--pillar-*-tint` background and `--pillar-*-text` text, plus a `PillarDot` 8.
   - It is used on article headers, Related lists and impact tags. The home page has no chips (the Editorial rule).
7. **`RunIn.astro`**: `{ items: {label, href?}[], size?: 'h3'|'lead' }`.
   - It renders a `<ul class="run-in">` displayed inline, with `·` separators in `--c-rule`-coloured spans that are `aria-hidden`.
   - It is set in Fraunces h3 Imperial with a measure of 22–26em.
   - Links are underlined on hover and focus only (offset 6px, 1px Sapphire).
   - It is used for Industries on home and for deliverables.
8. **`ExpertiseIndex.astro`**: `{ size: 'home'|'overview', showHelp?: boolean }`, with six rows from `pillars.ts`.
   - The markup is `<ol class="x-index">`. Each `<li>` holds `<a class="x-row" href="/expertise/{slug}">`.
   - Row anatomy, in a grid `[num 56px][dot 24px][text 1fr][arrow 48px]`:
     - The number `01` in meta Graphite, with `tnum`.
     - A `PillarDot` 10.
     - The name in `.t-index` (overview: `--fs-h1`), then the promise below in `.t-lead` Graphite.
     - With `showHelp` (overview), the first two `helpWith` items in meta beneath.
     - `<Arrow/>` in Sapphire, always visible.
   - Padding is 28px top and bottom (overview: 40px). A 1px Hairline top rule is drawn with `data-rule`. A bottom rule follows the last row.
   - Hover and focus:
     - A 2px rule in the pillar colour (`::before`) grows across the top, `scaleX 0→1` from the left over 240ms `--ease-out`.
     - The dot gains a 1px outer ring in the pillar colour.
     - The arrow moves 8px.
     - The name changes Imperial→Sapphire. For the Saffron and Sky pillars the name stays Imperial and only the rule takes the colour.
   - Under reduced motion all of this is instant.
   - The accessible name is the whole row text. The arrow is hidden from assistive tech.
   - Minimum row height is 96px.
   - Mobile: the grid becomes `[dot][text][arrow]`, with the number shown above the name as a dateline.
9. **`ImpactRow.astro`**: `{ result: FounderResult, size?: 'home'|'compact' }`.
   - A grid 3/9: the left column is a `Sidenote` dateline (e.g. "INDIA · WILMAR"); the right column is `homeLine` in `.t-index` Imperial.
   - Substrings in `emphasis` are wrapped in `<span class="fig">`: Fraunces 300, Sapphire, `lnum`, `nowrap`.
   - "−25 °C" also gets `data-frost` (graft 8): a 1px Ice underline, 3px below the baseline, drawn left to right over 900ms on reveal. Under reduced motion it is drawn.
   - The row has a Hairline top rule (`data-rule`). The `iTFA` abbreviation and its sidenote follow 4.6.
   - On mobile the dateline sits above the outcome.
10. **`InsightRow.astro`**: `{ entry, dense?: boolean }`.
    - A `<li>` holding an `<a>` with these parts:
      - date in meta with `tnum`, as `4 Nov 2026` via `Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'})`
      - format as a dateline
      - title in `.t-h3`
      - standfirst on one line in meta (hidden when `dense`)
      - reading time
      - `PillarDot` plus the pillar short label in meta
    - It has a Hairline rule. In staging, draft entries carry `<DraftRibbon size="sm">`.
11. **`CoverStory.astro`**: `{ entry, size: 'home'|'hub' }`.
    - Contents, in order:
      - the format dateline
      - `PillarDot` plus the pillar name
      - the title in `.t-h1` (on the hub, the class is `--fs-h1` but the tag is `<h2>`)
      - the standfirst in `.t-standfirst` Graphite
      - the byline: a 40px ringed avatar, then "Ganeaysh Kulkarni · {n} min read · {date}"
    - It has an image only if `entry.image` exists (3:2, 16px radius, hover `scale 1.03` over 300ms). There is never a placeholder tint.
    - The whole title is the link.
12. **`CtaField.astro`**: the CTA plus terminal node, graft 3, placed above `Footer`.
    - A `band--dark` laid out on a grid 7/5.
    - Left:
      - an h2 in `--fs-cta` White: "Have a challenge worth solving together?"
      - `RisingArrow` under "together", drawn 900ms on enter
      - the body in lead Lavender
      - a row holding a 1px Sky line (SVG, 120px wide, `data-draw`) that ends in a **14px Saffron terminal node** with a 2px Imperial knockout ring, immediately left of the `Button variant="on-dark"` "Book a 30-minute call" → `site.bookingUrl`
    - Right: the static node-cluster `Engraving` in 1px Sky at 30%, `aria-hidden`.
    - Motion on enter: the line draws over 600ms, then the node fades and scales `0.6→1` over 220ms, then the swoosh draws over 900ms.
    - Mobile: one column; the engraving is hidden below 768px.
13. **`MethodLine.astro`**: `{ orientation: 'auto', scrub?: boolean }`.
    - An SVG 1px Sapphire line with three 24px rings (a 1.5px Sapphire stroke with a White fill) at the column starts.
    - It ends in the rising-arrow head at the right.
    - Each ring has a `data-ring` inner circle (r=6 Sapphire) that fills when reached.
    - It is horizontal at ≥ 768px and vertical down the left edge below that.
14. **`Newsletter.astro`**: `{ variant: 'fold'|'footer' }`.
    - The text: "Field notes from the plant floor and the boardroom. Once a month. No noise."
    - If `site.newsletterEndpoint` is set, it renders `<form method="post" action={endpoint}>` with a visually-hidden label "Email address", an email input, a consent checkbox ("I agree to KoKreaters storing my email address to send the newsletter, as described in the Privacy Policy." COMPOSED, mirroring the brief's form consent) and a Subscribe button. Validation is the same as the contact form (6.10).
    - If it is not set, it renders the text plus a TextLink "Subscribe" → `mailto:office@kokreaters.com?subject=Subscribe%20to%20field%20notes`.
15. **`Engraving.astro`**: `{ variant: 'hero'|'cluster'|'pillar-map'|'404', tone: 'light'|'dark', opacity }`.
    - It draws the node-cluster geometry from `assets/logo/kokreaters-node-cluster.svg` (viewBox `20 15 570 570`) as line-work.
    - Rings are 1px circles (r=10 at the engraving scale) with a 2px White knockout. Lines are 1px.
    - Disc outlines are 1px Hairline circles, with an 8% Lavender fill on the largest.
16. **`NodeCluster.astro`**: `{ size, id?, discs?: boolean = true, reversed?: boolean }`. It is the **logo** cluster, inline SVG, in its true colours, copied from the asset (5 node groups and 5 lines, plus discs). It is never recoloured, and each node group keeps its `<g>`.
17. **`RisingArrow.astro`**: `{ phrase: string, tone }` wraps the phrase: `<span class="swoosh">{phrase}<svg aria-hidden class="swoosh__svg" viewBox="0 0 400 24" preserveAspectRatio="none"><path d="M2 18 C 120 21, 260 16, 384 6" /><path class="swoosh__head" d="M372 2 L386 6 L376 16"/></svg></span>`.
    - The stroke is 1.5px Sapphire, or Sky on dark, with round caps and `vector-effect: non-scaling-stroke`. It sits 0.12em below the baseline and spans the phrase width.
    - At most **one** per page, except home (hero and CTA) and pages that carry the CTA field (their own one plus the CTA's).
    - It is drawn with `data-swoosh` (6.4). The SVG ships fully drawn.
18. **`Discs.astro`**: `{ mode: 'outline'|'filled', set: 'logo'|'portrait' }`. Outline means 1px Hairline circles. Filled means flat Lavender and Butter at 60% opacity with no blur, and it is used only behind the founder portrait (graft 7).
19. **`Sidenote.astro`**: an `<aside class="sidenote">` in meta Graphite. At ≥ 1280px it is placed in the left 3 columns, aligned to its anchor row. Below that it sits inline above its paragraph.
20. **`DraftRibbon.astro`**: staging only. A Butter strip with Ink text, 12px caps: "DRAFT for Ganeaysh’s review".

### 5.1 Home `/` (`pages/index.astro`, `page="home"`, ground Cloud for the hero only)
Fold order: hero → proof → positioning → what we do → method → impact → where we work → insights → founder → CTA → footer.
- The target is ≥ 800 server-rendered words (graft 9).
- The home page has three layouts only: split, index rows and full-width field.

**Fold 1 · `Hero.astro` + `HeroNetwork.astro`** (Cloud, `min-height: min(100svh, 940px)`)
- **Grid:** the text sits in columns 1–7, starting at `padding-top: var(--hero-top)`; the network sits in columns 8–12 and bleeds 72px past the right content edge (clipped by the band).
- **Copy:**
  - The dateline is `hero.overline`.
  - The H1 is `.t-display`, Imperial, max 13ch, balanced. It breaks after "expertise", and `RisingArrow` wraps "shared ambition".
  - The sub is `.t-lead` Graphite, max 34em.
  - The actions: a primary Button with an arrow, "Start a conversation", then a TextLink "Explore our expertise" 24px to its right.
- **Foot rule:** at the bottom of the band, a Hairline rule, then a meta row. Left: "Based in the Netherlands, working worldwide". Right: the five countries joined by `·`, in Graphite.
- **`HeroNetwork.astro`:**
  - An inline SVG, `viewBox="0 0 720 640"`, `aria-hidden="true"`, `width: min(46vw, 680px)`.
  - The layers, back to front, each a `<g>` with a data hook:
    1. `data-hero="discs"`: the three logo discs as **flat fills at 60%** (Lavender `cx=332 cy=218`, Ice `cx=305 cy=315`, Butter `cx=403 cy=296`, r≈97, i.e. the logo discs at scale 0.526). The hero is one of the two places filled discs are allowed (DNA 5.3 and graft 7).
    2. `data-hero="cluster"`: the **logo node cluster** at true colours, as a nested `<svg x="190" y="150" width="300" height="300" viewBox="20 15 570 570">` holding the 5 lines and 5 node groups from the asset. The cluster node centres in hero space are Sapphire (255,239), Coral (398,213), Saffron (333,308), Sky (432,369) and Cobalt (291,405).
    3. `data-hero="branches"`: six 1.5px Sapphire lines from (333,308) to the pillar nodes, with round caps.
    4. `data-hero="pillars"`: six pillar nodes. Each is a 12px pillar-colour dot with a 2px White ring and a 1px pillar-colour outer ring (Ink for Saffron and Sky), plus a `node-label` (Instrument Sans 500 13px Graphite at 0.7 opacity, sentence case, set 14px below the node). The labels are decorative, because the real names are two folds down.
       - Innovation (85,274) "Product innovation"
       - Process (303,96) "Process design"
       - Quality (553,191) "Food safety and quality"
       - Strategy (630,350) "Strategy and feasibility"
       - Deals (405,532) "Due diligence"
       - Capability (116,433) "Capability"
       - These short labels are COMPOSED from the pillar names.
    5. `data-hero="stations"`: three unlabelled 9px station nodes (a White fill with a 1.5px Sapphire ring) on 1px Sapphire 55% lines: Process→(178,58), Strategy→(694,468), Capability→(52,560). That makes 14 nodes in total, inside the brief's 12–20.
  - **The SVG ships fully drawn**, which serves both no-JS and reduced motion.
  - Mobile (< 768): the SVG moves below the actions at 100% width and 300px tall, with labels hidden and the stations hidden.
- The H1 is the LCP element. **The hero text is never animated.** Motion is in 6.5.

**Fold 2 · `ProofBand.astro`** (`band--dark`; graft 2)
- The Folio has no number. Left: "From our founder’s career", as a Lavender dateline.
- A 4-column grid (2×2 below 768). Above the columns runs one horizontal 1.5px Sky line across the full content width (`data-proof-line`). At each column start sits a station node: a 12px Imperial fill with a 2px Saffron ring (`data-proof-node`).
- Each column holds:
  - the numeral `.t-stat` in Saffron, using `<span data-count={count} aria-hidden="true">{value}</span><span class="visually-hidden">{value}</span>`
  - the label in sans 16/24 Lavender, max 22ch
- "WHO" has no `data-count`.
- Below 768px the line is hidden and the nodes sit inline above each numeral.

**Fold 3 · `Positioning.astro`** (White; graft 9)
- The Folio left label is "Our promise" (COMPOSED).
- A split 5/7. Left: an h2 `.t-h2`, "Deep expertise, shared ownership, measurable results.". Right: `positioning.promise` in `.t-lead` Ink, then `positioning.range` in `.t-body` Graphite, max 60ch.
- Motion: the standard reveal.

**Fold 4 · What we do** (White)
- The Folio reads `01 · What we do`, with "KoKreaters · Home" on the right.
- A split 5/7. Left: the h2 "Six ways we create value, together." and the intro in lead. Right: `<ExpertiseIndex size="home">`.
- Motion: the rules draw with a 60ms stagger, the text fades in step with them, and hover follows 5.0.8.

**Fold 5 · `MethodFold.astro`** (Cloud)
- The Folio reads `02 · The KoKreaters way`, and the h2 is "Connect. Collaborate. Create."
- `MethodLine` runs above a 4/4/4 grid. Each column holds the step label as a dateline ("Step 1 · Connect") and the step copy in lead.
- Then a TextLink "How we work" → /approach.
- Motion: the line is **scrubbed**, and there is no pin (6.5).

**Fold 6 · `ImpactFold.astro`** (White)
- The Folio reads `03 · Impact · From our founder’s career`, and the h2 is "Results that started on the plant floor."
- Four `ImpactRow`s, then a TextLink "See the impact" → /impact.
- Datelines are words only; no logos appear.

**Fold 7 · `WhereWeWork.astro`** (White)
- The Folio reads `04 · Where we work`, and the h2 is "Where we work".
- `RunIn` lists the nine industries, each linking to `/industries#{slug}`.
- Motion: the standard fade.

**Fold 8 · `InsightsFold.astro`** (Cloud; the largest fold)
- The Folio reads `05 · Insights`, and the h2 is "Ideas from the plant floor and the boardroom."
- A grid 7/5. Left: `CoverStory size="home"` for the newest visible entry. Right: the next two visible entries as `InsightRow`s.
- With fewer than three visible entries, the right column shows what exists and then an "In preparation" dateline over up to three coming-soon titles in Fraunces 20/28 Graphite, **unlinked**.
- The fold closes with `Newsletter variant="fold"` on a Hairline rule.
- Production with no approved articles: the fold renders the h2, the "In preparation" list and the Newsletter. It never shows dummy cards.

**Fold 9 · `FounderFold.astro`** (White; graft 7)
- The Folio reads `06 · Founder`.
- A grid 5/7.
- **Left: the portrait.**
  - It is a 300px circle at desktop (240px on mobile): `ganeaysh-square.png` through `<Picture formats={['avif','webp']} widths={[240,300,480,600]} sizes="(min-width: 768px) 300px, 240px">`, with `alt="Ganeaysh Kulkarni, founder of KoKreaters"`, lazy.
  - Its ring is an SVG `<circle>` with a 3px Saffron stroke, drawn once over 1200ms `power2.inOut` (`data-draw`).
  - Behind it, `Discs mode="filled"`: a Lavender disc (offset −40px, −24px) and a Butter disc (offset +48px, +36px), each 260px, at 60%.
- **Right: the quote.**
  - Set in `.t-quote` Imperial (Fraunces italic) with a Saffron opening `“` hung in the margin (`.hang`).
  - Then the attribution in meta ("Ganeaysh Kulkarni, Founder") and a TextLink "Meet Ganeaysh" → /about.
  - `<Confirm id={4}/>` follows.
- Motion: the ring draws, then the quote fades in as **one block** over 600ms. The founder's words are never split.

**Fold 10 · `CtaField` then the `Footer`** (one Imperial field).

### 5.2 Expertise overview `/expertise`
- **Header** (White): a breadcrumb ("Home / Expertise"), a dateline "Expertise", the h1 "Expertise that connects science, plants and strategy." and the intro in lead, in columns 1–7.
- **`<ExpertiseIndex size="overview" showHelp>`** at full width.
- **A prompt row:** "Not sure where you fit?" in Fraunces h3, followed by a TextLink "Start a conversation" → /contact.
- Then the `CtaField` and the Footer.
- Motion: standard. The index rules draw.

### 5.3 Pillar template `/expertise/[slug]` (one template, six pages; `page="pillar"`, `pillar={key}`)
`getStaticPaths` maps over `pillars`. The pillar colour appears in only five places:
- the 4px top bar
- the overline dot
- the bullets
- the "you are here" node
- chips

1. **`PillarHero.astro`** (Cloud):
   - A 4px `--pillar` bar across the top of the band.
   - A breadcrumb ("Home / Expertise / {name}").
   - A dateline `0{n} of 06 · Expertise` with a `PillarDot`.
   - An eyebrow with the pillar name in h4 Imperial.
   - The **h1 is the pillar headline**, set in `.t-h1`, in columns 1–7. The intro follows in lead.
   - Right, in columns 8–12: **`PillarMap.astro`** (graft 4).
     - An SVG (`viewBox 0 0 560 480`, `aria-hidden`) holding the six pillar nodes at the hero-bloom angles, rescaled around (280,240) with radius 180.
     - The current pillar node is 48px, filled `--pillar` (with an Ink ring if `inkText`), and has a 1px pillar-colour line to each of the other five.
     - The others are 12px ringed nodes.
     - Over the SVG, `<nav aria-label="Other expertise"><ul>` holds the five real HTML links, absolutely positioned at the node coordinates (percentages of the viewBox), each with the pillar short name in meta Ink. The current pillar's label is plain text with `aria-current="page"`.
     - Hover or focus on a link draws its line in that pillar's colour, as a `stroke` change over 300ms.
     - Mobile: the SVG is hidden, and the nav becomes a horizontal, wrapped row of five `PillarTag` links.
2. **`HelpList.astro`**: the h2 "What we help with", then a `<ul class="ringed">` of the `helpWith` items in 19/30 Ink. Each bullet is a `PillarDot` 8 hung in the margin. A vertical 1px Hairline connector runs through the dots and is drawn on enter over 900ms. Acronyms are expanded on first use with `<abbr>`: CBE (given in the brief text itself), FSQR, 3-MCPD.
3. **`Deliverables.astro`**: the h2 "Typical deliverables", then `RunIn size="h3"` with the deliverables. No links.
4. **From the record**: shown only if `impactId` is set. A dateline "From our founder’s career", then one `ImpactRow size="compact"`, then a TextLink "See the impact" → `/impact#{id}`.
5. **`RelatedInsights.astro`**:
   - Shows up to three `InsightRow dense` items for `byPillar(key)`, under the h2 "Related insights" (COMPOSED).
   - If none exists, it shows the coming-soon titles for that pillar under "In preparation".
   - If there are none of those either, the section is omitted.
6. **The prompt row:** "Not sure where you fit? Start a conversation".
7. `CtaField` and the Footer.

Motion: the PillarMap lines draw outwards from the current node over 700ms with an 80ms stagger. HelpList and the rest use the standard reveal.

### 5.4 Industries `/industries`
- **Header:** a breadcrumb, a dateline "Industries", and the h1 "Where we work". There is no lead, because the brief has none. In staging this shows `<Confirm id="C-15" note="industries intro"/>`.
- **Body** is a grid 3/9 at ≥ 1024px.
- **Left: `SectorIndex.astro`.** A sticky (`top: calc(var(--header-h) + 24px)`) `<nav aria-label="Industries">` with an `<ol>` of the nine sectors in meta. The current sector is marked with a 2px Sapphire bar on its left and `aria-current="true"`, set by an IntersectionObserver in `industries.ts`. Below 1024px the index is a horizontally wrapped list of anchor links at the top.
- **Right: nine `SectorSection.astro`.** Each is `<section id={slug}>` with:
  - a Hairline top rule
  - a dateline `0{n}`
  - an h2 with the sector name
  - the brief copy in lead
  - "Relevant expertise" (COMPOSED) as a dateline over `PillarTag` links to the mapped pillars
- An image slot renders only if `image` exists (3:2, 16px radius).
- Then the `CtaField`.
- Motion: the standard reveal. The index bar moves with a `top` transition over 200ms.

### 5.5 Approach `/approach`
1. **Header** (White): the dateline "Approach", and the h1 "We create with you, not for you." with `RisingArrow` on "with you". The intro follows in lead.
2. **`MethodSteps.astro`:**
   - `MethodLine` at full width, scrubbed as on home.
   - Then three sections, `id="connect"`, `"collaborate"` and `"create"`. Each has:
     - the dateline "Step {n}"
     - the h2 with the step name
     - the step copy in lead
     - a `<dl>` 3/9 grid: "What we do", "What you get", "Typical duration"
   - Each `<dl>` value comes from data. If it is null: in staging, `<Confirm id={10}/>`; in production the `<dl>` is omitted.
3. **`Principles.astro`:**
   - The h2 "Principles" (brief label).
   - Five rows in the index style: a Hairline rule, the number `01–05`, the name in `.t-h3`, and the copy in lead Graphite, aligned to columns 5–12.
4. **`EngagementTable.astro`:**
   - The h2 "Ways to work with us" (brief), then a real `<table>` with `<caption class="visually-hidden">Ways to work with us</caption>`.
   - Columns: Model, Typical shape, Good for. Sans `tnum`, Hairline row rules, no zebra stripes and no vertical rules.
   - The header row is set as datelines.
   - Below 768px each row becomes a stacked block: a `<th scope="row">` and `data-label` pseudo-labels.
   - `<Confirm id={10}/>` sits under the table.
5. `CtaField`.

### 5.6 Impact `/impact`
1. **Header:** a `band--dark` (flat Imperial; there is no Twilight gradient):
   - the dateline "Impact"
   - the h1 in White, "Results that started on the plant floor."
   - the lead in Lavender: "From India’s first integrated specialty fats facility to a refinery at −25 °C: the results behind KoKreaters." (brief SEO copy)
2. **Part one:** the h2 "From our founder’s career", then four **`CaseEntry.astro`** entries, each `<article id={id}>`:
   - a Hairline rule
   - the context as a dateline
   - the h2 outcome in `.t-index`
   - a 3/9 grid of three labelled paragraphs: "The challenge", "What was done", "The result" (labels from brief 6.5)
     - The labels are datelines and the values are lead.
     - A null value renders `<Confirm id="C-9"/>` in staging; in production its row is omitted.
   - the figure, when present: `.t-figure` in Sapphire with the source line in meta ("From our founder’s career, Wilmar, Ukraine"). The −25 °C figure carries `data-frost`.
   - tags: `PillarTag`s, plus sector text tags in meta
3. **Part two:** the h2 "KoKreaters engagements" with a meta line "Anonymised" (the brief's own word).
   - **`EngagementRow`** shows the dateline "KoKreaters engagement" and the brief text in `.t-h3`.
   - Rows render only when `consent === 'cleared'`, or in staging with the "Pending client consent" label.
   - If none renders in production, the whole of part two is omitted.
4. **`Testimonials.astro`**: renders nothing while `testimonials.length === 0` (CONFIRM 8).
5. `CtaField`.

Motion: the rules draw, a frost tick follows, and the standard reveal applies. There is **no** count-up.

### 5.7 Insights hub `/insights`
1. **Header** (White):
   - the dateline "Insights" and the h1 "Ideas from the plant floor and the boardroom."
   - the lead: "Points of view and field notes on specialty fats, refining, contaminants, audits and growth in food and ingredients."
2. **Featured:** `CoverStory size="hub"` for the first `featured` entry, or otherwise the newest visible entry.
3. **`Filters.astro`** is a `<div role="group" aria-label="Filter insights">` with two rows of `<button aria-pressed>` text toggles (no chips):
   - "Pillar: All · Product · Process · Food safety · Strategy · Deals · Capability", each with its `PillarDot`
   - "Format: All · Point of view · Field notes · Explainer"
   - **They render with `hidden` and are un-hidden by `insights.ts`.** Without JS, the full list shows.
   - The state is mirrored to `?pillar=&format=` through `history.replaceState`, and read back on load.
   - A live region announces the result: "{n} insights" (COMPOSED).
4. **`InsightList.astro`**: a chronological `<ol>` of `InsightRow`s, each with `data-pillar` and `data-format`.
5. **`ComingSoon.astro`**: an "In preparation" dateline over the coming-soon titles with their format and `PillarDot`, unlinked.
6. **Newsletter** (fold variant).
7. `CtaField`.

Filter motion: GSAP Flip on the list (6.7).

### 5.8 Article `/insights/[slug]` (`ArticleLayout.astro`, `page="article"`)
Grid at ≥ 1280px:
- columns 1–3: sidenotes
- columns 4–10: body (`max-width: 64ch`)
- columns 11–12: the route rail

Below 1280px it is a single column, and sidenotes become footnotes at the end.

1. **`ProgressRule.astro`**: a 1px Sapphire bar fixed under the header, `scaleX` tied to article progress. It is hidden under reduced motion, where the running head shows "{n} min left" instead.
2. **The running head** (meta): left, "KoKreaters Insights · {format label}"; right, the reading time.
3. **`ArticleHeader.astro`**:
   - In staging, the `DraftRibbon` comes first.
   - Then a `PillarTag` linking to `/expertise/{slug}`, the h1 title in `.t-h1` (cols 4–11), and the standfirst in `.t-standfirst` Graphite.
   - The byline: a 40px ringed avatar (`ganeaysh-square`), then "Ganeaysh Kulkarni · {date or CONFIRM} · {n} min read".
   - A Hairline rule closes the header.
4. **The body** follows `prose.css`:
   - Fraunces at opsz auto, weight 380, `--fs-article` and `--lh-article`, with `font-variant-numeric: oldstyle-nums`.
   - The journal lead-in: the first line of the first paragraph is set in sans caps with `.prose > p:first-of-type::first-line { font-family: var(--font-sans); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; font-size: .82em; }`. There is no drop cap and no rehype plugin.
   - h2 is Fraunces 32/40, `--wght-h2`, with a 72px top margin.
   - h3 is Fraunces 24/32.
   - Paragraph spacing is 1em, and lists use ringed bullets.
   - `strong` is sans 600 at 0.92em when it opens a paragraph (the "1. Raw material…" run-in heads).
   - Tables follow 5.10.
5. **`Note.astro`** (sidenote) takes `{ n }` and a slot:
   - It renders `<sup class="note-ref"><a href="#note-{n}" id="ref-{n}" aria-describedby="note-{n}">{n}</a></sup>`, followed by `<aside id="note-{n}" class="sidenote">`.
   - At ≥ 1280px the aside floats into the left margin (`float: left; width: var(--margin-col); margin-left: calc(-1 * (var(--margin-col) + var(--gutter))); clear: left`). Below 1280px it stays inline in reading order as an indented meta block with a 1px Hairline left rule. Do not build a separate end-notes list.
6. **`Exhibit.astro`** takes `{ n, title, subtitle?, source }` and a slot:
   - `<figure class="exhibit">` holds the dateline "Exhibit {n}" in Mauve, the title in h4 20/28 Imperial (a sentence stating the finding), the subtitle in meta, the slot, and `<figcaption>` "Source: {source}" in 14px Graphite.
   - Width is the measure + 120px, centred on the body column.
   - Tables inside use Hairline rules and sans 15/22.
7. **`ProcessChain.astro`** takes `{ steps: {name, note, highlight?}[] }`. It is an `<ol>` drawn as station nodes on a 1px Sapphire line: horizontal at ≥ 768px, vertical below. The name is h4, the note is meta, and a highlighted step's node is filled Saffron with an Ink ring. The line draws on enter over 900ms.
8. **`PullQuote.astro`**: `<blockquote class="pull">` in `.t-pull` Imperial, with a Saffron `“` hung and a 1px Sapphire rule on the left. At most one per 1,000 words.
9. **`Takeaways.astro`** takes `{ items }`. It is the page's one box: a 1px Hairline border, 16px radius, 32px padding, the h2 "Key takeaways" in h4 and a ringed list.
10. **`AuthorBox.astro`**: the short bio, a 72px avatar with a Saffron ring, and a TextLink "Meet Ganeaysh".
11. **Related:** three other visible insights as `InsightRow`s, the same pillar first.
12. `CtaField`.
13. **`RouteRail.astro`** (graft 6, at ≥ 1280px, when the article has ≥ 3 h2s):
    - A sticky (`top: calc(var(--header-h) + 32px)`) `<nav aria-label="On this page">` holding an `<ol>` of the h2 links in meta.
    - The links are drawn as station nodes on a vertical 1px Hairline line, with a Sapphire progress segment that grows with scroll.
    - The current h2's node fills Sapphire, and its link gets `aria-current="true"`.
    - The h2 ids are generated by Astro's default heading slugs. `headings` come from `render(entry)`.

### 5.9 About `/about`
1. **`AboutHero.astro`** (Cloud):
   - A grid 7/5. Left: the dateline "About", the h1 "Built on 25 years of making ingredients work." and the intro in lead.
   - Right: the 4:5 portrait (`ganeaysh-portrait.png`) through `<Picture formats={['avif','webp']} widths={[360,480,720,960]} sizes="(min-width: 1024px) 420px, 90vw" loading="eager" fetchpriority="auto">`, alt "Ganeaysh Kulkarni".
   - The portrait sits in a **half-stadium mask**: `border-radius: 999px 999px 16px 16px`. Behind it, `Discs mode="outline"` (the hairline outlines).
   - There is no parallax. The image is not the LCP target, because the h1 renders first and the image is below it on mobile.
2. **`LongBio.astro`**:
   - Six paragraphs in a 3/9 grid, with `bioSidenotes` in the left column.
   - The first paragraph is set in Fraunces 26/36 Imperial; the rest in sans 19/31 Ink, measure 64ch.
   - `<Confirm id={13}/>` sits after the first paragraph.
3. **`Timeline.astro`**: an `<ol class="timeline">` holding the four nodes on a 1px Sapphire line, horizontal at ≥ 768px and vertical below. Each node is a 24px ring with an inner fill, carrying the label in h4 and the years in meta `tnum`. Organisation names are text only. The line draws over 1200ms and each ring fills as the line reaches it.
4. **`GlobeSection.astro`**: the one Three.js moment, detailed in 6.8.
   - The section is `height: 160vh` at ≥ 1024px with motion; otherwise it is auto.
   - The sticky inner element is `position: sticky; top: var(--header-h); height: calc(100vh - var(--header-h))`, on a grid 5/7.
   - Left column:
     - the dateline "The map"
     - the h2 "India, Indonesia, Ukraine, Türkiye and the Netherlands" (brief countries)
     - the lead: "His career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands, leading teams in the Americas, EMEA and Asia-Pacific." (bio sentence, trimmed at a clause boundary)
     - `<ol aria-label="Places in Ganeaysh’s career">` with the eight places as "Mundra, India" and so on, in meta, as two columns
   - Right column: `<div class="globe" data-globe>` holds, by default, `<GlobeStatic/>` (the inline `src/assets/globe/globe-static.svg` imported as a component, `aria-hidden`). W3-globe mounts the canvas over it.
5. **`NamePanel.astro`** (Cloud):
   - The h2 "The name", then the `name.ko`, `name.kreaters`, `name.quote` and `name.tagline` copy as two short paragraphs.
   - Then the full logo lockup at 220px: `logo-full.png` through `<Image>` at 2x, alt "KoKreaters: Connect · Collaborate · Create".
   - This is the only body-content appearance of the full lockup.
6. **`EducationLanguages.astro`**: the h2 "Education and languages" over a two-column `<dl>`, Education on the left and Languages on the right, in lead. The line "Working with global leaders in nutrition, food, personal care and pet food." follows, with `<Confirm id={5}/>`.
7. `CtaField`.

### 5.10 Contact `/contact`
- A grid 5/7, with no CtaField (the page is the CTA). Footer only.
- **Left: `ContactDetails.astro`:**
  - the dateline "Contact"
  - the h1 "Let’s create something together." and the intro in lead
  - `<address>` (`font-style: normal`) holding:
    - Email: office@kokreaters.com
    - WhatsApp: +31 6 2215 7910 (wa.me link)
    - LinkedIn: linkedin.com/in/ganeayshkulkarni
    - "Based in the Netherlands, working worldwide"
  - The labels are datelines and the values are lead.
  - Then the page's one primary pill, "Book a 30-minute call" → `site.bookingUrl`. If that equals `/contact#form`, the pill focuses the form's first field instead.
  - `<Confirm id={9}/>`.
- **Right: `ConnectionMoment.astro`** (graft 5) sits above the form.
  - A 2-node SVG, `aria-hidden`, about 320×80:
    - A left station node, labelled with the visitor's typed Name (`data-visitor-label`, falling back to "You", COMPOSED).
    - A right 48px person node: `ganeaysh-square` in a circle with a 3px Saffron ring.
    - A dashed 1px Hairline line between the two, plus a solid Sapphire line (`data-connection-line`) drawn 0%.
  - On a successful submit, the solid line draws over 900ms `power2.inOut`. Under reduced motion it simply appears.
- **`ContactForm.astro`** (`id="form"`):
  - Markup: `<form method="post" action={site.formEndpoint || 'mailto:office@kokreaters.com'} enctype={site.formEndpoint ? 'multipart/form-data' : 'text/plain'} novalidate data-form>`.
  - Fields follow 4.10:
    - Labels sit above the fields in sans 600 15px Ink.
    - Inputs are 48px tall (the textarea is auto) with a 10px radius, a 1px `--kk-field-border` border and a White background.
    - Focus uses the Cobalt 3px outline at 2px offset.
    - The select uses the native control with a custom chevron.
    - Errors: `aria-invalid="true"`, the border turns Coral, and `<p id="{name}-error" class="field-error">` holds the error icon and "Please fill this in so we can reply." (or invalidEmail), linked by `aria-describedby`.
  - The consent checkbox is 24px with a 44px hit area.
  - The honeypot is `<div class="hp" aria-hidden="true"><label>Website<input name="company_website" tabindex="-1" autocomplete="off"></label></div>`, positioned off-screen.
  - A hidden `started_at` field is set by JS.
  - Turnstile renders only if `site.turnstileSiteKey` is set. Its script is injected on the first focus inside the form, never on page load.
  - The submit is a primary Button "Send" (COMPOSED: the brief gives no submit label; C-16).
  - The status region is `<div role="status" aria-live="polite" data-form-status>`.
  - **There is no motion on the form ever**, except the connection line.
- Behaviour, in `contact.ts`:
  1. On submit: run the honeypot check, then the time trap (submits under 3s from load are silently "succeeded" and not sent).
  2. Run the required and email-format checks. On failure, mark the fields, focus the first invalid field, and stop.
  3. If an endpoint is set, `fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })` and set the Button to its loading state. A 2xx response shows the brief success message, resets the form and draws the connection line. Anything else shows the brief error message.
  4. With no endpoint, build `mailto:office@kokreaters.com?subject=Enquiry from {name}, {company}&body=` plus the field lines (URL-encoded), set `location.href`, and show `mailtoSent`.
  5. Auto-reply and the routing to office@ are configured at the endpoint provider (brief 9). Record that in the README.
- Without JS, the native post or mailto still works.

### 5.11 Legal `/privacy`, `/cookies`, `/terms` (`LegalLayout.astro`)
- White, single column, measure 66ch.
- Contents: a breadcrumb, a dateline "Legal", the h1 (title), "Last updated {date}" in meta, the review banner (4.14), then the body in `prose.css` legal mode (sans 17/28, h2 24/32 Fraunces).
- No CtaField; footer only.
- **The files are `.mdx`** (not `.md`), so `<Confirm/>` can be used inside them.

### 5.12 404 (`pages/404.astro`, `page="notfound"`, noindex)
- White, centred, `min-height: calc(100svh - header)`.
- **`Reconnect.astro`:**
  - A 360px SVG of the five-node **engraving**, a 1px Sapphire line-work drawing and not the coloured logo.
  - The top-right node (the Coral position, 398,213 in hero space, rescaled) is displaced 48px outward. Its line is drawn dashed (`stroke-dasharray: 4 6`).
  - The displaced node's dot is the site's only Sunrise fill: a 12px circle with `fill="url(#sunrise)"` (a linear gradient, the Sunrise stops).
  - The node is a focusable `<g tabindex="0" role="button" aria-label="Reconnect the node and go home">`.
- Below it:
  - the h1 "This page hasn’t been created yet."
  - the line "Let’s connect you back." in lead
  - a primary Button "Take me home" → `/`
- Interaction (`notfound.ts`):
  - Hover or focus on "Take me home" slides the node back along its line over 480ms `power2.inOut`, and the dash turns solid. Leaving reverses it.
  - On the node, Enter or Space reconnects it over 480ms, then navigates to `/` after 600ms.
  - Arrow keys move the node in 8px steps. Within 24px of its socket it snaps home and navigates.
  - On pointer devices, GSAP Draggable (`gsap/Draggable`, loaded only here) snaps it home on release within 24px and navigates.
  - Under reduced motion every move is instant. The drag still works, because it is user-initiated.

---

## 6. Motion system

### 6.1 Principles
- **Calm baseline:** UI states are 150–300ms with ease-out (brief 3.7). Reveals run once only. Nothing loops, drifts or follows the cursor.
- **Stillness:** after about 2.1s on home, nothing moves unless the reader scrolls or hovers. There is no ambient loop, so no pause button is needed (WCAG 2.2.2 is met by design).
- **Signature moments, and only these:**
  1. the hero bloom and dock
  2. the proof line and counts
  3. the scrubbed method line
  4. the About globe
  5. the contact connection line
  6. the 404 reconnect

  Everything else is the reveal grammar.
- **Never animated:** the H1 or the LCP, body copy after it reveals, the logo artwork (it only moves position in the dock), nav items, form fields, the founder photo, the page background, and buttons (no scale, no magnet).

### 6.2 Bootstrap: `src/scripts/motion/index.ts` (W1-motion)
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { createLenis } from './lenis';
import { initReveals } from './reveal';
import { initDraws } from './draw';
import { initCounts } from './countup';
import { initSplits } from './split';
import type { MotionContext } from './context';
import { initChrome } from '../chrome';
import { initConsent } from '../consent';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
const html = document.documentElement;
const pageModules = import.meta.glob<{ default: (ctx: MotionContext) => void | (() => void) }>('../pages/*.ts');

async function boot() {
  initChrome();            // header scroll state, expertise panel, mobile menu: runs in ALL modes
  initConsent();
  const page = document.body.dataset.page ?? '';
  const motionOK = html.classList.contains('motion') && !html.classList.contains('motion-failed');
  // fonts: wait for them (SplitText measures lines) but never longer than 600 ms
  await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]);
  const mm = gsap.matchMedia();
  const ctx: MotionContext = { gsap, ScrollTrigger, mm, lenis: null, reduced: !motionOK, page,
    isDesktop: window.matchMedia('(min-width: 1024px)').matches };
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
    const { motion } = c.conditions as { motion: boolean };
    ctx.reduced = !motion || html.classList.contains('motion-failed');
    if (!ctx.reduced) {
      ctx.lenis = createLenis();
      initSplits(ctx); initReveals(ctx); initDraws(ctx); initCounts(ctx);
    } else {
      html.classList.remove('motion');           // un-hide anything gated
    }
    return () => { ctx.lenis?.destroy(); ctx.lenis = null; };
  });
  const loader = pageModules[`../pages/${pageFile(page)}.ts`];
  if (loader) (await loader()).default(ctx);    // page module decides its own reduced branch
  html.classList.add('motion-booted');
  ScrollTrigger.refresh();
}
function pageFile(p: string) { return ({ home: 'home', pillar: 'expertise', expertise: 'expertise', industries: 'industries', approach: 'approach',
  impact: 'impact', insights: 'insights', article: 'article', about: 'about', contact: 'contact', notfound: 'notfound' } as Record<string,string>)[p] ?? '__none'; }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
```
Rules:
- Do not add `motion-booted` until the reveal triggers exist. If `motion-failed` was added before boot (the 3s timer), run nothing that hides content.
- Pages with no module are fine, because of `import.meta.glob`.
- Page modules must create their tweens inside `ctx.mm.add(...)` or check `ctx.reduced`.

`context.ts` exports the `MotionContext` interface: `{ gsap, ScrollTrigger, mm: gsap.MatchMedia, lenis: Lenis | null, reduced: boolean, page: string, isDesktop: boolean }`.

`tokens.ts` mirrors the CSS tokens:
```ts
export const D = { uiIn: .18, uiOut: .14, reveal: .48, lines: .72, rule: .5, swoosh: .9, connector: 1.2, dock: .64, count: .6 };
export const E = { uiIn: 'power1.out', reveal: 'power3.out', draw: 'power2.inOut', dock: 'power3.inOut', count: 'power2.out' };
export const START = 'top 85%';
```

### 6.3 Lenis (`lenis.ts`)
```ts
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function createLenis() {
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: false,
    anchors: { offset: -84 }, prevent: (n: Element) => !!n.closest('[data-lenis-prevent]') });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // keyboard-driven focus: let the browser scroll natively
  window.addEventListener('keydown', (e) => { if (e.key === 'Tab') lenis.stop(); }, { capture: true });
  window.addEventListener('pointerdown', () => lenis.start(), { capture: true });
  (window as any).__lenis = lenis;          // chrome.ts uses it to stop/start for the mobile menu
  return lenis;
}
```
Notes on Lenis:
- Touch uses native scroll.
- Lenis is never created under reduced motion. If the preference flips at runtime, matchMedia's cleanup destroys it.
- Hash links work through `anchors`. On load with a hash, call `lenis.scrollTo(hash, { immediate: true, offset: -84 })`.

### 6.4 The reveal grammar (`reveal.ts`, `split.ts`, `draw.ts`, `countup.ts`) and `motion.css`
`motion.css` gating applies only while motion is allowed and has not failed:
```css
html.motion:not(.motion-failed) [data-reveal]:not([data-reveal="lines"]) { opacity: 0; transform: translateY(12px); }
html.motion:not(.motion-failed) [data-reveal="lines"] { visibility: hidden; }   /* split.ts sets visible after split */
html.motion:not(.motion-failed) [data-rule] { transform: scaleX(0); transform-origin: 0 50%; }
html.motion:not(.motion-failed) [data-hero-hide] { opacity: 0; }
@media (prefers-reduced-motion: reduce) { html [data-reveal], html [data-rule] { opacity: 1 !important; transform: none !important; visibility: visible !important; } }
```

| Hook | Effect (default branch) | Reduced |
|---|---|---|
| `data-reveal` | `opacity 0→1, y 12→0`, 480ms `power3.out`, once, `start: 'top 85%'`. Siblings in a `data-reveal-group` stagger 60ms | visible; no animation |
| `data-reveal="lines"` (fold h2s only, **never the H1**) | `SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: self => gsap.from(self.lines, { yPercent: 100, duration: .72, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: el, start: START, once: true } }) })`; set `visibility: visible` in onSplit | not split |
| `data-rule` | `scaleX 0→1`, 500ms `power2.inOut`; in an index list stagger 60ms | drawn |
| `data-draw` on `path, line, circle, polyline` | `gsap.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', duration: el.dataset.drawDuration ?? .9, delay: el.dataset.drawDelay ?? 0, ease: 'power2.inOut', scrollTrigger: once })`. `data-draw-from="center"` uses `'50% 50%' → '0% 100%'` | untouched (ships drawn) |
| `data-swoosh` (RisingArrow root) | main path draws 900ms, head path fades in at 90% (120ms) | drawn |
| `data-frost` | an `::after` 1px Ice underline, `scaleX 0→1` 900ms `power2.inOut` on enter (class toggle `is-frosted`) | drawn |
| `data-count` | if `site.motion.proofCountUp`: `{v:0}` → `count` over 600ms `power2.out`, snapped to integers, writes `textContent`; triggered by the proof timeline, not by itself | final value |

`split.ts` runs after fonts are ready, and SplitText `autoSplit` re-splits on resize. Every ScrollTrigger is created with `once: true`, except the scrubbed method line, the article progress, the route rail and the globe.

### 6.5 Home: `pages/home.ts`, `hero.ts`, `dock.ts` (W2-home)

**Hero bloom** (`hero.ts`, graft 1; desktop and mobile; only when `!ctx.reduced`).
- Set the initial state before the first paint by marking these parts with `data-hero-hide` in markup:
  - branches at `drawSVG:0`
  - pillar nodes at `scale .6`, `opacity 0`
  - labels at `opacity 0`
  - stations at `opacity 0`
  - station lines at `drawSVG:0`
  - the swoosh at `drawSVG:0`
- The discs and cluster are never hidden.
- The timeline runs from `t=0` = fonts ready, capped at 600ms after DOMContentLoaded:

| t (ms) | Beat | Tween |
|---|---|---|
| 0 | B1 the logo lights | the 5 cluster node inner dots (`circle:nth-child(3)` of each node group) `opacity .35→1`, 220ms each, stagger 90ms, order Sapphire, Cobalt, Saffron, Sky, Coral. (Set `.35` at t=0 via `gsap.set` inside the timeline, so no-JS sees full colour.) |
| 420 | B2 the bloom | the 6 branches draw from the Saffron centre outwards (`drawSVG 0→100%`, 700ms `power2.inOut`, stagger 80ms, order Innovation, Process, Quality, Strategy, Deals, Capability). Each pillar node: when its branch reaches 85%, `scale .6→1, opacity 0→1`, 220ms `power1.out`, `transformOrigin: 'center'`, `svgOrigin`; its label then fades in, 200ms, +80ms |
| 1150 | B3 the swoosh | `RisingArrow` under "shared ambition" draws 900ms, head at 90% |
| 1300 | B4 the stations | the 3 station lines draw 500ms, then the dots fade in 200ms |
| ≈2100 | done | nothing loops |

- On hover or focus of "Explore our expertise", the six pillar rings pulse their outer ring stroke-width `1→2.5→1` over 180ms each, stagger 60ms. This is the one hover beat, from Network B6.
- No drift. No cursor attraction.

**The dock** (`dock.ts`, graft 1). It runs only at ≥ 1024px, without reduced motion, and only on home.
- A ScrollTrigger on the hero: `start: 'top top'`, `end: 'bottom 40%'`, with `onLeave` → dock() and `onEnterBack` → undock(). It fires once in each direction and is **not scrubbed**.
- `dock()`:
  1. The pillar layer, branches, stations and labels fade to 0 and undraw (DrawSVG `100%→0`, reversed stagger 40ms) over 360ms.
  2. Make a fixed-position clone of the hero's nested cluster `<svg>` at its current rect (`getBoundingClientRect`, `position: fixed; z-index: 60; pointer-events: none`). Hide the original with `opacity: 0`.
  3. `Flip.fit(clone, '[data-dock-slot] svg', { duration: .64, ease: 'power3.inOut', absolute: true })`, with `onComplete`: set the slot to `visibility: visible` and remove the clone.
- `undock()` is the reverse: hide the slot, clone it from the slot rect, Flip.fit back to the hero rect, then show the original and replay the bloom quickly (all beats at 0.4 duration).
- If the page loads already scrolled past the hero (`scrollY > hero.bottom * .6`), show the slot immediately and dock without animation.
- Below 1024px, or under reduced motion, the header slot is always visible (CSS 3.2).
- Flip is imported dynamically (`await import('gsap/Flip')`) inside `dock.ts`, so it never blocks the hero.

**Proof band** (`home.ts`, graft 2):
- One timeline, triggered at `top 70%` once.
- `[data-proof-line]` draws left to right over 1200ms `power2.inOut`. Each `[data-proof-node]` lights when the line passes its x fraction (`position = 1.2 * (nodeX / lineWidth)`): the ring `scale .6→1` over 220ms and the fill Imperial→Saffron.
- At the same moment its numeral counts (`data-count`, 600ms) if the flag is on, and otherwise fades `opacity 0→1` over 400ms. The "WHO" column fades in over 400ms.
- Labels fade with their numeral.
- Reduced motion: everything is static and final.

**Method line** (`home.ts`; `approach.ts` reuses the same function from `src/scripts/pages/home.ts` export `initMethodLine(root, ctx)`):
- A ScrollTrigger with `trigger: fold`, `start: 'top 70%'`, `end: 'bottom 60%'`, `scrub: 0.6`.
- It tweens `drawSVG 0→100%` on the line. Each ring's inner dot gets `opacity 0→1, scale 0→1` when progress crosses its fraction (0, 0.5, 1). Use `onUpdate` with thresholds rather than separate triggers.
- At 100% the arrow head fades in.
- Reduced motion: the line is drawn and the rings are filled.
- Vertical orientation below 768px uses the same code with `drawSVG` on the vertical path.

**The rest of home:** the reveal grammar only, plus the founder ring draw (`data-draw` with `data-draw-duration="1.2"`) and the CTA terminal sequence. The CTA terminal sequence belongs to `CtaField` and lives in `reveal.ts` as the `data-cta` hook, because the CTA appears on many pages:
- the line draws over 600ms
- the node goes `scale .6→1` over 220ms
- the swoosh draws over 900ms

### 6.6 Expertise and industries (`expertise.ts`, `industries.ts`)
- **Pillar map:** the five lines draw out from the current node over 700ms, stagger 80ms, on load. It is above the fold, but the lines are decorative and hidden through `data-hero-hide`.
- **Hover links:** a CSS stroke colour change over 300ms.
- **Help list connector:** `data-draw` over 900ms.
- **Industries:** an IntersectionObserver (`rootMargin: '-40% 0px -55% 0px'`) sets `aria-current` on the sector index. CSS moves the bar.

### 6.7 Insights and article (`insights.ts`, `article.ts`)
- **Filters:** un-hide the controls, read the query, and apply the filter. On change:
  1. `const state = Flip.getState('.insight-row')`
  2. toggle `hidden` on the rows
  3. `Flip.from(state, { duration: .4, ease: 'power2.inOut', absolute: true, onEnter: els => gsap.fromTo(els, {opacity:0},{opacity:1,duration:.2}), onLeave: els => gsap.to(els,{opacity:0,duration:.15}) })`
- Under reduced motion the change is instant. Flip is dynamically imported, so it is only on /insights.
- **Article progress:** `gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.prose', start: 'top top+=72', end: 'bottom bottom', scrub: true } })`. Under reduced motion the element is hidden and a "{n} min left" text updates on scroll, throttled to rAF.
- **Route rail:** an IntersectionObserver on the h2s sets the active node. The Sapphire segment height is scrubbed like the progress bar.
- **Exhibits:** `ProcessChain` lines use `data-draw`.

### 6.8 The one Three.js scene: the engraved globe, About only (W3-globe; `src/scripts/globe/loader.ts` + `scene.ts`)
**Gate** (`loader.ts`, called from `pages/about.ts`). All of these must hold:
- `!ctx.reduced`
- `matchMedia('(min-width: 1024px)')` matches
- `navigator.hardwareConcurrency >= 4`
- WebGL2 is available (test with `document.createElement('canvas').getContext('webgl2')`, then release it)
- `navigator.connection?.saveData !== true`

Loading:
- An `IntersectionObserver` with `rootMargin: '150% 0px'` on `[data-globe]` triggers the load.
- After `requestIdleCallback` (falling back to a 200ms timeout), run `const { mountGlobe } = await import('./scene')`.
- If any gate fails, the static SVG simply stays. **Mobile, reduced motion and no-JS never download three.js.**

**Scene** (`scene.ts`). Imports are named only: `WebGLRenderer, Scene, OrthographicCamera, Group, BufferGeometry, Float32BufferAttribute, LineSegments, Line, LineBasicMaterial, LineDashedMaterial, Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Sprite, SpriteMaterial, CanvasTexture, Color`.
- **Renderer:**
  - `new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })`
  - `setPixelRatio(Math.min(devicePixelRatio, 1.5))`
  - a transparent clear colour
  - The canvas is inserted into `[data-globe]` over the static SVG. The SVG gets `opacity: 0` only after the first render succeeds.
- **Camera:** `OrthographicCamera(-1.15, 1.15, 1.15, -1.15, 0.1, 10)` at z=3.
- **Geometry.** Unit sphere, with `vec(lat,lon) = (cosφ·sinλ, sinφ, cosφ·cosλ)`.
  - **Occluder:** a `Mesh(SphereGeometry(0.995, 48, 32), MeshBasicMaterial({ colorWrite: false }))`, so back-side lines are hidden by the depth test.
  - **Graticule:** 18 meridians and 9 parallels as one `LineSegments` in `#E4E0EE` at opacity 1, sampled every 3°.
  - **Coastlines:** `src/data/globe/coast.json` (from `build-globe.mjs`: world-atlas `land-110m`, simplified to ≤ 8KB, as `[[lon,lat],…][]`) as `LineSegments` in Graphite `#4A5068` at opacity 0.4.
  - **Places:** 8 `Sprite`s with a CanvasTexture ring (64px canvas: a 1.5px Sapphire ring at r=10 with a White fill and a 6px Sapphire dot), scale 0.045.
  - **Arcs:** 7 great-circle arcs between consecutive places (slerp, 64 points, lifted `r = 1 + 0.06·sin(πt)`) as `Line` with `LineBasicMaterial({ color: '#2C509E' })`. Each arc's draw progress uses `geometry.setDrawRange(0, n)`.
- **Labels:** HTML spans in `<div class="globe__labels" aria-hidden="true">`, positioned each render by projecting the place vector. A label is hidden when `dot(rotated normal, camera dir) < 0.15`. The text is the place name in meta Ink. The `<ol>` already gives the accessible equivalent.
- **Scroll scrub:**
  - `ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8, onUpdate: s => setProgress(s.progress) })`.
  - `setProgress(p)` sets `globe.rotation.y = -lerp(78°, 5°, ease(p))` (India to the Netherlands) and `globe.rotation.x = lerp(20°, 45°, ease(p))`, in Euler order XYZ.
  - Arc i draws over the `p` window `[i/8, (i+1)/8]`.
  - **Render on demand only:** `renderer.render()` is called inside `setProgress` and on resize. There is no rAF loop, so it is idle at zero cost.
- **Pointer:** none.
- **Teardown:** dispose geometries, materials, textures and the renderer, call `forceContextLoss()`, and kill the trigger. It runs on `pagehide`, when the section leaves by more than 2 viewports (IntersectionObserver `rootMargin: '200% 0px'`, remounting on re-entry), and on the matchMedia flip to reduced motion.
- **Budget:** three.js plus the scene ≤ 170KB gzip, lazy, on About only. CI checks that no `three` chunk is referenced from any other page's HTML.

**Static fallback:**
- `build-globe.mjs` uses `d3-geo` `geoOrthographic().rotate([-5, -45])` (Netherlands-facing, the scene's final state) to write `src/assets/globe/globe-static.svg`: graticule, coast, all 7 arcs drawn and 8 rings, viewBox 0 0 600 600, ≤ 16KB, with strokes as in the scene.
- It uses **the same data and projection as the scene**. That makes it the "offline still" of graft 12, done without Puppeteer.

### 6.9 About, contact, 404
- **About:** the timeline line `data-draw` runs 1200ms, and the rings fill as the line passes (staggered by position). The portrait, bio and name panel use the reveal grammar only.
- **Contact:** `ConnectionMoment` draws only on success (5.10). The Name label updates on `input`, throttled.
- **404:** see 5.12. Draggable is dynamically imported.

### 6.10 JS budget (gzip; CI-enforced in W3-tests)

| Page | Budget |
|---|---|
| home, initial | ≤ 95KB: gsap core about 27, ScrollTrigger about 18, SplitText about 6, DrawSVG about 3, Lenis about 4, site about 12, Flip about 9 loaded after the hero timeline |
| other pages | ≤ 85KB |
| /insights | + Flip |
| /about | + three.js chunk ≤ 170KB (lazy) |
| 404 | + Draggable |

---

## 7. Assets mapping

Source folder: `/home/aryan-budukh/Desktop/ganeshkaka-folder/assets`.
- `scripts/prepare-brand.mjs` reads these sources by absolute path, through the `ASSETS_DIR` constant (default `../assets` relative to `web/`).
- It writes the outputs listed below. It is idempotent, and its outputs are committed. It **does not modify** the source files.
- After running it, the owner unit checks every output image visually with the Read tool and adjusts the crop rectangles if a crop clips the artwork.

| Source | Output | Processing (sharp) | Used by |
|---|---|---|---|
| `logo/kokreaters-logo-full-transparent.png` (2213×604, RGBA) | `src/assets/brand/wordmark.png` | `extract({ left: 675, top: 30, width: 1510, height: 322 })` → `.trim()` → keep RGBA. This is the wordmark plus rising arrow, **no tagline** (the horizontal lockup, brief 3.1). Verify that no tagline pixels remain at the bottom right ("Create" starts at about y=370) | Header `Logo`, rendered by `<Picture>` at 120px wide, `widths={[120, 240]}`, formats avif, webp, png |
| same | `src/assets/brand/wordmark-white.png` | the wordmark crop recoloured to `#FFFFFF`, keeping alpha (`.ensureAlpha()`, then `.composite` with a white image under `dest-in`, or `extractChannel('alpha')` + `joinChannel` onto a white RGB). This is the reversed version. CONFIRM 1 Not used on the site at launch (the mobile menu sits on Cloud and uses the positive version). Kept for any horizontal lockup on Imperial and for OG images |
| `logo/kokreaters-wordmark-tagline-raster.png` (1613×604) | `src/assets/brand/lockup-tagline.png` and `lockup-tagline-white.png` | `.trim()`; the white version recoloured as above | Footer full reversed lockup (white), next to the `NodeCluster` SVG |
| `logo/kokreaters-logo-full-transparent.png` | `src/assets/brand/logo-full.png` | `.trim()` only | About `NamePanel` at 220px (`<Image widths={[220,440]}>`) |
| `logo/kokreaters-node-cluster.svg` | inlined into `NodeCluster.astro` and `Engraving.astro` (geometry); `public/favicon.svg` | Favicon SVG: the same file with its viewBox kept, discs kept, the `<!-- -->` comment removed, and `role/aria` attributes removed | Header, footer, hero, engravings, 404, favicon |
| `logo/kokreaters-node-cluster.svg` | `public/favicon-32.png`, `public/apple-touch-icon.png` (180, on a White square with 12% padding), `public/icon-512.png`, `public/brand/kokreaters-logo-512.png` | `sharp(svgBuffer, { density: 384 }).resize(n, n, { fit: 'contain', background: '#ffffff00' })` (apple-touch gets a White background) | Head icons, manifest, JSON-LD logo |
| `photos/ganeaysh-portrait-1665x2048.png` | `src/assets/photos/ganeaysh-portrait.png` (4:5) | `extract({ left: 252, top: 0, width: 1016, height: 1270 })`. This **excludes the lapel pin**, which sits at about x 1090–1130, y 1300–1352 (it may be a former-employer mark, C-17). Do not retouch; crop | About hero `<Picture widths={[360,480,720,960]} formats={['avif','webp']}>` |
| same | `src/assets/photos/ganeaysh-square.png` (1:1) | `extract({ left: 260, top: 150, width: 1050, height: 1050 })`, which also excludes the pin. Verify the pin is absent | Home founder circle (300px), article byline (40px), author box (72px), contact person node (48px) |
| `photos/ganeaysh-avatar-640.png` | **not used** | It contains the lapel pin inside the circle area | — |
| `brief/kokreaters-logo-full.png` | not used (white background; the transparent version replaces it) | — | — |
| `logo/kokreaters-node-cluster-raster.png` | not used (the SVG replaces it) | — | — |
| `brief/brief-homepage-wireframe.png` | not shipped; reference only (section order) | — | — |
| world-atlas `land-110m.json` (npm, Natural Earth, public domain) | `src/data/globe/coast.json`, `src/assets/globe/globe-static.svg` | `build-globe.mjs` (6.8) | About globe |

Image rules:
- Every raster is shipped through `astro:assets` (`<Picture>` or `<Image>`, the sharp service), with explicit width and height, `decoding="async"`, and `loading="lazy"` except the About portrait.
- AVIF is the first source and WebP the second; PNG is the fallback only for the wordmark.
- **The wordmark is raster only.** Never retype it in a font, never redraw it, and always render it at 2x density. A vector logo is CONFIRM 1. When it arrives, swap `Logo.astro` internals only.
- Logo clear space: a margin equal to the yellow centre node height (about 0.19 × the cluster height) on all sides. `Logo.astro` adds `padding: 0.19em` scaled per size.
- Never recolour the nodes, stretch, rotate, shadow or outline the logo. No logo sits on photos.
- Alt text:
  - The portrait is "Ganeaysh Kulkarni, founder of KoKreaters".
  - Logo images inside a labelled link get `alt=""`.
  - The standalone full lockup gets `alt="KoKreaters: Connect · Collaborate · Create"`.
- Photography (graft 13): there is none at launch. `Industry.image` and the insight `image` fields stay empty until licensed material photography exists. No stock people, ever.

---

## 8. Open-items log (conservative default taken in each case)

### 8.1 The brief's `[CONFIRM]` items (section 11 numbering)

| # | Item | Default shipped | Where |
|---|---|---|---|
| 1 | Vector logo and reversed version | The node cluster uses the rebuilt SVG (a draft rebuilt from the raster). The wordmark is the transparent PNG crop at 2x. The reversed version is made by recolouring that raster to white. A swap point exists in `Logo.astro` | header, footer, About |
| 2 | Headline A/B/C | **Option A**, "Where deep expertise meets shared ambition." (the brief's recommendation) | home hero |
| 3 | Professional portrait session | The studio headshot is used, cropped to exclude the lapel pin. There is no environmental portrait; no image appears where one would go | home, About, articles |
| 4 | Founder quote wording | The brief's wording, verbatim, with a Confirm marker in staging | home fold 9 |
| 5 | Naming companies or logos | Former employers appear only as plain words, exactly as the brief uses them (datelines, bio). There are **no client names and no logos**. "Worked with" stays as sectors only | impact, about |
| 6 | Client consent for the anonymised Indian engagements | Not shown in production. Shown in staging with "Pending client consent". The European minerals engagement is **also** held as pending (C-12) | /impact |
| 7 | CBE wording | The brief's wording is kept as a **service** ("Specialty fats: cocoa butter equivalents (CBE)…"). It never appears as a past result | pillar 1, industries |
| 8 | Testimonials | None. The slot renders nothing | /impact |
| 9 | Public email, reply-time promise, booking tool, free first call | office@kokreaters.com. The "one working day" promise is kept, because it is brief copy. The booking URL is unset, so "Book a 30-minute call" goes to `/contact#form`. "The first conversation is on us" is kept, with a Confirm marker | contact, CTA, site.ts |
| 10 | Engagement models and durations | The brief table is verbatim. The step details (what we do, what you get, duration) are left empty: Confirm in staging, omitted in production | /approach |
| 11 | Legal entity, KvK, VAT, address | Not shown. The footer shows a Confirm marker in staging and nothing in production. Legal pages carry the Confirm placeholders | footer, legal |
| 12 | Trademark status | ™ in the footer only. Never ® | footer |
| 13 | "Founded in 2026" and career dates | Shown as in the brief, with a Confirm marker in staging. JSON-LD `foundingDate: 2026` | About, JSON-LD |
| 14 | First two Insights drafts | Two ~900-word DRAFTs, written to the brief's voice and facts with no invented numbers, review pending. Production lists them only after `review: approved`. Four titles are "In preparation" with no pages | /insights |

Further brief-level defaults:
- The analytics tool is **none**.
- Cookies: essential only, with no banner until analytics exists (3.6).
- Turnstile is off unless a site key is given; the honeypot and time trap are always on.
- Newsletter: no provider, so the mailto fallback is used.
- Domain: the bare `kokreaters.com` is canonical. The misspelling domains are out of scope.

### 8.2 Decisions this spec adds (C-numbers; each needs Ganeaysh’s or the owner’s sign-off)

| C | Decision | Conservative default |
|---|---|---|
| C-1 | Instrument Sans in place of Plus Jakarta Sans | Instrument Sans. A one-token swap reverts it |
| C-2 | Darkened chip text for Orchid and Mauve on Blush (`#A2335F`, `#6F4470`) | Used **only** as chip text, to pass AA. The brand hexes are unchanged |
| C-3 | Bare domain canonical, `trailingSlash: never` | Yes |
| C-4 | CMS: MDX files in Git now; Keystatic/Decap or Sanity later | Files now. README explains how to edit them |
| C-5 | Industries added to the footer "Company" column | Added |
| C-6 | No cookie banner while there is no analytics | No banner. "Cookie settings" is always in the footer |
| C-7 | Organisation `sameAs` is empty until a LinkedIn company page exists | Empty |
| C-8 | Pillar → founder-result mapping: Innovation→India, Process→Ukraine, Food safety→WHO/iTFA, Capability→Indonesia, Strategy and Deals→none | As listed |
| C-9 | Case fields the brief does not give (challenge for India, Indonesia and WHO) | Left empty. Nothing is written |
| C-10 | Industry → pillar links | The 4.5 table |
| C-11 | Expansions of iTFA ("industrially produced trans-fatty acids"), 3-MCPD, GE, DAG and FFA | Standard definitions, shown as sidenotes |
| C-12 | All three anonymised engagements held as pending | Yes |
| C-13 | Globe arcs follow the brief's place order; no chronology is implied | Yes |
| C-14 | `[AUTHOR CHECK]` points in the two drafts (regulatory limits, declaration rules) | Visible in staging only |
| C-15 | Industries page has no intro lead | None |
| C-16 | Contact submit label "Send" | "Send" |
| C-17 | Portrait lapel pin | Cropped out; no retouching |
| C-18 | Count-up on the proof integers | On, 600ms, integers only (brief 3.7). `site.motion.proofCountUp=false` turns it off |
| C-19 | Gradients: none on UI; Aurora/Twilight only on OG images, Sunrise only as the 404 dot | Yes (VERDICT) |
| C-20 | WebGL on About (globe), not home | Yes (VERDICT owner decision 1) |
| C-21 | Filled discs only in the hero and behind the founder portrait; hairline outlines elsewhere | Yes (graft 7) |

### 8.3 COMPOSED labels (not in the brief; listed so Ganeaysh can approve them)
- "Skip to content", "Menu", "Close"
- "Our promise" (folio), "Founder" (folio), "From our founder’s career" used as the proof folio (brief phrase)
- "Featured insight", "All expertise", "In preparation", "Related insights", "Relevant expertise", "Key takeaways", "Exhibit", "Source", "On this page"
- The pillar short labels (Product, Process, Food safety, Strategy, Deals, Capability) and the hero node labels
- "Send", "Please enter an email address we can reply to.", the mailto-sent message, "You" (the connection-moment fallback)
- "Cookie settings", "Essential: always on", "Analytics: not in use on this site", and the newsletter consent sentence
- "DRAFT for Ganeaysh’s review", "Pending client consent", "{n} min read", "{n} min left", "{n} insights"
- "Reconnect the node and go home"
- The legal review banner text and all placeholder legal text
- The COMPOSED SEO rows in 3.8

---

## 9. Parallel build order

Rules for every unit:
1. Read sections 0–8 first.
2. Write only the files you own. Within a wave, file sets are disjoint. A later wave may edit an earlier wave's files only where its unit says so.
3. Write files with Bash heredocs.
4. Use exactly the prop interfaces, data shapes, CSS tokens and `data-*` hooks named here. Units in the same wave build against these contracts, not against each other's code.
5. Only **W1-scaffold** runs `npm install`. Other units in wave 1 must not touch `package.json`. If they need to verify while `node_modules` is missing, they wait for it (poll `test -x web/node_modules/.bin/astro`) and must not install anything themselves.
6. **Wave gate:** at the end of each wave, the orchestrator or the last unit to finish runs `cd web && npm run build && npx astro check`. Both must pass, with 0 errors, before the next wave starts.
7. Screenshots go to `/home/aryan-budukh/Desktop/ganeshkaka-folder/research/shots/build/` as `{route}-{width}.png`, using `/usr/bin/google-chrome --headless=new --no-sandbox --hide-scrollbars --virtual-time-budget=8000 --window-size=W,H --screenshot=…`.

### Wave 1: foundation (5 units, in parallel)

**W1-scaffold** (owner: `scaffold`)
- Files:
  - `web/package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env.example`, `README.md`
  - `src/env.d.ts`
  - `src/styles/{global,fonts,tokens,reset,base,layout,utilities,prose}.css`
  - `scripts/copy-fonts.mjs`
  - `public/site.webmanifest`
  - stub `src/pages/index.astro`
- Task:
  - Create the Astro 7 project by hand, with no create-astro prompts, and run `npm install`.
  - Implement all tokens and type and layout classes exactly as in section 1.
  - `copy-fonts.mjs` copies the three woff2 files to `public/fonts`.
  - The stub index renders a type specimen of every `.t-*` class on the tokens. Wave 2 replaces it.
- Depends on: nothing.
- Acceptance:
  - `npm run build` passes.
  - `dist/fonts/` holds the three woff2 files.
  - `grep -c -- '--fs-' src/styles/tokens.css` ≥ 16.
  - The specimen screenshot at 1440 and 390 shows Fraunces and Instrument Sans, not fallbacks. Check via `document.fonts.check('16px Fraunces')` in a Playwright one-off, or visually.
  - No horizontal scroll at 360px.

**W1-content** (owner: `content`)
- Files:
  - `src/config/site.ts`
  - `src/lib/{mode,format,reading-time,pillars,insights,seo,typography}.ts`
  - `src/data/{types,home,pillars,industries,impact,approach,founder,contact,microcopy,seo,nav,places}.ts`
  - `src/content.config.ts`
  - the six `src/content/insights/*.mdx`
- Task:
  - Transcribe every string from section 4, verbatim. The two drafts must be **exactly** the text in 4.13.
  - Stubs carry frontmatter only.
  - `lib/typography.ts` exports `minus25 = '−25 °C'`, plus a `fig()` helper that wraps emphasis substrings.
  - `lib/seo.ts` exports `pageSeo(key)` and `assertLengths()`.
- Depends on: the scaffold's tsconfig paths, by contract.
- Acceptance:
  - A node script, or `astro check`, confirms the six pillars, nine industries, four results, three engagements (all pending), five principles, five models and the 4/14 timeline items.
  - Titles are ≤ 60 and descriptions ≤ 155, asserted in `lib/seo.ts`.
  - `grep -ri "world-class\|cutting-edge\|leverage\|synerg" src/content` finds only the brief's own "world-class integrated specialty fats facility" phrase.
  - There are no `Wilmar`/`Cargill` mentions outside datelines, bio and impact contexts.
  - Spelling is "KoKreaters" everywhere.

**W1-brand** (owner: `brand-ui`)
- Files:
  - `scripts/prepare-brand.mjs`, `scripts/build-globe.mjs`
  - `src/assets/**` (generated)
  - `src/data/globe/coast.json`
  - `public/{favicon.svg,favicon-32.png,apple-touch-icon.png,icon-512.png}`, `public/brand/kokreaters-logo-512.png`
  - `src/components/brand/*`, `src/components/ui/*`, `src/components/shared/*`
- Task:
  - Generate all assets per section 7, and Read each output image to verify it.
  - Build every component in 5.0 with the stated props and `data-*` hooks. Shared sections import their data types from `@/data/types`.
- Depends on: the scaffold (needs sharp installed, so it waits for `node_modules`); W1-content types, by contract.
- Acceptance:
  - The portrait crops show **no lapel pin** (verified visually).
  - The wordmark crop has no tagline.
  - `globe-static.svg` is ≤ 16KB.
  - Every component renders correctly on a scratch page `src/pages/kit.astro`, checked through the dev server with a screenshot. **Delete `kit.astro` before the unit finishes**, so it never ships.
  - Saffron and Sky dots carry the Ink ring.
  - Every arrow is SVG, and there are no `→` glyphs in rendered UI text.

**W1-chrome** (owner: `chrome-seo`)
- Files:
  - `src/layouts/BaseLayout.astro`, `src/layouts/LegalLayout.astro`
  - `src/components/chrome/*`, `src/components/seo/*`
  - `src/scripts/chrome.ts`, `src/scripts/consent.ts`
  - `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`
- Task: sections 3.1–3.9 in full: header, expertise panel, mobile menu, footer, skip link, consent, SEO head, JSON-LD builders, robots and llms.
- Depends on: W1-brand components (`Logo`, `Button`, `PillarDot`, `Newsletter`, `CtaField`), W1-content data and W1-motion's import path, all by contract.
- Acceptance:
  - Keyboard: Tab reaches the skip link first. The Expertise panel opens with Enter, closes with Esc, and returns focus. The mobile menu traps focus and sets `inert`.
  - One `<header>`, one `<nav aria-label="Main">`, one `<main id="main">` and one `<footer>`.
  - JSON-LD parses (`JSON.parse`) on the stub home.
  - Staging robots.txt disallows.
  - llms.txt lists the six pillars.
  - With `PUBLIC_ANALYTICS` unset, no banner appears and no localStorage is written on load.

**W1-motion** (owner: `motion-core`)
- Files: `src/scripts/motion/{index,tokens,lenis,reveal,draw,countup,split,context}.ts`, `src/styles/motion.css`.
- Task: sections 6.2–6.4, the reduced-motion branch, the failure timer contract, the CTA `data-cta` sequence and the `import.meta.glob` page registry.
- Depends on: the scaffold.
- Acceptance:
  - On the stub page with `data-reveal`, `data-rule`, `data-draw` and `data-count` samples:
    - content is visible with JS disabled
    - content is visible under `--force-prefers-reduced-motion` with no Lenis instance (`window.__lenis` is undefined)
    - content animates once by default
  - If the bundle is blocked, the content is visible after 3s.
  - No console errors.

### Wave 2: pages (6 units, in parallel)

**W2-home** (owner: `home`)
- Files: `src/pages/index.astro` (replaces the stub), `src/components/home/*`, `src/scripts/pages/{home,hero,dock}.ts`.
- Task: 5.1 and 6.5, including the hero bloom, the dock (Flip), the proof line and counts, the method scrub (export `initMethodLine`), and the founder ring.
- Depends on: wave 1.
- Acceptance:
  - The H1 is visible in the first paint, and the screenshot at `--virtual-time-budget=0` shows it.
  - The network ships fully drawn with JS off.
  - The bloom completes by about 2.1s, and no rAF runs after about 2.5s (check with the Performance API or `gsap.globalTimeline.getChildren().filter(t=>t.isActive())`).
  - At ≥ 1024px, scrolling past the hero docks the cluster into the header slot, and scrolling back undocks it.
  - Reduced motion: no dock, the slot is visible and the method line is drawn.
  - Server-rendered word count is ≥ 800 (`textContent` of `main`).
  - Exactly one `h1`.

**W2-expertise** (owner: `expertise-industries`)
- Files: `src/pages/expertise/index.astro`, `src/pages/expertise/[slug].astro`, `src/pages/industries.astro`, `src/components/expertise/*`, `src/components/industries/*`, `src/scripts/pages/{expertise,industries}.ts`.
- Task: 5.2–5.4 and 6.6.
- Depends on: wave 1.
- Acceptance:
  - Six pillar pages build at the brief slugs.
  - Each pillar page has the pillar colour only in the bar, dot, bullets, map node and chips.
  - The PillarMap nav has five real links.
  - Industry anchors work with the header offset.
  - The sector index `aria-current` updates on scroll.

**W2-approach-impact** (owner: `approach-impact`)
- Files: `src/pages/approach.astro`, `src/pages/impact.astro`, `src/components/approach/*`, `src/components/impact/*`, `src/scripts/pages/{approach,impact}.ts`.
- Task: 5.5–5.6. Reuse `initMethodLine` from `scripts/pages/home.ts` by import.
- Depends on: wave 1; `initMethodLine` is a W2-home export by contract, so if it is missing at test time, stub-import guard with optional chaining.
- Acceptance:
  - The engagement table is a semantic `<table>` with `<th scope>`.
  - In production mode (`npm run build:prod`), no Confirm markers and no pending engagements appear in `dist/impact.html` or `dist/approach.html`.
  - The −25 °C figure has the frost tick.
  - There is no count-up.

**W2-insights** (owner: `insights-article`)
- Files: `src/pages/insights/index.astro`, `src/pages/insights/[slug].astro`, `src/layouts/ArticleLayout.astro`, `src/components/insights/*`, `src/components/article/*`, `src/scripts/pages/{insights,article}.ts`. It may append article rules to `src/styles/prose.css`.
- Task: 5.7–5.8, 6.7, and the article JSON-LD and BreadcrumbList.
- Depends on: wave 1.
- Acceptance:
  - Staging builds two article pages with DRAFT ribbons. Production builds zero and still renders the hub with "In preparation" and the newsletter.
  - Filters work without page reload, the URL state round-trips, and the control is hidden with no JS.
  - The route rail shows at ≥ 1280px.
  - Exhibits have a figure and figcaption, and the table has headers.
  - The article body measure is ≤ 64ch.

**W2-about** (owner: `about`)
- Files: `src/pages/about.astro`, `src/components/about/*` (including `GlobeSection.astro` with the static SVG and the `data-globe` mount), `src/scripts/pages/about.ts` (timeline, plus `import('../globe/loader').then(m=>m.initGlobe?.(ctx)).catch(()=>{})`, which W3-globe fills).
- Task: 5.9, and the 6.9 About part.
- Depends on: wave 1.
- Acceptance:
  - Person JSON-LD is present.
  - The portrait renders as AVIF with the half-stadium mask, and the pin is absent.
  - The static globe and the `<ol>` of 8 places are present.
  - The full lockup is at 220px.
  - The timeline is horizontal at ≥ 768px and vertical below.

**W2-contact** (owner: `contact-404-legal`)
- Files: `src/pages/contact.astro`, `src/pages/404.astro`, `src/pages/{privacy,cookies,terms}.mdx`, `src/components/contact/*`, `src/components/notfound/*`, `src/scripts/pages/{contact,notfound}.ts`.
- Task: 5.10–5.12, 4.14 and 6.9.
- Depends on: wave 1 (`LegalLayout` from W1-chrome).
- Acceptance:
  - Submitting empty shows inline errors with the brief text, and the first invalid field gets focus.
  - With an endpoint unset, the mailto opens with all fields.
  - With `PUBLIC_FORM_ENDPOINT=https://httpbin.org/status/200`, the form shows the success message and the line draws. If network tests are not allowed, mock `fetch` in Playwright.
  - The honeypot filled means nothing is sent.
  - On the 404, the node is keyboard-operable, Enter navigates home, and "Take me home" works.
  - The legal pages show the review banner.

### Wave 3: signature, verification and polish (4 units, in parallel)

**W3-globe** (owner: `globe-webgl`)
- Files: `src/scripts/globe/{loader,scene}.ts`. It may edit `src/components/about/GlobeSection.astro` (CSS and mount markup only).
- Task: 6.8.
- Depends on: W2-about.
- Acceptance:
  - At 1440, with motion, the canvas mounts and scrolling rotates it from India to the Netherlands with the arcs drawing in sequence.
  - The rAF count is zero when idle.
  - At 390, under reduced motion, or with WebGL disabled (`--disable-webgl`), no three chunk is requested (network log) and the static SVG shows.
  - The three chunk is ≤ 170KB gzip.
  - No WebGL context leaks after navigating away and back three times.

**W3-og-seo** (owner: `og-seo`)
- Files: `scripts/og.mjs`, `scripts/og/template.html`, `public/og/*.png`. It may edit `src/data/seo.ts` (og keys only) and `src/components/seo/SeoHead.astro` (og:image wiring only).
- Task:
  - Render one 1200×627 PNG per key: home, expertise, each of the six pillars, industries, approach, impact, insights, about, contact, each visible article, and default.
  - Use headless Chrome on `template.html`, loading `/fonts/*.woff2` from `web/public`.
  - Design: a Twilight gradient (allowed off-site), the title in Fraunces 330 64px White, the `NodeCluster` at 120px bottom-right, "kokreaters.com" in Instrument Sans 600 Lavender, and 72px padding.
  - Validate every page's JSON-LD with a script (parse plus required fields per type), and check canonical, OG and the sitemap.
- Depends on: wave 2.
- Acceptance:
  - Every built HTML has a unique title and description, a canonical, and an `og:image` that exists in `dist`.
  - The sitemap lists every route except 404.
  - In production, no drafts appear in sitemap or llms.

**W3-tests** (owner: `tests-budget`)
- Files: `playwright.config.ts`, `lighthouserc.json`, `tests/*.spec.ts`, `scripts/csp-hash.mjs`, `scripts/check-budget.mjs`, `public/_headers`.
- Task:
  - **smoke**: every route returns 200 from `astro preview`, has exactly one h1, and has no console errors.
  - **a11y**: `@axe-core/playwright`, with zero violations, on every route at 1440 and 390.
  - **reduced-motion**: `reducedMotion: 'reduce'` screenshots of every route, asserting no element with `opacity:0` inside `main`.
  - **responsive**: at 360, 768, 1024, 1280 and 1440, `scrollWidth <= innerWidth`.
  - **seo**: title and description lengths, one canonical, and JSON-LD parse.
  - **Keyboard**: from any route, /contact is reached in ≤ 2 actions (header CTA).
  - **Budgets**:
    - home total transfer ≤ 600KB (internal goal; the brief caps at 1.5MB)
    - home JS ≤ 95KB gzip, and ≤ 85KB on other pages
    - CSS ≤ 60KB
    - fonts ≤ 180KB
    - the three chunk is referenced only by about.html
  - **Lighthouse CI**: mobile on `/`, `/about` and one article, each ≥ 90 on all four categories, LCP ≤ 2.5s, CLS ≤ 0.1.
  - `csp-hash.mjs` writes `dist/_headers`.
- Depends on: wave 2.
- Acceptance: all suites run green, or produce a findings list handed to W3-polish. Use `channel: 'chrome'` with `/usr/bin/google-chrome` if no Playwright browser is downloaded.

**W3-polish** (owner: `visual-qa`)
- Files: may edit `src/styles/*`, `src/components/{home,expertise,industries,approach,impact,insights,article,contact,notfound,shared,ui,brand,chrome}/*`, and `src/components/about/*` except `GlobeSection.astro`.
- Task:
  - Screenshot every route at 390, 768, 1024, 1280 and 1440 (default and reduced motion) into `research/shots/build/`, and review them against sections 0–5 and the DNA bans.
  - Fix the following:
    - spacing rhythm (128/96/64)
    - widows (`text-wrap`)
    - optical alignment of datelines and hanging quotes
    - line lengths
    - contrast (keep the colour rules)
    - the header at 1024
    - CLS from font swap (tune the fallback `size-adjust`)
  - Fix W3-tests findings that fall in these files.
  - Do not add new motion, colour or copy.
- Depends on: wave 2. It runs alongside W3-tests and re-runs their suites at the end.
- Acceptance:
  - A screenshot set exists for every route at every width.
  - axe is clean.
  - No horizontal scroll.
  - The owner's "not template-looking" checklist holds: no card grids on home, no gradients on UI, one swoosh per page (plus the CTA), and pillar colours never more than two per viewport except on the index.

---

## 10. Running it, and the global acceptance gates

Run commands:
```bash
cd /home/aryan-budukh/Desktop/ganeshkaka-folder/web
npm install                 # once
npm run assets              # fonts + brand crops + globe data (idempotent)
npm run dev                 # http://127.0.0.1:4321  (staging mode: CONFIRM markers + drafts visible)
npm run build && npm run preview     # http://127.0.0.1:4322
npm run build:prod          # production mode check: no markers, no drafts, indexable
npm run verify && npm test && npm run lhci
```
When the last wave passes, the orchestrator runs `npm run build && npm run preview` (staging) and leaves it serving on 127.0.0.1:4322. That serves the user's "run it once done". The orchestrator then reports the URL.

Launch gates, from brief 10 and DNA 8:
- **Brand:** colours, type and logo usage match sections 1, 5 and 7. "KoKreaters" is spelt right everywhere.
- **Content:** all brief copy is in place, nothing is invented, and every COMPOSED string is listed in 8.3.
- **Responsive:** correct at 360, 768, 1024, 1280 and 1440, with no horizontal scroll.
- **Performance:**
  - LCP ≤ 2.5s mobile, with the H1 as the LCP element
  - CLS < 0.05 target (≤ 0.1 required)
  - INP ≤ 200ms
  - home ≤ 1.5MB, with an internal target of 600KB
  - Lighthouse ≥ 90 ×4 on home, About and one article
- **Accessibility:** WCAG 2.2 AA:
  - axe clean
  - keyboard walkthrough passes
  - focus always visible
  - 44×44 targets
  - text survives 200% zoom
  - `prefers-reduced-motion` honoured on every route
  - no content hidden without JS
- **SEO:**
  - titles and descriptions per 3.8
  - one H1 per page
  - JSON-LD per 3.7
  - sitemap, robots and llms.txt
  - canonical URLs
  - en-GB
  - OG images at 1200×627
- **Privacy:**
  - no third-party requests on load (verify via the network log)
  - fonts self-hosted
  - no analytics
  - honeypot active
  - legal pages carry the lawyer-review banner
