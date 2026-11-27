import { expect, test } from '@playwright/test';

test.describe('IT Fundamentals smoke', () => {
  test('serves the seven-topic module home', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it');

    await expect(page.getByRole('heading', { name: 'IT Fundamentals', exact: true })).toBeVisible();
    await expect(page.getByText(/Computer blocks, memory and storage/i)).toBeVisible();
    await expect(page.getByText(/7 topics · 56 min/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Start studying|Continue studying/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Practise module/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Study notes' })).toBeVisible();
  });

  test('opens the number-systems topic', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/learn');

    await expect(page.getByRole('heading', { name: 'IT Fundamentals', exact: true })).toBeVisible();
    await page.locator('a[href$="/learn/number-systems"]').first().click();
    await expect(page.getByRole('heading', { name: 'Number Systems & Data Representation' })).toBeVisible();
    await expect(page.getByText('In plain English')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quick check' })).toBeVisible();
  });

  test('uses the block-diagram, number-system, and logic tools', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/lab');

    await expect(page.getByRole('heading', { name: /Three ways to see the machine/i })).toBeVisible();
    await page.getByRole('button', { name: /Memory unit/ }).click();
    await expect(page.getByText(/Stores the program and its data/i)).toBeVisible();

    await page.getByRole('button', { name: /Number systems/ }).click();
    await page.getByLabel('Decimal value').fill('90');
    await expect(page.getByText('01011010', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('0x5A', { exact: true }).first()).toBeVisible();

    await page.getByRole('button', { name: /Logic gates/ }).click();
    await page.getByRole('button', { name: 'XOR', exact: true }).click();
    await expect(page.getByText('Y = A ⊕ B')).toBeVisible();
    await page.getByRole('button', { name: 'Toggle input A' }).click();
    await expect(page.getByText('Truth table · XOR')).toBeVisible();
  });

  test('paginates and filters the 140-question bank', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/problems');

    await expect(page.getByRole('heading', { name: /Practise the module/i })).toBeVisible();
    await expect(page.getByText(/140 questions/i)).toBeVisible();
    await expect(page.getByText(/Showing 001/)).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText(/Showing 021/)).toBeVisible();

    await page.getByLabel('Filter by topic').selectOption('number-systems');
    await expect(page.getByText(/Showing 001/)).toBeVisible();
    await expect(page.getByText(/of 020/)).toBeVisible();
  });

  test('opens a topic-filtered drill set from a lesson', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/learn/number-systems');
    await page.getByRole('link', { name: /Practise these 20 questions/i }).click();

    await expect(page).toHaveURL(/chapter=number-systems/);
    await expect(page.getByLabel('Filter by topic')).toHaveValue('number-systems');
    await expect(page.getByText(/of 020/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/problems/it-mcq-computer-organization-01');

    await expect(page.getByRole('heading', { name: 'Role of the Arithmetic Logic Unit' })).toBeVisible();
    await page.getByRole('button', { name: /Adding two register values/i }).click();
    await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  });
});
