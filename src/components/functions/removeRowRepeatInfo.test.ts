import { AitHeaderRowData } from "../table/interface";
import { removeHeaderRowRepeatInfo } from "./removeRowRepeatInfo";

describe("Check remove row repeat info", () => {
  const a: AitHeaderRowData<string> = {
    aitid: "Row",
    rowRepeat: "[Some repeat]",
    cells: [
      {
        aitid: "cell-1",
        text: "cell-1",
        comments: "",
        replacedText: "r-cell-1",
        spaceAfterSpan: 4,
      },
      { aitid: "cell-2", text: "cell-2", repeatColSpan: 3, comments: "none" },
      { aitid: "cell-3", text: "cell-3", comments: "", repeatRowSpan: 2, justifyText: "decimal" },
      { aitid: "cell-4", text: "cell-4", comments: "", spaceAfterRepeat: true, textIndents: 3 },
    ],
  };

  test("Check remove row repeat info", async () => {
    const b = removeHeaderRowRepeatInfo([a]);
    expect(b).toEqual([
      {
        aitid: "Row",
        cells: [
          {
            aitid: "cell-1",
            text: "cell-1",
            justifyText: undefined,
            comments: "",
            colSpan: undefined,
            rowSpan: undefined,
            colWidth: undefined,
            textIndents: undefined,
          },
          {
            aitid: "cell-2",
            text: "cell-2",
            comments: "none",
            justifyText: undefined,
            colSpan: undefined,
            rowSpan: undefined,
            colWidth: undefined,
            textIndents: undefined,
          },
          {
            aitid: "cell-3",
            text: "cell-3",
            justifyText: "decimal",
            comments: "",
            colSpan: undefined,
            rowSpan: undefined,
            colWidth: undefined,
            textIndents: undefined,
          },
          {
            aitid: "cell-4",
            text: "cell-4",
            textIndents: 3,
            justifyText: undefined,
            comments: "",
            colSpan: undefined,
            rowSpan: undefined,
            colWidth: undefined,
          },
        ],
      },
    ]);
  });
});
