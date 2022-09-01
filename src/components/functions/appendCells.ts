import { AitRowData } from '../ait/aitInterface';

/**
 * Add rows to the right of more rows
 * @param base Initial block of rows
 * @param append block of rows to add to the right
 * @returns Consolidated rows
 */
export const appendCells = (base: AitRowData[], append: AitRowData[]): AitRowData[] => {
  return base.map((r, ri) => {
    return {
      aitid: r.aitid,
      cells: [...r.cells, ...append[ri].cells],
    } as AitRowData;
  });
};
