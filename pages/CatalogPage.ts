import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { testData, urls } from '../appConstants/appConstants';

export class CatalogPage extends BasePage { 
  readonly productTitle: Locator;  
  readonly productCard: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.product__title'); 
    this.productCard = page.locator('.product-item');
  }

  async goToDryCatFood() { //этот метод не нужен 
    await this.openPageWithDirectUrl(urls.catsDryFood); 
  }

  async filterBy(parameter: string): Promise<void> { // здесь нужно вместо переиспользование написять напрямую page.locator().click()
    await this.getFilterLabel(parameter).click();
  }

  async getProductData(productName: string): Promise<{ price: string; pack: string; addToCartButton: Locator }> {
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