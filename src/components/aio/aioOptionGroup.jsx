import { useEffect, useState } from "react";
import { AioOptionDefault } from "./aioOptionDefault";

export const AioOptionGroup = ({
  initialData,
  returnData
}) => {
  // Data holder
  const [options, setOptions] = useState(JSON.parse(JSON.stringify(initialData ?? [])));

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
      <div style={{ width: "100%", textAlign: "center" }}>
        <button className={"aio-option-update-button"} onClick={(e) => { returnData(options); }}>Update</button>
      </div>
    </>
  );
}