import { AitRowData } from "components/ait";
import { rowPreProcess } from "./rowPreProcess";

describe("Check row pre process", () => {
  const a: AitRowData = {
    cells: [
      { aitid: "cell-1", text: "cell-1" },
      { aitid: "cell-2", text: "cell-2" },
      { aitid: "cell-3", text: "cell-3" },
      { aitid: "cell-4", text: "cell-4" },
    ],
  };
  test("Check aitid assigned", async () => {
    const b = rowPreProcess(60, [a]);
    expect(b[0].aitid).toBeTruthy();
  });
});
