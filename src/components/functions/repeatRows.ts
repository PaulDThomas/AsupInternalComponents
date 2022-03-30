import { AitRowData } from "components/ait/aitInterface";
import { AioRepeats, AioReplacement, AioReplacementText } from "../aio/aioInterface";
import { updateRowSpans } from "./updateRowSpans";
import { createRepeats } from "./createRepeats";
import { findTargets } from "./findTargets";
import { getRepeats } from "./getRepeats";
import { removeRowRepeatInfo } from "./removeRowRepeatInfo";
import { replaceText } from "./replaceText";

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
    return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: { numbers: [[]], values: [[]], last: [[]] } };

  // Process parts of replacements into single objects
  let replacementTexts: AioReplacementText[] = replacements.map(rep => rep.replacementTexts).flat();
  let repeats = getRepeats(replacements);

  // Stop processing if there is nothing to repeat 
  if (!repeats?.numbers || repeats.numbers.length === 0)
    return { rows: rows.map(r => removeRowRepeatInfo(r)), repeats: repeats ?? { numbers: [[]], values: [[]], last: [[]] } };

  // Get row numbers that contain the repeat texts 
  let targetArray = findTargets(rows, replacementTexts);

  // Rows to the returned by this function 
  let { newRows, newRepeatValues, newRepeatNumbers, newLast } = createRepeats(repeats, rows, targetArray);

  // Update text based on repeats */
  replaceText(newRows, replacementTexts, newRepeatValues);

  // Process newRows add rowSpan in rowHeaders */
  updateRowSpans(newRows, rowHeaderColumns ?? 0);

  return { rows: newRows, repeats: { numbers: newRepeatNumbers, values: newRepeatValues, last: newLast } };
};
