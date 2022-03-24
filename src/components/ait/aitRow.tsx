import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowData, AitCellData, AitOptionList, AitLocation } from "./aitInterface";
import { AitCell } from "./aitCell";
import { objEqual } from "./processes";
import { AitBorderRow } from "./aitBorderRow";


interface AitRowProps {
  aitid: string,
  cells: AitCellData[],
  options: AioOptionGroup,
  setRowData?: (ret: AitRowData) => void,
  higherOptions: AitOptionList,
  rowGroupOptions: AioOptionGroup,
  setRowGroupOptions?: (ret: AioOptionGroup, location: AitLocation) => void,
  rowGroupWindowTitle?: string
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  addRow?: (ri: number) => void,
  removeRow?: (ri: number) => void,
  spaceAfter: boolean,
  addColSpan?: (loc: AitLocation) => void,
  removeColSpan?: (loc: AitLocation) => void,
  addRowSpan?: (loc: AitLocation) => void,
  removeRowSpan?: (loc: AitLocation) => void,
}

export const AitRow = ({ 
  aitid, 
  cells, 
  options, 
  setRowData, 
  higherOptions, 
  rowGroupOptions, 
  setRowGroupOptions, 
  rowGroupWindowTitle, 
  addRowGroup, 
  removeRowGroup,
  addRow, 
  removeRow, 
  spaceAfter,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
}: AitRowProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowData>(structuredClone({ aitid: aitid, cells: cells, options: options }));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: higherOptions.row,
      column: -1,
      repeat: (higherOptions.repeatNumber ?? []).join(",")
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((cells: AitCellData[], options: AioOptionGroup) => {
    let r: AitRowData = {
      aitid: aitid,
      cells: cells,
      options: options,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `ROWCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setRowData!(r);
      setLastSend(structuredClone(r));
    }
  }, [aitid, setRowData, lastSend, location]);

  const updateCell = useCallback((ret, ci) => {
    // Do nothing if readonly
    if (typeof (setRowData) !== "function") return;

    // Create new object to send back
    let newCells = [...cells];
    newCells[ci] = ret;
    returnData(newCells, options);
  }, [cells, options, setRowData, returnData]);

  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (setRowData) !== "function") return;
    returnData(cells, ret);
  }, [cells, setRowData, returnData]);

  return (
    <>
      <tr>
        {cells.map((cell: AitCellData, ci: number): JSX.Element => {

          // Sort out static options
          let cellHigherOptions = {
            ...higherOptions
          } as AitOptionList;
          // Add defaults - can happen on loaded information
          if (cell.aitid === undefined) cell.aitid = uuidv4();
          if (cell.rowSpan === undefined) cell.rowSpan = 1;
          if (cell.colSpan === undefined) cell.colSpan = 1;

          // Render object
          return (
            <AitCell
              key={cell.aitid}
              aitid={cell.aitid}
              text={cell.text}
              replacedText={cell.replacedText}
              colSpan={cell.colSpan}
              rowSpan={cell.rowSpan}
              options={cell.options}
              higherOptions={cellHigherOptions}
              columnIndex={ci} /* This needs to be calculated after row/colspan! */
              setCellData={(ret) => updateCell(ret, ci)}
              readOnly={((cellHigherOptions.repeatNumber && cellHigherOptions.repeatNumber?.reduce((r, a) => r + a, 0) > 0)) ?? false}
              rowGroupOptions={ci === 0 && higherOptions.row === 0 ? rowGroupOptions : undefined}
              setRowGroupOptions={ci === 0 && higherOptions.row === 0 ? setRowGroupOptions : undefined}
              rowGroupWindowTitle={ci === 0 && higherOptions.row === 0 ? rowGroupWindowTitle : undefined}
              addRowGroup={ci === 0 && higherOptions.row === 0 ? addRowGroup : undefined}
              removeRowGroup={ci === 0 && higherOptions.row === 0 ? removeRowGroup : undefined}
              rowOptions={ci === cells.length - 1 ? options : undefined}
              setRowOptions={ci === cells.length - 1 ? updateOptions : undefined}
              addRow={ci === cells.length - 1 ? addRow : undefined}
              removeRow={ci === cells.length - 1 ? removeRow : undefined}
              addColSpan={addColSpan}
              removeColSpan={removeColSpan}
              addRowSpan={addRowSpan}
              removeRowSpan={removeRowSpan}
            />
          );
        })}
      </tr>
      {spaceAfter && <AitBorderRow rowCells={cells} spaceAfter={true} noBorder={true} />}
    </>
  );
}