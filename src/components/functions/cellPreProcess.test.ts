import { AitCellData } from 'components/ait';
import { cellPreProcess } from './cellPreProcess';

describe('Check cell pre-process', () => {
  const a: AitCellData = {
    text: 'Hello world!',
  };

  test('Check aitid assigned', async () => {
    const b = cellPreProcess([a]);
    expect(b[0].aitid).toBeTruthy();
  });
});
