import { AitTableData } from 'components';
import React, { useCallback, useRef, useState } from 'react';
import { AsupInternalTable } from '../components/ait/AsupInternalTable';

export const TablePage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [tableData, setTableData] = useState<AitTableData>({
    rowHeaderColumns: 1,
    noRepeatProcessing: false,
    headerData: {
      replacements: [],
      rows: [
        {
          cells: [
            { text: "A" },
            { text: "B" },
            { text: "C" },
            { text: "D" },
          ],
        },
        {
          aitid: "H1",
          cells: [
            { text: "E1" },
            { text: "F1" },
            { text: "G1" },
            { text: "H1" },
          ],
        },
      ]
    },
    bodyData: [
      {
        rows: [
          {
            cells: [
              { text: "E1" },
              { text: "F1" },
              { text: "G1" },
              { text: "H1" },
            ],
          },
          {
            cells: [
              { text: "E2" },
              { text: "F3" },
              { text: "G4" },
              { text: "H5" },
            ],
          },
        ],
        replacements: [],
      },
    ]
  });

  const loadData = useCallback(() => {
    try {
      if (ta.current && ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('tableContent') ?? "";
      }
      if (ta.current) {
        const j = JSON.parse(ta.current!.value?.toString() ?? "{}");
        setTableData(j);
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
      display: "flex",
      justifyContent: "center",
    }}>
      <AsupInternalTable
        tableData={tableData}
        setTableData={setTableData}
        style={{ margin: "1rem" }}
        showCellBorders={true}
      />
    </div>
    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px",
      backgroundColor: "rgb(240, 240, 240)"
    }}>
      <button
        onClick={loadData}>
        Load
      </button>
      <button
        onClick={() => {
          if (!ta.current) return;
          // Show intended data
          ta.current.value = JSON.stringify(tableData, null, 2);
          // Save string
          window.localStorage.setItem('tableContent', JSON.stringify(tableData));
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
