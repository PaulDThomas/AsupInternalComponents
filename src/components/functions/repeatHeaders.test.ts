import { AioExternalSingle, AioReplacement } from 'components/aio';
import { AitRowData } from 'components/ait';
import { AitRowType } from 'components/ait/aitInterface';
import { newRow } from './newRow';
import { removeUndefined } from './removeUndefined';
import { repeatHeaders } from './repeatHeaders';

describe('Check repeatHeaders', () => {
  const rows: AitRowData[] = [newRow(3, AitRowType.header)];
  for (let i = 0; i++; i < 3) {
    rows[0].cells[i].text = `Cell ${i}`;
  }

  test('Basic checks', () => {
    const postProcess = repeatHeaders(rows, [], true, 0, [], []);
    expect(postProcess.rows).toEqual(rows);
    expect(postProcess.columnRepeats).toEqual([
      { columnIndex: 0 },
      { columnIndex: 1 },
      { columnIndex: 2 },
    ]);
  });

  const rowsC1: AitRowData[] = [
    {
      cells: [
        { text: 'r1c1', rowSpan: 3 },
        { text: 'r1c2', colSpan: 4 },
        { text: 'r1c3', colSpan: 0 },
        { text: 'r1c4', colSpan: 0 },
        { text: 'r1c5', colSpan: 0 },
        { text: 'r1c6', colSpan: 4 },
        { text: 'r1c7', colSpan: 0 },
        { text: 'r1c8', colSpan: 0 },
        { text: 'r1c9', colSpan: 0 },
      ],
    },
    {
      cells: [
        { text: 'r2c1', rowSpan: 0 },
        { text: 'r2c2', rowSpan: 2 },
        { text: 'r2c3', colSpan: 2 },
        { text: 'r2c4', colSpan: 0 },
        { text: 'r2c5' },
        { text: 'r2c6', rowSpan: 2 },
        { text: 'r2c7', rowSpan: 2 },
        { text: 'r2c8', rowSpan: 2 },
        { text: 'r2c9', rowSpan: 2 },
      ],
    },
    {
      cells: [
        { text: 'r3c1', rowSpan: 0 },
        { text: 'r3c2', rowSpan: 0 },
        { text: 'r3c3' },
        { text: 'r3c4' },
        { text: 'r3c5' },
        { text: 'r3c6', rowSpan: 0 },
        { text: 'r3c7', rowSpan: 0 },
        { text: 'r3c8', rowSpan: 0 },
        { text: 'r3c9', rowSpan: 0 },
      ],
    },
  ];

  const replacements: AioReplacement[] = [
    {
      oldText: 'r1c2',
      newTexts: [
        {
          texts: ['r1c2-rep1', 'r1c2-rep2'],
          subLists: [
            {
              oldText: 'r3c5',
              newTexts: [
                {
                  texts: ['r3c5-rep1', 'r3c5-rep2'],
                  subLists: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const singleReplacements: AioExternalSingle = {
    oldText: 'r2c9',
    newText: 'r2c9-single',
  };

  const fillerCell1 = {
    colSpan: 0,
    repeatColSpan: 0,
    replacedText: '__filler1',
    rowSpan: 1,
    text: '',
  };

  const fillerCell2 = {
    colSpan: 0,
    repeatColSpan: 0,
    replacedText: '__filler2',
    rowSpan: 1,
    text: '',
  };

  test('Complex header 1', () => {
    const postProcess = repeatHeaders(rowsC1, replacements, false, 1, [], [singleReplacements]);
    expect(postProcess.columnRepeats).toEqual([
      { columnIndex: 0 },
      { columnIndex: 1, colRepeat: '[0,0]' },
      { columnIndex: 2, colRepeat: '[0,0]' },
      { columnIndex: 3, colRepeat: '[0,0]' },
      { columnIndex: 4, colRepeat: '[0,0][0,0]' },
      { columnIndex: 4, colRepeat: '[0,0][0,1]' },
      { columnIndex: 1, colRepeat: '[0,1]' },
      { columnIndex: 2, colRepeat: '[0,1]' },
      { columnIndex: 3, colRepeat: '[0,1]' },
      { columnIndex: 4, colRepeat: '[0,1][0,0]' },
      { columnIndex: 4, colRepeat: '[0,1][0,1]' },
      { columnIndex: 5 },
      { columnIndex: 6 },
      { columnIndex: 7 },
      { columnIndex: 8 },
    ]);
    expect(removeUndefined(postProcess.rows)).toEqual([
      {
        cells: [
          { text: 'r1c1', rowSpan: 3 },
          { text: 'r1c2', colSpan: 4, replacedText: 'r1c2-rep1', repeatColSpan: 5 },
          { text: 'r1c3', colSpan: 0 },
          { text: 'r1c4', colSpan: 0 },
          { text: 'r1c5', colSpan: 0 },
          fillerCell1,
          { text: 'r1c2', colSpan: 4, replacedText: 'r1c2-rep2', repeatColSpan: 5 },
          { text: 'r1c3', colSpan: 0 },
          { text: 'r1c4', colSpan: 0 },
          { text: 'r1c5', colSpan: 0 },
          fillerCell1,
          { text: 'r1c6', colSpan: 4 },
          { text: 'r1c7', colSpan: 0 },
          { text: 'r1c8', colSpan: 0 },
          { text: 'r1c9', colSpan: 0 },
        ],
      },
      {
        cells: [
          { text: 'r2c1', rowSpan: 0 },
          { text: 'r2c2', rowSpan: 2 },
          { text: 'r2c3', colSpan: 2 },
          { text: 'r2c4', colSpan: 0 },
          { text: 'r2c5', colSpan: 1, repeatColSpan: 2 },
          fillerCell2,
          { text: 'r2c2', rowSpan: 2 },
          { text: 'r2c3', colSpan: 2 },
          { text: 'r2c4', colSpan: 0 },
          { text: 'r2c5', colSpan: 1, repeatColSpan: 2 },
          fillerCell2,
          { text: 'r2c6', rowSpan: 2 },
          { text: 'r2c7', rowSpan: 2 },
          { text: 'r2c8', rowSpan: 2 },
          { text: 'r2c9', rowSpan: 2, replacedText: 'r2c9-single' },
        ],
      },
      {
        cells: [
          { text: 'r3c1', rowSpan: 0 },
          { text: 'r3c2', rowSpan: 0 },
          { text: 'r3c3' },
          { text: 'r3c4' },
          { text: 'r3c5', colSpan: 1, replacedText: 'r3c5-rep1' },
          { text: 'r3c5', colSpan: 1, replacedText: 'r3c5-rep2' },
          { text: 'r3c2', rowSpan: 0 },
          { text: 'r3c3' },
          { text: 'r3c4' },
          { text: 'r3c5', colSpan: 1, replacedText: 'r3c5-rep1' },
          { text: 'r3c5', colSpan: 1, replacedText: 'r3c5-rep2' },
          { text: 'r3c6', rowSpan: 0 },
          { text: 'r3c7', rowSpan: 0 },
          { text: 'r3c8', rowSpan: 0 },
          { text: 'r3c9', rowSpan: 0 },
        ],
      },
    ]);
  });
});
