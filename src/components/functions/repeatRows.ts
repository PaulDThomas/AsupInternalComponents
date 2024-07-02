import { AioExternalReplacements, AioExternalSingle, AioReplacement } from "../aio";
import { AitRowData } from "../table/interface";
import { removeRowRepeatInfo } from "./removeRowRepeatInfo";
import { replaceRows } from "./replaceRows";
import { singleReplacements } from "./singleReplacements";
import { updateExternals } from "./updateExternals";

/**
 * Repeat rows based on repeat number array with potential for partial repeats
 * @param rows
 * @param replacements
 * @param spaceAfter
 * @param noProcessing
 * @param externalLists
 * @param externalSingles
 * @returns
 */
export const repeatRows = <T extends string | object>(
  rows: AitRowData<T>[],
  defaultCellWidth: number,
  getTextFromT: (s: T) => string[],
  replaceTextInT: (s: T, oldPhrase: string, newPhrase: T) => T,
  blankT: T,
  replacements?: AioReplacement<T>[],
  spaceAfter?: boolean,
  noProcessing?: boolean,
  externalLists?: AioExternalReplacements<T>[],
  externalSingles?: AioExternalSingle<T>[],
): AitRowData<T>[] => {
  // Create initial return
  let newRows: AitRowData<T>[] = removeRowRepeatInfo<T>(rows);

  // Strip repeat data if flagged
  if (noProcessing) {
    newRows[newRows.length - 1].spaceAfter = spaceAfter;
    return newRows;
  }

  // Process rows if there are replacements
  const extReplacements = updateExternals(replacements, externalLists);

  // Check other spaceAfter if there are replacements
  if (extReplacements && extReplacements.length > 0) {
    for (let si = 0; si < extReplacements.length; si++) {
      // Data fix
      if (si > 0 && extReplacements[si].includeTrailing) {
        extReplacements[si].includeTrailing = false;
      }
      // Run current replacement
      newRows = replaceRows(
        newRows,
        defaultCellWidth,
        blankT,
        getTextFromT,
        replaceTextInT,
        extReplacements[si],
      );
    }
  }

  // Add spaceAfter for the group
  if (spaceAfter) {
    newRows[newRows.length - 1].spaceAfter = true;
  }
  // Check row space after
  newRows.forEach((row) => {
    if (row.cells.some((cell) => cell.spaceAfterRepeat)) {
      row.spaceAfter = true;
    }
  });

  // Single post processing replacements
  newRows = singleReplacements(externalSingles, newRows, replaceTextInT, blankT);

  return newRows;
};
