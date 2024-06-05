import { AitRowData } from "../table/interface";
import { appendCells } from "./appendCells";

describe("Check appendCells", () => {
  const rowsA: AitRowData<string>[] = [
    { aitid: "rowA1", cells: [{ text: "A1", comments: "" }] },
    { aitid: "rowA2", cells: [{ text: "A2", comments: "" }] },
  ];
  const rowsB: AitRowData<string>[] = [
    { aitid: "rowB1", cells: [{ text: "B1", comments: "" }] },
    { aitid: "rowB2", cells: [{ text: "B2", comments: "" }] },
  ];

  test("Append A to B", async () => {
    expect(appendCells(rowsA, rowsB)).toEqual([
      {
        aitid: "rowA1",
        cells: [
          { text: "A1", comments: "" },
          { text: "B1", comments: "" },
        ],
      },
      {
        aitid: "rowA2",
        cells: [
          { text: "A2", comments: "" },
          { text: "B2", comments: "" },
        ],
      },
    ]);
  });
});
