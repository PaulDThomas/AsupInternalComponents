import React, { useCallback, useContext } from 'react';
import { AioReplacement } from '../aio';
import { newCell, newRow } from '../functions';
import { AitBorderRow } from './aitBorderRow';
import { TableSettingsContext } from './aitContext';
import { AitCellData, AitLocation, AitRowData, AitRowGroupData, AitRowType } from './aitInterface';
import { AitRow } from './aitRow';

interface AitHeaderProps {
  id: string;
  aitid: string;
  rows: AitRowData[];
  comments?: string;
  replacements?: AioReplacement[];
  setHeaderData: (ret: AitRowGroupData) => void;
  setColWidth: (colNo: number, colWidth: number) => void;
  addHeaderColSpan: (ret: AitLocation) => void;
  removeHeaderColSpan: (ret: AitLocation) => void;
}

export const AitHeader = ({
  id,
  aitid,
  rows,
  comments,
  replacements,
  setHeaderData,
  setColWidth,
  addHeaderColSpan,
  removeHeaderColSpan,
}: AitHeaderProps): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);

  // General function to return complied object
  const returnData = useCallback(
    (headerUpdate: { rows?: AitRowData[]; comments?: string; replacements?: AioReplacement[] }) => {
      const r: AitRowGroupData = {
        aitid: aitid,
        rows: headerUpdate.rows ?? rows,
        comments: headerUpdate.comments ?? comments,
        replacements: headerUpdate.replacements ?? replacements,
      };
      setHeaderData(r);
    },
    [setHeaderData, aitid, rows, comments, replacements],
  );

  const addRow = useCallback(
    (ri: number) => {
      const newrs = [...rows];
      const newr: AitRowData = newRow(tableSettings.defaultCellWidth, 0);
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

      // Remove the row
      newRows.splice(ri, 1);

      // Check that the bottom row has no colSpan
      if (ri === newRows.length && ri > 0) {
        newRows[ri - 1].cells = newRows[ri - 1].cells.map((c) => {
          c.colSpan = 1;
          return c;
        });
      }
      // Return updated rows
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

  if (rows.length === 0) return <></>;

  return (
    <>
      {rows.map((row: AitRowData, ri: number): JSX.Element => {
        return (
          <AitRow
            id={`${id}-header-row-${ri}`}
            key={row.aitid ?? `row-${ri}`}
            aitid={row.aitid ?? `row-${ri}`}
            cells={row.cells}
            setRowData={(ret) => {
              const newRows = [...rows];
              newRows.splice(ri, 1, ret);
              returnData({ rows: newRows });
            }}
            location={{
              tableSection: AitRowType.header,
              rowGroup: 0,
              row: rows.findIndex((r) => r.aitid === row.aitid),
              column: -1,
              rowRepeat: undefined,
              colRepeat: '',
            }}
            spaceAfter={false}
            replacements={replacements}
            setReplacements={(ret) => returnData({ replacements: ret })}
            rowGroupWindowTitle={'Header options'}
            rowGroupComments={comments ?? ''}
            updateRowGroupComments={(ret) => {
              returnData({ comments: ret });
            }}
            addRow={addRow}
            removeRow={removeRow}
            addColSpan={addHeaderColSpan}
            removeColSpan={removeHeaderColSpan}
            setColWidth={setColWidth}
            addRowSpan={addRowSpan}
            removeRowSpan={removeRowSpan}
          />
        );
      })}
      <AitBorderRow
        id={`${id}-midtable-border`}
        spaceBefore={true}
        spaceAfter={true}
      />
    </>
  );
};
