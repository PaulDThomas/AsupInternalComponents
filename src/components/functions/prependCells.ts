import { AitCellData, AitRowData } from "../ait/aitInterface";
import { newCell } from "./newCell";
import { newRow } from "./newRow";

export const prependCell = (pre: AitCellData, post?: AitRowData[]): AitRowData[] => {
  if (!post) {
    let r = newRow(1);
    r.cells = [pre];
    return [r];
  }

  let newRows: AitRowData[] = [];

  // Cycle through post rows
  for (let ri = 0; ri < post.length; ri++) {
    let postRows = post.length - 1;
    newRows.push({
      aitid: post[ri].aitid,
      cells: [
        ri === 0
          ? {
            ...pre,
            repeatRowSpan: (pre.repeatRowSpan ?? pre.rowSpan ?? 1) + postRows
          }
          : { ...newCell(), rowSpan: 0, repeatRowSpan: 0, replacedText: 'prependFiller' }
        ,
        ...post[ri].cells,
      ],
      rowRepeat: post[ri].rowRepeat,
    })
  }
  return newRows;
}
