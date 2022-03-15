import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList } from "./aitInterface";
import { AitBorderRow } from "./aitBorderRow";
import { AitRow } from "./aitRow";

interface AitHeaderProps {
  aitid: string,
  headerData: AitRowGroupData
  setHeaderData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
}

export const AitHeader = (props: AitHeaderProps): JSX.Element => {
  const [lastSend, setLastSend] = useState("");

  // General function to return complied object
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    //console.log(`Return for header: ${props.higherOptions.tableSection}`);
    let newHeaderData = { aitid: props.aitid, rows: rows, options: options };
    if (JSON.stringify(newHeaderData) !== lastSend) {
      props.setHeaderData!(newHeaderData);
      setLastSend(JSON.stringify(newHeaderData));
    }
  }, [lastSend, props.aitid, props.setHeaderData]);

  // Update row
  const updateRow = useCallback((ret, ri) => {
    // Do nothing if readonly
    if (typeof (props.setHeaderData) !== "function") return;

    // Create new object to send back
    let newRows = [...props.headerData.rows];
    newRows[ri] = ret;
    returnData(newRows, props.headerData.options);
  }, [props.headerData.options, props.headerData.rows, props.setHeaderData, returnData]);

  // Update options
  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (props.setHeaderData) !== "function") return;
    returnData(props.headerData.rows, ret);
  }, [props.headerData.rows, props.setHeaderData, returnData]);

  return (
    <thead>
      <AitBorderRow rowCells={props.headerData.rows[0].cells} />
      {
        props.headerData?.rows.map((row: AitRowData, ri: number): JSX.Element => {

          let higherOptions = {
            ...props.higherOptions,
            repeatNumber: [0],
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
              rowGroupOptions={[props.headerData.options, updateOptions]}
            />
          );
        }
        )
      }
    </thead>
  );
}