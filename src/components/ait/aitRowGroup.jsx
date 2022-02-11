import { useState, useEffect } from "react";
import { AitRow } from "./aitRow";

export const AitRowGroup = ({
  initialData,
  returnData,
  type = "body",
  location,
  showCellBorders,
  maxRows,
  maxColumns,
}) => {
  // Data holder
  const [rows, setRows] = useState(initialData.rows ?? []);
  const [options, setOptions] = useState(initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setRows(initialData.rows ?? []); }, [initialData.rows]);
  useEffect(() => { setOptions(initialData.options ?? {}); }, [initialData.options]);

  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
    const r = {
      options: options ?? [],
      rows: rows ?? [],
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [options, returnData, rows]);

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof (initialData) !== "object") return (
    <tr>
      <td>
        Bad initialData in AitRowGroup
      </td>
    </tr>
  );

  // Update held data
  const updateRows = (ret, i) => {
    //console.log(`Updating row ${i} to... ${JSON.stringify(ret)}`);
    const newRows = rows;
    newRows[i] = ret;
    setRows(newRows);
  }

  return (
    <>
      {(initialData.rows ?? []).map((row, i) => {
        return (
          <AitRow
            key={i}
            type={type}
            location={{ ...location, row: i }}
            showCellBorders={showCellBorders}
            initialData={row}
            returnData={(ret) => updateRows(ret, i)}
            rowGroupOptions={(i === 0 ? options : null)}
            setRowGroupOptions={(i === 0 ? setOptions : null)}
          />
        )
      })
      }
    </>
  );
};