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
  columnIndex: number,
  cellData: AitCellData,
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
export const AitCell = (props: AitCellProps) => {

  // Data holder
  const [receivedText, setReceivedText] = useState(props.cellData.text);
  const [displayText, setDisplayText] = useState(props.cellData.replacedText ?? props.cellData.text);
  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState<AitCellData>(structuredClone(props.cellData));
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);
  const [cellStyle, setCellStyle] = useState<React.CSSProperties>();
  const [currentReadOnly, setCurrentReadOnly] = useState(() => {
    return props.readOnly
      || typeof (props.setCellData) !== "function"
      || (props.cellData.options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || displayText !== receivedText
  });

  // Static options/variables
  const cellType = useMemo(() => {
    let cellType =
      props.cellData.options?.find(o => o.optionName === AitCellOptionNames.cellType)?.value
      ??
      (props.higherOptions.tableSection === AitCellType.body && props.columnIndex < props.higherOptions.rowHeaderColumns
        ?
        AitCellType.rowHeader
        :
        props.higherOptions.tableSection);
    return cellType;
  }, [props.cellData.options, props.columnIndex, props.higherOptions.rowHeaderColumns, props.higherOptions.tableSection]);
  const location: AitLocation = useMemo(() => {
    return {
      tableSection: props.higherOptions.tableSection,
      rowGroup: props.higherOptions.rowGroup,
      row: props.higherOptions.row,
      column: props.columnIndex,
      repeat: (props.higherOptions.repeatNumber ?? []).join(",")
    }
  }, [props.columnIndex, props.higherOptions.repeatNumber, props.higherOptions.row, props.higherOptions.rowGroup, props.higherOptions.tableSection]);

  /** Updates to initial text */
  useEffect(() => {
    let newText = props.cellData.replacedText ?? props.cellData.text;
    // Check read only flag
    setCurrentReadOnly(
      props.readOnly
      || props.cellData.replacedText !== undefined
      || typeof (props.setCellData) !== "function"
      || (props.cellData.options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || newText !== props.cellData.text
    );
    setReceivedText(props.cellData.text);
    setDisplayText(newText);
  }, [props.cellData.replacedText, props.cellData.text, props.cellData.options, props.readOnly, props.setCellData]);


  // Update cell style when options change
  useEffect(() => {
    const style = {
      width: props.cellData.options?.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value ?? "100px",
      borderLeft: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderRight: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderTop: props.higherOptions.showCellBorders && location.row === 0 && location.rowGroup > 0
        ? "2px solid burlywood"
        : props.higherOptions.showCellBorders
          ? "1px dashed burlywood"
          : "",
    }
    setCellStyle(style);
  }, [location.row, location.rowGroup, props.higherOptions.showCellBorders, props.cellData.options]);

  const updateOptions = useCallback((ret: AioOptionGroup) => {
    if (currentReadOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: props.cellData.aitid,
      options: ret,
      text: displayText ?? "",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      props.setCellData(r);
      setLastSend(structuredClone(r));
    }
  }, [currentReadOnly, displayText, lastSend, location, props]);

  /** Send data back */
  useEffect(() => {
    if (currentReadOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: props.cellData.aitid,
      options: props.cellData.options ?? [],
      text: displayText ?? "",
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      props.setCellData(r);
      setLastSend(structuredClone(r));
    }
  }, [displayText, lastSend, props.cellData.aitid, location, props, currentReadOnly]);

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
      case (AitOptionLocation.rowGroup): props.addRowGroup!(props.higherOptions.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Remove group button
  const onRemoveClick = (optionType: AitOptionLocation) => {
    setButtonState("hidden");
    switch (optionType) {
      case (AitOptionLocation.rowGroup): props.removeRowGroup!(props.higherOptions.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }

  // Do not render if there is no rowSpan or colSpan
  if (props.cellData.options.find(o => o.optionName === AitCellOptionNames.colSpan)?.value === 0
    || props.cellData.options.find(o => o.optionName === AitCellOptionNames.rowSpan)?.value === 0
  ) return <></>;

  // Render element
  return (
    <td
      className={["ait-cell",
        (cellType === AitCellType.header ? "ait-header-cell" : cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell"),
        (currentReadOnly ? "ait-readonly-cell" : ""),
      ].join(" ")}
      colSpan={props.cellData.options?.find((o) => o.optionName === AitCellOptionNames.colSpan)?.value ?? 1}
      rowSpan={props.cellData.options?.find((o) => o.optionName === AitCellOptionNames.rowSpan)?.value ?? 1}
      style={cellStyle}
      data-location-table-section={props.higherOptions.tableSection}
      data-location-row-group={props.higherOptions.rowGroup}
      data-location-row={props.higherOptions.row}
      data-location-cell={props.higherOptions.column}
    >
      <div className="ait-aie-holder"
        onMouseOver={aitShowButtons}
        onMouseLeave={aitHideButtons}
      >

        {/* Option buttons  */}
        <>
          {props.readOnly === false &&
            <>
              {(props.rowGroupOptions)
                ?
                (<>
                  {typeof (props.addRowGroup) === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-add-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { onAddClick(AitOptionLocation.rowGroup) }}
                    />
                  }
                  {typeof (props.removeRowGroup) === "function" &&
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
              {(props.rowOptions)
                ?
                <>
                  <div
                    className={`ait-options-button ait-options-button-row ${buttonState === "hidden" ? "hidden" : ""}`}
                    onClick={(e) => { onShowOptionClick(AitOptionLocation.row) }}
                  />
                  {typeof props.addRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-add-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { props.addRow!(location.row) }}
                    />
                  }
                  {typeof props.removeRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-remove-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { props.removeRow!(location.row) }}
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
        {props.readOnly === false &&
          <>
            {showRowGroupOptions &&
              <AsupInternalWindow key="RowGroup" Title={(props.rowGroupWindowTitle ?? "Row group") + " options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
                <AioOptionDisplay
                  options={props.rowGroupOptions}
                  setOptions={(ret) => {
                    if (!props.rowGroupOptions) return;
                    let rgl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: -1, column: -1 } as AitLocation;
                    props.setRowGroupOptions!(ret, rgl);
                  }}
                />
              </AsupInternalWindow>
            }

            {showRowOptions &&
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
                <AioOptionDisplay
                  options={props.rowOptions}
                  setOptions={(ret) => {
                    if (!props.rowOptions) return;
                    let rl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: props.higherOptions.row, column: -1 } as AitLocation;
                    props.setRowOptions!(ret, rl);
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
              <div className={"aio-ro-value"}>{props.cellData.text}</div>
            </div>
            <AioOptionDisplay options={props.cellData.options} setOptions={!currentReadOnly ? (ret) => { updateOptions(ret); } : undefined} />
          </AsupInternalWindow>
        }
      </div>
    </td>
  );
}