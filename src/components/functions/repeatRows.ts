
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

  //  newRows = replaceRows(newRows, flattenReplacements(replacements, externalLists), externalLists);
  // Process rows if there are replacements
  if ((replacements?.length ?? 0) > 0) for (let si = 0; si < replacements!.length; si++) {
    newRows = replaceRows(newRows, updateExternals(replacements![si], externalLists));
    if (si > 0) newRows = newRows.map(r => { return { ...r, aitid: `${r.aitid}-[${si}]` } });
    console.log("w");
  }

  return { rows: newRows };
};
