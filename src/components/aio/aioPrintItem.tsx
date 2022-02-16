import * as React from "react";
import { AioNumber } from "./aioNumber";
import { AioString } from "./aioString";

interface AioPrintItemProps {
  label: string,
  value: any,
  setValue?: (value: any) => void,
};

export const AioPrintItem = (props: AioPrintItemProps): JSX.Element => {
  if (props.value === undefined || props.value === null) {
    return (<></>);
  }

  switch (typeof (props.value)) {
    case ("number"):
      return (
        <AioNumber
          label={props.label}
          value={props.value}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: number) => { if (props.setValue) props.setValue(ret); }
            :
            undefined
          } />
      )

    case ("string"):
    default:
      return (
        <AioString
          label={props.label}
          value={props.value}
          setValue={(typeof (props.setValue) === "function")
            ?
            (ret: string) => { if (props.setValue) props.setValue(ret); }
            :
            undefined
          } />
      )
  }
}