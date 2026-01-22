import { Page, Locator } from '@playwright/test';

export class CatalogPage {
    readonly page: Page;
    // Обязательно объявляем productTitles, чтобы исправить ошибку на скриншоте
    readonly productTitles: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitles = page.locator('.product__title'); // используйте ваш селектор заголовков
    }

    // Добавляем метод для перехода на страницу
    async goToDryCatFood() {
        await this.page.goto('https://e-zoo.by/catalog/koshki/korm/sukhoy-korm/');
    }

    // Исправляем ошибку filterByRoyalCanin
    async filterByRoyalCanin() {
        await this.page.locator('label[title="Royal Canin"]').click();
    }

    // Эти методы нужны для вашего нового теста
    async selectBrand(brand: string) {
        await this.page.locator(`label[title="${brand}"]`).click();
    }

    async selectWeight(weight: string) {
        await this.page.locator(`label[title="${weight}"]`).click();
    }

    async getProductData(productName: string) {
        const card = this.page.locator('.product__details', { hasText: productName }).locator('..');
        const priceRaw = await card.locator('.price-block').innerText();
        const packRaw = await card.locator('p.fasovka').innerText();

        return {
            price: priceRaw.trim().split(' ')[0],
            pack: packRaw.split(':')[1].trim(),
            addToCartButton: card.locator('button:has-text("В корзину")')
        };
    }
}