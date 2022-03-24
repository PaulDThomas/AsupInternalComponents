import React, { useCallback, useMemo, useState } from "react";
import structuredClone from '@ungap/structured-clone';
import { v4 as uuidv4 } from "uuid";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AitRowGroupData, AitRowData, AitOptionList, AitLocation } from "./aitInterface";
import { AitRow } from "./aitRow";
import { objEqual } from "./processes";

interface AitHeaderProps {
  aitid: string,
  rows: AitRowData[],
  options: AioOptionGroup,
  setHeaderData: (ret: AitRowGroupData) => void,
  higherOptions: AitOptionList,
}

export const AitHeader = ({ aitid, rows, options, setHeaderData, higherOptions }: AitHeaderProps): JSX.Element => {
  const [lastSend, setLastSend] = useState<AitRowGroupData>(structuredClone({ aitid: aitid, rows: rows, options: options }));

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: -1,
      column: -1,
      repeat: "",
    }
  }, [higherOptions]);

  // General function to return complied object
  const returnData = useCallback((rows: AitRowData[], options: AioOptionGroup) => {
    let r = {
      aitid: aitid ?? aitid,
      rows: rows,
      options: options
    };
    let [chkObj] = objEqual(r, lastSend, `HEADERCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setHeaderData!(r);
      setLastSend(structuredClone(r));
    }
  }, [lastSend, location, aitid, setHeaderData]);

  // Update row
  const updateRow = useCallback((ret, ri) => {
    // Do nothing if readonly
    if (typeof (setHeaderData) !== "function") return;

    // Create new object to send back
    let newRows = [...rows];
    newRows[ri] = ret;
    returnData(newRows, options);
  }, [options, rows, setHeaderData, returnData]);

  // Update options
  const updateOptions = useCallback((ret: AioOptionGroup) => {
    // Do nothing if readonly
    if (typeof (setHeaderData) !== "function") return;
    returnData(rows, ret);
  }, [rows, setHeaderData, returnData]);

  // Manipulate spans
  const addColSpan = useCallback((loc: AitLocation) => {
    console.log(`Adding to rowspan for cell ${JSON.stringify(loc)}`);
  },[]);

  return (
    <>
      {
        rows.map((row: AitRowData, ri: number): JSX.Element => {

          let rowHigherOptions = {
            ...higherOptions,
            row: ri,
          } as AitOptionList;
          if (row.aitid === undefined) row.aitid = uuidv4();

          return (
            <AitRow
              key={row.aitid}
              aitid={row.aitid}
              cells={row.cells}
              options={row.options}
              setRowData={(ret) => updateRow(ret, ri)}
              higherOptions={rowHigherOptions}
              spaceAfter={false}
              rowGroupOptions={options}
              setRowGroupOptions={updateOptions}
              rowGroupWindowTitle={"Header options"}
              addColSpan={addColSpan}
              removeColSpan={addColSpan}
              addRowSpan={addColSpan}
              removeRowSpan={addColSpan}
            />
          );
        }
        )
      }
    </>
  );
}