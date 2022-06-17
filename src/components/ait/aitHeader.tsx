import React, { useCallback, useContext } from "react";
import { AioReplacement } from "../aio";
import { newCell, newRow } from "../functions";
import { AitBorderRow } from "./aitBorderRow";
import { AitCellData, AitCellType, AitLocation, AitRowData, AitRowGroupData, AitRowType } from "./aitInterface";
import { AitRow } from "./aitRow";
import { TableSettingsContext } from "./AsupInternalTable";

interface AitHeaderProps {
  aitid: string,
  rows: AitRowData[],
  comments?: string,
  replacements?: AioReplacement[],
  setHeaderData: (ret: AitRowGroupData) => void,
}

export const AitHeader = ({
  aitid,
  rows,
  comments,
  replacements,
  setHeaderData,
}: AitHeaderProps): JSX.Element => {

  const tableSettings = useContext(TableSettingsContext);

  // General function to return complied object
  const returnData = useCallback((headerUpdate: {
    rows?: AitRowData[],
    comments?: string,
    replacements?: AioReplacement[]
  }) => {
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: headerUpdate.rows ?? rows,
      comments: headerUpdate.comments ?? comments,
      replacements: headerUpdate.replacements ?? replacements,
    };
    setHeaderData(r);
  }, [setHeaderData, aitid, rows, comments, replacements]);

  const addRow = useCallback((ri: number) => {
    let newrs = [...rows];
    let newr: AitRowData = newRow(0);
    let cols = rows[0].cells
      .map(c => (c.colSpan ?? 1))
      .reduce((sum, a) => sum + a, 0);
    for (let ci = 0; ci < cols; ci++) {
      // Create new cell
      let c = newCell(AitCellType.header);
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

    // Remove the row
    newRows.splice(ri, 1);

    // Check that the bottom row has no colSpan
    if (ri === newRows.length && ri > 0) {
      newRows[ri - 1].cells = newRows[ri - 1].cells.map(c => { c.colSpan = 1; return c });
    }
    // Return updated rows
    returnData({ rows: newRows });
  }, [returnData, rows])


  // Manipulate cell spans
  const addColSpan = useCallback((loc: AitLocation) => {
    // Get things to change
    let newRows = [...rows];
    let targetCell: AitCellData = newRows[loc.row].cells[loc.column];
    if (targetCell.colSpan === undefined) targetCell.colSpan = 1;
    let hideCell: AitCellData = newRows[loc.row].cells[loc.column + targetCell.colSpan];
    // Check change is ok
    if (targetCell === undefined || hideCell === undefined) return;
    if (targetCell.rowSpan !== 1) return;
    if (hideCell.rowSpan !== 1) return;
    if (loc.column + targetCell.colSpan === tableSettings.rowHeaderColumns) return;
    if (loc.column + targetCell.colSpan >= newRows[loc.row].cells.length) return;
    if (hideCell.colSpan !== 1) return;
    // Update target cell
    targetCell.colSpan++;
    targetCell.colWidth = (targetCell.colWidth ?? 60) + (hideCell.colWidth ?? 60);
    // Hide next cell
    hideCell.colSpan = 0;
    newRows[loc.row].cells[loc.column + targetCell.colSpan - 1].colSpan = 0;
    // Done
    returnData({ rows: newRows });
  }, [returnData, rows, tableSettings.rowHeaderColumns]);

  const removeColSpan = useCallback((loc: AitLocation) => {
    // Get things to change
    let newRows = [...rows];
    let targetCell: AitCellData = newRows[loc.row].cells[loc.column];
    let hideCell: AitCellData = newRows[loc.row].cells[loc.column + targetCell.colSpan! - 1];
    // Update target cell
    targetCell.colSpan!--;
    targetCell.colWidth = (targetCell.colWidth ?? 60) - (hideCell.colWidth ?? 60);
    // Show next cell
    hideCell.colSpan = 1;
    // Done
    returnData({ rows: newRows });
  }, [returnData, rows]);

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
    // Update target cell
    targetCell.rowSpan!--;
    // Show hidden cell
    hideCell.rowSpan = 1;
    // Done
    returnData({ rows: newRows });
  }, [returnData, rows]);

  if (rows.length === 0) return <></>;

  return (
    <>
      {
        rows.map((row: AitRowData, ri: number): JSX.Element => {
          return (
            <AitRow
              key={row.aitid!}
              aitid={row.aitid!}
              cells={row.cells}
              setRowData={(ret) => {
                let newRows = [...rows];
                newRows.splice(ri, 1, ret);
                returnData({rows: newRows});
              }}
              location={{
                tableSection: AitRowType.header,
                rowGroup: 0,
                row: rows.findIndex(r => r.aitid === row.aitid),
                column: -1,
                rowRepeat: undefined,
                colRepeat: "",
              }}
              spaceAfter={false}
              replacements={replacements}
              setReplacements={(ret) => returnData({ replacements: ret })}
              rowGroupWindowTitle={"Header options"}
              rowGroupComments={comments ?? ""}
              updateRowGroupComments={(ret) => { returnData({ comments: ret }) }}
              addRow={addRow}
              removeRow={removeRow}
              addColSpan={addColSpan}
              removeColSpan={removeColSpan}
              addRowSpan={addRowSpan}
              removeRowSpan={removeRowSpan}
            />
          );
        })
      }
      <AitBorderRow spaceBefore={true} spaceAfter={true} />
    </>
  );
}