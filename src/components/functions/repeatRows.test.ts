import { AioReplacement } from 'components/aio';
import { AitRowData } from 'components/ait';
import { removeUndefined } from './removeUndefined';
import { repeatRows } from './repeatRows';

describe('Check repeat rows', () => {
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

  const replacements: AioReplacement[] = [
    {
      oldText: 'p',
      newTexts: [
        {
          spaceAfter: false,
          texts: ['p1'],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: 's',
      newTexts: [
        {
          spaceAfter: false,
          texts: ['s1', 's2'],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: 't',
      newTexts: [
        {
          spaceAfter: false,
          texts: ['t1', 't2'],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: 'h',
      newTexts: [
        {
          spaceAfter: false,
          texts: ['h1', 'h2'],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
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
    },
    {
      oldText: 'c',
      newTexts: [
        {
          spaceAfter: true,
          texts: ['c!'],
          subLists: [
            {
              oldText: 'v',
              newTexts: [
                {
                  spaceAfter: false,
                  texts: ['!!'],
                  subLists: [],
                },
              ],
              includeTrailing: false,
            },
          ],
        },
      ],
      includeTrailing: false,
    },
  ];

  test('Complex rows', async () => {
    const repeated = repeatRows(rows, replacements, true, false, undefined, [
      { oldText: 'p1', newText: 'p1!' },
    ]);
    expect(removeUndefined(repeated)).toEqual([
      // Row 0
      {
        cells: [
          { text: 'p', rowSpan: 2, repeatRowSpan: 24, replacedText: 'p1!', spaceAfterSpan: 24 },
          { text: 's', rowSpan: 2, repeatRowSpan: 12, replacedText: 's1', spaceAfterSpan: 12 },
          { text: 't', rowSpan: 2, repeatRowSpan: 6, replacedText: 't1', spaceAfterSpan: 6 },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h1', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,0][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 3
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h2', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,1][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,0][0,0][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 6
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 3, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 3, replacedText: '' },
          { text: 't', rowSpan: 2, repeatRowSpan: 6, replacedText: 't2', spaceAfterSpan: 6 },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h1', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,0][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 9
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h2', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,1][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,0][0,1][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 12
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 5, replacedText: '' },
          { text: 's', rowSpan: 2, repeatRowSpan: 12, replacedText: 's2', spaceAfterSpan: 12 },
          { text: 't', rowSpan: 2, repeatRowSpan: 6, replacedText: 't1', spaceAfterSpan: 6 },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h1', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,0][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 15
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h2', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,1][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,1][0,0][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 18
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 3, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 3, replacedText: '' },
          { text: 't', rowSpan: 2, repeatRowSpan: 6, replacedText: 't2', spaceAfterSpan: 6 },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h1', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,0][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,0][0,0][0,0]',
        spaceAfter: true,
      },
      // Row 21
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 1, replacedText: '' },
          { text: 'h', rowSpan: 2, repeatRowSpan: 3, replacedText: 'h2', spaceAfterSpan: 3 },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r1' },
          { text: 'v', rowSpan: 1, replacedText: '0.xxx', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,1][0,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: 'r', rowSpan: 1, repeatRowSpan: 1, replacedText: 'r2' },
          { text: 'v', rowSpan: 1, replacedText: ' ', spaceAfterRepeat: true },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,1][1,0][0,0]',
        spaceAfter: true,
      },
      {
        cells: [
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', colSpan: 1, rowSpan: 0, repeatRowSpan: 0, replacedText: '' },
          { text: '', rowSpan: 0, repeatRowSpan: 0 },
          { text: 'c', rowSpan: 1, repeatRowSpan: 1, replacedText: 'c!', spaceAfterRepeat: true },
          { text: 'v', rowSpan: 1, replacedText: '!!' },
        ],
        rowRepeat: '[0,0][0,1][0,1][0,1][0,0][0,0]',
        spaceAfter: true,
      },
    ]);
  });
});
