/**
 * Hero (DESIGN-SPEC v2 10.1 F1, signature move 1). Runs only with motion (inside a gsap.matchMedia context).
 * The network ships fully drawn; [data-hero-hide] groups are held at opacity 0 by motion.css until the bloom takes them.
 * The H1 is never touched at load; only its swoosh draws.
 *
 *   t=0     the five logo dots light, .35 → 1, stagger 90 ms
 *   t=.30   each elastic string draws (0.5 s power2.inOut, stagger .08, pillar order), its node pops back.out(2.2)
 *   t=1.15  the Orchid swoosh under "shared ambition" draws
 *   then    the elastic loop: pull a pillar node (≤ 160px), let go and it springs back; neighbours twitch (coupling .2);
 *           nodes within 160px of a fine pointer lean 8px toward it. The control point of each string lags its node, so
 *           strings bend and wobble. The sticker tilts ±3° with the pull (the whole mark, never its own nodes).
 */
import type { MotionContext } from '../motion/context';
import { swooshInto } from '../motion/reveal';

const ORDER = ['innovation', 'process', 'quality', 'strategy', 'deals', 'capability'] as const;
const C = { x: 320, y: 300 };
const PULL = 160, LEAN_R = 160, LEAN = 8;

export interface HeroParts {
  root: HTMLElement;
  svg: SVGSVGElement;
  cluster: SVGSVGElement | null;
  sticker: SVGGElement | null;
  groups: SVGGElement[];
  strings: SVGPathElement[];
  pillars: SVGGElement[];
  nodes: SVGGElement[];
  labels: SVGGElement[];
  base: { x: number; y: number }[];
}

export function heroParts(): HeroParts | null {
  const root = document.querySelector<HTMLElement>('[data-hero-root]');
  const svg = root?.querySelector<SVGSVGElement>('[data-hero-network]');
  if (!root || !svg) return null;
  const pillars = ORDER.map((k) => svg.querySelector<SVGGElement>(`.hn-pillar[data-p="${k}"]`)).filter((x): x is SVGGElement => !!x);
  return {
    root, svg,
    cluster: svg.querySelector<SVGSVGElement>('[data-hero="cluster"] svg'),
    sticker: svg.querySelector<SVGGElement>('[data-hero="sticker"]'),
    groups: Array.from(svg.querySelectorAll<SVGGElement>('[data-hero-hide]')),
    strings: ORDER.map((k) => svg.querySelector<SVGPathElement>(`[data-string="${k}"]`)).filter((x): x is SVGPathElement => !!x),
    pillars,
    nodes: pillars.map((g) => g.querySelector<SVGGElement>('.hn-node')!).filter(Boolean),
    labels: pillars.map((g) => g.querySelector<SVGGElement>('.hn-label')!).filter(Boolean),
    base: pillars.map((g) => ({ x: Number(g.dataset.x), y: Number(g.dataset.y) })),
  };
}

/** The network half of the bloom (strings + nodes), shared by the first play and the undock replay. */
export function networkInto(_ctx: MotionContext, tl: gsap.core.Timeline, p: HeroParts, at: number, speed = 1): void {
  const s = (n: number) => n * speed;
  tl.set(p.groups, { opacity: 1 }, at);
  tl.set(p.strings, { drawSVG: '0%' }, at);
  p.nodes.forEach((n, i) => tl.set(n, { scale: 0, svgOrigin: `${p.base[i].x} ${p.base[i].y}` }, at));
  tl.set(p.labels, { opacity: 0 }, at);
  p.strings.forEach((line, i) => {
    const start = at + s(i * .08);
    tl.to(line, { drawSVG: '100%', duration: s(.5), ease: 'power2.inOut' }, start);
    if (p.nodes[i]) tl.to(p.nodes[i], { scale: 1, duration: s(.6), ease: 'back.out(2.2)' }, start + s(.38));
    if (p.labels[i]) tl.to(p.labels[i], { opacity: 1, duration: s(.25), ease: 'power1.out' }, start + s(.55));
  });
  tl.set(p.strings, { clearProps: 'strokeDasharray,strokeDashoffset' }, '>');
  tl.set(p.labels, { clearProps: 'opacity' }, '>');
}

