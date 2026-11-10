/**
 * /insights/[slug] (REDESIGN-V3 §4 article). Loaded by pages/insights/[slug].astro.
 * "Download PDF" ([data-print]) opens the browser's print dialog; the print stylesheet (ArticleLayout + prose.css)
 * turns the page into a clean document the reader saves as PDF. Before printing, every pending reveal is shown and
 * lazy images are switched to eager so nothing prints blank.
 */
function prepareForPrint(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
}

function initArticle(): void {
  window.addEventListener('beforeprint', prepareForPrint);
  document.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((b) => {
    b.addEventListener('click', () => { prepareForPrint(); window.print(); });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initArticle, { once: true });
else initArticle();
