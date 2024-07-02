import { getTextFromEditorV3 } from "./getTextFromEditorV3";
import { IEditorV3 } from "@asup/editor-v3";
import { stringToV3 } from "./stringToV3";

describe("getTextFromEditorV3", () => {
  test("IEditorV3 input", () => {
    const testContent: IEditorV3 = stringToV3("Hello world, this is a\ntest");
    expect(getTextFromEditorV3(testContent)).toEqual(["Hello world, this is a", "test"]);
  });

  test("String input", async () => {
    const testContent = "Hello world, this is a\ntest";
    expect(getTextFromEditorV3(testContent)).toEqual(["Hello world, this is a", "test"]);
  });
});
