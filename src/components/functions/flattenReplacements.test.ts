import { AioReplacement } from "../aio";
import { flattenReplacements } from "./flattenReplacements";

describe("Test flattenReplacements", () => {
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

  test("Single then long", () => {
    let c = flattenReplacements([a, b]);
    expect(c).toEqual({
      oldText: "a",
      newText: ["a1", "a2"],
      externalName: "ListB",
      givenName: "ListA",
      subLists: [
        {
          oldText: "b",
          newText: ["b1", "b2"],
          givenName: "ListB",
          subLists: [
            { oldText: "c", newText: ["c1", "c2"], externalName: "ListA" },
            { oldText: "d", newText: ["d1", "d2"] }
          ]
        }
      ]
    });
  });

  test("Long then single", () => {
    let c = flattenReplacements([b, a]);
    expect(c).toEqual({
      oldText: "b",
      newText: ["b1", "b2"],
      givenName: "ListB",
      subLists: [
        {
          oldText: "c", newText: ["c1", "c2"], externalName: "ListA", subLists: [
            { oldText: "a", newText: ["a1", "a2"], externalName: "ListB", givenName: "ListA", subLists: undefined }
          ]
        },
        {
          oldText: "d", newText: ["d1", "d2"], subLists: [
            { oldText: "a", newText: ["a1", "a2"], externalName: "ListB", givenName: "ListA", subLists: undefined }
          ]
        }
      ]
    });
  });

  test("Long with replacement", () => {
    let c = flattenReplacements([b], [a]);
    expect(c).toEqual({
      oldText: "b",
      newText: ["b1", "b2"],
      givenName: "ListB",
      subLists: [
        {
          oldText: "c", newText: ["a1", "a2"], externalName: "ListA", subLists: undefined
        },
        {
          oldText: "d", newText: ["d1", "d2"], subLists: undefined
        }
      ]
    });

  });

})