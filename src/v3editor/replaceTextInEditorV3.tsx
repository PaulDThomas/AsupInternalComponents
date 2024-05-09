import { IEditorV3 } from "@asup/editor-v3";
import { stringToV3 } from "./stringToV3";
import { fromHtml } from "../components/functions/tofromHtml";
import { cloneDeep } from "lodash";

export const replaceTextInEditorV3 = (
  input: IEditorV3 | string,
  oldPhrase: string,
  newPhrase: string,
): IEditorV3 => {
  const ret: IEditorV3 = typeof input === "string" ? stringToV3(input) : cloneDeep(input);
  ret.lines.forEach((l) => {
    l.textBlocks.forEach((tb) => {
      tb.text = tb.text.replaceAll(oldPhrase, fromHtml(newPhrase));
    });
  });
  return ret;
};
