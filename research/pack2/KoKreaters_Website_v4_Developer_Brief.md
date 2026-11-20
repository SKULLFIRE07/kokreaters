---
title: "KoKreaters website v4: developer brief"
subtitle: "Corrections, new copy and brand files for kokreaters-v3.vercel.app, before go-live on KoKreaters.com"
date: "20 November 2026 · From Ganeaysh Kulkarni"
---

# How to use this brief

- Work through the numbered items in order. **Part A** must be done before launch; the rest is new content and polish.
- **Keep the current design system** (navy, Bodoni headings, Manrope body, photography with navy gradient). Everything here is copy, structure and brand files.
- Text in ⟦yellow brackets⟧ is a **placeholder**. Build the layout with it, but do not publish it. Ganeaysh will confirm or replace each one (list in Part K). If an item is still a placeholder at launch, **hide that element**, never show the bracket text.
- Brand files are in the `/brand` folder of this pack. A plain-text copy of this brief (`.md`) is included for easy copy-paste.
- Spelling: British English. Brand name always **KoKreaters** (two capital Ks); website **KoKreaters.com**.

# Part A · Fix before launch

**1. "Ask KoKreaters" assistant is not working.** On the preview it answers every question with "The assistant is not available just now." Either connect its back end (check the API key and environment variables on Vercel) or switch it off for launch with a feature flag. When it is on:

- make the button smaller (icon + "Ask" on mobile);
- hide it while the final call-to-action band and the footer are in view; today it covers the gold "Start a conversation" button and the bottom of cards.

**2. One reply time everywhere: two working days.** The home page says two working days, the contact page says one. Use this sentence on both pages and in the chat form: "Ganeaysh reads every message personally and replies within two working days."

**3. Search engines are blocked.** `robots.txt` currently says `Disallow: /`. Keep it on the preview; on KoKreaters.com use:

```
User-agent: *
Allow: /
Sitemap: https://kokreaters.com/sitemap-index.xml
```

Then submit the sitemap in Google Search Console and Bing Webmaster Tools.

**4. Replace the browser-tab icon.** The current orange arrow is a default placeholder. Use the new favicon set in `/brand/favicon` (see item 12).

**5. Logo alt text.** Header and footer logo images have no alt text. Use `alt="KoKreaters"` on the image; the link around it keeps `aria-label="KoKreaters home"`.

**6. Rename service 06 and its address.** Ganeaysh does not want the word "fractional" on the site.

- Title: **Technology and R&D leadership, on demand**
- Card line: "A seasoned CTO or Head of R&D in your leadership team, for the days and months you need."
- URL: change `/expertise/capability` to `/expertise/technology-leadership` (add a 301 redirect from the old path).
- Contact-form option: "Technology and R&D leadership, on demand".

**7. Fix the Indonesia tag on the Impact page.** It says "FRACTIONAL CTO · INDONESIA · WILMAR". Change it to **"OPERATIONS · INDONESIA"**. That was a full-time leadership role, not a fractional one.

**8. Fewer company names.** Mention Cargill and Wilmar only (a) in the founder line "Former Global Product & Process Design Director, Cargill" (home, articles) and (b) on the About page (long bio and career timeline). Remove every "Figures from our founder's career at Wilmar and Cargill" line and use the neutral footnote in item 15 instead. **Never use Cargill or Wilmar logos.**

**9. Remove "brand-new" signals.**

- About page: delete "founded KoKreaters in 2026" (new bio in item 21).
- Timeline: the last entry reads **"Today · KoKreaters"** instead of "2026".
- Structured data (JSON-LD): remove `"foundingDate"` (item 40).
- Keep "© 2026 KoKreaters" in the footer; that is normal.

**10. Company details in the footer and privacy policy.** Dutch rules require the KvK number on the website, and businesses that sell services online must also show their legal name and VAT (btw) number. Footer line:

"KoKreaters ⟦legal name and legal form⟧ · KvK ⟦00000000⟧ · BTW ⟦NL000000000B01⟧ · ⟦City⟧, the Netherlands"

Add the same details to the "Who we are" section of the privacy policy.

# Part B · Brand

