/* eslint-disable react-hooks/exhaustive-deps */
import structuredClone from '@ungap/structured-clone';
import { AsupInternalEditor } from 'components/aie/AsupInternalEditor';
import { AioExpander } from "components/aio/aioExpander";
import { AioNumber } from "components/aio/aioNumber";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
import { objEqual } from "components/functions/objEqual";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AitCellData, AitCellType, AitLocation, AitOptionList, AitRowType } from "./aitInterface";

interface AitCellProps {
  aitid: string,
  text: string,
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
    ? replacedText.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    : text
    );
  /* Need to update if these change */
  useEffect(() => setDisplayText(
    replacedText !== undefined 
    ? replacedText.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    : text
  ), [replacedText, text]);

  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState<AitCellData>(structuredClone({
    aitid: aitid,
    text: text,
    colSpan: colSpan,
    rowSpan: rowSpan,
    colWidth: colWidth,
    textIndents: textIndents,
    replacedText: replacedText,
    repeatColSpan: repeatColSpan,
    repeatRowSpan: repeatRowSpan,
  }));

  const [showCellOptions, setShowCellOptions] = useState(false);

  // Static options/variables
  const currentReadOnly = useMemo(() => {
    return readOnly
      || typeof (setCellData) !== "function"
      || replacedText !== undefined
  }, [readOnly, replacedText, setCellData]);

  const cellType = useMemo(() => {
    let cellType = (higherOptions.tableSection === AitRowType.body) && (columnIndex < higherOptions.rowHeaderColumns)
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
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: higherOptions.row,
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
      borderRight: higherOptions.showCellBorders && (location.column === higherOptions.rowHeaderColumns - colSpan)
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
    colWidth?: number
    textIndents?: number
  }) => {
    if (currentReadOnly) return;
    const r: AitCellData = {
      aitid: aitid,
      text: cellUpdate.text ?? text,
      colSpan: colSpan,
      rowSpan: rowSpan,
      colWidth: cellUpdate.colWidth ?? colWidth,
      textIndents: cellUpdate.textIndents ?? textIndents ?? 0,
      replacedText: replacedText,
      repeatColSpan: repeatColSpan,
      repeatRowSpan: repeatRowSpan,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      // console.log(`Diffs:${diffs}`);
      setCellData!(r);
      setLastSend(structuredClone(r));
    }
  }, [aitid, colSpan, colWidth, currentReadOnly, lastSend, location, replacedText, rowSpan, setCellData, text, textIndents]);

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => { setButtonState(""); };
  const aitHideButtons = () => { setButtonState("hidden"); };

  // Do not render if there is no rowSpan or colSpan
  if (colSpan === 0 || rowSpan === 0) return <></>;

  // Render element
  return (
    <td
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
          {/* Option buttons  */}
          <div className="ait-tip ait-tip-rhs">
            <div
              className={`ait-options-button ait-options-button-cell ${buttonState === "hidden" ? "hidden" : ""}`}
              onClick={() => { setShowCellOptions(true); }}
            >
              <span className="ait-tiptext ait-tip-top">Cell&nbsp;options</span>
            </div>
          </div>
        </>

        <AsupInternalEditor
          addStyle={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={(columnIndex < higherOptions.rowHeaderColumns ? "left" : "center")}
          showStyleButtons={false}
          value={displayText}
          setValue={(ret) => { setDisplayText(ret); returnData({ text: ret.trimStart() }); }}
          editable={!currentReadOnly}
          highlightChanges={true}
        />
      </div>

      <div>
        {/* Cell options window */}
        {showCellOptions &&
          <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { setShowCellOptions(false); }}>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Cell location: </div>
              <div className={"aio-value"}><AioExpander inputObject={location} /></div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Unprocessed text: </div>
              <div className={"aio-ro-value"}>{text}</div>
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
                    {(!currentReadOnly && typeof addColSpan === "function" && rowSpan === 1)
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
              <div className="aiw-body-row">
                <div className={"aio-label"}>Text indents: </div>
                <div className={"aio-ro-value"}>{textIndents ?? 0}</div>
                <div className={"aiox-button-holder"} style={{ padding: "2px" }}>
                  <div className="aiox-button aiox-plus" onClick={() => returnData({ textIndents: (textIndents ?? 0) + 1 })} />
                  {(textIndents ?? 0) > 0 && <div className="aiox-button aiox-minus" onClick={() => returnData({ textIndents: textIndents! - 1 })} />}
                </div>
              </div>
              :
              <></>
            }
          </AsupInternalWindow>
        }
      </div>
    </td>
  );
}