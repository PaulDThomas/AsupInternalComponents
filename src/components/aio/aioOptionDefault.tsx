import { useState } from "react";
import { useEffect } from "react/cjs/react.development";


export const AioOptionDefault = ({
  initialData,
  returnData
}) => {
  // Data holder
  const [currentValue, setCurrentValue] = useState(initialData.value ?? "");

  // Updates to initial data
  // useEffect(() => { setRows(initialData.rows ?? []); }, [initialData.rows]);
  // useEffect(() => { setOptions(initialData.options ?? {}); }, [initialData.options]);

  // Send data back
  useEffect(() => {
    const r = { value: currentValue, ...initialData }
    if (typeof (returnData) === "function") returnData(r);
  }, [returnData, currentValue, initialData]);

  return (
    <div>
      <span className={"aio-label"}>{initialData.label ?? initialData.name}: </span>
      <div className={"aio-input-holder"}>
        <input
          className={"aio-input"}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      </div>
    </div>
  );
}