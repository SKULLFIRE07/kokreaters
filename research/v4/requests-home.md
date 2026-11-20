# Requests from unit HOME

1. **(Resolved: the files were renamed during this session; home now uses the proper slugs again.)** Three v4 photo files are saved under each other's names** (both in `assets/photos/unsplash-v4/` and
   `web/src/assets/photos/stock/`):
   - `agri-fields.jpg` actually shows **spice powders on black**
   - `nutrition-spices.jpg` actually shows **maize kernels**
   - `spare-maize.jpg` actually shows **the farm-field patchwork**
   The records in `web/src/data/photos.ts` (alt, focal, credit URL) describe the names, not the pictures, so every page
   that uses these slugs shows the wrong photo or wrong alt text. Suggested fix (owner of photos.ts): rename the three
   files (agri-fields ← spare-maize, nutrition-spices ← agri-fields, spare-maize ← nutrition-spices) and re-check each
   credit URL against its picture. Home works around it today (home.ts `industries.tiles` picks by content and carries
   its own alt); once renamed, set the tiles back to `agri-fields` / `nutrition-spices` and drop the `alt` overrides.
2. `site.email` in `src/config/site.ts` is `office@kokreaters.com`; the brand spelling is `office@KoKreaters.com`.
   Home/chrome display `emailDisplay` (nav.ts) and keep the lowercase mailto. Consider changing the config value.
3. Home's insight cards use the design's photos (3-MCPD → scale-tanks, trans fats → bakery-dough) via a home-only map;
   the article frontmatter still points at refinery-02 / bakery-02. The insights unit may want the same images.
4. Desktop nav is now Expertise · Industries · Approach · Insights · About (Impact moved to the mobile menu, the
   footer's Company column and the home Impact band link), per the guide.
