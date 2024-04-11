import { AitHeaderRowData, AitRowData } from "../table/interface";

/**
 * Add rows to the right of more rows
 * @param base Initial block of rows
 * @param append block of rows to add to the right
 * @returns Consolidated rows
 */
export const appendCells = <
  T extends string | object,
  R extends AitRowData<T> | AitHeaderRowData<T>,
>(
  base: R[],
  append: R[],
): R[] => {
  return base.map((r, ri) => {
    return {
      aitid: r.aitid,
      cells: [...r.cells, ...append[ri].cells],
    } as R;
  });
};
