import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage'; //basePage added
import { testData, urls } from '../appConstants/appConstants';

export class CatalogPage extends BasePage { //наследование
  readonly productTitle: Locator; // ед число
  readonly productCard: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.product__title'); // ед число
    this.productCard = page.locator('.product-item');
  }//пробел добавоен

  async goToDryCatFood() {
    await this.openPageWithDirectUrl(urls.catsDryFood); //доделала реальная сслыка лежит в appConstants.ts и BasePage
  }

  // async filterByRoyalCanin(): Promise<void> {
  //   await this.applyFilter(testData.brandRoyalCanin);//здесь не ругайся просто попробовала применить appConstants побольше
  // }
  async filterBy(parameter: string): Promise<void> { //+
    await this.getFilterLabel(parameter).click();
  }

  async getProductData(productName: string): Promise<{ price: string; pack: string; addToCartButton: Locator }> {//добавлен рез
    const card = this.productCard.filter({ hasText: productName });
    const priceRaw = await card.locator('.price-block').innerText();
    const packRaw = await card.locator('p.fasovka').innerText();

    return {
      price: priceRaw.trim().split(' ')[0],
      pack: packRaw.split(':')[1]?.trim() || '',
      addToCartButton: card.locator('button:has-text("В корзину")')
    };
  }
}