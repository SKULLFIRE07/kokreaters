/**
 * The founder's lines (lead decision 8 / bug 5), exact and in this order everywhere PEOPLE-CONTENT renders them, read
 * from src/data/career.ts `founderTitles` (CHROME-HOME):
 *   roleLine    "Founder and Principal, KoKreaters"                          (main title)
 *   formerLine  "Former Global Product & Process Design Director, Cargill"  (second line)
 *   flourish    "Chief Catalyst"   (small italic flourish: only the home founder block and About)
 * The "Cargill" line belongs only in the founder line (home, articles, contact) and on About.
 */
import { founderTitles } from '@/data/career';

export const founderName: string = founderTitles.name;
export const roleLine: string = founderTitles.main;
export const roleOnly: string = roleLine.replace(/,\s*KoKreaters$/, '');
export const formerLine: string = founderTitles.former;
export const flourish: string = founderTitles.flourish;
/** "Ganeaysh Kulkarni · Founder and Principal, KoKreaters · Former Global Product & Process Design Director, Cargill". */
export const authorLine: string = [founderName, roleLine, formerLine].join(' · ');
