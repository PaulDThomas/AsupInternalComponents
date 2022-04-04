import { AitRowData } from "../ait/aitInterface";

/**
 * Add another block of cells onto the right of a row
 * @param base Initial block of rows
 * @param block of rows to add to the right
 * @returns Consolidated rows
 */
export const appendCells = (base: AitRowData[], append: AitRowData[]): AitRowData[] => {
  return base.map((r, ri) => {
    return {
      aitid: r.aitid,
      cells: [...r.cells, ...append[ri]?.cells],
    } as AitRowData;
  });
};
