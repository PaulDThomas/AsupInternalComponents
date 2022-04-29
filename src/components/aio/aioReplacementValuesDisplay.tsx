import { fromHtml, toHtml } from 'components/functions';
import React, { useCallback } from 'react';
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
      }}>
        <textarea
          className={"aio-input"}
          rows={4}
          value={texts?.map(t => fromHtml(t)).join("\n") ?? ""}
          onChange={e => { returnData({ texts: e.currentTarget.value.split("\n").map(t => toHtml(t)) }); }}
          style={{ width: "168px", minWidth: "168px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <label><small>Space after repeat</small></label>
          <input
            style={{ margin: "6px" }}
            type='checkbox'
            checked={spaceAfter}
            onChange={(e) => returnData({ spaceAfter: e.currentTarget.checked })} />
        </div>
      </div>
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
    </div>
  );
}