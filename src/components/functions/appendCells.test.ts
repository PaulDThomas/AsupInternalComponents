import { AitRowData } from "../ait/aitInterface"
import { appendCells } from "./appendCells";

describe('Check appendCells', () => {
  let rowsA: AitRowData[] = [
    { aitid: "rowA1", cells: [{ text: "A1" }] },
    { aitid: "rowA2", cells: [{ text: "A2" }] },
  ];
  let rowsB: AitRowData[] = [
    { aitid: "rowB1", cells: [{ text: "B1" }] },
    { aitid: "rowB2", cells: [{ text: "B2" }] },
  ];

  test('Append A to B', async () => {
    expect(appendCells(rowsA, rowsB)).toEqual(
      [
        { aitid: "rowA1", cells: [{ text: "A1" }, { text: "B1" }] },
        { aitid: "rowA2", cells: [{ text: "A2" }, { text: "B2" }] },
      ]
    )
  });
});