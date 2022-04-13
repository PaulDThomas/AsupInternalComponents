import { AsupInternalBlock } from 'components/aif';
import { AifBlockLine } from 'components/aif/aifInterface';
import * as React from 'react';
import { useRef, useState } from 'react';

export const BlockPage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [lines, setLines] = useState<AifBlockLine[]>([{ left: "One line", canEdit: false }]);


  return (
    <>
      <div style={{
        width: "calc(vw - 4rem - 2px)",
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "white",
        border: "1px solid black",
        margin: "1rem",

      }}>
        <AsupInternalBlock
          lines={lines}
          setLines={setLines}
          minLines={4}
          maxLines={10}
          styleMap={{
            Optional: { css: { color: "green", }, aieExclude: ["Notes"] },
            Notes: { css: { color: "blue", }, aieExclude: ["Optional"] },
          }}
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
        <pre style={{ width: "100%" }}>
          <textarea ref={ta} style={{ width: "100%", height: "220px" }} rows={6} />
        </pre>
      </div>
    </>
  );
}
