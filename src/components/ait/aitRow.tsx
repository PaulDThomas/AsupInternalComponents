import * as React from 'react';
import { AitCellOptionNames, OptionGroup } from "components/aio/aioInterface";
import { useState, useEffect } from "react";
import { AitCell } from "./aitCell";
import { AitLocation, AitRowType, AitRowData, AitCellData, AitCellType } from "./aitInterface";

interface AitRowProps {
  location: AitLocation,
  initialData: AitRowData,
  returnData: (ret: AitRowData) => void,
  showCellBorders?: boolean,
  type: AitRowType,
  rowGroupOptions?: OptionGroup,
  setRowGroupOptions?: (ret: OptionGroup) => void,
}

export const AitRow = (props: AitRowProps): JSX.Element => {

  // Set up data holders
  const [cells, setCells] = useState(props.initialData.cells ?? []);
  const [options, setOptions] = useState(props.initialData.options ?? []);

  // Updates to initial data
  useEffect(() => { setCells(props.initialData.cells ?? []); }, [props.initialData.cells]);
  useEffect(() => { setOptions(props.initialData.options ?? {}); }, [props.initialData.options]);

  // Send data up the tree
  useEffect(() => {
    //console.log("returnData in aitRow");
    // All these parameters should be in the initial data
    const r = {
      cells: cells,
      options: options ?? [],
    }
    if (typeof (props.returnData) === "function") props.returnData(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, options, props.initialData, props.returnData]);

  // Update data from components
  const updateCell = (ret: AitCellData, i: number) => {
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
    if (typeof (props.returnData) === "function") props.returnData(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, options, props.returnData])

  // Check initial data, this can render every time, does not need to be inside a function call
  if (typeof (props.initialData) !== "object") return (
    <tr>
      <td>
        Bad initialData in AitRow
      </td>
    </tr>
  );
  if (props.initialData.cells === undefined) return (
    <tr>
      <td>
        No cells property in initialData for AitRow
      </td>
    </tr>
  );



  // Render the component
  return (
    <tr>
      {props.initialData.cells.map((c, i) => {

        if (!c.options) c.options = [];

        return (
          <AitCell
            key={i}
            location={{ ...props.location, cell: i }}
            type={
              c.options.find(o => o.optionName === AitCellOptionNames.cellWidth) !== undefined
                ? c.options.find(o => o.optionName === AitCellOptionNames.cellWidth)!.value
                : props.type === AitRowType.body
                  ? AitCellType.body
                  : AitCellType.header
            }
            editable={true}
            initialData={c}
            returnData={(ret) => updateCell(ret, i)}
            rowGroupOptions={(i === 0 ? props.rowGroupOptions : undefined)}
            setRowGroupOptions={(i === 0 ? props.setRowGroupOptions : undefined)}
            rowOptions={(i === props.initialData.cells.length - 1 ? options : undefined)}
            setRowOptions={(i === props.initialData.cells.length - 1 ? setOptions : undefined)}
            showCellBorders={props.showCellBorders}
          />
        );
      })}
    </tr>
  );
}