export function playBloom(ctx: MotionContext, p: HeroParts): gsap.core.Timeline {
  const { gsap } = ctx;
  const tl = gsap.timeline();
  const dots = Array.from(p.cluster?.querySelectorAll<SVGCircleElement>('g > g > circle:nth-child(3)') ?? []);
  if (dots.length) {
    tl.set(dots, { opacity: .35 }, 0);
    tl.to(dots, { opacity: 1, duration: .22, stagger: .09, ease: 'power1.out', clearProps: 'opacity' }, 0);
  }
  if (p.sticker) tl.from(p.sticker, { scale: .9, rotation: -8, svgOrigin: `${C.x} ${C.y}`, duration: .9, ease: 'elastic.out(1, .5)', clearProps: 'transform' }, 0);
  networkInto(ctx, tl, p, .3);
  const swoosh = p.root.querySelector('h1 [data-swoosh]');
  if (swoosh) {
    tl.call(() => p.root.classList.add('is-swooshed'), [], 1.15);
    swooshInto(tl, swoosh, 1.15);
  } else {
    p.root.classList.add('is-swooshed');
  }
  return tl;
}

/** The elastic strings (R12 spring). Returns a disposer. */
function elastic(ctx: MotionContext, p: HeroParts): () => void {
  const { gsap } = ctx;
  const n = p.pillars.length;
  const o = p.base.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, cx: 0, cy: 0, cvx: 0, cvy: 0 }));
  const mids = p.base.map((b) => ({ x: (C.x + b.x) / 2, y: (C.y + b.y) / 2 + 14 }));
  const setters = p.pillars.map((g) => ({ x: gsap.quickSetter(g, 'x'), y: gsap.quickSetter(g, 'y') }));
  let held = -1, hx = 0, hy = 0, px = -1e4, py = -1e4, raf = 0, last = 0, tilt = 0, tiltV = 0;
  const toSvg = (cx: number, cy: number) => {
    const m = p.svg.getScreenCTM();
    if (!m) return { x: cx, y: cy };
    const pt = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  };
  const draw = () => {
    for (let i = 0; i < n; i++) {
      const b = p.base[i], s = o[i];
      setters[i].x(s.x); setters[i].y(s.y);
      p.strings[i]?.setAttribute('d', `M${C.x} ${C.y} Q${(mids[i].x + s.cx).toFixed(1)} ${(mids[i].y + s.cy).toFixed(1)} ${(b.x + s.x).toFixed(1)} ${(b.y + s.y).toFixed(1)}`);
    }
    if (p.sticker) p.sticker.setAttribute('transform', `rotate(${tilt.toFixed(2)} ${C.x} ${C.y})`);
    const cl = p.cluster?.parentElement;
    if (cl) cl.setAttribute('transform', `rotate(${tilt.toFixed(2)} ${C.x} ${C.y})`);
  };
  const step = (t: number) => {
    raf = 0;
    const dt = Math.min(1 / 30, last ? (t - last) / 1000 : 1 / 60);
    last = t;
    let energy = 0, sumX = 0;
    for (let i = 0; i < n; i++) {
      const s = o[i], b = p.base[i];
      let tx = 0, ty = 0;
      if (i === held) {
        let dx = hx - b.x, dy = hy - b.y; const d = Math.hypot(dx, dy);
        if (d > PULL) { dx *= PULL / d; dy *= PULL / d; }
        tx = dx; ty = dy;
      } else {
        if (!ctx.paused && px > -1e3) {
          const dx = px - b.x, dy = py - b.y, d = Math.hypot(dx, dy);
          if (d < LEAN_R) { const f = (1 - d / LEAN_R) * LEAN; tx = (dx / (d || 1)) * f; ty = (dy / (d || 1)) * f; }
        }
        // coupling: neighbours on the ring feel 20 % of the displacement next to them
        const a = o[(i + n - 1) % n], c = o[(i + 1) % n];
        tx += .2 * (a.x + c.x) / 2; ty += .2 * (a.y + c.y) / 2;
      }
      const k = i === held ? 420 : 170, damp = i === held ? 30 : 9;
      s.vx += (k * (tx - s.x) - damp * s.vx) * dt; s.vy += (k * (ty - s.y) - damp * s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      // the string's control point lags at half the displacement on a softer spring
      s.cvx += (90 * (s.x * .5 - s.cx) - 6 * s.cvx) * dt; s.cvy += (90 * (s.y * .5 - s.cy) - 6 * s.cvy) * dt;
      s.cx += s.cvx * dt; s.cy += s.cvy * dt;
      energy += Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.cvx) + Math.abs(s.cvy) + Math.abs(tx - s.x) + Math.abs(ty - s.y);
      sumX += s.x * (b.y < C.y ? 1 : -1);
    }
    const tt = Math.max(-3, Math.min(3, sumX / 50));
    tiltV += (120 * (tt - tilt) - 10 * tiltV) * dt; tilt += tiltV * dt;
    energy += Math.abs(tiltV);
    draw();
    if (held >= 0 || energy > .05) raf = requestAnimationFrame(step);
    else last = 0;
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

  const nodeIndex = (t: EventTarget | null) => {
    const g = (t as Element | null)?.closest?.('.hn-pillar');
    return g ? p.pillars.indexOf(g as SVGGElement) : -1;
  };
  const onDown = (e: PointerEvent) => {
    const i = nodeIndex(e.target);
    if (i < 0) return;
    e.preventDefault();
    held = i;
    const q = toSvg(e.clientX, e.clientY); hx = q.x; hy = q.y;
    p.svg.setPointerCapture?.(e.pointerId);
    p.svg.classList.add('is-grabbing');
    wake();
  };
  const onMove = (e: PointerEvent) => {
    const q = toSvg(e.clientX, e.clientY);
    if (held >= 0) { hx = q.x; hy = q.y; wake(); return; }
    if (e.pointerType === 'mouse') { px = q.x; py = q.y; wake(); }
  };
  const onUp = (e: PointerEvent) => {
    if (held < 0) return;
    held = -1;
    p.svg.releasePointerCapture?.(e.pointerId);
    p.svg.classList.remove('is-grabbing');
    wake();
  };
  const onLeave = () => { px = py = -1e4; wake(); };
  const onTouch = (e: TouchEvent) => { if (nodeIndex(e.target) >= 0) e.preventDefault(); };
  const zone = p.root;
  p.svg.addEventListener('pointerdown', onDown);
  zone.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  zone.addEventListener('pointerleave', onLeave);
  p.svg.addEventListener('touchstart', onTouch, { passive: false });

  // Explore our expertise: every node gets a little kick, in pillar order
  const explore = p.root.querySelector<HTMLElement>('[data-hero-explore]');
  const kick = () => { o.forEach((s, i) => { setTimeout(() => { s.vy -= 220; s.vx += (p.base[i].x - C.x) * .6; wake(); }, i * 60); }); };
  explore?.addEventListener('pointerenter', kick);
  explore?.addEventListener('focus', kick);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    p.svg.removeEventListener('pointerdown', onDown);
    zone.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    zone.removeEventListener('pointerleave', onLeave);
    p.svg.removeEventListener('touchstart', onTouch);
    explore?.removeEventListener('pointerenter', kick);
    explore?.removeEventListener('focus', kick);
    o.forEach((s) => { s.x = s.y = s.cx = s.cy = 0; });
    tilt = 0; draw();
    p.sticker?.removeAttribute('transform');
    p.cluster?.parentElement?.removeAttribute('transform');
    gsap.set(p.pillars, { clearProps: 'transform' });
  };
}

export interface HeroControl { parts: HeroParts; bloom: gsap.core.Timeline | null; }

export function initHero(ctx: MotionContext, skipBloom = false): { control: HeroControl; cleanup: () => void } | null {
  const p = heroParts();
  if (!p) return null;
  let bloom: gsap.core.Timeline | null = null;
  if (skipBloom) {
    ctx.gsap.set(p.groups, { opacity: 1 });
    p.root.classList.add('is-swooshed');
  } else {
    bloom = playBloom(ctx, p);
  }
  let stop: (() => void) | null = null;
  const go = () => { if (!stop) stop = elastic(ctx, p); };
  if (bloom) bloom.eventCallback('onComplete', go); else go();
  return { control: { parts: p, bloom }, cleanup: () => { bloom?.kill(); stop?.(); p.root.classList.remove('is-swooshed'); } };
}
