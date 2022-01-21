import { useEffect, useState } from "react";
import { AioOptionDefault } from "./aioOptionDefault";

export const AioOptionGroup = ({ initialData, returnData }) => {
  // Data holder
  const [options, setOptions] = useState(initialData ?? []);

  // Updates to initial data
  useEffect(() => { setOptions(initialData ?? []); }, [initialData]);

  // Send data back
  useEffect(() => {
    if (typeof (returnData) === "function") returnData(options);
  }, [options, returnData]);

  // Update current options from child object
  const updateOption = (ret, i) => {
    console.log(`Updating option ${i} to... ${ret}`);
    const newOptions = [...options];
    newOptions[i].value = ret;
    setOptions(newOptions);
  }

  return (
    <>
      {options.map((k, i) => {
        return (
          <div key={i}>
            <div>
              <span className={"ait-option-label"}>{k.label ?? k.name}: </span>
              <input
                className={"aio-input"}
                value={k.value}
                onChange={(e) => updateOption(e.target.value, i)}
              />
            </div>
            {/* <AioOptionDefault
              key={i}
              initialData={k}
              returnData={(ret) => updateOption(ret, i)}
            /> */}
          </div>
        );
      })}
    </>
  );
}