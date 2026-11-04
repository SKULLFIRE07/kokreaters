/**
 * The annotation kit's motion (DESIGN-SPEC v2 6.4, 8.3 R3/R4). Markup ships drawn; notes.css hides kit pieces only
 * while html.motion is set; this module draws them on when their trigger enters, then marks them `.is-drawn`
 * (the CSS gate releases for good, inline styles are cleared).
 *  R3: per trigger group, in data-note-order: arrow shafts draw (stroke-dashoffset 1→0, 0.7 s power2.inOut), heads at
 *      85 %, then the note text settles (rotate −8°→0, scale .9→1, 0.45 s back.out(2)); scribbles wipe (0.6 s; a conic
 *      sweep for circle/box); doodles and Venns draw; group stagger 0.18 s; once at NOTE_START (+ data-note-delay).
 *  R4: [data-sticker] drop in from above (or the side), rotation ±14°, scale 1.18 → set, 0.7 s back.out(1.7),
 *      siblings stagger 0.09 s.
 *  Stamps: [data-stamp-spin] spin (CSS) only while on screen and not paused.
 */
import type { MotionContext } from './context';
import { D, E, NOTE_START, START } from './tokens';
import { onScreen } from './lazy';

type El = HTMLElement | SVGElement;
const KIT = '[data-note], [data-scribble]:not([data-scribble="manual"]), [data-doodle], [data-venn]';

function triggerOf(el: Element): Element {
  const sel = (el as HTMLElement).dataset?.noteTrigger;
  if (sel) { try { const t = document.querySelector(sel); if (t) return t; } catch { /* bad selector */ } }
  return el.closest('.has-notes') ?? el.closest('section') ?? el;
}

function done(el: Element) {
  el.classList.add('is-drawn');
  (el as El).style.removeProperty('opacity');
  el.querySelectorAll<El>('[data-note-draw], .note__text, .scribble__svg').forEach((p) => {
    p.style.removeProperty('stroke-dashoffset'); p.style.removeProperty('opacity'); p.style.removeProperty('transform');
    p.style.removeProperty('clip-path'); p.style.removeProperty('mask'); p.style.removeProperty('-webkit-mask');
  });
}

function addDraw(tl: gsap.core.Timeline, root: Element, at: number): number {
  const shafts = Array.from(root.querySelectorAll<SVGPathElement>('[data-note-draw]:not([data-note-head])'));
  const heads = Array.from(root.querySelectorAll<SVGPathElement>('[data-note-head]'));
  const isVenn = root.hasAttribute('data-venn');
  const step = isVenn ? .28 : 0;
  shafts.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: D.draw, ease: E.draw }, at + i * step));
  const shaftEnd = at + (shafts.length ? D.draw * .85 + (shafts.length - 1) * step : 0);
  if (heads.length) tl.fromTo(heads, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: D.head, ease: 'power1.out' }, shaftEnd);
  if (isVenn) {
    const labels = root.querySelectorAll<HTMLElement>('.venn__label, .venn__centre');
    tl.fromTo(labels, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: D.note, ease: E.note, stagger: .12 }, at + step * 2 + .2);
  }
  return shafts.length ? at + D.draw + (shafts.length - 1) * step : at;
}

function addNote(tl: gsap.core.Timeline, note: HTMLElement, at: number) {
  const text = note.querySelector<HTMLElement>('.note__text');
  tl.set(note, { opacity: 1 }, at);
  if (text) tl.set(text, { opacity: 0 }, at);
  const end = addDraw(tl, note, at);
  if (text) tl.fromTo(text, { opacity: 0, rotate: -8, scale: .9 }, { opacity: 1, rotate: 0, scale: 1, duration: D.note, ease: E.note, transformOrigin: '0% 60%' }, Math.max(at, end - .2));
}

