import { AioReplacement } from "../aio";
import { updateExternals } from "./updateExternals";

describe('Check updateExternals', () => {
  let a: AioReplacement = {
    oldText: "a",
    newText: ["a1", "a2"],
    externalName: "ListB",
    givenName: "ListA",
  };
  let b: AioReplacement = {
    oldText: "b",
    newText: ["b1", "b2"],
    givenName: "ListB",
    subLists: [
      { oldText: "c", newText: ["c1", "c2"], externalName: "ListA" },
      { oldText: "d", newText: ["d1", "d2"] }
    ]
  };

  test("Single into long", () => {
    let c = updateExternals(b, [a]);
    expect(c).toEqual({
      oldText: "b",
      newText: ["b1", "b2"],
      givenName: "ListB",
      subLists: [
        { oldText: "c", newText: ["a1", "a2"], externalName: "ListA" },
        { oldText: "d", newText: ["d1", "d2"] }
      ]
    });
  });

  test("Long into single", () => {
    let c = updateExternals(a, [b]);
    expect(c).toEqual({
      oldText: "a",
      newText: ["b1", "b2"],
      externalName: "ListB",
      givenName: "ListA",
      subLists: [
        { oldText: "c", newText: ["c1", "c2"], externalName: "ListA", subList: undefined },
        { oldText: "d", newText: ["d1", "d2"], subList: undefined }
      ]
    });
  });

});
