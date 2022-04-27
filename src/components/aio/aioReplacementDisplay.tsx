import React, { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from "uuid";
import { fromHtml, toHtml } from '../functions';
import { AioDropSelect } from './aioDropSelect';
import { AioReplacement } from './aioInterface';
import { AioReplacementList } from './aioReplacementList';

interface AioReplacmentDisplayProps {
  airid?: string,
  oldText: string,
  newText: string[],
  subLists?: AioReplacement[],
  spaceAfter?: boolean,
  includeTrailing?: boolean,
  givenName?: string,
  externalName?: string,
  setReplacement?: (ret: AioReplacement) => void,
  externalLists?: AioReplacement[],
  dontAskOptions?: boolean,
  dontShowText?: boolean,
}

/**
 * Render an individuial AioReplacement
 * @param props value/setValue pair
 */
export const AioReplacementDisplay = ({
  airid,
  oldText,
  newText,
  subLists,
  spaceAfter,
  includeTrailing,
  givenName,
  externalName,
  setReplacement,
  externalLists,
  dontAskOptions,
  dontShowText
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
    newText?: string[],
    subLists?: AioReplacement[],
    spaceAfter?: boolean,
    includeTrailing?: boolean,
    externalName?: string,
  }) => {
    if (typeof (setReplacement) !== "function") return;
    // Create new object
    let r: AioReplacement = {
      airid: newReplacement.airid ?? airid ?? uuidv4(),
      oldText: newReplacement.oldText ?? oldText,
      newText: newReplacement.newText ?? newText,
      subLists: newReplacement.subLists ?? subLists,
      spaceAfter: newReplacement.spaceAfter ?? spaceAfter,
      includeTrailing: newReplacement.includeTrailing ?? includeTrailing,
      externalName: newReplacement.externalName ?? externalName,
      givenName: givenName,
    }
    // Remove default
    if (r.externalName === "with...") delete (r.externalName);
    // Update existing object
    setReplacement(r);
  }, [setReplacement, airid, oldText, newText, subLists, spaceAfter, includeTrailing, externalName, givenName]);

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div className="aiord-outer"
      style={{
        display: 'flex',
        flexDirection: "row",
      }}
    >
      <div className="aiord-main" style={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
      }}>
        {/* Replacement text */}
        {!dontShowText &&
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
            <div>
              <AioDropSelect
                value={externalName ?? "with..."}
                availableValues={availableListNames}
                setValue={(ret) => { returnData({ externalName: ret }); }}
              />
            </div>
          </div>
        }

        {/* Replacement Values */}
        {externalName === undefined
          ?
          <div>
            {typeof setReplacement === "function"
              ?
              <textarea
                className={"aio-input"}
                rows={4}
                value={newText.map(t => fromHtml(t)).join("\n")}
                onChange={e => { returnData({ newText: e.currentTarget.value.split("\n").map(t => toHtml(t)) }); }}
                style={{ width: "168px", minWidth: "168px" }}
              />
              :
              <div style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>
                {newText.map((t, i) =>
                  <div key={i} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>
                    {fromHtml(t)}
                  </div>
                )}
              </div>
            }
          </div>
          :
          <>
            {externalLists?.find(e => e.givenName === externalName) !== undefined
              ?
              <div style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>
                {externalLists.find(e => e.givenName === externalName)!.newText.map((t, i) =>
                  <div key={i} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>
                    {fromHtml(t)}
                  </div>
                )}
              </div>
              :
              <span><em>WARNING: List missing</em></span>
            }
          </>
        }
        {!dontShowText && !dontAskOptions &&
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label><small>Space after repeat</small></label>
              <input
                style={{ margin: "6px" }}
                type='checkbox'
                checked={spaceAfter}
                onChange={(e) => returnData({ spaceAfter: e.currentTarget.checked })} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label><small>Include following rows</small></label>
              <input
                style={{ margin: "6px" }}
                type='checkbox'
                checked={includeTrailing}
                onChange={(e) => returnData({ includeTrailing: e.currentTarget.checked })} />
            </div>
          </>
        }
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderBottom: "1px burlywood solid", borderBottomRightRadius: "4px", }} />
        <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderTop: "1px burlywood solid", borderTopRightRadius: "4px", }} />
      </div>
      <div style={{ minWidth: "5px", width: "5px", marginTop: "6px", marginBottom: "6px", borderLeft: "1px burlywood solid", borderTop: "1px burlywood solid", borderBottom: "1px burlywood solid", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", }} />

      <div className="aiord-sub-lists" style={{ marginLeft: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <AioReplacementList
          replacements={subLists ?? []}
          setReplacements={typeof setReplacement === "function" ? (ret) => returnData({ subLists: ret }) : undefined}
          dontAskOptions={dontAskOptions}
          externalLists={externalLists}
        />
      </div>
    </div>
  );
}