function addScribble(tl: gsap.core.Timeline, s: HTMLElement, at: number) {
  const kind = s.dataset.scribble;
  if (kind === 'highlight') {
    const txt = s.querySelector<HTMLElement>('.scribble__txt');
    if (txt) tl.fromTo(txt, { backgroundSize: '0% 86%' }, { backgroundSize: '100% 86%', duration: .6, ease: E.rise, clearProps: 'backgroundSize' }, at);
    return;
  }
  const svg = s.querySelector<SVGElement>('.scribble__svg');
  if (!svg) return;
  if (kind === 'circle' || kind === 'box') {
    const st = { a: 0 };
    tl.to(st, {
      a: 360, duration: .6, ease: E.draw,
      onUpdate: () => { const m = `conic-gradient(from -90deg, #000 ${st.a}deg, transparent ${st.a}deg)`; svg.style.setProperty('-webkit-mask', m); svg.style.setProperty('mask', m); },
    }, at);
  } else {
    tl.fromTo(svg, { clipPath: 'inset(-60% 101% -60% 0%)' }, { clipPath: 'inset(-60% -4% -60% -4%)', duration: .6, ease: kind === 'highlight' ? E.rise : E.draw }, at);
  }
}

function initKit(ctx: MotionContext): void {
  const { gsap, ScrollTrigger } = ctx;
  const groups = new Map<Element, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>(KIT).forEach((el) => {
    if (el.parentElement?.closest('[data-note]')) return;         // a doodle inside a note is drawn with it
    if (getComputedStyle(el).display === 'none') { done(el); return; }   // show-gated off at this width: final state
    const t = triggerOf(el);
    const list = groups.get(t) ?? []; list.push(el); groups.set(t, list);
  });
  groups.forEach((els, trigger) => {
    els.sort((a, b) => (Number(a.dataset.noteOrder ?? 0) - Number(b.dataset.noteOrder ?? 0)));
    const start = (els.find((e) => e.dataset.noteStart)?.dataset.noteStart) ?? NOTE_START;
    const tl = gsap.timeline({ paused: true, onComplete: () => els.forEach(done) });
    els.forEach((el, i) => {
      const at = Math.min(i, 5) * .18 + (Number(el.dataset.noteDelay ?? 0) || 0);   // long groups never wait more than ~0.9 s
      if (el.hasAttribute('data-note')) addNote(tl, el, at);
      else if (el.hasAttribute('data-scribble')) addScribble(tl, el, at);
      else addDraw(tl, el, at);
    });
    ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tl.play() });
  });
}

function initStickers(ctx: MotionContext): void {
  const { gsap, ScrollTrigger } = ctx;
  const groups = new Map<Element, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-sticker]').forEach((el) => {
    if (el.closest('h1')) { el.classList.add('is-drawn'); return; }   // never animate the H1 (0.2.4)
    const key = el.parentElement ?? el;
    const list = groups.get(key) ?? []; list.push(el); groups.set(key, list);
  });
  groups.forEach((els, key) => {
    const tl = gsap.timeline({ paused: true, onComplete: () => els.forEach((e) => { e.classList.add('is-drawn'); gsap.set(e, { clearProps: 'transform,opacity,filter' }); }) });
    els.forEach((el, i) => {
      const from = el.dataset.stickerFrom ?? 'top';
      const sign = i % 2 ? -1 : 1;
      const x = from === 'left' ? -120 : from === 'right' ? 120 : 0;
      const y = from === 'top' ? -80 : 0;
      tl.fromTo(el, { opacity: 0, x, y, rotation: 14 * sign, scale: 1.18 },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: D.sticker, ease: E.sticker }, i * .09);
    });
    ScrollTrigger.create({ trigger: key, start: START, once: true, onEnter: () => tl.play() });
  });
}

function initStamps(ctx: MotionContext): void {
  document.querySelectorAll<HTMLElement>('[data-stamp-spin]').forEach((el) => {
    let visible = false;
    const sync = () => el.classList.toggle('is-playing', visible && !ctx.paused);
    onScreen(el, (v) => { visible = v; sync(); });
    ctx.onPause(sync);
  });
}

export function initNotes(ctx: MotionContext): void {
  initKit(ctx);
  initStickers(ctx);
  initStamps(ctx);
}

/** Failure path / reduced flip: everything drawn and placed now. */
export function drawAllNow(): void {
  document.querySelectorAll(`${KIT}, [data-sticker]`).forEach(done);
}
