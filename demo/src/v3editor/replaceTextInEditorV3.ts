import { EditorV3Content, IEditorV3 } from "@asup/editor-v3";
import { cloneDeep } from "lodash";
import { stringToV3 } from "./stringToV3";

export const replaceTextInEditorV3 = (
  input: IEditorV3 | string,
  oldPhrase: string,
  newPhrase: IEditorV3 | string,
  newLineChar = "~",
): IEditorV3 => {
  const ret: EditorV3Content = new EditorV3Content(
    typeof input === "string" ? stringToV3(input) : cloneDeep(input),
  );
  if (ret.getTextPosition(oldPhrase)) {
    // Get replacement content
    const newContent = new EditorV3Content(
      typeof newPhrase === "string" ? stringToV3(newPhrase) : newPhrase,
    );
    // Add line breaks to replacement content
    while (newContent.getTextPosition(newLineChar)?.length ?? 0 > 0) {
      const pos = newContent.getTextPosition(newLineChar);
      pos && newContent.splitLine(pos[0]);
    }
    // Update all lines
    const newLines = newContent.lines;
    while (ret.getTextPosition(oldPhrase)) {
      const pos = ret.getTextPosition(oldPhrase);
      pos && ret.splice(pos[0], newLines);
    }
  }
  return ret.data;
};
