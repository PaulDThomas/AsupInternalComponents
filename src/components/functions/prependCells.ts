import { AitCellData, AitRowData } from "../ait/aitInterface";
import { newCell } from "./newCell";
import { newRow } from "./newRow";

export const prependCell = (
  pre: AitCellData,
  defaultCellWidth: number,
  post?: AitRowData[],
  rowsAdded?: number,
): AitRowData[] => {
  if (!post) {
    const r = newRow(1, defaultCellWidth);
    r.cells = [pre];
    return [r];
  }

  const newRows: AitRowData[] = [];

  // Cycle through post rows
  for (let ri = 0; ri < post.length; ri++) {
    newRows.push({
      aitid: post[ri].aitid,
      cells: [
        ri === 0
          ? {
              ...pre,
              repeatRowSpan:
                (pre.repeatRowSpan ?? pre.rowSpan ?? 1) + (rowsAdded ?? post.length ?? 0),
            }
          : { ...newCell(defaultCellWidth), rowSpan: 0, repeatRowSpan: 0, replacedText: "" },
        ...post[ri].cells,
      ],
      rowRepeat: post[ri].rowRepeat,
    });
  }
  return newRows;
};
