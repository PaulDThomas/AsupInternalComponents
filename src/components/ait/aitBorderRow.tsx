import React, { useContext } from "react";
import { AioIconButton } from "../aio";
import { TableSettingsContext } from "./context";

interface AitBorderRowProps {
  spaceBefore?: boolean,
  spaceAfter?: boolean,
  noBorder?: boolean,
  rowHeaderColumns?: number
  changeColumns?: {
    addColumn: (col: number) => void,
    removeColumn: (col: number) => void,
    showButtons: boolean,
  },
  minWidth?: number,
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);
  let cis = Array.from(Array(tableSettings.columnRepeats?.length ?? 1).keys());
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
              tableSettings.columnRepeats
              && tableSettings.columnRepeats.length > ci
              && tableSettings.columnRepeats[ci]!.colRepeat !== undefined
              && tableSettings.columnRepeats[ci]!.colRepeat!.length > 0
              && tableSettings.columnRepeats[ci]!.colRepeat!.match(/^[[\]0,]+$/) !== null;
            if (isColumnRepeat) return (<td key={ci}></td>);
            let maxColumnIndex = tableSettings.columnRepeats
              ? Math.max(...tableSettings.columnRepeats.map(crep => crep.columnIndex))
              : 1
              ;

            return (
              <td className="ait-cell" key={ci}>
                <div className="ait-aie-holder" style={{ display: "flex" }}>
                  {!(props.rowHeaderColumns === 1 && ci === 0) &&
                    !((props.rowHeaderColumns === maxColumnIndex) && ci === props.rowHeaderColumns) &&
                    <AioIconButton
                      tipText="Remove column"
                      iconName="aiox-minus"
                      onClick={() => props.changeColumns!.removeColumn!(tableSettings.columnRepeats![ci].columnIndex)}
                      style={{ justifySelf: "start" }}
                    />
                  }
                  <div style={{ flexGrow: 1 }} />
                  <AioIconButton
                    tipText="Add column"
                    iconName="aiox-plus"
                    onClick={() => props.changeColumns!.addColumn!(tableSettings.columnRepeats![ci].columnIndex)}
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