**11. New logo: cleaner, navy, consulting-grade.** Files in `/brand`:

| File | Use |
|----------------|----------------|
| `kokreaters-logo-navy-no-tagline.svg` | Website header (light background) |
| `kokreaters-logo-navy.svg` | Documents, proposals, about page, email signature |
| `kokreaters-logo-white.svg` | Footer and any navy background |
| `kokreaters-mark.svg` | Small spaces, loading states |
| `kokreaters-avatar-400.png` | LinkedIn company page and social profile picture |
| `*@2x.png`, `*-1200.png` | Raster versions for email and slides |

- The mark keeps the network idea of the original logo (people and ideas connected) as a clean "K" in navy, with one saffron node as the spark of creation.
- The wordmark is set in Bodoni Moda, the site's own heading font, with the tagline "Connect · Collaborate · Create" in Manrope.
- All text is converted to outlines, so no font loading is needed.
- Colours: Navy `#0E1F4D`, Saffron `#D9A43A`, Slate `#4A5A80`.
- Header height: 40–44 px desktop, 32–36 px mobile.

**12. Favicon.** Three options are in `/brand/favicon-options`:

- **A: the mark alone.** Elegant on a white tab, but it disappears on dark browser themes.
- **B: navy tile with the white mark and saffron node (recommended).** Reads clearly at 16 px on light and dark tab bars, and matches the footer and LinkedIn avatar.
- **C: navy tile with a Bodoni "K".** Most traditional, but loses the network idea.

Option B is ready to install from `/brand/favicon`:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

Use `icon-192.png` and `icon-512.png` in `site.webmanifest`, with `"theme_color": "#0E1F4D"`.

**13. Social share image.** Rebuild `/og/home.png` (1200 × 630) with the new white logo on navy and the line "Deep expertise, turned into products, plants and markets."

# Part C · Home page

**14. Hero: add a proof line.** Keep the headline, intro and buttons. Replace the bottom line ("Based in the Netherlands / Experience across…") with a single proof line in small caps, separated by thin rules:

**"Former global R&D director at one of the world's largest agri-food companies · Two national industry firsts · Trans-fat work praised by the WHO Director-General"**

Mobile: stack the three parts as three short lines.

**15. Track record strip: new figures, no repetition.** Each page gets its own strip (home, About and Impact; items 15, 23 and 27). The home strip:

| Number | Label |
|----------|------------------------------|
| **25** | years, from plant floor to global boardroom |
| **8 sites · 5 countries** | India, Indonesia, Ukraine, Türkiye and the Netherlands |
| **3 regions** | teams led across the Americas, EMEA and Asia-Pacific |
| **2 national firsts** | India's first integrated specialty fats facility and Ukraine's first cold-climate palm oil refinery |

Footnote (small, grey, right-aligned): "From our founder's 25-year career, before KoKreaters."

**16. New strip under "What we do": how we engage.** Add a four-column band after the six services, linking to `/approach#engage`. Full copy in item 31; card titles only here:

- Diagnostic sprint
- Defined project
- Leadership on demand
- Expert review

**17. Impact section: three cards instead of two.**

| Tag | Big figure | Line |
|----------|------|--------------------------|
| OPERATIONS · INDONESIA | **21%** | Business growth after reshaping manufacturing: throughput, yield, quality and cost. |
| PROCESS · UKRAINE | **−25 °C** | Ukraine's first cold-climate crude palm oil refinery, with a 15% lower cost structure. |
| FOOD SAFETY · GLOBAL | **WHO** | Trans-fat elimination work praised publicly by the WHO Director-General. |

The WHO card links to the WHO story on the Impact page (item 28, story 4).

**18. Trust line (new, slim band above Insights).** One line, centred, small caps:

**"Confidential by default · We work under NDA · Client names are shared only with their consent"**

**19. Founder block.**

- Name: **Ganeaysh Kulkarni**
- Line 1: **Founder and Principal, KoKreaters**
- Line 2: **Former Global Product & Process Design Director, Cargill**
- Line 3, small and italic, as a flourish: *"Chief Catalyst"*

Keep the quote: "Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you." Replace the photo once the new portrait is ready (item 42).

