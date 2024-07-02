import { IEditorV3, joinV3intoBlock, splitV3intoLines } from "@asup/editor-v3";
import { useCallback, useRef, useState } from "react";
import {
  AieStyleMap,
  AioExternalReplacements,
  AioReplacementDisplay,
  AioString,
  newExternalReplacements,
} from "../../../src/main";
import { convertExternalReplacements, EditorV3Wrapper, stringToV3 } from "../v3editor";

export const ListPage = (): JSX.Element => {
  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [extRepls, setExtRepls] = useState<AioExternalReplacements<IEditorV3>[]>([]);
  const [currentL, setCurrentL] = useState<number>(-1);
  const cellStyles: AieStyleMap = {
    Optional: { css: { color: "mediumseagreen" }, aieExclude: ["Notes"] },
    Notes: { css: { color: "royalblue" }, aieExclude: ["Optional"] },
  };

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem("listContent") ?? "";
      }
      if (ta.current) {
        const j: AioExternalReplacements<string | IEditorV3>[] = JSON.parse(
          ta.current.value?.toString() ?? "[]",
        );
        setExtRepls(j.map((i) => convertExternalReplacements(i)));
        ta.current.value = JSON.stringify(j, null, 2);
      }
    } catch (e) {
      console.warn("JSON parse failed");
      console.dir(e);
    }
  }, []);

  return (
    <>
      <div
        style={{
          width: "100%",
          margin: "1.5rem",
          display: "flex",
        }}
      >
        <div style={{ width: "30%" }}>
          <h4>Available lists</h4>
          <div>
            {extRepls.map((l, i) => (
              <div key={i}>
                <span
                  onFocus={() => {
                    setCurrentL(i);
                  }}
                >
                  <AioString
                    id="test-string"
                    value={extRepls[i].givenName}
                    setValue={(ret) => {
                      const newEx: AioExternalReplacements<IEditorV3> = {
                        ...extRepls[i],
                        givenName: ret,
                      };
                      const newL = [...extRepls];
                      newL.splice(i, 1, newEx);
                      setExtRepls(newL);
                    }}
                  />
                </span>
                <div
                  className="aiox-button aiox-minus"
                  onClick={() => {
                    const newLi = [...extRepls];
                    newLi.splice(i, 1);
                    setExtRepls(newLi);
                    setCurrentL(i - 1);
                  }}
                />
                {i === currentL && (
                  <div
                    style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      height: "1rem",
                      width: "1rem",
                      backgroundColor: "green",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Add list button */}
          <div
            className="aiox-button aiox-plus"
            onClick={() => {
              const newRepls = [...extRepls];
              newRepls.push(newExternalReplacements(stringToV3("")));
              setExtRepls(newRepls);
              setCurrentL(newRepls.length - 1);
            }}
          />
        </div>
        <div style={{ width: "70%" }}>
          <h4>List values</h4>
          <div>
            {currentL >= 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <AioReplacementDisplay
                  id="test-replacements"
                  noText={true}
                  oldText={""}
                  newTexts={extRepls[currentL].newTexts}
                  Editor={EditorV3Wrapper}
                  styleMap={cellStyles}
                  setReplacement={(ret) => {
                    const e: AioExternalReplacements<IEditorV3> = {
                      givenName: extRepls[currentL].givenName,
                      newTexts: ret.newTexts,
                    };
                    const newE = [...extRepls];
                    newE.splice(currentL, 1, e);
                    setExtRepls(newE);
                  }}
                  blankT={stringToV3("")}
                  joinTintoBlock={joinV3intoBlock}
                  splitTintoLines={splitV3intoLines}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          margin: "1rem",
          padding: "1rem",
          border: "solid black 3px",
          backgroundColor: "rgb(220, 220, 220)",
          borderRadius: "8px",
        }}
      >
        <button onClick={loadData}>Load</button>
        <button
          onClick={() => {
            if (!ta.current) return;
            // Show intended data
            ta.current.value = JSON.stringify(extRepls, null, 2);
            // Save string
            window.localStorage.setItem("listContent", JSON.stringify(extRepls));
          }}
        >
          Save
        </button>
        <span style={{ paddingLeft: "1rem" }}>(browser storage)</span>
        <pre>
          <textarea
            style={{ width: "98%", height: "200px" }}
            ref={ta}
          />
        </pre>
      </div>
    </>
  );
};
