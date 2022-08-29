import { AioExternalSingle } from "../aio";
import { AitRowData } from "../ait";
import { replaceCellText } from "./replaceCellText";

export function singleReplacements(externalSingles: AioExternalSingle[] | undefined, newRows: AitRowData[]): AitRowData[] {
  if (externalSingles !== undefined && externalSingles.length > 0) {
    externalSingles.forEach(e => {
      if (e.oldText !== undefined && e.oldText !== "" && e.newText !== undefined) {
        newRows = newRows.map(r => {
          return {
            ...r, cells: r.cells.map(c => replaceCellText(c, e.oldText!, e.newText ?? ""))
          };
        });
      }
    });
  }
  return newRows;
}
