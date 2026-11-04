/** Approach (DESIGN-SPEC 4.7; brief 6.4). */
import type { EngagementModel, MethodStep, Principle } from './types';

export const approach = {
  overline: 'Approach',
  headline: 'We create with you, not for you.', swooshPhrase: 'with you',
  intro: 'The best answers come from people who know the plant, the product and the market. Our role is to connect that knowledge, add 25 years of global experience, and help your teams create something that lasts.',
};
export const steps: MethodStep[] = [
  { n: 1, name: 'Connect', copy: 'We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose.', whatWeDo: null, whatYouGet: null, duration: null },
  { n: 2, name: 'Collaborate', copy: 'We design the answer with your teams, not around them, so the people who will run it own it.', whatWeDo: null, whatYouGet: null, duration: null },
  { n: 3, name: 'Create', copy: 'We build, test and scale the solution, then hand it over with the measures to prove it works.', whatWeDo: null, whatYouGet: null, duration: null },
];   // null fields → CONFIRM 10 in staging; omitted in production
export const stepLabels = { whatWeDo: 'What we do', whatYouGet: 'What you get', duration: 'Typical duration', step: 'Step' };

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
  { model: 'Diagnostic or audit', shape: '2–5 days on site, report within two weeks', goodFor: 'Plant audits, customer pre-approval readiness, contaminant risk reviews' },
  { model: 'Project', shape: 'Fixed scope, 4–16 weeks', goodFor: 'New products or processes, feasibility studies, business plans, due diligence' },
  { model: 'Advisory retainer', shape: 'A set number of days each month', goodFor: 'Ongoing technical and strategic counsel, R&D steering, board advisory' },
  { model: 'Interim leadership', shape: 'Part-time or full-time for a defined period', goodFor: 'Covering a technical director or R&D lead role' },
  { model: 'Workshops and training', shape: 'Half a day to two days', goodFor: 'Oils and fats academies, innovation sprints, technology transfer' },
];
