import { expect, test } from '@playwright/test';

const BASE = '/fullstack/css-cosmos';

test.describe('css-cosmos fullstack smoke', () => {
  test('serves home page with updated navigation and no visualizers link', async ({ page }) => {
    await page.goto(BASE);

    // Navbar links
    const navHrefs = await page.locator('header nav a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    expect(navHrefs).toEqual([
      BASE,
      `${BASE}/concepts`,
      `${BASE}/lab`,
      `${BASE}/problems`,
    ]);

    // Ensure visualizers is NOT in navbar
    const navText = await page.locator('header nav').innerText();
    expect(navText).not.toContain('Visualizers');
    expect(navText).toContain('CSS Lab');
    expect(navText).toContain('Challenges (100 Qs)');

    // Ensure hero CTA buttons exist
    await expect(page.getByRole('link', { name: 'Explore Concepts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CSS Tinker Lab' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '100 Challenges' }).first()).toBeVisible();
  });

  test('renders concepts page with tracks, search, and deep-dive links', async ({ page }) => {
    await page.goto(`${BASE}/concepts`);

    await expect(page.getByRole('heading', { level: 1, name: /CSS Concepts: From Foundations to Advanced Architecture/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search concepts/i)).toBeVisible();

    // Verify track cards exist
    await expect(page.getByRole('heading', { level: 2, name: /1\. Syntax, Cascade & Foundations/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /2\. Modern Layout Systems/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /6\. Modern CSS Architecture/i })).toBeVisible();

    // Test search filter
    await page.getByPlaceholder(/Search concepts/i).fill('subgrid');
    await expect(page.getByText('CSS Subgrid', { exact: true })).toBeVisible();
  });

  test('renders CSS Tinker Lab with presets and preview iframe', async ({ page }) => {
    await page.goto(`${BASE}/lab`);

    await expect(page.getByRole('heading', { level: 1, name: /Interactive CSS Sandbox/i })).toBeVisible();
    await expect(page.getByText(/Interactive Presets:/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Bento Grid/i })).toBeVisible();

    // Verify iframe preview exists
    const iframe = page.locator('iframe[title="CSS Tinker Sandbox"]');
    await expect(iframe).toBeVisible();

    // Test preset switching
    const bentoBtn = page.getByRole('button', { name: /Bento Grid/i });
    await bentoBtn.click();
    await expect(bentoBtn).toHaveClass(/border-primary/);
  });

  test('renders problem arena with 100 CSS challenges', async ({ page }) => {
    await page.goto(`${BASE}/problems`);

    await expect(page.getByRole('heading', { level: 1, name: /CSS Code Challenges/i })).toBeVisible();
    await expect(page.getByText(/0 \/ 100 Solved/i)).toBeVisible();

    // Verify filter buttons
    await expect(page.getByRole('button', { name: 'All (100)' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Easy \(35\)/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medium \(40\)/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hard \(25\)/ })).toBeVisible();

    // Check first challenge link
    const firstChallengeLink = page.locator(`a[href="${BASE}/problems/1"]`);
    await expect(firstChallengeLink).toBeVisible();
    await expect(firstChallengeLink).toContainText('Text Color');
  });

  test('solves Problem #01 and evaluates successfully', async ({ page }) => {
    await page.goto(`${BASE}/problems/1`);

    // Heading
    await expect(page.getByRole('heading', { name: 'Text Color' })).toBeVisible();
    await expect(page.getByText('Category: Colors')).toBeVisible();

    // Evaluation run button
    const runBtn = page.getByRole('button', { name: 'Run Tests' });
    await expect(runBtn).toBeVisible();

    // Look for test criteria item
    await expect(page.getByText(/Target \.title selector/i)).toBeVisible();

    // Click "Reveal Solution" and test solver
    await page.getByRole('button', { name: 'Reveal Solution' }).click();
    await expect(page.getByText('.title { color: red; }')).toBeVisible();
  });
});
