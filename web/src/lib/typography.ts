/**
 * Typographic helpers (DESIGN-SPEC 0.2.3).
 * Figures and units are held together with U+202F NARROW NO-BREAK SPACE; the minus is U+2212.
 */
export const NNBSP = ' ';
export const MINUS = '−';
export const minus25 = `${MINUS}25${NNBSP}°C`; // '−25 °C'

/** Normalise "-25 °C" / "–25 °C" / "−25 °C" (any space) to the house form. */
export function normaliseFigures(text: string): string {
  return text.replace(/[-–−]25[\s  ]?°C/g, minus25);
}

export interface FigSegment { text: string; fig: boolean; frost: boolean; }

/**
 * Split `text` into segments, flagging every occurrence of an `emphasis` substring.
 * Components map segments to `<span class="fig">` (Fraunces 300, Sapphire, lnum, nowrap);
 * the −25 °C figure is also flagged `frost` (graft 8, `data-frost`).
 */
export function fig(text: string, emphasis: readonly string[] = []): FigSegment[] {
  const terms = emphasis.filter(Boolean);
  if (!terms.length) return [{ text, fig: false, frost: false }];
  const escaped = terms
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return text
    .split(re)
    .filter((part) => part !== '')
    .map((part) => {
      const isFig = terms.includes(part);
      return { text: part, fig: isFig, frost: isFig && part === minus25 };
    });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML-string form of fig(), for `set:html`. Text is escaped. */
export function figHtml(text: string, emphasis: readonly string[] = [], className = 'fig'): string {
  return fig(text, emphasis)
    .map((s) =>
      s.fig
        ? `<span class="${className}"${s.frost ? ' data-frost' : ''}>${escapeHtml(s.text)}</span>`
        : escapeHtml(s.text),
    )
    .join('');
}

/**
 * Acronym expansions for `<abbr title>` on first use per page, plus the sidenote text.
 * FSQR and CBE come from the brief; iTFA, 3-MCPD, GE, DAG and FFA are standard definitions (C-11, COMPOSED).
 */
export const abbreviations = {
  FSQR: { title: 'Food Safety, Quality and Regulatory', note: 'FSQR: Food Safety, Quality and Regulatory' },
  CBE: { title: 'cocoa butter equivalents', note: 'CBE: cocoa butter equivalents' },
  iTFA: { title: 'industrially produced trans-fatty acids', note: 'iTFA: industrially produced trans-fatty acids' }, // COMPOSED (C-11)
  '3-MCPD': { title: '3-monochloropropane-1,2-diol', note: '3-MCPD: 3-monochloropropane-1,2-diol' },            // COMPOSED (C-11)
  GE: { title: 'glycidyl esters', note: 'GE: glycidyl esters' },                                                // COMPOSED (C-11)
  DAG: { title: 'diacylglycerols', note: 'DAG: diacylglycerols' },                                              // COMPOSED (C-11)
  FFA: { title: 'free fatty acids', note: 'FFA: free fatty acids' },                                            // COMPOSED (C-11)
} as const;
export type Abbreviation = keyof typeof abbreviations;
