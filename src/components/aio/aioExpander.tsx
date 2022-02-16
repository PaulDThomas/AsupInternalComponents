import * as React from "react";
import { useState } from "react"
import { AioPrintItem } from "./aioPrintItem";

interface AioExpanderProps {
  inputObject: { [key: string]: any },
  updateObject?: (value: any) => void,
};

export const AioExpander = (props: AioExpanderProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!props.inputObject) {
    return (<></>);
  }

  if (!isExpanded) {
    return (
      <span className="aiox closed">
        <div className="aiox-button" onClick={(e) => setIsExpanded(true)} />
        <span className="aiox-value">{Object.values(props.inputObject).join(', ')}</span>
      </span>
    );
  }
  else {
    return (
      <span className="aiox open">
        <div className="aiox-button" onClick={(e) => setIsExpanded(false)} />
        <div className='aiox-table'>
          {Object.keys(props.inputObject).map((k: string) => {
            return (
              <AioPrintItem key={k} label={k} value={props.inputObject[k]} />
            );
          })}
        </div>
      </span>
    );
  }
}