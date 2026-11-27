import { expect, test } from '@playwright/test';

test.describe('operating-systems smoke', () => {
  test('serves the canonical OS home', async ({ page }) => {
    await page.goto('/corecs/operating-systems');

    await expect(page.getByRole('heading', { name: /The kernel/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start the curriculum/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the kernel lab/i })).toBeVisible();
    await expect(page.getByText(/Thirty-nine focused lessons and three labs/i)).toBeVisible();
  });

  test('opens the curriculum and a lesson', async ({ page }) => {
    await page.goto('/corecs/operating-systems/learn');

    await expect(page.getByRole('heading', { name: 'The kernel curriculum' })).toBeVisible();
    await page.locator('a[href$="/learn/fcfs-scheduling"]').click();
    await expect(page.getByRole('heading', { name: 'FCFS Scheduling' })).toBeVisible();
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

  test('animates scheduling and page replacement examples', async ({ page }) => {
    await page.goto('/corecs/operating-systems/learn/fcfs-scheduling');

    await expect(page.getByRole('heading', { name: 'FCFS Scheduling' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 3/)).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.getByText(/Step 2 of 3/)).toBeVisible();

    await page.goto('/corecs/operating-systems/learn/fifo-page-replacement');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 12/)).toBeVisible();
    await page.getByRole('button', { name: 'LRU', exact: true }).click();
    await expect(page.getByText(/Step 1 of 12/)).toBeVisible();
  });

  test('animates process states and TLB translation', async ({ page }) => {
    await page.goto('/corecs/operating-systems/learn/process-concept-states');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 7/)).toBeVisible();

    await page.goto('/corecs/operating-systems/learn/tlb-translation');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 6/)).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.getByText(/Step 2 of 6/)).toBeVisible();
  });

  test('animates segmentation, indexed allocation, and external sorting', async ({ page }) => {
    await page.goto('/corecs/operating-systems/learn/segmentation');
    await expect(page.getByRole('heading', { name: 'Watch it happen' })).toBeVisible();
    await expect(page.getByText(/Step 1 of 4/)).toBeVisible();

    await page.goto('/corecs/operating-systems/learn/indexed-file-allocation');
    await expect(page.getByText(/Step 1 of 4/)).toBeVisible();

    await page.goto('/corecs/operating-systems/learn/file-sorting-merging');
    await expect(page.getByText(/Step 1 of 6/)).toBeVisible();
  });

  test('checks a practice answer', async ({ page }) => {
    await page.goto('/corecs/operating-systems/problems/turnaround-time');

    await expect(page.getByRole('heading', { name: 'Turnaround Time' })).toBeVisible();
    await page.getByRole('button', { name: '7' }).click();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByText(/Turnaround time is completion minus arrival/i)).toBeVisible();
  });
});
