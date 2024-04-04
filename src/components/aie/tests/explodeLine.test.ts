import { iStyleBlock } from "../functions/aieInterface";
import { explodeLine } from "../functions/explodeLine";

// Check that correct array is returned
describe("Check explodeLine", () => {
  const styleBlocks: iStyleBlock[] = [
    { start: 1, end: 2, styleName: "red" },
    { start: 2, end: 3, styleName: "green" },
    { start: 3, end: 5, styleName: "blue" },
    { start: 7, end: 8, styleName: "purple" },
  ];

  test("Text explode", async () => {
    expect(explodeLine(styleBlocks, 10)).toEqual([
      { start: 0, end: 1, styleName: undefined },
      { start: 1, end: 2, styleName: "red" },
      { start: 2, end: 3, styleName: "green" },
      { start: 3, end: 4, styleName: "blue" },
      { start: 4, end: 5, styleName: "blue" },
      { start: 5, end: 6, styleName: undefined },
      { start: 6, end: 7, styleName: undefined },
      { start: 7, end: 8, styleName: "purple" },
      { start: 8, end: 9, styleName: undefined },
      { start: 9, end: 10, styleName: undefined },
    ]);
  });
});
