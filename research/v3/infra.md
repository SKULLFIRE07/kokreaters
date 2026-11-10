# v3 infra: tests, tooling, CSP, deploy (read-only audit, 10 Nov 2026)

Scope: `web/` on branch `redesign/v3-editorial` (git root is `ganeshkaka-folder/`, **no git remote**). Astro 7.4.5.
Nothing under `web/src` was modified by this audit. Note: `web/package.json` is being edited concurrently by another unit
(uncommitted: `@fontsource-variable/inter`, `@fontsource-variable/source-serif-4`, `lucide-static` added; devDeps reordered).

## 0. Facts that change the plan

1. **The live link shows CONFIRM and DRAFT today.** `https://kokreaters-vercel.vercel.app` is a *staging* build: `/robots.txt` = `Disallow: /`,
   `/approach` HTML has CONFIRM 9/10/11 markers, `/insights` has 5 `data-draft` DRAFT ribbons. Cause: the Vercel project has **no
   environment variables** (`vercel env ls` → none), so `PUBLIC_SITE_MODE` falls back to `staging`.
2. **Production mode hides more than labels.** Both routable insights are `status: draft, review: pending`, all 3 KoKreaters engagements are
   `consent: pending`. A production build has 18 pages (no article routes), the Insights hub renders **no featured card and no Pillar/Format
   filters** (`insights/index.astro` renders `<Filters>` only when `list.length > 0`), only the 4 "In preparation" titles; Impact shows founder
   results only. That conflicts with the brief's KEEP "Insights Pillar + Format filters" unless drafts are approved or a drafts flag is added (section 4.4).
3. **`og:image` and canonical are hard-wired to `https://kokreaters.com`**, which is currently a GoDaddy site (`/og/home.png` → 404). So link
   previews of the vercel.app URL (WhatsApp/LinkedIn on phone) show **no image**. See 4.5.
4. **Astro 7 inlines small processed `<script>`s.** `core/build/plugins/plugin-scripts.js` inlines any component script chunk with no imports,
   no dynamic imports and code < `vite.build.assetsInlineLimit` (2048 here) as `<script type="module">…</script>`. Each one gets a CSP hash. v3 will
   have many tiny scripts (menu, fade-up, filters, newsletter) so this matters. See 3.4.
5. Deploys go from a **separate plain copy** `/home/aryan-budukh/kokreaters-vercel/` (not git; `.vercel/project.json` → projectName
   `kokreaters-vercel`, projectId `prj_JdLnncywp5wpzs83nIYjz11jFypD`). Vercel builds remotely: preset Astro, `npm run build`, output default `dist`,
   Node 26.x, 6 Production deployments 5 days old. `web/` itself has no `.vercel` link.
6. `web/.github/workflows/pages.yml` **never runs**: GitHub only reads `.github/workflows` at the repo root (`ganeshkaka-folder/`), and the repo has no remote.
7. `web/.stuck.mjs` is an untracked v2 debug script (mobile-menu scroll-lock probe on webkit/chromium against the live URL). Delete; its checks become a test (1.10).

## 1. Test suite (Playwright, `tests/*.spec.ts`, 278 tests passing on v2)

Global contracts every spec relies on (keep these in v3 chrome/layout, they cost nothing):
`<html lang="en-GB" class="no-js">` + head script swapping `no-js→js`; `body[data-page]` values `home|expertise|pillar|industries|approach|impact|insights|article|about|contact|legal|notfound`;
one `<header class="site-header">`; `<main id="main" tabindex="-1">`; exactly one `<h1>` in server HTML; skip link `a.skip-link` first in `<body>`.

### 1.1 helpers.ts (modify)
- Routes discovered from `dist/**/*.html` minus 404 → no list to maintain. Keep.
- `mode` is inferred from `dist/robots.txt` (`Disallow: /` ⇒ staging). **Breaks** once indexing is split from mode (4.4): replace with a build
  marker, e.g. `src/pages/build-info.json.ts` → `dist/build-info.json` `{ mode, indexable, includeDrafts }` (endpoints are not in the sitemap;
  verified robots.txt/llms.txt are absent from `sitemap-0.xml`). Export `mode` and `indexable` separately.
- `settle()` waits for `html.motion-booted | !html.js | html.motion-failed`, then sleeps (callers pass 2400 ms for the v2 2.1 s hero). Keep the
  wait; v3 reveal script must add `motion-booted`. Reduce callers' extra wait to ≈400 ms (no hero timeline).
