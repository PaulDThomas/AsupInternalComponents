import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowData, AitCellData, AitOptionList, AitLocation } from "./aitInterface";
import { AitCell } from "./aitCell";
import { objEqual } from "./processes";


interface AitRowProps {
  aitid: string,
  rowData: AitRowData,
  setRowData?: (ret: AitRowData) => void,
  higherOptions: AitOptionList,
  rowGroupOptions: [AioOptionGroup, (ret: AioOptionGroup) => void],
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
}


export const AitRow = (props: AitRowProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowData>(structuredClone(props.rowData));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: props.higherOptions.tableSection,
      rowGroup: props.higherOptions.rowGroup,
      row: props.higherOptions.row,
      column: -1,
      repeat: props.higherOptions.repeatNumber.join(',')
    }
  }, [props.higherOptions]);

  // General function to return complied object
  const returnData = useCallback((cells: AitCellData[], options: AioOptionGroup) => {
    let r:AitRowData = {
      aitid: props.rowData.aitid ?? props.aitid,
      cells: cells,
      options: options
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `${Object.values(location).join(',')}-`);
    if (!chkObj) {
      console.log(`Return for row: ${diffs}`);
      props.setRowData!(r);
      setLastSend(structuredClone(r));
    }
  }, [props.rowData, props.aitid, props.setRowData, lastSend, location]);

  const updateCell = useCallback((ret, ci) => {
    // Do nothing if readonly
    if (typeof (props.setRowData) !== "function") return;

    // Create new object to send back
    let newCells = [...props.rowData.cells];
    newCells[ci] = ret;
    returnData(newCells, props.rowData.options);
  }, [props.rowData.cells, props.rowData.options, props.setRowData, returnData]);

  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (props.setRowData) !== "function") return;
    returnData(props.rowData.cells, ret);
  }, [props.rowData.cells, props.setRowData, returnData]);

  return (
    <>
      <tr>
        {props.rowData.cells.map((cell: AitCellData, ci: number): JSX.Element => {

          // Sort out static options
          let higherOptions = {
            ...props.higherOptions,
            repeatNumber: [...props.higherOptions.repeatNumber],
            column: ci,
          } as AitOptionList;
          if (cell.aitid === undefined) cell.aitid = uuidv4();

          // Render object
          return (
            <AitCell
              key={cell.aitid}
              aitid={cell.aitid}
              higherOptions={higherOptions}
              columnIndex={ci} /* This needs to be calculated after row/colspan! */
              cellData={cell}
              setCellData={(ret) => updateCell(ret, ci)}
              readOnly={(cell.readOnly || (higherOptions.repeatNumber.reduce((r, a) => r + a, 0) > 0)) ?? false}
              rowGroupOptions={ci === 0 && props.higherOptions.row === 0 ? props.rowGroupOptions : undefined}
              addRowGroup={ci === 0 && props.higherOptions.row === 0 ? props.addRowGroup : undefined}
              removeRowGroup={ci === 0 && props.higherOptions.row === 0 && props.higherOptions.rowGroup > 0 ? props.removeRowGroup : undefined}
              rowOptions={(ci === props.rowData.cells.length - 1 ? [props.rowData.options, updateOptions] : undefined)}
            />
          );
        })}
      </tr>
    </>
  );
}