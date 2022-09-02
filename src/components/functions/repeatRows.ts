import { AioExternalReplacements, AioExternalSingle, AioReplacement } from '../aio';
import { AitRowData } from '../ait';
import { removeRowRepeatInfo } from './removeRowRepeatInfo';
import { replaceRows } from './replaceRows';
import { singleReplacements } from './singleReplacements';
import { updateExternals } from './updateExternals';

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

  // Post processing...
  newRows.forEach((r, ri) => {
    // Cycle through each column cell
    r.cells.forEach((c, ci) => {
      // Look for cells to check, rowSpan can have been increase by following repeats
      if ((c.repeatRowSpan ?? c.rowSpan ?? 1) > 0 && (c.rowSpan ?? 1) !== 0) {
        let actualSpan = newRows
          .slice(ri + 1)
          .map((r) => r.cells[ci])
          .findIndex((c) => (c.rowSpan ?? 1) > 0);
        if (actualSpan === -1) actualSpan = newRows.length - ri - 1;
        // Check if changes need to be made
        if (actualSpan + 1 > (c.repeatRowSpan ?? c.rowSpan ?? 1)) {
          c.repeatRowSpan = actualSpan + 1;
        }
      }

      // Add spaceAfter to the correct cell
      if (c.spaceAfterRepeat) {
        newRows[ri + (c.repeatRowSpan ?? c.rowSpan ?? 1) - 1].spaceAfter = true;
      }
    });
  });

  // Look for spaceAfter on trailing rows now all spaceAfter calculated
  newRows.forEach((r, ri) => {
    r.cells
      .filter((c) => (c.repeatRowSpan ?? c.rowSpan ?? 1) > 1 && (c.rowSpan ?? 1) > 0)
      .forEach((c) => {
        c.spaceAfterSpan = newRows
          .slice(ri, ri + (c.repeatRowSpan ?? c.rowSpan ?? 1))
          .filter((r) => r.spaceAfter).length;
      });
  });

  // Add spaceAfter for the group
  if (spaceAfter) {
    newRows[newRows.length - 1].spaceAfter = true;
  }

  // Single post processing replacements
  newRows = singleReplacements(externalSingles, newRows);

  return newRows;
};
