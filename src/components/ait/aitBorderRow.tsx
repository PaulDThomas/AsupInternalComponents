import { AioIconButton } from "../aio";
import React from "react";
import { AitColumnRepeat } from "./aitInterface";

interface AitBorderRowProps {
  rowLength: number,
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
  rowHeaderColumns?: number
  columnRepeats?: AitColumnRepeat[] | null;
  changeColumns?: {
    addColumn: (col: number) => void,
    removeColumn: (col: number) => void,
    showButtons: boolean,
  },
  minWidth?: number,
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  let cis = Array.from(Array(props.rowLength).keys());
  return (
    <>
      {props.changeColumns &&
        <tr>
          <td className="ait-cell" >
            <div className="ait-aie-holder" style={{ display: "flex", justifyContent: "flex-end" }}>
              <AioIconButton
                tipText="Add column"
                iconName="aiox-plus"
                onClick={() => props.changeColumns!.addColumn!(-1)}
              />
            </div>
          </td>
          {cis.map((ci: number): JSX.Element => {
            let isColumnRepeat =
              props.columnRepeats
              && props.columnRepeats.length > ci
              && props.columnRepeats[ci]!.repeatNumbers !== undefined
              && props.columnRepeats[ci]!.repeatNumbers!.length > 0
              && props.columnRepeats[ci]!.repeatNumbers!.reduce((r, a) => r + a, 0) > 0;
            if (isColumnRepeat) return (<td key={ci}></td>);
            let maxColumnIndex = props.columnRepeats
              ? Math.max(...props.columnRepeats.map(crep => crep.columnIndex))
              : props.rowLength
              ;

            return (
              <td className="ait-cell" key={ci}>
                <div className="ait-aie-holder" style={{ display: "flex" }}>
                  {!(props.rowHeaderColumns === 1 && ci === 0) &&
                    !((props.rowHeaderColumns === maxColumnIndex) && ci === props.rowHeaderColumns) &&
                    <AioIconButton
                      tipText="Remove column"
                      iconName="aiox-minus"
                      onClick={() => props.changeColumns!.removeColumn!(props.columnRepeats![ci].columnIndex)}
                      style={{ justifySelf: "start" }}
                    />
                  }
                  <div style={{ flexGrow: 1 }} />
                  <AioIconButton
                    tipText="Add column"
                    iconName="aiox-plus"
                    onClick={() => props.changeColumns!.addColumn!(props.columnRepeats![ci].columnIndex)}
                  />

                </div>
              </td>
            );
          }
          )}
          <td />
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
            <td className="ait-border-cell" key={ci} style={{ minWidth: `${props.minWidth}px` }} />
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