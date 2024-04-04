import { fromHtml, toHtml } from "./tofromHtml";

describe("Check To & From HTML", () => {
  const notHtml = "&&&<<>>!\n  '\"";
  const isHtml = "&amp;&amp;&amp;&lt;&lt;&gt;&gt;!<br/>&nbsp;&nbsp;&apos;&quot;";
  test("To HTML", async () => {
    expect(toHtml(notHtml)).toEqual(isHtml);
    expect(fromHtml(isHtml)).toEqual(notHtml);
  });
});
