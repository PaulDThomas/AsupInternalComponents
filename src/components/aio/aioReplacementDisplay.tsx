import structuredClone from "@ungap/structured-clone";
import { objEqual } from "components/ait/processes";
import React, { useCallback, useEffect, useState } from "react";
import { AioReplacement, AioReplacementText, AioReplacementValue } from "./aioInterface";
import { AioLabel } from "./aioLabel";

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
          <ReplacementItem key={i} replacement={repl} setReplacement={(ret) => updateReplacement(ret, i)} />
        )}
      </div>
    </>
  );
}


interface ReplacementItemProps {
  replacement: AioReplacement,
  setReplacement?: (ret: AioReplacement) => void,
}

const ReplacementItem = (props: ReplacementItemProps): JSX.Element => {
  const [values, setValues] = useState(props.replacement.replacementValues.join("\n"));
  const [textArray, setTextArray] = useState(props.replacement.replacementText);
  const [lastSend, setLastSend] = useState<AioReplacement>(structuredClone(props.replacement));

  /** Send back updates */
  useEffect(() => {
    if (typeof (props.setReplacement) !== "function") return;
    let r: AioReplacement = {
      replacementText: textArray,
      replacementValues: values.split("\n").map(v => { return { newText: v } as AioReplacementValue; }),
    }
    let [chkObj, diffs] = objEqual(r, lastSend, `Replacement.join(',')}-`);
    if (!chkObj) {
      console.log(`Return for cell: ${diffs}`);
      props.setReplacement(r);
      setLastSend(structuredClone(r));
    }
  }, [lastSend, props, textArray, values]);

  /**
   * Update text in a replacement
   * @param newText The new text to insert
   * @param level Level number of the replacement
   */
  const updateText = useCallback((ret: string, i: number) => {
    let newRT: AioReplacementText[] = [...props.replacement.replacementText];
    newRT[i].text = ret;
    setTextArray(newRT);
  }, []);

  const updateLevel = useCallback((ret: string, i: number) => {
    let newRT: AioReplacementText[] = [...props.replacement.replacementText];
    newRT[i].level= +ret;
    setTextArray(newRT);
  }, [props.replacement]);



  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <>
      {props.replacement.replacementText.map((r, l) => {
        return (typeof (props.setReplacement) !== "function")
          ?
          <span key={l} className={"aio-replaceText"}>{r.level}: {r.text === "" ? r.text : <em>Nothing</em>}</span>
          :
          <>
            <input 
              key={`l${l}`}
              className="aio-input"
              value={r.level ?? 0}
              type="number"
              onChange={(e) => updateLevel(e.currentTarget.value, l)}
              style={{minWidth:0, width: "31px"}}
            />
            <input
              key={`t${l}`}
              className={"aio-input"}
              value={r.text ?? ""}
              type="text"
              onChange={(e) => updateText(e.currentTarget.value, l)}
              style={{minWidth:0, width: "134px"}}
            />
          </>
      })}
      <div>with...</div>
      {(typeof (props.setReplacement) !== "function")
        ?
        <div> {props.replacement.replacementValues.map(rv => rv.newText).join("\n")}</div>
        :
        <div>
          <textarea
            className={"aio-input"}
            rows={4}
            value={values}
            onChange={(e) => setValues(e.currentTarget.value)}
          />
        </div>
      }
    </>
  );

}