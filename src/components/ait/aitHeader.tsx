import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation } from "./aitInterface";
import { AitBorderRow } from "./aitBorderRow";
import { AitRow } from "./aitRow";
import { objEqual } from "./processes";

interface AitHeaderProps {
  aitid: string,
  headerData: AitRowGroupData
  setHeaderData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
}

export const AitHeader = (props: AitHeaderProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone(props.headerData));

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
    let r = { 
      aitid: props.headerData.aitid ?? props.aitid, 
      rows: rows, 
      options: options 
    };
    let [chkObj, diffs] = objEqual(r, lastSend, `${Object.values(location).join(',')}-`);
    if (!chkObj) {
      console.log(`Return for header: ${diffs}`);
      props.setHeaderData!(r);
      setLastSend(structuredClone(r));
    }
  }, [lastSend, location, props.aitid, props.headerData.aitid, props.setHeaderData]);

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
      <AitBorderRow rowCells={props.headerData.rows[0].cells} spaceAfter={true} />
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
      <AitBorderRow rowCells={props.headerData.rows[0].cells} spaceBefore={true} noBorder={true}/>
    </thead>
  );
}