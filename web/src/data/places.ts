/** About globe places (DESIGN-SPEC 4.9; brief 6.7). Brief order; arcs join consecutive places. No chronology is implied (C-13). */
export const places = [
  { name: 'Mundra', country: 'India', lat: 22.84, lon: 69.72 },
  { name: 'Kakinada', country: 'India', lat: 16.99, lon: 82.25 },
  { name: 'Gurugram', country: 'India', lat: 28.46, lon: 77.03 },
  { name: 'Pune', country: 'India', lat: 18.52, lon: 73.86 },
  { name: 'Medan', country: 'Indonesia', lat: 3.59, lon: 98.67 },
  { name: 'Odessa', country: 'Ukraine', lat: 46.48, lon: 30.72 },
  { name: 'Balikesir', country: 'Türkiye', lat: 39.65, lon: 27.88 },
  { name: 'Amsterdam', country: 'the Netherlands', lat: 52.37, lon: 4.90 },
] as const;

export type PlaceEntry = (typeof places)[number];
export const placeLabel = (p: PlaceEntry): string => `${p.name}, ${p.country}`;
