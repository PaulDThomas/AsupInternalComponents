import { AitRowData } from "../ait";
import { v4 as uuidv4 } from "uuid";
import { cellPreProcess } from "./cellPreProcess";
import { newRow } from "./newRow";

/**
 * Preprocess row data
 * @param rs
 * @returns Compliant row
 */
export const rowPreProcess = (defaultCellWidth: number, rs?: AitRowData[]): AitRowData[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(0, defaultCellWidth)];
  // Check aitid
  return rs.map((r) => {
    return {
      ...r,
      cells: cellPreProcess(defaultCellWidth, r.cells),
      aitid: r.aitid ?? uuidv4(),
    };
  });
};
