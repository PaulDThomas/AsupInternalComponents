import { AitCellData } from "../ait";
import { v4 as uuidv4 } from "uuid";
import { newCell } from "./newCell";

/**
 * Preprocessing for cells
 * @param cs
 * @returns compliant cell
 */
export const cellPreProcess = (defaultCellWidth: number, cs?: AitCellData[]): AitCellData[] => {
  if (cs === undefined) return [newCell(defaultCellWidth)];
  // Check aitid
  return cs.map((c) => {
    return {
      ...c,
      colSpan: c.colSpan ?? 1,
      rowSpan: c.rowSpan ?? 1,
      colWidth: c.colWidth ?? defaultCellWidth,
      aitid: c.aitid && c.aitid.length > 4 ? c.aitid : uuidv4(),
    };
  });
};
