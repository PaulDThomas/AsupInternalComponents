import { getRawTextParts } from "../aie/functions/getRawTextParts";
import { AioExternalReplacements, AioReplacement } from "../aio/aioInterface";
import { AitRowData } from "../ait/aitInterface";
import { prependCell } from "./prependCells";
import { replaceCellText } from "./replaceCellText";
import { updateExternals } from "./updateExternals";

/**
 * Recursive function to replace column header information
 * @param replacement Single set of replacment text
 * @param rows Header rows
 * @returns Updated rows
 */
export const replaceRows = (
  rows: AitRowData[],
  replacement?: AioReplacement,
  externalLists?: AioExternalReplacements[],
): AitRowData[] => {

  // Look for match, is there is one to find
  if (
    replacement === undefined
    || replacement.oldText === ""
    || replacement.newTexts.length === 0
    || replacement.newTexts[0].texts.join("") === ""
  ) {
    return rows;
  }

  // Set up holders
  let newRows: AitRowData[] = [];
  let addedRows = 0;
  let found = false;

  // Look through each cell
  let ri = 0;
  let processedRows = 0;
  let emergencyExit = 0;
  while (ri < rows.length && emergencyExit < 10000) {
    if (ri >= rows.length || rows[ri] === undefined || rows[ri].cells.length === undefined) {
      console.warn("High ri value somehow");
      console.log(`ri: ${ri}`);
      console.log(`${JSON.stringify(rows)}`);
    }
    else for (let ci = 0; ci < rows[ri].cells.length && !found; ci++) {
      let cellTextParts: string[] = getRawTextParts(rows[ri].cells[ci].replacedText ?? rows[ri].cells[ci].text ?? "");
      if (
        replacement !== undefined &&
        cellTextParts.some(t => t.includes(replacement!.oldText))
      ) {
        // Get targetCell
        found = true;
        let targetCell = rows[ri].cells[ci];
        targetCell.rowSpan = targetCell.rowSpan ?? 1;

        let midRows: AitRowData[] = [];
        let midAddedRows = 0;

        // Cycle through newTexts
        for (let rvi = 0; rvi < replacement!.newTexts.length; rvi++) {
          let rv = replacement!.newTexts[rvi];

          // Perform replacements for each text entry
          for (let ti = 0; ti < rv.texts.length; ti++) {
            let thisRepeat = replaceCellText(targetCell, replacement.oldText, rv.texts[ti]);

            // Process remaining cells, including target after replacement
            let lowerQuad: AitRowData[] = (replacement.includeTrailing ?? false)
              ? rows.slice(ri).map((r, rj) => {
                let cells = rj === 0
                  ? [thisRepeat, ...r.cells.slice(ci + 1).map(c => replaceCellText(c, replacement.oldText, rv.texts[ti]))]
                  : [...r.cells.slice(ci).map(c => replaceCellText(c, replacement.oldText, rv.texts[ti]))]
                return {
                  aitid: r.aitid,
                  rowRepeat: `${r.rowRepeat ?? ""}${`[${rvi},${ti}]`}`,
                  cells: cells,
                }
              })
              : targetCell.rowSpan > 1
                ? rows.slice(ri, ri + targetCell.rowSpan).map((r, rj) => {
                  let cells = rj === 0
                    ? [thisRepeat, ...r.cells.slice(ci + 1).map(c => replaceCellText(c, replacement.oldText, rv.texts[ti]))]
                    : [...r.cells.slice(ci).map(c => replaceCellText(c, replacement.oldText, rv.texts[ti]))]
                  return {
                    aitid: r.aitid,
                    rowRepeat: `${r.rowRepeat ?? ""}${`[${rvi},${ti}]`}`,
                    cells: cells,
                  }
                })
                : [{
                  aitid: rows[ri].aitid,
                  rowRepeat: `${rows[ri].rowRepeat ?? ""}${`[${rvi},${ti}]`}`,
                  cells: [thisRepeat, ...rows[ri].cells.slice(ci + 1).map(c => replaceCellText(c, replacement.oldText, rv.texts[ti]))],
                } as AitRowData]
              ;
            // Find amount to move row cursor 
            processedRows = lowerQuad.length;
            // Process lowerQuad if there are subLists
            let subLists = updateExternals(rv.subLists, externalLists)
            if ((subLists?.length ?? 0) > 0) for (let si = 0; si < subLists!.length; si++) {
              lowerQuad = replaceRows(lowerQuad, subLists![si]);
            }

            // Add spaceAfter to bottom left cell in the block
            if (rv.spaceAfter) {
              let lookup = 0;
              while ((lowerQuad[lowerQuad.length - 1 - lookup].cells[0].rowSpan ?? 1) === 0) lookup++;
              lowerQuad[lowerQuad.length - 1 - lookup].cells[0].spaceAfterRepeat = true;
            }

            // Expand to cover rest of the row
            midRows.push(...lowerQuad);
          }
        }

        // Add preceeding cells from current row
        if (midRows.length > 0) for (let lookleft = 1; lookleft <= ci; lookleft++) {
          midAddedRows = midRows.length - processedRows;
          midRows = prependCell(rows[ri].cells[ci - lookleft], midRows, midAddedRows);
        }
        // Add returned rows
        newRows.push(...midRows);
        // Update number of rows for further lookups
        addedRows = addedRows + midAddedRows;
      }
    }
    // Add the row if it was not found on this pass
    if (!found) {
      newRows.push(rows[ri]);
      ri++;
    }
    if (found) {
      ri = ri + processedRows;
      found = false;
    }
    emergencyExit++;
  }
  return newRows;
};
