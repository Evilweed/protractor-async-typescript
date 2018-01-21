import { protractor } from 'protractor';
import { browser, ElementFinder, ProtractorExpectedConditions } from 'protractor';

const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

export class Elements {
  protected rootElement: ElementFinder;

  protected constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async waitFor(elm: ElementFinder): Promise<any> {
    return await browser.wait(EC.visibilityOf(elm), 5000);
  }

}
