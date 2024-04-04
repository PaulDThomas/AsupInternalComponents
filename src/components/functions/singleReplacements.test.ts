import { AioExternalSingle } from "components/aio";
import { newRow } from "./newRow";
import { singleReplacements } from "./singleReplacements";

describe("Check single replacements", () => {
  const srep: AioExternalSingle = {
    oldText: "Old",
    newText: "New",
  };

  const row = newRow(1);
  row.cells[0].text = "Old";

  test("Basic checks", async () => {
    expect(singleReplacements(undefined, [row])).toEqual([row]);
    expect(singleReplacements([srep], [row])[0].cells[0].replacedText).toEqual("New");
  });
});
