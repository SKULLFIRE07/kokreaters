/**
 * Home motion (DESIGN-SPEC v2 10.1 + 00.2/00.3): hero bloom + elastic network + dock, MagneticLetters (lazy), the proof
 * line and counts, the Emulsion (lazy WebGL), the pinned "plant floor → boardroom" pipeline, the pillar hub that
 * assembles and then tracks the pinned rail, the scrubbed method line, the route map, and the gravity tags (lazy).
 * Everything else is the shared FOUNDATION grammar (reveals, notes, stickers, marquee, rails, counts, parallax).
 * Every tween is created inside ctx.mm.add(), so a flip to reduced motion reverts to the server-rendered final state.
 */
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from '../motion/context';
import { countUp } from '../motion/countup';
import { initHero } from './hero';
import { initDock, loadedPastHero } from './dock';

const MOTION = '(prefers-reduced-motion: no-preference)';
const IMPERIAL = '#3A1C5C';
const SAFFRON = '#F4C841';
const failed = () => document.documentElement.classList.contains('motion-failed');

/* ── Proof band (graft 2) ─────────────────────────────────────────────────────────────── */

function initProof(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-proof]');
  if (!root) return;
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const { gsap } = ctx;
    const line = root.querySelector<HTMLElement>('[data-proof-line]');
    const items = Array.from(root.querySelectorAll<HTMLElement>('.proof__item'));
    if (!line || !items.length) return;
    const lineVisible = getComputedStyle(line).display !== 'none';
    const lineBox = line.getBoundingClientRect();
    const LINE = 1.2;

    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } });
    if (lineVisible) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: LINE, ease: 'power2.inOut', transformOrigin: '0% 50%' }, 0);

    items.forEach((item, i) => {
      const node = item.querySelector<HTMLElement>('[data-proof-node]');
      const counter = item.querySelector<HTMLElement>('[data-count]');
      const word = item.querySelector<HTMLElement>('[data-proof-word]');
      const label = item.querySelector<HTMLElement>('.proof__label');
      // The node lights when the line passes its x fraction; below 768 they light in turn.
      const x = node && lineVisible ? node.getBoundingClientRect().left - lineBox.left : 0;
      const at = lineVisible && lineBox.width > 0 ? LINE * Math.min(1, Math.max(0, x / lineBox.width)) : i * .15;
      if (node) {
        tl.fromTo(node, { scale: .6, backgroundColor: IMPERIAL },
          { scale: 1, backgroundColor: SAFFRON, duration: .22, ease: 'power1.out', clearProps: 'transform,backgroundColor' }, at);
      }
      const counted = counter ? countUp(counter) : null;
      if (counter) {
        // Hidden until its node lights, so the final figure never flashes before the count.
        tl.fromTo(counter, { opacity: 0 }, { opacity: 1, duration: counted ? .12 : .4, ease: 'power1.out', clearProps: 'opacity' }, at);
        if (counted) { counted.pause(0); tl.add(counted.play(), at); }
      }
      if (word) tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out', clearProps: 'opacity' }, at);
      if (label) tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out', clearProps: 'opacity' }, at);
    });
  });
}

/* ── Method line (reused by approach.ts) ──────────────────────────────────────────────── */

/**
 * Scrub the Connect · Collaborate · Create line across its fold (no pin): the visible path
 * draws 0 → 100%, each ring's dot fills as progress crosses its fraction (0, .5, 1), the arrow
 * head fades in at the end. Horizontal ≥ 768px, vertical below; the same code drives both.
 * `root` is the fold (the ScrollTrigger trigger) or the [data-method-line] element itself.
 * Reduced motion: nothing runs; the line ships drawn and the rings filled.
 */
