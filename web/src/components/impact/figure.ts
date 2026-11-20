/**
 * Pack 3 (lead decision 4): a big number is Bodoni lining figures with its unit in Manrope beside it. Splits a story /
 * strip value into the number and the unit: "21%" → 21 + %, "−25 °C" → −25 + °C, "3,000" + "t/day" (career.ts already
 * carries `unit`). Values that are not a number ("1st", "WHO", "$X m") stay whole, as `num` with no unit.
 */
export interface SplitFigure { num: string; unit: string }
export function splitFigure(value: string, unit?: string): SplitFigure {
  if (unit) return { num: value, unit };
  const m = value.match(/^([≥≤~−\-–+]?\s?[\d.,]+)\s*([%°][\sC]*|[a-zA-Z/]+)?$/u);
  if (!m || !m[2] || /^(st|nd|rd|th)$/.test(m[2])) return { num: value, unit: '' };
  return { num: m[1].trim(), unit: m[2].trim() };
}