- `scrollThrough()` uses `window.__lenis` if present else `window.scrollTo`. Works unchanged after Lenis removal; drop the Lenis branch.
- `hiddenInMain()` (opacity 0 / visibility hidden inside `<main>`, skipping `[hidden]`, closed dialogs, aria-hidden off-screen honeypots, empty decor). Keep as is.
- `builtCsp()` reads `dist/_headers`. Keep.

### 1.2 smoke.spec.ts (keep, minor edits)
Asserts per route: HTTP 200; one visible `h1`; `header.site-header, body > header` ×1; `main#main` ×1; `lang=en-GB`; html class lacks `motion-failed`
and `no-js`; zero CSP violations (dist/_headers CSP injected into every document via `page.route`); zero console errors; zero third-party
requests; zero failed/≥400 requests. Plus: unknown URL → 404 with one h1, `body[data-page="notfound"]`, meta robots noindex; machine files
(robots per mode, llms.txt starts `# KoKreaters` and contains `office@kokreaters.com`, sitemap lists every route, no `/404`).
- Survives if the class contract above is kept. **Will break** if v3 drops the `motion`/`motion-booted` boot handshake while keeping the head script
  (3 s fallback adds `motion-failed`). Either keep the handshake (recommended) or remove both the timer and the assertion together.
- Robots assertion: key on `indexable`, not `mode`.
- Third-party gate means **all photography must be self-hosted** (also enforced by CSP `img-src 'self' data:`). No Unsplash/CDN hotlinks.

### 1.3 a11y.spec.ts (keep unchanged)
axe-core tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`, zero violations, every route + 404, at 1440×900 and 390×844, after settle(2400) +
scrollThrough. Selector-free; survives. Watch-outs for v3: engagement-models table on mobile (if it scrolls sideways it needs
`tabindex="0" role="region" aria-label` → `scrollable-region-focusable`); accent `#306FE0` text fails AA on `#F2F2F0` (4.19) and on navy (3.67), see 2.7.

### 1.4 keyboard.spec.ts (keep, edit constants)
- 1440: `header a.btn[href="/contact"]:not(#mobile-menu *)` visible, text `/Start a conversation/`, height ≥ 44; reached in ≤ `MAX_TABS_TO_CTA` (12)
  Tab presses; every stop has outline ≥ 1px or a box-shadow; Enter lands on `body[data-page="contact"]`.
- 390 (hasTouch): `header button[data-menu-toggle]` ≥ 44×44; click → `aria-expanded="true"`, `#mobile-menu` visible, `main[inert]`; Esc closes and
  focus returns to the toggle; reopen, click `#mobile-menu a.m-menu__link[href="/contact"]` → contact.
- **Breaks:** the tab count assumed announcement bar link + Pause motion button. v3 order (skip, logo, 6 nav items, CTA) = 9 stops → set
  `MAX_TABS_TO_CTA = 10`. Replace `a.btn` with a stable hook `[data-header-cta]` so restyling the button cannot break it. Keep `data-menu-toggle`,
  `#mobile-menu`, `.m-menu__link`, `inert` on `<main>` (or rename hooks in the same commit). Focus ring must be `outline` (e.g. 2px `#306FE0`, offset 2px:
  ≥ 3:1 on white 4.69, grey 4.19, navy 3.67).

### 1.5 reduced-motion.spec.ts (keep, edit)
- reduce @1440: nothing hidden in main before/after scroll; `html.motion` absent; `window.__lenis` absent; full-page screenshot to
  `research/shots/build/tests-rm-{route}-1440.png`. JS off @390: html class contains `no-js`, h1 visible, nothing hidden.
- Lenis assertion becomes trivially true → **replace** with `document.getAnimations().filter(a => a.playState === 'running')` = [] after settle.
- Contract for v3 fade-up: hidden initial state only under `html.motion` (JS on and no reduced motion); `.motion-failed` and `.no-js` show everything.

### 1.6 responsive.spec.ts (keep, edit widths)
At 360/768/1024/1280/1440: `scrollWidth ≤ innerWidth`, forced `scrollTo(600)` leaves `scrollX = 0`, no own-text-node rect outside the viewport
unless inside an overflow box that is itself inside the viewport. Selector-free.
- **Add 390 and 375** (iPhone; the brief and the user ask for phone quality; today 390 is only covered by a11y/keyboard/budget). Optionally 412 (Pixel).
- Horizontal rails are removed, so the "inner overflow box" escape hatch should now only be needed for the engagement table.

