import { newCell } from "./newCell";
import { AitCellData } from "../table/interface";

/**
 * Preprocessing for cells
 * @param cs
 * @returns compliant cell
 */
export const cellPreProcess = <T extends string | object>(
  defaultCellWidth: number,
  cs?: AitCellData<T>[],
): AitCellData<T>[] => {
  if (cs === undefined) return [newCell(defaultCellWidth)];
  // Check aitid
  return cs.map((c) => {
    return {
      aitid: c.aitid && c.aitid.length > 4 ? c.aitid : crypto.randomUUID(),
      text: c.text,
      justifyText: c.justifyText,
      comments: c.comments,
      colWidth: c.colWidth ?? defaultCellWidth,
      textIndents: c.textIndents,
      replacedText: c.replacedText,
      spaceAfterRepeat: c.spaceAfterRepeat,
    };
  });
};
