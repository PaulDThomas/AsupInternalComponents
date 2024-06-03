import { DraftComponent } from "draft-js";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AsupInternalEditor } from "../aie";
import { AioIconButton } from "../aio";
import { AitCellWindow } from "./AitCellWindow";
import { TableSettingsContext } from "./TableSettingsContext";
import { AitCellData, AitCellType, AitLocation, AitRowType } from "./interface";

interface AitCellProps<T extends string | object> {
  id: string;
  aitid: string;
  text: T;
  justifyText?: DraftComponent.Base.DraftTextAlignment | "decimal" | "default";
  comments: T;
  colWidth?: number;
  displayColWidth?: number;
  textIndents?: number;
  replacedText?: T;
  setCellData?: (ret: AitCellData<T>) => void;
  setColWidth?: (ret: number) => void;
  readOnly: boolean;
  location: AitLocation;
  spaceAfterRepeat?: boolean;
}

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = <T extends string | object>({
  id,
  aitid,
  text,
  justifyText,
  comments,
  colWidth,
  displayColWidth,
  textIndents,
  replacedText,
  setCellData,
  setColWidth,
  readOnly,
  location,
  spaceAfterRepeat,
}: AitCellProps<T>) => {
  // Context
  const tableSettings = useContext(TableSettingsContext);
  const Editor = tableSettings.Editor ?? AsupInternalEditor;
  // Data holder
  const [displayText, setDisplayText] = useState<T>(replacedText ?? text);
  /* Need to update if these change */
  useEffect(() => setDisplayText(replacedText ?? text), [replacedText, text]);

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

  const cellType = useMemo<AitCellType>(() => {
    const cellType =
      location.tableSection === AitRowType.body &&
      location.column < (tableSettings.rowHeaderColumns ?? 0)
        ? AitCellType.rowHeader
        : AitCellType.body;
    return cellType;
  }, [location.column, location.tableSection, tableSettings.rowHeaderColumns]);

  // Update cell style when options change
  const cellStyle = useMemo<React.CSSProperties>(() => {
    return {
      overflow: "visible",
      width: `${tableSettings.colWidthMod * (colWidth ?? tableSettings.defaultCellWidth)}px`,
      paddingLeft:
        cellType === AitCellType.rowHeader && textIndents !== undefined
          ? `${textIndents}rem`
          : undefined,
      borderLeft: tableSettings.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: tableSettings.showCellBorders ? "1px dashed burlywood" : "",
      borderRight:
        tableSettings.showCellBorders &&
        location.column === (tableSettings.rowHeaderColumns ?? 0) - 1
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
    cellType,
    textIndents,
    location.column,
    location.row,
    location.rowGroup,
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
      if (setCellData) {
        const r: AitCellData<T> = {
          aitid: aitid,
          text: cellUpdate.text ?? text,
          justifyText:
            cellUpdate.justifyText === null ? undefined : cellUpdate.justifyText ?? justifyText,
          comments: cellUpdate.comments ?? comments,
          colWidth: cellUpdate.colWidth ?? colWidth,
          textIndents: cellUpdate.textIndents ?? textIndents ?? 0,
          replacedText: replacedText,
          spaceAfterRepeat: spaceAfterRepeat,
        };
        setCellData(r);
      }
    },
    [
      aitid,
      colWidth,
      comments,
      justifyText,
      replacedText,
      setCellData,
      spaceAfterRepeat,
      text,
      textIndents,
    ],
  );

  // Render element
  return (
    <td
      id={id}
      className={[
        "ait-cell",
        cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell",
        currentReadOnly ? "ait-readonly-cell" : "",
      ].join(" ")}
      style={cellStyle}
      data-location-table-section={location.tableSection}
      data-location-row-group={location.rowGroup}
      data-location-row={location.row}
      data-location-cell={location.column}
    >
      <div className="ait-aie-holder">
        <div
          className="ait-aie-holder-button"
          style={{
            position: "absolute",
            right: "-8px",
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
            cellType={cellType}
          />
        )}
      </div>
    </td>
  );
};

AitCell.displayName = "AitCell";
