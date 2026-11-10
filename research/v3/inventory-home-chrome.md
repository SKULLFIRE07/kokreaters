# Inventory: Home `/` + global chrome (v3 rebuild input)

Read-only inventory of `web/` on branch `redesign/v3-editorial` (HEAD `e40a492`), 10 Nov 2026.
Scope read in full: `src/pages/index.astro`, `src/components/home/*` (13 .astro + geo.d.ts), `src/data/home.ts`,
`src/layouts/BaseLayout.astro`, `src/components/chrome/*` (9), `src/components/shared/{CtaField,Newsletter}.astro`,
`src/data/{nav,microcopy,seo}.ts`, `src/lib/*` (7), `src/scripts/chrome.ts`, `src/components/seo/*` (3), plus every module
they import: `src/data/{pillars,industries,impact,approach,founder,types}.ts`, `src/data/notes/{home,chrome}.ts`,
`src/config/site.ts`, `src/content.config.ts` + the 6 insight MDX frontmatters, `src/scripts/consent.ts`,
`src/scripts/motion/{index,pause,context,reveal}.ts`, `src/scripts/pages/{home,hero,dock,home-emulsion}.ts` (headers/entry),
shared/ui/brand/notes/bencho components used by home/chrome, `tests/{chrome,keyboard,seo}.spec.ts`, `vercel.json`,
`public/_headers`, `scripts/{copy-fonts,csp-hash}.mjs`, `../REDESIGN-V3.md` (build contract, for alignment only).

**Data is in flux.** A parallel copy-edit pass has uncommitted edits in `src/data/{home,impact,microcopy,pillars,founder}.ts`
(see `git diff`). This file reflects the working tree at the time of reading (new exports marked **[v3 new]**). Line numbers
are working-tree line numbers; re-grep before quoting if those files move again.

Legend: **KEEP** = content/behaviour the rebuild must preserve · **DELETE** = remove per brief · **BORDERLINE** = flag to client ·
**DEAD** = code unused after redesign · `file:line`.

---------------------------------------------------------------------------------------------------------------------------

## 0. Ten facts that matter most

1. Site mode: `src/config/site.ts:10` `mode = PUBLIC_SITE_MODE === 'production' ? 'production' : 'staging'` → **unset = staging**.
   `vercel.json` has no buildCommand/env, so a Vercel deploy is **staging** unless the env var is set in the Vercel project.
   Staging shows every `<Confirm>` + `<DraftRibbon>`, lists draft insights, and emits `robots: noindex, nofollow`.
2. In **production** mode `visibleInsights()` returns **0 entries** (both real articles are `status: draft, review: pending`),
   so the home Featured-insights section and the announcement "latest insight" would be empty. Only 4 `coming-soon` stubs
   (titles only) exist. No insight has an `image`.
3. The hero H1 is **hard-coded** in `Hero.astro:24` (spans), not rendered from `hero.headline` (`home.ts:4`). Rebuild must
   render `hero.headline`.
4. `consent.ts` `initConsent()` is called **only from the GSAP motion bundle** (`scripts/motion/index.ts:81`). Deleting the
   motion bundle silently breaks the footer "Cookie settings" dialog unless init moves to the new site script.
5. `Logo.astro:114-119` hides the header logo cluster (`[data-dock-slot] {visibility:hidden}`) on home ≥1024 with motion,
   waiting for `dock.ts` to fly it in. Remove that CSS with the dock or the header mark disappears on home.
6. The inline head script (`BaseLayout.astro:49-56`) is CSP-hashed (`sha256-5EZioNgQ…` in `vercel.json:27` and
   `public/_headers:8`). Any change → run `node scripts/csp-hash.mjs` (part of `npm run verify`) or the script is blocked live.
7. JSON-LD: home gets `organization() + professionalService() + website()` automatically (`BaseLayout.astro:39`) when the page
   passes no `seo.jsonLd`; any page with `breadcrumbs` gets a `BreadcrumbList` (`:40`). `tests/seo.spec.ts:70` asserts these.
8. Expertise mega-menu, mobile menu, header scroll state live in `src/scripts/chrome.ts` (no deps, own entry, loaded before
   GSAP). That controller is reusable almost as-is (selectors listed in §1.13).
9. Newsletter is **not a real form today**: `site.newsletterEndpoint` is empty → both home and footer render a `mailto:` link
   "Subscribe" (`Newsletter.astro:30`). With an endpoint it renders a native POST form with no JS handler.
10. All casual/jokey strings in scope live in two files: `src/data/notes/home.ts` and `src/data/notes/chrome.ts` (rendered via
    `<MarginNote>`), plus UI labels hard-coded in toy components. The UI-worthy ones have already been migrated into
    `microcopy` **[v3 new]** (`announcement`, `announcementLink`, `backToTop`, `readMore`) and `impact.ts` (`figureFallback`,
    `routeMapTitle`); both notes files can be deleted once no component imports them.

---------------------------------------------------------------------------------------------------------------------------

## 1. Global chrome

### 1.1 `src/layouts/BaseLayout.astro`

**Render order** (`:61-75`): `<body data-page data-ground data-pillar style=pillarStyle>` →
1. `SkipLink` (`:62`) 2. `AnnouncementBar` (`:63`) 3. `Header page={page}` (`:64`) 4. `<main id="main" tabindex="-1">` (`:65`)
   with optional visible crumbs `div.page-crumbs.container > Breadcrumbs` when `showCrumbs && breadcrumbs.length` (`:66-68`),
   `<slot />`, then `CtaField` when `showCta` (`:70`) 5. `Footer` (`:72`) 6. `CookieConsent` (`:73`)
7. `<script>import '@/scripts/chrome.ts'</script>` (`:74`) 8. `<script>import '@/scripts/motion/index.ts'</script>` (`:75`).

**Props** (`:21-31`): `page: 'home'|'expertise'|'pillar'|'industries'|'approach'|'impact'|'insights'|'article'|'about'|'contact'|'legal'|'notfound'`,
`seo: SeoProps`, `pillar?: PillarKey`, `breadcrumbs?: Crumb[]` (default `[]`), `ground?: 'white'|'cloud'`, `showCrumbs?` (default
`true`), `cta?: boolean`. All 12 callers: only `approach.astro:31` relies on visible crumbs (`showCrumbs` default); every other
page passes `showCrumbs={false}`. Home passes only `page="home" seo={pageSeo('home')}` (`index.astro:22`).

**Logic to KEEP**
- `showCta = cta ?? !['contact','legal','notfound'].includes(page)` (`:34`).
- `noindex = page === 'notfound' ? true : seo.noindex` (`:35`).
- JSON-LD graph (`:38-41`): `[...(seo.jsonLd ?? [])]`; if `page==='home' && graph.length===0` push `organization(), professionalService(), website()`;
  if `breadcrumbs.length` and no BreadcrumbList yet push `breadcrumbNode(breadcrumbs)`; pass `{...seo, noindex, jsonLd: graph}` to `SeoHead`.
- `bodyStyle = pillar ? pillarStyle(pillar) : undefined` (`:42`) — v3 retires pillar colours; prop must stay for compile.
- `<html lang="en-GB" class="no-js">` (`:45`) — `tests/seo.spec.ts` checks lang.

**Inline head script** (`:49-56`, CSP-hashed): (a) `no-js → js` class swap — KEEP (drives `.js-only`/`.nojs-only`,
`utilities.css:33-34`); (b) adds `html.motion` unless reduced motion + 3 s `motion-failed` timer — DEAD with GSAP (re-implement
only if the new reveal needs a gate); (c) `localStorage 'kk-motion' → html.motion-paused` — DEAD (Pause motion removed);
(d) early-tap capture `__kkMenuPending` for `[data-menu-toggle]` before `chrome-ready` — KEEP (replayed in `chrome.ts:197-198`).

**Font preloads** (`:57-58`): `/fonts/bricolage-grotesque-latin-wdth-normal.woff2`, `/fonts/ibm-plex-mono-latin-400-normal.woff2` —
replace with Source Serif 4 + Inter (packages `@fontsource-variable/source-serif-4`, `@fontsource-variable/inter` already added to
`package.json`, uncommitted). `scripts/copy-fonts.mjs:11-15` FILES list must change too (it also deletes stale woff2 in public/fonts).

**Global CSS** (`:7` → `src/styles/global.css`): imports fonts, tokens, grounds, reset, base, layout, utilities, prose, motion,
`components/notes/notes.css`. Inline `<style is:global>` (`:79-84`): body bg `--kk-white`, `[data-ground="cloud"]` bg, `main:focus{outline:none}`, `.page-crumbs` padding.

### 1.2 `SkipLink.astro`
Renders `<a class="skip-link" href="#main">{microcopy.skip}</a>` ("Skip to content"). Target `main#main tabindex=-1`. KEEP;
`tests/chrome.spec.ts:18` asserts body children order `['skip-link','ann','site-header']` (update test if the bar goes).

### 1.3 `AnnouncementBar.astro` (+ `MotionToggle.astro`)
- Renders (`:8-20`): `div.ann.g-ink[role=region][aria-label="Announcement"]` → dot, `chromeNotes.ann.lead`
  ("Field notes from the plant floor and the boardroom."), link `/insights` `chromeNotes.ann.link` ("Read the insights"); right:
  `hero.footLeft` ("Based in the Netherlands, working worldwide", ≥1024 only) + `<MotionToggle />`.
- DATA: `chromeNotes.ann.{lead,link}` (`data/notes/chrome.ts:9-10`) → **[v3 new]** `microcopy.announcement`, `microcopy.announcementLink`
  (`microcopy.ts:70-71`); `hero.footLeft` (`home.ts:9`).
- Hard-coded: `aria-label="Announcement"` (`:8`).
- MotionToggle (`MotionToggle.astro:10-15`): `button.motion-toggle.js-motion-only[aria-pressed][data-motion-toggle]`
  `data-label-pause/play` = `chromeNotes.motion.{pause,play}` ("Pause motion"/"Play motion"), wired by `scripts/motion/pause.ts`
  (localStorage `kk-motion`, `html.motion-paused`). **DELETE** (brief: remove pause-motion bar). Tests to update:
  `tests/chrome.spec.ts:22-52` (Pause motion), `tests/keyboard.spec.ts:9-12` (`MAX_TABS_TO_CTA = 12` counts ann link + Pause).
- Target: slim navy line "Latest insight — <title> →" from the newest visible insight, or removed. Data available:
  `visibleInsights()` / `featuredInsight()` + `insightHref()` (`lib/insights.ts:15,38,51`). "Latest insight" label is **not in data** (COMPOSED gap).

