import { expect, test } from '@playwright/test';

test.describe('dbms smoke', () => {
  test('serves the canonical DBMS home', async ({ page }) => {
    await page.goto('/corecs/dbms');

    await expect(page.getByRole('heading', { name: /From domain/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start the curriculum/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the data lab/i })).toBeVisible();
    await expect(page.getByText(/Thirty-two focused lessons/i)).toBeVisible();
  });

  test('opens the curriculum and a lesson', async ({ page }) => {
    await page.goto('/corecs/dbms/learn');

    await expect(page.getByRole('heading', { name: 'The database curriculum' })).toBeVisible();
    await page.locator('a[href$="/learn/first-normal-form"]').click();
    await expect(page.getByRole('heading', { name: 'Normalization: 1NF' })).toBeVisible();
    await expect(page.getByText('In plain English')).toBeVisible();
    await expect(page.getByText(/One fact per box/i)).toBeVisible();
    await expect(page.getByText('Quick check')).toBeVisible();
  });

  test('uses the ERD, algebra, and normalization labs', async ({ page }) => {
    await page.goto('/corecs/dbms/lab');

    await expect(page.getByRole('heading', { name: /Model it/i })).toBeVisible();
    await page.getByRole('button', { name: '1 : N', exact: true }).click();
    await expect(page.getByText('Add the foreign key to the many side')).toBeVisible();

    await page.getByRole('button', { name: /^Relational Algebra/ }).click();
    await expect(page.getByText('Result', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: /^Normalization/ }).click();
    await page.getByRole('button', { name: '2NF', exact: true }).click();
    await expect(page.getByText('No partial dependency on a composite key')).toBeVisible();
  });

  test('animates algebra, normalization, and locking examples', async ({ page }) => {
    await page.goto('/corecs/dbms/learn/relational-algebra-selection');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 3/)).toBeVisible();

    await page.goto('/corecs/dbms/learn/first-normal-form');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 3/)).toBeVisible();

    await page.goto('/corecs/dbms/learn/locking-2pl');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/dbms/problems/first-normal-form');

    await expect(page.getByRole('heading', { name: 'First Normal Form' })).toBeVisible();
    await page.getByRole('button', { name: 'Atomic attribute values' }).click();
    await expect(page.getByText('Correct.')).toBeVisible();
  });
});
