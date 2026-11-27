import { expect, test } from '@playwright/test';

test.describe('c-programming smoke', () => {
  test('serves the canonical home', async ({ page }) => {
    await page.goto('/corecs/c-programming');

    await expect(page.getByRole('heading', { name: /C, from source/i })).toBeVisible();
    await expect(page.getByText(/35 lessons organized as one interactive workbench/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Start the curriculum/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the memory lab/i })).toBeVisible();
  });

  test('opens the curriculum and a chapter lesson', async ({ page }) => {
    await page.goto('/corecs/c-programming/learn');

    await expect(page.getByRole('heading', { name: 'The C curriculum' })).toBeVisible();
    await expect(page.getByText(/Thirty-five lessons, from the character set to dynamic memory/)).toBeVisible();

    await page.locator('a[href$="/learn/pointer-address"]').click();
    await expect(page.getByRole('heading', { name: 'Pointers, Address & Dereference', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Addresses, declaration, and dereference' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In plain English' })).toBeVisible();
    await expect(page.getByText(/A pointer is a street address/i)).toBeVisible();
    await expect(page.getByText('Quick check')).toBeVisible();
  });

  test('breaks the pointer chain in the lab', async ({ page }) => {
    await page.goto('/corecs/c-programming/lab');

    await expect(page.getByRole('heading', { name: 'Pointer chain' })).toBeVisible();
    await page.getByRole('button', { name: 'p = NULL', exact: true }).click();
    await page.getByRole('button', { name: '*p = 99', exact: true }).click();
    await expect(page.getByText(/p is NULL/)).toBeVisible();
  });

  test('animates pointer memory changes', async ({ page }) => {
    await page.goto('/corecs/c-programming/learn/pointer-address');

    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 6/)).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.getByText(/Step 2 of 6/)).toBeVisible();
    await expect(page.getByText(/p does not contain 42/i)).toBeVisible();
  });

  test('animates struct layout, heap, and bitwise examples', async ({ page }) => {
    await page.goto('/corecs/c-programming/learn/struct-functions-layout');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();

    await page.goto('/corecs/c-programming/learn/malloc-free');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();

    await page.goto('/corecs/c-programming/learn/bitwise-operators');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 7/)).toBeVisible();
  });

  test('checks an answer in the drill arena', async ({ page }) => {
    await page.goto('/corecs/c-programming/problems/pointer-arithmetic');

    await expect(page.getByRole('heading', { name: 'Pointer Arithmetic' })).toBeVisible();
    await page.getByRole('button', { name: '1004' }).click();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByText(/Pointer arithmetic is scaled by the pointed-to type/i)).toBeVisible();
  });
});
