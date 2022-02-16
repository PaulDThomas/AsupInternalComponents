import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioNumberProps {
  value: number,
  label?: string,
  setValue?: (value: number) => void,
}

export const AioNumber = (props: AioNumberProps): JSX.Element => {
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
            value={props.value}
            type={"number"}
            onChange={typeof (props.setValue) === "function"
              ?
              (e: React.ChangeEvent<HTMLInputElement>) => { if (props.setValue) props.setValue(parseFloat(e.currentTarget.value)); }
              :
              undefined
            }
          />
        }
      </div>
    </>
  );
}