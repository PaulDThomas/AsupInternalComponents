import * as React from "react";

interface AioLabelProps {
  id: string;
  label?: string;
  noColon?: boolean;
  htmlFor?: string;
}

export const AioLabel = (props: AioLabelProps): JSX.Element => {
  if (props.label === undefined) return <></>;

  return (
    <label
      id={props.id}
      className={"aio-label"}
      htmlFor={props.htmlFor}
    >{`${props.label}${!props.noColon && props.label ? ":" : ""}`}</label>
  );
};

AioLabel.displayName = "AioLabel";
