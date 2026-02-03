import { type Locator, type Page, expect } from '@playwright/test'; //зачем здесь type?

export class MainPage {
  readonly page: Page;
  readonly cookieButton: Locator;
  readonly callWidgetButton: Locator;
  readonly callPopup: Locator;
  readonly phoneInput: Locator;
  readonly closeCallPopupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieButton = page.getByRole('button', { name: 'Принять' });
    this.callWidgetButton = page.locator('div.call-open').first();
    this.callPopup = page.locator('div.call-pop');
    this.phoneInput = this.callPopup.locator('input[type="tel"], input[type="phone"]');
    this.closeCallPopupButton = this.callPopup.locator('.call-close');
  }

  async goto() { //лучше переименоватьв  open
    await this.page.goto('/');
  }
  async acceptCookies() {  /// перенести на бейс пейдж
    if (await this.cookieButton.isVisible()) { // неудачная реализация, потому что тест завалится если кнопка кук будет показана с опозданием
      await this.cookieButton.click();// попробуй переделать на трай кетч с использованием .waitForVisible();
    }
  }
  async openCallWidget() { // вынести на бес пейдж
    await this.callWidgetButton.click();
    await expect(this.callPopup).toBeVisible(); 
  }
  async fillCallbackPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async closeCallPopup() {
    await this.closeCallPopupButton.click();
    await expect(this.callPopup).toBeHidden();
  }
}