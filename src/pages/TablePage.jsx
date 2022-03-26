import { useCallback, useRef, useState } from 'react';
import { AsupInteralTable } from '../components/ait/AsupInternalTable';

export const TablePage = () => {

  const ta = useRef();
  const [tableData, setTableData] = useState({
    headerData: {
      rows: [
        {
          cells: [
            { text: "A", options: [] },
            { text: "B", options: [] },
            { text: "C", options: [] },
            { text: "D", options: [] },
          ],
        },
      ],
      options: []
    },
    bodyData: [
      {
        rows: [
          {
            cells: [
              { text: "E1", options: [] },
              { text: "F1", options: [] },
              { text: "G1", options: [] },
              { text: "H1", options: [] },
            ],
          },
          {
            cells: [
              { text: "E2", options: [] },
              { text: "F3", options: [] },
              { text: "G4", options: [] },
              { text: "H5", options: [] },
            ],
          },
        ],
      },
    ]
  });

  //
  // Mimic external updates here 
  //
  const updateCell = useCallback((cell) => {
    return cell;
  }, []);
  const updateRow = useCallback((row) => {
    row.cells = row.cells.map((cell) => updateCell(cell));
    return row;
  }, [updateCell]);
  const updateRowGroup = useCallback((rowGroup) => {
    rowGroup.rows = rowGroup.rows.map((row) => updateRow(row));
    return rowGroup;
  }, [updateRow]);
  const updateTable = useCallback((table) => {
    table.headerData = updateRowGroup(table.headerData);
    table.bodyData = table.bodyData.map((rowGroup) => updateRowGroup(rowGroup));
    return table;
  }, [updateRowGroup]);
  const loadData = useCallback(() => {
    try {
      if (ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('tableContent');
      }
      const j = updateTable(JSON.parse(ta.current.value));
      ta.current.value = JSON.stringify(j, null, 2);
      setTableData(j);
    }
    catch (e) {
      console.log("JSON parse failed");
      console.dir(e);
    }
  }, [updateTable]);


  return (<>
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}>
      <AsupInteralTable
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
          // Show intented data
          ta.current.value = JSON.stringify(tableData, null, 2);
          // Save string
          window.localStorage.setItem('tableContent', JSON.stringify(tableData));
        }}
      >
        Save
      </button>
      <pre>
        <textarea lines={6} ref={ta} style={{ width: "98%", height: "200px" }} />
      </pre>
    </div>
  </>);
}
