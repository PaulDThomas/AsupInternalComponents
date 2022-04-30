import { AioExternalReplacements } from 'components/aio/aioInterface';
import { newReplacementValues } from 'components/functions';
import { newExternalReplacements } from 'components/functions/newExternalReplacements';
import React, { useCallback, useRef, useState } from 'react';
import { AioIconButton, AioReplacementValuesDisplay, AioString } from '../components';
import { updateReplToExtl } from './updateReplacementVersion';

export const ListPage = (): JSX.Element => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [newTexts, setNewTexts] = useState<AioExternalReplacements[]>([]);
  const [currentL, setCurrentL] = useState<number>(-1);

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('listContent') ?? "";
      }
      if (ta.current) {
        const j: any = JSON.parse(ta.current.value?.toString() ?? "[]");
        setNewTexts(updateReplToExtl(j));
        ta.current.value = JSON.stringify(j, null, 2);
      }
    }
    catch (e) {
      console.log("JSON parse failed");
      console.dir(e);
    }
  }, []);

  return (<>
    <div style={{
      width: "100%",
      margin: "1.5rem",
      display: "flex",
    }}>

      <div style={{ width: "30%" }}>
        <h4>Available lists</h4>
        <div>
          {newTexts.map((l, i) =>
            <div key={i}>
              <span onFocus={e => { setCurrentL(i); }}>
                <AioString
                  value={newTexts[i].givenName}
                  setValue={(ret) => {
                    let newEx: AioExternalReplacements = { ...newTexts[i], givenName: ret };
                    let newL = [...newTexts];
                    newL.splice(i, 1, newEx);
                    setNewTexts(newL);
                  }}
                />
              </span>
              <div
                className='aiox-button aiox-minus'
                onClick={e => {
                  let newLi = [...newTexts];
                  newLi.splice(i, 1);
                  setNewTexts(newLi);
                  setCurrentL(i - 1);
                }}
              />
              {i === currentL &&
                <div style={{ display: "inline-block", marginLeft: "0.5rem", height: "1rem", width: "1rem", backgroundColor: "green" }} />
              }
            </div>
          )}
        </div>
        {/* Add list button */}
        <div
          className='aiox-button aiox-plus'
          onClick={e => {
            let newRepls = [...newTexts];
            newRepls.push(newExternalReplacements());
            setNewTexts(newRepls);
            setCurrentL(newRepls.length - 1)
          }}
        />
      </div>
      <div style={{ width: "70%" }}>
        <h4>List values</h4>
        <div>
          {currentL >= 0 &&
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {
                newTexts[currentL].newTexts.map((e, i) =>
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px'}}>
                    <AioReplacementValuesDisplay
                      airid={e.airid}
                      texts={e.texts}
                      subLists={e.subLists}
                      spaceAfter={e.spaceAfter}
                      setReplacementValue={ret => {
                        let newRepls = [...newTexts];
                        newRepls[currentL].newTexts.splice(i, 1, ret);
                        setNewTexts(newRepls);
                      }}
                    />
                    <div className="aiox-button-holder" style={{ display: "flex", flexDirection: "row", alignContent: "center", marginLeft: '2.5rem', marginTop: '2px'  }}>
                      {newTexts!.length > 1 && <AioIconButton iconName={"aiox-minus"} onClick={() => {
                        let newRepls = [...newTexts];
                        newRepls[currentL].newTexts.splice(i, 1);
                        setNewTexts(newRepls);
                      }} tipText={"Add new text"} />}
                      <AioIconButton iconName={"aiox-plus"} onClick={() => {
                        let newRepls = [...newTexts];
                        newRepls[currentL].newTexts.splice(i + 1, 0, newReplacementValues());
                        setNewTexts(newRepls);
                      }} tipText={"Remove new text"} />
                    </div>
                  </div>
                )
              }
            </div>
          }
        </div>
      </div>
    </div>

    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px",
      backgroundColor: "rgb(220, 220, 220)",
      borderRadius: "8px",
    }}>
      <button onClick={loadData}>Load</button>
      <button
        onClick={() => {
          if (!ta.current) return;
          // Show intended data
          ta.current.value = JSON.stringify(newTexts, null, 2);
          // Save string
          window.localStorage.setItem('listContent', JSON.stringify(newTexts));
        }}
      >
        Save
      </button>
      <span style={{ paddingLeft: "1rem" }}>(browser storage)</span>
      <pre>
        <textarea style={{ width: "98%", height: "200px" }} ref={ta} />
      </pre>
    </div>
  </>);
}
