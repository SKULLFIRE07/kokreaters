# KoKreaters website v3: content drafted for approval

Prepared 10 November 2026 for Ganeaysh Kulkarni. Branch `redesign/v3-editorial` (not committed, pushed or deployed).

The brief (`research/BRIEF.txt`, version 1.0, 4 November 2026) left some gaps on the site. We have filled them with
draft copy so that every page reads as complete. Every sentence below restates facts that are already in the brief or in
the site data. **We added no new numbers, clients, dates, testimonials or claims.** The new copy now appears in every
mode: staging, the preview link and production.

Please approve each item, or send a correction. To change any line, edit the named data file and field.

---

## 1. Approach page (`/approach`): How we work

File: `web/src/data/approach.ts`, `steps[]`. These replace the nine empty cells (brief CONFIRM 10). The brief asked for
each step to show "what we do, what you get, typical duration" (brief 6.4).

### Step 1 · Connect

| Field | Drafted text | Derived from |
|---|---|---|
| What we do | Plant observation, conversations with your teams and a review of your data, before any recommendation. | Step 1 copy "We listen first, then diagnose" (brief 6.1); principle "Evidence before opinion: Data, trials and plant observation first; recommendations second." (6.4) |
| What you get | A written diagnosis with the evidence behind it, such as an audit report or gap analysis, and a proposed scope for the next step. | Diagnostic model "report within two weeks" (6.4); Food Safety deliverables "Audit reports with photographic evidence · gap analyses" (6.2.3) |
| Typical duration | Typically 2–5 days on site, with the report within two weeks. | Diagnostic or audit model "2–5 days on site, report within two weeks" (6.4), word for word |

### Step 2 · Collaborate

| Field | Drafted text | Derived from |
|---|---|---|
| What we do | Working sessions, trials and design reviews with your teams, from the plant floor to the boardroom. | Step 2 copy "We design the answer with your teams" (6.1); principles "Plant floor to boardroom" and "Evidence before opinion" (data, trials) (6.4) |
| What you get | An answer your team helped design and owns, such as a process design basis, a formulation plan or a business plan. | Step 2 copy "…so the people who will run it own it"; deliverables "Process design basis" (6.2.2), "formulation and prototype plans" (6.2.1), "business plans with scenarios" (6.2.4) |
| Typical duration | Typically 4–16 weeks, as a project with a fixed scope. | Project model "Fixed scope, 4–16 weeks" (6.4) |

### Step 3 · Create

| Field | Drafted text | Derived from |
|---|---|---|
| What we do | Scale-up, commissioning and launch support, training for the people who will run the solution, and a structured handover. | Step 3 copy "We build, test and scale the solution, then hand it over" (6.1); deliverables "lab-to-plant scale-up plans · launch support" (6.2.1), "commissioning support" (6.2.2), "Training programmes · transfer playbooks" (6.2.6) |
| What you get | A solution in operation, a team that can run it without us, and agreed measures that show the result. | Step 3 copy "…with the measures to prove it works"; principle "Your team owns the result: … so you do not depend on us afterwards" (6.4); brand promise "so it still works after we have gone" (1) |
| Typical duration | Typically half a day to two days of training, then a set number of days each month if you want ongoing support. | Workshops and training model "Half a day to two days"; Advisory retainer model "A set number of days each month" (6.4) |

The durations repeat the engagement models table, so if you change a model, please also change the matching step.

---

## 2. Approach page (`/approach`): frequently asked questions

File: `web/src/data/approach.ts`, `faq[]`. The brief has no FAQ. The REDESIGN-V3 contract (§4, §8.8) asked for these
five questions, answered only from facts in the data. The staging-only "C-22" approval tags are now removed.

| # | Question | Drafted answer | Derived from |
|---|---|---|---|
| 1 | Do you sign an NDA? | Yes. Your formulations, processes and plans stay yours. We sign NDAs as standard. We are happy to sign yours before the first detailed conversation. | Principle "Confidential by default" (6.4), word for word; the last sentence is the wording suggested in REDESIGN-V3 §4 |
| 2 | How are fees agreed? | We agree the scope and fee with you before any work starts. | REDESIGN-V3 §8.8. The brief says nothing about the fee basis, so this answer makes no commitment (for example, no mention of fixed fees) |
| 3 | Do you work on site or remotely? | Both, depending on the work. We start where the problem lives: on your plant floor, in your lab, with your customers. A diagnostic or audit typically means 2–5 days on site, with the report within two weeks. For longer engagements, the balance of site visits and remote work is agreed with you in the scope. | Step 1 copy (6.1); Diagnostic model (6.4); "Based in the Netherlands, working worldwide" (6.8) |
| 4 | Which languages do you work in? | Ganeaysh works in English, Hindi and Marathi, with conversational Bahasa Indonesia and basic Russian. | Long bio (6.7), word for word. The question used to say "speak"; it now says "work in", to match the bio |
| 5 | Where are you based, and do you travel? | We are based in the Netherlands and work with clients worldwide. Ganeaysh’s career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands. Travel for on-site work is agreed with you as part of the scope. | Long bio (6.7); contact details "Based in the Netherlands, working worldwide" (6.8). No travel terms or costs are promised |

