import { AitRowGroupData } from "../table/interface";
import { bodyPreProcess } from "./bodyPreProcess";
import { newRow } from "./newRow";

jest.mock("./newRow");

describe("Check body pre-process", () => {
  const a: AitRowGroupData<string> = {
    rows: [newRow(60)],
  };

  test("Check aitid assigned", async () => {
    const b = bodyPreProcess(60, [a]);
    expect(b[0].aitid).toBeTruthy();
  });
});
