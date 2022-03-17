import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { AioOptionGroup, AioReplacement, AioReplacementText, AitRowGroupOptionNames } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation } from "./aitInterface";
import { AitRow } from "./aitRow";
import { firstUnequal, getReplacementValues, objEqual } from "./processes";

/** Find which row replacementText first appears in */
const findTargets = (rows: AitRowData[], replacementText?: AioReplacementText[]): number[] => {
  let targetArray: number[] = [];
  if (!replacementText || replacementText.length === 0) return targetArray;

  textSearch: for (let i = 0; i < replacementText.length; i++) {
    rowSearch: for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].cells.length; ci++) {
        if (rows[ri].cells[ci].text.includes(replacementText[i].text)) {
          targetArray.push(ri);
          break rowSearch;
        }
      }
      if (targetArray.length < i) break textSearch;
    }
  }
  return targetArray;
}

/** Repeat rows based on repeat number array with potential for partial repeats */
const repeatRows = (
  rows: AitRowData[],
  replacementText?: AioReplacementText[],
  repeatNumbers?: number[][],
  repeatValues?: string[][]
): [AitRowData[], number[][], string[][]] => {

  let targetArray = findTargets(rows, replacementText);
  if (!repeatNumbers || repeatNumbers.length === 0) return [rows, repeatNumbers ?? [[]], repeatValues ?? [[]]];

  let newRows: AitRowData[] = [];
  let newRepeatNumbers: number[][] = [];
  let newRepeatValues: string[][] = [];
  let lastRepeat: number[] = [];
  for (let repi = 0; repi < repeatNumbers.length; repi++) {
    let repNo: number[] = repeatNumbers[repi];
    let repVal: string[] = repeatValues !== undefined ? repeatValues[repi] : [];
    let firstLevel: number = firstUnequal(repNo, lastRepeat);
    let slice = rows.slice(targetArray[firstLevel]);
    newRows.push(...slice);
    newRepeatNumbers.push(...Array(slice.length).fill(repNo));
    newRepeatValues.push(...Array(slice.length).fill(repVal));
    lastRepeat = [...repNo];
  }
  return [newRows, newRepeatNumbers, newRepeatValues];
}

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
    let [chkObj, diffs] = objEqual(r, lastSend, `${Object.values(location).join(',')}-`);
    if (!chkObj) {
      console.log(`Return for rowGroup: ${diffs}`);
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

  // Update options
  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (props.setRowGroupData) !== "function") return;
    returnData(props.rowGroupData.rows, ret);
  }, [props.rowGroupData.rows, props.setRowGroupData, returnData]);

  // Get the first level of repeats
  const repeatValues = useMemo((): [number[][], string[][]] => {
    // Find first of replacments if there are any
    let r: AioReplacement = props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value[0];
    if (!r || !r?.replacementValues || r.replacementValues.length === 0) return [[], []];

    // Get repNo list
    return getReplacementValues(r.replacementValues);

  }, [props.rowGroupData.options]);

  const [processedRows, processedRepeatNumbers, processedRepeatValues] = repeatRows(
    props.rowGroupData.rows,
    props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value.map((r: AioReplacement) => r.replacementText).flat(),
    repeatValues[0],
    repeatValues[1]
  )

  return (
    <>
      {processedRows.map((row: AitRowData, ri: number): JSX.Element => {
        let higherOptions = {
          ...props.higherOptions,
          row: ri,
          repeatNumber: processedRepeatNumbers[ri],
          repeatValues: processedRepeatValues[ri],
          replacements: props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value,
        } as AitOptionList;

        return (
          <AitRow
            key={`${ri}-R${processedRepeatNumbers[ri].join(",")}-${row.aitid}`}
            aitid={row.aitid}
            rowData={row}
            setRowData={(ret) => updateRow(ret, ri)}
            higherOptions={higherOptions}
            rowGroupOptions={[props.rowGroupData.options, updateOptions]}
            addRowGroup={props.addRowGroup}
            removeRowGroup={props.removeRowGroup}
          />
        );
      })}
    </>
  );
}