### 1.4 `Header.astro`
- Renders (`:27-91`): `header.site-header[data-header]` (sticky, keeps `--header-h` in flow) > `.site-header__bar` >
  Logo `horizontal` (`:30`, inline cluster inside `span[data-dock-slot]`) + Logo `horizontal-white` (`:31`, shown only while menu
  open) → `nav.site-nav[aria-label="Main"]` (`:33`, ≥1024) → Expertise `li[data-xp-scope]` with
  `button.site-nav__xp.js-only[aria-expanded=false][aria-controls="expertise-panel"][data-xp-toggle]` (`:37-46`) **and** no-JS
  fallback `a.nojs-only href="/expertise"` (`:47-51`) + `<ExpertisePanel/>` (`:52`) → other links from `main` (`:55-63`) with
  `aria-current="page"` via `isCurrent()` → actions: `Button href="/contact" variant=primary size=sm` `{microcopy.primaryCta}` (`:69`,
  hidden <480px) + `button.menu-btn.js-only[aria-expanded][aria-controls="mobile-menu"][data-menu-toggle][data-label-open=Menu][data-label-close=Close]`
  (`:71-82`) + no-JS `a.menu-btn--link.nojs-only href="#site-footer"` (`:83-86`) → `<MobileMenu/>` (`:89`).
- Current-page logic (`:21-23`): `path = Astro.url.pathname` minus `.html`/trailing slash; `isCurrent(href) = path===href || path.startsWith(href+'/')`;
  `xpCurrent = page==='expertise'||page==='pillar'||isCurrent('/expertise')`. KEEP.
- DATA: `main` (`data/nav.ts:7-14`: Expertise[panel]/Industries/Approach/Impact/Insights/About), `microcopy.primaryCta|menu|close`.
- Hard-coded: `label="KoKreaters home"` (`:30,:31`), `aria-label="Main"` (`:33`), hand-drawn underline path `LINE` (`:17`, DEAD).
- Target delta: brief menu = Expertise (mega) · Industries · Impact · Insights · About (+Approach under About or as item). Contract
  keeps Approach top-level and adds an Industries dropdown. Data change needed only in `nav.ts:7-14` if Approach moves.
- Tests: `keyboard.spec.ts:30` `header a.btn[href="/contact"]:not(#mobile-menu *)` text /Start a conversation/, ≥44px tall, reachable
  in ≤12 tabs; `:58` `header button[data-menu-toggle]` ≥44×44; `smoke.spec.ts:45` one `header.site-header`.

### 1.5 `ExpertisePanel.astro` (desktop disclosure, → MegaMenu)
- Renders (`:20-58`): `div#expertise-panel.xp-panel[hidden]` > left: `ul` of 6 tiles `a[href=/expertise/{slug}]` with
  `pillarNumber(p)` ("01"), `p.name`, `p.promise`; `TextLink /expertise {microcopy.allExpertise}` ("All expertise"); right:
  `{microcopy.featuredInsight}` ("Featured insight") + newest visible insight card (`formatLabel`, DraftRibbon in staging, title link,
  `fill(microcopy.readingTime,{n})` + `formatDate`, `TextLink {microcopy.insightsLink}` "Read the insight"), else `{microcopy.newsletter}`.
- DATA: `pillars[].{key,slug,n,name,promise}`; `pillarGround`, `pillarNumber` (`lib/pillars.ts`); `visibleInsights, formatLabel,
  insightReadingTime, insightHref, isDraft` (`lib/insights.ts`); `fill, formatDate, isoDate` (`lib/format.ts`); `isStaging`.
  Note: uses `(await visibleInsights())[0]`, not `featuredInsight()` (ignores `featured` flag).
- DRAFT: `{isStaging && isDraft(featured) && <DraftRibbon size="sm"/>}` (`:43`).
- Target: brief mega-menu = six areas + one-line descriptions → `p.name` + `p.promise` cover it. Contract left column wants a
  one-line intro: `expertiseOverview.intro` (`pillars.ts:103+`) is 3 sentences — one-liner is a COMPOSED gap.

### 1.6 `MobileMenu.astro` (<1024)
- Renders (`:23-70`): `div#mobile-menu.m-menu.g-ink[hidden][data-lenis-prevent]` > `nav[aria-label="Menu"]` > Expertise group
  `button.m-menu__group[aria-expanded=false][aria-controls="m-menu-xp"][data-menu-group]` (`:29`) → `ul#m-menu-xp[hidden]` six
  pillar links + `a.m-menu__all {microcopy.allExpertise}` (`:34-44`) → `mobile` links (`:47-54`, `a.m-menu__link`) → primary
  CTA `/contact` (`:58`) → details: `mailto:{site.email}`, `WhatsApp: {site.whatsapp.display}`, `LinkedIn` (+visually-hidden
  `({microcopy.opensLinkedIn})`) (`:62-64`) → MarginNote `chromeNotes.menu` (`:66-67`).
- DATA: `pillars`, `pillarGround`, `mobile` + `main` (`nav.ts:19,7`), `microcopy.allExpertise|primaryCta|opensLinkedIn`, `site.email|whatsapp|linkedin`.
- Hard-coded: `aria-label="Menu"` (`:25`); "WhatsApp: " (`:63`) and "LinkedIn" (`:64`) duplicate `footer.contact.whatsapp.label` /
  `.linkedin.label` (`nav.ts:36-37`) — rebuild should import those.
- DELETE: `chromeNotes.menu` 'or just say hello' (`data/notes/chrome.ts:16`; rendered `MobileMenu.astro:66`).
- Tests: `keyboard.spec.ts:64-71` `#mobile-menu` visible, `main[inert]`, Esc returns focus to `[data-menu-toggle]`,
  `a.m-menu__link[href="/contact"]` exists (keep that class or update test).

### 1.7 `Footer.astro`
- Renders (`:15-77`): `footer#site-footer.site-footer.g-ink.grain[tabindex=-1]` (no-JS menu target) →
  top: `Logo full-white href="/" label="KoKreaters home" width=260` (`:18`) + `a[href="#main"] {chromeNotes.top}` "Back to top" (`:20`)
  + MarginNote `chromeNotes.footer` (`:21-22`) → 4 cols (`:26-57`): `nav[aria-labelledby=ft-expertise]` `footer.expertise`
  (heading + 6 `expertiseLinks`), `nav[aria-labelledby=ft-company]` `footer.company` (Approach, Impact, About, Insights, Industries),
  Contact col (`footer.contact.email`, `.whatsapp` `rel=noopener`, `.linkedin` `rel="me noopener"` + visually-hidden
  `microcopy.opensLinkedIn` + external icon, `.base` "Based in the Netherlands, working worldwide"), Newsletter col
  (`footer.newsletter.heading` "Newsletter" + `<Newsletter variant="footer"/>`) → bottom (`:59-71`): "© 2026 {site.name}{site.trademark}"
  (`:61`, renders "© 2026 KoKreaters™"), `legal` links Privacy/Cookies/Terms (`:62-64`), `button.site-footer__settings.js-only
  [data-cookie-settings][aria-haspopup=dialog][aria-controls=cookie-settings] {microcopy.cookieSettings}` (`:66`), registration
  `{site.legal.registration ?? <Confirm id={11} note="KvK / VAT / registered address"/>}` (`:69`) → aria-hidden giant
  `Logo wordmark-white` sign-off (`:73-75`, DEAD).
- DATA: `footer`, `legal` (`nav.ts:21-41,43-47`), `microcopy.opensLinkedIn|cookieSettings`, `chromeNotes.top|footer` (→ `microcopy.backToTop` [v3 new]), `site.name|trademark|legal.registration`.
- Hard-coded copy: "© 2026 " (`:61`), `label="KoKreaters home"` (`:18`), Confirm note "KvK / VAT / registered address" (`:69`).
- DELETE: `chromeNotes.footer` 'thanks for reading all the way down' (`notes/chrome.ts:18`; `Footer.astro:21`).
- BORDERLINE: `site.trademark: '™'` (`site.ts:21`, CONFIRM 12) — brief target reads "© 2026 KoKreaters" with no ™.
- Target delta: four columns **Expertise, Company, Insights, Contact** + newsletter field + LinkedIn icon + KvK + legal.
  Insights column has **no data** in `nav.ts`; build from `visibleInsights()` (latest 3; empty in production) and/or the format
  filters `/insights?format=point-of-view|field-notes|explainer` (labels `formatLabels`, `microcopy.ts:83+`; the hub reads
  `?pillar=`/`?format=` — `scripts/pages/insights.ts:65-85`). "All insights" label not in data (COMPOSED). Company list per contract
  (About, Approach, Impact, Industries, Contact) differs from `nav.ts:25-31` — edit data, don't hard-code. KvK: `site.legal.registration`
  is `null` → CONFIRM 11 gap.

### 1.8 `CookieConsent.astro` + `src/scripts/consent.ts`
- Renders: always `dialog#cookie-settings[aria-labelledby=cookie-settings-title]` (`:11-38`) with `<form method="dialog">`:
  h2 `{microcopy.cookieSettings}`, row "Essential: always on" (checked+disabled), row analytics: if `site.analytics` → `input
  [data-consent-analytics]` + label "Analytics" (`:23`) else disabled + `{microcopy.analyticsNotInUse}`; link `/cookies` "Cookies" (`:33`);
  close `button[data-dialog-close] {microcopy.close}`. Only when `PUBLIC_ANALYTICS=1`: `section.cookie-bar[role=region]
  [aria-label="Cookie consent"][data-cookie-bar][hidden]` with `cookieBanner` text + Accept all / Reject non-essential / Settings (`:40-49`).
- Behaviour KEEP (`consent.ts`): `[data-cookie-settings]` click → `dialog.showModal()` (fallback `open` attr), remembers opener and
  refocuses on `close`; backdrop click closes; analytics mode: bar shown if no stored choice; `localStorage['kk-consent'] =
  {v:1, analytics, ts}` (try/catch); `onConsent(cb)` hook for a future analytics loader.
- **Gotcha:** `initConsent()` is only invoked in `scripts/motion/index.ts:81`. Move to the new site script.
- Hard-coded: "Analytics" (`:23`), "Cookies" (`:33`), `aria-label="Cookie consent"` (`:41`).
- Contract note: "only renders when PUBLIC_ANALYTICS is set" — but the footer's "Cookie settings" button needs the dialog today; keep
  the dialog unconditionally or drop the button when analytics is off.

### 1.9 `Breadcrumbs.astro`
`withHome(items)` prepends `{label: microcopy.homeCrumb ('Home'), href:'/'}` unless trail starts at `/` (`schema.ts:160-163`).
Renders `nav.crumbs[aria-label="Breadcrumb"] > ol > li` with links, last item `<span aria-current="page">`, "/" separators
`aria-hidden`. `tone` prop accepted but unused (`:6`). JSON-LD twin built in BaseLayout. Not rendered on home. KEEP mechanism.

