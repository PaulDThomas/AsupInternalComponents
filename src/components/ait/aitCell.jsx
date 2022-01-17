import { set } from "draft-js/lib/EditorState";
import { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { AsupInternalEditor } from '../aie/AsupInternalEditor';

export const AitCell = ({
  initialData = {},
  location,
  addStyle,
  returnData,
  type,
  editable = true,
}) => {
  // Data holder
  const [text, setText] = useState(initialData.text);
  const [options, setOptions] = useState(initialData.options ?? {});
  const [buttonState, setButtonState] = useState("hidden");

  // Updates to initial data
  useEffect(() => {
    setText(initialData.text);
    setOptions(initialData.options ?? {});
  }, [initialData]);

  // Send data back
  useEffect(() => {
    // All these parameters should be in the initial data
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

  // Render element
  return (
    <td
      className={["ait-cell", (type === "header" ? "ait-header-cell" : type === "rowHeader" ? "ait-row-header-cell" : "ait-body-cell")].join(" ")}
      colSpan={initialData.colSpan}
      rowSpan={initialData.rowSpan}
      onMouseOver={aitShowButtons}
      onMouseLeave={aitHideButtons}
      style={addStyle}
    >
      <div className="ait-aie-holder"
      >
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
        <div
          className={`ait-options-button ${buttonState === "hidden" ? "hidden" : ""}`}
          onClick={(e) => { console.log(`Cell-Options-Click for ${Object.keys(location).map((k) => `${k}:${location[k]}`).join(", ")}`); }}
        />
      </div>
    </td>
  );
}