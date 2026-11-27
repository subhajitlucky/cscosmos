import { expect, test } from '@playwright/test';

test.describe('fundamentals of IT smoke', () => {
  test('serves the canonical atlas home', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it');

    await expect(page.getByRole('heading', { name: /From bits to business/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the atlas/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Try an instrument/i })).toBeVisible();
    await expect(page.getByText(/five-hundred-question bank/i)).toBeVisible();
    await expect(page.getByText(/the stack/i).first()).toBeVisible();
  });

  test('opens the tracks and a chapter', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/learn');

    await expect(page.getByRole('heading', { name: 'The whole system.' })).toBeVisible();
    await page.locator('a[href$="/learn/binary-number-systems"]').click();
    await expect(page.getByRole('heading', { name: 'Binary & Number Systems' })).toBeVisible();
    await expect(page.getByText('In plain English')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Before you move on.' })).toBeVisible();
  });

  test('uses the system, binary, and network instruments', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/lab');

    await expect(page.getByRole('heading', { name: /Three instruments/i })).toBeVisible();
    await expect(page.getByText('Estimated build')).toBeVisible();

    await page.getByRole('button', { name: /Binary bench/ }).click();
    const decimal = page.getByLabel('Decimal value');
    await decimal.fill('90');
    await expect(page.getByText('01011010', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('0x5A', { exact: true }).first()).toBeVisible();

    await page.getByRole('button', { name: /Network path/ }).click();
    await expect(page.getByText('Request trace')).toBeVisible();
    await page.getByRole('button', { name: /Next stage/ }).click();
    await expect(page.getByRole('heading', { name: 'Resolve the name' })).toBeVisible();
  });

  test('paginates and filters the 500-question bank', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/problems');

    await expect(page.getByText(/Five hundred questions/i)).toBeVisible();
    await expect(page.getByText(/Showing 001/)).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText(/Showing 021/)).toBeVisible();

    await page.getByLabel('Filter by chapter').selectOption('binary-number-systems');
    await expect(page.getByText(/Showing 001/)).toBeVisible();
    await expect(page.getByText(/of 021/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/problems/it-mcq-what-is-it-01');

    await expect(page.getByRole('heading', { name: 'Defining Information Technology' })).toBeVisible();
    await page.getByRole('button', { name: /Applying computers, networks, and software/i }).click();
    await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  });

  test('opens a chapter-filtered drill set from a lesson', async ({ page }) => {
    await page.goto('/corecs/fundamentals-of-it/learn/binary-number-systems');
    await page.getByRole('link', { name: /Practice this chapter/ }).click();

    await expect(page).toHaveURL(/chapter=binary-number-systems/);
    await expect(page.getByLabel('Filter by chapter')).toHaveValue('binary-number-systems');
    await expect(page.getByText(/of 021/)).toBeVisible();
  });
});
