import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import structuredClone from '@ungap/structured-clone';
import { AioOptionGroup, AioRepeats, AioReplacement, AioReplacementText } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation, AitRowGroupOptionNames, AitCellOptionNames } from "./aitInterface";
import { AitRow } from "./aitRow";
import { getRepeats, newCell, objEqual, repeatRows } from "./processes";

interface AitRowGroupProps {
  aitid: string,
  rowGroupData: AitRowGroupData
  setRowGroupData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
}

export const AitRowGroup = (props: AitRowGroupProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone(props.rowGroupData));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: props.higherOptions.tableSection,
      rowGroup: props.higherOptions.rowGroup,
      row: -1,
      column: -1,
      repeat: "na",
    }
  }, [props.higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    let r: AitRowGroupData = {
      aitid: props.rowGroupData.aitid ?? props.aitid,
      rows: rows,
      options: options
    };
    let [chkObj] = objEqual(r, lastSend, `ROWGROUPCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      props.setRowGroupData!(r);
      setLastSend(structuredClone(r));
    }
  }, [props.rowGroupData.aitid, props.aitid, props.setRowGroupData, lastSend, location]);

  // Update row
  const updateRow = useCallback((ret, ri) => {
    // Do nothing if readonly
    if (typeof (props.setRowGroupData) !== "function") return;

    // Create new object to send back
    let newRows = [...props.rowGroupData.rows];
    newRows[ri] = ret;
    returnData(newRows, props.rowGroupData.options);
  }, [props.rowGroupData.options, props.rowGroupData.rows, props.setRowGroupData, returnData]);

  const addRow = useCallback((ri) => {
    let newRowGroup = { ...props.rowGroupData };
    let newRow: AitRowData = {
      aitid: uuidv4(),
      options: [],
      cells: [],
    };
    let cols = props.rowGroupData.rows[0].cells
      .map(c => (c.options?.find(o => (o.optionName === AitCellOptionNames.colSpan))?.value) ?? 1)
      .reduce((sum, a) => sum + a, 0);
    for (let i = 0; i < cols; i++) newRow.cells.push(newCell());
    newRowGroup.rows.splice(ri + 1, 0, newRow);
    props.setRowGroupData(newRowGroup);
  }, [props])

  const removeRow = useCallback((ri) => {
    let newRowGroup = { ...props.rowGroupData };
    newRowGroup.rows.splice(ri, 1);
    // updateTable(headerData, newBody, options);
    props.setRowGroupData(newRowGroup);
  }, [props])

  // Update options
  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (props.setRowGroupData) !== "function") return;
    returnData(props.rowGroupData.rows, ret);
  }, [props.rowGroupData.rows, props.setRowGroupData, returnData]);

  // Get rows after repeat processing
  const processed: { rows: AitRowData[], repeats: AioRepeats } = useMemo(() => {

    let newRepeats: AioRepeats = { numbers: [], values: [], last: [] };
    // Find first of replacments if there are any
    let r: AioReplacement[] = props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value;

    // Get repNo list
    newRepeats = getRepeats(r, newRepeats);

    let replacements: AioReplacement[] = props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value;
    let replacementText: AioReplacementText[] = replacements.map(r => r.replacementTexts).flat();
    let x = repeatRows(
      props.rowGroupData.rows,
      props.higherOptions.noRepeatProcessing,
      replacementText,
      newRepeats,
      props.higherOptions.rowHeaderColumns,
    );
    return x;
  }, [props.higherOptions.noRepeatProcessing, props.higherOptions.rowHeaderColumns, props.rowGroupData.options, props.rowGroupData.rows]);

  // Output the rows
  return (
    <>
      {processed.rows.map((row: AitRowData, ri: number): JSX.Element => {
        let replacements: AioReplacement[] = props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value;
        let higherOptions = {
          ...props.higherOptions,
          row: ri,
          repeatNumber: processed.repeats.numbers[ri],
          repeatValues: processed.repeats.values[ri],
          replacements: replacements,
        } as AitOptionList;

        let spaceAfter = false;
        // Always add space after at the end of the group 
        if (ri === processed.rows.length-1) spaceAfter = true;
        // Check for spaceAfter highest level  for within group 
        else if (processed.repeats.numbers.length > 0) {
          let replacementTexts = replacements.map(r => r.replacementTexts).flat();
          let checkSpaceLevel: number = replacementTexts?.reduce((r, a, i) => a.spaceAfter === true ? i : r, -1) ?? -1;
          let isLastLevel: number = processed.repeats.last[ri]?.reduce((l, a, i) => a ? Math.min(l, i) : i + 1, 1);
          spaceAfter = checkSpaceLevel >= isLastLevel;
        }

        return (
          <AitRow
            key={higherOptions.repeatNumber === undefined || higherOptions.repeatNumber?.reduce((s, a) => s + a, 0) === 0 ? row.aitid : `${row.aitid}-${higherOptions.repeatNumber?.join(',')}`}
            aitid={row.aitid}
            rowData={row}
            setRowData={(ret) => updateRow(ret, ri)}
            higherOptions={higherOptions}
            rowGroupOptions={{ options: props.rowGroupData.options, setOptions: updateOptions }}
            addRowGroup={props.addRowGroup}
            removeRowGroup={props.removeRowGroup}
            addRow={addRow}
            removeRow={removeRow}
            spaceAfter={spaceAfter}
          />
        );
      })}
    </>
  );
}