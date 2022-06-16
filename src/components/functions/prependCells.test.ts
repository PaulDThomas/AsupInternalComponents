import { AitCellData, AitRowData } from "../ait";
import { newCell } from "./newCell";
import { prependCell } from "./prependCells";

describe('Check prependCells', () => {
  // Set up cell data
  let a: AitCellData = { text: "A" };
  let b: AitCellData = { text: "B", rowSpan: 2, };
  let c: AitCellData = { text: "C", repeatRowSpan: 3, };
  let cellsA = [a, b, c];

  // Set up row data
  let x: AitRowData[] = [{ cells: [{ ...a }] }];
  let y: AitRowData[] = [{ cells: [{ ...a }] }, { cells: [{ ...a }] }];
  let z: AitRowData[] = [{ cells: [{ ...a }] }, { cells: [{ ...a }] }, { cells: [{ ...a }] }];
  let rowsA = [x, y, z];

  // Set up matrix to test all types
  for (let ci = 0; ci < cellsA.length; ci++) {
    let cell = cellsA[ci];
    for (let ri = 0; ri < rowsA.length; ri++) {
      let rows = rowsA[ri]
      // Set rows added
      for (let ai = 0; ai < rows.length; ai++) {

        test(`Prepend cell ${cell.text}, onto ${rows.length} row(s), with ${ai} row(s) added. `, () => {
          let ret: AitRowData[] = prependCell(cell, rows, ai);

          expect(ret.length).toBe(rows.length);
          expect(ret.findIndex(r => r.cells.length !== 2)).toBe(-1);
          expect(ret[0].cells[0].text).toBe(cell.text);
          expect(ret[0].cells[0].repeatRowSpan).toBe((cell.repeatRowSpan ?? cell.rowSpan ?? 1) + ai)

          for (let reti = 1; reti < ret.length; reti++) {
            expect(ret[reti].cells[0].replacedText).toBe('prependFiller');
          }
        });
      }
    }
  }

  let reps = 5;
  test(`${reps} prepends`, () => {
    let ret: AitRowData[] = [{ cells: [{ text: "Start" }] }];
    let lastRowCount = ret.length;
    for (let repi = 0; repi < reps; repi++) {
      ret = prependCell(a, ret, repi);
      expect(ret.length).toBe(lastRowCount);
      expect(ret.findIndex(r => r.cells.length !== repi + 2)).toBe(-1);
      // Add in another row
      ret.push({ cells: Array(repi+2).fill({...newCell(), text: `Added:${repi}`})});
      lastRowCount = ret.length;
    }
  });
});