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


  const addSubList = useCallback((rv: AioReplacementValue): AioReplacementValue => {
    if (!rv.subList) rv.subList = [{ newText: "" }];
    else rv.subList = rv.subList.map(sub => addSubList(sub));
    return rv;
  }, []);

  const addLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementTexts];
    newRT.push({ level: newRT.length, text: "", spaceAfter: false });
    setTextArray(newRT);

    let newValues = [...props.replacement.replacementValues!.map(rv => addSubList(rv))];
    setValues!(newValues);

  }, [addSubList, props.replacement.replacementTexts, props.replacement.replacementValues]);

  const removeSubList = useCallback((rv: AioReplacementValue): AioReplacementValue => {
    if (rv.subList && rv.subList.map(sub => sub.subList?.length ?? 0).reduce((s, a) => s + a, 0) === 0) {
      return { newText: rv.newText };
    }
    else {
      rv.subList = rv.subList!.map(sub => removeSubList(sub));
      return rv;
    }
  }, []);

  const removeLevel = useCallback(() => {
    let newRT = [...props.replacement.replacementTexts];
    newRT.pop();
    setTextArray(newRT);
    let newValues = [...props.replacement.replacementValues!.map(rv => removeSubList(rv))];
    setValues!(newValues);

  }, [props.replacement.replacementTexts, props.replacement.replacementValues, removeSubList]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: "row" }}>
        {props.replacement.replacementTexts.map((r, l) =>
          <div key={l} style={{ width: "180px", minWidth: "180px" }}>
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label><small>Space after group</small></label>
              <input
                style={{ margin: "6px" }}
                type='checkbox'
                checked={r.spaceAfter}
                onChange={(e) => updateSpaceAfter(e.currentTarget.checked, l)} />
            </div>
          </div>
        )}
        <div>
          <div className="aiox-button-holder" style={{ minWidth: "32px", width: "32px", paddingTop: "6px" }}>
            {props.replacement.replacementTexts.length > 1 && <div className={"aiox-button aiox-implode"} onClick={removeLevel} />}
            <div className={"aiox-button aiox-explode"} onClick={addLevel} />
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