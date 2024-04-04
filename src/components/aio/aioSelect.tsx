import * as React from "react";
import { AioLabel } from "./aioLabel";

interface AioSelectProps {
  id: string;
  label?: string;
  value?: string;
  availableValues?: Array<string>;
  setValue?: (value: string) => void;
}

export const AioSelect = (props: AioSelectProps): JSX.Element => {
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
          <select
            id={props.id}
            className={"aio-select"}
            value={props.value ?? ""}
            onChange={
              typeof props.setValue === "function"
                ? (e: React.ChangeEvent<HTMLSelectElement>) => {
                    if (props.setValue) props.setValue(e.currentTarget.value);
                  }
                : undefined
            }
          >
            {props.availableValues &&
              props.availableValues.map((v: string, i: number) => {
                return (
                  <option
                    key={i}
                    value={v}
                  >
                    {v}
                  </option>
                );
              })}
          </select>
        )}
      </div>
    </>
  );
};
