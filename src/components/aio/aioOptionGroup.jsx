import { useEffect, useRef, useState } from "react";
import { AioPrintOption } from "./aioPrintOption.tsx";

import "./aio.css";


export const AioOptionGroup = ({
  initialData,
  returnData
}) => {
  // Data holder
  const [options, setOptions] = useState((initialData ?? []).map(a => { return { ...a } }));
  const originalOptions = useRef((initialData ?? []).map(a => { return { ...a } }));

  // Update on a load...
  useEffect(() => {
    var newDataCheck = false;
    for (let i in initialData) {
      if (JSON.stringify(initialData[i]) !== JSON.stringify(originalOptions.current[i])) {
        newDataCheck = true;
        //console.log("Found new data");
      }
    }
    if (newDataCheck) {
      // console.log("Initial data update");
      setOptions((initialData ?? []).map(a => { return { ...a } }));
      originalOptions.current = (initialData ?? []).map(a => { return { ...a } });
    }
  }, [initialData]);

  // Update current options from child object
  const updateOption = (ret, i) => {
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
            {AioPrintOption(k, (ret) => { updateOption(ret, i) })}
          </div>
        );
      })}
      <div style={{ width: "100%", textAlign: "center" }}>
        <button className={"aio-update-button"} onClick={(e) => { returnData(options); }}>Update</button>
        {/* <button className={"aio-option-update-button"} onClick={returnF}>Update</button> */}
        {/* <button className={"aio-option-update-button"} onClick={(e) => { 
          console.log("Returning data from options group");
          console.log(options);

          if (typeof returnData === "function") returnData(options); 
          }}>Update</button> */}
      </div>
    </>
  );
}