import { AitHeaderRowData } from "components/ait/aitInterface";
import { AioExternalSingle } from "../aio";
import { AitRowData } from "../ait";
import { replaceCellText } from "./replaceCellText";

export function singleReplacements<T extends AitRowData | AitHeaderRowData>(
  externalSingles: AioExternalSingle[] | undefined,
  newRows: T[],
): T[] {
  if (externalSingles !== undefined && externalSingles.length > 0) {
    externalSingles.forEach((e) => {
      if (e.oldText !== undefined && e.oldText !== "" && e.newText !== undefined) {
        newRows = newRows.map((r) => {
          return {
            ...r,
            cells: r.cells.map((c) => replaceCellText(c, e.oldText ?? "", e.newText ?? "")),
          };
        });
      }
    });
  }
  return newRows;
}
