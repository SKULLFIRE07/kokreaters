/**
 * physics.ts (DESIGN-SPEC v2 9, FOUNDATION helper for gravity-tags and falling-text): a tiny 2D rigid-body world.
 * Bodies are capsules (a segment swept by a radius: a circle when the segment is 0, a pill/rounded box otherwise),
 * with gravity, box walls, impulse contacts with friction and rotation, pointer grab/throw and sleeping.
 * No DOM: the caller reads body.x / body.y / body.a each frame and writes transforms. Fixed 60 Hz step.
 * Usage:
 *   const w = new World({ width, height });
 *   const b = w.add({ x, y, width: 180, height: 52 });        // a pill; width === height → a circle
 *   w.grab(b, px, py); w.drag(px, py); w.release();            // pointer (velocity carries into the throw)
 *   w.step(dt) → boolean (true while anything is awake)
 */
export interface Body {
  x: number; y: number; a: number; vx: number; vy: number; w: number;
  hw: number; r: number; invM: number; invI: number; asleep: boolean; idle: number; data?: unknown;
}
export interface WorldOpts { width: number; height: number; gravity?: number; ceiling?: boolean; restitution?: number; friction?: number }

const dot = (ax: number, ay: number, bx: number, by: number) => ax * bx + ay * by;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Closest points between segments p1-q1 and p2-q2. */
function closest(p1x: number, p1y: number, q1x: number, q1y: number, p2x: number, p2y: number, q2x: number, q2y: number) {
  const d1x = q1x - p1x, d1y = q1y - p1y, d2x = q2x - p2x, d2y = q2y - p2y, rx = p1x - p2x, ry = p1y - p2y;
  const a = dot(d1x, d1y, d1x, d1y), e = dot(d2x, d2y, d2x, d2y), f = dot(d2x, d2y, rx, ry);
  let s = 0, t = 0;
  if (a <= 1e-9 && e <= 1e-9) { s = t = 0; }
  else if (a <= 1e-9) { t = clamp01(f / e); }
  else {
    const c = dot(d1x, d1y, rx, ry);
    if (e <= 1e-9) { s = clamp01(-c / a); }
    else {
      const b = dot(d1x, d1y, d2x, d2y), den = a * e - b * b;
      s = den > 1e-9 ? clamp01((b * f - c * e) / den) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp01(-c / a); } else if (t > 1) { t = 1; s = clamp01((b - c) / a); }
    }
  }
  return [p1x + d1x * s, p1y + d1y * s, p2x + d2x * t, p2y + d2y * t];
}

export class World {
  bodies: Body[] = [];
  width: number; height: number; g: number; ceiling: boolean; e: number; mu: number;
  private held: Body | null = null; private hx = 0; private hy = 0; private acc = 0;
  constructor(o: WorldOpts) {
    this.width = o.width; this.height = o.height; this.g = o.gravity ?? 2200; this.ceiling = o.ceiling ?? false;
    this.e = o.restitution ?? .25; this.mu = o.friction ?? .45;
  }
  resize(width: number, height: number) { this.width = width; this.height = height; this.wake(); }
  add(o: { x: number; y: number; width: number; height: number; angle?: number; data?: unknown }): Body {
    const r = Math.min(o.width, o.height) / 2, hw = Math.max(0, (o.width - o.height) / 2);
    const m = (o.width * o.height) / 1000, I = (m * (o.width * o.width + o.height * o.height)) / 12;
    const b: Body = { x: o.x, y: o.y, a: o.angle ?? 0, vx: 0, vy: 0, w: 0, hw, r, invM: 1 / m, invI: 1 / I, asleep: false, idle: 0, data: o.data };
    this.bodies.push(b); return b;
  }
  wake() { for (const b of this.bodies) { b.asleep = false; b.idle = 0; } }
  /** The body under a point (or null). */
  hit(px: number, py: number): Body | null {
    for (let i = this.bodies.length - 1; i >= 0; i--) {
      const b = this.bodies[i], [ex, ey] = this.end(b), [c1x, c1y] = closest(b.x - ex, b.y - ey, b.x + ex, b.y + ey, px, py, px, py);
      if (Math.hypot(px - c1x, py - c1y) <= b.r) return b;
    }
    return null;
  }
  grab(b: Body, px: number, py: number) { this.held = b; this.hx = px; this.hy = py; this.wake(); }
  drag(px: number, py: number) { this.hx = px; this.hy = py; }
  release() { this.held = null; }
  private end(b: Body) { return [Math.cos(b.a) * b.hw, Math.sin(b.a) * b.hw]; }

