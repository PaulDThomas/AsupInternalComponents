import { ContextWindow } from "@asup/context-menu";
import { DraftComponent } from "draft-js";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AsupInternalEditor } from "../aie";
import { AioComment, AioExpander, AioIconButton, AioNumber, AioSelect } from "../aio";
import { AitCellData, AitHeaderCellData, AitLocation } from "./interface";
import { TableSettingsContext } from "./TableSettingsContext";

interface AitHeaderCellProps<T extends string | object> {
  id: string;
  aitid: string;
  text: T;
  justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | "default";
  comments: string;
  rowSpan: number;
  colSpan: number;
  colWidth?: number;
  displayColWidth?: number;
  textIndents?: number;
  replacedText?: T;
  repeatColSpan?: number;
  repeatRowSpan?: number;
  setCellData?: (ret: AitCellData<T>) => void;
  setColWidth?: (ret: number) => void;
  readOnly: boolean;
  location: AitLocation;
  addColSpan?: (loc: AitLocation) => void;
  removeColSpan?: (loc: AitLocation) => void;
  addRowSpan?: (loc: AitLocation) => void;
  removeRowSpan?: (loc: AitLocation) => void;
  spaceAfterRepeat?: boolean;
  spaceAfterSpan?: number;
}

/*
 * Table cell in AsupInternalTable
 */