function initMethodLine(root: Element | null, ctx: MotionContext): void {
  if (!root) return;
  const line = root.matches('[data-method-line]') ? root : root.querySelector('[data-method-line]');
  if (!line) return;
  const fold = root.matches('[data-method-line]') ? (line.closest('section') ?? line) : root;

  ctx.mm.add({ h: `${MOTION} and (min-width: 768px)`, v: `${MOTION} and (max-width: 767px)` }, (c) => {
    if (failed()) return;
    const { gsap } = ctx;
    const vertical = !!(c.conditions as { v?: boolean }).v;
    const pathSvg = line.querySelector<SVGSVGElement>(vertical ? '.ml-path--v' : '.ml-path--h');
    const head = line.querySelector<SVGSVGElement>(vertical ? '.ml-head--v' : '.ml-head--h');
    const dots = Array.from(line.querySelectorAll<SVGCircleElement>('[data-ring]'));
    if (!pathSvg) return;

    // The path uses non-scaling strokes inside preserveAspectRatio="none", which DrawSVG cannot
    // measure; drawing is a scale from the start edge, which reads identically on a straight line.
    const axis = vertical ? 'scaleY' : 'scaleX';
    gsap.set(pathSvg, { [axis]: 0, transformOrigin: vertical ? '50% 0%' : '0% 50%' });
    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
    if (head) gsap.set(head, { opacity: 0 });

    const fractions = dots.map((_, i) => (dots.length > 1 ? i / (dots.length - 1) : 0));
    const lit = dots.map(() => false);
    let headOn = false;
    const apply = (prog: number) => {
      fractions.forEach((f, i) => {
        const on = prog >= Math.max(.02, Math.min(.98, f));
        if (on !== lit[i]) {
          lit[i] = on;
          gsap.to(dots[i], { opacity: on ? 1 : 0, scale: on ? 1 : 0, duration: .22, ease: 'power1.out', overwrite: true });
        }
      });
      const h = prog >= .99;
      if (head && h !== headOn) { headOn = h; gsap.to(head, { opacity: h ? 1 : 0, duration: .2, overwrite: true }); }
    };

    const tween = gsap.to(pathSvg, {
      [axis]: 1, ease: 'none',
      scrollTrigger: {
        trigger: fold, start: 'top 70%', end: 'bottom 60%', scrub: .6,
        onUpdate: (self: ScrollTrigger) => apply(self.progress),
      },
    });
    // Sync the thresholds with wherever the page already is (reload mid-page).
    apply((tween.scrollTrigger as ScrollTrigger | undefined)?.progress ?? 0);
  });
}

/* ── Plant floor → boardroom (00.2, the centrepiece) ───────────────────────────────────── */

