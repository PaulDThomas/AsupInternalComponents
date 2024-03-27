import React, { useEffect, useRef, useState } from "react";
import { AioDropSelect, AioExpander } from "../components";

export const ExpanderPage = () => {
  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [showBorders, setShowBorders] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentData, setCurrentData] = useState<any>();
  const [dropValue, setDropValue] = useState<string>("Nowt");

  /** Load defaults */
  useEffect(() => {
    /** Load table data as an example */
    fetch(`${process.env.PUBLIC_URL}/data/tableData.json`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (MyJson) {
        setCurrentData(MyJson);
      });
  }, []);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "left",
          margin: "2rem",
        }}
      >
        <AioExpander
          id="test-expander"
          inputObject={currentData}
          updateObject={(ret) => {
            setCurrentData(ret);
          }}
          showBorders={showBorders}
          canAddItems={true}
          canRemoveItems={true}
          canMoveItems={true}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "left",
          margin: "2rem",
        }}
      >
        <AioDropSelect
          id="test-drop-select"
          value={dropValue}
          setValue={setDropValue}
          availableValues={["Nowt", "Summat", "Owt", "Reyt"]}
        />
      </div>
      <div
        style={{
          margin: "1rem",
          padding: "1rem",
          border: "solid black 3px",
          backgroundColor: "rgb(240, 240, 240)",
        }}
      >
        <label>
          Show borders
          <input
            name="showWindowCheck"
            type="checkbox"
            checked={showBorders}
            onChange={(e) => {
              setShowBorders(e.target.checked);
            }}
          />
        </label>
        <button
          onClick={() => {
            try {
              if (!ta.current) return;
              if (ta.current.value === "") {
                ta.current.value = window.localStorage.getItem("expanderContent") ?? "";
              }
              const j = JSON.parse(ta.current.value ?? "[]");
              setCurrentData(j);
            } catch (e) {
              console.log("JSON parse failed");
              console.dir(e);
            }
          }}
        >
          Load
        </button>
        <button
          onClick={() => {
            if (!ta.current) return;
            ta.current.value = JSON.stringify(currentData, null, 2);
            window.localStorage.setItem("expanderContent", ta.current.value);
          }}
        >
          Save
        </button>
        <pre>
          <textarea
            ref={ta}
            style={{ width: "98%", height: "200px" }}
            rows={6}
          />
        </pre>
      </div>
    </>
  );
};