### 1.7 seo.spec.ts (keep, edit robots key)
Per route from served HTML: one `<title>` (≤ 60 and contains `KoKreaters`, articles follow `{title} | KoKreaters Insights` else bare); meta
description ≤ 155; one canonical = `https://kokreaters.com` + path; `lang="en-GB"`; meta robots per mode; `og:image` matches
`^https://kokreaters\.com/.+\.(png|jpg)$` and exists in dist; `og:url`; `og:locale en_GB`; exactly one JSON-LD block, `@context` schema.org, `@graph`
with types home `Organization, ProfessionalService, WebSite`, about `Person, BreadcrumbList`, article `Article, BreadcrumbList`, others
`BreadcrumbList`. Uniqueness of titles/descriptions.
- Depends on `body[data-page]`, `SeoHead.astro`, `JsonLd.astro`, `schema.ts`, `src/data/seo.ts`. Survives if those are not touched.
- Edit: robots expectation keyed on `indexable`. If 4.5 (asset origin) is adopted, relax the og:image regex to the configured origin.

### 1.8 budget.spec.ts (modify)
- Home total transfer ≤ 600 KB at 1440 and 390 (text gzip-6, binaries raw) after scrolling all lazy images. **Keep**; it is the photography guard.
  v3 photos: AVIF/WebP via `astro:assets` with `widths`/`sizes`, `width`/`height` attributes (CLS), hero eager + `fetchpriority="high"`.
- "no three.js on home", "three.js on no route except /about", "/about requests no three chunk @390/reduced" + `[data-globe] svg` visible:
  **delete** (globe gone; the `[data-globe]` assertion will fail).
