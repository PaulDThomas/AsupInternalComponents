import { EditorV3Content, IEditorV3 } from "@asup/editor-v3";
import { cloneDeep } from "lodash";
import { stringToV3 } from "./stringToV3";

export const replaceTextInEditorV3 = (
  input: IEditorV3 | string,
  oldPhrase: string,
  newPhrase: IEditorV3 | string,
): IEditorV3 => {
  const ret: EditorV3Content = new EditorV3Content(
    typeof input === "string" ? stringToV3(input) : cloneDeep(input),
  );
  const replacePos = ret.getTextPosition(oldPhrase);
  if (replacePos) {
    const newLines = new EditorV3Content(
      typeof newPhrase === "string" ? stringToV3(newPhrase) : newPhrase,
    ).lines;
    replacePos?.forEach((pos) => {
      ret.splice(pos, newLines);
    });
  }
  return ret.data;
};
