import React from "react";
import { AitCellData, AitCellOptionNames } from "./aitInterface";

interface AitBorderRowProps {
  rowCells: Array<AitCellData>
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
  changeColumns?: {
    addColumn: (col: number) => void,
    removeColumn: (col: number) => void,
    showButtons: boolean,
  }
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  return (
    <>
      {props.changeColumns &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-cell" key={ci}>
              <div style={{ position: "absolute", width: "100%", height: "100%" }}>
                <div
                  className={`ait-options-button ait-options-button-add-column ${props.changeColumns!.showButtons ? "" : "hidden"}`}
                  onClick={(e) => { props.changeColumns!.addColumn!(ci) }}
                />
                {ci > 0 &&
                  <div
                    className={`ait-options-button ait-options-button-remove-column ${props.changeColumns!.showButtons ? "" : "hidden"}`}
                    onClick={(e) => { props.changeColumns!.removeColumn!(ci) }}
                  />
                }
              </div>
            </td>
          )}
        </tr>
      }
      {
        props.spaceBefore &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
      {
        !props.noBorder &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-border-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
      {
        props.spaceAfter &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.options?.find(o => o.optionName === AitCellOptionNames.colSpan)?.value} key={ci} />
          )}
        </tr>
      }
    </>
  );
}