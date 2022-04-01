import { AioReplacement } from "../aio/aioInterface";
import { AitCellData, AitColumnRepeat, AitRowData } from "../ait/aitInterface";
import { flattenReplacements } from "./flattenReplacements";
import { replaceHeaders } from "./replaceHeaders";

/**
 * Entry function to process headers with replacements
 * @param rows Initial header rows
 * @param replacements Replacement array with new values
 * @param noProcessing Stop 
 * @param rowHeaderColumns 
 * @returns 
 */
export const repeatHeaders = (
  rows: AitRowData[],
  replacements: AioReplacement[],
  noProcessing?: boolean,
  rowHeaderColumns?: number
): { rows: AitRowData[]; columnRepeats: AitColumnRepeat[]; } => {

  // Start with blank slate, need to strip repeat inforation everytime!
  let newHeaderRows: AitRowData[] = rows.map(r => {
    return {
      aitid: r.aitid,
      cells: r.cells.map(c => {
        return {
          ...c,
          replacedText: undefined,
          repeatColSpan: undefined,
          repeatRowSpan: undefined,
        } as AitCellData;
      })
    } as AitRowData;
  });
  let newColumnRepeats: AitColumnRepeat[] = Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat; });

  // Strip repeat data if flagged 
  if (noProcessing || replacements.length === 0) return {
    rows: newHeaderRows,
    columnRepeats: newColumnRepeats
  };

  let replacement = flattenReplacements(replacements);

  let afterReplacement = replaceHeaders(replacement, newHeaderRows, newColumnRepeats);
  newHeaderRows = afterReplacement.newHeaderRows;
  newColumnRepeats = afterReplacement.newColumnRepeats;

  return { rows: newHeaderRows, columnRepeats: newColumnRepeats };
};

