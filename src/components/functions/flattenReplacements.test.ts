import { AioExternalReplacements, AioReplacement } from "../aio";
import { flattenReplacements } from "./flattenReplacements";

describe("Test flattenReplacements", () => {
  const a: AioReplacement = {
    oldText: "a",
    externalName: "ListE",
    newTexts: [{ texts: ["a1", "a2"] }],
  };
  const b: AioReplacement = {
    oldText: "b",
    newTexts: [
      {
        texts: ["b1"],
        subLists: [
          {
            oldText: "c",
            externalName: "ListE",
            newTexts: [{ texts: ["c1", "c2"] }],
          },
          { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
        ],
      },
    ],
  };
  const e: AioExternalReplacements = {
    givenName: "ListE",
    newTexts: [
      { texts: ["Mean"], subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] }] },
      { texts: ["SD"], subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] }] },
    ],
  };

  // Basic check
  test("Basic checks", () => {
    expect(flattenReplacements([])).toEqual(undefined);
    expect(flattenReplacements([a])).toEqual(a);
    expect(flattenReplacements([b])).toEqual(b);
  });

  test("Single then long", () => {
    const c = flattenReplacements([a, b]);
    expect(c).toEqual({
      oldText: "a",
      externalName: "ListE",
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
                    { oldText: "c", externalName: "ListE", newTexts: [{ texts: ["c1", "c2"] }] },
                    { oldText: "d", newTexts: [{ texts: ["d1", "d2"] }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("Long then single", () => {
    const c = flattenReplacements([b, a]);
    expect(c).toEqual({
      oldText: "b",
      newTexts: [
        {
          texts: ["b1"],
          subLists: [
            {
              oldText: "c",
              externalName: "ListE",
              newTexts: [
                {
                  texts: ["c1", "c2"],
                  subLists: [
                    { oldText: "a", externalName: "ListE", newTexts: [{ texts: ["a1", "a2"] }] },
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
                    { oldText: "a", externalName: "ListE", newTexts: [{ texts: ["a1", "a2"] }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("Long then single with replacement", () => {
    const c = flattenReplacements([b, a], [e]);
    expect(c).toEqual({
      oldText: "b",
      newTexts: [
        {
          texts: ["b1"],
          subLists: [
            {
              oldText: "c",
              externalName: "ListE",
              newTexts: [
                {
                  texts: ["Mean"],
                  subLists: [
                    {
                      oldText: "!!xvals!!",
                      newTexts: [
                        {
                          texts: ["xx.x"],
                          subLists: [
                            {
                              oldText: "a",
                              externalName: "ListE",
                              newTexts: [
                                {
                                  texts: ["Mean"],
                                  subLists: [
                                    { oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] },
                                  ],
                                },
                                {
                                  texts: ["SD"],
                                  subLists: [
                                    { oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] },
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
                {
                  texts: ["SD"],
                  subLists: [
                    {
                      oldText: "!!xvals!!",
                      newTexts: [
                        {
                          texts: ["x.xx"],
                          subLists: [
                            {
                              oldText: "a",
                              externalName: "ListE",
                              newTexts: [
                                {
                                  texts: ["Mean"],
                                  subLists: [
                                    { oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] },
                                  ],
                                },
                                {
                                  texts: ["SD"],
                                  subLists: [
                                    { oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] },
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
            {
              oldText: "d",
              newTexts: [
                {
                  texts: ["d1", "d2"],
                  subLists: [
                    {
                      oldText: "a",
                      externalName: "ListE",
                      newTexts: [
                        {
                          texts: ["Mean"],
                          subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] }],
                        },
                        {
                          texts: ["SD"],
                          subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] }],
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
    });
  });
});
