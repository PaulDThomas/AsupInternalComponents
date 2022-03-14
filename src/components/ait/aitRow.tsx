import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowData, AitCellData, AitOptionList } from "./aitInterface";
import { AitCell } from "./aitCell";


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
  const [lastSend, setLastSend] = useState("");

  // General function to return complied object
  const returnData = useCallback((cells: AitCellData[], options: AioOptionGroup) => {
    console.log(`Cell Return for row: ${props.higherOptions.tableSection},${props.higherOptions.rowGroup},${props.higherOptions.row}`);
    let newRowData = { aitid: props.aitid, cells: cells, options: options };
    if (JSON.stringify(newRowData) !== lastSend) {
      props.setRowData!(newRowData);
      setLastSend(JSON.stringify(newRowData));
    }
  }, [lastSend, props.aitid, props.higherOptions.row, props.higherOptions.rowGroup, props.higherOptions.tableSection, props.setRowData]);

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
              readOnly={cell.readOnly ?? false}
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