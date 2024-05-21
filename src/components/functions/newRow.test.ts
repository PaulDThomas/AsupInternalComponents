import { newHeaderRow, newRow } from "./newRow";

describe("Test new row functions", () => {
  test("New row", async () => {
    const nr = newRow(60);
    expect(nr).toEqual({
      aitid: "1001",
      cells: [
        {
          aitid: "1002",
          colWidth: 60,
          text: "",
        },
      ],
    });
  });

  test("New header row", async () => {
    const nr = newHeaderRow(30);
    expect(nr).toEqual({
      aitid: "1001",
      cells: [
        {
          aitid: "1002",
          colWidth: 30,
          colSpan: 1,
          text: "",
          rowSpan: 1,
        },
      ],
    });
  });
});
