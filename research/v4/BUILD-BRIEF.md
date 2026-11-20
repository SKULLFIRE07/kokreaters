# KoKreaters v4 "Delft": build brief

The client, Ganeaysh Kulkarni, sent his own redesign spec on 20 Nov 2026. **His spec is the source of truth.** The
owner (Aryan) adds one thing: "make it so professional and beautiful, with good GSAP". Read this file, then:

- `research/v4/developer-guide.txt`: the full guide (colours, fonts, sizes, layout rules, 13 home sections, content fixes, photo list).
- `research/v4/KoKreaters_Homepage_Design.png` (1440 × 7985; also split into `home-part0/1/2.png`) and
  `KoKreaters_Homepage_Design.html`: **the target homepage**. Open the PNG parts with the Read tool and match them closely.
- `research/v4/KoKreaters_Style_Guide.png` and `.html`: every colour, size and button.

Project: Astro 7 static site in `web/` (git branch `redesign/v4-delft`, never push). Today's live site (v3) is built
on role tokens: components read `--bg/--fg/--head/--label/--link/--btn-*`; grounds are `.band--white`, `.band--grey`
(now Porcelain #FAFAF7), `.band--navy` (Delft Navy #0E1F4D), plus new `.band--ice` (#EEF2F8) and `.band--delft`
(#1C3F94 with a saffron button) in `web/src/styles/layout.css`.

## Already done (commit 7f1ab9d): do not redo
- `tokens.css`: Delft palette, Bodoni Moda + Manrope, the guide's type sizes, square corners (`--r-sm: 0`), container 1320 (1240 + 2 × 40).
- `fonts.css` + `scripts/copy-fonts.mjs`: self-hosted Bodoni Moda (opsz normal + italic) and Manrope; preloads updated.
- `base.css`: headings weight 500 (h3 400), h4 in Manrope 700 (Bodoni only at 24px and up), labels 13px caps .16em 700.
- `src/data/pillars.ts`: the six services renamed and reordered per the guide (keys are stable; `name` and `promise` are the
  home grid's title and line).
- The 14 Unsplash originals (2400px wide) are in `assets/photos/unsplash-v4/`:
  `hero-rapeseed, agri-fields, develop-pipette, scale-tanks, access-ship, feed-silos, oils-pour, bakery-dough,
  cocoa-pods, nutrition-spices, nl-polder, spare-hall, spare-wheat, spare-maize` (.jpg). All Unsplash License, checked by
  the client; credits go in THIRD_PARTY_NOTICES.md (photo pages are listed in the guide's .docx rels:
  `research/v4/KoKreaters_Developer_Guide.docx`). The ship's name is tiny; fine at tile size.

## Motion policy (reconciles the client's "no blur-in/fade-in, content shows at once" with "good GSAP")
1. **Nothing is ever hidden waiting for scroll.** No opacity:0 / blur start states on scroll-triggered content. Text is
   readable the moment the page paints, with and without JS. Remove the v3 blur-fade (`[data-reveal]`, split words,
   `kk-rise` blur) from `motion.css`, so those hooks become no-ops.
2. GSAP (3.15, ScrollTrigger; installed) + Lenis (1.3.27, installed) give **depth and polish, not reveals**. The motion
   module is `web/src/scripts/motion.ts` (owned by unit HOME, loaded on every page, GSAP imported dynamically so the
   first paint never waits). Page units only add these `data-gsap` hooks to their markup:
   - `data-gsap="parallax"` on a photo frame (overflow hidden): its img is scaled 1.12 and drifts ±6% yPercent, scrubbed.
   - `data-gsap="kenburns"` on a hero photo frame: on load the image settles from scale 1.08 to 1 over about 1.6s, then parallaxes gently on scroll.
   - `data-gsap="rule"` on a decorative line (the saffron 40 × 2 label rule, the stat top rules, card hairlines): scaleX 0 to 1 from the left when it enters. Decorative only, so a hidden start is allowed.
   - `data-gsap="count"` on a big figure whose final value is in the HTML text: counts up once (about 1.2s) when it enters; non-numeric values (WHO, −25 °C) are left alone, or animate only the digits.
   - `data-gsap="lift"` on a card or tile: a small scrubbed translateY (0 to −14px) as it crosses the viewport. No opacity.
   - `data-gsap="hero-title"` on the home H1: lines rise inside an overflow mask once on load (≤ 900ms, starting at 0ms, not scroll-triggered).
   - Hover (CSS): link underline draws, photo tiles zoom 1.04, buttons darken. Square corners, no shadows.
   - Lenis smooth scroll on fine pointers only. **Never call `lenis.stop()` for the mobile menu** (it sets
     overflow:clip on html and loses the scroll position). Keep the existing menu scroll lock (body position fixed + restore).
3. `prefers-reduced-motion: reduce` → no GSAP, no Lenis, no parallax, no count. Everything static.
4. Budgets: keep first-load JS small (GSAP chunk lazy). Lighthouse mobile ≥ 90 on every page, CLS < 0.05, contrast AA.

## Content fixes (from the guide; apply wherever the text appears)
- Show both "25 years in industry" and "14 years in oils, fats and food ingredients".
- The track record's "2 regions of teams led: Americas, EMEA, Asia-Pacific" is an open question for Ganeaysh. Do not
  show a number; if the regions appear at all, name the regions without a count.
- Founder title is always "Chief Catalyst and Founder, KoKreaters".
- The hero intro says "agri, food, feed, nutrition and specialty-ingredient businesses".
- "Based in the Netherlands" goes in the hero and gets its own band ("A Dutch base. A global reach.").
- Six services = the six in `pillars.ts` (product development; process development and plant performance; market access
  and strategy; food safety, quality and regulatory; deals, due diligence and partnerships; fractional CTO and Head of R&D).
- Always spell it "KoKreaters" and "KoKreaters.com".
- **Truthfulness:** no invented clients, numbers or claims. Use only facts already in `src/data/*` and the guide.
- **Logo:** the vector KoKreaters logo with "Connect · Collaborate · Create" is in `assets/logo/vector/`
  (`kokreaters-logo-horizontal.svg`, `-full.svg`, white variants; the brand copies the site uses are in
  `web/src/assets/brand/svg/` and `web/scripts/prepare-brand.mjs`). Never use any Cargill logo.

## Working rules for parallel units
- Touch only the files your unit owns. If you need a change elsewhere, write it in `research/v4/requests-<unit>.md`.
- **No git commands that change the tree**: no commit, checkout, stash, reset or clean. The lead commits.
- Build into your own folder so units don't clobber each other: `npx astro build --outDir dist-<unit>`, then preview with
  `npx astro preview --outDir dist-<unit> --port <your port>`. Kill your servers by PID when done (`kill $(lsof -ti tcp:<port>)`).
  Never `pkill -f`.
- Self-check before finishing: `npx astro check` (0 errors), your build, screenshots at 1440 and 390 of each route you
  own (Playwright is installed: `web/node_modules/playwright`; Chrome at `/usr/bin/google-chrome`), Read them, and fix
  what looks off. Compare the home page to the design PNG side by side.
- Return a short report: what you built, files touched, deviations and why, open issues, screenshot paths.
