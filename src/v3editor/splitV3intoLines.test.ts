import { splitV3intoLines } from "./splitV3intoLines";
import { stringToV3 } from "./stringToV3";

describe("Split V3 into lines", () => {
  test("Standard check", async () => {
    const text = stringToV3("Once\nUpon\na\ntime");
    const result = splitV3intoLines(text);
    expect(result).toEqual([
      stringToV3("Once"),
      stringToV3("Upon"),
      stringToV3("a"),
      stringToV3("time"),
    ]);
  });
});
