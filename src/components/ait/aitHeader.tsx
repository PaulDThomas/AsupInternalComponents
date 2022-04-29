import React, { useCallback, useEffect, useState } from "react";
import { AioReplacement } from "../aio";
import { newCell, newRow, repeatHeaders } from "../functions";
import { AitBorderRow } from "./aitBorderRow";
import { AitCellData, AitCellType, AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowGroupData } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitHeaderProps {
  aitid: string,
  rows: AitRowData[],
  comments: string,
  replacements: AioReplacement[],
  setHeaderData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  columnRepeats: AitColumnRepeat[] | null,
  setColumnRepeats: (ret: AitColumnRepeat[] | null) => void,
}

export const AitHeader = ({
  aitid,
  rows,
  comments,
  replacements,
  setHeaderData,
  higherOptions,
  columnRepeats,
  setColumnRepeats,
}: AitHeaderProps): JSX.Element => {

  const [processedRows, setProcessedRows] = useState<AitRowData[]>([...rows]);
  useEffect(() => { 
    // console.group(`Processing header data ${aitid}`);
    if (rows.some(r => (r.aitid === undefined || r.cells.some(c => c.aitid === undefined) ))) {
      console.log("Missing aitid!?!");
      return;
    }
    // console.log(`${rows.map(r => r.cells.map(c => c.text).join("||")).join("\n")}`);
    // console.log(`${rows.map(r => r.cells.map(c => c.aitid?.substring(0, 3)).join("||")).join("\n")}`);
    if ((rows.length ?? 0) > 0) {
      let headerDataUpdate = repeatHeaders(
        rows,
        replacements ?? [],
        higherOptions.noRepeatProcessing ?? false,
        higherOptions.rowHeaderColumns ?? 0,
        higherOptions.externalLists,
      );
      // console.log(`${headerDataUpdate.rows.map(r => r.cells.map(c => c.text).join("||")).join("\n")}`);
      // console.log(`${headerDataUpdate.rows.map(r => r.cells.map(c => c.aitid?.substr(0, 3)).join("||")).join("\n")}`);
      setProcessedRows(headerDataUpdate.rows);
      setColumnRepeats(headerDataUpdate.columnRepeats);
    }
    else {
      setColumnRepeats(null);
    }
    // console.groupEnd();
  }, [aitid, higherOptions.externalLists, higherOptions.noRepeatProcessing, higherOptions.rowHeaderColumns, replacements, rows, setColumnRepeats]);

  // General function to return complied object
  const returnData = useCallback((headerUpdate: {
    rows?: AitRowData[],
    comments?: string,
    replacements?: AioReplacement[]
  }) => {
    if (typeof (setHeaderData) !== "function") return;
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: (headerUpdate.rows ?? rows).map(r => {
        return {
          aitid: r.aitid,
          cells: r.cells.filter((c, ci) => (
            !columnRepeats
            || !columnRepeats[ci]
            || !columnRepeats[ci].repeatNumbers
            || columnRepeats[ci].repeatNumbers?.reduce((r, a) => r + a, 0) === 0
          ))
        };
      }),
      comments: headerUpdate.comments ?? comments,
      replacements: headerUpdate.replacements ?? replacements,
    };
    console.group(`AitHeader returnData: ${aitid}`);
    console.log(`${r?.rows.map(r => r.cells.map(c => c.text).join("||")).join("\n")}`);
    console.groupEnd();
    setHeaderData!(r);
  }, [setHeaderData, aitid, rows, comments, replacements, columnRepeats]);

  // Update row
  const updateRow = useCallback((ret: AitRowData, ri: number) => {
    // Create new object to send back
    let newRows: AitRowData[] = [...rows];
    newRows[ri] = ret;
    returnData({ rows: newRows });
  }, [rows, returnData]);

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

  if (rows.length === 0) return <></>;

  return (
    <>
      {
        processedRows.map((row: AitRowData, ri: number): JSX.Element => {

          let rowHigherOptions: AitOptionList = {
            ...higherOptions,
            headerRows: rows.length,
            row: ri,
          } as AitOptionList;

          return (
            <AitRow
              key={row.aitid!}
              aitid={row.aitid!}
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
      {(columnRepeats?.length ?? 0) > 0
        ? <AitBorderRow rowLength={columnRepeats!.length} spaceBefore={true} spaceAfter={true} />
        : <></>
      }
    </>
  );
}