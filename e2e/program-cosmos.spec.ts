import { expect, test } from '@playwright/test';

const APP_URL = 'http://127.0.0.1:3100';
const CANONICAL_PATH = '/fullstack/program-cosmos';
const CANONICAL_URL = `https://cscosmos.vercel.app${CANONICAL_PATH}`;

test.describe('program-cosmos smoke', () => {
  test('redirects the engine path to the canonical topic URL', async ({ page, request }) => {
    const response = await request.get(`${APP_URL}/program-cosmos`, { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers()['location']).toBe(CANONICAL_PATH);

    await page.goto('/program-cosmos');
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}$`));
    await expect(
      page.getByRole('heading', { level: 1, name: /How Programs Execute/i }),
    ).toBeVisible();
  });

  test('serves canonical metadata and platform chrome', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', CANONICAL_URL);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', CANONICAL_URL);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${CANONICAL_URL}/og`,
    );
    await expect(page.getByRole('navigation', { name: /Breadcrumb/ })).toContainText('CSCosmos');
    await expect(page.getByRole('button', { name: /Mark topic complete|Topic completed/ })).toBeVisible();
  });

  test('shows the completion card and resets progress', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'programviz-progress',
        JSON.stringify({ completedSteps: [1, 2, 3, 4, 5, 6, 7] }),
      );
      localStorage.removeItem('cscosmos:learning:v1');
    });

    await page.goto(CANONICAL_PATH);
    await expect(page.getByRole('heading', { name: 'Course Complete' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Review Course' })).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Reset progress', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Start Learning' })).toBeVisible();
  });

  test('navigates between steps and advances progress', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await page.getByRole('link', { name: /CPU Basics/i }).first().click();
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}/cpu-basics$`));

    await page.getByRole('button', { name: 'Mark Step Complete' }).click();
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}/instruction-cycle$`));
  });

  test('steps and resets the assembly simulator with the keyboard', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/instruction-cycle`);

    const simulator = page.getByRole('region', { name: /assembly step-through simulator/i });
    await simulator.focus();
    await page.keyboard.press('ArrowRight');

    await expect(simulator.getByText('EXECUTE: MOV', { exact: false })).toBeVisible();
    await expect(simulator.getByText('15', { exact: true }).first()).toBeVisible();

    await page.keyboard.press('r');
    await expect(simulator.getByText('READY', { exact: false }).first()).toBeVisible();
  });

  test('supports dark and light themes', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cscosmos-ui-theme', 'dark');
    });

    await page.goto(CANONICAL_PATH);
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.locator('button[aria-label="Toggle Theme"]:visible').first().click();
    await expect(page.locator('html')).toHaveClass(/light/);
  });
});

test.describe('program-cosmos mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the menu as a dialog and restores focus on Escape', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    const openButton = page.getByRole('button', { name: 'Open navigation menu' });
    await openButton.click();

    const dialog = page.getByRole('dialog', { name: 'ProgramViz navigation' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(openButton).toBeFocused();
  });
});
