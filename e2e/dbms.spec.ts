import { expect, test } from '@playwright/test';

test.describe('dbms smoke', () => {
  test('serves the canonical DBMS home', async ({ page }) => {
    await page.goto('/corecs/dbms');

    await expect(page.getByRole('heading', { name: /Make data behave/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Read the manual/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the workbench/i })).toBeVisible();
    await expect(page.getByText(/Thirty-two chapters/i)).toBeVisible();
  });

  test('opens the curriculum and a lesson', async ({ page }) => {
    await page.goto('/corecs/dbms/learn');

    await expect(page.getByRole('heading', { name: 'Contents.' })).toBeVisible();
    await page.locator('a[href$="/learn/first-normal-form"]').click();
    await expect(page.getByRole('heading', { name: 'Normalization: 1NF' })).toBeVisible();
    await expect(page.getByText('In plain English')).toBeVisible();
    await expect(page.getByText(/One fact per box/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Before you turn the page.' })).toBeVisible();
  });

  test('uses the ERD, algebra, and normalization labs', async ({ page }) => {
    await page.goto('/corecs/dbms/lab');

    await expect(page.getByRole('heading', { name: /Operate the model/i })).toBeVisible();
    await page.getByRole('button', { name: '1 : N', exact: true }).click();
    await expect(page.getByText('Add the foreign key to the many side')).toBeVisible();

    await page.getByRole('button', { name: /Algebra bench/ }).click();
    await expect(page.getByText('Result', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Decomposition bench/ }).click();
    await page.getByRole('button', { name: '2NF', exact: true }).click();
    await expect(page.getByText('No partial dependency on a composite key')).toBeVisible();
  });

  test('animates algebra, normalization, and locking examples', async ({ page }) => {
    await page.goto('/corecs/dbms/learn/relational-algebra-selection');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/01 \/ 03/)).toBeVisible();

    await page.goto('/corecs/dbms/learn/first-normal-form');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/01 \/ 03/)).toBeVisible();

    await page.goto('/corecs/dbms/learn/locking-2pl');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/01 \/ 05/)).toBeVisible();
  });

  test('paginates the thousand-question drill book', async ({ page }) => {
    await page.goto('/corecs/dbms/problems');

    await expect(page.getByText(/One thousand questions/i)).toBeVisible();
    await expect(page.getByText(/Showing 0001/)).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText(/Showing 0025/)).toBeVisible();

    await page.getByLabel('Filter by chapter').selectOption('first-normal-form');
    await expect(page.getByText(/Showing 0001/)).toBeVisible();
    await expect(page.getByText(/of 0032/)).toBeVisible();
  });

  test('opens a chapter-filtered drill set from a lesson', async ({ page }) => {
    await page.goto('/corecs/dbms/learn/first-normal-form');
    await page.getByRole('link', { name: /Practice this chapter/ }).click();

    await expect(page).toHaveURL(/chapter=first-normal-form/);
    await expect(page.getByLabel('Filter by chapter')).toHaveValue('first-normal-form');
    await expect(page.getByText(/of 0032/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/dbms/problems/first-normal-form');

    await expect(page.getByRole('heading', { name: 'First Normal Form' })).toBeVisible();
    await page.getByRole('button', { name: 'Atomic attribute values' }).click();
    await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  });
});
