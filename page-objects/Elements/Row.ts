import { $, ElementFinder } from 'protractor';
import { Elements } from './Elements';

export interface ListRowValue {
  [index: number]: {
    title?: string;
    body?: string;
  };
}
interface RowValue {
    title?: string;
    body?: string;
}

export class Row extends Elements {
  static titleRow : string = '.text-display-1';
  static bodyRow: string =  '.text-body';

  constructor(rootElement: ElementFinder) {
    super(rootElement);
  }

  async getDetails(): Promise<RowValue> {
    return {
      title: await this.rootElement.$(Row.titleRow).getText(),
      body: await this.rootElement.$(Row.bodyRow).getText()
    };
  }
}