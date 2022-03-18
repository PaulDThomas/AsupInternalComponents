import React from "react";
import { AitCellData, AitCellOptionNames } from "./aitInterface";

interface AitBorderRowProps {
  rowCells: Array<AitCellData>
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  return (
    <>
      {props.spaceBefore &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
      {!props.noBorder &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-border-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
      {props.spaceAfter &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
    </>
  );
}