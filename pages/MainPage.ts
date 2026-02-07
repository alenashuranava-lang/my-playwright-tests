import { Page, Locator, expect } from '@playwright/test'; 
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
}