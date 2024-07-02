import { EditorV3Content } from "@asup/editor-v3";
import { replaceTextInEditorV3 } from "./replaceTextInEditorV3";
import { stringToV3 } from "./stringToV3";

describe("ReplaceTextInEditorV3", () => {
  test("Check string/string", async () => {
    const testContent = "Hello, World!";
    const result = replaceTextInEditorV3(testContent, "Hello", "Hi");
    expect(result.lines[0].textBlocks[0].text).toBe("Hi, World!");
  });

  test("Check string/IEditorV3", async () => {
    const testContent = "Hello, World!";
    const replaceContent = stringToV3("Hi");
    const result = replaceTextInEditorV3(testContent, "Hello", replaceContent);
    expect(result.lines[0].textBlocks[0].text).toBe("Hi, World!");
  });

  test("Check IEditorV3/string", async () => {
    const testContent = stringToV3("Hello, World!");
    const result = replaceTextInEditorV3(testContent, "Hello", "Hi");
    expect(result.lines[0].textBlocks[0].text).toBe("Hi, World!");
  });

  test("Check IEditorV3/IEditorV3", async () => {
    const testContent = stringToV3("Hello, World!");
    const replaceContent = stringToV3("Hi");
    const result = replaceTextInEditorV3(testContent, "Hello", replaceContent);
    expect(result.lines[0].textBlocks[0].text).toBe("Hi, World!");
  });

  test("Check newLineChar", async () => {
    const testContent = "Hello, World!";
    const result = replaceTextInEditorV3(testContent, "o", "~", "~");
    const content = new EditorV3Content(result);
    expect(content.text).toBe("Hell\n, W\nrld!");
  });
});
