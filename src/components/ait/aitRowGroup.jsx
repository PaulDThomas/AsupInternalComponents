import { useState, useEffect } from "react";
import "./ait.css";
import { AitRow } from "./aitRow";

export const AitRowGroup = ({
  initialData,
  returnData,
  type = "body",
  maxRows,
  maxColumns,
}) => {
  // Data holder
  const [rows, setRows] = useState(initialData.rows ?? []);
  const [options, setOptions] = useState(initialData.options ?? []);

  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
    const r = {
      options: options ?? [],
      rows: rows ?? [],
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [initialData.originalText, options, returnData, rows]);

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof (initialData) !== "object") return (
    <tr>
      <td>
        Bad initialData in AitRowGroup
      </td>
    </tr>
  );

  // Send data back
  const updateRows = (i, ret) => {
    console.log(`Updating row group ${i} with return: ${ret}`);
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
            initialData={row}
            returnData={(ret) => updateRows(i, ret)}
          />
        )
      })
      }
    </>
  );
};