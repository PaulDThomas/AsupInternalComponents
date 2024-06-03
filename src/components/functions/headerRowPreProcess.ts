import { headerCellPreProcess } from "./headerCellPreProcess";
import { newRow } from "./newRow";
import { AitHeaderRowData } from "../table/interface";

/**
 * Preprocess row data
 * @param rs
 * @returns Compliant row
 */
export const headerRowPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  blank: T,
  rs?: AitHeaderRowData<T>[],
): AitHeaderRowData<T>[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(defaultCellWidth, blank, 0)];
  // Check aitid
  return rs.map((r) => {
    return {
      ...r,
      cells: headerCellPreProcess(defaultCellWidth, blank, r.cells),
      aitid: r.aitid ?? crypto.randomUUID(),
    };
  });
};
