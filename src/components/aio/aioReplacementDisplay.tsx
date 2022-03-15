import React, { useCallback } from "react";
import { AioReplacement, AioReplacementValue } from "./aioInterface";
import { AioLabel } from "./aioLabel";

/**
 * Properties for AioReplacements
 * @param value AioReplacement list
 * @param setValue update function
 */
interface AioReplacementsProps {
  value: AioReplacement,
  setValue?: (value: AioReplacement) => void,
}

/**
 * Option item for replacements
 * @param props replacement object
 * @returns JSX
 */
export const AioReplacementDisplay = (props: AioReplacementsProps): JSX.Element => {

  /**
   * Update text in a replacement
   * @param newText The new text to insert
   * @param level Level number of the replacement
   */
  const updateText = useCallback((newText: string, level: number) => {
    console.log(`new text`);
    let newRT: [{ level: number, text: string }] = [...props.value.replacementText];

    let i = newRT.findIndex(t => t.level === level);
    if (i >= 0) newRT[i] = { level: level, text: newText };
    else newRT.push({ level: level, text: newText });

    let newReplacement: AioReplacement = {
      replacementText: newRT,
      replacementValues: props.value.replacementValues
    }
    props.setValue!(newReplacement);
  }, [props]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  const updateList = useCallback((newList: string) => {
    console.log(`new list`);
    let newV: AioReplacementValue[] = newList.split("\n").map(v => { return { newText: v }; });
    let newReplacement: AioReplacement = {
      replacementText: props.value.replacementText,
      replacementValues: newV,
    }
    props.setValue!(newReplacement);
  }, [props]);

  return (
    <>
      <AioLabel label={"Replace text"} />
      <div className={"aio-input-holder"}>
        {
          props.value.replacementText.map((r, l) => {
            if (typeof (props.setValue) !== "function") {
              return (<span className={"aio-replaceText"}>{r.level}: {r.text}</span>);
            }
            else {
              return (
                <input
                  key={l}
                  className={"aio-input"}
                  value={r.text ?? ""}
                  type="text"
                  onChange={(e) => updateText(e.currentTarget.value, l)}
                />
              );
            }
          })
        }
        <div>with...</div>
        {
          (typeof (props.setValue) !== "function")
            ?
            <div>{props.value.replacementValues.map(rv => rv.newText).join("\n")}</div>
            :
            <div>
              <textarea
                className={"aio-input"}
                rows={4}
                value={props.value?.replacementValues?.map(rv => rv.newText).join("\n") ?? ""}
                onChange={(e) => updateList(e.currentTarget.value)}
              />
            </div>
        }
      </div>
    </>
  );
}