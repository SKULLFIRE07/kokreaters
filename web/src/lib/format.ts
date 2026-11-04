/** Formatting helpers. British English, en-GB dates, tabular figures are a CSS concern. */
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** `4 Nov 2026` (DESIGN-SPEC 5.0.10). */
export function formatDate(d: Date | string | undefined | null): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? '' : dateFmt.format(date);
}

/** ISO date `2026-11-04` for `<time datetime>` and JSON-LD. */
export function isoDate(d: Date | string | undefined | null): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

/** Two-digit index: 1 → "01". */
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Fill a `{n}` style template: fill('{n} min read', { n: 4 }) → "4 min read". */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** Join with a middle dot: "India · Wilmar". */
export const dotJoin = (parts: readonly (string | null | undefined | false)[]): string =>
  parts.filter(Boolean).join(' · ');
