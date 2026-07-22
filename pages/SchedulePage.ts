
import { Page, Locator, expect } from '@playwright/test';

export class SchedulePage {
	readonly page: Page;
	readonly selectDraft: Locator;
	readonly dateTimeInput: Locator;
	readonly scheduleButton: Locator;
	readonly sendNowButton: Locator;
	readonly message: Locator;
	readonly draftTableBody: Locator;
    readonly scheduleTabBtn : Locator;
    readonly campaigndraftSelection : Locator;
	readonly scheduleDateTimeSelect : Locator;
    readonly scheduleBtnCLk : Locator;
	constructor(page: Page) {
		this.page = page;
		this.selectDraft = page.locator('[data-testid="schedule-campaign"]');
		this.dateTimeInput = page.locator('[data-testid="schedule-date"]');
		this.scheduleButton = page.locator('[data-testid="schedule-button"]');
		this.sendNowButton = page.locator('[data-testid="send-now-button"]');
		this.message = page.locator('[data-testid="schedule-message"]');
		this.draftTableBody = page.locator('[data-testid="draft-table-body"]');
        this.scheduleTabBtn = page.getByTestId('tab-schedule');
        this.campaigndraftSelection = page.locator('schedule-campaign');
		this.scheduleDateTimeSelect = page.getByTestId('schedule-date');
		this.scheduleBtnCLk = page.getByRole('button', {name: 'Schedule'});
	}

	async clkScheduleBtn() {

		await this.scheduleTabBtn.click();
	}

	async campaignDraftSelectOption(Label: string) {
    await this.campaigndraftSelection.selectOption({label: Label})
	}
    
	async toSelectDate(Date: string) {
         
		await this.scheduleDateTimeSelect.click();
		await this.scheduleDateTimeSelect.fill(Date);
		 
	}
	async getAvailableDraftNames(): Promise<string[]> {
		const options = await this.selectDraft.locator('option').allTextContents();
		return options.map(s => s.trim()).filter(s => s && !s.startsWith('--'));
	}

	async selectDraftByName(name: string): Promise<void> {
		await this.selectDraft.selectOption({ label: name });
	}

	async scheduleSelectedDraft(dateTimeLocal: string): Promise<void> {
		await this.dateTimeInput.fill(dateTimeLocal);
		await this.scheduleButton.click();
	}

	async scheduleDraftByName(name: string, dateTimeLocal: string): Promise<void> {
		await this.selectDraftByName(name);
		await this.scheduleSelectedDraft(dateTimeLocal);
	}

	async sendNowForSelectedDraft(): Promise<void> {
		await this.sendNowButton.click();
	}

	async getMessageText(): Promise<string> {
		return (await this.message.innerText()).trim();
	}

	async isScheduleButtonEnabled(): Promise<boolean> {
		return await this.scheduleButton.isEnabled();
	}

	async isSendNowEnabled(): Promise<boolean> {
		return await this.sendNowButton.isEnabled();
	}

	async verifyPastDateRejected(): Promise<void> {
		const text = (await this.message.innerText()).toLowerCase();
		if (!/past|invalid|cannot|not allowed|error/.test(text)) {
			throw new Error('Expected validation message for past date not found');
		}
		if (/(scheduled|sent|accepted|success)/.test(text)) {
			throw new Error('Unexpected acceptance message for past date scheduling');
		}
	}

	// async verifyInvalidYear(date: string) {
        
	// 	await this.scheduleDateTimeSelect()
        
	// }
}


