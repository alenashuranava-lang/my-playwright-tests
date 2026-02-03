import { Page, Locator } from '@playwright/test';
export class CartPage {
    readonly page: Page;
    readonly firstItemContainer: Locator;
    readonly firstItemPrice: Locator;
    readonly firstItemTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstItemContainer = page.locator('.product-basket').first();
        this.firstItemPrice = this.firstItemContainer.locator('.product-basket__price-total');
        this.firstItemTitle = this.firstItemContainer.locator('h4 a');
    }  //должна быть пробельная строка между блоками кода
    async getFirstItemPrice(): Promise<string> {
        const text = await this.firstItemPrice.innerText();
        return text.trim().split(' ')[0];
    }
    async getFirstItemPack(): Promise<string> {
        const text = await this.firstItemTitle.innerText();
        return text.split(',').slice(1).join(',').trim();
    }
    async getFirstItemData() {  //добавить возвращаемый результат
        return {
            price: await this.getFirstItemPrice(),
            pack: await this.getFirstItemPack()
        };
    }
}