**20. Netherlands band.** Keep "A Dutch base. A global reach." Body: "We work from ⟦City⟧, the Netherlands, with clients across Europe, India and Asia, and on site wherever your plants and markets are." Until the city is confirmed, use "from the Netherlands".

# Part D · About page

**21. Headline, intro and bio (replace).**

Headline: **"Twenty-five years of making ingredients work."**

Intro: "After 25 years building and leading technical organisations in edible oils, specialty fats and food ingredients, Ganeaysh Kulkarni created KoKreaters: the senior, hands-on partner he wished he could call when he was running plants and R&D teams."

Short bio (shown by default):

"Ganeaysh is a food technologist who learned the trade where it is hardest: on the refinery floor. He has built facilities that had never existed in their countries, turned around plants in three very different climates, and led global product design for one of the world's largest food and agriculture companies. Today he brings that whole journey, from the bench to the boardroom, to the businesses he works with."

Long bio ("Read the long version"):

> **Where it started.** Ganeaysh trained in food technology at CSIR-CFTRI Mysore, India's leading food research institute, after a degree in chemistry from the University of Pune. He began on the plant floor, and that is where his instinct for what really works was formed.
>
> **Building firsts.** Over the next decade he led technical operations across Asia and Eastern Europe. He built India's first world-class integrated specialty fats facility, which opened new product lines and multi-million-dollar businesses. In Ukraine he led the design and commissioning of the country's first cold-climate crude palm oil refinery, a tropical oil processed through winters of −25 °C, and improved the regional cost structure by 15%. In Indonesia he reshaped manufacturing, lifting throughput and yields, stabilising quality and delivering 21% growth.
>
> **Going global.** He then spent fourteen years in technical, R&D and food-safety leadership at Cargill. He led technical services, applications, R&D and FSQR for India, integrating food-safety systems through a major transformation and aligning them with WHO standards for industrial trans fat. He designed a bakery innovation architecture and led technology transfers across the Americas, Asia and EMEA, supported acquisitions with technical due diligence, and led category R&D for confectionery and plant-based foods. Finally, as Global Product & Process Design Director, he steered new product platforms across confectionery, plant-based, bakery and specialised nutrition, including an AI-enabled formulation system, with Fortune 500 customers and start-ups alike.
>
> **What he is known for.** Contaminant-reduction technologies taken from the lab to commercial scale, in line with Indian and European regulation. Trans-fat elimination work praised publicly by the WHO Director-General. Asset-light growth models that build business without heavy capital. And a habit of connecting people across functions, cultures and languages so that good ideas actually ship.
>
> **Why KoKreaters.** "Ko" stands for together. Ganeaysh works side by side with owners, plant heads and R&D teams, and leaves capability behind, not just a report.

**22. Timeline section.** Title: **"From CFTRI Mysore to KoKreaters"**. Subtitle: "Eight places, five countries, three continents of teams."

| Years | Organisation | Line |
|--------|----------|--------------------------|
| 1996–1999 | University of Pune | BSc Chemistry |
| 1999–2001 | CSIR-CFTRI Mysore | Postgraduate degree in Food Technology |
| 2001–2012 | Wilmar | Technical Head Specialties to Technical Director, across India, Indonesia and Ukraine |
| 2012–2021 | Cargill | Technical services, applications, R&D and FSQR leadership, India |
| 2021–2023 | Cargill | Regional Technical Lead and Bakery Technology Transfer Leader; Category R&D Leader, Confectionery and Plant-based |
| 2023–2026 | Cargill | Global Product & Process Design Director |
| Today | KoKreaters | Founder and Principal, the Netherlands |

Places line under the timeline: "Mundra · Medan · Odessa · Kakinada · Gurugram · Balikesir · Pune · Amsterdam"

**23. About-page strip (different from home).** Build the layout now; the numbers are placeholders.

| Number | Label |
|----------|------------------------------|
| **⟦50+⟧** | products and reformulations taken to market |
| **⟦10+⟧** | plants, lines and facilities designed, commissioned or turned around |
| **⟦100+⟧** | customers co-created with, from start-ups to Fortune 500 companies |
| **5** | working languages: English, Hindi, Marathi, Bahasa Indonesia and Russian |

