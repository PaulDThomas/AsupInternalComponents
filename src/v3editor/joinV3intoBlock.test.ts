import { joinV3intoBlock } from "./joinV3intoBlock";
import { IEditorV3 } from "@asup/editor-v3";
import { stringToV3 } from "./stringToV3";

describe("Join V3 into block", () => {
  test("Standard check", () => {
    const lines: IEditorV3[] = [stringToV3("line1"), stringToV3("line2")];
    const result = joinV3intoBlock(lines);
    expect(result).toEqual(stringToV3("line1\nline2"));
  });
});
