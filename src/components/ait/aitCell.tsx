import * as React from 'react';
import { useState, useEffect } from "react";
import { AsupInternalEditor } from '../aie/AsupInternalEditor';
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { AioOptionDisplay } from "../aio/aioOptionDisplay";
// import { AioString } from "../aio/aioString";
import { processOptions } from "./processes";
import { AioExpander } from "../aio/aioExpander";
import { AitCellData, AitLocation, AitCellType, AitOptionLocation } from "./aitInterface";
import { OptionGroup, OptionType, AitCellOptionNames } from "components/aio/aioInterface";
import { v4 as uuidv4 } from 'uuid';

interface AitCellProps {
  initialData: AitCellData,
  location: AitLocation,
  readOnly?: boolean,
  //renderColumn?: number,
  returnData: (ret: AitCellData) => void,
  showCellBorders?: boolean,
  addRowGroup?: (rgi: number) => void,
  rowGroupOptions?: [OptionGroup, (ret: OptionGroup, location: AitLocation) => void],
  removeRowGroup?: (rgi: number) => void,
  rowOptions?: [OptionGroup, (ret: OptionGroup, location: AitLocation) => void],
};

export const AitCell = (props: AitCellProps) => {
  // Data holder
  const [text, setText] = useState(props.initialData.originalText);
  //const [options, setOptions] = useState(initialData.options ?? []);
  const [options, setOptions] = useState(props.initialData.options);
  const [buttonState, setButtonState] = useState("hidden");
  const [lastSend, setLastSend] = useState(JSON.stringify(props.initialData));

  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);

  const [cellStyle, setCellStyle] = useState<React.CSSProperties>();

  // Updates to initial data
  useEffect(() => { setText(props.initialData.originalText); }, [props.initialData.originalText]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const newOptions = processOptions(props.initialData.options, options); setOptions(newOptions); }, [props.initialData.options]);

  // Update cell style when options change
  useEffect(() => {
    const style = {
      width: options?.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value,
      border: props.showCellBorders ? "1px dashed burlywood" : ""
    }
    setCellStyle(style);
  }, [options, props.readOnly, props.showCellBorders]);


  // Send data back
  useEffect(() => {
    if (!props.readOnly && typeof (props.returnData) !== "function") return;
    // All these parameters should be in the initial data
    const r: AitCellData = {
      aitid: props.initialData.aitid ?? uuidv4(),
      originalText: props.initialData.originalText,
      options: options ?? [],
      text: text ?? "",
      readOnly: props.readOnly ?? false,
      //renderColumn: props.renderColumn,
    }
    if (JSON.stringify(r) !== lastSend) {
      console.log("Cell Return");
      props.returnData(r);
      setLastSend(JSON.stringify(r));
    }
  }, [props, options, text, lastSend]);

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
      case (AitOptionLocation.rowGroup): props.addRowGroup!(props.location.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Remove group button
  const onRemoveClick = (optionType: AitOptionLocation) => {
    setButtonState("hidden");
    switch (optionType) {
      case (AitOptionLocation.rowGroup): props.removeRowGroup!(props.location.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }

  let cellType = props.initialData.options?.find(o => o.optionName === AitCellOptionNames.cellType)?.value ?? AitCellType.body;

  // Render element
  return (
    <td
      className={["ait-cell",
        (cellType === AitCellType.header ? "ait-header-cell" : cellType === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell"),
        (props.readOnly ? "ait-readonly-cell" : ""),
      ].join(" ")}
      colSpan={options?.find((o) => o.optionName === AitCellOptionNames.colSpan)?.value ?? 1}
      rowSpan={options?.find((o) => o.optionName === AitCellOptionNames.rowSpan)?.value ?? 1}
      style={cellStyle}
      data-location-table-section={props.location.tableSection}
      data-location-row-group={props.location.rowGroup}
      data-location-row={props.location.row}
      data-location-cell={props.location.cell}
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
          initialText={props.initialData.originalText}
          returnText={setText}
          editable={!props.readOnly}
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
              let rgl = { tableSection: props.location.tableSection, rowGroup: props.location.rowGroup, row: -1, cell: -1 } as AitLocation;
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
              let rl = { tableSection: props.location.tableSection, rowGroup: props.location.rowGroup, row: props.location.row, cell: -1 } as AitLocation;
              props.rowOptions[1](ret, rl);
            }}
          />
        </AsupInternalWindow>
      }

      {showCellOptions &&
        <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { onCloseOption(AitOptionLocation.cell); }}>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Cell location: </div>
            <div className={"aio-value"}><AioExpander inputObject={props.location} /></div>
          </div>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Original text: </div>
            <div className={"aio-ro-value"}>{props.initialData.originalText}</div>
          </div>
          <AioOptionDisplay initialData={options} returnData={!props.readOnly ? (ret) => { setOptions(ret); } : undefined} />
        </AsupInternalWindow>
      }
      </div>

    </td>
  );
}