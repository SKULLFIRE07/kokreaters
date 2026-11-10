/**
 * Home display-string typography. `keepCompounds` glues hyphenated compounds ("Go/No-Go", "pre-approval")
 * with a WORD JOINER (U+2060) after the hyphen, so short display lines (expertise promises, "In preparation"
 * titles) never break as "Go/No-" / "Go". U+2060 is default-ignorable: it renders as
 * nothing in every font and screen readers skip it. (U+2011, the non-breaking hyphen, is not in the Inter or Source
 * Serif 4 subsets and would fall back to another face.) Use it on short display strings only, never on body copy.
 */
export const keepCompounds = (s: string): string => s.replace(/(\p{L})-(?=\p{L})/gu, '$1-\u2060');
