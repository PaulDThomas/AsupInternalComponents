import React, { useEffect, useState } from "react";
import { AioLabel } from "./aioLabel";

interface AioNumberProps {
  value: number,
  label?: string,
  setValue?: (value: number) => void,
}

export const AioNumber = (props: AioNumberProps): JSX.Element => {

  const [value, setValue] = useState<number>(props.value ?? 0);
  useEffect(() => { setValue(props.value ?? 0)} , [props.value]);

  return (
    <>
      <AioLabel label={props.label} />
      <div className={"aio-input-holder"}>
        {(typeof (props.setValue) !== "function")
          ?
          <span>{props.value}</span>
          :
          <input
            className={"aio-input"}
            value={value}
            type={"number"}
            onChange={e => setValue(parseFloat(e.currentTarget.value))}
            onBlur={_ => props.setValue!(value)}
          />
        }
      </div>
    </>
  );
}