import structuredClone from '@ungap/structured-clone';
import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioReplacement } from "../aio/aioInterface";
import { newCell } from "../functions/newCell";
import { objEqual } from "../functions/objEqual";
import { AitCellData, AitCellType, AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowGroupData, AitRowType } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitHeaderProps {
  aitid: string,
  rows: AitRowData[],
  comments: string,
  replacements: AioReplacement[],
  setHeaderData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  columnRepeats?: AitColumnRepeat[],
}

export const AitHeader = ({
  aitid,
  rows,
  comments,
  replacements,
  setHeaderData,
  higherOptions,
  columnRepeats,
}: AitHeaderProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone({ aitid: aitid, rows: rows, replacements: replacements }));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection ?? AitRowType.header,
      rowGroup: higherOptions.rowGroup ?? 0,
      row: -1,
      column: -1,
      repeat: "",
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((headerUpdate: { 
    rows?: AitRowData[], 
    comments?: string,
    replacements?: AioReplacement[] 
  }) => {
    if (typeof (setHeaderData) !== "function") return;
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: headerUpdate.rows ?? rows,
      comments: headerUpdate.comments ?? comments,
      replacements: headerUpdate.replacements ?? replacements,
    };
    let [chkObj] = objEqual(r, lastSend, `HEADERCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setHeaderData!(r);
      setLastSend(structuredClone(r));
    }
  }, [setHeaderData, aitid, rows, comments, replacements, lastSend, location]);

  // Update row
  const updateRow = useCallback((ret: AitRowData, ri: number) => {
    // Create new object to send back
    let newRows: AitRowData[] = [...rows];
    newRows[ri] = ret;
    returnData({ rows: newRows });
  }, [rows, returnData]);

  const addRow = useCallback((ri: number) => {
    let newRows = [...rows];
    let newRow: AitRowData = {
      aitid: uuidv4(),
      cells: [],
    };
    let cols = rows[0].cells
      .map(c => (c.colSpan ?? 1))
      .reduce((sum, a) => sum + a, 0);
    for (let ci = 0; ci < cols; ci++) {
      // Create new cell
      let c = newCell(AitCellType.header);
      // Check rowSpans on previous row
      if ((newRows[ri].cells[ci].rowSpan ?? 1) !== 1) {
        let riUp = 0;
        while (riUp <= ri && newRows[ri - riUp].cells[ci].rowSpan === 0) riUp++;
        newRows[ri - riUp].cells[ci].rowSpan!++;
        c.rowSpan = 0;
      }
      newRow.cells.push(c);
    }


    newRows.splice(ri + 1, 0, newRow);
    returnData({ rows: newRows });
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
            newRows[ri + 1].cells[ci].rowSpan = 1;
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
    if (loc.column + targetCell.colSpan === higherOptions.rowHeaderColumns) return;
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
  }, [higherOptions.rowHeaderColumns, returnData, rows]);

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

  return (
    <>
      {
        rows.map((row: AitRowData, ri: number): JSX.Element => {

          let rowHigherOptions: AitOptionList = {
            ...higherOptions,
            headerRows: rows.length,
            row: ri,
          } as AitOptionList;
          if (row.aitid === undefined) row.aitid = uuidv4();

          return (
            <AitRow
              key={row.aitid}
              aitid={row.aitid}
              cells={row.cells}
              setRowData={(ret) => updateRow(ret, ri)}
              higherOptions={rowHigherOptions}
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
              columnRepeats={columnRepeats}
            />
          );
        }
        )
      }
    </>
  );
}