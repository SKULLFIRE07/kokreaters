import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

/** Shared state handed to every motion module and page module (DESIGN-SPEC 6.2). */
export interface MotionContext {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
  mm: gsap.MatchMedia;
  lenis: Lenis | null;
  /** true under prefers-reduced-motion, when the 3 s failure timer fired, or when boot failed */
  reduced: boolean;
  page: string;
  isDesktop: boolean;
}
