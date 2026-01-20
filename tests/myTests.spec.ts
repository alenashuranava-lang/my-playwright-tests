import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(
    'Зоомагазин в Минске — Купить зоотовары для животных в зоомаркете — e-zoo.by',
  );
  await page.getByText(/^Принять$/).click();
  await expect(page.locator('div.slick-list')).toBeVisible();
});

test.only('Check that start page is loaded on URL opening', async ({ page }) => {
  //await page.getByRole('img', { name: 'ezoo - товары для животных' }).click();
  await page.locator('div.call-open').first().click();
  await expect(page.locator('div.call-pop')).toBeVisible();
  await expect(page.locator('a.link:has-text("7255")')).toBeVisible();
  await expect(page.locator('div.call_me').locator('p:has-text("Перезвоните мне")')).toBeVisible();
  await expect(page.locator('div.call_me').locator('p:has-text("Позвонить")')).toBeVisible();
  await expect(page.locator('div.call-pop')).toContainText('7255');
  await expect(page.locator('div.call_me').locator('input[type=phone]')).toHaveAttribute(
    'placeholder',
    'Введите номер',
  );
  await expect(page.locator('div.call_me').locator('button.button')).toHaveText('Заказать звонок');
  await page.locator('div.call-close').click();
  await expect(page.locator('div.call-pop')).not.toBeVisible();
});

test('Check filtering by brend Royal Canin', async ({ page }) => {
  await page.getByRole('img', { name: 'ezoo - товары для животных' }).click();
  await page.locator('.animals-filter-fixed #cat').click();
  await page
    .locator('[class*="products-list"]:has-text("Корм")')
    .getByRole('link', { name: 'Сухой корм', exact: true })
    .click();
  await page.locator('label[title="Royal Canin"]').click();
  await page.waitForLoadState();
  await page.locator('.product__info p.h4').first().waitFor({ state: 'visible' });
  const cards = await page.locator('.product__info p.h4').count();
  expect(cards).toBeGreaterThanOrEqual(13);
  // const expectedCount = 13;
  // console.log(`Ожидаемое количество продуктов: ${expectedCount}`);
  // await expect(page.locator('.product__info p.h4')).toHaveCount(14);
  const products = await page.locator('.product__info p.h4').all();
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


test('Verify that the added item is displayed correctly in the cart and added to cart', async ({ page }) => {
  await page.goto('https://e-zoo.by/catalog/koshki/korm/sukhoy-korm/');
  await page.locator('label[title="Royal Canin"]').click();
  await page.locator('label[title="0,4 кг"]').click();
  const productCard = page.locator('.product__details:has-text("Royal Canin Sterilised 37")').locator('..');
  // const catalogPrice = (await productCard.locator('.price-block').first().innerText()).replace(/[^\d]/g, '').trim(); 
  const catalogPrice = (await productCard.locator('.price-block').innerText()).trim().split(' ')[0];
  const catalogPack = (await productCard.locator('p.fasovka').innerText()).split(':')[1].replace(' ', '');
  await productCard.locator('button:has-text("В корзину")').click(); 
  await page.locator('button:has-text("Доставка курьером")').click();
  await productCard.locator('button:has-text("В корзину")').click();
  await expect(page.locator('text=Товар добавлен в корзину')).toBeVisible();
  await page.locator('a:has-text("Корзина")').click();
  const itemInBasketLocator = page.locator('.product-basket').first();
  // const receivedPrice = (await itemInBasketLocator.locator('.product-basket__price-total').innerText()).replace(/[^\d]/g, '').trim();
  const receivedPrice = (await itemInBasketLocator.locator('.product-basket__price-total').innerText()).trim().split(' ')[0];
  const basketPack = (await itemInBasketLocator.locator('h4 a').innerText()).split(',').slice(1).join(',').trim()
  expect.soft(receivedPrice, 'Price mismatch').toBe(catalogPrice);
  expect.soft(basketPack, 'Pack mismatch').toBe(catalogPack);
});




