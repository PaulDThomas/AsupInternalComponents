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
export const repeatRows = (
  rows: AitRowData[],
  defaultCellWidth: number,
  replacements?: AioReplacement[],
  spaceAfter?: boolean,
  noProcessing?: boolean,
  externalLists?: AioExternalReplacements[],
  externalSingles?: AioExternalSingle[],
): AitRowData[] => {
  // Create initial return
  let newRows = removeRowRepeatInfo(rows);

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
      newRows = replaceRows(newRows, defaultCellWidth, extReplacements[si]);
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
  newRows = singleReplacements(externalSingles, newRows);

  return newRows;
};
