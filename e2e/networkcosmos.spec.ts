import { expect, test } from '@playwright/test';

const APP_URL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? '3100'}`;
const CANONICAL_PATH = '/corecs/computer-networks-internals-tcpip';

test.describe('networkcosmos smoke', () => {
  test('serves the packet-journey home with platform chrome', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Follow one packet. Understand every layer.' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse the syllabus/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Open the journey lab/ })).toBeVisible();

    await expect(page.getByRole('navigation', { name: /Breadcrumb/ })).toContainText('CSCosmos');
    await expect(page.getByRole('button', { name: /Mark topic complete|Topic completed/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CSCosmos', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('opens the first concept from the 50-link syllabus with its lesson and widget', async ({
    page,
  }) => {
    await page.goto(`${CANONICAL_PATH}/learn`);

    await expect(page.getByRole('heading', { level: 1, name: 'Network syllabus' })).toBeVisible();

    const syllabus = page.getByRole('table', { name: /Concepts in the networks curriculum/ });
    await expect(syllabus.getByRole('row')).toHaveCount(51); // header row + 50 concepts

    await syllabus.getByRole('link', { name: 'Signals & Bit Encoding' }).click();
    await expect(page).toHaveURL(new RegExp(`${CANONICAL_PATH}/learn/signals-and-bits$`));
    await expect(page.getByRole('heading', { level: 1, name: 'Signals & Bit Encoding' })).toBeVisible();

    const lesson = page.getByRole('region', { name: 'Lesson' });
    await expect(lesson.getByRole('heading', { name: 'Why it matters' })).toBeVisible();
    await expect(lesson.getByRole('heading', { name: 'On the wire' })).toBeVisible();
    await expect(lesson.getByRole('heading', { name: 'When it breaks' })).toBeVisible();

    const widget = page.getByRole('region', { name: 'Signal & bit lab' });
    await expect(widget).toBeVisible();
    await expect(widget.getByRole('img', { name: /waveform for bits/ })).toBeVisible();
    await widget.getByRole('button', { name: 'Bit 1 is 1. Toggle it' }).click();
    await expect(widget.getByRole('button', { name: 'Bit 1 is 0. Toggle it' })).toBeVisible();
  });

  test('steps the packet journey and reports an injected ARP-spoof fault', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/lab`);

    await expect(page.getByRole('heading', { level: 1, name: 'Packet journey lab' })).toBeVisible();
    const packetLog = page.getByRole('region', { name: 'Packet log' });
    const events = packetLog.getByRole('list', { name: 'Packet events, newest first' });
    await expect(events.getByText(/No packets yet/)).toBeVisible();

    const step = page.getByRole('button', { name: 'Step to the next hop' });
    await step.click();
    await expect(events.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByText(/Hop \d+ of \d+/)).toBeVisible();

    await page.getByRole('radio', { name: /ARP spoofing/ }).check();
    await expect(page.getByText(/Ready — hop 0 of/)).toBeVisible();

    // The poisoned frame is emitted at the client's outbound Link hop; step
    // until the lab reports it instead of hard-coding the scenario length.
    for (let attempt = 0; attempt < 8 && (await events.getByText(/wrong MAC/).count()) === 0; attempt += 1) {
      await step.click();
    }
    await expect(events.getByText(/wrong MAC/)).toBeVisible();
  });

  test('grades an answer and updates the challenge score', async ({ page }) => {
    await page.goto(`${CANONICAL_PATH}/problems`);

    await expect(page.getByRole('heading', { level: 1, name: 'Wire-level challenges' })).toBeVisible();
    await expect(page.getByText(/Question 1 of 20/)).toBeVisible();
    await expect(page.getByText(/Score: 0 \/ 20/)).toBeVisible();

    await page.getByRole('radio', { name: '192.168.1.255', exact: true }).check();

    await expect(page.getByRole('status').filter({ hasText: /A \/25 mask/ })).toBeVisible();
    await expect(page.getByText(/Score: 1 \/ 20/)).toBeVisible();
  });

  test('switches between dark and light themes', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cscosmos-ui-theme', 'dark');
    });

    await page.goto(CANONICAL_PATH);
    await expect(page.locator('html')).toHaveClass(/dark/);
    const toggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/light/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('does not serve the retired engine route', async ({ request }) => {
    const response = await request.get(`${APP_URL}/computer-networks-internals-tcpip`, {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(404);
    // A distinctive control from the retired engine, not present in a 404 page.
    expect(await response.text()).not.toContain('ssthresh');
  });
});

test.describe('networkcosmos mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the site menu and navigates from it', async ({ page }) => {
    await page.goto(CANONICAL_PATH);

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const closeButton = page.getByRole('button', { name: 'Close menu' });
    await expect(closeButton).toBeVisible();
    const siteNav = page.getByRole('navigation').filter({ has: closeButton });
    await siteNav.getByRole('link', { name: 'Topics', exact: true }).filter({ visible: true }).click();

    await expect(page).toHaveURL(/\/topics$/);
    await expect(page.getByRole('heading', { level: 1, name: 'All Topics' })).toBeVisible();
  });
});
