import { Page,expect, Locator} from '@playwright/test';

export class LoginPage{
 
    readonly page : Page;
    readonly email: Locator
    readonly passowrd : Locator
    readonly loginBtn : Locator
    // readonly logoutMsg : Locator
    constructor( page : Page){
        this.page = page
        this.email = this.page.locator('#loginEmail');
    this.passowrd = this.page.locator('#loginPassword');
    this.loginBtn = this.page.locator('#loginButton');
    // this.logoutMsg = this.page.locator('');
    }
   async navigate(URL: string){
    await this.page.goto(URL, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
   }
   async login(email:string ,password :string){
    await this.email.fill(email);
    await this.passowrd.fill(password);

    let loginButton = this.loginBtn;
    if (await loginButton.count() === 0) {
      loginButton = this.page.getByRole('button', { name: /log ?in|sign ?in|submit/i });
    }
    if (await loginButton.count() === 0) {
      loginButton = this.page.locator('button[type="submit"]');
    }

    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.scrollIntoViewIfNeeded({ timeout: 5000 });
    await loginButton.click({ force: true });
   } 
   async verifyDashboard(){
    await expect(this.page.getByText('Campaign Dashboard')).toBeVisible();
   }
  async verifyError(message : string){
    await expect(this.page.getByText(message)).toBeVisible();
  }

}