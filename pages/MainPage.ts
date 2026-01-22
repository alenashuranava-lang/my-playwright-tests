import { type Locator, type Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly cookieButton: Locator;
  readonly callWidgetButton: Locator;
  readonly callPopup: Locator;
  readonly phoneInput: Locator;
  readonly closeCallPopupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieButton = page.getByText(/^Принять$/);
    this.callWidgetButton = page.locator('div.call-open').first();
    this.callPopup = page.locator('div.call-pop');
    this.phoneInput = page.locator('div.call_me').locator('input[type=phone]');
    this.closeCallPopupButton = page.locator('div.call-close');
  }

  async goto() {
    await this.page.goto('/');
  }

  async acceptCookies() {
    await this.cookieButton.click();
  }

  async openCallWidget() {
    await this.callWidgetButton.click();
  }
}