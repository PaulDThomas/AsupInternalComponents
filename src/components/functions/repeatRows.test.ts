import { AioReplacement } from "components/aio";
import { repeatRows } from "./repeatRows";
import { AitRowData } from "../table/interface";

describe("Check repeat rows", () => {
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

  const replacements: AioReplacement[] = [
    {
      oldText: "p",
      newTexts: [
        {
          spaceAfter: false,
          texts: ["p1"],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: "s",
      newTexts: [
        {
          spaceAfter: false,
          texts: ["s1", "s2"],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: "t",
      newTexts: [
        {
          spaceAfter: true,
          texts: ["t1", "t2"],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
      oldText: "h",
      newTexts: [
        {
          spaceAfter: false,
          texts: ["h1", "h2"],
          subLists: [],
        },
      ],
      includeTrailing: false,
    },
    {
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
                  spaceAfter: false,
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
    },
    {
      oldText: "c",
      newTexts: [
        {
          spaceAfter: true,
          texts: ["c!"],
          subLists: [
            {
              oldText: "v",
              newTexts: [
                {
                  spaceAfter: false,
                  texts: ["!!"],
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

  test("Complex rows", async () => {
    const repeated = repeatRows(rows, 60, replacements, true, false, undefined, [
      { oldText: "p1", newText: "p1!" },
    ]);
    const repeatedTexts = repeated.map((r) =>
      r.cells.map((c) => c.replacedText ?? c.text).join(","),
    );
    const spaceAfter = repeated.map((r) =>
      r.cells
        .map((c, ix) => (c.spaceAfterRepeat ? ix : undefined))
        .filter((x) => x !== undefined)
        .join(","),
    );
    expect(repeatedTexts).toEqual([
      "p1!,s1,t1,h1,r1,0.xxx",
      ",,,,r2, ",
      ",,,h2,r1,0.xxx",
      ",,,,r2, ",
      ",,t2,h1,r1,0.xxx",
      ",,,,r2, ",
      ",,,h2,r1,0.xxx",
      ",,,,r2, ",
      ",s2,t1,h1,r1,0.xxx",
      ",,,,r2, ",
      ",,,h2,r1,0.xxx",
      ",,,,r2, ",
      ",,t2,h1,r1,0.xxx",
      ",,,,r2, ",
      ",,,h2,r1,0.xxx",
      ",,,,r2, ",
      ",,,,c!,!!",
    ]);
    expect(spaceAfter).toEqual([
      "",
      "5",
      "",
      "2,5",
      "",
      "5",
      "",
      "2,5",
      "",
      "5",
      "",
      "2,5",
      "",
      "5",
      "",
      "2,5",
      "4",
    ]);
  });
});
