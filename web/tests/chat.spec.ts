/**
 * Ask KoKreaters widget (src/components/chrome/ChatWidget.astro + src/scripts/chat.ts) with /api/chat and
 * /api/contact mocked by route interception (astro preview serves no functions).
 *   lazy      chat.ts is not requested until the launcher is hovered / focused / clicked
 *   dialog    opens on click, focus goes inside, Tab stays inside (focus trap), Esc closes and focus returns
 *   answer    a suggested question streams an answer (NDJSON) into the log and the live region
 *   handoff   after the 5th answer the owner's line + the inline form appear; the form validates, then POSTs JSON
 *             with chat_transcript, and the thank-you state replaces it
 *   503       no provider key → the unavailable note and the form
 *   contact   the widget is not on /contact
 */
import { test, expect, type Page, type Route } from '@playwright/test';

const ANSWER = 'We work across nine industries, from confectionery to industrial minerals. See /industries for the list.';
function ndjson(text: string) {
  return text.split(/(?<=\s)/).map((v) => JSON.stringify({ t: 'd', v })).join('\n') + '\n' + JSON.stringify({ t: 'end' }) + '\n';
}
async function mockChat(page: Page, status = 200) {
  const bodies: unknown[] = [];
  await page.route('**/api/chat', async (route: Route) => {
    bodies.push(route.request().postDataJSON());
    if (status !== 200) return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'unavailable' }) });
    return route.fulfill({ status: 200, contentType: 'application/x-ndjson', body: ndjson(ANSWER) });
  });
  return bodies;
}

test.describe('Ask KoKreaters', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('lazy-loads, opens, traps focus, closes on Esc', async ({ page }) => {
    await mockChat(page);
    const chunks: string[] = [];
    page.on('request', (r) => { if (/\/_astro\/chat\.[^/]*\.js$/.test(r.url())) chunks.push(r.url()); });
    await page.goto('/approach');
    const launcher = page.locator('[data-chat-launcher]');
    await expect(launcher).toBeVisible();
    await page.waitForTimeout(400);
    expect(chunks, 'chat.ts not loaded before intent').toEqual([]);

    await launcher.click();
    const panel = page.getByRole('dialog', { name: 'Ask KoKreaters' });
    await expect(panel).toBeVisible();
    await expect(launcher).toHaveAttribute('aria-expanded', 'true');
    expect(chunks.length).toBe(1);
    await expect(page.locator('#kc-input')).toBeFocused();

    // Tab cycles inside the dialog
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('[data-chat-panel]'))).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[data-chat-panel]'))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(launcher).toBeFocused();
    await expect(launcher).toHaveAttribute('aria-expanded', 'false');

    // keyboard-only reopen: Enter on the focused launcher
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Close' }).click();
    await expect(panel).toBeHidden();
  });

  test('streams an answer; Enter sends; handoff form after the 5th answer', async ({ page }) => {
    const chats = await mockChat(page);
    const posts: Record<string, string>[] = [];
    await page.route('**/api/contact', async (route) => { posts.push(route.request().postDataJSON()); await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await page.goto('/');
    await page.locator('[data-chat-launcher]').click();
    const panel = page.locator('[data-chat-panel]');
    await panel.getByRole('button', { name: 'Which industries do you work with?' }).click();
    await expect(panel.locator('.kc-msg--bot').first()).toContainText('nine industries');
    await expect(panel.locator('.kc-msg--bot a[href="/industries"]')).toHaveCount(1);
    await expect(page.locator('[data-chat-live]')).toContainText('nine industries');
    expect((chats[0] as { messages: unknown[] }).messages).toEqual([{ role: 'user', content: 'Which industries do you work with?' }]);

    const input = page.locator('#kc-input');
    for (let i = 2; i <= 5; i++) {
      await input.fill(`Question ${i}`);
      await input.press('Enter');
      await expect(panel.locator('.kc-msg--bot')).toHaveCount(i);
    }
    expect((chats[4] as { messages: unknown[] }).messages).toHaveLength(9);
    await expect(panel.locator('.kc-msg--note')).toContainText('Please share your details and Ganeaysh will reply by email.');
    const form = panel.locator('[data-chat-form]');
    await expect(form).toBeVisible();

    // validation, then a valid send with the transcript
    await form.getByRole('button', { name: 'Send' }).click();
    await expect(form.locator('#kc-f-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator('#kc-f-name')).toBeFocused();
    await form.locator('#kc-f-name').fill('Ada Lovelace');
    await form.locator('#kc-f-company').fill('Analytical Oils');
    await form.locator('#kc-f-email').fill('ada@example.com');
    await form.locator('#kc-f-country').fill('United Kingdom');
    await form.locator('#kc-f-interest').selectOption({ index: 2 });
    await form.locator('#kc-f-message').fill('We would like to talk about a refinery.');
    await form.locator('#kc-f-consent').check();
    await form.getByRole('button', { name: 'Send' }).click();
    await expect(panel.locator('[data-chat-done]')).toBeVisible();
    await expect(panel.locator('[data-chat-done-title]')).toBeFocused();
    expect(posts).toHaveLength(1);
    expect(posts[0].email).toBe('ada@example.com');
    expect(posts[0].consent).toBe('yes');
    expect(posts[0].via).toBe('chat');
    expect(posts[0].chat_transcript).toContain('Which industries do you work with?');
    expect(Number(posts[0].started_at)).toBeGreaterThan(0);
  });

  test('503: unavailable note and the form; "Share your details" opens the form', async ({ page }) => {
    await mockChat(page, 503);
    await page.goto('/about');
    await page.locator('[data-chat-launcher]').focus();
    await page.keyboard.press('Enter');
    const panel = page.locator('[data-chat-panel]');
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'What does KoKreaters do?' }).click();
    await expect(panel.locator('.kc-msg--error')).toContainText('not available');
    await expect(panel.locator('[data-chat-form]')).toBeVisible();
    await expect(page.locator('#kc-input')).toBeDisabled();
  });

  test('share link opens the form at any time', async ({ page }) => {
    await mockChat(page);
    await page.goto('/impact');
    await page.locator('[data-chat-launcher]').click();
    await page.locator('[data-chat-share]').click();
    await expect(page.locator('[data-chat-form]')).toBeVisible();
    await expect(page.locator('#kc-f-title')).toBeFocused();
  });

  test('not rendered on /contact', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('[data-chat]')).toHaveCount(0);
  });
});

test.describe('Ask KoKreaters on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('full-screen sheet', async ({ page }) => {
    await mockChat(page);
    await page.goto('/');
    await page.locator('[data-chat-launcher]').click();
    const panel = page.locator('[data-chat-panel]');
    await expect(panel).toHaveClass(/is-open/);
    await page.waitForTimeout(500);
    const box = await panel.boundingBox();
    expect(box && Math.round(box.width)).toBe(390);
    expect(box && Math.round(box.y)).toBe(0);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });
});
