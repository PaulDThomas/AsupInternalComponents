import * as React from "react";

interface AioStringProps {
  label: string,
  value: string,
  setValue?: (value: string) => void,
}

export const AioString = (props: AioStringProps): JSX.Element => {
  return (
    <div className='aio-row'>
      <div className={"aio-label"}>{props.label}: </div>
      <div className={"aio-input-holder"}>
        {(typeof (props.setValue) !== "function")
          ?
          <span>{props.value}</span>
          :
          <input
            readOnly={typeof props.setValue !== "function"}
            className={"aio-input"}
            value={props.value}
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
    </div>
  );
}