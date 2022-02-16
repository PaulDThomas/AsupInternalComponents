import * as React from "react";
import { AioExpander } from "./aioExpander";
import { AioNumber } from "./aioNumber";
import { AioString } from "./aioString";

interface AioPrintItemProps {
  id: string,
  value: any,
  label?: string,
  setValue?: (value: any) => void,
  moveUp?: () => void,
  moveDown?: () => void,
  addItem?: () => void,
  removeItem?: () => void,
};

const renderLineItem = (value: any, label?: string, setValue?: (value: any) => void) => {

  // Treat undefined or null as a string
  if (value === undefined || value === null) value = "";

  switch (typeof (value)) {
    // Object, need another expander
    case ("object"):
      return (
        <AioExpander
          label={label}
          inputObject={value}
          updateObject={(typeof (setValue) === "function")
            ?
            (ret: object) => { if (setValue) setValue(ret); }
            :
            undefined
          }
        />
      );

    // Number
    case ("number"):
      return (
        <AioNumber
          label={label}
          value={value}
          setValue={(typeof (setValue) === "function")
            ?
            (ret: number) => { if (setValue) setValue(ret); }
            :
            undefined
          }
        />
      );

    // String or default
    case ("string"):
    default:
      return (
        <AioString
          label={label}
          value={value}
          setValue={(typeof (setValue) === "function")
            ?
            (ret: string) => { if (setValue) setValue(ret); }
            :
            undefined
          }
        />
      );
  }
}

export const AioPrintItem = (props: AioPrintItemProps): JSX.Element => {
  return (
    <div className="aio-row">
      <div className="aiox-button-holder">
        {typeof (props.moveUp) === "function"
          ? <div className="aiox-button aiox-up" onClick={props.moveUp} />
          : typeof (props.moveDown) === "function"
            ? <div className="aiox-button" style={{ margin: 0 }} />
            : <></>
        }
        {typeof (props.addItem) === "function" ? <div className="aiox-button aiox-plus" onClick={props.addItem} /> : <></>}
        {typeof (props.removeItem) === "function" ? <div className="aiox-button aiox-minus" onClick={props.removeItem} /> : <></>}
        {typeof (props.moveDown) === "function" ? <div className="aiox-button aiox-down" onClick={props.moveDown} /> : ""}
      </div>
      {renderLineItem(props.value, props.label, props.setValue)}
    </div>
  );
}
