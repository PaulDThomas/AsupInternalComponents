import { AitRowData } from "components/ait";
import { v4 as uuidv4 } from 'uuid';
import { cellPreProcess } from "./cellPreProcess";
import { newRow } from "./newRow";

/**
 * Preprocess row data
 * @param rs 
 * @returns Compliant row
 */
export const rowPreProcess = (rs?: AitRowData[]): AitRowData[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(0)];
  // Check aitid
  return rs.map(r => {
    return {
      ...r,
      cells: cellPreProcess(r.cells),
      aitid: r.aitid ?? uuidv4(),
    };
  });
};