### 1.10 `src/components/shared/CtaField.astro` (closing CTA on every page except contact/legal/404)
- Renders (`:21-40`): `section.cta-field.band.g-saffron.grain[aria-labelledby=cta-heading][data-cta]` → `MagneticDots` (`:22`, DEAD)
  → h2#cta-heading `{before}<Scribble kind="circle">{cta.swooshPhrase}</Scribble>{after}` = "Have a challenge worth solving together?" (`:25`)
  → `{cta.body}<Confirm id={9} note="free first call"/>` (`:26`) → `Button href={site.bookingUrl} variant=primary {cta.button}`
  "Book a 30-minute call" (`:28`) + `a.cta-field__mail mailto:{site.email}` (`:29`) + MarginNote `chromeNotes.cta` (`:30-31`)
  → Sticker + `Logo variant="cluster"` (`:35-37`, DEAD).
- DATA: `cta.{headline,swooshPhrase,body,button}` (`home.ts:36-40`), `site.bookingUrl` (`site.ts:15`, default `'/contact#form'`,
  anchor exists: `ContactForm.astro:30 id="form"`), `site.email`.
- DELETE: `chromeNotes.cta` 'we’re all ears' (`notes/chrome.ts:17`; `CtaField.astro:30`).
- CONFIRM 9 (`:26`). Current `cta.body` (`home.ts:38`, edited in working tree): "Tell us about your product, your plant or your
  decision. The first conversation is free of charge." (was "…is on us."). BORDERLINE: the "free" promise is itself CONFIRM 9.
- Target: brief §8 wants this band **plus newsletter signup** on home only (contract: `CtaBand newsletter` prop).

### 1.11 `src/components/shared/Newsletter.astro`
- Props `variant: 'fold'|'footer'`; ids `nl-{variant}-email`, `nl-{variant}-email-error`.
- Renders: `{microcopy.newsletter}` (`:15`, now "Field notes from the plant floor and the boardroom, once a month." [edited]) → if
  `site.newsletterEndpoint`: `form.newsletter__form[method=post][action=endpoint][novalidate][data-newsletter]` with visually-hidden
  label `{microcopy.emailLabel}`, `input[type=email][name=email][autocomplete=email][required][aria-describedby]`, submit
  `{microcopy.newsletterButton}`, empty `p.field-error[hidden]`, required consent checkbox `{microcopy.newsletterConsent}` with
  "Privacy Policy" substring linked to `/privacy` (`:26`, hard-coded split string) → else fallback: fold = `Button href=mailto
  variant=hand`, footer = `TextLink href=mailto` (`:30`). `mailto` = `mailto:{site.email}?subject={microcopy.newsletterMailtoSubject}` (`:11`).
- **No script handles `[data-newsletter]`** (grep: zero hits in `src/scripts`). `microcopy.invalidEmail` exists but is only used by
  ContactForm. Brief wants a real email field → needs endpoint (`PUBLIC_NEWSLETTER_ENDPOINT`, empty) or a defined fallback (gap).
- CSP: `scripts/csp-hash.mjs` adds `PUBLIC_NEWSLETTER_ENDPOINT` origin to `form-action`/`connect-src` at build — keep env-driven.

### 1.12 SEO: `SeoHead.astro`, `JsonLd.astro`, `schema.ts`, `src/lib/seo.ts`, `src/data/seo.ts`
- `SeoHead` (`:16-59`) emits, in order: `<title>`, meta description, canonical (`canonicalFor(seo.path)`), robots
  (`isStaging || seo.noindex ? 'noindex, nofollow' : 'index, follow'`, `:17`), icons (`/favicon.svg`, `/favicon-32.png`,
  `/apple-touch-icon.png`), `/site.webmanifest`, `theme-color #FFFFFF` (`:37`; v3 may want navy), og:site_name "KoKreaters",
  og:locale en_GB, og:type/title/description/url/image (+type/width 1200/height 627/alt), article:* when `seo.article`,
  twitter summary_large_image ×4, hreflang `en` + `x-default`, `<JsonLd graph>`. OG fallback (`:20-25`): `/og/default.png` when
  `seo.ogImage` names a `/og/*` file missing from `public/og`.
- `JsonLd` (`:6-10`): one `<script type="application/ld+json">` with `{'@context','@graph'}`, `<` escaped.
- `schema.ts`: `SeoProps` (`:10-19`), `abs`, `canonicalFor`, ids `#org/#service/#website/about#ganeaysh`, `POSITIONING_STATEMENT`
  (`:35-36`, verbatim brief §1), `TARGET_TERMS` (`:39-55`, 15 brief §8 terms → `knowsAbout`), `organization()` (`:57`, logo
  `/brand/kokreaters-logo-512.png`, `foundingDate '2026'` CONFIRM 13 `:65`, `sameAs: []` C-7 `:67`), `professionalService()` (`:71`,
  `telephone '+31622157910'` hard-coded `:81`, `hasOfferCatalog` of the six pillars), `website()` (`:95`), `person()` (`:107`),
  `article()` (`:137`), `withHome()` (`:160`), `breadcrumbs()` (`:165`). KEEP all; no visual dependency.
- `lib/seo.ts`: `assertLengths()` runs at import (`:21`) → **build fails** if any `seo.ts` title >60 or description >155 chars.
  `pageSeo(key)` (`:23-33`; `ogType 'profile'` for about), `articleTitle`, `articleSeo`, `canonical`.
- `data/seo.ts:16` home: title "KoKreaters | Oils, Fats and Food Ingredients Consulting", description "Independent technical and
  strategy consulting for food, nutrition and specialty-ingredient businesses. 25 years of plant-to-boardroom leadership.",
  og `/og/home.png`. Note: OG PNGs in `public/og/*` were rendered from the v2 look (`npm run og`) — regenerate for v3 visuals.

### 1.13 `src/scripts/chrome.ts` (KEEP mechanism; restyle only)
Boot: own module entry, `DOMContentLoaded` (`:231`); adds `html.chrome-ready` (`:227`).
- Header scroll: `[data-header]` gets `.is-scrolled` when `scrollY > 8` (passive scroll + rAF, `:25-35`). Hide-on-scroll
  (`.is-hidden`) is separate, in `scripts/motion/index.ts:56-77` (DEAD with GSAP; contract does not ask for it).
- Expertise disclosure (`:38-114`): `[data-xp-toggle]` + `#expertise-panel` inside `[data-xp-scope]`; click toggles (keyboard click
  `e.detail===0` = 'keyboard'); hover intent on `(hover:hover) and (pointer:fine)` + ≥1024: open after 120 ms, close 200 ms after
  leave (not if opened by keyboard); a click within 600 ms of hover-open keeps it open; Esc closes + refocuses trigger; `focusout`
  leaving scope closes; `pointerdown` outside closes; leaving desktop MQ closes; close waits `closeMs()` (160 ms, 0 reduced) before
  `hidden=true`; sets `aria-expanded`.
- Mobile menu (`:117-201`): `[data-menu-toggle]` + `#mobile-menu`; open sets `--mx/--my` (circle origin, DEAD styling), `hidden=false`,
  `.is-open`, `aria-expanded`, label text swap from `data-label-open/close`, `html.menu-open`, scroll lock (body `position:fixed;
  top:-Y`, restore + Lenis `scrollTo` on close, `:203-215`), `inert` on `main, footer.site-footer, .skip-link`, focus trap
  (Tab cycles toggle + visible focusables), Esc closes + refocus, any link click closes, ≥1024 MQ closes, `[data-menu-group]`
  sub-disclosures toggle `aria-expanded` + target `hidden`, replays `__kkMenuPending`.
- Panels are mutually exclusive (`initChrome`, `:224-226`).

### 1.14 `src/lib/*` (all KEEP; pure functions)
| module | exports | used by home/chrome |
|---|---|---|
| `lib/mode.ts` | `SiteMode`, `mode`, `isStaging` (`:8`), `isProduction` (`:9`), `confirmItems` (`:15-30`, ids 1–14 titles) | Confirm, DraftRibbon, SeoHead, ExpertisePanel, insights |
| `lib/insights.ts` | `Insight`, `readingTime`, `visibleInsights()` (`:15`), `comingSoon()` (`:23`), `byPillar`, `comingSoonByPillar`, `featuredInsight()` (`:38`), `isDraft` (`:44`), `formatLabel` (`:46`), `insightReadingTime` (`:49`), `insightHref` (`:51`) | ExpertisePanel, InsightsFold |
| `lib/pillars.ts` | `pillars`, `pillarKeys`, `getPillar`, `getPillarBySlug`, `pillarHref`, `isPillarKey`, `pillarVars`, `pillarStyle`, `pillarNumber` ("01"), `pillarGround`/`pillarTintGround` (v2 colour grounds — DEAD for styling) | BaseLayout, ExpertisePanel, MobileMenu, PillarCard |
| `lib/format.ts` | `formatDate` ("4 Nov 2026", en-GB UTC), `isoDate`, `pad2`, `fill('{n} min read',{n})`, `dotJoin` | ExpertisePanel, CoverStory |
| `lib/typography.ts` | `NNBSP`, `MINUS`, `minus25` ("−25 °C" with U+2212 + U+202F), `normaliseFigures`, `fig`, `figHtml` (wraps emphasis in `<span class="fig">`, `data-frost` on −25 °C), `abbreviations` (FSQR, CBE, iTFA, 3-MCPD, GE, DAG, FFA) | ImpactCard, RouteMap, impact.ts |
| `lib/seo.ts` | see §1.12 | index.astro |
| `lib/reading-time.ts` | `WORDS_PER_MINUTE=220`, `countWords`, `readingTime` | insights |

---------------------------------------------------------------------------------------------------------------------------

## 2. Home `/` (`src/pages/index.astro`)

Current order (`index.astro:22-34`), 11 folds + the layout CTA (~16,700 px tall):

