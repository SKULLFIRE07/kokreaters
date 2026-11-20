/**
 * The founder's lines (brief item 19), read from src/data/founder.ts (CHROME-HOME) defensively, so About, Contact and
 * the article author box are right whichever state founder.ts is in:
 *   roleLine    "Founder and Principal, KoKreaters" (founderRole, with the company added when it is not there; the v3
 *               "Chief Catalyst and Founder" is mapped to the item 19 wording until founder.ts lands it)
 *   formerLine  "Former Global Product & Process Design Director, Cargill" (founderFormer, else the brief's line)
 *   flourish    "Chief Catalyst" (founderFlourish, else the brief's flourish)
 * Item 8: the "Cargill" line belongs only in the founder line (home, articles) and on About.
 */
import * as founder from '@/data/founder';
import { site } from '@/config/site';

const f = founder as unknown as Record<string, unknown>;
const str = (v: unknown, fallback: string): string => (typeof v === 'string' && v.trim() ? v : fallback);

const V3_ROLE = 'Chief Catalyst and Founder';
const role = str(f.founderRole, 'Founder and Principal');

export const founderName: string = founder.founderName;
export const roleOnly: string = role === V3_ROLE ? 'Founder and Principal' : role.replace(new RegExp(`,\\s*${site.name}$`), '');
export const roleLine: string = `${roleOnly}, ${site.name}`;
export const formerLine: string = str(f.founderFormer, 'Former Global Product & Process Design Director, Cargill');
export const flourish: string = str(f.founderFlourish, 'Chief Catalyst');
/** "Ganeaysh Kulkarni · Founder and Principal, KoKreaters · Former Global Product & Process Design Director, Cargill" (item 35). */
export const authorLine: string = [founderName, roleLine, formerLine].join(' · ');
