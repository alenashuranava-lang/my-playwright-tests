import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage'; //сделана бэйзпэджа, путь added
import { urls } from '../appConstants/appConstants';

export class CartPage extends BasePage { //наследование
  readonly firstItemContainer: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.firstItemContainer = page.locator('.product-basket').first();
    this.firstItemPrice = this.firstItemContainer.locator('.product-basket__price-total');
    this.firstItemTitle = this.firstItemContainer.locator('h4 a');//пробельная строка -done
  }
  
  async open() {
    await this.openPageWithDirectUrl(urls.cart);
  }

  async getFirstItemPrice(): Promise<string> {
    const text = await this.firstItemPrice.innerText();
    return text.trim().split(' ')[0];
  }

  async getFirstItemPack(): Promise<string> {
    const text = await this.firstItemTitle.innerText();
    return text.split(',').slice(1).join(',').trim();
  }

  async getFirstItemData(): Promise<{ price: string; pack: string }> { //возвращ результат добавлено
    return {
      price: await this.getFirstItemPrice(),
      pack: await this.getFirstItemPack()
    };
  }
}