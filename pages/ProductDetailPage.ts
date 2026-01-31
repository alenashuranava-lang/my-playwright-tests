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
  async getTitle(): Promise<string> {
    const text = await this.productTitle.textContent();
    return text?.split(',')[0].trim() || '';
  }
  async getPack(): Promise<string> {
    const text = await this.productTitle.textContent();
    const parts = text?.split(',') || [];
    return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
  }
  async getPrice(): Promise<string> {
    const price = await this.productPrice.textContent();
    return price?.trim() || '';
  }
  async getProductData() {
    return {
      title: await this.getTitle(),
      price: await this.getPrice(),
      pack: await this.getPack()
    };
  }
}