import { AitRowData } from "../ait/aitInterface";

export const updateRowSpans = (
  rows: AitRowData[],
  repeatNumbers: number[][],
  rowHeaderColumns: number
) => {
  for (let r = 0; r < rows.length; r++) {
    let col = 0;
    while (col < (rowHeaderColumns ?? 0)) {
      // Get cell to check 
      let currentCell = rows[r].cells[col];
      // Ensure it has not already been udpated 
      if (currentCell?.repeatRowSpan === 0) {
        col++;
        continue;
      }
      // Start checking 
      let rowSpan = currentCell.rowSpan ?? 1;
      let rowSpanX = rows[r].spaceAfter! !== false && rows[r].spaceAfter! >= 0 ? 1 : 0;
      // Previous column rowSpan
      let prevSpan = Infinity;
      if (col > 0) {
        let lookback = 0;
        while (rows[r - lookback].cells[col - 1].repeatRowSpan === 0) lookback++;
        prevSpan = rows[r - lookback].cells[col - 1].repeatRowSpan! - lookback;
      }
      // Look for duplicate text in the next row 
      while (
        // This is a repeat
        currentCell?.replacedText !== undefined
        // There is no space after the current target row
        // && !rows[r + (rowSpan - 1)].spaceAfter
        // The rowSpan is less than the previous column
        && rowSpan < prevSpan
        // The next target row has the same text
        && rows[r + rowSpan]?.cells[col]?.replacedText === currentCell.replacedText
      ) {
        rowSpan = rowSpan + (rows[r + rowSpan].cells[col].rowSpan ?? 1);
        // Add another row if the spaceAfter is on a future column
        if (rows[r + rowSpan - 1].spaceAfter! !== false && rows[r + rowSpan - 1].spaceAfter! > col) {
          rowSpanX++;
        }
      }
      // Update rowSpans if duplicates have been found 
      if (rowSpan > 1) {
        currentCell.repeatRowSpan = rowSpan + rowSpanX;
        for (let _r = 1; _r < rowSpan; _r++) {
          rows[r + _r].cells[col].repeatRowSpan = 0;
        }
      }
      else {
        currentCell.rowSpan = 1;
      }
      col++;
    }
    while (col < rows[r].cells.length) {
      rows[r].cells[col].rowSpan = 1;
      col++;
    }
  }
};
