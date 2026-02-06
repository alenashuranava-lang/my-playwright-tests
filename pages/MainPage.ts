import { Page, Locator, expect } from '@playwright/test'; //type убрала
import { BasePage } from './BasePage';
import { urls } from '../appConstants/appConstants';

export class MainPage extends BasePage {
  readonly phoneInput: Locator;

  constructor(page: Page) {
    super(page); 
    this.phoneInput = this.callPopup.locator('input[type="tel"], input[type="phone"]');
  }

 async open() {
    await this.openPageWithDirectUrl(urls.mainPage);
  }

  async fillCallbackPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async closeCallPopup() {
    await this.closeCallPopupButton.click();
    await expect(this.callPopup).toBeHidden();
  }
}//вынесла в бейз пэйдж go to ,cookies, openCallwidget