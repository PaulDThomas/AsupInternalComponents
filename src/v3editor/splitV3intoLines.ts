import { IEditorV3 } from "@asup/editor-v3";
import { cloneDeep } from "lodash";

export const splitV3intoLines = (value: IEditorV3): IEditorV3[] => {
  return value.lines.map((line) => ({
    lines: [cloneDeep(line)],
    contentProps: value.contentProps,
  }));
};
