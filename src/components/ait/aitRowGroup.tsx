import { useCallback, useContext } from "react";
import { AioReplacement } from "../aio";
import { newCell, newRow } from "../functions";
import { TableSettingsContext } from "./aitContext";
import { AitLocation, AitRowData, AitRowGroupData } from "./aitInterface";
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
      const cols = rows[0].cells.length;
      for (let ci = 0; ci < cols; ci++) {
        // Create new cell, use column width from row 0
        const c = newCell(rows[0].cells[ci].colWidth ?? tableSettings.defaultCellWidth);
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
      newRows.splice(ri, 1);
      returnData({ rows: newRows });
    },
    [returnData, rows],
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
          />
        );
      })}
    </>
  );
};
