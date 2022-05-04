
import { AioExternalReplacements, AioReplacement } from "../aio";
import { AitRowData } from "../ait";
import { removeRowRepeatInfo } from "./removeRowRepeatInfo";
import { replaceRows } from "./replaceRows";
import { updateExternals } from "./updateExternals";

/**
 * Repeat rows based on repeat number array with potential for partial repeats
 * @param rows
 * @param noProcessing
 * @param replacements
 * @param rowHeaderColumns
 * @returns
 */
export const repeatRows = (
  rows: AitRowData[],
  replacements?: AioReplacement[],
  spaceAfter?: boolean,
  noProcessing?: boolean,
  externalLists?: AioExternalReplacements[],
): { rows: AitRowData[]; } => {

  // Create initial return
  let newRows = removeRowRepeatInfo(rows);

  // Strip repeat data if flagged 
  if (noProcessing
    || rows.length === 0
    || !replacements
    || replacements.length === 0
  ) {
    return { rows: newRows };
  }

  // Process rows if there are replacements
  let extReplacements = updateExternals(replacements, externalLists)
  if ((extReplacements?.length ?? 0) > 0) for (let si = 0; si < extReplacements!.length; si++) {
    newRows = replaceRows(newRows, extReplacements![si]);
    // Process spaceAfter
    for (let ri = newRows.length - 1; ri >= 0; ri--) {
      // Start cell counter
      // Add spaceAfter for final row automatically
      if (spaceAfter && ri === newRows.length - 1) {
        newRows[ri].spaceAfter = true;
      }
      else {
        // Look down each column
        for (let ci = 0; ci < newRows[0].cells.length; ci++) {
          // Cycle through each column cell
          for (let ri = 0; ri < newRows.length; ri++) {
            let targetCell = newRows[ri].cells[ci];
            // Add space below appropriate rows if required
            if ((targetCell.repeatRowSpan ?? 1) > 0 && (targetCell.rowSpan ?? 1) > 0 && targetCell.spaceAfterRepeat && !newRows[ri + (targetCell.rowSpan ?? 1) - 1].spaceAfter) {
              newRows[ri + (targetCell.repeatRowSpan ?? targetCell.rowSpan ?? 1) - 1].spaceAfter = true;
              let lookback = 1;
              // Check previous cells
              while (lookback <= ci) {
                let checkCell = newRows[ri].cells[ci - lookback];
                // Add span to any preceeding rowSpans > 1
                if ((checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) > 1) {
                  checkCell.repeatRowSpan = (checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) + 1;
                }
                // Look up when cells have span = 0
                else if ((checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) === 0) {
                  let lookup = 1;
                  let found = false;
                  while (lookup <= ri && !found) {
                    checkCell = newRows[ri - lookup].cells[ci - lookback];
                    if ((checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) > 1) {
                      found = true;
                      checkCell.repeatRowSpan = (checkCell.repeatRowSpan ?? checkCell.rowSpan ?? 1) + 1;
                    }
                    lookup++;
                  }
                }
                lookback++;
              }
            }
          }
        }

      }
    }
  }

  return { rows: newRows };
};
