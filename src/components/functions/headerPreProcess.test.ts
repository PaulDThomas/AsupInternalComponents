import { AitRowGroupData } from "../table/interface";
import { headerPreProcess } from "./headerPreProcess";
import { newRow } from "./newRow";

jest.mock("./newRow");

describe("Check body pre-process", () => {
  const a: AitRowGroupData<string> = {
    rows: [newRow(60)],
  };
  const n = false;

  test("Check aitid assigned", async () => {
    const b = headerPreProcess(60, a);
    expect(b === false ? false : b.aitid).toBeTruthy();
  });

  test("Check false unchanged", async () => {
    const b = headerPreProcess(60, n);
    expect(b).toEqual(false);
  });
});
