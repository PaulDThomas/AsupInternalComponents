import { DraftComponent } from "draft-js";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AsupInternalEditor } from "../aie";
import { AioIconButton } from "../aio";
import { AitCellWindow } from "./AitCellWindow";
import { TableSettingsContext } from "./TableSettingsContext";
import { AitCellData, AitCellType, AitHeaderCellData, AitLocation } from "./interface";

interface AitHeaderCellProps<T extends string | object> {
  id: string;
  aitid: string;
  text: T;
  justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | "default";
  comments: T;
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
      comments?: T;
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
          <AitCellWindow
            id={id}
            text={text}
            justifyText={justifyText}
            comments={comments}
            displayColWidth={displayColWidth}
            textIndents={textIndents}
            setCellData={setCellData}
            setColWidth={setColWidth}
            readOnly={readOnly}
            location={location}
            showCellOptions={showCellOptions}
            setShowCellOptions={setShowCellOptions}
            returnData={returnData}
            cellType={AitCellType.header}
            rowSpan={rowSpan}
            repeatRowSpan={repeatRowSpan}
            addRowSpan={addRowSpan}
            removeRowSpan={removeRowSpan}
            colSpan={colSpan}
            repeatColSpan={repeatColSpan}
            addColSpan={addColSpan}
            removeColSpan={removeColSpan}
          />
        )}
      </div>
    </td>
  );
};

AitHeaderCell.displayName = "AitHeaderCell";
