/**
 * "Ask KoKreaters" chat widget copy (src/components/chrome/ChatWidget.astro, src/scripts/chat.ts). Plain UI labels,
 * all COMPOSED (10 Nov 2026) except `handoff`, which is the owner's wording. Facts the bot gives come only from the
 * generated knowledge base (scripts/build-knowledge.mjs → api/_lib/knowledge.js); nothing here promises more than the
 * site data does (reply time stays microcopy.formSuccess, shown only after a real send).
 */
export const chat = {
  launcher: 'Ask KoKreaters',
  title: 'Ask KoKreaters',
  subtitle: 'Our expertise, industries and approach',
  close: 'Close',
  greeting: 'How can we help?',
  welcome: 'Ask about our expertise, the industries we work with, how an engagement works or our founder, Ganeaysh Kulkarni.',
  suggestedLabel: 'Suggested questions',
  suggestions: ['What does KoKreaters do?', 'Which industries do you work with?', 'How does an engagement start?'],
  inputLabel: 'Your question',
  placeholder: 'Ask a question',
  send: 'Send question',
  disclaimer: 'Answers are written by AI from this website’s content.',
  share: 'Share your details',
  you: 'You',
  bot: 'KoKreaters',
  writing: 'KoKreaters is writing',
  /** Appended after the 5th answer (owner's wording), then the inline form opens. */
  handoff: 'For more detail, the best next step is a direct conversation. Please share your details and Ganeaysh will reply by email.',
  /** V6 brief Table 10: "We typically reply within two working days." */
  formIntro: 'We typically reply within two working days. Your questions from this chat are included.',
  /** Phone launcher label (brief item 1: icon + "Ask"); the full `launcher` stays the accessible name. */
  launcherShort: 'Ask',
  unavailable: 'The assistant is not available just now. Please share your details and Ganeaysh will reply by email.',
  busy: 'The assistant is busy at the moment. Please try again shortly, or share your details below.',
  error: 'Something went wrong with that answer. Please try again, or share your details below.',
  limit: 'That is the end of this chat. Please share your details and Ganeaysh will reply by email.',
  refusal: 'I can only help with questions about KoKreaters. If you would like to talk it through, please share your details.',
  tooLong: 'Please keep your question under 1,000 characters.',
  transcriptLabel: 'Questions asked in Ask KoKreaters',
};
