// Post-build rewrite for GitHub Pages project sites (served under /<repo>).
// Prefixes root-relative URLs in dist HTML/CSS/JS/XML/TXT with BASE_PATH. No-op when BASE_PATH is unset.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (!base) { console.log('pages-base: BASE_PATH unset, nothing to do'); process.exit(0); }
const dir = new URL('../dist/', import.meta.url).pathname;
const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const notBase = `(?!${esc.slice(1)}(?:/|"|'|\\)|$))`;

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}

const attr = new RegExp(`((?:href|src|action|poster|data-src|content)=["'])/${notBase}(?!/)`, 'g');
const srcset = /(srcset=["'])([^"']+)/g;
const cssUrl = new RegExp(`url\\((["']?)/${notBase}(?!/)`, 'g');
const jsStr = new RegExp(`(["'\`])/(${['_astro','fonts','brand','og','images','assets','favicon-32','favicon','apple-touch-icon','icon-512','site.webmanifest','expertise','industries','approach','impact','insights','about','contact','privacy','cookies','terms'].join('|')})(?=[/"'\`?#.])`, 'g');
let n = 0;
for await (const f of walk(dir)) {
  const ext = extname(f);
  if (!['.html', '.css', '.js', '.xml', '.txt', '.webmanifest', '.json'].includes(ext)) continue;
  let s = await readFile(f, 'utf8'); const before = s;
  if (ext === '.html' || ext === '.xml') {
    s = s.replace(attr, `$1${base}/`);
    s = s.replace(srcset, (_m, a, v) => a + v.replace(/(^|,\s*)\/(?!\/)/g, (_x, sep) => `${sep}${base}/`).replaceAll(`${base}${base}/`, `${base}/`));
    s = s.replace(/(href=["'])\/(["'])/g, `$1${base}/$2`);
  }
  if (ext === '.html' || ext === '.css') s = s.replace(cssUrl, `url($1${base}/`);
  if (ext === '.js' || ext === '.html' || ext === '.webmanifest' || ext === '.json') s = s.replace(jsStr, `$1${base}/$2`);
  // manifest start_url / scope "/" (the bare root is not caught by the named-path pattern above)
  if (ext === '.webmanifest') s = s.replace(/("(?:start_url|scope)"\s*:\s*")\/(")/g, `$1${base}/$2`);
  s = s.replaceAll(`${base}${base}/`, `${base}/`);
  if (s !== before) { await writeFile(f, s); n++; }
}
console.log(`pages-base: rewrote ${n} files under ${base}`);
