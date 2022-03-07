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
  rowGroupOptions?: OptionGroup,
  setRowGroupOptions?: (ret: OptionGroup) => void,
  rowOptions?: OptionGroup,
  setRowOptions?: (ret: OptionGroup) => void,
};

const defaultOptions: OptionGroup = [
  {
    optionName: AitCellOptionNames.cellWidth,
    label: "Minimum width",
    value: "100px",
    type: OptionType.string,
  },
];

export const AitCell = (props: AitCellProps) => {
  // Data holder
  const [text, setText] = useState(props.initialData.text);
  //const [options, setOptions] = useState(initialData.options ?? []);
  const [options, setOptions] = useState(processOptions(props.initialData.options, defaultOptions));
  const [buttonState, setButtonState] = useState("hidden");

  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);

  const [cellStyle, setCellStyle] = useState<object>();

  // Updates to initial data
  useEffect(() => { setText(props.initialData.text); }, [props.initialData.text]);
  useEffect(() => {
    //console.log(`Setting intial cell options update, found ${initialData.options.length}`);
    const newOptions: OptionGroup = [
      {
        optionName: AitCellOptionNames.cellWidth,
        label: "Minimum width",
        type: OptionType.string,
        value: props.initialData.options.find(o => o.optionName === AitCellOptionNames.cellWidth) !== undefined
          ? props.initialData.options.find(o => o.optionName === AitCellOptionNames.cellWidth)!.value
          : "120px"
      },
    ];
    setOptions(newOptions);
  }, [props.initialData.options]);

  // Update cell style when options change
  useEffect(() => {
    //console.log("Setting cell style in aitCell");
    const style = {
      width: options.find(o => o.optionName === AitCellOptionNames.cellWidth) !== undefined
        ? options.find(o => o.optionName === AitCellOptionNames.cellWidth)!.value
        : undefined,
      border: props.showCellBorders ? "1px dashed burlywood" : ""
    }
    setCellStyle(style);
  }, [options, props.showCellBorders]);


  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
    //console.log("returnData in aitCell");
    const r: AitCellData = {
      originalText: props.initialData.originalText,
      options: options ?? [],
      text: text ?? "",
      colSpan: props.initialData.colSpan ?? 1,
      rowSpan: props.initialData.rowSpan ?? 1,
    }
    if (typeof (props.returnData) === "function") props.returnData(r);
  }, [props, options, text]);

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

  // Render element
  return (
    <td
      className={["ait-cell",
        (props.type === AitCellType.header ? "ait-header-cell" : props.type === AitCellType.rowHeader ? "ait-row-header-cell" : "ait-body-cell")
      ].join(" ")}
      colSpan={props.initialData.colSpan}
      rowSpan={props.initialData.rowSpan}
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
            ? (<>
              <div
                className={`ait-options-button ait-options-button-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                onClick={(e) => { onShowOptionClick(AitOptionLocation.rowGroup) }}
              />
              <AsupInternalWindow key="RowGroup" Title={"Row group options"} Visible={showRowGroupOptions} onClose={() => { onCloseOption(AitOptionLocation.rowGroup); }}>
                <AioOptionGroup initialData={props.rowGroupOptions} returnData={props.setRowGroupOptions} />
              </AsupInternalWindow>
            </>)
            : null
        }
        {
          (props.rowOptions)
            ? (<>
              <div
                className={`ait-options-button ait-options-button-row ${buttonState === "hidden" ? "hidden" : ""}`}
                onClick={(e) => { onShowOptionClick(AitOptionLocation.row) }}
              />
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={() => { onCloseOption(AitOptionLocation.row); }}>
                <AioOptionGroup initialData={props.rowOptions} returnData={props.setRowOptions} />
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
          {/* <div className="aiw-body-row">
            <AioString label="Current text:" value={text} setValue={(ret) => { console.log(ret); setText(ret);}} />
          </div> */}
          <AioOptionGroup initialData={options} returnData={(ret) => { setOptions(ret); }} />
        </AsupInternalWindow>

        <AsupInternalEditor
          addStyle={{
            width: "100%",
            height: "100%",
            border: "none"
          }}
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