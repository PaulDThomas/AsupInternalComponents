import structuredClone from '@ungap/structured-clone';
import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioRepeats, AioReplacement } from "../aio/aioInterface";
import { newCell } from "../functions/newCell";
import { objEqual } from "../functions/objEqual";
import { repeatRows } from "../functions/repeatRows";
import { AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowGroupData, AitRowType } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  aitid: string,
  rows: AitRowData[]
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
  rows,
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
  const returnData = useCallback((rowGroupUpdate: { rows?: AitRowData[], replacements?: AioReplacement[], spaceAfter?: boolean }) => {
    if (typeof setRowGroupData !== "function") return;
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: rowGroupUpdate.rows ?? rows,
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
  }, [setRowGroupData, aitid, rows, replacements, spaceAfter, lastSend, location]);

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
    for (let i = 0; i < cols; i++) newRow.cells.push(newCell());
    newRows.splice(ri + 1, 0, newRow);
    returnData({ rows: newRows });
  }, [returnData, rows])

  const removeRow = useCallback((ri: number) => {
    let newRows = [...rows];
    newRows.splice(ri, 1);
    returnData({ rows: newRows });
  }, [returnData, rows])

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
            addRow={addRow}
            removeRow={rows.length > 1 ? removeRow : undefined}
            spaceAfter={row.spaceAfter !== false ? row.spaceAfter : (ri === processed.rows.length - 1 && (spaceAfter ?? true) ? 0 : false)}
            columnRepeats={columnRepeats}
            rowGroupSpace={spaceAfter}
            setRowGroupSpace={(ret) => returnData({ spaceAfter: ret })}
          />
        );
      })}
    </>
  );
}