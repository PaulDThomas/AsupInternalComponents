import { cellPreProcess } from "./cellPreProcess";
import { newRow } from "./newRow";
import { AitRowData } from "../table/interface";

/**
 * Preprocess row data
 * @param rs
 * @returns Compliant row
 */
export const rowPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  rs?: AitRowData<T>[],
): AitRowData<T>[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(0, defaultCellWidth)];
  // Check aitid
  return rs.map((r) => {
    return {
      ...r,
      cells: cellPreProcess(defaultCellWidth, r.cells),
      aitid: r.aitid ?? crypto.randomUUID(),
    };
  });
};
