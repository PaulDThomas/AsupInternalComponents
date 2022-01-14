import { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { AsupInteralTable } from './components/ait/AsupInternalTable';

function App() {
  const [initialData, setInitialData] = useState({
    headerData: {
      rows: [
        [
          { text: "A", originalText: "A", colSpan: 1 },
          { text: "B", originalText: "B", colSpan: 3 },
        ],
        [
          { text: "C", originalText: "C", colSpan: 1 },
          { text: "E", originalText: "E", colSpan: 1 },
          { text: "D", originalText: "D", colSpan: 1 },
          { text: "F", originalText: "F", colSpan: 1 },
        ]
      ],
      options: []
    },
    bodyData: {
      rowGroups: [
        [
        ],
        [
          {
            rows: [
            ],
            options: []
          }
        ],
        [
          {
            rows: [
            ],
            options: []
          }
        ],
      ]
    }
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
