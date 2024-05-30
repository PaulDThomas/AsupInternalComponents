import { AioExternalReplacements, AioExternalSingle, AioReplacement } from "../aio";
import { AitColumnRepeat, AitHeaderRowData, AitRowData } from "../table/interface";
import { removeHeaderRowRepeatInfo } from "./removeRowRepeatInfo";
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
export const repeatHeaders = <T extends string | object>(
  rows: AitHeaderRowData<T>[],
  replacements: AioReplacement[],
  defaultCellWidth: number,
  getTextFromT: (s: T) => string[],
  replaceTextInT: (s: T, oldPhrase: string, newPhrase: string) => T,
  noProcessing?: boolean,
  rowHeaderColumns?: number,
  externalLists?: AioExternalReplacements[],
  externalSingles?: AioExternalSingle[],
): { rows: AitRowData<T>[]; columnRepeats: AitColumnRepeat[] } => {
  // Start with blank slate, need to strip repeat inforation everytime!
  let newHeaderRows: AitHeaderRowData<T>[] = removeHeaderRowRepeatInfo(rows);
  let newColumnRepeats: AitColumnRepeat[] = Array.from(rows[rows.length - 1].cells.keys()).map(
    (n) => {
      return { columnIndex: n } as AitColumnRepeat;
    },
  );

  // Strip repeat data if flagged
  if (noProcessing)
    return {
      rows: newHeaderRows,
      columnRepeats: newColumnRepeats,
    };

  // Process replacements
  (updateExternals(replacements, externalLists) ?? []).forEach((rep) => {
    const afterReplacement = replaceHeaders(
      rowHeaderColumns ?? 0,
      newHeaderRows,
      newColumnRepeats,
      defaultCellWidth,
      getTextFromT,
      replaceTextInT,
      rep,
      undefined,
    );
    newHeaderRows = afterReplacement.newHeaderRows;
    newColumnRepeats = afterReplacement.newColumnRepeats;
  });

  // Single post processing rep
  newHeaderRows = singleReplacements(externalSingles, newHeaderRows, replaceTextInT);

  return { rows: newHeaderRows, columnRepeats: newColumnRepeats };
};
