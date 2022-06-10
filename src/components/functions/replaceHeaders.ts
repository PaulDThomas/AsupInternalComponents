import { getRawTextParts } from "../aie";
import { AioExternalReplacements, AioReplacement } from "../aio";
import { AitCellData, AitColumnRepeat, AitRowData } from "../ait";
import { appendCells } from "./appendCells";
import { flattenReplacements } from "./flattenReplacements";
import { newCell } from "./newCell";
import { replaceCellText } from "./replaceCellText";

/**
 * Recursive function to replace column header information
 * @param replacement Single set of replacment text
 * @param rows Header rows
 * @param columnRepeats Column repeat string
 * @returns Updated rows
 */
export const replaceHeaders = (
  rowHeaderColumns: number,
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
  replacement?: AioReplacement,
  externalLists?: AioExternalReplacements[],
): { newHeaderRows: AitRowData[]; newColumnRepeats: AitColumnRepeat[]; } => {

  // Check there are rows
  if (rows.length === 0)
    return { newHeaderRows: [], newColumnRepeats: [] };


  // Set up holders
  let newHeaderRows: AitRowData[] = rows.map(r => { return { aitid: r.aitid, cells: [] }; });
  let newColumnRepeats: AitColumnRepeat[] = [];

  // Go through each column
  let colsProcessed = 1;
  let addedCols = 0;
  for (let ci = 0; ci < rows[0].cells.length; ci = ci + colsProcessed) {

    // Look for match, is there is one to find
    let found = (
      replacement === undefined
      || replacement.oldText === ""
      || replacement.newTexts.length === 0
      || replacement.newTexts[0].texts.join("") === ""
    );
    colsProcessed = 1;

    // Add next column if the text is already found
    if (found || ci < rowHeaderColumns) {
      newHeaderRows = appendCells(
        newHeaderRows,
        rows.map(r => {
          return {
            aitid: r.aitid,
            cells: [r.cells[ci]],
          } as AitRowData;
        })
      );
      newColumnRepeats = [...newColumnRepeats, columnRepeats[ci]];
    }

    // Go through each row if we are still looking
    else {
      for (let ri = 0; ri < rows.length; ri++) {
        let cellTextParts: string[] = getRawTextParts(rows[ri].cells[ci].replacedText ?? rows[ri].cells[ci].text ?? "");
        // React if found
        if (cellTextParts.some(t => t.includes(replacement!.oldText))) {
          let targetCell = rows[ri].cells[ci];
          found = true;
          if (targetCell.colSpan === undefined) targetCell.colSpan = 1;

          let midRows: AitRowData[] = rows.slice(ri).map(r => { return { aitid: r.aitid, cells: [] }; });
          let midRepeats: AitColumnRepeat[] = [];

          // Cycle through reach replacement value
          for (let rvi = 0; rvi < replacement!.newTexts.length; rvi++) {
            let rv = replacement!.newTexts[rvi];

            // Process sublist
            let lowerQuad: AitRowData[] = rows.slice(ri + 1).map(r => {
              return {
                aitid: r.aitid,
                cells: r.cells.slice(ci, ci + targetCell.colSpan!)
              };
            });
            let nextReplacement = flattenReplacements(rv.subLists, externalLists);
            let {
              newHeaderRows: lowerProcessed, newColumnRepeats: lowerColumnRepeats
            } = replaceHeaders(
              0,
              lowerQuad,
              lowerQuad.length > 0 ? Array.from(rows[lowerQuad.length - 1].cells.keys()).map(n => { return { columnIndex: n } as AitColumnRepeat; }) : [],
              nextReplacement,
            );

            // Perform replacements for each text entry
            for (let ti = 0; ti < rv.texts.length; ti++) {
              let thisRepeat: AitCellData = replaceCellText(targetCell, replacement!.oldText, rv.texts[ti]);
              // Expand to cover all lower columns
              if (lowerProcessed.length > 0 && lowerProcessed[0].cells.length > thisRepeat.colSpan!) {
                thisRepeat.repeatColSpan = lowerProcessed[0].cells.length;
              }

              // Add into mid cells
              let targetRow: AitRowData = { aitid: rows[ri].aitid, cells: [thisRepeat] };
              // Add usual trailing cells
              if (thisRepeat.colSpan! > 1) {
                targetRow.cells.push(...rows[ri].cells.slice(ci + 1, ci + targetCell.colSpan));
              }
              // Add new blank cells
              if (thisRepeat.repeatColSpan ?? 0 > thisRepeat.colSpan!) {
                let nIns = thisRepeat.repeatColSpan! - thisRepeat.colSpan!;
                for (let nci = 0; nci < nIns; nci++) {
                  let n = newCell();
                  n.colSpan = 0;
                  n.repeatColSpan = 0;
                  n.replacedText = "__filler1";
                  targetRow.cells.push(n);
                }
              }

              // Add this repeat into the output
              midRows = appendCells(
                midRows,
                [targetRow, ...lowerProcessed]
              );

              // Work out new repeat for this cell
              if (lowerColumnRepeats.length > 0) {
                midRepeats = [
                  ...midRepeats,
                  ...lowerColumnRepeats.map(crep => {
                    return {
                      columnIndex: columnRepeats[ci].columnIndex + crep.columnIndex,
                      colRepeat: `${columnRepeats[ci].colRepeat ?? ""}${`[${rvi},${ti}]${crep.colRepeat ?? ""}`}`
                    } as AitColumnRepeat;
                  })
                ];
              }
              else {
                midRepeats = [
                  ...midRepeats,
                  { columnIndex: columnRepeats[ci].columnIndex, colRepeat: `${columnRepeats[ci].colRepeat ?? ""}${`[${rvi},${ti}]`}` }
                ];
              }
            }
          }

          // Add full column
          newHeaderRows = appendCells(
            newHeaderRows,
            rows.map((r, rj) => {
              // Return row above
              if (rj < ri)
                return {
                  aitid: r.aitid,
                  cells: [r.cells[ci]]
                } as AitRowData;

              // Return from midRow
              else
                return {
                  aitid: r.aitid,
                  cells: midRows[rj - ri].cells
                } as AitRowData;
            })
          );
          newColumnRepeats = [...newColumnRepeats, ...midRepeats];

          // Ensure that columns above cover the repeats
          let nIns = midRows[0].cells.length - (targetCell.colSpan ?? 1);
          if (nIns > 0) {
            // Number of cells to insert / colSpan to increase
            for (let rj = ri - 1; rj >= 0; rj--) {
              let targetCellAbove = newHeaderRows[rj].cells[ci + addedCols];
              if (targetCellAbove.colSpan === undefined) targetCellAbove.colSpan = 1;
              // Check that the target is showing
              let lookback = 0;
              while (targetCellAbove.colSpan === 0 && lookback < ci) {
                // Move to previous cell
                lookback++;
                targetCellAbove = rows[rj].cells[ci - lookback];
              }
              // Update the target to have minimum repeatColSpan
              if (targetCellAbove !== undefined) {
                targetCellAbove.repeatColSpan = (targetCellAbove.repeatColSpan ?? targetCellAbove.colSpan!) + nIns;
                let newCells2: AitCellData[] = [];
                for (let nci = 0; nci < nIns + targetCell.colSpan - 1; nci++) {
                  let n = newCell();
                  n.colSpan = 0;
                  n.repeatColSpan = 0;
                  n.replacedText = "__filler2";
                  newCells2.push(n);
                }
                newHeaderRows[rj].cells.splice(ci + addedCols - lookback + 1, 0, ...newCells2);
              }
              
              // Not found !!!
              else {
                console.warn("Have not found the target cell above the column header replacement");
              }
              // Update number of columns added so far
              addedCols = addedCols + nIns;
            }
          }
          colsProcessed = targetCell.colSpan;

          break;
        }
      }

      // Append the row if it was not found on this pass
      if (!found) {
        newHeaderRows = appendCells(
          newHeaderRows,
          rows.map(r => {
            return {
              aitid: r.aitid,
              cells: [r.cells[ci]],
            } as AitRowData;
          })
        );
        newColumnRepeats = [...newColumnRepeats, columnRepeats[ci]];
      }
    }
  }
  return { newHeaderRows, newColumnRepeats };
};
