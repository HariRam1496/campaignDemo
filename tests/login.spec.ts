import {test} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Login Module',()=>{
    test.beforeEach(async ({page}) =>{
        const login = new LoginPage(page);
        await login.navigate('https://aws-pluto.vuture.dev/qa.html');
    });
    test('Verify successful login',async({page})=>{
       const loginPage= new LoginPage(page);
       await loginPage.login('qa@example.com','Password@123');
       await loginPage.verifyDashboard();
    });
    test('Invalid login',async({page}) =>{
        const loginPage = new LoginPage(page);
        await loginPage.login('abc@test.com','pass123');
        await loginPage.verifyError("invalid email or password");
    })
    test('Verify empty login',async({page}) =>{
        const loginPage = new LoginPage(page);
        await loginPage.login("","");
        await loginPage.verifyError("Email and password are required");
    })
})