function initPipeline(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-pipeline]');
  if (!root) return;
  ctx.mm.add({ desk: `${MOTION} and (min-width: 768px)`, mob: `${MOTION} and (max-width: 767px)` }, (c) => {
    if (failed()) return;
    const { gsap } = ctx;
    const mob = !!(c.conditions as { mob?: boolean }).mob;
    const pipes = Array.from(root.querySelectorAll<SVGPathElement>('[data-pipe]'));
    const flow = root.querySelector<SVGPathElement>('[data-pipe-flow]');
    const stations = Array.from(root.querySelectorAll<SVGGElement>('[data-station]'));
    const labels = Array.from(root.querySelectorAll<SVGGElement>('[data-station-label]'));
    const rise = Array.from(root.querySelectorAll<SVGPathElement>('[data-rise-path]'));
    const head = root.querySelector<SVGPathElement>('[data-rise-head]');
    const link = Array.from(root.querySelectorAll<SVGPathElement>('[data-link]'));
    const stage = root.querySelector<HTMLElement>('[data-pipeline-stage]');
    const viewport = root.querySelector<HTMLElement>('[data-pipeline-viewport]');
    if (!pipes.length || !stage || !viewport) return;

    // where along the pipe each station sits (first sample whose x passes the station's centre)
    const ref = pipes[0];
    const total = ref.getTotalLength();
    const XS = [150, 410, 680, 950, 1205];
    // the pipe's x never decreases along its length, so a binary search (≈ 12 probes per station) finds each one
    const at = XS.map((x) => {
      let lo = 0, hi = total;
      for (let k = 0; k < 12; k++) { const mid = (lo + hi) / 2; if (ref.getPointAtLength(mid).x >= x - 2) hi = mid; else lo = mid; }
      return hi / total;
    });
    const PIPE_END = .78;                      // the pipe owns 0 → .78 of the scrub, the decision the rest
    const th = [...at.map((f) => Math.min(PIPE_END, f * PIPE_END) + .01), .86];

    root.classList.add('is-armed');
    gsap.set(pipes, { drawSVG: '0%' });
    gsap.set(rise, { drawSVG: '0%' });
    if (head) gsap.set(head, { opacity: 0 });
    gsap.set(link, { opacity: 0 });
    gsap.set(labels, { scale: 0, transformOrigin: '50% 50%' });

    if (mob) root.classList.add('is-panning');
    const pan = () => Math.max(0, stage.scrollWidth - viewport.clientWidth);
    const lit = stations.map(() => false);
    let flowing = false;
    const apply = (p: number) => {
      stations.forEach((s, i) => { const on = p >= th[i]; if (on !== lit[i]) { lit[i] = on; s.classList.toggle('is-lit', on); } });
      const f = p >= .985;
      if (f !== flowing) { flowing = f; root.classList.toggle('is-flowing', f); }
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (mob ? 2.2 : 2.5))}`,
        pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
        onUpdate: (self) => apply(self.progress),
      },
    });
    tl.to(pipes, { drawSVG: '100%', duration: PIPE_END }, 0);
    if (mob) tl.fromTo(stage, { x: 0 }, { x: () => -pan(), duration: 1 }, 0);
    labels.forEach((l, i) => tl.to(l, { scale: 1, duration: .05, ease: 'back.out(2.4)' }, th[i]));
    tl.to(link, { opacity: 1, duration: .05 }, .8);
    tl.to(rise, { drawSVG: '100%', duration: .1, ease: 'power1.inOut' }, .88);
    if (head) tl.to(head, { opacity: 1, duration: .02 }, .97);
    tl.to({}, { duration: .03 }, .97);
    if (flow) tl.set(flow, { opacity: 0 }, 0);
    apply((tl.scrollTrigger as ScrollTrigger | undefined)?.progress ?? 0);

    return () => {
      root.classList.remove('is-armed', 'is-flowing', 'is-panning');
      stations.forEach((s) => s.classList.remove('is-lit'));
      gsap.set([...pipes, ...rise], { clearProps: 'strokeDasharray,strokeDashoffset' });
      gsap.set([...labels, ...link, stage, ...(head ? [head] : []), ...(flow ? [flow] : [])], { clearProps: 'all' });
    };
  });
}

/* ── Pillar hub (00.2): assembles, then tracks the rail ───────────────────────────────── */

function initHub(ctx: MotionContext): void {
  const hub = document.querySelector<SVGSVGElement>('[data-hub]');
  const rail = document.querySelector<HTMLElement>('[data-whatwedo] [data-rail]');
  if (!hub || !rail) return;
  const nodes = Array.from(hub.querySelectorAll<SVGGElement>('[data-hub-node]'));
  const spokes = Array.from(hub.querySelectorAll<SVGLineElement>('[data-hub-spoke]'));
  const track = rail.querySelector<HTMLElement>('[data-rail-track]');
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const { gsap, ScrollTrigger: ST } = ctx;
    const tl = gsap.timeline({ scrollTrigger: { trigger: hub, start: 'top 85%', once: true } });
    spokes.forEach((s, i) => tl.fromTo(s, { drawSVG: '0%' }, { drawSVG: '100%', duration: .5, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' }, .25 + i * .07));
    nodes.forEach((n, i) => {
      const a = (-90 + i * 60) * Math.PI / 180;
      tl.from(n, { x: Math.cos(a) * 420, y: Math.sin(a) * 420, rotation: (i % 2 ? 1 : -1) * 90, opacity: 0, duration: .9, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, i * .07);
    });

    // light the node of the card in view
    let cur = -2;
    const show = (i: number) => { if (i === cur) return; cur = i; nodes.forEach((n, k) => n.classList.toggle('is-on', k === i)); };
    const items = track ? Array.from(track.children) as HTMLElement[] : [];
    const fromPin = () => {
      const st = ST.getAll().find((s) => s.pin === rail);
      if (st && st.isActive) show(Math.min(5, Math.max(-1, Math.round(st.progress * (items.length - 1)) - 1)));
      else if (st) show(-1);
    };
    const fromNative = () => {
      if (!track || rail.classList.contains('is-pinned')) return;
      const left = track.getBoundingClientRect().left + 40;
      let best = -1;
      items.forEach((it, k) => { const r = it.getBoundingClientRect(); if (r.left <= left && r.right > left) best = k - 1; });
      show(Math.min(5, best));
    };
    gsap.ticker.add(fromPin);
    track?.addEventListener('scroll', fromNative, { passive: true });
    return () => { gsap.ticker.remove(fromPin); track?.removeEventListener('scroll', fromNative); nodes.forEach((n) => n.classList.remove('is-on')); };
  });
}

/* ── Route map (00.2) ─────────────────────────────────────────────────────────────────── */

function initRouteMap(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-route-map]');
  if (!root) return;
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const { gsap } = ctx;
    const arcs = Array.from(root.querySelectorAll<SVGPathElement>('[data-route-arc]'));
    const nodes = Array.from(root.querySelectorAll<SVGGElement>('[data-route-node]'));
    const frost = root.querySelector<SVGGElement>('[data-route-frost]');
    gsap.set(arcs, { drawSVG: '0%' });
    gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
    if (frost) gsap.set(frost, { scale: 0, transformOrigin: '0% 50%' });
    // scrubbed while the map is in play, then locked drawn once the reader has passed it (v2 QA: the place labels must
    // not fade back out on scroll-up, which left them mid-fade and below AA contrast)
    const tl: ReturnType<typeof gsap.timeline> = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 55%', scrub: .7,
      onLeave: (self) => { self.kill(); tl.progress(1); } } });
    tl.to(nodes[0], { scale: 1, opacity: 1, duration: .3, ease: 'back.out(2)' }, 0);
    arcs.forEach((a, i) => {
      tl.to(a, { drawSVG: '100%', duration: 1, ease: 'power1.inOut' }, .2 + i);
      if (nodes[i + 1]) tl.to(nodes[i + 1], { scale: 1, opacity: 1, duration: .3, ease: 'back.out(2)' }, 1.05 + i);
      if (i === 1 && frost) tl.to(frost, { scale: 1, duration: .4, ease: 'back.out(2.2)' }, 2.2);
    });
    return () => { gsap.set([...arcs], { clearProps: 'strokeDasharray,strokeDashoffset' }); gsap.set([...nodes, ...(frost ? [frost] : [])], { clearProps: 'all' }); };
  });
}

/* ── Lazy toys ────────────────────────────────────────────────────────────────────────── */

function initLazy(ctx: MotionContext): void {
  if (ctx.reduced) return;
  const box = document.querySelector<HTMLElement>('[data-gravity-tags]');
  if (box) {
    ctx.mm.add(MOTION, () => {
      let stop: (() => void) | null = null, dead = false;
      const off = ctx.whenNear(box, async () => {
        const m = await import('../bencho/gravity-tags');
        if (!dead) stop = m.default(box, () => ctx.paused);
      }, '200px');
      return () => { dead = true; off(); stop?.(); };
    });
  }
  const canvas = document.querySelector<HTMLCanvasElement>('[data-emulsion]');
  const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (canvas && !save) {
    ctx.mm.add(`${MOTION} and (min-width: 768px)`, () => {
      let stop: (() => void) | null = null, dead = false;
      const off = ctx.whenNear(canvas.parentElement ?? canvas, async () => {   // the canvas itself is display:none until live
        if (!('WebGL2RenderingContext' in window)) return;
        const m = await import('./home-emulsion');
        if (!dead) stop = m.default(canvas, () => ctx.paused, ctx.onPause);
      }, '300px');
      return () => { dead = true; off(); stop?.(); };
    });
  }
  const h1 = document.querySelector<HTMLElement>('[data-magnetic-letters]');
  if (h1 && ctx.fine) {
    ctx.mm.add(`${MOTION} and (min-width: 1024px) and (hover: hover) and (pointer: fine)`, () => {
      let stop: (() => void) | null = null, dead = false;
      const run = async () => { if (dead) return; const m = await import('../bencho/magnetic-letters'); if (!dead) stop = m.default(h1, ctx.gsap, () => ctx.paused); };
      const go = () => {
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
        if (w.requestIdleCallback) w.requestIdleCallback(() => { void run(); }, { timeout: 2500 }); else window.setTimeout(() => { void run(); }, 1200);
      };
      if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
      return () => { dead = true; window.removeEventListener('load', go); stop?.(); };
    });
  }
}

/* ── Page entry ───────────────────────────────────────────────────────────────────────── */

export default function home(ctx: MotionContext): void {
  // Hero bloom + elastic network, desktop and mobile; the dock only at ≥ 1024px.
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const past = loadedPastHero();
    const hero = initHero(ctx, past);
    if (!hero) return;
    let undock: (() => void) | null = null;
    const desk = ctx.gsap.matchMedia();
    desk.add('(min-width: 1024px)', () => {
      undock = initDock(ctx, hero.control);
      return () => { undock?.(); undock = null; };
    });
    return () => { desk.revert(); hero.cleanup(); };
  });

  initProof(ctx);
  initPipeline(ctx);
  initHub(ctx);
  initMethodLine(document.querySelector('[data-method-fold]'), ctx);
  initRouteMap(ctx);
  initLazy(ctx);
}
