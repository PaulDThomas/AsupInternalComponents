import { fromHtml, toHtml } from '../functions';
import React, { useCallback, useState } from 'react';
import { AioExternalReplacements, AioReplacement, AioReplacementValues } from './aioInterface';
import { AioReplacementList } from './aioReplacementList';

interface AioReplacementValuesDisplayProps {
  airid?: string,
  texts?: string[],
  spaceAfter?: boolean,
  subLists?: AioReplacement[],
  setReplacementValue?: (ret: AioReplacementValues) => void,
  dontAskOptions?: boolean,
  externalLists?: AioExternalReplacements[],
}

export const AioReplacementValuesDisplay = ({
  airid,
  texts,
  spaceAfter,
  subLists,
  setReplacementValue,
  dontAskOptions,
  externalLists,
}: AioReplacementValuesDisplayProps): JSX.Element => {

  const returnData = useCallback((newRV: {
    externalName?: string,
    texts?: string[],
    spaceAfter?: boolean,
    subLists?: AioReplacement[],
  }) => {
    if (typeof setReplacementValue !== "function") return;
    let r: AioReplacementValues = {
      airid: airid,
      spaceAfter: newRV.spaceAfter ?? spaceAfter,
      texts: newRV.texts ?? texts ?? [],
      subLists: newRV.subLists ?? subLists,
    }
    setReplacementValue(r);
  }, [airid, setReplacementValue, spaceAfter, subLists, texts]);

  const [text, setText] = useState<string>(texts?.map(t => fromHtml(t)).join("\n") ?? "");

  return (
    <div className="aiordv-main"
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{
        marginRight: '4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2px',
      }}>
        {typeof setReplacementValue === "function"
          ?
          <>
            <textarea
              className={"aio-input"}
              rows={4}
              value={text}
              onChange={e => setText(e.currentTarget.value)}
              onBlur={() => returnData({ texts: text.split("\n").map(t => toHtml(t)) })}
              style={{ width: "170px", minWidth: "170px" }}
            />
            {!dontAskOptions &&
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <label><small>Space after repeat</small></label>
                <input
                  style={{ margin: "6px" }}
                  type='checkbox'
                  checked={spaceAfter}
                  onChange={(e) => returnData({ spaceAfter: e.currentTarget.checked })} />
              </div>
            }
          </>
          :
          <>
            <div className="aio-input" style={{ border: "1px black solid", borderRadius: "2px", padding: "2px" }}>
              {texts !== undefined && texts.map((t, i) =>
                <div key={i} style={{ lineHeight: "1.1", fontSize: "75%", fontStyle: "italic" }}>
                  {fromHtml(t)}
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label><small>Space after repeat</small></label>
              <input
                disabled
                style={{ margin: "6px" }}
                type='checkbox'
                checked={spaceAfter}
              />
            </div>
          </>
        }
      </div>
      {(typeof setReplacementValue === "function" || (subLists?.length ?? 0) > 0)
        ?
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderBottom: "1px burlywood solid", borderBottomRightRadius: "4px", }} />
            <div style={{ flexGrow: 1, minWidth: "5px", width: "5px", borderTop: "1px burlywood solid", borderTopRightRadius: "4px", }} />
          </div>
          <div style={{ minWidth: "5px", width: "5px", marginTop: "6px", marginBottom: "6px", borderLeft: "1px burlywood solid", borderTop: "1px burlywood solid", borderBottom: "1px burlywood solid", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", }} />
          <AioReplacementList
            replacements={subLists}
            setReplacements={typeof setReplacementValue === "function" ? (ret) => returnData({ subLists: ret }) : undefined}
            dontAskOptions={typeof setReplacementValue === "function" ? dontAskOptions : true}
            externalLists={externalLists}
          />
        </>
        :
        <></>
      }
    </div>
  );
}