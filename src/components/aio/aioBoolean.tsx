import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioBooleanProps {
  id: string;
  value: boolean;
  label?: string;
  setValue?: (value: boolean) => void;
}

export const AioBoolean = (props: AioBooleanProps): JSX.Element => {
  return (
    <>
      <AioLabel
        id={`${props.id}-label`}
        label={props.label}
      />
      <div className={"aio-input-holder"}>
        {typeof props.setValue !== "function" ? (
          <span id={props.id}>{props.value}</span>
        ) : (
          <input
            id={props.id}
            className={"aio-input-checkbox"}
            checked={props.value}
            type={"checkbox"}
            onChange={
              typeof props.setValue === "function"
                ? (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (props.setValue) props.setValue(e.currentTarget.checked);
                  }
                : undefined
            }
          />
        )}
      </div>
    </>
  );
};

AioBoolean.displayName = "AioBoolean";
