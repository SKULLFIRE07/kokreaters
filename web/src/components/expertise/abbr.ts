/**
 * First-use acronym expansion for one pillar page (DESIGN-SPEC 5.3 item 2, 4.4 FSQR note, C-11).
 * One expander per page: each acronym becomes <abbr title> the first time it appears, and
 * FSQR / 3-MCPD also return their sidenote text. CBE is already expanded by the brief text itself
 * ("cocoa butter equivalents (CBE)"), so it gets the <abbr> but no sidenote.
 */
import { abbreviations } from '@/lib/typography';

const TERMS = [
  { key: '3-MCPD', re: /(^|[^\w-])(3-MCPD)(?![\w-])/, note: true },
  { key: 'FSQR', re: /(^|[^\w-])(FSQR)(?![\w-])/, note: true },
  { key: 'CBE', re: /(^|[^\w-])(CBE)(?![\w-])/, note: false },
] as const;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface Expanded { html: string; notes: string[] }

export function createAbbreviator() {
  const seen = new Set<string>();
  return (text: string): Expanded => {
    let html = escapeHtml(text);
    const notes: string[] = [];
    for (const t of TERMS) {
      if (seen.has(t.key) || !t.re.test(html)) continue;
      const a = abbreviations[t.key];
      html = html.replace(t.re, (_m, pre: string, term: string) => `${pre}<abbr title="${escapeHtml(a.title)}">${term}</abbr>`);
      seen.add(t.key);
      if (t.note) notes.push(a.note);
    }
    return { html, notes };
  };
}
