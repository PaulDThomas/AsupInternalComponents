import { v4 as uuidv4 } from "uuid";
import { rowPreProcess } from "./rowPreProcess";
import { AitRowGroupData } from "../table/interface";

/**
 * Preprocessing for bodyData row groups
 * @param rgs
 * @returns compliant row groups
 */
export const bodyPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  rgs?: AitRowGroupData<T>[],
): AitRowGroupData<T>[] => {
  if (rgs === undefined) return [];
  return rgs.map((rg) => {
    return {
      ...rg,
      rows: rowPreProcess(defaultCellWidth, rg.rows),
      aitid: rg.aitid ?? uuidv4(),
    };
  });
};
