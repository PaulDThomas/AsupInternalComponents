import { v4 as uuidv4 } from "uuid";
import { newCell } from "./newCell";
import { AitHeaderCellData } from "../table/interface";

/**
 * Preprocessing for cells
 * @param cs
 * @returns compliant cell
 */
export const headerCellPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  cs?: AitHeaderCellData<T>[],
): AitHeaderCellData<T>[] => {
  if (cs === undefined) return [newCell(defaultCellWidth)];
  // Check aitid
  return cs.map((c) => {
    return {
      aitid: c.aitid && c.aitid.length > 4 ? c.aitid : uuidv4(),
      text: c.text,
      justifyText: c.justifyText,
      comments: c.comments,
      colWidth: c.colWidth ?? defaultCellWidth,
      textIndents: c.textIndents,
      replacedText: c.replacedText,
      repeatRowSpan: c.repeatRowSpan,
      spaceAfterRepeat: c.spaceAfterRepeat,
      spaceAfterSpan: c.spaceAfterSpan,
      colSpan: c.colSpan,
      rowSpan: c.rowSpan,
      repeatColSpan: c.repeatColSpan,
    };
  });
};
