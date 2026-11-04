/**
 * ticket.ts (DESIGN-SPEC v2 9): enhances Ticket.astro. Port of the Bencho "ticket" block to vanilla TS + GSAP.
 *
 * MIT License · Copyright (c) 2026 Lorenzo Cabra (bencho.dev). Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, subject to the following condition: the above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 *
 * Pointer: drag the stub; it resists (rubber band) until it is pulled 70px away, then it rips off and the link fires.
 * Keyboard / click on the link: the same rip (0.6 s), then navigate. Booking target = the form on this page: the
 * stub flies back after contact.ts has focused the form. `onTear` lets contact.ts run its own form-focus logic.
 */
import type { MotionContext } from '../motion/context';

const RIP_PX = 70;

export default function initTicket(root: HTMLElement, ctx: MotionContext): () => void {
  const stub = root.querySelector<HTMLElement>('[data-ticket-stub]');
  const link = root.querySelector<HTMLAnchorElement>('[data-ticket-link]');
  if (!stub || !link) return () => {};
  const { gsap } = ctx;
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const formMode = root.dataset.bookingMode === 'form';
  let torn = false;

  function rip(then: () => void) {
    if (torn) return;
    torn = true;
    root.classList.add('is-torn');
    gsap.killTweensOf(stub!);
    gsap.timeline({ onComplete: then })
      .to(stub!, { rotation: 14, x: '+=10', duration: 0.12, ease: 'power2.out', transformOrigin: '0% 0%' })
      .to(stub!, { x: '+=60', y: 160, rotation: 38, opacity: 0, duration: 0.48, ease: 'power2.in' });
  }
  function restore() {
    gsap.fromTo(stub!, { x: 80, y: -40, rotation: 20, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)', delay: 0.6,
      onComplete: () => { torn = false; root.classList.remove('is-torn'); gsap.set(stub!, { clearProps: 'transform,opacity' }); } });
  }
  function go() {
    if (formMode) { link!.dataset.ticketPass = '1'; link!.click(); restore(); return; }
    window.location.href = link!.href;
  }

  // the link: tear first, then go (in form mode contact.ts's own click handler does the focusing)
  link.addEventListener('click', (e) => {
    if (link.dataset.ticketPass === '1') { delete link.dataset.ticketPass; return; }
    if (ctx.reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    rip(go);
  }, { capture: true, signal: ac.signal });

  // the stub: rubber-band drag; past RIP_PX it tears
  let sx = 0, sy = 0, dragging = false, moved = false, pid = -1;
  stub.addEventListener('pointerdown', (e) => {
    if (torn || ctx.reduced) return;
    if ((e.target as Element).closest('a') && e.pointerType !== 'mouse') return;
    dragging = true; moved = false; pid = e.pointerId; sx = e.clientX; sy = e.clientY;
    gsap.killTweensOf(stub);
  }, sig);
  window.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    const dist = Math.hypot(dx, dy);
    if (dist > 4 && !moved) { moved = true; try { stub.setPointerCapture(pid); } catch { /* ignore */ } }
    if (!moved) return;
    const k = 1 / (1 + dist / 90);                    // resistance
    gsap.set(stub, { x: dx * k, y: dy * k, rotation: Math.max(-6, Math.min(18, dx * k * 0.22)), transformOrigin: '0% 0%' });
    if (dist > RIP_PX * 1.6) { dragging = false; rip(go); }
  }, sig);
  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (!torn) gsap.to(stub, { x: 0, y: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  };
  window.addEventListener('pointerup', end, sig);
  window.addEventListener('pointercancel', end, sig);
  // a drag that moved must not also click the link
  stub.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, { capture: true, signal: ac.signal });

  return () => ac.abort();
}
