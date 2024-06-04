import { IEditorV3 } from "@asup/editor-v3";
import { readV2DivElement } from "./readV2DivElement";
import { fromHtml } from "../components/functions/tofromHtml";

export const stringToV3 = (value: string): IEditorV3 => {
  if (value.match(/^<div.*class/)) {
    const div = document.createElement("div");
    div.innerHTML = value.replace(/~/g, "</div><div>");
    const ret: IEditorV3 = { lines: [] };
    div.childNodes.forEach((node) => {
      const blocks = readV2DivElement(node as HTMLDivElement);
      ret.lines.push({ textBlocks: blocks.textBlocks.map((block) => block.data) });
    });
    return ret;
  } else {
    return {
      lines: value
        .split("\n")
        .map((line) => ({ textBlocks: [{ text: fromHtml(line), type: "text" }] })),
    };
  }
};
