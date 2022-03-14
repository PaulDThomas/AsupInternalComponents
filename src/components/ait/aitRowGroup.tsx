import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList } from "./aitInterface";
import { AitRow } from "./aitRow";

interface AitRowGroupProps {
  aitid: string,
  rowGroupData: AitRowGroupData
  setRowGroupData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
}

export const AitRowGroup = (props: AitRowGroupProps): JSX.Element => {
  const [lastSend, setLastSend] = useState("");

  // General function to return complied object
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    console.log(`Cell Return for rowGroup: ${props.higherOptions.tableSection},${props.higherOptions.rowGroup}`);
    let newRowGroupData = { aitid: props.aitid, rows: rows, options: options };
    if (JSON.stringify(newRowGroupData) !== lastSend) {
      props.setRowGroupData!(newRowGroupData);
      setLastSend(JSON.stringify(newRowGroupData));
    }
  }, [lastSend, props.aitid, props.higherOptions.rowGroup, props.higherOptions.tableSection, props.setRowGroupData]);

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

  let repeatNumbers = [1];

  return (
    <>
      {repeatNumbers.map(repNo => {
        return (
          props.rowGroupData?.rows.map((row: AitRowData, ri: number): JSX.Element => {
            let higherOptions = {
              ...props.higherOptions,
              repeatNumber: repNo,
              row: ri,
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