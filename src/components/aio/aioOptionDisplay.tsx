import React from "react";
import { AioOption, AioOptionGroup } from "./aioInterface";
import { AioPrintOption } from "./aioPrintOption";
import "./aio.css";

interface AioOptionDisplayProps {
  initialData: AioOptionGroup,
  returnData?: (ret: AioOptionGroup) => void,
  buttonText?: string,
}

export const AioOptionDisplay = (props: AioOptionDisplayProps): JSX.Element => {

  // Update current options from child object
  const updateOption = (ret: AioOption, i: number) => {
    if (typeof (props.returnData) !== "function") return;
    // console.log(`Updating option ${i} to... ${ret}`);
    const newOptions = [...props.initialData];
    newOptions[i].value = ret;
    props.returnData!(newOptions);
  };

  return (
    <>
      {props.initialData.map((option, i) => {
        return (
          <div className='aio-body-row' key={i}>
            <AioPrintOption
              id={option.optionName as string}
              label={(option.label ?? option.optionName) as string}
              value={option.value}
              setValue={!option.readOnly ? (ret: AioOption) => { updateOption(ret, i) } : undefined}
              type={option.type}
              availablValues={option.availableValues}
            />
          </div>
        );
      })}
    </>
  );
}