**24. "Who he has worked alongside" (new short section).**

"Over his career, Ganeaysh has co-developed products and processes with global leaders in infant and medical nutrition, sports and dairy nutrition, FMCG, personal care, oleochemicals and pet food."

Show sector icons, no company logos. Ganeaysh will decide later whether to name companies.

**25. Credentials (new section, four columns).** Hide any row that is still a placeholder at launch.

- **Education:** Postgraduate in Food Technology, CSIR-CFTRI Mysore · BSc Chemistry, University of Pune
- **Executive education:** Creativity and Innovation, IIM Ahmedabad (2014) · EDGE Founder's Bootcamp, Innovation Acceleration Group, UC Berkeley (2021)
- **Professional memberships:** ⟦e.g. AOCS · SEA India · OTAI · AFST(I) · MVO. List only memberships actually held.⟧
- **Speaking and publications:** ⟦Talk title, event, city, year⟧ · ⟦Paper or article, publication, year⟧ · ⟦Patent number and title, if any⟧

**26. Testimonials (new, three slots).** A quiet carousel or three columns of quotes with name, role and company type:

- "⟦Quote⟧" ⟦Name, Role, Company or sector⟧

Publish only quotes given in writing, with permission to use name and title. Hide the section until at least two are confirmed.

# Part E · Impact page

**27. Impact-page strip (different again).**

| Number | Label |
|----------|------------------------------|
| **21%** | business growth, Indonesia |
| **15%** | lower cost structure, Ukraine |
| **−25 °C** | refinery operating temperature |
| **⟦≥ 50%⟧** | reduction in process contaminants at commercial scale |

Intro under the page title: "Results that started on the plant floor. Nine stories from 25 years of building plants, products and markets: what was at stake, what was done, and what changed."

Footnote: "Stories from our founder's career before KoKreaters. Client and employer confidential details are omitted."

**28. Nine impact stories (replace the current four).** Each card uses the same structure:

- tag line;
- title;
- big figure and its label;
- The challenge;
- What was done;
- The result;
- service and industry chips.

Figures in ⟦brackets⟧ are placeholders.

**Story 1 · PRODUCT AND PROCESS · INDIA**

**India's first world-class integrated specialty fats facility**

Big figure: **1st** · of its kind in India

*The challenge.* India's bakers, confectioners and food-service chains depended on imported specialty fats or on vanaspati. No facility in the country brought refining, fractionation, interesterification and blending together to world standards.

*What was done.* Ganeaysh led the technical build-up and start-up of the facility, from process design and product development to customer trials, so that it could make specialty fats to order rather than to stock.

*The result.* New product lines for customers, and multi-million-dollar businesses built on them. Capacity: ⟦X tonnes per day⟧.

*Chips:* Product development · Process development · Edible oils and specialty fats

**Story 2 · PROCESS · UKRAINE**

**A tropical oil, refined through a −25 °C winter**

Big figure: **−25 °C** · operating temperature; **15%** · lower cost structure

*The challenge.* Palm oil is solid in a European winter. Building a continuous refinery for it in Ukraine meant that every tank, line and transfer had to keep the oil moving through months of extreme cold, and no one in the country had done it before.

*What was done.* Full design-to-execution leadership, from process design and equipment selection to commissioning and the first saleable product.

*The result.* Ukraine's first cold-climate crude palm oil refinery. It shifted the region's competitive dynamics and improved the cost structure by 15%.

*Chips:* Process development and plant performance · Edible oils and specialty fats

**Story 3 · OPERATIONS · INDONESIA**

**21% growth from the same plant**

Big figure: **21%** · business growth

*The challenge.* A large operation in Medan was held back by process bottlenecks, variable quality and rising cost.

*What was done.* Ganeaysh reshaped manufacturing operations: he solved the process constraints, raised throughput and yields, stabilised quality and took cost out, working shoulder to shoulder with the plant teams.

*The result.* 21% business growth, from capacity the company already owned. Yield gain: ⟦X%⟧.

*Chips:* Process development and plant performance · Edible oils and specialty fats

**Story 4 · FOOD SAFETY · GLOBAL**

