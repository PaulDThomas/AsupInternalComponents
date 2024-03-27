import React, { useCallback, useContext } from "react";
import { AioReplacement } from "../aio";
import { newCell, newRow } from "../functions";
import { TableSettingsContext } from "./aitContext";
import { AitCellData, AitLocation, AitRowData, AitRowGroupData } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  id: string;
  aitid: string;
  name?: string;
  location: AitLocation;
  rows: AitRowData[];
  comments?: string;
  replacements: AioReplacement[];
  setRowGroupData?: (ret: AitRowGroupData) => void;
  setColWidth?: (colNo: number, colWidth: number) => void;
  addRowGroup?: (rgi: number, templateName?: string) => void;
  removeRowGroup?: (rgi: number) => void;
  spaceAfter?: boolean;
}

export const AitRowGroup = ({
  id,
  aitid,
  location,
  rows,
  comments,
  replacements,
  spaceAfter,
  setRowGroupData,
  setColWidth,
  addRowGroup,
  removeRowGroup,
}: AitRowGroupProps): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);

  // General function to return complied object
  const returnData = useCallback(
    (rowGroupUpdate: {
      rows?: AitRowData[];
      replacements?: AioReplacement[];
      spaceAfter?: boolean;
      comments?: string;
    }) => {
      if (tableSettings.editable && setRowGroupData) {
        const r: AitRowGroupData = {
          aitid: aitid,
          rows: rowGroupUpdate.rows ?? rows,
          comments: rowGroupUpdate.comments ?? comments,
          replacements: rowGroupUpdate.replacements ?? replacements,
          spaceAfter: rowGroupUpdate.spaceAfter ?? spaceAfter,
        };
        setRowGroupData(r);
      }
    },
    [tableSettings.editable, setRowGroupData, aitid, rows, comments, replacements, spaceAfter],
  );

  // Update row
  const updateRow = useCallback(
    (ret: AitRowData, ri: number) => {
      // Do nothing if readonly
      if (tableSettings.editable && setRowGroupData) {
        // Filter out repeat cells
        const newRows: AitRowData[] = [...rows];
        // Create new object to send back
        newRows[ri] = ret;
        returnData({ rows: newRows });
      }
    },
    [tableSettings.editable, setRowGroupData, rows, returnData],
  );

  const addRow = useCallback(
    (ri: number) => {
      const newrs = [...rows];
      const newr = newRow(tableSettings.defaultCellWidth, 0);
      const cols = rows[0].cells.map((c) => c.colSpan ?? 1).reduce((sum, a) => sum + a, 0);
      for (let ci = 0; ci < cols; ci++) {
        // Create new cell, use column width from row 0
        const c = newCell(rows[0].cells[ci].colWidth ?? tableSettings.defaultCellWidth);
        // Check rowSpans on previous row
        if ((newrs[ri].cells[ci].rowSpan ?? 1) !== 1) {
          let riUp = 0;
          while (riUp <= ri && newrs[ri - riUp].cells[ci].rowSpan === 0) riUp++;
          newrs[ri - riUp].cells[ci].rowSpan = (newrs[ri - riUp].cells[ci].rowSpan ?? 1) + 1;
          c.rowSpan = 0;
        }
        newr.cells.push(c);
      }
      newrs.splice(ri + 1, 0, newr);
      returnData({ rows: newrs });
    },
    [returnData, rows, tableSettings.defaultCellWidth],
  );

  const removeRow = useCallback(
    (ri: number) => {
      const newRows = [...rows];

      // Look for any cells with multiple row span
      newRows[ri].cells.map((c, ci) => {
        // Found hidden cell
        if ((c.rowSpan ?? 1) > 1) {
          // Adjust the rowSpan of the cell above
          for (let i = 1; i < (c.rowSpan ?? 1); i++) {
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
            if ((newRows[ri - riUp].cells[ci].rowSpan ?? 1) > 1) {
              newRows[ri - riUp].cells[ci].rowSpan =
                (newRows[ri - riUp].cells[ci].rowSpan ?? 1) - 1;
              found = true;
            }
            riUp++;
          }
        }
        return found;
      });

      newRows.splice(ri, 1);
      returnData({ rows: newRows });
    },
    [returnData, rows],
  );

  const addRowSpan = useCallback(
    (loc: AitLocation) => {
      // Get things to change
      const newRows = [...rows];
      const actualCol =
        tableSettings.columnRepeats?.findIndex(
          (c) => c.columnIndex === loc.column && c.colRepeat === loc.colRepeat,
        ) ?? loc.column;
      const targetCell: AitCellData = newRows[loc.row].cells[actualCol];
      if (targetCell.rowSpan === undefined) targetCell.rowSpan = 1;
      const hideCell: AitCellData = newRows[loc.row + targetCell.rowSpan]?.cells[actualCol];
      // Check change is ok
      if (targetCell === undefined || hideCell === undefined) return;
      if (targetCell.colSpan !== 1) return;
      if (hideCell.colSpan !== 1 || hideCell.rowSpan !== 1) return;
      // Check previous rowspan
      let riUp = 0;
      while (loc.column > 0 && newRows[loc.row - riUp].cells[loc.column - 1].rowSpan === 0) riUp++;
      if (
        loc.column > 0 &&
        (newRows[loc.row - riUp].cells[loc.column - 1].rowSpan ?? 1) - riUp < targetCell.rowSpan + 1
      )
        return;
      // Update target cell
      targetCell.rowSpan++;
      // Hide next cell
      hideCell.rowSpan = 0;
      // Done
      returnData({ rows: newRows });
    },
    [returnData, rows, tableSettings.columnRepeats],
  );

  const removeRowSpan = useCallback(
    (loc: AitLocation) => {
      // Get things to change
      const newRows = [...rows];
      const actualCol =
        tableSettings.columnRepeats?.findIndex(
          (c) => c.columnIndex === loc.column && c.colRepeat === loc.colRepeat,
        ) ?? loc.column;
      const targetCell: AitCellData = newRows[loc.row].cells[actualCol];
      // Check before getting hidden cell
      if (!newRows[loc.row + (targetCell.rowSpan ?? 1) - 1]?.cells.length) return;
      const hideCell: AitCellData =
        newRows[loc.row + (targetCell.rowSpan ?? 1) - 1].cells[actualCol];
      if (hideCell.rowSpan !== 0) return;
      // Check next column is not expanded
      if (newRows[loc.row + (targetCell.rowSpan ?? 1) - 1].cells[loc.column + 1].rowSpan === 0)
        return;
      // Update target cell
      targetCell.rowSpan = (targetCell.rowSpan ?? 1) - 1;
      // Show hidden cell
      hideCell.rowSpan = 1;
      if (hideCell.colSpan === 0) hideCell.colSpan = 1;
      // Done
      returnData({ rows: newRows });
    },
    [returnData, rows, tableSettings.columnRepeats],
  );

  // Output the rows
  return (
    <>
      {rows.map((row: AitRowData, ri: number): JSX.Element => {
        return (
          <AitRow
            id={`${id}-row-${ri}`}
            key={
              row.rowRepeat?.match(/^[[\]0,]+$/) || row.rowRepeat === undefined
                ? row.aitid
                : row.aitid + row.rowRepeat
            }
            aitid={row.aitid ?? ri.toString()}
            cells={row.cells}
            setRowData={
              tableSettings.editable
                ? (ret) =>
                    updateRow(
                      ret,
                      rows.findIndex((r) => r.aitid === row.aitid),
                    )
                : undefined
            }
            setColWidth={tableSettings.editable ? setColWidth : undefined}
            location={{
              ...location,
              row: rows.findIndex((r) => r.aitid === row.aitid),
              rowRepeat: !row.rowRepeat?.match(/^[[\]0,]+$/) ? row.rowRepeat : undefined,
            }}
            replacements={replacements}
            setReplacements={
              tableSettings.editable ? (ret) => returnData({ replacements: ret }) : undefined
            }
            addRowGroup={tableSettings.editable ? addRowGroup : undefined}
            removeRowGroup={tableSettings.editable ? removeRowGroup : undefined}
            rowGroupComments={comments ?? ""}
            updateRowGroupComments={
              tableSettings.editable
                ? (ret) => {
                    returnData({ comments: ret });
                  }
                : undefined
            }
            addRow={
              (tableSettings.editable && row.rowRepeat?.match(/^[[\]0,]+$/)) ||
              row.rowRepeat === undefined
                ? addRow
                : undefined
            }
            removeRow={
              tableSettings.editable &&
              rows.filter((r) => (r.rowRepeat ?? "0").match(/^[[\]0,]+$/) !== null).length > 1 &&
              (row.rowRepeat?.match(/^[[\]0,]+$/) || row.rowRepeat === undefined)
                ? removeRow
                : undefined
            }
            spaceAfter={row.spaceAfter ?? false}
            rowGroupSpace={spaceAfter}
            setRowGroupSpace={
              tableSettings.editable ? (ret) => returnData({ spaceAfter: ret }) : undefined
            }
            addRowSpan={tableSettings.editable ? addRowSpan : undefined}
            removeRowSpan={tableSettings.editable ? removeRowSpan : undefined}
          />
        );
      })}
    </>
  );
};
