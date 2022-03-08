import * as React from "react";

interface AioLabelProps {
  label?: string
}

export const AioLabel = (props: AioLabelProps): JSX.Element => {
  if (props.label === undefined)
    return (<></>);

  return (
    <div className={"aio-label"}>{`${props.label}${props.label ? ":" : ""}`}</div>
  );
}