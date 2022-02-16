import * as React from "react";
import { AioExpander } from "./aioExpander";
import { AioNumber } from "./aioNumber";
import { AioString } from "./aioString";

interface AioPrintItemProps {
  label: string,
  value: any,
  setValue?: (value: any) => void,
};

export const AioPrintItem = (props: AioPrintItemProps): JSX.Element => {

  // Undefined or missing
  if (props.value === undefined || props.value === null) {
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
    );
  }

  switch (typeof (props.value)) {
    // Object, need another expander
    case ("object"):
      return (
        <AioExpander
          label={props.label}
          inputObject={props.value}
          updateObject={(typeof (props.setValue) === "function")
          ?
          (ret: object) => { if (props.setValue) props.setValue(ret); }
          :
          undefined
          }/>
      );

    // Number
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
      );

    // String or default
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
      );
  }
}