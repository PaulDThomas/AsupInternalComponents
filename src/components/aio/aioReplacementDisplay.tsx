import React, { useCallback } from "react";
import { AioReplacement } from "./aioInterface";
import { AioLabel } from "./aioLabel";
import { AioReplacementTable } from "./aioReplacementTable";

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioReplacementsProps {
  value: AioReplacement[],
  setValue?: (value: AioReplacement[]) => void,
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementDisplay = (props: AioReplacementsProps): JSX.Element => {

  /** Update individual replacement and send it back */
  const updateReplacement = useCallback((ret: AioReplacement, i: number) => {
    let newValue = [...props.value];
    newValue[i] = ret;
    if (typeof (props.setValue) === "function") props.setValue(newValue);
  }, [props]);

  return (
    <>
      <AioLabel label={"Replace text"} />
      <div className={"aio-input-holder"}>
        {(props.value ?? []).map((repl, i) =>
          <AioReplacementTable 
            key={i} 
            replacement={repl} 
            setReplacement={(ret) => updateReplacement(ret, i)} 
            />
        )}
      </div>
    </>
  );
}