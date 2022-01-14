import { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { AsupInteralTable } from './components/ait/AsupInternalTable';

function App() {
  const [initialData, setInitialData] = useState({
    headerData: {
      rows: [
        {
          cells: [
            { text: "A", originalText: "A" },
            { text: "B", originalText: "B", colSpan: 3 },
          ],
        },
        {
          cells: [
            { text: "C", originalText: "C" },
            { text: "E", originalText: "E" },
            { text: "D", originalText: "D" },
            { text: "F", originalText: "F" },
          ]
        }
      ],
      options: []
    },
    bodyData: {
      rowGroups: [
        {
          rows: [
            {
              cells: [
                { text: "C0", originalText: "C0", rowSpan: 2 },
                { text: "D0", originalText: "D0" },
                { text: "E0", originalText: "E0" },
                { text: "F0", originalText: "F0" },
              ]
            },
            {
              cells: [
                { text: "D1", originalText: "D1" },
                { text: "E1", originalText: "E1" },
                { text: "F1", originalText: "F1" },
              ],
              options: []
            },
          ],
          options: []
        },
        {
          rows: [
            {
              cells: [
                { text: "C2", originalText: "C2" },
                { text: "D2", originalText: "D2" },
                { text: "E2", originalText: "E2" },
                { text: "F2", originalText: "F2" },
              ]
            }
          ],
          options: []
        }
      ]
    },
    footerData: {}
  });

  const [currentData, setCurrentData] = useState({});

  return (
    <>
      <AsupInteralTable
        initialData={initialData}
        returnData={setCurrentData}
        addStyle={{ margin: "1rem" }}
      />
      <div style={{
        margin: "1rem",
        padding: "1rem",
        border: "solid black 3px",
        backgroundColor: "rgb(0, 43, 54)"
      }}>
        <JSONTree data={currentData} />
      </div>
    </>
  );
}

export default App;
