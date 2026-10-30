import { expect, test } from '@playwright/test';

const APP_URL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '3100'}`;
const CANONICAL_PATH = '/fullstack/sqlcosmos';
const CANONICAL_URL = `https://cscosmos.vercel.app${CANONICAL_PATH}`;

test.describe('sqlcosmos smoke', () => {
  test('redirects the engine path to the canonical topic URL', async ({ page, request }) => {
    const response = await request.get(`${APP_URL}/sqlcosmos`, { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers()['location']).toBe(CANONICAL_PATH);

    await page.goto('/sqlcosmos');
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}$`));
    await expect(
      page.getByRole('heading', { level: 1, name: /Master the SQL & Database Engine/i }),
    ).toBeVisible();
  });

  test('serves canonical metadata and platform chrome', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', CANONICAL_URL);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', CANONICAL_URL);
    await expect(page).toHaveTitle(/SQL Visualizer/);

    // Platform Chrome checks: Notes, Related Topics & Comments
    await expect(page.locator('summary').filter({ hasText: 'Notes' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Learning graph' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Discussion' })).toBeVisible();
  });

  test('renders all 23 concepts and filters by architecture', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/concepts`);

    await expect(
      page.getByRole('heading', { level: 1, name: /SQL & Relational Engine Concepts/i }),
    ).toBeVisible();

    // Verify all 23 concept links are rendered
    const conceptCards = page.locator('a[href^="/sqlcosmos/concepts/"]');
    await expect(conceptCards).toHaveCount(23);

    // Test the architecture category filter
    await page.getByRole('button', { name: 'architecture', exact: true }).click();
    await expect(page.getByText('Database Normalization (1NF to BCNF)')).toBeVisible();
    await expect(page.getByText('Views, Materialized Views & Zero-Downtime Refresh')).toBeVisible();
    await expect(page.getByText('Table Partitioning: Range, List & Hash Strategies')).toBeVisible();
  });

  test('steps through B+ Tree index lab with multiple targets', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/index-lab`);

    await expect(
      page.getByRole('heading', { level: 1, name: /B\+ Tree Database Indexing Lab/i }),
    ).toBeVisible();

    // Test target id = 18 (David)
    await page.getByRole('button', { name: /id = 18/i }).click();
    await expect(page.getByText('David', { exact: false }).first()).toBeVisible();

    // Step through traversal
    await page.getByRole('button', { name: /Next Step/i }).click();
    await expect(page.getByText('Branch Page #2', { exact: false }).first()).toBeVisible();
  });

  test('flips flashcards using click or keyboard', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/flashcards`);

    const card = page.getByRole('button', { name: /Flashcard:/i });
    await expect(card).toBeVisible();

    // Initially shows question
    await expect(page.getByText('Question:', { exact: false })).toBeVisible();

    // Click or press Space to reveal answer
    await card.press('Space');
    await expect(page.getByText('Answer:', { exact: false })).toBeVisible();
  });
});
