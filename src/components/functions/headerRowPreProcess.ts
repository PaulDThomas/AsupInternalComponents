import { AitHeaderRowData } from "components/ait/aitInterface";
import { v4 as uuidv4 } from "uuid";
import { headerCellPreProcess } from "./headerCellPreProcess";
import { newRow } from "./newRow";

/**
 * Preprocess row data
 * @param rs
 * @returns Compliant row
 */
export const headerRowPreProcess = (
  defaultCellWidth: number,
  rs?: AitHeaderRowData[],
): AitHeaderRowData[] => {
  // Return an empty row if there is nothing
  if (rs === undefined) return [newRow(0, defaultCellWidth)];
  // Check aitid
  return rs.map((r) => {
    return {
      ...r,
      cells: headerCellPreProcess(defaultCellWidth, r.cells),
      aitid: r.aitid ?? uuidv4(),
    };
  });
};
