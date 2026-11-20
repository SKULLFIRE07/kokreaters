/**
 * Pack 3: cookie-free Plausible events (brief "Analytics"). The script loads only when PUBLIC_PLAUSIBLE_DOMAIN is set
 * (BaseLayout); without it `track` is a no-op. Events: book-call, form-send, playbook-download.
 * Markup can also carry `data-event="book-call"`: src/scripts/site.ts sends it on click.
 */
export type AnalyticsEvent = 'book-call' | 'form-send' | 'playbook-download';

declare global {
  interface Window { plausible?: (event: string, opts?: { props?: Record<string, string> }) => void; }
}

export function track(event: AnalyticsEvent, props?: Record<string, string>): void {
  try { window.plausible?.(event, props ? { props } : undefined); } catch { /* never break the page for analytics */ }
}
