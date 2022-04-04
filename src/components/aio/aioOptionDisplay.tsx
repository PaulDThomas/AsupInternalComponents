import React, { useCallback } from "react";
import "./aio.css";
import { AioOption, AioOptionGroup } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioPrintOption } from "./aioPrintOption";

interface AioOptionDisplayProps {
  options?: AioOptionGroup,
  setOptions?: (ret: AioOptionGroup) => void,
  buttonText?: string,
}

export const AioOptionDisplay = (props: AioOptionDisplayProps): JSX.Element => {

  // Update current options from child object
  const updateOption = useCallback((ret: AioOption, i: number) => {
    if (typeof (props.setOptions) !== "function") return;
    const newOptions = [...props.options!];
    newOptions[i].value = ret;
    props.setOptions!(newOptions);
  }, [props.options, props.setOptions]);

  if (props.options === undefined) return <div className='aio-body-row'><AioLabel label="No options deinfed" /></div>;

  return (
    <>
      {props.options!.map((option, i) => {
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