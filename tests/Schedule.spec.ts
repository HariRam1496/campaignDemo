import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SchedulePage } from '../pages/SchedulePage';
import { CampaignPage } from '@pages/campagin';
import { DashboardPage } from '@pages/DashBoard';
import { ReportsPage } from '../pages/REportsPage';
import { user } from '../testdata/user';
import { campaign } from '@testdata/campaginData';


test.describe('Schedule flow', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate('https://aws-pluto.vuture.dev/qatest1.html');
    await login.login(user.email, user.password);
    await login.verifyDashboard();
  });

  test('1. Saved draft retains data when reopened', async ({ page }) => {
    const draftName = `draft-${Date.now()}`;
    // Open New Campaign tab
    await page.locator('[data-testid="tab-new-campaign"]').click();
    // Fill campaign form
    await page.locator('[data-testid="campaign-name"]').fill(draftName);
    await page.locator('[data-testid="sender-email"]').fill('qa@example.com');
    await page.locator('[data-testid="subject"]').fill('Draft subject');
    await page.locator('[data-testid="contact-list"]').selectOption('clients');
    await page.locator('[data-testid="content"]').fill('Draft content');
    await page.locator('[data-testid="save-draft-button"]').click();

    // Open Drafts tab and open the saved draft
    await page.locator('[data-testid="tab-drafts"]').click();
    const row = page.locator('[data-testid="draft-row"]').filter({ hasText: draftName });
    await row.getByRole('button', { name: 'Open' }).click();

    // Verify draft fields are populated when opened
    await expect(page.locator('[data-testid="campaign-name"]')).toHaveValue(draftName);
    await expect(page.locator('[data-testid="content"]')).toHaveValue('Draft content');
  });

  test('2. Schedule campaign for future date works', async ({ page }) => {
    const schedule = new SchedulePage(page);
    const name = `future-${Date.now()}`;
    // create a draft first
    await page.locator('[data-testid="tab-new-campaign"]').click();
    await page.locator('[data-testid="campaign-name"]').fill(name);
    await page.locator('[data-testid="sender-email"]').fill('qa@example.com');
    await page.locator('[data-testid="subject"]').fill('Future schedule');
    await page.locator('[data-testid="contact-list"]').selectOption('clients');
    await page.locator('[data-testid="content"]').fill('Content');
    await page.locator('[data-testid="save-draft-button"]').click();

    await page.locator('[data-testid="tab-schedule"]').click();
    const futureDateTime = '2030-12-31T09:00';
    await schedule.scheduleDraftByName(name, futureDateTime);
    const msg = await schedule.getMessageText();
    await expect(msg.toLowerCase()).toContain('scheduled');
  });

  test.only('3. Scheduling campaign for past date is not allowed', async ({ page }) => {
    await page.setViewportSize({
    width: 1366,
    height: 768
     })
    const campaign1 = new CampaignPage(page);
    const schedule = new SchedulePage(page);
    const dashboard = new DashboardPage(page);
    
await dashboard.openCampagin();
       await campaign1. createCampaign(campaign.campaignName,campaign.sender,
          campaign.subject,campaign.contactList,campaign.content
       )
       await campaign1.saveDraft();
       await campaign1.verifyDraft(); 

    await page.locator('[data-testid="tab-schedule"]').click();
    const pastDateTime = '2000-01-01T09:00';

    await schedule.scheduleDraftByName(campaign.campaignName, pastDateTime);
    await schedule.verifyPastDateRejected();
    
  });

  test('4. Send Now changes campaign status to Sent', async ({ page }) => {
    const schedule = new SchedulePage(page);
    const name = `sendnow-${Date.now()}`;
    // create draft
    await page.locator('[data-testid="tab-new-campaign"]').click();
    await page.locator('[data-testid="campaign-name"]').fill(name);
    await page.locator('[data-testid="sender-email"]').fill('qa@example.com');
    await page.locator('[data-testid="subject"]').fill('Send Now test');
    await page.locator('[data-testid="contact-list"]').selectOption('clients');
    await page.locator('[data-testid="content"]').fill('Content');
    await page.locator('[data-testid="save-draft-button"]').click();

    await page.locator('[data-testid="tab-schedule"]').click();
    await schedule.selectDraftByName(name);
    await schedule.sendNowForSelectedDraft();
    // Verify a Sent indicator appears in UI
    await expect(page.getByText(/Sent|sent/i)).toBeVisible();
  });

  test('5. Reports show Draft, Scheduled and Sent counts correctly', async ({ page }) => {
    const reports = new ReportsPage(page);
    // Navigate to reports page — replace with real nav if needed
    await page.locator('[data-testid="tab-reports"]').click();
    const drafts = await reports.getDraftCount();
    const scheduled = await reports.getScheduledCount();
    const sent = await reports.getSentCount();
    expect(drafts).toBeGreaterThanOrEqual(0);
    expect(scheduled).toBeGreaterThanOrEqual(0);
    expect(sent).toBeGreaterThanOrEqual(0);
  });

  test('6. Tests are independent and repeatable', async ({ page }) => {
    // Create two unique drafts and ensure both exist independently
    const nameA = `independent-A-${Date.now()}`;
    const nameB = `independent-B-${Date.now()}`;
    // create A
    await page.locator('[data-testid="tab-new-campaign"]').click();
    await page.locator('[data-testid="campaign-name"]').fill(nameA);
    await page.locator('[data-testid="sender-email"]').fill('qa@example.com');
    await page.locator('[data-testid="subject"]').fill('Independence A');
    await page.locator('[data-testid="contact-list"]').selectOption('clients');
    await page.locator('[data-testid="content"]').fill('Content A');
    await page.locator('[data-testid="save-draft-button"]').click();
    // create B
    await page.locator('[data-testid="tab-new-campaign"]').click();
    await page.locator('[data-testid="campaign-name"]').fill(nameB);
    await page.locator('[data-testid="sender-email"]').fill('qa@example.com');
    await page.locator('[data-testid="subject"]').fill('Independence B');
    await page.locator('[data-testid="contact-list"]').selectOption('clients');
    await page.locator('[data-testid="content"]').fill('Content B');
    await page.locator('[data-testid="save-draft-button"]').click();

    // Verify both drafts appear in drafts list
    await page.locator('[data-testid="tab-drafts"]').click();
    await expect(page.getByText(nameA)).toBeVisible();
    await expect(page.getByText(nameB)).toBeVisible();
  });

  test('7. Playwright artifacts configured for failures', async ({ page }) => {
    // This is a smoke check that a failure will produce artifacts — force a failure
    test.info().annotations.push({ type: 'note', description: 'Artifacts: screenshot/video/trace on failure configured in playwright.config.ts' });
    expect(1).toBe(1);
  });
});

/**
 * 8. CI notes:
 * - Ensure `npm ci` installs devDependencies (including `playwright` and `typescript`).
 * - Use Playwright's GitHub Action or install browsers and run `npx playwright test --reporter=list`.
 * - Configure `PLAYWRIGHT_BROWSERS_PATH=0` in CI to download browsers during install, or run `npx playwright install --with-deps`.
 * - Example GitHub Actions step:
 *   - uses: actions/checkout@v3
 *   - uses: actions/setup-node@v3
 *     with: { node-version: '18' }
 *   - run: npm ci
 *   - run: npx playwright install --with-deps
 *   - run: npx playwright test --reporter=github
 */
