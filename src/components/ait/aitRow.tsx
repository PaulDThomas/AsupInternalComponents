import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioReplacement } from "components/aio/aioInterface";
import { AitRowData, AitCellData, AitOptionList, AitLocation } from "./aitInterface";
import { AitCell } from "./aitCell";
import { objEqual } from "./processes";
import { AitBorderRow } from "./aitBorderRow";


interface AitRowProps {
  aitid: string,
  cells: AitCellData[],
  setRowData?: (ret: AitRowData) => void,
  higherOptions: AitOptionList,
  replacements: AioReplacement[],
  setReplacements?: (ret: AioReplacement[], location: AitLocation) => void,
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
  setRowData,
  higherOptions,
  replacements,
  setReplacements,
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
  const [lastSend, setLastSend] = useState<AitRowData>(structuredClone({ aitid: aitid, cells: cells }));

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
  const returnData = useCallback((rowUpdate: { cells?: AitCellData[] }) => {
    if (typeof (setRowData) !== "function") return;
    let r: AitRowData = {
      aitid: aitid,
      cells: rowUpdate.cells ?? cells,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `ROWCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setRowData!(r);
      setLastSend(structuredClone(r));
    }
  }, [setRowData, aitid, cells, lastSend, location]);

  const updateCell = useCallback((ret, ci) => {
    // Create new object to send back
    let newCells = [...cells];
    newCells[ci] = ret;
    returnData({ cells: newCells });
  }, [cells, returnData]);

  return (
    <>
      <tr>
        {cells.map((cell: AitCellData, ci: number): JSX.Element => {

          // Sort out static options
          let cellHigherOptions:AitOptionList = {
            ...higherOptions,
            columns: cells.length
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
              colWidth={cell.colWidth}
              higherOptions={cellHigherOptions}
              columnIndex={ci} /* This needs to be calculated after row/colspan! */
              setCellData={(ret) => updateCell(ret, ci)}
              readOnly={((cellHigherOptions.repeatNumber && cellHigherOptions.repeatNumber?.reduce((r, a) => r + a, 0) > 0)) ?? false}
              replacements={ci === 0 && higherOptions.row === 0 ? replacements : undefined}
              setReplacements={ci === 0 && higherOptions.row === 0 ? setReplacements : undefined}
              rowGroupWindowTitle={ci === 0 && higherOptions.row === 0 ? rowGroupWindowTitle : undefined}
              addRowGroup={ci === 0 && higherOptions.row === 0 ? addRowGroup : undefined}
              removeRowGroup={ci === 0 && higherOptions.row === 0 ? removeRowGroup : undefined}
              addRow={ci === cells.length - 1 ? addRow : undefined}
              removeRow={ci === cells.length - 1 ? removeRow : undefined}
              addColSpan={ci + cell.colSpan < cells.length ? addColSpan : undefined}
              removeColSpan={cell.colSpan > 1 ? removeColSpan : undefined}
              addRowSpan={cellHigherOptions.row + cell.rowSpan < cellHigherOptions.headerRows ? addRowSpan : undefined}
              removeRowSpan={cell.rowSpan > 1 ? removeRowSpan : undefined}
            />
          );
        })}
      </tr>
      {spaceAfter && <AitBorderRow rowCells={cells} spaceAfter={true} noBorder={true} />}
    </>
  );
}