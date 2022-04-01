import { AioReplacement } from "../aio/aioInterface";
import { AitCellData, AitColumnRepeat, AitRowData } from "../ait/aitInterface";
import { appendCells } from "./appendCells";
import { newCell } from "./newCell";
import { printRows } from "./printRows";

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

  for (let repi = 0; repi < replacements.length; repi++) {
    console.log(`PROCESSING REPEAT: ${JSON.stringify(replacements[repi])}`);
    let afterReplacement = replaceHeaders(repi, replacements[repi], newHeaderRows, newColumnRepeats);
    newHeaderRows = afterReplacement.newHeaderRows;
    newColumnRepeats = afterReplacement.newColumnRepeats;
  }

  return { rows: newHeaderRows, columnRepeats: newColumnRepeats };

};

function replaceHeaders(
  repi: number,
  replacement: AioReplacement,
  rows: AitRowData[],
  columnRepeats: AitColumnRepeat[],
): { newHeaderRows: AitRowData[]; newColumnRepeats: AitColumnRepeat[]; } {

  // Check there are rows
  if (rows.length === 0) return { newHeaderRows: [], newColumnRepeats: [] };

  // Look for match, is there is one to find
  let found = (
    replacement.replacementTexts.length === 0
    || replacement.replacementTexts[0].text === ""
    || replacement.replacementValues.length === 0
    || replacement.replacementValues[0].newText === ""
  );

  // Set up holders
  let newHeaderRows: AitRowData[] = rows.map(r => { return { aitid: r.aitid, cells: [] } });
  let newColumnRepeats: AitColumnRepeat[] = [];
  console.log(`REPLACEHEADERS: Scanning ${rows.length} rows and ${rows[0]?.cells.length} columns`);

  // Go through each column
  let colsProcessed = 1;
  for (let ci = 0; ci < rows[0].cells.length; ci = ci + colsProcessed) {
    colsProcessed = 1;
    console.log(`REPLACEHEADERS: Processing header column ${ci}`);

    // Add next column if the text is already found
    if (found) {
      console.log(`REPLACEHEADERS: Appending column ${ci} after found`);
      newHeaderRows = appendCells(
        newHeaderRows,
        rows.map(r => {
          return {
            aitid: r.aitid,
            cells: [r.cells[ci]],
          } as AitRowData;
        })
      )
      console.log(printRows(newHeaderRows));
      newColumnRepeats = [...newColumnRepeats, columnRepeats[ci]];
      console.log(`REPLACEHEADERS: Column repeats: ${JSON.stringify(newColumnRepeats)}`);
    }

    // Go through each row if we are still looking
    else {
      for (let ri = 0; ri < rows.length; ri++) {

        // React if found
        if (rows[ri].cells[ci].text.includes(replacement.replacementTexts[0].text)) {
          let targetCell = rows[ri].cells[ci];
          console.log(`REPLACEHEADERS: We got one in column ${ci}, row ${ri}`);
          found = true;

          let midRows: AitRowData[] = rows.slice(ri).map(r => { return { aitid: r.aitid, cells: [] } });
          let midRepeats: AitColumnRepeat[] = [];

          // Cycle through reach replacement value
          for (let rvi = 0; rvi < replacement.replacementValues.length; rvi++) {
            let rv = replacement.replacementValues[rvi];

            // Process sublist
            let nextReplacement: AioReplacement = {
              replacementTexts: replacement.replacementTexts.slice(1),
              replacementValues: rv.subList ?? []
            };
            let lowerRows: AitRowData[] = rows.slice(ri + 1).map(r => {
              return {
                aitid: r.aitid,
                cells: r.cells.slice(ci, ci + targetCell.colSpan)
              };
            });
            let {
              newHeaderRows: lowerProcessed,
              newColumnRepeats: lowerColumnRepeats
            } = replaceHeaders(
              repi,
              nextReplacement,
              lowerRows,
              columnRepeats.slice(ci, ci + targetCell.colSpan)
            );
            console.log(`REPLACEHEADERS: lower processing yielded this...`);
            console.log(printRows(lowerProcessed));
            console.log(`REPLACEHEADERS: lower column repeats: ${JSON.stringify(lowerColumnRepeats)}`);

            // Create new cell
            let thisRepeat = {
              ...targetCell,
              replacedText: targetCell.text.replaceAll(replacement.replacementTexts[0].text, rv.newText)
            } as AitCellData;
            // Expand to cover all lower columns
            if (lowerProcessed.length > 0 && lowerProcessed[0].cells.length > thisRepeat.colSpan) {
              thisRepeat.repeatColSpan = lowerProcessed[0].cells.length;
            }

            // Add into mid cells
            let targetRow: AitRowData = { aitid: rows[ri].aitid, cells: [thisRepeat] };
            // Add usual trailing cells
            if (thisRepeat.colSpan > 1) {
              targetRow.cells.push(...rows[ri].cells.slice(ci + 1, ci + targetCell.colSpan));
            }
            // Add new trailing cells
            if (thisRepeat.repeatColSpan ?? 0 > thisRepeat.colSpan) {
              let nIns = thisRepeat.repeatColSpan! - thisRepeat.colSpan;
              targetRow.cells.push(
                ...Array<AitCellData>(nIns).fill(newCell()).map(c => {
                  c.replacedText = "filler";
                  c.colSpan = 0;
                  c.repeatColSpan = 0;
                  return c;
                })
              );
            }

            // Add this column together
            midRows = appendCells(
              midRows,
              [targetRow, ...lowerProcessed]
            );
            console.log(`REPLACEHEADERS:MIDROWS:`);
            console.log(printRows(midRows));

            // Work out new repeat for this cell
            if (lowerColumnRepeats.length > 0) {
              midRepeats = [
                ...midRepeats,
                ...lowerColumnRepeats.map(crep => {
                  console.log("Adding further instance of column repeat");
                  return {
                    columnIndex: crep.columnIndex,
                    repeatNumbers: [...(crep.repeatNumbers ?? [repi]), rvi]
                  } as AitColumnRepeat;
                })];
            }
            else {
              console.log("Adding first instance of column repeat");
              midRepeats = [
                ...midRepeats,
                { columnIndex: ci, repeatNumbers: [repi, rvi] }
              ];
            }
            console.log(`REPLACEHEADERS: MID Column repeats: ${JSON.stringify(midRepeats)}`);
          }

          // Add full column
          newHeaderRows = appendCells(
            newHeaderRows,
            rows.map((r, rj) => {
              // Return row above
              if (rj < ri) return {
                aitid: r.aitid,
                cells: [r.cells[ci]]
              } as AitRowData
              // Return from midRow
              else return {
                aitid: r.aitid,
                cells: midRows[rj - ri].cells
              } as AitRowData
            })
          );
          console.log(printRows(newHeaderRows));
          newColumnRepeats = [...newColumnRepeats, ...midRepeats];
          console.log(`REPLACEHEADERS: Column repeats: ${JSON.stringify(newColumnRepeats)}`);

          // Ensure that columns above cover the repeats
          let nIns = midRows[0].cells.length - 1;
          if (nIns > 0) {
            // Number of cells to insert / colSpan to increase
            for (let rj = ri - 1; rj >= 0; rj--) {
              let targetCellAbove = newHeaderRows[rj].cells[ci];
              // Check that the target is showing
              let lookback = 0;
              while (targetCellAbove.colSpan === 0 && lookback < ci) {
                // Move to previous cell
                lookback++;
                targetCellAbove = rows[rj].cells[ci - lookback];
              }
              // Update the target to have minimum repeatColSpan
              if (targetCellAbove !== undefined) {
                targetCellAbove.repeatColSpan = (targetCellAbove.repeatColSpan ?? targetCellAbove.colSpan) + nIns;
                newHeaderRows[rj].cells.splice(ci - lookback + 1, 0, ...Array<AitCellData>(nIns).fill(newCell()).map(c => {
                  c.replacedText = "filler";
                  c.colSpan = 0;
                  c.repeatColSpan = 0;
                  return c;
                }));
                console.log(`Increasing the colspan of text with text ${targetCellAbove.text} by ${midRows[0].cells.length - 1} to ${targetCellAbove.repeatColSpan}`);
              }
              // Not found !!!
              else {
                console.log("Have not found the target cell above the column header replacement");
              }
            }
          }
          colsProcessed = targetCell.colSpan;

          break;
        }
      }

      // Append the row if it was not found on this pass
      if (!found) {
        console.log(`REPLACEHEADERS: Appending column ${ci} after fruitless search`);
        newHeaderRows = appendCells(
          newHeaderRows,
          rows.map(r => {
            return {
              aitid: r.aitid,
              cells: [r.cells[ci]],
            } as AitRowData;
          })
        )
        console.log(printRows(newHeaderRows));
        newColumnRepeats = [...newColumnRepeats, columnRepeats[ci]];
        console.log(`REPLACEHEADERS: Column repeats: ${JSON.stringify(newColumnRepeats)}`);
      }
    }
  }
  return { newHeaderRows, newColumnRepeats };
}
