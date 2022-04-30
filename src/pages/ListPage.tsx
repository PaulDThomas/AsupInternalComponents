import { AioExternalReplacements } from 'components/aio/aioInterface';
import { newReplacementValues } from 'components/functions';
import { newExternalReplacements } from 'components/functions/newExternalReplacements';
import React, { useCallback, useRef, useState } from 'react';
import { AioReplacementValuesDisplay, AioString } from '../components';
import { updateReplToExtl } from './updateReplacementVersion';

export const ListPage = (): JSX.Element => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [lists, setLists] = useState<AioExternalReplacements[]>([]);
  const [currentL, setCurrentL] = useState<number>(-1);

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('listContent') ?? "";
      }
      if (ta.current) {
        const j:any = JSON.parse(ta.current.value?.toString() ?? "[]");
        setLists(updateReplToExtl(j));
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
      justifyContent: "center",
    }}>

      <div style={{ width: "30%" }}>
        <h4>Available lists</h4>
        <div>
          {lists.map((l, i) =>
            <div key={i}>
              <span onFocus={e => { setCurrentL(i); }}>
                <AioString
                  value={lists[i].givenName}
                  setValue={(ret) => {
                    let newEx: AioExternalReplacements = { ...lists[i], givenName: ret };
                    let newL = [...lists];
                    newL.splice(i, 1, newEx);
                    setLists(newL);
                  }}
                />
              </span>
              <div
                className='aiox-button aiox-minus'
                onClick={e => {
                  let newLi = [...lists];
                  newLi.splice(i, 1);
                  setLists(newLi);
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
            let newRepls = [...lists];
            newRepls.push(newExternalReplacements());
            setLists(newRepls);
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
                gap: '0.5rem'
              }}

            >
              {
                lists[currentL].newTexts.map((e, i) =>
                  <div key={i}                  >
                    <AioReplacementValuesDisplay
                      airid={e.airid}
                      texts={e.texts}
                      subLists={e.subLists}
                      spaceAfter={e.spaceAfter}
                      setReplacementValue={ret => {
                        let newRepls = [...lists];
                        newRepls[currentL].newTexts.splice(i, 1, ret);
                        setLists(newRepls);
                      }}
                    />
                    <div className="aiox-button-holder" style={{ display: "flex", flexDirection: "row", alignContent: "center" }}>
                      {lists!.length >= 1 && <div className={"aiox-button aiox-removeUp"} onClick={() => {
                        let newRepls = [...lists];
                        newRepls[currentL].newTexts.splice(i, 1);
                        setLists(newRepls);
                      }} />}
                      <div className={"aiox-button aiox-addDown"} onClick={() => {
                        let newRepls = [...lists];
                        newRepls[currentL].newTexts.splice(i+1, 0, newReplacementValues());
                        setLists(newRepls);
                      }} />
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
          ta.current.value = JSON.stringify(lists, null, 2);
          // Save string
          window.localStorage.setItem('listContent', JSON.stringify(lists));
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
