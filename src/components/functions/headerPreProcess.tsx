import { v4 as uuidv4 } from 'uuid';
import { AitRowGroupData } from "../ait";
import { rowPreProcess } from "./rowPreProcess";

/**
 * Preprocess headerData row group
 * @param rg 
 * @returns compliant row group
 */
export const headerPreProcess = (rg?: AitRowGroupData): AitRowGroupData => {
  if (rg === undefined) return { aitid: uuidv4(), rows: [] };
  return {
    ...rg,
    rows: rowPreProcess(rg.rows),
    aitid: rg.aitid ?? uuidv4(),
  }
}