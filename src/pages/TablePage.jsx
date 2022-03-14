import { useCallback, useRef, useState } from 'react';
import { AsupInteralTable } from '../components/ait/AsupInternalTable';

export const TablePage = () => {

  const ta = useRef();
  const [initialData, setInitialData] = useState({
    options: [
      { optionName: "tableType", label: "Type of table", value: "AmazeBalls" }
    ],
    headerData: {
      rows: [
        {
          cells: [
            {
              text: "A", originalText: "A", options: [
                { optionName: "cellWidth", value: "150px" },
                { optionName: "rowSpan", value: 2 }
              ]
            },
            {
              text: "B", originalText: "B", options: [
                { optionName: "colSpan", value: 3 }
              ]
            },
          ],
          options: [
            { optionName: "headerRow1", value: "this is the header row option" },
          ]
        },
        {
          cells: [
            { text: "C", originalText: "C" },
            { text: "E", originalText: "E" },
            { text: "D", originalText: "D" },
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
                  text: "C0", originalText: "C0", options: [
                    { optionName: "cellType", value: "rowHeader" },
                    { optionName: "rowSpan", value: 2 }
                  ]
                },
                { text: "D0", originalText: "D0" },
                { text: "E0", originalText: "E0" },
                { text: "F0", originalText: "F0" },
              ],
              options: [
                { optionName: "rowOptionA", value: "a value" }
              ]
            },
            {
              cells: [
                { text: "D1", originalText: "D1" },
                { text: "E1", originalText: "E1" },
                { text: "F1", originalText: "F1" },
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
                  text: "C2", originalText: "C2",
                  options: [
                    { optionName: "cellType", value: "rowHeader" }
                  ]
                },
                { text: "D2", originalText: "D2" },
                { text: "E2", originalText: "E2" },
                { text: "F2", originalText: "F2" },
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

  //
  // Mimic external updates here 
  //
  const updateCell = useCallback((cell) => {
    cell.originalText = cell.text;
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
    table.bodyData.rowGroups = table.bodyData.rowGroups.map((rowGroup) => updateRowGroup(rowGroup));
    return table;
  }, [updateRowGroup]);
  const loadData = useCallback(() => {
    try {
      if (ta.current.value === "") {
        ta.current.value = window.localStorage.getItem('tableContent');
      }
      const j = updateTable(JSON.parse(ta.current.value));
      ta.current.value = JSON.stringify(j, null, 2);
      setInitialData(j);
    }
    catch (e) {
      console.log("JSON parse failed");
      console.dir(e);
    }
  }, [updateTable]);


  return (
  <>
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}>
      <AsupInteralTable
        tableData={initialData}
        setTableData={setInitialData}
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
          ta.current.value = JSON.stringify(initialData, null, 2);
          // Save string
          window.localStorage.setItem('tableContent', JSON.stringify(initialData));
        }}
      >
        Save
      </button>
      <pre>
        <textarea lines={6} ref={ta} style={{ width: "98%", height: "200px" }} />
      </pre>
    </div>
  </>
);
}
