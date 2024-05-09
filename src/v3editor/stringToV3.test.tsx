import { stringToV3 } from "./stringToV3";

describe("stringToV3", () => {
  test("Should return editor object from normal string", async () => {
    const result = stringToV3("Hello");
    expect(result).toEqual({
      lines: [{ textBlocks: [{ text: "Hello" }] }],
    });
  });

  test("Should return editor object from html string", async () => {
    const result = stringToV3("<div class='v2-block-line'>Hello</div>");
    expect(result).toEqual({
      lines: [{ textBlocks: [{ text: "Hello", type: "text" }] }],
    });
  });
});
