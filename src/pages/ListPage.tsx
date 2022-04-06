import { AioReplacement, AioReplacementTable } from 'components';
import { AioString } from 'components/aio/aioString';
import React, { useCallback, useRef, useState } from 'react';

interface NamedList {
  name: string,
  list: AioReplacement,
};

export const ListPage = (): JSX.Element => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [li, setLi] = useState<NamedList[]>([]);
  const [currentL, setCurrentL] = useState<number>(-1);

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('listContent') ?? "";
      }
      if (ta.current) {
        const j = JSON.parse(ta.current.value?.toString() ?? "[]");
        setLi(j);
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
          {li.map((l, i) =>
            <div key={i}>
              <span onFocus={e => { setCurrentL(i); }}>
                <AioString
                  value={li[i].name}
                  setValue={(ret) => {
                    let newL: NamedList = { ...li[i], name: ret };
                    newL.list.givenName = ret;
                    let newLi = [...li];
                    newLi.splice(i, 1, newL);
                    setLi(newLi);
                  }}
                />
              </span>
              <div
                className='aiox-button aiox-minus'
                onClick={e => {
                  let newLi = [...li];
                  newLi.splice(i, 1);
                  setLi(newLi);
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
            let newL: NamedList = { name: "New list", list: { replacementTexts: [{ text: "", spaceAfter: false }], replacementValues: [{ newText: "" }] } };
            let newLi = [...li];
            newLi.push(newL);
            setLi(newLi);
            setCurrentL(newLi.length - 1)
          }}
        />

      </div>
      <div style={{ width: "70%" }}>
        <h4>List values</h4>
        <div>
          {currentL >= 0 &&
            <AioReplacementTable
              replacement={li[currentL].list}
              setReplacement={ret => {
                let newL: NamedList = { ...li[currentL], list: ret };
                let newLi = [...li];
                newLi.splice(currentL, 1, newL);
                setLi(newLi);
              }}
              dontShowText={true}
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
          ta.current.value = JSON.stringify(li, null, 2);
          // Save string
          window.localStorage.setItem('listContent', JSON.stringify(li));
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
