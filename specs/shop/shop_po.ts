import { browser, by, ElementFinder, element, ElementArrayFinder } from 'protractor';

export class ShopPage {
    get title(): ElementFinder { return element(by.className('zsh-h--large')); }
    get products(): ElementArrayFinder {
        return element.all(by.css('.z-lp-shop__products__link .z-lp-shop__products__tile'))
            .filter((elm) => elm.isDisplayed());
    }
    productTab(tabName: string): ElementFinder { return element(by.cssContainingText('.z-js__shop__product-category-tab h3', tabName)); }

    get = async (): Promise<void> => {
        return await browser.driver.get('https://packhelp.com/shop/');
    }

    productsAsJson = async (): Promise<{}[]> => {
        return this.products.map(async (elm) => {
            let product = new ShopProduct(elm);
            return {
                name: await product.name.getText(),
                description: (await product.description.getText()).toLowerCase(), //TODO REMOVE WHEN FIXED
                price: await product.price.getText()
            };
        });
    }
}

export class ShopProduct {
    constructor(public parentElement: ElementFinder) {
    }
    get name(): ElementFinder { return this.parentElement.element(by.className('z-lp-shop__products__type')); }
    get description(): ElementFinder { return this.parentElement.element(by.className('z-lp-shop__products__category')); }
    get price(): ElementFinder { return this.parentElement.element(by.className('z-lp-shop__products__price')); }
}