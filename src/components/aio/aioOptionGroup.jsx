import { useState } from "react";
import { AioString } from "./aioString";

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

  const getOptionType = (option, i) => {
    switch (option.type) {
      case ("string"): 
      default:
      return (
        <AioString
         Label={option.label ?? option.name}
         Value={option.value}
         SetValue={(ret) => updateOption(ret, i)}
        />
        )
    }
  }

  return (
    <>
      {options.map((k, i) => {
        return (
          <div key={i}>
            {getOptionType(k, i)}
          </div>
        );
      })}
      <div style={{ width: "100%", textAlign: "center" }}>
        <button className={"aio-option-update-button"} onClick={(e) => { returnData(options); }}>Update</button>
      </div>
    </>
  );
}