
import { AioExternalReplacements, AioExternalSingle, AioReplacement } from "../aio";
import { AitRowData } from "../ait";
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
  replacements?: AioReplacement[],
  spaceAfter?: boolean,
  noProcessing?: boolean,
  externalLists?: AioExternalReplacements[],
  externalSingles?: AioExternalSingle[],
): AitRowData[] => {

  // Create initial return
  let newRows = removeRowRepeatInfo(rows);

  // Strip repeat data if flagged 
  if (noProcessing
  ) {
    newRows[newRows.length - 1].spaceAfter = spaceAfter;
    return newRows;
  }

  // Process rows if there are replacements
  let extReplacements = updateExternals(replacements, externalLists);

  // Check other spaceAfter if there are replacements
  if ((extReplacements?.length ?? 0) > 0) for (let si = 0; si < extReplacements!.length; si++) {
    // Data fix
    if (si > 0 && extReplacements![si].includeTrailing) {
      extReplacements![si].includeTrailing = false;
    }
    // Run current replacement
    newRows = replaceRows(newRows, extReplacements![si]);
    // Add spaceAfter for the group
    if (spaceAfter) {
      newRows[newRows.length - 1].spaceAfter = true;
    }
    // Process spaceAfter
    for (let ri = 0; ri < newRows.length; ri++) {
      // Start cell counter, Look down each column
      for (let ci = 0; ci < newRows[0].cells.length; ci++) {
        // Cycle through each column cell
        for (let ri = 0; ri < newRows.length; ri++) {
          let targetCell = newRows[ri].cells[ci];
          // Add space below appropriate rows if required
          if (
            (targetCell.repeatRowSpan ?? targetCell.rowSpan ?? 1) > 0 &&
            targetCell.spaceAfterRepeat &&
            ri + (targetCell.repeatRowSpan ?? targetCell.rowSpan ?? 1) - 1 < newRows.length &&
            !newRows[ri + (targetCell.repeatRowSpan ?? targetCell.rowSpan ?? 1) - 1].spaceAfter
          ) {
            newRows[ri + (targetCell.repeatRowSpan ?? targetCell.rowSpan ?? 1) - 1].spaceAfter = true;
            let lookback = 1;
            // Check previous cells
            while (lookback <= ci) {
              let lookup = 0;
              let found = false;
              while (lookup <= ri && !found) {
                let checkCell = newRows[ri - lookup].cells[ci - lookback];
                if ((checkCell.rowSpan !== 0 && (checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) > 1)) {
                  found = true;
                  checkCell.spaceAfterSpan = (checkCell.spaceAfterSpan ?? 0) + 1;
                }
                lookup++;
              }
              lookback++;
            }
          }
        }
      }
    }
  }

  // Single post processing replacements
  newRows = singleReplacements(externalSingles, newRows);

  return newRows;
};