import { AioReplacement } from "components/aio";
import { replaceRows } from "./replaceRows";
import { AitRowData } from "../table/interface";

describe("Check complex replace rows", () => {
  const rows: AitRowData<string>[] = [
    {
      cells: [
        { text: "p" },
        { text: "s" },
        { text: "t" },
        { text: "h" },
        { text: "r" },
        { text: "v" },
      ],
    },
    {
      cells: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "c" }, { text: "v" }],
    },
  ];

  const replacement: AioReplacement = {
    oldText: "r",
    newTexts: [
      {
        spaceAfter: false,
        texts: ["r1"],
        subLists: [
          {
            oldText: "v",
            newTexts: [
              {
                spaceAfter: true,
                texts: ["0.xxx"],
                subLists: [],
              },
            ],
            includeTrailing: false,
          },
        ],
      },
      {
        spaceAfter: false,
        texts: ["r2"],
        subLists: [
          {
            oldText: "v",
            newTexts: [
              {
                spaceAfter: true,
                texts: [" "],
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

  test("Complex rows", async () => {
    const repeated = replaceRows(rows, 60, replacement);
    expect(repeated).toEqual([
      // Row 0
      {
        cells: [
          { text: "p" },
          { text: "s" },
          { text: "t" },
          { text: "h" },
          { text: "r", replacedText: "r1" },
          { text: "v", replacedText: "0.xxx", spaceAfterRepeat: true },
        ],
        rowRepeat: "[0,0][0,0]",
      },
      {
        cells: [
          { text: "p", replacedText: "" },
          { text: "s", replacedText: "" },
          { text: "t", replacedText: "" },
          { text: "h", replacedText: "" },
          { text: "r", replacedText: "r2" },
          { text: "v", replacedText: " ", spaceAfterRepeat: true },
        ],
        rowRepeat: "[1,0][0,0]",
      },
      {
        cells: [
          { text: "" },
          { text: "" },
          { text: "" },
          { text: "" },
          { text: "c" },
          { text: "v" },
        ],
      },
    ]);
  });
});
