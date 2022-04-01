
import structuredClone from "@ungap/structured-clone";
import { AioReplacement, AioReplacementText, AioReplacementValue } from "components/aio/aioInterface";
import { AitColumnRepeat, AitRowData } from "components/ait/aitInterface";
import { newCell } from "./newCell";

export {};
export const replaceColumns = (
  replacements: AioReplacement[],
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
  rowHeaderColumns: number,
): [AitRowData[], AitColumnRepeat[]] => {

  // Take copy of input
  let newHeaderRows = structuredClone(rows);
  let newColumnRepeats = structuredClone(columnRepeats);

  // Loop through each replacement
  replacements.map(rep => {
    if (rep.replacementTexts[0].text === "") return false;
    if (rep.replacementValues.length === 1 && rep.replacementValues[0].newText === "") return false;
    let replaced = scanColumns(rep, newHeaderRows, newColumnRepeats, rowHeaderColumns);
    newHeaderRows = replaced.newHeaderRows;
    newColumnRepeats = replaced.newColumnRepeats;
    return true;
  });

  return [newHeaderRows, newColumnRepeats];
}

const scanColumns = (
  replacement: AioReplacement,
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
  rowHeaderColumns: number,
): { newHeaderRows: AitRowData[], newColumnRepeats: AitColumnRepeat[] } => {

  // Stop at 100 iterations... !?!
  let i = 0;
  // Scan through columns
  for (let ci = rowHeaderColumns; ci < rows[0].cells.length && i < 100; ci++) {
    i++;
    let replace = replaceInColumn(replacement, rows, columnRepeats, ci, 0);
    rows = replace.rows;
    columnRepeats = replace.columnRepeats;
    ci = replace.columnIndex;
  }

  return {
    newHeaderRows: rows,
    newColumnRepeats: columnRepeats,
  };
}

const replaceInColumn = (
  replacement: AioReplacement,
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
  columnIndex: number,
  startRow: number,
): {
  rowIndex: number,
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
  columnIndex: number
} => {

  // Look for text in the column
  let rowIndex = rows.slice(startRow).findIndex(row => row.cells[columnIndex].text.includes(replacement.replacementTexts[0].text)) + startRow;
  if (rowIndex < 0) return { rowIndex, rows, columnRepeats, columnIndex };
  console.log(`Found replacement to make in column ${columnIndex} row ${rowIndex}`);

  // let targetCell = rows[rowIndex].cells[columnIndex];
  // let repeats = replacement.replacementValues.length;

  // [rows, columnRepeats, columnIndex] = addColumnRepeats(rows, rowIndex, columnIndex, replacement.replacementTexts, replacement.replacementValues);

  return { rowIndex, rows, columnRepeats, columnIndex };
}

const addColumnRepeats = (
  rows: AitRowData[],
  rowIndex: number,
  columnIndex: number,
  replacementTexts: AioReplacementText[],
  replacementValues: AioReplacementValue[],
): AitRowData[] => {

  // Find target
  let targetCell = rows[rowIndex].cells[columnIndex];

  // Cycle through repeatValues
  for (let rvi = 0; rvi < replacementValues.length; rvi++) {

    // Expand cells above the target
    if (rvi > 0) {
      for (let ri = 0; ri < rowIndex; ri++) {
        let targetCellAbove = rows[ri].cells[columnIndex];
        // Check that colthe target is showing
        let lookback = 0;
        while (targetCellAbove.colSpan === 0 && lookback < columnIndex) {
          lookback++;
          targetCellAbove = rows[ri].cells[columnIndex - lookback];
        }
        if (targetCellAbove !== undefined) {
          targetCellAbove.repeatColSpan = (targetCellAbove.repeatColSpan ?? targetCellAbove.colSpan) + 1;
        }
        else {
          console.log("Have not found the target cell above the column header replacement");
        }
        rows[ri].cells.splice(
          columnIndex + 1,
          0,
          ...Array(1).fill(newCell()).map(c => {
            c.colSpan = 0;
            c.repeatColSpan = 0;
            return c;
          })
        );
      }
    }

    // Target row
    if (rvi === 0) {
      targetCell.replacedText = targetCell.text.replaceAll(replacementTexts[0].text, replacementValues[rvi].newText);
    }
    // Add new repeat cell
    else {
      let newCell = structuredClone(targetCell);
      newCell.replacedText = newCell.text.replaceAll(replacementTexts[0].text, replacementValues[rvi].newText);
      rows[rowIndex].cells.splice(columnIndex + rvi + 1, 0, newCell);
    }

    // Copy cells below
    if (rvi > 0) {
      for (let ri = columnIndex + 1; ri < rows.length; ri++) {
        rows[ri].cells = [
          ...rows[ri].cells.slice(0, columnIndex + targetCell.colSpan * (rvi - 1)),
          ...Array(1).fill(rows[ri].cells.slice(columnIndex, columnIndex + targetCell.colSpan)).flat(),
          ...rows[ri].cells.slice(columnIndex + targetCell.colSpan)
        ]
      }
    }
  }
  return rows;
}