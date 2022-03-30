import structuredClone from "@ungap/structured-clone";
import { AioReplacement } from "../aio/aioInterface";
import { AitCellData, AitColumnRepeat, AitRowData } from "../ait/aitInterface";

export const repeatHeaders = (
  rows: AitRowData[],
  replacements?: AioReplacement[],
  noProcessing?: boolean,
  rowHeaderColumns?: number
): { rows: AitRowData[]; columnRepeats: AitColumnRepeat[]; } => {

  let newHeaderRows = structuredClone(rows);
  let newColumnRepeats = Array.from(rows[rows.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat; });

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
      rows: rows.map(r => {
        return {
          aitid: r.aitid,
          cells: r.cells.map(c => {
            return {
              ...c,
              replaceText: undefined,
              repeatColSpan: undefined,
              repeatRowSpan: undefined,
            } as AitCellData;
          })
        } as AitRowData;
      }),
      columnRepeats: newColumnRepeats
    };

  // Loop through all replacements in order
  // replaceLoop: for (let repi = 0; repi < replacements.length; repi++) {
  //   let [foundEntries, newHeaderRows, newColumnRepeats] = replaceColumns(newHeaderRows, newColumnRepeats, )
  //   if (!foundEntries) break replaceLoop;
  // }
  // // Process parts of replacements into single objects
  // let replacementTexts: AioReplacementText[] = replacements.map(rep => rep.replacementTexts).flat();
  // let repeats = getRepeats(replacements);
  // // Stop processing if there is nothing to repeat 
  // if (!repeats?.numbers
  //   || repeats.numbers.length === 0
  // )
  //   return {
  //     rows: rows.map(r => removeRowRepeatInfo(r)),
  //     columnRepeats: [defaultRepeat]
  //   };
  // // Get row numbers that contain the repeat texts 
  // let targetArray = findTargets(rows, replacementTexts);
  // // Stop if first level is inside the rowHeaderColumns
  // if (targetArray.length === 0
  //   || targetArray[0].column < (rowHeaderColumns ?? 0)
  // )
  //   return {
  //     rows: rows.map(r => removeRowRepeatInfo(r)),
  //     columnRepeats: [defaultRepeat]
  //   };
  // // Work out which columns are repeating
  // let columnsToRepeat = rows[targetArray[0].row].cells[targetArray[0].column].colSpan ?? 1;
  // // Get column headers as a row object to process
  // let targetBlock = transposeCells(
  //   rows.map(r => {
  //     let rowSlice: AitRowData = {
  //       aitid: r.aitid,
  //       cells: r.cells.slice(targetArray[0].column, targetArray[0].column + columnsToRepeat),
  //     }
  //     return rowSlice;
  //   })
  // );
  // // Rows to the returned by this function 
  // let { newRows, newRepeatValues, newRepeatNumbers, originalRow } = createRepeats(repeats, targetBlock, targetArray);
  // // Update text based on repeats
  // replaceText(newRows, replacementTexts, newRepeatValues);
  // // Process newRows add rowSpan in rowHeaders
  // updateRowSpans(newRows, columnsToRepeat);
  // // Change back to column headers
  // let newBlock = transposeCells(newRows);
  // let newHeaderInfo: [AitRowData, AitColumnRepeat[]][] = rows.map((r, ri) => {
  //   let newRow: AitRowData = { aitid: r.aitid, cells: [] };
  //   let columnRepeat: AitColumnRepeat[] = []
  //   // Add cells before
  //   if (targetArray[0].column > 0) {
  //     newRow.cells.push(...r.cells.slice(0, targetArray[0].column));
  //     columnRepeat.push(...Array.from(r.cells.slice(0, targetArray[0].column).keys()).map(n => {
  //       return { columnIndex: n } as AitColumnRepeat
  //     }));
  //   }
  //   // Add new block
  //   newRow.cells.push(...newBlock[ri].cells);
  //   columnRepeat.push(...Array.from(originalRow).map((n, i) => {
  //     return { columnIndex: n + targetArray[0].column, repeatNumbers: newRepeatNumbers[i] } as AitColumnRepeat
  //   }));
  //   // Add cells after
  //   if (targetArray[0].column + columnsToRepeat < r.cells.length) {
  //     newRow.cells.push(...r.cells.slice(targetArray[0].column + columnsToRepeat))
  //     columnRepeat.push(...Array.from(r.cells.slice(targetArray[0].column + columnsToRepeat).keys()).map(n => {
  //       return { columnIndex: n + targetArray[0].column + columnsToRepeat } as AitColumnRepeat
  //     }));
  //   }
  //   return [newRow, columnRepeat];
  // });
  return {
    rows: newHeaderRows,
    columnRepeats: newColumnRepeats,
  };
};
