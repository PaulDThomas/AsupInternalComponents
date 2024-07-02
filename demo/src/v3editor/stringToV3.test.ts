import { stringToV3 } from "./stringToV3";

describe("stringToV3", () => {
  test("Should return editor object from normal string", async () => {
    const result = stringToV3("Hello");
    expect(result).toEqual({
      lines: [{ textBlocks: [{ text: "Hello", type: "text" }] }],
    });
  });

  test("Should return editor object from html string", async () => {
    const result = stringToV3("<div class='v2-block-line'>Hello</div>");
    expect(result).toEqual({
      lines: [{ textBlocks: [{ text: "Hello", type: "text" }] }],
    });
  });

  test("Should return many lines", async () => {
    const input =
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-key="cdmn1" data-type="unstyled" data-inline-style-ranges=\'[]\'>Note: </div>' +
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-key="3dutg" data-type="unstyled" data-inline-style-ranges=\'[]\'></div>' +
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-key="csne6" data-type="unstyled" data-inline-style-ranges=\'[]\'>If removing Variable column, please update the !!parameter!! list below to ONLY contain a single space.</div>' +
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-key="6dt83" data-type="unstyled" data-inline-style-ranges=\'[]\'></div>' +
      // eslint-disable-next-line quotes
      '<div classname="aie-text" data-key="2392m" data-type="unstyled" data-inline-style-ranges=\'[]\'>Similarly, if removing the Timepoint column, also replace the !!timepoint!! list below with a single space.</div>';
    const result = stringToV3(input);
    expect(result).toEqual({
      lines: [
        { textBlocks: [{ text: "Note: ", type: "text" }] },
        { textBlocks: [{ text: "", type: "text" }] },
        {
          textBlocks: [
            {
              text: "If removing Variable column, please update the !!parameter!! list below to ONLY contain a single space.",
              type: "text",
            },
          ],
        },
        { textBlocks: [{ text: "", type: "text" }] },
        {
          textBlocks: [
            {
              text: "Similarly, if removing the Timepoint column, also replace the !!timepoint!! list below with a single space.",
              type: "text",
            },
          ],
        },
      ],
    });
  });

  test("Should split ~ into separate lines", async () => {
    // eslint-disable-next-line quotes
    const input = '<div classname="aie-text">Hello~World</div>';
    const result = stringToV3(input);
    expect(result).toEqual({
      lines: [
        { textBlocks: [{ text: "Hello", type: "text" }] },
        { textBlocks: [{ text: "World", type: "text" }] },
      ],
    });
  });
});
