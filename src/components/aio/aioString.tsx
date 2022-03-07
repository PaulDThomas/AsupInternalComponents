import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioStringProps {
  label?: string,
  value?: string,
  setValue?: (value: string) => void,
}

export const AioString = (props: AioStringProps): JSX.Element => {
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
            value={props.value ?? ""}
            type="text"
            onChange={typeof (props.setValue) === "function"
              ?
              (e: React.ChangeEvent<HTMLInputElement>) => { if (props.setValue) props.setValue(e.currentTarget.value); }
              :
              undefined
            }
          />
        }
      </div>
    </>
  );
}