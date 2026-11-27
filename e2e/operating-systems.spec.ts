import { expect, test } from '@playwright/test';

test.describe('operating-systems smoke', () => {
  test('serves the canonical OS home', async ({ page }) => {
    await page.goto('/corecs/operating-systems');

    await expect(page.getByRole('heading', { name: /The kernel/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start the curriculum/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the kernel lab/i })).toBeVisible();
    await expect(page.getByText(/Twelve lessons and three labs/i)).toBeVisible();
  });

  test('opens the curriculum and a lesson', async ({ page }) => {
    await page.goto('/corecs/operating-systems/learn');

    await expect(page.getByRole('heading', { name: 'The kernel curriculum' })).toBeVisible();
    await page.locator('a[href$="/learn/cpu-scheduling"]').click();
    await expect(page.getByRole('heading', { name: /CPU Scheduling/i })).toBeVisible();
    await expect(page.getByText('Quick check')).toBeVisible();
  });

  test('runs the scheduler, paging, and file labs', async ({ page }) => {
    await page.goto('/corecs/operating-systems/lab');

    await expect(page.getByRole('heading', { name: /Run the system/i })).toBeVisible();
    await page.getByRole('button', { name: 'Round Robin', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Gantt chart' })).toBeVisible();

    await page.getByRole('button', { name: /^Paging & TLB/ }).click();
    await expect(page.getByRole('heading', { name: 'Virtual address' })).toBeVisible();
    await page.getByRole('button', { name: 'Translate', exact: true }).click();
    await expect(page.getByText('mapped')).toBeVisible();

    await page.getByRole('button', { name: /^File Allocation/ }).click();
    await expect(page.getByRole('heading', { name: 'FAT walk' })).toBeVisible();
    await page.getByRole('button', { name: 'Next block' }).click();
    await expect(page.getByText(/2 \/ 5 blocks read/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/operating-systems/problems/turnaround-time');

    await expect(page.getByRole('heading', { name: 'Turnaround Time' })).toBeVisible();
    await page.getByRole('button', { name: '7' }).click();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByText(/Turnaround time is completion minus arrival/i)).toBeVisible();
  });
});