**Trans-fat work praised by the WHO Director-General**

Big figure: **WHO** · Director-General recognition

*The challenge.* In 2018 the World Health Organization called for industrially produced trans fat to be eliminated from the world's food supply by 2023. Its benchmark is no more than 2 g of industrial trans fat per 100 g of fat. Meeting that across a large oils portfolio meant changing formulations, processes and habits at the same time.

*What was done.* Ganeaysh led food-safety and quality integration aligned with WHO standards for industrial trans fat, and shaped health-forward reformulation approaches at category level.

*The result.* The company's commitment to the WHO trans-fat standard was praised publicly by the WHO Director-General, Dr Tedros Adhanom Ghebreyesus.

*Verify:* link to ⟦Dr Tedros's post on X, URL from Ganeaysh⟧ and to his published commentary: https://english.aawsat.com/home/article/4153266/tedros-adhanom-ghebreyesus/food-should-be-source-health-not-cause-disease

*Chips:* Food safety, quality and regulatory · Product development

**Story 5 · FOOD SAFETY · INDIA AND EUROPE**

**Process contaminants, removed at the source**

Big figure: **⟦≥ 50%⟧** · reduction in 3-MCPD and glycidyl esters

*The challenge.* Nutrition customers in India and Europe were tightening limits on process contaminants faster than refineries could respond.

*What was done.* Ganeaysh led the development of proprietary technologies to reduce contaminants arising from raw materials, processing and packaging, and scaled them up to commercial production.

*The result.* Compliance ahead of emerging Indian and European rules, and continuity of supply for global nutrition customers.

*Chips:* Food safety, quality and regulatory · Process development · Nutrition and specialty ingredients

**Story 6 · TECHNOLOGY TRANSFER · THREE CONTINENTS**

**One bakery playbook, from the Americas to Asia**

Big figure: **3** · continents

*The challenge.* Bakery customers in different regions were being served with different methods, different standards and different ways of working.

*What was done.* Ganeaysh designed a bakery innovation architecture, from category structure to production-process design, then led technology transfers across the Americas, Asia and EMEA, training local teams and adapting each application to local flours, fats and customers.

*The result.* A common framework that regional teams could scale. Transfers completed: ⟦X⟧.

*Chips:* Product development · Bakery and food service

**Story 7 · GROWTH · ASIA AND EMEA**

**Building business without building plants**

Big figure: **⟦$X m⟧** · new business, asset-light

*The challenge.* New categories needed to grow fast without the time and capital of new factories.

*What was done.* Ganeaysh created asset-light innovation models (tolling, partner manufacturing and quasi-B2B channels) and led the technical set-up of new-to-world product platforms.

*The result.* Multi-million-dollar businesses with far lower capital intensity, in confectionery, plant-based and specialty fats.

*Chips:* Market access and strategy · Cocoa, chocolate and confectionery · Plant-based

**Story 8 · INNOVATION · GLOBAL**

**Product design at global scale, with AI in the loop**

Big figure: **⟦X⟧** · new product platforms

*The challenge.* A global portfolio across confectionery, plant-based, bakery and specialised nutrition needed faster, better-targeted innovation.

*What was done.* As Global Product & Process Design Director, Ganeaysh steered the design of new product platforms. He designed an AI-enabled formulation system and pipeline, and built sustainability into product and process design from the start.

*The result.* A multi-million-dollar innovation pipeline, co-created with Fortune 500 customers and start-ups across the Americas, EMEA and Asia-Pacific.

*Chips:* Product development · Technology and R&D leadership, on demand

**Story 9 · DEALS · GLOBAL**

**Seeing what is really behind an acquisition**

Big figure: **⟦X⟧** · transactions supported

*The challenge.* Acquirers needed to know whether a target's plants, products and technology would deliver what the business plan assumed.

*What was done.* Ganeaysh carried out technical due diligence and planned post-acquisition integration, covering assets, processes, quality systems and people.

*The result.* Clear, evidence-based technical findings for decision-makers, and integration plans ready on day one.

*Chips:* Deals, due diligence and partnerships

