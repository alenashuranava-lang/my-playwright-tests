import { Page, Locator } from '@playwright/test';

export class CatalogPage {
    readonly page: Page;
    readonly productTitles: Locator;//единственное число
    readonly productCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitles = page.locator('.product__title');
        this.productCard = page.locator('.product-item'); 
    } // должна быть пробельная строка между блоками кода
    private getFilterLabel(title: string): Locator {
        return this.page.locator(`label[title="${title}"]`);
    }//1

    async goToDryCatFood() {
        await this.page.goto('https://e-zoo.by/catalog/koshki/korm/sukhoy-korm/');
    }
    async filterByRoyalCanin() { // этот и следующий метод нужно слить в  один с параметром бренд
        await this.selectBrand('Royal Canin');
    }//2

    async selectBrand(brand: string) {
        await this.getFilterLabel(brand).click();
    }//3

    async selectWeight(weight: string) {
        await this.getFilterLabel(weight).click();
    }//4    заменить 1,2,3,4 на единый метод     async filterBy(parameter: string) {}
    async getProductData(productName: string) { // добавить возвращаемый результат
        const card = this.productCard.filter({ hasText: productName });
        const priceLocator = card.locator('.price-block');
        const packLocator = card.locator('p.fasovka');
        const addToCartButton = card.locator('button:has-text("В корзину")');

        const priceRaw = await priceLocator.innerText();
        const packRaw = await packLocator.innerText();

        return {
            price: priceRaw.trim().split(' ')[0],
            pack: packRaw.split(':')[1]?.trim() || '',
            addToCartButton: addToCartButton
        };
    }
}