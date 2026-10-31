import { expect, test } from '@playwright/test';

const APP_URL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '3100'}`;
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

    // Notes, learning graph, and discussion must be excluded from the homepage
    await expect(page.getByRole('heading', { level: 2, name: 'Learning graph' })).toBeHidden();
    await expect(page.getByRole('heading', { level: 2, name: 'Discussion' })).toBeHidden();
    await expect(page.getByText('saved locally')).toBeHidden();

    // Verify top navbar links and absence of desktop sidebar on homepage
    await expect(page.getByRole('navigation', { name: 'Main Navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Concepts' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Simulation Lab' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Problems/ }).first()).toBeVisible();
    await expect(page.locator('aside[aria-label="ProgramViz lessons navigation"]')).toBeHidden();
  });

  test('navigates to practice arena and solves a question from the 100 questions', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/problems`);

    await expect(page.getByRole('heading', { level: 1, name: /Systems Practice Arena/i })).toBeVisible();
    await expect(page.getByText(/0 \/ 100/i)).toBeVisible();

    // Verify question 1 is present
    await expect(page.getByText('Question #1')).toBeVisible();

    // Answer Question 1 correctly ("A sequence of precise instructions...")
    await page.getByRole('button', { name: /A sequence of precise instructions/i }).click();

    // Verify explanation is revealed
    await expect(page.getByText(/Correct! Technical Explanation/i)).toBeVisible();
    await expect(page.getByText(/1 \/ 100/i)).toBeVisible();
  });

  test('navigates to simulation lab and switches tools', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/lab`);

    await expect(page.getByRole('heading', { level: 1, name: /Systems Simulation Lab/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /CPU Instruction Execution Simulator/i })).toBeVisible();

    // Switch to RAM memory grid
    await page.getByRole('button', { name: /RAM Memory Grid/i }).click();
    await expect(page.getByRole('heading', { level: 2, name: /Interactive RAM Memory Grid/i })).toBeVisible();
  });

  test('shows the completion card and resets progress', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'programviz-progress',
        JSON.stringify({ completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),
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

    // Lesson pages retain notes, learning graph, and discussion
    await expect(page.getByRole('heading', { level: 2, name: 'Learning graph' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Discussion' })).toBeVisible();
    await expect(page.getByText('saved locally')).toBeVisible();

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

  for (const { stored, forbidden } of [
    { stored: 'light', forbidden: 'dark' },
    { stored: 'dark', forbidden: 'light' },
  ]) {
    test(`does not flash ${forbidden} when the stored theme is ${stored}`, async ({ browser }) => {
      const context = await browser.newContext({
        colorScheme: stored === 'dark' ? 'dark' : 'light',
      });

      await context.addInitScript((theme) => {
        localStorage.setItem('cscosmos-ui-theme', theme);
        const state = window as unknown as { __themeClasses?: string[] };
        state.__themeClasses = [];

        const record = () => {
          const html = document.documentElement;
          if (html) state.__themeClasses?.push(html.className);
        };

        record();
        new MutationObserver(record).observe(document, {
          attributes: true,
          subtree: true,
          attributeFilter: ['class', 'data-theme', 'data-mode'],
        });
      }, stored);

      const page = await context.newPage();
      await page.goto(`${CANONICAL_PATH}/what-is-a-program`);
      await expect(page.getByRole('heading', { level: 1, name: /What Is a Program/i })).toBeVisible();
      await expect(page.locator('html')).toHaveClass(new RegExp(stored));

      const classes = await page.evaluate(
        () => (window as unknown as { __themeClasses?: string[] }).__themeClasses ?? [],
      );
      expect(classes.some((className) => className.includes(forbidden))).toBe(false);

      await context.close();
    });
  }
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