---

## 3. Impact page (`/impact`): "The challenge" rows

File: `web/src/data/impact.ts`, `founderResults[].challenge`. These fill three empty rows (spec C-9). The Ukraine
challenge was already in the brief (6.5) and is unchanged.

| Case | Drafted text | Derived from |
|---|---|---|
| India · Wilmar | Create integrated specialty fats production in India, where no facility of its kind yet existed. | "India’s first world-class integrated specialty fats facility, built and activated" (6.1 card 1; long bio 6.7) |
| Indonesia · Wilmar | Turn manufacturing operations in Indonesia into a source of growth for the business. | "21% growth in Indonesia by reshaping manufacturing operations" (6.1 card 2; long bio 6.7) |
| Trans fat · Cargill | Eliminate industrially produced trans fat from oils and fats through reformulation. | "Trans-fat (iTFA) elimination work" (6.1 card 4; long bio 6.7); "Reformulation and renovation: trans-fat elimination" (6.2.1); iTFA = industrially produced trans-fatty acids (the site’s abbreviation note) |

These three cases now show The challenge and What was done (and, for the trans-fat case, The result). As before, a
row that would only repeat the headline is left out.

---

## 4. Industries page (`/industries`): intro paragraph

File: `web/src/data/industries.ts`, `industriesPage.lead`. This replaces the one-line placeholder and closes C-15 (the
brief's "one-paragraph intro").

> Our roots are in edible oils and specialty fats, so we are at our best where fat functionality decides whether a
> product succeeds: texture, bloom, shelf life, mouthfeel and cost. That knowledge runs from the refinery into
> confectionery, bakery, nutrition, plant-based foods and snacks, and on into personal care, pet food and the inputs the
> oils industry depends on. Each of the nine industries below links to the expertise it draws on most.

Derived from: the Product and Category Innovation intro (brief 6.2.1, "Our roots are in oils and fats, so we are at our
best where fat functionality decides whether a product succeeds: texture, bloom, shelf life, mouthfeel and cost");
the nine sector names (6.3); "the inputs the oils industry depends on" (6.3, Industrial minerals). The last sentence
describes the "Relevant expertise" links on each card.

---

## 5. Already on the site, still waiting for your approval

These lines come word for word from the brief and already show in every mode. Only staging carries an approval tag.
We did not change them.

- Founder quote on Home: "Co-creation and creativity are at the soul of everything we do. We do not just advise. We
  create with you." (CONFIRM 4)
- "Ganeaysh Kulkarni founded KoKreaters in 2026…", plus the career dates in the bio and timeline (CONFIRM 13)
- Engagement models and durations table on Approach (CONFIRM 10). The step durations above depend on it.
- Headline option A, "Where deep expertise meets shared ambition." (CONFIRM 2)
- CBE and specialty-fats wording, Product and Category Innovation item 01 (CONFIRM 7)
- "Working with global leaders in nutrition, food, personal care and pet food": sectors only, no company names
  (CONFIRM 5)
- Public email office@kokreaters.com and the "replies within one working day" promise (CONFIRM 9)

---

## 6. Still missing: only you can provide these

These stay hidden on the preview link and in production until you supply them. We have not drafted them, because doing
so would mean inventing facts or making commitments on your behalf.

| Item | Where it would show | Brief ref |
|---|---|---|
| Legal entity name, KvK number, VAT number, registered address | Footer, privacy policy | CONFIRM 11 |
| Trademark filing status and when ® may be used (™ is shown meanwhile) | Footer, terms | CONFIRM 12 |
| Data retention period ("How long we keep it") | Privacy policy | legal |
| Governing law and courts, Turnstile use, form provider | Terms, cookies, privacy | legal, CONFIRM 9 |
| Free first conversation ("The first conversation is free of charge.") | CTA band on every page | CONFIRM 9: a commercial promise, kept hidden |
| Booking tool link (Calendly, Cal.com or Google appointment page) | Contact page "Book a 30-minute call" card | CONFIRM 9 |
| Written client consent for the three anonymised KoKreaters engagements (European industrial minerals; Indian specialty fats audit; North Indian edible oils) | Impact, "KoKreaters engagements" | CONFIRM 6, C-12 |
| Two to four testimonials with name, role and written permission | Impact | CONFIRM 8 |
| A founder result for Strategy, Feasibility and Market Entry and for M&A, Due Diligence and Partnerships | "From our founder’s career" band on those two pillar pages | C-8 |
| Whether to name companies worked with, and permission for any logos | About | CONFIRM 5 |
| Approval of the two draft Insights articles, publication dates, and the open author checks (EU and India limits for 3-MCPD/GE and trans fat) | Insights, articles | CONFIRM 14, C-14 |
| Approval of the industry ↔ expertise links (composed; Due diligence and Capability link to no industry yet) | Industries cards, pillar pages | C-10 |
| Vector logo files and the professional portrait session | Site-wide | CONFIRM 1, 3 |
