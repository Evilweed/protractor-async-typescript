import { BasePage } from './basePage';
import { browser, by, $, ElementFinder } from 'protractor';

export class HomePage extends BasePage {
  nameInput: ElementFinder;
  greeting: ElementFinder;

  constructor() {
    super($('body'));
    this.nameInput = this.rootElement.element(by.model('yourName'));
    this.greeting = this.rootElement.element(by.binding('yourName'));
  }

  async get(): Promise<void> {
    return await browser.get('http://www.angularjs.org');
  }

  async setName(name: string): Promise<void> {
    return await this.nameInput.sendKeys(name);
  }

  getGreeting = async (): Promise<string> => await this.greeting.getText();
}
