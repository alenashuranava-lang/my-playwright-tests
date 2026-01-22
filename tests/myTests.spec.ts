import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CartPage } from '../pages/CartPage';

test.beforeEach(async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.goto(); // вместо page.goto('/')
  await mainPage.acceptCookies(); // вместо page.getByText(...).click()
  await expect(page.locator('div.slick-list')).toBeVisible();
});

test.only('Check that start page is loaded on URL opening', async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.openCallWidget();
  await expect(mainPage.callPopup).toBeVisible();
  await expect(mainPage.phoneInput).toHaveAttribute('placeholder', 'Введите номер');
  await mainPage.closeCallPopupButton.click();
  await expect(mainPage.callPopup).not.toBeVisible();
});

test('Check filtering by brand Royal Canin', async ({ page }) => {
  const catalogPage = new CatalogPage(page);
  await catalogPage.goToDryCatFood();
  await catalogPage.filterByRoyalCanin();
  const cardsCount = await catalogPage.productTitles.count();
  expect(cardsCount).toBeGreaterThanOrEqual(13);
  const products = await catalogPage.productTitles.all();
  for (const product of products) {
    expect(await product.innerText()).toContain('Royal Canin');
  }
});

test('Проверка загрузки карточки товара Royal Canin Fussy', async ({ page }) => {
  await page.goto('https://e-zoo.by/catalog/koshki/korm/sukhoy-korm/');
  let firstCard = page.locator('a.product:nth-child(1)'); // переделать на локатор карточки по индексу
  await expect(firstCard).toBeVisible(); // лучше заменить на expect
  const title = (await firstCard.locator('.product__details p.h4').innerText()).split(',')[0];
  const priceText = await firstCard.locator('.price-block').innerText();
  const packText = (await firstCard.locator('p.fasovka').innerText())
    .split(': ')[1]
    .replace(' ', '');
  await firstCard.click();
  const detailTitle = (await page.locator('h1').innerText()).split(',')[0];
  const detailPrice = await page.locator('span.price.big').innerText();
  const bigPack = (await page.locator('h1').innerText()).split(',').slice(1).join(',');
  expect.soft(detailTitle, 'Detail Title is incorrect').toEqual(title);
  expect.soft(detailPrice, 'Detail Price is incorrect').toEqual(priceText);
  expect.soft(bigPack, 'Detail Pack is incorrect').toEqual(packText);
});



test('Verify that the added item is displayed correctly in the cart', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);
    await catalogPage.goToDryCatFood();
    await catalogPage.selectBrand('Royal Canin');
    await catalogPage.selectWeight('0,4 кг');
    const productName = 'Royal Canin Sterilised 37';
    const catalogData = await catalogPage.getProductData(productName);
    await catalogData.addToCartButton.click();
    const deliveryButton = page.locator('button:has-text("Доставка курьером")');
    if (await deliveryButton.isVisible()) {
        await deliveryButton.click();
        await catalogData.addToCartButton.click(); 
    };
    await expect(page.locator('text=Товар добавлен в корзину')).toBeVisible();
    await page.locator('a:has-text("Корзина")').click();
    const basketData = await cartPage.getFirstItemData();
    expect.soft(basketData.price, 'Price mismatch').toBe(catalogData.price);
    expect.soft(basketData.pack, 'Pack mismatch').toBe(catalogData.pack);
});




