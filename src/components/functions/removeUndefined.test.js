import { removeUndefined } from "./removeUndefined";

describe("Check undefined empty", () => {
  const obj = {
    a: "one",
    b: null,
    c: false,
    d: "Hello",
    e: undefined,
    f: ["gg", null, undefined, null],
  };
  const arr = [obj, obj, null, undefined, "What"];

  test("Basic check", async () => {
    expect(removeUndefined([undefined, "one", false, undefined, null])).toEqual([
      "one",
      false,
      null,
    ]);
    expect(removeUndefined({ one: undefined, two: "something" })).toEqual({ two: "something" });
    expect(removeUndefined({ one: undefined, two: "something", three: null })).toEqual({
      two: "something",
      three: null,
    });
  });

  test("Recursion check", async () => {
    expect(removeUndefined(obj)).toEqual({
      a: "one",
      b: null,
      c: false,
      d: "Hello",
      f: ["gg", null, null],
    });

    expect(removeUndefined(arr)).toEqual([
      { a: "one", b: null, c: false, d: "Hello", f: ["gg", null, null] },
      { a: "one", b: null, c: false, d: "Hello", f: ["gg", null, null] },
      null,
      "What",
    ]);
  });
});
