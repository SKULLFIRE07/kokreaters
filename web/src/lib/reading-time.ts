/** Reading time at 220 words per minute, rounded up (DESIGN-SPEC 4.12). */
export const WORDS_PER_MINUTE = 220;

/** Strip frontmatter, MDX import/export lines, JSX tags and Markdown syntax, then count words. */
export function countWords(body: string | undefined | null): number {
  if (!body) return 0;
  const text = body
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/^\s*(import|export)\s.*$/gm, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`|>\-]+/g, ' ');
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,-]*/gu);
  return words ? words.length : 0;
}

export function readingTime(body: string | undefined | null): number {
  const words = countWords(body);
  return words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
