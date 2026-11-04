/** v1 entry kept for imports: data-reveal="lines" is now an alias of R1 text-rise (scripts/bencho/text-rise.ts). */
import type { MotionContext } from './context';
import { initTextRise } from '../bencho/text-rise';
export function initSplits(ctx: MotionContext): void { initTextRise(ctx); }
