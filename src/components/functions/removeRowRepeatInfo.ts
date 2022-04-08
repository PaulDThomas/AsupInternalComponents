import { v4 as uuidv4 } from "uuid";
import { AitRowData } from "../ait/aitInterface";

export const removeRowRepeatInfo = (row: AitRowData): AitRowData => {
  let newRow: AitRowData = {
    aitid: row.aitid ?? uuidv4(),
    cells: row.cells.map(c => {
      if (!c.aitid) c.aitid = uuidv4();
      if (c.replacedText !== undefined)
        delete (c.replacedText);
      c.rowSpan = 1;
      return c;
    }),
  };
  return newRow;
};
