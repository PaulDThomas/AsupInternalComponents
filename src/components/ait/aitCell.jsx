import { set } from "draft-js/lib/EditorState";
import { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { AsupInternalEditor } from '../aie/AsupInternalEditor';

export const AitCell = ({
  initialData = {},
  addStyle,
  returnData,
  type,
  editable = true,
}) => {
  // Data holder
  const [text, setText] = useState(initialData.text);
  const [options, setOptions] = useState(initialData.options);

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

  if (type === "header") {
    return (
      <th
        colSpan={initialData.colSpan}
        rowSpan={initialData.rowSpan}
        style={addStyle}
      >
        <AsupInternalEditor
          addStyle={{ width: "100%", border: "none" }}
          showStyleButtons={false}
          initialText={initialData.originalText}
          textAlignment={"center"}
          returnText={setText}
          editable={editable}
        />
      </th>
    );
  } else {
    return (
      <td
        rowSpan={initialData.rowSpan}
        style={addStyle}
      >
        <AsupInternalEditor
          addStyle={{ width: "100%", border: "none" }}
          showStyleButtons={false}
          initialText={initialData.originalText}
          returnText={setText}
          editable={editable}
          highlightChanges={true}
        />
      </td>
    );
  }
}