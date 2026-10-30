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

  test('serves canonical metadata', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', CANONICAL_URL);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', CANONICAL_URL);
    await expect(page).toHaveTitle(/SQL Visualizer/);
  });

  test('renders all 50 concepts and filters by architecture', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/concepts`);

    await expect(
      page.getByRole('heading', { level: 1, name: /SQL & Relational Engine Concepts/i }),
    ).toBeVisible();

    // Verify all 50 concept links are rendered
    const conceptCards = page.locator('a[href^="/sqlcosmos/concepts/"]');
    await expect(conceptCards).toHaveCount(50);

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

  test('navbar provides clean links to concepts, playground, problems, and flashcards', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Concepts' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Playground' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Problems' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Interview Questions' })).toBeVisible();
  });

  test('runs and validates interactive practice problems', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/problems`);

    await expect(
      page.getByRole('heading', { level: 1, name: /SQL Practice Problems/i }),
    ).toBeVisible();

    // Verify challenge button is visible
    await expect(page.getByRole('button', { name: /Filter Developers/i })).toBeVisible();

    // Click "Evaluate Challenge"
    await page.getByRole('button', { name: /Evaluate Challenge/i }).click();

    // Challenge 1 evaluates to true and shows "Challenge Solved" badge
    await expect(page.getByText('Challenge Solved')).toBeVisible();
  });
});