| # | component | ground | renders (1 line) |
|---|---|---|---|
| F1 | `Hero` | white | overline, 3-line hard-coded H1 with swoosh, elastic HeroNetwork toy, sub, 2 buttons, base + 5 places |
| F2 | `IndustryMarquee` | ink | aria-hidden scrolling marquee of the 9 industry names |
| F3 | `ProofBand` | imperial + WebGL | spinning stamp, h2 "From our founder’s career", split-flap board, 4 counted stats on a line, WHO note |
| F4 | `Positioning` | white grid | folio "Our promise", scrubbed h2, hand Venn, promise with highlight, `<details>` range paragraph |
| F4b | `PlantPipeline` | ice, pinned 250vh | principle "Plant floor to boardroom" + scrubbed refinery-pipe diagram with 6 stations + notes |
| F5 | `WhatWeDo` | white, pinned rail | sideways rail: intro + hub diagram, 6 PillarCards, "All expertise" end card |
| F6 | `MethodFold` | lavender | "Connect. Collaborate. Create." as dropping stickers, dashed method line, `<details>` step copy, "How we work" |
| F7 | `ImpactFold` (+`RouteMap`) | white | h2 + burst sticker, dot-matrix route map, 4 ImpactCards with count-ups, "See the impact" |
| F8 | `WhereWeWork` | blush | h2 "Where we work." + GravityTags physics box of the 9 industry links |
| F9 | `InsightsFold` | white | h2 + native rail of ≤4 CoverStory cards + ≤3 "In preparation" cards + Newsletter strip |
| F10 | `FounderFold` | sapphire | cut-out photo on saffron disc + tape/doodles, quote with underline, attribution, "Meet Ganeaysh", Confirm 4 |
| — | `CtaField` (BaseLayout) | saffron | see §1.10 |

Motion for all of it: `scripts/pages/home.ts` (`initHero`+`initDock` `:310-324`, `initProof`, `initPipeline`, `initHub`,
`initMethodLine`, `initRouteMap`, `initLazy` → gravity-tags, home-emulsion, magnetic-letters) + shared GSAP recipes. All DEAD.

### F1 `Hero.astro`
- Renders: `section.hero[aria-labelledby=hero-heading][data-hero-root]` (`:18`); overline split on " · " and re-joined with
  decorative " ✶ " + visually-hidden " · " (`:16,:20`); `<MagneticLetters>` wrapping H1 (`:23-25`); MarginNotes (`:26,:29`);
  `HeroNetwork` (`:28`); `hero.sub` (`:34`); `Button primary arrow {hero.primary.label}` → `/contact` (`:36`);
  `Button variant="hand" data-hero-explore {hero.secondary.label}` → `/expertise` (`:37`); foot: `hero.footLeft` + `hero.footRight`
  joined with "·" (`:42-43`).
- DATA (`@/data/home` `hero`, `home.ts:2-11`): `overline` "Independent technical and strategy consulting · Food, feed and specialty
  ingredients", `headline` "Where deep expertise meets shared ambition." (CONFIRM 2, option A), `swooshPhrase` "shared ambition"
  (DEAD), `sub` "KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and
  make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation.", `primary {label:'Start a
  conversation', href:'/contact'}`, `secondary {label:'Explore our expertise', href:'/expertise'}`, `footLeft` "Based in the
  Netherlands, working worldwide", `footRight` ['India','Indonesia','Ukraine','Türkiye','the Netherlands'].
- HARD-CODED (must come from data in rebuild): H1 text `Hero.astro:24` —
  `<span class="l">Where deep</span> <span class="l">expertise meets</span> <span class="l hero__l3"><Scribble …>shared ambition</Scribble>.</span>`;
  separator " ✶ " (`:20`, DELETE → "·").
- DELETE: `homeNotes.hero.shared` 'that’s you + us' (`notes/home.ts:7`; `Hero.astro:26`); `homeNotes.hero.pull` 'pull a node,
  it’s all connected' (`notes/home.ts:8`; `Hero.astro:29`); MagneticLetters, HeroNetwork (toy: `data-toy data-cursor="pull"`,
  `HeroNetwork.astro:35`), swoosh Scribble, `variant="hand"` button.
- `HeroNetwork.astro` data: `pillars` + `heroNodeLabels` (`pillars.ts:133+`, COMPOSED; DEAD with the network).
- KEEP behaviour: single `<h1 id>` per page (`smoke.spec.ts:43`), H1 is the LCP element and must never be hidden at load
  (`motion.css:17` rule exists for this reason).

### F2 `IndustryMarquee.astro` — DELETE whole fold
`Marquee items={industries.map(i=>i.name)} ground="ink" speed={60}` (`:6,:9`), `aria-hidden` (`Marquee.astro:13`). No unique content
(names repeat F8). Marquee hex separators `#2C509E #E5494D #F4C841 #4C9BE8 #306FE0` (`Marquee.astro:10`).

### F3 `ProofBand.astro` → credibility strip
- Renders: `section[data-proof][aria-labelledby=proof-heading]` (`:15`); decorative radial discs SVG (`:17-26`) + `canvas[data-emulsion]`
  (`:27`, WebGL metaballs, DEAD); `Stamp text="${proofSource} · ${proofSource} ·" spin` around `NodeCluster` (`:33-35`, DEAD);
  **`h2#proof-heading` = `{proofSource}`** (`:36`) — the section heading is the source line; `FlapBoard entries={homeNotes.proof.flap}`
  (`:38`, DELETE); line + nodes (`:42`); `ul.proof__grid` of `proof[]`: counted values render `span[data-count aria-hidden]` +
  visually-hidden twin; non-numeric "WHO" in `span[data-proof-word]`; label (`:43-55`); MarginNote who (`:56`).
- DATA: `proof` (`home.ts:12-17`): `{value:'25',count:25,label:'years in oils, fats and food ingredients'}`,
  `{value:'5',count:5,label:'countries of plant and operational leadership'}`, `{value:'3',count:3,label:'regions of teams led:
  Americas, EMEA, Asia-Pacific'}`, `{value:'WHO',label:'Director-General recognition for trans-fat elimination work'}`;
  `proofSource` "From our founder’s career" (`home.ts:18`). `count` field DEAD (no counters in v3).
- HARD-CODED: Stamp ring text template (`:33`, DEAD).
- DELETE: `homeNotes.proof.who` 'yes, that WHO' (`notes/home.ts:11`; `ProofBand.astro:56`); `homeNotes.proof.flap`
  ['INDIA · WILMAR','INDONESIA · WILMAR','UKRAINE · −25 °C','TÜRKIYE','THE NETHERLANDS'] (`notes/home.ts:12`, DERIVED; the datelines
  already exist in `founderResults[].dateline`).
- Gap: brief wants a small "From our founder’s career." line (period) and a visible section label; no eyebrow string in data
  (contract suggests "Our track record" — COMPOSED).

### F4 `Positioning.astro` — removed from v3 home (contract §4); content still worth keeping somewhere (About/Approach?)
- Renders: `Section ground=white paper=grid folio={{label: positioning.folio}}` (`:19`); `h2#promise-heading data-scrub-words
  {positioning.headline}` (`:20`); `Venn` (`:23`); MarginNote (`:24`); promise with `Scribble kind=highlight` on HL (`:27`);
  `<details class="truth">` summary `homeNotes.positioning.more` + body `positioning.range` (`:28-31`).
- DATA (`home.ts:19-24`): `positioning.folio` "Our promise" (COMPOSED), `.headline` "Deep expertise, shared ownership, measurable
  results.", `.promise` "We do not hand over a report and leave. We build the answer with your people, so it still works after we have
  gone.", `.range` "What makes KoKreaters different is range. Most consultants are either plant engineers or strategists. KoKreaters
  works from the plant floor to the boardroom: designing a product, fixing a process, passing a customer audit, valuing an acquisition
  and writing the business plan, all with the same person who has done it inside global companies."
- HARD-CODED: `const HL = 'We build the answer with your people'` (`Positioning.astro:15`, highlight split; DEAD).
- DELETE: `homeNotes.positioning.circle` 'most consultants pick one circle' (`notes/home.ts:16`; `:24`); Venn labels
  `homeNotes.positioning.venn` ['plant floor','lab','boardroom','the same person'] (`notes/home.ts:15`); summary
  `homeNotes.positioning.more` 'Read the whole truth' (`notes/home.ts:17`; also `MethodFold.astro:40`) → `microcopy.readMore`
  "Read more" [v3 new, `microcopy.ts:73`].
- FLAG: brief says KEEP all core copy/headlines; the 8-section home drops this brief-§1 positioning block. `positioning.*` is used
  **only** on home today (grep) — if not placed elsewhere it disappears from the site. Decide placement (About or Approach).

### F4b `PlantPipeline.astro` — DELETE from home (static version → Process Design page per contract)
- Renders: pinned `section[data-pipeline]` (`:35`); `Folio label={principlesHeading}` "Principles" (`:38`); h2 `{lead.name}` + "."
  where `lead = principles[0]` = "Plant floor to boardroom" (`:17,:40`); `{lead.copy}` "We are as comfortable in a control room as in
  a board meeting, and we connect the two." (`:41`); focusable `div[data-pipeline-viewport][tabindex=0][role=group]` (`:45`); SVG with
  `<title>{P.title}</title>` + `<desc>` of station labels (`:48-49`); 6 stations; sign `{P.sign}` (`:118`); 2 MarginNotes (`:142-143`);
  visually-hidden `<ol>` of labels (`:146-148`); hint `{P.scroll} →` (`:149`).
- DATA: `principles`, `principlesHeading` (`approach.ts:16-23`, also on /approach — not lost); `homeNotes.pipeline.*`.
- DELETE (`notes/home.ts:20-30`): title 'From crude oil on the plant floor to a decision in the boardroom' (DERIVED), station props
  'Crude comes in', 'Refine it right', 'Split the fractions', 'Blend to spec', 'Product that ships', 'Go or No-Go', sign 'GO', notes
  'one pipe, one person', 'and up it goes', hint 'scroll, it flows' (+ hard-coded "→" `PlantPipeline.astro:149`).

### F5 `WhatWeDo.astro` (+ `PillarCard.astro`) → "What we do" 3×2 grid
- Renders: `section[data-whatwedo][aria-labelledby=whatwedo-heading]` (`:25`) → `Rail label={whatWeDo.headline} id="pillar-rail" pin` (`:26`)
  → intro li: `Folio n="01" label={whatWeDo.overline}`, hub SVG (`:30-41`, DEAD), `h2#whatwedo-heading {whatWeDo.headline}` (`:42`),
  `{whatWeDo.intro}` (`:43`), 2 MarginNotes (`:44-45`) → 6× `PillarCard variant="rail"` (`:48-50`) → end card `a[href=/expertise]
  {microcopy.allExpertise}` (`:52-56`).
- PillarCard (`PillarCard.astro:30-36`): whole card is one `<a href=/expertise/{slug}>`; "{pillarNumber(p)} / 06" (`:31`, "/ 06"
  hard-coded); heading `{p.promise}` (`h3`); label `{p.name}`; SpecLabel rows `pillarPage.deliverables` "Typical deliverables" →
  `p.deliverables.join(' · ')`, and if `p.impactId` `pillarPage.fromTheRecord` "From our founder’s career" → `result.dateline`;
  faux pill `{microcopy.pillarLink}` "Learn more".
