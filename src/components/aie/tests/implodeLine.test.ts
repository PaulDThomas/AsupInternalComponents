import { iStyleBlock } from '../functions/aieInterface';
import { implodeLine } from '../functions/implodeLine';

describe('Test implodeLine', () => {
  const styleBlocks: iStyleBlock[] = [
    { start: 0, end: 1, styleName: undefined },
    { start: 1, end: 2, styleName: 'red' },
    { start: 2, end: 3, styleName: 'green' },
    { start: 13, end: 17, styleName: undefined },
    { start: 4, end: 5, styleName: 'blue' },
    { start: 5, end: 7, styleName: 'blue' },
    { start: 7, end: 8, styleName: undefined },
    { start: 3, end: 4, styleName: 'blue' },
    { start: 8, end: 12, styleName: undefined },
    { start: 12, end: 13, styleName: 'purple' },
    { start: 14, end: 23, styleName: undefined },
  ];

  test('Brought together correctly', async () => {
    expect(implodeLine(styleBlocks)).toEqual([
      { start: 0, end: 1, styleName: undefined },
      { start: 1, end: 2, styleName: 'red' },
      { start: 2, end: 3, styleName: 'green' },
      { start: 3, end: 7, styleName: 'blue' },
      { start: 7, end: 12, styleName: undefined },
      { start: 12, end: 13, styleName: 'purple' },
      { start: 13, end: 23, styleName: undefined },
    ]);
  });
});
