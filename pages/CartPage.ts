import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage'; 
import { urls } from '../appConstants/appConstants';
export class CartPage extends BasePage {
  readonly firstItemContainer: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.firstItemContainer = page.locator('.product-basket').first();
    this.firstItemPrice = this.firstItemContainer.locator('.product-basket__price-total');
    this.firstItemTitle = this.firstItemContainer.locator('h4 a');
  }
  
  async open() {
    await this.openPageWithDirectUrl(urls.cart);
  } // ты октрываешь корзину по нажатию на кнопку корзина... тебе не нужен этот метод

  async getFirstItemPrice(): Promise<string> {
    const text = await this.firstItemPrice.innerText();
    return text.trim().split(' ')[0];
  }

  async getFirstItemPack(): Promise<string> {
    const text = await this.firstItemTitle.innerText();
    return text.split(',').slice(1).join(',').trim();
  }

  async getFirstItemData(): Promise<{ price: string; pack: string }> { 
    return {
      price: await this.getFirstItemPrice(),
      pack: await this.getFirstItemPack()
    };
  }
}