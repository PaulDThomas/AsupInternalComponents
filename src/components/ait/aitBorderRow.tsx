import React from "react";
import { AitCellData } from "./aitInterface";
import { AitCellOptionNames } from "../aio/aioInterface";

interface AitBorderRowProps {
  rowCells: Array<AitCellData>
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  return (
    <>
      <tr>
        {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
          <td className="ait-border-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
        )}
      </tr>
    </>
  );
}