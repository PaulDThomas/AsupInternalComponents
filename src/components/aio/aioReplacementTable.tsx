import { assignSubListLevel } from 'components/functions/assignSubListLevel';
import React, { useCallback, useMemo } from 'react';
import { AioDropSelect } from './aioDropSelect';
import { AioReplacement, AioReplacementText, AioReplacementValue } from './aioInterface';
import { AioReplacementValueDisplay } from './aioReplacementValuesDisplay';

interface AioReplacmentTableProps {
  replacement: AioReplacement,
  setReplacement: (ret: AioReplacement) => void,
  externalLists?: AioReplacement[],
  dontAskSpace?: boolean,
  dontShowText?: boolean,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementTable = ({ replacement, setReplacement, externalLists, dontAskSpace, dontShowText }: AioReplacmentTableProps): JSX.Element => {

  const availableListNames = useMemo<string[]>(() => {
    let a: string[] = ["with..."];
    let exl: string[] = [];
    externalLists?.map(rep => { if (rep.givenName !== undefined) { exl.push(rep.givenName); }; return true; });
    a.push(...exl.sort((a, b) => a.localeCompare(b)));
    return a;
  }, [externalLists]);

  /** Send back updates */
  const returnData = useCallback((newReplacement: {
    replacementTexts?: AioReplacementText[],
    replacementValues?: AioReplacementValue[],
    externalName?: string,
  }) => {
    if (typeof (setReplacement) !== "function") return;
    // Create new object
    let r: AioReplacement = {
      replacementTexts: newReplacement.replacementTexts ?? replacement.replacementTexts,
      replacementValues: newReplacement.replacementValues ?? replacement.replacementValues,
      externalName: newReplacement.externalName ?? replacement.externalName,
      givenName: replacement.givenName,
    }
    // Remove default
    if (r.externalName === "with...") delete (r.externalName);
    // Update existing object
    setReplacement(r);
  }, [replacement.externalName, replacement.givenName, replacement.replacementTexts, replacement.replacementValues, setReplacement]);

  /**
   * Update text in a replacement
   * @param newText The new text to insert
   * @param level Level number of the replacement
   */
  const updateText = useCallback((ret: string, i: number) => {
    let newRT: AioReplacementText[] = [...replacement.replacementTexts];
    newRT[i].text = ret;
    returnData({ replacementTexts: newRT });
  }, [replacement.replacementTexts, returnData]);

  const updateSpaceAfter = useCallback((ret: boolean, i: number) => {
    let newRT: AioReplacementText[] = [...replacement.replacementTexts];
    newRT[i].spaceAfter = ret;
    returnData({ replacementTexts: newRT });
  }, [replacement.replacementTexts, returnData]);

  const addLevel = useCallback(() => {
    let newRT = [...replacement.replacementTexts];
    newRT.push({ text: "", spaceAfter: false });
    let newValues = assignSubListLevel(replacement.replacementValues, newRT.length);
    returnData({ replacementTexts: newRT, replacementValues: newValues });
  }, [replacement.replacementTexts, replacement.replacementValues, returnData]);

  const removeLevel = useCallback(() => {
    let newRT = [...replacement.replacementTexts];
    newRT.pop();
    let newValues = assignSubListLevel(replacement.replacementValues, newRT.length);
    returnData({ replacementTexts: newRT, replacementValues: newValues });
  }, [replacement.replacementTexts, replacement.replacementValues, returnData]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: "row",
        height: `${dontShowText ? '2px' : undefined}`
      }}>
        {replacement.replacementTexts.map((r, l) =>
          <div key={l} style={{ width: "180px", minWidth: "180px" }}>
            {!dontShowText &&
              <div>
                {(typeof (setReplacement) !== "function")
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
            {!(dontAskSpace || dontShowText) &&
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
            {replacement.replacementTexts.length > 1 && <div className={"aiox-button aiox-implode"} onClick={removeLevel} />}
            <div className={"aiox-button aiox-explode"} onClick={addLevel} />
          </div>
        </div>
      </div>

      {!dontShowText &&
        <div>
          <AioDropSelect
            value={replacement.externalName ?? "with..."}
            availableValues={availableListNames}
            setValue={(ret) => {
              returnData({ externalName: ret });
            }}
          />
        </div>
      }

      {replacement.externalName === undefined ?
        <AioReplacementValueDisplay
          values={replacement.replacementValues}
          setValues={(ret) => returnData({ replacementValues: assignSubListLevel(ret, replacement.replacementTexts.length) })}
          level={0}
        />
        :
        <>
          {externalLists?.find(e => e.givenName === replacement.externalName) !== undefined
            ?
            <AioReplacementValueDisplay
              values={externalLists?.find(e => e.givenName === replacement.externalName)?.replacementValues}
              level={0}
            />
            :
            <span><em>WARNING: List missing</em></span>
          }
        </>
      }
    </div>
  );
}