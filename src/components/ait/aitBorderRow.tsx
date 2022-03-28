import React from "react";
import { AitColumnRepeat } from "./aitInterface";

interface AitBorderRowProps {
  rowLength: number,
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
  rowHeaderColumns?: number
  columnRepeats?: AitColumnRepeat[];
  changeColumns?: {
    addColumn: (col: number) => void,
    removeColumn: (col: number) => void,
    showButtons: boolean,
  }
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  let cis = Array.from(Array(props.rowLength).keys());
  return (
    <>
      {props.changeColumns &&
        <tr>
          <td></td>
          {cis.map((ci: number): JSX.Element => {
            let isColumnRepeat = props.columnRepeats
              && props.columnRepeats.length > ci
              && props.columnRepeats[ci]!.repeatNumbers !== undefined
              && props.columnRepeats[ci]!.repeatNumbers!.length > 0
              && props.columnRepeats[ci]!.repeatNumbers!.reduce((r, a) => r + a, 0) > 0;
            if (isColumnRepeat) return (<td key={ci}></td>);

            return (
              <td className="ait-cell" key={ci}>
                <div className="ait-tip ait-tip-rhs">
                  <div
                    className={`ait-options-button ait-options-button-add-column ${props.changeColumns!.showButtons ? "" : "hidden"}`}
                    onClick={(e) => { props.changeColumns!.addColumn!(ci) }}
                  >
                    <span className="ait-tiptext ait-tip-top">Add&nbsp;column</span>
                  </div>
                </div>

                {ci > 0 && ci !== props.rowHeaderColumns &&
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
            );
          }
          )}
          <td></td>
        </tr>
      }
      {
        props.spaceBefore &&
        <tr>
          <td></td>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-space-cell" key={ci} />
          )}
          <td></td>
        </tr>
      }
      {
        !props.noBorder &&
        <tr>
          <td></td>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-border-cell" key={ci} />
          )}
          <td></td>
        </tr>
      }
      {
        props.spaceAfter &&
        <tr>
          <td></td>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-space-cell" key={ci} />
          )}
          <td></td>
        </tr>
      }
    </>
  );
}