import { AioSingleReplacements } from 'components/aio/AioSingleReplacements';
import React, { useRef, useState } from 'react';
import { AifBlockLine, AsupInternalBlock, AifLineType, AioExternalSingle } from '../components';

export const BlockPage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [lines, setLines] = useState<AifBlockLine[]>([{ left: "One line", canEdit: true }]);
  const [externalSingles, setExternalSingles] = useState<AioExternalSingle[]>([]);

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
          minLines={3}
          maxLines={10}
          externalSingles={externalSingles}
          style={{ fontFamily: "Courier New", fontWeight: 800 }}
          styleMap={{
            Green: { css: { color: "green", }, aieExclude: ["Blue", "Red"] },
            Blue: { css: { color: "blue", }, aieExclude: ["Green", "Red"] },
            Red: { css: { color: "red", }, aieExclude: ["Green", "Blue"] },
          }}
          defaultType={AifLineType.centreOnly}
        />
      </div>

      <div style={{ margin: "1rem" }}>
        <AioSingleReplacements
          replacements={externalSingles}
          setReplacements={(ret) => setExternalSingles(ret)}
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
              console.warn("JSON parse failed");
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
