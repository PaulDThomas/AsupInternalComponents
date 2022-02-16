import * as React from "react";

interface AioLabelProps {
  label?: string
}

export const AioLabel = (props: AioLabelProps): JSX.Element => {
  if (props.label === undefined)
    return (<></>);

  return (
    <div className={"aio-label"}>{
      // props.label === "!!grip!!"
      //   ? <button className="aiox-button aiox-list"></button>
      //   : props.label === "!!updown!!"
      //     ? (
      //       <div className="aiox-button-stack">
      //         <button className="aiox-button aiox-up"></button>
      //         <button className="aiox-button aiox-down"></button>
      //       </div>
      //     )
      //     : 
      `${props.label}${props.label ? ":" : ""}`
    }</div>
  );
}