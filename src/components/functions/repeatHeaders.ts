import { AioExternalReplacements, AioExternalSingle, AioReplacement } from "../aio/aioInterface";
import { AitColumnRepeat, AitRowData } from "../ait/aitInterface";
import { removeRowRepeatInfo } from "./removeRowRepeatInfo";
import { replaceHeaders } from "./replaceHeaders";
import { singleReplacements } from "./singleReplacements";
import { updateExternals } from "./updateExternals";

/**
 * Entry function to process headers with replacements
 * @param rows Initial header rows
 * @param replacements Replacement array with new values
 * @param noProcessing Stop 
 * @param rowHeaderColumns 
 * @param externalLists
 * @returns 
 */
export const repeatHeaders = (
  rows: AitRowData[],
  replacements: AioReplacement[],
  noProcessing?: boolean,
  rowHeaderColumns?: number,
  externalLists?: AioExternalReplacements[],
  externalSingles?: AioExternalSingle[],
): { rows: AitRowData[]; columnRepeats: AitColumnRepeat[]; } => {

  // Start with blank slate, need to strip repeat inforation everytime!
  let newHeaderRows: AitRowData[] = removeRowRepeatInfo(rows);
  let newColumnRepeats: AitColumnRepeat[] = Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat; });

  // Strip repeat data if flagged 
  if (noProcessing || replacements.length === 0) return {
    rows: newHeaderRows,
    columnRepeats: newColumnRepeats
  };

  // Process replacements
  updateExternals(replacements, externalLists)!.forEach((rep) => {
    let afterReplacement = replaceHeaders(
      rowHeaderColumns ?? 0,
      newHeaderRows,
      newColumnRepeats,
      rep
    );
    newHeaderRows = afterReplacement.newHeaderRows;
    newColumnRepeats = afterReplacement.newColumnRepeats;
  });

  // Single post processing rep
  newHeaderRows = singleReplacements(externalSingles, newHeaderRows);

  return { rows: newHeaderRows, columnRepeats: newColumnRepeats };
};