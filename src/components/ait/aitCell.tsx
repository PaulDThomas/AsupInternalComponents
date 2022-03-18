import React, { useState, useEffect, useMemo } from "react";
import structuredClone from '@ungap/structured-clone';
import { AsupInternalEditor } from 'components/aie/AsupInternalEditor';
import { AioExpander } from "components/aio/aioExpander";
import { AioOptionDisplay } from "components/aio/aioOptionDisplay";
import { AioOptionGroup } from "components/aio/aioInterface";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
// import { AioString } from "../aio/aioString";
import { objEqual, processOptions } from "./processes";
import { AitCellData, AitLocation, AitCellType, AitOptionLocation, AitOptionList, AitCellOptionNames } from "./aitInterface";


/**
* Process text for repeat level and avaiable replacement values
* @param text Initial text
* @param options Options applied to the cell, should contain repeat options
* @returns updated text
*/
const processRepeats = (text: string, options: AitOptionList): string => {
  // Do nothing if there is nothing to do
  if (!options.repeatNumber || !options.replacements || !options.replacements[0].replacementText) return text;

  /** Text to return */
  let newText = text;

  /** Replacements for this text */
  for (let r = 0; r < options.replacements.length; r++) {
    for (let i = 0; i < options.replacements[r].replacementText.length; i++) {
      // Replace if there in old and new text
      let o = options.replacements[r].replacementText[i].text;
      let n = options.repeatValues ? options.repeatValues[r + i] : undefined;
      if (n) newText = newText.replace(o, n);
    }
  }
  return newText;
}

interface AitCellProps {
  aitid: string,
  columnIndex: number,
  cellData: AitCellData,
  setCellData: (ret: AitCellData) => void,
  readOnly: boolean,
  higherOptions: AitOptionList,
  rowGroupOptions?: {
    options: AioOptionGroup,
    setOptions: (ret: AioOptionGroup, location: AitLocation) => void
  },
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  rowOptions?: {
    options: AioOptionGroup,
    setOptions: (ret: AioOptionGroup, location: AitLocation) => void,
    addRow?: (ret: number) => void
    removeRow?: (ret: number) => void
  },
};

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = (props: AitCellProps) => {

  // Data holder
  const [receivedText, setReceivedText] = useState(props.cellData.text);
  const [displayText, setDisplayText] = useState(() => processRepeats(props.cellData.text, props.higherOptions));
  const [options, setOptions] = useState(props.cellData.options);
  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState<AitCellData>(structuredClone(props.cellData));
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);
  const [cellStyle, setCellStyle] = useState<React.CSSProperties>();
  const [readOnly, setReadOnly] = useState(() => {
    return props.readOnly
      || typeof (props.setCellData) !== "function"
      || (props.cellData.options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || displayText !== receivedText
  });

  // Static options/variables
  const cellType = useMemo(() => props.cellData.options?.find(o => o.optionName === AitCellOptionNames.cellType)?.value ?? props.higherOptions.tableSection, [props.cellData.options, props.higherOptions.tableSection]);
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
    let newText = processRepeats(props.cellData.text, props.higherOptions);
    // Check read only flag
    setReadOnly(
      props.readOnly
      || typeof (props.setCellData) !== "function"
      || (props.cellData.options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false)
      || newText !== props.cellData.text
    );
    setReceivedText(props.cellData.text);
    setDisplayText(newText);
  }, [props.cellData.options, props.cellData.text, props.higherOptions, props.readOnly, props.setCellData]);


  /** Update to initial options, cannot include options in reference as this creates an infinite loop */
  useEffect(() => {
    setOptions(processOptions(props.cellData.options, options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cellData.options]);

  // Update cell style when options change
  useEffect(() => {
    const style = {
      width: options?.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value ?? "100px",
      borderLeft: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderRight: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderBottom: props.higherOptions.showCellBorders ? "1px dashed burlywood" : "",
      borderTop: props.higherOptions.showCellBorders && location.row === 0 && location.rowGroup > 0
        ? "2px dashed black"
        : props.higherOptions.showCellBorders
          ? "1px dashed burlywood"
          : "",
    }
    setCellStyle(style);
  }, [options, props.higherOptions.showCellBorders]);

  /** Send data back */
  useEffect(() => {
    if (readOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: props.cellData.aitid ?? props.aitid,
      options: options ?? [],
      text: displayText ?? "",
      readOnly: props.cellData.readOnly ?? props.readOnly ?? false,
    }
    let [chkObj, diffs] = objEqual(r, lastSend, `CELLCHECK:${Object.values(location).join(',')}-`);
    if (!chkObj) {
      console.log(`Return for cell: ${diffs}`);
      props.setCellData(r);
      setLastSend(structuredClone(r));
    }
  }, [options, displayText, lastSend, props.cellData.aitid, location, props.cellData.readOnly, readOnly, props]);

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => { setButtonState(""); };
  const aitHideButtons = () => { setButtonState("hidden"); };

  // Show windows
  const onShowOptionClick = (optionType: AitOptionLocation) => {
    // console.log(`Show option click in aieCell for ${optionType}`);
    switch (optionType) {
      case (AitOptionLocation.rowGroup): setShowRowGroupOptions(true); break;
      case (AitOptionLocation.row): setShowRowOptions(true); break;
      case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Hide windows
  const onCloseOption = (optionType: AitOptionLocation) => {
    // console.log(`Hide option click in aieCell for ${optionType}`);
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

  // Render element
  return (
    <td
      className={["ait-cell",
        (cellType === AitCellType.header ? "ait-header-cell" : cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell"),
        (readOnly ? "ait-readonly-cell" : ""),
      ].join(" ")}
      colSpan={options?.find((o) => o.optionName === AitCellOptionNames.colSpan)?.value ?? 1}
      rowSpan={options?.find((o) => o.optionName === AitCellOptionNames.rowSpan)?.value ?? 1}
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
                  {typeof props.rowOptions.addRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-add-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { props.rowOptions!.addRow!(location.row) }}
                    />
                  }
                  {typeof props.rowOptions.removeRow === "function" &&
                    <div
                      className={`ait-options-button ait-options-button-remove-row ${buttonState === "hidden" ? "hidden" : ""}`}
                      onClick={(e) => { props.rowOptions!.removeRow!(location.row) }}
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
          editable={!readOnly}
          highlightChanges={true}
        />
      </div>

      <div>
        {/* Option windows */}
        {props.readOnly === false &&
          <>
            {showRowGroupOptions &&
              <AsupInternalWindow key="RowGroup" Title={"Row group options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
                <AioOptionDisplay
                  options={props.rowGroupOptions!.options}
                  setOptions={(ret) => {
                    if (!props.rowGroupOptions) return;
                    let rgl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: -1, column: -1 } as AitLocation;
                    props.rowGroupOptions!.setOptions(ret, rgl);
                  }}
                />
              </AsupInternalWindow>
            }

            {showRowOptions &&
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
                <AioOptionDisplay
                  options={props.rowOptions?.options}
                  setOptions={(ret) => {
                    if (!props.rowOptions) return;
                    let rl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: props.higherOptions.row, column: -1 } as AitLocation;
                    props.rowOptions.setOptions!(ret, rl);
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
            <AioOptionDisplay options={options} setOptions={!readOnly ? (ret) => { setOptions(ret); } : undefined} />
          </AsupInternalWindow>
        }
      </div>
    </td>
  );
}