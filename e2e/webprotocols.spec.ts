import { expect, test } from '@playwright/test';

const BASE = '/fullstack/webprotocols';
const SITE = 'https://cscosmos.vercel.app';

test.describe('webprotocols smoke', () => {
  test('serves canonical metadata and canonical navigation', async ({ page }) => {
    await page.goto(BASE);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}${BASE}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE}${BASE}`);

    const navHrefs = await page.locator('header nav a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    expect(navHrefs).toEqual([BASE, `${BASE}/path`, `${BASE}/playground`]);
  });

  test('shows all 14 modules in the learning path', async ({ page }) => {
    await page.goto(`${BASE}/path`);

    await expect(page.getByRole('heading', { name: 'Your Learning Roadmap' })).toBeVisible();
    await expect(page.getByText(/14 modules/).first()).toBeVisible();

    const cards = page.locator('h3');
    await expect(cards).toHaveCount(15); // 14 modules + the completion heading
    for (let index = 0; index < 15; index += 1) {
      await expect(cards.nth(index)).toBeVisible();
    }
  });

  test('renders 304 as Not Modified in the playground', async ({ page }) => {
    await page.goto(`${BASE}/playground`);

    await page.locator('select').nth(1).selectOption('304');
    await page.getByRole('button', { name: /^Send$/ }).click();

    await expect(page.getByText('304 Not Modified').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('304 Error')).toHaveCount(0);
    await expect(page.getByRole('switch', { name: 'Persistent cache' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('steps the request/response visualizer', async ({ page }) => {
    await page.goto(`${BASE}/topics/request-response`);

    await expect(page.getByText(/STEP 1 \/ 6/i)).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.getByText(/STEP 2 \/ 6/i)).toBeVisible();
    await expect(page.getByText('Open a connection')).toBeVisible();
  });
});

test.describe('webprotocols mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the mobile menu and exposes all sections', async ({ page }) => {
    await page.goto(BASE);

    const openButton = page.getByRole('button', { name: 'Open navigation menu' });
    await openButton.click();

    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Learning Path' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'HTTP Playground' })).toBeVisible();
  });
});