export const AitHeaderCell = <T extends string | object>({
  id,
  aitid,
  text,
  justifyText,
  comments,
  colSpan,
  rowSpan,
  colWidth,
  displayColWidth,
  textIndents,
  replacedText,
  repeatColSpan,
  repeatRowSpan,
  setCellData,
  setColWidth,
  readOnly,
  location,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
  spaceAfterRepeat,
  spaceAfterSpan,
}: AitHeaderCellProps<T>) => {
  // Context
  const tableSettings = useContext(TableSettingsContext);
  const Editor = tableSettings.Editor ?? AsupInternalEditor;
  // Data holder
  const [displayText, setDisplayText] = useState(replacedText !== undefined ? replacedText : text);
  /* Need to update if these change */
  useEffect(
    () => setDisplayText(replacedText !== undefined ? replacedText : text),
    [replacedText, text],
  );

  const [buttonState, setButtonState] = useState("hidden");
  const [showCellOptions, setShowCellOptions] = useState(false);

  // Static options/variables
  const currentReadOnly = useMemo<boolean>(() => {
    return (
      !tableSettings.editable ||
      readOnly ||
      typeof setCellData !== "function" ||
      replacedText !== undefined
    );
  }, [readOnly, replacedText, setCellData, tableSettings.editable]);
  const isNotRepeat = useMemo<boolean>(
    () =>
      (location.colRepeat === undefined || location.colRepeat.match(/^[[\]0,]+$/) !== null) &&
      (location.rowRepeat === undefined || location.rowRepeat.match(/^[[\]0,]+$/) !== null),
    [location],
  );

  // Update cell style when options change
  const cellStyle = useMemo<React.CSSProperties>(() => {
    return {
      overflow: "visible",
      width: `${tableSettings.colWidthMod * (colWidth ?? tableSettings.defaultCellWidth)}px`,
      borderLeft: tableSettings.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: tableSettings.showCellBorders ? "1px dashed burlywood" : "",
      borderRight:
        tableSettings.showCellBorders &&
        location.column === (tableSettings.rowHeaderColumns ?? 0) - colSpan
          ? "1px solid burlywood"
          : tableSettings.showCellBorders
            ? "1px dashed burlywood"
            : "",
      borderTop:
        tableSettings.showCellBorders && location.row === 0 && location.rowGroup > 0
          ? "1px solid burlywood"
          : tableSettings.showCellBorders
            ? "1px dashed burlywood"
            : "",
    };
  }, [
    tableSettings.colWidthMod,
    tableSettings.defaultCellWidth,
    tableSettings.showCellBorders,
    tableSettings.rowHeaderColumns,
    colWidth,
    location.column,
    location.row,
    location.rowGroup,
    colSpan,
  ]);

  /** Callback for update to any cell data */
  const returnData = useCallback(
    (cellUpdate: {
      text?: T;
      justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | null;
      comments?: string;
      colWidth?: number;
      textIndents?: number;
    }) => {
      if (typeof setCellData !== "function") return;
      const r: AitHeaderCellData<T> = {
        aitid: aitid,
        text: cellUpdate.text ?? text,
        justifyText:
          cellUpdate.justifyText === null ? undefined : cellUpdate.justifyText ?? justifyText,
        comments: cellUpdate.comments ?? comments,
        colSpan: colSpan,
        rowSpan: rowSpan,
        colWidth: cellUpdate.colWidth ?? colWidth,
        textIndents: cellUpdate.textIndents ?? textIndents ?? 0,
        replacedText: replacedText,
        repeatColSpan: repeatColSpan,
        spaceAfterRepeat: spaceAfterRepeat,
        spaceAfterSpan: spaceAfterSpan,
      };
      setCellData(r);
    },
    [
      aitid,
      colSpan,
      colWidth,
      comments,
      justifyText,
      repeatColSpan,
      replacedText,
      rowSpan,
      setCellData,
      spaceAfterRepeat,
      spaceAfterSpan,
      text,
      textIndents,
    ],
  );

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => {
    setButtonState("");
  };
  const aitHideButtons = () => {
    setButtonState("hidden");
  };

  // Do not render if there is no rowSpan or colSpan
  if (colSpan === 0 || rowSpan === 0 || repeatColSpan === 0 || repeatRowSpan === 0) return <></>;

  // Render element
  return (
    <td
      id={id}
      className={["ait-cell", "ait-header-cell", currentReadOnly ? "ait-readonly-cell" : ""]
        .filter((c) => c !== "")
        .join(" ")}
      colSpan={repeatColSpan ?? colSpan ?? 1}
      rowSpan={(repeatRowSpan ?? rowSpan ?? 1) + (spaceAfterSpan ?? 0)}
      style={cellStyle}
      data-location-table-section={location.tableSection}
      data-location-row-group={location.rowGroup}
      data-location-row={location.row}
      data-location-cell={location.column}
    >
      <div
        className="ait-aie-holder"
        onMouseOver={aitShowButtons}
        onMouseLeave={aitHideButtons}
      >
        <>
          <div
            style={{
              position: "absolute",
              right: "-8px",
              visibility: buttonState === "hidden" ? "hidden" : "visible",
            }}
          >
            {/* Option buttons  */}
            <AioIconButton
              id={`${id}-options`}
              tipText="Cell Options"
              onClick={() => setShowCellOptions(!showCellOptions)}
              iconName="aio-button-cell"
            />
          </div>
        </>

        {/* Cell text editor */}
        <Editor
          id={`${id}-editor`}
          style={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={
            !justifyText || justifyText === "default"
              ? location.column < (tableSettings.rowHeaderColumns ?? 0)
                ? "left"
                : "center"
              : justifyText
          }
          value={displayText}
          setValue={(ret) => {
            setDisplayText(ret as T);
            returnData({ text: ret as T });
          }}
          editable={!currentReadOnly}
          showStyleButtons={tableSettings.cellStyles !== undefined}
          styleMap={tableSettings.cellStyles}
          decimalAlignPercent={tableSettings.decimalAlignPercent}
        />
      </div>

      <div>
        {/* Cell options window */}
        {showCellOptions && (
          <ContextWindow
            id={`${id}-window`}
            key="Cell"
            title={"Cell options"}
            visible={showCellOptions}
            onClose={() => {
              setShowCellOptions(false);
            }}
          >
            <div className="aiw-body-row">
              <AioComment
                id={`${id}-notes`}
                label={"Notes"}
                value={comments}
                setValue={
                  !currentReadOnly && isNotRepeat
                    ? (ret) => returnData({ comments: ret })
                    : undefined
                }
                commentStyles={tableSettings.commentStyles}
              />
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Cell location: </div>
              <div className={"aio-value"}>
                <AioExpander
                  id={`${id}-location`}
                  inputObject={location}
                />
              </div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Unprocessed text: </div>
              <AsupInternalEditor
                id={`${id}-unprocessed`}
                value={text}
                setValue={
                  !readOnly && setCellData && isNotRepeat && tableSettings.editable
                    ? (ret) => returnData({ text: ret })
                    : undefined
                }
                style={
                  !readOnly && setCellData && isNotRepeat && tableSettings.editable
                    ? {
                        border: "1px solid black",
                        backgroundColor: "white",
                        borderRadius: "2px",
                        marginRight: "0.5rem",
                        paddingBottom: "4px",
                      }
                    : { border: 0 }
                }
                showStyleButtons={tableSettings.cellStyles !== undefined}
                styleMap={tableSettings.cellStyles}
                textAlignment={justifyText}
                decimalAlignPercent={tableSettings.decimalAlignPercent}
              />
            </div>
            <div className="aiw-body-row">
              <AioSelect
                id={`${id}-justify`}
                label="Justify text"
                value={
                  justifyText === undefined
                    ? "Default"
                    : justifyText.charAt(0).toUpperCase() + justifyText.substring(1)
                }
                availableValues={["Default", "Left", "Center", "Right", "Decimal"]}
                setValue={
                  !currentReadOnly && isNotRepeat
                    ? (ret) => {
                        let newJ:
                          | DraftComponent.Base.DraftTextAlignment
                          | "decimal"
                          | null
                          | undefined = undefined;
                        switch (ret) {
                          case "Left":
                            newJ = "left";
                            break;
                          case "Right":
                            newJ = "right";
                            break;
                          case "Center":
                            newJ = "center";
                            break;
                          case "Decimal":
                            newJ = "decimal";
                            break;
                          case "Default":
                            newJ = null;
                            break;
                          default:
                            break;
                        }
                        returnData({ justifyText: newJ });
                      }
                    : undefined
                }
              />
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Row span: </div>
              <div className={"aio-ro-value"}>{repeatRowSpan ?? rowSpan ?? 1}</div>
              <div
                className={"aiox-button-holder"}
                style={{ padding: "2px" }}
              >
                {repeatRowSpan === undefined &&
                !currentReadOnly &&
                isNotRepeat &&
                typeof addRowSpan === "function" &&
                colSpan === 1 ? (
                  <div
                    id={`${id}-add-rowspan`}
                    className="aiox-button aiox-plus"
                    onClick={() => addRowSpan(location)}
                  />
                ) : (
                  <div className="aiox-button" />
                )}
                {repeatRowSpan === undefined &&
                  !currentReadOnly &&
                  isNotRepeat &&
                  typeof removeRowSpan === "function" && (
                    <div
                      id={`${id}-remove-rowspan`}
                      className="aiox-button aiox-minus"
                      onClick={() => removeRowSpan(location)}
                    />
                  )}
              </div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Column span: </div>
              <div className={"aio-ro-value"}>{repeatColSpan ?? colSpan ?? 1}</div>
              <div
                className={"aiox-button-holder"}
                style={{ padding: "2px" }}
              >
                {repeatColSpan === undefined &&
                !currentReadOnly &&
                isNotRepeat &&
                typeof addColSpan === "function" &&
                rowSpan === 1 ? (
                  <div
                    id={`${id}-add-colspan`}
                    className="aiox-button aiox-plus"
                    onClick={() => addColSpan(location)}
                  />
                ) : (
                  <div className="aiox-button" />
                )}
                {repeatColSpan === undefined &&
                  !currentReadOnly &&
                  isNotRepeat &&
                  typeof removeColSpan === "function" && (
                    <div
                      id={`${id}-remove-colspan`}
                      className="aiox-button aiox-minus"
                      onClick={() => removeColSpan(location)}
                    />
                  )}
              </div>
            </div>
            <div className="aiw-body-row">
              <AioNumber
                id={`${id}-width`}
                label="Width (mm)"
                value={displayColWidth ?? tableSettings.defaultCellWidth}
                setValue={!currentReadOnly && setColWidth ? (ret) => setColWidth(ret) : undefined}
              />
            </div>
          </ContextWindow>
        )}
      </div>
    </td>
  );
};
