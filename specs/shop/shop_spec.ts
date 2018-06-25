import { ShopPage } from './shop_po';
import { PRODUCT_TYPE, PRODUCTS } from '../../test_data/products_data';

describe('Shop page', () => {
    let shopPage: ShopPage;

    beforeAll(async (): Promise<any> => {
        shopPage = new ShopPage();

        await shopPage.get();
    });

    it('has title', async () => {
        let title: string = await shopPage.title.getText();
        expect(title).toBe('Shop');
    });

    it('has proper product count', async () => {
        let productsCount: number = await shopPage.products.count();
        expect(productsCount).toBe(11);
    });

    describe('Product tabs', () => {
        describe('All products', () => {
            beforeAll(async (): Promise<any> => {
                await shopPage.productTab('All products').click();
            });

            it('has proper product count', async () => {
                let productsCount: number = await shopPage.products.count();
                expect(productsCount).toBe(11);
            });

            it('has products', async () => {
                let productList = await shopPage.productsAsJson();
                PRODUCTS.forEach(async (product) => {
                    product.description = product.description.toLowerCase(); //TODO REMOVE WHEN FIXED
                    await expect(productList).toContain(product);
                });
            });
        });

        describe('Mailer box', () => {
            beforeAll(async (): Promise<any> => {
                await shopPage.productTab('Mailer box').click();
            });

            it('has proper product count', async () => {
                let productsCount: number = await shopPage.products.count();
                expect(productsCount).toBe(5);
            });

            it('has products', async () => {
                let productList = await shopPage.productsAsJson();
                let mailerBoxProducts = PRODUCTS.filter((product) => product.description === PRODUCT_TYPE.MAILER_BOX);
                mailerBoxProducts.forEach(async (product) => {
                    product.description = product.description.toLowerCase(); //TODO REMOVE WHEN FIXED
                    await expect(productList).toContain(product);
                });
            });
        });
    });

});
