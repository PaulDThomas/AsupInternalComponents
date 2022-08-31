import { AitRowGroupData } from 'components/ait';
import { bodyPreProcess } from './bodyPreProcess';
import { newRow } from './newRow';

describe('Check body pre-process', () => {
  const a: AitRowGroupData = {
    rows: [newRow()],
  };

  test('Check aitid assigned', async () => {
    const b = bodyPreProcess([a]);
    expect(b[0].aitid).toBeTruthy();
  });
});
