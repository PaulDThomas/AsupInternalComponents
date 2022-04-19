import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AioReplacement, AitRowGroupData, AitTableData, AsupInternalTable } from '../components';

export const TablePage = () => {

  const ta = useRef<HTMLTextAreaElement | null>(null);
  const [tableData, setTableData] = useState<AitTableData | undefined>();
  const [sampleGroupTemplates, setSampleGroupTempaltes] = useState<AitRowGroupData[] | undefined>();
  const [externalReplacements, setExternalReplacements] = useState<AioReplacement[]>([]);
  const [listStatus, setListStatus] = useState<string>("");

  /** Load defaults */
  useEffect(() => {
    /** Load row group templates */
    fetch(`${process.env.PUBLIC_URL}/data/groupTemplates.json`, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
    .then(function (response) { return response.json(); })
    .then(function (MyJson: AitRowGroupData[]) { setSampleGroupTempaltes(MyJson); });
    /** Load table data */
    fetch(`${process.env.PUBLIC_URL}/data/tableData.json`, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
    .then(function (response) { return response.json(); })
    .then(function (MyJson: AitTableData) { setTableData(MyJson); });
  }, []);

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

  const loadReplacements = useCallback(() => {
    try {
      const j: { name: string, list: AioReplacement }[] = JSON.parse(window.localStorage.getItem('listContent') ?? "[]");
      setExternalReplacements(j.map(j => j.list));
      setListStatus(`Loaded ${j.length} lists: ${j.map(rep => rep.list.givenName).join(', ')}`);
    }
    catch (e) {
      console.log("JSON parse from listContent failed");
      console.dir(e);
      setListStatus("Error loading external list data");
    }
  }, []);


  return (<>
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}>
      {tableData === undefined ?
      <span style={{margin:"3rem"}}>Table loading</span>
      :
      <AsupInternalTable
      tableData={tableData}
      setTableData={setTableData}
      style={{ margin: "1rem" }}
      showCellBorders={true}
      externalLists={externalReplacements}
      groupTemplates={sampleGroupTemplates}
      />
    }
    </div>
    <div style={{
      margin: "1rem",
      padding: "1rem",
      border: "solid black 3px",
      backgroundColor: "rgb(220, 220, 220)",
      borderRadius: "8px",
    }}>
      <button onClick={loadData}>Load</button>
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

      <button onClick={loadReplacements} style={{ marginLeft: "1rem", marginRight: "0.5rem" }}>Load lists</button>
      <span>{listStatus}</span>

      <pre>
        <textarea style={{ width: "98%", height: "200px" }} ref={ta} />
      </pre>
    </div>
  </>);
}
