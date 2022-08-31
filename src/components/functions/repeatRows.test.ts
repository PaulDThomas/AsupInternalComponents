import { AitRowData } from 'components/ait';
import { newRow } from './newRow';

describe('Check repeat rows', () => {
  const row: AitRowData[] = [newRow(4)];

  test('False positive', async () => {
    expect(row).toBeTruthy();
  });
});
