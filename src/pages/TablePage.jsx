import { useRef, useState } from 'react';
import { AsupInteralTable } from '../components/ait/AsupInternalTable';

export const TablePage = () => {

  const ta = useRef();
  const [initialData, setInitialData] = useState({
    options: [
      { name: "tableType", label: "Type of table", value: "AmazeBalls" }
    ],
    headerData: {
      rows: [
        {
          cells: [
            {
              text: "A", originalText: "A", rowSpan: 2, options: [
                { name: "cellWidth", value: "150px" }
              ]
            },
            { text: "B", originalText: "B", colSpan: 3 },
          ],
          options: [
            { name: "headerRow1", value: "this is the header row option" }
          ]
        },
        {
          cells: [
            { text: "C", originalText: "C" },
            { text: "E", originalText: "E" },
            { text: "D", originalText: "D" },
          ],
          options: [
            { name: "headerRow2", value: "2nd row option" }
          ]
        }
      ],
      options: [
        { name: "header1", value: "this is the header row" }
      ]
    },
    bodyData: {
      rowGroups: [
        {
          rows: [
            {
              cells: [
                {
                  text: "C0", originalText: "C0", rowSpan: 2, options: [
                    { name: "cellType", value: "rowHeader" }
                  ]
                },
                { text: "D0", originalText: "D0" },
                { text: "E0", originalText: "E0" },
                { text: "F0", originalText: "F0" },
              ],
              options: [
                { name: "rowOptionA", value: "a value" }
              ]
            },
            {
              cells: [
                { text: "D1", originalText: "D1" },
                { text: "E1", originalText: "E1" },
                { text: "F1", originalText: "F1" },
              ],
              options: [
                { name: "rowOptionA", value: "another value" }
              ]
            },
          ],
          options: [
            { name: "rowGroupOption1", value: "first group" }
          ]
        },
        {
          rows: [
            {
              cells: [
                {
                  text: "C2", originalText: "C2",
                  options: [
                    { name: "cellType", value: "rowHeader" }
                  ]
                },
                { text: "D2", originalText: "D2" },
                { text: "E2", originalText: "E2" },
                { text: "F2", originalText: "F2" },
              ],
              options: [
                { name: "rowOptionA", value: "first row in this group" }
              ]
            }
          ],
          options: [
            { name: "rowGroupOption1", value: "second group" }
          ]
        }
      ]
    },
  });

  const [currentData, setCurrentData] = useState({});

  const updateCell = (cell) => {
    cell.originalText = cell.text;
    return cell;
  };
  const updateRow = (row) => {
    row.cells = row.cells.map((cell) => updateCell(cell));
    return row;
  };
  const updateRowGroup = (rowGroup) => {
    rowGroup.rows = rowGroup.rows.map((row) => updateRow(row));
    return rowGroup;
  };
  const updateTable = (table) => {
    table.headerData = updateRowGroup(table.headerData);
    table.bodyData.rowGroups = table.bodyData.rowGroups.map((rowGroup) => updateRowGroup(rowGroup));
    //table.footerData = updateRowGroup(table.footerData);
    return table;
  }

  return (
    <>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
        <AsupInteralTable
          initialData={initialData}
          returnData={setCurrentData}
          addStyle={{ margin: "1rem" }}
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
          onClick={() => {
            try {
              if (ta.current.value === "") {
                ta.current.value = window.localStorage.getItem('tableContent');
              }
              const j = JSON.parse(ta.current.value);
              setInitialData(j);
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
            const saved = updateTable(currentData);
            ta.current.value = JSON.stringify(saved, null, 2);
            window.localStorage.setItem('tableContent', JSON.stringify(saved, null, 2));
            setInitialData(saved);
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
