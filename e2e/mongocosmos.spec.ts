import { expect, test } from '@playwright/test';

const APP_URL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '3100'}`;
const CANONICAL_PATH = '/fullstack/mongocosmos';
const CANONICAL_URL = `https://cscosmos.vercel.app${CANONICAL_PATH}`;

test.describe('mongocosmos smoke & architecture suite', () => {
  test('redirects the engine path to the canonical topic URL', async ({ page, request }) => {
    const response = await request.get(`${APP_URL}/mongocosmos`, { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers()['location']).toBe(CANONICAL_PATH);

    await page.goto('/mongocosmos');
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}$`));
    await expect(
      page.getByRole('heading', { level: 1, name: /Master MongoDB & Document Engine Architecture/i }),
    ).toBeVisible();
  });

  test('serves canonical metadata and open graph tags', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', CANONICAL_URL);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', CANONICAL_URL);
    await expect(page).toHaveTitle(/MongoCosmos/);
  });

  test('renders all 50 concepts and filters by category', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/concepts`);

    await expect(
      page.getByRole('heading', { level: 1, name: /Document Database Architecture Concepts/i }),
    ).toBeVisible();

    // Verify all 50 concept cards are rendered
    const conceptCards = page.locator('a[href^="/mongocosmos/concepts/"]');
    await expect(conceptCards).toHaveCount(50);

    // Test category filter for WiredTiger
    await page.getByRole('button', { name: /WiredTiger Engine & Cache/i }).click();
    await expect(page.getByText('WiredTiger B-Tree Internal vs Leaf Page Layout')).toBeVisible();
    await expect(page.getByText('WiredTiger In-Memory Cache (Clean vs Dirty Pages)')).toBeVisible();
    await expect(page.getByText('WiredTiger Checkpoints & Crash Consistency')).toBeVisible();
  });

  test('renders concept detail page with 10-part structure and embedded visualizer', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/concepts/bson-binary-serialization`);

    // Topic title
    await expect(
      page.getByRole('heading', { level: 1, name: /BSON Binary Format & Wire Serialization/i }),
    ).toBeVisible();

    // Verify embedded visualizer
    await expect(page.getByText('BSON Binary Byte Layout Inspector')).toBeVisible();

    // Verify key sections
    await expect(page.getByText('1. Formal Definition & Architecture Intent')).toBeVisible();
    await expect(page.getByText("2. Explain Like I'm 5 (Mental Model)")).toBeVisible();
    await expect(page.getByText('3. Real-World Architecture Example')).toBeVisible();
    await expect(page.getByText('4. MQL Implementation Steps')).toBeVisible();
    await expect(page.getByText('5. Critical Engineering Rules')).toBeVisible();
    await expect(page.getByText('6. Deep Dive:')).toBeVisible();
    await expect(page.getByText('7. Architectural Trade-offs')).toBeVisible();
    await expect(page.getByText('8. Technical Interview Questions')).toBeVisible();
    await expect(page.getByText('9. Staff-Level Ready Answer')).toBeVisible();
    await expect(page.getByText('10. Quick Knowledge Check')).toBeVisible();
  });

  test('interacts with WiredTiger Engine Lab', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/wiredtiger-lab`);

    await expect(
      page.getByRole('heading', { level: 1, name: /WiredTiger Cache & Checkpoint Engine Lab/i }),
    ).toBeVisible();

    // Write a document and verify journal LSN increments
    await page.getByRole('button', { name: /Write Doc/i }).click();
    await expect(page.getByText('Document insert committed', { exact: false })).toBeVisible();

    // Run eviction
    await page.getByRole('button', { name: /Run Eviction/i }).click();
    await expect(page.getByText('eviction server thread', { exact: false })).toBeVisible();
  });

  test('interacts with Aggregation Pipeline Lab', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/agg-lab`);

    await expect(
      page.getByRole('heading', { level: 1, name: /Aggregation Pipeline Multi-Stage Lab/i }),
    ).toBeVisible();

    // Click Next Stage to move to $match
    await page.getByRole('button', { name: /Next Stage/i }).click();
    await expect(page.getByText('Stage 2 of 4:')).toBeVisible();
    await expect(page.getByText('INDEX PUSHDOWN (IXSCAN)')).toBeVisible();
  });

  test('interacts with Replica Consensus Lab', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/replica-lab`);

    await expect(
      page.getByRole('heading', { level: 1, name: /Replica Set Raft Consensus & Failover Lab/i }),
    ).toBeVisible();

    // Partition primary
    await page.getByRole('button', { name: /Partition Primary/i }).click();
    await expect(page.getByText('PRIMARY node-1 partitioned/crashed!')).toBeVisible();

    // Trigger election
    await page.getByRole('button', { name: /Trigger Heartbeat Election/i }).click();
    await expect(page.getByText('Promoted to PRIMARY on Term 2')).toBeVisible();
  });

  test('interacts with Sharding Cluster Lab', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/sharding-lab`);

    await expect(
      page.getByRole('heading', { level: 1, name: /Sharded Cluster & mongos Router Lab/i }),
    ).toBeVisible();

    // Test scatter gather query
    await page.getByRole('button', { name: /Scatter-Gather Query/i }).click();
    await expect(page.getByText('broadcasted to ALL shards', { exact: false })).toBeVisible();
  });

  test('executes MQL queries in the playground', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/playground`);

    await expect(
      page.getByRole('heading', { level: 1, name: /Interactive MQL & Aggregation Playground/i }),
    ).toBeVisible();

    // Click execute
    await page.getByRole('button', { name: /Execute MQL/i }).click();
    await expect(page.getByText('EXECUTION_SUCCESS')).toBeVisible();
  });

  test('evaluates practice problems with instant validation', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/problems`);

    await expect(
      page.getByRole('heading', { level: 1, name: /MongoDB Practice Problems/i }),
    ).toBeVisible();

    // Fill in the correct solution for mp-1:
    await page.locator('textarea').fill('db.users.find({ role: "developer", status: "active" })');

    // Click Evaluate Challenge
    await page.getByRole('button', { name: /Evaluate Challenge/i }).click();
    await expect(page.getByText('SUCCESS: Query returned', { exact: false })).toBeVisible();
    await expect(page.getByText('Challenge Solved')).toBeVisible();
  });

  test('jumps to flashcards via select and flips the card', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/flashcards`);

    // Dropdown selector jump to mf-5
    const select = page.getByRole('combobox', { name: /Jump to specific question/i });
    await expect(select).toBeVisible();
    await select.selectOption({ value: 'mf-5' });

    // Verify question is loaded
    await expect(page.getByRole('heading', { level: 3 })).toContainText('Clean and Dirty pages');

    // Click card to flip
    const card = page.locator('div[role="button"]:has-text("Interview Question:")');
    await card.click();
    await expect(page.getByText('Engine Answer:', { exact: false })).toBeVisible();
  });

  test('navbar and footer provide clean zero-gradient links', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Concepts' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Playground' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Problems' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Interview Questions' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Cheatsheet' })).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer.getByText('MongoCosmos by CSCosmos')).toBeVisible();
  });
});
