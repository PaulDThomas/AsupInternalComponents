import { AitCellData } from 'components/ait';
import { cellPreProcess } from './cellPreProcess';

describe('Check cell pre-process', () => {
  const a: AitCellData = {
    text: 'Hello world!',
  };

  test('Check aitid assigned', async () => {
    const b = cellPreProcess(60, [a]);
    expect(b[0].aitid).toBeTruthy();
    expect(b[0].colWidth).toEqual(60);
    expect(b[0].colSpan).toEqual(1);
    expect(b[0].rowSpan).toEqual(1);
  });
});
