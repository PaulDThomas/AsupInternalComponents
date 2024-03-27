import { AitCellData, AitRowData } from "../ait";
import { newCell } from "./newCell";
import { prependCell } from "./prependCells";

describe("Check prependCells", () => {
  // Set up cell data
  const a: AitCellData = { text: "A" };
  const b: AitCellData = { text: "B", rowSpan: 2 };
  const c: AitCellData = { text: "C", repeatRowSpan: 3 };
  const cellsA = [a, b, c];

  // Set up row data
  const x: AitRowData[] = [{ cells: [{ ...a }] }];
  const y: AitRowData[] = [{ cells: [{ ...a }] }, { cells: [{ ...a }] }];
  const z: AitRowData[] = [{ cells: [{ ...a }] }, { cells: [{ ...a }] }, { cells: [{ ...a }] }];
  const rowsA = [x, y, z];

  // Set up matrix to test all types
  for (let ci = 0; ci < cellsA.length; ci++) {
    const cell = cellsA[ci];
    for (let ri = 0; ri < rowsA.length; ri++) {
      const rows = rowsA[ri];
      // Set rows added
      for (let ai = 0; ai < rows.length; ai++) {
        test(`Prepend cell ${cell.text}, onto ${rows.length} row(s), with ${ai} row(s) added. `, () => {
          const ret: AitRowData[] = prependCell(cell, 60, rows, ai);

          expect(ret.length).toBe(rows.length);
          expect(ret.findIndex((r) => r.cells.length !== 2)).toBe(-1);
          expect(ret[0].cells[0].text).toBe(cell.text);
          expect(ret[0].cells[0].repeatRowSpan).toBe(
            (cell.repeatRowSpan ?? cell.rowSpan ?? 1) + ai,
          );

          for (let reti = 1; reti < ret.length; reti++) {
            expect(ret[reti].cells[0].replacedText).toBe("");
          }
        });
      }
    }
  }

  const reps = 5;
  test(`${reps} prepends`, () => {
    let ret: AitRowData[] = [{ cells: [{ text: "Start" }] }];
    let lastRowCount = ret.length;
    for (let repi = 0; repi < reps; repi++) {
      ret = prependCell(a, 60, ret, repi);
      expect(ret.length).toBe(lastRowCount);
      expect(ret.findIndex((r) => r.cells.length !== repi + 2)).toBe(-1);
      // Add in another row
      ret.push({ cells: Array(repi + 2).fill({ ...newCell(60), text: `Added:${repi}` }) });
      lastRowCount = ret.length;
    }
  });
});
