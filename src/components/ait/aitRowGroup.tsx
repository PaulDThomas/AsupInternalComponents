import structuredClone from '@ungap/structured-clone';
import { AioRepeats, AioReplacement } from "components/aio/aioInterface";
import { newCell } from "components/functions/newCell";
import { objEqual } from "components/functions/objEqual";
import { repeatRows } from "components/functions/repeatRows";
import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AitColumnRepeat, AitLocation, AitOptionList, AitRowData, AitRowGroupData } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  aitid: string,
  rows: AitRowData[]
  replacements: AioReplacement[],
  setRowGroupData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  columnRepeats?: AitColumnRepeat[],
}

export const AitRowGroup = ({
  aitid,
  rows,
  replacements,
  setRowGroupData,
  higherOptions,
  addRowGroup,
  removeRowGroup,
  columnRepeats,
}: AitRowGroupProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone({ aitid: aitid, rows: rows, replacements: replacements }));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: -1,
      column: -1,
      repeat: "na",
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rowGroupUpdate: { rows?: AitRowData[], replacements?: AioReplacement[] }) => {
    if (typeof setRowGroupData !== "function") return;
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: rowGroupUpdate.rows ?? rows,
      replacements: rowGroupUpdate.replacements ?? replacements
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `ROWGROUPCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      // console.log(`ROWGROUPRETURN: ${diffs}`);
      setRowGroupData!(r);
      setLastSend(structuredClone(r));
    }
  }, [setRowGroupData, aitid, rows, replacements, lastSend, location]);

  // Update row
  const updateRow = useCallback((ret, ri) => {
    // Do nothing if readonly
    if (typeof (setRowGroupData) !== "function") return;

    // Create new object to send back
    let newRows = [...rows];
    newRows[ri] = ret;
    returnData({ rows: newRows });
  }, [setRowGroupData, rows, returnData]);

  const addRow = useCallback((ri) => {
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

  const removeRow = useCallback((ri) => {
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
    );
  }, [higherOptions.noRepeatProcessing, higherOptions.rowHeaderColumns, replacements, rows]);

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

        let spaceAfter = false;
        // Always add space after at the end of the group 
        if (ri === processed.rows.length - 1) spaceAfter = true;
        // Check for spaceAfter highest level  for within group 
        else if (processed.repeats.numbers.length > 0) {
          let replacementTexts = replacements.map(r => r.replacementTexts).flat();
          let checkSpaceLevel: number = replacementTexts?.reduce((r, a, i) => a.spaceAfter === true ? i : r, -1) ?? -1;
          let isLastLevel: number = processed.repeats.last[ri]?.reduce((l, a, i) => a ? Math.min(l, i) : i + 1, 1);
          spaceAfter = checkSpaceLevel >= isLastLevel;
        }
        if (!row.aitid) row.aitid = uuidv4();

        return (
          <AitRow
            key={rowHigherOptions.repeatNumber === undefined || rowHigherOptions.repeatNumber?.reduce((s, a) => s + a, 0) === 0 ? row.aitid : `${row.aitid}-${rowHigherOptions.repeatNumber?.join(',')}`}
            aitid={row.aitid}
            cells={row.cells}
            setRowData={(ret) => updateRow(ret, ri)}
            higherOptions={rowHigherOptions}
            replacements={replacements}
            setReplacements={(ret) => returnData({ replacements: ret })}
            addRowGroup={addRowGroup}
            removeRowGroup={removeRowGroup}
            addRow={addRow}
            removeRow={ri > 0 ? removeRow : undefined}
            spaceAfter={spaceAfter}
            columnRepeats={columnRepeats}
          />
        );
      })}
    </>
  );
}