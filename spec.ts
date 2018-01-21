import { HomePage } from './page-objects/homePage';
import { RowElement } from './page-objects/Elements/Rows';

describe('angularjs homepage', () => {

  beforeEach(async (): Promise<any> => {
    const angularHomepage = new HomePage();
    await angularHomepage.get();
  });

  it('Try elements pattern', async (): Promise<any> => {
    const rowElement = new RowElement();
    console.log(await rowElement.getList());
    await rowElement.getRowByName('Why AngularJS?');
  });
});
