import React, { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from "uuid";
import { fromHtml, newReplacementValues, toHtml } from '../functions';
import { AioDropSelect } from './aioDropSelect';
import { AioIconButton } from './aioIconButton';
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from './aioInterface';
import { AioReplacementValuesDisplay } from './aioReplacementValuesDisplay';

interface AioReplacmentDisplayProps {
  airid?: string,
  oldText: string,
  newTexts: AioReplacementValues[],
  includeTrailing?: boolean,
  externalName?: string,
  setReplacement?: (ret: AioReplacement) => void,
  externalLists?: AioExternalReplacements[],
  dontAskOptions?: boolean,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementDisplay = ({
  airid,
  oldText,
  newTexts,
  includeTrailing,
  externalName,
  setReplacement,
  externalLists,
  dontAskOptions,
}: AioReplacmentDisplayProps): JSX.Element => {

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
    oldText?: string,
    newTexts?: AioReplacementValues[],
    spaceAfter?: boolean,
    includeTrailing?: boolean,
    externalName?: string,
  }) => {
    if (typeof (setReplacement) !== "function") return;
    // Create new object
    let r: AioReplacement = {
      airid: newReplacement.airid ?? airid ?? uuidv4(),
      oldText: newReplacement.oldText ?? oldText,
      newTexts: newReplacement.newTexts ?? newTexts,
      includeTrailing: newReplacement.includeTrailing ?? includeTrailing,
      externalName: newReplacement.externalName ?? externalName,
    }
    // Remove default
    if (r.externalName === "with...") delete (r.externalName);

    // Update existing object
    setReplacement(r);
  }, [setReplacement, airid, oldText, newTexts, includeTrailing, externalName]);

  const addNewText = useCallback((i: number) => {
    if (typeof setReplacement !== "function") return;
    let nts = [...newTexts];
    nts.splice(i, 0, newReplacementValues());
    returnData({ newTexts: nts });
  }, [newTexts, returnData, setReplacement]);

  const removeNewText = useCallback((i: number) => {
    if (typeof setReplacement !== "function") return;
    let nts = [...newTexts];
    nts.splice(i, 1);
    returnData({ newTexts: nts });
  }, [newTexts, returnData, setReplacement]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div className="aiord-main" style={{
      display: 'flex',
      flexDirection: "column",
      gap: '2px',
      border: '1px dotted burlywood',
      padding: '2px',
      borderRadius: '4px,',
      margin: '2px',
    }}>
      <div>
        {typeof setReplacement !== "function"
          ?
          <span className="aio-replaceText">{oldText !== "" ? fromHtml(oldText) : <em>Nothing</em>}</span>
          :
          <input
            className="aio-input"
            type="text"
            value={fromHtml(oldText) ?? ""}
            onChange={(e) => { returnData({ oldText: toHtml(e.currentTarget.value) }) }}
            style={{ minWidth: 0, width: "170px" }}
          />
        }
      {!dontAskOptions &&
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <label><small>Repeat following lines</small></label>
          <input
            disabled={typeof setReplacement !== 'function'}
            style={{ margin: "6px" }}
            type='checkbox'
            checked={includeTrailing}
            onChange={e => returnData({includeTrailing:e.currentTarget.checked})}
            />
        </div>
      }
      </div>
      {typeof setReplacement === "function" && externalLists !== undefined && externalLists.length > 0 &&
        <div>
          <AioDropSelect
            value={externalName ?? "with..."}
            availableValues={availableListNames}
            setValue={(ret) => { returnData({ externalName: ret }); }}
          />
        </div>
      }
      <div>
        {externalLists?.some(e => e.givenName === externalName)
          ?
          <>
            {
              externalLists!.find(e => e.givenName === externalName)!.newTexts.map((e, i) =>
                <AioReplacementValuesDisplay
                  key={i}
                  texts={e.texts}
                  subLists={e.subLists}
                />
              )
            }
          </>
          :
          <>
            {newTexts.map((rv, i) =>
              <div key={rv.airid ?? i}>
                <AioReplacementValuesDisplay
                  key={rv.airid}
                  airid={rv.airid}
                  texts={rv.texts}
                  subLists={rv.subLists}
                  externalLists={externalLists}
                  dontAskOptions={dontAskOptions}
                  setReplacementValue={typeof setReplacement === "function"
                    ?
                    (ret) => {
                      let nts = [...newTexts];
                      nts.splice(i, 1, ret);
                      returnData({ newTexts: nts });
                    }
                    : undefined}
                />
                {typeof setReplacement === 'function' &&
                  <div className="aiox-button-holder" style={{ display: "flex", flexDirection: "row", alignContent: "center", marginLeft: '2.5rem', marginTop: '2px' }}>
                    {newTexts!.length > 1 && <AioIconButton iconName={"aiox-removeUp"} onClick={() => removeNewText(i)} tipText={"Add new text"} />}
                    <AioIconButton iconName={"aiox-addDown"} onClick={() => addNewText(i + 1)} tipText={"Remove new text"} />
                  </div>
                }
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
}