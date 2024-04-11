import { v4 as uuidv4 } from "uuid";
import { newCell } from "./newCell";
import { newRow } from "./newRow";
import { AitCellData, AitRowGroupData } from "../table/interface";

/**
 * Add newRowGroupTemplate to existing body
 * @param l - Length of row
 * @param newRowGroupTemplate
 * @returns New row group
 */
export const newRowGroup = <T extends string | object>(
  defaultCellWidth: number,
  l?: number,
  newRowGroupTemplate?: AitRowGroupData<T>,
): AitRowGroupData<T> => {
  return {
    aitid: uuidv4(),
    replacements: newRowGroupTemplate?.replacements ?? [],
    rows: newRowGroupTemplate?.rows.map((row) => {
      const newCells: AitCellData<T>[] = [];
      for (let ci = 0; ci < (l ?? 1); ci++) {
        newCells.push(
          row.cells[ci] !== undefined
            ? { ...row.cells[ci], aitid: uuidv4() }
            : newCell(defaultCellWidth),
        );
      }
      return {
        aitid: uuidv4(),
        cells: newCells,
      };
    }) ?? [newRow(defaultCellWidth, l)],
    spaceAfter: true,
  };
};
