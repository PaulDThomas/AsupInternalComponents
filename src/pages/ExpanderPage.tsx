import * as React from 'react';
import { useRef, useState } from 'react';
import { AioDropSelect, AioExpander } from '../components';

export const ExpanderPage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [showBorders, setShowBorders] = useState(false);
  const [currentData, setCurrentData] = useState({
    someText: "Hello",
    options: [
      { optionName: "tableType", label: "Type of table", value: "AmazeBalls" }
    ],
    stringList: [
      "This",
      "is",
      "is",
      "a",
      "string list"
    ],
    mixedList: [
      23,
      null,
      "mixed list",
      undefined,
      3.1416,
      0,
      [1, 2, 3],
      0,
      -34,
      "0"
    ],


    headerData: {
      rows: [
        {
          cells: [
            {
              text: "A", rowSpan: 2, options: [
                { optionName: "cellWidth", value: "150px" }
              ]
            },
            { text: "B", colSpan: 3 },
          ],
          options: [
            { optionName: "headerRow1", value: "this is the header row option" }
          ]
        },
        {
          cells: [
            { text: "C", },
            { text: "E", },
            { text: "D", },
          ],
          options: [
            { optionName: "headerRow2", value: "2nd row option" }
          ]
        }
      ],
      options: [
        { optionName: "header1", value: "this is the header row" }
      ]
    },
    bodyData: {
      rowGroups: [
        {
          rows: [
            {
              cells: [
                {
                  text: "C0", rowSpan: 2, options: [
                    { noptionNameme: "cellType", value: "rowHeader" }
                  ]
                },
                { text: "D0", },
                { text: "E0", },
                { text: "F0", },
              ],
              options: [
                { optionName: "a value" }
              ]
            },
            {
              cells: [
                { text: "D1", },
                { text: "E1", },
                { text: "F1", },
              ],
              options: [
                { optionName: "rowOptionA", value: "another value" }
              ]
            },
          ],
          options: [
            { optionName: "rowGroupOption1", value: "first group" }
          ]
        },
        {
          rows: [
            {
              cells: [
                {
                  text: "C2",
                  options: [
                    { optionName: "cellType", value: "rowHeader" }
                  ]
                },
                { text: "D2", },
                { text: "E2", },
                { text: "F2", },
              ],
              options: [
                { optionName: "rowOptionA", value: "first row in this group" }
              ]
            }
          ],
          options: [
            { optionName: "rowGroupOption1", value: "second group" }
          ]
        }
      ]
    },
  });
  const [dropValue, setDropValue] = useState<string>("Nowt");


  return (
    <>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "left",
        margin: "2rem",
      }}>
        <AioExpander
          inputObject={currentData}
          updateObject={(ret) => { setCurrentData(ret); }}
          showBorders={showBorders}
          canAddItems={true}
          canRemoveItems={true}
          canMoveItems={true}
        />

      </div>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "left",
        margin: "2rem",
      }}>
        <AioDropSelect
          value={dropValue}
          setValue={setDropValue}
          availableValues={["Nowt", "Summat", "Owt", "Reyt"]}
        />

      </div>
      <div style={{
        margin: "1rem",
        padding: "1rem",
        border: "solid black 3px",
        backgroundColor: "rgb(240, 240, 240)"
      }}>
        <label>
          Show borders
          <input
            name="showWindowCheck"
            type="checkbox"
            checked={showBorders}
            onChange={(e) => { setShowBorders(e.target.checked); }}
          />
        </label>
        <button
          onClick={() => {
            try {
              if (ta.current && ta.current.value === "") {
                ta.current.value = window.localStorage.getItem('expanderContent') ?? "";
              }
              const j = JSON.parse(ta.current!.value ?? "[]");
              setCurrentData(j);
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
            ta.current!.value = JSON.stringify(currentData, null, 2);
            window.localStorage.setItem('expanderContent', ta.current!.value);
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
