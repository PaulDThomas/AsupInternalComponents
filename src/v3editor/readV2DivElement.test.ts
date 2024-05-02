/* eslint-disable quotes */
import { readV2DivElement } from "./readV2DivElement";

describe("readV2DivElement", () => {
  test("Read basic div element", async () => {
    const template = document.createElement("template");
    template.innerHTML =
      '<div classname="aie-text" data-key="3fsuc" data-type="unstyled" data-inline-style-ranges=\'[{"offset":32,"length":9,"style":"Optional"}]\'>[b] CR, non-measurable disease: <span classname="Optional" style="color:seagreen">Confirmed</span> CR response but subject has non-measurable disease at baseline.</div>';
    const result = readV2DivElement(template.content.children[0] as HTMLDivElement);
    expect(result.textBlocks.length).toEqual(3);
    expect(result.textBlocks[0].data).toEqual({
      style: undefined,
      text: "[b] CR, non-measurable disease: ",
      type: "text",
    });
    expect(result.textBlocks[1].data).toEqual({
      style: "Optional",
      text: "Confirmed",
      type: "text",
    });
    expect(result.textBlocks[2].data).toEqual({
      style: undefined,
      text: " CR response but subject has non-measurable disease at baseline.",
      type: "text",
    });
  });

  test("Read made up element with no style", async () => {
    const template = document.createElement("template");
    template.innerHTML =
      '<div classname="aie-text" data-key="3fsuc" data-type="unstyled">[b] CR, non-measurable disease: <span class="style-optional" style="color:seagreen">Confirmed</span> CR response but subject has non-measurable disease at baseline.</div>';
    const result = readV2DivElement(template.content.children[0] as HTMLDivElement);
    expect(result.textBlocks.length).toEqual(3);
    expect(result.textBlocks[0].data).toEqual({
      style: undefined,
      text: "[b] CR, non-measurable disease: ",
      type: "text",
    });
    expect(result.textBlocks[1].data).toEqual({
      style: undefined,
      text: "Confirmed",
      type: "text",
    });
    expect(result.textBlocks[2].data).toEqual({
      style: undefined,
      text: " CR response but subject has non-measurable disease at baseline.",
      type: "text",
    });
  });

  test("Read empty string", async () => {
    const template = document.createElement("template");
    template.innerHTML = '<div classname="aie-text" data-key="3fsuc" data-type="unstyled"></div>';
    const result = readV2DivElement(template.content.children[0] as HTMLDivElement);
    expect(result.textBlocks.length).toEqual(1);
    expect(result.textBlocks[0].data).toEqual({
      style: undefined,
      text: "",
      type: "text",
    });
  });

  test("Read small uncharactieristic span", async () => {
    const template = document.createElement("template");
    template.innerHTML =
      '<div classname="aie-text" data-key="3fsuc" data-type="unstyled"><span>Hello world!</span></div>';
    const result = readV2DivElement(template.content.children[0] as HTMLDivElement);
    expect(result.textBlocks.length).toEqual(1);
    expect(result.textBlocks[0].data).toEqual({
      style: undefined,
      text: "Hello world!",
      type: "text",
    });
  });
});

describe("Render html text from v2 content", () => {
  test("Load multiple v2 lines", async () => {
    const textStrings = `
    <div classname="aie-text" data-key="2v9v5" data-type="unstyled" data-inline-style-ranges='[{"offset":0,"length":1,"style":"Notes"},{"offset":4,"length":1,"style":"Notes"},{"offset":1,"length":3,"style":"Optional"}]'><span classname="Notes" style="color:blue;font-size:16pt">N</span><span classname="Optional" style="color:green;font-weight:100;font-family:serif;font-size:16pt">ote</span><span classname="Notes" style="color:blue;font-size:16pt">s</span>  w</div>
    <div classname="aie-text" data-key="1u61b" data-type="unstyled" data-inline-style-ranges='[]'></div>
    <div classname="aie-text" data-key="4l4fu" data-type="unstyled" data-inline-style-ranges='[]'>ork</div>
    `
      .split("\n")
      .filter((t) => t.trim().length > 0)
      .map((t) => t.trim());
    const result = textStrings.map((t) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = t;
      return readV2DivElement(tempDiv.children[0] as HTMLDivElement);
    });
    expect(result.length).toEqual(3);
    expect(result[0].textBlocks.map((t) => t.data)).toEqual([
      { text: "N", style: "Notes", type: "text" },
      { text: "ote", style: "Optional", type: "text" },
      { text: "s", style: "Notes", type: "text" },
      { text: "  w", style: undefined, type: "text" },
    ]);
    expect(result[1].textBlocks.map((t) => t.data)).toEqual([
      { text: "", style: undefined, type: "text" },
    ]);
    expect(result[2].textBlocks.map((t) => t.data)).toEqual([
      { text: "ork", style: undefined, type: "text" },
    ]);
  });
});
