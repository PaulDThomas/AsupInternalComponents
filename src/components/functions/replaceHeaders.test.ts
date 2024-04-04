import { AioReplacement } from "../aio/aioInterface";
import { AitColumnRepeat, AitHeaderRowData } from "../ait/aitInterface";
import { newHeaderRow } from "./newRow";
import { removeUndefined } from "./removeUndefined";
import { replaceHeaders } from "./replaceHeaders";

describe("Check replace headers", () => {
  const rows: AitHeaderRowData[] = [newHeaderRow(60, 3)];
  for (let i = 0; i++; i < 3) {
    rows[0].cells[i].text = `Cell ${i}`;
  }
  const columnRepeats: AitColumnRepeat[] = [
    { columnIndex: 0 },
    { columnIndex: 1 },
    { columnIndex: 2 },
  ];

  test("Basic checks", () => {
    const postProcess = replaceHeaders(2, rows, columnRepeats, 60);
    expect(postProcess.newHeaderRows).toEqual(rows);
    expect(postProcess.newColumnRepeats).toEqual(columnRepeats);
  });

  const rowsC1: AitHeaderRowData[] = [
    {
      cells: [
        { text: "r1c1", rowSpan: 3 },
        { text: "r1c2", colSpan: 4 },
        { text: "r1c3", colSpan: 0 },
        { text: "r1c4", colSpan: 0 },
        { text: "r1c5", colSpan: 0 },
        { text: "r1c6", colSpan: 4 },
        { text: "r1c7", colSpan: 0 },
        { text: "r1c8", colSpan: 0 },
        { text: "r1c9", colSpan: 0 },
      ],
    },
    {
      cells: [
        { text: "r2c1", rowSpan: 0 },
        { text: "r2c2", rowSpan: 2 },
        { text: "r2c3", colSpan: 2 },
        { text: "r2c4", colSpan: 0 },
        { text: "r2c5" },
        { text: "r2c6", rowSpan: 2 },
        { text: "r2c7", rowSpan: 2 },
        { text: "r2c8", rowSpan: 2 },
        { text: "r2c9", rowSpan: 2 },
      ],
    },
    {
      cells: [
        { text: "r3c1", rowSpan: 0 },
        { text: "r3c2", rowSpan: 0 },
        { text: "r3c3" },
        { text: "r3c4" },
        { text: "r3c5" },
        { text: "r3c6", rowSpan: 0 },
        { text: "r3c7", rowSpan: 0 },
        { text: "r3c8", rowSpan: 0 },
        { text: "r3c9", rowSpan: 0 },
      ],
    },
  ];

  const columnRepeatsC1: AitColumnRepeat[] = [
    { columnIndex: 0 },
    { columnIndex: 1 },
    { columnIndex: 2 },
    { columnIndex: 3 },
    { columnIndex: 4 },
    { columnIndex: 5 },
    { columnIndex: 6 },
    { columnIndex: 7 },
    { columnIndex: 8 },
  ];

  const replacement: AioReplacement = {
    oldText: "r1c2",
    newTexts: [
      {
        texts: ["r1c2-rep1", "r1c2-rep2"],
        subLists: [
          {
            oldText: "r3c5",
            newTexts: [
              {
                texts: ["r3c5-rep1", "r3c5-rep2"],
                subLists: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const fillerCell = {
    colSpan: 0,
    colWidth: 60,
    repeatColSpan: 0,
    replacedText: "",
    rowSpan: 1,
    text: "",
  };

  test("Complex header 1", () => {
    const postProcess = replaceHeaders(1, rowsC1, columnRepeatsC1, 60, replacement);
    expect(postProcess.newColumnRepeats).toEqual([
      { columnIndex: 0 },
      { columnIndex: 1, colRepeat: "[0,0]" },
      { columnIndex: 2, colRepeat: "[0,0]" },
      { columnIndex: 3, colRepeat: "[0,0]" },
      { columnIndex: 4, colRepeat: "[0,0][0,0]" },
      { columnIndex: 4, colRepeat: "[0,0][0,1]" },
      { columnIndex: 1, colRepeat: "[0,1]" },
      { columnIndex: 2, colRepeat: "[0,1]" },
      { columnIndex: 3, colRepeat: "[0,1]" },
      { columnIndex: 4, colRepeat: "[0,1][0,0]" },
      { columnIndex: 4, colRepeat: "[0,1][0,1]" },
      { columnIndex: 5 },
      { columnIndex: 6 },
      { columnIndex: 7 },
      { columnIndex: 8 },
    ]);
    expect(removeUndefined(postProcess.newHeaderRows)).toEqual([
      {
        cells: [
          { text: "r1c1", rowSpan: 3 },
          { text: "r1c2", colSpan: 4, replacedText: "r1c2-rep1", repeatColSpan: 5 },
          { text: "r1c3", colSpan: 0 },
          { text: "r1c4", colSpan: 0 },
          { text: "r1c5", colSpan: 0 },
          fillerCell,
          { text: "r1c2", colSpan: 4, replacedText: "r1c2-rep2", repeatColSpan: 5 },
          { text: "r1c3", colSpan: 0 },
          { text: "r1c4", colSpan: 0 },
          { text: "r1c5", colSpan: 0 },
          fillerCell,
          { text: "r1c6", colSpan: 4 },
          { text: "r1c7", colSpan: 0 },
          { text: "r1c8", colSpan: 0 },
          { text: "r1c9", colSpan: 0 },
        ],
      },
      {
        cells: [
          { text: "r2c1", rowSpan: 0 },
          { text: "r2c2", rowSpan: 2 },
          { text: "r2c3", colSpan: 2 },
          { text: "r2c4", colSpan: 0 },
          { text: "r2c5", colSpan: 1, repeatColSpan: 2 },
          fillerCell,
          { text: "r2c2", rowSpan: 2 },
          { text: "r2c3", colSpan: 2 },
          { text: "r2c4", colSpan: 0 },
          { text: "r2c5", colSpan: 1, repeatColSpan: 2 },
          fillerCell,
          { text: "r2c6", rowSpan: 2 },
          { text: "r2c7", rowSpan: 2 },
          { text: "r2c8", rowSpan: 2 },
          { text: "r2c9", rowSpan: 2 },
        ],
      },
      {
        cells: [
          { text: "r3c1", rowSpan: 0 },
          { text: "r3c2", rowSpan: 0 },
          { text: "r3c3" },
          { text: "r3c4" },
          { text: "r3c5", colSpan: 1, replacedText: "r3c5-rep1" },
          { text: "r3c5", colSpan: 1, replacedText: "r3c5-rep2" },
          { text: "r3c2", rowSpan: 0 },
          { text: "r3c3" },
          { text: "r3c4" },
          { text: "r3c5", colSpan: 1, replacedText: "r3c5-rep1" },
          { text: "r3c5", colSpan: 1, replacedText: "r3c5-rep2" },
          { text: "r3c6", rowSpan: 0 },
          { text: "r3c7", rowSpan: 0 },
          { text: "r3c8", rowSpan: 0 },
          { text: "r3c9", rowSpan: 0 },
        ],
      },
    ]);
  });
});
