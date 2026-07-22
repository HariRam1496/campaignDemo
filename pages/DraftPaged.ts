import {Page,Locator,expect} from '@playwright/test';

export class DraftPage{
    readonly page :Page;
    readonly firstDraft : Locator;
    readonly openBtn : Locator;

    constructor(page:Page){
        this.page = page;
        this.firstDraft = page.locator('').first();
        this.openBtn = page.getByRole('button',{name :''});
    }
    async openFirstDraft(){
        await this.firstDraft.click();
    }async verifyDraftOpened(){
        await expect(this.page.getByText('')).toBeVisible();
    }
}