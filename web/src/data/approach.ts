/** Approach (DESIGN-SPEC 4.7; brief 6.4). */
import type { EngagementModel, MethodStep, Principle } from './types';
import { founderName } from './founder';

export const approach = {
  overline: 'Approach',
  headline: 'We create with you, not for you.', swooshPhrase: 'with you',
  intro: 'The best answers come from people who know the plant, the product and the market. Our role is to connect that knowledge, add 25 years of global experience, and help your teams create something that lasts.',
};
/*
 * v3 (10 Nov 2026): the What we do / What you get / Typical duration cells were null (CONFIRM 10) and are now DRAFTED
 * for Ganeaysh's approval (../CONTENT-DRAFTED-FOR-APPROVAL.md). Every cell restates the brief: the method steps (6.1),
 * the principles and the five engagement models (6.4), and the pillar deliverables (6.2). Durations repeat the models
 * table word for word (Diagnostic 2 to 5 days on site / report within two weeks; Project 4 to 16 weeks, fixed scope;
 * Workshops half a day to two days; Advisory retainer a set number of days each month). No new numbers.
 */
export const steps: MethodStep[] = [
  {
    n: 1, name: 'Connect',
    copy: 'We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose.',
    whatWeDo: 'Plant observation, conversations with your teams and a review of your data, before any recommendation.',
    whatYouGet: 'A written diagnosis with the evidence behind it, such as an audit report or gap analysis, and a proposed scope for the next step.',
    duration: 'Typically 2 to 5 days on site, with the report within two weeks.',
  },
  {
    n: 2, name: 'Collaborate',
    copy: 'We design the answer with your teams, not around them, so the people who will run it own it.',
    whatWeDo: 'Working sessions, trials and design reviews with your teams, from the plant floor to the boardroom.',
    whatYouGet: 'An answer your team helped design and owns, such as a process design basis, a formulation plan or a business plan.',
    duration: 'Typically 4 to 16 weeks, as a project with a fixed scope.',
  },
  {
    n: 3, name: 'Create',
    copy: 'We build, test and scale the solution, then hand it over with the measures to prove it works.',
    whatWeDo: 'Scale-up, commissioning and launch support, training for the people who will run the solution, and a structured handover.',
    whatYouGet: 'A solution in operation, a team that can run it without us, and agreed measures that show the result.',
    duration: 'Typically half a day to two days of training, then a set number of days each month if you want ongoing support.',
  },
];
export const stepLabels = { whatWeDo: 'What we do', whatYouGet: 'What you get', duration: 'Typical duration', step: 'Step' };
/** v3: h2 over the three Connect / Collaborate / Create columns (the column names carry the tagline itself). */
export const stepsHeading = 'How we work';   // COMPOSED (same wording as the home "How we work" link)

export const principlesHeading = 'Principles';
export const principles: Principle[] = [
  { name: 'Plant floor to boardroom', copy: 'We are as comfortable in a control room as in a board meeting, and we connect the two.' },
  { name: 'Your team owns the result', copy: 'We build capability as we go, so you do not depend on us afterwards.' },
  { name: 'Global playbook, local execution', copy: 'Lessons from Asia, Europe and the Americas, adapted to your market, your raw materials and your people.' },
  { name: 'Evidence before opinion', copy: 'Data, trials and plant observation first; recommendations second.' },
  { name: 'Confidential by default', copy: 'Your formulations, processes and plans stay yours. We sign NDAs as standard.' },
];

export const modelsHeading = 'Ways to work with us';
export const modelColumns = { model: 'Model', shape: 'Typical shape', goodFor: 'Good for' };
export const models: EngagementModel[] = [   // CONFIRM 10
  { model: 'Diagnostic or audit', shape: '2 to 5 days on site, report within two weeks', goodFor: 'Plant audits, customer pre-approval readiness, contaminant risk reviews' },
  { model: 'Project', shape: 'Fixed scope, 4 to 16 weeks', goodFor: 'New products or processes, feasibility studies, business plans, due diligence' },
  { model: 'Advisory retainer', shape: 'A set number of days each month', goodFor: 'Ongoing technical and strategic counsel, R&D steering, board advisory' },
  { model: 'Interim leadership', shape: 'Part-time or full-time for a defined period', goodFor: 'Covering a technical director or R&D lead role' },
  { model: 'Workshops and training', shape: 'Half a day to two days', goodFor: 'Oils and fats academies, innovation sprints, technology transfer' },
];

/**
 * v3 FAQ (REDESIGN-V3 §4 Approach, §8.8). Answers restate only facts already in the data: NDAs (principles[4]),
 * on-site days (models[0]), the method (steps[0].copy), languages (founder.ts longBio, verbatim), base and countries
 * (founder bio / site.base), and the one fee line §8.8 allows. DRAFTED for Ganeaysh's approval on 10 Nov 2026
 * (../CONTENT-DRAFTED-FOR-APPROVAL.md); the staging C-22 tags are retired. `confirm` stays in the type for any answer that
 * later needs a staging-only <Confirm id="C-22"> again.
 */
const firstName = founderName.split(' ')[0];
export const faqHeading = 'Frequently asked questions';   // COMPOSED
export const faq: { q: string; a: string; confirm?: string }[] = [
  { q: 'Do you sign an NDA?', a: `Yes. ${principles[4].copy} We are happy to sign yours before the first detailed conversation.` },
  { q: 'How are fees agreed?', a: 'We agree the scope and fee with you before any work starts.' },
  {
    q: 'Do you work on site or remotely?',
    a: 'Both, depending on the work. We start where the problem lives: on your plant floor, in your lab, with your customers. A diagnostic or audit typically means 2 to 5 days on site, with the report within two weeks. For longer engagements, the balance of site visits and remote work is agreed with you in the scope.',
  },
  { q: 'Which languages do you work in?', a: `${firstName} works in English, Hindi and Marathi, with conversational Bahasa Indonesia and basic Russian.` },
  {
    q: 'Where are you based, and do you travel?',
    a: `We are based in the Netherlands and work with clients worldwide. ${firstName}’s career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands. Travel for on-site work is agreed with you as part of the scope.`,
  },
];

/**
 * v4 Delft: "From the lab, to the plant, to the market." Three photo cards, wording verbatim from the client's homepage
 * design (KoKreaters_Homepage_Design.html, 20 Nov 2026). Each card links to the expertise it describes (COMPOSED link).
 */
export const lanes = {
  overline: 'Our approach',
  headline: 'From the lab, to the plant, to the market.',
  items: [
    { n: 1, label: 'Develop', title: 'Concept, formulation and pilot trials', photo: 'develop-pipette', pillar: 'innovation' },
    { n: 2, label: 'Scale', title: 'Process design, scale-up and plant performance', photo: 'scale-tanks', pillar: 'process' },
    { n: 3, label: 'Access', title: 'Regulatory, supply chain and market entry', photo: 'access-ship', pillar: 'strategy' },
  ],
} as const;
