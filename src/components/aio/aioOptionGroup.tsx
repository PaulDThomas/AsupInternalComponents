import React, { useEffect, useRef, useState } from "react";
import { Option, OptionGroup } from "./aioInterface";
import { AioPrintOption } from "./aioPrintOption";
import "./aio.css";

interface AioOptionGroupProps {
  initialData: OptionGroup,
  returnData?: (ret: OptionGroup) => void,
  buttonText?: string,
}

export const AioOptionGroup = (props: AioOptionGroupProps): JSX.Element => {

  // Data holder
  const [options, setOptions] = useState((props.initialData ?? []).map(a => { return { ...a } }));
  const originalOptions = useRef((props.initialData ?? []).map(a => { return { ...a } }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [buttonText] = useState(props.buttonText ?? "Update");

  // Update on a load...
  useEffect(() => {
    var newDataCheck = false;
    for (let i in props.initialData) {
      if (JSON.stringify(props.initialData[i]) !== JSON.stringify(originalOptions.current[i])) {
        newDataCheck = true;
        //console.log("Found new data");
      }
    }
    if (newDataCheck) {
      // console.log("Initial data update");
      setOptions((props.initialData ?? []).map(a => { return { ...a } }));
      originalOptions.current = (props.initialData ?? []).map(a => { return { ...a } });
    }
  }, [props.initialData]);

  // Update current options from child object
  const updateOption = (ret: Option, i: number) => {
    // console.log(`Updating option ${i} to... ${ret}`);
    const newOptions = [...options];
    newOptions[i].value = ret;
    setOptions(newOptions);
  };

  return (
    <>
      {options.map((option, i) => {
        return (
          <div className='aio-body-row' key={i}>
            <AioPrintOption
              id={option.optionName as string}
              label={(option.label ?? option.optionName) as string}
              value={option.value}
              setValue={(ret: Option) => { updateOption(ret, i) }}
              type={option.type}
              availablValues={option.availableValues}
            />
          </div>
        );
      })}
      <div style={{ width: "100%", textAlign: "center" }}>
        <button className={"aio-update-button"} onClick={(e: React.MouseEvent<Element, MouseEvent>) => { if (typeof (props.returnData) === "function") props.returnData(options); }}>{buttonText}</button>
      </div>
    </>
  );
}