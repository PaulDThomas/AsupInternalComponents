import { createRef, useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { AitCell } from "./aitCell";

export const AitRow = ({
  initialData,
  returnData,
  type="body"
}) => {

  // Set up data holders
  const [cells, setCells] = useState(initialData.cells ?? []);
  const [options, setOptions] = useState(initialData.options ?? {});

  // Updates to initial data
  useEffect(() => {
    setCells(initialData.cells ?? []);
    setOptions(initialData.options ?? {});
  }, [initialData])

  // Send data up the tree
  useEffect(() => {
    // All these parameters should be in the initial data
    const r = {
      cells: cells,
      options: options ?? [],
    }
    if (typeof(returnData) === "function") returnData(r);
  }, [cells, options, returnData]);

  // Update data from components
  const updateCell = (ret, i) => {
    console.log(`Updating cell ${i} to... ${Object.keys(ret).map((k) => `${k}:${ret[k]}`).join(", ")}`);
    const newCells = cells;
    newCells[i] = ret;
    setCells(newCells);
  };

  // Update returnData
  useEffect(() => {
    const r = {
      cells: cells,
      // options: options,
    }
    if (typeof(returnData)==="function") returnData(r);
  }, [cells, returnData])

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof(initialData) !== "object") return (
    <tr>
      <td>
        Bad initialData in AitRow
      </td>
    </tr>
  );
  if (initialData.cells === undefined) return (
    <tr>
      <td>
        No cells property in initialData for AitRow
      </td>
    </tr>
  );

  // Render the component
  return (
    <tr>
      {initialData.cells.map((c, i) => {
        return (
          <AitCell 
            key={i}
            type={type}
            initialData={c}
            returnData={(ret) => updateCell(ret, i)}
            />
        );
      })}
    </tr>
  );
}