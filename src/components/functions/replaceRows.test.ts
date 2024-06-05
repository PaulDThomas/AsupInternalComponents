import { AioReplacement } from "components/aio";
import { replaceRows } from "./replaceRows";
import { AitRowData } from "../table/interface";

describe("Check complex replace rows", () => {
  const rows: AitRowData<string>[] = [
    {
      cells: [
        { text: "p", comments: "" },
        { text: "s", comments: "" },
        { text: "t", comments: "" },
        { text: "h", comments: "" },
        { text: "r", comments: "" },
        { text: "v", comments: "" },
      ],
    },
    {
      cells: [
        { text: "", comments: "" },
        { text: "", comments: "" },
        { text: "", comments: "" },
        { text: "", comments: "" },
        { text: "c", comments: "" },
        { text: "v", comments: "" },
      ],
    },
  ];

  const replacement: AioReplacement<string> = {
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
    const repeated = replaceRows(
      rows,
      60,
      (s: string) => [s],
      (s: string, o: string, n: string) => s.replace(o, n),
      replacement,
    );
    expect(repeated).toEqual([
      // Row 0
      {
        cells: [
          { text: "p", comments: "" },
          { text: "s", comments: "" },
          { text: "t", comments: "" },
          { text: "h", comments: "" },
          { text: "r", comments: "", replacedText: "r1" },
          { text: "v", comments: "", replacedText: "0.xxx", spaceAfterRepeat: true },
        ],
        rowRepeat: "[0,0][0,0]",
      },
      {
        cells: [
          { text: "p", comments: "", replacedText: "" },
          { text: "s", comments: "", replacedText: "" },
          { text: "t", comments: "", replacedText: "" },
          { text: "h", comments: "", replacedText: "" },
          { text: "r", comments: "", replacedText: "r2" },
          { text: "v", comments: "", replacedText: " ", spaceAfterRepeat: true },
        ],
        rowRepeat: "[1,0][0,0]",
      },
      {
        cells: [
          { text: "", comments: "" },
          { text: "", comments: "" },
          { text: "", comments: "" },
          { text: "", comments: "" },
          { text: "c", comments: "" },
          { text: "v", comments: "" },
        ],
      },
    ]);
  });
});
