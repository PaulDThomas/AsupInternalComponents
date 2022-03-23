import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import structuredClone from '@ungap/structured-clone';
import { AioOptionGroup, AioRepeats, AioReplacement, AioReplacementText } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation, AitRowGroupOptionNames, AitCellOptionNames } from "./aitInterface";
import { AitRow } from "./aitRow";
import { getRepeats, newCell, objEqual, repeatRows } from "./processes";

interface AitRowGroupProps {
  aitid: string,
  rows: AitRowData[]
  options: AioOptionGroup
  setRowGroupData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
}

export const AitRowGroup = ({ aitid, rows, options, setRowGroupData, higherOptions, addRowGroup, removeRowGroup }: AitRowGroupProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone({ aitid: aitid, rows: rows, options: options }));

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
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    let r: AitRowGroupData = {
      aitid: aitid,
      rows: rows,
      options: options
    };
    let [chkObj] = objEqual(r, lastSend, `ROWGROUPCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setRowGroupData!(r);
      setLastSend(structuredClone(r));
    }
  }, [aitid, setRowGroupData, lastSend, location]);

  // Update row
  const updateRow = useCallback((ret, ri) => {
    // Do nothing if readonly
    if (typeof (setRowGroupData) !== "function") return;

    // Create new object to send back
    let newRows = [...rows];
    newRows[ri] = ret;
    returnData(newRows, options);
  }, [setRowGroupData, rows, returnData, options]);

  const addRow = useCallback((ri) => {
    let newRowGroup = { aitid: aitid, rows: rows, options: options };
    let newRow: AitRowData = {
      aitid: uuidv4(),
      options: [],
      cells: [],
    };
    let cols = rows[0].cells
      .map(c => (c.options?.find(o => (o.optionName === AitCellOptionNames.colSpan))?.value) ?? 1)
      .reduce((sum, a) => sum + a, 0);
    for (let i = 0; i < cols; i++) newRow.cells.push(newCell());
    newRowGroup.rows.splice(ri + 1, 0, newRow);
    setRowGroupData(newRowGroup);
  }, [aitid, options, rows, setRowGroupData])

  const removeRow = useCallback((ri) => {
    let newRowGroup = { aitid: aitid, rows: rows, options: options };
    newRowGroup.rows.splice(ri, 1);
    // updateTable(headerData, newBody, options);
    setRowGroupData(newRowGroup);
  }, [aitid, options, rows, setRowGroupData])

  // Update options
  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (setRowGroupData) !== "function") return;
    returnData(rows, ret);
  }, [setRowGroupData, returnData, rows]);

  // Get rows after repeat processing
  const processed: { rows: AitRowData[], repeats: AioRepeats } = useMemo((): { rows: AitRowData[], repeats: AioRepeats } => {

    let newRepeats: AioRepeats = { numbers: [], values: [], last: [] };
    // Find first of replacments if there are any
    let r: AioReplacement[] = options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value;
    if (!r) return { rows: rows, repeats: newRepeats };
    let replacementText: AioReplacementText[] = r.map(r => r.replacementTexts).flat();

    // Get repNo list
    newRepeats = getRepeats(r, newRepeats);

    let x = repeatRows(
      rows,
      higherOptions.noRepeatProcessing,
      replacementText,
      newRepeats,
      higherOptions.rowHeaderColumns,
    );
    return x;
  }, [higherOptions.noRepeatProcessing, higherOptions.rowHeaderColumns, options, rows]);

  // Output the rows
  return (
    <>
      {processed.rows.map((row: AitRowData, ri: number): JSX.Element => {
        let replacements: AioReplacement[] = options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value;
        let rowHigherOptions = {
          ...higherOptions,
          row: ri,
          repeatNumber: processed.repeats.numbers[ri],
          repeatValues: processed.repeats.values[ri],
          replacements: replacements,
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
            options={row.options}
            setRowData={(ret) => updateRow(ret, ri)}
            higherOptions={rowHigherOptions}
            rowGroupOptions={options}
            setRowGroupOptions={updateOptions}
            addRowGroup={addRowGroup}
            removeRowGroup={removeRowGroup}
            addRow={addRow}
            removeRow={ri > 0 ? removeRow : undefined}
            spaceAfter={spaceAfter}
          />
        );
      })}
    </>
  );
}