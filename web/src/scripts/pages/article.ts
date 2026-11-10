/**
 * /insights/[slug] (REDESIGN-V3 §4 article). Loaded by pages/insights/[slug].astro.
 * "Download PDF" ([data-print]) opens the browser's print dialog; the print stylesheet (ArticleLayout + prose.css)
 * turns the page into a clean document the reader saves as PDF. Before printing, every pending reveal is shown and
 * lazy images are switched to eager so nothing prints blank.
 * Contents rail ([data-toc], ≥ 1360px): marks the link of the section being read with aria-current="true" (the last
 * h2 whose top has passed 30% of the viewport; none before the first one). Passive scroll + rAF, no layout writes.
 */
function prepareForPrint(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
}

function initToc(): void {
  const toc = document.querySelector<HTMLElement>('[data-toc]');
  if (!toc) return;
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  let current = -1;
  let raf = 0;
  const update = (): void => {
    raf = 0;
    if (!toc.offsetParent) return;   // rail hidden below 1360px
    const line = window.innerHeight * 0.3;
    let idx = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) idx = i; });
    if (idx === current) return;
    current = idx;
    links.forEach((a, i) => { if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  };
  const queue = (): void => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
}

function initArticle(): void {
  initToc();
  window.addEventListener('beforeprint', prepareForPrint);
  document.querySelectorAll<HTMLButtonElement>('[data-print]').forEach((b) => {
    b.addEventListener('click', () => { prepareForPrint(); window.print(); });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initArticle, { once: true });
else initArticle();
