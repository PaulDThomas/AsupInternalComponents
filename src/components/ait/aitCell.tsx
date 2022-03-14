import React, { useState, useEffect, useMemo } from "react";
import { AsupInternalEditor } from 'components/aie/AsupInternalEditor';
import { AioExpander } from "components/aio/aioExpander";
import { AioOptionDisplay } from "components/aio/aioOptionDisplay";
import { AioOptionGroup, AitCellOptionNames } from "components/aio/aioInterface";
import { AsupInternalWindow } from "components/aiw/AsupInternalWindow";
// import { AioString } from "../aio/aioString";
import { processOptions } from "./processes";
import { AitCellData, AitLocation, AitCellType, AitOptionLocation, AitOptionList } from "./aitInterface";

interface AitCellProps {
  aitid: string,
  columnIndex: number,
  cellData: AitCellData,
  setCellData: (ret: AitCellData) => void,
  readOnly: boolean,
  higherOptions: AitOptionList,
  rowGroupOptions?: [AioOptionGroup, (ret: AioOptionGroup, location: AitLocation) => void],
  addRowGroup?: (rgi: number) => void,
  removeRowGroup?: (rgi: number) => void,
  rowOptions?: [AioOptionGroup, (ret: AioOptionGroup, location: AitLocation) => void],
};

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = (props: AitCellProps) => {

  // Data holder
  const [text, setText] = useState(props.cellData.originalText);
  const [options, setOptions] = useState(props.cellData.options);
  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState(JSON.stringify(props.cellData));
  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);
  const [cellStyle, setCellStyle] = useState<React.CSSProperties>();

  // Static options/variables
  let cellType = props.cellData.options?.find(o => o.optionName === AitCellOptionNames.cellType)?.value ?? props.higherOptions.tableSection;
  let location: AitLocation = useMemo(() => {
    return {
      tableSection: props.higherOptions.tableSection,
      rowGroup: props.higherOptions.rowGroup,
      row: props.higherOptions.row,
      column: props.columnIndex,
    }
  }, [props.columnIndex, props.higherOptions.row, props.higherOptions.rowGroup, props.higherOptions.tableSection]);

  // Updates to initial data
  useEffect(() => { setText(props.cellData.originalText); }, [props.cellData.originalText]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const newOptions = processOptions(props.cellData.options, options); setOptions(newOptions); }, [props.cellData.options]);

  // Update cell style when options change
  useEffect(() => {
    const style = {
      width: options?.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value ?? "100px",
      border: props.higherOptions.showCellBorders ? "1px dashed burlywood" : ""
    }
    setCellStyle(style);
  }, [options, props.higherOptions.showCellBorders]);

  // Get cell options
  let readOnly: boolean = useMemo(() => {
    return props.readOnly
      || typeof (props.setCellData) !== "function"
      || (props.cellData.options?.find(o => o.optionName === AitCellOptionNames.readOnly)?.value ?? false);
  }, [props.cellData.options, props.readOnly, props.setCellData]);

  // Send data back
  useEffect(() => {
    if (readOnly) return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: props.cellData.aitid,
      originalText: props.cellData.originalText,
      options: options ?? [],
      text: text ?? "",
      readOnly: props.cellData.readOnly,
    }
    if (JSON.stringify(r) !== lastSend) {
      console.log(`Cell Return for cell: ${Object.values(location).join(',')}`);
      props.setCellData(r);
      setLastSend(JSON.stringify(r));
    }
  }, [props, options, text, lastSend, readOnly, location]);

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
        {
          (props.rowGroupOptions)
            ?
            (
              <>
                {typeof (props.addRowGroup) === "function"
                  ?
                  <div
                    className={`ait-options-button ait-options-button-add-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                    onClick={(e) => { onAddClick(AitOptionLocation.rowGroup) }}
                  />
                  :
                  <></>
                }
                {typeof (props.removeRowGroup) === "function"
                  ?
                  <div
                    className={`ait-options-button ait-options-button-remove-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                    onClick={(e) => { onRemoveClick(AitOptionLocation.rowGroup) }}
                  />
                  :
                  <></>
                }
                <div
                  className={`ait-options-button ait-options-button-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                  onClick={(e) => { onShowOptionClick(AitOptionLocation.rowGroup) }}
                />
              </>
            )
            :
            null
        }
        {
          (props.rowOptions)
            ? (<>
              <div
                className={`ait-options-button ait-options-button-row ${buttonState === "hidden" ? "hidden" : ""}`}
                onClick={(e) => { onShowOptionClick(AitOptionLocation.row) }}
              />

            </>)
            : null
        }
        <div
          className={`ait-options-button ait-options-button-cell ${buttonState === "hidden" ? "hidden" : ""}`}
          onClick={(e) => { onShowOptionClick(AitOptionLocation.cell) }}
        >
        </div>

        <AsupInternalEditor
          addStyle={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={(cellType === AitCellType.rowHeader ? "left" : "center")}
          showStyleButtons={false}
          initialText={props.cellData.originalText}
          returnText={setText}
          editable={!readOnly}
          highlightChanges={true}
        />
      </div>

      <div>
        {/* Option windows */}
        {showRowGroupOptions &&
          <AsupInternalWindow key="RowGroup" Title={"Row group options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
            <AioOptionDisplay
              initialData={props.rowGroupOptions![0]}
              returnData={(ret) => {
                if (!props.rowGroupOptions) return;
                let rgl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: -1, column: -1 } as AitLocation;
                props.rowGroupOptions[1](ret, rgl);
              }}
            />
          </AsupInternalWindow>
        }

        {showRowOptions &&
          <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
            <AioOptionDisplay
              initialData={props.rowOptions![0]}
              returnData={(ret) => {
                if (!props.rowOptions) return;
                let rl = { tableSection: props.higherOptions.tableSection, rowGroup: props.higherOptions.rowGroup, row: props.higherOptions.row, column: -1 } as AitLocation;
                props.rowOptions[1](ret, rl);
              }}
            />
          </AsupInternalWindow>
        }

        {showCellOptions &&
          <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { onCloseOption(AitOptionLocation.cell); }}>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Cell location: </div>
              <div className={"aio-value"}><AioExpander inputObject={location} /></div>
            </div>
            <div className="aiw-body-row">
              <div className={"aio-label"}>Original text: </div>
              <div className={"aio-ro-value"}>{props.cellData.originalText}</div>
            </div>
            <AioOptionDisplay initialData={options} returnData={!readOnly ? (ret) => { setOptions(ret); } : undefined} />
          </AsupInternalWindow>
        }
      </div>
      
    </td>
  );
}