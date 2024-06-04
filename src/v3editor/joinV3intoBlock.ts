import { IEditorV3 } from "@asup/editor-v3";

export const joinV3intoBlock = (lines: IEditorV3[]): IEditorV3 => {
  const retLines = lines.flatMap((l) => l.lines);
  const retContent = lines.map((l) => l.contentProps).reduce((p, c) => p ?? c, undefined);
  return {
    lines: retLines,
    contentProps: retContent,
  };
};
