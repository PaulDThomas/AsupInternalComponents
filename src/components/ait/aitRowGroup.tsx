import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup, AioReplacement, AitRowGroupOptionNames } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation } from "./aitInterface";
import { AitRow } from "./aitRow";
import { objEqual } from "./processes";

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
      repeat: "0",
    }
  }, [props.higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    let r:AitRowGroupData = { 
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
  const level1reps = useMemo(():number[] => {
    // Find replacments if there are any
    let r:AioReplacement = props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value[0];
    if (!r || !r?.replacementValues || r.replacementValues.length === 0) return [0];

    // Calculate all replacements at this level
    return Array.from(
      Array(
        r.replacementValues.length
        ).keys());

  }, [props.rowGroupData.options]);

  return (
    <>
      {level1reps.map(repNo => {
        return (
          props.rowGroupData?.rows.map((row: AitRowData, ri: number): JSX.Element => {
            let higherOptions = {
              ...props.higherOptions,
              row: ri,
              repeatNumber: [repNo],
              replacements: props.rowGroupData.options.find(o => o.optionName === AitRowGroupOptionNames.replacements)?.value,
            } as AitOptionList;
            if (row.aitid === undefined) row.aitid = uuidv4();

            return (
              <AitRow
                key={row.aitid}
                aitid={row.aitid}
                rowData={row}
                setRowData={(ret) => updateRow(ret, ri)}
                higherOptions={higherOptions}
                rowGroupOptions={[props.rowGroupData.options, updateOptions]}
                addRowGroup={props.addRowGroup}
                removeRowGroup={props.removeRowGroup}
              />
            );
          })
        );
      })}
    </>
  );
}