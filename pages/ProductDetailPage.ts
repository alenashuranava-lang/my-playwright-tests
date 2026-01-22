import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('h1');
    this.productPrice = page.locator('span.price.big');
  }

  
  async getProductData() {
    const fullTitleText = await this.productTitle.innerText();
    const priceText = await this.productPrice.innerText();

    const titleParts = fullTitleText.split(',');
    
    return {
      title: titleParts[0].trim(),
      price: priceText.trim(),
      pack: titleParts.slice(1).join(',').trim()
    };
  }
}