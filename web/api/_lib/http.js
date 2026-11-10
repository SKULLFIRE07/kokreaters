/**
 * Shared helpers for the Vercel Functions in /api (files and folders starting with "_" are not deployed as functions).
 * Web-standard Request/Response only, no dependencies.
 */

/** JSON response with no caching. */
export function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export const methodNotAllowed = () => json(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' });

/** Client IP as Vercel forwards it (first x-forwarded-for hop), or 'unknown'. */
export function clientIp(request) {
  const h = request.headers;
  const fwd = h.get('x-vercel-forwarded-for') || h.get('x-forwarded-for') || h.get('x-real-ip') || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

/**
 * Same-origin guard: a browser POST always carries Origin. Allow it when it matches the request's own host, a
 * localhost dev origin, or an entry in env ALLOWED_ORIGINS (comma-separated). Requests without Origin (server-to-server,
 * curl) pass; the rate limit still applies to them.
 */
export function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  let o;
  try { o = new URL(origin); } catch { return false; }
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || safeHost(request.url);
  if (o.host === host) return true;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(o.host)) return true;
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return extra.includes(o.origin) || ['https://kokreaters.com', 'https://www.kokreaters.com'].includes(o.origin);
}
function safeHost(url) { try { return new URL(url).host; } catch { return ''; } }

/**
 * Best-effort in-memory fixed-window rate limiter. Each warm function instance keeps its own counters (Fluid compute
 * reuses instances, so this stops casual abuse; it is not a global guarantee). Returns { ok, retryAfter }.
 */
export function rateLimiter({ limit, windowMs }) {
  const hits = new Map();
  return function check(key, now = Date.now()) {
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
    let e = hits.get(key);
    if (!e || e.reset <= now) { e = { count: 0, reset: now + windowMs }; hits.set(key, e); }
    e.count += 1;
    return { ok: e.count <= limit, retryAfter: Math.max(1, Math.ceil((e.reset - now) / 1000)) };
  };
}

/** Read the body as text with a byte cap. Returns null when it is too large. */
export async function readBody(request, maxBytes) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > maxBytes) return null;
  const text = await request.text();
  return Buffer.byteLength(text, 'utf8') > maxBytes ? null : text;
}

/** Parse a JSON, urlencoded or multipart body into a plain object of strings (first value per key). */
export async function parseFields(request, text) {
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (type.includes('application/json')) {
    const v = JSON.parse(text);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }
  let form;
  if (type.includes('multipart/form-data')) {
    form = await new Response(text, { headers: { 'Content-Type': request.headers.get('content-type') } }).formData();
  } else {
    form = new URLSearchParams(text);
  }
  const out = {};
  for (const [k, v] of form.entries()) if (!(k in out) && typeof v === 'string') out[k] = v;
  return out;
}

export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
