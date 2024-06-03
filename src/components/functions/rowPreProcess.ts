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
  blank: T,
  rs?: AitRowData<T>[],
): AitRowData<T>[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(defaultCellWidth, blank, 0)];
  // Check aitid
  return rs.map((r) => {
    return {
      ...r,
      cells: cellPreProcess(defaultCellWidth, blank, r.cells),
      aitid: r.aitid ?? crypto.randomUUID(),
    };
  });
};
