import React, { useCallback } from "react";
import "./aio.css";
import { AioOption } from "./interface";
import { AioLabel } from "./aioLabel";
import { AioPrintOption } from "./aioPrintOption";

interface AioOptionDisplayProps {
  id: string;
  options?: AioOption[];
  setOptions?: (ret: AioOption[]) => void;
}

export const AioOptionDisplay = ({
  id,
  options,
  setOptions,
}: AioOptionDisplayProps): JSX.Element => {
  // Update current options from child object
  const updateOption = useCallback(
    (ret: AioOption, i: number) => {
      if (typeof setOptions !== "function") return;
      const newOptions = [...(options ?? [])];
      (newOptions[i].value as AioOption) = ret;
      setOptions(newOptions);
    },
    [options, setOptions],
  );

  if (options === undefined)
    return (
      <div className="aio-body-row">
        <AioLabel
          id={`${id}-label`}
          label="No options deinfed"
        />
      </div>
    );

  return (
    <>
      {options?.map((option, i) => {
        return (
          <div
            className="aio-body-row"
            key={i}
          >
            <AioPrintOption
              id={`${id}-${option.optionName as string}`}
              label={(option.label ?? option.optionName) as string}
              value={option.value}
              setValue={
                !option.readOnly
                  ? (ret: AioOption) => {
                      updateOption(ret, i);
                    }
                  : undefined
              }
              type={option.type}
              availablValues={option.availableValues}
            />
          </div>
        );
      })}
    </>
  );
};

AioOptionDisplay.displayName = "AioOptionDisplay";
