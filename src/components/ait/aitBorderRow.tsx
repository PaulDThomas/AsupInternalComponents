import React, { useContext } from "react";
import { AioIconButton } from "../aio";
import { TableSettingsContext } from "./aitContext";

interface AitBorderRowProps {
  id: string;
  spaceBefore?: boolean;
  spaceAfter?: boolean;
  noBorder?: boolean;
  rowHeaderColumns?: number;
  changeColumns?: {
    addColumn: (col: number) => void;
    removeColumn: (col: number) => void;
    showButtons: boolean;
  };
  minWidth?: number;
}

export const AitBorderRow = (props: AitBorderRowProps): JSX.Element => {
  const tableSettings = useContext(TableSettingsContext);
  const cis = Array.from(Array(tableSettings.columnRepeats?.length ?? 1).keys());
  return (
    <>
      {props.changeColumns && (
        <tr id={`${props.id}`}>
          <td className="ait-cell">
            <div
              className="ait-aie-holder"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <AioIconButton
                id={`${props.id}-addcol-m1`}
                tipText="Add column"
                iconName="aiox-plus"
                onClick={() => {
                  if (props.changeColumns) props.changeColumns.addColumn(-1);
                }}
              />
            </div>
          </td>
          {cis.map((ci: number): JSX.Element => {
            const isColumnRepeat =
              tableSettings.columnRepeats &&
              tableSettings.columnRepeats.length > ci &&
              tableSettings.columnRepeats[ci].colRepeat !== undefined &&
              tableSettings.columnRepeats[ci].colRepeat?.match(/^[[\]0,]+$/) === null;
            if (isColumnRepeat) return <td key={ci}></td>;
            const maxColumnIndex = tableSettings.columnRepeats
              ? Math.max(...tableSettings.columnRepeats.map((crep) => crep.columnIndex))
              : 1;
            return (
              <td
                className="ait-cell"
                key={ci}
              >
                <div
                  className="ait-aie-holder"
                  style={{ display: "flex" }}
                >
                  {!(props.rowHeaderColumns === 1 && ci === 0) &&
                    !(
                      props.rowHeaderColumns === maxColumnIndex && ci === props.rowHeaderColumns
                    ) && (
                      <AioIconButton
                        id={`${props.id}-remcol-${ci}`}
                        tipText="Remove column"
                        iconName="aiox-minus"
                        onClick={() => {
                          if (!props.changeColumns || !tableSettings.columnRepeats) return;
                          props.changeColumns.removeColumn(
                            tableSettings.columnRepeats[ci].columnIndex,
                          );
                        }}
                        style={{ justifySelf: "start" }}
                      />
                    )}
                  <div style={{ flexGrow: 1 }} />
                  <AioIconButton
                    id={`${props.id}-addcol-${ci}`}
                    tipText="Add column"
                    iconName="aiox-plus"
                    onClick={() => {
                      if (!props.changeColumns || !tableSettings.columnRepeats) return;
                      props.changeColumns.addColumn(tableSettings.columnRepeats[ci].columnIndex);
                    }}
                  />
                </div>
              </td>
            );
          })}
          <td />
        </tr>
      )}
      {props.spaceBefore && (
        <tr id={`${props.id}-spacebeforerow`}>
          <td></td>
          {cis.map(
            (ci: number): JSX.Element => (
              <td
                className="ait-space-cell"
                key={ci}
              />
            ),
          )}
          <td></td>
        </tr>
      )}
      {!props.noBorder && (
        <tr id={`${props.id}-borderrow`}>
          <td></td>
          {cis.map(
            (ci: number): JSX.Element => (
              <td
                className="ait-border-cell"
                key={ci}
                style={{ minWidth: `${props.minWidth}px` }}
              />
            ),
          )}
          <td></td>
        </tr>
      )}
      {props.spaceAfter && (
        <tr id={`${props.id}-spaceafterrow`}>
          <td></td>
          {cis.map(
            (ci: number): JSX.Element => (
              <td
                className="ait-space-cell"
                key={ci}
              />
            ),
          )}
          <td></td>
        </tr>
      )}
    </>
  );
};
