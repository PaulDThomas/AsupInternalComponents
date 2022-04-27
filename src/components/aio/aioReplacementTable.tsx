import React, { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from "uuid";
import { assignSubListLevel, fromHtml, toHtml } from '../functions';
import { AioDropSelect } from './aioDropSelect';
import { AioReplacement, AioReplacementText, AioReplacementValue } from './aioInterface';
import { AioReplacementValueDisplay } from './aioReplacementValuesDisplay';

interface AioReplacmentTableProps {
  airid?: string,
  replacementTexts: AioReplacementText[],
  replacementValues: AioReplacementValue[],
  givenName?: string,
  externalName?: string,
  setReplacement: (ret: AioReplacement) => void,
  externalLists?: AioReplacement[],
  dontAskSpace?: boolean,
  dontShowText?: boolean,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementTable = ({ 
  airid, 
  replacementTexts,
  replacementValues,
  givenName,
  externalName,
  setReplacement, 
  externalLists, 
  dontAskSpace, 
  dontShowText 
}: AioReplacmentTableProps): JSX.Element => {

  const availableListNames = useMemo<string[]>(() => {
    let a: string[] = ["with..."];
    let exl: string[] = [];
    externalLists?.map(rep => { if (rep.givenName !== undefined) { exl.push(rep.givenName); }; return true; });
    a.push(...exl.sort((a, b) => a.localeCompare(b)));
    return a;
  }, [externalLists]);

  /** Send back updates */
  const returnData = useCallback((newReplacement: {
    airid?: string,
    replacementTexts?: AioReplacementText[],
    replacementValues?: AioReplacementValue[],
    externalName?: string,
  }) => {
    if (typeof (setReplacement) !== "function") return;
    // Create new object
    let r: AioReplacement = {
      airid: newReplacement.airid ?? airid ?? uuidv4(),
      replacementTexts: newReplacement.replacementTexts ?? replacementTexts,
      replacementValues: newReplacement.replacementValues ?? replacementValues,
      externalName: newReplacement.externalName ?? externalName,
      givenName: givenName,
    }
    // Remove default
    if (r.externalName === "with...") delete (r.externalName);
    // Update existing object
    setReplacement(r);
  }, [airid, externalName, givenName, replacementTexts, replacementValues, setReplacement]);

  /**
   * Update text in a replacement
   * @param newText The new text to insert
   * @param level Level number of the replacement
   */
  const updateText = useCallback((ret: string, i: number) => {
    let newRT: AioReplacementText[] = [...replacementTexts];
    newRT[i].text = ret;
    returnData({ replacementTexts: newRT });
  }, [replacementTexts, returnData]);

  const updateSpaceAfter = useCallback((ret: boolean, i: number) => {
    let newRT: AioReplacementText[] = [...replacementTexts];
    newRT[i].spaceAfter = ret;
    returnData({ replacementTexts: newRT });
  }, [replacementTexts, returnData]);

  const addLevel = useCallback(() => {
    let newRT = [...replacementTexts];
    newRT.push({ text: "", spaceAfter: false });
    let newValues = assignSubListLevel(replacementValues, newRT.length);
    returnData({ replacementTexts: newRT, replacementValues: newValues });
  }, [replacementTexts, replacementValues, returnData]);

  const removeLevel = useCallback(() => {
    let newRT = [...replacementTexts];
    newRT.pop();
    let newValues = assignSubListLevel(replacementValues, newRT.length);
    returnData({ replacementTexts: newRT, replacementValues: newValues });
  }, [replacementTexts, replacementValues, returnData]);

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
        {replacementTexts.map((r, l) =>
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
                      value={fromHtml(r.text) ?? ""}
                      type="text"
                      onChange={(e) => updateText(toHtml(e.currentTarget.value), l)}
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
            {replacementTexts.length > 1 && <div className={"aiox-button aiox-implode"} onClick={removeLevel} />}
            <div className={"aiox-button aiox-explode"} onClick={addLevel} />
          </div>
        </div>
      </div>

      {!dontShowText &&
        <div>
          <AioDropSelect
            value={externalName ?? "with..."}
            availableValues={availableListNames}
            setValue={(ret) => {
              returnData({ externalName: ret });
            }}
          />
        </div>
      }

      {externalName === undefined ?
        <AioReplacementValueDisplay
          values={replacementValues}
          setValues={(ret) => returnData({ replacementValues: assignSubListLevel(ret, replacementTexts.length) })}
          level={0}
        />
        :
        <>
          {externalLists?.find(e => e.givenName === externalName) !== undefined
            ?
            <AioReplacementValueDisplay
              values={externalLists?.find(e => e.givenName === externalName)?.replacementValues}
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