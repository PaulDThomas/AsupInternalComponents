import { AitRowData } from "../ait/aitInterface";

export const removeRowRepeatInfo = (row: AitRowData): AitRowData => {
  let newRow: AitRowData = {
    aitid: row.aitid,
    cells: row.cells.map(c => {
      if (c.replacedText !== undefined)
        delete (c.replacedText);
      c.rowSpan = 1;
      return c;
    }),
  };
  return newRow;
};
