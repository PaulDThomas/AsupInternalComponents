import * as React from "react";
import { useState } from "react"
import { AioPrintItem } from "./aioPrintItem";
import { AioLabel } from "./aioLabel";
import { AioArraySortable } from "./aioArraySortable";

interface AioExpanderProps {
  inputObject: { [key: string]: any },
  label?: string,
  updateObject?: (value: any) => void,
};

export const AioExpander = (props: AioExpanderProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!props.inputObject) {
    return (<></>);
  }

  if (!isExpanded) {
    return (
      <>
        <AioLabel label={props.label} />
        <div className="aio-input-holder">
          <span className="aiox closed">
            <div className="aiox-button" onClick={(e) => setIsExpanded(true)} />
            <span className="aiox-value">{
              Array.isArray(props.inputObject) ?
                Object.values(props.inputObject).filter(el => typeof (el) === "object").length > 0
                  ? `${props.inputObject.length} item${props.inputObject.length !== 1 ? "s" : ""}`
                  : Object.values(props.inputObject).join(", ")
                : Object.keys(props.inputObject)
                  .map((a: string) => { return typeof (props.inputObject[a]) === "object" ? a : props.inputObject[a]; })
                  .join(", ")
            }</span>
          </span>
        </div>
      </>
    );
  }
  else {
    return (
      <>
        <AioLabel label={props.label} />
        <div className="aio-input-holder">
          <span className="aiox open">
            <div className="aiox-button" onClick={(e) => setIsExpanded(false)} />
            <div className="aiox-table">{
              Array.isArray(props.inputObject) ?
                <AioArraySortable
                  inputArray={props.inputObject}
                  updateArray={props.updateObject}
                />
                : Object.keys(props.inputObject).map((k: string, i: number) => {
                  return (
                    <AioPrintItem
                      key={k}
                      id={k}
                      label={k}
                      value={props.inputObject[k]}
                      setValue={
                        (props.updateObject) ? (ret) => {
                          const newObject = { ...props.inputObject };
                          newObject[k] = ret;
                          if (props.updateObject) props.updateObject(newObject);
                        } : undefined
                      }
                    />
                  );
                })
            }</div>
          </span>
        </div>
      </>
    );
  }
}