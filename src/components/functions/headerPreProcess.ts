import { v4 as uuidv4 } from "uuid";
import { headerRowPreProcess } from "./headerRowPreProcess";
import { AitHeaderGroupData } from "../table/interface";

/**
 * Preprocess headerData row group
 * @param rg
 * @returns compliant row group
 */
export const headerPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  rg?: AitHeaderGroupData<T> | false,
): AitHeaderGroupData<T> | false => {
  if (rg === undefined) return { aitid: uuidv4(), rows: [] };
  if (rg === false) return false;
  return {
    ...rg,
    rows: headerRowPreProcess(defaultCellWidth, rg.rows),
    aitid: rg.aitid ?? uuidv4(),
  };
};
