import { AioReplacement, AioReplacementDisplay, AioString } from '../components';
import React, { useCallback, useRef, useState } from 'react';

export const ListPage = (): JSX.Element => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [repls, setRepls] = useState<AioReplacement[]>([]);
  const [currentL, setCurrentL] = useState<number>(-1);

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('listContent') ?? "";
      }
      if (ta.current) {
        const j = JSON.parse(ta.current.value?.toString() ?? "[]");
        setRepls(j);
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
          {repls.map((l, i) =>
            <div key={i}>
              <span onFocus={e => { setCurrentL(i); }}>
                <AioString
                  value={repls[i].givenName}
                  setValue={(ret) => {
                    let newRepl: AioReplacement = { ...repls[i], givenName:ret};
                    let newRepls = [...repls];
                    newRepls.splice(i, 1, newRepl);
                    setRepls(newRepls);
                  }}
                />
              </span>
              <div
                className='aiox-button aiox-minus'
                onClick={e => {
                  let newLi = [...repls];
                  newLi.splice(i, 1);
                  setRepls(newLi);
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
            let newRepl: AioReplacement = { oldText: "", newText:[""] };
            let newRepls = [...repls];
            newRepls.push(newRepl);
            setRepls(newRepls);
            setCurrentL(newRepls.length - 1)
          }}
        />

      </div>
      <div style={{ width: "70%" }}>
        <h4>List values</h4>
        <div>
          {currentL >= 0 &&
            <AioReplacementDisplay
              airid={repls[currentL].airid}
              oldText={repls[currentL].oldText}
              newText={repls[currentL].newText}
              subLists={repls[currentL].subLists}
              spaceAfter={repls[currentL].spaceAfter}
              includeTrailing={repls[currentL].includeTrailing}
              givenName={repls[currentL].givenName}
              externalName={repls[currentL].externalName}
              setReplacement={ret => {
                let newRepls = [...repls];
                newRepls.splice(currentL, 1, ret);
                setRepls(newRepls);
              }}
              // dontShowText={true}
            />
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
          ta.current.value = JSON.stringify(repls, null, 2);
          // Save string
          window.localStorage.setItem('listContent', JSON.stringify(repls));
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
