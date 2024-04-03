import { v4 as uuidv4 } from "uuid";
import { AitCellData, AitHeaderCellData } from "../ait/aitInterface";

/**
 * Create a blank new cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newCell = (cellWidth: number): AitCellData => {
  const cell: AitCellData = {
    aitid: uuidv4(),
    text: "",
    colWidth: cellWidth,
  };
  return cell;
};

/**
 * Create a blank new header cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newHeaderCell = (cellWidth: number): AitHeaderCellData => {
  const cell: AitHeaderCellData = {
    aitid: uuidv4(),
    text: "",
    rowSpan: 1,
    colSpan: 1,
    colWidth: cellWidth,
  };
  return cell;
};
