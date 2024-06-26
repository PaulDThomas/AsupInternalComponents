import { AitHeaderCellData } from "components/ait/aitInterface";
import { v4 as uuidv4 } from "uuid";
import { newCell } from "./newCell";

/**
 * Preprocessing for cells
 * @param cs
 * @returns compliant cell
 */
export const headerCellPreProcess = (
  defaultCellWidth: number,
  cs?: AitHeaderCellData[],
): AitHeaderCellData[] => {
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