**29. Story layout.** Use a filterable grid with filters by service and by industry (the chips). Show the first six; add a "Show all stories" button. Each card opens to the full story on the same page (accordion) rather than a new page.

**30. Call to action at the end of Impact.** "Your plant, product or market could be the next story. Start a conversation." Add both buttons: **Start a conversation** and **Book a 30-minute call**.

# Part F · How we engage

**31. New section on `/approach` (anchor `#engage`), summarised on home (item 16).**

Title: **"How we engage"**. Intro: "Four ways to work together. Every engagement starts with a 30-minute conversation, at no cost."

- **01 Diagnostic sprint.** "Two to three weeks. A site visit, a review of your data and process, and a prioritised roadmap with the value at stake in each step."
- **02 Defined project.** "A fixed scope with clear stages and deliverables, from first trial to commercial scale. You decide at each stage gate whether to continue."
- **03 Leadership on demand.** "A set number of days each month as your CTO or Head of R&D. We own the technical agenda with your team and build its capability as we go."
- **04 Expert review.** "Fast, independent opinions for owners, investors and lenders on an asset, a technology, a partner or a plan."

Under the four cards: "Confidential by default. We work under NDA, client names are shared only with their consent, and nothing learned with one client or a former employer is ever used for another."

No prices anywhere on the site.

# Part G · Insights, newsletter and playbook download

**32. Insights tiles.**

- Remove the "Coming soon" bleaching-earth tile on the home page and the Insights page.
- Replace it with the playbook download card (item 34).
- Article dates:
  - "Trans-fat elimination: what it really takes inside a plant": **28 October 2026**
  - "3-MCPD and glycidyl esters: a practical playbook for refiners": **11 November 2026**
- The "Photo: Unsplash" credit line under article images can be removed.

**33. Newsletter: "The KoKreaters Note" (new).**

- Heading: **"The KoKreaters Note"**
- Line: "One practical idea a month, from the plant floor and the boardroom. No spam. Unsubscribe in one click."
- Fields: Email (required) and a consent tick box: "I would like to receive The KoKreaters Note. I can unsubscribe at any time. See the privacy policy."
- Button: **Subscribe**
- Confirmation: "Thank you. Please check your inbox to confirm your subscription."
- Use double opt-in through an EU-based provider, e.g. Brevo or MailerLite. Name the provider in the privacy policy, section "Who processes it".
- Placement:
  - footer, all pages (compact: email field and button);
  - end of every article (full block);
  - top of the Insights page (full block).

**34. Gated playbook download (new).**

- Card title: **"The 3-MCPD and GE playbook for refiners"**
- Line: "A step-by-step plant guide, from raw material to post-refining. Free download (PDF)."
- Button: **Download the playbook**
- Form (modal):
  - Name, Company, Email, Country (all required);
  - consent tick box: "Send me the playbook. KoKreaters may contact me about it." (required);
  - separate optional tick box for The KoKreaters Note.
- After submit: show "Thank you. The playbook is on its way to your inbox." Send an email with the PDF link, and forward the lead to office@KoKreaters.com.
- Placement: home Insights row (third tile), Insights page, end of the 3-MCPD article, and Food safety service page.
- The PDF file will be supplied separately (⟦PDF to follow⟧).

**35. Article pages.** At the end of each article add an author box: photo, "Ganeaysh Kulkarni · Founder and Principal, KoKreaters · Former Global Product & Process Design Director, Cargill", then the newsletter block and two related articles or stories.

# Part H · Contact and booking

**36. Contact page.**

- Intro: "Tell us a little about your challenge. Ganeaysh reads every message personally and replies within two working days."
- Add a **"Book a 30-minute introduction"** button next to the form, linking to ⟦Cal.com or Calendly link⟧. Until the link exists, hide the button.
- Add "What happens next" under the form:
  1. You share your context, by form, email or a booked call.
  2. We speak for 30 minutes, at no cost, within two working days.
  3. You receive a short proposal with scope and stages.
  4. We start, under NDA.
- Location line: "Based in ⟦City⟧, the Netherlands". Until confirmed: "Based in the Netherlands".

**37. Contact details.** Keep office@KoKreaters.com and WhatsApp. No personal founder email for now. Add the KoKreaters LinkedIn company page ⟦URL⟧ next to the founder's profile.

