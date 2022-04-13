import { AsupInternalBlock } from 'components/aif';
import { AifBlockLine } from 'components/aif/aifInterface';
import * as React from 'react';
import { useRef, useState } from 'react';

export const BlockPage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [lines, setLines] = useState<AifBlockLine[]>([{left:"One line"}]);


  return (
    <>
      <div style={{
        width: "calc(vw - 4rem)",
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <AsupInternalBlock
          lines={lines}
          setLines={setLines}
          maxLines={10}
          styleMap={
            {
              Optional: { css: { color: "green", }, aieExclude: ["Notes"] },
              Notes: { css: { color: "blue", }, aieExclude: ["Optional"] },
            } 
          }
        />
      </div>

      <div style={{
        margin: "1rem",
        padding: "1rem",
        border: "solid black 3px",
        backgroundColor: "rgb(240, 240, 240)"
      }}>
        <button
          onClick={() => {
            try {
              if (ta.current && ta.current.value === "") {
                ta.current.value = window.localStorage.getItem('blockContent') ?? "";
              }
              const j = JSON.parse(ta.current!.value ?? "[]");
              setLines(j);
            }
            catch (e) {
              console.log("JSON parse failed");
              console.dir(e);
            }
          }}
        >
          Load
        </button>
        <button
          onClick={() => {
            ta.current!.value = JSON.stringify(lines, null, 2);
            window.localStorage.setItem('blockContent', ta.current!.value);
          }}
        >
          Save
        </button>
        <pre>
          <textarea ref={ta} style={{ width: "98%", height: "200px" }} rows={6} />
        </pre>
      </div>
    </>
  );
}
