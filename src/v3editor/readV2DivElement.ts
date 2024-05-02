import { EditorV3TextBlock, EditorV3Align } from "@asup/editor-v3";

export const readV2DivElement = (
  arg: HTMLDivElement,
): {
  textBlocks: EditorV3TextBlock[];
  decimalAlignPercent: number;
  textAlignment: EditorV3Align;
} => {
  const ret: {
    textBlocks: EditorV3TextBlock[];
    decimalAlignPercent: number;
    textAlignment: EditorV3Align;
  } = {
    textBlocks: [],
    decimalAlignPercent: 60,
    textAlignment: EditorV3Align.left,
  };
  // Loop through children in Div
  arg.childNodes.forEach((child) => {
    // If child is a span
    if (child instanceof HTMLSpanElement) {
      // If span has text
      if (child.textContent) {
        // If span has style
        if (child.attributes.length > 0 && child.attributes[0].name === "classname") {
          // Add text block with style
          const newBlbock = new EditorV3TextBlock({
            text: child.textContent,
            style: child.attributes[0].value,
          });
          ret.textBlocks.push(newBlbock);
        }
        // If span has no style
        else {
          // Add text block without style
          const newBlock = new EditorV3TextBlock({ text: child.textContent });
          ret.textBlocks.push(newBlock);
        }
      }
    }
    // If child is a text node
    else if (child instanceof Text) {
      // If text node has text
      if (child.textContent) {
        // Add text block without style
        ret.textBlocks.push(new EditorV3TextBlock({ text: child.textContent }));
      }
    }
  });

  // Ensure there is at least something
  if (ret.textBlocks.length === 0) ret.textBlocks = [new EditorV3TextBlock()];
  return ret;
};
