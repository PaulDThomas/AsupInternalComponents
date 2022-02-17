import * as React from 'react';
import { useState, useEffect } from "react";
import { AitLocation, AitRowData, AitRowGroupData, AitRowType } from "./aitInterface";
import { AitRow } from "./aitRow";


interface AitRowGroupProps {
  initialData: AitRowGroupData,
  returnData: (ret: AitRowGroupData) => void,
  type: AitRowType,
  location: AitLocation,
  showCellBorders?: boolean,
  maxRows?: number,
  maxColumns?: number,
}

export const AitRowGroup = (props: AitRowGroupProps): JSX.Element => {
  // Data holder
  const [rows, setRows] = useState(props.initialData.rows ?? []);
  const [options, setOptions] = useState(props.initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setRows(props.initialData.rows ?? []); }, [props.initialData.rows]);
  useEffect(() => { setOptions(props.initialData.options ?? {}); }, [props.initialData.options]);

  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
    const r = {
      options: options ?? [],
      rows: rows ?? [],
    }
    if (typeof (props.returnData) === "function") props.returnData(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, props.returnData, rows]);

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof (props.initialData) !== "object") return (
    <tr>
      <td>
        Bad initialData in AitRowGroup
      </td>
    </tr>
  );

  // Update held data
  const updateRows = (ret: AitRowData, i: number) => {
    //console.log(`Updating row ${i} to... ${JSON.stringify(ret)}`);
    const newRows = rows;
    newRows[i] = ret;
    setRows(newRows);
  }

  return (
    <>
      {(props.initialData.rows ?? []).map((row, i) => {
        return (
          <AitRow
            key={i}
            type={props.type}
            location={{ ...props.location, row: i }}
            showCellBorders={props.showCellBorders}
            initialData={row}
            returnData={(ret) => updateRows(ret, i)}
            rowGroupOptions={(i === 0 ? options : undefined)}
            setRowGroupOptions={(i === 0 ? setOptions : undefined)}
          />
        )
      })
      }
    </>
  );
};