# Part I · Footer, legal and SEO

**38. Footer.**

- White logo (item 11).
- Compact newsletter field (item 33).
- Legal line (item 10).
- Links: Privacy, Cookies, Terms.
- LinkedIn: both company page and founder profile.

**39. Page title and description (home).**

- Title: **KoKreaters | Techno-commercial consulting for agri, food, feed and nutrition**
- Description: "Senior techno-commercial consulting for agri, food, feed, nutrition and specialty-ingredient businesses: product and process development, plant performance, food safety and market access. Based in the Netherlands, working worldwide."

**40. Structured data (JSON-LD).**

- Remove `foundingDate`.
- Organisation: add `"sameAs"` with the LinkedIn company page ⟦URL⟧ and `"areaServed": ["Europe", "India", "Asia"]`.
- Founder `Person`: add `"jobTitle": "Founder and Principal"`, `"alumniOf": "CSIR-Central Food Technological Research Institute"`, `"knowsAbout": ["edible oils", "specialty fats", "3-MCPD and glycidyl esters", "trans-fat elimination", "food product development", "process design"]` and `"sameAs"` with his LinkedIn profile.

**41. Privacy policy.** Add:

- legal entity details (item 10);
- the newsletter provider (item 33);
- the playbook download (item 34): purpose, legal basis (consent), and retention period ⟦e.g. 24 months⟧.

# Part J · Photography

**42. Professional photo shoot (Ganeaysh to arrange).** Real photographs of Ganeaysh at work will do more for credibility than any stock image. Brief for the photographer:

- **Portrait (main):** waist-up, dark navy or charcoal suit, light shirt, no tie; soft natural light; neutral warm-grey or softly blurred office background. Vertical 4:5 and a horizontal 3:2 crop with space on the left for text.
- **On the plant floor:** hard hat and safety glasses in hand or worn, in front of tanks, pipework or a deodoriser. Ask a friendly plant or client for one hour of access, with written permission. Check that no third-party logos or confidential equipment are visible.
- **In the lab or pilot plant:** looking at an oil sample against the light, or at a crystallisation or texture test.
- **With people:** a workshop or whiteboard session, sitting with a plant team, a talk at a conference.
- **Netherlands:** one outdoor portrait in a recognisable Dutch setting.
- **Delivery:** at least 3000 px on the long side, colour-graded with slightly cool shadows to suit the navy palette.

Use these in place of the stock photos in the hero side panel, Approach cards (Develop, Scale), About page and founder block. Keep the stock landscape photos for the Industries tiles.

# Part K · Before go-live: items for Ganeaysh to confirm

Every ⟦placeholder⟧ in this brief, in one list. Nothing in brackets goes live.

| # | Item | Where |
|-----|------------------------------|--------------|
| 1 | Legal name and form, KvK number, BTW number, city | Items 10, 20, 36 |
| 2 | Products taken to market (⟦50+⟧), plants/lines (⟦10+⟧), customers (⟦100+⟧) | Item 23 |
| 3 | Specialty fats facility capacity | Story 1 |
| 4 | Indonesia yield gain | Story 3 |
| 5 | URL of Dr Tedros's post on X | Story 4 |
| 6 | Contaminant reduction figure (⟦≥ 50%⟧) | Item 27, Story 5 |
| 7 | Number of technology transfers | Story 6 |
| 8 | Asset-light business value | Story 7 |
| 9 | Number of product platforms | Story 8 |
| 10 | Number of transactions supported | Story 9 |
| 11 | Memberships actually held; talks, publications, patents | Item 25 |
| 12 | Two or three written testimonials with permission | Item 26 |
| 13 | Booking link (Cal.com or Calendly) | Item 36 |
| 14 | LinkedIn company page URL | Items 37, 40 |
| 15 | Playbook PDF | Item 34 |
| 16 | New photographs | Item 42 |
| 17 | Data retention period for downloads | Item 41 |

**When the pack is done:** deploy to the preview URL and send it back to Ganeaysh for a final review before switching KoKreaters.com live (and only then change `robots.txt`).
