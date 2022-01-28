import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { AsupInternalEditor } from '../aie/AsupInternalEditor';
import { AsupInternalWindow } from "../aiw/AsupInternalWindow";
import { AioOptionGroup } from "../aio/aioOptionGroup";

export const AitCell = ({
  initialData = {},
  location,
  returnData,
  showCellBorders = false,
  type,
  editable = true,
  // onCellClick,
  rowGroupOptions,
  setRowGroupOptions,
  rowOptions,
  setRowOptions,
}) => {
  // Data holder
  const [text, setText] = useState(initialData.text);
  const [options, setOptions] = useState(initialData.options ?? []);
  const [buttonState, setButtonState] = useState("hidden");

  const [showRowGroupOptions, setShowRowGroupOptions] = useState(false);
  const [showRowOptions, setShowRowOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);

  const [cellStyle, setCellStyle] = useState();

  // Updates to initial data
  useEffect(() => { setText(initialData.text); }, [initialData.text]);
  // Ensure all options are present
  useEffect(() => {
    console.log(`Setting intial cell options, found ${initialData.options.length}`);
    const newOptions = [
      {
        name: "cellWidth",
        label: "Minimum width",
        value: initialData.options.reduce((cellWidth, o) => cellWidth ?? (o.name === "cellWidth" ? o.value : null), null) ?? "120px"
      },
      // {
      //   name: "originalText",
      //   label: "Original text",
      //   editable: false,
      //   value: initialData.originalText
      // },
    ];
    setOptions(newOptions);
  }, [initialData.options, initialData.originalText]);

  // Update cell style when options change
  useEffect(() => {
    console.log("Setting cell style in aitCell");
    const style = {
      width: options.reduce((cellWidth, o) => cellWidth ?? (o.name === "cellWidth" ? o.value : null), null),
      border: showCellBorders ? "1px dashed burlywood" : ""
    }
    setCellStyle(style);
  }, [options, showCellBorders]);

  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
    console.log("returnData in aitCell");
    const r = {
      originalText: initialData.originalText,
      options: options ?? [],
      text: text ?? "",
      colSpan: initialData.colSpan ?? 1,
      rowSpan: initialData.rowSpan ?? 1,
    }
    if (typeof (returnData) === "function") returnData(r);
  }, [initialData, options, returnData, text]);

  // Show hide/buttons
  // Show or hide style buttons
  const aitShowButtons = () => { setButtonState(""); };
  const aitHideButtons = () => { setButtonState("hidden"); };

  // Show windows
  const onShowOptionClick = (optionType) => {
    console.log(`Show option click in aieCell for ${optionType}`);
    switch (optionType) {
      case ("rowGroup"): setShowRowGroupOptions(true); break;
      case ("row"): setShowRowOptions(true); break;
      case ("cell"): setShowCellOptions(true); break;
      default: break;
    }
  }
  // Hide windows
  const onCloseOption = (optionType) => {
    console.log(`Hide option click in aieCell for ${optionType}`);
    switch (optionType) {
      case ("rowGroup"): setShowRowGroupOptions(false); break;
      case ("row"): setShowRowOptions(false); break;
      case ("cell"): setShowCellOptions(false); break;
      default: break;
    }
  }


  // Render element
  return (
    <td
      className={["ait-cell", (type === "header" ? "ait-header-cell" : type === "rowHeader" ? "ait-row-header-cell" : "ait-body-cell")].join(" ")}
      colSpan={initialData.colSpan}
      rowSpan={initialData.rowSpan}
      onMouseOver={aitShowButtons}
      onMouseLeave={aitHideButtons}
      style={cellStyle}
      data-location-table-section={location.tableSection}
      data-location-row-group={location.rowGroup}
      data-location-row={location.row}
      data-location-cell={location.cell}
    >
      <div className="ait-aie-holder"
      >

        {
          (rowGroupOptions)
            ? (<>
              <div
                className={`ait-options-button ait-options-button-row-group ${buttonState === "hidden" ? "hidden" : ""}`}
                onClick={(e) => { onShowOptionClick("rowGroup") }}
              />
              <AsupInternalWindow key="RowGroup" Title={"Row group options"} Visible={showRowGroupOptions} onClose={(e) => { onCloseOption("rowGroup"); }}>
                <AioOptionGroup initialData={rowGroupOptions} returnData={setRowGroupOptions} />
              </AsupInternalWindow>
            </>)
            : null
        }
        {
          (rowOptions)
            ? (<>
              <div
                className={`ait-options-button ait-options-button-row ${buttonState === "hidden" ? "hidden" : ""}`}
                onClick={(e) => { onShowOptionClick("row") }}
              />
              <AsupInternalWindow key="Row" Title={"Row options"} Visible={showRowOptions} onClose={(e) => { onCloseOption("row"); }}>
                <AioOptionGroup initialData={rowOptions} returnData={setRowOptions} />
              </AsupInternalWindow>
            </>)
            : null
        }

        <div
          className={`ait-options-button ait-options-button-cell ${buttonState === "hidden" ? "hidden" : ""}`}
          onClick={(e) => { onShowOptionClick("cell") }}
        >
        </div>
        <AsupInternalWindow key="Cell" Title={"Cell options"} Visible={showCellOptions} onClose={(e) => { onCloseOption("cell"); }}>
          <AioOptionGroup initialData={options} returnData={(ret) => {
            console.log("Received cell options");
            setOptions(ret);
          }}
          />
        </AsupInternalWindow>

        <AsupInternalEditor
          addStyle={{
            width: "100%",
            height: "100%",
            border: "none"
          }}
          textAlignment={(type === "rowHeader" ? "left" : "center")}
          showStyleButtons={false}
          initialText={initialData.originalText}
          returnText={setText}
          editable={editable}
          highlightChanges={true}
        />
      </div>
    </td>
  );
}