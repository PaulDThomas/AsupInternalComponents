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
  replacements: AioReplacement[],
  setReplacements?: (value: AioReplacement[]) => void,
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementDisplay = (props: AioReplacementsProps): JSX.Element => {

  /** Update individual replacement and send it back */
  const updateReplacement = useCallback((ret: AioReplacement, i: number) => {
    let newValue = [...props.replacements];
    newValue[i] = ret;
    if (typeof (props.setReplacements) === "function") props.setReplacements(newValue);
  }, [props]);

  const addReplacement = useCallback(() => {
    let newReplacements = [...props.replacements];
    newReplacements.push({
      replacementText: [{
        level: 0,
        text: "",
      }],
      replacementValues: [{
        newText: "",
      }],
    });
    props.setReplacements!(newReplacements);
  }, [props]);

  const removeReplacement = useCallback(() => {
    let newReplacements = [...props.replacements];
    newReplacements.pop();
    props.setReplacements!(newReplacements);
  }, [props.replacements, props.setReplacements]);

  return (
    <>
      <AioLabel label={"Replace text"} />
      <div className={"aio-input-holder"}>
        {(props.replacements ?? []).map((repl, i) => {
          return (
            <div key={i}>
              {i > 0 && <div> and then...</div>}
              <AioReplacementTable
                replacement={repl}
                setReplacement={(ret) => updateReplacement(ret, i)}
              />
            </div>
          )
        }
        )}
        {typeof props.setReplacements === "function" &&
          <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px" }}>
            <div className={"aiox-button aiox-addDown"} onClick={addReplacement} />
            {props.replacements.length > 0 && <div className={"aiox-button aiox-removeUp"} onClick={removeReplacement} />}
          </div>
        }
      </div>
    </>
  );
}