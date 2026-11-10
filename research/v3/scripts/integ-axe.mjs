// Throwaway (integrator QA): axe-core WCAG 2.1 AA scan + quick keyboard check.
//   node integ-axe.mjs <base> [paths=/styleguide,/,/contact]
import { chromium } from '../../../web/node_modules/playwright/index.mjs';
import { AxeBuilder } from '../../../web/node_modules/@axe-core/playwright/dist/index.mjs';
const [base, list = '/styleguide,/,/contact'] = process.argv.slice(2);
const b = await chromium.launch();
let total = 0;
try {
  for (const route of list.split(',')) for (const w of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, isMobile: w < 600, hasTouch: w < 600 });
    const p = await ctx.newPage();
    await p.emulateMedia({ reducedMotion: 'reduce' });          // reveals settle instantly (no mid-fade contrast noise)
    await p.goto(base + route, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .exclude('astro-dev-toolbar').analyze();
    console.log(`\n${route} @ ${w}: ${r.violations.length} violation types, ${r.passes.length} passes, ${r.incomplete.length} incomplete`);
    for (const v of r.violations) {
      total += v.nodes.length;
      console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 6)) console.log(`     ${n.target.join(' ')}  ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`);
    }
    // keyboard: first 12 tab stops at this width, with whether a visible outline is drawn
    const stops = [];
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Tab');
      stops.push(await p.evaluate(() => {
        const a = document.activeElement; if (!a) return '-';
        const cs = getComputedStyle(a); const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2;
        const t = (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22);
        return `${a.tagName.toLowerCase()}${ring ? '' : '(no-ring)'}:${t}`;
      }));
    }
    console.log('  tab:', stops.join(' | '));
    await ctx.close();
  }
} finally { await b.close(); }
console.log(`\nTOTAL violating nodes: ${total}`);
