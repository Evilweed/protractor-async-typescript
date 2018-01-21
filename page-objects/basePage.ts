import { ElementFinder } from 'protractor';

export class BasePage {
  protected rootElement: ElementFinder;

  protected constructor(rootElement) {
    this.rootElement = rootElement;
  }
}
