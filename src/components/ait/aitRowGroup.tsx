import structuredClone from '@ungap/structured-clone';
import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioRepeats, AioReplacement } from "../aio/aioInterface";
import { newCell } from "../functions/newCell";
import { objEqual } from "../functions/objEqual";
import { repeatRows } from "../functions/repeatRows";
import { AitCellData, AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowGroupData, AitRowType } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  aitid: string,
  name?: string,
  rows: AitRowData[],
  comments?: string,
  replacements: AioReplacement[],
  setRowGroupData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  addRowGroup?: (rgi: number, templateName?: string) => void,
  removeRowGroup?: (rgi: number) => void,
  columnRepeats?: AitColumnRepeat[],
  spaceAfter?: boolean,
}

export const AitRowGroup = ({
  aitid,
  name,
  rows,
  comments,
  replacements,
  spaceAfter,
  setRowGroupData,
  higherOptions,
  addRowGroup,
  removeRowGroup,
  columnRepeats,
}: AitRowGroupProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone({ aitid: aitid, rows: rows, replacements: replacements }));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection ?? AitRowType.body,
      rowGroup: higherOptions.rowGroup ?? 0,
      row: -1,
      column: -1,
      repeat: "na",
    }
  }, [higherOptions]);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `ROWGROUPCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      // console.log(`ROWGROUPRETURN: ${diffs}`);
      setRowGroupData!(r);
      setLastSend(structuredClone(r));
    }
  }, [setRowGroupData, aitid, rows, comments, replacements, spaceAfter, lastSend, location]);

  // Update row
  const updateRow = useCallback((ret: AitRowData, ri: number) => {
    // Do nothing if readonly
    if (typeof (setRowGroupData) !== "function") return;

    // Create new object to send back
    let newRows = [...rows];
    newRows[ri] = ret;
    returnData({ rows: newRows });
  }, [setRowGroupData, rows, returnData]);

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
      let c = newCell();
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
        for (let i=1; i < c.rowSpan!; i++) {
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

  // Get rows after repeat processing
  const processed = useMemo((): { rows: AitRowData[], repeats: AioRepeats } => {
    return repeatRows(
      rows,
      replacements,
      higherOptions.noRepeatProcessing,
      higherOptions.rowHeaderColumns,
      higherOptions.externalLists,
    );
  }, [higherOptions.externalLists, higherOptions.noRepeatProcessing, higherOptions.rowHeaderColumns, replacements, rows]);

  // Output the rows
  return (
    <>
      {processed.rows.map((row: AitRowData, ri: number): JSX.Element => {
        let rowHigherOptions = {
          ...higherOptions,
          row: ri,
          repeatNumber: processed.repeats.numbers[ri],
          repeatValues: processed.repeats.values[ri],
        } as AitOptionList;

        return (
          <AitRow
            key={rowHigherOptions.repeatNumber === undefined || rowHigherOptions.repeatNumber?.reduce((s, a) => s + a, 0) === 0 ? row.aitid : `${row.aitid}-${rowHigherOptions.repeatNumber?.join(',')}`}
            aitid={row.aitid ?? ri.toString()}
            cells={row.cells}
            setRowData={(ret) => updateRow(ret, ri)}
            higherOptions={rowHigherOptions}
            replacements={replacements}
            setReplacements={(ret) => returnData({ replacements: ret })}
            addRowGroup={addRowGroup}
            removeRowGroup={removeRowGroup}
            rowGroupComments={comments ?? ""}
            updateRowGroupComments={(ret) => {returnData({comments: ret})}}
            addRow={addRow}
            removeRow={rows.length > 1 ? removeRow : undefined}
            spaceAfter={row.spaceAfter !== false ? row.spaceAfter : (ri === processed.rows.length - 1 && (spaceAfter ?? true) ? 0 : false)}
            columnRepeats={columnRepeats}
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