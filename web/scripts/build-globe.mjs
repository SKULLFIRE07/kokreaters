// W1-brand: About globe data (DESIGN-SPEC 6.8).
// world-atlas land-110m (Natural Earth, public domain) → src/data/globe/coast.json (≤ 8KB, [[lon,lat],…][])
// and src/assets/globe/globe-static.svg (≤ 16KB): the scene's final state, Netherlands-facing.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from 'd3-geo';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const out = (p) => resolve(WEB, p);

// Places: read from src/data/places.ts when Node can strip types, else the spec 4.9 copy.
const FALLBACK_PLACES = [
  { name: 'Mundra', country: 'India', lat: 22.84, lon: 69.72 },
  { name: 'Kakinada', country: 'India', lat: 16.99, lon: 82.25 },
  { name: 'Gurugram', country: 'India', lat: 28.46, lon: 77.03 },
  { name: 'Pune', country: 'India', lat: 18.52, lon: 73.86 },
  { name: 'Medan', country: 'Indonesia', lat: 3.59, lon: 98.67 },
  { name: 'Odessa', country: 'Ukraine', lat: 46.48, lon: 30.72 },
  { name: 'Balikesir', country: 'Türkiye', lat: 39.65, lon: 27.88 },
  { name: 'Amsterdam', country: 'the Netherlands', lat: 52.37, lon: 4.90 },
];
async function loadPlaces() {
  try {
    const mod = await import(pathToFileURL(out('src/data/places.ts')).href);
    if (Array.isArray(mod.places) && mod.places.length === 8) return mod.places;
  } catch { /* fall through */ }
  return FALLBACK_PLACES;
}

// Douglas–Peucker on [lon,lat] pairs.
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      // closed rings start and end on the same point: fall back to point distance
      const d = len < 1e-9
        ? Math.hypot(pts[i][0] - x1, pts[i][1] - y1)
        : Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const ringLength = (r) => r.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0), 0);

async function main() {
  const topo = JSON.parse(await readFile(require.resolve('world-atlas/land-110m.json'), 'utf8'));
  const land = feature(topo, topo.objects.land);
  const rings = [];
  for (const f of land.features ?? [land]) {
    const g = f.geometry;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const poly of polys) for (const ring of poly) rings.push(ring);
  }

  if (!rings.length) throw new Error("no land rings");
  // Tighten until coast.json fits in 8KB.
  let tol = 0.4, json = '';
  for (let i = 0; i < 40; i++) {
    const lines = rings
      .filter((r) => ringLength(r) > tol * 12)
      .map((r) => simplify(r, tol).map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]))
      .filter((r) => r.length >= 4);
    json = JSON.stringify(lines);
    if (Buffer.byteLength(json) <= 8000) break;
    tol *= 1.15;
  }
  await mkdir(out('src/data/globe'), { recursive: true });
  await writeFile(out('src/data/globe/coast.json'), json + '\n');
  const coast = JSON.parse(json);

  // Static SVG: same data and projection as the scene's final state.
  const places = await loadPlaces();
  const proj = geoOrthographic().rotate([-5, -45]).scale(261).translate([300, 300]).clipAngle(90).precision(0.5);
  const path = geoPath(proj).digits(1);
  const pathLo = geoPath(proj).digits(0);   // whole pixels for the hairlines keeps the file under 16KB
  const centre = [5, 45];
  const graticule = pathLo(geoGraticule().step([20, 20]).extentMajor([[-180, -80.001], [180, 80.001]])());
  const coastPath = pathLo({ type: 'MultiLineString', coordinates: coast });
  const arcs = [];
  for (let i = 0; i < places.length - 1; i++) {
    arcs.push(path({ type: 'LineString', coordinates: [[places[i].lon, places[i].lat], [places[i + 1].lon, places[i + 1].lat]] }));
  }
  const rings2 = places
    .filter((p) => geoDistance([p.lon, p.lat], centre) < Math.PI / 2)
    .map((p) => { const [x, y] = proj([p.lon, p.lat]); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="7" fill="#fff" stroke="#2C509E" stroke-width="1.5"/><circle r="3" fill="#2C509E"/></g>`; })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">`
    + `<circle cx="300" cy="300" r="261" fill="none" stroke="#E4E0EE" stroke-width="1"/>`
    + `<path d="${graticule}" fill="none" stroke="#E4E0EE" stroke-width="1"/>`
    + `<path d="${coastPath}" fill="none" stroke="#4A5068" stroke-opacity="0.4" stroke-width="1" stroke-linejoin="round"/>`
    + `<g fill="none" stroke="#2C509E" stroke-width="1.5" stroke-linecap="round">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>`
    + `<g>${rings2}</g></svg>\n`;
  await mkdir(out('src/assets/globe'), { recursive: true });
  await writeFile(out('src/assets/globe/globe-static.svg'), svg);
  console.log(`build-globe: coast.json ${Buffer.byteLength(json)} B (tol ${tol.toFixed(2)}°, ${coast.length} lines), globe-static.svg ${Buffer.byteLength(svg)} B`);
}
main().catch((e) => { console.error(e); process.exit(1); });
