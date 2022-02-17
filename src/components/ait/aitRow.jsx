import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { AitCell } from "./aitCell";

export const AitRow = ({
  location,
  initialData,
  returnData,
  showCellBorders,
  type = "body",
  rowGroupOptions,
  setRowGroupOptions,
}) => {

  // Set up data holders
  const [cells, setCells] = useState(initialData.cells ?? []);
  const [options, setOptions] = useState(initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setCells(initialData.cells ?? []); }, [initialData.cells]);
  useEffect(() => { setOptions(initialData.options ?? {}); }, [initialData.options]);

  // Send data up the tree
  useEffect(() => {
    //console.log("returnData in aitRow");
    // All these parameters should be in the initial data
    const r = {
      cells: cells,
      options: options ?? [],
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [cells, options, returnData]);

  // Update data from components
  const updateCell = (ret, i) => {
    //console.log(`Updating cell ${i} to... ${JSON.stringify(ret)}`);
    const newCells = cells;
    newCells[i] = ret;
    setCells(newCells);
  };

  // Update returnData
  useEffect(() => {
    const r = {
      cells: cells,
      options: options,
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [cells, options, returnData])

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof (initialData) !== "object") return (
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

        if (!c.options) c.options = [];

        return (
          <AitCell
            key={i}
            location={{ ...location, cell: i }}
            type={c.options.reduce((cellType, o) => cellType ?? o.optionName === "cellType" ? o.value : null, null) ?? type}
            initialData={c}
            returnData={(ret) => updateCell(ret, i)}
            rowGroupOptions={(i === 0 ? rowGroupOptions : null)}
            setRowGroupOptions={(i === 0 ? setRowGroupOptions : null)}
            rowOptions={(i === initialData.cells.length - 1 ? options : null)}
            setRowOptions={(i === initialData.cells.length - 1 ? options : null)}
            showCellBorders={showCellBorders}
          />
        );
      })}
    </tr>
  );
}