import * as React from 'react';
import { useState, useEffect } from "react";
import { AsupInternalEditor } from '../aie/AsupInternalEditor';
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { AioOptionGroup } from "../aio/aioOptionGroup";
// import { AioString } from "../aio/aioString";
import { processOptions } from "../functions";
import { AioExpander } from "../aio/aioExpander";
import { AitCellData, AitLocation, AitCellType, AitOptionLocation } from "./aitInterface";
import { OptionGroup, OptionType, AitCellOptionNames } from "components/aio/aioInterface";

interface AitCellProps {
  initialData: AitCellData,
  location: AitLocation,
  returnData: (ret: AitCellData) => void,
  showCellBorders?: boolean,
  type: AitCellType,
  editable: boolean,
  addRowGroup?: (i: number) => void,
  rowGroupOptions?: [OptionGroup, (ret: OptionGroup, location: AitLocation) => void],
  rowOptions?: [OptionGroup, (ret: OptionGroup, location: AitLocation) => void],
};

const defaultOptions: OptionGroup = [
  { optionName: AitCellOptionNames.cellWidth, label: "Minimum width", value: "120px", type: OptionType.string, },
  { optionName: AitCellOptionNames.colSpan, label: "Column span", value: 1, type: OptionType.number, readOnly: true },
  { optionName: AitCellOptionNames.rowSpan, label: "Row span", value: 1, type: OptionType.number, readOnly: true },
];

export const AitCell = (props: AitCellProps) => {
  // Data holder
  const [text, setText] = useState(props.initialData.originalText);
  //const [options, setOptions] = useState(initialData.options ?? []);
  const [options, setOptions] = useState(processOptions(props.initialData.options, defaultOptions));
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
    //console.log("Setting cell style in aitCell");
    const style = {
      width: options.find(o => o.optionName === AitCellOptionNames.cellWidth)?.value,
      border: props.showCellBorders ? "1px dashed burlywood" : ""
    }
    setCellStyle(style);
  }, [options, props.showCellBorders]);


  // Send data back
  useEffect(() => {
    if (typeof (props.returnData) !== "function") return;
    // All these parameters should be in the initial data
    //console.log("returnData in aitCell");
    const r: AitCellData = {
      originalText: props.initialData.originalText,
      options: options ?? [],
      text: text ?? "",
    }
    if (JSON.stringify(r) !== lastSend) {
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
  // Add buttons
  const onAddClick = (optionType: AitOptionLocation) => {
    setButtonState("hidden");
    switch (optionType) {
      case (AitOptionLocation.rowGroup): props.addRowGroup!(props.location.rowGroup!); break;
      // case (AitOptionLocation.row): setShowRowOptions(true); break;
      // case (AitOptionLocation.cell): setShowCellOptions(true); break;
      default: break;
    }
  }

  // Render element
  return (
    <td
      className={["ait-cell",
        (props.type === AitCellType.header ? "ait-header-cell" : props.type === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell")
      ].join(" ")}
      colSpan={options.find((o) => o.optionName === AitCellOptionNames.colSpan)?.value ?? 1}
      rowSpan={options.find((o) => o.optionName === AitCellOptionNames.rowSpan)?.value ?? 1}
      onMouseOver={aitShowButtons}
      onMouseLeave={aitHideButtons}
      style={cellStyle}
      data-location-table-section={props.location.tableSection}
      data-location-row-group={props.location.rowGroup}
      data-location-row={props.location.row}
      data-location-cell={props.location.cell}
    >
      <div className="ait-aie-holder">
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
                <div
                  className={`ait-options-button ait-options-button-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                  onClick={(e) => { onShowOptionClick(AitOptionLocation.rowGroup) }}
                />
                <AsupInternalWindow key="RowGroup" Title={"Row group options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
                  <AioOptionGroup
                    initialData={props.rowGroupOptions[0]}
                    returnData={(ret) => {
                      if (!props.rowGroupOptions) return;
                      let rgl = { tableSection: props.location.tableSection, rowGroup: props.location.rowGroup, row: -1, cell: -1 } as AitLocation;
                      props.rowGroupOptions[1](ret, rgl);
                    }}
                  />
                </AsupInternalWindow>
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
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
                <AioOptionGroup 
                initialData={props.rowOptions[0]} 
                returnData={(ret) => {
                  if (!props.rowOptions) return;
                  let rl = { tableSection: props.location.tableSection, rowGroup: props.location.rowGroup, row: props.location.row, cell: -1 } as AitLocation;
                  props.rowOptions[1](ret, rl);
                }}
                />
              </AsupInternalWindow>
            </>)
            : null
        }

        <div
          className={`ait-options-button ait-options-button-cell ${buttonState === "hidden" ? "hidden" : ""}`}
          onClick={(e) => { onShowOptionClick(AitOptionLocation.cell) }}
        >
        </div>
        <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={() => { onCloseOption(AitOptionLocation.cell); }}>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Cell location: </div>
            <div className={"aio-value"}><AioExpander inputObject={props.location} /></div>
          </div>
          <div className="aiw-body-row">
            <div className={"aio-label"}>Original text: </div>
            <div className={"aio-ro-value"}>{props.initialData.originalText}</div>
          </div>
          <AioOptionGroup initialData={options} returnData={(ret) => { setOptions(ret); }} />
        </AsupInternalWindow>
        <AsupInternalEditor
          addStyle={{ width: "100%", height: "100%", border: "none" }}
          textAlignment={(props.type === AitCellType.rowHeader ? "left" : "center")}
          showStyleButtons={false}
          initialText={props.initialData.originalText}
          returnText={setText}
          editable={props.editable}
          highlightChanges={true}
        />
      </div>
    </td>
  );
}