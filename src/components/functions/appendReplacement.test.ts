import { AioReplacement } from "../aio";
import { appendReplacement } from "./appendReplacement";

describe("Check appendReplacement", () => {
  const a: AioReplacement<string> = { oldText: "a", newTexts: [{ texts: ["a1", "a2"] }] };
  const b: AioReplacement<string> = {
    oldText: "b",
    newTexts: [
      {
        texts: ["b1"],
        subLists: [
          { oldText: "c", newTexts: [{ texts: ["c1", "c2"], subLists: [] }] },
          { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
        ],
      },
    ],
  };

  // Basic check
  test("Append to empty", () => {
    expect(appendReplacement(a, undefined)).toEqual([a]);
    expect(appendReplacement(b, undefined)).toEqual([b]);
  });

  // Check append each way
  test("Long after small", () => {
    expect(appendReplacement(b, [a])).toEqual([
      {
        oldText: "a",
        newTexts: [
          {
            texts: ["a1", "a2"],
            subLists: [
              {
                oldText: "b",
                newTexts: [
                  {
                    texts: ["b1"],
                    subLists: [
                      { oldText: "c", newTexts: [{ texts: ["c1", "c2"], subLists: [] }] },
                      { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  test("Small after long", () => {
    expect(appendReplacement(a, [b])).toEqual([
      {
        oldText: "b",
        newTexts: [
          {
            texts: ["b1"],
            subLists: [
              {
                oldText: "c",
                newTexts: [
                  {
                    texts: ["c1", "c2"],
                    subLists: [{ oldText: "a", newTexts: [{ texts: ["a1", "a2"] }] }],
                  },
                ],
              },
              {
                oldText: "d",
                newTexts: [
                  {
                    texts: ["d1", "d2"],
                    subLists: [{ oldText: "a", newTexts: [{ texts: ["a1", "a2"] }] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  test("Long after long", () => {
    expect(appendReplacement(b, [b])).toEqual([
      {
        oldText: "b",
        newTexts: [
          {
            texts: ["b1"],
            subLists: [
              {
                oldText: "c",
                newTexts: [
                  {
                    texts: ["c1", "c2"],
                    subLists: [
                      {
                        oldText: "b",
                        newTexts: [
                          {
                            texts: ["b1"],
                            subLists: [
                              { oldText: "c", newTexts: [{ texts: ["c1", "c2"], subLists: [] }] },
                              { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                oldText: "d",
                newTexts: [
                  {
                    texts: ["d1", "d2"],
                    subLists: [
                      {
                        oldText: "b",
                        newTexts: [
                          {
                            texts: ["b1"],
                            subLists: [
                              { oldText: "c", newTexts: [{ texts: ["c1", "c2"], subLists: [] }] },
                              { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
