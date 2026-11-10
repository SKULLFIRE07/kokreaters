// About: static map of the eight places (REDESIGN-V3 §4 About; replaces the v2 WebGL globe and build-globe.mjs).
//
//   node scripts/build-map.mjs
//
// world-atlas countries-50m (Natural Earth, public domain) → an Equal Earth projection cropped to the region the
// career spans (Western Europe to Sumatra), written as:
//   src/assets/map/places-map.svg   land in grey-100, the five career countries in grey-200 with a white hairline edge.
//                                   Flat fills only, no text, no nodes (the page draws the ringed nodes and the labels
//                                   in HTML so they stay crisp and the same size at every width).
//   src/data/map/places-map.json    { width, height, places: [{ name, x, y }] } with x / y in % of the map box,
//                                   so the component can place each node exactly over its city.
// Re-run whenever src/data/places.ts changes. No runtime dependency: d3-geo, topojson-client and world-atlas are dev
// dependencies used only here.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoEqualEarth, geoPath } from 'd3-geo';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const out = (p) => resolve(WEB, p);

/** Map box (viewBox units). The page scales it to the container. */
const W = 1200;
/** Region: lon/lat box the crop must contain (Amsterdam at the top left, Medan at the bottom right, with air). */
const REGION = { west: -10, east: 112, south: -3, north: 58 };
/** Centre meridian of the projection (keeps the region's meridians close to vertical). */
const CENTRE_LON = 50;
/** ISO 3166-1 numeric ids of the five career countries (India, Indonesia, Ukraine, Türkiye, the Netherlands). */
const CAREER = new Set(['356', '360', '804', '792', '528']);
/** Colours: palette tokens from src/styles/tokens.css (grey-100 land, grey-200 career countries, white borders). */
const LAND = '#E7E7E3';
const LAND_CAREER = '#D9D9D4';
const BORDER = '#FFFFFF';

async function loadPlaces() {
  const mod = await import(pathToFileURL(out('src/data/places.ts')).href);
  if (!Array.isArray(mod.places) || !mod.places.length) throw new Error('src/data/places.ts exports no places');
  return mod.places;
}

// Douglas–Peucker on projected [x, y] pairs (closed rings keep their first and last point).
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = len < 1e-9
        ? Math.hypot(pts[i][0] - x1, pts[i][1] - y1)
        : Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Turn d3's path string into simplified, rounded subpaths; drops specks smaller than `minArea` px². */
function tidy(d, { tol = 0.6, minArea = 3, closed = true } = {}) {
  if (!d) return '';
  const parts = d.split(/(?=M)/);
  const outParts = [];
  for (const part of parts) {
    const nums = part.replace(/[MLZ]/g, ' ').trim().split(/[\s,]+/).map(Number);
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
    if (pts.length < 2) continue;
    if (closed) {
      let area = 0;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) area += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
      if (Math.abs(area / 2) < minArea) continue;
    }
    const s = simplify(pts, tol);
    if (s.length < (closed ? 3 : 2)) continue;
    const r = (n) => Math.round(n * 10) / 10;
    outParts.push(`M${s.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}${closed ? 'Z' : ''}`);
  }
  return outParts.join('');
}

async function main() {
  const topo = JSON.parse(await readFile(require.resolve('world-atlas/countries-50m.json'), 'utf8'));
  const countries = feature(topo, topo.objects.countries).features;
  const land = feature(topo, topo.objects.land);

  // Fit the region's outline (sampled densely, since meridians curve in Equal Earth) to the map width.
  const outline = [];
  for (let t = 0; t <= 1.0001; t += 1 / 32) {
    const lon = REGION.west + (REGION.east - REGION.west) * t;
    const lat = REGION.south + (REGION.north - REGION.south) * t;
    outline.push([lon, REGION.south], [lon, REGION.north], [REGION.west, lat], [REGION.east, lat]);
  }
  const proj = geoEqualEarth().rotate([-CENTRE_LON, 0]).precision(0.2);
  proj.fitWidth(W, { type: 'MultiPoint', coordinates: outline });
  const [[, y0], [, y1]] = geoPath(proj).bounds({ type: 'MultiPoint', coordinates: outline });
  const H = Math.round(y1 - y0);
  const [tx, ty] = proj.translate();
  proj.translate([tx, ty - y0]).clipExtent([[0, 0], [W, H]]);
  const path = geoPath(proj);

  const landD = tidy(path(land));
  const careerD = tidy(path({ type: 'FeatureCollection', features: countries.filter((f) => CAREER.has(String(f.id))) }));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
    + `<path d="${landD}" fill="${LAND}"/>`
    + `<path d="${careerD}" fill="${LAND_CAREER}" stroke="${BORDER}" stroke-width="1" stroke-linejoin="round"/>`
    + `</svg>\n`;

  const places = await loadPlaces();
  const pct = (n, of) => Math.round((n / of) * 10000) / 100;
  const placed = places.map((p) => {
    const [x, y] = proj([p.lon, p.lat]);
    if (x < 0 || x > W || y < 0 || y > H) throw new Error(`${p.name} falls outside the map box; widen REGION`);
    return { name: p.name, x: pct(x, W), y: pct(y, H) };
  });

  await mkdir(out('src/assets/map'), { recursive: true });
  await mkdir(out('src/data/map'), { recursive: true });
  await writeFile(out('src/assets/map/places-map.svg'), svg);
  await writeFile(out('src/data/map/places-map.json'), JSON.stringify({ width: W, height: H, places: placed }, null, 2) + '\n');
  console.log(`build-map: places-map.svg ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB (${W}×${H}), ${placed.length} places`);
}
main().catch((e) => { console.error(e); process.exit(1); });