- DATA: `whatWeDo` (`home.ts:25`): `overline` "What we do", `headline` "Six ways we create value, together.", `intro` "From the first idea
  to the last audit, we work wherever technology and business meet."; `pillars[].{key,slug,n,name,promise,deliverables,impactId}`
  (`pillars.ts:4-101`); `pillarPage` (`pillars.ts:111-115`); `founderResults` (dateline); `microcopy.pillarLink|allExpertise`.
- DELETE: `homeNotes.whatWeDo.sideways` 'keep scrolling, it moves sideways', `.swipe` 'swipe for all six' (`notes/home.ts:33-34`;
  `WhatWeDo.astro:44-45`); rail + pin + ±1° rotations + rail Prev/Next/"{i} / {n}" (`chromeNotes.rail.*`, `notes/chrome.ts:20-24`).
- Gap: brief card = icon + title + one-line promise + Learn more. **No icon data exists**; contract maps Lucide: innovation
  `flask-conical`, process `factory`, quality `shield-check`, strategy `split`/`signpost`, deals `file-search`, capability `users`
  (`lucide-static` already in package.json).

### F6 `MethodFold.astro` — removed from v3 home (Approach page keeps it)
- Renders: `Section ground=lavender folio={{n:'02', label: method.overline}} data-method-fold` (`:21`); h2#method-heading = three
  `Sticker` pills, words from `method.headline.split(' ')` (`:18,:22-26`); `MethodLine scrub` with `{stepLabels.step} {s.n} · {s.name}`
  (`:28-36`); MarginNotes (`:32-33`); `<details>` with `steps[].name/copy` (`:39-44`); `Button href={method.link.href} variant=hand
  {method.link.label}` "How we work" → `/approach` (`:45`).
- DATA: `method` (`home.ts:26`): `overline` "The KoKreaters way", `headline` "Connect. Collaborate. Create.", `link {label:'How we work',
  href:'/approach'}`; `steps`, `stepLabels` (`approach.ts:9-14`, also used on /approach).
- DELETE: `homeNotes.method.connect` 'listening comes first', `.create` 'with proof that it works' (`notes/home.ts:37-38`).
- FLAG: `method.*` home strings are home-only (grep). If the fold goes, "The KoKreaters way" / "How we work" vanish (Approach page has
  its own copy in `approach.ts`). Fine per contract; note in hand-off.

### F7 `ImpactFold.astro` (+ `RouteMap.astro`, `ImpactCard.astro`) → navy Results band
- Renders: `Section ground=white folio={{n:'03', label: impact.overline}}` (`:22`); `h2#impact-heading {impact.headline}` (`:24`);
  burst `Sticker` with `{proofSource}` (`:25`, DEAD); `<RouteMap/>` (`:27`, DEAD); `ul` of 4 `ImpactCard result={r} as="div"
  border={border[r.id]} figure={figure[r.id] ?? r.figure?.value} secondary={secondaryFigures[r.id]}` (`:28-35`); MarginNote cold on
  ukraine (`:32`); `Button href={impact.link.href} variant=hand {impact.link.label}` "See the impact" → `/impact` (`:36`).
- ImpactCard (`ImpactCard.astro:23-34`): dateline (`result.dateline`), big figure (`data-count`, visually-hidden twin, `data-frost` on −25),
  secondary figure, `figHtml(result.homeLine, result.emphasis)` with `iTFA` wrapped in `<abbr title="industrially produced trans-fatty
  acids">` + note `abbreviations.iTFA.note` "iTFA: industrially produced trans-fatty acids" (`:15-16,:33`). KEEP the abbr behaviour.
