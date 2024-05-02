import { AitHeaderRowData, AitRowData } from "components/table/interface";
import { AioExternalSingle } from "../aio";
import { replaceCellText } from "./replaceCellText";

export function singleReplacements<
  T extends string | object,
  R extends AitRowData<T> | AitHeaderRowData<T>,
>(
  externalSingles: AioExternalSingle[] | undefined,
  newRows: R[],
  replaceText: (s: T, oldPhrase: string, newPhrase: string) => T,
): R[] {
  if (externalSingles !== undefined && externalSingles.length > 0) {
    externalSingles.forEach((e) => {
      if (e.oldText !== undefined && e.oldText !== "" && e.newText !== undefined) {
        newRows = newRows.map((r) => {
          return {
            ...r,
            cells: r.cells.map((c) =>
              replaceCellText(c, e.oldText ?? "", e.newText ?? "", replaceText),
            ),
          };
        });
      }
    });
  }
  return newRows;
}
