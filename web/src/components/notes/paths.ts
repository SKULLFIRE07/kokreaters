/**
 * The hand-drawn path library (DESIGN-SPEC v2 6.3). Every stroke is drawn with `pathLength="1"` so CSS and GSAP
 * can draw it with stroke-dasharray/offset. Each kind has 2–3 variants (slight overshoot, uneven curvature, open
 * ends); `pick(kind, seed)` chooses one, so two underlines on one page never look identical.
 * `d` = strokes (drawn in order), `head` = arrow heads (drawn last), `fill` = filled shapes (highlight).
 */
export type DoodleKind = 'arrow-curve' | 'arrow-loop' | 'arrow-straight' | 'arrow-bounce' | 'star' | 'spark' | 'tick'
  | 'asterisk' | 'bracket' | 'node' | 'squiggle' | 'heart-node';
export type ScribbleKind = 'underline' | 'double' | 'zigzag' | 'swoosh' | 'circle' | 'box' | 'highlight' | 'strike';
export type PathKind = DoodleKind | ScribbleKind;
export interface PathDef { vb: string; d?: string[]; head?: string[]; fill?: string[] }

export const PATHS: Record<PathKind, PathDef[]> = {
  underline: [
    { vb: '0 0 300 20', d: ['M3 13 C 60 8, 140 15, 200 10 S 280 9, 297 12'] },
    { vb: '0 0 300 20', d: ['M2 10 C 70 15, 150 6, 230 11 C 260 13, 285 10, 298 8'] },
    { vb: '0 0 300 20', d: ['M5 11 C 50 9, 110 13, 170 11 C 220 9, 262 14, 296 10'] },
  ],
  double: [
    { vb: '0 0 300 24', d: ['M4 9 C 90 5, 200 12, 296 7', 'M12 17 C 100 13, 210 19, 290 15'] },
    { vb: '0 0 300 24', d: ['M2 8 C 80 11, 190 4, 298 9', 'M20 18 C 110 15, 200 20, 284 14'] },
  ],
  zigzag: [
    { vb: '0 0 300 20', d: ['M2 12 L 22 6 L 40 14 L 60 6 L 80 14 L 100 6 L 120 14 L 140 6 L 160 14 L 180 6 L 200 14 L 220 6 L 240 14 L 260 6 L 280 14 L 298 8'] },
    { vb: '0 0 300 20', d: ['M3 10 L 26 5 L 47 13 L 70 5 L 92 14 L 116 6 L 138 13 L 161 5 L 183 14 L 207 6 L 229 13 L 252 5 L 275 13 L 297 7'] },
  ],
  swoosh: [
    { vb: '0 0 400 24', d: ['M2 18 C 120 21, 260 16, 384 6'], head: ['M372 2 L 386 6 L 376 16'] },   // the logo's rising arrow, hand-drawn
    { vb: '0 0 400 24', d: ['M3 16 C 100 22, 250 19, 382 7'], head: ['M369 3 L 384 7 L 373 17'] },
  ],
  circle: [
    { vb: '0 0 200 80', d: ['M150 8 C 196 12, 206 50, 164 70 C 122 84, 34 80, 8 60 C -10 42, 16 10, 80 7 C 124 4, 174 8, 192 26'] },
    { vb: '0 0 200 80', d: ['M40 12 C 90 2, 170 4, 192 30 C 206 52, 160 76, 100 76 C 40 76, 4 62, 6 40 C 8 22, 40 10, 90 8 C 120 7, 150 9, 166 14'] },
    { vb: '0 0 200 80', d: ['M120 6 C 170 6, 202 26, 194 48 C 186 70, 130 80, 80 76 C 30 72, 2 54, 8 34 C 14 16, 60 4, 110 6 C 140 7, 160 12, 172 20'] },
  ],
  box: [
    { vb: '0 0 200 80', d: ['M6 8 C 70 4, 140 6, 194 9 C 197 30, 196 52, 193 73 C 130 77, 60 76, 8 72 C 5 50, 4 28, 9 5'] },
    { vb: '0 0 200 80', d: ['M4 6 C 80 9, 150 5, 196 7 C 194 32, 198 54, 195 75 C 120 72, 60 78, 6 74 C 8 52, 3 30, 7 2'] },
  ],
  strike: [
    { vb: '0 0 300 20', d: ['M2 12 C 80 9, 200 13, 298 8'] },
    { vb: '0 0 300 20', d: ['M3 9 C 90 13, 190 7, 297 12'] },
  ],
  highlight: [
    { vb: '0 0 300 24', fill: ['M2 6 C 80 2, 200 4, 298 3 L 297 21 C 200 23, 90 19, 3 22 Z'] },
    { vb: '0 0 300 24', fill: ['M4 4 C 90 6, 210 2, 296 5 L 298 20 C 190 22, 100 18, 2 21 Z'] },
  ],
  'arrow-curve': [
    { vb: '0 0 120 80', d: ['M8 10 C 30 60, 70 72, 108 58'], head: ['M92 50 L 109 58 L 96 72'] },
    { vb: '0 0 120 80', d: ['M10 6 C 20 50, 60 74, 106 62'], head: ['M90 54 L 107 62 L 93 75'] },
  ],
  'arrow-loop': [
    { vb: '0 0 140 90', d: ['M6 20 C 40 6, 70 30, 56 46 C 44 60, 26 40, 46 30 C 74 18, 100 52, 130 70'], head: ['M114 68 L 131 71 L 124 55'] },
  ],
  'arrow-straight': [
    { vb: '0 0 120 30', d: ['M4 16 C 40 13, 80 18, 112 14'], head: ['M100 6 L 114 14 L 101 23'] },
    { vb: '0 0 120 30', d: ['M5 14 C 44 18, 84 12, 113 15'], head: ['M101 7 L 115 15 L 102 24'] },
  ],
  'arrow-bounce': [
    { vb: '0 0 120 80', d: ['M6 60 C 20 10, 40 10, 50 50 C 58 76, 76 20, 112 28'], head: ['M98 18 L 113 28 L 99 38'] },
  ],
  star: [{ vb: '0 0 60 60', d: ['M30 4 L 34 26 L 56 30 L 34 34 L 30 56 L 26 34 L 4 30 L 26 26 Z'] }],
  spark: [{ vb: '0 0 60 60', d: ['M30 6 V 20', 'M30 40 V 54', 'M6 30 H 20', 'M40 30 H 54', 'M13 13 L 22 22', 'M38 38 L 47 47'] }],
  tick: [{ vb: '0 0 50 40', d: ['M6 22 L 18 34 L 44 6'] }, { vb: '0 0 50 40', d: ['M5 20 C 10 25, 14 30, 18 34 C 26 22, 34 13, 45 5'] }],
  asterisk: [{ vb: '0 0 40 40', d: ['M20 4 V 36', 'M6 12 L 34 28', 'M34 12 L 6 28'] }],
  bracket: [{ vb: '0 0 20 80', d: ['M14 4 C 4 20, 4 60, 14 76'] }],
  node: [   // the logo's ringed node, sketched
    { vb: '0 0 60 60', d: ['M30 10 C 42 10, 50 20, 50 30 C 50 42, 40 50, 30 50 C 18 50, 10 40, 10 30 C 10 20, 20 9, 33 11', 'M30 24 C 34 24, 36 27, 36 30 C 36 34, 33 36, 30 36 C 26 36, 24 33, 24 30 C 24 27, 27 24, 31 25'] },
    { vb: '0 0 60 60', d: ['M28 9 C 41 8, 51 18, 51 30 C 51 43, 41 51, 29 51 C 17 51, 9 41, 9 30 C 9 19, 18 10, 32 10', 'M30 23 C 35 23, 37 27, 37 30 C 37 34, 34 37, 30 37 C 26 37, 23 34, 23 30 C 23 26, 26 23, 32 24'] },
  ],
  squiggle: [{ vb: '0 0 120 20', d: ['M2 10 C 12 2, 22 18, 32 10 S 52 2, 62 10 S 82 18, 92 10 S 112 2, 118 10'] }],
  'heart-node': [{ vb: '0 0 60 60', d: ['M30 50 C 10 38, 4 26, 10 16 C 16 6, 28 8, 30 18 C 32 8, 44 6, 50 16 C 56 26, 50 38, 30 50 Z', 'M30 26 C 33 26, 35 28, 35 31 C 35 34, 33 36, 30 36 C 27 36, 25 34, 25 31 C 25 28, 27 26, 31 27'] }],
};

/** Small deterministic string hash (FNV-1a). */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/** One variant of a kind. `seed` may be a number or any string (hashed). */
export function pick(kind: PathKind, seed: number | string = 0): PathDef {
  const list = PATHS[kind];
  const n = typeof seed === 'string' ? hash(seed) : Math.abs(Math.trunc(seed));
  return list[n % list.length];
}

/** viewBox → [w, h]. */
export const vbSize = (vb: string): [number, number] => { const p = vb.split(/\s+/).map(Number); return [p[2], p[3]]; };

export type Tone = 'auto' | 'orchid' | 'berry' | 'saffron' | 'white' | 'ink' | 'imperial' | 'sapphire' | 'butter';
export type Show = 'all' | 'md' | 'lg' | 'pointer' | 'touch';
/** CSS colour for a tone; `auto` = the ground's --note. */
export const toneColor = (t: Tone = 'auto'): string => (t === 'auto' ? 'var(--note)' : `var(--kk-${t})`);

/** Deterministic per-build id counter for kit elements that need unique ids (Stamp textPath, SpecLabel). */
let idN = 0;
export const nextId = (): string => (idN++).toString(36);
