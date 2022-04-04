import { AioRepeats, AioReplacement, AioReplacementText } from "../aio/aioInterface";
import { AitRowData } from "../ait/aitInterface";
import { createRepeats } from "./createRepeats";
import { findTargets } from "./findTargets";
import { getRepeats } from "./getRepeats";
import { removeRowRepeatInfo } from "./removeRowRepeatInfo";
import { replaceText } from "./replaceText";
import { updateRowSpans } from "./updateRowSpans";

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
  noProcessing?: boolean,
  rowHeaderColumns?: number
): { rows: AitRowData[]; repeats: AioRepeats; } => {

  // Strip repeat data if flagged 
  if (noProcessing
    || rows.length === 0
    || !replacements
    || replacements.length === 0
    || !replacements[0].replacementTexts
    || replacements[0].replacementTexts.length === 0
    || !replacements[0].replacementValues
    || replacements[0].replacementValues.length === 0)
    return {
      rows: rows.map((r, ri) => {
        let _r = removeRowRepeatInfo(r);
        if (ri === rows.length - 1) _r.spaceAfter = true;
        return _r;
      }),
      repeats: { numbers: [[]], values: [[]], last: [[]] }
    };

  // Process parts of replacements into single objects
  let replacementTexts: AioReplacementText[] = replacements.map(rep => rep.replacementTexts).flat();
  let repeats = getRepeats(replacements);

  // Stop processing if there is nothing to repeat 
  if (!repeats?.numbers || repeats.numbers.length === 0)
    return {
      rows: rows.map((r, ri) => {
        let _r = removeRowRepeatInfo(r);
        if (ri === rows.length - 1) _r.spaceAfter = true;
        return _r;
      }),
      repeats: { numbers: [[]], values: [[]], last: [[]] }
    };

  // Get row numbers that contain the repeat texts 
  let targetArray = findTargets(rows, replacementTexts);

  // Rows to the returned by this function 
  let { newRows, newRepeatValues, newRepeatNumbers, newLast } = createRepeats(repeats, rows, targetArray);

  // Update text based on repeats */
  replaceText(newRows, replacementTexts, newRepeatValues);

  // Process space after
  newRows.map((row, ri) => {
    row.spaceAfter = false;
    // Always add space after at the end of the group 
    if (ri === newRows.length - 1) row.spaceAfter = true;
    // Check for spaceAfter highest level  for within group 
    else if (newRepeatNumbers.length > 0) {
      let replacementTexts = replacements.map(r => r.replacementTexts).flat();
      let checkSpaceLevel: number = replacementTexts?.reduce((r, a, i) => a.spaceAfter === true ? i : r, -1) ?? -1;
      let isLastLevel: number = newLast[ri]?.reduce((l, a, i) => a ? Math.min(l, i) : i + 1, 1);
      row.spaceAfter = checkSpaceLevel >= isLastLevel;
    }
    return true;
  });

  // Process newRows add rowSpan in rowHeaders */
  updateRowSpans(newRows, newRepeatNumbers, rowHeaderColumns ?? 0);

  return { rows: newRows, repeats: { numbers: newRepeatNumbers, values: newRepeatValues, last: newLast } };
};
