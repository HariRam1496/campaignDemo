import{Page,Locator,expect} from '@playwright/test';
export class CampaignPage{
    readonly page : Page;
    readonly campaignName :Locator;
    readonly sender : Locator;
    readonly subject : Locator;
    readonly contactList : Locator;
    readonly content : Locator;
    readonly saveBtn : Locator;
    readonly previewBtn : Locator;

    constructor(page :Page){
        this.page = page;
        this.campaignName = page.locator('#campaignName');
        this.sender = page.locator('#senderEmail');
        this.subject = page.locator('#subject');
        this.contactList = page.locator('#contactList');
        this.content = page.locator('#content');
        this.saveBtn = page.locator('#saveDraftButton');
        this.previewBtn = page.locator('#previewButton');

    }
    async createCampaign(name:string,sender:string,subject:string,list : string,content:string){
        await this.campaignName.fill(name);
        await this.sender.fill(sender);
        await this.subject.fill(subject);
        await this.contactList.selectOption(list);
        await this.content.fill(content);

    }
    async saveDraft(){
        await this.saveBtn.click();

    }async preview(){
        await this.previewBtn.click();
    }
    async verifyDraft(){
        await expect(this.page.locator('#campaignMessage')).toBeVisible();
    }
    async verifyValidation(){
        await expect(this.page.getByText('All required campaign fields must be completed')).toBeVisible();
    }
    async verifyError(message : string){
    await expect(this.page.getByText(message)).toBeVisible();
  }
}