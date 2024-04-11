import { v4 as uuidv4 } from "uuid";
import { AitCellData, AitHeaderCellData } from "../table/interface";

/**
 * Create a blank new cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newCell = <T extends string | object>(cellWidth: number): AitCellData<T> => {
  const cell: AitCellData<T> = {
    aitid: uuidv4(),
    text: "" as T,
    colWidth: cellWidth,
  };
  return cell;
};

/**
 * Create a blank new header cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newHeaderCell = <T extends string | object>(
  cellWidth: number,
): AitHeaderCellData<T> => {
  const cell: AitHeaderCellData<T> = {
    aitid: uuidv4(),
    text: "" as T,
    rowSpan: 1,
    colSpan: 1,
    colWidth: cellWidth,
  };
  return cell;
};
