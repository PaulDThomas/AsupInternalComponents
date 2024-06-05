import { AitRowData } from "../table/interface";
import { rowPreProcess } from "./rowPreProcess";

describe("Check row pre process", () => {
  const a: AitRowData<string> = {
    cells: [
      { aitid: "cell-1", text: "cell-1", comments: "" },
      { aitid: "cell-2", text: "cell-2", comments: "" },
      { aitid: "cell-3", text: "cell-3", comments: "" },
      { aitid: "cell-4", text: "cell-4", comments: "" },
    ],
  };
  test("Check aitid assigned", async () => {
    const b = rowPreProcess(60, [a]);
    expect(b[0].aitid).toBeTruthy();
  });
});