- Replace with: no request whose body contains GSAP/Lenis/Three signatures on any route (or rely on check-budget's static scan, 2.6).

### 1.9 chrome.spec.ts (delete and replace)
Asserts `body > .ann[role="region"]` with `a[href="/insights"]`, body order `skip-link, ann, site-header`, and the Pause motion toggle
(`[data-motion-toggle]`, ≥ 44px, `aria-pressed`, `html.motion-paused`, label "Play motion", localStorage persistence, hidden under reduce).
All of it **breaks**: the brief removes the pause-motion bar; the announcement bar is v2 chrome. Replace with `chrome.spec.ts` v3:
- body order: `skip-link` then `header.site-header` (or the v3 quiet top bar if kept); `footer#site-footer` ×1.
- newsletter is a real `<form>`: labelled `input[type=email][required]`, submit button, `action` = endpoint or `mailto:`; no `[data-motion-toggle]` anywhere.

### 1.10 New specs (brief compliance; cheap, static where possible)
| spec | assertion |
|---|---|
| `review-marks.spec` (production build only, `mode === 'production'`) | every route: 0 of `.confirm, [data-confirm-id], [data-draft], .draft-ribbon`; visible `innerText` has no `/\b(CONFIRM|DRAFT)\b/`, no "Pending client consent" |
| `brief-guard.spec` (static over dist HTML) | banned asides absent (case-insensitive, `'` and `’`): "yes, that WHO", "we're all ears", "talk soon", "no noise, really", "that's you + us", "the long way round"; no toy hooks `[data-flap-board],[data-flap-tile],[data-scramble],[data-crumple],[data-gravity-tags],[data-falling-text],[data-ticket],[data-magnetic],[data-magnetic-letters],[data-magnetic-dots],[data-note],[data-scribble],[data-sticker],[data-stamp-spin],[data-marquee],[data-rail],[data-cursor],[data-parallax],[data-pipeline],[data-venn],[data-emulsion],[data-fan-item],[data-globe],[data-motion-toggle],[draggable="true"]` |
| `type.spec` | no request to `/fonts/(bricolage|ibm-plex|caveat|instrument)`; computed `h1` font-family starts with `"Source Serif 4"`, body with `Inter`; body font-size 18px at ≥ 1024 |
| `palette` (in check-budget or contrast-check, CSS only) | no v2 hexes in `dist/_astro/*.css` + inline `<style>`: `#F4C841 #E5494D #3A1C5C #5B2A86 #7B4BC4 #8C5B88 #C8457E #EADCFF #FFEEB0 #F6DCE8 #A2335F #6F4470 #F8F6FC`. **Exclude SVG**: the node-cluster logo itself contains `#F4C841 #E5494D #EADCFF #FFEEB0` and is kept as the signature |
| `home.spec` | home has exactly 8 top-level sections (contract: `main > section[data-section]` ×8); annotate `scrollHeight` at 1440 (v2 ≈ 16,700 px) |
| `mobile-webkit` project | add `{ name: 'iphone', use: devices['iPhone 13'] }` (WebKit 2370 is installed) running smoke + responsive@390 + the menu flow; port `.stuck.mjs`: after open/close the page still scrolls (`scrollBy` changes `scrollY`), `body.style.overflow` restored, `main.inert === false`, tapping a menu link navigates |

### 1.11 playwright.config.ts (keep, small edits)
Serves `dist` via `astro preview --ignore-lock` on 127.0.0.1:4413 (`KK_DIST`, `KK_PORT`, `KK_BASE_URL`, `KK_SHOTS`), ready URL `/robots.txt`,
bundled Chromium else `/usr/bin/google-chrome`, workers 4, retries 0 locally. Add the `iphone` WebKit project with a `testMatch` subset.
`KK_BASE_URL=https://kokreaters-vercel.vercel.app npx playwright test tests/smoke.spec.ts tests/review-marks.spec.ts` = post-deploy check (routes still come from local dist, so build the same mode first).

### 1.12 lighthouserc.json (modify)
Mobile, 3 runs, median: perf/a11y/BP/SEO ≥ 0.9, LCP ≤ 2500 ms, CLS ≤ 0.1, `skipAudits: ["is-crawlable"]` (keep: preview is noindex).
**Breaks in production builds:** URL `/insights/3-mcpd-glycidyl-esters-playbook` is a draft → not built. Use `/`, `/about`, `/expertise/food-safety-quality`
(exists in both modes), plus `/insights`. LCP will now be the hero photo or serif H1: eager, `fetchpriority="high"`, ≤ ~100 KB AVIF at 390 w.

## 2. Scripts

| script | verdict | why / what changes |
|---|---|---|
| `copy-fonts.mjs` | **modify** | Replace `FILES` with `['@fontsource-variable/source-serif-4','source-serif-4-latin-wght-normal.woff2']` (50.9 KB), optional `…-latin-wght-italic.woff2` (51.6 KB) for pull quotes, `['@fontsource-variable/inter','inter-latin-wght-normal.woff2']` (48.3 KB). Total 99–151 KB (budget 240). Its stale-file loop auto-deletes the v2 woff2s from `public/fonts`. New file names also sidestep the year-long `immutable` cache on `/fonts/*`. Optional: Source Serif `opsz` file (122 KB) if large headlines need optical sizing. Latin subset covers `−` (U+2212), `™`, `°`, `ü`; it does **not** cover `→` (U+2192, used in `data/approach.ts`, `impact.ts`, `microcopy.ts`), `≤ ≥` (seo.ts/notes only): render arrows as inline SVG (lucide-static) or accept fallback glyphs |
| `prepare-brand.mjs` | **modify** | Keep: vector logo copy, favicon SVG/PNGs, apple-touch-icon, `brand/kokreaters-logo-512.png` (JSON-LD logo). Drop: grain tile (`src/assets/fx/grain.png`, used only by `grounds.css`), cluster/word split (`derived/*`, existed for the home dock flight) unless the v3 header still inlines the cluster. Replace the cut-out crops with a photo step: `../assets/photos/ganeaysh-portrait-1665x2048.png` (and any sourced photography) → sharp `modulate({ saturation: ~0.25 })` + slight cool tint → `src/assets/photos/*.jpg|png` (Astro then emits AVIF/WebP). `about.astro` and JSON-LD `Person.image` currently use `ganeaysh-cutout.png` |
| `build-globe.mjs` | **delete** | Globe removed. Also delete `src/data/globe/coast.json`, `src/assets/globe/globe-static.svg`, `src/scripts/globe/*`, `GlobeSection.astro`, and remove it from the `assets` npm script |
| `og.mjs` | **modify** | Render: `scripts/og/template.html` to navy `#0B1B33` ground, Source Serif 4 title (white, ~600, 72→48 px step-down loop), Inter overline (`#A9B4C7`-ish on navy, 8.2:1), one thin accent rule `#306FE0`, white horizontal lockup; remove grid, 6 colour bars, saffron dot, rotated sticker, Plex/Bricolage `@font-face`. In `render()` change the font precheck list (lines 148) to the new woff2 names. Card list/copy sources (`src/data/*`, insight frontmatter) unchanged; 17 PNGs at 1200×627 in `public/og` (tracked) must be regenerated and committed. Check mode: `production` is inferred from robots.txt (line 210); switch to `build-info.json` once indexing is split, keep robots expectation on `indexable`. Before launch on kokreaters.com delete draft cards from `public/og` if draft titles must not be fetchable |
| `csp-hash.mjs` | **keep** (optional additions) | Works for any number of inline scripts. Run after every build that will be deployed; see section 3. Add any extra Vercel headers (e.g. host-scoped `X-Robots-Tag`, 4.5) **inside this script**: it rewrites the whole `headers` array of `vercel.json` (other top-level keys such as `redirects` survive via spread) |
| `check-budget.mjs` | **modify** | JS ≤ 95/85 KB gzip per page (v3 should be < 20 KB: tighten to e.g. 30/25), CSS ≤ 60 KB, fonts ≤ 240 KB (tighten to 160), lazy chunks ≤ 35 KB, three-only-on-about gate (becomes dead; replace with a ban: fail if any `dist/_astro/*.js` matches `GreenSock|gsap\.registerPlugin|ScrollTrigger|__lenis|new Lenis|WebGLRenderer`), `PAGE_FILE` glob logic tied to `motion/index.ts` (dead once motion/index is gone, harmless). Extend `OLD_ASSETS` to v2: `grain.png`, `globe-static`, `coast.json`, `ganeaysh-cutout`, `bricolage|caveat|ibm-plex|instrument-sans`. Add the palette scan (1.10) here |
| `contrast-check.mjs` | **modify** | Parses `--kk-name: #hex` from `src/styles/tokens.css` and `^.g-name { --role: var(--kk-x)|#hex; }` blocks from `src/styles/grounds.css`; any role it cannot resolve to a hex is a failure (no `color-mix`, `rgb()`, nested vars). Keep the file paths/format or update the regexes. New `CHECKS`: `--fg, --head, --fg-2, --link` ≥ 4.5, `--focus` ≥ 3.0, `--chip-fg/--chip-bg` ≥ 4.5 if filter chips stay; drop `--note` (Caveat) and `--pill-sweep*`. Computed ratios: `#1A1A1A` on white 17.40 / on `#F2F2F0` 15.53; `#5A5A5A` 6.90 / 6.15; `#2C509E` 7.64 / 6.82; `#306FE0` 4.69 on white **but 4.19 on `#F2F2F0` and 3.67 on navy (fail for text)**; white on navy 17.23. ⇒ `--link` = `#306FE0` on white only, `#2C509E` on grey, a light tint (`#8FA9D9` 7.26, `#A9B4C7` 8.24) on navy; white on `#306FE0` buttons 4.69 ok |
| `notes-copy.mjs` | **delete** | Reads `src/data/notes/{chrome,home,expertise,story,journal}.ts` (56 src files import `@/data/notes/*`, 43 import `components/notes/*`) and writes `research/v2-new-copy.md`. Handwritten notes are removed; once `data/notes/*` goes the script throws. Remove the `notes` npm script |
| `pages-base.mjs` | **delete** (or leave dormant) | Only for GitHub Pages `BASE_PATH`; the workflow cannot run (fact 6). If kept, its hard-coded root list (`_astro, fonts, brand, og, images, …`) must gain any new `public/` dir. Also drop the `BASE_PATH` spread in `astro.config.mjs` if deleted |
| `.github/workflows/pages.yml` | **delete** | Dormant (wrong location, no remote), builds staging only, never runs csp-hash |

`package.json` scripts: `assets` → drop `build-globe`; delete `notes`; **fix `build:prod`**: npm runs `prebuild` only for `build`, so `build:prod`
skips `copy-fonts` (fresh clone ⇒ no `dist/fonts` ⇒ check-budget "no woff2" failure). Use
`"build:prod": "node scripts/copy-fonts.mjs && PUBLIC_SITE_MODE=production astro build"`. Add `"verify:check": "node scripts/csp-hash.mjs --check && node scripts/check-budget.mjs && node scripts/contrast-check.mjs"` for a non-mutating gate.
`BaseLayout.astro` preloads `/fonts/bricolage-…woff2` and `/fonts/ibm-plex-mono-latin-400…woff2`: switch to the serif + Inter files.
`THIRD_PARTY_NOTICES.md`: remove bencho blocks/GSAP/Lenis/three/world-atlas/Bricolage/Plex/Caveat/Instrument; add Source Serif 4 (OFL), Inter (OFL), lucide (ISC) if used. README "Site modes" table: update.

## 3. CSP hash pipeline

### 3.1 How it works today
1. `astro build` writes `dist/**/*.html`. `public/_headers` (a generated template) is copied verbatim to `dist/_headers`.
2. `node scripts/csp-hash.mjs` (first step of `npm run verify`) walks every dist HTML file, regex `<script\b([^>]*)>([\s\S]*?)</script>`, skips
   scripts with `src=` and types `application/json|application/ld+json|text/plain|text/template|text/x-template`, and hashes the **exact inner bytes**
   (UTF-8, including the leading newline and indentation) with SHA-256 → base64 → `'sha256-…'`, deduplicated and sorted.
3. It also collects absolute `<form action="https://…">` origins and the origins of `PUBLIC_FORM_ENDPOINT` / `PUBLIC_NEWSLETTER_ENDPOINT` (from the
   **shell env at csp-hash time**) into `connect-src` and `form-action`; `PUBLIC_TURNSTILE_SITEKEY` adds `https://challenges.cloudflare.com` to
   `script-src`, `connect-src` and a `frame-src`. It warns (does not hash) on inline `on*=` handlers: they will be blocked.
4. Policy: `default-src 'self'; script-src 'self' <hashes>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' …;
   form-action 'self' mailto: …; frame-ancestors 'none'; base-uri 'self'; object-src 'none'` + HSTS, nosniff, Referrer-Policy, Permissions-Policy.
5. Writes `dist/_headers`, `public/_headers` and `vercel.json` (keeps `cleanUrls: true`, `trailingSlash: false` and any other top-level key, **replaces
   `headers`**). `--check` writes nothing and exits 1 if `public/_headers` or `vercel.json` differ; `--dist-only` writes only `dist/_headers`.
6. Today: 20 inline scripts, 1 unique hash `sha256-5EZioNgQTY8tion71e6VfPQTl2Q97n8Q5N4AUGbJOjs=` (the `is:inline` head flags script in
   `BaseLayout.astro` lines 49-56, verified by rehashing `dist/index.html`). `--check` passes now. Live response header carries the same hash.
7. **Vercel never runs csp-hash** (build = `npm run build`) and reads headers only from the uploaded `vercel.json`. So `vercel.json` must be regenerated
   locally from a build whose inline scripts are byte-identical to what Vercel will build, then copied into the deploy dir before `vercel --prod`.
8. Safety net: smoke.spec injects `dist/_headers`' CSP. If an inline script changed but csp-hash was not re-run, `dist/_headers` still holds the old
   template hash ⇒ `securitypolicyviolation` ⇒ smoke fails locally. If the build is run but csp-hash only partly (`--dist-only`), smoke passes but
   `vercel.json` is stale: always run the full script before deploying, or gate with `--check`.

### 3.2 What a new inline script requires
- Any change to the head script's text (even whitespace, or dropping the `kk-motion` / `__kkMenuPending` lines) ⇒ new hash ⇒ rebuild → `csp-hash.mjs` → commit `vercel.json` + `public/_headers` → copy to deploy dir → deploy. Otherwise every page's head script is blocked on live (no `js` class ⇒ no-js layout, motion-failed never cleared).
- No `on*=` attributes, no `javascript:` URLs, no `define:vars` (its JSON makes the hash env-dependent), no inline script whose text depends on env/mode unless csp-hash runs on a build with the **same env as Vercel**.
- Third-party anything needs a policy change: images must be self-hosted (`img-src 'self' data:`), no iframes (no `frame-src`, falls back to `'self'`: no YouTube/Maps/Calendly embeds), fonts self-hosted.
- Newsletter "real form": posting to an external service needs its origin in `form-action` (and `connect-src` if `fetch`). csp-hash adds it only if `PUBLIC_NEWSLETTER_ENDPOINT` is set in the shell when csp-hash runs **and** in Vercel's env for the build. `mailto:` works with no change.

### 3.3 Recommended v3 head script
Keep one tiny `is:inline` script: `no-js→js`; add `motion` unless reduced motion; 3 s `motion-failed` fallback unless `motion-booted`. Drop the
`kk-motion` localStorage line (pause bar gone) and the `__kkMenuPending` early-tap replay (it existed because the menu waited on the GSAP bundle; v3's menu
script is tiny). Result: one new hash, regenerated once.

### 3.4 Stop Astro inlining component scripts (recommended)
In `astro.config.mjs`: `vite: { build: { assetsInlineLimit: (file, content) => (/\.m?js$/.test(file) ? false : content.length < 2048) } }`
(Astro's `shouldInlineAsset` honours a function; `false` ⇒ never inline). Every processed `<script>` then ships as `/_astro/*.js` under `'self'`, the
only hash is the head script, and editing a component script never invalidates `vercel.json`. Without this, every small v3 script becomes an extra
hash that changes on each edit.

## 4. Deploy facts and site mode

### 4.1 Live project
Vercel project `kokreaters-vercel` (team `aryan-budukhs-projects`), framework preset Astro, build `npm run build` (runs `prebuild` → copy-fonts),
output `dist`, Node 26.x, alias `https://kokreaters-vercel.vercel.app`, deployed with Vercel CLI 54.20.1 from `/home/aryan-budukh/kokreaters-vercel/`
(a file copy of `web/` without `dist/node_modules`). No env vars set. HTML served with the CSP from `vercel.json`; no `X-Robots-Tag` on the alias.

### 4.2 What `PUBLIC_SITE_MODE=production` changes (all build-time, `src/config/site.ts` → `src/lib/mode.ts`)
- `<Confirm>` (`ui/Confirm.astro`) and `<DraftRibbon>` (`ui/DraftRibbon.astro`) render nothing; ExpertisePanel draft ribbon gone.
- Insights: only `status: published` + `review: approved` are routed/listed/in sitemap and llms.txt (today: **none**); coming-soon stay unlinked titles.
- Impact: `consent: pending` engagements not rendered (today: all 3); CaseEntry and MethodSteps omit `null` fields instead of showing CONFIRM rows.
- `robots.txt` → `Allow: /` + `Sitemap: https://kokreaters.com/sitemap-index.xml`; meta robots `index, follow` (404 stays noindex).
- `mode.ts` couples all of these on one boolean `isStaging`; SeoHead line 17 and `robots.txt.ts` use it. **Content hiding and indexing are coupled.**

### 4.3 Recommendation
Live preview link: `PUBLIC_SITE_MODE=production` (no CONFIRM/DRAFT, per brief) **and** noindex until kokreaters.com points at this project.
Indexing a vercel.app copy whose canonical points at a different (GoDaddy) site is pointless and risks a duplicate.

### 4.4 Minimal split (≈6 lines)
```ts
// src/config/site.ts
indexable: env.PUBLIC_SITE_MODE === 'production' && env.PUBLIC_INDEXABLE === '1',   // opt-in; preview stays noindex
// optional, only if the Insights hub must show filters on the preview:
includeDrafts: env.PUBLIC_INCLUDE_DRAFTS === '1',
// src/lib/mode.ts
export const isIndexable: boolean = site.indexable;
// src/components/seo/SeoHead.astro line 17
const robots = !isIndexable || seo.noindex ? 'noindex, nofollow' : 'index, follow';
// src/pages/robots.txt.ts
const body = isIndexable ? `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n` : 'User-agent: *\nDisallow: /\n';
// src/lib/insights.ts visibleInsights(): staging || site.includeDrafts ? status !== 'coming-soon' : published && approved
// (DraftRibbon stays staging-only, so drafts show without any label)
// src/env.d.ts: readonly PUBLIC_INDEXABLE?: string; readonly PUBLIC_INCLUDE_DRAFTS?: string;
// src/pages/build-info.json.ts (prerender): { mode, indexable, includeDrafts }  → tests + og.mjs check read it
```
Opt-in (`=== '1'`) is the safe default: forgetting it at launch gives a noindexed site (visible in Search Console, fixed by one env var), never an
indexed preview. Put "set `PUBLIC_INDEXABLE=1`" on the launch checklist. Test updates: helpers/seo/smoke key robots on `indexable`; og.mjs check keys
draft rules on `mode`, robots on `indexable`; README modes table gets an "indexable" row.
Drafts decision (orchestrator/client): (a) Ganeaysh approves the two drafts (`status: published`, `review: approved`), or (b) preview sets
`PUBLIC_INCLUDE_DRAFTS=1` (unset at launch), or (c) accept an Insights hub with no articles and no filters on the preview. (a) or (b) keeps the brief's filters visible.

### 4.5 Link previews on phone (optional)
OG/Twitter image URLs are absolute to `https://kokreaters.com` (`schema.ts abs()`), which 404s today, so WhatsApp/LinkedIn previews of the vercel.app
link have no image. Minimal fix: `PUBLIC_ASSET_ORIGIN` (default `site.url`) used only for `og:image`/`twitter:image` in `SeoHead.astro`; preview sets
`https://kokreaters-vercel.vercel.app`; seo.spec regex and og.mjs check accept that origin; canonical stays kokreaters.com. After launch, add (inside
csp-hash.mjs) a host-scoped header `{ source: '/(.*)', has: [{ type: 'host', value: 'kokreaters-vercel.vercel.app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }`
or a host redirect to kokreaters.com, because the alias keeps serving the indexable build.

### 4.6 Deploy runbook (v3)
```bash
cd /home/aryan-budukh/Desktop/ganeshkaka-folder/web
npm run build:prod              # after the build:prod fix; or: node scripts/copy-fonts.mjs && PUBLIC_SITE_MODE=production npx astro build
npm run og                      # only if template/headlines changed; commit public/og/*.png
node scripts/csp-hash.mjs       # rewrites vercel.json + public/_headers from THIS build (export any PUBLIC_*_ENDPOINT used on Vercel first)
node scripts/check-budget.mjs && node scripts/contrast-check.mjs && node scripts/og.mjs check dist
npx playwright test             # against the production dist
rsync -a --delete --exclude .vercel --exclude node_modules --exclude dist --exclude .astro --exclude test-results \
  --exclude .lighthouseci --exclude public/fonts --exclude .env --exclude .stuck.mjs ./ /home/aryan-budukh/kokreaters-vercel/
cd /home/aryan-budukh/kokreaters-vercel
printf 'production' | vercel env add PUBLIC_SITE_MODE production    # once (persists); PUBLIC_INDEXABLE stays unset
vercel --prod --yes
curl -s https://kokreaters-vercel.vercel.app/robots.txt                        # expect Disallow: /
curl -s https://kokreaters-vercel.vercel.app/approach | grep -c 'CONFIRM\|data-draft'   # expect 0
curl -sI https://kokreaters-vercel.vercel.app/ | grep -i content-security-policy        # hash = vercel.json
```
(Alternative to the copy: `vercel link --yes --project kokreaters-vercel` inside `web/` and add `.vercel` to `web/.gitignore`. A one-off
`vercel --prod -b PUBLIC_SITE_MODE=production` also works but is easy to forget; prefer the project env var.)
`package-lock.json` must match `package.json` (another unit is editing both). Vercel installs with `npm install`.

## 5. Removable npm deps (after the v3 code no longer imports them)
| package | type | current importers |
|---|---|---|
| `gsap` | dep | `scripts/motion/*`, `pages/home|dock|insights.ts`, `bencho/card-fan|edge-light|magnetic-letters|text-rise.ts`, `globe/scene.ts` |
| `lenis` | dep | `motion/lenis|context|index.ts`, `chrome.ts`, `pages/approach.ts`, `MobileMenu.astro` (`data-lenis-prevent`), `env.d.ts` (`__lenis`) |
| `three` + `@types/three` | dep + devDep | `scripts/globe/scene.ts` |
| `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/instrument-sans`, `@fontsource/caveat`, `@fontsource/ibm-plex-mono` | dep | only `copy-fonts.mjs` FILES (CSS uses `public/fonts`) |
| `d3-geo`, `topojson-client`, `world-atlas` | devDep | `build-globe.mjs` **and** `components/home/RouteMap.astro` (build-time route map): removable only if the v3 home drops RouteMap (also `components/home/geo.d.ts`) |
| `@astrojs/markdown-remark` | dep | no direct import in src/scripts/config (transitive via astro/mdx): optional removal |

Keep: `astro`, `@astrojs/mdx`, `@astrojs/sitemap`, `sharp` (astro:assets, og.mjs, prepare-brand), `@fontsource-variable/source-serif-4`, `@fontsource-variable/inter`,
`lucide-static` (if used for SVG icons; build-time only), `@astrojs/check`, `typescript`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`.
Removing gsap+lenis+three+types+4 font packages+3 geo packages drops ≈ 49 MB from node_modules.
