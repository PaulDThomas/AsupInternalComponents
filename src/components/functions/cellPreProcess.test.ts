import { AitCellData } from "../table/interface";
import { cellPreProcess } from "./cellPreProcess";

describe("Check cell pre-process", () => {
  const a: AitCellData = {
    text: "Hello world!",
  };

  test("Check aitid assigned", async () => {
    const b = cellPreProcess(60, [a]);
    expect(b[0].aitid).toBeTruthy();
    expect(b[0].colWidth).toEqual(60);
  });
});
