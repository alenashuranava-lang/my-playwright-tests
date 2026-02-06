import { type Locator, type Page, expect } from '@playwright/test';

export class BasePage {
  readonly cookieButton: Locator;
  readonly callWidgetButton: Locator;
  readonly callPopup: Locator;
  readonly closeCallPopupButton: Locator;

  constructor(public readonly page: Page) {
    this.cookieButton = page.getByRole('button', { name: 'Принять' });
    this.callWidgetButton = page.locator('div.call-open').first();
    this.callPopup = page.locator('div.call-pop');
    this.closeCallPopupButton = this.callPopup.locator('.call-close');
  }

  async openPageWithDirectUrl(url: string) {
    await this.page.goto(url);
  }

  async acceptCookies() { //trycatch
    try {
      await this.cookieButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.cookieButton.click();
    } catch (e) {
      console.log('куки не появилась или не была нажата');
    }
  }

  async openCallWidget() { //звонок
    await this.callWidgetButton.click();
    await expect(this.callPopup).toBeVisible();
  }

  protected getFilterLabel(title: string): Locator {
    return this.page.locator(`label[title="${title}"]`);
  }
}
