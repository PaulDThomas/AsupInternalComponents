import React, { useState, useEffect, useMemo, useCallback } from "react";
import structuredClone from '@ungap/structured-clone';
import { AsupInternalEditor } from 'components/aie/AsupInternalEditor';
import { AioExpander } from "components/aio/aioExpander";
import { AioOptionDisplay } from "components/aio/aioOptionDisplay";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
// import { AioString } from "../aio/aioString";
import { objEqual } from "./processes";
import { AitCellData, AitLocation, AitCellType, AitOptionLocation, AitOptionList, AitCellOptionNames } from "./aitInterface";


interface AitCellProps {
  aitid: string,
  text: string,
  replacedText?: string,
  options: AioOptionGroup,
  columnIndex: number,
  setCellData: (ret: AitCellData) => void,
  readOnly: boolean,
  higherOptions: AitOptionList,
  rowGroupOptions?: AioOptionGroup,
  setRowGroupOptions?: (ret: AioOptionGroup, location: AitLocation) => void,
  rowGroupWindowTitle?: string
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  rowOptions?: AioOptionGroup,
  setRowOptions?: (ret: AioOptionGroup, location: AitLocation) => void,
  addRow?: (ret: number) => void
  removeRow?: (ret: number) => void
};

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = ({
  aitid,
  text,
  replacedText,
  options,
  columnIndex, 
  setCellData, 
  readOnly, 
  higherOptions, 
  rowGroupOptions, 
  setRowGroupOptions, 
  rowGroupWindowTitle, 
  addRowGroup,
  removeRowGroup,
  rowOptions,
  setRowOptions,
  addRow,
  removeRow,
}: AitCellProps) => {

  // Data holder
  const [receivedText, setReceivedText] = useState(text);
  const [displayText, setDisplayText] = useState(replacedText ?? text);
  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState<AitCellData>(structuredClone({aitid: aitid, text:text, replacedText: replacedText, options: options}));
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);
  const [cellStyle, setCellStyle] = useState<React.CSSProperties>();
  const [currentReadOnly, setCurrentReadOnly] = useState(() => {
    return readOnly
      || typeof (setCellData) !== "function"
      || (options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || displayText !== receivedText
  });

  // Static options/variables
  const cellType = useMemo(() => {
    let cellType =
      options?.find(o => o.optionName === AitCellOptionNames.cellType)?.value
      ??
      (higherOptions.tableSection === AitCellType.body && columnIndex < higherOptions.rowHeaderColumns
        ?
        AitCellType.rowHeader
        :
        higherOptions.tableSection);
    return cellType;
  }, [options, columnIndex, higherOptions.rowHeaderColumns, higherOptions.tableSection]);
  const location: AitLocation = useMemo(() => {
    return {
      tableSection: higherOptions.tableSection,
      rowGroup: higherOptions.rowGroup,
      row: higherOptions.row,
      column: columnIndex,
      repeat: (higherOptions.repeatNumber ?? []).join(",")
    }
  }, [columnIndex, higherOptions.repeatNumber, higherOptions.row, higherOptions.rowGroup, higherOptions.tableSection]);

  /** Updates to initial text */
  useEffect(() => {
    let newText = replacedText ?? text;
    // Check read only flag
    setCurrentReadOnly(
      readOnly
      || replacedText !== undefined
      || typeof (setCellData) !== "function"
      || (options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || newText !== text
    );
    setReceivedText(text);
    setDisplayText(newText);
  }, [replacedText, text, options, readOnly, setCellData]);


  // Update cell style when options change
  useEffect(() => {
    const style = {
      width: options?.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value ?? "100px",
      borderLeft: higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderRight: higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderTop: higherOptions.showCellBorders && location.row === 0 && location.rowGroup > 0
        ? "2px solid burlywood"
        : higherOptions.showCellBorders
          ? "1px dashed burlywood"
          : "",
    }
    setCellStyle(style);
  }, [location.row, location.rowGroup, higherOptions.showCellBorders, options]);

  const updateOptions = useCallback((ret: AioOptionGroup) => {
    if (currentReadOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: aitid,
      options: ret,
      text: displayText ?? "",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setCellData(r);
      setLastSend(structuredClone(r));
    }
  }, [aitid, currentReadOnly, displayText, lastSend, location, setCellData]);

  /** Send data back */
  useEffect(() => {
    if (currentReadOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: aitid,
      options: options ?? [],
      text: displayText ?? "",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      setCellData(r);
      setLastSend(structuredClone(r));
    }
  }, [displayText, lastSend, aitid, location, currentReadOnly, options, setCellData]);

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => { setButtonState(""); };
  const aitHideButtons = () => { setButtonState("hidden"); };

  // Show windows
  const onShowOptionClick = (optionType: AitOptionLocation) => {
    switch (optionType) {
      case (AitOptionLocation.rowGroup): setShowRowGroupOptions(true); break;
      case (AitOptionLocation.row): setShowRowOptions(true); break;
      case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Hide windows
  const onCloseOption = (optionType: AitOptionLocation) => {
    switch (optionType) {
      case (AitOptionLocation.rowGroup): setShowRowGroupOptions(false); break;
      case (AitOptionLocation.row): setShowRowOptions(false); break;
      case (AitOptionLocation.cell): setShowCellOptions(false); break;
      default: break;
    }
  }
  // Add group button
  const onAddClick = (optionType: AitOptionLocation) => {
    setButtonState("hidden");
    switch (optionType) {
      case (AitOptionLocation.rowGroup): addRowGroup!(higherOptions.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Remove group button
  const onRemoveClick = (optionType: AitOptionLocation) => {
    setButtonState("hidden");
    switch (optionType) {
      case (AitOptionLocation.rowGroup): removeRowGroup!(higherOptions.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }

  // Do not render if there is no rowSpan or colSpan
  if (options.find(o => o.optionName === AitCellOptionNames.colSpan)?.value === 0
    || options.find(o => o.optionName === AitCellOptionNames.rowSpan)?.value === 0
  ) return <></>;

  // Render element
  return (
    <td
      className={["ait-cell",
        (cellType === AitCellType.header ? "ait-header-cell" : cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell"),
        (currentReadOnly ? "ait-readonly-cell" : ""),
      ].join(" ")}
      colSpan={options?.find((o) => o.optionName === AitCellOptionNames.colSpan)?.value ?? 1}
      rowSpan={options?.find((o) => o.optionName === AitCellOptionNames.rowSpan)?.value ?? 1}
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

        {/* Option buttons  */}
        <>
          {readOnly === false &&
            <>
              {(rowGroupOptions)
                ?
                (<>
                  {typeof (addRowGroup) === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-add-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { onAddClick(AitOptionLocation.rowGroup) }}
                    />
                  }
                  {typeof (removeRowGroup) === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-remove-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { onRemoveClick(AitOptionLocation.rowGroup) }}
                    />
                  }
                  <div
                    className={`ait-options-button ait-options-button-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                    onClick={(e) => { onShowOptionClick(AitOptionLocation.rowGroup) }}
                  />
                </>)
                :
                null
              }
              {(rowOptions)
                ?
                <>
                  <div
                    className={`ait-options-button ait-options-button-row ${buttonState === "hidden" ? "hidden" : ""}`}
                    onClick={(e) => { onShowOptionClick(AitOptionLocation.row) }}
                  />
                  {typeof addRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-add-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { addRow!(location.row) }}
                    />
                  }
                  {typeof removeRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-remove-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { removeRow!(location.row) }}
                    />
                  }                </>
                :
                null
              }
            </>
          }
          <div
            className={`ait-options-button ait-options-button-cell ${buttonState === "hidden" ? "hidden" : ""}`}
            onClick={(e) => { onShowOptionClick(AitOptionLocation.cell) }}
          >
          </div>
        </>

        <AsupInternalEditor
          addStyle={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={(cellType === AitCellType.rowHeader ? "left" : "center")}
          showStyleButtons={false}
          value={displayText}
          setValue={setDisplayText}
          editable={!currentReadOnly}
          highlightChanges={true}
        />
      </div>

      {/* Option windows */}
      <div>
        {readOnly === false &&
          <>
            {showRowGroupOptions &&
              <AsupInternalWindow key="RowGroup" Title={(rowGroupWindowTitle ?? "Row group") + " options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
                <AioOptionDisplay
                  options={rowGroupOptions}
                  setOptions={(ret) => {
                    if (!rowGroupOptions) return;
                    let rgl = { tableSection: higherOptions.tableSection, rowGroup: higherOptions.rowGroup, row: -1, column: -1 } as AitLocation;
                    setRowGroupOptions!(ret, rgl);
                  }}
                />
              </AsupInternalWindow>
            }

            {showRowOptions &&
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
                <AioOptionDisplay
                  options={rowOptions}
                  setOptions={(ret) => {
                    if (!rowOptions) return;
                    let rl = { tableSection: higherOptions.tableSection, rowGroup: higherOptions.rowGroup, row: higherOptions.row, column: -1 } as AitLocation;
                    setRowOptions!(ret, rl);
                  }}
                />
              </AsupInternalWindow>
            }

          </>
        }
        {showCellOptions &&
          <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { onCloseOption(AitOptionLocation.cell); }}>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Cell location: </div>
              <div className={"aio-value"}><AioExpander inputObject={location} /></div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Unprocessed text: </div>
              <div className={"aio-ro-value"}>{text}</div>
            </div>
            <AioOptionDisplay options={options} setOptions={!currentReadOnly ? (ret) => { updateOptions(ret); } : undefined} />
          </AsupInternalWindow>
        }
      </div>
    </td>
  );
}