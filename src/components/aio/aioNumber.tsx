import React, { useEffect, useState } from "react";
import { AioLabel } from "./aioLabel";

interface AioNumberProps {
  id: string;
  value: number;
  label?: string;
  setValue?: (value: number) => void;
  step?: number;
  minValue?: number;
  maxValue?: number;
}

export const AioNumber = (props: AioNumberProps): JSX.Element => {
  const [value, setValue] = useState<number>(props.value ?? 0);
  useEffect(() => {
    setValue(
      Math.max(props.minValue ?? -Infinity, Math.min(props.maxValue ?? Infinity, props.value)) ??
        props.minValue ??
        0,
    );
  }, [props.maxValue, props.minValue, props.value]);

  return (
    <>
      <AioLabel
        id={`${props.id}-label`}
        label={props.label}
      />
      <div className={"aio-input-holder"}>
        {typeof props.setValue !== "function" ? (
          <span>{props.value}</span>
        ) : (
          <input
            id={props.id}
            className={"aio-input"}
            value={value}
            type={"number"}
            onChange={(e) => setValue(parseFloat(e.currentTarget.value))}
            onBlur={() => {
              if (props.setValue !== undefined) props.setValue(value);
            }}
            step={props.step}
            min={props.minValue}
            max={props.maxValue}
          />
        )}
      </div>
    </>
  );
};
