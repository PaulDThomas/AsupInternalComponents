import { AitCellType, AitCellData } from "components/ait/aitInterface";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a blank new cell
 * @param type Type of cell to create
 * @returns data for a new blank cell
 */
export const newCell = (type?: AitCellType): AitCellData => {
  let cell: AitCellData = { aitid: uuidv4(), text: "", rowSpan: 1, colSpan: 1 };
  if (type === AitCellType.header)
    cell.colWidth = 60;
  return cell;
};
