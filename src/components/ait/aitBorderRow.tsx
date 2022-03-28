import React from "react";

interface AitBorderRowProps {
  rowLength: number,
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
  rowHeaderColumns?: number
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
          {cis.map((ci: number): JSX.Element =>
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
          )}
        </tr>
      }
      {
        props.spaceBefore &&
        <tr>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-space-cell" key={ci} />
          )}
        </tr>
      }
      {
        !props.noBorder &&
        <tr>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-border-cell" key={ci} />
          )}
        </tr>
      }
      {
        props.spaceAfter &&
        <tr>
          {cis.map((ci: number): JSX.Element =>
            <td className="ait-space-cell" key={ci} />
          )}
        </tr>
      }
    </>
  );
}