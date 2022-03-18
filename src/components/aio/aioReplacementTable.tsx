import React, { useState, useCallback, useEffect } from 'react';
import structuredClone from '@ungap/structured-clone';
import { objEqual } from 'components/ait/processes';
import { AioReplacement, AioReplacementText, AioReplacementValue } from './aioInterface';
import { AioReplacementValueDisplay } from './aioReplacementValuesDisplay';

interface AioReplacmentTableProps {
  replacement: AioReplacement,
  setReplacement: (ret: AioReplacement) => void,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementTable = (props: AioReplacmentTableProps): JSX.Element => {

  const [values, setValues] = useState<AioReplacementValue[]>(props.replacement.replacementValues);
  const [textArray, setTextArray] = useState(props.replacement.replacementText);
  const [lastSend, setLastSend] = useState<AioReplacement>(structuredClone(props.replacement));

  /** Send back updates */
  useEffect(() => {
    if (typeof (props.setReplacement) !== "function") return;
    let r: AioReplacement = {
      replacementText: textArray,
      replacementValues: values,
    }
    let [chkObj, diffs] = objEqual(r, lastSend, `Replacement.join(',')}-`);
    if (!chkObj) {
      console.log(`Return for replacement: ${diffs}`);
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
  }, [props.replacement.replacementText]);

  const addLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementText];
    newRT.push({ level: newRT.length, text: "" });
    setTextArray(newRT);

  }, [props.replacement.replacementText]);

  const removeLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementText];
    newRT.pop();
    setTextArray(newRT);
  }, [props.replacement.replacementText]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div>
        <div style={{display:'flex', flexDirection:"row"}}>
          {props.replacement.replacementText.map((r, l) =>
            <div key={l} style={{ width: "180px", minWidth: "180px" }}>
              {(typeof (props.setReplacement) !== "function")
                ?
                <span key={l} className={"aio-replaceText"}>{r.level}: {r.text === "" ? r.text : <em>Nothing</em>}</span>
                :
                <>
                  <span style={{ minWidth: "26px", width: "26px", display: "inline-block", textAlign: "right", paddingRight: "4px" }}>{r.level + 1}</span>
                  <input
                    key={`t${l}`}
                    className={"aio-input"}
                    value={r.text ?? ""}
                    type="text"
                    onChange={(e) => updateText(e.currentTarget.value, l)}
                    style={{ minWidth: 0, width: "140px" }}
                  />
                </>
              }
            </div>
          )}
          <div>
            <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px", paddingTop: "6px" }}>
              {props.replacement.replacementText.length > 1 && <div className={"aiox-button aiox-minus"} onClick={removeLevel} />}
              <div className={"aiox-button aiox-plus"} onClick={addLevel} />
            </div>
          </div>
        </div>

        <div>with...</div>

        <AioReplacementValueDisplay
          values={props.replacement.replacementValues}
          setValues={(ret) => setValues(ret)}
          level={0}
        />
    </div>
  );
}