import * as React from 'react';
import { useState, useEffect } from "react";
import { AitRowGroupData, AitRowType, AitTableBodyData } from './aitInterface';
import { AitRowGroup } from "./aitRowGroup";

interface AitTableBodyProps {
  initialData: AitTableBodyData,
  returnData: (ret: AitTableBodyData) => void,
  showCellBorders?: boolean,
}

export const AitTableBody = (props: AitTableBodyProps): JSX.Element => {

  const [rowGroups, setRowGroups] = useState(props.initialData.rowGroups ?? []);
  const [options, setOptions] = useState(props.initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setRowGroups(props.initialData.rowGroups ?? []); }, [props.initialData.rowGroups]);
  useEffect(() => { setOptions(props.initialData.options ?? {}); }, [props.initialData.options]);


  // Send data up the tree
  useEffect(() => {
    const r = {
      rowGroups: rowGroups,
      options: options,
    }
    if (typeof (props.returnData) === "function") props.returnData(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, props.returnData, rowGroups])

  // Update data from components
  const updateRowGroup = (ret: AitRowGroupData, i: number) => {
    const newRowGroups = rowGroups;
    newRowGroups[i] = ret;
    setRowGroups(newRowGroups);
  };

  return (
    <>
      {(rowGroups ?? []).map((rowGroup, i) => {
        return (
          <AitRowGroup
            key={i}
            location={{ tableSection: "body", rowGroup: i }}
            initialData={rowGroup}
            returnData={(ret) => updateRowGroup(ret, i)}
            type={AitRowType.body}
            showCellBorders={props.showCellBorders}
          />
        );
      })}
    </>
  );
};