import { AitHeaderRowData, AitRowData } from "../table/interface";

/**
 * Add rows to the right of more rows
 * @param base Initial block of rows
 * @param append block of rows to add to the right
 * @returns Consolidated rows
 */
export const appendCells = <T extends AitRowData | AitHeaderRowData>(
  base: T[],
  append: T[],
): T[] => {
  return base.map((r, ri) => {
    return {
      aitid: r.aitid,
      cells: [...r.cells, ...append[ri].cells],
    } as T;
  });
};
