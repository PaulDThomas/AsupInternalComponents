import { AioExternalReplacements, AioReplacement } from "../aio";
import { updateExternal } from "./updateExternal";

describe("Check updateExternals", () => {
  const a: AioReplacement<string> = {
    oldText: "a",
    externalName: "ListE",
    newTexts: [{ texts: ["a1", "a2"] }],
  };
  const e: AioExternalReplacements<string> = {
    givenName: "ListE",
    newTexts: [
      { texts: ["Mean"], subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] }] },
      { texts: ["SD"], subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] }] },
    ],
  };

  test("Into single", () => {
    const c = updateExternal(a, [e]);
    expect(c).toEqual({
      oldText: "a",
      externalName: "ListE",
      newTexts: [
        {
          texts: ["Mean"],
          subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["xx.x"] }] }],
        },
        { texts: ["SD"], subLists: [{ oldText: "!!xvals!!", newTexts: [{ texts: ["x.xx"] }] }] },
      ],
    });
  });
});
