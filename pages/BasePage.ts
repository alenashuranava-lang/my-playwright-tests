import { type Locator, type Page, expect } from '@playwright/test';

export class BasePage {
  readonly cookieButton: Locator;
  readonly callWidgetButton: Locator;
  readonly callPopup: Locator;
  readonly closeCallPopupButton: Locator;

  constructor(public readonly page: Page) { //зачем здесь модификаторы?
    this.cookieButton = page.getByRole('button', { name: 'Принять' });
    this.callWidgetButton = page.locator('div.call-open').first();
    this.callPopup = page.locator('div.call-pop');
    this.closeCallPopupButton = this.callPopup.locator('.call-close');
  }

  async openPageWithDirectUrl(url: string) {
    await this.page.goto(url);
  }

  async acceptCookies() { 
    try {
      await this.cookieButton.waitFor();
      await this.cookieButton.click();
    } catch (e) {
      console.log('куки не появилась или не была нажата'); // что не была нажата? не куки а диалог ан принятие куки
    }
  }

  async openCallWidget() {
    await this.callWidgetButton.click();
    await expect(this.callPopup).toBeVisible();
  }

  protected getFilterLabel(title: string): Locator {  //почему этот метод здесь? у тебя фильтровать на любой странице можно?
    return this.page.locator(`label[title="${title}"]`); // перенести в filterBy()
  }
}
