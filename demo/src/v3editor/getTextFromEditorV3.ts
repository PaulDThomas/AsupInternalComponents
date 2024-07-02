import { IEditorV3 } from "@asup/editor-v3";
import { stringToV3 } from "./stringToV3";

export const getTextFromEditorV3 = (input: IEditorV3 | string): string[] => {
  const ret: IEditorV3 = typeof input === "string" ? stringToV3(input) : input;
  return ret.lines.flatMap((l) => l.textBlocks.map((tb) => tb.text));
};
