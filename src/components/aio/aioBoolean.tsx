import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioBooleanProps {
  value: boolean,
  label?: string,
  setValue?: (value: boolean) => void,
}

export const AioBoolean = (props: AioBooleanProps): JSX.Element => {
  return (
    <>
      <AioLabel label={props.label} />
      <div className={"aio-input-holder"}>
        {(typeof (props.setValue) !== "function")
          ?
          <span>{props.value}</span>
          :
          <input
            className={"aio-input-checkbox"}
            checked={props.value}
            type={"checkbox"}
            onChange={typeof (props.setValue) === "function"
              ?
              (e: React.ChangeEvent<HTMLInputElement>) => { if (props.setValue) props.setValue(e.currentTarget.checked); }
              :
              undefined
            }
          />
        }
      </div>
    </>
  );
}