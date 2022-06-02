import React, { useCallback } from "react";
import { AioReplacement } from "../aio";
import { newCell, newRow } from "../functions";
import { AitCellData, AitLocation, AitRowData, AitRowGroupData } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  aitid: string,
  name?: string,
  location: AitLocation,
  rows: AitRowData[],
  comments?: string,
  replacements: AioReplacement[],
  setRowGroupData: (ret: AitRowGroupData) => void,
  addRowGroup?: (rgi: number, templateName?: string) => void,
  removeRowGroup?: (rgi: number) => void,
  spaceAfter?: boolean,
}

export const AitRowGroup = ({
  aitid,
  name,
  location,
  rows,
  comments,
  replacements,
  spaceAfter,
  setRowGroupData,
  addRowGroup,
  removeRowGroup,
}: AitRowGroupProps): JSX.Element => {

  // General function to return complied object
  const returnData = useCallback((rowGroupUpdate: {
    rows?: AitRowData[],
    replacements?: AioReplacement[],
    spaceAfter?: boolean,
    comments?: string,
  }) => {
    if (typeof setRowGroupData !== "function") return;
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: rowGroupUpdate.rows ?? rows,
      comments: rowGroupUpdate.comments ?? comments,
      replacements: rowGroupUpdate.replacements ?? replacements,
      spaceAfter: rowGroupUpdate.spaceAfter ?? spaceAfter,
    };
    setRowGroupData!(r);
  }, [setRowGroupData, aitid, rows, comments, replacements, spaceAfter]);

  // Update row
  const updateRow = useCallback((ret: AitRowData, ri: number) => {
    // Do nothing if readonly
    if (typeof (setRowGroupData) !== "function") return;
    // Filter out repeat cells
    let newRows: AitRowData[] = [ ...rows ];
    // Create new object to send back
    newRows[ri] = ret;
    returnData({ rows: newRows });
  }, [setRowGroupData, rows, returnData]);

  const addRow = useCallback((ri: number) => {
    let newrs = [...rows];
    let newr = newRow(0);
    let cols = rows[0].cells
      .map(c => (c.colSpan ?? 1))
      .reduce((sum, a) => sum + a, 0);
    for (let ci = 0; ci < cols; ci++) {
      // Create new cell
      let c = newCell();
      // Check rowSpans on previous row
      if ((newrs[ri].cells[ci].rowSpan ?? 1) !== 1) {
        let riUp = 0;
        while (riUp <= ri && newrs[ri - riUp].cells[ci].rowSpan === 0) riUp++;
        newrs[ri - riUp].cells[ci].rowSpan!++;
        c.rowSpan = 0;
      }
      newr.cells.push(c);
    }
    newrs.splice(ri + 1, 0, newr);
    returnData({ rows: newrs });
  }, [returnData, rows])

  const removeRow = useCallback((ri: number) => {
    let newRows = [...rows];

    // Look for any cells with multiple row span
    newRows[ri].cells.map((c, ci) => {
      // Found hidden cell
      if ((c.rowSpan ?? 1) > 1) {
        // Adjust the rowSpan of the cell above
        for (let i = 1; i < c.rowSpan!; i++) {
          if (newRows[ri + i].cells[ci].rowSpan === 0) {
            newRows[ri + i].cells[ci].rowSpan = 1;
          }
        }
      }
      return true;
    });

    // Look for any cells with no row span
    newRows[ri].cells.map((c, ci) => {
      let found = false;
      // Found hidden cell
      if (c.rowSpan === 0) {
        let riUp = 1;
        // Adjust the rowSpan of the cell above
        while (!found && riUp <= ri) {
          if (newRows[ri - riUp].cells[ci].rowSpan! > 1) {
            newRows[ri - riUp].cells[ci].rowSpan!--;
            found = true;
          }
          riUp++;
        }
      }
      return found;
    });

    newRows.splice(ri, 1);
    returnData({ rows: newRows });
  }, [returnData, rows])

  const addRowSpan = useCallback((loc: AitLocation) => {
    // Get things to change
    let newRows = [...rows];
    let targetCell: AitCellData = newRows[loc.row].cells[loc.column];
    if (targetCell.rowSpan === undefined) targetCell.rowSpan = 1;
    let hideCell: AitCellData = newRows[loc.row + targetCell.rowSpan]?.cells[loc.column];
    // Check change is ok
    if (targetCell === undefined || hideCell === undefined) return;
    if (targetCell.colSpan !== 1) return;
    if (hideCell.colSpan !== 1 || hideCell.rowSpan !== 1) return;
    // Check previous rowspan
    let riUp = 0;
    while (loc.column > 0 && newRows[loc.row - riUp].cells[loc.column - 1].rowSpan === 0) riUp++;
    if (loc.column > 0 && (newRows[loc.row - riUp].cells[loc.column - 1].rowSpan ?? 1) - riUp < targetCell.rowSpan + 1) return;
    // Update target cell
    targetCell.rowSpan++;
    // Hide next cell
    hideCell.rowSpan = 0;
    // Done
    returnData({ rows: newRows });
  }, [returnData, rows]);

  const removeRowSpan = useCallback((loc: AitLocation) => {
    // Get things to change
    let newRows = [...rows];
    let targetCell: AitCellData = newRows[loc.row].cells[loc.column];
    // Check before getting hidden cell
    if (!newRows[loc.row + targetCell.rowSpan! - 1]?.cells.length) return;
    let hideCell: AitCellData = newRows[loc.row + targetCell.rowSpan! - 1].cells[loc.column];
    if (hideCell.rowSpan !== 0) return;
    // Check next column is not expanded
    if (newRows[loc.row + targetCell.rowSpan! - 1].cells[loc.column + 1].rowSpan === 0) return;
    // Update target cell
    targetCell.rowSpan!--;
    // Show hidden cell
    hideCell.rowSpan = 1;
    // Done
    returnData({ rows: newRows });
  }, [returnData, rows]);

  // Output the rows
  return (
    <>
      {rows.map((row: AitRowData, ri: number): JSX.Element => {
        return (
          <AitRow
            key={row.rowRepeat?.match(/^[[\]0,]+$/) || row.rowRepeat === undefined ? row.aitid : (row.aitid + row.rowRepeat)}
            aitid={row.aitid ?? ri.toString()}
            cells={row.cells}
            setRowData={(ret) => updateRow(ret, rows.findIndex(r => r.aitid === row.aitid))}
            location={{...location,
              row: rows.findIndex(r => r.aitid === row.aitid),
              rowRepeat: !row.rowRepeat?.match(/^[[\]0,]+$/) ? row.rowRepeat : undefined,
            }}
            replacements={replacements}
            setReplacements={(ret) => returnData({ replacements: ret })}
            addRowGroup={addRowGroup}
            removeRowGroup={removeRowGroup}
            rowGroupComments={comments ?? ""}
            updateRowGroupComments={(ret) => { returnData({ comments: ret }) }}
            addRow={row.rowRepeat?.match(/^[[\]0,]+$/) || row.rowRepeat === undefined ? addRow : undefined}
            removeRow={rows.length > 1 && (row.rowRepeat?.match(/^[[\]0,]+$/) || row.rowRepeat === undefined) ? removeRow : undefined}
            spaceAfter={row.spaceAfter ?? false}
            rowGroupSpace={spaceAfter}
            setRowGroupSpace={(ret) => returnData({ spaceAfter: ret })}
            addRowSpan={addRowSpan}
            removeRowSpan={removeRowSpan}
          />
        );
      })}
    </>
  );
}