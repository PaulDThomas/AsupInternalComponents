import { AioReplacement } from 'components/aio';
import { AitRowData } from 'components/ait';
import { removeUndefined } from './removeUndefined';
import { replaceRows } from './replaceRows';

describe('Check complex replace rows', () => {
  const rows: AitRowData[] = [
    {
      cells: [
        { text: 'p', rowSpan: 2 },
        { text: 's', rowSpan: 2 },
        { text: 't', rowSpan: 2 },
        { text: 'h', rowSpan: 2 },
        { text: 'r' },
        { text: 'v' },
      ],
    },
    {
      cells: [
        { text: '', rowSpan: 0 },
        { text: '', rowSpan: 0 },
        { text: '', rowSpan: 0 },
        { text: '', rowSpan: 0 },
        { text: 'c' },
        { text: 'v' },
      ],
    },
  ];

  const replacement: AioReplacement = {
    oldText: 'r',
    newTexts: [
      {
        spaceAfter: false,
        texts: ['r1'],
        subLists: [
          {
            oldText: 'v',
            newTexts: [
              {
                spaceAfter: true,
                texts: ['0.xxx'],
                subLists: [],
              },
            ],
            includeTrailing: false,
          },
        ],
      },
      {
        spaceAfter: false,
        texts: ['r2'],
        subLists: [
          {
            oldText: 'v',
            newTexts: [
              {
                spaceAfter: true,
                texts: [' '],
                subLists: [],
              },
            ],
            includeTrailing: false,
          },
        ],
      },
    ],
    includeTrailing: false,
  };

  test('Complex rows', async () => {
    const repeated = replaceRows(rows, 60, replacement);
    expect(removeUndefined(repeated)).toEqual([
      // Row 0
      {
        cells: [
          { text: 'p', rowSpan: 2, repeatRowSpan: 3 },
          { text: 's', rowSpan: 2, repeatRowSpan: 3 },
          { text: 't', rowSpan: 2, repeatRowSpan: 3 },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0]',
      },
      {
        cells: [
          { text: '', colWidth: 60, colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colWidth: 60, colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colWidth: 60, colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colWidth: 60, colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[1,0][0,0]',
      },
      {
        cells: [
          { text: '', rowSpan: 0 },
          { text: '', rowSpan: 0 },
          { text: '', rowSpan: 0 },
          { text: '', rowSpan: 0 },
          { text: 'c' },
          { text: 'v' },
        ],
      },
    ]);
  });
});
