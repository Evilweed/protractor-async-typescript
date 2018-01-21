import { $, $$, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise as wdpromise } from 'selenium-webdriver';
import { Elements } from './Elements';
import { Row, ListRowValue } from './Row';

export class RowElement extends Elements {
  listRow: ElementArrayFinder;

  constructor() {
    super($('.first'));
    this.listRow = this.rootElement.$$('.span4');
  }

  async getList(): Promise<ListRowValue> {
    await this.waitFor(this.rootElement);
    let listRow: ListRowValue = await this.listRow.map(async (item: ElementFinder): Promise<any> => {
      return {
        title: await item.$(Row.titleRow).getText(),
        body: await item.$(Row.bodyRow).getText()
      };
    });
    return listRow;
  }

  async getRowByName(name: string): Promise<Row> {
    // Error of type of async describe here https://github.com/angular/protractor/issues/4049#issuecomment-278809243
    let rowList: Array<ElementFinder> = await this.listRow.filter(async (item: ElementFinder): boolean | wdpromise.Promise<boolean> => {
      return await item.$('.text-display-1').getText() === name ? item : false;
    });
    if (rowList.length <= 0) {
      throw Error (`Cant find row with title -> "$(name)"`);
    }
    let row : Row = new Row( rowList[0]);
    console.log('----');
    console.log(await row.getDetails());
    return row;
  }
}
