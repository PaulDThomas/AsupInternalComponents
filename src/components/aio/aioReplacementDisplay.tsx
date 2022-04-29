import React, { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from "uuid";
import { fromHtml, toHtml } from '../functions';
import { AioDropSelect } from './aioDropSelect';
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
  dontShowText?: boolean,
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

  /**
   * Update the list
   * @param string value that will be split by new line into repeats
   */
  return (
    <div className="aiord-main" style={{
      display: 'flex',
      flexDirection: "column",
      gap: '0.5rem',
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
      </div>
      {externalLists !== undefined && externalLists.length > 0 &&
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
              externalLists!.find(e => e.givenName === externalName)!.subLists.map((e, i) =>
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
              <AioReplacementValuesDisplay
                key={rv.airid}
                airid={rv.airid}
                texts={rv.texts}
                subLists={rv.subLists}
                externalLists={externalLists}
                setReplacementValue={(ret) => {
                  let nts = [...newTexts];
                  nts.splice(i, 1, ret);
                  returnData({ newTexts: nts });
                }}
              />
            )}
          </>
        }
      </div>
    </div>
  );

  // {
  //   externalName === undefined
  //     ?
  //     <div>
  //       {typeof setReplacement === "function"
  //         ?
  //         <textarea
  //           className={"aio-input"}
  //           rows={4}
  //           value={text.map(t => fromHtml(t)).join("\n")}
  //           onChange={e => { returnData({ newText: e.currentTarget.value.split("\n").map(t => toHtml(t)) }); }}
  //           style={{ width: "168px", minWidth: "168px" }}
  //         />
  //         :
  //         <div style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>
  //           {text.map((t, i) =>
  //             <div key={i} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>
  //               {fromHtml(t)}
  //             </div>
  //           )}
  //         </div>
  //       }
  //     </div>
  //     :
  //     <>
  //       {externalLists?.find(e => e.givenName === externalName) !== undefined
  //         ?
  //         <div style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>
  //           {externalLists.find(e => e.givenName === externalName)!.newTexts.map((t, i) =>
  //             <div key={i} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>
  //               {fromHtml(t)}
  //             </div>
  //           )}
  //         </div>
  //         :
  //         <span><em>WARNING: List missing</em></span>
  //       }
  //     </>
  // }
  // {
  //   !dontShowText && !dontAskOptions &&
  //     <>
  //       <div style={{ display: "flex", justifyContent: "flex-end" }}>
  //         <label><small>Space after repeat</small></label>
  //         <input
  //           style={{ margin: "6px" }}
  //           type='checkbox'
  //           checked={spaceAfter}
  //           onChange={(e) => returnData({ spaceAfter: e.currentTarget.checked })} />
  //       </div>
  //       <div style={{ display: "flex", justifyContent: "flex-end" }}>
  //         <label><small>Include following rows</small></label>
  //         <input
  //           style={{ margin: "6px" }}
  //           type='checkbox'
  //           checked={includeTrailing}
  //           onChange={(e) => returnData({ includeTrailing: e.currentTarget.checked })} />
  //       </div>
  //     </>
  // }
  //     </div >
  //     <div style={{ display: "flex", flexDirection: "column" }}>
  //       <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderBottom: "1px burlywood solid", borderBottomRightRadius: "4px", }} />
  //       <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderTop: "1px burlywood solid", borderTopRightRadius: "4px", }} />
  //     </div>
  //     <div style={{ minWidth: "5px", width: "5px", marginTop: "6px", marginBottom: "6px", borderLeft: "1px burlywood solid", borderTop: "1px burlywood solid", borderBottom: "1px burlywood solid", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", }} />

  //     <div className="aiord-sub-lists" style={{ marginLeft: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
  //       <AioReplacementList
  //         replacements={subLists ?? []}
  //         setReplacements={typeof setReplacement === "function" ? (ret) => returnData({ subLists: ret }) : undefined}
  //         dontAskOptions={dontAskOptions}
  //         externalLists={externalLists}
  //       />
  //     </div>

}