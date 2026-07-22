import{Page,Locator,expect} from '@playwright/test';

export class DashboardPage{
    readonly page :Page;
    readonly newCampaign : Locator;
    readonly drafts : Locator;
    readonly schedule : Locator;
    readonly reports : Locator;

    constructor(page :Page){
        this.page =page;
        this.newCampaign = page.locator('#newCampaignTab');
        this.drafts = page.locator('#draftsTab');
        this.schedule = page.locator('#scheduleTab');
        this.reports = page.locator('#reportsTab')
    }
    async openCampagin(){
        await this.newCampaign.click();

    }
    async openDrafts(){
        await this.drafts.click();
    }
    async openSchedule(){
        await this.schedule.click();
    }
    async openReports(){
        await this.reports.click();
    }
}