  /** Advance by dt seconds (fixed 1/60 sub-steps). Returns true while anything is awake. */
  step(dt: number): boolean {
    this.acc = Math.min(this.acc + dt, 1 / 15);
    const h = 1 / 60; let awake = false;
    while (this.acc >= h) { awake = this.sub(h); this.acc -= h; }
    return awake || this.held !== null;
  }

  private sub(h: number): boolean {
    const B = this.bodies;
    for (const b of B) {
      if (b.asleep) continue;
      b.vy += this.g * h;
      if (b === this.held) {
        b.vx = (this.hx - b.x) / h * .35; b.vy = (this.hy - b.y) / h * .35; b.w *= .8;
      }
      b.vx *= .999; b.vy *= .999; b.w *= .985;
    }
    for (let it = 0; it < 4; it++) {
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) this.pair(B[i], B[j]);
      for (const b of B) this.walls(b);
    }
    let awake = false;
    for (const b of B) {
      if (b.asleep) continue;
      b.x += b.vx * h; b.y += b.vy * h; b.a += b.w * h;
      const sp = Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.w) * 40;
      b.idle = sp < 18 && b !== this.held ? b.idle + 1 : 0;
      if (b.idle > 40) { b.asleep = true; b.vx = b.vy = b.w = 0; } else awake = true;
    }
    return awake;
  }

  private impulse(a: Body | null, b: Body, cx: number, cy: number, nx: number, ny: number, pen: number) {
    // relative velocity at the contact (b minus a)
    const rbx = cx - b.x, rby = cy - b.y, rax = a ? cx - a.x : 0, ray = a ? cy - a.y : 0;
    const vbx = b.vx - b.w * rby, vby = b.vy + b.w * rbx;
    const vax = a ? a.vx - a.w * ray : 0, vay = a ? a.vy + a.w * rax : 0;
    const rvx = vbx - vax, rvy = vby - vay, vn = rvx * nx + rvy * ny;
    const iMa = a ? a.invM : 0, iIa = a ? a.invI : 0;
    const ran = rax * ny - ray * nx, rbn = rbx * ny - rby * nx;
    const kn = iMa + b.invM + ran * ran * iIa + rbn * rbn * b.invI;
    // positional correction (split by inverse mass)
    const corr = Math.max(0, pen - .5) * .6 / (iMa + b.invM);
    if (a) { a.x -= nx * corr * iMa; a.y -= ny * corr * iMa; }
    b.x += nx * corr * b.invM; b.y += ny * corr * b.invM;
    if (vn > 0) return;
    const jn = (-(1 + this.e) * vn) / kn;
    const tx = -ny, ty = nx, vt = rvx * tx + rvy * ty;
    const rat = rax * ty - ray * tx, rbt = rbx * ty - rby * tx;
    const kt = iMa + b.invM + rat * rat * iIa + rbt * rbt * b.invI;
    let jt = -vt / kt; const lim = this.mu * jn; jt = Math.max(-lim, Math.min(lim, jt));
    const px = nx * jn + tx * jt, py = ny * jn + ty * jt;
    if (a) { a.vx -= px * iMa; a.vy -= py * iMa; a.w -= (rax * py - ray * px) * iIa; }
    b.vx += px * b.invM; b.vy += py * b.invM; b.w += (rbx * py - rby * px) * b.invI;
  }

  private pair(a: Body, b: Body) {
    if (a.asleep && b.asleep) return;
    const [aex, aey] = this.end(a), [bex, bey] = this.end(b);
    const [c1x, c1y, c2x, c2y] = closest(a.x - aex, a.y - aey, a.x + aex, a.y + aey, b.x - bex, b.y - bey, b.x + bex, b.y + bey);
    let nx = c2x - c1x, ny = c2y - c1y; const d = Math.hypot(nx, ny), rr = a.r + b.r;
    if (d >= rr) return;
    if (d < 1e-6) { nx = 0; ny = 1; } else { nx /= d; ny /= d; }
    if (a.asleep || b.asleep) { a.asleep = b.asleep = false; a.idle = b.idle = 0; }
    this.impulse(a, b, c1x + nx * a.r, c1y + ny * a.r, nx, ny, rr - d);
  }

  private walls(b: Body) {
    if (b.asleep) return;
    const [ex, ey] = this.end(b);
    for (const s of [-1, 1]) {
      const px = b.x + ex * s, py = b.y + ey * s;
      if (py + b.r > this.height) this.impulse(null, b, px, this.height, 0, -1, py + b.r - this.height);
      if (this.ceiling && py - b.r < 0) this.impulse(null, b, px, 0, 0, 1, b.r - py);
      if (px - b.r < 0) this.impulse(null, b, 0, py, 1, 0, b.r - px);
      if (px + b.r > this.width) this.impulse(null, b, this.width, py, -1, 0, px + b.r - this.width);
      if (b.hw === 0) break;
    }
  }
}
