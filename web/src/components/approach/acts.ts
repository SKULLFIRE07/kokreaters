/**
 * The three-act diagram states for /approach F2 (DESIGN-SPEC v2 00.2): Connect = six scattered nodes, Collaborate =
 * the nodes linked into one network, Create = the network collapsed onto one rising arrow. Shared by the server
 * render (static mini diagrams) and scripts/pages/approach.ts (the scrubbed morph). viewBox 0 0 600 600.
 * The six node colours are the six pillar colours (the pillar network, not the logo mark).
 */
export type Pt = [number, number];
export const NODE_COLOURS = ['var(--kk-sapphire)', 'var(--kk-violet)', 'var(--kk-orchid)', 'var(--kk-saffron)', 'var(--kk-mauve)', 'var(--kk-sky)'];
export const ACT1: Pt[] = [[92, 118], [468, 74], [540, 318], [330, 530], [66, 430], [262, 268]];
const ring = (i: number): Pt => { const a = (-90 + i * 72) * Math.PI / 180; return [300 + 190 * Math.cos(a), 300 + 190 * Math.sin(a)]; };
export const ACT2: Pt[] = [ring(0), ring(1), ring(2), ring(3), ring(4), [300, 300]];
/** the rising arrow: a hand-ish zigzag from bottom-left to top-right; nodes sit on its vertices */
export const ARROW: Pt[] = [[70, 520], [190, 400], [270, 450], [380, 300], [450, 340], [540, 110]];
export const ACT3: Pt[] = ARROW;
/** the network's links (node index pairs): centre spokes + the ring */
export const LINKS: [number, number][] = [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
export const ARROW_PATH: Pt[] = [...ARROW, [588, 44]];
export const arrowD = (pts: Pt[] = ARROW_PATH): string => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
export const HEAD = 'M548 46 L588 44 L582 86';
export const STATES = [ACT1, ACT2, ACT3];
