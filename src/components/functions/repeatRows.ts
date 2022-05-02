
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

  // Process rows if there are replacements
  let extReplacements = updateExternals(replacements, externalLists)
  if ((extReplacements?.length ?? 0) > 0) for (let si = 0; si < extReplacements!.length; si++) {
    newRows = replaceRows(newRows, extReplacements![si]);
  }

  return { rows: newRows };
};
