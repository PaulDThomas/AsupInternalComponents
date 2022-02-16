import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AioPrintOption } from "./aioPrintOption";
import { Option, OptionGroup } from "./aioInterface";

import "./aio.css";

interface AioOptionGroupProps {
  initialData: OptionGroup,
  returnData: (ret: OptionGroup) => void,
}

export const AioOptionGroup = ( props: AioOptionGroupProps): JSX.Element => {

  // Data holder
  const [options, setOptions] = useState((props.initialData ?? []).map(a => { return { ...a } }));
  const originalOptions = useRef((props.initialData ?? []).map(a => { return { ...a } }));

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
      {options.map((k, i) => {
        return (
          <div className='aiw-body-row' key={i}>
            <AioPrintOption option={k} updateOption={(ret) => { updateOption(ret, i) }} />
          </div>
        );
      })}
      <div style={{ width: "100%", textAlign: "center" }}>
        <button className={"aio-update-button"} onClick={(e: React.MouseEvent<Element, MouseEvent>) => { props.returnData(options); }}>Update</button>
      </div>
    </>
  );
}