- DATA: `impact` (`home.ts:27`): `overline` "Impact · From our founder’s career", `headline` "Results that started on the plant floor.",
  `link {label:'See the impact', href:'/impact'}`; `founderResults` (`impact.ts:9-42`): ids `india|indonesia|ukraine|tfa`, fields
  `dateline` ("India · Wilmar", "Indonesia · Wilmar", "Ukraine · Wilmar", "Cargill"), `homeLine` (4 brief lines, e.g. "Ukraine’s first
  cold-climate crude palm oil refinery, commissioned at −25 °C, cost structure improved by 15%."), `emphasis`, `figure?.value`
  (indonesia "21%", ukraine `minus25`); `secondaryFigures` `{ukraine:'15%'}` (`impact.ts:45`); **[v3 new]** `figureFallback`
  `{india:'1st', tfa:'WHO'}` (`impact.ts:51`) replacing `homeNotes.impact.indiaFigure` + hard-coded `'WHO'` (`ImpactFold.astro:20`);
  **[v3 new]** `routeMapTitle` (`impact.ts:54`, only if a static map survives).
- HARD-CODED: `border` pillar map (`:19`, DEAD), `tfa: 'WHO'` (`:20`, now in `figureFallback`).
- DELETE: `homeNotes.impact.cold` 'yes, minus twenty-five' (`notes/home.ts:41`; `ImpactFold.astro:32`); `homeNotes.impact.base`
  'home base' (`notes/home.ts:44`; `RouteMap.astro:70`); route map (`d3-geo`/`topojson-client`/`world-atlas` build-time, coords
  hard-coded `RouteMap.astro:25-31`).
- Brief small line "From our founder’s career (Wilmar / Cargill)" → compose from `proofSource` + dateline companies (no new string needed
  beyond the parentheses).

### F8 `WhereWeWork.astro` (+ `GravityTags.astro`) → Industries 3×3 grid
- Renders: `Section ground=blush folio={{n:'04', label: fold.overline}}` (`:12`); `h2#industries-heading {fold.headline}` + "." (`:15`);
  MarginNote toss (`:16`); `GravityTags items label={fold.headline}` = real `ul[aria-label] > li > a.gtags__tag[href=/industries#{slug}]`
  (`GravityTags.astro:21-27`), physics toy `data-toy data-cursor="throw"` (DEAD).
- DATA: `industries` fold copy (`home.ts:28`): `overline` "Where we work", `headline` "Where we work" (duplicate); `industries[]`
  (`industries.ts:4-14`): `n`, `slug`, `name`, `copy`, `pillars`. Link target `/industries#${i.slug}` (`WhereWeWork.astro:10`) — anchors
  exist: `SectorSection.astro:15 <section id={i.slug}>`. KEEP link scheme.
- DELETE: `homeNotes.industries.toss` 'go on, toss one' (`notes/home.ts:47`; `WhereWeWork.astro:16`).

### F9 `InsightsFold.astro` (+ `CoverStory.astro`, `Newsletter`) → Featured insights
- Renders: `Section ground=white folio={{n:'05', label: fold.overline}} container={false}` (`:20`); `h2#insights-heading {fold.headline}`
  (`:22`); MarginNote fresh if any visible (`:23`); `Rail id="insights-rail"` (`:25`) of `(await visibleInsights()).slice(0,4)` as
  `CoverStory variant="card" headingLevel="h3"` (`:17,:26`) + `(await comingSoon()).slice(0,3)` as unlinked `div.soon-card` with
  `{microcopy.inPreparation}` "In preparation" + `{e.data.title}` (`:18,:27-35`); `Newsletter variant="fold"` + MarginNote quiet (`:38-40`).
- CoverStory (`CoverStory.astro:33-48`): `article` with `{formatLabels[d.format]} · {pillar?.shortLabel}`, title link `/insights/{id}`
  (stretched `::after` link), standfirst, byline `FounderPhoto avatar` + **hard-coded "Ganeaysh Kulkarni"** (`:46`, should be
  `founderName` `founder.ts:5`) + reading time + date; `{isDraft && <DraftRibbon size="sm"/>}` (`:40`, DraftRibbon self-gates on
  `isStaging`); `d.image` → `<Image>` (none set).
- DATA: `insights` fold copy (`home.ts:29`): `overline` "Insights", `headline` "Ideas from the plant floor and the boardroom.";
  collection `insights` schema (`content.config.ts:7-20`): `title, standfirst, description, pillar, format, status, review, date?,
  updated?, author, image?, imageAlt?, featured`; `formatLabels` {point-of-view:'Point of view', field-notes:'Field notes',
  explainer:'Explainer'}; `microcopy.inPreparation|readingTime`; `pillars[].shortLabel`.
- Current entries: drafts (staging only) `3-mcpd-glycidyl-esters-playbook` (quality, point-of-view, 2026-11-04),
  `trans-fat-elimination-inside-a-plant` (innovation, point-of-view, 2026-11-04); coming-soon `bleaching-earth` (process, explainer),
  `cocoa-butter-equivalents-india` (innovation, point-of-view), `passing-pre-approval-audit` (quality, field-notes),
  `refining-palm-oil-minus-25` (process, field-notes). `featured: true` on none.
- DELETE: `homeNotes.insights.fresh` 'fresh from the notebook' (`notes/home.ts:50`; `:23`); `homeNotes.newsletter.quiet`
  'no noise, really' (`notes/home.ts:53`; `:39`); rail.

### F10 `FounderFold.astro` → Founder band
- Renders: `section.founder.g-sapphire.grain[aria-labelledby=founder-heading]` (`:24`); saffron disc `data-parallax` + `Tape` + 2 `Doodle`
  (`:27-31`, DEAD); `FounderPhoto variant="cutout" loading=lazy` (`:33`); MarginNote him (`:35`); `Folio n="06" label={founderQuote.folio}`
  (`:39`); **visually-hidden** `h2#founder-heading {founderQuote.attribution}` (`:40`); decorative “ (`:42`); blockquote with
  `Scribble underline` on UL (`:44`); `figcaption {founderQuote.attribution}` (`:46`); `Button variant="ghost-on-dark"
  {founderQuote.link.label}` → `/about` (`:49`); `<Confirm id={4}/>` (`:50`).
- DATA: `founderQuote` (`home.ts:30-35`): `folio` "Founder" (COMPOSED), `quote` "Co-creation and creativity are at the soul of everything
  we do. We do not just advise. We create with you." (CONFIRM 4), `attribution` "Ganeaysh Kulkarni, Founder", `link {label:'Meet
  Ganeaysh', href:'/about'}`; `portraitAlt.founder` "Ganeaysh Kulkarni, founder of KoKreaters" (`founder.ts:73+`, via FounderPhoto).
- HARD-CODED: `const UL = 'We create with you.'` (`:20`, DEAD), “ glyph (`:42`).
- DELETE: `homeNotes.founder.him` 'that’s Ganeaysh' (`notes/home.ts:56`; `:35`).

---------------------------------------------------------------------------------------------------------------------------

## 3. DATA exports the rebuild must import (not re-type)

| import path | export | fields used | where (today) | v3 target |
|---|---|---|---|---|
| `@/data/home` | `hero` | overline, headline, sub, primary{label,href}, secondary{label,href}, footLeft, footRight[] (swooshPhrase DEAD) | Hero, AnnouncementBar (footLeft), RouteMap (footRight) | Hero band (+ base/places line) |
| `@/data/home` | `proof` | value, label (count DEAD) | ProofBand | StatStrip |
| `@/data/home` | `proofSource` | string | ProofBand, ImpactFold | StatStrip source, Results small line |
| `@/data/home` | `positioning` | folio, headline, promise, range | Positioning | not on v3 home — place elsewhere |
| `@/data/home` | `whatWeDo` | overline, headline, intro | WhatWeDo | §3 SectionHeader |
| `@/data/home` | `method` | overline, headline, link | MethodFold | dropped from home |
| `@/data/home` | `impact` | overline, headline, link | ImpactFold | §5 Results header + link |
| `@/data/home` | `industries` | overline, headline | WhereWeWork | §6 header (alias: `industries as fold`, name clashes with `@/data/industries`) |
| `@/data/home` | `insights` | overline, headline | InsightsFold | §4 header |
| `@/data/home` | `founderQuote` | folio, quote, attribution, link | FounderFold | §7 |
| `@/data/home` | `cta` | headline, body, button (swooshPhrase DEAD) | CtaField | §8 CtaBand |
| `@/data/home` | `runningHead` | — | unused | DEAD |
| `@/data/pillars` | `pillars` | key, slug, n, name, promise, deliverables, impactId, shortLabel (hex/colourVar/inkText not for styling) | ExpertisePanel, MobileMenu, PillarCard, HeroNetwork, WhatWeDo, schema.ts, nav.ts | ExpertiseCards, MegaMenu, MobileMenu |
| `@/data/pillars` | `pillarPage` | deliverables, fromTheRecord, helpWith | PillarCard | optional card meta |
| `@/data/pillars` | `heroNodeLabels` | — | HeroNetwork | DEAD |
| `@/data/pillars` | `expertiseOverview` | intro, prompt | (expertise hub) | MegaMenu intro (needs one-liner) |
| `@/data/industries` | `industries` | n, slug, name, copy, pillars | IndustryMarquee, WhereWeWork | §6 tiles, header Industries dropdown, mobile menu |
| `@/data/impact` | `founderResults` | id, dateline, homeLine, emphasis, figure{value} | ImpactFold, PillarCard | §5 ResultCards |
| `@/data/impact` | `secondaryFigures` | ukraine '15%' | ImpactFold | Ukraine card |
| `@/data/impact` | `figureFallback` **[v3 new]** | india '1st', tfa 'WHO' | — | figures for India/WHO cards |
| `@/data/impact` | `routeMapTitle` **[v3 new]** | string | — | only if map kept |
| `@/data/approach` | `principles`, `principlesHeading`, `steps`, `stepLabels` | — | PlantPipeline, MethodFold | not on v3 home |
| `@/data/founder` | `founderName`, `founderRole`, `shortBio`, `portraitAlt` | — | schema.ts, FounderPhoto | founder band alt, CoverStory byline |
| `@/data/nav` | `main` | label, href, panel | Header, MobileMenu | Header |
| `@/data/nav` | `expertiseLinks` | — | footer.expertise | Footer col 1 |
| `@/data/nav` | `mobile` | — | MobileMenu | MobileMenu |
| `@/data/nav` | `footer` | expertise{heading,links}, company{heading,links}, contact{heading,email,whatsapp,linkedin,base}, newsletter{heading} | Footer | Footer (edit company list; add insights col) |
| `@/data/nav` | `legal` | Privacy/Cookies/Terms | Footer | Footer bottom |
| `@/data/nav` | `contactLink` | — | unused | could back header CTA |
| `@/data/microcopy` | `microcopy` | primaryCta, bookingCta, pillarLink, insightsLink, impactLink, newsletter, newsletterButton, emailLabel, newsletterConsent, newsletterMailtoSubject, invalidEmail, cookie*, essentialOn, analyticsNotInUse, skip, menu, close, featuredInsight, allExpertise, inPreparation, draftRibbon, readingTime, homeCrumb, opensLinkedIn; **[v3 new]** announcement, announcementLink, backToTop, readMore, expertiseAreas, otherExpertise, readingTimeLabel, writtenByLabel | chrome + home | all chrome labels |
| `@/data/microcopy` | `formatLabels` | point-of-view / field-notes / explainer | CoverStory, lib/insights | §4 labels (uppercase via CSS), footer Insights col |
| `@/data/seo` | `seo`, `articleOgPattern`, `SeoKey`, `SeoEntry` | — | lib/seo | unchanged |
| `@/config/site` | `site` | name, url, mode, email, whatsapp{display,href}, linkedin{display,href}, base, bookingUrl, newsletterEndpoint, analytics, legal.registration, trademark (motion.proofCountUp DEAD) | chrome, CtaField, Newsletter, schema | unchanged |
| `@/lib/insights` | `visibleInsights`, `comingSoon`, `featuredInsight`, `isDraft`, `formatLabel`, `insightReadingTime`, `insightHref` | — | ExpertisePanel, InsightsFold | §4, AnnouncementBar, Footer insights col |
| `@/lib/mode` | `isStaging`, `isProduction`, `mode`, `confirmItems` | — | Confirm, DraftRibbon, SeoHead | add preview mode (contract §6) |
| `@/lib/seo` | `pageSeo` | — | index.astro | unchanged |
| `@/components/seo/schema` | `organization`, `professionalService`, `website`, `breadcrumbs`, `withHome`, `SeoProps`, `Crumb` | — | BaseLayout, Breadcrumbs | unchanged |
| `@/data/notes/home` | `homeNotes` | — | all home folds | DELETE file (after imports gone) |
| `@/data/notes/chrome` | `chromeNotes` | — | AnnouncementBar, MotionToggle, MobileMenu, Footer, CtaField, Rail, motion/index (cursor) | DELETE file (after imports gone) |

---------------------------------------------------------------------------------------------------------------------------

## 4. Hard-coded copy inside components (preserve or move to data)

| file:line | verbatim | action |
|---|---|---|
| `components/home/Hero.astro:24` | `Where deep` / `expertise meets` / `shared ambition` + `.` (H1 spans) | render `hero.headline` instead |
| `components/home/Hero.astro:20` | ` ✶ ` overline separator | replace with "·" (or render `hero.overline` as is) |
| `components/home/Positioning.astro:15` | `'We build the answer with your people'` | DEAD (highlight split) |
| `components/home/FounderFold.astro:20` | `'We create with you.'` | DEAD (underline split) |
| `components/home/FounderFold.astro:42` | `“` | decorative; optional |
| `components/home/ImpactFold.astro:20` | `tfa: 'WHO'` (+ `homeNotes.impact.indiaFigure`) | now `figureFallback` (`impact.ts:51`) |
| `components/home/PlantPipeline.astro:149` | `→` after "scroll, it flows" | DELETE |
| `components/shared/PillarCard.astro:31` | `{pillarNumber(p)} / 06` | keep "01" numbering if used; "/ 06" optional |
| `components/shared/CoverStory.astro:46` | `Ganeaysh Kulkarni` (byline) | use `founderName` |
| `components/shared/Newsletter.astro:26` | `'Privacy Policy'` (split + link text) | keep; link `/privacy` |
| `components/shared/CtaField.astro:26` | Confirm note `free first call` | staging-only |
| `components/chrome/Footer.astro:61` | `© 2026 ` | KEEP (brief "© 2026 KoKreaters") |
| `components/chrome/Footer.astro:69` | Confirm note `KvK / VAT / registered address` | staging-only |
| `components/chrome/Footer.astro:18`, `Header.astro:30-31` | `label="KoKreaters home"` (logo link name; also Logo default `Logo.astro:53`) | KEEP |
| `components/brand/Logo.astro:80` | `'KoKreaters: Connect · Collaborate · Create'` (default alt for full logos) | KEEP |
| `components/chrome/MobileMenu.astro:63-64` | `WhatsApp: `, `LinkedIn` | import `footer.contact.*.label` |
| `components/chrome/CookieConsent.astro:23,33,41` | `Analytics`, `Cookies`, `aria-label="Cookie consent"` | KEEP |
| `components/chrome/AnnouncementBar.astro:8` | `aria-label="Announcement"` | KEEP if bar kept |
| `components/chrome/Header.astro:33` / `MobileMenu.astro:25` / `Breadcrumbs.astro:10` | `aria-label="Main"` / `"Menu"` / `"Breadcrumb"` | KEEP |
| `components/seo/SeoHead.astro:37-39` | `theme-color #FFFFFF`, `og:site_name KoKreaters`, `og:locale en_GB` | KEEP (theme-color may → `#0B1B33`) |
| `components/seo/schema.ts:35-55,65,81,116-120` | POSITIONING_STATEMENT, TARGET_TERMS, `foundingDate '2026'`, `telephone '+31622157910'`, knowsLanguage, alumniOf | KEEP |
| `layouts/BaseLayout.astro:45` | `lang="en-GB"` | KEEP |

---------------------------------------------------------------------------------------------------------------------------

## 5. Casual asides / jokey captions / toy instructions

### 5.1 DELETE (in scope)
| verbatim | defined | rendered |
|---|---|---|
| that’s you + us | `data/notes/home.ts:7` | `home/Hero.astro:26` |
| pull a node, it’s all connected | `data/notes/home.ts:8` | `home/Hero.astro:29` |
| yes, that WHO | `data/notes/home.ts:11` | `home/ProofBand.astro:56` |
| INDIA · WILMAR … THE NETHERLANDS (split-flap) | `data/notes/home.ts:12` | `home/ProofBand.astro:38` |
| plant floor / lab / boardroom / the same person (Venn) | `data/notes/home.ts:15` | `home/Positioning.astro:23` |
| most consultants pick one circle | `data/notes/home.ts:16` | `home/Positioning.astro:24` |
| Read the whole truth | `data/notes/home.ts:17` | `home/Positioning.astro:29`, `home/MethodFold.astro:40` (→ `microcopy.readMore`) |
| Crude comes in / Refine it right / Split the fractions / Blend to spec / Product that ships / Go or No-Go / GO | `data/notes/home.ts:21-27` | `home/PlantPipeline.astro:18-25,118` |
| one pipe, one person | `data/notes/home.ts:28` | `home/PlantPipeline.astro:142` |
| and up it goes | `data/notes/home.ts:29` | `home/PlantPipeline.astro:143` |
| scroll, it flows | `data/notes/home.ts:30` | `home/PlantPipeline.astro:149` |
| keep scrolling, it moves sideways | `data/notes/home.ts:33` | `home/WhatWeDo.astro:44` |
| swipe for all six | `data/notes/home.ts:34` | `home/WhatWeDo.astro:45` |
| listening comes first | `data/notes/home.ts:37` | `home/MethodFold.astro:32` |
| with proof that it works | `data/notes/home.ts:38` | `home/MethodFold.astro:33` |
| yes, minus twenty-five | `data/notes/home.ts:41` | `home/ImpactFold.astro:32` |
| home base | `data/notes/home.ts:44` | `home/RouteMap.astro:70` |
| go on, toss one | `data/notes/home.ts:47` | `home/WhereWeWork.astro:16` |
| fresh from the notebook | `data/notes/home.ts:50` | `home/InsightsFold.astro:23` |
| no noise, really | `data/notes/home.ts:53` | `home/InsightsFold.astro:39` |
| that’s Ganeaysh | `data/notes/home.ts:56` | `home/FounderFold.astro:35` |
| or just say hello | `data/notes/chrome.ts:16` | `chrome/MobileMenu.astro:66` |
| we’re all ears | `data/notes/chrome.ts:17` | `shared/CtaField.astro:30` |
| thanks for reading all the way down | `data/notes/chrome.ts:18` | `chrome/Footer.astro:21` |
| drag / throw / wipe / press / open / pull (cursor labels) | `data/notes/chrome.ts:26-31` | `scripts/motion/index.ts:106` → cursor.ts |
| Pause motion / Play motion | `data/notes/chrome.ts:13-14` | `chrome/MotionToggle.astro:11,14` |

Out of scope but found by grep (other routes): `talk soon` `data/notes/journal.ts:32`; `no noise, really` `data/notes/journal.ts:14`;
`the long way round` `data/notes/story.ts:48`; `fling one` `data/notes/story.ts:29`; `Crumple it` / `much better` `data/notes/story.ts:18,20`;
`three acts, keep scrolling` `data/notes/story.ts:9`; `scroll, it draws itself` `data/notes/expertise.ts:30`.

### 5.2 BORDERLINE (flag, do not silently change)
- `cta.body` "…The first conversation is free of charge." (`home.ts:38`; changed in working tree from brief's "is on us"; the claim is CONFIRM 9).
- `microcopy.newsletter` now "Field notes from the plant floor and the boardroom, once a month." (`microcopy.ts:13`; brief bank had
  "…Once a month. No noise." — the edit drops brief wording).
- `whatWeDo.headline` "Six ways we create value, together." — brief copy, keep; slight warmth.
- `hero.overline` uses "·"; current render adds "✶" — decorative only.
- `site.trademark` "™" in "© 2026 KoKreaters™" (CONFIRM 12) vs brief "© 2026 KoKreaters".
- `industries.overline` and `.headline` are both "Where we work" (`home.ts:28`) — eyebrow + title would repeat.
- `chromeNotes.ann.lead` / `microcopy.announcement` "Field notes from the plant floor and the boardroom." — plain; fine if the bar stays.
- `positioning.folio` "Our promise" and `founderQuote.folio` "Founder" are COMPOSED labels (DESIGN-SPEC 8.3 approval list).

---------------------------------------------------------------------------------------------------------------------------

## 6. CONFIRM / DRAFT handling

Mechanism: `src/components/ui/Confirm.astro:8` renders `{isStaging && <span class="confirm" data-confirm-id={id}>CONFIRM {id}{note && `: ${note}`}</span>}`;
`src/components/ui/DraftRibbon.astro:8` renders `{isStaging && <p class="draft-ribbon" data-draft>{microcopy.draftRibbon}</p>}` ("DRAFT for
Ganeaysh’s review"). `isStaging` = `site.mode === 'staging'` (`lib/mode.ts:8`) = `PUBLIC_SITE_MODE !== 'production'`
(`config/site.ts:10`). Production also flips `visibleInsights()` to published+approved only and robots to `index, follow`.

Rendered ids in scope:
| id | where | condition |
|---|---|---|
| 4 (founder quote wording) | `home/FounderFold.astro:50` | staging |
| 9 (email, reply time, booking tool, free first call) | `shared/CtaField.astro:26` note "free first call" | staging, every page with CtaField |
| 11 (legal entity, KvK, VAT, address) | `chrome/Footer.astro:69` note "KvK / VAT / registered address" | staging AND `site.legal.registration === null` |
| DraftRibbon sm | `chrome/ExpertisePanel.astro:43` (featured insight) | staging AND `isDraft` |
| DraftRibbon sm | `shared/CoverStory.astro:40` (home insight cards) | staging (self-gated) AND draft/pending |

Comment-only CONFIRMs (not rendered; facts still pending): `home.ts:4` CONFIRM 2 (headline option A); `home.ts:32` CONFIRM 4;
`home.ts:38` CONFIRM 9; `site.ts:11` email CONFIRM 9; `site.ts:15` bookingUrl CONFIRM 9 (fallback `/contact#form`); `site.ts:20`
CONFIRM 11; `site.ts:21` ™ CONFIRM 12; `schema.ts:65` foundingDate CONFIRM 13; `schema.ts:67` C-7 (LinkedIn company page);
`pillars.ts:12` CONFIRM 7 (CBE wording); `nav.ts:30` C-5 (Industries in footer); `impact.ts:63` CONFIRM 8 (testimonials empty);
`content.config.ts:15` publication date. Portrait (CONFIRM 3) and first two insights (CONFIRM 14) are in `confirmItems` only.

Contract §6 adds a `preview` mode (no Confirm, no DraftRibbon, drafts still listed, site-wide noindex) for the Vercel link — required
because production mode empties the home insights section (fact 2).

---------------------------------------------------------------------------------------------------------------------------

## 7. Behaviour that must survive

| behaviour | mechanism | file |
|---|---|---|
| Skip link | `a.skip-link[href=#main]` → `main#main[tabindex=-1]`; `main:focus{outline:none}` | SkipLink, BaseLayout:65,82 |
| no-JS fallbacks | `html.no-js`→`js` inline; `.js-only` / `.nojs-only` utilities; Expertise falls back to `a[href=/expertise]`, Menu to `a[href=#site-footer]` (footer has `id=site-footer tabindex=-1`) | BaseLayout:49-56, utilities.css:33-34, Header:47-51,83-86, Footer:15 |
| Current page | `aria-current="page"` + `.is-current` from pathname; Expertise current on `page in {expertise,pillar}` | Header:21-25,58-60 |
| Expertise disclosure | button `aria-expanded`/`aria-controls`, hover intent 120/200 ms (fine pointer ≥1024), Esc+refocus, focusout, outside pointerdown, MQ close | chrome.ts:38-114 |
| Mobile menu | toggle `aria-expanded`, label swap, `html.menu-open`, scroll lock, `inert` on main/footer/skip, focus trap, Esc+refocus, link-click close, ≥1024 close, Expertise sub-group, early-tap replay | chrome.ts:117-215, BaseLayout:54 |
| Header scrolled state | `.is-scrolled` at `scrollY > 8` | chrome.ts:25-35 |
| Cookie settings | `dialog#cookie-settings` + `[data-cookie-settings]`, `showModal`, refocus opener, backdrop close; analytics bar + `localStorage kk-consent` when `PUBLIC_ANALYTICS=1`; **init lives in motion/index.ts:81** | CookieConsent, consent.ts |
| Newsletter | endpoint → POST form (email required, consent required, `aria-describedby` error slot); else mailto with subject | Newsletter.astro, site.newsletterEndpoint |
| CTA booking | `site.bookingUrl` (env `PUBLIC_BOOKING_URL`, default `/contact#form`) + mailto | CtaField:28-29 |
| CTA placement | on all pages except contact/legal/notfound; override `cta` prop | BaseLayout:34,70 |
| Industry links | `/industries#{slug}` ↔ `SectorSection` `id={i.slug}` | WhereWeWork:10 |
| Insight links/labels | `insightHref` `/insights/{id}`; `formatLabels`; reading time `fill('{n} min read')`; `<time datetime=isoDate>` | lib/insights, lib/format |
| Insights filter deep links | `/insights?pillar=<key>&format=<key>` read on load, kept in URL via `replaceState` | scripts/pages/insights.ts:65-85 |
| Accessible figures | count-ups use aria-hidden visible + visually-hidden real value (drop count-up, keep plain text) ; `<abbr title>` for iTFA + note | ProofBand:49, ImpactCard:15-16,27-33 |
| Typographic figures | `minus25` (U+2212, U+202F) for −25 °C; `figHtml` emphasis spans | lib/typography |
| Headings | exactly one `h1` (hero); every home section `aria-labelledby` its h2 (`hero-heading`, `proof-heading`, `whatwedo-heading`, `impact-heading`, `industries-heading`, `insights-heading`, `founder-heading`, `cta-heading`) | home/*, CtaField:21-25 |
| SEO head | title/description/canonical/robots(mode)/OG(+fallback)/twitter/hreflang/JSON-LD; length assert at build | SeoHead, lib/seo.ts:21 |
| JSON-LD | home → Organization + ProfessionalService + WebSite; crumbs → BreadcrumbList | BaseLayout:38-41, schema.ts |
| Breadcrumbs | `withHome`, `aria-label="Breadcrumb"`, `aria-current` | Breadcrumbs.astro |
| CSP | inline head script hash in vercel.json + public/_headers, regenerated by `scripts/csp-hash.mjs` | vercel.json:27, public/_headers:8 |
| View transitions | `@view-transition {navigation:auto}` + `view-transition-name: site-header` (keep, contract §1.5.8) | motion.css:38-43, Header.astro:105 |

Tests that encode current chrome (update alongside the rebuild): `tests/chrome.spec.ts` (announcement bar region + `a[href="/insights"]`,
body order, Pause motion ×2), `tests/keyboard.spec.ts` (`MAX_TABS_TO_CTA=12`, `header a.btn[href="/contact"]`, `button[data-menu-toggle]`,
`#mobile-menu`, `main[inert]`, `a.m-menu__link[href="/contact"]`), `tests/seo.spec.ts:70` (home JSON-LD types), `tests/smoke.spec.ts:43-46`.

---------------------------------------------------------------------------------------------------------------------------

## 8. Dead after the redesign

Home components (replace): `home/Hero.astro`, `HeroNetwork.astro`, `IndustryMarquee.astro`, `ProofBand.astro`, `Positioning.astro`,
`PlantPipeline.astro`, `WhatWeDo.astro`, `MethodFold.astro`, `ImpactFold.astro`, `RouteMap.astro`, `WhereWeWork.astro`,
`InsightsFold.astro`, `FounderFold.astro`, `geo.d.ts`.

Chrome: `chrome/MotionToggle.astro`; `chrome/ExpertisePanel.astro` (→ MegaMenu); AnnouncementBar contents; Footer sign-off wordmark +
margin note; Header hand underline `LINE`; MobileMenu circle-grow clip-path + pillar dots; `Logo.astro:114-119` dock-slot CSS;
`CtaField` MagneticDots/Scribble/Sticker/MarginNote.

Shared used only by home: `shared/Rail.astro` (home only), `shared/Marquee.astro` (home only), `shared/MethodLine.astro` (home only),
`bencho/MagneticLetters.astro` (home only), `bencho/GravityTags.astro` (home only), `bencho/MagneticDots.astro` (CtaField only),
`bencho/FlapBoard.astro` (home + about). `shared/PillarCard.astro` (home + expertise hub), `shared/ImpactCard.astro` (home + pillar +
impact), `shared/CoverStory.astro` (home + others) → replaced by contract `cards/*`.

Annotation kit (site-wide): `notes/MarginNote, Scribble, Stamp, Sticker, Venn, Doodle, Tape, SpecLabel`, `notes/notes.css`
(imported by `styles/global.css`), `notes/paths.ts`; data `data/notes/home.ts`, `data/notes/chrome.ts` (+ journal/story/expertise for
other routes). UI: `ui/Folio.astro`, `ui/PillarDot.astro`, `Arrow` `hand` variant, `TextLink` hand underline, `Button` variants
`hand|ghost-on-dark` + sweep/magnetic. Brand: `brand/NodeCluster.astro` (keep as NodeMark if wanted), `brand/RisingArrow.astro`,
`brand/Discs.astro`, `brand/RingedNode.astro` (no importers), `FounderPhoto` `cutout` variant.

Scripts: entire `src/scripts/motion/*` (index, lenis, reveal, draw, countup, notes, magnetic, marquee, rail, scrub-words, parallax,
cursor, pause, lazy, split, tokens, context) — but **move `initConsent()` out first**; `src/scripts/bencho/*` (text-rise, sweep-button,
flap-board, magnetic-dots, edge-light, magnetic-letters, gravity-tags, …); `src/scripts/pages/{home,hero,dock,home-emulsion}.ts`.
`src/scripts/chrome.ts` and `src/scripts/consent.ts` SURVIVE. CSS: `grounds.css` `.g-*`/`.grain` (`assets/fx/grain.png`),
`motion.css` gates (`html.motion`, `data-reveal`, `data-rise`, `data-hero-hide`, `data-frost`, `.kk-cursor`).
Packages: `gsap`, `lenis`, `three`/`@types/three`, `d3-geo`, `topojson-client`, `world-atlas` (RouteMap; also check about globe
`scripts/build-globe.mjs`), fontsource Bricolage/Plex Mono/Caveat/Instrument Sans. Data fields: `hero.swooshPhrase`, `cta.swooshPhrase`,
`proof[].count`, `heroNodeLabels`, `runningHead`, `site.motion.proofCountUp`, `chromeNotes.rail/cursor/motion`, `pillarGround/pillarTintGround`.

---------------------------------------------------------------------------------------------------------------------------

## 9. Mapping: brief target → data available → gaps

| brief target | data source(s) | gaps / CONFIRM |
|---|---|---|
| Header: logo left | `Logo variant="horizontal"` (`brand/Logo.astro`), label "KoKreaters home" | none (drop dock CSS) |
| Header menu Expertise (mega) + six areas w/ one-liners | `main[0]`, `pillars[].{name,promise,slug}`, `microcopy.allExpertise` | mega-menu intro one-liner (COMPOSED; `expertiseOverview.intro` is 3 sentences) |
| Header Industries / Impact / Insights / About (+Approach) | `main` (`nav.ts:7-14`); Industries dropdown from `industries[]` | "All industries" label (COMPOSED); Approach placement is a client decision |
| Header button "Start a conversation" | `microcopy.primaryCta` / `nav.contactLink`, `/contact` | none |
| Top bar: navy line → latest insight | `visibleInsights()[0]` or `featuredInsight()`, `insightHref`, `microcopy.announcement(Link)` | "Latest insight" label (COMPOSED); empty in production (CONFIRM 14) → hide |
| Footer dark navy, 4 cols Expertise / Company / Insights / Contact | `footer.expertise`, `footer.company`, `footer.contact`, `expertiseLinks`, `visibleInsights()`, `formatLabels` | Insights column has no nav data; "All insights" label (COMPOSED); company list order per contract needs `nav.ts` edit |
| Footer newsletter email field | `Newsletter` + `microcopy.newsletter*`, `site.newsletterEndpoint` | **no endpoint** (`PUBLIC_NEWSLETTER_ENDPOINT` empty) → define fallback; no client-side handler exists |
| Footer LinkedIn icon | `footer.contact.linkedin`, `site.linkedin` (personal profile) | no LinkedIn glyph in `Icon.astro` (Lucide has none; hand-draw); company page C-7 |
| Footer KvK number | `site.legal.registration` (null) | **CONFIRM 11** |
| Footer Privacy / Cookies / Terms | `legal` (`nav.ts:43-47`) + Cookie settings button | none |
| Footer "© 2026 KoKreaters" | `Footer.astro:61` + `site.name` | `site.trademark` ™ **CONFIRM 12** |
| Footer one-liner (contract) | `hero.overline` (close) | exact sentence "Independent technical and strategy consulting for food, feed and specialty ingredients." not in data; "(CET)" not in `site.base` |
| 1 Hero navy band: serif H1 + one sentence + 2 buttons | `hero.headline` (CONFIRM 2), `hero.sub`, `hero.primary`, `hero.secondary`, `hero.overline`, `hero.footLeft/footRight` | `hero.sub` is one sentence already; hero background photo: **no stock photos / `src/data/photos.ts` yet** |
| 2 Credibility strip: 25 · 5 · 3 · WHO, thin dividers, "From our founder's career." | `proof[]` value+label, `proofSource` | eyebrow label (COMPOSED, e.g. "Our track record"); trailing period vs `proofSource` (no period) |
| 3 What we do: 6 cards 3×2 (icon, title, promise, Learn more) | `whatWeDo.{overline,headline,intro}`, `pillars[].{n,name,promise,slug}`, `microcopy.pillarLink` | **icons**: none in data (Lucide mapping in contract §2) |
| 4 Featured insights: 1 large photo card + 2 smaller, labels POINT OF VIEW / FIELD NOTES | `insights.{overline,headline}`, `visibleInsights()`, `featuredInsight()`, `comingSoon()`, `formatLabels`, `insightHref`, `insightReadingTime`, `formatDate` | **CONFIRM 14**: only 2 drafts (both point-of-view, staging only), 0 in production; FIELD NOTES exist only as coming-soon stubs (no standfirst, no route); **no insight images**; "All insights" link label (COMPOSED) |
| 5 Results: dark band, 4 cards + "See the impact" | `impact.{overline,headline,link}`, `founderResults[].{dateline,homeLine,emphasis,figure}`, `secondaryFigures`, `figureFallback` [v3 new], `proofSource`, `abbreviations.iTFA` | none for the four cards; C-9 nulls only matter on /impact |
| 6 Industries: simple grid of 9 → Industries sections | `industries` fold copy (`home.ts:28`), `industries[].{n,slug,name,copy}`, `/industries#{slug}` | eyebrow = headline duplicate ("Where we work") |
| 7 Founder band: portrait left, quote right, "Meet Ganeaysh" | `founderQuote.{quote,attribution,link}`, `portraitAlt.founder`, `founderName` | quote **CONFIRM 4**; portrait: only cut-out in `src/assets/photos`; opaque studio portrait exists at `../assets/photos/ganeaysh-portrait-1665x2048.png` (must be copied into src); professional session **CONFIRM 3** |
| 8 Closing CTA "Have a challenge worth solving together?" + "Book a 30-minute call" + newsletter | `cta.{headline,body,button}`, `site.bookingUrl`, `site.email`, Newsletter | `cta.body` free-call claim **CONFIRM 9**; booking tool **CONFIRM 9** (falls back to `/contact#form`); newsletter endpoint gap |
| (dropped) positioning, method, pipeline, marquee, route map | `positioning.*`, `method.*`, `principles`, `steps` | `positioning.*` is home-only → would vanish from site; decide placement |

---------------------------------------------------------------------------------------------------------------------------

## 10. Images and media currently used (home + chrome)

| asset | used by | notes |
|---|---|---|
| `src/assets/photos/ganeaysh-cutout.png` (1665×2048 RGBA, ~41% transparent) | `FounderPhoto variant="cutout"` → FounderFold | v3: stop using |
| `src/assets/photos/ganeaysh-cutout-square.png` (1200×1200 RGBA) | `FounderPhoto variant="avatar"` → CoverStory byline (home insight cards) | |
| `src/assets/brand/svg/derived/horizontal-cluster.svg` (?raw, inline) | Header `Logo horizontal` (`[data-dock-slot]`), HeroNetwork | |
| `src/assets/brand/svg/derived/horizontal-word.svg` (?url) | Header `Logo horizontal` | |
| `src/assets/brand/svg/derived/horizontal-white-{cluster,word}.svg` (?url) | Header `Logo horizontal-white` (menu open) | v3 footer/navy |
| `src/assets/brand/svg/kokreaters-logo-full-white.svg` | Footer top `Logo full-white` | |
| `src/assets/brand/svg/kokreaters-wordmark-white.svg` | Footer sign-off (DEAD) | |
| `src/assets/brand/svg/kokreaters-node-cluster.svg` | CtaField `Logo cluster` (DEAD) | candidate NodeMark |
| `brand/NodeCluster.astro` (inline SVG, hard-coded geometry + hex) | ProofBand stamp, WhatWeDo hub (both DEAD) | |
| `src/assets/fx/grain.png` (via `styles/grounds.css:59` `.grain`) | ProofBand, FounderFold, Footer, CtaField, PillarCard | DEAD |
| `world-atlas/land-110m.json` (build-time) | RouteMap | DEAD |
| inline SVG radial discs, Marquee hex dots | ProofBand, Marquee | DEAD |
| `public/og/home.png`, `/og/default.png` | SeoHead og/twitter image | v2 look; regenerate (`npm run og`) |
| `public/brand/kokreaters-logo-512.png` | JSON-LD Organization.logo | KEEP |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `site.webmanifest`, `icon-512.png` | SeoHead | KEEP |
| `public/fonts/bricolage-grotesque-latin-wdth-normal.woff2`, `ibm-plex-mono-latin-400-normal.woff2` (preloaded) + plex 500, caveat 600, instrument-sans | BaseLayout preloads, fonts.css | replace with Source Serif 4 + Inter |
| Insight `image` fields | none set in any MDX | gap for §4 photo cards |
| Unused, available: `../assets/photos/ganeaysh-portrait-1665x2048.png` (opaque), `ganeaysh-avatar-640.png`, `ganeaysh-cutout-clean.png`; `../assets/brief/brief-homepage-wireframe.png` (client wireframe, 1800×2680) | — | portrait for founder band / About |
