import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AsupInternalEditor } from '../aie';
import { AioComment, AioExpander, AioIconButton, AioNumber } from '../aio';
import { AsupInternalWindow } from "../aiw";
import { AitCellData, AitCellType, AitLocation, AitOptionList, AitRowType } from "./aitInterface";


interface AitCellProps {
  aitid: string,
  text: string,
  comments: string,
  rowSpan: number,
  colSpan: number,
  colWidth?: number,
  textIndents?: number,
  replacedText?: string,
  repeatColSpan?: number,
  repeatRowSpan?: number,
  columnIndex: number,
  setCellData?: (ret: AitCellData) => void,
  readOnly: boolean,
  higherOptions: AitOptionList,
  addColSpan?: (loc: AitLocation) => void,
  removeColSpan?: (loc: AitLocation) => void,
  addRowSpan?: (loc: AitLocation) => void,
  removeRowSpan?: (loc: AitLocation) => void,
};

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = ({
  aitid,
  text,
  comments,
  colSpan,
  rowSpan,
  colWidth,
  textIndents,
  replacedText,
  repeatColSpan,
  repeatRowSpan,
  columnIndex,
  setCellData,
  readOnly,
  higherOptions,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
}: AitCellProps) => {

  // Data holder
  const [displayText, setDisplayText] = useState(
    replacedText !== undefined
      ? replacedText
      : text
  );
  /* Need to update if these change */
  useEffect(() => setDisplayText(
    replacedText !== undefined
      ? replacedText
      : text
  ), [replacedText, text]);

  const [buttonState, setButtonState] = useState("hidden");
  const [showCellOptions, setShowCellOptions] = useState(false);

  // Static options/variables
  const currentReadOnly = useMemo(() => {
    return readOnly
      || typeof (setCellData) !== "function"
      || replacedText !== undefined
  }, [readOnly, replacedText, setCellData]);

  const cellType = useMemo(() => {
    let cellType = (higherOptions.tableSection === AitRowType.body) && (columnIndex < (higherOptions.rowHeaderColumns ?? 0))
      ?
      AitCellType.rowHeader
      :
      higherOptions.tableSection === AitRowType.header
        ? AitCellType.header
        : AitCellType.body
      ;
    return cellType;
  }, [columnIndex, higherOptions.rowHeaderColumns, higherOptions.tableSection]);

  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection ?? AitRowType.body,
      rowGroup: higherOptions.rowGroup ?? 0,
      row: higherOptions.row ?? 0,
      column: columnIndex,
      repeat: (higherOptions.repeatNumber ?? []).join(",")
    }
  }, [columnIndex, higherOptions.repeatNumber, higherOptions.row, higherOptions.rowGroup, higherOptions.tableSection]);

  // Update cell style when options change
  const cellStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: cellType === AitCellType.header
        ? (colWidth !== undefined
          ? `${colWidth * 2 + (colSpan - 1) * 4}px`
          : "120px")
        : undefined,
      borderLeft: higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderRight: higherOptions.showCellBorders && (location.column === (higherOptions.rowHeaderColumns ?? 0) - colSpan)
        ? "1px solid burlywood"
        : higherOptions.showCellBorders
          ? "1px dashed burlywood"
          : "",
      borderTop: higherOptions.showCellBorders && location.row === 0 && location.rowGroup > 0
        ? "1px solid burlywood"
        : higherOptions.showCellBorders
          ? "1px dashed burlywood"
          : "",
      paddingLeft: (cellType === AitCellType.rowHeader && textIndents !== undefined) ? `${textIndents}rem` : undefined,
    }
  }, [cellType, colSpan, colWidth, higherOptions.rowHeaderColumns, higherOptions.showCellBorders, location.column, location.row, location.rowGroup, textIndents]);

  /** Callback for update to any cell data */
  const returnData = useCallback((cellUpdate: {
    text?: string,
    comments?: string,
    colWidth?: number
    textIndents?: number
  }) => {
    if (currentReadOnly) return;
    const r: AitCellData = {
      aitid: aitid,
      text: cellUpdate.text ?? text,
      comments: cellUpdate.comments ?? comments,
      colSpan: colSpan,
      rowSpan: rowSpan,
      colWidth: cellUpdate.colWidth ?? colWidth,
      textIndents: cellUpdate.textIndents ?? textIndents ?? 0,
      replacedText: replacedText,
      repeatColSpan: repeatColSpan,
      repeatRowSpan: repeatRowSpan,
    };
    setCellData!(r);
  }, [aitid, colSpan, colWidth, comments, currentReadOnly, repeatColSpan, repeatRowSpan, replacedText, rowSpan, setCellData, text, textIndents]);

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => { setButtonState(""); };
  const aitHideButtons = () => { setButtonState("hidden"); };

  // Do not render if there is no rowSpan or colSpan
  if (colSpan === 0 || rowSpan === 0 || repeatColSpan === 0 || repeatRowSpan === 0) return <></>;

  // Render element
  return (
    <td
      // ref={tdRef}
      className={["ait-cell",
        (cellType === AitCellType.header ? "ait-header-cell" : cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell"),
        (currentReadOnly ? "ait-readonly-cell" : ""),
      ].join(" ")}
      colSpan={repeatColSpan ?? colSpan ?? 1}
      rowSpan={repeatRowSpan ?? rowSpan ?? 1}
      style={cellStyle}
      data-location-table-section={higherOptions.tableSection}
      data-location-row-group={higherOptions.rowGroup}
      data-location-row={higherOptions.row}
      data-location-cell={higherOptions.column}
    >
      <div className="ait-aie-holder"
        onMouseOver={aitShowButtons}
        onMouseLeave={aitHideButtons}
      >

        <>
          <div style={{ position: "absolute", right: "-8px", visibility: (buttonState === "hidden" ? 'hidden' : 'visible') }}>
            {/* Option buttons  */}
            <AioIconButton
              tipText="Cell Options"
              onClick={() => setShowCellOptions(!showCellOptions)}
              iconName="aio-button-cell"
            />
          </div>
        </>

        {/* Cell text editor */}
        <AsupInternalEditor
          style={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={(columnIndex < (higherOptions.rowHeaderColumns ?? 0) ? "left" : "center")}
          value={displayText}
          setValue={(ret) => { setDisplayText(ret); returnData({ text: ret.trimStart() }); }}
          editable={!currentReadOnly}
          showStyleButtons={higherOptions.cellStyles !== undefined}
          styleMap={higherOptions.cellStyles}
        />
      </div>

      <div>
        {/* Cell options window */}
        {showCellOptions &&
          <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { setShowCellOptions(false); }}>
            <div className="aiw-body-row">
              <AioComment
                label={"Notes"}
                value={comments}
                setValue={!currentReadOnly ? (ret) => returnData({ comments: ret }) : undefined}
                commentStyles={higherOptions.commentStyles}
              />
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Cell location: </div>
              <div className={"aio-value"}><AioExpander inputObject={location} /></div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Unprocessed text: </div>
              <AsupInternalEditor value={text} style={{ border: "0" }} styleMap={higherOptions.cellStyles} />
            </div>
            {(cellType === AitCellType.header)
              ?
              <>
                <div className="aiw-body-row">
                  <div className={"aio-label"}>Row span: </div>
                  <div className={"aio-ro-value"}>{rowSpan ?? 1}</div>
                  <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                    {(!currentReadOnly && typeof addRowSpan === "function" && colSpan === 1)
                      ? <div className="aiox-button aiox-plus" onClick={() => addRowSpan(location)} />
                      : <div className="aiox-button" />
                    }
                    {(!currentReadOnly && typeof removeRowSpan === "function") && <div className="aiox-button aiox-minus" onClick={() => removeRowSpan(location)} />}
                  </div>
                </div>
                <div className="aiw-body-row">
                  <div className={"aio-label"}>Column span: </div>
                  <div className={"aio-ro-value"}>{colSpan ?? 1}</div>
                  <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                    {(!currentReadOnly && typeof addColSpan === "function" && rowSpan === 1 && location.row < (higherOptions.headerRows ?? 1) - 1)
                      ? <div className="aiox-button aiox-plus" onClick={() => addColSpan(location)} />
                      : <div className="aiox-button" />
                    }
                    {(!currentReadOnly && typeof removeColSpan === "function") && <div className="aiox-button aiox-minus" onClick={() => removeColSpan(location)} />}
                  </div>
                </div>
                <div className="aiw-body-row">
                  <AioNumber
                    label="Width (mm)"
                    value={colWidth ?? 60}
                    setValue={!currentReadOnly ? (ret) => returnData({ colWidth: ret }) : undefined}
                  />
                </div>
              </>
              :
              <></>
            }
            {(cellType === AitCellType.rowHeader)
              ?
              <>
                <div className="aiw-body-row">
                  <div className={"aio-label"}>Text indents: </div>
                  <div className={"aio-ro-value"}>{textIndents ?? 0}</div>
                  <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                    <div className="aiox-button aiox-plus" onClick={() => returnData({ textIndents: (textIndents ?? 0) + 1 })} />
                    {(textIndents ?? 0) > 0 && <div className="aiox-button aiox-minus" onClick={() => returnData({ textIndents: textIndents! - 1 })} />}
                  </div>
                </div>
                <div className="aiw-body-row">
                  <div className={"aio-label"}>Row span: </div>
                  <div className={"aio-ro-value"}>{rowSpan ?? 1}</div>
                  <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                    {(!currentReadOnly && typeof addRowSpan === "function" && colSpan === 1)
                      ? <div className="aiox-button aiox-plus" onClick={() => addRowSpan(location)} />
                      : <div className="aiox-button" />
                    }
                    {(!currentReadOnly && typeof removeRowSpan === "function") && <div className="aiox-button aiox-minus" onClick={() => removeRowSpan(location)} />}
                  </div>
                </div>
              </>
              :
              <></>
            }
          </AsupInternalWindow>
        }
      </div>
    </td>
  );
}