import { IEditorV3 } from "@asup/editor-v3";
import { readV2DivElement } from "./readV2DivElement";

export const stringToV3 = (value: string): IEditorV3 => {
  if (value.match(/^<div.*class/)) {
    const div = document.createElement("div");
    div.innerHTML = value;
    const blocks = readV2DivElement(div.childNodes[0] as HTMLDivElement);
    return {
      lines: [{ textBlocks: blocks.textBlocks.map((block) => block.data) }],
    };
  } else {
    return {
      lines: [{ textBlocks: [{ text: value }] }],
    };
  }
};
