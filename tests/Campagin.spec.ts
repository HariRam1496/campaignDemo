import {test} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '@pages/DashBoard';
import { CampaignPage } from '@pages/campagin';
import { campaign } from '@testdata/campaginData';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Login Module',()=>{
    test.beforeEach(async ({page}) =>{
        const login = new LoginPage(page);
        await login.navigate('https://aws-pluto.vuture.dev/qa.html');
        await login.login('qa@example.com','Password@123');
    });
    
    test('Create Campaign',async({page}) =>{
       const dashboard = new DashboardPage(page);
       const cp = new CampaignPage(page);
       await dashboard.openCampagin();
       await cp. createCampaign(campaign.campaignName,campaign.sender,
          campaign.subject,campaign.contactList,campaign.content
       )
       await cp.saveDraft();
       await cp.verifyDraft();
    })
    test('Verify mandatory validation',async({page}) =>{
       const dashboard = new DashboardPage(page);
       const cp = new CampaignPage(page);
       await dashboard.openCampagin();
       
       await cp.saveDraft();
       await cp.verifyValidation();
    })
    test('Verify invalid sender',async({page}) =>{
       const dashboard = new DashboardPage(page);
       const cp = new CampaignPage(page);
       await dashboard.openCampagin();
        await cp. createCampaign(campaign.campaignName,"sample",
          campaign.subject,campaign.contactList,campaign.content
       )
       await cp.saveDraft();
       await cp.verifyError("Sender email is invalid");
    })
    
    
})