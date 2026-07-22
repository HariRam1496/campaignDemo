import { Page, Locator } from '@playwright/test';

export class ReportsPage {
  readonly page: Page;
  readonly draftCount: Locator;
  readonly scheduledCount: Locator;
  readonly sentCount: Locator;

  constructor(page: Page) {
    this.page = page;
    // Expect the app to expose counts via data-testid attributes or similar selectors.
    this.draftCount = page.locator('[data-testid="reports-draft-count"]');
    this.scheduledCount = page.locator('[data-testid="reports-scheduled-count"]');
    this.sentCount = page.locator('[data-testid="reports-sent-count"]');
  }

  async getDraftCount(): Promise<number> {
    const text = await this.draftCount.innerText();
    return parseInt(text || '0', 10);
  }

  async getScheduledCount(): Promise<number> {
    const text = await this.scheduledCount.innerText();
    return parseInt(text || '0', 10);
  }

  async getSentCount(): Promise<number> {
    const text = await this.sentCount.innerText();
    return parseInt(text || '0', 10);
  }
}
