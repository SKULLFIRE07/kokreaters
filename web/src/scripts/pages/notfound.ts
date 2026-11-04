/**
 * 404 reconnect (DESIGN-SPEC 5.12, 6.9).
 * - Hover/focus on "Take me home": the node slides home along its line (480 ms power2.inOut); leaving reverses.
 * - On the node: Enter/Space reconnects, then navigates to / after 600 ms. Arrow keys move it in
 *   8px steps; within 24px of its socket it snaps home and navigates.
 * - Pointer: GSAP Draggable (dynamic import, this page only) snaps home on release within 24px.
 * Under reduced motion every move is instant; the drag still works (user-initiated).
 */
import type { MotionContext } from '../motion/context';

const SNAP_PX = 24;
const STEP_PX = 8;

export default function initNotFound(ctx: MotionContext): () => void {
  const root = document.querySelector<HTMLElement>('[data-reconnect]');
  const node = root?.querySelector<SVGGElement>('[data-loose-node]');
  const line = root?.querySelector<SVGLineElement>('[data-loose-line]');
  const svg = root?.querySelector<SVGSVGElement>('svg');
  if (!root || !node || !line || !svg) return () => {};
  const { gsap } = ctx;
  const ac = new AbortController();
  const sig = { signal: ac.signal };

  const n = (k: string) => Number(root.dataset[k]);
  const DX = n('dx'), DY = n('dy'), HX = n('homeX'), HY = n('homeY');
  const VBW = n('vbW');
  const pos = { x: DX, y: DY };          // offset from the socket, in viewBox units
  let leaving = false;
  let drag: { kill(): void; update(): void } | null = null;

  const unitsPerPx = () => VBW / (svg.getBoundingClientRect().width || VBW);
  const distPx = () => Math.hypot(pos.x, pos.y) / unitsPerPx();

  function render() {
    node!.setAttribute('transform', `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`);
    line!.setAttribute('x2', String(HX + pos.x));
    line!.setAttribute('y2', String(HY + pos.y));
    root!.dataset.state = Math.hypot(pos.x, pos.y) < 0.5 ? 'home' : 'loose';
  }
  render();

  function moveTo(x: number, y: number, dur = 0.48) {
    gsap.killTweensOf(pos);
    if (ctx.reduced || dur === 0) { pos.x = x; pos.y = y; render(); return; }
    gsap.to(pos, { x, y, duration: dur, ease: 'power2.inOut', onUpdate: render });
  }
  function goHome() {
    if (leaving) return;
    leaving = true;
    moveTo(0, 0);
    window.setTimeout(() => { window.location.href = '/'; }, 600);
  }

  /* "Take me home": preview the reconnection */
  const take = document.querySelector<HTMLElement>('[data-take-home]');
  if (take) {
    const preview = () => { if (!leaving) moveTo(0, 0); };
    const undo = () => { if (!leaving && document.activeElement !== take && !take.matches(':hover')) moveTo(DX, DY); };
    take.addEventListener('pointerenter', preview, sig);
    take.addEventListener('focus', preview, sig);
    take.addEventListener('pointerleave', undo, sig);
    take.addEventListener('blur', undo, sig);
  }

  /* Keyboard on the node */
  node.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); goHome(); return; }
    const step = STEP_PX * unitsPerPx();
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    if (leaving) return;
    gsap.killTweensOf(pos);
    pos.x += m[0]; pos.y += m[1];
    render();
    if (distPx() <= SNAP_PX) goHome();
  }, sig);

  /* Pointer drag: Draggable, loaded only here */
  if (window.matchMedia('(pointer: fine), (pointer: coarse)').matches) {
    import('gsap/Draggable').then(({ Draggable }) => {
      if (ac.signal.aborted) return;
      gsap.registerPlugin(Draggable);
      // Drag a proxy so our own render() stays the single writer of the node's transform.
      const proxy = document.createElement('div');
      let sx = 0, sy = 0;
      const [d] = Draggable.create(proxy, {
        trigger: node,
        type: 'x,y',
        onPress() { gsap.killTweensOf(pos); sx = pos.x; sy = pos.y; gsap.set(proxy, { x: 0, y: 0 }); this.update(); },
        onDrag() { const u = unitsPerPx(); pos.x = sx + this.x * u; pos.y = sy + this.y * u; render(); },
        onRelease() { if (distPx() <= SNAP_PX) goHome(); },
      });
      drag = d;
    }).catch(() => {});
  }

  return () => { ac.abort(); gsap.killTweensOf(pos); drag?.kill(); };
}
