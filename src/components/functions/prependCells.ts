import { AitCellData, AitRowData } from "../ait/aitInterface";
import { newCell } from "./newCell";
import { newRow } from "./newRow";

export const prependCell = (pre: AitCellData, post?: AitRowData[]): AitRowData[] => {
  if (!post) {
    let r = newRow(1);
    r.cells = [pre];
    return [r];
  }

  if (post.length > (pre.repeatRowSpan ?? pre.rowSpan ?? 1)) {
    pre.repeatRowSpan = post.length;
  }

  let newRows: AitRowData[] = [];

  // Cycle through post rows
  for (let ri = 0; ri < post.length; ri++) {
    newRows.push({
      aitid: post[ri].aitid,
      cells: [
        ri === 0
          ? { ...pre, repeatRowSpan: (pre.repeatRowSpan ?? pre.rowSpan ?? 1) + post.length - 1 }
          : { ...newCell(), rowSpan: 0, repeatRowSpan: 0, replacedText: 'prependFiller' }
        ,
        ...post[ri].cells,
      ],
      spaceAfter: post[ri].spaceAfter,
    })
  }
  return newRows;
}
