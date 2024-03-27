import { getHtmlString } from "../functions/getHtmlString";

describe("Test HTML string function", () => {
  const text = ".asldijfha;sdljfh";
  const frag = document.createDocumentFragment();
  const s = document.createElement("span");
  s.textContent = text;
  frag.appendChild(s);

  test("Check out div assigned", async () => {
    expect(getHtmlString(frag, "a-new-class")).toBe(
      `<div class="a-new-class"><span>${text}</span></div>`,
    );
  });
});
