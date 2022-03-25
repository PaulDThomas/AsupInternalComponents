import React from "react";
import { AitCellData } from "./aitInterface";

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
              <div className="ait-tip ait-tip-rhs">
                <div
                  className={`ait-options-button ait-options-button-add-column ${props.changeColumns!.showButtons ? "" : "hidden"}`}
                  onClick={(e) => { props.changeColumns!.addColumn!(ci) }}
                >
                  <span className="ait-tiptext ait-tip-top">Add&nbsp;column</span>
                </div>
              </div>

              {ci > 0 &&
              <div className="ait-tip ait-tip-lhs">
                <div
                  className={`ait-options-button ait-options-button-remove-column ${props.changeColumns!.showButtons ? "" : "hidden"}`}
                  onClick={(e) => { props.changeColumns!.removeColumn!(ci) }}
                >
                  <span className="ait-tiptext ait-tip-top">Remove&nbsp;column</span>
                </div>
                </div>
              }
            </td>
          )}
        </tr>
      }
      {
        props.spaceBefore &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.colSpan ?? 1} key={ci} />
          )}
        </tr>
      }
      {
        !props.noBorder &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-border-cell" colSpan={cell.colSpan ?? 1} key={ci} />
          )}
        </tr>
      }
      {
        props.spaceAfter &&
        <tr>
          {props.rowCells.map((cell: AitCellData, ci: number): JSX.Element =>
            <td className="ait-space-cell" colSpan={cell.colSpan ?? 1} key={ci} />
          )}
        </tr>
      }
    </>
  );
}