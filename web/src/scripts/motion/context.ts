import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

/** Shared state handed to every motion module and page module (DESIGN-SPEC 6.2, v2 8.2). */
export interface MotionContext {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
  mm: gsap.MatchMedia;
  lenis: Lenis | null;
  /** true under prefers-reduced-motion, when the 3 s failure timer fired, or when boot failed */
  reduced: boolean;
  page: string;
  isDesktop: boolean;
  /** (hover:hover) and (pointer:fine): pointer toys, magnets, cursor */
  fine: boolean;
  /** html.motion-paused (the Pause motion control) or a hidden tab */
  readonly paused: boolean;
  /** Register a loop's pause handler (called with true on pause, false on play). Returns a disposer. */
  onPause(cb: (paused: boolean) => void): () => void;
  /** IntersectionObserver → run `load` once when `el` comes within `margin` of the viewport. Returns a disposer. */
  whenNear(el: Element, load: () => Promise<unknown> | unknown, margin?: string): () => void;
}
