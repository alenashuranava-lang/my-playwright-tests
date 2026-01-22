import { Page, Locator } from '@playwright/test';
export class CartPage {
    readonly page: Page;
    readonly firstItemInBasket: Locator;
    constructor(page: Page) {
        this.page = page;
        this.firstItemInBasket = page.locator('.product-basket').first();
    }
    async getFirstItemData() {
        // Ищем элементы ВНУТРИ найденной плитки товара
        const priceLocator = this.firstItemInBasket.locator('.product-basket__price-total');
        const titleLocator = this.firstItemInBasket.locator('h4 a');

        const priceRaw = await priceLocator.innerText();
        const titleRaw = await titleLocator.innerText();

        return {
            // Очищаем цену (берем только число до пробела)
            price: priceRaw.trim().split(' ')[0],
            // Очищаем фасовку (берем текст после первой запятой)
            pack: titleRaw.split(',').slice(1).join(',').trim()
        };
    }
}