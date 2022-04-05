import structuredClone from '@ungap/structured-clone';
import { assignSubListLevel } from 'components/functions/assignSubListLevel';
import { objEqual } from 'components/functions/objEqual';
import React, { useCallback, useEffect, useState } from 'react';
import { AioReplacement, AioReplacementText, AioReplacementValue } from './aioInterface';
import { AioReplacementValueDisplay } from './aioReplacementValuesDisplay';

interface AioReplacmentTableProps {
  replacement: AioReplacement,
  setReplacement: (ret: AioReplacement) => void,
  dontAskSpace?: boolean,
  dontShowText?: boolean,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementTable = (props: AioReplacmentTableProps): JSX.Element => {

  const [values, setValues] = useState<AioReplacementValue[]>(props.replacement.replacementValues);
  const [textArray, setTextArray] = useState(props.replacement.replacementTexts);
  const [lastSend, setLastSend] = useState<AioReplacement>(structuredClone(props.replacement));

  /** Send back updates */
  useEffect(() => {
    if (typeof (props.setReplacement) !== "function") return;
    let r: AioReplacement = {
      replacementTexts: textArray,
      replacementValues: values,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [chkObj, diffs] = objEqual(r, lastSend, `Replacement.join(',')}-`);
    if (!chkObj) {
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
    let newRT: AioReplacementText[] = [...props.replacement.replacementTexts];
    newRT[i].text = ret;
    setTextArray(newRT);
  }, [props.replacement.replacementTexts]);

  const updateSpaceAfter = useCallback((ret: boolean, i: number) => {
    let newRT: AioReplacementText[] = [...props.replacement.replacementTexts];
    newRT[i].spaceAfter = ret;
    setTextArray(newRT);
  }, [props.replacement.replacementTexts]);

  const addLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementTexts];
    newRT.push({ text: "", spaceAfter: false });
    setTextArray(newRT);
    let newValues = assignSubListLevel(props.replacement.replacementValues, newRT.length);
    setValues!(newValues);
  }, [props.replacement.replacementTexts, props.replacement.replacementValues]);

  const removeLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementTexts];
    newRT.pop();
    setTextArray(newRT);
    let newValues = assignSubListLevel(props.replacement.replacementValues, newRT.length);
    setValues!(newValues);
  }, [props.replacement.replacementTexts, props.replacement.replacementValues]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        flexDirection: "row" ,
        height: `${props.dontShowText ? '2px' : undefined}`
        }}>
        {props.replacement.replacementTexts.map((r, l) =>
          <div key={l} style={{ width: "180px", minWidth: "180px" }}>
            {!props.dontShowText &&
              <div>
                {(typeof (props.setReplacement) !== "function")
                  ?
                  <span key={l} className={"aio-replaceText"}>{r.text === "" ? r.text : <em>Nothing</em>}</span>
                  :
                  <>
                    <input
                      key={`t${l}`}
                      className={"aio-input"}
                      value={r.text ?? ""}
                      type="text"
                      onChange={(e) => updateText(e.currentTarget.value, l)}
                      style={{ minWidth: 0, width: "170px" }}
                    />
                  </>
                }
              </div>
            }
            {!(props.dontAskSpace || props.dontShowText) &&
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <label><small>Space after group</small></label>
                <input
                  style={{ margin: "6px" }}
                  type='checkbox'
                  checked={r.spaceAfter}
                  onChange={(e) => updateSpaceAfter(e.currentTarget.checked, l)} />
              </div>
            }
          </div>
        )}
        <div>
          <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px", paddingTop: "6px" }}>
            {props.replacement.replacementTexts.length > 1 && <div className={"aiox-button aiox-implode"} onClick={removeLevel} />}
            <div className={"aiox-button aiox-explode"} onClick={addLevel} />
          </div>
        </div>
      </div>

      {!props.dontShowText && <div>with...</div>}

      <AioReplacementValueDisplay
        values={props.replacement.replacementValues}
        setValues={(ret) => setValues(assignSubListLevel(ret, textArray.length))}
        level={0}
      />
    </div>
  );
}